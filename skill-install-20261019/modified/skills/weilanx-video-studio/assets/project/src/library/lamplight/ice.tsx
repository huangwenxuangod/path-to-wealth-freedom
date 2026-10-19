import React from 'react';
import {clamp01, rand} from '../anim';
import {BowlG, Figure} from './props';
import {L, LF, fadeSoft, textShadow} from './theme';

/**
 * 灯火史话风的「冰」道具（ep46 起）：冰块（可化）、碗口白气、冰碗、冰井剖面、青布伞摊、挑冰担的人、一排水牌菜单。
 * 坐标都是 1920×1080 舞台坐标；东西的 (x, y) 是底部中点。讲藏冰、冷饮、季节储存、窖藏一类的题都能用。
 */

const Layer: React.FC<{opacity?: number; filter?: string; children: React.ReactNode}> = ({opacity = 1, filter, children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity, filter}}>
    {children}
  </svg>
);

export const ICE = {
  face: 'rgba(196,228,246,0.62)',
  top: 'rgba(232,246,255,0.8)',
  side: 'rgba(150,196,224,0.55)',
  edge: 'rgba(240,250,255,0.95)',
  water: 'rgba(150,200,232,0.35)',
  cloth: '#35667c', // 青布
  clothHi: '#4c879f',
};

/**
 * 一块冰（SVG <g>，底部正面中点在原点）：正面 + 顶面 + 右侧面的斜视方块，半透明冰蓝、白棱、一道高光；
 * w 宽、h 高、d 进深（斜向）；melt 0–1 往下化，脚下一滩水跟着扩开。
 */
export const IceBlockG: React.FC<{w?: number; h?: number; d?: number; melt?: number; glow?: number}> = ({w = 120, h = 80, d = 40, melt = 0, glow = 0}) => {
  const m = clamp01(melt);
  const hh = h * (1 - m * 0.92);
  const ww = w * (1 - m * 0.25);
  const dx = d * 0.7;
  const dy = d * 0.5;
  const x0 = -ww / 2;
  const x1 = ww / 2;
  return (
    <g style={glow > 0 ? {filter: `drop-shadow(0 0 ${14 * glow}px rgba(200,235,255,0.85))`} : undefined}>
      {m > 0 && <ellipse cx={dx / 2} cy={-dy / 2 + 4} rx={w * 0.55 + m * w * 0.5} ry={(d * 0.5 + m * 18) * 0.7} fill={ICE.water} />}
      {hh > 1 && (
        <>
          <polygon points={`${x1},${-hh} ${x1 + dx},${-hh - dy} ${x1 + dx},${-dy} ${x1},0`} fill={ICE.side} stroke={ICE.edge} strokeWidth={1.5} strokeLinejoin="round" />
          <polygon points={`${x0},${-hh} ${x0 + dx},${-hh - dy} ${x1 + dx},${-hh - dy} ${x1},${-hh}`} fill={ICE.top} stroke={ICE.edge} strokeWidth={1.5} strokeLinejoin="round" />
          <rect x={x0} y={-hh} width={ww} height={hh} fill={ICE.face} stroke={ICE.edge} strokeWidth={2} />
          <path d={`M${x0 + ww * 0.12} ${-hh * 0.82} L${x0 + ww * 0.32} ${-hh * 0.82}`} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
          <path d={`M${x0 + ww * 0.12} ${-hh * 0.66} L${x0 + ww * 0.2} ${-hh * 0.66}`} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <path d={`M${x0 + ww * 0.55} ${-hh * 0.15} L${x0 + ww * 0.7} ${-hh * 0.5} L${x0 + ww * 0.62} ${-hh * 0.62}`} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} fill="none" />
        </>
      )}
    </g>
  );
};

/** 一块冰（舞台坐标）：at 起从上方落到位（8 帧，落地顿一下），melt 化掉的程度，dims 画尺寸标注线（文字自己给） */
export const IceBlock: React.FC<{
  f: number;
  x: number;
  y: number;
  at?: number;
  w?: number;
  h?: number;
  d?: number;
  melt?: number;
  glow?: number;
  opacity?: number;
  dims?: {at: number; w: string; h: string; d?: string};
}> = ({f, x, y, at = -999, w = 120, h = 80, d = 40, melt = 0, glow = 0, opacity = 1, dims}) => {
  const t = clamp01((f - at) / 8);
  if (t <= 0) return null;
  const yy = y - (1 - t * t) * 260;
  const dp = dims ? clamp01((f - dims.at) / 14) : 0;
  const dx = d * 0.7;
  const dy = d * 0.5;
  const lab = (tx: number, ty: number, text: string, anchor: 'middle' | 'start' | 'end' = 'middle') => (
    <text x={tx} y={ty} textAnchor={anchor} fontFamily={LF.serif} fontWeight={900} fontSize={Math.max(34, w * 0.09)} fill={L.goldHot} opacity={dp} style={{paintOrder: 'stroke'}} stroke="rgba(0,0,0,0.7)" strokeWidth={6}>
      {text}
    </text>
  );
  return (
    <Layer opacity={opacity * Math.min(1, t * 2)}>
      <g transform={`translate(${x} ${yy})`}>
        <IceBlockG w={w} h={h} d={d} melt={melt} glow={glow} />
        {dims && dp > 0 && (
          <g stroke={L.gold} strokeWidth={3} fill="none" opacity={dp}>
            <path d={`M${-w / 2} 26 L${-w / 2 + w * dp} 26`} />
            <path d={`M${-w / 2} 16 V36 M${w / 2} 16 V36`} opacity={dp >= 1 ? 1 : 0} />
            <path d={`M${-w / 2 - 26} 0 L${-w / 2 - 26} ${-h * dp}`} />
            <path d={`M${-w / 2 - 36} 0 H${-w / 2 - 16} M${-w / 2 - 36} ${-h} H${-w / 2 - 16}`} opacity={dp >= 1 ? 1 : 0} />
            {dims.d && <path d={`M${w / 2 + 18} 6 L${w / 2 + 18 + dx * dp} ${6 - dy * dp}`} />}
          </g>
        )}
        {dims && dp > 0 && (
          <>
            {lab(0, 84, dims.w)}
            {lab(-w / 2 - 48, -h / 2 + 14, dims.h, 'end')}
            {dims.d && lab(w / 2 + dx + 34, -dy / 2 + 10, dims.d, 'start')}
          </>
        )}
      </g>
    </Layer>
  );
};

/** 白气（SVG <g>，原点在气的底部）：n 缕模糊的白雾一缕缕往上飘、散开，按帧循环；on 0–1 整体浓度 */
export const MistG: React.FC<{f: number; w?: number; h?: number; n?: number; seed?: number; on?: number}> = ({f, w = 120, h = 180, n = 6, seed = 1, on = 1}) => {
  if (on <= 0) return null;
  return (
    <g style={{filter: 'blur(7px)'}}>
      {Array.from({length: n}, (_, i) => {
        const T = 50 + rand(seed * 13 + i) * 30;
        const ph = ((f + rand(seed * 7 + i) * T) % T) / T;
        const x = (rand(seed * 3 + i) - 0.5) * w * 0.7 + Math.sin(f / 14 + i * 1.7) * w * 0.12 * ph;
        const y = -ph * h;
        const r = w * (0.08 + ph * 0.14);
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.75} fill="#f4f8fb" opacity={on * 0.32 * Math.sin(ph * Math.PI)} />;
      })}
    </g>
  );
};

/**
 * 一碗冰（舞台坐标，碗底中点）：瓷碗 / 银碗；iceAt 起几块碎冰从上方落进碗里（6 帧），mistAt 起碗口冒白气。
 * 没有 iceAt 就是一只空碗。
 */
export const IceBowl: React.FC<{f: number; x: number; y: number; w?: number; at?: number; iceAt?: number; mistAt?: number; silver?: boolean; opacity?: number; seed?: number}> = ({
  f,
  x,
  y,
  w = 200,
  at = -999,
  iceAt,
  mistAt,
  silver,
  opacity = 1,
  seed = 1,
}) => {
  const a = fadeSoft(f, at, 14);
  if (a.v <= 0) return null;
  const h = w * 0.42;
  const it = iceAt === undefined ? 0 : clamp01((f - iceAt) / 6);
  const pieces = [
    [-0.18, 0.2, 0.3],
    [0.12, 0.26, 0.26],
    [-0.02, 0.36, 0.22],
  ];
  const mist = mistAt === undefined ? 0 : clamp01((f - mistAt) / 10);
  return (
    <Layer opacity={opacity * a.opacity} filter={a.filter}>
      <g transform={`translate(${x} ${y})`}>
        {it > 0 &&
          pieces.map(([px, py, s], i) => {
            const fall = clamp01(it * 1.4 - i * 0.2);
            const yy = -h + py * h * 0.4 - (1 - fall * fall) * 400;
            return (
              <g key={i} transform={`translate(${px * w} ${yy}) rotate(${(i - 1) * 14})`} opacity={fall > 0 ? 1 : 0}>
                <IceBlockG w={w * s} h={w * s * 0.62} d={w * s * 0.35} glow={0.6} />
              </g>
            );
          })}
        <g style={silver ? {filter: 'drop-shadow(0 0 16px rgba(220,230,255,0.7))'} : undefined}>
          <BowlG w={w} silver={silver} />
        </g>
        <g transform={`translate(0 ${-h})`}>
          <MistG f={f} w={w} h={w * 1.1} seed={seed} on={mist} />
        </g>
      </g>
    </Layer>
  );
};

/**
 * 冰井 / 冰室剖面（舞台坐标，x 是中线、y 是地面线）：地面以上一点夜色，地下一层土（斜纹），中间一个拱顶窖室；
 * 窖里 cols × rows 块冰，第 k 块在 fillAt[k] 帧落进去（缺省 = 一开始就在）；melt[k] 0–1 让那块化掉；
 * lit 窖里的灯光，darkAt 起灯熄（16 帧）；label 窖口的竖牌。
 */
export const IceCellar: React.FC<{
  f: number;
  x: number;
  y: number;
  w?: number;
  depth?: number;
  cols?: number;
  rows?: number;
  fillAt?: number[];
  melt?: number[];
  darkAt?: number;
  label?: string;
  opacity?: number;
}> = ({f, x, y, w = 760, depth = 380, cols = 4, rows = 2, fillAt = [], melt = [], darkAt, label, opacity = 1}) => {
  const dark = darkAt === undefined ? 0 : clamp01((f - darkAt) / 16);
  const inner = w - 80;
  const cw = inner / cols;
  const bw = cw * 0.78;
  const bh = Math.min(bw * 0.62, (depth - 120) / rows - 10);
  const floor = y + depth - 30;
  const id = `ice-cellar-${Math.round(x)}-${Math.round(y)}`;
  return (
    <Layer opacity={opacity}>
      <defs>
        <pattern id={id} width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={22} stroke="rgba(239,230,214,0.09)" strokeWidth={3} />
        </pattern>
        <radialGradient id={`${id}-g`}>
          <stop offset="0" stopColor="rgba(150,210,240,0.35)" />
          <stop offset="1" stopColor="rgba(150,210,240,0)" />
        </radialGradient>
      </defs>
      {/* 土层 */}
      <rect x={x - w / 2 - 160} y={y} width={w + 320} height={depth + 70} fill="#1c150f" />
      <rect x={x - w / 2 - 160} y={y} width={w + 320} height={depth + 70} fill={`url(#${id})`} />
      <line x1={x - w / 2 - 220} x2={x + w / 2 + 220} y1={y} y2={y} stroke="rgba(239,230,214,0.45)" strokeWidth={3} />
      {/* 窖室：平底拱顶 */}
      <path d={`M${x - w / 2} ${floor + 30} V${y + 90} Q${x - w / 2} ${y + 40} ${x - w / 2 + 60} ${y + 40} H${x + w / 2 - 60} Q${x + w / 2} ${y + 40} ${x + w / 2} ${y + 90} V${floor + 30} Z`} fill="#0b0e12" stroke="rgba(185,215,238,0.5)" strokeWidth={3} />
      <ellipse cx={x} cy={floor - depth * 0.3} rx={w * 0.45} ry={depth * 0.4} fill={`url(#${id}-g)`} opacity={1 - dark} />
      {/* 井口 */}
      <rect x={x - 46} y={y - 4} width={92} height={48} fill="#0b0e12" stroke="rgba(185,215,238,0.45)" strokeWidth={2} />
      {Array.from({length: cols * rows}, (_, k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const at = fillAt[k] ?? -999;
        const t = clamp01((f - at) / 8);
        if (t <= 0) return null;
        const bx = x - inner / 2 + cw * (c + 0.5);
        const by = floor - r * (bh + 14) - (1 - t * t) * (floor - y);
        return (
          <g key={k} transform={`translate(${bx} ${by})`} opacity={(1 - dark * 0.75) * Math.min(1, t * 2)}>
            <IceBlockG w={bw} h={bh} d={bw * 0.28} melt={melt[k] ?? 0} glow={(1 - dark) * 0.4} />
          </g>
        );
      })}
      {label && (
        <g opacity={1 - dark * 0.5}>
          <rect x={x + 70} y={y - 150} width={64} height={130} fill="#3a2a1c" stroke={L.gold} strokeWidth={2} />
          {Array.from(label).map((ch, i) => (
            <text key={i} x={x + 102} y={y - 112 + i * 44} textAnchor="middle" fontFamily={LF.serif} fontWeight={900} fontSize={36} fill={L.goldHot}>
              {ch}
            </text>
          ))}
        </g>
      )}
    </Layer>
  );
};

/**
 * 青布伞摊（舞台坐标，脚下中点）：一把青布大伞 + 床凳 + 一排碗堆；litAt 起伞下亮起暖光（10 帧）、碗口冒白气；
 * scale 缩放（远处的小一些），sign 伞柄上挂的小字牌（竖排）。
 */
export const UmbrellaStall: React.FC<{f: number; x: number; y: number; scale?: number; litAt?: number; sign?: string; seed?: number; opacity?: number}> = ({f, x, y, scale = 1, litAt, sign, seed = 1, opacity = 1}) => {
  const lit = litAt === undefined ? 0 : clamp01((f - litAt) / 10);
  const pop = litAt !== undefined && f >= litAt && f < litAt + 10 ? Math.sin(((f - litAt) / 10) * Math.PI) * 0.06 : 0;
  const R = 190;
  return (
    <Layer opacity={opacity}>
      <defs>
        <radialGradient id={`stall-g-${seed}`}>
          <stop offset="0" stopColor="rgba(255,190,110,0.55)" />
          <stop offset="1" stopColor="rgba(255,190,110,0)" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${scale * (1 + pop)})`}>
        <ellipse cx={0} cy={-150} rx={300} ry={200} fill={`url(#stall-g-${seed})`} opacity={lit} />
        {/* 伞柄 */}
        <line x1={-20} y1={0} x2={-20} y2={-330} stroke="#7a5a36" strokeWidth={8} />
        {/* 伞面：青布，几道伞骨 */}
        <path d={`M${-20 - R} -300 Q-20 -420 ${-20 + R} -300 Z`} fill={lit > 0 ? ICE.clothHi : ICE.cloth} opacity={0.6 + 0.4 * lit} stroke="rgba(239,230,214,0.35)" strokeWidth={2} />
        {[-0.66, -0.33, 0, 0.33, 0.66].map((u, i) => (
          <line key={i} x1={-20} y1={-378} x2={-20 + u * R * 1.05} y2={-300} stroke="rgba(239,230,214,0.3)" strokeWidth={2} />
        ))}
        <path d={`M${-20 - R} -300 ${Array.from({length: 8}, (_, i) => `Q${-20 - R + (i + 0.5) * (R / 4)} -286 ${-20 - R + (i + 1) * (R / 4)} -300`).join(' ')}`} fill="none" stroke={ICE.clothHi} strokeWidth={3} opacity={0.8} />
        {/* 床凳 */}
        <rect x={-150} y={-92} width={300} height={16} fill="#6b4a2c" />
        <line x1={-130} y1={-76} x2={-130} y2={0} stroke="#5a3d24" strokeWidth={8} />
        <line x1={130} y1={-76} x2={130} y2={0} stroke="#5a3d24" strokeWidth={8} />
        {/* 碗堆 */}
        {[-95, -32, 32, 95].map((bx, i) => (
          <g key={i} transform={`translate(${bx} -92)`}>
            <BowlG w={52} />
            {i % 2 === 0 && (
              <g transform="translate(0 -20)">
                <MistG f={f} w={50} h={70} n={3} seed={seed * 5 + i} on={lit} />
              </g>
            )}
          </g>
        ))}
        {sign && (
          <g opacity={0.5 + 0.5 * lit}>
            <rect x={-6} y={-262} width={36} height={Array.from(sign).length * 30 + 14} fill="#e9dcc0" stroke={L.seal} strokeWidth={2} />
            {Array.from(sign).map((ch, i) => (
              <text key={i} x={12} y={-236 + i * 30} textAnchor="middle" fontFamily={LF.serif} fontWeight={900} fontSize={24} fill="#2a1a10">
                {ch}
              </text>
            ))}
          </g>
        )}
      </g>
    </Layer>
  );
};

/** 挑冰担的人（舞台坐标，脚下中点）：象形小人挑一根扁担，两头各吊一只竹筐，筐里一块冰；shout 喊话姿势，walk 迈步 */
export const IceCarrier: React.FC<{f: number; x: number; y: number; scale?: number; walk?: boolean; shout?: boolean; flip?: boolean; opacity?: number}> = ({f, x, y, scale = 1, walk, shout, flip, opacity = 1}) => {
  const half = 200 * scale;
  const sy = y - 175 * scale;
  const bob = walk ? Math.abs(Math.sin(f / 4)) * 6 : 0;
  const bend = 18 + bob;
  return (
    <>
      <Figure f={f} x={x} y={y} scale={scale} walk={walk} pose={shout ? 'shout' : 'stand'} flip={flip} opacity={opacity} />
      <Layer opacity={opacity}>
        <path d={`M${x - half} ${sy + bend} Q${x} ${sy - bend * 0.2} ${x + half} ${sy + bend}`} fill="none" stroke="#8a6a3e" strokeWidth={9 * scale} strokeLinecap="round" />
        {[-1, 1].map((side) => {
          const ax = x + side * (half - 14 * scale);
          const ay = sy + bend;
          return (
            <g key={side}>
              <line x1={ax - 30 * scale} y1={ay + 70 * scale} x2={ax} y2={ay} stroke="rgba(239,230,214,0.5)" strokeWidth={2} />
              <line x1={ax + 30 * scale} y1={ay + 70 * scale} x2={ax} y2={ay} stroke="rgba(239,230,214,0.5)" strokeWidth={2} />
              <g transform={`translate(${ax} ${ay + 118 * scale})`}>
                <IceBlockG w={66 * scale} h={44 * scale} d={22 * scale} glow={0.5} />
                <path d={`M${-44 * scale} ${-30 * scale} L${-36 * scale} ${4 * scale} H${44 * scale} L${50 * scale} ${-30 * scale}`} fill="rgba(122,90,50,0.85)" stroke="#a07a48" strokeWidth={2} />
              </g>
            </g>
          );
        })}
      </Layer>
    </>
  );
};

/**
 * 一排水牌菜单（舞台坐标）：木横梁下挂 n 块竖牌，每块竖排一个名字；litAt[i] 起这一块亮起（金字 + 背后闪光 + 往下一顿），
 * 没亮的淡淡露着（dim）。x0–x1 横梁两端，y 横梁高度。
 */
export const MenuBoards: React.FC<{f: number; at: number; names: string[]; litAt: (number | undefined)[]; x0?: number; x1?: number; y?: number; dim?: number; out?: number}> = ({
  f,
  at,
  names,
  litAt,
  x0 = 110,
  x1 = 1810,
  y = 600,
  dim = 0.35,
  out,
}) => {
  const a = fadeSoft(f, at, 16, out);
  if (a.v <= 0) return null;
  const n = names.length;
  const step = (x1 - x0) / n;
  const bw = step * 0.8;
  const fs = Math.min(40, bw * 0.62);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        <rect x={x0 - 20} y={y - 18} width={x1 - x0 + 40} height={16} rx={4} fill="#6b4a2c" />
        {names.map((_, i) => {
          const cx = x0 + step * (i + 0.5);
          return <line key={i} x1={cx} x2={cx} y1={y - 2} y2={y + 18} stroke="rgba(239,230,214,0.4)" strokeWidth={2} />;
        })}
      </svg>
      {names.map((name, i) => {
        const t = litAt[i];
        const v = t === undefined ? 0 : clamp01((f - t) / 6);
        const drop = t !== undefined && f >= t && f < t + 8 ? Math.sin(((f - t) / 8) * Math.PI) * 14 : 0;
        const flash = t !== undefined && f >= t && f < t + 14 ? 1 - (f - t) / 14 : 0;
        const cx = x0 + step * (i + 0.5);
        const chars = Array.from(name);
        const h = chars.length * fs * 1.06 + 34;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - bw / 2,
              top: y + 18 + drop,
              width: bw,
              height: h,
              borderRadius: 4,
              background: v > 0 ? `rgba(${Math.round(60 + 30 * v)},${Math.round(44 + 20 * v)},${Math.round(28 + 6 * v)},0.95)` : 'rgba(40,30,22,0.9)',
              border: `2px solid ${v > 0 ? L.gold : 'rgba(239,230,214,0.25)'}`,
              boxShadow: flash > 0 ? `0 0 ${40 * flash}px rgba(255,217,138,${0.9 * flash})` : v > 0 ? '0 0 14px rgba(237,174,80,0.35)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: v > 0 ? 1 : dim,
            }}
          >
            {chars.map((c, ci) => (
              <div key={ci} style={{fontFamily: LF.serif, fontWeight: 900, fontSize: fs, lineHeight: 1.06, color: v > 0 ? L.goldHot : L.ink, textShadow}}>
                {c}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
