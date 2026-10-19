import React from 'react';
import {DotPattern} from './stage';
import {H} from './theme';

/**
 * 网点档案风的原创嫌疑人：扫地机器人「嘟嘟」。
 * 画法照这套风格的角色语法：藏青粗描边 + 平涂 + 右下网点阴影 + 腮红，没有嘴。
 */

export type RoboEyes = 'open' | 'closed' | 'wide' | 'happy' | 'side';

/**
 * 扫地机器人：低矮圆顶机身 + 钴蓝防撞条 + 顶部粉红感应灯 + 两只大眼睛 + 底部两把转动的边刷。
 * size 是宽度（px）；eyes 表情；spin 边刷转速（0 不转）；f 驱动眨眼、感应灯闪和边刷；id 用于网点阴影的 pattern。
 */
export const Robo: React.FC<{f: number; size?: number; eyes?: RoboEyes; spin?: number; blink?: boolean; light?: boolean; id?: string}> = ({f, size = 320, eyes = 'open', spin = 0, blink = true, light = true, id = 'robo'}) => {
  // 每 90 帧眨一次眼（3 帧）
  const closedNow = eyes === 'closed' || (blink && eyes === 'open' && f % 90 >= 86);
  const lampOn = light && Math.floor(f / 10) % 3 !== 0;
  const ink = H.ink;
  const eye = (cx: number) => {
    const cy = 112;
    if (closedNow) return <path key={cx} d={`M${cx - 16} ${cy} Q${cx} ${cy + 13} ${cx + 16} ${cy}`} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />;
    if (eyes === 'happy') return <path key={cx} d={`M${cx - 16} ${cy + 5} Q${cx} ${cy - 14} ${cx + 16} ${cy + 5}`} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />;
    const r = eyes === 'wide' ? 22 : 17;
    const dx = eyes === 'side' ? 6 : 0;
    return (
      <g key={cx}>
        <circle cx={cx} cy={cy} r={r} fill={ink} />
        <circle cx={cx - 6 + dx} cy={cy - 6} r={eyes === 'wide' ? 7 : 6} fill="#fff" />
        <circle cx={cx + 6 + dx} cy={cy + 6} r={2.6} fill="#fff" />
      </g>
    );
  };
  const brush = (cx: number, dir: number) => {
    const a = (f * spin * dir * 18) % 360;
    return (
      <g transform={`translate(${cx} 184) rotate(${a})`}>
        {[0, 120, 240].map((d) => (
          <line key={d} x1={0} y1={0} x2={Math.cos((d * Math.PI) / 180) * 26} y2={Math.sin((d * Math.PI) / 180) * 9} stroke={ink} strokeWidth={4} strokeLinecap="round" />
        ))}
        <circle r={6} fill={H.pink} stroke={ink} strokeWidth={3} />
      </g>
    );
  };
  return (
    <svg width={size} height={(size * 215) / 300} viewBox="0 0 300 215" style={{overflow: 'visible'}}>
      <defs>
        <DotPattern id={`${id}-dots`} color={ink} step={9} r={2.1} />
        <clipPath id={`${id}-body`}>
          <path d="M28 150 Q28 58 150 54 Q272 58 272 150 Q272 182 150 185 Q28 182 28 150 Z" />
        </clipPath>
      </defs>
      <ellipse cx={150} cy={196} rx={128} ry={12} fill={ink} opacity={0.18} />
      {brush(52, 1)}
      {brush(248, -1)}
      {/* 机身 */}
      <path d="M28 150 Q28 58 150 54 Q272 58 272 150 Q272 182 150 185 Q28 182 28 150 Z" fill={H.paperLight} />
      <g clipPath={`url(#${id}-body)`}>
        <ellipse cx={262} cy={170} rx={120} ry={80} fill={`url(#${id}-dots)`} opacity={0.32} />
        {/* 防撞条 */}
        <path d="M20 140 Q150 156 280 140 L280 160 Q150 178 20 160 Z" fill={H.blue} />
        <path d="M20 140 Q150 156 280 140" fill="none" stroke={ink} strokeWidth={4} />
        <path d="M20 160 Q150 178 280 160" fill="none" stroke={ink} strokeWidth={4} />
      </g>
      <path d="M28 150 Q28 58 150 54 Q272 58 272 150 Q272 182 150 185 Q28 182 28 150 Z" fill="none" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
      {/* 顶部感应灯 */}
      <rect x={128} y={38} width={44} height={22} rx={10} fill={lampOn ? H.pink : '#c98a9a'} stroke={ink} strokeWidth={5} />
      <circle cx={140} cy={46} r={3} fill="#fff" opacity={lampOn ? 0.8 : 0.3} />
      {/* 脸 */}
      {eye(112)}
      {eye(188)}
      <ellipse cx={82} cy={132} rx={14} ry={8} fill={H.pink} opacity={0.75} />
      <ellipse cx={218} cy={132} rx={14} ry={8} fill={H.pink} opacity={0.75} />
    </svg>
  );
};

/** 袜子：一只条纹袜（color 主色、stripe 条纹色），rot 可以歪着放 */
export const Sock: React.FC<{size?: number; color?: string; stripe?: string; rot?: number}> = ({size = 120, color = H.pink, stripe = H.yellow, rot = 0}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M30 6 L66 6 L66 70 Q66 78 74 82 L90 92 Q100 100 92 110 Q84 118 70 112 L36 96 Q30 92 30 84 Z" fill={color} stroke={H.ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={30} y={6} width={36} height={14} fill={H.paperLight} stroke={H.ink} strokeWidth={5} />
    <path d="M32 34 L64 34 M32 50 L64 50" stroke={stripe} strokeWidth={7} />
  </svg>
);
