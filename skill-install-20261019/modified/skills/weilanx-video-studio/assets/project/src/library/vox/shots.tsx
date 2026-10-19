import React from 'react';
import {Desk} from './props';
import {step12, V, VF} from './theme';

/* ============ Vox 硬切拼贴（A-roll 黑卡 + B-roll 实拍）的镜头工具 ============ */

/** 按 12fps 步进的 0..1 进度 */
export const p12 = (f: number, at: number, dur: number) => Math.max(0, Math.min(1, (step12(f) - at) / dur));

/** 数字从 0 滚到 to（12fps 步进、缓出） */
export const countUp = (f: number, at: number, to: number, dur = 20) => Math.round(to * (1 - Math.pow(1 - p12(f, at, dur), 3)));

/** 黑卡上的大字（思源黑 Heavy，不换行） */
export const Head: React.FC<{size?: number; color?: string; children: React.ReactNode}> = ({size = 150, color = V.paper, children}) => (
  <div style={{fontFamily: VF.heavy, fontSize: size, lineHeight: 1.08, color, whiteSpace: 'nowrap'}}>{children}</div>
);

/** 手写红字批注 */
export const Hand: React.FC<{size?: number; rot?: number; children: React.ReactNode; color?: string}> = ({size = 56, rot = -4, children, color = V.red}) => (
  <div style={{fontFamily: VF.heavy, fontSize: size, color, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap'}}>{children}</div>
);

/** 奖牌贴纸 */
export const Medal: React.FC<{s?: number}> = ({s = 200}) => (
  <svg width={s} height={s * 1.25} viewBox="0 0 120 150">
    <path d="M30 0 L52 60 L68 60 L46 0 Z" fill={V.red} />
    <path d="M90 0 L68 60 L52 60 L74 0 Z" fill="#3D6AA8" />
    <circle cx={60} cy={98} r={46} fill="#D9B44A" stroke={V.ink} strokeWidth={4} />
    <circle cx={60} cy={98} r={33} fill="none" stroke="#9C7A1E" strokeWidth={4} />
    <text x={60} y={110} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fontWeight={700} fill="#7A5C10">
      N
    </text>
  </svg>
);

/** 一个镜头：from 是切进来的全局帧，kind A 是黑卡、B 是钉在桌面上的实拍 */
export type Shot = {from: number; kind: 'A' | 'B'; C: React.FC<{f: number; s: number}>};

/** B-roll 镜头：旧纸桌面 + 整个镜头慢推 5% */
export const BShot: React.FC<{f: number; s: number; e: number; seed: number; w?: number; h?: number; children: React.ReactNode}> = ({f, s, e, seed, w = 1920, h = 1080, children}) => {
  const k = 1 + 0.05 * Math.max(0, Math.min(1, (f - s) / Math.max(1, e - s)));
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${k})`, transformOrigin: '50% 45%'}}>
        <Desk w={w} h={h} color={V.oldMap} seed={seed} />
        {children}
      </div>
    </div>
  );
};

/** 按镜头表硬切：只渲染当前镜头 */
export const ShotFilm: React.FC<{f: number; shots: Shot[]; duration: number}> = ({f, shots, duration}) => {
  let i = 0;
  for (let k = 0; k < shots.length; k++) if (f >= shots[k].from) i = k;
  const shot = shots[i];
  const end = i + 1 < shots.length ? shots[i + 1].from : duration;
  const C = shot.C;
  return shot.kind === 'B' ? (
    <BShot f={f} s={shot.from} e={end} seed={i + 3}>
      <C f={f} s={shot.from} />
    </BShot>
  ) : (
    <C f={f} s={shot.from} />
  );
};
