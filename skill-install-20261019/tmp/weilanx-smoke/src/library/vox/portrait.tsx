import React from 'react';

export type Hair = 'side' | 'receding' | 'grey' | 'curly' | 'short' | 'long' | 'bald' | 'swept' | 'silver';

/**
 * 人物网点肖像（示意，不是真人照片），交给 HalftonePhoto 做成网点。
 * 用发型、胡子、眼镜、穿着区分人物：tie 西装领带，turtleneck 黑高领，shirt 只穿衬衫，leather 黑皮夹克配黑 T 恤。
 */
export const Portrait: React.FC<{w: number; h: number; hair?: Hair; glasses?: boolean; beard?: boolean; tie?: boolean; turtleneck?: boolean; shirt?: boolean; leather?: boolean; seed?: number}> = ({w, h, hair = 'short', glasses, beard, tie = true, turtleneck, shirt, leather, seed = 0}) => (
  <svg width={w} height={h} viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice">
    <rect width={200} height={240} fill={seed % 2 ? '#d8d8d8' : '#e6e6e6'} />
    {/* 衣服 */}
    {leather ? (
      <>
        <path d="M14 240 Q18 166 100 158 Q182 166 186 240 Z" fill="#0c0c0c" />
        <path d="M78 162 L100 240 L122 162 Z" fill="#2c2c2c" />
        <path d="M70 164 L92 230 L60 200 Z M130 164 L108 230 L140 200 Z" fill="#3e3e3e" />
        <rect x={84} y={130} width={32} height={36} fill="#8a8a8a" />
      </>
    ) : turtleneck ? (
      <>
        <path d="M18 240 Q22 168 100 160 Q178 168 182 240 Z" fill="#121212" />
        <rect x={78} y={132} width={44} height={40} rx={10} fill="#121212" />
      </>
    ) : shirt ? (
      <>
        <path d="M18 240 Q22 168 100 160 Q178 168 182 240 Z" fill="#cfcfcf" />
        <path d="M80 164 L100 196 L120 164" stroke="#555" strokeWidth={4} fill="none" />
        <rect x={84} y={130} width={32} height={36} fill="#8a8a8a" />
      </>
    ) : (
      <>
        <path d="M18 240 Q22 168 100 160 Q178 168 182 240 Z" fill="#161616" />
        <path d="M80 164 L100 214 L120 164 Z" fill="#f2f2f2" />
        {tie && <path d="M96 170 L104 170 L108 214 L100 226 L92 214 Z" fill="#555" />}
        <rect x={84} y={130} width={32} height={38} fill="#8a8a8a" />
      </>
    )}
    {hair === 'long' && <path d="M50 96 Q44 34 100 32 Q156 34 150 96 L156 170 Q130 150 140 100 Q120 62 100 62 Q80 62 60 100 Q70 150 44 170 Z" fill="#141414" />}
    {/* 脸 */}
    <ellipse cx={100} cy={100} rx={46} ry={56} fill="#a2a2a2" />
    <ellipse cx={58} cy={104} rx={7} ry={13} fill="#8f8f8f" />
    <ellipse cx={142} cy={104} rx={7} ry={13} fill="#8f8f8f" />
    <path d="M60 110 Q64 150 100 158 Q136 150 140 110 Q130 140 100 146 Q70 140 60 110 Z" fill="#7a7a7a" />
    <ellipse cx={82} cy={98} rx={6} ry={4} fill="#1b1b1b" />
    <ellipse cx={118} cy={98} rx={6} ry={4} fill="#1b1b1b" />
    <path d="M74 86 Q82 80 92 86 M108 86 Q118 80 126 86" stroke="#222" strokeWidth={4} fill="none" />
    <path d="M100 100 L94 122 L104 124" stroke="#6a6a6a" strokeWidth={4} fill="none" />
    {beard ? (
      <path d="M56 104 Q58 168 100 172 Q142 168 144 104 Q136 140 120 134 Q100 128 80 134 Q64 140 56 104 Z" fill="#1c1c1c" />
    ) : (
      <path d="M86 136 Q100 142 114 136" stroke="#3a3a3a" strokeWidth={4} fill="none" />
    )}
    {glasses && (
      <g stroke="#0d0d0d" strokeWidth={4} fill="none">
        <circle cx={82} cy={98} r={15} />
        <circle cx={118} cy={98} r={15} />
        <path d="M97 98 L103 98 M67 96 L56 92 M133 96 L144 92" />
      </g>
    )}
    {/* 头发 */}
    {hair === 'side' && <path d="M54 92 Q50 40 100 38 Q152 40 148 92 Q140 62 112 60 Q86 58 70 70 Q60 78 54 92 Z" fill="#121212" />}
    {(hair === 'short' || hair === 'long') && <path d="M55 88 Q52 42 100 40 Q148 42 145 88 Q138 64 100 62 Q62 64 55 88 Z" fill="#141414" />}
    {hair === 'swept' && <path d="M54 90 Q48 36 104 36 Q150 40 148 86 Q138 56 96 58 Q70 58 54 90 Z" fill="#141414" />}
    {hair === 'silver' && <path d="M55 88 Q52 42 100 40 Q148 42 145 88 Q138 64 100 62 Q62 64 55 88 Z" fill="#e2e2e2" stroke="#6b6b6b" strokeWidth={3} />}
    {hair === 'curly' && (
      <g fill="#121212">
        <path d="M54 92 Q48 40 100 36 Q152 40 146 92 Q136 64 100 62 Q64 64 54 92 Z" />
        {Array.from({length: 9}, (_, i) => <circle key={i} cx={58 + i * 10.5} cy={46 + Math.abs(4 - i) * 3} r={10} />)}
      </g>
    )}
    {hair === 'receding' && (
      <g fill="#2b2b2b">
        <path d="M54 100 Q52 72 62 62 Q60 82 64 102 Z" />
        <path d="M146 100 Q148 72 138 62 Q140 82 136 102 Z" />
      </g>
    )}
    {hair === 'grey' && <path d="M54 96 Q48 46 100 42 Q152 46 146 96 Q140 68 118 62 Q96 70 70 66 Q58 76 54 96 Z" fill="#dcdcdc" stroke="#6b6b6b" strokeWidth={3} />}
  </svg>
);
