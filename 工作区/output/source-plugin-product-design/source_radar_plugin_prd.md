# 信源插件产品设计方案：Source Radar

生成日期：2026-06-04

## 1. 产品定位

Source Radar 是一个面向 AI 产品、内容创作、竞品分析和技术趋势研究者的 Chrome 新标签页插件。

它不是收藏夹，也不是普通 RSS 阅读器，而是一个高频触发的个人信息差工作台：

- 每次打开浏览器，触发一次“今天该看什么”
- 每个信源条目，都能被转成选题、摘要、竞品分析或文章大纲
- 每天产生可沉淀的内容资产，而不是只完成资讯消费

一句话定位：

> 把海外 AI/产品/技术信源变成每天自动触发的内容生产入口。

## 2. 用户画像

核心用户就是当前阶段的你：

- 金融科技背景，正在切入 AI 产品经理 / AI 产品实习 / 产品运营 / 竞品分析
- 每天需要看 AI 工具、开源项目、论文、Product Hunt、HN、Newsletter、X、播客
- 不缺信息源，缺的是持续触发、低摩擦整理、自动转化
- 想把信源变成选题、文章、竞品拆解和商业机会

后续可扩展到：

- AI 内容创作者
- 独立开发者
- 产品经理
- 投研/VC实习生
- 技术型自媒体

## 3. 核心问题

现在的问题不是“没有信息”，而是：

1. 信息源分散：Product Hunt、HN、HF Papers、Newsletter、GitHub、播客都在不同地方。
2. 触发太弱：收藏了很多入口，但每天不一定打开。
3. 行动链太长：看到一个好项目后，还要复制链接、总结、提炼观点、写标题、存笔记。
4. 沉淀不稳定：很多内容只停留在“看过”，没有进入 Obsidian、博客后台或选题池。
5. 噪音太多：Product Hunt 和 AI Newsletter 里有大量营销内容，需要筛选。

行为学上的关键判断：

> 想让一个动作更容易被执行，就要提高触发频率，并降低下一步动作成本。

所以新标签页是天然入口。用户每天会打开很多次浏览器，新标签页插件可以把“看信源”变成默认行为。

## 4. 产品原则

1. 先触发，再智能
   第一版不追求全自动 AI，而是先让信源每天出现在你眼前。

2. 先自用，再商业化
   不先做 SaaS，不先做登录、团队、多租户。先让自己连续用 30 天。

3. 先高质量 P0，再长尾聚合
   MVP 只放 10-15 个最高质量信源，避免变成另一个噪音流。

4. 每个信息条目必须可行动
   每张卡片至少有：收藏、生成选题、复制 Prompt、打开原文。

5. 本地优先
   v0 使用 Chrome local storage，降低成本和权限风险。

## 5. MVP 范围

### v0.1 本地新标签页

目标：0 后端、0 AI API、0 现金成本，先跑通每日触发。

功能：

- 替换 Chrome 新标签页
- 今日任务清单
- P0 信源快捷入口
- 手动选题收集箱
- Prompt 快捷按钮
- 本地保存收藏和完成状态

不做：

- 登录
- 云同步
- 自动 AI 总结
- 复杂抓取
- 公开上架

### v0.2 自动抓取雷达

目标：把最容易自动化的信源接进来。

优先接入：

- Hacker News API
- Product Hunt API
- Hugging Face Daily Papers
- GitHub Trending
- RSS/Newsletter 公开源

功能：

- 今日 HN Top
- 今日 Product Hunt AI/DevTools 产品
- 今日 HF Papers
- 每条内容可收藏/忽略/标记已读
- 简单热度排序

### v0.3 AI 转化

目标：从“看信息”升级到“生成资产”。

功能：

- 一键总结网页
- 一键生成 5 个中文选题
- 一键生成公众号标题
- 一键生成产品拆解卡
- 一键导出 Markdown 到 Obsidian
- 可选：推送到乔木博客草稿箱

## 6. 信息架构

新标签页首页分为 5 个区域：

1. 顶部状态栏
   - 今日日期
   - 今日任务完成数
   - 今日收藏选题数
   - 搜索/Prompt 快捷输入框

2. 今日任务
   - 看 5 个 Product Hunt 产品
   - 看 5 条 HN
   - 看 3 篇 HF Papers
   - 收藏 3 个选题
   - 生成 1 个标题

3. 今日雷达
   - 产品
   - 技术
   - 论文
   - AI 快讯
   - 深度文章

4. 选题收集箱
   - 待写
   - 已总结
   - 已生成标题
   - 已导出

5. Prompt 工具栏
   - 产品拆解
   - 论文转选题
   - HN 评论提炼
   - 标题生成
   - 公众号大纲
   - 小红书卡片

## 7. 核心交互

### 7.1 每日打开浏览器

用户打开新标签页：

- 系统展示今日任务
- 自动加载缓存数据
- 如果缓存过期，后台刷新 HN / Product Hunt / HF Papers / RSS
- 用户点击卡片进入原文，或直接收藏成选题

### 7.2 看到一个好产品

用户在 Product Hunt 卡片上点击“拆解”：

- v0：复制产品拆解 Prompt 到剪贴板
- v1：保存标题、链接、描述、来源、标签
- v2：AI 自动生成产品定位、用户痛点、核心功能、商业化方式、中文选题

### 7.3 看到一篇论文

用户在 HF Papers 卡片上点击“转选题”：

- 提取论文标题、摘要、GitHub/arXiv链接
- 判断产品化方向
- 生成 3 个中文内容角度
- 保存到选题箱

### 7.4 浏览任意网页

用户点击插件图标或右键菜单：

- 保存当前 URL
- 抓取页面标题、description、选中文本
- v2 可调用 AI 总结
- 导出到 Obsidian Markdown

## 8. 数据模型

### Source

```json
{
  "id": "hacker-news",
  "name": "Hacker News",
  "category": "技术社区",
  "priority": "P0",
  "url": "https://news.ycombinator.com/",
  "fetchType": "api",
  "frequency": "daily",
  "enabled": true
}
```

### FeedItem

```json
{
  "id": "hn-123",
  "sourceId": "hacker-news",
  "title": "Show HN: ...",
  "url": "https://example.com",
  "summary": "",
  "score": 120,
  "comments": 35,
  "tags": ["AI", "devtools"],
  "status": "new",
  "createdAt": "2026-06-04T09:00:00+08:00"
}
```

### Idea

```json
{
  "id": "idea-001",
  "title": "为什么这个 AI 编程工具能在 HN 爆？",
  "sourceUrl": "https://example.com",
  "sourceName": "Hacker News",
  "angle": "产品拆解",
  "status": "待写",
  "notes": "",
  "createdAt": "2026-06-04T09:15:00+08:00"
}
```

## 9. 技术架构

### v0 架构

```text
Chrome Extension
├── manifest.json
├── newtab.html
├── src/
│   ├── NewTab.tsx
│   ├── sources.ts
│   ├── prompts.ts
│   └── storage.ts
└── chrome.storage.local
```

技术栈建议：

- Plasmo 或 Vite + React
- Manifest V3
- chrome_url_overrides.newtab
- chrome.storage.local
- Tailwind CSS

### v1 架构

```text
Chrome Extension
├── New Tab UI
├── Background Service Worker
│   ├── fetch HN API
│   ├── fetch Product Hunt API
│   ├── fetch RSS
│   └── cache FeedItem
├── Content Script
│   └── read current page title/metadata
└── Local Storage
```

### v2 架构

```text
Chrome Extension
├── New Tab UI
├── Background Worker
├── AI Service
│   ├── summarize
│   ├── generateTopics
│   ├── analyzeProduct
│   └── exportMarkdown
├── Obsidian Export
└── Optional Blog API
```

## 10. 排序与评分

MVP 可以先用简单规则：

```text
总分 = 来源权重 + 热度分 + 新鲜度分 + 关键词匹配分 - 噪音惩罚
```

示例：

- P0 来源：+30
- HN score > 100：+20
- Product Hunt votes > 100：+20
- 标题包含 AI / agent / coding / open source：+10
- 24 小时内：+10
- 标题明显营销：-15
- 已忽略同类主题：-10

用户每次收藏、忽略、导出，都可以反向影响关键词权重。

## 11. AI Prompt 模块

第一批 Prompt 不必直接调用 API，可以先做“复制到剪贴板”。

### 产品拆解 Prompt

输入：产品标题、描述、官网、Product Hunt评论。

输出：

- 一句话定位
- 目标用户
- 核心痛点
- 核心功能
- 冷启动方式
- 商业化方式
- 中国市场可复制点
- 3 个中文内容选题

### 论文转选题 Prompt

输入：论文标题、摘要、GitHub/arXiv链接。

输出：

- 这篇论文解决什么问题
- 可能影响哪些产品
- 普通用户能不能感知
- 产品经理应该关注什么
- 3 个公众号标题

### HN 评论提炼 Prompt

输入：HN标题、正文链接、Top comments。

输出：

- 工程师支持的观点
- 工程师反对的观点
- 真实痛点
- 争议点
- 可写选题

## 12. 开源方案借鉴

最值得参考的不是一个，而是四类拼起来：

1. 新标签页形态：daily.dev、Hackertab
2. RSS/网页嗅探：RSSHub、RSSHub Radar
3. AI聚合/摘要：TrendRadar、RSSbrew、newscope
4. 写作发布后台：乔木博客 qiaomu-blog-opensource

建议不要直接二开 daily.dev 这种大项目，太重。更适合：

- 自己写 Chrome 插件前端
- 参考 Hackertab 的信息流结构
- 用 HN API / Product Hunt API / RSS 做数据层
- 参考 RSSHub Radar 做“当前网页嗅探”
- 后期参考乔木博客做“草稿发布”

## 13. 成本估算

### v0 本地自用

- 现金成本：0 元
- 时间成本：1-2 天
- 技术成本：低

### v1 自动抓取

- 现金成本：0-50 元/月
- 时间成本：3-7 天
- 技术成本：中

### v2 AI总结

- 现金成本：20-200 元/月
- 时间成本：1-3 周
- 技术成本：中高

## 14. 成功指标

先不看商业指标，看自用指标：

- 连续使用天数：是否连续用 30 天
- 每日打开次数：新标签页触发是否成立
- 每日收藏选题数：目标 >= 3
- 每周成文数：目标 >= 1
- 从看到信源到生成选题的时间：目标 < 30 秒
- 从选题到 Markdown 草稿的时间：目标 < 5 分钟

## 15. 迭代路线

### 第 1 周：v0

- 新标签页首页
- 今日任务
- P0 信源入口
- 选题收集箱
- Prompt 快捷复制

### 第 2 周：v1

- 接 HN API
- 接 Product Hunt API
- 接 Hugging Face Daily Papers
- 本地缓存
- 收藏/忽略/已读状态

### 第 3-4 周：v2

- AI总结
- 产品拆解
- 论文转选题
- 导出 Obsidian Markdown
- 乔木博客草稿箱适配

## 16. 最小开发任务清单

1. 初始化 Chrome Extension 项目
2. 实现 `chrome_url_overrides.newtab`
3. 设计首页布局
4. 写死第一批 P0 信源
5. 实现今日任务勾选
6. 实现选题收藏箱
7. 实现 Prompt 复制按钮
8. 接入 HN API
9. 接入 Product Hunt API
10. 接入 Hugging Face Papers
11. 实现 Markdown 导出
12. 接入 AI 总结

## 17. 最终判断

这个产品能做，而且最适合从自用插件开始。

它的本质价值不是“聚合信息”，而是把信息流变成行动流：

```text
信源 -> 触发 -> 筛选 -> 选题 -> 总结 -> 草稿 -> 发布
```

真正的产品 Sense 在这里：

> 不让用户想起来才打开工具，而是在用户每天一定会打开的地方，放一个能立刻进入工作的入口。

