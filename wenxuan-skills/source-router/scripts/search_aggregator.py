from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from config import get_default_config, has_provider_credentials
from providers import (
    ProviderResult,
    search_bilibili,
    search_bing,
    search_brave,
    search_exa,
    search_firecrawl,
    search_github,
    search_github_code,
    search_github_discussions,
    search_github_issues,
    search_google_cse,
    search_metaso,
    search_reddit,
    search_serpapi,
    search_serper,
    search_tavily,
    search_tikhub,
    search_x,
    search_youtube,
)

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = BASE_DIR / "output"

SOURCE_ROUTING: Dict[str, List[str]] = {
    "concept_explainer": ["tavily", "exa", "brave", "bing", "google_cse"],
    "technical_howto": ["github", "github_issues", "github_code", "reddit", "tavily", "exa"],
    "repo_lookup": ["github", "github_issues", "github_code", "reddit", "tavily", "exa"],
    "tool_selection": ["github", "reddit", "tavily", "exa", "brave"],
    "trend_signal": ["tavily", "exa", "brave", "bing", "serper"],
    "video_search": ["youtube", "bilibili", "tavily", "exa"],
    "creator_capture": ["youtube", "x", "bilibili", "reddit", "tavily", "tikhub"],
    "social_tactic": ["tikhub", "x", "bilibili", "youtube", "tavily", "brave"],
}

SOCIAL_PLATFORM_HINTS: Dict[str, List[str]] = {
    "github": ["github", "repo", "repository", "开源", "代码", "issue", "discussion"],
    "youtube": ["youtube", "油管", "频道", "video", "视频"],
    "bilibili": ["b站", "bilibili", "up主", "up"],
    "x": ["x ", "twitter", "推特", "推文", "thread"],
    "reddit": ["reddit", "subreddit", "红迪"],
    "xhs": ["小红书", "xhs", "rednote"],
    "douyin": ["抖音", "douyin"],
    "wechat": ["公众号", "视频号", "微信"],
}

PLATFORM_PROVIDER_MAP: Dict[str, List[str]] = {
    "github": ["github", "github_issues", "github_code", "github_discussions"],
    "youtube": ["youtube", "tavily", "exa", "brave"],
    "bilibili": ["bilibili", "tikhub", "tavily", "exa"],
    "x": ["x", "tavily", "exa", "brave"],
    "reddit": ["reddit", "tavily", "exa", "brave"],
    "xhs": ["tikhub", "tavily", "brave"],
    "douyin": ["tikhub", "tavily", "brave"],
    "wechat": ["tikhub", "tavily", "brave"],
}

DIRECT_PROVIDER_ALIASES = {
    "github": "github",
    "github_issues": "github_issues",
    "github_code": "github_code",
    "github_discussions": "github_discussions",
    "tavily": "tavily",
    "exa": "exa",
    "brave": "brave",
    "metaso": "metaso",
    "serpapi": "serpapi",
    "serper": "serper",
    "bing": "bing",
    "google_cse": "google_cse",
    "firecrawl": "firecrawl",
    "tikhub": "tikhub",
    "youtube": "youtube",
    "reddit": "reddit",
    "x": "x",
    "bilibili": "bilibili",
}


def slugify(value: str) -> str:
    slug = re.sub(r"[^\w\-一-鿿]+", "-", value.strip().lower())
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "query"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_output_dir() -> Path:
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return DEFAULT_OUTPUT_DIR


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    return re.sub(r"\s+", " ", text)


def dedupe_results(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen: Dict[str, Dict[str, Any]] = {}
    ordered: List[Dict[str, Any]] = []
    for item in items:
        url = normalize_text(item.get("url") or item.get("source_url"))
        title = normalize_text(item.get("title"))
        key = url or title
        if not key:
            continue
        if key in seen:
            existing = seen[key]
            if len(normalize_text(item.get("snippet") or item.get("body"))) > len(normalize_text(existing.get("snippet") or existing.get("body"))):
                existing.update(item)
            continue
        seen[key] = item
        ordered.append(item)
    return ordered


def score_result(item: Dict[str, Any], query: str, creator_hint: str = "", platform_hint: str = "") -> float:
    text = " ".join(
        [
            normalize_text(item.get("title")),
            normalize_text(item.get("snippet") or item.get("body")),
            normalize_text(item.get("platform")),
            normalize_text(item.get("source_type")),
        ]
    ).lower()
    score = float(item.get("score") or 0)
    for token in [query, creator_hint, platform_hint]:
        token_norm = normalize_text(token).lower()
        if token_norm and token_norm in text:
            score += 5.0
    if item.get("metadata", {}).get("auth_mode") == "anonymous_fallback":
        score -= 1.0
    return score


def normalize_item(item: Dict[str, Any], *, provider: str, platform: Optional[str] = None) -> Dict[str, Any]:
    normalized = {
        "platform": platform or item.get("platform") or item.get("source_type") or provider,
        "type": item.get("type") or item.get("source_type") or "result",
        "title": normalize_text(item.get("title")),
        "body": normalize_text(item.get("body") or item.get("snippet")),
        "transcript": normalize_text(item.get("transcript")),
        "comments": item.get("comments") or [],
        "stats": item.get("stats") or {},
        "published_at": item.get("published_at"),
        "source_url": normalize_text(item.get("url") or item.get("source_url")),
        "media_urls": item.get("media_urls") or [],
        "tags": item.get("tags") or [],
        "provider": provider,
        "source_type": item.get("source_type") or provider,
        "score": item.get("score"),
        "metadata": item.get("metadata") or {},
        "author": item.get("author") or {},
    }
    if not normalized["body"] and normalized["transcript"]:
        normalized["body"] = normalized["transcript"][:500]
    return normalized


def build_creator_profile(creator_hint: str, platform_hint: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
    profile = {
        "platform": platform_hint or "unknown",
        "display_name": creator_hint or "",
        "handle": creator_hint or "",
        "bio": "",
        "profile_url": "",
        "followers": None,
        "verified": None,
        "aliases": [],
        "discovered_from": [],
    }
    for item in items:
        author = item.get("author") or {}
        if author.get("display_name") and not profile["display_name"]:
            profile["display_name"] = author["display_name"]
        if author.get("handle") and not profile["handle"]:
            profile["handle"] = author["handle"]
        if author.get("bio") and not profile["bio"]:
            profile["bio"] = author["bio"]
        if author.get("profile_url") and not profile["profile_url"]:
            profile["profile_url"] = author["profile_url"]
        if author.get("followers") is not None and profile["followers"] is None:
            profile["followers"] = author["followers"]
        if author.get("verified") is not None and profile["verified"] is None:
            profile["verified"] = author["verified"]
        source_url = item.get("source_url")
        if source_url and source_url not in profile["discovered_from"]:
            profile["discovered_from"].append(source_url)
    return profile


def run_provider(provider: str, query: str, config) -> ProviderResult:
    token = os.getenv("GITHUB_TOKEN", "")
    if provider == "github":
        return search_github(query, config, token)
    if provider == "github_issues":
        return search_github_issues(query, config, token)
    if provider == "github_discussions":
        return search_github_discussions(query, config, token)
    if provider == "github_code":
        return search_github_code(query, config, token)
    if provider == "youtube":
        return search_youtube(query, config)
    if provider == "reddit":
        return search_reddit(query, config)
    if provider == "x":
        return search_x(query, config)
    if provider == "bilibili":
        return search_bilibili(query, config)
    if provider == "tavily":
        return search_tavily(query, config, os.getenv("TAVILY_API_KEY", ""))
    if provider == "exa":
        return search_exa(query, config, os.getenv("EXA_API_KEY", ""))
    if provider == "brave":
        return search_brave(query, config, os.getenv("BRAVE_SEARCH_API_KEY", ""))
    if provider == "metaso":
        return search_metaso(query, config, os.getenv("METASO_API_KEY", ""))
    if provider == "serpapi":
        return search_serpapi(query, config, os.getenv("SERPAPI_API_KEY", ""))
    if provider == "serper":
        return search_serper(query, config, os.getenv("SERPER_API_KEY", ""))
    if provider == "bing":
        return search_bing(query, config, os.getenv("BING_SEARCH_API_KEY", ""))
    if provider == "google_cse":
        return search_google_cse(query, config, os.getenv("GOOGLE_CSE_API_KEY", ""), os.getenv("GOOGLE_CSE_ENGINE_ID", ""))
    if provider == "firecrawl":
        return search_firecrawl(query, config, os.getenv("FIRECRAWL_API_KEY", ""))
    if provider == "tikhub":
        return search_tikhub(query, config, os.getenv("TIKHUB_API_KEY", ""))
    return ProviderResult(provider, query, False, [], f"Unknown provider: {provider}", {"status": "unknown_provider"})


def infer_platform_hint(query: str, platform_hint: str = "") -> str:
    if platform_hint:
        return platform_hint
    query_lower = f" {query.lower()} "
    for platform, keywords in SOCIAL_PLATFORM_HINTS.items():
        if any(keyword.lower() in query_lower for keyword in keywords):
            return platform
    return ""


def infer_task_type(query: str, task_type: str = "", platform_hint: str = "", creator_hint: str = "") -> str:
    if task_type:
        return task_type
    q = query.lower()
    if creator_hint or any(token in q for token in ["博主", "up主", "频道", "账号", "creator", "handle", "作者", "抓取", "全部内容"]):
        return "creator_capture"
    if any(token in q for token in ["什么是", "是啥", "定义", "概念"]):
        return "concept_explainer"
    if any(token in q for token in ["repo", "仓库", "项目", "开源"]):
        return "repo_lookup"
    if any(token in q for token in ["教程", "how to", "怎么做", "实现"]):
        return "technical_howto"
    inferred_platform = infer_platform_hint(query, platform_hint)
    if inferred_platform in {"youtube", "bilibili"}:
        return "video_search"
    if inferred_platform in {"xhs", "douyin", "wechat", "x", "reddit"}:
        return "social_tactic"
    return "trend_signal"


def build_provider_plan(query: str, task_type: str, platform_hint: str, explicit_providers: List[str]) -> List[str]:
    if explicit_providers:
        return explicit_providers

    providers = SOURCE_ROUTING.get(task_type, []).copy()
    if platform_hint:
        providers = PLATFORM_PROVIDER_MAP.get(platform_hint, []).copy() + providers

    deduped: List[str] = []
    for provider in providers:
        mapped = DIRECT_PROVIDER_ALIASES.get(provider, provider)
        if mapped not in deduped:
            deduped.append(mapped)
    return deduped or get_default_config().providers


def aggregate_search(query: str, providers: List[str], *, task_type: str = "", platform_hint: str = "", creator_hint: str = "") -> Dict[str, Any]:
    config = get_default_config()
    config.providers = providers
    attempted: List[str] = []
    failures: List[Dict[str, Any]] = []
    collected: List[Dict[str, Any]] = []
    inferred_platform = infer_platform_hint(query, platform_hint)

    for provider in providers:
        attempted.append(provider)
        if not has_provider_credentials(provider):
            failures.append({"provider": provider, "error": "Missing required credentials"})
            continue

        result = run_provider(provider, query, config)
        platform = provider if provider in {"youtube", "reddit", "x", "bilibili"} else inferred_platform

        if result.success and result.results:
            normalized_batch = [normalize_item(item, provider=provider, platform=platform) for item in result.results]
            collected.extend(normalized_batch)
        else:
            failures.append({"provider": provider, "error": result.error, "meta": result.meta})

    deduped = dedupe_results(
        [
            {
                **item,
                "score": score_result(item, query, creator_hint=creator_hint, platform_hint=platform_hint or inferred_platform),
            }
            for item in collected
        ]
    )
    ranked = sorted(deduped, key=lambda item: item.get("score") or 0, reverse=True)
    creator = build_creator_profile(creator_hint, platform_hint or inferred_platform, ranked)

    return {
        "query": query,
        "task_type": task_type,
        "platform_hint": platform_hint or inferred_platform,
        "creator_hint": creator_hint,
        "success": bool(ranked),
        "results": ranked,
        "creator": creator,
        "related_links": [item["source_url"] for item in ranked if item.get("source_url")][:20],
        "capture_meta": {
            "attempted_providers": attempted,
            "failed_providers": failures,
            "captured_count": len(ranked),
            "captured_at": utc_now_iso(),
            "completeness": "partial" if failures else "high",
        },
        "error": None if ranked else "All configured providers failed or returned no usable results",
    }


def save_capture(result: Dict[str, Any], task_type: str, query: str) -> Dict[str, str]:
    output_dir = ensure_output_dir()
    slug = slugify(query)[:80]
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    json_path = output_dir / f"{timestamp}-{task_type}-{slug}.json"
    md_path = output_dir / f"{timestamp}-{task_type}-{slug}.md"

    json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        f"# {query}",
        "",
        f"- 任务类型: {task_type}",
        f"- 平台提示: {result.get('platform_hint') or '无'}",
        f"- Creator Hint: {result.get('creator_hint') or '无'}",
        f"- 抓取时间: {result.get('capture_meta', {}).get('captured_at', '')}",
        f"- 成功: {result.get('success')}",
        "",
        "## Creator",
        json.dumps(result.get("creator", {}), ensure_ascii=False, indent=2),
        "",
        "## Related Links",
    ]
    for link in result.get("related_links", []):
        lines.append(f"- {link}")
    lines.append("")
    lines.append("## Items")
    for idx, item in enumerate(result.get("results", []), start=1):
        lines.extend(
            [
                f"### {idx}. {item.get('title') or '(无标题)'}",
                f"- 平台: {item.get('platform')}",
                f"- 类型: {item.get('type')}",
                f"- 链接: {item.get('source_url')}",
                f"- 发布时间: {item.get('published_at')}",
                f"- Score: {item.get('score')}",
                f"- 摘要: {item.get('body')[:500]}",
                "",
            ]
        )

    md_path.write_text("\n".join(lines), encoding="utf-8")
    return {"json": str(json_path), "markdown": str(md_path)}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Search aggregator for wenxuan source-router skill")
    parser.add_argument("--query", required=True, help="Search query")
    parser.add_argument("--providers", default="", help="Comma-separated provider priority list")
    parser.add_argument("--task-type", default="", help="Task type such as concept_explainer, repo_lookup, creator_capture")
    parser.add_argument("--platform", default="", help="Platform hint such as github, youtube, bilibili, x, reddit, xhs, douyin")
    parser.add_argument("--creator", default="", help="Creator hint, handle, or account name")
    parser.add_argument("--save", action="store_true", help="Persist JSON and Markdown outputs under output/")
    parser.add_argument("--json", action="store_true", help="Output raw JSON only")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    explicit_providers = [p.strip() for p in args.providers.split(",") if p.strip()]
    task_type = infer_task_type(args.query, args.task_type, args.platform, args.creator)
    providers = build_provider_plan(args.query, task_type, args.platform, explicit_providers)
    result = aggregate_search(
        args.query,
        providers,
        task_type=task_type,
        platform_hint=args.platform,
        creator_hint=args.creator,
    )

    if args.save:
        result["saved_files"] = save_capture(result, task_type, args.query)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result["success"] else 1

    print(f"Query: {result['query']}")
    print(f"Task type: {result['task_type']}")
    print(f"Platform hint: {result['platform_hint']}")
    print(f"Success: {result['success']}")
    print(f"Attempted providers: {', '.join(result['capture_meta']['attempted_providers'])}")
    if result["success"]:
        print(f"Captured items: {len(result['results'])}")
        for idx, item in enumerate(result["results"][:10], start=1):
            print(f"{idx}. [{item['platform']}] {item['title']}\n   {item['source_url']}\n   {item['body'][:180]}\n")
        if result.get("saved_files"):
            print("Saved files:")
            for kind, path in result["saved_files"].items():
                print(f"- {kind}: {path}")
    else:
        print(f"Error: {result['error']}")
        for failure in result["capture_meta"].get("failed_providers", []):
            print(f"- {failure['provider']}: {failure['error']}")
    return 0 if result["success"] else 1


if __name__ == "__main__":
    sys.exit(main())
