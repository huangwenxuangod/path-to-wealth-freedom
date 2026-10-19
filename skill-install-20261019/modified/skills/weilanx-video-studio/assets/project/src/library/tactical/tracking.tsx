import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 追踪 / 换向示意（ep49 起）：
 * keyPos / keyVel 按关键帧 [帧, 位置] 线性插值（最后一段 easeOut 减速停下）；predictAim 是「按滞后 lag 帧前看到的位置和速度往前推」的准星；
 * TrackTrace 位置—时间图：目标一条线、准星一条线，横轴是时间，从 at 起 dur 帧画完，拐角处准星冲过头一眼可见；
 * TurnPath 拐弯实验：目标沿直线走、突然拐弯，手的轨迹先沿老方向冲出一段、再弯过去；
 * SpeedBand 速度—时间图 + 门槛线，低于门槛的那几段高亮（「只有这里打得准」）。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素；动画只看帧号。
 */

export type Key = [number, number];

/** 关键帧位置：kf 是 [帧, 位置]，之前取第一个、之后取最后一个；easeLast 让最后一段减速停下 */
export const keyPos = (kf: Key[], f: number, easeLast = true) => {
  if (f <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) {
    const [f0, x0] = kf[i - 1];
    const [f1, x1] = kf[i];
    if (f <= f1) {
      const u = (f - f0) / (f1 - f0);
      return x0 + (x1 - x0) * (easeLast && i === kf.length - 1 ? easeOut(u) : u);
    }
  }
  return kf[kf.length - 1][1];
};
export const keyVel = (kf: Key[], f: number, easeLast = true) => keyPos(kf, f + 0.5, easeLast) - keyPos(kf, f - 0.5, easeLast);
/** 预测型准星：看到的是 lag 帧之前的位置和速度，按那个速度往前推 lag 帧（匀速时正好对上，换向后要冲过头 lag 帧） */
export const predictAim = (kf: Key[], f: number, lag: number) => keyPos(kf, f - lag) + keyVel(kf, f - lag) * lag;

/** 位置—时间图：target / aim 是每帧的位置（同长度），t0 起画；横轴 w 像素对应 samples 个帧；scale 把位置换成像素 */
export const TrackTrace: React.FC<{f: number; at: number; target: number[]; aim?: number[]; x?: number; y?: number; w?: number; h?: number; scale?: number; dur?: number; tLabel?: string; names?: [string, string]; marks?: number[]}> = ({
  f,
  at,
  target,
  aim,
  x = 260,
  y = 300,
  w = 1400,
  h = 400,
  scale = 140,
  dur = 40,
  tLabel = '时间 →',
  names = ['他', '你的准星'],
  marks = [],
}) => {
  const n = target.length;
  const shown = Math.max(2, Math.round(n * clamp01((f - at) / dur)));
  const px = (i: number) => x + (i / (n - 1)) * w;
  const py = (v: number) => y + h / 2 - v * scale;
  const path = (arr: number[]) => arr.slice(0, shown).map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const o = clamp01((f - at) / 6);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke={T.faint} strokeWidth={2} strokeDasharray="6 8" />
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <text x={x + w} y={y + h + 40} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        {tLabel}
      </text>
      <text x={x - 16} y={y + 10} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        右
      </text>
      <text x={x - 16} y={y + h} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        左
      </text>
      {marks.map((i) =>
        i < shown ? <circle key={i} cx={px(i)} cy={py(aim ? aim[i] : target[i])} r={16} fill="none" stroke={T.red} strokeWidth={4} style={{filter: glowF(T.red, 6)}} /> : null,
      )}
      <path d={path(target)} fill="none" stroke={T.orange} strokeWidth={7} strokeLinejoin="round" style={{filter: glowF(T.orange, 6)}} />
      {aim ? <path d={path(aim)} fill="none" stroke={T.cyan} strokeWidth={5} strokeLinejoin="round" style={{filter: glowF(T.cyan, 6)}} /> : null}
      <g fontFamily={TF.sans} fontSize={30}>
        <rect x={x + 20} y={y - 56} width={26} height={8} fill={T.orange} />
        <text x={x + 56} y={y - 44} fill={T.orange}>
          {names[0]}
        </text>
        {aim ? (
          <>
            <rect x={x + 200} y={y - 56} width={26} height={8} fill={T.cyan} />
            <text x={x + 236} y={y - 44} fill={T.cyan}>
              {names[1]}
            </text>
          </>
        ) : null}
      </g>
    </svg>
  );
};

/**
 * 拐弯实验示意：目标从 (x0, y0) 沿 a0 方向匀速走 len0 像素后转 turn 弧度再走 len1；
 * 手的轨迹：拐弯后先沿老方向冲出 over 像素，再画一段弧并到新路径上。progress 0–1 是目标走过的比例
 */
export const TurnPath: React.FC<{x0: number; y0: number; a0: number; turn: number; len0: number; len1: number; over: number; progress: number; handAt?: number}> = ({x0, y0, a0, turn, len0, len1, over, progress, handAt = 0}) => {
  const c = [x0 + Math.cos(a0) * len0, y0 + Math.sin(a0) * len0];
  const a1 = a0 + turn;
  const end = [c[0] + Math.cos(a1) * len1, c[1] + Math.sin(a1) * len1];
  const ov = [c[0] + Math.cos(a0) * over, c[1] + Math.sin(a0) * over];
  const join = [c[0] + Math.cos(a1) * len1 * 0.55, c[1] + Math.sin(a1) * len1 * 0.55];
  const total = len0 + len1;
  const d = progress * total;
  const dot = d <= len0 ? [x0 + Math.cos(a0) * d, y0 + Math.sin(a0) * d] : [c[0] + Math.cos(a1) * (d - len0), c[1] + Math.sin(a1) * (d - len0)];
  const handD = `M${x0} ${y0} L${c[0]} ${c[1]} L${ov[0]} ${ov[1]} Q${ov[0] + Math.cos(a1) * over} ${ov[1] + Math.sin(a1) * over} ${join[0]} ${join[1]} L${end[0]} ${end[1]}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${x0} ${y0} L${c[0]} ${c[1]} L${end[0]} ${end[1]}`} fill="none" stroke={T.orange} strokeWidth={6} strokeDasharray="14 10" opacity={0.7} />
      <path d={handD} fill="none" stroke={T.cyan} strokeWidth={6} pathLength={1} strokeDasharray={`${clamp01(handAt)} 1`} style={{filter: glowF(T.cyan, 6)}} />
      <circle cx={dot[0]} cy={dot[1]} r={18} fill={T.orange} style={{filter: glowF(T.orange, 8)}} />
      <circle cx={c[0]} cy={c[1]} r={10} fill="none" stroke={T.white} strokeWidth={3} />
    </svg>
  );
};

/** 速度—时间图：speed 是每帧的速度占最高速的比例 0–1；门槛 gate 以下的点高亮成 hi 色 */
export const SpeedBand: React.FC<{f: number; at: number; speed: number[]; gate: number; x?: number; y?: number; w?: number; h?: number; dur?: number; gateLabel?: string; hiLabel?: string}> = ({f, at, speed, gate, x = 260, y = 300, w = 1400, h = 360, dur = 40, gateLabel = '门槛', hiLabel = '只有这里打得准'}) => {
  const n = speed.length;
  const shown = Math.max(2, Math.round(n * clamp01((f - at) / dur)));
  const px = (i: number) => x + (i / (n - 1)) * w;
  const py = (v: number) => y + h - v * h;
  const firstLow = speed.findIndex((v, i) => i > 2 && v < gate);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <text x={x - 16} y={y + 10} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        最快
      </text>
      <text x={x - 16} y={y + h} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        0
      </text>
      <line x1={x} x2={x + w} y1={py(gate)} y2={py(gate)} stroke={T.white} strokeWidth={2} strokeDasharray="10 8" opacity={0.8} />
      <text x={x + w + 14} y={py(gate) + 8} fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.white}>
        {gateLabel}
      </text>
      {speed.slice(0, shown).map((v, i) =>
        i ? <line key={i} x1={px(i - 1)} x2={px(i)} y1={py(speed[i - 1])} y2={py(v)} stroke={v < gate ? T.green : T.red} strokeWidth={6} style={{filter: glowF(v < gate ? T.green : T.red, 4)}} /> : null,
      )}
      {firstLow > 0 && firstLow < shown ? (
        <text x={px(firstLow)} y={py(gate) + 70} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.green}>
          {hiLabel}
        </text>
      ) : null}
    </svg>
  );
};
