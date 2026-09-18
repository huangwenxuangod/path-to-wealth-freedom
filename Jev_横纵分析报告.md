# Jev：第一个「系统一模型」——把 AI 从对话伙伴改造成软件原语

> 研究时间：2026-09-18 ｜ 所属领域：AI 模型 / 自动化基础设施 ｜ 研究对象类型：前沿 AI 模型（产品）+ System One Models（新品类概念）
> 研究对象：Jev，TypeSafe AI 于 2026-09-15 发布的「System One Model」

---

## 目录

一、一句话定义
二、纵向分析：从 InstructGPT 到 Jev——一个 RLHF 参与者的「叛逃」
三、横向分析：Jev 站在什么样的坐标系里
四、横纵交汇洞察：历史如何塑造位置，以及三个剧本
五、信息来源

---

## 一、一句话定义

**Jev 是一个不写任何文字、只输出「带校准概率的类型化决策」的前沿模型。它放弃了自回归文本生成，改用并行采样一次性吐出结构化判断（选 A 还是 B、打几分、这件事发生的概率多大），把成本打到每百万输入 token 4.2 美分、输出免费，延迟压到 70–500 毫秒——本质上，它是一个给软件直接调用的「前沿级函数调用」，而不是给人类读的聊天框。**

它的野心不在「更聪明的对话」，而在「把智能塞进那些此前因为太贵太慢而不值得调用一次 AI 的角落」。这套世界观，值得用横纵两条轴拆开看。

---

## 二、纵向分析：从 InstructGPT 到 Jev——一个 RLHF 参与者的「叛逃」

要理解 Jev，得先理解它的作者。这不是又一个从零起步的创业故事，而是一个亲手参与过 ChatGPT 诞生的人，回过头来否定自己当年铺下的路。

### 2.1 起源：一个站在 RLHF 源头的人

Diogo Almeida 的履历像一条精心排布的证据链。RPI 本科、佐治亚理工硕士，做过医疗 AI（Enlitic），待过 Google Brain（2021 年发表 learned optimizers 论文），2020 年加入 OpenAI，2024 年 1 月离开。

关键证据在 2022 年 3 月那篇改变行业的论文——《Training language models to follow instructions with human feedback》（InstructGPT，arXiv:2203.02155）。作者顺序里，Long Ouyang 打头，Diogo Almeida 排第四。正是这篇论文确立了 SFT → 奖励模型 → PPO 的三段式 RLHF 流水线，把 GPT-3 对齐到了人类意图，而它后来成了 ChatGPT 的直接前身。Almeida 还是 GPT-4 技术报告的合著者。

TypeSafe 的官方文档至今写着「RLHF 由 Diogo Almeida 共同发明」。这句话后来惹了争议——独立核查指出，RLHF 本身由 Christiano、Leike、Amodei 等人在 2017 年提出，Almeida 更准确地说是「应用者」而非「发明者」（akitaonrails 的核查）。但无论头衔怎么措辞，有一点是确定的：他是极少数既「亲手证明了 RLHF 有效」、又「最尖锐地批评 RLHF」的人。批评来自内部亲历者，不是外部旁观者，这赋予了这份批评特殊的可信度。

### 2.2 那个驱动了他四年的问题

Jev 发布博客的第一句话，是整条故事线的锚：

> 「Models have been superhuman at chat for years, so where is all the automation?」（模型在聊天上已经超人多年了，那自动化到底在哪？）

这句话的时间坐标是 2022→2026。从 InstructGPT 到创业，Almeida 想了四年。他的判断是：我们造出了会聊天的模型，但绝大多数商业价值不在「聊天」，而在「让软件自动做决定」。而现有的 LLM 因为被优化成「像人一样说话」，反而没法被软件可靠地消费——它们会跑偏、会编造、会在该坦诚说「我不知道」时表现得过度自信。

他在多次访谈里把话挑明：「为什么所有 LLM 都需要人在回路里？简单的答案是——我们 literally 把它们放进了回路里。」「过度承诺（overpromising）是设计使然。从构造上，每个 RLHF 模型都会在置信度和正确率之间留下巨大落差……不管模型错得多离谱，它们看起来都对。」（FrontierNews、ExplainX 访谈）

这不是空谈。这是一个亲手搭过那套机制的人，指出的机制性缺陷。

### 2.3 两年隐身：TypeSafe 的诞生

2024 年，Almeida 离开 OpenAI，同月在旧金山创立 TypeSafe AI。GitHub 组织最早的仓库创建于 2024 年 5 月，DCVC 的投资组合页显示对其首次投资在 2025 年——和「2024 成立、隐身约两年」的叙事吻合。

为什么成立即隐身、两年不发声？因为它要重写的不是 prompt，而是底层：新模型架构、新的并行采样器、新的训练方法（RLCD）、新的软件栈。这类范式创新需要闭门把原形验证出来，而不是边做边秀。2026 年 9 月 15 日，它带着 **4000 万美元种子轮（DCVC 领投）** 出 stealth，同时放出 Jev 的 early access。Forbes 援引知情人士称估值约 2 亿美元——但这是二级来源，非官方披露。

团队也耐人寻味：CTO Erik Gafni 来自基因组学公司 Ravel/Invitae/Freenome；COO Sasha Sheng 是前 Meta/FAIR 研究工程师，且早在 2016 年就和 Almeida 合写过 ResNet-in-ResNet 论文。这是一支「基础研究 + 对齐后训练 + 生物多模态」混编的班底，而不是应用层拼装队。公司的信条写得锋利：「Build Prod, Not God」（造产品，不造神），核心概念叫「Machine Native Intelligence」——机器原生智能，具备结构、可靠、可观测、可测试、快速、一致、低成本这些「软件式属性」。

### 2.4 概念锻造：把 Kahneman 的 System 1 重新定义

「System One Models」这个名字，来自 Daniel Kahneman 的《思考，快与慢》。原典里 System 1 是快、直觉、自动、不费力的思考（认脸、懂一句话），System 2 是慢、深思、费力的逻辑思考。传统上 System 1 还意味着「容易出错」。

TypeSafe 做了一件大胆的概念挪用：把 System One Models 重新定义为「一类为自动化而生、快速、结构化、软件可直接消费的决策模型」。他们自己承认 System 1 历来有「易错」的包袱，但声称「出于我们日后会解释的原因，我们相信 System One Models 能做得比替代方案更可靠」。

它凭什么更可靠？TypeSafe 给了四条逻辑：
1. **输出被预先定义（type-safe）**：可能的结果和结构事先写进 schema，模型永远不会犯类型错误，也不会跑偏。
2. **校准的信心**：每个输出都带校准过的概率——高置信度≈高准确率，软件据此决定「自动执行还是升级人工」。
3. **并行采样**：所有问题一次并行得出，避免自回归逐 token 累积的不确定性。
4. **代码约束其自由**：结构化输出作为「模糊决策规则」嵌进普通软件，代码的确定性弥补模型的不确定，比让 LLM 自由发挥更容易拼成可靠系统。

传统 System 1 易错，是因为「直觉无约束」。TypeSafe 的 System One 用「类型约束 + 校准概率 + 代码外包」把直觉改造成了「可靠的原语」。这个转向，是整篇故事里最值得玩味的一笔。

### 2.5 RLCD：为「校准决策」而生的新算法

Jev 的训练方法叫 **RLCD（Reinforcement Learning for Calibrated Decisions，校准决策强化学习）**。把它和两条前辈放在一起，差异一目了然：

| 方法 | 优化目标 | 代表 |
|---|---|---|
| RLHF | 人类偏好：人更喜欢哪种写法/回复 | InstructGPT、ChatGPT |
| RLVR | 可验证奖励：能程序化验证的输出（如数学证明） | 推理模型 |
| **RLCD** | **校准决策：在 System One 任务上输出「认知诚实的概率」** | **Jev** |

RLHF 的问题，Almeida 看得很透：它奖励谄媚（sycophancy）和「听起来有把握的幻觉」，并且通过 mode dropping 压低了其他可能输出；它把「可见的不确定性」惩罚得比「自信的错误」更重，于是鼓励过度自信。

RLCD 不同。它不生成文字，只返回「决策 + 概率」，并且要求「更高的概率对应更高的正确率」。所谓校准，直观定义是：一个良好校准的模型，给出 0.2 概率的预测应约 20% 发生，0.8 的约 80% 发生，1.0 的 100% 发生。这是对「预测群体」的统计性质，不等于对单条答案的保证——但这一点，已经足够让软件可靠地决定「何时相信 AI」。

需要诚实标注的空白：截至 2026-09-16，arXiv 上**没有** RLCD 的对应论文，奖励函数、网络架构、校准指标都未公开。一个开发者用 Qwen2.5-1B 做了一份自称「RLCD」的开源复刻，但那只能证明「接口可复刻」，证明不了 TypeSafe 私有的训练方法。

### 2.6 命名：Jevons 悖论里的世界观

Jev 这个名字，来自 William Stanley Jevons——19 世纪英国经济学家，边际效用理论先驱。更关键的是他 1865 年的著作《煤炭问题》（The Coal Question）里提出的「杰文斯悖论」：瓦特改良蒸汽机大幅提高了煤炭利用效率，但英国煤炭总消耗反而飙升——因为效率提升降低了单位产出的有效成本，刺激了更广泛的需求。

Almeida 的世界观就藏在这句话里：「我们预期机器智能会走一条和煤炭相似的路。智能成本每降一个数量级，解锁的用例就多一个数量级。」他更激进地写过：「据我所知，这是通往 AI 经济革命的最短路径。」以及那句被反复引用的：「绝大多数智能，最终应该活在被忽视地运行于软件内部的形态里。」

这是整条纵向故事线的终点，也是它和所有「更大更强聊天模型」叙事的根本分岔：不是让模型更会聊天，而是让模型便宜到可以被埋进软件的每个缝隙。

### 2.7 发布节奏：势能管理与风险自控

出 stealth 之前，Almeida 已经埋下伏笔：2026-09-10/11 连发两篇 essay《The Bitterest Lesson》和《Lies, Damned Lies, and Benchmarks》，后者直接主张公开评测会被「benchmaxx」反向优化，要用「即发即弃的日期化快照」替代排行榜——这本身就是对传统评测共识的一记耳光，也是后来社区争议的延伸。

发布当天开放 early access，从 waitlist 滚动放量。这套打法既制造了发布势能（发布推文公开可证实数约 420 万浏览、近 2 万赞，而非某些中文稿所称的 1880 万），又以 early access 控制了算力与口碑风险，符合「前沿实验室 + 重基础设施」的打法。值得注意的是，它在发布前就开源了 `system-one-adapter-python`（2026-08-08，MIT）和 SDK（2026-09-04），把「如何把 LLM 套成结构化决策」的接口先交了出去——这既是生态铺垫，也是一种「不怕你对比」的姿态。

---

## 三、横向分析：Jev 站在什么样的坐标系里

把 Jev 单独拎出来看，容易误判成「又一个模型」。放到坐标系里，它其实站在一个新品类的起点上——它和 LLM 不是同一平面上的竞品，而是工作流里不同的一级。

### 3.1 直接的 LLM 对照：差距是数量级的，但口径要对等

| 维度 | 传统前沿 LLM | Jev / System One |
|---|---|---|
| 架构 | 自回归、逐 token | 新架构 + 并行采样器，单次查询出全部输出 |
| 输出 | 字符串 / 自由文本 | 类型安全结构化值（schema 预定义） |
| 端到端速度 | 3–329 秒（外部基准） | 70–500 毫秒 |
| 输入价 | $0.20–10 / 百万 token | $0.042 / 百万 token |
| 输出价 | 约输入的 5 倍 | 免费（"too cheap to meter"） |
| 置信度 | 即便要求也给得过度自信、不一致 | 每次输出带校准概率 + 置信度 |
| 类型错误/幻觉 | 仍会发生 | 厂商称「永远不产生类型错误」（schema 保证） |

把具体竞品的价格摆上桌（均为各自官方定价）：GPT-6 Astra $10/$50 每百万 token、Claude Fable 5.1 $10/$50、GPT-5.6 Sol $4/$20、Opus 5 $5/$25、Sonnet 5 $2/$10、Haiku 4.5 $1/$5、DeepSeek V4 Pro $0.435/$0.87、Flash $0.14/$0.28。Jev 的 $0.042 输入价比最便宜的 Haiku（$1）还低约 24 倍，比旗舰（$10）低约 238 倍（TypeSafe 主页原话「比 Claude Fable 5.1 输入价低 238 倍」）。

但这里必须补一句公道话：**「零幻觉 / 零类型错误」是构造性、非经验性的保证**。因为 Jev 根本不生成字符串，整个输出空间由 schema 限定，所以「编造字段 / 非法类型」在数学上不可能发生。The Register 的批评一针见血：这「其实不算公平对比，因为它输出的不是自然语言」，而且「并不排除它 confidently wrong（自信地选错）的可能」。Diogo 本人在 HN 也亲口承认了这一点。所以「零幻觉」应读作「零格式 / 类型幻觉」，而非「零错误」。

速度上，40–200 倍的优势也常被质疑是「拿苹果比橘子」——一个不生成的模型，和一个做完整生成的 LLM 比端到端耗时，口径本就不对等。TypeSafe 自己也承认，这些数字多为西海岸笔记本跑出来的、且「无法证明定价未被补贴」。

### 3.2 自家的对照镜：System One LLM adapter

TypeSafe 开源的 `system-one-adapter-python`（MIT）是个绝妙的「对照组」：它是一个 drop-in 替换，把 OpenAI / Anthropic 等普通 LLM 套成 System One 的结构化决策接口。它证明了一件事——**同一个决策任务，用 LLM + 结构化约束也能做，但要付出代价**。TypeSafe 自己承认，竞品经此 wrapper 后「tends to be slower and more expensive than giving decisions without probabilities」。

这反而衬托出 Jev 的设计优势：概率和置信度是模型原生产出，而不是在 LLM 之上套一层「解析 + 归一化 + 重试」的工程补丁。adapter 的存在，让「LLM 能不能做决策」不再是个问题，真正的问题是「谁在做决策这件事上更便宜、更快、更校准」。

### 3.3 为什么这个品类此前是空白

Jev 是首个把「放弃文本生成、只输出带校准概率的类型化决策」做成前沿级产品的模型类。在它之前，相关能力分散在几条既有赛道，但没人把它们合并成一个独立品类：

- **结构化输出 / JSON mode / function calling**：OpenAI strict mode、Anthropic tool use 等——仍是 LLM 生成字符串，只是约束到 schema，不原生给校准概率。可靠性阶梯大致是 JSON mode ~95% → function calling ~98% → structured outputs ~99.9% → 约束解码 100%（但需访问 logits、自托管）。
- **约束解码 / guided generation**：Outlines、Guidance、vLLM/SGLang 等——按构造 100% schema 合规，但需自托管、可能压低生成质量。
- **微调小分类器**：DistilBERT / Phi-3 等——便宜（50–100ms、单 call 几分之一美分）但不具前沿智能，无原生校准概率。
- **嵌入近邻路由、ML 打分/审核服务、重排模型**：都为软件消费而生，但窄领域、非通用。
- **学术决策模型**：如 EvaluatorDPT（arXiv:2605.27768），最接近 Jev 思想（有界 YES/NO/TBD + 习得式 defer + 校准），但仅学术、小体量。

为什么是空白？几条支撑事实：大厂的训练目标一直是 chat / 通用智能 / AGI 基准（RLHF→RLVR），「为软件消费优化决策接口」不在路线图；校准研究长期存在却从未成为前沿模型的训练目标；RLCD 在 arXiv 上无论文；推理基础设施（vLLM 等）都是为自回归生成建的，**并行采样器需要全新 serving 栈**——这是工程门槛而非算法门槛。Jevons 悖论式的赌注在于：只有当成本降几个数量级、让此前不经济的自动化场景变得可行，这个品类才有商业意义。

### 3.4 workflow evals：用「共识」替代「真理」的方法论

TypeSafe 造了一套新评测：把真实任务分解成代码化的 workflow（安全事件、Agent 轨迹可观测、发票处理、客服），每步是独立的窄问题，能用代码做的交给代码，只把「智能判断」丢给模型。参考标签 = **GPT-6 Astra 与 Claude Fable 5.1 在高思考档下回答每个问题的均值**，作为「共识概率」。

四个工作流等权平均的官方数字：

| 模型 | 一致率 | 单 case 成本 | 单 case 耗时 |
|---|---|---|---|
| **Jev** | **67.8%** | **$0.0004** | **0.4s** |
| GPT-5.6 Sol | 74.1% | $0.0836 | 23.3s |
| Claude Opus 5 | 73.1% | $0.1761 | 37.8s |
| Claude Sonnet 5 | 67.8% | $0.1174 | 78.1s |

关键洞察：**Jev 不是最准的，它成立的是「成本-延迟 Pareto 前沿」**。Sonnet 5 和它准确率相同（67.8%）但慢约 195 倍、贵约 293 倍。而在发票处理上，Jev 61.8% vs Opus 5 的 78.4% / Sol 的 79.1%，差了约 17 个百分点——这恰恰暴露了「放弃文本」的代价：在需要细读长文档、抽取精确字段的任务上，Jev 会吃瘪。

这套方法论的根本缺陷也很清楚：**「与最强外部模型一致」≠「正确」**。TypeSafe 自己承认参考集偏向 OpenAI+Anthropic 两家（「可能低估了 ours 和 DeepSeek 的相对表现」），工作流由自家团队编写，竞品还是经自家 adapter 跑的（会更慢更贵）。The Rundown AI 的批评很直接：它「只给了 Jev 是否做对决策的部分视角」，「负载下的响应时间和持续定价仍是开放问题」。一句话概括：传统 benchmark 问「答案对不对」（有固定金标准但易被 harness 过拟合），workflow eval 问「在分解后的软件工作流里，它能否以极低成本与最聪明模型的决策保持一致」（生态效度高，但用共识替代了真理）。两者衡量的是不同东西，不能互相替代。

### 3.5 场景边界：Jev 碾压什么，LLM 仍不可替代什么

**Jev 碾压的场景**：高频结构化决策（分类、路由、打分、字段抽取——工单分派、风控初筛、内容审核、发票付款判定）；实时 / 亚秒级（Doom bot 约 10 次查询/秒、约 $7/小时；UI 实时过滤）；map-reduce 大数据（把 PB 级数据转成特征/洞察）；验证/护栏（给 LLM 的 prompt、推理链、输出做打分/裁判/越狱检测——「Verify everything」）；Agent 决策守门人（在 LLM Agent 动作前用 Jev 过一道，比再调一次 LLM 便宜/快约两个数量级）。

**LLM 仍不可替代**：长文生成（邮件、摘要、报告、代码生成）；复杂推理链 / 多步规划（数学证明、长程软件工程）；开放创作 / 解释（需要给用户看一段自然语言、需要解释「为什么」）。TypeSafe 自己划的边界也很诚实：不支持图像输入（截至发布日）、不解释、不做推理链、边界模糊场景仍需人工。

一句话定位：**Jev 不是「更便宜的 LLM」，而是工作流里不同的一级**——它排在生成 call 的前或后，与 LLM 是互补/串联，而非替代。这正是 2026 年「classification-first / 路由到正确模型」架构的主流范式。

---

## 四、横纵交汇洞察：历史如何塑造位置，以及三个剧本

### 4.1 历史如何塑造了今天的竞争位置

把纵向和横向叠在一起看，Jev 的每一个优势，都能追溯到 Almeida 的一段亲身经历。他参与过 RLHF 的建造，所以比任何外部批评者都更清楚「人类偏好优化」会系统性地制造过度自信——这个内部视角，直接催生了 RLCD 的设计动机。他离开 OpenAI 时，行业正处在「越长越好、越会聊越牛」的军备竞赛里，而他把赌注压在了反方向：**少生成、多决策、极致便宜**。

Jev 的并行采样架构、type-safe 输出、校准概率，不是凭空来的工程炫技，而是对「LLM 为什么不能被软件可靠消费」这一具体痛点的逐条回应。它今天站在「成本-延迟 Pareto 前沿」上，根子上是 2024 年那个「隐身两年、重写底层栈」的决定——比起在 LLM 上加 prompt 补丁，它选了更难但更干净的路。

### 4.2 竞品的纵向对比：路径不同，形态不同

如果把主要竞品也拉到时间线上看，差异源于起源路径。GPT-6 Astra、Claude Fable 5.1 们沿着「scaling + RLHF/RLVR + 更长上下文 + 更强推理」演进，目标是通用智能与 AGI 基准，决策能力是「顺带」长出来的，且被锁死在自回归生成范式里。DeepSeek V4 走开源 + 极致性价比路线，但仍在同一平面。Jev 的路径是断裂式的：它主动舍弃了生成能力，换取一个 LLM 靠 prompt 永远拿不到的速度/成本/校准组合。

这正是 TypeSafe 敢说「193.6x 更快、444.6x 更便宜」的底气来源——但也是争议来源：它比的是「不同曲线的端点」，而非同一曲线上的邻点。

### 4.3 优势与劣势的历史根源

**优势根源**：① Almeida 的一手 RLHF 经历 → RLCD 的动机纯粹；② 隐身两年重写架构 → 并行采样器这一工程壁垒（非算法壁垒）让后来者难以快速跟进；③ Jevons 悖论世界观 → 先赌「成本降数量级解锁用例」，再回头用 early access 滚动验证需求，节奏克制。

**劣势根源**：① 放弃生成 → 在长文档抽取、复杂推理上天然吃亏（发票处理 61.8% 即是证据），这是「好决策」的反面包袱；② RLCD 细节未公开、无论文 → 学术与工程界无法复现核心，信任只能靠厂商自证；③ 「零幻觉」的表述擦边 → 一旦被证「自信地选错」，舆论反噬会格外猛；④ 评测自评、参考集偏向对手模型 → 即便数字真实，也难逃「自证闭环」的观感。

### 4.4 三个剧本

**最可能的剧本（基线）**：Jev 在「高频结构化决策」这一庞大但被忽视的细分里站稳，成为 Agent 工作流里的「守门人 / 路由器 / 打分器」标配，被 Vercel、LangChain 这类基础设施集成，悄悄活进无数后台。它不会取代 LLM，但会吃掉 LLM 调用量里「其实只是做个判断」的那一大块。价格随规模下降，4000 万种子撑过早期。这是 Almeida 押注的「智能活进软件缝隙」。

**最危险的剧本（崩盘）**：两项未证假设同时落空——输出免费靠补贴不可持续，且负载下延迟/准确率崩坏；加上「自信选错」的真实事故被放大，社区从「质疑」翻转为「欺诈」叙事（参考 HN 上「不公开基准 = 心虚」「两小时 Qwen 复刻」的论调）。若竞品（尤其 DeepSeek 这类低价前沿模型）把结构化决策做成原生能力，Jev 的「品类唯一性」窗口会迅速关闭。

**最乐观的剧本（范式转移）**：RLCD 被证明是「校准决策」的有效新范式，TypeSafe 开源论文后引发跟随；「System One Models」成为继 LLM 之后的第二模型品类，前端用 LLM 生成与推理、后端用 System One 做毫秒级决策，构成新一代 AI 应用的默认双核。Jevons 悖论应验：智能单价降两个数量级，用例数量涨两个数量级，AI 自动化从 demo 走向流水线。Almeida 那句「通往 AI 经济革命的最短路径」，届时会被反复引用。

### 4.5 一个收尾的回环

回到开头的那个问题——「模型在聊天上已经超人多年了，自动化在哪？」Jev 给出的答案不是「造一个更会聊的模型」，而是「造一个闭嘴的模型」。它把 Kahneman 的 System 1 从「快但易错」改写成了「快且被约束」；它用 Jevons 悖论赌一个成本驱动的需求爆发。成与不成，横纵两条轴已经把它的位置画得很清楚：它不在 LLM 的战场上，它在 LLM 战场旁边的那片「软件原生智能」的空地上。空地上现在只有它一个，但这恰恰是最值得盯的信号——空地不会一直空着。

---

## 五、信息来源

**一手（官方）**
- TypeSafe 发布博客：https://typesafe.ai/blog/introducing-system-one-models-and-jev
- 官方文档 / 三种原语与 RLCD：https://docs.typesafe.ai/introduction 、https://docs.typesafe.ai/introduction/machine-learning-primer 、https://docs.typesafe.ai/concepts/system-one
- Business Wire 公告（2026-09-15）：https://www.businesswire.com/news/home/20260915525333/en/
- Workflow Evals 站：https://evals.typesafe.ai/
- GitHub 组织：https://github.com/typesafe-ai （含 system-one-adapter-python、typesafe-sdk-python/js）
- Diogo Almeida 个人站（批判 Scaling Law / RLHF 长文）：https://completeskeptic.com

**学术（一手）**
- InstructGPT（Almeida 为第四作者）：https://arxiv.org/abs/2203.02155
- GPT-4 Technical Report：https://arxiv.org/abs/2303.08774
- Learned Optimizers（Google Brain 时期）：https://arxiv.org/abs/2106.00958
- 学术决策模型 EvaluatorDPT：https://arxiv.org/pdf/2605.27768

**权威二手 / 媒体**
- The Register（「零幻觉」批评）：https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711
- SiliconANGLE：https://siliconangle.com/2026/09/16/typesafe-ai-exits-stealth-with-40m-to-build-ai-for-use-by-software/
- StartupHub：https://www.startuphub.ai/ai-news/artificial-intelligence/2026/typesafe-jev-model-kills-chat
- AI Insiders：https://aiinsiders.net/article/typesafe-launches-jev-a-model-built-to-decide-not-to-talk
- Nexforce：https://nexforce.ai/en/blog/typesafe-jev-calibrated-decisions-llm-routing
- ExplainX 人物深访：https://www.explainx.ai/blog/diogo-almeida-typesafe-ai-rlhf-detour-profile-2026
- FrontierNews：https://www.frontiernews.ai/news/article/the-man-who-built-rlhf-now-says-ai-took-a-wrong-tu-1aaa100a
- 36氪（中文）：https://36kr.com/p/3988164509711361
- Vercel AI Gateway 集成：https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway
- 开源复刻 OpenJev / jevlike：AGI Hunt（https://agihunt.info/en/p/1a0afbbafbbaa107d9c6b765bc5 ）、deniz.in
- Jevons 悖论：https://www.wikiwand.com/en/Jevons_paradox

**方法论说明**：本报告采用「横纵分析法」（由数字生命卡兹克提出），纵轴追踪研究对象从起源到当下的完整生命历程，横轴在当下时间截面与竞品/同类做系统性对比，最后交叉两条轴产出判断。所有关键事实均标注来源；厂商自报且官方已声明含偏差的速度/成本倍数，已逐条标明「待独立验证」，未做编造。
