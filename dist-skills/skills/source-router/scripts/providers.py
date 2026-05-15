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


def _tikhub_base_url() -> str:
    return "https://api.tikhub.io"


def _tikhub_headers(api_key: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }


def _tikhub_extract_data(payload: Dict[str, Any]) -> Any:
    return payload.get("data")


def _pick_str(data: Dict[str, Any], keys: List[str]) -> str:
    for key in keys:
        value = data.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def _pick_int(data: Dict[str, Any], keys: List[str]) -> Optional[int]:
    for key in keys:
        value = data.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str) and value.isdigit():
            return int(value)
    return None


def _normalize_tikhub_author(user: Dict[str, Any], *, fallback_handle: str = "") -> Dict[str, Any]:
    profile_url = _pick_str(user, ["profile_url", "url", "share_url", "home_page_url"])
    return {
        "display_name": _pick_str(user, ["nickname", "display_name", "name", "user_name", "nick_name"]) or fallback_handle,
        "handle": _pick_str(user, ["username", "unique_id", "handle", "user_id", "sec_uid", "mid"]) or fallback_handle,
        "profile_url": profile_url,
        "bio": _pick_str(user, ["signature", "desc", "bio"]),
        "followers": _pick_int(user, ["follower_count", "fans_count", "followers"]),
        "verified": user.get("verified") if isinstance(user.get("verified"), bool) else None,
    }


def _normalize_tikhub_content_item(platform: str, item: Dict[str, Any], *, fallback_author: Dict[str, Any]) -> Dict[str, Any]:
    title = _pick_str(item, ["title", "desc", "content", "text", "note_title"])
    body = _pick_str(item, ["desc", "content", "text", "title", "note_desc"])
    source_url = _pick_str(item, ["share_url", "url", "note_url", "jump_url", "permalink"])
    media_urls: List[str] = []
    for key in ["cover", "cover_url", "image_url", "video_url", "thumbnail", "thumbnail_url", "play_url"]:
        value = item.get(key)
        if isinstance(value, str) and value.strip():
            media_urls.append(value.strip())
    if isinstance(item.get("media"), list):
        media_urls.extend([media.get("url") or media.get("src") for media in item.get("media", []) if isinstance(media, dict) and (media.get("url") or media.get("src"))])
    if isinstance(item.get("video"), dict):
        media_urls.extend([value for value in item.get("video", {}).values() if isinstance(value, str) and value.startswith("http")])
    if isinstance(item.get("images"), list):
        media_urls.extend([img for img in item.get("images", []) if isinstance(img, str) and img.strip()])
    return _normalize_result(
        title=title or body[:40] or f"{platform} content",
        url=source_url,
        snippet=body[:280],
        source_type=f"{platform}_content",
        body=body,
        published_at=item.get("create_time") or item.get("publish_time") or item.get("time"),
        stats={
            "likes": _pick_int(item, ["like_count", "digg_count", "likes"]),
            "comments": _pick_int(item, ["comment_count", "comments_count"]),
            "collects": _pick_int(item, ["collect_count", "favorite_count"]),
            "plays": _pick_int(item, ["play_count", "view_count"]),
        },
        media_urls=[url for url in media_urls if url],
        metadata={
            "raw_id": _pick_str(item, ["note_id", "aweme_id", "id", "post_id"]),
            "platform": platform,
        },
        author=fallback_author,
        platform=platform,
        item_type="content",
    )


def _flatten_candidate_items(data: Any) -> List[Dict[str, Any]]:
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    if isinstance(data, dict):
        for key in [
            "items",
            "item_list",
            "aweme_list",
            "notes",
            "note_list",
            "object_list",
            "posts",
            "video_list",
            "videos",
            "list",
        ]:
            value = data.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]
    return []


def _flatten_candidate_users(data: Any) -> List[Dict[str, Any]]:
    if isinstance(data, dict):
        for key in ["users", "user_list", "items", "results", "list"]:
            value = data.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    return []


def _tikhub_get(base_url: str, path: str, params: Dict[str, Any], headers: Dict[str, str], timeout: int) -> Any:
    clean_params = {key: value for key, value in params.items() if value is not None}
    url = f"{base_url}{path}?{urllib.parse.urlencode(clean_params)}"
    payload = _http_json(url, method="GET", headers=headers, timeout=timeout)
    return _tikhub_extract_data(payload)


def _tikhub_post(base_url: str, path: str, body: Dict[str, Any], headers: Dict[str, str], timeout: int) -> Any:
    payload = _http_json(f"{base_url}{path}", method="POST", headers=headers, body=body, timeout=timeout)
    return _tikhub_extract_data(payload)


def _pick_first_dict(data: Any) -> Dict[str, Any]:
    if isinstance(data, dict):
        return data
    if isinstance(data, list) and data and isinstance(data[0], dict):
        return data[0]
    return {}


def _match_candidate_user(users: List[Dict[str, Any]], username: str) -> Dict[str, Any]:
    if not users:
        return {}
    target = username.strip().lower()
    best = users[0]
    best_score = -1
    for user in users:
        text_parts = [
            _pick_str(user, ["nickname", "display_name", "name", "user_name", "nick_name", "username", "unique_id", "handle"]),
            _pick_str(user, ["desc", "signature", "bio"]),
            _pick_str(user, ["user_id", "id", "uid", "mid", "sec_uid"]),
        ]
        text = " ".join(part.lower() for part in text_parts if part)
        score = 0
        if target and target in text:
            score += 10
        if text_parts and text_parts[0].lower() == target:
            score += 20
        followers = _pick_int(user, ["follower_count", "fans_count", "followers"])
        if followers:
            score += min(followers / 1000000, 5)
        if score > best_score:
            best = user
            best_score = score
    return best


def _extract_cursor(data: Any, keys: Optional[List[str]] = None) -> str:
    keys = keys or ["cursor", "next_cursor", "max_cursor", "last_buffer", "offset", "next", "after", "end_cursor"]
    if isinstance(data, dict):
        for key in keys:
            value = data.get(key)
            if isinstance(value, (str, int)) and str(value) != "":
                return str(value)
        # Common nested shapes.
        for nested_key in ["data", "page_info", "pagination", "extra"]:
            nested = data.get(nested_key)
            if isinstance(nested, dict):
                cursor = _extract_cursor(nested, keys)
                if cursor:
                    return cursor
    return ""


def search_tikhub_social(query: str, config: SearchConfig, api_key: str, *, platform: str, limit: Optional[int] = None, sort_order: str = "relevance") -> ProviderResult:
    started = time.time()
    base_url = _tikhub_base_url()
    headers = _tikhub_headers(api_key)
    requested_limit = max(1, min(int(limit or config.max_results), 100))
    try:
        if platform == "reddit":
            sort = "NEW" if sort_order == "time_desc" else "TOP" if sort_order == "popularity_desc" else "RELEVANCE"
            collected_items: List[Dict[str, Any]] = []
            after = ""
            pages_attempted = 0
            while len(collected_items) < requested_limit and pages_attempted < 10:
                data = _tikhub_get(
                    base_url,
                    "/api/v1/reddit/app/fetch_dynamic_search",
                    {"query": query, "search_type": "post", "sort": sort, "time_range": "all", "after": after, "need_format": True},
                    headers,
                    config.timeout_seconds,
                )
                items = _flatten_candidate_items(data)
                if not items:
                    break
                collected_items.extend(items)
                pages_attempted += 1
                next_after = _extract_cursor(data, ["after", "next", "cursor", "next_cursor"])
                if not next_after or next_after == after:
                    break
                after = next_after
            author = _creator_author(display_name="reddit", handle="reddit")
            results = [_normalize_tikhub_content_item("reddit", item, fallback_author=author) for item in collected_items[:requested_limit]]
            return ProviderResult("tikhub_reddit_search", query, bool(results), results, None if results else "No Reddit results from TikHub", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_dynamic_search", "pages_attempted": pages_attempted, "auth_mode": "token"})

        if platform == "x":
            search_type = "Latest" if sort_order == "time_desc" else "Top"
            collected_items: List[Dict[str, Any]] = []
            cursor = ""
            pages_attempted = 0
            while len(collected_items) < requested_limit and pages_attempted < 10:
                data = _tikhub_get(
                    base_url,
                    "/api/v1/twitter/web/fetch_search_timeline",
                    {"keyword": query, "search_type": search_type, "cursor": cursor},
                    headers,
                    config.timeout_seconds,
                )
                items = _flatten_candidate_items(data)
                if not items:
                    break
                collected_items.extend(items)
                pages_attempted += 1
                next_cursor = _extract_cursor(data, ["cursor", "next_cursor", "bottom_cursor"])
                if not next_cursor or next_cursor == cursor:
                    break
                cursor = next_cursor
            author = _creator_author(display_name="x", handle="x")
            results = [_normalize_tikhub_content_item("x", item, fallback_author=author) for item in collected_items[:requested_limit]]
            return ProviderResult("tikhub_x_search", query, bool(results), results, None if results else "No X/Twitter results from TikHub", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_search_timeline", "pages_attempted": pages_attempted, "auth_mode": "token"})

        if platform == "youtube":
            order = "date" if sort_order == "time_desc" else "viewCount" if sort_order == "popularity_desc" else "relevance"
            collected_items: List[Dict[str, Any]] = []
            continuation_token = ""
            pages_attempted = 0
            endpoint_attempts = [
                ("/api/v1/youtube/web_v2/search_video", {"search_query": query, "language_code": config.language, "order_by": order, "country_code": config.country.lower()}),
                ("/api/v1/youtube/web/search_video", {"search_query": query, "language_code": config.language, "order_by": order, "country_code": config.country.lower()}),
            ]
            last_error = ""
            for endpoint, base_params in endpoint_attempts:
                collected_items = []
                continuation_token = ""
                pages_attempted = 0
                try:
                    while len(collected_items) < requested_limit and pages_attempted < 10:
                        params = dict(base_params)
                        params["continuation_token"] = continuation_token
                        data = _tikhub_get(base_url, endpoint, params, headers, config.timeout_seconds)
                        items = _flatten_candidate_items(data)
                        if not items:
                            break
                        collected_items.extend(items)
                        pages_attempted += 1
                        next_token = _extract_cursor(data, ["continuation_token", "continuation", "next_token", "nextContinuationData"])
                        if not next_token or next_token == continuation_token:
                            break
                        continuation_token = next_token
                    if collected_items:
                        author = _creator_author(display_name="youtube", handle="youtube")
                        results = [_normalize_tikhub_content_item("youtube", item, fallback_author=author) for item in collected_items[:requested_limit]]
                        return ProviderResult("tikhub_youtube_search", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "search_video", "endpoint": endpoint, "pages_attempted": pages_attempted, "auth_mode": "token"})
                except Exception as exc:
                    last_error = str(exc)
            return ProviderResult("tikhub_youtube_search", query, False, [], last_error or "No YouTube results from TikHub", {"latency_ms": int((time.time() - started) * 1000), "step": "search_video", "auth_mode": "token"})

        return ProviderResult("tikhub_social", query, False, [], f"Unsupported TikHub social search platform: {platform}", {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult(f"tikhub_{platform}_social", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "auth_mode": "token"})


def search_tikhub_username_content(query: str, config: SearchConfig, api_key: str, *, platform: str, username: str, limit: Optional[int] = None, sort_order: str = "relevance") -> ProviderResult:
    started = time.time()
    base_url = _tikhub_base_url()
    headers = _tikhub_headers(api_key)
    username = username.strip()
    requested_limit = max(1, min(int(limit or config.max_results), 200))
    page_size = min(max(requested_limit, config.max_results), 50)

    if platform in {"wechat", "wechat_mp", "wechat_channels"}:
        if platform == "wechat_channels":
            try:
                search_data = _tikhub_get(base_url, "/api/v1/wechat_channels/fetch_user_search_v2", {"keywords": username, "page": 0}, headers, config.timeout_seconds)
                users = _flatten_candidate_users(search_data)
                selected_user = _match_candidate_user(users, username)
                channels_username = _pick_str(selected_user, ["username", "finder_username", "exportId", "userName"])
                author = _normalize_tikhub_author(selected_user, fallback_handle=username)
                if not channels_username:
                    return ProviderResult("tikhub_wechat_channels_username_content", query, True, [_normalize_result(title=f"WeChat Channels search for {username}", snippet="User search returned candidates but no channels username/home_page identifier.", source_type="wechat_channels_user_search_partial", body="TikHub returned candidates without a resolvable Channels username.", metadata={"status": "partial", "platform": "wechat_channels"}, author=author, platform="wechat_channels", item_type="creator_search_partial")], None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_search_v2_partial", "auth_mode": "token"})
                collected_items: List[Dict[str, Any]] = []
                last_buffer = ""
                pages_attempted = 0
                while len(collected_items) < requested_limit and pages_attempted < 20:
                    home_data = _tikhub_post(base_url, "/api/v1/wechat_channels/fetch_home_page", {"username": channels_username, "last_buffer": last_buffer}, headers, config.timeout_seconds)
                    items = _flatten_candidate_items(home_data)
                    if not items:
                        break
                    collected_items.extend(items)
                    pages_attempted += 1
                    next_buffer = _extract_cursor(items[-1], ["last_buffer", "lastBuffer"]) or _extract_cursor(home_data, ["last_buffer", "lastBuffer"])
                    if not next_buffer or next_buffer == last_buffer:
                        break
                    last_buffer = next_buffer
                results = [_normalize_tikhub_content_item("wechat_channels", item, fallback_author=author) for item in collected_items[:requested_limit]]
                if not results:
                    return ProviderResult("tikhub_wechat_channels_username_content", query, False, [], "TikHub resolved WeChat Channels user but returned no homepage items", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_home_page", "auth_mode": "token"})
                return ProviderResult("tikhub_wechat_channels_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_home_page", "pages_attempted": pages_attempted, "auth_mode": "token"})
            except Exception as exc:
                return ProviderResult("tikhub_wechat_channels_username_content", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "auth_mode": "token"})

        if platform == "wechat_mp":
            try:
                search_data = _tikhub_get(base_url, "/api/v1/wechat_mp/web/fetch_search_official_account", {"keyword": username, "offset": 0, "sort_type": "_0"}, headers, config.timeout_seconds)
                accounts = _flatten_candidate_users(search_data)
                selected_account = _match_candidate_user(accounts, username)
                ghid = _pick_str(selected_account, ["ghid", "fakeid", "biz", "id"])
                author = _normalize_tikhub_author(selected_account, fallback_handle=username)
                if not ghid:
                    return ProviderResult("tikhub_wechat_mp_username_content", query, True, [_normalize_result(title=f"WeChat MP search for {username}", snippet="Official account search returned candidates but no ghid/fakeid/biz identifier.", source_type="wechat_mp_search_partial", body="TikHub returned official-account candidates without a resolvable ghid.", metadata={"status": "partial", "platform": "wechat_mp"}, author=author, platform="wechat_mp", item_type="creator_search_partial")], None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_search_official_account_partial", "auth_mode": "token"})
                collected_items: List[Dict[str, Any]] = []
                offset = ""
                pages_attempted = 0
                while len(collected_items) < requested_limit and pages_attempted < 20:
                    articles_data = _tikhub_get(base_url, "/api/v1/wechat_mp/web/fetch_mp_article_list", {"ghid": ghid, "offset": offset}, headers, config.timeout_seconds)
                    items = _flatten_candidate_items(articles_data)
                    if not items:
                        break
                    collected_items.extend(items)
                    pages_attempted += 1
                    next_offset = _extract_cursor(articles_data, ["offset", "next_offset"])
                    if not next_offset or next_offset == offset:
                        break
                    offset = next_offset
                results = [_normalize_tikhub_content_item("wechat_mp", item, fallback_author=author) for item in collected_items[:requested_limit]]
                if not results:
                    return ProviderResult("tikhub_wechat_mp_username_content", query, False, [], "TikHub resolved WeChat MP account but returned no articles", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_mp_article_list", "auth_mode": "token"})
                return ProviderResult("tikhub_wechat_mp_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_mp_article_list", "pages_attempted": pages_attempted, "auth_mode": "token"})
            except Exception as exc:
                return ProviderResult("tikhub_wechat_mp_username_content", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "auth_mode": "token"})

        return ProviderResult(
            "tikhub_wechat_username_content",
            query,
            False,
            [],
            "Please specify platform as wechat_mp or wechat_channels. WeChat has two different creator->content flows.",
            {
                "latency_ms": int((time.time() - started) * 1000),
                "status": "needs_platform_disambiguation",
                "planned_actions": [
                    "wechat_mp.search_official_account -> fetch_mp_article_list",
                    "wechat_channels.fetch_user_search_v2 -> fetch_home_page",
                ],
            },
        )

    if platform == "youtube":
        try:
            search_data = _tikhub_get(base_url, "/api/v1/youtube/web_v2/search_channel", {"search_query": username, "language_code": config.language, "country_code": config.country.lower(), "continuation_token": ""}, headers, config.timeout_seconds)
            channels = _flatten_candidate_users(search_data) or _flatten_candidate_items(search_data)
            selected_channel = _match_candidate_user(channels, username)
            channel_id = _pick_str(selected_channel, ["channel_id", "channelId", "id", "browse_id", "browseId", "external_id"])
            author = _normalize_tikhub_author(selected_channel, fallback_handle=username)
            if not channel_id:
                return ProviderResult("tikhub_youtube_username_content", query, True, [_normalize_result(title=f"YouTube channel search for {username}", snippet="TikHub channel search returned candidates but no channel_id/browse_id identifier.", source_type="youtube_channel_search_partial", body="TikHub returned YouTube channel candidates without a resolvable channel id.", metadata={"status": "partial", "platform": "youtube"}, author=author, platform="youtube", item_type="creator_search_partial")], None, {"latency_ms": int((time.time() - started) * 1000), "step": "search_channel_partial", "auth_mode": "token"})
            collected_items: List[Dict[str, Any]] = []
            continuation_token = ""
            pages_attempted = 0
            endpoint_attempts = [
                ("/api/v1/youtube/web_v2/get_channel_videos", {"channel_id": channel_id, "language_code": config.language, "country_code": config.country.lower()}),
                ("/api/v1/youtube/web/get_channel_videos", {"channel_id": channel_id, "language_code": config.language, "country_code": config.country.lower()}),
            ]
            last_error = ""
            for endpoint, base_params in endpoint_attempts:
                collected_items = []
                continuation_token = ""
                pages_attempted = 0
                try:
                    while len(collected_items) < requested_limit and pages_attempted < 20:
                        params = dict(base_params)
                        params["continuation_token"] = continuation_token
                        videos_data = _tikhub_get(base_url, endpoint, params, headers, config.timeout_seconds)
                        items = _flatten_candidate_items(videos_data)
                        if not items:
                            break
                        collected_items.extend(items)
                        pages_attempted += 1
                        next_token = _extract_cursor(videos_data, ["continuation_token", "continuation", "next_token"])
                        if not next_token or next_token == continuation_token:
                            break
                        continuation_token = next_token
                    if collected_items:
                        results = [_normalize_tikhub_content_item("youtube", item, fallback_author=author) for item in collected_items[:requested_limit]]
                        return ProviderResult("tikhub_youtube_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "get_channel_videos", "endpoint": endpoint, "pages_attempted": pages_attempted, "channel_id": channel_id, "auth_mode": "token"})
                except Exception as exc:
                    last_error = str(exc)
            return ProviderResult("tikhub_youtube_username_content", query, False, [], last_error or "TikHub resolved YouTube channel but returned no videos", {"latency_ms": int((time.time() - started) * 1000), "step": "get_channel_videos", "channel_id": channel_id, "auth_mode": "token"})
        except Exception as exc:
            return ProviderResult("tikhub_youtube_username_content", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "auth_mode": "token"})

    if platform == "instagram":
        return ProviderResult(
            "tikhub_instagram_username_content",
            query,
            False,
            [],
            "Instagram creator->posts/reels requires endpoint confirmation or logged-in browser/API provider; do not use generic web search as captured content.",
            {"latency_ms": int((time.time() - started) * 1000), "status": "needs_endpoint_mapping", "planned_actions": ["instagram.search_user", "instagram.fetch_user_posts", "instagram.fetch_reels", "instagram.fetch_comments"]},
        )

    try:
        if platform == "instagram":
            collected_items: List[Dict[str, Any]] = []
            after = ""
            pages_attempted = 0
            author = _creator_author(display_name=username, handle=username, profile_url=f"https://www.instagram.com/{username.strip('@')}/")
            while len(collected_items) < requested_limit and pages_attempted < 20:
                params = {"username": username.strip("@"), "count": min(page_size, requested_limit - len(collected_items) or page_size), "first": min(page_size, requested_limit - len(collected_items) or page_size)}
                if after:
                    params["after"] = after
                posts_data = _tikhub_get(base_url, "/api/v1/instagram/v3/get_user_posts", params, headers, config.timeout_seconds)
                items = _flatten_candidate_items(posts_data)
                if not items:
                    break
                collected_items.extend(items)
                pages_attempted += 1
                next_after = _extract_cursor(posts_data, ["end_cursor", "after", "next_max_id", "next_cursor"])
                if not next_after or next_after == after:
                    break
                after = next_after
            results = [_normalize_tikhub_content_item("instagram", item, fallback_author=author) for item in collected_items[:requested_limit]]
            if not results:
                return ProviderResult("tikhub_instagram_username_content", query, False, [], "TikHub returned no Instagram posts for this username", {"latency_ms": int((time.time() - started) * 1000), "step": "get_user_posts", "auth_mode": "token"})
            return ProviderResult("tikhub_instagram_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "get_user_posts", "pages_attempted": pages_attempted, "auth_mode": "token"})

        if platform == "xhs":
            # Preferred XHS chain from TikHub OpenAPI:
            # search_users -> user_info -> user_notes. This is closer to the user's intent
            # than generic note search because the goal is username -> that creator's notes.
            search_data = _tikhub_get(
                base_url,
                "/api/v1/xiaohongshu/web_v3/fetch_search_users",
                {"keyword": username, "page": 1},
                headers,
                config.timeout_seconds,
            )
            users = _flatten_candidate_users(search_data)
            selected_user = _match_candidate_user(users, username)
            user_id = _pick_str(selected_user, ["user_id", "id", "userId", "userid"])
            if not user_id:
                # Fallback: keyword note search. This is less accurate and marked as fallback.
                sort_map = {"time_desc": "time_descending", "popularity_desc": "popularity_descending", "relevance": "general"}
                sort = sort_map.get(sort_order, "general")
                fallback_data = _tikhub_get(
                    base_url,
                    "/api/v1/xiaohongshu/app_v2/search_notes",
                    {"keyword": username, "page": 1, "sort_type": sort, "note_type": "不限"},
                    headers,
                    config.timeout_seconds,
                )
                fallback_items = _flatten_candidate_items(fallback_data)
                if not fallback_items:
                    return ProviderResult("tikhub_xhs_username_content", query, False, [], "TikHub returned no XHS user_id and no fallback note items for this username", {"latency_ms": int((time.time() - started) * 1000), "step": "xhs_search_user_then_search_notes_fallback", "requested_limit": requested_limit, "sort_order": sort_order})
                author = _normalize_tikhub_author({}, fallback_handle=username)
                results = [_normalize_tikhub_content_item("xhs", item, fallback_author=author) for item in fallback_items[:requested_limit]]
                for result in results:
                    result["metadata"]["capture_strategy"] = "fallback_search_notes_not_exact_creator"
                return ProviderResult("tikhub_xhs_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "search_notes_fallback", "auth_mode": "token", "requested_limit": requested_limit, "sort_order": sort_order, "accuracy": "fallback_not_exact_creator"})

            profile_data = _tikhub_get(
                base_url,
                "/api/v1/xiaohongshu/web_v3/fetch_user_info",
                {"user_id": user_id},
                headers,
                config.timeout_seconds,
            )
            profile = profile_data if isinstance(profile_data, dict) else _pick_first_dict(profile_data)
            # Some TikHub responses wrap the actual user under data/user/user_info.
            for profile_key in ["user", "user_info", "info"]:
                if isinstance(profile, dict) and isinstance(profile.get(profile_key), dict):
                    profile = profile[profile_key]
                    break
            author = _normalize_tikhub_author(profile or selected_user, fallback_handle=username)
            author["handle"] = author.get("handle") or user_id
            collected_items: List[Dict[str, Any]] = []
            cursor = ""
            pages_attempted = 0
            while len(collected_items) < requested_limit and pages_attempted < 20:
                notes_data = _tikhub_get(
                    base_url,
                    "/api/v1/xiaohongshu/web_v3/fetch_user_notes",
                    {"user_id": user_id, "cursor": cursor, "num": min(30, requested_limit - len(collected_items) or 30)},
                    headers,
                    config.timeout_seconds,
                )
                items = _flatten_candidate_items(notes_data)
                if not items:
                    break
                collected_items.extend(items)
                pages_attempted += 1
                next_cursor = _extract_cursor(notes_data)
                if not next_cursor or next_cursor == cursor:
                    break
                cursor = next_cursor
            if not collected_items:
                return ProviderResult("tikhub_xhs_username_content", query, False, [], "TikHub resolved XHS user_id but returned no user notes", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_notes", "user_id": user_id, "auth_mode": "token"})
            results = [_normalize_tikhub_content_item("xhs", item, fallback_author=author) for item in collected_items[:requested_limit]]
            for result in results:
                result["metadata"]["capture_strategy"] = "search_users_user_info_user_notes"
                result["metadata"]["user_id"] = user_id
            return ProviderResult("tikhub_xhs_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_notes", "auth_mode": "token", "requested_limit": requested_limit, "sort_order": sort_order, "pages_attempted": pages_attempted, "user_id": user_id, "accuracy": "creator_chain"})

        if platform == "douyin":
            search_url = f"{base_url}/api/v1/douyin/web/fetch_user_search?{urllib.parse.urlencode({'keyword': username, 'count': page_size})}"
            search_payload = _http_json(search_url, method="GET", headers=headers, timeout=config.timeout_seconds)
            search_data = _tikhub_extract_data(search_payload)
            users = _flatten_candidate_users(search_data)
            selected_user = users[0] if users else {}
            sec_uid = _pick_str(selected_user, ["sec_uid", "sec_user_id", "sec_user_id_str"])
            author = _normalize_tikhub_author(selected_user, fallback_handle=username)
            if not sec_uid:
                fallback = _normalize_result(
                    title=f"Douyin search for {username}",
                    url="",
                    snippet="TikHub user search returned data but no sec_uid; cannot continue homepage fetch automatically.",
                    source_type="douyin_user_search_partial",
                    body="TikHub returned user candidates without a resolvable sec_uid/homepage identifier.",
                    metadata={"status": "partial", "platform": "douyin"},
                    author=author,
                    platform="douyin",
                    item_type="creator_search_partial",
                )
                return ProviderResult("tikhub_douyin_username_content", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "step": "search_user_partial", "auth_mode": "token"})
            home_data = _tikhub_get(
                base_url,
                "/api/v1/douyin/web/fetch_user_post_videos",
                {"sec_user_id": sec_uid, "count": requested_limit, "max_cursor": "0", "filter_type": "0" if sort_order != "popularity_desc" else "3"},
                headers,
                config.timeout_seconds,
            )
            items = _flatten_candidate_items(home_data)
            results = [_normalize_tikhub_content_item("douyin", item, fallback_author=author) for item in items[:requested_limit]]
            if not results:
                return ProviderResult("tikhub_douyin_username_content", query, False, [], "TikHub user resolved but homepage content list was empty", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_post_list", "auth_mode": "token"})
            return ProviderResult("tikhub_douyin_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_post_list", "auth_mode": "token"})

        if platform == "bilibili":
            search_url = f"{base_url}/api/v1/bilibili/web/fetch_search_user?{urllib.parse.urlencode({'keyword': username, 'page': 1})}"
            search_payload = _http_json(search_url, method="GET", headers=headers, timeout=config.timeout_seconds)
            search_data = _tikhub_extract_data(search_payload)
            users = _flatten_candidate_users(search_data)
            selected_user = users[0] if users else {}
            mid = _pick_str(selected_user, ["mid", "uid", "user_id"])
            author = _normalize_tikhub_author(selected_user, fallback_handle=username)
            if not mid:
                fallback = _normalize_result(
                    title=f"Bilibili search for {username}",
                    url="",
                    snippet="TikHub user search returned data but no mid/user_id; cannot continue video list fetch automatically.",
                    source_type="bilibili_user_search_partial",
                    body="TikHub returned bilibili user candidates without a resolvable uid/mid.",
                    metadata={"status": "partial", "platform": "bilibili"},
                    author=author,
                    platform="bilibili",
                    item_type="creator_search_partial",
                )
                return ProviderResult("tikhub_bilibili_username_content", query, True, [fallback], None, {"latency_ms": int((time.time() - started) * 1000), "step": "search_user_partial", "auth_mode": "token"})
            videos_data = _tikhub_get(
                base_url,
                "/api/v1/bilibili/web/fetch_user_post_videos",
                {"uid": mid, "pn": 1, "order": "pubdate" if sort_order != "popularity_desc" else "click"},
                headers,
                config.timeout_seconds,
            )
            items = _flatten_candidate_items(videos_data)
            results = [_normalize_tikhub_content_item("bilibili", item, fallback_author=author) for item in items[:requested_limit]]
            if not results:
                return ProviderResult("tikhub_bilibili_username_content", query, False, [], "TikHub user resolved but video/article list was empty", {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_video_list", "auth_mode": "token"})
            return ProviderResult("tikhub_bilibili_username_content", query, True, results, None, {"latency_ms": int((time.time() - started) * 1000), "step": "fetch_user_video_list", "auth_mode": "token"})

        return ProviderResult("tikhub_username_content", query, False, [], f"Unsupported TikHub username-to-content platform: {platform}", {"latency_ms": int((time.time() - started) * 1000)})
    except Exception as exc:
        return ProviderResult(f"tikhub_{platform}_username_content", query, False, [], str(exc), {"latency_ms": int((time.time() - started) * 1000), "auth_mode": "token"})
