import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {CalendarIcon, DatabaseIcon, KeyIcon, PlainFile, Stamp, stampScale} from '../../../library/icons';
import {Code, Cursor, Win} from '../../../library/items/apps';
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

/** 一把带标签的钥匙；off 时变灰并上锁 */
export const KEYS = [
  {t: '看', c: C.tealLight},
  {t: '改', c: C.yellow},
  {t: '删', c: '#F2A0B4'},
  {t: '花钱', c: '#FFB37A'},
];
export const LabeledKey: React.FC<{i: number; off?: boolean; size?: number}> = ({i, off, size = 120}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: off ? 0.45 : 1, filter: off ? 'grayscale(1)' : 'none'}}>
    <KeyIcon size={size} color={KEYS[i].c} />
    <div style={{...txt(size * 0.34), background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 12px'}}>{KEYS[i].t}</div>
  </div>
);

/* ---------- B1 钩子：交代了别动代码，AI 还是删了线上数据库 ---------- */
export const B1Hook: React.FC<{f: number}> = ({f}) => {
  const freezeAt = cf(3);
  const runAt = cf(4);
  const goneAt = cw(5, '删了');
  const sorryAt = cf(6);
  const whyAt = cf(7) + 4;
  const gone = prog(f, goneAt, 10);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20} rot={-2}>
        <Note color={C.panel} size={38}>去年七月 · Replit 的 AI 编程助手</Note>
      </Pop>
      <Pop f={f} at={freezeAt} x={60} y={110} enter="up">
        <Win w={960} h={160} title="用户交代">
          <div style={{padding: '18px 26px'}}>
            <Bubble me text="先别动代码，现在是冻结期" size={40} />
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={runAt} x={60} y={300} enter="up">
        <Win w={960} h={150} title="AI 执行命令" dark>
          <div style={{padding: '22px 26px'}}>
            <Code lines={[[['> ', C.yellow], ['删除线上数据库……', '#FF8A8A']]]} typed={Math.max(0, Math.floor((f - runAt) / 2))} size={40} f={f} />
          </div>
        </Win>
      </Pop>
      {f >= runAt + 10 && (
        <div style={{position: 'absolute', left: 90, top: 490, opacity: 1 - 0.75 * gone, transform: `translateX(${jolt(f, goneAt, 14, 16)}px)`}}>
          <DatabaseIcon size={180} />
          <div style={{...txt(32), textAlign: 'center', marginTop: 4}}>线上数据库</div>
        </div>
      )}
      {f >= goneAt + 4 && (
        <div style={{position: 'absolute', left: 80, top: 560, transform: `scale(${stampScale(f, goneAt + 4)}) rotate(-10deg)`}}>
          <Stamp text="已删除" size={64} />
        </div>
      )}
      <FocusLines f={f} at={goneAt} out={goneAt + 30} x={200} y={600} />
      <Pop f={f} at={sorryAt} x={380} y={560} rot={2}>
        <Note color={C.yellow} size={36}>事后 Replit 的 CEO 公开道歉</Note>
      </Pop>
      <Pop f={f} at={whyAt} x={60} y={790} rot={-3}>
        <div style={bigText(76, C.red)}>它怎么闯了这么大的祸？</div>
      </Pop>
      <Pop f={f} at={cf(6) + 8} x={400} y={640} rot={-2}>
        <Note color={C.panel} size={26}>真实事件，画面为示意</Note>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= goneAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const B1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['type', cf(3), 0.3],
  ['type', cf(4), 0.35],
  ['error', cw(5, '删了'), 0.5],
  ['stamp', cw(5, '删了') + 4, 0.45],
  ['shake', cw(5, '删了') + 2, 0.3],
  ['pop', cf(6), 0.3],
  ['question', cf(7) + 4, 0.4],
];

/* ---------- B2 问题出在 Agent 的权限 ---------- */
export const B2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cf(11) + 4; // 「权限」在句尾，挂在句首附近
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(9)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>一件很多人没太在意的事</Note>
      </Pop>
      <Pop f={f} at={cf(10)} x={40} y={90} rot={-2}>
        <div style={bigText(80, C.white)}>Agent 的</div>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={230} />
      <Pop f={f} at={nameAt} x={420} y={60} rot={-3}>
        <div style={bigText(170, C.yellow)}>权限</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={540} y={170} r={280} n={16} />
      <Pop f={f} at={nameAt + 8} x={40} y={230} rot={4}>
        <KeyIcon size={160} color={C.yellow} />
      </Pop>
    </HostTall>
  );
};
export const B2Sfx: SfxCue[] = [
  ['pop', cf(9), 0.3],
  ['pop', cf(10), 0.3],
  ['magic', cf(11) + 4, 0.5],
];

/* ---------- B3 Agent 能自己动手：读文件、改代码、发消息、接工具 ---------- */
const HANDS = [
  {t: '读文件', at: () => cw(15, '读文件'), icon: <PlainFile name="" size={60} />},
  {t: '改代码', at: () => cw(15, '改代码'), icon: <div style={{...txt(36, C.teal), fontWeight: 700}}>{'</>'}</div>},
  {t: '发消息', at: () => cw(15, '发消息'), icon: <div style={{width: 60, height: 44, background: C.tealLight, border: `4px solid ${C.ink}`, borderRadius: 12}} />},
  {t: '接工具', at: () => cf(16), icon: <CalendarIcon size={60} />},
];

export const B3Hands: React.FC<{f: number}> = ({f}) => {
  const agentAt = cw(14, '动手');
  return (
    <>
      <Pop f={f} at={cf(13)} x={60} y={30} enter="left">
        <Card w={960} h={230} bg="#E6E1D6">
          <div style={txt(42)}>聊天 AI</div>
          <div style={{marginTop: 18}}>
            <Bubble text="你可以这样做：第一步……" size={38} />
          </div>
          <div style={{...txt(32, C.inkSoft), marginTop: 14}}>只会说，动手的还是你</div>
        </Card>
      </Pop>
      <Pop f={f} at={agentAt} x={60} y={300} enter="left">
        <Card w={960} h={340} bg={C.tealLight}>
          <div style={txt(42)}>Agent：能自己动手</div>
          <div style={{display: 'flex', gap: 22, marginTop: 30}}>
            {HANDS.map((h) => (
              <div key={h.t} style={{width: 200, height: 170, boxSizing: 'border-box', background: C.white, border: `4px solid ${C.ink}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: prog(f, h.at(), 6), transform: `scale(${lerp(0.6, 1, prog(f, h.at(), 8, easeOut))})`}}>
                {h.icon}
                <div style={txt(36)}>{h.t}</div>
              </div>
            ))}
          </div>
        </Card>
      </Pop>
      <Char f={f} x={200} y={820} s={1.0} kind="bot" eyes="happy" armsUp={f >= agentAt ? 0.4 + 0.4 * Math.abs(Math.sin(f * 0.25)) : 0} opacity={prog(f, agentAt, 8)} />
      <Pop f={f} at={cf(16) + 6} x={340} y={720} rot={-3}>
        <div style={bigText(72, C.yellow)}>它真的会动手</div>
      </Pop>
      <PiP f={f} at={cf(12) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const B3Sfx: SfxCue[] = [
  ['paper', cf(13), 0.3],
  ['whoosh', cw(14, '动手'), 0.35],
  ...HANDS.map((h) => ['click', h.at(), 0.3] as SfxCue),
  ['magic', cf(16) + 6, 0.35],
];

/* ---------- B4 权限就是钥匙：钥匙越多，能干的越多，闯的祸也越大 ---------- */
const KEY_AT = [() => cw(19, '看'), () => cw(19, '改'), () => cw(19, '删'), () => cw(20, '花钱')];

export const B4Keys: React.FC<{f: number}> = ({f}) => {
  const growAt = cf(21);
  const work = prog(f, cf(22), 20, easeOut);
  const risk = prog(f, cf(25) - 10, 20, easeOut);
  const oopsAt = cf(23);
  const bigAt = cf(25);
  return (
    <>
      <Pop f={f} at={cf(17)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          权限 = 交给它<span style={{color: C.yellow}}>哪几把钥匙</span>
        </div>
      </Pop>
      <svg width={200} height={200} style={{position: 'absolute', left: 60, top: 160, opacity: prog(f, cf(18), 6)}}>
        <circle cx={100} cy={100} r={70} fill="none" stroke={C.ink} strokeWidth={10} />
        <circle cx={100} cy={100} r={70} fill="none" stroke="#C9C2B6" strokeWidth={5} />
      </svg>
      {KEY_AT.map((at, i) => (
        <Pop key={i} f={f} at={at()} x={260 + (i % 2) * 380} y={160 + Math.floor(i / 2) * 100} rot={[-6, 4, -3, 6][i]}>
          <LabeledKey i={i} size={140} />
        </Pop>
      ))}
      <Pop f={f} at={growAt} x={60} y={400} enter="up">
        <Card w={740} h={260} bg={C.white}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10}}>
            <div style={{...txt(38), width: 220}}>能干的活</div>
            <div style={{width: 440, height: 46, border: `4px solid ${C.ink}`, borderRadius: 23, overflow: 'hidden', background: C.panel}}>
              <div style={{width: `${30 + 70 * work}%`, height: '100%', background: C.teal}} />
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 40}}>
            <div style={{...txt(38), width: 220}}>闯祸的风险</div>
            <div style={{width: 440, height: 46, border: `4px solid ${C.ink}`, borderRadius: 23, overflow: 'hidden', background: C.panel}}>
              <div style={{width: `${30 + 70 * risk}%`, height: '100%', background: C.red}} />
            </div>
          </div>
          <div style={{...txt(24, C.inkSoft), marginTop: 22}}>示意</div>
        </Card>
      </Pop>
      <Char f={f} x={920} y={620} s={0.7} kind="bot" eyes={f >= oopsAt ? 'spiral' : 'open'} lookX={-0.5} opacity={prog(f, growAt, 8)} />
      <Emote f={f} at={oopsAt + 2} kind="?" x={920} y={440} dur={50} />
      <Pop f={f} at={oopsAt + 6} x={820} y={650} rot={4}>
        <Note color={C.pink} size={26}>理解错了</Note>
      </Pop>
      <FocusLines f={f} at={bigAt} out={bigAt + 30} x={400} y={780} />
      <Pop f={f} at={bigAt} x={60} y={720} rot={-3}>
        <div style={{...bigText(80, C.red), transform: `translateX(${jolt(f, bigAt, 12, 14)}px)`}}>钥匙越多，祸越大</div>
      </Pop>
      <PiP f={f} at={cf(17) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const B4Sfx: SfxCue[] = [
  ['pop', cf(17), 0.35],
  ...KEY_AT.map((at) => ['click', at(), 0.3] as SfxCue),
  ['paper', cf(21), 0.3],
  ['ding', cf(22), 0.3],
  ['question', cf(23), 0.3],
  ['error', cf(25), 0.4],
];

/* ---------- B5 确认机制：先停下来问你，你同意它才动手，最后一道闸门 ---------- */
export const B5Confirm: React.FC<{f: number}> = ({f}) => {
  const askAt = cw(29, '问你');
  const okAt = cw(30, '同意');
  const click = prog(f, okAt - 14, 12, easeInOut);
  const gateAt = cf(32);
  const gate = prog(f, gateAt, 14, easeOut);
  return (
    <>
      <Pop f={f} at={cf(26)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          动手之前<span style={{color: C.yellow}}>先问你</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(28)} x={60} y={150} enter="up">
        <Card w={800} h={330} bg="#FFFDF7">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{...txt(30, C.white), background: C.orange, borderRadius: 10, padding: '2px 12px'}}>需要确认</div>
            <div style={txt(30, C.inkSoft)}>有风险的操作</div>
          </div>
          <div style={{...txt(44), marginTop: 22}}>Agent 想要执行</div>
          <div style={{...txt(42, C.red), marginTop: 8}}>删除 3 个文件</div>
          {f >= askAt && (
            <div style={{display: 'flex', gap: 24, marginTop: 28, opacity: prog(f, askAt, 6)}}>
              <div style={{...txt(38), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 34px'}}>拒绝</div>
              <div style={{...txt(38, C.white), background: f >= okAt ? '#2E8A54' : '#3DAA6B', border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 34px', transform: `scale(${f >= okAt && f < okAt + 6 ? 0.92 : 1})`}}>同意</div>
            </div>
          )}
        </Card>
      </Pop>
      {f >= okAt - 14 && f < okAt + 30 && (
        <div style={{position: 'absolute', left: lerp(700, 330, click), top: lerp(560, 410, click)}}>
          <Cursor size={60} down={f >= okAt && f < okAt + 6} />
        </div>
      )}
      <Pop f={f} at={cf(31)} x={600} y={500} rot={4}>
        <Note color={C.panel} size={34}>看起来有点烦</Note>
      </Pop>
      {f >= gateAt && (
        <svg width={760} height={240} style={{position: 'absolute', left: 60, top: 560, opacity: prog(f, gateAt, 6), overflow: 'visible'}}>
          <rect x={20} y={60} width={40} height={170} rx={8} fill="#B8BEC8" stroke={C.ink} strokeWidth={5} />
          <g transform={`rotate(${lerp(-70, 0, gate)} 40 90)`}>
            <rect x={40} y={74} width={600} height={34} rx={14} fill={C.white} stroke={C.ink} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={80 + k * 110} y={74} width={50} height={34} fill={C.red} />)}
          </g>
        </svg>
      )}
      <Burst f={f} at={gateAt + 12} x={340} y={650} r={220} />
      <Pop f={f} at={gateAt + 10} x={80} y={810} rot={-3}>
        <div style={bigText(76, C.yellow)}>最后一道闸门</div>
      </Pop>
      <PiP f={f} at={cf(26) - 6} skin="detective" eyes={f >= gateAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const B5Sfx: SfxCue[] = [
  ['pop', cf(26), 0.35],
  ['paper', cf(28), 0.3],
  ['question', cw(29, '问你'), 0.35],
  ['click', cw(30, '同意'), 0.45],
  ['pop', cf(31), 0.3],
  ['whoosh', cf(32), 0.35],
  ['stamp', cf(32) + 12, 0.4],
];
