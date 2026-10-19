import React from 'react';
import {C} from '../theme';
import {FONT_CN} from '../fonts';

const INK = C.ink;
const SW = 4;

/** 一摞书，n 本，颜色轮换 */
export const BookStack: React.FC<{n: number; w?: number}> = ({n, w = 300}) => {
  const colors = [C.teal, C.red, C.yellow, '#8E8FE8', C.orange, '#F2A0B4'];
  const h = 44;
  return (
    <svg width={w + 40} height={n * h + 10} style={{overflow: 'visible'}}>
      {Array.from({length: n}, (_, i) => {
        const y = (n - 1 - i) * h + 4;
        const x = 20 + ((i * 37) % 30) - 15;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h - 4} rx={6} fill={colors[i % colors.length]} stroke={INK} strokeWidth={SW} />
            <rect x={x + w - 34} y={y + 6} width={22} height={h - 16} rx={3} fill="#FFF8E6" stroke={INK} strokeWidth={2.5} />
            <line x1={x + 24} y1={y + 14} x2={x + 90} y2={y + 14} stroke={INK} strokeWidth={3} opacity={0.4} />
          </g>
        );
      })}
    </svg>
  );
};

export const Globe: React.FC<{size?: number; t: number}> = ({size = 240, t}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill="#9FDCCD" stroke={INK} strokeWidth={3} />
    <g transform={`translate(${((t * 0.4) % 40) - 20} 0)`} opacity={0.9}>
      <path d="M22 30 Q34 22 44 30 Q48 44 36 48 Q24 46 22 30 Z M56 56 Q70 50 76 62 Q70 76 58 72 Q52 64 56 56 Z" fill="#6DB85C" stroke={INK} strokeWidth={2} />
    </g>
    <ellipse cx="50" cy="50" rx="18" ry="44" fill="none" stroke={INK} strokeWidth={2} opacity={0.5} />
    <line x1="6" y1="50" x2="94" y2="50" stroke={INK} strokeWidth={2} opacity={0.5} />
    <text x="50" y="58" textAnchor="middle" fontFamily={FONT_CN} fontSize="20" fill={INK}>www</text>
  </svg>
);

export const Dice: React.FC<{size?: number; rot?: number}> = ({size = 150, rot = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${rot}deg)`}}>
    <rect x="10" y="10" width="80" height="80" rx="16" fill={C.white} stroke={INK} strokeWidth={SW} />
    {[[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={C.red} />)}
  </svg>
);

export const Magnifier: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M62 62 L90 90" stroke="#8B6A4E" strokeWidth={14} strokeLinecap="round" />
    <path d="M62 62 L90 90" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.3} />
    <circle cx="40" cy="40" r="28" fill="rgba(190,230,255,0.6)" stroke={INK} strokeWidth={SW + 2} />
    <path d="M26 30 Q30 20 42 18" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** 奶酪月亮 */
export const CheeseMoon: React.FC<{size?: number; t: number}> = ({size = 220, t}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${Math.sin(t * 0.05) * 6}deg)`}}>
    <circle cx="50" cy="50" r="44" fill="#F6D365" stroke={INK} strokeWidth={3.5} />
    {[[32, 34, 9], [62, 28, 6], [66, 60, 11], [36, 66, 7], [50, 48, 4]].map(([x, y, r]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#E8B84A" stroke={INK} strokeWidth={2} />
    ))}
  </svg>
);

export const Chalkboard: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) => (
  <div style={{width: w, height: h, boxSizing: 'border-box', background: '#2F4A45', border: `12px solid #8B6A4E`, outline: `4px solid ${INK}`, borderRadius: 12, padding: 24, position: 'relative', boxShadow: '6px 8px 0 rgba(43,35,32,0.18)'}}>
    {children}
  </div>
);

export const StarIcon: React.FC<{size?: number; fill?: string}> = ({size = 80, fill = C.white}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points="50,6 62,38 96,38 68,58 78,92 50,72 22,92 32,58 4,38 38,38" fill={fill} stroke={INK} strokeWidth={SW + 1} strokeLinejoin="round" />
  </svg>
);

export const Keyboard: React.FC<{w?: number; press?: number}> = ({w = 360, press = -1}) => {
  const keys = 10;
  const kw = (w - 30) / keys;
  return (
    <svg width={w} height={120} viewBox={`0 0 ${w} 120`}>
      <rect x="2" y="2" width={w - 4} height="116" rx="16" fill="#D8D3C8" stroke={INK} strokeWidth={SW} />
      {[0, 1, 2].map((r) =>
        Array.from({length: keys - r}, (_, i) => {
          const idx = r * 10 + i;
          const down = idx === press;
          return <rect key={idx} x={15 + r * kw * 0.5 + i * kw} y={14 + r * 34 + (down ? 3 : 0)} width={kw - 6} height="26" rx="5" fill={down ? C.yellow : C.white} stroke={INK} strokeWidth={2.5} />;
        }),
      )}
    </svg>
  );
};

export const Encyclopedia: React.FC<{size?: number}> = ({size = 200}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <rect x="12" y="6" width="76" height="104" rx="6" fill="#3A5BA0" stroke={INK} strokeWidth={SW} />
    <rect x="12" y="6" width="12" height="104" fill="#2A4478" stroke={INK} strokeWidth={SW} />
    <rect x="34" y="28" width="44" height="24" rx="3" fill="#F6D365" stroke={INK} strokeWidth={2.5} />
    <text x="56" y="46" textAnchor="middle" fontFamily={FONT_CN} fontSize="14" fill={INK}>百科</text>
    <line x1="34" y1="70" x2="78" y2="70" stroke="#F6D365" strokeWidth={3} />
    <line x1="34" y1="80" x2="70" y2="80" stroke="#F6D365" strokeWidth={3} />
  </svg>
);

export const Trophy: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M28 14 H72 V36 Q72 60 50 62 Q28 60 28 36 Z" fill={C.yellow} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M28 20 Q10 20 12 34 Q14 46 30 46 M72 20 Q90 20 88 34 Q86 46 70 46" fill="none" stroke={INK} strokeWidth={SW} />
    <rect x="44" y="62" width="12" height="14" fill={C.yellow} stroke={INK} strokeWidth={SW} />
    <rect x="30" y="76" width="40" height="14" rx="3" fill="#8B6A4E" stroke={INK} strokeWidth={SW} />
    <path d="M40 30 Q44 22 52 22" fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

export const TV: React.FC<{w?: number; t: number; children?: React.ReactNode}> = ({w = 420, t, children}) => (
  <div style={{position: 'relative', width: w, height: w * 0.82}}>
    <div style={{position: 'absolute', left: w * 0.3, top: 0, width: 6, height: w * 0.14, background: INK, transform: 'rotate(-30deg)', transformOrigin: 'bottom'}} />
    <div style={{position: 'absolute', left: w * 0.62, top: 0, width: 6, height: w * 0.14, background: INK, transform: 'rotate(30deg)', transformOrigin: 'bottom'}} />
    <div style={{position: 'absolute', left: 0, top: w * 0.12, width: w, height: w * 0.62, boxSizing: 'border-box', background: '#F2A0B4', border: `5px solid ${INK}`, borderRadius: 26, padding: 18, display: 'flex', gap: 14}}>
      <div style={{flex: 1, background: '#2B2F36', border: `4px solid ${INK}`, borderRadius: 18, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* 雪花噪点 */}
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.25}}>
          {Array.from({length: 60}, (_, i) => (
            <rect key={i} x={`${((i * 37 + t * 13) % 100)}%`} y={`${((i * 53 + t * 7) % 100)}%`} width="6" height="3" fill={C.white} />
          ))}
        </svg>
        {children}
      </div>
      <div style={{width: w * 0.12, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 10}}>
        {[0, 1].map((i) => <div key={i} style={{width: w * 0.1, height: w * 0.1, borderRadius: '50%', background: C.yellow, border: `4px solid ${INK}`, transform: `rotate(${t * (i ? 2 : -3)}deg)`}} />)}
      </div>
    </div>
  </div>
);

/** 带文字的圆角积木块（token / 接龙块） */
export const Block: React.FC<{text: string; color?: string; size?: number; dashed?: boolean}> = ({text, color = C.white, size = 70, dashed}) => (
  <div style={{minWidth: size, height: size, padding: `0 ${size * 0.18}px`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color, border: `4px ${dashed ? 'dashed' : 'solid'} ${INK}`, borderRadius: size * 0.2, fontFamily: FONT_CN, fontSize: size * 0.55, color: INK, boxShadow: '3px 4px 0 rgba(43,35,32,0.15)', whiteSpace: 'nowrap'}}>
    {text}
  </div>
);

/** 笔记本电脑，children 画在屏幕里（桌面壁纸已带） */
export const Laptop: React.FC<{w: number; h: number; children?: React.ReactNode}> = ({w, h, children}) => (
  <div style={{position: 'relative', width: w, height: h + h * 0.09}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, boxSizing: 'border-box', border: `6px solid ${C.ink}`, borderRadius: 22, background: C.ink, padding: 10}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(#CDEFE6, #9FDCCD)'}}>
        <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
          <ellipse cx="18" cy="66" rx="40" ry="16" fill="#8FD0B8" />
          <ellipse cx="82" cy="68" rx="42" ry="17" fill="#7CC4AA" />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 30, background: 'rgba(255,255,255,0.6)', borderBottom: `3px solid ${C.ink}`}} />
        {children}
      </div>
    </div>
    <div style={{position: 'absolute', left: -w * 0.05, top: h - 4, width: w * 1.1, height: h * 0.09, background: '#D8D3C8', border: `6px solid ${C.ink}`, borderRadius: '6px 6px 22px 22px', boxSizing: 'border-box'}} />
  </div>
);

/** 办公桌（正面）：w 为桌面宽度，桌面顶边在 y=0；hot 为 0..1 时桌边变红（放满了） */
export const Desk: React.FC<{w: number; hot?: number}> = ({w, hot = 0}) => (
  <svg width={w} height={300} viewBox={`0 0 ${w} 300`} style={{overflow: 'visible'}}>
    <rect x={0} y={0} width={w} height={46} rx={10} fill={hot > 0.5 ? '#E8A07A' : '#C8925F'} stroke={hot > 0.5 ? C.red : INK} strokeWidth={SW + 1} />
    <rect x={30} y={46} width={w - 60} height={30} fill="#A87848" stroke={INK} strokeWidth={SW} />
    {[40, w - 76].map((x) => <rect key={x} x={x} y={76} width={36} height={220} fill="#A87848" stroke={INK} strokeWidth={SW} />)}
  </svg>
);

/** 打开的冰箱（300×400 坐标）：上层两个番茄、中层半颗白菜、下层一盒鸡蛋；w 为显示宽度 */
export const FRIDGE_ITEMS = {tomato: {x: 95, y: 100}, cabbage: {x: 205, y: 225}, eggs: {x: 150, y: 345}};
export const Fridge: React.FC<{w?: number}> = ({w = 300}) => (
  <svg width={w} height={(w * 400) / 300} viewBox="0 0 300 400" style={{overflow: 'visible'}}>
    <rect x={6} y={6} width={288} height={388} rx={22} fill="#EAF6FB" stroke={INK} strokeWidth={SW + 2} />
    <rect x={24} y={24} width={252} height={352} rx={10} fill="#FFFDF2" stroke={INK} strokeWidth={SW} />
    {[150, 275].map((y) => <rect key={y} x={24} y={y} width={252} height={10} fill="#CFE6EF" stroke={INK} strokeWidth={3} />)}
    <rect x={40} y={30} width={220} height={14} rx={7} fill="#FFF6C8" opacity={0.9} />
    {/* 番茄 ×2 */}
    {[70, 122].map((x) => (
      <g key={x}>
        <circle cx={x} cy={118} r={28} fill={C.red} stroke={INK} strokeWidth={SW} />
        <path d={`M${x - 12} ${92} L${x} ${100} L${x + 12} ${92} M${x} ${100} L${x} ${88}`} stroke="#3F9A4A" strokeWidth={5} strokeLinecap="round" fill="none" />
        <circle cx={x - 10} cy={110} r={5} fill={C.white} opacity={0.7} />
      </g>
    ))}
    {/* 半颗白菜 */}
    <path d="M150 272 Q146 200 200 186 Q258 196 256 272 Z" fill="#BFE39A" stroke={INK} strokeWidth={SW} />
    <path d="M150 272 Q170 232 200 226 Q232 232 256 272 Z" fill="#F4F9E4" stroke={INK} strokeWidth={3} />
    <path d="M203 272 L203 214" stroke="#8CC06A" strokeWidth={4} />
    <rect x={50} y={220} width={70} height={52} rx={8} fill="#F2A0B4" stroke={INK} strokeWidth={SW} />
    {/* 一盒鸡蛋 */}
    <rect x={62} y={330} width={176} height={40} rx={8} fill="#D9B98C" stroke={INK} strokeWidth={SW} />
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={84 + i * 33} cy={328} rx={14} ry={17} fill="#FFF8E8" stroke={INK} strokeWidth={3} />)}
  </svg>
);

/** 盆栽（辨认植物用） */
export const Plant: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M30 70 L36 94 H64 L70 70 Z" fill={C.orange} stroke={INK} strokeWidth={3.5} />
    <path d="M50 70 Q48 44 50 26" stroke="#3F9A4A" strokeWidth={4} fill="none" />
    <path d="M50 52 Q28 50 22 32 Q42 32 50 50 Z M50 42 Q70 38 78 20 Q56 22 50 40 Z M50 28 Q44 14 50 4 Q58 14 50 28 Z" fill="#6DB85C" stroke={INK} strokeWidth={3} />
    <circle cx="74" cy="22" r="7" fill="#F2A0B4" stroke={INK} strokeWidth={2.5} />
  </svg>
);

/** 一幅风景画（太阳、山、房子），360×360 坐标；view 传 [x, y, w, h] 只画其中一块，用来演示“把图切成小方块” */
export const Scenery: React.FC<{size?: number; view?: [number, number, number, number]}> = ({size = 360, view = [0, 0, 360, 360]}) => (
  <svg width={size} height={size} viewBox={view.join(' ')} style={{display: 'block'}}>
    <rect width={360} height={360} fill="#BFE3F2" />
    <circle cx={275} cy={80} r={42} fill={C.yellow} stroke={INK} strokeWidth={4} />
    <path d="M-10 250 L100 120 L190 230 L250 160 L370 270 V370 H-10 Z" fill="#8FD0B8" stroke={INK} strokeWidth={4} />
    <rect x={0} y={270} width={360} height={90} fill="#6DB85C" />
    <rect x={60} y={230} width={90} height={80} fill={C.white} stroke={INK} strokeWidth={4} />
    <path d="M50 234 L105 190 L160 234 Z" fill={C.red} stroke={INK} strokeWidth={4} />
    <rect x={92} y={262} width={26} height={48} fill={C.orange} stroke={INK} strokeWidth={3} />
    <path d="M40 60 Q52 46 66 58 Q80 48 88 62 Q96 74 80 76 H44 Q30 72 40 60 Z" fill={C.white} stroke={INK} strokeWidth={3} />
  </svg>
);

/** 天平：tilt 为 -1..1，正数右边沉；left/right 是两边托盘上的内容 */
export const Balance: React.FC<{w?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode}> = ({w = 420, tilt = 0, left, right}) => {
  const a = tilt * 14;
  const half = w / 2 - 30;
  const dy = Math.sin((a * Math.PI) / 180) * half;
  return (
    <div style={{position: 'relative', width: w, height: w * 0.75}}>
      <svg width={w} height={w * 0.75} viewBox={`0 0 ${w} ${w * 0.75}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={`M${w / 2 - 70} ${w * 0.75 - 6} H${w / 2 + 70} L${w / 2 + 40} ${w * 0.75 - 30} H${w / 2 - 40} Z`} fill="#B8865B" stroke={INK} strokeWidth={SW} />
        <rect x={w / 2 - 8} y={60} width={16} height={w * 0.75 - 90} fill="#B8865B" stroke={INK} strokeWidth={SW} />
        <g transform={`rotate(${a} ${w / 2} 60)`}>
          <rect x={30} y={52} width={w - 60} height={16} rx={8} fill={C.yellow} stroke={INK} strokeWidth={SW} />
        </g>
        <circle cx={w / 2} cy={60} r={14} fill={C.orange} stroke={INK} strokeWidth={SW} />
        {[-1, 1].map((s) => {
          const x = w / 2 + s * half;
          const y = 60 + s * dy;
          return (
            <g key={s}>
              <line x1={x} y1={y} x2={x - 50} y2={y + 90} stroke={INK} strokeWidth={3} />
              <line x1={x} y1={y} x2={x + 50} y2={y + 90} stroke={INK} strokeWidth={3} />
              <path d={`M${x - 70} ${y + 90} H${x + 70} Q${x} ${y + 130} ${x - 70} ${y + 90} Z`} fill={C.white} stroke={INK} strokeWidth={SW} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 30 - 40, top: 60 - dy + 30, width: 140, display: 'flex', justifyContent: 'center'}}>{left}</div>
      <div style={{position: 'absolute', left: w - 30 - 100, top: 60 + dy + 30, width: 140, display: 'flex', justifyContent: 'center'}}>{right}</div>
    </div>
  );
};
