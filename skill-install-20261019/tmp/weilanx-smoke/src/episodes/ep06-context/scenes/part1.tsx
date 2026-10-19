import React from 'react';
import {easeIn, easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {ChatIcon, Check, Cross, PlainFile} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {BookStack, Desk} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

const Bubble: React.FC<{text: string; me?: boolean; w?: number}> = ({text, me, w}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(30), width: w, background: me ? C.pink : C.white, border: `3px solid ${C.ink}`, borderRadius: 16, padding: '8px 16px', whiteSpace: 'normal', lineHeight: 1.35}}>{text}</div>
  </div>
);

/* ---------- S1 钩子：AI 聊着聊着就变笨，新开对话又变聪明 ---------- */
export const S1Hook: React.FC<{f: number}> = ({f}) => {
  const dumbAt = cw(2, '变笨');
  const replyAt = cf(3) + 10;
  const forgetAt = cw(4, '全忘');
  const btnAt = cf(5) - 4;
  const clickAt = cw(5, '新开');
  const newAt = clickAt + 6;
  const smartAt = cf(6);
  const cur = prog(f, btnAt, 12, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={0}>
        <div style={bigText(64, C.white)}>
          AI 聊着聊着就<span style={{color: C.red}}>变笨</span>了？
        </div>
      </Pop>
      <Pop f={f} at={cf(1)} x={60} y={110} enter="up">
        <div style={{transform: `translateX(${jolt(f, forgetAt, 12, 16)}px)`}}>
          <Win w={660} h={530} title="聊了一下午……">
            <div style={{position: 'relative', height: 470, padding: '18px 20px', boxSizing: 'border-box'}}>
              <div style={{position: 'relative'}}>
                <Bubble me text="要求：回答别超过 100 字" />
                {f >= forgetAt && <div style={{position: 'absolute', right: 20, top: '50%', height: 6, width: `${prog(f, forgetAt, 8) * 330}px`, background: C.red, borderRadius: 3}} />}
              </div>
              {Array.from({length: 5}, (_, i) => (
                <div key={i} style={{height: 22, width: 200 + rand(i + 3) * 300, marginTop: 20, marginLeft: i % 2 ? 'auto' : 0, borderRadius: 11, background: i % 2 ? C.pink : '#E4DED2', opacity: 0.8}} />
              ))}
              {f >= replyAt && (
                <div style={{marginTop: 22, opacity: prog(f, replyAt, 8)}}>
                  <Bubble w={500} text="好的！下面是一篇三千字的长文，我们先从历史讲起……" />
                </div>
              )}
            </div>
          </Win>
        </div>
      </Pop>
      <FocusLines f={f} at={forgetAt} out={forgetAt + 30} x={400} y={420} />
      <Pop f={f} at={forgetAt + 4} x={380} y={600} rot={-6}>
        <div style={bigText(96, C.red)}>全忘了！</div>
      </Pop>
      <Char f={f} x={880} y={790} s={0.85} kind="bot" eyes={f >= smartAt ? 'star' : f >= dumbAt ? 'spiral' : 'open'} lookX={0.3} armsUp={f >= smartAt ? 0.8 : 0} />
      <Emote f={f} at={dumbAt} kind="?" x={900} y={500} />
      <Pop f={f} at={btnAt} x={760} y={150}>
        <Card w={290} h={84} pad={0} bg={f >= clickAt && f < clickAt + 6 ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(40)}>＋ 新对话</div>
        </Card>
      </Pop>
      {f >= btnAt && f < newAt + 16 && (
        <div style={{position: 'absolute', left: lerp(1000, 900, cur), top: lerp(420, 200, cur)}}>
          <Cursor down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      <Pop f={f} at={newAt} x={1090} y={40} enter="right">
        <Win w={470} h={330} title="新对话">
          <div style={{padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18}}>
            <Bubble me text="要求：回答别超过 100 字" />
            {f >= smartAt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, smartAt, 8)}}>
                <Bubble w={330} text="好的，简短回答如下……" />
                <Check size={48} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={smartAt + 4} x={1100} y={400} rot={4}>
        <div style={bigText(64, C.yellow)}>又变聪明了？！</div>
      </Pop>
      <Burst f={f} at={smartAt + 6} x={1330} y={440} r={200} />
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= smartAt ? 'wide' : 'open'} />
    </>
  );
};
export const S1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.35],
  ['question', cw(2, '变笨'), 0.35],
  ['type', cf(3) + 10, 0.3],
  ['error', cw(4, '全忘'), 0.45],
  ['boing', cw(4, '全忘') + 4, 0.35],
  ['pop', cf(5) - 4, 0.3],
  ['click', cw(5, '新开'), 0.45],
  ['whoosh', cw(5, '新开') + 6, 0.3],
  ['magic', cf(6) + 4, 0.4],
];

/* ---------- S2 原因：上下文 context ---------- */
export const S2Reveal: React.FC<{f: number}> = ({f}) => {
  const wordAt = cw(9, '上下文');
  return (
    <Host f={f} wear={['headphones']} eyes={f >= wordAt ? 'star' : 'open'} armsUp={f >= wordAt && f < wordAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(7)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={38}>这背后的原因，藏在一个概念里</Note>
      </Pop>
      <FocusLines f={f} at={wordAt} out={wordAt + 36} x={260} y={220} />
      <Pop f={f} at={wordAt} x={0} y={80} rot={-3}>
        <div style={bigText(150, C.yellow)}>上下文</div>
      </Pop>
      <Pop f={f} at={cw(9, 'context')} x={40} y={260}>
        <div style={bigText(90, C.white)}>context</div>
      </Pop>
      <Burst f={f} at={wordAt + 4} x={250} y={170} r={240} n={14} />
      <Pop f={f} at={cf(11)} x={0} y={400} enter="left">
        <Note color={C.tealLight} size={40}>搞懂它，用 AI 效果好很多</Note>
      </Pop>
    </Host>
  );
};
export const S2Sfx: SfxCue[] = [
  ['pop', cf(7), 0.3],
  ['magic', cw(9, '上下文'), 0.45],
  ['pop', cw(9, 'context'), 0.3],
  ['ding', cf(11), 0.3],
];

/* ---------- S3 上下文 = 它能看到的全部内容（办公桌） ---------- */
const DX = 140;
const DW = 1000;
const DY = 440;
const ITEMS = [
  {label: '你发的消息', n: 17},
  {label: '它之前的回答', n: 18},
  {label: '你上传的文件', n: 19},
];

const Item: React.FC<{i: number; label: string; lit?: number}> = ({i, label, lit = 0}) => (
  <Card w={280} h={170} pad={0} bg={lit > 0.5 ? '#FFF3B8' : C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
    {i === 2 ? <PlainFile name="" size={70} /> : <div style={{opacity: i === 1 ? 0.8 : 1}}><ChatIcon size={90} /></div>}
    <div style={txt(34)}>{label}</div>
  </Card>
);

export const S3Desk: React.FC<{f: number}> = ({f}) => {
  const readAt = cf(20);
  const scan = prog(f, readAt, 40, easeInOut);
  const deskAt = cf(21);
  const blindAt = cf(23);
  return (
    <>
      <Pop f={f} at={cf(13)} x={80} y={30}>
        <div style={bigText(60, C.white)}>
          上下文 = 它回答时能<span style={{color: C.yellow}}>看到</span>的全部内容
        </div>
      </Pop>
      <div style={{position: 'absolute', left: DX, top: DY}}>
        <Desk w={DW} />
      </div>
      {ITEMS.map((it, i) => (
        <Pop key={it.label} f={f} at={cf(it.n)} x={DX + 40 + i * 320} y={DY - 180} enter="drop" dur={12}>
          <Item i={i} label={it.label} lit={f >= readAt && scan * 3 > i ? 1 : 0} />
        </Pop>
      ))}
      {f >= readAt && f < readAt + 50 && (
        <div style={{position: 'absolute', left: DX + 20 + scan * (DW - 60), top: DY - 200, width: 10, height: 210, background: C.orange, borderRadius: 5, boxShadow: '0 0 20px rgba(217,128,79,0.8)'}} />
      )}
      <Pop f={f} at={readAt} x={DX} y={140} rot={-2}>
        <Note color={C.yellow} size={36}>每次都从头到尾重新读一遍</Note>
      </Pop>
      <Pop f={f} at={deskAt} x={DX + DW / 2 - 170} y={DY + 90} still>
        <Note color={C.panel} size={34}>一张办公桌</Note>
      </Pop>
      <Pop f={f} at={cf(15)} out={readAt} x={1200} y={170} rot={3}>
        <Note color={C.pink} size={34}>它本身什么都不记得</Note>
      </Pop>
      <Pop f={f} at={cf(22)} x={1200} y={150} rot={3}>
        <div style={{position: 'relative', opacity: 0.55}}>
          <Card w={300} h={120} pad={0} bg="#E6E1D6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(32, C.inkSoft)}>没放上桌的东西</div>
          </Card>
          {f >= blindAt && (
            <div style={{position: 'absolute', left: 100, top: 10}}>
              <Cross size={100} p={prog(f, blindAt, 8)} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={blindAt + 4} x={1210} y={300} rot={-4}>
        <div style={bigText(56, C.red)}>看不到！</div>
      </Pop>
      <Char f={f} x={1390} y={740} s={0.8} kind="bot" eyes={f >= readAt && f < readAt + 50 ? 'wide' : f >= cf(15) && f < readAt ? 'flat' : 'open'} lookX={-0.6} />
      <Emote f={f} at={cf(15) + 4} kind="?" x={1400} y={520} />
      <PiP f={f} at={cf(12) - 6} skin="cowboy" />
    </>
  );
};
export const S3Sfx: SfxCue[] = [
  ['pop', cf(13), 0.35],
  ['question', cf(15) + 4, 0.3],
  ...ITEMS.map((it) => ['paper', cf(it.n), 0.35] as SfxCue),
  ['whoosh', cf(20), 0.35],
  ['pop', cf(21), 0.3],
  ['pop', cf(22), 0.25],
  ['error', cf(23), 0.35],
];

/* ---------- S4 上下文窗口：一百万 token，但桌子再大也有边 ---------- */
const SLOTS = 6;
const SLOT_W = 150;
const WX = 140;
const WY = 470;

export const S4Window: React.FC<{f: number}> = ({f}) => {
  const fullAt = cf(29);
  const squashAt = cf(30);
  const pushAt = cf(31);
  // 前 6 份文件陆续放上桌，满了以后第 0、1 份被压缩，再被挤下去，新的补进来
  const arrive = (k: number) => (k < SLOTS ? cf(28) - 30 + k * 7 : pushAt + 12 + (k - SLOTS) * 6);
  const files = Array.from({length: SLOTS + 2}, (_, k) => k);
  return (
    <>
      <Pop f={f} at={cf(24)} x={80} y={30}>
        <div style={bigText(60, C.white)}>
          桌子的大小 = <span style={{color: C.yellow}}>上下文窗口</span>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: WX - 30, top: WY}}>
        <Desk w={SLOTS * SLOT_W + 60} hot={f >= fullAt ? 1 : 0} />
      </div>
      <Pop f={f} at={cf(24) + 8} x={WX - 30} y={WY + 330} still>
        <div style={{width: SLOTS * SLOT_W + 60, display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={bigText(40, C.teal)}>◀</div>
          <div style={{flex: 1, borderTop: `5px dashed ${C.teal}`}} />
          <div style={txt(34, C.teal)}>窗口有多大</div>
          <div style={{flex: 1, borderTop: `5px dashed ${C.teal}`}} />
          <div style={bigText(40, C.teal)}>▶</div>
        </div>
      </Pop>
      <Pop f={f} at={cw(26, '一百万')} x={1120} y={130}>
        <div style={bigText(96, C.yellow)}>一百万 token</div>
      </Pop>
      <Pop f={f} at={cf(27)} x={1180} y={260} enter="up">
        <BookStack n={5} w={260} />
      </Pop>
      <Pop f={f} at={cf(27) + 6} x={1170} y={500} rot={-3}>
        <Note color={C.tealLight} size={36}>≈ 好几本书</Note>
      </Pop>
      {files.map((k) => {
        const at = arrive(k);
        if (f < at) return null;
        const p = prog(f, at, 10, easeOut);
        const slot = k < SLOTS ? k : k - SLOTS;
        const old = k < 2;
        const sq = old ? prog(f, squashAt + k * 4, 10, easeInOut) : 0;
        const drop = old ? prog(f, pushAt + k * 4, 18, easeIn) : 0;
        return (
          <div key={k} style={{position: 'absolute', left: WX + slot * SLOT_W - drop * 260, top: WY - 150 - (1 - p) * 200 + drop * 420, opacity: Math.min(p, 1 - prog(f, pushAt + 14 + k * 4, 8)), transform: `scaleX(${1 - 0.45 * sq}) rotate(${-drop * 40}deg)`, transformOrigin: 'bottom left', filter: sq > 0.5 ? 'grayscale(1)' : 'none'}}>
            <PlainFile name="" size={100} color={k >= SLOTS ? C.tealLight : '#FCE3A8'} />
          </div>
        );
      })}
      <Pop f={f} at={fullAt} x={WX + 360} y={WY - 250} rot={-4}>
        <div style={{...bigText(72, C.red), transform: `translateX(${jolt(f, fullAt, 10, 16)}px)`}}>放满了！</div>
      </Pop>
      <Pop f={f} at={squashAt} x={WX - 40} y={WY - 330}>
        <Note color={C.pink} size={32}>前面的被压缩</Note>
      </Pop>
      <Pop f={f} at={pushAt} x={WX + 230} y={WY - 330}>
        <Note color={C.pink} size={32}>或者直接挪出去</Note>
      </Pop>
      <PiP f={f} at={cf(24) - 6} skin="detective" eyes={f >= pushAt ? 'wide' : 'open'} />
    </>
  );
};
export const S4Sfx: SfxCue[] = [
  ['pop', cf(24), 0.35],
  ...Array.from({length: SLOTS}, (_, k) => ['paper', cf(28) - 30 + k * 7, 0.2] as SfxCue),
  ['ding', cw(26, '一百万'), 0.4],
  ['pop', cf(27), 0.3],
  ['error', cf(29), 0.4],
  ['shake', cf(30), 0.3],
  ['whoosh', cf(31), 0.35],
];

/* ---------- S5 塞得越多 ≠ 看得越清楚：信息埋在中间更容易被忽略 ---------- */
const DOCS = 9;
const MID = 4;

export const S5Middle: React.FC<{f: number}> = ({f}) => {
  const rowAt = cf(35);
  const lookAt = cf(35) + 20;
  const missAt = cf(36);
  const pileN = Math.min(7, 1 + Math.floor(prog(f, cf(32), 30) * 6));
  return (
    <>
      <Pop f={f} at={cf(32)} x={80} y={30}>
        <div style={bigText(60, C.white)}>
          塞得越多 <span style={{color: C.red}}>≠</span> 看得越清楚
        </div>
      </Pop>
      <Pop f={f} at={cf(32)} out={rowAt - 8} x={1160} y={150}>
        <BookStack n={pileN} w={260} />
      </Pop>
      <Pop f={f} at={cf(34)} x={80} y={150} rot={-2}>
        <Note color={C.yellow} size={36}>有研究发现</Note>
      </Pop>
      {Array.from({length: DOCS}, (_, i) => {
        const at = rowAt + i * 2;
        if (f < at) return null;
        const key = i === MID;
        const edge = Math.min(i, DOCS - 1 - i);
        const dim = f >= lookAt ? (edge <= 1 ? 1 : 0.35 + 0.1 * (2 - Math.min(2, edge - 1))) : 1;
        return (
          <div key={i} style={{position: 'absolute', left: 80 + i * 150, top: 250 + (key ? jolt(f, missAt, 8, 16) : 0), opacity: prog(f, at, 6) * (key && f >= lookAt ? Math.max(0.45, dim) : dim), transform: `scale(${prog(f, at, 8, easeOut)})`}}>
            <Card w={130} h={170} pad={12} bg={key ? C.yellow : C.white}>
              {key ? <div style={{...txt(30), textAlign: 'center', marginTop: 40}}>关键<br />信息</div> : [0, 1, 2, 3].map((l) => <div key={l} style={{height: 12, width: `${60 + ((i * 17 + l * 13) % 40)}%`, background: '#E4DED2', borderRadius: 6, marginTop: 16}} />)}
            </Card>
          </div>
        );
      })}
      <Pop f={f} at={lookAt} x={80} y={440} still>
        <div style={{display: 'flex', width: 1350, justifyContent: 'space-between', ...txt(32, C.teal)}}>
          <span>▲ 开头看得清</span>
          <span style={{color: C.red}}>中间容易漏</span>
          <span>结尾看得清 ▲</span>
        </div>
      </Pop>
      <Emote f={f} at={missAt} kind="?" x={80 + MID * 150 + 65} y={220} />
      <Pop f={f} at={missAt + 6} x={80} y={510} enter="left">
        <Note color={C.pink} size={38}>重要信息埋在中间，反而更容易被忽略</Note>
      </Pop>
      <Pop f={f} at={missAt + 20} x={80} y={600}>
        <Note color={C.panel} size={26}>研究：《Lost in the Middle》</Note>
      </Pop>
      <Pop f={f} at={cw(37, '变笨')} x={880} y={590} rot={-4}>
        <div style={bigText(60, C.red)}>聊久了变笨的一个原因</div>
      </Pop>
      <PiP f={f} at={cf(32) - 6} skin="chef" />
    </>
  );
};
export const S5Sfx: SfxCue[] = [
  ['pop', cf(32), 0.35],
  ['paper', cf(32) + 6, 0.25],
  ['pop', cf(34), 0.3],
  ...Array.from({length: DOCS}, (_, i) => ['click', cf(35) + i * 2, 0.12] as SfxCue),
  ['whoosh', cf(35) + 20, 0.3],
  ['question', cf(36), 0.35],
  ['stamp', cw(37, '变笨'), 0.4],
];
