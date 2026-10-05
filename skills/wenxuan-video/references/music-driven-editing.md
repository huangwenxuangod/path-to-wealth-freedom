# 音乐与音效驱动导演

## 先声音节奏，再锁分镜
研究确定讲什么后，正式分镜前选音乐，记录来源、版本、所用区间与编辑方式。音乐与脚本共同编排，不能最后垫乐。无人声文字片以音乐节奏与阅读共同决定；有旁白片让关键词、停顿和音乐段落相互配合。

声音地图分三层：实际段落（能量/音色变化）对应叙事；乐句和小节对应解释单元与镜头；真实鼓击/起音/音效对应动作落点。不是每拍都切，不将所有歌硬套4/4、8小节或Drop。

beat是节拍脉搏，onset是声音起音；二者不等同。波形峰不自动是鼓点，低频峰不自动是底鼓，检测BPM不自动给出段落首拍。自动工具只给候选，关键事件要人工听辨；无明显鼓点时标音色进入、和声或能量变化。

## 按音乐改变编排
- 稳定清晰鼓点：规则动作、干净落位与转场。
- 慢且稀疏：较长镜头、空间展开、阅读停留。
- 快且细碎：小动作跟细分，概念展开用更大的单位。
- 摇摆/切分：保留实际事件时间，不强行吸附均匀格。
- 渐强/抽空：对应准备、揭示与反思；不要为匹配音乐伪造知识反转。

## 动作命中而非仅开始
预备→运动→命中→余势。先定命中事件，再回推运动起点；落位、碰撞、路径连接、变形完成可踩点，回弹可在命中之后。给音效标攻击/命中时刻，不把音频文件起始的静音当冲击点。音效承担预告、连接、冲击、抽空与延续，已有鼓击可承担冲击，不每个小对象都响一次。

## 数据契约
director-plan内brief.rhythmMode为music-driven或none。music-driven包含musicMap：source、version、duration、basis（synthetic/estimated/measured）、events（id/time/type/strength/status，status为candidate/confirmed）、segments（id/start/end/role）。例子使用synthetic，未实测禁止升级成measured。

每镜musicCue含segmentIds、targetEventId、visualHit。motion阶段每个带声落点含shotId/eventId/prepareAt/moveAt/hitAt/settleAt/toleranceFrames，均为镜头局部秒。每镜至少一个明确映射，可以选段落结束/音色进入，不要求每镜强鼓点。声响落点允许落在当前镜头终点用作接缝，最后一镜终点仅代表结束，不保证可见末帧。

seconds是所用音乐版本的成片全局时间，不是原歌时间。source和version更改或音乐裁切、循环、重排、变速后重建映射。稳定BPM可辅助估计但必须带真实起始偏移；变速/摇摆用真实事件表。全局目标帧按round(time*fps)独立计算，避免累加取整造成漂移；镜头局部时间需减去镜头起始。视觉精度受fps约束，音频不必限制成整帧。

## 锁定和验收
production要求实测音乐时间、事件人工确认和带声Animatic审阅记录；估计和合成只用于草稿。同步误差的帧检查不替代实际播放听感。重点检查后段漂移、声响攻击与画面命中、旁白清晰度、阅读停留、节奏层级和转场余音。

冲突时延长到下一乐句、让局部动作踩点而主图静止、改脚本停顿、重排音乐或换曲，不只加速口播。保留无音乐入口；仅修改字幕不强制重新设计音乐。

资料：Ableton节拍与音乐结构教程 https://learningmusic.ableton.com/song-structure/song-structure.html ；Adobe节拍标记工作流 https://helpx.adobe.com/ca/premiere/mobile/audio-editing/use-beat-detection-for-music-synced-edits.html 。自动识别与导演映射是两项不同工作。
