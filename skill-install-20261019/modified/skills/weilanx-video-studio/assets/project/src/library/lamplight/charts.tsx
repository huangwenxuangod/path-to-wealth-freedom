import React from 'react';
import {clamp01, rand} from '../anim';
import {FlameG} from './props';
import {L, LF, fadeSoft, textShadow} from './theme';

/**
 * 灯火史话风的「图」：透视城市方格（逐格亮灯）、俯视坊块（禁区斜纹）、程序地形浮雕、发光点线路径、地图地点。
 * 坐标都是 1920×1080 舞台坐标；所有动画由帧号 f 算出。
 */

const Layer: React.FC<{opacity?: number; filter?: string; children: React.ReactNode}> = ({opacity = 1, filter, children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity, filter}}>
    {children}
  </svg>
);

/** 一团暖色灯光的径向渐变（各组件共用 id） */
const LightDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <radialGradient id={id}>
      <stop offset="0%" stopColor="rgba(255,226,160,1)" />
      <stop offset="18%" stopColor="rgba(250,190,90,0.75)" />
      <stop offset="55%" stopColor="rgba(220,140,50,0.18)" />
      <stop offset="100%" stopColor="rgba(220,140,50,0)" />
    </radialGradient>
  </defs>
);

export type CellLabel = {c: number; r: number; text: string; w?: number};

/**
 * 透视城市方格：俯瞰的一座城，cols×rows 个街区，中轴一条大街，顶部居中一块主城（core）。
 * lightAt 起每格在 lightSpread 帧内随机亮起几盏灯；darkAt 起同样随机熄灭；labels 指定的格子画虚线框写名字（不点灯）；
 * hot 把某几格染成朱红（出事的地方）。geometry：cx 中线、top / bottom 上下边、topHalf / botHalf 上下半宽。
 */
export const CityGrid: React.FC<{
  f: number;
  cols?: number;
  rows?: number;
  cx?: number;
  top?: number;
  bottom?: number;
  topHalf?: number;
  botHalf?: number;
  lightAt?: number;
  lightSpread?: number;
  darkAt?: number;
  darkSpread?: number;
  core?: {c0: number; c1: number; r0: number; r1: number; label: string};
  labels?: CellLabel[];
  hot?: {c: number; r: number}[];
  seed?: number;
  opacity?: number;
}> = ({
  f,
  cols = 12,
  rows = 13,
  cx = 1072,
  top = 440,
  bottom = 1050,
  topHalf = 600,
  botHalf = 770,
  lightAt,
  lightSpread = 40,
  darkAt,
  darkSpread = 40,
  core = {c0: 4, c1: 7, r0: 0, r1: 2, label: '主城'},
  labels = [],
  hot = [],
  seed = 3,
  opacity = 1,
}) => {
  const P = (u: number, v: number): [number, number] => {
    const half = topHalf + (botHalf - topHalf) * v;
    return [cx + (u - 0.5) * 2 * half, top + (bottom - top) * v];
  };
  const poly = (u0: number, v0: number, u1: number, v1: number) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.join(',')).join(' ');
  const mid = cols / 2;
  const cells: React.ReactNode[] = [];
  const lights: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c >= core.c0 && c <= core.c1 && r >= core.r0 && r <= core.r1) continue;
      const av = c === mid - 1 ? -0.006 : c === mid ? 0.006 : 0; // 中轴大街
      const gu = 0.1 / cols;
      const gv = 0.16 / rows;
      const u0 = c / cols + gu + av;
      const u1 = (c + 1) / cols - gu + av;
      const v0 = r / rows + gv;
      const v1 = (r + 1) / rows - gv * 0.4;
      const lab = labels.find((l) => l.c === c && l.r === r);
      const isHot = hot.some((h) => h.c === c && h.r === r);
      const [bx, by] = P((u0 + u1) / 2, v1);
      cells.push(
        <g key={`${c}-${r}`}>
          <polygon points={poly(u0, v0, u1, v1)} fill={isHot ? 'rgba(225,104,79,0.25)' : 'rgba(0,0,0,0.25)'} stroke={isHot ? L.red : 'rgba(239,230,214,0.28)'} strokeWidth={1.4} strokeDasharray={lab ? '5 5' : undefined} />
          {!lab && <line x1={bx - 10} x2={bx + 10} y1={by - 2} y2={by - 2} stroke="rgba(239,230,214,0.45)" strokeWidth={2} />}
        </g>,
      );
      if (lab) continue;
      const s = seed * 997 + r * 31 + c;
      const order = rand(s);
      const on = lightAt === undefined ? 0 : clamp01((f - lightAt - order * lightSpread) / 8);
      const off = darkAt === undefined ? 1 : 1 - clamp01((f - darkAt - rand(s + 0.3) * darkSpread) / 10);
      const v = on * off;
      if (v <= 0 || rand(s + 9) < 0.12) continue;
      const n = 1 + Math.floor(rand(s + 1) * 3);
      for (let k = 0; k < n; k++) {
        const [lx, ly] = P(u0 + (u1 - u0) * (0.15 + 0.7 * rand(s + k * 7 + 2)), v0 + (v1 - v0) * (0.2 + 0.6 * rand(s + k * 7 + 3)));
        const sz = (3.6 + 3 * (r / rows)) * (0.8 + 0.4 * rand(s + k * 7 + 4));
        const fl = 0.85 + 0.15 * Math.sin(f / (6 + rand(s + k) * 6) + k * 2 + c);
        lights.push(<circle key={`${c}-${r}-${k}`} cx={lx} cy={ly} r={sz * 4.2} fill="url(#lc-light)" opacity={v * fl} />);
      }
    }
  }
  const [c0x, c0y] = P(core.c0 / cols, core.r0 / rows);
  const [c1x, c1y] = P((core.c1 + 1) / cols, (core.r1 + 1) / rows);
  return (
    <>
      <Layer opacity={opacity}>
        <LightDefs id="lc-light" />
        <polygon points={poly(-0.01, -0.01, 1.01, 1.0)} fill="rgba(20,15,11,0.6)" stroke="rgba(239,230,214,0.35)" strokeWidth={2} />
        {cells}
        <polygon points={poly(core.c0 / cols + 0.006, core.r0 / rows + 0.01, (core.c1 + 1) / cols - 0.006, (core.r1 + 1) / rows - 0.004)} fill="rgba(60,44,30,0.55)" stroke="rgba(239,230,214,0.5)" strokeWidth={2} />
        <g style={{mixBlendMode: 'screen'}}>{lights}</g>
      </Layer>
      <div style={{position: 'absolute', left: (c0x + c1x) / 2 - 200, width: 400, top: (c0y + c1y) / 2 - 22, textAlign: 'center', fontFamily: LF.label, fontWeight: 700, fontSize: 30, color: 'rgba(239,230,214,0.6)', opacity}}>{core.label}</div>
      {labels.map((l) => {
        const [x, y] = P((l.c + 0.5) / cols, (l.r + 0.55) / rows);
        return (
          <div key={`${l.c}-${l.r}`} style={{position: 'absolute', left: x - 100, width: 200, top: y - 18, textAlign: 'center', fontFamily: LF.label, fontWeight: 700, fontSize: 26, color: 'rgba(239,230,214,0.55)', opacity}}>
            {l.text}
          </div>
        );
      })}
    </>
  );
};

/**
 * 俯视坊块：一个方形院落，十字街把它分成四块，每块里几团灯光；ban 0–1 时外面铺朱红斜纹、四面写「禁」（banText）；
 * walkers 个小光点在十字街上来回走（坊内照样可以走动）；lit 0–1 控制灯光。
 */
export const WardPlan: React.FC<{f: number; x?: number; y?: number; size?: number; lit?: number; ban?: number; banText?: string; walkers?: number; seed?: number; opacity?: number}> = ({
  f,
  x = 960,
  y = 620,
  size = 300,
  lit = 1,
  ban = 0,
  banText = '禁',
  walkers = 0,
  seed = 2,
  opacity = 1,
}) => {
  const h = size / 2;
  const st = size * 0.07;
  const blocks: [number, number][] = [
    [-h, -h],
    [st / 2, -h],
    [-h, st / 2],
    [st / 2, st / 2],
  ];
  const bw = h - st / 2;
  return (
    <>
      <Layer opacity={opacity}>
        <LightDefs id="lw-light" />
        <defs>
          <pattern id="lw-hatch" width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={26} stroke="rgba(225,104,79,0.45)" strokeWidth={3} />
          </pattern>
          <mask id="lw-out">
            <rect width={1920} height={1080} fill="#fff" />
            <rect x={x - h - 6} y={y - h - 6} width={size + 12} height={size + 12} fill="#000" />
          </mask>
        </defs>
        {ban > 0 && <rect width={1920} height={1080} fill="url(#lw-hatch)" mask="url(#lw-out)" opacity={ban} />}
        <g transform={`translate(${x} ${y})`}>
          <rect x={-h} y={-h} width={size} height={size} fill="#120d0a" />
          {blocks.map(([bx, by], i) => (
            <g key={i}>
              <rect x={bx} y={by} width={bw} height={bw} fill="#241b14" />
              {[0, 1].map((a) =>
                [0, 1].map((b) => <rect key={`${a}${b}`} x={bx + 8 + (a * (bw - 8)) / 2} y={by + 8 + (b * (bw - 8)) / 2} width={(bw - 24) / 2} height={(bw - 24) / 2} fill="#30261c" stroke="rgba(239,230,214,0.12)" />),
              )}
              <g style={{mixBlendMode: 'screen'}}>
                {Array.from({length: 4}, (_, k) => (
                  <circle
                    key={k}
                    cx={bx + bw * (0.2 + 0.6 * rand(seed * 50 + i * 9 + k))}
                    cy={by + bw * (0.2 + 0.6 * rand(seed * 50 + i * 9 + k + 4))}
                    r={size * 0.09}
                    fill="url(#lw-light)"
                    opacity={lit * (0.8 + 0.2 * Math.sin(f / 7 + k + i))}
                  />
                ))}
              </g>
            </g>
          ))}
          {Array.from({length: walkers}, (_, k) => {
            const along = rand(seed + k * 3);
            const sp = 0.004 + 0.006 * rand(seed + k * 3 + 1);
            const t = (((along + f * sp) % 2) + 2) % 2;
            const pos = (t < 1 ? t : 2 - t) * size - h;
            const horiz = k % 2 === 0;
            const off = (rand(seed + k * 3 + 2) - 0.5) * st * 0.6;
            return <circle key={k} cx={horiz ? pos : off} cy={horiz ? off : pos} r={3.5} fill="#fff6dc" />;
          })}
          <rect x={-h} y={-h} width={size} height={size} fill="none" stroke="rgba(239,230,214,0.85)" strokeWidth={4} />
          {[
            [0, -h],
            [0, h],
            [-h, 0],
            [h, 0],
          ].map(([gx, gy], i) => (
            <rect key={i} x={gx - (gy === 0 ? 4 : st / 2)} y={gy - (gy === 0 ? st / 2 : 4)} width={gy === 0 ? 8 : st} height={gy === 0 ? st : 8} fill={L.redDeep} />
          ))}
        </g>
      </Layer>
      {ban > 0 &&
        [
          [x, y - h - 70],
          [x, y + h + 70],
          [x - h - 90, y],
          [x + h + 90, y],
        ].map(([bx, by], i) => (
          <div key={i} style={{position: 'absolute', left: bx - 40, top: by - 30, width: 80, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: 44, color: L.red, opacity: ban, textShadow}}>
            {banText}
          </div>
        ))}
    </>
  );
};

/**
 * 程序地形浮雕：分形噪声 + 漫反射光照算出的暗褐色山地（不对应任何真实地形）。
 * 尺寸比屏幕大（w × h），镜头把地图坐标 (camX, camY) 放在画面中心、缩放 camS；borders 是几条淡金色界线路径（地图坐标）。
 */
export const ReliefMap: React.FC<{w?: number; h?: number; seed?: number; camX?: number; camY?: number; camS?: number; borders?: string[]; children?: React.ReactNode; opacity?: number}> = ({
  w = 2600,
  h = 1600,
  seed = 7,
  camX = 960,
  camY = 540,
  camS = 1,
  borders = [],
  children,
  opacity = 1,
}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#100d0a', opacity}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `translate(960px, 540px) scale(${camS}) translate(${-camX}px, ${-camY}px)`, transformOrigin: '0 0'}}>
      <svg width={w} height={h} style={{position: 'absolute'}}>
        <defs>
          <filter id={`lr-relief-${seed}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0052" numOctaves={8} seed={seed} result="n" />
            <feDiffuseLighting in="n" surfaceScale={26} lightingColor="#9c8c76" diffuseConstant={1.15} result="d">
              <feDistantLight azimuth={225} elevation={32} />
            </feDiffuseLighting>
            <feComponentTransfer>
              <feFuncR type="gamma" exponent={2.6} amplitude={1.0} />
              <feFuncG type="gamma" exponent={2.6} amplitude={0.94} />
              <feFuncB type="gamma" exponent={2.6} amplitude={0.82} />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width={w} height={h} filter={`url(#lr-relief-${seed})`} opacity={0.8} />
        {borders.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(214,170,100,0.32)" strokeWidth={3} />
        ))}
      </svg>
      {children}
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)'}} />
  </div>
);

/** 把几个关键点加密成一条自然弯曲的路线（每 step 像素一个点，垂直方向加正弦扰动 amp） */
export const wiggle = (pts: [number, number][], seed = 1, amp = 14, step = 8): [number, number][] => {
  const out: [number, number][] = [];
  let dist = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = -(y1 - y0) / len;
    const ny = (x1 - x0) / len;
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const d = dist + len * t;
      const env = Math.sin(t * Math.PI);
      const o = amp * env * (Math.sin(d / 47 + seed) + 0.6 * Math.sin(d / 19 + seed * 2.3));
      out.push([x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o]);
    }
    dist += len;
  }
  out.push(pts[pts.length - 1]);
  return out;
};

/** 沿折线走到进度 p（0–1）处的点 */
export const routeAt = (pts: [number, number][], p: number): [number, number] => {
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = clamp01(p) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const t = lens[i] === 0 ? 0 : d / lens[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
};

/**
 * 发光点线路径：at 起 dur 帧沿 pts 画出一串发光金点（间隔 gap 像素），底下垫一条模糊的光带，路头一颗亮点；
 * color 换色；fire 让路头变成一小团火。pts 用 wiggle() 生成。
 */
export const GlowRoute: React.FC<{f: number; at: number; dur: number; pts: [number, number][]; gap?: number; color?: string; fire?: boolean; out?: number; width?: number; height?: number}> = ({
  f,
  at,
  dur,
  pts,
  gap = 11,
  color = L.gold,
  fire = false,
  out,
  width = 1920,
  height = 1080,
}) => {
  const fo = out === undefined ? 1 : 1 - clamp01((f - out) / 14);
  const t = clamp01((f - at) / Math.max(1, dur));
  const p = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  if (p <= 0 || fo <= 0) return null;
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const n = Math.floor((total * p) / gap);
  const dots = Array.from({length: n + 1}, (_, i) => routeAt(pts, (i * gap) / total));
  const drawn: [number, number][] = [];
  let acc = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) acc += lens[i - 1];
    if (acc <= total * p) drawn.push(pts[i]);
  }
  const head = routeAt(pts, p);
  drawn.push(head);
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fo}}>
      <defs>
        <filter id="lg-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <polyline points={drawn.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={14} opacity={0.55} filter="url(#lg-blur)" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.4} fill="#ffe7b0" style={{filter: `drop-shadow(0 0 4px ${color})`}} />
      ))}
      {fire && p < 1 ? (
        <g transform={`translate(${head[0]} ${head[1] + 6})`}>
          <FlameG f={f} size={0.5} seed={41} />
        </g>
      ) : (
        <circle cx={head[0]} cy={head[1]} r={9} fill="#fff1c8" style={{filter: `drop-shadow(0 0 12px ${color})`}} />
      )}
    </svg>
  );
};

/**
 * 地图地点：kind 'city' 小城门图标、'dot' 白点、'fire' 一团火；label 金色宋体地名（side 写在哪一侧）。
 * 坐标和 GlowRoute 一样是地图 / 舞台坐标，放在 ReliefMap 的 children 里就跟着镜头走。
 */
export const Waypoint: React.FC<{f: number; at: number; x: number; y: number; label?: string; kind?: 'city' | 'dot' | 'fire'; side?: 'right' | 'left' | 'top' | 'bottom'; size?: number; color?: string; out?: number}> = ({
  f,
  at,
  x,
  y,
  label,
  kind = 'dot',
  side = 'right',
  size = 44,
  color = L.gold,
  out,
}) => {
  const a = fadeSoft(f, at, 14, out);
  if (a.v <= 0) return null;
  const lp: React.CSSProperties =
    side === 'right'
      ? {left: x + 36, top: y - size * 0.75}
      : side === 'left'
        ? {left: x - 36 - 400, width: 400, top: y - size * 0.75, textAlign: 'right'}
        : side === 'top'
          ? {left: x - 200, width: 400, top: y - 70 - size * 1.3, textAlign: 'center'}
          : {left: x - 200, width: 400, top: y + 22, textAlign: 'center'};
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {kind === 'dot' && <circle cx={x} cy={y} r={8} fill="#fff6dc" style={{filter: 'drop-shadow(0 0 8px #fff)'}} />}
        {kind === 'city' && (
          <g transform={`translate(${x} ${y})`}>
            <rect x={-30} y={-34} width={60} height={34} fill="#7c3a26" />
            <rect x={-10} y={-20} width={20} height={20} rx={6} fill="#1a0f0a" />
            <path d="M-40 -32 L-30 -48 L30 -48 L40 -32 Z" fill="#d8a63e" />
            <rect x={-22} y={-60} width={44} height={13} fill="#7c3a26" />
            <path d="M-30 -58 L-20 -70 L20 -70 L30 -58 Z" fill="#e8b84a" />
          </g>
        )}
        {kind === 'fire' && (
          <g transform={`translate(${x} ${y})`}>
            <FlameG f={f} size={0.6} seed={x} />
          </g>
        )}
      </svg>
      {label && <div style={{position: 'absolute', ...lp, fontFamily: LF.serif, fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap', textShadow}}>{label}</div>}
    </div>
  );
};

/**
 * 满地驿站光点：在椭圆区域（cx, cy, rx, ry，地图坐标）里撒 n 个确定性随机的小光点；
 * lightAt 起在 lightSpread 帧内随机亮起，darkAt 起在 darkSpread 帧内随机熄灭；r 光点半径。放在 ReliefMap 的 children 里。
 */
export const StationDots: React.FC<{
  f: number;
  n: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  lightAt: number;
  lightSpread?: number;
  darkAt?: number;
  darkSpread?: number;
  r?: number;
  seed?: number;
  color?: string;
  width?: number;
  height?: number;
}> = ({f, n, cx = 1300, cy = 800, rx = 900, ry = 520, lightAt, lightSpread = 40, darkAt, darkSpread = 60, r = 3.2, seed = 5, color = '#ffd98a', width = 2600, height = 1600}) => {
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = rand(seed * 31 + i) * Math.PI * 2;
    const d = Math.sqrt(rand(seed * 17 + i * 3));
    const x = cx + Math.cos(a) * rx * d;
    const y = cy + Math.sin(a) * ry * d;
    const on = clamp01((f - lightAt - rand(i * 7 + seed) * lightSpread) / 6);
    const off = darkAt === undefined ? 1 : 1 - clamp01((f - darkAt - rand(i * 11 + seed) * darkSpread) / 8);
    const v = on * off;
    if (v <= 0) continue;
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={color} opacity={v * (0.75 + 0.25 * Math.sin(f / 8 + i))} />);
  }
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <filter id={`ls-glow-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#ls-glow-${seed})`}>{dots}</g>
    </svg>
  );
};

/**
 * 接力链：沿路线 pts 在 stops（0–1 的位置）上放驿站，第 k 站在 litAt[k] 帧点亮——路头恰好在那一帧到站，
 * 亮起时放一圈光环；路线只画到路头。用来把配乐的硬拍变成「一站一站往前传」。fire 让路头是一团火。
 */
export const RelayChain: React.FC<{f: number; pts: [number, number][]; stops: number[]; litAt: number[]; color?: string; fire?: boolean; gap?: number; width?: number; height?: number; out?: number}> = ({
  f,
  pts,
  stops,
  litAt,
  color = L.gold,
  fire = true,
  gap = 11,
  width = 2600,
  height = 1600,
  out,
}) => {
  const fo = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  if (fo <= 0 || f < litAt[0]) return null;
  // 路头进度：相邻两站之间按帧缓出插值
  let p = stops[0];
  for (let k = 1; k < stops.length; k++) {
    if (f >= litAt[k]) p = stops[k];
    else if (f >= litAt[k - 1]) {
      const t = (f - litAt[k - 1]) / Math.max(1, litAt[k] - litAt[k - 1]);
      p = stops[k - 1] + (stops[k] - stops[k - 1]) * (1 - Math.pow(1 - t, 1.6));
      break;
    }
  }
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const n = Math.floor((total * p) / gap);
  const head = routeAt(pts, p);
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fo}}>
      {Array.from({length: n + 1}, (_, i) => {
        const [x, y] = routeAt(pts, (i * gap) / total);
        return <circle key={i} cx={x} cy={y} r={3.4} fill="#ffe7b0" style={{filter: `drop-shadow(0 0 4px ${color})`}} />;
      })}
      {stops.map((s, k) => {
        const [x, y] = routeAt(pts, s);
        const lit = f >= litAt[k];
        const t = f - litAt[k];
        return (
          <g key={k} transform={`translate(${x} ${y})`}>
            {lit && t < 18 && <circle r={14 + t * 4} fill="none" stroke={L.goldHot} strokeWidth={4 * (1 - t / 18)} opacity={1 - t / 18} />}
            <rect x={-13} y={-13} width={26} height={26} rx={4} fill={lit ? '#3a2616' : 'rgba(20,15,11,0.85)'} stroke={lit ? L.gold : 'rgba(239,230,214,0.35)'} strokeWidth={3} />
            <path d="M-17 -12 L0 -26 L17 -12 Z" fill={lit ? L.gold : 'rgba(239,230,214,0.35)'} />
            {lit && <circle r={22} fill={L.gold} opacity={0.18 + (t < 10 ? 0.4 * (1 - t / 10) : 0)} />}
          </g>
        );
      })}
      {fire && p < stops[stops.length - 1] ? (
        <g transform={`translate(${head[0]} ${head[1] + 6})`}>
          <FlameG f={f} size={0.55} seed={77} />
        </g>
      ) : (
        <circle cx={head[0]} cy={head[1]} r={10} fill="#fff1c8" style={{filter: `drop-shadow(0 0 14px ${color})`}} />
      )}
    </svg>
  );
};
