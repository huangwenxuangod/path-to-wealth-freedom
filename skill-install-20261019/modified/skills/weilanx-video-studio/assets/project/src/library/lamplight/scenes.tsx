import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, rand } from "../anim";
import { ReliefMap, routeAt } from "./charts";
import { NightBg } from "./stage";
import { L } from "./theme";

/**
 * 灯火史话风的镜头件（ep28 起，各期通用）：夜路（路边里程桩往后流）、地图镜头（左上叙述区压暗）、
 * 沿路线流动的光点、收暗曲线，以及按 CUES 取当前一屏叙述、小节冲击这两个时间表工具。
 */

/** 夜路：星空 + 地面网格 + 一排往左流的里程桩和地面短线；off 是已经跑过的距离（像素），停下就传固定值 */
export const NightRoad: React.FC<{
  f: number;
  off: number;
  glow?: [number, number];
}> = ({ f, off, glow = [46, 78] }) => (
  <AbsoluteFill>
    <NightBg f={f} floor glow={glow} horizon={600} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const x = ((((i * 420 - off) % 2940) + 2940) % 2940) - 300;
        return (
          <g key={i} transform={`translate(${x} 860)`} opacity={0.55}>
            <rect
              x={-10}
              y={-120}
              width={20}
              height={120}
              rx={3}
              fill="#4a3c2e"
            />
            <rect
              x={-26}
              y={-150}
              width={52}
              height={36}
              rx={4}
              fill="#5c4b39"
            />
          </g>
        );
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const x = ((((i * 160 - off * 1.4) % 2240) + 2240) % 2240) - 160;
        return (
          <rect
            key={`d${i}`}
            x={x}
            y={968}
            width={70}
            height={5}
            rx={2}
            fill="rgba(239,230,214,0.18)"
          />
        );
      })}
      <line
        x1={0}
        x2={1920}
        y1={905}
        y2={905}
        stroke="rgba(239,230,214,0.12)"
        strokeWidth={2}
      />
    </svg>
  </AbsoluteFill>
);

/** 地图镜头：程序地形 + 几条淡金色「界线」+ 左上叙述区压暗，cam = [地图 x, 地图 y, 缩放]，children 用地图坐标 */
export const MapView: React.FC<{
  cam: [number, number, number];
  children?: React.ReactNode;
}> = ({ cam, children }) => (
  <>
    <ReliefMap
      seed={11}
      camX={cam[0]}
      camY={cam[1]}
      camS={cam[2]}
      borders={[
        "M200 420 C640 300 1100 470 1500 360 S2200 330 2450 520",
        "M380 1260 C900 1180 1400 1320 1900 1220 S2350 1180 2500 1320",
        "M2050 200 C1960 600 2180 900 2100 1450",
      ]}
    >
      {children}
    </ReliefMap>
    <MapShade />
  </>
);

/** 地图上的叙述底：左上角一块渐暗，让宋体大字压得住满地光点 */
export const MapShade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 60% 45% at 18% 12%, rgba(8,6,4,0.78) 0%, rgba(8,6,4,0.45) 50%, rgba(0,0,0,0) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** 沿路线往前流的光点（「一起在跑」）：n 个小光点按帧沿 pts 匀速前进，speed 每帧走的进度 */
export const FlowDots: React.FC<{
  f: number;
  pts: [number, number][];
  n?: number;
  speed?: number;
  on?: number;
  seed?: number;
}> = ({ f, pts, n = 8, speed = 0.004, on = 1, seed = 1 }) => (
  <svg
    width={2600}
    height={1600}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
      opacity: on,
    }}
  >
    {Array.from({ length: n }, (_, k) => {
      const p = (f * speed + k / n + rand(seed + k) * 0.05) % 1;
      const [x, y] = routeAt(pts, p);
      return (
        <circle
          key={k}
          cx={x}
          cy={y}
          r={7}
          fill="#fff1c8"
          style={{ filter: `drop-shadow(0 0 10px ${L.gold})` }}
        />
      );
    })}
  </svg>
);

/** 收暗：from 起压到 94% 黑，最后 FREEZE 帧之前到底 */
export const darkness = (f: number, from: number, hit: number, freeze = 3) =>
  f >= hit || f < from
    ? 0
    : Math.pow(clamp01((f - from) / (hit - freeze - from)), 0.7) * 0.94;

/** 叙述条目：[拍号, 文字 | null, 是否另起一屏] */
export type Cue = [number, string | null, boolean?];

/** 当前这一屏叙述：从最近一个「另起一屏」的句子开始，到下一屏（或大字卡 null）之前；fbt 把拍号换成帧 */
export const panelAt = (cues: Cue[], fbt: (b: number) => number, f: number) => {
  let cur = -1;
  cues.forEach(([b], i) => {
    if (fbt(b) <= f + 2) cur = i;
  });
  if (cur < 0 || cues[cur][1] === null) return null;
  let s = cur;
  while (s > 0 && !cues[s][2]) s--;
  let e = cur + 1;
  while (e < cues.length && !cues[e][2] && cues[e][1] !== null) e++;
  return cues.slice(s, e).map(([b, text]) => ({ b, text: text as string }));
};

/**
 * 小节冲击：每小节第一拍画面放大 1.2%、7 帧回落；两个爆点 4%、10 帧；第 40–47 小节（we-never 回落段）减半；第一个爆点之前不顶。
 * bar0 是第 0 拍的秒数，fb(k) 是第 k 小节的帧。
 */
export const barPunch = (
  f: number,
  o: {
    hit: number;
    hit2: number;
    bar: number;
    bar0: number;
    fps: number;
    fb: (k: number) => number;
  },
) => {
  if (f < o.hit) return 0;
  if (f < o.hit + 10) return 0.04 * (1 - (f - o.hit) / 10);
  if (f >= o.hit2 && f < o.hit2 + 10) return 0.04 * (1 - (f - o.hit2) / 10);
  const k = Math.floor((f / o.fps - o.bar0) / o.bar);
  const t = f - o.fb(k);
  const amp = k >= 40 && k < 48 ? 0.006 : 0.012;
  return t >= 0 && t < 7 ? amp * (1 - t / 7) : 0;
};
