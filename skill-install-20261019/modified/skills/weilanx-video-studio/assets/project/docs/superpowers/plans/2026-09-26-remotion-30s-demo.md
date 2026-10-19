# 30 秒手绘风剪辑 Demo 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Remotion 渲染出 30 秒、1920×1080、30fps、带代码合成配乐的手绘风剪辑软件 demo（`out/demo.mp4`）。

**Architecture:** 1920×1080 的「世界坐标」里摆放编辑器 UI，`Camera` 用 transform 做推拉摇移。纯函数 `getEditorState(frame)` 算出每帧 UI 状态，组件只负责展示。所有关键帧号都放在 `src/lib/timeline.ts`，画面和 `audio/synth.mjs` 共用。

**Tech Stack:** Remotion 4、React 19、TypeScript、@remotion/google-fonts、vitest、Node 原生 wav 写出、ffmpeg。

## Global Constraints

- 输出：1920×1080，30fps，900 帧（30.0s），H.264 + AAC
- 不使用外部音频、图片素材；字体只用 Google Fonts 开源字体
- 画风：米白底 `#F4EFE3`，描边 `#2B2320`、3px，橙色角色 `#D9804F`，teal `#2E9C8F`，黄 `#F2C230`
- 落款文字："made in 30 seconds by" / "Claude" / "— signing off ✦"
- 浏览器调试只用 playwright-cli 无头模式

## 文件结构

```
package.json, tsconfig.json, remotion.config.ts, vitest.config.ts
src/index.ts                 registerRoot
src/Root.tsx                 Composition "Demo"
src/Demo.tsx                 组装：Camera(EditorUI + Buddy + 特效) + Outro + 音频
src/theme.ts                 颜色/字体/描边
src/lib/timeline.ts          关键帧号 T、时间轴几何、片段定义
src/lib/anim.ts              ease/clamp/lerp/wobble/seeded random
src/lib/state.ts             getEditorState(frame): EditorState
src/lib/camera.ts            getCamera(frame): {x,y,scale,rot}
src/lib/buddy.ts             getBuddy(frame): BuddyPose
src/components/*.tsx         纯展示组件
audio/synth.mjs              生成 public/audio/*.wav（同时导出纯函数便于测试）
tests/*.test.ts              vitest
```

---

### Task 1：项目脚手架 + timeline/anim 基础

**Files:** Create `package.json`、`tsconfig.json`、`remotion.config.ts`、`vitest.config.ts`、`src/index.ts`、`src/Root.tsx`、`src/theme.ts`、`src/lib/anim.ts`、`src/lib/timeline.ts`、`tests/anim.test.ts`

**Interfaces（Produces）：**
- `anim.ts`: `clamp01(x)`, `lerp(a,b,t)`, `easeInOut(t)`, `easeOutBack(t)`, `prog(frame, start, dur, ease?)` → 0..1, `keyframes(frame, [[f,v],...], ease?)` → number, `rand(seed)` → 0..1（确定性）
- `timeline.ts`: `FPS=30`, `DURATION=900`, `T`（所有事件帧号，秒×30）, `timeToX(sec)`（时间轴像素：0s→145，105px/s）, `CLIPS`（id、颜色、起止秒）

- [ ] 写 `tests/anim.test.ts`：`prog` 在 start 前为 0、结束后为 1；`keyframes` 在节点处返回精确值；`rand` 同 seed 同值
- [ ] `npx vitest run` 失败 → 实现 → 通过
- [ ] `npx remotion compositions src/index.ts` 能列出 `Demo 1920x1080 30fps 900`
- [ ] Commit

### Task 2：音频合成

**Files:** Create `audio/synth.mjs`、`tests/synth.test.ts`

**Interfaces：** `export function encodeWav(float32, sampleRate): Buffer`；`export function renderBgm(): Float32Array`（30s，44100Hz）；`export function renderSfx(name): Float32Array`；CLI 运行写出 `public/audio/bgm.wav` 和 `public/audio/sfx/{snip,whoosh,pop,ding,shake,confetti}.wav`

- [ ] 测试：wav 头为 `RIFF`/`WAVE`，数据长度 = 样本数×2；`renderBgm()` 长度 = 30×44100，峰值 ≤ 1 且 > 0.1；每个 sfx 非空且峰值 ≤ 1
- [ ] 实现：Karplus-Strong 拨弦（C–Am–F–G，110BPM）、三角波 bass、kick/hat/snap、16–18s 半音上行、28.5s 后淡出、多抽头延迟混响、软限幅
- [ ] 运行 `node audio/synth.mjs`，用 ffprobe 检查时长
- [ ] Commit

### Task 3：状态机 getEditorState / getCamera / getBuddy

**Files:** Create `src/lib/state.ts`、`src/lib/camera.ts`、`src/lib/buddy.ts`、`tests/state.test.ts`

**Interfaces：**
```ts
type Tab = 'media'|'transitions'|'text';
type PhoneScene = 'empty'|'sunrise'|'coffee'|'cat'|'dance'|'buffering';
interface ClipView { id: string; x: number; y: number; w: number; rot: number; visible: boolean; }
interface EditorState {
  timecode: string; tab: Tab; phone: PhoneScene; phoneShake: number;
  clips: ClipView[]; audioTrack: number /*0..1 出现进度*/; playheadX: number;
  boringLabel: number; spinIcon: {x:number;y:number;placed:boolean;visible:boolean};
  textClip: number /*0..1*/; caption: string; sliders: {sparkle:number;shake:number;zoom:number;speed:number};
  shakeMax: boolean; exportProgress: number; done: boolean; keyMarkers: number; uiFade: number;
}
interface BuddyPose { x:number; y:number; scale:number; rot:number; walk:number; eyes:'open'|'happy'|'closed'|'wide'|'flat'; arm: null|{tx:number;ty:number}; scissors:number; bubble: string|null; bubbleT:number; squash:number; flip:boolean; }
```
- [ ] 测试：frame 0 `phone==='empty'`、tab 'media'；SNIP 之后 gray clip 不可见且 cat clip x 左移 3 秒宽；17s 时 `shakeMax`；23.5s `exportProgress===1`；timecode 格式 `00:00:SS:FF`
- [ ] 实现并通过
- [ ] Commit

### Task 4：UI 组件

**Files:** Create `src/components/{EditorUI,MediaPanel,PhonePreview,PhoneScenes,Timeline,AdjustPanel,Thumb}.tsx`

- [ ] 按参考帧坐标绘制：窗口 45..1875×22..1045；标题栏；Media 面板 65..428×107..612；手机 818..1100×108..607；Adjust 1493..1855×107..612；时间轴面板 65..1855×622..1037（刻度、T/▶/♪ 按钮、三条轨道、播放头）
- [ ] 手机场景 sunrise/coffee/cat/dance/buffering/empty，可接受 `t` 做内部小动画
- [ ] 在 Root 里临时渲染几帧 `npx remotion still` 检查
- [ ] Commit

### Task 5：角色 + 镜头 + 特效

**Files:** Create `src/components/{Buddy,Camera,SpeechBubble,PopText,Confetti,Outro}.tsx`

- [ ] Buddy：矩形身体 + 左右小方块 + 4 条腿（走路时交替抬起）+ 眼睛表情 + 可伸长手臂（从身体右上角伸到目标点）+ 剪刀
- [ ] PopText：SNIP!/SHAKE: MAX（Luckiest Guy，黄/红填充 + 深描边，弹出 easeOutBack）
- [ ] Outro：UI 淡化，手机放大居中循环片段 + "WAIT FOR IT"→"NAILED IT!"、心形计数、落款手写字、彩纸
- [ ] Commit

### Task 6：组装、渲染、验证

**Files:** Create `src/Demo.tsx`；Modify `src/Root.tsx`

- [ ] Demo：`<Camera>` 包 `EditorUI + Buddy + PopText`；`<Audio src=bgm>`；每个 sfx 按 `T` 放 `<Sequence from>`
- [ ] `npx remotion render Demo out/demo.mp4`
- [ ] ffprobe 核对 1920×1080/30fps/30s/有音轨
- [ ] 每秒抽帧拼 contact sheet，和参考片 sheet 对比，逐段修正
- [ ] Commit
