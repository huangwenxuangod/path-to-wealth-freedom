import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, rand} from '../anim';
import {B, BF, blurIn, glowText} from './theme';

/**
 * 黑金光影风的舞台层：烟雾底、颗粒、双语字幕、左上章节签、顶部引用行、居中发光大字、金粒子聚成的标题卡、漂浮公式。
 * 全部按 1920×1080 横屏设计；所有动画由帧号 f 算出。
 */

/**
 * 烟雾底：近黑 + 几团缓慢漂移、呼吸的暖褐（或暗红）烟雾 + 暗角。
 * tone 'warm' 暖烟（默认）/ 'red' 警报红烟；focus 烟雾最浓的位置（百分比）；strength 浓度。
 */
export const SmokeBg: React.FC<{f: number; tone?: 'warm' | 'red'; focus?: [number, number]; strength?: number}> = ({f, tone = 'warm', focus = [30, 78], strength = 1}) => {
  const c = tone === 'red' ? B.smokeRed : B.smoke;
  const blobs = [
    {x: focus[0], y: focus[1], rx: 55, ry: 45, a: 0.34, sp: 0.6},
    {x: 100 - focus[0], y: focus[1] - 10, rx: 45, ry: 38, a: 0.2, sp: 0.45},
    {x: 50, y: 25, rx: 60, ry: 30, a: 0.1, sp: 0.3},
  ];
  return (
    <AbsoluteFill style={{background: tone === 'red' ? '#0a0302' : B.bg}}>
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(f / (90 + i * 30) + i) * 6 * b.sp;
        const y = b.y + Math.cos(f / (110 + i * 25) + i * 2) * 4 * b.sp;
        const a = b.a * strength * (0.85 + 0.15 * Math.sin(f / 45 + i));
        return <AbsoluteFill key={i} style={{background: `radial-gradient(ellipse ${b.rx}% ${b.ry}% at ${x}% ${y}%, ${c}${a}) 0%, ${c}${a * 0.35}) 45%, rgba(0,0,0,0) 75%)`}} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 胶片颗粒：静态噪点，叠在最上层 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.1}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity}}>
    <svg width="100%" height="100%">
      <filter id="bg-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#bg-grain)" />
    </svg>
  </AbsoluteFill>
);

/** 把「普通【青】〖红〗〔金〕」拆成带颜色的段 */
const segs = (s: string) => {
  const out: {t: string; c?: string}[] = [];
  const map: Record<string, [string, string]> = {'【': ['】', B.cyan], '〖': ['〗', B.red], '〔': ['〕', B.gold]};
  let buf = '';
  for (let i = 0; i < s.length; i++) {
    const m = map[s[i]];
    if (m) {
      const e = s.indexOf(m[0], i + 1);
      if (e > i) {
        if (buf) out.push({t: buf});
        buf = '';
        out.push({t: s.slice(i + 1, e), c: m[1]});
        i = e;
        continue;
      }
    }
    buf += s[i];
  }
  if (buf) out.push({t: buf});
  return out;
};

/**
 * 底部双语字幕：中文宋体 Black 米白微发光（【】青、〖〗红、〔〕金），下面一行英文斜体灰；
 * at 起 14 帧模糊柔入，dimAt 起淡到 25%（换句前），out 起淡出。y 中文基线附近。
 */
export const BGCaption: React.FC<{f: number; at: number; text: string; en?: string; out?: number; dimAt?: number; y?: number; size?: number}> = ({f, at, text, en, out, dimAt, y = 930, size = 60}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const dim = dimAt === undefined ? 1 : 1 - 0.75 * clamp01((f - dimAt) / 10);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size, textAlign: 'center', opacity: a.opacity * dim, filter: a.filter}}>
      <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: size, letterSpacing: 2, ...glowText(B.ink, 10, 0.5)}}>
        {segs(text).map((s, i) => (
          <span key={i} style={s.c ? glowText(s.c, 14) : undefined}>
            {s.t}
          </span>
        ))}
      </div>
      {en && <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: size * 0.56, color: B.inkDim, marginTop: 6}}>{en}</div>}
    </div>
  );
};

/** 左上章节签：小号中文章节名 + 一行宽字距英文 */
export const ChapterTag: React.FC<{f: number; at: number; cn: string; en: string; out?: number}> = ({f, at, cn, en, out}) => {
  const a = blurIn(f, at, 16, out);
  return (
    <div style={{position: 'absolute', left: 60, top: 44, opacity: a.opacity, filter: a.filter}}>
      <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 30, ...glowText(B.goldWarm, 10, 0.6)}}>{cn}</div>
      <div style={{fontFamily: BF.latin, fontSize: 16, letterSpacing: '0.35em', color: B.inkFaint, marginTop: 4}}>{en.toUpperCase()}</div>
    </div>
  );
};

/** 顶部居中引用行：宽字距大写灰金小字（年份 · 人名 · 机构），line2 更小的一行 */
export const CiteLine: React.FC<{f: number; at: number; line1: string; line2?: string; y?: number; out?: number}> = ({f, at, line1, line2, y = 120, out}) => {
  const a = blurIn(f, at, 16, out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: a.opacity, filter: a.filter}}>
      <div style={{fontFamily: BF.latin, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(229,201,145,0.62)'}}>{line1.toUpperCase()}</div>
      {line2 && <div style={{fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.3em', color: 'rgba(229,201,145,0.42)', marginTop: 8}}>{line2.toUpperCase()}</div>}
    </div>
  );
};

/** 居中发光大字：一句话压在画面中央，白色强发光，模糊柔入；color 换成青 / 红 / 金，y 中心高度 */
export const CenterWord: React.FC<{f: number; at: number; text: string; size?: number; color?: string; y?: number; out?: number}> = ({f, at, text, size = 90, color = B.ink, y = 520, out}) => {
  const a = blurIn(f, at, 18, out);
  if (a.v <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.6, textAlign: 'center', opacity: a.opacity, filter: a.filter, transform: `scale(${1.04 - 0.04 * a.v})`}}>
      <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: size, letterSpacing: size * 0.06, ...glowText(color, 26)}}>{text}</span>
    </div>
  );
};

/**
 * 金粒子聚成的标题卡：at 起几百颗金色光点从四周旋进来、聚到标题处，同时标题由模糊金字浮出；
 * 之后英文宽字距标题、副标题依次出现。title 中文大标题、en 英文、sub 副标题（会加「— —」）；instant 标题在重拍帧直接亮出（爆点用）。
 */
export const SparkTitle: React.FC<{f: number; at: number; title: string; en?: string; sub?: string; y?: number; size?: number; out?: number; instant?: boolean}> = ({f, at, title, en, sub, y = 440, size = 190, out, instant}) => {
  const t = f - at;
  if (t < 0) return null;
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 14);
  const conv = clamp01(t / 16);
  const e = 1 - Math.pow(1 - conv, 3);
  const w = size * Array.from(title).length * 1.05;
  // instant：重拍上用，标题第 2 帧就亮到 75%，粒子照样聚过来
  const tv = instant ? 0.6 + 0.4 * clamp01(t / 12) : clamp01((t - 8) / 14);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 48% 38% at ${52 + Math.sin(t / 60) * 3}% ${(y / 1080) * 100 + 4}%, rgba(170,120,50,${0.42 * tv}) 0%, rgba(110,74,30,${0.22 * tv}) 45%, rgba(0,0,0,0) 75%)`}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 260}, (_, i) => {
          const a0 = rand(i) * Math.PI * 2;
          const r0 = 500 + rand(i + 3) * 500;
          const sx = 960 + Math.cos(a0 + e * 1.2) * r0 * (1 - e);
          const sy = y + Math.sin(a0 + e * 1.2) * r0 * 0.55 * (1 - e);
          const tx = 960 + (rand(i + 7) - 0.5) * w;
          const ty = y + (rand(i + 11) - 0.5) * size * 0.9;
          const px = sx * (1 - e) + tx * e;
          const py = sy * (1 - e) + ty * e;
          const fade = conv < 1 ? 1 : 1 - clamp01((t - 16) / 20);
          return <circle key={i} cx={px} cy={py} r={0.8 + rand(i + 5) * 1.8} fill={B.goldWarm} opacity={(0.4 + 0.6 * rand(i + 9)) * fade} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.62, textAlign: 'center', opacity: tv, filter: tv < 1 ? `blur(${(1 - tv) * 12}px)` : undefined}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: size, letterSpacing: size * 0.12, color: '#ffe9b0', textShadow: '0 0 6px #fff4d0, 0 0 22px rgba(240,184,96,0.95), 0 0 60px rgba(214,150,60,0.7), 0 4px 18px rgba(0,0,0,0.8)'}}>{title}</span>
      </div>
      {en && (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 0.66, textAlign: 'center', fontFamily: BF.latin, fontSize: size * 0.2, letterSpacing: '0.5em', color: B.ink, opacity: clamp01((t - 22) / 14)}}>
          {en.toUpperCase()}
        </div>
      )}
      {sub && (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 1.02, textAlign: 'center', fontFamily: BF.cn, fontSize: size * 0.16, letterSpacing: '0.5em', color: B.goldWarm, opacity: clamp01((t - 34) / 14)}}>
          — {sub} —
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 漂浮公式：一圈半透明的公式 / 符号碎片在标题四周缓慢漂移（items 自己写，和题目相关） */
export const FormulaField: React.FC<{f: number; at: number; items: string[]; out?: number; seed?: number}> = ({f, at, items, out, seed = 1}) => {
  const a = blurIn(f, at, 30, out);
  return (
    <AbsoluteFill style={{opacity: a.opacity * 0.55}}>
      {items.map((s, i) => {
        // 围着中心排一圈，避开中间标题区
        const ang = (i / items.length) * Math.PI * 2 + rand(seed + i) * 0.4;
        const rx = 640 + rand(seed + i + 3) * 180;
        const ry = 330 + rand(seed + i + 5) * 60;
        const x = 960 + Math.cos(ang) * rx + Math.sin(f / 80 + i) * 8;
        const y = 470 + Math.sin(ang) * ry - f * 0.04;
        return (
          <div key={i} style={{position: 'absolute', left: x - 100, width: 200, top: y, textAlign: 'center', fontFamily: BF.latin, fontSize: 24 + rand(seed + i + 9) * 12, color: B.goldWarm, opacity: 0.5 + 0.3 * rand(i + 2)}}>
            {s}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** 柔入容器 */
export const Fade: React.FC<{f: number; at: number; out?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({f, at, out, dur = 16, style, children}) => {
  const a = blurIn(f, at, dur, out);
  if (a.v <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter, ...style}}>{children}</div>;
};

/**
 * 重拍砸字（黑金版）：at 那一帧暖白光晕骤亮、大字从 1.12 倍收到 1 倍、两圈金光环从字背后扩出去；sub 0.6 秒后浮出的小字（术语 · English）。
 * 重拍前的收暗和 3 帧静止由作品自己做。
 */
export const GlowSmash: React.FC<{f: number; at: number; text: string; size?: number; sub?: string; y?: number; color?: string}> = ({f, at, text, size = 260, sub, y = 460, color = '#ffe9b0'}) => {
  const t = f - at;
  if (t < 0) return null;
  const s = 1.12 - 0.12 * clamp01(t / 8) + 0.006 * Math.sin(t / 14);
  const r = size * 1.4 + (1400 - size * 1.4) * (1 - Math.pow(1 - clamp01(t / 40), 3));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 50% at 50% ${(y / 1080) * 100}%, rgba(255,226,170,0.6) 0%, rgba(190,130,60,0.22) 40%, rgba(0,0,0,0) 75%)`, opacity: 1 - clamp01(t / 26) * 0.7}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={960} cy={y} r={r} fill="none" stroke={B.gold} strokeWidth={3 - 2 * clamp01(t / 40)} opacity={(1 - clamp01(t / 40)) * 0.85} style={{filter: `drop-shadow(0 0 12px ${B.gold})`}} />
        <circle cx={960} cy={y} r={r * 0.7} fill="none" stroke={B.goldWarm} strokeWidth={1} opacity={(1 - clamp01(t / 34)) * 0.5} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.62, textAlign: 'center', transform: `scale(${s})`}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: size, letterSpacing: size * 0.1, color, textShadow: '0 0 8px #fff4d0, 0 0 30px rgba(240,184,96,0.95), 0 0 80px rgba(214,150,60,0.7), 0 4px 18px rgba(0,0,0,0.8)'}}>{text}</span>
      </div>
      {sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 0.55, textAlign: 'center', fontFamily: BF.cn, fontSize: 32, letterSpacing: 6, color: B.goldWarm, opacity: clamp01((t - 18) / 14), filter: `blur(${(1 - clamp01((t - 18) / 14)) * 6}px)`}}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * 表盘刻度环：n 根刻度围成一圈，at 起每 step 帧顺时针多点亮一根（像秒针在走，等待的意思），最新那根最亮；
 * 放在 GlowSmash 背后，给「等」「时间」「耐心」这类锚词用。
 */
export const TickRing: React.FC<{f: number; at: number; cx?: number; cy?: number; r?: number; n?: number; step?: number; out?: number}> = ({f, at, cx = 960, cy = 460, r = 330, n = 60, step = 2, out}) => {
  const a = blurIn(f, at, 10, out);
  if (a.v <= 0) return null;
  const lit = Math.floor((f - at) / step);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: a.opacity}}>
      {Array.from({length: n}, (_, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const major = i % 5 === 0;
        const r0 = r - (major ? 34 : 18);
        const on = i <= lit;
        const head = i === lit;
        return (
          <line
            key={i}
            x1={cx + Math.cos(ang) * r0}
            y1={cy + Math.sin(ang) * r0}
            x2={cx + Math.cos(ang) * r}
            y2={cy + Math.sin(ang) * r}
            stroke={head ? '#fff4d0' : on ? B.gold : 'rgba(229,201,145,0.18)'}
            strokeWidth={major ? 5 : 3}
            strokeLinecap="round"
            style={on ? {filter: `drop-shadow(0 0 ${head ? 14 : 6}px ${B.gold})`} : undefined}
          />
        );
      })}
    </svg>
  );
};
