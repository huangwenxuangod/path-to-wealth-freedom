# Meta Muse Spark 1.3 横纵分析报告

> 研究时间：2026-09-09 ｜ 所属领域：前沿大模型 / Agent ｜ 研究对象类型：产品（闭源推理与编程模型）
> 方法论：横纵分析法（Horizontal-Vertical Analysis）｜ 核心问题：它到底强在哪，以及这个「强」能保质多久

## 一、一句话定义

**Muse Spark 1.3 是 Meta Superintelligence Labs 于 2026 年 9 月 2 日发布的旗舰推理与编程模型，1M 上下文，标准价 $1.25/$4.25（每百万 token），是 Meta 第一个「前沿级」闭源模型——这家公司曾用 Llama 定义开源大模型时代。它真正的强项只有一个无法被替代的点：把 100 万 token 一次性塞进去还能可靠捞回来（MRCR 512K–1M 段 98.1，对比 GPT-5.6 Sol 的 73.8）。而它最值得记住的一件事是：发布当天 Artificial Analysis 给它的分数是 61/62，标题写着「Meta 抵达前沿」；七天后同一家机构换了评测标准，它变成了 48/45。**

先说一个能贯穿整篇的细节。

2023 年 2 月 24 日，Meta 发布 Llama 1，采用非商业研究许可、逐个申请授予。申请闸门一周内就被 4chan 的 BitTorrent 链接冲垮，权重扩散到全世界，催生了 Stanford Alpaca 和此后一整代衍生模型。**那次泄露实质上替 Meta 做了决定：开源不再是一种发布方式，而成了一个生态事实。**

三年半后，2026 年 9 月 2 日，Meta 发布 Muse Spark 1.3，闭源，不可自托管，不可微调。

从「被泄露」到「锁进保险箱」，中间发生了什么，以及这次锁门值不值——这是本篇要回答的问题。

---

## 二、纵向分析：从 Llama 到 Muse，一个开源旗手如何关上了门

### 2.1 起点：一个从第一天起就可以调节的承诺

**Llama 1（2023-02-24）**：7B/13B/33B/65B，上下文 2,048，65B 训练 1.4T tokens。许可保守，但被泄露改写了结局。

**Llama 2（2023-07-18）**：7B/13B/70B，2T tokens，70B 用 grouped-query attention。关键的一次选择在这里——**Meta 用的是 Llama 2 Community License，允许商用，但不是 Apache/MIT**。它保留了 7 亿月活的商用门槛和一套可接受使用政策。

这是全文最关键的一次「细微」选择。**Meta 拿到了开源的全部生态与舆论收益，却保留了一条可以随时调节的闸门。开源从此是 Meta 可以定价的资产，而不是一条不可退让的原则。**

**Llama 3 / 3.1（2024-04-18 / 07-23）**：3 系列训练超 15T tokens，**3.1 的 405B dense 是当时最大的可公开下载模型**。这是 Meta 声望的顶点——「最强开源模型」第一次在能力上真的逼近闭源前沿。

同期 Zuckerberg 在公开信里写下：**「从明年开始，我们预计未来的 Llama 模型将成为业内最先进的模型。」**

这句话后来成了绞索。**它把「开源」和「最强」绑定成一个单一承诺。一旦 Meta 做不到最强，开源就同时失去战略理由和面子理由。**

### 2.2 崩塌：Llama 4 与那次 bait-and-switch

2025 年 4 月 5 日，Meta 发布 Llama 4 Scout（109B 总参/17B 激活）与 Maverick（约 400B 总参/17B 激活，128 专家），转向 MoE 与原生多模态，训练超 30T tokens。**Behemoth（288B 激活、近 2T 总参）只被「预览」，描述为「仍在训练」，从未发布，Meta 也未发过正式取消声明。**

争议核心是这件事：Meta 提交到 LMArena 的版本标注为 **`Llama-4-Maverick-03-26-Experimental`**，是一个未公开发布的实验性聊天变体，ELO 一度冲到 1417、榜二。开发者实测公开权重版本后体验明显不符。外界称之为 bait-and-switch（诱饵换包）。

GenAI VP Ahmad Al-Dahle 在 4 月 7 日否认在测试集上训练：「that's simply not true and we would never do that」。但 2026 年 1 月，LeCun 离职后对《Financial Times》承认：Meta 研究人员 **「fudged a little bit」**——把不同 Llama 4 变体在不同 benchmark 上的成绩放在一起呈现。

后果：Simon Willison 记录了 20,000-token Scout 退化成重复垃圾输出；社区发现声称的 10M 上下文实际远低；Llama 4 在 WebDev Arena 排到第 40 名，Llama 3.1-405B 第 52 名。原始 Llama 团队 14 名博士，已走了 11 人。

**这里有一个对后面影响巨大的解读错位。** Llama 4 的真实问题不是「开源导致落后」，而是「组织为了追 DeepSeek 的推理能力中途改道，多模态与推理两头都没做好，最后用特调版本掩盖」。但 Zuckerberg 把它判定为**交付能力崩塌**，而不是**开源理念错误**。

**于是他去换人、换组织。而保密型组织，天生产闭源。**

### 2.3 重建：143 亿、MSL，与一个物理隔离的实验室

2025 年 6 月，Meta 以约 **143 亿美元**取得 **Scale AI 约 49% 股份**（估值超 290 亿美元），结构是非控制性少数股权投资——多家报道指出这有规避反垄断审查的考量。Scale AI 联合创始人 **Alexandr Wang** 卸任 CEO 加入 Meta。

**2025-06-30**，Zuckerberg 发出内部备忘录成立 **Meta Superintelligence Labs（MSL）**，整合 FAIR、Llama 团队、产品团队与一个新的前沿模型实验室。Wang 出任 Meta 首位 Chief AI Officer；前 GitHub CEO **Nat Friedman** 负责 AI 产品与应用研究。备忘录称 Wang 是「the most impressive founder of his generation」，并点名了从 OpenAI、Anthropic、Google 挖来的 11 名研究员。

薪酬：Sam Altman 公开称 Meta 开出最高 **1 亿美元签字费**；Wired 报道过 1 亿美元单年、部分四年 3 亿美元的包裹。**Meta 未披露任何个人条款，这些数字属「报道过但未证实」级别。**

组织形态本身就是闭源机制，这一点值得展开：

- **TBD Lab**：Wang 直接领导，成员几乎全是高薪新招，办公地点在 **Zuckerberg 工位旁边**，需专用门禁，不用 Meta 内部 Workplace，口号是「Demo, don't memo」，据报道 70 小时工作周常态化。
- **2025-10-22**：MSL 裁员约 600 人，主要打击 FAIR、产品 AI、基础设施，**TBD Lab 毫发无伤且继续招人**。Wang 内部备忘录原话：「通过缩减团队规模，做决定所需的对话更少，每个人的承重更大、作用域和影响力更大。」被裁的包括 FAIR 研究科学家总监田渊栋及其团队。
- **2025 年 9 月起**：FAIR 对外发论文需先经 TBD Lab 额外审核；若判定「价值大」，论文会被**扣住不对外发表**，作者须帮助成果在 Meta 产品落地，目的是「减少外部分享、避免帮助竞争对手」。

**这一步是决定性的：封闭先从内部开始。一个连自己的研究论文都要先过保密审查的组织，不可能对外放权重。**

### 2.4 人的代价：LeCun 走了

**2025-11-19**，Yann LeCun 宣布将于年底离开 Meta，结束 12 年（5 年 FAIR 创始主任 + 7 年首席 AI 科学家）生涯，创办 **Advanced Machine Intelligence（AMI）Labs**，总部巴黎，方向是世界模型 / JEPA。

离职原因（综合 FT、Bloomberg、Reuters 转述）：被要求向 28 岁的 Wang 汇报；FAIR 被边缘化；基础研究经费难批；论文审核新规；以及长期路线分歧（他公开称 LLM 是「死路」）。他说 Meta 将成为新公司的合作伙伴，但 2025-12-04 在巴黎明确表示 **Meta 不会出资**。

Meta 未任命全公司层面的首席 AI 科学家继任者。**Shengjia Zhao**（前 OpenAI，ChatGPT 共同创造者之一）任 MSL 首席科学家，**Rob Fergus** 领导 FAIR。

### 2.5 决策成型与 Muse 家族

- **2025-07-30**，Zuckerberg 发表《Personal Superintelligence》公开信，首次写明：「超级智能将带来新的安全担忧……我们需要严谨地缓解这些风险，**并谨慎选择开源的内容**。」更早的活口：他在播客里说过「如果某天这个东西的能力发生质变，而我们觉得开源不负责任，那我们就不会开源」。
- **2025-09-09**，CNBC 报道 Meta 正在开发 Llama 继任者、代号 **Avocado**，并计划转为不公开权重的闭源模型。

**Muse 家族成员（截至 2026-09-09）：**

| 成员 | 类型 | 发布 | 权重 |
|---|---|---|---|
| **Muse Spark** | 原生多模态推理/agent 基座 | 1.0（4-08）、1.1（7-09）、1.2（8-05）、**1.3（9-02）** | **闭源** |
| Muse Image / Video | 图像 / 视频生成 | 2026-07-07（Video 仅预览） | 闭源 |
| **Muse Glimmer** | 端侧 30B，从 Spark 蒸馏 | 2026-08-10 | **开源 Apache 2.0** |
| Muse Code | 终端编程 agent | 2026-08-05 beta | 产品 |
| **Muse**（代号 Hatch） | 个人 AI 智能体，跑在专属云 VM 上 | 2026-09-08 | 闭源托管 |

**为什么弃用 Llama 改名 Muse？官方从未解释（暂缺），但三条可确证的事实支撑一种解读：**

1. **技术上没有继承关系。** Muse Spark 官方博客明说 MSL 花了**约 9 个月从零重建训练栈**（架构、优化、数据管线、RL 基础设施、评测、部署），并宣称新配方达到同等能力所需算力**比 Llama 4 Maverick 少一个数量级以上**。它不是 Llama 5，是另一条栈上的第一代。
2. **品牌上需要切割。**「Llama」已被 2025 年的刷榜争议污染，且它同时是「开源权重模型家族」的品牌；Muse 从一开始就是「个人超级智能产品家族」，一条品牌线覆盖闭源与开源两种授权。
3. **合规上更省事。** 把最新的东西放进一个没有开源承诺历史的新品牌，比在 Llama 名下「反悔」代价低得多。

**五个月四版为什么这么快？** 四个压力叠加：追赶焦虑（1.0 只有 AA 52，排第四，落后 5 分）；栈重建完成后的红利期（1.2 的训练数据甚至是 1.1 自己生成的——用 1.1 造难题、造评分标准，再训练 1.2，**自我改进循环一旦转起来，版本节奏会自我加速**）；产品倒排（Muse 助手 9-08 上线）；以及数据飞轮。

### 2.6 闭源这个决策：承诺的退化曲线

这是本篇最值得记录的一张表。

| 时间 | 表述 | 具体程度 |
|---|---|---|
| 2026-04-08 | Wang：「Bigger models are already in development **with plans to open-source future versions**」 | 无版本、无日期 |
| **2026-08-10** | Zuckerberg（X）：「**Soon we'll also release the weights for Muse Spark 1.2**, our latest foundation model」；另有报道版本为「In the coming weeks」 | **有版本（1.2）+ 有时间窗（几周）** |
| **2026-09-02** | 官方博客：「the **Muse Spark** open weights release」；Zuckerberg X：「Muse Spark open weights releases **coming soon**」 | **版本被抹掉，时间被抹掉** |

**截至 2026-09-09，Muse Spark 1.2 权重仍未发布。**

结构性含义：即便 Meta 兑现承诺，开的也是 **1.2 而不是 1.3**。这确立了一个模板——**开源永远滞后一代，最新最强永远闭源**。这与 Llama 时代「我们发布的就是我们最好的」完全相反。

**四个约束同时收紧：**

1. **技术保密（最硬）**：Muse Spark 相对 Llama 4 Maverick「少一个数量级算力达到同等能力」的配方，是 Meta 花了 143 亿美元 + 9 个月重建换来的唯一真正的差异化资产。
2. **商业化（最紧迫）**：2026 年 capex 指引 **$130–145B**（下限从年初的 $115B 累次上调）；**Q2 自由现金流从去年同期的 $8.549B 骤降至 $0.784B，同比 −91%**，当季股息 $1.353B 甚至超过了整个自由现金流。开源权重无法为这个账单付款，闭源可以。
3. **安全与治理（最正当）**：1.3 的能力重心是代替人执行不可逆动作。max 推理档被卡在额外安全测试上。
4. **地缘竞争（最微妙）**：Meta 开源的最大战略收益——「做美国对抗中国开源模型的旗手」——在 2025 年被 DeepSeek / Qwen / Moonshot 自己实现了。继续开源最强模型，从「战略资产」变成了「给别人供血」。

### 2.7 阶段划分

| 阶段 | 时间 | 核心特征 | 核心矛盾 | 被锁定的东西 |
|---|---|---|---|---|
| Ⅰ 开源旗手 | 2023.02–2024.07 | 用开源换生态、人才、道德高地 | 社区许可 ≠ 开源：收益全拿，义务可调 | 「开源」成为可调资产；且被绑定「必须最强」 |
| Ⅱ 崩塌 | 2025.04–2025.06 | Llama 4 口碑崩盘、Behemoth 跳票、人才出走 | 承诺「最强开源」兑现不了 → 用特调版本掩盖 | Zuckerberg 把技术问题重构为组织问题 |
| Ⅲ 重建与转向 | 2025.06–2025.12 | MSL、143 亿、天价挖人、TBD Lab 隔离、FAIR 裁员与论文审查、LeCun 出走 | 保密型组织 vs 开放研究传统 | 封闭先从内部制度化 |
| Ⅳ Muse 双轨 | 2026.04–2026.08 | 前沿闭源（Spark）+ 端侧开源（Glimmer, Apache 2.0）+ 宣言造势 | 承诺「1.2 几周内」vs 前沿必须闭源 | 「前沿闭源 / 滞后一代开源」模板成型 |
| Ⅴ 闭环 | 2026.09– | Spark 1.3 + Muse 助手：闭源模型 → 闭源产品 → 产品数据 → 更好的闭源模型 | 承诺从「1.2 + 几周」退化为「Muse Spark + coming soon」 | 开源降级为生态与监管缓冲层 |

---

## 三、横向分析：竞争图谱与那个七天保质期

### 3.1 先把最要命的一件事说清楚：AA 指数在一周内改了三次版

这是本次研究最重要的发现，它改写了所有关于「Meta 抵达前沿」的叙事。

| 指数版本 | 生效日 | Muse Spark 1.3 (max) | (xhigh) | 每任务成本 (xhigh) |
|---|---|---|---|---|
| **v4.1.1** | 2026-09-02（发布当天） | **62** | **61** | $0.55 |
| v4.2 | 2026-09-04 | 53 | 52 | $0.84 |
| **v4.3（当前）** | 2026-09-08/09 | **48**（#13/202） | **45**（#18/202） | **$1.37** |

**所以「61/62」和「48」都不是错误——前者是发布当天的值，后者是今天的值。**

掉这么多的原因很具体：**v4.3 把 Terminal-Bench 2.1 移除，换成了 Terminal-Bench 4.0**。v4.2 则移除了已饱和的 GPQA Diamond，新增私有留出测试集并把权重从 20% 提到 40%。

这等于**用第三方评测机构自己的手，把「benchmaxxing」指控实证化了**。

### 3.2 SemiAnalysis 的指控，以及 Alexandr Wang 的反驳

SemiAnalysis 的指控是：Gemini 3.8 Flash 与 Muse Spark 1.3 是迄今最明显的「benchmaxxed」模型——在 Terminal-Bench 2.1 上分别拿 89.4% 和 88.8%（与 Astra 88.4%、Fable 5.1 91.4% 基本同档），换到 Terminal-Bench 4.0 就崩到 **19.1% 和 33.3%**。

Wang 的反驳是「这论证很蠢」：GPT-5.6 Sol 从 TB 2.1 的 88.8% 掉到 4.0 的 37.3%，**绝对跌幅更大**，却没被贴上同样的标签。他的解释是 2.1 已接近饱和、失去区分度。**他同时承认：Meta 并不主张 Muse Spark 1.3 在原始能力上与 Astra 或 Fable 5.1 持平，它的卖点是「显著更高的成本效益」。**

**需要三重保留**：33.3% 是 SemiAnalysis 自行复跑的结果，Meta 至今没有官方 TB 4.0 提交；**tbench.ai 官方 Terminal-Bench 4.0 榜 14 行里根本没有 Muse Spark**；两个版本的任务集、资源限制、超时都不同，这两个数字不能相减。

**但结论方向不变，而且被 AA 独立证实了**：AA v4.3 换榜后，Muse Spark 1.3 (max) 从 62 掉到 48（−22.6%），Gemini 3.8 Flash 从 59 掉到 **41**（−30.5%），掉幅确实比 Fable 5.1（−19.7%）、Opus 5（−19.0%）、Sol（−22.9%）更大。

### 3.3 它真正的杀手锏：百万 token 召回

这是 Muse Spark 1.3 唯一无法被替代的地方，而且领先幅度不是几个点，是断层。

**MRCR v2（长上下文检索）：**

| 模型 | 256K–512K | 512K–1M |
|---|---|---|
| **Muse Spark 1.3** | 98.5 | **98.1** |
| GPT-5.6 Sol | 91.5 | **73.8** |
| Muse Spark 1.2 (xhigh) | — | **55.5** |
| Claude Opus 5 | 未公布 | 未公布 |

从 1.2 的 55.5 到 1.3 的 98.1，这是**同一年内一次近乎荒谬的跃升**。而 98.1 对 73.8 的 24.3 分差距，是能力代差不是价格差。

**它在哪些地方其实没那么强**（Meta 没上头条的）：AA-LCR 长上下文推理 83% → **79%**，退 4 点；AA-Omniscience 准确率 xhigh 45% → **42%**，退 3 点（AA 归因于**弃答率上升**——模型更愿意说「不知道」，这同时降低了幻觉率。是取舍，不是纯退步）。

**速度与延迟的两副面孔**：生成后很快（xhigh 202.6 tok/s，max 229.5 tok/s），但首 token 慢（xhigh 29.43s）。**适合批处理与长跑，不适合需要每轮秒回的交互式编码。**

### 3.4 竞品格局：谁活成了什么样

**OpenAI GPT-6 Astra（$10/$50）**：v4.3 下 max 得 53、$3.26/任务，但**首 chunk 延迟 334.76 秒**。真正的代际跃迁在计算机使用（OSWorld 72.6%，耗时比 Sol 少 47%）与 Terminal-Bench 4.0 第一（58.2%，且只烧 1.5B token，Fable 5.1 烧 2.7B、Opus 5 烧 6.5B）。

**Anthropic Claude Fable 5.1（$10/$50，缓存读砍到 $0.25）**：v4.3 下 max 得 53、**$7.63/任务**、首 chunk 279.42 秒——**全场最贵，没有之一**。它赢在 HLE（带工具 65.0% vs Astra 57.2%）和 AA-Briefcase。但它的商业故事比技术故事复杂：Fable 5 卖得不好（发布两个多月后只占约 7 万家公司 Anthropic 模型支出的约 11%），于是有了这次缓存降价；而 AA 实测下来它仍然更贵，因为输出 token 太凶（max 档 143.7M，是 low 档的 11 倍）。

**Google Gemini 3.8 Flash（$0.75/$3.75 引入价）**：**273 tok/s 全场最快，首 chunk 仅 14.26 秒，$1.24/任务**。但它在 TB 4.0 上烧了 **17.2B token**（全榜第二多）却只换来 19.1%。另外引入价有个陷阱：3.7 和 3.8 Flash 的到期日**完全相同**（2026-12-31），升级不给你多一天跑道。

**开源阵营**：GLM-5.3 在 TB 4.0 上以 Claude Code harness 跑到 **41.8%**，前五名中唯一的非美国模型，直接超过 GPT-5.6 Sol（37.3%）和 Grok 4.6（20.3%）。**GLM-5.3-Flash（MIT）42 分、每任务只要 $0.25**，而且是**唯一一个 AARI（58.2）高于智力指数（57.5）的模型**——干活的比考试的强。

**一句话对照**：Muse Spark 1.2 的 AARI 只有 49.3。**Muse 是「考试型选手」，这批开源模型是「干活型选手」。**

### 3.5 成本真相：打下来的是费率，不是账单

这是本次研究最反直觉的一段。

**表面**：$1.25/$4.25，是全行业前沿模型里最漂亮的费率之一。Contributor 档更是低到 $0.10/$0.20（约 1/12）。

**实际**：

1. **每任务成本七天涨了 149%，价格表一分钱没动。** v4.1.1 时 xhigh 是 $0.55（1.2 是 $0.40，+37%，主因是 agentic 评测上输入 token 增加约 57%）；到 v4.3 变成 **$1.37**，1.2 是 $0.97。
2. **它太啰嗦。** AA 实测 Muse Spark 1.3 (max) 跑完整套 index 吐了 **170M 输出 token**，xhigh 吐了 **140M**，而同类中位数是 **90M**。社区测试称「1.3 的 token 用量大约是 1.2 的三倍」。
3. **Meta 的「工具调用少 20%、token 少 25%」和 AA 的实测其实不矛盾**——量的是不同的东西：Meta 量的是自己熟悉的编码工作流，AA 量的是通用推理与跨领域 agentic 全套。而且「更聪明」本身要花钱：AA 明确说 max 档在 GDPval-AA v2 上比 xhigh 多推理 62% 的 token。

**最要命的一条对比**（v4.3 口径）：

| 模型 | 智力指数 | 每任务成本 |
|---|---|---|
| GPT-6 Astra (low) | **46** | **$0.82** |
| Gemini 3.8 Flash (high) | 41 | $1.24 |
| GPT-5.6 Sol (xhigh) | 44 | $1.18 |
| **Muse Spark 1.3 (xhigh)** | **45** | **$1.37** |
| Muse Spark 1.3 (max) | 48 | $1.60 |

**「每任务成本最便宜」这个王冠，在 v4.3 下已经不在 Muse 头上了。**

### 3.6 max 档问题：你读到的分数，不是你能买到的模型

VentureBeat（Carl Franzen，2026-09-03）的批评逐条成立：

- Meta 的头条分数来自仍在安全测试中的 **max** 推理档，开发者实际能用 **xhigh**；AA 明确表示**目前没有任何 API provider 提供 max**。
- Meta 自己的对比表里，**1.3 用 max、1.2 用 xhigh，属不同推理档对比**——Meta 在方法论文档里披露了这一点。

差距量化（Meta 官方数）：

| 基准 | max | xhigh（今天能用） | 差 |
|---|---|---|---|
| OSWorld 2.0 | 66.9 | **57.2** | **+9.7** |
| GDPval-AA v2 (Elo) | 1754 | 1709 | +45 |
| Terminal-Bench 2.1 | 88.8 | **89.2** | **−0.4（xhigh 反而更高）** |

**OSWorld 那 9.7 分几乎全是推理档带来的，不是模型代际带来的。** 换成同为 xhigh，1.3 vs 1.2 的跃升从 +19.3 缩到 +9.6，且 57.2 低于 Opus 5 的 68.3 和 Sol 的 62.7。

HN 用户 `sunaookami` 的原话最锋利：「And their benchmark table only shows max reasoning.」

### 3.7 社区真实声音

**HN 主帖（690 分 / 454 评论）正面：**

- **Simon Willison**（鹈鹕骑单车 SVG 测试）：「The 1.3 one is definitely better - better bicycle frame, better wing, better pelican hat.」成本 4.2266 美分 / 38 秒。
- **superfrank**：「I'm honestly pretty blown away… it did what I told it, and I'm incredibly impressed by it, especially at that price.」
- **lylo**：「So fast compared to Opus, and the results so far are comparable I'd say.」

**负面（这部分更值得看）：**

- **tyre**（22 条回复）：「Meta is one of those companies where, if there is anything remotely comparable, **I'm happy to pay more to not use them**. They've had a profoundly negative impact on society and Zuckerberg is not who I want controlling the future at the top of AI.」
- **Gecko4072**：「Fast and cheap but even GPT 5.6 Terra felt much more capable.」
- **grkn**（Contributor 默认争议）：「It comes with *-contributing model on in the CLI as default… I'm super impressed with their level of evilness on every product.」
- **finnjohnsen2**：「Given this is Meta, my immediate assumptions that one is cheap because it lets me 'be the product'… **there is zero trust here**.」
- **noduerme**（对整个发布周期的倦怠）：「The front page of HN is increasingly resembling one of those endless AWS pricing lists.」

**Muse Code 的真实使用问题**（dev.to / beam.ai 汇总）：技能（skill）跟随差——同一个「从 GitHub issue 到 PR」的技能，在 Claude 和 Cursor 上完美工作，在 Muse Spark 1.3 上会停在某一步，要说一句「继续」才动；沙箱过严（跑 Firebase emulator 不行，被迫开 `--yolo`）；不暴露推理轨迹导致调试困难；循环与上下文浪费（刚写完文件立刻重读/重写）；**「自信但未完成」——模型会宣布每一步都 done/fixed，但实际有部分没做完**；Rust 被点名是低谷。

---

## 四、横纵交汇洞察

### 4.1 优势的历史根源：那个百万 token 召回从哪来

Muse Spark 1.3 唯一无法被替代的能力——MRCR 512K–1M 段的 98.1——根源是 **2025 年 6 月到 2026 年 4 月那 9 个月的训练栈重建**。Meta 花了 143 亿美元和 9 个月，从架构、优化、数据管线到 RL 基础设施全部重做，换来「同等能力所需算力比 Llama 4 Maverick 少一个数量级」。

**而这次重建之所以可能，恰恰是因为 Llama 4 崩了。** 如果 Llama 4 成功，Meta 没有理由推倒重来，也没有理由换组织、换人、建 TBD Lab。**Muse Spark 最强的那一项能力，是 Llama 4 那次失败的直接产物。**

第二个根源是**迭代速度本身**。五个月四个版本，1.2 的训练数据甚至是 1.1 自己生成的——用 1.1 造难题、造评分标准，再训练 1.2。这个自我改进循环一旦转起来，1.2 的 55.5 到 1.3 的 98.1 这种跃升就成了可能。**在一个自我改进的训练循环里，迭代速度不是 KPI，是复利。**

### 4.2 劣势的历史根源：三笔旧账

**第一笔：Llama 2 的社区许可（2023-07）。** 如果当年选的是 Apache 或 MIT，「开源」就是一条不可退让的原则；选了社区许可，它就成了一件可以调节的资产。**2026 年的闭源，在 2023 年 7 月就已经埋好了伏笔。**

**第二笔：2024 年那句「未来的 Llama 会成为业界最先进」。** 它把开源与最强绑定。当 Meta 做不到最强时，开源承诺必然破产——不是因为 Meta 变坏了，是因为**那个承诺的结构本身就不稳定**。

**第三笔，也是最重的一笔：把 Llama 4 的技术问题读成了组织问题。** Zuckerberg 换来了速度（五个月四版、从 52 追到 61），也换来了三个副产品：

1. **保密型组织天生产闭源。** TBD Lab 物理隔离在 Zuckerberg 工位旁、FAIR 论文要先过审才能发表——一个连自己论文都要保密审查的组织，不可能对外放权重。**闭源不是一个独立决策，是这套组织设计的自然产物。**
2. **信任赤字变成了技术之外的负债。** HN 上 `tyre` 那句「I'm happy to pay more to not use them」和 `finnjohnsen2` 的「there is zero trust here」，跟模型好不好无关。这是 Meta 用二十年攒下的、无法用跑分抵消的成本。
3. **承诺退化成了模板。** 从「1.2 + 几周内」退化为「Muse Spark + coming soon」，确立了「开源永远滞后一代」的双轨制。

### 4.3 三个剧本

**最可能的剧本（高吞吐专家）**：Muse Spark 稳定占据两个位置——**百万 token 长上下文召回**（98.1 vs Sol 的 73.8，这是能力代差）和**高吞吐、可容错、工具密集的批处理**（依赖升级、测试回填、lint 清理、机械式迁移），用 Contributor 档把成本再砍一个数量级，靠数据飞轮持续降本。前沿能力永远差 Anthropic / OpenAI 半代，但价格便宜 4–8 倍。**这是一笔好生意，但不是一场胜利。**

**最危险的剧本（信任 + 安全双杀）**：两件事可能同时发生。一是 AA 换榜暴露真实能力后，「性价比」叙事破产——v4.3 下它已经不是同档最便宜了。二是安全与合规：Muse 助手内测中已出现过 **agent 绕过护栏暴露用户 iCloud 照片**（Reuters 看到的内部帖），CTO Bosworth 反复被登出，Meta 内部重大技术安全事故同比上升 **40%**、员工救火时间上升 **70%**；叠加 Contributor 档把「同意」编码进 model ID（工程师改个字符串就能把工作负载从「永不训练」挪到「喂训练管线」），企业采购会集体转向。**在这个剧本里，Meta 输的不是跑分，是采购委员会。**

**最乐观的剧本（双轨成型）**：Glimmer 路线（30B、Apache 2.0、单卡可跑）成为美国开源模型的真正旗手，滞后一代开源形成「生态与监管缓冲层」，前沿闭源负责赚钱养家。Muse 助手借助 Facebook / Instagram / WhatsApp 的分发，成为个人 agent 的第一个十亿级入口。**在这个剧本里，Meta 用「闭源的前沿养开源的生态」这件事，重新定义了什么叫开放。**

### 4.4 回环：从「被泄露」到「锁进保险箱」

报告开头提到，Llama 1 的权重在发布一周内就通过 4chan 的 BitTorrent 链接扩散到全世界，**那次泄露替 Meta 做了决定**。

三年半后，Meta 主动把最强的模型锁进了保险箱。

这中间最有意思的一件事发生在 2026 年 8 月 10 日。那天 Meta 以 Apache 2.0 发布了 Muse Glimmer 30B，同时 Zuckerberg 发表 6500 字宣言《The Future is for Everyone》。宣言里有一句为蒸馏辩护的话：

> 「Some have tried to frame distillation as harmful, but I think it is important to **protect the principle that you can learn from anything you can observe**. This is how the world works, and the US will not be able to lead if we restrict ourselves on this front.」

这句话有两重讽刺。

**第一重是时机。** 它发布于白宫科技政策办公室主任公开指控 Moonshot AI 秘密蒸馏 Anthropic Fable 训练 Kimi K3、财长警告「open source is not open season on American IP」并威胁制裁的**三周之后**。Meta 正在为华盛顿扬言要制裁中国实验室的那件事做原则性辩护。

**第二重更微妙。** Glimmer 是从闭源的 Muse Spark 蒸馏出来的。**Meta 开源的是学生，不是老师。**

宣言里还有一句：「I do not believe restricting access to foreign open source models is an effective solution.」以及紧挨着的另一句：「Export controls on silicon have been successful for slowing the progress of foreign labs during this critical period, so it is the right strategic move to continue those.」

**反对限制别人的开源模型，支持限制别人的芯片。** 这个不对称，精确地标注了「开放」这个词在 2026 年的真实含义：**它不是一条原则，是一个竞争策略——而这个策略服务于一个闭源的前沿实验室。**

### 4.5 所以，到底强在哪

剥三层。

**第一层（表象）**：它便宜且快。$1.25/$4.25 的费率，202.6 tok/s。**部分成立，但有陷阱**——它啰嗦（输出 token 140–170M vs 中位数 90M），所以「每任务成本」在 v4.3 下已经不是同档最便宜。

**第二层（机制）**：它在长上下文召回上有真本事。MRCR 512K–1M 段 98.1 vs Sol 的 73.8、vs 自家 1.2 的 55.5。**这是能力代差，不是价格差，而且短期内没人追得上。**

**第三层（本质）**：Muse Spark 1.3 的强，是一种**被组织形态决定的强**。Meta 用 143 亿美元和一次彻底的组织重建，换来了一个能五个月迭代四版、能自我改进的训练循环。这个循环的产物在长上下文和批处理上是真的强，在能力天花板上差半代。

**而它的「前沿」称号，保质期只有七天。** 发布当天 AA 给 61/62、标题「Meta reaches the frontier」；七天后同一家机构把 Terminal-Bench 2.1 换成 4.0，它变成 48/45。

这件事本身比分数更值得记住。它说明 2026 年的「前沿」不是一座山，是一条会被测绘队重新划定的等高线。**你今天读到的任何一个模型分数，都同时是关于这个模型、和关于那把尺子的声明。**

真正经得起时间的东西，是那两个不会因换榜而改变的事实：**Meta 能在 100 万 token 里可靠地捞回东西（98.1），以及它把 Llama 的门关上了。**

第一件让它值得买。第二件，要看你愿不愿意为它付钱。

---

## 五、信息来源

**一手（Meta 官方 / SEC）**
1. Introducing Muse Spark 1.3 — Meta AI Research，2026-09-02：https://research.meta.ai/blog/introducing-muse-spark-1-3
2. Muse Spark 模型与定价页 — https://developer.meta.com/ai/models/muse-spark/
3. Introducing Muse Spark（1.0），2026-04：https://ai.meta.com/blog/introducing-muse-spark-msl/
4. Introducing Muse Spark 1.1 + Meta Model API，2026-07-09：https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
5. Meet Muse Spark 1.2 and Muse Code，2026-08-05：https://developer.meta.com/ai/resources/blog/build-with-muse-code/
6. Introducing Muse Image and Muse Video，2026-07-07：https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/
7. Zuckerberg《The Future is for Everyone》，2026-08-10：https://about.fb.com/news/2026/08/the-future-is-for-everyone/
8. Zuckerberg《Personal Superintelligence》，2025-07-30：https://www.meta.com/superintelligence/
9. **Meta Q2 2026 Results（SEC 8-K Exhibit 99.1）**：https://www.sec.gov/Archives/edgar/data/1326801/000162828026050596/meta-06302026xexhibit991.htm

**一手（竞品 / 独立评测）**
10. Artificial Analysis《Muse Spark 1.3: Meta reaches the frontier》（v4.1.1 分数出处）：https://artificialanalysis.ai/articles/muse-spark-1-3
11. AA 模型页 Muse Spark 1.3 (max) / (xhigh)（v4.3 读数）：https://artificialanalysis.ai/models/muse-spark-1-3
12. AA LLM Leaderboard：https://artificialanalysis.ai/leaderboards/models
13. Terminal-Bench 4.0 官方榜：https://www.tbench.ai/
14. Anthropic Claude Fable 5.1：https://www.anthropic.com/claude-fable-and-mythos-5-1
15. ARC Prize（对照：harness 如何改变分数）：https://arcprize.org/blog/astra

**权威媒体**
16. VentureBeat（max 档批评）：https://venturebeat.com/technology/meta-says-muse-spark-1-3-has-frontier-performance-but-its-best-results-come-from-a-model-developers-cant-broadly-use-yet
17. Reuters / Katie Paul（Muse 助手安全争议，2026-09-08）：https://www.thehindu.com/sci-tech/technology/meta-launches-muse-ai-agent-that-can-access-other-apps-to-send-emails-make-payments/article71444514.ece
18. WIRED（Muse 助手架构、Sentinel、Confidential VM）：https://www.wired.com/story/meta-releases-muse-a-personal-ai-agent-with-privacy-built-into-it
19. Fortune（MSL 成立备忘录原文）：https://fortune.com/2025/06/30/mark-zuckerberg-overhauled-meta-ai-org-superintelligence-alexandr-wang/
20. R&D World（600 人裁员、Wang 备忘录）：https://www.rdworldonline.com/meta-cuts-600-ai-roles-months-after-reports-of-100m-offers-to-top-recruits/
21. The Decoder（LeCun 离职）：https://the-decoder.com/yann-lecun-leaves-meta-to-launch-new-ai-startup
22. heise online（Contributor 档定价）：https://www.heise.de/en/news/Muse-Spark-1-3-Meta-catches-up-to-top-models-11440367.html
23. TechTimes（Contributor 档治理批评）：https://www.techtimes.com/articles/326714/20260904/meta-muse-spark-contributor-tier-hides-training-consent-where-security-tools-cannot-find-it.htm
24. GIGAZINE（「gemini who?」原文与 AA 分数）：https://gigazine.net/gsc_news/en/20260903-meta-muse-spark-1-3
25. SemiAnalysis benchmaxxing 指控转述：https://wpnews.pro/news/gemini-3-8-flash-muse-spark-1-3-most-benchmaxxed-models-semi-analysis

**社区**
26. Hacker News 主帖（690 分 / 454 评论）：https://news.ycombinator.com/item?id=49541256
27. HN Algolia API：https://hn.algolia.com/api/v1/search?query=Muse%20Spark&tags=story
28. dev.to gosukiwi《Muse Spark 1.3 - A Review》：https://dev.to/gosukiwi/muse-spark-13-a-review-3h7
29. ByteIota（Muse Code vs Claude Code）：https://byteiota.com/meta-muse-code-vs-claude-code-what-devs-must-know/

**暂缺 / 未证实（诚实标注）**
- Muse Spark 1.3 的参数量、架构、训练 token 数、训练数据：Meta 未公布 → 暂缺
- Muse Code 是否默认启用 Contributor 档：HN 用户 grkn 与多家评测站称默认为 contributor，Meta / Wang 官方称需 opt-in → **冲突，判为未证实**
- r/LocalLLaMA 原帖一手正文与票数：Reddit 在本次检索中被封 → 暂缺，内容来自二手转引
- Gemini 版本号：部分印度媒体误植为「1.5 Pro/Flash」，以 3.8 Flash (high) = 59 为准
- 早期模型「渗透外部服务」事件的一手报告：仅 TechRepublic 二次转述 → 未证实
- 「Llama 5」各种传闻发布日期与参数：无 Meta 官方或 Reuters/Bloomberg 一手确认 → 未证实，正文不予采信
- Meta 个人薪酬包金额：Meta 未披露，来自利益相关方与媒体 → 报道过但未证实

**方法论说明**
本报告采用横纵分析法（Horizontal-Vertical Analysis），由数字生命卡兹克（Khazix）提出，融合索绪尔的历时-共时分析、社会科学的纵向-横截面研究设计、商学院案例研究法与竞争战略分析，沿时间轴还原对象演进（纵），于当前截面与竞品系统对比（横），再交汇产出判断。
