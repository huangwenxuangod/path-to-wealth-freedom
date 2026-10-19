import React from 'react';
import {clamp01, easeOut, rand} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Dummy, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';

/**
 * ep50 各段画面。组件都拿帧号，自己按 timeline 的拍子算出场时间。
 */

const YARD: Box[] = [
  {x: -3.6, z: 13, w: 2, h: 1.4, crate: true},
  {x: 3.8, z: 14, w: 1.8, h: 2},
  {x: -1.4, z: 19, w: 2.2, h: 1.2, crate: true},
];
const ENEMY = {x: 0.2, z: 10};
const CAM = {x: 0, z: 0, y: 1.6, yaw: 0};
export const ENEMY_HEAD = project([ENEMY.x, 1.53, ENEMY.z], CAM) ?? [980, 547];

/** 准星飘：低频漂移（rand 平滑插值），wobble 0–1 是幅度 */
const drift = (f: number, seed: number) => {
  const k = Math.floor(f / 14);
  const u = (f % 14) / 14;
  const s = u * u * (3 - 2 * u);
  const a = rand(seed + k) - 0.5;
  const b = rand(seed + k + 1) - 0.5;
  return a + (b - a) * s;
};

/**
 * 第一人称：一个站着不动的人。wobble 让准星在他头附近飘；shots 是你开枪的帧（飘着就打空）；kill 给了就在那一帧爆头；
 * clock 是右上角的钟点
 */
export const TiredView: React.FC<{f: number; wobble: number; shots?: number[]; kill?: number; tone?: Tone; dead?: boolean; clock?: string}> = ({f, wobble, shots = [], kill, tone = 'blue', dead = false, clock}) => {
  const killed = kill !== undefined && f >= kill + 2;
  const enemy: Dummy = {x: ENEMY.x, z: ENEMY.z, state: killed ? 'dead' : kill !== undefined && f >= kill ? 'hit' : 'idle'};
  const cross: [number, number] = [ENEMY_HEAD[0] + wobble * (60 + drift(f, 11) * 160), ENEMY_HEAD[1] + wobble * drift(f, 37) * 120];
  const lastShot = [...shots, ...(kill !== undefined ? [kill] : [])].filter((s) => f >= s).pop();
  const kick = lastShot !== undefined ? Math.max(0, 1 - (f - lastShot) / 6) : 0;
  const warm = tone === 'warm';
  return (
    <>
      <Range cam={CAM} tone={tone} boxes={YARD} dummies={[enemy]} wallZ={24} />
      <Crosshair x={cross[0]} y={cross[1]} color={warm ? '#ffd9a8' : T.cyan} />
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
      <ViewGun sway={dead ? 0 : Math.sin(f / 9) * (0.5 + wobble)} kick={kick} tone={tone} />
      {clock ? (
        <div style={{position: 'absolute', right: 120, top: 240, textAlign: 'right'}}>
          <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 64, color: warm ? '#ffd9a8' : T.red, filter: glowF(warm ? '#ffd9a8' : T.red, 6)}}>{clock}</div>
        </div>
      ) : null}
    </>
  );
};

/**
 * 两把尺子对照：上面「醒着的小时数」0–28，下面「血液酒精浓度」0–0.1%；hoursAt 起上面亮出 17–19 小时那一段，bacAt 起下面亮出 0.05%，
 * linkAt 起两段之间连一条「一样差」的括线
 */
export const EquivScales: React.FC<{f: number; at: number; hoursAt: number; bacAt: number; linkAt: number; hours: [number, number]; bac: number}> = ({f, at, hoursAt, bacAt, linkAt, hours, bac}) => {
  const x = 360;
  const w = 1200;
  const hx = (h: number) => x + (h / 28) * w;
  const bx = (b: number) => x + (b / 0.1) * w;
  const o = clamp01((f - at) / 8);
  const ho = clamp01((f - hoursAt) / 8);
  const bo = clamp01((f - bacAt) / 8);
  const lo = easeOut(clamp01((f - linkAt) / 12));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <text x={x} y={290} fontFamily={TF.sans} fontSize={34} fill={T.cyan}>
        一直不睡：醒着的小时数
      </text>
      <rect x={x} y={310} width={w} height={40} fill="rgba(200,215,225,0.06)" stroke={T.faint} />
      {[0, 7, 14, 21, 28].map((h) => (
        <text key={h} x={hx(h)} y={390} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
          {h}h
        </text>
      ))}
      <rect x={hx(hours[0])} y={310} width={(hx(hours[1]) - hx(hours[0])) * ho} height={40} fill={T.cyan} style={{filter: glowF(T.cyan, 8)}} />
      <text x={(hx(hours[0]) + hx(hours[1])) / 2} y={300} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={T.cyan} opacity={ho}>
        {hours[0]}–{hours[1]}h
      </text>
      <text x={x} y={560} fontFamily={TF.sans} fontSize={34} fill={T.orange}>
        喝酒：血液酒精浓度
      </text>
      <rect x={x} y={580} width={w} height={40} fill="rgba(200,215,225,0.06)" stroke={T.faint} />
      {[0, 0.025, 0.05, 0.075, 0.1].map((b) => (
        <text key={b} x={bx(b)} y={660} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} fill={T.gray}>
          {(b * 1).toFixed(b === 0 ? 0 : b === 0.05 || b === 0.1 ? 2 : 3)}%
        </text>
      ))}
      <rect x={bx(bac) - 12} y={572} width={24} height={56 * bo} fill={T.orange} style={{filter: glowF(T.orange, 8)}} />
      {lo > 0 ? (
        <g opacity={lo}>
          <path d={`M${(hx(hours[0]) + hx(hours[1])) / 2} 360 C ${(hx(hours[0]) + hx(hours[1])) / 2} 460, ${bx(bac)} 470, ${bx(bac)} 568`} fill="none" stroke={T.white} strokeWidth={3} strokeDasharray="10 8" />
          <text x={((hx(hours[0]) + hx(hours[1])) / 2 + bx(bac)) / 2 + 30} y={475} fontFamily={TF.sans} fontSize={36} fill={T.white}>
            一样差
          </text>
        </g>
      ) : null}
    </svg>
  );
};

/**
 * 14 天三条线（示意，只画方向）：每晚睡 8 / 6 / 4 小时，纵轴是失误多少（向上变差）；虚线是「两晚完全不睡」的水平
 */
export const DayLines: React.FC<{f: number; at: number; days: number; doses: number[]; equivAt: number}> = ({f, at, days, doses, equivAt}) => {
  const x = 360;
  const y = 260;
  const w = 1200;
  const h = 460;
  const p = clamp01((f - at) / 50);
  const slope: Record<number, number> = {8: 0.03, 6: 0.6, 4: 0.95};
  const colors: Record<number, string> = {8: T.green, 6: T.orange, 4: T.red};
  const px = (d: number) => x + (d / days) * w;
  const py = (v: number) => y + h - v * h * 0.9;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - at) / 6)}}>
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <text x={x - 16} y={y + 10} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        失误多
      </text>
      <text x={x + w} y={y + h + 44} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        第 1 → {days} 天
      </text>
      <line x1={x} x2={x + w} y1={py(0.6)} y2={py(0.6)} stroke={T.white} strokeWidth={2} strokeDasharray="10 8" opacity={clamp01((f - equivAt) / 8)} />
      <text x={x + 20} y={py(0.6) - 14} fontFamily={TF.sans} fontSize={28} fill={T.white} opacity={clamp01((f - equivAt) / 8)}>
        两晚完全不睡
      </text>
      {doses.map((d) => {
        const n = Math.max(2, Math.round(60 * p));
        const pts = Array.from({length: n}, (_, i) => {
          const t = (i / 59) * days;
          return `${i ? 'L' : 'M'}${px(t).toFixed(1)} ${py(slope[d] * (t / days)).toFixed(1)}`;
        }).join(' ');
        return (
          <g key={d}>
            <path d={pts} fill="none" stroke={colors[d]} strokeWidth={6} style={{filter: glowF(colors[d], 6)}} />
            {p >= 1 ? (
              <text x={px(days) + 16} y={py(slope[d]) + 10} fontFamily={TF.sans} fontSize={30} fill={colors[d]}>
                每晚 {d} 小时
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
