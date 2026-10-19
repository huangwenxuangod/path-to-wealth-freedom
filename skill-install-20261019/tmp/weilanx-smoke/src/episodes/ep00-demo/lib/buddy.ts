import {easeInOut, easeOut, keyframes, lerp, prog} from '../../../library/anim';
import {FPS, GEO, T} from './timeline';

import type {Eyes} from '../../../library/character/types';

export type {Eyes};

export interface BuddyPose {
  x: number; // 身体中心
  y: number; // 脚底基线
  rot: number;
  walk: number; // 走路相位，0 表示站立
  lookX: number; // -1..1 眼睛朝向
  eyes: Eyes;
  arm: null | {tx: number; ty: number; ext: number};
  scissors: number; // 0 隐藏，>0 显示；snipT 控制开合
  snipT: number;
  bubble: string | null;
  bubbleT: number;
  squash: number; // >0 压扁，<0 拉长
  armsUp: number; // 欢呼时两侧小方块抬起
  opacity: number;
}

const s = (sec: number) => Math.round(sec * FPS);
const G = GEO.groundY;

const X_KEYS: [number, number][] = [
  [0, -160],
  [s(1.1), 200],
  [T.dragCoffee, 200],
  [T.dropCoffee, 330],
  [s(3.8), 330],
  [s(4.4), 585],
  [s(7.9), 585],
  [s(8.6), 330],
  [T.grabSpin + 6, 330],
  [T.dropSpin, 470],
  [T.trip, 470],
  [T.getUp, 640],
  [s(11.5), 640],
  [s(12.2), 960],
  [T.panRight, 960],
  [s(15.8), 1250],
  [T.playback, 1250],
  [s(19.4), 240],
  [T.reachExport, 1180],
  [T.outro, 1180],
];

const xAt = (f: number) => keyframes(f, X_KEYS, easeInOut);

/** 小跳：返回向上偏移（正数） */
const hop = (f: number, start: number, dur: number, h: number) => {
  const p = prog(f, start, dur);
  return p > 0 && p < 1 ? Math.sin(p * Math.PI) * h : 0;
};

const SLIDER = (v: number, y: number): [number, number] => [GEO.sliderX0 + v * GEO.sliderW, y];

/** 手臂分段：[开始, 结束, 目标点函数] */
type ArmSeg = [number, number, (f: number) => [number, number]];
const ARM: ArmSeg[] = [
  [s(8.6), T.grabSpin + 4, () => [330, 232]],
  [T.reachSparkle, T.reachShake, (f) => SLIDER(keyframes(f, [[T.reachSparkle + 10, 0], [T.reachSparkle + 26, 0.7]]), GEO.sliderY.sparkle)],
  [T.reachShake, T.shakeBack + 12, (f) => SLIDER(keyframes(f, [[T.reachShake + 6, 0], [T.shakeMax, 1], [T.shakeBack, 1], [T.shakeBack + 6, 0.05]], easeOut), GEO.sliderY.shake)],
  [T.reachZoom, T.reachExport, (f) => SLIDER(keyframes(f, [[T.reachZoom + 6, 0], [T.reachZoom + 18, 0.6]]), GEO.sliderY.zoom)],
  [T.reachExport, T.exportClick + 10, () => [GEO.exportBtn.x + GEO.exportBtn.w / 2, GEO.exportBtn.y + GEO.exportBtn.h / 2]],
];

const armAt = (f: number): BuddyPose['arm'] => {
  for (let i = 0; i < ARM.length; i++) {
    const [a, b, target] = ARM[i];
    if (f < a || f >= b) continue;
    const chainedIn = i > 0 && ARM[i - 1][1] === a;
    const chainedOut = i < ARM.length - 1 && ARM[i + 1][0] === b;
    const ext = Math.min(chainedIn ? 1 : prog(f, a, 6, easeOut), chainedOut ? 1 : 1 - prog(f, b - 6, 6));
    const [tx, ty] = target(f);
    // 从上一段目标滑到这一段目标
    if (chainedIn) {
      const [px, py] = ARM[i - 1][2](a - 1);
      const k = prog(f, a, 6, easeInOut);
      return {tx: lerp(px, tx, k), ty: lerp(py, ty, k), ext};
    }
    return {tx, ty, ext};
  }
  return null;
};

const eyesAt = (f: number): Eyes => {
  if (f >= T.exportDone) return 'happy';
  if (f >= T.shakeBack && f < T.shakeBack + 30) return 'flat';
  if (f >= T.shakeMax && f < T.shakeBack) return 'wide';
  if (f >= s(13.4) && f < T.panRight) return 'happy';
  if (f >= T.trip && f < T.getUp + 6) return f < T.trip + 8 ? 'wide' : 'closed';
  if (f >= s(6.2) && f < s(7.8)) return 'happy';
  if (f >= T.snip && f < T.snip + 8) return 'closed';
  if (f >= T.scissorsUp && f < T.snip) return 'flat';
  // 自然眨眼
  const cyc = f % 71;
  return cyc < 3 && f > 20 ? 'closed' : 'open';
};

export function getBuddy(f: number): BuddyPose {
  const x = xAt(f);
  const vx = xAt(f + 1) - xAt(f - 1);
  const moving = Math.abs(vx) > 0.6;

  // 摔一跤：往前翻一圈并跳起
  let rot = 0;
  let lift = 0;
  if (f >= T.trip && f < T.getUp) {
    const p = prog(f, T.trip, T.getUp - T.trip, easeInOut);
    rot = p * 360;
    lift = Math.sin(p * Math.PI) * 120;
  }
  lift += hop(f, T.exportDone, 12, 60) + hop(f, T.exportDone + 12, 10, 30);
  lift += hop(f, T.dropSpin - 4, 8, 24);

  // 落地压扁
  const land = (at: number) => Math.sin(prog(f, at, 8) * Math.PI) * 0.18;
  const squash = land(T.getUp) + land(T.exportDone + 12) + land(T.exportDone + 22) + land(s(1.1));

  const bubbles: [number, number, string][] = [
    [T.muchCleaner, s(7.8), 'much cleaner.'],
    [T.nobodySaw, s(19.0), '…nobody saw that.'],
  ];
  const bub = bubbles.find(([a, b]) => f >= a && f < b);

  const arm = armAt(f);
  return {
    x,
    y: G - lift,
    rot,
    walk: moving ? f * 0.55 : 0,
    lookX: arm ? 0.6 : moving ? Math.sign(vx) : 0,
    eyes: eyesAt(f),
    arm,
    scissors: f >= T.scissorsUp - 4 && f < T.snip + 18 ? prog(f, T.scissorsUp - 4, 6, easeOut) * (1 - prog(f, T.snip + 12, 6)) : 0,
    snipT: f - T.snip,
    bubble: bub ? bub[2] : null,
    bubbleT: bub ? f - bub[0] : 0,
    squash,
    armsUp: f >= T.exportDone ? prog(f, T.exportDone, 6, easeOut) : 0,
    opacity: 1 - prog(f, T.outro, 12),
  };
}
