import React from 'react';
import {clamp01, easeInOut, rand} from '../anim';
import {SpotlightG} from './props';
import {B, BF} from './theme';

/**
 * 黑金光影风的「动物实验场」：会呼吸、眨眼、流汗、打呼的发光猪，带拉杆—管子—食槽的猪圈，聚光灯里的浮尘，冲击波。
 * 第一次用于 ep36 智猪博弈；任何「一边出力、一边坐享」的模型（搭便车、公共品、团队分工）都能直接借这套舞台。
 * 坐标是 1920×1080 舞台坐标，所有动画由帧号算出。
 */

export type PigTone = 'lit' | 'dim' | 'cyan' | 'red';
export type PigPose = 'stand' | 'run' | 'lie';

/** 最近一次事件过去了多少帧（没有就是 Infinity） */
export const since = (f: number, at: number[]) => {
  let best = Infinity;
  for (const a of at) if (f >= a && f - a < best) best = f - a;
  return best;
};

/**
 * 按关键帧走的角色：keys [帧, x]，两帧之间 x 变了就是在跑（moving，朝向跟着走的方向）；停下时朝向 rest(x)。
 * speed 0–1 是当前速度（给拖尾、尘土用）。
 */
export const track = (f: number, keys: [number, number][], rest: (x: number) => 1 | -1): {x: number; dir: 1 | -1; moving: boolean; speed: number} => {
  if (f <= keys[0][0]) return {x: keys[0][1], dir: rest(keys[0][1]), moving: false, speed: 0};
  for (let i = 1; i < keys.length; i++) {
    const [f0, x0] = keys[i - 1];
    const [f1, x1] = keys[i];
    if (f < f1) {
      if (x0 === x1) return {x: x0, dir: rest(x0), moving: false, speed: 0};
      const u = clamp01((f - f0) / (f1 - f0));
      const t = easeInOut(u);
      // easeInOut 的导数在中段最大，归一到 0–1
      const speed = Math.min(1, (Math.abs(x1 - x0) / (f1 - f0) / 40) * (1 - Math.abs(2 * u - 1)) * 1.6);
      return {x: x0 + (x1 - x0) * t, dir: x1 > x0 ? 1 : -1, moving: true, speed};
    }
  }
  const x = keys[keys.length - 1][1];
  return {x, dir: rest(x), moving: false, speed: 0};
};

const PIG_COLOR: Record<PigTone, string> = {lit: '#fff1c4', dim: '#9c8a74', cyan: B.cyan, red: B.red};

/**
 * 发光的猪（SVG <g>，脚底中心在原点，默认面朝右，dir -1 面朝左）。
 * pose 'stand' 站（会呼吸）/ 'run' 跑（四腿交替、身子前倾、身后速度线和尘土）/ 'lie' 趴下（腿收起、闭眼）；
 * t 帧号（呼吸、眨眼、跑步相位都用它）；eat 0–1 低头吃（嘴边飞碎屑）；sweat 0–1 头上甩汗；zzz 0–1 头顶飘「Z」；
 * speed 0–1 跑速（拖尾长短）；seed 让两只猪眨眼不同步。
 */
export const GlowPigG: React.FC<{
  tone?: PigTone;
  size?: number;
  dir?: 1 | -1;
  pose?: PigPose;
  t?: number;
  /** 旧名：跑步相位，等同 t */
  step?: number;
  eat?: number;
  sweat?: number;
  zzz?: number;
  speed?: number;
  seed?: number;
}> = ({tone = 'lit', size = 150, dir = 1, pose = 'stand', t: t0, step, eat = 0, sweat = 0, zzz = 0, speed, seed = 1}) => {
  const t = t0 ?? step ?? 0;
  const c = PIG_COLOR[tone];
  const dark = 'rgba(20,12,6,0.85)';
  const glow = tone === 'dim' ? undefined : `drop-shadow(0 0 ${size * 0.1}px ${c})`;
  const s = size / 150;
  const lie = pose === 'lie';
  const run = pose === 'run';
  const sp = run ? speed ?? 1 : 0;
  const by = lie ? 34 : 0;
  const breath = lie ? Math.sin(t / 22 + seed) * 3 : run ? 0 : Math.sin(t / 16 + seed) * 1.6;
  const bob = run ? -Math.abs(Math.sin(t * 0.45)) * 8 : 0;
  const sw = run ? Math.sin(t * 0.9) * 16 : 0;
  const head = eat * 16 + (eat > 0 ? Math.sin(t / 2.2) * 3 * eat : 0);
  // 眨眼：每 ~70 帧眨一次，持续 4 帧
  const blink = !lie && (t + Math.floor(rand(seed) * 70)) % 70 < 4;
  const legs: [number, number][] = [
    [-52, sw],
    [-30, -sw],
    [34, -sw],
    [56, sw],
  ];
  return (
    <g>
      {/* 身后：速度线 + 尘土（不翻转坐标，按 dir 放在身后） */}
      {sp > 0.05 && (
        <g opacity={sp}>
          {[0, 1, 2].map((i) => (
            <line key={i} x1={-dir * (110 + i * 10) * s} y1={(-60 - i * 34) * s} x2={-dir * (110 + i * 10 + 120 * sp + rand(seed + i + Math.floor(t / 3)) * 40) * s} y2={(-60 - i * 34) * s} stroke={c} strokeWidth={3 * s} strokeLinecap="round" opacity={0.55 - i * 0.12} />
          ))}
          {Array.from({length: 5}, (_, i) => {
            const k = (t * 0.6 + i * 9) % 45;
            return <circle key={`d${i}`} cx={-dir * (60 + k * 3) * s} cy={(-6 - k * 0.5) * s} r={(6 + k * 0.5) * s} fill="rgba(229,201,145,0.18)" opacity={1 - k / 45} />;
          })}
        </g>
      )}
      <g transform={`scale(${s * dir} ${s}) translate(0 ${bob}) rotate(${run ? 4 : 0})`} style={{filter: glow}}>
        {!lie && legs.map(([x, d], i) => <line key={i} x1={x} y1={-40} x2={x + d} y2={-2} stroke={c} strokeWidth={14} strokeLinecap="round" />)}
        <path d={`M-92 ${-82 + by} q-26 -6 -18 -22 q8 -12 16 2`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" transform={run ? `rotate(${Math.sin(t * 0.9) * 14} -92 ${-82 + by})` : undefined} />
        <ellipse cx={0} cy={-78 + by - breath / 2} rx={92 + breath * 0.6} ry={(lie ? 46 : 52) + breath} fill={c} />
        <g transform={`translate(0 ${by + head}) rotate(${eat * 14} 80 -96)`}>
          <circle cx={82} cy={-100} r={42} fill={c} />
          <path d={`M58 -132 L${66 + (run ? Math.sin(t * 0.9) * 4 : 0)} -164 L86 -136 Z`} fill={c} />
          <ellipse cx={124} cy={-92} rx={13} ry={18} fill={c} stroke={dark} strokeWidth={3} />
          <circle cx={121} cy={-98} r={2.6} fill={dark} />
          <circle cx={121} cy={-86} r={2.6} fill={dark} />
          {lie || blink ? <path d="M90 -110 q8 5 16 0" stroke={dark} strokeWidth={3.5} fill="none" strokeLinecap="round" /> : <circle cx={98} cy={-112} r={5} fill={dark} />}
        </g>
      </g>
      {/* 嘴边碎屑 */}
      {eat > 0.1 &&
        Array.from({length: 5}, (_, i) => {
          const k = (t * 0.8 + i * 7) % 20;
          return <circle key={`c${i}`} cx={dir * (130 + k * 2.2 + rand(seed + i) * 16) * s} cy={(-70 + by - 18 * Math.sin((k / 20) * Math.PI)) * s} r={3 * s} fill={B.gold} opacity={eat * (1 - k / 20)} />;
        })}
      {/* 甩汗 */}
      {sweat > 0.05 &&
        Array.from({length: 3}, (_, i) => {
          const k = (t * 0.7 + i * 8) % 24;
          const x = -dir * (20 + k * 3.2) * s + dir * 80 * s;
          const y = (-150 - 26 * Math.sin((k / 24) * Math.PI) + k * 1.2) * s;
          return <path key={`s${i}`} d={`M${x} ${y - 10 * s} q${6 * s} ${10 * s} 0 ${14 * s} q${-6 * s} ${-4 * s} 0 ${-14 * s} Z`} fill="#bff3ec" opacity={sweat * (1 - k / 24)} style={{filter: 'drop-shadow(0 0 4px #bff3ec)'}} />;
        })}
      {/* 打呼的 Z */}
      {zzz > 0.05 &&
        [0, 1, 2].map((i) => {
          const k = ((t + i * 20) % 60) / 60;
          return (
            <text key={`z${i}`} x={dir * (70 + k * 60) * s} y={(-150 - k * 110) * s} fontFamily={BF.latinBold} fontSize={(24 + k * 26) * s} fill={c} opacity={zzz * Math.sin(k * Math.PI)} textAnchor="middle" style={{filter: `drop-shadow(0 0 6px ${c})`}}>
              Z
            </text>
          );
        })}
    </g>
  );
};

/** 冲击波（SVG <g>）：at 起一圈金环从 (x, y) 扩出去 + 8 颗火星飞散，约 18 帧 */
export const ShockG: React.FC<{f: number; at: number; x: number; y: number; r?: number; color?: string; seed?: number}> = ({f, at, x, y, r = 120, color = B.gold, seed = 1}) => {
  const t = f - at;
  if (t < 0 || t > 20) return null;
  const p = 1 - Math.pow(1 - t / 20, 3);
  return (
    <g style={{filter: `drop-shadow(0 0 8px ${color})`}}>
      <circle cx={x} cy={y} r={r * p} fill="none" stroke={color} strokeWidth={4 * (1 - p) + 0.5} opacity={1 - p} />
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + rand(seed + i) * 0.5;
        const d = r * (0.3 + 0.9 * p) * (0.7 + rand(seed + i + 9) * 0.5);
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d + p * p * 30} r={3 * (1 - p) + 0.5} fill="#fff4d0" opacity={1 - p} />;
      })}
    </g>
  );
};

/** 聚光灯光锥里的浮尘（SVG <g>）：n 颗小光点在三角光锥 (灯头 x, y；底宽 w；高 h) 里缓慢上浮、闪烁 */
export const LightMotesG: React.FC<{f: number; x: number; y: number; w: number; h: number; n?: number; on?: number; seed?: number}> = ({f, x, y, w, h, n = 26, on = 1, seed = 1}) => (
  <g opacity={on}>
    {Array.from({length: n}, (_, i) => {
      const v = (rand(seed + i) + f / (900 + rand(seed + i + 3) * 600)) % 1; // 0 底 → 1 顶，慢慢往上
      const yy = y + h * (1 - v);
      const half = (w / 2) * (1 - v) * 0.9;
      const xx = x + (rand(seed + i + 7) * 2 - 1) * half + Math.sin(f / 50 + i) * 6;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (20 + i) + i));
      return <circle key={i} cx={xx} cy={yy} r={0.8 + rand(seed + i + 11) * 1.8} fill="#fff1c4" opacity={tw * (0.3 + 0.7 * v * (1 - v) * 4) * 0.8} />;
    })}
  </g>
);

export type PenPig = {x: number; dir: 1 | -1; pose: PigPose; eat?: number; tone?: PigTone; sweat?: number; zzz?: number; speed?: number};

/**
 * 猪圈：左边拉杆（按下时手柄压低、冲击波 + 火星），一根发光的管子从拉杆通到右边食槽，按下后一串金色食粒沿管子流过去、弹进槽里溅起火花；
 * 背后一道霓虹围栏，两盏聚光灯里飘着浮尘，猪在地上有倒影。
 * presses 按下帧、flows [按下帧, 落槽帧]、food 槽里的食 0–1；spot 两盏灯亮度 [拉杆, 食槽]，flicker 0–1 让灯接触不良地闪。
 */
export const PigPen: React.FC<{
  f: number;
  presses: number[];
  flows: [number, number][];
  big: PenPig;
  small: PenPig;
  food: number;
  leverX?: number;
  troughX?: number;
  floorY?: number;
  labels?: [string, string];
  bigLabel?: string;
  smallLabel?: string;
  labelOn?: number;
  spot?: [number, number];
  flicker?: number;
  bigSize?: number;
  smallSize?: number;
  reflect?: boolean;
}> = ({f, presses, flows, big, small, food, leverX = 330, troughX = 1590, floorY = 800, labels = ['拉杆', '食槽'], bigLabel, smallLabel, labelOn = 0, spot = [1, 1], flicker = 0, bigSize = 250, smallSize = 150, reflect = true}) => {
  const pipe: [number, number][] = [
    [leverX, floorY - 330],
    [leverX, 210],
    [troughX, 210],
    [troughX, floorY - 160],
  ];
  const segs = pipe.slice(1).map((p, i) => Math.hypot(p[0] - pipe[i][0], p[1] - pipe[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const pipeAt = (u: number): [number, number] => {
    let d = clamp01(u) * total;
    for (let i = 1; i < pipe.length; i++) {
      const l = segs[i - 1];
      if (d <= l) return [pipe[i - 1][0] + ((pipe[i][0] - pipe[i - 1][0]) * d) / l, pipe[i - 1][1] + ((pipe[i][1] - pipe[i - 1][1]) * d) / l];
      d -= l;
    }
    return pipe[pipe.length - 1];
  };
  const pr = since(f, presses);
  const press = pr < 14 ? (pr < 4 ? pr / 4 : 1 - (pr - 4) / 10) : 0;
  const drops = flows.map(([, d]) => d);
  const dr = since(f, drops);
  const flash = dr < 24 ? 1 - dr / 24 : 0;
  // 接触不良：确定性地随机暗一下
  const flick = flicker > 0 ? 1 - flicker * (rand(Math.floor(f / 3) * 13 + 7) > 0.6 ? 0.85 : rand(Math.floor(f / 2)) * 0.3) : 1;
  const on: [number, number] = [spot[0] * flick, spot[1] * flick];
  const tw = 300;
  const pig = (p: PenPig, sz: number, def: PigTone, seed: number) => (
    <GlowPigG tone={p.tone ?? def} size={sz} dir={p.dir} pose={p.pose} t={f} eat={p.eat ?? 0} sweat={p.sweat ?? 0} zzz={p.zzz ?? 0} speed={p.speed} seed={seed} />
  );
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id="pp-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(229,201,145,0.16)" />
          <stop offset="100%" stopColor="rgba(229,201,145,0)" />
        </linearGradient>
        <linearGradient id="pp-refl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="60%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="pp-refl-mask">
          <rect x={0} y={floorY} width={1920} height={200} fill="url(#pp-refl)" />
        </mask>
        <radialGradient id="pp-food" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff4d0" />
          <stop offset="100%" stopColor={B.gold} />
        </radialGradient>
      </defs>
      {/* 背后的围栏：两根横杆 + 一排立柱，很淡 */}
      <g stroke="rgba(229,201,145,0.14)" strokeWidth={3}>
        <line x1={40} y1={floorY - 170} x2={1880} y2={floorY - 170} />
        <line x1={40} y1={floorY - 90} x2={1880} y2={floorY - 90} />
        {Array.from({length: 13}, (_, i) => (
          <line key={i} x1={80 + i * 147} y1={floorY - 200} x2={80 + i * 147} y2={floorY} />
        ))}
      </g>
      <rect x={0} y={floorY} width={1920} height={200} fill="url(#pp-floor)" />
      <line x1={60} y1={floorY} x2={1860} y2={floorY} stroke={B.goldLine} strokeWidth={2} style={{filter: `drop-shadow(0 0 6px ${B.gold})`}} />
      {/* 两盏灯 + 光里的浮尘 */}
      <SpotlightG x={leverX + 70} y={70} w={520} h={floorY - 70} on={on[0] * (0.7 + 0.3 * press)} id="pp-l" />
      <SpotlightG x={troughX - 70} y={70} w={620} h={floorY - 70} on={on[1] * (0.75 + 0.25 * flash)} id="pp-t" />
      <LightMotesG f={f} x={leverX + 70} y={70} w={520} h={floorY - 70} on={on[0]} seed={11} />
      <LightMotesG f={f} x={troughX - 70} y={70} w={620} h={floorY - 70} on={on[1]} seed={37} />
      {/* 管子 + 流动的食粒 */}
      <polyline points={pipe.map((p) => p.join(',')).join(' ')} fill="none" stroke="rgba(229,201,145,0.22)" strokeWidth={16} strokeLinejoin="round" />
      <polyline points={pipe.map((p) => p.join(',')).join(' ')} fill="none" stroke={B.goldLine} strokeWidth={2} strokeLinejoin="round" />
      {flows.map(([p, d], k) => {
        if (f < p || f > d) return null;
        const u0 = (f - p) / Math.max(1, d - p);
        return Array.from({length: 7}, (_, i) => {
          const u = u0 - i * 0.035;
          if (u < 0 || u > 1) return null;
          const [x, y] = pipeAt(u);
          return <circle key={`${k}-${i}`} cx={x} cy={y} r={7 - i * 0.6} fill="#ffe9b0" style={{filter: `drop-shadow(0 0 8px ${B.gold})`}} />;
        });
      })}
      {/* 落槽：食粒弹起来 */}
      {drops.map((d, k) => {
        const t = f - d;
        if (t < 0 || t > 22) return null;
        return Array.from({length: 9}, (_, i) => {
          const vx = (rand(k * 31 + i) - 0.5) * 9;
          const vy = -6 - rand(k * 17 + i) * 8;
          return <circle key={`b${k}-${i}`} cx={troughX + vx * t} cy={floorY - 110 + vy * t + 0.6 * t * t} r={4} fill="#ffe9b0" opacity={1 - t / 22} />;
        });
      })}
      {/* 拉杆 */}
      <rect x={leverX - 10} y={floorY - 330} width={20} height={330} fill="rgba(229,201,145,0.25)" />
      <rect x={leverX - 46} y={floorY - 360} width={92} height={70} rx={8} fill="rgba(10,7,5,0.8)" stroke={B.gold} strokeWidth={3} opacity={0.55 + 0.45 * press} style={{filter: `drop-shadow(0 0 ${8 + 14 * press}px ${B.gold})`}} />
      <g transform={`rotate(${-35 + 55 * press} ${leverX + 40} ${floorY - 325})`}>
        <line x1={leverX + 40} y1={floorY - 325} x2={leverX + 150} y2={floorY - 325} stroke={B.gold} strokeWidth={9} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${B.gold})`}} />
        <circle cx={leverX + 156} cy={floorY - 325} r={15} fill="#fff1c4" style={{filter: `drop-shadow(0 0 10px ${B.gold})`}} />
      </g>
      {presses.map((p, i) => (
        <ShockG key={`sh${i}`} f={f} at={p} x={leverX} y={floorY - 325} r={150} seed={i * 5 + 1} />
      ))}
      {/* 食槽 */}
      <ellipse cx={troughX} cy={floorY - 92} rx={tw / 2 - 30} ry={24 * clamp01(food) + 0.01} fill="url(#pp-food)" opacity={clamp01(food * 3)} style={{filter: `drop-shadow(0 0 ${12 + 26 * flash}px ${B.gold})`}} />
      {food > 0.05 &&
        Array.from({length: 14}, (_, i) => <circle key={i} cx={troughX - 100 + rand(i + 3) * 200} cy={floorY - 96 - rand(i + 7) * 18 * food} r={5 + rand(i) * 4} fill="#ffe9b0" opacity={0.9 * clamp01(food * 2)} />)}
      <path d={`M${troughX - tw / 2} ${floorY - 100} L${troughX + tw / 2} ${floorY - 100} L${troughX + tw / 2 - 30} ${floorY} L${troughX - tw / 2 + 30} ${floorY} Z`} fill="rgba(12,8,5,0.9)" stroke={B.gold} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${8 + 20 * flash}px ${B.gold})`}} />
      {/* 地上的倒影 */}
      {reflect && (
        <g mask="url(#pp-refl-mask)" opacity={0.5}>
          <g transform={`translate(0 ${2 * floorY}) scale(1 -1)`}>
            <g transform={`translate(${big.x} ${floorY})`}>{pig({...big, sweat: 0, zzz: 0, speed: 0}, bigSize, 'lit', 3)}</g>
            <g transform={`translate(${small.x} ${floorY})`}>{pig({...small, sweat: 0, zzz: 0, eat: 0}, smallSize, 'cyan', 8)}</g>
          </g>
        </g>
      )}
      {/* 猪：大猪先画在后面，小猪挨着槽画在前面 */}
      <g transform={`translate(${big.x} ${floorY})`}>{pig(big, bigSize, 'lit', 3)}</g>
      <g transform={`translate(${small.x} ${floorY})`}>{pig(small, smallSize, 'cyan', 8)}</g>
      {/* 标签 */}
      {[leverX, troughX].map((x, i) => (
        <text key={`lb${i}`} x={x} y={floorY + 60} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.goldWarm} opacity={0.85}>
          {labels[i]}
        </text>
      ))}
      {bigLabel && (
        <text x={big.x} y={floorY - bigSize * 1.12 - 24} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={34} fill="#fff1c4" opacity={labelOn} style={{filter: 'drop-shadow(0 0 8px rgba(255,241,196,0.8))'}}>
          {bigLabel}
        </text>
      )}
      {smallLabel && (
        <text x={small.x} y={floorY - smallSize * 1.12 - 24} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={34} fill={B.cyan} opacity={labelOn} style={{filter: `drop-shadow(0 0 8px ${B.cyan})`}}>
          {smallLabel}
        </text>
      )}
    </svg>
  );
};
