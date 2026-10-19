import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 时间窗示意（ep48 起）：
 * WindowLanes 毫秒轴上的几条泳道，每条是一段 [from, to] 的色块（「他露出来」「你屏幕上看到」「你的反应」），marks 是竖线标记（「你开枪」）；
 * ReactionTest 反应测试屏：灰色方块 litAt 帧亮绿 +「按！」，下方毫秒计数从 0 数到 ms（stopAt 帧数完，慢放显示）。
 * 都画在整屏 1920×1080 的 SVG / 绝对定位里，坐标是屏幕像素；动画只看帧号。
 */

export type Lane = {label: string; from: number; to: number; color: string; at: number; dashed?: boolean; note?: string};
export type LaneMark = {t: number; label: string; color: string; at: number};

export const WindowLanes: React.FC<{f: number; rows: Lane[]; marks?: LaneMark[]; tMax: number; x?: number; y?: number; w?: number; rowH?: number; gap?: number; labelW?: number; ticks?: number[]}> = ({
  f,
  rows,
  marks = [],
  tMax,
  x = 520,
  y = 300,
  w = 1160,
  rowH = 64,
  gap = 46,
  labelW = 300,
  ticks = [],
}) => {
  const px = (ms: number) => x + (ms / tMax) * w;
  const bottom = y + rows.length * (rowH + gap) - gap;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x} x2={x + w} y1={bottom + 26} y2={bottom + 26} stroke={T.faint} strokeWidth={2} />
      {[0, ...ticks].map((t) => (
        <g key={t}>
          <line x1={px(t)} x2={px(t)} y1={bottom + 18} y2={bottom + 34} stroke={T.faint} strokeWidth={2} />
          <text x={px(t)} y={bottom + 68} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
            {t}
          </text>
        </g>
      ))}
      <text x={x + w} y={bottom + 68} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.dim}>
        ms
      </text>
      {rows.map((r, i) => {
        const yy = y + i * (rowH + gap);
        const p = easeOut(clamp01((f - r.at) / 14));
        const o = clamp01((f - r.at) / 6);
        const x0 = px(r.from);
        const bw = (px(r.to) - x0) * p;
        return (
          <g key={i} opacity={o}>
            <text x={x - 30} y={yy + rowH / 2 + 12} textAnchor="end" fontFamily={TF.sans} fontSize={34} fill={r.color}>
              {r.label}
            </text>
            <rect x={x} y={yy} width={w} height={rowH} fill="rgba(200,215,225,0.04)" />
            <rect x={x0} y={yy} width={Math.max(2, bw)} height={rowH} fill={r.dashed ? 'none' : r.color} stroke={r.color} strokeWidth={r.dashed ? 3 : 0} strokeDasharray={r.dashed ? '12 8' : undefined} opacity={r.dashed ? 1 : 0.85} style={r.dashed ? undefined : {filter: glowF(r.color, 6)}} />
            {r.note && p >= 1 ? (
              <text x={x0 + bw / 2} y={yy + rowH / 2 + 11} textAnchor="middle" fontFamily={TF.sans} fontSize={28} fill={r.dashed ? r.color : '#06121a'}>
                {r.note}
              </text>
            ) : null}
          </g>
        );
      })}
      {marks.map((m, i) => {
        const o = clamp01((f - m.at) / 6);
        return (
          <g key={i} opacity={o}>
            <line x1={px(m.t)} x2={px(m.t)} y1={y - 30} y2={bottom + 10} stroke={m.color} strokeWidth={5} style={{filter: glowF(m.color, 8)}} />
            <text x={px(m.t)} y={y - 44} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={m.color}>
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** 反应测试屏：litAt 前是灰的，之后亮绿写「按！」；计数在 litAt 到 stopAt 之间从 0 数到 ms（慢放），之后停住 */
export const ReactionTest: React.FC<{f: number; at: number; litAt: number; stopAt: number; ms: number; x?: number; y?: number; size?: number}> = ({f, at, litAt, stopAt, ms, x = 960, y = 440, size = 360}) => {
  const lit = f >= litAt;
  const n = Math.round(ms * clamp01((f - litAt) / Math.max(1, stopAt - litAt)));
  const o = clamp01((f - at) / 8);
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, opacity: o}}>
      <div style={{width: size, height: size, borderRadius: 24, background: lit ? T.green : '#2a3138', boxShadow: lit ? `0 0 60px ${T.green}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontSize: 96, color: lit ? '#06140c' : T.gray}}>
        {lit ? '按！' : '等…'}
      </div>
      <div style={{marginTop: 30, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 72, color: lit ? T.white : T.dim, filter: lit ? glowF(T.white, 4) : undefined}}>{lit ? `${n} ms` : '— ms'}</div>
    </div>
  );
};
