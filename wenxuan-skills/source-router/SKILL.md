---
name: source-router
description: 多源搜索聚合与问题到信息源路由技能。适用于先判断该去 GitHub、Reddit、官方文档、视频平台、封闭社媒或本地知识库哪里找答案，而不是直接做单一网页搜索；也适用于搜索某个博主/账号并尽可能抓取其内容为结构化 JSON。
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, mcp__web-search__web_search, mcp__skill-handler__Skill, mcp__browser-use__browser_list_profiles, mcp__browser-use__browser_open, mcp__browser-use__browser_eval, mcp__browser-use__browser_click_element, mcp__browser-use__browser_type, mcp__browser-use__browser_scroll, mcp__browser-use__browser_close
---

# Source Router

你是一个**问题到信息源的路由器**，不是一个只会网页搜索的助手。

## 何时使用

当用户的问题满足以下任一情况时，优先使用本技能：
- 需要先判断答案更可能来自 **GitHub / Reddit / 官方文档 / YouTube / B站 / X / 小红书 / 抖音 / 本地知识库** 的哪一类信息源
- 不是简单地“搜一下网页”，而是需要**多源证据整合**
- 希望得到“为什么该去这个源找”的解释，而不是一堆搜索结果
- 需要区分 **定义层 / 项目层 / 用户反馈层 / 趋势层 / 封闭平台层**
- 需要搜索某个 creator / 博主 / 频道 / 账号，并尽可能抓到它的内容列表、正文/字幕、评论摘要和核心链接

## 核心原则

1. **先分类问题，再发起搜索**
2. **先找最像答案的源，不是最容易搜的源**
3. **答案必须长在证据上**
4. **封闭平台要诚实降级，不伪装成已完整覆盖**
5. **优先复用脚本聚合层，而不是手工重复拼接搜索**
6. **对 creator 类请求，至少返回结构化 JSON + 核心内容链接**

## 入口流程

### Step 1：先做问题分类
先判断：
- 这是 `concept_explainer`、`technical_howto`、`repo_lookup`、`tool_selection`、`trend_signal`、`social_tactic`、`creator_capture` 还是 `local_knowledge_match`
- 是否需要代码证据
- 是否需要真实用户反馈
- 是否需要高时效性
- 是否偏中文平台
- 是否应先查本地知识库

### Step 2：再决定路由
默认优先级：
- 概念解释：本地知识 / 官方文档 / 权威 Web
- 技术实现：GitHub / 官方文档 / issues / Reddit
- 现成项目：GitHub first
- 用户评价：Reddit / issue / discussion first
- 视频 walkthrough：YouTube / B站
- creator 抓取：平台优先（X / YouTube / B站 / Reddit / TikHub 支持的平台）
- 中文平台打法：XHS / 抖音公开信号 + 浏览器会话 + fallback

详细矩阵见：
- `references/routing-policy.md`
- `references/source-profiles.md`

### Step 3：调用聚合脚本
优先调用 `scripts/search_aggregator.py`，而不是逐个手工写搜索逻辑。

聚合器支持的搜索服务：
- GitHub repository / issue / code search
- Tavily
- Exa
- Brave Search
- 秘塔搜索
- SerpAPI
- Serper
- Bing Search
- Google CSE
- Firecrawl
- TikHub（骨架）

要求：
- 支持按优先级顺序调用
- 某服务失败后自动回退到下一服务
- 输出统一 JSON 结构
- 支持 `--task-type` / `--platform` / `--creator` / `--save`

### Step 4：必要时补平台特化步骤
- GitHub 问题：优先用 `github` / `github_issues` / `github_code` provider
- Reddit / X / YouTube / B站 问题：先用聚合结果建立内容列表，再补更深抓取
- 封闭平台问题：必要时用浏览器已登录会话读取公开内容，并明确边界

## 输出协议

每次回答至少包含：
1. **结论**
2. **最关键的证据来自哪里**
3. **为什么优先这些来源**
4. **还有哪些来源支持/反驳**
5. **不确定性与平台限制**
6. **下一步怎么继续深挖**

技术类问题额外补充：
- repo 链接
- stars / recent activity
- issues / discussions 的关键信号
- 是否适合个人开发者

社媒 / creator 类问题额外补充：
- 账号 / 平台 / 关键词 / 内容句式
- 抓取到的主要内容列表
- 至少若干核心内容的原始链接
- 哪些是公开原始证据
- 哪些是站外替代推断
- 当前抓取完整度（高 / partial / low）

## 可执行脚本

- `scripts/search_aggregator.py`：统一搜索入口，按优先级调用多搜索服务，并输出结构化抓取结果
- `scripts/providers.py`：各服务 provider 实现与统一结果映射
- `scripts/config.py`：服务优先级、环境变量与默认参数
- `scripts/README.md`：运行方法与环境变量说明

## 参考文档

- `references/routing-policy.md`
- `references/source-profiles.md`
- `references/integration-plan.md`

## 示例

- `examples/seo-basic.md`
- `examples/repo-lookup.md`
- `examples/closed-platform-fallback.md`

## 测试

- `tests/test-cases.md`

使用本技能时，不要把“搜索服务”误当成“答案来源”。搜索服务只是入口；真正重要的是**答案最终落在哪一类信息源上**，以及**是否能把 creator 内容沉淀为可复用结构化资产**。
