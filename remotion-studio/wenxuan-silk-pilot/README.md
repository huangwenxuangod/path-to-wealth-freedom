# wenxuan-video：交接—接力样片

20.5秒代表段，1280×720、30fps、615帧，对应参考44–64.5秒。知识视频的最终时长由解释完整度决定，不固定一分钟，2—3分钟也可以。

双手交接的预备、接触、接收与地图接力围绕7个声音候选事件编排；同一卷丝绸连续进入地图，不新增冲击音。声音使用提供的参考混合轨轻修版；当前没有认证独立鼓种、BPM或主观踩点听感。

## 使用

需要Bun以及Remotion所需Chrome。在本目录：

```sh
bun install
bun run typecheck
bun run check
bun run studio
bun run render
```

`public/fonts`含必要本地字体与OFL许可；`public/reference-audio-refined.m4a`是样片音轨。独立项目声明所需依赖，不依赖另一个项目的可变素材。

`motion-plan.json`记录候选事件与帧位置，`MOTION_PLAN.md`记录动作顺序。`src`与`data`是可编辑源码与示意地形/时间轴，地形不是真实历史DEM，路线不代表同一年代全部贸易路径。

本地`renders`与`evidence`被Git忽略；渲染文件无需上传到源码仓库。旧脚本与回滚测试副本归档在工作区output，正式源文件及样片保留。

仓库中的`skills/wenxuan-video`为可安装Skill。复制该目录到自己的Codex技能目录即可使用`$wenxuan-video`。导演顺序是研究与叙事、音乐分析、分镜运镜、动效、带声样片，再扩全片。
