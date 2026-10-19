# AGENTS.md

给 AI 编程助手（Claude Code、Codex 等）和贡献者的工程说明。

用代码做手绘 / 像素风口播动画视频（Remotion + React + SVG）。画面、配乐、音效全部由代码生成；人声和字幕来自你自己的口播录音。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm install` | 安装依赖（锁文件是 `package-lock.json`，用 npm） |
| `npm run studio` | 启动 Remotion Studio（http://localhost:3000/<作品ID>），改代码自动热更新 |
| `npm run typecheck` | `tsc --noUnusedLocals` |
| `npm test` | 全部测试（vitest）；单个：`npx vitest run tests/episodes/ep03-cc.test.ts` |
| `npm run audio` | 生成 14 个共享音效 + 每期配乐（`public/audio/` 不进 git，可随时重建；每期配乐需要先放好该期的 `voice.wav`） |
| `npm run cues -- materials/<期>/字幕.srt src/episodes/<期>/cues.json` | 导入字幕 |
| `npm run export -- <期>` | 导出成片到这一期的成片目录（见下文「目录约定」），有人声的期数同时导出 `stems/` 并重新混音限幅 |
| `node audio/episodes/<期>.mjs` | 只生成这一期的配乐和音效，不用每次跑全量 `npm run audio` |
| `npx remotion still src/index.ts <期> out.jpg --frame=N --scale=0.4` | 单帧检查，改画面后用它看效果，不要为检查去渲染整片 |

如果 `NODE_OPTIONS` 里带有失效的 `--require` 预加载导致 node 启动报错，先执行 `export NODE_OPTIONS=--max-old-space-size=4096`。

作品 ID = `src/episodes/` 下的目录名，完整列表见 `src/Root.tsx`。素材预览：`library-wardrobe`、`library-pixel-wardrobe`。

## 仓库里没有的东西

为保护隐私和第三方版权，以下内容不在仓库里，需要自己准备：

- `public/audio/<期>/voice.wav`：口播人声（48kHz 立体声 16-bit，约 −16 LUFS）。没有它，该期在 Studio 里没有人声，`npm run audio` 也无法为该期生成配乐。
- `public/footage/<期>/`：Vox 风格期数（ep03、ep07、ep21、ep22 等）用到的真实视频 / 照片素材。
- `public/images/ep04-opus55/`：ep04 用到的截图。
- `public/footage/ep26-opus-video/`、`public/footage/ep27-opus-video-full/`：暖纸工作台风两期的真人出镜录像和作品素材。
- `public/music/*.mp3`：音乐库的曲子（只带目录 `public/music/README.md`）。暗金、战术屏、灯火、黑金四种无口播风格（ep23 起）的配乐都来自 we-never，这是作者已获授权的自用曲目，不随仓库分发；没有它这些期数没有声音，`node audio/episodes/<期>.mjs` 也会报错。换成你自己有授权的曲子，用 `beats.py` 重测网格后改 `timeline.ts`。
- `template/`：蒸馏风格用的参考视频，是别人的作品，不进 git。
- `materials/`：原始录音、字幕、文案、选题池、拆解报告。
- `out/`：导出结果。

`ep00-demo` 不依赖任何外部素材，是最快的上手示例。

## 目录约定

- 作品 ID 形如 `ep35-choke`，同时是 `src/episodes/` 的目录名、`src/Root.tsx` 里的 Composition ID（Root 按风格分 `<Folder>`），以及 `public/audio/`、`audio/episodes/`、`tests/episodes/` 里的文件名。新期号取 `src/episodes/` 最大号 + 1。
- `materials/`（原始素材）和 `out/`（成片）不进 git，**按风格分类、风格内从 00 编号**，如 `out/06-战术屏科普风/04-残局手抖/`；每期目录里的隐藏文件 `.ep` 记着作品 ID。skill 文档里的 `<素材目录>` / `<成片目录>` 用脚本查：`bash scripts/ep-dir.sh <作品ID> materials|out`；新一期先建目录：`bash scripts/ep-dir.sh <作品ID> materials --new <风格目录> <中文短题>`（materials 和 out 一起建）。
- 用了某种风格就把期数补进 `styles/README.md` 的总表。

## 结构与核心机制

- `styles/`：风格库，按类型分好的所有画面风格（3 种自有风格、35 种艺术风格、9 种解说语法），总表在 `styles/README.md`。
- `src/library/`：跨期复用的素材库，目录见 `src/library/README.md`。**素材库不能 import `src/episodes/`**。新组件如果下次还能用，挪进素材库并补进 README。
- `src/episodes/epXX-主题/`：每期一个目录，`EpXX*.tsx`（写 `ShowConfig` 交给 `Show`）、`cues.ts/json`（字幕）、`scenes/`（场景组件 + 音效表 + `index.ts` 场景表）。`ep00-demo` 是早期的 30 秒 demo，结构独立（自己的 `lib/` 状态机），不走 `Show`。
- `audio/`：程序化合成音效（`synth.mjs`）、配乐（`bgm.mjs`、`score.mjs`）、音乐库（`music.mjs`：从 `public/music/` 截一段、淡入淡出、统一响度）和每期段落表（`episodes/`）。
- `scripts/`：字幕导入（`srt2json.mjs`）、导出（`export.sh`）、分轨混音（`mix-stems.sh`）。
- `tests/`：素材库和每期的测试（场景顺序、音效名存在、字幕在时长内）。

**动画 = 帧号的纯函数。** 组件用帧号 `f` 算出这一帧的样子；不能用 `Math.random()`、CSS 动画或真实时间，随机用 `rand(seed)`。

**一切挂在字幕上。** `makeCues` 生成 `cf(n)`（第 n 句开始帧）、`cw(n, '词')`（按字符位置估算说到某词的帧）。场景起点通常是 `cf(n) - 6`（画面略早于口播）。重录口播后只需换 SRT 重新导入，动画自动对齐；`cw` 找不到词会直接抛错，改字幕后跑一遍 `npm test` 就能发现。

**`Show` 的场景不是 `Sequence`**，场景组件拿到的 `f` 是整片的全局帧号。所以嵌入真实视频（`PhoneVideo` / `ScreenVideo`）必须传 `at`（出现的全局帧），组件内部用 `Sequence` 包起来，否则素材会从错误位置开始播。

**画风开关**：`Char` 通过 `CharStyle` Context 选择矢量或像素风，新视频在根组件包 `<CharStyle.Provider value="pixel">`。

**音频流水线**：
1. 人声：原始录音用 ffmpeg 加增益 + `alimiter` 拉到约 −16 LUFS，存为 `public/audio/<期>/voice.wav`
2. 配乐：`audio/episodes/<期>.mjs` 写段落表调用 `buildBgm`，按人声包络自动闪避（默认 `level 0.071`、`depth 0.7`，约 −34 LUFS）
3. 音效：场景文件导出 `SfxCue[]`，由 `Show` 按帧放置
4. 导出：Remotion 内部混音会把峰值推到 0 dBFS 削波，所以 `export.sh` 用三条分轨经 `scripts/mix-stems.sh` 重新混音（音效 −3dB，−1dBFS 限幅）替换成片音轨

**字体**：中文用本地 `public/fonts/ZCOOLKuaiLe-Regular.ttf`（站酷快乐体）。它没有 ✓ ✗ → ★ ♪ ≠ 等符号（会回落到系统字体），对勾叉号用 `Check` / `Cross` 图形。字体许可见 `public/fonts/LICENSES.md`。

## 工作流 Skill

`.claude/skills/` 里有八个工作流，在 Claude Code 里打开本工程、直接说要做什么就会触发对应的 skill：

| 风格 | skill | 交付方式 |
|---|---|---|
| 蒸馏参考视频成新风格 | `weilanx-creator-distill-video` | 产出 `src/library/<风格ID>/` + 预览作品 + 配方卡 |
| 黑金光影风（博弈论 / 反直觉模型，无口播） | `weilanx-creator-blackgold-video` | **一锅出**：不等确认，直接导出 + 3:4 封面 + 发布文案 + 双语字幕稿 |
| 战术屏科普风（FPS 科普，无口播） | `weilanx-creator-fps-video` | **一锅出**：直接导出 + 封面 + 发布文案 + 字幕稿 |
| 灯火史话风（中国古代知识，无口播） | `weilanx-creator-lamplight-video` | 先给文案与卡点稿确认，再出片 |
| 暗金文献风（无口播短片） | `weilanx-creator-gilded-video` | 先 Studio 预览，确认后导出 |
| 暖纸工作台风（口播流程拆解） | `weilanx-creator-desk-video` | 先 Studio 预览，确认后导出 |
| Vox 拼贴科普（横屏，真实素材） | `weilanx-creator-vox-video` | 先 Studio 预览，确认后导出 |
| 像素贴纸风口播（竖屏 3:4） | `weilanx-creator-pixel-video` | 先 Studio 预览，确认后导出 |

部分步骤（配音、字幕识别、文生图封面、标题公式）依赖作者的私人工具，每个 skill 的「依赖（开源版说明）」一节写了替换方法。

## 硬规则

- **动画 = 帧号的纯函数**：不用 `Math.random()`、CSS 动画、真实时间；随机用 `rand(seed)`。
- 无口播期数（暗金、战术屏、灯火、黑金）用 `timeline.ts` 当全片唯一时间表，挂在配乐的实测拍子上；`timeline.ts` 不 import 别的 .ts / .tsx（脚本会用 Node 直接加载它）。
- 口播期数走 `Show`：一切挂在字幕上（`cf(n)` / `cw(n, '词')`）；场景拿到的是全局帧号，嵌入视频要传 `at`。
- 事实只用一手资料，数字写进常量并在测试里断言；示意画面标「示意」。
- 不画任何真实游戏的角色、地图、枪械、logo。
- 蒸馏风格时「风格一比一，内容不搬」：组件重写、示例内容自己编，原片的文案、标题、水印、帧一样不进仓库。
- 中文字体没有 ✓ ✗ 这类符号，用 SVG 图形代替。

## 无口播的纯音乐短片（样片：暗金 ep23、战术屏 ep25、灯火 ep28、黑金 ep36）

- 素材包 `src/library/gilded/`，预览作品 `library-gilded`，配方见 `styles/我的风格/暗金文献风/README.md`。
- 结构独立于 `Show`：一期一个 `timeline.ts`（小节网格 `barSec(k)`、重拍帧 `HIT`、中英字幕 `CUES`、镜头段落 `SHOTS`、音效 `SFX`）加一个画面组件。
- 先测配乐：起音、小节长、第一个「换气 + 重拍」；高潮（锚词大字）放在重拍那一帧，重拍前约 0.7 秒画面收暗、最后 3 帧静止；字幕切换都卡小节线。
- 字幕就是旁白：每屏一句中文（≤ 18 字）+ 一行英文斜体（`GCaption` 的 `en`）。

## 做新一期的流程

1. 建目录 `bash scripts/ep-dir.sh <期> materials --new <风格目录> <中文短题>`；把口播录音转成 SRT（任意语音识别工具），原始素材放进 `<素材目录>`
2. 人声标准化到 −16 LUFS → `public/audio/epXX-主题/voice.wav`；`npm run cues -- ...` 导入字幕
3. 新建 `audio/episodes/epXX-主题.mjs`，`npm run audio`
4. 新建 `src/episodes/epXX-主题/`，参考 ep02（竖屏）或 ep03（横屏 A-roll + B-roll）；在 `src/Root.tsx` 注册作品；加 `tests/episodes/epXX-主题.test.ts`
5. 逐场景 `remotion still` 抽帧自查重叠和时机
6. 在 Studio 里预览确认后再 `npm run export`

## 边界

- 不要提交录音、成片、真实素材或任何 `.env` / 密钥文件（`.gitignore` 已覆盖常见路径）。
- 新增第三方素材时，在对应期的素材来源文档里记录作者和授权，只用允许再分发的素材。
- 改动字幕或场景后跑 `npm test` 和 `npm run typecheck`。
