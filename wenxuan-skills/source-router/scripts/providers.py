from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from config import SearchConfig


@dataclass
class ProviderResult:
    provider: str
    query: str
    success: bool
    results: List[Dict[str, Any]]
    error: Optional[str]
    meta: Dict[str, Any]


def _http_json(url: str, *, method: str = "GET", headers: Optional[Dict[str, str]] = None, body: Optional[Dict[str, Any]] = None, timeout: int = 20) -> Dict[str, Any]:
    data = None
    req_headers = headers or {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        req_headers.setdefault("Content-Type", "application/json")

    request = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read().decode("utf-8")
        return json.loads(raw)


def _normalize_result(
    title: str = "",
    url: str = "",
    snippet: str = "",
    source_type: str = "web",
    score: Optional[float] = None,
    published_at: Optional[str] = None,
    *,
    body: str = "",
    transcript: str = "",
    comments: Optional[List[Dict[str, Any]]] = None,
    stats: Optional[Dict[str, Any]] = None,
    media_urls: Optional[List[str]] = None,
    tags: Optional[List[str]] = None,
    metadata: Optional[Dict[str, Any]] = None,
    author: Optional[Dict[str, Any]] = None,
    platform: Optional[str] = None,
    item_type: Optional[str] = None,
) -> Dict[str, Any]:
    return {
        "title": title,
        "url": url,
        "snippet": snippet,
        "body": body or snippet,
        "transcript": transcript,
        "comments": comments or [],
        "stats": stats or {},
        "media_urls": media_urls or [],
        "tags": tags or [],
        "metadata": metadata or {},
        "author": author or {},
        "platform": platform or source_type,
        "type": item_type or source_type,
        "source_type": source_type,
        "score": score,
        "published_at": published_at,
    }


def _github_headers(token: str) -> Dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _github_web_search_url(query: str, kind: str = "repositories") -> str:
    encoded = urllib.parse.quote(query)
    if kind == "issues":
        return f"https://github.com/search?q={encoded}&type=issues"
    if kind == "code":
        return f"https://github.com/search?q={encoded}&type=code"
    return f"https://github.com/search?q={encoded}&type=repositories"


def _creator_author(display_name: str = "", handle: str = "", profile_url: str = "") -> Dict[str, Any]:
    return {
        "display_name": display_name,
        "handle": handle,
        "profile_url": profile_url,
        "bio": "",
        "followers": None,
        "verified": None,
    }


def search_github(query: str, config: SearchConfig, token: str) -> ProviderResult:
    started = time.time()
    if not token:
        fallback = _normalize_result(
            title=f"GitHub repository search: {query}",
            url=_github_web_search_url(query, "repositories"),
            snippet="No GITHUB_TOKEN configured. Returning GitHub web search URL as anonymous fallback.",
            source_type="github_repository_search",
            body="Anonymous GitHub web search fallback. Use this URL to continue repo discovery when API credentials are missing.",
            metadata={"auth_mode": "anonymous_fallback", "coverage": "search_url_only"},
            author=_creator_author(),
            platform="github",
            item_type="repository_search",
        )
        return ProviderResult(
            "github",
            query,
            True,
            [fallback],
            None,
            {"latency_ms": int((time.time() - started) * 1000), "total_count": 1, "search_kind": "repositories", "auth_mode": "anonymous_fallback"},
        )
    try:
        q = urllib.parse.urlencode({"q": query, "sort": "stars", "order": "desc", "per_page": min(config.max_results, 10)})
        data = _http_json(
            f"https://api.github.com/search/repositories?{q}",
            method="GET",
            headers=_github_headers(token),
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("full_name", ""),
                url=item.get("html_url", ""),
                snippet=item.get("description", ""),
                source_type="github_repository",
                score=float(item.get("stargazers_count", 0)),
                published_at=item.get("updated_at"),
                body=item.get("description", ""),
                stats={
                    "stars": item.get("stargazers_count"),
                    "forks": item.get("forks_count"),
                    "watchers": item.get("watchers_count"),
                    "open_issues": item.get("open_issues_count"),
                },
                tags=item.get("topics", []) or [],
                metadata={
                    "default_branch": item.get("default_branch"),
                    "language": item.get("language"),
                    "license": (item.get("license") or {}).get("spdx_id"),
                },
                author=_creator_author(
                    display_name=(item.get("owner") or {}).get("login", ""),
                    handle=(item.get("owner") or {}).get("login", ""),
                    profile_url=(item.get("owner") or {}).get("html_url", ""),
                ),
                platform="github",
                item_type="repository",
            )
            for item in data.get("items", [])
        ]
        return ProviderResult("github", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "total_count": data.get("total_count"), "search_kind": "repositories", "auth_mode": "token"})
    except Exception as exc:
        return ProviderResult("github", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "search_kind": "repositories"})


def search_github_issues(query: str, config: SearchConfig, token: str) -> ProviderResult:
    started = time.time()
    if not token:
        fallback = _normalize_result(
            title=f"GitHub issues search: {query}",
            url=_github_web_search_url(query, "issues"),
            snippet="No GITHUB_TOKEN configured. Returning GitHub issues web search URL as anonymous fallback.",
            source_type="github_issue_search",
            body="Anonymous GitHub issues search fallback. Use this URL to inspect issue threads manually.",
            metadata={"auth_mode": "anonymous_fallback", "coverage": "search_url_only"},
            platform="github",
            item_type="issue_search",
        )
        return ProviderResult("github_issues", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "total_count": 1, "search_kind": "issues", "auth_mode": "anonymous_fallback"})
    try:
        q = urllib.parse.urlencode({"q": query, "per_page": min(config.max_results, 10)})
        data = _http_json(
            f"https://api.github.com/search/issues?{q}",
            method="GET",
            headers=_github_headers(token),
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("html_url", ""),
                snippet=(item.get("body", "") or "")[:280],
                source_type="github_issue",
                score=float(item.get("comments", 0)),
                published_at=item.get("updated_at"),
                body=item.get("body", ""),
                stats={"comments": item.get("comments")},
                metadata={
                    "state": item.get("state"),
                    "labels": [(label or {}).get("name") for label in item.get("labels", [])],
                },
                author=_creator_author(
                    display_name=(item.get("user") or {}).get("login", ""),
                    handle=(item.get("user") or {}).get("login", ""),
                    profile_url=(item.get("user") or {}).get("html_url", ""),
                ),
                platform="github",
                item_type="issue",
            )
            for item in data.get("items", [])
        ]
        return ProviderResult("github_issues", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "total_count": data.get("total_count"), "search_kind": "issues", "auth_mode": "token"})
    except Exception as exc:
        return ProviderResult("github_issues", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "search_kind": "issues"})


def search_github_discussions(query: str, config: SearchConfig, token: str) -> ProviderResult:
    started = time.time()
    fallback = _normalize_result(
        title=f"GitHub discussions search: {query}",
        url=f"https://github.com/search?q={urllib.parse.quote(query)}&type=discussions",
        snippet="GitHub Discussions adapter is currently a stub. Returning a web search URL so you can continue manually.",
        source_type="github_discussion_search",
        body="GitHub Discussions search requires GraphQL query implementation and repo scoping strategy.",
        metadata={"status": "stub", "next_step": "Implement GraphQL discussion query flow", "auth_mode": "url_fallback"},
        platform="github",
        item_type="discussion_search",
    )
    return ProviderResult("github_discussions", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "status": "stub", "search_kind": "discussions", "next_step": "Implement GraphQL search or repo-scoped discussion fetch flow"})


def search_github_code(query: str, config: SearchConfig, token: str) -> ProviderResult:
    started = time.time()
    if not token:
        fallback = _normalize_result(
            title=f"GitHub code search: {query}",
            url=_github_web_search_url(query, "code"),
            snippet="No GITHUB_TOKEN configured. Returning GitHub code web search URL as anonymous fallback.",
            source_type="github_code_search",
            body="Anonymous GitHub code search fallback. Use this URL to inspect matching code snippets manually.",
            metadata={"auth_mode": "anonymous_fallback", "coverage": "search_url_only"},
            platform="github",
            item_type="code_search",
        )
        return ProviderResult("github_code", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "total_count": 1, "search_kind": "code", "auth_mode": "anonymous_fallback"})
    try:
        q = urllib.parse.urlencode({"q": query, "per_page": min(config.max_results, 10)})
        data = _http_json(
            f"https://api.github.com/search/code?{q}",
            method="GET",
            headers=_github_headers(token),
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("name", ""),
                url=item.get("html_url", ""),
                snippet=(item.get("repository", {}).get("full_name", "") + " / " + item.get("path", "")).strip(" /"),
                source_type="github_code",
                score=None,
                published_at=None,
                body=(item.get("repository", {}).get("full_name", "") + " / " + item.get("path", "")).strip(" /"),
                metadata={"sha": item.get("sha"), "path": item.get("path")},
                author=_creator_author(
                    display_name=(item.get("repository", {}).get("owner", {}) or {}).get("login", ""),
                    handle=(item.get("repository", {}).get("owner", {}) or {}).get("login", ""),
                    profile_url=(item.get("repository", {}).get("owner", {}) or {}).get("html_url", ""),
                ),
                platform="github",
                item_type="code",
            )
            for item in data.get("items", [])
        ]
        return ProviderResult("github_code", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "total_count": data.get("total_count"), "search_kind": "code", "auth_mode": "token"})
    except Exception as exc:
        return ProviderResult("github_code", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "search_kind": "code"})


def search_tikhub(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    if not api_key:
        fallback = _normalize_result(
            title=f"TikHub route planned for: {query}",
            url="https://docs.tikhub.io/",
            snippet="TikHub API key is missing. Returning documentation URL and adapter plan placeholder.",
            source_type="tikhub_stub",
            body="TikHub provider skeleton only; requires endpoint confirmation and platform-specific query mapping.",
            metadata={"status": "stub", "auth_mode": "missing_api_key", "platforms": ["xhs", "douyin", "bilibili", "wechat"]},
            platform="social",
            item_type="adapter_stub",
        )
        return ProviderResult("tikhub", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "status": "stub", "next_step": "Configure TIKHUB_API_KEY and map each platform endpoint"})
    return ProviderResult("tikhub", query, False, [], "TikHub provider skeleton only; requires endpoint confirmation and platform-specific query mapping", {"latency_ms": int((time.time() - started) * 1000), "status": "stub", "next_step": "Confirm TikHub API endpoint, auth header, and search route for XHS/Douyin/Bilibili"})


def search_tavily(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        payload = {
            "query": query,
            "max_results": config.max_results,
            "search_depth": "advanced",
            "topic": "general",
        }
        data = _http_json(
            "https://api.tavily.com/search",
            method="POST",
            headers={"Authorization": f"Bearer {api_key}"},
            body=payload,
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("url", ""),
                snippet=item.get("content", ""),
                source_type="web",
                score=item.get("score"),
                body=item.get("content", ""),
                metadata={"favicon": item.get("favicon")},
            )
            for item in data.get("results", [])
        ]
        return ProviderResult("tavily", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("tavily", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_exa(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        payload = {
            "query": query,
            "numResults": config.max_results,
            "type": "neural",
        }
        data = _http_json(
            "https://api.exa.ai/search",
            method="POST",
            headers={"x-api-key": api_key},
            body=payload,
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("url", ""),
                snippet=item.get("text", ""),
                source_type="web",
                score=item.get("score"),
                published_at=item.get("publishedDate"),
                body=item.get("text", ""),
            )
            for item in data.get("results", [])
        ]
        return ProviderResult("exa", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("exa", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_brave(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        q = urllib.parse.urlencode({"q": query, "count": config.max_results})
        data = _http_json(
            f"https://api.search.brave.com/res/v1/web/search?{q}",
            method="GET",
            headers={"X-Subscription-Token": api_key},
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("url", ""),
                snippet=item.get("description", ""),
                body=item.get("description", ""),
            )
            for item in data.get("web", {}).get("results", [])
        ]
        return ProviderResult("brave", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("brave", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_metaso(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    fallback = _normalize_result(
        title=f"Metaso planned route: {query}",
        url="https://metaso.cn/",
        snippet="Metaso provider requires endpoint confirmation before implementation.",
        source_type="metaso_stub",
        body="Metaso provider requires endpoint confirmation before implementation.",
        metadata={"status": "stub", "next_step": "Confirm official API endpoint and auth header format"},
        platform="web",
        item_type="adapter_stub",
    )
    return ProviderResult("metaso", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "status": "stub", "next_step": "Confirm official API endpoint and auth header format"})


def search_serpapi(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        q = urllib.parse.urlencode({"q": query, "api_key": api_key, "engine": "google", "num": config.max_results, "hl": config.language, "gl": config.country})
        data = _http_json(f"https://serpapi.com/search.json?{q}", timeout=config.timeout_seconds)
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("link", ""),
                snippet=item.get("snippet", ""),
                body=item.get("snippet", ""),
            )
            for item in data.get("organic_results", [])
        ]
        return ProviderResult("serpapi", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("serpapi", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_serper(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        payload = {"q": query, "num": config.max_results, "hl": config.language, "gl": config.country}
        data = _http_json(
            "https://google.serper.dev/search",
            method="POST",
            headers={"X-API-KEY": api_key},
            body=payload,
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("link", ""),
                snippet=item.get("snippet", ""),
                body=item.get("snippet", ""),
            )
            for item in data.get("organic", [])
        ]
        return ProviderResult("serper", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("serper", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_bing(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    try:
        q = urllib.parse.urlencode({"q": query, "count": config.max_results, "mkt": config.language})
        data = _http_json(
            f"https://api.bing.microsoft.com/v7.0/search?{q}",
            method="GET",
            headers={"Ocp-Apim-Subscription-Key": api_key},
            timeout=config.timeout_seconds,
        )
        results = [
            _normalize_result(
                title=item.get("name", ""),
                url=item.get("url", ""),
                snippet=item.get("snippet", ""),
                body=item.get("snippet", ""),
            )
            for item in data.get("webPages", {}).get("value", [])
        ]
        return ProviderResult("bing", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("bing", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_google_cse(query: str, config: SearchConfig, api_key: str, engine_id: str) -> ProviderResult:
    started = time.time()
    try:
        q = urllib.parse.urlencode({"q": query, "key": api_key, "cx": engine_id, "num": min(config.max_results, 10), "hl": config.language})
        data = _http_json(f"https://www.googleapis.com/customsearch/v1?{q}", timeout=config.timeout_seconds)
        results = [
            _normalize_result(
                title=item.get("title", ""),
                url=item.get("link", ""),
                snippet=item.get("snippet", ""),
                body=item.get("snippet", ""),
            )
            for item in data.get("items", [])
        ]
        return ProviderResult("google_cse", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult("google_cse", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000)})


def search_firecrawl(query: str, config: SearchConfig, api_key: str) -> ProviderResult:
    started = time.time()
    fallback = _normalize_result(
        title=f"Firecrawl planned route: {query}",
        url="https://www.firecrawl.dev/",
        snippet="Firecrawl search endpoint requires account-specific confirmation before implementation.",
        source_type="firecrawl_stub",
        body="Firecrawl search endpoint requires account-specific confirmation before implementation.",
        metadata={"status": "stub", "next_step": "Confirm whether your account uses /v1/search or extract-first flow"},
        platform="web",
        item_type="adapter_stub",
    )
    return ProviderResult("firecrawl", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "status": "stub", "next_step": "Confirm whether your account uses /v1/search or extract-first flow"})


def search_youtube(query: str, config: SearchConfig) -> ProviderResult:
    started = time.time()
    watch_query = urllib.parse.quote(query)
    results = [
        _normalize_result(
            title=f"YouTube 搜索结果入口：{query}",
            url=f"https://www.youtube.com/results?search_query={watch_query}",
            snippet="当前为第一阶段适配器：先返回频道/视频搜索入口，后续补 API / transcript / comment 抓取。",
            source_type="youtube_search",
            body="YouTube adapter phase 1 currently returns a search URL and normalized capture placeholder.",
            media_urls=[f"https://www.youtube.com/results?search_query={watch_query}"],
            metadata={"status": "phase1_adapter", "coverage": "search_url_only"},
            platform="youtube",
            item_type="video_search",
        )
    ]
    return ProviderResult("youtube", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "status": "phase1"})


def search_reddit(query: str, config: SearchConfig) -> ProviderResult:
    started = time.time()
    encoded = urllib.parse.quote(query)
    results = [
        _normalize_result(
            title=f"Reddit 搜索结果入口：{query}",
            url=f"https://www.reddit.com/search/?q={encoded}",
            snippet="当前为第一阶段适配器：先返回 Reddit 搜索入口，后续补 subreddit/post/comment 抓取。",
            source_type="reddit_search",
            body="Reddit adapter phase 1 currently returns a search URL and normalized capture placeholder.",
            metadata={"status": "phase1_adapter", "coverage": "search_url_only"},
            platform="reddit",
            item_type="post_search",
        )
    ]
    return ProviderResult("reddit", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "status": "phase1"})


def search_x(query: str, config: SearchConfig) -> ProviderResult:
    started = time.time()
    encoded = urllib.parse.quote(query)
    results = [
        _normalize_result(
            title=f"X / Twitter 搜索结果入口：{query}",
            url=f"https://x.com/search?q={encoded}&src=typed_query",
            snippet="当前为第一阶段适配器：先返回 X 搜索入口，后续补 timeline / thread / profile 抓取。",
            source_type="x_search",
            body="X adapter phase 1 currently returns a search URL and normalized capture placeholder.",
            metadata={"status": "phase1_adapter", "coverage": "search_url_only"},
            platform="x",
            item_type="post_search",
        )
    ]
    return ProviderResult("x", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "status": "phase1"})


def search_bilibili(query: str, config: SearchConfig) -> ProviderResult:
    started = time.time()
    encoded = urllib.parse.quote(query)
    results = [
        _normalize_result(
            title=f"B站搜索结果入口：{query}",
            url=f"https://search.bilibili.com/all?keyword={encoded}",
            snippet="当前为第一阶段适配器：先返回 B站搜索入口，后续补 UP 主 / 视频列表 / 简介 / 评论抓取。",
            source_type="bilibili_search",
            body="Bilibili adapter phase 1 currently returns a search URL and normalized capture placeholder.",
            metadata={"status": "phase1_adapter", "coverage": "search_url_only"},
            platform="bilibili",
            item_type="video_search",
        )
    ]
    return ProviderResult("bilibili", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "status": "phase1"})
