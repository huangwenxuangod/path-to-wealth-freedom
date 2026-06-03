# agent.md

## 自动化任务总览

### 1. 每日公众号长文选题学习包 Agent
- 目标：每天从最新 AI 信源中筛出 5 个公众号长文选题，并选出 1 个今日主任务
- 输出目录：内容/选题/
- 输出格式：YYYY-MM-DD-每日公众号长文选题学习包.md
- 重点：AI Coding、AI 产品、AI 自媒体、AI 变现、中国 AI / Agent 热点

### 2. 每日 AI Skill / Prompt 资产雷达 Agent
- 目标：每天搜索并整理 10 条可复用 AI Skill / Prompt / 图像 Prompt / GitHub 资产
- 输出目录：内容/资产/
- 输出格式：YYYY-MM-DD-每日AI Skill与Prompt资产雷达.md
- 总库：data/ai-assets/ai-skill-prompt-assets.csv

### 3. 工作区自动归档整理 Agent
- 目标：整理 D:\path-to-wealth-freedom 工作区所有文件
- 扫描范围：整个工作区
- 跳过：代码项目核心文件、.git、.env、源码目录
- 归档方式：按用途 + 月份
- 无用文件：移动到 trash-auto/YYYY-MM-DD/
- 删除策略：不直接永久删除
- 输出报告：不生成归档报告
- 维护文件：自动更新 CLAUDE.md、agent.md、README.md

## 安全规则
- 不直接永久删除文件
- 不移动代码项目核心文件
- 不覆盖同名文件
- 不破坏项目可运行性
- 无法判断价值的文件优先归档，不进 trash
- 所有无用文件只进入 trash-auto

## 最近更新时间
2026-06-03
