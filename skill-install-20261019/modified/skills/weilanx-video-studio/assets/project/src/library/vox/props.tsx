import React from 'react';
import {rand} from '../anim';
import {step12, V, VF} from './theme';

/* ============ 纸与桌面 ============ */

/** 静态纸纹（Vox 的纸纹是死的，不逐帧抖）：seed 决定纹理 */
export const PaperGrainSvg: React.FC<{w: number; h: number; seed?: number; opacity?: number}> = ({w, h, seed = 3, opacity = 0.35}) => (
  <svg width={w} height={h} style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity}}>
    <filter id={`pg${seed}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
      <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0.55 0" />
    </filter>
    <filter id={`pf${seed}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={seed + 7} />
      <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.35 0" />
    </filter>
    <rect width={w} height={h} filter={`url(#pf${seed})`} />
    <rect width={w} height={h} filter={`url(#pg${seed})`} />
  </svg>
);

/** 桌面：一大张纸，带纤维和低频明暗 */
export const Desk: React.FC<{w: number; h: number; color?: string; seed?: number}> = ({w, h, color = V.desk, seed = 1}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, background: color}}>
    <PaperGrainSvg w={w} h={h} seed={seed} opacity={0.5} />
  </div>
);

/** 撕边多边形（clip-path），edge 为每条边的锯齿幅度 */
const tornPath = (w: number, h: number, seed: number, amp = 6, sides: [boolean, boolean, boolean, boolean] = [true, true, true, true]) => {
  const pts: string[] = [];
  const n = (len: number) => Math.max(4, Math.round(len / 14));
  const j = (i: number) => (rand(seed + i * 1.37) - 0.5) * 2 * amp;
  let k = 0;
  const [top, right, bottom, left] = sides;
  for (let i = 0; i <= n(w); i++) pts.push(`${(i / n(w)) * 100}% ${top ? Math.max(0, amp + j(k++)) : 0}px`);
  for (let i = 1; i <= n(h); i++) pts.push(`calc(100% - ${right ? Math.max(0, amp + j(k++)) : 0}px) ${(i / n(h)) * 100}%`);
  for (let i = n(w) - 1; i >= 0; i--) pts.push(`${(i / n(w)) * 100}% calc(100% - ${bottom ? Math.max(0, amp + j(k++)) : 0}px)`);
  for (let i = n(h) - 1; i >= 1; i--) pts.push(`${left ? Math.max(0, amp + j(k++)) : 0}px ${(i / n(h)) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

/** 弱投影（Vox 投影很弱）：包在纸片外层 */
export const shadow = 'drop-shadow(3px 6px 6px rgba(23,23,22,0.28))';

/** 撕边纸片（剪报、便条的底） */
export const Torn: React.FC<{w: number; h: number; color?: string; seed?: number; amp?: number; sides?: [boolean, boolean, boolean, boolean]; rot?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, h, color = V.paperWarm, seed = 11, amp = 6, sides, rot = 0, children, style}) => (
  <div style={{width: w, height: h, transform: `rotate(${rot}deg)`, filter: shadow, ...style}}>
    <div style={{position: 'relative', width: w, height: h, background: color, clipPath: tornPath(w, h, seed, amp, sides)}}>
      <PaperGrainSvg w={w} h={h} seed={seed} opacity={0.3} />
      <div style={{position: 'relative', width: '100%', height: '100%'}}>{children}</div>
    </div>
  </div>
);

/** 报纸剪报：报头小字、宋体/衬线大标题、正文灰行 */
export const Clipping: React.FC<{
  w: number;
  h: number;
  paper?: string;
  date?: string;
  head: React.ReactNode;
  sub?: React.ReactNode;
  lines?: number;
  headSize?: number;
  seed?: number;
  rot?: number;
  children?: React.ReactNode;
}> = ({w, h, paper = V.paperWarm, date, head, sub, lines = 6, headSize = 54, seed = 21, rot = 0, children}) => (
  <Torn w={w} h={h} color={paper} seed={seed} rot={rot}>
    <div style={{padding: '30px 34px', color: V.ink}}>
      {date && <div style={{fontFamily: VF.body, fontSize: 22, letterSpacing: 2, borderBottom: `2px solid ${V.ink}`, paddingBottom: 6, marginBottom: 14, color: V.inkSoft}}>{date}</div>}
      <div style={{fontFamily: VF.head, fontSize: headSize, lineHeight: 1.05}}>{head}</div>
      {sub && <div style={{fontFamily: VF.body, fontSize: headSize * 0.42, marginTop: 10, lineHeight: 1.25}}>{sub}</div>}
      {children}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 22, marginTop: 18}}>
        {Array.from({length: lines * 2}, (_, i) => (
          <div key={i} style={{height: 9, marginTop: 11, borderRadius: 2, background: 'rgba(23,23,22,0.22)', width: `${70 + rand(seed + i) * 30}%`}} />
        ))}
      </div>
    </div>
  </Torn>
);

/** 一条半透明胶带 */
export const Tape: React.FC<{w?: number; rot?: number}> = ({w = 120, rot = -8}) => (
  <div style={{width: w, height: 34, background: 'rgba(238,230,205,0.72)', transform: `rotate(${rot}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,0.12)', clipPath: 'polygon(3% 0, 97% 4%, 100% 100%, 0 96%)'}} />
);

/**
 * 网点照片：把任意灰度画面（children，通常是 SVG）做成 45° 网点，白边、两条胶带。
 * 做法：灰度 + 微糊，叠一层网点渐变（screen），再整体拉高对比，暗处的点就变大。
 */
export const HalftonePhoto: React.FC<{w: number; h: number; dot?: number; rot?: number; tint?: string; caption?: string; tape?: boolean; children: React.ReactNode}> = ({w, h, dot = 7, rot = 0, tint = '#efe9dc', caption, tape = true, children}) => (
  <div style={{position: 'relative', width: w + 28, transform: `rotate(${rot}deg)`, filter: shadow}}>
    <div style={{background: V.paper, padding: 14, paddingBottom: caption ? 6 : 14}}>
      <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', isolation: 'isolate'}}>
        <div style={{position: 'absolute', inset: 0, background: '#fff', filter: 'contrast(18)'}}>
          <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) brightness(0.55) blur(1px)'}}>{children}</div>
          <div
            style={{
              position: 'absolute',
              left: -w,
              top: -h,
              width: w * 3,
              height: h * 3,
              transform: 'rotate(45deg)',
              backgroundImage: `radial-gradient(circle at center, #000 0, #000 22%, #fff 72%)`,
              backgroundSize: `${dot}px ${dot}px`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
        <div style={{position: 'absolute', inset: 0, background: tint, mixBlendMode: 'multiply'}} />
      </div>
      {caption && <div style={{fontFamily: VF.body, fontSize: 22, color: V.ink, textAlign: 'center', marginTop: 6}}>{caption}</div>}
    </div>
    {tape && (
      <>
        <div style={{position: 'absolute', left: -20, top: -12}}><Tape w={110} rot={-24} /></div>
        <div style={{position: 'absolute', right: -20, top: -12}}><Tape w={110} rot={22} /></div>
      </>
    )}
  </div>
);

/** Borders 式黑底白字粗体标签条：「1958 · 纽约时报」 */
export const Label: React.FC<{children: React.ReactNode; size?: number; bg?: string; color?: string}> = ({children, size = 34, bg = V.ink, color = V.paper}) => (
  <div style={{display: 'inline-block', background: bg, color, fontFamily: VF.heavy, fontSize: size, padding: `${size * 0.18}px ${size * 0.45}px`, lineHeight: 1.1, letterSpacing: 1, whiteSpace: 'nowrap'}}>{children}</div>
);

/** 横线索引卡 */
export const IndexCard: React.FC<{w: number; h: number; rot?: number; children?: React.ReactNode}> = ({w, h, rot = 0, children}) => (
  <div style={{position: 'relative', width: w, height: h, transform: `rotate(${rot}deg)`, filter: shadow}}>
    <div style={{position: 'absolute', inset: 0, background: V.paper, backgroundImage: `linear-gradient(transparent 0, transparent 47px, rgba(184,67,63,0.5) 47px, rgba(184,67,63,0.5) 49px, transparent 49px), repeating-linear-gradient(transparent 0, transparent 37px, rgba(80,110,160,0.28) 37px, rgba(80,110,160,0.28) 39px)`}}>
      <PaperGrainSvg w={w} h={h} seed={5} opacity={0.25} />
    </div>
    <div style={{position: 'relative', padding: '58px 26px 20px'}}>{children}</div>
  </div>
);

/* ============ 线与笔（一拍二步进） ============ */

const prog12 = (f: number, at: number, dur: number) => Math.max(0, Math.min(1, (step12(f) - at) / dur));

/** 手画线：points 按长度描出，p 为 0..1。线头带实心红点 */
export const HandLine: React.FC<{points: [number, number][]; p: number; color?: string; width?: number; dot?: boolean; dashed?: boolean}> = ({points, p, color = V.red, width = 6, dot = true, dashed}) => {
  const segs = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let left = total * Math.max(0, Math.min(1, p));
  const drawn: [number, number][] = [points[0]];
  for (let i = 0; i < segs.length && left > 0; i++) {
    const t = Math.min(1, left / segs[i]);
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    drawn.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    left -= segs[i];
  }
  const head = drawn[drawn.length - 1];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <polyline points={drawn.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? `${width * 2.5} ${width * 2}` : undefined} />
      {dot && p > 0 && <circle cx={head[0]} cy={head[1]} r={width * 1.3} fill={color} />}
    </svg>
  );
};

/** 带下垂的红线（调查墙上的绳子）：两端点之间加中点下垂 */
export const stringPts = (a: [number, number], b: [number, number], sag = 40, n = 24): [number, number][] =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * sag];
  });

/** 红线：在 at 帧开始画，dur 帧画完（12fps 步进） */
export const RedLine: React.FC<{f: number; at: number; dur?: number; points: [number, number][]; width?: number; dot?: boolean; color?: string}> = ({f, at, dur = 15, points, width = 6, dot = true, color = V.red}) =>
  f < at ? null : <HandLine points={points} p={prog12(f, at, dur)} width={width} dot={dot} color={color} />;

/** 一笔画的红圈：首尾不闭合、略交叉，约 1 秒画完 */
export const RedCircle: React.FC<{f: number; at: number; cx: number; cy: number; rx: number; ry: number; dur?: number; seed?: number; width?: number}> = ({f, at, cx, cy, rx, ry, dur = 20, seed = 3, width = 6}) => {
  if (f < at) return null;
  const n = 48;
  const start = -2.2 + rand(seed) * 0.4;
  const pts: [number, number][] = Array.from({length: n + 1}, (_, i) => {
    const a = start + (i / n) * Math.PI * 2.18;
    const wob = 1 + (rand(seed + i * 0.7) - 0.5) * 0.05 + (i / n) * 0.06;
    return [cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob];
  });
  return <HandLine points={pts} p={prog12(f, at, dur)} width={width} dot={false} />;
};

/** 红色下划线，0.5 秒画完 */
export const Underline: React.FC<{f: number; at: number; x: number; y: number; w: number; dur?: number; seed?: number}> = ({f, at, x, y, w, dur = 14, seed = 9}) => {
  if (f < at) return null;
  const pts: [number, number][] = Array.from({length: 9}, (_, i) => [x + (w * i) / 8, y + (rand(seed + i) - 0.5) * 4 + Math.sin(i * 0.7) * 1.5]);
  return <HandLine points={pts} p={prog12(f, at, dur)} width={5} dot={false} />;
};

/** 荧光笔：毛边黄带，multiply 叠在文字上，跟着念词从左往右扫 */
export const Highlight: React.FC<{f: number; at: number; w: number; h: number; dur?: number; children: React.ReactNode}> = ({f, at, w, h, dur = 27, children}) => {
  const p = prog12(f, at, dur);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {p > 0 && (
        <span
          style={{
            position: 'absolute',
            left: -6,
            top: h * 0.12,
            width: (w + 12) * p,
            height: h * 0.82,
            background: V.hi,
            mixBlendMode: 'multiply',
            borderRadius: '6px 10px 8px 12px',
            filter: 'url(#voxRough)',
          }}
        />
      )}
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

/** 打字：13 字/秒，12fps 步进 */
export const TypeOn: React.FC<{f: number; at: number; text: string; cps?: number; cursor?: boolean}> = ({f, at, text, cps = 13, cursor = true}) => {
  if (f < at) return null;
  const n = Math.min(text.length, Math.floor(((step12(f) - at) / 30) * cps));
  return (
    <span>
      {text.slice(0, n)}
      {cursor && n < text.length && <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}}>|</span>}
    </span>
  );
};

/** 倾斜滑入放平（只在沿时间线追踪时用）：0.55 秒、从 12° 放平，12fps 步进 */
export const SlideIn: React.FC<{f: number; at: number; from?: [number, number]; rot?: number; dur?: number; children: React.ReactNode}> = ({f, at, from = [900, 0], rot = 12, dur = 16, children}) => {
  if (f < at) return null;
  const p = prog12(f, at, dur);
  const q = 1 - Math.pow(1 - p, 4);
  return <div style={{transform: `translate(${from[0] * (1 - q)}px, ${from[1] * (1 - q)}px) rotate(${rot * (1 - q)}deg)`}}>{children}</div>;
};

/** 随切点直接出现（Vox 档案照片不弹不落）：at 之前不渲染 */
export const At: React.FC<{f: number; at: number; until?: number; children: React.ReactNode}> = ({f, at, until, children}) => (f < at || (until !== undefined && f >= until) ? null : <>{children}</>);

/** 荧光笔毛边用的全局滤镜，放一次即可 */
export const VoxDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="voxRough">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves={2} seed={4} />
      <feDisplacementMap in="SourceGraphic" scale={6} />
    </filter>
  </svg>
);
