import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, PlainFile} from '../../../library/icons';
import {Stopwatch, Win} from '../../../library/items/apps';
import {Magnifier} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

const Bubble: React.FC<{text: string; me?: boolean; color?: string}> = ({text, me, color}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(30), background: color ?? (me ? C.pink : C.white), border: `3px solid ${C.ink}`, borderRadius: 16, padding: '8px 16px', whiteSpace: 'normal', maxWidth: 520, lineHeight: 1.35}}>{text}</div>
  </div>
);

/* ---------- S5 怎么防：三个做法 ---------- */
const TIPS = ['把资料给它，照着回答', '允许它说不知道', '要出处，自己再核实'];

export const S5Tips: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="cowboy" eyes="happy">
    <Pop f={f} at={cf(34)} x={0} y={0}>
      <div style={bigText(84, C.yellow)}>平时怎么防？</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cf(35) + 8 + i * 6} x={0} y={140 + i * 90} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...txt(34, C.white), width: 56, height: 56, borderRadius: 28, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(48)}>{t}</div>
        </div>
      </Pop>
    ))}
  </Host>
);
export const S5Sfx: SfxCue[] = [
  ['question', cf(34), 0.35],
  ...TIPS.map((_, i) => ['click', cf(35) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- S6 做法一：把资料给它，照着回答 ---------- */
export const S6Source: React.FC<{f: number}> = ({f}) => {
  const dropAt = cw(38, '贴进');
  const drop = prog(f, dropAt - 10, 14, easeInOut);
  const ruleAt = cf(39);
  const ansAt = cf(40);
  return (
    <>
      <Pop f={f} at={cf(36)} x={500} y={40} enter="up">
        <Win w={1000} h={520} title="发给 AI">
          <div style={{padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18}}>
            {f >= dropAt + 4 && (
              <div style={{display: 'flex', justifyContent: 'flex-end', opacity: prog(f, dropAt + 4, 6)}}>
                <div style={{...txt(30), background: '#FCE3A8', border: `3px solid ${C.ink}`, borderRadius: 12, padding: '6px 14px'}}>附件：合同原文</div>
              </div>
            )}
            {f >= cf(37) && <Bubble me text="合同里关于违约金是怎么写的？" />}
            {f >= ruleAt && (
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div style={{...txt(32), background: C.pink, border: `3px solid ${C.ink}`, borderRadius: 16, padding: '8px 16px'}}>
                  <Marker p={prog(f, ruleAt + 4, 10)}>只根据这些内容回答</Marker>
                </div>
              </div>
            )}
            {f >= ansAt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, ansAt, 8)}}>
                <Bubble text="合同第 8 条写着……（原文引用）" />
                <Check size={50} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(37)} out={dropAt + 12} x={80} y={40}>
        <Card w={300} h={300} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `translate(${drop * 520}px, ${drop * 60}px) scale(${1 - 0.35 * drop})`, opacity: 1 - 0.6 * prog(f, dropAt + 6, 6)}}>
            <PlainFile name="合同原文" size={130} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={ansAt + 6} x={120} y={420} rot={-4}>
        <div style={bigText(66, C.yellow)}>不用靠猜了</div>
      </Pop>
      <Burst f={f} at={ansAt + 8} x={300} y={460} r={200} />
      <Pop f={f} at={ansAt + 14} x={120} y={560}>
        <Note color={C.panel} size={26}>示例内容</Note>
      </Pop>
      <PiP f={f} at={cf(36) - 6} skin="santa" />
    </>
  );
};
export const S6Sfx: SfxCue[] = [
  ['paper', cf(36), 0.35],
  ['type', cf(37), 0.3],
  ['whoosh', cw(38, '贴进') - 10, 0.35],
  ['pop', cf(39), 0.3],
  ['ding', cf(40), 0.4],
];

/* ---------- S7 做法二：允许它说不知道（给它一个台阶） ---------- */
export const S7Unsure: React.FC<{f: number}> = ({f}) => {
  const lineAt = cw(43, '不确定');
  const noStepAt = cf(44);
  const forceAt = cw(45, '硬着头皮');
  return (
    <>
      <Pop f={f} at={cf(41)} x={80} y={40} enter="up">
        <Win w={860} h={200} title="提示词">
          <div style={{...txt(38), padding: '40px 30px'}}>
            ……<Marker p={prog(f, lineAt, 10)}>不确定的地方就直接说不确定</Marker>
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={lineAt + 6} x={80} y={300} enter="left">
        <Card w={680} h={300} bg={C.tealLight}>
          <div style={txt(34)}>给了台阶</div>
          <div style={{marginTop: 20}}>
            <Bubble text="这一点我不确定，建议你查一下原始资料。" color={C.white} />
          </div>
          <div style={{marginTop: 16}}><Check size={56} /></div>
        </Card>
      </Pop>
      <Pop f={f} at={noStepAt} x={820} y={300} enter="right">
        <div style={{transform: `translateX(${jolt(f, forceAt, 8, 14)}px)`}}>
          <Card w={680} h={300} bg="#E6E1D6">
            <div style={txt(34)}>没给台阶</div>
            <div style={{marginTop: 20, opacity: prog(f, forceAt, 8)}}>
              <Bubble text="当然！答案是……（硬编一个）" color="#FFD9D6" />
            </div>
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={forceAt + 6} x={1000} y={120} rot={-4}>
        <div style={bigText(64, C.red)}>硬着头皮编！</div>
      </Pop>
      <Emote f={f} at={forceAt + 4} kind="sweat" x={1400} y={330} />
      <PiP f={f} at={cf(41) - 6} skin="detective" />
    </>
  );
};
export const S7Sfx: SfxCue[] = [
  ['paper', cf(41), 0.35],
  ['pop', cw(43, '不确定'), 0.3],
  ['ding', cw(43, '不确定') + 6, 0.3],
  ['whoosh', cf(44), 0.3],
  ['error', cw(45, '硬着头皮'), 0.4],
  ['boing', cw(45, '硬着头皮') + 6, 0.3],
];

/* ---------- S8 做法三：要出处，关键信息自己核实 ---------- */
const FACTS = [
  {t: '这件事发生在 2019 年', src: '出处 1'},
  {t: '提出者是张教授', src: '出处 2'},
  {t: '详情见这个链接', src: '出处 3'},
];

export const S8Verify: React.FC<{f: number}> = ({f}) => {
  const checkAt = cf(47);
  const scan = prog(f, checkAt, 36, easeInOut);
  const keyAt = cf(48);
  const minAt = cf(49);
  const worthAt = cw(50, '划算');
  return (
    <>
      <Pop f={f} at={cf(46)} x={80} y={40} enter="up">
        <Card w={820} h={420} bg={C.white}>
          <div style={txt(34, C.inkSoft)}>AI 的回答（要求它附上出处）</div>
          {FACTS.map((x, i) => (
            <div key={x.t} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 26, opacity: prog(f, cf(46) + 6 + i * 5, 6)}}>
              <div style={txt(38)}>
                {i === 2 || f < keyAt ? x.t : <Marker p={prog(f, keyAt + i * 6, 8)}>{x.t}</Marker>}
              </div>
              <div style={{...txt(26, C.teal), border: `3px solid ${C.teal}`, borderRadius: 10, padding: '2px 10px'}}>{x.src}</div>
              {f >= checkAt + 12 + i * 10 && <Check size={44} p={prog(f, checkAt + 12 + i * 10, 6)} />}
            </div>
          ))}
          <div style={{...txt(24, C.inkSoft), marginTop: 30}}>示例内容</div>
        </Card>
      </Pop>
      {f >= checkAt && f < checkAt + 44 && (
        <div style={{position: 'absolute', left: lerp(760, 820, scan), top: lerp(110, 330, scan)}}>
          <Magnifier size={140} />
        </div>
      )}
      <Pop f={f} at={checkAt} x={980} y={60}>
        <Note color={C.tealLight} size={36}>关键信息，自己再核实一遍</Note>
      </Pop>
      <Pop f={f} at={keyAt} x={980} y={160}>
        <div style={{display: 'flex', gap: 14}}>
          {['数字', '人名', '链接'].map((t, i) => (
            <div key={t} style={{...txt(38), opacity: prog(f, keyAt + i * 6, 6), background: '#FFD9D6', border: `4px solid ${C.red}`, borderRadius: 14, padding: '6px 18px'}}>{t}</div>
          ))}
        </div>
      </Pop>
      <Pop f={f} at={minAt} x={1000} y={280}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Stopwatch size={130} p={prog(f, minAt, 40)} />
          <div style={bigText(56, C.white)}>花一分钟</div>
        </div>
      </Pop>
      <FocusLines f={f} at={worthAt} out={worthAt + 30} x={1200} y={560} />
      <Pop f={f} at={worthAt} x={960} y={500} rot={-4}>
        <div style={bigText(60, C.yellow)}>比事后被骗划算得多</div>
      </Pop>
      {f >= cf(46) && <Char f={f} x={560} y={790} s={0.6} kind="bot" lookX={0.4} eyes={f >= checkAt + 42 ? 'happy' : 'open'} />}
      <PiP f={f} at={cf(46) - 6} skin="chef" eyes={f >= worthAt ? 'happy' : 'open'} />
    </>
  );
};
export const S8Sfx: SfxCue[] = [
  ['paper', cf(46), 0.35],
  ['whoosh', cf(47), 0.3],
  ...FACTS.map((_, i) => ['ding', cf(47) + 12 + i * 10, 0.22] as SfxCue),
  ['pop', cf(48), 0.3],
  ['click', cf(49), 0.3],
  ['magic', cw(50, '划算'), 0.4],
];

/* ---------- S9 结尾 ---------- */
export const S9Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(52);
  return (
    <>
      <Host f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(51)} x={0} y={60}>
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
export const S9Sfx: SfxCue[] = [
  ['pop', cf(51), 0.4],
  ['confetti', cf(52), 0.5],
  ['ding', cf(52) + 2, 0.3],
];
