import React from 'react';
import {clamp01, easeOut} from '../anim';
import {gauss} from './charts';
import {glowF, T, TF} from './theme';

/**
 * 移动与精度示意（ep40 起）：
 * SpeedCurve 速度—时间曲线（多条依次画出；|速度| < thresh 的一条横带涂绿 =「站稳了」；markers 竖虚线标时刻；win 高亮一段时间窗）；
 * SpreadTarget 弹孔散布靶（剪影人靶 + 散布圈 + 弹孔一颗颗落下，r 越大越散）。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素。
 */

/** labelT：标签贴在曲线上哪个时刻（秒），不给就贴在曲线末端 */
export type CurveSpec = {data: number[]; color: string; at: number; dur?: number; label?: string; width?: number; labelT?: number; labelDy?: number};
export type CurveMark = {t: number; label: string; color: string; at: number; up?: boolean};

export const SpeedCurve: React.FC<{
  f: number;
  curves: CurveSpec[];
  dt: number;
  tMax: number;
  vMax: number;
  vMin?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  thresh?: number;
  threshLabel?: string;
  marks?: CurveMark[];
  win?: {t0: number; t1: number; at: number; label: string};
  tickStep?: number;
}> = ({f, curves, dt, tMax, vMax, vMin = 0, x = 260, y = 220, w = 1400, h = 520, thresh, threshLabel = '站稳了（准）', marks = [], win, tickStep = 0.1}) => {
  const sx = (t: number) => x + (t / tMax) * w;
  const sy = (v: number) => y + ((vMax - v) / (vMax - vMin)) * h;
  const ticks = Array.from({length: Math.floor(tMax / tickStep + 1e-6) + 1}, (_, i) => i * tickStep);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {thresh !== undefined ? (
        <g>
          <rect x={x} y={sy(thresh)} width={w} height={sy(Math.max(vMin, -thresh)) - sy(thresh)} fill="rgba(62,207,142,0.14)" />
          <line x1={x} x2={x + w} y1={sy(thresh)} y2={sy(thresh)} stroke={T.green} strokeWidth={2} strokeDasharray="10 8" />
          <text x={x + w - 12} y={sy(thresh) - 12} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.green}>
            {threshLabel}
          </text>
        </g>
      ) : null}
      {win ? (
        <g opacity={clamp01((f - win.at) / 8)}>
          <rect x={sx(win.t0)} y={y} width={Math.max(4, sx(win.t1) - sx(win.t0))} height={h} fill="rgba(240,160,69,0.22)" stroke={T.orange} strokeWidth={2} />
          <text x={sx(win.t1) + 14} y={y + 110} fontFamily={TF.sans} fontSize={30} fill={T.orange} style={{filter: glowF(T.orange, 6)}}>
            {win.label}
          </text>
        </g>
      ) : null}
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x + w} y1={sy(Math.max(0, vMin))} y2={sy(Math.max(0, vMin))} stroke={T.faint} strokeWidth={2} />
      {ticks.map((t) => (
        <text key={t} x={sx(t)} y={y + h + 36} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
          {t.toFixed(1)}
        </text>
      ))}
      <text x={x + w} y={y + h + 70} textAnchor="end" fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        时间（秒）
      </text>
      <text x={x - 16} y={y - 16} fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        速度
      </text>
      {curves.map((c, i) => {
        const p = clamp01((f - c.at) / (c.dur ?? 30));
        const n = Math.max(2, Math.ceil(p * (c.data.length - 1)) + 1);
        const pts = c.data.slice(0, n).map((v, k) => `${k ? 'L' : 'M'}${sx(k * dt).toFixed(1)} ${sy(Math.max(vMin, v)).toFixed(1)}`);
        if (f < c.at) return null;
        const last = c.data[n - 1];
        return (
          <g key={i}>
            <path d={pts.join(' ')} fill="none" stroke={c.color} strokeWidth={c.width ?? 5} style={{filter: glowF(c.color, 6)}} />
            <circle cx={sx((n - 1) * dt)} cy={sy(Math.max(vMin, last))} r={9} fill="#fff" style={{filter: glowF(c.color, 10)}} />
            {c.label && p >= 1 ? (
              <text
                x={sx(c.labelT ?? (n - 1) * dt) + 18}
                y={sy(Math.max(vMin, c.labelT === undefined ? last : c.data[Math.min(c.data.length - 1, Math.round(c.labelT / dt))])) + (c.labelDy ?? (i % 2 ? 40 : -18))}
                fontFamily={TF.sans}
                fontSize={28}
                fill={c.color}
              >
                {c.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {marks.map((m, i) => {
        const o = clamp01((f - m.at) / 8);
        if (o <= 0) return null;
        return (
          <g key={i} opacity={o}>
            <line x1={sx(m.t)} x2={sx(m.t)} y1={y} y2={y + h} stroke={m.color} strokeWidth={2} strokeDasharray="6 6" />
            <text x={sx(m.t) + 10} y={m.up ? y + 30 : y + h - 20} fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={m.color} style={{filter: glowF(m.color, 5)}}>
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * 弹孔散布靶：深色圆靶里一个剪影人靶（头 + 身体），虚线圈是散布范围 r，弹孔从 at 起每 per 帧落一颗；
 * hitHead 统计落在头上的弹孔，headLabel 给了就在下面显示「爆头 k / n」
 */
export const SpreadTarget: React.FC<{f: number; at: number; x: number; y: number; r: number; n?: number; per?: number; seed?: number; color?: string; label?: string; sub?: string; size?: number; headLabel?: boolean}> = ({
  f,
  at,
  x,
  y,
  r,
  n = 8,
  per = 4,
  seed = 7,
  color = T.cyan,
  label,
  sub,
  size = 200,
  headLabel = false,
}) => {
  const hy = y - size * 0.42;
  const hr = size * 0.13;
  const holes = Array.from({length: n}, (_, i) => [x + gauss(seed + i * 1.7) * r * 0.5, hy + gauss(seed + i * 2.9 + 0.3) * r * 0.5] as const);
  const shown = f < at ? 0 : Math.min(n, Math.floor((f - at) / per) + 1);
  const heads = holes.slice(0, shown).filter(([hx, hyy]) => (hx - x) ** 2 + (hyy - hy) ** 2 < hr * hr).length;
  const ring = easeOut(clamp01((f - at) / 12));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={x} cy={y - size * 0.2} r={size} fill="rgba(10,19,34,0.85)" stroke={T.faint} strokeWidth={2} />
      <circle cx={x} cy={hy} r={hr} fill="none" stroke={T.red} strokeWidth={4} />
      <rect x={x - size * 0.2} y={hy + hr * 1.3} width={size * 0.4} height={size * 0.75} rx={size * 0.2} fill="none" stroke={T.red} strokeWidth={4} />
      <circle cx={x} cy={hy} r={Math.max(4, r * ring)} fill="none" stroke={color} strokeWidth={3} strokeDasharray="10 8" opacity={0.85} />
      {holes.slice(0, shown).map(([hx, hyy], i) => (
        <g key={i}>
          <circle cx={hx} cy={hyy} r={9} fill="#fff6d8" style={{filter: glowF('#ffd27a', 6)}} />
          <circle cx={hx} cy={hyy} r={4} fill="#1a1208" />
        </g>
      ))}
      {label ? (
        <text x={x} y={y + size * 0.95} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={color}>
          {label}
        </text>
      ) : null}
      {sub ? (
        <text x={x} y={y + size * 0.95 + 42} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
          {sub}
        </text>
      ) : null}
      {headLabel && shown > 0 ? (
        <text x={x} y={y - size * 1.28} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={heads ? T.orange : T.red}>
          爆头 {heads} / {shown}
        </text>
      ) : null}
    </svg>
  );
};
