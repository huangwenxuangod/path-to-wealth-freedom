import React from 'react';
import {C} from '../theme';
import type {Eyes} from './types';
import {Accessory, type Wear} from './Accessories';

export interface FigureProps {
  eyes: Eyes;
  walk?: number;
  lookX?: number;
  armsUp?: number;
  blush?: boolean;
  stroke?: number;
  color?: string;
  shade?: string;
  nubs?: boolean; // 两侧小方块（手）
  mouth?: number; // 0..1 张嘴程度，undefined 表示不画嘴
  wear?: Wear[]; // 配饰，按顺序叠加
  t?: number; // 帧号，驱动配饰上的小动画
}

const LEGS = [-68, -38, 24, 54];

/**
 * 橙色方块小人，SVG 组，原点在脚底中心，身体 184×112。
 * 只画身体本身；伸长的手臂、剪刀由外层按世界坐标画。
 */
export const BuddyFigure: React.FC<FigureProps> = ({eyes, walk = 0, lookX = 0, armsUp = 0, blush = false, stroke = 3.5, color = C.orange, shade = C.orangeDark, nubs = true, mouth, wear = [], t = 0}) => {
  const ex = lookX * 8;
  const nubH = 26 + armsUp * 52;
  const hatchId = `hatch-${shade.slice(1)}`;
  return (
    <g strokeLinejoin="round">
      <defs>
        <pattern id={hatchId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={shade} strokeWidth="1" opacity="0.28" />
        </pattern>
      </defs>
      {LEGS.map((lx, i) => {
        const lift = walk ? Math.max(0, Math.sin(walk + (i % 2) * Math.PI)) * 12 : 0;
        return <rect key={i} x={lx} y={-47 - lift} width={14} height={47} fill={color} stroke={C.ink} strokeWidth={stroke} />;
      })}
      {/* 两侧小方块，欢呼时竖起来 */}
      {nubs && (
        <>
          <g transform={`rotate(${-armsUp * 14} -92 -100)`}>
            <rect x={-114} y={-100 - nubH * (0.5 + armsUp * 0.5)} width={24} height={nubH} fill={color} stroke={C.ink} strokeWidth={stroke} />
          </g>
          <g transform={`rotate(${armsUp * 14} 92 -100)`}>
            <rect x={90} y={-100 - nubH * (0.5 + armsUp * 0.5)} width={24} height={nubH} fill={color} stroke={C.ink} strokeWidth={stroke} />
          </g>
        </>
      )}
      <rect x={-92} y={-157} width={184} height={112} rx={4} fill={color} stroke={C.ink} strokeWidth={stroke} />
      <rect x={-92} y={-157} width={184} height={112} rx={4} fill={`url(#${hatchId})`} />
      {blush && (
        <>
          <ellipse cx={-58 + ex} cy={-88} rx={12} ry={6} fill="#F08A8A" opacity={0.6} />
          <ellipse cx={58 + ex} cy={-88} rx={12} ry={6} fill="#F08A8A" opacity={0.6} />
        </>
      )}
      {[-36, 36].map((dx) => (
        <Eye key={dx} x={dx + ex} y={-108} kind={eyes} />
      ))}
      {mouth !== undefined && <ellipse cx={ex} cy={-76} rx={11} ry={2 + mouth * 9} fill={C.ink} />}
      {wear.map((w) => (
        <Accessory key={w} wear={w} t={t} />
      ))}
    </g>
  );
};

const star = (x: number, y: number, r: number) =>
  Array.from({length: 10}, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  }).join(' ');

/** 眼睛：比初版大一圈，默认带两个高光，更有神 */
const Eye: React.FC<{x: number; y: number; kind: Eyes}> = ({x, y, kind}) => {
  switch (kind) {
    case 'happy':
      return <path d={`M ${x - 14} ${y + 6} Q ${x} ${y - 12} ${x + 14} ${y + 6}`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />;
    case 'closed':
      return <path d={`M ${x - 13} ${y + 2} Q ${x} ${y + 9} ${x + 13} ${y + 2}`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />;
    case 'flat':
      return <rect x={x - 14} y={y - 2} width={28} height={8} rx={4} fill={C.ink} />;
    case 'wide':
      return (
        <g>
          <ellipse cx={x} cy={y - 1} rx={13} ry={17} fill={C.white} stroke={C.ink} strokeWidth={3.5} />
          <circle cx={x} cy={y} r={6} fill={C.ink} />
          <circle cx={x - 2} cy={y - 2} r={2} fill={C.white} />
        </g>
      );
    case 'star':
      return <polygon points={star(x, y - 1, 17)} fill={C.yellow} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />;
    case 'heart':
      return (
        <path
          d={`M ${x} ${y + 12} C ${x - 22} ${y - 2}, ${x - 12} ${y - 20}, ${x} ${y - 8} C ${x + 12} ${y - 20}, ${x + 22} ${y - 2}, ${x} ${y + 12} Z`}
          fill={C.red}
          stroke={C.ink}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      );
    case 'spiral':
      return (
        <path
          d={`M ${x} ${y} m 0 -3 a 3 3 0 1 1 -3 3 a 7 7 0 0 1 7 -7 a 11 11 0 0 1 11 11 a 15 15 0 0 1 -15 15 a 19 19 0 0 1 -19 -19`}
          fill="none"
          stroke={C.ink}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      );
    default:
      return (
        <g>
          <rect x={x - 10} y={y - 16} width={20} height={32} rx={10} fill={C.ink} />
          <circle cx={x - 3.5} cy={y - 8} r={4} fill={C.white} />
          <circle cx={x + 3.5} cy={y + 6} r={2} fill={C.white} />
        </g>
      );
  }
};
