import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, PlainFile} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {Dice} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/** 靶子：p 控制飞镖扎进去的进度 */
const Target: React.FC<{size?: number; p: number}> = ({size = 220, p}) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" style={{overflow: 'visible'}}>
    {[100, 74, 48, 22].map((r, i) => (
      <circle key={r} r={r} fill={i % 2 ? C.white : C.red} stroke={C.ink} strokeWidth={5} />
    ))}
    <g transform={`translate(${(1 - p) * 160} ${-(1 - p) * 160}) rotate(-45)`} opacity={p > 0 ? 1 : 0}>
      <line x1={0} y1={0} x2={0} y2={-110} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
      <path d="M0 -110 L-18 -140 L0 -128 L18 -140 Z" fill={C.yellow} stroke={C.ink} strokeWidth={4} />
    </g>
  </svg>
);

/* ---------- P7 做法一：说清目标（给谁看、干什么用） ---------- */
const REPORT = [
  {t: '项目进度', keep: true},
  {t: '本周风险', keep: true},
  {t: '每天开了几个会', keep: false},
  {t: '午饭吃了什么', keep: false},
];

export const P7Goal: React.FC<{f: number}> = ({f}) => {
  const hitAt = cw(25, '目标');
  const whoAt = cw(26, '给谁');
  const useAt = cf(27);
  const bossAt = cw(28, '老板');
  const riskAt = cw(29, '进度');
  const docAt = cf(30);
  const cutAt = cw(31, '省略');
  return (
    <>
      <div style={{position: 'absolute', left: 60, top: 30, opacity: prog(f, cf(25), 6)}}>
        <Target size={200} p={prog(f, hitAt, 10, easeOut)} />
      </div>
      <Burst f={f} at={hitAt + 8} x={160} y={130} r={160} />
      <Pop f={f} at={cf(25) + 4} x={300} y={70} rot={-2}>
        <div style={bigText(100, C.yellow)}>说清目标</div>
      </Pop>
      {[
        {q: '给谁看？', a: '老板', at: whoAt, aAt: bossAt, x: 60},
        {q: '干什么用？', a: '看进度和风险', at: useAt, aAt: riskAt, x: 560},
      ].map((c) => (
        <Pop key={c.q} f={f} at={c.at} x={c.x} y={280} enter="up">
          <Card w={460} h={200} bg={C.white}>
            <div style={txt(46)}>{c.q}</div>
            <div style={{marginTop: 18, opacity: prog(f, c.aAt, 6)}}>
              <span style={{...txt(46, C.teal)}}>→ {c.a}</span>
            </div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={docAt} x={60} y={530} enter="up">
        <Card w={740} h={350} bg="#FFFDF7">
          <div style={txt(36, C.inkSoft)}>它写周报时就知道</div>
          {REPORT.map((r, i) => (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, opacity: prog(f, docAt + 4 + i * 4, 6)}}>
              {r.keep ? <Check size={40} /> : <Cross size={40} p={prog(f, cutAt + (i - 2) * 5, 6)} />}
              <div style={{...txt(40, r.keep ? C.ink : C.inkSoft), position: 'relative'}}>
                {r.keep ? <Marker p={prog(f, docAt + 10 + i * 6, 10)}>{r.t}</Marker> : r.t}
                {!r.keep && f >= cutAt && <div style={{position: 'absolute', left: -4, top: '52%', height: 5, width: `${prog(f, cutAt + (i - 2) * 5, 8) * 104}%`, background: C.red, borderRadius: 3}} />}
              </div>
              <div style={txt(30, r.keep ? C.teal : C.red)}>{r.keep ? '突出' : f >= cutAt ? '省略' : ''}</div>
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={cutAt + 14} x={60} y={910} rot={-3}>
        <div style={bigText(72, C.yellow)}>它知道该写什么了</div>
      </Pop>
      <PiP f={f} at={cf(25) - 6} skin="santa" eyes={f >= cutAt + 14 ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const P7Sfx: SfxCue[] = [
  ['whoosh', cw(25, '目标'), 0.35],
  ['ding', cw(25, '目标') + 10, 0.4],
  ['pop', cw(26, '给谁'), 0.3],
  ['pop', cf(27), 0.3],
  ['click', cw(28, '老板'), 0.3],
  ['click', cw(29, '进度'), 0.3],
  ['paper', cf(30), 0.3],
  ['snip', cw(31, '省略'), 0.35],
  ['magic', cw(31, '省略') + 14, 0.35],
];

/* ---------- P8 做法二：把背景和材料给它 ---------- */
const NOTES = [
  {t: '周一 修了登录 bug', c: '#FCE3A8', x: 60, r: -5},
  {t: '周三 支付接口卡住', c: C.pink, x: 380, r: 3},
  {t: '周五 客户改需求', c: C.tealLight, x: 700, r: -2},
];

export const P8Context: React.FC<{f: number}> = ({f}) => {
  const pasteAt = cw(35, '贴进');
  const fly = prog(f, pasteAt - 6, 14, easeInOut);
  const inAt = pasteAt + 8;
  const awayAt = cf(36);
  const guessAt = cw(37, '猜');
  return (
    <>
      <Pop f={f} at={cf(32)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          把<span style={{color: C.yellow}}>背景和材料</span>给它
        </div>
      </Pop>
      {NOTES.map((n, i) => (
        <Pop key={n.t} f={f} at={cw(33, '哪些') + i * 8} out={inAt} x={n.x} y={170} rot={n.r} still>
          <div style={{transform: `translate(${lerp(0, 200 - n.x, fly)}px, ${fly * 260}px) scale(${1 - 0.5 * fly})`}}>
            <div style={{...txt(34), width: 280, height: 120, background: n.c, border: `4px solid ${C.ink}`, borderRadius: 8, padding: '14px 16px', boxSizing: 'border-box', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))', whiteSpace: 'normal'}}>{n.t}</div>
          </div>
        </Pop>
      ))}
      <Pop f={f} at={cf(34)} x={420} y={330} rot={3}>
        <Note color={C.panel} size={38}>几行零散的笔记也行</Note>
      </Pop>
      <Pop f={f} at={cf(32) + 10} x={60} y={420} enter="up">
        <Win w={960} h={220} title="发给 AI">
          <div style={{padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14}}>
            {f >= inAt && (
              <div style={{display: 'flex', justifyContent: 'flex-end', opacity: prog(f, inAt, 6)}}>
                <div style={{...txt(34), background: '#FCE3A8', border: `4px solid ${C.ink}`, borderRadius: 12, padding: '6px 14px'}}>附件：我这周的笔记 × 3</div>
              </div>
            )}
            <Bubble me text="帮我写份周报" />
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={awayAt} x={60} y={680} enter="left">
        <Card w={720} h={150} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px'}}>
          <Dice size={100} rot={f >= guessAt ? Math.sin(f * 0.4) * 14 : 0} />
          <div style={txt(44)}>它不在你的工作现场</div>
        </Card>
      </Pop>
      <Emote f={f} at={awayAt + 6} kind="?" x={760} y={690} />
      <FocusLines f={f} at={guessAt} out={guessAt + 30} x={400} y={940} />
      <Pop f={f} at={cf(37)} x={60} y={870} rot={-3}>
        <div style={{...bigText(88, C.red), transform: `translateX(${jolt(f, guessAt, 12, 14)}px)`}}>不说就只能猜</div>
      </Pop>
      <Pop f={f} at={cw(35, '贴进') + 20} x={90} y={590}>
        <Note color={C.panel} size={24}>示例内容</Note>
      </Pop>
      <PiP f={f} at={cf(32) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const P8Sfx: SfxCue[] = [
  ['pop', cf(32), 0.35],
  ...NOTES.map((_, i) => ['paper', cw(33, '哪些') + i * 8, 0.25] as SfxCue),
  ['pop', cf(34), 0.3],
  ['paper', cf(32) + 10, 0.3],
  ['whoosh', cw(35, '贴进') - 6, 0.4],
  ['ding', cw(35, '贴进') + 8, 0.35],
  ['question', cf(36), 0.3],
  ['error', cw(37, '猜'), 0.4],
];

/* ---------- P9 做法三：讲明白要什么样，说不清就给例子 ---------- */
const SPECS = [
  {t: '300 字左右', w: '多少字'},
  {t: '分 3 点', w: '分几点'},
  {t: '语气简洁', w: '语气'},
];
const ADJ = ['专业', '简洁', '有深度', '高级感', '有条理', '接地气', '重点突出', '生动', '干货满满', '别太长'];

export const P9Example: React.FC<{f: number}> = ({f}) => {
  const lostAt = cf(40);
  const exAt = cw(41, '例子');
  const adjAt = cw(43, '十句');
  const winAt = cw(43, '管用');
  return (
    <>
      <Pop f={f} at={cf(38)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          讲明白<span style={{color: C.yellow}}>要什么样</span>
        </div>
      </Pop>
      {SPECS.map((s, i) => (
        <Pop key={s.t} f={f} at={cw(39, s.w)} x={60 + i * 320} y={150}>
          <div style={{...txt(44), background: C.tealLight, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 22px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{s.t}</div>
        </Pop>
      ))}
      <Pop f={f} at={lostAt} x={60} y={270} rot={-2}>
        <Note color={C.yellow} size={42}>实在说不清？那就给个例子</Note>
      </Pop>
      <Pop f={f} at={exAt} x={60} y={380} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={320} h={300} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <PlainFile name="上次的周报" size={140} />
            <div style={txt(36)}>一个例子</div>
          </Card>
          {f >= winAt && <div style={{position: 'absolute', right: -20, top: -20}}><Check size={90} p={prog(f, winAt, 8)} /></div>}
        </div>
      </Pop>
      <Burst f={f} at={winAt + 2} x={220} y={530} r={220} />
      <Pop f={f} at={cf(42)} x={400} y={480}>
        <div style={bigText(90, C.red)}>&gt;</div>
      </Pop>
      <Pop f={f} at={cf(42)} x={500} y={380}>
        <Card w={520} h={300} bg="#E6E1D6" style={{display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: 10}}>
          {ADJ.map((a, i) => (
            <div key={a} style={{...txt(32, f >= winAt ? C.inkSoft : C.ink), opacity: prog(f, adjAt + i * 2, 4) * (f >= winAt ? 0.5 : 1), background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 12px'}}>{a}的</div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={adjAt} x={620} y={700}>
        <Note color={C.panel} size={34}>十句形容词</Note>
      </Pop>
      <FocusLines f={f} at={winAt} out={winAt + 30} x={400} y={920} />
      <Pop f={f} at={winAt} x={60} y={860} rot={-3}>
        <div style={bigText(96, C.yellow)}>一个例子更管用</div>
      </Pop>
      <PiP f={f} at={cf(38) - 6} skin="chef" eyes={f >= winAt ? 'star' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const P9Sfx: SfxCue[] = [
  ['pop', cf(38), 0.35],
  ...SPECS.map((s) => ['click', cw(39, s.w), 0.3] as SfxCue),
  ['question', cf(40), 0.3],
  ['paper', cw(41, '例子'), 0.35],
  ['pop', cf(42), 0.3],
  ['type', cw(43, '十句'), 0.3],
  ['ding', cw(43, '管用'), 0.45],
  ['magic', cw(43, '管用') + 4, 0.3],
];

/* ---------- P10 回头看看说明书：补上目标、背景、要求 ---------- */
const FIX = [
  {t: '目标', w: '目标'},
  {t: '背景', w: '背景'},
  {t: '要求', w: '要求'},
];

export const P10Recap: React.FC<{f: number}> = ({f}) => {
  const lookAt = cf(46);
  const fixAt = cf(48);
  const newAt = cw(49, '换了');
  return (
    <HostTall f={f} skin="detective" eyes={f >= newAt ? 'star' : 'open'} armsUp={f >= newAt && f < newAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(44)} out={lookAt - 4} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={44}>AI 答得不满意？</Note>
      </Pop>
      <Pop f={f} at={cf(45)} out={lookAt - 4} x={20} y={110} rot={-2}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={bigText(96, C.white)}>先别急着换 AI</div>
          <Cross size={90} p={prog(f, cf(45) + 10, 8)} />
        </div>
      </Pop>
      <Pop f={f} at={lookAt} out={fixAt - 4} x={0} y={0} rot={-2}>
        <div style={bigText(80, C.white)}>
          说明书是不是<span style={{color: C.red}}>只有一句</span>？
        </div>
      </Pop>
      <Pop f={f} at={cf(47)} out={fixAt - 4} x={60} y={130}>
        <Bubble me text="帮我写份周报" size={46} />
      </Pop>
      {FIX.map((x, i) => (
        <Pop key={x.t} f={f} at={cw(48, x.w)} x={i * 250} y={0}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            {i > 0 && <div style={bigText(64, C.ink, C.white)}>+</div>}
            <div style={{...txt(54), background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 22px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{x.t}</div>
          </div>
        </Pop>
      ))}
      <FocusLines f={f} at={newAt} out={newAt + 40} x={480} y={230} />
      <Pop f={f} at={newAt} x={20} y={130} rot={-3}>
        <div style={bigText(120, C.yellow)}>像换了一个人！</div>
      </Pop>
      <Burst f={f} at={newAt + 4} x={480} y={200} r={320} n={16} />
    </HostTall>
  );
};
export const P10Sfx: SfxCue[] = [
  ['question', cf(44), 0.3],
  ['error', cf(45) + 10, 0.3],
  ['whoosh', cf(46), 0.3],
  ['type', cf(47), 0.3],
  ...FIX.map((x) => ['pop', cw(48, x.w), 0.3] as SfxCue),
  ['magic', cw(49, '换了'), 0.5],
];

/* ---------- P11 结尾 ---------- */
export const P11Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(51);
  return (
    <>
      <HostTall f={f} skin="cowboy" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(50)} x={0} y={20}>
          <div style={bigText(100, C.white)}>本期就到这里</div>
        </Pop>
        <Pop f={f} at={byeAt} x={40} y={160} rot={-4}>
          <div style={bigText(160, C.yellow)}>下期再见！</div>
        </Pop>
      </HostTall>
      <div style={{position: 'absolute', left: 0, top: -120, width: 1080, height: 1440, pointerEvents: 'none', opacity: prog(f, byeAt, 6, easeOut)}}>
        <Confetti t={f - byeAt} w={1080} h={1440} n={100} />
      </div>
    </>
  );
};
export const P11Sfx: SfxCue[] = [
  ['pop', cf(50), 0.4],
  ['confetti', cf(51), 0.5],
  ['ding', cf(51) + 2, 0.3],
];
