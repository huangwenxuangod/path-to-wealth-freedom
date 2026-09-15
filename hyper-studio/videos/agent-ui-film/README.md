# 全部了解 · HyperFrames UI 动画样片

6 秒 / 1920×1080 / 30fps / 静音。

- `renders/agent-ui-preview.mp4`：黑底预览，直接播放。
- `renders/agent-ui-transparent.webm`：VP9 + Alpha，小体积透明素材。
- `renders/agent-ui-alpha.mov`：ProRes 4444 + Alpha，剪辑中间格式。
- `index.html`：HyperFrames 主工程。
- `DESIGN.md`：视觉与运动规范。
- `render.sh`：在当前 macOS 环境重新渲染，需 Node >=22、Chrome、FFmpeg。

## 预览

运行 `npx --yes hyperframes@0.8.40 preview --background --port 3026`。
Studio： http://localhost:3026/#project/agent-ui-film

## 素材

Logo 裁切自用户提供截图；其余资料是自制的示意 UI，不是实际产品录屏。中文使用本机 PingFang 的字形子集；英文数字为本地 JetBrains Mono 子集。GSAP 3.14.2 已存入 assets；全部视觉资源无需运行时网络请求。

## 合成

透明素材针对深色背景设计；不应直接叠加浅色背景。没有添加配音、音乐与字幕，可在剪映中自行拼接。Alpha 已解码验证，剪映实际导入尚未测试。

## 修改

遵循 DESIGN.md；按 index.html 的时间点替换素材与文字。新增中文后需要更新字体子集。修改后运行 npm run check，并检查截图、跳转一致性和实际渲染帧。

## 核验与回滚

VERIFICATION.txt 记录命令、结果、哈希、输出路径。ROLLBACK.sh 只恢复指定测试副本至初始静态模板，不覆盖交付工程。
