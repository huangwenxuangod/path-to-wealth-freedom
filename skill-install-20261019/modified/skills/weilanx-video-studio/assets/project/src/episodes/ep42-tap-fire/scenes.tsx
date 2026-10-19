import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Tone} from '../../library/tactical/range';
import {diskPoint, heatAt} from '../../library/tactical/spread';
import {glowF, T, TF} from '../../library/tactical/theme';
import {hitChance} from './timeline';

/**
 * ep42 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const YARD: Box[] = [
  {x: -4.5, z: 20, w: 2, h: 1.4, crate: true},
  {x: -1.8, z: 21, w: 1.6, h: 2},
  {x: 3, z: 20, w: 2, h: 1.2, crate: true},
  {x: 6, z: 18, w: 1.6, h: 1.8},
];
/** 头部中心离地高度（Range 胶囊人靶：身高 1.32 + 头半径 0.17 × 1.25） */
export const HEAD_Y = 1.53;
export const FOE = {x: 0.4, z: 16};

/**
 * 第一人称远距离架枪：准星压在敌人头上；shots（帧）每一枪的弹孔落在当时的散布圈里（base + per × 热度，像素），
 * 热度越高弹孔还往上飘一点（后坐示意）；弹孔留在墙上
 */
export const SprayView: React.FC<{f: number; shots?: number[]; base?: number; per?: number; recover?: number; rise?: number; seed?: number; tone?: Tone; hitText?: string; hitAt?: number; foeState?: 'idle' | 'hit' | 'dead'}> = ({
  f,
  shots = [],
  base = 6,
  per = 16,
  recover = 11,
  rise = 7,
  seed = 3,
  tone = 'blue',
  hitText,
  hitAt,
  foeState = 'idle',
}) => {
  const cam = {x: 0, z: 0, y: HEAD_Y, yaw: Math.atan2(FOE.x, FOE.z)};
  const head = project([FOE.x, HEAD_Y, FOE.z], cam) ?? [960, 540];
  const fired = shots.filter((s) => s <= f);
  const last = fired.length ? fired[fired.length - 1] : -99;
  const kick = f - last < 3 ? 1 - (f - last) / 3 : 0;
  const pts = fired.map((s, i) => {
    const h = heatAt(shots, s - 1e-6, recover);
    const r = base + per * h;
    const [u, v] = diskPoint(seed + i * 1.91);
    return [head[0] + u * r, head[1] + v * r - rise * h] as [number, number];
  });
  return (
    <>
      <Range cam={cam} tone={tone} boxes={YARD} dummies={[{x: FOE.x, z: FOE.z, state: foeState}]} wallZ={24} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={5} fill="#fff6d8" style={{filter: glowF('#ffd27a', 5)}} />
            <circle cx={x} cy={y} r={2} fill="#1a1208" />
          </g>
        ))}
      </svg>
      {pts.length ? <Tracer to={pts[pts.length - 1]} t={f - last} /> : null}
      <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} spread={Math.min(1, kick * 0.5 + heatAt(shots, f, recover) * 0.12)} />
      <ViewGun kick={kick} sway={Math.sin(f / 9) * 0.4} tone={tone} />
      {hitText && hitAt !== undefined ? <HitMark f={f} at={hitAt} x={head[0]} y={head[1]} text={hitText} color={hitText === 'MISS' ? '#ffffff' : T.orange} /> : null}
    </>
  );
};

/** 扫射每一发的命中率（示意）：一排柱子从左到右依次长出，越往后越矮 */
export const ShotChanceRow: React.FC<{f: number; at: number; chances: number[]; per?: number}> = ({f, at, chances, per = 3}) => {
  const x0 = 300;
  const w = 1320;
  const h = 380;
  const y0 = 230;
  const bw = (w / chances.length) * 0.62;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x0} x2={x0 + w} y1={y0 + h} y2={y0 + h} stroke={T.faint} strokeWidth={2} />
      <text x={x0} y={y0 - 20} fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        扫射时每一发打中头的概率（示意）
      </text>
      {chances.map((c, i) => {
        const p = easeOut(clamp01((f - at - i * per) / 10));
        const x = x0 + (i + 0.19) * (w / chances.length);
        const bh = c * h * p;
        const col = c > 0.5 ? T.cyan : c > 0.15 ? T.orange : T.red;
        return (
          <g key={i} opacity={clamp01((f - at - i * per) / 4)}>
            <rect x={x} y={y0 + h - bh} width={bw} height={bh} fill={col} style={{filter: glowF(col, 5)}} />
            <text x={x + bw / 2} y={y0 + h - bh - 12} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={col}>
              {Math.round(c * 100 * p)}%
            </text>
            <text x={x + bw / 2} y={y0 + h + 34} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x={x0 + w} y={y0 + h + 76} textAnchor="end" fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        第几发 →
      </text>
    </svg>
  );
};

/** 命中率—距离：第一发（青）和扫射后段（红）两条线；near / far 两段区域在各自帧亮起说明 */
export const ProbCross: React.FC<{f: number; at: number; headDeg: (d: number) => number; first: number; late: number; nearAt: number; farAt: number}> = ({f, at, headDeg, first, late, nearAt, farAt}) => {
  const x0 = 300;
  const w = 1320;
  const y0 = 220;
  const h = 440;
  const dMin = 2;
  const dMax = 40;
  const sx = (d: number) => x0 + ((d - dMin) / (dMax - dMin)) * w;
  const sy = (p: number) => y0 + h - p * h;
  const ds = Array.from({length: 77}, (_, i) => dMin + (i / 76) * (dMax - dMin));
  const draw = clamp01((f - at) / 24);
  const line = (s: number) =>
    ds
      .filter((d) => d <= dMin + (dMax - dMin) * draw)
      .map((d, i) => `${i ? 'L' : 'M'}${sx(d).toFixed(1)} ${sy(hitChance(headDeg(d), s)).toFixed(1)}`)
      .join(' ');
  const cross = ds.find((d) => headDeg(d) < late) ?? dMax;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <rect x={x0} y={y0} width={sx(cross) - x0} height={h} fill="rgba(62,207,142,0.12)" opacity={clamp01((f - nearAt) / 8)} />
      <text x={(x0 + sx(cross)) / 2} y={y0 + 40} textAnchor="middle" fontFamily={TF.sans} fontSize={28} fill={T.green} opacity={clamp01((f - nearAt) / 8)}>
        近处：都能中
      </text>
      <text x={sx(26)} y={y0 + h - 150} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.orange} opacity={clamp01((f - farAt) / 8)} style={{filter: glowF(T.orange, 5)}}>
        远处：只有第一发还能中
      </text>
      <line x1={x0} x2={x0} y1={y0} y2={y0 + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x0} x2={x0 + w} y1={y0 + h} y2={y0 + h} stroke={T.faint} strokeWidth={2} />
      {[0, 0.5, 1].map((p) => (
        <text key={p} x={x0 - 14} y={sy(p) + 8} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
          {p * 100}%
        </text>
      ))}
      {[5, 10, 20, 30, 40].map((d) => (
        <text key={d} x={sx(d)} y={y0 + h + 36} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
          {d} 米
        </text>
      ))}
      <text x={x0} y={y0 - 20} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        一发打中头的概率 · 示意
      </text>
      <path d={line(first)} fill="none" stroke={T.cyan} strokeWidth={5} style={{filter: glowF(T.cyan, 6)}} />
      <path d={line(late)} fill="none" stroke={T.red} strokeWidth={5} style={{filter: glowF(T.red, 6)}} />
      <g opacity={draw}>
        <text x={sx(40) - 10} y={sy(hitChance(headDeg(40), first)) - 18} textAnchor="end" fontFamily={TF.sans} fontSize={28} fill={T.cyan}>
          第一发
        </text>
        <text x={sx(14)} y={sy(hitChance(headDeg(14), late)) + 46} fontFamily={TF.sans} fontSize={28} fill={T.red}>
          扫射后段
        </text>
      </g>
    </svg>
  );
};

/** 两条原话卡（上下各一）：机构 · 年份 + 英文斜体 + 中文大意 */
export const QuotePair: React.FC<{f: number; items: {at: number; label: string; quote: string; zh: string; color: string}[]}> = ({f, items}) => (
  <>
    {items.map((it, i) => (
      <div key={i} style={{position: 'absolute', left: 220, right: 220, top: 210 + i * 270, opacity: clamp01((f - it.at) / 8), borderLeft: `4px solid ${it.color}`, paddingLeft: 36}}>
        <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: it.color}}>{it.label}</div>
        <div style={{marginTop: 18, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 36, lineHeight: 1.35, color: T.white}}>“{it.quote}”</div>
        <div style={{marginTop: 12, fontFamily: TF.sans, fontSize: 28, color: T.gray}}>{it.zh}</div>
      </div>
    ))}
  </>
);
