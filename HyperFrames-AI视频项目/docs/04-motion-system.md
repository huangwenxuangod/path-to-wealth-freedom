# 04 - 动效系统

## 动效原则

1. 所有动画都必须由时间 `t` 决定。
2. 所有动画都必须可被 HyperFrames seek。
3. 优先使用 transform 和 opacity。
4. 不使用依赖实时循环的动画。
5. 每个 scene 至少有 3 层动态：
   - 背景动态。
   - 主视觉动态。
   - 文本/字幕动态。

## 动效层级

### 背景层

- 网格缓慢位移。
- 微弱噪声。
- 数据点轻微漂移。
- 线条扫描。

### 主视觉层

- token 汇聚。
- pipeline 激活。
- 节点发光。
- 工具轨道。
- 数字计数。

### 信息层

- 关键词逐字/逐 token 出现。
- 字幕跟随段落节奏。
- CTA 收束。

## Scene 动效定义

### Identity

- 字符碎片聚合。
- 识别框扫描。
- 标签滑入。

### Scatter To Pipeline

- token 漂浮。
- token 被吸附到轨道。
- 轨道成型。

### Pipeline

- 节点按顺序激活。
- 连接线流动。
- 当前节点放大。

### Tool Orbit

- 工具绕中心旋转。
- 中心工作流节点稳定。
- 轨道线不规则脉冲。

### Accelerator

- 三个能力动词依次加速出现。
- 数据线速度变化。
- 背景点阵从散乱到结构化。

### Goal

- 数字计数到 100 万。
- 进度条走满。
- 时间刻度出现“毕业前”。

### CTA

- 所有线条收束。
- CTA 居中。
- 背景运动减弱，形成落点。

## 技术实现

第一版动态用 WAAPI：

```js
const animation = element.animate(keyframes, {
  duration,
  delay,
  easing,
  fill: "both",
  iterations: 1,
});
animation.pause();
```

如果加入 Three.js：

```js
window.addEventListener("hf-seek", (event) => {
  renderAt(event.detail.time);
});
```

## 验收标准

不能只看首帧。

必须抽查：

- 0s
- 10s
- 20s
- 40s
- 60s
- final

如果任意抽帧像静态 PPT，说明动效不够。

