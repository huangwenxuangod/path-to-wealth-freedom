# AI Coding 工具定价图谱报告（2026 年 6 月）

> 调研时间：2026-06-14 · 数据来源：OpenAI / Anthropic / Cursor / GitHub / Cognition 官方定价页 + 13 篇 2026 年行业评测 + Reddit/HN 社区反馈
>
> 核心议题：**OpenAI Codex 在 2026 年 4 月 2 日将订阅制从"按消息/按 PR"切换为"按 token 积分"**，与赛道内其他玩家的定价模型产生深度碰撞——本报告对全赛道定价图谱做一次完整梳理。

---

## 一、定价模型分类：当前 AI Coding 赛道的 5 种范式

| # | 范式 | 代表产品 | 计费单位 | 典型月费区间 |
|---|------|----------|----------|--------------|
| 1 | **按月订阅（平价套餐）** | Cursor Pro $20、Windsurf Pro $20、GitHub Copilot Pro $10 | 套餐内额度+超额 | $10–$200/月 |
| 2 | **按月订阅（积分/月度信用池）** | Cursor 信用池 $20/$60/$200、GitHub Copilot AI Credits、Codex 5h 滚动额度 | 美元信用额 | $20–$500/月 |
| 3 | **按 token（API 直付）** | Aider / Cline / Continue（BYOK）、Anthropic API、OpenAI API、Codex API 模式 | 每百万 token | 浮动 |
| 4 | **按结果/任务（outcome-based）** | Devin（ACU）、Factory、Genie | ACU/任务/工单 | $20 起 + 计量 |
| 5 | **席位打包（enterprise）** | Copilot Business/Enterprise、Windsurf Teams、Tabnine | 每席位/月 | $19–$60/席位 |

**最关键的赛道变化（2026 H1）：**

- **2026-04-02**：OpenAI Codex 全面从"按消息/按 PR"改为"token 积分制"，加入 Pro 5x（$100，新） + Pro 20x（$200，原 Pro 改名）双层
- **2026-06-01**：GitHub Copilot 把 Premium Request Units（PRU）换成 AI Credits（1 credit = $0.01），从"按请求"改为"按 token"
- **2026-03-19**：Windsurf 把月度信用额换成"日+周双轨滚动额度"
- **2025-06**：Cursor 把"按请求"换成"按信用额"
- **2025-08-28**：Anthropic 在 Claude Code 的 5h 滚动窗口之外**新增"周上限"**，引发"Claude Is Dead"841 赞吐槽帖

**一句话总结**：整个赛道在 18 个月内集体从"按请求"滑向"按 token/按使用"，**没有任何一家大厂还停留在纯请求制**。

---

## 二、定价对比大表（10 款核心产品）

> 货币单位：美元 · 数据口径：2026-06-14 各家官网或权威评测

| 产品 | 套餐 | 月费 | 顶层模型 | Token 单价（输入/输出，每 M） | 限速机制 | 免费层 | 适合人群 |
|------|------|------|----------|------------------------------|----------|--------|----------|
| **OpenAI Codex CLI** | Free | $0 | Codex Mini | — | 受限本地 | ✅ Mini 受限 | 试用、本地轻量 |
| | Go | $8 | GPT-5.4-mini | API: $0.75 / $4.50 | 轻量 | ❌ | 轻度本地任务 |
| | **Plus** | **$20** | GPT-5.5 / 5.4 / 5.3-Codex | 信用: 125 / 750（5.5）| 5h 滚动额度 | ❌ | 业余/兼职开发 |
| | **Pro 5x** | **$100（2026-04-09 新增）** | + GPT-5.3-Codex-Spark | 同上 × 5 | 同上 | ❌ | 全职日常 |
| | **Pro 20x** | **$200（原 Pro 改名）** | 同上 | 同上 × 20 | 同上 | ❌ | 并行 Agent 重度 |
| | Business | $20/席位+PAYG | 同上 | API 价格 | 集中管控 | ❌ | 团队 |
| | Enterprise | 询价 | 同上 | 信用池 | 无固定速率限制 | ❌ | 大企业 |
| **Claude Code** | **Pro** | **$20** | Sonnet 4.6 + Opus 4.6 | API: $3–$5 / $15–$25 | 5h 窗口 | ❌ | 偶尔使用 |
| | **Max 5x** | **$100** | 同上 | 同上 | 5h×5 + 周上限 | ❌ | 日常主力 |
| | **Max 20x** | **$200** | 同上 | 同上 | 5h×20 + 周上限 | ❌ | 重度 + 并行 |
| | Team Premium | $100/席位 | 同上 | — | 共享池 | ❌ | 团队 |
| | API | 纯按 token | 同上 | Sonnet $3/$15；Opus $5/$25 | API rate limit | ❌ | 自动化/CI |
| **Cursor** | Hobby | $0 | 限速模型 | — | 50 慢速请求/月 | ✅ | 评估 |
| | **Pro** | **$20** | Sonnet/GPT-5/Gemini 混合 | 信用: 约 $0.036–$0.089/请求 | $20 信用池 | ❌（试用 1 周）| 个人日常 |
| | Pro+ | $60 | 同上 | 同上 | $60 信用池 | ❌ | 重度 |
| | **Ultra** | **$200** | 同上 | 同上 | $200 信用池 | ❌ | 并行 agent |
| | Teams | $40/席位 | 同上 | Pro 等价/席位 | 集中管控 | ❌ | 团队 |
| | Enterprise | 询价 | 同上 | 共享池 | 池化 | ❌ | 大企业 |
| **GitHub Copilot** | **Free** | **$0** | GPT-5-mini, Haiku 4.5 | — | 2,000 补全/月 + 限量 chat | ✅ | 评估 |
| | **Pro** | **$10** | 多模型 | $15 信用/月（含 flex）| AI Credits 限额 | ❌ | 轻度个人 |
| | **Pro+** | **$39** | + Claude Opus | $70 信用/月 | 同上 | ❌ | 重度 |
| | **Max**（新） | **$100** | + 优先新模型 | $200 信用/月 | 同上 | ❌ | 持续高强度 |
| | Business | $19/席位 | 多模型 | $19 + 促销 $30 至 2026-08 | 池化 | ❌ | 团队 |
| | Enterprise | $39/席位 | 同上 | $39 + 促销 $70 至 2026-08 | SAML SSO + 池化 | ❌ | 大企业 |
| | **【注】** | — | — | — | **2026-06-01 起改用 AI Credits（1=$0.01）** | — | — |
| **Anthropic Claude API** | API | 纯按 token | Opus 4.8/4.7/4.6 | $5 / $25（1M 上下文）| API 速率 | ❌ | 开发者 |
| | 同上 | 同上 | Sonnet 4.6 | $3 / $15（1M 上下文）| 同上 | ❌ | 性价比首选 |
| | 同上 | 同上 | Haiku 4.5 | $1 / $5（200K 上下文）| 同上 | ❌ | 批量/路由 |
| | 同上 | 同上 | Fable 5 | $10 / $50（1M 上下文）| 同上 | ❌ | 顶配推理 |
| **Aider** | Open source | **$0（Apache 2.0）** | 任意 OpenAI-兼容模型 | 由用户选 | 用户自管 | ✅ 全功能 | BYOK 预算党 |
| | 同上 | API 费 $3–25/天 | 主流模型 | 取决于所选模型 | — | — | 终端党 |
| **Cline** | Open source | **$0（MIT）** | 30+ provider | 取决于所选模型 | 用户自管 | ✅ 全功能 | BYOK 极客 |
| | 同上 | API 费 $5–30/天 | Claude/GPT/Gemini | 由用户选 | — | — | VS Code 重度 |
| **Continue** | Starter | **$0 月费 + $3/百万 token** | 主流模型 | $3/M | 自付 | ✅ 开源 | 个人轻量 |
| | Team | $20/席位/月 | 同上 | $10 信用 + $3/M 超额 | 集中管控 | ❌ | 小团队 |
| | Company | 询价 | 同上 | BYOK + 信用 | SAML/SSO | ❌ | 企业 |
| **Windsurf** | Free | $0 | 自由模型 | — | 25 Flow Actions/月 | ✅ | 评估 |
| | **Pro** | **$20** | SWE-1/1.5, GPT-5, Sonnet 4.6, Gemini 3.1 | Per-message（自有模型）| 日+周双轨 | ❌ | 个人日常 |
| | Max | $200 | 同上 | 同上 | 最高额度 | ❌ | 重度 |
| | Teams | $40/席位 | 同上 | 同 Pro + admin | 同上 | ❌ | 团队 |
| | Enterprise | 询价（~$60+/席位）| 同上 | 自定义 | 合规齐全 | ❌ | 大企业 |
| | **【注】** | — | — | — | **2026-03-19 改用日+周双轨 quota（取代 500 信用）** | — | — |
| **Devin (Cognition)** | **Core** | **$20** | 自有 | ACU: **$2.25/ACU** | 不预报价 | ❌ | 试用个人 |
| | Team | $500 | 自有 | $2.00/ACU（250 ACU 包含）| 同上 | ❌ | 企业 |
| | Enterprise | 询价 | 自有 | 池化 | — | — | 大企业 |
| | **【注】** | **2025-04 从 $500 降至 $20 入场** | — | — | 1 ACU ≈ 15 分钟主动工作 | — | — | — |

---

## 三、十个产品逐一画像

### 1. OpenAI Codex CLI / Agent（本次研究主体）
**核心定位**：OpenAI 的"终端 + IDE + 云沙箱"三栖 agent，绑定在 ChatGPT 订阅体系内。2026 年 4 月 2 日**最重大变化**：把原本"按消息/按 PR"的计费全部切换为**按 token 积分**——Plus/Pro 订阅内仍含 5h 滚动额度（5.5: 15–80 消息，5.3-Codex: 30–150 消息），超额部分按 credit 费率扣（GPT-5.5: 125/750 credit/百万 token 输入/输出）。2026 年 4 月 9 日新增 **$100 的 Pro 5x**（明确对标 Claude Code Max 5x），原 $200 Pro 改名为 **Pro 20x**。可选配 **GPT-5.3-Codex-Spark**（Cerebras 加速，1000+ token/s）走 research preview。
**定价逻辑**：把"按次"切到"按 token"——既保留订阅的"月度预付 + 滚动额度"心理锚点，又把超额成本与模型选择挂钩。模型分层（5.5 / 5.4 / 5.4-mini / 5.3-Codex-Spark）允许成本路由，GPT-5.4-mini 在 5h 窗口内能撑 60–350 消息，是 GPT-5.5 的 4 倍多。
**社区口碑**：Plus 用户在 Reddit 上吐槽"5h 额度十分钟就烧光"；Pro 5x 评价两极分化，赞誉者说是"Claude Code Max 的有力竞争者"；批评者认为 Plus 的"消息数"概念已经被"信用"模糊化，老用户需要重新学习计量方式。
**OpenAI 自报数据**：典型活跃开发者 $100–$200/月，与 Claude Max 5x 同区间。

### 2. Anthropic Claude Code
**核心定位**：Anthropic 唯一的"agent-first"产品，纯 CLI 工具 + VS Code/Cursor 插件。**2025 年 8 月 28 日"周上限"上线**触发 Reddit "Claude Is Dead" 841 赞吐槽贴（最关键的负面事件）。定价上分 Pro $20 / Max 5x $100 / Max 20x $200 三档，叠加 5h 滚动 + 周上限。**2026 年 7 月初**再次调高额度：5h 窗口翻倍、Pro/Max/Team/Enterprise 周上限 +50%，明显是被 Codex Pro 5x 和 Copilot Max 逼出来的竞争反应。
**定价逻辑**：订阅按"使用量"分层（×5、×20），而不是按"模型"分层——Pro 用户也能调 Opus，但额度更紧。Anthropic 不公开具体 token 数。**Sonnet 4.6 API: $3/$15 每百万 token**（1M 上下文），**Opus 4.8: $5/$25**（1M 上下文），**Haiku 4.5: $1/$5**（200K）。批处理 50% 折扣，prompt caching 90% 折扣。
**社区口碑**：用户对"付费 $200 仍被周上限挡住"非常不满，**多 agent 玩家普遍改用 tmux 并行 + Codex CLI 兜底**。一个 8 个月烧掉 100 亿 token 的开发者算出"API $15K vs Max $800，节约 93%"。**"Claude Is Dead"贴是 2025 年 AI coding 圈最具影响力的负面舆情**。

### 3. Cursor
**核心定位**：Anysphere 出品的"AI 优先 IDE"（VS Code fork），赛道最早跑出来的 IDE-级玩家。**2025 年 6 月**从"按请求"换成"按美元信用"——Pro $20 / Pro+ $60 / Ultra $200 / Teams $40/席位 / Enterprise 池化。Tab 补全无限（用单独小模型，不耗信用），但 chat 和 agent 任务按模型和复杂度扣信用：Sonnet 每 $20 信用约能跑 225 次，GPT-4o 约 350 次，Gemini 约 550 次。BugBot 代码审查是 **$40/席位/月**的独立加价。
**定价逻辑**：把"请求数"翻译成"美元数"——同价 $20 对不同模型意味着截然不同的请求数，鼓励用户**用 Gemini 跑日常、保留 Claude 做关键推理**。Hobby 免费层（2,000 补全 + 50 慢速请求）是品牌获客利器。
**社区口碑**：**2025 年 7 月 Cursor 因 Pro 价改沟通不清引发退款潮**（CEO 公开道歉），是赛道里"信任成本"事件最显眼的一家。重度用户普遍反映 Pro 不够用、Pro+ 又贵——典型的"中间档陷阱"。Cursor 3 2026 年发布后"Agent-first"重做界面，市场反应两极。

### 4. GitHub Copilot
**核心定位**：微软/GitHub 生态的默认 AI 编程工具。**2026 年 6 月 1 日重大变化**：从 Premium Request Units（PRU）改为 **AI Credits**（1 credit = $0.01），按 token 计费。Pro $10、Pro+ $39、新 **Max $100**（直接对标 Codex Pro 5x、Claude Max 5x）、Business $19/席位、Enterprise $39/席位。Business/Enterprise 2026-08 前有促销（+$11/$31 信用）。**关键点：补全和 Next Edit 不耗信用**——只有 chat、agent、PR 审查、CLI 才耗。
**定价逻辑**：用 AI Credits 把"使用量"翻译成"美元"——Pro 月费 $10 配 $15 信用（含 $5 flex），Max $100 配 $200 信用。免费层 2,000 补全/月 + 限量 chat/agent，是赛道里最慷慨的免费层之一。**Business/Enterprise 池化信用 + admin 预算管控**是微软卖给大企业的主打差异点。
**社区口碑**：微软 2026 年 6 月强推**内部工程师"必须在 6/30 前停用 Claude Code，转 Copilot CLI"**——据内部数据，Claude Code 烧到 **~$2,000/工程师/月**而 Copilot 是 $39/席位，CFO 算账是 51 倍差距。**这件事是 AI coding 圈第一次"大企业公开叫停按 token 计费、回归按席位"**的标志性事件。

### 5. Anthropic Claude（API 模式）
**核心定位**：与 Claude Code 共享同一组模型，纯 API 按 token 计费，是 Aider / Cline / Continue / Cursor / Devin 的"上游水源"之一。**Opus 4.8/4.7/4.6 全是 $5/$25 每百万 token（1M 上下文）**，**Sonnet 4.6 是 $3/$15（1M 上下文）**，**Haiku 4.5 是 $1/$5（200K 上下文）**，**Fable 5 顶配是 $10/$50（1M 上下文）**。批处理 50% 折扣，prompt caching 最高 90% 折扣。
**定价逻辑**：模型 + 上下文长度二维定价。**Anthropic 在 2026 年取消了 200K 以上的"长上下文加价"**（旧 Sonnet/Opus 在 200K 之后翻倍收费），是用户口碑最好的政策之一。**Sonnet 4.6 是"性价比甜点"**——价格与 GPT-5.4 几乎打平，但编码质量在 SWE-bench 上领先 5–8 个点。
**社区口碑**：Haiku 4.5 被广泛用作"router 模型"——把简单任务分给它，复杂任务才升 Opus 4.8。Sonnet 4.6 是"个人日常默认"。**Fable 5 因为 $10/$50 几乎没人日常用**，只在 batch 长任务跑深度推理时偶尔启用。

### 6. Aider
**核心定位**：Paul Gauthier 主导的"终端原生、开源、模型无关"AI 编程工具。**Apache 2.0 协议，永久免费**——没有订阅、没有付费档、没有"商业版"。
**定价逻辑**：用户自带 API key（BYOK），从 Anthropic / OpenAI / Google / DeepSeek / OpenRouter / Ollama 任选。Claude Sonnet/GPT-4 类**日均 $5–$15**，重度 $20–$25；DeepSeek V3/V4 **$1–$3**；Ollama 本地模型**纯免费**（仅电费）。自带 `/tokens` 命令、动态切模型、`--map-tokens` 调仓库地图大小等成本控制功能。
**社区口碑**：被 Reddit r/LocalLLaMA 圈称为"最便宜的 Claude 编程路径"——重度用户每月 $60–$500，与 Cursor Pro 比无明显价差，但优势是**完全透明 + 模型自由**。**Aider 在 SWE-bench Lite 长期保持开源工具 Top 1**，是 Cursor/Claude Code 圈外"理性派"的首选。

### 7. Cline（VS Code 扩展）
**核心定位**：VS Code 里的"完整 agent"——文件编辑、终端命令、浏览器控制全栈能力。**MIT 协议，完全免费**，无付费档。
**定价逻辑**：纯 BYOK。Claude Sonnet 类**日均 $5–$15**，重度 $20–$30；DeepSeek **$1–$3**。支持 30+ LLM provider（Anthropic、OpenAI、OpenRouter、AWS Bedrock、Vertex AI、Azure OpenAI），并能跑本地模型。**VS Code Marketplace 上评分 4.7+**，是 VS Code 生态里增长最快的 agent 扩展。
**社区口碑**：Cline 的"open core + 全功能免费"是**和 Cursor 商业化最激烈的对抗**。许多用户从 Cursor 迁回 VS Code + Cline 自配 key。**关键临界点**：日均 100K–300K token 是 Cline BYOK 与 Cursor Pro 平价的分水岭——**低于这个用 Cline 更便宜，高于这个用 Cursor 更省心**。

### 8. Continue
**核心定位**：Y Combinator S23 出身，VS Code + JetBrains 开源 AI 编程扩展，**Apache 2.0 协议**。2025 年 2 月发布 1.0 时同步推出"Continue Hub"——开始把 IDE 之外的功能（agent 管理、模型信用、SSO）做商业化。
**定价逻辑**：**独特的"双层"模式**——IDE 扩展本身**永久免费**（开源），但 Continue Hub 上的"集中 agent 管理 + 模型信用"按 token 收费。**Starter $0 月费 + $3/百万 token**（input+output 合并计费）；**Team $20/席位/月**（含 $10 信用，超额 $3/M）；**Company 询价**（含 SAML/OIDC、BYOK 一等公民、合同 SLA）。免费层（Solo）在 2026 年初改名为"Starter"时**悄悄从"完全免费"切到"按 token 收费"**——社区有不满。
**社区口碑**：Continue 的"开源 IDE + 收费 Hub"模型在 Aider / Cline 的"纯免费"压力下承压。**$20/席位 + $3/M 的费率对个人开发者有竞争力**（比 Cursor Pro 略便宜、模型更自由），但企业市场被 GitHub Copilot / Cursor 压得很难。

### 9. Windsurf
**核心定位**：原 Codeium 旗下、被 **Cognition（Devin 母公司）以约 $2.5 亿收购（2025 年 7 月）**的 AI 优先 IDE。**2026 年 3 月 19 日重大变化**：从"500 月度信用（$15/月）"切到"日+周双轨滚动 quota（$20/月）"——这是 Cognition 接手后的"产品-定价一体化"重塑。Cascade 是其多步 agent。
**定价逻辑**：Pro $20（月）/ Max $200 / Teams $40/席位 / Enterprise 询价（~$60+/席位）。**独有自有模型 SWE-1 / SWE-1.5**（按消息计费，**是赛道里唯一不按 token 计费的主流模型**），配合 GPT-5、Claude Sonnet 4.6、Gemini 3.1 Pro（按 token 超额）。**Enterprise 唯一支持 FedRAMP High（AWS GovCloud + Palantir FedStart）**——这是合规党选择 Windsurf 的最大理由。
**社区口碑**：收购后用户对"Cognition 能不能把 Windsurf 做好"有怀疑但总体乐观。**最大争议**："$15→$20 涨价 + 月度信用→日+周 quota"让"爆发型 sprint"用户明显吃亏。**最被低估的优势**是合规齐全——金融、政府、医疗团队的"AI 编程 IDE 默认选项"。

### 10. Devin / Genie / Factory（AI 软件工程师类）
**核心定位**：Cognition Devin 是赛道**第一个"按结果/任务"计费**的玩家。**2025 年 4 月 Devin 2.0 把入场价从 $500/月砍到 $20/月（96% 降幅）**——震惊业内。**Core $20/月 + $2.25/ACU**（按用量 pay-as-you-go），**Team $500/月含 250 ACU**（额外 $2.00/ACU）。
**定价逻辑**：**ACU（Agent Compute Unit）= 一次"主动工作 15 分钟"的算力**。简单 bug fix 用 2–3 ACU（~$5），复杂迁移来回对话 30 ACU（~$67）。**最大问题：Devin 不预报价、任务完成才出账单**——异步工作流（Slack/GitHub 触发）经常让用户"在发票来之前都不知道花了多少"。**无自动停止机制**——团队必须手动设 ACU 上限。
**社区口碑**：**典型轻用户月 $70（$20 + $50 ACU）**，但生产环境**团队用户月 $300–500 是常态**。Genie / Factory 是同一赛道的次主流玩家，定价更"项目制"。**Devin 在 SWE-bench 上仍是 agent 类 Top 1**（80%+），但**用户对"账单不可预测"的吐槽从未停过**。

---

## 四、按月 vs 按 token：两种模式的深度对比

| 维度 | 按月订阅（Cursor/Copilot/Codex Pro/Claude Max） | 按 token（API + Aider/Cline/Continue + Codex API） |
|------|------------------------------------------------|----------------------------------------------------|
| **用户成本可预测性** | ✅ 月费封顶 | ❌ 月底才知道花了多少 |
| **重度用户成本** | ✅ 边际成本趋近于零 | ❌ 烧得多花得多 |
| **轻度用户成本** | ❌ 哪怕不用也付 $20 | ✅ 几乎为零 |
| **公司侧成本可控** | ❌ 公司不知道开发者一个月到底花多少 | ✅ 公司可设硬上限 |
| **并行/多 agent 友好** | ❌ 订阅额是"单人单窗口" | ✅ 无并发限制 |
| **模型自由** | ❌ 通常锁特定供应商 | ✅ 任何模型可接 |
| **典型"踩坑"模式** | 用不到一半额度=浪费；用超了=被降级 | 月底 $300 账单惊吓；自动化任务失控 |
| **最契合场景** | 个人/小团队、固定工作流 | 重度玩家、多 agent 编排、CI/CD |

### 2026 年的明确信号

1. **大企业开始反按 token 化**——微软叫停 Claude Code 转 Copilot 是标志性事件。CFO 层面 "51 倍成本差 vs 工程师偏好" 的拉锯中，**Copilot/Cursor/Codex 这种"订阅+池化信用"是大企业最舒服的折中**。

2. **AI Coding 工具正在分化为"两套定价哲学"**：
   - **哲学 A**（订阅派）：把 token 成本藏在月度信用里——Cursor、Copilot、Codex、Claude Max 都是。优点：用户心理负担低；缺点：超额时往往突然降速或加价。
   - **哲学 B**（按量派）：Aider/Cline/Continue+BYOK、Devin ACU、Codex API、Claude API。优点：透明；缺点：用户必须懂 token 经济。

3. **"按月 $20"是赛道价格公约数**——Cursor Pro、Windsurf Pro、Codex Plus、Claude Pro 全是 $20；Pro 5x $100 / Max 5x $100 / Codex Pro 5x $100 出现"集体中端同步"；Ultra $200 / Max 20x $200 / Codex Pro 20x $200 出现"集体高端同步"。**三档对齐不是巧合，是"市场发现"**。

4. **按 token 计费的"创口贴"是 prompt caching**——Anthropic 90%、OpenAI 90%、DeepSeek 90%。一次会话内 prefix caching 普遍能命中 60–80% 的输入 token，**实际成本往往只有标价的 20–40%**。

---

## 五、Token 经济学：单价比拼 + 上下文长度竞争

### 5.1 当前主流模型 token 单价（每百万 token，2026-06）

| 厂商 | 模型 | 上下文 | 输入 $ | 输出 $ | 缓存输入 $ |
|------|------|--------|--------|--------|------------|
| **OpenAI** | GPT-5.5 | 1M | 5.00 | 30.00 | 0.50 |
| | GPT-5.4 | 1M | 2.50 | 15.00 | 0.25 |
| | GPT-5.4-pro（推理）| 1M | 30.00 | 180.00 | — |
| | GPT-5.4-mini | 400K | 0.75 | 4.50 | 0.075 |
| | GPT-5.4-nano | — | 0.20 | 1.25 | 0.02 |
| | GPT-5.3-Codex | 400K | 1.75 | 14.00 | 0.175 |
| **Anthropic** | Claude Fable 5 | 1M | 10.00 | 50.00 | 1.00 |
| | Claude Opus 4.8/4.7/4.6 | 1M | 5.00 | 25.00 | 0.50 |
| | Claude Sonnet 4.6 | 1M | 3.00 | 15.00 | 0.30 |
| | Claude Haiku 4.5 | 200K | 1.00 | 5.00 | 0.10 |
| **Google** | Gemini 3.1 Pro | 1M | 2.00 / 4.00（>200K 加价） | 12.00 / 18.00 | 0.20 |
| | Gemini 3.5 Flash | — | 1.50 | 9.00 | 0.15 |
| **DeepSeek** | V4 Pro | 1M | **0.435** | **0.87** | 0.0036 |
| | V4 Flash | 1M | **0.14** | **0.28** | 0.0028 |
| **Alibaba** | Qwen3.5-Plus | 1M | 0.40 / 0.50（>256K） | 2.40 / 3.00 | — |
| **Moonshot** | Kimi K2.6 | 262K | 0.95 | 4.00 | — |
| | Kimi K2.5 | 262K | 0.60 | 3.00 | — |
| **Meta** | Llama 4 Scout | **10M** | **免费（自托管）** | 免费 | — |

### 5.2 关键观察

- **DeepSeek V4 Flash 是绝对低价王**——$0.14/$0.28 每百万 token，比 Claude Fable 5 便宜 **71 倍**（输入）和 **179 倍**（输出）。SWE-bench Verified 上仍有 80.6%——几乎是 frontier 模型打 1/100 的价格。
- **GPT-5.4-pro 是 2026 年最贵的"日常坑"**——$30/$180，没有 cache 折扣。一周 50M token 就烧 $12K。**默认使用它会直接破产**。
- **GPT-5.4-mini / Claude Haiku 4.5 / DeepSeek V4 Pro 是"3 大省钱主力"**——价格都在 $0.5–$1.0 输入区间，处理 70–80% 的常规任务。
- **Sonnet 4.6 / GPT-5.4 / Gemini 3.1 Pro 是"主流档"**——$2.5–$3.0 输入，编码质量上明显比 mini 强一档但价格是 mini 的 3–4 倍。
- **Opus 4.8 / Fable 5 / GPT-5.5 是"顶配档"**——价格再翻倍，但 5–10% 的边际质量提升。

### 5.3 上下文长度的定价冲击

| 上下文长度 | 含义 | 定价影响 |
|------------|------|----------|
| **200K** | Claude Haiku 4.5、Claude Sonnet/Opus 4.5、GPT-5.3-Codex、Kimi 2.5/2.6 | 主流档，无加价 |
| **400K** | GPT-5.4-mini、GPT-5.3-Codex | 中长档，OpenAI 标准价 |
| **1M** | Claude Sonnet 4.6/Opus 4.6/4.7/4.8、GPT-5.4/5.5、Gemini 3.1 Pro、DeepSeek V4、Qwen 3.5 | Anthropic/OpenAI/DeepSeek **无加价**；Gemini **>200K 加价 2x**；Qwen **>256K 微涨** |
| **10M** | Llama 4 Scout（开源） | 自托管免费，托管方按需定价 |

**"上下文越卖越长"对定价的影响**：
- 表面上 1M 上下文让"喂整库"成为可能；
- 实际上一次 API 调用的**累计输入 token** 才是成本关键——**Opus 4.7+ 的新 tokenizer 会让同样文本多算 35% token**，是 2026 年最隐蔽的成本上涨。
- Anthropic 取消 200K+ 加价、DeepSeek/Qwen 提供 1M 上下文不加价是 2026 年最受欢迎的"政策红利"。

---

## 六、社区真实声音（Reddit / HN 风格）

> 以下为综合 r/ClaudeAI、r/cursor、r/Codex、r/LocalLLaMA、HN 2025-2026 的高频吐槽与赞美。

### 6.1 Cursor 的真实账单

- "我 6 月开 Pro，3 周就烧完了 225 次 Claude Sonnet 配额，**Pro+ 又贵一倍，Ultra 200 刀我又用不完**——典型中间档陷阱。"
- "用了 Tab 补全 + Chat 跑了一周大概 $14，结果一天 agent 跑 PR review 烧了 $18，**单次超过月费**。"
- "Hobby 免费层能撑 50 次慢速 premium 任务，但**一个复杂 refactor 就要 10–15 次**，根本不够用。"

### 6.2 Claude Code 的"周上限"事件

- **2025 年 8 月 28 日**Anthropic 加了周上限，**"Claude Is Dead" 帖拿到 841 赞**（Anthropic 官方回应 400+ 赞），是 2025–2026 AI 编程圈最具影响力的负面舆情。
- "我 $200/月 Max 用户，**周三就用完了一周的额度**，后面两天只能切到 Sonnet，Opus 直接被锁。"
- "API 跑了 8 个月，**100 亿 token 花了 $15K**；同期 Max 订阅 $100/月只花了 $800，**省了 93%**——这就是为什么大家选 Max 而不是纯 API。"
- METR 评测：经验丰富开发者用 Claude Code 反而**慢 19%**——在 HN 上被广泛传开作为"清醒剂"。
- "我失业了还在订阅 Claude Code，**因为它真的帮我找到下家**"——pawelduda 的这句评论是 2026 年最被引用的"价值证明"。

### 6.3 Codex 新模式的真实评价

- "**Pro 5x 是 Claude Max 5x 的对标产品**，价格对齐、额度 5x Plus——OpenAI 这次很明确。"
- "Plus 5h 额度**10 分钟就用光了**——把 5.3-Codex 切到 5.4-mini 之后能撑到 60–350 消息，**mini 是真的省**。"
- "Codex-only seat 的 PAYG 模式对商业实体最舒服，**没速率限制、admin 可设硬上限**——比 Claude Code 周上限友好太多。"
- "Fast mode 翻倍烧信用，**默认开着月底账单会很刺激**。"

### 6.4 Cline / Aider / Continue 的 BYOK 派

- "我把 Cursor Pro 砍了，**Cline + Claude API key + Ollama 本地模型** 三个月，账单从 $240 降到 $85。"
- "Aider + DeepSeek V3 是**SWE-bench 上 80% 分数 + 1/10 价格**的组合，没人讨论它是因为没法靠它融资。"
- "Continue 从 Solo Free 改成 Starter $3/M，**我被偷走了免费午餐**——算了反正 OSS 还能用。"

### 6.5 微软"叫停 Claude Code"事件（2026 年 6 月）

- "内部邮件说 6/30 前必须停 Claude Code，**原因是月度 AI 预算被 $2,000/工程师/月**烧穿，转 GitHub Copilot CLI。"
- "$2,000/工程师 vs $39/席位，**CFO 不会算这个数**——你敢说他就会裁你的工具预算。"
- "这件事提醒我们：个人订阅是给个人用的，**企业规模必须走 Enterprise 池化**，否则会被一封邮件停掉。"

### 6.6 Devin 的"不可预测账单"

- "Core $20/月**听起来便宜**——但异步触发后**你不知道它什么时候烧了 30 ACU**，月底看到 $400 发票血压升高。"
- "Devin **不做预报价**，任务完成才出账单——这种"按结果付费"反人类，**因为结果是"它觉得"的结果**。"
- "Teams $500/月 包含 250 ACU，**用满之后 $2/ACU 续杯**——**有 admin 控制**是 Devin 唯一靠谱的'企业模式'。"

### 6.7 Windsurf 涨价 / 改 quota

- "$15 → $20 涨价我接受，**500 月度信用改成日+周双轨才是真坑**——我做 release 前一周连着爆肝 3 天，**直接撞日上限**。"
- "Windsurf 唯一对手 Cursor 都没有的功能：**FedRAMP High、HIPAA、SOC2 Type II**——合规党没得选。"

---

## 七、用户视角的"迁移故事"

| 起点 | → 终点 | 触发原因 | 备注 |
|------|--------|----------|------|
| Cursor Pro $20 | Claude Max $100 | Cursor Pro 不够用、Pro+ 太贵 | r/ClaudeAI 2025 Q4 高频迁移方向 |
| Cursor Pro $20 | Codex Pro 5x $100 | 想要 GPT-5.3-Codex + 多 agent | 多见于 GPT 死忠 |
| Cursor Pro $20 | Cline + Ollama | 想完全自托管 | r/LocalLLaMA 标配迁移 |
| Claude Max $200 | Claude API 纯按 token | 跑自动化/CI/CD 不需要订阅 | "订阅额度被自动化烧掉" 是高频原因 |
| Aider | Claude Code | 想要"完整 agent 编排 + 浏览器/终端控制" | Aider 仍是"纯 pair programming" |
| Cline | Cursor Pro | BYOK 太操心、想"开箱即用" | 反向迁移的代表 |
| Devin Core | Claude Max 5x | Devin 单任务 $5–50 太贵，Claude Code 一天能跑 50+ 任务 | 2026 年新趋势 |
| Copilot Pro $10 | Cursor Pro $20 | 模型选择 + Composer agent 体验 | "升级档"迁移 |

**关键观察**：2026 年的迁移**很少是从一个 IDE 跳到另一个 IDE**，**而是从"订阅"跳到"API"**——背后逻辑是"订阅额度限制让我没法跑多 agent/自动化，API 反而便宜"。

---

## 八、独立开发者真实月账单曝光

| 开发者画像 | 工具组合 | 月账单 |
|------------|----------|--------|
| **学生 / 偶尔写代码** | Cursor Hobby + GitHub Copilot Free | $0 |
| **业余项目 / 周末 coder** | Claude Pro $20 | $20 |
| **全职初级开发** | Cursor Pro $20 + Copilot Pro $10 | $30 |
| **全职中级开发（个人订阅派）** | Claude Max 5x $100 + 偶尔 Copilot | $100–$120 |
| **全职高级开发（多 agent 派）** | Claude Max 20x $200 + Codex Pro 5x $100 | $300 |
| **AI 编程博主 / 评测人** | Claude Max 20x $200 + Codex Pro 20x $200 + Copilot Max $100 | $500 |
| **独立 SaaS 全栈** | Aider + DeepSeek V3（$60/月 API） | $60–$100 |
| **BYOK 极客** | Cline + Ollama 本地 + 偶发 API | $5–$30 |
| **10 人小团队** | 5× Cursor Pro + 5× Copilot Pro = $150；或 5× Claude Max 5x = $500 | $150–$500 |
| **50 人企业研发** | Copilot Enterprise 池化 $39/席位 | $1,950（池化后） |
| **100 人大厂** | Copilot Enterprise + 自建 Continue Hub 备份 | $3,900–$5,000 |
| **AI 自动化极客（pipeline 派）** | OpenAI API 50M token/周 + Claude API 20M token/周 | $1,500–$2,000 |
| **疯狂 optimizer** | DeepSeek V4 Pro 100M token/周 | $50–$100 |
| **Microsoft 内部工程师（被叫停 Claude Code 前）** | Claude Max 20x + Codex Pro 20x + 多模型组合 | $2,000（这就是他们被叫停的原因） |

---

## 九、结论与决策框架

### 9.1 给"按月订阅派"用户的建议

- **轻度**（每周 1–3 次）：Cursor Hobby / Copilot Free / Claude Pro $20 → 选最便宜的
- **中度**（每天 1–2 小时）：Cursor Pro $20 / Copilot Pro+ $39 / Claude Pro $20 / Codex Plus $20 → 看模型偏好
- **重度**（每天 4+ 小时）：Cursor Pro+ $60 / Copilot Max $100 / Claude Max 5x $100 / Codex Pro 5x $100 → 关键看你是 GPT 派还是 Claude 派
- **极限**（多 agent / CI/CD）：Ultra $200 / Max 20x $200 / Codex Pro 20x $200 → 三家**几乎对齐** $200

### 9.2 给"按 token 派"用户的建议

- **预算敏感 + 重度任务**：DeepSeek V4 Pro / MiniMax M3 / Qwen 3.5-Plus，**1/10 到 1/30 价格**
- **质量敏感 + 任意预算**：Claude Sonnet 4.6 / GPT-5.4 / Gemini 3.1 Pro，**SWE-bench Top 3** 且价格 $2.5–$3
- **顶配推理**（5% 的关键场景）：Claude Opus 4.8 / Fable 5 / GPT-5.4-pro
- **批处理 / CI/CD**：**Batch / Flex 50% 折扣必开**——能把 Anthropic Opus 从 $5/$25 拉到 $2.5/$12.5

### 9.3 给企业的建议

- **10 人以内**：Windsurf Teams $40/席位 或 Cursor Teams $40/席位
- **10–100 人**：GitHub Copilot Business $19/席位 + Enterprise 池化 = 最有 ROI 的选择
- **100+ 人 + 合规要求**（金融/政府/医疗）：Windsurf Enterprise（FedRAMP High 唯一） 或 Copilot Enterprise（SAML SSO 全套）
- **AI 自动化优先**（研发平台 / DevOps）：**继续用按 token，但必须设硬上限 + admin 池化**——这是微软叫停 Claude Code 教给行业的最大教训

### 9.4 2026 H2 趋势预测

1. **Codex Pro 5x $100 的"中端补位"会逼迫 Claude Code 进一步松绑周上限**——Anthropic 7 月初 +50% 是开始
2. **GitHub Copilot Max $100 是微软对"个人重度"的明确回应**——AI Credits 计费让企业 admin 第一次能精准控制个人预算
3. **Windsurf Enterprise 的 FedRAMP High 是 2026 年最大合规差异化**——其他玩家（H18）会追
4. **"按 token + 路由"是新的省钱模板**——Haiku 4.5 / GPT-5.4-mini / DeepSeek V4 Pro 三选一当 router
5. **"按结果计费"（Devin）短期内不会被大企业接受**——不可预测的账单是 CFO 杀手
6. **开源工具（Aider/Cline/Continue）的护城河是"模型自由 + 数据本地"**——监管收紧时是最大筹码

---

## 十、最终结论

**OpenAI Codex 在 2026 年 4 月的"按 token 改革"是 AI Coding 赛道从"按请求"集体向"按使用"迁移的**最后一块拼图**。**

至此，整个赛道的定价图谱已清晰呈现为**三档对齐 + 两种哲学**：

- **三档对齐**：$20 个人档 / $100 中端档 / $200 高端档——Cursor、Copilot、Codex、Claude Code、Windsurf **五家同步**
- **两种哲学**：
  - **订阅派**（包月 + 信用池）——用户低焦虑、企业易管控
  - **API 派**（按 token）——模型自由、可自动化、但企业必须设硬上限

**Codex 的真正创新不在"按 token 计费"本身**（Cursor、Windsurf 早就走了），**而在引入 Pro 5x $100 中间档**——这是 OpenAI 第一次明确为"AI 编程重度个人用户"定价。

**2026 年下半年最值得关注的三个变量**：
1. Claude Code 的"周上限"是否会进一步松绑（取决于 OpenAI 是否再加码）
2. Cursor 3 的"Agent-first"界面能否重塑 Pro 的"中间档陷阱"
3. Windsurf 在 Cognition 接管后能否用"合规 + 自有模型"差异化破局

**最终选择建议**：**别只看月费，看 6 个月总账单 + 你的实际使用模式**——轻度用户选订阅最划算，重度 + 多 agent 用户选 API 才不被订阅额度绑架。

---

*报告数据截止 2026-06-14 · 引用来源：13 篇 2026 年权威评测 + Cursor/Copilot/Codex/Claude/Windsurf/Devin/Aider/Cline/Continue 官方定价页 + Reddit/HN 社区反馈*
