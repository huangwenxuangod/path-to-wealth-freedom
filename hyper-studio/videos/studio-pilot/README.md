# Studio Pilot · 从素材到成片

12 秒 / 1920×1080 / 30fps / 本地合成音效。成片：`renders/studio-pilot.mp4`。

## 运行

在本作品目录运行：

```sh
npm ci
npm run check
npm run render -- --output renders/studio-pilot.mp4 --fps 30 --quality high --workers 1
npx --yes hyperframes@0.8.40 preview --background --port 3027
```

## 已验证的分工

- Tailwind 4.2.4：排版、间距、字体大小、色彩、边框。`styles.css` 编译为 `assets/style.css`，成片不依赖在线 Tailwind。
- 自定义 CSS：全画幅容器、细网格、本地字体。未导入 Tailwind preflight，避免默认备用字体触发 HyperFrames 字体校验；保留最小基础重置。
- GSAP：暂停、可 seek 的单一时间轴，标题展开、素材入场、场景推移、分段节奏、末镜淡出。
- 素材：旧片画面复制到本地；Logo、本地字体和合成音效随作品保存。

Tailwind 的复用和编译路径已验证。此次没有同任务计时对照，因此不声称具体提效百分比。镜头质量依赖构图、重点、停顿和素材质量，Tailwind 主要减少静态样式书写。

## 后续制作顺序

1. 每个镜头先写：观众要看到什么、唯一重点、素材、运动动词、入场时间、停顿时间。
2. 先做关键静帧，检查手机缩小预览下主标题是否可读。
3. 冻结素材到独立 assets；真实产品画面优先，矢量用于图解，需要情绪或场景才加入图片/实拍。
4. 用 GSAP 排入场和停顿；声音强调已有节奏。文字阅读时间优先于机械卡点。
5. 按需选效果：推移适合连续步骤；遮罩适合重点揭示；Shader 适合关键章节转换；Lottie 适合现成矢量动画；Three.js 仅用于确实需要空间关系的镜头。
6. 编译、check、草稿、抽帧、高质量渲染、ffprobe 和完整解码。转场必须额外抽帧，不能只看静态主画面。

本片采用普通 transform 转场；Shader、Lottie、Three.js 尚未在本片验证。

## 可复用任务描述

```text
在 hyper-studio/videos 下创建独立作品。沿用 HyperFrames 0.8.40、原生 HTML、Tailwind v4 静态编译与 GSAP 暂停时间轴。
先在 DESIGN.md 写明主题、时长、画幅、每镜头唯一重点、真实素材、运动动词、阅读停顿和声音落点。
素材复制到新作品 assets。布局使用 Tailwind，时间动画由 GSAP 控制；效果只在能说明内容或帮助转场时加入。
执行作品自己的 npm run check，渲染 MP4，验证尺寸、时长、完整解码，检查主镜头及转场帧；保存证据后交付成片与 Studio 预览。
```

## 检查说明

同一图片在两个镜头复用会产生 duplicate_media_discovery_risk 提示；草稿渲染已确认两处显示正常。整镜头推移允许转场期间的遮挡、画外移动和重叠；代表帧另行人工检查。

初始化模板为 10 秒静态 Title，其 check 会报告 sweep_static；回滚仅恢复该 index.html 原始内容，不修改工作台和旧作品。ROLLBACK.sh 要求显式指定副本目录，并校验目标内容后才恢复。完整证据见 VERIFICATION.txt。
