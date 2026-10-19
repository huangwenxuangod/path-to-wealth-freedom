import React from 'react';
import {V, VF} from '../../library/vox/theme';

/* ============ 灰度示意画（交给 HalftonePhoto 做成网点，明暗反差要大） ============ */

/** 丹尼斯餐厅的卡座 */
export const DinerArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 230" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={230} fill="#cfcfcf" />
    <rect x={0} y={0} width={340} height={70} fill="#efefef" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 82} y={10} width={64} height={50} fill="#3a3a3a" />)}
    <rect x={20} y={80} width={70} height={140} rx={10} fill="#2a2a2a" />
    <rect x={250} y={80} width={70} height={140} rx={10} fill="#2a2a2a" />
    <rect x={96} y={120} width={148} height={16} fill="#f2f2f2" />
    <rect x={164} y={136} width={12} height={90} fill="#555" />
    <ellipse cx={130} cy={116} rx={16} ry={6} fill="#f2f2f2" stroke="#111" strokeWidth={3} />
    <rect x={190} y={100} width={14} height={18} fill="#111" />
    <rect x={120} y={104} width={60} height={10} fill="#8a8a8a" transform="rotate(-6 150 108)" />
  </svg>
);

/** 一张显卡（NV1 / RIVA 128 / GeForce 都用它，label 区分） */
export const CardArt: React.FC<{w: number; h: number; fan?: boolean}> = ({w, h, fan}) => (
  <svg width={w} height={h} viewBox="0 0 340 220" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={220} fill="#9a9a9a" />
    <rect x={20} y={40} width={300} height={130} fill="#1f1f1f" />
    <rect x={40} y={170} width={180} height={18} fill="#d0d0d0" />
    {Array.from({length: 18}, (_, k) => <rect key={k} x={44 + k * 10} y={172} width={5} height={14} fill="#555" />)}
    <rect x={120} y={70} width={80} height={70} fill="#3a3a3a" stroke="#e0e0e0" strokeWidth={3} />
    {fan && <circle cx={160} cy={105} r={46} fill="#2a2a2a" stroke="#e0e0e0" strokeWidth={4} />}
    {fan && Array.from({length: 7}, (_, k) => <line key={k} x1={160} y1={105} x2={160 + Math.cos(k) * 42} y2={105 + Math.sin(k) * 42} stroke="#e0e0e0" strokeWidth={4} />)}
    {[40, 230, 270].map((x) => <rect key={x} x={x} y={60} width={28} height={40} fill="#5a5a5a" />)}
    <rect x={300} y={40} width={20} height={130} fill="#bdbdbd" />
  </svg>
);

/** DGX-1：一台黑色机箱，前面一排金属网格 */
export const DgxArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 220" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={220} fill="#cfcfcf" />
    <rect x={0} y={170} width={340} height={50} fill="#5a5a5a" />
    <rect x={30} y={50} width={280} height={130} fill="#141414" />
    {Array.from({length: 8}, (_, r) =>
      Array.from({length: 20}, (_, c) => <rect key={`${r}${c}`} x={44 + c * 13} y={62 + r * 13} width={8} height={8} fill="#6a6a6a" />),
    )}
    <rect x={44} y={166} width={250} height={8} fill="#9a9a9a" />
    <rect x={100} y={18} width={140} height={28} fill="#efefef" transform="rotate(-4 170 32)" />
  </svg>
);

/* ============ 彩色贴纸 ============ */

const ink = V.ink;
const red = V.red;
const green = '#76b900';

export const AlarmClock: React.FC = () => (
  <svg width={190} height={200} viewBox="0 0 190 200">
    <circle cx={40} cy={34} r={24} fill={red} stroke={ink} strokeWidth={4} />
    <circle cx={150} cy={34} r={24} fill={red} stroke={ink} strokeWidth={4} />
    <circle cx={95} cy={105} r={78} fill="#fff" stroke={ink} strokeWidth={6} />
    {Array.from({length: 12}, (_, k) => {
      const a = (k / 12) * Math.PI * 2;
      return <line key={k} x1={95 + Math.sin(a) * 62} y1={105 - Math.cos(a) * 62} x2={95 + Math.sin(a) * 70} y2={105 - Math.cos(a) * 70} stroke={ink} strokeWidth={4} />;
    })}
    <line x1={95} y1={105} x2={95 + Math.sin((4 / 12) * Math.PI * 2) * 40} y2={105 - Math.cos((4 / 12) * Math.PI * 2) * 40} stroke={ink} strokeWidth={8} strokeLinecap="round" />
    <line x1={95} y1={105} x2={95} y2={45} stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <path d="M40 180 L28 196 M150 180 L162 196" stroke={ink} strokeWidth={6} />
  </svg>
);

/** 撕页日历：大大的天数 */
export const TearCalendar: React.FC<{n: number | string; top?: string}> = ({n, top = '离倒闭还有'}) => (
  <div style={{width: 210, background: '#fff', textAlign: 'center', fontFamily: VF.heavy, boxShadow: '0 3px 0 #ddd, 0 6px 0 #ccc'}}>
    <div style={{background: red, color: '#fff', fontSize: 26, padding: '6px 0'}}>{top}</div>
    <div style={{fontFamily: VF.num, fontSize: 130, color: ink, lineHeight: 1.05}}>{n}</div>
    <div style={{fontSize: 30, color: ink, paddingBottom: 10}}>天</div>
  </div>
);

export const Mic: React.FC = () => (
  <svg width={130} height={210} viewBox="0 0 130 210">
    <rect x={35} y={6} width={60} height={100} rx={30} fill="#3a3a3a" stroke={ink} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={40} y1={30 + i * 18} x2={90} y2={30 + i * 18} stroke="#9a9a9a" strokeWidth={3} />)}
    <path d="M20 80 Q20 140 65 140 Q110 140 110 80" stroke={ink} strokeWidth={7} fill="none" />
    <rect x={60} y={140} width={10} height={44} fill={ink} />
    <rect x={30} y={184} width={70} height={14} rx={6} fill={ink} />
  </svg>
);

export const Plates: React.FC = () => (
  <svg width={190} height={140} viewBox="0 0 190 140">
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <ellipse cx={95} cy={110 - i * 14} rx={80} ry={18} fill="#f7f7f5" stroke={ink} strokeWidth={3} />
        <ellipse cx={95} cy={108 - i * 14} rx={50} ry={9} fill="none" stroke="#9cc0dc" strokeWidth={3} />
      </g>
    ))}
    <path d="M150 20 Q170 10 176 30 M160 8 Q178 0 184 18" stroke="#9cc0dc" strokeWidth={4} fill="none" />
  </svg>
);

export const Mug: React.FC = () => (
  <svg width={130} height={150} viewBox="0 0 130 150">
    <path d="M36 36 Q26 18 40 4 M60 36 Q50 18 64 4" stroke="#9a9a9a" strokeWidth={5} fill="none" />
    <path d="M10 46 L96 46 L90 142 L16 142 Z" fill="#fff" stroke={ink} strokeWidth={4} />
    <rect x={10} y={70} width={86} height={14} fill={red} />
    <path d="M96 64 Q124 64 122 90 Q120 114 92 114" fill="none" stroke={ink} strokeWidth={8} />
  </svg>
);

/** 两种画 3D 的办法：曲面（NV1） vs 三角形（微软 DirectX） */
export const CurveVsTri: React.FC<{tri?: boolean}> = ({tri}) =>
  tri ? (
    <svg width={160} height={130} viewBox="0 0 160 130">
      {[[10, 120, 60, 20, 110, 120], [60, 20, 110, 120, 150, 30]].map((p, i) => (
        <path key={i} d={`M${p[0]} ${p[1]} L${p[2]} ${p[3]} L${p[4]} ${p[5]} Z`} fill={i ? '#9cc0dc' : '#cfe3f1'} stroke={ink} strokeWidth={4} />
      ))}
    </svg>
  ) : (
    <svg width={160} height={130} viewBox="0 0 160 130">
      <path d="M10 110 Q40 10 80 60 T150 40 L150 110 Z" fill="#e9c08a" stroke={ink} strokeWidth={4} />
      <path d="M10 110 Q60 70 150 110" stroke={ink} strokeWidth={3} fill="none" strokeDasharray="8 6" />
    </svg>
  );

export const Console: React.FC = () => (
  <svg width={240} height={150} viewBox="0 0 240 150">
    <rect x={20} y={40} width={200} height={90} rx={14} fill="#2d2d2b" stroke={ink} strokeWidth={4} />
    <circle cx={120} cy={84} r={30} fill="#3c3c3a" stroke="#888" strokeWidth={3} />
    <rect x={40} y={56} width={40} height={10} rx={4} fill="#888" />
    <rect x={160} y={110} width={40} height={8} fill="#2f6ad6" />
    <text x={120} y={30} textAnchor="middle" fontFamily={VF.heavy} fontSize={26} fill={ink}>游戏机</text>
  </svg>
);

export const Plane: React.FC = () => (
  <svg width={220} height={110} viewBox="0 0 220 110">
    <path d="M10 60 Q60 50 180 52 Q214 54 214 62 Q214 70 180 70 Q60 72 10 64 Z" fill="#fff" stroke={ink} strokeWidth={4} />
    <path d="M90 56 L60 10 L84 10 L130 56 Z M90 68 L60 104 L84 104 L130 68 Z" fill="#9cc0dc" stroke={ink} strokeWidth={3} />
    <path d="M24 58 L10 30 L26 30 L44 58 Z" fill={red} stroke={ink} strokeWidth={3} />
    {[140, 156, 172].map((x) => <circle key={x} cx={x} cy={60} r={4} fill="#3d6aa8" />)}
  </svg>
);

/** 一颗芯片（label 写在上面，color 是封装颜色） */
export const Chip: React.FC<{label: string; color?: string; s?: number}> = ({label, color = '#2a2d31', s = 180}) => (
  <svg width={s} height={s} viewBox="0 0 190 190">
    {Array.from({length: 8}, (_, i) => (
      <g key={i} fill="#c9b04a">
        <rect x={34 + i * 16} y={4} width={7} height={22} />
        <rect x={34 + i * 16} y={164} width={7} height={22} />
        <rect x={4} y={34 + i * 16} width={22} height={7} />
        <rect x={164} y={34 + i * 16} width={22} height={7} />
      </g>
    ))}
    <rect x={24} y={24} width={142} height={142} rx={10} fill={color} />
    <rect x={44} y={44} width={102} height={102} rx={6} fill="rgba(255,255,255,0.08)" stroke="#9aa3ad" strokeWidth={3} />
    <text x={95} y={106} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={label.length > 6 ? 22 : 32} fill="#e9e6d8">{label}</text>
  </svg>
);

/** 带风扇的显卡（彩色） */
export const GpuCard: React.FC<{label: string}> = ({label}) => (
  <svg width={300} height={140} viewBox="0 0 300 140">
    <rect x={6} y={10} width={288} height={100} rx={8} fill="#26292d" stroke={ink} strokeWidth={4} />
    <rect x={6} y={10} width={288} height={14} fill={green} />
    {[90, 200].map((x) => (
      <g key={x}>
        <circle cx={x} cy={64} r={36} fill="#3a3e44" stroke="#9aa3ad" strokeWidth={3} />
        {Array.from({length: 7}, (_, k) => <line key={k} x1={x} y1={64} x2={x + Math.cos(k * 0.9) * 32} y2={64 + Math.sin(k * 0.9) * 32} stroke="#9aa3ad" strokeWidth={4} />)}
      </g>
    ))}
    <rect x={40} y={110} width={170} height={16} fill="#c9b04a" />
    <text x={260} y={102} textAnchor="end" fontFamily="Anton, sans-serif" fontSize={20} fill="#e9e6d8">{label}</text>
  </svg>
);

/** 矿机：一排显卡架在铁架子上，旁边一枚币 */
export const MiningRig: React.FC = () => (
  <svg width={280} height={200} viewBox="0 0 280 200">
    <rect x={10} y={30} width={200} height={150} fill="none" stroke="#7d858e" strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={24 + i * 36} y={44} width={26} height={120} fill="#26292d" stroke={ink} strokeWidth={3} />
        <circle cx={37 + i * 36} cy={80} r={9} fill="#3a3e44" stroke="#9aa3ad" strokeWidth={2} />
        <circle cx={37 + i * 36} cy={124} r={9} fill="#3a3e44" stroke="#9aa3ad" strokeWidth={2} />
      </g>
    ))}
    <circle cx={238} cy={120} r={36} fill="#e9a03a" stroke={ink} strokeWidth={4} />
    <circle cx={238} cy={120} r={26} fill="none" stroke="#b97a1a" strokeWidth={3} />
    <text x={238} y={134} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={40} fill="#fff">B</text>
  </svg>
);

/** 一摞卖不出去的显卡盒子 */
export const BoxPile: React.FC = () => (
  <svg width={260} height={200} viewBox="0 0 260 200">
    {[[10, 120], [90, 120], [170, 120], [50, 60], [130, 60], [90, 0]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y + 10} width={80} height={60} fill="#26292d" stroke={ink} strokeWidth={3} />
        <rect x={x} y={y + 10} width={80} height={12} fill={green} />
        <text x={x + 40} y={y + 56} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={16} fill="#e9e6d8">GTX</text>
      </g>
    ))}
  </svg>
);

/** 代码卡：CUDA 的样子 */
export const CodeCard: React.FC<{lines: string[]; shown: number}> = ({lines, shown}) => (
  <div style={{width: 520, background: '#1d1f1c', padding: '18px 22px', fontFamily: `'Courier New', monospace`, fontSize: 22, lineHeight: 1.55, color: '#9fe39a', boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
    {lines.map((l, i) => (
      <div key={i} style={{opacity: i < shown ? 1 : 0, whiteSpace: 'pre', color: l.startsWith('//') ? '#7d858e' : '#9fe39a'}}>
        {l}
      </div>
    ))}
  </div>
);

export const Atom: React.FC = () => (
  <svg width={170} height={170} viewBox="-85 -85 170 170">
    {[0, 60, 120].map((a) => (
      <ellipse key={a} cx={0} cy={0} rx={74} ry={26} fill="none" stroke="#3d6aa8" strokeWidth={6} transform={`rotate(${a})`} />
    ))}
    <circle cx={0} cy={0} r={14} fill={red} />
  </svg>
);

/** 大模型数据中心：一排排机柜 */
export const Racks: React.FC = () => (
  <svg width={300} height={200} viewBox="0 0 300 200">
    {[0, 1, 2, 3, 4].map((k) => (
      <g key={k} transform={`translate(${k * 58} 0)`}>
        <rect x={6} y={6} width={50} height={188} fill="#24272b" stroke={ink} strokeWidth={3} />
        {Array.from({length: 10}, (_, i) => (
          <g key={i}>
            <rect x={12} y={14 + i * 18} width={38} height={12} fill="#3c4148" />
            <circle cx={44} cy={20 + i * 18} r={2.5} fill={(i + k) % 3 ? green : red} />
          </g>
        ))}
      </g>
    ))}
  </svg>
);
