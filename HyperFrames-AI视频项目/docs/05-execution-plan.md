# 05 - 执行计划

## Phase 1：方案确认

需要用户确认：

1. 时长：60 / 75 / 90 秒。
2. 主题：介绍自己 / 展示能力 / 表达方法 / 验证流程。
3. 比例：16:9 / 9:16 / 1:1。
4. 出镜方式：不露脸 / 局部素材 / 纯动态。
5. 旁白风格：自然年轻 / 稳重克制 / 短视频节奏。
6. 是否需要 BGM。
7. 结尾 CTA。

补充原则：

- 用户一旦已经明确要动态高级感，默认不走“科技冲击风”。
- 默认先按“工作流系统片 + Swiss 极简高级风”推进。

## Phase 2：脚本重写与内容提炼

输出：

- `docs/06-script.md`
- `app/src/data/script.ts`

要求：

- 短句。
- 每段匹配视觉动作。
- 每句都能对应一个 scene 或 motion。
- 每句都能归类为：身份 / 观点 / 流程 / 系统 / 能力 / 目标 / CTA。

## Phase 3：视觉与镜头方案

先写方案，再写代码。

必须先确定：

1. 每个镜头的核心信息
2. 每个镜头的结构类型
3. 是否使用系统图 / 流程图 / 面板 / 目标计数
4. 标题断行方式
5. accent 色和层级规则

当前默认镜头结构：

1. 身份识别
2. 工具不是收藏夹
3. 流程展开
4. 系统面板
5. 能力加速器
6. 目标验证
7. CTA 收尾

## Phase 4：工程实现

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

## Phase 5：动态 composition

输出：

- HTML composition。
- WAAPI 动画。
- 字幕层。
- 音频层。

检查：

```powershell
bun run build
npx --yes hyperframes@0.6.2 lint
```

## Phase 6：音频与字幕

输出：

- `narration.wav`
- `captions.srt`
- `transcript.json`

优先：

- 使用 HyperFrames media TTS。

备选：

- 使用 `msedge-tts` 生成中文男声。

## Phase 7：渲染与质检

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
- 至少抽查 2 到 3 个关键帧。
- 重点观察是否仍有 PPT 感、廉价漂浮感、中文标题断裂感。

建议命令：

```powershell
npx --yes hyperframes@0.6.2 validate
npx --yes hyperframes@0.6.2 render --output output/wenxuan-dynamic.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of json output/wenxuan-dynamic.mp4
```

## Phase 8：经验回写与 Skill 封装

输出：

- `docs/06-production-standard.md`
- `skill/SKILL.md`

目标：

把本流程封装为：

> 输入个人知识库和视频需求，生成动态个人介绍视频。

要求：

- 每次做对的东西必须回写文档
- 每次发现新的廉价感来源，也必须回写文档
