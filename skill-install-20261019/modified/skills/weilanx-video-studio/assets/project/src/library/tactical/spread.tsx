import React from 'react';
import {clamp01, easeOut, rand} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 散布 / 点射示意（ep42 起）：
 * heatAt 散布「热度」模型（每枪 +1，停下来后在 recover 内线性降回 0）；
 * BloomRing 散布圈随热度变大、弹孔在当时的圈里均匀落下（可画一个头当靶子）；
 * HeatTrace 热度—时间曲线（开枪刻度 + 恢复时间标尺）；
 * AreaRatio 面积题：头圆 vs 散布圈，命中率 =（头 ÷ 圈）²；
 * HitBars 分组命中率条（每组两根：比如第一发 vs 扫射后段）。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素；时间单位跟着调用方（帧或秒）。
 */

/** 散布热度：shots 是开枪时刻（升序），recover 是恢复时间；返回 t 时刻的热度 */
export const heatAt = (shots: number[], t: number, recover: number) => {
  let h = 0;
  let last = -Infinity;
  for (const s of shots) {
    if (s > t) break;
    h = h * Math.max(0, 1 - (s - last) / recover) + 1;
    last = s;
  }
  return last === -Infinity ? 0 : h * Math.max(0, 1 - (t - last) / recover);
};

/** 圆盘内均匀分布的确定性随机点（单位圆） */
export const diskPoint = (seed: number): [number, number] => {
  const a = rand(seed) * Math.PI * 2;
  const r = Math.sqrt(rand(seed + 0.37));
  return [Math.cos(a) * r, Math.sin(a) * r];
};

/**
 * 散布圈：半径 = base + per × 热度（热度取开枪前那一刻，第一发 = base）；每颗弹孔落在开枪当时的圈里（均匀）；
 * head 给了就在圈心画一个红色头圈当靶子，并统计命中数（hitLabel）
 */
export const BloomRing: React.FC<{f: number; shots: number[]; x: number; y: number; base: number; per: number; recover: number; seed?: number; color?: string; head?: number; hitLabel?: boolean}> = ({
  f,
  shots,
  x,
  y,
  base,
  per,
  recover,
  seed = 5,
  color = T.cyan,
  head,
  hitLabel = false,
}) => {
  const fired = shots.filter((s) => s <= f);
  const r = base + per * heatAt(shots, f, recover);
  const holes = fired.map((s, i) => {
    const rs = base + per * heatAt(shots, s - 1e-6, recover);
    const [u, v] = diskPoint(seed + i * 1.91);
    return [x + u * rs, y + v * rs] as const;
  });
  const hits = head ? holes.filter(([hx, hy]) => (hx - x) ** 2 + (hy - y) ** 2 < head * head).length : 0;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {head ? <circle cx={x} cy={y} r={head} fill="rgba(229,80,91,0.18)" stroke={T.red} strokeWidth={4} /> : null}
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray="12 8" style={{filter: glowF(color, 6)}} />
      <line x1={x - 14} x2={x + 14} y1={y} y2={y} stroke={T.white} strokeWidth={2} opacity={0.6} />
      <line x1={x} x2={x} y1={y - 14} y2={y + 14} stroke={T.white} strokeWidth={2} opacity={0.6} />
      {holes.map(([hx, hy], i) => (
        <g key={i} opacity={clamp01((f - fired[i]) / 2 + 0.5)}>
          <circle cx={hx} cy={hy} r={9} fill="#fff6d8" style={{filter: glowF('#ffd27a', 6)}} />
          <circle cx={hx} cy={hy} r={4} fill="#1a1208" />
        </g>
      ))}
      {hitLabel && head && fired.length ? (
        <text x={x} y={y - Math.max(r, head) - 30} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={hits ? T.orange : T.red}>
          命中 {hits} / {fired.length}
        </text>
      ) : null}
    </svg>
  );
};

/** 热度—时间曲线：x 是时间（tMax 跨 w 像素），开枪处一根竖刻度；recoverMark 画一段「恢复时间」标尺 */
export const HeatTrace: React.FC<{f: number; shots: number[]; recover: number; tMax: number; x?: number; y?: number; w?: number; h?: number; hMax?: number; color?: string; label?: string; recoverMark?: {from: number; label: string; at: number}}> = ({
  f,
  shots,
  recover,
  tMax,
  x = 960,
  y = 300,
  w = 760,
  h = 360,
  hMax = 6,
  color = T.cyan,
  label = '散布（示意）',
  recoverMark,
}) => {
  const N = 160;
  const sx = (t: number) => x + (t / tMax) * w;
  const sy = (v: number) => y + h - (Math.min(v, hMax) / hMax) * h;
  const pts = Array.from({length: N + 1}, (_, i) => (i / N) * tMax).filter((t) => t <= f);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <text x={x} y={y - 18} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        {label}
      </text>
      <text x={x + w} y={y + h + 40} textAnchor="end" fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        时间 →
      </text>
      {shots
        .filter((s) => s <= f)
        .map((s, i) => (
          <line key={i} x1={sx(s)} x2={sx(s)} y1={y + h} y2={y + h + 16} stroke={T.orange} strokeWidth={3} />
        ))}
      {pts.length > 1 ? <path d={pts.map((t, i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(heatAt(shots, t, recover)).toFixed(1)}`).join(' ')} fill="none" stroke={color} strokeWidth={4} style={{filter: glowF(color, 5)}} /> : null}
      {recoverMark && f >= recoverMark.at ? (
        <g opacity={clamp01((f - recoverMark.at) / 8)}>
          <path d={`M${sx(recoverMark.from)} ${y + h + 40} v-10 H${sx(recoverMark.from + recover)} v10`} fill="none" stroke={T.green} strokeWidth={3} />
          <text x={(sx(recoverMark.from) + sx(recoverMark.from + recover)) / 2} y={y + h + 76} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.green}>
            {recoverMark.label}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

/** 面积题：红色头圈（半径 head）+ 青色散布圈（半径 spread 从 from 长到 to），下方写命中率 =（头 ÷ 圈）² */
export const AreaRatio: React.FC<{f: number; at: number; x: number; y: number; head: number; from: number; to: number; growAt?: number; label?: string}> = ({f, at, x, y, head, from, to, growAt, label}) => {
  const g = growAt === undefined ? 0 : easeOut(clamp01((f - growAt) / 20));
  const s = from + (to - from) * g;
  const p = Math.min(1, (head / s) ** 2);
  const o = clamp01((f - at) / 8);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <circle cx={x} cy={y} r={s} fill="rgba(66,198,223,0.1)" stroke={T.cyan} strokeWidth={4} strokeDasharray="12 8" style={{filter: glowF(T.cyan, 6)}} />
      <circle cx={x} cy={y} r={head} fill="rgba(229,80,91,0.35)" stroke={T.red} strokeWidth={4} />
      <text x={x} y={y + Math.max(s, head) + 60} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={T.white}>
        命中率 ≈ {Math.round(p * 100)}%
      </text>
      {label ? (
        <text x={x} y={y - Math.max(s, head) - 30} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.gray}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};

/** 分组命中率条：groups[i] = [组名, a 值, b 值]（百分数），两根柱子一组，at 起逐组长出 */
export const HitBars: React.FC<{f: number; at: number; groups: (readonly [string, number, number])[]; names: [string, string]; colors?: [string, string]; x?: number; y?: number; w?: number; h?: number; per?: number}> = ({
  f,
  at,
  groups,
  names,
  colors = [T.cyan, T.red],
  x = 360,
  y = 240,
  w = 1200,
  h = 420,
  per = 8,
}) => {
  const gw = w / groups.length;
  const bw = gw * 0.28;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      {names.map((n, i) => (
        <g key={n}>
          <rect x={x + w - 360 + i * 190} y={y - 46} width={22} height={22} fill={colors[i]} />
          <text x={x + w - 328 + i * 190} y={y - 27} fontFamily={TF.sans} fontSize={24} fill={T.text}>
            {n}
          </text>
        </g>
      ))}
      {groups.map(([name, a, b], gi) => {
        const p = easeOut(clamp01((f - at - gi * per) / 16));
        const cx = x + gi * gw + gw / 2;
        return (
          <g key={name} opacity={clamp01((f - at - gi * per) / 6)}>
            {[a, b].map((v, k) => {
              const bh = (v / 100) * h * p;
              const bx = cx + (k ? 8 : -bw - 8);
              return (
                <g key={k}>
                  <rect x={bx} y={y + h - bh} width={bw} height={bh} fill={colors[k]} style={{filter: glowF(colors[k], 6)}} />
                  <text x={bx + bw / 2} y={y + h - bh - 14} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={28} fill={colors[k]}>
                    {Math.round(v * p)}%
                  </text>
                </g>
              );
            })}
            <text x={cx} y={y + h + 44} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.text}>
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
