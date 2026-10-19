import React from 'react';
import {clamp01, easeOut} from '../anim';
import {PixelBuddy} from '../character/PixelBuddy';
import type {Eyes} from '../character/types';
import {D} from './theme';

/**
 * 暖纸工作台风的吉祥物：素材库自己的像素小人（CC），常驻右下角，轻微上下浮动，随内容换表情；
 * PixelEmote 是头顶冒出的像素小反应。
 */

/** 右下角吉祥物：x / y 是脚底中心；eyes 表情；hop 帧跳一下；s 缩放 */
export const DeskMascot: React.FC<{f: number; x?: number; y?: number; s?: number; eyes?: Eyes; hop?: number; lookX?: number; armsUp?: number}> = ({f, x = 1640, y = 990, s = 0.95, eyes = 'open', hop, lookX = 0, armsUp = 0}) => {
  const bob = Math.round(Math.sin(f / 16) * 1.5) * 2;
  const ht = hop === undefined ? -1 : f - hop;
  const jump = ht >= 0 && ht < 14 ? Math.sin((ht / 14) * Math.PI) * 26 : 0;
  // 每 120 帧眨一次眼
  const blink = eyes === 'open' && f % 120 >= 116;
  return (
    <svg width={400} height={400} style={{position: 'absolute', left: x - 200, top: y - 360, overflow: 'visible', pointerEvents: 'none'}}>
      <ellipse cx={200} cy={362} rx={70 * s * 1.6} ry={8} fill="rgba(70,55,35,0.12)" />
      <g transform={`translate(200 ${360 - bob - jump}) scale(${s})`}>
        <PixelBuddy eyes={blink ? 'closed' : eyes} lookX={lookX} armsUp={armsUp} t={f} />
      </g>
    </svg>
  );
};

const PIX: Record<string, string[]> = {
  '!': ['.##.', '.##.', '.##.', '.##.', '....', '.##.'],
  '?': ['.###.', '#...#', '...#.', '..#..', '.....', '..#..'],
  note: ['..###', '..#.#', '..#..', '###..', '###..'],
  dots: ['#.#.#'],
};

/** 像素小反应：kind '!' '?' 'note' 'dots'，at 帧在 (x, y) 冒出来、上浮、40 帧后消失 */
export const PixelEmote: React.FC<{f: number; at: number; kind: '!' | '?' | 'note' | 'dots'; x: number; y: number; px?: number; color?: string; dur?: number}> = ({f, at, kind, x, y, px = 7, color = D.ink, dur = 40}) => {
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const pin = easeOut(clamp01(t / 6));
  const o = 1 - clamp01((t - dur + 10) / 10);
  const rows = PIX[kind];
  return (
    <svg width={rows[0].length * px} height={rows.length * px} style={{position: 'absolute', left: x, top: y - t * 0.5 - (1 - pin) * 10, opacity: o * pin, overflow: 'visible'}} shapeRendering="crispEdges">
      {rows.flatMap((r, j) => [...r].map((c, i) => (c === '#' ? <rect key={`${i}-${j}`} x={i * px} y={j * px} width={px} height={px} fill={color} /> : null)))}
    </svg>
  );
};
