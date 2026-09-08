---
title: "Codex + Hyperframes + HeyGen +声音克隆：全部开源❗如何零基础开始自媒体变现"
source: "https://x.com/Pluvio9yte/status/2081580929492131947?s=20"
author:
  - "[[@Pluvio9yte]]"
published: 2026-07-27
created: 2026-09-07
description: "过去一个月，我总共仅用不到10小时，在抖音涨粉2k并接到了第一个商单变现。这篇文章开源所有用到的知识，下一篇文章开源我的所有skill。🏆40,187雪踏乌云@Pluvio9yte·Jul 26Translated from ChineseShow originalThe Co..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HOM12OaawAArZss?format=jpg&name=large)

过去一个月，我总共仅用不到10小时，在抖音涨粉2k并接到了第一个商单变现。这篇文章开源所有用到的知识，下一篇文章开源我的所有skill。

> Jul 26
> 
> The Codex video workflow is basically running pretty smoothly now. Currently, it's still missing a Chinese sentence segmentation + statement organization skill, and a better hook skill (different types of videos need different types of hooks). Overall, there are still quite a

**核心就是 Codex + Hyperframes + HeyGen + Index TTS**

我们先不讨论为什么不用remotion，为什么不用minimax tts，我只能告诉你我对比过至少10种方案，上面的就是最佳组合，**我把能够抄作业的方案直接喂到你的嘴边。**

## 1\. Codex - 主控

Codex ,我把它当成视频制作端。Claude Code 负责创作侧（选题、洗稿、策划），Codex 负责生产侧（配音、渲染、字幕、质检、归档）。

为什么不全用 Claude Code 做？因为视频渲染是重 I/O 任务，经常需要长时间跑 FFmpeg、Node.js 渲染、ASR 调用。Codex Token便宜，调用组织迅速，量大管饱，**而且内置了生图功能。**

Claude Code 写完交接稿丢到待制作队列，Codex 取稿开工，做完归档，登记发布看板。我在中间只需要审一次稿。

![Image](https://pbs.twimg.com/media/HOK_NE3aEAAqTPM?format=jpg&name=large)

我的Codex工作台

## 2\. HyperFrames — 视频渲染框架

HyperFrames 是用 HTML + CSS + JS 写视频的框架。每一页就是一个 HTML 文件，用 data-\* 属性标记时间轴，框架负责把它渲染成 MP4。

我选它有三个原因：

**AI 能直接写**。HTML/CSS 是所有大模型最熟悉的输出格式，Codex 写一页 HyperFrames 比写 After Effects 脚本或剪映模板靠谱得多。我的大部分视频就是两三轮提示词出来的。

**改动成本低**。改文案就改 HTML 里的文字，改样式就改 CSS，改动画就改 GSAP timeline。不用重新导出工程文件、不用重新对时间轴。

**确定性渲染**。同一份代码渲染出来的视频逐帧一致，没有「这次渲染和上次不一样」的问题。这对做质检和版本管理很重要——我可以用 SHA-256 校验成片有没有变。

Remotion（React 写视频）也在我的技术栈里，但 HyperFrames 上手更快，Codex 写 HTML 比写 React 组件更稳定。两个我都用，按项目选。

![Image](https://pbs.twimg.com/media/HOLDlx4aIAAqnmg?format=jpg&name=large)

## 3\. HeyGen — 数字人

HeyGen 解决的问题是：我不想每条视频都真人出镜。

我用自己的照片和视频训练了一个 Digital Twin（黑 T 坐姿形象），HeyGen 根据我上传的音频生成对口型的数字人视频。默认圆形裁切放在视频左下角，像一个小窗口在讲话。

我选 HeyGen 是因为三件事都满足了。

**Digital Twin 效果够用**。训练完的数字人嘴型同步、表情自然度能过审。Avatar III 引擎大约 1 美元/分钟，一条 2 分钟的短视频数字人成本 2 美元。需要更高质量可以切 Avatar V，大约 4 美元/分钟，但大部分视频 III 就够了。

**减少出镜焦虑**。我录实操教程会真人出镜，但日常短视频用数字人就行。省下来的时间和精力用来打磨内容。

**CLI 可自动化**。HeyGen 有命令行工具，可以写进 Skill 里自动调用。认证走 OAuth 用网页套餐额度，不额外扣 API 钱包。

## 4\. IndexTTS2 — 本地声音克隆

所有视频的配音都跑 IndexTTS2，一个开源的本地 TTS 模型。

我录了一段自己说话的无损 WAV 作为声线参考（pluvio-indextts2-calm-v1），IndexTTS2 克隆这个声线来念稿。默认平静语气，FFmpeg atempo=1.12 提速到 1.12 倍保持音高。

我没用云端 TTS，原因很直接。

**零成本**。本地跑，不按字数或时长计费。一个月做几十条视频，配音成本是零。

**声线一致**。每次用同一个无损 WAV 参考，声音风格稳定。我的声线参考文件锁了 SHA-256，防止被意外覆盖导致声音漂移。

**隐私**。文稿不出本地机器。

MiniMax 我只在对外教程里用——教读者怎么接入 TTS 中转站。自己的视频成片从不走云端 TTS。

## 辅助技术栈

四个核心之外，还有几个关键的辅助选型。

![Image](https://pbs.twimg.com/media/HOK_c8Da8AAzIHS?format=png&name=large)

## 总投入账单

过去一个月的硬成本：

- **IndexTTS2**：免费（本地开源模型）
- **HeyGen Digital Twin**：Creator 套餐月费49刀（含一定生成额度）
- **火山 ASR**：¥0.40/小时，一个月总共花了不到 20 块
- **Codex**：OpenAI Pro 套餐
- **Claude Code**：Anthropic Max 套餐

大头是 Codex 和 Claude Code 的订阅费。如果你已经在为 AI 工具付费，增量成本很低——ASR 和生图加起来一个月不到 100 块。

HeyGen 是唯一按用量线性增长的开销。做得越多花得越多，但单条成本可控：2 分钟视频的数字人部分大约 2 美元（Avatar III），不用数字人就是零。

**如果你想吃上这口饭，你需要满足两个前提：**

1. **你有内容能力**。AI 做的是生产环节——配音、渲染、字幕、封面。选题判断、内容质量、平台感觉，这些 AI 帮不了你。你得知道什么值得做、做出来的东西观众想不想看。当然这个也很简单，抄！。
2. **你愿意花时间调 Skill**。这套系统不是装上就能用的 SaaS。每个 Skill 都是我根据自己的内容类型、平台策略和审美偏好一轮一轮调出来的。你拿去可以跑，但要做成你自己的风格，得改。

下一篇，开源所有 Skill 的源码和设计思路。目前已经开源了一部分了，地址见评论区。

同样，我和泊舟[@bozhou\_ai](https://x.com/@bozhou_ai) && Rachel [@Zesee](https://x.com/@Zesee) 也建立了一个AI自媒体自媒体交流群，**入群门槛99。**但这并不是要割韭菜，**我的全部心得，我打磨了几十个小时的Skill，都开源了，大家随便用，核心技术和知识都免费的。**

关于群聊，大家都知道：**免费群其实是最贵的，**各种各样的人、满天飞的广告，**会非常牵扯注意力。**所以**付费是最容易能够筛选出一个基础的交流环境的方式了**

如果你已经被知识付费割怕了、被割了太多遍，我能理解。但我不是来做你第 N 个付费群的。只是为了筛选出一个交流环境，我也不会保证交付什么，大家自由交流，互相学习，一起进步。

有意向的，直接加我助理的微信：**Lhr-Rison** ，**备注 AI自媒体。**(还希望开门见山，大家不要找他闲聊QAQ，他还是在读研究生，科研压力也山大)

![Image](https://pbs.twimg.com/media/HOM049yaAAA418B?format=jpg&name=large)