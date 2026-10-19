import React from 'react';
import {C} from '../theme';

export type Wear =
  | 'santa'
  | 'headphones'
  | 'glasses'
  | 'sunglasses'
  | 'grad'
  | 'space'
  | 'scholar'
  | 'detective'
  | 'party'
  | 'crown'
  | 'bowtie';

const INK = C.ink;
const SW = 3.5;

// 坐标系与 BuddyFigure 一致：原点在脚底中心，身体 x∈[-92,92]，y∈[-157,-45]，眼睛在 (±36, -108)

const Santa: React.FC<{t: number}> = ({t}) => {
  const sway = Math.sin(t * 0.12) * 6;
  return (
    <g transform="rotate(-8 0 -160)">
      <path d={`M -74 -168 Q -30 -250 ${40 + sway} -262 Q 56 -220 74 -168 Z`} fill={C.red} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <rect x={-86} y={-182} width={172} height={30} rx={15} fill={C.white} stroke={INK} strokeWidth={SW} />
      <circle cx={42 + sway} cy={-262} r={17} fill={C.white} stroke={INK} strokeWidth={SW} />
    </g>
  );
};

const Headphones: React.FC<{t: number}> = ({t}) => (
  <g>
    <path d="M -96 -118 Q -98 -218 0 -220 Q 98 -218 96 -118" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
    <path d="M -96 -118 Q -98 -218 0 -220 Q 98 -218 96 -118" fill="none" stroke="#6A5CD6" strokeWidth={6} strokeLinecap="round" />
    {[-1, 1].map((d) => (
      <g key={d}>
        <rect x={d < 0 ? -122 : 88} y={-146} width={34} height={60} rx={12} fill="#8E8FE8" stroke={INK} strokeWidth={SW} />
        <rect x={d < 0 ? -110 : 88} y={-138} width={10} height={44} rx={4} fill="#6A5CD6" />
      </g>
    ))}
    {/* 飘出来的音符 */}
    {[0, 1].map((i) => {
      const p = ((t * 0.02 + i * 0.5) % 1 + 1) % 1;
      return (
        <text key={i} x={110 + p * 40} y={-160 - p * 90} fontSize={34} fill={INK} opacity={1 - p} fontFamily="serif">
          {i ? '♫' : '♪'}
        </text>
      );
    })}
  </g>
);

const Glasses: React.FC = () => (
  <g>
    {[-36, 36].map((x) => (
      <circle key={x} cx={x} cy={-108} r={26} fill="rgba(255,255,255,0.28)" stroke={INK} strokeWidth={4.5} />
    ))}
    <path d="M -10 -110 Q 0 -118 10 -110" fill="none" stroke={INK} strokeWidth={4.5} />
    <path d="M -62 -112 L -92 -120 M 62 -112 L 92 -120" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
  </g>
);

const Sunglasses: React.FC = () => (
  <g>
    {[-38, 38].map((x) => (
      <g key={x}>
        <path d={`M ${x - 30} -124 H ${x + 30} Q ${x + 30} -86 ${x} -88 Q ${x - 30} -86 ${x - 30} -124 Z`} fill={INK} />
        <path d={`M ${x - 18} -116 L ${x - 6} -104`} stroke={C.white} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      </g>
    ))}
    <path d="M -8 -120 H 8" stroke={INK} strokeWidth={6} />
    <path d="M -68 -122 L -92 -126 M 68 -122 L 92 -126" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Grad: React.FC<{t: number}> = ({t}) => {
  const swing = Math.sin(t * 0.15) * 5;
  return (
    <g transform="rotate(-6 0 -170)">
      <rect x={-48} y={-186} width={96} height={30} rx={4} fill={INK} />
      <polygon points="-104,-192 0,-222 104,-192 0,-164" fill="#3A3F48" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M 0 -194 L 78 -186 L ${82 + swing} -140`} fill="none" stroke={C.yellow} strokeWidth={5} strokeLinecap="round" />
      <rect x={76 + swing} y={-144} width={12} height={20} rx={3} fill={C.yellow} stroke={INK} strokeWidth={2} />
    </g>
  );
};

const Space: React.FC<{t: number}> = ({t}) => (
  <g>
    <line x1={56} y1={-230} x2={74} y2={-274} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <circle cx={76} cy={-280} r={10} fill={Math.floor(t / 15) % 2 ? C.red : '#FF9B9B'} stroke={INK} strokeWidth={3} />
    <ellipse cx={0} cy={-108} rx={138} ry={132} fill="rgba(190,230,255,0.28)" stroke={INK} strokeWidth={5} />
    <path d="M -110 -160 Q -92 -214 -40 -232" fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
    <path d="M -120 -128 Q -122 -146 -116 -160" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <rect x={-104} y={-54} width={208} height={20} rx={10} fill="#D5DEE2" stroke={INK} strokeWidth={SW} />
  </g>
);

/** 书生帽（幞头） */
const Scholar: React.FC<{t: number}> = ({t}) => {
  const flap = Math.sin(t * 0.2) * 4;
  return (
    <g>
      <ellipse cx={-118} cy={-182 + flap} rx={46} ry={9} fill={INK} transform={`rotate(-8 -118 ${-182 + flap})`} />
      <ellipse cx={118} cy={-182 - flap} rx={46} ry={9} fill={INK} transform={`rotate(8 118 ${-182 - flap})`} />
      <path d="M -70 -156 V -196 Q -70 -226 -30 -228 H 30 Q 70 -226 70 -196 V -156 Z" fill={INK} />
      <path d="M -40 -214 Q 0 -240 40 -214" fill="none" stroke="#555" strokeWidth={4} />
    </g>
  );
};

const Detective: React.FC = () => (
  <g transform="rotate(6 0 -160)">
    <ellipse cx={0} cy={-160} rx={112} ry={18} fill="#8B6A4E" stroke={INK} strokeWidth={SW} />
    <path d="M -66 -164 Q -70 -226 0 -228 Q 70 -226 66 -164 Z" fill="#A07C5B" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-66} y={-184} width={132} height={16} fill="#3A3F48" />
  </g>
);

const Party: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${10 + Math.sin(t * 0.18) * 4} 20 -160)`}>
    <path d="M -30 -158 L 20 -270 L 70 -158 Z" fill="#8E8FE8" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -12 -198 L 52 -198 M 2 -232 L 38 -232" stroke={C.yellow} strokeWidth={9} />
    <circle cx={20} cy={-274} r={13} fill={C.red} stroke={INK} strokeWidth={3} />
  </g>
);

const Crown: React.FC<{t: number}> = ({t}) => (
  <g transform="translate(0 -4)">
    <path d="M -64 -156 L -70 -222 L -34 -186 L 0 -236 L 34 -186 L 70 -222 L 64 -156 Z" fill={C.yellow} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {[-70, 0, 70].map((x, i) => (
      <circle key={x} cx={x} cy={i === 1 ? -238 : -224} r={8} fill={i === 1 ? C.red : C.teal} stroke={INK} strokeWidth={2.5} />
    ))}
    <path d="M -40 -176 L -30 -170" stroke={C.white} strokeWidth={4} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 0.3)} />
  </g>
);

const Bowtie: React.FC = () => (
  <g>
    <path d="M 0 -54 L -30 -70 L -30 -36 Z M 0 -54 L 30 -70 L 30 -36 Z" fill={C.red} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-8} y={-62} width={16} height={16} rx={4} fill="#B3262B" stroke={INK} strokeWidth={3} />
  </g>
);

export const Accessory: React.FC<{wear: Wear; t: number}> = ({wear, t}) => {
  switch (wear) {
    case 'santa':
      return <Santa t={t} />;
    case 'headphones':
      return <Headphones t={t} />;
    case 'glasses':
      return <Glasses />;
    case 'sunglasses':
      return <Sunglasses />;
    case 'grad':
      return <Grad t={t} />;
    case 'space':
      return <Space t={t} />;
    case 'scholar':
      return <Scholar t={t} />;
    case 'detective':
      return <Detective />;
    case 'party':
      return <Party t={t} />;
    case 'crown':
      return <Crown t={t} />;
    case 'bowtie':
      return <Bowtie />;
  }
};
