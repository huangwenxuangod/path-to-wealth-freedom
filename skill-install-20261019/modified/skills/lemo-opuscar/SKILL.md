---
name: lemo-opuscar
description: 用代码导演并制作短片：51 种电影风格（油画厚涂、水彩、浮世绘、卫星简报、产品拆解、显微叙事、瑞士动态排版、Risograph、像素 RPG、玻璃产品渲染等），从 brief、treatment、风格帧、分镜到配音、配乐、混音与渲染。用户说「做一支短片/宣传片/科普片」「用某种画风」「lemo-opuscar」「代码做电影」时使用。
---

# Lemo-Opuscar（代码电影风格库）

每种风格有固定的 `STYLE.md`（外观、色彩、字体、运动、镜头语法、声音调色板）和一支完全由代码制作的示范片。你的工作是：保留风格不变量，围绕用户自己的主题重新导演。

来源：https://github.com/lemomo-ai/lemo-opuscar （MIT）。完整风格库已随本 skill 放在 `assets/library/`（51 个 `STYLE.md`、`core/` 工具、字体与材质资源；示范片源码与海报按上游稀疏克隆约定未包含）。

## 安装（Windows）

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\37453\.codex\skills\lemo-opuscar\scripts\setup.ps1"
```

脚本把内置库复制到 `%USERPROFILE%\lemo-opuscar`（已存在则保留），然后 `npm install`、安装 Playwright 的 headless Chromium、用 `uv` 建 Python 3.12 venv 并装核心依赖。耗时几分钟。

之后设置：

```powershell
$env:LEMO_OPUSCAR_HOME = "$env:USERPROFILE\lemo-opuscar"
```

也可用上游脚本（需要 git）：`sh scripts/setup.sh deps`。

## 目录

```
<skill>/
  assets/library/            完整风格库（AGENTS.md、DIRECTOR.md、TECHNIQUE.md、core/、styles/）
  references/                上游指南副本（便于先读）
  scripts/setup.ps1          Windows 安装
  scripts/setup.sh           上游安装脚本
```

## 工作流

1. **Brief**：确认风格与主题；一次性问清无法自行决定的事实、必须出现的名称/标志、是否有自己的配音/音乐/照片/字体、影片语言、是否要先看分镜。缺什么就用合理默认值补齐，不要反复追问。
2. **Treatment**：先写项目文件夹里的 `TREATMENT.md`：三种候选结构 + 选择理由。**在打开示范片之前写**。
3. **Look**：用真实绘制代码渲染风格帧或模型表，对照 `STYLE.md` 检查。
4. **分镜**：仅当用户要求时输出并停下等待确认。
5. **制作**：配音 → 检查 → 配乐（可并行）→ 动画 → 混音 → 渲染。
6. **自检与交付**：按 `DIRECTOR.md` §11 交付，告诉用户项目文件夹位置。

## 风格选择

51 种风格分 10 类：实证影像（卫星简报、工程简报板、点云测绘、白模投影、数据实物化、产品拆解、显微叙事、档案灯台）、手绘与绘画（蜡笔、水彩、水墨、油画厚涂、一笔画、白板、钢笔淡彩）、东方传统（皮影、浮世绘、窗花剪纸、纸雕灯影）、印刷与版画（Risograph、半调案卷、木刻、铜版、丝印海报）、图形与排版（瑞士动态排版、60s 间谍片头、Art Deco、蓝图、彩色玻璃、象形运动、ASCII/CRT）、信息与发布（数据叙事、等距信息图、暗色科技发布、实机录屏、科幻 HUD）、卡通与动画（橡皮管、80s 赛璐璐、科幻情景喜剧、50s 扁平）、游戏（16-bit RPG、HD-2D、微游戏、综艺节奏）、电影与时代（1920s 默片、后室）、材质与 3D（积木、立体书、移轴、低多边形、玻璃产品）。

用户没选风格时：给 2–3 个匹配主题的候选，用用户的语言列出完整风格名，并给画廊链接 https://lemomo-ai.github.io/lemo-opuscar/ 。

## 关键规则

- `STYLE.md` 不可改；故事、角色、镜头、时长、图表都由你按用户主题重新导演。
- 示范片只用来学技法（笔刷、绑定、shader、混音），不搬它的故事、镜头、道具、时间线。
- 不在 `styles/` 里改；把需要的代码复制进项目文件夹。
- 运行工具时 `cd "$LIB"`，项目路径用绝对路径。
- 用户自己的片子不加 LemoLab 署名与水印。
- 不杀不是自己启动的进程，不留后台进程。

## 常见坑

- Windows 上 `setup.sh` 依赖 sh/git；优先用 `setup.ps1`。
- `kokoro-onnx` 需要 Python < 3.14；用 3.12 venv。
- 首次 `deps` 会下载 Chromium 与 Python 包，几分钟；不要在中途重复启动。
- 风格帧不对就先改 look，不要进入整片渲染。
