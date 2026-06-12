# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

**本文档会随着项目进展不断更新。**

---

## 最高原则：AI 原生思维（一切以此为准）

**不是人用 AI 辅助干活，而是你从一开始就按「AI 原生」来思考 —— 所有事默认 AI 能做、AI 该做、AI 先做，你只做判断。**

**AI 能做任何事，而人在其中就是决策。**

---

## 项目概览

这是一个 **Obsidian 数字知识库 + 飞书 AI 知识库** 的双知识库项目，记录一位大学生如何从 0 开始打造个人 IP、通过内容创作变现、以及用 AI 工具提升效率的完整过程。

**核心定位**：【大学生 AI 实战家】—— 靠 AI + 技术 + 自媒体，毕业前赚 100 万的真实记录。

**笔名/网名**：车干

**双知识库架构**：
1. **Obsidian 本地知识库**（本仓库）—— 用于本地思考、素材积累、内容创作
2. **飞书 AI 知识库** —— 用于对外展示、知识管理、付费内容

**内容方向**：
1. **AI 工具实战** —— 怎么用、怎么提效
2. **AI 搞钱方法** —— 接单、代做、部署
3. **成长记录** —— 赚了多少、踩了什么坑

---

## 目录结构

```
path-to-wealth-freedom/
├── 内容/
│   ├── 文章/           # 公众号深度文章、案例拆解
│   ├── 选题/           # 每日公众号长文选题学习包（自动生成）
│   ├── 变现/           # AI变现方向随机雷达（自动生成）
│   ├── 资产/           # AI Skill/Prompt资产雷达 + 自媒体赛道认知库
│   ├── 项目/           # SaaS产品创意雷达（自动生成）
│   ├── 图片/           # 文章配图、参考图
│   └── 归档/           # AI返佣项目库、Apple ID美区教程等
├── 项目/
│   └── GitHub雷达/     # 周度GitHub小项目雷达
├── 30天2万粉，2周2000刀X工作流/  # X平台增长工作流
├── HyperFrames-AI视频项目/       # AI视频项目
├── wenxuan-skills/               # 自定义搜索技能
├── cover-image/                  # 封面图生成模板与指南
├── assets/                       # 静态资源（图片等）
├── data/                         # 数据文件
├── scripts/                      # 脚本工具
├── Clippings/                    # 网页剪藏
├── conversations/                # 对话记录
├── Excalidraw/                   # Excalidraw 绘图
├── image-cards/                  # 图片卡片
├── notepix-uploads/              # NotePix 上传
├── output/                       # 输出文件
├── trash-auto/                   # 自动回收
├── .obsidian/                    # Obsidian 配置
├── 个人专属每日工作SOP（最终版）.md  # 每日工作流程
├── README.md                     # 项目公开介绍
└── AGENTS.md                     # 本文档：Codex 项目指导
```

---

## 核心内容文件（最新）

### 📚 文章（内容/文章/）

| 文件 | 内容概要 |
|------|----------|
| `想用上claude code到底有多难.md` | Claude Code 安装与使用踩坑全记录 |
| `如何自建中转，用Codex无限烧token？.md` | GPT Plus 多账号中转站搭建教程 |
| `手里攒了多个 Codex 账号？10分钟教你用 Cockpit Tools 实现一键秒切与多开隔离.md` | Cockpit Tools 多账号管理与配额监控教程 |
| `GPT-image 2.0发布，图像sass天塌了？.md` | GPT-image 2.0 深度评测，最强文生图模型分析 |
| `纯小白如何无限制调用gpt-image2.md` | chatgpt2api 部署教程，给中转站加生图接口 |
| `零基础小白到底怎么参加黑客松？.md` | 黑客松参赛指南：信息获取、心理障碍、团队组建 |
| `收藏了100个AI工具却赚不到钱：你不缺认知，你只是不敢丢脸.md` | 执行力反思：只学不做是认知收藏家的通病 |
| `为什么你永远无法链接优秀的人和资源.md` | 社交能力与资源链接的自我反思 |
| `普通人一个月从0到1万粉，我做对了什么？.md` | X平台涨粉经验（clipping） |

### 📋 选题/变现/资产/项目（自动生成，每日更新）

- `内容/选题/` — 每日公众号长文选题学习包
- `内容/变现/` — AI变现方向随机雷达
- `内容/资产/` — AI Skill与Prompt资产雷达 + 自媒体赛道认知库
- `内容/项目/` — 每日SaaS产品创意雷达
- `项目/GitHub雷达/` — 周度GitHub小项目雷达

### 📦 归档（内容/归档/）

- `AI返佣项目库_最终版/` — 中英双语AI工具联盟营销返佣项目大全（含xlsx/pdf/docx/csv）
- `AI返佣项目库_v2/` — 返佣项目大全v2
- `Apple ID美区教程/` — 美区Apple ID注册图文教程
- `AI工具联盟营销返佣项目大全100+.md` — 早期版本

---

## 核心理念

### 1. 做 IP 的五道门槛
- **表达** —— 把认知翻译成内容的能力
- **持续** —— 拼的不是爆发力，是续航力
- **人格化** —— 让人记住你这个人，而不只是内容
- **暴露感** —— 敢拍、敢发、敢暴露真实现状
- **内耗感** —— 允许自己不完美，在质疑声里继续往前走

### 2. 内容创作 SOP
1. **观点前置** —— 主观表达，引起争议
2. **解释观点** —— 讲故事，自我暴露拉近距离
3. **价值输出** —— 学到了什么？怎么泛化到普通人？

### 3. 赚钱本质
**能让人主动掏钱给你的，只有资源差和信息差。**
- 资源差：时间、人脉、技术
- 信息差：认知差、行业秘密、非共识红利

---

## 可用 Skills

### 用户级 Skills（~/.workbuddy/skills/）
- `khazix-writer` —— 卡兹克公众号长文写作（去AI味、有活人感）
- `anti-pua` —— 反PUA自驱鞭策引擎（六大厂风味，常态化加载）
- `learn` —— 选题深挖学习引擎（冰山理论×正反竞奇，搜索≥20轮，输出写作弹药包，逼输出后衔接wenxuan-writer）

### 项目级 Skills
项目使用 `wenxuan-skills/` 下的搜索技能：
- `source-router` —— 多源搜索聚合与问题到信息源路由技能

### Codex-mem 系列 skills
- `mem-search` —— 跨会话记忆搜索，查找之前解决过的问题
- `timeline-report` —— 项目发展历程时间线分析报告
- `make-plan` —— 创建详细的分阶段实施计划
- `do` —— 使用子代理执行计划
- `knowledge-agent` —— 构建和查询 AI 知识库

### 搜索系列 skills
- `tavily-search` —— LLM 优化的网页搜索
- `tavily-research` —— 全面的 AI 驱动研究（带引用）
- `tavily-extract` —— 从特定 URL 提取纯净 Markdown 内容
- `tavily-crawl` —— 爬取网站并提取多页内容
- `tavily-map` —— 发现并列出网站上的所有 URL
- `web-access` —— 所有联网操作统一入口
- `source-router` —— 多源搜索聚合与自动回退

### Lark 系列 skills
- `lark-wiki` —— 飞书知识库管理
- `lark-doc` —— 飞书云文档操作
- `lark-base` —— 飞书多维表格操作
- `lark-im` —— 飞书即时通讯

---

## Git 工作流

这是一个 Obsidian vault，使用 git 定期备份。提交信息格式通常为：`vault backup: YYYY-MM-DD HH:MM:SS`

---

## 注意事项

- 内容主要为中文
- `.vscode/settings.json` 包含 GitHub token（敏感信息，勿提交）
- 这是个人知识库，不是传统软件项目
- 重点是内容创作、IP 打造、AI 变现
- **本文档 (AGENTS.md) 需要随着项目进展不断更新**

---

## 更新日志

### 2026-06-12
- **全面更新文章列表**：替换过时引用，反映10篇实际存在的文章
- **全面更新目录结构**：新增 选题/变现/资产/项目/GitHub雷达 等目录，删除不存在的 提示词/ 和 .baoyu-skills/
- **更新 Skills 列表**：新增 khazix-writer、anti-pua 用户级 Skills
- **新增归档目录说明**：AI返佣项目库、Apple ID美区教程
- **新增笔名信息**：车干

### 2026-04-20
- **新增 Codex-mem 系列 skills**：mem-search、timeline-report、make-plan、do、knowledge-agent
- **新增 Tavily 搜索系列 skills**：tavily-search、tavily-research、tavily-extract、tavily-crawl、tavily-map、web-access
- **Codex-mem 插件**：已安装，支持跨会话记忆和项目时间线分析

### 2026-04-16
- **新增最高原则**：AI 原生思维（一切以此为准）
- **新增核心定位文档**：车干完整定位与选题生成系统.md
- **更新目录结构**：反映当前真实文件夹状态，删除已不存在的目录
- **更新核心内容文件列表**：只保留当前实际存在的文件
- **更新提示词列表**：新增车干专属写作、选题生成、爆款内容拆解等提示词

---

> **记住：不是人用 AI 辅助干活，而是从一开始就按「AI 原生」来思考。**
