# Hyper Studio 工作约定

- 本目录是多作品工作台；每条视频必须放在 videos/<作品名>/，拥有独立 index.html、meta.json、DESIGN.md、assets/、renders/ 和 package.json。
- 新作品不得覆盖已有作品或引用其他作品的可变素材。素材按需复制，每条作品可独立打包。
- 使用 HyperFrames 技能；目前工具链固定 hyperframes@0.8.40，HTML + CSS + SVG + GSAP。升级版本单独验证。
- 每条视频单独确定尺寸、时长、帧率、视觉规范、音频需求和输出名称。agent-ui-film 的六秒荧光绿样式只适用于该作品。
- 新中文文案必须检查字体字形覆盖。保留确定性暂停时间轴及 window.__timelines 注册。
- 修改后执行该作品 npm run check；渲染后检查完整解码、尺寸时长和代表帧。透明输出另外验证 Alpha。
- 预览使用 preview --background，并检查 --status；作品搬迁前停止对应旧预览。
- renders 与验证证据属于各自作品；历史证据中的旧绝对路径是历史记录，不批量改写。
- 不自动提交、推送或发布。作品目录下更具体的规则继续适用。
