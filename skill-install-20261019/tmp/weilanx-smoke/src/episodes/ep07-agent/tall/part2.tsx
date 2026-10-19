import React from 'react';
import {easeOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, Confetti, FocusLines} from '../../../library/fx';
import {Check, Cross, PlainFile, StopSign} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- U5 两个小建议 ---------- */
const TIPS = ['说清目标，不用教步骤', '给它一个做完的标准'];

export const U5Tips: React.FC<{f: number}> = ({f}) => {
  const at = cw(36, '两个');
  return (
    <HostTall f={f} skin="chef" eyes="happy" armsUp={f >= at && f < at + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(35)} x={0} y={0}>
        <Note color={C.panel} size={40}>知道了这一点</Note>
      </Pop>
      <Pop f={f} at={at} x={0} y={70} rot={-2}>
        <div style={bigText(88, C.yellow)}>用 Agent 的两个建议</div>
      </Pop>
      {TIPS.map((t, i) => (
        <Pop key={t} f={f} at={at + 10 + i * 8} x={i * 30} y={210 + i * 70} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(42)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const U5Sfx: SfxCue[] = [
  ['pop', cf(35), 0.3],
  ['ding', cw(36, '两个'), 0.4],
  ...TIPS.map((_, i) => ['click', cw(36, '两个') + 10 + i * 8, 0.3] as SfxCue),
];

/* ---------- U6 建议一：说清目标，它自己拆步骤 ---------- */
const STEPS_BAD = ['1. 打开桌面', '2. 新建三个文件夹', '3. 把 jpg 拖进图片', '4. ……'];
const STEPS_AGENT = ['看看桌面上有什么', '建好三个文件夹', '按类型逐个挪过去', '检查有没有漏的'];

export const U6Goal: React.FC<{f: number}> = ({f}) => {
  const crossAt = cf(38);
  const goalAt = cf(39);
  const splitAt = cf(42);
  return (
    <>
      <Pop f={f} at={cf(37)} x={60} y={30} enter="up">
        <div style={{position: 'relative', opacity: 1 - 0.5 * prog(f, crossAt + 10, 10)}}>
          <Card w={620} h={330} bg={C.white}>
            <div style={txt(34, C.inkSoft)}>一步一步教它</div>
            {STEPS_BAD.map((t) => (
              <div key={t} style={{...txt(36), marginTop: 12}}>{t}</div>
            ))}
          </Card>
          {f >= crossAt && <div style={{position: 'absolute', left: 190, top: 50}}><Cross size={240} p={prog(f, crossAt, 10)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={crossAt + 6} x={700} y={120} rot={6}>
        <div style={bigText(76, C.red)}>
          不用
          <br />
          这么教
        </div>
      </Pop>
      <Pop f={f} at={goalAt} x={60} y={400} enter="right">
        <Card w={960} h={170} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={txt(34, C.inkSoft)}>只说目标</div>
          <div style={txt(48)}>
            把桌面文件按 <Marker p={prog(f, cw(41, '图片'), 8)}>图片、文档和视频</Marker> 分好类
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={splitAt} x={60} y={610}>
        <Note color={C.tealLight} size={44}>它自己拆步骤</Note>
      </Pop>
      {STEPS_AGENT.map((t, i) => (
        <Pop key={t} f={f} at={splitAt + 8 + i * 6} x={60 + (i % 2) * 380} y={710 + Math.floor(i / 2) * 110} enter="up">
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <Check size={50} />
            <div style={{...txt(36), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 14px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{t}</div>
          </div>
        </Pop>
      ))}
      <Burst f={f} at={splitAt + 30} x={400} y={790} r={260} />
      <PiP f={f} at={cf(37) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const U6Sfx: SfxCue[] = [
  ['paper', cf(37), 0.35],
  ['error', cf(38), 0.45],
  ['boing', cf(38) + 6, 0.3],
  ['pop', cf(39), 0.35],
  ['pop', cf(42), 0.3],
  ...STEPS_AGENT.map((_, i) => ['ding', cf(42) + 8 + i * 6, 0.22] as SfxCue),
];

/* ---------- U7 建议二：给它一个做完的标准 ---------- */
const ROUNDS = [5, 2, 0];

export const U7Done: React.FC<{f: number}> = ({f}) => {
  const roundAt = (r: number) => cf(45) + r * 36;
  const stopAt = cw(47, '停下来');
  const doneAt = cf(48);
  return (
    <>
      <Pop f={f} at={cf(43)} x={60} y={30} enter="up">
        <Card w={960} h={160} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={txt(34, C.inkSoft)}>完成标准</div>
          <div style={txt(52)}>桌面上不能再有散落的文件</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(45)} x={60} y={220}>
        <Note color={C.panel} size={40}>它一轮一轮往前走</Note>
      </Pop>
      {ROUNDS.map((n, r) => {
        const at = roundAt(r);
        if (f < at) return null;
        const ok = n === 0;
        return (
          <div key={r} style={{position: 'absolute', left: 60 + r * 330, top: 310, opacity: prog(f, at, 8), transform: `scale(${0.8 + 0.2 * prog(f, at, 8, easeOut)}) translateX(${ok ? 0 : jolt(f, at + 14, 8, 14)}px)`}}>
            <Win w={300} h={280} title={`第 ${r + 1} 轮`}>
              <div style={{position: 'relative', height: 220}}>
                {Array.from({length: n}, (_, i) => (
                  <div key={i} style={{position: 'absolute', left: 20 + ((i * 67) % 200), top: 16 + Math.floor(i / 3) * 90}}>
                    <PlainFile name="" size={56} />
                  </div>
                ))}
                <div style={{position: 'absolute', right: 12, bottom: 8}}>{f >= at + 14 && (ok ? <Check size={80} p={prog(f, at + 14, 8)} /> : <Cross size={70} p={prog(f, at + 14, 8)} />)}</div>
              </div>
            </Win>
          </div>
        );
      })}
      <Pop f={f} at={stopAt} x={80} y={640}>
        <StopSign size={200} label="停" />
      </Pop>
      <Pop f={f} at={stopAt + 6} x={310} y={700} rot={3}>
        <Note color={C.pink} size={46}>知道什么时候停</Note>
      </Pop>
      <FocusLines f={f} at={doneAt} out={doneAt + 30} x={540} y={920} />
      <Pop f={f} at={doneAt} x={60} y={880} rot={-3}>
        <div style={bigText(92, C.yellow)}>才算真的做完了</div>
      </Pop>
      <PiP f={f} at={cf(43) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const U7Sfx: SfxCue[] = [
  ['paper', cf(43), 0.35],
  ['pop', cf(45), 0.3],
  ...ROUNDS.map((n, r) => [n ? 'error' : 'ding', cf(45) + r * 36 + 14, 0.35] as SfxCue),
  ['stamp', cw(47, '停下来'), 0.5],
  ['magic', cf(48), 0.45],
];

/* ---------- U8 结尾 ---------- */
export const U8Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(50);
  return (
    <>
      <HostTall f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(49)} x={0} y={20}>
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
export const U8Sfx: SfxCue[] = [
  ['pop', cf(49), 0.4],
  ['confetti', cf(50), 0.5],
  ['ding', cf(50) + 2, 0.3],
];
