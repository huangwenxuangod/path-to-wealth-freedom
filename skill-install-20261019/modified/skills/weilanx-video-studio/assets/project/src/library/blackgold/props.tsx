import React from 'react';
import {clamp01, rand} from '../anim';
import {B, BF, blurIn, glowText, neon} from './theme';

/**
 * 黑金光影风的道具：聚光灯、发光小人、审讯室小间、剧场舞台和观众剪影、霓虹描边卡片、小店雨棚卡。
 * 坐标都是 1920×1080 舞台坐标。
 */

const Layer: React.FC<{opacity?: number; children: React.ReactNode}> = ({opacity = 1, children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity}}>
    {children}
  </svg>
);

/** 聚光灯（SVG <g>）：灯头在 (x, y)，光锥往下 h、底宽 w，on 0–1 亮度 */
export const SpotlightG: React.FC<{x: number; y: number; w?: number; h?: number; on?: number; id: string}> = ({x, y, w = 260, h = 360, on = 1, id}) => (
  <g opacity={on}>
    <defs>
      <linearGradient id={`sp-${id}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,236,190,0.55)" />
        <stop offset="100%" stopColor="rgba(255,220,160,0.04)" />
      </linearGradient>
    </defs>
    <path d={`M${x - 10} ${y} L${x + 10} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z`} fill={`url(#sp-${id})`} />
    <circle cx={x} cy={y} r={16} fill="#fff4d0" style={{filter: 'drop-shadow(0 0 16px rgba(255,230,170,0.9))'}} />
  </g>
);

/** 发光小人（SVG <g>，脚底中心在原点）：圆头 + 半椭圆肩膀；tone 'lit' 亮米黄 / 'dim' 暗灰褐 / 'cyan' / 'red'；size 高度约 size */
export const GlowPawnG: React.FC<{tone?: 'lit' | 'dim' | 'cyan' | 'red'; size?: number}> = ({tone = 'lit', size = 150}) => {
  const c = {lit: '#fff1c4', dim: '#9c8a74', cyan: B.cyan, red: B.red}[tone];
  const glow = tone === 'dim' ? undefined : `drop-shadow(0 0 ${size * 0.12}px ${c})`;
  const s = size / 150;
  return (
    <g transform={`scale(${s})`} style={{filter: glow}}>
      <circle cx={0} cy={-112} r={30} fill={c} />
      <path d="M-62 0 C-62 -52 -36 -72 0 -72 C36 -72 62 -52 62 0 Z" fill={c} />
    </g>
  );
};

/**
 * 审讯室小间：细金边框 + 顶上一盏聚光灯 + 中间一个发光小人 + 下方小字标签；tone 小人颜色，lit 0–1 灯的亮度。
 * (x, y) 是小间左上角，w / h 尺寸。
 */
export const Booth: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; tone?: 'lit' | 'dim' | 'cyan' | 'red'; lit?: number; label?: string; out?: number; id: string}> = ({
  f,
  at,
  x,
  y,
  w = 360,
  h = 330,
  tone = 'lit',
  lit = 1,
  label,
  out,
  id,
}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  return (
    <>
      <Layer opacity={a.opacity}>
        <rect x={x} y={y} width={w} height={h} fill="rgba(0,0,0,0.35)" stroke={B.goldLine} strokeWidth={1.5} />
        <SpotlightG x={x + w / 2} y={y + 8} w={w * 0.72} h={h - 20} on={lit} id={id} />
        <g transform={`translate(${x + w / 2} ${y + h - 18})`}>
          <GlowPawnG tone={tone} size={h * 0.46} />
        </g>
      </Layer>
      {label && <div style={{position: 'absolute', left: x, width: w, top: y + h + 14, textAlign: 'center', fontFamily: BF.cn, fontWeight: 900, fontSize: 26, opacity: a.opacity, ...glowText(B.goldWarm, 8, 0.6)}}>{label}</div>}
    </>
  );
};

/**
 * 剧场舞台：红色幕布开口，里面一团明亮的暖光 + 一个张开双臂的小剪影；(x, y) 舞台开口左上角，w / h 尺寸，glow 0–1 台上光的亮度。
 */
export const TheaterStage: React.FC<{x: number; y: number; w?: number; h?: number; glow?: number}> = ({x, y, w = 760, h = 360, glow = 1}) => (
  <Layer>
    <defs>
      <radialGradient id="ts-glow" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stopColor={`rgba(255,236,190,${glow})`} />
        <stop offset="45%" stopColor={`rgba(240,170,80,${0.8 * glow})`} />
        <stop offset="100%" stopColor="rgba(120,40,20,0.6)" />
      </radialGradient>
    </defs>
    <rect x={x - 20} y={y - 24} width={w + 40} height={h + 24} fill="#2a0c08" stroke="rgba(229,201,145,0.4)" strokeWidth={2} />
    <rect x={x} y={y} width={w} height={h} fill="url(#ts-glow)" />
    <path d={`M${x} ${y} Q${x + w * 0.12} ${y + h * 0.5} ${x + w * 0.05} ${y + h} L${x} ${y + h} Z`} fill="#8e1f17" />
    <path d={`M${x + w} ${y} Q${x + w * 0.88} ${y + h * 0.5} ${x + w * 0.95} ${y + h} L${x + w} ${y + h} Z`} fill="#8e1f17" />
    <path d={`M${x} ${y} Q${x + w / 2} ${y + 40} ${x + w} ${y} Z`} fill="#6a150f" />
    <g transform={`translate(${x + w / 2} ${y + h - 10})`} fill="#3b2414">
      <circle cx={0} cy={-120} r={18} />
      <path d="M-22 -100 L22 -100 L16 0 L-16 0 Z" />
      <line x1={-18} y1={-96} x2={-60} y2={-140} stroke="#3b2414" strokeWidth={9} strokeLinecap="round" />
      <line x1={18} y1={-96} x2={60} y2={-140} stroke="#3b2414" strokeWidth={9} strokeLinecap="round" />
    </g>
  </Layer>
);

/**
 * 剧场观众剪影：rows 排很大的圆头肩膀剪影（前排最大最黑、挡住舞台下沿），standAt[k] 是第 k 排（从前往后）站起来的帧——站起来的人往上抬一截；
 * 离舞台越近的头顶，暖色轮廓光越亮。y0 最前排的底边。
 */
export const Silhouettes: React.FC<{f: number; rows?: number; y0?: number; standAt?: (number | undefined)[]; seed?: number}> = ({f, rows = 3, y0 = 1120, standAt = [], seed = 3}) => (
  <Layer>
    {Array.from({length: rows}, (_, k0) => {
      const k = rows - 1 - k0; // 先画后排
      const scale = 2.3 - k * 0.55; // 前排很大、很近，挡住舞台下沿
      const yBase = y0 - k * 150;
      const at = standAt[k];
      const up = at === undefined ? 0 : (1 - Math.pow(1 - clamp01((f - at) / 12), 3)) * 90 * scale;
      const gap = 150 * scale;
      const n = Math.ceil(1920 / gap) + 2;
      const fill = k === 0 ? '#050302' : k === 1 ? '#0a0604' : '#110a06';
      return (
        <g key={k}>
          {Array.from({length: n}, (_, i) => {
            const x = i * gap - gap * 0.5 + (k % 2) * gap * 0.5 + (rand(seed + k * 50 + i) - 0.5) * 30;
            const y = yBase - up - rand(seed + k * 70 + i) * 12;
            // 离舞台（画面中间）越近，头顶的暖色轮廓光越亮
            const rim = Math.max(0, 1 - Math.abs(x - 960) / 700) * (0.55 - k * 0.12) + 0.08;
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
                <circle cx={0} cy={-92} r={26} fill={fill} stroke={`rgba(255,176,96,${rim})`} strokeWidth={1.4} />
                <path d="M-54 0 C-54 -46 -30 -64 0 -64 C30 -64 54 -46 54 0 Z" fill={fill} stroke={`rgba(255,176,96,${rim * 0.6})`} strokeWidth={1.2} />
              </g>
            );
          })}
        </g>
      );
    })}
  </Layer>
);

/** 霓虹描边卡片（div）：color 边框色，on 0–1 亮度，children 卡内内容 */
export const GlowCard: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; color?: string; out?: number; children?: React.ReactNode}> = ({f, at, x, y, w, h, color = B.goldWarm, out, children}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 6, background: 'rgba(10,7,5,0.7)', ...neon(color, a.v), opacity: a.opacity, filter: a.filter}}>
      {children}
    </div>
  );
};

/**
 * 小店雨棚卡：红白（或青白）条纹雨棚 + 店名 + 大价格 + 一条「利润」发光条（profit 0–1）；价格跳变时传新的 price。
 */
export const Awning: React.FC<{f: number; at: number; x: number; y: number; name: string; price: string; tone?: 'red' | 'teal'; profit?: number; out?: number}> = ({f, at, x, y, name, price, tone = 'red', profit = 1, out}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const stripe = tone === 'red' ? '#d9473a' : '#3fb6aa';
  const w = 360;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: a.opacity, filter: a.filter}}>
      <div style={{textAlign: 'center', fontFamily: BF.cn, fontWeight: 900, fontSize: 26, marginBottom: 8, ...glowText(B.goldWarm, 8, 0.6)}}>{name}</div>
      <svg width={w} height={70} style={{display: 'block'}}>
        {Array.from({length: 6}, (_, i) => (
          <path key={i} d={`M${i * (w / 6)} 0 L${(i + 1) * (w / 6)} 0 L${(i + 1) * (w / 6)} 46 Q${(i + 0.5) * (w / 6)} 70 ${i * (w / 6)} 46 Z`} fill={i % 2 ? '#f4ece0' : stripe} />
        ))}
      </svg>
      <div style={{border: `1.5px solid ${B.goldLine}`, background: 'rgba(10,7,5,0.7)', padding: '18px 0 24px', textAlign: 'center'}}>
        <div style={{fontFamily: BF.latinBold, fontSize: 84, lineHeight: 1, ...glowText(B.ink, 14, 0.6)}}>{price}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, margin: '18px 30px 0'}}>
          <span style={{fontFamily: BF.cn, fontSize: 20, color: B.inkDim}}>利润</span>
          <div style={{flex: 1, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)'}}>
            <div style={{width: `${100 * clamp01(profit)}%`, height: '100%', borderRadius: 5, background: B.cyan, boxShadow: `0 0 12px ${B.cyan}`}} />
          </div>
        </div>
      </div>
    </div>
  );
};

