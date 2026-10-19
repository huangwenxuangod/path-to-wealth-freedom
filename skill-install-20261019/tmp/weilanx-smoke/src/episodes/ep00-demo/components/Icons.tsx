import React from 'react';
import {C} from '../../../library/theme';

export type TransitionKind = 'whoosh' | 'spin' | 'glitch' | 'zoom' | 'slide' | 'fade';

/** 转场图标，40×40 视图 */
export const TransitionIcon: React.FC<{kind: TransitionKind; size: number}> = ({kind, size}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'whoosh' && (
      <>
        <path d="M6 14 H28 M6 20 H32 M6 26 H28" />
        <path d="M26 10 L34 20 L26 30" />
      </>
    )}
    {kind === 'spin' && <path d="M20 20 m0 -2 a2 2 0 1 1 -2 2 a4 4 0 0 1 4 -4 a6 6 0 0 1 6 6 a8 8 0 0 1 -8 8 a10 10 0 0 1 -10 -10 a12 12 0 0 1 12 -12" />}
    {kind === 'glitch' && (
      <>
        <path d="M5 26 L12 14 L18 24 L24 12 L30 22 L35 16" stroke="#6A5CD6" />
        <path d="M5 30 H35" stroke={C.teal} strokeWidth={2} />
      </>
    )}
    {kind === 'zoom' && (
      <>
        <circle cx="17" cy="17" r="9" />
        <path d="M24 24 L33 33" strokeWidth={3.5} />
      </>
    )}
    {kind === 'slide' && (
      <>
        <rect x="5" y="10" width="13" height="20" rx="2" fill={C.teal} />
        <rect x="21" y="10" width="13" height="20" rx="2" fill={C.yellow} />
      </>
    )}
    {kind === 'fade' && (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={6 + i * 5} y="10" width="4" height="20" fill={C.ink} opacity={1 - i * 0.16} stroke="none" />
        ))}
      </>
    )}
  </svg>
);

/** 「AA」文字样式图标 */
export const TextStyleIcon: React.FC<{kind: 'pop' | 'bubble' | 'neon'; size: number; font: string}> = ({kind, size, font}) => {
  const fill = kind === 'pop' ? C.yellow : kind === 'bubble' ? '#F2A0B4' : '#8E8FE8';
  return (
    <div style={{fontFamily: font, fontSize: size, color: fill, WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill', lineHeight: 1}}>AA</div>
  );
};
