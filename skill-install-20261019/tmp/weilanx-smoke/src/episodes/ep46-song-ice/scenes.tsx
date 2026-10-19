import React from 'react';
import {clamp01, rand} from '../../library/anim';
import {L, LF, textShadow} from '../../library/lamplight/theme';

/** ep46 本期件：雪夜山谷（凿冰的地方）、季节进度条、冰井口、冰箱、隔水的声波。 */

const Svg: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    {children}
  </svg>
);

/** 雪夜山谷：远山剪影、一片冻住的河面（冰蓝反光）、按帧飘落的雪；ice 冰面在画面里的高度 */
export const SnowValley: React.FC<{f: number; seed?: number; ice?: number; snow?: number}> = ({f, seed = 1, ice = 820, snow = 1}) => {
  const ridge = (y0: number, amp: number, s: number) => {
    const pts: string[] = [`0,1080`, `0,${y0}`];
    for (let i = 0; i <= 12; i++) pts.push(`${i * 160},${y0 - rand(s + i) * amp}`);
    pts.push(`1920,${y0}`, `1920,1080`);
    return pts.join(' ');
  };
  return (
    <Svg>
      <defs>
        <linearGradient id="sv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06090d" />
          <stop offset="1" stopColor="#141b23" />
        </linearGradient>
        <linearGradient id="sv-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(170,215,240,0.45)" />
          <stop offset="1" stopColor="rgba(120,170,205,0.15)" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sv-sky)" />
      <polygon points={ridge(560, 180, seed * 11)} fill="#10151b" />
      <polygon points={ridge(660, 140, seed * 17)} fill="#0c1015" />
      <polygon points={`0,${ice - 40} 1920,${ice - 70} 1920,1080 0,1080`} fill="#d8e2ea" opacity={0.1} />
      <polygon points={`200,${ice} 1720,${ice - 30} 1920,1080 0,1080`} fill="url(#sv-ice)" />
      {Array.from({length: 7}, (_, i) => (
        <line key={i} x1={260 + i * 220} y1={ice + 30 + (i % 3) * 60} x2={420 + i * 220} y2={ice + 22 + (i % 3) * 60} stroke="rgba(240,250,255,0.35)" strokeWidth={3} strokeLinecap="round" />
      ))}
      {snow > 0 &&
        Array.from({length: 70}, (_, i) => {
          const sp = 1.2 + rand(seed * 3 + i) * 1.8;
          const y = ((f * sp + rand(seed * 5 + i) * 1180) % 1180) - 50;
          const x = rand(seed * 7 + i) * 1920 + Math.sin(f / 30 + i) * 20;
          return <circle key={i} cx={x} cy={y} r={2 + rand(i + 0.5) * 3} fill="#eef4f8" opacity={snow * (0.35 + rand(i + 0.7) * 0.5)} />;
        })}
    </Svg>
  );
};

/** 冰面裂开：at 起从 (x, y) 往外画出几道裂纹（8 帧） */
export const IceCrack: React.FC<{f: number; at: number; x: number; y: number; seed?: number}> = ({f, at, x, y, seed = 1}) => {
  const p = clamp01((f - at) / 8);
  if (p <= 0) return null;
  return (
    <Svg>
      {Array.from({length: 6}, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + rand(seed + i) * 0.6;
        const len = (80 + rand(seed * 2 + i) * 120) * p;
        const mx = x + Math.cos(a) * len * 0.5 + (rand(seed + i * 3) - 0.5) * 20;
        const my = y + Math.sin(a) * len * 0.22;
        return <path key={i} d={`M${x} ${y} L${mx} ${my} L${x + Math.cos(a) * len} ${y + Math.sin(a) * len * 0.4}`} stroke="#f2fbff" strokeWidth={3} fill="none" opacity={0.9} />;
      })}
    </Svg>
  );
};

/** 季节进度条：一排季节名，第 i 个在 at[i] 帧亮起，亮着的之间有一条金线连过去 */
export const SeasonStrip: React.FC<{f: number; x0: number; x1: number; y: number; items: string[]; at: number[]}> = ({f, x0, x1, y, items, at}) => {
  const step = (x1 - x0) / (items.length - 1);
  const lit = at.filter((a) => f >= a).length;
  const lastP = lit > 0 ? clamp01((f - at[lit - 1]) / 10) : 0;
  const lineTo = lit <= 1 ? x0 : x0 + step * (lit - 2) + step * lastP;
  if (f < at[0] - 2) return null;
  return (
    <>
      <Svg>
        <line x1={x0} x2={x1} y1={y} y2={y} stroke="rgba(239,230,214,0.25)" strokeWidth={3} />
        <line x1={x0} x2={lineTo} y1={y} y2={y} stroke={L.gold} strokeWidth={5} />
        {items.map((_, i) => (
          <circle key={i} cx={x0 + step * i} cy={y} r={i < lit ? 12 : 7} fill={i < lit ? L.goldHot : 'rgba(239,230,214,0.4)'} />
        ))}
      </Svg>
      {items.map((t, i) => (
        <div key={i} style={{position: 'absolute', left: x0 + step * i - 120, width: 240, top: y + 26, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: 46, color: i < lit ? L.ink : 'rgba(239,230,214,0.3)', textShadow}}>
          {t}
        </div>
      ))}
    </>
  );
};

/** 地面上一排冰井口（石圈 + 井里冰蓝的光），第 i 口在 darkAt[i] 帧熄掉 */
export const WellMouths: React.FC<{f: number; xs: number[]; y: number; darkAt: number[]}> = ({f, xs, y, darkAt}) => (
  <Svg>
    <defs>
      <radialGradient id="wm-g">
        <stop offset="0" stopColor="rgba(160,215,245,0.8)" />
        <stop offset="1" stopColor="rgba(160,215,245,0)" />
      </radialGradient>
    </defs>
    {xs.map((x, i) => {
      const s = 0.7 + (i % 2) * 0.12 + (x / 1920) * 0.3;
      const on = 1 - clamp01((f - darkAt[i]) / 14);
      return (
        <g key={i} transform={`translate(${x} ${y + (i % 2) * 40}) scale(${s})`}>
          <ellipse cx={0} cy={-80} rx={170} ry={120} fill="url(#wm-g)" opacity={on * 0.8} />
          <ellipse cx={0} cy={0} rx={110} ry={34} fill="#2a2520" stroke="rgba(239,230,214,0.45)" strokeWidth={3} />
          <ellipse cx={0} cy={-2} rx={78} ry={22} fill={on > 0.05 ? `rgba(180,225,250,${0.25 + 0.6 * on})` : '#07080a'} />
          <rect x={-110} y={0} width={220} height={40} fill="#211c18" />
          <ellipse cx={0} cy={40} rx={110} ry={30} fill="#1a1613" />
        </g>
      );
    })}
  </Svg>
);

/** 冰箱（简笔、冷光），at 起淡入亮起 */
export const Fridge: React.FC<{f: number; at: number; x: number; y: number; scale?: number}> = ({f, at, x, y, scale = 1}) => {
  const a = clamp01((f - at) / 10);
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x - 110 * scale, top: y - 380 * scale, width: 220 * scale, height: 380 * scale, opacity: a}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 22 * scale, background: 'linear-gradient(180deg, #dfe8ee, #b8c7d2)', boxShadow: `0 0 ${60 * a}px rgba(143,195,232,0.55)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 128 * scale, height: 4 * scale, background: '#8c9ca8'}} />
      <div style={{position: 'absolute', left: 22 * scale, top: 50 * scale, width: 10 * scale, height: 60 * scale, borderRadius: 5 * scale, background: '#6d7d89'}} />
      <div style={{position: 'absolute', left: 22 * scale, top: 160 * scale, width: 10 * scale, height: 110 * scale, borderRadius: 5 * scale, background: '#6d7d89'}} />
    </div>
  );
};

/** 隔水传来的声波：at 起从 (x, y) 往 dir 方向一圈圈扩开的弧（每 10 帧一圈） */
export const SoundWaves: React.FC<{f: number; at: number; x: number; y: number; dir?: 1 | -1; n?: number}> = ({f, at, x, y, dir = -1, n = 4}) => {
  if (f < at) return null;
  return (
    <Svg>
      {Array.from({length: n}, (_, i) => {
        const t = (f - at - i * 10) / 40;
        if (t < 0 || t > 1) return null;
        const r = 60 + t * 520;
        const a0 = Math.PI - 0.5;
        const a1 = Math.PI + 0.5;
        const sx = dir < 0 ? Math.cos(a0) : -Math.cos(a0);
        const ex = dir < 0 ? Math.cos(a1) : -Math.cos(a1);
        return (
          <path
            key={i}
            d={`M${x + sx * r} ${y + Math.sin(a0) * r} A${r} ${r} 0 0 ${dir < 0 ? 1 : 0} ${x + ex * r} ${y + Math.sin(a1) * r}`}
            stroke={L.goldHot}
            strokeWidth={6}
            fill="none"
            opacity={(1 - t) * 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
};

/** 一条河（横向带状，波纹按帧流动） */
export const River: React.FC<{f: number; y: number; h?: number}> = ({f, y, h = 160}) => (
  <Svg>
    <rect x={0} y={y} width={1920} height={h} fill="rgba(60,90,110,0.35)" />
    {Array.from({length: 18}, (_, i) => {
      const x = ((i * 137 + f * 1.5) % 2100) - 100;
      const yy = y + 20 + (i % 4) * (h - 40) / 4;
      return <line key={i} x1={x} x2={x + 70} y1={yy} y2={yy} stroke="rgba(185,215,238,0.4)" strokeWidth={3} strokeLinecap="round" />;
    })}
  </Svg>
);
