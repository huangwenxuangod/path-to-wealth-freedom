import React from 'react';
import {easeInOut, easeOut, easeOutBack, lerp, prog} from '../../../library/anim';
import type {PhoneScene} from '../lib/state';
import {FPS, GEO, T} from '../lib/timeline';
import {C, FONT_SIGN, FONT_UI} from '../../../library/theme';
import {BuddyFigure} from '../../../library/character/BuddyFigure';
import {Confetti} from '../../../library/fx';
import {Phone} from './Phone';

const s = (sec: number) => Math.round(sec * FPS);

// 片尾手机里循环播放成片
const REEL: [number, PhoneScene][] = [
  [T.outro, 'coffee'],
  [s(24.8), 'dance'],
  [s(25.6), 'cat'],
  [T.nailedIt, 'dance'],
];

const BEAT = 15; // 120BPM 下一拍 = 15 帧

const SocialOverlay: React.FC<{frame: number; k: number}> = ({frame, k}) => {
  const likes = lerp(0, 98.3, prog(frame, s(24.4), s(2.6), easeOut));
  const heartPop = 1 + Math.sin(prog(frame % BEAT, 0, 6) * Math.PI) * 0.12;
  const txt = {fontFamily: FONT_UI, color: C.white, WebkitTextStroke: `${2 * k}px ${C.ink}`, paintOrder: 'stroke fill' as const, textAlign: 'center' as const};
  return (
    <>
      <div style={{position: 'absolute', right: 20 * k, top: 150 * k, width: 70 * k, ...txt}}>
        <svg width={52 * k} height={48 * k} viewBox="0 0 52 48" style={{transform: `scale(${heartPop})`}}>
          <path d="M26 44 C10 32 3 24 3 14 A11 11 0 0 1 26 10 A11 11 0 0 1 49 14 C49 24 42 32 26 44 Z" fill={C.red} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        </svg>
        <div style={{fontSize: 22 * k}}>{likes.toFixed(1)}K</div>
        <svg width={44 * k} height={40 * k} viewBox="0 0 44 40" style={{marginTop: 10 * k}}>
          <path d="M6 4 H38 A4 4 0 0 1 42 8 V26 A4 4 0 0 1 38 30 H18 L8 38 V30 H6 A4 4 0 0 1 2 26 V8 A4 4 0 0 1 6 4 Z" fill={C.white} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        </svg>
        <div style={{fontSize: 22 * k}}>2.1K</div>
      </div>
      <div style={{position: 'absolute', left: 22 * k, bottom: 24 * k, ...txt, textAlign: 'left'}}>
        <div style={{fontSize: 28 * k}}>@claude</div>
        <div style={{fontSize: 20 * k}}>#editing #beatsync</div>
      </div>
    </>
  );
};

export const Outro: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.outro) return null;
  const f = frame;
  const fade = prog(f, T.outro, 20, easeInOut);

  // 手机从编辑器里的位置放大到画面中央
  const p = prog(f, T.outro, 22, easeInOut);
  const from = GEO.phone;
  const to = {x: 705, y: 78, w: 470, h: 832};
  const ph = {x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p), w: lerp(from.w, to.w, p), h: lerp(from.h, to.h, p)};
  const k = ph.w / 282;
  const beatBounce = f > T.outro + 22 ? Math.sin(prog(f % BEAT, 0, 5) * Math.PI) * 0.012 : 0;

  let cur = REEL[0];
  for (const r of REEL) if (f >= r[0]) cur = r;
  const nailed = f >= T.nailedIt;
  const caption = nailed
    ? {words: ['NAILED', 'IT!'], t: f - T.nailedIt, size: 92, color: C.yellow, bottom: 0.3, wrap: true}
    : {words: ['WAIT', 'FOR', 'IT'], t: f - s(24.3), size: 60};

  // 落款
  const line1 = prog(f, T.signature, 12, easeOut);
  const write = prog(f, T.signName, 22, easeInOut);
  const line3 = prog(f, T.signOff, 12, easeOut);

  // 片尾小人
  const walkIn = prog(f, s(24.2), 24, easeOut);
  const bx = lerp(2150, 1470, walkIn);
  const walking = walkIn > 0 && walkIn < 1;
  const cheer = prog(f, s(25.1), 8, easeOutBack);
  const hop = walkIn >= 1 ? Math.abs(Math.sin((f / BEAT) * Math.PI)) * 22 : 0;

  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: C.paper, opacity: fade * 0.72}} />
      <Phone
        x={ph.x}
        y={ph.y}
        w={ph.w * (1 + beatBounce)}
        h={ph.h * (1 + beatBounce)}
        scene={cur[1]}
        sceneT={f - cur[0]}
        frame={f}
        sparkle={0.7}
        caption={caption}
        overlay={p >= 1 ? <SocialOverlay frame={f} k={k * 0.6} /> : null}
      />
      <div style={{position: 'absolute', left: 150, top: 350, fontFamily: FONT_UI, fontSize: 46, color: C.ink, opacity: line1, transform: `translateY(${(1 - line1) * 20}px)`}}>
        made in 30 seconds by
      </div>
      <div style={{position: 'absolute', left: 140, top: 395, clipPath: `inset(-20% ${(1 - write) * 100}% -20% -5%)`}}>
        <div style={{fontFamily: FONT_SIGN, fontSize: 190, color: C.ink, lineHeight: 1.1, transform: 'rotate(-4deg)'}}>Claude</div>
        <svg width={520} height={40} style={{display: 'block', marginTop: -18}}>
          <path d="M8 26 C 120 8, 300 6, 510 18" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 200, top: 660, fontFamily: FONT_UI, fontSize: 34, color: C.inkSoft, opacity: line3}}>
        — signing off <span style={{color: C.yellow, WebkitTextStroke: `1.5px ${C.ink}`}}>✦</span>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {walkIn > 0 && (
          <>
            <g stroke={C.ink} strokeWidth={3} strokeLinecap="round" opacity={walkIn}>
              {[-230, -170, -60, 30, 120, 200, 250].map((dx, i) => (
                <line key={i} x1={bx + dx} y1={962} x2={bx + dx + 18} y2={950 - (i % 3) * 4} />
              ))}
              <line x1={bx - 250} y1={962} x2={bx + 270} y2={962} />
            </g>
            <g transform={`translate(${bx} ${960 - hop}) scale(1.9)`}>
              <BuddyFigure eyes={cheer > 0.5 ? 'happy' : 'open'} walk={walking ? f * 0.55 : 0} armsUp={cheer} blush={cheer > 0.5} lookX={walking ? -1 : 0} stroke={3.5 / 1.9 * 1.6} />
            </g>
          </>
        )}
      </svg>
      <Confetti t={f - T.confetti} />
    </>
  );
};
