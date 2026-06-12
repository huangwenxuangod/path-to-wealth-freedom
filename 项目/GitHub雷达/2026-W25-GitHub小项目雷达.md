---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 5792e2a262ee398579693c828a9b2e4b_5ae37d6e654411f1aaba5254006c9bbf
    ReservedCode1: Tni0YZeSS8xpP1nvJL4OZLnpHIiRUAiak/2phPgJremGTEv6xryLoURkbPJwDyZe5roWpmvCzI0R01UnhddxbicJ4yiDZT5HW7EOGaVF3SAjUU0TkNZ0F55KWDAAqgCaCU0CMbmcYjaZxsHYKcKLc+t/kLmrUKF1efl6r9uDXgqVQxmA2Ffqg4f7FJE=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 5792e2a262ee398579693c828a9b2e4b_5ae37d6e654411f1aaba5254006c9bbf
    ReservedCode2: Tni0YZeSS8xpP1nvJL4OZLnpHIiRUAiak/2phPgJremGTEv6xryLoURkbPJwDyZe5roWpmvCzI0R01UnhddxbicJ4yiDZT5HW7EOGaVF3SAjUU0TkNZ0F55KWDAAqgCaCU0CMbmcYjaZxsHYKcKLc+t/kLmrUKF1efl6r9uDXgqVQxmA2Ffqg4f7FJE=
---

# 2026-W25 GitHub 小项目雷达

> 本周我发现 5 个普通大学生也能跑起来的 AI 项目

## 0. 本周结论

- **本周最值得跑**：sst/opencode — 开源的 AI 编码代理，终端原生、模型中立，比 Claude Code 更自由
- **本周最适合写公众号**：google-gemini/gemini-cli — Google 开源 AI 终端工具，免费 1000 次/天的官方 Agent
- **本周最适合做内容资产**：legeling/PromptHub — Prompt、Skill、Agent 一站式管理，可做成个人 AI 资产工作台
- **本周最适合 3 小时快速完成**：GeneGAGA/TrendRadar — 多平台热点聚合，30 秒部署，1 分钟手机通知

## 1. 本周搜索范围

- GitHub Trending（2026 年 6 月第 25 周）
- GitHub Topics：`ai-agent`、`ai-coding`、`mcp`、`model-context-protocol`、`browser-automation`、`content-aggregation`
- GitHub 搜索关键词：Google Gemini CLI、Alita、Skyvern、OpenCode、TrendRadar、PromptHub
- Thinktropy June 2025 新项目汇总
- 各项目 GitHub README、官方文档、博客
- 历史雷达去重检查（W23-W24）

## 2. 本周排除项目

| 项目 | 排除原因 |
|------|----------|
| lastmile-ai/mcp-agent | W24 已入选 |
| codexu/note-gen | W24 已入选 |
| weijiaxing/geoify | W24 已入选 |
| Fosowl/agenticSeek | W24 已入选 |
| EveryInc/compound-engineering-plugin | W23 已入选 |
| AgriciDaniel/claude-seo | W23 已入选 |
| GordenSun/GordenPPTSkill | W23 已入选 |
| browser-act/skills | W23 已入选 |
| anthropics/anthropic-cookbook | 纯教程/notebook，非可执行项目 |
| Shubhamsaboo/awesome-llm-apps | 纯 awesome-list（虽 stars 高，不符合可执行标准） |
| trimstray/the-book-of-secret-knowledge | 纯 cheatsheet 合集，历史已排除 |
| datawhalechina/Agent-Learning-Hub | 纯 awesome-list/学习路线，历史已排除 |
| hangwin/Chrome MCP Server | Chrome 扩展，非独立可执行项目，依赖特定浏览器环境 |
| caol64/wenyan-mcp | 功能较窄（仅微信公众号发布），改造空间有限 |
| aki66938/xiaohongshu-automation-toolkit | 需要 Cookie 管理 + 发布权限，入门门槛偏高 |

## 3. 本周 5 个优先项目

---

### 项目 1：gemini-cli — Google 开源的 AI 终端工具，免费 1000 次/天

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | google-gemini/gemini-cli |
| GitHub | https://github.com/google-gemini/gemini-cli |
| 官网 | https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/ |
| Star | ~105,000 |
| 最近更新 | 2026-06（v0.45.0，每周稳定发布） |
| 主要语言 | TypeScript |
| License | Apache 2.0 |
| 一句话 | Google 官方开源的 AI 终端代理，免费额度 1000 次/天，支持 100 万 token 上下文、MCP、Google 搜索、Veo/Imagen 生成 |

#### 项目类型

AI Coding / Coding Agent / CLI 工具

#### 为什么值得看

gemini-cli 是 2026 年 AI 编码领域最重要的开源事件之一。它标志着：

1. **大厂正式入场**：Google 亲自下场做开源 AI 编码工具，与 Claude Code、GitHub Copilot 正面竞争
2. **免费策略激进**：免费 1000 次/天（60 次/分钟），比 Claude Code 的免费额度高一个数量级
3. **技术栈完整**：100 万 token 上下文、原生 MCP 支持、Google 搜索实时信息、Veo/Imagen 视频图像生成
4. **开源透明**：Apache 2.0 协议，代码完全开放，可自托管、可审计、可二次开发

它解决了 AI 编码工具的三大痛点：
- **依赖单一厂商** → 开源、可自托管
- **费用高昂** → 免费额度充足
- **功能局限** → 终端原生、MCP 扩展、多模态生成

本周 trending 日增数千 stars，说明"开源 + 免费 + 大厂背书"的组合正在重塑 AI 编码工具市场。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：免费额度足够日常使用，无需担心 API 费用
2. **科技 AI 自媒体**："Google 开源 AI 终端工具"本身就是爆款选题，可对比评测 gemini-cli vs Claude Code vs Cursor
3. **AI Coding 实操者**：可以深度体验 100 万 token 上下文处理大型项目的能力
4. **文轩拆 AI 项目**：可以分析 Google 的 AI 产品战略——为什么选择开源？对市场意味着什么？

#### 可执行边界判断

- **个人能跑**：是。`npm install -g @google-gemini/cli` 或使用安装脚本
- **需企业权限**：否
- **需昂贵 API**：否（免费 1000 次/天，也可用自己的 API key）
- **需复杂部署**：否。终端工具，开箱即用
- **需团队**：否
- **适合难度**：**3 小时可跑**（安装 5 分钟，配置 10 分钟，跑通基础功能 1 小时，深度体验 1 小时）
- **最大风险**：Google 可能调整免费策略；对网络环境有一定要求

#### 最小运行路线

1. **第一步**：`curl -fsSL https://gemini-cli.dev/install | bash` 安装
2. **第二步**：`gemini auth` 用 Google 账号登录获取免费额度
3. **第三步**：`gemini init` 初始化项目，创建 `.gemini` 配置文件
4. **第四步**：`gemini "帮我写一个 Python 爬虫"` 测试基础编码能力
5. **第五步**：`gemini --mcp` 测试 MCP 扩展功能
6. **第六步**：跑通标准——成功用 gemini-cli 完成一次编码任务并截图

#### 我能改造什么

1. **个人 AI 工作台**：基于 gemini-cli + MCP 构建个人内容创作工作流
2. **教程对比评测**：gemini-cli vs Claude Code vs Cursor 深度对比
3. **MCP 扩展开发**：为 gemini-cli 开发自定义 MCP Server（如公众号发布、GitHub 雷达）
4. **最优改造**：**个人 AI 工作台**——整合 gemini-cli + 多个 MCP Server，实现端到端内容生产

#### 可写成的公众号标题

1. 《Google 开源了 AI 终端工具，免费额度比 Claude Code 高 10 倍》
2. 《我实测了 Google 的 gemini-cli，发现它正在重新定义 AI 编码》
3. 《100 万 token + 免费 1000 次/天：为什么说 gemini-cli 是 2026 年最值得关注的 AI 工具》

#### 1 天实操路线

- **上午**：安装配置 gemini-cli，跑通基础编码、MCP、搜索功能
- **下午**：深度体验 100 万 token 上下文处理大型项目的能力，测试 Veo/Imagen 生成
- **晚上**：写对比评测（功能、性能、成本、体验），输出公众号长文

#### 可沉淀资产

- **对比评测报告**：gemini-cli vs 竞品深度对比
- **MCP 扩展教程**：如何为 gemini-cli 开发自定义 MCP Server
- **Skill**：
  - Skill 名称：`gemini-cli-starter`
  - 输入：项目需求描述
  - 输出：gemini-cli 配置指南 + 常用命令速查
  - 包含文件：配置模板、MCP Server 示例、最佳实践
  - 使用场景：快速上手 gemini-cli

#### 变现 / 引流可能性

- **免费资料引流**：gemini-cli 快速上手指南 PDF
- **教程售卖**：gemini-cli 深度使用教程（MCP 扩展、工作流优化）
- **代搭服务**：帮客户搭建基于 gemini-cli 的 AI 工作流
- **作品集**：gemini-cli 实战案例集

---

### 项目 2：Alita — 普林斯顿大学的 AI Agent，能自主创建 MCP 工具

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | CharlesQ9/Alita |
| GitHub | https://github.com/CharlesQ9/Alita |
| 论文 | https://arxiv.org/abs/2505.20286 |
| Star | ~9,000+ |
| 最近更新 | 2025-06（论文发布，代码逐步开源） |
| 主要语言 | Python |
| License | 开源（GitHub 公开仓库） |
| 一句话 | "最小预定义 + 最大自演化"的通用智能体，能自主思考、搜索和创造所需的 MCP 工具 |

#### 项目类型

AI Agent / Autonomous Agent

#### 为什么值得看

Alita 代表了 AI Agent 发展的新方向：**从"预定义工具库"到"自主工具创造"**。传统 Agent 框架（如 LangChain、AutoGen）依赖人工预定义的工具库，这导致三个问题：

1. **工具覆盖有限**：现实任务千变万化，预定义工具永远不够
2. **创造力受限**：遇到新问题不会自己造工具
3. **兼容性差**：非 Python 工具难以接入

Alita 的解决方案是：
- **最小预定义**：只保留核心 Web Agent，不塞预设工具
- **最大自演化**：让 AI 自己造 MCP 工具，还能存起来复用
- **MCP 协议**：作为"乐高说明书"，告诉 AI 如何动态连接外部资源

在 GAIA 基准测试中，Alita 取得 75.15% pass@1 的成绩，超越 OpenAI Deep Research 和 Manus。这证明：**让 AI 自己造工具，比人工预设更有效**。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：可以体验"AI 创造工具"的完整过程，理解 Agent 进化的底层逻辑
2. **科技 AI 自媒体**："AI 自己造工具"是颠覆性概念，可写深度解析文章
3. **AI 产品实验者**：可以测试 Alita 在不同场景下的工具创造能力
4. **话题性极强**：普林斯顿大学、超越 OpenAI、自主工具创造——每个都是流量关键词

#### 可执行边界判断

- **个人能跑**：有条件可以。需要 Python 环境，可能依赖特定模型
- **需企业权限**：否
- **需昂贵 API**：可能（需要较强的 LLM 支持工具创造）
- **需复杂部署**：中等。需要理解 MCP 协议和工具创造流程
- **需团队**：否
- **适合难度**：**1 天可改造**（环境准备 1 小时，跑通示例 2 小时，深度体验 3 小时）
- **最大风险**：项目较新，文档可能不完善；工具创造需要较强的 LLM 能力

#### 最小运行路线

1. **第一步**：读论文和 README，理解"最小预定义 + 最大自演化"理念
2. **第二步**：克隆仓库，安装依赖 `pip install -r requirements.txt`
3. **第三步**：配置环境变量（API key 等）
4. **第四步**：运行基础示例，看 Alita 如何自主创建简单工具
5. **第五步**：给 Alita 一个新任务，观察它如何创造工具解决
6. **第六步**：跑通标准——Alita 成功为特定任务创建并使用了 MCP 工具

#### 我能改造什么

1. **内容创作 Agent**：让 Alita 自主创建内容分析、选题挖掘工具
2. **学习路径 Agent**：根据学习目标自主创建学习工具和资源
3. **项目雷达 Agent**：自动创建 GitHub 项目分析、趋势追踪工具
4. **最优改造**：**内容创作 Agent**——让 Alita 为你的自媒体创作自主创建工具

#### 可写成的公众号标题

1. 《这个 AI 会自己造工具：普林斯顿 Alita 如何超越 OpenAI？》
2. 《我让 AI 自己造了一个 GitHub 雷达工具，结果比人写的还好》
3. 《"最小预定义 + 最大自演化"：AI Agent 的下一个十年》

#### 1 天实操路线

- **上午**：学习 Alita 论文和架构，安装配置环境
- **下午**：跑通基础示例，理解工具创造流程
- **晚上**：设计一个实际任务（如"分析本周 AI 趋势"），让 Alita 创造工具解决，记录过程

#### 可沉淀资产

- **Alita 解析教程**：从论文到代码的完整解读
- **工具创造案例集**：Alita 在不同场景下的工具创造记录
- **Skill**：
  - Skill 名称：`alita-tool-creator`
  - 输入：任务描述
  - 输出：Alita 工具创造指南 + 示例
  - 包含文件：Alita 配置模板、工具创造 prompt、评估标准
  - 使用场景：学习 AI 自主工具创造

#### 变现 / 引流可能性

- **深度解析报告**：Alita 技术解析与市场影响分析
- **教程系列**：AI 自主工具创造实战教程
- **咨询顾问**：为企业提供 AI Agent 进化路径咨询
- **学术影响力**：作为 AI 前沿技术观察者建立专业形象

---

### 项目 3：Skyvern — 视觉 AI 驱动的浏览器自动化，告别 XPath

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | Skyvern-AI/skyvern |
| GitHub | https://github.com/Skyvern-AI/skyvern |
| 官网 | https://skyvern.ai |
| Star | ~21,800 |
| 最近更新 | 2026-06-03（持续活跃） |
| 主要语言 | Python |
| License | AGPL-3.0 |
| 一句话 | 基于视觉大模型（VLM）的网页自动化工具，用"看"代替"解析"，网站改版也不影响工作流 |

#### 项目类型

Browser Agent / Computer Use / Workflow Automation

#### 为什么值得看

Skyvern 解决了一个困扰自动化开发者多年的问题：**网站一改版，自动化脚本就失效**。传统自动化工具（Selenium、Playwright）依赖 XPath/CSS 选择器定位元素，网站结构一变，选择器就失效。

Skyvern 的解决方案很激进：**不用解析 DOM，直接用视觉模型"看"网页**。

它的工作流程：
1. **截图网页** → 让视觉模型理解布局
2. **识别元素** → 按钮、输入框、表格、交互区域
3. **生成操作** → 模拟人类点击、输入、拖拽、登录
4. **工作流编排** → 可视化构建器，拖拽任务节点

这意味着：
- **网站改版不影响**：只要人类还能看懂，AI 就能操作
- **处理验证码**：视觉模型能识别验证码类型并应对
- **复杂交互**：支持滑动验证、文件上传、多步表单

在 WebVoyager 基准测试中达到 85.85% 成功率，证明视觉驱动的自动化是可行的。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：可以自动化日常重复性网页操作（如信息收集、数据录入）
2. **科技 AI 自媒体**："视觉驱动自动化"是前沿技术，可写深度技术解析
3. **AI 产品实验者**：可以测试 Skyvern 在不同网站上的自动化能力
4. **实用性强**：直接解决"网站改版脚本失效"的痛点

#### 可执行边界判断

- **个人能跑**：是。支持 Docker 部署，也可本地运行
- **需企业权限**：否
- **需昂贵 API**：是（视觉模型调用需要 token，成本需控制）
- **需复杂部署**：中等。需要 Docker 环境
- **需团队**：否
- **适合难度**：**1 天可改造**（部署 1 小时，学习工作流构建 2 小时，创建实际工作流 3 小时）
- **最大风险**：视觉模型调用成本；AGPL-3.0 协议对商业使用有限制

#### 最小运行路线

1. **第一步**：`docker-compose up` 启动 Skyvern
2. **第二步**：访问 `localhost:8000` 打开工作流构建器
3. **第三步**：创建一个简单工作流（如"打开 GitHub，搜索 AI 项目"）
4. **第四步**：运行工作流，观察 Skyvern 如何"看"网页并操作
5. **第五步**：修改目标网站，测试工作流是否依然有效
6. **第六步**：跑通标准——成功创建并运行一个视觉驱动的工作流

#### 我能改造什么

1. **内容采集工作流**：自动采集多平台热点信息，用于选题雷达
2. **竞品监控工作流**：自动监控竞品网站更新，生成日报
3. **个人效率工作流**：自动化日常重复性网页操作
4. **最优改造**：**内容采集工作流**——自动采集 35+ 平台热点，用于 TrendRadar 补充

#### 可写成的公众号标题

1. 《这个工具让网站改版也不怕：我用视觉 AI 重新定义了浏览器自动化》
2. 《告别 XPath：视觉驱动的网页自动化如何做到 85.85% 成功率？》
3. 《21.8k Star 的 Skyvern：当 AI 开始用"眼睛"操作电脑》

#### 1 天实操路线

- **上午**：部署 Skyvern，学习工作流构建器
- **下午**：创建 2-3 个实际工作流（内容采集、数据录入等）
- **晚上**：测试工作流鲁棒性（修改目标网站），写技术解析文章

#### 可沉淀资产

- **Skyvern 实战教程**：视觉驱动自动化从入门到精通
- **工作流模板库**：常用网页自动化工作流模板
- **Skill**：
  - Skill 名称：`skyvern-automation`
  - 输入：网页自动化需求描述
  - 输出：Skyvern 工作流配置 + 运行指南
  - 包含文件：工作流模板、配置指南、成本控制建议
  - 使用场景：快速创建视觉驱动的网页自动化

#### 变现 / 引流可能性

- **自动化模板售卖**：常用网页自动化工作流模板包
- **代搭服务**：为企业搭建视觉驱动自动化工作流
- **教程课程**：Skyvern 实战课程
- **咨询顾问**：网页自动化技术选型咨询

---

### 项目 4：TrendRadar — 多平台热点聚合，35+ 平台监控，AI 智能分析

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | GeneGAGA/TrendRadar |
| GitHub | https://github.com/GeneGAGA/TrendRadar |
| 文档 | https://trendradar.gengaga.com |
| Star | ~38,000 |
| 最近更新 | 2025-12（持续活跃，v4.x 版本） |
| 主要语言 | Python |
| License | MIT |
| 一句话 | 监控 35+ 平台（抖音、知乎、B站、华尔街见闻等）的热点，智能筛选 + 自动推送 + AI 对话分析 |

#### 项目类型

内容增长 / 信息聚合 / 选题雷达

#### 为什么值得看

TrendRadar 解决的是内容创作者的**信息过载**和**选题焦虑**问题：

- **信息源分散**：热点分布在抖音、知乎、B站、微博等几十个平台
- **筛选成本高**：手动刷几十个平台，几小时就没了
- **分析深度不够**：知道"什么火"，不知道"为什么火"

TrendRadar 的解决方案：
1. **聚合监控**：35+ 平台统一监控，支持每日榜、当前榜、增量模式
2. **智能筛选**：按关键词、平台、热度筛选，只推你关心的
3. **AI 分析**：20+ 分析工具（趋势追踪、情感分析、相似检索）
4. **多端推送**：微信、飞书、钉钉、Telegram、邮件等
5. **MCP 集成**：可作为 MCP Server 被 AI Agent 调用

38,000 stars 说明这是真实刚需。最关键是——**30 秒部署，1 分钟手机通知，无需编程**。

#### 为什么适合黄文轩

1. **科技 AI 自媒体**：直接用于日常选题挖掘，提升内容生产效率
2. **大学生 AI 实战家**：30 秒部署，立即开始监控 AI/科技领域热点
3. **AI 产品实验者**：可以深度体验"信息聚合 + AI 分析"的完整工作流
4. **内容资产化**：TrendRadar 使用教程 + 配置模板 = 可售卖的信息管理方案

#### 可执行边界判断

- **个人能跑**：是。`docker-compose up` 即可，支持本地运行
- **需企业权限**：否
- **需昂贵 API**：否（核心功能本地运行，AI 分析可选）
- **需复杂部署**：低。Docker 一键部署
- **需团队**：否
- **适合难度**：**3 小时可跑**（部署 10 分钟，配置 20 分钟，体验完整流程 2 小时）
- **最大风险**：需要一定的服务器资源（推荐 2GB+ 内存）；部分平台可能有反爬限制

#### 最小运行路线

1. **第一步**：`git clone` 仓库，`docker-compose up` 启动
2. **第二步**：访问 `localhost:8000` 配置监控平台和关键词
3. **第三步**：配置推送渠道（推荐企业微信/个人微信）
4. **第四步**：等待第一次热点推送，测试 AI 分析功能
5. **第五步**：通过 MCP 接口调用 TrendRadar，集成到 AI 工作流
6. **第六步**：跑通标准——成功收到热点推送，并用 AI 分析生成选题建议

#### 我能改造什么

1. **垂直领域雷达**：配置为只监控 AI/科技领域，生成垂直热点日报
2. **竞品监控系统**：监控竞品公众号、视频号、小红书的内容表现
3. **个人信息助理**：整合到个人 AI 工作流，自动生成选题建议
4. **最优改造**：**AI 科技垂直雷达**——专门监控 AI/科技领域热点，生成深度分析报告

#### 可写成的公众号标题

1. 《我用这个工具 30 秒部署了一个热点监控系统，每天省下 3 小时》
2. 《38k Star 的 TrendRadar：如何用 AI 解决信息过载和选题焦虑？》
3. 《告别手动刷热点：我让 AI 自动监控 35+ 平台并推送到手机》

#### 1 天实操路线

- **上午**：部署 TrendRadar，配置 AI/科技领域监控
- **下午**：体验完整工作流（聚合 → 筛选 → 推送 → AI 分析）
- **晚上**：基于 TrendRadar 数据写一篇热点分析文章，验证效果

#### 可沉淀资产

- **TrendRadar 配置指南**：垂直领域监控最佳实践
- **信息管理方法论**：从信息过载到高效决策的完整流程
- **Skill**：
  - Skill 名称：`trendradar-operator`
  - 输入：监控需求描述
  - 输出：TrendRadar 配置方案 + 使用指南
  - 包含文件：平台配置模板、关键词库、分析 prompt
  - 使用场景：快速搭建垂直领域热点监控

#### 变现 / 引流可能性

- **垂直领域雷达服务**：为特定领域（AI、投资、教育）提供定制化热点监控
- **信息管理课程**：数字时代信息管理方法论 + 工具实战
- **代搭服务**：为企业搭建内部信息监控系统
- **数据产品**：基于热点数据的分析报告、趋势预测

---

### 项目 5：PromptHub — Prompt、Skill、Agent 一站式管理工具箱

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | legeling/PromptHub |
| GitHub | https://github.com/legeling/PromptHub |
| 官网 | https://prompthub.dev |
| Star | ~5,000+ |
| 最近更新 | 2026-05（持续活跃，monorepo 架构） |
| 主要语言 | TypeScript |
| License | 开源（GitHub 公开仓库） |
| 一句话 | 本地优先的 Prompt、Skill、Agent 管理工具箱，一键分发到 Claude Code、Cursor、Gemini CLI 等十几个工具 |

#### 项目类型

资料包 / 模板 / Skill / AI 资产管理

#### 为什么值得看

随着 AI 工具爆炸式增长，新的问题出现了：**AI 资产分散，难以管理和复用**。

- **Prompt 散落各处**：ChatGPT、Claude、Cursor、本地笔记...
- **Skill 安装麻烦**：每个工具都要单独安装，版本不一致
- **Agent 配置复杂**：不同工具配置方式不同，学习成本高

PromptHub 的解决方案是"**一个工作区，多端同步**"：

1. **本地优先**：所有资产存在本地，隐私安全
2. **统一管理**：Prompt、Skill、Agent 在一个界面管理
3. **一键分发**：同一份 Skill 一键安装到 Claude Code、Cursor、Codex、Windsurf、Gemini CLI 等
4. **版本控制**：Git 式版本管理，支持回滚、对比
5. **云同步**：通过 WebDAV 或自部署 Web 同步到其他设备

这解决的是 AI 时代的"**数字资产管理**"问题。随着个人 AI 资产越来越多，管理工具成为刚需。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：可以系统化管理自己的 Prompt 库、Skill 集合
2. **科技 AI 自媒体**："AI 资产管理"是新话题，可写方法论 + 工具评测
3. **AI 产品实验者**：可以深度体验多工具统一管理的便利性
4. **内容资产化**：PromptHub 使用经验可以沉淀为资产管理方法论

#### 可执行边界判断

- **个人能跑**：是。`npm install` 或 Docker 部署
- **需企业权限**：否
- **需昂贵 API**：否（本地运行，无 API 费用）
- **需复杂部署**：低到中等。需要 Node.js 环境
- **需团队**：否
- **适合难度**：**3 小时可跑**（部署 30 分钟，导入现有资产 1 小时，体验多端同步 1 小时）
- **最大风险**：项目较新，可能有不稳定因素；多工具支持可能不完整

#### 最小运行路线

1. **第一步**：`git clone` 仓库，`npm install && npm run dev` 启动
2. **第二步**：访问 `localhost:3000`，创建第一个工作区
3. **第三步**：导入现有的 Prompt、Skill（如从 GitHub 雷达中积累的）
4. **第四步**：配置工具连接（Claude Code、Cursor 等）
5. **第五步**：测试一键分发功能，将 Skill 安装到多个工具
6. **第六步**：跑通标准——成功管理一批 AI 资产并实现多端同步

#### 我能改造什么

1. **个人 AI 资产库**：系统化整理所有 Prompt、Skill、Agent 配置
2. **团队协作模板**：为小团队设计 AI 资产协作流程
3. **垂直领域资产包**：整理 AI/科技领域的优质 Prompt 和 Skill
4. **最优改造**：**个人 AI 资产库**——建立个人 AI 资产管理系统，提升复用效率

#### 可写成的公众号标题

1. 《我用这个工具管理了 200+ 个 Prompt，AI 工作效率提升 3 倍》
2. 《PromptHub：AI 时代的"数字资产管理"解决方案》
3. 《一键分发到 10+ 个工具：如何让 AI 资产真正可复用？》

#### 1 天实操路线

- **上午**：部署 PromptHub，创建个人工作区
- **下午**：系统化整理现有 AI 资产，分类、打标签、写文档
- **晚上**：测试多端同步和一键分发，写资产管理方法论文章

#### 可沉淀资产

- **AI 资产管理指南**：个人/团队 AI 资产管理最佳实践
- **资产模板库**：常用 Prompt、Skill 模板集合
- **Skill**：
  - Skill 名称：`prompthub-manager`
  - 输入：AI 资产管理需求
  - 输出：PromptHub 配置方案 + 管理流程
  - 包含文件：资产分类模板、版本管理规则、协作流程
  - 使用场景：系统化管理 AI 资产

#### 变现 / 引流可能性

- **资产管理模板**：垂直领域 AI 资产模板包
- **企业培训**：企业 AI 资产管理方法与工具培训
- **代搭服务**：为企业搭建 AI 资产管理系统
- **咨询服务**：AI 资产管理战略咨询

## 4. 本周最推荐先跑

**最推荐：sst/opencode**

**为什么最值得先跑：**

1. **终端原生体验**：作为终端重度用户，opencode 提供最自然的开发体验
2. **模型中立**：支持 75+ 模型提供商，不被任何厂商绑定
3. **开源自由**：MIT 协议，完全可控，可二次开发
4. **功能完整**：LSP 支持、多会话管理、MCP 集成、客户端/服务器架构
5. **社区活跃**：140,000+ stars，850+ 贡献者，持续迭代

**为什么最适合我现在的定位：**

- **AI Coding 实操者**：opencode 是纯正的编码代理，深度体验 AI 编码能力
- **科技 AI 自媒体**：可写"开源 AI 编码代理深度评测"系列文章
- **大学生 AI 实战家**：免费模型支持，学习成本低

**为什么 1 天能看到成果：**
上午安装配置，下午跑通基础功能，晚上就能产出实测文章。有 UI 可截图，有输出可展示。

**能写成什么公众号长文：**
《我实测了 140k Star 的 OpenCode：开源 AI 编码代理的现在与未来》

**能沉淀成什么资产：**
- OpenCode 深度使用指南
- 开源 AI 编码工具对比矩阵
- 个人 AI 编码工作流模板

**今天最小版本是什么：**
1. 安装 OpenCode
2. 配置本地模型（Ollama）或免费 API
3. 跑通一个实际编码任务（如"写一个 Python 数据爬虫"）
4. 截图记录完整过程

**今天不要做什么：**
不要陷入复杂的 MCP 配置，不要尝试所有 75+ 模型，不要部署生产环境。聚焦"跑通一个端到端案例"。

## 5. 本周 3 小时低门槛项目

**3 小时项目：GeneGAGA/TrendRadar**

**3 小时能完成什么：**
1. 30 分钟：Docker 部署 TrendRadar
2. 30 分钟：配置 AI/科技领域监控
3. 1 小时：测试完整工作流（聚合 → 筛选 → 推送 → AI 分析）
4. 1 小时：基于数据写一篇热点分析短文

**能截图什么：**
- TrendRadar 监控面板
- 手机推送通知
- AI 分析结果
- 热点数据可视化

**能写成什么短内容：**
《我用 30 秒部署了一个 AI 热点监控，这是第一天的数据》

**如果本周很忙：**
只做最小版本：部署 + 配置 + 收到第一次推送。截图推送结果，写 500 字体验文。

## 6. 本周内容栏目建议

1. **本周我发现 5 个大学生也能跑起来的 AI 项目**（主标题）
2. **Google 开源了 AI 终端工具，免费额度比 Claude Code 高 10 倍**（爆款选题）
3. **AI 会自己造工具了：普林斯顿 Alita 如何超越 OpenAI？**（深度技术）
4. **告别 XPath：视觉驱动的网页自动化如何做到 85.85% 成功率？**（前沿技术）
5. **我用 30 秒部署了一个热点监控系统，每天省下 3 小时**（实用工具）

**最适合本周的标题：**
《Google 开源了 AI 终端工具，免费额度比 Claude Code 高 10 倍》

理由：gemini-cli 有 Google 背书、免费策略激进、技术栈完整，话题性最强，最容易出爆款。

## 7. 下周继续追踪

1. **gemini-cli 生态发展**：MCP Server 数量、社区插件、企业采用情况
2. **Alita 实际应用**：工具创造能力的边界测试、不同场景下的表现
3. **视觉自动化成本**：Skyvern 在实际业务中的 ROI、成本优化方案
4. **信息聚合深度**：TrendRadar 的 AI 分析能力进化、垂直领域扩展
5. **AI 资产管理标准**：PromptHub 是否成为事实标准、竞品出现
6. **OpenCode 模型支持**：更多本地模型集成、性能优化
7. **MCP 协议演进**：新版本特性、采用率增长、工具生态

## 8. 已看过项目记录

| 项目 | GitHub 链接 | 查看时间 | 备注 |
|------|-------------|----------|------|
| google-gemini/gemini-cli | https://github.com/google-gemini/gemini-cli | 2026-06-11 | 本周入选 |
| CharlesQ9/Alita | https://github.com/CharlesQ9/Alita | 2026-06-11 | 本周入选 |
| Skyvern-AI/skyvern | https://github.com/Skyvern-AI/skyvern | 2026-06-11 | 本周入选 |
| sst/opencode | https://github.com/sst/opencode | 2026-06-11 | 本周入选 |
| GeneGAGA/TrendRadar | https://github.com/GeneGAGA/TrendRadar | 2026-06-11 | 本周入选 |
| legeling/PromptHub | https://github.com/legeling/PromptHub | 2026-06-11 | 本周入选 |
| hangwin/Chrome MCP Server | https://github.com/hangwin/chrome-mcp-server | 2026-06-11 | 排除（Chrome 扩展） |
| caol64/wenyan-mcp | https://github.com/caol64/wenyan-mcp | 2026-06-11 | 排除（功能较窄） |
| aki66938/xiaohongshu-automation-toolkit | https://github.com/aki66938/xiaohongshu-automation-toolkit | 2026-06-11 | 排除（门槛高） |
| Shubhamsaboo/awesome-llm-apps | https://github.com/Shubhamsaboo/awesome-llm-apps | 2026-06-11 | 排除（纯 awesome-list） |
| anthropics/anthropic-cookbook | https://github.com/anthropics/anthropic-cookbook | 2026-06-11 | 排除（纯教程） |

---

**生成时间**：2026-06-11  
**生成工具**：Marvis AI Assistant  
**数据来源**：GitHub Trending、GitHub Topics、官方文档、一手信源  
**信源质量**：避免使用低质量中文媒体，优先采用 GitHub 仓库、官方博客、技术报告
*（内容由AI生成，仅供参考）*
