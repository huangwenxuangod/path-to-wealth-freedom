import {boil, easeInOut, keyframes, prog} from '../../../library/anim';
import {FPS, T} from './timeline';

export interface Cam {
  x: number; // 画面中心对准的世界坐标
  y: number;
  scale: number;
  rot: number;
}

const s = (sec: number) => Math.round(sec * FPS);

// [秒, cx, cy, scale]
const KEYS: [number, number, number, number][] = [
  [0, 960, 540, 1],
  [2.0, 960, 540, 1],
  [3.3, 900, 660, 1.25],
  [3.7, 900, 660, 1.25],
  [4.3, 760, 640, 1.6],
  [7.6, 760, 640, 1.6],
  [8.5, 560, 560, 1.5],
  [11.3, 560, 560, 1.5],
  [12.1, 1060, 560, 1.5],
  [15.1, 1060, 560, 1.5],
  [15.9, 1240, 520, 1.5],
  [18.7, 1240, 520, 1.5],
  [19.5, 700, 660, 1.35],
  [21.3, 1100, 640, 1.35],
  [22.2, 990, 548, 1.04],
  [23.6, 960, 540, 1.0],
];

const track = (i: 1 | 2 | 3) => KEYS.map((k) => [s(k[0]), k[i]] as [number, number]);
const XS = track(1);
const YS = track(2);
const SS = track(3);

export function getCamera(frame: number): Cam {
  let x = keyframes(frame, XS, easeInOut);
  let y = keyframes(frame, YS, easeInOut);
  let rot = 0;
  // SNIP 时一次短促震屏
  const snipK = 1 - prog(frame, T.snip, 8);
  if (frame >= T.snip && snipK > 0) {
    x += boil(frame * 4, 1, 10 * snipK);
    y += boil(frame * 4, 2, 8 * snipK);
  }
  // SHAKE: MAX 时整个镜头也跟着抖
  if (frame >= T.shakeMax && frame < T.shakeBack) {
    x += boil(frame * 3, 3, 5);
    y += boil(frame * 3, 4, 5);
    rot = boil(frame * 3, 5, 0.6);
  }
  return {x, y, scale: keyframes(frame, SS, easeInOut), rot};
}
