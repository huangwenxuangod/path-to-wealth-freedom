# 30 秒手绘风剪辑软件 Demo 复刻 — 设计文档

日期：2026-09-26
参考视频：`owdhLk1tL-zDMuO2.mp4`（30s，1920×1080，30fps）

## 1. 目标

用纯代码复刻参考视频：手绘风剪辑软件 UI 里，一个橙色方块小人（BoxBuddy）独自完成剪辑、加转场、加字幕、调特效、导出，最后拉远落款。背景音乐与音效全部由代码合成。

这条 demo 同时用来验证画风和组件，后续会扩展成「Agent 整理桌面」口播视频（4.5 分钟），所以组件要能复用。

**成功标准**
- 输出 `out/demo.mp4`：1920×1080，30fps，时长 30.0s，H.264 + AAC
- 分镜节奏、镜头运动、主要动作与参考视频逐段对应（见第 4 节）
- 画风：米白底、深色粗描边（约 3px）、扁平色块、圆角，整体接近参考片
- 音频：BGM + 音效，不使用任何外部音频素材，关键动作落在拍点上

**不做**：一模一样的像素级还原；任何外部版权素材（音乐、字体、图片）。

## 2. 技术栈

- **Remotion**（React + TypeScript），用 `@remotion/cli` 渲染
- 所有图形用 SVG/CSS 手写，不使用图片素材
- 字体：本地/Google 开源手写风字体（如 `Patrick Hand`、`Caveat`），通过 `@remotion/google-fonts` 加载
- 音频：Node 脚本 `audio/synth.mjs` 做纯数学合成，写出 16-bit 44.1kHz wav，不依赖第三方音频库
- 验证：ffmpeg 抽帧 + 拼接对比图

## 3. 代码结构

```
src/
  Root.tsx              注册 Composition（1920×1080, 30fps, 900 帧）
  Demo.tsx              总时间线：Camera 包住 EditorUI + BoxBuddy，按 Sequence 排场景
  theme.ts              颜色、描边宽度、圆角、字体
  lib/
    anim.ts             spring/interpolate 封装、easing、wobble（手绘抖动）
    timeline.ts         全部关键时间点（帧号）的唯一来源，画面和音频共用
  components/
    EditorUI.tsx        窗口框架：标题栏（文件名、时间码、1080p、EXPORT）
    MediaPanel.tsx      左侧面板：Media / Transitions / Text 三个 tab 及各自图标网格
    PhonePreview.tsx    中间手机预览，根据当前片段渲染内容
    clips/              4 个片段画面：Sunrise、Coffee、Cat、DanceBox
    Timeline.tsx        刻度尺、播放头、视频轨（片段块）、字幕轨、音频波形轨
    AdjustPanel.tsx     右侧 Adjust：Sparkle / Shake / Zoom punch / Speed 滑杆
    BoxBuddy.tsx        角色：身体、眼睛（眨眼/眯眼）、腿（走路循环）、手臂（伸长拉拽）
    SpeechBubble.tsx    气泡台词
    Camera.tsx          镜头层：按关键帧插值 x/y/scale
    PopText.tsx         SNIP! / SHAKE: MAX / 逐字弹出字幕
    Confetti.tsx        彩纸粒子（确定性随机种子）
  scenes/               每段分镜一个文件，只负责驱动状态和镜头
audio/
  synth.mjs             生成 public/audio/bgm.wav 和 public/audio/sfx/*.wav
```

**状态驱动方式**：`Demo.tsx` 根据当前帧计算一个 `EditorState`（时间轴上有哪些片段、当前 tab、滑杆数值、手机里显示什么、导出进度等），把它传给各 UI 组件。组件本身是纯展示，不持有时间逻辑，方便后续口播版复用。

## 4. 分镜（按参考视频逐秒对齐）

| 时间 | 画面 | 镜头 |
|---|---|---|
| 0–1s | 空编辑器全景，手机显示 "add some media"，时间轴显示 "drop clips here"；小人从左侧走入 | 全景 |
| 1–3s | 小人把粉色片段（Coffee）拖进时间轴，手机依次出现 Sunrise；片段陆续落位 | 缓推近到时间轴 |
| 3–4s | 时间轴上排好 4 段片段，播放头走动 | 跟随小人 |
| 4–5s | 小人举剪刀，中间一段灰色片段标着 "the boring part zzz"，手机显示 "buffering…" | 推近 |
| 5–6s | SNIP! 弹出，灰色片段被剪掉，后面的片段左移合拢 | 轻微震屏 |
| 6–8s | 小人眯眼满意，气泡 "much cleaner." | 保持 |
| 8–10s | 切到 Transitions tab（Whoosh / Spin / Glitch / Zoom / Slide / Fade），小人拖一个 Spin 图标放到片段交界处；手机里 Coffee → Sunrise | 平移到左侧面板 |
| 10–11s | 小人被绊倒翻滚后爬起（喜剧节拍） | 跟随 |
| 12–15s | 切到 Text tab（Pop / Bubble / Neon），手机显示猫；"WAIT FOR IT" 逐字弹出，字幕轨出现黄色字幕块 | 平移到中间 |
| 16–17s | 小人伸长手臂把 Adjust 里的 Shake 滑杆一路拉到 MAX，滑杆变红，手机画面疯狂抖动，"SHAKE: MAX" 弹出 | 平移到右侧 |
| 18s | 滑杆被拉回 5%，气泡 "…nobody saw that." | 保持 |
| 19–21s | 回放：镜头沿时间轴平移，手机依次显示 Sunrise、Coffee、Cat，时间轴下方出现关键帧三角标记 | 横向平移 |
| 22–23s | 小人伸长手臂拉 EXPORT，进度条跑满，手机上显示 100%，按钮变 DONE | 拉远到全景 |
| 24–30s | 编辑器 UI 淡成浅色背景；手机居中放大，循环播放成片并叠加 "WAIT FOR IT" → "NAILED IT!"；左侧手写体 "made in 30 seconds by" + 大字 "Claude" + "— signing off ✦"；小人站在手机旁，彩纸飘落 | 定格 |

所有时间点集中写在 `lib/timeline.ts`，画面与音效都从这里取值。

## 5. 音频设计

**BGM**（`bgm.wav`，30s）
- 120 BPM（一拍 = 0.5s = 15 帧，方便动作卡拍），C 大调，4 小节和弦循环 C–Am–F–G
- 音色：拨弦（Karplus-Strong 合成，接近尤克里里）弹主和弦；三角波贝斯；噪声 + 包络做轻鼓点（kick/hat/snap）
- 结构：0–4s 只有拨弦，4s 起加鼓，16–18s（SHAKE 段）加一小节紧张的半音上行，24s 起进入收尾段，最后一拍收掉
- 全局低通 + 简单混响（多抽头延迟）让音色更柔和
- 音量控制在 −16 LUFS 左右，给音效留空间

**音效**（`sfx/*.wav`，在 Remotion 里用 `<Audio>` 按帧放置）
- `snip`：两下短促高频噪声脉冲（剪刀咔嚓）
- `whoosh`：带通噪声扫频（转场、镜头快速平移）
- `pop`：短正弦下滑（片段落位、文字逐字弹出）
- `ding`：高音铃（导出完成）
- `shake`：低频颤音噪声（SHAKE: MAX）
- `confetti`：多个随机短 pop 叠加（结尾彩纸）

## 6. 渲染与验证

1. `node audio/synth.mjs` 生成音频
2. `npx remotion render Demo out/demo.mp4`
3. ffprobe 核对时长、分辨率、帧率、音轨
4. 每秒抽一帧拼成 contact sheet，和参考视频的 contact sheet 并排对比，逐段检查构图、动作和镜头
5. 开发过程中用 Remotion Studio 预览；如需浏览器调试，使用 playwright-cli 无头模式

**风险与对策**
- Remotion 首次渲染要下载 headless Chrome：失败时可指定本地浏览器路径
- 角色动画显得僵硬：给身体加 squash & stretch，走路加上下起伏，眨眼加随机间隔（固定种子）
- 合成音色太「电子」：拨弦用 Karplus-Strong，加低通和混响来柔化
