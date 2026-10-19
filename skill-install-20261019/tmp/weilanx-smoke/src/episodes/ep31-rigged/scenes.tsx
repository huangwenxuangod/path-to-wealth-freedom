import React from 'react';
import {clamp01, easeInOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Cam, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';
import {fbt, WIN_BEATS} from './timeline';

/**
 * ep31 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const BOXES: Box[] = [
  {x: -4.2, z: 9, w: 1.6, h: 1.6, crate: true},
  {x: 3.8, z: 11, w: 1.4, h: 2.2},
  {x: 0.6, z: 15, w: 2.4, h: 1.2},
];
/** 开场三个对手：依次在左、中、右露头 */
const FOES = [
  {x: -2.6, z: 10},
  {x: 0.4, z: 13},
  {x: 2.9, z: 10.5},
];
const yawTo = (p: {x: number; z: number}) => Math.atan2(p.x, p.z);

/** 开场：连赢三把。每一把在 WIN_BEATS[k] 拍爆头，之前 8 帧把视角甩过去 */
export const WinStreak: React.FC<{f: number; tone?: Tone}> = ({f, tone = 'blue'}) => {
  const shots = WIN_BEATS.map((b) => fbt(b));
  let yaw = yawTo(FOES[0]) - 0.25;
  shots.forEach((s, k) => {
    const from = k === 0 ? yawTo(FOES[0]) - 0.25 : yawTo(FOES[k - 1]);
    const p = easeInOut(clamp01((f - (s - 10)) / 8));
    if (f >= s - 10) yaw = from + (yawTo(FOES[k]) - from) * p;
  });
  const cam: Cam = {x: 0, z: 0, yaw};
  const k = shots.filter((s) => f >= s).length;
  const last = shots[Math.max(0, k - 1)];
  const t = f - last;
  const foe = FOES[Math.max(0, k - 1)];
  const head = project([foe.x, 1.75, foe.z], cam) ?? [960, 470];
  return (
    <>
      <Range cam={cam} tone={tone} boxes={BOXES} dummies={FOES.map((p, i) => ({...p, state: i < k - 1 || (i === k - 1 && t > 6) ? 'dead' : i === k - 1 && t >= 0 ? 'hit' : 'idle'}))} />
      <Crosshair />
      {k > 0 && <Tracer to={[960, head[1]]} t={t} />}
      {k > 0 && <HitMark f={f} at={last + 1} x={960} y={head[1]} text="HEADSHOT" />}
      <ViewGun kick={k > 0 ? clamp01(1 - Math.abs(t) / 5) : 0} sway={Math.sin(f / 18)} tone={tone} />
      <WinCounter f={f} shots={shots} />
    </>
  );
};

/** 右上角的连胜计数：每赢一把亮一格 */
export const WinCounter: React.FC<{f: number; shots: number[]}> = ({f, shots}) => (
  <div style={{position: 'absolute', right: 110, top: 150, display: 'flex', gap: 12, alignItems: 'center'}}>
    <span style={{fontFamily: TF.sans, fontSize: 28, color: T.gray, marginRight: 8}}>连胜</span>
    {shots.map((s, i) => {
      const on = clamp01((f - s - 4) / 6);
      return (
        <div key={i} style={{width: 56, height: 56, border: `2px solid ${on > 0 ? T.cyan : 'rgba(200,215,225,0.2)'}`, background: `rgba(66,198,223,${0.25 * on})`, boxShadow: `0 0 ${14 * on}px ${T.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontSize: 28, color: on > 0 ? T.cyan : T.dim}}>
          胜
        </div>
      );
    })}
  </div>
);

/** 第一把输：同一个射击场变红，视角停在最后一个对手（他已经倒了）；DeathScreen 由主组件叠 */
export const LossView: React.FC = () => (
  <>
    <Range cam={{x: 0, z: 0, yaw: yawTo(FOES[2])}} tone="red" boxes={BOXES} dummies={[{x: 2.9, z: 10.5}, {x: -1.2, z: 8}]} />
    <Crosshair color={T.red} />
  </>
);

/** 段位分往下掉：一根横条从满到少（示意，不标具体数值） */
export const RankDrop: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = easeInOut(clamp01((f - at - 6) / 24));
  const w = 900;
  const v = 0.72 - 0.4 * p;
  return (
    <div style={{position: 'absolute', left: (1920 - w) / 2, top: 700, width: w}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: TF.sans, fontSize: 26, color: T.gray, marginBottom: 12}}>
        <span>段位进度</span>
        <span style={{color: T.red}}>↓↓</span>
      </div>
      <div style={{position: 'relative', height: 22, background: 'rgba(200,215,225,0.08)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.72, background: 'rgba(229,80,91,0.25)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * v, background: T.red, boxShadow: `0 0 14px ${T.red}`}} />
      </div>
    </div>
  );
};

/** 连胜之后的赢面（示意）：低估你的时候赢面偏高，隐藏分追上来后回到 50% */
export const CONVERGE = [64, 62, 60, 57, 55, 53, 52, 51, 50, 50, 50, 50];

/** 「坏的分量更重」：天平左边一块「输」，右边一块「赢」，左边沉下去 */
export const BadWeight: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const tilt = easeInOut(clamp01((t - 10) / 20)) * 0.2;
  const cx = 960;
  const cy = 360;
  const L = 460;
  const end = (s: number) => [cx + s * L * Math.cos(tilt), cy - s * L * Math.sin(tilt)] as const;
  const blk = (s: number, c: string, label: string, size: number) => {
    const [x, y] = end(s);
    return (
      <g>
        <line x1={x} y1={y} x2={x} y2={y + 120} stroke={T.faint} strokeWidth={2} />
        <rect x={x - size / 2} y={y + 120} width={size} height={size} rx={10} fill={c === T.red ? 'rgba(229,80,91,0.25)' : 'rgba(66,198,223,0.18)'} stroke={c} strokeWidth={3} style={{filter: glowF(c, 8)}} />
        <text x={x} y={y + 120 + size / 2 + 14} textAnchor="middle" fontFamily={TF.sans} fontSize={size > 180 ? 38 : 30} fill={c}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <path d={`M${cx} ${cy} L${cx - 60} ${cy + 400} L${cx + 60} ${cy + 400} Z`} fill="#0d1622" stroke={T.faint} strokeWidth={2} />
      <line x1={end(-1)[0]} y1={end(-1)[1]} x2={end(1)[0]} y2={end(1)[1]} stroke={T.white} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={T.white} />
      {blk(-1, T.red, '一次连跪', 210)}
      {blk(1, T.cyan, '一次连胜', 160)}
    </svg>
  );
};

/** 方法卡图标 */
export const STEP_ICONS: ((c: string) => React.ReactNode)[] = [
  (c) => (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={30 + i * 24} y={i % 3 === 0 ? 60 : 80} width={18} height={18} rx={3} fill={c} opacity={i % 3 === 0 ? 1 : 0.45} />
      ))}
      <path d="M30 130 L210 130" stroke={c} strokeWidth={3} />
    </>
  ),
  (c) => (
    <>
      <rect x={84} y={40} width={22} height={80} rx={4} fill={c} />
      <rect x={134} y={40} width={22} height={80} rx={4} fill={c} />
    </>
  ),
  (c) => (
    <>
      <rect x={60} y={40} width={44} height={90} fill="none" stroke={c} strokeWidth={4} />
      <rect x={136} y={70} width={44} height={60} fill="none" stroke={c} strokeWidth={4} strokeDasharray="8 6" />
      <path d="M82 30 L82 14 M74 22 L82 14 L90 22" stroke={c} strokeWidth={4} fill="none" />
    </>
  ),
  (c) => (
    <>
      <path d="M40 120 L90 90 L130 100 L200 40" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M180 40 L200 40 L200 60" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />
    </>
  ),
];

/** 结尾：暖色射击场，赢下新的一把 */
export const NewRound: React.FC<{f: number; shotAt: number}> = ({f, shotAt}) => {
  const foe = {x: 1.4, z: 11};
  const yaw = yawTo(foe) - 0.3 + 0.3 * easeInOut(clamp01((f - (shotAt - 14)) / 10));
  const cam: Cam = {x: 0, z: 0, yaw};
  const t = f - shotAt;
  const head = project([foe.x, 1.75, foe.z], cam) ?? [960, 470];
  return (
    <>
      <Range cam={cam} tone="warm" boxes={BOXES} dummies={[{...foe, state: t > 6 ? 'dead' : t >= 0 ? 'hit' : 'idle'}]} />
      <Crosshair color="#ffd9a8" />
      <Tracer to={[960, head[1]]} t={t} />
      <ViewGun kick={clamp01(1 - Math.abs(t) / 5)} tone="warm" sway={Math.sin(f / 22) * 0.5} />
      <HitMark f={f} at={shotAt + 1} x={960} y={head[1]} text="HEADSHOT" />
    </>
  );
};
