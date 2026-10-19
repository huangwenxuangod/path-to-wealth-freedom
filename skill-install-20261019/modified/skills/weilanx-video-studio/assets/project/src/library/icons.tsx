import React from 'react';
import {easeInOut, prog} from './anim';
import {C} from './theme';
import {FONT_CN} from './fonts';

const INK = C.ink;
const SW = 4;

/** 视频文件图标 + 文件名 */
export const VideoFile: React.FC<{name: string; size?: number; tint?: string; wiggle?: number}> = ({name, size = 120, tint = '#CFE3FF', wiggle = 0}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: size * 1.7, transform: `rotate(${wiggle}deg)`}}>
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <path d="M8 6 H66 L92 32 V112 H8 Z" fill={C.white} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M66 6 V32 H92" fill="#EDE7DA" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="20" y="46" width="60" height="44" rx="6" fill={tint} stroke={INK} strokeWidth={3} />
      <path d="M43 57 L60 68 L43 79 Z" fill={INK} />
    </svg>
    <div style={{fontFamily: FONT_CN, fontSize: size * 0.2, color: INK, marginTop: 4, whiteSpace: 'nowrap'}}>{name}</div>
  </div>
);

/** 普通文件（截图、文档） */
export const PlainFile: React.FC<{name: string; size?: number; color?: string}> = ({name, size = 90, color = '#FCE3A8'}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: size * 1.7}}>
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <path d="M8 6 H66 L92 32 V112 H8 Z" fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M66 6 V32 H92" fill="#fff8" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {[54, 70, 86].map((y) => <line key={y} x1="22" y1={y} x2="76" y2={y} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.5} />)}
    </svg>
    <div style={{fontFamily: FONT_CN, fontSize: size * 0.22, color: INK, marginTop: 4, whiteSpace: 'nowrap'}}>{name}</div>
  </div>
);

export const Folder: React.FC<{name: string; size?: number; color?: string; open?: number}> = ({name, size = 140, color = C.yellow, open = 0}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: size * 1.6}}>
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96">
      <path d="M6 16 H44 L54 26 H114 V88 H6 Z" fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M6 ${36 + open * 10} H114 V88 H6 Z`} fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round" filter="brightness(1.08)" />
    </svg>
    <div style={{fontFamily: FONT_CN, fontSize: size * 0.2, color: INK, marginTop: 2, whiteSpace: 'nowrap'}}>{name}</div>
  </div>
);

/** 手绘箭头，p 控制画出进度 */
export const Arrow: React.FC<{w: number; h: number; d: string; head: string; p: number; color?: string; width?: number}> = ({w, h, d, head, p, color = INK, width = 6}) => (
  <svg width={w} height={h} style={{overflow: 'visible'}}>
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
    {p > 0.95 && <path d={head} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

export const Check: React.FC<{size?: number; p?: number; color?: string}> = ({size = 60, p = 1, color = '#3DAA6B'}) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <path d="M8 32 L24 48 L54 12" pathLength={1} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
  </svg>
);

export const Cross: React.FC<{size?: number; p?: number; color?: string; width?: number}> = ({size = 60, p = 1, color = C.red, width = 9}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{overflow: 'visible'}}>
    <path d="M10 10 L50 50" pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M50 10 L10 50" pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
  </svg>
);

/** 方框勾选框 */
export const CheckBox: React.FC<{size?: number; p: number}> = ({size = 56, p}) => (
  <div style={{position: 'relative', width: size, height: size, border: `4px solid ${INK}`, borderRadius: 10, background: C.white, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: -4, top: -12}}>
      <Check size={size + 8} p={p} />
    </div>
  </div>
);

export const Bulb: React.FC<{size?: number; glow?: number}> = ({size = 110, glow = 1}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{overflow: 'visible'}}>
    {Array.from({length: 7}, (_, i) => {
      const a = (-160 + i * 23.3) * (Math.PI / 180);
      return <line key={i} x1={50 + Math.cos(a) * 58} y1={48 + Math.sin(a) * 58} x2={50 + Math.cos(a) * (58 + 18 * glow)} y2={48 + Math.sin(a) * (58 + 18 * glow)} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    })}
    <path d="M50 8 A38 38 0 0 1 72 78 V92 H28 V78 A38 38 0 0 1 50 8 Z" fill={C.yellow} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="30" y="94" width="40" height="12" rx="3" fill="#C9C2B4" stroke={INK} strokeWidth={SW} />
    <rect x="34" y="108" width="32" height="10" rx="3" fill="#C9C2B4" stroke={INK} strokeWidth={SW} />
    <path d="M40 60 Q50 46 60 60" fill="none" stroke={INK} strokeWidth={3} />
  </svg>
);

export const StopSign: React.FC<{size?: number; label?: string}> = ({size = 260, label = '停'}) => {
  const pts = Array.from({length: 8}, (_, i) => {
    const a = (Math.PI / 8) * (2 * i + 1);
    return `${50 + Math.cos(a) * 46},${50 + Math.sin(a) * 46}`;
  }).join(' ');
  return (
    <div style={{position: 'relative', width: size, height: size * 1.5}}>
      <div style={{position: 'absolute', left: size / 2 - 9, top: size * 0.8, width: 18, height: size * 0.7, background: '#9A948A', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: 0, top: 0}}>
        <polygon points={pts} fill={C.red} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={C.white} strokeWidth={2} transform="translate(50 50) scale(0.86) translate(-50 -50)" />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 0, width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_CN, fontSize: size * 0.42, color: C.white}}>{label}</div>
    </div>
  );
};

export const Trash: React.FC<{size?: number; lid?: number}> = ({size = 160, lid = 0}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{overflow: 'visible'}}>
    <g transform={`rotate(${-lid * 35} 12 26)`}>
      <rect x="8" y="18" width="84" height="12" rx="4" fill="#B9C4C9" stroke={INK} strokeWidth={SW} />
      <rect x="38" y="8" width="24" height="12" rx="4" fill="#B9C4C9" stroke={INK} strokeWidth={SW} />
    </g>
    <path d="M16 34 H84 L78 110 H22 Z" fill="#D5DEE2" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {[36, 50, 64].map((x) => <line key={x} x1={x} y1="46" x2={x} y2="98" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />)}
  </svg>
);

export const ThumbUp: React.FC<{size?: number; fill?: string}> = ({size = 90, fill = C.white}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="8" y="44" width="20" height="48" rx="4" fill={fill} stroke={INK} strokeWidth={SW} />
    <path d="M32 46 L50 12 Q60 8 62 20 L58 40 H84 Q94 42 90 54 L82 86 Q78 94 68 92 H32 Z" fill={fill} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
  </svg>
);

export const Coffee: React.FC<{size?: number; f: number}> = ({size = 90, f}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    {[34, 54].map((x, i) => (
      <path key={x} d={`M${x} 26 q${8 + Math.sin(f * 0.2 + i) * 3} -8 0 -16 q-8 -8 0 -16`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    ))}
    <path d="M74 44 q20 2 14 20 q-4 10 -16 10" fill="none" stroke={INK} strokeWidth={6} />
    <path d="M16 34 H78 V76 Q78 92 62 92 H32 Q16 92 16 76 Z" fill={C.white} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="16" y="50" width="62" height="12" fill={C.orange} stroke={INK} strokeWidth={3} />
  </svg>
);

export type Mood = 'calm' | 'angry' | 'happy' | 'reading';

/** 「你」——屏幕外的用户，一个圆脸 */
export const UserFace: React.FC<{size?: number; mood?: Mood; f?: number}> = ({size = 130, mood = 'calm', f = 0}) => {
  const blink = mood !== 'happy' && f % 80 < 3;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
      <path d="M22 30 Q20 6 50 6 Q80 6 78 30 Q60 18 22 30 Z" fill={INK} />
      <circle cx="50" cy="54" r="38" fill="#FAD9C1" stroke={INK} strokeWidth={SW} />
      <path d="M16 40 Q30 18 56 20 Q80 22 86 40 Q66 28 44 32 Q28 34 16 40 Z" fill={INK} />
      {mood === 'angry' && (
        <>
          <path d="M28 44 L44 50 M72 44 L56 50" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d="M80 12 l6 8 m2 -10 l-2 10 m-10 -2 l10 2" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {mood === 'happy' ? (
        <>
          <path d="M30 56 Q37 48 44 56 M56 56 Q63 48 70 56" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <ellipse cx="28" cy="66" rx="7" ry="4" fill="#F08A8A" opacity={0.7} />
          <ellipse cx="72" cy="66" rx="7" ry="4" fill="#F08A8A" opacity={0.7} />
        </>
      ) : blink ? (
        <path d="M31 58 H42 M58 58 H69" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx="37" cy={mood === 'reading' ? 60 : 57} rx="4.5" ry="6" fill={INK} />
          <ellipse cx="63" cy={mood === 'reading' ? 60 : 57} rx="4.5" ry="6" fill={INK} />
        </>
      )}
      {mood === 'angry' ? (
        <path d="M38 78 Q50 68 62 78" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
      ) : mood === 'happy' ? (
        <path d="M38 72 Q50 84 62 72" fill="#E86A6A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ) : (
        <path d="M42 76 Q50 80 58 76" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      )}
    </svg>
  );
};

export type ToolKind = 'readFile' | 'mkdir' | 'readVideo' | 'moveFile' | 'list';

export const ToolIcon: React.FC<{kind: ToolKind; size?: number}> = ({kind, size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'readFile' && (
      <>
        <path d="M14 6 H48 L62 20 V70 H14 Z" fill="#FCE3A8" />
        <circle cx="52" cy="54" r="12" fill={C.white} />
        <path d="M61 63 L72 74" />
      </>
    )}
    {kind === 'mkdir' && (
      <>
        <path d="M6 18 H32 L40 26 H74 V68 H6 Z" fill={C.yellow} />
        <path d="M40 38 V58 M30 48 H50" strokeWidth={5} />
      </>
    )}
    {kind === 'readVideo' && (
      <>
        <rect x="6" y="14" width="60" height="44" rx="6" fill="#CFE3FF" />
        <path d="M30 26 L46 36 L30 46 Z" fill={INK} />
        <circle cx="58" cy="58" r="12" fill={C.white} />
        <path d="M67 67 L76 76" />
      </>
    )}
    {kind === 'moveFile' && (
      <>
        <path d="M8 10 H32 L42 20 V56 H8 Z" fill="#FCE3A8" />
        <path d="M34 64 H72 M60 52 L72 64 L60 76" strokeWidth={5} />
      </>
    )}
    {kind === 'list' && (
      <>
        <rect x="10" y="8" width="60" height="64" rx="6" fill={C.white} />
        {[24, 40, 56].map((y) => (
          <React.Fragment key={y}>
            <circle cx="22" cy={y} r="3" fill={INK} />
            <path d={`M32 ${y} H60`} />
          </React.Fragment>
        ))}
      </>
    )}
  </svg>
);

/** 聊天气泡小图标 */
export const ChatIcon: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 14 H90 Q96 14 96 20 V62 Q96 68 90 68 H40 L22 86 V68 H10 Q4 68 4 62 V20 Q4 14 10 14 Z" fill={C.white} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {[32, 50, 68].map((x) => <circle key={x} cx={x} cy="41" r="6" fill={INK} />)}
  </svg>
);

export const LaptopIcon: React.FC<{size?: number}> = ({size = 170}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90">
    <rect x="16" y="6" width="88" height="60" rx="6" fill="#BCEDE2" stroke={INK} strokeWidth={SW} />
    <path d="M4 72 H116 L108 84 H12 Z" fill="#D8D3C8" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="30" y="20" width="18" height="22" rx="2" fill={C.white} stroke={INK} strokeWidth={3} />
    <rect x="56" y="20" width="18" height="22" rx="2" fill={C.yellow} stroke={INK} strokeWidth={3} />
  </svg>
);

/** 红色印章 */
export const Stamp: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 54, color = C.red}) => (
  <div style={{display: 'inline-block', padding: `${size * 0.12}px ${size * 0.35}px`, border: `${size * 0.1}px solid ${color}`, borderRadius: size * 0.2, color, fontFamily: FONT_CN, fontSize: size, lineHeight: 1.1, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.6)', boxShadow: `inset 0 0 0 ${size * 0.05}px ${color}33`}}>
    {text}
  </div>
);

/** 盖章动画：从 1.8 倍砸下来 */
export const stampScale = (f: number, at: number) => {
  const p = prog(f, at, 6, easeInOut);
  return f < at ? 0 : 1.8 - 0.8 * p;
};

/** 目标旗 */
export const Flag: React.FC<{size?: number; f: number}> = ({size = 90, f}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 80 96" style={{overflow: 'visible'}}>
    <line x1="14" y1="6" x2="14" y2="92" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d={`M16 8 Q40 ${2 + Math.sin(f * 0.2) * 5} 70 12 L62 30 L70 48 Q40 ${42 + Math.sin(f * 0.2 + 1) * 5} 16 46 Z`} fill={C.red} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

/** 日历图标（顶部红条 + 日期格） */
export const CalendarIcon: React.FC<{size?: number; day?: string}> = ({size = 110, day = '28'}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="8" y="14" width="84" height="78" rx="12" fill={C.white} stroke={INK} strokeWidth={SW} />
    <path d="M8 26 Q8 14 20 14 H80 Q92 14 92 26 V36 H8 Z" fill={C.red} stroke={INK} strokeWidth={SW} />
    {[30, 70].map((x) => <rect key={x} x={x - 4} y="6" width="8" height="18" rx="4" fill={INK} />)}
    <text x="50" y="78" textAnchor="middle" fontFamily={FONT_CN} fontSize="38" fill={INK}>{day}</text>
  </svg>
);

/** 表格图标（绿色表头 + 格子） */
export const SheetIcon: React.FC<{size?: number}> = ({size = 110}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="10" fill={C.white} stroke={INK} strokeWidth={SW} />
    <path d="M10 20 Q10 10 20 10 H80 Q90 10 90 20 V32 H10 Z" fill="#3DAA6B" stroke={INK} strokeWidth={SW} />
    {[51, 70].map((y) => <line key={y} x1="10" y1={y} x2="90" y2={y} stroke={INK} strokeWidth={3} />)}
    {[37, 63].map((x) => <line key={x} x1={x} y1="32" x2={x} y2="90" stroke={INK} strokeWidth={3} />)}
  </svg>
);

/** 开关，on 为 0..1 */
export const Toggle: React.FC<{on: number; size?: number}> = ({on, size = 90}) => (
  <svg width={size} height={size * 0.56} viewBox="0 0 90 50">
    <rect x="3" y="3" width="84" height="44" rx="22" fill={on > 0.5 ? '#3DAA6B' : '#CFC8BC'} stroke={INK} strokeWidth={SW} />
    <circle cx={25 + 40 * on} cy="25" r="16" fill={C.white} stroke={INK} strokeWidth={SW} />
  </svg>
);

/** 插头：usbc 统一接口，其余是各不相同的老式充电头 */
export type PlugKind = 'usbc' | 'round' | 'flat' | 'wide';
export const PlugIcon: React.FC<{kind: PlugKind; size?: number; color?: string}> = ({kind, size = 90, color = C.white}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 60 84">
    <path d="M30 84 V60" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <rect x="12" y="30" width="36" height="32" rx="8" fill={color} stroke={INK} strokeWidth={SW} />
    {kind === 'usbc' && <rect x="18" y="8" width="24" height="24" rx="8" fill="#B8BEC8" stroke={INK} strokeWidth={SW} />}
    {kind === 'round' && <circle cx="30" cy="20" r="11" fill="#B8BEC8" stroke={INK} strokeWidth={SW} />}
    {kind === 'flat' && <rect x="24" y="4" width="12" height="28" rx="2" fill="#B8BEC8" stroke={INK} strokeWidth={SW} />}
    {kind === 'wide' && <path d="M14 30 L18 12 H42 L46 30 Z" fill="#B8BEC8" stroke={INK} strokeWidth={SW} />}
  </svg>
);

/** 数据库（三层圆柱） */
export const DatabaseIcon: React.FC<{size?: number; color?: string}> = ({size = 120, color = '#9FC8F0'}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    {[78, 50, 22].map((y) => (
      <g key={y}>
        <path d={`M10 ${y} V${y + 22} Q50 ${y + 42} 90 ${y + 22} V${y}`} fill={color} stroke={INK} strokeWidth={SW} />
        <ellipse cx="50" cy={y} rx="40" ry="14" fill={color} stroke={INK} strokeWidth={SW} />
      </g>
    ))}
    <ellipse cx="50" cy="22" rx="40" ry="14" fill={C.white} stroke={INK} strokeWidth={SW} opacity={0.6} />
  </svg>
);

/** 钥匙，color 是钥匙头的颜色 */
export const KeyIcon: React.FC<{size?: number; color?: string}> = ({size = 90, color = C.yellow}) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 100 50">
    <circle cx="22" cy="25" r="18" fill={color} stroke={INK} strokeWidth={SW} />
    <circle cx="22" cy="25" r="6" fill={C.white} stroke={INK} strokeWidth={3} />
    <path d="M40 21 H92 V29 H84 V38 H76 V29 H66 V36 H58 V29 H40 Z" fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
  </svg>
);
