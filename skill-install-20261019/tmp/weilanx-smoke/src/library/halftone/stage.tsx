import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeOut, easeOutBack, rand} from '../anim';
import {H, HF, chunky, misprint, popScale} from './theme';

/**
 * 网点档案风的舞台层：纸面 / 夜色底、渐变网点、印刷颗粒、案卷号和日期章、逐字弹入的大字、字幕条、转场。
 * 全部按 1920×1080 横屏设计；所有动画由帧号 f 算出。
 */

const W = 1920;
const HH = 1080;

/**
 * 渐变网点的 SVG 路径：45° 网格（行距 step/2、隔行错半格），点径按到中心的距离变化。
 * mode 'out'：中心最大、往外消失（一团网点光晕）；'in'：中心空、往外变大（网点暗角）。
 * radius 可以是 [rx, ry] 椭圆；inner 是 'in' 模式下的空心比例；power 越大过渡越陡。
 */
export const halftonePath = (o: {w?: number; h?: number; cx: number; cy: number; radius: number | [number, number]; step?: number; maxR?: number; mode?: 'out' | 'in'; inner?: number; power?: number; scale?: number}) => {
  const {w = W, h = HH, cx, cy, step = 22, mode = 'out', inner = 0.35, power = 1, scale = 1} = o;
  const [rx, ry] = Array.isArray(o.radius) ? o.radius : [o.radius, o.radius];
  const maxR = (o.maxR ?? step * 0.46) * scale;
  let d = '';
  for (let j = 0; j * (step / 2) < h + step; j++) {
    const y = j * (step / 2);
    for (let i = -1; i * step < w + step; i++) {
      const x = i * step + (j % 2) * (step / 2);
      const dist = Math.hypot((x - cx) / rx, (y - cy) / ry);
      let k = mode === 'out' ? 1 - dist : (dist - inner) / (1 - inner);
      k = Math.pow(clamp01(k), power);
      const r = maxR * k;
      if (r < 0.5) continue;
      d += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0`;
    }
  }
  return d;
};

/** 渐变网点层：一团网点光晕（mode 'out'）或网点暗角（'in'）；maxR 默认 0.46×step，设到 0.56×step 时最密处连成实色；f + breathe 让点径轻轻呼吸 */
export const Halftone: React.FC<{
  color: string;
  cx: number;
  cy: number;
  radius: number | [number, number];
  step?: number;
  mode?: 'out' | 'in';
  inner?: number;
  power?: number;
  opacity?: number;
  f?: number;
  breathe?: number;
  maxR?: number;
  w?: number;
  h?: number;
}> = ({color, cx, cy, radius, step = 22, mode = 'out', inner, power, maxR, opacity = 1, f = 0, breathe = 0, w = W, h = HH}) => {
  // 呼吸按 4 帧一档取整，避免每帧都重算几千个点
  const sc = breathe ? 1 + breathe * Math.sin(Math.floor(f / 4) / 6) : 1;
  const key = `${color}|${cx}|${cy}|${radius}|${step}|${mode}|${inner}|${power}|${maxR}|${sc.toFixed(3)}|${w}|${h}`;
  const d = useMemo(() => halftonePath({w, h, cx, cy, radius, step, mode, inner, power, maxR, scale: sc}), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none'}}>
      <path d={d} fill={color} />
    </svg>
  );
};

/** 实心网点填充的 <pattern>：放在 SVG 的 <defs> 里，用 fill="url(#id)" 填进任何形状（大号数字、月亮、桌面） */
export const DotPattern: React.FC<{id: string; color: string; step?: number; r?: number; bg?: string}> = ({id, color, step = 14, r = step * 0.3, bg}) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={step} height={step}>
    {bg && <rect width={step} height={step} fill={bg} />}
    <circle cx={step / 4} cy={step / 4} r={r} fill={color} />
    <circle cx={(step * 3) / 4} cy={(step * 3) / 4} r={r} fill={color} />
  </pattern>
);

/** 纸面底：米白旧纸 + 中间一条竖向折痕 + 四角压暗 + 低频纸纹 */
export const PaperBg: React.FC<{color?: string; fold?: boolean}> = ({color = H.paper, fold = true}) => (
  <AbsoluteFill style={{background: color}}>
    <svg width={W} height={HH} style={{position: 'absolute', opacity: 0.5}}>
      <filter id="ht-fiber">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="3" seed="4" />
        <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.35 -0.08" />
      </filter>
      <rect width={W} height={HH} filter="url(#ht-fiber)" />
    </svg>
    {fold && (
      <>
        <div style={{position: 'absolute', left: W / 2 - 14, top: 0, width: 14, height: HH, background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(90,80,60,0.07))'}} />
        <div style={{position: 'absolute', left: W / 2, top: 0, width: 2, height: HH, background: 'rgba(255,255,255,0.55)'}} />
        <div style={{position: 'absolute', left: W / 2 + 2, top: 0, width: 10, height: HH, background: 'linear-gradient(90deg, rgba(90,80,60,0.06), rgba(0,0,0,0))'}} />
      </>
    )}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(70,55,30,0.22) 100%)'}} />
  </AbsoluteFill>
);

/** 夜色底：藏青渐变 + 闪烁的小星点；网点暗角另外叠 <Halftone mode="in">。starsOnly 只画星点（叠在别的底色上） */
export const NightBg: React.FC<{f: number; color?: string; stars?: number; seed?: number; starsOnly?: boolean}> = ({f, color = H.night, stars = 90, seed = 3, starsOnly}) => (
  <AbsoluteFill style={{background: starsOnly ? undefined : `radial-gradient(ellipse 75% 70% at 50% 45%, ${color} 0%, ${H.nightDeep} 100%)`}}>
    <svg width={W} height={HH} style={{position: 'absolute'}}>
      {Array.from({length: stars}, (_, i) => {
        const s = seed * 1000 + i;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (18 + rand(s + 3) * 30) + i));
        return <circle key={i} cx={rand(s) * W} cy={rand(s + 1) * HH} r={0.9 + rand(s + 2) * 1.8} fill="#fff" opacity={0.75 * tw} />;
      })}
    </svg>
  </AbsoluteFill>
);

/**
 * 印刷颗粒：亮点 + 暗点两层稀疏噪点，压在所有画面最上层，让色块和描边边缘「毛」起来。
 * seed 每 3 帧换一次，颗粒会轻微跳动（像胶印的不稳定）；still 传 true 关掉跳动。
 */
export const PrintGrain: React.FC<{f: number; opacity?: number; still?: boolean}> = ({f, opacity = 1, still}) => {
  const seed = still ? 1 : Math.floor(f / 3) % 7;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width={W} height={HH}>
        <filter id={`ht-grain-l${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed={seed} />
          <feColorMatrix values={`0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.88  5 0 0 0 -3.15`} />
        </filter>
        <filter id={`ht-grain-d${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed={seed + 11} />
          <feColorMatrix values={`0 0 0 0 0.12  0 0 0 0 0.12  0 0 0 0 0.2  5 0 0 0 -3.25`} />
        </filter>
        <rect width={W} height={HH} filter={`url(#ht-grain-l${seed})`} opacity={0.55} />
        <rect width={W} height={HH} filter={`url(#ht-grain-d${seed})`} opacity={0.35} />
      </svg>
    </AbsoluteFill>
  );
};

/** 弹入容器：在 at 帧从 from 倍弹出，out 帧缩回去；x/y 是左上角（或用 style 自己定位） */
export const Pop: React.FC<{f: number; at: number; out?: number; dur?: number; from?: number; x?: number; y?: number; rot?: number; origin?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({
  f,
  at,
  out,
  dur = 7,
  from = 0.3,
  x,
  y,
  rot = 0,
  origin = 'center',
  style,
  children,
}) => {
  if (f < at) return null;
  const {s, o} = popScale(f, at, dur, from);
  const k = out === undefined ? 1 : 1 - easeIn(clamp01((f - out) / 5));
  if (k <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s * k})`, transformOrigin: origin, opacity: o, ...style}}>{children}</div>;
};

/** 左上案卷号：等宽小字「案卷 No.xxx」+ 一枚深色标签（第一个词黄 / 粉，第二个词白）；dark 用于深底（标签变纸色） */
export const CaseHeader: React.FC<{f: number; at: number; no: string; tag: [string, string]; accent?: 'yellow' | 'pink'; dark?: boolean; x?: number; y?: number}> = ({f, at, no, tag, accent = 'yellow', dark, x = 60, y = 46}) => {
  const {s} = popScale(f, at, 6, 0.6);
  const accentColor = accent === 'yellow' ? (dark ? H.orangeDeep : H.yellow) : dark ? H.red : H.pink;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{fontFamily: HF.mono, fontWeight: 700, fontSize: 21, color: dark ? H.paper : H.ink, letterSpacing: 0.5}}>
        <span style={{fontFamily: HF.sans}}>案卷</span> {no}
      </div>
      <div
        style={{
          marginTop: 8,
          display: 'inline-flex',
          gap: 10,
          padding: '4px 12px 5px',
          borderRadius: 4,
          background: dark ? H.paper : H.ink,
          fontFamily: HF.sans,
          fontSize: 22,
          transform: `scale(${s})`,
          transformOrigin: 'left center',
          boxShadow: dark ? `3px 3px 0 ${H.nightDeep}` : undefined,
        }}
      >
        <span style={{color: accentColor}}>{tag[0]}</span>
        <span style={{color: dark ? H.ink : H.paperLight}}>{tag[1]}</span>
      </div>
    </div>
  );
};

/** 右上日期章：描边圆角框 + 闪烁红点 + 等宽日期 */
export const DateChip: React.FC<{f: number; text: string; dark?: boolean; x?: number; y?: number}> = ({f, text, dark, x = 1860, y = 46}) => {
  const c = dark ? H.paper : H.ink;
  const on = Math.floor(f / 20) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        right: W - x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 14px',
        border: `3px solid ${c}`,
        borderRadius: 10,
        fontFamily: HF.mono,
        fontWeight: 700,
        fontSize: 26,
        color: c,
      }}
    >
      <div style={{width: 13, height: 13, borderRadius: 7, background: H.red, opacity: on ? 1 : 0.25}} />
      {text}
    </div>
  );
};

/**
 * 粗宋大字，逐字弹入（每字从 0.3 倍弹到 1，间隔 per 帧）。
 * shadow 是错版投影的颜色（纸面粉红 / 黄，夜色藏青），d 是偏移；out 帧整行缩回。
 */
export const Headline: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; shadow?: string; d?: number; per?: number; out?: number; align?: 'left' | 'center'; weight?: number}> = ({
  f,
  at,
  text,
  x,
  y,
  size = 120,
  color = H.ink,
  shadow = H.pink,
  d,
  per = 3,
  out,
  align = 'left',
  weight = 900,
}) => {
  const k = out === undefined ? 1 : 1 - easeIn(clamp01((f - out) / 5));
  if (f < at || k <= 0) return null;
  const off = d ?? Math.max(3, Math.round(size / 18));
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? x - 2000 : x,
        width: align === 'center' ? 4000 : undefined,
        textAlign: align,
        top: y,
        fontFamily: HF.serif,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.1,
        color,
        whiteSpace: 'nowrap',
        transform: `scale(${k})`,
      }}
    >
      {[...text].map((ch, i) => {
        const {s, o} = popScale(f, at + i * per, 5, 0.3);
        return (
          <span key={i} style={{display: 'inline-block', transform: `scale(${s})`, transformOrigin: '50% 80%', opacity: o, textShadow: shadow === 'none' ? undefined : misprint(shadow, off)}}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </div>
  );
};

/** 字幕里的重点词：【词】黄色，〖词〗粉色 */
const marks = (text: string, yellow: string, pink: string) =>
  text.split(/(【[^】]*】|〖[^〗]*〗)/).map((seg, i) => {
    if (seg.startsWith('【')) return <span key={i} style={{color: yellow, margin: '0 0.22em'}}>{seg.slice(1, -1)}</span>;
    if (seg.startsWith('〖')) return <span key={i} style={{color: pink}}>{seg.slice(1, -1)}</span>;
    return <span key={i}>{seg}</span>;
  });

/** 底部字幕条：藏青圆角条 + 错版投影（纸面粉红、夜色深藏青），从 0.6 倍弹入；【】黄、〖〗粉 */
export const CaptionBar: React.FC<{f: number; at: number; text: string; out?: number; y?: number; dark?: boolean; size?: number}> = ({f, at, text, out, y = 975, dark, size = 38}) => {
  if (f < at) return null;
  const {s, o} = popScale(f, at, 6, 0.6);
  const k = out === undefined ? 1 : 1 - easeIn(clamp01((f - out) / 5));
  if (k <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top: y, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          transform: `translateY(-50%) scale(${s * k})`,
          opacity: o,
          padding: '12px 30px 14px',
          borderRadius: 10,
          background: H.ink,
          color: H.paperLight,
          fontFamily: HF.sans,
          fontSize: size,
          letterSpacing: 1,
          boxShadow: `7px 7px 0 ${dark ? H.nightDeep : H.pink}`,
          border: dark ? `2px solid rgba(236,229,211,0.12)` : undefined,
        }}
      >
        {marks(text, H.yellow, H.pink)}
      </div>
    </div>
  );
};

/** 片头字母落下：圆胖西文逐个从上方砸下来（带回弹和一点歪），深色错版投影 */
export const DropLetters: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; shadow?: string; per?: number; dur?: number; tilt?: number}> = ({
  f,
  at,
  text,
  x,
  y,
  size = 260,
  color = H.paper,
  shadow = H.ink,
  per = 5,
  dur = 9,
  tilt = 8,
}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: HF.round, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap', ...chunky(color, size / 22)}}>
    {[...text].map((ch, i) => {
      const t0 = at + i * per;
      if (f < t0) return <span key={i} style={{display: 'inline-block', visibility: 'hidden'}}>{ch}</span>;
      const p = clamp01((f - t0) / dur);
      const e = easeOutBack(p);
      const r = (1 - easeOut(p)) * (i % 2 ? tilt : -tilt) * 2 + (i % 2 ? 1.5 : -1.5);
      return (
        <span key={i} style={{display: 'inline-block', transform: `translateY(${-700 * (1 - e)}px) rotate(${r}deg)`, textShadow: misprint(shadow, size / 26)}}>
          {ch}
        </span>
      );
    })}
  </div>
);

type Corner = 'tl' | 'tr' | 'bl' | 'br';
const CORNER: Record<Corner, [number, number]> = {tl: [0, 0], tr: [W, 0], bl: [0, HH], br: [W, HH]};

/**
 * 网点淹没转场：圆点从 from 角长大铺满（cover 帧），停 hold 帧，再沿同方向缩小露出下一场（reveal 帧）。
 * 场景切换放在铺满的那几帧里：cut = at + cover + hold / 2。
 */
export const DotWipe: React.FC<{f: number; at: number; color: string; from?: Corner; cover?: number; hold?: number; reveal?: number; step?: number}> = ({f, at, color, from = 'tl', cover = 6, hold = 2, reveal = 6, step = 64}) => {
  const t = f - at;
  if (t < 0 || t >= cover + hold + reveal) return null;
  const [ox, oy] = CORNER[from];
  const diag = Math.hypot(W, HH);
  const sp = 0.55;
  const maxR = step * 0.56;
  let k: (dist: number) => number;
  if (t < cover) {
    const p = easeIn(clamp01((t + 1) / cover));
    k = (dist) => clamp01((p * (1 + sp) - dist) / sp);
  } else if (t < cover + hold) {
    k = () => 1;
  } else {
    const q = easeOut(clamp01((t - cover - hold + 1) / reveal));
    k = (dist) => 1 - clamp01((q * (1 + sp) - dist) / sp);
  }
  let d = '';
  for (let j = 0; j * (step / 2) < HH + step; j++) {
    const y = j * (step / 2);
    for (let i = -1; i * step < W + step; i++) {
      const x = i * step + (j % 2) * (step / 2);
      const r = maxR * k(Math.hypot(x - ox, y - oy) / diag);
      if (r < 0.5) continue;
      d += `M${(x - r).toFixed(1)} ${y}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0`;
    }
  }
  return (
    <svg width={W} height={HH} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <path d={d} fill={color} />
    </svg>
  );
};

/** 白闪：相机快门，at 帧全白，len 帧内退掉 */
export const Flash: React.FC<{f: number; at: number; len?: number; max?: number}> = ({f, at, len = 5, max = 0.85}) => {
  const t = f - at;
  if (t < 0 || t > len) return null;
  return <AbsoluteFill style={{background: '#fffdf6', opacity: max * (1 - t / len), pointerEvents: 'none'}} />;
};

/** 放射线：从 (cx, cy) 向外的细线，at 帧弹出、缓慢转动（宣判、高光时刻垫在后面） */
export const Rays: React.FC<{f: number; at: number; cx?: number; cy?: number; n?: number; color?: string; r0?: number; r1?: number; width?: number}> = ({f, at, cx = W / 2, cy = HH / 2, n = 28, color = 'rgba(236,229,211,0.18)', r0 = 160, r1 = 1300, width = 3}) => {
  if (f < at) return null;
  const p = easeOut(clamp01((f - at) / 10));
  const rot = (f - at) * 0.08;
  return (
    <svg width={W} height={HH} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const a = ((i / n) * 360 + rot + rand(i) * 4) * (Math.PI / 180);
        const ra = r0 * p;
        const rb = r0 + (r1 - r0) * p;
        return <line key={i} x1={cx + Math.cos(a) * ra} y1={cy + Math.sin(a) * ra} x2={cx + Math.cos(a) * rb} y2={cy + Math.sin(a) * rb} stroke={color} strokeWidth={width} />;
      })}
    </svg>
  );
};

/** 彩纸：从 (cx, cy) 炸开的小纸片，先往上散开再受重力落下、翻转 */
export const Confetti: React.FC<{f: number; at: number; cx?: number; cy?: number; n?: number; colors?: string[]; spread?: number; seed?: number}> = ({
  f,
  at,
  cx = W / 2,
  cy = HH / 2,
  n = 70,
  colors = [H.yellow, H.pink, H.blue, H.paperLight, '#3fb59b'],
  spread = 900,
  seed = 5,
}) => {
  const t = f - at;
  if (t < 0 || t > 150) return null;
  return (
    <svg width={W} height={HH} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const s = seed * 100 + i;
        const a = -Math.PI / 2 + (rand(s) - 0.5) * Math.PI * 1.3;
        const v = (0.35 + rand(s + 1) * 0.65) * spread;
        const drag = 1 - Math.exp(-t / 9);
        const x = cx + Math.cos(a) * v * drag + Math.sin(t / 7 + i) * 8;
        const y = cy + Math.sin(a) * v * drag * 0.7 + t * t * 0.03;
        const flip = Math.abs(Math.cos(t / (4 + rand(s + 2) * 4) + i));
        return (
          <rect
            key={i}
            x={-7}
            y={-3}
            width={14}
            height={6 * (0.3 + flip)}
            fill={colors[i % colors.length]}
            opacity={clamp01((150 - t) / 30)}
            transform={`translate(${x} ${y}) rotate(${rand(s + 3) * 360 + t * (rand(s + 4) * 14 - 7)})`}
          />
        );
      })}
    </svg>
  );
};
