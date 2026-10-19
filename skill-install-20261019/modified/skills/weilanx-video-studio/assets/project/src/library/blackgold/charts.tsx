import React from 'react';
import {clamp01, rand} from '../anim';
import {B, BF, blurIn, drawP, glowText} from './theme';

/**
 * 黑金光影风的「模型图」：收益矩阵、发光柱状图、C/D 方块序列、细胞网格（确定性演化）、光点网络环、霓虹折线图。
 * 坐标都是 1920×1080 舞台坐标；线条一律「画出来」，高亮一律「先描边后发光」。
 */

export type Cell = {main: string; sub?: string};
export type MatrixHi = {cell: [number, number]; color: 'cyan' | 'red'; at: number; label?: string; note?: string};
export type MatrixArrow = {from: [number, number]; to: [number, number]; at: number};

/**
 * 收益矩阵（2×2）：上方两列表头、左侧两行表头（第一行 / 列青色 = 合作，第二行 / 列红色 = 背叛），每格大字 + 小字；
 * arrows 依次画出的金箭头（从一格指向另一格），hi 某格亮青 / 红霓虹框，label 写在矩阵右侧对应行，note 是 label 下的小字。
 */
export const PayoffMatrix: React.FC<{
  f: number;
  at: number;
  x?: number;
  y?: number;
  cw?: number;
  ch?: number;
  rows: [string, string];
  cols: [string, string];
  cells: [[Cell, Cell], [Cell, Cell]];
  arrows?: MatrixArrow[];
  hi?: MatrixHi[];
  out?: number;
}> = ({f, at, x = 640, y = 300, cw = 280, ch = 160, rows, cols, cells, arrows = [], hi = [], out}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const cx = (c: number) => x + c * cw + cw / 2;
  const cy = (r: number) => y + r * ch + ch / 2;
  const color = (k: 'cyan' | 'red') => (k === 'cyan' ? B.cyan : B.red);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      {cols.map((t, c) => (
        <div key={`c${c}`} style={{position: 'absolute', left: x + c * cw, width: cw, top: y - 64, textAlign: 'center', fontFamily: BF.cn, fontWeight: 900, fontSize: 36, ...glowText(c === 0 ? B.cyan : B.red, 10, 0.7)}}>
          {t}
        </div>
      ))}
      {rows.map((t, r) => (
        <div key={`r${r}`} style={{position: 'absolute', left: x - 220, width: 200, top: y + r * ch + ch / 2 - 24, textAlign: 'right', fontFamily: BF.cn, fontWeight: 900, fontSize: 36, ...glowText(r === 0 ? B.cyan : B.red, 10, 0.7)}}>
          {t}
        </div>
      ))}
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        {[0, 1].map((r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={x + c * cw + 4} y={y + r * ch + 4} width={cw - 8} height={ch - 8} fill="rgba(8,6,4,0.75)" stroke={B.goldLine} strokeWidth={1.5} />),
        )}
        {hi.map((h, i) => {
          const p = drawP(f, h.at, 10);
          if (p <= 0) return null;
          const [r, c] = h.cell;
          const glow = clamp01((f - h.at - 8) / 8);
          return (
            <rect
              key={`h${i}`}
              x={x + c * cw + 2}
              y={y + r * ch + 2}
              width={cw - 4}
              height={ch - 4}
              fill={`${color(h.color)}${Math.round(0x22 * glow).toString(16).padStart(2, '0')}`}
              stroke={color(h.color)}
              strokeWidth={3}
              pathLength={1}
              strokeDasharray={`${p} 1`}
              style={{filter: `drop-shadow(0 0 ${12 * glow}px ${color(h.color)})`}}
            />
          );
        })}
        {arrows.map((ar, i) => {
          const p = drawP(f, ar.at, 10);
          if (p <= 0) return null;
          const [r0, c0] = ar.from;
          const [r1, c1] = ar.to;
          const horiz = r0 === r1;
          // 箭头从格子边缘内侧画到下一格边缘内侧，横向走在格子下沿、纵向走在格子右沿（和原片一样贴边走）
          const x0 = horiz ? cx(c0) + 30 : x + c0 * cw + cw - 18;
          const y0 = horiz ? y + r0 * ch + ch - 14 : cy(r0) + 30;
          const x1 = horiz ? cx(c1) - 30 : x0;
          const y1 = horiz ? y0 : cy(r1) - 30;
          const ex = x0 + (x1 - x0) * p;
          const ey = y0 + (y1 - y0) * p;
          const dx = horiz ? Math.sign(x1 - x0) : 0;
          const dy = horiz ? 0 : Math.sign(y1 - y0);
          return (
            <g key={`a${i}`} stroke={B.gold} strokeWidth={3} fill="none" style={{filter: `drop-shadow(0 0 6px ${B.gold})`}}>
              <line x1={x0} y1={y0} x2={ex} y2={ey} />
              {p > 0.9 && <path d={`M${ex - dx * 14 - dy * 9} ${ey - dy * 14 - dx * 9} L${ex} ${ey} L${ex - dx * 14 + dy * 9} ${ey - dy * 14 + dx * 9}`} />}
            </g>
          );
        })}
      </svg>
      {cells.map((row, r) =>
        row.map((cell, c) => (
          <div key={`t${r}${c}`} style={{position: 'absolute', left: x + c * cw, width: cw, top: y + r * ch + ch / 2 - 46, textAlign: 'center'}}>
            <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 44, ...glowText(B.ink, 10, 0.5)}}>{cell.main}</div>
            {cell.sub && <div style={{fontFamily: BF.cn, fontWeight: 700, fontSize: 26, color: B.inkDim, marginTop: 4}}>{cell.sub}</div>}
          </div>
        )),
      )}
      {hi.map((h, i) =>
        h.label ? (
          <div key={`l${i}`} style={{position: 'absolute', left: x + 2 * cw + 40, top: y + h.cell[0] * ch + ch / 2 - 30, opacity: clamp01((f - h.at - 10) / 10)}}>
            <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 42, ...glowText(color(h.color), 14)}}>{h.label}</div>
            {h.note && <div style={{fontFamily: BF.cn, fontSize: 24, color: B.inkDim, marginTop: 6}}>{h.note}</div>}
          </div>
        ) : null,
      )}
    </div>
  );
};

/**
 * 发光柱状图：values 柱高（相对 max），labels 柱下名字，柱子按 at + i*stagger 依次长出；hi 那一根更亮（金）、其余是渐暗的米金；
 * x / y 左下角，w / h 绘图区尺寸；top 在柱顶写数字。
 */
export const GlowBars: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; values: number[]; labels: string[]; max?: number; hi?: number; stagger?: number; out?: number}> = ({
  f,
  at,
  x,
  y,
  w = 900,
  h = 420,
  values,
  labels,
  max,
  hi = -1,
  stagger = 4,
  out,
}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const m = max ?? Math.max(...values);
  const bw = (w / values.length) * 0.58;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="gb-bar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff2c8" />
            <stop offset="100%" stopColor="rgba(140,110,70,0.5)" />
          </linearGradient>
          <linearGradient id="gb-hi" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fffbe6" />
            <stop offset="100%" stopColor={B.gold} />
          </linearGradient>
        </defs>
        <line x1={x} x2={x + w} y1={y} y2={y} stroke={B.goldLine} strokeWidth={1.5} />
        {values.map((v, i) => {
          const p = drawP(f, at + i * stagger, 16);
          const bh = (h * v * p) / m;
          const bx = x + (i + 0.5) * (w / values.length) - bw / 2;
          return <rect key={i} x={bx} y={y - bh} width={bw} height={bh} fill={i === hi ? 'url(#gb-hi)' : 'url(#gb-bar)'} opacity={i === hi ? 1 : 0.8} style={{filter: `drop-shadow(0 0 ${i === hi ? 16 : 8}px rgba(255,230,170,0.6))`}} />;
        })}
      </svg>
      {values.map((v, i) => {
        const bx = x + (i + 0.5) * (w / values.length);
        const p = drawP(f, at + i * stagger, 16);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: bx - 60, width: 120, top: y - (h * v * p) / m - 44, textAlign: 'center', fontFamily: BF.latinBold, fontSize: 30, ...glowText(B.ink, 8, 0.5), opacity: p}}>{v}</div>
            <div style={{position: 'absolute', left: bx - 80, width: 160, top: y + 14, textAlign: 'center', fontFamily: BF.cn, fontWeight: 700, fontSize: 24, color: i === hi ? B.gold : B.inkDim}}>{labels[i]}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * C/D 方块序列：每行一个名字 + 一排小方块，C 青、D 红，第 i 块在 at + i*step 帧亮起（亮起时闪一下）；
 * notes 是序列下面几行彩色小注（[文字, 'cyan' | 'red' | 'gold']）。
 */
export const TileSeq: React.FC<{f: number; at: number; x: number; y: number; rows: {label: string; seq: string}[]; step?: number; size?: number; notes?: [string, 'cyan' | 'red' | 'gold'][]; out?: number}> = ({
  f,
  at,
  x,
  y,
  rows,
  step = 6,
  size = 46,
  notes = [],
  out,
}) => {
  const a = blurIn(f, at, 12, out);
  if (a.v <= 0) return null;
  const col = (k: string) => (k === 'cyan' ? B.cyan : k === 'red' ? B.red : B.gold);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      {rows.map((r, ri) => (
        <div key={ri} style={{position: 'absolute', left: x, top: y + ri * (size + 34), display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 200, textAlign: 'right', marginRight: 14, fontFamily: BF.cn, fontWeight: 900, fontSize: 30, color: B.ink}}>{r.label}</div>
          {Array.from(r.seq).map((ch, i) => {
            const t = f - at - i * step;
            if (t < 0) return null;
            const c = ch === 'C' ? B.cyan : B.red;
            const flash = t < 8 ? 1 - t / 8 : 0;
            return (
              <div
                key={i}
                style={{
                  width: size,
                  height: size,
                  borderRadius: 8,
                  border: `2px solid ${c}`,
                  background: `${c}33`,
                  boxShadow: `0 0 ${10 + 14 * flash}px ${c}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: BF.latinBold,
                  fontSize: size * 0.5,
                  color: '#fff',
                  opacity: Math.min(1, t / 4),
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
      ))}
      {notes.map(([t, k], i) => (
        <div key={i} style={{position: 'absolute', left: x + 214, top: y + rows.length * (size + 34) + 10 + i * 38, fontFamily: BF.cn, fontWeight: 700, fontSize: 26, ...glowText(col(k), 8, 0.5), opacity: clamp01((f - at - 30 - i * 10) / 10)}}>
          {t}
        </div>
      ))}
    </div>
  );
};

/** 细胞网格的一代：每格和 8 个邻居博弈，合作遇合作得 1、背叛遇合作得 temptation，其余得 0；下一代每格学邻居里得分最高的那个 */
export const stepGrid = (g: boolean[], cols: number, rows: number, temptation: number) => {
  const score = new Float32Array(g.length);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      let s = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const j = ((r + dr + rows) % rows) * cols + ((c + dc + cols) % cols);
          if (g[j]) s += g[i] ? 1 : temptation;
        }
      score[i] = s;
    }
  const next = g.slice();
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      let best = r * cols + c;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const j = ((r + dr + rows) % rows) * cols + ((c + dc + cols) % cols);
          if (score[j] > score[best]) best = j;
        }
      next[r * cols + c] = g[best];
    }
  return next;
};

/**
 * 细胞网格（空间囚徒困境，确定性）：cols×rows 个格子，true = 合作（青）、false = 背叛（暗红），这一代刚变过来的格子发金光；
 * at 起每 period 帧演化一代；temptation 背叛诱惑（1.6–1.9 会长出稳定的合作团块）；返回值不需要，画面里自带右上角统计卡（stat）。
 */
export const CellGrid: React.FC<{f: number; at: number; cols?: number; rows?: number; cell?: number; x?: number; y?: number; period?: number; temptation?: number; seed?: number; coopP?: number; stat?: boolean; out?: number}> = ({
  f,
  at,
  cols = 60,
  rows = 34,
  cell = 32,
  x = 0,
  y = 0,
  period = 8,
  temptation = 1.7,
  seed = 4,
  coopP = 0.55,
  stat = true,
  out,
}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const gen = Math.max(0, Math.floor((f - at) / period));
  let g = Array.from({length: cols * rows}, (_, i) => rand(seed * 1000 + i) < coopP);
  let prev = g;
  for (let k = 0; k < Math.min(gen, 60); k++) {
    prev = g;
    g = stepGrid(g, cols, rows, temptation);
  }
  const coop = g.filter(Boolean).length / g.length;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {g.map((v, i) => {
          if (gen > 0 && v !== prev[i]) return null;
          const cx = x + (i % cols) * cell;
          const cy = y + Math.floor(i / cols) * cell;
          return <rect key={i} x={cx + 2} y={cy + 2} width={cell - 4} height={cell - 4} rx={3} fill={v ? B.cellTeal : B.cellRed} opacity={0.92} />;
        })}
        {/* 这一代刚翻过来的格子：发金光，单独一层加光晕 */}
        <g style={{filter: 'drop-shadow(0 0 8px rgba(255,214,130,0.9))'}}>
          {g.map((v, i) => {
            if (!(gen > 0 && v !== prev[i])) return null;
            const cx = x + (i % cols) * cell;
            const cy = y + Math.floor(i / cols) * cell;
            return <rect key={i} x={cx + 2} y={cy + 2} width={cell - 4} height={cell - 4} rx={3} fill="#f6d98a" />;
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
      {stat && (
        <div style={{position: 'absolute', right: 70, top: 70, width: 320, padding: '16px 22px', background: 'rgba(10,7,5,0.82)', border: `1.5px solid ${B.goldLine}`, borderRadius: 8}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BF.cn, fontWeight: 900, fontSize: 28, color: B.ink}}>
            <span>合作者</span>
            <span style={glowText(B.cyan, 8)}>{Math.round(coop * 100)}%</span>
          </div>
          <div style={{fontFamily: BF.cn, fontSize: 22, color: B.inkDim, marginTop: 4}}>第 {gen} 代</div>
        </div>
      )}
    </div>
  );
};

/**
 * 光点网络环：n 个金色光点围成一圈，at 起光点依次亮起，linkAt 起两两连线慢慢画满；hi 那个点放大、发光并在上方写 hiLabel。
 */
export const DotRing: React.FC<{f: number; at: number; cx?: number; cy?: number; r?: number; n?: number; linkAt?: number; hi?: number; hiAt?: number; hiLabel?: string; out?: number}> = ({
  f,
  at,
  cx = 640,
  cy = 480,
  r = 300,
  n = 14,
  linkAt,
  hi = -1,
  hiAt = 0,
  hiLabel,
  out,
}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const pts = Array.from({length: n}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2 - Math.PI / 2) * r, cy + Math.sin((i / n) * Math.PI * 2 - Math.PI / 2) * r]);
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {linkAt !== undefined &&
          pairs.map(([i, j], k) => {
            const p = drawP(f, linkAt + (k / pairs.length) * 60, 12);
            if (p <= 0) return null;
            return <line key={k} x1={pts[i][0]} y1={pts[i][1]} x2={pts[i][0] + (pts[j][0] - pts[i][0]) * p} y2={pts[i][1] + (pts[j][1] - pts[i][1]) * p} stroke="rgba(229,201,145,0.18)" strokeWidth={1} />;
          })}
        {pts.map(([x, y], i) => {
          const on = clamp01((f - at - i * 2) / 8);
          const isHi = i === hi && f >= hiAt;
          return <circle key={i} cx={x} cy={y} r={isHi ? 18 : 9} fill={isHi ? '#fff4c8' : B.goldWarm} opacity={on} style={{filter: `drop-shadow(0 0 ${isHi ? 22 : 8}px ${B.gold})`}} />;
        })}
      </svg>
      {hi >= 0 && hiLabel && f >= hiAt && (
        <div style={{position: 'absolute', left: pts[hi][0] - 150, width: 300, top: pts[hi][1] - 70, textAlign: 'center', fontFamily: BF.cn, fontWeight: 900, fontSize: 32, ...glowText(B.gold, 12), opacity: clamp01((f - hiAt) / 10)}}>{hiLabel}</div>
      )}
    </div>
  );
};

/**
 * 霓虹折线图：坐标轴（细金线 + 轴名），lines 每条 {pts: 0–1 坐标, color, at, dur, label}，按进度画出、带发光；
 * dashY 一条水平渐近虚线（0–1，右端写 dashLabel），cross 一个发光交点（0–1 坐标，at 帧亮起）。x / y 左下角，w / h 尺寸。
 */
export const NeonLines: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  xLabel?: string;
  yLabel?: string;
  lines: {pts: [number, number][]; color: string; at: number; dur?: number; label?: string}[];
  dashY?: number;
  dashLabel?: string;
  cross?: {p: [number, number]; at: number};
  out?: number;
}> = ({f, at, x, y, w = 700, h = 420, xLabel, yLabel, lines, dashY, dashLabel, cross, out}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const X = (u: number) => x + u * w;
  const Y = (v: number) => y - v * h;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        <line x1={x} y1={y} x2={x + w} y2={y} stroke={B.goldLine} strokeWidth={1.5} />
        <line x1={x} y1={y} x2={x} y2={y - h} stroke={B.goldLine} strokeWidth={1.5} />
        {dashY !== undefined && <line x1={x} x2={x + w} y1={Y(dashY)} y2={Y(dashY)} stroke="rgba(255,250,240,0.35)" strokeWidth={1.5} strokeDasharray="6 8" />}
        {lines.map((l, i) => {
          const p = drawP(f, l.at, l.dur ?? 40);
          if (p <= 0) return null;
          const d = l.pts.map(([u, v], k) => `${k ? 'L' : 'M'}${X(u)} ${Y(v)}`).join(' ');
          return <path key={i} d={d} fill="none" stroke={l.color} strokeWidth={3.5} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 8px ${l.color})`}} />;
        })}
        {cross && f >= cross.at && (
          <circle cx={X(cross.p[0])} cy={Y(cross.p[1])} r={10 + 4 * Math.sin((f - cross.at) / 6)} fill="#fff6dc" style={{filter: 'drop-shadow(0 0 18px #fff1c8)'}} opacity={clamp01((f - cross.at) / 8)} />
        )}
      </svg>
      {yLabel && <div style={{position: 'absolute', left: x - 10, top: y - h - 40, fontFamily: BF.cn, fontSize: 22, color: B.inkDim}}>{yLabel}</div>}
      {xLabel && <div style={{position: 'absolute', left: x + w - 300, width: 300, textAlign: 'right', top: y + 14, fontFamily: BF.cn, fontSize: 22, color: B.inkDim}}>{xLabel} →</div>}
      {dashY !== undefined && dashLabel && <div style={{position: 'absolute', left: x + w + 14, top: Y(dashY) - 16, fontFamily: BF.latin, fontSize: 26, color: B.ink}}>{dashLabel}</div>}
      {lines.map((l, i) =>
        l.label ? (
          <div key={i} style={{position: 'absolute', left: X(l.pts[0][0]) + 12, top: Y(l.pts[0][1]) - 34, fontFamily: BF.cn, fontWeight: 700, fontSize: 22, color: l.color, opacity: drawP(f, l.at, 12)}}>
            {l.label}
          </div>
        ) : null,
      )}
    </div>
  );
};

/**
 * 天平：一根横梁挂两个秤盘，左右各一个选项（label + 数值）；phases 依次给出 [at 帧, 左值, 右值]，
 * 每到一个 phase 数值换掉、横梁往更大的一边沉下去（带一点回弹），沉下去那边的秤盘亮起来（青 / 红 / 金由 color 定）。
 * (cx, cy) 支点，w 横梁长，title 写在支点上方。
 */
export const BalanceScale: React.FC<{
  f: number;
  at: number;
  cx: number;
  cy: number;
  w?: number;
  title?: string;
  left: {label: string; color: string};
  right: {label: string; color: string};
  phases: {at: number; l: number; r: number}[];
  out?: number;
}> = ({f, at, cx, cy, w = 520, title, left, right, phases, out}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const tgt = (p?: {l: number; r: number}) => (p ? Math.max(-1, Math.min(1, (p.r - p.l) / 3)) * 13 : 0);
  let cur = phases.findIndex((p, i) => f >= p.at && (i === phases.length - 1 || f < phases[i + 1].at));
  if (f < phases[0].at) cur = -1;
  const ph = cur >= 0 ? phases[cur] : undefined;
  const prev = cur > 0 ? tgt(phases[cur - 1]) : 0;
  const t = ph ? f - ph.at : 0;
  const k = ph ? 1 - Math.exp(-t / 6) * Math.cos(t / 4) : 0;
  const ang = prev + (tgt(ph) - prev) * k;
  const rad = (ang * Math.PI) / 180;
  const ends = [-1, 1].map((sgn) => [cx + (sgn * w) / 2 * Math.cos(rad), cy + (sgn * w) / 2 * Math.sin(rad)] as [number, number]);
  const win = ph ? (ph.r > ph.l ? 1 : ph.l > ph.r ? 0 : -1) : -1;
  const winOn = clamp01((t - 6) / 8);
  const sides = [left, right];
  const vals = ph ? [ph.l, ph.r] : [undefined, undefined];
  const fmt = (v?: number) => (v === undefined ? '' : v < 0 ? `−${-v}` : `${v}`);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        <line x1={cx} y1={cy} x2={cx} y2={cy + 300} stroke={B.goldLine} strokeWidth={6} />
        <path d={`M${cx - 90} ${cy + 310} L${cx + 90} ${cy + 310} L${cx + 60} ${cy + 290} L${cx - 60} ${cy + 290} Z`} fill="rgba(229,201,145,0.3)" />
        <line x1={ends[0][0]} y1={ends[0][1]} x2={ends[1][0]} y2={ends[1][1]} stroke={B.gold} strokeWidth={7} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${B.gold})`}} />
        <circle cx={cx} cy={cy} r={13} fill="#fff1c4" style={{filter: `drop-shadow(0 0 10px ${B.gold})`}} />
        {ends.map(([ex, ey], i) => {
          const hot = win === i ? winOn : 0;
          const c = sides[i].color;
          return (
            <g key={i}>
              <line x1={ex} y1={ey} x2={ex - 70} y2={ey + 130} stroke={B.goldLine} strokeWidth={2} />
              <line x1={ex} y1={ey} x2={ex + 70} y2={ey + 130} stroke={B.goldLine} strokeWidth={2} />
              <path d={`M${ex - 95} ${ey + 130} Q${ex} ${ey + 190} ${ex + 95} ${ey + 130} Z`} fill={`rgba(10,7,5,0.85)`} stroke={c} strokeWidth={3} opacity={0.5 + 0.5 * Math.max(hot, 0.3)} style={{filter: `drop-shadow(0 0 ${6 + 18 * hot}px ${c})`}} />
            </g>
          );
        })}
      </svg>
      {ends.map(([ex, ey], i) => {
        const hot = win === i ? winOn : 0;
        return (
          <div key={i} style={{position: 'absolute', left: ex - 120, width: 240, top: ey + 62, textAlign: 'center'}}>
            <div style={{fontFamily: BF.latinBold, fontSize: 80, lineHeight: 1, ...glowText(hot > 0 ? sides[i].color : B.ink, 10 + 16 * hot, 0.5 + 0.5 * hot)}}>{fmt(vals[i])}</div>
            <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, marginTop: 64, ...glowText(sides[i].color, 8, 0.6)}}>{sides[i].label}</div>
          </div>
        );
      })}
      {title && <div style={{position: 'absolute', left: cx - 300, width: 600, top: cy - 90, textAlign: 'center', fontFamily: BF.cn, fontWeight: 900, fontSize: 36, ...glowText(B.goldWarm, 10, 0.6)}}>{title}</div>}
    </div>
  );
};

/**
 * 食粒柱：n 颗发光食粒从上方依次落下、在 (x, y) 处（底部中心）叠成一柱（每 stagger 帧一颗）；
 * leave 颗（最上面那几颗）在 leaveAt 帧变成汗珠色、飘走淡出，旁边写 leaveLabel；label 写在柱子下面。
 */
export const PelletStack: React.FC<{f: number; at: number; x: number; y: number; n: number; stagger?: number; leave?: number; leaveAt?: number; leaveLabel?: string; label?: string; size?: number}> = ({
  f,
  at,
  x,
  y,
  n,
  stagger = 4,
  leave = 0,
  leaveAt = Infinity,
  leaveLabel,
  label,
  size = 40,
}) => {
  if (f < at) return null;
  const lt = f - leaveAt;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        {Array.from({length: n}, (_, i) => {
          const t = f - (at + i * stagger);
          if (t < 0) return null;
          const fall = clamp01(t / 8);
          const ty = y - (i + 0.5) * size * 1.05;
          const py = ty - (1 - fall * fall) * 260;
          const bounce = t >= 8 && t < 14 ? -Math.sin(((t - 8) / 6) * Math.PI) * 6 : 0;
          const leaving = i >= n - leave && lt >= 0;
          const k = leaving ? clamp01((lt - (n - 1 - i) * 3) / 24) : 0;
          const col = leaving ? '#bff3ec' : '#ffe9b0';
          return (
            <rect
              key={i}
              x={x - size / 2 + k * 90 + Math.sin(k * 8 + i) * 10 * k}
              y={py + bounce - k * 220}
              width={size}
              height={size * 0.85}
              rx={size * 0.3}
              fill={col}
              opacity={1 - k}
              style={{filter: `drop-shadow(0 0 ${8 + 6 * (1 - fall)}px ${leaving ? '#bff3ec' : B.gold})`}}
            />
          );
        })}
      </svg>
      {leaveLabel && lt >= 0 && (
        <div style={{position: 'absolute', left: x + 50, top: y - n * size - 40 - clamp01(lt / 24) * 60, fontFamily: BF.cn, fontWeight: 900, fontSize: 30, opacity: clamp01(lt / 8) * (1 - clamp01((lt - 40) / 16)), ...glowText('#bff3ec', 10, 0.7)}}>
          {leaveLabel}
        </div>
      )}
      {label && <div style={{position: 'absolute', left: x - 150, width: 300, top: y + 14, textAlign: 'center', fontFamily: BF.cn, fontSize: 26, color: B.inkDim}}>{label}</div>}
    </div>
  );
};

/**
 * 账本卡：每行一个角色（名字 + 颜色）和几列数（cols 列名），数字变化的那一帧（bumps）放大闪一下；
 * hiCol 那一列（比如「净得」）用大号金字。适合「出力的和不出力的，算下来一样多」这种对账。
 */
export const Ledger: React.FC<{f: number; at: number; x: number; y: number; cols: string[]; rows: {label: string; color: string; vals: number[]}[]; bumps?: number[]; hiCol?: number; out?: number}> = ({f, at, x, y, cols, rows, bumps = [], hiCol = -1, out}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  let bt = Infinity;
  for (const b of bumps) if (f >= b && f - b < bt) bt = f - b;
  const bump = bt < 10 ? 1 - bt / 10 : 0;
  const cw = 170;
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '16px 30px', borderRadius: 6, background: 'rgba(10,7,5,0.72)', border: `1.5px solid ${B.goldLine}`, boxShadow: `0 0 18px rgba(229,201,145,0.18)`, opacity: a.opacity, filter: a.filter}}>
      <div style={{display: 'flex', paddingLeft: 140}}>
        {cols.map((c, i) => (
          <div key={i} style={{width: cw, textAlign: 'center', fontFamily: BF.cn, fontSize: 26, color: i === hiCol ? B.goldWarm : B.inkDim}}>
            {c}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
          <div style={{width: 140, fontFamily: BF.cn, fontWeight: 900, fontSize: 40, ...glowText(r.color, 8, 0.6)}}>{r.label}</div>
          {r.vals.map((v, i) => (
            <div key={i} style={{width: cw, textAlign: 'center', fontFamily: BF.latinBold, fontSize: i === hiCol ? 76 : 54, lineHeight: 1.05, transform: `scale(${1 + 0.18 * bump})`, ...glowText(i === hiCol ? B.gold : B.ink, i === hiCol ? 16 : 8, i === hiCol ? 1 : 0.4)}}>
              {v < 0 ? `−${-v}` : v}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
