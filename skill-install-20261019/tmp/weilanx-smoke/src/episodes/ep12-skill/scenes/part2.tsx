import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {FONT_CODE} from '../../../library/fonts';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, Stamp, stampScale} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {Magnifier, StarIcon} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble, ManualBook} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- K7 过渡：怎么给自己写一个，三个建议 ---------- */
const TIPS = ['从反复交代的事开始', '简介写清楚什么时候用', '边用边改'];

export const K7Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(37);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(36)} x={0} y={0} rot={-2}>
        <div style={bigText(84, C.yellow)}>怎么写一个？</div>
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
export const K7Sfx: SfxCue[] = [
  ['question', cf(36), 0.35],
  ...TIPS.map((_, i) => ['click', cf(37) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- K8 建议一：同一套要求说了好几遍，就写成 Skill ---------- */
const REPEAT = [() => cf(39), () => cf(40), () => cw(40, '好几遍')];

export const K8Repeat: React.FC<{f: number}> = ({f}) => {
  const packAt = cf(42);
  const pack = prog(f, packAt, 14, easeInOut);
  const oneAt = cf(43);
  return (
    <>
      <Pop f={f} at={cf(38)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          从<span style={{color: C.yellow}}>反复交代的事</span>开始
        </div>
      </Pop>
      {REPEAT.map((at, i) => (
        <Pop key={i} f={f} at={at()} x={60} y={140 + i * 86} enter="right">
          <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: 1 - pack, transform: `translateY(${pack * (380 - i * 86)}px) scale(${1 - 0.5 * pack})`, transformOrigin: 'left center'}}>
            <div style={{...txt(30, C.white), background: i === 2 ? C.red : C.inkSoft, borderRadius: 10, padding: '4px 12px'}}>第 {i + 1} 遍</div>
            <Bubble me text="周报先写进度，再写风险，别超过 300 字" size={36} />
          </div>
        </Pop>
      ))}
      {[
        {t: '周报的格式', at: cw(41, '周报')},
        {t: '回复客户的语气', at: cw(41, '回复')},
      ].map((x, i) => (
        <Pop key={x.t} f={f} at={x.at} x={60 + i * 330} y={410} rot={i ? 3 : -3}>
          <Note color={C.yellow} size={38}>{x.t}</Note>
        </Pop>
      ))}
      <Pop f={f} at={packAt + 8} x={60} y={510}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <ManualBook title="周报 Skill" w={150} h={190} color={C.orange} />
          <div style={bigText(60, C.yellow)}>写成一个 Skill</div>
        </div>
      </Pop>
      <Burst f={f} at={packAt + 10} x={140} y={600} r={200} />
      <Pop f={f} at={oneAt} x={60} y={730} enter="up">
        <Card w={740} h={120} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px'}}>
          <Bubble me text="写本周周报" size={40} />
          <Check size={56} p={prog(f, oneAt + 8, 8)} />
          <div style={txt(40, C.teal)}>一句话调出来</div>
        </Card>
      </Pop>
      <PiP f={f} at={cf(38) - 6} skin="cowboy" eyes={f >= oneAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const K8Sfx: SfxCue[] = [
  ['pop', cf(38), 0.35],
  ...REPEAT.map((at) => ['type', at(), 0.3] as SfxCue),
  ['pop', cw(41, '周报'), 0.3],
  ['pop', cw(41, '回复'), 0.3],
  ['whoosh', cf(42), 0.35],
  ['magic', cf(42) + 8, 0.4],
  ['ding', cf(43) + 8, 0.4],
];

/* ---------- K9 建议二：简介写清楚什么时候用 ---------- */
export const K9Desc: React.FC<{f: number}> = ({f}) => {
  const goodAt = cf(44) + 8;
  const readAt = cf(45);
  const scan = prog(f, readAt, 30, easeInOut);
  const badAt = cf(47);
  const lostAt = cf(48);
  return (
    <>
      <Pop f={f} at={cf(44)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          简介写清楚<span style={{color: C.yellow}}>什么时候用</span>
        </div>
      </Pop>
      <Pop f={f} at={goodAt} x={60} y={140} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={960} h={210} pad={0} bg={C.tealLight} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px'}}>
            <ManualBook title="周报助手" w={110} h={150} color={C.orange} size={26} />
            <div>
              <div style={txt(32, C.inkSoft)}>简介</div>
              <div style={{...txt(42), marginTop: 6}}>
                <Marker p={prog(f, readAt + 10, 12)}>用户要写周报、周总结时使用</Marker>
              </div>
            </div>
          </Card>
          <div style={{position: 'absolute', right: 20, top: -24}}>
            <Check size={70} p={prog(f, readAt + 20, 8)} />
          </div>
        </div>
      </Pop>
      {f >= readAt && f < readAt + 40 && (
        <div style={{position: 'absolute', left: lerp(300, 720, scan), top: 190}}>
          <Magnifier size={140} />
        </div>
      )}
      <Pop f={f} at={cf(46)} x={60} y={380} rot={-2}>
        <Note color={C.yellow} size={38}>AI 靠这一句判断要不要翻开</Note>
      </Pop>
      <Pop f={f} at={badAt} x={60} y={480} enter="left">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, lostAt, 12, 14)}px)`}}>
          <Card w={960} h={210} pad={0} bg="#E6E1D6" style={{display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px'}}>
            <ManualBook title="工具箱" w={110} h={150} color="#B8BEC8" size={26} />
            <div>
              <div style={txt(32, C.inkSoft)}>简介</div>
              <div style={{...txt(42, C.inkSoft), marginTop: 6}}>一个很有用的技能</div>
            </div>
          </Card>
          <div style={{position: 'absolute', right: 20, top: -24}}>
            <Cross size={70} p={prog(f, badAt + 12, 8)} />
          </div>
        </div>
      </Pop>
      <Emote f={f} at={lostAt + 2} kind="?" x={900} y={470} dur={50} />
      <FocusLines f={f} at={lostAt} out={lostAt + 30} x={420} y={800} />
      <Pop f={f} at={lostAt} x={60} y={740} rot={-3}>
        <div style={bigText(80, C.red)}>该用的时候想不起来</div>
      </Pop>
      <PiP f={f} at={cf(44) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const K9Sfx: SfxCue[] = [
  ['pop', cf(44), 0.35],
  ['whoosh', cf(44) + 8, 0.3],
  ['click', cf(45), 0.3],
  ['ding', cf(45) + 20, 0.35],
  ['pop', cf(46), 0.3],
  ['whoosh', cf(47), 0.3],
  ['error', cf(47) + 12, 0.35],
  ['boing', cf(48), 0.35],
];

/* ---------- K10 建议三：边用边改，把纠正补进手册 ---------- */
const OLD_LINES = ['- 周报先写进度，再写风险', '- 不超过 300 字'];
const NEW_LINE = '- 不写“辛苦各位”这类客套话';

export const K10Iterate: React.FC<{f: number}> = ({f}) => {
  const wrongAt = cf(50);
  const fixAt = cf(51);
  const addAt = cw(52, '补进');
  const typed = Math.max(0, Math.floor((f - addAt) / 2));
  const betterAt = cf(53) + 4; // 「越用」在句尾，挂在句首附近
  return (
    <>
      <Pop f={f} at={cf(49)} x={60} y={30}>
        <div style={bigText(90, C.yellow)}>边用边改</div>
      </Pop>
      <Pop f={f} at={wrongAt} x={60} y={150} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={960} h={140} bg={C.white}>
            <div style={txt(30, C.inkSoft)}>它写的周报</div>
            <div style={{...txt(40), marginTop: 8}}>本周辛苦各位，工作稳步推进……</div>
          </Card>
          {f >= wrongAt + 12 && (
            <div style={{position: 'absolute', right: 30, top: 20, transform: `scale(${stampScale(f, wrongAt + 12)}) rotate(-8deg)`}}>
              <Stamp text="不对" size={60} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={fixAt} x={60} y={320}>
        <div style={{width: 960}}>
          <Bubble me text="周报不要写客套话" size={40} />
        </div>
      </Pop>
      <Pop f={f} at={cf(52)} x={60} y={420} enter="up">
        <Win w={740} h={270} title="周报 Skill / SKILL.md">
          <div style={{padding: '18px 26px', fontFamily: FONT_CODE}}>
            {OLD_LINES.map((l) => (
              <div key={l} style={{...txt(36, C.inkSoft), fontFamily: FONT_CODE, marginTop: 8}}>{l}</div>
            ))}
            {f >= addAt && (
              <div style={{...txt(36), fontFamily: FONT_CODE, marginTop: 8}}>
                <Marker p={prog(f, addAt + NEW_LINE.length * 2, 8)} color={C.tealLight}>
                  {NEW_LINE.slice(0, typed)}
                </Marker>
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={addAt + 4} x={810} y={480} rot={4}>
        <Note color={C.yellow} size={30}>把经验补进手册</Note>
      </Pop>
      <FocusLines f={f} at={betterAt} out={betterAt + 30} x={400} y={800} />
      <Pop f={f} at={betterAt} x={60} y={730} rot={-3}>
        <div style={bigText(88, C.yellow)}>越用越顺手</div>
      </Pop>
      <div style={{position: 'absolute', left: 560, top: 740, display: 'flex', gap: 8}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{opacity: prog(f, betterAt + 6 + i * 5, 5), transform: `scale(${lerp(0.4, 1, prog(f, betterAt + 6 + i * 5, 8, easeOut))})`}}>
            <StarIcon size={70} fill={C.yellow} />
          </div>
        ))}
      </div>
      <Burst f={f} at={betterAt + 4} x={260} y={780} r={220} />
      <PiP f={f} at={cf(49) - 6} skin="detective" eyes={f >= betterAt ? 'star' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const K10Sfx: SfxCue[] = [
  ['pop', cf(49), 0.35],
  ['paper', cf(50), 0.3],
  ['stamp', cf(50) + 12, 0.4],
  ['type', cf(51), 0.3],
  ['paper', cf(52), 0.3],
  ['type', cw(52, '补进'), 0.35],
  ['magic', cf(53) + 4, 0.45],
];

/* ---------- K11 结尾 ---------- */
export const K11Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(55);
  return (
    <>
      <HostTall f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(54)} x={0} y={20}>
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
export const K11Sfx: SfxCue[] = [
  ['pop', cf(54), 0.4],
  ['confetti', cf(55), 0.5],
  ['ding', cf(55) + 2, 0.3],
];
