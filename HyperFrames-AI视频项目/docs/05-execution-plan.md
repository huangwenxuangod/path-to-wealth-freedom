# 05 - 执行计划

## Phase 1：方案确认

需要用户确认：

1. 时长：60 / 75 / 90 秒。
2. 动态风格：克制高级 / 工作流系统 / 科技冲击。
3. 是否加 BGM。
4. 是否加入 Three.js 轨道/粒子。
5. 旁白节奏：稳重 / 短视频感。

## Phase 2：脚本重写

输出：

- `docs/06-script.md`
- `app/src/data/script.ts`

要求：

- 短句。
- 每段匹配视觉动作。
- 每句都能对应一个 scene 或 motion。

## Phase 3：工程初始化

输出：

- `app/package.json`
- `app/tsconfig.json`
- `app/src/**`
- `app/public/index.html`

命令：

```powershell
cd app
bun install
bun run build
```

## Phase 4：动态 composition

输出：

- HTML composition。
- WAAPI 动画。
- 字幕层。
- 音频层。

检查：

```powershell
bun run preview
bun run snapshot
```

## Phase 5：音频与字幕

输出：

- `narration.wav`
- `captions.srt`
- `transcript.json`

优先：

- 使用 HyperFrames media TTS。

备选：

- 使用 `msedge-tts` 生成中文男声。

## Phase 6：渲染与质检

输出：

- MP4。
- SRT。
- 预览帧。
- report。

质检：

- 分辨率 1920x1080。
- 有音频。
- 字幕不遮挡主视觉。
- 动画不是静态翻页。
- 时间轴不截断旁白。

## Phase 7：Skill 封装

输出：

- `skill/SKILL.md`

目标：

把本流程封装为：

> 输入个人知识库和视频需求，生成动态个人介绍视频。

