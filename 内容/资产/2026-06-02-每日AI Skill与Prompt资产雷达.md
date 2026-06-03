# 每日 AI Skill / Prompt 资产雷达

**日期**：2026-06-02（星期二）
**定位**：科技AI自媒体 · 大学生AI实战家 · 05后AI项目实验者 · AI产品实验者 · AI内容增长/变现

---

## 一、今日资产雷达总览

| # | ID | 类型 | 标题 | 来源类型 | 总分 |
|---|-----|------|------|----------|------|
| 1 | ASP-2026-06-02-001 | Skill | 专家辩论面板（Expert Panel Simulation） | Reddit r/PromptEngineering 热帖 + Sourcery.ai 工程实践 | 22/25 |
| 2 | ASP-2026-06-02-002 | Skill | Newsletter选题生成器（非流水线版） | Promptolis 2026 Newsletter Toolkit | 21/25 |
| 3 | ASP-2026-06-02-003 | Skill | YouTube视频→深度文章转换Skill | Reddit r/PromptEngineering 社区 + @Jiayuan/@向阳乔木优化 | 20/25 |
| 4 | ASP-2026-06-02-004 | Skill | Newsletter内容压缩术（Compression Pass） | Promptolis 2026 Newsletter Toolkit #14 | 19/25 |
| 5 | ASP-2026-06-02-005 | 文本Prompt | AI产品拆解分析Prompt（7段式框架） | text-generator.io + lobehub.com AI Product Teardown Skill | 21/25 |
| 6 | ASP-2026-06-02-006 | 文本Prompt | 情境简报+推理要求（Anthropic验证版） | 前Anthropic研究员公开分享的10个内部Prompt #1+#2 | 19/25 |
| 7 | ASP-2026-06-02-007 | 图像Prompt | 小红书插画风封面图Prompt（MJ v6.6调参版） | PHP中文网 Midjourney实战测试 | 23/25 |
| 8 | ASP-2026-06-02-008 | 图像Prompt | 通用高点击率AI缩略图Prompt（全平台适配） | TopFreePrompts 2026 AI Thumbnail Guide | 22/25 |
| 9 | ASP-2026-06-02-009 | GitHub资产库 | prompts.chat — 全球最大开源AI提示词库（161K Stars） | GitHub f/awesome-chatgpt-prompts (prompts.chat) | 24/25 |
| 10 | ASP-2026-06-02-010 | GitHub资产库 | Awesome-Prompts — 防幻觉+元提示词+写作辅助七合一提示词库 | GitHub dongshuyan/Awesome-Prompts | 21/25 |

**类型分布**：
- Skill：4 条
- 文本Prompt：2 条
- 图像Prompt：2 条
- GitHub资产库：2 条
- AI 自建：0 条（本期外部素材质量充足）

---

## 二、今日 10 条资产详情

### 资产 1：专家辩论面板（Expert Panel Simulation）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-001` |
| 类型 | Skill |
| 来源链接 | https://caprompt.com/news/1506 |
| 来源类型 | Reddit r/PromptEngineering 热帖 + Sourcery.ai 工程实践 |
| AI 自建 | 否 |
| 标签 | 辩论,推理增强,复杂决策,角色扮演2.0 |
| 评分 | 22/25（实用性5/新鲜度5/可复用性4/自媒体价值4/变现潜力4） |
| 版权 | Reddit社区公开方法论，自由使用，标注灵感来源即可 |

**概述**：用三个立场互斥的虚拟专家辩论替代单人角色扮演，强制模型暴露技术权衡与潜在风险，将输出深度提升一个量级。单人专家倾向压平冲突、给出四平八稳的答案；三方辩论让乐观派/悲观派/务实派互相挑毛病，自我纠错机制自然触发。

**原始 Prompt / 核心内容**：
```
You are three experts: Alice (optimist), Bob (pessimist), and Charles (pragmatist). Discuss the following proposal from your respective standpoints. Each of you must challenge the others' assumptions and identify blind spots. After 5 rounds of debate, produce a structured JSON summary with: consensus view, unresolved disagreements, risk register, and final recommendation with confidence score.
```

**中文可执行版**：
> 你是三位专家：Alice（乐观派）、Bob（悲观派）和 Charles（务实派）。请从各自立场讨论以下方案。每人必须挑战他人的假设并指出盲点。经过5轮辩论后，输出结构化JSON总结：共识观点、未解决分歧、风险清单、最终推荐及置信度评分。

**文轩可用版**：
> 我文轩作为一个AI实验者，直接用这个Skill来评估我的每个AI小项目：设乐观派（看到最大潜力）、悲观派（指出所有翻车点）、务实派（给出最小可行方案），三方辩论3-5轮后我拿结论决策。比一个人瞎琢磨靠谱10倍。尤其适合评估'这个AI工具值不值得做内容'、'这个选题能不能爆'这类判断。

**适用场景**：技术方案评估 / 内容选题决策 / 产品方向判断 / 个人项目可行性分析

**今日怎么用**：拿你手上正在纠结的一个选题或项目决策，用Expert Panel走一遍，对比单人角色输出的差异。

**可沉淀资产**：标准化的三方辩论Prompt模板，可沉淀为个人决策Skill卡片

**Prompt/Skill 商店潜力**：高 — Prompt商店稀缺品类，差异化明显

---

### 资产 2：Newsletter选题生成器（非流水线版）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-002` |
| 类型 | Skill |
| 来源链接 | https://promptolis.com/de/blog/ai-prompts-for-newsletter-writers-2026/ |
| 来源类型 | Promptolis 2026 Newsletter Toolkit |
| AI 自建 | 否 |
| 标签 | 选题,内容规划,Newsletter,公众号,反同质化 |
| 评分 | 21/25（实用性5/新鲜度4/可复用性5/自媒体价值5/变现潜力2） |
| 版权 | Promptolis公开Prompt，自由使用和改编 |

**概述**：不靠RSS feed拼凑选题。输入你的定位+最近5期标题+读者画像，AI强制生成15个原创角度：3个反常识观点、2个个人故事驱动、2个'问我任何事'风格、2个数据驱动分析、6个常青话题。专治选题枯竭和内容同质化。

**原始 Prompt / 核心内容**：
```
Paste your niche + last 5 issues + audience description. Generate 15 new topic ideas: 3 contrarian angles, 2 personal-story-driven issues, 2 'ask me anything' style issues, 2 data-driven analyses, and 6 evergreen topics for archive-building. Each idea must include: why it's different from what competitors cover, and the one-sentence hook.
```

**中文可执行版**：
> 粘贴你的内容定位 + 最近5期标题 + 读者画像。生成15个新选题：3个反常识角度、2个个人故事驱动、2个'问我任何事'风格、2个数据驱动分析、6个常青话题。每个选题必须说明：与竞品差异点、一句话钩子。

**文轩可用版**：
> 文轩做公众号/Newsletter的选题神器。输入'AI实践者+最近做了什么实验+读者是大学生和AI新手'，直接炸出15个别人没写过的选题。关键是3个反常识角度——这才是区分你和搬运号的核心。每周跑一次，选题焦虑清零。

**适用场景**：公众号/Newsletter选题规划 / 小红书内容矩阵 / 视频选题脑暴

**今日怎么用**：今天就跑一次：用你最近5篇内容的标题+读者画像，生成15个选题，挑3个本周执行。

**可沉淀资产**：选题生成Skill卡片，每周固定流程

**Prompt/Skill 商店潜力**：高 — 内容创作者刚需，可打包为'选题工作流'上架

---

### 资产 3：YouTube视频→深度文章转换Skill

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-003` |
| 类型 | Skill |
| 来源链接 | https://bingqiangzhou.github.io/posts/toolsandresources-youtubevideosummaryprompt/ |
| 来源类型 | Reddit r/PromptEngineering 社区 + @Jiayuan/@向阳乔木优化 |
| AI 自建 | 否 |
| 标签 | 内容复利,视频转文字,深度长文,一鱼多吃 |
| 评分 | 20/25（实用性5/新鲜度3/可复用性4/自媒体价值5/变现潜力3） |
| 版权 | 社区公开Prompt，自由使用，商业发布需标注原视频来源 |

**概述**：把任何YouTube/B站视频转成可直接发布的深度文章。含时间戳结构、框架提炼、逐段展开（每节不少于500字）。一条视频内容变成一篇Blog文章，内容复利翻倍。适合内容创作者做'一鱼多吃'。

**原始 Prompt / 核心内容**：
```
你将把一段YouTube视频重写成'阅读版本'，按内容主题分成若干小节。目标是让读者通过阅读就能完整理解视频讲了什么。每个小节不少于500字。若出现方法/框架/流程，将其重写为条理清晰的步骤或段落。关键数字/定义/原话如实保留并在括号补充注释。从视频中抽象出Framework & Mindset，每个不少于500字。
```

**中文可执行版**：
> 同上（已为中文可执行版）

**文轩可用版**：
> 文轩看了一个好的AI教程视频，不想只是'看过'，直接丢这个Skill把视频转录+AI重写成一篇2000字深度文章，发公众号。一条视频=一篇爆文。B站/YouTube上那些优质AI教程都是你的免费素材库。记得标注原视频来源。

**适用场景**：视频内容复用到公众号 / 学习笔记沉淀 / 外文视频中文化

**今日怎么用**：找一条你最近收藏但没时间深看的AI教程视频，用这个Skill转成文章初稿。

**可沉淀资产**：视频转文章工作流模板，可扩展为多平台分发Skill

**Prompt/Skill 商店潜力**：中高 — 内容创作者工具类，有市场但竞争多

---

### 资产 4：Newsletter内容压缩术（Compression Pass）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-004` |
| 类型 | Skill |
| 来源链接 | https://promptolis.com/de/blog/ai-prompts-for-newsletter-writers-2026/ |
| 来源类型 | Promptolis 2026 Newsletter Toolkit #14 |
| AI 自建 | 否 |
| 标签 | 精简写作,编辑,信息密度,读者尊重 |
| 评分 | 19/25（实用性4/新鲜度3/可复用性5/自媒体价值4/变现潜力3） |
| 版权 | Promptolis公开Prompt |

**概述**：把1500字草稿压缩到700字，保留所有核心观点。大多数内容创作者过度写作，压缩信号=尊重读者时间。500-800字是现代Newsletter/公众号的甜点区间。配合'Show Don't Tell重写'效果更佳。

**原始 Prompt / 核心内容**：
```
Paste a 1500-word draft. Return a 700-word version that keeps all essential ideas. Rules: remove throat-clearing intros, merge redundant paragraphs, keep every statistic and example, preserve voice and personality, never cut the core argument. Compression signals respect for reader time.
```

**中文可执行版**：
> 粘贴一篇1500字草稿。返回700字版本，保留所有核心观点。规则：删除废话式开头、合并重复段落、保留所有数据和案例、保持语气和个性、绝不削减核心论点。压缩是对读者时间的尊重。

**文轩可用版**：
> 文轩写公众号最容易犯的错：1500字里500字是铺垫。这个Skill强制你把水分挤干，只留干货。每周发之前跑一次Compression Pass，读者留存率肉眼可见提升。一句话：写短比写长难，但短才是本事。

**适用场景**：公众号/Newsletter发布前精简 / 小红书文案浓缩 / 推特串提炼

**今日怎么用**：拿你今天最长的那篇草稿跑一次Compression Pass，对比前后字数差和核心观点保留率。

**可沉淀资产**：内容编辑Skill卡片，可纳入个人写作SOP

**Prompt/Skill 商店潜力**：中 — 编辑类工具，非刚需但实用

---

### 资产 5：AI产品拆解分析Prompt（7段式框架）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-005` |
| 类型 | 文本Prompt |
| 来源链接 | https://text-generator.io/prompts/product-teardown-analysis-prompt |
| 来源类型 | text-generator.io + lobehub.com AI Product Teardown Skill |
| AI 自建 | 否 |
| 标签 | 产品拆解,AI工具分析,商业模式,内容选题 |
| 评分 | 21/25（实用性5/新鲜度3/可复用性5/自媒体价值5/变现潜力3） |
| 版权 | 公开Prompt模板，自由使用 |

**概述**：结构化拆解任何AI产品：产品定位、引导流程、核心循环、变现机制、留存策略。指出3个做得极好的点和3个弱点，对比品类最佳实践，建议3个下一步实验。适合做'AI产品拆解'系列内容。

**原始 Prompt / 核心内容**：
```
Perform a product teardown of [product]. Analyze onboarding flow, core loop, monetization, and retention mechanics. Identify 3 things done exceptionally well and why. Identify 3 weaknesses or missed opportunities. Compare against category best practices. Suggest 3 experiments they should run next. Return: product overview, onboarding analysis, core loop breakdown, monetization assessment, strengths/weaknesses/recommendations.
```

**中文可执行版**：
> 对[产品名称]进行产品拆解。分析：引导流程、核心循环、变现机制、留存策略。指出3个做得极好的点及原因、3个弱点或错失机会。与品类最佳实践对比。建议3个下一步实验。输出：产品概览、引导分析、核心循环拆解、变现评估、优势/劣势/建议。

**文轩可用版**：
> 文轩做AI产品实验，每个工具用完直接跑这个Prompt生成一篇深度拆解文。不用自己琢磨怎么写——7段框架自动填。一周拆3个AI工具，内容产出稳定且差异化明显。建议先拆大家没用过的冷门工具，搜索流量更大。

**适用场景**：公众号AI工具测评 / 小红书产品种草 / 视频号工具推荐脚本

**今日怎么用**：选一个你今天新发现的AI工具，跑这个Prompt拆解一遍，看输出质量能否直接发。

**可沉淀资产**：产品拆解Prompt模板，可沉淀为内容生产流水线

**Prompt/Skill 商店潜力**：高 — Prompt商店热门品类

---

### 资产 6：情境简报+推理要求（Anthropic验证版）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-006` |
| 类型 | 文本Prompt |
| 来源链接 | https://caprompt.com/news/1506 |
| 来源类型 | 前Anthropic研究员公开分享的10个内部Prompt #1+#2 |
| AI 自建 | 否 |
| 标签 | 提示词工程,Anthropic,Claude优化,输出质量 |
| 评分 | 19/25（实用性5/新鲜度3/可复用性5/自媒体价值3/变现潜力3） |
| 版权 | Anthropic研究员公开分享，自由使用 |

**概述**：前Anthropic研究员公开团队内部在用的Prompt：先给情境地图（我是谁、试过什么、卡在哪），再强制推理过程（逐步展示、标注不确定、标记假设）。两条组合使用，Anthropic内部测试输出质量提升显著。核心逻辑：信息越具体→AI排除干扰越多。

**原始 Prompt / 核心内容**：
```
Step 1 — Context Brief: 'My background is: [role/situation]. I have already tried: [Method A, Method B]. Currently stuck at: [specific difficulty]. Please help me clear my thinking.' Step 2 — Reasoning Requirement: 'Before giving a plan, please demonstrate your reasoning step by step, point out all uncertainties, and mark every assumption.'
```

**中文可执行版**：
> 步骤1 — 情境简报：'我的背景是：[角色/情况]。我已经尝试过：[方法A、方法B]。目前卡在：[具体难点]。请帮我理清思路。' 步骤2 — 推理要求：'给出方案前，请逐步展示你的推理过程，指出所有不确定之处，并标记每一条假设。'

**文轩可用版**：
> 文轩问AI最常犯的错：上来就问'怎么用XX工具赚钱'，AI给一堆废话。改用这个组合：先交代'我是AI实践者/已经试过A和B/目前卡在怎么把流量变现'，再加推理要求。输出立刻从泛泛而谈变成可执行方案。每次提问前花30秒填这两个模板，AI回答质量翻倍。

**适用场景**：任何需要AI深度分析的场景 / 个人决策辅助 / 学习路径规划

**今日怎么用**：今天问AI任何一个问题时，强制自己先用情境简报模板铺垫背景，对比和直接提问的输出差异。

**可沉淀资产**：提问前检查清单，可纳入个人AI使用SOP

**Prompt/Skill 商店潜力**：中 — 偏方法论，不如具体场景Prompt好卖

---

### 资产 7：小红书插画风封面图Prompt（MJ v6.6调参版）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-007` |
| 类型 | 图像Prompt |
| 来源链接 | https://m.php.cn/faq/2515449.html |
| 来源类型 | PHP中文网 Midjourney实战测试 |
| AI 自建 | 否 |
| 标签 | 小红书封面,插画风,Midjourney,自媒体视觉,图文混合 |
| 评分 | 23/25（实用性5/新鲜度4/可复用性5/自媒体价值5/变现潜力4） |
| 版权 | 社区公开实测Prompt，自由使用和改编 |

**概述**：小红书爆款封面的核心不是'插画风'标签，而是线条密度+色块分割+留白比例+人物姿态的可复现参数组合。关键动作：关闭MJ v6.6默认的写实光影和景深（加flat lighting、2D composition），为标题文字预留30%安全区，用--stylize 500保持手绘抖动感。

**原始 Prompt / 核心内容**：
```
A young Asian woman sitting at a desk with a laptop, minimalist illustration style, clean line art with slight sketchy line, flat lighting, even illumination, 2D composition, solid pastel background in warm beige, simple geometric overlay shapes in the bottom right corner, leaving top 30% area clean for text placement. no face cut, slightly cropped at shoulders, calm and focused expression. --ar 3:4 --v 6.6 --stylize 500 --no photorealistic, bokeh, depth of field, textured paper, grain, text, watermark
```

**中文可执行版**：
> 一位年轻亚洲女性坐在桌前使用笔记本电脑，极简插画风，干净的线条带轻微手绘抖动感，平面光照，均匀照明，2D构图，暖米色纯色柔和背景，右下角简单几何叠加形状，顶部30%区域留白用于文字。不裁脸，肩部略裁，平静专注表情。--ar 3:4 --v 6.6 --stylize 500 --no 写实光影 景深 纹理纸 颗粒 文字 水印

**文轩可用版**：
> 文轩做AI工具测评公众号，封面图不用再找设计师。直接套这个Prompt改主体元素：把'女性+笔记本电脑'换成你要的内容（比如'男性+手机展示AI App界面'），留白区加标题。3:4比例完美适配小红书，改--ar 2.35:1就是公众号头条封面。一组跑5张，挑最好的。

**适用场景**：公众号头图 / 小红书封面 / 视频号封面 / 课程海报底图

**今日怎么用**：今天就跑一次，替换Prompt中的人物和设备描述为你今天要发的内容主题，生成5张封面备选。

**可沉淀资产**：自媒体封面图Prompt模板库，按平台分类

**Prompt/Skill 商店潜力**：极高 — Prompt商店最热品类，自媒体封面Prompt需求极大

---

### 资产 8：通用高点击率AI缩略图Prompt（全平台适配）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-008` |
| 类型 | 图像Prompt |
| 来源链接 | https://www.topfreeprompts.com/resources/best-ai-thumbnail-prompts-(2026)-top-free-prompts-for-viral-youtube-tiktok-social-media-thumbnails |
| 来源类型 | TopFreePrompts 2026 AI Thumbnail Guide |
| AI 自建 | 否 |
| 标签 | 缩略图,封面,YouTube,TikTok,高点击,通用模板 |
| 评分 | 22/25（实用性5/新鲜度4/可复用性5/自媒体价值5/变现潜力3） |
| 版权 | TopFreePrompts公开Prompt模板，自由使用 |

**概述**：2026年AI缩略图Prompt的核心公式：平台风格+情绪表情+光线方向+构图布局+对比度+背景简洁度+文字区位置。区别于泛泛的'make a thumbnail'，这个模板强制定义所有视觉锚点，CTR比通用提示词高出一档。

**原始 Prompt / 核心内容**：
```
High-contrast social media thumbnail featuring a [shocked/focused/excited] facial expression, dramatic side lighting, bold composition with face occupying 60% of frame, blurred dark gradient background, glowing highlights on face edges, clean text placement zone on the lower 1/3, premium creator-style visual hierarchy, vibrant color pop on key elements. Platform-optimized: [YouTube/TikTok/Xiaohongshu/WeChat].
```

**中文可执行版**：
> 高对比度社媒缩略图：震惊/专注/兴奋表情，戏剧性侧光，面部占画面60%的大胆构图，模糊深色渐变背景，面部边缘发光高光，下方1/3留出干净的文字放置区，高级创作者风格视觉层次，关键元素鲜艳跳色。平台适配：[YouTube/TikTok/小红书/公众号]。

**文轩可用版**：
> 文轩发B站/视频号/小红书视频，封面直接套这个。关键三要素：表情必须夸张（震惊/兴奋）、面部占60%（小图也能看到表情）、下1/3留白放标题（不要用AI生成文字，后期自己加）。平台改--ar比例就行。这个比纯靠AI生成的'精致但无聊'封面点击率高太多。

**适用场景**：B站封面 / 视频号封面 / 小红书视频封面 / 抖音缩略图 / YouTube Thumbnail

**今日怎么用**：你今天如果要发任何视频内容，用这个Prompt生成3张封面，对比你之前用的封面CTR。

**可沉淀资产**：全平台缩略图Prompt模板，可扩展为封面图生成器

**Prompt/Skill 商店潜力**：极高 — 视频创作者刚需，Prompt商店顶级品类

---

### 资产 9：prompts.chat — 全球最大开源AI提示词库（161K Stars）

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-009` |
| 类型 | GitHub资产库 |
| 来源链接 | https://github.com/f/prompts.chat |
| 来源类型 | GitHub f/awesome-chatgpt-prompts (prompts.chat) |
| AI 自建 | 否 |
| 标签 | GitHub,提示词库,开源,CC0,4000+Prompt,被哈佛引用 |
| 评分 | 24/25（实用性5/新鲜度5/可复用性5/自媒体价值4/变现潜力5） |
| 版权 | CC0 (Public Domain)，完全自由使用，包括商用，无需署名 |

**概述**：GitHub 161K Stars的全球最大开源AI提示词库。4000+即用Prompt模板覆盖全场景，支持ChatGPT/Claude/Gemini，含CSV/Markdown导出、25章免费教程、CLI工具和MCP服务器。被Forbes报道、哈佛和哥伦比亚大学课程引用、40+学术论文引用。CC0许可证=完全自由商用。

**原始 Prompt / 核心内容**：
```
GitHub: https://github.com/f/prompts.chat | Website: https://prompts.chat | 161K+ Stars, 20K+ Forks, 408 contributors. 4000+ prompts across all categories. CC0 license (public domain, no restrictions). Interactive prompt engineering handbook: https://prompts.chat/book
```

**中文可执行版**：
> GitHub仓库：https://github.com/f/prompts.chat | 官网：https://prompts.chat | 16万+Star，2万+Fork，408位贡献者。4000+条全场景提示词。CC0许可证（公有领域，无任何限制）。配套免费提示工程手册25章。

**文轩可用版**：
> 文轩做内容最怕没素材——这个仓库4000条Prompt，每天挑5条测试+改编+写使用体验，够你发2年公众号不断更。CC0许可证意味着你改编后的Prompt可以直接卖，没有任何版权顾虑。先clone下来，每周精读一个分类，把好用的Prompt收录到自己的资产库里。

**适用场景**：Prompt学习素材 / 内容选题灵感 / Prompt商店货源 / 提示工程教学案例

**今日怎么用**：Clone仓库或访问prompts.chat，随机浏览3个分类，挑1条Prompt实际测试并记录效果。

**可沉淀资产**：个人Prompt资产库的基础素材源

**Prompt/Skill 商店潜力**：极高 — 可直接作为Prompt商店的上游素材库

---

### 资产 10：Awesome-Prompts — 防幻觉+元提示词+写作辅助七合一提示词库

| 字段 | 内容 |
|------|------|
| ID | `ASP-2026-06-02-010` |
| 类型 | GitHub资产库 |
| 来源链接 | https://github.com/dongshuyan/Awesome-Prompts |
| 来源类型 | GitHub dongshuyan/Awesome-Prompts |
| AI 自建 | 否 |
| 标签 | GitHub,提示词,防幻觉,写作,角色扮演,元提示词,Skill合集 |
| 评分 | 21/25（实用性5/新鲜度4/可复用性4/自媒体价值4/变现潜力4） |
| 版权 | GitHub开源，各Prompt许可可能不同，商业使用建议逐一确认 |

**概述**：686 Stars的中文友好提示词收藏库。七大分类：实用工具/越狱破限/角色扮演/写作辅助/元提示词（Prompt加工厂）+ OpenClaw 5000+技能合集+53个Agent模板。亮点：防幻觉系列Prompt（强制AI搜索验证再回答）、AI内容转人写工具、项目优化三步流程。

**原始 Prompt / 核心内容**：
```
GitHub: https://github.com/dongshuyan/Awesome-Prompts | 686 Stars, 73 Forks. Categories: 实用工具/越狱破限/角色扮演/写作辅助/元提示词/NSFW/Skills(5000+ OpenClaw)/Agents(53个生产级Agent模板)。核心亮点：提示词增强(防幻觉)—强制AI搜索验证再回答，提供完整版/中档版/精简版三档。
```

**中文可执行版**：
> GitHub仓库：https://github.com/dongshuyan/Awesome-Prompts | 686 Star，73 Fork。七大实用分类+5000+技能合集+53个Agent模板。特别推荐：提示词增强Prompt（防幻觉系列）——强制AI先搜索验证再回答，分完整版/中档版/精简版按需选用。

**文轩可用版**：
> 文轩用AI写公众号最怕的就是编数据。这个库的'防幻觉Prompt'直接强制AI先搜索再回答，所有输出可溯源。做AI测评内容时把这个Skill挂在前面，每句话都有出处，读者信任度直接拉满。而且库里的'AI内容转人写'Prompt可以把AI味浓的文章一键改得像真人写的——做公众号必备。

**适用场景**：内容创作防幻觉 / AI文本'人写化'处理 / 批量Prompt灵感获取

**今日怎么用**：克隆仓库，重点看'提示词增强prompt/'目录下的防幻觉Prompt，测试一次对比普通提问的输出差异。

**可沉淀资产**：防幻觉Prompt可集成到个人写作工作流

**Prompt/Skill 商店潜力**：高 — 防幻觉+人写化两个细分方向都有市场

---

## 三、今日最值得实操资产

**🏆 prompts.chat — 全球最大开源AI提示词库（161K Stars）**（24/25）

**理由**：GitHub 161K Stars的全球最大开源AI提示词库。4000+即用Prompt模板覆盖全场景，支持ChatGPT/Claude/Gemini，含CSV/Markdown导出、25章免费教程、CLI工具和MCP服务器。被Forbes报道、哈佛和哥伦比亚大学课程引用、40+学术论文引用。CC0许可证=完全自由商用。

**今日行动**：Clone仓库或访问prompts.chat，随机浏览3个分类，挑1条Prompt实际测试并记录效果。

---

## 四、今日图像 Prompt 专区

### 小红书插画风封面图Prompt（MJ v6.6调参版）
- 来源：https://m.php.cn/faq/2515449.html
- 核心公式：小红书爆款封面的核心不是'插画风'标签，而是线条密度+色块分割+留白比例+人物姿态的可复现参数组合。关键动作：关闭MJ v6.6默认的写实光影和景深（加flat lighting、2D composition），为标题文字预留30%安全区，用--stylize 500保持手绘抖动感。...
- 今日实操：今天就跑一次，替换Prompt中的人物和设备描述为你今天要发的内容主题，生成5张封面备选。

### 通用高点击率AI缩略图Prompt（全平台适配）
- 来源：https://www.topfreeprompts.com/resources/best-ai-thumbnail-prompts-(2026)-top-free-prompts-for-viral-youtube-tiktok-social-media-thumbnails
- 核心公式：2026年AI缩略图Prompt的核心公式：平台风格+情绪表情+光线方向+构图布局+对比度+背景简洁度+文字区位置。区别于泛泛的'make a thumbnail'，这个模板强制定义所有视觉锚点，CTR比通用提示词高出一档。...
- 今日实操：你今天如果要发任何视频内容，用这个Prompt生成3张封面，对比你之前用的封面CTR。

---

## 五、今日 GitHub 资产库专区

### prompts.chat — 全球最大开源AI提示词库（161K Stars）
- 仓库：[https://github.com/f/prompts.chat](https://github.com/f/prompts.chat)
- GitHub 161K Stars的全球最大开源AI提示词库。4000+即用Prompt模板覆盖全场景，支持ChatGPT/Claude/Gemini，含CSV/Markdown导出、25章免费教程、CLI工具和MCP服务器。被Forbes报道、哈佛和哥伦比亚大学课程引用、40+学术论文引用。CC0许可证=完全自由商用。...
- 许可：CC0 (Public Domain)，完全自由使用，包括商用，无需署名

### Awesome-Prompts — 防幻觉+元提示词+写作辅助七合一提示词库
- 仓库：[https://github.com/dongshuyan/Awesome-Prompts](https://github.com/dongshuyan/Awesome-Prompts)
- 686 Stars的中文友好提示词收藏库。七大分类：实用工具/越狱破限/角色扮演/写作辅助/元提示词（Prompt加工厂）+ OpenClaw 5000+技能合集+53个Agent模板。亮点：防幻觉系列Prompt（强制AI搜索验证再回答）、AI内容转人写工具、项目优化三步流程。...
- 许可：GitHub开源，各Prompt许可可能不同，商业使用建议逐一确认

---

## 六、今日不要收录清单

| 1 | Chromium AI Coding开发体系 | 纯Agent/AI Coding教程，不符合收录范围 |
| 2 | 扮演专家Prompt升级指南（泛泛版） | 仅一句话Prompt，无结构化Skill模板 |
| 3 | 10000 Prompts Pack | 噱头打包，无法30分钟验证单条价值 |
| 4 | AI Skills Manager桌面工具 | 复杂部署，非Prompt/Skill资产本身 |
| 5 | 国内低质媒体搬运的Midjourney入门教程 | CSDN/百家号来源，信息已被多次搬运失真 |

---

## 七、明日搜索关键词建议

1. `GitHub trending prompt engineering tools June 2026`
2. `Reddit r/ClaudeAI best system prompt 2026`
3. `Civitai trending character design prompt`
4. `公众号爆款标题公式 AI prompt`
5. `AI cold email outreach prompt template`
6. `Midjourney personal brand photography prompt`
7. `FlowGPT top business strategy prompt`
8. `SEO GEO改写 AI prompt 2026`
9. `AI course outline generator prompt framework`
10. `小红书文案批量生成 prompt`

---

*本报告由 AI 资产雷达定时任务于 2026-06-02 自动生成。所有资产均来自公开信源，每条标注来源链接与许可提示。AI 自建资产 0 条。*
