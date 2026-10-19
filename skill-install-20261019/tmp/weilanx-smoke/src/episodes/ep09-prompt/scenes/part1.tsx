import React from 'react';
import {easeInOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Bulb, Check, Cross, Stamp, stampScale} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {Dice} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

export const Bubble: React.FC<{text: string; me?: boolean; color?: string; size?: number}> = ({text, me, color, size = 38}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(size), background: color ?? (me ? C.pink : C.white), border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px'}}>{text}</div>
  </div>
);

/** 灰色占位文字行，表示“一段写满了的内容” */
const Lines: React.FC<{n: number; w?: number[]}> = ({n, w = [92, 80, 86, 70]}) => (
  <>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{height: 18, width: `${w[i % w.length]}%`, background: '#E4DED2', borderRadius: 9, marginTop: 16}} />
    ))}
  </>
);

/* ---------- P1 钩子：同一个 AI，一份废话、一份能直接发给老板 ---------- */
const DULL = ['本周工作稳步推进，各项任务有序开展，', '团队协作良好，下周将继续努力。'];
const GOOD = ['登录页改版已上线', '支付接口延期两天，原因已查明', '下周风险：客户可能再改需求'];

export const P1Hook: React.FC<{f: number}> = ({f}) => {
  const dullAt = cw(3, '正确');
  const goodAt = cf(4);
  const bossAt = cw(5, '老板');
  const sameAt = cw(6, '同一个');
  const whyAt = cf(7);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20}>
        <Note color={C.panel} size={44}>让 AI 帮忙写一份周报</Note>
      </Pop>
      <Pop f={f} at={cf(2)} x={60} y={110} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={960} h={250} bg="#E6E1D6">
            <div style={txt(34, C.inkSoft)}>回答 A</div>
            {DULL.map((t, i) => (
              <div key={t} style={{...txt(40, C.inkSoft), marginTop: 14, opacity: prog(f, cf(2) + 6 + i * 6, 6)}}>{t}</div>
            ))}
          </Card>
          {f >= dullAt && (
            <div style={{position: 'absolute', right: 30, top: 20, transform: `scale(${stampScale(f, dullAt)}) rotate(-8deg)`}}>
              <Stamp text="正确的废话" size={50} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={goodAt} x={60} y={400} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={960} h={290} bg={C.tealLight}>
            <div style={txt(34, C.teal)}>回答 B</div>
            {GOOD.map((t, i) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, opacity: prog(f, goodAt + 6 + i * 6, 6)}}>
                <Check size={44} />
                <div style={txt(40)}>{t}</div>
              </div>
            ))}
            <div style={{...txt(22, C.inkSoft), position: 'absolute', left: 30, bottom: 12}}>示例内容</div>
          </Card>
          {f >= bossAt && (
            <div style={{position: 'absolute', right: 30, top: 20, transform: `scale(${stampScale(f, bossAt)}) rotate(-6deg)`}}>
              <Stamp text="直接发老板" size={50} color={C.teal} />
            </div>
          )}
        </div>
      </Pop>
      <FocusLines f={f} at={sameAt} out={sameAt + 30} x={400} y={800} />
      <Pop f={f} at={sameAt} x={60} y={730} rot={-3}>
        <div style={{...bigText(96, C.red), transform: `translateX(${jolt(f, sameAt, 12, 14)}px)`}}>还是同一个 AI！</div>
      </Pop>
      <Pop f={f} at={whyAt} x={60} y={880} rot={2}>
        <div style={bigText(80, C.yellow)}>差别在哪？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= sameAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const P1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['paper', cf(2), 0.3],
  ['stamp', cw(3, '正确'), 0.45],
  ['paper', cf(4), 0.3],
  ['stamp', cw(5, '老板'), 0.45],
  ['error', cw(6, '同一个'), 0.4],
  ['shake', cw(6, '同一个') + 2, 0.25],
  ['question', cf(7), 0.35],
];

/* ---------- P2 这句话叫提示词 Prompt ---------- */
export const P2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(10, '提示词');
  const enAt = cw(10, 'Prompt');
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(8)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>答案就藏在你发给它的那句话里</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={190} />
      <Pop f={f} at={nameAt} x={40} y={80} rot={-3}>
        <div style={bigText(170, C.yellow)}>提示词</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={300} y={170} r={300} n={16} />
      <Pop f={f} at={enAt} x={560} y={140} rot={4}>
        <div style={bigText(110, C.white)}>Prompt</div>
      </Pop>
    </HostTall>
  );
};
export const P2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.3],
  ['magic', cw(10, '提示词'), 0.5],
  ['pop', cw(10, 'Prompt'), 0.35],
];

/* ---------- P3 提示词 = 交给 AI 的任务说明书 ---------- */
const MANUAL = ['目标', '背景', '要求'];

export const P3Manual: React.FC<{f: number}> = ({f}) => {
  const bookAt = cw(12, '任务说明书');
  const smartAt = cf(13);
  return (
    <>
      <Pop f={f} at={cf(11)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          提示词 <span style={{color: C.yellow}}>=</span>
        </div>
      </Pop>
      <Pop f={f} at={bookAt} x={80} y={160} rot={-3} enter="drop">
        <Card w={520} h={620} bg="#FFFDF7">
          <div style={{...txt(56), textAlign: 'center'}}>任务说明书</div>
          <div style={{borderTop: `4px solid ${C.ink}`, margin: '14px 0 10px'}} />
          {MANUAL.map((t, i) => (
            <div key={t} style={{marginTop: 18, opacity: prog(f, bookAt + 10 + i * 5, 6)}}>
              <div style={txt(40, C.orangeDark)}>{i + 1}. {t}</div>
              <Lines n={2} />
            </div>
          ))}
        </Card>
      </Pop>
      <Burst f={f} at={bookAt + 6} x={340} y={200} r={200} />
      <Pop f={f} at={cf(12) + 4} x={640} y={130} rot={3}>
        <Note color={C.tealLight} size={40}>交给 AI 的</Note>
      </Pop>
      <Char f={f} x={800} y={720} s={1.3} kind="bot" eyes={f >= smartAt ? 'star' : 'open'} lookX={-0.6} opacity={prog(f, cf(12), 8)} />
      {f >= smartAt && (
        <div style={{position: 'absolute', left: 740, top: 290, opacity: prog(f, smartAt, 6)}}>
          <Bulb size={120} glow={0.6 + 0.4 * Math.abs(Math.sin(f * 0.2))} />
        </div>
      )}
      <Pop f={f} at={smartAt} x={640} y={760} rot={-3}>
        <div style={bigText(70, C.yellow)}>AI 很聪明</div>
      </Pop>
      <PiP f={f} at={cf(11) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const P3Sfx: SfxCue[] = [
  ['pop', cf(11), 0.3],
  ['whoosh', cw(12, '任务说明书'), 0.35],
  ['paper', cw(12, '任务说明书') + 8, 0.35],
  ['ding', cf(13), 0.4],
];

/* ---------- P4 它像一个第一天来上班的实习生 ---------- */
const ASKS = [
  {t: '你老板是谁？', n: 15},
  {t: '你这周忙了啥？', n: 16},
  {t: '要多长？什么风格？', n: 17},
];

export const P4Intern: React.FC<{f: number}> = ({f}) => {
  const internAt = cw(14, '实习生');
  return (
    <>
      <Pop f={f} at={cf(14)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          它像个<span style={{color: C.yellow}}>新来的实习生</span>
        </div>
      </Pop>
      <Char f={f} x={250} y={800} s={1.6} kind="bot" eyes={f >= cf(15) ? 'flat' : 'happy'} lookX={0.5} opacity={prog(f, cf(14), 8)} />
      <Pop f={f} at={internAt} x={70} y={830} rot={-3}>
        <Note color={C.yellow} size={40}>实习生 · 上班第一天</Note>
      </Pop>
      {ASKS.map((a, i) => (
        <Pop key={a.t} f={f} at={cf(a.n)} x={470} y={170 + i * 150} enter="right">
          <Bubble text={a.t} size={44} color={i === 2 ? C.pink : C.white} />
        </Pop>
      ))}
      {ASKS.map((a, i) => (
        <Emote key={a.n} f={f} at={cf(a.n) + 2} kind="?" x={300 + i * 30} y={330} dur={30} />
      ))}
      <Pop f={f} at={cf(17) + 20} x={470} y={640} rot={2}>
        <div style={bigText(64, C.red)}>它全都不知道</div>
      </Pop>
      <PiP f={f} at={cf(14) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const P4Sfx: SfxCue[] = [
  ['pop', cf(14), 0.3],
  ['boing', cw(14, '实习生'), 0.35],
  ...ASKS.map((a) => ['question', cf(a.n), 0.3] as SfxCue),
  ['error', cf(17) + 20, 0.3],
];

/* ---------- P5 只丢一句话，它只能猜，结果一堆套话 ---------- */
export const P5Guess: React.FC<{f: number}> = ({f}) => {
  const oneAt = cw(18, '帮我');
  const guessAt = cw(19, '猜');
  const boilerAt = cf(20) + 6; // 「套话」在句尾，挂在句首附近，免得刚盖章就切场景
  return (
    <>
      <Pop f={f} at={cf(18)} x={60} y={30} enter="up">
        <Win w={960} h={200} title="发给 AI">
          <div style={{padding: '30px 30px'}}>{f >= oneAt && <Bubble me text="帮我写份周报" size={46} />}</div>
        </Win>
      </Pop>
      <Pop f={f} at={oneAt + 8} x={80} y={120} rot={-4}>
        <Note color={C.yellow} size={40}>就这一句</Note>
      </Pop>
      <Pop f={f} at={cf(19)} x={60} y={280} enter="left">
        <Card w={960} h={230} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px'}}>
          <Dice size={140} rot={f >= guessAt ? Math.sin(f * 0.4) * 14 : 0} />
          <div>
            <div style={txt(44)}>
              只能按<Marker p={prog(f, cw(19, '最常见'), 10)}>最常见、最保险</Marker>的样子
            </div>
            <div style={{...bigText(80, C.orange), marginTop: 8}}>去猜</div>
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cw(19, '猜') - 4} x={60} y={550} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, boilerAt, 12, 14)}px)`}}>
          <Card w={740} h={270} bg="#E6E1D6">
            <div style={txt(36, C.inkSoft)}>本周工作稳步推进……</div>
            <Lines n={4} />
          </Card>
          {f >= boilerAt && (
            <div style={{position: 'absolute', left: 380, top: 70, transform: `scale(${stampScale(f, boilerAt)}) rotate(-10deg)`}}>
              <Stamp text="套话" size={90} />
            </div>
          )}
        </div>
      </Pop>
      <FocusLines f={f} at={boilerAt + 4} out={boilerAt + 30} x={420} y={930} />
      <Pop f={f} at={boilerAt + 4} x={60} y={860} rot={-3}>
        <div style={bigText(100, C.red)}>结果全是套话</div>
      </Pop>
      <PiP f={f} at={cf(18) - 6} skin="detective" eyes={f >= boilerAt ? 'flat' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const P5Sfx: SfxCue[] = [
  ['paper', cf(18), 0.3],
  ['type', cw(18, '帮我'), 0.35],
  ['pop', cw(18, '帮我') + 8, 0.3],
  ['whoosh', cf(19), 0.3],
  ['shake', cw(19, '猜'), 0.3],
  ['paper', cw(19, '猜') - 4, 0.3],
  ['stamp', cf(20) + 6, 0.5],
  ['boing', cf(20) + 12, 0.3],
];

/* ---------- P6 问题不在 AI 笨，在说明书太短；那该写什么 ---------- */
const TIPS = ['说清目标', '给背景和材料', '讲明白要什么样'];

export const P6Short: React.FC<{f: number}> = ({f}) => {
  const shortAt = cw(22, '太短');
  const askAt = cf(23);
  const tipsAt = cf(24);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= tipsAt ? 'happy' : 'open'} armsUp={f >= tipsAt && f < tipsAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(21)} out={askAt - 4} x={0} y={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Note color={C.panel} size={44}>不是 AI 不够聪明</Note>
          <Cross size={70} p={prog(f, cf(21) + 10, 8, easeInOut)} />
        </div>
      </Pop>
      <FocusLines f={f} at={shortAt} out={shortAt + 30} x={480} y={200} />
      <Pop f={f} at={shortAt} out={askAt - 4} x={20} y={110} rot={-3}>
        <div style={bigText(110, C.red)}>是说明书太短了</div>
      </Pop>
      <Pop f={f} at={askAt} x={0} y={0} rot={-2}>
        <div style={bigText(90, C.yellow)}>好说明书写什么？</div>
      </Pop>
      {TIPS.map((t, i) => (
        <Pop key={t} f={f} at={tipsAt + 8 + i * 6} x={i * 40} y={130 + i * 72} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(44)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const P6Sfx: SfxCue[] = [
  ['pop', cf(21), 0.3],
  ['error', cw(22, '太短'), 0.4],
  ['question', cf(23), 0.35],
  ...TIPS.map((_, i) => ['click', cf(24) + 8 + i * 6, 0.3] as SfxCue),
];
