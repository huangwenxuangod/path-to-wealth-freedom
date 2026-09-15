# Astra6 总分总动画：设计与实施计划

日期：2026-09-15。状态：用户已批准，首版已实现并渲染验收；实际结果见 README 与 evidence/astra/VERIFICATION.txt。本轮已安装并读取 Anthropic 官方 frontend-design skill。

## 1. 重新判断

目标是用一条完整短片解释 GPT-6 Astra 在真实工作中的三类优势，形成总述、分论、总结的结构。推荐 36 秒、1920×1080、30fps、中文无配音 motion graphics，完整字幕承担叙述，最后稳定停留 3 秒。选择三点而非堆砌全部性能，保证每点能被看见并理解。

用户最新要求优先于旧 DESIGN.md：黑底、荧光绿、大字是 AgentWorkflow 的具体视觉方案，不是全工程默认。Magic UI 成为受管理的组件源码依赖，并在实际镜头中使用。系统固定的是创作与验收方法，每条视频独立确定色彩、字体、布局、材质和动作。

推荐完整方案：四个真实 Magic UI 组件 + 五段叙事 + 官方素材 + 帧驱动改编。最小方案：保留相同文案与时间，用 Safari 和 Terminal 两个组件完成；但画面之间的因果连接和性能信息弱于推荐方案。本次选择完整方案。

## 2. 已核实事实与来源

- Astra6 官方页面已在浏览器实际打开，跳转至中文页面 https://openai.com/zh-Hans-CN/index/gpt-6-astra/ 。搜索/抓取接口未成功提取，浏览器正文读取成功。正式名称用 GPT-6 Astra。
- 官方“全球最佳计算机操作模型”章节明确列出表单、CRM、日历、在线调研、网站与前端 QA 等场景。
- 官方“编程”章节给出 Terminal-Bench 4.0：Astra 57.9%，GPT-5.6 Sol 37.3%。这些是该评估分数，不写成实际工作成功率或泛化的效率提升。
- 官方“专业工作的阶跃式变革”章节说明文档、表格、演示文稿、模板遵循与视觉判断。首版用这些已读正文支持三个论点，不使用“所有任务全球第一”。
- 正文说明评估使用最高推理强度，研究/API 环境可能与上线产品不同。片中若出现 57.9%/37.3%，同时显示基准名称、“OpenAI 公布评估”及简短设置说明；详细条件进入来源文档。
- Logo 来源入口：https://openai.com/brand/ 。OpenAI 企业标识与 GPT-6 Astra 模型名称分开展示，不把企业 Logo 称为模型专属 Logo。
- Magic UI 安装文档：https://magicui.design/docs/installation 。官方使用 shadcn registry 安装源码，如 @magicui/terminal，而非要求安装同名 magic-ui npm 包。
- 已下载并读过官方注册表：/r/safari.json、/r/terminal.json、/r/number-ticker.json、/r/animated-beam.json、/r/blur-fade.json。
- Safari 原版使用 img、autoplay video 和固定 SVG id；Terminal 包含 useInView、setTimeout、完成回调顺序状态；Number Ticker 使用 Motion spring 和 DOM textContent 更新；Animated Beam 使用 ResizeObserver/DOM 几何测量与 Motion 渐变时间。以上不能直接等价于 Remotion 的确定性动画。
- frontend-design 来源：https://github.com/anthropics/skills/tree/main/skills/frontend-design ，本机已安装 /Users/ai1/.codex/skills/frontend-design/SKILL.md；当前任务已读取，下轮可调用。

## 3. 视觉决策

受众：想理解新模型工作价值的中文科技内容观众。主观众问题：它能把哪类事情做得更完整？

参考分工：OpenAI 发布页用真实产物证明能力；Magic UI Safari 用熟悉的浏览器外壳表达软件操作；Magic UI Terminal 用逐行反馈表达执行与验证。借用其表达机制，画面由本片内容组织。

推荐视觉：冷白工作台、石墨文字、钴蓝操作轨迹。主记忆点是“同一个工作窗口变为三种产物，再合成成果”，不靠每页重复一个大标题和一排卡片。

| Token | 值 | 用途 |
|---|---|---|
| canvas | #F5F7FA | 主背景，冷白 |
| surface | #FFFFFF | 工作窗口与文档 |
| ink | #17243A | 主文字、终端底色 |
| muted | #526176 | 次级说明 |
| action | #2457E6 | 光标、选择、活动连接 |
| result | #087F70 | 验证结果 |

这些是本片创作色彩，不冒充 OpenAI 官方品牌色。Logo 使用官方许可版本，不重绘变形。

字体使用现有本地 Noto Sans SC，中文标题 88–112px，正文 40–48px，来源脚注 24px；JetBrains Mono 仅用于终端代码和需要比较的数字。标题不固定做彩色单词、不使用装饰性英文眉题。字幕在底部固定安全区域，主画面左右至少 112px、上下至少 80px。只保留实际步骤所需的顺序标记。

布局：开头居中任务纸；分述镜头采用左侧短论点、右侧大工作窗口；专业成果镜头换为全宽展开的文档；结尾回到居中成果。靠不同信息结构变化构图。

```text
总述        一项任务 → 三种工作能力
分述        左：短论点     右：软件 / 终端 / 成果
总结        软件 + 验证 + 文档 → 一份完成的工作
```

动画：窗口连续形变与局部聚焦，切换约 12–18 帧，主要内容稳定阅读至少 2 秒；数字变化不超过 0.8 秒，结束后保持。使用帧计算和官方 GSAP 编排；主题色不靠高强度发光呈现。不为凑组件数量加入粒子、无限滚动、随机闪烁。

## 4. 36 秒总分总分镜

| 时间 / 30fps 帧区间 | 结构 | 屏幕文案 | 画面动作与组件 |
|---|---|---|---|
| 0–6秒 / [0,180) | 总 | GPT-6 Astra：把任务推进到成果 | 官方 OpenAI 标识与模型名称进入；一个任务窗口展成软件、代码、文档三个预告视图，建立主问题 |
| 6–14秒 / [180,420) | 分：操作 | 直接在软件里推进任务。浏览、整理、检查，连成一个工作流。 | Safari 工作窗口放大；受控光标聚焦任务区域；Animated Beam 从任务指向操作结果。插入官方页面中对应示例静帧并明确注明官方示例 |
| 14–22秒 / [420,660) | 分：工程 | 从写代码，到运行和验证。 | Terminal 展示“读取项目、修改、运行检查”的场景化过程，标注流程示意；画面侧边 Number Ticker 呈现官方 Terminal-Bench 4.0 的 37.3% 与 57.9%，两根条形共用 0–100 刻度 |
| 22–30秒 / [660,900) | 分：交付 | 文档、表格、演示稿，更贴近工作要求。 | 由终端中的文件变成官方发布页专业成果示例，再抽出文档/表格/演示稿三种成果；保持真实素材的原始比例 |
| 30–36秒 / [900,1080) | 总 | 操作、验证、交付。让 AI 承接更完整的工作。 | 三段产物沿同一运动方向合拢为一份成果；Logo 与模型名收尾，最后 3 秒稳定。小字说明依据 OpenAI 公布材料，实际表现随任务与配置变化 |

总述先提出价值判断，分述用能力与证据展开，总结回答开头；不是五张互不关联的标题卡。无配音首版照样有完整语义；不引入 TTS 账号或付费素材依赖。

## 5. Magic UI 作为正式项目依赖

“依赖”分两类记录：官方组件源码作为 vendored 依赖进入仓库；组件导入的运行时包进入 package.json/bun.lock。不安装来源不明的同名 npm 包，也不只留链接不使用源码。

建立 components.json，Tailwind v4 使用现有 src/index.css，配置 @/* -> src/*、utils -> src/lib/utils.ts、ui -> src/components/magicui；添加 @magicui 注册表。shadcn CLI 作为锁定版本的开发依赖，Bun 为唯一包管理器。不重建 Next.js 项目。

正式导入 Safari、Terminal、Number Ticker、Animated Beam。根据已读源码，需要 Motion、clsx、tailwind-merge；即使 registry 的 dependencies 字段遗漏，实际 import 也必须通过类型与打包检查。新增包安装时固定解析版本并保留锁文件，现有 Remotion 包仍全部 4.0.524。

| 组件 | 成片用途 | 保留与改编 |
|---|---|---|
| Safari | 计算机操作主体、容纳官方示例 | 保留官方 SVG 外壳与几何；img 改 Remotion Img，媒体走 Remotion Video；SVG id 使用实例唯一 id，避免重叠转场串 mask |
| Terminal | 工程执行与验证镜头 | 保留结构、样式、行表达；原组件用于组件预览，视频版改为显式 frame/fps，移除入屏判断、timer、完成回调驱动 |
| Number Ticker | 显示有出处的评估结果 | 保留格式与排版；frame 驱动数值，保持一位小数，允许倒放和乱序寻帧 |
| Animated Beam | 操作与成果之间的因果传递 | 沿用现有确定性改编经验，新片颜色和端点由本片控制；保存官方原始来源与改编说明 |

原版源码放 src/components/magicui/；视频版薄改编放 src/components/video/，只在有时间或媒体冲突时产生视频版。不是在外面套一个 wrapper 就假设内部 Motion ticker 已被控制。原版可以用于未来交互界面，本片导出依赖图只导入确定性版本。

记录 docs/MAGIC_UI.md：每个组件的官方 URL、上游 revision/下载时间、原始 SHA256、许可、安装命令、依赖、改编点、在哪个镜头被使用。现有 AgentWorkflow 不迁移，以免本片改动影响已交付样片。

## 6. 素材与事实流程

每次创作先自行检索发布方官网、官方品牌页、官方演示、原始研究材料，再用社区资料补充背景。Logo 不用 AI 临摹，产品截图不由自造 UI 冒充。

素材清单包括：官方 OpenAI SVG/PNG 标识；官方计算机操作示例静帧；官方专业成果示例静帧。前两类示例从已读发布页取得，保留出处与图注。素材在实施阶段实际获取并检查清晰度、比例、许可；目前不能标记为已下载验收。

若品牌包下载失效，使用官方网页实际展示的品牌标识并按品牌指南处理；若示例素材无法获取或许可不明确，该镜头采用明确标注的原创“流程示意”，文档记录替代原因，不伪装官方演示。核心分镜不依赖远程视频下载成功。

public/astra6/ 保存成片用素材，渲染时全部本地读取；docs/ASTRA6_SOURCES.md 保存事实出处和短引文；public/astra6/assets.json 保存 sourceUrl、publisher、retrievedAt、localPath、sha256、licenseOrUsage、scene、kind，kind 区分官方素材与原创示意。

所有优势对应 sourceId。基准值只从已核实来源填入。失败来源、失效 URL、文件内容与扩展名不符、低清素材、缺少品牌来源都明确记录；禁止以“看起来像官方”作为通过条件。

## 7. 实现接口与文件边界

新建 AstraOverview Composition，专用输入 data/astra6.json 和 src/astra6/spec.ts，不把已有 8秒/3秒 schema 放宽成任意值。

新 schema 约束：template=astra-overview，fps=30或60，durationSeconds=36，format=landscape；包含 title、summary、logo、三条 advantages、sourceIds，优势 id 固定 computer-use/coding/artifacts；素材路径沿用现有 assetPath。中文按 grapheme 校验。timeline 固定 6/8/8/8/6 秒并由 fps 算帧；最后结束严格等于 fps×36。

src/astra6/ 内放主 Composition、三类分镜与开合共用镜头、专用 tokens；注册于 src/Root.tsx。多个视觉部件只接收单向 props：

```text
data/astra6.json + 本地 assets
              ↓ schema校验
         AstraOverview
              ↓ frame/fps/props
    开合镜头 / 软件镜头 / 工程镜头 / 成果镜头
              ↓
     Magic UI 确定性视频组件
```

新增 scripts/render-astra.ts，复用 scripts/render.ts 的 prepare()；输出 renders/astra6-overview.mp4，先写 partial 文件再原子替换。源码哈希覆盖新 Composition、输入、组件和素材清单，不沿用旧脚本仅六个文件的哈希口径。

新增 scripts/check-astra.ts 与 scripts/verify-astra.ts；package scripts 为 check:astra、render:astra、verify:astra。tsconfig 增加路径别名，必要时核实 bundler 对同一 alias 的解析。

实现预计涉及 20–25 个文件（含四份上游组件、视频改编、分镜、输入、脚本和文档），不新增服务、不用数据库、不增加通用效果引擎。Git 仅纳入当前新片和必需配置；渲染产物遵守现有忽略规则。

## 8. 可独立交付阶段

A. Magic UI 接入：四个组件来源和许可证齐全、package 锁定、独立 Studio 验收 composition 可预览。旧片检查和代表帧不变。即使停止后续开发，工程也已获得可用组件能力。

B. Astra6 成片：实现五段叙事、三点事实和本地素材，生成 36 秒 MP4、封面和 contact sheet。此阶段作为一个整体交付，不把“仅有分镜文件”当成成片完成。

C. 验收及说明：这些检查随 A/B 各自执行；最终补全实际命令、素材哈希、媒体信息和复用说明。不是先交片以后再补测试。

时间预估：组件接入与确定性改编约 45–90 分钟，分镜制作与视觉迭代约 60–120 分钟，渲染和验收约 20–40 分钟；按实测推进，不承诺固定时长。

## 9. 验收

命令：bun run typecheck；bun run check；bun run check:astra；bun run render:astra；bun run verify:astra；旧片 bun run verify；git diff --check（只检查本次文件，不修改无关 dirty 文件）。这些新 script 是实施交付项，目前尚未创建。

输入检查：三个优势、正确sourceId、素材存在、禁止路径越界、缺失 Logo 报错、错误基准数值/单位报错、标题/字幕超长明确报错、30/60fps 时间一致。

渲染检查：1080 帧、1920×1080、30fps、36 秒 H.264；ffprobe metadata 和 ffmpeg -xerror 全片解码通过。首尾帧及每个切点前后各一帧检查无黑帧或漏层；各场景中点截图。

确定性检查：420→0→1079→420 的重复像素一致；30fps 的 450 帧与 60fps 的 900 帧同时间像素一致；Studio 同挂载画布往返寻帧、播放、暂停、错误为空。独立 renderStill 与同画布测试分别记录。

视觉检查：100%与50%观看、字幕可读且不遮内容、条形图同基线同比例、数字与来源同屏、Logo不拉伸、Magic UI四组件实际可见、无初始timer空白、转场SVG无id冲突。最终三秒稳定，总分总能在静音观看下读懂。

Regression：已交付 AgentWorkflow 和 BeamOverlay 的固定帧/媒体验收保持通过；安装 Motion 后也不让其进入旧视频时间控制。

## 10. 文档沉淀与恢复

本轮把“按题材独立设计”和“主动上网找真实素材/Logo”写入项目通用文档，保留旧样片视觉说明；新计划单独保存，避免覆盖用户正在编辑的 docs/RESEARCH_AND_PLAN.md。

实施后更新 README 命令与输出入口、THIRD_PARTY 许可、docs/MAGIC_UI.md 组件来源、docs/ASTRA6_SOURCES.md 事实、docs/ASTRA6_DESIGN.md 本片设计、ai-motion-director 的执行流程。

依赖外部系统：GitHub（skill与源码）、Magic UI registry（组件）、OpenAI 官网（事实/品牌素材）、npm registry（已有包管理器下载）；上述检索和组件源已访问。没有 API key、付费素材账号或新服务要求。Bun/Chrome/ffmpeg 使用项目现有环境。

最脆弱前提是官网素材取得与品牌使用条件：失效时采用明确标注的原创示意，保留已核实事实，故不让整个时间轴依赖一个远端媒体 URL。禁止把示意过程写成模型实际运行记录。

实施前保存本次将修改文件的快照与哈希；恢复只针对本次注册、依赖和新增片子，旧片数据不动。不用 reset --hard。提交推送为新的发布动作，等待本轮用户明确要求。

## 给实施 Agent 的任务

按本计划制作 AstraOverview。先使用 frontend-design 和 ai-motion-director，锁定本片视觉，不继承旧片颜色。按官方 registry 引入并实际使用 Safari、Terminal、Number Ticker、Animated Beam；将视频内部时间统一绑定 frame/fps。根据已核实发布页获取素材与 Logo，记录来源和许可，执行总分总 36 秒分镜。完成原片回归、新片确定性、完整解码与肉眼验收，输出 MP4、封面、源码与来源记录；分别报告已实现、已渲染、已实测、已提交状态。

## 首版实际交付差异

官方网站示例源文件获取受限，已按计划的备用路径采用明确标注的原创流程示意；Logo 从 OpenAI 官方 GitHub 组织取得。首版使用五段明确分镜及局部入场/光束串联，未实现工作窗口跨全部镜头的连续几何变形。成片无配音；检查覆盖离线渲染重复像素与帧率一致性，Studio 页面已成功打开。
