import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Cam, Tone} from '../../library/tactical/range';
import {azPos, earPos, HeadTop, HearCanvas, PinnaSpectrum, SoundSource} from '../../library/tactical/hearing';
import {Bubble} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {ENEMY_AZ_DEG, fbt, MIRROR_AZ_DEG, STEPS, TURN_FROM, TURN_TO} from './timeline';

/**
 * ep29 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 * 俯视图里「前」朝上；方位角顺时针从正前方量（右前方 60°，镜像点右后方 120°）。
 */

const RAD = Math.PI / 180;
const AZ_E = ENEMY_AZ_DEG * RAD;
const AZ_M = MIRROR_AZ_DEG * RAD;

/* ---------------- 射击场：你在原点，他躲在右前方的箱子后面 ---------------- */

/** 他在右前方 60°、6 米处；一只高箱子挡在你们中间，开场你只听得到看不到 */
const ENEMY_HIDE = {x: 6 * Math.sin(AZ_E), z: 6 * Math.cos(AZ_E)};
/** 他从箱子后面走出来的位置（回放和结尾用） */
export const ENEMY_OUT = {x: 3.3, z: 4.8};
const HIDE_BOX: Box = {x: 4.3, z: 2.55, w: 1.5, h: 2.3, d: 1.5, crate: true};
const BOXES: Box[] = [
  HIDE_BOX,
  {x: -3.2, z: 8, w: 1.6, h: 1.6, crate: true},
  {x: 1.2, z: 13, w: 2.4, h: 1.2},
  {x: 4.6, z: -5.5, w: 1.4, h: 1.4, crate: true},
  {x: -2.6, z: -7, w: 2.2, h: 1.2},
  {x: 1.4, z: -10.5, w: 1.2, h: 2.2},
];
const YAW0 = -0.15;
/** 开场转身：第 4 拍到第 6 拍，从略偏左转到右后方 120° */
export const YAW_BACK = AZ_M;
export const hookYaw = (f: number) => YAW0 + (YAW_BACK - YAW0) * easeInOut(clamp01((f - TURN_FROM) / (TURN_TO - TURN_FROM)));

/** 你的屏幕：第一人称，相机就是你；enemy 给了就把他放在那（不给就躲在箱子后面） */
export const YouView: React.FC<{f: number; yaw: number; tone?: Tone; gun?: boolean; enemy?: {x: number; z: number; state?: 'idle' | 'hit' | 'dead'}}> = ({f, yaw, tone = 'blue', gun = true, enemy}) => (
  <>
    <Range cam={{x: 0, z: 0, yaw}} tone={tone} boxes={BOXES} dummies={[enemy ?? ENEMY_HIDE]} wallZ={18} backWallZ={-14} />
    <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} />
    {gun && <ViewGun sway={Math.sin(f / 18)} tone={tone} />}
  </>
);

/** 右侧的声音指示：每声脚步在屏幕右边缘亮一下弧光（只表示「右边有声音」，不分前后） */
export const StepPulse: React.FC<{f: number; beats: number[]; side?: 'R' | 'L'}> = ({f, beats, side = 'R'}) => {
  const a = beats.reduce((m, b) => Math.max(m, 1 - clamp01((f - fbt(b)) / 14) - (f < fbt(b) ? 1 : 0)), 0);
  if (a <= 0) return null;
  const x = side === 'R' ? 1920 : 0;
  return <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 45% at ${x}px 50%, rgba(240,160,69,${0.5 * a}), rgba(240,160,69,0) 100%)`, pointerEvents: 'none'}} />;
};

/** 开场镜头：右边脚步声 → 你判断在右后方 → 转身 */
export const HookView: React.FC<{f: number}> = ({f}) => (
  <>
    <YouView f={f} yaw={hookYaw(f)} />
    <StepPulse f={f} beats={STEPS} />
    <Bubble f={f} at={fbt(2)} out={TURN_FROM + 6} text="脚步……在右后方？" x={1180} y={300} color={T.orange} />
  </>
);

/** 他的屏幕：从他走出来的位置看向你；你（青色）正背对他看着右后方 */
export const EnemyView: React.FC<{f: number; shot: number}> = ({f, shot}) => {
  const cam: Cam = {x: ENEMY_OUT.x, z: ENEMY_OUT.z, yaw: Math.atan2(0 - ENEMY_OUT.x, 0 - ENEMY_OUT.z)};
  const t = f - shot;
  const head = project([0, 1.75, 0], cam) ?? [960, 470];
  const you = project([0, 2.4, 0], cam) ?? [960, 300];
  return (
    <>
      <Range cam={cam} tone="red" boxes={BOXES} dummies={[{x: 0, z: 0, color: T.cyan, state: t >= 0 && t < 4 ? 'hit' : 'idle'}]} wallZ={18} backWallZ={-14} />
      <Crosshair x={head[0]} y={head[1]} color={T.red} />
      <Tracer from={[1500, 820]} to={head} t={t} />
      <HitMark f={f} at={shot + 1} x={head[0]} y={head[1]} color={T.red} />
      <Bubble f={f} at={shot + 10} text="你 · 正盯着右后方" x={you[0] - 150} y={you[1] - 90} color={T.cyan} size={30} />
    </>
  );
};

/* ---------------- 俯视：真的在右前，你以为在右后 ---------------- */

/** 镜像俯视图：头在中间，两耳连线画成一条「镜面」；real 红点在右前方，ghost 橙色虚线在右后方 */
export const MirrorMap: React.FC<{f: number; at: number; yaw?: number; youTurn?: number; dist?: boolean; glowAxis?: number; ghostLabel?: string; realLabel?: string; ghostFade?: number; warm?: boolean}> = ({
  f,
  at,
  yaw = 0,
  youTurn,
  dist = false,
  glowAxis = 0,
  ghostLabel = '你以为在这',
  realLabel = '他真正在这',
  ghostFade = 1,
  warm = false,
}) => {
  const t = f - at;
  const cx = 960;
  const cy = 470;
  const R = 320;
  const real = azPos(cx, cy, R, AZ_E);
  const ghost = azPos(cx, cy, R, AZ_M);
  const [l, r] = earPos(cx, cy, 70, yaw);
  const show = (d: number) => clamp01((t - d) / 8);
  const axisC = warm ? T.orange : T.cyan;
  // 镜面：两耳连线（随头转）
  const a0 = azPos(cx, cy, 560, -Math.PI / 2, yaw);
  const a1 = azPos(cx, cy, 560, Math.PI / 2, yaw);
  const d = (p: [number, number], e: [number, number]) => Math.hypot(p[0] - e[0], p[1] - e[1]);
  return (
    <HearCanvas>
      <line x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]} stroke={axisC} strokeWidth={2 + 3 * glowAxis} strokeDasharray="12 10" opacity={0.45 + 0.55 * glowAxis} style={{filter: glowF(axisC, 2 + 12 * glowAxis)}} />
      <text x={a1[0] - 10} y={a1[1] - 16} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={axisC} opacity={0.8}>
        两耳连线
      </text>
      <text x={cx} y={cy - 330 - 40} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} letterSpacing={4} fill={T.gray}>
        前
      </text>
      <text x={cx} y={cy + 330 + 60} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} letterSpacing={4} fill={T.gray}>
        后
      </text>
      {dist && (
        <g opacity={show(4)}>
          {[real, ghost].map((p, i) => (
            <g key={i}>
              <line x1={p[0]} y1={p[1]} x2={l[0]} y2={l[1]} stroke={i ? T.orange : T.red} strokeWidth={2} opacity={0.6} />
              <line x1={p[0]} y1={p[1]} x2={r[0]} y2={r[1]} stroke={i ? T.orange : T.red} strokeWidth={2} opacity={0.6} />
              <text x={p[0] + 40} y={p[1] + (i ? 100 : -10)} fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={i ? T.orange : T.red}>
                到左耳 − 到右耳 = {Math.round(d(p, l) - d(p, r))}
              </text>
            </g>
          ))}
        </g>
      )}
      <g opacity={show(2) * ghostFade}>
        <SoundSource f={f} x={ghost[0]} y={ghost[1]} color={T.orange} ghost label={ghostLabel} labelDy={56} />
      </g>
      <g opacity={show(0)}>
        <SoundSource f={f} x={real[0]} y={real[1]} color={T.red} label={realLabel} />
      </g>
      {youTurn !== undefined && (
        <path d={`M${cx + 110} ${cy - 30} A 110 110 0 0 1 ${azPos(cx, cy, 110, 0.5 + youTurn * (AZ_M - 0.5))[0]} ${azPos(cx, cy, 110, 0.5 + youTurn * (AZ_M - 0.5))[1]}`} fill="none" stroke={T.cyan} strokeWidth={4} opacity={youTurn > 0 ? 0.8 : 0} markerEnd="url(#arr)" />
      )}
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={T.cyan} />
        </marker>
      </defs>
      <HeadTop x={cx} y={cy} r={70} yaw={yaw} color={warm ? T.orange : T.cyan} />
    </HearCanvas>
  );
};

/* ---------------- 时差：声波先到右耳，再到左耳 ---------------- */

/** 声波从右边扩散，先碰到右耳再碰到左耳，碰到时耳朵亮起；下方两耳到达时间轨道（慢放演示） */
export const ItdDemo: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const cx = 960;
  const cy = 330;
  const r = 100;
  const src: [number, number] = [1660, cy];
  const [l, rr] = earPos(cx, cy, r);
  const speed = 18;
  const period = 80;
  const dR = src[0] - rr[0];
  const dL = src[0] - l[0];
  const lit = (dd: number) => {
    let m = 0;
    for (let k = 0; k < 3; k++) {
      const rad = ((t - k * period) % (period * 3)) * speed;
      if (t - k * period < 0) continue;
      m = Math.max(m, clamp01(1 - Math.abs(rad - dd) / 60));
    }
    return m;
  };
  const rings = [0, 1, 2].map((k) => {
    const tt = t - k * period;
    if (tt < 0) return null;
    const rad = (tt % (period * 3)) * speed;
    if (rad > 1500) return null;
    return <circle key={k} cx={src[0]} cy={src[1]} r={rad} fill="none" stroke={T.red} strokeWidth={3} opacity={0.6 * (1 - rad / 1500)} />;
  });
  // 轨道：两只耳朵的到达时刻，按同一慢放比例错开
  const gap = ((dL - dR) / speed) * 6;
  const x0 = 520;
  const tw = 900;
  const ty = 590;
  const arriveR = dR / speed;
  const cyc = t % (period * 3);
  const mark = (k: 'L' | 'R', i: number) => {
    const yy = ty + i * 80;
    const tArr = k === 'R' ? arriveR : arriveR + (dL - dR) / speed;
    const px = x0 + 200 + (k === 'R' ? 0 : gap);
    const on = cyc >= tArr;
    return (
      <g key={k}>
        <line x1={x0} x2={x0 + tw} y1={yy} y2={yy} stroke="rgba(200,215,225,0.22)" strokeWidth={2} />
        <text x={x0 - 24} y={yy + 9} textAnchor="end" fontFamily={TF.sans} fontSize={28} fill={T.text}>
          {k === 'R' ? '右耳' : '左耳'}
        </text>
        {on && <path d={`M${px - 14} ${yy} L${px} ${yy - 40} L${px + 14} ${yy}`} fill="none" stroke={T.orange} strokeWidth={4} style={{filter: glowF(T.orange, 6)}} />}
      </g>
    );
  };
  const both = cyc >= arriveR + (dL - dR) / speed;
  return (
    <HearCanvas>
      {rings}
      <SoundSource f={f} x={src[0]} y={src[1]} color={T.red} rings={0} label="脚步声" />
      <HeadTop x={cx} y={cy} r={r} litL={lit(dL)} litR={lit(dR)} />
      <g opacity={clamp01((t - 20) / 10)}>
        {mark('R', 0)}
        {mark('L', 1)}
        <g opacity={both ? 1 : 0}>
          <line x1={x0 + 200} x2={x0 + 200 + gap} y1={ty + 120} y2={ty + 120} stroke={T.orange} strokeWidth={3} />
          <text x={x0 + 200 + gap / 2 + 20} y={ty + 130} fontFamily={TF.sans} fontSize={26} fill={T.orange} textAnchor="start" dx={gap / 2}>
            两耳时间差
          </text>
        </g>
        <text x={x0 + tw} y={ty - 50} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={20} letterSpacing={3} fill={T.gray}>
          慢放演示 · 不到 1 毫秒放大成十几帧
        </text>
      </g>
    </HearCanvas>
  );
};

/* ---------------- 猜：两个答案来回闪 ---------------- */

/** 头在中间，右前和右后两个点轮流亮（大脑在两个答案之间犹豫） */
export const GuessMap: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const cx = 960;
  const cy = 450;
  const pick = Math.floor(t / 16) % 2;
  const real = azPos(cx, cy, 300, AZ_E);
  const ghost = azPos(cx, cy, 300, AZ_M);
  return (
    <>
      <HearCanvas>
        <SoundSource f={f} x={real[0]} y={real[1]} color={pick === 0 ? T.orange : 'rgba(240,160,69,0.3)'} ghost={pick !== 0} rings={pick === 0 ? 2 : 0} />
        <SoundSource f={f} x={ghost[0]} y={ghost[1]} color={pick === 1 ? T.orange : 'rgba(240,160,69,0.3)'} ghost={pick !== 1} rings={pick === 1 ? 2 : 0} />
        <HeadTop x={cx} y={cy} r={70} />
        {/* 耳机 */}
        <path d={`M${cx - 92} ${cy} A 92 92 0 0 1 ${cx + 92} ${cy}`} fill="none" stroke={T.white} strokeWidth={6} opacity={clamp01((t - 6) / 8) * 0.8} transform={`rotate(0 ${cx} ${cy})`} />
      </HearCanvas>
      <Bubble f={f} at={0} text="前？" x={real[0] + 40} y={real[1] - 70} color={pick === 0 ? T.orange : T.dim} />
      <Bubble f={f} at={0} text="后？" x={ghost[0] + 40} y={ghost[1] + 20} color={pick === 1 ? T.orange : T.dim} />
    </>
  );
};

/* ---------------- 耳廓：同一个声音，前后来被改得不一样 ---------------- */

/** 侧视的耳廓（原创简笔）：外圈螺旋 + 内凹 + 耳道；前后两道声音箭头打进来 */
export const PinnaSide: React.FC<{f: number; at: number; x?: number; y?: number}> = ({f, at, x = 480, y = 470}) => {
  const t = f - at;
  const o = clamp01(t / 10);
  const arrow = (from: number, c: string, d: number, label: string) => {
    const p = easeOut(clamp01((t - d) / 18));
    const x0 = x + from * 320;
    const x1 = x + from * 90;
    const xe = x0 + (x1 - x0) * p;
    return (
      <g opacity={clamp01((t - d) / 6)}>
        <line x1={x0} y1={y - 20} x2={xe} y2={y - 20} stroke={c} strokeWidth={5} style={{filter: glowF(c, 6)}} />
        <path d={`M${xe - from * 18} ${y - 34} L${xe} ${y - 20} L${xe - from * 18} ${y - 6}`} fill="none" stroke={c} strokeWidth={5} />
        <text x={x0} y={y - 50} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={c}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <HearCanvas>
      <g opacity={o} fill="none" stroke={T.cyan} strokeLinecap="round" style={{filter: glowF(T.cyan, 6)}}>
        <path d={`M${x + 10} ${y - 210} C ${x + 150} ${y - 230}, ${x + 170} ${y - 40}, ${x + 90} ${y + 40} C ${x + 40} ${y + 90}, ${x + 60} ${y + 170}, ${x + 10} ${y + 200} C ${x - 40} ${y + 225}, ${x - 80} ${y + 180}, ${x - 70} ${y + 130}`} strokeWidth={8} />
        <path d={`M${x - 10} ${y - 150} C ${x + 90} ${y - 160}, ${x + 100} ${y - 40}, ${x + 30} ${y + 10}`} strokeWidth={5} opacity={0.8} />
        <ellipse cx={x - 10} cy={y + 20} rx={26} ry={34} strokeWidth={5} />
      </g>
      <text x={x} y={y + 270} textAnchor="middle" fontFamily={TF.sans} fontSize={28} fill={T.cyan} opacity={o}>
        耳廓（侧面看）
      </text>
      {arrow(-1, T.cyan, 14, '前')}
      {arrow(1, T.red, 28, '后')}
    </HearCanvas>
  );
};

export const PinnaScene: React.FC<{f: number; at: number; hrtfAt: number}> = ({f, at, hrtfAt}) => (
  <>
    <PinnaSide f={f} at={at} x={500} />
    <HearCanvas>
      <PinnaSpectrum f={f} at={at + 30} x={980} y={260} w={760} h={360} />
    </HearCanvas>
    <div style={{position: 'absolute', left: 980, top: 700, fontFamily: TF.sans, fontSize: 30, color: T.orange, opacity: clamp01((f - hrtfAt) / 10), filter: glowF(T.orange, 6)}}>
      HRTF · 头部相关传递函数
    </div>
  </>
);

/* ---------------- 转头：前面的往中间跑，后面的往外跑 ---------------- */

/** 「在耳朵里的位置」刻度条：左 —— 中 —— 右，一个点表示声音听起来偏多少（sin(方位 − 头朝向)） */
const SideMeter: React.FC<{x: number; y: number; w: number; v: number; color: string; label: string; trail?: number}> = ({x, y, w, v, color, label, trail}) => (
  <g>
    <text x={x - 24} y={y + 9} textAnchor="end" fontFamily={TF.sans} fontSize={28} fill={color}>
      {label}
    </text>
    <line x1={x} x2={x + w} y1={y} y2={y} stroke="rgba(200,215,225,0.25)" strokeWidth={3} />
    {[0, 0.5, 1].map((k) => (
      <line key={k} x1={x + w * k} x2={x + w * k} y1={y - 12} y2={y + 12} stroke="rgba(200,215,225,0.35)" strokeWidth={2} />
    ))}
    {trail !== undefined && <line x1={x + w * (0.5 + trail / 2)} x2={x + w * (0.5 + v / 2)} y1={y} y2={y} stroke={color} strokeWidth={6} opacity={0.5} />}
    <circle cx={x + w * (0.5 + v / 2)} cy={y} r={14} fill={color} style={{filter: glowF(color, 8)}} />
  </g>
);

/** 转头演示：前后各一个声源；turnAt 起头向右转 0.5 弧度；下方两条「在耳朵里的位置」 */
export const TurnDemo: React.FC<{f: number; at: number; turnAt: number}> = ({f, at, turnAt}) => {
  const t = f - at;
  const cx = 960;
  const cy = 400;
  const turn = 0.5 * easeInOut(clamp01((f - turnAt) / 24));
  const azF = 50 * RAD;
  const azB = 130 * RAD;
  const pf = azPos(cx, cy, 280, azF);
  const pb = azPos(cx, cy, 280, azB);
  const mx = 640;
  const mw = 640;
  const turned = f >= turnAt;
  return (
    <HearCanvas style={{opacity: clamp01(t / 8)}}>
      <SoundSource f={f} x={pf[0]} y={pf[1]} color={T.cyan} label="前面的声音" rings={2} />
      <SoundSource f={f} x={pb[0]} y={pb[1]} color={T.red} label="后面的声音" labelDy={56} rings={2} />
      <HeadTop x={cx} y={cy} r={70} yaw={turn} />
      {turned && (
        <text x={cx - 120} y={cy - 120} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.orange} opacity={clamp01((f - turnAt) / 8)}>
          头 → 向右转
        </text>
      )}
      <text x={mx} y={700} fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        左
      </text>
      <text x={mx + mw / 2} y={700} textAnchor="middle" fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        正中
      </text>
      <text x={mx + mw} y={700} textAnchor="end" fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        右
      </text>
      <text x={mx + mw + 30} y={748} fontFamily={TF.sans} fontSize={22} fill={T.gray}>
        听起来偏多少
      </text>
      <SideMeter x={mx} y={740} w={mw} v={Math.sin(azF - turn)} trail={turned ? Math.sin(azF) : undefined} color={T.cyan} label="前面的" />
      <SideMeter x={mx} y={800} w={mw} v={Math.sin(azB - turn)} trail={turned ? Math.sin(azB) : undefined} color={T.red} label="后面的" />
    </HearCanvas>
  );
};

/* ---------------- 方法卡图标 ---------------- */

export const STEP_ICONS: ((c: string) => React.ReactNode)[] = [
  (c) => (
    <>
      <circle cx={120} cy={80} r={46} fill="none" stroke={c} strokeWidth={4} />
      <path d="M120 34 A46 46 0 0 1 166 80" fill="none" stroke={c} strokeWidth={8} strokeLinecap="round" />
      <path d="M154 70 L166 84 L178 70" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  (c) => (
    <>
      <line x1={120} y1={20} x2={120} y2={140} stroke={c} strokeWidth={2} strokeDasharray="6 6" />
      <path d="M200 60 L140 60 M156 46 L140 60 L156 74" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 110 L210 110 M194 96 L210 110 L194 124" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </>
  ),
  (c) => (
    <>
      <path d="M60 100 A60 60 0 0 1 180 100" fill="none" stroke={c} strokeWidth={8} />
      <rect x={44} y={92} width={30} height={46} rx={8} fill={c} />
      <rect x={166} y={92} width={30} height={46} rx={8} fill={c} />
    </>
  ),
  (c) => (
    <>
      <circle cx={120} cy={78} r={56} fill="none" stroke={c} strokeWidth={4} />
      <circle cx={120} cy={78} r={30} fill="none" stroke={c} strokeWidth={4} />
      <circle cx={120} cy={78} r={8} fill={c} />
    </>
  ),
];

/* ---------------- 结尾：听到脚步，转一下，爆头 ---------------- */

/** 暖色射击场：右边两声脚步，第 218 拍视角甩向右前方，他刚走出箱子，shotAt 帧命中 */
export const HoldRange: React.FC<{f: number; flickAt: number; shotAt: number}> = ({f, flickAt, shotAt}) => {
  const target = Math.atan2(ENEMY_OUT.x, ENEMY_OUT.z);
  const yaw = -0.05 + (target + 0.05) * easeInOut(clamp01((f - flickAt) / 10));
  const t = f - shotAt;
  const cam: Cam = {x: 0, z: 0, yaw};
  const head = project([ENEMY_OUT.x, 1.75, ENEMY_OUT.z], cam) ?? [960, 470];
  // 他从箱子后面走出来：甩视角前 20 帧起步，甩完正好站到准星里
  const k = easeInOut(clamp01((f - (flickAt - 20)) / 30));
  const ex = ENEMY_HIDE.x + (ENEMY_OUT.x - ENEMY_HIDE.x) * k;
  const ez = ENEMY_HIDE.z + (ENEMY_OUT.z - ENEMY_HIDE.z) * k;
  return (
    <>
      <Range cam={cam} tone="warm" boxes={BOXES} dummies={[{x: ex, z: ez, state: t > 6 ? 'dead' : t >= 0 ? 'hit' : 'idle'}]} wallZ={18} backWallZ={-14} />
      <StepPulse f={f} beats={[216, 217]} />
      <Crosshair color="#ffd9a8" />
      <Tracer to={[960, head[1]]} t={t} />
      <ViewGun kick={clamp01(1 - Math.abs(t) / 5)} tone="warm" sway={Math.sin(f / 22) * 0.5} />
      <HitMark f={f} at={shotAt + 1} x={960} y={head[1]} text="HEADSHOT" />
    </>
  );
};
