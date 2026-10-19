import React from 'react';
import {easeOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, FocusLines} from '../../../library/fx';
import {Check, Cross, PlainFile, StopSign} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

/* ---------- S5 两个小建议 ---------- */
const TIPS = ['说清目标，不用教步骤', '给它一个做完的标准'];

export const S5Tips: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="chef" eyes="happy">
    <Pop f={f} at={cf(35)} x={0} y={0}>
      <Note color={C.panel} size={36}>知道了这一点</Note>
    </Pop>
    <Pop f={f} at={cw(36, '两个')} x={0} y={80}>
      <div style={bigText(80, C.yellow)}>用 Agent 的两个建议</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cw(36, '两个') + 10 + i * 8} x={0} y={230 + i * 90} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...txt(34, C.white), width: 56, height: 56, borderRadius: 28, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(50)}>{t}</div>
        </div>
      </Pop>
    ))}
  </Host>
);
export const S5Sfx: SfxCue[] = [
  ['pop', cf(35), 0.3],
  ['ding', cw(36, '两个'), 0.35],
  ...TIPS.map((_, i) => ['click', cw(36, '两个') + 10 + i * 8, 0.3] as SfxCue),
];

/* ---------- S6 建议一：说清目标，它自己拆步骤 ---------- */
const STEPS_BAD = ['1. 打开桌面', '2. 新建三个文件夹', '3. 把 jpg 拖进图片', '4. 把 pdf 拖进文档', '5. ……'];
const STEPS_AGENT = ['看看桌面上有什么', '建好三个文件夹', '按类型逐个挪过去', '检查有没有漏的'];

export const S6Goal: React.FC<{f: number}> = ({f}) => {
  const badAt = cf(37);
  const crossAt = cf(38);
  const goalAt = cf(39);
  const splitAt = cf(42);
  return (
    <>
      <Pop f={f} at={badAt} x={60} y={60} enter="up">
        <div style={{position: 'relative', opacity: 1 - 0.5 * prog(f, crossAt + 10, 10)}}>
          <Card w={520} h={440} bg={C.white}>
            <div style={txt(34, C.inkSoft)}>一步一步教它</div>
            {STEPS_BAD.map((t) => (
              <div key={t} style={{...txt(34), marginTop: 14}}>{t}</div>
            ))}
          </Card>
          {f >= crossAt && (
            <div style={{position: 'absolute', left: 170, top: 120}}>
              <Cross size={200} p={prog(f, crossAt, 10)} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={crossAt + 6} x={100} y={530} rot={-3}>
        <div style={bigText(56, C.red)}>不用这么教</div>
      </Pop>
      <Pop f={f} at={goalAt} x={680} y={60} enter="right">
        <Card w={860} h={150} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={txt(30, C.inkSoft)}>只说目标</div>
          <div style={txt(42)}>
            把桌面文件按 <Marker p={prog(f, cw(41, '图片'), 8)}>图片、文档和视频</Marker> 分好类
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={splitAt} x={700} y={250}>
        <Note color={C.tealLight} size={36}>它自己拆步骤</Note>
      </Pop>
      {STEPS_AGENT.map((t, i) => (
        <Pop key={t} f={f} at={splitAt + 8 + i * 6} x={720 + (i % 2) * 400} y={340 + Math.floor(i / 2) * 110} enter="up">
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Check size={44} />
            <div style={{...txt(34), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 16px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{t}</div>
          </div>
        </Pop>
      ))}
      <Burst f={f} at={splitAt + 30} x={1100} y={420} r={220} />
      <PiP f={f} at={cf(37) - 6} skin="cowboy" />
    </>
  );
};
export const S6Sfx: SfxCue[] = [
  ['paper', cf(37), 0.35],
  ['error', cf(38), 0.4],
  ['pop', cf(39), 0.35],
  ['pop', cf(42), 0.3],
  ...STEPS_AGENT.map((_, i) => ['ding', cf(42) + 8 + i * 6, 0.22] as SfxCue),
];

/* ---------- S7 建议二：给它一个做完的标准 ---------- */
const ROUNDS = [5, 2, 0];

export const S7Done: React.FC<{f: number}> = ({f}) => {
  const ruleAt = cf(43);
  const roundAt = (r: number) => cf(45) + r * 36;
  const stopAt = cw(47, '停下来');
  const doneAt = cf(48);
  const cur = ROUNDS.reduce((acc, _, r) => (f >= roundAt(r) ? r : acc), -1);
  return (
    <>
      <Pop f={f} at={ruleAt} x={60} y={30} enter="up">
        <Card w={820} h={140} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={txt(30, C.inkSoft)}>完成标准</div>
          <div style={txt(44)}>桌面上不能再有散落的文件</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(45)} x={60} y={210}>
        <Note color={C.panel} size={34}>它一轮一轮往前走</Note>
      </Pop>
      {ROUNDS.map((n, r) => {
        const at = roundAt(r);
        if (f < at) return null;
        const ok = n === 0;
        return (
          <div key={r} style={{position: 'absolute', left: 60 + r * 300, top: 300, opacity: prog(f, at, 8), transform: `scale(${0.8 + 0.2 * prog(f, at, 8, easeOut)}) translateX(${ok ? 0 : jolt(f, at + 14, 8, 14)}px)`}}>
            <Win w={270} h={260} title={`第 ${r + 1} 轮`}>
              <div style={{position: 'relative', height: 200}}>
                {Array.from({length: n}, (_, i) => (
                  <div key={i} style={{position: 'absolute', left: 20 + ((i * 67) % 180), top: 16 + Math.floor(i / 3) * 80}}>
                    <PlainFile name="" size={50} />
                  </div>
                ))}
                <div style={{position: 'absolute', right: 12, bottom: 8}}>{f >= at + 14 && (ok ? <Check size={70} p={prog(f, at + 14, 8)} /> : <Cross size={60} p={prog(f, at + 14, 8)} />)}</div>
              </div>
            </Win>
          </div>
        );
      })}
      <Pop f={f} at={stopAt} x={1000} y={40}>
        <StopSign size={200} label="停" />
      </Pop>
      <Pop f={f} at={stopAt + 6} x={1220} y={100} rot={3}>
        <Note color={C.pink} size={38}>知道什么时候停</Note>
      </Pop>
      <FocusLines f={f} at={doneAt} out={doneAt + 30} x={1250} y={440} />
      <Pop f={f} at={doneAt} x={1010} y={400} rot={-4}>
        <div style={bigText(72, C.yellow)}>才算真的做完了</div>
      </Pop>
      {f >= cf(45) && <Char f={f} x={1180} y={780} s={0.6} lookX={-0.6} eyes={cur === 2 ? 'happy' : 'open'} armsUp={cur === 2 ? 0.8 : 0} />}
      <PiP f={f} at={cf(43) - 6} skin="detective" />
    </>
  );
};
export const S7Sfx: SfxCue[] = [
  ['paper', cf(43), 0.35],
  ['pop', cf(45), 0.3],
  ...ROUNDS.map((n, r) => [n ? 'error' : 'ding', cf(45) + r * 36 + 14, 0.3] as SfxCue),
  ['stamp', cw(47, '停下来'), 0.45],
  ['magic', cf(48), 0.4],
];

/* ---------- S8 结尾 ---------- */
export const S8Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(50);
  return (
    <>
      <Host f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(49)} x={0} y={60}>
          <div style={bigText(96, C.white)}>本期就到这里</div>
        </Pop>
        <Pop f={f} at={byeAt} x={0} y={220} rot={-4}>
          <div style={bigText(150, C.yellow)}>下期再见！</div>
        </Pop>
      </Host>
      <div style={{position: 'absolute', left: 0, top: -110, width: 1920, height: 1080, pointerEvents: 'none', opacity: prog(f, byeAt, 6, easeOut)}}>
        <Confetti t={f - byeAt} w={1920} h={1080} n={120} />
      </div>
    </>
  );
};
export const S8Sfx: SfxCue[] = [
  ['pop', cf(49), 0.4],
  ['confetti', cf(50), 0.5],
  ['ding', cf(50) + 2, 0.3],
];
