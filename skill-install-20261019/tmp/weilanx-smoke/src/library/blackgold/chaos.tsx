import React from 'react';
import {clamp01, rand} from '../anim';
import {B, BF, blurIn, glowText} from './theme';

/**
 * 黑金光影风的「混沌 / 天气」道具（ep38 蝴蝶效应起）：发光蝴蝶、海鸥、龙卷风、扩散气流环、带拖尾的轨迹、
 * 老式打印纸带、天气预报日历条。讲初值敏感、预测极限、不确定性、天气 / 气候的题都能用。
 * 坐标是 1920×1080 舞台坐标，所有动画由帧号算出。
 */

/** 最近一次事件过去了多少帧（没有就是 Infinity） */
const sinceAt = (f: number, at: number[]) => {
  let best = Infinity;
  for (const a of at) if (f >= a && f - a < best) best = f - a;
  return best;
};

/**
 * 发光蝴蝶（SVG <g>，身体中心在原点）：flapAt 每个帧号扇一下（翅膀收拢再张开），平时轻轻扇；
 * t 帧号；size 翼展约 size；color 主色（默认金），glow 发光强度。
 */
export const GlowButterflyG: React.FC<{t: number; size?: number; flapAt?: number[]; color?: string; glow?: number}> = ({t, size = 200, flapAt = [], color = '#ffe9b0', glow = 1}) => {
  const s = size / 200;
  const ft = sinceAt(t, flapAt);
  // 扇一下：前 4 帧收拢、后 8 帧张开；平时 ±12% 慢扇
  const snap = ft < 4 ? ft / 4 : ft < 12 ? 1 - (ft - 4) / 8 : 0;
  const open = 1 - 0.75 * snap - 0.12 * (0.5 + 0.5 * Math.sin(t / 5));
  const wing = (dir: 1 | -1) => (
    <g transform={`scale(${dir * open} 1)`}>
      <path d="M4 -4 C40 -80 110 -96 104 -40 C100 -10 60 0 4 2 Z" fill={color} opacity={0.92} />
      <path d="M4 4 C50 10 86 30 70 66 C56 92 20 60 4 12 Z" fill={color} opacity={0.8} />
      <path d="M14 -6 C44 -50 84 -66 86 -40" fill="none" stroke="rgba(20,12,6,0.45)" strokeWidth={3} />
      <circle cx={70} cy={-46} r={9} fill="rgba(20,12,6,0.4)" />
      <path d="M12 10 C36 20 56 36 52 56" fill="none" stroke="rgba(20,12,6,0.4)" strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`scale(${s})`} style={{filter: `drop-shadow(0 0 ${14 * glow}px ${color}) drop-shadow(0 0 ${36 * glow}px rgba(240,184,96,0.6))`}}>
      {wing(1)}
      {wing(-1)}
      <ellipse cx={0} cy={0} rx={6} ry={30} fill="#fff4d0" />
      <path d="M-2 -28 Q-14 -56 -22 -62 M2 -28 Q14 -56 22 -62" fill="none" stroke="#fff4d0" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** 海鸥（SVG <g>，中心在原点）：一道 M 形翅膀，t 驱动缓慢扇动；size 翼展 */
export const GullG: React.FC<{t: number; size?: number; color?: string}> = ({t, size = 220, color = '#fff1c4'}) => {
  const s = size / 220;
  const w = Math.sin(t / 7) * 18;
  return (
    <g transform={`scale(${s})`} style={{filter: `drop-shadow(0 0 12px ${color})`}}>
      <path d={`M-110 ${-10 - w} Q-60 ${-46 - w} -8 0 Q0 8 8 0 Q60 ${-46 - w} 110 ${-10 - w} Q60 ${-24 - w} 8 12 Q0 22 -8 12 Q-60 ${-24 - w} -110 ${-10 - w} Z`} fill={color} />
    </g>
  );
};

/** 龙卷风（SVG <g>，底部尖端在原点）：一层层椭圆叠成漏斗、各层错开旋转；grow 0–1 从上往下长出来，calm 0–1 散掉 */
export const TornadoG: React.FC<{t: number; size?: number; grow?: number; calm?: number; color?: string}> = ({t, size = 360, grow = 1, calm = 0, color = '#e5c991'}) => {
  const n = 12;
  return (
    <g opacity={1 - calm}>
      {Array.from({length: n}, (_, i) => {
        const k = i / (n - 1); // 0 底 → 1 顶
        if (1 - k > grow + 0.02) return null;
        const y = -k * size;
        const rx = 14 + k * k * size * 0.42;
        const sway = Math.sin(t / 9 + k * 3) * 16 * k + calm * (rand(i) - 0.5) * 200;
        return (
          <ellipse
            key={i}
            cx={sway}
            cy={y - calm * 60 * k}
            rx={rx * (1 + calm * 0.8)}
            ry={rx * 0.22}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeDasharray={`${rx * 1.2} ${rx * 0.5}`}
            strokeDashoffset={-t * (4 + k * 6)}
            opacity={0.35 + 0.5 * k}
            style={{filter: `drop-shadow(0 0 6px ${color})`}}
          />
        );
      })}
    </g>
  );
};

/** 扩散的气流环（SVG <g>）：每个 at 帧从 (x, y) 扩出一圈，dur 帧内扩到 r 并淡掉；dx 让圈边往右漂（气流传过去） */
export const RipplesG: React.FC<{f: number; at: number[]; x: number; y: number; r?: number; dur?: number; dx?: number; color?: string}> = ({f, at, x, y, r = 420, dur = 40, dx = 0, color = B.gold}) => (
  <g>
    {at.map((a, i) => {
      const t = f - a;
      if (t < 0 || t > dur) return null;
      const p = 1 - Math.pow(1 - t / dur, 2);
      return <ellipse key={i} cx={x + dx * p} cy={y} rx={r * p} ry={r * p * 0.42} fill="none" stroke={color} strokeWidth={3 * (1 - p) + 0.6} opacity={0.9 * (1 - p)} style={{filter: `drop-shadow(0 0 8px ${color})`}} />;
    })}
  </g>
);

/**
 * 带拖尾的发光轨迹（SVG <g>）：pts 屏幕坐标点列，head 当前画到第几个点（可以是小数）；
 * 走过的全程淡淡留着（trace 透明度），最近 tail 个点更亮，头上一颗光点。适合吸引子、粒子轨迹、走势。
 */
export const TrailPathG: React.FC<{pts: [number, number][]; head: number; tail?: number; color?: string; width?: number; trace?: number; dot?: number}> = ({pts, head, tail = 160, color = B.gold, width = 2.5, trace = 0.28, dot = 9}) => {
  const h = Math.max(0, Math.min(pts.length - 1, head));
  const hi = Math.floor(h);
  if (hi < 1) return null;
  const seg = (a: number, b: number) =>
    pts
      .slice(Math.max(0, a), b + 1)
      .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(' ');
  const [hx, hy] = pts[hi];
  return (
    <g>
      <polyline points={seg(0, hi)} fill="none" stroke={color} strokeWidth={width * 0.7} opacity={trace} strokeLinejoin="round" />
      <polyline points={seg(hi - tail, hi)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${color})`}} />
      <circle cx={hx} cy={hy} r={dot} fill="#fff4d0" style={{filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color})`}} />
    </g>
  );
};

/**
 * 老式打印纸带（div）：两侧送纸孔、浅绿条纹、等宽数字一行行往上滚；rows 每行文字，scroll 已经滚上去的行数（可小数），
 * hiRow 那一行亮金框，hiText 替换那一行的显示（比如把 0.506127 印成 0.506）。(x, y) 左上角，w / h 尺寸。
 */
export const PrintoutTape: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; rows: string[]; scroll?: number; hiRow?: number; hiOn?: number; out?: number}> = ({
  f,
  at,
  x,
  y,
  w = 520,
  h = 600,
  rows,
  scroll = 0,
  hiRow = -1,
  hiOn = 0,
  out,
}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const lh = 50;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', opacity: a.opacity, filter: a.filter, borderRadius: 4, boxShadow: '0 0 40px rgba(229,201,145,0.25)'}}>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, #e9e2cf 0px, #e9e2cf 50px, #d4dcc4 50px, #d4dcc4 100px)'}} />
      {[18, w - 18].map((cx) => (
        <div key={cx} style={{position: 'absolute', left: cx - 8, top: 0, bottom: 0, background: `radial-gradient(circle at 8px 12px, #0a0705 6px, transparent 7px) 0 ${-(scroll * lh) % 25}px / 16px 25px repeat-y`, width: 16}} />
      ))}
      <div style={{position: 'absolute', left: 60, right: 60, top: h - (rows.length - scroll) * lh}}>
        {rows.map((r, i) => (
          <div key={i} style={{height: lh, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 34, letterSpacing: 3, color: '#2a2016', position: 'relative'}}>
            {r}
            {i === hiRow && <div style={{position: 'absolute', inset: '4px -14px', border: `3px solid ${B.gold}`, borderRadius: 4, opacity: hiOn, boxShadow: `0 0 18px ${B.gold}`}} />}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,3,2,0.85) 0%, rgba(5,3,2,0) 22%, rgba(5,3,2,0) 80%, rgba(5,3,2,0.6) 100%)'}} />
    </div>
  );
};

/**
 * 天气预报日历条（div）：days 张日卡横排，第 i 张在 litAt[i] 帧亮起（闪一下）；fogFrom 起的卡片是雾（模糊、红「?」）。
 * 每张卡：「第 N 天」+ 一个确定性天气图标（晴 / 云 / 雨）+ 底部可信度条（越往后越短）。(x, y) 左上角，cw 卡宽。
 */
export const ForecastStrip: React.FC<{f: number; x: number; y: number; days: number; litAt: number[]; fogFrom: number; cw?: number; gap?: number; seed?: number}> = ({f, x, y, days, litAt, fogFrom, cw = 132, gap = 14, seed = 5}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap}}>
    {Array.from({length: days}, (_, i) => {
      const t = f - (litAt[i] ?? Infinity);
      const on = clamp01(t / 6);
      const flash = t >= 0 && t < 10 ? 1 - t / 10 : 0;
      const fog = i >= fogFrom;
      const kind = Math.floor(rand(seed + i * 7) * 3);
      const conf = fog ? 0.08 : 1 - (i / fogFrom) * 0.75;
      const c = fog ? B.red : B.gold;
      return (
        <div key={i} style={{width: cw, height: 230, borderRadius: 8, background: 'rgba(10,7,5,0.78)', border: `2px solid ${on > 0 ? c : 'rgba(229,201,145,0.18)'}`, boxShadow: on > 0 ? `0 0 ${10 + 26 * flash}px ${c}` : undefined, position: 'relative', overflow: 'hidden', transform: `scale(${1 + 0.08 * flash})`}}>
          <div style={{textAlign: 'center', marginTop: 14, fontFamily: BF.cn, fontWeight: 900, fontSize: 24, color: on > 0 ? B.ink : B.inkFaint}}>第 {i + 1} 天</div>
          <svg width={cw} height={110} style={{display: 'block', opacity: on, filter: fog ? 'blur(7px)' : undefined}}>
            <g transform={`translate(${cw / 2} 56)`} style={{filter: `drop-shadow(0 0 8px ${c})`}}>
              {kind === 0 && (
                <>
                  <circle r={22} fill={B.gold} />
                  {Array.from({length: 8}, (_, k) => (
                    <line key={k} x1={Math.cos((k / 8) * Math.PI * 2) * 30} y1={Math.sin((k / 8) * Math.PI * 2) * 30} x2={Math.cos((k / 8) * Math.PI * 2) * 40} y2={Math.sin((k / 8) * Math.PI * 2) * 40} stroke={B.gold} strokeWidth={4} strokeLinecap="round" />
                  ))}
                </>
              )}
              {kind >= 1 && <path d="M-36 14 Q-40 -10 -16 -12 Q-8 -34 14 -24 Q34 -26 34 -4 Q46 2 38 14 Z" fill={B.inkDim} />}
              {kind === 2 && [-18, 0, 18].map((dx) => <line key={dx} x1={dx} y1={22} x2={dx - 6} y2={38} stroke={B.cyan} strokeWidth={4} strokeLinecap="round" />)}
            </g>
          </svg>
          {fog && on > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: BF.latinBold, fontSize: 72, ...glowText(B.red, 16)}}>?</div>}
          <div style={{position: 'absolute', left: 16, right: 16, bottom: 18, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)'}}>
            <div style={{width: `${100 * conf * on}%`, height: '100%', borderRadius: 4, background: c, boxShadow: `0 0 10px ${c}`}} />
          </div>
        </div>
      );
    })}
  </div>
);
