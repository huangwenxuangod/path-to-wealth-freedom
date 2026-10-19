import React from 'react';
import {boil, easeOut, easeOutElastic, prog, rand} from './anim';
import {C, popTextStyle} from './theme';
import {FONT_CN} from './fonts';

// 竖屏默认尺寸；横屏视频会显式传入 w/h
const W = 1080;
const H = 1920;

/** 米白点阵纸背景 */
export const DotPaper: React.FC<{f: number; w?: number; h?: number}> = ({w = W, h = H}) => (
  <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <pattern id="dots" width="54" height="54" patternUnits="userSpaceOnUse">
        <circle cx="27" cy="27" r="2.6" fill="#D9CFBE" />
      </pattern>
    </defs>
    <rect width={w} height={h} fill={C.paper} />
    <rect width={w} height={h} fill="url(#dots)" />
  </svg>
);

const PALETTE = [C.yellow, C.teal, '#F2A0B4', '#8E8FE8', C.orange];

/* ---------------- 漂浮涂鸦背景 ---------------- */

type Doodle = 'sparkle' | 'cloud' | 'squiggle' | 'dot' | 'ring' | 'plus';
const KINDS: Doodle[] = ['sparkle', 'cloud', 'squiggle', 'dot', 'ring', 'plus', 'sparkle', 'dot'];

const DoodleShape: React.FC<{kind: Doodle; color: string; s: number}> = ({kind, color, s}) => {
  const st = {stroke: C.ink, strokeWidth: 3 / s, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  switch (kind) {
    case 'sparkle':
      return <path d="M0 -20 Q0 0 20 0 Q0 0 0 20 Q0 0 -20 0 Q0 0 0 -20 Z" fill={color} {...st} />;
    case 'cloud':
      return <path d="M-28 10 Q-34 -6 -18 -8 Q-14 -24 2 -18 Q14 -28 22 -12 Q36 -10 30 10 Z" fill={C.white} {...st} />;
    case 'squiggle':
      return <path d="M-26 0 Q-18 -12 -9 0 T9 0 T26 0" fill="none" {...st} stroke={color} strokeWidth={6 / s} />;
    case 'dot':
      return <circle r={9} fill={color} {...st} />;
    case 'ring':
      return <circle r={13} fill="none" {...st} stroke={color} strokeWidth={6 / s} />;
    case 'plus':
      return <path d="M-12 0 H12 M0 -12 V12" fill="none" {...st} stroke={color} strokeWidth={7 / s} />;
  }
};

/** 点阵纸 + 缓慢漂浮的小涂鸦（避开字幕条附近，确定性随机） */
export const DoodlePaper: React.FC<{f: number; w?: number; h?: number}> = ({f, w = W, h = H}) => (
  <>
    <DotPaper f={f} w={w} h={h} />
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: 0.55}}>
      {Array.from({length: 26}, (_, i) => {
        const kind = KINDS[i % KINDS.length];
        const speed = 0.25 + rand(i + 11) * 0.45;
        const y = ((rand(i + 3) * (h + 200) - f * speed) % (h + 200) + h + 200) % (h + 200) - 100;
        const x = rand(i + 7) * w + Math.sin(f * 0.01 + i) * 30;
        const s = 0.8 + rand(i + 19) * 0.9;
        const rot = f * (rand(i + 23) - 0.5) * 0.8;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
            <DoodleShape kind={kind} color={PALETTE[i % PALETTE.length]} s={s} />
          </g>
        );
      })}
    </svg>
  </>
);

/* ---------------- 星光迸发 ---------------- */

/** 元素弹出时的放射线 + 小星星，14 帧内扩散消失 */
export const Burst: React.FC<{f: number; at: number; x: number; y: number; r?: number; color?: string; n?: number}> = ({f, at, x, y, r = 110, color = C.yellow, n = 10}) => {
  const p = prog(f, at, 16, easeOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + at;
        const r0 = r * (0.35 + p * 0.6);
        const r1 = r * (0.55 + p * 0.75);
        const sx = x + Math.cos(a) * r1 * 1.1;
        const sy = y + Math.sin(a) * r1 * 1.1;
        return (
          <g key={i} opacity={1 - p}>
            {i % 2 ? (
              <path d={`M${sx} ${sy - 9} Q${sx} ${sy} ${sx + 9} ${sy} Q${sx} ${sy} ${sx} ${sy + 9} Q${sx} ${sy} ${sx - 9} ${sy} Q${sx} ${sy} ${sx} ${sy - 9} Z`} fill={color} stroke={C.ink} strokeWidth={2} />
            ) : (
              <line x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------- 情绪气泡 ---------------- */

export type EmoteKind = '!' | '?' | 'heart' | 'sweat' | 'zzz' | 'note' | 'idea' | 'anger';

/** 角色头顶冒出来的小反应，会上浮并淡出 */
export const Emote: React.FC<{f: number; at: number; kind: EmoteKind; x: number; y: number; dur?: number}> = ({f, at, kind, x, y, dur = 40}) => {
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const pin = prog(t, 0, 8, easeOut);
  const pout = prog(t, dur - 10, 10);
  const float = -t * 0.8;
  const wobble = Math.sin(t * 0.3) * 8;
  const base: React.CSSProperties = {position: 'absolute', left: x, top: y + float, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * pin}) rotate(${wobble}deg)`, opacity: 1 - pout, pointerEvents: 'none'};
  const big = (s: string, color: string) => (
    <div style={{...base, fontFamily: FONT_CN, fontSize: 100, color, WebkitTextStroke: `5px ${C.ink}`, paintOrder: 'stroke fill'}}>{s}</div>
  );
  switch (kind) {
    case '!':
      return big('!', C.yellow);
    case '?':
      return big('?', C.white);
    case 'zzz':
      return <div style={{...base, fontFamily: FONT_CN, fontSize: 56, color: C.ink}}>z z Z</div>;
    case 'note':
      return <div style={{...base, fontSize: 70, color: C.ink, fontFamily: 'serif'}}>♪ ♫</div>;
    case 'heart':
      return (
        <div style={base}>
          <svg width={80} height={72} viewBox="0 0 52 48">
            <path d="M26 44 C10 32 3 24 3 14 A11 11 0 0 1 26 10 A11 11 0 0 1 49 14 C49 24 42 32 26 44 Z" fill={C.red} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'sweat':
      return (
        <div style={base}>
          <svg width={50} height={70} viewBox="0 0 40 60">
            <path d="M20 4 Q36 32 20 54 Q4 32 20 4 Z" fill="#8FC7F0" stroke={C.ink} strokeWidth={3} />
          </svg>
        </div>
      );
    case 'idea':
      return (
        <div style={base}>
          <svg width={90} height={110} viewBox="0 0 100 124">
            <path d="M50 8 A38 38 0 0 1 72 78 V92 H28 V78 A38 38 0 0 1 50 8 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
            <rect x="32" y="96" width="36" height="16" rx="4" fill="#C9C2B4" stroke={C.ink} strokeWidth={5} />
          </svg>
        </div>
      );
    case 'anger':
      return (
        <div style={base}>
          <svg width={70} height={70} viewBox="0 0 60 60">
            <path d="M8 22 Q22 22 22 8 M38 8 Q38 22 52 22 M52 38 Q38 38 38 52 M22 52 Q22 38 8 38" fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};

/* ---------------- 速度线 ---------------- */

/** 以 (x,y) 为中心的放射状集中线，漫画里表现「震惊」 */
export const FocusLines: React.FC<{f: number; at: number; out: number; x: number; y: number}> = ({f, at, out, x, y}) => {
  if (f < at || f > out) return null;
  const o = Math.min(prog(f, at, 6), 1 - prog(f, out - 6, 6)) * 0.35;
  return (
    <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, opacity: o, pointerEvents: 'none', overflow: 'visible'}}>
      {Array.from({length: 40}, (_, i) => {
        const a = (i / 40) * Math.PI * 2 + rand(i + Math.floor(f / 3)) * 0.05;
        const r0 = 330 + rand(i * 7 + Math.floor(f / 3)) * 120;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * 1600} y2={y + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 2} />;
      })}
    </svg>
  );
};

/* ---------------- 弹字、彩纸、纸张颗粒 ---------------- */

/** 卡通弹字：SNIP! / SHAKE: MAX */
export const PopText: React.FC<{text: string; x: number; y: number; t: number; dur: number; size: number; fill: string; rot?: number; jitter?: number}> = ({
  text, x, y, t, dur, size, fill, rot = -8, jitter = 0,
}) => {
  if (t < 0 || t > dur) return null;
  const inS = easeOutElastic(prog(t, 0, 14));
  const out = 1 - prog(t, dur - 6, 6);
  const jx = jitter ? boil(t * 4, 31, jitter) : 0;
  const jy = jitter ? boil(t * 4, 32, jitter) : 0;
  return (
    <div style={{position: 'absolute', left: x + jx, top: y + jy, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${inS * (0.6 + 0.4 * out)})`, opacity: out, ...popTextStyle(size, fill)}}>
      {text}
    </div>
  );
};

const COLORS = [C.yellow, C.teal, '#F2A0B4', '#8E8FE8', C.orange, C.red];

/** 屏幕坐标的彩纸，确定性随机 */
export const Confetti: React.FC<{t: number; n?: number; w?: number; h?: number}> = ({t, n = 110, w = 1920, h = 1080}) => {
  if (t < 0) return null;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: n}, (_, i) => {
        const delay = rand(i + 1) * 20;
        const lt = t - delay;
        if (lt < 0) return null;
        const x0 = rand(i + 101) * w;
        const vy = 5 + rand(i + 201) * 6;
        const y = -40 - rand(i + 301) * 200 + lt * vy;
        if (y > h + 40) return null;
        const x = x0 + Math.sin(lt * 0.08 + i) * 40;
        const rot = lt * (4 + rand(i + 401) * 8) * (i % 2 ? 1 : -1);
        const flip = Math.abs(Math.cos(lt * 0.15 + i));
        return (
          <rect key={i} x={-6} y={-10} width={12} height={20} rx={2} fill={COLORS[i % COLORS.length]} stroke={C.ink} strokeWidth={1.5}
            transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip} 1)`} />
        );
      })}
    </svg>
  );
};

/** 纸张颗粒 + 暗角，盖在最上层 */
export const PaperGrain: React.FC<{w?: number; h?: number}> = ({w = 1920, h = 1080}) => (
  <>
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: 0.07, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(60,40,20,0.12) 100%)', pointerEvents: 'none'}} />
  </>
);
