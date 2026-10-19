import React from 'react';
import {C} from '../theme';
import type {Eyes} from './types';
import {Arm} from './Arm';
import {BuddyFigure} from './BuddyFigure';
import type {Wear} from './Accessories';
import {PixelBuddy, type PixelSkin} from './PixelBuddy';

/** 角色画风：矢量手绘（默认）或像素风，由视频根组件通过 Provider 指定 */
export const CharStyle = React.createContext<'vector' | 'pixel'>('vector');

export const GRAY = '#A7A39B';
export const GRAY_DARK = '#7E7A72';

export interface CharProps {
  f: number;
  x: number; // 脚底中心，舞台坐标
  y: number;
  s?: number;
  kind?: 'agent' | 'bot';
  eyes?: Eyes;
  walk?: boolean;
  lookX?: number;
  armsUp?: number;
  talk?: boolean; // 普通 AI 说话时嘴巴开合
  arm?: {tx: number; ty: number; ext: number} | null;
  rot?: number;
  opacity?: number;
  wear?: Wear[];
  mouth?: number; // 0..1，传入时按口型开合（主持人说话）
  skin?: PixelSkin; // 像素风皮肤
}

/** 舞台上的角色：Agent（橙色、有伸缩手臂）或普通 AI（灰色、没有手） */
export const Char: React.FC<CharProps> = ({f, x, y, s = 1, kind = 'agent', eyes = 'open', walk, lookX = 0, armsUp = 0, talk, arm, rot = 0, opacity = 1, wear, mouth: mouthIn, skin}) => {
  const style = React.useContext(CharStyle);
  const bot = kind === 'bot';
  // 呼吸 + 自然眨眼
  const breathe = walk ? 0 : Math.sin(f * 0.12) * 0.015;
  const e: Eyes = eyes === 'open' && (f + Math.round(x)) % 83 < 3 ? 'closed' : eyes;
  const bob = walk ? Math.abs(Math.sin(f * 0.55)) * 6 : 0;
  const mouth = mouthIn ?? (bot ? (talk ? 0.3 + 0.7 * Math.abs(Math.sin(f * 0.7)) : 0) : undefined);
  const shoulder = {x: x + 80 * s, y: y - 130 * s - bob};
  return (
    <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity, pointerEvents: 'none'}}>
      {arm && arm.ext > 0.01 && (
        <Arm sx={shoulder.x} sy={shoulder.y} tx={shoulder.x + (arm.tx - shoulder.x) * arm.ext} ty={shoulder.y + (arm.ty - shoulder.y) * arm.ext} />
      )}
      <g transform={`translate(${x} ${y - bob}) translate(0 ${-100 * s}) rotate(${rot}) translate(0 ${100 * s}) scale(${s * (1 - breathe)} ${s * (1 + breathe)})`}>
        {style === 'pixel' ? (
          <PixelBuddy eyes={e} walk={walk ? f * 0.55 : 0} lookX={lookX} armsUp={armsUp} skin={skin} wear={wear} t={f} color={bot ? GRAY : undefined} />
        ) : (
          <BuddyFigure
            eyes={e}
            walk={walk ? f * 0.55 : 0}
            lookX={lookX}
            armsUp={armsUp}
            blush={e === 'happy'}
            color={bot ? GRAY : C.orange}
            shade={bot ? GRAY_DARK : C.orangeDark}
            nubs={!bot}
            mouth={mouth}
            wear={wear}
            t={f}
            stroke={3.5 / Math.max(0.6, s) * Math.min(1.2, Math.max(1, s))}
          />
        )}
      </g>
    </svg>
  );
};
