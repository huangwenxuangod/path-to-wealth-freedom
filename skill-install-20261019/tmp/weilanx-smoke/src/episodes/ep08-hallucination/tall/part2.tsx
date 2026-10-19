import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, PlainFile} from '../../../library/icons';
import {Stopwatch, Win} from '../../../library/items/apps';
import {Magnifier} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

const Bubble: React.FC<{text: string; me?: boolean; color?: string}> = ({text, me, color}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(38), background: color ?? (me ? C.pink : C.white), border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px', whiteSpace: 'normal', maxWidth: 820, lineHeight: 1.35}}>{text}</div>
  </div>
);

/* ---------- V5 怎么防：三个做法 ---------- */
const TIPS = ['把资料给它，照着回答', '允许它说不知道', '要出处，自己再核实'];

export const V5Tips: React.FC<{f: number}> = ({f}) => (
  <HostTall f={f} skin="cowboy" eyes="happy" armsUp={f >= cf(34) && f < cf(34) + 24 ? 0.8 : 0}>
    <Pop f={f} at={cf(34)} x={0} y={0} rot={-2}>
      <div style={bigText(100, C.yellow)}>平时怎么防？</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cf(35) + 8 + i * 6} x={i * 30} y={150 + i * 70} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
          <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(42)}>{t}</div>
        </div>
      </Pop>
    ))}
  </HostTall>
);
export const V5Sfx: SfxCue[] = [
  ['question', cf(34), 0.35],
  ...TIPS.map((_, i) => ['click', cf(35) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- V6 做法一：把资料给它，照着回答 ---------- */
export const V6Source: React.FC<{f: number}> = ({f}) => {
  const dropAt = cw(38, '贴进');
  const drop = prog(f, dropAt - 10, 14, easeInOut);
  const ruleAt = cf(39);
  const ansAt = cf(40);
  return (
    <>
      <Pop f={f} at={cf(36)} x={60} y={330} enter="up">
        <Win w={960} h={500} title="发给 AI">
          <div style={{padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18}}>
            {f >= dropAt + 4 && (
              <div style={{display: 'flex', justifyContent: 'flex-end', opacity: prog(f, dropAt + 4, 6)}}>
                <div style={{...txt(34), background: '#FCE3A8', border: `4px solid ${C.ink}`, borderRadius: 12, padding: '6px 14px'}}>附件：合同原文</div>
              </div>
            )}
            {f >= cf(37) && <Bubble me text="合同里关于违约金是怎么写的？" />}
            {f >= ruleAt && (
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div style={{...txt(40), background: C.pink, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px'}}>
                  <Marker p={prog(f, ruleAt + 4, 10)}>只根据这些内容回答</Marker>
                </div>
              </div>
            )}
            {f >= ansAt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, ansAt, 8)}}>
                <Bubble text="合同第 8 条写着……（原文引用）" />
                <Check size={60} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(37)} out={dropAt + 12} x={60} y={30}>
        <Card w={320} h={270} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `translate(${drop * 560}px, ${drop * 360}px) scale(${1 - 0.4 * drop})`, opacity: 1 - 0.6 * prog(f, dropAt + 6, 6)}}>
            <PlainFile name="合同原文" size={130} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(37) + 6} x={420} y={100} rot={3}>
        <div style={bigText(72, C.yellow)}>先把资料给它</div>
      </Pop>
      <FocusLines f={f} at={ansAt + 6} out={ansAt + 30} x={400} y={940} />
      <Pop f={f} at={ansAt + 6} x={60} y={880} rot={-4}>
        <div style={bigText(96, C.yellow)}>不用靠猜了</div>
      </Pop>
      <Burst f={f} at={ansAt + 8} x={320} y={940} r={220} />
      <Pop f={f} at={ansAt + 14} x={60} y={1010}>
        <Note color={C.panel} size={26}>示例内容</Note>
      </Pop>
      <PiP f={f} at={cf(36) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const V6Sfx: SfxCue[] = [
  ['paper', cf(36), 0.35],
  ['type', cf(37), 0.3],
  ['whoosh', cw(38, '贴进') - 10, 0.4],
  ['pop', cf(39), 0.3],
  ['ding', cf(40), 0.45],
];

/* ---------- V7 做法二：允许它说不知道 ---------- */
export const V7Unsure: React.FC<{f: number}> = ({f}) => {
  const lineAt = cw(43, '不确定');
  const noStepAt = cf(44);
  const forceAt = cw(45, '硬着头皮');
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30} enter="up">
        <Win w={960} h={200} title="提示词">
          <div style={{...txt(44), padding: '36px 30px'}}>
            ……<Marker p={prog(f, lineAt, 10)}>不确定的地方就直接说不确定</Marker>
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={lineAt + 6} x={60} y={270} enter="left">
        <Card w={960} h={230} bg={C.tealLight}>
          <div style={txt(40)}>给了台阶</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16}}>
            <Bubble text="这一点我不确定，建议你查一下原始资料。" color={C.white} />
            <Check size={64} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={noStepAt} x={60} y={540} enter="right">
        <div style={{transform: `translateX(${jolt(f, forceAt, 12, 16)}px)`}}>
          <Card w={960} h={230} bg="#E6E1D6">
            <div style={txt(40)}>没给台阶</div>
            <div style={{marginTop: 16, opacity: prog(f, forceAt, 8)}}>
              <Bubble text="当然！答案是……（硬编一个）" color="#FFD9D6" />
            </div>
          </Card>
        </div>
      </Pop>
      <FocusLines f={f} at={forceAt + 6} out={forceAt + 30} x={420} y={900} />
      <Pop f={f} at={forceAt + 6} x={60} y={830} rot={-4}>
        <div style={bigText(104, C.red)}>硬着头皮编！</div>
      </Pop>
      <Emote f={f} at={forceAt + 4} kind="sweat" x={940} y={600} />
      <PiP f={f} at={cf(41) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const V7Sfx: SfxCue[] = [
  ['paper', cf(41), 0.35],
  ['pop', cw(43, '不确定'), 0.3],
  ['ding', cw(43, '不确定') + 6, 0.35],
  ['whoosh', cf(44), 0.3],
  ['error', cw(45, '硬着头皮'), 0.45],
  ['boing', cw(45, '硬着头皮') + 6, 0.35],
];

/* ---------- V8 做法三：要出处，关键信息自己核实 ---------- */
const FACTS = [
  {t: '这件事发生在 2019 年', src: '出处 1'},
  {t: '提出者是张教授', src: '出处 2'},
  {t: '详情见这个链接', src: '出处 3'},
];

export const V8Verify: React.FC<{f: number}> = ({f}) => {
  const checkAt = cf(47);
  const scan = prog(f, checkAt, 36, easeInOut);
  const keyAt = cf(48);
  const minAt = cf(49);
  const worthAt = cw(50, '划算');
  return (
    <>
      <Pop f={f} at={cf(46)} x={60} y={30} enter="up">
        <Card w={960} h={400} bg={C.white}>
          <div style={txt(36, C.inkSoft)}>AI 的回答（要求它附上出处）</div>
          {FACTS.map((x, i) => (
            <div key={x.t} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 26, opacity: prog(f, cf(46) + 6 + i * 5, 6)}}>
              <div style={txt(44)}>{i === 2 || f < keyAt ? x.t : <Marker p={prog(f, keyAt + i * 6, 8)}>{x.t}</Marker>}</div>
              <div style={{...txt(30, C.teal), border: `3px solid ${C.teal}`, borderRadius: 10, padding: '2px 10px'}}>{x.src}</div>
              {f >= checkAt + 12 + i * 10 && <Check size={52} p={prog(f, checkAt + 12 + i * 10, 6)} />}
            </div>
          ))}
          <div style={{...txt(24, C.inkSoft), marginTop: 24}}>示例内容</div>
        </Card>
      </Pop>
      {f >= checkAt && f < checkAt + 44 && (
        <div style={{position: 'absolute', left: lerp(720, 800, scan), top: lerp(100, 300, scan)}}>
          <Magnifier size={170} />
        </div>
      )}
      <Pop f={f} at={checkAt} x={60} y={460}>
        <Note color={C.tealLight} size={44}>关键信息，自己再核实一遍</Note>
      </Pop>
      <Pop f={f} at={keyAt} x={60} y={570}>
        <div style={{display: 'flex', gap: 18}}>
          {['数字', '人名', '链接'].map((t, i) => (
            <div key={t} style={{...txt(48), opacity: prog(f, keyAt + i * 6, 6), background: '#FFD9D6', border: `4px solid ${C.red}`, borderRadius: 14, padding: '6px 22px'}}>{t}</div>
          ))}
        </div>
      </Pop>
      <Pop f={f} at={minAt} x={60} y={680}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Stopwatch size={150} p={prog(f, minAt, 40)} />
          <div style={bigText(80, C.white)}>花一分钟</div>
        </div>
      </Pop>
      <FocusLines f={f} at={worthAt} out={worthAt + 30} x={420} y={960} />
      <Pop f={f} at={worthAt} x={60} y={900} rot={-4}>
        <div style={bigText(80, C.yellow)}>比事后被骗划算得多</div>
      </Pop>
      <PiP f={f} at={cf(46) - 6} skin="chef" eyes={f >= worthAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const V8Sfx: SfxCue[] = [
  ['paper', cf(46), 0.35],
  ['whoosh', cf(47), 0.3],
  ...FACTS.map((_, i) => ['ding', cf(47) + 12 + i * 10, 0.25] as SfxCue),
  ['pop', cf(48), 0.3],
  ['click', cf(49), 0.3],
  ['magic', cw(50, '划算'), 0.45],
];

/* ---------- V9 结尾 ---------- */
export const V9Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(52);
  return (
    <>
      <HostTall f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(51)} x={0} y={20}>
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
export const V9Sfx: SfxCue[] = [
  ['pop', cf(51), 0.4],
  ['confetti', cf(52), 0.5],
  ['ding', cf(52) + 2, 0.3],
];
