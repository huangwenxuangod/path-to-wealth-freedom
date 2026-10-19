import React from 'react';
import {easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, Trash} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {HostTall, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {PIP} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- T6 管好这张桌子：三个做法 ---------- */
const TIPS = ['把需要的东西主动放上去', '一个对话只做一件事', '总结要点，再开新对话'];

export const T6Tips: React.FC<{f: number}> = ({f}) => (
  <HostTall f={f} skin="cowboy" eyes="happy" armsUp={f >= cw(39, '管好') && f < cw(39, '管好') + 24 ? 0.8 : 0}>
    <Pop f={f} at={cf(38)} x={0} y={0}>
      <Note color={C.panel} size={40}>用好上下文</Note>
    </Pop>
    <Pop f={f} at={cw(39, '管好')} x={0} y={70} rot={-2}>
      <div style={bigText(96, C.yellow)}>= 管好这张桌子</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cf(40) + 8 + i * 6} x={i * 20} y={200 + i * 60} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '2px 16px 2px 6px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
          <div style={{...txt(30, C.white), width: 44, height: 44, borderRadius: 22, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(38)}>{t}</div>
        </div>
      </Pop>
    ))}
  </HostTall>
);
export const T6Sfx: SfxCue[] = [
  ['pop', cf(38), 0.3],
  ['ding', cw(39, '管好'), 0.4],
  ...TIPS.map((_, i) => ['click', cf(40) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- T7 做法一：把它需要的东西主动放上去 ---------- */
const CHIPS = [
  {k: '目标读者', v: '刚入门的新手', at: () => cw(43, '目标'), color: C.tealLight},
  {k: '想要的风格', v: '轻松、口语化', at: () => cw(43, '风格'), color: '#FFF3B8'},
  {k: '满意的例子', v: '附上一段喜欢的文案', at: () => cw(44, '例子'), color: C.pink},
];

export const T7Give: React.FC<{f: number}> = ({f}) => {
  const guessAt = cf(45);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          主动把东西<span style={{color: C.yellow}}>放上桌</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(41)} x={60} y={150} enter="up">
        <Win w={960} h={500} title="发给 AI 的消息">
          <div style={{padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{...txt(46), opacity: prog(f, cf(42), 8)}}>帮我改一下这段文案</div>
            {CHIPS.map((c) => {
              const at = c.at();
              if (f < at) return <div key={c.k} style={{height: 80}} />;
              const p = prog(f, at, 10, easeOut);
              return (
                <div key={c.k} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateX(${(1 - p) * -120}px) scale(${1 + 0.15 * (1 - prog(f, at + 6, 8))})`, transformOrigin: 'left center'}}>
                  <Check size={56} />
                  <div style={{...txt(44), background: c.color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 18px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{c.k}</div>
                  <div style={txt(36, C.inkSoft)}>{c.v}</div>
                </div>
              );
            })}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(44) + 20} x={60} y={670}>
        <Note color={C.panel} size={28}>示例内容</Note>
      </Pop>
      <Char f={f} x={200} y={1060} s={0.75} kind="bot" eyes={f >= guessAt ? 'spiral' : 'happy'} lookX={0.4} />
      <Pop f={f} at={guessAt} x={330} y={740}>
        <div style={{position: 'relative'}}>
          <Card w={460} h={130} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(44)}>你心里想的是……？</div>
          </Card>
          {f >= guessAt + 12 && <div style={{position: 'absolute', left: 170, top: 10}}><Cross size={110} p={prog(f, guessAt + 12, 8)} /></div>}
        </div>
      </Pop>
      <FocusLines f={f} at={guessAt + 18} out={guessAt + 44} x={560} y={960} />
      <Pop f={f} at={guessAt + 18} x={330} y={900} rot={-5}>
        <div style={bigText(96, C.red)}>它不会猜！</div>
      </Pop>
      <Emote f={f} at={guessAt + 4} kind="sweat" x={320} y={880} />
      <PiP f={f} at={cf(41) - 6} skin="santa" {...PIP} />
    </>
  );
};
export const T7Sfx: SfxCue[] = [
  ['paper', cf(41), 0.35],
  ['type', cf(42), 0.3],
  ...CHIPS.map((c) => ['pop', c.at(), 0.4] as SfxCue),
  ['question', cf(45), 0.3],
  ['error', cf(45) + 12, 0.4],
  ['boing', cf(45) + 18, 0.35],
];

/* ---------- T8 做法二：一个对话只做一件事 ---------- */
const Lines: React.FC<{n: number; color: string; seed: number}> = ({n, color, seed}) => (
  <div style={{padding: '18px 24px'}}>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{height: 22, width: `${45 + rand(seed + i) * 45}%`, marginLeft: i % 2 ? 'auto' : 0, marginBottom: 18, borderRadius: 11, background: i % 2 ? color : '#E4DED2'}} />
    ))}
  </div>
);

export const T8One: React.FC<{f: number}> = ({f}) => {
  const btnAt = cf(47);
  const clickAt = cw(47, '新对话');
  const newAt = clickAt + 6;
  const blockAt = cf(48);
  const cur = prog(f, btnAt, 12, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(46)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          一个对话，只做<span style={{color: C.yellow}}>一件事</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(46)} x={60} y={150} enter="left">
        <Win w={620} h={300} title="对话 1 · 写文案">
          <Lines n={5} color={C.pink} seed={3} />
        </Win>
      </Pop>
      <Pop f={f} at={btnAt} x={700} y={240}>
        <Card w={320} h={100} pad={0} bg={f >= clickAt && f < clickAt + 6 ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(46)}>＋ 新对话</div>
        </Card>
      </Pop>
      {f >= btnAt && f < newAt + 16 && (
        <div style={{position: 'absolute', left: lerp(980, 860, cur), top: lerp(460, 300, cur), transform: 'scale(1.5)'}}>
          <Cursor down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      <Pop f={f} at={newAt} x={400} y={560} enter="right">
        <Win w={620} h={300} title="对话 2 · 改代码">
          <Lines n={3} color={C.tealLight} seed={9} />
        </Win>
      </Pop>
      {f >= blockAt && (
        <div style={{position: 'absolute', left: 150, top: 480, opacity: prog(f, blockAt, 8)}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            <div style={{...txt(34, C.inkSoft), background: '#E6E1D6', border: `4px solid ${C.ink}`, borderRadius: 12, padding: '4px 14px'}}>旧内容</div>
            <div style={{width: 8, height: 150 * prog(f, blockAt, 12, easeOut), background: C.inkSoft, borderRadius: 4}} />
            <div style={bigText(44, C.inkSoft)}>▼</div>
          </div>
          <div style={{position: 'absolute', left: -10, top: 70}}><Cross size={130} p={prog(f, blockAt + 10, 8)} /></div>
        </div>
      )}
      <FocusLines f={f} at={blockAt + 14} out={blockAt + 40} x={540} y={940} />
      <Pop f={f} at={blockAt + 14} x={60} y={890} rot={-3}>
        <div style={bigText(80, C.teal)}>不会被旧内容带偏</div>
      </Pop>
      <Burst f={f} at={blockAt + 16} x={400} y={940} r={220} />
      <PiP f={f} at={cf(46) - 6} skin="detective" {...PIP} />
    </>
  );
};
export const T8Sfx: SfxCue[] = [
  ['paper', cf(46), 0.35],
  ['pop', cf(47), 0.3],
  ['click', cw(47, '新对话'), 0.5],
  ['whoosh', cw(47, '新对话') + 6, 0.35],
  ['error', cf(48) + 10, 0.35],
  ['ding', cf(48) + 14, 0.4],
];

/* ---------- T9 做法三：先总结要点，再带着总结开新对话 ---------- */
const POINTS = ['要做什么', '做到哪了', '要注意什么'];

export const T9Summary: React.FC<{f: number}> = ({f}) => {
  const sumAt = cf(50);
  const moveAt = cw(51, '开新');
  const move = prog(f, moveAt, 20, easeInOut);
  const cleanAt = cf(52);
  const keepAt = cf(53);
  const trash = prog(f, cleanAt, 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(49)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          聊太长？<span style={{color: C.yellow}}>先总结</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(49)} x={60} y={150} enter="up">
        <div style={{transform: `translate(${trash * 520}px, ${trash * 520}px) scale(${1 - 0.8 * trash}) rotate(${trash * 25}deg)`, transformOrigin: 'center', opacity: 1 - prog(f, cleanAt + 12, 6)}}>
          <Win w={520} h={560} title="聊了 200 轮……">
            <div style={{position: 'relative', height: 500, overflow: 'hidden'}}>
              {Array.from({length: 24}, (_, i) => {
                const y = ((i * 44 - f * 2.5) % (24 * 44) + 24 * 44) % (24 * 44) - 20;
                return <div key={i} style={{position: 'absolute', left: i % 2 ? 150 : 22, top: y, width: 170 + rand(i) * 170, height: 24, borderRadius: 12, background: i % 2 ? C.pink : '#E4DED2'}} />;
              })}
            </div>
          </Win>
        </div>
      </Pop>
      <Pop f={f} at={cleanAt - 8} x={800} y={600}>
        <Trash size={200} lid={prog(f, cleanAt, 8) * (1 - prog(f, cleanAt + 20, 8))} />
      </Pop>
      <Pop f={f} at={sumAt} x={lerp(600, 280, move)} y={lerp(200, 560, move)} still>
        <div style={{transform: `scale(${1 + 0.12 * Math.sin(move * Math.PI)}) rotate(${-3 + 3 * move}deg)`}}>
          <Card w={420} h={300} bg="#FFF3B8">
            <div style={txt(44)}>要点总结</div>
            {POINTS.map((t, i) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, opacity: prog(f, sumAt + 6 + i * 6, 6)}}>
                <Check size={44} />
                <div style={txt(38)}>{t}</div>
              </div>
            ))}
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={moveAt - 8} x={220} y={500} enter="up">
        <div style={{width: 540, height: 420, border: `6px dashed ${C.teal}`, borderRadius: 26, boxSizing: 'border-box', padding: '10px 22px', ...txt(40, C.teal), background: 'rgba(191,231,223,0.3)'}}>新对话</div>
      </Pop>
      <FocusLines f={f} at={cleanAt + 10} out={cleanAt + 40} x={540} y={960} />
      <Pop f={f} at={cleanAt + 10} x={40} y={930} rot={-3}>
        <div style={bigText(76, C.yellow)}>桌子收拾干净了！</div>
      </Pop>
      <Pop f={f} at={keepAt} x={620} y={160} rot={3}>
        <Note color={C.tealLight} size={40}>只留最重要的几样</Note>
      </Pop>
      <Burst f={f} at={cleanAt + 12} x={540} y={960} r={240} />
      <PiP f={f} at={cf(49) - 6} skin="chef" eyes={f >= cleanAt ? 'happy' : 'open'} {...PIP} />
    </>
  );
};
export const T9Sfx: SfxCue[] = [
  ['whoosh', cf(49), 0.3],
  ['paper', cf(50), 0.4],
  ...POINTS.map((_, i) => ['ding', cf(50) + 6 + i * 6, 0.22] as SfxCue),
  ['whoosh', cw(51, '开新'), 0.4],
  ['shake', cf(52), 0.3],
  ['magic', cf(52) + 10, 0.45],
  ['pop', cf(53), 0.3],
];

/* ---------- T10 结尾 ---------- */
export const T10Bye: React.FC<{f: number}> = ({f}) => {
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
export const T10Sfx: SfxCue[] = [
  ['pop', cf(54), 0.4],
  ['confetti', cf(55), 0.5],
  ['ding', cf(55) + 2, 0.3],
];

