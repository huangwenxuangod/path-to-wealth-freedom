import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, Flag, Stamp, stampScale} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

export const Bubble: React.FC<{text: string; me?: boolean; color?: string; size?: number}> = ({text, me, color, size = 38}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(size), background: color ?? (me ? C.pink : C.white), border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px', whiteSpace: 'normal', lineHeight: 1.35}}>{text}</div>
  </div>
);

/** 一把尺子 */
export const Ruler: React.FC<{w?: number}> = ({w = 360}) => (
  <svg width={w} height={w * 0.22} viewBox="0 0 360 80">
    <rect x={4} y={10} width={352} height={60} rx={8} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    {Array.from({length: 17}, (_, i) => (
      <line key={i} x1={20 + i * 20} y1={10} x2={20 + i * 20} y2={i % 2 ? 30 : 44} stroke={C.ink} strokeWidth={4} />
    ))}
  </svg>
);

/* ---------- D1 钩子：它说全部改好了，一打开还是白屏、全是报错 ---------- */
const ERRORS = ['Uncaught TypeError: x is undefined', 'Failed to load resource: 500', 'Uncaught TypeError: x is undefined'];

export const D1Hook: React.FC<{f: number}> = ({f}) => {
  const doneAt = cf(3);
  const openAt = cf(5);
  const errAt = cf(7);
  const whyAt = cf(8);
  return (
    <>
      <Pop f={f} at={cf(2)} x={60} y={20} enter="up">
        <Win w={960} h={235} title="和 AI 对话">
          <div style={{padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12}}>
            <Bubble me text="帮我修一下这个网页" size={34} />
            {f >= doneAt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <Bubble text={f >= cf(4) ? '全部改好了！所有问题都已经修复' : '全部改好了！'} color={C.tealLight} size={34} />
                <Check size={44} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={openAt} x={60} y={275} enter="up">
        <div style={{transform: `translateX(${jolt(f, cf(6), 10, 12)}px)`}}>
          <Win w={960} h={280} title="浏览器 · 你的网页">
            <div style={{height: 210, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={txt(36, '#C9C2B6')}>{f >= cf(6) ? '（一片空白）' : '加载中……'}</div>
            </div>
          </Win>
        </div>
      </Pop>
      <Pop f={f} at={errAt} x={60} y={580} enter="up">
        <Win w={960} h={170} title="后台" dark>
          <div style={{padding: '14px 24px'}}>
            {ERRORS.map((e, i) => (
              <div key={i} style={{...txt(28, '#FF8A8A'), opacity: prog(f, errAt + 4 + i * 4, 4)}}>{e}</div>
            ))}
          </div>
        </Win>
      </Pop>
      <FocusLines f={f} at={whyAt} out={whyAt + 30} x={420} y={840} />
      <Pop f={f} at={whyAt} x={60} y={790} rot={-3}>
        <div style={bigText(80, C.red)}>说做完了，没做完？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= errAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const D1Sfx: SfxCue[] = [
  ['type', cf(2), 0.3],
  ['ding', cf(3), 0.35],
  ['whoosh', cf(5), 0.3],
  ['boing', cf(6), 0.3],
  ['error', cf(7), 0.45],
  ['question', cf(8), 0.4],
];

/* ---------- D2 它是怎么判断“做完了”的 ---------- */
export const D2Why: React.FC<{f: number}> = ({f}) => {
  const qAt = cf(11);
  return (
    <HostTall f={f} skin="santa" eyes={f >= qAt ? 'wide' : 'open'} armsUp={f >= qAt && f < qAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(10)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这背后的原因</Note>
      </Pop>
      <FocusLines f={f} at={qAt} out={qAt + 30} x={480} y={200} />
      <Pop f={f} at={qAt} x={20} y={110} rot={-3}>
        <div style={bigText(96, C.yellow)}>它怎么判断做完了？</div>
      </Pop>
      <Pop f={f} at={qAt + 10} x={760} y={230}>
        <Flag size={110} f={f} />
      </Pop>
    </HostTall>
  );
};
export const D2Sfx: SfxCue[] = [
  ['pop', cf(10), 0.3],
  ['question', cf(11), 0.45],
];

/* ---------- D3 循环要有停下来的依据：没标准，它读一遍就宣布完工 ---------- */
const LOOP = [
  {t: '做一步', w: '做一步'},
  {t: '看结果', w: '看一眼'},
  {t: '决定下一步', w: '决定'},
];

export const D3Loop: React.FC<{f: number}> = ({f}) => {
  const spin = (f * 0.03) % (Math.PI * 2);
  const stopAt = cf(15);
  const askAt = cf(17);
  const readAt = cf(20);
  const doneAt = cf(21);
  const neverAt = cf(22);
  return (
    <>
      <Pop f={f} at={cf(13)} x={60} y={30}>
        <div style={bigText(64, C.white)}>
          Agent 在<span style={{color: C.yellow}}>循环</span>里干活
        </div>
      </Pop>
      <svg width={460} height={360} style={{position: 'absolute', left: 60, top: 130, overflow: 'visible', opacity: prog(f, cf(14), 8)}}>
        <circle cx={230} cy={180} r={130} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="16 10" />
        <circle cx={230 + Math.cos(spin) * 130} cy={180 + Math.sin(spin) * 130} r={14} fill={C.orange} stroke={C.ink} strokeWidth={4} />
      </svg>
      {LOOP.map(({t, w}, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
        return (
          <Pop key={t} f={f} at={cw(14, w)} x={290 + Math.cos(a) * 130 - 80} y={310 + Math.sin(a) * 130 - 26}>
            <div style={{...txt(32), width: 160, textAlign: 'center', background: C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '2px 0'}}>{t}</div>
          </Pop>
        );
      })}
      <Pop f={f} at={stopAt} x={600} y={160}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Flag size={100} f={f} />
          <div style={txt(40)}>什么时候停？</div>
        </div>
      </Pop>
      <Pop f={f} at={cf(16)} x={620} y={300} rot={3}>
        <Note color={C.yellow} size={34}>得有个依据</Note>
      </Pop>
      <Pop f={f} at={askAt} x={60} y={520} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={760} h={290} bg="#FFFDF7">
            <Bubble me text="帮我修好它" size={36} />
            <div style={{...txt(32, C.inkSoft), marginTop: 14, opacity: prog(f, cf(18), 6)}}>
              检查标准：<span style={{color: C.red}}>（空）</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, opacity: prog(f, readAt, 6)}}>
              <div style={txt(34)}>AI：读了一遍代码……觉得没问题</div>
            </div>
          </Card>
          {f >= doneAt && (
            <div style={{position: 'absolute', right: 30, top: 170, transform: `scale(${stampScale(f, doneAt)}) rotate(-8deg)`}}>
              <Stamp text="完工！" size={56} />
            </div>
          )}
        </div>
      </Pop>
      <Char f={f} x={900} y={760} s={0.7} kind="bot" eyes={f >= doneAt ? 'happy' : 'open'} lookX={-0.5} opacity={prog(f, askAt, 8)} />
      <FocusLines f={f} at={neverAt} out={neverAt + 30} x={400} y={900} />
      <Pop f={f} at={neverAt} x={60} y={840} rot={-3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...bigText(76, C.red), transform: `translateX(${jolt(f, neverAt, 12, 14)}px)`}}>压根没真跑过！</div>
          <Cross size={70} p={prog(f, neverAt + 6, 8)} />
        </div>
      </Pop>
      <PiP f={f} at={cf(12) - 6} skin="cowboy" eyes={f >= neverAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const D3Sfx: SfxCue[] = [
  ['pop', cf(13), 0.3],
  ...LOOP.map((l) => ['click', cw(14, l.w), 0.25] as SfxCue),
  ['question', cf(15), 0.3],
  ['pop', cf(16), 0.3],
  ['type', cf(17), 0.3],
  ['click', cf(20), 0.25],
  ['stamp', cf(21), 0.45],
  ['error', cf(22), 0.4],
];

/* ---------- D4 像请人刷墙：只说刷好它 vs 刷完站远点看看；给它一把尺子 ---------- */
const Wall: React.FC<{w: number; h: number; painted: number; hole: boolean; check?: boolean}> = ({w, h, painted, hole, check}) => (
  <div style={{position: 'relative', width: w, height: h, boxSizing: 'border-box', border: `5px solid ${C.ink}`, borderRadius: 10, background: '#E6E1D6', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${painted * 100}%`, background: '#9FDCCD'}} />
    {hole && painted > 0.7 && (
      <div style={{position: 'absolute', left: w * 0.55, top: h * 0.3, width: 70, height: 60, background: '#E6E1D6', border: `3px dashed ${check ? C.red : 'transparent'}`, borderRadius: 10}} />
    )}
  </div>
);

export const D4Wall: React.FC<{f: number}> = ({f}) => {
  const p1 = prog(f, cf(25), 30, easeOut);
  const leaveAt = cf(26);
  const p2 = prog(f, cf(27), 30, easeOut);
  const lookAt = cf(28);
  const fixAt = cf(28) + 24;
  const rulerAt = cf(30);
  return (
    <>
      <Pop f={f} at={cf(24)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          就像请人来<span style={{color: C.yellow}}>刷墙</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(25)} x={60} y={130} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div>
            <div style={{...txt(34), marginBottom: 8}}>只说：刷好它</div>
            <Wall w={420} h={180} painted={p1} hole />
          </div>
          {f >= leaveAt && (
            <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, leaveAt, 6)}}>
              <Cross size={70} p={prog(f, leaveAt + 10, 8)} />
              <div style={txt(36, C.red)}>漏刷一块就走了</div>
            </div>
          )}
        </div>
      </Pop>
      <Char f={f} x={lerp(300, 1000, prog(f, leaveAt, 30, easeInOut))} y={470} s={0.6} kind="bot" walk={f >= leaveAt && f < leaveAt + 30} opacity={f < cf(27) ? prog(f, cf(25), 6) : 1 - prog(f, cf(27), 6)} />
      <Pop f={f} at={cf(27)} x={60} y={500} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div>
            <div style={{...txt(34), marginBottom: 8}}>加一句：刷完站远点看看</div>
            <Wall w={420} h={180} painted={p2} hole={f < fixAt} check={f >= lookAt} />
          </div>
          {f >= fixAt && (
            <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, fixAt, 6)}}>
              <Check size={70} />
              <div style={txt(36, C.teal)}>找到漏刷，补上了</div>
            </div>
          )}
        </div>
      </Pop>
      <Char f={f} x={lerp(300, 200, prog(f, lookAt, 14))} y={850} s={0.6} kind="bot" eyes={f >= lookAt ? 'wide' : 'open'} opacity={prog(f, cf(27), 6)} />
      <Emote f={f} at={lookAt + 6} kind="!" x={220} y={700} dur={30} />
      {f >= rulerAt && (
        <div style={{position: 'absolute', left: 340, top: 790, opacity: prog(f, rulerAt, 6), transform: `rotate(-6deg) scale(${lerp(0.6, 1, prog(f, rulerAt, 10, easeOut))})`}}>
          <Ruler w={260} />
        </div>
      )}
      <Burst f={f} at={cw(32, '尺子')} x={470} y={830} r={200} />
      <Pop f={f} at={cf(31)} x={330} y={880} rot={-3}>
        <div style={bigText(60, C.yellow)}>给它一把尺子</div>
      </Pop>
      <PiP f={f} at={cf(24) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const D4Sfx: SfxCue[] = [
  ['pop', cf(24), 0.35],
  ['paper', cf(25), 0.3],
  ['error', cf(26) + 10, 0.3],
  ['paper', cf(27), 0.3],
  ['question', cf(28), 0.3],
  ['ding', cf(28) + 24, 0.4],
  ['magic', cf(30), 0.35],
];
