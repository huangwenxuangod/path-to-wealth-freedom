---
title: 文轩
source: huangwenxuangod.xyz
author:
published:
created: 2026-06-15
description: 记录思考，分享所学，留住当下。
tags:
  - AI实战
---

# Loop engineering 这个事，我真没觉得它是未来

前几天我打开了 ChatGPT 的 `/goal` 命令，把一个我想搞的小工具的 PRD 塞进去，按"开始跑，不要停"那个按钮。

跑了 47 分钟，烧了我大概 8 美元，产出的东西 70% 都是垃圾。

剩下的 30% 我手动再改一遍，改的时间比我自己写还长。

我当时就愣住了。

不是"AI 还不够好"那种愣——是"为什么我跟着硅谷头部 KOL 抄作业，结果抄出这个？"

---

## 一、agent loop 是个啥

在说我的踩坑之前，先把这个事说清楚。

之前我看了 Greg 在播客里给嘉宾画的一张图，特别直白：

> 第一种工作流：你 → 提示 AI → AI 给你结果 → 你审核 → 你再提示 AI → 循环
>
> 第二种工作流：你 → 给 AI 一个 PRD → AI 内部自己循环 → 给你最终结果

第一种叫 "human in the loop"，就是咱平时用的 ChatGPT、Cursor、Claude Code 这种。

第二种叫 "agentic loop"，你只启动一次，剩下的全是 agent 自己拍板、自己执行、自己验证。

翻译成人话就是：

> 传统用法：你雇一个实习生，你每 5 分钟就去看一眼他在干什么。
>
> Agent loop：你雇一个实习生，你告诉他"把活干完"，然后你回家睡觉。

第二种用法在 2025 年底之前基本做不到——让 AI 自主完成长任务这个能力是 2025 年下半年才真正起来的。

所以从 2025 年底开始，硅谷头部 KOL 集体切换到第二种用法，然后开始吹"未来已来"。

我不是说他们错了。

但我作为一个真的上手试过、烧了钱、产出了垃圾的中国 AI 实战家，我必须说：这个事没那么简单。

---

## 二、我自己的踩坑全过程

我把我的真实体验完整放出来。

那个 PRD 是个小工具——一个能把"Excel 列名"批量转成"JSON 字段名"的东西。我的 PRD 写了 1500 字，按理说不算短——Anthropic 官方推荐 PRD 越详细越好。

把 PRD 塞进 ChatGPT `/goal`，按"开始"。

47 分钟。

- 期间我不知道它在干啥，只能看到一个进度条在动
- 中间有几次它"完成"了，我点进去看，发现逻辑全是错的——它把"snake_case"理解成了"全部小写无下划线"
- 我只能手敲"不对，重新做"
- 重新做了两次，总共用 47 分钟

结果呢？

- 8 美元
- 产出了一个 70% 正确的工具
- 剩下 30% 我手动改
- 改的时间比我自己 30 分钟写一遍还多

更骚的是，我本来想文章发出来之前再补试一次 Claude Code 的 `/loop`，结果发现我订阅的 Max 100 计划在长任务上有 rate limit——具体表现为跑到一半它会主动停下来等你冷却。

哦对了，这件事本身就是个反方证据——如果 agent loop 真到了"能让你放手"的成熟度，为什么 Anthropic 自家的订阅都做不好"长任务不中断"？

---

## 三、最戏剧化的事：那些吹 agent loop 的 KOL，自己也在吐槽

我本来想找几个支持 agent loop 的"正方 KOL"反驳自己，结果翻完一圈发现：那些最该支持 agent loop 的人，自己也都在吐槽它。

### Addy Osmani 亲自推 loop engineering，自己列了三大反方风险

Addy Osmani 是 Google Cloud AI 总监，2026 年 6 月写了一篇博文《Loop Engineering》，基本上就是"我要给你讲怎么搞 agent loop"的教程。

但同一篇博文里，他自己列了三大反方风险：

> "Verification is still on you. A loop running unattended is also a loop making mistakes unattended."

> "The faster the loop ships code you did not write, the bigger the gap between what exists and what you actually get."

> "When the loop runs itself its very tempting to stop having an opinion and just take whatever it gives back."

还有一句更狠的：

> "If I weren't reviewing the code myself or if I relied entirely on automated loops to fix it my product's quality would suffer. I'd likely end up stuck in a downward spiral, continuously digging myself into a deeper hole."

这哥们本应该是"loop engineering 头号 KOL"，结果自己写了"loop 会让你掉坑"。

这种自相矛盾的证据，比任何反方博主都有说服力。

### Anthropic 自己也"反 agentic"

这是让我最意外的一条。

Anthropic —— 也就是 Claude 的爹地 —— 在 2024 年 12 月发了一篇工程博客，标题是《Building Effective Agents》，但里面明确告诉你：

> "When building applications with LLMs, we recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all."

> "The autonomous nature of agents means higher costs, and the potential for compounding errors."

这是 2024 年底的 Anthropic 官方立场。

你再看看 2025-2026 年 Anthropic 推 /goal、推 /loop、推 harness engineering 的样子。

——Anthropic 自己都在转变。

这说明什么？说明即使是做出最强模型的 Anthropic，他们自己也知道 agentic loop 不是"普适解"——它在某些场景下有用，在另一些场景下是大坑。

### Peter Steinberger 的 1.3M 美元账单

这个数字你肯定见过：Peter Steinberger 一个月烧 130 万美元跑 agent loop。

很多 KOL 引用这个数字来证明"agent loop 经济上可行"。

但他们不引用 Peter 自己说的另一句话：

> "我关掉 Fast Mode 的话，成本能直接降 70%，算下来也就差不多一个普通员工的成本。"

他在承认：130 万美元里有 70% 是他自己的"加速选项"花的钱。

如果没有那个 70% 的"加速选项"，他的 agent loop 成本就和雇一个普通员工差不多。

但问题是：雇一个普通员工，你不用担心他会"做错假设"——你担心的只是工作量。而 agent loop，你得一直担心它会把你的项目搞坏。

成本相当，风险完全不同。

---

## 四、是不是 agent loop 一点用都没有？

不是。

我作为一个 AI 实战家，得告诉你：agent loop 在某些场景下，是真的好用的。

我自己就有一个跑得很顺的 loop。

我有个 GitHub repo，每次 push 代码都会自动触发 CodeRabbit review。这是个"score-based loop"——它给代码打分，我设个阈值（比如 4 分以下必须改），不达到 5 分不 merge。

为什么这个 loop 跑得顺？

因为目标可量化——分数就是分数，3 分就是 3 分。这个 feedback loop 是封闭的、可验证的、不依赖我"主观判断"。

我那个失败的 /goal 案例为什么失败？因为"做出一个能用的工具"这个目标不是可量化的。什么叫"能用"？什么叫"对"？我自己都说不清楚我具体要啥，AI 怎么知道我想要啥？

代码审查 loop 跑得顺，是因为反馈是数字。Excel 转 JSON 工具跑偏，是因为反馈是"我感觉不对"。

这一对比我想到了个事——我之前看过 Anthropic 的一篇工程博客，里面有一段话特别颠覆：

> "Separating the agent doing the work from the agent judging it proves to be a strong lever to address this issue… tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work."

翻译过来就是：把"做事的 agent"和"评判的 agent"分离开，让独立 evaluator 保持悲观，比让 generator 自我批评更可行。

我看到这段话的时候愣了一下——这不就是强化学习里的 actor-critic 架构吗？Actor（做事）+ Critic（评判），1990 年代 RL 圈就已经想明白的设计原则。

**让 AI "自己做事自己评分"，它会偏向乐观——这是常识。Anthropic 在 2026 年又踩了一遍。**

---

## 五、对普通人的真相

你问我 agent loop 是不是未来？

我没法回答。我只知道，它不是"现在"。

它有可能是"6 个月后的未来"，它也有可能是"永远差一口气的未来"。

但我可以告诉你两件事：

1. 作为一个普通人，别因为 KOL 吹就上车。先问自己 3 个问题——目标可量化吗？反馈可闭环吗？token 预算够吗？3 个问题至少 2 个"否"，就别碰 agent loop。
2. 如果你必须上车，别从 ChatGPT `/goal` 开始。用 Claude Code `/loop` 或 Cursor Background Agent。它们配套的 harness engineering 体系比 ChatGPT 完整。

为什么我说"别从 ChatGPT `/goal` 开始"？

因为我自己就是被它搞了 47 分钟、8 美元、70% 垃圾的。

后来呢？后来我没再用 /goal。我自己用 Claude Code 写了 25 分钟，全部自己写。中间遇到一个小问题我搜了下 Stack Overflow。

25 分钟。比 agent loop 的 47 分钟 + 改 bug 还要快。

这让我开始怀疑：是不是大部分"普通开发者一天的工作"，agent loop 反而是负优化？

我去找了下数据。METR（一个独立的 AI 评估机构）在 2025 年 7 月做了一个随机对照试验，16 个资深开源开发者完成 246 个真实任务：

> 用 AI 工具的人实际完成时间慢 19%，但他们自己估计快 20%。

翻译一下：他们以为 AI 让自己快了 20%，实际慢 19%。

这个 39 个百分点的 gap，就是"未来已来"吹出来的数字 vs 真实生产环境的数字。

---

## 最后

写到最后想说一句可能得罪人的话。

现在推 agent loop 的人，90% 有利益相关。他们要么在做 agent loop 产品（Boris Cherny 是 Claude Code 之父），要么在用 agent loop 讲故事融资（Devin 估值 260 亿美元），要么在用 agent loop 给自己的产品导流（Cursor、Codex、Claude Code 都在推 loop）。

作为读者，你看到的"未来已来"是经过利益相关者过滤的。我作为一个既不是 KOL、也不是厂商、但自己烧过钱、踩过坑、产过垃圾的普通 AI 实战家，我觉得有义务把另一面说出来。

所以下次你再看到哪个 KOL 跟你说"agent loop 是未来"，先问一句：

你自己烧过多少钱？跑偏过几次？你的 token 预算是多少？

如果他答不上来，**那这就是在卖你焦虑**。

以上。

---

> / 作者：车干
> / 文中引用的所有数据都可以溯源，没溯源的我都明确标了存疑。这是我个人体验 + 公开信息的研究分析，不是投资建议。agent loop 是不是 hype，你自己上手试了才知道。
