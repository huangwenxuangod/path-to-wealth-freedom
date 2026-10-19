import React from 'react';
import {easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Bulb, Check, Cross} from '../../../library/icons';
import {Balance} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

const Pan: React.FC<{t: string; color: string}> = ({t, color}) => (
  <div style={{...txt(30), background: color, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 12px'}}>{t}</div>
);

/* ---------- E5 过渡：三个办法 ---------- */
const TIPS = ['问之前别先表态', '直接让它挑毛病', '换个说法再问一遍'];

export const E5Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(33);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(32)} x={0} y={0} rot={-2}>
        <div style={bigText(80, C.yellow)}>怎么听到真话？</div>
      </Pop>
      {TIPS.map((t, i) => (
        <Pop key={t} f={f} at={listAt + 6 + i * 6} x={i * 40} y={130 + i * 72} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(44)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const E5Sfx: SfxCue[] = [
  ['question', cf(32), 0.35],
  ...TIPS.map((_, i) => ['click', cf(33) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- E6 办法一：问之前别先表态，一表态它就往你那边倒 ---------- */
export const E6NoStance: React.FC<{f: number}> = ({f}) => {
  const badAt = cf(35);
  const lean = prog(f, cf(36), 16, easeOut);
  const goodAt = cf(37);
  const level = prog(f, cf(38), 16, easeOut);
  const pullAt = cf(39);
  return (
    <>
      <Pop f={f} at={cf(34)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          问之前<span style={{color: C.yellow}}>别先表态</span>
        </div>
      </Pop>
      <Pop f={f} at={badAt} x={60} y={140} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={960} h={300} bg="#E6E1D6">
            <div style={{width: 540}}>
              <Bubble me text="我觉得这个方案特别好，你帮我看看" size={31} />
            </div>
            <div style={{width: 520, marginTop: 18, opacity: prog(f, cf(36) + 10, 6)}}>
              <Bubble text="确实很好！" color={C.tealLight} size={34} />
            </div>
          </Card>
          <div style={{position: 'absolute', left: 580, top: 30}}>
            <Balance w={340} tilt={lerp(0, -1, lean)} left={<Pan t="你的看法" color={C.pink} />} right={<Pan t="它" color={C.white} />} />
          </div>
          {f >= cf(36) + 16 && <div style={{position: 'absolute', left: -14, top: -24}}><Cross size={70} p={prog(f, cf(36) + 16, 8)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={goodAt} x={60} y={480} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={960} h={300} bg={C.tealLight}>
            <div style={{width: 520}}>
              <Bubble me text="（只发方案）你怎么看？" size={34} />
            </div>
            <div style={{width: 520, marginTop: 18, opacity: prog(f, cf(38) + 10, 6)}}>
              <Bubble text="优点有两个，风险也有三个……" color={C.white} size={34} />
            </div>
          </Card>
          <div style={{position: 'absolute', left: 580, top: 30}}>
            <Balance w={340} tilt={lerp(-0.4, 0, level)} left={<Pan t="方案" color={C.yellow} />} right={<Pan t="它" color={C.white} />} />
          </div>
          {f >= cf(38) + 16 && <div style={{position: 'absolute', left: -14, top: -24}}><Check size={70} p={prog(f, cf(38) + 16, 8)} /></div>}
        </div>
      </Pop>
      <FocusLines f={f} at={pullAt} out={pullAt + 30} x={420} y={860} />
      <Pop f={f} at={pullAt} x={60} y={810} rot={-3}>
        <div style={{...bigText(64, C.red), transform: `translateX(${jolt(f, cf(40), 10, 12)}px)`}}>你一表态，它就往你那边靠</div>
      </Pop>
      <PiP f={f} at={cf(34) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const E6Sfx: SfxCue[] = [
  ['pop', cf(34), 0.35],
  ['type', cf(35), 0.3],
  ['whoosh', cf(36), 0.3],
  ['error', cf(36) + 16, 0.3],
  ['type', cf(37), 0.3],
  ['ding', cf(38) + 16, 0.35],
  ['boing', cf(39), 0.35],
];

/* ---------- E7 办法二：直接让它挑毛病，给它一个唱反调的身份 ---------- */
const PROBLEMS = ['问题 1：成本算少了', '问题 2：没想好谁来做', '问题 3：时间排得太满'];

export const E7Critic: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(42);
  const roleAt = cf(43);
  const idAt = cf(45);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          直接让它<span style={{color: C.yellow}}>挑毛病</span>
        </div>
      </Pop>
      <Pop f={f} at={askAt} x={60} y={140}>
        <div style={{width: 960}}>
          <Bubble me text="请列出这个方案最大的三个问题" size={40} />
        </div>
      </Pop>
      <Pop f={f} at={askAt + 14} x={60} y={250} enter="up">
        <Card w={740} h={280} bg="#FFFDF7">
          {PROBLEMS.map((p, i) => (
            <div key={p} style={{...txt(40), marginTop: i ? 22 : 4, opacity: prog(f, askAt + 20 + i * 8, 6)}}>{p}</div>
          ))}
          <div style={{...txt(22, C.inkSoft), marginTop: 16}}>示例</div>
        </Card>
      </Pop>
      <Char f={f} x={920} y={560} s={0.75} kind="bot" eyes={f >= roleAt ? 'flat' : 'open'} lookX={-0.5} opacity={prog(f, askAt, 8)} />
      <Emote f={f} at={roleAt + 4} kind="anger" x={930} y={380} dur={60} />
      <Pop f={f} at={roleAt} x={60} y={570} rot={-2}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={txt(36, C.inkSoft)}>或者让它扮演</div>
          <div style={{...txt(42, C.white), background: C.ink, borderRadius: 12, padding: '4px 20px'}}>很挑剔的老板</div>
        </div>
      </Pop>
      <Pop f={f} at={cf(44)} x={60} y={660}>
        <Bubble text="这个方案，我第一个不同意。" color="#FFD9D6" size={38} />
      </Pop>
      <FocusLines f={f} at={idAt} out={idAt + 30} x={420} y={860} />
      <Pop f={f} at={idAt} x={60} y={800} rot={-3}>
        <div style={bigText(68, C.yellow)}>给它唱反调的身份</div>
      </Pop>
      <Burst f={f} at={idAt + 4} x={340} y={850} r={200} />
      <PiP f={f} at={cf(41) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const E7Sfx: SfxCue[] = [
  ['pop', cf(41), 0.35],
  ['type', cf(42), 0.3],
  ...PROBLEMS.map((_, i) => ['click', cf(42) + 20 + i * 8, 0.25] as SfxCue),
  ['pop', cf(43), 0.3],
  ['boing', cf(44), 0.3],
  ['magic', cf(45), 0.4],
];

/* ---------- E8 办法三：正着问一次、反着问一次，结论相反就是在顺着你 ---------- */
const QA = [
  {q: '这个方案好吗？', a: '好！很有潜力', bg: C.tealLight},
  {q: '这个方案有问题吗？', a: '有！问题不少', bg: '#FFD9D6'},
];

export const E8Flip: React.FC<{f: number}> = ({f}) => {
  const qaAt = cf(48);
  const clashAt = cf(49);
  const thinkAt = cf(51);
  return (
    <>
      <Pop f={f} at={cf(47)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          换个说法<span style={{color: C.yellow}}>再问一遍</span>
        </div>
      </Pop>
      {QA.map((x, i) => (
        <Pop key={x.q} f={f} at={i ? cw(48, '反着') : qaAt} x={60} y={150 + i * 170} enter="left">
          <Card w={960} h={140} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px'}}>
            <div style={{...txt(30, C.white), background: i ? C.red : C.teal, borderRadius: 10, padding: '2px 12px'}}>{i ? '反着问' : '正着问'}</div>
            <div style={{...txt(38), width: 380}}>{x.q}</div>
            <div style={{opacity: prog(f, (i ? cw(48, '反着') : qaAt) + 10, 6)}}>
              <Bubble text={x.a} color={x.bg} size={36} />
            </div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={clashAt} x={60} y={510} enter="up">
        <div style={{transform: `translateX(${jolt(f, clashAt + 4, 12, 14)}px)`}}>
          <Card w={740} h={130} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px'}}>
            <Cross size={60} p={prog(f, clashAt + 4, 8)} />
            <div style={txt(42)}>两次结论正好相反</div>
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={cf(50)} x={60} y={670} rot={-2}>
        <Note color={C.pink} size={40}>说明它是在顺着你说</Note>
      </Pop>
      {f >= thinkAt && (
        <div style={{position: 'absolute', left: 70, top: 760, opacity: prog(f, thinkAt, 6)}}>
          <Bulb size={110} glow={0.6 + 0.4 * Math.abs(Math.sin(f * 0.2))} />
        </div>
      )}
      <FocusLines f={f} at={thinkAt} out={thinkAt + 30} x={440} y={860} />
      <Pop f={f} at={thinkAt + 4} x={200} y={800} rot={-3}>
        <div style={bigText(72, C.yellow)}>自己再好好想想</div>
      </Pop>
      <PiP f={f} at={cf(47) - 6} skin="chef" eyes={f >= clashAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const E8Sfx: SfxCue[] = [
  ['pop', cf(47), 0.35],
  ['type', cf(48), 0.3],
  ['type', cw(48, '反着'), 0.3],
  ['error', cf(49) + 4, 0.4],
  ['pop', cf(50), 0.3],
  ['ding', cf(51), 0.4],
];

/* ---------- E9 结尾 ---------- */
export const E9Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(53);
  return (
    <>
      <HostTall f={f} skin="detective" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(52)} x={0} y={20}>
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
export const E9Sfx: SfxCue[] = [
  ['pop', cf(52), 0.4],
  ['confetti', cf(53), 0.5],
  ['ding', cf(53) + 2, 0.3],
];
