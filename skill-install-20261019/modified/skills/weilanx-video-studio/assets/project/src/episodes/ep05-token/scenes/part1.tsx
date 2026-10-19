import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines, PopText} from '../../../library/fx';
import {Cross} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {Block} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

const WORD = 'strawberry';
const R_IDX = [2, 7, 8];
const PALETTE = ['#FFF3B8', C.tealLight, C.pink, '#FCE3A8', '#D9E4FF'];

/** 单个字母方块 */
const Letter: React.FC<{ch: string; size: number; hot?: number}> = ({ch, size, hot = 0}) => (
  <div style={{width: size, height: size, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hot > 0.5 ? C.yellow : C.white, border: `4px solid ${C.ink}`, borderRadius: size * 0.18, ...txt(size * 0.62), lineHeight: 1, transform: `translateY(${-hot * 18}px)`, boxShadow: '3px 4px 0 rgba(43,35,32,0.15)'}}>
    {ch}
  </div>
);

/* ---------- Q1 小测验：strawberry 里有几个 r ---------- */
const QX = 260;
const QT = 96;
const QG = 12;
const BOTS = [420, 720, 1020];

export const Q1Quiz: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(3);
  const countAt = cf(4);
  const twoAt = cw(7, '答');
  const crossAt = twoAt + 14;
  const lit = R_IDX.filter((_, k) => f >= countAt + k * 7).length;
  return (
    <>
      <Pop f={f} at={cf(1)} x={QX} y={0} rot={-3}>
        <Note color={C.yellow} size={38}>小测验</Note>
      </Pop>
      {[...WORD].map((ch, i) => {
        const k = R_IDX.indexOf(i);
        const at = countAt + k * 7;
        const hot = k >= 0 ? prog(f, at, 6, easeOut) * (1 - 0.6 * prog(f, at + 6, 8)) + (f >= at ? 0.6 : 0) : 0;
        return (
          <Pop key={i} f={f} at={cf(2) + i * 2} x={QX + i * (QT + QG)} y={90}>
            <Letter ch={ch} size={QT} hot={Math.min(1, hot)} />
          </Pop>
        );
      })}
      <Pop f={f} at={askAt} x={QX} y={235}>
        <div style={bigText(88, C.white)}>
          有几个 <span style={{color: C.yellow}}>r</span>？
        </div>
      </Pop>
      {lit > 0 && (
        <div style={{position: 'absolute', left: 900, top: 225, ...bigText(110, C.yellow), transform: `scale(${1 + 0.25 * (1 - prog(f, countAt + (lit - 1) * 7, 6))})`}}>
          {lit} 个
        </div>
      )}
      <Burst f={f} at={countAt + 14} x={1000} y={290} r={200} />
      {BOTS.map((x, i) => {
        const at = cf(6) + i * 4;
        if (f < at) return null;
        const hop = (1 - prog(f, at, 10, easeOut)) * 80;
        const dazed = f >= crossAt + i * 3;
        return (
          <React.Fragment key={i}>
            <Char f={f + i * 17} x={x + jolt(f, crossAt + i * 3, 10, 16)} y={790 - hop} s={0.75} kind="bot" eyes={dazed ? 'spiral' : f >= twoAt ? 'happy' : 'open'} lookX={0} armsUp={f >= twoAt && !dazed ? 0.6 : 0} />
            <Pop f={f} at={twoAt + i * 3} x={x - 90} y={420}>
              <Card w={180} h={84} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={txt(46)}>2 个！</div>
              </Card>
            </Pop>
            {dazed && (
              <div style={{position: 'absolute', left: x - 50, top: 412}}>
                <Cross size={100} p={prog(f, crossAt + i * 3, 8)} />
              </div>
            )}
            <Emote f={f} at={crossAt + i * 3 + 4} kind="sweat" x={x + 110} y={560} dur={36} />
          </React.Fragment>
        );
      })}
      <FocusLines f={f} at={crossAt} out={crossAt + 30} x={720} y={560} />
      <Pop f={f} at={crossAt + 6} x={1150} y={330} rot={6}>
        <div style={bigText(100, C.red)}>答错啦！</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= crossAt ? 'happy' : 'open'} />
    </>
  );
};
export const Q1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.4],
  ...[...WORD].map((_, i) => ['click', cf(2) + i * 2, 0.15] as SfxCue),
  ['question', cf(3), 0.35],
  ...R_IDX.map((_, k) => ['ding', cf(4) + k * 7, 0.3] as SfxCue),
  ['boing', cf(6), 0.3],
  ['pop', cw(7, '答'), 0.4],
  ['error', cw(7, '答') + 14, 0.4],
  ['boing', cw(7, '答') + 20, 0.35],
];

/* ---------- Q2 这么聪明的 AI，连字母都数不清？ ---------- */
export const Q2Blind: React.FC<{f: number}> = ({f}) => {
  const blindAt = cw(11, '看不到');
  const blur = prog(f, blindAt, 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(8)} x={80} y={10}>
        <div style={bigText(80, C.white)}>这么聪明的 AI</div>
      </Pop>
      <Pop f={f} at={cf(9)} x={80} y={120}>
        <div style={bigText(80, C.yellow)}>连字母都数不清？</div>
      </Pop>
      <Char f={f} x={400} y={790} s={1.3} kind="bot" eyes={f >= cf(10) ? 'flat' : f >= cf(9) ? 'wide' : 'open'} lookX={0.3} />
      <Emote f={f} at={cf(9) + 6} kind="?" x={560} y={400} />
      <Emote f={f} at={cf(10) + 4} kind="sweat" x={580} y={430} />
      <Pop f={f} at={cf(10)} x={860} y={240} rot={3}>
        <Note color={C.tealLight} size={40}>其实不怪它</Note>
      </Pop>
      <Pop f={f} at={cf(11)} x={860} y={340} enter="left">
        <Win w={700} h={300} title="AI 眼里的 strawberry">
          <div style={{position: 'relative', display: 'flex', gap: 8, padding: '30px 20px 110px'}}>
            {[...WORD].map((ch, i) => (
              <div key={i} style={{filter: `blur(${blur * 10}px)`, opacity: 1 - 0.7 * blur}}>
                <Letter ch={ch} size={56} />
              </div>
            ))}
            <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', ...bigText(70, C.yellow), opacity: blur}}>字母？看不到</div>
          </div>
        </Win>
      </Pop>
      <PiP f={f} at={cf(8) - 6} wear={['headphones']} />
    </>
  );
};
export const Q2Sfx: SfxCue[] = [
  ['pop', cf(9) - 6, 0.35],
  ['question', cf(9) + 4, 0.35],
  ['pop', cf(10), 0.3],
  ['whoosh', cf(11), 0.3],
  ['magic', cw(11, '看不到'), 0.3],
];

/* ---------- A3 开场：本期聊 token ---------- */
export const A3Intro: React.FC<{f: number}> = ({f}) => {
  const tokAt = cw(15, 'token');
  const wave = f >= cf(12) && f < cf(12) + 36;
  return (
    <Host f={f} wear={['headphones']} eyes={f >= tokAt ? 'star' : 'happy'} armsUp={wave ? 0.5 + 0.5 * Math.abs(Math.sin(f * 0.35)) : f >= tokAt && f < tokAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(13)} x={0} y={0} rot={-2}>
        <Note color={C.yellow}>本期话题</Note>
      </Pop>
      <Pop f={f} at={cw(14, '文字')} x={0} y={90}>
        <div style={bigText(80, C.white)}>AI 眼里的文字</div>
      </Pop>
      <Pop f={f} at={cw(14, '长什么')} x={0} y={190}>
        <div style={bigText(80, C.white)}>长什么样？</div>
      </Pop>
      <Pop f={f} at={tokAt} x={0} y={300} rot={-4}>
        <div style={bigText(170, C.yellow)}>token</div>
      </Pop>
      <FocusLines f={f} at={tokAt} out={tokAt + 36} x={300} y={380} />
      <Burst f={f} at={tokAt + 4} x={260} y={400} r={260} n={14} />
    </Host>
  );
};
export const A3Sfx: SfxCue[] = [
  ['pop', cf(13), 0.35],
  ['pop', cw(14, '文字'), 0.3],
  ['question', cw(14, '长什么'), 0.3],
  ['magic', cw(15, 'token'), 0.45],
];

/* ---------- B4 把一句话切成一块一块 ---------- */
const PIECES = ['今天', '天气', '真', '不错', '，', '我们', '去', '公园', '吧'];

export const B4Cut: React.FC<{f: number}> = ({f}) => {
  const cutAt = cw(17, '切成');
  const numAt = cf(18);
  return (
    <>
      <Pop f={f} at={cf(16)} x={140} y={40} rot={-2}>
        <Note size={36}>一句话</Note>
      </Pop>
      <Pop f={f} at={cf(16)} x={140} y={150} enter="up">
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          {PIECES.map((t, i) => {
            const s = i ? prog(f, cutAt + (i - 1) * 3, 8, easeOut) : 0;
            const colored = f >= cutAt + (i ? i - 1 : 0) * 3 + 4;
            return (
              <div key={i} style={{marginLeft: i ? lerp(-4, 22, s) : 0, transform: `rotate(${colored ? ((i % 3) - 1) * 3 * s : 0}deg)`, position: 'relative'}}>
                <Block text={t} size={104} color={colored ? PALETTE[i % PALETTE.length] : C.white} />
                {f >= numAt + i * 3 && (
                  <div style={{position: 'absolute', left: '50%', top: 126, transform: `translateX(-50%) scale(${prog(f, numAt + i * 3, 8, easeOut)})`, ...txt(34, C.white), width: 48, height: 48, borderRadius: 24, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                )}
              </div>
            );
          })}
        </div>
      </Pop>
      <PopText text="SNIP!" x={1180} y={110} t={f - cutAt} dur={24} size={80} fill={C.orange} />
      <Pop f={f} at={numAt + 6} x={140} y={420}>
        <div style={bigText(84, C.white)}>
          每一块 = 1 个 <span style={{color: C.yellow}}>token</span>
        </div>
      </Pop>
      <Burst f={f} at={numAt + 10} x={900} y={470} r={200} />
      <Pop f={f} at={numAt + 24} x={140} y={560}>
        <Note color={C.panel} size={30}>示意：具体怎么切，每个模型都不一样</Note>
      </Pop>
      <PiP f={f} at={cf(16) - 6} skin="chef" />
    </>
  );
};
export const B4Sfx: SfxCue[] = [
  ['paper', cf(16), 0.35],
  ['snip', cw(17, '切成'), 0.5],
  ['snip', cw(17, '切成') + 9, 0.35],
  ['snip', cw(17, '切成') + 18, 0.35],
  ...PIECES.map((_, i) => ['click', cf(18) + i * 3, 0.2] as SfxCue),
  ['ding', cf(18) + 6, 0.35],
];

/* ---------- B5 strawberry = str + aw + berry ---------- */
const GROUPS = [
  {t: 'str', from: 0, n: 3, cx: 430, color: '#FFF3B8'},
  {t: 'aw', from: 3, n: 2, cx: 700, color: C.tealLight},
  {t: 'berry', from: 5, n: 5, cx: 1010, color: C.pink},
];
const LT = 84;
const LX = 300;
const BY = 250;

/** 积木：盖子盖上后看不到里面的字 */
const Crate: React.FC<{t: string; color: string; lid: number}> = ({t, color, lid}) => (
  <div style={{position: 'relative'}}>
    <Block text={t} size={130} color={color} />
    {lid > 0 && (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${lid * 100}%`, boxSizing: 'border-box', background: color, border: `4px solid ${C.ink}`, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...txt(70), opacity: Math.min(1, lid * 3)}}>
        {lid > 0.8 ? '?' : ''}
      </div>
    )}
  </div>
);

export const B5Straw: React.FC<{f: number}> = ({f}) => {
  const mergeAt = cf(21);
  const lidAt = cf(23);
  const wrongAt = cw(24, '数错');
  return (
    <>
      {[...WORD].map((ch, i) => {
        const g = GROUPS.findIndex((x) => i >= x.from && i < x.from + x.n);
        const G = GROUPS[g];
        const p = prog(f, mergeAt + g * 10, 14, easeInOut);
        const tx = G.cx - (G.n * 60) / 2 + (i - G.from) * 60;
        const x = lerp(LX + i * (LT + 10), tx, p);
        const y = lerp(30, BY + 25, p);
        if (f < cf(19) + i || p >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: prog(f, cf(19) + i, 6), transform: `scale(${1 - 0.3 * p})`}}>
            <Letter ch={ch} size={LT} hot={R_IDX.includes(i) && f >= wrongAt ? 1 : 0} />
          </div>
        );
      })}
      {GROUPS.map((G, g) => {
        const at = mergeAt + g * 10 + 14;
        if (f < at) return null;
        const pop = prog(f, at, 8, easeOut);
        return (
          <div key={G.t} style={{position: 'absolute', left: G.cx, top: BY, transform: `translateX(-50%) scale(${0.7 + 0.3 * pop})`}}>
            <Crate t={G.t} color={G.color} lid={prog(f, lidAt + g * 5, 10, easeOut)} />
          </div>
        );
      })}
      <Pop f={f} at={mergeAt + 40} x={280} y={440}>
        <div style={bigText(64, C.white)}>
          strawberry = <span style={{color: C.yellow}}>3</span> 块积木
        </div>
      </Pop>
      <Pop f={f} at={cf(22)} x={280} y={550} rot={-2}>
        <Note color={C.tealLight} size={38}>
          它认的是<Marker p={prog(f, cf(22) + 6, 10)}>一整块</Marker>
        </Note>
      </Pop>
      <Pop f={f} at={lidAt + 6} x={660} y={550} rot={2}>
        <Note color={C.pink} size={38}>里面的字母看不到</Note>
      </Pop>
      <Char f={f} x={1330} y={760} s={1.0} kind="bot" eyes={f >= wrongAt ? 'spiral' : f >= cf(24) ? 'wide' : 'open'} lookX={-0.7} />
      <Pop f={f} at={cf(24)} x={1170} y={330}>
        <Card w={330} h={100} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(44)}>r 有… 2 个？</div>
        </Card>
      </Pop>
      <Emote f={f} at={wrongAt} kind="sweat" x={1480} y={470} />
      <Pop f={f} at={cw(24, '容易')} x={1120} y={170} rot={-5}>
        <div style={bigText(84, C.red)}>数错了！</div>
      </Pop>
      <PiP f={f} at={cf(19) - 6} skin="detective" />
    </>
  );
};
export const B5Sfx: SfxCue[] = [
  ...[...WORD].map((_, i) => ['click', cf(19) + i, 0.12] as SfxCue),
  ...GROUPS.map((_, g) => ['pop', cf(21) + g * 10 + 14, 0.35] as SfxCue),
  ['ding', cf(21) + 40, 0.3],
  ...GROUPS.map((_, g) => ['stamp', cf(23) + g * 5 + 6, 0.25] as SfxCue),
  ['question', cf(24), 0.3],
  ['error', cw(24, '数错'), 0.3],
  ['boing', cw(24, '容易'), 0.3],
];

/* ---------- B6 中文也一样 ---------- */
const CN = ['我', '今天', '想', '吃', '草莓', '蛋糕'];

export const B6Chinese: React.FC<{f: number}> = ({f}) => {
  const oneAt = cf(26);
  const manyAt = cf(27);
  return (
    <>
      <div style={{position: 'absolute', left: 200, top: 130, display: 'flex', gap: 28}}>
        {CN.map((t, i) => {
          const one = t.length === 1;
          const on = one ? f >= oneAt : f >= manyAt;
          const bump = one ? prog(f, oneAt, 8) * (1 - prog(f, oneAt + 8, 8)) : prog(f, manyAt, 8) * (1 - prog(f, manyAt + 8, 8));
          if (f < cf(25) + 8 + i * 3) return <div key={i} style={{width: 130}} />;
          return (
            <div key={i} style={{transform: `translateY(${-bump * 30}px) scale(${prog(f, cf(25) + 8 + i * 3, 8, easeOut)})`}}>
              <Block text={t} size={140} color={on ? (one ? C.tealLight : C.pink) : C.white} />
            </div>
          );
        })}
      </div>
      <Pop f={f} at={oneAt} x={200} y={360} enter="left">
        <Note color={C.tealLight} size={48}>有时候：一个字 = 一块</Note>
      </Pop>
      <Pop f={f} at={manyAt} x={200} y={470} enter="left">
        <Note color={C.pink} size={48}>有时候：几个字 = 一块</Note>
      </Pop>
      <Pop f={f} at={manyAt + 20} x={200} y={600}>
        <Note color={C.panel} size={30}>示意：具体怎么切，每个模型都不一样</Note>
      </Pop>
      <PiP f={f} at={cf(25) - 6} skin="cowboy" />
    </>
  );
};
export const B6Sfx: SfxCue[] = [
  ...CN.map((_, i) => ['pop', cf(25) + 8 + i * 3, 0.22] as SfxCue),
  ['ding', cf(26), 0.3],
  ['ding', cf(27), 0.3],
];
