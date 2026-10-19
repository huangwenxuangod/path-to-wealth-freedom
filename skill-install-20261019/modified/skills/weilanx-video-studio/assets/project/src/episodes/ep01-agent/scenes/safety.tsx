import React from 'react';
import {boil, easeInOut, easeOut, keyframes, prog, reach} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {cf, cw} from '../cues';
import {Bulb, Check, Cross, Stamp, stampScale, StopSign, ToolIcon, Trash, UserFace, VideoFile} from '../../../library/icons';
import {Card, jolt, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';

/* ---------------- S11 拿不准？问你 ---------------- */

const MiniThumb: React.FC<{kind: 'py' | 'cut'}> = ({kind}) => (
  <div style={{width: 230, height: 140, border: `4px solid ${C.ink}`, borderRadius: 12, background: kind === 'py' ? '#2B2F36' : '#FDE2D6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', ...txt(34, kind === 'py' ? '#F2C230' : C.ink)}}>
    {kind === 'py' ? 'Python 第 1 课' : '剪辑入门'}
  </div>
);

export const S11Ask: React.FC<{f: number}> = ({f}) => {
  const stuck = f >= cf(65);
  const shakeHead = f >= cw(67, '删掉') ? Math.sin(f * 0.6) : 0;
  const lid = keyframes(f, [[cf(67), 0], [cf(67) + 10, 1]]);
  const fileY = keyframes(f, [[cf(67) + 6, 660], [cw(67, '删掉'), 740]], easeInOut);
  const blocked = f >= cw(67, '删掉') + 2;
  return (
    <>
      <Pop f={f} at={cw(63, '学习资料')} x={70} y={20}>
        <VideoFile name="学习资料.mp4" size={120} />
      </Pop>
      <Pop f={f} at={cw(63, '学习资料') + 8} x={620} y={20}>
        <VideoFile name="学习资料.mp4" size={120} tint="#FDE2D6" />
      </Pop>
      <Pop f={f} at={cw(63, '都叫')} x={540} y={100} center>
        <div style={txt(90)}>=</div>
      </Pop>
      <Pop f={f} at={cf(64)} x={70} y={230} enter="up">
        <MiniThumb kind="py" />
      </Pop>
      <Pop f={f} at={cf(64) + 6} x={640} y={230} enter="up">
        <MiniThumb kind="cut" />
      </Pop>
      <Pop f={f} at={cw(64, '不一样')} x={540} y={300} center>
        <div style={{...txt(100, C.red), fontWeight: 700}}>≠</div>
      </Pop>
      {/* 询问对话框 */}
      <Pop f={f} at={cf(66)} x={90} y={420}>
        <Card w={900} h={300} bg={C.white} pad={0} style={{overflow: 'hidden'}}>
          <div style={{height: 64, background: C.yellow, borderBottom: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', padding: '0 24px', ...txt(38)}}>Agent 想问问你</div>
          <div style={{padding: '18px 28px', ...txt(40, C.ink, {whiteSpace: 'normal'})}}>两个「学习资料.mp4」内容不一样，要怎么处理？</div>
          <div style={{display: 'flex', gap: 24, padding: '0 28px'}}>
            {['都保留', '我来选'].map((b, i) => (
              <div key={b} style={{...txt(38, i ? C.white : C.ink), background: i ? C.teal : '#F3EFE6', border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 30px'}}>{b}</div>
            ))}
          </div>
        </Card>
      </Pop>
      {/* 垃圾桶：不能自己删 */}
      <Pop f={f} at={cf(67)} x={110} y={760} enter="up">
        <Trash size={170} lid={lid} />
      </Pop>
      {f >= cf(67) + 4 && !blocked && (
        <div style={{position: 'absolute', left: 130, top: fileY - 120, transform: 'rotate(-20deg)'}}>
          <VideoFile name="" size={80} />
        </div>
      )}
      {blocked && (
        <>
          <div style={{position: 'absolute', left: 90, top: 720}}>
            <Cross size={230} p={prog(f, cw(67, '删掉') + 2, 8)} width={10} />
          </div>
          <Pop f={f} at={cw(67, '删掉') + 8} x={330} y={1000} center rot={-6} dur={6}>
            <Stamp text="不能擅自删除" size={52} />
          </Pop>
        </>
      )}
      <Char f={f} x={800} y={1080} s={0.95} eyes={stuck ? (f >= cf(66) ? 'open' : 'wide') : 'open'} lookX={shakeHead || (f >= cf(66) ? -0.6 : 0)} rot={stuck && f < cf(66) ? boil(f, 3, 4) : 0} />
      <Pop f={f} at={cf(62)} out={cf(66)} x={800} y={820} center>
        <div style={{...txt(110), transform: `rotate(${Math.sin(f * 0.3) * 12}deg)`}}>?</div>
      </Pop>
      {/* 汗滴 */}
      {stuck && f < cf(66) && (
        <svg width={40} height={60} style={{position: 'absolute', left: 900, top: 880 + ((f - cf(65)) % 20) * 2}}>
          <path d="M20 4 Q34 30 20 50 Q6 30 20 4 Z" fill="#8FC7F0" stroke={C.ink} strokeWidth={3} />
        </svg>
      )}
    </>
  );
};

export const S11Sfx: SfxCue[] = [
  ['question', cf(62), 0.4],
  ['pop', cw(63, '学习资料'), 0.4],
  ['pop', cw(63, '学习资料') + 8, 0.4],
  ['pop', cf(64), 0.35],
  ['pop', cw(64, '不一样'), 0.45],
  ['question', cf(65), 0.5],
  ['ding', cf(66), 0.4],
  ['whoosh', cf(67) + 4, 0.3],
  ['error', cw(67, '删掉') + 2, 0.45],
  ['stamp', cw(67, '删掉') + 8, 0.6],
];

/* ---------------- S12 报错了怎么办 ---------------- */

const TRIES = [cf(70) + 20, cf(72), cw(72, '还是不行')];

export const S12Error: React.FC<{f: number}> = ({f}) => {
  const failed = TRIES.filter((t) => f >= t).length;
  const stopped = f >= cf(73);
  const arm = reach(f, cf(68), cf(68) + 18);
  const errFly = prog(f, cf(69), 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(68) - 4} x={430} y={20}>
        <Card w={580} h={150} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <ToolIcon kind="moveFile" size={96} />
          <div style={txt(52)}>移动文件</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(68) + 14} x={330} y={210} rot={-2}>
        <div style={{transform: `translateX(${jolt(f, cf(68) + 14, 14)}px)`}}>
          <Card w={700} h={130} bg="#FFD9D6" style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Cross size={64} />
            <div style={txt(44, '#B3262B')}>报错：文件被占用，移动失败</div>
          </Card>
        </div>
      </Pop>
      {/* 程序把错误交回给模型 */}
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M330 300 Q220 340 240 520" pathLength={1} fill="none" stroke={C.red} strokeWidth={7} strokeDasharray="1 1" strokeDashoffset={1 - errFly} strokeLinecap="round" />
      </svg>
      <Pop f={f} at={cf(69) + 12} x={40} y={360} rot={-6}>
        <div style={{...txt(34, C.white), background: C.red, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 14px'}}>错误信息 → 模型</div>
      </Pop>
      <Pop f={f} at={cf(71)} x={440} y={420} enter="left">
        <Card w={570} h={140} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Bulb size={60} />
          <div style={txt(40, C.ink, {whiteSpace: 'normal'})}>换个办法：换个路径再试</div>
        </Card>
      </Pop>
      {/* 尝试次数 */}
      <Pop f={f} at={TRIES[0] - 6} x={440} y={620}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={txt(46)}>尝试</div>
          {TRIES.map((t, i) => (
            <div key={i} style={{position: 'relative', width: 76, height: 76, borderRadius: 38, border: `4px solid ${C.ink}`, background: f >= t ? '#FFD9D6' : C.white, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(34)}}>
              {f >= t ? <Cross size={46} p={prog(f, t, 8)} /> : i + 1}
            </div>
          ))}
          <div style={txt(40, C.inkSoft)}>{failed}/3</div>
        </div>
      </Pop>
      {stopped && (
        <div style={{position: 'absolute', left: 700, top: 700, transform: `scale(${stampScale(f, cf(73))}) rotate(6deg)`, transformOrigin: '50% 30%'}}>
          <StopSign size={230} label="停" />
        </div>
      )}
      <Pop f={f} at={cf(74)} x={420} y={800} enter="up">
        <div style={{position: 'relative', ...txt(48), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 16, padding: '8px 26px'}}>
          一直重试 ↻
          <div style={{position: 'absolute', left: 40, top: -20}}>
            <Cross size={110} p={prog(f, cf(74) + 8, 10)} />
          </div>
        </div>
      </Pop>
      <Char
        f={f}
        x={220}
        y={1080}
        s={0.95}
        arm={arm > 0 ? {tx: 460, ty: 90, ext: arm} : null}
        eyes={stopped ? 'flat' : f >= cf(71) && failed === 0 ? 'happy' : f >= cf(68) + 14 ? 'wide' : 'open'}
        lookX={arm > 0 ? 1 : 0.5}
      />
    </>
  );
};

export const S12Sfx: SfxCue[] = [
  ['click', cf(68) + 8, 0.5],
  ['error', cf(68) + 14, 0.55],
  ['whoosh', cf(69), 0.35],
  ['ding', cf(71), 0.3],
  ...TRIES.map((t) => ['error', t, 0.4] as SfxCue),
  ['stamp', cf(73), 0.7],
  ['snip', cf(74) + 8, 0.45],
];

/* ---------------- S13 交代任务的技巧 ---------------- */

const Warn: React.FC = () => (
  <svg width={60} height={60} viewBox="0 0 60 60">
    <path d="M30 6 L56 52 H4 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M30 22 V36" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx="30" cy="44" r="3.5" fill={C.ink} />
  </svg>
);

const Retry: React.FC = () => (
  <svg width={60} height={60} viewBox="0 0 100 100">
    <path d="M78 34 A32 32 0 1 0 82 62" fill="none" stroke={C.teal} strokeWidth={10} strokeLinecap="round" />
    <path d="M62 30 L80 34 L82 14" fill="none" stroke={C.teal} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RULES = [
  {at: cf(77), icon: 'ok', label: '可以动', value: '桌面上的学习资料'},
  {at: cf(78), icon: 'warn', label: '先确认', value: '删除、覆盖文件'},
  {at: cf(79), icon: 'retry', label: '最多试', value: '3 次，不行就停'},
] as const;

export const S13Brief: React.FC<{f: number}> = ({f}) => (
  <>
    <Pop f={f} at={cf(75) - 4} x={70} y={40} enter="up">
      <div style={{position: 'relative'}}>
        <Card w={940} h={800} bg="#FFF8E6" pad={40}>
          <div style={{...txt(64), marginTop: 20}}>任务单</div>
          <div style={{...txt(40, C.inkSoft), marginTop: 6}}>
            交代任务时，把<Marker p={prog(f, cw(76, '范围'), 10)}>范围</Marker>说清楚：
          </div>
          {RULES.map((r) => {
            const p = prog(f, r.at, 10, easeOut);
            if (p <= 0) return null;
            return (
              <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 44, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
                {r.icon === 'ok' ? <Check size={60} p={prog(f, r.at + 4, 10)} /> : r.icon === 'warn' ? <Warn /> : <Retry />}
                <div style={{...txt(40, C.white), background: C.ink, borderRadius: 10, padding: '2px 14px'}}>{r.label}</div>
                <div style={txt(50)}>{r.value}</div>
              </div>
            );
          })}
        </Card>
        {/* 夹子 */}
        <div style={{position: 'absolute', left: 390, top: -30, width: 160, height: 60, borderRadius: 14, background: '#9A948A', border: `4px solid ${C.ink}`}} />
      </div>
    </Pop>
    <Pop f={f} at={cf(75) + 6} x={70} y={880} enter="left">
      <UserFace size={130} f={f} mood="calm" />
    </Pop>
    <Char f={f} x={880} y={1085} s={0.85} eyes={f >= cf(79) + 10 ? 'happy' : 'open'} armsUp={f >= cf(79) + 10 ? 0.7 : 0} lookX={-0.6} />
  </>
);

export const S13Sfx: SfxCue[] = [
  ['paper', cf(75) - 4, 0.5],
  ['pop', cw(76, '范围'), 0.35],
  ...RULES.map((r) => ['pop', r.at, 0.45] as SfxCue),
  ['click', cf(77) + 6, 0.4],
  ['ding', cf(79) + 10, 0.3],
];
