# 集成计划

## 当前目标

将 `source-router` 从“文档型 skill”升级为：

1. **真正的多搜索服务聚合层**
2. **真正的问题到信息源路由层**
3. **面向 Claude Code / OpenClaw 的可执行 skill 包**
4. **能输出 creator / 平台内容结构化 JSON 的第一版抓取入口**

## 当前结构

```text
wenxuan-skills/
  source-router/
    SKILL.md
    .env.example
    scripts/
      config.py
      providers.py
      search_aggregator.py
      README.md
    references/
      routing-policy.md
      source-profiles.md
      integration-plan.md
    examples/
    tests/
    output/
```

## Provider 全量清单

### 搜索聚合服务
- `github`
- `github_issues`
- `github_code`
- `github_discussions`
- `youtube`
- `reddit`
- `x`
- `bilibili`
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

## 已实现状态

### 聚合层
- provider priority list
- 自动 fallback
- task-type 推断
- platform hint 推断
- creator hint 支持
- 统一 JSON schema
- `--save` 落盘 JSON + Markdown

### GitHub 深度检索
- repo search
- issues search
- code search
- discussions URL fallback
- 无 `GITHUB_TOKEN` 时匿名 fallback 到 GitHub web search URL

### 核心 5 源第一阶段
- YouTube：search URL adapter
- Reddit：search URL adapter
- X / Twitter：search URL adapter
- B站：search URL adapter
- GitHub：API + web fallback

### 搜索服务
- Tavily
- Exa
- Brave
- SerpAPI
- Serper
- Bing
- Google CSE

## Stub / 待确认实现

### TikHub
当前仅为 provider skeleton，需要：
- 确认 endpoint
- 确认 auth header
- 确认 XHS / 抖音 / B站 / 微信生态的平台 route
- 确认 creator search 与 content listing 的接口差异

### Metaso
需要：
- 官方 API endpoint
- 鉴权格式
- 搜索响应 schema

### Firecrawl
需要：
- 账户实际可用的 endpoint
- 是 `/v1/search` 还是 extract-first flow
- 返回 schema 对齐

### GitHub Discussions
需要：
- GraphQL query
- repo-scoped discussion strategy
- thread normalization

## 下一步最重要的增强

### 1. 核心 5 源从“搜索入口适配”升级为“内容抓取适配”
优先顺序：
- YouTube：频道 / 视频 / 描述 / transcript / 评论摘要
- Reddit：subreddit / post / comments tree
- X：profile / timeline / thread
- B站：UP 主 / 视频列表 / 简介 / 评论摘要

### 2. TikHub 平台族落地
- 小红书 / 抖音 / B站 / 公众号 / 视频号
- creator profile
- content list
- metadata
- partial comments

### 3. browser-use / OpenClaw 会话增强
用于：
- 登录态平台
- 纯前端渲染
- 反爬更强的平台

### 4. 沉淀层对接
- `Clippings/` 自动生成标准内容文件
- 接 `scripts/sync-to-feishu.sh`
- 接 `scripts/sync-to-feishu-base.sh`

## 设计取舍

当前第一版强调：
- 先把**结构、schema、fallback、provider 协议**做对
- 不假装已经完成所有封闭平台的全量抓取
- 先对核心 5 源建立统一入口
- 对不完整平台明确标记 `phase1_adapter` / `stub` / `partial`

这样后续接 TikHub / browser-use / 平台 API 时，不需要重做整个技能架构。
