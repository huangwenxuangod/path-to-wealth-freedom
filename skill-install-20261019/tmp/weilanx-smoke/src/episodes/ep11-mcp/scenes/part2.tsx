import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {CalendarIcon, Check, Cross, Folder, PlainFile, PlugIcon, Stamp, stampScale, Toggle} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- S6 插上之后：AI 先问工具会什么，再挑一个调用，拿结果决定下一步 ---------- */
const ABILITIES = [
  {t: '查看日程', at: () => cw(34, '查看')},
  {t: '新建日程', at: () => cw(34, '新建')},
];

export const S6Flow: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(32);
  const listAt = cf(33);
  const needAt = cf(35);
  const pickAt = cf(36);
  const resAt = cf(37);
  const nextAt = cf(38);
  return (
    <>
      <Pop f={f} at={cf(31)} x={60} y={30} rot={-2}>
        <Note color={C.panel} size={42}>插上之后</Note>
      </Pop>
      <Char f={f} x={200} y={470} s={1.1} kind="bot" eyes={f >= pickAt ? 'star' : 'open'} lookX={0.6} opacity={prog(f, cf(31), 8)} />
      <Pop f={f} at={askAt} x={60} y={120}>
        <Bubble text="你能做什么？" size={40} color={C.tealLight} />
      </Pop>
      <Pop f={f} at={askAt + 4} x={520} y={120} enter="right">
        <Card w={500} h={330} bg={C.white}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <CalendarIcon size={80} />
            <div style={txt(46)}>日历工具</div>
          </div>
          {f >= listAt && <div style={{...txt(30, C.inkSoft), marginTop: 10}}>我能做这些：</div>}
          {ABILITIES.map((a, i) => (
            <div key={a.t} style={{...txt(44), marginTop: 12, opacity: prog(f, a.at(), 6)}}>
              · {i === 1 && f >= pickAt ? <Marker p={prog(f, pickAt, 10)}>{a.t}</Marker> : a.t}
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={needAt} x={60} y={500} enter="up">
        <div style={{width: 960}}>
          <Bubble me text="帮我周五下午约个会（示例）" size={40} />
        </div>
      </Pop>
      <Pop f={f} at={pickAt} x={60} y={610} enter="left">
        <Card w={740} h={110} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px'}}>
          <div style={txt(40)}>AI 自己挑了</div>
          <div style={{...txt(44), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '2px 16px'}}>新建日程</div>
          <div style={txt(40)}>去调用</div>
        </Card>
      </Pop>
      <Pop f={f} at={resAt} x={60} y={740} enter="left">
        <Card w={740} h={100} pad={0} bg={C.tealLight} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px'}}>
          <Check size={56} />
          <div style={txt(40)}>拿到结果：日程已创建</div>
        </Card>
      </Pop>
      <Pop f={f} at={nextAt} x={60} y={870} rot={-2}>
        <div style={bigText(64, C.yellow)}>再接着决定下一步</div>
      </Pop>
      <PiP f={f} at={cf(31) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const S6Sfx: SfxCue[] = [
  ['pop', cf(31), 0.3],
  ['question', cf(32), 0.3],
  ['whoosh', cf(32) + 4, 0.3],
  ...ABILITIES.map((a) => ['click', a.at(), 0.3] as SfxCue),
  ['type', cf(35), 0.3],
  ['pop', cf(36), 0.35],
  ['ding', cf(37), 0.4],
  ['boing', cf(38), 0.3],
];

/* ---------- S7 过渡：三个建议 ---------- */
const TIPS = ['找到连接器，接上常用的', '只装信得过的', '用不到的就关掉'];

export const S7Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(40);
  return (
    <HostTall f={f} skin="cowboy" eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(39)} x={0} y={0} rot={-2}>
        <div style={bigText(84, C.yellow)}>平时怎么用？</div>
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
export const S7Sfx: SfxCue[] = [
  ['question', cf(39), 0.35],
  ...TIPS.map((_, i) => ['click', cf(40) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- S8 建议一：设置里找连接器，把常用的接上 ---------- */
const CONNECT = [
  {t: '日历', w: '日历', icon: <CalendarIcon size={64} />},
  {t: '笔记', w: '笔记', icon: <div style={{width: 56, height: 64, background: '#FCE3A8', border: `4px solid ${C.ink}`, borderRadius: 8}} />},
  {t: '网盘', w: '网盘', icon: <Folder name="" size={70} />},
];

export const S8Connect: React.FC<{f: number}> = ({f}) => {
  const tabAt = cw(42, '连接器');
  const moreAt = cf(44);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          设置里找<span style={{color: C.yellow}}>连接器</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(41) + 8} x={60} y={140} enter="up">
        <Win w={960} h={470} title="AI 应用 · 设置">
          <div style={{display: 'flex', height: '100%'}}>
            <div style={{width: 250, borderRight: `4px solid ${C.ink}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, background: C.panel}}>
              {['通用', '连接器 / MCP', '隐私'].map((t, i) => (
                <div key={t} style={{...txt(34, i === 1 && f >= tabAt ? C.ink : C.inkSoft), background: i === 1 && f >= tabAt ? C.yellow : 'transparent', border: i === 1 && f >= tabAt ? `3px solid ${C.ink}` : '3px solid transparent', borderRadius: 10, padding: '4px 12px'}}>{t}</div>
              ))}
            </div>
            <div style={{flex: 1, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 22, opacity: prog(f, tabAt + 4, 6)}}>
              {CONNECT.map((c) => {
                const on = prog(f, cw(43, c.w), 6, easeInOut);
                return (
                  <div key={c.t} style={{display: 'flex', alignItems: 'center', gap: 20}}>
                    <div style={{width: 80, display: 'flex', justifyContent: 'center'}}>{c.icon}</div>
                    <div style={{...txt(44), flex: 1}}>{c.t}</div>
                    <Toggle on={on} size={100} />
                  </div>
                );
              })}
              <div style={txt(24, C.inkSoft)}>示意界面，各家应用的叫法不一样</div>
            </div>
          </div>
        </Win>
      </Pop>
      <Burst f={f} at={moreAt} x={400} y={720} r={240} />
      <FocusLines f={f} at={moreAt} out={moreAt + 30} x={420} y={720} />
      <Pop f={f} at={moreAt} x={60} y={660} rot={-3}>
        <div style={bigText(84, C.yellow)}>能干的活一下子多了</div>
      </Pop>
      <PiP f={f} at={cf(41) - 6} skin="chef" eyes={f >= moreAt ? 'star' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const S8Sfx: SfxCue[] = [
  ['pop', cf(41), 0.35],
  ['paper', cf(41) + 8, 0.3],
  ['click', cw(42, '连接器'), 0.35],
  ...CONNECT.map((c) => ['click', cw(43, c.w), 0.3] as SfxCue),
  ['magic', cf(44), 0.45],
];

/* ---------- S9 建议二：只装信得过的来源 ---------- */
const LEAK = ['通讯录', '聊天记录', '照片'];

export const S9Trust: React.FC<{f: number}> = ({f}) => {
  const rwAt = cf(46);
  const badAt = cf(47);
  const leakAt = cf(48) + 2; // 「泄露」在句子后半段，挂在句首，免得刚飞出去就切场景
  return (
    <>
      <Pop f={f} at={cf(45)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          只装<span style={{color: C.yellow}}>信得过的</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(45) + 8} x={60} y={150} enter="left">
        <Card w={960} h={170} pad={0} bg={C.tealLight} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px'}}>
          <svg width={100} height={110} viewBox="0 0 100 110">
            <path d="M50 6 L90 22 V54 Q90 88 50 104 Q10 88 10 54 V22 Z" fill={C.white} stroke={C.ink} strokeWidth={6} />
            <path d="M30 56 L45 71 L72 40" fill="none" stroke="#3DAA6B" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={txt(48)}>官方、信得过的来源</div>
        </Card>
      </Pop>
      <Pop f={f} at={rwAt} x={60} y={350} rot={-2}>
        <Note color={C.yellow} size={40}>接上之后，它能读写你的数据</Note>
      </Pop>
      <Pop f={f} at={badAt} x={60} y={450} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, leakAt, 12, 16)}px)`}}>
          <Card w={740} h={300} bg="#E6E1D6">
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <PlugIcon kind="round" size={70} color="#9A9186" />
              <div style={txt(46)}>来路不明的工具</div>
            </div>
          </Card>
          {LEAK.map((t, i) => {
            const p = prog(f, leakAt + i * 5, 24, easeOut);
            return f >= leakAt + i * 5 ? (
              <div key={t} style={{position: 'absolute', left: lerp(60 + i * 200, 790 + i * 30, p), top: lerp(150, 40 + i * 70, p), opacity: 1 - 0.7 * p, transform: `rotate(${p * 25}deg)`}}>
                <PlainFile name={t} size={90} />
              </div>
            ) : (
              <div key={t} style={{position: 'absolute', left: 60 + i * 200, top: 150}}>
                <PlainFile name={t} size={90} />
              </div>
            );
          })}
          {f >= leakAt + 6 && (
            <div style={{position: 'absolute', left: 220, top: 150, transform: `scale(${stampScale(f, leakAt + 6)}) rotate(-10deg)`}}>
              <Stamp text="信息泄露" size={64} />
            </div>
          )}
        </div>
      </Pop>
      <FocusLines f={f} at={leakAt + 6} out={leakAt + 30} x={420} y={600} />
      <PiP f={f} at={cf(45) - 6} skin="detective" eyes={f >= leakAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const S9Sfx: SfxCue[] = [
  ['pop', cf(45), 0.35],
  ['ding', cf(45) + 8, 0.3],
  ['pop', cf(46), 0.3],
  ['paper', cf(47), 0.3],
  ['whoosh', cf(48) + 2, 0.35],
  ['stamp', cf(48) + 8, 0.45],
  ['error', cf(48) + 10, 0.3],
];

/* ---------- S10 建议三：用不到的就关掉，工具说明会占上下文 ---------- */
const DESCS = ['日历说明', '表格说明', '网盘说明', '邮件说明', '地图说明', '天气说明'];

export const S10Off: React.FC<{f: number}> = ({f}) => {
  const fillAt = cf(50);
  const full = f >= fillAt + DESCS.length * 7;
  const wrongAt = cf(52);
  const tokenAt = cf(52) + 30;
  return (
    <>
      <Pop f={f} at={cf(49)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          用不到的就<span style={{color: C.red}}>关掉</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(49) + 8} x={60} y={150} enter="up">
        <Card w={960} h={220} bg={C.white}>
          <div style={txt(38)}>AI 的上下文</div>
          <div style={{marginTop: 14, width: 900, height: 96, boxSizing: 'border-box', border: `5px solid ${full ? C.red : C.ink}`, borderRadius: 14, padding: 8, display: 'flex', gap: 8, background: full ? '#FFE3E1' : C.panel}}>
            {DESCS.map((d, i) => {
              const p = prog(f, fillAt + i * 7, 6, easeOut);
              return p > 0 ? (
                <div key={d} style={{...txt(26), width: 138, flexShrink: 0, background: '#FCE3A8', border: `3px solid ${C.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`}}>{d}</div>
              ) : null;
            })}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cw(51, '上下文')} x={560} y={390} rot={3}>
        <Note color={C.pink} size={36}>每个工具的说明都占地方</Note>
      </Pop>
      <Char f={f} x={250} y={760} s={1.2} kind="bot" eyes={f >= wrongAt ? 'spiral' : 'open'} lookX={0.5} opacity={prog(f, cf(50), 8)} />
      <Emote f={f} at={wrongAt + 2} kind="?" x={270} y={470} dur={50} />
      <Pop f={f} at={wrongAt} x={480} y={500}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, width: 480}}>
          {DESCS.map((d, i) => (
            <div key={d} style={{...txt(30, i === 3 ? C.ink : C.inkSoft), background: i === 3 ? '#FFD9D6' : C.white, border: `3px solid ${i === 3 ? C.red : C.ink}`, borderRadius: 10, padding: '2px 12px', display: 'flex', alignItems: 'center', gap: 6}}>
              {d.replace('说明', '')}
              {i === 3 && f >= wrongAt + 10 && <Cross size={28} width={7} p={prog(f, wrongAt + 10, 6)} />}
            </div>
          ))}
        </div>
      </Pop>
      <Pop f={f} at={wrongAt + 10} x={480} y={640} rot={-2}>
        <Note color={C.panel} size={36}>工具太多，容易挑错</Note>
      </Pop>
      <FocusLines f={f} at={tokenAt} out={tokenAt + 30} x={420} y={900} />
      <Pop f={f} at={tokenAt} x={60} y={830} rot={-3}>
        <div style={bigText(88, C.red)}>还更费 token</div>
      </Pop>
      <PiP f={f} at={cf(49) - 6} wear={['headphones']} {...PIP_TALL} />
    </>
  );
};
export const S10Sfx: SfxCue[] = [
  ['pop', cf(49), 0.35],
  ['paper', cf(49) + 8, 0.3],
  ...DESCS.map((_, i) => ['click', cf(50) + i * 7, 0.25] as SfxCue),
  ['error', cf(50) + DESCS.length * 7, 0.3],
  ['question', cf(52), 0.3],
  ['boing', cf(52) + 10, 0.3],
  ['shake', cf(52) + 30, 0.3],
];

/* ---------- S11 结尾 ---------- */
export const S11Bye: React.FC<{f: number}> = ({f}) => {
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
export const S11Sfx: SfxCue[] = [
  ['pop', cf(54), 0.4],
  ['confetti', cf(55), 0.5],
  ['ding', cf(55) + 2, 0.3],
];
