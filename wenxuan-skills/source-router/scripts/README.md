# scripts

本目录放 `source-router` 的**可执行脚本层**。

## 当前脚本

- `config.py`：服务优先级、环境变量、默认参数
- `providers.py`：所有搜索服务 provider 的统一适配层
- `search_aggregator.py`：统一入口，按优先级调用 provider，失败自动回退，并生成结构化抓取结果

## 目标

让 skill 不只是“告诉代理怎么思考”，而是具备：
- 实际发起请求
- 统一处理响应
- 标准化结果结构
- 自动回退和错误报告
- 支持 creator / 平台级抓取输出 JSON 与 Markdown

## 当前 provider 覆盖

### 搜索聚合服务
- `github`（GitHub repository search，支持无 token 匿名 fallback）
- `github_issues`
- `github_code`
- `github_discussions`（当前为 URL fallback / stub）
- `youtube`（phase 1 adapter）
- `reddit`（phase 1 adapter）
- `x`（phase 1 adapter）
- `bilibili`（phase 1 adapter）
- `tavily`
- `exa`
- `brave`
- `metaso`
- `serpapi`
- `serper`
- `bing`
- `google_cse`
- `firecrawl`
- `tikhub`

### 路由层能力
`search_aggregator.py` 已支持：
- 问题类型推断（如 `concept_explainer` / `repo_lookup` / `creator_capture`）
- 平台 hint 推断（GitHub / YouTube / B站 / X / Reddit / XHS / 抖音 / 微信）
- provider priority plan 构建
- 统一 schema：`creator` / `results[]` / `capture_meta` / `related_links`
- `--save` 落盘 JSON + Markdown 到 `output/`

### 已实现
- GitHub repositories
- GitHub issues
- GitHub code
- GitHub 无 token 搜索 URL fallback
- YouTube 搜索入口适配
- Reddit 搜索入口适配
- X / Twitter 搜索入口适配
- B站搜索入口适配
- Tavily
- Exa
- Brave
- SerpAPI
- Serper
- Bing
- Google CSE

### Stub / 待确认接口
- GitHub discussions（需 GraphQL / repo-scoped 方案）
- Metaso（目前返回官方入口和 next step）
- Firecrawl（目前返回官方入口和 next step）
- TikHub（当前为 provider 骨架，需确认 endpoint / auth / 平台查询格式）

## 关于 GitHub token

`GITHUB_TOKEN` 不是为了“有 token 才能开始”，而是为了：
- 提高 rate limit
- 提高稳定性
- 支持 repo / issues / code 等更频繁、更深入的搜索

当前已实现降级：
- 没有 token 时，GitHub provider 会返回 GitHub web search URL 作为匿名 fallback
- 聚合器仍可继续组合 Tavily / Exa / Brave 等结果

## 统一输出格式

所有 provider 最终都映射成 AI 可直接消费的结构：

```json
{
  "query": "SEO 是啥",
  "task_type": "concept_explainer",
  "platform_hint": "",
  "creator_hint": "",
  "success": true,
  "creator": {
    "platform": "unknown",
    "display_name": "",
    "handle": "",
    "bio": "",
    "profile_url": "",
    "followers": null,
    "verified": null,
    "aliases": [],
    "discovered_from": []
  },
  "results": [
    {
      "platform": "web",
      "type": "result",
      "title": "...",
      "body": "...",
      "transcript": "",
      "comments": [],
      "stats": {},
      "published_at": null,
      "source_url": "...",
      "media_urls": [],
      "tags": [],
      "provider": "tavily",
      "source_type": "web",
      "score": 12.3,
      "metadata": {},
      "author": {}
    }
  ],
  "related_links": ["..."],
  "capture_meta": {
    "attempted_providers": ["tavily", "exa"],
    "failed_providers": [],
    "captured_count": 3,
    "captured_at": "2026-05-13T12:00:00+00:00",
    "completeness": "high"
  },
  "error": null
}
```

## 环境变量

每个服务都通过环境变量读取 key：

- `GITHUB_TOKEN`（可选增强）
- `TAVILY_API_KEY`
- `EXA_API_KEY`
- `BRAVE_SEARCH_API_KEY`
- `METASO_API_KEY`（当前可选）
- `SERPAPI_API_KEY`
- `SERPER_API_KEY`
- `BING_SEARCH_API_KEY`
- `GOOGLE_CSE_API_KEY`
- `GOOGLE_CSE_ENGINE_ID`
- `FIRECRAWL_API_KEY`（当前可选）
- `TIKHUB_API_KEY`（当前可选）

示例见：
- `../.env.example`

## 运行示例

概念检索：

```bash
python "wenxuan-skills/source-router/scripts/search_aggregator.py" --query "SEO 是啥" --json
```

GitHub 项目检索：

```bash
python "wenxuan-skills/source-router/scripts/search_aggregator.py" --query "social media search agent" --task-type repo_lookup --platform github --json
```

搜某个 creator 并落盘：

```bash
python "wenxuan-skills/source-router/scripts/search_aggregator.py" --query "搜索阑夕最近关于 AI 的内容" --task-type creator_capture --platform x --creator 阑夕 --save --json
```

指定 provider 顺序：

```bash
python "wenxuan-skills/source-router/scripts/search_aggregator.py" --query "Claude Code skills" --providers github,github_issues,tavily,exa,brave --json
```
