import React from 'react';
import {clamp01, easeOut, rand} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 注意力 / 听觉示意（ep45 起）：
 * VoiceComm 左下角队友语音条（喇叭 + 跳动音量柱 + 报点文字，clear < 1 时字是糊的）；
 * Bandwidth 一条「注意力带宽」：眼睛占的青色从左边填，耳朵的橙色块从右边挤进来，放不下就被挡在外面；
 * CrossStim 十字刺激（一条蓝臂、一条绿臂、长短只差一点）；ToneIcon 喇叭 + 声波；
 * PeopleGrid 人头点阵（前 lit 个依次亮起）；EvokedWave 诱发反应曲线（示意）；WaveBox 一段实时波形；
 * ep47 起：Spotlight 聚光灯遮罩；PassCourt 传球场（大猩猩实验的原创示意）；SplitBar 两段比例条。
 * 都画在整屏 1920×1080 的 SVG / 绝对定位里，坐标是屏幕像素；动画只看帧号。
 */

/** 喇叭 + 三道声波；on 0–1 控制声波张开 */
export const ToneIcon: React.FC<{x: number; y: number; s?: number; on?: number; color?: string}> = ({x, y, s = 60, on = 1, color = T.orange}) => (
  <g transform={`translate(${x} ${y}) scale(${s / 60})`} style={{filter: glowF(color, 4)}}>
    <path d="M-26 -10 H-14 L0 -24 V24 L-14 10 H-26 Z" fill={color} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M${8 + k * 10} ${-12 - k * 6} Q${16 + k * 13} 0 ${8 + k * 10} ${12 + k * 6}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" opacity={clamp01(on * 3 - k)} />
    ))}
  </g>
);

/** 队友语音条：talk 帧数内音量柱跳动；clear 0–1，越小字越糊越暗（「声音到了但没进脑子」） */
export const VoiceComm: React.FC<{f: number; at: number; text: string; name?: string; x?: number; y?: number; clear?: number; talk?: number; color?: string}> = ({f, at, text, name = '队友', x = 110, y = 690, clear = 1, talk = 40, color = T.orange}) => {
  const o = clamp01((f - at) / 4);
  if (o <= 0) return null;
  const live = f - at < talk;
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px 12px 18px', background: 'rgba(5,11,20,0.78)', borderLeft: `5px solid ${color}`, boxShadow: live ? `0 0 22px ${color}55` : 'none', opacity: o}}>
      <svg width={64} height={50}>
        <ToneIcon x={26} y={25} s={44} on={live ? 1 : 0.3} color={color} />
      </svg>
      <svg width={64} height={44}>
        {Array.from({length: 6}, (_, i) => {
          const h = live ? 8 + 34 * rand(Math.floor(f / 2) * 7 + i * 13 + at) : 6;
          return <rect key={i} x={i * 11} y={22 - h / 2} width={7} height={h} rx={3} fill={color} />;
        })}
      </svg>
      <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 26, color}}>{name}</div>
      <div style={{fontFamily: TF.sans, fontSize: 40, color: T.white, filter: clear < 1 ? `blur(${(1 - clear) * 7}px)` : undefined, opacity: 0.3 + 0.7 * clear, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

/**
 * 注意力带宽：外框是总量；vis 0–1 是眼睛占用（青，从左填）；aud 是耳朵这块的宽度占比，enter 0–1 是它从右边滑进来的进度。
 * vis + aud ≤ 1 时橙块落进空位；放不下就停在框外、变暗、标「挤不进来」
 */
export const Bandwidth: React.FC<{x: number; y: number; w: number; h?: number; vis: number; aud?: number; enter?: number; title?: string; visLabel?: string; audLabel?: string; blockedLabel?: string}> = ({
  x,
  y,
  w,
  h = 90,
  vis,
  aud = 0.22,
  enter = 0,
  title = '注意力带宽',
  visLabel = '眼睛',
  audLabel = '耳朵',
  blockedLabel = '挤不进来',
}) => {
  const fits = vis + aud <= 1.0001;
  const target = fits ? x + vis * w : x + w + 24;
  const ax = x + w + 260 + (target - (x + w + 260)) * easeOut(clamp01(enter));
  const blocked = !fits && enter >= 1;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <text x={x} y={y - 24} fontFamily={TF.mono} fontWeight={700} fontSize={26} letterSpacing={4} fill={T.gray}>
        {title}
      </text>
      <rect x={x} y={y} width={vis * w} height={h} fill={T.cyan} opacity={0.85} style={{filter: glowF(T.cyan, 8)}} />
      {vis > 0.12 ? (
        <text x={x + (vis * w) / 2} y={y + h / 2 + 14} textAnchor="middle" fontFamily={TF.sans} fontSize={40} fill="#06121a">
          {visLabel}
        </text>
      ) : null}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={T.white} strokeWidth={3} />
      {enter > 0 ? (
        <g opacity={blocked ? 0.55 : 1}>
          <rect x={ax} y={y + 6} width={aud * w} height={h - 12} fill={blocked ? 'none' : T.orange} stroke={T.orange} strokeWidth={3} strokeDasharray={blocked ? '10 8' : undefined} style={{filter: blocked ? undefined : glowF(T.orange, 8)}} />
          <text x={ax + (aud * w) / 2} y={y + h / 2 + 14} textAnchor="middle" fontFamily={TF.sans} fontSize={38} fill={blocked ? T.orange : '#1a0e02'}>
            {audLabel}
          </text>
        </g>
      ) : null}
      {blocked ? (
        <text x={ax + (aud * w) / 2} y={y + h + 52} textAnchor="middle" fontFamily={TF.sans} fontSize={34} fill={T.red} style={{filter: glowF(T.red, 6)}}>
          {blockedLabel}
        </text>
      ) : null}
    </svg>
  );
};

/** 十字刺激：灰底框里一个十字，横臂蓝、竖臂绿，竖臂比横臂长一点（3.8° vs 3.6°）；show 0–1 是显隐 */
export const CrossStim: React.FC<{x: number; y: number; size?: number; show?: number}> = ({x, y, size = 260, show = 1}) => {
  const a = size * 0.36;
  const b = a * (3.8 / 3.6);
  return (
    <g opacity={show}>
      <rect x={x - size * 0.6} y={y - size * 0.5} width={size * 1.2} height={size} fill="#2a3138" stroke={T.faint} strokeWidth={2} />
      <line x1={x - a} x2={x + a} y1={y} y2={y} stroke="#00b7ff" strokeWidth={10} />
      <line x1={x} x2={x} y1={y - b} y2={y + b} stroke="#00cc00" strokeWidth={10} />
      <rect x={x - 6} y={y - 6} width={12} height={12} fill="#000" />
    </g>
  );
};

/** 人头点阵：n 个小人，前 lit 个从 at 起每 per 帧亮一个（color），其余灰 */
export const PeopleGrid: React.FC<{f: number; at: number; n: number; lit: number; x: number; y: number; cols?: number; cell?: number; per?: number; color?: string; off?: string}> = ({f, at, n, lit, x, y, cols = 6, cell = 74, per = 2, color = T.cyan, off = T.dim}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const cx = x + (i % cols) * cell;
      const cy = y + Math.floor(i / cols) * cell;
      const on = i < lit ? clamp01((f - at - i * per) / 4) : 0;
      const c = on > 0.5 ? color : off;
      return (
        <g key={i} opacity={clamp01((f - at + 10) / 8)} style={on > 0.5 ? {filter: glowF(color, 5)} : undefined}>
          <circle cx={cx} cy={cy - cell * 0.16} r={cell * 0.16} fill={c} />
          <path d={`M${cx - cell * 0.3} ${cy + cell * 0.32} Q${cx - cell * 0.3} ${cy + cell * 0.04} ${cx} ${cy + cell * 0.04} Q${cx + cell * 0.3} ${cy + cell * 0.04} ${cx + cell * 0.3} ${cy + cell * 0.32} Z`} fill={c} />
        </g>
      );
    })}
  </g>
);

/**
 * 诱发反应曲线（示意，不是论文数据）：横轴是声音出现后的毫秒，每条曲线由「约 100 ms 的早期峰」和「约 300 ms 的察觉峰（P3）」两个高斯相加；
 * curves[k] 从 at 起 dur 帧画完；marks 在横轴上竖一条虚线 + 标签
 */
export type EvokedCurve = {early: number; late: number; color: string; at: number; label?: string};
export const EvokedWave: React.FC<{f: number; curves: EvokedCurve[]; x?: number; y?: number; w?: number; h?: number; tMax?: number; marks?: {ms: number; label: string; at: number}[]; dur?: number}> = ({f, curves, x = 360, y = 260, w = 1200, h = 440, tMax = 500, marks = [], dur = 24}) => {
  const base = y + h;
  const px = (ms: number) => x + (ms / tMax) * w;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x} x2={x + w} y1={base} y2={base} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x} y1={y - 10} y2={base} stroke={T.faint} strokeWidth={2} />
      <text x={x + w} y={base + 44} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
        声音出现后（ms）
      </text>
      <text x={x - 14} y={base + 44} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
        0
      </text>
      {marks.map((m) => (
        <g key={m.ms} opacity={clamp01((f - m.at) / 8)}>
          <line x1={px(m.ms)} x2={px(m.ms)} y1={y - 10} y2={base} stroke={T.gray} strokeWidth={2} strokeDasharray="8 8" />
          <text x={px(m.ms)} y={base + 44} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.white}>
            {m.label}
          </text>
        </g>
      ))}
      {curves.map((c, k) => {
        const p = clamp01((f - c.at) / dur);
        if (p <= 0) return null;
        const N = 120;
        const pts = Array.from({length: Math.max(2, Math.round(N * p))}, (_, i) => {
          const ms = (i / N) * tMax;
          const v = c.early * Math.exp(-(((ms - 100) / 28) ** 2)) + c.late * Math.exp(-(((ms - 320) / 70) ** 2));
          return `${i ? 'L' : 'M'}${px(ms).toFixed(1)} ${(base - v * h * 0.92).toFixed(1)}`;
        });
        const peak = base - Math.max(c.early, c.late) * h * 0.92;
        return (
          <g key={k}>
            <path d={pts.join(' ')} fill="none" stroke={c.color} strokeWidth={6} style={{filter: glowF(c.color, 6)}} />
            {c.label && p >= 1 ? (
              <text x={px(c.early >= c.late ? 100 : 320) + 40} y={peak + (c.early >= c.late ? 20 : -16)} fontFamily={TF.sans} fontSize={32} fill={c.color}>
                {c.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/** 一段实时波形（竖条）：amp 0–1 振幅，seed 区分不同波形 */
export const WaveBox: React.FC<{f: number; x: number; y: number; w: number; h: number; amp: number; color?: string; seed?: number; bars?: number}> = ({f, x, y, w, h, amp, color = T.cyan, seed = 1, bars = 48}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke={T.faint} strokeWidth={2} />
    {Array.from({length: bars}, (_, i) => {
      const env = Math.sin(((i + 0.5) / bars) * Math.PI);
      const v = Math.max(0.04, amp * env * (0.35 + 0.65 * rand(seed * 100 + i * 7 + Math.floor(f / 3))));
      const bw = (w / bars) * 0.6;
      return <rect key={i} x={x + (i / bars) * w} y={y + h / 2 - (v * h) / 2} width={bw} height={v * h} rx={bw / 2} fill={color} opacity={0.9} />;
    })}
  </svg>
);

/* ---------------- 视觉注意（ep47 起） ---------------- */

/**
 * 聚光灯：整屏压暗（dark 0–1），holes 里的椭圆是亮的光圈（soft 是边缘羽化像素）；id 在同一帧多次使用时要不同。
 * 用来表示「注意力照到的才看得见」
 */
export const Spotlight: React.FC<{holes: {x: number; y: number; rx: number; ry?: number}[]; dark?: number; soft?: number; id?: string; ring?: string}> = ({holes, dark = 0.86, soft = 18, id = 'spot', ring}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
    <defs>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={soft} />
      </filter>
      <mask id={`${id}-mask`}>
        <rect width={1920} height={1080} fill="#fff" />
        {holes.map((h, i) => (
          <ellipse key={i} cx={h.x} cy={h.y} rx={h.rx} ry={h.ry ?? h.rx} fill="#000" filter={`url(#${id}-blur)`} />
        ))}
      </mask>
    </defs>
    <rect width={1920} height={1080} fill="#01040a" opacity={dark} mask={`url(#${id}-mask)`} />
    {ring
      ? holes.map((h, i) => <ellipse key={i} cx={h.x} cy={h.y} rx={h.rx} ry={h.ry ?? h.rx} fill="none" stroke={ring} strokeWidth={2} opacity={0.5} strokeDasharray="10 10" />)
      : null}
  </svg>
);

/** 一个原创小人（圆头 + 圆角身体）；dark 队用描边保证在深色底上看得见 */
const Player: React.FC<{x: number; y: number; s: number; team: 'white' | 'black'}> = ({x, y, s, team}) => {
  const fill = team === 'white' ? '#e8eef2' : '#14171c';
  const stroke = team === 'white' ? 'none' : 'rgba(200,215,225,0.7)';
  return (
    <g>
      <circle cx={x} cy={y - 150 * s} r={22 * s} fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x={x - 26 * s} y={y - 124 * s} width={52 * s} height={124 * s} rx={20 * s} fill={fill} stroke={stroke} strokeWidth={2} />
    </g>
  );
};

/**
 * 传球场（仿 Simons & Chabris 1999 的布置，原创示意）：白、黑两队各 3 人来回走动，白队按 1 → 2 → 3 → 1 传一颗橙球（每 pass 帧一次）。
 * gorillaAt 起一个「穿大猩猩服的人」从右走到左，walk 帧走完；stopAt 给了就在正中停 stopFor 帧捶胸。
 * curtain 0–1 让背景幕布从红变金；leaveAt 起一名黑队队员退出画面。count 显示白队传球计数
 */
export const PassCourt: React.FC<{
  f: number;
  t0: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  pass?: number;
  gorillaAt?: number;
  walk?: number;
  stopFor?: number;
  curtain?: number;
  leaveAt?: number;
  count?: boolean;
  gorillaLabel?: boolean;
}> = ({f, t0, x = 260, y = 230, w = 1400, h = 560, pass = 22, gorillaAt, walk = 150, stopFor = 0, curtain, leaveAt, count = true, gorillaLabel = true}) => {
  const s = h / 520;
  const floorY = y + h * 0.86;
  const t = f - t0;
  const slots = [0.12, 0.3, 0.48, 0.62, 0.78, 0.92];
  const teams: ('white' | 'black')[] = ['white', 'black', 'white', 'black', 'white', 'black'];
  const pos = slots.map((sx, i) => {
    let px = x + w * sx + Math.sin(t / (17 + i * 3) + i * 1.7) * w * 0.05;
    const py = floorY - Math.abs(Math.sin(t / (23 + i * 2) + i)) * h * 0.05 - (i % 2) * h * 0.06;
    if (leaveAt !== undefined && i === 5) px += Math.max(0, f - leaveAt) * 9;
    return [px, py] as [number, number];
  });
  const whites = [0, 2, 4];
  const k = Math.max(0, Math.floor(t / pass));
  const u = t < 0 ? 0 : (t % pass) / pass;
  const a = pos[whites[k % 3]];
  const b = pos[whites[(k + 1) % 3]];
  const bx = a[0] + (b[0] - a[0]) * u;
  const by = a[1] - 110 * s + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 70 * s;
  let gx: number | null = null;
  let thump = 0;
  if (gorillaAt !== undefined && f >= gorillaAt) {
    const g = f - gorillaAt;
    const half = walk / 2;
    const tt = stopFor > 0 ? (g < half ? g : g < half + stopFor ? half : g - stopFor) : g;
    if (stopFor > 0 && g >= half && g < half + stopFor) thump = Math.abs(Math.sin(g / 3));
    const p = tt / walk;
    if (p <= 1) gx = x + w * (1.02 - 1.04 * p);
  }
  const cur = curtain ?? 0;
  const curtainColor = curtain === undefined ? '#141c28' : `rgb(${Math.round(120 + 70 * cur)},${Math.round(30 + 120 * cur)},${Math.round(36 - 10 * cur)})`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <clipPath id={`court-${x}-${y}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#court-${x}-${y})`}>
        <rect x={x} y={y} width={w} height={h * 0.62} fill={curtainColor} />
        {curtain !== undefined
          ? Array.from({length: 14}, (_, i) => <rect key={i} x={x + (i * w) / 14} y={y} width={w / 28} height={h * 0.62} fill="#000" opacity={0.12} />)
          : null}
        <rect x={x} y={y + h * 0.62} width={w} height={h * 0.38} fill="#1d2633" />
        {pos.map(([px, py], i) => (
          <Player key={i} x={px} y={py} s={s} team={teams[i]} />
        ))}
        {t >= 0 && <circle cx={bx} cy={by} r={13 * s} fill={T.orange} style={{filter: glowF(T.orange, 4)}} />}
        {gx !== null && (
          <g transform={`translate(${gx} ${floorY - 6})`}>
            <ellipse cx={0} cy={-120 * s} rx={48 * s} ry={70 * s} fill="#0b0d10" stroke="rgba(200,215,225,0.55)" strokeWidth={2} />
            <circle cx={0} cy={-205 * s} r={30 * s} fill="#0b0d10" stroke="rgba(200,215,225,0.55)" strokeWidth={2} />
            <path d={`M${-44 * s} ${-150 * s} L${(-80 + 30 * thump) * s} ${(-70 - 60 * thump) * s} M${44 * s} ${-150 * s} L${(80 - 30 * thump) * s} ${(-70 - 60 * thump) * s}`} stroke="#0b0d10" strokeWidth={22 * s} strokeLinecap="round" />
            <rect x={-38 * s} y={-60 * s} width={26 * s} height={60 * s} rx={10 * s} fill="#0b0d10" />
            <rect x={12 * s} y={-60 * s} width={26 * s} height={60 * s} rx={10 * s} fill="#0b0d10" />
            {gorillaLabel ? (
              <text x={0} y={-260 * s} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
                大猩猩服（示意）
              </text>
            ) : null}
          </g>
        )}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={T.faint} strokeWidth={2} />
      {count && t >= 0 ? (
        <text x={x + w - 20} y={y + 44} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={32} fill={T.white}>
          白队传球：{k}
        </text>
      ) : null}
    </svg>
  );
};

/** 比例条：一条横条按 a%（左，colorA）和 100 − a%（右，colorB）分开，at 起 16 帧长出，两端写标签 */
export const SplitBar: React.FC<{f: number; at: number; a: number; labelA: string; labelB: string; x?: number; y?: number; w?: number; h?: number; colorA?: string; colorB?: string}> = ({f, at, a, labelA, labelB, x = 260, y = 460, w = 1400, h = 90, colorA = T.cyan, colorB = T.red}) => {
  const p = easeOut(clamp01((f - at) / 16));
  const wa = (w * a * p) / 100;
  const wb = (w * (100 - a) * p) / 100;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <rect x={x} y={y} width={w} height={h} fill="rgba(200,215,225,0.05)" stroke={T.faint} />
      <rect x={x} y={y} width={wa} height={h} fill={colorA} opacity={0.85} style={{filter: glowF(colorA, 6)}} />
      <rect x={x + w - wb} y={y} width={wb} height={h} fill={colorB} opacity={0.85} style={{filter: glowF(colorB, 6)}} />
      <text x={x} y={y - 26} fontFamily={TF.sans} fontSize={40} fill={colorA} opacity={p}>
        {labelA} {Math.round(a * p)}%
      </text>
      <text x={x + w} y={y - 26} textAnchor="end" fontFamily={TF.sans} fontSize={40} fill={colorB} opacity={p}>
        {labelB} {Math.round((100 - a) * p)}%
      </text>
    </svg>
  );
};
