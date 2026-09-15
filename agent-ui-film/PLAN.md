# Agent UI Film Implementation Plan

Goal: 完成已获 go 的六秒信息图，交付黑底 MP4 与透明 WebM。
Architecture: 单一 HTML composition；本地 GSAP 与资产；SVG 连线；由 HyperFrames CLI 渲染。
Tech Stack: HyperFrames 0.8.40 / GSAP 3.14.2 / Chromium / FFmpeg。

- [x] 保存 scaffold 原文件和哈希，检查基线。
- [x] 建立静态关键帧，制作资料卡片与裁切 Logo。
- [x] 按 DESIGN.md 加入可定位时间轴。
- [x] CLI check、定点截图及来回 seek 检查。
- [x] 渲染 WebM 和 MP4；检查解码、Alpha、关键帧。
- [x] 写入验证证据、差异与副本回滚脚本；打开预览。

Reusable prompt: 基于 DESIGN.md 保持字体、配色、结构，只替换指定资料内容、Logo 和时间点。先检查最完整画面，再修改暂停时间轴，最后重新检查并渲染。
