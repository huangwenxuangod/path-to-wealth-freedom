# Remotion Studio

本项目使用 Bun、React、TypeScript、Tailwind v4、Remotion 及官方 @remotion/gsap。

- 先读取 DESIGN.md、src/spec.ts 和已有 Composition；使用项目 ai-motion-director 与官方 Remotion skills。
- 所有时间来自 Remotion frame/fps；GSAP 使用 useGsapTimeline，禁止独立 ticker、回调、随机壁钟、未支持的 plugins。
- 一个 DOM 属性只由一个动画系统控制。保持布局坐标与连线端点同源。
- 字体和资产本地化，保留许可及来源；不复制系统字体做分发。
- data/ 是可修改的视频输入，src/spec.ts 是运行时边界。主题、画布、时长由 schema 和 metadata 共同约束。
- Studio 编辑会写回源码；保留用户改动，避免覆盖已成功的成片。
- `bun run typecheck`、`bun run check`、对应 render preset、`bun run verify` 通过后再宣布交付。
- 默认使用本机 Chrome；跨机通过 CHROME_PATH 指定浏览器路径。
- 不提交或推送，除非用户明确要求；不要修改平级 HyperFrames 工程。

## 新视频的设计与素材

- 每条新视频先用 frontend-design 根据主题、受众和内容设计；旧片的黑底、荧光绿和大字不是全工程默认。
- Magic UI 按官方 registry 管理组件源码及实际依赖，并在镜头中真实使用；视频动画改为 frame/fps 驱动，记录来源、许可和改编。
- 主动上网查证事实、寻找官方 Logo 与素材，本地保存并记录来源 URL、时间、SHA256 与使用条件；原创示意和官方实录分开标注。
