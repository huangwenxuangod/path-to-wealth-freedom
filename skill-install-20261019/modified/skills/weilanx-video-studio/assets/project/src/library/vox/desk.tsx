import React from 'react';
import {RedLine, shadow} from './props';
import {V, VF} from './theme';

/* ============ 桌面拼贴的通用小件（世界坐标里摆东西） ============ */

/** 在桌面上某处放一件东西；宽度跟内容走，不会被挤成窄条 */
export const Put: React.FC<{x: number; y: number; scale?: number; children: React.ReactNode}> = ({x, y, scale = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 'max-content', transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: 'left top'}}>{children}</div>
);

/** 打字机 / 论文页 / 新闻稿的纸 */
export const Doc: React.FC<{w: number; h: number; rot?: number; children: React.ReactNode; color?: string}> = ({w, h, rot = 0, children, color = V.paper}) => (
  <div style={{position: 'relative', width: w, height: h, background: color, transform: `rotate(${rot}deg)`, filter: shadow, padding: '30px 36px', boxSizing: 'border-box', color: V.ink, overflow: 'hidden'}}>{children}</div>
);

/** 大数字（Anton） */
export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 120, color = V.ink}) => <div style={{fontFamily: VF.num, fontSize: size, lineHeight: 1, color}}>{children}</div>;

/** 手画红叉 */
export const RedX: React.FC<{f: number; at: number; x: number; y: number; s?: number}> = ({f, at, x, y, s = 40}) =>
  f < at ? null : (
    <>
      <RedLine f={f} at={at} dur={5} points={[[x - s, y - s], [x + s, y + s]]} dot={false} width={7} />
      <RedLine f={f} at={at + 5} dur={5} points={[[x + s, y - s], [x - s, y + s]]} dot={false} width={7} />
    </>
  );

/** 手画对勾 */
export const RedCheck: React.FC<{f: number; at: number; x: number; y: number; s?: number}> = ({f, at, x, y, s = 30}) =>
  f < at ? null : <RedLine f={f} at={at} dur={8} points={[[x - s, y], [x - s * 0.2, y + s * 0.8], [x + s * 1.3, y - s]]} dot={false} width={8} />;
