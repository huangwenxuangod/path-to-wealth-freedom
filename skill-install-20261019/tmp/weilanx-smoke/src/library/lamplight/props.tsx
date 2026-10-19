import React from 'react';
import {clamp01, rand} from '../anim';
import {Embers} from './stage';
import {L, LF, fadeSoft, textShadow} from './theme';

/**
 * 灯火史话风的实物和道具：象形小人、火焰 / 火把、烽燧一排、烽台、坊门、大鼓、纸卷、名签、地面光圈、人数卡、气泡、月亮、昼夜盘。
 * 坐标都是 1920×1080 舞台坐标；人和建筑的 (x, y) 是脚底 / 地面中点。
 */

const Layer: React.FC<{opacity?: number; filter?: string; children: React.ReactNode}> = ({opacity = 1, filter, children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity, filter}}>
    {children}
  </svg>
);

/** 火焰路径：底部半椭圆、顶端尖，sway 让火尖左右摆 */
const flamePath = (w: number, h: number, sway: number) =>
  `M${-w} ${-h * 0.25} C${-w} ${-h * 0.55} ${sway - w * 0.35} ${-h * 0.78} ${sway} ${-h} C${sway + w * 0.35} ${-h * 0.78} ${w} ${-h * 0.55} ${w} ${-h * 0.25} A${w} ${h * 0.25} 0 0 1 ${-w} ${-h * 0.25} Z`;

/** 一团火（SVG <g>，底部中心在原点）：三层火焰 + 光晕，按帧闪烁；lit 0–1 控制点燃程度 */
export const FlameG: React.FC<{f: number; size?: number; seed?: number; lit?: number; fat?: number}> = ({f, size = 1, seed = 1, lit = 1, fat = 1}) => {
  if (lit <= 0) return null;
  const k = size * (0.4 + 0.6 * lit);
  const fl = 1 + 0.09 * Math.sin(f / 2.3 + seed * 3) + 0.05 * Math.sin(f / 1.3 + seed);
  const sway = 6 * Math.sin(f / 3.1 + seed * 2) * k;
  const h = 78 * k * fl;
  const w = 24 * k * fat;
  const id = `lf-${seed}`;
  return (
    <g opacity={Math.min(1, lit * 1.4)}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="rgba(255,170,70,0.55)" />
          <stop offset="40%" stopColor="rgba(255,120,40,0.18)" />
          <stop offset="100%" stopColor="rgba(255,120,40,0)" />
        </radialGradient>
      </defs>
      <circle cx={0} cy={-h * 0.45} r={150 * k * (0.95 + 0.05 * fl)} fill={`url(#${id})`} />
      <path d={flamePath(w, h, sway)} fill="#ff7a1f" opacity={0.95} />
      <path d={flamePath(w * 0.72, h * 0.78, sway * 0.7)} fill="#ffb347" />
      <path d={flamePath(w * 0.42, h * 0.5, sway * 0.4)} fill="#fff1c2" />
    </g>
  );
};

/** 单独一团火（舞台坐标），带上飘的火星 */
export const Flame: React.FC<{f: number; x: number; y: number; size?: number; seed?: number; lit?: number; embers?: boolean}> = ({f, x, y, size = 1, seed = 1, lit = 1, embers = true}) => (
  <>
    <Layer>
      <g transform={`translate(${x} ${y})`}>
        <FlameG f={f} size={size} seed={seed} lit={lit} />
      </g>
    </Layer>
    {embers && lit > 0.5 && <Embers f={f} x={x} y={y - 70 * size} n={8} spread={30 * size} rise={140 * size} seed={seed} />}
  </>
);

export type Pose = 'stand' | 'raise' | 'torch' | 'point' | 'shout' | 'lie';

/**
 * 象形小人：圆头 + 梯形长衫 + 棍腿，米白色，可戴深色小帽（hat）。
 * pose：站 / 举手 / 举火把 / 指向 / 喊话 / 躺；bun 挽发髻插簪（女子，不戴帽）；walk 迈步；flip 朝左；scale 缩放；color 换色（如变灰）。
 */
export const Figure: React.FC<{f: number; x: number; y: number; pose?: Pose; scale?: number; hat?: boolean; bun?: boolean; walk?: boolean; flip?: boolean; color?: string; opacity?: number; seed?: number; dazed?: boolean}> = ({
  f,
  x,
  y,
  pose = 'stand',
  scale = 1,
  hat = true,
  bun = false,
  walk = false,
  flip = false,
  color = L.figure,
  opacity = 1,
  seed = 1,
  dazed = false,
}) => {
  const sw = walk ? Math.sin(f / 4) * 10 : 0;
  const arm = (x2: number, y2: number, x1 = 24) => <line x1={x1} y1={-176} x2={x2} y2={y2} stroke={color} strokeWidth={14} strokeLinecap="round" />;
  let arms: React.ReactNode = (
    <>
      {arm(-38, -112, -24)}
      {arm(38, -112)}
    </>
  );
  if (pose === 'raise') arms = (
    <>
      {arm(-38, -112, -24)}
      <path d="M24 -176 Q42 -230 40 -290" stroke={color} strokeWidth={14} strokeLinecap="round" fill="none" />
    </>
  );
  if (pose === 'torch')
    arms = (
      <>
        {arm(-38, -112, -24)}
        <path d="M24 -176 Q44 -220 46 -268" stroke={color} strokeWidth={14} strokeLinecap="round" fill="none" />
        <line x1={46} y1={-238} x2={50} y2={-318} stroke={L.wood} strokeWidth={9} strokeLinecap="round" />
        <rect x={40} y={-328} width={20} height={14} rx={3} fill="#3b2a1c" />
        <g transform="translate(50 -326)">
          <FlameG f={f} size={0.8} seed={seed + 7} fat={1.2} />
        </g>
      </>
    );
  if (pose === 'point') arms = (
    <>
      {arm(-38, -112, -24)}
      {arm(104, -186)}
    </>
  );
  if (pose === 'shout')
    arms = (
      <>
        {arm(-38, -112, -24)}
        <path d="M24 -176 Q50 -190 34 -214" stroke={color} strokeWidth={14} strokeLinecap="round" fill="none" />
        {[0, 1, 2].map((i) => {
          const ph = ((f / 10 + i / 3) % 1);
          return <path key={i} d={`M${48 + i * 12} -238 q10 12 0 24`} stroke={color} strokeWidth={3} fill="none" opacity={1 - ph} transform={`translate(${ph * 10} 0)`} />;
        })}
      </>
    );
  const body = (
    <>
      <rect x={-21 + sw * 0.3} y={-82} width={16} height={82} rx={8} fill={color} transform={`rotate(${sw} -13 -82)`} />
      <rect x={5 - sw * 0.3} y={-82} width={16} height={82} rx={8} fill={color} transform={`rotate(${-sw} 13 -82)`} />
      <path d="M-22 -190 Q-30 -190 -32 -182 L-52 -70 L52 -70 L32 -182 Q30 -190 22 -190 Z" fill={color} />
      {arms}
      <circle cx={0} cy={-224} r={28} fill={color} />
      {bun && (
        <>
          <path d="M-29 -226 A29 29 0 0 1 29 -226 Q20 -238 0 -240 Q-20 -238 -29 -226 Z" fill={L.hat} />
          <circle cx={-14} cy={-262} r={15} fill={L.hat} />
          <rect x={-30} y={-268} width={30} height={4} rx={2} fill={L.gold} transform="rotate(-20 -15 -266)" />
        </>
      )}
      {hat && !bun && (
        <>
          <path d="M-25 -238 A28 28 0 0 1 25 -238 Z" fill={L.hat} />
          <rect x={-8} y={-268} width={16} height={14} rx={5} fill={L.hat} />
        </>
      )}
      {dazed && (
        <>
          <line x1={-14} y1={-226} x2={-4} y2={-226} stroke="#2a2018" strokeWidth={3} strokeLinecap="round" />
          <line x1={6} y1={-226} x2={16} y2={-226} stroke="#2a2018" strokeWidth={3} strokeLinecap="round" />
        </>
      )}
    </>
  );
  const lie = pose === 'lie';
  return (
    <Layer opacity={opacity}>
      <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
        <ellipse cx={0} cy={2} rx={lie ? 150 : 56} ry={8} fill="rgba(0,0,0,0.35)" />
        <g transform={lie ? 'translate(-130 -28) rotate(-90)' : undefined}>{body}</g>
      </g>
    </Layer>
  );
};

/**
 * 一排烽燧：n 座火把台在 x0–x1 间排开，中间夹深色窑灶；litAt[i] 是第 i 座点燃的帧（不传就不点）。
 * labels 写在每座下面（一 二 三 四），点燃的变金带下划线，hotLast 让最后一座变朱红。
 */
export const BeaconRow: React.FC<{f: number; x0?: number; x1?: number; y?: number; n?: number; litAt?: (number | undefined)[]; labels?: string[]; hotLast?: boolean; scale?: number}> = ({
  f,
  x0 = 800,
  x1 = 1700,
  y = 880,
  n = 4,
  litAt = [],
  labels,
  hotLast = false,
  scale = 1,
}) => {
  const xs = Array.from({length: n}, (_, i) => x0 + ((x1 - x0) * i) / Math.max(1, n - 1));
  const gap = n > 1 ? (x1 - x0) / (n - 1) : 300;
  return (
    <>
      <Layer>
        <defs>
          <radialGradient id="lb-haze">
            <stop offset="0%" stopColor="rgba(190,110,40,0.42)" />
            <stop offset="100%" stopColor="rgba(190,110,40,0)" />
          </radialGradient>
        </defs>
        <ellipse cx={(x0 + x1) / 2} cy={y - 120 * scale} rx={(x1 - x0) / 2 + 260} ry={260 * scale} fill="url(#lb-haze)" opacity={Math.max(0, ...litAt.map((a) => (a === undefined ? 0 : clamp01((f - a) / 20))))} />
        {xs.slice(0, -1).map((x, i) => {
          const kx = x + gap / 2;
          return (
            <g key={`k${i}`} transform={`translate(${kx} ${y}) scale(${scale})`}>
              <path d="M-36 0 L-30 -180 Q-28 -200 -14 -210 L-14 -246 L14 -246 L14 -210 Q28 -200 30 -180 L36 0 Z" fill="#3a2f26" />
              <rect x={-12} y={-56} width={24} height={24} fill="#0d0a08" />
            </g>
          );
        })}
        {xs.map((x, i) => {
          const at = litAt[i];
          const lit = at === undefined ? 0 : clamp01((f - at) / 10);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
              <path d="M-66 0 L-52 -66 L52 -66 L66 0 Z" fill={lit > 0 ? '#8c7656' : '#5e4f3c'} />
              {[-50, -34, -18].map((yy) => (
                <line key={yy} x1={-58} x2={58} y1={yy} y2={yy} stroke="rgba(0,0,0,0.18)" strokeWidth={2} />
              ))}
              <rect x={-8} y={-250} width={16} height={186} fill={lit > 0 ? '#7a5a34' : '#4a3a28'} />
              {[0, 1, 2, 3].map((k) => (
                <rect key={k} x={-20} y={-268 + k * 22} width={40} height={14} rx={2} fill={lit > 0 ? '#a07a46' : '#5e4c36'} />
              ))}
              <g transform="translate(0 -272)">
                <FlameG f={f} size={1.7} seed={i + 3} lit={lit} fat={1.45} />
              </g>
            </g>
          );
        })}
      </Layer>
      {xs.map((x, i) => {
        const at = litAt[i];
        return at !== undefined && f >= at ? <Embers key={`e${i}`} f={f} x={x} y={y - 340 * scale} n={7} spread={40} rise={160} seed={i + 11} /> : null;
      })}
      {labels &&
        xs.map((x, i) => {
          const at = litAt[i];
          const on = at !== undefined && f >= at;
          const hot = hotLast && i === n - 1 && on;
          const c = hot ? L.red : on ? L.gold : 'rgba(239,230,214,0.35)';
          const p = on ? clamp01((f - (at ?? 0) - 6) / 10) : 0;
          return (
            <div key={`l${i}`} style={{position: 'absolute', left: x - 80, width: 160, top: y + 22, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: hot ? 96 : 62, lineHeight: '96px', color: c, textShadow}}>
              {labels[i]}
              <div style={{margin: '10px auto 0', width: 56 * p, height: 5, borderRadius: 3, background: c, boxShadow: `0 0 8px ${c}`}} />
            </div>
          );
        })}
    </>
  );
};

/** 烽台：夯土梯形高台 + 雉堞 + 顶上小屋 + 侧面梯子 + 拱门；label 写在脚下 */
export const Watchtower: React.FC<{f: number; x: number; y: number; scale?: number; label?: string; lit?: number; opacity?: number}> = ({f, x, y, scale = 1, label, lit = 0, opacity = 1}) => (
  <>
    <Layer opacity={opacity}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path d="M-150 0 L-110 -300 L110 -300 L150 0 Z" fill="#5c4b39" />
        <path d="M-150 0 L-110 -300 L-60 -300 L-90 0 Z" fill="rgba(255,255,255,0.05)" />
        {Array.from({length: 12}, (_, i) => {
          const yy = -24 - i * 24;
          const hw = 150 - (40 * (i + 1) * 24) / 300;
          return <line key={i} x1={-hw} x2={hw} y1={yy} y2={yy} stroke="rgba(0,0,0,0.22)" strokeWidth={2} />;
        })}
        {[-100, -60, -20, 20, 60].map((cx) => (
          <rect key={cx} x={cx} y={-330} width={30} height={32} fill="#5c4b39" />
        ))}
        <rect x={-44} y={-392} width={88} height={64} fill="#4e3f30" />
        <path d="M-62 -390 L0 -428 L62 -390 Z" fill="#3e3226" />
        <rect x={-12} y={-372} width={24} height={30} fill="#0d0a08" />
        <path d="M-30 0 L-30 -52 A30 30 0 0 1 30 -52 L30 0 Z" fill="#0d0a08" />
        <g stroke="#7e6a52" strokeWidth={5}>
          <line x1={-140} y1={-4} x2={-104} y2={-300} />
          <line x1={-112} y1={-4} x2={-78} y2={-300} />
          {Array.from({length: 11}, (_, i) => {
            const t = (i + 0.5) / 11;
            return <line key={i} x1={-140 + 36 * t} y1={-4 - 296 * t} x2={-112 + 34 * t} y2={-4 - 296 * t} strokeWidth={3} />;
          })}
        </g>
        {lit > 0 && (
          <g transform="translate(0 -428)">
            <FlameG f={f} size={1.4} seed={21} lit={lit} />
          </g>
        )}
      </g>
    </Layer>
    {label && (
      <div style={{position: 'absolute', left: x - 120, width: 240, top: y + 30, textAlign: 'center', fontFamily: LF.sans, fontSize: 40, color: 'rgba(239,230,214,0.6)', opacity}}>{label}</div>
    )}
  </>
);

/** 坊门：深红双扇门 + 金色门钉，open 0–1 两扇往外开；label 写在门上方 */
export const Gate: React.FC<{f: number; x: number; y: number; w?: number; h?: number; open?: number; label?: string; opacity?: number}> = ({x, y, w = 280, h = 400, open = 0, label, opacity = 1}) => {
  const leaf = (side: -1 | 1) => {
    const lw = (w / 2) * (1 - open * 0.85);
    const x0 = side === -1 ? -w / 2 : w / 2 - lw;
    return (
      <g>
        <rect x={x0} y={-h} width={lw} height={h} fill={L.door} stroke="#6b3424" strokeWidth={3} />
        {Array.from({length: 5}, (_, r) =>
          Array.from({length: 3}, (_, c) => <circle key={`${r}-${c}`} cx={x0 + ((c + 0.5) * lw) / 3} cy={-h + 50 + r * ((h - 90) / 4)} r={7 * (1 - open * 0.5)} fill="#c99a48" />),
        )}
      </g>
    );
  };
  return (
    <>
      <Layer opacity={opacity}>
        <g transform={`translate(${x} ${y})`}>
          {open > 0 && <rect x={-w / 2} y={-h} width={w} height={h} fill="#e8b866" opacity={0.35 * open} />}
          {leaf(-1)}
          {leaf(1)}
        </g>
      </Layer>
      {label && <div style={{position: 'absolute', left: x - 200, width: 400, top: y - h - 62, textAlign: 'center', fontFamily: LF.sans, fontSize: 36, color: 'rgba(239,230,214,0.7)', opacity}}>{label}</div>}
    </>
  );
};

/** 大鼓：木架 + 米白鼓面 + 一圈朱红鼓钉；hits 是敲击的帧，敲一下鼓面一缩、放出一圈涟漪 */
export const Drum: React.FC<{f: number; x: number; y: number; r?: number; hits?: number[]; opacity?: number}> = ({f, x, y, r = 120, hits = [], opacity = 1}) => {
  const last = hits.filter((h) => h <= f).pop();
  const dt = last === undefined ? 99 : f - last;
  const bump = dt < 8 ? 1 - 0.05 * Math.sin((dt / 8) * Math.PI) : 1;
  return (
    <Layer opacity={opacity}>
      <defs>
        <radialGradient id="ld-head" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#d9cba6" />
          <stop offset="100%" stopColor="#9c8a62" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y})`}>
        <line x1={-r * 0.6} y1={0} x2={-r * 0.2} y2={-r * 1.2} stroke={L.wood} strokeWidth={12} />
        <line x1={r * 0.6} y1={0} x2={r * 0.2} y2={-r * 1.2} stroke={L.wood} strokeWidth={12} />
        <g transform={`translate(0 ${-r * 1.4}) scale(${bump})`}>
          {hits
            .filter((h) => f >= h && f - h < 30)
            .map((h) => {
              const t = (f - h) / 30;
              return <circle key={h} r={r * (1.1 + t * 1.2)} fill="none" stroke={L.ink} strokeWidth={3 * (1 - t)} opacity={0.5 * (1 - t)} />;
            })}
          <circle r={r * 1.08} fill="#5e2418" />
          <circle r={r} fill="url(#ld-head)" />
          {Array.from({length: 28}, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * r * 1.04} cy={Math.sin(a) * r * 1.04} r={r * 0.028} fill={L.red} />;
          })}
        </g>
      </g>
    </Layer>
  );
};

export type ScrollCol = {text: string; color?: string; size?: number; box?: boolean; at?: number};

/**
 * 纸卷：两根木轴从中间往两边拉开（at 起 24 帧），纸上有淡红竖格，竖排文字从右往左排；
 * cols 每一列（box 为朱红底白字的题签；at 指定这一列点亮的帧，点亮时背后闪一下金光——卡硬拍用），seal 左下方印文字；cite 写在纸卷下方的出处；
 * colW 列宽，dim 还没点亮的列先以多淡的样子露出来（0 = 不露）。
 */
export const Scroll: React.FC<{f: number; at: number; x?: number; y?: number; w?: number; h?: number; cols?: ScrollCol[]; seal?: string; cite?: string; out?: number; colW?: number; dim?: number}> = ({
  f,
  at,
  x = 960,
  y = 740,
  w = 1170,
  h = 340,
  cols = [],
  seal,
  cite,
  out,
  colW = 140,
  dim = 0,
}) => {
  const fo = fadeSoft(f, at, 10, out);
  if (fo.v <= 0) return null;
  const p = 1 - Math.pow(1 - clamp01((f - at) / 24), 3);
  const pw = 40 + (w - 40) * p;
  return (
    <div style={{position: 'absolute', left: x - w / 2 - 40, top: y - h / 2 - 40, width: w + 80, height: h + 120, opacity: fo.opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 40 + (w - pw) / 2,
          top: 40,
          width: pw,
          height: h,
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${L.paperLight} 0%, ${L.paper} 60%, #a8946a 100%)`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{position: 'absolute', left: (pw - w) / 2, top: 0, width: w, height: h}}>
          {Array.from({length: Math.floor(w / colW)}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: w - (i + 1) * colW, top: 24, bottom: 24, width: 1.5, background: 'rgba(170,60,40,0.35)'}} />
          ))}
          {cols.map((c, i) => {
            // 一列放不下就自动缩字号（竖排字高 ≈ 字号 + 字距 6）
            const n = Math.max(1, Array.from(c.text).length);
            const fs = Math.min(c.size ?? 62, (h - (c.box ? 110 : 64)) / n - 6);
            const lit = c.at === undefined ? clamp01((f - at - 20 - i * 6) / 14) : clamp01((f - c.at) / 6);
            const show = dim + (1 - dim) * lit;
            const flash = c.at !== undefined && f >= c.at && f < c.at + 16 ? 1 - (f - c.at) / 16 : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: 70 - (140 - colW) / 2 + i * colW,
                  textShadow: flash > 0 ? `0 0 ${24 * flash}px rgba(255,200,90,${flash})` : undefined,
                  top: c.box ? 44 : 30,
                  writingMode: 'vertical-rl',
                  fontFamily: LF.scroll,
                  fontSize: fs,
                  lineHeight: 1,
                  letterSpacing: 6,
                  color: c.box ? '#f3e7d0' : (c.color ?? '#1f1a14'),
                  background: c.box ? L.seal : undefined,
                  padding: c.box ? '14px 12px' : undefined,
                  borderRadius: c.box ? 8 : undefined,
                  opacity: show,
                  filter: lit < 1 ? `blur(${(1 - lit) * 6}px)` : undefined,
                }}
              >
                {c.text}
              </div>
            );
          })}
          {seal && (
            <div
              style={{
                position: 'absolute',
                left: 150,
                top: h / 2 - 70,
                width: 130,
                height: 130,
                border: `4px solid ${L.seal}`,
                color: L.seal,
                fontFamily: LF.scroll,
                fontSize: Math.min(46, 112 / Math.max(1, Array.from(seal).length)),
                lineHeight: `${Math.min(46, 112 / Math.max(1, Array.from(seal).length)) * 1.15}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                writingMode: 'vertical-rl',
                opacity: clamp01((f - at - 30) / 12),
              }}
            >
              {seal}
            </div>
          )}
        </div>
      </div>
      {[-1, 1].map((s) => (
        <div
          key={s}
          style={{
            position: 'absolute',
            left: 40 + w / 2 + (s * pw) / 2 - 14 - (s === -1 ? 8 : -8),
            top: 0,
            width: 28,
            height: h + 80,
            borderRadius: 6,
            background: `linear-gradient(90deg, #3e2614, ${L.wood} 45%, #2e1c0e)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{position: 'absolute', left: -6, right: -6, top: 0, height: 16, borderRadius: 4, background: '#8a6236'}} />
          <div style={{position: 'absolute', left: -6, right: -6, bottom: 0, height: 16, borderRadius: 4, background: '#8a6236'}} />
        </div>
      ))}
      {cite && (
        <div style={{position: 'absolute', left: 0, right: 0, top: h + 92, textAlign: 'center', fontFamily: LF.label, fontWeight: 600, fontSize: 28, color: L.inkDim, opacity: clamp01((f - at - 26) / 14)}}>{cite}</div>
      )}
    </div>
  );
};

/** 金边名签：小字身份 + 大字名字（金色），出现时闪一颗星；color 换边框颜色 */
export const NameTag: React.FC<{f: number; at: number; x: number; y: number; small: string; name: string; color?: string; out?: number; w?: number}> = ({f, at, x, y, small, name, color = L.gold, out, w = 400}) => {
  const a = fadeSoft(f, at, 14, out);
  if (a.v <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        padding: '14px 0 12px',
        border: `3px solid ${color}`,
        borderRadius: 12,
        background: 'rgba(20,14,10,0.72)',
        boxShadow: `0 0 18px ${color}55`,
        textAlign: 'center',
        opacity: a.opacity,
        filter: a.filter,
      }}
    >
      <div style={{fontFamily: LF.label, fontWeight: 600, fontSize: 26, color: L.inkDim}}>{small}</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 52, lineHeight: 1.15, color, textShadow}}>{name}</div>
    </div>
  );
};

/** 地面光圈：脚下一个扁椭圆，at 起 18 帧画出，之后缓慢呼吸；color 金 / 红 / 米白 */
export const GroundRing: React.FC<{f: number; at: number; x: number; y: number; rx?: number; ry?: number; color?: string; out?: number}> = ({f, at, x, y, rx = 300, ry = 48, color = 'rgba(239,230,214,0.6)', out}) => {
  const p = clamp01((f - at) / 18);
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  if (p <= 0 || o <= 0) return null;
  const br = 1 + 0.02 * Math.sin(f / 12);
  return (
    <Layer opacity={o}>
      <ellipse cx={x} cy={y} rx={rx * br} ry={ry * br} fill="none" stroke={color} strokeWidth={3.5} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 6px ${color})`}} />
    </Layer>
  );
};

/** 人数卡：圆角描边卡，上面小标签、中间大数字、下面一排排小人图标（count 个，每个依次亮起） */
export const TallyCard: React.FC<{f: number; at: number; x: number; y: number; label: string; value: string; count: number; w?: number; color?: string; out?: number}> = ({
  f,
  at,
  x,
  y,
  label,
  value,
  count,
  w = 220,
  color = L.ink,
  out,
}) => {
  const a = fadeSoft(f, at, 14, out);
  if (a.v <= 0) return null;
  const perRow = 12;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: '14px 12px 18px', border: '2.5px solid rgba(239,230,214,0.45)', borderRadius: 14, background: 'rgba(12,9,8,0.75)', textAlign: 'center', opacity: a.opacity, filter: a.filter}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 28, color: L.inkDim}}>{label}</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 72, lineHeight: 1.2, color, textShadow}}>{value}</div>
      <svg width={w - 24} height={Math.ceil(count / perRow) * 26} style={{display: 'block', margin: '6px auto 0'}}>
        {Array.from({length: count}, (_, i) => {
          const cx = ((i % perRow) + 0.5) * ((w - 24) / perRow);
          const cy = Math.floor(i / perRow) * 26;
          const on = clamp01((f - at - 8 - i * 0.6) / 6);
          return (
            <g key={i} opacity={on} fill={color}>
              <circle cx={cx} cy={cy + 5} r={4} />
              <path d={`M${cx - 5} ${cy + 22} L${cx - 3} ${cy + 10} L${cx + 3} ${cy + 10} L${cx + 5} ${cy + 22} Z`} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** 金边气泡：圆角描边框 + 左下小尾巴，text 一句短话；淡入 */
export const SayBubble: React.FC<{f: number; at: number; x: number; y: number; text: string; color?: string; out?: number; size?: number}> = ({f, at, x, y, text, color = L.gold, out, size = 34}) => {
  const a = fadeSoft(f, at, 12, out);
  if (a.v <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: a.opacity, filter: a.filter, transform: `translateY(${(1 - a.v) * 10}px)`}}>
      <div style={{padding: '8px 22px', border: `3px solid ${color}`, borderRadius: 16, background: 'rgba(20,14,10,0.85)', fontFamily: LF.serif, fontWeight: 900, fontSize: size, color: L.ink, whiteSpace: 'nowrap', boxShadow: `0 0 14px ${color}44`}}>
        {text}
      </div>
      <svg width={30} height={22} style={{position: 'absolute', left: 26, bottom: -19}}>
        <path d="M2 0 L12 20 L26 0" fill="rgba(20,14,10,0.95)" stroke={color} strokeWidth={3} />
      </svg>
    </div>
  );
};

/** 月亮：满月或弯月，带一圈柔光；phase 'full' | 'crescent' */
export const Moon: React.FC<{f: number; x: number; y: number; r?: number; phase?: 'full' | 'crescent'; opacity?: number}> = ({x, y, r = 34, phase = 'crescent', opacity = 1}) => (
  <Layer opacity={opacity}>
    <defs>
      <radialGradient id="lm-glow">
        <stop offset="0%" stopColor="rgba(230,235,245,0.35)" />
        <stop offset="100%" stopColor="rgba(230,235,245,0)" />
      </radialGradient>
      <mask id={`lm-mask-${x}`}>
        <circle cx={x} cy={y} r={r} fill="#fff" />
        {phase === 'crescent' && <circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.92} fill="#000" />}
      </mask>
    </defs>
    <circle cx={x} cy={y} r={r * 3} fill="url(#lm-glow)" />
    <circle cx={x} cy={y} r={r} fill="#ecebe4" mask={`url(#lm-mask-${x})`} />
  </Layer>
);

/** 昼夜盘：上半「昼」浅、下半「夜」深，一弯小月沿圆周走（p 0–1 从左走一圈半程）；caption 写在下方 */
export const DayNightDial: React.FC<{f: number; at: number; x: number; y: number; r?: number; p?: number; caption?: string; out?: number}> = ({f, at, x, y, r = 92, p = 0, caption, out}) => {
  const a = fadeSoft(f, at, 16, out);
  if (a.v <= 0) return null;
  const ang = Math.PI - p * Math.PI * 2;
  return (
    <div style={{position: 'absolute', left: x - r - 10, top: y - r - 10, width: r * 2 + 20, opacity: a.opacity, filter: a.filter}}>
      <svg width={r * 2 + 20} height={r * 2 + 20}>
        <g transform={`translate(${r + 10} ${r + 10})`}>
          <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 Z`} fill="#3a2c1e" />
          <path d={`M${-r} 0 A${r} ${r} 0 0 0 ${r} 0 Z`} fill="#0c0d12" />
          <circle r={r} fill="none" stroke="rgba(239,230,214,0.5)" strokeWidth={3} />
          <line x1={-r} x2={r} y1={0} y2={0} stroke="rgba(239,230,214,0.35)" strokeWidth={2} />
          <text y={-r * 0.38} textAnchor="middle" fontFamily={LF.serif} fontWeight={900} fontSize={r * 0.3} fill="rgba(239,230,214,0.8)">
            昼
          </text>
          <text y={r * 0.5} textAnchor="middle" fontFamily={LF.serif} fontWeight={900} fontSize={r * 0.3} fill="rgba(239,230,214,0.8)">
            夜
          </text>
          <circle cx={Math.cos(ang) * r} cy={-Math.sin(ang) * r} r={r * 0.15} fill="#ecebe4" />
          <circle cx={Math.cos(ang) * r + r * 0.07} cy={-Math.sin(ang) * r - r * 0.03} r={r * 0.13} fill="#0c0d12" />
        </g>
      </svg>
      {caption && <div style={{textAlign: 'center', marginTop: 4, fontFamily: LF.serif, fontWeight: 900, fontSize: 38, color: L.ink, textShadow}}>{caption}</div>}
    </div>
  );
};

/** 随机散落的人群剪影（远景街上的人）：n 个小象形人，seed 决定位置 */
export const Crowd: React.FC<{f: number; x0: number; x1: number; y0: number; y1: number; n?: number; seed?: number; opacity?: number}> = ({f, x0, x1, y0, y1, n = 30, seed = 5, opacity = 0.7}) => (
  <Layer opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const t = rand(seed + i);
      const yy = y0 + (y1 - y0) * rand(seed + i * 3);
      const s = 0.12 + 0.2 * ((yy - y0) / Math.max(1, y1 - y0));
      const xx = x0 + (x1 - x0) * t + Math.sin(f / 30 + i) * 4;
      return (
        <g key={i} transform={`translate(${xx} ${yy}) scale(${s})`} fill="#3a3028">
          <circle cy={-224} r={28} />
          <path d="M-32 -190 L-52 0 L52 0 L32 -190 Z" />
        </g>
      );
    })}
  </Layer>
);

/** 两节腿：髋 (x, y) 起，大腿角 a、膝弯 b（弧度），返回折线点 */
const legPts = (x: number, y: number, a: number, b: number, l1 = 58, l2 = 62) => {
  const kx = x + Math.sin(a) * l1;
  const ky = y + Math.cos(a) * l1;
  const hx = kx + Math.sin(a - b) * l2;
  const hy = ky + Math.cos(a - b) * l2;
  return `${x},${y} ${kx},${ky} ${hx},${hy}`;
};

/**
 * 象形马（原创，侧面朝右）：米白剪影，pose 'run' 奔跑（腿按帧轮换、身体起伏）、'leap' 腾空定格（前蹄收、后蹄蹬，封面用）、'stand' 站、'fall' 倒下（fall 0–1 进度，贴地）；
 * rider 背上驮一个驿卒（hat 小帽、torch 举火把、doc 背文书筒）；speed 步频；color 换色（累死变灰）；flip 朝左。
 */
export const Horse: React.FC<{
  f: number;
  x: number;
  y: number;
  pose?: 'run' | 'stand' | 'fall' | 'leap';
  fall?: number;
  scale?: number;
  rider?: boolean;
  torch?: boolean;
  doc?: boolean;
  color?: string;
  flip?: boolean;
  speed?: number;
  opacity?: number;
  seed?: number;
}> = ({f, x, y, pose = 'run', fall = 0, scale = 1, rider = true, torch = false, doc = true, color = L.figure, flip = false, speed = 0.5, opacity = 1, seed = 1}) => {
  const ph = f * speed + seed;
  const run = pose === 'run';
  const fp = pose === 'fall' ? clamp01(fall) : 0;
  const bob = run ? -10 * Math.abs(Math.sin(ph)) : pose === 'leap' ? -26 : 0;
  const leg = (hx: number, off: number, back: boolean) => {
    if (fp > 0) {
      // 倒下：腿往前放平，贴着地面
      const a = (back ? 1.35 : 1.5) * fp + (1 - fp) * 0.1;
      return legPts(hx, -132, a, 0.15 * fp);
    }
    if (pose === 'leap') return back ? legPts(hx, -132, -0.95 + off * 0.05, -0.35) : legPts(hx, -132, 1.05 - off * 0.08, 1.5);
    if (!run) return legPts(hx, -132, back ? -0.05 : 0.05, 0);
    const s = Math.sin(ph + off);
    const a = 0.55 * s;
    const b = Math.max(0, Math.sin(ph + off + 1.2)) * 0.9 * (back ? -1 : 1);
    return legPts(hx, -132, a, b);
  };
  const body = (
    <g transform={`translate(0 ${bob})`}>
      <path d="M-112 -186 Q-150 -170 -160 -112" stroke={color} strokeWidth={16} strokeLinecap="round" fill="none" transform={run ? `rotate(${8 * Math.sin(ph * 1.3)} -112 -186)` : undefined} />
      {[
        [62, 0, false],
        [40, 2.4, false],
        [-74, 1.2, true],
        [-96, 3.6, true],
      ].map(([hx, off, back], i) => (
        <polyline key={i} points={leg(hx as number, off as number, back as boolean)} stroke={color} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={i % 2 ? 0.82 : 1} />
      ))}
      <rect x={-118} y={-206} width={210} height={82} rx={38} fill={color} />
      <g transform={fp > 0 ? `rotate(${fp * 62} 78 -186)` : undefined}>
        <path d="M58 -196 L92 -268 Q98 -286 116 -286 L168 -264 Q180 -256 171 -244 L150 -238 L114 -248 L96 -170 Z" fill={color} />
        <path d="M104 -284 L112 -304 L120 -282 Z" fill={color} />
        <circle cx={140} cy={-264} r={4} fill="#2a2018" />
      </g>
      {rider && fp === 0 && (
        <g transform={`translate(-6 -196) rotate(${run ? 14 : 4})`}>
          <path d="M-26 0 L-18 -72 L18 -72 L26 0 Z" fill={L.ink} />
          <line x1={10} y1={-60} x2={88} y2={-40} stroke={L.ink} strokeWidth={11} strokeLinecap="round" />
          <circle cx={0} cy={-96} r={22} fill={L.ink} />
          <path d="M-20 -100 A22 22 0 0 1 20 -100 Z" fill={L.hat} />
          <rect x={-6} y={-126} width={12} height={11} rx={4} fill={L.hat} />
          {doc && <rect x={-40} y={-74} width={16} height={58} rx={6} fill={L.gold} transform="rotate(-24 -32 -45)" />}
          {torch && (
            <>
              <line x1={-14} y1={-50} x2={-40} y2={-150} stroke={L.wood} strokeWidth={8} strokeLinecap="round" />
              <g transform="translate(-42 -152)">
                <FlameG f={f} size={0.6} seed={seed + 30} fat={1.2} />
              </g>
            </>
          )}
        </g>
      )}
    </g>
  );
  return (
    <Layer opacity={opacity}>
      <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
        <ellipse cx={-20} cy={4} rx={170 * (1 - 0.15 * Math.abs(Math.sin(ph)) * (run ? 1 : 0))} ry={10} fill="rgba(0,0,0,0.4)" />
        <g transform={fp > 0 ? `translate(0 ${fp * 104}) rotate(${fp * 4} -20 -130)` : undefined}>{body}</g>
      </g>
    </Layer>
  );
};

/** 马蹄扬尘：at 起 16 帧，(x, y) 脚下几团米白烟往后散开 */
export const HoofDust: React.FC<{f: number; at: number; x: number; y: number; n?: number}> = ({f, at, x, y, n = 6}) => {
  const t = (f - at) / 16;
  if (t < 0 || t > 1) return null;
  return (
    <Layer opacity={1 - t}>
      {Array.from({length: n}, (_, i) => (
        <circle key={i} cx={x - t * (60 + rand(i + at) * 120)} cy={y - 10 - t * rand(i * 3 + at) * 50} r={10 + t * 26 * (0.6 + rand(i * 7 + at))} fill="rgba(226,217,200,0.35)" />
      ))}
    </Layer>
  );
};

/**
 * 朱漆金字牌（原创样式）：朱红木牌、金边、竖排金字，at 起淡入，gleam 帧起一道高光从上扫到下；
 * text 牌上的字（默认「急递」），w / h 尺寸。
 */
export const GoldPlaque: React.FC<{f: number; at: number; x: number; y: number; text?: string; w?: number; h?: number; gleam?: number; out?: number}> = ({f, at, x, y, text = '急递', w = 170, h = 460, gleam, out}) => {
  const a = fadeSoft(f, at, 12, out);
  if (a.v <= 0) return null;
  const g = gleam === undefined ? -1 : (f - gleam) / 18;
  const glow = 0.45 + 0.25 * Math.sin(f / 9);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: a.opacity, filter: a.filter}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          background: 'linear-gradient(180deg, #a3241a, #7c160f 60%, #5c0f0a)',
          border: `6px solid ${L.gold}`,
          boxShadow: `0 0 ${40 + 30 * glow}px rgba(237,174,80,${glow}), 0 20px 60px rgba(0,0,0,0.7)`,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', inset: 14, border: '2px solid rgba(255,217,138,0.6)', borderRadius: 8}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', writingMode: 'vertical-rl', margin: '0 auto', height: h - 80, fontFamily: LF.serif, fontWeight: 900, fontSize: w * 0.5, lineHeight: 1, letterSpacing: 20, color: L.goldHot, textShadow: '0 0 18px rgba(255,200,100,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {text}
        </div>
        {g >= 0 && g <= 1 && <div style={{position: 'absolute', left: -40, right: -40, top: `${-30 + g * 130}%`, height: '22%', background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,246,220,0.75), rgba(255,255,255,0))', transform: 'rotate(-12deg)'}} />}
      </div>
    </div>
  );
};

export type Tier = {label: string; value: string; note?: string; color?: string; at: number};
/** 档位卡：一排描边卡（标签 / 大字 / 小注），按各自 at 依次亮起，亮起的边框和字用自己的 color */
export const TierCards: React.FC<{f: number; x: number; y: number; tiers: Tier[]; w?: number; gap?: number; out?: number}> = ({f, x, y, tiers, w = 360, gap = 40, out}) => {
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 10);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap, opacity: o}}>
      {tiers.map((t, i) => {
        const a = fadeSoft(f, t.at, 12);
        const c = t.color ?? L.ink;
        return (
          <div
            key={i}
            style={{
              width: w,
              padding: '22px 0 26px',
              textAlign: 'center',
              borderRadius: 18,
              border: `3px solid ${a.v > 0.5 ? c : 'rgba(239,230,214,0.25)'}`,
              background: 'rgba(14,10,8,0.8)',
              boxShadow: a.v > 0.5 ? `0 0 26px ${c}55` : undefined,
              opacity: 0.35 + 0.65 * a.v,
              transform: `translateY(${(1 - a.v) * 14}px)`,
            }}
          >
            <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 32, color: L.inkDim}}>{t.label}</div>
            <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 96, lineHeight: 1.15, color: c, textShadow}}>{t.value}</div>
            {t.note && <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 34, color: L.ink, opacity: 0.85}}>{t.note}</div>}
          </div>
        );
      })}
    </div>
  );
};

/** 马匹额度：n 匹小马排成一排，前 dead 匹在 deadAt 起逐匹（每 step 帧）变灰倒下，用来表现「十匹死七匹」 */
export const HorseQuota: React.FC<{f: number; at: number; x: number; y: number; n?: number; dead?: number; deadAt: number; step?: number; size?: number}> = ({f, at, x, y, n = 10, dead = 7, deadAt, step = 4, size = 0.42}) => {
  const a = fadeSoft(f, at, 12);
  if (a.v <= 0) return null;
  const gap = 360 * size;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity}}>
      {Array.from({length: n}, (_, i) => {
        const p = i < dead ? clamp01((f - deadAt - i * step) / 8) : 0;
        return (
          <Horse
            key={i}
            f={f}
            x={x + i * gap}
            y={y}
            scale={size}
            pose={p > 0 ? 'fall' : 'stand'}
            fall={p}
            rider={false}
            color={p > 0 ? '#5a524a' : L.figure}
            seed={i}
          />
        );
      })}
    </div>
  );
};

/** 朱红指印：at 帧按下（从 1.4 倍砸到 1 倍，落定时一圈晕开），螺旋纹路是几层椭圆弧；size 直径 */
export const Fingerprint: React.FC<{f: number; at: number; x: number; y: number; size?: number; color?: string}> = ({f, at, x, y, size = 150, color = L.seal}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = clamp01(t / 5);
  const s = 1.4 - 0.4 * (1 - Math.pow(1 - p, 3));
  const ring = t >= 5 && t < 22 ? (t - 5) / 17 : -1;
  return (
    <Layer>
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(-12)`} opacity={Math.min(1, p * 2) * 0.92}>
        {ring >= 0 && <ellipse rx={size * (0.5 + ring * 0.6)} ry={size * (0.62 + ring * 0.6)} fill="none" stroke={color} strokeWidth={4 * (1 - ring)} opacity={1 - ring} />}
        <ellipse rx={size * 0.42} ry={size * 0.54} fill={color} opacity={0.18} />
        {Array.from({length: 9}, (_, i) => {
          const k = (i + 1) / 9;
          const rx = size * 0.42 * k;
          const ry = size * 0.54 * k;
          const gap = 0.6 + 0.4 * rand(i + 3);
          return <path key={i} d={`M ${-rx * gap} ${ry * 0.2} A ${rx} ${ry} 0 1 1 ${rx * 0.9} ${ry * 0.45}`} fill="none" stroke={color} strokeWidth={size * 0.035} strokeLinecap="round" />;
        })}
      </g>
    </Layer>
  );
};

/** 手提灯笼：竹竿 + 米黄灯笼 + 一团暖光，按帧轻轻摆；(x, y) 是手握的位置，lit 0–1 点亮程度 */
export const Lantern: React.FC<{f: number; x: number; y: number; size?: number; lit?: number; seed?: number}> = ({f, x, y, size = 1, lit = 1, seed = 1}) => {
  const sw = Math.sin(f / 14 + seed) * 6;
  const fl = 0.9 + 0.1 * Math.sin(f / 3 + seed * 2);
  return (
    <Layer>
      <defs>
        <radialGradient id={`ll-glow-${seed}`}>
          <stop offset="0%" stopColor={`rgba(255,190,100,${0.55 * lit})`} />
          <stop offset="100%" stopColor="rgba(255,160,80,0)" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${size}) rotate(${sw})`}>
        <line x1={0} y1={0} x2={0} y2={40} stroke={L.wood} strokeWidth={4} />
        <circle cx={0} cy={86} r={150 * fl} fill={`url(#ll-glow-${seed})`} />
        <rect x={-14} y={38} width={28} height={8} rx={2} fill="#3b2a1c" />
        <ellipse cx={0} cy={84} rx={30} ry={40} fill={lit > 0 ? '#f6c879' : '#6b5a44'} opacity={0.5 + 0.5 * lit} />
        {[-16, 0, 16].map((dx) => (
          <path key={dx} d={`M ${dx * 0.6} 46 Q ${dx * 1.6} 84 ${dx * 0.6} 122`} stroke="rgba(120,60,20,0.45)" strokeWidth={2} fill="none" />
        ))}
        <rect x={-14} y={122} width={28} height={8} rx={2} fill="#3b2a1c" />
        <line x1={0} y1={130} x2={0} y2={150} stroke={L.red} strokeWidth={3} />
      </g>
    </Layer>
  );
};

/** 一只碗（SVG <g>，碗底中心在原点）：silver 银碗（冷白高光）或瓷碗（米白描青边），w 碗口宽 */
export const BowlG: React.FC<{w?: number; silver?: boolean}> = ({w = 64, silver = false}) => {
  const h = w * 0.42;
  const body = silver ? '#d9dde4' : '#ece4d2';
  const rim = silver ? '#f6f8fb' : '#f4eedf';
  return (
    <g>
      <path d={`M${-w / 2} ${-h} Q${-w / 2} 0 0 0 Q${w / 2} 0 ${w / 2} ${-h} Z`} fill={body} />
      <ellipse cx={0} cy={-h} rx={w / 2} ry={h * 0.22} fill={rim} />
      <rect x={-w * 0.18} y={-2} width={w * 0.36} height={5} rx={2} fill={silver ? '#aeb4bd' : '#c9bea8'} />
      {silver ? <path d={`M${-w * 0.3} ${-h * 0.6} Q${-w * 0.1} ${-h * 0.15} ${w * 0.12} ${-h * 0.2}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.8} /> : <path d={`M${-w * 0.42} ${-h * 0.62} Q0 ${-h * 0.35} ${w * 0.42} ${-h * 0.62}`} stroke="#6f93ad" strokeWidth={2} fill="none" />}
    </g>
  );
};

/** 一只碗（舞台坐标），at 帧起从上方落到位（8 帧），silver 银碗 */
export const Bowl: React.FC<{f: number; x: number; y: number; at?: number; w?: number; silver?: boolean; opacity?: number}> = ({f, x, y, at = -999, w = 64, silver, opacity = 1}) => {
  const t = clamp01((f - at) / 8);
  if (t <= 0) return null;
  return (
    <Layer opacity={opacity * Math.min(1, t * 2)}>
      <g transform={`translate(${x} ${y - (1 - t) * 60})`} style={silver ? {filter: 'drop-shadow(0 0 14px rgba(220,230,255,0.7))'} : undefined}>
        <BowlG w={w} silver={silver} />
      </g>
    </Layer>
  );
};

/** 食盒（SVG <g>，底部中心在原点）：三层朱漆食盒 + 提梁 */
export const FoodBoxG: React.FC<{size?: number}> = ({size = 1}) => (
  <g transform={`scale(${size})`}>
    <path d="M-34 -96 Q0 -132 34 -96" stroke={L.wood} strokeWidth={6} fill="none" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={-36} y={-30 - i * 30} width={72} height={28} rx={5} fill={i === 1 ? '#8c2a1e' : '#a3372a'} />
        <rect x={-36} y={-30 - i * 30} width={72} height={5} fill="#c99a48" />
      </g>
    ))}
  </g>
);

/**
 * 跑堂（象形小人，正面）：左手托着 left 只碗（叠成一摞，最多 3），右臂平伸、从手腕到肩膀叠着 right 只碗（最多约 20，分成 5 摞）；
 * 每只碗按 leftAt / rightAt 给的帧落上去。x / y 脚底，scale 缩放。
 */
export const Waiter: React.FC<{f: number; x: number; y: number; leftAt: number[]; rightAt: number[]; scale?: number}> = ({f, x, y, leftAt, rightAt, scale = 1}) => {
  const c = L.figure;
  const piles = 5;
  const bw = 46;
  const bh = 20;
  return (
    <Layer>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <ellipse cx={0} cy={2} rx={70} ry={9} fill="rgba(0,0,0,0.35)" />
        <rect x={-21} y={-82} width={16} height={82} rx={8} fill={c} />
        <rect x={5} y={-82} width={16} height={82} rx={8} fill={c} />
        <path d="M-22 -190 Q-30 -190 -32 -182 L-52 -70 L52 -70 L32 -182 Q30 -190 22 -190 Z" fill={c} />
        {/* 左臂：弯到胸前托碗 */}
        <path d="M-24 -176 Q-70 -150 -86 -128" stroke={c} strokeWidth={14} strokeLinecap="round" fill="none" />
        {leftAt.map((at, i) => {
          const t = clamp01((f - at) / 6);
          if (t <= 0) return null;
          return (
            <g key={`l${i}`} transform={`translate(${-92 + i * 4} ${-128 - i * bh - (1 - t) * 50})`} opacity={Math.min(1, t * 2)}>
              <BowlG w={bw} />
            </g>
          );
        })}
        {/* 右臂：水平伸直，从手腕到肩膀 */}
        <line x1={24} y1={-176} x2={250} y2={-176} stroke={c} strokeWidth={14} strokeLinecap="round" />
        {rightAt.map((at, i) => {
          const t = clamp01((f - at) / 6);
          if (t <= 0) return null;
          const pile = piles - 1 - (i % piles); // 先从手腕那一摞叠起
          const lvl = Math.floor(i / piles);
          const px = 60 + pile * 46;
          return (
            <g key={`r${i}`} transform={`translate(${px} ${-184 - lvl * bh - (1 - t) * 50})`} opacity={Math.min(1, t * 2)}>
              <BowlG w={bw} />
            </g>
          );
        })}
        <circle cx={0} cy={-224} r={28} fill={c} />
        <path d="M-25 -238 A28 28 0 0 1 25 -238 Z" fill={L.hat} />
        <rect x={-8} y={-268} width={16} height={14} rx={5} fill={L.hat} />
      </g>
    </Layer>
  );
};

/** 一枚方孔圆钱（SVG <g>，圆心在原点）：r 半径，iron 铁钱（暗灰），glow 发光强度 */
export const CoinG: React.FC<{r?: number; iron?: boolean; glow?: number}> = ({r = 22, iron = false, glow = 0}) => {
  const c = iron ? '#7d7a74' : '#c99a4a';
  const rim = iron ? '#4a4844' : '#8a5f22';
  return (
    <g style={glow > 0 ? {filter: `drop-shadow(0 0 ${8 * glow}px ${L.gold})`} : undefined}>
      <circle r={r} fill={c} stroke={rim} strokeWidth={r * 0.12} />
      <circle r={r * 0.72} fill="none" stroke={rim} strokeWidth={r * 0.06} opacity={0.7} />
      <rect x={-r * 0.26} y={-r * 0.26} width={r * 0.52} height={r * 0.52} fill="#120d09" stroke={rim} strokeWidth={r * 0.06} />
    </g>
  );
};

/**
 * 一贯钱（SVG <g>，上端绳结在原点，往下垂）：一串方孔钱侧面叠成一根「钱串」，绳子从中间穿过；
 * len 长度（像素），iron 铁钱，sway 左右摆动的角度。用来画「一千文一贯、压弯扁担」。
 */
export const CoinStringG: React.FC<{len?: number; w?: number; iron?: boolean; sway?: number}> = ({len = 150, w = 34, iron = false, sway = 0}) => {
  const c = iron ? '#6f6c66' : '#b98a3e';
  const hi = iron ? '#9a968e' : '#e2b867';
  const n = Math.floor(len / 6);
  return (
    <g transform={`rotate(${sway})`}>
      <line x1={0} y1={-10} x2={0} y2={len + 8} stroke="#5a4426" strokeWidth={3} />
      {Array.from({length: n}, (_, i) => (
        <rect key={i} x={-w / 2} y={i * 6} width={w} height={5} rx={2.5} fill={i % 2 ? c : hi} opacity={0.95} />
      ))}
      <path d={`M-8 ${len + 4} Q0 ${len + 22} 8 ${len + 4}`} fill="none" stroke="#5a4426" strokeWidth={3} />
    </g>
  );
};

/**
 * 扁担挑钱：一个象形小人挑着扁担，两头各挂 loads 层钱串（每层一贯），担子随重量弯下去；
 * loadAt 每一层挂上去的帧（挂上时那头往下一沉），iron 换成铁钱。(x, y) 脚底中点。
 */
export const CoinPole: React.FC<{f: number; x: number; y: number; loadAt: number[]; scale?: number; iron?: boolean; walk?: boolean; opacity?: number}> = ({f, x, y, loadAt, scale = 1, iron = false, walk = false, opacity = 1}) => {
  const n = loadAt.filter((a) => f >= a).length;
  const last = Math.max(-999, ...loadAt.filter((a) => f >= a));
  const bounce = f - last < 10 ? Math.sin(((f - last) / 10) * Math.PI) * 10 : 0;
  const bend = 10 + n * 16 + bounce;
  const half = 230 * scale;
  const shoulderY = y - 175 * scale;
  return (
    <>
      <Figure f={f} x={x} y={y} scale={scale} walk={walk} opacity={opacity} pose="stand" />
      <Layer opacity={opacity}>
        <path d={`M${x - half} ${shoulderY + bend} Q${x} ${shoulderY - bend * 0.25} ${x + half} ${shoulderY + bend}`} fill="none" stroke="#8a6a3e" strokeWidth={9 * scale} strokeLinecap="round" />
        {[-1, 1].map((side) =>
          Array.from({length: n}, (_, k) => {
            const ax = x + side * (half - 20 * scale - k * 26 * scale);
            const ay = shoulderY + bend - 4;
            return (
              <g key={`${side}${k}`} transform={`translate(${ax} ${ay}) scale(${scale})`}>
                <CoinStringG len={130 + k * 6} iron={iron} sway={Math.sin(f / 12 + k + side) * 3} />
              </g>
            );
          }),
        )}
      </Layer>
    </>
  );
};

/**
 * 一张券（div，中心在 (x, y)）：米黄纸、朱红边、竖排两三个字 + 半个骑缝印；split 0–1 从中间撕成左右两半、各自错开，
 * gap 撕开后两半的距离；hide 'left' | 'right' 只画一半（飞走的那一半单独画）。用来画「合券乃取之」。
 */
export const Ticket: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; text?: string; split?: number; gap?: number; hide?: 'left' | 'right'; rot?: number; opacity?: number; glow?: number}> = ({
  f,
  at,
  x,
  y,
  w = 200,
  h = 300,
  text = '券',
  split = 0,
  gap = 160,
  hide,
  rot = 0,
  opacity = 1,
  glow = 0,
}) => {
  const a = clamp01((f - at) / 8);
  if (a <= 0) return null;
  const half = (side: 'left' | 'right') => {
    const dx = (side === 'left' ? -1 : 1) * split * gap * 0.5;
    const tilt = (side === 'left' ? -1 : 1) * split * 6;
    // 锯齿撕口
    const teeth = Array.from({length: 9}, (_, i) => `${w / 2 + (i % 2 ? 6 : -6)} ${(i * h) / 8}`).join(' L');
    const clip = side === 'left' ? `polygon(0 0, ${w / 2}px 0, ${teeth.split(' L').map((p) => p.split(' ').map((v) => `${v}px`).join(' ')).join(', ')}, ${w / 2}px ${h}px, 0 ${h}px)` : `polygon(${w / 2}px 0, ${w}px 0, ${w}px ${h}px, ${w / 2}px ${h}px, ${teeth.split(' L').reverse().map((p) => p.split(' ').map((v) => `${v}px`).join(' ')).join(', ')})`;
    return (
      <div key={side} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `translateX(${dx}px) rotate(${tilt}deg)`, clipPath: clip}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${L.paperLight}, ${L.paper})`, border: `4px solid ${L.seal}`, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.12, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: w * 0.34, lineHeight: 1.05, color: '#2a1a10', writingMode: 'vertical-rl', height: h * 0.76, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{text}</div>
        <div style={{position: 'absolute', left: w / 2 - h * 0.13, top: h * 0.62, width: h * 0.26, height: h * 0.26, border: `4px solid ${L.seal}`, borderRadius: 6, opacity: 0.85}} />
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: a * opacity, transform: `rotate(${rot}deg) scale(${0.9 + 0.1 * a})`, filter: glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${L.goldHot})` : 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))'}}>
      {hide !== 'left' && half('left')}
      {hide !== 'right' && half('right')}
    </div>
  );
};
