# Magic UI 组件依赖

官方来源：https://magicui.design/docs/installation 。MIT 许可见 ../evidence/MAGIC_UI_LICENSE.txt。

本次从官方 registry JSON 取出 files[].content 保存到 src/components/magicui，原始响应 SHA256 见 ASTRA6_RESEARCH.json。源码已实际入库。

依赖：motion 13.3.0、clsx 2.1.1、tailwind-merge 3.7.0；开发工具 shadcn 4.21.0。package.json 和 bun.lock 固定版本。

后续添加组件：`bunx --no-install shadcn add @magicui/组件名`。components.json 已配置官方注册表与路径别名。

|组件|实际用途|视频改编|
|---|---|---|
|Safari|ComputerScene 工作窗口|官方 SVG，Remotion Img/OffthreadVideo，唯一 id|
|Terminal|CodingScene 执行过程|终端外壳和逐行表达；秒数代替 timer/入屏/回调|
|Number Ticker|CodingScene 基准数字|数字格式保留；帧驱动 ease-out|
|Animated Beam|开合镜头和操作镜头|双路径、四节点透明渐变；显式坐标与时间|

原版保留在 magicui 目录，成片只导入 video 改编，避免 Motion 独立时钟。没有改动既有 AgentWorkflow 的配色和组件。
