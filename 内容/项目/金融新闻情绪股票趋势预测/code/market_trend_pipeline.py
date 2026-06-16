"""Reproducible news-sentiment and stock-direction experiment.

Expected news columns:
    datetime, ticker, title [, sentiment_score]
Expected price columns:
    date, ticker, open, high, low, close, volume

The script supports a synthetic demo, but demo results must not be used in the
course paper. Real experiments should provide FNSPID-derived CSV files.
"""

from __future__ import annotations

import argparse
import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

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
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

try:
    from xgboost import XGBClassifier
except ImportError:
    XGBClassifier = None


SEED = 42
PRICE_FEATURES = [
    "return_1d",
    "return_5d",
    "return_10d",
    "return_20d",
    "ma_gap_5_20",
    "volatility_20d",
    "volume_change_1d",
    "amplitude",
    "volume_price_corr_20d",
]
NEWS_FEATURES = [
    "sentiment_mean",
    "sentiment_std",
    "positive_share",
    "negative_share",
    "extreme_negative_share",
    "news_count_log",
    "has_news",
    "sentiment_mean_lag1",
]


@dataclass(frozen=True)
class Fold:
    train_end: pd.Timestamp
    validation_end: pd.Timestamp
    test_end: pd.Timestamp


def set_seed(seed: int = SEED) -> None:
    random.seed(seed)
    np.random.seed(seed)


def normalize_columns(frame: pd.DataFrame) -> pd.DataFrame:
    result = frame.copy()
    result.columns = [str(column).strip().lower() for column in result.columns]
    return result


def validate_columns(frame: pd.DataFrame, required: Iterable[str], name: str) -> None:
    missing = sorted(set(required) - set(frame.columns))
    if missing:
        raise ValueError(f"{name} is missing required columns: {missing}")


def lexicon_sentiment(text: object) -> float:
    """Small transparent fallback; use FinBERT scores for the final experiment."""
    positive = {
        "beat", "beats", "growth", "gain", "gains", "profit", "profits",
        "record", "strong", "surge", "upgrade", "upside", "outperform",
    }
    negative = {
        "cut", "cuts", "decline", "downgrade", "fall", "falls", "fraud",
        "loss", "losses", "miss", "misses", "probe", "risk", "weak",
    }
    tokens = {
        token.strip(".,:;!?()[]{}\"'").lower()
        for token in str(text).split()
    }
    raw = len(tokens & positive) - len(tokens & negative)
    return float(np.tanh(raw / 2.0))


def load_news(path: Path) -> pd.DataFrame:
    news = normalize_columns(pd.read_csv(path))
    validate_columns(news, ["datetime", "ticker", "title"], "news CSV")
    news["datetime"] = pd.to_datetime(news["datetime"], utc=True, errors="coerce")
    news["ticker"] = news["ticker"].astype(str).str.upper().str.strip()
    news = news.dropna(subset=["datetime", "ticker", "title"])
    news = news.drop_duplicates(subset=["datetime", "ticker", "title"])
    if "sentiment_score" not in news:
        news["sentiment_score"] = news["title"].map(lexicon_sentiment)
    news["sentiment_score"] = pd.to_numeric(
        news["sentiment_score"], errors="coerce"
    ).clip(-1, 1)
    return news.dropna(subset=["sentiment_score"])


def load_prices(path: Path) -> pd.DataFrame:
    prices = normalize_columns(pd.read_csv(path))
    required = ["date", "ticker", "open", "high", "low", "close", "volume"]
    validate_columns(prices, required, "prices CSV")
    prices["date"] = pd.to_datetime(prices["date"], errors="coerce").dt.normalize()
    prices["ticker"] = prices["ticker"].astype(str).str.upper().str.strip()
    for column in ["open", "high", "low", "close", "volume"]:
        prices[column] = pd.to_numeric(prices[column], errors="coerce")
    prices = prices.dropna(subset=required).drop_duplicates(["date", "ticker"])
    return prices.sort_values(["ticker", "date"]).reset_index(drop=True)


def effective_news_date(news: pd.DataFrame, trading_dates: pd.DatetimeIndex) -> pd.DataFrame:
    """Map news to the latest usable information date.

    UTC timestamps are converted to America/New_York. News published after
    16:00 ET is first shifted to the following calendar day. Weekends and
    holidays are then mapped to the next observed trading date.
    """
    result = news.copy()
    eastern = result["datetime"].dt.tz_convert("America/New_York")
    calendar_date = eastern.dt.tz_localize(None).dt.normalize()
    after_close = eastern.dt.hour >= 16
    candidate = calendar_date + pd.to_timedelta(after_close.astype(int), unit="D")

    trading_values = trading_dates.sort_values().unique().values
    positions = np.searchsorted(trading_values, candidate.values, side="left")
    valid = positions < len(trading_values)
    result = result.loc[valid].copy()
    result["effective_date"] = pd.to_datetime(trading_values[positions[valid]])
    return result


def aggregate_news(news: pd.DataFrame, trading_dates: pd.DatetimeIndex) -> pd.DataFrame:
    aligned = effective_news_date(news, trading_dates)
    aligned["is_positive"] = (aligned["sentiment_score"] > 0.2).astype(float)
    aligned["is_negative"] = (aligned["sentiment_score"] < -0.2).astype(float)
    aligned["is_extreme_negative"] = (
        aligned["sentiment_score"] < -0.7
    ).astype(float)
    daily = (
        aligned.groupby(["ticker", "effective_date"], as_index=False)
        .agg(
            sentiment_mean=("sentiment_score", "mean"),
            sentiment_std=("sentiment_score", "std"),
            positive_share=("is_positive", "mean"),
            negative_share=("is_negative", "mean"),
            extreme_negative_share=("is_extreme_negative", "mean"),
            news_count=("title", "size"),
        )
        .rename(columns={"effective_date": "date"})
    )
    daily["news_count_log"] = np.log1p(daily["news_count"])
    daily["has_news"] = 1.0
    return daily


def engineer_price_features(prices: pd.DataFrame) -> pd.DataFrame:
    frames = []
    for _, group in prices.groupby("ticker", sort=False):
        group = group.sort_values("date").copy()
        close = group["close"]
        volume = group["volume"].replace(0, np.nan)
        group["return_1d"] = close.pct_change()
        for window in [5, 10, 20]:
            group[f"return_{window}d"] = close.pct_change(window)
        group["ma_gap_5_20"] = close.rolling(5).mean() / close.rolling(20).mean() - 1
        group["volatility_20d"] = group["return_1d"].rolling(20).std()
        group["volume_change_1d"] = volume.pct_change().replace([np.inf, -np.inf], np.nan)
        group["amplitude"] = (group["high"] - group["low"]) / group["open"]
        group["volume_price_corr_20d"] = (
            group["return_1d"].rolling(20).corr(np.log1p(volume))
        )
        group["forward_return"] = close.shift(-1) / close - 1
        frames.append(group)
    return pd.concat(frames, ignore_index=True)


def build_panel(news: pd.DataFrame, prices: pd.DataFrame) -> pd.DataFrame:
    featured_prices = engineer_price_features(prices)
    market = (
        featured_prices.groupby("date", as_index=False)["forward_return"]
        .mean()
        .rename(columns={"forward_return": "market_forward_return"})
    )
    daily_news = aggregate_news(news, pd.DatetimeIndex(prices["date"].unique()))
    panel = featured_prices.merge(market, on="date", how="left")
    panel = panel.merge(daily_news, on=["ticker", "date"], how="left")

    for column in NEWS_FEATURES:
        if column != "sentiment_mean_lag1" and column not in panel:
            panel[column] = 0.0
    fill_columns = [column for column in NEWS_FEATURES if column != "sentiment_mean_lag1"]
    panel[fill_columns] = panel[fill_columns].fillna(0.0)
    panel["sentiment_mean_lag1"] = (
        panel.groupby("ticker")["sentiment_mean"].shift(1).fillna(0.0)
    )
    panel["excess_forward_return"] = (
        panel["forward_return"] - panel["market_forward_return"]
    )
    panel["target"] = (panel["excess_forward_return"] > 0).astype(int)
    panel = panel.replace([np.inf, -np.inf], np.nan)
    return panel.dropna(subset=["forward_return", "market_forward_return"])


def yearly_folds(panel: pd.DataFrame, embargo_days: int = 20) -> list[Fold]:
    years = sorted(panel["date"].dt.year.unique())
    folds = []
    # At least three training years, one validation year, and one test year.
    for test_year in years[4:]:
        validation_year = test_year - 1
        if validation_year not in years:
            continue
        train_end = pd.Timestamp(f"{validation_year - 1}-12-31") - pd.Timedelta(
            days=embargo_days
        )
        folds.append(
            Fold(
                train_end=train_end,
                validation_end=pd.Timestamp(f"{validation_year}-12-31"),
                test_end=pd.Timestamp(f"{test_year}-12-31"),
            )
        )
    return folds[-3:]


def make_models(feature_names: list[str]) -> dict[str, Pipeline]:
    numeric = ColumnTransformer(
        [("numeric", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]), feature_names)],
        remainder="drop",
    )
    models: dict[str, Pipeline] = {
        "logistic": Pipeline([
            ("preprocess", numeric),
            ("model", LogisticRegression(max_iter=2000, class_weight="balanced", random_state=SEED)),
        ]),
        "random_forest": Pipeline([
            ("preprocess", ColumnTransformer([
                ("numeric", SimpleImputer(strategy="median"), feature_names)
            ])),
            ("model", RandomForestClassifier(
                n_estimators=300,
                min_samples_leaf=10,
                max_features="sqrt",
                class_weight="balanced_subsample",
                n_jobs=-1,
                random_state=SEED,
            )),
        ]),
    }
    if XGBClassifier is not None:
        models["xgboost"] = Pipeline([
            ("preprocess", ColumnTransformer([
                ("numeric", SimpleImputer(strategy="median"), feature_names)
            ])),
            ("model", XGBClassifier(
                n_estimators=300,
                max_depth=4,
                learning_rate=0.03,
                subsample=0.8,
                colsample_bytree=0.8,
                eval_metric="logloss",
                n_jobs=-1,
                random_state=SEED,
            )),
        ])
    return models


def best_f1_threshold(y_true: pd.Series, probabilities: np.ndarray) -> float:
    candidates = np.linspace(0.30, 0.70, 81)
    scores = [f1_score(y_true, probabilities >= value, zero_division=0) for value in candidates]
    return float(candidates[int(np.argmax(scores))])


def metric_row(y_true: pd.Series, probabilities: np.ndarray, threshold: float) -> dict:
    predictions = (probabilities >= threshold).astype(int)
    return {
        "roc_auc": roc_auc_score(y_true, probabilities),
        "pr_auc": average_precision_score(y_true, probabilities),
        "f1": f1_score(y_true, predictions, zero_division=0),
        "balanced_accuracy": balanced_accuracy_score(y_true, predictions),
        "precision": precision_score(y_true, predictions, zero_division=0),
        "recall": recall_score(y_true, predictions, zero_division=0),
        "brier": brier_score_loss(y_true, probabilities),
        "threshold": threshold,
    }


def evaluate(panel: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    folds = yearly_folds(panel)
    if not folds:
        raise ValueError("Need at least five calendar years for walk-forward evaluation.")
    results = []
    predictions = []
    feature_sets = {"price": PRICE_FEATURES, "price_news": PRICE_FEATURES + NEWS_FEATURES}

    for fold_id, fold in enumerate(folds, start=1):
        train = panel[panel["date"] <= fold.train_end]
        validation = panel[
            (panel["date"] > fold.train_end + pd.Timedelta(days=20))
            & (panel["date"] <= fold.validation_end)
        ]
        test = panel[
            (panel["date"] > fold.validation_end + pd.Timedelta(days=20))
            & (panel["date"] <= fold.test_end)
        ]
        if min(len(train), len(validation), len(test)) == 0:
            continue

        for feature_set, features in feature_sets.items():
            for model_name, model in make_models(features).items():
                fitted = clone(model).fit(train[features], train["target"])
                validation_probability = fitted.predict_proba(validation[features])[:, 1]
                threshold = best_f1_threshold(validation["target"], validation_probability)
                test_probability = fitted.predict_proba(test[features])[:, 1]
                row = metric_row(test["target"], test_probability, threshold)
                row.update({
                    "fold": fold_id,
                    "test_year": int(test["date"].dt.year.max()),
                    "feature_set": feature_set,
                    "model": model_name,
                    "n_train": len(train),
                    "n_test": len(test),
                })
                results.append(row)
                pred = test[["date", "ticker", "target", "excess_forward_return"]].copy()
                pred["probability"] = test_probability
                pred["fold"] = fold_id
                pred["feature_set"] = feature_set
                pred["model"] = model_name
                predictions.append(pred)
    return pd.DataFrame(results), pd.concat(predictions, ignore_index=True)


def bootstrap_auc_difference(
    predictions: pd.DataFrame,
    model: str = "xgboost",
    iterations: int = 1000,
) -> dict:
    subset = predictions[predictions["model"] == model]
    wide = subset.pivot_table(
        index=["date", "ticker", "target"],
        columns="feature_set",
        values="probability",
    ).dropna()
    if not {"price", "price_news"}.issubset(wide.columns):
        return {"model": model, "error": "paired predictions unavailable"}
    dates = wide.index.get_level_values("date").unique().to_numpy()
    rng = np.random.default_rng(SEED)
    differences = []
    for _ in range(iterations):
        sampled_dates = rng.choice(dates, size=len(dates), replace=True)
        sample = pd.concat(
            [wide[wide.index.get_level_values("date") == date] for date in sampled_dates]
        )
        if sample.index.get_level_values("target").nunique() < 2:
            continue
        target = sample.index.get_level_values("target")
        differences.append(
            roc_auc_score(target, sample["price_news"])
            - roc_auc_score(target, sample["price"])
        )
    return {
        "model": model,
        "auc_difference_mean": float(np.mean(differences)),
        "ci_2_5": float(np.quantile(differences, 0.025)),
        "ci_97_5": float(np.quantile(differences, 0.975)),
        "iterations": len(differences),
    }


def backtest(predictions: pd.DataFrame, model: str = "xgboost") -> dict:
    selected = predictions[
        (predictions["model"] == model)
        & (predictions["feature_set"] == "price_news")
        & (predictions["probability"] >= 0.55)
    ].copy()
    if selected.empty:
        return {"model": model, "error": "no observations exceed probability threshold"}
    daily = selected.groupby("date")["excess_forward_return"].mean().sort_index()
    turnover_cost = 0.001
    net = daily - turnover_cost
    equity = (1 + net).cumprod()
    annual_return = float(equity.iloc[-1] ** (252 / len(net)) - 1)
    annual_volatility = float(net.std(ddof=1) * math.sqrt(252))
    drawdown = equity / equity.cummax() - 1
    return {
        "model": model,
        "trading_days": int(len(net)),
        "annual_return": annual_return,
        "annual_volatility": annual_volatility,
        "sharpe": annual_return / annual_volatility if annual_volatility else None,
        "max_drawdown": float(drawdown.min()),
        "one_way_cost": turnover_cost,
    }


def make_demo_data(output_dir: Path) -> tuple[Path, Path]:
    """Create a small dataset with a weak, learnable news signal."""
    set_seed()
    data_dir = output_dir / "demo_data"
    data_dir.mkdir(parents=True, exist_ok=True)
    dates = pd.bdate_range("2017-01-02", "2023-12-29")
    tickers = ["AAA", "BBB", "CCC", "DDD", "EEE"]
    price_rows = []
    news_rows = []
    for ticker_id, ticker in enumerate(tickers):
        close = 80 + ticker_id * 10
        for date in dates:
            latent = np.random.normal(0, 1)
            daily_return = 0.0002 + 0.012 * np.random.normal()
            open_price = close * (1 + 0.002 * np.random.normal())
            close *= 1 + daily_return
            high = max(open_price, close) * (1 + abs(np.random.normal(0, 0.004)))
            low = min(open_price, close) * (1 - abs(np.random.normal(0, 0.004)))
            price_rows.append({
                "date": date, "ticker": ticker, "open": open_price, "high": high,
                "low": low, "close": close, "volume": int(np.random.lognormal(14, 0.4)),
            })
            if np.random.random() < 0.35:
                score = float(np.tanh(latent))
                title = "Company reports strong growth" if score > 0 else "Company faces weak outlook"
                news_rows.append({
                    "datetime": date + pd.Timedelta(hours=15),
                    "ticker": ticker,
                    "title": title,
                    "sentiment_score": score,
                })
    price_path = data_dir / "prices.csv"
    news_path = data_dir / "news.csv"
    pd.DataFrame(price_rows).to_csv(price_path, index=False)
    pd.DataFrame(news_rows).to_csv(news_path, index=False)
    return news_path, price_path


def save_outputs(
    panel: pd.DataFrame,
    results: pd.DataFrame,
    predictions: pd.DataFrame,
    output_dir: Path,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    panel.to_parquet(output_dir / "model_panel.parquet", index=False)
    results.to_csv(output_dir / "metrics_by_fold.csv", index=False)
    predictions.to_parquet(output_dir / "predictions.parquet", index=False)
    summary = (
        results.groupby(["model", "feature_set"])
        .agg(
            roc_auc_mean=("roc_auc", "mean"),
            roc_auc_std=("roc_auc", "std"),
            f1_mean=("f1", "mean"),
            pr_auc_mean=("pr_auc", "mean"),
            brier_mean=("brier", "mean"),
        )
        .reset_index()
    )
    summary.to_csv(output_dir / "metrics_summary.csv", index=False)
    preferred_model = "xgboost" if "xgboost" in predictions["model"].unique() else "random_forest"
    diagnostics = {
        "bootstrap": bootstrap_auc_difference(predictions, preferred_model),
        "backtest": backtest(predictions, preferred_model),
        "sample": {
            "rows": len(panel),
            "tickers": int(panel["ticker"].nunique()),
            "start": str(panel["date"].min().date()),
            "end": str(panel["date"].max().date()),
            "positive_share": float(panel["target"].mean()),
            "news_day_share": float(panel["has_news"].mean()),
        },
    }
    (output_dir / "diagnostics.json").write_text(
        json.dumps(diagnostics, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--news-csv", type=Path)
    parser.add_argument("--prices-csv", type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("outputs/run"))
    parser.add_argument("--make-demo", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    set_seed()
    if args.make_demo:
        news_path, prices_path = make_demo_data(args.output_dir)
    else:
        if not args.news_csv or not args.prices_csv:
            raise SystemExit("Provide --news-csv and --prices-csv, or use --make-demo.")
        news_path, prices_path = args.news_csv, args.prices_csv
    news = load_news(news_path)
    prices = load_prices(prices_path)
    panel = build_panel(news, prices)
    results, predictions = evaluate(panel)
    save_outputs(panel, results, predictions, args.output_dir)
    print(results.groupby(["model", "feature_set"])[["roc_auc", "f1"]].mean())
    print(f"Outputs written to: {args.output_dir.resolve()}")


if __name__ == "__main__":
    main()
