import {Img, staticFile} from 'remotion';
import type {DeskScene} from '../../../library/warm-desk/DeskShow';
import {BrowserFrame, FilmRun, FpsPreview, Tilt3D, WallScroll} from '../../../library/warm-desk/immersive';
import {Badge, Chips, FlowCards, IconCards, MysteryCards, PlayerCard, Rings} from '../../../library/warm-desk/motifs';
import {CodeCard, FollowCard} from '../../../library/warm-desk/props';
import {MediaSlot} from '../../../library/warm-desk/Slot';
import {ChapterTitle, Headline, Rise, SayBubble, Sparkle, Tag} from '../../../library/warm-desk/stage';
import {D, DF, OG} from '../../../library/warm-desk/theme';
import {ANNOTATED, SLOTS, THUMBS} from '../assets';
import {cf, cw} from '../cues';
import {ActionRow, CodePreview, DownloadPath, Equation, FileTree, FpsBar, FrameStack, SplitVersus, VideoWall} from './kit';

/**
 * ep27 Opus 5.5 做视频（完整版，4 分 37 秒）：暖纸工作台风 + 真人出镜。
 * 三种镜头（roll）：
 * - A：人在说重点（开场、提问、结论、结尾）——左下角小窗 470，右侧 x 640–1460 放大标题；
 * - B：人在讲、画面配图——小窗缩到 280，主视觉在 x 400–1460；
 * - F：全屏 B-roll——人物和吉祥物都退场，整屏交给一个沉浸式主视觉（往期作品墙、胶片带、分屏对比、终端 / 浏览器大窗、3D 缩略图墙）。
 * 结构：开场 + 三个收获 → 01 底层原理 → 02 环境准备 → 03 新建工程 → 04 蒸馏 Skill → 05 润色调整 → 结尾。
 */

export const STEPS = ['底层原理', '环境准备', '新建工程', '蒸馏 Skill', '润色调整'];

export type Roll = 'A' | 'B' | 'F';
type Scene = DeskScene & {roll: Roll};

/** 章节卡：全屏，人物退场，吉祥物留着跳一下 */
const chapter = (n: number, cue: number): Scene => ({
  roll: 'F',
  from: cf(cue) - 6,
  C: ({f}) => <ChapterTitle f={f} at={cf(cue)} n={n} title={STEPS[n - 1]} y={440} total={STEPS.length} />,
  step: n - 1,
  hop: true,
  sfx: [['whoosh', cf(cue) - 4, 0.16], ['ding', cf(cue), 0.24]],
});

/** A-roll 标题左边线、B-roll 主视觉左边线 */
const AX = 640;
const BX = 400;

/** 全屏大窗（终端 / 浏览器录屏）：内容区 1240×700（接近录屏的 16:9），水平居中 */
const BIG = {w: 1240, h: 700, x: 340, y: 170};

export const SCENES: Scene[] = [
  // ───────── 开场 ─────────
  // A 哈喽各位，本期是 Opus 5.5 做视频的保姆级教程，结合理论和实践
  {
    roll: 'A',
    from: 0,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(2)} kicker="AI 实战分享 · 第 08 期" text={'Opus 5.5 做视频\n〔保姆级〕教程'} size={112} x={AX} y={180} align="left" hiAt={cw(3, '保姆级')} />
        <div style={{position: 'absolute', left: AX, top: 610}}>
          <Chips f={f} at={cf(4)} items={['理论', '实践', '手把手']} gap={8} />
        </div>
        <div style={{position: 'absolute', left: 1280, top: 420}}>
          <Badge f={f} at={cf(1)} ring="OPUS 5.5 · VIBE VIDEO · OPUS 5.5 · VIBE VIDEO · " mid="5.5" />
        </div>
      </>
    ),
    eyes: 'happy',
    sfx: [['pop', cf(1), 0.26], ['magic', cw(3, '保姆级'), 0.22], ['paper', cf(4), 0.22]],
  },
  // F 手把手带你用 AI 做出这样的爆款视频：全屏往期作品墙
  {
    roll: 'F',
    from: cf(5) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(5) - 4} x={266} y={130} rx={22} ry={0} drift={0.0004}>
          <VideoWall f={f} at={cf(5)} />
        </Tilt3D>
        <Sparkle f={f} at={cf(6) + 2} x={960} y={540} r={300} n={14} />
        <Rise f={f} at={cf(6)} x={0} y={500} style={{width: 1920, textAlign: 'center'}}>
          <span style={{display: 'inline-block', padding: '22px 44px', borderRadius: 50, background: OG, boxShadow: '0 24px 60px rgba(241,90,53,0.45)', color: '#fff', fontFamily: DF.sans, fontWeight: 900, fontSize: 56, transform: 'rotate(-2deg)'}}>全部用 AI 写代码做的</span>
        </Rise>
      </>
    ),
    hideMascot: true,
    sfx: [['whoosh', cf(5), 0.2], ['magic', cf(6), 0.24]],
  },
  // A 看完本期你将收获什么呢
  {
    roll: 'A',
    from: cf(7) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(7)} kicker="本期收获" text={'看完这期\n你能带走〔什么〕？'} size={110} x={AX} y={190} align="left" hiAt={cw(8, '收获')} />
        <div style={{position: 'absolute', left: AX + 10, top: 600}}>
          <MysteryCards f={f} at={cw(8, '收获')} />
        </div>
      </>
    ),
    eyes: 'wide',
    emotes: [['?', cw(8, '收获')]],
    sfx: [['pop', cf(7), 0.24], ['magic', cw(8, '收获'), 0.2]],
  },
  // B 收获 01：理解底层原理，从第一性原理驾驭方法和技巧
  {
    roll: 'B',
    from: cf(9) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(9)} kicker="收获 01" text={'理解 AI 做视频的\n〔底层原理〕'} size={92} x={BX} y={170} align="left" hiAt={cw(11, '最核心')} />
        <div style={{position: 'absolute', left: 900, top: 340}}>
          <Rings f={f} at={[cw(12, '第一性原理'), cw(13, '方法'), cw(13, '技巧')]} labels={['原理', '方法', '技巧']} />
        </div>
      </>
    ),
    eyes: 'happy',
    sfx: [['pop', cf(9), 0.22], ['magic', cw(11, '最核心'), 0.2], ['click', cw(13, '方法'), 0.24], ['click', cw(13, '技巧'), 0.24]],
  },
  // B 收获 02：用脚手架工程快速上手，做出第一个视频
  {
    roll: 'B',
    from: cf(14) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(14)} kicker="收获 02" text={'用〔脚手架〕\n快速上手'} size={92} x={BX} y={170} align="left" hiAt={cw(15, '脚手架')} />
        <div style={{position: 'absolute', left: BX, top: 480}}>
          <CodeCard f={f} at={cw(16, '上手')} dark title="~/weilanx-claude-videos" per={20} w={560} lines={['git clone weilanx-claude-videos', 'npm install', 'npm run studio']} />
        </div>
        <Sparkle f={f} at={cw(17, '第一个视频') + 4} x={1200} y={430} r={240} n={12} />
        <div style={{position: 'absolute', left: 930, top: 290}}>
          <PlayerCard f={f} at={cw(17, '第一个视频')} line="我的" hi="第一条" caption="你自己的第一个视频" file="first.mp4" />
        </div>
      </>
    ),
    sfx: [['pop', cf(14), 0.22], ['type', cw(16, '上手'), 0.2], ['magic', cw(17, '第一个视频'), 0.22]],
  },
  // B 收获 03：分享一个 Skill，快速做出任何爆款视频
  {
    roll: 'B',
    from: cf(18) - 6,
    C: ({f}) => (
      <>
        <Rise f={f} at={cf(18)} x={BX} y={150}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Tag text="收获 03" size={30} />
            <SayBubble text="distill-video · 视频蒸馏 Skill" size={34} avatar="CC" />
          </div>
        </Rise>
        <div style={{position: 'absolute', left: BX + 20, top: 330}}>
          <FlowCards f={f} at={[cw(19, 'Skill'), cf(20), cw(21, '爆款')]} items={[['爆款视频', '你想看到的任意一条'], ['蒸馏 Skill', '拆出风格配方'], ['你的新风格', '快速做出同款']]} />
        </div>
      </>
    ),
    emotes: [['note', cw(21, '爆款')]],
    sfx: [['pop', cf(18), 0.22], ['click', cw(19, 'Skill'), 0.24], ['click', cf(20), 0.24], ['magic', cw(21, '爆款'), 0.22]],
  },
  // A 建议先点赞收藏
  {
    roll: 'A',
    from: cf(22) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(22)} kicker="看之前" text={'建议先\n〔点赞收藏〕'} size={112} x={AX} y={180} align="left" hiAt={cw(22, '点赞')} />
        <div style={{position: 'absolute', left: AX + 10, top: 590}}>
          <ActionRow f={f} at={cf(22) + 6} items={['heart', 'star']} labels={['点赞', '收藏']} />
        </div>
      </>
    ),
    eyes: 'star',
    hop: true,
    sfx: [['pop', cf(22), 0.22], ['ding', cf(22) + 22, 0.22]],
  },

  // ───────── 01 底层原理 ─────────
  chapter(1, 23),
  // B 视频是动态的，我们靠手机 / 摄像机拍；AI 没有录制功能，它怎么做？
  {
    roll: 'B',
    from: cf(25) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(25)} kicker="先想一个问题" text={'视频是〔动态〕的'} size={84} x={BX} y={150} align="left" hiAt={cw(25, '动态')} />
        <div style={{position: 'absolute', left: BX + 10, top: 330}}>
          <IconCards
            f={f}
            at={[cw(27, '手机'), cw(28, 'AI')]}
            items={[
              ['camera', '我们', '用手机、摄像机拍'],
              ['bulb', 'AI 呢', '它可没有镜头'],
            ]}
            joinAt={cw(28, 'AI') + 6}
            joiner="→"
            w={420}
            h={340}
            titleSize={80}
          />
        </div>
      </>
    ),
    step: 0,
    eyes: 'wide',
    emotes: [['?', cf(29)]],
    sfx: [['paper', cw(27, '手机'), 0.22], ['paper', cw(28, 'AI'), 0.22], ['pop', cf(29), 0.2]],
  },
  // A 结论：AI 做视频的本质就是在写代码
  {
    roll: 'A',
    from: cf(30) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(30)} kicker="答案" text={'AI 做视频的本质\n就是在〔写代码〕'} size={104} x={AX} y={200} align="left" hiAt={cf(31) + 4} />
        <Rise f={f} at={cf(31) + 10} x={AX + 10} y={560}>
          <div style={{transform: 'rotate(-1.5deg)'}}>
            <CodeCard f={f} at={cf(31) + 10} title="Video.tsx" per={8} w={620} lines={['frame => draw(frame)', 'video = frames.join()']} />
          </div>
        </Rise>
      </>
    ),
    step: 0,
    eyes: 'happy',
    emotes: [['!', cf(31) + 4]],
    sfx: [['pop', cf(30), 0.22], ['magic', cf(31) + 4, 0.24], ['type', cf(31) + 10, 0.2]],
  },
  // F 视频的本质：很多张图片堆叠到一起，一秒钟播放几十张——横贯全屏的胶片带
  {
    roll: 'F',
    from: cf(32) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(33)} kicker="视频的本质" text={'一个视频 = 很多张〔图片〕'} size={92} x={140} y={150} align="left" hiAt={cw(35, '图片')} />
        <FilmRun f={f} at={cw(34, '本质')} speedUp={cw(36, '几十张')} y={460} />
        <div style={{position: 'absolute', left: 1180, top: 700}}>
          <FrameStack f={f} at={cw(35, '堆叠')} n={5} />
        </div>
        <Rise f={f} at={cw(36, '几十张')} x={140} y={790}>
          <Tag text="一秒钟，几十张" size={40} />
        </Rise>
      </>
    ),
    step: 0,
    hideMascot: true,
    sfx: [['pop', cf(33), 0.22], ['paper', cw(35, '堆叠'), 0.24], ['whoosh', cw(36, '几十张'), 0.22]],
  },
  // F 帧率：30 帧 = 一秒 30 张；够快就连贯——5 帧 vs 30 帧对比 + 全宽帧率条
  {
    roll: 'F',
    from: cf(37) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(37)} kicker="帧率 FPS" text={'一秒 〔30〕 张\n就是 30 帧'} size={104} x={140} y={150} align="left" hiAt={cw(38, '30')} />
        <div style={{position: 'absolute', left: 1040, top: 150, display: 'flex', gap: 30}}>
          <FpsPreview f={f} at={cf(40)} fps={5} label="太慢：一顿一顿" />
          <FpsPreview f={f} at={cf(40) + 8} fps={30} label="够快：连贯了" good />
        </div>
        <div style={{position: 'absolute', left: 140, top: 600}}>
          <FpsBar f={f} at={cf(39)} w={1640} />
        </div>
      </>
    ),
    step: 0,
    hideMascot: true,
    sfx: [['pop', cf(37), 0.22], ['click', cw(38, '30'), 0.24], ['paper', cf(40), 0.22], ['ding', cf(41), 0.2]],
  },
  // F AI 做视频：每一帧用代码写出来（代码驱动小球的实时预览，放大铺满）
  {
    roll: 'F',
    from: cf(43) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(43)} kicker="AI 怎么做" text={'每一帧 都用〔代码〕写出来'} size={84} x={140} y={140} align="left" hiAt={cw(45, '代码')} />
        <div style={{position: 'absolute', left: 230, top: 330, transform: 'scale(1.38)', transformOrigin: '0 0'}}>
          <CodePreview f={f} at={cf(44)} />
        </div>
        <Rise f={f} at={cw(46, '拼到一起')} x={140} y={800}>
          <Tag text="所有帧拼到一起 = 视频" size={36} />
        </Rise>
      </>
    ),
    step: 0,
    hideMascot: true,
    sfx: [['pop', cf(43), 0.22], ['type', cf(44), 0.2], ['magic', cw(45, '代码'), 0.2], ['click', cw(46, '拼到一起'), 0.24]],
  },
  // F 30 帧/秒 × 10 秒 = 300 帧，连起来就是一个视频
  {
    roll: 'F',
    from: cf(47) - 6,
    C: ({f}) => (
      <>
        <div style={{position: 'absolute', left: 230, top: 260, transform: 'scale(1.3)', transformOrigin: '0 0'}}>
          <Equation f={f} at={[cw(47, '30'), cw(48, '10'), cw(48, '300')]} />
        </div>
        <Sparkle f={f} at={cw(48, '300') + 4} x={1520} y={420} r={260} n={14} />
        <Headline f={f} at={cf(50)} text={'连起来 = 〔一个视频〕'} size={84} y={720} hiAt={cf(50) + 8} />
      </>
    ),
    step: 0,
    hideMascot: true,
    sfx: [['click', cw(47, '30'), 0.24], ['click', cw(48, '10'), 0.24], ['magic', cw(48, '300'), 0.22], ['pop', cf(50), 0.2]],
  },
  // F 和视频模型的区别：猜 vs 算（全屏分屏）
  {
    roll: 'F',
    from: cf(51) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(51)} text={'视频模型在〔猜〕，代码在〔算〕'} size={68} y={120} hiAt={cw(52, '猜')} />
        <div style={{position: 'absolute', left: 120, top: 260}}>
          <SplitVersus f={f} at={[cw(52, '猜'), cw(53, '算出来'), cw(54, 'token'), cw(56, '准确度')]} />
        </div>
      </>
    ),
    step: 0,
    hideMascot: true,
    sfx: [['pop', cf(51), 0.22], ['paper', cw(52, '猜'), 0.22], ['click', cw(53, '算出来'), 0.24], ['paper', cw(54, 'token'), 0.22], ['paper', cw(56, '准确度'), 0.22]],
  },
  // B 两个核心项目：Remotion、HyperFrames（官网截图待补）
  {
    roll: 'B',
    from: cf(58) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(58)} kicker="用代码写视频的两个核心项目" text={'〔Remotion〕 · HyperFrames'} size={72} x={BX} y={140} align="left" hiAt={cw(60, 'Remotion')} />
        <Tilt3D f={f} at={cw(60, 'Remotion')} x={BX} y={300} ry={20} rx={6}>
          <div style={{transform: 'rotate(-1.5deg)'}}>
            <MediaSlot f={f} at={cw(60, 'Remotion')} spec={SLOTS.remotion} w={500} h={281} title="remotion.dev" />
          </div>
        </Tilt3D>
        <Tilt3D f={f} at={cw(61, 'HyperFrames')} x={BX + 550} y={320} ry={-20} rx={6}>
          <div style={{transform: 'rotate(1.5deg)'}}>
            <MediaSlot f={f} at={cw(61, 'HyperFrames')} spec={SLOTS.hyperframes} w={500} h={281} title="hyperframes" />
          </div>
        </Tilt3D>
        <Rise f={f} at={cf(64)} x={BX} y={720}>
          <Tag text="不用管细节：它们就是用代码写视频的开源项目" size={30} solid={false} />
        </Rise>
      </>
    ),
    step: 0,
    sfx: [['pop', cf(58), 0.22], ['paper', cw(60, 'Remotion'), 0.24], ['paper', cw(61, 'HyperFrames'), 0.24], ['click', cf(64), 0.22]],
  },
  // B 装好之后，Agent（CC / DeepSeek Harness）就能帮你写视频
  {
    roll: 'B',
    from: cf(67) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(67)} kicker="装好之后" text={'让〔Agent〕帮你写视频'} size={80} x={BX} y={150} align="left" hiAt={cw(67, 'Agent')} />
        <div style={{position: 'absolute', left: BX + 20, top: 330}}>
          <FlowCards f={f} at={[cf(68), cf(69), cf(70)]} items={[['CC', 'Claude Code'], ['或者', 'DeepSeek Harness'], ['写视频', '代码 → 成片']]} />
        </div>
      </>
    ),
    step: 0,
    sfx: [['pop', cf(67), 0.22], ['click', cf(68), 0.24], ['click', cf(69), 0.24], ['magic', cf(70), 0.2]],
  },
  // A 今天：基于 Remotion，配合 Opus 5.5，搭一整套视频工程
  {
    roll: 'A',
    from: cf(71) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(71)} kicker="今天的方案" text={'Remotion\n+ 〔Opus 5.5〕'} size={120} x={AX} y={170} align="left" hiAt={cw(73, 'Opus')} />
        <div style={{position: 'absolute', left: AX, top: 610}}>
          <Chips f={f} at={cf(74)} items={['搭一整套工程', '教你做出视频']} gap={30} />
        </div>
      </>
    ),
    step: 0,
    eyes: 'happy',
    sfx: [['pop', cf(71), 0.22], ['magic', cw(73, 'Opus'), 0.2], ['paper', cf(74), 0.22]],
  },

  // ───────── 02 环境准备 ─────────
  chapter(2, 76),
  // F 最推荐 Claude Code（全屏终端录屏，待补）
  {
    roll: 'F',
    from: cf(77) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(77)} x={BIG.x} y={BIG.y} rx={20} ry={0}>
          <BrowserFrame url="Claude Code · Opus 5.5" w={BIG.w} h={BIG.h} dark>
            <MediaSlot f={f} at={cf(77)} spec={SLOTS.claudeCode} w={BIG.w} h={BIG.h} bare />
          </BrowserFrame>
        </Tilt3D>
        <Sparkle f={f} at={cw(78, 'Claude') + 2} x={1560} y={186} r={140} />
        <Rise f={f} at={cw(78, 'Claude')} x={1360} y={136}>
          <div style={{transform: 'rotate(4deg)'}}>
            <Tag text="最推荐：Claude Code" size={38} />
          </div>
        </Rise>
      </>
    ),
    step: 1,
    hideMascot: true,
    sfx: [['whoosh', cf(77), 0.18], ['ding', cw(78, 'Claude'), 0.22]],
  },
  // B 用不上的话有平替：DeepSeek Harness + DeepSeek，配合 Skill 一样稳定
  {
    roll: 'B',
    from: cf(79) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(79)} kicker="用不上 Claude Code 怎么办" text={'有〔平替〕'} size={88} x={BX} y={140} align="left" hiAt={cw(82, '平替')} />
        <div style={{position: 'absolute', left: BX + 10, top: 320}}>
          <IconCards
            f={f}
            at={[cf(80), cf(83)]}
            items={[
              ['code', '首选', 'Claude Code + Opus 5.5'],
              ['tool', '平替', 'DeepSeek Harness + DeepSeek'],
            ]}
            w={470}
            h={340}
            gap={80}
            titleSize={76}
          />
        </div>
        <Rise f={f} at={cw(87, 'Skill')} x={BX + 10} y={770}>
          <Tag text="效果稍弱，配合我的 Skill 一样稳定出片" size={30} solid={false} />
        </Rise>
      </>
    ),
    step: 1,
    sfx: [['paper', cf(80), 0.22], ['magic', cw(82, '平替'), 0.2], ['paper', cf(83), 0.22], ['click', cw(87, 'Skill'), 0.22]],
  },
  // B 安装 Node 环境：交给 Agent 就行
  {
    roll: 'B',
    from: cf(89) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(89)} kicker="还需要" text={'〔Node〕 环境'} size={96} x={BX} y={150} align="left" hiAt={cw(89, 'Node')} />
        <Rise f={f} at={cw(91, 'Agent')} x={BX} y={350}>
          <SayBubble text="帮我把 Node 环境装好" size={38} avatar="我" />
        </Rise>
        <div style={{position: 'absolute', left: BX + 120, top: 480}}>
          <CodeCard f={f} at={cf(92)} dark title="Agent" per={18} w={760} lines={['brew install node', 'node -v']} />
        </div>
      </>
    ),
    step: 1,
    eyes: 'happy',
    sfx: [['pop', cf(89), 0.22], ['pop', cw(91, 'Agent'), 0.22], ['type', cf(92), 0.2]],
  },

  // ───────── 03 新建工程 ─────────
  chapter(3, 93),
  // F 直接复用开源项目 weilanx-claude-videos（全屏浏览器，仓库截图待补），把链接发给 Agent
  {
    roll: 'F',
    from: cf(94) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(94)} x={BIG.x} y={BIG.y} rx={18} ry={-6}>
          <BrowserFrame url="github.com / weilanx-claude-videos" w={BIG.w} h={BIG.h}>
            <MediaSlot f={f} at={cf(94)} spec={SLOTS.repo} w={BIG.w} h={BIG.h} bare />
          </BrowserFrame>
        </Tilt3D>
        <Rise f={f} at={cf(96)} x={1380} y={136}>
          <div style={{transform: 'rotate(4deg)'}}>
            <Tag text="开源 · 直接复用" size={38} />
          </div>
        </Rise>
        <Rise f={f} at={cw(98, '复制')} x={1080} y={760}>
          <SayBubble text="把仓库链接发给 Agent" size={38} avatar="我" />
        </Rise>
      </>
    ),
    step: 2,
    hideMascot: true,
    sfx: [['whoosh', cf(94), 0.18], ['pop', cf(96), 0.22], ['pop', cw(98, '复制'), 0.22]],
  },
  // F Agent 拉取工程：全屏深色终端
  {
    roll: 'F',
    from: cf(99) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(99) - 2} x={330} y={190} rx={14} ry={10}>
          <div style={{transform: 'scale(1.5)', transformOrigin: '0 0', width: 840 * 1.5, height: 330 * 1.5}}>
            <CodeCard f={f} at={cf(99) + 6} dark title="Agent · 拉取工程" per={14} w={840} lines={['git clone weilanx-claude-videos', 'cd weilanx-claude-videos', 'npm install', 'npm run studio']} />
          </div>
        </Tilt3D>
        <Headline f={f} at={cf(100)} text={'拉取〔所有工程〕'} size={72} x={330} y={770} align="left" hiAt={cf(100) + 6} />
      </>
    ),
    step: 2,
    hideMascot: true,
    sfx: [['type', cf(99) + 6, 0.2], ['type', cf(99) + 20, 0.2], ['type', cf(99) + 34, 0.2], ['pop', cf(100), 0.22]],
  },
  // F 内置 20 多期视频，打开就能预览，素材配音字幕配乐都配好了：3D 缩略图墙铺满
  {
    roll: 'F',
    from: cf(101) - 6,
    C: ({f}) => (
      <>
        <WallScroll f={f} at={cf(101) - 6} files={THUMBS} />
        <Rise f={f} at={cw(101, '20')} x={0} y={330} style={{width: 1920, textAlign: 'center'}}>
          <div style={{display: 'inline-block', padding: '30px 60px 36px', borderRadius: 36, background: D.card, boxShadow: '0 40px 90px rgba(60,40,20,0.28)'}}>
            <div style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 72, color: D.ink, whiteSpace: 'nowrap'}}>
              内置 <span style={{color: D.orange, fontSize: 130}}>20+</span> 期
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 18}}>
              <Chips f={f} at={cw(103, '素材')} items={['素材', '配音', '字幕', '配乐']} gap={6} size={30} />
            </div>
          </div>
        </Rise>
        <Rise f={f} at={cw(104, '开箱')} x={1290} y={300}>
          <div style={{transform: 'rotate(8deg)'}}>
            <Tag text="开箱即用" size={44} />
          </div>
        </Rise>
      </>
    ),
    step: 2,
    hideMascot: true,
    sfx: [['whoosh', cf(101), 0.2], ['pop', cw(101, '20'), 0.24], ['paper', cw(103, '素材'), 0.22], ['ding', cw(104, '开箱'), 0.22]],
  },

  // ───────── 04 蒸馏 Skill ─────────
  chapter(4, 105),
  // B 工程里的 .claude/skills/distill-video
  {
    roll: 'B',
    from: cf(106) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(106)} kicker="基于这个工程和我的 Skill" text={'做出你〔想要的〕视频'} size={76} x={BX} y={140} align="left" hiAt={cw(108, '想要的')} />
        <Tilt3D f={f} at={cf(109) - 4} x={BX} y={300} ry={14} rx={4}>
          <FileTree
            f={f}
            at={[cf(109), cw(110, '.claude'), cw(111, '目录'), cw(112, 'distill'), cw(112, 'distill') + 6, cw(112, 'distill') + 10]}
            lines={[
              [0, 'weilanx-claude-videos/'],
              [1, '.claude/'],
              [2, 'skills/'],
              [3, 'distill-video/'],
              [4, 'SKILL.md'],
              [3, '……'],
            ]}
            hi={3}
            w={720}
          />
        </Tilt3D>
        <Sparkle f={f} at={cw(112, 'distill') + 10} x={1260} y={540} r={170} />
        <Rise f={f} at={cw(112, 'distill') + 8} x={1150} y={500}>
          <div style={{transform: 'rotate(3deg)'}}>
            <Tag text="视频蒸馏 Skill" size={36} />
          </div>
        </Rise>
      </>
    ),
    step: 3,
    sfx: [['pop', cf(106), 0.22], ['paper', cf(109), 0.22], ['click', cw(110, '.claude'), 0.22], ['click', cw(112, 'distill'), 0.24]],
  },
  // B 它的作用：蒸馏视频 → CC 拆解 → 沉淀成你的风格
  {
    roll: 'B',
    from: cf(113) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(113)} kicker="它的作用" text={'把视频〔蒸馏〕成风格'} size={80} x={BX} y={150} align="left" hiAt={cw(114, '蒸馏')} />
        <div style={{position: 'absolute', left: BX + 20, top: 330}}>
          <FlowCards f={f} at={[cw(114, '蒸馏'), cw(115, '拆解'), cw(116, '风格')]} items={[['参考视频', '你想要的那一条'], ['CC 拆解', '画面、节奏、配色'], ['你的风格', '沉淀成素材包']]} />
        </div>
      </>
    ),
    step: 3,
    emotes: [['note', cw(116, '风格')]],
    sfx: [['pop', cf(113), 0.22], ['click', cw(115, '拆解'), 0.24], ['magic', cw(116, '风格'), 0.22]],
  },
  // F 举例：我网站上的一条视频（截图待补）→ 下载 → 放进 template/
  {
    roll: 'F',
    from: cf(117) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(117)} x={140} y={170} ry={16} rx={6}>
          <BrowserFrame url="我的网站 · 参考视频" w={880} h={495}>
            <MediaSlot f={f} at={cf(117)} spec={SLOTS.site} w={880} h={495} bare />
          </BrowserFrame>
        </Tilt3D>
        <div style={{position: 'absolute', left: 1060, top: 380}}>
          <DownloadPath f={f} at={cw(119, '下载')} w={240} />
        </div>
        <div style={{position: 'absolute', left: 1330, top: 290}}>
          <FileTree f={f} at={[cw(120, 'template'), cw(120, 'template') + 6]} lines={[[0, 'template/'], [1, '参考视频.mp4']]} hi={1} title="weilanx-claude-videos" w={440} />
        </div>
        <div style={{position: 'absolute', left: 140, top: 790}}>
          <Chips f={f} at={cf(117) + 6} items={['随便找一条', '下载下来', '放进 template/']} gap={Math.round((cf(120) - cf(117)) / 2)} size={34} />
        </div>
      </>
    ),
    step: 3,
    hideMascot: true,
    sfx: [['whoosh', cf(117), 0.18], ['click', cw(119, '下载'), 0.22], ['paper', cw(120, 'template'), 0.22]],
  },
  // F 调用 Skill，把视频给它，开始复刻（全屏录屏，待补）
  {
    roll: 'F',
    from: cf(121) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(121)} x={BIG.x} y={BIG.y} rx={18} ry={6}>
          <BrowserFrame url="Claude Code · /weilanx-creator-distill-video" w={BIG.w} h={BIG.h} dark>
            <MediaSlot f={f} at={cf(121)} spec={SLOTS.distill} w={BIG.w} h={BIG.h} bare />
          </BrowserFrame>
        </Tilt3D>
        <Sparkle f={f} at={cw(123, '复刻') + 2} x={1560} y={186} r={140} />
        <Rise f={f} at={cw(123, '复刻')} x={1420} y={136}>
          <div style={{transform: 'rotate(4deg)'}}>
            <Tag text="开始复刻" size={40} />
          </div>
        </Rise>
      </>
    ),
    step: 3,
    hideMascot: true,
    sfx: [['whoosh', cf(121), 0.18], ['magic', cw(123, '复刻'), 0.22]],
  },
  // F 复刻好之后沉淀到工程里：一个全新的视频风格（成片片段待补）
  {
    roll: 'F',
    from: cf(124) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(124)} x={140} y={150} ry={-18} rx={8}>
          <MediaSlot f={f} at={cf(124)} spec={SLOTS.newStyle} w={1080} h={608} title="新风格 · 预览" />
        </Tilt3D>
        <div style={{position: 'absolute', left: 1330, top: 220}}>
          <FileTree f={f} at={[cf(126), cf(126) + 6, cf(126) + 12]} lines={[[0, 'src/library/'], [1, '新风格/'], [0, 'styles/……']]} hi={1} title="沉淀到工程里" w={440} />
        </div>
        <Sparkle f={f} at={cw(127, '全新') + 4} x={1550} y={700} r={220} n={12} />
        <Headline f={f} at={cw(127, '全新')} text={'一个〔全新〕的\n视频风格'} size={72} x={1300} y={590} align="left" hiAt={cw(127, '全新') + 6} />
      </>
    ),
    step: 3,
    hideMascot: true,
    sfx: [['whoosh', cf(124), 0.18], ['paper', cf(126), 0.22], ['magic', cw(127, '全新'), 0.24]],
  },

  // ───────── 05 润色调整 ─────────
  chapter(5, 128),
  // F 哪里不满意就截图给它，它看得懂（全屏录屏待补 + 右侧截图对话）
  {
    roll: 'F',
    from: cf(129) - 6,
    C: ({f}) => (
      <>
        <Tilt3D f={f} at={cf(129)} x={140} y={150} ry={14} rx={6}>
          <BrowserFrame url="截图 → Agent 修改" w={1020} h={574}>
            <MediaSlot f={f} at={cf(129)} spec={SLOTS.screenshotFix} w={1020} h={574} bare />
          </BrowserFrame>
        </Tilt3D>
        <Rise f={f} at={cw(131, '不满意')} x={1240} y={220}>
          <div style={{width: 540, padding: 22, borderRadius: 26, background: D.card, boxShadow: D.shadow, transform: 'rotate(-1.5deg)'}}>
            <Img src={staticFile(ANNOTATED)} style={{display: 'block', width: 496, height: 282, borderRadius: 14, objectFit: 'cover', border: `1px solid ${D.cardLine}`}} />
            <div style={{marginTop: 16, fontFamily: DF.sans, fontWeight: 900, fontSize: 34, color: D.ink}}>这里不满意，改一下</div>
          </div>
        </Rise>
        <Rise f={f} at={cw(133, '多模态')} x={1300} y={660}>
          <div style={{transform: 'rotate(2deg)'}}>
            <Tag text="它看得懂图：多模态" size={36} />
          </div>
        </Rise>
      </>
    ),
    step: 4,
    hideMascot: true,
    sfx: [['whoosh', cf(129), 0.18], ['pop', cw(131, '不满意'), 0.22], ['click', cw(133, '多模态'), 0.22]],
  },
  // A 描述不出来的效果，截图就是最友好的提示词
  {
    roll: 'A',
    from: cf(134) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(134)} kicker="想要的风格也一样" text={'截图就是\n〔最友好〕的提示词'} size={96} x={AX} y={160} align="left" hiAt={cw(138, '最友好')} />
        <div style={{position: 'absolute', left: AX + 10, top: 520}}>
          <IconCards
            f={f}
            at={[cw(136, '描述'), cf(137)]}
            items={[
              ['bulb', '说不清', '描述不出想要的效果'],
              ['film', '截图', 'Agent 一看就懂'],
            ]}
            joinAt={cf(137) + 6}
            joiner="→"
            w={360}
            h={260}
            gap={90}
            titleSize={64}
          />
        </div>
      </>
    ),
    step: 4,
    eyes: 'happy',
    sfx: [['pop', cf(134), 0.22], ['paper', cw(136, '描述'), 0.22], ['paper', cf(137), 0.22], ['magic', cw(138, '最友好'), 0.22]],
  },
  // B 改完马上预览，不满意再截图：一个循环
  {
    roll: 'B',
    from: cf(139) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(139)} kicker="润色的节奏" text={'截图 → 改 → 〔预览〕'} size={80} x={BX} y={150} align="left" hiAt={cw(139, '预览')} />
        <div style={{position: 'absolute', left: BX + 20, top: 330}}>
          <FlowCards f={f} at={[cf(139), cw(139, '预览'), cw(140, '截图')]} items={[['截图', '哪里不满意'], ['Agent 改', '看图改代码'], ['再预览', '不满意再截']]} />
        </div>
      </>
    ),
    step: 4,
    emotes: [['note', cw(140, '截图')]],
    sfx: [['pop', cf(139), 0.22], ['click', cw(139, '预览'), 0.22], ['magic', cw(140, '截图'), 0.2]],
  },

  // ───────── 结尾 ─────────
  // A 本期分享到这里，下期再见，别忘了点赞关注
  {
    roll: 'A',
    from: cf(141) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(141)} kicker="本期就到这里" text={'我们下期\n〔再见〕'} size={120} x={AX} y={160} align="left" hiAt={cw(142, '再见')} />
        <div style={{position: 'absolute', left: AX - 20, top: 570}}>
          <FollowCard f={f} at={cf(143)} name="蔚蓝" line="带你用 AI 做视频" avatar={<span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 44, color: D.orangeDeep}}>蔚</span>} />
        </div>
      </>
    ),
    eyes: 'star',
    hop: true,
    sfx: [['pop', cf(141), 0.22], ['magic', cw(142, '再见'), 0.2], ['ding', cf(143) + 24, 0.22]],
  },
];
