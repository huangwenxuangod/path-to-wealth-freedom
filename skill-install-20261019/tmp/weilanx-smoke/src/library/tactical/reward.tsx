import React from 'react';
import {clamp01, easeInOut, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 奖赏 / 上头示意（ep43 起）：
 * SlotReels 原创两转轮（左轮玩家选图案，右轮转动后停在「正中 / 偏一格 / 差很远」）；
 * BrainGlow 抽象脑轮廓 + 中间「奖赏回路」节点按 lit 发光（示意，不画真实解剖）；
 * LobbyButton 「再来一局」按钮 + 鼠标移过去点下（或挪开）；
 * ScoreLine 大比分 + 一排回合点（你赢的青、输的红）。
 * 都画在整屏 1920×1080 的 SVG / 绝对定位里，坐标是屏幕像素。
 */

/** 6 个原创图案（几何形状，不画任何老虎机品牌图案） */
const ICON_COLORS = [T.orange, T.cyan, T.green, T.red, '#b48cff', '#ffd27a'];
const Icon: React.FC<{k: number; x: number; y: number; s: number; dim?: number}> = ({k, x, y, s, dim = 1}) => {
  const c = ICON_COLORS[((k % 6) + 6) % 6];
  const r = s * 0.36;
  const kk = ((k % 6) + 6) % 6;
  const common = {fill: 'none', stroke: c, strokeWidth: 6, opacity: dim};
  if (kk === 0) return <circle cx={x} cy={y} r={r} {...common} />;
  if (kk === 1) return <polygon points={`${x},${y - r} ${x + r},${y + r * 0.8} ${x - r},${y + r * 0.8}`} {...common} />;
  if (kk === 2) return <rect x={x - r * 0.8} y={y - r * 0.8} width={r * 1.6} height={r * 1.6} {...common} />;
  if (kk === 3) return <polygon points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`} {...common} />;
  if (kk === 4) return <path d={`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`} {...common} />;
  return <polygon points={Array.from({length: 6}, (_, i) => `${x + r * Math.cos((i * Math.PI) / 3)},${y + r * Math.sin((i * Math.PI) / 3)}`).join(' ')} {...common} />;
};

/** 一个转轮窗口：显示 3 行，中间是中线；pos 是中线上的图案位置（小数 = 正在转） */
const Reel: React.FC<{x: number; y: number; cell: number; pos: number; hiRow?: boolean; color?: string}> = ({x, y, cell, pos, hiRow, color = T.cyan}) => {
  const base = Math.floor(pos);
  const frac = pos - base;
  return (
    <g>
      <rect x={x - cell / 2} y={y - cell * 1.5} width={cell} height={cell * 3} fill="rgba(10,19,34,0.85)" stroke={T.faint} strokeWidth={2} />
      <clipPath id={`reel-${x}-${y}`}>
        <rect x={x - cell / 2} y={y - cell * 1.5} width={cell} height={cell * 3} />
      </clipPath>
      <g clipPath={`url(#reel-${x}-${y})`}>
        {[-2, -1, 0, 1, 2].map((d) => {
          const k = base + d;
          const yy = y + (d - frac) * cell;
          return <Icon key={d} k={k} x={x} y={yy} s={cell} dim={1 - Math.min(1, Math.abs(yy - y) / (cell * 1.6)) * 0.6} />;
        })}
      </g>
      {hiRow ? <rect x={x - cell / 2 + 4} y={y - cell / 2 + 4} width={cell - 8} height={cell - 8} fill="none" stroke={color} strokeWidth={4} style={{filter: glowF(color, 6)}} /> : null}
    </g>
  );
};

/**
 * 两转轮：左轮静止，pick 是玩家选中的图案（框亮）；右轮 spinAt 起转、stopAt 停，停下时 pick 图案离中线 off 格
 * （0 = 赢，1 = 差一点，≥ 2 = 差很远）；停下后在下方亮出结果字
 */
export const SlotReels: React.FC<{f: number; x?: number; y?: number; cell?: number; pick?: number; spinAt: number; stopAt: number; off: number; labels?: [string, string, string]}> = ({
  f,
  x = 960,
  y = 480,
  cell = 150,
  pick = 0,
  spinAt,
  stopAt,
  off,
  labels = ['赢', '差一点', '差很远'],
}) => {
  const end = pick + 60 + off;
  const p = easeOut(clamp01((f - spinAt) / Math.max(1, stopAt - spinAt)));
  const pos = end - (1 - p) * 24;
  const done = f >= stopAt;
  const kind = off === 0 ? 0 : Math.abs(off) === 1 ? 1 : 2;
  const c = kind === 0 ? T.orange : kind === 1 ? T.red : T.gray;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <Reel x={x - cell * 0.75} y={y} cell={cell} pos={pick} hiRow color={T.cyan} />
      <Reel x={x + cell * 0.75} y={y} cell={cell} pos={pos} hiRow={done && kind === 0} color={T.orange} />
      <line x1={x - cell * 1.5} x2={x + cell * 1.5} y1={y} y2={y} stroke={T.white} strokeWidth={2} strokeDasharray="10 8" opacity={0.6} />
      <text x={x - cell * 1.5 - 16} y={y + 8} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        中线
      </text>
      <text x={x - cell * 0.75} y={y + cell * 1.5 + 44} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={T.cyan}>
        你选的图案
      </text>
      {done ? (
        <text x={x + cell * 0.75 + cell * 0.9} y={y + 14} fontFamily={TF.sans} fontSize={52} fill={c} opacity={clamp01((f - stopAt) / 4)} style={{filter: glowF(c, 8)}}>
          {labels[kind]}
        </text>
      ) : null}
    </svg>
  );
};

/** 抽象脑轮廓（两片椭圆 + 几道沟回）+ 中间奖赏回路节点：lit 0–1 控制发光；label 在下方 */
export const BrainGlow: React.FC<{x: number; y: number; size?: number; lit: number; color?: string; label?: string; sub?: string}> = ({x, y, size = 220, lit, color = T.orange, label, sub}) => {
  const r = size / 2;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.78} fill="rgba(10,19,34,0.85)" stroke="rgba(200,215,225,0.45)" strokeWidth={3} />
      <path d={`M${x} ${y - r * 0.75} C${x - 10} ${y - r * 0.3} ${x + 10} ${y + r * 0.3} ${x} ${y + r * 0.75}`} fill="none" stroke="rgba(200,215,225,0.3)" strokeWidth={3} />
      {[-0.5, 0.5].map((sx) =>
        [-0.35, 0, 0.35].map((sy) => (
          <path
            key={`${sx}-${sy}`}
            d={`M${x + sx * r - r * 0.28} ${y + sy * r} q${r * 0.14} ${-r * 0.12} ${r * 0.28} 0 t${r * 0.28} 0`}
            fill="none"
            stroke="rgba(200,215,225,0.22)"
            strokeWidth={3}
          />
        )),
      )}
      <circle cx={x} cy={y + r * 0.12} r={r * 0.42 * (0.6 + 0.4 * lit)} fill={color} opacity={0.08 + 0.35 * lit} style={{filter: `blur(${10 + 14 * lit}px)`}} />
      <circle cx={x} cy={y + r * 0.12} r={r * 0.14} fill={lit > 0.1 ? color : 'rgba(200,215,225,0.25)'} opacity={0.4 + 0.6 * lit} style={lit > 0.1 ? {filter: glowF(color, 6 + 14 * lit)} : undefined} />
      {label ? (
        <text x={x} y={y + r + 50} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={lit > 0.5 ? color : T.text}>
          {label}
        </text>
      ) : null}
      {sub ? (
        <text x={x} y={y + r + 90} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
          {sub}
        </text>
      ) : null}
    </svg>
  );
};

/**
 * 「再来一局」按钮：鼠标从 from 移到按钮（moveAt → clickAt），clickAt 按下（按钮一压、闪白）；
 * away 给了就在 away 帧后鼠标挪开、按钮变暗；glow 让按钮呼吸发光（勾人）
 */
export const LobbyButton: React.FC<{f: number; x?: number; y?: number; label?: string; moveAt?: number; clickAt?: number; away?: number; from?: [number, number]; color?: string; glow?: boolean}> = ({
  f,
  x = 960,
  y = 620,
  label = '再来一局',
  moveAt,
  clickAt,
  away,
  from = [1500, 900],
  color = T.orange,
  glow = true,
}) => {
  const w = 460;
  const h = 120;
  const pressed = clickAt !== undefined && f >= clickAt && f < clickAt + 6;
  const flash = clickAt !== undefined ? 1 - clamp01((f - clickAt) / 10) : 0;
  const dimmed = away !== undefined ? easeInOut(clamp01((f - away) / 20)) : 0;
  const breath = glow ? 0.5 + 0.5 * Math.sin(f / 6) : 0;
  let cx = from[0];
  let cy = from[1];
  if (moveAt !== undefined && clickAt !== undefined) {
    const p = easeInOut(clamp01((f - moveAt) / Math.max(1, clickAt - moveAt)));
    cx = from[0] + (x + 60 - from[0]) * p;
    cy = from[1] + (y + 20 - from[1]) * p;
  }
  if (away !== undefined) {
    cx += 520 * dimmed;
    cy += 260 * dimmed;
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <g transform={`translate(${x} ${y}) scale(${pressed ? 0.96 : 1}) translate(${-x} ${-y})`} opacity={1 - 0.65 * dimmed}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill={color} opacity={0.9} style={{filter: glowF(color, 10 + 16 * breath * (1 - dimmed))}} />
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill="#fff" opacity={0.7 * flash * (clickAt !== undefined && f >= clickAt ? 1 : 0)} />
        <text x={x} y={y + 18} textAnchor="middle" fontFamily={TF.sans} fontSize={52} fill="#141006">
          {label}
        </text>
      </g>
      <path d={`M${cx} ${cy} l0 46 l12 -12 l10 22 l9 -4 l-10 -22 l17 0 z`} fill="#fff" stroke="#0a0f18" strokeWidth={2.5} />
    </svg>
  );
};

/** 大比分 + 回合点：us / them 两个大数字，下面一排点（青 = 你赢的回合，红 = 输的），at 起逐个亮 */
export const ScoreLine: React.FC<{f: number; at: number; us: number; them: number; x?: number; y?: number; label?: string; warm?: boolean; per?: number}> = ({f, at, us, them, x = 960, y = 420, label = '失败', warm = false, per = 1}) => {
  const n = us + them;
  const dotW = 40;
  const o = clamp01((f - at) / 6);
  const pop = 1 + 0.12 * (1 - easeOut(clamp01((f - at) / 10)));
  const cUs = warm ? '#ffd9a8' : T.cyan;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <text x={x} y={y - 150} textAnchor="middle" fontFamily={TF.sans} fontSize={56} fill={T.red} style={{filter: glowF(T.red, 8)}} letterSpacing={12}>
        {label}
      </text>
      <g transform={`translate(${x} ${y}) scale(${pop}) translate(${-x} ${-y})`}>
        <text x={x - 60} y={y + 40} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={150} fill={cUs} style={{filter: glowF(cUs, 10)}}>
          {us}
        </text>
        <text x={x} y={y + 30} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={100} fill={T.gray}>
          :
        </text>
        <text x={x + 60} y={y + 40} textAnchor="start" fontFamily={TF.mono} fontWeight={700} fontSize={150} fill={T.red} style={{filter: glowF(T.red, 10)}}>
          {them}
        </text>
      </g>
      {Array.from({length: n}, (_, i) => {
        // 前 2 × 较小比分个回合你来我往，剩下的都归领先的一方
        const isUs = i < 2 * Math.min(us, them) ? i % 2 === 0 : us > them;
        const lit = f >= at + i * per;
        return <rect key={i} x={x - (n * dotW) / 2 + i * dotW + 6} y={y + 110} width={dotW - 12} height={22} rx={4} fill={lit ? (isUs ? cUs : T.red) : 'rgba(200,215,225,0.15)'} />;
      })}
    </svg>
  );
};
