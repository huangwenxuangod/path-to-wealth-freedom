import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {Crosshair, Range, ViewGun} from '../../library/tactical/range';
import type {Box, Tone} from '../../library/tactical/range';
import {VecArrow} from '../../library/tactical/vectors';
import {glowF, T, TF} from '../../library/tactical/theme';
import {fbt, HOP_BEATS, PASS} from './timeline';

/**
 * ep37 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

/** 一条长走廊：两侧一排排箱子，远处一面墙（世界单位：米；你从 z = 0 往 +z 跑） */
const CORRIDOR: Box[] = Array.from({length: 14}, (_, i) => ({x: i % 2 ? 4.6 : -4.6, z: 6 + i * 7, w: 1.6, h: 1.4 + (i % 3) * 0.6, crate: i % 2 === 0}));

/** 你的位置：每帧前进 0.11 米（示意 320 的跑速） */
export const youZ = (f: number) => f * 0.11;
/** 对手：从你身后追上来，一跳一跳越来越快；第 7 拍超过你 */
export const foeZ = (f: number) => {
  const t = f / PASS;
  return youZ(f) - 2.5 + 2.7 * t * t * (t > 1 ? 1 + (t - 1) * 1.6 : 1);
};
/** 对手离地高度：每个 HOP_BEATS 之间一个抛物线 */
export const foeLift = (f: number) => {
  const beats = HOP_BEATS.map((b) => fbt(b));
  for (let i = 0; i < beats.length - 1; i++) {
    if (f >= beats[i] && f < beats[i + 1]) {
      const p = (f - beats[i]) / (beats[i + 1] - beats[i]);
      return 1.1 * 4 * p * (1 - p);
    }
  }
  return 0;
};

/** 第一人称跑步：相机沿走廊前进，轻微上下颠；对手（红）从左后方追上、一跳一跳超过你 */
export const RunView: React.FC<{f: number; tone?: Tone; foe?: boolean; hop?: number}> = ({f, tone = 'blue', foe = true, hop = 0}) => {
  const z = youZ(f);
  const camY = 1.6 + Math.abs(Math.sin(f / 4)) * 0.04 + hop;
  const fz = foeZ(f);
  const dummies = foe && fz - z > 0.6 ? [{x: -1.4, z: fz, lift: foeLift(f)}] : [];
  return (
    <>
      <Range cam={{x: 0, z, y: camY, yaw: 0}} tone={tone} boxes={CORRIDOR} dummies={dummies} wallZ={110} />
      <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} />
      <ViewGun sway={Math.sin(f / 5) * 0.6} tone={tone} />
    </>
  );
};

/** 底部中间的小速度读数（HUD 风格） */
export const SpeedHud: React.FC<{v: number; color?: string; label?: string}> = ({v, color = T.cyan, label = '你的速度'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center'}}>
    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: T.gray}}>{label}</div>
    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 60, color, filter: glowF(color, 8)}}>{Math.round(v)}</div>
  </div>
);

/** 步骤顺序图（示意）：一列编号方块从上往下点亮，skip 的那一步被划掉 */
export const OrderFlow: React.FC<{f: number; steps: string[]; ats: number[]; skip?: number; skipAt?: number; note?: string}> = ({f, steps, ats, skip, skipAt, note}) => (
  <AbsoluteFill>
    {steps.map((s, i) => {
      const on = clamp01((f - ats[i]) / 8);
      const crossed = skip === i && skipAt !== undefined ? easeOut(clamp01((f - skipAt) / 10)) : 0;
      return (
        <div key={s} style={{position: 'absolute', left: 560, top: 230 + i * 150, width: 800, height: 110, opacity: 0.3 + 0.7 * on, border: `2px solid ${crossed > 0 ? T.red : T.cyan}`, background: 'rgba(10,19,34,0.75)', display: 'flex', alignItems: 'center', gap: 28, paddingLeft: 30}}>
          <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 44, color: crossed > 0 ? T.red : T.cyan}}>0{i + 1}</span>
          <span style={{position: 'relative', fontFamily: TF.sans, fontSize: 46, color: crossed > 0 ? T.gray : T.white}}>
            {s}
            <span style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${crossed * 100}%`, background: T.red, boxShadow: `0 0 10px ${T.red}`}} />
          </span>
          {crossed > 0.9 ? <span style={{marginLeft: 'auto', marginRight: 28, fontFamily: TF.sans, fontSize: 32, color: T.red}}>人已经在空中了</span> : null}
        </div>
      );
    })}
    {note ? <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>{note}</div> : null}
  </AbsoluteFill>
);

/** 每帧补一次（放大示意）：一串速度箭头从同一点出发，每一根比上一根转一点、长一点 */
export const FanSteps: React.FC<{f: number; at: number; n?: number; per?: number; x?: number; y?: number}> = ({f, at, n = 9, per = 6, x = 640, y = 640}) => {
  const shown = Math.floor(clamp01((f - at) / (n * per)) * n) + (f >= at ? 1 : 0);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: Math.min(n, shown)}, (_, k) => {
        const len = Math.sqrt(320 ** 2 + 260 ** 2 * k) * 1.25;
        const a = (Math.PI / 180) * (12 + k * 5);
        const last = k === Math.min(n, shown) - 1;
        return <VecArrow key={k} x={x} y={y} a={a} len={len} color={last ? T.cyan : 'rgba(66,198,223,0.35)'} width={last ? 6 : 3} head={last ? 18 : 10} />;
      })}
      <text x={x} y={y + 60} textAnchor="middle" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        每一根箭头 = 下一帧的速度（放大示意）
      </text>
    </svg>
  );
};

/** 每帧要转的角度：从一点画两条射线夹出一个楔形，标出度数 */
export const AngleWedge: React.FC<{f: number; at: number; deg: number; x: number; y: number; r?: number; label: string; color: string}> = ({f, at, deg, x, y, r = 380, label, color}) => {
  const g = easeOut(clamp01((f - at) / 18));
  const a = ((deg * Math.PI) / 180) * g;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <path d={`M${x} ${y} L${x + r} ${y} A${r} ${r} 0 0 0 ${x + Math.cos(a) * r} ${y - Math.sin(a) * r} Z`} fill={color} opacity={0.25} />
      <line x1={x} y1={y} x2={x + r} y2={y} stroke={color} strokeWidth={4} />
      <line x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y - Math.sin(a) * r} stroke={color} strokeWidth={4} style={{filter: glowF(color, 6)}} />
      <text x={x + r + 24} y={y - 10} fontFamily={TF.mono} fontWeight={700} fontSize={52} fill={color} style={{filter: glowF(color, 8)}}>
        {(deg * g).toFixed(1)}°
      </text>
      <text x={x} y={y + 50} fontFamily={TF.sans} fontSize={28} fill={T.text}>
        {label}
      </text>
    </svg>
  );
};

/** 俯视的连跳轨迹：一条左右摆动的 S 形曲线（progress 0–1 画出），沿途速度数字越来越大 */
export const BhopPath: React.FC<{progress: number; warm?: boolean; speeds?: number[]}> = ({progress, warm = false, speeds = [320, 380, 439, 520, 610]}) => {
  const N = 200;
  const pts = Array.from({length: N + 1}, (_, i) => {
    const t = i / N;
    return [260 + t * 1400, 560 - 150 * Math.sin(t * Math.PI * 5) * (0.6 + 0.4 * t)] as const;
  });
  const shown = Math.floor(clamp01(progress) * N);
  const c = warm ? T.orange : T.cyan;
  const head = pts[shown];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} fill="none" stroke={T.faint} strokeWidth={2} strokeDasharray="8 10" />
      <path d={pts.slice(0, shown + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} fill="none" stroke={c} strokeWidth={6} style={{filter: glowF(c, 8)}} />
      {speeds.map((v, i) => {
        const t = (i + 0.5) / speeds.length;
        if (progress < t) return null;
        const [x, y] = pts[Math.floor(t * N)];
        return (
          <text key={i} x={x} y={y - 40} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={36} fill={c} opacity={clamp01((progress - t) * 10)} style={{filter: glowF(c, 6)}}>
            {v}
          </text>
        );
      })}
      <circle cx={head[0]} cy={head[1]} r={14} fill="#fff" style={{filter: glowF(c, 12)}} />
      <text x={260} y={300} fontFamily={TF.mono} fontWeight={700} fontSize={22} letterSpacing={3} fill={T.gray}>
        俯视 · 左右交替侧移 + 转视角（示意）
      </text>
    </svg>
  );
};

/** 结尾：暖色第一人称，你自己连跳起来（相机一跳一跳、越跑越快） */
export const HopView: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = Math.max(0, f - at);
  const period = fbt(1) - fbt(0);
  const p = (t % period) / period;
  const hop = 0.9 * 4 * p * (1 - p);
  const z = t * (0.12 + t * 0.0009);
  return (
    <>
      <Range cam={{x: 0, z, y: 1.6 + hop, yaw: Math.sin(t / 14) * 0.12}} tone="warm" boxes={CORRIDOR} wallZ={110} />
      <Crosshair color="#ffd9a8" />
      <ViewGun sway={Math.sin(t / 7) * 0.8} tone="warm" />
    </>
  );
};

/** 速度从 a 平滑涨到 b（从 at 起 dur 帧） */
export const ramp = (f: number, at: number, dur: number, a: number, b: number) => a + (b - a) * easeInOut(clamp01((f - at) / dur));
