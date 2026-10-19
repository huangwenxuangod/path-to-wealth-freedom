import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Tone} from '../../library/tactical/range';
import {gauss} from '../../library/tactical/charts';
import {glowF, T, TF} from '../../library/tactical/theme';
import {DEADZONE} from './timeline';

/**
 * ep40 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const YARD: Box[] = [
  {x: -5.5, z: 17, w: 2, h: 1.4, crate: true},
  {x: -2, z: 19, w: 1.6, h: 2},
  {x: 4.5, z: 18, w: 2, h: 1.2, crate: true},
  {x: 7.5, z: 16, w: 1.6, h: 1.8},
];
/** 头部中心离地高度（Range 胶囊人靶：身高 1.32 + 头半径 0.17 × 1.25） */
export const HEAD_Y = 1.53;
export const FOE = {x: 1.5, z: 12};

/** 第一人称横移：相机在 camX，始终转头让准星压着敌人的头；shotAt 起每 4 帧开一枪，弹孔按 spread（像素）散开 */
export const StrafeView: React.FC<{f: number; camX: number; tone?: Tone; shotAt?: number; shots?: number; spread?: number; hitText?: string; foeState?: 'idle' | 'hit' | 'dead'; seed?: number; bob?: number}> = ({
  f,
  camX,
  tone = 'blue',
  shotAt,
  shots = 3,
  spread = 0,
  hitText,
  foeState = 'idle',
  seed = 3,
  bob = 0,
}) => {
  const cam = {x: camX, z: 0, y: HEAD_Y + bob, yaw: Math.atan2(FOE.x - camX, FOE.z)};
  const head = project([FOE.x, HEAD_Y, FOE.z], cam) ?? [960, 540];
  const t = shotAt === undefined ? -1 : f - shotAt;
  const fired = shotAt === undefined || t < 0 ? 0 : Math.min(shots, Math.floor(t / 4) + 1);
  const kick = t >= 0 && t % 4 < 3 && t < shots * 4 ? 1 - (t % 4) / 3 : 0;
  const pts = Array.from({length: shots}, (_, i) => [head[0] + gauss(seed + i * 1.3) * spread, head[1] + gauss(seed + i * 2.1 + 0.4) * spread * 0.8] as [number, number]);
  return (
    <>
      <Range cam={cam} tone={tone} boxes={YARD} dummies={[{x: FOE.x, z: FOE.z, state: foeState}]} wallZ={24} />
      <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} spread={kick * 0.6 + (spread > 0 && shotAt === undefined ? 0.3 : 0)} />
      <ViewGun kick={kick} sway={Math.sin(f / 4) * 1.2 * (spread > 0 ? 1 : 0.3)} tone={tone} />
      {pts.slice(0, fired).map((p, i) => (
        <React.Fragment key={i}>
          <Tracer to={p} t={t - i * 4} />
          {t - i * 4 >= 1 ? (
            <Svg>
              <circle cx={p[0]} cy={p[1]} r={7} fill="#fff6d8" style={{filter: glowF('#ffd27a', 6)}} />
            </Svg>
          ) : null}
        </React.Fragment>
      ))}
      {fired > 0 && hitText ? <HitMark f={f} at={shotAt! + (shots - 1) * 4 + 2} x={head[0]} y={head[1]} text={hitText} color={hitText === 'MISS' ? '#ffffff' : T.orange} /> : null}
    </>
  );
};

/** 用 SVG 包一层，让弹孔小圆点能画在 HTML 里 */
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
    {children}
  </svg>
);

/** 底部速度条：0–100% 最高速度，绿区是 27.5% 以下（站稳）；高于门槛红色 */
export const SpeedHud: React.FC<{frac: number; x?: number; y?: number; w?: number; label?: string}> = ({frac, x = 660, y = 730, w = 600, label = '移动速度'}) => {
  const ok = frac < DEADZONE;
  const c = ok ? T.green : T.red;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: TF.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: T.gray}}>
        <span>{label}</span>
        <span style={{color: c}}>{ok ? '站稳 · 准' : '移动中 · 不准'}</span>
      </div>
      <div style={{position: 'relative', marginTop: 8, height: 20, background: 'rgba(200,215,225,0.08)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${DEADZONE * 100}%`, background: 'rgba(62,207,142,0.25)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${clamp01(frac) * 100}%`, background: c, boxShadow: `0 0 12px ${c}`}} />
        <div style={{position: 'absolute', left: `${DEADZONE * 100}%`, top: -6, bottom: -6, width: 3, background: T.green}} />
      </div>
    </div>
  );
};

/** 大号「死区」速度条：速度指针从 100% 落到绿区（27.5% 以下） */
export const DeadzoneBar: React.FC<{f: number; at: number}> = ({f, at}) => {
  const x0 = 260;
  const w = 1400;
  const p = 1 - 0.85 * easeOut(clamp01((f - at - 10) / 30));
  const ok = p < DEADZONE;
  return (
    <Svg>
      <text x={x0} y={330} fontFamily={TF.mono} fontWeight={700} fontSize={24} letterSpacing={3} fill={T.gray}>
        移动速度（占最高速度的比例）
      </text>
      <rect x={x0} y={380} width={w} height={70} fill="rgba(200,215,225,0.06)" />
      <rect x={x0} y={380} width={w * DEADZONE} height={70} fill="rgba(62,207,142,0.3)" />
      <line x1={x0 + w * DEADZONE} x2={x0 + w * DEADZONE} y1={360} y2={470} stroke={T.green} strokeWidth={4} style={{filter: glowF(T.green, 6)}} />
      <text x={x0 + w * DEADZONE} y={520} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={44} fill={T.green}>
        27.5%
      </text>
      <text x={x0 + (w * DEADZONE) / 2} y={425} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.white}>
        站稳 · 准
      </text>
      <text x={x0 + w * (DEADZONE + (1 - DEADZONE) / 2)} y={425} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.gray}>
        还在动 · 不准
      </text>
      <polygon points={`${x0 + w * p - 16},350 ${x0 + w * p + 16},350 ${x0 + w * p},376`} fill={ok ? T.green : T.red} style={{filter: glowF(ok ? T.green : T.red, 8)}} />
      <text x={x0} y={620} fontFamily={TF.sans} fontSize={24} fill={T.dim}>
        Riot《VALORANT Patch Notes 3.0》2021：Deadzone 30% → 27.5%（“the movement speed a player becomes inaccurate”）
      </text>
    </Svg>
  );
};

/** 横移位置：从 x0 起每帧 v 米；stopAt 之后像急停一样在 3 帧内刹住 */
export const strafeX = (f: number, x0: number, v: number, stopAt?: number) => {
  if (stopAt === undefined || f <= stopAt) return x0 + f * v;
  const t = Math.min(3, f - stopAt);
  return x0 + stopAt * v + v * (t - (t * t) / 6);
};
