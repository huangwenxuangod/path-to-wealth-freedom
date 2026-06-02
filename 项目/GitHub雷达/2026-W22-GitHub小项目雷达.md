# 2026-W22 GitHub 小项目雷达

## 0. 本周结论

本周 AI Agent 赛道进入"技能化"和"记忆持久化"双轨爆发期。最值得跑的项目是 **CodeGraph**（代码知识图谱），能让你的 Claude Code 节省 57% Token 消耗。最适合写公众号的是 **NVIDIA Skills**（英伟达官方技能包），普通人也能跑通 CUDA 优化。最适合做内容资产的是 **social-auto-upload**（社媒自动上传），能改造成个人内容分发工作流。最适合 3 小时快速完成的是 **agentmemory**（AI 记忆系统），安装后立即看到效果。

## 1. 本周搜索范围

- GitHub Trending 当周热门项目（Trendshift.io 实时榜单）
- GitHub Topics：ai-agent, ai-agents, llm-agent, coding-agent, ai-coding, mcp, model-context-protocol, rag, ai-search
- Product Hunt 本周 AI 开发工具（Google Antigravity CLI, note.md, Memdex 等）
- 官方博客/文档：Microsoft、NVIDIA、Anthropic 等
- Hacker News Show HN 近期项目

## 2. 本周排除项目

| 项目 | 排除原因 |
|------|----------|
| OpenClaw (373k+ stars) | 历史已多次出现，且过于复杂不适合个人快速跑通 |
| Hermes Agent (165k+ stars) | 历史已出现，本周无重大更新 |
| TradingAgents (76.8k+ stars) | 金融量化项目，需要专业背景，不适合普通大学生 |
| Microsoft/markitdown (138k+ stars) | 文档转换工具，与 AI Agent/内容增长定位不相关 |
| harry0703/MoneyPrinterTurbo (76.7k+ stars) | AI 视频生成，需要 GPU 资源，个人跑通成本高 |
| D4Vinci/Scrapling (57.9k+ stars) | 网页抓取框架，与 AI Agent 趋势不直接相关 |
| anthropics/claude-plugins-official | 官方插件目录，属于 awesome-list 类型 |
| multica-ai/andrej-karpathy-skills | Karpathy 技能集，历史已出现 |
| trimstray/the-book-of-secret-knowledge | 知识集合，属于 awesome-list |
| datawhalechina/Agent-Learning-Hub | AI Agent 学习资料库，属于 awesome-list |

## 3. 本周 5 个优先项目

### 项目 1：CodeGraph

#### 项目信息

- **项目名**：CodeGraph
- **GitHub 链接**：https://github.com/colbymchenry/codegraph
- **Star 数**：2.5k+（本周新增 109）
- **最近更新时间**：2026-05-29
- **主要语言**：TypeScript
- **License**：MIT
- **一句话说明**：为 Claude Code 等 AI 编程助手预建代码知识图谱，减少 57% Token 消耗和 62% 工具调用。

#### 项目类型

AI Coding / Coding Agent 优化工具

#### 为什么值得看

解决 AI 编程助手的核心痛点：每次都要重新"认识"代码库，浪费 Token 和时间。CodeGraph 提前构建代码知识图谱（符号关系、调用图、代码结构），让 AI 助手秒懂项目。经 7 个真实开源项目测试，平均节省 25% 成本、57% Token、23% 时间、62% 工具调用。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：安装简单（curl 或 npm），1 小时内可跑通
2. **科技 AI 自媒体**：能写"AI 编程省钱"类内容，有真实数据支撑
3. **AI Coding 实操者**：直接提升自己的开发效率，可量化效果
4. **内容资产化**：能改造成"代码库分析工具"或"项目理解助手"

#### 可执行边界判断

- **个人能跑**：✅ 单机运行，无需服务器
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费开源
- **复杂部署**：❌ 一键安装
- **适合时间**：3 小时可跑通
- **最大风险**：对大项目索引时间较长（10k 文件约 5-10 分钟）

#### 最小运行路线

1. **第一步**：`curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh`
2. **第二步**：`cd your-project && codegraph init -i`
3. **第三步**：启动 Claude Code，它会自动发现并使用 CodeGraph
4. **第四步**：问 Claude Code "这个项目的架构是什么？"
5. **第五步**：截图对比有/无 CodeGraph 的 Token 消耗
6. **第六步**：跑通标准：Claude 能回答项目结构问题，且工具调用次数减少

#### 我能改造什么

1. **公众号选题 Agent**：用 CodeGraph 分析 GitHub 热门项目结构，自动生成选题
2. **GitHub 项目雷达增强版**：结合 CodeGraph 深度分析项目架构
3. **AI Coding 学习助手**：记录学生项目的代码演变，提供个性化学习路径
4. **最优改造**：**GitHub 项目结构分析工具**，为自媒体提供深度项目解读素材

#### 可写成的公众号标题

1. 《我让 Claude Code 少烧 57% 的 Token，就靠这个开源工具》
2. 《普通大学生也能跑通的代码知识图谱，让 AI 编程助手秒懂你的项目》
3. 《GitHub 2.5k Star 项目实测：AI 编程助手效率提升 23%，成本降 25%》

#### 1 天实操路线

- **上午**：安装 CodeGraph，在自己的小项目上测试，记录 Token 节省数据
- **下午**：改造成 GitHub 项目分析工具，写脚本分析 3 个热门 AI 项目
- **晚上**：截图对比数据，写教程，总结踩坑点，输出公众号长文

#### 可沉淀资产

- **GitHub README**：CodeGraph 使用教程（中文版）
- **中文教程**：图文并茂的安装使用指南
- **Skill**：CodeGraph 分析技能包
- **Markdown 资料包**：7 个测试项目的分析报告模板
- **公众号长文**：深度评测+实操教程

**Skill 结构**：
- **名称**：codegraph-analyzer
- **输入**：GitHub 仓库 URL
- **输出**：项目架构分析报告 + Token 节省预估
- **包含文件**：安装脚本、配置模板、分析脚本
- **使用场景**：评估项目复杂度，优化 AI 编程助手配置

#### 变现/引流可能性

- **免费资料引流**：提供"AI 编程省钱计算器"Excel 模板
- **卖教程**：CodeGraph 高级用法（企业级项目优化）
- **作品集**：展示 AI 工具优化能力
- **引流方向**：AI 编程效率、开发者工具评测、Token 成本优化

### 项目 2：NVIDIA Skills

#### 项目信息

- **项目名**：NVIDIA Skills
- **GitHub 链接**：https://github.com/NVIDIA/skills
- **Star 数**：新项目，快速增长中
- **最近更新时间**：2026-06-01
- **主要语言**：Markdown + 多语言
- **License**：Apache-2.0
- **一句话说明**：英伟达官方发布的 AI Agent 技能包，让 Claude Code 等助手正确使用 CUDA-X 库和物理 AI 工具链。

#### 项目类型

AI Agent 技能 / 开发者工具 / 物理 AI

#### 为什么值得看

英伟达首次将硬件级 AI 能力（机器人、视觉 AI、自动驾驶、边缘计算）封装成 Agent 可用的技能包。普通人现在能用自然语言让 Claude Code 写 CUDA 优化代码、构建机器人控制程序、设计视觉 AI 流水线。这是"AI 民主化物理世界操作"的关键一步。

#### 为什么适合黄文轩

1. **科技 AI 自媒体**：英伟达官方背书，话题性强
2. **AI 产品实验者**：能体验最前沿的"物理 AI"能力
3. **内容差异化**：大多数自媒体还在聊 ChatGPT，你已能讲机器人 AI
4. **作品集亮点**："我用 Claude Code 控制机器人"比"我用 ChatGPT 写文案"更有技术含量

#### 可执行边界判断

- **个人能跑**：✅ 大部分技能只需 API Key
- **企业权限**：❌ 不需要
- **昂贵 API**：⚠️ 需要 CUDA 云服务或本地 GPU（部分技能）
- **复杂部署**：⚠️ 物理 AI 技能需要硬件环境
- **适合时间**：1 天可改造（软件技能），3 天可扩展（硬件技能）
- **最大风险**：硬件技能需要真实机器人/摄像头，成本较高

#### 最小运行路线

1. **第一步**：`npx skills add nvidia/skills --list` 查看可用技能
2. **第二步**：`npx skills add nvidia/skills --skill deepstream-dev --agent claude-code`
3. **第三步**：配置 DeepSeek API Key（或其他兼容模型）
4. **第四步**：问 Claude Code "创建一个人数统计的多摄像头视觉流水线"
5. **第五步**：截图生成的代码架构图
6. **第六步**：跑通标准：Claude 生成完整的 DeepStream 流水线代码

#### 我能改造什么

1. **视觉 AI 内容生成器**：用 DeepStream 技能自动分析视频，生成内容摘要
2. **机器人教程生成器**：用 Isaac 技能为教育机器人写教学代码
3. **边缘计算实验平台**：用 Jetson 技能构建 IoT+AI 演示项目
4. **最优改造**：**AI 视觉内容分析工作流**，自动分析视频生成字幕和摘要

#### 可写成的公众号标题

1. 《英伟达刚刚开源了这个，让 Claude Code 能写机器人控制代码》
2. 《普通人也能玩转物理 AI：我用 1 天跑通英伟达官方 Agent 技能》
3. 《从 ChatGPT 到机器人：AI 正在学会操作物理世界》

#### 1 天实操路线

- **上午**：安装 NVIDIA Skills，跑通 DeepStream 视觉流水线示例
- **下午**：改造成视频内容分析工具，处理自己的短视频
- **晚上**：截图生成代码，写"物理 AI 入门"教程，输出公众号长文

#### 可沉淀资产

- **GitHub README**：NVIDIA Skills 中文使用指南
- **中文教程**：物理 AI 入门系列
- **Skill**：视频内容分析技能包
- **Notion 模板**：物理 AI 学习路径
- **公众号长文**：英伟达 AI 战略分析 + 实操教程

**Skill 结构**：
- **名称**：video-content-analyzer
- **输入**：视频文件路径
- **输出**：内容摘要 + 关键帧 + 文字稿
- **包含文件**：DeepStream 配置模板、分析脚本、输出模板
- **使用场景**：自媒体视频内容分析、教育视频摘要生成

#### 变现/引流可能性

- **免费资料引流**：提供"物理 AI 学习路径图"PDF
- **卖教程**：企业级视觉 AI 部署教程
- **作品集**：展示硬件+AI 综合能力
- **引流方向**：硬科技 AI、机器人、计算机视觉、边缘计算

### 项目 3：social-auto-upload

#### 项目信息

- **项目名**：social-auto-upload
- **GitHub 链接**：https://github.com/MarySueTeam/social-auto-upload
- **Star 数**：9k+
- **最近更新时间**：2026-05-24
- **主要语言**：Python
- **License**：MIT
- **一句话说明**：自动化上传视频到抖音、小红书、B站、视频号等平台，支持 CLI 和 Skill 化，让 AI Agent 帮你做内容分发。

#### 项目类型

内容自动化 / 社媒工具 / AI 工作流

#### 为什么值得看

解决了内容创作者的核心痛点：多平台分发耗时耗力。项目已 Skill 化，可直接被 OpenClaw、Claude Code 等 AI Agent 调用。支持 7 个主流平台（抖音、B站、小红书、快手、视频号、百家号、TikTok），有 Web 界面和 CLI 两种操作方式。

#### 为什么适合黄文轩

1. **AI 内容生产者**：直接提升自己的内容分发效率
2. **科技 AI 自媒体**：能写"AI 自动化运营"实战内容
3. **大学生实战家**：用这个工具跑通自己的内容矩阵
4. **变现导向**：能改造成代运营服务或培训课程

#### 可执行边界判断

- **个人能跑**：✅ 单机运行
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费开源
- **复杂部署**：⚠️ 需要配置各平台 Cookie（有详细教程）
- **适合时间**：3 小时可跑通（基础功能），1 天可改造
- **最大风险**：平台反爬机制可能导致封号，需谨慎使用

#### 最小运行路线

1. **第一步**：`git clone https://github.com/MarySueTeam/social-auto-upload`
2. **第二步**：`pip install -r requirements.txt && playwright install`
3. **第三步**：运行示例脚本获取 Cookie（如 `python examples/get_douyin_cookie.py`）
4. **第四步**：`sau douyin upload-video --file demo.mp4 --title "测试" --desc "AI 自动发布测试"`
5. **第五步**：截图上传成功页面
6. **第六步**：跑通标准：视频成功上传到至少 1 个平台

#### 我能改造什么

1. **AI 内容分发工作流**：结合 GPT 生成内容 + 自动发布
2. **多平台数据看板**：统一管理各平台内容表现
3. **内容矩阵管理工具**：批量管理多个账号
4. **最优改造**：**AI 内容创作+分发全链路工作流**，从选题到发布全自动化

#### 可写成的公众号标题

1. 《我用 AI 自动发视频到 7 个平台，每天省下 3 小时》
2. 《GitHub 9k Star 的社媒自动化工具，普通大学生也能跑通》
3. 《从内容创作到分发：我用 AI 跑通了自媒体全链路》

#### 1 天实操路线

- **上午**：安装配置，跑通抖音/B站自动上传
- **下午**：改造成内容工作流，结合 AI 生成标题和描述
- **晚上**：录制演示视频，写避坑指南，输出公众号长文

#### 可沉淀资产

- **GitHub README**：中文配置教程（现有文档较简略）
- **中文教程**：各平台 Cookie 获取完整指南
- **Skill**：内容分发技能包
- **飞书模板**：内容发布日历+数据看板
- **公众号长文**：社媒自动化实战指南

**Skill 结构**：
- **名称**：social-media-distributor
- **输入**：视频文件 + 文案（可选）
- **输出**：各平台发布链接 + 状态报告
- **包含文件**：平台配置模板、上传脚本、状态检查脚本
- **使用场景**：自媒体内容分发、企业多账号管理

#### 变现/引流可能性

- **免费资料引流**：提供"社媒平台 Cookie 获取指南"PDF
- **卖教程**：企业级多账号管理方案
- **代搭服务**：帮小团队部署自动化系统
- **引流方向**：自媒体运营、内容创业、AI 自动化、社媒营销

### 项目 4：agentmemory

#### 项目信息

- **项目名**：agentmemory
- **GitHub 链接**：https://github.com/rohitg00/agentmemory
- **Star 数**：快速上升中
- **最近更新时间**：2026-05-29
- **主要语言**：TypeScript
- **License**：MIT
- **一句话说明**：为 AI 编程助手提供持久化记忆系统，基于真实基准测试，减少 92% Token 消耗，95.2% 检索准确率。

#### 项目类型

AI Agent 记忆系统 / MCP 服务器 / 开发者工具

#### 为什么值得看

解决了 AI 助手的"健忘症"问题。普通 AI 每次对话都是"第一次见面"，agentmemory 提供跨会话记忆、知识图谱、混合搜索。支持所有主流 AI 编程工具（Claude Code、GitHub Copilot CLI、Cursor、Gemini CLI 等），无需外部数据库。

#### 为什么适合黄文轩

1. **AI 产品实验者**：能体验最先进的 Agent 记忆技术
2. **科技 AI 自媒体**：记忆系统是 AI 进化的关键方向，话题前沿
3. **实操导向**：安装简单，效果立即可见
4. **内容深度**：能讲清楚记忆系统的技术原理和商业价值

#### 可执行边界判断

- **个人能跑**：✅ 单机运行
- **企业权限**：❌ 不需要
- **昂贵 API**：❌ 免费开源
- **复杂部署**：❌ 一键安装
- **适合时间**：3 小时可跑通
- **最大风险**：对超大项目记忆可能占用较多磁盘空间

#### 最小运行路线

1. **第一步**：`npm install -g @agentmemory/agentmemory`
2. **第二步**：`agentmemory`（启动记忆服务器）
3. **第三步**：`agentmemory connect claude-code`（连接 Claude Code）
4. **第四步**：`npx skills add rohitg00/agentmemory -y`（安装技能）
5. **第五步**：问 Claude Code 复杂问题，观察它如何调用记忆
6. **第六步**：跑通标准：Claude 能引用之前的对话内容

#### 我能改造什么

1. **个人知识管理助手**：记忆所有学习笔记和项目经验
2. **团队协作记忆库**：共享团队技术决策和问题解决方案
3. **内容创作记忆系统**：记住所有选题和素材，避免重复
4. **最优改造**：**个人 AI 记忆工作台**，统一管理所有 AI 助手的记忆

#### 可写成的公众号标题

1. 《我给 Claude Code 装了个"记忆芯片"，它再也不会忘记我说过什么》
2. 《92% Token 节省！这个开源项目让 AI 助手有了持久记忆》
3. 《从健忘到过目不忘：AI 记忆系统的技术演进与实操》

#### 1 天实操路线

- **上午**：安装 agentmemory，测试基础记忆功能
- **下午**：改造成个人知识管理系统，导入历史笔记
- **晚上**：测试记忆检索效果，写评测报告，输出公众号长文

#### 可沉淀资产

- **GitHub README**：agentmemory 中文使用指南
- **中文教程**：AI 记忆系统原理与实操
- **Skill**：知识管理技能包
- **Markdown 资料包**：记忆系统评估报告模板
- **公众号长文**：AI 记忆技术深度分析

**Skill 结构**：
- **名称**：personal-knowledge-manager
- **输入**：笔记文件目录
- **输出**：知识图谱 + 智能检索接口
- **包含文件**：导入脚本、检索模板、可视化配置
- **使用场景**：个人学习管理、项目经验沉淀、内容创作素材库

#### 变现/引流可能性

- **免费资料引流**：提供"AI 记忆系统评估框架"PDF
- **卖教程**：企业级知识管理部署方案
- **作品集**：展示 AI 系统集成能力
- **引流方向**：AI 记忆技术、知识管理、学习科学、个人生产力

### 项目 5：Webwright

#### 项目信息

- **项目名**：Webwright
- **GitHub 链接**：https://github.com/microsoft/Webwright
- **Star 数**：新项目，快速上升中
- **最近更新时间**：2026-05-11
- **主要语言**：Python
- **License**：MIT
- **一句话说明**：微软开源的浏览器 Agent 框架，让 Claude Code 等编码模型成为 SOTA 浏览器 Agent，支持长时程网页任务。

#### 项目类型

Browser Agent / AI 工作流 / 微软官方项目

#### 为什么值得看

微软将浏览器自动化从"像素级操作"升级为"代码级编程"。Webwright 让 AI 把浏览器当作可编程终端，写代码控制浏览器，而不是一步步点击。在长时程网页任务上达到 SOTA 效果，已集成 Claude Code、Codex 等工具的 Skill。

#### 为什么适合黄文轩

1. **AI 产品实验者**：体验微软最新的 Agent 技术
2. **科技 AI 自媒体**：微软官方项目，权威性强
3. **实操价值高**：能自动化很多重复性网页操作
4. **内容差异化**：大多数人在用 Selenium，你在用 AI 驱动浏览器

#### 可执行边界判断

- **个人能跑**：✅ 单机运行
- **企业权限**：❌ 不需要
- **昂贵 API**：⚠️ 需要 LLM API（支持 OpenAI/Anthropic/OpenRouter）
- **复杂部署**：⚠️ 需要配置 Playwright 和 LLM
- **适合时间**：1 天可改造
- **最大风险**：复杂网站可能触发反爬，需要调整策略

#### 最小运行路线

1. **第一步**：`git clone https://github.com/microsoft/Webwright`
2. **第二步**：`pip install -e .`
3. **第三步**：配置 LLM API Key
4. **第四步**：运行示例：`python examples/search_and_summarize.py`
5. **第五步**：截图自动化流程
6. **第六步**：跑通标准：成功自动完成一个多步网页任务

#### 我能改造什么

1. **竞品分析自动化**：自动抓取竞品网站更新
2. **内容采集工作流**：定时采集特定网站内容
3. **数据填报机器人**：自动填写表单和提交数据
4. **最优改造**：**GitHub 趋势监控机器人**，自动抓取 Trending 并生成报告

#### 可写成的公众号标题

1. 《微软刚刚开源了这个，让 Claude Code 能编程控制浏览器》
2. 《告别 Selenium：我用 AI 写代码控制浏览器，效率提升 10 倍》
3. 《从点击到编程：浏览器自动化的下一代技术》

#### 1 天实操路线

- **上午**：安装 Webwright，跑通基础示例
- **下午**：改造成 GitHub Trending 监控工具
- **晚上**：录制自动化演示，写技术分析，输出公众号长文

#### 可沉淀资产

- **GitHub README**：Webwright 中文教程
- **中文教程**：AI 驱动浏览器入门指南
- **Skill**：网页监控技能包
- **代码模板**：常见网页自动化场景模板
- **公众号长文**：浏览器自动化技术演进分析

**Skill 结构**：
- **名称**：web-monitor-bot
- **输入**：监控配置（URL、选择器、频率）
- **输出**：变化报告 + 截图 + 数据
- **包含文件**：监控脚本、配置模板、通知脚本
- **使用场景**：竞品监控、价格跟踪、内容更新提醒

#### 变现/引流可能性

- **免费资料引流**：提供"网页自动化场景模板库"
- **卖教程**：企业级网页自动化方案
- **代开发服务**：帮企业定制自动化脚本
- **引流方向**：RPA、自动化、数据采集、竞品分析

## 4. 本周最推荐先跑

**CodeGraph** 是最值得先跑的项目。

**为什么最值得先跑**：
1. **效果立即可见**：安装后第一次使用就能看到 Token 节省
2. **零风险**：纯软件工具，不会封号或产生额外成本
3. **普适性强**：任何用 AI 编程助手的人都需要
4. **内容价值高**：有真实数据支撑，能写深度评测

**为什么最适合我现在的定位**：
- **大学生 AI 实战家**：提升自己的开发效率，真实受益
- **科技 AI 自媒体**：有数据、有对比、有深度
- **AI 产品实验者**：体验前沿的 AI 优化技术

**为什么 1 天能看到成果**：
上午安装测试，下午改造工具，晚上产出内容。有明确的输入（自己的项目）和输出（Token 节省报告）。

**能写成什么公众号长文**：
《实测：这个开源工具让我的 Claude Code 少烧 57% Token，我是怎么做到的？》

**能沉淀成什么资产**：
1. CodeGraph 中文使用指南（GitHub）
2. AI 编程优化评估框架（Notion 模板）
3. 代码知识图谱原理讲解视频（B站）

**今天最小版本是什么**：
在自己的小项目上安装 CodeGraph，记录使用前后的 Token 消耗对比，写一篇 800 字体验文。

**今天不要做什么**：
不要试图改造太复杂的版本，不要研究底层实现原理，不要做企业级部署测试。

## 5. 本周 3 小时低门槛项目

**agentmemory** 是 3 小时低门槛项目。

**3 小时能完成什么**：
1. 安装并启动记忆服务器
2. 连接 Claude Code
3. 测试基础记忆功能（问答记忆、上下文记忆）
4. 写一篇 500 字初体验

**能截图什么**：
1. 安装成功界面
2. 记忆服务器运行状态
3. Claude Code 调用记忆的对话截图
4. 前后对比（有无记忆的对话差异）

**能写成什么短内容**：
小红书图文：《给 AI 装记忆芯片是什么体验？》
即刻动态：《实测 agentmemory：AI 终于不会健忘了》
Twitter 线程：3 条推文介绍核心功能和效果

**如果本周很忙，如何只做这个最小版本**：
1. 用 npx 免安装运行：`npx @agentmemory/agentmemory`
2. 只测试基础记忆功能，不深入改造
3. 产出物：3 张截图 + 300 字体验 + 1 条社交媒体内容

## 6. 本周内容栏目建议

1. **本周我发现 5 个大学生也能跑起来的 AI 项目**（主标题）
2. **我用 1 天跑通 GitHub 2.5k Star 的代码知识图谱**（深度实操）
3. **普通人能不能玩转英伟达的物理 AI 技能？**（前沿探索）
4. **文轩拆 AI 开源项目：社媒自动上传工具**（项目拆解）
5. **一周一个 AI Agent 项目：从安装到改造**（系列栏目）

**最适合本周的标题**：
**本周我发现 5 个大学生也能跑起来的 AI 项目**

理由：符合固定栏目定位，覆盖所有项目，吸引目标读者（大学生、AI 新人）。

## 7. 下周继续追踪

1. **DeepSeek-Reasonix**：DeepSeek 原生的 AI 编程 Agent，Go 语言重写版
2. **SkillOpt**：微软的技能优化框架，训练可复用自然语言技能
3. **ai-engineering-from-scratch**：485 节课的 AI 工程课程，每个课产出可用资产
4. **superpowers**：Agentic 技能框架，已支持 8 个 AI 编程工具
5. **ECC**：Agent 性能优化系统，技能、本能、记忆、安全一体化
6. **Understand-Anything**：将代码/知识库转为交互式知识图谱
7. **multica**：开源托管 Agent 平台，将编码 Agent 变为真实队友
8. **graphify**：AI 编程助手技能，将任何文件夹转为可查询知识图谱
9. **remove-ai-watermarks**：去除 AI 图片水印的 CLI 工具
10. **video_vip**：全网 VIP 视频免费破解脚本

## 8. 已看过项目记录

| 项目 | GitHub 链接 | 查看时间 | 备注 |
|------|-------------|----------|------|
| CodeGraph | https://github.com/colbymchenry/codegraph | 2026-06-02 | 入选 |
| NVIDIA Skills | https://github.com/NVIDIA/skills | 2026-06-02 | 入选 |
| social-auto-upload | https://github.com/MarySueTeam/social-auto-upload | 2026-06-02 | 入选 |
| agentmemory | https://github.com/rohitg00/agentmemory | 2026-06-02 | 入选 |
| Webwright | https://github.com/microsoft/Webwright | 2026-06-02 | 入选 |
| DeepSeek-Reasonix | https://github.com/esengine/DeepSeek-Reasonix | 2026-06-02 | 追踪 |
| SkillOpt | https://github.com/microsoft/SkillOpt | 2026-06-02 | 追踪 |
| ai-engineering-from-scratch | https://github.com/rohitg00/ai-engineering-from-scratch | 2026-06-02 | 追踪 |
| superpowers | https://github.com/obra/superpowers | 2026-06-02 | 追踪 |
| Understand-Anything | https://github.com/Lum1104/Understand-Anything | 2026-06-02 | 追踪 |
| multica | https://github.com/multica-ai/multica | 2026-06-02 | 追踪 |
| graphify | https://github.com/safishamsi/graphify | 2026-06-02 | 追踪 |
| remove-ai-watermarks | https://github.com/wiltodelta/remove-ai-watermarks | 2026-06-02 | 追踪 |
| video_vip | https://github.com/88lin/video_vip | 2026-06-02 | 追踪 |
| OpenClaw | https://github.com/OpenClaw/OpenClaw | 2026-06-02 | 排除 |
| Hermes Agent | https://github.com/NousResearch/hermes-agent | 2026-06-02 | 排除 |
| TradingAgents | https://github.com/TauricResearch/TradingAgents | 2026-06-02 | 排除 |
| markitdown | https://github.com/microsoft/markitdown | 2026-06-02 | 排除 |
| MoneyPrinterTurbo | https://github.com/harry0703/MoneyPrinterTurbo | 2026-06-02 | 排除 |
| Scrapling | https://github.com/D4Vinci/Scrapling | 2026-06-02 | 排除 |
| claude-plugins-official | https://github.com/anthropics/claude-plugins-official | 2026-06-02 | 排除 |
| andrej-karpathy-skills | https://github.com/multica-ai/andrej-karpathy-skills | 2026-06-02 | 排除 |
| the-book-of-secret-knowledge | https://github.com/trimstray/the-book-of-secret-knowledge | 2026-06-02 | 排除 |
| Agent-Learning-Hub | https://github.com/datawhalechina/Agent-Learning-Hub | 2026-06-02 | 排除 |

---
*雷达生成时间：2026-06-02*
*生成依据：GitHub Trending、Product Hunt、官方文档、一手信源*
*禁止使用低质量中文媒体作为事实来源*