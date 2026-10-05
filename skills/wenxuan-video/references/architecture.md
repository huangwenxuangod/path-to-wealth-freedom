# 技术选择和工程结构

## 时间契约

Remotion 的根本是 `image = f(frame, props, assets)`。`t = frame/fps`；场景在 Sequence 内时 useCurrentFrame 返回局部帧。相机、动画、字幕、音频都由同一时间轴推导。寻到第 150 帧应与连续播放到第 150 帧相同。

```tsx
const frame = useCurrentFrame();
const {fps} = useVideoConfig();
const u = Math.max(0, Math.min(1, (frame/fps-start)/(end-start)));
const eased = u*u*(3-2*u);
```

不要用 Date.now、无种子的 Math.random、实时 RAF、CSS 自动播放或物理逐帧累积作为输出时钟。GSAP 若确有复杂编排需求，应暂停时间轴并按 frame seek，而非让它自己跑。

## 渲染路线

| 需求 | 最小可用技术 | 升级条件 |
|---|---|---|
| 排版、字幕、UI、表格 | React/HTML/SVG | 大量像素粒子时 Canvas |
| 生长路径、线稿、网络、节点 | SVG 或 Canvas 2D | 真正 3D 遮挡/光照时 Three |
| 倾斜地图、线框、billboard 插画 | Three 投影数学 + Canvas | 多物体深度排序与材质时 R3F |
| 实体商品、角色、材质、阴影 | Three + React Three Fiber + @remotion/three | 模型/骨骼/复杂造型用 Blender/GLTF |
| 纪录片镜头和复杂实景 | 素材或生成镜头 + Remotion 合成 | 不硬用几何体替代所有真实对象 |

R3F 在 Remotion 中优先使用官方 ThreeCanvas 集成；所有对象与相机位置仍由帧推导。后期 Bloom 只突出语义焦点，过量会吞掉线框和文字。体积雾、PBR、景深是特定需求，不是默认效果清单。

Canvas 伪 3D：生成 `[x,y,z]`，用 camera 的 view/projection 将点映射到屏幕坐标；`screenX=(ndc.x+1)*W/2`，`screenY=(1-ndc.y)*H/2`。同一投影器同时服务地形、路径、节点，避免浮在不相干的平面上。Canvas 默认无深度缓冲、物理光照；需要遮挡则深度排序/裁剪或升级 WebGL。把手、骆驼等屏幕线稿当作 billboard 时尤其要检查缩放与地面贴合。

## 推荐拆分

```text
data/brief.json           主张、事实、观众、来源
data/storyboard.json      时间轴、场景数据、字幕、音频事件
src/Root.tsx              Composition 和输出规格
src/theme.ts              色、字、线宽、亮度、留白
src/model/                知识变量与确定性状态函数
src/primitives/           路径、节点、地形、箭头、字幕
src/scenes/               每段机制及镜头编排
src/audio/                旁白/音乐/音效轨、ducking
public/                   本地字体/素材/音轨与许可
scripts/                  检查、静帧、渲染、验证
evidence/                 同时间码截图、校验输出
renders/                  最终输出，不放半成品冒充完成
```

同系列共享 theme 和 primitives，不共享全部 scene。单文件可用于首个验证样片；正式多选题迭代拆分，避免在 300 行巨大 draw 中硬塞所有主题。

## 官方参考

- https://www.remotion.dev/docs/the-fundamentals
- https://www.remotion.dev/docs/three
- https://www.remotion.dev/docs/audio/volume
- https://ffmpeg.org/ffmpeg-filters.html

脚手架固定 Remotion 4.0.524，来自本机已验证依赖；不是“当前最新版”的断言。升级时所有 @remotion/* 和 remotion 保持相同版本，读取该版官方 API 再变更。
