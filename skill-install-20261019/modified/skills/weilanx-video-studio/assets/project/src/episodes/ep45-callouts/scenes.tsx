import React from 'react';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {ToneIcon} from '../../library/tactical/attention';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Dummy, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';

/**
 * ep45 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const YARD: Box[] = [
  {x: -2.6, z: 13, w: 1.8, h: 1.2, crate: true},
  {x: -6.5, z: 17, w: 2, h: 2},
  {x: 7.2, z: 9.6, w: 1.6, h: 1.9},
  {x: 2.8, z: 18, w: 2.2, h: 1.4, crate: true},
];
/** 正面那个人、右边那个人（右边的人从 x = 7.4 的箱子后探到 5.6） */
const FRONT = {x: 0, z: 13};
const SIDE = {x: 5.6, z: 9};
const SIDE_YAW = Math.atan2(SIDE.x, SIDE.z);

/**
 * 第一人称对枪：准星压在正面那个人的头上（左右小幅追踪）；sidePeek 帧起右边的人探出来。
 * turn 0–1 把视角转向右边那个人；frontDead / sideDead 让人倒下；sideHit 是爆头那一帧
 */
export const DuelView: React.FC<{f: number; sidePeek: number; tone?: Tone; dead?: boolean; turn?: number; frontDead?: boolean; sideState?: Dummy['state']; shotAt?: number}> = ({f, sidePeek, tone = 'blue', dead = false, turn = 0, frontDead = false, sideState = 'idle', shotAt}) => {
  const strafe = frontDead ? 0 : Math.sin(f / 11) * 0.45;
  const front: Dummy = {x: FRONT.x + strafe, z: FRONT.z, state: frontDead ? 'dead' : 'idle'};
  const peek = easeOut(clamp01((f - sidePeek) / 10));
  const side: Dummy = {x: 7.4 - (7.4 - SIDE.x) * peek, z: SIDE.z, state: sideState};
  const trackYaw = Math.atan2(front.x, front.z);
  const yaw = trackYaw + (SIDE_YAW - trackYaw) * easeInOut(clamp01(turn));
  const cam = {x: 0, z: 0, y: 1.6, yaw};
  const head = project([turn > 0.5 ? side.x : front.x, 1.53, turn > 0.5 ? side.z : front.z], cam);
  const kick = shotAt !== undefined && f >= shotAt ? Math.max(0, 1 - (f - shotAt) / 6) : 0;
  return (
    <>
      <Range cam={cam} tone={tone} boxes={YARD} dummies={[front, side]} wallZ={24} />
      <Crosshair x={960} y={head ? head[1] : 540} color={tone === 'warm' ? '#ffd9a8' : T.cyan} />
      {shotAt !== undefined && head ? (
        <>
          <Tracer to={[960, head[1]]} t={f - shotAt} />
          <HitMark f={f} at={shotAt} x={960} y={head[1]} text="HEADSHOT" color={tone === 'warm' ? '#ffd9a8' : '#ffffff'} />
        </>
      ) : null}
      <ViewGun sway={dead ? 0 : Math.sin(f / 9) * 0.5} kick={kick} tone={tone} />
    </>
  );
};

/** 回放：两条轨道。上「你的眼睛」一直盯着正面（青色实条），下「队友的麦」三段橙色喊话；deathT 处一条红线 */
export const CallTimeline: React.FC<{f: number; at: number; calls: number[]; deathT: number; callText: string}> = ({f, at, calls, deathT, callText}) => {
  const x0 = 360;
  const w = 1240;
  const p = easeOut(clamp01((f - at) / 40));
  const lane = (y: number, title: string, color: string) => (
    <>
      <text x={x0 - 30} y={y + 42} textAnchor="end" fontFamily={TF.sans} fontSize={34} fill={color}>
        {title}
      </text>
      <rect x={x0} y={y} width={w} height={64} fill="rgba(200,215,225,0.05)" stroke={T.faint} strokeWidth={1.5} />
    </>
  );
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {lane(330, '你的眼睛', T.cyan)}
      {lane(520, '队友的麦', T.orange)}
      <rect x={x0} y={330} width={w * Math.min(p, deathT)} height={64} fill={T.cyan} opacity={0.8} style={{filter: glowF(T.cyan, 6)}} />
      {p > 0.2 ? (
        <text x={x0 + 24} y={374} fontFamily={TF.sans} fontSize={32} fill="#06121a">
          一直盯着正面那个人
        </text>
      ) : null}
      {calls.map((c, i) => {
        const o = clamp01((p - c) / 0.05);
        return (
          <g key={i} opacity={o}>
            <rect x={x0 + c * w} y={530} width={w * 0.2} height={44} rx={8} fill={T.orange} style={{filter: glowF(T.orange, 6)}} />
            <text x={x0 + c * w + w * 0.1} y={563} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill="#1a0e02">
              {callText}
            </text>
            <text x={x0 + c * w + w * 0.1} y={630} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.orange}>
              第 {i + 1} 遍
            </text>
          </g>
        );
      })}
      {p >= deathT ? (
        <g>
          <line x1={x0 + deathT * w} x2={x0 + deathT * w} y1={300} y2={680} stroke={T.red} strokeWidth={5} style={{filter: glowF(T.red, 8)}} />
          <text x={x0 + deathT * w} y={720} textAnchor="middle" fontFamily={TF.sans} fontSize={34} fill={T.red}>
            你倒下了
          </text>
        </g>
      ) : null}
    </svg>
  );
};

/**
 * 一排回合（示意）：n 个回合里 tone 标出的回合响了一声；heard 里的回合亮青，其余响了却没听见的标红「漏」。
 * 第 k 个回合在 at + k * per 帧出现
 */
export const RoundStrip: React.FC<{f: number; at: number; n: number; tone: number[]; heard: number[]; per?: number; y?: number}> = ({f, at, n, tone, heard, per = 6, y = 380}) => {
  const cell = 132;
  const x0 = 960 - (n * cell) / 2;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: n}, (_, k) => {
        const o = clamp01((f - at - k * per) / 6);
        const has = tone.includes(k);
        const ok = heard.includes(k);
        const c = !has ? T.faint : ok ? T.cyan : T.red;
        const x = x0 + k * cell + 10;
        return (
          <g key={k} opacity={o}>
            <rect x={x} y={y} width={cell - 20} height={170} rx={10} fill="rgba(10,19,34,0.8)" stroke={c} strokeWidth={3} style={has ? {filter: glowF(c, 5)} : undefined} />
            <text x={x + (cell - 20) / 2} y={y - 18} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
              {k + 1}
            </text>
            {has ? <ToneIcon x={x + (cell - 20) / 2 - 4} y={y + 70} s={56} color={ok ? T.cyan : T.red} on={1} /> : null}
            {has ? (
              <text x={x + (cell - 20) / 2} y={y + 146} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={c}>
                {ok ? '听见' : '漏'}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/** 飞行模拟：原创简化仪表板（三个圆表 + 一盏警报灯）+ 大号百分比 */
export const PilotCard: React.FC<{f: number; at: number; pctAt: number; pct: number; source: string}> = ({f, at, pctAt, pct, source}) => {
  const o = clamp01((f - at) / 8);
  const blink = Math.floor((f - at) / 8) % 2 === 0;
  const p = easeOut(clamp01((f - pctAt) / 14));
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
        <rect x={250} y={300} width={620} height={360} rx={18} fill="rgba(10,19,34,0.85)" stroke={T.faint} strokeWidth={2} />
        {[0, 1, 2].map((k) => {
          const cx = 360 + k * 200;
          const a = -2.2 + ((f / 20 + k * 1.7) % 1.6);
          return (
            <g key={k}>
              <circle cx={cx} cy={430} r={70} fill="none" stroke={T.cyan} strokeWidth={4} opacity={0.8} />
              <line x1={cx} y1={430} x2={cx + Math.cos(a) * 56} y2={430 + Math.sin(a) * 56} stroke={T.white} strokeWidth={5} />
            </g>
          );
        })}
        <circle cx={560} cy={580} r={30} fill={blink ? T.red : T.redDeep} style={blink ? {filter: glowF(T.red, 12)} : undefined} />
        <text x={610} y={592} fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={T.red}>
          ALARM
        </text>
        <text x={560} y={720} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.gray}>
          飞行模拟任务（原创示意）
        </text>
      </svg>
      <div style={{position: 'absolute', left: 980, top: 300, width: 760, opacity: p}}>
        <div style={{fontFamily: TF.sans, fontSize: 40, color: T.white}}>任务一忙，超过</div>
        <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 200, lineHeight: 1.05, color: T.orange, filter: glowF(T.orange, 12)}}>{Math.round(pct * p)}%</div>
        <div style={{fontFamily: TF.sans, fontSize: 40, color: T.white}}>的警报音没被察觉</div>
        <div style={{marginTop: 30, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: T.dim}}>{source}</div>
      </div>
    </>
  );
};
