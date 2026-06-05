# 优质信源筛选与补充分析

更新日期：2026-06-04

## 这不是全部信源，但已经是第一版高质量信源池

之前的 44 个信源覆盖了 AI 快讯、产品发现、技术社区、产品增长、商业战略和音视频访谈，但还不够完整。缺口主要在 6 个方向：

1. AI 实验室官方源不足：OpenAI、Anthropic 有了，但缺 Google DeepMind、Meta AI、Mistral、Cohere。
2. 模型评测源不足：只看发布新闻不够，需要用榜单和 benchmark 校验模型/Agent 实力。
3. 论文研究链路不足：Hugging Face Daily Papers 适合每日扫，但深度研究还需要 arXiv、Semantic Scholar、alphaXiv、Connected Papers。
4. AI 工程实战源不足：需要补 LLM eval、RAG、后训练、结构化输出、Agent 可观测性。
5. 产品设计/行为学源不足：你提到“触发”和“执行”，这需要 NN/g、Baymard、Mobbin、Pageflows 等 UX 证据源。
6. SEO/GEO 源不足：你的内容增长方向必须补 AI 搜索、GEO、零点击搜索、AI citation。

所以本轮补充后，Excel 中的信源从 44 个扩展到 85 个。

## 入选标准

每个新信源按 7 个维度筛：

| 维度 | 标准 |
|---|---|
| 源头性 | 优先官方、原始论文、创始人/研究者、真实社区和一手数据库 |
| 稳定更新 | 至少月更，P0/P1 最好周更或发布即更新 |
| 信噪比 | 少营销，多数据、案例、代码、评论或方法论 |
| 可转化性 | 能转成选题、产品拆解、竞品分析、技术路线或写作素材 |
| 可采集性 | 支持 RSS/API/公开网页/稳定 URL，或至少适合手动保存 |
| 定位匹配 | 必须服务 AI 产品、Agent、内容增长、竞品分析、SEO/GEO、技术趋势之一 |
| 交叉验证价值 | 能和官方发布、社区反馈、GitHub、榜单、论文互相验证 |

淘汰原则：

- 纯榜单软文不入选
- 长期不更新不入选
- 没有稳定入口不入选
- 和你的主线弱相关不入选
- 只有情绪观点、没有证据链的不作为核心源

## 新增重点信源逻辑

### 1. 官方实验室源

新增：

- Google DeepMind Blog
- Meta AI Blog
- Mistral AI News
- Cohere Blog

原因：AI 产品判断必须先看源头发布。二手媒体适合发现线索，但不能替代官方公告、研究博客和文档。

### 2. 模型/Agent 评测源

新增：

- LMArena / Chatbot Arena
- Artificial Analysis
- SWE-bench
- Scale AI Leaderboards

原因：AI 产品经理不能只看“谁发布了新模型”，还要看模型能力、价格、速度、延迟、coding agent 表现。榜单不是最终答案，但可以作为产品选型和竞品分析的证据。

### 3. 论文研究源

新增：

- arXiv cs.AI
- arXiv cs.CL
- Semantic Scholar
- alphaXiv
- Connected Papers

原因：Hugging Face Daily Papers 适合每日雷达，但深度研究需要论文源头、引用网络和阅读增强工具。

### 4. AI 工程实践源

新增：

- The Batch
- Interconnects
- The Gradient
- Hamel Husain Blog
- Jason Liu Blog
- Arize AI Blog / The Evaluator

原因：你要从“会体验 AI 工具”升级到“理解 AI 产品怎么落地”，需要补 eval、RAG、结构化输出、可观测性、后训练、Agent 失败模式这些内容。

### 5. 产品 Sense / UX / 行为学源

新增：

- SVPG
- Product Talk
- Mind the Product
- First Round Review
- Nielsen Norman Group
- Baymard Institute
- Mobbin
- Pageflows
- UX Archive

原因：你提到的新标签页触发、本质上是行为设计。只有看 AI 产品新闻不够，还要看用户行为、交互流程、产品发现、可用性和增长设计。

### 6. 创业机会和 AI-first 运营源

新增：

- Every
- Not Boring
- YC Requests for Startups
- YC Company Directory - AI
- Greg Isenberg

原因：这些源适合发现“AI 产品机会”和“内容/工具/服务商业化方式”，尤其适合你现在想做 AI 内容媒体和个人工具系统。

### 7. SEO/GEO 内容增长源

新增：

- Search Engine Land
- Ahrefs Blog
- Semrush Blog
- SparkToro Blog
- Profound Blog

原因：你的内容增长方向不能只看传统 SEO。AI 搜索、AI citation、品牌在模型答案中的可见性，会越来越影响内容媒体和个人 IP。

## 使用建议

不要一次性全订阅 85 个源。

插件中应该这样分层：

- P0：每天显示，最多 10-15 个
- P1：每周深读，最多 20-30 个
- P2：按主题检索，不主动推送

真正的工作流应该是：

```text
官方发布 -> 社区反馈 -> GitHub/论文/榜单验证 -> 产品拆解 -> 中文选题 -> Obsidian/博客沉淀
```

这套表的价值不在“多”，而在于它可以作为 Source Radar 插件的数据底座。

