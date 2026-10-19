import React from 'react';
import type {Eyes} from './types';
import type {Wear} from './Accessories';

/**
 * 像素风小人。画布 22 列 × 17 行，每格边长 PX：
 * - 身体：第 7–13 行，第 5–16 列（12×7）
 * - 两侧小手：第 10–11 行，第 3–4 / 17–18 列
 * - 四条腿：第 14–16 行，第 6、8、13、15 列
 * - 眼睛：第 9–10 行，第 7、14 列
 * 原点与 BuddyFigure 一致：脚底中心，身体宽 184。
 */
export const PX = 184 / 12;

export type PixelSkin = 'plain' | 'santa' | 'cowboy' | 'chef' | 'detective';

const COL: Record<string, string> = {
  O: '#D9804F', // 身体
  o: '#B8653A', // 身体暗部
  E: '#1E1E24', // 黑
  W: '#F4F4F4',
  w: '#C9CDD2',
  g: '#9AA0A8',
  G: '#5E6570',
  N: '#2E3A5C',
  R: '#D93636',
  r: '#A82525',
  Y: '#F2C230',
  P: '#6B4AA0',
  p: '#4A3278',
  B: '#8B5A36',
  b: '#A8784E',
  T: '#C9A27A',
  D: '#5C3A22',
  L: '#A8D8F0',
  U: '#4A7BD9',
  V: '#8E8FE8',
};

type Px = [number, number, number, number, string]; // 列, 行, 宽, 高, 颜色
/** 一行里从 c0 到 c1（含）的像素 */
const row = (r: number, c0: number, c1: number, c: string): Px => [c0, r, c1 - c0 + 1, 1, c];
const dot = (c: number, r: number, color: string): Px => [c, r, 1, 1, color];
const box = (c: number, r: number, w: number, h: number, color: string): Px => [c, r, w, h, color];

/** 每套皮肤画在身体上面的像素；hideNubs 表示用皮肤自己的袖子 */
const SKINS: Record<Exclude<PixelSkin, 'plain'>, Px[]> = {
  santa: [
    row(1, 11, 14, 'R'), row(2, 9, 16, 'R'), row(3, 7, 17, 'R'), row(4, 6, 18, 'R'), row(5, 5, 16, 'R'), box(17, 5, 2, 1, 'r'),
    box(18, 5, 2, 2, 'W'),
    row(6, 4, 17, 'W'), row(7, 4, 17, 'W'),
    ...[4, 6, 8, 10, 12, 14, 16].map((c) => box(c, 12, 2, 2, c % 4 === 0 ? 'R' : 'W')),
    box(16, 14, 2, 1, 'R'), box(17, 15, 1, 1, 'W'), box(17, 16, 1, 1, 'r'),
  ],
  cowboy: [
    row(3, 7, 9, 'b'), row(3, 12, 14, 'b'), row(4, 6, 15, 'b'), row(5, 6, 15, 'b'), row(6, 6, 15, 'D'),
    box(10, 5, 2, 1, 'Y'),
    row(7, 3, 18, 'B'), box(2, 6, 2, 1, 'B'), box(18, 6, 2, 1, 'B'),
    box(5, 11, 2, 3, 'B'), box(15, 11, 2, 3, 'B'),
    row(11, 7, 14, 'R'), row(12, 8, 13, 'R'), row(13, 10, 11, 'R'),
    dot(10, 12, 'Y'),
  ],
  chef: [
    row(1, 7, 14, 'W'), box(6, 2, 10, 3, 'W'), row(5, 7, 14, 'w'), row(6, 7, 14, 'W'), row(7, 6, 15, 'W'),
    dot(9, 3, 'w'), dot(12, 3, 'w'),
    box(5, 12, 12, 2, 'W'), box(3, 10, 2, 2, 'W'), box(17, 10, 2, 2, 'W'),
    row(11, 8, 13, 'R'), box(10, 12, 2, 1, 'R'),
    dot(8, 13, 'E'), dot(13, 13, 'E'),
  ],
  detective: [
    row(4, 9, 12, 'b'), row(5, 7, 14, 'B'), row(6, 6, 15, 'b'), row(7, 4, 17, 'D'),
    ...[7, 9, 11, 13].map((c) => dot(c, 5, 'b')), ...[6, 8, 10, 12, 14].map((c) => dot(c, 6, 'B')),
    dot(9, 3, 'D'), dot(12, 3, 'D'),
    box(4, 11, 14, 3, 'T'), box(3, 10, 2, 2, 'T'), box(17, 10, 2, 2, 'T'),
    row(11, 9, 12, 'b'), box(10, 11, 2, 2, 'W'), dot(10, 13, 'D'), dot(11, 13, 'D'),
    box(19, 12, 1, 4, 'D'), box(18, 8, 3, 1, 'B'), box(18, 11, 3, 1, 'B'), box(18, 9, 1, 2, 'B'), box(20, 9, 1, 2, 'B'), box(19, 9, 1, 2, 'L'),
  ],
};

/** 可以叠加在任意皮肤上的配饰 */
const WEARS: Partial<Record<Wear, Px[]>> = {
  headphones: [row(6, 5, 16, 'V'), box(4, 7, 1, 2, 'V'), box(17, 7, 1, 2, 'V'), box(3, 9, 2, 3, 'P'), box(17, 9, 2, 3, 'P')],
  santa: SKINS.santa.slice(0, 9),
  detective: SKINS.detective.slice(0, 11),
};

/** 像素眼睛：返回相对眼睛左上角 (c, 9) 的像素 */
const eyePx = (c: number, kind: Eyes, f: number): Px[] => {
  switch (kind) {
    case 'closed':
    case 'flat':
      return [box(c - (kind === 'flat' ? 1 : 0), 10, kind === 'flat' ? 3 : 2, 1, 'E')];
    case 'happy':
      return [dot(c - 1, 10, 'E'), dot(c, 9, 'E'), dot(c + 1, 10, 'E')];
    case 'wide':
      return [box(c - 1, 8, 3, 3, 'W'), box(c, 9, 1, 2, 'E')];
    case 'star':
      return [dot(c, 8, 'Y'), box(c - 1, 9, 3, 1, 'Y'), dot(c, 10, 'Y')];
    case 'heart':
      return [dot(c - 1, 9, 'R'), dot(c + 1, 9, 'R'), box(c - 1, 10, 3, 1, 'R'), dot(c, 11, 'R')];
    case 'spiral':
      return [box(c - 1, 8, 3, 1, 'E'), dot(c + 1, 9, 'E'), dot(c - 1, 9, 'E'), row(10, c - 1, c + 1, 'E'), dot(c, 9, f % 20 < 10 ? 'E' : 'O')];
    default:
      return [box(c, 9, 1, 2, 'E')];
  }
};

export interface PixelProps {
  eyes: Eyes;
  walk?: number;
  lookX?: number;
  armsUp?: number;
  skin?: PixelSkin;
  wear?: Wear[];
  t?: number;
  color?: string; // 身体颜色（灰色普通 AI 用）
}

export const PixelBuddy: React.FC<PixelProps> = ({eyes, walk = 0, lookX = 0, armsUp = 0, skin = 'plain', wear = [], t = 0, color = COL.O}) => {
  const dx = Math.abs(lookX) > 0.4 ? Math.sign(lookX) : 0;
  const px: Px[] = [];
  // 腿：走路时两组腿交替抬起一格
  const lift = walk ? (Math.sin(walk) > 0 ? [1, 0, 0, 1] : [0, 1, 1, 0]) : [0, 0, 0, 0];
  [6, 8, 13, 15].forEach((c, i) => px.push(box(c, 14, 1, 3 - lift[i], 'O')));
  // 手：举起时变成竖着的两格宽
  if (armsUp > 0.4) {
    px.push(box(3, 7, 2, 4, 'O'), box(17, 7, 2, 4, 'O'));
  } else {
    px.push(box(3, 10, 2, 2, 'O'), box(17, 10, 2, 2, 'O'));
  }
  px.push(box(5, 7, 12, 7, 'O'));
  // 底部一行暗色，增加体积感
  px.push(row(13, 5, 16, 'o'));
  if (skin !== 'plain') px.push(...SKINS[skin]);
  wear.forEach((w) => px.push(...(WEARS[w] ?? [])));
  px.push(...eyePx(7 + dx, eyes, t), ...eyePx(14 + dx, eyes, t));
  return (
    <g transform={`translate(${-11 * PX} ${-17 * PX})`} shapeRendering="crispEdges">
      {px.map(([c, r, w, h, k], i) => (
        <rect key={i} x={c * PX} y={r * PX} width={w * PX + 0.5} height={h * PX + 0.5} fill={k === 'O' ? color : k === 'o' ? shade(color) : COL[k]} />
      ))}
    </g>
  );
};

const shade = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.85));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};
