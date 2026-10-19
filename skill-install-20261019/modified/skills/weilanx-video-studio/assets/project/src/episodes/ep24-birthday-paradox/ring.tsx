import React from 'react';
import {clamp01, easeInOut} from '../../library/anim';
import {G, GF} from '../../library/gilded/theme';
import {appearAt, DAYS, DAYS_IN_YEAR, dayLabel, fb, HIT, MATCH, SHOTS, YOU} from './timeline';

/**
 * ep24 的世界：一年 365 天的金色日历环（世界坐标：圆心 960,450，半径 330）。
 * 环上 23 个人，「你」是金色的点；环可以画两两连线、铺满 365 天，并在镜头之间推拉让位。
 */

export const CX = 960;
export const CY = 450;
export const R = 330;
const MONTH_START = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

/** 第 d 天在环上的角度（1 月 1 日在正上方，顺时针） */
export const ang = (d: number) => ((d - 1) / DAYS_IN_YEAR) * Math.PI * 2 - Math.PI / 2;
/** 第 i 个人的点位：撞上的第二个人往外错开一点，两个点都看得见 */
export const dotPos = (i: number) => {
  const r = i === MATCH[1] ? R + 22 : R;
  const a = ang(DAYS[i]);
  return {x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r};
};

/** 连线：返回第 k 对（i < j）此刻画到多少（p）、透明度（o），不画返回 null */
export type ChordFn = (i: number, j: number, k: number) => {p: number; o: number; color?: string; w?: number} | null;

/**
 * 日历环：365 道刻度（每月 1 日长一点并写月份）+ 环上的人。
 * ringAlpha：刻度和月份透明度；dim：压暗除撞上那一对以外的所有东西；hot：撞上那一对变朱红的进度；
 * show(i)：第 i 个人的可见度（默认按 appearAt 落下）；chord：两两连线；youLabel：「你 · 10 月 14 日」标签；
 * year：铺满 365 天的进度（0–1，按日期顺时针扫过去）；extra：第 366 人落下的进度
 */
export const CalendarRing: React.FC<{
  f: number;
  ringAlpha?: number;
  dim?: number;
  hot?: number;
  show?: (i: number) => number;
  chord?: ChordFn;
  youLabel?: number;
  year?: number;
  extra?: number;
}> = ({f, ringAlpha = 1, dim = 1, hot = 0, show, chord, youLabel = 0, year = 0, extra = 0}) => {
  const n = DAYS.length;
  const lines: React.ReactNode[] = [];
  if (chord) {
    let k = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++, k++) {
        const c = chord(i, j, k);
        if (!c || c.p <= 0 || c.o <= 0) continue;
        const a = dotPos(i);
        const b = dotPos(j);
        lines.push(<line key={k} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * c.p} y2={a.y + (b.y - a.y) * c.p} stroke={c.color ?? G.gold} strokeWidth={c.w ?? 1} opacity={c.o} vectorEffect="non-scaling-stroke" />);
      }
  }
  const vis = show ?? ((i: number) => clamp01((f - appearAt(i)) / 10));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g opacity={ringAlpha * dim}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={G.goldLine} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        {Array.from({length: DAYS_IN_YEAR}, (_, k) => {
          const d = k + 1;
          const month = MONTH_START.indexOf(d);
          const a = ang(d);
          const r0 = month >= 0 ? R - 16 : R - 6;
          const r1 = month >= 0 ? R + 16 : R + 6;
          return <line key={d} x1={CX + Math.cos(a) * r0} y1={CY + Math.sin(a) * r0} x2={CX + Math.cos(a) * r1} y2={CY + Math.sin(a) * r1} stroke={month >= 0 ? G.gold : G.goldDeep} strokeWidth={month >= 0 ? 1.6 : 0.8} opacity={month >= 0 ? 0.9 : 0.55} vectorEffect="non-scaling-stroke" />;
        })}
        {MONTH_START.map((d, m) => {
          const a = ang(d + 15);
          return (
            <text key={m} x={CX + Math.cos(a) * (R + 46)} y={CY + Math.sin(a) * (R + 46) + 7} textAnchor="middle" fontFamily={GF.cn} fontSize={19} fill={G.ivoryFaint}>
              {m + 1} 月
            </text>
          );
        })}
      </g>
      <g opacity={dim}>{lines}</g>
      {/* 铺满 365 天：每天一个小点，顺时针扫过去 */}
      {year > 0
        ? Array.from({length: DAYS_IN_YEAR}, (_, k) => {
            const on = clamp01((year * DAYS_IN_YEAR - k) / 12);
            if (on <= 0) return null;
            const a = ang(k + 1);
            return <circle key={`y${k}`} cx={CX + Math.cos(a) * R} cy={CY + Math.sin(a) * R} r={3.4} fill={G.goldBright} opacity={on * 0.85} />;
          })
        : null}
      {extra > 0 ? (
        <circle cx={CX} cy={CY - R - 24 - 160 * (1 - easeInOut(extra))} r={7} fill={G.red} opacity={clamp01(extra * 3)} style={{filter: `drop-shadow(0 0 10px ${G.red})`}} />
      ) : null}
      {DAYS.map((_, i) => {
        const p = vis(i);
        if (p <= 0) return null;
        const {x, y} = dotPos(i);
        const isYou = i === YOU;
        const isHot = (i === MATCH[0] || i === MATCH[1]) && hot > 0;
        const color = isHot ? G.red : isYou ? G.goldBright : G.ivory;
        const r = (isYou ? 8 : 6) * (0.4 + 0.6 * p) + (isHot ? 2 * hot : 0);
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={p * (isHot || isYou ? 1 : dim)} style={{filter: `drop-shadow(0 0 ${isYou || isHot ? 10 : 5}px ${isHot ? G.red : G.gold})`}} />;
      })}
      {youLabel > 0 ? (
        <text x={dotPos(YOU).x - 30} y={dotPos(YOU).y + 40} textAnchor="end" fontFamily={GF.cn} fontSize={24} fill={G.goldBright} opacity={youLabel}>
          你 · {dayLabel(DAYS[YOU])}
        </text>
      ) : null}
      {hot > 0 ? (
        <>
          <circle cx={(dotPos(MATCH[0]).x + dotPos(MATCH[1]).x) / 2} cy={(dotPos(MATCH[0]).y + dotPos(MATCH[1]).y) / 2} r={24 + 30 * (1 - Math.min(1, hot))} fill="none" stroke={G.red} strokeWidth={2} opacity={hot * 0.9} style={{filter: `drop-shadow(0 0 8px ${G.red})`}} />
          <text x={dotPos(MATCH[1]).x - 36} y={dotPos(MATCH[1]).y + 58} textAnchor="middle" fontFamily={GF.cn} fontSize={24} fill={G.red} opacity={hot}>
            {dayLabel(DAYS[MATCH[0]])}
          </text>
        </>
      ) : null}
    </svg>
  );
};

/* ---------------- 环的镜头：重拍之后在各段之间推拉让位 ---------------- */

type Pose = {dx: number; dy: number; s: number; o: number};
const CENTER: Pose = {dx: 0, dy: 0, s: 1, o: 1};
const SIDE: Pose = {dx: -470, dy: 30, s: 0.58, o: 1};
/** 世界杯格子里的第一个小环（左上角）：环缩进去，变成 32 支球队中的一支 */
export const WC_CELL = {x: 260, y: 280, r: 64};
const CELL: Pose = {dx: WC_CELL.x - CX, dy: WC_CELL.y - CY, s: WC_CELL.r / R, o: 1};
const hide = (p: Pose): Pose => ({...p, o: 0});

/** 关键帧：[帧, 姿态]，相邻两帧之间 easeInOut 插值 */
const KEYS: [number, Pose][] = [
  [HIT, CENTER],
  [SHOTS.product[0], CENTER],
  [SHOTS.product[0] + 22, SIDE],
  [SHOTS.drawer[0], SIDE],
  [SHOTS.drawer[0] + 22, CENTER],
  [SHOTS.worldcup[0], CENTER],
  [SHOTS.worldcup[0] + 26, CELL],
  [SHOTS.worldcup[0] + 40, hide(CELL)],
  [SHOTS.pairs[0] - 1, hide(CENTER)],
  [SHOTS.pairs[0] + 14, CENTER],
  [fb(36), CENTER],
  [fb(36) + 22, SIDE],
  [SHOTS.pairs[1] - 14, SIDE],
  [SHOTS.pairs[1], hide(SIDE)],
];

export const ringPose = (f: number): Pose => {
  if (f <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    const [f1, b] = KEYS[i];
    const [f0, a] = KEYS[i - 1];
    if (f <= f1) {
      const t = easeInOut(clamp01((f - f0) / Math.max(1, f1 - f0)));
      return {dx: a.dx + (b.dx - a.dx) * t, dy: a.dy + (b.dy - a.dy) * t, s: a.s + (b.s - a.s) * t, o: a.o + (b.o - a.o) * t};
    }
  }
  return KEYS[KEYS.length - 1][1];
};

/** 把环放进当前镜头：以圆心为原点缩放，再平移 */
export const RingCam: React.FC<{pose: Pose; children: React.ReactNode}> = ({pose, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: pose.o, transformOrigin: `${CX}px ${CY}px`, transform: `translate(${pose.dx}px, ${pose.dy}px) scale(${pose.s})`}}>{children}</div>
);
