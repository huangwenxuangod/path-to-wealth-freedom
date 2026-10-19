import React from 'react';
import {rand} from '../anim';
import {shadow} from './props';
import {V, VF} from './theme';

/* ============ 贴纸与桌面杂物：让拼贴桌面「有人在用」 ============ */

/** 模切贴纸：给任意透明底图形（通常是 SVG）描一圈白边 + 弱投影 */
export const Sticker: React.FC<{rot?: number; edge?: number; children: React.ReactNode}> = ({rot = 0, edge = 5, children}) => (
  <div
    style={{
      display: 'inline-block',
      transform: `rotate(${rot}deg)`,
      filter: `drop-shadow(${edge}px 0 0 #fff) drop-shadow(-${edge}px 0 0 #fff) drop-shadow(0 ${edge}px 0 #fff) drop-shadow(0 -${edge}px 0 #fff) ${shadow}`,
    }}
  >
    {children}
  </div>
);

/** 便利贴：冷知识、批注。head 是红色小标题 */
export const PostIt: React.FC<{w?: number; rot?: number; head?: string; size?: number; color?: string; children: React.ReactNode}> = ({w = 300, rot = 3, head, size = 26, color = '#f2df7b', children}) => (
  <div style={{width: w, transform: `rotate(${rot}deg)`, filter: shadow}}>
    <div style={{background: color, padding: '18px 20px 22px', clipPath: 'polygon(0 0, 100% 0, 100% 92%, 93% 100%, 0 100%)', backgroundImage: 'linear-gradient(rgba(0,0,0,0.06), transparent 18%)'}}>
      {head && <div style={{fontFamily: VF.heavy, fontSize: size * 0.8, color: V.red, marginBottom: 6}}>{head}</div>}
      <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: size, lineHeight: 1.45, color: V.ink}}>{children}</div>
    </div>
  </div>
);

/** 橡皮图章：红框红字，带一点斑驳 */
export const Stamp: React.FC<{children: React.ReactNode; size?: number; rot?: number; color?: string; round?: boolean}> = ({children, size = 44, rot = -8, color = V.red, round}) => (
  <div
    style={{
      display: 'inline-block',
      transform: `rotate(${rot}deg)`,
      border: `${Math.max(3, size / 10)}px ${round ? 'double' : 'solid'} ${color}`,
      borderRadius: round ? '50%' : 6,
      padding: round ? `${size * 0.7}px ${size * 0.4}px` : `2px ${size * 0.35}px`,
      color,
      fontFamily: VF.heavy,
      fontSize: size,
      lineHeight: 1.1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      opacity: 0.85,
      filter: 'url(#voxRough)',
    }}
  >
    {children}
  </div>
);

/** 图钉：钉在卡片上方 */
export const Pushpin: React.FC<{color?: string; size?: number}> = ({color = V.red, size = 34}) => (
  <svg width={size} height={size} viewBox="0 0 34 34" style={{overflow: 'visible', filter: 'drop-shadow(3px 5px 3px rgba(23,23,22,0.35))'}}>
    <circle cx={17} cy={15} r={13} fill={color} />
    <circle cx={12} cy={10} r={4} fill="rgba(255,255,255,0.45)" />
  </svg>
);

/** 一排小人图标：前 lit 个上色，其余变灰（用来数人数、「一个个亮起来」） */
export const People: React.FC<{n: number; size?: number; color?: string; lit?: number}> = ({n, size = 34, color = V.ink, lit = n}) => (
  <svg width={n * size * 0.9} height={size * 1.5} viewBox={`0 0 ${n * 30} 50`}>
    {Array.from({length: n}, (_, i) => (
      <g key={i} transform={`translate(${i * 30} 0)`} fill={i < lit ? color : 'rgba(23,23,22,0.18)'}>
        <circle cx={15} cy={11} r={8} />
        <path d="M2 50 Q3 22 15 22 Q27 22 28 50 Z" />
      </g>
    ))}
  </svg>
);

/** 折线：up 往上，否则往下 */
export const Trend: React.FC<{up?: boolean; label?: string}> = ({up, label}) => (
  <div style={{width: 260, background: '#fff', padding: 10, boxSizing: 'border-box'}}>
    <svg width={240} height={150} viewBox="0 0 240 150">
      <path d="M20 10 L20 136 L230 136" stroke={V.ink} strokeWidth={4} fill="none" />
      <path d={up ? 'M28 120 L80 110 L120 116 L160 70 L220 22' : 'M28 40 L80 30 L120 54 L160 50 L220 124'} stroke={V.red} strokeWidth={8} fill="none" strokeLinejoin="round" />
      <path d={up ? 'M200 18 L222 20 L216 42' : 'M200 128 L222 126 L214 106'} stroke={V.red} strokeWidth={8} fill="none" />
    </svg>
    {label && <div style={{fontFamily: VF.heavy, fontSize: 24, color: V.ink, textAlign: 'center'}}>{label}</div>}
  </div>
);

/* ---------- 桌面杂物（铺在最底层，被卡片压住也没关系） ---------- */

const CoffeeRing: React.FC<{r: number}> = ({r}) => (
  <svg width={r * 2 + 20} height={r * 2 + 20} style={{overflow: 'visible', opacity: 0.32}}>
    <circle cx={r + 10} cy={r + 10} r={r} fill="none" stroke="#8a5a2b" strokeWidth={7} strokeDasharray={`${r * 4} ${r * 0.35} ${r * 1.2} ${r * 0.2}`} />
    <circle cx={r + 14} cy={r + 7} r={r - 6} fill="none" stroke="#8a5a2b" strokeWidth={2} opacity={0.6} />
  </svg>
);

const PaperClip: React.FC = () => (
  <svg width={40} height={110} viewBox="0 0 40 110" style={{overflow: 'visible'}}>
    <path d="M28 30 L28 88 Q28 102 18 102 Q8 102 8 88 L8 20 Q8 6 20 6 Q32 6 32 20 L32 80" fill="none" stroke="#8d8f93" strokeWidth={4.5} strokeLinecap="round" />
  </svg>
);

const Pencil: React.FC = () => (
  <svg width={300} height={24} viewBox="0 0 300 24" style={{filter: shadow}}>
    <rect x={30} y={3} width={240} height={18} fill="#d9a52b" />
    <rect x={30} y={3} width={240} height={6} fill="#e8bd4f" />
    <rect x={270} y={3} width={18} height={18} fill="#b9b4ab" />
    <rect x={288} y={3} width={12} height={18} rx={4} fill="#d48a8a" />
    <path d="M30 3 L0 12 L30 21 Z" fill="#ead2a8" />
    <path d="M9 9.3 L0 12 L9 14.7 Z" fill="#333" />
  </svg>
);

const Scrap: React.FC<{seed: number}> = ({seed}) => (
  <div style={{width: 120 + rand(seed) * 120, height: 60 + rand(seed + 1) * 60, background: rand(seed + 2) > 0.5 ? V.paperWarm : '#e9e3d2', opacity: 0.7, clipPath: 'polygon(0 8%, 30% 0, 70% 6%, 100% 0, 96% 60%, 100% 100%, 50% 92%, 0 100%, 4% 50%)'}} />
);

/** 一整张桌面的杂物：咖啡渍、回形针、铅笔、碎纸片，按种子撒在 [x0, x1] × [y0, y1] */
export const DeskLitter: React.FC<{x0: number; x1: number; y0: number; y1: number; count: number; seed?: number}> = ({x0, x1, y0, y1, count, seed = 1}) => (
  <>
    {Array.from({length: count}, (_, i) => {
      const s = seed * 100 + i * 7.31;
      const kind = Math.floor(rand(s) * 4);
      const x = x0 + ((i + rand(s + 1) * 0.8) / count) * (x1 - x0);
      const y = y0 + rand(s + 2) * (y1 - y0);
      const rot = (rand(s + 3) - 0.5) * 70;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`}}>
          {kind === 0 ? <CoffeeRing r={60 + rand(s + 4) * 40} /> : kind === 1 ? <PaperClip /> : kind === 2 ? <Pencil /> : <Scrap seed={s} />}
        </div>
      );
    })}
  </>
);
