# Source Router Skill

A portable multi-source research and creator-capture skill for AI agents.

Source Router routes a user request to the right evidence source before searching. It supports GitHub, web search providers, URL extraction, site crawling, TikHub social platforms, and browser fallback strategy.

## Install

### Claude Code project install

Copy this folder to your project:

```text
.claude/skills/source-router/
```

### Claude Code global install

Copy this folder to:

```text
~/.claude/skills/source-router/
```

### skills.sh / npx skills style

Publish this repository publicly, then install from the skill path:

```bash
npx skills add https://github.com/<owner>/<repo>/tree/main/skills/source-router
```

If the repository root is this package and contains `skills/source-router`, point to that path.

## Requirements

- Python 3.10+
- No external Python package required for the current core scripts.
- Optional API keys for stronger providers.

## Environment

Copy `.env.example` to a local `.env` next to this README, or export variables in your shell.

Important variables:

```text
TIKHUB_API_KEY=          # XHS/Douyin/Bilibili/WeChat/Instagram/Reddit/X/YouTube via TikHub
GITHUB_TOKEN=            # optional but recommended
TAVILY_API_KEY=
EXA_API_KEY=
BRAVE_SEARCH_API_KEY=
FIRECRAWL_API_KEY=
SOURCE_ROUTER_MODE=
SOURCE_ROUTER_BUDGET=medium
```

Never commit `.env`.

## Usage

Run from the `source-router` skill directory:

```bash
python scripts/search_aggregator.py --query "SEO 是啥" --json
python scripts/search_aggregator.py --query "帮我读取 https://example.com" --json
python scripts/search_aggregator.py --query "爬取 https://example.com 全站" --json
python scripts/search_aggregator.py --query "social media search agent" --task-type repo_lookup --platform github --json
python scripts/search_aggregator.py --query "基德的秘宝箱 小红书账号 按时间排序前45篇" --task-type username_content --platform xhs --creator "基德的秘宝箱" --limit 45 --sort time_desc --json
```

Diagnose providers before running:

```bash
python scripts/search_aggregator.py --query "AI agent reddit feedback" --platform reddit --diagnose-providers
```

## Supported task types

- `entity_context`
- `concept_explainer`
- `simple_search`
- `technical_howto`
- `repo_lookup`
- `tool_selection`
- `trend_signal`
- `video_search`
- `url_extract`
- `site_crawl`
- `creator_capture`
- `social_tactic`
- `username_content`

## Provider modes

```bash
--mode fast
--mode balanced
--mode deep
--mode social
--mode technical
```

Budget:

```bash
--budget low
--budget medium
--budget high
```

## Files

```text
source-router/
  SKILL.md
  README.md
  .env.example
  scripts/
    config.py
    providers.py
    search_aggregator.py
    web_access.py
    README.md
  references/
    tikhub-endpoints.md
    browser-use-strategy.md
```

## Browser fallback

Browser automation is not executed inside Python. When the script reports that browser fallback is needed, the host agent should follow `references/browser-use-strategy.md` using its browser tool, such as browser-use MCP in Claude Code/Newmax.

## Publishing checklist

Before publishing:

```text
[ ] No .env or .env.local
[ ] No output/ directory
[ ] No __pycache__ or *.pyc
[ ] README uses relative commands
[ ] SKILL.md has portable frontmatter
[ ] .env.example included
[ ] references included
[ ] scripts compile with Python
```
