import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, rand} from '../anim';
import {G, GF, goldText, goldTextLight, soft} from './theme';

/**
 * 暗金文献风的舞台层：底色、光晕、浮尘、颗粒、年份抬头、文献引用、字幕、标题卡、引文。
 * 全部按 1920×1080 横屏设计；所有动画由帧号 f 算出。
 */

/** 背景：近黑底 + 一团暖（或冷）光晕 + 暗角。glow 控制光晕位置，tone 选暖/冷 */
export const GildedBg: React.FC<{f: number; tone?: 'warm' | 'cool'; glow?: [number, number]; strength?: number}> = ({f, tone = 'warm', glow = [50, 46], strength = 1}) => {
  const c = tone === 'warm' ? 'rgba(120,78,34,' : 'rgba(40,62,104,';
  const breathe = 0.9 + 0.1 * Math.sin(f / 50);
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 62% 58% at ${glow[0]}% ${glow[1]}%, ${c}${0.34 * strength * breathe}) 0%, ${c}${0.1 * strength}) 45%, rgba(0,0,0,0) 75%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 浮尘：几十颗缓慢漂移、忽明忽暗的金色光点，和偶尔几颗失焦的大光斑 */
export const Dust: React.FC<{f: number; n?: number; w?: number; h?: number; seed?: number}> = ({f, n = 46, w = 1920, h = 1080, seed = 7}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width={w} height={h} style={{position: 'absolute'}}>
      <defs>
        <filter id="gd-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {Array.from({length: n}, (_, i) => {
        const s = seed * 100 + i;
        const big = rand(s + 0.5) > 0.86;
        const x = (rand(s) * w + f * (rand(s + 1) - 0.5) * 0.35 + w) % w;
        const y = (rand(s + 2) * h - f * (0.08 + rand(s + 3) * 0.18) + h * 4) % h;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (40 + rand(s + 4) * 60) + i));
        const r = big ? 5 + rand(s + 5) * 7 : 0.8 + rand(s + 5) * 1.4;
        return <circle key={i} cx={x} cy={y} r={r} fill={G.goldBright} opacity={(big ? 0.1 : 0.55) * tw} filter={big ? 'url(#gd-blur)' : undefined} />;
      })}
    </svg>
  </AbsoluteFill>
);

/** 胶片颗粒：静态噪点叠在最上层，压掉数字画面的「干净感」 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.14}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity}}>
    <svg width="100%" height="100%">
      <filter id="gd-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gd-grain)" />
    </svg>
  </AbsoluteFill>
);

/** 一位数字的老虎机滚动：从 a 滚到 b（向上翻），p 为 0–1 进度 */
const RollDigit: React.FC<{a: string; b: string; p: number; size: number}> = ({a, b, p, size}) => {
  if (a === b || p >= 1) return <span style={{display: 'inline-block'}}>{b}</span>;
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return (
    <span style={{display: 'inline-block', position: 'relative', height: size * 1.05, overflow: 'hidden', verticalAlign: 'bottom'}}>
      <span style={{display: 'block', transform: `translateY(${-e * size * 1.05}px)`, filter: `blur(${Math.sin(e * Math.PI) * 3}px)`}}>
        <span style={{display: 'block', height: size * 1.05}}>{a}</span>
        <span style={{display: 'block', height: size * 1.05}}>{b}</span>
      </span>
    </span>
  );
};

/**
 * 左上角年份抬头：金色衬线大年份 + 一条渐隐金线 + 「地点 · 人物」。
 * 换年份时传 prev 和 rollAt，各位数字依次像老虎机一样翻上去；prefix 可写「约」。
 */
export const YearHeader: React.FC<{f: number; at: number; year: string; caption: string; prev?: string; rollAt?: number; prefix?: string; out?: number; x?: number; y?: number}> = ({
  f,
  at,
  year,
  caption,
  prev,
  rollAt,
  prefix,
  out,
  x = 56,
  y = 34,
}) => {
  const s = soft(f, at, 20, out);
  const size = 64;
  const from = (prev ?? year).padStart(year.length, ' ');
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: s.opacity, filter: s.filter}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 6, fontFamily: GF.num, fontSize: size, lineHeight: 1.05, letterSpacing: 4, ...goldText(0.4)}}>
        {prefix ? <span style={{fontFamily: GF.cn, fontSize: 22, marginBottom: 10, letterSpacing: 0}}>{prefix}</span> : null}
        {year.split('').map((d, i) => (
          <RollDigit key={i} a={from[i] ?? d} b={d} size={size} p={rollAt === undefined ? 1 : clamp01((f - rollAt - i * 3) / 14)} />
        ))}
      </div>
      <div style={{width: 340, height: 1, marginTop: 6, background: `linear-gradient(90deg, ${G.gold} 0%, rgba(214,180,106,0.35) 60%, rgba(214,180,106,0) 100%)`}} />
      <div style={{fontFamily: GF.cn, fontSize: 22, color: G.ivoryDim, marginTop: 12, letterSpacing: 2}}>{caption}</div>
    </div>
  );
};

/** 朱红小方印：两到四个字竖排两列，盖在文献引用旁边 */
export const SealMark: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 30, color = G.sealRed}) => {
  const chars = text.split('');
  const cols = chars.length > 2 ? [chars.slice(0, Math.ceil(chars.length / 2)), chars.slice(Math.ceil(chars.length / 2))] : [chars];
  return (
    <div style={{width: size, height: size, background: color, borderRadius: 3, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 1, boxShadow: 'inset 0 0 0 2px rgba(255,220,200,0.25)'}}>
      {cols.map((c, i) => (
        <div key={i} style={{display: 'flex', flexDirection: 'column', fontFamily: GF.cn, fontWeight: 700, fontSize: size / (cols.length > 1 ? 2.6 : 2), lineHeight: 1, color: '#f6dccb'}}>
          {c.map((ch, j) => (
            <span key={j}>{ch}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 右上角文献引用：原文书名（斜体）+ 中文书名（金色书名号）+ 作者 · 年份，右侧一枚小印，下面一条金线。
 */
export const BookCite: React.FC<{f: number; at: number; original: string; title: string; meta: string; seal?: string; out?: number; x?: number; y?: number}> = ({f, at, original, title, meta, seal = '文献', out, x = 56, y = 34}) => {
  const s = soft(f, at + 6, 22, out);
  return (
    <div style={{position: 'absolute', right: x, top: y, opacity: s.opacity, filter: s.filter, display: 'flex', gap: 14, alignItems: 'flex-start'}}>
      <div style={{textAlign: 'right', maxWidth: 560}}>
        <div style={{fontFamily: GF.latinItalic, fontSize: 19, color: G.ivoryDim, lineHeight: 1.25}}>{original}</div>
        <div style={{fontFamily: GF.cn, fontSize: 25, fontWeight: 700, color: G.gold, marginTop: 6}}>《{title}》</div>
        <div style={{fontFamily: GF.cn, fontSize: 16, color: G.ivoryFaint, marginTop: 6, letterSpacing: 1}}>{meta}</div>
        <div style={{height: 1, marginTop: 8, background: `linear-gradient(270deg, ${G.goldLine}, rgba(214,180,106,0))`}} />
      </div>
      <SealMark text={seal} />
    </div>
  );
};

/**
 * 字幕：宋体粗、象牙白，`【词】` 包住的词变金色；逐字柔入（模糊 + 透明 + 轻微上浮）。
 * en 给一行英文斜体翻译（中文出完后再淡入）。
 * 例：text="真正的问题是【怎么算】。"
 */
export const GCaption: React.FC<{f: number; at: number; text: string; en?: string; out?: number; y?: number; size?: number; perChar?: number}> = ({f, at, text, en, out, y = 960, size = 42, perChar = 1.2}) => {
  const parts: {ch: string; hi: boolean}[] = [];
  let hi = false;
  for (const ch of text) {
    if (ch === '【') hi = true;
    else if (ch === '】') hi = false;
    else parts.push({ch, hi});
  }
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size, textAlign: 'center', fontFamily: GF.cn, fontWeight: 700, fontSize: size, letterSpacing: 2, opacity: o, textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
      {parts.map((p, i) => {
        const v = clamp01((f - at - i * perChar) / 10);
        return (
          <span key={i} style={{display: 'inline-block', opacity: v, filter: `blur(${(1 - v) * 6}px)`, transform: `translateY(${(1 - v) * 6}px)`, ...(p.hi ? goldTextLight() : {color: G.ivory})}}>
            {p.ch}
          </span>
        );
      })}
      {en ? (
        <div style={{fontFamily: GF.latinItalic, fontWeight: 400, fontSize: size * 0.6, letterSpacing: 0.5, color: G.ivoryDim, marginTop: 8, opacity: clamp01((f - at - parts.length * perChar) / 14)}}>{en}</div>
      ) : null}
    </div>
  );
};

/** 片头 / 片尾标题卡：拉丁文小标 + 金色渐变大标题 + 放射光芒 + 金粉，可选一条钟形曲线作下划线 */
export const TitleCard: React.FC<{f: number; at: number; latin: string; title: string; sub?: string; curve?: boolean; out?: number}> = ({f, at, latin, title, sub, curve, out}) => {
  const t = f - at;
  const sLatin = soft(f, at, 24, out);
  const sTitle = soft(f, at + 10, 30, out);
  const sSub = soft(f, at + 40, 24, out);
  const rays = clamp01(t / 50) * (out === undefined ? 1 : 1 - clamp01((f - out) / 14));
  const draw = clamp01((t - 30) / 40);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: rays * 0.55}}>
        <defs>
          <radialGradient id="gd-rays" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={G.goldBright} stopOpacity={0.55} />
            <stop offset="1" stopColor={G.goldBright} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(960 500) rotate(${t * 0.04})`}>
          {Array.from({length: 48}, (_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const len = 260 + rand(i + 3) * 260;
            return <line key={i} x1={0} y1={0} x2={Math.cos(a) * len} y2={Math.sin(a) * len} stroke="url(#gd-rays)" strokeWidth={i % 3 === 0 ? 1.4 : 0.7} />;
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: GF.latin, fontSize: 24, letterSpacing: 14, color: G.ivoryDim, opacity: sLatin.opacity, filter: sLatin.filter}}>{latin.toUpperCase()}</div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 380,
          textAlign: 'center',
          fontFamily: GF.cn,
          fontWeight: 900,
          fontSize: 132,
          letterSpacing: 18,
          opacity: sTitle.opacity,
          filter: sTitle.filter,
          transform: `scale(${1.04 - 0.04 * sTitle.v})`,
        }}
      >
        <span style={goldText(1)}>{title}</span>
      </div>
      {curve ? (
        <svg width={1920} height={1080} style={{position: 'absolute', opacity: sSub.opacity}}>
          <path d={bellPath(560, 1360, 650, 70, 70)} fill="none" stroke={G.gold} strokeWidth={2} pathLength={1} strokeDasharray={`${draw} 1`} style={{filter: `drop-shadow(0 0 6px ${G.gold})`}} />
          <line x1={560} y1={651} x2={1360} y2={651} stroke={G.goldLine} strokeWidth={1} />
        </svg>
      ) : null}
      {sub ? <div style={{position: 'absolute', left: 0, right: 0, top: curve ? 690 : 600, textAlign: 'center', fontFamily: GF.cn, fontSize: 32, letterSpacing: 12, color: G.ivory, opacity: sSub.opacity, filter: sSub.filter}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/** 钟形曲线路径（x0→x1，基线 base，高 h，sigma 按宽度的比例） */
export const bellPath = (x0: number, x1: number, base: number, h: number, steps = 80, sigma = 0.16) => {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const g = Math.exp(-Math.pow(u - 0.5, 2) / (2 * sigma * sigma));
    pts.push(`${i === 0 ? 'M' : 'L'}${(x0 + (x1 - x0) * u).toFixed(1)} ${(base - g * h).toFixed(1)}`);
  }
  return pts.join(' ');
};

/** 引文：上方原文（斜体小字），中间中文大引文（可用【】标金），下方「—— 出处」 */
export const GQuote: React.FC<{f: number; at: number; original?: string; text: string; source: string; x?: number; y?: number; w?: number; align?: 'left' | 'center'; out?: number}> = ({
  f,
  at,
  original,
  text,
  source,
  x = 960,
  y = 380,
  w = 1100,
  align = 'center',
  out,
}) => {
  const a = soft(f, at, 22, out);
  const b = soft(f, at + 14, 26, out);
  const c = soft(f, at + 40, 22, out);
  const lines = text.split('\n');
  const left = align === 'center' ? x - w / 2 : x;
  return (
    <div style={{position: 'absolute', left, top: y, width: w, textAlign: align}}>
      {original ? <div style={{fontFamily: GF.latinItalic, fontSize: 21, color: G.ivoryDim, opacity: a.opacity, filter: a.filter, marginBottom: 26}}>« {original} »</div> : null}
      <div style={{fontFamily: GF.cn, fontWeight: 700, fontSize: 50, lineHeight: 1.45, color: G.ivory, opacity: b.opacity, filter: b.filter}}>
        {lines.map((l, i) => (
          <div key={i}>
            {l.split(/(【[^】]+】)/).map((seg, j) =>
              seg.startsWith('【') ? (
                <span key={j} style={goldTextLight()}>
                  {seg.slice(1, -1)}
                </span>
              ) : (
                <span key={j}>{seg}</span>
              ),
            )}
          </div>
        ))}
      </div>
      <div style={{fontFamily: GF.cn, fontSize: 20, color: G.ivoryFaint, marginTop: 26, letterSpacing: 2, opacity: c.opacity, filter: c.filter}}>—— {source}</div>
    </div>
  );
};

/** 柔入容器：包住任意内容，at 出场、out 退场，带模糊 */
export const Soft: React.FC<{f: number; at: number; out?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({f, at, out, dur = 18, style, children}) => {
  const s = soft(f, at, dur, out);
  if (s.v <= 0) return null;
  return <div style={{position: 'absolute', ...style, opacity: s.opacity, filter: s.filter}}>{children}</div>;
};

/**
 * 爆点大字（ep23、ep24 用过，ep32 起挪进素材库）：at 帧光晕骤亮、金字从 1.12 倍在 8 帧内收到 1 倍并轻轻呼吸，
 * 一圈光环从字背后扩到 ring 半径再淡出；sub 在 0.6 秒后柔入（「术语 · English」）。size 字号、flash 光晕强度、y 字的中心高度。
 */
export const Smash: React.FC<{f: number; at: number; text: string; size: number; sub?: string; ring?: number; flash?: number; y?: number; latin?: boolean}> = ({f, at, text, size, sub, ring = 1300, flash = 1, y = 450, latin}) => {
  const t = f - at;
  if (t < 0) return null;
  const s = 1.12 - 0.12 * clamp01(t / 8) + 0.008 * Math.sin(t / 14);
  const r0 = size * 1.6;
  const r = r0 + (ring - r0) * (1 - Math.pow(1 - clamp01(t / 40), 3));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 55% at 50% ${(y / 1080) * 100}%, rgba(255,226,160,${0.55 * flash}) 0%, rgba(214,160,80,${0.18 * flash}) 40%, rgba(0,0,0,0) 75%)`, opacity: 1 - clamp01(t / 26) * 0.75}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={960} cy={y} r={r} fill="none" stroke={G.goldBright} strokeWidth={3 - 2 * clamp01(t / 40)} opacity={(1 - clamp01(t / 40)) * 0.8} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
        <circle cx={960} cy={y} r={r * 0.72} fill="none" stroke={G.gold} strokeWidth={1} opacity={(1 - clamp01(t / 34)) * 0.5} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.62, textAlign: 'center', transform: `scale(${s})`}}>
        <span style={{fontFamily: latin ? GF.num : GF.cn, fontWeight: latin ? 600 : 900, fontSize: size, letterSpacing: latin ? 2 : size * 0.14, ...goldText(1.2)}}>{text}</span>
      </div>
      {sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 0.55, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((t - 18) / 14), filter: `blur(${(1 - clamp01((t - 18) / 14)) * 6}px)`}}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
