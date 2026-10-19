import React from 'react';
import {clamp01, easeOut, easeOutBack} from '../../library/anim';
import type {DeskScene} from '../../library/warm-desk/DeskShow';
import {Badge, Chips, FilmStrip, FlowCards, IconCards, MysteryCards, PlayerCard, Rings} from '../../library/warm-desk/motifs';
import {CodeCard, FollowCard, Icon, ListCard} from '../../library/warm-desk/props';
import {ChapterTitle, Headline, Rise, SayBubble, Sparkle, Tag} from '../../library/warm-desk/stage';
import {D, DF, drift} from '../../library/warm-desk/theme';
import {cf, cw} from './cues';

/**
 * ep26 Opus 5.5 做视频（开场 52 秒试片）：暖纸工作台风 + 左下角真人出镜小窗。
 * A-roll：人物小窗放大到 540，右侧放大标题；B-roll：小窗缩到 330，卡片占主画面。
 * 右侧内容区：A-roll 时 x 680–1460，B-roll 时 x 440–1460（右下角留给吉祥物，底部留给字幕）。
 */

export const STEPS = ['底层原理', '脚手架', '蒸馏 Skill'];

/** 每个场景是 A-roll 还是 B-roll（和 SCENES 一一对应），出镜小窗据此放大 / 缩小 */
export type Roll = 'A' | 'B';

/** 往期作品的缩略画面：用各自风格的配色画一个极简示意（不是截图） */
const Thumb: React.FC<{kind: number; f: number}> = ({kind, f}) => {
  const W = 470;
  const H = 200;
  const glow = 0.6 + 0.4 * Math.sin(f / 12);
  if (kind === 0)
    return (
      <svg width={W} height={H}>
        <rect width={W} height={H} fill="#16110b" />
        {Array.from({length: 7}, (_, i) => (
          <line key={`v${i}`} x1={235 + (i - 3) * 30} y1={70} x2={235 + (i - 3) * 64} y2={H} stroke="#b8913f" strokeOpacity={0.45} />
        ))}
        {Array.from({length: 4}, (_, i) => (
          <line key={`h${i}`} x1={120 - i * 30} y1={70 + i * 38} x2={350 + i * 30} y2={70 + i * 38} stroke="#b8913f" strokeOpacity={0.45} />
        ))}
        <circle cx={235} cy={60} r={30} fill="#f3cf72" opacity={0.18 * glow} />
        <ellipse cx={235} cy={60} rx={7} ry={11} fill="#f3cf72" />
      </svg>
    );
  if (kind === 1)
    return (
      <svg width={W} height={H}>
        <rect width={W} height={H} fill="#141008" />
        {Array.from({length: 23}, (_, i) => {
          const x = 40 + (i % 12) * 35;
          const y = 70 + Math.floor(i / 12) * 60;
          const hi = i === 4 || i === 17;
          return <circle key={i} cx={x} cy={y} r={hi ? 10 : 7} fill={hi ? '#f3cf72' : '#6d5a35'} />;
        })}
        <path d={`M ${40 + 4 * 35} 60 Q ${(40 + 4 * 35 + 40 + 5 * 35) / 2} -10 ${40 + 5 * 35} 120`} stroke="#f3cf72" strokeWidth={3} fill="none" opacity={glow} />
      </svg>
    );
  if (kind === 2)
    return (
      <svg width={W} height={H}>
        <rect width={W} height={H} fill="#0e1620" />
        <rect x={90} y={90} width={120} height={110} fill="#1d2a38" stroke="#4fd1c5" strokeOpacity={0.5} />
        <circle cx={330} cy={100} r={26} fill="none" stroke="#e8f1f5" strokeWidth={2.5} />
        <path d="M330 64v20M330 116v20M294 100h20M346 100h20" stroke="#e8f1f5" strokeWidth={2.5} />
        <circle cx={330} cy={100} r={4} fill="#ff4d4d" opacity={glow} />
        <line x1={0} y1={170} x2={W} y2={170} stroke="#4fd1c5" strokeOpacity={0.25} strokeDasharray="6 8" />
      </svg>
    );
  return (
    <svg width={W} height={H}>
      <rect width={W} height={H} fill="#e4ddcf" />
      <rect x={70} y={40} width={210} height={120} fill="#1b1b1a" transform="rotate(-3 175 100)" />
      <rect x={96} y={78} width={140} height={14} fill="#eeeded" transform="rotate(-3 175 100)" />
      <rect x={96} y={104} width={96} height={10} fill="#dacf08" transform="rotate(-3 175 100)" />
      <path d="M300 150 L340 90 L380 120 L430 50" stroke="#b8433f" strokeWidth={4} fill="none" />
    </svg>
  );
};

/** 往期作品卡：缩略画面 + 中间播放钮 + 片名 + 风格标签；依次从下方翻起、错开倾斜，之后轻轻漂浮 */
const WORKS: [string, string][] = [
  ['棋盘上的麦粒', '暗金文献风'],
  ['生日悖论', '暗金文献风'],
  ['躲进掩体，还被打死？', '战术屏科普风'],
  ['英伟达 33 年', 'Vox 拼贴'],
];
const WorkCards: React.FC<{f: number; at: number; gap?: number}> = ({f, at, gap = 6}) => (
  <div style={{position: 'relative', width: 1000, height: 600, perspective: 1400}}>
    {WORKS.map(([title, style], i) => {
      const t = clamp01((f - at - i * gap) / 14);
      const p = easeOutBack(t);
      const x = (i % 2) * 510;
      const y = Math.floor(i / 2) * 300;
      const rot = [-2.5, 2, 2, -1.5][i];
      const [dx, dy] = drift(f, i, 5, 160);
      return (
        <div key={title} style={{position: 'absolute', left: x, top: y, width: 470, opacity: easeOut(t), transform: `translate(${dx}px, ${dy + (1 - p) * 80}px) rotateX(${(1 - p) * 35}deg) rotate(${rot}deg)`, transformOrigin: '50% 100%', background: D.card, borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
          <div style={{position: 'relative', height: 200}}>
            <Thumb kind={i} f={f} />
            <div style={{position: 'absolute', left: 235 - 30, top: 100 - 30, width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.25)'}}>
              <Icon kind="play" size={30} color={D.orange} />
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 20px'}}>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 32, color: D.ink, whiteSpace: 'nowrap'}}>{title}</div>
            <span style={{padding: '4px 12px', borderRadius: 10, background: D.tint, color: D.orangeDeep, fontFamily: DF.sans, fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap'}}>{style}</span>
          </div>
        </div>
      );
    })}
  </div>
);

export const SCENES: (DeskScene & {roll: Roll})[] = [
  // A1 开场：自我介绍 + 本期主题
  {
    roll: 'A',
    from: 0,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(2)} kicker="AI 实战分享 · 第 08 期" text={'Opus 5.5 做视频\n〔保姆级〕教程'} size={108} x={690} y={190} align="left" hiAt={cw(2, '保姆级')} />
        <div style={{position: 'absolute', left: 690, top: 600}}>
          <Chips f={f} at={cw(2, '教程') + 4} items={['理论', '实践', '手把手']} />
        </div>
        <div style={{position: 'absolute', left: 1250, top: 520}}>
          <Badge f={f} at={cf(1)} ring="OPUS 5.5 · VIBE VIDEO · OPUS 5.5 · VIBE VIDEO · " mid="5.5" />
        </div>
      </>
    ),
    eyes: 'happy',
    sfx: [['pop', cf(1), 0.26], ['magic', cw(2, '保姆级'), 0.22], ['paper', cw(2, '教程') + 4, 0.22]],
  },
  // B1 理论 + 实践：两张大卡
  {
    roll: 'B',
    from: cf(3) - 6,
    C: ({f}) => (
      <>
        <div style={{position: 'absolute', left: 500, top: 150}}>
          <IconCards
            f={f}
            at={[cw(3, '理论'), cw(3, '实践')]}
            items={[
              ['book', '理论', '为什么 AI 能做视频'],
              ['tool', '实践', '一步步做出成片'],
            ]}
            joinAt={cw(3, '实践') + 6}
          />
        </div>
        <Rise f={f} at={cw(4, '手把手')} x={760} y={590}>
          <div style={{transform: 'rotate(-3deg)'}}>
            <Tag text="手把手 · 从零到成片" size={40} />
          </div>
        </Rise>
      </>
    ),
    sfx: [['paper', cw(3, '理论'), 0.24], ['paper', cw(3, '实践'), 0.24], ['pop', cw(4, '手把手'), 0.24]],
  },
  // B2 「做出这样的爆款视频」：往期作品卡
  {
    roll: 'B',
    from: cf(5) - 6,
    C: ({f}) => (
      <>
        <div style={{position: 'absolute', left: 450, top: 150}}>
          <WorkCards f={f} at={cf(5)} />
        </div>
        <Sparkle f={f} at={cf(6) + 2} x={1290} y={110} r={150} />
        <Rise f={f} at={cf(6)} x={1130} y={86}>
          <div style={{transform: 'rotate(3deg)'}}>
            <Tag text="都是 AI 用代码做的" size={32} />
          </div>
        </Rise>
      </>
    ),
    emotes: [['!', cf(6)]],
    sfx: [['whoosh', cf(5), 0.2], ['pop', cf(6), 0.24]],
  },
  // A2 「看完本期你将收获什么呢」
  {
    roll: 'A',
    from: cf(7) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(7)} kicker="本期收获" text={'看完这期\n你能带走〔什么〕？'} size={108} x={690} y={200} align="left" hiAt={cw(8, '收获')} />
        <div style={{position: 'absolute', left: 700, top: 590}}>
          <MysteryCards f={f} at={cw(8, '什么')} />
        </div>
      </>
    ),
    eyes: 'wide',
    emotes: [['?', cw(8, '什么')]],
    sfx: [['pop', cf(7), 0.24], ['magic', cw(8, '收获'), 0.2], ['paper', cw(8, '什么'), 0.2]],
  },
  // B3 第一个：章节卡
  {roll: 'B', from: cf(9) - 6, C: ({f}) => <ChapterTitle f={f} at={cf(9)} n={1} title={STEPS[0]} y={420} cx={1000} />, step: 0, hop: true, sfx: [['ding', cf(9), 0.24], ['whoosh', cf(9) - 4, 0.16]]},
  // B4 AI 做视频最底层的东西（这一段后面有 4 秒停顿，清单逐行补满）+ 右侧胶片条
  {
    roll: 'B',
    from: cf(10) - 6,
    C: ({f}) => (
      <>
        <div style={{position: 'absolute', left: 440, top: 150}}>
          <ListCard
            f={f}
            at={cf(10)}
            gap={36}
            stack={2}
            accent="核心"
            title="AI 做视频.md"
            sub="它最底层、最核心的一个东西"
            rows={['视频 = 一张张图片连起来', '每一张 = 用代码算出来', '所以 AI 做视频 = 写代码']}
            hi={f >= cf(11) + 100 ? 2 : f >= cf(11) ? 1 : undefined}
            w={820}
          />
        </div>
        <div style={{position: 'absolute', left: 1300, top: 140}}>
          <FilmStrip f={f} at={cf(10) + 10} />
        </div>
      </>
    ),
    step: 0,
    emotes: [['!', cf(11) + 100]],
    sfx: [['paper', cf(10), 0.24], ['click', cf(11), 0.26], ['magic', cf(11) + 100, 0.22]],
  },
  // B5 第一性原理 → 方法和技巧：左标题，右同心圆
  {
    roll: 'B',
    from: cf(12) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(12)} kicker="底层逻辑" text={'从〔第一性原理〕\n去驾驭它'} size={92} x={450} y={170} align="left" hiAt={cw(12, '第一性原理') + 8} />
        <div style={{position: 'absolute', left: 920, top: 360}}>
          <Rings f={f} at={[cw(12, '第一性原理') + 8, cw(13, '方法'), cw(13, '技巧')]} labels={['原理', '方法', '技巧']} />
        </div>
      </>
    ),
    step: 0,
    eyes: 'happy',
    sfx: [['pop', cf(12), 0.22], ['click', cw(13, '方法'), 0.26], ['click', cw(13, '技巧'), 0.26]],
  },
  // B6 第二个：章节卡
  {roll: 'B', from: cf(14) - 6, C: ({f}) => <ChapterTitle f={f} at={cf(14)} n={2} title={STEPS[1]} y={420} cx={1000} />, step: 1, hop: true, sfx: [['ding', cf(14), 0.24], ['whoosh', cf(14) - 4, 0.16]]},
  // B7 脚手架工程：深色终端敲命令 → 弹出你的第一个视频
  {
    roll: 'B',
    from: cf(16) - 6,
    C: ({f}) => (
      <>
        <div style={{position: 'absolute', left: 450, top: 150}}>
          <CodeCard f={f} at={cf(16)} dark title="~/weilanx-claude-videos" per={28} w={820} lines={['git clone weilanx-claude-videos', 'npm install', 'npm run studio']} />
        </div>
        <Sparkle f={f} at={cw(17, '第一个视频') + 4} x={1160} y={590} r={260} n={12} />
        <div style={{position: 'absolute', left: 900, top: 440}}>
          <PlayerCard f={f} at={cw(17, '第一个视频')} line="我的" hi="第一条" caption="你自己的第一个视频" file="first.mp4" />
        </div>
      </>
    ),
    step: 1,
    sfx: [['type', cf(16), 0.22], ['type', cf(16) + 28, 0.2], ['type', cf(16) + 56, 0.2], ['magic', cw(17, '第一个视频'), 0.22]],
  },
  // B8 第三个：章节卡
  {roll: 'B', from: cf(18) - 6, C: ({f}) => <ChapterTitle f={f} at={cf(18)} n={3} title={STEPS[2]} y={420} cx={1000} />, step: 2, hop: true, sfx: [['ding', cf(18), 0.24], ['whoosh', cf(18) - 4, 0.16]]},
  // B9 蒸馏 Skill：参考视频 → Skill → 你的新风格
  {
    roll: 'B',
    from: cf(20) - 6,
    C: ({f}) => (
      <>
        <Rise f={f} at={cf(20)} x={460} y={150}>
          <SayBubble text="distill-video · 视频蒸馏 Skill" size={36} avatar="CC" />
        </Rise>
        <div style={{position: 'absolute', left: 450, top: 340}}>
          <FlowCards
            f={f}
            at={[cf(21), cw(21, '蒸馏'), cw(22, '所有的')]}
            items={[
              ['爆款视频', '你刷到的任意一条'],
              ['蒸馏 Skill', '拆出风格配方'],
              ['你的新风格', '一键做出同款'],
            ]}
          />
        </div>
      </>
    ),
    step: 2,
    emotes: [['note', cw(22, '所有的')]],
    sfx: [['pop', cf(20), 0.24], ['click', cf(21), 0.26], ['click', cw(21, '蒸馏'), 0.26], ['magic', cw(22, '所有的'), 0.22]],
  },
  // A3 点赞收藏
  {
    roll: 'A',
    from: cf(23) - 6,
    C: ({f}) => (
      <>
        <Headline f={f} at={cf(23)} kicker="看完别走" text={'强烈建议\n先〔点赞收藏〕'} size={108} x={690} y={160} align="left" hiAt={cw(23, '点赞')} />
        <div style={{position: 'absolute', left: 670, top: 560}}>
          <FollowCard f={f} at={cf(23) + 16} name="蔚蓝" line="带你用 AI 做视频" avatar={<span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 44, color: D.orangeDeep}}>蔚</span>} />
        </div>
      </>
    ),
    eyes: 'star',
    hop: true,
    sfx: [['pop', cf(23), 0.24], ['ding', cw(23, '点赞'), 0.22]],
  },
];
