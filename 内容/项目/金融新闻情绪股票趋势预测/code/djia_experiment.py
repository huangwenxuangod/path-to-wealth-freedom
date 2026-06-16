"""Real-data experiment for daily news sentiment and next-day DJIA direction.

Data:
  - Combined_News_DJIA.csv: 25 daily headlines, 2008-08-08 to 2016-07-01.
  - upload_DJIA_table.csv: DJIA OHLCV history.

The original dataset label is not used as the prediction target. To enforce a
clean information timeline, headlines and price features observed on day t are
used to predict the DJIA close-to-close direction on day t+1.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    balanced_accuracy_score,
    brier_score_loss,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.calibration import calibration_curve
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from xgboost import XGBClassifier


SEED = 42
PRICE_FEATURES = [
    "return_1d",
    "return_5d",
    "return_10d",
    "return_20d",
    "ma_gap_5_20",
    "volatility_5d",
    "volatility_20d",
    "volume_change_1d",
    "amplitude",
    "momentum_sign_5d",
]
NEWS_FEATURES = [
    "sentiment_mean",
    "sentiment_std",
    "sentiment_min",
    "sentiment_max",
    "positive_share",
    "negative_share",
    "neutral_share",
    "headline_count",
    "sentiment_lag1",
    "sentiment_change",
]


def clean_headline(value: object) -> str:
    text = "" if pd.isna(value) else str(value)
    text = re.sub(r"^b[\"']", "", text)
    text = text.strip("\"'")
    text = text.replace("&amp;", "&")
    return re.sub(r"\s+", " ", text).strip()


def load_and_build_panel(news_path: Path, price_path: Path) -> pd.DataFrame:
    news = pd.read_csv(news_path)
    price = pd.read_csv(price_path)
    news.columns = [column.lower() for column in news.columns]
    price.columns = [column.lower().replace(" ", "_") for column in price.columns]
    news["date"] = pd.to_datetime(news["date"])
    price["date"] = pd.to_datetime(price["date"])
    price = price.sort_values("date").drop_duplicates("date").reset_index(drop=True)

    headline_columns = [column for column in news if column.startswith("top")]
    analyzer = SentimentIntensityAnalyzer()
    sentiment_rows = []
    for row in news[["date", *headline_columns]].itertuples(index=False, name=None):
        date, *headlines = row
        scores = [
            analyzer.polarity_scores(clean_headline(headline))["compound"]
            for headline in headlines
            if clean_headline(headline)
        ]
        values = np.asarray(scores, dtype=float)
        sentiment_rows.append(
            {
                "date": date,
                "sentiment_mean": values.mean(),
                "sentiment_std": values.std(ddof=0),
                "sentiment_min": values.min(),
                "sentiment_max": values.max(),
                "positive_share": np.mean(values >= 0.05),
                "negative_share": np.mean(values <= -0.05),
                "neutral_share": np.mean((values > -0.05) & (values < 0.05)),
                "headline_count": len(values),
            }
        )
    sentiment = pd.DataFrame(sentiment_rows)

    close = price["adj_close"]
    price["return_1d"] = close.pct_change()
    for window in [5, 10, 20]:
        price[f"return_{window}d"] = close.pct_change(window)
    price["ma_gap_5_20"] = close.rolling(5).mean() / close.rolling(20).mean() - 1
    price["volatility_5d"] = price["return_1d"].rolling(5).std()
    price["volatility_20d"] = price["return_1d"].rolling(20).std()
    price["volume_change_1d"] = price["volume"].pct_change()
    price["amplitude"] = (price["high"] - price["low"]) / price["open"]
    price["momentum_sign_5d"] = np.sign(price["return_5d"])
    price["forward_return"] = close.shift(-1) / close - 1
    price["target"] = (price["forward_return"] > 0).astype(int)

    panel = price.merge(sentiment, on="date", how="inner").sort_values("date")
    panel["sentiment_lag1"] = panel["sentiment_mean"].shift(1)
    panel["sentiment_change"] = panel["sentiment_mean"].diff()
    panel = panel.replace([np.inf, -np.inf], np.nan)
    panel = panel.dropna(subset=PRICE_FEATURES + NEWS_FEATURES + ["forward_return"])
    return panel.reset_index(drop=True)


def make_model(name: str, features: list[str]) -> Pipeline:
    if name == "logistic":
        return Pipeline(
            [
                (
                    "prep",
                    ColumnTransformer(
                        [
                            (
                                "numeric",
                                Pipeline(
                                    [
                                        ("imputer", SimpleImputer(strategy="median")),
                                        ("scale", StandardScaler()),
                                    ]
                                ),
                                features,
                            )
                        ]
                    ),
                ),
                (
                    "model",
                    LogisticRegression(
                        max_iter=3000,
                        class_weight="balanced",
                        random_state=SEED,
                    ),
                ),
            ]
        )
    if name == "random_forest":
        return Pipeline(
            [
                (
                    "prep",
                    ColumnTransformer(
                        [("numeric", SimpleImputer(strategy="median"), features)]
                    ),
                ),
                (
                    "model",
                    RandomForestClassifier(
                        n_estimators=500,
                        max_depth=5,
                        min_samples_leaf=12,
                        max_features="sqrt",
                        class_weight="balanced_subsample",
                        n_jobs=-1,
                        random_state=SEED,
                    ),
                ),
            ]
        )
    if name == "xgboost":
        return Pipeline(
            [
                (
                    "prep",
                    ColumnTransformer(
                        [("numeric", SimpleImputer(strategy="median"), features)]
                    ),
                ),
                (
                    "model",
                    XGBClassifier(
                        n_estimators=350,
                        max_depth=3,
                        learning_rate=0.025,
                        subsample=0.80,
                        colsample_bytree=0.80,
                        min_child_weight=8,
                        reg_alpha=0.2,
                        reg_lambda=2.0,
                        eval_metric="logloss",
                        n_jobs=-1,
                        random_state=SEED,
                    ),
                ),
            ]
        )
    raise ValueError(name)


def best_threshold(y_true: pd.Series, probability: np.ndarray) -> float:
    thresholds = np.linspace(0.35, 0.65, 61)
    scores = [
        f1_score(y_true, probability >= threshold, zero_division=0)
        for threshold in thresholds
    ]
    return float(thresholds[int(np.argmax(scores))])


def metrics(y_true: pd.Series, probability: np.ndarray, threshold: float) -> dict:
    prediction = probability >= threshold
    return {
        "roc_auc": roc_auc_score(y_true, probability),
        "pr_auc": average_precision_score(y_true, probability),
        "f1": f1_score(y_true, prediction, zero_division=0),
        "balanced_accuracy": balanced_accuracy_score(y_true, prediction),
        "precision": precision_score(y_true, prediction, zero_division=0),
        "recall": recall_score(y_true, prediction, zero_division=0),
        "brier": brier_score_loss(y_true, probability),
        "threshold": threshold,
    }


def run_walk_forward(panel: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    feature_sets = {
        "price": PRICE_FEATURES,
        "price_news": PRICE_FEATURES + NEWS_FEATURES,
    }
    models = ["logistic", "random_forest", "xgboost"]
    result_rows = []
    prediction_rows = []

    for test_year in [2014, 2015, 2016]:
        validation_year = test_year - 1
        train_end = pd.Timestamp(f"{validation_year - 1}-12-31")
        validation_start = train_end + pd.offsets.BDay(21)
        validation_end = pd.Timestamp(f"{validation_year}-12-31")
        test_start = validation_end + pd.offsets.BDay(21)
        test_end = pd.Timestamp(f"{test_year}-12-31")
        train = panel[panel["date"] <= train_end]
        validation = panel[
            (panel["date"] >= validation_start) & (panel["date"] <= validation_end)
        ]
        test = panel[(panel["date"] >= test_start) & (panel["date"] <= test_end)]

        for feature_set, features in feature_sets.items():
            for model_name in models:
                model = clone(make_model(model_name, features))
                model.fit(train[features], train["target"])
                val_probability = model.predict_proba(validation[features])[:, 1]
                threshold = best_threshold(validation["target"], val_probability)
                test_probability = model.predict_proba(test[features])[:, 1]
                row = metrics(test["target"], test_probability, threshold)
                row.update(
                    {
                        "test_year": test_year,
                        "model": model_name,
                        "feature_set": feature_set,
                        "n_train": len(train),
                        "n_validation": len(validation),
                        "n_test": len(test),
                    }
                )
                result_rows.append(row)
                prediction = test[
                    ["date", "target", "forward_return", "sentiment_mean"]
                ].copy()
                prediction["probability"] = test_probability
                prediction["threshold"] = threshold
                prediction["test_year"] = test_year
                prediction["model"] = model_name
                prediction["feature_set"] = feature_set
                prediction_rows.append(prediction)
    return pd.DataFrame(result_rows), pd.concat(prediction_rows, ignore_index=True)


def paired_bootstrap(
    predictions: pd.DataFrame, model: str = "xgboost", iterations: int = 2000
) -> dict:
    subset = predictions[predictions["model"] == model]
    wide = subset.pivot_table(
        index=["date", "target"],
        columns="feature_set",
        values="probability",
    ).dropna()
    rng = np.random.default_rng(SEED)
    differences = []
    for _ in range(iterations):
        sample_index = rng.integers(0, len(wide), len(wide))
        sample = wide.iloc[sample_index]
        target = sample.index.get_level_values("target")
        if len(np.unique(target)) < 2:
            continue
        differences.append(
            roc_auc_score(target, sample["price_news"])
            - roc_auc_score(target, sample["price"])
        )
    return {
        "model": model,
        "auc_difference": float(
            roc_auc_score(wide.index.get_level_values("target"), wide["price_news"])
            - roc_auc_score(wide.index.get_level_values("target"), wide["price"])
        ),
        "ci_2_5": float(np.quantile(differences, 0.025)),
        "ci_97_5": float(np.quantile(differences, 0.975)),
        "iterations": len(differences),
    }


def strategy_statistics(predictions: pd.DataFrame, model: str = "xgboost") -> tuple[dict, pd.DataFrame]:
    data = predictions[
        (predictions["model"] == model)
        & (predictions["feature_set"] == "price_news")
    ].sort_values("date").copy()
    data["position"] = (data["probability"] >= 0.55).astype(float)
    data["turnover"] = data["position"].diff().abs().fillna(data["position"])
    data["strategy_return"] = (
        data["position"] * data["forward_return"] - 0.001 * data["turnover"]
    )
    data["market_return"] = data["forward_return"]
    data["strategy_curve"] = (1 + data["strategy_return"]).cumprod()
    data["market_curve"] = (1 + data["market_return"]).cumprod()
    annual_return = data["strategy_curve"].iloc[-1] ** (252 / len(data)) - 1
    annual_volatility = data["strategy_return"].std(ddof=1) * np.sqrt(252)
    drawdown = data["strategy_curve"] / data["strategy_curve"].cummax() - 1
    stats = {
        "model": model,
        "days": int(len(data)),
        "annual_return": float(annual_return),
        "annual_volatility": float(annual_volatility),
        "sharpe": float(annual_return / annual_volatility)
        if annual_volatility > 0
        else None,
        "max_drawdown": float(drawdown.min()),
        "market_annual_return": float(
            data["market_curve"].iloc[-1] ** (252 / len(data)) - 1
        ),
        "invested_share": float(data["position"].mean()),
        "transaction_cost": 0.001,
    }
    return stats, data


def save_figures(
    panel: pd.DataFrame,
    results: pd.DataFrame,
    predictions: pd.DataFrame,
    strategy: pd.DataFrame,
    figure_dir: Path,
) -> None:
    figure_dir.mkdir(parents=True, exist_ok=True)
    plt.style.use("seaborn-v0_8-whitegrid")

    summary = (
        results.groupby(["model", "feature_set"])["roc_auc"].mean().unstack()
    )
    axis = summary.plot(kind="bar", figsize=(8, 4.6), color=["#5B8FF9", "#E8684A"])
    axis.set_ylabel("Mean test ROC-AUC")
    axis.set_xlabel("")
    axis.set_ylim(0.40, max(0.62, summary.max().max() + 0.04))
    axis.legend(["Price only", "Price + news"], frameon=False)
    axis.set_xticklabels(["Logistic", "Random forest", "XGBoost"], rotation=0)
    plt.tight_layout()
    plt.savefig(figure_dir / "model_auc_comparison.png", dpi=240)
    plt.close()

    figure, axis = plt.subplots(figsize=(8, 4.5))
    axis.plot(strategy["date"], strategy["strategy_curve"], label="News strategy")
    axis.plot(strategy["date"], strategy["market_curve"], label="DJIA buy-and-hold")
    axis.set_ylabel("Cumulative wealth")
    axis.legend(frameon=False)
    figure.tight_layout()
    figure.savefig(figure_dir / "cumulative_returns.png", dpi=240)
    plt.close(figure)

    yearly = results[results["model"] == "xgboost"].pivot(
        index="test_year", columns="feature_set", values="roc_auc"
    )
    figure, axis = plt.subplots(figsize=(7.4, 4.4))
    axis.plot(yearly.index, yearly["price"], marker="o", linewidth=2, label="Price only")
    axis.plot(
        yearly.index,
        yearly["price_news"],
        marker="s",
        linewidth=2,
        label="Price + news",
    )
    axis.axhline(0.5, color="gray", linestyle="--", linewidth=1)
    axis.set_xticks(yearly.index)
    axis.set_ylim(0.38, 0.58)
    axis.set_xlabel("Test year")
    axis.set_ylabel("ROC-AUC")
    axis.legend(frameon=False)
    figure.tight_layout()
    figure.savefig(figure_dir / "yearly_xgboost_auc.png", dpi=240)
    plt.close(figure)

    correlation_features = [
        "forward_return",
        "sentiment_mean",
        "negative_share",
        "sentiment_std",
        "return_1d",
        "return_5d",
        "volatility_20d",
        "volume_change_1d",
    ]
    correlation = panel[correlation_features].corr()
    figure, axis = plt.subplots(figsize=(7.4, 6.1))
    image = axis.imshow(correlation, cmap="RdBu_r", vmin=-1, vmax=1)
    labels = [
        "Next return",
        "Mean sent.",
        "Neg. share",
        "Sent. std",
        "Ret. 1d",
        "Ret. 5d",
        "Vol. 20d",
        "Volume chg.",
    ]
    axis.set_xticks(range(len(labels)), labels=labels, rotation=45, ha="right")
    axis.set_yticks(range(len(labels)), labels=labels)
    for row in range(len(labels)):
        for column in range(len(labels)):
            axis.text(
                column,
                row,
                f"{correlation.iloc[row, column]:.2f}",
                ha="center",
                va="center",
                fontsize=7,
            )
    figure.colorbar(image, ax=axis, fraction=0.046, pad=0.04)
    figure.tight_layout()
    figure.savefig(figure_dir / "feature_correlation.png", dpi=240)
    plt.close(figure)

    xgb_predictions = predictions[
        (predictions["model"] == "xgboost")
        & (predictions["feature_set"] == "price_news")
    ]
    observed, predicted = calibration_curve(
        xgb_predictions["target"],
        xgb_predictions["probability"],
        n_bins=8,
        strategy="quantile",
    )
    figure, axis = plt.subplots(figsize=(5.8, 5.0))
    axis.plot(predicted, observed, marker="o", label="XGBoost")
    axis.plot([0, 1], [0, 1], linestyle="--", color="gray", label="Perfect")
    axis.set_xlim(0.30, 0.72)
    axis.set_ylim(0.30, 0.72)
    axis.set_xlabel("Mean predicted probability")
    axis.set_ylabel("Observed up frequency")
    axis.legend(frameon=False)
    figure.tight_layout()
    figure.savefig(figure_dir / "calibration_curve.png", dpi=240)
    plt.close(figure)

    thresholds = np.arange(0.40, 0.66, 0.025)
    sensitivity = []
    for threshold in thresholds:
        data = xgb_predictions.sort_values("date").copy()
        data["position"] = (data["probability"] >= threshold).astype(float)
        data["turnover"] = data["position"].diff().abs().fillna(data["position"])
        data["net_return"] = (
            data["position"] * data["forward_return"] - 0.001 * data["turnover"]
        )
        curve = (1 + data["net_return"]).cumprod()
        annual = curve.iloc[-1] ** (252 / len(data)) - 1
        sensitivity.append(annual)
    figure, axis = plt.subplots(figsize=(6.8, 4.3))
    axis.plot(thresholds, sensitivity, marker="o")
    axis.axhline(0, color="gray", linestyle="--", linewidth=1)
    axis.set_xlabel("Trading probability threshold")
    axis.set_ylabel("Annualized net return")
    figure.tight_layout()
    figure.savefig(figure_dir / "threshold_sensitivity.png", dpi=240)
    plt.close(figure)

    figure, axis = plt.subplots(figsize=(8, 4.5))
    down = panel.loc[panel["target"] == 0, "sentiment_mean"]
    up = panel.loc[panel["target"] == 1, "sentiment_mean"]
    axis.hist(down, bins=30, alpha=0.65, density=True, label="Next day down")
    axis.hist(up, bins=30, alpha=0.65, density=True, label="Next day up")
    axis.set_xlabel("Daily mean VADER sentiment")
    axis.set_ylabel("Density")
    axis.legend(frameon=False)
    figure.tight_layout()
    figure.savefig(figure_dir / "sentiment_distribution.png", dpi=240)
    plt.close(figure)

    selected = predictions[
        (predictions["model"] == "xgboost")
        & (predictions["feature_set"] == "price_news")
    ]
    figure, axis = plt.subplots(figsize=(6.2, 5.0))
    false_positive_rate, true_positive_rate, _ = roc_curve(
        selected["target"], selected["probability"]
    )
    auc = roc_auc_score(selected["target"], selected["probability"])
    axis.plot(false_positive_rate, true_positive_rate, label=f"XGBoost AUC={auc:.3f}")
    axis.plot([0, 1], [0, 1], linestyle="--", color="gray")
    axis.set_xlabel("False positive rate")
    axis.set_ylabel("True positive rate")
    axis.legend(frameon=False)
    figure.tight_layout()
    figure.savefig(figure_dir / "xgboost_roc_curve.png", dpi=240)
    plt.close(figure)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--news", type=Path, required=True)
    parser.add_argument("--prices", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    np.random.seed(SEED)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    panel = load_and_build_panel(args.news, args.prices)
    results, predictions = run_walk_forward(panel)
    bootstrap = paired_bootstrap(predictions)
    strategy_stats, strategy = strategy_statistics(predictions)
    figures = args.output_dir / "figures"
    save_figures(panel, results, predictions, strategy, figures)

    summary = (
        results.groupby(["model", "feature_set"])
        .agg(
            roc_auc_mean=("roc_auc", "mean"),
            roc_auc_std=("roc_auc", "std"),
            pr_auc_mean=("pr_auc", "mean"),
            f1_mean=("f1", "mean"),
            balanced_accuracy_mean=("balanced_accuracy", "mean"),
            brier_mean=("brier", "mean"),
        )
        .reset_index()
    )
    sample = {
        "observations": int(len(panel)),
        "start": str(panel["date"].min().date()),
        "end": str(panel["date"].max().date()),
        "up_share": float(panel["target"].mean()),
        "headlines": int(panel["headline_count"].sum()),
        "sentiment_up_mean": float(
            panel.loc[panel["target"] == 1, "sentiment_mean"].mean()
        ),
        "sentiment_down_mean": float(
            panel.loc[panel["target"] == 0, "sentiment_mean"].mean()
        ),
    }
    panel.to_parquet(args.output_dir / "model_panel.parquet", index=False)
    results.to_csv(args.output_dir / "metrics_by_fold.csv", index=False)
    summary.to_csv(args.output_dir / "metrics_summary.csv", index=False)
    predictions.to_parquet(args.output_dir / "predictions.parquet", index=False)
    strategy.to_csv(args.output_dir / "strategy_daily.csv", index=False)
    (args.output_dir / "diagnostics.json").write_text(
        json.dumps(
            {
                "sample": sample,
                "bootstrap": bootstrap,
                "strategy": strategy_stats,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(summary.to_string(index=False))
    print(json.dumps({"sample": sample, "bootstrap": bootstrap, "strategy": strategy_stats}, indent=2))


if __name__ == "__main__":
    main()
