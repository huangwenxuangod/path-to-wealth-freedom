import React from 'react';
import {easeOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Stamp, stampScale, ThumbUp, UserFace} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {StarIcon} from '../../../library/items/objects';
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

/** 一排星星，n 颗亮 */
export const Stars: React.FC<{n: number; size?: number; p?: number}> = ({n, size = 44, p = 1}) => (
  <div style={{display: 'flex', gap: 4}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{opacity: prog(p * 5, i, 1)}}>
        <StarIcon size={size} fill={i < n ? C.yellow : '#E6E1D6'} />
      </div>
    ))}
  </div>
);

/* ---------- E1 钩子：正着问被夸，反着问又顺着你挑毛病 ---------- */
export const E1Hook: React.FC<{f: number}> = ({f}) => {
  const praiseAt = cf(3);
  const flipAt = cf(5);
  const turnAt = cf(7);
  const whyAt = cf(8);
  return (
    <>
      <Pop f={f} at={cf(2)} x={60} y={20} enter="up">
        <Win w={960} h={265} title="正着问">
          <div style={{padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14}}>
            <Bubble me text="我这个方案怎么样？" size={38} />
            {f >= praiseAt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <Bubble text={f >= cf(4) ? '思路清晰！很有创意！' : '太棒了！'} color={C.tealLight} size={38} />
                <ThumbUp size={70} fill={C.yellow} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={flipAt} x={60} y={305} enter="up">
        <Win w={960} h={265} title="换个说法问">
          <div style={{padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14}}>
            <Bubble me text="这个方案是不是有问题？" size={38} />
            {f >= turnAt && (
              <div style={{transform: `translateX(${jolt(f, turnAt, 10, 12)}px)`}}>
                <Bubble text="确实，问题还不少……" color="#FFD9D6" size={38} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Char f={f} x={180} y={900} s={1.0} kind="bot" eyes={f >= turnAt ? 'spiral' : f >= praiseAt ? 'heart' : 'open'} lookX={0.5} opacity={prog(f, cf(2), 8)} />
      <Emote f={f} at={praiseAt + 4} kind="heart" x={200} y={640} dur={40} />
      <FocusLines f={f} at={whyAt} out={whyAt + 30} x={540} y={680} />
      <Pop f={f} at={whyAt} x={330} y={600} rot={-3}>
        <div style={bigText(68, C.red)}>真觉得好，还是哄你？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= turnAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const E1Sfx: SfxCue[] = [
  ['type', cf(2), 0.3],
  ['ding', cf(3), 0.35],
  ['magic', cf(4), 0.3],
  ['type', cf(5), 0.3],
  ['boing', cf(7), 0.4],
  ['question', cf(8), 0.4],
];

/* ---------- E2 这叫 AI 的讨好倾向，说白了就是爱拍马屁 ---------- */
export const E2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(11, '讨好');
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'heart' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(10)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这个毛病有个专门的说法</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={190} />
      <Pop f={f} at={nameAt} x={30} y={80} rot={-3}>
        <div style={bigText(150, C.yellow)}>讨好倾向</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={340} y={170} r={300} n={16} />
      <Pop f={f} at={cf(12)} x={40} y={270} rot={2}>
        <div style={bigText(64, C.white)}>
          说白了：<span style={{color: C.red}}>爱拍马屁</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(12) + 8} x={760} y={250}>
        <ThumbUp size={110} fill={C.yellow} />
      </Pop>
    </HostTall>
  );
};
export const E2Sfx: SfxCue[] = [
  ['pop', cf(10), 0.3],
  ['magic', cw(11, '讨好'), 0.5],
  ['boing', cf(12), 0.35],
];

/* ---------- E3 原因：训练时人给回答打分，更爱听顺耳话 ---------- */
const ANSWERS = [
  {t: '你说得太对了！', stars: 5, bg: C.tealLight, at: () => cw(19, '夸自己')},
  {t: '这里有三个问题……', stars: 2, bg: '#E6E1D6', at: () => cf(20)},
];

export const E3Why: React.FC<{f: number}> = ({f}) => {
  const ratersAt = cw(17, '很多人');
  const learnAt = cf(21);
  return (
    <>
      <Pop f={f} at={cf(13)} x={60} y={30} rot={-2}>
        <Note color={C.panel} size={38}>它不是故意骗你</Note>
      </Pop>
      <Pop f={f} at={cf(14)} x={460} y={30} rot={2}>
        <Note color={C.yellow} size={34}>有研究认为：和训练方式有关</Note>
      </Pop>
      <Pop f={f} at={ratersAt} x={60} y={130} enter="up">
        <Card w={960} h={150} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px'}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{opacity: prog(f, ratersAt + i * 4, 6)}}>
              <UserFace size={100} mood={f >= cw(18, '顺耳') ? 'happy' : 'calm'} f={f} />
            </div>
          ))}
          <div style={txt(40)}>很多人给它的回答打分</div>
        </Card>
      </Pop>
      <Pop f={f} at={cw(18, '顺耳')} x={60} y={300} rot={-2}>
        <Note color={C.pink} size={38}>人往往更爱听顺耳的话</Note>
      </Pop>
      {ANSWERS.map((a, i) => (
        <Pop key={a.t} f={f} at={a.at()} x={60} y={400 + i * 140} enter="left">
          <Card w={960} h={120} pad={0} bg={a.bg} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
            <div style={{...txt(42), flex: 1}}>{a.t}</div>
            <Stars n={a.stars} size={50} p={prog(f, a.at() + 6, 14)} />
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={cf(20)} x={60} y={680} rot={-2}>
        <Note color={C.yellow} size={34}>夸自己、同意自己的，分打得更高</Note>
      </Pop>
      <Char f={f} x={720} y={940} s={0.75} kind="bot" eyes={f >= learnAt ? 'heart' : 'open'} lookX={-0.5} opacity={prog(f, learnAt - 10, 8)} />
      <FocusLines f={f} at={cf(22)} out={cf(22) + 30} x={420} y={840} />
      <Pop f={f} at={cf(22)} x={60} y={790} rot={-3}>
        <div style={bigText(76, C.red)}>学会了顺着你说</div>
      </Pop>
      <PiP f={f} at={cf(13) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const E3Sfx: SfxCue[] = [
  ['pop', cf(13), 0.3],
  ['pop', cf(14), 0.3],
  ...[0, 1, 2].map((i) => ['click', cw(17, '很多人') + i * 4, 0.25] as SfxCue),
  ['pop', cw(18, '顺耳'), 0.3],
  ['ding', cw(19, '夸自己') + 6, 0.35],
  ['error', cf(20) + 6, 0.3],
  ['magic', cf(22), 0.4],
];

/* ---------- E4 连 AI 公司都头疼：ChatGPT 一次更新太会奉承，几天后撤回 ---------- */
const COMPLAINTS = ['它怎么什么都夸？', '我说要辞职炒股，它也说好主意'];

export const E4Incident: React.FC<{f: number}> = ({f}) => {
  const updAt = cf(26);
  const userAt = cw(27, '用户');
  const ownAt = cf(30);
  const backAt = cf(31);
  const slide = prog(f, backAt, 14, easeOut);
  return (
    <>
      <Pop f={f} at={cf(23)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          连做 AI 的公司<span style={{color: C.red}}>都头疼</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(25)} x={60} y={140} rot={-2}>
        <Note color={C.yellow} size={38}>去年四月</Note>
      </Pop>
      <Pop f={f} at={updAt} x={60} y={230} enter="up">
        <div style={{opacity: 1 - 0.5 * slide}}>
          <Card w={720} h={140} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px'}}>
            <div style={{...txt(30, C.white), background: C.teal, borderRadius: 10, padding: '2px 14px'}}>新版本</div>
            <div style={txt(42)}>ChatGPT 发布了一次更新</div>
          </Card>
        </div>
      </Pop>
      {COMPLAINTS.map((t, i) => (
        <Pop key={t} f={f} at={userAt + i * 14} x={60 + i * 120} y={400 + i * 100} enter="left">
          <Bubble text={t} me={false} color={i ? C.pink : '#FFF3B8'} size={36} />
        </Pop>
      ))}
      <Pop f={f} at={userAt + 28} x={700} y={420} rot={4}>
        <Note color={C.panel} size={28}>用户吐槽（示意）</Note>
      </Pop>
      <Pop f={f} at={ownAt} x={60} y={630} enter="up">
        <Card w={740} h={120} pad={0} bg="#FFFDF7" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px'}}>
          <div style={txt(40)}>OpenAI 公开承认了这个问题</div>
        </Card>
      </Pop>
      {f >= backAt && (
        <div style={{position: 'absolute', left: 520, top: 220, transform: `scale(${stampScale(f, backAt)}) rotate(-10deg)`}}>
          <Stamp text="已撤回" size={80} />
        </div>
      )}
      <FocusLines f={f} at={backAt} out={backAt + 30} x={600} y={290} />
      <Pop f={f} at={backAt + 8} x={60} y={790} rot={-3}>
        <div style={bigText(72, C.yellow)}>几天后就撤了回去</div>
      </Pop>
      <PiP f={f} at={cf(23) - 6} skin="chef" eyes={f >= backAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const E4Sfx: SfxCue[] = [
  ['pop', cf(23), 0.35],
  ['pop', cf(25), 0.3],
  ['paper', cf(26), 0.3],
  ['type', cw(27, '用户'), 0.3],
  ['type', cw(27, '用户') + 14, 0.3],
  ['paper', cf(30), 0.3],
  ['stamp', cf(31), 0.5],
];
