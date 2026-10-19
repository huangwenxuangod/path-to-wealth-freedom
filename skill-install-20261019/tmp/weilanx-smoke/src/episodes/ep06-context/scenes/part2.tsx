import React from 'react';
import {easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote} from '../../../library/fx';
import {Check, Cross} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

/* ---------- S6 管好这张桌子：三个做法 ---------- */
const TIPS = ['把需要的东西主动放上去', '一个对话只做一件事', '总结要点，再开新对话'];

export const S6Tips: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="cowboy" eyes="happy">
    <Pop f={f} at={cf(38)} x={0} y={0}>
      <Note color={C.panel} size={36}>用好上下文</Note>
    </Pop>
    <Pop f={f} at={cw(39, '管好')} x={0} y={70}>
      <div style={bigText(84, C.yellow)}>= 管好这张桌子</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cf(40) + 8 + i * 6} x={0} y={210 + i * 84} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...txt(34, C.white), width: 56, height: 56, borderRadius: 28, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(46)}>{t}</div>
        </div>
      </Pop>
    ))}
  </Host>
);
export const S6Sfx: SfxCue[] = [
  ['pop', cf(38), 0.3],
  ['ding', cw(39, '管好'), 0.35],
  ...TIPS.map((_, i) => ['click', cf(40) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- S7 做法一：把它需要的东西主动放上去 ---------- */
const CHIPS = [
  {k: '目标读者', v: '刚入门的新手', at: () => cw(43, '目标'), color: C.tealLight},
  {k: '想要的风格', v: '轻松、口语化', at: () => cw(43, '风格'), color: '#FFF3B8'},
  {k: '满意的例子', v: '附上一段你喜欢的文案', at: () => cw(44, '例子'), color: C.pink},
];

export const S7Give: React.FC<{f: number}> = ({f}) => {
  const guessAt = cf(45);
  return (
    <>
      <Pop f={f} at={cf(41)} x={80} y={40} enter="up">
        <Win w={880} h={520} title="发给 AI 的消息">
          <div style={{padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 22}}>
            <Pop f={f} at={cf(42)} x={0} y={0} style={{position: 'relative'}} still>
              <div style={txt(42)}>帮我改一下这段文案</div>
            </Pop>
            {CHIPS.map((c) => {
              const at = c.at();
              if (f < at) return <div key={c.k} style={{height: 84}} />;
              const p = prog(f, at, 10, easeOut);
              return (
                <div key={c.k} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateX(${(1 - p) * -80}px)`}}>
                  <Check size={46} />
                  <div style={{...txt(38), background: c.color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 18px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{c.k}</div>
                  <div style={txt(34, C.inkSoft)}>{c.v}</div>
                </div>
              );
            })}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(44) + 20} x={80} y={590} rot={-2}>
        <Note color={C.panel} size={26}>示例内容</Note>
      </Pop>
      <Char f={f} x={1260} y={760} s={0.9} kind="bot" eyes={f >= guessAt ? 'spiral' : 'happy'} lookX={-0.5} />
      <Pop f={f} at={guessAt} x={1060} y={150}>
        <div style={{position: 'relative'}}>
          <Card w={400} h={130} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(38)}>你心里想的是……？</div>
          </Card>
          {f >= guessAt + 12 && (
            <div style={{position: 'absolute', left: 150, top: 10}}>
              <Cross size={110} p={prog(f, guessAt + 12, 8)} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={guessAt + 18} x={1080} y={320} rot={-4}>
        <div style={bigText(72, C.red)}>它不会猜！</div>
      </Pop>
      <Emote f={f} at={guessAt + 4} kind="sweat" x={1370} y={500} />
      <PiP f={f} at={cf(41) - 6} skin="santa" />
    </>
  );
};
export const S7Sfx: SfxCue[] = [
  ['paper', cf(41), 0.35],
  ['type', cf(42), 0.3],
  ...CHIPS.map((c) => ['pop', c.at(), 0.35] as SfxCue),
  ['question', cf(45), 0.3],
  ['error', cf(45) + 12, 0.35],
  ['boing', cf(45) + 18, 0.3],
];

/* ---------- S8 做法二：一个对话只做一件事 ---------- */
const Lines: React.FC<{n: number; color: string; seed: number}> = ({n, color, seed}) => (
  <div style={{padding: '20px 24px'}}>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{height: 20, width: `${50 + rand(seed + i) * 45}%`, marginLeft: i % 2 ? 'auto' : 0, marginBottom: 18, borderRadius: 10, background: i % 2 ? color : '#E4DED2'}} />
    ))}
  </div>
);

export const S8One: React.FC<{f: number}> = ({f}) => {
  const btnAt = cf(47);
  const clickAt = cw(47, '新对话');
  const newAt = clickAt + 6;
  const blockAt = cf(48);
  const cur = prog(f, btnAt, 12, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(46)} x={80} y={60} enter="up">
        <Win w={540} h={400} title="对话 1 · 写文案">
          <Lines n={7} color={C.pink} seed={3} />
        </Win>
      </Pop>
      <Pop f={f} at={cf(46) + 8} x={110} y={490} rot={-2}>
        <Note color={C.pink} size={34}>一个对话只做一件事</Note>
      </Pop>
      <Pop f={f} at={btnAt} x={660} y={200}>
        <Card w={260} h={80} pad={0} bg={f >= clickAt && f < clickAt + 6 ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(36)}>＋ 新对话</div>
        </Card>
      </Pop>
      {f >= btnAt && f < newAt + 16 && (
        <div style={{position: 'absolute', left: lerp(900, 820, cur), top: lerp(460, 250, cur)}}>
          <Cursor down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      <Pop f={f} at={newAt} x={960} y={60} enter="right">
        <Win w={560} h={400} title="对话 2 · 改代码">
          <Lines n={3} color={C.tealLight} seed={9} />
        </Win>
      </Pop>
      {f >= blockAt && (
        <div style={{position: 'absolute', left: 640, top: 330, opacity: prog(f, blockAt, 8)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <div style={{...txt(26, C.inkSoft), background: '#E6E1D6', border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 10px'}}>旧内容</div>
            <div style={{width: 120 * prog(f, blockAt, 12, easeOut), height: 6, background: C.inkSoft, borderRadius: 3}} />
            <div style={bigText(36, C.inkSoft)}>▶</div>
          </div>
          <div style={{position: 'absolute', left: 90, top: -30}}>
            <Cross size={90} p={prog(f, blockAt + 10, 8)} />
          </div>
        </div>
      )}
      <Pop f={f} at={blockAt + 14} x={960} y={500} rot={3}>
        <div style={bigText(60, C.teal)}>不会被旧内容带偏</div>
      </Pop>
      <Burst f={f} at={blockAt + 16} x={1240} y={540} r={180} />
      <PiP f={f} at={cf(46) - 6} skin="detective" />
    </>
  );
};
export const S8Sfx: SfxCue[] = [
  ['paper', cf(46), 0.35],
  ['pop', cf(47), 0.3],
  ['click', cw(47, '新对话'), 0.45],
  ['whoosh', cw(47, '新对话') + 6, 0.3],
  ['error', cf(48) + 10, 0.3],
  ['ding', cf(48) + 14, 0.35],
];

/* ---------- S9 做法三：先总结要点，再带着总结开新对话 ---------- */
const POINTS = ['要做什么', '做到哪了', '要注意什么'];

export const S9Summary: React.FC<{f: number}> = ({f}) => {
  const sumAt = cf(50);
  const moveAt = cw(51, '开新');
  const move = prog(f, moveAt, 20, easeInOut);
  const cleanAt = cf(52);
  const keepAt = cf(53);
  return (
    <>
      <Pop f={f} at={cf(49)} x={60} y={40} enter="up">
        <div style={{opacity: 1 - 0.6 * prog(f, cleanAt, 12)}}>
          <Win w={540} h={540} title="聊了 200 轮……">
            <div style={{position: 'relative', height: 480, overflow: 'hidden'}}>
              {Array.from({length: 24}, (_, i) => {
                const y = ((i * 44 - f * 2) % (24 * 44) + 24 * 44) % (24 * 44) - 20;
                return <div key={i} style={{position: 'absolute', left: i % 2 ? 160 : 24, top: y, width: 180 + rand(i) * 170, height: 24, borderRadius: 12, background: i % 2 ? C.pink : '#E4DED2'}} />;
              })}
            </div>
          </Win>
        </div>
      </Pop>
      <Pop f={f} at={sumAt} x={lerp(640, 1110, move)} y={lerp(170, 150, move)} still>
        <Card w={400} h={290} bg="#FFF3B8">
          <div style={txt(38)}>要点总结</div>
          {POINTS.map((t, i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, opacity: prog(f, sumAt + 6 + i * 6, 6)}}>
              <Check size={40} />
              <div style={txt(34)}>{t}</div>
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={moveAt - 8} x={1080} y={60} enter="right">
        <div style={{width: 470, height: 440, border: `5px dashed ${C.teal}`, borderRadius: 24, boxSizing: 'border-box', padding: '14px 20px', ...txt(36, C.teal)}}>新对话</div>
      </Pop>
      <Pop f={f} at={cleanAt} x={620} y={560} rot={-3}>
        <div style={bigText(64, C.yellow)}>桌子收拾干净了！</div>
      </Pop>
      <Pop f={f} at={keepAt} x={1090} y={520} rot={2}>
        <Note color={C.tealLight} size={34}>只留最重要的几样</Note>
      </Pop>
      <Burst f={f} at={cleanAt + 4} x={900} y={600} r={200} />
      <PiP f={f} at={cf(49) - 6} skin="chef" eyes={f >= cleanAt ? 'happy' : 'open'} />
    </>
  );
};
export const S9Sfx: SfxCue[] = [
  ['whoosh', cf(49), 0.3],
  ['paper', cf(50), 0.35],
  ...POINTS.map((_, i) => ['ding', cf(50) + 6 + i * 6, 0.22] as SfxCue),
  ['whoosh', cw(51, '开新'), 0.35],
  ['magic', cf(52), 0.4],
  ['pop', cf(53), 0.3],
];

/* ---------- S10 结尾 ---------- */
export const S10Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(55);
  return (
    <>
      <Host f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(54)} x={0} y={60}>
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
export const S10Sfx: SfxCue[] = [
  ['pop', cf(54), 0.4],
  ['confetti', cf(55), 0.5],
  ['ding', cf(55) + 2, 0.3],
];
