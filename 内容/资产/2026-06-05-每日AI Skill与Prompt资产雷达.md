# 每日 AI Skill / Prompt 资产雷达

**日期**：2026-06-05 星期五  
**定位**：科技 AI 自媒体 / 大学生 AI 实战家 / 05 后 AI 项目实验者  
**规则**：不收 Agent 工作流、AI Coding 教程、复杂 SaaS 工程

---

## 一、今日资产雷达总览

| # | 类型 | 资产名称 | 来源 | 评分/25 | 核心价值 |
|---|---|---|---|---|---|
| 01 | Skill | R.A.C.E. 高级 Prompt 工程框架 | [LogIQ Curve](https://logiqcurve.com/2025/06/11/) | 22 | 4步结构化Prompt方法论，适用于所有AI对话 |
| 02 | Skill | 病毒式钩子生成器 Skill | [AI Prompt Powerhouse](https://www.ai-prompt-powerhouse.com/2552414_the-best-ai-prompts-for-content-creation-used-by-top-marketers) | 23 | TikTok/X/公众号开头一句话决定流量，5种钩子公式 |
| 03 | Skill | Reddit 风反 AI 检测 Prompt | [人人都是产品经理](https://www.woshipm.com/ai/6230535.html) | 21 | 让AI输出在AI检测器下读起来像真人，适用于社区运营 |
| 04 | Skill | Prompt 工程五层设计模式 | [GitHub: system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) | 24 | 86个真实AI工具Prompt逆向分析出的设计模式 |
| 05 | 文本 Prompt | 10X 长文大纲生成 Prompt | [AI Prompt Powerhouse](https://www.ai-prompt-powerhouse.com/2552414_the-best-ai-prompts-for-content-creation-used-by-top-marketers) | 22 | 公众号长文/深度内容的结构化大纲引擎 |
| 06 | 文本 Prompt | TikTok/X "硬核真相" 爆款观点脚本 | [MPOST](https://mpost.io/top-prompts-that-are-going-viral-on-tiktok-and-x-in-2025/) | 22 | 2025年TikTok/X验证的爆款公式，适用于个人IP观点输出 |
| 07 | 图像 Prompt | 公众号头图极简插画风 Prompt | [yangmao.ai](https://yangmao.ai/zh/prompts/midjourney) | 23 | 一键生成专业公众号头图底图，2.35:1比例 |
| 08 | 图像 Prompt | 小红书/INS 生活方式平铺摄影 Prompt | [yangmao.ai](https://yangmao.ai/zh/prompts/midjourney) | 22 | 小红书爆款封面风格，4:5竖版 |
| 09 | GitHub 资产库 | awesome-chatgpt-prompts — 135K+星标 Prompt 宝库 | [GitHub: f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) | 24 | AI提示词圣经，160+角色化Prompt模板 |
| 10 | GitHub 资产库 | prompt-engineering-guide — 61.5K星标工程指南 | [GitHub: dair-ai/prompt-engineering-guide](https://github.com/dair-ai/prompt-engineering-guide) | 23 | 完整Prompt工程知识体系，含论文/课程/工具 |

**统计**：Skill 4条 | 文本 Prompt 2条 | 图像 Prompt 2条 | GitHub 资产库 2条 | AI 自建 0条

---

## 二、今日 10 条资产详情

### 资产 01：R.A.C.E. 高级 Prompt 工程框架（Skill）

**来源**：[LogIQ Curve - Advanced Prompting Techniques](https://logiqcurve.com/2025/06/11/)  
**类型**：Skill  
**版权**：公开教程，可自由使用

#### 原始内容

R.A.C.E. 框架：

```
Role     – 赋予 AI 一个角色身份
Action   – 定义要执行的具体任务
Context  – 提供背景信息和约束
Expectation – 说明期望的输出格式和标准
```

示例：

> "Act as a senior brand strategist. Write a 3-paragraph LinkedIn post promoting an AI-based recruitment tool. Target HR managers at mid-sized companies. Make it persuasive, with a clear CTA."

衍生框架 T.R.A.C.E.（Task → Role → Action → Context → Example），适合需要范例引导的复杂任务。

配套技术：
- **Few-Shot Prompting**：喂 2-3 个范例，让 AI 模仿格式和语气
- **Chain-of-Thought Prompting**：拆解复杂任务为逐步推理

#### 中文可执行版

```
## R.A.C.E. 框架（中文版）

角色：你是一位 [专业身份，如：资深公众号主编 / 小红书运营专家 / SaaS 产品经理]
任务：[具体要做什么，如：写一篇 1500 字长文 / 生成 5 个选题 / 分析竞品]
背景：[场景上下文，如：目标读者是 25-35 岁职场人 / 平台是公众号 / 竞品是 Notion]
期望：[输出要求，如：分 3 个小标题 / 每段不超过 200 字 / 结尾有行动号召]

---

Few-Shot 示例（先给 AI 看 2 个范例）：

范例 1：
[你喜欢的风格/格式的完整范例 A]

范例 2：
[你喜欢的风格/格式的完整范例 B]

现在，按照范例 A 和 B 的风格和结构，生成：[你的任务]
```

#### 黄文轩可用版

> 以后每次跟 AI 对话，不要直接丢一句「帮我写篇文章」。花 30 秒按 RACE 四步来：先告诉 AI 你是谁（角色），再说要干啥（任务），补充背景信息（上下文），最后说清楚期望的格式（期望）。配上一个你喜欢的范例（Few-Shot），效果提升 3 倍以上。这条 Skill 可以做成 Notion 模板，每次写内容之前填一遍。

#### 适用场景
- 公众号长文写作
- 小红书文案
- AI 工具拆解
- 商业分析报告
- 任何需要高质量 AI 输出的场景

#### 今日怎么用
今天写任何东西之前，花 30 秒填一下 RACE 四要素，对比一下有和没有的差别。尤其是做「AI 工具拆解」类内容，角色设定为「产品经理视角」会特别出效果。

#### 可沉淀成什么资产
- Notion Prompt 模板（RACE 四格填写卡）
- 按内容类型分类的 RACE 参数库（公众号/小红书/商业分析）
- 个人常用角色预设集

#### 是否适合 Prompt/Skill 商店
是 — 适合作为 Prompt 模板套装的核心方法论之一。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 所有 AI 对话的基础框架，即学即用 |
| 新鲜度 | 4/5 | 经典框架但 2025 年持续被验证有效 |
| 可复用性 | 5/5 | 适用所有场景 |
| 自媒体价值 | 4/5 | 能显著提升内容输出质量 |
| 变现潜力 | 4/5 | 可作为方法论课程/模板的核心内容 |
| **总分** | **22/25** | |

---

### 资产 02：病毒式钩子生成器 Skill（Skill）

**来源**：[AI Prompt Powerhouse - Best AI Prompts for Content Creation](https://www.ai-prompt-powerhouse.com/2552414_the-best-ai-prompts-for-content-creation-used-by-top-marketers)  
**类型**：Skill  
**版权**：公开 Prompt 模板，可自由使用

#### 原始内容

**Viral Hook Generator Prompt**：

> "Write 10 [platform]-friendly hooks for a post about [topic]. Include:
> - Curiosity gaps: '95% of people miss this…'
> - Controversial takes: 'Why [common belief] is dead wrong'
> - Urgency: 'Don't [action] until you read this'"

示例输出：

> "SEO experts hate this AI trick—but it got me 50K visitors in 30 days."

#### 中文可执行版

```
## 病毒式钩子生成器

你是公众号/小红书/TikTok 的爆款标题和开头专家。

为 [主题/话题] 生成 10 个钩子（标题或视频前 3 秒脚本），使用以下 5 种爆款钩子公式，每种至少 2 个：

1. **好奇心缺口**：暗示读者缺少关键信息
   格式：「95% 的人不知道……」/「关于 [X]，有一个秘密……」

2. **反常识/争议性观点**：挑战普遍认知
   格式：「为什么 [公认观点] 错得离谱」/「别再相信 [X] 了」

3. **紧迫感**：制造 FOMO
   格式：「在 [做某事前]，先看这篇」/「最后 24 小时……」

4. **身份标签+痛点**：精准对号入座
   格式：「如果你也 [痛点]，这篇文章就是写给你的」/「给所有 [身份] 的 [建议]」

5. **结果承诺**：明确告诉读者能得到什么
   格式：「我用 [方法] 在 [时间] 内做到了 [结果]」/「1 个 [技巧]，让 [指标] 翻倍」

要求：
- 每个钩子 ≤ 25 字（中文）
- 混用 5 种公式
- 选出 TOP 3，标注公式类型和选它的理由
```

#### 黄文轩可用版

> 每天发内容之前先跑这个 Prompt，生成 10 个钩子。钩子 = 标题 + 前 3 秒/第一句话。从 10 个里选 3 个最戳目标读者的做 A/B 测试。核心：不要只用一个公式，5 种轮着用。我写「AI 工具拆解」系列时常用「反常识」公式（如：「你可能用错了 ChatGPT——90% 的人不知道这 3 个隐藏功能」）。

#### 适用场景
- 公众号标题 & 开头
- 小红书封面文案
- TikTok/视频号前 3 秒脚本
- X/Twitter 主题帖第一句

#### 今日怎么用
拿你下一篇待发的文章主题，跑这个 Prompt，生成 10 个钩子，选 TOP 3 对比原始标题，看看能不能提升点击欲。

#### 可沉淀成什么资产
- 个人爆款钩子库（按内容类型分类）
- 钩子 A/B 测试记录表（数据驱动优化）
- 5 种钩子公式速查卡

#### 是否适合 Prompt/Skill 商店
是 — 可作为「自媒体 Prompt 工具箱」的核心组件。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 直接决定内容打开率 |
| 新鲜度 | 4/5 | 2025 年短视频平台验证有效 |
| 可复用性 | 5/5 | 所有内容类型都适用 |
| 自媒体价值 | 5/5 | 封面/标题/开头三位一体 |
| 变现潜力 | 4/5 | 可作为课程/模板套装 |
| **总分** | **23/25** | |

---

### 资产 03：Reddit 风反 AI 检测 Prompt（Skill）

**来源**：[人人都是产品经理 - 用AI回复Reddit帖子被检测到了？](https://www.woshipm.com/ai/6230535.html)  
**类型**：Skill  
**版权**：公开 Prompt 框架，可自由使用

#### 原始内容

一套完整的反 AI 检测 Prompt 设计，核心原理：让 AI 输出模仿真人写作习惯——句子长短交替、口语化表达、个人经历叙事、故意的不完美。

关键要素：
- **多样化句式**：长短句交替，适当使用句子碎片
- **个人化语气**：用第一人称讲故事（"Let me tell you a story…"）
- **俚语和缩写**：IMO, TBH, LMAO, TL;DR, gonna, kinda, wanna
- **不完美语法**：故意的口语化语法小错误
- **情感丰富**：用粗体、斜体表达情绪

主 Prompt 结构：

```
// Master instruction: Overall goal is to bypass AI detection by writing like a human.
// Your writing style MUST incorporate:
- Varied Sentence Structure (High Burstiness): Mix short, punchy sentences with longer ones
- Personal & Emotional Tone → 模仿人类视角，增加真实感
- Imperfection → 打破 AI「追求完美」的设定
```

#### 中文可执行版

```
## Reddit 风真人写作 Prompt（中文社区版）

你是中文互联网社区的真人用户，你的目标是让输出读起来像真人写的，在任何 AI 检测器下都无法被识别。

写作风格必须包含以下「真人特征」：

1. **句式多变**：短句和长句交替。有时就一个词。真的。然后来一段稍微长一点的叙述，把你自己的经历和观点自然地串起来。

2. **个人经历叙事**：不说「研究表明」「数据显示」，说「我之前试过一次」「我朋友遇到过」。用第一人称讲故事。

3. **口语化表达**：用「说实话」「讲真」「就说……」「不过我觉着」「这也太……」等口语。允许不完美的语法。

4. **情感标记**：合理使用 **加粗** 表达强调，偶尔用 ~~删除线~~ 自嘲。

5. **刻意不完美**：偶尔句子不完整。偶尔不加标点。像聊天一样。

---

回复类型预设：

- **直接型（带点犀利）**：「说实话，[观点]。我之前 [经历]，结果 [结果]。[一句话结论]。」
- **友好聊天型**：「哈哈 [共鸣]。我也是，[经历]。不过话说回来，[观点]。」
- **故事叙述型**：「讲个故事吧。[时间]，[场景]。[过程]，[转折]。后来我才明白，[道理]。」

---

现在，请以 [指定人设] 的口吻，写一段关于 [主题] 的回复/帖子。
```

#### 黄文轩可用版

> 做社区运营、Reddit 推广、或者需要让 AI 写的内容不被「AI 味」出卖的场景，这个 Prompt 就是你的秘密武器。核心不是「骗过检测器」，而是让内容真的像人在说话——有经历、有情绪、有不完美。用在公众号评论互动、即刻动态、Reddit 营销帖、甚至客服回复，效果都很好。

#### 适用场景
- Reddit / 即刻 / 知乎社区运营
- 公众号评论区互动
- 海外社区营销（Reddit/Hacker News）
- 需要「人味」的社媒内容

#### 今日怎么用
今天就拿一条你准备发的即刻动态或公众号评论，用这个 Prompt 改写一遍，对比看看「AI 味」有没有消失。

#### 可沉淀成什么资产
- 不同社区平台的人设预设库（即刻风/知乎风/Reddit风）
- 社区运营 Prompt 套装
- 「去 AI 味」自查清单

#### 是否适合 Prompt/Skill 商店
是 — 可作为社区运营 Prompt 包的重要组件。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 解决真实痛点 |
| 新鲜度 | 4/5 | 2025年社区运营热门话题 |
| 可复用性 | 4/5 | 多种社区平台适用 |
| 自媒体价值 | 4/5 | 提升社区互动真实性 |
| 变现潜力 | 4/5 | 海外营销服务可打包 |
| **总分** | **21/25** | |

---

### 资产 04：Prompt 工程五层设计模式（Skill）

**来源**：[GitHub: x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)（75K+ 星标）  
**类型**：Skill  
**版权**：GitHub 开源仓库

#### 原始内容

该仓库收集了 Cursor、Devin、v0、Claude Code 等 34 款主流 AI 工具的内部系统提示词与模型配置。通过分析 86 个提示词文件、32 个工具定义（超 3 万行代码），提炼出五大核心设计模式：

| 模式 | 覆盖率 | 说明 |
|---|---|---|
| 模式一：分层指令结构 | 79.2% | Markdown/XML 标签分层组织，而非单段冗长文本 |
| 模式二：工具调用规范化 | 85% | 规定调用时机、方式、失败备用方案 |
| 模式三：示例驱动学习 | 67.7% | 用具体场景示范期望行为 |
| 模式四：明确约束边界 | 79.2% | 明确列出行为边界和禁区 |
| 模式五：多阶段任务处理 | — | 复杂任务分解为原子操作 |

关键数据：
- 86.5% 采用 Markdown 结构化，57.3% 采用 XML 标签
- 95% 的 Agent 具备文件操作、代码搜索、终端命令三大核心能力
- 90% 的提示词包含具体身份设定与职责范围

#### 中文可执行版

```
## Prompt 工程五层设计模式速查卡

### 模式一：分层指令结构
结构：
# 角色定义
你是一个 [角色]，精通 [领域]

## 核心职责
1. [职责1]
2. [职责2]

## 执行规则
- [规则1]
- [规则2]

## 输出格式
[格式要求]

---

### 模式二：工具调用规范化
- 修改前必须先读取当前内容
- 运行命令前确认安全性与影响范围
- 复杂任务分解为多个原子操作
- 失败时提供备用方案

---

### 模式三：示例驱动学习
格式：
「以下是期望的输出范例：
[范例 A]
[范例 B]
现在按照范例风格处理：[实际任务]」

---

### 模式四：明确约束边界
格式：
「禁止：
- [禁止行为1]
- [禁止行为2]
必须：
- [必须行为1]」

---

### 模式五：多阶段任务处理
格式：
「阶段一：[目标] → 确认后进入阶段二：[目标] → ...」
```

#### 黄文轩可用版

> 这个仓库不是拿来抄 Prompt 的，是拿来学「怎么写好 Prompt 的」。五大模式里，我最推荐先掌握「分层指令结构」和「示例驱动学习」两个——分层让你的 Prompt 清晰可控，示例让 AI 准确理解你想要的格式。以后写任何 Skill 或复杂 Prompt，按这五个模式检查一遍，质量立刻提升。

#### 适用场景
- 设计自己的 Skill / Prompt 模板
- 提升 AI 输出的质量和一致性
- 学习顶级 AI 产品的 Prompt 设计思路

#### 今日怎么用
打开你的一个常用 Prompt，对照五大模式检查：有分层吗？有示例吗？有约束吗？然后优化一遍。

#### 可沉淀成什么资产
- 个人 Prompt 设计检查清单（五模式版）
- Skill 设计模板（按五模式结构）
- Prompt 工程质量标准

#### 是否适合 Prompt/Skill 商店
否 — 更偏向方法论和设计思想，适合作为学习材料。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 提升所有 Prompt 质量的元技能 |
| 新鲜度 | 5/5 | 来自真实 AI 产品逆向分析 |
| 可复用性 | 5/5 | 适用于任何 Prompt 设计 |
| 自媒体价值 | 4/5 | 可作为深度拆解文章素材 |
| 变现潜力 | 5/5 | 方法论课程的核心内容 |
| **总分** | **24/25** | |

---

### 资产 05：10X 长文大纲生成 Prompt（文本 Prompt）

**来源**：[AI Prompt Powerhouse - The Best AI Prompts for Content Creation](https://www.ai-prompt-powerhouse.com/2552414_the-best-ai-prompts-for-content-creation-used-by-top-marketers)  
**类型**：文本 Prompt  
**版权**：公开 Prompt，可自由使用

#### 原始内容

**The "10X Outline" Prompt**：

> "Create a detailed outline for a [type] post titled '[title]'. Include:
> - 3 surprising stats (with fake-proof sources for impact)
> - 2 counterintuitive takeaways
> - 1 actionable checklist"

Pro Tip:
> "Make each section impossible to scroll past"

#### 中文可执行版

```
## 10X 长文大纲生成 Prompt

你是一位资深自媒体主编，擅长为公众号/深度长文规划结构。

为这篇 [文章类型，如：AI工具拆解/行业分析/实操教程] 生成详细大纲，标题是：[文章标题]。

大纲必须包含：

### 1. 钩子段（开头 200 字）
- 1 个让人无法划走的好奇心钩子
- 1 个反常识观点或惊人数据

### 2. 3 个「让人震惊」的数据/事实
- 每个数据有来源（可标注待验证）
- 每个数据后有 1 句解读：「这意味着……」

### 3. 2 个反直觉洞察
- 与常识相反的观点
- 用「大多数人以为 X，但实际上是 Y」的格式
- 每个洞察配一个具体案例

### 4. 主体结构（3-4 个小标题）
- 每个小标题是一个独立卖点/观点
- 小标题自带钩子属性（用好奇心或争议性公式）
- 每部分：观点 + 案例 + 数据/截图 + 过渡句

### 5. 1 个可执行清单
- 5-7 条具体可操作步骤
- 每条 ≤ 30 字
- 格式：✅ [动作] — [预期结果]

### 6. 结尾 CTA
- 总结核心观点（1 句话）
- 行动号召（引导点赞/在看/评论/转发）

要求：
- 每个小标题必须让人「不可能划走」
- 整体结构有节奏感：钩子 → 数据冲击 → 反常识 → 干货 → 清单 → 行动
```

#### 黄文轩可用版

> 写深度长文最怕的就是结构平平，读者划两下就走了。这个 Prompt 把你的大纲从「是什么-为什么-怎么办」的流水账升级成有节奏感的阅读体验。核心技巧：「让每个小标题不可能被划走」——意思是每个小标题要么有好奇心缺口，要么有争议性，要么有利益承诺。今天写任何长文之前，先跑这个。

#### 适用场景
- 公众号深度长文（1500-3000 字）
- AI 工具拆解文章
- 行业分析/趋势报告
- 课程大纲设计

#### 今日怎么用
拿一个你计划写但还没动笔的选题，跑这个 Prompt 生成大纲，然后按大纲填空写一篇。

#### 可沉淀成什么资产
- 个人长文结构模板库
- 不同类型内容的大纲变体（拆解/分析/教程）
- 大纲 → 成品对照表（复盘优化）

#### 是否适合 Prompt/Skill 商店
是 — 可作为写作工具箱的核心 Prompt。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 直接提升长文质量 |
| 新鲜度 | 4/5 | 经典结构但持续有效 |
| 可复用性 | 5/5 | 所有长文类型适用 |
| 自媒体价值 | 5/5 | 直接用于公众号写作 |
| 变现潜力 | 3/5 | 辅助工具而非直接变现 |
| **总分** | **22/25** | |

---

### 资产 06：TikTok/X "硬核真相" 爆款观点脚本（文本 Prompt）

**来源**：[MPOST - Top Prompts Going Viral on TikTok and X in 2025](https://mpost.io/top-prompts-that-are-going-viral-on-tiktok-and-x-in-2025/)  
**类型**：文本 Prompt  
**版权**：公开 Prompt 模板，可自由使用

#### 原始内容

**"Give Me the Harsh Truth" 类别 Prompt**（2025 年 TikTok/X 验证的爆款公式）：

> "Write a 15-second script where a founder gives the raw truth about building a business no one talks about."
>
> "Create a post explaining what most creators still get wrong about 'viral content' in 2025."
>
> "What's one industry myth that needs to be publicly corrected? Script it like a punchline for TikTok."

该类别核心原理：分享尖锐、诚实的洞察，挑战普遍认知或揭露真实经验。在 TikTok 上搭配极简剪辑和强语气输出，在 X 上转化为主题帖或短 Thread。

#### 中文可执行版

```
## "硬核真相" 爆款观点脚本生成器

你是 [你的领域，如：AI 工具测评 / 自媒体运营 / 大学生副业] 领域的「说真话的人」。

为以下主题生成一个爆款观点脚本：

**格式一：TikTok/视频号 15 秒脚本**

开头（3 秒，钩子）：「[行业] 有一个谎言，没人敢戳穿——」
中间（9 秒，3 个尖锐论点）：
- 论点 1：[事实/数据]
- 论点 2：[个人真实经历]
- 论点 3：[反常识结论]
结尾（3 秒，punchline）：「所以，[一句话冲击结论]」

**格式二：X/即刻主题帖**

开头第一句：[反常识观点，≤ 20 字]
中间展开（2-3 句）：[为什么大家搞错了？真相是什么？]
结尾 punchline：[一句话让人转发的话]

**格式三：公众号观点文开头**

第一段：「[时间]，我做了 [一件事]，结果 [反常识结果]。这让我意识到，关于 [行业] 最大的谎言就是……」

---

要求：
- 每个版本都要有「刺痛感」——让人觉得「卧槽，好像是真的」
- 不攻击个人，只挑战观点
- 必须有个人经历或可验证的数据支撑
```

#### 黄文轩可用版

> 2025 年在 TikTok 和 X 上最火的内容公式不是教程、不是盘点，是「硬核真相」——就是那种敢说真话、戳破行业泡沫的内容。你不需要是大 V，只需要在你深耕的领域（AI、自媒体、大学生副业）里说一句别人不敢说的话。这个 Prompt 帮你把「真话」包装成三种平台格式。今天就可以试试：选一个你最想吐槽的行业现象，跑这个 Prompt。

#### 适用场景
- 个人 IP 观点输出
- TikTok/视频号观点类内容
- X/即刻/微博主题帖
- 公众号观点文开头

#### 今日怎么用
选一个你有强烈观点的领域话题，跑三种格式各生成一版，选最「刺痛」的发布。

#### 可沉淀成什么资产
- 个人观点库（按领域分类的尖锐观点）
- 三平台观点脚本模板
- 观点-数据-案例三联卡

#### 是否适合 Prompt/Skill 商店
是 — 可作为个人 IP 内容工具箱的核心组件。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 2025年验证的爆款公式 |
| 新鲜度 | 5/5 | 直接来自当前短视频趋势 |
| 可复用性 | 4/5 | 适合有观点输出的创作者 |
| 自媒体价值 | 5/5 | 直接提升个人IP影响力 |
| 变现潜力 | 3/5 | 间接影响力变现 |
| **总分** | **22/25** | |

---

### 资产 07：公众号头图极简插画风 Prompt（图像 Prompt）

**来源**：[yangmao.ai - Midjourney 最强提示词技巧](https://yangmao.ai/zh/prompts/midjourney)  
**类型**：图像 Prompt  
**版权**：公开 Prompt 模板，可自由使用；生成图版权遵循 Midjourney ToS

#### 原始内容

```
公众号封面生成：

modern flat illustration, [主题关键词], vibrant gradient background, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2
```

参数说明：
- `--ar 2.35:1`：公众号头条封面标准比例（900×383）
- `--v 7`：Midjourney V7 模型
- `--q 2`：高质量渲染
- `no text, no watermark`：避免 MJ 自动生成英文/水印

#### 中文可执行版

```
## 公众号头图极简插画风 Prompt

核心公式：
modern flat illustration, [主题关键词], vibrant gradient background, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2

---

场景变体（替换 [主题关键词] 部分）：

### AI 工具拆解类
modern flat illustration, robot analyzing glowing data dashboard on a laptop, blue to purple gradient, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2

### 自媒体运营类
modern flat illustration, content creator working at desk with floating social media icons, warm orange gradient, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2

### 副业/搞钱类
modern flat illustration, young person building money tree with digital tools, green to gold gradient, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2

### 学习/知识类
modern flat illustration, open glowing book with knowledge particles floating up, deep blue gradient, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2

---

生成后用 Canva/稿定设计加中文标题文字（推荐：思源黑体 Bold，文字占图面 40% 以上）
```

#### 黄文轩可用版

> 公众号头图是文章的第一印象。这套 Prompt 的核心价值：一键生成专业级底图，然后用 Canva 加文字 2 分钟搞定。关键参数：2.35:1（公众号标准比例）、V7 模型、q2 高质量。我的经验是每个选题跑 3-5 组，每组 4 张，从 20 张里挑 1 张最好的。文字一定要大，大到缩略图里也看得清。

#### 适用场景
- 公众号头条封面
- 视频号封面（改 --ar 16:9）
- 即刻/知识星球配图
- 课程宣传图

#### 今日怎么用
为下一篇待发文章，用对应场景变体跑 4 张底图，选最好的 1 张加文字后用。

#### 可沉淀成什么资产
- 按内容类型分类的封面图 Prompt 库
- 封面图 → 点击率对照表
- 个人封面图风格指南

#### 是否适合 Prompt/Skill 商店
是 — 可作为「自媒体视觉 Prompt 包」的核心组件。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 直接用，效果专业 |
| 新鲜度 | 4/5 | Midjourney V7 最新适配 |
| 可复用性 | 5/5 | 每篇文章都用 |
| 自媒体价值 | 5/5 | 直接提升公众号视觉品质 |
| 变现潜力 | 4/5 | 可作为模板套装出售 |
| **总分** | **23/25** | |

---

### 资产 08：小红书/INS 生活方式平铺摄影 Prompt（图像 Prompt）

**来源**：[yangmao.ai - Midjourney 最强提示词技巧](https://yangmao.ai/zh/prompts/midjourney)  
**类型**：图像 Prompt  
**版权**：公开 Prompt 模板，可自由使用；生成图版权遵循 Midjourney ToS

#### 原始内容

```
小红书配图：

aesthetic flat lay photography, [物品], soft pastel colors, marble background, instagram style, overhead shot --ar 4:5 --v 7
```

#### 中文可执行版

```
## 小红书/INS 生活方式平铺摄影 Prompt

核心公式：
aesthetic flat lay photography, [物品排列描述], soft [色调], [材质] background, instagram style, natural daylight, overhead shot --ar 4:5 --v 7 --style raw

---

场景变体：

### 学习/效率工具展示
aesthetic flat lay photography, MacBook with Notion dashboard on screen, mechanical keyboard, coffee cup, notebook with handwritten notes, soft warm beige tones, wooden desk background, instagram style, natural window light, overhead shot --ar 4:5 --v 7 --style raw

### AI 工具/数字生活
aesthetic flat lay photography, iPad showing AI app interface, wireless earbuds, glowing smartwatch, minimalist phone, soft cool blue and white tones, white marble background, instagram style, clean tech aesthetic, overhead shot --ar 4:5 --v 7 --style raw

### 知识资料包展示
aesthetic flat lay photography, printed booklet with "AI工具指南" cover, colorful sticky notes, highlighters, pencil, soft pastel pink and yellow tones, light wood desk background, instagram style, morning sunlight, overhead shot --ar 4:5 --v 7 --style raw

### 个人 IP/生活方式
aesthetic flat lay photography, journal with handwritten goals, camera, plant in terracotta pot, glasses, soft cream and sage green tones, linen texture background, instagram style, soft daylight, overhead shot --ar 4:5 --v 7 --style raw
```

#### 黄文轩可用版

> 小红书封面的爆款密码之一就是「平铺摄影风」（Flat Lay）——把所有相关物品从正上方拍下来，颜色柔和、构图干净。这套 Prompt 帮你省掉摆拍和布光的时间。核心：4:5 比例（小红书标准）、V7 模型、style raw（强化真实摄影感）。做 AI 工具测评内容的，用场景二；做资料包/模板的用场景三；做个人 IP 的用场景四。

#### 适用场景
- 小红书封面
- 即刻动态配图
- 朋友圈/Instagram 内容
- 产品/资料包展示

#### 今日怎么用
选一个与你今天内容匹配的场景变体，跑 4 张，挑 1 张做小红书封面或即刻配图。

#### 可沉淀成什么资产
- 按内容类型分类的小红书封面 Prompt 库
- 不同色调/风格预设集
- 封面图数据追踪表

#### 是否适合 Prompt/Skill 商店
是 — 可作为「自媒体视觉 Prompt 包」的必备项。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 直接生成可用封面 |
| 新鲜度 | 4/5 | 小红书爆款风格 |
| 可复用性 | 5/5 | 每篇都能用 |
| 自媒体价值 | 5/5 | 提升视觉品质和点击率 |
| 变现潜力 | 3/5 | 辅助素材 |
| **总分** | **22/25** | |

---

### 资产 09：awesome-chatgpt-prompts — 135K+ 星标 Prompt 宝库（GitHub）

**仓库**：[https://github.com/f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)  
**Stars**：135,000+  
**Forks**：17,900+  
**作者**：Fatih Kadir Akın  
**类型**：GitHub 资产库  
**许可证**：CC0-1.0（公共领域）

#### 核心内容

AI 提示词领域的「圣经」级仓库。160+ 个经过社区验证的角色化 Prompt 模板，覆盖写作、编程、设计、商业、教育等 20+ 场景。支持 ChatGPT / Claude / Gemini / Llama / Mistral 等主流模型。

特色：
- 配套在线网站 [prompts.chat](https://prompts.chat/) 支持一键复制
- CSV 格式易于批量导入
- 社区驱动，持续更新
- 已衍生出中文特调版、职场专用版等多个分支

代表性 Prompt 类别：
- Act as a Linux Terminal
- Act as an English Translator and Improver
- Act as a Tech Writer
- Act as a Startup Idea Generator
- Act as a Social Media Manager

#### 黄文轩可用版

> 这是你必备的 Prompt 参考库。不要只是收藏——每天花 10 分钟看 3 个 Prompt，理解背后的「角色设定+任务定义」结构，然后想想怎么用在自己的内容创作里。特别推荐「Act as a Tech Writer」「Act as a Social Media Manager」「Act as a Fancy Title Generator」三个，直接对应公众号和小红书写作者的需求。

#### 适用场景
- Prompt 工程学习
- 内容创作模板参考
- 跨模型 Prompt 适配
- 角色化 Prompt 设计灵感

#### 今日怎么用
打开 [prompts.chat](https://prompts.chat/)，浏览「Writing」分类，选 3 个 Prompt 试跑一遍，记录效果。

#### 可沉淀成什么资产
- 个人精选 Prompt 子集（10-20 条最常用的）
- 中文改编版 Prompt 库
- Prompt 分类索引笔记

#### 是否适合 Prompt/Skill 商店
参考学习为主 — 仓库内容为 CC0 许可，可自由使用和改编。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | Prompt工程的入门必看 |
| 新鲜度 | 5/5 | 持续更新中 |
| 可复用性 | 5/5 | 160+模板直接可用 |
| 自媒体价值 | 4/5 | 写作类Prompt直接受益 |
| 变现潜力 | 5/5 | 改编后可形成付费内容 |
| **总分** | **24/25** | |

---

### 资产 10：prompt-engineering-guide — 61.5K 星标工程指南（GitHub）

**仓库**：[https://github.com/dair-ai/prompt-engineering-guide](https://github.com/dair-ai/prompt-engineering-guide)  
**Stars**：61,500+  
**Forks**：6,300+  
**组织**：DAIR.AI  
**类型**：GitHub 资产库  
**许可证**：MIT  
**配套网站**：[https://www.promptingguide.ai/](https://www.promptingguide.ai/)

#### 核心内容

最完整的 Prompt 工程知识体系，由学术界和工业界专家共同维护。内容涵盖：

- **Prompt 技术大全**：Zero-Shot / Few-Shot / Chain-of-Thought / Self-Consistency / ReAct / Tree of Thoughts / Automatic Prompt Engineering 等
- **论文索引**：最新的 Prompt 工程相关学术论文
- **工具集**：Prompt 开发、测试、评估工具
- **课程**：与 DeepLearning.AI 合作的 Prompt 工程课程
- **多语言支持**：含中文翻译版本

#### 黄文轩可用版

> 如果说 awesome-chatgpt-prompts 是「菜谱」，那这个仓库就是「烹饪理论」。不需要从头到尾看完，但以下几个章节必须读：Few-Shot Prompting（范例学习）、Chain-of-Thought（思维链）、ReAct（推理+行动）。这三个技术掌握后，你设计 Prompt 的底层能力会完全不同。配套网站 promptingguide.ai 体验更好。

#### 适用场景
- Prompt 工程系统学习
- 复杂任务 Prompt 设计
- Skill 开发的方法论基础
- AI 内容创作进阶

#### 今日怎么用
打开 [promptingguide.ai](https://www.promptingguide.ai/)，阅读「Few-Shot Prompting」章节（10 分钟），然后用学到的技巧优化一条你现有的 Prompt。

#### 可沉淀成什么资产
- 个人 Prompt 工程学习笔记
- 按技术分类的 Prompt 案例库
- 进阶内容创作方法论

#### 是否适合 Prompt/Skill 商店
否 — 更适合作为学习资源和方法论来源。

#### 评分

| 维度 | 分数 | 说明 |
|---|---|---|
| 实用性 | 5/5 | 系统化的方法论 |
| 新鲜度 | 4/5 | 持续更新论文和工具 |
| 可复用性 | 5/5 | 方法论适用于所有场景 |
| 自媒体价值 | 4/5 | 可输出学习笔记/教程 |
| 变现潜力 | 5/5 | 方法论课程化潜力大 |
| **总分** | **23/25** | |

---

## 三、今日最值得实操资产

**资产 02：病毒式钩子生成器 Skill**

理由：
1. **即时可操作**：今天写完一篇文章，跑这个 Prompt 生成 10 个钩子
2. **高杠杆**：标题/钩子直接决定点击率，1 个动作影响 100% 的流量入口
3. **可量化**：可以 A/B 测试不同钩子的效果，数据驱动优化
4. **跨平台**：公众号、小红书、TikTok、视频号、即刻全部适用
5. **可沉淀**：使用 30 天后形成个人爆款钩子库，变成可复用资产

**今天怎么做**：
1. 拿一篇待发文章
2. 跑「病毒式钩子生成器 Prompt」
3. 从 10 个钩子中选 TOP 3
4. 发布时选最戳的一个作为标题
5. 记录点击数据，一周后复盘

---

## 四、今日图像 Prompt 专区

### 公众号头图 Prompt

```
modern flat illustration, [主题], vibrant gradient background, clean minimal style, no text, no watermark --ar 2.35:1 --v 7 --q 2
```

- 今日推荐主题替换：AI writing tools / content creator workspace / digital entrepreneur
- 加文字：Canva → 思源黑体 Bold → 字号 ≥ 60pt → 居中靠上

### 小红书封面 Prompt

```
aesthetic flat lay photography, [物品], soft pastel colors, marble background, instagram style, overhead shot --ar 4:5 --v 7 --style raw
```

- 今日推荐场景：MacBook + Notion + 咖啡 + 笔记本（学习/效率类内容）
- 注意：生成后实际物品要和图中一致，增加真实感

---

## 五、今日 GitHub 资产库专区

| 仓库 | Stars | 一句话 | 链接 |
|---|---|---|---|
| awesome-chatgpt-prompts | 135K+ | Prompt 圣经，160+ 模板 | [GitHub](https://github.com/f/awesome-chatgpt-prompts) |
| prompt-engineering-guide | 61.5K+ | 最完整的 Prompt 工程知识体系 | [GitHub](https://github.com/dair-ai/prompt-engineering-guide) |

**今日行动**：
1. Star 两个仓库
2. 浏览 awesome-chatgpt-prompts 的 Writing 分类
3. 阅读 prompt-engineering-guide 的 Few-Shot Prompting 章节

---

## 六、今日不要收录清单

| # | 名称 | 拒绝理由 |
|---|---|---|
| 1 | Agent Skills 生态盘点（掘金文章） | 涉及 Agent/AI Coding，不收录 |
| 2 | "10000+ Prompt 合集" 噱头 Pack | 噱头 Pack，无实际筛选和验证 |
| 3 | Midjourney 浮世绘动漫 Prompt | 纯娱乐型 Prompt，无自媒体实操场景 |
| 4 | DAN/Jailbreak 类 Prompt | 灰产擦边，绕过 AI 安全限制 |
| 5 | "SEO experts hate this AI trick" 单句 Prompt | 单句老套 Prompt，无结构化价值 |

---

## 七、明日搜索关键词建议

1. `AI content repurposing prompt 2025` — 内容一鱼多吃（一篇文章转多平台）
2. `personal brand storytelling prompt framework` — 个人品牌故事化表达
3. `Midjourney hero image SaaS prompt --v 7` — SaaS/Landing Page 主视觉图
4. `Claude system prompt design best practices June 2025` — Claude 系统级 Prompt 设计
5. `AI newsletter automation prompt stack` — AI 周刊自动化 Prompt 组合
6. `github.com prompt template library markdown 2025` — Markdown Prompt 模板库
7. `Civitai trending realistic portrait prompt` — Civitai 真人风格热门 Prompt
8. `Xiaohongshu AI content workflow prompt` — 小红书 AI 内容工作流
9. `YouTube script AI prompt viral 2025` — YouTube 视频脚本 Prompt
10. `product teardown prompt framework AI tools` — AI 产品拆解 Prompt 框架

---

## 八、生成元信息

- 生成时间：2026-06-05
- AI 自建资产：0 条
- 信源数量：8 个（LogIQ Curve / AI Prompt Powerhouse / MPOST / 人人都是产品经理 / yangmao.ai / GitHub × 3）
- 昨日去重：已核对 2026-06-04 资产列表，无重复
- CSV 追加：见下方