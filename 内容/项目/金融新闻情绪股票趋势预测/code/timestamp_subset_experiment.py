"""Small-sample timestamp-aware validation on public company-level news.

This script downloads a lightweight subset from the public
`luckycat37/financial-news-dataset` release on Hugging Face, aggregates
article-level sentiment to ticker-day features, fetches daily OHLCV data from
Yahoo Finance's chart endpoint, and compares static vs rolling validation.

The goal is not to prove tradable alpha. It is to test whether the core
research claim changes when we move from a coarse market-level daily baseline
to a company-level dataset that at least contains per-article publish dates and
company mentions.
"""

from __future__ import annotations

import argparse
import json
import lzma
import math
import re
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, brier_score_loss, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from xgboost import XGBClassifier


SEED = 42
TICKERS = ["AAPL", "GOOGL", "MSFT", "TSLA"]
PRICE_FEATURES = [
    "return_1d",
    "return_5d",
    "return_20d",
    "volatility_5d",
    "volatility_20d",
    "ma_gap_5_20",
    "volume_change_1d",
]
NEWS_FEATURES = [
    "sentiment_mean",
    "sentiment_std",
    "positive_share",
    "negative_share",
    "article_count",
    "has_news",
    "after_hours_share",
    "midnight_share",
]


@dataclass(frozen=True)
class Window:
    label: str
    train_start: pd.Timestamp
    train_end: pd.Timestamp
    test_start: pd.Timestamp
    test_end: pd.Timestamp


def ensure_data_file(data_dir: Path, year: int) -> Path:
    path = data_dir / f"{year}_processed.json.xz"
    if path.exists():
        return path
    url = (
        "https://huggingface.co/datasets/luckycat37/financial-news-dataset/"
        f"resolve/main/{year}_processed.json.xz"
    )
    print(f"Downloading {url}")
    with urllib.request.urlopen(url, timeout=180) as response:
        path.write_bytes(response.read())
    return path


def clean_text(*parts: object) -> str:
    text = " ".join("" if part is None else str(part) for part in parts)
    text = text.replace("&amp;", "&")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def load_news_subset(data_dir: Path, years: list[int], tickers: list[str]) -> pd.DataFrame:
    analyzer = SentimentIntensityAnalyzer()
    rows: list[dict[str, object]] = []
    for year in years:
        path = ensure_data_file(data_dir, year)
        with lzma.open(path, "rt", encoding="utf-8") as handle:
            payload = json.load(handle)
        for item in payload:
            mentioned = [str(t).upper() for t in (item.get("mentioned_companies") or [])]
            matched = [ticker for ticker in mentioned if ticker in tickers]
            if not matched:
                continue
            date_publish = item.get("date_publish")
            if not date_publish:
                continue
            dt = pd.to_datetime(date_publish, errors="coerce")
            if pd.isna(dt):
                continue
            body = clean_text(item.get("title"), item.get("description"))
            if not body:
                continue
            sentiment = analyzer.polarity_scores(body)["compound"]
            for ticker in matched:
                rows.append(
                    {
                        "ticker": ticker,
                        "publish_dt": dt,
                        "publish_date": dt.normalize(),
                        "publish_time": dt.strftime("%H:%M:%S"),
                        "is_midnight": int(dt.strftime("%H:%M:%S") == "00:00:00"),
                        "after_hours": int(dt.hour >= 16),
                        "sentiment": sentiment,
                    }
                )
    news = pd.DataFrame(rows).sort_values(["ticker", "publish_dt"]).reset_index(drop=True)
    if news.empty:
        raise ValueError("No matched news rows were loaded.")
    return news


def aggregate_news(news: pd.DataFrame) -> pd.DataFrame:
    grouped = (
        news.groupby(["ticker", "publish_date"], as_index=False)
        .agg(
            sentiment_mean=("sentiment", "mean"),
            sentiment_std=("sentiment", "std"),
            positive_share=("sentiment", lambda s: float(np.mean(np.asarray(s) >= 0.05))),
            negative_share=("sentiment", lambda s: float(np.mean(np.asarray(s) <= -0.05))),
            article_count=("sentiment", "size"),
            after_hours_share=("after_hours", "mean"),
            midnight_share=("is_midnight", "mean"),
        )
        .rename(columns={"publish_date": "date"})
    )
    grouped["sentiment_std"] = grouped["sentiment_std"].fillna(0.0)
    grouped["has_news"] = 1
    return grouped


def download_yahoo_prices(ticker: str, start: str, end: str) -> pd.DataFrame:
    start_ts = int(pd.Timestamp(start, tz="UTC").timestamp())
    end_ts = int(pd.Timestamp(end, tz="UTC").timestamp())
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
        f"?period1={start_ts}&period2={end_ts}&interval=1d&includeAdjustedClose=true"
    )
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.load(response)
            break
        except Exception as exc:  # pragma: no cover - network retry
            last_error = exc
            time.sleep(2 + attempt * 2)
    else:  # pragma: no cover - network retry
        raise last_error  # type: ignore[misc]

    result = payload["chart"]["result"][0]
    timestamps = result["timestamp"]
    quote = result["indicators"]["quote"][0]
    adjclose = result["indicators"]["adjclose"][0]["adjclose"]
    frame = pd.DataFrame(
        {
            "date": pd.to_datetime(timestamps, unit="s").normalize(),
            "open": quote["open"],
            "high": quote["high"],
            "low": quote["low"],
            "close": quote["close"],
            "volume": quote["volume"],
            "adj_close": adjclose,
        }
    )
    frame["ticker"] = ticker
    frame = frame.dropna(subset=["adj_close"]).sort_values("date").reset_index(drop=True)
    return frame


def load_price_panel(tickers: list[str], start: str, end: str) -> pd.DataFrame:
    frames = [download_yahoo_prices(ticker, start, end) for ticker in tickers]
    price = pd.concat(frames, ignore_index=True).sort_values(["ticker", "date"])

    def add_features(ticker: str, group: pd.DataFrame) -> pd.DataFrame:
        group = group.copy()
        group["ticker"] = ticker
        close = group["adj_close"]
        group["return_1d"] = close.pct_change()
        group["return_5d"] = close.pct_change(5)
        group["return_20d"] = close.pct_change(20)
        group["volatility_5d"] = group["return_1d"].rolling(5).std()
        group["volatility_20d"] = group["return_1d"].rolling(20).std()
        group["ma_gap_5_20"] = close.rolling(5).mean() / close.rolling(20).mean() - 1
        group["volume_change_1d"] = group["volume"].pct_change()
        group["forward_return"] = close.shift(-1) / close - 1
        group["target"] = (group["forward_return"] > 0).astype(int)
        return group

    enriched = [add_features(ticker, group) for ticker, group in price.groupby("ticker")]
    return pd.concat(enriched, ignore_index=True).reset_index(drop=True)


def build_panel(news_daily: pd.DataFrame, price: pd.DataFrame) -> pd.DataFrame:
    panel = price.merge(news_daily, on=["ticker", "date"], how="left")
    fill_zero = NEWS_FEATURES.copy()
    for column in fill_zero:
        panel[column] = panel[column].fillna(0.0)
    panel = panel.replace([np.inf, -np.inf], np.nan)
    panel = panel.dropna(subset=PRICE_FEATURES + ["forward_return"])
    panel = panel.sort_values(["date", "ticker"]).reset_index(drop=True)
    return panel


def make_model(name: str, features: list[str]) -> Pipeline:
    if name == "logistic":
        estimator = LogisticRegression(
            max_iter=3000,
            class_weight="balanced",
            random_state=SEED,
        )
        transformer = Pipeline(
            [("imputer", SimpleImputer(strategy="median")), ("scale", StandardScaler())]
        )
    elif name == "xgboost":
        estimator = XGBClassifier(
            n_estimators=200,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.85,
            min_child_weight=6,
            reg_alpha=0.1,
            reg_lambda=2.0,
            eval_metric="logloss",
            random_state=SEED,
            n_jobs=1,
        )
        transformer = SimpleImputer(strategy="median")
    else:
        raise ValueError(name)

    return Pipeline(
        [
            ("prep", ColumnTransformer([("numeric", transformer, features)])),
            ("model", estimator),
        ]
    )


def compute_metrics(y_true: pd.Series, probability: np.ndarray) -> dict[str, float]:
    pred = (probability >= 0.5).astype(int)
    return {
        "auc": float(roc_auc_score(y_true, probability)),
        "balanced_accuracy": float(balanced_accuracy_score(y_true, pred)),
        "brier": float(brier_score_loss(y_true, probability)),
        "n": int(len(y_true)),
        "up_share": float(np.mean(y_true)),
    }


def evaluate_static(panel: pd.DataFrame, model_name: str, features: list[str]) -> dict[str, float]:
    train = panel[panel["date"] < pd.Timestamp("2020-01-01")].copy()
    test = panel[panel["date"] >= pd.Timestamp("2020-01-01")].copy()
    model = make_model(model_name, features)
    model.fit(train[features], train["target"])
    probability = model.predict_proba(test[features])[:, 1]
    metrics = compute_metrics(test["target"], probability)
    metrics["train_rows"] = int(len(train))
    metrics["test_rows"] = int(len(test))
    return metrics


def monthly_windows() -> list[Window]:
    months = pd.date_range("2020-01-01", "2020-12-01", freq="MS")
    windows = []
    for month in months:
        train_end = month - pd.Timedelta(days=1)
        train_start = month - pd.DateOffset(months=6)
        test_start = month
        test_end = month + pd.offsets.MonthEnd(1)
        windows.append(
            Window(
                label=month.strftime("%Y-%m"),
                train_start=train_start.normalize(),
                train_end=train_end.normalize(),
                test_start=test_start.normalize(),
                test_end=test_end.normalize(),
            )
        )
    return windows


def evaluate_rolling(panel: pd.DataFrame, model_name: str, features: list[str]) -> tuple[dict[str, float], pd.DataFrame]:
    preds = []
    for window in monthly_windows():
        train = panel[(panel["date"] >= window.train_start) & (panel["date"] <= window.train_end)].copy()
        test = panel[(panel["date"] >= window.test_start) & (panel["date"] <= window.test_end)].copy()
        if train.empty or test.empty or train["target"].nunique() < 2:
            continue
        model = make_model(model_name, features)
        model.fit(train[features], train["target"])
        probability = model.predict_proba(test[features])[:, 1]
        fold = test[["date", "ticker", "target"]].copy()
        fold["probability"] = probability
        fold["window"] = window.label
        preds.append(fold)
    predictions = pd.concat(preds, ignore_index=True)
    metrics = compute_metrics(predictions["target"], predictions["probability"])
    return metrics, predictions


def psi(expected: pd.Series, actual: pd.Series, bins: int = 10) -> float:
    expected = expected.replace([np.inf, -np.inf], np.nan).dropna()
    actual = actual.replace([np.inf, -np.inf], np.nan).dropna()
    if expected.empty or actual.empty:
        return math.nan
    edges = np.unique(np.quantile(expected, np.linspace(0, 1, bins + 1)))
    if len(edges) < 3:
        return math.nan
    edges[0] = -np.inf
    edges[-1] = np.inf
    exp_hist, _ = np.histogram(expected, bins=edges)
    act_hist, _ = np.histogram(actual, bins=edges)
    exp_pct = np.clip(exp_hist / exp_hist.sum(), 1e-6, None)
    act_pct = np.clip(act_hist / act_hist.sum(), 1e-6, None)
    return float(np.sum((act_pct - exp_pct) * np.log(act_pct / exp_pct)))


def drift_table(panel: pd.DataFrame) -> pd.DataFrame:
    train = panel[panel["date"] < pd.Timestamp("2020-01-01")]
    test = panel[panel["date"] >= pd.Timestamp("2020-01-01")]
    rows = []
    for feature in ["sentiment_mean", "article_count", "return_1d", "volatility_20d"]:
        rows.append(
            {
                "feature": feature,
                "train_mean_2019": float(train[feature].mean()),
                "test_mean_2020": float(test[feature].mean()),
                "psi_2019_2020": psi(train[feature], test[feature]),
            }
        )
    return pd.DataFrame(rows)


def dataset_diagnostics(news: pd.DataFrame, panel: pd.DataFrame) -> dict[str, object]:
    per_year = (
        news.assign(year=news["publish_dt"].dt.year)
        .groupby("year")
        .agg(articles=("ticker", "size"), tickers=("ticker", "nunique"))
        .reset_index()
        .to_dict(orient="records")
    )
    return {
        "tickers": TICKERS,
        "articles": int(len(news)),
        "ticker_days_with_news": int(news.groupby(["ticker", "publish_date"]).ngroups),
        "midnight_share": float(news["is_midnight"].mean()),
        "after_hours_share": float(news["after_hours"].mean()),
        "panel_rows": int(len(panel)),
        "panel_train_rows_2019": int((panel["date"] < pd.Timestamp("2020-01-01")).sum()),
        "panel_test_rows_2020": int((panel["date"] >= pd.Timestamp("2020-01-01")).sum()),
        "per_year": per_year,
    }


def plot_auc_comparison(results: pd.DataFrame, output_path: Path) -> None:
    order = ["price", "price_news"]
    labels = ["Static", "Rolling"]
    x = np.arange(len(order))
    width = 0.35

    static = results[results["scheme"] == "static"].set_index("feature_set").reindex(order)
    rolling = results[results["scheme"] == "rolling"].set_index("feature_set").reindex(order)

    fig, ax = plt.subplots(figsize=(7.0, 4.2))
    ax.bar(x - width / 2, static["auc"], width=width, label=labels[0], color="#4C78A8")
    ax.bar(x + width / 2, rolling["auc"], width=width, label=labels[1], color="#F58518")
    ax.set_xticks(x)
    ax.set_xticklabels(["Price only", "Price + news"])
    ax.set_ylabel("ROC-AUC")
    ax.set_ylim(0.45, max(results["auc"].max() + 0.03, 0.56))
    ax.axhline(0.5, linestyle="--", color="gray", linewidth=1)
    ax.legend(frameon=False)
    ax.set_title("Timestamp subset: static vs rolling validation")
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)


def plot_drift(drift: pd.DataFrame, output_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(7.0, 4.0))
    ax.bar(drift["feature"], drift["psi_2019_2020"], color="#54A24B")
    ax.axhline(0.1, linestyle="--", color="gray", linewidth=1, label="Mild drift")
    ax.axhline(0.25, linestyle=":", color="gray", linewidth=1, label="Strong drift")
    ax.set_ylabel("PSI")
    ax.set_title("Feature drift from 2019 train to 2020 test")
    ax.tick_params(axis="x", rotation=20)
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    figures_dir = args.output_dir / "figures"
    figures_dir.mkdir(parents=True, exist_ok=True)

    news = load_news_subset(args.data_dir, years=[2019, 2020], tickers=TICKERS)
    news_daily = aggregate_news(news)
    price = load_price_panel(TICKERS, start="2018-11-01", end="2021-01-15")
    panel = build_panel(news_daily, price)

    rows = []
    for model_name in ["logistic", "xgboost"]:
        for feature_set, features in {
            "price": PRICE_FEATURES,
            "price_news": PRICE_FEATURES + NEWS_FEATURES,
        }.items():
            static_metrics = evaluate_static(panel, model_name, features)
            static_metrics.update({"model": model_name, "feature_set": feature_set, "scheme": "static"})
            rows.append(static_metrics)
            rolling_metrics, _ = evaluate_rolling(panel, model_name, features)
            rolling_metrics.update({"model": model_name, "feature_set": feature_set, "scheme": "rolling"})
            rows.append(rolling_metrics)

    metrics = pd.DataFrame(rows)
    diagnostics = dataset_diagnostics(news, panel)
    drift = drift_table(panel)

    metrics.to_csv(args.output_dir / "metrics.csv", index=False)
    drift.to_csv(args.output_dir / "drift.csv", index=False)
    panel.to_parquet(args.output_dir / "panel.parquet", index=False)
    with (args.output_dir / "diagnostics.json").open("w", encoding="utf-8") as handle:
        json.dump(diagnostics, handle, indent=2, ensure_ascii=False)

    plot_auc_comparison(metrics[metrics["model"] == "xgboost"], figures_dir / "timestamp_auc_static_vs_rolling.png")
    plot_drift(drift, figures_dir / "timestamp_feature_drift.png")

    summary = {
        "best_static_auc": float(
            metrics[(metrics["model"] == "xgboost") & (metrics["scheme"] == "static") & (metrics["feature_set"] == "price_news")]["auc"].iloc[0]
        ),
        "best_rolling_auc": float(
            metrics[(metrics["model"] == "xgboost") & (metrics["scheme"] == "rolling") & (metrics["feature_set"] == "price_news")]["auc"].iloc[0]
        ),
        "midnight_share": diagnostics["midnight_share"],
        "after_hours_share": diagnostics["after_hours_share"],
    }
    with (args.output_dir / "summary.json").open("w", encoding="utf-8") as handle:
        json.dump(summary, handle, indent=2, ensure_ascii=False)

    print(metrics)
    print(drift)
    print(json.dumps(diagnostics, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
