# Remotion Studio：生态调研与实施方案

调研日期：2026-09-15。本方案已获批准并实施；以下保留实施前研究快照（包括当时插件未安装等状态），当前结果见 ../README.md 与 ../VERIFICATION.txt。

## 1. 结论

**Bun + TypeScript + React + Magic UI + Tailwind CSS 完全可以作为这套系统的基础，但必须加入 Remotion 统一视频时间；GSAP 使用官方 `@remotion/gsap` 接入。**

推荐建立一个长期维护的 Remotion Studio：输入稿件、真实素材与视觉参考，输出可编辑的 React 镜头、参数化视频、透明叠加素材和渲染证据。质量来自分镜、排版、动作编排和验收，不来自同时安装多少动画库。

此次查到两项会实质改变原方案的官方能力：

1. **Remotion 已有官方 Codex 插件。** 当前本机 marketplace 已列出 `remotion@openai-api-curated`，状态为 `not installed`。因此基础能力直接使用官方插件；自己的插件只沉淀设计方法与本项目工作流。[S01][S02]
2. **Remotion 已有 `@remotion/gsap`。** 从 4.0.517 提供，当前 npm 查询到 4.0.524。官方 `useGsapTimeline()` 将 GSAP 时间轴绑定到 Remotion 帧；初版不再自写 GSAP seek hook。[S05][S06]

推荐顺序：官方能力 → 现有组件源码 → 必要的逐帧移植 → 自己独有的镜头语言。最小可用版本只交付两种 Composition，而不是先做六套模板、几十个组件。

## 2. 已读材料与当前工作区

用户粘贴材料已全文读取。其核心主张是：组件 → 镜头 → Composition 分层、JSON/props 复用、移植真实 React 组件、视频时间确定、支持 MP4 与透明素材。这些保留。

当前目录已经有 `agent-ui-film`，package.json 使用 HyperFrames 0.8.40。新项目与它平级，旧工程不迁移、不覆盖。工作区还存在用户未提交修改；此次只新增本目录的调研文档。

已有 `agent-ui-film/DESIGN.md` 定义：深色编辑式信息图、纸张质感资料、荧光绿强调、真实 Logo、6 秒 1920×1080 样片。它明确不采用持续粒子、旋转轨道和发光背景。粘贴方案大量推荐这些效果，存在风格冲突。**解决方式：既有基准片沿用克制风格；新系统把粒子/轨道列为可选镜头能力，不设为默认视觉。**

历史制作经验提供“先完成小样片再扩工具”的工作原则；本轮工具版本、目录和插件状态均已重新核对。既往 HyperFrames 版本记忆不作为当前版本依据。

## 3. 对原文档的校正

| 原建议 | 判断 | 修订 |
|---|---|---|
| Remotion 更适合直接利用 React UI 生态 | 保留 | 优势主要在组件与数据模型，不代表所有效果上限都高于 HyperFrames |
| HyperFrames 主要做小动效 | 太窄 | 它也支持完整多镜头作品；此项目选 Remotion 是为了 React 复用，不是它只能做小素材 |
| Magic UI 放进去天然顺 | 结构上成立 | 样式和 JSX 好复用；Motion、CSS 时钟、测量与随机逻辑仍需处理 |
| 所有动画必须重写成 interpolate | 过于绝对 | 原生 interpolate/spring 是默认；官方 GSAP、Lottie、Rive、Three 等集成可用 |
| 所有 CSS 动画都不能用 | 需要区分 | 未同步的 CSS 动画不可依赖；官方文档说明暂停动画并用负 delay 同步的方式，初版仍选更易验证的帧计算 |
| Remotion 本质只做 2D | 不完整 | React DOM 是主要表达方式，官方提供 Three/Skia 等集成；不是三维能力限制 |
| 初版做 6 个 Composition + 15 个组件 | 过大 | 首版 2 个 Composition、6 个核心视觉部件；第二次真实复用再抽象 |
| 用固定帧数作为 motion token | 30/60fps 会变速 | 作者层用秒或毫秒，统一按 fps 转帧；场景边界使用整数帧 |
| 720×1280 预览、1080×1920 输出 | 容易影响布局 | 同一逻辑画布保持不变，降低预览缩放或渲染 scale；横竖屏另做构图 |
| 每个品牌只换颜色即可 | 不足 | 色彩之外还要控制字体、材质、动作幅度和节奏；不保证任意稿件套同一布局都好看 |
| React Bits 可统一打包成自己的组件插件 | 需调整分发结构 | 当前许可证为 MIT + Commons Clause；成片使用与分发组件/移植版不同，插件默认只收原创与明确可分发内容 |
| 做自己的 Codex Remotion 插件 | 基础部分重复 | 官方插件已存在；只做薄的设计工作流扩展 |

## 4. 技术栈逐项判断

| 技术 | 职责 | 可行性与接法 | 初版决策 |
|---|---|---|---|
| Bun | 安装依赖、脚本、TS 运行 | Remotion 官方支持 `bun create video` 与 `remotionb` | 使用 |
| TypeScript | 组件、数据输入、校验 | TS 类型不替代 JSON 的运行时校验 | 使用 |
| React | 视频画面的声明式结构 | 每条视频是 Composition，镜头是 Sequence 中的组件 | 使用 |
| Remotion | 帧时钟、预览、合成与输出 | 统一媒体等待、fps、画布、帧序列 | 主引擎 |
| Tailwind v4 | 排版、间距、边框、颜色 | 官方 `@remotion/tailwind-v4`；不要混用 v3 插件 | 使用 |
| Magic UI | 视觉结构和效果源码 | 按组件移植，不加载整套库 | 首批选 Animated Beam、Border Beam 类效果 |
| GSAP | 多元素编排、stagger、路径描边、复杂缓动 | `@remotion/gsap`，只使用其支持的模式 | 使用核心时间轴 |
| Motion for React | 实时网页交互动画 | 官方 Remotion 文档仍写明无直接 Framer Motion 集成 | 成片内部默认移除自运行时钟；后续编辑器界面可用 |
| Aceternity UI | 聚光、层次、空间构图 | 保留视觉机制，替换交互与时间驱动 | 按镜头引入 |
| React Bits | 字效、背景、Shader 等视觉爆点 | 按组件审计 RAF/WebGL/物理依赖与许可 | 精选，不整包分发 |
| Motion Primitives | 文字、分组、过渡等简洁动画结构 | 是基于 Motion 的组件集，不是统一时间引擎 | 参考编排、按需移植 |
| shadcn/ui | 源码分发、基础控件 | 可协助获取 registry 组件；不必为成片安装整套表单控件 | 按需 |
| Zod | 运行时输入校验 | 验证文本长度、路径、时长、节点数量、主题枚举 | 使用一份 schema |
| Lucide | 通用语义图标 | 只导入使用的图标；品牌 Logo 用真实资产 | 使用 |

### Bun 到底是不是渲染引擎

不是。Bun 运行工具程序与安装包，React 画面通常仍由浏览器渲染，编码有独立的媒体处理链路。Bun 启动快并不等于 4K 粒子视频快数倍。

官方文档明确区分 `remotionb`（Bun runtime）与 `remotion`（Node runtime）。`bunx remotion` 这个写法本身不能证明 CLI 正在用 Bun。[S03]

本机已核实 Bun 1.3.14、Node 26.5.0，ffmpeg/ffprobe 可找到。Bun 文档目前还列出来自 Bun 1.0.24 / Remotion 4.0.88 时期的 lazyComponent 和进程退出问题；这是文档保留的历史注记，不据此断言本机 Bun 1.3.14 必然有同样问题。首版采用静态 Composition import，并验证渲染进程退出。

默认 Bun 全流程。若有 Bun 专属失败，用本机 Node 跑同一入口做对照，不换依赖管理、不重写工程。这是同一项目运行命令切换，不引入第二套工程。

### 推荐版本候选

2026-09-15 npm 实时返回：Remotion 与 `@remotion/gsap` 4.0.524、React 19.3.0、Tailwind 4.3.3、GSAP 3.15.0、TypeScript 7.0.2。它们是**已查到的版本，尚非安装联测通过的组合**。

实施时所有 `remotion` / `@remotion/*` 锁同一精确版本 4.0.524；React 与 react-dom 锁同版，提交 Bun lockfile。优先遵循该版官方模板实际声明的 TypeScript、React 类型包与配套工具版本，不能因为 npm latest 新就擅自升级模板所有工具。新增服务为零。

## 5. GSAP：可以获得哪些效果，哪些暂不成立

官方 hook 适合：时间轴标签、串并行、stagger、有限 repeat/yoyo、DOM/SVG 的透明度/缩放/位移/旋转，以及 SVG 描边和渐变属性变化。复杂场景由 Remotion 切分镜头，每个镜头内部由一条有边界的 GSAP 时间轴编排。[S05][S06]

**官方当前明确写着“不支持 GSAP plugins”。** 因此不能承诺安装 `@remotion/gsap` 后 SplitText、MorphSVG、MotionPath、Flip 全部直接可用。

| 需求 | 首选实现 | 当前决策 |
|---|---|---|
| 资料卡错落入场 | GSAP core stagger / fromTo | 首版支持 |
| 光束沿线流动 | SVG 路径 + 逐帧 gradient/dashoffset | 首版支持 |
| 边框扫光 | SVG 矩形路径或受控渐变 | 首版支持 |
| 镜头推进/退后 | 一层相机容器，受控 transform | 首版支持 |
| 单字/分词揭示 | React 分割文本 + 逐帧 opacity/clip | 不依赖 SplitText |
| 任意 SVG morph | 先核对 `@remotion/paths` 等路径方案，复杂素材可离线烘焙 | 不承诺 GSAP 插件直通 |
| 沿任意路径运动 | 已知几何函数/路径采样，按帧求坐标 | 不依赖 MotionPathPlugin |
| 滚动驱动演示 | 将“滚动量”写成时间函数 | 不在成片里监听真实滚轮 |
| 鼠标/拖拽演示 | 光标坐标与状态写入时间轴 | 不用真实交互作为渲染输入 |
| 物理粒子聚字 | 有种子、可随机寻址的算法，或预先烘焙 | 后续单独验收 |

官方 builder 还禁止 playback/seek、回调（onUpdate/onComplete 等）、异步 builder、普通对象 tween、未播种的 GSAP random 和游离 gsap.to。动画必须挂在 hook 的 timeline 上。数字状态用帧计算；字体和素材在开始构建前完成加载。

同一个元素的同一个属性只由一个系统写入：例如 React 控制文字内容，GSAP 控制其外层容器位移。不要让 React inline transform 与 GSAP x/scale 争夺同一节点。

官方实现为确定性会在每帧从时间零向前求值；几百个 tween 的大时间轴有每帧成本。先按镜头切开，用纯数值方式画大量粒子，而不是给每颗粒子建多条 tween。

## 6. Motion UI 必须分清三件事

1. **Motion / Framer Motion**：React、JS、Vue 动画库，常见入口是 `motion/react`。它擅长手势、layout、presence、实时交互。Magic UI 等经常依赖它。[S13]
2. **Foundation Motion UI**：另一套 Sass transitions/animations 库，服务 Foundation 生态。它不是 Motion 的别名；本项目不引入 Sass 动画体系来重复已有能力。[S14]
3. **Motion UI 作为设计术语**：界面中的动作语言，如强调、状态反馈、方向引导。这些原则需要，而且比包名更重要。

Motion 官方还提供 AI Kit：文档检索与最佳实践有免费部分，Motion+ 提供额外工具与素材能力；Codex 有对应安装路径。它提供知识/工具，并不自动解决 Remotion 逐帧同步。[S22]

如果未来新增真正的交互编辑器，编辑器按钮/拖拽面板可以用 Motion；视频预览里的 Composition 仍必须由 Remotion 控制时间。先用现成 Studio，不提前建设编辑器。

## 7. 组件生态：怎么取长处

| 来源 | 最值得吸收 | 迁移难度 | 本项目采用方式 |
|---|---|---|---|
| Magic UI | Animated Beam、Border Beam、数字滚动、网格、设备框 | 中 | 最优先的源码来源，按需保留视觉并重写时钟 |
| Aceternity | Spotlight、Tracing Beam、卡片层次、深度构图 | 中至高 | 鼠标位置/滚动输入变为明确时间函数，少量使用 |
| React Bits | BlurText、SplitText 类视觉、Noise、Threads、特殊背景 | 低至高，取决于组件 | 选择 TS + Tailwind 版本；依赖与随机性逐项审计 |
| Motion Primitives | TextEffect、AnimatedGroup、简洁过渡思路 | 中 | 借鉴节奏和参数接口，移除浏览器时钟 |
| shadcn/ui | 静态控件外观、registry 分发机制 | 低 | 产品截图式画面需要什么取什么 |
| Animate UI / 21st.dev 目录 | 更多交互风格及构图候选 | 组件不同 | 作为发现入口，不视为全部经过逐帧验证 |
| Lottie | 设计师制作的图标、Logo、二维矢量动作 | 集成低，素材质量不定 | 用 `@remotion/lottie` 对接，检查 AE 效果支持范围 |
| Rive | 状态机动画、角色/图标资产 | 中 | 用官方集成，固定状态与时间输入 |
| Three / React Three Fiber | 真三维相机、材质、灯光、粒子 | 高 | 有明确三维镜头再用 `@remotion/three` |
| Shader / WebGL | 流体、扭曲、噪声、辉光 | 高 | 时间 uniform 来自 frame/fps；跨 GPU 不预设像素完全一致 |

Lottie/Rive/Three 作为后续能力已在 Remotion 官方集成索引中确认；不是首版已安装或已渲染验证的内容。[S07]

### Magic UI 的真实源码验证

已读取官方 Animated Beam 源码：它 import `motion/react`，使用 `motion.linearGradient`，默认 `repeat = Infinity`，通过 DOM `getBoundingClientRect()` 和 `ResizeObserver` 确定连线位置。[S10]

直接拷贝虽然能在浏览器播放，但默认梯度使用网页时间；而组件只观察容器尺寸变化，不保证每次节点 transform 都触发重算，镜头内移动卡片时可能出现光束端点脱离。

首版保留 SVG 路径、底轨、透明渐变与视觉属性；节点中心和连线路径由同一布局函数算出，渐变位置由 frame 计算。固定画布场景不需要 observer。若后续确需 DOM 测量，加载字体后测量并建立 render 等待，禁止依赖“浏览器刚好来得及”。

不要把流动 Beam 简化成只有描线的 `strokeDashoffset` 后宣称视觉等价。描线、沿线光脉冲、边框扫光是三种效果，应分别验收。

### 所有组件的迁移检查

| 网页机制 | 视频里改成 |
|---|---|
| requestAnimationFrame / elapsed / Date.now | frame/fps |
| Math.random | 有稳定 seed 的 Remotion random 或静态生成值 |
| setTimeout / setInterval | 场景帧范围与明确时间段 |
| animate-* / transition-* | 帧驱动 style 或已验证同步方案 |
| hover / scroll / pointer | 参数化演示状态与坐标轨迹 |
| 外网字体与图片 | 合法本地资产、明确加载等待与失败处理 |
| 增量物理模拟 | 预计算轨迹或从初始条件可复现求值 |
| 动态 Tailwind 字符串 | 枚举完整 class 或 CSS 变量，避免构建时丢类 |

## 8. Skill 与设计方法调研

本轮用官方文档、维护者仓库与 UI Skills 的 Motion 分类交叉检索，覆盖主流方向。公开市场不断新增、改名和镜像，以下是有来源的生态地图，不把目录检索宣称为“全球所有 skill 全部实测”。更长的发现清单附在来源文档，目录级条目与源码级条目分别标记。

| Skill / 体系 | 已核对来源与能力 | 建议 |
|---|---|---|
| Remotion 官方 skills | 官方列出 12 个：best-practices、create、markup、studio、render、maps、captions、saas、interactivity、docs、upgrade、multimedia | 主工程知识源；按任务读取，不一次加载全部 |
| Remotion 官方 Codex plugin | 官方安装文档和本机 marketplace 均已核实 | 直接采用，不复刻 |
| GSAP 官方 skills | 8 个：core、timeline、scrolltrigger、plugins、utils、react、performance、frameworks | 选 core/timeline/performance；Remotion 成片遵循更窄的官方 hook 约束 |
| Magic UI 官方 skill | 官方 repo `skills/magic-ui/SKILL.md`，包含 registry 获取和组件选择 | 作为视觉源码检索入口；网页动画默认规则不直接用于视频 |
| Magic UI 官方 MCP | 官方文档确认可获取组件上下文 | 可选；首版读取源码已够用，不增加常驻服务 |
| LottieFiles motion-design | 已读核心文件，包含情绪目标、动作人格、编排、Disney 原则、时间/缓动表 | 最值得吸收的引擎无关动作方法 |
| Anthropic frontend-design | 已读官方 skill；视觉方向、排版、构图与避免默认化 | 作为视觉批评参考，不叠加成第二套硬规则 |
| Waza design | 本机已读；参考分解、实际截图校验、设计文档与审美复盘 | 主视觉审查方法，适配固定画布而非机械执行网页断点 |
| Impeccable | 已读维护者 README；审美诊断、critique、polish、animate 等，当前包含引擎和 hooks | 参考其审查词汇；初版不另装自动 hooks，避免与现有流程重复 |
| UI UX Pro Max | 已读维护者 README；风格、字体、配色、组件/平台知识 | 作为候选检索，不用风格数据库替代导演判断 |
| Motion AI Kit | 已读官方 AI Kit/安装说明 | 后续网页交互工具链候选；不作为视频同步层 |
| Emil Kowalski animation 系列 | UI Skills 列表与作者 animations.dev 可达 | animate、review-animations、improve-animations、animation-vocabulary 等值得进一步按需读取；本轮未逐个安装 |
| UI Skills / ibelick | Motion 分类已读取，多作者 skill 汇总 | 发现入口；重点看 motion performance，不以目录收录替代作者真实性核对 |
| Raphael Salaja 系列 | 目录发现 Disney principles、spring/easing、morphing-icons、AnimatePresence 等 | 吸收动作原则，React presence 指南不直接进入成片运行时 |
| HyperFrames skills | 本机已有；旧项目有明确调用路径和检查规则 | 保留给旧作品与 HTML/GSAP 制作；不强制迁移全部素材 |
| Figma motion skills | 目录发现 use-motion、implement-motion、video-interaction-mapper 等 | 有 Figma 原稿/授权连接时才进入工作流 |
| React Bits Pro skill / 社区 skill | 检索发现官方 Pro 说明与社区源码检索方案 | 商业功能与社区条目分开，本轮不默认购买或安装 |

### 哪些设计思维真正提高成片质量

**先讲清“观众在这几秒理解什么”。** 每镜头写一句信息目标、一处视觉中心、一个主要变化。卡片的运动应表达资料进入系统、任务状态改变、结果被呈现，不为“看起来动了”而移动。

**先静态 style frame，再时间编排。** 冻结在最关键的一帧，确认中文排版、主次、留白、物体尺度、品牌识别。静帧混乱时加动效只会加重问题。

**功能动作与表现动作分开。** IBM Carbon 区分 productive 与 expressive motion：前者传达效率和状态，后者用于重要节点。该分类很适合此项目：常规资料变化克制，高潮只在信息汇聚或结果揭示处增强。[S23]

**借 Disney 的 staging、anticipation、follow-through、arcs、timing，不机械套橡皮弹跳。** UI 卡片与金属终端不必像玩具弹性体。资料先轻微回应、光束随后移动、目标最终确认，形成因果关系。

**Gestalt 分组与 object permanence。** 同一对象跨镜头尽量保持形状/色彩/空间逻辑；连线起点必须是资料卡而不是附近空气。接近、相似、连续性优先于花哨装饰。

**持续时间由阅读量和距离决定。** 页面按钮 100ms 反馈经验不能直接决定信息片字幕的阅读时间。中文标题和关键结果要有稳定停留。毫秒 token 是起点，不是质量保证。

**三层动作不是三层都必须动。** LottieFiles 的 primary/secondary/ambient 可用作分析模型；但本项目基准风格允许 ambient 完全静止。一个镜头最多一个主动作组，辅助动作让位。

**镜头语言与音效表达同一个事件。** 推近是关注改变，切换是信息段落改变，音效对应实际入场/确认/连接。无意义的每字“嗖”声不增加质感。首版静音验收，后续有配音再按语义对齐节奏。

### Skill 组合策略

默认只让三类知识进入一次创作：官方 Remotion 技术规则、一套视觉/动作设计方法、本项目规格。需要 GSAP 时再加载官方 core/timeline；需要组件时再检索对应库。

不把 Waza、Impeccable、UI UX Pro Max、frontend-design 的所有硬编码偏好拼成巨大提示词。它们可能在字体、布局、渐变、确认流程上相互矛盾。项目以当前用户参考和已确认 DESIGN 规则为准，其他资料只是证据和候选。

## 9. 架构与数据接口

```text
稿件 + 本地资产 + 视觉参考
            |
            v
   VideoSpec 校验 + 设计/分镜决策
            |
            v
Composition --> Scene --> 视觉组件 + tokens
     |                        |
     |                  Remotion 帧 / 官方 GSAP
     v
Remotion Studio / 本地 Renderer
     |
     v
MP4 / PNG 序列 / ProRes 4444 + 验收记录

Codex 官方插件与项目 skill 在上方协助创作，不进入成片运行依赖。
```

数据单向流动，无“渲染结果回写模型并自动重新发布”的循环。首次不设计数据库、队列、云服务、通用 scene DSL 或独立 Web 编辑器。

### VideoSpec v1

| 字段 | 约束 |
|---|---|
| schemaVersion | 固定 1 |
| template | agent-workflow 或 beam-overlay |
| title | 必填，按字素计数最多 24；视觉层最多两行 |
| subtitle | 可空，最多 48 字素，超过就明确报错 |
| logo | public 内相对资产路径，必须存在 |
| theme | 首版 editorial-lime；主题结构固定，第二个主题按真实作品增加 |
| format | landscape 或 portrait |
| fps | 30 或 60 |
| durationSeconds | 成片 8 秒、overlay 3 秒；首版固定，避免假通用 |
| seed | 必填稳定字符串，用于可复现的可选噪声等 |
| tools | 工作流 1–4 个节点，id 唯一、label 最多 8 字素、图标枚举 |
| outputBackground | opaque 或 transparent；透明输出不绘制背景层 |

普通旁白稿不是直接“丢进 JSON 自动保证好看”。Codex 先提炼镜头信息，选模板并校验数据；遇到超长文本或不适合当前模板的叙述，明确调整分镜，不缩成看不清的小字。

文字分割按 grapheme cluster 处理中文/emoji，不能用 JS split('') 拆坏代理对。内部 fps 运算统一，把相邻镜头区间按 [start, end) 管理，避免重复/缺失边界帧。

### 六个初版视觉部件

1. ToolCard：资料卡与标签，同一布局数据定义中心坐标。
2. AnimatedBeam：路径底轨与流动脉冲，移植真实 Magic UI 视觉。
3. BorderSweep：有限边框扫光，表达节点状态。
4. HighlightText：标题 marker/clip 揭示，保持中文完整。
5. AgentCore：Logo 与结果状态，默认不旋转轨道、不持续发光。
6. ScreenFrame：真实截图/Logo 的框架与裁剪，资产适配使用 contain/cover 的明确选择。

没有第二个使用点的容器先内联。CameraPush/Glow/Blur/Noise 不预先各拆一个文件。组件 → 镜头 → 视频是理解层级，不强迫每层都建立空目录和抽象。

## 10. 默认设计规范与基准片

沿用本地实物参考：背景 #090c0b，强调 #b5ff38，纸面/主文字 #f1f0e8，面板 #1c2220，辅助文字 #aab4ad。颜色是基准主题，不约束所有未来品牌主题。

字体使用有明确可用许可的本地中文字体资产；本机 PingFang 可以做当前机器预览，跨机交付不默认复制系统字体。正式可复现构建使用固定的 Noto Sans SC 字体文件，记录来源和许可证；数字可用已有合法 JetBrains Mono 资产。构建等待字体加载完毕。

横屏：1920×1080；竖屏：1080×1920；30fps 默认，60fps 参数保持秒级节奏。预览沿用相同逻辑画布，720 级轻量输出采用 2/3 scale，不能缩小 Composition 后继续使用原像素布局。

首版把当前 6 秒研究稿展开为 8 秒基准片，给中文结果留阅读时间。这是新样片设计，不覆盖旧片。

| 时间 | 信息与主要动作 | 验收点 |
|---|---|---|
| 0–1.4s | 四类资料错落建立 | 主次清晰，资料标签能读 |
| 1.4–2.4s | “全部了解”标记揭示 | 文字完整，重点单一 |
| 2.4–3.6s | 有序扫描并确认资料 | 扫光不盖住文字 |
| 3.6–5.2s | 四条 Beam 汇聚目标 | 起终点贴合，脉冲方向一致 |
| 5.2–6.1s | Agent 状态响应，轻微镜头重心转移 | 因果清晰，没有多处抢视线 |
| 6.1–8.0s | 产品与结论稳定停留 | 结果至少约 1.9 秒可读，结尾不误切 |

竖屏重新布置为“上方标题，中上资料，下方 Agent 与结论”，不是横屏整张缩进窄画布。平台 UI 遮挡区域有差异，首版使用上下各约 10% 的保守核心内容留白，并在人机预览时检查；不声称对所有平台都是永久安全区。

第二组数据换为中性“Agent Demo”、两个工具节点与更长中文标题。用于证明不改 JSX 能换数据且布局稳定，不对真实产品功能作未核实宣传。

## 11. 输出与确定性验收

| 输出 | 用途 | 规范 |
|---|---|---|
| MP4 | 发布与快速审片 | H.264、yuv420p、1080 画布、30fps 默认 |
| ProRes 4444 MOV | 剪辑软件叠加 | PNG 渲染中间帧、prores、4444、yuva444p10le |
| PNG 序列 | 最稳的透明母版/逐帧检查 | RGBA；帧号补零，与 fps 信息一起交付 |
| WebM alpha | 可选轻量透明预览 | VP8/VP9 + 正确 alpha 配置；不是剪映兼容承诺 |

官方建议编辑软件使用 ProRes；文档明确列出 Final Cut/Premiere/Resolve，不据此推断当前剪映一定完整支持。首版验收包括实际导入用户正在使用的剪辑版本，黑白/彩底各检查一次。若该版不支持目标容器，则以实测能导入的格式交付，PNG 序列保留作母版。[S08]

透明不等于删除 background 一行：检查祖先背景、噪声层、滤镜合成、预乘 alpha 边缘、辉光在浅底是否变灰。用黑底、白底、彩底对比，检测画面外区域的 alpha 真为 0。ProRes 像素格式可能由解码器显示为另一种有效 alpha 格式，验收看实际 alpha 通道而非仅比字符串。

### 必须通过的验证

- 类型检查、schema 输入检查、所有 Remotion 包版本一致。
- 正常输入：两组数据、1 节点与 4 节点、横竖屏。
- 错误输入：缺 Logo、路径越界、空标题、超长中文、重复节点 id、零或负时长、非法 fps。
- 资源错误：字体/图片失败要明确终止；不可无限等待或默默缺图。
- 时间边界：首帧、每个转场前后、最后一帧；30/60fps 动作的秒位置一致。
- 确定性：同机同浏览器同字体，先渲染 frame 120，再 0、239，再 120；比较解码像素哈希。再对比顺序与乱序抽帧。不要拿视频容器哈希代替像素检查。
- GSAP 子树卸载/重建、React 开发模式重复生命周期、props 改变后的 timeline 重建。
- 媒体：ffprobe 检查画布/fps/时长/编码；ffmpeg 全量解码，检查无坏帧。
- 视觉：每阶段关键帧 + 正常速度整片；标题、连接端点、层次、空白、节奏逐项记录。
- 透明：真实剪辑应用导入，并在深/浅底检查 alpha 和边缘。
- 性能：记录实际渲染秒数、峰值内存、并发设置；本轮不编造性能倍数。

建议实施后的固定命令接口如下（是验收合同，当前尚未创建这些 scripts）：

```bash
cd /Users/ai1/path-to-wealth-freedom/remotion-studio
bun install --frozen-lockfile
bun run typecheck
bun run check
bun run studio
bun run render:benchmark
bun run render:overlay
bun run verify
git diff --check
```

`check` 负责 schema、资产和定帧对照；`verify` 负责 ffprobe、全片解码、关键帧和透明数据。不要为了它们建立大型测试框架；一个小型 TS 检查入口加已有媒体 CLI 足够。

## 12. Codex 插件方案

### 首选官方插件

本机 `codex plugin list` 已发现官方条目，且 `codex plugin add --help` 已核对安装语法。实施时使用：

```bash
codex plugin add remotion@openai-api-curated
```

安装成功与当前任务已加载能力分开验证：插件状态必须 installed/enabled；重新加载后的任务能发现 Remotion skills，再运行 Studio 和实际渲染。不能仅看到目录就宣布插件可用。

### 自己只扩展设计与制作流程

一个项目局部 `ai-motion-director` skill 即可，包含：读稿提炼 → 参考分解 → style frame → 分镜 → 选现有组件 → 原型 → 渲染验收。引擎 API 仍引用官方文档。

首版把该 skill 与项目一起管理；有跨项目复用需求时，再按已读 Codex plugin-creator 规范打包为独立薄插件：`.codex-plugin/plugin.json` + `skills/ai-motion-director/SKILL.md` + 必要 references。不重写 Remotion CLI，不为调用 CLI 建 MCP server，不包入 node_modules、不捆成片大文件。

独立插件安装前运行官方本地 `validate_plugin.py` 与 skill `quick_validate.py`；通过后检查 Codex 实际发现能力。市场安装、共享、发布只在对应阶段明确执行，不把文档方案当作发布完成。

**Promote：**逐帧时间规则、先静帧后动作、同一属性单一写入者、视觉来源记录、媒体/透明验收、模板复用检查。

**Do not promote：**本机绝对路径、ERP 指令、已有片子的专属品牌配色、用户素材、账号、某一次失败日志、未经许可的第三方组件移植版。

### 可复用的制作提示词

```text
请在 Remotion Studio 中根据我提供的稿件与素材制作动画。
先读取项目设计规范、VideoSpec 约束和已有 Composition，优先复用。
先说明观众需要理解的一件事、核心视觉和镜头节奏，并给关键静帧。
技术使用 Bun、TypeScript、React、Tailwind 和 Remotion。
普通动画由 Remotion 帧驱动，复杂编排使用官方 @remotion/gsap 的支持子集。
引用 Magic UI 等组件时记录真实来源，保留视觉机制并核对时钟与授权。
每镜头只有一个主动作组，字幕有阅读停留，横竖屏分别构图。
完成后实际渲染，检查乱序帧一致性、全片解码、关键帧和透明背景。
交付源文件、输入数据、视频绝对路径及实测结果，分别说明完成的状态。
```

## 13. 交付分期与工作量

### 第一期：可生产的最小系统

预计 2–4 个工程工作日，属于规划估算，取决于视觉迭代与剪辑软件导入结果。首次工程预计约 15–20 个手写文件，超过 8 个；新增后台服务 0 个。

按顺序完成：官方 Bun/React/Remotion 工程 → Tailwind v4 → 一个 VideoSpec schema → 本地字体/资产 → 六个视觉部件 → AgentWorkflow/BeamOverlay → 两组数据与横竖屏 → 官方插件与项目 skill → 完整验收。

主要文件职责：package.json/bun.lock 管理依赖；remotion.config.ts 管理 bundler；src/index.ts 注册 Root；src/Root.tsx 注册两个 Composition；src/index.css + src/tokens.ts 管理样式；src/spec.ts 校验输入；src/AgentWorkflow.tsx 与 src/BeamOverlay.tsx 组织视频；src/components 下仅放实际复用部件；data 下放两组输入；scripts/check.ts 与 scripts/verify.ts 做小型检查；AGENTS.md 与 DESIGN.md 管理项目规则；项目 skill 编排工作流。

可独立交付结果：一条 8 秒基准成片、一份 3 秒透明 Beam、两组数据、多比例输出与真实验证记录。即使后续全部取消，它仍能继续生产这类作品。

### 第二期：用实际作品扩展镜头语言

触发条件：完成至少三条真实视频，出现清晰的重复镜头需求。每次增加一个可独立使用的 Composition，例如 ProductExplainer、Comparison 或 EndCard；按该片需求加入一项 React Bits/Aceternity 效果。

每个模板独立有输入样例、关键帧、输出成片和验收记录；不同时预建完整主题引擎、8 种字效、7 类背景和所有 Camera 组件。预计每个成熟模板 0.5–2 个工程工作日，复杂 shader 另计。

### 第三期：跨项目插件包与批量生产

触发条件：第二个项目确实需要相同工作流，或日常批量任务超出手工 CLI 能力。将原创 skill/规则按 Codex 规范打包，批量先串行读 JSON 文件列表，写每个输出的状态与日志。

只有实测吞吐不足才评估云渲染/队列。10 倍任务量首先增加渲染成本与媒体存储；不以增加大量本地并发解决内存不足。不要把“未来”当作首版堆服务的理由。

## 14. 费用、外部依赖、脆弱假设与退出方式

首版无生成式 API 的强依赖，不需要 OpenAI、TTS、音乐生成或云渲染 key。需要网络下载依赖、官方插件和合法字体；素材渲染前本地化。后续若选 Motion+、Figma 服务、付费组件、外部配音，分别列出账号和费用再进入对应独立需求。

Remotion 当前许可证允许个人、最多 3 员工的营利组织、非营利组织及非商业评估免费使用；其他主体需公司许可。公司规模目前未确认，这不阻碍技术评估，正式商业使用前由项目负责人确认适用条款。[S09]

Magic UI 已读取 MIT 许可。GSAP 对外说明当前免费含商业使用，但仍按其自身许可处理，不把“免费”写成 MIT。React Bits 当前许可证明确限制单独/捆绑/移植版组件的分发，插件不收其可复用源码。Aceternity 免费组件与 Pro/模板、其他付费素材逐件记录来源与条款；不以同一个包名覆盖所有产品许可。[S11][S12][S16]

**最脆弱假设：高质量网页效果能够低成本、原样转换为确定性视频。** 若它不成立，代价主要发生在复杂 WebGL/物理/布局动画。方案通过限制首批组件、采用官方 GSAP 子集、复杂效果先烘焙为素材来避免整套系统被一个组件卡住。

网络服务中断：已缓存的依赖、字体与本地资产继续可渲染；新组件检索失败不影响既有作品。渲染失败：写到独立输出路径，成功校验后再替换交付版本，不覆盖唯一成功成片。

回退：新项目与旧 HyperFrames 工程独立，不涉及数据库迁移。单个失败组件回到上一个可验证实现；Bun 专属异常切换 Node 命令对照；插件扩展可停用而继续运行 Remotion 项目。未来 Git 只提交本项目明确文件，提交/推送另按用户指令执行。

## 15. 本轮完成状态与实施门槛

已完成：用户材料全文分析、工作区只读核对、官方/维护者资料检索、版本与插件目录检查、Magic UI 代表组件源码检查、选型/设计/验收方案和新项目文档落盘。

未进行：安装 npm 包、安装 Remotion 插件、生成运行骨架、制作样片、媒体实测、Codex 扩展发布、Git 提交/推送。这些不能由文档查询结果替代。

用户选择了 waza-think，其原文要求：`No code, no scaffolding, no pseudo-code until the user approves.` 因此本轮新目录仅包含可审阅的方案文档；确认本方案后进入第一期实施。

推荐确认项只有一个：**使用官方 Remotion Codex 插件，以 Bun + TS + React + Tailwind v4 + 官方 GSAP 集成为基础，先完成 AgentWorkflow 与 BeamOverlay 两个 Composition。**
