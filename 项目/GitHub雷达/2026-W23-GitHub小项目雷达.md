# 2026-W23 GitHub 小项目雷达

> 本周我发现 5 个普通大学生也能跑起来的 AI 项目

## 0. 本周结论

- **本周最值得跑**：EveryInc/compound-engineering-plugin — 把 AI 编程从"一次性对话"升级为"复利工程"，概念本身就能写一篇好文章
- **本周最适合写公众号**：AgriciDaniel/claude-seo — AI Search 时代，SEO 不等于消亡，等于重构。25 个子技能的 SEO Agent 是绝佳选题
- **本周最适合做内容资产**：GordenSun/GordenPPTSkill — 17 套中文 PPT 模板 + python-pptx 构建管线，直接产出可卖资料包
- **本周最适合 3 小时快速完成**：browser-act/skills — 装上就能让 Agent 突破反爬墙，截图即内容

## 1. 本周搜索范围

- GitHub Trending（trendshift.io 实时排行）
- GitHub Topics：`ai-agent`、`ai-coding`、`mcp`、`browser-agent`、`deep-research`、`content-automation`
- GitHub 搜索关键词：Claude Code、Codex、MCP server、browser use、AI workflow、AI SEO、GEO
- Product Hunt（2026 年第 23 周 AI developer tools）
- Hacker News（Show HN / Launch HN，2026 年 6 月）
- 各项目 GitHub README、Releases、官方文档

## 2. 本周排除项目

| 项目 | 排除原因 |
|------|----------|
| anthropics/claude-plugins-official | 纯 curated list，非可执行项目 |
| datawhalechina/Agent-Learning-Hub | 纯 awesome-list/学习路线 |
| trimstray/the-book-of-secret-knowledge | 纯 cheatsheet 合集 |
| rohitg00/ai-engineering-from-scratch | W22 已入选 |
| multica-ai/multica | W22 追踪，本周无重大更新 |
| colbymchenry/codegraph | W22 已入选 |
| Lum1104/Understand-Anything | W22 追踪，功能重叠 |
| safishamsi/graphify | W22 追踪 |
| BigPizzaV3/CodexPlusPlus | Codex 专用增强器，依赖中转 API 生态，与社媒定位不够贴合 |
| Sophomoresty/gemini-web2api | 本质是 Gemini Web 反向代理，技术有趣但可持续性弱 |
| crynta/terax-ai | 终端模拟器（Tauri+Rust），7MB 轻量但改造门槛高，不适合快速出内容 |
| D4Vinci/Scrapling | 历史已排除（网页抓取框架） |
| sz9751210/project-golem | 无头浏览器 Agent，Star 过低 + Discord 重依赖 |
| mhgd3250905/ugk-claw-personal | Docker Compose 重部署，个人 1 天跑通有风险 |
| Nosheen24/Multi-Agent-Newsletter | Star 极低（个位数），最后一次提交 1 月，不活跃 |

## 3. 本周 5 个优先项目

---

### 项目 1：compound-engineering-plugin — 让 AI 编程从"一次性生成"走向"复利工程"

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | EveryInc/compound-engineering-plugin |
| GitHub | https://github.com/EveryInc/compound-engineering-plugin |
| 文档 | GitHub README（含完整 command reference） |
| Star | ~19,000 |
| 最近更新 | 2026-05-31（v3.9.4） |
| 主要语言 | TypeScript |
| License | MIT |
| 一句话 | 37 个 Skills + 51 个 Agents 的 AI 编程工程化插件，把编码变成"规划→执行→审查→沉淀"的复利循环 |

#### 项目类型

AI Coding / Coding Agent

#### 为什么值得看

它不是又一个"让 AI 帮你写代码"的工具。它的核心洞察是：**当前 AI 编程的最大问题不是代码质量，而是每次对话都像"重新启动项目"**。AI 不会自然继承团队规范、历史决策、架构约束、踩坑经验。

compound-engineering-plugin 的解法是把 AI 编程拆成稳定可复用的环节：

- `/ce-strategy` — 维护产品策略文档
- `/ce-brainstorm` — 交互式需求构思
- `/ce-plan` — 生成结构化实施计划
- `/ce-work` — 按工作项逐步执行
- `/ce-code-review` — 多 Agent 并行代码审查
- `/ce-debug` — 根因定位 + 测试优先修复
- `/ce-compound` — 把已解决问题沉淀为团队知识

这对标的是 AI Coding 的下一个阶段：**不是更快地写代码，而是让每次编码都在为下一次编码减负**。

本周 trending 日增 350+ stars，说明"AI 编程可持续性"正在成为开发者共识。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：不需要企业环境，个人项目就能跑完 brainstorming → plan → work → review → compound 全流程
2. **科技 AI 自媒体**："复利工程"这个概念本身就是一篇好文章——AI 编程不是写得快就行，写得"可持续"才是壁垒
3. **AI Coding 实操者**：37 个 Skills 可以逐个人拆解、测评、写教程，一个插件就是一个内容系列
4. **文轩拆 AI 项目**：可以对比 Claude Code 原生体验 vs 加载 compound-engineering 后的差异，做 A/B 对比

#### 可执行边界判断

- **个人能跑**：是。一个 `npx skills add` 即可安装
- **需企业权限**：否
- **需昂贵 API**：否（用已有的 Claude Code / Codex / Cursor 即可）
- **需复杂部署**：否（插件式安装，无需 Docker）
- **需团队**：否（个人项目也能体验完整流程）
- **适合难度**：**1 天可改造**（安装 5 分钟，理解概念 30 分钟，跑通一个完整循环 2 小时，改造 3 小时）
- **最大风险**：Skills 数量多（37 个），容易陷入"都想试"的范围膨胀。建议只挑 3-5 个核心 skill 深度体验

#### 最小运行路线

1. **读**：README 前 500 行，理解 compound engineering 的 80/20 哲学
2. **装**：`/plugin marketplace add EveryInc/compound-engineering-plugin` + `/plugin install compound-engineering`
3. **配**：在任意项目里跑 `/ce-setup`，自动检测环境
4. **跑**：用 `/ce-brainstorm "做一个 Markdown 转公众号排版工具"` → `/ce-plan` → `/ce-work` → `/ce-code-review` → `/ce-compound`
5. **截图**：截取 brainstorming 交互、plan 产物、review 多 Agent 并行输出、compound 知识沉淀
6. **判断跑通**：完成一次完整的 "brainstorm→plan→work→review→compound" 并生成 STRATEGY.md + 至少一个 compound 笔记

#### 我能改造什么

1. **改造成"AI 项目复盘 Skill"**（最优）：把 `/ce-compound` 改造成面向自媒体内容创作者的复盘系统，每次做完一个 AI 实验自动生成复盘笔记
2. **改造成"公众号选题→大纲→初稿→审查→发布"管线**：把 brainstorm→plan→work→review→compound 映射到内容生产流程
3. **改造成"AI Coding 学习路径生成器"**：用 strategy→ideate→brainstorm→plan 链路为学生生成个性化 AI Coding 学习计划

#### 可写成的公众号标题

1. 《我装了一个让 AI 编程"复利增长"的插件，发现普通大学生也能用》
2. 《AI 编程最大的坑不是代码写不对，而是每次都从头开始》
3. 《这个 GitHub 项目提出了"复利工程"，我觉得它说对了 AI Coding 的未来》

#### 1 天实操路线

- **上午（2h）**：读 README + 安装 + 跑 `/ce-setup` + 理解每个 skill 的定位
- **下午（3h）**：用自己的一个小项目跑一遍完整循环（brainstorm→plan→work→review→compound），把过程截图
- **晚上（2h）**：写教程，总结"有插件 vs 无插件"的体验差异，输出公众号长文 + 复利工程概念拆解

#### 可沉淀资产

- **公众号长文**：《复利工程：AI 编程的下一个阶段》
- **中文教程**：《compound-engineering-plugin 上手指南》（含截图 + 踩坑记录）
- **Skill 模板**：基于 compound-engineering 的"内容生产复盘 Skill"（输入：一个已完成的内容项目，输出：结构化复盘笔记）
- **服务样板页**：展示用 compound-engineering 管理个人 AI 项目的完整流程

**Skill 结构（内容生产复盘 Skill）**：
- Skill 名称：`content-compound`
- 输入：项目名、完成日期、使用的工具链、踩坑记录
- 输出：`COMPOUND-{项目名}.md`（含问题描述、根因、解决方案、下次注意事项）
- 包含文件：`SKILL.md`、`templates/compound-template.md`、`examples/`
- 使用场景：每次完成一个 AI 实验 / 内容项目后运行

#### 变现 / 引流可能性

- **免费资料引流**：中文教程 + 安装指南作为公众号关注福利
- **代搭服务**：帮想学 AI Coding 的新手配置 compound-engineering 环境
- **作品集**：展示用 compound-engineering 管理的一系列 AI 项目，体现工程化思维
- **不适合卖课**：概念偏进阶，更适合作为内容资产吸引 AI Coding 进阶用户

---

### 项目 2：browser-act/skills — 让 AI Agent 真正突破反爬墙的浏览器技能库

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | browser-act/skills |
| GitHub | https://github.com/browser-act/skills |
| 文档 | GitHub README + docs/ 目录（安装、快速开始、Skill Forge、命令参考） |
| Star | ~1,400 |
| 最近更新 | 2026 年 6 月（活跃维护中） |
| 主要语言 | Python |
| License | MIT |
| 一句话 | 专为 AI Agent 设计的浏览器自动化 CLI，三层反爬 + 人机交接 + Skill Forge 自动生成爬虫 |

#### 项目类型

MCP / Workflow / Browser Agent

#### 为什么值得看

AI Agent 做网页自动化的最大痛点不是"不够聪明"，而是**卡在最后一步**：Cloudflare 盾、验证码、登录态丢失、页面结构突变。

browser-act 的四层设计直接对标这个问题：

1. **突破反爬墙**：环境层（指纹伪装 + TLS 轮换）→ 执行层（自动验证码识别）→ 人机交接层（生成远程链接，人接管后 Agent 继续）
2. **三种浏览器模式**：chrome（复用本地登录态）、stealth 隐私模式（批量抓取）、stealth 固定身份（多账号隔离）
3. **零干扰并发**：跨浏览器独立 cookie/指纹/代理，同浏览器多会话共享登录态但互不阻塞
4. **为 Agent 推理设计**：紧凑文本输出（比 JSON 省数倍 token）、索引式交互（`click 3`、`input 2 "hi"`）

更有意思的是 **Skill Forge**：让 Agent 探索一个网站一次，自动生成可复用的 Skill 包（含 `SKILL.md` + Python 脚本），后续爬取不需要重新探索。

#### 为什么适合黄文轩

1. **AI 产品实验者**：browser-act 是理解"Agent 如何与真实网页交互"的最佳教学项目
2. **AI Coding 实操者**：Skill Forge 的自动生成逻辑值得拆解——Agent 如何探索网站、如何发现 API 模式、如何生成稳定脚本
3. **内容生产**：可以用 browser-act 搭建选题雷达（自动爬取 GitHub Trending / HN / PH）、竞品监控
4. **教程价值极高**：从安装到跑通到 Skill Forge 生成第一个爬虫，每一步都能截图

#### 可执行边界判断

- **个人能跑**：是。`pip install` 即可
- **需企业权限**：否
- **需昂贵 API**：否（核心功能不依赖 LLM API，Skill Forge 可选配）
- **需复杂部署**：否（本地 Python 脚本）
- **需团队**：否
- **适合难度**：**3 小时可跑**（安装 10 分钟 + 跑通 stealth-extract 30 分钟 + Skill Forge 生成第一个爬虫 1 小时）
- **最大风险**：部分网站反爬强度高，stealth 模式可能仍需调试

#### 最小运行路线

1. **读**：README 前 300 行 + docs/quick-start.md
2. **装**：告诉你的 AI Agent "Install browser-act. Skill source: https://github.com/browser-act/skills/tree/main/browser-act"
3. **跑**：`browser-act stealth-extract https://example.com` → 提取受保护页面内容
4. **进阶**：安装 browser-act-skill-forge，让 Agent "Forge a Skill that extracts trending repos from GitHub Trending"
5. **截图**：截取 stealth-extract 成功输出 + Skill Forge 生成的 SKILL.md + 运行 Skill 的结果
6. **判断跑通**：成功从至少一个需要反爬的网站提取结构化数据

#### 我能改造什么

1. **改造成"GitHub 小项目雷达自动采集器"**（最优）：用 Skill Forge 生成一个自动爬取 GitHub Trending 的 Skill，每天自动采集候选项目列表
2. **改造成"AI 工具目录自动更新器"**：用 browser-act 自动爬取 Product Hunt AI 分类 + 更新工具目录数据库
3. **改造成"竞品内容监控 Skill"**：自动监控指定公众号 / 网站的更新，对比标题和关键词变化

#### 可写成的公众号标题

1. 《我让 AI 自己突破了反爬墙，它给我生成了一整套爬虫》
2. 《这个 GitHub 项目解决了 AI Agent 最大的尴尬：打开网页就卡住》
3. 《Skill Forge：一个会自动写爬虫的 AI，我跑通了》

#### 1 天实操路线

- **上午（2h）**：读 README + 安装 + 跑通基础命令（open、state、click、input、stealth-extract）
- **下午（3h）**：安装 Skill Forge → 让它生成一个 GitHub Trending 爬虫 → 调试 → 跑出第一批数据
- **晚上（2h）**：截图 + 写教程 + 总结"AI Agent 浏览器自动化的现状和瓶颈" → 公众号长文

#### 可沉淀资产

- **公众号长文**：《AI Agent 浏览器自动化踩坑全记录》
- **中文教程**：《browser-act 上手指南：从 stealth-extract 到 Skill Forge》
- **Skill**：GitHub Trending 自动采集 Skill（输入：日期范围，输出：trending 项目列表 Markdown）
- **服务样板页**：展示用 browser-act 搭建的自动化信息采集管线

**Skill 结构（GitHub Trending 采集 Skill）**：
- Skill 名称：`github-trending-scraper`
- 输入：日期、语言过滤、最小 star 数
- 输出：`trending-YYYY-MM-DD.md`（项目名、链接、描述、star、语言）
- 包含文件：`SKILL.md`、`scraper.py`、`config.json`
- 使用场景：每日自动采集 GitHub Trending，作为小项目雷达的数据源

#### 变现 / 引流可能性

- **免费资料引流**：browser-act 中文教程 + Skill Forge 使用指南
- **代搭服务**：帮自媒体人搭建自动化信息采集管线
- **不适合卖课**：偏工具使用，更适合作为"AI 自动化"系列内容的一部分
- **作品集**：展示自主搭建的自动化信息采集系统

---

### 项目 3：Arnold-Jun/DeepResearch — 中文友好的多 Agent 深度研究系统

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | Arnold-Jun/DeepResearch |
| GitHub | https://github.com/Arnold-Jun/DeepResearch |
| 文档 | GitHub README（含完整架构图、配置说明、YAML 配置示例） |
| Star | 较新项目，Star 处于早期增长阶段 |
| 最近更新 | 2026 年 6 月 |
| 主要语言 | Python |
| License | 待确认（README 未明确标注） |
| 一句话 | 基于分层编排架构的多 Agent 深度研究系统，自动分解→并行执行→汇总生成报告 |

#### 项目类型

AI Agent

#### 为什么值得看

DeepResearch 类项目很多，但 Arnold-Jun/DeepResearch 有几个差异化点：

1. **中文优先**：README、注释、配置说明全部中文，对中文开发者友好
2. **分层编排架构**：Planner（规划）→ Scheduler（调度）→ RoundRunner（执行）→ Aggregator（聚合）→ Summarizer（总结），五层清晰分离
3. **三种 Agent 类型各司其职**：DeepResearcherAgent（深度搜索）、DeepAnalyzerAgent（多模型并行分析）、BrowserUseAgent（浏览器自动化）
4. **YAML 配置继承**：支持 base.yaml + 主配置的继承覆盖，方便切换不同 LLM / 搜索引擎
5. **失败重试 + 子任务超时**：生产级容错设计，不会一个子任务卡死全局

它的架构值得学习：不是简单地把 LLM 放进 while 循环，而是真正设计了任务分解→调度→并行执行→聚合的工程管线。

#### 为什么适合黄文轩

1. **大学生 AI 实战家**：Python 环境 + pip install + YAML 配置，纯本地可跑
2. **AI 产品实验者**：整个编排架构是理解"多 Agent 协作系统"的最佳教学案例
3. **可写教程**：可以对比"单 Agent 搜索"vs"多 Agent 编排搜索"的质量差异，做 A/B 实验
4. **可改造**：可以把 DeepResearcherAgent 换成"公众号选题研究员"，DeepAnalyzerAgent 换成"内容结构分析师"

#### 可执行边界判断

- **个人能跑**：是。Python 3.8+ + pip install + API Key
- **需企业权限**：否
- **需昂贵 API**：取决于配置的 LLM。用 qwen3-8b 等开源模型可降低成本，但效果会打折扣。推荐用 Gemini 2.5 Flash（便宜 + 效果好）
- **需复杂部署**：否（纯 Python，无 Docker 硬依赖）
- **需团队**：否
- **适合难度**：**1 天可改造**（安装 30 分钟 + 理解架构 1 小时 + 跑通官方示例 1 小时 + 改造 3 小时）
- **最大风险**：API 调用次数多（每个子任务都会调 LLM），如果用付费 API 要注意成本控制

#### 最小运行路线

1. **读**：README 架构图 + "快速开始"章节
2. **装**：`git clone` + `pip install -r requirements.txt`
3. **配**：创建 `.env`，填入至少一个 LLM API Key（推荐 Gemini）+ 搜索引擎 API Key（Serper 或 Firecrawl）
4. **跑**：`python main.py --config configs/config_main.yaml --task "研究 2026 年 AI Agent 的最新进展"`
5. **截图**：截取 Planner 分解的任务树 + Scheduler 分配的 Agent + 各 Agent 并行执行的输出 + Summarizer 生成的最终报告
6. **判断跑通**：从输入任务到输出结构化研究报告，全程自动完成

#### 我能改造什么

1. **改造成"公众号选题深度研究 Agent"**（最优）：把 Planner 的任务分解逻辑改成选题拆解（核心观点→论据→案例→金句→标题），Summarizer 生成选题简报
2. **改造成"AI 工具横向测评 Agent"**：让 DeepResearcherAgent 搜索工具信息，DeepAnalyzerAgent 对比分析，Summarizer 生成对比评测报告
3. **改造成"竞品内容策略分析 Agent"**：监控竞品公众号的内容方向、标题模式、发布频率，生成竞品分析报告

#### 可写成的公众号标题

1. 《我跑通了一个多 Agent 研究系统，它用 5 层架构自动写出了一份报告》
2. 《深度研究 Agent 到底怎么工作的？我拆了一个中文开源项目》
3. 《三个 AI Agent 同时帮我做研究，结果比单个 GPT 强在哪？》

#### 1 天实操路线

- **上午（2h）**：读 README + 理解架构（Planner→Scheduler→RoundRunner→Aggregator→Summarizer）+ 安装配置
- **下午（3h）**：跑通官方示例 + 用自己的选题跑一次（如"研究 2026 年 AI Coding 工具的发展趋势"）+ 分析输出质量
- **晚上（2h）**：截图 + 写教程 + 对比"单 Agent 搜索"vs"多 Agent 编排"的差异 + 公众号长文

#### 可沉淀资产

- **公众号长文**：《拆解一个多 Agent 深度研究系统：5 层架构如何自动生成报告》
- **中文教程**：《DeepResearch 上手指南：从安装到生成第一份报告》
- **Prompt 模板**：适用于 DeepResearch 的选题研究 Prompt 模板集
- **配置模板**：针对不同场景（技术调研、行业分析、竞品研究）的 YAML 配置文件

#### 变现 / 引流可能性

- **免费资料引流**：中文教程 + 配置模板作为公众号关注福利
- **作品集**：展示用 DeepResearch 生成的深度研究报告，体现 Agent 工程能力
- **不适合直接卖课**：但可以作为"AI Agent 开发实战"系列课程的一个模块
- **代搭服务**：帮自媒体人搭建专属的选题研究 Agent

---

### 项目 4：AgriciDaniel/claude-seo — 25 个子技能的 SEO Agent，AI Search 时代的必备

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | AgriciDaniel/claude-seo |
| GitHub | https://github.com/AgriciDaniel/claude-seo |
| 文档 | GitHub README + docs/COMMANDS.md + 完整 Methodology 文档 |
| Star | ~26,000 |
| 最近更新 | 2026 年 6 月（活跃维护） |
| 主要语言 | Markdown（Skill 定义）+ Shell（安装脚本） |
| License | MIT |
| 一句话 | Claude Code 的通用 SEO Skill，25 个子技能 + 18 个专业 Agent 并行审计，覆盖技术 SEO、E-E-A-T、Schema、GEO/AEO、本地 SEO |

#### 项目类型

GEO / SEO / 内容自动化

#### 为什么值得看

AI Search 时代，很多人说"SEO 死了"。但 claude-seo 的回答是：**SEO 没有死，它被重构了**。

这个项目有几个关键信号：

1. **GEO（Generative Engine Optimization）已内置**：`/seo geo <url>` 专门针对 AI Overviews 做优化，包括 passage citability 评分、llms.txt 检查、IPTC 元数据标注
2. **可证伪的推荐**：每条 SEO 建议都附带"怎么知道它失败了？"检查项，不是玄学
3. **并行 Agent 执行**：全站审计同时启动最多 15 个 Agent，分钟级出结果而非小时级
4. **从"关键词堆砌"到"信源可信度"**：核心指标不再是关键词密度，而是 E-E-A-T（Experience, Expertise, Authoritativeness, Trustworthiness）和 AI-citability

这是本周与黄文轩内容定位最直接相关的项目——GEO / AI Search 优化正是"内容增长"的核心战场。

#### 为什么适合黄文轩

1. **科技 AI 自媒体**：GEO 是 2026 年内容创作者必须理解的概念。这个项目是理解 GEO 的实操入口
2. **AI 产品实验者**：可以拿自己的公众号文章跑一遍 `/seo geo`，看看 AI Search 怎么评价你的内容
3. **内容增长 / 变现**：理解 GEO 后，可以产出"AI Search 时代的内容创作指南"系列内容
4. **可写对比测评**：`/seo audit` vs 传统 SEO 工具（如 Ahrefs），展示 AI-native SEO 的差异

#### 可执行边界判断

- **个人能跑**：是。一个 plugin install 命令即可
- **需企业权限**：否
- **需昂贵 API**：否（用已有的 Claude Code 即可）。可选扩展（DataForSEO、Firecrawl）需付费，但核心功能不依赖
- **需复杂部署**：否（插件式安装，无需 Docker）
- **需团队**：否
- **适合难度**：**1 天可改造**（安装 5 分钟 + 跑通 3-5 个命令 2 小时 + 理解输出并改造 3 小时）
- **最大风险**：SEO 领域知识门槛。如果不理解 technical SEO / E-E-A-T / Schema 的基础概念，可能看不懂输出。建议先花 30 分钟读 Google 官方的 SEO 入门指南

#### 最小运行路线

1. **读**：README 前 400 行 + docs/COMMANDS.md（了解所有可用命令）
2. **装**：`/plugin marketplace add AgriciDaniel/claude-seo` + `/plugin install claude-seo@agricidaniel-claude-seo`
3. **跑**：
   - `/seo page https://your-blog.com/article` — 单页面分析
   - `/seo geo https://your-blog.com/article` — GEO/AI Search 优化分析
   - `/seo audit https://your-blog.com` — 全站审计（可选，如果自己有博客站）
4. **截图**：截取 page 分析的 E-E-A-T 评分 + geo 分析的 citability 评估 + audit 的优先级行动计划
5. **判断跑通**：成功对至少一个页面完成 `/seo page` 和 `/seo geo`，理解输出中的每项建议

#### 我能改造什么

1. **改造成"公众号文章 GEO 评分器"**（最优）：把 `/seo geo` 的输出逻辑映射到公众号文章——标题的可搜索性、正文的 citability、结构化数据的完整性
2. **改造成"AI 内容创作检查清单"**：基于 claude-seo 的 E-E-A-T 和 citability 指标，生成一份公众号创作前的检查清单
3. **改造成"竞品 GEO 对比分析 Skill"**：批量跑多个竞品公众号的文章 URL，对比 GEO 得分，输出优化建议

#### 可写成的公众号标题

1. 《我让 AI 给自己的公众号文章做了一次 SEO，它说我的 GEO 得分不及格》
2. 《AI Search 时代，SEO 死了吗？这个 GitHub 项目的回答让我重新理解了"搜索"》
3. 《25 个 AI Agent 同时给我做网站审计，我发现了内容增长的秘密》

#### 1 天实操路线

- **上午（2h）**：读 README + 安装 + 理解 SEO/E-E-A-T/GEO 基础概念（快速看 Google SEO Starter Guide）
- **下午（3h）**：用自己的文章跑 `/seo page` + `/seo geo` + 理解每个建议的含义 + 根据建议修改一篇文章
- **晚上（2h）**：截图对比修改前后的 GEO 得分 + 写教程 + 输出"AI Search 时代内容创作指南"长文

#### 可沉淀资产

- **公众号长文**：《AI Search 时代，内容创作者必须知道的 5 个 GEO 概念》
- **中文教程**：《claude-seo 上手指南：从安装到看懂你的第一篇 GEO 报告》
- **检查清单**：《公众号文章 GEO 优化检查清单》（基于 claude-seo 的 E-E-A-T + citability 指标改制）
- **Notion 模板**：《AI Search 内容优化工作台》（含页面分析记录、GEO 得分追踪、优化日志）

**Skill 结构（公众号 GEO 评分 Skill）**：
- Skill 名称：`wechat-geo-scorer`
- 输入：公众号文章 URL 或 Markdown 正文
- 输出：GEO 评分（0-100）+ 逐项建议（标题可搜索性、E-E-A-T 信号、结构化数据、citability）
- 包含文件：`SKILL.md`、`scoring-rubric.md`、`examples/`
- 使用场景：每篇公众号文章发布前跑一遍，作为质量门禁

#### 变现 / 引流可能性

- **免费资料引流**：《AI Search 时代内容创作指南》PDF 作为公众号关注福利
- **卖模板**：GEO 优化检查清单 Notion 模板（定价 9.9-19.9 元）
- **代搭服务**：帮自媒体人配置 claude-seo + 跑第一次审计 + 解读报告
- **教程变现**："AI Search 优化实战"小报童专栏

---

### 项目 5：GordenSun/GordenPPTSkill — 17 套中文 PPT 模板 + 零代码生成管线

#### 项目信息

| 字段 | 内容 |
|------|------|
| 项目名 | GordenSun/GordenPPTSkill |
| GitHub | https://github.com/GordenSun/GordenPPTSkill |
| 文档 | GitHub README（含安装、使用、模板列表、效果图） |
| Star | ~37,000 |
| 最近更新 | 2026 年 6 月（活跃维护，支持自动更新） |
| 主要语言 | Python（python-pptx 构建管线）+ Markdown（Skill 定义） |
| License | 个人/研究使用（非商业） |
| 一句话 | AI 友好的 PPT 构建 Skill：17 套精调中文模板 + edits.json 纯文本编辑 + python-pptx 构建管线，输入文字产出真 PPTX |

#### 项目类型

资料包 / 模板 / Skill

#### 为什么值得看

这个项目把"AI 生成 PPT"这件事做到了一个很有意思的层次：

1. **不是"AI 画 PPT"，是"AI 填 PPT"**：模板的版式、配色、字体由人精调，AI 只负责填入内容。这解决了 AI 生成 PPT 排版难看的核心痛点
2. **Skill 自动更新机制**：作者更新模板后，使用 Skill 时会自动拉取最新版本。Skill 像软件一样可以更新
3. **纯文本编辑接口**：修改 PPT 只需要写一个 `edits.json`，不需要操作 PowerPoint
4. **17 套模板覆盖多种场景**：商务总结、项目汇报、产品介绍、数据分析等
5. **国产模型友好**：实测支持 DeepSeek、小米 Mimo、Claude、GPT

它是本周最接近"可卖资料包"的项目——17 套模板 + 构建管线 = 一个完整的产品。

#### 为什么适合黄文轩

1. **AI 内容生产**：可以用这个 Skill 快速生成内容相关的 PPT（如"本周 AI 趋势汇报"、"AI 工具测评报告"）
2. **AI 产品实验者**：可以拆解它的 Skill 结构（SKILL.md + manifest.json + scripts/ + templates/），理解一个生产级 Skill 是怎么设计的
3. **资料包变现**：可以基于这个思路做自己的"公众号排版模板包"或"AI 实验报告模板"
4. **教程价值**：从安装到生成第一份 PPT，全流程适合写成教程

#### 可执行边界判断

- **个人能跑**：是。`pip install python-pptx` + 安装 Skill 即可
- **需企业权限**：否
- **需昂贵 API**：否（生成 PPT 需要 LLM 调用来写 edits.json，但成本很低）
- **需复杂部署**：否（纯 Python 脚本，无 Docker）
- **需团队**：否
- **适合难度**：**3 小时可跑**（安装 10 分钟 + 选模板 10 分钟 + 让 Agent 生成 PPT 30 分钟 + 调整和截图 1 小时）
- **最大风险**：模板使用微软雅黑字体，Windows 以外系统需要配置字体回退。Windows 用户无此问题

#### 最小运行路线

1. **读**：README 前 200 行，看模板效果图
2. **装**：告诉 AI Agent "安装这个 Skill：https://github.com/GordenSun/GordenPPTSkill"
3. **选**：从 17 个模板中选一个（建议从 `minimal-business-summary` 开始）
4. **跑**：让 Agent 读取你的一篇公众号文章，用 Skill 生成一份 PPT
5. **截图**：截取生成的 PPTX 关键页面 + 渲染预览图
6. **判断跑通**：生成一个可打开的真实 PPTX 文件，页面排版完整、内容准确

#### 我能改造什么

1. **改造成"公众号文章→PPT 一键转换 Skill"**（最优）：封装一个专门面向公众号创作者的 PPT 生成工作流（输入：文章 Markdown，输出：适合演讲/汇报的 PPTX）
2. **改造成"AI 实验报告 PPT 模板包"**：基于 17 个模板的风格，制作一套"AI 实验报告"专用模板（含实验目的、方法、结果、结论、下一步的固定版式）
3. **改造成"周报/月报自动生成 Skill"**：结合内容日历，每周/每月自动生成汇报 PPT

#### 可写成的公众号标题

1. 《我让 AI 用 17 套模板给我生成了一个 PPT，效果比我做的还好》
2. 《这个 GitHub 项目让我发现了 AI 做 PPT 的正确姿势：别让 AI 画，让 AI 填》
3. 《36K Star 的 PPT Skill 拆解：一个大学生怎么用 AI 做出商务级 PPT？》

#### 1 天实操路线

- **上午（2h）**：读 README + 安装 + 浏览 17 个模板 + 选 3 个模板分别生成 PPT
- **下午（3h）**：深入拆解 Skill 结构（SKILL.md、manifest.json、build_pptx.py）+ 理解 edits.json 的编辑规则
- **晚上（2h）**：截图 + 写教程 + 输出"AI PPT Skill 的正确使用姿势"公众号长文 + 整理 17 个模板的适用场景表

#### 可沉淀资产

- **公众号长文**：《AI 生成 PPT 的正确姿势：模板 + 管线，而不是让 AI 画》
- **中文教程**：《GordenPPTSkill 上手指南：17 个模板的场景选型 + edits.json 编辑技巧》
- **资料包**：《公众号创作者 PPT 模板精选》（从 17 个模板中精选 5 个最适合内容创作者的，附带使用说明）
- **Skill**：封装好的"公众号→PPT"一键转换 Skill

**Skill 结构（公众号→PPT Skill）**：
- Skill 名称：`wechat-to-pptx`
- 输入：公众号文章 Markdown 文件路径
- 输出：PPTX 文件（适合线下分享 / 演讲 / 汇报）
- 包含文件：`SKILL.md`、`templates/mapping.json`（文章结构→PPT 版式映射）、`scripts/convert.py`
- 使用场景：每篇长文发布后自动生成配套 PPT

#### 变现 / 引流可能性

- **直接变现**：精选模板包（5-10 套 PPT 模板 + 使用教程）定价 19.9-39.9 元
- **免费资料引流**：3 套免费模板 + 完整教程 PDF 作为公众号关注福利
- **代做服务**：帮企业/自媒体人用 AI 批量生成品牌 PPT 模板
- **教程卖课**："AI PPT 从入门到变现"小报童专栏（含模板、教程、接单话术）

---

## 4. 本周最推荐先跑

### EveryInc/compound-engineering-plugin

**为什么最值得先跑：**

1. **概念即内容**。"复利工程"这个理念本身就是一篇好文章，不需要你先成为某个领域的专家才能讲清楚。你只需要装好插件、跑通一个循环、截图、写体验——内容的骨架就已经有了。

2. **与定位完美匹配**。你是 AI Coding 实操者，你的读者想看的就是"普通人怎么用 AI 更好地写代码"。compound-engineering 回答的正是这个问题——不是"AI 帮你写"，而是"AI 帮你建立可持续的编码习惯"。

3. **1 天能看到成果**。安装 5 分钟，跑通一个完整循环 2 小时，截图 + 写教程 3 小时。一次坐下来就能产出内容。

4. **可沉淀资产明确**。中文教程 + 内容生产复盘 Skill + 公众号长文。三件套一次产出。

**为什么最适合我现在的定位：**

你正在从"AI Coding 学习者"转型为"AI Coding 分享者"。compound-engineering 是一个完美的桥梁——你不需要证明自己是顶级工程师，你只需要展示"一个普通大学生怎么用它让编码更高效"。

**今天最小版本是什么：**

1. 安装 compound-engineering-plugin（5 分钟）
2. 用 `/ce-brainstorm "做一个公众号文章排版工具"` 跑一次需求构思（15 分钟）
3. 截图 brainstorming 的输出
4. 写一篇 1500 字短文：《我试了"复利工程"插件，发现 AI 编程的下一步不是写得更快》

**今天不要做什么：**

- 不要试图理解全部 37 个 Skills——只用 brainstorm + plan + work 三个
- 不要改代码——先跑通原生体验
- 不要做 A/B 对比——一篇纯体验文就够了
- 不要追求完美截图——真实的使用过程比完美的结果更有说服力

## 5. 本周 3 小时低门槛项目

### browser-act/skills

**3 小时能完成什么：**

1. 安装 browser-act（10 分钟）
2. 跑通 `stealth-extract` 从至少一个网站提取受保护内容（30 分钟）
3. 安装 Skill Forge，让它生成一个 GitHub Trending 爬虫 Skill（1 小时）
4. 运行生成的 Skill，拿到第一批数据（30 分钟）
5. 截图 + 写一篇 800 字短文（50 分钟）

**能截图什么：**

- stealth-extract 成功绕过反爬的输出
- Skill Forge 生成的 SKILL.md 内容
- 运行爬虫 Skill 得到的结构化数据

**能写成什么短内容：**

《我用 3 小时让 AI 自己写了个爬虫，它真的跑通了》——适合发即刻 / 小红书 / 公众号短文

**如果本周很忙，如何只做这个最小版本：**

只做 browser-act + stealth-extract。15 分钟装好，15 分钟跑通第一个网站，30 分钟截图 + 写短文。1 小时搞定一期内容。

## 6. 本周内容栏目建议

| 标题 | 对应项目 | 适合平台 |
|------|----------|----------|
| 本周我发现 5 个大学生也能跑起来的 AI 项目 | 本周雷达全文 | 公众号长文 |
| 我用 1 天跑通一个"复利工程"插件，发现 AI 编程的下一步 | compound-engineering | 公众号头条 |
| AI Search 时代，你的内容能被 AI 搜索到吗？ | claude-seo | 公众号次条 |
| 这个 GitHub 项目让我 3 小时跑通了一个自动爬虫 | browser-act | 即刻 / 小红书 |
| 17 套模板 + AI = 不会做 PPT 的人也能做出商务级 PPT | GordenPPTSkill | 公众号 / B 站 |

**本周最适合的标题（头条）**：《我装了一个让 AI 编程"复利增长"的插件，发现普通大学生也能用》

理由：概念新鲜、有反差感、定位准确（AI Coding 实操）、不依赖前置知识。

## 7. 下周继续追踪

| 项目/方向 | 追踪原因 |
|-----------|----------|
| GordenSun/GordenPPTSkill | 关注模板更新频率和社区反馈，判断是否值得做深度拆解 |
| browser-act/skills | 关注 Skill Forge 的后续更新，是否有更多预生成 Skill 发布 |
| Anthropic 官方 Skills 生态 | Claude Code 的 Plugin Marketplace 正在快速扩展，关注新上架的优质 Skill |
| terax-ai | 本周排除但值得关注，如果后续推出更轻量的 CLI 版本可以考虑 |
| AI Search / GEO 工具 | 随着 Google AI Overviews 持续扩大覆盖，GEO 工具会成为刚需 |
| Cursor / Codex 插件生态 | 关注 AI Coding 工具从"写代码"到"管理代码"的范式迁移 |
| 中文 AI Coding 教程类项目 | 关注质量高的中文 AI Coding 开源教程，可补充到资料包 |

## 8. 已看过项目记录

本周审阅的候选项目（含入选和排除）：

| 项目 | 链接 | 状态 |
|------|------|------|
| EveryInc/compound-engineering-plugin | https://github.com/EveryInc/compound-engineering-plugin | ✅ 入选 #1 |
| browser-act/skills | https://github.com/browser-act/skills | ✅ 入选 #2 |
| Arnold-Jun/DeepResearch | https://github.com/Arnold-Jun/DeepResearch | ✅ 入选 #3 |
| AgriciDaniel/claude-seo | https://github.com/AgriciDaniel/claude-seo | ✅ 入选 #4 |
| GordenSun/GordenPPTSkill | https://github.com/GordenSun/GordenPPTSkill | ✅ 入选 #5 |
| BigPizzaV3/CodexPlusPlus | https://github.com/BigPizzaV3/CodexPlusPlus | ❌ Codex 专用 |
| Sophomoresty/gemini-web2api | https://github.com/Sophomoresty/gemini-web2api | ❌ 可持续性弱 |
| crynta/terax-ai | https://github.com/crynta/terax-ai | ❌ 改造门槛高 |
| Nembie/claude-code-skills | https://github.com/Nembie/claude-code-skills | ❌ 2 月未更新 |
| sz9751210/project-golem | https://github.com/sz9751210/project-golem | ❌ Star 过低 |
| mhgd3250905/ugk-claw-personal | https://github.com/mhgd3250905/ugk-claw-personal | ❌ Docker 重部署 |
| Cat3399/deepresearch | https://github.com/cat3399/deepresearch | ❌ 类似项目但 README 不如 Arnold-Jun 清晰 |
| Nosheen24/Multi-Agent-Newsletter | https://github.com/Nosheen24/Multi-Agent-Newsletter | ❌ 不活跃 + Star 极低 |

---

## 附录：本周去重说明

本周搜索前读取了工作区全部 7 个历史雷达文件（W22 ×1 + W23 ×6），共 32 个已入选项目和 37 个已排除项目。本周 5 个项目均未在历史文件中出现。完整历史项目清单见 [File Agent 返回结果]。

## 自检清单

- [x] 搜索了 GitHub Trending 和 AI Agent / AI Coding 相关 Topics
- [x] 先看了 20+ 候选，再筛出 5 个
- [x] 排除了纯 awesome-list、纯论文、跑不起来、企业级权限项目
- [x] 5 个项目均未在历史文件中出现
- [x] 5 个项目符合黄文轩社媒定位（AI Coding / Agent / GEO / 内容自动化 / Skill）
- [x] 至少有 1 个 3 小时可跑项目（browser-act/skills + GordenPPTSkill）
- [x] 每个项目有 GitHub 链接和真实信息（通过 web_fetch 验证）
- [x] 每个项目写清楚最小运行路线
- [x] 每个项目有 3 个公众号标题
- [x] 每个项目有改造方向和 1 天实操路线
- [x] 写清楚可沉淀资产和变现/引流方式
- [x] 未使用新浪、凤凰、百家号、网易、搜狐等低质量中文媒体作为事实来源
