import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 延迟 / 流水线示意（ep39 起）：一件事要依次走过几段才能完成时用。
 * PipelineFlow 横向分段流水线（逐段亮起、下方轨道上跑信号点或一串帧、队列里堆着几帧）；
 * FrameLanes CPU / 渲染队列 / GPU 三条泳道的甘特图（GPU 吃满时 CPU 提前跑、帧在队列里等；jit 拉到 1 = 刚好赶上、队列清空）；
 * LatencyStack 横向堆叠的毫秒条（几段时间首尾相接，区间用浅色斜纹延长）。
 * 都画在整屏 1920×1080 的 SVG 里，坐标是屏幕像素。
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type PipeStream = {phase: number; n: number; gap?: number};

/**
 * 横向流水线：stages 等宽（或按 widths 比例）排开，第 i 段在 ats[i] 帧亮起；hot 那一段用红色；
 * queueIdx 那一段里堆 queued 个小方块（可小数，清空时逐个淡掉）；
 * 下方轨道：dot（0–1）是一颗青色信号点走到哪儿；stream 是一串匀速流过的灰点（出货速度）
 */
export const PipelineFlow: React.FC<{
  f: number;
  stages: string[];
  sub?: string[];
  ats: number[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  widths?: number[];
  hot?: number;
  queueIdx?: number;
  queued?: number;
  dot?: number | null;
  stream?: PipeStream;
  rail?: boolean;
  ends?: [string, string];
}> = ({f, stages, sub = [], ats, x = 160, y = 380, w = 1600, h = 160, widths, hot, queueIdx, queued = 0, dot = null, stream, rail = true, ends}) => {
  const gap = 34;
  const ws = widths ?? stages.map(() => 1);
  const tot = ws.reduce((s, v) => s + v, 0);
  const inner = w - gap * (stages.length - 1);
  let cx = x;
  const boxes = stages.map((s, i) => {
    const bw = (ws[i] / tot) * inner;
    const b = {x: cx, w: bw};
    cx += bw + gap;
    return b;
  });
  const railY = y + h + 70;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {boxes.map((b, i) => {
        const on = clamp01((f - ats[i]) / 8);
        const c = hot === i ? T.red : T.cyan;
        return (
          <g key={i} opacity={0.25 + 0.75 * on}>
            <rect x={b.x} y={y} width={b.w} height={h} fill="rgba(10,19,34,0.8)" stroke={on > 0 ? c : T.faint} strokeWidth={on > 0 ? 3 : 2} style={on > 0 ? {filter: glowF(c, 6 * on)} : undefined} />
            <text x={b.x + b.w / 2} y={y + (queueIdx === i ? 62 : 82)} textAnchor="middle" fontFamily={TF.sans} fontSize={40} fill={on > 0 ? T.white : T.dim}>
              {stages[i]}
            </text>
            {sub[i] ? (
              <text x={b.x + b.w / 2} y={y + (queueIdx === i ? 96 : 120)} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={17} letterSpacing={3} fill={T.gray}>
                {sub[i]}
              </text>
            ) : null}
            {i < boxes.length - 1 ? <path d={`M${b.x + b.w + 9} ${y + h / 2 - 12} L${b.x + b.w + 23} ${y + h / 2} L${b.x + b.w + 9} ${y + h / 2 + 12}`} fill="none" stroke={on > 0 ? T.cyan : T.faint} strokeWidth={4} /> : null}
          </g>
        );
      })}
      {queueIdx !== undefined
        ? Array.from({length: Math.ceil(queued)}, (_, k) => {
            const b = boxes[queueIdx];
            const bw = 42;
            const n = Math.ceil(queued);
            const bx = b.x + b.w / 2 - (n * bw + (n - 1) * 10) / 2 + k * (bw + 10);
            const o = clamp01(queued - k);
            return <rect key={k} x={bx} y={y + h - 50} width={bw} height={30} fill={T.red} opacity={0.8 * o} style={{filter: glowF(T.red, 5)}} />;
          })
        : null}
      {rail ? <line x1={x} x2={x + w} y1={railY} y2={railY} stroke={T.faint} strokeWidth={3} strokeDasharray="10 10" /> : null}
      {ends ? (
        <>
          <text x={x} y={railY + 52} fontFamily={TF.sans} fontSize={28} fill={T.cyan}>
            {ends[0]}
          </text>
          <text x={x + w} y={railY + 52} textAnchor="end" fontFamily={TF.sans} fontSize={28} fill={T.orange}>
            {ends[1]}
          </text>
        </>
      ) : null}
      {stream
        ? Array.from({length: stream.n}, (_, k) => {
            const sp = stream.gap ?? 1 / stream.n;
            const p = (((stream.phase + k * sp) % 1) + 1) % 1;
            return <circle key={k} cx={x + p * w} cy={railY} r={9} fill={T.gray} opacity={0.75} />;
          })
        : null}
      {dot !== null ? (
        <>
          <line x1={x} x2={x + clamp01(dot) * w} y1={railY} y2={railY} stroke={T.cyan} strokeWidth={5} style={{filter: glowF(T.cyan, 6)}} />
          <circle cx={x + clamp01(dot) * w} cy={railY} r={16} fill="#fff" style={{filter: glowF(T.cyan, 12)}} />
        </>
      ) : null}
    </svg>
  );
};

/** 一帧在三条泳道上的起止（像素）：GPU 背靠背；CPU 最多提前 ahead 帧（jit = 1 时刚好赶在 GPU 开工前算完） */
export const laneTimes = (k: number, g: number, c: number, ahead = 2, jit = 0) => {
  const gpu0 = c + k * g;
  const queued = Math.max(k * c, c + (k - ahead) * g);
  const cpu0 = lerp(queued, gpu0 - c, jit);
  return {cpu0, cpu1: cpu0 + c, gpu0, gpu1: gpu0 + g};
};

/**
 * CPU / 渲染队列 / GPU 三条泳道（示意）：帧编号方块从左往右排开，now 是时间扫描线画到哪（像素）；
 * you 那一帧画成青色，bracket 给它从 CPU 开工到 GPU 画完拉一条延迟括号
 */
export const FrameLanes: React.FC<{
  now: number;
  x?: number;
  y?: number;
  g?: number;
  c?: number;
  n?: number;
  ahead?: number;
  jit?: number;
  you?: number;
  bracket?: number;
  bracketLabel?: string;
  labels?: [string, string, string];
}> = ({now, x = 330, y = 300, g = 150, c = 80, n = 9, ahead = 2, jit = 0, you, bracket = 0, bracketLabel = '你这一枪的延迟', labels = ['CPU', '渲染队列', 'GPU']}) => {
  const lane = 74;
  const gapY = 40;
  const rows = [y, y + lane + gapY, y + 2 * (lane + gapY)];
  const cut = (a: number, b: number) => [a, Math.min(b, now)] as const;
  /** half：0 整行，1 / 2 上半 / 下半行（队列里相邻两帧会同时在等，错开画） */
  const block = (key: string, a: number, b: number, row: number, fill: string, stroke: string, label?: string, half = 0) => {
    const [s, e] = cut(a, b);
    if (e <= s) return null;
    const top = rows[row] + (half === 2 ? lane / 2 + 1 : 4);
    const bh = half ? lane / 2 - 5 : lane - 8;
    return (
      <g key={key}>
        <rect x={x + s} y={top} width={e - s - 4} height={bh} fill={fill} stroke={stroke} strokeWidth={2} />
        {label && e - s > 34 ? (
          <text x={x + s + 12} y={top + bh / 2 + (half ? 8 : 10)} fontFamily={TF.mono} fontWeight={700} fontSize={half ? 22 : 26} fill={T.white}>
            {label}
          </text>
        ) : null}
      </g>
    );
  };
  const yt = you !== undefined ? laneTimes(you, g, c, ahead, jit) : null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {labels.map((l, i) => (
        <g key={l}>
          <text x={x - 30} y={rows[i] + lane / 2 + 12} textAnchor="end" fontFamily={TF.sans} fontSize={34} fill={i === 1 ? T.red : T.text}>
            {l}
          </text>
          <line x1={x} x2={x + n * g} y1={rows[i] + lane} y2={rows[i] + lane} stroke={T.faint} strokeWidth={2} />
        </g>
      ))}
      {Array.from({length: n}, (_, k) => {
        const t = laneTimes(k, g, c, ahead, jit);
        const mine = k === you;
        const fillC = mine ? 'rgba(66,198,223,0.55)' : 'rgba(110,150,180,0.28)';
        const strokeC = mine ? T.cyan : 'rgba(160,200,220,0.45)';
        return (
          <g key={k}>
            {block(`c${k}`, t.cpu0, t.cpu1, 0, fillC, strokeC, `${k + 1}`)}
            {t.gpu0 - t.cpu1 > 6 ? block(`q${k}`, t.cpu1, t.gpu0, 1, mine ? 'rgba(66,198,223,0.25)' : 'rgba(229,80,91,0.22)', mine ? T.cyan : 'rgba(229,80,91,0.6)', `${k + 1}`, 1 + (k % 2)) : null}
            {block(`g${k}`, t.gpu0, t.gpu1, 2, fillC, strokeC, `${k + 1}`)}
          </g>
        );
      })}
      <line x1={x + Math.min(now, n * g + c)} x2={x + Math.min(now, n * g + c)} y1={y - 20} y2={rows[2] + lane + 16} stroke={T.white} strokeWidth={2} opacity={0.5} />
      {yt && bracket > 0 ? (
        <g opacity={bracket}>
          <path d={`M${x + yt.cpu0} ${rows[2] + lane + 26} v18 H${x + yt.cpu0 + (yt.gpu1 - yt.cpu0) * easeOut(bracket)} v-18`} fill="none" stroke={T.cyan} strokeWidth={4} style={{filter: glowF(T.cyan, 6)}} />
          <text x={x + (yt.cpu0 + yt.gpu1) / 2} y={rows[2] + lane + 90} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.cyan}>
            {bracketLabel}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

export type StackSeg = {label: string; ms: number; ms2?: number; color: string; at: number; sub?: string};

/**
 * 横向堆叠的毫秒条：几段时间首尾相接，第 i 段在 segs[i].at 帧长出来；ms2 给了就用浅色斜纹延长到区间上限；
 * 每段上方标名字、下方标数字（sub 覆盖）
 */
export const LatencyStack: React.FC<{f: number; segs: StackSeg[]; max: number; x?: number; y?: number; w?: number; h?: number}> = ({f, segs, max, x = 200, y = 460, w = 1520, h = 64}) => {
  let acc = 0;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        {segs.map((s, i) => (
          <pattern key={i} id={`lstack-${i}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={14} height={14} fill={s.color} opacity={0.18} />
            <line x1={0} y1={0} x2={0} y2={14} stroke={s.color} strokeWidth={6} opacity={0.55} />
          </pattern>
        ))}
      </defs>
      <rect x={x} y={y} width={w} height={h} fill="rgba(200,215,225,0.05)" />
      {segs.map((s, i) => {
        const p = easeOut(clamp01((f - s.at) / 18));
        const x0 = x + (acc / max) * w;
        const bw = (s.ms / max) * w * p;
        const bw2 = s.ms2 !== undefined ? ((s.ms2 - s.ms) / max) * w * p : 0;
        acc += s.ms2 ?? s.ms;
        const o = clamp01((f - s.at) / 8);
        const mid = x0 + (bw + bw2) / 2;
        return (
          <g key={i} opacity={o}>
            <rect x={x0} y={y} width={Math.max(bw, 3)} height={h} fill={s.color} style={{filter: glowF(s.color, 8)}} />
            {bw2 > 0 ? <rect x={x0 + bw} y={y} width={bw2} height={h} fill={`url(#lstack-${i})`} /> : null}
            <text x={mid} y={y - 22} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={s.color}>
              {s.label}
            </text>
            <text x={mid} y={y + h + 46} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={T.white}>
              {s.sub ?? (s.ms2 !== undefined ? `${s.ms}～${s.ms2} ms` : `${s.ms} ms`)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
