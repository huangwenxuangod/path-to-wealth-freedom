# Source Router（wenxuan-skills）

这是一个面向 **Claude Code / OpenClaw 风格技能目录** 的多源搜索聚合技能。

和普通 web search 不同，它强调三层能力：

1. **问题到信息源的路由**
2. **多搜索服务的聚合与回退**
3. **针对 creator / 平台内容的结构化抓取输出**

也就是说，它既要回答：
- 这个问题应该去哪里找答案？

也要回答：
- 用哪个搜索服务去把这些信息尽量稳定搜出来？

还要回答：
- 如果用户要搜某个博主 / 账号 / 频道，我怎么把他的主要内容尽可能完整抓下来，并转成 AI 可以继续分析的 JSON？

## 第一版目标

### 信息源层
- 本地知识库 / 跨会话记忆
- GitHub
- Reddit
- 官方文档 / 权威 Web
- YouTube / B站 / X
- XHS / 抖音 / 微信生态（先做路由与骨架）

### 搜索服务层
按优先级聚合：
- Tavily
- Exa
- Brave Search
- 秘塔搜索
- SerpAPI
- Serper
- Bing Search
- Google CSE
- Firecrawl

### 输出层
- 统一 JSON schema
- 统一 `related_links`
- 可落盘 Markdown / JSON
- 后续可接 `Clippings/` 和飞书同步脚本

## 目录结构

```text
wenxuan-skills/
  source-router/
    SKILL.md
    .env.example
    scripts/
      search_aggregator.py
      providers.py
      config.py
      README.md
    references/
      routing-policy.md
      source-profiles.md
      integration-plan.md
    examples/
    tests/
    output/
```

## 与上一版的区别

上一版更像一套方法论文档；
这一版开始按真正 skill package 的方式组织：
- `SKILL.md` 作为入口
- `references/` 作为 supporting docs
- `scripts/` 作为可执行层
- `examples/` 和 `tests/` 作为验证层
- `output/` 用来沉淀结构化抓取结果

## 现在已经具备的能力

- provider 聚合与 fallback
- GitHub repo / issue / code 搜索
- GitHub 无 token 匿名 fallback
- task type / platform hint / creator hint 路由
- creator 内容抓取结果统一 schema
- `--save` 自动生成 JSON + Markdown 文件

## 设计原则

- 搜索服务 ≠ 最终答案来源
- 先判断问题类型，再决定去哪搜
- 再用聚合脚本选择具体搜索后端
- 搜索失败要自动回退
- 封闭平台要明确边界，不伪造完整覆盖
- 对 creator 内容要尽可能返回：链接、正文摘要、转录、评论、统计、元数据

## 后续增强

- 真正的平台 adapter：YouTube / Reddit / X / B站
- TikHub 平台族接入（XHS / 抖音 / B站 / 微信）
- browser automation / OpenClaw / browser-use 登录态抓取
- 结果去重与 rerank 强化
- 与 `Clippings/`、飞书知识库、多维表格自动对接
