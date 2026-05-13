# 00 - HyperFrames 调研

更新时间：2026-05-13

## 官方来源

- GitHub：https://github.com/heygen-com/hyperframes
- Introduction：https://hyperframes.heygen.com/introduction
- CLI package：https://www.npmjs.com/package/hyperframes
- HeyGen help：https://help.heygen.com/en/articles/15001510-hyperframes-heygen

## 项目定位

HyperFrames 是一个 HTML-to-video 框架，核心不是“剪辑”，而是“用 HTML/CSS/JS 描述视频，再由浏览器逐帧渲染并编码成 MP4”。

适合场景：

- AI Agent 生成视频。
- 产品演示视频。
- 动态数据可视化。
- 不露脸的个人 IP 视频。
- 将文字、流程、图表、工具链变成动画。

不适合场景：

- 传统剪辑时间线。
- 大量真人素材精剪。
- 依赖手动拖拽编辑的项目。

## CLI 情况

npm 包：

```text
hyperframes@0.5.7
bin: hyperframes
description: HyperFrames CLI — create, preview, and render HTML video compositions
```

常用命令：

```powershell
npx hyperframes init my-video --example blank
npx hyperframes preview
npx hyperframes lint
npx hyperframes inspect
npx hyperframes snapshot
npx hyperframes render --output output.mp4
```

## Skills 调研

执行过：

```powershell
npx skills add heygen-com/hyperframes
```

本地实际安装到项目 `.agents/skills/` 的 skills：

```text
contribute-catalog
hyperframes-media
remotion-to-hyperframes
three
waapi
```

其中本项目会使用：

- `hyperframes-media`：TTS、转写、字幕、背景移除。
- `waapi`：Web Animations API，适合可 seek 的 DOM 动画。
- `three`：如果需要 3D 粒子、轨道、空间感。

不使用：

- `remotion-to-hyperframes`：用户已要求删除 remotion demo，不做 Remotion 迁移。
- `contribute-catalog`：贡献 skill 目录，与当前视频无关。

## 渲染关键约束

HyperFrames 的动画必须能被 seek。

错误方式：

- 依赖 `requestAnimationFrame`。
- 依赖 `Date.now()`。
- 依赖 `performance.now()`。
- 依赖用户交互触发画面变化。
- 依赖不可控异步加载。

正确方式：

- WAAPI：`element.animate()` + finite duration + `fill: "both"`。
- GSAP：paused timeline，注册给 HyperFrames runtime。
- Three.js：监听 `hf-seek`，用当前时间直接计算画面。
- CSS transform/opacity 为主，少动 layout。

## 结论

本项目 V2 应采用：

- HTML/CSS/JS composition。
- TypeScript 生成 HTML 和动画脚本。
- WAAPI 作为主要动画方式。
- Three.js 只作为增强，不作为第一版必要项。
- TTS 与字幕进入统一 pipeline。

