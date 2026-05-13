# 03 - 工程架构

## 技术栈

- Bun：包管理与脚本执行。
- TypeScript：所有构建脚本和数据定义。
- HyperFrames：HTML composition 预览和渲染。
- WAAPI：主要动画系统。
- FFmpeg：编码、音频处理、预览帧。
- msedge-tts 或 HyperFrames media TTS：旁白生成。

## 为什么不用 Remotion

用户已经明确要求删除 remotion demo。

本项目目标是 HyperFrames 原生能力验证，不做 Remotion 迁移，不做 Remotion 对照。

## 为什么不用 PNG 合成

PNG 合成无法表达真实动态系统，只适合快速产出“会动的 PPT”。

V2 必须使用浏览器渲染动态 DOM，而不是图片序列拼接静态页。

## 模块职责

### `src/data/`

保存稳定输入：

- 人设。
- 口播脚本。
- 时间轴。
- 工具名。
- 视觉 token。

### `src/composition/`

生成 HyperFrames composition：

- HTML。
- CSS。
- scene DOM。
- motion JS。

### `src/pipeline/`

执行流水线：

- build。
- tts。
- captions。
- preview。
- render。

## 统一命令

```powershell
bun run build      # 生成 public/index.html
bun run tts        # 生成 narration.wav
bun run captions   # 生成字幕
bun run preview    # HyperFrames 本地预览
bun run render     # 渲染 MP4
bun run all        # 完整流水线
```

## 输出标准

每次正式生成必须输出：

```text
output/
├── wenxuan-intro-dynamic.mp4
├── wenxuan-intro-dynamic.srt
├── previews/
│   ├── preview-00s.png
│   ├── preview-20s.png
│   ├── preview-40s.png
│   └── preview-final.png
└── report.md
```

`report.md` 必须说明：

- 分辨率。
- 时长。
- 是否有音频。
- 是否有字幕。
- 使用的 TTS 声音。
- 使用的动画机制。
- 已知问题。

