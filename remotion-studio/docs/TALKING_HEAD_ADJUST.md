# 调整这段口播示范

## 打开
在Remotion Studio选择 `TalkingHeadDesignLab`。`TalkingHeadOriginal`是同一段原片对照。
Windows启动：
```powershell
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
node node_modules/@remotion/cli/remotion-cli.js studio --no-open --port 4141
```

## 不写代码也能调整
右侧 Props 面板直接改：
- `accent` / `background`：强调色和底色，使用 #RRGGBB。
- `introTitle` / `transformationTitle`：边界与教育变革的短标题。
- `studentTitle` / `teacherTitle`：导师、助手的短标题；标题上限 10 字。
- `videoOffsetX` / `videoOffsetY` / `videoScale`：人物位置和缩放。
- `overlayOffsetX` / `overlayOffsetY` / `overlayScale`：整组图层位置与大小。
- `fullScreenScenes`：默认关闭，保持真人底板；开启时末段切至裸关系图，无人物小窗。
- `edited`：关闭全部图层，看原片。
- `showSubtitles` / `subtitleSize` / `volume`：字幕和原声音量。
- `scene2Start` / `scene3Start` / `scene4Start`：画面模式切换的位置，单位秒。
Studio修改可预览，并点击保存按钮写回src/Root.tsx。默认渲染读取Studio保存后的参数。data/talking-head.json是独立输入样本；要用它覆盖渲染参数，执行 bun scripts/render-talking-head.ts --json。

## 文件
主画面：src/talking-head/TalkingHeadDesignLab.tsx。
参数和边界：src/talking-head/spec.ts。
字幕：data/talking-head-captions.json。
设计说明：docs/TALKING_HEAD_DESIGN.md。
来源：public/talking-head/assets.json。
最终成片：renders/talking-head-design-lab.mp4。

## 重渲染
```powershell
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
bun run typecheck
bun scripts/check-talking-head.ts
bun scripts/render-talking-head.ts
bun scripts/verify-talking-head.ts
```

## 重复使用的制作要求
将口播作为真人底板，按参考制作短关键词、紧凑分点、有投影的小对象和关系变化。字幕承载完整讲话，图层不复述整段文案。不自编聊天界面。所有运动按 frame/fps 确定，人物脸部与手势优先保留，真实材料与示意分开。

## V3 已加入的状态变化

- 4.42 秒与 5.65 秒：防护措施、正确使用依次进入；7.05 秒收拢为盾牌与降低风险。
- 教育标题缩回后：AI 对象进入，学生和教师从两侧收拢，连接线展开。
- 22.1 秒：导师对象移动 85px 水平、70px 垂直与学生配对，随后连线与勾选出现。
- 教师段：学生对象退出，教师接入；29.36 秒助手重新配对。
- 小对象采用暗底、薄边、底部厚度与投影；没有恢复大面板。

验证与前版备份：D:\path-to-wealth-freedom\remotion-studio\evidence\motion-v3\VERIFICATION.txt。

## V4 连续接力与大字标准
关键标题采用 140px 进入 / 112px 持续，关系锚点 90px，上下文 44px，节点标签 36px（1080p 画布）。风险、防护、AI、学生、教师由同一组对象接力，结尾重新汇入同一关系图。主标题不再降到 57–77px。教育标题与节点错位，结尾分两行保持大字。详情见 docs/TALKING_HEAD_FLOW_V4.md。
