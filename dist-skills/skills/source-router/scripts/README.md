# scripts

Executable layer for the Source Router skill.

## Main commands

Run from the `source-router` skill root.

```bash
python scripts/search_aggregator.py --query "SEO 是啥" --json
python scripts/search_aggregator.py --query "帮我读取 https://example.com" --json
python scripts/search_aggregator.py --query "爬取 https://example.com 全站" --json
python scripts/search_aggregator.py --query "social media search agent" --task-type repo_lookup --platform github --json
python scripts/search_aggregator.py --query "基德的秘宝箱 小红书账号 按时间排序前45篇" --task-type username_content --platform xhs --creator "基德的秘宝箱" --limit 45 --sort time_desc --json
```

## Scripts

- `config.py`: provider priority, environment loading, mode/budget config.
- `providers.py`: provider adapters and normalized result mapping.
- `search_aggregator.py`: main router and aggregator.
- `web_access.py`: URL extraction and site crawl.

## Environment loading

The scripts load `.env` without external dependencies. Existing shell environment variables win.

Search order:

```text
current working directory/.env
skill root/.env
skill root/.env.local
```

## Provider modes

```text
fast       first available provider
balanced   default, a few cross-checking providers
deep       more providers + extraction
social     TikHub/social-first
technical  GitHub/issues/code/Reddit-first
```

## Budget

```text
low
medium
high
```

## Diagnose providers

```bash
python scripts/search_aggregator.py --query "AI agent reddit feedback" --platform reddit --diagnose-providers
```

## Web Access

```bash
python scripts/web_access.py extract "https://example.com" --json
python scripts/web_access.py crawl "https://example.com" --depth 1 --limit 20 --json
```

Fallback chain:

```text
Jina Reader -> Firecrawl -> plain HTTP -> browser fallback strategy
```

Browser fallback is documented in `references/browser-use-strategy.md`; Python does not directly call MCP browser tools.
