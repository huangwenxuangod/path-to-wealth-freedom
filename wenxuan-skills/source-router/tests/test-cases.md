# test-cases

用于验证 `source-router` 是否真的在“先判断问题，再决定去哪搜”，以及是否能正确使用搜索聚合层。

---

## Case 1
### 问题
SEO 是啥？

### 预期路由
- 本地知识优先
- 官方/权威 Web 第二
- GitHub 不是第一优先

### 验证点
- 是否会先想到仓库中的 `概念深度学习-示范-SEO.md`
- 是否能解释为什么不 GitHub first

---

## Case 2
### 问题
有没有现成 GitHub 项目能做社媒搜索路由？

### 预期路由
- GitHub first
- README / issues / discussions / activity 必须进入证据层
- Reddit / X / YouTube 作为真实反馈补充

### 验证点
- 是否不只返回 repo 名称
- 是否能说出“为什么值得看/不值得看”

---

## Case 3
### 问题
Reddit 上大家怎么评价 Tavily / Firecrawl / Crawl4AI？

### 预期路由
- Reddit first
- GitHub / 官方文档第二
- 输出必须区分“社区评价”和“官方口径”

### 验证点
- 是否能提炼真实优缺点
- 是否避免把 Reddit 情绪当成唯一真相

---

## Case 4
### 问题
B站有没有人详细讲 GitHub 搜索 agent 的搭建？

### 预期路由
- video-search first
- GitHub / 官方文档作为补充

### 验证点
- 是否优先找视频 walkthrough
- 是否能指出哪些视频值得看、为什么

---

## Case 5
### 问题
小红书上 AI 选题博主都在讲什么？

### 预期路由
- closed-platform-search first
- 若拿不到足够一手内容，要明确 fallback

### 验证点
- 是否清楚区分公开信号与推断
- 是否诚实说明平台限制

---

## Case 6
### 问题
这个搜索能力要怎么做成技能包，而不是单纯 Tavily 搜索？

### 预期路由
- 本地知识 / 项目文档 / GitHub 现成项目 / workflow 设计文档混合路由

### 验证点
- 是否能区分“路由层”和“检索后端层”
- 是否强调技能包 + 聚合脚本结构

---

## Case 7
### 问题
GitHub 上现在有哪些成熟的 browser-use / MCP / search infra 项目？

### 预期路由
- GitHub first
- trend_signal second
- Reddit / X / 视频可补热度和使用反馈

### 验证点
- 是否能综合 repo 能力 + 活跃度 + 社区反馈

---

## Case 8
### 问题
OpenAI 最新 release 到底更新了什么？

### 预期路由
- 官方公告 / 官方文档 first
- X / Reddit / YouTube second

### 验证点
- 是否区分官方事实与社区解读

---

## Case 9
### 问题
抖音上做 AI 副业内容的人常用什么标题句式？

### 预期路由
- closed-platform-search first
- 公开索引 / 可见主页 / 视频标题 / 站外复盘

### 验证点
- 是否优先找“真实标题痕迹”而不是抽象概念词

---

## Case 10
### 问题
我仓库里之前有没有写过“精准搜索”相关的东西？

### 预期路由
- local_knowledge_match first
- 本地 Markdown / mem-search / knowledge-agent

### 验证点
- 是否避免直接联网
- 是否优先复用已有知识资产

---

## Case 11
### 问题
搜索服务挂了之后，会不会自动切到下一个？

### 预期路由
- 先走 `scripts/search_aggregator.py`
- 按 provider 顺序尝试
- 缺 key / 请求失败 / 空结果 都应回退

### 验证点
- JSON 里是否记录 attempted_providers
- 是否记录 failed_providers
