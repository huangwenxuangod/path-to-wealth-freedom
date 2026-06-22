"""Event-aware sentiment factors for overnight abnormal-return alpha.

This script adapts the event-aware sentiment-factor idea to public company news.
It uses company-linked news with publish timestamps, filters financially material
events via a lightweight rule taxonomy, constructs event-aware sentiment
features, and evaluates overnight abnormal-return ranking performance under
static and rolling validation.
"""

from __future__ import annotations

import argparse
import json
import lzma
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
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from xgboost import XGBRegressor


SEED = 42
TICKERS = ["AAPL", "GOOGL", "MSFT", "TSLA"]
BENCHMARK = "SPY"
EVENT_RULES: dict[str, list[str]] = {
    "earnings_guidance": [
        r"\bearnings?\b", r"\brevenue\b", r"\bprofit\b", r"\bforecast\b",
        r"\boutlook\b", r"\bguidance\b", r"\bquarter\b", r"\bq[1-4]\b",
        r"\bbeat\b", r"\bmiss\b",
    ],
    "analyst_rating": [
        r"\bupgrade[sd]?\b", r"\bdowngrade[sd]?\b", r"\brating\b",
        r"\bprice target\b", r"\boverweight\b", r"\bund(er)?weight\b",
        r"\bbuy rating\b", r"\bsell rating\b", r"\bneutral\b",
    ],
    "mna_partnership": [
        r"\bacqui(re|sition|red)\b", r"\bmerger\b", r"\bbuyout\b",
        r"\bstake\b", r"\bpartnership\b", r"\bdeal\b", r"\binvestment\b",
        r"\bjoint venture\b",
    ],
    "legal_regulatory": [
        r"\blawsuit\b", r"\bsued\b", r"\bsettlement\b", r"\bprobe\b",
        r"\binvestigation\b", r"\bsec\b", r"\bdoj\b", r"\bfine\b",
        r"\bpenalt(y|ies)\b", r"\bantitrust\b", r"\bchapter 11\b",
        r"\bbankruptcy\b", r"\bcourt\b",
    ],
    "capital_allocation": [
        r"\bdividend\b", r"\bbuyback\b", r"\brepurchase\b", r"\bshare split\b",
        r"\boffering\b", r"\bissuance\b", r"\bsecondary offering\b",
    ],
    "product_operations": [
        r"\blaunch\b", r"\brelease\b", r"\bapproval\b", r"\brecall\b",
        r"\boutage\b", r"\bdelay\b", r"\bproduction\b", r"\bfactory\b",
        r"\bdemand\b", r"\bsupply\b", r"\bshipment\b",
    ],
    "management_change": [
        r"\bceo\b", r"\bcfo\b", r"\bchair(man|woman)?\b", r"\bresign",
        r"\bappoint", r"\bexecutive\b", r"\bboard\b",
    ],
}

PRICE_FEATURES = [
    "return_1d",
    "return_5d",
    "return_20d",
    "volatility_5d",
    "volatility_20d",
    "ma_gap_5_20",
    "volume_change_1d",
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
    with urllib.request.urlopen(url, timeout=180) as response:
        path.write_bytes(response.read())
    return path


def clean_text(*parts: object) -> str:
    text = " ".join("" if part is None else str(part) for part in parts)
    text = text.replace("&amp;", "&")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def detect_events(text: str) -> list[str]:
    lowered = text.lower()
    labels = [name for name, patterns in EVENT_RULES.items() if any(re.search(p, lowered) for p in patterns)]
    return labels


def is_overnight_eligible(dt: pd.Timestamp) -> bool:
    hour = dt.hour
    minute = dt.minute
    return (hour >= 16) or (hour < 9) or (hour == 9 and minute < 30)


def build_trading_calendar(tickers: list[str], start: str, end: str) -> pd.DatetimeIndex:
    benchmark = download_yahoo_prices(BENCHMARK, start, end)
    return pd.DatetimeIndex(benchmark["date"].sort_values().unique())


def next_trading_day(date: pd.Timestamp, trading_days: pd.DatetimeIndex) -> pd.Timestamp | None:
    idx = trading_days.searchsorted(date, side="left")
    if idx >= len(trading_days):
        return None
    return pd.Timestamp(trading_days[idx]).normalize()


def previous_trading_day(date: pd.Timestamp, trading_days: pd.DatetimeIndex) -> pd.Timestamp | None:
    idx = trading_days.searchsorted(date, side="left") - 1
    if idx < 0:
        return None
    return pd.Timestamp(trading_days[idx]).normalize()


def map_signal_date(dt: pd.Timestamp, trading_days: pd.DatetimeIndex) -> pd.Timestamp | None:
    date = dt.normalize()
    if dt.hour >= 16:
        return next_trading_day(date + pd.Timedelta(days=1), trading_days)
    if date in trading_days:
        return date
    return next_trading_day(date, trading_days)


def load_news_subset(
    data_dir: Path,
    years: list[int],
    tickers: list[str],
    trading_days: pd.DatetimeIndex,
) -> pd.DataFrame:
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
            dt = pd.to_datetime(item.get("date_publish"), errors="coerce")
            if pd.isna(dt) or not is_overnight_eligible(dt):
                continue
            text = clean_text(item.get("title"), item.get("description"))
            if not text:
                continue
            events = detect_events(text)
            if not events:
                continue
            signal_date = map_signal_date(dt, trading_days)
            if signal_date is None:
                continue
            sentiment = analyzer.polarity_scores(text)["compound"]
            for ticker in matched:
                rows.append(
                    {
                        "ticker": ticker,
                        "publish_dt": dt,
                        "signal_date": signal_date,
                        "publish_time": dt.strftime("%H:%M:%S"),
                        "is_midnight": int(dt.strftime("%H:%M:%S") == "00:00:00"),
                        "after_hours": int(dt.hour >= 16),
                        "pre_market": int(dt.hour < 9 or (dt.hour == 9 and dt.minute < 30)),
                        "sentiment": sentiment,
                        "sentiment_abs": abs(sentiment),
                        "events": events,
                    }
                )
    news = pd.DataFrame(rows).sort_values(["ticker", "publish_dt"]).reset_index(drop=True)
    if news.empty:
        raise ValueError("No event-filtered news rows were loaded.")
    return news


def aggregate_news(news: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    for (ticker, signal_date), group in news.groupby(["ticker", "signal_date"]):
        row: dict[str, object] = {
            "ticker": ticker,
            "date": signal_date,
            "article_count": int(len(group)),
            "sentiment_mean": float(group["sentiment"].mean()),
            "sentiment_abs_mean": float(group["sentiment_abs"].mean()),
            "sentiment_sum": float(group["sentiment"].sum()),
            "positive_share": float(np.mean(group["sentiment"] >= 0.05)),
            "negative_share": float(np.mean(group["sentiment"] <= -0.05)),
            "after_hours_share": float(group["after_hours"].mean()),
            "pre_market_share": float(group["pre_market"].mean()),
            "midnight_share": float(group["is_midnight"].mean()),
            "has_event_news": 1,
        }
        events_series = group["events"]
        for event_name in EVENT_RULES:
            mask = events_series.apply(lambda labels: event_name in labels)
            row[f"{event_name}_count"] = int(mask.sum())
            row[f"{event_name}_signed"] = float(group.loc[mask, "sentiment"].sum()) if mask.any() else 0.0
            row[f"{event_name}_any"] = int(mask.any())
        rows.append(row)
    return pd.DataFrame(rows).sort_values(["date", "ticker"]).reset_index(drop=True)


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
        except Exception as exc:
            last_error = exc
            time.sleep(2 + attempt * 2)
    else:
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
    return frame.dropna(subset=["adj_close"]).sort_values("date").reset_index(drop=True)


def load_price_panel(tickers: list[str], start: str, end: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    stock_frames = [download_yahoo_prices(ticker, start, end) for ticker in tickers]
    benchmark = download_yahoo_prices(BENCHMARK, start, end)

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
        group["overnight_return"] = group["open"] / group["close"].shift(1) - 1
        return group

    benchmark = benchmark.copy()
    benchmark["market_overnight_return"] = benchmark["open"] / benchmark["close"].shift(1) - 1
    benchmark = benchmark[["date", "market_overnight_return"]]

    enriched = [add_features(ticker, group) for ticker, group in pd.concat(stock_frames).groupby("ticker")]
    price = pd.concat(enriched, ignore_index=True).merge(benchmark, on="date", how="left")
    price["target_abnormal_return"] = price["overnight_return"] - price["market_overnight_return"]
    return price.sort_values(["date", "ticker"]).reset_index(drop=True), benchmark


def build_panel(news_daily: pd.DataFrame, price: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    panel = price.merge(news_daily, on=["ticker", "date"], how="left")
    event_features = [
        "article_count",
        "sentiment_mean",
        "sentiment_abs_mean",
        "sentiment_sum",
        "positive_share",
        "negative_share",
        "after_hours_share",
        "pre_market_share",
        "midnight_share",
        "has_event_news",
    ]
    for event_name in EVENT_RULES:
        event_features.extend([f"{event_name}_count", f"{event_name}_signed", f"{event_name}_any"])
    for column in event_features:
        panel[column] = panel[column].fillna(0.0)
    panel = panel.replace([np.inf, -np.inf], np.nan)
    panel = panel.dropna(subset=PRICE_FEATURES + ["target_abnormal_return"])
    panel = panel.sort_values(["date", "ticker"]).reset_index(drop=True)
    return panel, event_features


def make_model(name: str, features: list[str]) -> Pipeline:
    if name == "ridge":
        estimator = Ridge(alpha=1.0, random_state=SEED)
        transformer = Pipeline(
            [("imputer", SimpleImputer(strategy="median")), ("scale", StandardScaler())]
        )
    elif name == "xgboost":
        estimator = XGBRegressor(
            n_estimators=250,
            max_depth=3,
            learning_rate=0.04,
            subsample=0.85,
            colsample_bytree=0.85,
            min_child_weight=6,
            reg_alpha=0.1,
            reg_lambda=2.0,
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


def safe_corr(a: pd.Series, b: pd.Series) -> float:
    if len(a) < 2 or a.nunique() < 2 or b.nunique() < 2:
        return np.nan
    return float(np.corrcoef(a, b)[0, 1])


def evaluate_predictions(predictions: pd.DataFrame) -> tuple[dict[str, float], pd.DataFrame]:
    predictions = predictions.copy()
    predictions["pred_rank"] = predictions.groupby("date")["score"].rank(method="average")
    predictions["true_rank"] = predictions.groupby("date")["target_abnormal_return"].rank(method="average")

    daily_rows = []
    for date, group in predictions.groupby("date"):
        rank_ic = safe_corr(group["pred_rank"], group["true_rank"])
        ic = safe_corr(group["score"], group["target_abnormal_return"])
        ordered = group.sort_values("score")
        spread = ordered.iloc[-1]["target_abnormal_return"] - ordered.iloc[0]["target_abnormal_return"]
        top_return = ordered.iloc[-1]["target_abnormal_return"]
        signal_coverage = float(np.mean(group["has_event_news"] > 0))
        daily_rows.append(
            {
                "date": date,
                "rank_ic": rank_ic,
                "ic": ic,
                "top_bottom_spread": spread,
                "top_return": top_return,
                "signal_coverage": signal_coverage,
            }
        )
    daily = pd.DataFrame(daily_rows).sort_values("date")
    spread_mean = float(daily["top_bottom_spread"].mean())
    spread_std = float(daily["top_bottom_spread"].std(ddof=0))
    sharpe = spread_mean / spread_std * np.sqrt(252) if spread_std > 0 else np.nan
    metrics = {
        "pearson_ic_mean": float(daily["ic"].mean()),
        "rank_ic_mean": float(daily["rank_ic"].mean()),
        "spread_mean": spread_mean,
        "spread_sharpe": float(sharpe),
        "top_return_mean": float(daily["top_return"].mean()),
        "signal_coverage_mean": float(daily["signal_coverage"].mean()),
        "days": int(len(daily)),
    }
    return metrics, daily


def evaluate_static(panel: pd.DataFrame, model_name: str, features: list[str]) -> tuple[dict[str, float], pd.DataFrame]:
    train = panel[panel["date"] < pd.Timestamp("2020-01-01")].copy()
    test = panel[panel["date"] >= pd.Timestamp("2020-01-01")].copy()
    model = make_model(model_name, features)
    model.fit(train[features], train["target_abnormal_return"])
    test = test.copy()
    test["score"] = model.predict(test[features])
    metrics, daily = evaluate_predictions(test[["date", "ticker", "target_abnormal_return", "score", "has_event_news"]])
    metrics.update({"train_rows": int(len(train)), "test_rows": int(len(test))})
    return metrics, daily


def monthly_windows() -> list[Window]:
    months = pd.date_range("2020-01-01", "2020-12-01", freq="MS")
    windows = []
    for month in months:
        train_end = month - pd.Timedelta(days=1)
        train_start = month - pd.DateOffset(months=6)
        windows.append(
            Window(
                label=month.strftime("%Y-%m"),
                train_start=train_start.normalize(),
                train_end=train_end.normalize(),
                test_start=month.normalize(),
                test_end=(month + pd.offsets.MonthEnd(1)).normalize(),
            )
        )
    return windows


def evaluate_rolling(panel: pd.DataFrame, model_name: str, features: list[str]) -> tuple[dict[str, float], pd.DataFrame]:
    preds = []
    for window in monthly_windows():
        train = panel[(panel["date"] >= window.train_start) & (panel["date"] <= window.train_end)].copy()
        test = panel[(panel["date"] >= window.test_start) & (panel["date"] <= window.test_end)].copy()
        if train.empty or test.empty:
            continue
        model = make_model(model_name, features)
        model.fit(train[features], train["target_abnormal_return"])
        test["score"] = model.predict(test[features])
        test["window"] = window.label
        preds.append(test[["date", "ticker", "target_abnormal_return", "score", "has_event_news", "window"]])
    predictions = pd.concat(preds, ignore_index=True)
    metrics, daily = evaluate_predictions(predictions[["date", "ticker", "target_abnormal_return", "score", "has_event_news"]])
    return metrics, daily


def diagnostics(news: pd.DataFrame, panel: pd.DataFrame) -> dict[str, object]:
    event_counts = {}
    for name in EVENT_RULES:
        event_counts[name] = int(news["events"].apply(lambda labels: name in labels).sum())
    return {
        "tickers": TICKERS,
        "articles": int(len(news)),
        "signal_days": int(news.groupby(["ticker", "signal_date"]).ngroups),
        "after_hours_share": float(news["after_hours"].mean()),
        "pre_market_share": float(news["pre_market"].mean()),
        "midnight_share": float(news["is_midnight"].mean()),
        "panel_rows": int(len(panel)),
        "train_rows_2019": int((panel["date"] < pd.Timestamp("2020-01-01")).sum()),
        "test_rows_2020": int((panel["date"] >= pd.Timestamp("2020-01-01")).sum()),
        "event_counts": event_counts,
    }


def plot_event_mix(news: pd.DataFrame, output_path: Path) -> None:
    counts = {
        name: int(news["events"].apply(lambda labels: name in labels).sum())
        for name in EVENT_RULES
    }
    labels = list(counts.keys())
    values = [counts[name] for name in labels]
    fig, ax = plt.subplots(figsize=(7.0, 4.0))
    ax.bar(labels, values, color="#4C78A8")
    ax.set_ylabel("Article count")
    ax.set_title("Event-aware filtered news mix")
    ax.tick_params(axis="x", rotation=25)
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)


def plot_ic_comparison(results: pd.DataFrame, output_path: Path) -> None:
    order = ["price", "price_event"]
    labels = ["Static", "Rolling"]
    x = np.arange(len(order))
    width = 0.35
    static = results[results["scheme"] == "static"].set_index("feature_set").reindex(order)
    rolling = results[results["scheme"] == "rolling"].set_index("feature_set").reindex(order)
    fig, axes = plt.subplots(1, 2, figsize=(9.0, 4.0))
    axes[0].bar(x - width / 2, static["rank_ic_mean"], width=width, label=labels[0], color="#4C78A8")
    axes[0].bar(x + width / 2, rolling["rank_ic_mean"], width=width, label=labels[1], color="#F58518")
    axes[0].set_xticks(x)
    axes[0].set_xticklabels(["Price only", "Price + event sentiment"])
    axes[0].set_title("Mean rank IC")
    axes[0].axhline(0.0, linestyle="--", color="gray", linewidth=1)
    axes[0].legend(frameon=False)

    axes[1].bar(x - width / 2, static["spread_sharpe"], width=width, color="#4C78A8")
    axes[1].bar(x + width / 2, rolling["spread_sharpe"], width=width, color="#F58518")
    axes[1].set_xticks(x)
    axes[1].set_xticklabels(["Price only", "Price + event sentiment"])
    axes[1].set_title("Top-bottom spread Sharpe")
    axes[1].axhline(0.0, linestyle="--", color="gray", linewidth=1)
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)


def plot_cumulative_spread(daily_map: dict[str, pd.DataFrame], output_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(8.0, 4.5))
    for label, daily in daily_map.items():
        cumulative = (1 + daily["top_bottom_spread"].fillna(0.0)).cumprod()
        ax.plot(daily["date"], cumulative, label=label)
    ax.set_ylabel("Cumulative wealth")
    ax.set_title("Top-minus-bottom overnight abnormal-return spread")
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

    trading_days = build_trading_calendar(TICKERS, "2018-11-01", "2021-01-15")
    news = load_news_subset(args.data_dir, [2019, 2020], TICKERS, trading_days)
    news_daily = aggregate_news(news)
    price, _ = load_price_panel(TICKERS, "2018-11-01", "2021-01-15")
    panel, event_features = build_panel(news_daily, price)

    result_rows = []
    daily_series: dict[str, pd.DataFrame] = {}
    feature_map = {
        "price": PRICE_FEATURES,
        "price_event": PRICE_FEATURES + event_features,
    }
    for model_name in ["ridge", "xgboost"]:
        for feature_set, features in feature_map.items():
            static_metrics, static_daily = evaluate_static(panel, model_name, features)
            static_metrics.update({"model": model_name, "feature_set": feature_set, "scheme": "static"})
            result_rows.append(static_metrics)
            daily_series[f"{model_name}-{feature_set}-static"] = static_daily

            rolling_metrics, rolling_daily = evaluate_rolling(panel, model_name, features)
            rolling_metrics.update({"model": model_name, "feature_set": feature_set, "scheme": "rolling"})
            result_rows.append(rolling_metrics)
            daily_series[f"{model_name}-{feature_set}-rolling"] = rolling_daily

    results = pd.DataFrame(result_rows)
    diag = diagnostics(news, panel)

    results.to_csv(args.output_dir / "metrics.csv", index=False)
    panel.to_parquet(args.output_dir / "panel.parquet", index=False)
    with (args.output_dir / "diagnostics.json").open("w", encoding="utf-8") as handle:
        json.dump(diag, handle, indent=2, ensure_ascii=False)

    plot_event_mix(news, figures_dir / "event_alpha_event_mix.png")
    plot_ic_comparison(results[results["model"] == "xgboost"], figures_dir / "event_alpha_ic_comparison.png")
    plot_cumulative_spread(
        {
            "XGBoost price only static": daily_series["xgboost-price-static"],
            "XGBoost price+event static": daily_series["xgboost-price_event-static"],
            "XGBoost price+event rolling": daily_series["xgboost-price_event-rolling"],
        },
        figures_dir / "event_alpha_cumulative_spread.png",
    )

    daily_dir = args.output_dir / "daily"
    daily_dir.mkdir(exist_ok=True)
    for label, daily in daily_series.items():
        daily.to_csv(daily_dir / f"{label}.csv", index=False)

    print(results)
    print(json.dumps(diag, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
