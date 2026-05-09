---
date: 2026-05-08
type: 热点雷达·深度版
status: draft
source:
  - https://www.anthropic.com/research/building-effective-agents
  - https://www.anthropic.com/engineering/managed-agents
  - https://arxiv.org/abs/2604.14228
  - https://openai.com/index/harness-engineering/
  - https://openai.com/index/unlocking-the-codex-harness/
  - https://developers.openai.com/codex/subagents
  - https://www.langchain.com/blog/choosing-the-right-multi-agent-architecture
  - https://devblogs.microsoft.com/agent-framework/agent-harness-in-agent-framework/
  - https://auth0.com/blog/mcp-vs-a2a/
  - https://github.com/VILA-Lab/Dive-into-Claude-Code/blob/main/docs/architecture.md
tags: [AI-Agent, Multi-Agent, Claude, Codex, Harness-Engineering, MCP, A2A]
quality_score: 9
---

# 多 Agent vs 单 Agent 架构深度拆解：为什么 Anthropic 和 OpenAI 走向了同一条路的两个极端

## ① 事件穿透（为什么这件事值得现在看）

2025-2026 年，AI Agent 从「概念验证」进入「生产落地」阶段。但一个核心架构问题正在分化整个生态：

**到底该用单 Agent 还是多 Agent？**

- Anthropic 的多 Agent 研究系统比单 Agent Claude Opus 4 **性能提升 90.2%**，但 Token 消耗增加 **15 倍**
- OpenAI Codex 的 Harness 工程团队用 **5 个月零手写代码** 构建了一个完整产品，核心发现是「Harness 比 Model 更重要」
- Google 联合 50+ 技术伙伴发布 A2A 协议，试图统一 Agent 间通信标准
- Claude Code 被反编译研究发现：**98.4% 是基础设施代码，只有 1.6% 是 AI 决策逻辑**

这件事的重要性在于：它揭示了 AI Agent 的**真正瓶颈不在模型能力，而在工程架构**。谁先搞清楚 Harness 工程、Agent 通信协议和上下文管理，谁就能在生产环境拉开代差。

---

## ② 技术拆解：单 Agent 与多 Agent 的底层差异

### 2.1 架构本质差异

**单 Agent = 一个 LLM + 一个 while(true) 循环**

所有工作在一个上下文窗口内完成。模型自己决定：思考 → 调用工具 → 观察结果 → 再思考。这就是经典的 ReAct（Reasoning + Acting）循环。

**多 Agent = 一个协调器 + N 个专门化 Agent**

工作被分配到不同 Agent，每个 Agent 有自己的角色、Prompt、工具集和上下文窗口。协调器（Orchestrator/Supervisor）负责任务拆分、结果收集和冲突仲裁。

| 维度 | 单 Agent | 多 Agent |
|------|----------|----------|
| 上下文窗口 | 一个，所有任务共享 | 多个，每个 Agent 独立 |
| 工具调用 | 直接调用，顺序执行 | 协调器路由，可并行 |
| 失败恢复 | 依赖重试和回滚 | 单个 Agent 失败不影响其他 |
| 调试难度 | 低，只有一个执行流 | 高，需要追踪跨 Agent 通信 |
| Token 成本 | 线性增长 | 可能 10-15 倍（Anthropic 实测） |
| 适用场景 | 明确边界、工具少、流程固定 | 复杂问题、需要多种专业能力 |

### 2.2 为什么多 Agent 在某些场景下性能提升 90%？

Anthropic 的内部研究表明，多 Agent 研究系统相比单 Agent 的核心优势来自三个技术机制：

**1. 上下文隔离（Context Isolation）**

单 Agent 在处理复杂任务时，工具调用结果、中间推理过程和最终答案全部挤在一个上下文窗口里。这会导致：
- 上下文污染：前面的错误推理污染后续决策
- 注意力稀释：模型在 200K 上下文中「找不到」关键信息
- 幻觉增加：长上下文中的信息冲突诱发幻觉

多 Agent 把不同任务放在独立上下文窗口。例如 Anthropic 的研究系统中：
- LeadResearcher 负责规划，只持有轻量级引用
- 每个 Subagent 只探索一个分支，结果以摘要形式返回
- CitationAgent 专门处理引用定位，不干扰主流程

**2. 并行执行（Parallel Execution）**

当需要同时探索多个假设时，单 Agent 只能串行处理：
```
探索假设 A → 等待结果 → 探索假设 B → 等待结果 → 整合
```

多 Agent 可以并行：
```
探索假设 A ─┐
探索假设 B ─┼→ 协调器整合
探索假设 C ─┘
```

Anthropic 实测：复杂查询的**研究时间缩短 90%**。

**3. 专业化分工（Specialization）**

每个 Agent 可以被配置为特定领域的专家：
- 代码生成 Agent：配备代码执行工具、单元测试工具
- 研究 Agent：配备搜索引擎、论文数据库、引用管理工具
- 审核 Agent：专门检查一致性和合规性

这种分工让 Prompt 更聚焦，工具集更精简，减少了「选择困难」（模型在 50 个工具中找不到该用哪个）。

### 2.3 技术天花板：多 Agent 不是银弹

**并行写操作的冲突问题**

多 Agent 在「读取型」任务（研究、探索、验证）上表现优异，但在「写入型」任务（代码编辑、文档修改）上存在根本性难题：
- Agent A 修改了函数签名
- Agent B 同时修改了调用该函数的代码
- 合并时产生冲突，需要人工介入或复杂的自动合并算法

OpenAI Codex 的解决方案是 **worktree 隔离**：每个子 Agent 在自己的代码副本上工作，结果以 diff 形式返回，由父 Agent 统一应用。

**Token 成本爆炸**

Anthropic 的多 Agent 研究系统 Token 消耗是单 Agent 的 **15 倍**。这不是线性的：
- 每个子 Agent 有自己的系统 Prompt（通常 2K-5K tokens）
- 每个子 Agent 重复加载相同的工具定义
- 协调器需要整合所有子 Agent 的输出

对于成本敏感的应用，这是一个致命限制。

**协调复杂度**

当 Agent 数量超过 3-5 个时，协调器的决策负担会指数级增长。需要回答：
- 哪个 Agent 适合这个任务？
- 什么时候该启动新 Agent？
- 如何处理 Agent 之间的冲突输出？
- 什么时候该终止整个流程？

这催生了专门的「Harness 工程」领域。

---

## ③ Harness 工程：Agent 的真正战场

### 3.1 什么是 Harness？

**Agent = Model + Harness**

模型提供推理能力，Harness 是把推理转化为工作的全部软件基础设施。包括：
- **循环管理**：while(true) 的执行流、终止条件、错误恢复
- **工具编排**：哪些工具可用、什么时候调用、怎么处理结果
- **上下文管理**：什么时候压缩、怎么压缩、保留什么丢弃什么
- **权限控制**：哪些操作需要人工审批、安全沙箱边界
- **状态持久化**：会话怎么保存、怎么恢复、怎么跨会话传递

Anthropic 把 Harness 描述为「the loop that calls Claude and routes tool calls」。OpenAI 则称之为「everything around the model that decides how the agent works」。

### 3.2 为什么 Harness 比 Model 更重要？

OpenAI 的 Harness 工程团队进行了一个**为期 5 个月的极端实验**：

他们用 Agent 自己写代码，目标是构建一个完整产品。**零手写代码**，全部由 Agent 生成。核心发现：

> "Before agents: Discipline shows up in the code. With agents: Discipline shows up in the scaffolding."
>
> （有 Agent 之前：纪律体现在代码里。有 Agent 之后：纪律体现在脚手架里。）

他们的结论：生产级 Agent 的可靠性**不是由模型权重决定的，而是由 Harness 决定的**。同样的模型，换一套 Harness，可以从 Top 30 提升到 Top 5。

### 3.3 Harness 的三层架构

行业正在形成共识，Agent 基础设施分为三层：

| 层级 | 代表 | 职责 |
|------|------|------|
| **Agent Framework** | LangChain | 提供抽象概念、心智模型、构建块 |
| **Agent Runtime** | LangGraph | 处理生产基础设施：持久执行、流式传输、检查点、人在回路 |
| **Agent Harness** | Claude Code SDK, Codex | 「开箱即用」的完整系统：预置 Prompt、工具调用处理、规划工具、文件系统访问 |

**Framework** 教你「怎么思考 Agent」，**Runtime** 帮你「把 Agent 跑起来」，**Harness** 则是「直接能用的 Agent」。

### 3.4 Claude Code 的 Harness 实现：98.4% 是基础设施

佛罗里达大学对 Claude Code 进行了完整的逆向工程研究（arXiv:2604.14228），发现其架构的核心特征：

**核心循环极简：**
```typescript
// query.ts 中的核心逻辑
while (true) {
  // 1. 组装上下文
  // 2. 调用模型
  // 3. 分派工具调用
  // 4. 收集结果
  // 5. 检查是否终止
}
```

**但周边系统极其复杂：**
- **48+ 内置工具**：从文件编辑到代码搜索到测试执行
- **8 层安全架构**：工具预过滤 → Deny-first 规则 → 权限模式 → 分类器 → Shell 沙箱 → Hook 拦截 → 会话级权限 → 远程 Kill Switch
- **5 层上下文压缩**：Budget reduction → Snip → Microcompact → Context Collapse → Auto-compact
- **9 阶段 Turn Pipeline**：Settings → State Init → Context Assembly → 5 个 Pre-model Shapers → Model Invocation → Tool Dispatch → Permission Gate → Execution → Stop Check

**关键设计洞察：上下文是稀缺资源。**

Claude Code 实现了 5 层压缩管道，按成本从低到高执行：
1. **Budget reduction**：每条消息设置上限
2. **Snip**：直接丢弃旧消息
3. **Microcompact**：缓存编辑块锁定，延迟清理直到安全
4. **Context Collapse**：「只读投影」——原始消息不被修改，只发送虚拟压缩视图给 API
5. **Auto-compact**：调用 `compactConversation()`，使用 13K token 缓冲区 + 断路器

**安全架构：Deny by Default**

Claude Code 的安全栈有 8 层，任何一层都可以阻止操作：
1. 工具预过滤（从模型视野中移除禁用工具）
2. Deny-first 规则（Deny 永远覆盖 Allow）
3. 7 种权限模式（从 `plan` 到 `bypassPermissions`）
4. 两阶段分类器（快速过滤 + Chain-of-Thought）
5. Shell 沙箱（危险命令硬编码限制）
6. 27 个生命周期 Hook
7. 会话级权限（权限不跨会话持久化）
8. 服务端 Kill Switch（GrowthBook flags 远程禁用）

### 3.5 Codex 的 Harness 实现：Statelessness as a Feature

OpenAI Codex 走了另一条路：**刻意保持无状态**。

**为什么无状态？**

合规要求。Codex 避免使用 `previous_response_id`，确保每个请求都是独立的，不保留用户数据。

**但无状态不等于低效：**

Codex 通过**激进的 Prompt Caching** 实现线性（而非二次）成本增长：
- 因为旧 Prompt 总是新 Prompt 的精确前缀，所以可以命中缓存
- 缓存命中需要精确前缀匹配，所以静态内容放在变量用户数据之前
- 当接近 Token 限制时，调用专门的 Compaction Endpoint，用 `encrypted_content` 保存模型对之前对话的「潜在理解」

**AGENTS.md：被低估的生产力武器**

OpenAI 团队最初的 `AGENTS.md` 是一份百科全书式的文档，结果失败了——"context is a scarce resource"。 oversized 的指令文档挤占了任务和源文件的上下文空间。

解决方案：
- `AGENTS.md` 作为**目录**（~100 行），不是百科全书
- 顶层文件引用嵌套的 `docs/` 层级
- 类比到 `CLAUDE.md`：控制在 100 行以内，最好少于 60 行，只包含通用指导

**强制架构规则：**

OpenAI 团队规定了严格的方向性层级：Types → Config → Repo → Service → Runtime → UI，依赖严格向前流动。跨领域关注点（认证、遥测）只能通过显式 Provider 接口进入。

这些规则通过**自定义 Linter、结构测试和 CI 机械执行**。失败消息包含修复步骤（例如："Error: Service layer cannot import from UI layer"），把错误变成 Agent 后续修复的上下文提示。

---

## ④ Agent 之间的沟通：协议战争

Agent 生态正在围绕三个互补协议形成共识：**MCP**、**A2A** 和 **ACP**。

### 4.1 MCP（Model Context Protocol）：Agent-to-Tool 的标准

**开发者**：Anthropic
**定位**：Agent 的「通用工具带」
**机制**：
- 传输：HTTP 上的 JSON-RPC 2.0
- 方法：`tools/list`（发现工具）、`tools/call`（调用工具）
- 作用：标准化 LLM 连接外部 API、数据源和服务的方式

**技术细节：**

Claude Code 中的 MCP 实现：
- 工具按分区排序以保持 Prompt Cache 稳定性：内置工具作为稳定前缀，MCP 工具单独追加
- 动态工具搜索：按需加载工具定义，只在需要时才注入上下文
- OAuth 代理：从安全 Vault 获取 Token，凭证不进入沙箱

**MCP 的边界：**

MCP 只标准化了「接口契约」（怎么发现工具、怎么调用），但**不解决**：
- OAuth 2.0 生命周期管理
- 限流处理
- 合规日志
- 按用户权限隔离

生产系统必须在这些层面自己实现。

### 4.2 A2A（Agent-to-Agent Protocol）：Agent-to-Agent 的标准

**开发者**：Google Cloud（联合 50+ 技术伙伴，包括 LangChain、Salesforce、SAP、ServiceNow）
**定位**：Agent 的「协作层」
**机制**：
- 传输：HTTP 上的 JSON，SSE 或 Webhooks 用于实时通信
- 核心概念：**Agent Cards**——自发布的 JSON 配置文件，宣告 Agent 的能力、端点和认证要求
- 流程：客户端 Agent 发现远程 Agent → 读取 Agent Card → 分配任务 → 收集并行输出 → 组装统一响应

**与 MCP 的关系：**

MCP 和 A2A 是**互补**的，不是竞争的：
- MCP 提供「基础语法」——访问工具和数据
- A2A 提供「协作层」——跨 Agent 分配工作
- 实践中，A2A 参与者内部通常用 MCP 连接本地工具

### 4.3 ACP（Agent Communication Protocol）：Agent 的 HTTP

**开发者**：BeeAI + Linux Foundation
**定位**：「Agent 的 HTTP」
**机制**：开发者友好的 REST API，标准化 Agent-to-Agent 消息传递，不规定内部 Agent 设计

### 4.4 实际通信模式：文件系统作为共享账本

除了标准化协议，实际生产中最常用的通信模式出奇地简单：

**文件系统作为共享账本（Filesystem as Ledger）**

Anthropic、OpenAI 和 Harness 工程文献中反复出现的模式：
- Agent A 将结果写入 `REQUIREMENTS.md`
- Agent B 读取该文件，继续工作
- Agent C 将进度更新到 `AGENT_TASKS.md`
- 协调器通过读取这些文件了解全局状态

这种模式的优势：
- **持久化**：文件系统天然持久，Agent 崩溃不会丢失状态
- **可观察**：人类可以直接查看文件了解 Agent 在做什么
- **版本控制**：可以 git commit 每次 Agent 的修改，实现审计和回滚
- **零依赖**：不需要消息队列或 RPC 框架

Anthropic 的 Long-Running Agent 模式就是典型例子：
- **Initializer Agent**：创建 `init.sh`（环境复现脚本）、`claude-progress.txt`（进度日志）、初始 git commit
- **Coding Agent**：每次会话读取进度日志 → 选择一个未完成的需求 → 实现 → git commit → 更新进度日志
- **Handoff Protocol**：新 Agent 启动时执行 `pwd` → 扫描 git 历史 → 读取进度记录 → 通过 `init.sh` 启动服务 → 验证基线行为

---

## ⑤ 工具调用：从 JSON 到执行的技术全链路

### 5.1 六阶段执行循环

现代工具调用遵循六个阶段：

**1. 动态发现（Dynamic Discovery）**

系统检索可用工具定义。MCP 使用 `tools/list`。高级系统如 Anthropic 的 Tool Search 动态检索定义，防止上下文饱和（在 Agent 需要 30+ 工具时，Token 使用量减少 ~85%）。

**2. 模式定义（Schema Definition）**

开发者将工具定义为 JSON Schema，描述函数名、参数、类型和描述。这些 Schema 被注入模型的上下文窗口。

**3. Prompt 组装（Context Assembly）**

用户请求 + 工具 Schema + 历史对话 = 完整 Prompt。

**4. 模型预测（Model Prediction）**

LLM 分析 Prompt。如果识别到能力缺口，输出结构化 JSON payload（`tool_call` 对象），包含工具名和参数，而不是生成纯文本。

**5. 执行（Execution）**

宿主环境（不是 LLM 本身）执行：
- 验证 JSON 是否符合 Schema
- 通过 OAuth 或 API Key 认证
- 执行 API/数据库/Shell 调用
- 处理错误

**6. 响应集成（Response Integration）**

工具输出被反馈到模型的上下文窗口，作为交错消息。模型进行最终推理，给出答案或链式调用更多工具。

### 5.2 生产执行层的真正挑战

让模型输出有效 JSON 只是 10% 的工作，90% 的工程挑战在执行层：

**认证管理**

模型不能管理 OAuth 2.0 握手或存储 API Key。Harness 必须从安全 Vault 注入凭证。Anthropic 的实现：专用代理从 Vault 获取 Token，凭证不进入沙箱。

**错误处理**

- 技术错误（网络超时、429 限流）：基础设施层静默重试，指数退避
- 逻辑错误（无效参数、Schema 漂移）：返回给模型，让它推理出不同方案

**响应规范化**

不同 API 的响应格式千差万别。必须通过转换层规范化后再反馈给模型，防止 Schema 漂移污染上下文窗口。

**人在回路（Human-in-the-Loop）**

敏感操作需要审批门控。Claude Code 的实现：
```
模型请求工具调用 → Harness 显示命令和参数 → 用户确认 (y/n) → 执行或拒绝
```

### 5.3 工具设计的反直觉原则

Anthropic 在 SWE-bench Agent 上的经验：

> "We actually spent more time optimizing our tools than the overall prompt."
>
> （我们优化工具的时间比优化整体 Prompt 还多。）

他们只暴露了两个工具给模型：
1. **Bash tool**：执行 Shell 命令，跨调用保持状态
2. **Edit tool**：支持 view、create、`str_replace`、insert、`undo_edit`

工程决策：
- 要求**绝对路径**，避免相对路径错误
- 使用**精确匹配字符串替换**（`old_str` 必须精确匹配一行或多行连续文本），确保可靠性
- 在工具描述中直接嵌入**详细护栏**
- 不约束模型遵循固定的 THOUGHT → ACTION → OBSERVATION 顺序
- 鼓励长回复："Your thinking should be thorough and so it's fine if it's very long."

**另一个反直觉原则：工具越少越好。**

> "Ten focused tools outperform fifty overlapping ones."

当工具数量超过 20 个时，模型开始出现「选择困难」——不知道该用哪个工具，或者错误地组合工具。解决方案是：
- 合并功能到高级工具（例如一个 `schedule_event` 代替 find-availability + schedule）
- 用命名空间前缀分组（`calendar_` 开头的是日历工具）
- 提供 `response_format` 控制让 Agent 切换详细程度
- 分页、过滤、截断来优化上下文数量

---

## ⑥ 竞品横评：Claude Code vs Codex vs LangGraph

| 维度 | Claude Code (Anthropic) | Codex (OpenAI) | LangGraph (LangChain) |
|------|------------------------|----------------|----------------------|
| **Agent 模型** | 单 Agent 为主，多 Agent 为辅 | 单 Agent 为主，子 Agent 显式触发 | 图编排，支持循环和条件路由 |
| **Harness 哲学** | 98.4% 基础设施，1.6% AI 逻辑 | 零手写代码实验，Harness 即产品 | 运行时层，检查点和持久化 |
| **上下文管理** | 5 层压缩 + 上下文重置 | 无状态 + Prompt Caching + Compaction | StateGraph + Reducers + Checkpointing |
| **安全架构** | 8 层深度防御 | Seatbelt(macOS) / Landlock+seccomp(Linux) | 依赖宿主环境 |
| **Agent 通信** | 文件系统 + POSIX flock | JSON-RPC over stdio / SSE | 图节点间状态传递 |
| **子 Agent 机制** | AgentTool（7x Token）+ SkillTool | 显式触发，max_depth=1, max_threads=6 | Subgraphs + Send/Command |
| **工具调用** | 48+ 内置 + MCP | 顺序执行 parallel_tool_calls=false | 节点内任意逻辑 |
| **状态持久化** | 会话级 JSONL，不跨会话 | 零数据保留，全状态外置 | 线程级 + 跨线程检查点 |
| **适用场景** | 长时运行编码任务 | 快速编码 + 安全隔离 | 复杂工作流编排 |

### 关键差异点

**Claude Code：极致的上下文工程**

Claude Code 的核心竞争力不是模型，而是上下文管理。5 层压缩管道、8 层安全架构、48+ 工具的精心编排，这些都是为了让一个「普通」模型在复杂任务上表现稳定。

他们的理念："The most effective LLM agents are built with simple, composable patterns."（最有效的 Agent 是用简单、可组合的模式构建的。）

**Codex：极致的 Harness 工程**

OpenAI 的 Codex 团队花了 5 个月证明：Agent 可以完全替代手写代码，但前提是 Harness 足够强大。他们的核心洞察：
- 规则优于提示：用 Linter 和 CI 强制架构规则，而不是在 Prompt 里恳求模型遵守
- 自动化验证：用 Chrome DevTools Protocol 自动测试，Agent 自己 act → inspect → retry
- 自动化重构：用后台扫描生成小的、可审查的重构 PR

**LangGraph：极致的编排能力**

LangGraph 不提供 Agent，提供 Agent 的「骨架」。
- StateGraph：用户自定义状态 Schema
- Nodes：每个节点接收当前状态，发出部分状态更新
- Reducers：定义部分更新如何合并到全局状态
- Checkpointer：序列化图结构、节点状态、边转换、消息日志
- Command + Send：单节点返回中组合状态更新和路由，或派发并行任务

当需要「复杂工作流 + 分支逻辑 + 错误恢复 + 可观测性」时，LangGraph 是目前最强的选择。

---

## ⑦ 场景落地（什么场景该用哪种架构）

### 场景 1：复杂研究任务 → 多 Agent

**案例**：Anthropic 的内部研究系统
**架构**：LeadResearcher + 3 个并行 Subagent + 1 个 Critic Agent
**效果**：比单 Agent 性能提升 90.2%，研究时间缩短 90%
**关键决策**：
- 读取型任务可以并行（搜索、分析、验证）
- 写入型任务需要串行或隔离（避免冲突）
- Token 成本增加 15 倍，但对于高质量研究成果可接受

### 场景 2：日常编码助手 → 单 Agent

**案例**：Claude Code、GitHub Copilot
**架构**：单 Agent + 精心设计的工具集
**关键决策**：
- 工具数量控制在 10-20 个，聚焦高频操作
- 上下文压缩比多 Agent 更关键
- 安全沙箱不可妥协（Claude Code 的 8 层安全）

### 场景 3：自动化工作流 → LangGraph

**案例**：数据处理流水线、审批工作流
**架构**：图编排 + 检查点 + 人在回路
**关键决策**：
- 用图节点表示确定性步骤
- 用边表示条件分支
- 检查点实现错误恢复和审计

### 不适合的场景

**实时系统**：Agent 的推理延迟（秒级）不适合毫秒级响应场景
**高并发写入**：多 Agent 的写冲突解决不成熟
**成本敏感型**：Token 成本可能增加 10-15 倍

---

## ⑧ 商业化地图：谁在靠 Agent 架构赚钱

### 方向 1：Agent Harness 基础设施

**真实案例**：LangChain / LangGraph
- **模式**：开源框架 + 企业版支持 + 托管服务
- **定价**：LangSmith 按 tracing 量计费，企业版年费制
- **收入**：估值已达数亿美元级别
- **门槛**：高，需要深厚的工程积累和社区运营
- **适合**：开源项目创始人、技术布道者

**真实案例**：Vercel v0, Replit Agent
- **模式**：把 Agent Harness 打包成产品功能
- **定价**：按使用量或订阅制
- **收入**：作为平台增值功能，提升用户留存和付费转化
- **适合**：已有平台的团队

### 方向 2：垂直领域 Agent

**真实案例**：Devin（Cognition Labs），估值 $2B
- **模式**：针对软件工程的端到端 Agent
- **定价**：$500/月起步
- **核心壁垒**：不是模型，是 Harness + 工具链 + 工作流深度优化
- **适合**：深耕某个垂直领域的团队

**真实案例**：各类 AI SDR（销售开发代表）
- **模式**：自动研究潜在客户、撰写邮件、跟进回复
- **定价**：$100-500/月/席位
- **核心壁垒**：CRM 集成深度 + 行业知识库
- **适合**：有销售背景 + 技术能力的团队

### 方向 3：Agent 咨询和实施服务

**真实案例**：大量涌现的 AI 咨询公司
- **模式**：帮企业设计 Agent 架构、选型、落地
- **定价**：项目制 $50K-$500K
- **核心壁垒**：实际落地经验 + 对多种框架的深入理解
- **适合**：有企业 IT 咨询背景的团队

### 方向 4：开源 Agent 项目 + 商业化

**真实案例**：AutoGen（Microsoft）→ 商业化路径仍在探索
- **模式**：开源框架 → 云服务 / 企业支持
- **挑战**：开源框架的商业模式还不成熟
- **机会**：谁先跑通「开源 Agent 框架的商业化」，谁就是下一个 LangChain

---

## ⑨ 行动建议

### 如果你完全不懂技术

**第一步**：用 Claude Code 或 Cursor 实际写一个小项目（比如一个 Todo App），体验单 Agent 的能力边界。
**第二步**：观察它在什么情况下「卡壳」——通常是任务跨多个领域（编码+设计+部署）。
**第三步**：这时你就知道为什么需要多 Agent 了。

### 如果你有基础技术能力

**第一步**：从单 Agent 开始。选择一个框架（LangChain 或 OpenAI Agents SDK）。
**第二步**：投资工具设计。记住 Anthropic 的经验：工具优化比 Prompt 优化更重要。
**第三步**：当单 Agent 频繁出现上下文污染或工具选择错误时，引入第二个 Agent（比如一个专门做研究的 Subagent）。
**第四步**：用文件系统作为 Agent 间的通信层，简单有效。

### 如果你已经在做 Agent 相关项目

**第一步**：审计你的 Harness。不是看 Prompt 写得好不好，而是看：
- 错误恢复机制是否完善？
- 上下文管理是否会导致 Token 爆炸？
- 安全边界是否清晰？
- 跨会话状态怎么传递？

**第二步**：考虑引入 MCP。如果你的 Agent 需要连接外部工具，MCP 正在成为事实标准。

**第三步**：关注 A2A 的发展。如果 Google 能推动 A2A 成为 Agent 间通信的标准，早期参与者将获得生态优势。

---

## 💡 今日金句

> "Agents are only as effective as the tools we give them. But the tools are only as effective as the harness that orchestrates them."
>
> （Agent 的能力取决于你给它什么工具，但工具的能力取决于编排它们的 Harness。）
>
> —— Anthropic Engineering Blog

---

## 📌 后续跟踪清单

- [ ] **明天关注**：Google A2A 协议的采纳进展，是否有更多平台宣布支持
- [ ] **本周关注**：Claude Code 的逆向工程研究（arXiv:2604.14228）在社区的讨论热度
- [ ] **本周关注**：OpenAI Codex 的 Harness 工程博客是否有后续更新
- [ ] **本月关注**：MCP 协议的扩展，特别是 OAuth 和权限管理的进展
- [ ] **本月关注**：多 Agent 框架的 Token 成本优化是否有突破（目前 15x 是最大瓶颈）
- [ ] **持续跟踪**：Agent Harness 的商业化路径，谁先跑通「开源框架 → 商业服务」的模式
