import React from 'react';

// 灰度示意画，交给 HalftonePhoto 做成网点照片。明暗反差要大，网点才看得清。

/** 感知机 Mark I：三台机柜，插线板密密麻麻 */
export const PerceptronArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
    <rect width={400} height={280} fill="#9a9a9a" />
    <rect x={0} y={220} width={400} height={60} fill="#5a5a5a" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${16 + i * 128} 26)`}>
        <rect width={116} height={204} fill="#2a2a2a" />
        <rect x={8} y={10} width={100} height={118} fill="#f0f0f0" />
        {Array.from({length: 48}, (_, k) => <circle key={k} cx={17 + (k % 8) * 12} cy={20 + Math.floor(k / 8) * 18} r={3.4} fill="#111" />)}
        {Array.from({length: 8}, (_, k) => (
          <path key={k} d={`M${16 + k * 12} 22 C ${40 + k * 5} 90, ${70 - k * 5} 50, ${18 + k * 11} 124`} stroke="#000" strokeWidth={2.4} fill="none" />
        ))}
        <rect x={8} y={140} width={100} height={52} fill="#111" />
        {[0, 1, 2, 3].map((k) => <circle key={k} cx={22 + k * 24} cy={166} r={7} fill="#e8e8e8" />)}
      </g>
    ))}
  </svg>
);

/** 80 年代的工作站：大屏幕 + 机箱 + 键盘 */
export const Workstation: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 240" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={240} fill="#a5a5a5" />
    <rect x={0} y={190} width={340} height={50} fill="#666" />
    <rect x={40} y={30} width={170} height={140} rx={8} fill="#2a2a2a" />
    <rect x={54} y={44} width={142} height={104} fill="#dcdcdc" />
    {Array.from({length: 7}, (_, k) => <rect key={k} x={64} y={54 + k * 13} width={60 + ((k * 37) % 60)} height={6} fill="#333" />)}
    <rect x={230} y={50} width={80} height={140} fill="#1d1d1d" />
    {[0, 1, 2].map((k) => <rect key={k} x={242} y={66 + k * 30} width={56} height={10} fill="#bdbdbd" />)}
    <rect x={50} y={176} width={170} height={22} rx={4} fill="#3a3a3a" />
  </svg>
);

/** 国际象棋棋盘（斜视） */
export const Chessboard: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 330 250" preserveAspectRatio="xMidYMid slice">
    <rect width={330} height={250} fill="#4a4a4a" />
    <g transform="translate(165 40) scale(1 0.55) rotate(45)">
      {Array.from({length: 64}, (_, k) => {
        const i = k % 8;
        const j = Math.floor(k / 8);
        return <rect key={k} x={-120 + i * 30} y={-120 + j * 30} width={30} height={30} fill={(i + j) % 2 ? '#1a1a1a' : '#efefef'} />;
      })}
    </g>
    {[
      [120, 120],
      [170, 100],
      [210, 140],
      [150, 170],
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <ellipse cx={0} cy={22} rx={12} ry={5} fill="#000" opacity={0.5} />
        <path d="M-9 20 L-6 0 Q0 -14 6 0 L9 20 Z" fill={i % 2 ? '#111' : '#f5f5f5'} stroke="#000" strokeWidth={1.5} />
        <circle cx={0} cy={-14} r={6} fill={i % 2 ? '#111' : '#f5f5f5'} stroke="#000" strokeWidth={1.5} />
      </g>
    ))}
  </svg>
);

/** 围棋棋盘：19 路，黑白子 */
export const GoBoard: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
    <rect width={300} height={240} fill="#3a3a3a" />
    <rect x={40} y={10} width={220} height={220} fill="#cfcfcf" />
    {Array.from({length: 19}, (_, i) => (
      <g key={i}>
        <line x1={50} y1={20 + i * 11.1} x2={250} y2={20 + i * 11.1} stroke="#222" strokeWidth={1} />
        <line x1={50 + i * 11.1} y1={20} x2={50 + i * 11.1} y2={220} stroke="#222" strokeWidth={1} />
      </g>
    ))}
    {Array.from({length: 40}, (_, k) => {
      const x = 50 + ((k * 7 + 3) % 19) * 11.1;
      const y = 20 + ((k * 11 + 5) % 19) * 11.1;
      return <circle key={k} cx={x} cy={y} r={5} fill={k % 2 ? '#0a0a0a' : '#fafafa'} stroke="#000" strokeWidth={0.8} />;
    })}
  </svg>
);

/** 两块显卡 */
export const GpuArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 330 220" preserveAspectRatio="xMidYMid slice">
    <rect width={330} height={220} fill="#8f8f8f" />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${20 + i * 20} ${30 + i * 80})`}>
        <rect width={270} height={74} rx={6} fill="#1c1c1c" />
        <circle cx={70} cy={37} r={28} fill="#3a3a3a" stroke="#d8d8d8" strokeWidth={3} />
        <circle cx={150} cy={37} r={28} fill="#3a3a3a" stroke="#d8d8d8" strokeWidth={3} />
        {Array.from({length: 6}, (_, k) => (
          <line key={k} x1={70} y1={37} x2={70 + Math.cos(k) * 26} y2={37 + Math.sin(k) * 26} stroke="#d8d8d8" strokeWidth={3} />
        ))}
        <rect x={200} y={14} width={56} height={46} fill="#e0e0e0" />
        <rect x={10} y={74} width={180} height={10} fill="#d0b000" />
      </g>
    ))}
  </svg>
);

/** 达特茅斯学院的老楼（示意） */
export const HallArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 340 220" preserveAspectRatio="xMidYMid slice">
    <rect width={340} height={220} fill="#c9c9c9" />
    <rect x={0} y={170} width={340} height={50} fill="#5c5c5c" />
    <rect x={40} y={70} width={260} height={110} fill="#f2f2f2" stroke="#222" strokeWidth={3} />
    <path d="M30 72 L170 30 L310 72 Z" fill="#2a2a2a" />
    <rect x={158} y={0} width={24} height={40} fill="#f2f2f2" stroke="#222" strokeWidth={3} />
    <path d="M152 2 L170 -14 L188 2 Z" fill="#2a2a2a" />
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={54 + (i % 5) * 50} y={86 + Math.floor(i / 5) * 46} width={22} height={30} fill="#2a2a2a" />
    ))}
    <rect x={155} y={140} width={30} height={40} fill="#1a1a1a" />
    {Array.from({length: 7}, (_, i) => (
      <circle key={i} cx={12 + i * 52} cy={172} r={20} fill="#3a3a3a" />
    ))}
  </svg>
);

/** ImageNet 那种图库：一格一格的小图 */
export const ImageGridArt: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
    <rect width={320} height={240} fill="#bdbdbd" />
    {Array.from({length: 12}, (_, k) => {
      const x = 8 + (k % 4) * 78;
      const y = 8 + Math.floor(k / 4) * 78;
      const kind = k % 4;
      return (
        <g key={k} transform={`translate(${x} ${y})`}>
          <rect width={72} height={72} fill={k % 3 ? '#e2e2e2' : '#f2f2f2'} />
          {kind === 0 && <path d="M14 62 Q14 30 36 30 Q58 30 58 62 Z M20 34 L24 16 L32 30 M52 34 L48 16 L40 30" fill="#151515" />}
          {kind === 1 && <path d="M8 50 L18 36 L54 36 L64 50 L64 58 L8 58 Z" fill="#151515" />}
          {kind === 2 && <path d="M36 10 L58 62 L14 62 Z" fill="#151515" />}
          {kind === 3 && <circle cx={36} cy={38} r={22} fill="#151515" />}
        </g>
      );
    })}
  </svg>
);
