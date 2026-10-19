import React from 'react';
import {easeInOut, lerp, prog, reach} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {cf, cw} from '../cues';
import {FONT_CODE} from '../../../library/fonts';
import {Coffee, Cross, Flag, Stamp, stampScale, ToolIcon, UserFace} from '../../../library/icons';
import {bigText, Card, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';

/* ---------------- S8 第三步：边看边做 ---------------- */

const StepCard: React.FC<{title: string; tool: 'list' | 'readVideo'}> = ({title, tool}) => (
  <Card w={700} h={110} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px'}}>
    <div style={{...txt(30, C.white), background: C.orange, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 12px'}}>调用工具</div>
    <ToolIcon kind={tool} size={64} />
    <div style={txt(42)}>{title}</div>
  </Card>
);

/** 视频缩略图：Python 课 or 剪辑课 */
const Thumb: React.FC<{kind: 'py' | 'cut'; w?: number}> = ({kind, w = 200}) => (
  <div style={{width: w, height: w * 0.62, border: `4px solid ${C.ink}`, borderRadius: 12, overflow: 'hidden', background: kind === 'py' ? '#2B2F36' : '#FDE2D6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
    {kind === 'py' ? (
      <>
        <div style={{fontFamily: FONT_CODE, fontSize: w * 0.15, color: '#9FE3D2'}}>print(&quot;hi&quot;)</div>
        <div style={txt(w * 0.12, '#F2C230')}>Python 第 1 课</div>
      </>
    ) : (
      <>
        <svg width={w * 0.4} height={w * 0.24} viewBox="0 0 100 60">
          <rect x="4" y="8" width="92" height="44" rx="4" fill={C.ink} />
          {[14, 34, 54, 74].map((x) => <rect key={x} x={x} y="18" width="14" height="24" rx="2" fill="#F7CFD6" />)}
        </svg>
        <div style={txt(w * 0.12)}>剪辑入门</div>
      </>
    )}
  </div>
);

const THUMBS: {name: string; kind: 'py' | 'cut'}[] = [
  {name: '学习资料.mp4', kind: 'py'},
  {name: '学习资料二.mp4', kind: 'py'},
  {name: '学习资料三.mp4', kind: 'cut'},
];

const COL = 330;

export const S8Run: React.FC<{f: number}> = ({f}) => {
  const puzzled = f >= cf(43) && f < cf(46);
  const walk = prog(f, cf(49), 26, easeInOut);
  const ax = lerp(170, 260, walk);
  const arm1 = reach(f, cf(39), cf(39) + 24);
  const arm2 = reach(f, cf(44), cf(44) + 24);
  const arm = arm1 > 0 ? {tx: COL + 40, ty: 70, ext: arm1} : arm2 > 0 ? {tx: COL + 40, ty: 510, ext: arm2} : null;
  return (
    <>
      <Pop f={f} at={cf(39)} x={COL} y={10} enter="right">
        <StepCard title="列出桌面上的文件" tool="list" />
      </Pop>
      <Pop f={f} at={cf(40) + 4} x={COL} y={140} enter="up">
        <Card w={700} h={290} bg="#E6F6F1" pad={20}>
          <div style={{...txt(32, C.white), display: 'inline-block', background: '#3DAA6B', border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 12px', marginBottom: 8}}>结果</div>
          {['学习资料.mp4', '学习资料二.mp4', '学习资料三.mp4', '截图(1).png · 未命名.docx …'].map((n, i) => {
            const like = i < 3 && f >= cw(42, '名字');
            return (
              <div key={n} style={{...txt(i < 3 ? 40 : 30, i < 3 ? C.ink : C.inkSoft), display: 'flex', alignItems: 'center', gap: 12}}>
                <span>· {like ? <Marker p={prog(f, cw(42, '名字') + i * 5, 8)}>{n}</Marker> : n}</span>
                {puzzled && i < 3 && <span style={{...txt(40, C.red), transform: `rotate(${Math.sin(f * 0.4 + i) * 12}deg)`, display: 'inline-block'}}>?</span>}
              </div>
            );
          })}
        </Card>
      </Pop>
      <Pop f={f} at={cf(44)} x={COL} y={460} enter="right">
        <StepCard title="读取视频 ×3" tool="readVideo" />
      </Pop>
      {THUMBS.map((t, i) => {
        const at = cf(45) + i * 7;
        const x = COL + i * 240;
        return (
          <React.Fragment key={t.name}>
            <Pop f={f} at={at} x={x} y={600}>
              <Thumb kind={t.kind} />
              <div style={{...txt(26), marginTop: 6, width: 210, textAlign: 'center'}}>{t.name}</div>
            </Pop>
            <Pop f={f} at={cw(47, '同一个项目') + i * 5} x={x + 10} y={790} rot={-3}>
              <div style={{...txt(30), background: t.kind === 'py' ? '#BFE7DF' : '#F7CFD6', border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 12px'}}>
                {t.kind === 'py' ? '项目：Python' : '项目：剪辑'}
              </div>
            </Pop>
          </React.Fragment>
        );
      })}
      {/* 1 和 2 疑似重复 */}
      {f >= cw(48, '重复') && (
        <>
          <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
            <path d={`M${COL + 100} 850 V880 H${COL + 340} V850`} pathLength={1} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="1 1" strokeDashoffset={1 - prog(f, cw(48, '重复'), 10)} strokeLinecap="round" />
          </svg>
          <Pop f={f} at={cw(48, '重复') + 8} x={COL + 220} y={915} center rot={-4}>
            <Stamp text="疑似重复" size={40} />
          </Pop>
        </>
      )}
      <Pop f={f} at={cf(49)} x={COL + 460} y={930} enter="left">
        <div style={{...txt(44), display: 'flex', alignItems: 'center', gap: 10}}>
          下一步
          <svg width={90} height={40}>
            <path d="M4 20 H80 M62 6 L82 20 L62 34" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Pop>
      <Char f={f} x={ax} y={1080} s={0.85} arm={arm} eyes={puzzled ? 'wide' : f >= cf(46) ? 'happy' : 'open'} walk={walk > 0 && walk < 1} lookX={arm ? 1 : 0} />
      <Pop f={f} at={cf(43)} out={cf(46)} x={ax} y={870} center>
        <div style={{...txt(90), transform: `rotate(${Math.sin(f * 0.3) * 12}deg)`}}>??</div>
      </Pop>
    </>
  );
};

export const S8Sfx: SfxCue[] = [
  ['whoosh', cf(39), 0.3],
  ['click', cf(39) + 8, 0.5],
  ['pop', cf(40) + 4, 0.45],
  ['question', cf(43), 0.45],
  ['whoosh', cf(44), 0.3],
  ['click', cf(44) + 8, 0.5],
  ...THUMBS.map((_, i) => ['pop', cf(45) + i * 7, 0.4] as SfxCue),
  ['ding', cf(46) + 4, 0.3],
  ...THUMBS.map((_, i) => ['click', cw(47, '同一个项目') + i * 5, 0.35] as SfxCue),
  ['stamp', cw(48, '重复') + 8, 0.5],
  ['whoosh', cf(49), 0.35],
];

/* ---------------- S9 关键：循环 ---------------- */

const CX = 540;
const CY = 470;
const R = 300;
const NODES = [
  {label: '思考下一步', ang: -90, at: cf(50)},
  {label: '调用工具', ang: 30, at: cw(52, '程序') + 10},
  {label: '看结果', ang: 150, at: cf(51)},
];
const pt = (ang: number, r = R) => [CX + Math.cos((ang * Math.PI) / 180) * r, CY + Math.sin((ang * Math.PI) / 180) * r];
const arc = (a0: number, a1: number) => {
  const [x0, y0] = pt(a0 + 22);
  const [x1, y1] = pt(a1 - 22);
  return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`;
};
const LAP = 72;

export const S9Loop: React.FC<{f: number}> = ({f}) => {
  const loopStart = cw(53, '循环');
  const running = f >= loopStart;
  const lapT = running ? (f - loopStart) / LAP : 0;
  const runAng = -90 + lapT * 360;
  const [rx, ry] = pt(runAng, R + 4);
  const steps = running ? Math.floor(lapT) + 1 : 0;
  const box = prog(f, cf(52), 24, easeInOut);
  const arrows = [
    {d: arc(150, 270), at: cw(51, '结果')}, // 看结果 → 思考
    {d: arc(-90, 30), at: cw(53, '循环') - 8}, // 思考 → 调用工具
    {d: arc(30, 150), at: cw(53, '循环')}, // 调用工具 → 看结果
  ];
  return (
    <>
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={40} y={60} width={1000} height={830} rx={40} pathLength={1} fill="none" stroke={C.teal} strokeWidth={6} strokeDasharray={box >= 1 ? '0.02 0.012' : `${box} 1`} />
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0 0 L8 4 L0 8 Z" fill={C.ink} />
          </marker>
        </defs>
        {arrows.map((a, i) => {
          const p = prog(f, a.at, 14, easeInOut);
          return p > 0 ? <path key={i} d={a.d} pathLength={1} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} markerEnd={p >= 1 ? 'url(#ah)' : undefined} /> : null;
        })}
      </svg>
      <Pop f={f} at={cf(52)} x={80} y={30} rot={-3}>
        <div style={{...txt(38, C.white), background: C.teal, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '2px 18px'}}>外面的程序</div>
      </Pop>
      {NODES.map((n) => {
        const [x, y] = pt(n.ang);
        const lit = running && Math.abs((((runAng - n.ang) % 360) + 360) % 360) < 25;
        return (
          <Pop key={n.label} f={f} at={n.at} x={x} y={y} center>
            <Card w={250} h={110} pad={0} bg={lit ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lit ? 1.08 : 1})`}}>
              <div style={txt(44)}>{n.label}</div>
            </Card>
          </Pop>
        );
      })}
      <Pop f={f} at={cw(54, '目标')} x={CX} y={CY} center>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Flag size={80} f={f} />
          <div style={txt(40)}>目标：整理好桌面</div>
          {steps > 0 && <div style={txt(34, C.inkSoft)}>第 {steps} 步</div>}
        </div>
      </Pop>
      {running && <Char f={f} x={rx} y={ry + 40} s={0.4} walk eyes="happy" />}
      {/* 你：喝着咖啡，不用说「继续」 */}
      <Pop f={f} at={cf(56)} x={120} y={930} enter="up" style={{display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <UserFace size={120} mood="happy" f={f} />
        <Coffee size={90} f={f} />
      </Pop>
      <Pop f={f} at={cf(56) + 6} x={420} y={930} enter="left">
        <div style={{position: 'relative'}}>
          <div style={{...txt(52), background: C.white, border: `4px solid ${C.ink}`, borderRadius: '28px 28px 28px 8px', padding: '10px 30px'}}>继续…继续…</div>
          <div style={{position: 'absolute', left: 90, top: -20}}>
            <Cross size={130} p={prog(f, cw(56, '继续') - 4, 10)} />
          </div>
        </div>
      </Pop>
    </>
  );
};

export const S9Sfx: SfxCue[] = [
  ['pop', cf(50), 0.45],
  ['pop', cf(51), 0.45],
  ['whoosh', cw(51, '结果'), 0.3],
  ['paper', cf(52), 0.35],
  ['pop', cw(52, '程序') + 10, 0.45],
  ['whoosh', cw(53, '循环') - 8, 0.35],
  ['ding', cw(53, '循环') + 14, 0.35],
  ['pop', cw(54, '目标'), 0.4],
  ['pop', cf(56), 0.35],
  ['snip', cw(56, '继续') - 2, 0.5],
];

/* ---------------- S10 AI Agent 是什么 ---------------- */

const DEFS = [
  {text: '围绕目标', at: cw(59, '围绕目标'), icon: 'flag'},
  {text: '调用工具', at: cw(59, '调用工具'), icon: 'tool'},
  {text: '根据结果调整', at: cw(60, '根据结果'), icon: 'loop'},
] as const;

export const S10Define: React.FC<{f: number}> = ({f}) => (
  <>
    <Pop f={f} at={cf(57)} x={80} y={30} enter="up">
      <Card w={920} h={860} bg={C.white}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
          <div style={bigText(110, C.yellow)}>AI Agent</div>
          <div style={txt(90)}>=</div>
        </div>
        <div style={{...txt(40, C.inkSoft), marginTop: 6, opacity: prog(f, cf(58), 10)}}>其实就是这样一套…</div>
        {DEFS.map((d, i) => {
          const s = stampScale(f, d.at);
          return (
            <div key={d.text} style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: i ? 34 : 40, height: 130}}>
              <div style={{width: 110, display: 'flex', justifyContent: 'center', opacity: s ? 1 : 0.15}}>
                {d.icon === 'flag' ? <Flag size={80} f={f} /> : d.icon === 'tool' ? <ToolIcon kind="moveFile" size={100} /> : (
                  <svg width={100} height={100} viewBox="0 0 100 100">
                    <path d="M78 34 A32 32 0 1 0 82 62" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
                    <path d="M64 30 L80 34 L82 16" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {s > 0 && (
                <div style={{transform: `scale(${s}) rotate(${-4 + i * 3}deg)`, opacity: Math.min(1, (1.8 - s) * 3 + 0.2)}}>
                  <Stamp text={d.text} size={72} color={[C.red, C.teal, '#6A5CD6'][i]} />
                </div>
              )}
            </div>
          );
        })}
        <div style={{...txt(56), marginTop: 30, textAlign: 'right', opacity: prog(f, cw(60, '系统'), 8)}}>
          的 <Marker p={prog(f, cw(60, '系统') + 4, 10)}>系统</Marker>
        </div>
      </Card>
    </Pop>
    <Char f={f} x={930} y={1090} s={0.75} eyes={f >= cw(60, '系统') ? 'happy' : 'open'} armsUp={f >= cw(60, '系统') ? 0.6 : 0} lookX={-1} />
  </>
);

export const S10Sfx: SfxCue[] = [
  ['paper', cf(57), 0.45],
  ...DEFS.map((d) => ['stamp', d.at + 5, 0.7] as SfxCue),
  ['ding', cw(60, '系统') + 4, 0.35],
];

