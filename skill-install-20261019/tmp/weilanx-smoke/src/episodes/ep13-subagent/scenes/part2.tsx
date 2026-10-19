import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, PlainFile, Stamp, stampScale} from '../../../library/icons';
import {Block, Magnifier} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bar, Tag} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- A6 代价：帮手多了更费 token，约是普通聊天的十五倍 ---------- */
export const A6Cost: React.FC<{f: number}> = ({f}) => {
  const chatAt = cf(36);
  const grow = prog(f, cf(37), 30, easeOut);
  const bigAt = cf(38);
  return (
    <>
      <Pop f={f} at={cf(34)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          帮手多了，<span style={{color: C.red}}>花钱也多</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(35)} x={60} y={140} rot={-2}>
        <Note color={C.panel} size={36}>Anthropic 公开分享过</Note>
      </Pop>
      <Pop f={f} at={chatAt} x={60} y={240} enter="left">
        <Card w={960} h={360} bg={C.white}>
          <div style={txt(34, C.inkSoft)}>消耗的 token</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 24}}>
            <div style={{...txt(38), width: 260}}>普通聊天</div>
            <div style={{width: 40, height: 60, background: C.tealLight, border: `4px solid ${C.ink}`, borderRadius: 10}} />
            <div style={txt(34, C.inkSoft)}>1 份</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30}}>
            <div style={{...txt(38), width: 260}}>多 Agent 调研</div>
            <div style={{width: lerp(40, 600, grow), height: 60, background: '#FFD9D6', border: `4px solid ${C.red}`, borderRadius: 10, display: 'flex', overflow: 'hidden'}}>
              {Array.from({length: 15}, (_, k) => (
                <div key={k} style={{flex: 1, borderRight: k < 14 ? `2px solid rgba(229,72,77,0.35)` : 'none'}} />
              ))}
            </div>
          </div>
          <div style={{...txt(26, C.inkSoft), marginTop: 30}}>出处：Anthropic 工程博客，介绍他们的多 Agent 调研系统</div>
        </Card>
      </Pop>
      <FocusLines f={f} at={bigAt} out={bigAt + 30} x={420} y={760} />
      <Pop f={f} at={bigAt} x={60} y={660} rot={-4}>
        <div style={{...bigText(120, C.red), transform: `translateX(${jolt(f, bigAt, 12, 14)}px)`}}>约 15 倍</div>
      </Pop>
      <PiP f={f} at={cf(34) - 6} skin="santa" eyes={f >= bigAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const A6Sfx: SfxCue[] = [
  ['pop', cf(34), 0.35],
  ['pop', cf(35), 0.3],
  ['paper', cf(36), 0.3],
  ['whoosh', cf(37), 0.35],
  ['error', cf(38), 0.4],
  ['shake', cf(38) + 2, 0.3],
];

/* ---------- A7 过渡：三个建议 ---------- */
const TIPS = ['能拆开的活才派', '派活时交代清楚', '小活就别叫帮手'];

export const A7Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(40);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
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
export const A7Sfx: SfxCue[] = [
  ['question', cf(39), 0.35],
  ...TIPS.map((_, i) => ['click', cf(40) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- A8 建议一：只把能拆开的活交给帮手 ---------- */
const PARAS = ['开头', '中间', '结尾'];

export const A8Split: React.FC<{f: number}> = ({f}) => {
  const goodAt = cf(42);
  const badAt = cf(44);
  const oneAt = cf(45);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          只派<span style={{color: C.yellow}}>能拆开</span>的活
        </div>
      </Pop>
      <Pop f={f} at={goodAt} x={60} y={140} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={960} h={290} bg={C.tealLight}>
            <div style={txt(40)}>互不影响的活</div>
            <div style={{display: 'flex', gap: 40, marginTop: 20}}>
              {['资料 1', '资料 2', '资料 3'].map((t, i) => (
                <div key={t} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: prog(f, goodAt + 6 + i * 5, 6)}}>
                  <PlainFile name={t} size={90} />
                  <Tag t={`帮手 ${i + 1}`} size={24} />
                </div>
              ))}
              <div style={{...txt(36, C.teal), alignSelf: 'center', opacity: prog(f, cf(43), 6)}}>同时查，最合适</div>
            </div>
          </Card>
          <div style={{position: 'absolute', right: 24, top: -24}}>
            <Check size={80} p={prog(f, cf(43), 8)} />
          </div>
        </div>
      </Pop>
      <Pop f={f} at={badAt} x={60} y={470} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={960} h={290} bg="#E6E1D6">
            <div style={txt(40)}>一篇前后要连贯的文章</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 30}}>
              {PARAS.map((p, i) => (
                <React.Fragment key={p}>
                  {i > 0 && <div style={{width: 60, height: 6, background: C.ink, borderRadius: 3}} />}
                  <Block text={p} size={80} color={C.white} />
                </React.Fragment>
              ))}
              {f >= badAt + 12 && <div style={{marginLeft: 20}}><Cross size={70} p={prog(f, badAt + 12, 8)} /></div>}
            </div>
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={oneAt} x={60} y={790} rot={-3}>
        <div style={bigText(64, C.yellow)}>一个 AI 从头写到尾</div>
      </Pop>
      {f >= oneAt + 8 && <div style={{position: 'absolute', left: 680, top: 790}}><Check size={70} p={prog(f, oneAt + 8, 8)} /></div>}
      <PiP f={f} at={cf(41) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const A8Sfx: SfxCue[] = [
  ['pop', cf(41), 0.35],
  ['paper', cf(42), 0.3],
  ['ding', cf(43), 0.35],
  ['paper', cf(44), 0.3],
  ['error', cf(44) + 12, 0.3],
  ['ding', cf(45) + 8, 0.35],
];

/* ---------- A9 建议二：派活时交代清楚，帮手看不到前面的对话 ---------- */
const FIELDS = [
  {k: '要查什么', v: 'A 公司近三年的营收', at: () => cw(48, '查什么')},
  {k: '查到什么程度', v: '只看公开财报', at: () => cw(48, '程度')},
  {k: '交回什么格式', v: '一张表，三行', at: () => cf(49)},
];

export const A9Brief: React.FC<{f: number}> = ({f}) => {
  const blindAt = cf(47);
  const writeAt = cf(50);
  return (
    <>
      <Pop f={f} at={cf(46)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          派活时<span style={{color: C.yellow}}>交代清楚</span>
        </div>
      </Pop>
      <Pop f={f} at={blindAt} x={60} y={140} enter="up">
        <Card w={600} h={200} bg="#E6E1D6">
          <div style={txt(30, C.inkSoft)}>你和总管前面聊过的</div>
          <div style={{filter: 'blur(2px)', marginTop: 10}}>
            {[80, 64, 72].map((w, i) => <div key={i} style={{height: 18, width: `${w}%`, background: '#9A9186', borderRadius: 9, marginTop: 14}} />)}
          </div>
        </Card>
      </Pop>
      {f >= blindAt + 6 && (
        <svg width={40} height={240} style={{position: 'absolute', left: 680, top: 130, opacity: prog(f, blindAt + 6, 6)}}>
          <line x1={20} y1={0} x2={20} y2={240} stroke={C.red} strokeWidth={8} strokeDasharray="16 10" />
        </svg>
      )}
      <Char f={f} x={830} y={350} s={0.8} kind="bot" eyes={f >= FIELDS[0].at() ? 'open' : 'flat'} lookX={-0.6} opacity={prog(f, blindAt, 8)} />
      <Emote f={f} at={blindAt + 8} kind="?" x={840} y={150} dur={50} />
      <Pop f={f} at={blindAt + 10} x={740} y={380} rot={3}>
        <Note color={C.pink} size={28}>帮手看不到</Note>
      </Pop>
      <Pop f={f} at={FIELDS[0].at() - 8} x={60} y={470} enter="up">
        <Card w={740} h={300} bg="#FFFDF7">
          <div style={txt(38, C.orangeDark)}>派活单</div>
          {FIELDS.map((x) => (
            <div key={x.k} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, opacity: prog(f, x.at(), 6)}}>
              <div style={{...txt(34, C.inkSoft), width: 230}}>{x.k}</div>
              <div style={txt(36)}>
                <Marker p={prog(f, x.at() + 2, 10)} color={C.yellow}>{x.v}</Marker>
              </div>
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={FIELDS[0].at()} x={560} y={480}>
        <Note color={C.panel} size={24}>示例</Note>
      </Pop>
      {f >= writeAt && (
        <div style={{position: 'absolute', left: 140, top: 800, transform: `scale(${stampScale(f, writeAt)}) rotate(-6deg)`}}>
          <Stamp text="都写明白" size={60} color={C.teal} />
        </div>
      )}
      <PiP f={f} at={cf(46) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const A9Sfx: SfxCue[] = [
  ['pop', cf(46), 0.35],
  ['paper', cf(47), 0.3],
  ['question', cf(47) + 8, 0.3],
  ...FIELDS.map((x) => ['type', x.at(), 0.3] as SfxCue),
  ['stamp', cf(50), 0.45],
];

/* ---------- A10 建议三：小活别叫帮手；结果关键处自己看 ---------- */
export const A10Small: React.FC<{f: number}> = ({f}) => {
  const laneAt = cf(52);
  const self = prog(f, laneAt + 6, 12);
  const team = prog(f, laneAt + 6, 60);
  const slowAt = cw(53, '更慢');
  const checkAt = cf(54);
  const scan = prog(f, checkAt + 6, 30, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(51)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          小活就<span style={{color: C.red}}>别叫帮手</span>
        </div>
      </Pop>
      <Pop f={f} at={laneAt} x={60} y={140} enter="left">
        <Card w={960} h={260} bg={C.white}>
          <div style={txt(36, C.inkSoft)}>改一个错别字（一两步的事）</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
            <div style={{...txt(34), width: 240}}>自己改</div>
            <Bar w={560} p={self} color={C.teal} />
            {self >= 1 && <Check size={44} />}
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
            <div style={{...txt(34), width: 240}}>拆给 3 个帮手</div>
            <Bar w={560} p={team} color={C.orange} />
          </div>
          <div style={{...txt(24, C.inkSoft), marginTop: 10}}>示意</div>
        </Card>
      </Pop>
      <FocusLines f={f} at={slowAt} out={slowAt + 26} x={420} y={480} />
      <Pop f={f} at={slowAt} x={60} y={430} rot={-3}>
        <div style={{...bigText(64, C.red), transform: `translateX(${jolt(f, slowAt, 10, 12)}px)`}}>反而更慢、更费 token</div>
      </Pop>
      <Pop f={f} at={checkAt} x={60} y={570} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={740} h={220} bg="#FFFDF7">
            <div style={txt(34, C.inkSoft)}>帮手交回来的结果</div>
            {[88, 70, 80].map((w, i) => <div key={i} style={{height: 16, width: `${w}%`, background: '#E4DED2', borderRadius: 8, marginTop: 20}} />)}
          </Card>
          {f >= checkAt + 6 && f < checkAt + 40 && (
            <div style={{position: 'absolute', left: lerp(40, 520, scan), top: 40}}>
              <Magnifier size={140} />
            </div>
          )}
          {f >= checkAt + 40 && <div style={{position: 'absolute', right: 20, top: -26}}><Check size={80} p={prog(f, checkAt + 40, 8)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={cf(55)} x={60} y={830} rot={-2}>
        <Note color={C.yellow} size={38}>关键的地方自己再看一遍</Note>
      </Pop>
      <Burst f={f} at={checkAt + 42} x={760} y={590} r={160} />
      <PiP f={f} at={cf(51) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const A10Sfx: SfxCue[] = [
  ['pop', cf(51), 0.35],
  ['paper', cf(52), 0.3],
  ['ding', cf(52) + 18, 0.3],
  ['error', cw(53, '更慢'), 0.4],
  ['paper', cf(54), 0.3],
  ['whoosh', cf(54) + 6, 0.3],
  ['ding', cf(54) + 40, 0.4],
  ['pop', cf(55), 0.3],
];

/* ---------- A11 结尾 ---------- */
export const A11Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(57);
  return (
    <>
      <HostTall f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(56)} x={0} y={20}>
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
export const A11Sfx: SfxCue[] = [
  ['pop', cf(56), 0.4],
  ['confetti', cf(57), 0.5],
  ['ding', cf(57) + 2, 0.3],
];
