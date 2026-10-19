import React from 'react';
import {clamp01, easeOut, rand} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 睡眠 / 清醒示意（ep50 起）：
 * AwakeDial 24 小时表盘：从起床的钟点 from 顺时针画到现在（from + awake 小时），超过 warn 小时的那一段变红，中间写「已醒 N 小时」和钟点；
 * LapseStrip 一条清醒时间轴：每一小竖线是一次「断线」（示意），超过 threshold 小时后越来越密，at 起 dur 帧从左往右画出。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素；动画只看帧号。
 */

const hourXY = (cx: number, cy: number, r: number, h: number): [number, number] => {
  const a = -Math.PI / 2 + ((h % 24) / 24) * Math.PI * 2;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
};
const arc = (cx: number, cy: number, r: number, h0: number, h1: number) => {
  if (h1 <= h0) return '';
  const [x0, y0] = hourXY(cx, cy, r, h0);
  const [x1, y1] = hourXY(cx, cy, r, h1);
  const large = h1 - h0 > 12 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
const clock = (h: number) => `${String(Math.floor(h % 24)).padStart(2, '0')}:${String(Math.round((h % 1) * 60) % 60).padStart(2, '0')}`;

export const AwakeDial: React.FC<{x?: number; y?: number; r?: number; from: number; awake: number; warn?: number; label?: string}> = ({x = 960, y = 470, r = 230, from, awake, warn = 16, label = '已醒'}) => {
  const now = from + awake;
  const mid = Math.min(now, from + warn);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={x} cy={y} r={r} fill="rgba(10,19,34,0.8)" stroke={T.faint} strokeWidth={28} />
      {Array.from({length: 24}, (_, h) => {
        const [ax, ay] = hourXY(x, y, r + 30, h);
        const [bx, by] = hourXY(x, y, r + (h % 6 ? 40 : 52), h);
        return (
          <g key={h}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={T.gray} strokeWidth={h % 6 ? 2 : 4} />
            {h % 6 === 0 ? (
              <text x={hourXY(x, y, r + 82, h)[0]} y={hourXY(x, y, r + 82, h)[1] + 10} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.gray}>
                {h}
              </text>
            ) : null}
          </g>
        );
      })}
      <path d={arc(x, y, r, from, mid)} fill="none" stroke={T.cyan} strokeWidth={28} style={{filter: glowF(T.cyan, 8)}} />
      <path d={arc(x, y, r, from + warn, now)} fill="none" stroke={T.red} strokeWidth={28} style={{filter: glowF(T.red, 10)}} />
      <circle cx={hourXY(x, y, r, from)[0]} cy={hourXY(x, y, r, from)[1]} r={10} fill={T.white} />
      <text x={x} y={y - 40} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={T.gray}>
        {label}
      </text>
      <text x={x} y={y + 40} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={110} fill={awake > warn ? T.red : T.white} style={{filter: glowF(awake > warn ? T.red : T.white, 6)}}>
        {Math.floor(awake)}h
      </text>
      <text x={x} y={y + 100} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={34} fill={T.text}>
        {clock(from)} → {clock(now)}
      </text>
    </svg>
  );
};

export const LapseStrip: React.FC<{f: number; at: number; hours?: number; threshold: number; x?: number; y?: number; w?: number; h?: number; dur?: number; seed?: number}> = ({f, at, hours = 24, threshold, x = 260, y = 420, w = 1400, h = 120, dur = 60, seed = 7}) => {
  const p = clamp01((f - at) / dur);
  const px = (hr: number) => x + (hr / hours) * w;
  const lines: number[] = [];
  for (let i = 0; i < 480; i++) {
    const hr = (i / 480) * hours;
    const dens = 0.012 + Math.max(0, hr - threshold) * 0.07;
    if (rand(seed * 1000 + i) < dens) lines.push(hr);
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <rect x={x} y={y} width={w} height={h} fill="rgba(62,207,142,0.12)" />
      <rect x={x} y={y} width={w * p} height={h} fill="rgba(62,207,142,0.18)" />
      {lines
        .filter((hr) => hr / hours <= p)
        .map((hr, i) => (
          <line key={i} x1={px(hr)} x2={px(hr)} y1={y - 6} y2={y + h + 6} stroke={hr > threshold ? T.red : T.orange} strokeWidth={4} style={{filter: glowF(T.red, 3)}} />
        ))}
      <line x1={px(threshold)} x2={px(threshold)} y1={y - 40} y2={y + h + 40} stroke={T.white} strokeWidth={3} strokeDasharray="10 8" opacity={easeOut(clamp01((f - at - 10) / 10))} />
      {[0, 8, 16, 24].map((hr) => (
        <text key={hr} x={px(hr)} y={y + h + 56} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.gray}>
          {hr}h
        </text>
      ))}
      <text x={x + w} y={y + h + 96} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        醒着的小时数 →
      </text>
    </svg>
  );
};
