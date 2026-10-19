---
name: mg-motion-design
description: 用代码制作 10 秒 MG 动态设计短片：15 种风格（逐帧手绘、等轴 2.5D、扁平矢量、线条动画、3D 渲染、形变、贴纸科普、赛博 HUD、拼贴、弥散渐变、包豪斯、Synthwave、像素、液态、综艺花字），附完整提示词、渲染器、代码合成配乐与评审 rubric。用户说「做一支 MG 动画」「动态海报」「10 秒片头」「包豪斯/像素/HUD 风格短片」「用代码做动效」「mg-styles」时使用。
---

# MG Motion Design（15 种代码动态设计风格）

把一支 10 秒动态设计片当成一个网页来写：给定时间 `t` 就画出那一帧（`window.renderAt(t)`），无头 Chrome 逐帧截图，ffmpeg 合成画面与音轨。画面用 SVG / Canvas / WebGL / Three.js，声音用 `audio.py` 合成。不用生图、生视频模型。

来源：https://github.com/Vincentwei1021/mg-styles-15 （MIT）。本 skill 内置 15 份风格提示词、渲染器、配乐工具包、乐器采样和 3 支示例源码。

## 何时用

- 用户要 5–15 秒的品牌片头、动态海报、知识动画、产品发布动效、社媒短片。
- 用户点名某种风格，或说「像 mg-styles 那样」。
- 用户要可复现、可改代码、确定性渲染的片子，而不是抽卡式生成视频。

不适用：真人实拍剪辑、长叙事口播视频（用 `weilanx-video-studio` 或 `wenxuan-video`）。

## 目录

```
<skill>/
  references/prompts/      15 份风格提示词（每份含完整可发送提示词）
  references/rubric.md     评审用 rubric（另开一个 AI 评审）
  references/template.md   写新风格的模板
  assets/harness/          render.mjs 逐帧渲染器 + preview.html
  assets/lib/audio/        mgaudio 配乐工具包 + 103 个 CC0 乐器采样
  assets/fonts/            字体清单与 fonts.css（字体文件需自行准备）
  assets/textures/         纸张、颗粒、灰尘、和纸纹理（9 个 CC0 文件）
  examples/                09-bauhaus、01-flat-vector、10-synthwave 源码
  scripts/setup-project.ps1
  scripts/setup-project.sh
```

## 快速开始

1. 建工作区（会把 harness、lib、字体、3 支示例和 package.json 复制到目标目录，并 `npm install`）：

```powershell
powershell -ExecutionPolicy Bypass -File "<skill>\scripts\setup-project.ps1" -Target "D:\work\my-mg-film"
```

2. 选风格，读 `<skill>\references\prompts\<风格>.md`，把「提示词」整段作为创作约束。
3. 在目标目录写 `demos/<slug>/index.html` + 画面代码 + `cues.json` + `audio.py`。从 `demos/09-bauhaus` 这类最接近的示例改，不从空白写。
4. 出静帧检查构图，再渲染整片：

```powershell
$env:MG_CHROME = "C:\Program Files\Google\Chrome\Application\chrome.exe"
node harness/render.mjs demos/09-bauhaus --stills 0.5,3,6,9
node harness/render.mjs demos/09-bauhaus
```

输出在 `demos/<slug>/out/video.mp4`，静帧在 `out/stills/`。

5. 配乐：

```powershell
uv run --python 3.12 --with numpy --with scipy --with soundfile --with numba --with pedalboard --with pyloudnorm --with matplotlib python demos/09-bauhaus/audio.py
```

生成 `out/audio.wav`（48 kHz、10.000 s、−14 LUFS、TP ≤ −1 dBTP）和一张频谱 QC 图，渲染器会自动带上它。`matplotlib` 只用于导出后的 QC 图，缺了会在 WAV 写完之后报错。没有 `uv` 时用 Python 3.11/3.12 的 venv 安装 `assets/requirements.txt`。

## 15 种风格

| # | 风格 | 提示词 | 适合 |
|---|---|---|---|
| 01 | 逐帧手绘 / 线条沸腾 | `05-cel-boil.md` | 手作、有机、独立品牌 |
| 02 | 等轴 2.5D | `03-isometric.md` | 城市、系统、产品生态 |
| 03 | 扁平矢量 | `01-flat-vector.md` | SaaS、工具、轻快产品 |
| 04 | 线条动画 | `02-line-art.md` | 极简、建筑、工作室 |
| 05 | 3D 渲染系 | `04-3d-render.md` | 硬件、材质、发布片（需 Blender） |
| 06 | 形变动画 | `08-morph.md` | 抽象概念、AI、转化 |
| 07 | 粗描边贴纸人科普 | `19-paperclip.md` | 科普、解释机制 |
| 08 | 赛博朋克 HUD / FUI | `22-hud.md` | 安全、监控、硬核科技 |
| 09 | 拼贴剪贴 | `06-collage.md` | 文化、杂志、年轻品牌 |
| 10 | 弥散渐变 / 玻璃拟态 | `12-aurora-glass.md` | AI 产品、金融科技 |
| 11 | 几何构成 / 包豪斯 | `09-bauhaus.md` | 设计感、音乐、海报 |
| 12 | 复古 80s Synthwave / VHS | `10-synthwave.md` | 游戏、音乐、怀旧 |
| 13 | 像素风 | `20-pixel.md` | 游戏、开发者工具 |
| 14 | 液态流动 | `07-liquid.md` | 美妆、饮品、流体 |
| 15 | 综艺花字（9:16） | `18-hanazi.md` | 抖音/B站、综艺、梗 |

每份提示词的结构：`Output`（固定规格）→ `Suggested technical route` → `Creative seed`（故事与配色）→ `Signature features`（不可删）。改内容时只替换 `Creative seed` 里的故事、品牌、文案、配色；`Signature features` 决定风格是否成立。

## 制作流程

1. **Treatment**：一句话说清钩子（0–0.5 s 内必须有事发生）、升级、60–75% 处的英雄时刻、结尾定格 0.8–1.2 s 的微动。把每条 signature feature 映射到具体秒数。
2. **先静帧**：在 6–10 个关键时刻渲染静帧，逐张看构图、层级、留白、字距、安全边距。静帧不像海报就不要进入动画。
3. **再做运动**：低分辨率预览，逐帧检查预备、命中、余势。所有运动确定性，禁止 `Math.random()`、CSS 动画、真实时间。
4. **声音**：一条 cue sheet 同时被画面和声音读取；每个视觉落点对应一个 click/blip/hit。配乐与音效分层，音乐让位给音效。
5. **评审**：另开一个 AI，用 `references/rubric.md` 打分，把意见贴回来改一到两轮。
6. **交付**：`video.mp4` + 源码 + `audio.py` + `cues.json` + 所用素材与字体清单。

## 规格与验收

- 默认 1920×1080、30 fps、正好 10.000 s、H.264 + AAC 48 kHz、−14 LUFS、TP ≤ −1 dBTP。
- 竖屏改 `--w 1080 --h 1920`，并在页面里改画布尺寸。
- 验收：`ffprobe` 查时长/帧率/音轨；抽 6 帧看文字不溢出；听一遍确认没有削波、音效没有盖住音乐；确认没有外部未授权素材。

## 环境

- Node.js 22.12+（本机 v24 可用）、Google Chrome、ffmpeg。
- Windows 必须设置 `MG_CHROME`；默认值是 macOS 路径。
- 3D 那支需要 Blender，见仓库 `demos/04-3d-render/README.md`。
- 字体不在仓库里，按 `assets/fonts/README.md` 安装；缺字体时浏览器会回退，字形与原片不同。
- **字体缺失会卡住渲染**：`fonts.css` 里 `font-display: block` 的 URL 404 会让 `document.fonts.ready` 一直不结束，页面停在 `__ready` 之前。临时用系统字体时把 `assets/fonts/fonts.css` 清空（`Set-Content assets/fonts/fonts.css ''`）再渲染。

## 常见坑

- 页面必须从工作区根目录起服务，路径 `/assets/...`、`/node_modules/...`、`/demos/...` 都相对根目录。渲染器已内置静态服务器，不要用 `file://` 打开。
- `audio.py` 里的 `sys.path` 指向 `../../lib/audio`；示例放在 `demos/<slug>/` 时成立，换目录要改路径。
- 同一份提示词每次结果不同；一次生成通常达不到原片完成度，必须经过静帧与评审迭代。
- 商用素材只用 CC0 / OFL / 明确授权；品牌名用虚构的。
