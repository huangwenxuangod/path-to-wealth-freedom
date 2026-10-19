import React from 'react';
import {bob, CREW_COLORS, EF} from './theme';

/**
 * 协作剪辑台风的五个原创几何小角色：星星、水滴、胶囊、菱形、半圆拱。纯色身体 + 两只白眼睛（带黑眼珠），没有嘴。
 * 同一个角色既当聊天头像，也当时间轴上的协作者光标。
 */

export type CritterShape = 'star' | 'drop' | 'pill' | 'gem' | 'dome';
export type CrewMember = {name: string; role: string; shape: CritterShape; color: string};

/** 默认五人组（名字、身份标签都是示例，可以按片子改） */
export const CREW: CrewMember[] = [
  {name: '星星', role: '文案', shape: 'star', color: CREW_COLORS.amber},
  {name: '点点', role: '动效', shape: 'drop', color: CREW_COLORS.magenta},
  {name: '阿胶', role: '音乐', shape: 'pill', color: CREW_COLORS.coral},
  {name: '菱菱', role: '版式', shape: 'gem', color: CREW_COLORS.sky},
  {name: '拱拱', role: '审核', shape: 'dome', color: CREW_COLORS.mint},
];

/** 身体轮廓（100×100 画布，中心 50,52） */
const BODY: Record<CritterShape, string> = {
  star: 'M50 8 L61 36 L91 37 L67 56 L76 86 L50 69 L24 86 L33 56 L9 37 L39 36 Z',
  drop: 'M50 6 C60 26 84 44 84 64 C84 83 69 94 50 94 C31 94 16 83 16 64 C16 44 40 26 50 6 Z',
  pill: 'M32 10 H68 A20 20 0 0 1 88 30 V70 A20 20 0 0 1 68 90 H32 A20 20 0 0 1 12 70 V30 A20 20 0 0 1 32 10 Z',
  gem: 'M50 6 L90 50 L50 94 L10 50 Z',
  dome: 'M10 88 V58 A40 40 0 0 1 90 58 V88 Z',
};
/** 眼睛位置（左右眼中心）和大小 */
const EYES: Record<CritterShape, [number, number, number, number, number]> = {
  star: [41, 50, 59, 50, 6],
  drop: [40, 62, 60, 62, 7],
  pill: [38, 44, 62, 44, 7.5],
  gem: [40, 48, 60, 48, 6.5],
  dome: [38, 62, 62, 62, 7.5],
};

/**
 * 小角色：size 像素；look 是眼珠朝向（-1..1, -1..1）；blink 给一个种子就会周期性眨眼（每 ~4 秒一次，帧号纯函数）。
 * 星星和菱形用同色粗描边把尖角磨圆
 */
export const Critter: React.FC<{shape: CritterShape; color: string; size?: number; f?: number; look?: [number, number]; blink?: number}> = ({shape, color, size = 48, f = 0, look = [0.2, 0], blink}) => {
  const [lx, ly, rx, ry, r] = EYES[shape];
  const closing = blink === undefined ? 0 : (() => {
    const t = (f + blink * 37) % 130;
    return t < 6 ? 1 - Math.abs(t - 3) / 3 : 0;
  })();
  const eye = (cx: number, cy: number, k: string) => (
    <g key={k} transform={`translate(${cx} ${cy}) scale(1 ${1 - 0.9 * closing})`}>
      <ellipse rx={r} ry={r * 1.15} fill="#fff" />
      <circle cx={look[0] * r * 0.45} cy={look[1] * r * 0.45} r={r * 0.5} fill="#1d1c1a" />
    </g>
  );
  const round = shape === 'star' || shape === 'gem';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block'}}>
      <path d={BODY[shape]} fill={color} stroke={round ? color : 'none'} strokeWidth={round ? 12 : 0} strokeLinejoin="round" />
      <path d={BODY[shape]} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={3} transform="translate(-2 -3)" strokeLinejoin="round" />
      {eye(lx, ly, 'l')}
      {eye(rx, ry, 'r')}
    </svg>
  );
};

/** 鼠标箭头（同色填充、白描边） */
export const Pointer: React.FC<{color: string; size?: number}> = ({color, size = 22}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 20 25" style={{display: 'block', overflow: 'visible'}}>
    <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L16.5 14 Z" fill={color} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/**
 * 协作者光标：左上一个同色箭头，右下是小角色（原地浮动），脚下同色名字胶囊。
 * (x, y) 是箭头尖的位置；carry 给了就在角色身上叠一个被拖着的东西（片段缩略块）
 */
export const CursorCritter: React.FC<{f: number; m: CrewMember; x: number; y: number; seed?: number; size?: number; label?: boolean; carry?: React.ReactNode}> = ({f, m, x, y, seed = 0, size = 44, label = true, carry}) => {
  const dy = bob(f, seed, 3);
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -2, top: -2}}>
        <Pointer color={m.color} size={20} />
      </div>
      {carry ? <div style={{position: 'absolute', left: 18, top: 18 + dy}}>{carry}</div> : null}
      <div style={{position: 'absolute', left: 14, top: 12 + dy}}>
        <Critter shape={m.shape} color={m.color} size={size} f={f} blink={seed} look={[0.3, 0.2]} />
      </div>
      {label && (
        <div style={{position: 'absolute', left: 14 + size / 2, top: 14 + size + dy, transform: 'translateX(-50%)', padding: '2px 9px', borderRadius: 999, background: m.color, color: '#fff', fontFamily: EF.ui, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.12)'}}>{m.name}</div>
      )}
    </div>
  );
};
