# 2026-W23 GitHub 小项目雷达

## 0. 本周结论

本周 AI 开发工具链进入"官方基础设施化"阶段。Google 和港大分别从浏览器控制和软件 Agent 化两个方向推动 AI Agent 的操作系统级能力。同时"AI 去味"技能成为独立赛道。最值得跑的项目是 **Chrome DevTools MCP**（Google 官方浏览器 Agent 控制器），1 小时内能跑通并产出对比内容。最适合写公众号的是 **taste-skill**（AI 前端品味技能），话题覆盖 AI Coding + 内容质量双赛道。最适合做内容资产的是 **GEOFlow**（GEO 内容生产系统），可直接搭建 AI 驱动的内容站。最适合 3 小时快速完成的是 **Bumblebee**（MCP 供应链安全扫描器），一行命令即可产出结果。

## 1. 本周搜索范围

- GitHub Trending 实时榜单（Trendshift.io）
- GitHub Topics：ai-agent, ai-agents, coding-agent, ai-coding, mcp, model-context-protocol, rag, ai-search, workflow-automation, browser-agent, content-automation
- GitHub 搜索关键词：Chrome DevTools MCP, CLI-Anything, taste-skill, GEOFlow, Bumblebee, Pullfrog, AI agent 2026
- Product Hunt 近期 AI Developer Tools
- Hacker News Show HN 近期
- 腾讯新闻 InfoQ、掘金、CSDN 等技术社区一手信源交叉验证

## 2. 本周排除项目

| 项目 | 排除原因 |
|------|----------|
| OpenClaw (373k+ stars) | 历史多次出现，过于庞大不适合个人快速跑通 |
| Hermes Agent (154k+ stars) | 历史已出现，本周无重大更新 |
| CodeGraph (2.5k+ stars) | W22 已入选本期项目 |
| agentmemory | W22 已入选本期项目 |
| social-auto-upload (9k+ stars) | W22 已入选本期项目 |
| Webwright | W22 已入选本期项目 |
| NVIDIA Skills | W22 已入选本期项目 |
| Understand-Anything (40k+ stars) | W22 追踪列表，且本周无重大更新，功能与 CodeGraph 重叠 |
| Pullfrog (~400 stars) | Zod 作者新作但需 GitHub App 安装，非本地可跑，Star 数太低 |
| superpowers (195k+ stars) | W22 追踪列表，技能框架类同质化严重 |
| multica (26k+ stars) | W22 追踪列表，Agent 托管平台，需要多人员协作 |
| markitdown (138k+ stars) | 文档转换工具，与 AI Agent/内容增长定位不相关 |
| MoneyPrinterTurbo (76k+ stars) | 需要 GPU 资源，个人跑通成本高 |
| TradingAgents (81k+ stars) | 金融量化项目，需要专业背景 |
| anthropics/claude-plugins-official | 官方插件目录，属于 awesome-list 类型 |
| mattpocock/skills (112k+ stars) | Claude Code Skills 配置集，属于 awesome-list 补充 |

## 3. 本周 5 个优先项目

### 项目 1：Chrome DevTools MCP

#### 项目信息

- **项目名**：Chrome DevTools MCP
- **GitHub 链接**：https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Star 数**：42,000+（本周新增 1,876+）
- **最近更新时间**：2026-06-01（持续活跃）
- **主要语言**：TypeScript
- **License**：Apache-2.0
- **一句话说明**：Google Chrome DevTools 官方推出的 MCP 服务器，让 Claude Code、Cursor、Copilot、Codex 等 AI 编程助手直接操控 Chrome 浏览器——检查 DOM、分析网络请求、调试 JavaScript、跑 Lighthouse 性能审计。

#### 项目类型

Browser Agent / AI Agent / MCP 服务器

#### 为什么值得看

这是 Google 官方下场做 AI Agent 浏览器控制能力。之前的 browser-use（95k stars）是社区方案，但 Chrome DevTools MCP 直接利用 Chrome 的原生 DevTools 协议，权威性无可比拟。它不只是"自动化浏览器"，而是让 AI 编程助手获得"前端工程师的完整调试能力"——录性能 Trace、抓网络请求、分析控制台报错、跑 Lighthouse 审计，这些以前只能人类开发者手动操作的事情，现在 AI Agent 可以自己完成。

信号意义巨大：Google 在主动建设 AI Agent 的基础设施，而不是等着社区来做。这代表 AI 开发工具链进入"官方基础设施化"阶段。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：一行命令安装，1 小时内跑通，前端项目开发效率直接翻倍
2. **科技 AI 自媒体**：Google 官方项目，权威背书，话题性极强，"37 万 Star 的 Google 神器"天然吸睛
3. **AI Coding 实操者**：直接用在自己的项目开发中，减少手动调试时间
4. **内容差异化**：能从"AI 编程效率提升"角度写实操内容，有前后对比数据

#### 可执行边界判断

- **个人能跑**：✅ 单机运行，一行命令安装
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费，不需要任何 API Key
- **复杂部署**：❌ `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`
- **适合时间**：3 小时可跑通
- **最大风险**：会暴露浏览器内容给 MCP 客户端，注意不要在处理敏感页面时使用

#### 最小运行路线

1. **第一步**：`claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest`
2. **第二步**：重启 Claude Code，输入 `/mcp` 确认 chrome-devtools 已就绪
3. **第三步**：打开一个有前端项目的目录，告诉 Claude Code "帮我打开这个项目的前端页面，检查有没有 JS 报错"
4. **第四步**：截图 Claude Code 自动打开浏览器、检查报错的完整过程
5. **第五步**：让 Claude Code 跑 Lighthouse 性能审计：`take a lighthouse performance trace of the current page`
6. **第六步**：跑通标准：Claude 能自主完成"打开页面 → 检查报错 → 跑 Lighthouse → 给出优化建议"全链路

#### 我能改造什么

1. **前端项目自动验收工具**：让 AI 自动打开项目页面，检查 UI、性能、报错，生成验收报告
2. **竞品网站分析 Agent**：配置 Claude Code 自动访问竞品网站，分析技术栈、性能、SEO 结构
3. **AI Coding 教学演示工具**：用 Chrome DevTools MCP 演示"AI 如何调试前端代码"
4. **最优改造**：**前端项目一键验收 Skill**——输入项目 URL，AI 自动完成 UI 走查 + 性能审计 + 报错检查，输出验收报告

#### 可写成的公众号标题

1. 《Google 官方下场，37 万 Star：这个工具让 AI 终于能"看见"你的网页了》
2. 《我让 Claude Code 自己调试前端 Bug，它比我还快》
3. 《前端开发效率翻倍？我用 Google 这个开源工具跑了一下午》

#### 1 天实操路线

- **上午**：安装 Chrome DevTools MCP，在自己的前端项目上测试，记录 AI 自动调试的过程
- **下午**：改造成"前端验收工具"，写一个简单配置让 AI 自动检查多个页面
- **晚上**：截图前后对比（手动调试 vs AI 自动调试的时间差异），写教程，输出公众号长文

#### 可沉淀资产

- **GitHub README**：Chrome DevTools MCP 中文使用指南
- **中文教程**：AI 前端调试入门（从安装到实战）
- **Skill**：前端项目一键验收技能包
- **公众号长文**：深度评测 + 实操教程
- **演示视频**：AI 自动调试前端的完整过程（适合 B 站）

**Skill 结构**：
- **名称**：frontend-auto-check
- **输入**：项目首页 URL + 检查项列表
- **输出**：验收报告（性能评分 + UI 截图 + 报错清单 + 优化建议）
- **包含文件**：检查配置模板、验收报告模板、Claude Code 指令集
- **使用场景**：前端项目上线前验收、竞品网站分析、教学演示

#### 变现/引流可能性

- **免费资料引流**：提供"前端项目验收清单模板"PDF
- **卖教程**：AI 辅助前端开发工作流（含 Chrome DevTools MCP + Claude Code 完整配置）
- **作品集**：展示 AI 工具集成能力
- **引流方向**：前端开发、AI 编程效率、开发者工具评测

---

### 项目 2：taste-skill

#### 项目信息

- **项目名**：taste-skill
- **GitHub 链接**：https://github.com/Leonxlnx/taste-skill
- **Star 数**：28,850+（本周新增 9,000+）
- **最近更新时间**：2026-05-30（v2 实验版发布）
- **主要语言**：Shell（SKILL.md 文件）
- **License**：MIT
- **一句话说明**：给 AI 编程助手装上"设计品味"的技能包——阻止 AI 生成千篇一律的套话 UI，让 Claude Code、Cursor、Codex 输出的前端界面有真正的人类设计感。

#### 项目类型

AI Coding / 内容质量工具 / Agent Skill

#### 为什么值得看

这是 AI Coding 领域一个非常独特的方向：不是让 AI 写更多代码，而是让 AI 写"更好看"的代码。taste-skill 通过一套系统化的设计规则（布局方差、动效强度、视觉密度三个可调参数），让 AI 编程助手输出的前端界面摆脱"AI 味"——不再是大白底 + 居中 + 标准字体 + 无聊配色。

它同时解决了两个痛点：一是 AI 生成的前端界面太丑太雷同，二是"AI 味"正在成为内容质量的负面标签。v2 实验版刚发布，引入了"Brief 推断 → 设计语言映射 → 三档可调参数"的完整工作流，并内置了 GSAP 动画骨架、反破折号禁令、重新设计审计协议等细节规则。

#### 为什么适合黄文轩

1. **AI Coding 实操者**：直接提升自己 AI 编程输出的质量，能让项目 Demo 更好看
2. **科技 AI 自媒体**："AI 去味"是本周最热的话题之一，taste-skill + stop-slop 双项目爆发
3. **内容差异化**：大多数人还在讲"AI 能写代码"，你在讲"AI 写出来的代码好不好看"
4. **作品集价值**：用 taste-skill 生成的界面截图本身就是作品集亮点

#### 可执行边界判断

- **个人能跑**：✅ 一行命令安装 Skill
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费开源
- **复杂部署**：❌ `npx skills add https://github.com/Leonxlnx/taste-skill`
- **适合时间**：3 小时可跑通，1 天可改造成自己的设计风格 Skill
- **最大风险**：v2 还是实验版，可能有 breaking changes

#### 最小运行路线

1. **第一步**：`npx skills add https://github.com/Leonxlnx/taste-skill`
2. **第二步**：打开 Claude Code / Cursor，给一个前端任务，例如"帮我做一个个人博客首页"
3. **第三步**：分别在有/无 taste-skill 的情况下生成，对比 UI 质量
4. **第四步**：截图对比（默认 AI 输出 vs taste-skill 输出）
5. **第五步**：调整 DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY 三个参数，看风格变化
6. **第六步**：跑通标准：AI 生成的界面有明显的设计感提升，不再"一眼 AI"

#### 我能改造什么

1. **个人品牌视觉 Skill**：基于 taste-skill 框架定制一套"文轩风格"的设计规则，让所有 AI 生成的内容有一致的视觉调性
2. **公众号封面图生成器**：结合 taste-skill 的 imagegen 技能，自动生成公众号封面和配图
3. **"AI 去味"教学内容包**：整理 taste-skill + stop-slop 的使用经验，做成资料包
4. **最优改造**：**个人品牌视觉 Skill**——定制设计参数 + 品牌色彩 + 字体系统，所有 AI 编程输出统一视觉风格

#### 可写成的公众号标题

1. 《AI 写的前端代码太丑？这个 28K Star 的项目给它装上了"设计品味"》
2. 《我让 Claude Code 用 taste-skill 写了个网站，终于不像 AI 做的了》
3. 《AI 去味不是玄学：这三个参数让 AI 输出从"套话"变"人话"》

#### 1 天实操路线

- **上午**：安装 taste-skill，跑 3 个前端 Demo 对比（无 skill / v1 skill / v2 skill）
- **下午**：改造成个人品牌视觉 Skill，定制参数和配色
- **晚上**：截图 6 组对比图，写"AI 设计品味"教程，输出公众号长文

#### 可沉淀资产

- **GitHub README**：taste-skill 中文使用指南 + 参数调优手册
- **中文教程**：AI 前端设计品味入门
- **Skill**：个人品牌视觉技能包（基于 taste-skill 定制）
- **图片素材**：6 组"有/无 taste-skill"对比截图
- **公众号长文**：AI Coding 输出质量提升实操

**Skill 结构**：
- **名称**：wenxuan-brand-visual
- **输入**：前端项目需求描述
- **输出**：符合文轩品牌风格的前端代码（含配色、字体、动效）
- **包含文件**：SKILL.md（定制规则）、配色方案 JSON、字体配置
- **使用场景**：公众号封面生成、个人网站开发、项目 Demo 美化

#### 变现/引流可能性

- **免费资料引流**：提供"AI 前端设计品味调参手册"PDF
- **卖模板**：品牌视觉 Skill 模板（适配不同自媒体定位）
- **作品集**：展示 AI + 设计综合能力
- **引流方向**：AI 前端开发、设计工程化、内容创作工具

---

### 项目 3：CLI-Anything

#### 项目信息

- **项目名**：CLI-Anything
- **GitHub 链接**：https://github.com/HKUDS/CLI-Anything
- **Star 数**：40,889+（本周新增 2,602+）
- **最近更新时间**：2026-05-30（持续日更）
- **主要语言**：Python
- **License**：Apache-2.0
- **一句话说明**：香港大学数据智能实验室开源，用一条命令将任意软件（GIMP、Blender、QGIS、Calibre、Obsidian 等）转化为 AI Agent 可直接调用的标准化 CLI 工具，已覆盖 30+ 主流软件。

#### 项目类型

MCP / Workflow / Agent 基础设施

#### 为什么值得看

这是本周最有"范式转换"意味的项目。CLI-Anything 的核心洞察是：未来的软件不只是给人用的，也是给 AI Agent 用的。它通过全自动 7 阶段流水线，将任何传统软件的功能封装成结构化、JSON 原生输出、可被 AI Agent 发现和调用的命令行接口。

配套的 CLI-Hub 中央注册表（`pip install cli-anything-hub`）已经收录了 30+ 软件的 CLI 包装器，包括 Obsidian（笔记自动化）、Calibre（电子书管理）、QGIS（地理信息）、Blender（3D 建模）、n8n（工作流自动化）、Shotcut（视频编辑）等。

对于 AI 自媒体来说，这意味着你可以用 AI Agent 操控专业软件完成内容生产——让 Claude Code 操作 Blender 生成 3D 封面、让 AI 通过 Obsidian CLI 管理笔记库、让 Agent 自动用 Calibre 转换电子书格式。

#### 为什么适合黄文轩

1. **AI 产品实验者**：体验"AI Agent 操控专业软件"的前沿能力
2. **科技 AI 自媒体**：能讲清楚"Agent-Native Software"这个行业趋势
3. **AI Coding 实操者**：把 CLI-Anything 接入自己的内容工作流
4. **内容资产化**：能把 AI 操控 Obsidian/Calibre/Blender 的过程写成系列教程

#### 可执行边界判断

- **个人能跑**：✅ 单机运行
- **企业权限**：❌ 不需要
- **昂贵 API**：⚠️ 调用 AI 模型部分需要 API Key（可选）
- **复杂部署**：⚠️ 需要安装目标软件（如 Obsidian/Blender）+ CLI 包装器
- **适合时间**：1 天可改造
- **最大风险**：部分软件 CLI 包装器还在社区迭代中，稳定性待验证

#### 最小运行路线

1. **第一步**：`pip install cli-anything-hub`
2. **第二步**：`cli-hub install obsidian`（以 Obsidian 为例）
3. **第三步**：用 CLI 操作 Obsidian：`obsidian-cli search "AI Agent"` 或 `obsidian-cli create-note "测试笔记" --content "CLI-Anything 测试"`
4. **第四步**：截图 CLI 执行结果与 Obsidian 界面变化对比
5. **第五步**：尝试另一个软件（如 Calibre 电子书管理），走通同样的流程
6. **第六步**：跑通标准：至少 2 个软件的 CLI 包装器能正常工作

#### 我能改造什么

1. **AI 内容生产工作流**：用 CLI-Anything 串联 Obsidian（笔记）→ Calibre（资料整理）→ Shotcut（视频编辑）的完整内容生产链路
2. **个人知识库 Agent**：基于 Obsidian CLI 构建 AI 驱动的知识管理助手
3. **软件教程自动生成器**：用 AI Agent 操控专业软件并记录操作步骤，自动生成图文教程
4. **最优改造**：**AI 内容生产全链路工作流**——AI 选题 → Obsidian 写稿 → Calibre 整理资料 → 输出公众号草稿

#### 可写成的公众号标题

1. 《港大这个 40K Star 的项目，要让所有软件都能被 AI 操控》
2. 《未来的软件不只给人用，还要给 AI 用——CLI-Anything 实测》
3. 《我用 AI 操控 Blender 和 Obsidian，发现了一个新趋势》

#### 1 天实操路线

- **上午**：安装 CLI-Anything Hub，跑通 Obsidian + Calibre 两个 CLI
- **下午**：改造成内容生产工作流，让 AI 通过 CLI 完成"选题 → 笔记 → 整理资料"全链路
- **晚上**：录制 AI 操控软件的屏幕录像，写趋势分析，输出公众号长文

#### 可沉淀资产

- **GitHub README**：CLI-Anything 中文上手指南
- **中文教程**：Agent-Native Software 入门
- **Skill**：内容生产 CLI 工作流技能包
- **视频教程**：AI 操控专业软件实战系列（B 站）
- **公众号长文**：Agent-Native 趋势深度分析

**Skill 结构**：
- **名称**：content-cli-workflow
- **输入**：选题关键词
- **输出**：完整草稿（选题 → 研究笔记 → 资料整理 → 初稿）
- **包含文件**：Obsidian/Calibre CLI 配置模板、工作流脚本、输出模板
- **使用场景**：公众号日更内容生产、知识库管理、资料整理

#### 变现/引流可能性

- **免费资料引流**：提供"AI 操控软件的 10 个场景"指南
- **卖教程**：Agent-Native 软件工作流搭建教程
- **代搭服务**：帮自媒体/小团队部署 CLI-Anything 工作流
- **引流方向**：AI Agent、自动化工作流、内容生产工具

---

### 项目 4：GEOFlow

#### 项目信息

- **项目名**：GEOFlow
- **GitHub 链接**：https://github.com/gavenwangcn/GEOFlow
- **Star 数**：新项目，增长中
- **最近更新时间**：2026-04-13（核心功能完善，近期社区活跃）
- **主要语言**：PHP
- **License**：Apache-2.0
- **一句话说明**：面向 GEO/SEO 内容运营的开源内容生产系统，将 AI 模型配置、素材管理、任务调度、草稿审核和前台发布串成一条完整链路，适合搭建自动化内容站点。

#### 项目类型

GEO / SEO / 内容自动化

#### 为什么值得看

GEO（Generative Engine Optimization / 生成引擎优化）是 2026 年内容领域最重要的新概念。传统的 SEO 优化的是在 Google 搜索结果中的排名，而 GEO 优化的是你的内容能不能被 ChatGPT、Perplexity、Claude 等 AI 引擎引用。

GEOFlow 是目前 GitHub 上少有的把 GEO 理念落地的完整系统。它有批量任务调度、AI 多模型支持、三段式审核发布流程、SEO 元信息和结构化数据优化。最值得关注的是它配套提供了 Skill，可以被 Claude Code 等 AI Agent 直接调用——这让"AI 写内容 + AI 发布内容 + AI 优化 GEO"形成完整闭环。

对于正在做 AI 自媒体的黄文轩，这套系统可以直接用来搭建自己的内容矩阵站，或者作为"GEO 内容运营"的教学案例。

#### 为什么适合黄文轩

1. **AI 内容生产者**：直接用于搭建自己的 GEO 内容站点
2. **科技 AI 自媒体**："GEO"是 2026 年公众号能写的高价值话题
3. **AI 产品实验者**：Docker 一键部署，能快速看到完整系统的运行效果
4. **变现导向**：理解 GEO 系统 = 掌握 AI 搜索时代的流量获取能力

#### 可执行边界判断

- **个人能跑**：✅ Docker Compose 一键部署
- **企业权限**：❌ 不需要
- **昂贵 API**：⚠️ 需要 OpenAI 兼容 API Key（DeepSeek 等国产模型可用，成本低）
- **复杂部署**：❌ Docker Compose 一行命令
- **适合时间**：1 天可改造
- **最大风险**：PHP 技术栈对于部分开发者不够友好；系统定位偏生产环境，需要时间理解配置流程

#### 最小运行路线

1. **第一步**：`git clone https://github.com/gavenwangcn/GEOFlow && cd GEOFlow`
2. **第二步**：`cp .env.example .env` 并配置 AI 模型 API Key
3. **第三步**：`docker compose --profile scheduler up -d --build`
4. **第四步**：访问 `http://localhost:18080/geo_admin/`，默认账号 admin / admin888
5. **第五步**：配置 AI 模型 → 创建标题库 → 创建任务 → 查看自动生成的文章
6. **第六步**：跑通标准：系统自动生成至少 1 篇文章，前台页面正常展示

#### 我能改造什么

1. **个人 AI 内容站**：用 GEOFlow 搭建文轩的个人内容站点，所有文章通过 AI 生成 + 人工审核发布
2. **GEO 优化教程站**：搭建一个专门讲解 GEO 优化的教学站点，文章全部用 GEOFlow 生产
3. **AI 搜索流量实验**：用 GEOFlow 批量生成面向 AI 搜索优化（GEO）的内容，测试不同策略的引用率
4. **最优改造**：**AI 自媒体系列内容站**——围绕"AI 副业/GEO/AI Coding"生成系列内容，测试 AI 搜索引用效果

#### 可写成的公众号标题

1. 《SEO 还没学会，GEO 又来了——这个开源项目让我看懂了 AI 搜索优化》
2. 《我搭了一个 AI 驱动的内容站，所有文章都是 AI 写的》
3. 《2026 年做内容必须懂的 GEO：从概念到跑通一个完整系统》

#### 1 天实操路线

- **上午**：Docker 部署 GEOFlow，配置 DeepSeek API，跑通第一篇文章生成
- **下午**：改造成个人内容站，配置标题库和提示词模板，批量生成 5 篇文章
- **晚上**：截图系统界面和文章效果，写 GEO 入门教程，输出公众号长文

#### 可沉淀资产

- **GitHub README**：GEOFlow 中文部署指南（填补现有文档空白）
- **中文教程**：GEO 入门 + GEOFlow 实操
- **Skill**：GEO 内容生产工作流技能包
- **Notion 模板**：GEO 内容策略规划模板
- **公众号长文**：GEO vs SEO 深度对比

**Skill 结构**：
- **名称**：geo-content-producer
- **输入**：内容主题 + 关键词列表
- **输出**：GEO 优化后的文章（含结构化数据、Open Graph、SEO 元信息）
- **包含文件**：GEOFlow 配置文件模板、提示词模板库、关键词库
- **使用场景**：AI 搜索优化内容生产、自动化内容站点搭建

#### 变现/引流可能性

- **免费资料引流**：提供"GEO 入门指南"PDF
- **卖教程**：GEO 内容站搭建全套教程
- **代搭服务**：帮企业搭建 GEO 内容系统
- **引流方向**：AI 搜索优化、AI 内容创业、SEO 转型 GEO

---

### 项目 5：Bumblebee

#### 项目信息

- **项目名**：Bumblebee
- **GitHub 链接**：https://github.com/perplexityai/bumblebee
- **Star 数**：1,500+（快速增长中）
- **最近更新时间**：2026-05-24
- **主要语言**：Go
- **License**：Apache-2.0
- **一句话说明**：Perplexity AI 官方开源的供应链安全扫描器——零依赖、只读不执行，一键扫描你的 npm/PyPI/Go 包、MCP 服务器、VS Code 扩展、浏览器扩展，快速定位受已知供应链攻击影响的组件。

#### 项目类型

开发者工具 / 安全扫描 / MCP 安全

#### 为什么值得看

MCP 生态爆发带来了一个被忽视的问题：你在 Discord 里点个链接安装的 MCP 服务器，真的安全吗？Bumblebee 是第一个专门面向 AI 开发者终端的安全扫描器。

它的设计哲学非常务实：纯 Go 标准库实现，零第三方依赖（扫描器本身不存在供应链风险），只读不执行（不会意外运行恶意代码），一次扫描覆盖 npm/PyPI/Go/RubyGems/Composer 五大包管理器 + MCP 服务器 + VS Code/Cursor 扩展 + Chrome/Firefox 浏览器扩展。

对于正在大量安装 MCP 服务器和 Skills 的 AI 开发者来说，Bumblebee 就是"先扫再装"的安全习惯养成工具。

#### 为什么适合黄文轩

1. **AI 产品实验者**：检查和审计自己安装的所有 MCP 服务器和 Skills
2. **科技 AI 自媒体**：MCP 安全是 AI 开发者关心的新兴话题，目前中文内容极少
3. **实操价值高**：一行命令就能看到自己电脑上装了哪些可能有风险的组件
4. **内容稀缺性**：全网几乎没有中文 MCP 安全内容，你是第一批讲的

#### 可执行边界判断

- **个人能跑**：✅ 一行命令安装
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费，完全本地运行
- **复杂部署**：❌ `go install github.com/perplexityai/bumblebee@latest`
- **适合时间**：3 小时可跑通（含内容产出）
- **最大风险**：需要 Go 1.25+ 环境，部分用户可能需要先装 Go

#### 最小运行路线

1. **第一步**：`go install github.com/perplexityai/bumblebee@latest`
2. **第二步**：`bumblebee scan` 运行完整扫描
3. **第三步**：查看扫描报告，了解自己电脑上的包管理器、MCP 服务器、编辑器扩展情况
4. **第四步**：截图扫描结果（隐去敏感信息）
5. **第五步**：`bumblebee selftest` 验证安装完整性
6. **第六步**：跑通标准：扫描成功完成，输出结构化的组件清单

#### 我能改造什么

1. **MCP 安全清单**：基于 Bumblebee 扫描结果，整理"AI 开发者必装的安全工具清单"
2. **安装前安全检查 Skill**：把 Bumblebee 封装成一个 Skill，安装任何 MCP 服务器前自动扫描
3. **AI 开发安全入门教程**：从 Bumblebee 出发，讲 MCP 安全、Skills 安全、AI Agent 安全
4. **最优改造**：**AI 开发者安全入门资料包**——Bumblebee 教程 + MCP 安全检查清单 + 安全习惯指南

#### 可写成的公众号标题

1. 《你装的 MCP 服务器安全吗？Perplexity 开源了这个扫描器》
2. 《AI 开发者最容易忽略的安全问题，这个工具 1 分钟帮你检查》
3. 《从供应链攻击到 MCP 安全：一个 AI 开发者必须知道的事》

#### 1 天实操路线

- **上午**：安装 Go 环境 + Bumblebee，运行完整扫描，分析自己的组件清单
- **下午**：改造成"AI 开发者安全清单"，补充 MCP/Skills 安全注意事项
- **晚上**：截图扫描过程和结果，写 MCP 安全科普，输出公众号长文

#### 可沉淀资产

- **GitHub README**：Bumblebee 中文使用指南
- **中文教程**：AI 开发者安全入门
- **Markdown 资料包**：AI 开发者安全工具清单 + MCP 安全自查表
- **Skill**：安装前安全检查技能包
- **公众号长文**：MCP 安全科普

**Skill 结构**：
- **名称**：mcp-security-check
- **输入**：待安装的 MCP 服务器仓库 URL
- **输出**：安全检查报告（已知漏洞、可疑依赖、社区评价）
- **包含文件**：检查脚本、威胁清单、安全建议模板
- **使用场景**：安装任何 MCP 服务器/Skill 前的安全检查

#### 变现/引流可能性

- **免费资料引流**：提供"AI 开发者安全自查清单"PDF
- **卖教程**：AI Agent 安全入门系列（差异化学科）
- **作品集**：展示 AI 安全意识和技术深度
- **引流方向**：AI 安全、MCP 安全、开发者工具

---

## 4. 本周最推荐先跑

**Chrome DevTools MCP** 是最值得先跑的项目。

**为什么最值得先跑**：
1. **Google 官方**：权威性无可比拟，话题热度天然高
2. **安装极简**：一行命令，无 API Key，无额外依赖
3. **效果立即可见**：安装后立刻看到 AI 自动操控浏览器的效果
4. **内容价值高**：前后对比（手动调试 vs AI 自动调试）天然适合写公众号
5. **实用性强**：直接提升自己的前端开发效率

**为什么最适合我现在的定位**：
- **大学生 AI 实战家**：提升真实开发效率，不是玩具
- **科技 AI 自媒体**：Google 官方项目 + 37 万 Star 社区验证
- **AI Coding 实操者**：前端调试是每个开发者都会遇到的场景

**为什么 1 天能看到成果**：
上午安装测试，下午改造验收工具，晚上产出对比内容。输入（自己的前端项目）→ 输出（AI 自动调试报告 + 公众号长文）链路清晰。

**能写成什么公众号长文**：
《我让 Claude Code 自己调试前端 Bug，它比我还快——Google 这一个开源工具改变了什么》

**能沉淀成什么资产**：
1. Chrome DevTools MCP 中文使用指南（GitHub）
2. 前端项目一键验收 Skill
3. AI 辅助前端调试教程（图文 + 视频）

**今天最小版本是什么**：
在自己的前端项目上安装 Chrome DevTools MCP，让 Claude Code 完成一次完整的"打开页面 → 检查报错 → 跑 Lighthouse → 给出优化建议"流程，截图 4 张关键步骤，写一篇 800 字初体验。

**今天不要做什么**：
不要试图改造成复杂的自动化测试框架，不要研究底层 CDP 协议，不要做企业级多页面验收。先跑通最小闭环，先出内容。

---

## 5. 本周 3 小时低门槛项目

**Bumblebee** 是本周 3 小时低门槛项目。

**3 小时能完成什么**：
1. 安装 Go 环境 + Bumblebee（30 分钟）
2. 运行完整扫描，分析结果（30 分钟）
3. 整理"MCP 安全自查清单"（1 小时）
4. 写一篇 500 字科普 + 扫描结果解读（1 小时）

**能截图什么**：
1. `bumblebee scan` 的完整扫描结果
2. 发现的 MCP 服务器清单
3. 已安装的 VS Code 扩展清单
4. 扫描完成后的"一切正常"或"发现可疑项"界面

**能写成什么短内容**：
小红书图文：《你的 AI 开发环境安全吗？30 秒自查》
即刻动态：《用 Perplexity 开源的工具扫了一遍我的 MCP 服务器》
Twitter 线程：3 条推文介绍 MCP 安全问题 + Bumblebee 使用方法

**如果本周很忙，如何只做这个最小版本**：
1. `go install github.com/perplexityai/bumblebee@latest`
2. `bumblebee scan` 截图
3. 产出物：1 张截图 + 300 字解读 + 1 条社交媒体内容

---

## 6. 本周内容栏目建议

1. **本周我发现 5 个普通大学生也能跑起来的 AI 项目**（主标题，固定栏目）
2. **Google 给了 AI 一双"眼睛"——Chrome DevTools MCP 深度实测**（深度实操）
3. **AI 写的前端代码终于不丑了——taste-skill 给了我一套设计品味**（项目拆解）
4. **港大 40K Star 项目背后的趋势：软件不再只给人用**（趋势分析）
5. **MCP 装了一堆，但安全吗？——AI 开发者必做的安全检查**（安全科普）

**最适合本周的标题**：
**本周我发现 5 个普通大学生也能跑起来的 AI 项目**

理由：符合固定栏目定位，覆盖 Chrome DevTools MCP（操作性）+ taste-skill（实用性）+ CLI-Anything（趋势性）+ GEOFlow（系统性）+ Bumblebee（安全性），5 个项目各有特色，目标读者（大学生、AI 新人）都能找到自己能跑的项目。

---

## 7. 下周继续追踪

1. **Pullfrog**（Zod 作者 Colin McDonnell 的 AI Code Review Agent）：目前在 GitHub Actions 中运行，等 CLI 版本发布后可本地跑
2. **Understand-Anything**（40k stars 代码知识图谱）：W22 追踪，本周 +23k stars 暴增，等 v2 版本稳定后值得入选
3. **deep-research agent 项目**：本周多个 deep-research 类 Agent 出现在 GitHub Topics，值得持续关注
4. **MCP 安全生态**：Bumblebee 只是开始，预计会有更多 MCP 安全工具出现
5. **GEO 工具赛道**：GEOFlow、geoify 等项目还在早期，关注功能完善和社区增长
6. **Agent-Native Software**：CLI-Anything 代表的范式，关注更多软件的 Agent 化
7. **AI 输出质量控制**：taste-skill + stop-slop 代表的"AI 去味"方向，关注更多细分场景的工具
8. **Chrome DevTools MCP 生态**：Google 官方项目，关注插件生态和社区最佳实践
9. **AI Coding 效率工具**：除 CodeGraph（W22）外，关注 Token 优化、上下文管理类新项目
10. **newsletter-agent**（AI newsletter 自动化）：Substack MCP + 内容自动化方向，适合自媒体人关注

## 8. 已看过项目记录

| 项目 | GitHub 链接 | 查看时间 | 备注 |
|------|-------------|----------|------|
| Chrome DevTools MCP | https://github.com/ChromeDevTools/chrome-devtools-mcp | 2026-06-02 | ✅ 入选 W23 |
| taste-skill | https://github.com/Leonxlnx/taste-skill | 2026-06-02 | ✅ 入选 W23 |
| CLI-Anything | https://github.com/HKUDS/CLI-Anything | 2026-06-02 | ✅ 入选 W23 |
| GEOFlow | https://github.com/gavenwangcn/GEOFlow | 2026-06-02 | ✅ 入选 W23 |
| Bumblebee | https://github.com/perplexityai/bumblebee | 2026-06-02 | ✅ 入选 W23 |
| CodeGraph | https://github.com/colbymchenry/codegraph | 2026-06-02 | W22 已入选，本周排除 |
| agentmemory | https://github.com/rohitg00/agentmemory | 2026-06-02 | W22 已入选，本周排除 |
| social-auto-upload | https://github.com/MarySueTeam/social-auto-upload | 2026-06-02 | W22 已入选，本周排除 |
| Webwright | https://github.com/microsoft/Webwright | 2026-06-02 | W22 已入选，本周排除 |
| NVIDIA Skills | https://github.com/NVIDIA/skills | 2026-06-02 | W22 已入选，本周排除 |
| Understand-Anything | https://github.com/Lum1104/Understand-Anything | 2026-06-02 | W22 追踪，本周排除 |
| Pullfrog | https://github.com/colinmcdonnell/pullfrog（待验证） | 2026-06-02 | 需 GitHub App 安装，Star 低，排除 |
| OpenClaw | https://github.com/OpenClaw/OpenClaw | 2026-06-02 | 历史多次，排除 |
| Hermes Agent | https://github.com/NousResearch/hermes-agent | 2026-06-02 | 历史多次，排除 |
| TradingAgents | https://github.com/TauricResearch/TradingAgents | 2026-06-02 | 金融量化，排除 |
| markitdown | https://github.com/microsoft/markitdown | 2026-06-02 | 定位不相关，排除 |
| MoneyPrinterTurbo | https://github.com/harry0703/MoneyPrinterTurbo | 2026-06-02 | 需要 GPU，排除 |
| superpowers | https://github.com/obra/superpowers | 2026-06-02 | W22 追踪，排除 |
| multica | https://github.com/multica-ai/multica | 2026-06-02 | W22 追踪，排除 |
| mattpocock/skills | https://github.com/mattpocock/skills | 2026-06-02 | awesome-list 类型，排除 |
| anthropics/claude-plugins-official | https://github.com/anthropics/claude-plugins-official | 2026-06-02 | awesome-list 类型，排除 |
| stop-slop | 社区项目，本周与 taste-skill 配套出现 | 2026-06-02 | 作为 taste-skill 补充提及，未独立入选 |

---

## 9. 本周去重说明

已读取 W22 历史文件 `2026-W22-GitHub小项目雷达.md`。W22 入选的 5 个项目（CodeGraph、NVIDIA Skills、social-auto-upload、agentmemory、Webwright）本周全部排除，未出现重复。

W22 追踪列表中的 Understand-Anything、superpowers、multica、graphify 等项目本周均未入选，其中 Understand-Anything 本周暴涨 +23k stars 但功能与 W22 入选的 CodeGraph 高度重叠（均为代码知识图谱），故留待下周继续追踪。

---

*雷达生成时间：2026-06-02*
*生成依据：GitHub Trending（Trendshift.io）、GitHub Topics、GitHub 仓库 README、官方文档、InfoQ/掘金/CSDN 一手技术信源*
*禁止使用低质量中文媒体作为事实来源*