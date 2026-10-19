import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, rand} from '../anim';
import {L, LF, MARK, MARK_CLOSE, charIn, commas, countTo, fadeSoft, markColor, markLine, textShadow, type MarkKind} from './theme';

/**
 * 灯火史话风的舞台层：夜色背景、火星、左上叙述、右上数字、出处与声明、朝代轴、转场容器。
 * 全部按 1920×1080 横屏设计；所有动画由帧号 f 算出。
 */

/**
 * 夜色背景：暖黑底 + 一团暖光晕 + 暗角。
 * sky 上半屏换成冷蓝黑夜空并撒星点；floor 画一层极淡的透视地面网格；glow 光晕中心（百分比）。
 */
export const NightBg: React.FC<{f: number; sky?: boolean; floor?: boolean; glow?: [number, number]; strength?: number; horizon?: number; seed?: number}> = ({
  f,
  sky = true,
  floor = false,
  glow = [50, 62],
  strength = 1,
  horizon = 560,
  seed = 3,
}) => {
  const breathe = 0.92 + 0.08 * Math.sin(f / 37);
  return (
    <AbsoluteFill style={{background: L.night}}>
      {sky && <AbsoluteFill style={{background: `linear-gradient(180deg, ${L.sky} 0%, #0a0b0f ${(horizon / 1080) * 70}%, rgba(12,9,8,0) ${(horizon / 1080) * 100}%)`}} />}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at ${glow[0]}% ${glow[1]}%, rgba(118,80,48,${0.42 * strength * breathe}) 0%, rgba(70,46,30,${0.18 * strength}) 45%, rgba(0,0,0,0) 78%)`,
        }}
      />
      {sky && (
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          {Array.from({length: 120}, (_, i) => {
            const s = seed * 1000 + i;
            const y = rand(s + 1) * horizon * 0.95;
            const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (30 + rand(s + 2) * 50) + i));
            return <circle key={i} cx={rand(s) * 1920} cy={y} r={0.7 + rand(s + 3) * 1.3} fill="#dfe6f2" opacity={(0.25 + 0.5 * rand(s + 4)) * tw * (1 - y / horizon) + 0.05} />;
          })}
        </svg>
      )}
      {floor && <FloorGrid horizon={horizon} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 52%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.78) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 透视地面网格：从地平线往下越来越疏的横线 + 汇向消失点的竖线，极淡 */
export const FloorGrid: React.FC<{horizon?: number; opacity?: number}> = ({horizon = 560, opacity = 0.09}) => {
  const vx = 960;
  const rows = Array.from({length: 12}, (_, i) => horizon + (1080 - horizon) * Math.pow((i + 1) / 12, 1.8));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', opacity}}>
      {rows.map((y, i) => (
        <line key={`h${i}`} x1={0} x2={1920} y1={y} y2={y} stroke={L.ink} strokeWidth={1.2} />
      ))}
      {Array.from({length: 25}, (_, i) => {
        const bx = -1600 + i * 214;
        return <line key={`v${i}`} x1={vx + (bx - vx) * 0.08} y1={horizon} x2={bx} y2={1080} stroke={L.ink} strokeWidth={1.2} />;
      })}
    </svg>
  );
};

/** 火星：从 (x, y) 附近往上飘、渐暗的小火点；spread 横向散开范围 */
export const Embers: React.FC<{f: number; x: number; y: number; n?: number; spread?: number; rise?: number; seed?: number; on?: number}> = ({f, x, y, n = 14, spread = 60, rise = 220, seed = 1, on = 1}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: on}}>
    {Array.from({length: n}, (_, i) => {
      const s = seed * 100 + i;
      const life = 40 + rand(s) * 50;
      const t = ((f + rand(s + 1) * life) % life) / life;
      const px = x + (rand(s + 2) - 0.5) * spread + Math.sin(t * 6 + i) * 10 * t;
      const py = y - t * rise * (0.6 + rand(s + 3) * 0.6);
      return <circle key={i} cx={px} cy={py} r={1.4 + rand(s + 4) * 2} fill={rand(s + 5) > 0.5 ? L.goldHot : L.red} opacity={(1 - t) * 0.85} />;
    })}
  </svg>
);

type Seg = {text: string; mark?: MarkKind};
/** 把「普通【蓝】〖红〗〔金〕」拆成段 */
export const parseMarks = (s: string): Seg[] => {
  const out: Seg[] = [];
  let buf = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (MARK[ch]) {
      const end = s.indexOf(MARK_CLOSE[ch], i + 1);
      if (end > i) {
        if (buf) out.push({text: buf});
        buf = '';
        out.push({text: s.slice(i + 1, end), mark: MARK[ch]});
        i = end + 1;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  if (buf) out.push({text: buf});
  return out;
};

export type NarrLine = {at: number; text: string; size?: number};

/**
 * 左上叙述：一句一行往下累加，每个字从大、模糊、灰收拢成清晰米白（单字 12 帧、间隔 perChar 帧（默认 3，和原片一致））；
 * 关键词用【蓝】〖红〗〔金〕标记，字出完后下划线从左往右画出。out 整段模糊淡出（12 帧）。
 */
export const Narration: React.FC<{f: number; lines: NarrLine[]; x?: number; y?: number; size?: number; gap?: number; perChar?: number; out?: number; align?: 'left' | 'center'; w?: number}> = ({
  f,
  lines,
  x = 115,
  y = 92,
  size = 64,
  gap = 1.42,
  perChar = 3,
  out,
  align = 'left',
  w = 1300,
}) => {
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: align === 'center' ? 960 - w / 2 : x, top: y, width: w, opacity: o, filter: o < 1 ? `blur(${(1 - o) * 10}px)` : undefined, textAlign: align}}>
      {lines.map((ln, li) => {
        if (f < ln.at - 2) return null;
        const fs = ln.size ?? size;
        let k = 0;
        return (
          <div key={li} style={{fontFamily: LF.serif, fontWeight: 900, fontSize: fs, lineHeight: `${fs * gap}px`, color: L.ink, textShadow, whiteSpace: 'nowrap'}}>
            {parseMarks(ln.text).map((seg, si) => {
              const start = k;
              const chars = Array.from(seg.text).map((c, ci) => {
                const a = charIn(f, ln.at + (start + ci) * perChar);
                return (
                  <span
                    key={ci}
                    style={{
                      display: 'inline-block',
                      transform: `scale(${a.scale})`,
                      transformOrigin: '50% 70%',
                      filter: a.blur > 0.05 ? `blur(${a.blur}px)` : undefined,
                      opacity: a.opacity,
                      color: seg.mark ? markColor(seg.mark) : undefined,
                    }}
                  >
                    {c}
                  </span>
                );
              });
              k += chars.length;
              if (!seg.mark) return <React.Fragment key={si}>{chars}</React.Fragment>;
              const lineAt = ln.at + (start + chars.length) * perChar + 4;
              const p = 1 - Math.pow(1 - clamp01((f - lineAt) / 10), 3);
              const c = markLine(seg.mark);
              return (
                <span key={si} style={{position: 'relative', display: 'inline-block'}}>
                  {chars}
                  <span
                    style={{
                      position: 'absolute',
                      left: '2%',
                      bottom: fs * 0.02,
                      height: Math.max(3, fs * 0.06),
                      width: `${96 * p}%`,
                      borderRadius: 4,
                      background: c,
                      boxShadow: `0 0 10px ${c}`,
                      opacity: 0.95,
                    }}
                  />
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** 四角星闪光：数字到点、名签出现时闪一下（约 16 帧），size 星的半径 */
export const Glint: React.FC<{f: number; at: number; x: number; y: number; size?: number; color?: string}> = ({f, at, x, y, size = 46, color = '#fff6dc'}) => {
  const t = (f - at) / 16;
  if (t < 0 || t > 1) return null;
  const s = Math.sin(t * Math.PI);
  const r = size * s;
  const w = r * 0.16;
  return (
    <svg width={size * 2.4} height={size * 2.4} style={{position: 'absolute', left: x - size * 1.2, top: y - size * 1.2, overflow: 'visible', filter: `drop-shadow(0 0 12px ${color})`}}>
      <g transform={`translate(${size * 1.2} ${size * 1.2}) rotate(${t * 40 - 10})`} opacity={s}>
        <path d={`M0 ${-r} L${w} ${-w} L${r} 0 L${w} ${w} L0 ${r} L${-w} ${w} L${-r} 0 L${-w} ${-w} Z`} fill={color} />
      </g>
    </svg>
  );
};

/**
 * 右上数字：灰色小标签 + 宋体 Black 大数字（从 from 滚到 value，到点闪一颗星）+ 单位；
 * sub 第二行小字（如「不满 500 人」），color 数字颜色（默认米白，惩罚类用 L.red）；prefix 数字前的字（如「杖」），strike 从这一帧起红线划掉。
 */
export const StatCorner: React.FC<{
  f: number;
  at: number;
  label: string;
  value: number;
  unit?: string;
  from?: number;
  dur?: number;
  sub?: string;
  color?: string;
  x?: number;
  y?: number;
  size?: number;
  out?: number;
  comma?: boolean;
  prefix?: string;
  strike?: number;
}> = ({f, at, label, value, unit = '', from = 0, dur = 40, sub, color = L.ink, x = 1560, y = 108, size = 110, out, comma = true, prefix, strike}) => {
  const a = fadeSoft(f, at, 14, out);
  if (a.v <= 0) return null;
  const n = countTo(f, at, dur, value, from);
  return (
    <div style={{position: 'absolute', left: x - 500, top: y, width: 1000, textAlign: 'center', opacity: a.opacity, filter: a.filter}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 34, color: L.inkDim, letterSpacing: 2}}>{label}</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: size, lineHeight: 1.1, color, textShadow}}>
        <span style={{position: 'relative', display: 'inline-block'}}>
          {prefix && <span style={{fontSize: size * 0.82, marginRight: size * 0.18}}>{prefix}</span>}
          {comma ? commas(n) : n}
          {unit && <span style={{fontSize: size * 0.82, marginLeft: size * 0.18}}>{unit}</span>}
          {strike !== undefined && f >= strike && (
            <span style={{position: 'absolute', left: '-6%', top: '52%', height: size * 0.09, width: `${112 * clamp01((f - strike) / 6)}%`, background: L.red, boxShadow: `0 0 12px ${L.red}`, transform: 'rotate(-8deg)', borderRadius: 6}} />
          )}
        </span>
      </div>
      {sub && <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: size * 0.5, color, opacity: 0.92, textShadow}}>{sub}</div>}
      <Glint f={f} at={at + dur - 2} x={500 + size * 1.6} y={size * 0.55 + 46} size={size * 0.38} />
    </div>
  );
};

/** 底部居中出处：「据《示例文献》……；画面为示意」，26px 灰黑体 */
export const SourceNote: React.FC<{f: number; at: number; text: string; out?: number; y?: number}> = ({f, at, text, out, y = 1036}) => {
  const a = fadeSoft(f, at, 16, out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - 30, textAlign: 'center', fontFamily: LF.label, fontWeight: 600, fontSize: 26, color: L.inkDim, opacity: a.opacity * 0.9}}>{text}</div>
  );
};

/** 右下角声明：「人物和场面都是示意」 */
export const Disclaimer: React.FC<{f: number; at?: number; text?: string; out?: number}> = ({f, at = 0, text = '人物和场面都是示意', out}) => (
  <div style={{position: 'absolute', right: 64, bottom: 34, fontFamily: LF.label, fontWeight: 600, fontSize: 24, color: 'rgba(239,230,214,0.32)', opacity: fadeSoft(f, at, 16, out).opacity}}>{text}</div>
);

/**
 * 朝代轴：底部一条细线 + 若干朝代点，当前朝代字变大变亮、点上套圆环；
 * 换朝代时传 prev 和 moveAt，圆环沿轴滑过去（20 帧），year 在圆环下写公元年。
 */
export const DynastyAxis: React.FC<{f: number; at: number; items: string[]; active: number; prev?: number; moveAt?: number; year?: string; out?: number; y?: number; x0?: number; x1?: number}> = ({
  f,
  at,
  items,
  active,
  prev,
  moveAt = 0,
  year,
  out,
  y = 1002,
  x0 = 330,
  x1 = 1570,
}) => {
  const a = fadeSoft(f, at, 18, out);
  if (a.v <= 0) return null;
  const xs = items.map((_, i) => x0 + 140 + ((x1 - x0 - 280) * i) / Math.max(1, items.length - 1));
  const p = prev === undefined ? 1 : 1 - Math.pow(1 - clamp01((f - moveAt) / 20), 3);
  const from = prev ?? active;
  const cx = xs[from] + (xs[active] - xs[from]) * p;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <line x1={x0} x2={x1} y1={y} y2={y} stroke="rgba(239,230,214,0.3)" strokeWidth={2} />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={y} r={6} fill="rgba(239,230,214,0.55)" />
        ))}
        <circle cx={cx} cy={y} r={15} fill="none" stroke={L.ink} strokeWidth={3} />
        <circle cx={cx} cy={y} r={7} fill={L.ink} />
      </svg>
      {items.map((t, i) => {
        const near = 1 - clamp01(Math.abs(cx - xs[i]) / 120);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: xs[i] - 120,
              width: 240,
              top: y - 62 - near * 10,
              textAlign: 'center',
              fontFamily: LF.serif,
              fontWeight: 900,
              fontSize: 34 + near * 16,
              color: near > 0.5 ? L.ink : 'rgba(239,230,214,0.4)',
              textShadow,
            }}
          >
            {t}
          </div>
        );
      })}
      {year && (
        <div style={{position: 'absolute', left: cx - 150, width: 300, top: y + 22, textAlign: 'center', fontFamily: LF.label, fontWeight: 700, fontSize: 22, color: L.blue}}>{year}</div>
      )}
    </div>
  );
};

/** 淡入容器：淡入 + 轻模糊，可带淡出 */
export const Fade: React.FC<{f: number; at: number; out?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({f, at, out, dur = 16, style, children}) => {
  const a = fadeSoft(f, at, dur, out);
  if (a.v <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, opacity: a.opacity, filter: a.filter, ...style}}>{children}</div>;
};

/**
 * 暗场溶解：一个「场」的容器，at 起 15 帧淡入，out 起 15 帧淡出；
 * 两场在同一时间段交叠就是原片那种暗场交叉溶解。能贯穿的元素放在两场外面，就不会闪。
 */
export const Dissolve: React.FC<{f: number; at: number; out?: number; dur?: number; children: React.ReactNode}> = ({f, at, out, dur = 15, children}) => {
  const i = clamp01((f - at) / dur);
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / dur);
  const v = Math.min(i, o);
  if (v <= 0) return null;
  return <AbsoluteFill style={{opacity: v * v * (3 - 2 * v)}}>{children}</AbsoluteFill>;
};

/**
 * 穿光转场：以 (x, y) 一团火光为中心，mode='in' 镜头扎进去（放大到 6 倍并淡出），
 * mode='out' 场景缩向那一点（缩到 0.35 倍并淡出，只剩光点）；from 在 at 之前保持原样。
 * 下一场用 mode='from' 从同一点拉出来（0.5 → 1 倍，淡入）。dur 默认 18 帧。
 */
export const PointTransit: React.FC<{f: number; at: number; x: number; y: number; mode: 'in' | 'out' | 'from'; dur?: number; children: React.ReactNode}> = ({f, at, x, y, mode, dur = 18, children}) => {
  const t = clamp01((f - at) / dur);
  const e = t * t * (3 - 2 * t);
  let s = 1;
  let o = 1;
  if (mode === 'in') {
    s = Math.pow(6, e);
    o = 1 - e;
  } else if (mode === 'out') {
    s = 1 - 0.65 * e;
    o = 1 - e;
  } else {
    s = 0.5 + 0.5 * e;
    o = e;
  }
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${x}px ${y}px`, opacity: o}}>{children}</AbsoluteFill>;
};

/** 镜头慢推容器：s 由调用方算（如 push()），origin 推近中心 */
export const Cam: React.FC<{s?: number; x?: number; y?: number; origin?: [number, number]; children: React.ReactNode}> = ({s = 1, x = 0, y = 0, origin = [960, 540], children}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: `${origin[0]}px ${origin[1]}px`}}>{children}</AbsoluteFill>
);

/** 落定抖动：at 起 10 帧内整块画面随机抖，amp 像素 */
export const shakeXY = (f: number, at: number, amp = 14) => {
  const t = f - at;
  if (t < 0 || t > 10) return {x: 0, y: 0};
  const k = 1 - t / 10;
  return {x: (rand(at * 7 + t) - 0.5) * 2 * amp * k, y: (rand(at * 13 + t) - 0.5) * 2 * amp * k};
};

/**
 * 全屏砸下的大字（「绞」「奇迹」）：从 1.6 倍、模糊收到 1 倍（6 帧），落定后整块抖一下；
 * color 默认朱红，sub 下方一行小字（如「六百里加急 · 6 天」），size 字号。
 */
export const BigGlyph: React.FC<{f: number; at: number; text: string; sub?: string; color?: string; size?: number; y?: number; out?: number}> = ({f, at, text, sub, color = L.red, size = 360, y = 540, out}) => {
  const t = f - at;
  if (t < 0) return null;
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 10);
  if (o <= 0) return null;
  const p = clamp01(t / 6);
  const e = 1 - Math.pow(1 - p, 3);
  const s = 1.6 - 0.6 * e;
  const {x: sx, y: sy} = shakeXY(f, at + 6, 16);
  const glowC = color === L.red ? 'rgba(225,104,79,0.55)' : 'rgba(237,174,80,0.6)';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.62, textAlign: 'center', transform: `translate(${sx}px, ${sy}px)`, opacity: o}}>
      <div
        style={{
          display: 'inline-block',
          fontFamily: LF.serif,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.1,
          color,
          transform: `scale(${s})`,
          filter: p < 1 ? `blur(${(1 - e) * 14}px)` : undefined,
          opacity: Math.min(1, p * 2),
          textShadow: `0 0 60px ${glowC}, 0 8px 30px rgba(0,0,0,0.8)`,
        }}
      >
        {text}
      </div>
      {sub && (
        <div style={{marginTop: 10, fontFamily: LF.serif, fontWeight: 900, fontSize: 52, color: L.ink, letterSpacing: 6, opacity: clamp01((t - 10) / 12), textShadow}}>{sub}</div>
      )}
    </div>
  );
};

/** 白闪：at 那一帧最亮、dur 帧内淡掉（爆点用） */
export const Flash: React.FC<{f: number; at: number; dur?: number; peak?: number; color?: string}> = ({f, at, dur = 10, peak = 0.85, color = '#fff4dc'}) => {
  const t = f - at;
  if (t < 0 || t > dur) return null;
  return <AbsoluteFill style={{background: color, opacity: peak * Math.pow(1 - t / dur, 2), pointerEvents: 'none'}} />;
};

/**
 * 片头 / 片尾标题卡：居中宋体 Black 大标题（金色光晕），上方小字系列名、下方胶囊关键词；
 * 每个字从大、模糊砸下（perChar 帧一个），title 里可以用 \n 换行。
 */
export const TitleCard: React.FC<{f: number; at: number; kicker?: string; title: string; sub?: string; pill?: string; size?: number; perChar?: number}> = ({f, at, kicker, title, sub, pill, size = 150, perChar = 2}) => {
  if (f < at) return null;
  let k = 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      {kicker && <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: L.inkDim, marginBottom: 18, opacity: clamp01((f - at) / 10)}}>{kicker}</div>}
      {title.split('\n').map((ln, li) => (
        <div key={li} style={{fontFamily: LF.serif, fontWeight: 900, fontSize: li === 0 ? size : size * 0.62, lineHeight: 1.18, color: li === 0 ? L.goldHot : L.ink, textShadow: li === 0 ? '0 0 50px rgba(237,174,80,0.55), 0 6px 24px rgba(0,0,0,0.8)' : textShadow, whiteSpace: 'nowrap'}}>
          {Array.from(ln).map((c, ci) => {
            const a = charIn(f, at + (k++) * perChar, 6);
            return (
              <span key={ci} style={{display: 'inline-block', transform: `scale(${1.6 - 0.6 * a.v})`, filter: a.blur > 0.05 ? `blur(${a.blur}px)` : undefined, opacity: a.opacity}}>
                {c}
              </span>
            );
          })}
        </div>
      ))}
      {sub && <div style={{marginTop: 16, fontFamily: LF.serif, fontWeight: 900, fontSize: 44, color: L.inkDim, opacity: clamp01((f - at - 16) / 12)}}>{sub}</div>}
      {pill && (
        <div style={{marginTop: 30, padding: '10px 34px', border: `3px solid ${L.gold}`, borderRadius: 40, fontFamily: LF.serif, fontWeight: 900, fontSize: 40, color: L.gold, background: 'rgba(20,14,10,0.7)', boxShadow: `0 0 20px rgba(237,174,80,0.35)`, opacity: clamp01((f - at - 20) / 10)}}>
          {pill}
        </div>
      )}
    </AbsoluteFill>
  );
};
