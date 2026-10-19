import React from 'react';
import {easeIn, easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {ChatIcon, Check, Cross, PlainFile} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {BookStack, Desk} from '../../../library/items/objects';
import {HostTall, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080（画面 y=120 起）；右下角 x≥820、y≥860 留给主持人

export const PIP = {x: 950, y: 1050, s: 0.7};

const Bubble: React.FC<{text: string; me?: boolean; size?: number}> = ({text, me, size = 38}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(size), background: me ? C.pink : C.white, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '10px 20px', whiteSpace: 'normal', maxWidth: 700, lineHeight: 1.35}}>{text}</div>
  </div>
);

/* ---------- T1 钩子：聊着聊着就变笨，新开对话又变聪明 ---------- */
export const T1Hook: React.FC<{f: number}> = ({f}) => {
  const dumbAt = cw(2, '变笨');
  const replyAt = cf(3) + 10;
  const forgetAt = cw(4, '全忘');
  const btnAt = cf(5) - 4;
  const clickAt = cw(5, '新开');
  const swapAt = clickAt + 6;
  const smartAt = cf(6);
  const swap = prog(f, swapAt, 14, easeInOut);
  const cur = prog(f, btnAt, 12, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={10}>
        <div style={bigText(88, C.white)}>AI 聊着聊着</div>
      </Pop>
      <Pop f={f} at={dumbAt} x={60} y={120} rot={-2}>
        <div style={bigText(110, C.red)}>就变笨了？</div>
      </Pop>
      {/* 旧对话：点新对话后滑出去 */}
      <Pop f={f} at={cf(1)} x={60} y={290} enter="up">
        <div style={{transform: `translateX(${jolt(f, forgetAt, 14, 16) - swap * 1100}px) rotate(${-swap * 8}deg)`}}>
          <Win w={960} h={500} title="聊了一下午……">
            <div style={{padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 20}}>
              <div style={{position: 'relative'}}>
                <Bubble me text="要求：回答别超过 100 字" />
                {f >= forgetAt && <div style={{position: 'absolute', right: 10, top: '50%', height: 7, width: `${prog(f, forgetAt, 8) * 440}px`, background: C.red, borderRadius: 4}} />}
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{height: 24, width: `${45 + rand(i + 3) * 40}%`, marginLeft: i % 2 ? 'auto' : 0, borderRadius: 12, background: i % 2 ? C.pink : '#E4DED2'}} />
              ))}
              {f >= replyAt && (
                <div style={{opacity: prog(f, replyAt, 8)}}>
                  <Bubble text="好的！下面是一篇三千字的长文，我们先从历史讲起……" />
                </div>
              )}
            </div>
          </Win>
        </div>
      </Pop>
      <FocusLines f={f} at={forgetAt} out={forgetAt + 30} x={540} y={560} />
      <Pop f={f} at={forgetAt + 4} out={swapAt} x={180} y={640} rot={-8}>
        <div style={bigText(140, C.red)}>全忘了！</div>
      </Pop>
      {/* 新对话：从右边滑进来 */}
      {f >= swapAt && (
        <div style={{position: 'absolute', left: 60, top: 290, transform: `translateX(${(1 - swap) * 1100}px)`}}>
          <Win w={960} h={420} title="新对话">
            <div style={{padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 22}}>
              <Bubble me text="要求：回答别超过 100 字" />
              {f >= smartAt && (
                <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: prog(f, smartAt, 8)}}>
                  <Bubble text="好的，简短回答如下……" />
                  <Check size={64} />
                </div>
              )}
            </div>
          </Win>
        </div>
      )}
      <Pop f={f} at={btnAt} out={swapAt + 10} x={340} y={820}>
        <Card w={400} h={110} pad={0} bg={f >= clickAt && f < clickAt + 6 ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(54)}>＋ 新对话</div>
        </Card>
      </Pop>
      {f >= btnAt && f < swapAt + 10 && (
        <div style={{position: 'absolute', left: lerp(820, 620, cur), top: lerp(1000, 860, cur), transform: 'scale(1.5)'}}>
          <Cursor down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      <Pop f={f} at={smartAt + 4} x={120} y={760} rot={4}>
        <div style={bigText(100, C.yellow)}>又变聪明了？！</div>
      </Pop>
      <Burst f={f} at={smartAt + 6} x={540} y={820} r={300} n={16} />
      {f >= smartAt + 6 && <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1080, pointerEvents: 'none', opacity: 1 - prog(f, smartAt + 40, 12)}}><Confetti t={f - smartAt - 6} w={1080} h={1080} n={60} /></div>}
      <Char f={f} x={200} y={1060} s={0.75} kind="bot" eyes={f >= smartAt ? 'star' : f >= dumbAt ? 'spiral' : 'open'} lookX={0.4} armsUp={f >= smartAt ? 0.8 : 0} />
      <Emote f={f} at={dumbAt} kind="?" x={220} y={860} />
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= smartAt ? 'wide' : 'open'} {...PIP} />
    </>
  );
};
export const T1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.35],
  ['boing', cw(2, '变笨'), 0.4],
  ['type', cf(3) + 10, 0.3],
  ['error', cw(4, '全忘'), 0.5],
  ['shake', cw(4, '全忘') + 2, 0.35],
  ['pop', cf(5) - 4, 0.3],
  ['click', cw(5, '新开'), 0.5],
  ['whoosh', cw(5, '新开') + 6, 0.4],
  ['magic', cf(6) + 4, 0.45],
  ['confetti', cf(6) + 6, 0.35],
];

/* ---------- T2 原因：上下文 context ---------- */
export const T2Reveal: React.FC<{f: number}> = ({f}) => {
  const wordAt = cw(9, '上下文');
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= wordAt ? 'star' : 'open'} armsUp={f >= wordAt && f < wordAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(7)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这背后的原因，藏在一个概念里</Note>
      </Pop>
      <FocusLines f={f} at={wordAt} out={wordAt + 40} x={480} y={200} />
      <Pop f={f} at={wordAt} x={0} y={80} rot={-3}>
        <div style={bigText(180, C.yellow)}>上下文</div>
      </Pop>
      <Pop f={f} at={cw(9, 'context')} x={560} y={130} rot={4}>
        <div style={bigText(100, C.white)}>context</div>
      </Pop>
      <Burst f={f} at={wordAt + 4} x={280} y={180} r={300} n={16} />
      <Pop f={f} at={cf(11)} x={0} y={290} enter="left">
        <Note color={C.tealLight} size={44}>搞懂它，用 AI 效果好很多</Note>
      </Pop>
    </HostTall>
  );
};
export const T2Sfx: SfxCue[] = [
  ['pop', cf(7), 0.3],
  ['magic', cw(9, '上下文'), 0.5],
  ['pop', cw(9, 'context'), 0.35],
  ['ding', cf(11), 0.3],
];

/* ---------- T3 上下文 = 它能看到的全部内容（办公桌） ---------- */
const ITEMS = [
  {label: '你的消息', n: 17},
  {label: '它的回答', n: 18},
  {label: '上传的文件', n: 19},
];
const DX = 70;
const DW = 940;
const DY = 640;

export const T3Desk: React.FC<{f: number}> = ({f}) => {
  const readAt = cf(20);
  const scan = prog(f, readAt, 40, easeInOut);
  const blindAt = cf(23);
  return (
    <>
      <Pop f={f} at={cf(12)} x={60} y={30}>
        <div style={bigText(80, C.yellow)}>上下文 =</div>
      </Pop>
      <Pop f={f} at={cf(13)} x={60} y={130}>
        <div style={bigText(66, C.white)}>它回答时能看到的全部内容</div>
      </Pop>
      <Pop f={f} at={cf(15)} out={readAt} x={60} y={240} rot={-2}>
        <Note color={C.pink} size={40}>它本身什么都不记得</Note>
      </Pop>
      <Pop f={f} at={readAt} x={60} y={240} rot={-2}>
        <Note color={C.yellow} size={40}>每次都从头到尾重新读一遍</Note>
      </Pop>
      <div style={{position: 'absolute', left: DX, top: DY}}>
        <Desk w={DW} />
      </div>
      {ITEMS.map((it, i) => {
        const lit = f >= readAt && scan * 3 > i;
        return (
          <Pop key={it.label} f={f} at={cf(it.n)} x={DX + 20 + i * 305} y={DY - 250} enter="drop" dur={12}>
            <div style={{transform: `scale(${lit && scan * 3 < i + 1 ? 1.08 : 1})`}}>
              <Card w={290} h={240} pad={0} bg={lit ? '#FFF3B8' : C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                {i === 2 ? <PlainFile name="" size={100} /> : <ChatIcon size={120} />}
                <div style={txt(40)}>{it.label}</div>
              </Card>
            </div>
          </Pop>
        );
      })}
      {f >= readAt && f < readAt + 46 && (
        <div style={{position: 'absolute', left: DX + 10 + scan * (DW - 40), top: DY - 280, width: 14, height: 300, background: C.orange, borderRadius: 7, boxShadow: '0 0 30px rgba(217,128,79,0.9)'}} />
      )}
      <Pop f={f} at={cf(21)} x={DX + DW / 2 - 150} y={DY + 90} still>
        <Note color={C.panel} size={40}>一张办公桌</Note>
      </Pop>
      <Char f={f} x={180} y={1070} s={0.6} kind="bot" eyes={f >= readAt && f < readAt + 46 ? 'wide' : f >= cf(15) && f < readAt ? 'flat' : 'open'} lookX={0.5} />
      <Emote f={f} at={cf(15) + 4} kind="?" x={200} y={900} />
      <Pop f={f} at={cf(22)} x={330} y={930} rot={3}>
        <div style={{position: 'relative', opacity: 0.6}}>
          <Card w={360} h={110} pad={0} bg="#E6E1D6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(38, C.inkSoft)}>没放上桌的东西</div>
          </Card>
          {f >= blindAt && <div style={{position: 'absolute', left: 120, top: 0}}><Cross size={110} p={prog(f, blindAt, 8)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={blindAt + 4} x={560} y={830} rot={-6}>
        <div style={bigText(80, C.red)}>看不到！</div>
      </Pop>
      <PiP f={f} at={cf(12) - 6} skin="cowboy" {...PIP} />
    </>
  );
};
export const T3Sfx: SfxCue[] = [
  ['pop', cf(12), 0.35],
  ['pop', cf(13), 0.3],
  ['question', cf(15) + 4, 0.3],
  ...ITEMS.map((it) => ['paper', cf(it.n), 0.4] as SfxCue),
  ['whoosh', cf(20), 0.4],
  ['pop', cf(21), 0.3],
  ['pop', cf(22), 0.25],
  ['error', cf(23), 0.4],
];

/* ---------- T4 上下文窗口：一百万 token，但桌子再大也有边 ---------- */
const SLOTS = 6;
const SLOT_W = 150;
const WX = 90;
const WY = 720;

export const T4Window: React.FC<{f: number}> = ({f}) => {
  const fullAt = cf(29);
  const squashAt = cf(30);
  const pushAt = cf(31);
  const arrive = (k: number) => (k < SLOTS ? cf(28) - 30 + k * 7 : pushAt + 12 + (k - SLOTS) * 6);
  return (
    <>
      <Pop f={f} at={cf(24)} x={60} y={30}>
        <div style={bigText(64, C.white)}>
          桌子的大小 = <span style={{color: C.yellow}}>上下文窗口</span>
        </div>
      </Pop>
      <Pop f={f} at={cw(26, '一百万')} x={60} y={150} rot={-3}>
        <div style={bigText(120, C.yellow)}>一百万 token</div>
      </Pop>
      <Burst f={f} at={cw(26, '一百万') + 4} x={420} y={220} r={260} n={14} />
      <Pop f={f} at={cf(27)} x={620} y={300} enter="up" out={cf(28) - 10}>
        <BookStack n={5} w={300} />
      </Pop>
      <Pop f={f} at={cf(27) + 6} x={120} y={330} rot={-3} out={cf(28) - 10}>
        <Note color={C.tealLight} size={46}>≈ 好几本书</Note>
      </Pop>
      <div style={{position: 'absolute', left: WX - 30, top: WY}}>
        <Desk w={SLOTS * SLOT_W + 60} hot={f >= fullAt ? 1 : 0} />
      </div>
      <Pop f={f} at={cf(28) - 30} x={WX - 30} y={WY - 190} still>
        <div style={{width: SLOTS * SLOT_W + 60, display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={bigText(40, C.teal)}>◀</div>
          <div style={{flex: 1, borderTop: `6px dashed ${C.teal}`}} />
          <div style={txt(38, C.teal)}>窗口有多大</div>
          <div style={{flex: 1, borderTop: `6px dashed ${C.teal}`}} />
          <div style={bigText(40, C.teal)}>▶</div>
        </div>
      </Pop>
      {Array.from({length: SLOTS + 2}, (_, k) => {
        const at = arrive(k);
        if (f < at) return null;
        const p = prog(f, at, 10, easeOut);
        const slot = k < SLOTS ? k : k - SLOTS;
        const old = k < 2;
        const sq = old ? prog(f, squashAt + k * 4, 10, easeInOut) : 0;
        const drop = old ? prog(f, pushAt + k * 4, 18, easeIn) : 0;
        return (
          <div key={k} style={{position: 'absolute', left: WX + slot * SLOT_W - drop * 200, top: WY - 145 - (1 - p) * 300 + drop * 420, opacity: Math.min(p, 1 - prog(f, pushAt + 14 + k * 4, 8)), transform: `scaleX(${1 - 0.45 * sq}) rotate(${-drop * 40}deg)`, transformOrigin: 'bottom left', filter: sq > 0.5 ? 'grayscale(1)' : 'none'}}>
            <PlainFile name="" size={100} color={k >= SLOTS ? C.tealLight : '#FCE3A8'} />
          </div>
        );
      })}
      <FocusLines f={f} at={fullAt} out={fullAt + 24} x={540} y={640} />
      <Pop f={f} at={fullAt} x={200} y={330} rot={-5}>
        <div style={{...bigText(120, C.red), transform: `translateX(${jolt(f, fullAt, 12, 16)}px)`}}>放满了！</div>
      </Pop>
      <Pop f={f} at={squashAt} x={100} y={880}>
        <Note color={C.pink} size={40}>前面的被压缩</Note>
      </Pop>
      <Pop f={f} at={pushAt} x={400} y={960}>
        <Note color={C.pink} size={40}>或者直接挪出去</Note>
      </Pop>
      <PiP f={f} at={cf(24) - 6} skin="detective" eyes={f >= pushAt ? 'wide' : 'open'} {...PIP} />
    </>
  );
};
export const T4Sfx: SfxCue[] = [
  ['pop', cf(24), 0.35],
  ['ding', cw(26, '一百万'), 0.45],
  ['pop', cf(27), 0.3],
  ...Array.from({length: SLOTS}, (_, k) => ['paper', cf(28) - 30 + k * 7, 0.22] as SfxCue),
  ['error', cf(29), 0.45],
  ['shake', cf(29) + 2, 0.35],
  ['whoosh', cf(31), 0.4],
];

/* ---------- T5 塞得越多 ≠ 看得越清楚 ---------- */
const DOCS = 9;
const MID = 4;
const DOC_W = 100;

export const T5Middle: React.FC<{f: number}> = ({f}) => {
  const rowAt = cf(35);
  const lookAt = cf(35) + 20;
  const missAt = cf(36);
  const pileN = Math.min(8, 1 + Math.floor(prog(f, cf(32), 30) * 7));
  return (
    <>
      <Pop f={f} at={cf(32)} x={60} y={30}>
        <div style={bigText(80, C.white)}>塞得越多</div>
      </Pop>
      <Pop f={f} at={cw(33, '不代表')} x={60} y={130} rot={-2}>
        <div style={bigText(80, C.red)}>≠ 看得越清楚</div>
      </Pop>
      <Pop f={f} at={cf(32)} out={rowAt - 8} x={660} y={220}>
        <BookStack n={pileN} w={280} />
      </Pop>
      <Pop f={f} at={cf(34)} x={60} y={280} rot={-2}>
        <Note color={C.yellow} size={42}>有研究发现</Note>
      </Pop>
      {/* 注意力：两头亮、中间暗 */}
      {f >= lookAt && (
        <div style={{position: 'absolute', left: 40, top: 380, width: 1000, height: 250, opacity: prog(f, lookAt, 12), background: 'linear-gradient(90deg, rgba(255,236,150,0.8), rgba(255,236,150,0.05) 35%, rgba(255,236,150,0.05) 65%, rgba(255,236,150,0.8))', borderRadius: 30}} />
      )}
      {Array.from({length: DOCS}, (_, i) => {
        const at = rowAt + i * 2;
        if (f < at) return null;
        const key = i === MID;
        const edge = Math.min(i, DOCS - 1 - i);
        const dim = f >= lookAt ? (edge <= 1 ? 1 : 0.4) : 1;
        return (
          <div key={i} style={{position: 'absolute', left: 60 + i * (DOC_W + 12), top: 410 + (key ? jolt(f, missAt, 10, 16) : 0), opacity: prog(f, at, 6) * dim, transform: `scale(${prog(f, at, 8, easeOut)})`}}>
            <Card w={DOC_W} h={190} pad={10} bg={key ? C.yellow : C.white}>
              {key ? <div style={{...txt(34), textAlign: 'center', marginTop: 34, lineHeight: 1.2}}>关键<br />信息</div> : [0, 1, 2, 3, 4].map((l) => <div key={l} style={{height: 12, width: `${60 + ((i * 17 + l * 13) % 40)}%`, background: '#E4DED2', borderRadius: 6, marginTop: 18}} />)}
            </Card>
          </div>
        );
      })}
      <Pop f={f} at={lookAt} x={60} y={640} still>
        <div style={{display: 'flex', width: 960, justifyContent: 'space-between', ...txt(36, C.teal)}}>
          <span>▲ 开头看得清</span>
          <span style={{color: C.red}}>中间容易漏</span>
          <span>结尾看得清 ▲</span>
        </div>
      </Pop>
      <Emote f={f} at={missAt} kind="?" x={60 + MID * (DOC_W + 12) + 50} y={380} />
      <Pop f={f} at={missAt + 6} x={60} y={720} enter="left">
        <Note color={C.pink} size={40}>重要信息埋在中间，反而更容易被忽略</Note>
      </Pop>
      <Pop f={f} at={missAt + 20} x={60} y={810}>
        <Note color={C.panel} size={28}>研究：《Lost in the Middle》</Note>
      </Pop>
      <Pop f={f} at={cw(37, '变笨')} x={60} y={900} rot={-3}>
        <div style={bigText(64, C.red)}>聊久了变笨的一个原因</div>
      </Pop>
      <PiP f={f} at={cf(32) - 6} skin="chef" {...PIP} />
    </>
  );
};
export const T5Sfx: SfxCue[] = [
  ['pop', cf(32), 0.35],
  ['boing', cw(33, '不代表'), 0.35],
  ['pop', cf(34), 0.3],
  ...Array.from({length: DOCS}, (_, i) => ['click', cf(35) + i * 2, 0.12] as SfxCue),
  ['whoosh', cf(35) + 20, 0.3],
  ['question', cf(36), 0.35],
  ['stamp', cw(37, '变笨'), 0.45],
];
