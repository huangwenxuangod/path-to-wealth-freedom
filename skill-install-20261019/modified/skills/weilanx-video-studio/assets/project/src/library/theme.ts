import {loadFont as loadPatrick} from '@remotion/google-fonts/PatrickHand';
import {loadFont as loadLuckiest} from '@remotion/google-fonts/LuckiestGuy';
import {loadFont as loadCaveatBrush} from '@remotion/google-fonts/CaveatBrush';
import type {CSSProperties} from 'react';

export const FONT_UI = loadPatrick('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const FONT_POP = loadLuckiest('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const FONT_SIGN = loadCaveatBrush('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

export const C = {
  paper: '#EFE9DC',
  panel: '#FBF8F1',
  ink: '#2B2320',
  inkSoft: '#8A8176',
  line: '#D8D0C2',
  orange: '#D9804F',
  orangeDark: '#B8653A',
  teal: '#2E9C8F',
  tealLight: '#BFE7DF',
  yellow: '#F2C230',
  red: '#E5484D',
  pink: '#F7CFD6',
  white: '#FFFFFF',
};

export const STROKE = 3;

/** 略不规则的圆角，让方框有手绘感 */
export const wobblyRadius = (r: number) =>
  `${r}px ${r * 1.25}px ${r * 0.9}px ${r * 1.15}px / ${r * 1.15}px ${r * 0.9}px ${r * 1.2}px ${r}px`;

export const box = (x: number, y: number, w: number, h: number, extra: CSSProperties = {}): CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  width: w,
  height: h,
  boxSizing: 'border-box',
  border: `${STROKE}px solid ${C.ink}`,
  borderRadius: wobblyRadius(14),
  background: C.panel,
  ...extra,
});

/** 卡通大字：填色 + 粗描边 */
export const popTextStyle = (size: number, fill: string, stroke = C.ink): CSSProperties => ({
  fontFamily: FONT_POP,
  fontSize: size,
  color: fill,
  WebkitTextStroke: `${Math.max(3, size * 0.11)}px ${stroke}`,
  paintOrder: 'stroke fill',
  letterSpacing: size * 0.02,
  lineHeight: 1,
  whiteSpace: 'nowrap',
});
