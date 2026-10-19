import React from 'react';
import {easeOut, easeOutBack, prog} from './anim';
import {C, wobblyRadius} from './theme';
import {FONT_CN} from './fonts';

/** 画面风格：classic 手绘（默认）；sticker 贴纸风——大字白边描边、硬投影、元素轻轻晃动 */
export type Look = 'classic' | 'sticker';
export const LookContext = React.createContext<Look>('classic');

/** 各风格的 CSS 变量，由 Show 挂在根节点上；样式函数通过 var() 读取，不需要改调用处 */
export const LOOK_VARS: Record<Look, React.CSSProperties> = {
  classic: {},
  sticker: {
    ['--stroke-k' as string]: '1.25',
    ['--sticker-filter' as string]:
      'drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(5px 7px 0 rgba(43,35,32,0.3))',
    ['--hard-shadow' as string]: '5px 7px 0 rgba(43,35,32,0.3)',
    ['--hard-shadow-lg' as string]: '7px 9px 0 rgba(43,35,32,0.3)',
  },
};

type Enter = 'pop' | 'up' | 'down' | 'left' | 'right' | 'drop' | 'fade';

interface PopProps {
  f: number;
  at: number; // 出现帧
  out?: number; // 消失帧（可选）
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number;
  enter?: Enter;
  dur?: number;
  center?: boolean; // x,y 表示中心点
  style?: React.CSSProperties;
  still?: boolean; // 贴纸风格下不要轻轻晃动
  children: React.ReactNode;
}

/** 在 at 帧弹出、在 out 帧淡出的绝对定位容器 */
export const Pop: React.FC<PopProps> = ({f, at, out, x, y, w, h, rot = 0, enter = 'pop', dur = 10, center, style, still, children}) => {
  const look = React.useContext(LookContext);
  if (f < at) return null;
  // 贴纸风格：贴上去之后轻轻晃，每个元素相位不同
  const sway = look === 'sticker' && !still;
  const seed = (x * 7 + y * 13) % 17;
  const swayRot = sway ? Math.sin((f - at) * 0.07 + seed) * 0.9 : 0;
  const swayY = sway ? Math.sin((f - at) * 0.09 + seed * 1.3) * 2.5 : 0;
  if (out !== undefined && f >= out + 8) return null;
  const p = prog(f, at, dur, enter === 'fade' ? easeOut : easeOutBack);
  const q = out !== undefined ? 1 - prog(f, out, 8) : 1;
  const d = (1 - p) * 120;
  const tr =
    enter === 'pop' ? `scale(${p})` :
    enter === 'up' ? `translateY(${d}px)` :
    enter === 'down' ? `translateY(${-d}px)` :
    enter === 'left' ? `translateX(${-d * 3}px)` :
    enter === 'right' ? `translateX(${d * 3}px)` :
    enter === 'drop' ? `translateY(${-(1 - prog(f, at, dur, easeOut)) * 500}px)` : '';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: Math.min(enter === 'pop' ? 1 : Math.min(1, p * 2), q),
        transform: `${center ? 'translate(-50%, -50%) ' : ''}${tr} translateY(${swayY}px) rotate(${rot + swayRot}deg) scale(${0.9 + 0.1 * q})`,
        transformOrigin: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const txt = (size: number, color: string = C.ink, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT_CN,
  fontSize: size,
  color,
  lineHeight: 1.25,
  whiteSpace: 'nowrap',
  ...extra,
});

/** 手绘卡片 */
export const Card: React.FC<{w?: number; h?: number; bg?: string; pad?: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  w, h, bg = C.panel, pad = 24, r = 18, style, children,
}) => (
  <div
    style={{
      width: w,
      height: h,
      boxSizing: 'border-box',
      padding: pad,
      background: bg,
      border: `4px solid ${C.ink}`,
      borderRadius: wobblyRadius(r),
      boxShadow: 'var(--hard-shadow-lg, 6px 8px 0 rgba(43,35,32,0.14))',
      ...style,
    }}
  >
    {children}
  </div>
);

/** 荧光笔高亮 */
export const Marker: React.FC<{color?: string; p?: number; children: React.ReactNode}> = ({color = C.yellow, p = 1, children}) => (
  <span style={{background: `linear-gradient(transparent 55%, ${color} 55%) no-repeat`, backgroundSize: `${p * 100}% 100%`}}>{children}</span>
);

/** 卡通大字：中文版 */
export const bigText = (size: number, fill: string, stroke = C.ink): React.CSSProperties => ({
  fontFamily: FONT_CN,
  fontSize: size,
  color: fill,
  WebkitTextStroke: `calc(${Math.max(4, size * 0.1)}px * var(--stroke-k, 1)) ${stroke}`,
  paintOrder: 'stroke fill',
  lineHeight: 1.1,
  whiteSpace: 'nowrap',
  filter: 'var(--sticker-filter, none)',
});

/** 一下「抖」的偏移，用于强调 */
export const jolt = (f: number, at: number, amp = 12, dur = 12) => {
  const p = prog(f, at, dur);
  if (p <= 0 || p >= 1) return 0;
  return Math.sin(p * Math.PI * 6) * amp * (1 - p);
};

/** 彩色标签/便签：一句话说明，带描边和投影 */
export const Note: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.white, size = 40}) => (
  <div style={{...txt(size), display: 'inline-block', background: color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{children}</div>
);
