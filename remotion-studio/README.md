# Remotion Studio

已于 2026-09-15 实现并实测。Bun + TypeScript + React + Tailwind CSS v4 + Remotion + 官方 GSAP；参考同级 HyperFrames 项目的黑底、荧光绿与资料卡片，移植 Magic UI Animated Beam 为视频帧驱动组件。

## 使用

```sh
bun install --frozen-lockfile
bun run studio
bun run typecheck
bun run check
bun run render:benchmark
bun run render:portrait
bun run render:overlay
bun run verify
```

Studio：http://localhost:3000/AgentWorkflow 。macOS 默认使用已安装的 Google Chrome；其他机器设置 `CHROME_PATH` 为 Chrome 可执行文件路径。媒体验收需要 ffmpeg 和 ffprobe。

## 制作入口

- `data/benchmark.json`：豆包工作流，横屏四节点。
- `data/demo.json`：通用 Agent，竖屏两节点。
- `src/spec.ts`：输入约束；支持 1–4 节点、横竖屏、30/60fps。
- `src/tokens.ts`：颜色、节奏和独立横竖构图。
- `src/AgentWorkflow.tsx`：8 秒主片；`src/BeamOverlay.tsx`：3 秒透明层。
- `.agents/skills/ai-motion-director/SKILL.md`：Codex 项目制作规则。

官方 `remotion@openai-api-curated` 插件已安装启用。Remotion 包统一 4.0.524；依赖版本由 bun.lock 固定。Magic UI 使用源码移植；Motion/Aceternity/React Bits 按具体镜头选择，未整体安装。GSAP 使用官方 useGsapTimeline；网页壁钟动画需适配视频时间。

## 成片与验收

- `renders/agent-workflow.mp4`：1920×1080，30fps，8 秒。
- `renders/agent-workflow-portrait.mp4`：1080×1920，30fps，8 秒。
- `renders/beam-overlay.mov`：ProRes 4444，透明，3 秒；`renders/beam-png/`：90 张 RGBA PNG。

27 项输入/资产/版本检查、TypeScript 检查通过。乱序取帧一致，30/60fps 同时刻像素一致；三视频完整解码、尺寸时长与 alpha 验证通过。Studio 播放、同一画布往返寻帧与错误状态已检查；按用户确认恢复根画布原位。剪映导入未实测。未提交或推送。

详见 [验收记录](VERIFICATION.txt)、[研究方案](docs/RESEARCH_AND_PLAN.md)、[来源](docs/SOURCES.md)、[设计规则](DESIGN.md)、[素材许可](THIRD_PARTY.md)。研究方案保留实施前快照，运行状态以本文与验收记录为准。

## 给 Codex 的复用请求

```text
在 remotion-studio 读取 AGENTS.md、DESIGN.md 和 ai-motion-director skill，
基于 benchmark.json 换成我的文案和素材，保持统一的视频帧时间。
制作横竖屏和透明层，完成类型、输入、乱序寻帧、媒体与视觉验收，交付视频和证据。
```

ROLLBACK.sh 仅将原始文档快照恢复到一个新目录，并校验原哈希；当前工程和全局插件保持现状。

## Astra6 总分总动画

新增 `AstraOverview`：36 秒、1920×1080、30fps，冷白工作台视觉，包含总述、软件操作、工程执行、专业交付、总结。四个 Magic UI 组件源码已接入，视频版按 frame/fps 驱动。

```sh
bun run check:astra
bun run render:astra
bun run verify:astra
```

输入：`data/astra6.json`。输出：`renders/astra6-overview.mp4`。设计：`docs/ASTRA6_DESIGN.md`，事实和素材：`docs/ASTRA6_SOURCES.md` 与 `public/astra6/assets.json`，组件来源：`docs/MAGIC_UI.md`。素材中的 OpenAI 标识来自官方 GitHub 组织；软件和文档画面为明确标注的原创流程示意。无配音。
