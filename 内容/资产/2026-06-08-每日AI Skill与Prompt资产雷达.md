---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 5792e2a262ee398579693c828a9b2e4b_c41b3d1462e311f19f62525400d9a7a1
    ReservedCode1: 7zXwRU0g7Ef4so5xnMdqMU91+r0jC7XBobivZ0/HP2TT3wHXYr4ZjoArfTpFvi5CZ3gjGwyeEkDBXo4H3uVVdve6/ZyJHvQIjc8MbL2DihbRdMqZ+jhANKJvKRB1mOiQ1V90sk9fBhc/qp/J9OQHMwj2apf+ROSTxfmjbRdDgHyRJtK7Utc/KgMuMnA=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 5792e2a262ee398579693c828a9b2e4b_c41b3d1462e311f19f62525400d9a7a1
    ReservedCode2: 7zXwRU0g7Ef4so5xnMdqMU91+r0jC7XBobivZ0/HP2TT3wHXYr4ZjoArfTpFvi5CZ3gjGwyeEkDBXo4H3uVVdve6/ZyJHvQIjc8MbL2DihbRdMqZ+jhANKJvKRB1mOiQ1V90sk9fBhc/qp/J9OQHMwj2apf+ROSTxfmjbRdDgHyRJtK7Utc/KgMuMnA=
---

# 每日 AI Skill / Prompt 资产雷达

**日期**：2026-06-08 星期一  
**定位**：科技 AI 自媒体 / 大学生 AI 实战家 / 05 后 AI 项目实验者  
**规则**：不收 Agent 工作流、AI Coding 教程、复杂 SaaS 工程

---

## 一、今日资产雷达总览

| # | 类型 | 资产名称 | 来源 | 评分/25 | 核心价值 |
|---|---|---|---|---|---|
| 01 | Skill | MPT 模块化 Prompt 框架（Modules-Pathways-Triggers） | [GitHub: semihpolat/Awesome-Prompts](https://github.com/semihpolat/Awesome-Prompts) / r/PromptEngineering | 23 | 将Prompt从静态指令升级为自适应系统，含审计/综合/精炼三模块 |
| 02 | Skill | Expert Triangulation 专家三角验证法 | [GitHub: semihpolat/Awesome-Prompts](https://github.com/semihpolat/Awesome-Prompts) / r/ChatGPTPromptGenius | 24 | 三位专家协作+互相审核，输出质量飞跃；含销售侦察版+文案版 |
| 03 | Skill | 5步数据分析到商业报告 Skill | [SegmentFault 工程级实战](https://segmentfault.com/a/1190000047809836) | 22 | 从数据摘要→多维归因→可执行建议→报告合成→交叉验证，完整闭环 |
| 04 | Skill | 公众号选题 RPG 角色拆解 Skill（AI 自建） | AI 自建，基于今日趋势与最佳实践生成 | 21 | 用3角色扮演拆解一篇爆文，生成选题+框架+切入角度 |
| 05 | 文本 Prompt | 人性化写作 15 套 Prompt 套装 | [The Humanize AI](https://thehumanizeai.pro/articles/chatgpt-prompts-human-like-writing) | 23 | 三梯度15套Prompt：语气人格层→结构打破层→上下文注入层 |
| 06 | 文本 Prompt | YouTube 标题 7 框架 Prompt | [Miraflow AI](https://www.miraflow.ai/blog/ai-prompts-for-youtube-titles) | 21 | 7种已验证高CTR标题框架+Thumbnail配合策略 |
| 07 | 图像 Prompt | Lo-Fi Realism 自媒体人像封面 Prompt | [GPTprompts.ai 2026 趋势](https://www.gptprompts.ai/trending-ai-photo-prompts-2026) | 23 | 2026年商业AI图像首选风格：真实颗粒感+自然瑕疵+胶片美学 |
| 08 | 图像 Prompt | Notes App Chic 图文创意封面 Prompt | [GPTprompts.ai 2026 趋势](https://www.gptprompts.ai/trending-ai-photo-prompts-2026) | 22 | 打字机/备忘录截图风格，LinkedIn和公众号引文卡片首选 |
| 09 | GitHub 资产库 | semihpolat/Awesome-Prompts — 高阶Prompt框架精选库 | [GitHub](https://github.com/semihpolat/Awesome-Prompts) | 24 | 手工精选高级Prompt框架+生产级泄漏模式+视觉合成技术 |
| 10 | GitHub 资产库 | legeling/PromptHub — 本地Prompt+Skill管理分发中心 | [GitHub](https://github.com/legeling/PromptHub) | 23 | 一站式Prompt版本管理+Skill一键分发15+AI编程工具 |

**统计**：Skill 4条 | 文本 Prompt 2条 | 图像 Prompt 2条 | GitHub 资产库 2条 | AI 自建 1条

---

## 二、今日 10 条资产详情

### 资产 01：MPT 模块化 Prompt 框架（Skill）

**来源**：[GitHub: semihpolat/Awesome-Prompts](https://github.com/semihpolat/Awesome-Prompts)，发现自 r/PromptEngineering（2026年1月）  
**类型**：Skill  
**版权**：公开Prompt框架，可自由使用和改编

#### 原始内容

MPT 框架 = Modules（模块）+ Pathways（路径）+ Triggers（触发器）。将Prompt从静态指令升级为上下文自适应的**活系统**。

```
[SYSTEM MODULES]
- Auditor:     检查逻辑谬误
- Synthesizer: 融合矛盾观点
- Refiner:     精炼输出至6年级可读水平

[PATHWAY: COMPLEX_ANALYSIS]
如果输入 > 500词，触发 Auditor → Synthesizer → Refiner。
否则，触发 Synthesizer → Refiner。

[TRIGGER]
如果用户提到"风险"或"不确定性"，优先激活 Auditor 模块。
```

核心思想：**Prompt不再是单向指令，而是一个带条件判断和路径分发的轻量程序。**

#### 中文可执行版

```
【系统模块定义】
模块A - 逻辑审计官：检查论证中的逻辑漏洞、数据矛盾、因果倒置
模块B - 创意合成师：当存在多个对立观点时，找出共性并生成第三种视角
模块C - 表达精炼师：将最终输出压缩到中学阅读水平，去术语、去废话

【处理路径】
路径1（深度分析）：输入超过300字 → A→B→C 全链路处理
路径2（快速响应）：输入少于300字 → B→C 处理
路径3（高风险判断）：用户提到"风险/亏损/决策/安全" → A模块优先且独立输出一份风险评估附录

【触发器列表】
→ 触发词：[风险, 亏损, 决策, 竞品, 对标] → 激活A模块
→ 触发词：[创新, 突破, 脑暴, 差异化] → 激活B模块
→ 触发词：[总结, 一句话, 简化] → 激活C模块
```

#### 黄文轩可用版

> MPT就是把你的Prompt变成有if-else逻辑的小程序。核心三件套：定义几个专家模块（审计/合成/精炼），设置处理路径（复杂任务走全套，简单任务走精简版），加触发器（用户一提"风险"就自动切审计模式）。适合你那种需要多角度输出的长内容——公众号拆解文、商业分析、竞品对比。30分钟能搭一套自己的MPT。

#### 适用场景
- 复杂商业分析/竞品拆解
- 需要多方论证的深度长文
- AI工具横向评测
- 任何"既要深度又要可读"的内容

#### 今日怎么用
拿一篇你准备写的AI工具拆解文，用MPT框架改造Prompt：设定Auditor（检查数据准确性）+ Synthesizer（融合多工具对比视角）+ Refiner（精炼到读者能秒懂）。对比改造前后的输出质量。

#### 可沉淀成什么资产
- 个人MPT配置模板（按内容类型：拆解/评测/分析）
- 常用触发器词库
- Notion MPT搭建指南（给粉丝的教学内容）

#### 是否适合 Prompt/Skill 商店
是 — MPT框架可作为高阶Prompt工程教学内容，搭配3个现成配置案例打包售卖。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 直接提升AI输出质量，立竿见影 |
| 新鲜度 | 4 | 2026年1月Reddit首发，国内几乎无人讨论 |
| 可复用性 | 5 | 模板化程度高，一套可复用所有内容类型 |
| 自媒体价值 | 4 | 可写成教程长文，但偏技术向 |
| 变现潜力 | 5 | 可打包成MPT配置套装+教学视频 |
| **总分** | **23/25** | |

---

### 资产 02：Expert Triangulation 专家三角验证法（Skill）

**来源**：[GitHub: semihpolat/Awesome-Prompts](https://github.com/semihpolat/Awesome-Prompts)，viral from r/ChatGPTPromptGenius  
**类型**：Skill  
**版权**：公开Prompt框架，可自由使用和改编

#### 原始内容

核心机制：**强制AI同时模拟三位不同领域专家，各自独立分析后再互相审核，最终输出通过三方验证的结论。** 这不是简单的"从三个角度看问题"——关键是三位专家必须**彼此审阅和质询**对方的工作。

**销售侦察版（Prospect Intelligence Analyst）**：

```
你是三位专家协作：
1. B2B销售情报分析师（10年经验）
2. LinkedIn行为分析师
3. 商业记者

任务：产出回复率50%+的客户侦察报告。
流程：
- 分析目标最近的新闻/LinkedIn帖子，找出具体痛点
- 找出一个真实的、非套话的赞美（有证据支撑）
- 分析决策者的沟通风格（数据驱动 vs 故事驱动）
交付物：4条简短、可执行的触达要点。
质量控制：评估具体性和可操作性。若低于8/10分，重新修订。
```

**文案版（Direct Response Ghostwriter）**：

```
你是三位专家：
1. 直效文案写手（累计创收$10M+）
2. 行为心理学家
3. 邮件送达率专家

目标：60%打开率，15%回复率。
结构：
- 3个主题行（≤40字符）
- 开头：用具体业务细节打断注意力惯性
- 正文：放大痛点，暗示方案（制造好奇心缺口）
- CTA：软性请求许可分享更多（不要求开会）
风格：像给朋友发短信。阅读水平6-8年级。
```

#### 中文可执行版

**通用三角验证Prompt模板**：

```
你将同时扮演三位专家，独立分析后相互审阅，最后给出统一结论：

【三位专家身份】
专家A - [领域1，如：公众号内容策略师]
专家B - [领域2，如：读者心理学研究员]
专家C - [领域3，如：变现转化专家]

【任务】：[具体任务描述]

【工作流程】
第1轮：三位专家各自独立分析，输出核心发现（每人≤150字）
第2轮：专家A审阅B和C的输出，标注3个盲点或矛盾
       专家B审阅A和C的输出，标注3个盲点或矛盾
       专家C审阅A和B的输出，标注3个盲点或矛盾
第3轮：基于互审反馈，三位专家协作输出统一结论+行动建议

【输出格式】
1. 三方共识（核心结论）
2. 保留的分歧点（如存在）
3. 可执行行动清单（3-5条）
4. 风险提示与边界条件
```

**自媒体变现版（可直接替换身份）**：

专家A：公众号内容策略师（擅长选题和标题）
专家B：读者心理学研究员（擅长痛点挖掘和行为分析）
专家C：知识付费产品经理（擅长内容产品化和定价）

#### 黄文轩可用版

> 三角验证法的核心不是"问三个角度"——那太弱了。真正的操作是：让AI同时扮演三个专家，各自先干活，然后互相挑刺，最后再合议出结论。这比你分别问三次然后自己拼凑强10倍。你的AI工具拆解文最适合用这个：专家A拆产品功能，专家B看商业模式，专家C挖增长策略，三人互审后就是一篇有深度的拆解。Prompt模板我已经写好了，换身份直接用。

#### 适用场景
- AI工具深度拆解（产品/商业/增长三角）
- 公众号选题决策（内容/读者/变现三角）
- 竞品分析（功能/用户体验/市场三角）
- 个人IP方向判断（擅长/需求/差异化三角）

#### 今日怎么用
拿一个你最近想拆解的AI产品，用三角验证法跑一遍：产品经理视角+商业模式视角+自媒体选题视角。对比单次提问和三角验证的输出深度差异。

#### 可沉淀成什么资产
- 按内容类型分类的三角身份预设库（拆解/分析/选题/IP定位）
- "三角验证法实操指南"公众号长文
- Notion三角验证工作流模板

#### 是否适合 Prompt/Skill 商店
是 — 这是目前Prompt工程中最被低估的高阶技巧，可做成"三角验证Skill套装"。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 输出质量提升显著，尤其是深度分析类任务 |
| 新鲜度 | 5 | 2026年Reddit viral，中文互联网几乎零覆盖 |
| 可复用性 | 5 | 三位身份可任意替换，适配所有场景 |
| 自媒体价值 | 5 | 完美适配AI拆解/分析/评测类内容 |
| 变现潜力 | 4 | 偏方法论，需搭配具体案例才能变现 |
| **总分** | **24/25** | |

---

### 资产 03：5步数据分析到商业报告 Skill（Skill）

**来源**：[SegmentFault 工程级实战](https://segmentfault.com/a/1190000047809836)（2026-06-02）  
**类型**：Skill  
**版权**：公开教程，可自由使用

#### 原始内容

这套5步Prompt流程从原始数据直达可交付商业报告，每步输出都是下一步的输入，形成完整闭环。

```
Step 1：异常定位聚焦
"扮演电商分析专家。找出数据中偏离正常范围最大的3个异常点，
按影响程度排序。仅基于提供的数据，不要编造额外信息。"

Step 2：多维归因推理
"针对'华北区家电品类销售额下降22%、退货率上升4.5%'，
从市场竞争、季节性因素、用户行为变化三个维度分别推理可能原因。
每个维度2-3个可能性，标注需要进一步核实的真实数据指标。"

Step 3：可落地的建议生成
"基于上述分析生成3条可执行改进建议。
每条含：具体动作、预期效果、潜在风险、监测指标。用表格输出。"

Step 4：正式报告一键合成
"整合以上所有分析，撰写完整季度销售分析报告。
结构：背景概述→数据概览→核心发现→原因分析→改进建议→后续监测。
语气专业平实，面向运营团队。"

Step 5：多模型交叉验证
"[将结论发给第二个模型] 你是一位独立审查分析师。
以下是另一模型生成的分析报告摘要：[粘贴结论]。
请审查：结论与原始数据是否一致？是否存在逻辑漏洞或忽略的维度？"
```

#### 中文可执行版

```
## 五步商业分析 Skill（中文版）

【第一步：异常定位】
你是一位[行业]数据分析师。我会给你一组数据。
请找出偏离正常范围最大的3个异常点，按影响程度从高到低排列。
约束：仅基于提供的数据，不编造信息。每个异常点标注具体数值和偏离幅度。

【第二步：归因推理】
针对上一步找到的TOP异常"[异常描述]"，
从以下维度分别推理可能原因（每个维度2-3个）：
- 市场维度（竞品动作、价格战、新进入者）
- 产品维度（功能、体验、定价策略变化）
- 用户维度（行为变化、需求迁移、满意度）
每个原因标注"需要核实的数据指标：[具体指标名称]"

【第三步：建议生成】
基于以上分析，生成3条可执行改进建议。表格格式：
| 具体动作 | 预期效果 | 潜在风险 | 监测指标 | 执行周期 |
|---------|---------|---------|---------|---------|

【第四步：报告合成】
整合全部分析，写一份完整报告。结构：
1. 背景概述（1段）
2. 数据概览（关键指标表格）
3. 核心发现（TOP3异常点）
4. 原因分析（按维度展开）
5. 改进建议（表格）
6. 后续监测建议
语气：专业平实，面向运营/产品团队。

【第五步：交叉验证（选做）】
将结论发送给另一个模型，附上原始数据摘要，要求其审查一致性。
```

#### 黄文轩可用版

> 这套5步法实战价值极高。做AI工具拆解不需要这么复杂的商业分析，但如果你要做"AI行业月度趋势分析""某赛道AI产品横向评测"这类深度内容——这5步就是你的内容生产线。更重要的用法：你可以用这套流程分析自己的自媒体数据——阅读量/粉丝增长/打开率异常在哪？归因是什么？改什么？怎么写进复盘报告？五个Prompt跑完，一篇数据驱动的复盘就出来了。

#### 适用场景
- 自媒体月度数据复盘
- AI行业赛道分析
- 产品/工具横向评测
- 知识付费产品数据诊断

#### 今日怎么用
试着用这5步分析你最近一个月的公众号数据：阅读量异常文章→归因→改进建议→复盘报告。全程AI辅助，20分钟出一份专业复盘。

#### 可沉淀成什么资产
- "AI驱动的内容复盘"Skill套装
- 自媒体数据分析Prompt模板库
- 公众号长文："我用AI做了30天数据复盘，这是完整流程"

#### 是否适合 Prompt/Skill 商店
是 — 适合打包为"自媒体数据复盘Skill包"，配套5个Prompt+使用说明。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 从数据到报告完整闭环，直接可用 |
| 新鲜度 | 4 | SegmentFault 6月2日发布，非常新 |
| 可复用性 | 5 | 适用于任何行业的数据分析 |
| 自媒体价值 | 4 | 适合复盘类内容，但偏实操向 |
| 变现潜力 | 4 | 可打包Skill但受众偏窄 |
| **总分** | **22/25** | |

---

### 资产 04：公众号选题 RPG 角色拆解 Skill（AI 自建）

**来源**：AI 基于今日趋势与最佳实践生成  
**类型**：Skill  
**版权**：AI 自建，可自由使用

#### 原始内容

结合MPT模块化思维和三角验证法，设计一套专门用于公众号选题拆解的RPG角色扮演Prompt。

```
【RPG选题拆解 Skill】

你将扮演三位角色，以不同视角拆解一篇爆款文章，
最终生成3个可执行的选题+框架。

【角色A - 结构解剖师】
任务：分析目标文章的结构骨架
输出：
- 钩子类型（好奇心/反常识/痛点/身份认同）
- 段落节奏（每段字数+功能）
- 转折点位置和手法
- 结尾CTA类型

【角色B - 情绪工程师】  
任务：分析文章的情绪引导线
输出：
- 情绪曲线图（开头→中间→结尾的情绪变化）
- 3个情绪引爆点及使用技巧
- 读者身份代入设计（"说的就是你"时刻）

【角色C - 选题再生师】
任务：基于A和B的分析，延展出新选题
输出：
- 3个新选题（保持核心方法论，换场景/人群/角度）
- 每个选题的钩子句（≤25字）
- 适合的平台和格式（长文/短文/视频脚本）

【交付物】
整合三人输出，生成：
1. 爆文拆解卡片（≤500字）
2. 3个可执行的选题+框架
3. 今日最快可写的1个选题（完整大纲）
```

#### 中文可执行版

```
### 公众号选题RPG拆解Skill

【输入】一篇你认为爆了的同行文章链接或原文

【角色设定与分工】
你同时扮演三位专家：
1. 结构解剖师（关注：怎么组织的？钩子/节奏/转折/CTA）
2. 情绪工程师（关注：读者什么感受？什么时候被击中？哪里想转发？）
3. 选题再生师（关注：这个套路怎么复用？场景/人群/角度怎么变？）

【工作流程】
Step 1：三位专家各自独立分析目标文章
Step 2：结构解剖师和情绪工程师交换发现，找出"结构×情绪"的交叉点
Step 3：选题再生师基于交叉点，生成3个新选题
Step 4：三人合议选出今日最快可写的1个选题

【最终交付】
- 爆文拆解卡（结构+情绪+可复用公式）
- 3个新选题（含钩子句）
- 今日首选选题的完整大纲（标题+3个小标题+每段核心观点）
```

#### 黄文轩可用版

> 这套Skill解决了一个核心痛点：看完一篇爆文觉得"写得真好"但不知道怎么学。现在用三个AI角色帮你拆：结构解剖师告诉你文章骨头怎么搭的，情绪工程师告诉你读者哪里被戳中了，选题再生师把套路变成你的选题。10分钟跑完，一篇爆文变成你下周的3篇内容。特别适合日更需要选题灵感的场景。

#### 适用场景
- 每日选题灵感枯竭时的急救工具
- 竞品内容反向工程
- 团队新人内容培训
- 跨平台内容改编（公众号→小红书/视频脚本）

#### 今日怎么用
找一篇最近你羡慕的同行爆文，丢进这个Skill跑一遍，看它生成的新选题是否值得写。如果能产出2个以上可写的选题，这套Skill就值了。

#### 可沉淀成什么资产
- Notion选题拆解模板
- 个人爆文拆解案例库（每周积累）
- 公众号长文："我用AI拆了50篇爆文，发现了这些套路"

#### 是否适合 Prompt/Skill 商店
是 — 适合作为"公众号运营Skill套装"的旗舰产品。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 解决真实的选题枯竭痛点 |
| 新鲜度 | 4 | 融合MPT+三角验证的创新组合 |
| 可复用性 | 5 | 适用于任何内容类型 |
| 自媒体价值 | 5 | 本身就是自媒体教学内容 |
| 变现潜力 | 4 | 需积累案例后才能溢价 |
| **总分** | **21/25** | |

---

### 资产 05：人性化写作 15 套 Prompt 套装（文本 Prompt）

**来源**：[The Humanize AI](https://thehumanizeai.pro/articles/chatgpt-prompts-human-like-writing)（2026年）  
**类型**：文本 Prompt  
**版权**：公开Prompt教程，可自由使用

#### 原始内容

2026年AI写作的核心痛点：输出太AI味——可预测的结构、套话句式、均匀句长。这套Prompt分三个梯度，从语气人格到结构打破到上下文注入，逐层去AI味。

**Tier 1：语气与人格 Prompt（3套）**

1. "Write as if you're a tired 28-year-old copywriter on their third espresso. Use casual language, contractions, and occasional self-deprecating humor. Avoid lists unless absolutely necessary."

2. "Write this like a Reddit post that got 2,000 upvotes. Use first person, be opinionated, include a personal anecdote, and end with an open question."

3. "Write about [topic] but: never start a sentence with 'Additionally' or 'Furthermore', vary sentence length between 4 and 25 words, include at least one one-word sentence, and use at least two metaphors."

**Tier 2：结构打破 Prompt（3套）**

4. "Write with high burstiness. Alternate between very short punchy sentences and longer, more complex thoughts. Start one paragraph with just a single word. End another with a rhetorical question."

5. "Write naturally. Include at least one parenthetical aside, one em-dash interruption, and one sentence that trails off with '...' before picking up a different thought."

**Tier 3：上下文注入 Prompt**

6. "You are a [profession] with 12 years of experience. Write about [topic] including: one specific mistake you made early in your career, one counterintuitive lesson, and one thing you changed your mind about."

#### 中文可执行版

```
## 人性化写作 Prompt 套装（中文适配版）

### 第一梯度：语气人格（3个核心Prompt）

【Prompt 1：疲惫打工人口吻】
"以一个连肝三杯咖啡的28岁新媒体编辑的口吻写。
用口语，用缩写，偶尔自嘲。除非万不得已，不要列清单。
你困但你还得写，你专业但你不想装。"

【Prompt 2：高赞帖子口吻】
"用一篇获得2000赞的小红书/即刻帖子的口吻写。
第一人称，有自己的观点和立场。
包含一个真实的个人经历。
结尾抛出一个开放性问题。"

【Prompt 3：反AI词汇清单】
"写关于[主题]的内容。但规则如下：
- 禁止使用：'值得注意的是''综上所述''不可否认''在当今时代'
- 句子长度在5-30字之间随机波动
- 至少包含一个单字成句的段落
- 至少使用两个比喻或类比"

### 第二梯度：结构打破（2个核心Prompt）

【Prompt 4：节奏跳跃法】
"用高跳跃节奏写。
短句和长句交替，不要有连续3句长度相近的句子。
有一段只有一个字开头。
另一段以一个反问句结尾。"

【Prompt 5：刻意不完美法】
"自然写，不要太工整。
至少有一处括号插入的补充说明。
至少有一处破折号打断的思路转折。
有一处用'……'表示欲言又止。"

### 第三梯度：专家身份注入

【Prompt 6：真实经验注入】
"你是一个有12年经验的[职业]。
写关于[话题]的内容时，必须包含：
- 一个你职业生涯早期犯过的具体错误
- 一个反直觉的教训
- 一件你最近改变看法的事情"
```

#### 黄文轩可用版

> AI写作最大的问题是"太AI了"——每段一样长、开头永远"在当今时代"、永远分1-2-3点。这套15个Prompt专门解决这个问题。分三梯度用：第一梯度把AI的语气调成真人，第二梯度把结构打散让人无法预测，第三梯度给内容注入真实经验感。做公众号最重要的是第三梯度——你写AI工具拆解，加上"我之前犯过一个错"的段落，人味立刻出来。

#### 适用场景
- 公众号长文去AI味
- 小红书/即刻个人IP内容
- 知乎深度回答
- 任何需要"像人写的"AI输出场景

#### 今日怎么用
选一篇你最近觉得"太AI了"的稿子，用第三梯度Prompt 6注入一段个人经验——你用过什么工具踩过什么坑。改完后发给3个人看，让他们猜哪段是AI写的。

#### 可沉淀成什么资产
- "去AI味写作Prompt卡片"（15张）
- 个人常用反AI词汇黑名单
- 按内容类型的语气预设库

#### 是否适合 Prompt/Skill 商店
是 — 15套Prompt可打包为"AI写作人味注入套装"。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 解决最普遍的AI写作痛点 |
| 新鲜度 | 4 | 2026年测试验证，15套体系化 |
| 可复用性 | 5 | 每次写内容都能用 |
| 自媒体价值 | 5 | 直击内容创作者核心痛点 |
| 变现潜力 | 4 | 可打包但门槛低 |
| **总分** | **23/25** | |

---

### 资产 06：YouTube 标题 7 框架 Prompt（文本 Prompt）

**来源**：[Miraflow AI](https://www.miraflow.ai/blog/ai-prompts-for-youtube-titles)（2026年）  
**类型**：文本 Prompt  
**版权**：公开教程，可自由使用

#### 原始内容

2026年YouTube标题7大高CTR框架，每个框架配Prompt模板和Thumbnail配合策略。

| # | 框架名称 | 示例 | 原理 |
|---|---|---|---|
| 1 | 实验标题 | "I Tested 100 AI Thumbnail Prompts" | 好奇心+数据+验证 |
| 2 | 结果标题 | "How This Thumbnail Doubled My CTR" | 明确收益+可量化 |
| 3 | 痛点标题 | "Why Your YouTube Videos Get No Views" | 直戳痛点 |
| 4 | 新手标题 | "YouTube SEO for Beginners (2026 Guide)" | 强搜索意图 |
| 5 | 破除迷思 | "YouTube SEO Myths That Kill Your Views" | 好奇心缺口 |
| 6 | 对比标题 | "CapCut vs Premiere Pro for YouTube" | 决策导向搜索 |
| 7 | 清单标题 | "10 Thumbnail Ideas That Increase CTR" | 快速价值感 |

**Thumbnail配合策略**：标题和封面不是独立的——封面要"完成标题讲了一半的故事"。例如标题"I Tested 30 AI Thumbnail Prompts"→封面用分屏"FAIL vs VIRAL"。

#### 中文可执行版

```
## YouTube/B站标题7框架 Prompt（中文版）

【使用说明】每次生成标题时，让AI按7种框架各生成2个，共14个备选。

用以下Prompt：

"你是YouTube/B站标题策略师。为以下视频内容[描述视频内容]，
按7种框架各生成2个标题（≤30字）：

框架1 - 实验型：'我测试了[数量][对象]，结果出乎意料'
框架2 - 结果型：'[方法]让我的[指标]提升了[数值]'
框架3 - 痛点型：'为什么你的[对象][负面结果]'
框架4 - 新手向：'[主题]新手入门指南（2026版）'
框架5 - 迷思型：'关于[主题]的[数量]个错误认知'
框架6 - 对比型：'[A] vs [B]：[场景]该选哪个'
框架7 - 清单型：'[数量]个[主题]技巧/工具/方法'

每个标题附带：适合的封面创意（一句话描述）"

---

【微信公众号版改编】
框架1 - 实验型 → "我拆解了30个AI工具，发现了一个共同规律"
框架2 - 结果型 → "用这个方法写公众号，打开率从3%升到了12%"
框架3 - 痛点型 → "为什么你的AI内容总是没人看"
框架4 - 新手向 → "AI自媒体从0到1完整指南（2026实战版）"
框架5 - 迷思型 → "关于AI写作，90%的人都在犯的5个错"
框架6 - 对比型 → "Claude vs ChatGPT写公众号，到底哪个强"
框架7 - 清单型 → "10个你明天就能用的AI写作Prompt"
```

#### 黄文轩可用版

> YouTube标题7框架可以直接移植到公众号。实验型最炸——"我试了X个Y，发现Z"这种标题永远不会过时。关键是每条标题搭配一个封面创意——公众号头图也一样，标题+头图要讲同一个故事的不同一半。每次发文前跑14个标题（7框架×2），选最好的那个。

#### 适用场景
- 公众号/B站/YouTube标题生成
- 小红书封面文案
- 短视频脚本开场
- 知识付费课程命名

#### 今日怎么用
拿你下一篇待发文章的草稿，跑一下7框架×2=14个标题，看哪个框架最适合你的内容类型。建立一个"我的标题框架偏好"——哪种框架在你的受众里效果最好。

#### 可沉淀成什么资产
- 个人标题框架偏好库（记录每类内容哪种框架CTR最高）
- 标题A/B测试记录表
- 标题+头图配合策略卡

#### 是否适合 Prompt/Skill 商店
是 — 适合打包为"自媒体标题生成器Skill"。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 标题是内容的第一生产力 |
| 新鲜度 | 3 | 7框架法不新但2026版有优化 |
| 可复用性 | 5 | 每次发文必用 |
| 自媒体价值 | 5 | 直接提升点击率 |
| 变现潜力 | 3 | 可打包但同质化竞争大 |
| **总分** | **21/25** | |

---

### 资产 07：Lo-Fi Realism 自媒体人像封面 Prompt（图像 Prompt）

**来源**：[GPTprompts.ai 2026 Trends](https://www.gptprompts.ai/trending-ai-photo-prompts-2026)  
**类型**：图像 Prompt  
**版权**：公开Prompt，生成图版权遵循所用模型ToS

#### 原始内容

Lo-Fi Realism 是2026年商业AI图像的首选风格——对抗2023-2025年过度完美的"塑料AI感"。核心特征：真实皮肤纹理、轻微失焦、自然颗粒感、不完美构图。

```
A young woman at a kitchen table, morning light, 
visible skin pores, slight motion blur on her hand, 
authentic natural grain, handheld 35mm film aesthetic, 
imperfect composition, candid moment.
```

2026年最成功的商业AI图像几乎都用了这种风格——看起来像真实抓拍而非精心摆拍。

#### 中文可执行版

**通用Lo-Fi Realism Prompt模板**：

```
[主体描述]，[自然光源]，可见的皮肤纹理/材质细节，
轻微的运动模糊或对焦偏移，真实的胶片颗粒感，
手持35mm胶片相机质感，不完美构图，抓拍瞬间。
--ar [比例] --style raw
```

**自媒体人像封面版（4个场景变体）**：

```
【变体1：创作者工作场景】
一个25岁男生在深夜的电脑前，屏幕光是唯一光源，
脸上有轻微屏幕反光，眼神专注，桌面有咖啡杯和笔记本，
可见皮肤纹理，轻微噪点，35mm胶片质感，
不完美构图（画面偏左），抓拍感。
--ar 16:9 --style raw

【变体2：街头灵感捕捉】
一个女生靠在老城区的墙上，午后阳光从侧面打过来，
风吹动头发，稍微过曝的边缘，胶片特有的偏绿色调，
皮肤保留了真实的瑕疵和纹理，像是在说话中途被拍到。
--ar 2.35:1 --style raw

【变体3：咖啡馆思考】
一个人坐在咖啡馆窗边，雨天，窗上有水珠，
手拿笔但没在写，望向窗外，自然侧光，
胶片暖色调，轻微颗粒，对焦在手上脸稍微虚化。
--ar 16:9 --style raw

【变体4：数据感封面】
俯拍一张白色桌面：MacBook屏幕亮着数据图表，
旁边一杯黑咖啡，一本翻开的Moleskine，
自然光从窗户进来，有笔和纸张的阴影，
真实纹理——纸张的纤维、木纹桌面、金属笔的划痕。
--ar 2.35:1 --style raw
```

#### 黄文轩可用版

> 2026年公众号头图的趋势是"去塑料感"。之前的AI图太完美了——皮肤像瓷器、光线像影棚——读者一眼看出是AI。Lo-Fi Realism故意保留瑕疵：皮肤纹理、轻微噪点、不完美构图、胶片偏色。看起来很贵但其实是"真实的贵"，适合个人IP那种"不装"的调性。4个场景变体覆盖了你大部分内容类型：工作场景→AI工具拆解、街头→个人思考、咖啡馆→深度长文、数据桌面→分析报告。

#### 适用场景
- 公众号头图（个人IP/深度内容）
- 即刻/小红书个人形象封面
- 课程/资料包宣传图
- 视频封面

#### 今日怎么用
用变体1"创作者工作场景"为下一篇AI工具拆解文跑一组封面图（Midjourney V7或Nano Banana），对比现在用的头图，看哪种风格点击率更高。

#### 可沉淀成什么资产
- 个人封面图Prompt库（按内容类型分类，每类3-5个变体）
- 公众号视觉风格指南
- "AI封面图去塑料感"教程长文

#### 是否适合 Prompt/Skill 商店
是 — 可打包为"自媒体封面Prompt套装（Lo-Fi风格）"。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 直接产出可用封面图 |
| 新鲜度 | 5 | 2026年最新趋势，国内鲜有人用 |
| 可复用性 | 4 | 需配合Midjourney/其他生图工具 |
| 自媒体价值 | 5 | 视觉差异化是个人IP的核心竞争力 |
| 变现潜力 | 4 | 可打包但受众需有生图工具 |
| **总分** | **23/25** | |

---

### 资产 08：Notes App Chic 图文创意封面 Prompt（图像 Prompt）

**来源**：[GPTprompts.ai 2026 Trends](https://www.gptprompts.ai/trending-ai-photo-prompts-2026)  
**类型**：图像 Prompt  
**版权**：公开Prompt，生成图版权遵循所用模型ToS

#### 原始内容

Notes App Chic 是2026年Q1主导LinkedIn和语录卡片账号的视觉风格：以文字为核心、排版优先的图像，看起来像笔记App/备忘录截图，极简、自白感、居中排版。2026年国内公众号引文卡片和即刻'金句配图'正是这个趋势的本地化表现。

```
Minimalist image of centered serif text on a cream background, 
subtle paper grain, soft shadow, 
single small aesthetic element (pressed flower or coffee ring) in corner, 
Notes app screenshot aesthetic.
```

#### 中文可执行版

**通用Notes App Chic Prompt**：

```
极简排版图像，[背景色]背景上有居中排列的文字，
微妙的纸张纹理或噪点，柔和的阴影，
角落有一个小的美学元素（[干花/咖啡渍/钢笔/回形针/书签]），
笔记App截图美学，[比例]。
--style raw
```

**自媒体图文封面版（4个场景变体）**：

```
【变体1：金句卡片】
米色背景，居中衬线字体（模拟中文宋体排版的英文），
文字内容区域约占画面60%，微妙的纸张纹理，
右下角有一枚干压花，柔和的左侧自然光阴影。
备忘录取截图风格，暖色调。
--ar 4:5 --style raw

【变体2：选题脑暴页】
白色格子纸背景，手写体风格的文字散布在页面上，
有几处被划掉和箭头修改的痕迹，
旁边放着一支钢笔（入画1/3），有咖啡杯留下的圆形印记，
纸的纹理清晰可见，暖黄台灯光。
--ar 3:4 --style raw

【变体3：清单/步骤卡片】
奶油色背景，带编号的简洁文字列表，
前两项已打勾（可用真实的视觉勾号而非文字），
文字用干净的衬线体，行间距舒适，
页面边缘有轻微折痕和磨损，像被翻过很多次的笔记本。
--ar 4:5 --style raw

【变体4：知识点拆解卡片】
纯白背景，手写标题+打字机正文的混排，
2-3个简短段落，用不同字号制造层次感，
卡片边缘有黄色便利贴露出一角（视觉暗示"有更多内容"），
极简但温暖。
--ar 1:1 --style raw
```

#### 黄文轩可用版

> Notes App Chic就是"看起来像备忘录截图的封面"。2026年公众号引文卡片、即刻金句配图、小红书知识卡片都在往这个方向走。核心是：文字是主角，设计做减法，质感做加法（纸张纹理/折痕/阴影/小元素）。4个变体覆盖了你不同的内容形式：变体1做金句卡片引流、变体2做选题预告、变体3做清单/步骤教程、变体4做知识拆解。关键是：不需要设计能力，Prompt跑出来就是成品。

#### 适用场景
- 公众号引文/金句卡片
- 即刻/微博观点配图
- 小红书知识卡片
- 知识星球/小报童目录页
- 课程/资料包内容预览图

#### 今日怎么用
从你昨天写的内容里选一句最有共鸣的话，用变体1跑一张金句卡片。发到即刻或朋友圈，看互动量是否有提升。

#### 可沉淀成什么资产
- 金句卡片Prompt模板库
- 个人视觉风格系统（配色+字体+元素组合）
- "AI金句卡片制作教程"短视频/图文

#### 是否适合 Prompt/Skill 商店
是 — 适合作为"自媒体视觉Prompt套装"的一部分。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 无需设计能力，Prompt直出成品 |
| 新鲜度 | 5 | 2026年Q1爆发的视觉趋势 |
| 可复用性 | 5 | 每次发文都能用 |
| 自媒体价值 | 5 | 金句卡片是社交传播利器 |
| 变现潜力 | 3 | 门槛低，易被模仿 |
| **总分** | **22/25** | |

---

### 资产 09：semihpolat/Awesome-Prompts — 高阶Prompt框架精选库（GitHub 资产库）

**来源**：[GitHub: semihpolat/Awesome-Prompts](https://github.com/semihpolat/Awesome-Prompts)  
**类型**：GitHub 资产库  
**版权**：开源仓库（查看仓库LICENSE）

#### 核心内容

这不是又一个"Act as a translator"风格的Prompt列表。这是一个**手工精选**的高阶Prompt工程框架与"地下技术"集合，内容来自X、Reddit和生产级AI系统的深度挖掘（2026年初）。

**三大核心板块**：

1. **高阶Prompt框架**：
   - MPT框架（Modules-Pathways-Triggers）：上下文自适应Prompt系统
   - Expert Triangulation：三位专家协作+互相审核
   - $4,000/Month Team Replacer：销售侦察+文案写作的AI替代方案

2. **生产级"泄漏"模式**：
   - No-Apology Protocol（Cursor AI）：禁止AI道歉，强制问题解决
   - Self-Audit Loop（Devin AI）：输出前自审计逻辑/安全/边界

3. **视觉合成技术**：
   - 2026 Vision Board框架
   - Nano Banana Pro JSON结构化图像描述
   - 真实感人像Prompt

**为什么值得关注**：不是收集量取胜，而是质量精选。每一条Prompt背后都有Reddit/X社区的验证和使用数据。

#### 中文可执行版（使用指南）

```
## 如何使用这个仓库

【第一步】先看三个核心框架：
1. MPT框架 → 理解"Prompt即程序"的思维方式
2. Expert Triangulation → 学会让AI多角色协作
3. Self-Audit Loop → 给AI输出加质量控制

【第二步】选一个框架，在你的日常任务中试用3天：
- 做AI工具拆解 → Expert Triangulation（产品/商业/用户三角）
- 做深度分析 → MPT框架（审计+合成+精炼三模块）
- 日常写作 → No-Apology Protocol（让AI输出更果断）

【第三步】将框架内化为自己的Skill模板：
- 在PromptHub/PromptX中创建一个"高阶框架"分类
- 每个框架保存中文适配版
- 每周复盘哪些框架实际提效最多
```

#### 黄文轩可用版

> semihpolat这个仓库跟你之前收藏的awesome-chatgpt-prompts不一样——那边是"菜谱"，这边是"烹饪理论"。它收集的不是"怎么写小红书文案"这种Prompt，而是像MPT框架、三角验证法这种底层方法论。重点是Reddit和X上验证过的，不是学院派的理论。学完一个框架就能举一反三用到所有场景。建议先看MPT和三角验证，这两个对你的内容类型最实用。

#### 适用场景
- Prompt工程进阶学习
- 高阶Skill设计参考
- 深度内容创作方法论
- AI产品体验研究

#### 今日怎么用
花15分钟浏览仓库README，重点看MPT Framework和Expert Triangulation两个框架。选一个在今天的写作任务中试用。

#### 可沉淀成什么资产
- 个人精选框架速查表
- "高阶Prompt工程"系列教程（基于此仓库）
- 中文适配版Prompt框架库

#### 是否适合 Prompt/Skill 商店
参考学习 — 仓库本身开源，但基于框架开发的原创Skill可售卖。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 直接提升Prompt设计水平 |
| 新鲜度 | 5 | 2026年新仓库，内容独特 |
| 可复用性 | 5 | 框架通用性极强 |
| 自媒体价值 | 5 | 可写成系列教程长文 |
| 变现潜力 | 4 | 仓库免费，但衍生内容可变现 |
| **总分** | **24/25** | |

---

### 资产 10：legeling/PromptHub — 本地Prompt+Skill管理分发中心（GitHub 资产库）

**来源**：[GitHub: legeling/PromptHub](https://github.com/legeling/PromptHub)  
**类型**：GitHub 资产库  
**版权**：开源（查看仓库LICENSE）

#### 核心内容

PromptHub 不只是Prompt管理工具，更是**AI技能分发中心**。管理Prompt和SKILL.md技能，一键安装到Claude Code、Cursor、Windsurf、Codex等15+主流AI编程工具。

**核心功能**：

| 功能模块 | 说明 |
|---|---|
| Prompt管理 | 创建/编辑/删除，文件夹+标签分类，自动历史版本，模板变量`{{variable}}` |
| Skill技能管理 | 内置20+精选技能商店，一键安装到15+AI编程工具，本地SKILL.md自动扫描导入 |
| AI能力 | 内置AI测试支持国内外主流模型，同Prompt多模型并行对比，图像模型测评 |
| 数据安全 | 纯本地存储，主密码保护，私密文件夹加密，WebDAV云同步 |
| 跨平台 | macOS / Windows / Linux，7种语言，深色/浅色主题 |

**关键词**：技能商店、一键分发、版本控制、模板变量、多模型测试、纯本地隐私。

#### 中文可执行版（使用指南）

```
## PromptHub 快速上手

【安装】
从GitHub Release下载对应系统版本，解压即用。

【第一步：建立你的Prompt资产库】
1. 创建分类文件夹：公众号写作/商业分析/图像生成/工具拆解
2. 将历史优质Prompt逐条录入
3. 为高频使用的Prompt设置模板变量（{{主题}}、{{产品名}}等）

【第二步：管理Skill技能】
1. 打开Skill商店，浏览精选技能
2. 下载你感兴趣的Skill（如PRD写作、代码审查）
3. 学习Skill的SKILL.md格式，用于创建自己的Skill

【第三步：日常使用】
- 写作前浏览对应分类，找到合适的Prompt模板
- 使用模板变量快速填充当前任务信息
- 对产出不满时切换模型对比效果
- 好的Prompt及时保存并打标签
```

#### 黄文轩可用版

> PromptHub解决了一个你正在面临的问题：Prompt和Skill越来越多，散落在各种聊天记录、Notion、笔记里，用的时候找半天。这个工具让你把所有Prompt集中管理，分类、打标签、版本控制、模板变量——相当于给你的AI资产建了一个私人图书馆。最重要的是Skill商店功能——你可以看别人怎么做Skill，然后模仿着把自己的工作流打包成Skill。未来你做Prompt/Skill商店变现，这就是你的生产工具。

#### 适用场景
- 个人Prompt资产管理
- Skill开发与测试
- 多模型效果对比
- Prompt商店/付费产品的前期准备

#### 今日怎么用
下载安装PromptHub，把你最近一周用过的5个最好的Prompt录入进去。体验一下分类+标签+模板变量的管理效率。如果体验好，逐步把你所有的Prompt资产迁移进去。

#### 可沉淀成什么资产
- 个人Prompt资产库（结构化、可检索）
- 自研Skill产品（基于SKILL.md格式）
- "PromptHub完全使用指南"教程内容

#### 是否适合 Prompt/Skill 商店
工具本身 — 可作为Prompt/Skill商店的基础设施。

#### 评分
| 维度 | 分数/5 | 说明 |
|---|---|---|
| 实用性 | 5 | 解决Prompt管理刚需 |
| 新鲜度 | 4 | 2026年活跃维护，持续更新 |
| 可复用性 | 5 | 日常高频使用工具 |
| 自媒体价值 | 4 | 可做工具推荐/使用教程 |
| 变现潜力 | 5 | 资产库建设是变现基础设施 |
| **总分** | **23/25** | |

---

## 三、今日最值得实操资产

**资产 02：Expert Triangulation 专家三角验证法**

**为什么选它**：

1. **效果最显著**：单次提问 vs 三角验证的输出质量差距是肉眼可见的，不是那种"感觉好了一点"的玄学优化。

2. **适配你的内容类型**：AI工具拆解（产品+商业+增长三角）、竞品分析（功能+体验+市场三角）、选题决策（内容+读者+变现三角）——你的三类核心内容全部匹配。

3. **可教可卖**：这个技巧中文互联网几乎零覆盖，你是第一批。写成教程长文、做成Notion模板、录成短视频——三个方向都能出内容。

4. **30分钟验证**：拿一篇你准备写的拆解文，用三角验证法跑一遍，30分钟就知道值不值得深耕。

**今日实操**：
1. 选一个你想拆解的AI产品（Notion AI / Cursor / Midjourney V7）
2. 用三角验证Prompt跑一遍：产品经理+商业分析师+自媒体视角
3. 对比单次提问和三角验证的输出
4. 把对比结果写成一条即刻/朋友圈——这就是内容

---

## 四、今日图像 Prompt 专区

### 图像 Prompt 1：Lo-Fi Realism 创作者场景封面

```
一个25岁亚洲男生在深夜的电脑前工作，屏幕光是唯一光源，
脸上有轻微屏幕反光，眼神专注但有些疲惫，
桌面散落着笔记本、咖啡杯和手机，
可见的皮肤纹理和毛孔，胶片颗粒感，高ISO噪点，
手持35mm胶片相机质感，不完美构图（主体偏左），
色彩偏暖（钨丝灯+屏幕蓝光混合），氛围真实不摆拍。
--ar 16:9 --style raw
```

**适用**：AI工具拆解/深夜思考/个人复盘类公众号头图

### 图像 Prompt 2：Notes App Chic 金句卡片

```
极简排版图像，暖米色背景上居中排列的中文金句，
字体为优雅的衬线体（宋体风格），文字约占画面50%，
微妙的纸张纤维纹理，柔和的自然光从左侧投下浅阴影，
右下角有一小枝干薰衣草（淡紫色），
画面边缘有轻微暗角，仿佛用手机随手拍的备忘录截图。
--ar 4:5 --style raw
```

**适用**：即刻金句配图/公众号引文卡片/小红书知识卡片

---

## 五、今日 GitHub 资产库专区

| # | 仓库 | Stars | 核心价值 | 链接 |
|---|---|---|---|---|
| 1 | semihpolat/Awesome-Prompts | ~700+ | 高阶Prompt框架精选，MPT/三角验证/生产级泄漏模式 | [GitHub](https://github.com/semihpolat/Awesome-Prompts) |
| 2 | legeling/PromptHub | 活跃开发中 | 本地Prompt+Skill管理，一键分发15+工具 | [GitHub](https://github.com/legeling/PromptHub) |

**补充关注**（本轮搜索发现但未收录为独立资产的高价值仓库）：
- [prompts.chat](https://github.com/f/prompts.chat) — 161K+ Stars，全球最大开源Prompt库，CC0许可
- [dongshuyan/Awesome-Prompts](https://github.com/dongshuyan/Awesome-Prompts) — 中文Prompt收藏库，含防幻觉/角色扮演/元提示词等

---

## 六、今日不要收录清单

| # | 剔除内容 | 原因 |
|---|---|---|
| 1 | mattpocock/skills（AI编程Skill库） | Agent/AI Coding 教程类，违反收录规则 |
| 2 | anthropics/skills（官方Agent Skills仓库） | Agent工作流，不在收录范围 |
| 3 | "10000 Prompts Pack"类噱头合集 | 噱头Pack，无实践场景验证 |
| 4 | Playbook Intelligence（AI资产管理SaaS） | 复杂SaaS产品，非可直接使用的Prompt/Skill资产 |
| 5 | 国内低质量搬运平台（CSDN/百家号/头条号同名搬运） | 信源规则明确排除 |

---

## 七、明日搜索关键词建议

| # | 关键词 | 搜索方向 |
|---|---|---|
| 1 | "Claude system prompt leaked" 2026 | 最新的AI系统提示词泄漏 |
| 2 | prompt engineering "visual chain of thought" 2026 | 视觉化思维链Prompt技术 |
| 3 | Midjourney V7 "editorial portrait" prompt | 最新Midjourney人像Prompt |
| 4 | "GEO optimization" prompt reddit 2026 | 生成式引擎优化Prompt |
| 5 | FlowGPT trending "business strategy" | FlowGPT商业策略类热门 |
| 6 | Civitai "product photography" lora 2026 | 最新产品摄影LoRA模型 |
| 7 | GitHub "awesome skills" claude code trending | 最新Skill库仓库 |
| 8 | X/Twitter "prompt that made me" viral thread | X上爆火的Prompt分享帖 |
| 9 | "knowledge base prompt" AI content 2026 | 知识库驱动的AI内容Prompt |
| 10 | PromptHero "magazine cover" trending | PromptHero杂志封面类热门 |

---

## 八、自检清单

- [x] 输出 10 条资产
- [x] Skill ≥4 条（实际：4条）
- [x] 图像 Prompt ≥2 条（实际：2条 + 专区2条）
- [x] GitHub ≥1 条（实际：2条）
- [x] AI 自建 ≤2 条（实际：1条）
- [x] 过滤 Agent / AI Coding / 低质量 Prompt
- [x] 每条有来源、中文可执行版、黄文轩可用版、今日实操
- [x] 选出今日最值得实操资产（资产02：Expert Triangulation）
- [x] 避免违法、灰产、刷量、侵权内容
- [ ] CSV 追加（下一步执行）

---

*生成时间：2026-06-08 | 信源覆盖：GitHub ×4 / Reddit ×2 / 技术博客 ×2 / Prompt社区 ×2*
*（内容由AI生成，仅供参考）*
