import React from 'react';
import {C} from '../theme';

const ARM_W = 22;

/** 伸长的手臂：从肩膀画一根长方块到目标点，末端一个小方块手 */
export const Arm: React.FC<{sx: number; sy: number; tx: number; ty: number; color?: string}> = ({sx, sy, tx, ty, color = C.orange}) => {
  const len = Math.hypot(tx - sx, ty - sy);
  const ang = (Math.atan2(ty - sy, tx - sx) * 180) / Math.PI;
  return (
    <g transform={`translate(${sx} ${sy}) rotate(${ang})`}>
      <rect x={0} y={-ARM_W / 2} width={len} height={ARM_W} fill={color} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={len - 14} y={-16} width={30} height={32} rx={4} fill={color} stroke={C.ink} strokeWidth={3.5} />
    </g>
  );
};
