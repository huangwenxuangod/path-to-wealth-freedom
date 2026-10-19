import React from 'react';
import {clamp01, easeOut, rand} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 练习示意（ep51 起）：
 * AimGrid 原创靶场点靶网格：cols × rows 个圆靶，每 per 帧亮一个（rand 选位置），亮起几帧后被打掉（白闪 + 碎环），右上角计数；
 * TimeBlocks 练习排布条：一条时间轴上若干练习块（[开始, 长度]，单位任意），块之间的空隙可标月亮（隔夜），progress 0–1 让块从左往右长出来。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素；动画只看帧号。
 */

export const AimGrid: React.FC<{f: number; at: number; per?: number; cols?: number; rows?: number; x?: number; y?: number; w?: number; h?: number; seed?: number; color?: string; count0?: number}> = ({f, at, per = 8, cols = 7, rows = 4, x = 360, y = 280, w = 1200, h = 480, seed = 3, color = T.red, count0 = 0}) => {
  const t = f - at;
  const n = Math.max(0, Math.floor(t / per));
  const cur = Math.floor(rand(seed * 100 + n) * cols * rows);
  const local = t - n * per;
  const cw = w / cols;
  const ch = h / rows;
  const r = Math.min(cw, ch) * 0.28;
  const pos = (k: number): [number, number] => [x + (k % cols) * cw + cw / 2, y + Math.floor(k / cols) * ch + ch / 2];
  const [cx, cy] = pos(cur);
  const hitAt = Math.round(per * 0.55);
  const hit = local >= hitAt;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <rect x={x} y={y} width={w} height={h} fill="rgba(10,19,34,0.6)" stroke={T.faint} strokeWidth={2} />
      {Array.from({length: cols * rows}, (_, k) => {
        const [px, py] = pos(k);
        return <circle key={k} cx={px} cy={py} r={r * 0.35} fill="none" stroke={T.faint} strokeWidth={2} />;
      })}
      {t >= 0 && !hit ? <circle cx={cx} cy={cy} r={r * easeOut(clamp01(local / 2))} fill={color} style={{filter: glowF(color, 8)}} /> : null}
      {t >= 0 && hit ? (
        <g opacity={1 - clamp01((local - hitAt) / 3)}>
          <circle cx={cx} cy={cy} r={r * 1.2} fill="none" stroke={T.white} strokeWidth={4} />
          <circle cx={cx} cy={cy} r={r * 0.5} fill={T.white} />
        </g>
      ) : null}
      {t >= 0 ? (
        <g stroke={T.cyan} strokeWidth={3} style={{filter: glowF(T.cyan, 3)}}>
          <line x1={cx - 30} x2={cx - 10} y1={cy} y2={cy} />
          <line x1={cx + 10} x2={cx + 30} y1={cy} y2={cy} />
          <line x1={cx} x2={cx} y1={cy - 30} y2={cy - 10} />
          <line x1={cx} x2={cx} y1={cy + 10} y2={cy + 30} />
        </g>
      ) : null}
      <text x={x + w - 16} y={y - 18} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={T.white}>
        命中 {count0 + n + (hit ? 1 : 0)}
      </text>
    </svg>
  );
};

export type Block = [number, number];

export const TimeBlocks: React.FC<{blocks: Block[]; span: number; x?: number; y?: number; w?: number; h?: number; color?: string; label?: string; progress?: number; moons?: boolean; note?: string}> = ({blocks, span, x = 520, y = 400, w = 1160, h = 70, color = T.cyan, label, progress = 1, moons = false, note}) => {
  const px = (u: number) => x + (u / span) * w;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {label ? (
        <text x={x - 30} y={y + h / 2 + 12} textAnchor="end" fontFamily={TF.sans} fontSize={34} fill={color}>
          {label}
        </text>
      ) : null}
      <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke={T.faint} strokeWidth={2} strokeDasharray="8 8" />
      {blocks.map(([s, len], i) => {
        const p = clamp01(progress * blocks.length - i);
        return p > 0 ? <rect key={i} x={px(s)} y={y} width={Math.max(3, (px(s + len) - px(s)) * p)} height={h} rx={8} fill={color} opacity={0.85} style={{filter: glowF(color, 6)}} /> : null;
      })}
      {moons
        ? blocks.slice(0, -1).map(([s, len], i) => {
            const g0 = s + len;
            const g1 = blocks[i + 1][0];
            const mx = (px(g0) + px(g1)) / 2;
            return clamp01(progress * blocks.length - i - 1) > 0 && px(g1) - px(g0) > 40 ? <path key={i} d={`M${mx + 6} ${y + 10} a18 18 0 1 0 12 30 a14 14 0 1 1 -12 -30 z`} fill={T.orange} opacity={0.9} /> : null;
          })
        : null}
      {note ? (
        <text x={x + w} y={y + h + 44} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
          {note}
        </text>
      ) : null}
    </svg>
  );
};
