# 素材库

所有视频共用的组件。做新一期时先在这里找，找不到再在自己那一期里写；写完觉得下次还能用，就挪进来并补一行到这份目录。

约定：素材库只能依赖素材库，**不能** import `src/episodes/` 里的任何东西。

## 骨架

| 文件 | 内容 | 用法 |
|---|---|---|
| `Show.tsx` | `Show` 口播视频骨架：背景、场景切换（入场放大、出场上移）、章节标签、字幕、人声/配乐/音效轨 | 每期写一个 `ShowConfig`（场景表、时长、`cueAt`、人声和配乐路径），竖屏用默认值，横屏传 `w/h/stage/subY/chapter`；`look: 'sticker'` 开贴纸风，`keywords` 加本期字幕高亮词 |
| `cues.ts` | `makeCues(字幕, 秒数)` → `cf(n)` 第 n 句开始帧、`ce(n)` 结束帧、`cw(n, '词')` 说到某词的帧、`cueAt(帧)`、`DURATION` | 每期 `cues.ts` 调一次；所有动画都挂在 `cf/cw` 上，换口播只要换字幕 |
| `types.ts` | `SceneDef`（场景：起始帧、章节标题、组件、音效表）、`SfxCue`（`[音效名, 帧, 音量]`） | 场景表和音效表的类型 |
| `Subtitles.tsx` | `Subtitles` 手绘字幕条（关键词黄色高亮、超长自动缩字号）、`ChapterTag` 章节标签、`KEYWORDS` | 由 `Show` 使用；想加高亮词改 `KEYWORDS` |
| `theme.ts` | 颜色 `C`、描边、手绘圆角 `wobblyRadius`、`box`、`popTextStyle`，英文字体 | 所有组件的配色来源 |
| `fonts.ts` | `FONT_CN` 站酷快乐体（本地 TTF）、`FONT_CODE` 代码字体 | 中文一律用 `FONT_CN` |
| `anim.ts` | 缓动（`easeOutBack` 等）、`prog` 进度、`keyframes` 关键帧、`rand` 确定性随机、`boil` 手绘抖动、`reach` 伸手曲线 | 动画一律由帧号算出来；随机只能用 `rand(seed)` |

## 画面风格 look

`ui.tsx` 里的 `Look`：`classic`（默认，手绘细线）和 `sticker`（贴纸风：大字描边加粗、外加白边和硬投影、便签和卡片硬投影、`Pop` 出来的元素会轻轻晃动）。风格通过 CSS 变量挂在 `Show` 的根节点上，`bigText`、`txt`、`Note`、`Card`、字幕和章节标签都会自动跟着变，不需要改场景代码。个别元素不想晃，就给 `Pop` 传 `still`。新一期建议默认用 `sticker`（ep05 起）。

## 角色 `character/`

| 文件 | 内容 |
|---|---|
| `Char.tsx` | **首选入口**。`Char` 在舞台坐标放一个小人：位置、缩放、表情 `eyes`、走路、举手、伸缩手臂 `arm`、配饰 `wear`、像素皮肤 `skin`；`kind="bot"` 是灰色无手的普通 AI。`CharStyle` Provider 切换画风：`vector`（默认）或 `pixel` |
| `PixelBuddy.tsx` | 像素风小人（22×17 格），皮肤：`santa` 圣诞、`cowboy` 牛仔、`chef` 厨师、`detective` 侦探；配饰：`headphones` 耳机。**没有嘴** |
| `BuddyFigure.tsx` | 矢量手绘版小人（前两期用），支持 `mouth`、`color`、`nubs` |
| `Accessories.tsx` | 矢量版配饰：圣诞帽、耳机、眼镜、墨镜、学士帽、太空头盔、书生帽、侦探帽、派对帽、皇冠、领结 |
| `Arm.tsx` | 伸缩手臂（从肩膀伸到目标点） |
| `types.ts` | `Eyes` 表情：`open` `happy` `closed` `wide` `flat` `star` 星星眼 `heart` 爱心眼 `spiral` 晕 |

用户偏好：**像素风**，皮肤只用上面 5 套；CC 没有嘴巴。

## 特效 `fx.tsx`

| 组件 | 用途 |
|---|---|
| `DotPaper` / `DoodlePaper` | 点阵纸背景 / 点阵纸 + 缓慢漂浮的小涂鸦（新视频默认用 `DoodlePaper`） |
| `Burst` | 元素弹出时的放射线 + 小星星 |
| `Emote` | 角色头顶的反应：`!` `?` `heart` `sweat` `zzz` `note` `idea` `anger` |
| `FocusLines` | 漫画集中线（震惊、强调） |
| `PopText` | 卡通弹字（SNIP! / SHAKE: MAX） |
| `Confetti` | 彩纸 |
| `PaperGrain` | 纸张颗粒 + 暗角（`Show` 自动加） |

## 界面 `ui.tsx` 与图标 `icons.tsx`

- `ui.tsx`：`Pop`（在某帧弹出/滑入、某帧淡出的容器，最常用）、`Note` 彩色标签、`Card` 手绘卡片、`Marker` 荧光笔、`bigText` 描边大字、`txt` 文字样式、`jolt` 抖一下
- `icons.tsx`：文件 `VideoFile` `PlainFile` `Folder`，勾叉 `Check` `Cross` `CheckBox`，`Arrow`（可画出进度），`Bulb` 灯泡、`StopSign`、`Trash`、`ThumbUp`、`Coffee`、`UserFace`（「你」：calm/angry/happy/reading）、`ToolIcon`（读文件/建文件夹/读视频/移动文件/列表）、`ChatIcon`、`LaptopIcon`、`Stamp` + `stampScale` 盖章、`Flag`、`CalendarIcon` 日历、`SheetIcon` 表格、`Toggle` 开关、`PlugIcon` 插头（`usbc` 统一接口和几种各不相同的老式充电头）、`DatabaseIcon` 数据库、`KeyIcon` 钥匙

## 道具 `items/`

- `apps.tsx`（屏幕类）：`Photo` 截图/图片素材相框（可在原图坐标上画高亮框 `marks`，图片放 `public/images/<期>/`）、`Win` 应用窗口（亮/暗）、`Code` 逐字打出的代码、`Wave` 波形、`PhoneVideo` / `ScreenVideo` 在框里播放真实视频素材（**必须传 `at`**，否则会从错误的位置开始播）、`FilmStrip` 胶片条、`Stopwatch` 秒表、`Fader` 推子、`Cursor` 光标、`GitHubMark`
- `media.tsx`：`MediaPanel` 真实素材面板（B-roll）：照片带缓慢推近（Ken Burns），视频按全局帧 `at` 播放；左下角标作者和授权；多块叠在同一位置用 `at/out` 交叉淡化。素材放 `public/footage/<期>/`，来源和授权记在 `<素材目录>/素材来源.md`
- `objects.tsx`（物件类）：`Laptop` 笔记本（屏幕内可放内容）、`BookStack` 书堆、`Globe` 地球、`Dice` 骰子、`Magnifier` 放大镜、`CheeseMoon` 奶酪月亮、`Chalkboard` 黑板、`StarIcon` 收藏星、`Keyboard`、`Encyclopedia` 百科全书、`Trophy` 奖杯、`TV` 电视、`Block` 文字积木（token/接龙）、`Desk` 办公桌（上下文比喻，桌面可变红表示放满）、`Fridge` 打开的冰箱（番茄、白菜、鸡蛋，`FRIDGE_ITEMS` 给出各食材坐标）、`Plant` 盆栽、`Scenery` 风景画（`view` 只画其中一块，演示图片切块）、`Balance` 天平（`tilt` 控制往哪边倒，两边托盘可以放任意内容）

## 场景 `sets/`

- `Studio.tsx`：`HostTall` 竖屏 3:4 演播室（舞台 1080×1080，主持人居中，上方放标题）；`PiP` 可传 `x/y/s` 放在竖屏舞台角落；`Host` 横屏 A-roll 演播室（条纹墙、会飘云的窗、挂画、闪烁 ON AIR、桌子、麦克风、绿植），左侧放板书；`PiP` B-roll 右下角整个人站着的主持人。都是横屏 1920 舞台坐标

## 预览 `previews/`

Studio 里的 `library-wardrobe`（矢量版全部配饰与表情）、`library-pixel-wardrobe`（像素版皮肤）。新增皮肤后记得加进来。

## 音频（`audio/`，Node 脚本）

- `audio/synth.mjs`：乐器（Karplus-Strong 拨弦 `pluck`、`bell`、`bass`、`kick` `snap` `hat` `shaker`）、滤波混响，以及 14 个音效 `SFX_NAMES`：snip whoosh pop ding shake confetti boing click type error stamp paper question magic
- `audio/music.mjs`：音乐库。`public/music/` 里的现成曲子（不进 git，目录见 `public/music/README.md`），`TRACKS` 曲目表，`cutMusic({track, start, duration, ep, lufs})` 截一段、淡入淡出、响度标准化成该期的 `bgm.wav`（ep23 起）
- `audio/bgm.mjs`：`buildBgm({voice, out, sections, level, depth})` 按段落编曲 + 人声闪避。段落风格：`light` 轻快、`groove` 律动、`bright` 明亮带铃音、`tense` 紧张（小调）、`break` 留白、`end` 收尾和弦。默认 `level 0.071`、`depth 0.7`（用户偏好：BGM 要轻）

## Vox 拼贴解说 `vox/`

横屏 Vox 风格（ep18 起），配方见 `styles/解说语法/02_新闻与数据/y2_vox_Vox/语法卡.md`。和像素贴纸风是两套画面，不混用。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `V`（桌面纸、纸白、黑卡、线索红、荧光黄）、字体 `VF`（Anton 数字、Playfair 报头、Garamond 正文、思源黑 Heavy 标签、宋体中文）、`step12` 一拍二步进、`tailEase` 长尾缓动、`sineInOut` |
| `props.tsx` | `Desk` 桌面纸、`Torn` 撕边纸、`Clipping` 剪报、`HalftonePhoto` 网点照片（白边加胶带）、`Tape`、`Label` 黑底标签条、`IndexCard` 横线索引卡、`RedLine` / `stringPts` 红线、`RedCircle` 一笔红圈、`Underline`、`Highlight` 荧光笔、`TypeOn` 打字、`SlideIn` 倾斜滑入、`At` 随切点出现 |
| `VoxShow.tsx` | `VoxShow` 骨架（硬切、Vox 字幕条、封面、音轨）、`camAt` + `World` 相机关键帧（世界坐标、对数缩放） |
| `stickers.tsx` | `Sticker` 模切白边贴纸、`PostIt` 冷知识便利贴、`Stamp` 橡皮图章、`Pushpin` 图钉、`People` 一排小人图标（数人数、一个个亮起来）、`DeskLitter` 桌面杂物（咖啡渍、回形针、铅笔、碎纸，铺最底层） |
| `desk.tsx` | 世界坐标里摆东西：`Put`（宽度跟内容走）、`Doc` 纸页、`Big` 大数字、`RedX` 红叉、`RedCheck` 对勾 |
| `portrait.tsx` | `Portrait` 人物示意肖像（交给 `HalftonePhoto` 做网点）：发型、胡子、眼镜、领带 / 黑高领 / 衬衫区分人物 |
| `hud.tsx` | `YearCounter` 右上角年份计数器 + 进度条、`rollYear` 按口播在年份之间滚动 |
| `CoverTall.tsx` | `VoxCoverTall` 系列 3:4 竖版封面（1080×1440）：黑卡大标题 + 系列号「科技简史 · NN」+ 命运线纸卡 + 人物网点照 + 本期贴纸 + 荧光黄钩子条；每期写一个 `CoverTall.tsx` 传内容，在 `Root.tsx` 注册成 `<期>-cover-tall` 的 `Still` |
| `footage.tsx` | `VoxFootage` 真实素材（照片 / 视频）装进白边相框加胶带、左下角署名，随切点直接出现并缓慢推近（视频必须传 `start`）；`BlackCard` 黑卡大字（A-roll） |
| `shots.tsx` | Vox 硬切拼贴的镜头工具：`ShotFilm` 按镜头表 `Shot[]` 硬切、`BShot` 桌面慢推、`Head` 黑卡大字、`Hand` 手写红字、`Medal` 奖牌、`p12` / `countUp`（ep21、ep22） |

要点：元素按 12fps 步进，相机按 30fps 平滑；档案随切点直接出现，不弹不落；黑、纸白、一种红，荧光黄只划重点。网点照片的灰度画面先压暗一半，否则亮部会整片变白；抽帧检查别缩得太小，网点会糊掉。

## 暗金文献风 `gilded/`

横屏 16:9 的历史 / 科学纪录片风格：近黑底、金色细线、衬线字，配方见 `styles/我的风格/暗金文献风/README.md`。预览：Studio 里的 `library-gilded`。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `G`（黑底、暖 / 冷光晕、金、象牙白、羊皮纸、朱红）、字体 `GF`（Garamond 数字和西文、Playfair 斜体书名、宋体中文）、`goldText` 金色渐变大字、`goldTextLight` 小字号重点词、`soft` 模糊柔入、`drift` 慢推 |
| `stage.tsx` | `GildedBg` 背景（光晕 + 暗角，`tone` 暖 / 冷）、`Dust` 浮尘、`Grain` 胶片颗粒、`YearHeader` 左上年份抬头（`prev` + `rollAt` 老虎机翻年份，`prefix` 写「约」）、`BookCite` 右上文献引用、`SealMark` 朱红小印、`GCaption` 字幕（`【词】` 变金、逐字柔入）、`Smash` 爆点大字（光晕骤亮、金字收拢、光环扩散，`sub` 术语 · English；ep32 起从期里挪进来）、`TitleCard` 片头 / 片尾标题卡（拉丁小标 + 金色大标题 + 放射光芒，可加钟形曲线）、`GQuote` 引文、`Soft` 柔入容器、`bellPath` 钟形曲线路径 |
| `props.tsx` | `DieFace` 平面骰子（可写 `1/6` 代替点数）、`Die3D` 立体骰子 + `dieTumble` 翻滚落定、`GoldCoin` 金币（`cut` 切扇形、`split` 分开）、`ScoreBar` 分段计分条、`Contender` 对决大数字、`RedStamp` 朱红盖章、`Parchment` 羊皮纸账册、`ProbCard` 描金边对比卡（进度条带 50% 刻度） |
| `charts.tsx` | `GoldTree` 二叉树（逐层长出，`highlight` 路径描成发光朱红）、`BellBars` 二项分布柱 → 钟形曲线（n 大时自动取 ±4σ 窗口）、`GaltonBoard` 高尔顿板（确定性落珠、堆积、可描曲线）、`RatioChart` 对数横轴的收敛曲线、`DotField` 点阵人群、`GoldWheel` 金线圆环 / 命运之轮 |

要点：所有元素都用 `soft` / `Soft` 柔入，不用弹跳；一场里最多一种朱红；图表的线要「画出来」（`pathLength={1}` + `strokeDasharray`）；场与场之间用模糊交叉淡化，硬切留给大段落。

## 网点档案风 `halftone/`

横屏 16:9 的「审案」轻喜剧风格：米白旧纸 / 藏青夜色两种底、渐变网点、粗宋错版大字、案卷号和日期章、印章砸下、网点淹没转场，配方见 `styles/我的风格/网点档案风/README.md`。预览：Studio 里的 `library-halftone`（带声音：配乐由 `audio/episodes/library-halftone.mjs` 合成，`npm run audio` 会重建；音效表是 `HALFTONE_SFX`）。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `H`（纸面、夜色、藏青墨、钴蓝、粉红、印章红、明黄、橙）、字体 `HF`（宋体 Black 大字、Arial Rounded 圆胖数字、Menlo 编号、黑体 Heavy 字幕）、`misprint` 错版投影、`chunky` 圆胖字加粗、`popScale` 弹入、`slamScale` 砸下、`shake` 落定抖动、`dropIn` 落下 |
| `stage.tsx` | `PaperBg` 纸面（折痕 + 暗角 + 纸纹）、`NightBg` 夜色星点（`starsOnly` 叠在别的底上）、`Halftone` 渐变网点（`mode` 光晕 / 暗角，`maxR` 连成实色）、`halftonePath`、`DotPattern` 网点填充、`PrintGrain` 印刷颗粒、`Pop` 弹入容器、`CaseHeader` 左上案卷号 + 标签（`dark` 深底）、`DateChip` 右上日期章、`Headline` 逐字弹入的粗宋大字、`CaptionBar` 字幕条（`【】` 黄、`〖〗` 粉）、`DropLetters` 片头字母落下、`DotWipe` 网点淹没转场、`Flash` 快门白闪、`Rays` 放射线、`Confetti` 彩纸 |
| `props.tsx` | `RubberStamp` 橡皮印章（斑驳油墨、砸下）、`HeightChart` 身高尺、`NamePlate` 名牌、`BigNumeral` 网点大号数字、`StatBlock` 前科式大数字、`ProfileBlock` 档案信息、`EvidenceCard` 带图钉的证据卡（落下）、`StickyNote` 便签、`DigitalClock` 数码钟、`CaseFolder` 案卷文件夹、`Bubble` 对话框、`BurstLabel` 拟声爆炸框、`DocWindow` 打字的文档窗口、`Moon` 网点月亮、`SpeedLines` 速度线 |
| `suspect.tsx` | 原创嫌疑人 `Robo` 扫地机器人（`eyes` 表情、`spin` 边刷、`light` 感应灯，没有嘴）、`Sock` 袜子 |

要点：元素一律**弹**入（easeOutBack），不要用柔入；一场只有一种主网点 + 角落一小团别的颜色；场景切换放在 `DotWipe` 铺满的 2 帧里（`cut = at + 7`）；同一画面里的多个 `BigNumeral` / `Robo` 要传不同的 `id`，否则 SVG pattern 会串。

## 战术屏科普风 `tactical/`

横屏 16:9 的 FPS 游戏科普风格：深蓝黑游戏 HUD 框里，低多边形 3D 射击场重演挫败瞬间，发光图表给出科学模型，大字卡给结论；配方见 `styles/我的风格/战术屏科普风/README.md`，爆款结构和选题见同目录 `爆款解析.md`。预览：Studio 里的 `library-tactical`。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `T`（深蓝黑底；青 = 你 / 正确，红 = 敌人 / 失误，橙 = 高手 / 答案，绿 = 变好）、字体 `TF`（思源黑体 Heavy + Menlo 等宽）、`glow` / `glowF` 发光、`typeChar` 逐字模糊浮现、`drawLen` 描线、`fade` |
| `stage.tsx` | `TacBg` 背景（`tone` 蓝 / 红 / 暖）、`ChapterCard` 章节卡、`HudFrame` HUD 框（四角角标、系列标、章节号、带章节刻度的进度条、HP / 弹药）、`HookBanner` 开场常驻标题条（顶部深色横条 + 第二人称痛点问句，第 0 帧就完整显示，`out` 帧淡出；ep43 起每期开场都挂）、`TitleCard` 标题卡、`TCaption` 字幕（`【】`青 `〖〗`红 `〔〕`橙 + 发光下划线）、`BigWord` 大字卡、`Strike` 划掉重写、`DeathScreen` 红屏裂纹、`AnswerReveal` 黑场白闪揭晓、`SlowMo`、`Bubble` 疑问胶囊、`SplitPanel` 分屏框、`SourceCard` 出处卡（机构 · 年份 + 原话 + 文章名）、`StepGrid` 2×2 方法卡（`icons` 传图标函数）、`parseMarks` |
| `range.tsx` | `Range` 纯 SVG 低多边形 3D 射击场（相机 `cam` 位置 / yaw / pitch，近平面裁剪，背面剔除，箱子、墙板、地面网格、胶囊人靶 `dummies`（`lift` 离地高度），`tone` 冷青 / 暖橙 / 红，`backWallZ` 身后再立一面墙，原地转身也有景）、`project` 世界→屏幕、`Crosshair` 准星（`spread` 扩散）、`ViewGun` 原创枪模（`kick` 后坐）、`Tracer` 弹道 + 枪口火光、`HitMark` 命中 / HEADSHOT、`TopMap` 俯视图（掩体、视野扇形、视线） |
| `charts.tsx` | `NeonLine` 发光折线（`redFrom` 之后变红）、`BellCurve` 钟形曲线（`shift` 左移、`ghost`、三段着色、抽样点落下）、`Spread` 子弹散布 + 直方图 + 命中率、`TradeoffCurve` 速度—准确率（`shift` 越大越准）、`LoopRing` 循环环（`count` / `hot`）、`MsBars` 毫秒条（`unit` 可换 μs）、`Gauge` 表盘、`RankGem` 原创段位晶石、`ScatterAvg` 散点 + 平均线、`gauss` 确定性正态随机 |
| `hearing.tsx` | 听觉示意图（俯视，前朝上，方位角顺时针）：`azPos` / `earPos` 坐标、`HeadTop` 俯视人头（两耳可分别点亮、可转头）、`SoundSource` 声源 + 声波圈（`ghost` 虚线「你以为在这」）、`EarTracks` 两耳到达时间轨道、`ConeOfConfusion` 混淆锥（伪 3D）、`PinnaSpectrum` 耳廓频谱示意、`HearCanvas` 整屏 SVG |
| `ranked.tsx` | 排位示意图（原创，不画游戏段位图标）：`ResultCard` 胜利 / 失败横幅、`StreakStrip` 胜负条（`hot` 框出连跪）、`coinSeq` / `longestLoss` 确定性抛硬币和最长连败、`CoinGrid` 硬币网格、`RankLadder` 天梯（你往上爬、别人被挤下来）、`BalanceScale` 五对五天平（赢面百分比）、`RankGap` 段位 vs 隐藏分、`TeamRow` 一队五个小人（你青色、最差的红框标出）|
| `pipeline.tsx` | 延迟 / 流水线示意（ep39 起）：`PipelineFlow` 横向分段流水线（逐段亮起、`hot` 红段、`queueIdx` 里堆 `queued` 帧可逐个清空、下方轨道跑信号点 `dot` 或一串帧 `stream`、两端 `ends` 标签）、`FrameLanes` CPU / 渲染队列 / GPU 三泳道甘特图（GPU 吃满时 CPU 提前 `ahead` 帧，`jit` 拉到 1 = 刚好赶上、队列清空；`you` 那一帧青色 + 延迟括号）、`laneTimes` 泳道时间、`LatencyStack` 横向堆叠毫秒条（区间用斜纹延长）。讲输入延迟、网络往返、加载流程都能用 |
| `movement.tsx` | 移动与精度示意（ep40 起）：`SpeedCurve` 速度—时间曲线（多条依次画出、`labelT` / `labelDy` 标签位置，`thresh` 把 \|速度\| < 门槛涂成绿带 =「站稳」，`marks` 竖虚线标时刻，`win` 高亮一段时间窗，`vMin` 给负数可画「反着跑」）、`SpreadTarget` 弹孔散布靶（剪影人靶 + 散布圈 `r` + 弹孔逐颗落下，`headLabel` 统计爆头数）。讲急停、后坐 / 散布、点射都能用 |
| `reward.tsx` | 奖赏 / 上头示意（ep43 起）：`SlotReels` 原创两转轮（左轮玩家选图案，右轮转完停在正中 / 偏一格 / 差很远，下方亮出「赢 / 差一点 / 差很远」；几何图案，不画老虎机品牌）、`BrainGlow` 抽象脑轮廓 + 奖赏回路节点按 `lit` 发光（示意，不画真实解剖）、`LobbyButton`「再来一局」按钮（鼠标移过去点下 `clickAt`、或挪开 `away`，`glow` 呼吸发光）、`ScoreLine` 大比分 + 回合点。讲上头、连败、奖励机制都能用 |
| `attention.tsx` | 注意力 / 听觉示意（ep45 起）：`VoiceComm` 左下角队友语音条（喇叭 + 跳动音量柱 + 报点文字，`clear` < 1 时字是糊的，表示「声音到了但没进脑子」）、`Bandwidth` 注意力带宽条（眼睛占用 `vis` 从左填青色，耳朵橙块 `enter` 从右滑进，放不下就停在框外标「挤不进来」）、`CrossStim` 十字刺激（蓝 / 绿臂、长短差一点）、`ToneIcon` 喇叭 + 声波、`PeopleGrid` 人头点阵（前 `lit` 个依次亮起）、`EvokedWave` 诱发反应曲线（约 100 ms 早期峰 + P3，示意）、`WaveBox` 实时波形。；ep47 加了 `Spotlight` 聚光灯遮罩（整屏压暗、`holes` 里的椭圆是亮的光圈，边缘羽化）、`PassCourt` 传球场（仿大猩猩实验的原创示意：白黑两队传球计数、穿大猩猩服的人走过 / 停下捶胸、幕布变色、球员离场）、`SplitBar` 两段比例条。讲注意力、分心、听漏、看漏、多任务都能用 |
| `window.tsx` | 时间窗示意（ep48 起）：`WindowLanes` 毫秒轴上的几条泳道（每条一段 `[from, to]` 色块，可虚线、可写字，`marks` 是竖线标记，如「你开枪」「他缩回去了」）、`ReactionTest` 反应测试屏（灰块亮绿写「按！」，下方毫秒计数慢放数到目标值）。讲先手、延迟、反应时间、时间差都能用 |
| `tracking.tsx` | 追踪 / 换向示意（ep49 起）：`keyPos` / `keyVel` 关键帧位置和速度（最后一段减速停下）、`predictAim` 预测型准星（按 lag 帧前的位置和速度往前推，匀速时正好对上、换向后冲过头）、`TrackTrace` 位置—时间图（目标 / 准星两条线，`marks` 圈出冲过头的点）、`TurnPath` 拐弯实验示意（手的轨迹先沿老方向冲出再弯过去）、`SpeedBand` 速度—时间图 + 门槛线（低于门槛的段变绿）。讲追踪、预判、横跳、移动射击都能用 |
| `sleep.tsx` | 睡眠 / 清醒示意（ep50 起）：`AwakeDial` 24 小时表盘（从起床钟点顺时针画到现在，超过 `warn` 小时的段变红，中间写「已醒 N 小时」和钟点）、`LapseStrip` 清醒时间轴上的「断线」竖线（示意，超过 `threshold` 小时后越来越密）。讲熬夜、疲劳、注意力衰退都能用 |
| `practice.tsx` | 练习示意（ep51 起）：`AimGrid` 原创靶场点靶网格（每 `per` 帧亮一个圆靶、准星跳过去打掉，右上角命中计数）、`TimeBlocks` 练习排布条（时间轴上若干练习块，`moons` 在块之间标月亮表示隔夜，`progress` 让块依次长出）。讲练习方法、训练计划、作息都能用 |
| `spread.tsx` | 散布 / 点射示意（ep42 起）：`heatAt` 散布热度模型（每枪 +1、停下来在恢复时间内线性降回 0）、`diskPoint` 圆盘内均匀随机点、`BloomRing` 散布圈随热度变大 + 弹孔落在当时的圈里（`head` 画红色头圈并统计命中 `hitLabel`）、`HeatTrace` 热度—时间曲线（开枪刻度、`recoverMark` 恢复时间标尺）、`AreaRatio` 面积题（头圆 vs 散布圈，命中率 =（头 ÷ 圈）²，`growAt` 圈变大）、`HitBars` 分组命中率条。讲压枪、点射、散布、距离都能用 |
| `vectors.tsx` | 机制示意：`VecArrow` 发光向量箭头（`grow` 画出、`label`）、`ProjectionDiagram` 投影（速度在「想去方向」上的影子 + 垂线 + 限速刻度）、`SpeedMeter` 速度表（大数字 + 横条 + 上限刻度）、`CodeCard` 源码卡（逐行出现、高亮行、出处小字）、`RightTriangle` 直角三角形（斜边画出） |

合成音效：`audio/sfx-tactical.mjs` 的 `makeTacticalSfx(ep)` 一次生成枪声、玻璃裂纹、倒带、上升、冲击、章节「咚」、UI 嘀 7 种（−6 dBFS 峰值）；`makeFootstepSfx(ep)` 生成脚步声 `footstep`（正中）和 `footstep-r`（偏右：左耳晚 0.6 ms、轻 9 dB）。出片流程见 `weilanx-creator-fps-video` 技能。

要点：颜色有固定含义，不要乱用（同一画面里红只给失误 / 敌人）；字幕和大字都逐字浮现、关键词带下划线；3D 场景用 `HudFrame` 的 `hp` / `ammo` 才像游戏画面，图表页不显示；镜头之间硬切，死亡和揭晓答案才用特效转场；不画任何游戏的角色、地图、枪械和 logo。

## 暖纸工作台风 `warm-desk/`

横屏 16:9 的口播流程拆解风格：暖米色点阵纸当工作台，白色窗口卡片一层层摆上来，粗黑体标题 + 一块橙色高亮，右下角像素吉祥物（素材库自己的 `PixelBuddy`）常驻；配方见 `styles/我的风格/暖纸工作台风/README.md`。预览：Studio 里的 `library-warm-desk`（组件一览）、`library-warm-desk-show`（口播骨架最小例子）、`library-warm-desk-cover`（竖版封面）。出片流程见 `weilanx-creator-desk-video` 技能。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `D`（纸面、点阵、白卡、墨黑、唯一强调色朱橙 #f15a35、浅橙行高亮）、字体 `DF`（阿里巴巴普惠体 Desk Sans 500–900，回落思源黑 Heavy / 苹方；Menlo）、`rise` 淡入上浮、`slide` 平滑换位、`typeIn` 逐字、`wipe` 高亮刷入、`drift` 漂浮、`OG` 橙色渐变 |
| `stage.tsx` | `DeskBg` 点阵纸（柔光晕）、`DeskDecor` 漂浮几何、`Sparkle` 星光迸发、`Tick` 对勾、`StepBar` 步骤条（大卡片版 / `compact` 顶部胶囊版，做完打勾、当前步橙色）、`ChapterTitle` 章节大标题、`Headline` 粗黑体标题（`〔词〕` 橙块从左刷入、字变白）、`DCaption` 字幕、`WindowCard` 窗口卡、`Tag` 橙色小标签、`SayBubble` 头像气泡、`TypedText`、`Rise` 淡入上浮容器、`Leave` 倾斜滑走容器 |
| `props.tsx` | `ListCard` 清单卡（编号圆点、`hi` 行左侧橙条、`stack` 叠纸、`accent` 角标）、`OptionCard` 选项卡、`SpeedCards` 语速 / 比例卡、`CharTimeline` 逐字时间轴、`TableCard` 表格卡（高亮列 + 标签）、`LetterCards` 字母卡、`CodeCard` 代码卡（逐字敲出；`dark` 深色终端 + 光标 + 绿勾）、`Seesaw` 跷跷板、`ThumbGrid` 缩略图墙、`Waveform` 声波、`BigCount` 大号计数、`FollowCard` 关注卡（点赞 / 关注 / 收藏依次点亮）、`Icon` 心 / 加号 / 星 / 播放图标、`CardFan` 叠放卡片 |
| `motifs.tsx` | 主视觉（每个 B-roll 场景挑一个当主角）：`Badge` 旋转环字徽章、`Chips` 编号特性卡、`LineIcon` 线条图标、`IconCards` 图标大卡并列（中间 + / → 圆钮）、`MysteryCards` 问号悬念卡、`FilmStrip` 胶片条（视频 = 一帧帧）、`Rings` 三层同心圆、`PlayerCard` 成片播放卡、`FlowCards` 虚线串起的 STEP 流程卡 |
| `Slot.tsx` | `MediaSlot` 素材位（`SlotSpec`：编号、要什么、文件路径、`ready`）：素材没到时画斜纹占位框写清楚缺什么，`ready` 后换成真视频 / 截图；每期把 SlotSpec 集中写在 `assets.ts`，同时给用户一份素材清单 |
| `HostCam.tsx` | `HostCam` 真人出镜小窗（白边、圆角 16、背后错开的橙卡 + 虚线框、白色名字胶囊 + 跳动橙点；挂 `DeskShow` 的 `overlay`），A-roll 大 / B-roll 小的切换见 ep26 的 `camAt` |
| `mascot.tsx` | `DeskMascot` 右下角吉祥物（`eyes` 表情、轻浮动、`hop` 跳一下、可用 `slide` 挪位置）、`PixelEmote` 像素小反应（! ? ♪ …） |
| `DeskShow.tsx` | 口播骨架：`DeskShowConfig`（`DeskScene[]` 场景表：`from`、`C({f, t})`、`step` 点亮步骤条、`eyes` / `hop` / `emotes` 吉祥物、`sfx`）+ 人声 / 配乐 / 音效三轨（`mix` 导出分轨用）+ 底部字幕 + 首帧封面淡出；换场时旧内容自动倾斜滑走变模糊；`decor` 背景漂浮几何（给矩形数组避开内容区）、`push` 场景内镜头缓推（默认 2.5%）、`overlay` 常驻层（出镜小窗）、`noMascot` |
| `CoverTall.tsx` | `DeskCoverTall` 3:4 竖版封面（1080×1440）、`DeskCoverWide` 横版首帧封面（1920×1080），同一组参数 |

要点：整片只有一种强调色（朱橙，大色块用 `OG` 渐变），别加第二种；每个场景一个主视觉（`motifs.tsx` 或一张信息卡）+ 一句粗黑体标题，星光 `Sparkle` 放在内容后面（DOM 里先画）；几乎不硬切，换内容用 `Leave` 滑走 + `Rise` 上浮，同一元素换位置用 `slide`；元素要够大（列表行 34px、字母 200px、字幕 48px），留白多了就显得空；吉祥物不画参考视频里的角色，用 `PixelBuddy`。


## 灯火史话风 `lamplight/`

横屏 16:9 的古代制度 / 律令 / 城市生活科普风格：暖黑夜色 + 火光 + 米白象形小人，左上角宋体 Black 大字一句一句写出来讲故事，关键词按含义上色划线；配方见 `styles/我的风格/灯火史话风/README.md`。预览：Studio 里的 `library-lamplight`。出片流程见 `weilanx-creator-lamplight-video` 技能（样片 ep28）。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `L`（暖黑、夜空冷蓝黑、米白、冷蓝 = 名词 / 律文、朱红 = 惩罚 / 禁止、火金 = 火 / 数量、纸卷、木轴、印章）、字体 `LF`（宋体 Black 叙述、思源黑 Heavy / 苹方标签、楷体纸卷）、`charIn` 逐字收拢、`fadeSoft` 淡入、`countTo` 数字滚动、`commas`、`push` 慢推 |
| `stage.tsx` | `BigGlyph` 全屏砸下的大字（落定抖一下）、`shakeXY`、`Flash` 白闪、`TitleCard` 标题卡（金色大标题 + 系列小字 + 胶囊）、`NightBg` 夜色（`sky` 星空、`floor` 透视地面网格、`glow` 光晕）、`FloorGrid`、`Embers` 火星、`Narration` 左上叙述（`【】`蓝 `〖〗`红 `〔〕`金 + 下划线画出，`out` 整段模糊淡出，`align="center"` 居中）、`parseMarks`、`Glint` 四角星、`StatCorner` 右上数字（滚动到点闪星，`prefix`「杖 / 徒 / 第」、`strike` 红线划掉）、`SourceNote` 底部出处、`Disclaimer` 右下声明、`DynastyAxis` 朝代轴（圆环滑动）、`Fade` 淡入容器、`Dissolve` 暗场溶解、`PointTransit` 穿光转场（`in` 扎进 / `out` 缩向 / `from` 拉出）、`Cam` 慢推 |
| `props.tsx` | `CoinG` 方孔铜钱（`iron` 铁钱）、`CoinStringG` 一贯钱串、`CoinPole` 挑钱的扁担（`loadAt` 每压一贯弯一点、`iron`）、`Ticket` 券（朱红边竖排字，`split` 撕成两半、`hide` 只画一半，用来演「合券」，ep41）、`Waiter` 跑堂（左手托碗、右臂从手腕叠到肩膀，按帧一只只叠上）、`Bowl` / `BowlG` 碗（瓷碗 / 银碗）、`FoodBoxG` 三层食盒、`Fingerprint` 朱红指印（按下 + 一圈晕开）、`Lantern` 手提灯笼、`Horse` 原创象形马（奔跑 / 站 / 倒下，背驿卒、火把、文书筒）、`HoofDust` 马蹄扬尘、`GoldPlaque` 朱漆金字牌（高光扫过）、`TierCards` 档位卡、`HorseQuota` 十匹马逐匹倒下、`FlameG` / `Flame` 火焰（`lit` 点燃、`fat` 胖瘦）、`Figure` 象形小人（`pose` 站 / 举手 / 举火把 / 指向 / 喊话 / 躺，`walk`、`hat`、`dazed`）、`BeaconRow` 一排烽燧（`litAt` 逐个点燃、编号变金、`hotLast`）、`Watchtower` 烽台、`Gate` 门（门钉、`open`）、`Drum` 大鼓（`hits` 涟漪）、`Scroll` 纸卷（轴从中间拉开、竖排列放不下自动缩字号、朱红题签、方印、出处；列的 `at` 指定点亮帧可卡硬拍，`dim` 未点亮的列先淡淡露出，`colW` 列宽）、`NameTag` 金边名签、`GroundRing` 地面光圈、`TallyCard` 人数卡、`SayBubble` 金边气泡、`Moon`、`DayNightDial` 昼夜盘、`Crowd` 远景人群 |
| `scenes.tsx` | 各期通用的镜头件：`NightRoad` 夜路（里程桩往后流）、`MapView` 地图镜头（自带左上叙述区压暗 `MapShade`）、`FlowDots` 沿路线流动的光点、`darkness` 收暗曲线、`panelAt` 按 CUES 取当前一屏叙述、`barPunch` 小节冲击 |
| `charts.tsx` | `CityGrid` 透视城市方格（`lightAt` 随机逐格亮灯、`darkAt` 熄灯、`core` 主城、`labels` 虚线格、`hot` 出事格）、`WardPlan` 俯视院落（`ban` 外面斜纹 + 四面「禁」、`walkers` 院内走动）、`ReliefMap` 程序地形浮雕（镜头 `camX/camY/camS`，children 跟着地图走）、`wiggle` 路线加密、`routeAt`、`GlowRoute` 发光点线路径（`fire` 路头一团火）、`Waypoint` 地图地点（城 / 点 / 火）、`StationDots` 满地驿站光点（随机亮起 / 熄灭）、`RelayChain` 接力链（第 k 站在 `litAt[k]` 帧点亮、路头正好到站，用来把配乐硬拍变成一站一站往前传） |
| `ice.tsx` | 冰道具（ep46 起）：`IceBlockG` / `IceBlock` 斜视冰块（`melt` 化成一滩水、`dims` 尺寸标注线）、`MistG` 碗口白气、`IceBowl` 冰碗（`iceAt` 碎冰落进碗、`mistAt` 冒白气、`silver` 银碗）、`IceCellar` 冰井 / 冰室剖面（`fillAt` 逐块码进去、`melt`、`darkAt` 熄灯、`label` 竖牌）、`UmbrellaStall` 青布伞摊（`litAt` 亮灯、`sign` 竖排字牌）、`IceCarrier` 挑冰担的人、`MenuBoards` 一排水牌菜单（`litAt` 逐块亮，卡回落段硬拍）。藏冰、冷饮、窖藏、季节储存类题目都能用 |

要点：画面上的叙述就是字幕，不要再加底部字幕条；三种语义色各管一类意思，同一句里别混用超过两种；小人一律米白（死去 / 失势的人用 `color` 变灰），不加五官；场与场之间暗场溶解，能贯穿的元素（同一座城、同一个院落）放在场外面别跟着闪；地形是程序生成的假地形，不要标成真实地名的精确位置。音效用 `audio/sfx-lamplight.mjs` 的 `makeLamplightSfx(ep)`：马蹄 `hoof`、大鼓 `drum`、点火 `ignite`、驿铃 `bell`、瓷碗轻碰 `clink`（峰值 −6 dBFS），冲击和上升借战术屏的 `makeTacticalSfx`。

## 黑金光影风 `blackgold/`

横屏 16:9 的「一个模型解释一种现象」风格（博弈论、经济学、认知、冷知识、AI 原理）：近黑底上一层缓慢翻涌的暖色烟雾，一切都在发光——金粒子聚成标题、霓虹细线画出收益矩阵和曲线、聚光灯打在发光的小人身上、底部中英双语字幕。配方见 `styles/我的风格/黑金光影风/README.md`。预览：Studio 里的 `library-blackgold`。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `B`（近黑、暖烟 / 红烟、米白、金、**青 = 合作 / 更好**、**珊瑚红 = 背叛 / 均衡**、细胞网格的暗红和深青）、字体 `BF`（宋体 Black、Garamond）、`glowText` 发光字、`neon` 霓虹描边、`blurIn` 模糊柔入、`drawP` 线条画出、`vis` 场间淡化 |
| `stage.tsx` | `SmokeBg` 烟雾底（`tone` 暖 / 红、`focus` 烟最浓处）、`Grain`、`BGCaption` 底部双语字幕（`【】`青 `〖〗`红 `〔〕`金，`dimAt` 换句前先变暗）、`ChapterTag` 左上章节签、`CiteLine` 顶部宽字距引用行、`CenterWord` 居中发光大字、`SparkTitle` 金粒子聚成的标题卡（金色烟云 + 英文 + 副标题；`instant` 在重拍帧直接亮出）、`GlowSmash` 重拍砸字（光晕骤亮 + 光环 + 术语小字，ep36）、`TickRing` 表盘刻度环（一根根点亮，配「等」「时间」类锚词）、`FormulaField` 标题四周漂浮的公式碎片、`Fade` |
| `props.tsx` | `SpotlightG` 聚光灯、`GlowPawnG` 发光小人（亮 / 暗 / 青 / 红）、`Booth` 审讯室小间、`TheaterStage` 剧场舞台、`Silhouettes` 前景大剪影观众（`standAt` 逐排站起）、`GlowCard` 霓虹描边卡片、`Awning` 小店雨棚价格卡（利润条） |
| `charts.tsx` | `PayoffMatrix` 2×2 收益矩阵（金箭头沿格子边缘依次画出、格子青 / 红霓虹高亮 + 右侧标签）、`GlowBars` 发光柱状图、`TileSeq` C/D 方块序列、`CellGrid` 空间囚徒困境细胞网格（确定性演化、刚翻的格子发金光、右上统计卡；`temptation` 1.85–1.95 青红共存最好看）、`stepGrid`、`DotRing` 光点网络环、`NeonLines` 霓虹折线图（渐近虚线、发光交点）、`BalanceScale` 天平（`phases` 换数值、横梁带回弹往大的一边沉、赢的秤盘发光）、`PelletStack` 食粒柱（依次落下叠起，`leave` 颗变汗珠飞走 = 可视化减法）、`Ledger` 对账卡（数字变化时闪一下，`hiCol` 大号金字） |
| `pen.tsx` | 动物实验场（ep36 起）：`GlowPigG` 发光的猪（站 / 跑 / 趴，`t` 驱动呼吸和眨眼，`eat` 碎屑、`sweat` 甩汗、`zzz` 打呼、`speed` 速度线和尘土）、`PigPen` 猪圈（拉杆—管子—食槽、按下冲击波、食粒弹进槽、背后围栏、光锥浮尘、地面倒影、`flicker` 灯接触不良）、`track` 按关键帧跑来跑去（带朝向和速度）、`since`、`ShockG` 冲击波 + 火星、`LightMotesG` 光锥里的浮尘。任何「一方出力、一方坐享」的模型（搭便车、公共品、团队分工）都能直接借这个舞台 |
| `chaos.tsx` | 混沌 / 天气道具（ep38 起）：`GlowButterflyG` 发光蝴蝶（`flapAt` 每拍扇一下）、`GullG` 海鸥、`TornadoG` 龙卷风（`grow` 长出、`calm` 散掉）、`RipplesG` 扩散气流环（`dx` 往一边漂）、`TrailPathG` 带拖尾和光头的轨迹（吸引子、走势、粒子路径，`head` 可小数）、`PrintoutTape` 老式打印纸带（送纸孔、条纹、`scroll` 滚动、`hiRow` 高亮行）、`ForecastStrip` 天气预报日卡（`litAt` 逐张亮、`fogFrom` 起雾 + 红「?」、可信度条递减）。讲初值敏感、预测极限、不确定性、天气 / 气候都能用 |

要点：颜色有语义——青只给「合作 / 更好 / 本可以」，红只给「背叛 / 均衡 / 陷阱」，金做箭头和连接，一个画面里青红各最多一处高亮；所有东西都要发光，但正文字幕只微发光、重点词才强发光；线条一律「画出来」，高亮一律「先描边后发光」；前景剪影要大、要黑，靠头顶的暖色轮廓光和背景分开。

## 协作剪辑台风 `editor-room/`

横屏 16:9 的产品 / 网站宣传动画：把演示装进一个多人在线剪辑软件的界面里讲——左边团队群聊一问一答，中间画布按播放头换镜头（大标题、网页、功能卡），底部时间轴上几何小角色当协作者光标拖片段落轨，最后整屏切 logo 收尾卡。一镜到底，暖米白 + 荧光黄绿一个重点色。配方见 `styles/我的风格/协作剪辑台风/README.md`。预览：Studio 里的 `library-editor-room`（虚构建站工具「Pebble」的 35 秒示例）。

| 文件 | 内容 |
|---|---|
| `theme.ts` | 配色 `E`（暖米白底、白面板、墨黑、荧光黄绿 `hl`、金色波形、粉色动效轨）、`CREW_COLORS`、字体 `EF`（标题几何无衬线 + Desk Sans 900，界面 Desk Sans，时间码等宽）、`pop` 短语淡入上浮（6 帧）、`popIn` 回弹弹出、`hl` 荧光笔进度、`bob` 浮动、`glide` 平滑移动 |
| `mascots.tsx` | `Critter` 五个原创几何小角色（星 / 滴 / 胶囊 / 菱 / 拱，白眼黑眼珠、无嘴、`blink` 眨眼）、`Pointer` 鼠标箭头、`CursorCritter` 协作者光标（箭头 + 角色 + 名字胶囊，`carry` 拖着东西）、`CREW` 默认五人组 |
| `stage.tsx` | `RoomBg` 底色、`HlPill` 荧光胶囊、`TopBar` 顶栏（`render` 渲染进度被荧光黄填满）、`Icon` 线性图标、`ChatPanel` 群聊（`ChatMsg` 按帧冒出、自动上滚、自己的消息黑气泡）、`ToolRail` 工具条、`CanvasPanel` 画布（播放胶囊 + 时间码 · 镜头名 + 居中标签）、`Timeline` 时间轴（`Clip` 片段 `drop` 帧之前是虚线占位、`CursorPath` 协作者光标关键帧、关键帧菱形、播放头）、`timelineGeom` 落点坐标、`EditorRoom` 整套界面（`fade` 淡出切收尾卡） |
| `canvas.tsx` | `BrandMark` 原创示例 logo、`PopTitle` 短语逐个浮现的大标题（`〔词〕` 荧光笔）、`SitePage` 原创落地页示意（`seed` 换配色）、`BrowserMock` 浏览器窗口（`scrollAt` 页面滚动）、`FeatureCard` 功能卡 + 侧边弹出胶囊、`CheckSticker` 对勾贴纸、`ThumbWall` 页面缩略图墙、`LogoTiles` 集成卡片行（「已接入」胶囊）、`InkPill` 黑胶囊、`EndCard` 收尾卡 |

要点：界面一直不动，节奏靠聊天冒泡、片段落轨和画布换镜头推进；画布里硬切，整屏只在结尾切一次收尾卡；荧光黄绿是唯一的重点色，其余颜色只属于小角色；网页一律用 `SitePage` 原创示意，不放真实网站截图和第三方 logo。
