import React from 'react';
import {V, VF} from '../../library/vox/theme';

/* ============ 灰度示意画（交给 HalftonePhoto 做成网点，明暗反差要大） ============ */

/** 乔布斯家的车库 */
export const GarageArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 230" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={230} fill="#cfcfcf" />
    <rect x={0} y={190} width={340} height={40} fill="#5a5a5a" />
    <path d="M30 90 L170 30 L310 90 Z" fill="#2a2a2a" />
    <rect x={44} y={88} width={252} height={104} fill="#efefef" />
    <rect x={70} y={104} width={200} height={88} fill="#3a3a3a" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={70} y={112 + i * 20} width={200} height={4} fill="#9a9a9a" />)}
    <rect x={300} y={140} width={30} height={52} fill="#1a1a1a" />
    <circle cx={22} cy={150} r={26} fill="#3a3a3a" />
  </svg>
);

/** Apple I：木头机箱 + 主板 + 键盘 */
export const AppleOneArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 230" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={230} fill="#d2d2d2" />
    <path d="M30 70 L310 70 L330 190 L10 190 Z" fill="#6a6a6a" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${24 + i * 4} ${90 + i * 20} L${316 - i * 4} ${90 + i * 20}`} stroke="#4a4a4a" strokeWidth={3} />)}
    <rect x={50} y={20} width={240} height={70} fill="#2a2a2a" />
    {Array.from({length: 24}, (_, k) => <rect key={k} x={60 + (k % 12) * 19} y={30 + Math.floor(k / 12) * 26} width={12} height={16} fill="#e8e8e8" />)}
    {Array.from({length: 33}, (_, k) => <rect key={k} x={40 + (k % 11) * 24} y={120 + Math.floor(k / 11) * 22} width={18} height={16} fill="#f0f0f0" />)}
  </svg>
);

/** Apple II：一体键盘 + 上面一台显示器 */
export const AppleTwoArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 240" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={240} fill="#9a9a9a" />
    <rect x={0} y={200} width={340} height={40} fill="#4a4a4a" />
    <rect x={70} y={10} width={200} height={130} rx={10} fill="#2a2a2a" />
    <rect x={88} y={24} width={164} height={100} fill="#e8e8e8" />
    {Array.from({length: 6}, (_, k) => <rect key={k} x={98} y={34 + k * 14} width={40 + ((k * 53) % 100)} height={6} fill="#222" />)}
    <path d="M40 150 L300 150 L320 200 L20 200 Z" fill="#efefef" stroke="#222" strokeWidth={3} />
    {Array.from({length: 36}, (_, k) => <rect key={k} x={48 + (k % 12) * 21} y={160 + Math.floor(k / 12) * 12} width={16} height={8} fill="#3a3a3a" />)}
  </svg>
);

/** 麦金塔：竖着的一体机，屏幕上一行 hello */
export const MacArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
    <rect width={300} height={240} fill="#7a7a7a" />
    <rect x={0} y={210} width={300} height={30} fill="#3a3a3a" />
    <rect x={80} y={10} width={140} height={190} rx={8} fill="#efefef" stroke="#222" strokeWidth={3} />
    <rect x={96} y={26} width={108} height={84} fill="#1d1d1d" />
    <text x={150} y={78} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={26} fill="#f2f2f2">hello</text>
    <rect x={150} y={140} width={46} height={6} fill="#222" />
    <rect x={92} y={196} width={116} height={12} fill="#bdbdbd" />
    <rect x={226} y={170} width={40} height={30} rx={14} fill="#e6e6e6" stroke="#222" strokeWidth={3} />
  </svg>
);

/** 1984 广告：一排排灰色的人看着大屏，一个人跑进来扔锤子 */
export const Ad1984Art: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 230" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={230} fill="#3a3a3a" />
    <rect x={90} y={14} width={160} height={110} fill="#bdbdbd" />
    <ellipse cx={170} cy={66} rx={34} ry={42} fill="#2a2a2a" />
    <rect x={146} y={56} width={48} height={8} fill="#cfcfcf" />
    {Array.from({length: 3}, (_, r) =>
      Array.from({length: 9}, (_, c) => <circle key={`${r}${c}`} cx={22 + c * 37} cy={160 + r * 26} r={12} fill="#6a6a6a" />),
    )}
    <g transform="translate(40 120)">
      <circle cx={10} cy={-10} r={9} fill="#f5f5f5" />
      <path d="M2 0 L18 0 L22 40 L-2 40 Z" fill="#f5f5f5" />
      <path d="M18 6 L56 -26" stroke="#f5f5f5" strokeWidth={6} />
      <rect x={50} y={-38} width={22} height={14} fill="#f5f5f5" transform="rotate(-40 60 -30)" />
    </g>
  </svg>
);

/** 发布会大屏 + 台上的人（图案由 screen 决定） */
export const StageArt: React.FC<{w: number; h: number; screen: 'face' | 'phone'}> = ({w, h, screen}) => (
  <svg width={w} height={h} viewBox="0 0 340 230" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={230} fill="#1a1a1a" />
    <rect x={40} y={14} width={260} height={150} fill="#c9c9c9" />
    {screen === 'face' ? (
      <>
        <ellipse cx={170} cy={92} rx={58} ry={70} fill="#7a7a7a" />
        <path d="M112 70 Q170 10 228 70 Q220 40 170 30 Q120 40 112 70 Z" fill="#3a3a3a" />
        <g stroke="#222" strokeWidth={5} fill="none">
          <circle cx={148} cy={92} r={14} />
          <circle cx={192} cy={92} r={14} />
        </g>
      </>
    ) : (
      <>
        <rect x={134} y={26} width={72} height={128} rx={12} fill="#1a1a1a" />
        <rect x={142} y={40} width={56} height={98} fill="#e8e8e8" />
        {Array.from({length: 12}, (_, k) => <rect key={k} x={146 + (k % 3) * 18} y={44 + Math.floor(k / 3) * 22} width={12} height={12} rx={3} fill="#555" />)}
      </>
    )}
    <rect x={0} y={190} width={340} height={40} fill="#3a3a3a" />
    <g transform="translate(70 150)">
      <circle cx={0} cy={0} r={9} fill="#e8e8e8" />
      <path d="M-10 10 L10 10 L12 44 L-12 44 Z" fill="#0a0a0a" />
    </g>
  </svg>
);

/* ============ 彩色贴纸（扁平、三四个颜色） ============ */

const ink = V.ink;
const red = V.red;

export const VwBus: React.FC = () => (
  <svg width={240} height={140} viewBox="0 0 240 140">
    <path d="M14 60 Q14 14 60 14 L200 14 Q226 14 228 40 L232 104 L10 104 Z" fill="#e8e1cf" stroke={ink} strokeWidth={4} />
    <path d="M10 64 L232 64 L232 104 L10 104 Z" fill="#c95b45" stroke={ink} strokeWidth={4} />
    {[30, 80, 130, 176].map((x) => <rect key={x} x={x} y={24} width={40} height={30} rx={6} fill="#9cc0dc" stroke={ink} strokeWidth={3} />)}
    {[54, 186].map((x) => (
      <g key={x}>
        <circle cx={x} cy={108} r={20} fill={ink} />
        <circle cx={x} cy={108} r={8} fill="#bbb" />
      </g>
    ))}
  </svg>
);

export const Calculator: React.FC = () => (
  <svg width={110} height={180} viewBox="0 0 110 180">
    <rect x={4} y={4} width={102} height={172} rx={10} fill="#2c2c2c" />
    <rect x={14} y={14} width={82} height={34} fill="#5a1d1d" />
    <text x={90} y={40} textAnchor="end" fontFamily="Courier New" fontWeight={700} fontSize={20} fill="#ff6a5a">3.14159</text>
    {Array.from({length: 20}, (_, k) => <rect key={k} x={14 + (k % 4) * 21} y={58 + Math.floor(k / 4) * 22} width={16} height={14} rx={2} fill={k % 4 === 3 ? '#e6a43a' : '#e8e1cf'} />)}
  </svg>
);

export const House: React.FC = () => (
  <svg width={170} height={150} viewBox="0 0 170 150">
    <path d="M10 70 L85 8 L160 70 Z" fill={red} stroke={ink} strokeWidth={4} />
    <rect x={26} y={68} width={118} height={78} fill="#efe6cf" stroke={ink} strokeWidth={4} />
    <rect x={72} y={96} width={28} height={50} fill="#8a5a2b" />
    <rect x={38} y={84} width={24} height={22} fill="#9cc0dc" stroke={ink} strokeWidth={3} />
    <rect x={110} y={84} width={24} height={22} fill="#9cc0dc" stroke={ink} strokeWidth={3} />
  </svg>
);

/** 股份饼图：45 / 45 / 10，pop 为 10% 那块往外飞出的距离 */
export const SharePie: React.FC<{pop?: number}> = ({pop = 0}) => {
  const arc = (a0: number, a1: number, r: number, dx = 0, dy = 0) => {
    const p = (a: number) => [100 + dx + r * Math.cos(a), 100 + dy + r * Math.sin(a)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${100 + dx} ${100 + dy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  const T = Math.PI * 2;
  const mid = -Math.PI / 2 + T * 0.95;
  return (
    <svg width={260} height={220} viewBox="-20 -10 260 220" style={{overflow: 'visible'}}>
      <path d={arc(-Math.PI / 2, -Math.PI / 2 + T * 0.45, 90)} fill="#3f3f3d" stroke="#fff" strokeWidth={4} />
      <path d={arc(-Math.PI / 2 + T * 0.45, -Math.PI / 2 + T * 0.9, 90)} fill="#8a847c" stroke="#fff" strokeWidth={4} />
      <path d={arc(-Math.PI / 2 + T * 0.9, -Math.PI / 2 + T, 90, Math.cos(mid) * pop, Math.sin(mid) * pop)} fill={red} stroke="#fff" strokeWidth={4} />
      <text x={150} y={130} fontFamily={VF.heavy} fontSize={26} fill="#fff">乔布斯 45%</text>
      <text x={18} y={88} fontFamily={VF.heavy} fontSize={26} fill="#fff">沃兹 45%</text>
      <text x={80 + Math.cos(mid) * (60 + pop)} y={30 + Math.sin(mid) * pop} fontFamily={VF.heavy} fontSize={26} fill={red}>韦恩 10%</text>
    </svg>
  );
};

export const ColaCan: React.FC = () => (
  <svg width={100} height={170} viewBox="0 0 100 170">
    <rect x={10} y={14} width={80} height={146} rx={12} fill="#1f3f8a" stroke={ink} strokeWidth={4} />
    <rect x={18} y={6} width={64} height={12} rx={4} fill="#b9b9b9" stroke={ink} strokeWidth={3} />
    <path d="M10 70 Q50 50 90 80 L90 100 Q50 70 10 92 Z" fill={red} />
    <path d="M10 92 Q50 70 90 100 L90 108 Q50 82 10 100 Z" fill="#fff" />
    <text x={50} y={140} textAnchor="middle" fontFamily={VF.heavy} fontSize={20} fill="#fff">可乐</text>
  </svg>
);

/** 纸箱：离开公司那天收拾东西 */
export const Box: React.FC = () => (
  <svg width={200} height={170} viewBox="0 0 200 170">
    <rect x={30} y={10} width={30} height={60} fill="#efefef" stroke={ink} strokeWidth={3} transform="rotate(-12 45 40)" />
    <circle cx={140} cy={36} r={22} fill="#9fbf8f" stroke={ink} strokeWidth={3} />
    <rect x={136} y={56} width={8} height={20} fill="#6a4a2a" />
    <path d="M10 70 L190 70 L176 166 L24 166 Z" fill="#c9a26b" stroke={ink} strokeWidth={4} />
    <path d="M10 70 L40 50 L160 50 L190 70" fill="#b38b55" stroke={ink} strokeWidth={4} />
  </svg>
);

export const NextCube: React.FC = () => (
  <svg width={180} height={180} viewBox="0 0 180 180">
    <path d="M90 10 L168 50 L168 130 L90 170 L12 130 L12 50 Z" fill="#1b1b1a" />
    <path d="M90 10 L168 50 L90 90 L12 50 Z" fill="#3a3a38" />
    <path d="M90 90 L168 50 L168 130 L90 170 Z" fill="#242423" />
    <text x={50} y={128} fontFamily={VF.heavy} fontSize={22} fill="#e9a03a" transform="rotate(-24 50 128)">Ne</text>
    <text x={76} y={116} fontFamily={VF.heavy} fontSize={22} fill="#5bb36a" transform="rotate(-24 76 116)">X</text>
    <text x={96} y={106} fontFamily={VF.heavy} fontSize={22} fill="#c75b9a" transform="rotate(-24 96 106)">T</text>
  </svg>
);

/** 90 年代的米色电脑盒子，name 是型号 */
export const BeigeBox: React.FC<{name: string}> = ({name}) => (
  <div style={{width: 170, background: '#e9e1cc', border: `3px solid ${ink}`, padding: '10px 10px 8px', boxShadow: '3px 5px 6px rgba(23,23,22,0.3)'}}>
    <div style={{height: 64, background: '#3a3a38', marginBottom: 8}} />
    <div style={{fontFamily: VF.bodyBold, fontSize: 21, color: ink, textAlign: 'center', whiteSpace: 'nowrap'}}>{name}</div>
  </div>
);

export const OfficeBox: React.FC = () => (
  <svg width={170} height={200} viewBox="0 0 170 200">
    <path d="M20 30 L130 10 L150 30 L150 190 L40 190 L20 170 Z" fill="#d9822b" stroke={ink} strokeWidth={4} />
    <path d="M40 30 L150 30 L150 190 L40 190 Z" fill="#f2a548" stroke={ink} strokeWidth={4} />
    <text x={95} y={90} textAnchor="middle" fontFamily={VF.heavy} fontSize={28} fill="#fff">Office</text>
    <text x={95} y={124} textAnchor="middle" fontFamily={VF.bodyBold} fontSize={20} fill={ink}>for Mac</text>
  </svg>
);

export const IMacG3: React.FC = () => (
  <svg width={220} height={220} viewBox="0 0 220 220">
    <path d="M30 20 Q30 6 46 6 L174 6 Q190 6 190 20 L198 170 Q198 186 182 186 L38 186 Q22 186 22 170 Z" fill="rgba(70,170,200,0.85)" stroke={ink} strokeWidth={4} />
    <rect x={50} y={26} width={120} height={96} rx={6} fill="#2a2d31" />
    <rect x={58} y={34} width={104} height={80} fill="#cfe8f2" />
    <path d="M30 140 Q110 120 190 140 L196 176 Q110 160 24 176 Z" fill="rgba(255,255,255,0.45)" />
    <rect x={90} y={186} width={40} height={20} fill="#b9c2c8" stroke={ink} strokeWidth={3} />
    <ellipse cx={110} cy={210} rx={60} ry={8} fill="#b9c2c8" stroke={ink} strokeWidth={3} />
  </svg>
);

export const IPod: React.FC = () => (
  <svg width={120} height={200} viewBox="0 0 120 200">
    <rect x={6} y={6} width={108} height={188} rx={16} fill="#f7f7f5" stroke={ink} strokeWidth={4} />
    <rect x={18} y={18} width={84} height={64} rx={4} fill="#9cc0dc" stroke={ink} strokeWidth={3} />
    <circle cx={60} cy={136} r={38} fill="#e6e6e3" stroke={ink} strokeWidth={3} />
    <circle cx={60} cy={136} r={14} fill="#f7f7f5" stroke={ink} strokeWidth={3} />
    <path d="M60 46 L60 70 M60 46 L74 42 L74 64" stroke={ink} strokeWidth={4} fill="none" />
    <circle cx={56} cy={70} r={5} fill={ink} />
    <circle cx={70} cy={66} r={5} fill={ink} />
  </svg>
);

/** iPhone，apps 是屏幕上已经出现的图标个数 */
export const IPhone: React.FC<{apps?: number}> = ({apps = 16}) => (
  <svg width={140} height={260} viewBox="0 0 140 260">
    <rect x={4} y={4} width={132} height={252} rx={22} fill="#1b1b1a" />
    <rect x={14} y={34} width={112} height={180} fill="#e8eef2" />
    {Array.from({length: Math.min(16, apps)}, (_, k) => (
      <rect key={k} x={20 + (k % 4) * 26} y={42 + Math.floor(k / 4) * 32} width={20} height={20} rx={5} fill={['#e0574a', '#5bb36a', '#4f8fd6', '#e9a03a', '#9b6cd1', '#2fb3b0'][k % 6]} />
    ))}
    <circle cx={70} cy={234} r={11} fill="none" stroke="#666" strokeWidth={3} />
  </svg>
);

/** 苹果自研芯片 */
export const AppleChip: React.FC<{label: string}> = ({label}) => (
  <svg width={190} height={190} viewBox="0 0 190 190">
    {Array.from({length: 8}, (_, i) => (
      <g key={i} fill="#b9b4ab">
        <rect x={34 + i * 16} y={4} width={7} height={22} />
        <rect x={34 + i * 16} y={164} width={7} height={22} />
        <rect x={4} y={34 + i * 16} width={22} height={7} />
        <rect x={164} y={34 + i * 16} width={22} height={7} />
      </g>
    ))}
    <rect x={24} y={24} width={142} height={142} rx={14} fill="#2a2d31" />
    <rect x={44} y={44} width={102} height={102} rx={8} fill="#3f454c" stroke="#9aa3ad" strokeWidth={3} />
    <text x={95} y={112} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={44} fill="#e9e6d8">{label}</text>
  </svg>
);

export const Cake50: React.FC<{lit?: boolean}> = ({lit = true}) => (
  <svg width={220} height={200} viewBox="0 0 220 200">
    {[70, 150].map((x, i) => (
      <g key={x}>
        <rect x={x - 8} y={26} width={16} height={50} fill={i ? '#4f8fd6' : red} />
        {lit && <path d={`M${x} 6 Q${x + 10} 18 ${x} 26 Q${x - 10} 18 ${x} 6 Z`} fill="#e9a03a" />}
      </g>
    ))}
    <text x={70} y={64} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={30} fill="#fff">5</text>
    <text x={150} y={64} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={30} fill="#fff">0</text>
    <rect x={20} y={76} width={180} height={56} rx={8} fill="#f3d9de" stroke={ink} strokeWidth={4} />
    <path d="M20 96 Q40 112 60 96 Q80 112 100 96 Q120 112 140 96 Q160 112 180 96 Q190 104 200 96" stroke="#fff" strokeWidth={8} fill="none" />
    <rect x={8} y={130} width={204} height={60} rx={8} fill="#c96b7c" stroke={ink} strokeWidth={4} />
  </svg>
);

/** 苹果（简笔水果，不是商标） */
export const AppleFruit: React.FC<{s?: number; rainbow?: boolean}> = ({s = 120, rainbow}) => (
  <svg width={s} height={s} viewBox="0 0 120 120">
    <defs>
      <clipPath id="appleClip">
        <path d="M60 34 Q40 18 22 34 Q4 52 16 84 Q28 114 46 112 Q54 110 60 106 Q66 110 74 112 Q92 114 104 84 Q116 52 98 34 Q80 18 60 34 Z" />
      </clipPath>
    </defs>
    <path d="M60 32 Q58 16 70 6" stroke="#5a3a1a" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M64 24 Q84 4 98 14 Q84 30 64 24 Z" fill="#5bb36a" />
    {rainbow ? (
      <g clipPath="url(#appleClip)">
        {['#5bb36a', '#e9c43a', '#e9873a', '#d9483f', '#9b4fa0', '#3d8ad6'].map((c, i) => <rect key={c} x={0} y={18 + i * 17} width={120} height={17} fill={c} />)}
      </g>
    ) : (
      <path d="M60 34 Q40 18 22 34 Q4 52 16 84 Q28 114 46 112 Q54 110 60 106 Q66 110 74 112 Q92 114 104 84 Q116 52 98 34 Q80 18 60 34 Z" fill={red} />
    )}
  </svg>
);
