---
name: source-router
description: Route research and creator-capture requests to the right source: GitHub, web search, Web Access, TikHub social platforms, Reddit, X, YouTube, XHS, Douyin, Bilibili, WeChat, Instagram, and browser fallback. Use for accurate evidence search, URL extraction, site crawling, or username-to-content capture.
---

# Source Router

Source Router is a portable agent skill for **routing questions to the right information source before searching**. Do not treat generic web search as the answer. First decide whether the user needs context, code evidence, URL extraction, site crawling, platform search, or creator content capture.

## When to use

Use this skill when the user asks to:

- Find accurate evidence across multiple sources.
- Search GitHub projects, code, issues, or discussions.
- Extract or summarize a URL.
- Crawl a site.
- Search social platforms such as Reddit, X, YouTube, XHS, Douyin, Bilibili, WeChat, or Instagram.
- Capture a creator/account/channel's recent posts, articles, videos, or notes.
- Decide which source is most appropriate before searching.

## Core rule

Always classify the task first:

- `entity_context`: user asks “who/what is this?” or needs background.
- `repo_lookup` / `technical_howto`: technical project/code questions; prefer GitHub + issues + Reddit.
- `url_extract`: known URL; use Web Access extraction.
- `site_crawl`: known site and user asks to crawl/map pages.
- `username_content`: user asks for a platform account’s posts/videos/articles/notes.
- `video_search` / `social_tactic` / `simple_search`: platform or broad search.

For creator/account capture, default to 10 items unless the user asks for a number, e.g. “前45篇 / 最近30条 / top20”.

## Main scripts

Run from the skill root unless the host agent exposes a skill directory variable.

```bash
python scripts/search_aggregator.py --query "SEO 是啥" --json
python scripts/search_aggregator.py --query "帮我读取 https://example.com" --json
python scripts/search_aggregator.py --query "爬取 https://example.com 全站" --json
python scripts/search_aggregator.py --query "基德的秘宝箱 小红书账号 按时间排序前45篇" --task-type username_content --platform xhs --creator "基德的秘宝箱" --limit 45 --sort time_desc --json
python scripts/search_aggregator.py --query "social media search agent" --task-type repo_lookup --platform github --diagnose-providers
```

## Provider behavior

The script is key-aware:

1. Build a planned provider list from task type and platform.
2. Check which API keys are configured.
3. Call only available providers unless `--all-providers` is used.
4. Record missing keys in `skipped_providers`.
5. Mark incomplete/fallback-only results as `partial`.

Supported provider families:

- GitHub: repositories, issues, code, discussions fallback.
- Web search: Tavily, Exa, Brave, SerpAPI, Serper, Bing, Google CSE.
- Web Access: Jina Reader, Firecrawl, plain HTTP, browser fallback strategy.
- TikHub: XHS, Douyin, Bilibili, WeChat MP, WeChat Channels, Instagram, Reddit, X, YouTube.
- Fallback search URLs: YouTube, Bilibili, Reddit, X.

## Environment variables

Copy `.env.example` to `.env` locally or export variables in the shell. Never publish `.env`.

Important keys:

```text
TIKHUB_API_KEY=          # social platform capture
TAVILY_API_KEY=          # web search
EXA_API_KEY=             # semantic web search
BRAVE_SEARCH_API_KEY=    # web search
GITHUB_TOKEN=            # optional but recommended for stable GitHub API usage
FIRECRAWL_API_KEY=       # optional for stronger URL/site extraction
```

Without a key, the skill should not pretend full capture worked. It should return fallback search URLs or `skipped_providers`.

## Browser fallback

Python scripts cannot directly call MCP browser tools. If extraction requires login, JS rendering, infinite scroll, or visual confirmation, follow:

- `references/browser-use-strategy.md`

For Claude Code/Newmax with browser-use MCP available, use browser tools after script output indicates browser fallback is required.

## References

- `references/tikhub-endpoints.md`: TikHub endpoint whitelist and platform chains.
- `references/browser-use-strategy.md`: browser-use fallback workflow.
- `scripts/README.md`: script usage details.

## Output contract

The aggregator returns JSON with:

```json
{
  "query": "...",
  "route_plan": {},
  "task_type": "...",
  "platform_hint": "...",
  "creator_hint": "...",
  "success": true,
  "results": [],
  "creator": {},
  "related_links": [],
  "capture_meta": {
    "attempted_providers": [],
    "skipped_providers": [],
    "captured_count": 0,
    "completeness": "high|partial|low"
  }
}
```

## Accuracy rules

- Do not present a search-result URL as captured content.
- Do not claim TikHub/social capture succeeded when `TIKHUB_API_KEY` is missing.
- For “who/what is X?” questions, do context search first; do not default to content scraping.
- For “username -> posts/videos/articles” questions, prefer platform-specific creator chains.
- Preserve source URLs and provider errors for auditability.
