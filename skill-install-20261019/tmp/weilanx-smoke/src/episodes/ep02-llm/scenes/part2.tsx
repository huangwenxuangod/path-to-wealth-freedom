import React from 'react';
import {easeInOut, easeOut, easeOutBack, keyframes, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Confetti} from '../../../library/fx';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross, Stamp, stampScale, ThumbUp} from '../../../library/icons';
import {FONT_CN} from '../../../library/fonts';
import {bigText, Card, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';
import {cf, cw} from '../cues';
import {Block, Chalkboard, CheeseMoon, Dice, Encyclopedia, Magnifier, StarIcon, TV} from '../../../library/items/objects';

/* ================= 7 一本正经地胡说八道 ================= */

export const L7Nonsense: React.FC<{f: number}> = ({f}) => {
  const point = keyframes(f, [[cf(26) + 4, 0], [cf(26) + 14, 1]]);
  const tap = Math.sin(f * 0.5) * 12;
  return (
    <>
      <Pop f={f} at={cf(26) - 6} x={50} y={40} enter="down">
        <Chalkboard w={720} h={470}>
          <div style={{fontFamily: FONT_CN, fontSize: 64, color: '#F3F1E8', lineHeight: 1.3}}>
            月球 =<br />一大块奶酪
          </div>
          <div style={{position: 'absolute', right: 20, top: 40}}>
            <CheeseMoon size={250} t={f} />
          </div>
          <div style={{position: 'absolute', left: 30, bottom: 18, fontFamily: FONT_CN, fontSize: 34, color: '#BFD8D2', opacity: prog(f, cw(27, '胡说八道') + 8, 8)}}>（信我，我去过）</div>
        </Chalkboard>
      </Pop>
      <Pop f={f} at={cw(27, '一本正经')} x={140} y={600} rot={-4}>
        <div style={{...txt(56), background: C.white, border: `4px solid ${C.ink}`, borderRadius: '28px 28px 8px 28px', padding: '8px 28px'}}>科学地讲……</div>
      </Pop>
      <div style={{position: 'absolute', left: 170, top: 780, transform: `scale(${stampScale(f, cw(27, '胡说八道'))}) rotate(-8deg)`, transformOrigin: 'left center'}}>
        {f >= cw(27, '胡说八道') && <Stamp text="胡说八道" size={80} />}
      </div>
      <Char f={f} x={860} y={1080} s={0.85} wear={['space']} eyes={f >= cw(27, '胡说八道') ? 'happy' : 'flat'} lookX={-1} arm={{tx: 560 + tap, ty: 260, ext: point}} />
      <Emote f={f} at={cw(27, '一本正经') + 4} kind="note" x={900} y={760} />
    </>
  );
};

export const L7Sfx: SfxCue[] = [
  ['whoosh', cf(26) - 6, 0.3],
  ['paper', cf(26) + 2, 0.35],
  ['pop', cw(27, '一本正经'), 0.4],
  ['stamp', cw(27, '胡说八道'), 0.6],
];

/* ================= 8 猜，不是查 → AI 幻觉 ================= */

/** 迷幻旋转放射背景，表现「幻觉」 */
const Swirl: React.FC<{f: number; at: number}> = ({f, at}) => {
  const o = prog(f, at, 12) * 0.35;
  if (o <= 0) return null;
  const n = 18;
  return (
    <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <g transform={`translate(540 800) rotate(${(f - at) * 2.2})`}>
        {Array.from({length: n}, (_, i) => {
          const a0 = (i / n) * Math.PI * 2;
          const a1 = ((i + 0.5) / n) * Math.PI * 2;
          return <path key={i} d={`M0 0 L${Math.cos(a0) * 1200} ${Math.sin(a0) * 1200} L${Math.cos(a1) * 1200} ${Math.sin(a1) * 1200} Z`} fill={['#8E8FE8', '#F2A0B4', C.yellow][i % 3]} />;
        })}
      </g>
    </svg>
  );
};

const Meter: React.FC<{label: string; value: number; color: string; text: string}> = ({label, value, color, text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22}}>
    <div style={{...txt(44), width: 250}}>{label}</div>
    <div style={{flex: 1, height: 56, border: `4px solid ${C.ink}`, borderRadius: 14, background: C.white, overflow: 'hidden'}}>
      <div style={{width: `${value * 100}%`, height: '100%', background: color}} />
    </div>
    <div style={{...txt(44), width: 130, textAlign: 'right'}}>{text}</div>
  </div>
);

export const L8Guess: React.FC<{f: number}> = ({f}) => {
  const guessAt = cw(28, '猜');
  const checkAt = cw(28, '查');
  const smooth = prog(f, cw(29, '听起来顺'), 18, easeOut);
  const truthAt = cw(31, '编的');
  const truth = f >= truthAt ? 0.12 + rand(Math.floor(f / 3)) * 0.18 : 0;
  const halluAt = cw(32, 'AI');
  const dizzy = f >= halluAt;
  return (
    <>
      <Swirl f={f} at={halluAt - 6} />
      <Pop f={f} at={guessAt - 4} x={60} y={20}>
        <Card w={450} h={300} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Dice size={130} rot={Math.sin(f * 0.3) * 20} />
          <div style={txt(64)}>在猜</div>
          <div style={{position: 'absolute', right: 20, top: 16}}>
            <Check size={80} p={prog(f, guessAt + 6, 10)} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={checkAt - 4} x={570} y={20}>
        <Card w={450} h={300} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Magnifier size={130} />
          <div style={txt(64, C.inkSoft)}>在查</div>
          <div style={{position: 'absolute', left: 70, top: 30}}>
            <Cross size={240} p={prog(f, checkAt + 4, 10)} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cw(29, '听起来顺') - 4} x={60} y={370} enter="up">
        <Card w={960} h={290} bg={C.white}>
          <Meter label="听起来顺不顺" value={smooth} color={C.teal} text={`${Math.round(smooth * 100)}%`} />
          {f >= cw(30, '头头是道') && <div style={{...txt(34, C.teal), marginLeft: 268, marginTop: 4}}>头头是道 ✦</div>}
          {f >= cf(31) - 4 && <Meter label="内容真不真" value={truth} color={C.red} text={f >= truthAt ? '???' : ''} />}
        </Card>
      </Pop>
      <FocusLines f={f} at={halluAt} out={halluAt + 40} x={430} y={830} />
      {dizzy && (
        <div style={{position: 'absolute', left: 430, top: 830, transform: `translate(-50%, -50%) scale(${stampScale(f, halluAt)}) rotate(-6deg)`}}>
          <div style={{...bigText(120, '#8E8FE8'), transform: `rotate(${Math.sin(f * 0.2) * 4}deg)`}}>AI 幻觉</div>
        </div>
      )}
      <Char f={f} x={880} y={1080} s={0.85} wear={['space']} eyes={dizzy ? 'spiral' : f >= truthAt ? 'wide' : 'open'} rot={dizzy ? Math.sin(f * 0.25) * 10 : 0} lookX={-0.6} />
      <Emote f={f} at={truthAt + 4} kind="sweat" x={960} y={870} />
    </>
  );
};

export const L8Sfx: SfxCue[] = [
  ['pop', cw(28, '猜') - 4, 0.4],
  ['ding', cw(28, '猜') + 6, 0.25],
  ['pop', cw(28, '查') - 4, 0.4],
  ['snip', cw(28, '查') + 4, 0.4],
  ['whoosh', cw(29, '听起来顺') - 4, 0.3],
  ['ding', cw(30, '头头是道'), 0.25],
  ['error', cw(31, '编的'), 0.35],
  ['magic', cw(32, 'AI') - 6, 0.4],
  ['stamp', cw(32, 'AI'), 0.6],
  ['boing', cw(32, 'AI') + 6, 0.3],
];

/* ================= 9 一句话记住 ================= */

export const L9Remember: React.FC<{f: number}> = ({f}) => {
  const bookAt = cw(34, '百科全书');
  const masterAt = cw(35, '接龙高手');
  return (
    <>
      <Pop f={f} at={cf(33) - 4} x={540} y={70} center>
        <div style={bigText(100, C.yellow)}>一句话记住</div>
      </Pop>
      <Pop f={f} at={cf(34) - 2} x={540} y={200} center>
        <div style={txt(60)}>大模型……</div>
      </Pop>
      <Pop f={f} at={bookAt - 6} x={60} y={280}>
        <Card w={440} h={560} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Encyclopedia size={220} />
          <div style={{...txt(56), marginTop: 14}}>百科全书</div>
          <div style={{position: 'absolute', left: 60, top: 100}}>
            <Cross size={320} p={prog(f, bookAt + 8, 10)} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(35)} x={560} y={280}>
        <Card w={460} h={560} bg="#FFF3B8" style={{position: 'relative'}}>
          <div style={{...txt(46), textAlign: 'center', whiteSpace: 'normal'}}>超级会接话的</div>
          <div style={{...txt(60), textAlign: 'center', marginTop: 4}}>接龙高手</div>
          <div style={{position: 'absolute', right: 16, top: 150}}>
            <Check size={90} p={prog(f, masterAt + 4, 10)} />
          </div>
        </Card>
      </Pop>
      {f >= cf(35) && <Char f={f} x={790} y={805} s={0.85} wear={['crown']} eyes={f >= masterAt ? 'star' : 'happy'} armsUp={f >= masterAt ? 0.8 : 0.2} />}
      <Burst f={f} at={masterAt + 4} x={790} y={640} r={200} n={14} />
    </>
  );
};

export const L9Sfx: SfxCue[] = [
  ['pop', cf(33) - 4, 0.5],
  ['pop', cw(34, '百科全书') - 6, 0.4],
  ['snip', cw(34, '百科全书') + 8, 0.45],
  ['pop', cf(35), 0.4],
  ['magic', cw(35, '接龙高手'), 0.4],
];

/* ================= 10 偷偷告诉你：token ================= */

const TOKENS = [
  {t: '床前', color: '#9FE3D2'},
  {t: '明月', color: '#CBBDF2'},
  {t: '光', color: C.yellow},
];

export const L10Token: React.FC<{f: number}> = ({f}) => {
  const splitAt = cw(38, 'token');
  const split = prog(f, splitAt, 14, easeOutBack);
  const lean = keyframes(f, [[cf(36), 0], [cf(36) + 8, 1], [cf(38), 1], [cf(38) + 10, 0]], easeInOut);
  return (
    <>
      <Pop f={f} at={cf(37)} x={60} y={40}>
        <Card w={960} h={360} bg={C.white} style={{position: 'relative'}}>
          <div style={{...txt(40, C.inkSoft)}}>它猜的其实不是「字」，而是……</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', gap: lerp(0, 40, split)}}>
            {TOKENS.map((k, i) => (
              <div key={k.t} style={{transform: `translateY(${Math.sin(split * Math.PI) * (i - 1) * -30}px) rotate(${(i - 1) * 6 * split}deg)`, textAlign: 'center'}}>
                <Block text={k.t} size={110} color={split > 0 ? k.color : C.white} dashed={split > 0.5} />
                <div style={{...txt(34, C.teal), marginTop: 10, opacity: prog(f, splitAt + 10 + i * 4, 8)}}>token</div>
              </div>
            ))}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={splitAt + 6} x={540} y={430} center>
        <div style={bigText(90, C.teal)}>token</div>
      </Pop>
      <Pop f={f} at={cf(39)} x={60} y={520} enter="up">
        <div style={{position: 'relative'}}>
          <TV w={480} t={f}>
            <div style={{position: 'relative', textAlign: 'center'}}>
              {f < cw(40, '长什么样') ? (
                <div style={txt(56, C.white)}>下期预告</div>
              ) : (
                <div style={{fontFamily: 'monospace', fontSize: 34, color: '#9FE3D2', lineHeight: 1.2}}>
                  {Array.from({length: 3}, (_, r) => (
                    <div key={r}>{Array.from({length: 8}, (_, c) => (rand(r * 8 + c + Math.floor(f / 4)) > 0.5 ? '1' : '0')).join('')}</div>
                  ))}
                </div>
              )}
            </div>
          </TV>
          <div style={{position: 'absolute', left: 110, top: 420, ...txt(44)}}>AI 眼里的字长啥样？</div>
        </div>
      </Pop>
      <Pop f={f} at={cw(36, '偷偷')} out={cf(38) + 6} x={600} y={560} rot={4}>
        <div style={{...txt(52), background: C.white, border: `4px dashed ${C.ink}`, borderRadius: 30, padding: '8px 28px'}}>嘘……偷偷告诉你</div>
      </Pop>
      <Char f={f} x={840} y={1080} s={0.85} wear={['sunglasses']} eyes="open" rot={-10 * lean} lookX={-0.8} />
      <Emote f={f} at={cw(40, '长什么样')} kind="?" x={840} y={870} />
    </>
  );
};

export const L10Sfx: SfxCue[] = [
  ['whoosh', cf(36) - 4, 0.3],
  ['pop', cw(36, '偷偷'), 0.35],
  ['pop', cf(37), 0.4],
  ['snip', cw(38, 'token'), 0.45],
  ['magic', cw(38, 'token') + 6, 0.35],
  ['pop', cf(39), 0.4],
  ['shake', cw(40, '长什么样'), 0.2],
  ['question', cw(40, '长什么样') + 4, 0.35],
];

/* ================= 11 点赞收藏关注，下期再见 ================= */

const BUTTONS = [
  {label: '点赞', done: '已赞', key: '点赞', x: 50, bg: '#FFD9D6'},
  {label: '收藏', done: '已收藏', key: '收藏', x: 385, bg: '#FFF3B8'},
  {label: '关注', done: '已关注', key: '关注', x: 720, bg: '#BFE7DF'},
];

export const L11Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cw(42, '下期再见');
  const presses = BUTTONS.map((b) => cw(41, b.key));
  const active = presses.findIndex((t) => f >= t - 5 && f < t + 6);
  const arm = active >= 0 ? {tx: BUTTONS[active].x + 150, ty: 585, ext: Math.min(prog(f, presses[active] - 5, 5), 1 - prog(f, presses[active] + 2, 5))} : null;
  const wave = f >= byeAt ? 0.5 + 0.5 * Math.abs(Math.sin((f - byeAt) * 0.35)) : 0.2;
  return (
    <>
      {BUTTONS.map((b, i) => {
        const done = f >= presses[i];
        const press = 1 - Math.sin(prog(f, presses[i], 8) * Math.PI) * 0.12;
        return (
          <Pop key={b.key} f={f} at={cf(41) - 6 + i * 3} x={b.x} y={520} enter="up">
            <div style={{transform: `scale(${press})`}}>
              <Card w={310} h={130} pad={0} bg={done ? b.bg : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                {i === 0 ? <ThumbUp size={70} fill={done ? C.red : C.white} /> : i === 1 ? <StarIcon size={70} fill={done ? C.yellow : C.white} /> : done ? <Check size={60} color={C.ink} /> : <div style={txt(64)}>+</div>}
                <div style={txt(50)}>{done ? b.done : b.label}</div>
              </Card>
            </div>
          </Pop>
        );
      })}
      {BUTTONS.map((_, i) => (
        <Burst key={i} f={f} at={presses[i]} x={BUTTONS[i].x + 155} y={585} r={120} />
      ))}
      <Pop f={f} at={byeAt} x={540} y={220} center rot={-4}>
        <div style={bigText(130, C.yellow)}>下期再见！</div>
      </Pop>
      <Char f={f} x={540} y={1080} s={1.0} wear={['santa']} eyes={f >= byeAt ? 'happy' : 'open'} armsUp={arm ? 0 : wave} arm={arm} lookX={arm ? (active === 0 ? -1 : active === 2 ? 1 : 0) : 0} />
      <div style={{position: 'absolute', left: 0, top: -270, width: 1080, height: 1920, pointerEvents: 'none'}}>
        <Confetti t={f - byeAt} w={1080} h={1920} n={90} />
      </div>
    </>
  );
};

export const L11Sfx: SfxCue[] = [
  ...BUTTONS.flatMap((b) => [['click', cw(41, b.key), 0.55], ['pop', cw(41, b.key) + 2, 0.4]] as SfxCue[]),
  ['confetti', cw(42, '下期再见'), 0.5],
  ['ding', cw(42, '下期再见') + 2, 0.3],
];
