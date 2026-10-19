import React from 'react';
import {clamp01, easeInOut, easeOut, rand} from '../anim';
import {drawLen, glowF, T, TF} from './theme';

/**
 * 战术屏科普风的图表：所有线都「画出来」（pathLength={1} + strokeDasharray），带同色外发光；
 * 青 = 你 / 主线，红 = 变差 / 失误，橙 = 高手，绿 = 变好。坐标都是组件内部的局部像素。
 */

/** 正态随机（Box–Muller，确定性） */
export const gauss = (seed: number) => Math.sqrt(-2 * Math.log(Math.max(1e-6, rand(seed)))) * Math.cos(2 * Math.PI * rand(seed + 0.5));

const axis = (w: number, h: number, yLabel?: string, xLabel?: string) => (
  <>
    <line x1={0} y1={0} x2={0} y2={h} stroke={T.faint} strokeWidth={1.5} />
    <line x1={0} y1={h} x2={w} y2={h} stroke={T.faint} strokeWidth={1.5} />
    {yLabel ? (
      <text x={0} y={-16} fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
        {yLabel}
      </text>
    ) : null}
    {xLabel ? (
      <text x={w} y={h + 36} textAnchor="end" fontFamily={TF.sans} fontSize={20} fill={T.gray}>
        {xLabel}
      </text>
    ) : null}
  </>
);

/** 发光折线：data 依次画出（dur 帧画完），redFrom 之后的线段和点变红；最后一点可挂 tag 红色标签 */
export const NeonLine: React.FC<{f: number; at: number; data: number[]; w?: number; h?: number; redFrom?: number; yLabel?: string; xLabel?: string; dur?: number; tag?: string; min?: number; max?: number}> = ({
  f,
  at,
  data,
  w = 1100,
  h = 420,
  redFrom,
  yLabel,
  xLabel,
  dur = 36,
  tag,
  min = Math.min(...data),
  max = Math.max(...data),
}) => {
  const p = (f - at) / dur;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 30 - ((v - min) / (max - min || 1)) * (h - 60)] as const);
  const shown = clamp01(p) * (data.length - 1);
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      {axis(w, h, yLabel, xLabel)}
      {pts.slice(1).map(([x, y], i) => {
        const seg = clamp01(shown - i);
        if (seg <= 0) return null;
        const [x0, y0] = pts[i];
        const red = redFrom !== undefined && i + 1 >= redFrom;
        const c = red ? T.red : T.cyan;
        return <line key={i} x1={x0} y1={y0} x2={x0 + (x - x0) * seg} y2={y0 + (y - y0) * seg} stroke={c} strokeWidth={3} style={{filter: glowF(c, 5)}} />;
      })}
      {pts.map(([x, y], i) =>
        i <= shown ? <circle key={i} cx={x} cy={y} r={6} fill={redFrom !== undefined && i >= redFrom ? T.red : T.cyan} style={{filter: glowF(redFrom !== undefined && i >= redFrom ? T.red : T.cyan, 5)}} /> : null,
      )}
      {tag && p >= 1 ? (
        <g opacity={clamp01((f - at - dur) / 8)}>
          <rect x={pts[pts.length - 1][0] - 40} y={pts[pts.length - 1][1] + 22} width={80} height={32} rx={6} fill="none" stroke={T.red} strokeWidth={2} />
          <text x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1] + 45} textAnchor="middle" fontFamily={TF.sans} fontSize={20} fill={T.red}>
            {tag}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

const bellY = (z: number) => Math.exp((-z * z) / 2);

/**
 * 钟形曲线：横轴 ±3σ。shift 让整条曲线左右移动（σ 为单位，负数 = 变差）；ghost 在原位留一条虚线；
 * zones 把左尾填红、中间青、右尾绿；labels 是三段下方的文字；samples 是依次落到曲线上的抽样点（σ 位置 + 出现帧）
 */
export const BellCurve: React.FC<{
  f: number;
  at: number;
  w?: number;
  h?: number;
  shift?: number;
  ghost?: boolean;
  zones?: boolean;
  labels?: [string, string, string];
  samples?: [number, number][];
  dur?: number;
}> = ({f, at, w = 1100, h = 380, shift = 0, ghost = false, zones = true, labels = ['差', '平均', '好'], samples = [], dur = 30}) => {
  const X = (z: number) => ((z + 3) / 6) * w;
  const path = (s: number) => Array.from({length: 121}, (_, i) => {
    const z = -3 + (i / 120) * 6;
    return `${i ? 'L' : 'M'}${X(z).toFixed(1)} ${(h - bellY(z - s) * (h - 20)).toFixed(1)}`;
  }).join(' ');
  const area = (a: number, b: number, s: number) => {
    let d = `M${X(a)} ${h}`;
    for (let i = 0; i <= 40; i++) {
      const z = a + ((b - a) * i) / 40;
      d += ` L${X(z).toFixed(1)} ${(h - bellY(z - s) * (h - 20)).toFixed(1)}`;
    }
    return d + ` L${X(b)} ${h} Z`;
  };
  const p = drawLen(f, at, dur);
  const fill = clamp01((f - at - dur * 0.6) / 16);
  return (
    <svg width={w} height={h + 60} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="tac-bell" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={T.cyan} stopOpacity={0.45} />
          <stop offset="1" stopColor={T.cyan} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <line x1={0} y1={h} x2={w} y2={h} stroke={T.faint} strokeWidth={1.5} />
      {ghost && <path d={path(0)} fill="none" stroke="rgba(200,215,225,0.35)" strokeWidth={2} strokeDasharray="6 8" />}
      {zones && (
        <g opacity={fill}>
          <path d={area(-3, -1 + shift, shift)} fill={T.red} opacity={0.32} />
          <path d={area(-1 + shift, 1 + shift, shift)} fill="url(#tac-bell)" />
          <path d={area(1 + shift, 3, shift)} fill={T.green} opacity={0.28} />
        </g>
      )}
      <path d={path(shift)} fill="none" stroke="#bff2fb" strokeWidth={3.2} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: glowF(T.cyan, 8)}} />
      {labels.map((l, i) => (
        <text key={l} x={X(-2 + 2 * i + shift)} y={h + 40} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={[T.red, T.cyan, T.green][i]} opacity={clamp01((f - at - dur - i * 6) / 10)}>
          {l}
        </text>
      ))}
      {samples.map(([z, sat], i) => {
        const t = f - sat;
        if (t < 0) return null;
        const yEnd = h - bellY(z - shift) * (h - 20);
        const y = -60 + (yEnd + 60) * easeOut(clamp01(t / 12));
        const c = z < -1 ? T.red : z > 1 ? T.green : T.cyan;
        return (
          <g key={i}>
            <circle cx={X(z)} cy={y} r={9} fill={c} style={{filter: glowF(c, 8)}} />
            {t > 12 && <line x1={X(z)} x2={X(z)} y1={yEnd} y2={h} stroke={c} strokeWidth={1.5} opacity={0.5} />}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * 子弹散布：半身人形剪影 + 头部宽度的红色竖带；n 发子弹按正态依次落下（sigma 像素），
 * 下方直方图跟着长高；右侧大字是命中率（落在竖带里的比例，自动算）
 */
export const Spread: React.FC<{f: number; at: number; n?: number; sigma?: number; per?: number; seed?: number; band?: number; label?: string; color?: string}> = ({f, at, n = 50, sigma = 22, per = 1.2, seed = 3, band = 34, label = '命中率', color = T.cyan}) => {
  const cx = 300;
  const headY = 150;
  const shown = Math.max(0, Math.min(n, Math.floor((f - at) / per)));
  const shots = Array.from({length: n}, (_, i) => ({x: gauss(seed * 100 + i) * sigma, y: gauss(seed * 100 + i + 0.25) * sigma * 0.45}));
  const hits = shots.slice(0, shown).filter((s) => Math.abs(s.x) <= band / 2).length;
  const bins = 15;
  const counts = Array.from({length: bins}, () => 0);
  shots.slice(0, shown).forEach((s) => {
    const b = Math.floor(((s.x + sigma * 3) / (sigma * 6)) * bins);
    if (b >= 0 && b < bins) counts[b]++;
  });
  const maxC = Math.max(4, ...counts);
  return (
    <svg width={760} height={560} style={{overflow: 'visible'}}>
      {/* 人形剪影 */}
      <circle cx={cx} cy={headY} r={46} fill="rgba(70,110,135,0.12)" stroke="rgba(150,200,220,0.45)" strokeWidth={2} />
      <path d={`M${cx - 150} 440 Q${cx - 140} 230 ${cx} 215 Q${cx + 140} 230 ${cx + 150} 440`} fill="rgba(70,110,135,0.1)" stroke="rgba(150,200,220,0.45)" strokeWidth={2} />
      {/* 头部竖带 */}
      <rect x={cx - band / 2} y={60} width={band} height={380} fill={T.red} opacity={0.18} />
      <line x1={cx - band / 2} x2={cx - band / 2} y1={60} y2={440} stroke={T.red} opacity={0.7} strokeDasharray="5 5" />
      <line x1={cx + band / 2} x2={cx + band / 2} y1={60} y2={440} stroke={T.red} opacity={0.7} strokeDasharray="5 5" />
      <text x={cx} y={48} textAnchor="middle" fontFamily={TF.sans} fontSize={18} fill={T.red}>
        头部宽度
      </text>
      {/* 落点 */}
      {shots.slice(0, shown).map((s, i) => (
        <circle key={i} cx={cx + s.x} cy={headY + s.y} r={4} fill={color} opacity={i === shown - 1 ? 1 : 0.8} style={{filter: glowF(color, 3)}} />
      ))}
      {/* 直方图 */}
      {counts.map((c, i) => {
        const bw = (sigma * 6) / bins;
        return <rect key={i} x={cx - sigma * 3 + i * bw + 1} y={440 - (c / maxC) * 110} width={bw - 2} height={(c / maxC) * 110} fill={color} opacity={0.75} />;
      })}
      <line x1={cx - 180} x2={cx + 180} y1={440} y2={440} stroke={T.faint} />
      {/* 计数 + 命中率 */}
      <text x={0} y={70} fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
        SHOTS
      </text>
      <text x={0} y={112} fontFamily={TF.mono} fontWeight={700} fontSize={44} fill={T.white}>
        {shown}
      </text>
      <text x={cx + 70} y={420} fontFamily={TF.mono} fontWeight={700} fontSize={56} fill={color} style={{filter: glowF(color, 8)}}>
        {shown ? Math.round((hits / shown) * 100) : 0}%
      </text>
      <text x={cx + 72} y={446} fontFamily={TF.sans} fontSize={18} fill={T.gray}>
        {label}
      </text>
    </svg>
  );
};

/** 速度—准确率曲线：横轴速度、纵轴命中率；shift 越大整条曲线越往右（同样的速度更准 = 高手）；依次画出，可在 mark 速度处标出各线的点 */
export const TradeoffCurve: React.FC<{f: number; at: number; curves: {label: string; color: string; shift: number}[]; w?: number; h?: number; mark?: number}> = ({f, at, curves, w = 1000, h = 440, mark}) => {
  const acc = (x: number, s: number) => (1 / (1 + Math.exp((x - 0.42 - s) * 7))) * 0.86 + 0.1;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      {axis(w, h, '命中率', '速度 →')}
      {curves.map((c, ci) => {
        const p = drawLen(f, at + ci * 18, 30);
        const d = Array.from({length: 61}, (_, i) => `${i ? 'L' : 'M'}${((i / 60) * w).toFixed(1)} ${(h - acc(i / 60, c.shift) * h).toFixed(1)}`).join(' ');
        return (
          <g key={c.label}>
            <path d={d} fill="none" stroke={c.color} strokeWidth={3} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: glowF(c.color, 5)}} />
            <text x={(mark ?? 0.6) * w + 16} y={h - acc(mark ?? 0.6, c.shift) * h + (ci === curves.length - 1 ? -12 : 30)} fontFamily={TF.sans} fontSize={24} fill={c.color} opacity={p}>
              {c.label}
            </text>
          </g>
        );
      })}
      {mark !== undefined && curves.length > 1 ? (
        <g opacity={clamp01((f - at - curves.length * 18 - 20) / 12)}>
          <line x1={mark * w} x2={mark * w} y1={h - acc(mark, curves[curves.length - 1].shift) * h} y2={h} stroke={T.faint} strokeDasharray="4 6" />
          {curves.map((c) => (
            <circle key={c.label} cx={mark * w} cy={h - acc(mark, c.shift) * h} r={7} fill={c.color} />
          ))}
        </g>
      ) : null}
    </svg>
  );
};

/** 循环环：节点胶囊均匀排在圆上，一颗亮点沿圆转（speed 圈 / 秒），中间写「LOOP ×n」；hot 让某个节点变红并放大 */
export const LoopRing: React.FC<{f: number; at: number; nodes: string[]; r?: number; count?: number; speed?: number; color?: string; hot?: number}> = ({f, at, nodes, r = 230, count = 1, speed = 0.5, color = T.cyan, hot}) => {
  const t = Math.max(0, f - at);
  const draw = drawLen(f, at, 26);
  const a = -Math.PI / 2 + (t / 30) * speed * Math.PI * 2;
  const s = r + 140;
  return (
    <div style={{position: 'relative', width: s * 2, height: s * 2}}>
      <svg width={s * 2} height={s * 2} style={{position: 'absolute'}}>
        <circle cx={s} cy={s} r={r} fill="none" stroke={color} strokeWidth={3} pathLength={1} strokeDasharray={`${draw} 1`} transform={`rotate(-90 ${s} ${s})`} style={{filter: glowF(color, 6)}} />
        {nodes.map((_, i) => {
          const na = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2 + Math.PI / nodes.length;
          return <path key={i} d={`M${s + Math.cos(na) * r} ${s + Math.sin(na) * r} l-8 -6 l0 12 Z`} fill={color} transform={`rotate(${(na * 180) / Math.PI + 90} ${s + Math.cos(na) * r} ${s + Math.sin(na) * r})`} opacity={draw} />;
        })}
        {t > 26 && <circle cx={s + Math.cos(a) * r} cy={s + Math.sin(a) * r} r={9} fill="#fff" style={{filter: glowF(color, 10)}} />}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: s - 52, textAlign: 'center', opacity: draw}}>
        <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 16, letterSpacing: 6, color: T.gray}}>LOOP</div>
        <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 64, color, filter: glowF(color, 8)}}>×{count}</div>
      </div>
      {nodes.map((n, i) => {
        const na = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
        const isHot = hot === i;
        const o = clamp01((f - at - 10 - i * 5) / 8);
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: s + Math.cos(na) * r,
              top: s + Math.sin(na) * r,
              transform: `translate(-50%, -50%) scale(${isHot ? 1.15 : 1})`,
              opacity: o,
              padding: '10px 28px',
              borderRadius: 36,
              border: `2px solid ${isHot ? T.red : color}`,
              background: isHot ? T.red : T.bg,
              boxShadow: `0 0 14px ${isHot ? T.red : color}88`,
              fontFamily: TF.sans,
              fontSize: 38,
              color: isHot ? '#fff' : T.white,
              whiteSpace: 'nowrap',
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

/** 毫秒条：每行一个标签 + 一条从左长出的色条 + 毫秒数（max 是满格对应的毫秒，digits 小数位，labelW 标签栏宽，unit 单位如 μs） */
export const MsBars: React.FC<{f: number; at: number; rows: [string, number, string][]; max: number; w?: number; digits?: number; labelW?: number; unit?: string}> = ({f, at, rows, max, w = 900, digits = 0, labelW = 220, unit = 'ms'}) => (
  <div style={{width: w + labelW + 240}}>
    {rows.map(([label, ms, color], i) => {
      const p = easeInOut(clamp01((f - at - i * 10) / 24));
      return (
        <div key={label} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26, opacity: clamp01((f - at - i * 10) / 6)}}>
          <div style={{width: labelW, textAlign: 'right', whiteSpace: 'nowrap', fontFamily: TF.sans, fontSize: 28, color: T.text}}>{label}</div>
          <div style={{position: 'relative', width: w, height: 26, background: 'rgba(200,215,225,0.06)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: (ms / max) * w * p, background: color, boxShadow: `0 0 14px ${color}`}} />
          </div>
          <div style={{width: 200, whiteSpace: 'nowrap', fontFamily: TF.mono, fontWeight: 700, fontSize: 30, color}}>{(ms * p).toFixed(digits)} {unit}</div>
        </div>
      );
    })}
  </div>
);

/** 表盘：半圆刻度 + 指针，value 0–1；label 在下方 */
export const Gauge: React.FC<{value: number; label?: string; size?: number; color?: string}> = ({value, label, size = 180, color = T.cyan}) => {
  const r = size / 2;
  const a = Math.PI + clamp01(value) * Math.PI;
  return (
    <svg width={size} height={r + 40} style={{overflow: 'visible'}}>
      <path d={`M0 ${r} A${r} ${r} 0 0 1 ${size} ${r}`} fill="none" stroke={T.faint} strokeWidth={8} />
      <path d={`M0 ${r} A${r} ${r} 0 0 1 ${r + Math.cos(a) * r} ${r + Math.sin(a) * r}`} fill="none" stroke={color} strokeWidth={8} style={{filter: glowF(color, 5)}} />
      <line x1={r} y1={r} x2={r + Math.cos(a) * r * 0.82} y2={r + Math.sin(a) * r * 0.82} stroke="#fff" strokeWidth={4} />
      <circle cx={r} cy={r} r={7} fill="#fff" />
      {label ? (
        <text x={r} y={r + 34} textAnchor="middle" fontFamily={TF.sans} fontSize={20} fill={T.gray}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};

/** 段位晶石（原创图形）：发光六边形底座 + 菱形晶体 + 三道底纹；color 决定段位色 */
export const RankGem: React.FC<{size?: number; color?: string; f?: number}> = ({size = 200, color = '#5fd0f0', f = 0}) => {
  const s = size / 2;
  const hex = Array.from({length: 6}, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return `${s + Math.cos(a) * s * 0.92},${s + Math.sin(a) * s * 0.92}`;
  }).join(' ');
  const pulse = 0.8 + 0.2 * Math.sin(f / 12);
  return (
    <svg width={size} height={size} style={{overflow: 'visible', filter: glowF(color, 14 * pulse)}}>
      <polygon points={hex} fill="rgba(10,30,45,0.85)" stroke={color} strokeWidth={4} />
      <polygon points={`${s},${s * 0.32} ${s * 1.38},${s * 0.86} ${s},${s * 1.36} ${s * 0.62},${s * 0.86}`} fill={color} opacity={0.9} />
      <polygon points={`${s},${s * 0.32} ${s * 1.38},${s * 0.86} ${s},${s * 0.95}`} fill="#ffffff" opacity={0.35} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${s * 0.6} ${s * (1.48 + i * 0.12)} L${s} ${s * (1.62 + i * 0.12)} L${s * 1.4} ${s * (1.48 + i * 0.12)}`} fill="none" stroke={color} strokeWidth={4} opacity={0.8 - i * 0.2} />
      ))}
    </svg>
  );
};

/** 散点 + 平均线：几组数据左右排开（组间竖虚线分隔），点依次出现，avgAt 帧后画出各组平均线并标数值 */
export const ScatterAvg: React.FC<{f: number; at: number; groups: {label: string; values: number[]}[]; w?: number; h?: number; min: number; max: number; avgAt?: number}> = ({f, at, groups, w = 1100, h = 380, min, max, avgAt}) => {
  const gw = w / groups.length;
  const Y = (v: number) => h - ((v - min) / (max - min)) * h;
  return (
    <svg width={w} height={h + 40} style={{overflow: 'visible'}}>
      {groups.map((g, gi) => {
        const avg = g.values.reduce((a, b) => a + b, 0) / g.values.length;
        const ap = avgAt === undefined ? 0 : drawLen(f, avgAt + gi * 8, 20);
        return (
          <g key={g.label}>
            {gi > 0 && <line x1={gi * gw} x2={gi * gw} y1={-20} y2={h} stroke={T.faint} strokeDasharray="4 8" />}
            <text x={gi * gw + gw / 2} y={-30} textAnchor="middle" fontFamily={TF.sans} fontSize={22} fill={T.text}>
              {g.label}
            </text>
            {g.values.map((v, i) =>
              f >= at + (gi * g.values.length + i) * 1.2 ? <circle key={i} cx={gi * gw + 30 + (i / (g.values.length - 1)) * (gw - 60)} cy={Y(v)} r={6} fill={T.cyan} style={{filter: glowF(T.cyan, 4)}} /> : null,
            )}
            {ap > 0 && (
              <g>
                <line x1={gi * gw + 20} x2={gi * gw + 20 + (gw - 40) * ap} y1={Y(avg)} y2={Y(avg)} stroke={T.green} strokeWidth={3} style={{filter: glowF(T.green, 5)}} />
                <text x={gi * gw + gw / 2} y={Y(avg) - 16} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.green} opacity={ap}>
                  平均 {avg.toFixed(2)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
