import React from 'react';
import {easeInOut, easeOut, easeOutBack, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Cross, Stamp, UserFace} from '../../../library/icons';
import {bigText, Card, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';
import {ce, cf, cw} from '../cues';
import {Block, BookStack, Globe, Keyboard, Magnifier, Trophy} from '../../../library/items/objects';

/* ================= 1 接个龙试试：床前明月___ ================= */

const POEM = ['床', '前', '明', '月'];

const Scroll: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'relative', width: 900, height: 280}}>
    {[0, 1].map((i) => (
      <div key={i} style={{position: 'absolute', top: -14, [i ? 'right' : 'left']: -18, width: 36, height: 308, borderRadius: 18, background: '#A07C5B', border: `4px solid ${C.ink}`}} />
    ))}
    <div style={{position: 'absolute', inset: 0, background: '#FFF3D6', border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, boxShadow: '6px 8px 0 rgba(43,35,32,0.14)'}}>
      {children}
    </div>
  </div>
);

export const L1Poem: React.FC<{f: number}> = ({f}) => {
  const guang = cw(3, '光');
  const filled = f >= guang;
  const drop = prog(f, guang, 8, easeOutBack);
  const proud = f >= cf(4);
  return (
    <>
      <Pop f={f} at={0} x={90} y={40} dur={12}>
        <Scroll>
          {POEM.map((ch, i) => {
            const at = cw(1, ch);
            const p = prog(f, at, 8, easeOutBack);
            return (
              <div key={ch} style={{...txt(128), opacity: f >= at ? 1 : 0.12, transform: `translateY(${(1 - p) * -30}px) scale(${0.6 + 0.4 * p})`}}>{ch}</div>
            );
          })}
          <div style={{width: 150, height: 150, border: `6px dashed ${filled ? 'transparent' : C.inkSoft}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            {filled ? (
              <div style={{...bigText(140, C.yellow), transform: `translateY(${(1 - drop) * -200}px) scale(${0.5 + 0.5 * drop})`}}>光</div>
            ) : (
              f >= ce(1) && <div style={{...txt(110, C.inkSoft), transform: `rotate(${Math.sin(f * 0.3) * 10}deg)`}}>?</div>
            )}
          </div>
        </Scroll>
      </Pop>
      <FocusLines f={f} at={guang} out={guang + 22} x={830} y={180} />
      <Burst f={f} at={guang + 4} x={830} y={180} r={140} />
      {/* 你的脑袋 + 想法云 */}
      <Pop f={f} at={cf(2)} x={80} y={440} enter="left">
        <UserFace size={220} f={f} mood={proud ? 'happy' : 'calm'} />
      </Pop>
      <Pop f={f} at={cf(2) + 8} x={330} y={390}>
        <svg width={330} height={230} viewBox="0 0 330 230" style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx="18" cy="200" r="10" fill={C.white} stroke={C.ink} strokeWidth={4} />
          <circle cx="44" cy="170" r="16" fill={C.white} stroke={C.ink} strokeWidth={4} />
          <path d="M70 120 Q60 60 120 60 Q140 16 200 30 Q260 10 290 60 Q330 80 306 130 Q320 180 250 180 Q210 214 160 186 Q100 204 90 160 Q50 150 70 120 Z" fill={C.white} stroke={C.ink} strokeWidth={5} />
        </svg>
        <div style={{position: 'absolute', left: 120, top: 50, width: 170, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {f >= guang - 6 ? <div style={bigText(96, C.yellow)}>光!</div> : <div style={txt(70, C.inkSoft)}>…</div>}
        </div>
      </Pop>
      {/* 大模型上岗证 */}
      <Pop f={f} at={cw(4, '大模型')} x={330} y={700} rot={-4}>
        <Card w={430} h={250} bg="#FFF8E6" style={{position: 'relative', textAlign: 'center'}}>
          <div style={txt(36, C.inkSoft)}>恭喜你获得</div>
          <div style={{...txt(58), marginTop: 6}}>大模型上岗证</div>
          <div style={{...txt(30, C.inkSoft), marginTop: 10}}>技能：接龙 ★★★★★</div>
        </Card>
        <div style={{position: 'absolute', right: -30, bottom: -30, transform: `rotate(-14deg) scale(${f >= cw(4, '大模型') + 10 ? 1 : 0})`}}>
          <Stamp text="已认证" size={44} />
        </div>
      </Pop>
      <Char f={f} x={880} y={1075} s={0.95} wear={['scholar']} eyes={proud ? 'star' : f >= guang ? 'happy' : 'open'} armsUp={proud ? 0.5 + 0.5 * Math.abs(Math.sin(f * 0.4)) : 0} lookX={-0.6} />
      <Emote f={f} at={cf(4) + 4} kind="heart" x={880} y={860} />
    </>
  );
};

export const L1Sfx: SfxCue[] = [
  ...POEM.map((ch) => ['pop', cw(1, ch), 0.35] as SfxCue),
  ['question', ce(1), 0.35],
  ['pop', cf(2), 0.35],
  ['whoosh', cw(3, '光') - 6, 0.35],
  ['stamp', cw(3, '光'), 0.6],
  ['magic', cw(3, '光') + 2, 0.35],
  ['paper', cw(4, '大模型'), 0.45],
  ['stamp', cw(4, '大模型') + 10, 0.5],
  ['ding', cf(4) + 6, 0.3],
];

/* ================= 2 AI 背后是谁 ================= */

const APPS = [
  {name: 'GPT', color: '#9FE3D2', at: cw(5, 'GPT')},
  {name: 'Claude', color: '#F4B38A', at: cw(5, 'Claude')},
  {name: '……', color: '#CBBDF2', at: cw(5, 'AI')},
];
const LLM_LETTERS = [
  {l: 'L', en: 'Large', cn: '大'},
  {l: 'L', en: 'Language', cn: '语言'},
  {l: 'M', en: 'Model', cn: '模型'},
];

export const L2Who: React.FC<{f: number}> = ({f}) => {
  const lineP = prog(f, cf(6) - 8, 14, easeInOut);
  const llmAt = cf(7);
  const bop = Math.abs(Math.sin(f * 0.26)) * 14;
  return (
    <>
      {APPS.map((a, i) => (
        <Pop key={a.name} f={f} at={a.at} x={60 + i * 330} y={30} enter="drop">
          <Card w={290} h={150} bg={a.color} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(a.name.length > 4 ? 60 : 72)}>{a.name}</div>
          </Card>
        </Pop>
      ))}
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
        {APPS.map((_, i) => {
          const x = 205 + i * 330;
          return <path key={i} d={`M${x} 190 Q${x} 280 ${540 + (i - 1) * 140} 370`} pathLength={1} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="1 1" strokeDashoffset={1 - lineP} strokeLinecap="round" />;
        })}
      </svg>
      <Pop f={f} at={cf(6)} x={130} y={370}>
        <Card w={820} h={250} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <svg width={110} height={110} viewBox="0 0 100 100" style={{transform: `rotate(${f * 2}deg)`}}>
            <path d="M50 10 L58 22 L72 18 L74 32 L88 36 L82 50 L88 64 L74 68 L72 82 L58 78 L50 90 L42 78 L28 82 L26 68 L12 64 L18 50 L12 36 L26 32 L28 18 L42 22 Z" fill={C.yellow} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            <circle cx="50" cy="50" r="14" fill={C.white} stroke={C.ink} strokeWidth={4} />
          </svg>
          <div style={txt(92)}>大语言模型</div>
        </Card>
      </Pop>
      {LLM_LETTERS.map((x, i) => {
        const at = llmAt + i * 4;
        const sub = prog(f, llmAt + 12 + i * 3, 8, easeOut);
        return (
          <Pop key={i} f={f} at={at} x={120 + i * 220} y={660}>
            <div style={{width: 200, textAlign: 'center'}}>
              <div style={bigText(150, [C.teal, C.orange, '#8E8FE8'][i])}>{x.l}</div>
              <div style={{...txt(34), opacity: sub}}>{x.en}</div>
              <div style={{...txt(40, C.inkSoft), opacity: sub}}>{x.cn}</div>
            </div>
          </Pop>
        );
      })}
      <Burst f={f} at={llmAt + 10} x={450} y={760} r={260} n={14} />
      <Char f={f} x={900} y={1080 - bop} s={0.8} wear={['headphones']} eyes="closed" lookX={-0.4} />
    </>
  );
};

export const L2Sfx: SfxCue[] = [
  ...APPS.map((a) => ['pop', a.at + 4, 0.4] as SfxCue),
  ['whoosh', cf(6) - 8, 0.3],
  ['pop', cf(6), 0.5],
  ...LLM_LETTERS.map((_, i) => ['stamp', cf(7) + i * 4, 0.45] as SfxCue),
  ['magic', cf(7) + 12, 0.3],
];

/* ================= 3 核心本事：猜下一个字 ================= */

const CANDS = [
  {ch: '好', p: 0.62},
  {ch: '热', p: 0.21},
  {ch: '冷', p: 0.11},
  {ch: '差', p: 0.06},
];

export const L3Guess: React.FC<{f: number}> = ({f}) => {
  const barAt = cw(10, '猜');
  const winAt = cw(10, '最可能');
  const flyAt = winAt + 6;
  const fly = prog(f, flyAt, 10, easeInOut);
  const placed = fly >= 1;
  return (
    <>
      <Pop f={f} at={cf(8) - 4} x={60} y={30}>
        <Card w={960} h={200} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
          <div style={txt(96)}>
            <Marker p={prog(f, cf(9), 14)}>今天天气真</Marker>
          </div>
          <div style={{width: 118, height: 118, border: `6px ${placed ? 'solid' : 'dashed'} ${placed ? C.ink : C.inkSoft}`, borderRadius: 16, background: placed ? C.yellow : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(96)}}>
            {placed ? '好' : ''}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(9) + 6} x={150} y={240} rot={-3}>
        <div style={{...txt(38, C.white), background: C.teal, border: `3px solid ${C.ink}`, borderRadius: 12, padding: '0 16px'}}>↑ 前面的话</div>
      </Pop>
      <Pop f={f} at={barAt - 4} x={60} y={340} enter="up">
        <Card w={960} h={470} bg="#FFF8E6">
          <div style={{...txt(44), marginBottom: 18}}>下一个字最可能是……</div>
          {CANDS.map((c, i) => {
            const grow = prog(f, barAt + i * 4, 18, easeOut);
            const win = i === 0 && f >= winAt;
            return (
              <div key={c.ch} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20}}>
                <div style={{...txt(64), width: 80, textAlign: 'center', opacity: i === 0 && fly > 0 ? 1 - fly : 1}}>{c.ch}</div>
                <div style={{flex: 1, height: 58, border: `4px solid ${C.ink}`, borderRadius: 14, background: C.white, overflow: 'hidden'}}>
                  <div style={{width: `${c.p * grow * 100}%`, height: '100%', background: win ? C.yellow : [C.teal, '#8E8FE8', '#F2A0B4', '#C9C2B4'][i]}} />
                </div>
                <div style={{...txt(44), width: 110}}>{Math.round(c.p * grow * 100)}%</div>
              </div>
            );
          })}
        </Card>
      </Pop>
      {/* 「好」飞进空格 */}
      {fly > 0 && fly < 1 && (
        <div style={{position: 'absolute', left: lerp(125, 830, fly), top: lerp(460, 70, fly) - Math.sin(fly * Math.PI) * 160, ...bigText(96, C.yellow), transform: `rotate(${fly * 360}deg)`}}>好</div>
      )}
      <Burst f={f} at={winAt} x={130} y={500} r={90} />
      <Burst f={f} at={flyAt + 12} x={870} y={130} r={110} />
      <div style={{position: 'absolute', left: 560, top: 830, transform: `rotate(${-20 + Math.sin(f * 0.15) * 12}deg)`}}>
        <Magnifier size={150} />
      </div>
      <Char f={f} x={880} y={1080} s={0.85} wear={['detective']} eyes={placed ? 'star' : f >= barAt ? 'wide' : 'flat'} lookX={-0.8} />
      <Emote f={f} at={cf(8)} kind="?" x={880} y={870} />
    </>
  );
};

export const L3Sfx: SfxCue[] = [
  ['pop', cf(8) - 4, 0.4],
  ['question', cf(8) + 2, 0.3],
  ['paper', cf(9), 0.3],
  ['whoosh', cw(10, '猜') - 4, 0.3],
  ...CANDS.map((_, i) => ['click', cw(10, '猜') + i * 4 + 10, 0.35] as SfxCue),
  ['ding', cw(10, '最可能'), 0.4],
  ['whoosh', cw(10, '最可能') + 6, 0.35],
  ['pop', cw(10, '最可能') + 16, 0.55],
];

/* ================= 4 一个字一个字往外蹦 ================= */

const REPLY = [...'今天晴朗，适合出门！'];
const POOL = [...'晴阴雨好热冷天风云雪日暖凉朗出门适合'];

const charTimes = () => {
  const a = cw(13, '第一个字');
  const b = ce(15) - 4;
  return REPLY.map((_, k) => Math.round(lerp(a, b, k / (REPLY.length - 1))));
};
const TIMES = charTimes();

export const L4OneByOne: React.FC<{f: number}> = ({f}) => {
  const shown = TIMES.filter((t) => f >= t).length;
  const next = TIMES[shown];
  const spinning = next !== undefined && f >= next - 7 && f >= cf(13);
  const bounceAt = cw(17, '蹦');
  const typing = TIMES.some((t) => f >= t - 2 && f < t + 2);
  return (
    <>
      <Pop f={f} at={cf(11)} x={0} y={20} w={1020} enter="right" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14}}>
        <div style={{...txt(52), background: '#BFE7DF', border: `4px solid ${C.ink}`, borderRadius: '28px 8px 28px 28px', padding: '10px 28px'}}>今天天气怎么样？</div>
        <UserFace size={100} f={f} />
      </Pop>
      {/* 一口气想好整段？不是 */}
      <Pop f={f} at={cf(12)} out={cf(13) + 6} x={60} y={170} rot={-2}>
        <div style={{position: 'relative'}}>
          <Card w={640} h={210} bg={C.white} style={{opacity: 0.85}}>
            {[0.95, 0.8, 0.9, 0.6].map((w, i) => <div key={i} style={{height: 20, width: `${w * 100}%`, background: '#D9D2C4', borderRadius: 10, marginBottom: 18}} />)}
          </Card>
          <div style={{position: 'absolute', left: 180, top: -10}}>
            <Cross size={230} p={prog(f, cw(12, '整段') + 4, 10)} />
          </div>
          <div style={{position: 'absolute', left: 660, top: 70, ...txt(40, '#B3262B')}}>一口气想好？</div>
        </div>
      </Pop>
      {/* AI 逐字回复 */}
      <Pop f={f} at={cf(13) - 4} x={60} y={200} enter="left">
        <div style={{position: 'relative', minWidth: 300, minHeight: 130, background: C.white, border: `4px solid ${C.ink}`, borderRadius: '8px 30px 30px 30px', padding: '18px 30px', boxShadow: '5px 7px 0 rgba(43,35,32,0.14)', display: 'flex', alignItems: 'center'}}>
          {REPLY.slice(0, shown).map((ch, k) => {
            const p = prog(f, TIMES[k], 7, easeOutBack);
            const hop = Math.max(0, Math.sin(prog(f, bounceAt + k * 3, 10) * Math.PI)) * 40;
            return (
              <span key={k} style={{...txt(84), display: 'inline-block', transform: `translateY(${(1 - p) * -40 - hop}px) scale(${0.5 + 0.5 * p})`}}>{ch}</span>
            );
          })}
          {/* 候选字转盘 + 光标 */}
          {spinning && (
            <span style={{...txt(84, C.orange), display: 'inline-block', opacity: 0.8}}>{POOL[Math.floor(rand(Math.floor(f / 2) + shown * 13) * POOL.length)]}</span>
          )}
          {shown < REPLY.length && !spinning && <span style={{...txt(84, C.inkSoft), opacity: Math.floor(f / 8) % 2}}>▌</span>}
        </div>
      </Pop>
      {/* 接龙积木链 */}
      <div style={{position: 'absolute', left: 60, top: 520, width: 960, display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 26}}>
        {REPLY.slice(0, shown).map((ch, k) => {
          const p = prog(f, TIMES[k] + 2, 8, easeOutBack);
          return (
            <React.Fragment key={k}>
              {k > 0 && <div style={{...txt(40, C.inkSoft), margin: '0 6px', opacity: p}}>→</div>}
              <div style={{transform: `scale(${p}) rotate(${(k % 2 ? 4 : -4) * p}deg)`}}>
                <Block text={ch} size={86} color={[C.white, '#FFF3B8', '#BFE7DF', '#F7CFD6'][k % 4]} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Pop f={f} at={cf(16)} x={60} y={830} rot={-3}>
        <div style={{...txt(46), background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 22px'}}>一个字 → 接一个字 → 再接一个字</div>
      </Pop>
      <div style={{position: 'absolute', left: 610, top: 960}}>
        <Keyboard w={430} press={typing ? Math.floor(rand(shown) * 28) : -1} />
      </div>
      <Char f={f} x={825} y={985} s={0.8} wear={['bowtie']} eyes={shown === REPLY.length ? 'happy' : 'open'} lookX={-0.3} />
    </>
  );
};

export const L4Sfx: SfxCue[] = [
  ['pop', cf(11), 0.4],
  ['paper', cf(12), 0.3],
  ['snip', cw(12, '整段') + 4, 0.4],
  ...TIMES.map((t) => ['click', t, 0.45] as SfxCue),
  ['pop', cf(16), 0.35],
  ['boing', cw(17, '蹦'), 0.35],
];

/* ================= 5 为什么猜得准：读遍互联网 ================= */

const GENRES = [
  {name: '小说', at: cw(21, '小说'), color: '#F7CFD6', x: 70, y: 600},
  {name: '论文', at: cw(21, '论文'), color: '#CBBDF2', x: 270, y: 700},
  {name: '代码', at: cw(21, '代码'), color: '#9FE3D2', x: 70, y: 790},
  {name: '聊天记录', at: cw(21, '聊天记录'), color: '#FFF3B8', x: 290, y: 880},
];
const PAIRS: [string, string][] = [
  ['床前明月', '光'],
  ['今天天气', '真好'],
  ['谢谢', '你'],
];

const fmt = (n: number) => Math.floor(n).toLocaleString('en-US');

export const L5Read: React.FC<{f: number}> = ({f}) => {
  const streamOn = f >= cw(20, '互联网') && f < cf(22);
  const count = Math.pow(10, lerp(2, 13, prog(f, cw(20, '互联网'), ce(21) - cw(20, '互联网'), easeInOut)));
  const head = {x: 820, y: 900};
  return (
    <>
      <Pop f={f} at={cf(18) - 4} x={540} y={60} center>
        <div style={bigText(84, C.yellow)}>为什么猜得这么准？</div>
      </Pop>
      <Pop f={f} at={cw(20, '互联网') - 4} x={70} y={180}>
        <Globe size={300} t={f} />
      </Pop>
      <Pop f={f} at={cf(19)} x={420} y={200} rot={3}>
        <div style={{...txt(44), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 20px'}}>训练时：狂读</div>
      </Pop>
      {/* 文本流：从地球飞进小人脑袋 */}
      {streamOn &&
        Array.from({length: 9}, (_, i) => {
          const p = ((f - cw(20, '互联网')) / 26 + i / 9) % 1;
          const x = lerp(260, head.x - 40, p);
          const y = lerp(330, head.y - 160, p) - Math.sin(p * Math.PI) * 120;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - p * 0.6}) rotate(${p * 200}deg)`, opacity: Math.min(1, (1 - p) * 3)}}>
              <svg width={56} height={70} viewBox="0 0 40 50">
                <rect x="2" y="2" width="36" height="46" rx="4" fill={C.white} stroke={C.ink} strokeWidth={3} />
                {[14, 24, 34].map((ly) => <line key={ly} x1="9" y1={ly} x2="31" y2={ly} stroke={C.ink} strokeWidth={2.5} opacity={0.5} />)}
              </svg>
            </div>
          );
        })}
      {GENRES.map((g) => (
        <Pop key={g.name} f={f} at={g.at} out={cf(22)} x={g.x} y={g.y} rot={g.x > 200 ? 4 : -4}>
          <div style={{...txt(50), background: g.color, border: `4px solid ${C.ink}`, borderRadius: 16, padding: '6px 24px', boxShadow: '4px 5px 0 rgba(43,35,32,0.14)'}}>{g.name}</div>
        </Pop>
      ))}
      <Pop f={f} at={cw(20, '互联网')} out={cf(22)} x={430} y={440}>
        <div style={{...txt(38, C.inkSoft)}}>已读</div>
        <div style={{...txt(58), fontVariantNumeric: 'tabular-nums'}}>{fmt(count)} 字</div>
      </Pop>
      {/* 见得多了：什么话后面跟什么话 */}
      <Pop f={f} at={cf(22)} x={60} y={560} enter="up">
        <Card w={620} h={380} bg="#FFF8E6">
          <div style={{...txt(42), marginBottom: 16}}>见得多了就知道……</div>
          {PAIRS.map(([a, b], i) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, opacity: prog(f, cf(23) + i * 8, 8)}}>
              <div style={txt(48)}>{a}</div>
              <div style={txt(44, C.inkSoft)}>→</div>
              <div style={{...txt(48), background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 14px'}}>{b}</div>
            </div>
          ))}
        </Card>
      </Pop>
      <Char f={f} x={head.x} y={1080} s={1.0} wear={['glasses']} eyes={f >= cf(23) ? 'happy' : streamOn ? 'wide' : 'open'} lookX={-0.7} />
      <Emote f={f} at={cf(18) + 4} kind="?" x={head.x} y={head.y - 30} />
      <Emote f={f} at={cf(23) + 4} kind="idea" x={head.x + 10} y={head.y - 40} dur={50} />
    </>
  );
};

export const L5Sfx: SfxCue[] = [
  ['pop', cf(18) - 4, 0.45],
  ['question', cf(18) + 4, 0.3],
  ['pop', cf(19), 0.35],
  ['whoosh', cw(20, '互联网') - 4, 0.35],
  ['type', cw(20, '互联网') + 6, 0.25],
  ...GENRES.map((g) => ['pop', g.at, 0.4] as SfxCue),
  ['paper', cf(22), 0.4],
  ...PAIRS.map((_, i) => ['click', cf(23) + i * 8, 0.35] as SfxCue),
  ['ding', cf(23) + 4, 0.3],
];

/* ================= 6 读过亿万本书的接龙高手 ================= */

export const L6Master: React.FC<{f: number}> = ({f}) => {
  const n = Math.min(8, Math.max(0, Math.floor(lerp(0, 8.99, prog(f, cf(24) - 4, cw(25, '接龙') - cf(24))))));
  const stackTop = 1085 - n * 44;
  const crowned = f >= cw(25, '接龙高手');
  return (
    <>
      <div style={{position: 'absolute', left: 250, top: stackTop}}>
        <BookStack n={n} w={320} />
      </div>
      <Char f={f} x={430} y={stackTop + 4} s={0.95} wear={['grad']} eyes={crowned ? 'star' : 'open'} armsUp={crowned ? 1 : 0} />
      <Pop f={f} at={cw(25, '亿万本书')} x={660} y={640} rot={5}>
        <div style={{...txt(46), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 20px'}}>× 亿万本</div>
      </Pop>
      <Pop f={f} at={cw(25, '接龙高手')} x={540} y={130} center>
        <div style={bigText(140, C.yellow)}>接龙高手</div>
      </Pop>
      <Pop f={f} at={cw(25, '接龙高手') + 6} x={750} y={300} rot={8}>
        <Trophy size={200} />
      </Pop>
      <Burst f={f} at={cw(25, '接龙高手')} x={540} y={130} r={320} n={16} />
    </>
  );
};

export const L6Sfx: SfxCue[] = [
  ...Array.from({length: 4}, (_, i) => ['boing', cf(24) + i * 12, 0.2] as SfxCue),
  ['pop', cw(25, '亿万本书'), 0.4],
  ['magic', cw(25, '接龙高手') - 2, 0.45],
  ['confetti', cw(25, '接龙高手') + 4, 0.35],
];
