import React from 'react';
import {clamp01, rand} from '../anim';
import {bellPath} from './stage';
import {G, GF} from './theme';

/**
 * 暗金文献风的金线图表：全部是细金线 + 发光端点，逐步「画出来」。
 * 每个组件给出 SVG 局部坐标（左上为 0,0），用 Soft 或 div 定位到画面里。
 */

const glowLine = (c: string, px = 4) => ({filter: `drop-shadow(0 0 ${px}px ${c})`});

/**
 * 二叉树：从左往右分 depth 层，p 为生长进度（0–1，一层一层长出来）。
 * highlight 是从根到叶的路径（每层 0=上 1=下），会被描成发光的朱红；leafLabel 给每片叶子标字。
 */
export const GoldTree: React.FC<{w: number; h: number; depth: number; p: number; highlight?: number[]; hp?: number; leafLabel?: (i: number) => string; leafColor?: (i: number) => string}> = ({w, h, depth, p, highlight, hp = 0, leafLabel, leafColor}) => {
  const lw = w / (depth + 0.4);
  const nodes: React.ReactNode[] = [];
  const lines: React.ReactNode[] = [];
  const hiNodes = new Set<string>();
  if (highlight) {
    let idx = 0;
    hiNodes.add('0-0');
    highlight.forEach((b, d) => {
      idx = idx * 2 + b;
      hiNodes.add(`${d + 1}-${idx}`);
    });
  }
  const pos = (d: number, i: number) => {
    const n = Math.pow(2, d);
    return [d * lw, ((i + 0.5) / n) * h] as const;
  };
  for (let d = 0; d < depth; d++) {
    const grow = clamp01(p * depth - d);
    if (grow <= 0) continue;
    for (let i = 0; i < Math.pow(2, d); i++) {
      const [x0, y0] = pos(d, i);
      for (const b of [0, 1]) {
        const [x1, y1] = pos(d + 1, i * 2 + b);
        const hi = hiNodes.has(`${d}-${i}`) && hiNodes.has(`${d + 1}-${i * 2 + b}`);
        const draw = hi ? clamp01(hp * depth - d) : 0;
        const path = `M${x0} ${y0} C${x0 + lw * 0.5} ${y0}, ${x1 - lw * 0.5} ${y1}, ${x1} ${y1}`;
        lines.push(<path key={`l${d}-${i}-${b}`} d={path} fill="none" stroke={G.goldLine} strokeWidth={1.2} pathLength={1} strokeDasharray={`${grow} 1`} />);
        if (draw > 0) lines.push(<path key={`h${d}-${i}-${b}`} d={path} fill="none" stroke={G.red} strokeWidth={3} pathLength={1} strokeDasharray={`${draw} 1`} style={glowLine(G.red, 6)} />);
      }
    }
  }
  for (let d = 0; d <= depth; d++) {
    const show = clamp01(p * depth - d + 1);
    if (show <= 0) continue;
    for (let i = 0; i < Math.pow(2, d); i++) {
      const [x, y] = pos(d, i);
      if (d === depth) {
        const lab = leafLabel?.(i);
        const col = leafColor?.(i) ?? G.gold;
        nodes.push(
          <g key={`n${d}-${i}`} opacity={show}>
            <circle cx={x} cy={y} r={Math.min(10, h / Math.pow(2, depth) / 2.4)} fill="rgba(0,0,0,0.6)" stroke={col} strokeWidth={1.2} />
            {lab ? (
              <text x={x} y={y + 4} textAnchor="middle" fontFamily={GF.cn} fontSize={Math.min(12, h / Math.pow(2, depth) / 2.2)} fill={col}>
                {lab}
              </text>
            ) : null}
          </g>,
        );
      } else nodes.push(<circle key={`n${d}-${i}`} cx={x} cy={y} r={3.5} fill={G.goldBright} opacity={show} style={glowLine(G.gold, 3)} />);
    }
  }
  return (
    <svg width={w + 20} height={h} style={{overflow: 'visible'}}>
      {lines}
      {nodes}
    </svg>
  );
};

/**
 * 二项分布柱 → 钟形曲线：n 次抛硬币的正面次数分布。
 * p 为柱子长高的进度；curve 为 0–1 时在柱子上描出钟形曲线（n 大时柱子变成细竖线）。
 */
export const BellBars: React.FC<{w: number; h: number; n: number; p: number; curve?: number}> = ({w, h, n, p, curve = 0}) => {
  const logC = (a: number, b: number) => {
    let s = 0;
    for (let i = 1; i <= b; i++) s += Math.log(a - b + i) - Math.log(i);
    return s;
  };
  // n 大时只画均值 ±4σ 的窗口，让分布铺满宽度
  const sd = Math.sqrt(n) / 2;
  const lo = Math.max(0, Math.floor(n / 2 - 4 * sd));
  const hi = Math.min(n, Math.ceil(n / 2 + 4 * sd));
  const k = Array.from({length: hi - lo + 1}, (_, i) => lo + i);
  const probs = k.map((i) => Math.exp(logC(n, i) - n * Math.log(2)));
  const max = Math.max(...probs);
  const bw = w / k.length;
  const thin = k.length > 30;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="gd-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9cf8c" />
          <stop offset="1" stopColor="#5c4420" />
        </linearGradient>
      </defs>
      {probs.map((q, i) => {
        const bh = (q / max) * h * 0.92 * clamp01(p * 1.4 - Math.abs(i - (k.length - 1) / 2) / k.length);
        return thin ? (
          <line key={i} x1={i * bw + bw / 2} x2={i * bw + bw / 2} y1={h} y2={h - bh} stroke={G.goldLine} strokeWidth={1.2} />
        ) : (
          <rect key={i} x={i * bw + 1} y={h - bh} width={bw - 2} height={bh} fill="url(#gd-bar)" stroke={G.gold} strokeWidth={0.8} />
        );
      })}
      <line x1={-30} x2={w + 30} y1={h} y2={h} stroke={G.goldLine} strokeWidth={1} />
      {curve > 0 ? <path d={bellPath(0, w, h, h * 0.92, 120, sd / k.length)} fill="none" stroke={G.goldBright} strokeWidth={2.4} pathLength={1} strokeDasharray={`${curve} 1`} style={glowLine(G.gold, 6)} /> : null}
    </svg>
  );
};

/**
 * 高尔顿板：一个描金边框，上方漏斗、中间三角钉阵、下方竖槽。
 * 珠子按确定性随机路径一颗颗落下并在槽里堆起来；t 为从开始放珠起的帧数，rate 为每帧放几颗。
 */
export const GaltonBoard: React.FC<{t: number; rows?: number; w?: number; h?: number; rate?: number; total?: number; curve?: number}> = ({t, rows = 12, w = 560, h = 640, rate = 2, total = 600, curve = 0}) => {
  const top = 70;
  const pegH = h * 0.5;
  const dy = pegH / rows;
  const dx = (w - 80) / (rows + 1);
  const cx = w / 2;
  const binTop = top + pegH + 20;
  const binH = h - binTop - 16;
  const fall = 40; // 一颗珠子从漏斗落到底的帧数
  const bins = new Array(rows + 1).fill(0);
  const flying: React.ReactNode[] = [];
  const released = Math.min(total, Math.floor(Math.max(0, t) * rate));
  const beadR = Math.max(1.6, dx / 9);
  for (let i = 0; i < released; i++) {
    let x = 0;
    const steps: number[] = [];
    for (let r = 0; r < rows; r++) {
      const b = rand(i * 31 + r * 7 + 1) > 0.5 ? 1 : 0;
      steps.push(b);
      x += b;
    }
    const age = t - i / rate;
    if (age >= fall) bins[x]++;
    else {
      const prog = age / fall;
      const rf = prog * rows;
      const r = Math.floor(rf);
      let off = 0;
      for (let k = 0; k < Math.min(r, rows); k++) off += steps[k] - 0.5;
      const frac = rf - r;
      if (r < rows) off += (steps[r] - 0.5) * frac;
      flying.push(<circle key={`b${i}`} cx={cx + off * dx} cy={top + rf * dy} r={beadR} fill={G.goldBright} style={glowLine(G.gold, 3)} />);
    }
  }
  const binW = dx;
  const perRow = Math.max(1, Math.floor(binW / (beadR * 2.1)));
  const stacks: React.ReactNode[] = [];
  bins.forEach((c, b) => {
    const bx = cx + (b - rows / 2) * dx;
    for (let j = 0; j < c; j++) {
      const col = j % perRow;
      const row = Math.floor(j / perRow);
      stacks.push(<circle key={`s${b}-${j}`} cx={bx - binW / 2 + beadR * 1.05 + col * beadR * 2.1} cy={h - 18 - beadR - row * beadR * 2} r={beadR} fill={G.gold} />);
    }
  });
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <rect x={1} y={1} width={w - 2} height={h - 2} rx={10} fill="rgba(10,8,5,0.6)" stroke={G.goldLine} strokeWidth={1.5} />
      <path d={`M${cx - 140} ${top - 46} L${cx - 10} ${top - 12} M${cx + 140} ${top - 46} L${cx + 10} ${top - 12}`} stroke={G.gold} strokeWidth={1.5} />
      {Array.from({length: rows}, (_, r) =>
        Array.from({length: r + 1}, (_, k) => <circle key={`p${r}-${k}`} cx={cx + (k - r / 2) * dx} cy={top + (r + 0.5) * dy} r={2.2} fill={G.ivoryDim} />),
      )}
      {Array.from({length: rows + 2}, (_, b) => (
        <line key={`w${b}`} x1={cx + (b - (rows + 1) / 2) * dx} x2={cx + (b - (rows + 1) / 2) * dx} y1={binTop} y2={h - 16} stroke={G.goldFaint} strokeWidth={1} />
      ))}
      <line x1={20} x2={w - 20} y1={h - 16} y2={h - 16} stroke={G.gold} strokeWidth={1.5} />
      {stacks}
      {flying}
      {curve > 0 ? <path d={bellPath(cx - (rows / 2 + 1.2) * dx, cx + (rows / 2 + 1.2) * dx, h - 16, binH * 0.85, 100, 0.13)} fill="none" stroke={G.goldBright} strokeWidth={2.4} pathLength={1} strokeDasharray={`${curve} 1`} style={glowLine(G.gold, 6)} /> : null}
    </svg>
  );
};

/**
 * 收敛曲线：反复抽样时「累计比例」随次数变化，x 轴对数刻度，虚线标出真实值。
 * n 为当前已抽次数（可以按帧指数增长），truth 为真实概率，seed 决定这条随机路径。
 */
export const RatioChart: React.FC<{w: number; h: number; n: number; truth: number; maxN?: number; seed?: number; yLabel?: string; truthLabel?: string}> = ({w, h, n, truth, maxN = 10000, seed = 3, yLabel, truthLabel}) => {
  const lx = (k: number) => (Math.log10(Math.max(1, k)) / Math.log10(maxN)) * w;
  const ly = (v: number) => h - v * h;
  const pts: string[] = [];
  let hits = 0;
  const N = Math.min(maxN, Math.floor(n));
  let last = 0;
  let k = 1;
  for (let i = 1; i <= N; i++) {
    if (rand(seed * 977 + i) < truth) hits++;
    if (i === k || i === N) {
      last = hits / i;
      pts.push(`${pts.length ? 'L' : 'M'}${lx(i).toFixed(1)} ${ly(last).toFixed(1)}`);
      k = Math.max(i + 1, Math.ceil(i * 1.04));
    }
  }
  const ticks = [1, 10, 100, 1000, 10000].filter((t) => t <= maxN);
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
        <g key={v}>
          <line x1={0} x2={w} y1={ly(v)} y2={ly(v)} stroke="rgba(239,230,210,0.06)" />
          <text x={-12} y={ly(v) + 4} textAnchor="end" fontFamily={GF.num} fontSize={17} fill={G.ivoryFaint}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {ticks.map((t) => (
        <text key={t} x={lx(t)} y={h + 24} textAnchor="middle" fontFamily={GF.num} fontSize={17} fill={G.ivoryFaint}>
          {t.toLocaleString('en-US')}
        </text>
      ))}
      <line x1={0} x2={w} y1={h} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={0} y1={0} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={w} y1={ly(truth)} y2={ly(truth)} stroke={G.ivoryDim} strokeDasharray="5 6" />
      {truthLabel ? (
        <text x={w} y={ly(truth) - 10} textAnchor="end" fontFamily={GF.cn} fontSize={16} fill={G.gold}>
          {truthLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text x={0} y={-16} fontFamily={GF.cn} fontSize={15} fill={G.ivoryFaint}>
          {yLabel}
        </text>
      ) : null}
      {pts.length ? <path d={pts.join(' ')} fill="none" stroke={G.ivory} strokeWidth={1.6} style={glowLine(G.gold, 3)} /> : null}
      {N > 0 ? <circle cx={lx(N)} cy={ly(last)} r={5} fill={G.goldBright} style={glowLine(G.gold, 6)} /> : null}
    </svg>
  );
};

/** 点阵人群：cols×rows 个小点，p 为点亮进度（按确定性随机顺序亮起），color 可按序号给不同颜色 */
export const DotField: React.FC<{cols: number; rows: number; gap?: number; r?: number; p: number; color?: (i: number) => string}> = ({cols, rows, gap = 12, r = 2.2, p, color}) => (
  <svg width={cols * gap} height={rows * gap}>
    {Array.from({length: cols * rows}, (_, i) => {
      const on = clamp01((p - rand(i * 13 + 5) * 0.85) / 0.15);
      if (on <= 0) return null;
      return <circle key={i} cx={(i % cols) * gap + gap / 2} cy={Math.floor(i / cols) * gap + gap / 2} r={r} fill={color?.(i) ?? G.ivory} opacity={on} />;
    })}
  </svg>
);

/** 金线圆环刻度（命运之轮 / 表盘）：外圈刻度 + 辐条 + 沿圆周排列的文字，spin 为旋转角度 */
export const GoldWheel: React.FC<{size: number; spin: number; spokes?: number; ring?: string[]; p?: number}> = ({size, spin, spokes = 8, ring = [], p = 1}) => {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{overflow: 'visible'}}>
      <g transform={`rotate(${spin})`} opacity={p}>
        <circle r={r * 0.98} fill="none" stroke={G.goldLine} strokeWidth={1.5} pathLength={1} strokeDasharray={`${p} 1`} />
        <circle r={r * 0.86} fill="none" stroke={G.goldFaint} strokeWidth={1} />
        <circle r={r * 0.62} fill="none" stroke={G.goldLine} strokeWidth={2} />
        <circle r={r * 0.14} fill="none" stroke={G.gold} strokeWidth={2} />
        <circle r={r * 0.04} fill={G.goldBright} />
        {Array.from({length: spokes}, (_, i) => {
          const a = (i / spokes) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * r * 0.14} y1={Math.sin(a) * r * 0.14} x2={Math.cos(a) * r * 0.62} y2={Math.sin(a) * r * 0.62} stroke={G.goldLine} strokeWidth={3} />;
        })}
        {Array.from({length: 72}, (_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const l = i % 6 === 0 ? 0.9 : 0.94;
          return <line key={`t${i}`} x1={Math.cos(a) * r * l} y1={Math.sin(a) * r * l} x2={Math.cos(a) * r * 0.98} y2={Math.sin(a) * r * 0.98} stroke={G.goldFaint} />;
        })}
        {ring.map((word, i) => {
          const a = (i / ring.length) * 360;
          return (
            <text key={i} transform={`rotate(${a}) translate(0 ${-r * 0.91})`} textAnchor="middle" fontFamily={GF.latin} fontSize={size * 0.035} letterSpacing={4} fill={G.gold}>
              {word}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
