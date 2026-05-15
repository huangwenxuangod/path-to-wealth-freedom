from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from config import env_safety_report, get_budget, get_default_config, get_enabled_provider_keys, get_optional_provider_keys, get_provider_mode, infer_default_mode, has_provider_credentials
from web_access import crawl_site, extract_url
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
    search_tikhub_social,
    search_tikhub_username_content,
    search_x,
    search_youtube,
)

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = BASE_DIR / "output"

SOURCE_ROUTING: Dict[str, List[str]] = {
    "concept_explainer": ["tavily", "exa", "brave", "bing", "google_cse"],
    "entity_context": ["tavily", "exa", "brave", "bing", "google_cse", "reddit", "x"],
    "simple_search": ["tavily", "exa", "brave", "bing", "google_cse"],
    "technical_howto": ["github", "github_issues", "github_code", "reddit", "tavily", "exa"],
    "repo_lookup": ["github", "github_issues", "github_code", "reddit", "tavily", "exa"],
    "tool_selection": ["github", "reddit", "tavily", "exa", "brave"],
    "trend_signal": ["tavily", "exa", "brave", "bing", "serper"],
    "video_search": ["youtube", "bilibili", "tavily", "exa"],
    "url_extract": ["web_access"],
    "site_crawl": ["web_access"],
    "creator_capture": ["tikhub", "youtube", "x", "bilibili", "reddit", "tavily"],
    "social_tactic": ["tikhub", "x", "bilibili", "youtube", "tavily", "brave"],
    "username_content": ["tikhub", "bilibili", "youtube", "x", "tavily"],
}

SOCIAL_PLATFORM_HINTS: Dict[str, List[str]] = {
    "github": ["github", "repo", "repository", "开源", "代码", "issue", "discussion"],
    "youtube": ["youtube", "油管", "频道", "video", "视频"],
    "bilibili": ["b站", "bilibili", "up主", "up"],
    "x": ["x ", "twitter", "推特", "推文", "thread"],
    "reddit": ["reddit", "subreddit", "红迪"],
    "instagram": ["instagram", "ins", "ig", "reels"],
    "xhs": ["小红书", "xhs", "rednote"],
    "douyin": ["抖音", "douyin"],
    "wechat_channels": ["视频号", "微信视频号"],
    "wechat_mp": ["公众号", "微信公号"],
    "wechat": ["微信"],
}

PLATFORM_PROVIDER_MAP: Dict[str, List[str]] = {
    "github": ["github", "github_issues", "github_code", "github_discussions"],
    "youtube": ["tikhub_youtube", "youtube", "tavily", "exa", "brave"],
    "bilibili": ["tikhub", "bilibili", "tavily", "exa"],
    "x": ["tikhub_x", "x", "tavily", "exa", "brave"],
    "reddit": ["tikhub_reddit", "reddit", "tavily", "exa", "brave"],
    "instagram": ["tikhub", "tavily", "brave"],
    "xhs": ["tikhub", "tavily", "brave"],
    "douyin": ["tikhub", "tavily", "brave"],
    "wechat_channels": ["tikhub", "tavily", "brave"],
    "wechat_mp": ["tikhub", "tavily", "brave"],
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
    "youtube_fallback": "youtube",
    "reddit": "reddit",
    "reddit_fallback": "reddit",
    "x": "x",
    "x_fallback": "x",
    "instagram": "tikhub",
    "wechat_channels": "tikhub",
    "wechat_mp": "tikhub",
    "wechat": "tikhub",
    "xhs": "tikhub",
    "douyin": "tikhub",
    "browser": "browser",
    "browser_use": "browser_use",
    "web_access": "web_access",
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


def run_provider(provider: str, query: str, config, *, platform_hint: str = "", creator_hint: str = "", limit: Optional[int] = None, sort_order: str = "relevance") -> ProviderResult:
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
        if platform_hint in {"reddit", "x", "youtube"} and not creator_hint:
            return search_tikhub_social(query, config, os.getenv("TIKHUB_API_KEY", ""), platform=platform_hint, limit=limit, sort_order=sort_order)
        return search_tikhub_username_content(query, config, os.getenv("TIKHUB_API_KEY", ""), platform=platform_hint, username=creator_hint or query, limit=limit, sort_order=sort_order)
    if provider == "tikhub_reddit":
        return search_tikhub_social(query, config, os.getenv("TIKHUB_API_KEY", ""), platform="reddit", limit=limit, sort_order=sort_order)
    if provider == "tikhub_x":
        return search_tikhub_social(query, config, os.getenv("TIKHUB_API_KEY", ""), platform="x", limit=limit, sort_order=sort_order)
    if provider == "tikhub_youtube":
        if creator_hint:
            return search_tikhub_username_content(query, config, os.getenv("TIKHUB_API_KEY", ""), platform="youtube", username=creator_hint, limit=limit, sort_order=sort_order)
        return search_tikhub_social(query, config, os.getenv("TIKHUB_API_KEY", ""), platform="youtube", limit=limit, sort_order=sort_order)
    return ProviderResult(provider, query, False, [], f"Unknown provider: {provider}", {"status": "unknown_provider"})


def infer_platform_hint(query: str, platform_hint: str = "") -> str:
    if platform_hint:
        return platform_hint
    query_lower = f" {query.lower()} "
    for platform, keywords in SOCIAL_PLATFORM_HINTS.items():
        if any(keyword.lower() in query_lower for keyword in keywords):
            return platform
    return ""


URL_PATTERN = re.compile(r"https?://[^\s)\]}>\"']+")


def extract_urls_from_query(query: str) -> List[str]:
    return URL_PATTERN.findall(query)


def is_url_query(query: str) -> bool:
    return bool(extract_urls_from_query(query))


def wants_crawl(query: str) -> bool:
    q = query.lower()
    return any(token in q for token in ["crawl", "爬", "爬取", "全站", "站点", "所有页面", "map", "sitemap", "目录"])

def extract_requested_limit(query: str, explicit_limit: Optional[int] = None, *, default_limit: int = 10) -> int:
    if explicit_limit is not None and explicit_limit > 0:
        return explicit_limit
    patterns = [
        r"前\s*(\d+)\s*(?:篇|条|个|作品|视频|笔记|文章)",
        r"最近\s*(\d+)\s*(?:篇|条|个|作品|视频|笔记|文章)",
        r"top\s*(\d+)",
        r"limit\s*[:=]?\s*(\d+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, query, flags=re.IGNORECASE)
        if match:
            return max(1, min(int(match.group(1)), 200))
    return default_limit


def infer_sort_order(query: str, explicit_sort: str = "") -> str:
    if explicit_sort:
        return explicit_sort
    if any(token in query for token in ["时间排序", "按时间", "最新", "最近", "倒序", "时间倒序"]):
        return "time_desc"
    if any(token in query for token in ["最火", "最热", "热门", "点赞", "互动"]):
        return "popularity_desc"
    return "relevance"


def infer_task_type(query: str, task_type: str = "", platform_hint: str = "", creator_hint: str = "") -> str:
    if task_type:
        return task_type
    q = query.lower()
    if is_url_query(query):
        return "site_crawl" if wants_crawl(query) else "url_extract"
    inferred_platform = infer_platform_hint(query, platform_hint)
    wants_content = any(token in q for token in ["视频", "文章", "图文", "笔记", "作品", "内容", "抓", "抓取", "全部", "前", "最近"])
    explicit_creator_signal = bool(creator_hint) or any(token in q for token in ["博主", "up主", "频道", "账号", "creator", "handle", "作者"])
    if inferred_platform in {"xhs", "douyin", "bilibili", "wechat", "wechat_mp", "wechat_channels", "x", "instagram", "youtube"} and (explicit_creator_signal or wants_content):
        return "username_content"
    if explicit_creator_signal:
        return "creator_capture"
    if any(token in q for token in ["是谁", "什么人", "什么账号", "背景", "上下文", "来龙去脉", "介绍一下"]):
        return "entity_context"
    if any(token in q for token in ["什么是", "是啥", "定义", "概念"]):
        return "concept_explainer"
    if any(token in q for token in ["repo", "仓库", "项目", "开源"]):
        return "repo_lookup"
    if any(token in q for token in ["教程", "how to", "怎么做", "实现"]):
        return "technical_howto"
    if inferred_platform in {"youtube", "bilibili"}:
        return "video_search"
    if inferred_platform in {"xhs", "douyin", "wechat", "x", "reddit"}:
        return "social_tactic"
    return "simple_search"


def provider_status(provider: str) -> Dict[str, Any]:
    required_keys = get_enabled_provider_keys(provider)
    optional_keys = get_optional_provider_keys(provider)
    missing_required = [key for key in required_keys if not os.getenv(key)]
    configured_optional = [key for key in optional_keys if os.getenv(key)]
    return {
        "provider": provider,
        "available": not missing_required,
        "required_keys": required_keys,
        "missing_required": missing_required,
        "optional_keys": optional_keys,
        "configured_optional": configured_optional,
    }


def filter_available_providers(providers: List[str], *, keep_keyless: bool = True) -> Dict[str, Any]:
    available: List[str] = []
    skipped: List[Dict[str, Any]] = []
    for provider in providers:
        if provider in {"web_access", "browser", "browser_use"}:
            available.append(provider)
            continue
        status = provider_status(provider)
        if status["available"]:
            available.append(provider)
        else:
            skipped.append({
                "provider": provider,
                "reason": "missing_required_credentials",
                "missing_required": status["missing_required"],
            })
    return {"available": available, "skipped": skipped}


def apply_provider_mode(providers: List[str], mode: str, task_type: str, budget: str = "medium") -> Dict[str, Any]:
    selected_mode = infer_default_mode(task_type, mode)
    profile = get_provider_mode(selected_mode)
    budget_profile = get_budget(budget)
    max_providers = int(profile.get("max_providers", 3))
    if task_type in {"url_extract", "site_crawl", "username_content"}:
        max_providers = max(max_providers, 1)
    if budget == "low":
        max_providers = max(1, min(max_providers, 2))
    elif budget == "high":
        max_providers = max_providers + 2
    limited = providers[:max_providers]
    merged_profile = dict(profile)
    merged_profile.update({"budget": budget, "budget_profile": budget_profile})
    return {
        "mode": selected_mode if selected_mode in {"fast", "balanced", "deep", "social", "technical"} else "balanced",
        "profile": merged_profile,
        "providers": limited,
        "truncated_providers": providers[max_providers:],
    }


def build_provider_plan(query: str, task_type: str, platform_hint: str, explicit_providers: List[str], *, only_available: bool = True) -> List[str]:
    if explicit_providers:
        providers = explicit_providers
    else:
        providers = SOURCE_ROUTING.get(task_type, []).copy()
        if platform_hint:
            providers = PLATFORM_PROVIDER_MAP.get(platform_hint, []).copy() + providers

    deduped: List[str] = []
    for provider in providers:
        mapped = DIRECT_PROVIDER_ALIASES.get(provider, provider)
        if mapped not in deduped:
            deduped.append(mapped)
    planned = deduped or get_default_config().providers
    if only_available:
        available = filter_available_providers(planned)["available"]
        return available or planned
    return planned


def build_route_plan(query: str, task_type: str, providers: List[str], *, platform_hint: str = "", creator_hint: str = "", limit: Optional[int] = None, sort_order: str = "relevance", planned_providers: Optional[List[str]] = None, skipped_providers: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    platform = infer_platform_hint(query, platform_hint)
    requested_limit = extract_requested_limit(query, limit, default_limit=10 if task_type == "username_content" else get_default_config().max_results)
    if task_type == "username_content":
        action = "creator_posts"
        reason = "用户询问的是指定平台/账号的内容列表，优先走平台专用 creator->content 链路，而不是普通网页搜索。"
        required_capabilities = ["social_creator_posts", "pagination", "normalization"]
        if platform in {"xhs", "douyin", "bilibili", "wechat", "wechat_mp", "wechat_channels", "instagram"}:
            required_capabilities.insert(0, "tikhub_social_api")
    elif task_type == "entity_context":
        action = "entity_context"
        reason = "用户需要知道对象是谁/背景上下文，先做多源语义搜索和公开信息交叉验证，不默认抓账号内容。"
        required_capabilities = ["web_search", "semantic_search", "cross_source_context"]
    elif task_type in {"url_extract", "site_crawl"}:
        action = task_type
        reason = "用户目标是读取已知 URL 或站点内容，优先走 extract/crawl，再用浏览器兜底。"
        required_capabilities = ["url_extract", "site_map", "site_crawl", "js_render_fallback"]
    elif task_type in {"repo_lookup", "technical_howto"}:
        action = "technical_evidence"
        reason = "技术/项目问题需要 GitHub、issues、code 和真实用户反馈交叉验证。"
        required_capabilities = ["github_search", "github_issues", "github_code", "community_feedback"]
    else:
        action = "search"
        reason = "未命中专门抓取意图，使用多搜索服务聚合并按相关性去重。"
        required_capabilities = ["web_search", "dedupe", "ranking"]
    return {
        "task_type": task_type,
        "action": action,
        "platform": platform,
        "creator": creator_hint,
        "requested_limit": requested_limit,
        "sort_order": sort_order,
        "providers": providers,
        "planned_providers": planned_providers or providers,
        "skipped_providers": skipped_providers or [],
        "required_capabilities": required_capabilities,
        "reason": reason,
        "accuracy_rules": [
            "先判断用户要上下文、账号内容、URL 抽取、项目证据还是普通搜索。",
            "平台明确时优先平台专用 provider；平台不明确时先做 entity/web context。",
            "封闭平台必须返回完整度和失败原因，不能把搜索入口冒充为已抓取内容。",
            "所有 provider 结果统一 schema、去重、保留 provider errors。",
        ],
    }


def aggregate_search(query: str, providers: List[str], *, task_type: str = "", platform_hint: str = "", creator_hint: str = "", limit: Optional[int] = None, sort_order: str = "relevance") -> Dict[str, Any]:
    config = get_default_config()
    requested_limit = extract_requested_limit(query, limit, default_limit=10 if task_type == "username_content" else config.max_results)
    config.max_results = requested_limit
    inferred_platform = infer_platform_hint(query, platform_hint)
    if task_type in {"url_extract", "site_crawl"} and is_url_query(query):
        urls = extract_urls_from_query(query)
        attempted = ["web_access"]
        failures: List[Dict[str, Any]] = []
        results: List[Dict[str, Any]] = []
        extracted_details: List[Dict[str, Any]] = []
        for url in urls[:requested_limit]:
            if task_type == "site_crawl":
                crawl_result = crawl_site(url, depth=1, limit=min(requested_limit, 20), timeout=config.timeout_seconds)
                extracted_details.append(crawl_result)
                for page in crawl_result.get("pages", [])[:requested_limit]:
                    results.append(normalize_item({
                        "title": page.get("title") or page.get("url"),
                        "url": page.get("url"),
                        "body": (page.get("content_text") or page.get("content_markdown") or "")[:1000],
                        "source_type": "web_access_crawl_page",
                        "metadata": {"provider": page.get("provider"), "root_url": url},
                    }, provider="web_access", platform="web"))
                if not crawl_result.get("success"):
                    failures.append({"provider": "web_access", "error": crawl_result.get("error") or "crawl failed", "url": url})
            else:
                extraction = extract_url(url, timeout=config.timeout_seconds)
                extracted_details.append(extraction)
                if extraction.get("success"):
                    results.append(normalize_item({
                        "title": extraction.get("title") or url,
                        "url": url,
                        "body": (extraction.get("content_text") or extraction.get("content_markdown") or "")[:1000],
                        "source_type": "web_access_extract",
                        "metadata": {"provider": extraction.get("provider")},
                    }, provider="web_access", platform="web"))
                else:
                    failures.append({"provider": "web_access", "error": extraction.get("error") or "extract failed", "url": url})
        route_plan = build_route_plan(query, task_type, ["web_access"], platform_hint=platform_hint, creator_hint=creator_hint, limit=requested_limit, sort_order=sort_order)
        return {
            "query": query,
            "route_plan": route_plan,
            "task_type": task_type,
            "platform_hint": platform_hint or inferred_platform,
            "creator_hint": creator_hint,
            "success": bool(results),
            "results": results,
            "creator": build_creator_profile(creator_hint, platform_hint or inferred_platform, results),
            "related_links": [item["source_url"] for item in results if item.get("source_url")][:20],
            "web_access": extracted_details,
            "capture_meta": {
                "attempted_providers": attempted,
                "failed_providers": failures,
                "captured_count": len(results),
                "requested_limit": requested_limit,
                "sort_order": sort_order,
                "captured_at": utc_now_iso(),
                "completeness": "partial" if failures else "high",
            },
            "error": None if results else "web_access extract/crawl failed",
        }

    config.providers = providers
    attempted: List[str] = []
    failures: List[Dict[str, Any]] = []
    collected: List[Dict[str, Any]] = []

    for provider in providers:
        attempted.append(provider)
        if not has_provider_credentials(provider):
            failures.append({"provider": provider, "error": "Missing required credentials"})
            continue

        result = run_provider(provider, query, config, platform_hint=platform_hint or inferred_platform, creator_hint=creator_hint, limit=requested_limit, sort_order=sort_order)
        platform = provider if provider in {"youtube", "reddit", "x", "bilibili"} else (platform_hint or inferred_platform)

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

    route_plan = build_route_plan(query, task_type, providers, platform_hint=platform_hint, creator_hint=creator_hint, limit=requested_limit, sort_order=sort_order)

    return {
        "query": query,
        "route_plan": route_plan,
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
            "requested_limit": requested_limit,
            "sort_order": sort_order,
            "captured_at": utc_now_iso(),
            "completeness": "partial" if failures or any((item.get("metadata") or {}).get("coverage") == "search_url_only" for item in ranked) else "high",
        },
        "error": None if ranked else "All configured providers failed or returned no usable results",
    }


def attach_extracted_content(result: Dict[str, Any], *, extract_top: int = 0, timeout: int = 25) -> Dict[str, Any]:
    if extract_top <= 0:
        return result
    extracted: List[Dict[str, Any]] = []
    for item in result.get("results", [])[:extract_top]:
        url = item.get("source_url")
        if not url or not url.startswith(("http://", "https://")):
            continue
        extraction = extract_url(url, timeout=timeout)
        item["extraction"] = {
            "success": extraction.get("success"),
            "provider": extraction.get("provider"),
            "title": extraction.get("title"),
            "content_markdown": extraction.get("content_markdown", "")[:20000],
            "content_text": extraction.get("content_text", "")[:20000],
            "attempts": [
                {"provider": attempt.get("provider"), "success": attempt.get("success"), "error": attempt.get("error"), "latency_ms": attempt.get("latency_ms")}
                for attempt in extraction.get("attempts", [])
            ],
            "error": extraction.get("error"),
        }
        extracted.append({"url": url, "success": extraction.get("success"), "provider": extraction.get("provider"), "error": extraction.get("error")})
    result.setdefault("capture_meta", {})["extract_top"] = extract_top
    result.setdefault("capture_meta", {})["extracted"] = extracted
    return result


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
        f"- 请求数量: {result.get('capture_meta', {}).get('requested_limit', '')}",
        f"- 排序: {result.get('capture_meta', {}).get('sort_order', '')}",
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
    parser.add_argument("--task-type", default="", help="Task type such as concept_explainer, repo_lookup, creator_capture, username_content")
    parser.add_argument("--platform", default="", help="Platform hint such as github, youtube, bilibili, x, reddit, xhs, douyin, wechat")
    parser.add_argument("--creator", default="", help="Creator hint, handle, or account name")
    parser.add_argument("--limit", type=int, default=None, help="Requested item count. Defaults to 10 for username_content tasks; query phrases like 前45篇 are also parsed.")
    parser.add_argument("--sort", default="", help="Sort order hint: relevance, time_desc, popularity_desc. Query phrases like 按时间排序 are also parsed.")
    parser.add_argument("--extract-top", type=int, default=0, help="Extract full content for top N result URLs using web_access fallback chain")
    parser.add_argument("--extract-timeout", type=int, default=int(os.getenv("SOURCE_ROUTER_TIMEOUT", "25")), help="Timeout for each extracted URL")
    parser.add_argument("--all-providers", action="store_true", help="Attempt all planned providers even if required API keys are missing; default only calls configured/keyless providers")
    parser.add_argument("--diagnose-providers", action="store_true", help="Print provider availability for the planned route")
    parser.add_argument("--mode", default="", choices=["", "fast", "balanced", "deep", "social", "technical"], help="Provider usage profile. Empty means infer from task type or SOURCE_ROUTER_MODE.")
    parser.add_argument("--budget", default=os.getenv("SOURCE_ROUTER_BUDGET", "medium"), choices=["low", "medium", "high"], help="Cost/depth budget controlling provider count and extraction depth")
    parser.add_argument("--env-safety", action="store_true", help="Print .env safety diagnostics")
    parser.add_argument("--save", action="store_true", help="Persist JSON and Markdown outputs under output/")
    parser.add_argument("--json", action="store_true", help="Output raw JSON only")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.env_safety:
        print(json.dumps(env_safety_report(), ensure_ascii=False, indent=2))
        return 0
    explicit_providers = [p.strip() for p in args.providers.split(",") if p.strip()]
    task_type = infer_task_type(args.query, args.task_type, args.platform, args.creator)
    planned_providers = build_provider_plan(args.query, task_type, args.platform, explicit_providers, only_available=False)
    availability = filter_available_providers(planned_providers)
    pre_mode_providers = planned_providers if args.all_providers else (availability["available"] or planned_providers)
    mode_plan = apply_provider_mode(pre_mode_providers, args.mode, task_type, budget=args.budget)
    providers = mode_plan["providers"]
    sort_order = infer_sort_order(args.query, args.sort)
    if args.diagnose_providers:
        diagnosis = {
            "query": args.query,
            "task_type": task_type,
            "planned_providers": planned_providers,
            "available_providers": availability["available"],
            "budget": args.budget,
            "mode": mode_plan["mode"],
            "mode_profile": mode_plan["profile"],
            "selected_providers": providers,
            "truncated_providers": mode_plan["truncated_providers"],
            "skipped_providers": availability["skipped"],
            "provider_status": [provider_status(provider) for provider in planned_providers],
        }
        print(json.dumps(diagnosis, ensure_ascii=False, indent=2))
        return 0
    result = aggregate_search(
        args.query,
        providers,
        task_type=task_type,
        platform_hint=args.platform,
        creator_hint=args.creator,
        limit=args.limit,
        sort_order=sort_order,
    )
    result["route_plan"]["planned_providers"] = planned_providers
    result["route_plan"]["providers_before_mode"] = pre_mode_providers
    result["route_plan"]["provider_mode"] = mode_plan["mode"]
    result["route_plan"]["budget"] = args.budget
    result["route_plan"]["provider_mode_profile"] = mode_plan["profile"]
    result["route_plan"]["truncated_providers"] = mode_plan["truncated_providers"]
    result["route_plan"]["skipped_providers"] = availability["skipped"]
    result["capture_meta"]["skipped_providers"] = availability["skipped"]
    result["capture_meta"]["provider_mode"] = mode_plan["mode"]
    result["capture_meta"]["budget"] = args.budget

    if not args.extract_top:
        default_extract_top = int(mode_plan["profile"].get("extract_top", 0))
        if default_extract_top:
            args.extract_top = default_extract_top

    if args.extract_top:
        result = attach_extracted_content(result, extract_top=args.extract_top, timeout=args.extract_timeout)

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
