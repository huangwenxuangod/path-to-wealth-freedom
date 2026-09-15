# Hyper Studio

HyperFrames 多视频创作工作台。每条视频独立存放，复用工具链和制作流程。

## 作品

- [全部了解 · Agent UI Film](videos/agent-ui-film/README.md)：6 秒，1920×1080，30fps，静音；黑底 MP4、透明 WebM 与 ProRes MOV。

- [Studio Pilot · 从素材到成片](videos/studio-pilot/README.md)：12 秒，1920×1080，30fps；Tailwind v4 + GSAP，含本地音效。

## 技术

原生 HTML + SVG + GSAP；HyperFrames 0.8.40 负责预览和渲染。旧 agent-ui-film 使用手写 CSS；新 studio-pilot 使用 Tailwind 4.2.4 编译静态 CSS，配合少量自定义样式。动画统一交给 GSAP 暂停时间轴。

## 运行

以下命令在 hyper-studio 目录执行，必须显式指定作品：

```sh
npm run dev -- videos/agent-ui-film --background --port 3026
npm run check -- videos/agent-ui-film
npm run render -- videos/agent-ui-film --output videos/agent-ui-film/renders/review.mp4 --workers 1
```

旧作品的完整透明输出流程：在 videos/agent-ui-film 目录执行 `sh render.sh`。它仅适用于该六秒作品，不作为新片通用脚本。

## 新建视频

在本目录用固定版本官方初始化命令创建 `videos/<新作品名>`，例如 `npx --yes hyperframes@0.8.40 init videos/product-demo --non-interactive --tailwind`。先确定该作品的 DESIGN.md，再创作；给出独立名称、时间轴、素材、输出文件。保留每条作品的固定版本 package.json，新作品使用自己的时长和画幅。

可复用任务描述：

> 在 hyper-studio/videos 下创建独立的新视频工程。先确定主题、时长、画幅与视觉规范；复用 HyperFrames 0.8.40、Tailwind v4 静态 CSS/SVG/GSAP 流程，素材按需复制。检查中文字形、布局、动画和实际成片，输出到新作品自己的 renders 目录。

## 迁移记录

原 agent-ui-film 已整理到 videos/agent-ui-film。旧作品源码、素材、输出及历史证据保留；历史记录里的旧路径描述当时状态。工作台迁移证据见 evidence/migration 与 VERIFICATION.txt。ROLLBACK.sh 可对指定工作区副本恢复迁移前目录；它拒绝覆盖已存在的 agent-ui-film。

新片执行自身 `npm run check`，先编译 Tailwind 再检查。根目录通用 check 不会替作品构建 CSS。制作步骤和效果选型见 [Pilot 复用说明](videos/studio-pilot/README.md)。
