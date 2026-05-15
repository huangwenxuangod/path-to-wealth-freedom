from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = BASE_DIR / "output"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_output_dir() -> Path:
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return DEFAULT_OUTPUT_DIR


def slugify(value: str) -> str:
    slug = re.sub(r"[^\w\-一-鿿]+", "-", value.strip().lower())
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "url"


def _http_text(url: str, *, method: str = "GET", headers: Optional[Dict[str, str]] = None, body: Optional[Dict[str, Any]] = None, timeout: int = 25) -> str:
    data = None
    req_headers = headers or {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        req_headers.setdefault("Content-Type", "application/json")
    request = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read()
        encoding = response.headers.get_content_charset() or "utf-8"
        return raw.decode(encoding, errors="replace")


def _http_json(url: str, *, method: str = "GET", headers: Optional[Dict[str, str]] = None, body: Optional[Dict[str, Any]] = None, timeout: int = 25) -> Dict[str, Any]:
    return json.loads(_http_text(url, method=method, headers=headers, body=body, timeout=timeout))


def html_to_text(html: str) -> str:
    html = re.sub(r"(?is)<script.*?</script>", " ", html)
    html = re.sub(r"(?is)<style.*?</style>", " ", html)
    html = re.sub(r"(?is)<noscript.*?</noscript>", " ", html)
    html = re.sub(r"(?is)<br\s*/?>", "\n", html)
    html = re.sub(r"(?is)</p>|</div>|</h[1-6]>|</li>|</tr>", "\n", html)
    text = re.sub(r"(?is)<[^>]+>", " ", html)
    replacements = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    text = re.sub(r"[ \t\r\f\v]+", " ", text)
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
    return text.strip()


def extract_title_from_html(html: str) -> str:
    match = re.search(r"(?is)<title[^>]*>(.*?)</title>", html)
    if not match:
        return ""
    return html_to_text(match.group(1)).strip()


def normalize_extract_result(*, url: str, provider: str, success: bool, title: str = "", content_markdown: str = "", content_text: str = "", links: Optional[List[str]] = None, images: Optional[List[str]] = None, raw: Optional[Dict[str, Any]] = None, error: Optional[str] = None, latency_ms: int = 0) -> Dict[str, Any]:
    return {
        "url": url,
        "success": success,
        "provider": provider,
        "title": title,
        "content_markdown": content_markdown,
        "content_text": content_text or content_markdown,
        "links": links or [],
        "images": images or [],
        "raw": raw or {},
        "error": error,
        "latency_ms": latency_ms,
    }


def jina_reader_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("URL must start with http:// or https://")
    # Jina Reader supports https://r.jina.ai/http://<host/path> and https://r.jina.ai/http://https://...,
    # but the most stable public form is to strip the scheme and prefix with http://.
    return "https://r.jina.ai/http://" + url.split("://", 1)[1]


def extract_with_jina(url: str, *, timeout: int = 25) -> Dict[str, Any]:
    started = time.time()
    try:
        target = jina_reader_url(url)
        text = _http_text(target, headers={"Accept": "text/plain", "User-Agent": "source-router-web-access"}, timeout=timeout)
        title = ""
        first_lines = [line.strip() for line in text.splitlines() if line.strip()]
        if first_lines and first_lines[0].lower().startswith("title:"):
            title = first_lines[0].split(":", 1)[1].strip()
        elif first_lines:
            title = first_lines[0][:120]
        return normalize_extract_result(url=url, provider="jina_reader", success=bool(text.strip()), title=title, content_markdown=text, content_text=text, raw={"reader_url": target}, latency_ms=int((time.time() - started) * 1000))
    except Exception as exc:
        return normalize_extract_result(url=url, provider="jina_reader", success=False, error=str(exc), latency_ms=int((time.time() - started) * 1000))


def extract_with_firecrawl(url: str, *, timeout: int = 25) -> Dict[str, Any]:
    started = time.time()
    api_key = os.getenv("FIRECRAWL_API_KEY", "")
    if not api_key:
        return normalize_extract_result(url=url, provider="firecrawl", success=False, error="Missing FIRECRAWL_API_KEY", latency_ms=int((time.time() - started) * 1000))
    endpoints = [
        ("https://api.firecrawl.dev/v1/scrape", {"url": url, "formats": ["markdown", "html"]}),
        ("https://api.firecrawl.dev/v0/scrape", {"url": url}),
    ]
    last_error = ""
    for endpoint, payload in endpoints:
        try:
            data = _http_json(endpoint, method="POST", headers={"Authorization": f"Bearer {api_key}"}, body=payload, timeout=timeout)
            body = data.get("data") if isinstance(data.get("data"), dict) else data
            markdown = body.get("markdown") or body.get("content") or ""
            html = body.get("html") or ""
            title = body.get("metadata", {}).get("title") if isinstance(body.get("metadata"), dict) else ""
            return normalize_extract_result(url=url, provider="firecrawl", success=bool(markdown or html), title=title or extract_title_from_html(html), content_markdown=markdown or html_to_text(html), content_text=html_to_text(html) if html else markdown, raw={"endpoint": endpoint}, latency_ms=int((time.time() - started) * 1000))
        except Exception as exc:
            last_error = str(exc)
    return normalize_extract_result(url=url, provider="firecrawl", success=False, error=last_error or "Firecrawl scrape failed", latency_ms=int((time.time() - started) * 1000))


def firecrawl_map(url: str, *, limit: int = 100, timeout: int = 25) -> Dict[str, Any]:
    started = time.time()
    api_key = os.getenv("FIRECRAWL_API_KEY", "")
    if not api_key:
        return {"success": False, "provider": "firecrawl_map", "urls": [], "error": "Missing FIRECRAWL_API_KEY", "latency_ms": int((time.time() - started) * 1000)}
    endpoints = [
        ("https://api.firecrawl.dev/v1/map", {"url": url, "limit": limit}),
        ("https://api.firecrawl.dev/v0/map", {"url": url}),
    ]
    last_error = ""
    for endpoint, payload in endpoints:
        try:
            data = _http_json(endpoint, method="POST", headers={"Authorization": f"Bearer {api_key}"}, body=payload, timeout=timeout)
            raw_urls = data.get("links") or data.get("urls") or data.get("data") or []
            if isinstance(raw_urls, dict):
                raw_urls = raw_urls.get("links") or raw_urls.get("urls") or []
            urls = [item if isinstance(item, str) else item.get("url", "") for item in raw_urls if isinstance(item, (str, dict))]
            urls = [item for item in urls if item][:limit]
            return {"success": bool(urls), "provider": "firecrawl_map", "urls": urls, "raw": {"endpoint": endpoint}, "error": None if urls else "No URLs returned", "latency_ms": int((time.time() - started) * 1000)}
        except Exception as exc:
            last_error = str(exc)
    return {"success": False, "provider": "firecrawl_map", "urls": [], "error": last_error or "Firecrawl map failed", "latency_ms": int((time.time() - started) * 1000)}


def firecrawl_crawl(url: str, *, limit: int = 20, depth: int = 1, timeout: int = 25) -> Dict[str, Any]:
    started = time.time()
    api_key = os.getenv("FIRECRAWL_API_KEY", "")
    if not api_key:
        return {"success": False, "provider": "firecrawl_crawl", "pages": [], "error": "Missing FIRECRAWL_API_KEY", "latency_ms": int((time.time() - started) * 1000)}
    endpoints = [
        ("https://api.firecrawl.dev/v1/crawl", {"url": url, "limit": limit, "maxDepth": depth, "scrapeOptions": {"formats": ["markdown", "html"]}}),
        ("https://api.firecrawl.dev/v0/crawl", {"url": url, "limit": limit}),
    ]
    last_error = ""
    for endpoint, payload in endpoints:
        try:
            data = _http_json(endpoint, method="POST", headers={"Authorization": f"Bearer {api_key}"}, body=payload, timeout=timeout)
            raw_pages = data.get("data") or data.get("pages") or []
            if isinstance(raw_pages, dict):
                raw_pages = raw_pages.get("data") or raw_pages.get("pages") or []
            pages = []
            for page in raw_pages[:limit] if isinstance(raw_pages, list) else []:
                if not isinstance(page, dict):
                    continue
                metadata = page.get("metadata") if isinstance(page.get("metadata"), dict) else {}
                page_url = metadata.get("sourceURL") or metadata.get("url") or page.get("url") or url
                markdown = page.get("markdown") or page.get("content") or ""
                html = page.get("html") or ""
                pages.append({
                    "url": page_url,
                    "success": True,
                    "provider": "firecrawl_crawl",
                    "title": metadata.get("title") or extract_title_from_html(html),
                    "content_markdown": markdown or html_to_text(html),
                    "content_text": html_to_text(html) if html else markdown,
                    "links": [],
                    "images": [],
                    "attempts": [],
                    "captured_at": utc_now_iso(),
                })
            return {"success": bool(pages), "provider": "firecrawl_crawl", "pages": pages, "raw": {"endpoint": endpoint}, "error": None if pages else "No pages returned; async crawl job may require polling", "latency_ms": int((time.time() - started) * 1000)}
        except Exception as exc:
            last_error = str(exc)
    return {"success": False, "provider": "firecrawl_crawl", "pages": [], "error": last_error or "Firecrawl crawl failed", "latency_ms": int((time.time() - started) * 1000)}


def extract_with_plain_http(url: str, *, timeout: int = 25) -> Dict[str, Any]:
    started = time.time()
    try:
        html = _http_text(url, headers={"User-Agent": "Mozilla/5.0 source-router-web-access"}, timeout=timeout)
        title = extract_title_from_html(html)
        text = html_to_text(html)
        links = sorted(set(urllib.parse.urljoin(url, href) for href in re.findall(r'(?is)<a[^>]+href=["\']([^"\']+)["\']', html)))[:200]
        images = sorted(set(urllib.parse.urljoin(url, src) for src in re.findall(r'(?is)<img[^>]+src=["\']([^"\']+)["\']', html)))[:100]
        return normalize_extract_result(url=url, provider="plain_http", success=bool(text), title=title, content_markdown=text, content_text=text, links=links, images=images, latency_ms=int((time.time() - started) * 1000))
    except Exception as exc:
        return normalize_extract_result(url=url, provider="plain_http", success=False, error=str(exc), latency_ms=int((time.time() - started) * 1000))


def browser_fallback_result(url: str) -> Dict[str, Any]:
    return normalize_extract_result(
        url=url,
        provider="browser_fallback",
        success=False,
        error="Browser fallback requires runtime MCP browser-use execution by the agent; Python scripts cannot call MCP tools directly.",
        raw={
            "strategy": "Use browser-use MCP when API/plain extractors fail, page is JS-rendered, login is required, or visual confirmation is needed.",
            "planned_steps": [
                "browser_list_workflows; if a recorded extraction workflow exists, collect parameters and run it",
                "browser_list_profiles; if multiple profiles exist, ask the user which profile to use",
                "browser_open(profile, url)",
                "browser_eval(document.querySelector('main, article, .content, #content')?.innerText || document.body.innerText)",
                "browser_eval(Array.from(document.querySelectorAll('a')).map(a => ({text: a.textContent.trim(), href: a.href})).filter(a => a.text || a.href))",
                "browser_eval(Array.from(document.images).map(img => img.currentSrc || img.src).filter(Boolean))",
                "browser_close",
            ],
            "use_when": ["login_required", "js_rendered", "infinite_scroll", "api_extractors_failed", "visual_confirmation_needed"],
            "output_contract": {
                "title": "document.title",
                "content_text": "main/article/content innerText or body innerText",
                "links": "anchor text and href list",
                "images": "image src list",
            },
        },
    )


def extract_url(url: str, *, providers: Optional[List[str]] = None, timeout: int = 25) -> Dict[str, Any]:
    providers = providers or ["jina", "firecrawl", "plain_http", "browser"]
    attempts: List[Dict[str, Any]] = []
    for provider in providers:
        if provider in {"jina", "jina_reader"}:
            result = extract_with_jina(url, timeout=timeout)
        elif provider == "firecrawl":
            result = extract_with_firecrawl(url, timeout=timeout)
        elif provider in {"plain", "plain_http"}:
            result = extract_with_plain_http(url, timeout=timeout)
        elif provider in {"browser", "browser_use", "playwright"}:
            result = browser_fallback_result(url)
        else:
            result = normalize_extract_result(url=url, provider=provider, success=False, error=f"Unknown extractor provider: {provider}")
        attempts.append(result)
        if result.get("success") and (result.get("content_markdown") or result.get("content_text")):
            return {
                "url": url,
                "success": True,
                "provider": result["provider"],
                "title": result.get("title", ""),
                "content_markdown": result.get("content_markdown", ""),
                "content_text": result.get("content_text", ""),
                "links": result.get("links", []),
                "images": result.get("images", []),
                "attempts": attempts,
                "captured_at": utc_now_iso(),
            }
    return {
        "url": url,
        "success": False,
        "provider": None,
        "title": "",
        "content_markdown": "",
        "content_text": "",
        "links": [],
        "images": [],
        "attempts": attempts,
        "captured_at": utc_now_iso(),
        "error": "All extractors failed",
    }


def crawl_site(url: str, *, depth: int = 1, limit: int = 20, timeout: int = 25, prefer_firecrawl: bool = True) -> Dict[str, Any]:
    started = time.time()
    crawl_attempts: List[Dict[str, Any]] = []
    if prefer_firecrawl:
        fc_crawl = firecrawl_crawl(url, limit=limit, depth=depth, timeout=timeout)
        crawl_attempts.append({"provider": fc_crawl.get("provider"), "success": fc_crawl.get("success"), "error": fc_crawl.get("error"), "latency_ms": fc_crawl.get("latency_ms")})
        if fc_crawl.get("success") and fc_crawl.get("pages"):
            return {"root_url": url, "success": True, "provider": "firecrawl_crawl", "pages": fc_crawl.get("pages", [])[:limit], "errors": [], "page_count": len(fc_crawl.get("pages", [])[:limit]), "crawl_attempts": crawl_attempts, "captured_at": utc_now_iso(), "latency_ms": int((time.time() - started) * 1000)}
        fc_map = firecrawl_map(url, limit=limit, timeout=timeout)
        crawl_attempts.append({"provider": fc_map.get("provider"), "success": fc_map.get("success"), "error": fc_map.get("error"), "latency_ms": fc_map.get("latency_ms")})
        if fc_map.get("success") and fc_map.get("urls"):
            pages: List[Dict[str, Any]] = []
            errors: List[Dict[str, Any]] = []
            for mapped_url in fc_map.get("urls", [])[:limit]:
                result = extract_url(mapped_url, timeout=timeout)
                if result.get("success"):
                    pages.append(result)
                else:
                    errors.append({"url": mapped_url, "error": result.get("error"), "attempts": result.get("attempts", [])})
            return {"root_url": url, "success": bool(pages), "provider": "firecrawl_map_then_extract", "pages": pages[:limit], "errors": errors, "page_count": len(pages[:limit]), "crawl_attempts": crawl_attempts, "captured_at": utc_now_iso(), "latency_ms": int((time.time() - started) * 1000)}

    root = extract_url(url, timeout=timeout)
    pages: List[Dict[str, Any]] = []
    errors: List[Dict[str, Any]] = []
    if root.get("success"):
        pages.append(root)
    else:
        errors.append({"url": url, "error": root.get("error"), "attempts": root.get("attempts", [])})
        return {"root_url": url, "success": False, "pages": pages, "errors": errors, "page_count": 0, "crawl_attempts": crawl_attempts, "captured_at": utc_now_iso(), "latency_ms": int((time.time() - started) * 1000)}

    if depth <= 0 or limit <= 1:
        return {"root_url": url, "success": True, "pages": pages[:limit], "errors": errors, "page_count": len(pages[:limit]), "crawl_attempts": crawl_attempts, "captured_at": utc_now_iso(), "latency_ms": int((time.time() - started) * 1000)}

    root_host = urllib.parse.urlparse(url).netloc
    queue = []
    seen = {url}
    for link in root.get("links", []):
        if len(queue) >= limit - 1:
            break
        parsed = urllib.parse.urlparse(link)
        if parsed.scheme in {"http", "https"} and parsed.netloc == root_host and link not in seen:
            queue.append((link, 1))
            seen.add(link)

    while queue and len(pages) < limit:
        current_url, current_depth = queue.pop(0)
        result = extract_url(current_url, timeout=timeout)
        if result.get("success"):
            pages.append(result)
            if current_depth < depth:
                for link in result.get("links", []):
                    parsed = urllib.parse.urlparse(link)
                    if parsed.scheme in {"http", "https"} and parsed.netloc == root_host and link not in seen and len(pages) + len(queue) < limit:
                        queue.append((link, current_depth + 1))
                        seen.add(link)
        else:
            errors.append({"url": current_url, "error": result.get("error"), "attempts": result.get("attempts", [])})
    return {"root_url": url, "success": bool(pages), "provider": "plain_crawl", "pages": pages[:limit], "errors": errors, "page_count": len(pages[:limit]), "crawl_attempts": crawl_attempts, "captured_at": utc_now_iso(), "latency_ms": int((time.time() - started) * 1000)}


def save_result(result: Dict[str, Any], *, prefix: str, key: str) -> Dict[str, str]:
    output_dir = ensure_output_dir()
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    slug = slugify(key)[:80]
    json_path = output_dir / f"{timestamp}-{prefix}-{slug}.json"
    md_path = output_dir / f"{timestamp}-{prefix}-{slug}.md"
    json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [f"# {key}", "", f"- Success: {result.get('success')}", f"- Captured at: {result.get('captured_at')}", ""]
    if "pages" in result:
        for idx, page in enumerate(result.get("pages", []), start=1):
            lines.extend([f"## {idx}. {page.get('title') or page.get('url')}", "", f"URL: {page.get('url')}", "", (page.get("content_markdown") or page.get("content_text") or "")[:3000], ""])
    else:
        lines.extend([f"URL: {result.get('url')}", "", f"Provider: {result.get('provider')}", "", result.get("content_markdown") or result.get("content_text") or ""])
    md_path.write_text("\n".join(lines), encoding="utf-8")
    return {"json": str(json_path), "markdown": str(md_path)}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Web Access extractor/crawler for source-router")
    sub = parser.add_subparsers(dest="command", required=True)

    extract_parser = sub.add_parser("extract", help="Extract one URL into markdown/text")
    extract_parser.add_argument("url")
    extract_parser.add_argument("--providers", default="jina,firecrawl,plain_http,browser", help="Comma-separated extractors")
    extract_parser.add_argument("--timeout", type=int, default=int(os.getenv("SOURCE_ROUTER_TIMEOUT", "25")))
    extract_parser.add_argument("--save", action="store_true")
    extract_parser.add_argument("--json", action="store_true")

    crawl_parser = sub.add_parser("crawl", help="Crawl same-domain pages starting from one URL")
    crawl_parser.add_argument("url")
    crawl_parser.add_argument("--depth", type=int, default=1)
    crawl_parser.add_argument("--limit", type=int, default=20)
    crawl_parser.add_argument("--timeout", type=int, default=int(os.getenv("SOURCE_ROUTER_TIMEOUT", "25")))
    crawl_parser.add_argument("--no-firecrawl", action="store_true", help="Skip Firecrawl map/crawl and use plain same-domain extraction")
    crawl_parser.add_argument("--save", action="store_true")
    crawl_parser.add_argument("--json", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.command == "extract":
        providers = [provider.strip() for provider in args.providers.split(",") if provider.strip()]
        result = extract_url(args.url, providers=providers, timeout=args.timeout)
        if args.save:
            result["saved_files"] = save_result(result, prefix="extract", key=args.url)
    elif args.command == "crawl":
        result = crawl_site(args.url, depth=args.depth, limit=args.limit, timeout=args.timeout, prefer_firecrawl=not args.no_firecrawl)
        if args.save:
            result["saved_files"] = save_result(result, prefix="crawl", key=args.url)
    else:
        raise ValueError(f"Unknown command: {args.command}")

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Success: {result.get('success')}")
        if result.get("url"):
            print(f"URL: {result.get('url')}")
            print(f"Provider: {result.get('provider')}")
            print((result.get("content_text") or result.get("content_markdown") or "")[:1000])
        if result.get("pages") is not None:
            print(f"Pages: {result.get('page_count')}")
        if result.get("saved_files"):
            print("Saved files:")
            for kind, path in result["saved_files"].items():
                print(f"- {kind}: {path}")
    return 0 if result.get("success") else 1


if __name__ == "__main__":
    sys.exit(main())
