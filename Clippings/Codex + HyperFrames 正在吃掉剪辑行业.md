---
title: "Codex + HyperFrames 正在吃掉剪辑行业"
source: "https://x.com/Saccc_c/status/2051852464400261429"
author:
  - "[[@Saccc_c]]"
published: 2026-05-06
created: 2026-05-27
description: "以前做视频，需要找素材、学剪辑、配音乐，一套下来投入成本极高。现在有了 AI，只要用好 Codex + HyperFrames 这套组合，基础的剪辑和动画 1h 就搞定。本篇文章我将结合自己的实战经验，分享我用 Codex + HyperFrames 制作视频的核心技巧，助力每个..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HHi_hUTXMAEUaks?format=jpg&name=large)

以前做视频，需要找素材、学剪辑、配音乐，一套下来投入成本极高。

现在有了 AI，只要用好 Codex + HyperFrames 这套组合，基础的剪辑和动画 1h 就搞定。

本篇文章我将结合自己的实战经验，分享我用 Codex + HyperFrames 制作视频的核心技巧，助力每个有相关需求的自媒体人实现视频剪辑自由。

## 一、HyperFrames 是什么？为什么用它？

HyperFrames 是 [@HeyGen](https://x.com/@HeyGen) 开源的一个代码驱动的视频制作框架。有了它，你不用打开任何剪辑软件，直接写代码就能生成视频。

![Image](https://pbs.twimg.com/media/HHi_TOiW4Acc7N-?format=jpg&name=large)

为什么配合 Codex 特别合适？两个原因：

1、写代码是 AI Agent 最擅长的事，Codex 又是目前 T0 级别的超级工具。你只管描述想要的画面，代码的事交给它。

2、HyperFrames 直接用 HTML 编写，天然为 Agent 设计。AI 写 HTML 比写任何其他格式都顺，出错少，迭代快。

因此这套组合搭配起来就是为视频创作而生。你描述清楚想要的画面，Codex 负责写代码，HyperFrames 渲染成片。

## 二、如何在 Codex 里配置 HyperFrames

基础的安装和配置步骤如下：

**1、安装 Codex App**

下载地址：[https://chatgpt.com/codex/](https://chatgpt.com/codex/)

**2、安装 HyperFrames plugin**

进入 Codex App，左侧栏点击 Plugins。

![Image](https://pbs.twimg.com/media/HHi_uXoWAAA180y?format=jpg&name=large)

搜索 HyperFrames 并点击“+”号添加即可。

![Image](https://pbs.twimg.com/media/HHjAKVBXEAQYz9U?format=jpg&name=large)

现在，你就可以开始利用 HyperFrames 的相关功能在 Codex 里进行视频创作了。

## 三、实战技巧

配置完成后，具体实战该怎么用？分享三个视频制作技巧。

**1、提示词：描述清楚想要的画面，越具体越好**

一份好的提示词，核心就是把你脑里的详细画面翻译成文字。具体来说，写清楚以下内容：

- 动画类型/视频类型：功能演示、数据可视化、发布会预告、社媒短片等
- 时长和画幅：例如 10 秒、9:16 抖音画幅等
- 视频目标：一句话说明这个视频要讲什么、让观众理解什么
- 视觉风格：例如 Apple 风格、真实软件界面、极简科技感、电影感等
- 关键元素：必须出现的文字、图标、产品、数据、人物、素材路径等
- 动效要求：例如流式打字、淡入淡出、缩放转场、卡片展开、镜头推进等
- 声音要求：例如配乐、打字声、点击声、旁白、音效同步等

举个例子，这是我做一段苹果手机进化史视频开场时用的 prompt：

```plaintext
用 [@HyperFrames] 做一个能说明 "Codex 调用 HyperFrames 生成视频" 的开场动画，默认画幅，时间不超过 10s。 #动画类型 + 时长画幅
目标是展示"我在 Codex 里用 HyperFrames 生成视频"的过程。 #视频目标
画面从真实感的 Codex 深色聊天首页开始，中央是 "What should we work on?"，下方是大号输入框。输入框里从第一个字开始像真人打字一样流式输入： "帮我用 HyperFrames by HeyGen 做一个 iPhone 历代机型的展示动画" 其中 "HyperFrames by HeyGen" 要像插件 mention/chip 一样显示，带小图标，并和普通输入文字有明显区分。 #关键元素 + 动效要求
输入完成后点击发送，进入生成状态：画面中央出现 Codex 图标 × HyperFrames 图标，下方显示 "GENERATING ..."。这个阶段要有轻微的生成中动效，比如图标轻微呼吸、跳动或震动，点点闪烁，但整体要克制、有产品感。 #关键元素 + 动效要求
生成完成后回到 Codex 聊天界面，出现一个视频预览卡片。卡片封面是 Apple 风格的深色产品预览，中央有 Apple 标志和播放按钮。鼠标点击播放按钮后，视频卡片丝滑放大到全屏，像正式视频被打开一样，作为进入后续视频的转场。 #关键元素 + 动效要求
整体风格要拟真、克制、高级，接近真实 Codex 产品界面和 Apple 发布片里的软件操作镜头。界面切换用平滑的 fade in / fade out，所有动效都要清爽、利落、自然。 #视觉风格
请使用 HyperFrames 实现，并确保可以稳定 render 成 MP4。打字、点击和 generating 的声音要作为真实音轨接入，不能只用浏览器实时音效。 #声音要求
```

该 prompt 一次直出的动画效果长这样：

<video preload="none" tabindex="-1" playsinline="" aria-label="Embedded video" poster="https://pbs.twimg.com/amplify_video_thumb/2051613665040740353/img/XDAV_Xso9UyWlxDg.jpg" style="width: 100%; height: 100%; position: absolute; background-color: black; top: 0%; left: 0%; transform: rotate(0deg) scale(1.005);"><source type="video/mp4" src="blob:https://x.com/fce66b36-521b-4740-b219-d0d83cdaf034"></video>

![](https://pbs.twimg.com/amplify_video_thumb/2051613665040740353/img/XDAV_Xso9UyWlxDg.jpg?name=large)

当然，第一版大概率不会完美，我们直接告诉 Agent 哪里要改就行。

注意一次改动不要太多，改完及时预览，不满意再继续微调。

必要的时候直接截图，在图上标注出问题位置，比纯文字反馈高效得多。

**2、图片生成：用Image Gen skill 来生成关键素材**

做视频通常会花很多时间在准备视觉素材上——产品图、封面图、关键帧画面等。

Codex 内置了 GPT Image 2，可以直接在项目里生成你需要的素材，效果精美，风格可控。

触发方法：输入 [$image-gen](https://x.com/search?q=%24image-gen&src=cashtag_click)

例如：用 [$image-gen](https://x.com/search?q=%24image-gen&src=cashtag_click) 的gpt image 2 帮我分别生成一个 iPhone 初代的正面图和背面图，可以参考官方手机图片素材，尽可能模拟真实手机模样。注意图片最好是透明的，好随意融入任意背景。

![Image](https://pbs.twimg.com/media/HHjCqHmW0AEbabG?format=jpg&name=large)

**3、配乐生成：用 AI 直接生成背景音乐**

视频做完了，配乐方面如何解决？

推荐Suno（[suno.com](https://suno.com/)）这个 AI 配乐生成网站，每天有免费额度，一次生成还会提供 2 个不同的歌曲版本，整体生成质量不错。

![Image](https://pbs.twimg.com/media/HHjCzm_XcAI1v_y?format=jpg&name=large)

提示词建议写清楚想要的风格和情绪，比如"有节奏感、史诗感、不要人声"。

示例：

```plaintext
现代电影预告片风格，开头用清脆利落的打击乐（响指、拍掌），搭配简约钢琴旋律，逐步加入电子贝斯和层叠节奏。
副歌部分用合成器和弦层层推进，高潮段落加入完整管弦乐冲击和驱动感节奏。
整体质感高级、干净，类似苹果发布会的能量感，118 BPM，纯音乐无人声。
```

效果：

<video preload="none" tabindex="-1" playsinline="" aria-label="Embedded video" poster="https://pbs.twimg.com/amplify_video_thumb/2051612857519738889/img/VhmZWed-aIZObqWb.jpg" style="width: 100%; height: 100%; position: absolute; background-color: black; top: 0%; left: 0%; transform: rotate(0deg) scale(1.005);"><source type="video/mp4" src="blob:https://x.com/6408ba79-cec2-4f7d-9b42-bbf00b51ca36"></video>

![](https://pbs.twimg.com/amplify_video_thumb/2051612857519738889/img/VhmZWed-aIZObqWb.jpg?name=large)

下面是我用 Codex + HyperFrames 制作的苹果手机进化史完整视频，从素材、画面到配乐，1 小时搞定。

视频剪辑的门槛已经被 AI 大幅拉低，有想法的快去试试，用代码手搓视频真的很爽。

最后，也欢迎关注我 [@Saccc\_c](https://x.com/@Saccc_c)，我会持续分享 AI 干货和实战玩法。