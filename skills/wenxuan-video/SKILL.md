---
name: wenxuan-video
description: "导演式知识动画：研究并讲透一个问题，先选BGM与分析节奏，再设计叙事、轻量分镜和运镜，最后设计炫酷的语义动效与声音命中，用Remotion制作；适用于原理解释、vibe知识视频与参考重建。"
---

# 文轩知识动画导演

让观众看到原理发生，而非只看到原理名称。先当知识导演，再当动效设计师，最后当工程师。知识决定讲什么；音乐与音效参与决定何时出现、怎样运动和怎样转折。炫酷来自连续对象、机制变化、空间揭示与关键落点，不以堆粒子和音效代替解释。

## 时长、解释方法与钩子

不默认一分钟。2—3分钟或更长都可以，按解释完整度、阅读和实际旁白确定；平台或用户硬限制另行遵守。先讲清是什么、为什么，按问题需要使用具体例子、对比、类比、过程演示、反例与边界，不机械要求每片全部用一遍。不为填满时长重复，也不为踩点删掉关键因果。

开头要有与核心问题相关的hook：反常现象、直觉冲突、具体困惑、对照或有证据的悬念。先写观众为什么想继续看，再让后续解释逐步兑现；不靠夸张事实、空泛震惊或最后才补一个标题制造钩子。较长片可在章节衔接设计新的问题与阶段性答案，维持期待，不预设固定几秒一次。

## 入口和默认协作

- 给参考视频：读 [reference-rebuild.md](references/reference-rebuild.md)，全片抽样并加密关键运动与声音段。区分观察、推测与实测实现；只有抽帧时不宣称听完或完成精确踩点分析。
- 给选题：读 [causal-storyboard.md](references/causal-storyboard.md)，建立问题、核心回答、机制链、条件与反例；专业或时效性事实查一手来源。
- 修改成片：沿用工程与时间轴，只改所请求内容，复查邻接镜头与声音。
- 只更新本Skill：更新并测试资源，不把示例选题当成新视频任务。

用户强调一步步或仅给选题时，默认先交付阶段A，等待继续后才做详细动效。明确授权全流程自主执行可连续推进，但不伪造用户确认。缺少BGM时可先做未锁时长的语义分镜与音乐选择建议；不得虚构实测鼓点。用户已指定风格/声音则沿用，不重复询问。

## 制作主干

读 [director-workflow.md](references/director-workflow.md)。音乐驱动模式默认采用；若用户明确不要音乐或只改字幕，按该需求收缩流程。

**A｜研究与叙事骨架 → 音乐选择与节奏图 → 视觉方向 → 音乐化分镜与运镜。** 一句问题、一句回答，写完整信息推进、条件与误解。正式分镜前读 [music-driven-editing.md](references/music-driven-editing.md)，选音乐并标段落、乐句、拍点与真实声音事件。视觉未指定时先比较2—3张轻量风格卡。每镜说明理解目标、画面前后状态、台词、构图、运镜动机、连续锚点，以及音乐区间/目标声音事件/画面命中。一张草图通常够用，不批量生成高清资产，不先写整片动画代码。

**B｜动效与声音编排。** 分镜审阅后读 [motion-language.md](references/motion-language.md)。分开对象、镜头、特效与声音。动作按预备→运动→命中→余势设计，重要落点对齐动作完成或撞击，不只对齐动画开始。大段落服务叙事，小节服务镜头，鼓击服务动作；不是每拍切镜头。关键段可以强烈，阅读与因果理解要有稳定停留。

**C｜带声动态分镜。** 用粗素材、粗运动、BGM、计划音效与临时/已有旁白串全片。检查实际节奏、解释、阅读与声音遮蔽。旁白实测后回调，不为卡点硬加速。缺少声音只能交视觉草稿，不声称已验证groove。

**D｜技术与代表段。** 读 [architecture.md](references/architecture.md)，按需求选SVG、Canvas、Three与素材。先测开场和最难机制；相同段落可合并。不要用漂亮开场替代正文验证。

**E｜全片。** 图像路线读 [scene-card-route.md](references/scene-card-route.md)；音轨读 [audio.md](references/audio.md)。音乐、旁白、音效分轨。声音可以驱动剪辑而数量克制，已有鼓击可承担冲击，不重复叠同类音效。场景卡不替代机制的可编辑图层。修改BGM裁切/速度/编排后更新事件映射。

**F｜声画与技术验收。** 读 [verification.md](references/verification.md)。观众能回答是什么、为什么、条件是什么；检查连续性、运镜动机、动作命中和后段漂移，再检查规格/解码/音轨。编译成功不代表解释清楚，检测BPM不代表踩点设计完成。

## 可执行资源

下列SKILL_DIR以当前安装绝对路径替换，按当前shell运行。Python脚本使用标准库；抽帧与媒体检查另需FFmpeg/ffprobe。

```text
python SKILL_DIR/scripts/analyze_reference.py INPUT.mp4 --out OUTPUT_DIR --interval 4
python SKILL_DIR/scripts/scaffold.py PROJECT_DIR
python SKILL_DIR/scripts/check_director_plan.py PLAN.json --stage storyboard
python SKILL_DIR/scripts/check_director_plan.py PLAN.json --stage motion
python SKILL_DIR/scripts/check_music_plan.py PLAN.json --stage motion
python SKILL_DIR/scripts/verify_media.py OUTPUT.mp4 --width 1280 --height 720 --fps 30 --duration 8
```

分镜空表：[director-plan-template.md](assets/director-plan-template.md)。结构化示例：[director-plan.example.json](assets/director-plan.example.json)，音乐事件是合成格式示例，不是任何参考的检测结果。

检查器验证时间覆盖、镜头范围、阶段门槛和声音命中映射；不判断艺术质量、事实真伪或真实用户审批。音乐自动检测可选使用已验证的分析库；工具缺失时可人工标记并听辨确认，不为调用Skill强制新服务或配音账号。

渲染底座：[assets/starter](assets/starter)，仅到D/E使用。保留Remotion帧驱动与独立音轨；scaffold拒绝覆盖非空目录。项目运行bun install、bun run typecheck、bun run check、bun run stills、bun run render；音乐化导演计划需实际接入项目，不把底座示例误当已完成的踩点作品。

## 复用与交付

交付MP4、可编辑源码、叙事/分镜/节奏图、素材来源、声音版本和实际验收。时长、画幅、主题、角色与视觉风格不固定。真实素材与证据不混淆。学习两种参考入口见 [reference-lessons.md](references/reference-lessons.md)，调用提示见 [prompt.md](references/prompt.md)。丝路线框案例只在相关任务读 [silk-road-case.md](references/silk-road-case.md)；理论依据按需读 [research-basis.md](references/research-basis.md)。
