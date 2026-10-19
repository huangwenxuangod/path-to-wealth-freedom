import React from 'react';
import {easeIn, easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote} from '../../../library/fx';
import {Check, Stamp, stampScale, Trash, UserFace} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {Block} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

const PALETTE = ['#FFF3B8', C.tealLight, C.pink, '#FCE3A8', '#D9E4FF'];

/* ---------- B7 回答也是一块一块吐出来的 ---------- */
const PICK1 = () => cw(33, '接上');
const PICK2 = () => cw(33, '再去猜') + 6;
const ANSWER: {t: string; at: () => number}[] = [
  {t: '夏天', at: () => cf(29)},
  {t: '是', at: () => cf(29) + 9},
  {t: '冰', at: () => cf(29) + 18},
  {t: '西瓜', at: PICK1},
  {t: '和', at: PICK2},
  {t: '蝉鸣', at: () => PICK2() + 10},
  {t: '。', at: () => PICK2() + 18},
];
const CANDS = [
  [['西瓜', 72], ['可乐', 15], ['空调', 8]],
  [['和', 61], ['配', 22], ['加', 9]],
] as const;

export const B7Gen: React.FC<{f: number}> = ({f}) => {
  const lookAt = cf(31);
  const guessAt = cf(32);
  const set = f >= cw(33, '再去猜') ? 1 : 0;
  const setAt = set ? cw(33, '再去猜') : guessAt;
  const pickAt = set ? PICK2() : PICK1();
  const shown = ANSWER.filter((a) => f >= a.at()).length;
  const look = prog(f, lookAt, 10) * (1 - prog(f, cf(32) + 20, 10));
  return (
    <>
      <Pop f={f} at={cf(28)} x={60} y={10} enter="up">
        <Win w={980} h={560} title="聊天">
          <div style={{position: 'relative', height: 500}}>
            <div style={{position: 'absolute', right: 30, top: 30}}>
              <Card w={430} h={80} pad={0} bg={C.pink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={txt(38)}>用一句话形容夏天</div>
              </Card>
            </div>
            <div style={{position: 'absolute', left: 30, top: 170, display: 'flex', gap: 10, alignItems: 'center'}}>
              <div style={{...txt(36, C.inkSoft), marginRight: 10}}>AI：</div>
              {ANSWER.map((a, i) => {
                const at = a.at();
                if (f < at) return null;
                const p = prog(f, at, 8, easeOut);
                return (
                  <div key={i} style={{transform: `translateY(${(1 - p) * -40}px) scale(${0.6 + 0.4 * p})`, opacity: p}}>
                    <Block text={a.t} size={96} color={i === shown - 1 && f < at + 12 ? C.yellow : PALETTE[i % PALETTE.length]} />
                  </div>
                );
              })}
              {shown < ANSWER.length && f >= cf(29) && <div style={{width: 10, height: 80, background: C.ink, opacity: Math.floor(f / 8) % 2}} />}
            </div>
            {look > 0 && (
              <div style={{position: 'absolute', left: 14, top: 16, width: 940, height: 290, border: `6px dashed ${C.orange}`, borderRadius: 24, opacity: look, boxSizing: 'border-box'}}>
                <div style={{position: 'absolute', left: 20, bottom: -58}}>
                  <Note color={C.yellow} size={32}>看着前面所有的内容</Note>
                </div>
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={guessAt} x={1100} y={20} enter="left">
        <Card w={460} h={400} bg={C.white}>
          <div style={txt(42)}>下一块是什么？</div>
          {CANDS[set].map(([t, pct], k) => {
            const w = prog(f, setAt + 4 + k * 4, 14, easeOut) * pct * 3.2;
            const picked = k === 0 && f >= pickAt;
            return (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 26}}>
                <div style={{...txt(38), width: 90}}>{t}</div>
                <div style={{width: w, height: 40, background: picked ? C.yellow : k ? '#C9CDD2' : C.orange, border: `3px solid ${C.ink}`, borderRadius: 8, boxSizing: 'border-box'}} />
                <div style={txt(30, C.inkSoft)}>{pct}%</div>
                {picked && <Check size={44} />}
              </div>
            );
          })}
          <div style={{...txt(24, C.inkSoft), marginTop: 26}}>示意数字</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(34)} x={1100} y={460} rot={-3}>
        <div style={bigText(64, C.yellow)}>一块一块往外蹦</div>
      </Pop>
      <Burst f={f} at={cf(34) + 4} x={1340} y={500} r={200} />
      <PiP f={f} at={cf(28) - 6} skin="chef" />
    </>
  );
};
export const B7Sfx: SfxCue[] = [
  ['whoosh', cf(28), 0.3],
  ['type', cf(29), 0.35],
  ['whoosh', cf(31), 0.25],
  ['question', cf(32), 0.3],
  ['ding', cw(33, '接上'), 0.35],
  ['click', cw(33, '再去猜'), 0.3],
  ['type', cw(33, '再去猜') + 6, 0.35],
  ['pop', cf(34), 0.4],
];

/* ---------- A8 两件事 ---------- */
const TWO = ['为什么按 token 收钱', '为什么聊久了会「失忆」'];

export const A8Two: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="cowboy" eyes="happy">
    <Pop f={f} at={cf(36)} x={0} y={0}>
      <div style={bigText(80, C.white)}>搞懂了这个</div>
    </Pop>
    <Pop f={f} at={cf(37)} x={0} y={110}>
      <div style={bigText(64, C.yellow)}>两件事你就明白了</div>
    </Pop>
    {TWO.map((t, i) => (
      <Pop key={t} f={f} at={cf(37) + 14 + i * 8} x={0} y={240 + i * 90} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...txt(34, C.white), width: 56, height: 56, borderRadius: 28, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(48)}>{t}</div>
        </div>
      </Pop>
    ))}
  </Host>
);
export const A8Sfx: SfxCue[] = [
  ['pop', cf(36), 0.35],
  ['pop', cf(37), 0.35],
  ['click', cf(37) + 14, 0.3],
  ['click', cf(37) + 22, 0.3],
];

/* ---------- B9 按 token 收钱 ---------- */
const IN = ['帮', '我', '写', '一首', '诗'];
const OUT = ['春风', '吹', '过', '山', '岗'];
const TRAVEL = 22;
const LANE_L = 300;
const LANE_R = 1130;

const Flow: React.FC<{f: number; items: string[]; start: number; y: number; dir: 1 | -1; color: string}> = ({f, items, start, y, dir, color}) => (
  <>
    {items.map((t, i) => {
      const at = start + i * 6;
      const p = prog(f, at, TRAVEL, easeInOut);
      if (f < at || p >= 1) return null;
      const x = dir > 0 ? lerp(LANE_L, LANE_R, p) : lerp(LANE_R, LANE_L, p);
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translateY(${-Math.sin(p * Math.PI) * 30}px)`, opacity: Math.min(1, p * 6, (1 - p) * 6)}}>
          <Block text={t} size={76} color={color} />
        </div>
      );
    })}
  </>
);

export const B9Bill: React.FC<{f: number}> = ({f}) => {
  const inAt = cf(39);
  const outAt = cf(40);
  const nIn = IN.filter((_, i) => f >= inAt + i * 6 + TRAVEL).length;
  const nOut = OUT.filter((_, i) => f >= outAt + i * 6 + TRAVEL).length;
  const stampAt = cw(41, '账');
  const s = stampScale(f, stampAt);
  return (
    <>
      <Pop f={f} at={cf(38)} x={110} y={150}>
        <UserFace size={170} mood="calm" f={f} />
      </Pop>
      <Pop f={f} at={cf(38)} x={150} y={340}>
        <Note size={34}>你</Note>
      </Pop>
      {f >= cf(38) && <Char f={f} x={1300} y={470} s={0.8} kind="bot" eyes={f >= stampAt ? 'happy' : 'open'} lookX={-0.6} />}
      <Pop f={f} at={cf(38)} x={1250} y={480}>
        <Note size={34}>AI</Note>
      </Pop>
      <Pop f={f} at={inAt} x={LANE_L} y={100}>
        <div style={txt(34, C.orange)}>发过去 →</div>
      </Pop>
      <Pop f={f} at={outAt} x={LANE_L} y={330}>
        <div style={txt(34, C.teal)}>← 回给你</div>
      </Pop>
      <Flow f={f} items={IN} start={inAt} y={170} dir={1} color="#FCE3A8" />
      <Flow f={f} items={OUT} start={outAt} y={250} dir={-1} color={C.tealLight} />
      <Pop f={f} at={inAt} x={420} y={410} enter="up">
        <Card w={640} h={300} bg={C.panel}>
          <div style={txt(42)}>账单</div>
          <div style={{borderTop: `3px dashed ${C.line}`, margin: '12px 0 16px'}} />
          <div style={{...txt(40), display: 'flex', justifyContent: 'space-between'}}>
            <span>输入 token</span>
            <span style={{color: C.orange}}>× {nIn}</span>
          </div>
          <div style={{...txt(40), display: 'flex', justifyContent: 'space-between', marginTop: 14, opacity: f >= outAt ? 1 : 0.3}}>
            <span>输出 token</span>
            <span style={{color: C.teal}}>× {nOut}</span>
          </div>
        </Card>
      </Pop>
      {s > 0 && (
        <div style={{position: 'absolute', left: 720, top: 640, transform: `scale(${s}) rotate(-8deg)`}}>
          <Stamp text="都要算钱" size={46} />
        </div>
      )}
      <Burst f={f} at={stampAt + 2} x={860} y={680} r={180} />
      <PiP f={f} at={cf(38) - 6} skin="cowboy" />
    </>
  );
};
export const B9Sfx: SfxCue[] = [
  ['pop', cf(38), 0.35],
  ...IN.map((_, i) => ['click', cf(39) + i * 6 + TRAVEL, 0.25] as SfxCue),
  ...OUT.map((_, i) => ['click', cf(40) + i * 6 + TRAVEL, 0.25] as SfxCue),
  ['stamp', cw(41, '账'), 0.5],
];

/* ---------- B10 上下文窗口：装不下就被挤出去 ---------- */
const TOK = ['你好', '帮我', '写', '一篇', '文章', '关于', '夏天', '再', '改', '短', '一点', '加', '标题', '换', '风格'];
const FIRST = 7; // 窗口正好能放 7 块
const BW = 150;
const WL = 250;
const WR = WL + FIRST * BW;
const WY = 250;

export const B10Window: React.FC<{f: number}> = ({f}) => {
  const arrive = (k: number) => (k < FIRST ? cf(43) + k * 6 : cf(45) + (k - FIRST) * 7);
  const c = TOK.reduce((s, _, k) => s + prog(f, arrive(k), 8, easeOut), 0);
  const squashAt = cw(46, '压缩');
  const dropAt = cw(46, '丢掉');
  const sq = prog(f, squashAt, 12, easeInOut);
  const drop = prog(f, dropAt, 18, easeIn);
  const full = f >= cf(45);
  return (
    <>
      <Pop f={f} at={cf(42)} x={80} y={20}>
        <div style={bigText(68, C.white)}>
          聊久了为什么会<span style={{color: C.yellow}}>「失忆」</span>？
        </div>
      </Pop>
      <Pop f={f} at={cf(43)} x={WL - 14} y={WY - 40} w={WR - WL + 28} h={200}>
        <div style={{width: '100%', height: '100%', boxSizing: 'border-box', border: `7px dashed ${full ? C.red : C.teal}`, borderRadius: 26, background: full ? 'rgba(229,72,77,0.1)' : 'rgba(191,231,223,0.25)', transform: `translateX(${jolt(f, cf(45), 12, 18)}px)`}} />
      </Pop>
      <Pop f={f} at={cf(43) + 10} x={WL} y={WY - 110}>
        <Note color={C.tealLight} size={36}>
          一次能看的范围 = <Marker p={prog(f, cw(44, '上下文'), 10)}>上下文窗口</Marker>
        </Note>
      </Pop>
      {TOK.map((t, k) => {
        const p = prog(f, arrive(k), 8, easeOut);
        if (p <= 0) return null;
        let x = WR - (c - k) * BW + 7;
        const out = x < WL - 20;
        let y = WY;
        let scale = 1;
        let rot = 0;
        let op = p;
        if (out) {
          x = lerp(x, WL - 260 + k * 26, sq); // 压成窗口左边的一小摞
          scale = lerp(1, 0.55, sq);
          y = lerp(WY, WY + 20, sq) + drop * 380;
          rot = drop * (rand(k) * 80 - 40);
          op = 1 - prog(f, dropAt + 10, 10);
        }
        return (
          <div key={k} style={{position: 'absolute', left: x, top: y, width: BW - 14, display: 'flex', justifyContent: 'center', opacity: op, transform: `scale(${scale}) rotate(${rot}deg)`, filter: out ? 'grayscale(1)' : 'none'}}>
            <Block text={t} size={100} color={PALETTE[k % PALETTE.length]} />
          </div>
        );
      })}
      <Pop f={f} at={cf(45)} x={WR - 260} y={WY + 190} rot={3}>
        <div style={{...bigText(76, C.red), transform: `translateX(${jolt(f, cf(45) + 4, 10, 16)}px)`}}>装不下了！</div>
      </Pop>
      <Pop f={f} at={squashAt} x={60} y={WY + 170}>
        <Note color={C.pink} size={34}>前面的被压缩 / 丢掉</Note>
      </Pop>
      <Pop f={f} at={dropAt - 8} x={40} y={560}>
        <Trash size={170} lid={prog(f, dropAt, 8)} />
      </Pop>
      <PiP f={f} at={cf(42) - 6} skin="detective" eyes={f >= dropAt ? 'wide' : 'open'} />
    </>
  );
};
export const B10Sfx: SfxCue[] = [
  ['question', cf(42), 0.3],
  ...TOK.slice(0, FIRST).map((_, k) => ['click', cf(43) + k * 6, 0.2] as SfxCue),
  ...TOK.slice(FIRST).map((_, k) => ['click', cf(45) + k * 7, 0.2] as SfxCue),
  ['error', cf(45) + 4, 0.3],
  ['shake', cw(46, '压缩'), 0.3],
  ['whoosh', cw(46, '丢掉'), 0.35],
];

/* ---------- B11 小技巧：开个新对话 ---------- */
export const B11Fresh: React.FC<{f: number}> = ({f}) => {
  const dizzyAt = cw(48, '犯迷糊');
  const clickAt = cw(49, '新对话');
  const newAt = clickAt + 6;
  const listAt = cf(50);
  const cur = prog(f, clickAt - 18, 16, easeInOut);
  const happy = f >= listAt + 12;
  return (
    <>
      <Pop f={f} at={cf(47)} x={60} y={20} enter="up">
        <Win w={600} h={560} title="聊了 200 轮…">
          <div style={{position: 'relative', height: 500, overflow: 'hidden'}}>
            {Array.from({length: 26}, (_, i) => {
              const y = ((i * 44 - f * 2) % (26 * 44) + 26 * 44) % (26 * 44) - 20;
              return <div key={i} style={{position: 'absolute', left: i % 2 ? 180 : 24, top: y, width: 200 + rand(i) * 180, height: 26, borderRadius: 13, background: i % 2 ? C.pink : '#E4DED2'}} />;
            })}
          </div>
        </Win>
      </Pop>
      <Char f={f} x={880} y={790} s={0.9} kind="bot" eyes={happy ? 'happy' : f >= dizzyAt ? 'spiral' : 'open'} lookX={0.4} armsUp={happy ? 0.7 : 0} />
      <Emote f={f} at={dizzyAt} kind="?" x={900} y={470} />
      <Pop f={f} at={cf(49)} x={720} y={150}>
        <Card w={320} h={90} pad={0} bg={f >= clickAt && f < clickAt + 6 ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(44)}>＋ 新对话</div>
        </Card>
      </Pop>
      {f >= cf(49) && f < newAt + 20 && (
        <div style={{position: 'absolute', left: lerp(1000, 900, cur), top: lerp(420, 200, cur)}}>
          <Cursor down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      <Pop f={f} at={newAt} x={1100} y={20} enter="right">
        <Win w={460} h={470} title="新对话">
          <div style={{padding: 26}}>
            <Pop f={f} at={listAt} x={26} y={20}>
              <Note color={C.yellow} size={36}>把要点交代一遍</Note>
            </Pop>
            {['要做什么', '做到哪了', '要注意什么'].map((t, i) => (
              <Pop key={t} f={f} at={listAt + 10 + i * 6} x={26} y={120 + i * 80} enter="left">
                <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                  <Check size={48} />
                  <div style={txt(42)}>{t}</div>
                </div>
              </Pop>
            ))}
          </div>
        </Win>
      </Pop>
      <Burst f={f} at={listAt + 30} x={1330} y={260} r={220} />
      <PiP f={f} at={cf(47) - 6} wear={['headphones']} eyes={happy ? 'happy' : 'open'} />
    </>
  );
};
export const B11Sfx: SfxCue[] = [
  ['whoosh', cf(47), 0.3],
  ['question', cw(48, '犯迷糊'), 0.35],
  ['pop', cf(49), 0.3],
  ['click', cw(49, '新对话'), 0.45],
  ['whoosh', cw(49, '新对话') + 6, 0.3],
  ['paper', cf(50), 0.3],
  ...[0, 1, 2].map((i) => ['ding', cf(50) + 10 + i * 6, 0.25] as SfxCue),
];

/* ---------- A12 结尾 ---------- */
export const A12Bye: React.FC<{f: number}> = ({f}) => {
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
export const A12Sfx: SfxCue[] = [
  ['pop', cf(51), 0.4],
  ['confetti', cf(52), 0.5],
  ['ding', cf(52) + 2, 0.3],
];
