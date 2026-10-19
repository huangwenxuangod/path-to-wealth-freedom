import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';

/**
 * ep51 各段画面。组件都拿帧号，自己按 timeline 的拍子算出场时间。
 */

/**
 * 一张小图（示意）：两条线，「当场表现」（橙）和「真正学到」（青），横轴是时间；perf / learn 是 0–1 的采样
 */
export const PerfLearn: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; perf: number[]; learn: number[]; title: string; titleColor: string}> = ({f, at, x, y, w = 680, h = 300, perf, learn, title, titleColor}) => {
  const p = clamp01((f - at) / 30);
  const path = (arr: number[]) => {
    const n = Math.max(2, Math.round(arr.length * p));
    return arr.slice(0, n).map((v, i) => `${i ? 'L' : 'M'}${(x + (i / (arr.length - 1)) * w).toFixed(1)} ${(y + h - v * h * 0.85).toFixed(1)}`).join(' ');
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <text x={x + w / 2} y={y - 30} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={titleColor}>
        {title}
      </text>
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <path d={path(perf)} fill="none" stroke={T.orange} strokeWidth={6} style={{filter: glowF(T.orange, 5)}} />
      <path d={path(learn)} fill="none" stroke={T.cyan} strokeWidth={6} strokeDasharray="14 8" style={{filter: glowF(T.cyan, 5)}} />
      <g fontFamily={TF.sans} fontSize={26}>
        <rect x={x + 10} y={y + h + 24} width={24} height={6} fill={T.orange} />
        <text x={x + 42} y={y + h + 34} fill={T.orange}>
          当场表现
        </text>
        <rect x={x + 220} y={y + h + 24} width={24} height={6} fill={T.cyan} />
        <text x={x + 252} y={y + h + 34} fill={T.cyan}>
          真正学到
        </text>
      </g>
    </svg>
  );
};

/** 两组对比柱（示意，只画方向）：groups 是 [名字, 左值, 右值]，左右颜色和图例 names */
export const PairBars: React.FC<{f: number; at: number; groups: [string, number, number, number][]; names: [string, string]; colors?: [string, string]; y?: number}> = ({f, at, groups, names, colors = [T.gray, T.cyan], y = 700}) => {
  const gw = 1200 / groups.length;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={360} x2={1560} y1={y} y2={y} stroke={T.faint} strokeWidth={2} />
      {groups.map(([name, a, b, ga], i) => {
        const p = easeOut(clamp01((f - ga) / 14));
        const cx = 360 + gw * i + gw / 2;
        return (
          <g key={name} opacity={clamp01((f - ga) / 6)}>
            <rect x={cx - 110} y={y - a * 300 * p} width={100} height={a * 300 * p} fill={colors[0]} style={{filter: glowF(colors[0], 5)}} />
            <rect x={cx + 10} y={y - b * 300 * p} width={100} height={b * 300 * p} fill={colors[1]} style={{filter: glowF(colors[1], 5)}} />
            <text x={cx} y={y + 50} textAnchor="middle" fontFamily={TF.sans} fontSize={34} fill={T.white}>
              {name}
            </text>
          </g>
        );
      })}
      <g fontFamily={TF.sans} fontSize={28} opacity={clamp01((f - at) / 6)}>
        <rect x={700} y={y - 380} width={26} height={26} fill={colors[0]} />
        <text x={738} y={y - 358} fill={colors[0]}>
          {names[0]}
        </text>
        <rect x={1000} y={y - 380} width={26} height={26} fill={colors[1]} />
        <text x={1038} y={y - 358} fill={colors[1]}>
          {names[1]}
        </text>
      </g>
    </svg>
  );
};

/** 一排画（原创色块代表不同画家）：order 是画家序号串，如 'AAAABBBB' 或 'ABCABC'；at 起每 3 帧亮一张 */
export const PaintRow: React.FC<{f: number; at: number; order: string; y: number; label: string; color: string}> = ({f, at, order, y, label, color}) => {
  const pal: Record<string, string> = {A: '#c96a4a', B: '#4a8fc9', C: '#8fc94a'};
  const cell = 92;
  const x0 = 960 - (order.length * cell) / 2 + 120;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <text x={x0 - 30} y={y + 58} textAnchor="end" fontFamily={TF.sans} fontSize={34} fill={color} opacity={clamp01((f - at) / 6)}>
        {label}
      </text>
      {[...order].map((c, i) => (
        <g key={i} opacity={clamp01((f - at - i * 3) / 4)}>
          <rect x={x0 + i * cell} y={y} width={cell - 14} height={96} rx={6} fill={pal[c]} opacity={0.85} />
          <path d={`M${x0 + i * cell + 10} ${y + 80} q 20 -40 36 -10 q 16 -30 30 0`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={4} />
          <text x={x0 + i * cell + (cell - 14) / 2} y={y + 126} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
            {c}
          </text>
        </g>
      ))}
    </svg>
  );
};

const YARD: Box[] = [
  {x: -3.6, z: 13, w: 2, h: 1.4, crate: true},
  {x: 3.8, z: 14, w: 1.8, h: 2},
];
/** 结尾暖色射击场：准星稳稳压着对枪位上的人，kill 那一帧爆头 */
export const OutroRange: React.FC<{f: number; kill: number}> = ({f, kill}) => {
  const cam = {x: 0, z: 0, y: 1.6, yaw: 0};
  const head = project([0.6, 1.53, 10], cam) ?? [1020, 547];
  const killed = f >= kill + 2;
  const kick = f >= kill ? Math.max(0, 1 - (f - kill) / 6) : 0;
  return (
    <>
      <Range cam={cam} tone="warm" boxes={YARD} dummies={[{x: 0.6, z: 10, state: killed ? 'dead' : f >= kill ? 'hit' : 'idle'}]} wallZ={24} />
      <Crosshair x={head[0]} y={head[1]} color="#ffd9a8" />
      {f >= kill ? (
        <>
          <Tracer to={head} t={f - kill} />
          <HitMark f={f} at={kill} x={head[0]} y={head[1]} text="HEADSHOT" color="#ffd9a8" />
        </>
      ) : null}
      <ViewGun sway={Math.sin(f / 9) * 0.4} kick={kick} tone="warm" />
    </>
  );
};
