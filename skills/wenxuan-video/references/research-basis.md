# 研究依据与工作流推导（2026-10-05核查）

这些资料支持设计方法，不证明使用某工具必然获得高播放量或学习效果。

## 分镜 → 动态分镜

Toon Boom官方说明：静态分镜之后，为画板和场景安排时长，将镜头、图层与声音放入时间线预演。由此采用“先纸面完整分镜，再低成本Animatic验证”的流程；不是直接从分镜跳高清制作。

- [Animatic工作流](https://docs.toonboom.com/help/storyboard-pro-20/storyboard/getting-started/animatic.html?Highlight=animatic)
- [分镜时长与节奏](https://docs.toonboom.com/help/storyboard-pro-25/storyboard/timing/about-timing.html)

此轮官方搜索索引返回了上述页面正文；直接打开页面发生404，因此只把搜索索引中可确认的内容用于方法，不声称工具版本现场可运行。

## 镜头和物体是不同层

Adobe Animate官方相机说明支持对画面取景做平移、缩放与旋转，屏幕固定元素可以与相机内容分离。由此在镜头表中把相机运动与物体运动分栏，字幕等HUD放屏幕层；这不要求安装Adobe。

- [Camera in Animate](https://helpx.adobe.com/animate/desktop/multimedia-and-video/working-with-camera-in-animate.html)

## 解释优先于装饰

Mayer与Fiorella在多媒体学习研究综述中讨论减少无关内容、提示关键信息、相应图文邻近以及动画与解说在时间上的对应。由此要求主动作/关键变量/旁白落点对应，装饰音效和无关特效保持少量。

这是把教育研究转为本Skill设计检查的推导，并非所有短视频观众的普遍法则。字幕也承担无声观看与可访问性功能，不把冗余原则机械解释为删除字幕；避免的是满屏长段文字同时与人声和复杂图表争夺注意力。

- [Cambridge研究综述](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E)

## 设计到实现

Remotion官方要求动画由帧号驱动，提供插值/弹簧等方式。导演方案中的起止时刻和节奏必须映射到帧，不让CSS/实时循环自己计时。

- [Animating properties](https://www.remotion.dev/docs/animating-properties)

阶段顺序、轻量表格、默认先给分镜供用户审阅，是结合这些资料与用户明确要求形成的制作约定，不冒充研究原文中的标准格式。
