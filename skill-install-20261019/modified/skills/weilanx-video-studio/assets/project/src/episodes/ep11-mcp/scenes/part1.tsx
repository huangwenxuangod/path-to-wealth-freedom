import React from 'react';
import {easeOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {CalendarIcon, Check, PlugIcon, SheetIcon, Stamp, stampScale, type PlugKind} from '../../../library/icons';
import {GitHubMark, Win} from '../../../library/items/apps';
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

/** 工具卡片：图标 + 名字 */
export const TOOLS = [
  {t: '日历', icon: (s: number) => <CalendarIcon size={s} />},
  {t: '表格', icon: (s: number) => <SheetIcon size={s} />},
  {t: '代码仓库', icon: (s: number) => <GitHubMark size={s * 0.8} />},
];
export const ToolCard: React.FC<{i: number; w?: number; h?: number; icon?: number; size?: number; bg?: string}> = ({i, w = 280, h = 120, icon = 70, size = 40, bg = C.white}) => (
  <Card w={w} h={h} pad={0} bg={bg} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
    {TOOLS[i].icon(icon)}
    <div style={txt(size)}>{TOOLS[i].t}</div>
  </Card>
);
export const AppCard: React.FC<{k: string; w?: number; h?: number}> = ({k, w = 280, h = 100}) => (
  <Card w={w} h={h} pad={0} bg={C.tealLight} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={txt(40)}>AI 应用 {k}</div>
  </Card>
);

/* ---------- S1 钩子：以前访问不了日历，现在能读日历、改表格、提交代码 ---------- */
const NOW = [
  {i: 0, t: '读你的日历', at: () => cw(4, '日历')},
  {i: 1, t: '改你的表格', at: () => cf(5)},
  {i: 2, t: '帮你提交修改', at: () => cw(6, '代码')},
];

export const S1Hook: React.FC<{f: number}> = ({f}) => {
  const sorryAt = cf(2);
  const noAt = cf(3) + 10;
  const nowAt = cf(4);
  const whyAt = cf(7) + 4;
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20} rot={-2}>
        <Note color={C.panel} size={40}>以前</Note>
      </Pop>
      <Pop f={f} at={cf(1)} x={60} y={90} enter="up">
        <div style={{position: 'relative', opacity: 1 - 0.45 * prog(f, nowAt, 10)}}>
          <Win w={960} h={250} title="和 AI 聊天">
            <div style={{padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 16}}>
              <Bubble me text="帮我看看明天有什么安排" />
              {f >= sorryAt && <Bubble text="抱歉，我没办法访问你的日历。" color="#E6E1D6" />}
            </div>
          </Win>
          {f >= noAt && (
            <div style={{position: 'absolute', right: 30, top: 150, transform: `scale(${stampScale(f, noAt)}) rotate(-8deg)`}}>
              <Stamp text="做不到" size={56} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={nowAt} x={60} y={380} rot={-2}>
        <Note color={C.yellow} size={40}>现在</Note>
      </Pop>
      {NOW.map((x, k) => (
        <Pop key={x.t} f={f} at={x.at()} x={60 + k * 325} y={460} enter="up">
          <div style={{position: 'relative'}}>
            <Card w={290} h={230} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
              {TOOLS[x.i].icon(100)}
              <div style={txt(38)}>{x.t}</div>
            </Card>
            <div style={{position: 'absolute', right: -14, top: -20}}>
              <Check size={70} p={prog(f, x.at() + 6, 8)} />
            </div>
          </div>
        </Pop>
      ))}
      <FocusLines f={f} at={whyAt} out={whyAt + 30} x={420} y={830} />
      <Pop f={f} at={whyAt} x={60} y={760} rot={-3}>
        <div style={bigText(80, C.red)}>它怎么长出手脚的？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= nowAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const S1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['type', cf(1) + 4, 0.3],
  ['pop', cf(2), 0.3],
  ['stamp', cf(3) + 10, 0.45],
  ['whoosh', cf(4), 0.3],
  ...NOW.map((x) => ['ding', x.at() + 6, 0.3] as SfxCue),
  ['question', cf(7) + 4, 0.4],
];

/* ---------- S2 这叫 MCP，模型上下文协议 ---------- */
export const S2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(9, 'MCP');
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(8)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这背后有一样很关键的东西</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={180} />
      <Pop f={f} at={nameAt} x={40} y={50} rot={-3}>
        <div style={bigText(190, C.yellow)}>MCP</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={260} y={170} r={300} n={16} />
      <Pop f={f} at={cf(10)} x={30} y={260} rot={-2}>
        <div style={bigText(64, C.white)}>模型上下文协议</div>
      </Pop>
      <Pop f={f} at={cf(10) + 10} x={540} y={280} rot={3}>
        <div style={{...txt(34), background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 14px'}}>Model Context Protocol</div>
      </Pop>
    </HostTall>
  );
};
export const S2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.3],
  ['magic', cw(9, 'MCP'), 0.5],
  ['pop', cf(10), 0.3],
];

/* ---------- S3 Agent = 大模型 + 工具 + 循环；工具怎么接上去 ---------- */
const PARTS = [
  {t: '大模型', at: () => cw(12, '大模型'), c: C.white},
  {t: '工具', at: () => cw(12, '工具'), c: C.yellow},
  {t: '循环', at: () => cf(13), c: C.white},
];

export const S3Recap: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(14) + 4;
  return (
    <>
      <Pop f={f} at={cf(11)} x={60} y={30} rot={-2}>
        <Note color={C.panel} size={42}>我们之前讲过</Note>
      </Pop>
      <Pop f={f} at={cw(12, 'Agent')} x={60} y={130}>
        <div style={bigText(80, C.white)}>Agent =</div>
      </Pop>
      {PARTS.map((p, i) => (
        <Pop key={p.t} f={f} at={p.at()} x={60 + i * 330} y={250}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            {i > 0 && <div style={{...bigText(64, C.white), marginLeft: -40}}>+</div>}
            <div style={{...txt(52), background: p.c, border: `5px solid ${C.ink}`, borderRadius: 16, padding: '6px 26px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{p.t}</div>
          </div>
        </Pop>
      ))}
      <Char f={f} x={240} y={780} s={1.3} kind="bot" eyes={f >= askAt ? 'wide' : 'open'} lookX={0.5} opacity={prog(f, cf(11), 8)} />
      {TOOLS.map((_, i) => (
        <Pop key={i} f={f} at={askAt + i * 5} x={480 + (i % 2) * 150} y={420 + i * 110} rot={[-6, 5, -3][i]}>
          <div style={{transform: `translateY(${Math.sin(f * 0.08 + i * 2) * 8}px)`}}>
            <ToolCard i={i} w={250} h={96} icon={56} size={34} />
          </div>
        </Pop>
      ))}
      <Emote f={f} at={askAt + 6} kind="?" x={260} y={470} dur={50} />
      <FocusLines f={f} at={askAt} out={askAt + 30} x={420} y={900} />
      <Pop f={f} at={askAt} x={60} y={840} rot={-3}>
        <div style={bigText(80, C.red)}>工具怎么接上去？</div>
      </Pop>
      <PiP f={f} at={cf(11) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const S3Sfx: SfxCue[] = [
  ['pop', cf(11), 0.3],
  ['pop', cw(12, 'Agent'), 0.3],
  ...PARTS.map((p) => ['click', p.at(), 0.3] as SfxCue),
  ['question', cf(14) + 4, 0.4],
];

/* ---------- S4 MCP 之前：每个应用和每个工具都要单独对接，像一堆不同的充电线 ---------- */
const COLS = [60 + 140, 400 + 140, 740 + 140]; // 卡片中心 x
const WIRE_COLORS = [C.red, C.teal, C.orange];
const PLUGS: {k: PlugKind; c: string}[] = [
  {k: 'round', c: '#F2A0B4'},
  {k: 'flat', c: C.white},
  {k: 'wide', c: '#8E8FE8'},
  {k: 'round', c: C.yellow},
];

export const S4Tangle: React.FC<{f: number}> = ({f}) => {
  const wireAt = cw(17, '对接');
  const redoAt = cf(19);
  const plugAt = cf(20);
  const messAt = cw(21, '一堆');
  return (
    <>
      <Pop f={f} at={cf(15)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          <span style={{color: C.yellow}}>MCP</span> 出现之前
        </div>
      </Pop>
      {['A', 'B', 'C'].map((k, i) => (
        <Pop key={k} f={f} at={cf(16) + i * 4} x={60 + i * 340} y={150}>
          <AppCard k={k} />
        </Pop>
      ))}
      {TOOLS.map((_, i) => (
        <Pop key={i} f={f} at={cf(16) + 12 + i * 4} x={60 + i * 340} y={460}>
          <ToolCard i={i} bg={cw(18, '日历') <= f && i < 2 ? '#FFF3B8' : C.white} />
        </Pop>
      ))}
      <svg width={1080} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {COLS.map((ax, a) =>
          COLS.map((tx, t) => {
            const k = a * 3 + t;
            const at = a === 2 ? redoAt + t * 5 : wireAt + k * 3;
            const p = prog(f, at, 10);
            if (p <= 0) return null;
            const d = `M${ax} 250 C ${ax + (k % 2 ? 90 : -90)} 340, ${tx + (k % 3 ? -80 : 80)} 380, ${tx} 460`;
            return <path key={k} d={d} pathLength={1} fill="none" stroke={WIRE_COLORS[t]} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />;
          }),
        )}
      </svg>
      <Pop f={f} at={redoAt} x={640} y={290} rot={4}>
        <Note color={C.pink} size={34}>换一个应用，从头再接</Note>
      </Pop>
      <div style={{position: 'absolute', left: 60, top: 640, display: 'flex', gap: 24}}>
        {PLUGS.map((p, i) => (
          <div key={i} style={{opacity: prog(f, plugAt + i * 5, 5), transform: `translateY(${(1 - prog(f, plugAt + i * 5, 10, easeOut)) * -60}px) rotate(${[-10, 6, -4, 12][i]}deg)`}}>
            <PlugIcon kind={p.k} size={90} color={p.c} />
          </div>
        ))}
      </div>
      <Pop f={f} at={plugAt + 10} x={520} y={680} rot={3}>
        <Note color={C.panel} size={38}>每部手机一个充电口</Note>
      </Pop>
      <FocusLines f={f} at={messAt} out={messAt + 30} x={400} y={900} />
      <Pop f={f} at={messAt} x={60} y={850} rot={-3}>
        <div style={{...bigText(88, C.red), transform: `translateX(${jolt(f, messAt, 12, 14)}px)`}}>线缠成一团！</div>
      </Pop>
      <PiP f={f} at={cf(15) - 6} skin="chef" eyes={f >= messAt ? 'spiral' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const S4Sfx: SfxCue[] = [
  ['pop', cf(15), 0.35],
  ['pop', cf(16), 0.3],
  ['whoosh', cw(17, '对接'), 0.35],
  ['click', cw(18, '日历'), 0.3],
  ['whoosh', cf(19), 0.35],
  ...PLUGS.map((_, i) => ['click', cf(20) + i * 5, 0.25] as SfxCue),
  ['error', cw(21, '一堆'), 0.4],
  ['shake', cw(21, '一堆') + 2, 0.3],
];

/* ---------- S5 MCP：统一的插座，官方比作 USB-C ---------- */
const BAR = {y: 330, h: 120};

export const S5Socket: React.FC<{f: number}> = ({f}) => {
  const barAt = cw(23, '插座');
  const toolAt = cf(27);
  const appAt = cw(28, '所有');
  const usbAt = cf(29);
  return (
    <>
      <Pop f={f} at={cf(22)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          给 AI 一个<span style={{color: C.yellow}}>统一的插座</span>
        </div>
      </Pop>
      {['A', 'B', 'C'].map((k, i) => (
        <Pop key={k} f={f} at={cf(22) + 6 + i * 4} x={60 + i * 340} y={150}>
          <AppCard k={k} />
        </Pop>
      ))}
      <Pop f={f} at={barAt} x={60} y={BAR.y}>
        <Card w={960} h={BAR.h} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 40, padding: '0 40px'}}>
          <div style={bigText(80, C.white)}>MCP</div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{width: 90, height: 60, borderRadius: 14, background: '#FFF6D0', border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
              {[0, 1].map((j) => <div key={j} style={{width: 10, height: 26, borderRadius: 4, background: C.ink}} />)}
            </div>
          ))}
        </Card>
      </Pop>
      <Burst f={f} at={barAt + 4} x={540} y={BAR.y + 60} r={320} />
      <svg width={1080} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {COLS.map((x, i) => {
          const pt = prog(f, toolAt + i * 5, 10);
          const pa = prog(f, appAt + i * 5, 10);
          return (
            <g key={i}>
              {pt > 0 && <line x1={x} y1={BAR.y + BAR.h + 4} x2={x} y2={BAR.y + BAR.h + 4 + 76 * pt} stroke={C.teal} strokeWidth={10} strokeLinecap="round" />}
              {pa > 0 && <line x1={x} y1={250} x2={x} y2={250 + 76 * pa} stroke={C.teal} strokeWidth={10} strokeLinecap="round" />}
            </g>
          );
        })}
      </svg>
      {TOOLS.map((_, i) => (
        <Pop key={i} f={f} at={toolAt + i * 5} x={60 + i * 340} y={530} enter="up">
          <ToolCard i={i} />
        </Pop>
      ))}
      <Pop f={f} at={cw(27, '写一次')} x={60} y={680} rot={-2}>
        <Note color={C.tealLight} size={38}>工具只写一次，所有 AI 都能插</Note>
      </Pop>
      <Pop f={f} at={cf(24)} x={60} y={680} out={cw(27, '写一次') - 4} rot={-2}>
        <Note color={C.panel} size={36}>Anthropic · 2024 年底 · 公开标准</Note>
      </Pop>
      <Pop f={f} at={cf(26)} x={60} y={760} out={cw(27, '写一次') - 4} rot={2}>
        <Note color={C.panel} size={34}>很多 AI 公司和开发工具跟进支持</Note>
      </Pop>
      {f >= usbAt && (
        <div style={{position: 'absolute', left: 60, top: 770, opacity: prog(f, usbAt, 6)}}>
          <PlugIcon kind="usbc" size={80} color={C.white} />
        </div>
      )}
      <FocusLines f={f} at={cf(30)} out={cf(30) + 30} x={460} y={840} />
      <Pop f={f} at={usbAt + 4} x={170} y={790} rot={-3}>
        <div style={bigText(76, C.yellow)}>AI 的 USB-C 接口</div>
      </Pop>
      <PiP f={f} at={cf(22) - 6} skin="detective" eyes={f >= usbAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const S5Sfx: SfxCue[] = [
  ['pop', cf(22), 0.35],
  ['magic', cw(23, '插座'), 0.45],
  ['paper', cf(24), 0.3],
  ['pop', cf(26), 0.3],
  ...TOOLS.map((_, i) => ['click', cf(27) + i * 5, 0.3] as SfxCue),
  ...TOOLS.map((_, i) => ['click', cw(28, '所有') + i * 5, 0.3] as SfxCue),
  ['ding', cf(29), 0.4],
];
