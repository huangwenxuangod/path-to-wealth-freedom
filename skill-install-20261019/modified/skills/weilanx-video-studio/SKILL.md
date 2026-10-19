---
name: weilanx-video-studio
description: 用 Remotion + React + SVG 做全代码知识短视频（黑金光影、战术屏 FPS 科普、灯火史话、暖纸工作台口播、暗金文献、Vox 拼贴、像素贴纸、参考视频蒸馏），内置 8 套工作流、8 种风格组件库、程序化配乐与音效、导出与封面流水线。用户说「做一期黑金风」「FPS 科普」「古代冷知识视频」「Vox 拼贴」「像素风口播」「蒸馏这个视频的风格」「weilanx」时使用。
---

# Weilanx Video Studio（代码生成的知识短视频）

一个 Remotion 工程 + 8 个制作工作流。画面、配乐、音效全部由代码生成；口播期数需要你自己的人声录音与 SRT。动画是帧号的纯函数，一切挂在字幕时间上，重录后换 SRT 即可自动重新对齐。

来源：https://github.com/Azure12355/weilanx-claude-videos （MIT）。完整工程已随本 skill 放在 `assets/project/`。

## 何时用

- 中文知识短视频：AI 原理、科技史、科学、博弈论、FPS 游戏机制、中国古代制度、财经概念。
- 要可编辑、可复现、成系列（固定片头、字幕、配色、配乐）的内容账号。
- 要把一支参考视频的画面语法蒸馏成可复用组件。

不适用：10 秒纯动效海报（用 `mg-motion-design`）、需要长因果讲解与音乐化分镜的导演型知识片（用 `wenxuan-video`）。

## 安装

```powershell
$skill = "C:\Users\37453\.codex\skills\weilanx-video-studio"
$work  = "D:\work\weilanx"
Copy-Item -LiteralPath "$skill\assets\project" -Destination $work -Recurse
Set-Location $work
npm install
```

依赖：Node.js 24（v24 已验证）、ffmpeg、`uv`（跑 Python 辅助脚本）。导出需要 ffmpeg 在 PATH。

## 8 个工作流

工程内 `.claude\skills\` 下有完整工作流；本 skill 的入口按需求选一个：

| 工作流 | 触发 | 产物 |
|---|---|---|
| `weilanx-creator-blackgold-video` | 黑金光影风、博弈论/反直觉模型、无口播 | 成片 + 3:4 封面 + 文案 + 双语字幕稿 |
| `weilanx-creator-fps-video` | FPS 游戏挫败瞬间背后的原理 | 同上（战术屏 HUD） |
| `weilanx-creator-lamplight-video` | 中国古代制度/冷知识 | 先出文案与卡点稿，确认后出片 |
| `weilanx-creator-gilded-video` | 暗金文献、纯音乐、锚词踩重拍 | Studio 预览后导出 |
| `weilanx-creator-desk-video` | 「我是怎么用 AI 做 XX 的」流程拆解、口播 | 预览后导出 |
| `weilanx-creator-vox-video` | Vox 拼贴科普、真实素材、强钩子口播 | 预览后导出 |
| `weilanx-creator-pixel-video` | 一个关键词出一期像素竖屏口播 | 预览后导出 |
| `weilanx-creator-distill-video` | 把参考视频蒸馏成新风格素材包 | 组件库 + 预览 + 配方卡 |

开始前读工作区根目录的 `AGENTS.md` 和 `src/library/README.md`。所有 npm/node 命令前设 `$env:NODE_OPTIONS="--max-old-space-size=4096"`。

## 常用命令

```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run studio                 # http://localhost:3000/<作品ID>，先看 ep00-demo
npm test
npm run typecheck
npm run audio                  # 生成共享音效与各期配乐（缺 voice.wav 的期会报错）
npm run cues -- materials/<期>/字幕.srt src/episodes/<期>/cues.json
npm run export -- ep00-demo
npx remotion still src/index.ts ep06-context out.jpg --frame=200 --scale=0.4
```

## 制作流程（口播期）

1. 选题与一手资料：官方新闻稿、论文、机构文档优先；每个数字记来源。
2. 口播稿 → 录音 → 标准化到约 −16 LUFS、48 kHz 立体声 16-bit，存 `public/audio/<期>/voice.wav`。
3. 字幕 SRT → `npm run cues` 导入 `cues.json`。
4. 建期目录：`bash scripts/ep-dir.sh <作品ID> materials --new <风格目录> <中文短题>`。
5. 从最接近的样片改 `src/episodes/<期>/`，在 `src/Root.tsx` 注册，补测试。
6. 配乐：写 `audio/episodes/<期>.mjs` 段落表，`node audio/episodes/<期>.mjs`。
7. 单帧检查 → Studio 预览 → `npm run export -- <期>`。
8. 交付：MP4、3:4 封面、发布文案、字幕稿；需要时附 `stems/`。

无口播期数不走字幕，每期一个 `timeline.ts`：小节网格、重拍帧、中英字幕、镜头与音效表。

## 规格

- 横屏 16:9 1920×1080，或竖屏 3:4 1080×1440（像素贴纸/像素手绘）。
- 帧率与时长在 `src/Root.tsx` 的 Composition 里定；黑金/FPS/灯火样片约 2 分 18 秒。
- 音频：人声、配乐、音效分轨渲染，再用 `scripts/mix-stems.sh` 限幅重混，避免 Remotion 内部混音削波。
- 动画禁止 `Math.random()`、CSS 动画、真实时间；随机用 `rand(seed)`。

## 仓库里没有的内容（需要你自备）

| 路径 | 内容 | 影响 |
|---|---|---|
| `public/audio/<期>/voice.wav` | 口播录音 | 口播期无人声，配乐无法生成 |
| `public/footage/<期>/` | 真实照片/视频 | Vox、暖纸等期数的素材面板为空 |
| `public/images/ep04-opus55/` | 截图 | ep04 图片面板为空 |
| `public/music/*.mp3` | 有授权的配乐 | 无口播期没有声音；换成自己的曲子后用 `beats.py` 重测网格 |
| `template/`、`materials/`、`out/` | 参考视频、原始素材、成片 | 按需创建 |

配音与字幕在开源版里用作者的私人工具；每个工作流都有「依赖（开源版说明）」，换成任意 TTS / ASR 即可。

## 常见坑

- 字体：中文用 `public/fonts/ZCOOLKuaiLe-Regular.ttf`，缺 ✓ ✗ → 等符号，用 `Check` / `Cross` 图形。
- `Show` 的场景组件拿到的是全局帧号，不是 `Sequence` 内的相对帧；嵌视频必须传 `at`。
- `src/library/` 不能 import `src/episodes/`。
- `npm run audio` 全量跑会因缺人声期报错；只跑单期用 `node audio/episodes/<期>.mjs`。
