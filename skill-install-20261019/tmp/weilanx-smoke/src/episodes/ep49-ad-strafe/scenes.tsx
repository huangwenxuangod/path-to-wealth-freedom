import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Dummy, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';
import {keyPos, predictAim} from '../../library/tactical/tracking';
import type {Key} from '../../library/tactical/tracking';

/**
 * ep49 各段画面。组件都拿帧号，自己按 timeline 的拍子算出场时间。
 */

const YARD: Box[] = [
  {x: -4.4, z: 13, w: 2, h: 1.4, crate: true},
  {x: 4.6, z: 14, w: 2, h: 2},
  {x: -2, z: 18, w: 2.2, h: 1.2, crate: true},
  {x: 2.4, z: 20, w: 1.8, h: 1.6},
];
const Z = 9;
const CAM = {x: 0, z: 0, y: 1.6, yaw: 0};
/** 某个横向位置的人，头在屏幕上的坐标 */
export const headAt = (x: number): [number, number] => project([x, 1.53, Z], CAM) ?? [960, 547];

/**
 * 第一人称打横跳：kf 是他的关键帧（帧, 米）；准星 aim：'predict' 按滞后 lag 帧的预测追，'park' 停在 parkX 不动。
 * shots 是你开枪的帧（准星没对上就标 MISS）；kill 给了就在那一帧爆头；dead 冻结视角
 */
export const StrafeView: React.FC<{f: number; kf: Key[]; lag: number; aim?: 'predict' | 'park'; parkX?: number; shots?: number[]; kill?: number; tone?: Tone; dead?: boolean; arrow?: boolean}> = ({f, kf, lag, aim = 'predict', parkX = 1, shots = [], kill, tone = 'blue', dead = false, arrow = false}) => {
  const x = keyPos(kf, f);
  const killed = kill !== undefined && f >= kill + 2;
  const enemy: Dummy = {x, z: Z, state: killed ? 'dead' : kill !== undefined && f >= kill ? 'hit' : 'idle'};
  const ax = aim === 'park' ? parkX : predictAim(kf, f, lag);
  const cross = headAt(ax);
  const lastShot = [...shots, ...(kill !== undefined ? [kill] : [])].filter((s) => f >= s).pop();
  const kick = lastShot !== undefined ? Math.max(0, 1 - (f - lastShot) / 6) : 0;
  const warm = tone === 'warm';
  const prev = predictAim(kf, f - 2, lag);
  const dir = Math.sign(ax - prev);
  return (
    <>
      <Range cam={CAM} tone={tone} boxes={YARD} dummies={[enemy]} wallZ={24} />
      <Crosshair x={cross[0]} y={cross[1]} color={warm ? '#ffd9a8' : T.cyan} />
      {arrow && dir !== 0 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <path d={`M${cross[0] + dir * 40} ${cross[1]} h${dir * 90} m${-dir * 22} -18 l${dir * 22} 18 l${-dir * 22} 18`} fill="none" stroke={T.cyan} strokeWidth={6} style={{filter: glowF(T.cyan, 6)}} />
        </svg>
      ) : null}
      {lastShot !== undefined ? (
        <>
          <Tracer to={cross} t={f - lastShot} />
          {kill !== undefined && lastShot === kill ? (
            <HitMark f={f} at={lastShot} x={cross[0]} y={cross[1]} text="HEADSHOT" color={warm ? '#ffd9a8' : '#ffffff'} />
          ) : (
            <HitMark f={f} at={lastShot} x={cross[0]} y={cross[1]} text="MISS" color={T.red} />
          )}
        </>
      ) : null}
      <ViewGun sway={dead ? 0 : Math.sin(f / 9) * 0.5} kick={kick} tone={tone} />
    </>
  );
};

/** 眼睛 → 大脑 → 手：三个节点、一颗信号点沿线走，下方标「约 100 ms」 */
export const DelayChain: React.FC<{f: number; at: number; ms: number}> = ({f, at, ms}) => {
  const nodes: [number, string][] = [
    [460, '眼睛看到'],
    [960, '大脑处理'],
    [1460, '手动起来'],
  ];
  const p = clamp01((f - at) / 40);
  const sx = 460 + 1000 * easeOut(p);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={460} x2={1460} y1={460} y2={460} stroke={T.faint} strokeWidth={4} strokeDasharray="12 10" />
      {nodes.map(([x, name], i) => (
        <g key={name} opacity={clamp01((f - at - i * 8) / 6)}>
          <circle cx={x} cy={460} r={70} fill="rgba(10,19,34,0.9)" stroke={T.cyan} strokeWidth={4} />
          <text x={x} y={590} textAnchor="middle" fontFamily={TF.sans} fontSize={38} fill={T.white}>
            {name}
          </text>
        </g>
      ))}
      <circle cx={sx} cy={460} r={16} fill={T.orange} style={{filter: glowF(T.orange, 10)}} opacity={p > 0 && p < 1 ? 1 : 0.4} />
      <text x={960} y={700} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={T.orange} opacity={clamp01((f - at - 20) / 8)} style={{filter: glowF(T.orange, 8)}}>
        约 {ms} ms
      </text>
    </svg>
  );
};
