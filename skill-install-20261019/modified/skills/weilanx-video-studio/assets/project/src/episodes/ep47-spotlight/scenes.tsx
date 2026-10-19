import React from 'react';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {Spotlight} from '../../library/tactical/attention';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Dummy, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';

/**
 * ep47 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const YARD: Box[] = [
  {x: -3.2, z: 13, w: 1.8, h: 1.2, crate: true},
  {x: -7, z: 17, w: 2, h: 2},
  {x: 6.2, z: 14, w: 1.6, h: 1.9},
  {x: 3.4, z: 19, w: 2.2, h: 1.4, crate: true},
];
/** 正面那个人、旁边那个人（从右边 x = 4 走到正面那人右边 1.2 米） */
export const FRONT = {x: 0, z: 8};
export const SIDE = {x: 1.2, z: 8.6};
const SIDE_YAW = Math.atan2(SIDE.x, SIDE.z);

type DuelProps = {
  f: number;
  sideIn: number;
  tone?: Tone;
  dead?: boolean;
  /** 0–1：视角从正面转到旁边那个人 */
  turn?: number;
  frontDead?: boolean;
  sideState?: Dummy['state'];
  /** 开枪的帧（最近一次），准星打在当前瞄的人头上 */
  shotAt?: number;
  /** 正面那个人被打中闪白的帧 */
  hits?: number[];
  /** 0–1：聚光灯贴着当前瞄的人（光外压暗） */
  spot?: number;
  spotId?: string;
};

/** 屏幕上某个人的身体中心和头 */
const bodyOn = (p: {x: number; z: number}, cam: {x: number; z: number; y: number; yaw: number}) => {
  const c = project([p.x, 0.85, p.z], cam);
  const hd = project([p.x, 1.53, p.z], cam);
  return {c, hd, s: 1000 / Math.max(1, p.z)};
};

/** 第一人称近距离对枪：准星压着正面那个人（左右小幅晃），旁边的人 sideIn 起 12 帧走到他右边站定 */
export const CloseDuel: React.FC<DuelProps> = ({f, sideIn, tone = 'blue', dead = false, turn = 0, frontDead = false, sideState = 'idle', shotAt, hits = [], spot = 0, spotId = 'duel'}) => {
  const strafe = frontDead ? 0 : Math.sin(f / 13) * 0.3;
  const hit = hits.some((h) => f >= h && f < h + 3);
  const front: Dummy = {x: FRONT.x + strafe, z: FRONT.z, state: frontDead ? 'dead' : hit ? 'hit' : 'idle'};
  const walk = easeOut(clamp01((f - sideIn) / 12));
  const side: Dummy = {x: 4 - (4 - SIDE.x) * walk, z: SIDE.z, state: sideState};
  const trackYaw = Math.atan2(front.x, front.z);
  const yaw = trackYaw + (SIDE_YAW - trackYaw) * easeInOut(clamp01(turn));
  const cam = {x: 0, z: 0, y: 1.6, yaw};
  const aim = turn > 0.5 ? side : front;
  const target = bodyOn(aim, cam);
  const headY = target.hd ? target.hd[1] : 540;
  const kick = shotAt !== undefined && f >= shotAt ? Math.max(0, 1 - (f - shotAt) / 6) : 0;
  const warm = tone === 'warm';
  return (
    <>
      <Range cam={cam} tone={tone} boxes={YARD} dummies={[front, side]} wallZ={24} />
      {spot > 0 && target.c ? <Spotlight id={spotId} holes={[{x: target.c[0], y: target.c[1] - 10, rx: target.s * 0.55, ry: target.s * 1.05}]} dark={0.88 * spot} soft={10} /> : null}
      <Crosshair x={960} y={headY} color={warm ? '#ffd9a8' : T.cyan} />
      {shotAt !== undefined ? (
        <>
          <Tracer to={[960, headY]} t={f - shotAt} />
          {turn > 0.5 || frontDead ? <HitMark f={f} at={shotAt} x={960} y={headY} text="HEADSHOT" color={warm ? '#ffd9a8' : '#ffffff'} /> : null}
        </>
      ) : null}
      <ViewGun sway={dead ? 0 : Math.sin(f / 9) * 0.5} kick={kick} tone={tone} />
    </>
  );
};

/** 旁边那个人在屏幕上的头部坐标（给回放圈和标签用） */
export const sideHeadOnScreen = (f: number) => {
  const strafe = Math.sin(f / 13) * 0.3;
  const cam = {x: 0, z: 0, y: 1.6, yaw: Math.atan2(FRONT.x + strafe, FRONT.z)};
  return project([SIDE.x, 1.1, SIDE.z], cam) ?? [1100, 520];
};

/**
 * 字母圈（仿 Macdonald & Lavie 2008，原创示意）：中心一圈 6 个字母，其中一个是目标（青）；
 * 外圈 shapeAt 处一个灰色小方块（要留意的图形），near 时贴着目标、否则在对面
 */
export const LetterRing: React.FC<{x: number; y: number; r?: number; letters?: string; target?: number; near: boolean; show?: number; title: string; color: string}> = ({x, y, r = 120, letters = 'KHVZMW', target = 0, near, show = 1, title, color}) => {
  const ang = (i: number) => -Math.PI / 2 + (i * Math.PI) / 3;
  const csA = near ? ang(target) + Math.PI / 6 : ang(target) + Math.PI + Math.PI / 6;
  const R2 = r * 2.1;
  const ls = [...letters];
  ls[target] = 'X';
  return (
    <g opacity={show}>
      <circle cx={x} cy={y} r={R2 + 50} fill="rgba(10,19,34,0.7)" stroke={T.faint} strokeWidth={2} />
      <text x={x} y={y - R2 - 76} textAnchor="middle" fontFamily={TF.sans} fontSize={38} fill={color}>
        {title}
      </text>
      <circle cx={x} cy={y} r={5} fill={T.gray} />
      {ls.map((c, i) => (
        <text key={i} x={x + Math.cos(ang(i)) * r} y={y + Math.sin(ang(i)) * r + 16} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={48} fill={i === target ? T.cyan : T.text} style={i === target ? {filter: glowF(T.cyan, 6)} : undefined}>
          {c}
        </text>
      ))}
      <rect x={x + Math.cos(csA) * R2 - 16} y={y + Math.sin(csA) * R2 - 16} width={32} height={32} fill={T.gray} transform={`rotate(20 ${x + Math.cos(csA) * R2} ${y + Math.sin(csA) * R2})`} />
    </g>
  );
};

/** 找东西：left 只有 1 个字母（容易），right 6 个相似字母（难）；两边都多出一个小方块（任务无关），hiLeft / hiRight 是方块被察觉的发光 */
export const SearchPair: React.FC<{f: number; at: number; atR: number}> = ({f, at, atR}) => {
  const panel = (cx: number, n: number, a: number, title: string, color: string) => {
    const o = clamp01((f - a) / 8);
    const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const letters = 'XNVZKW';
    return (
      <g opacity={o}>
        <rect x={cx - 300} y={260} width={600} height={460} fill="rgba(10,19,34,0.75)" stroke={color} strokeWidth={2} />
        <text x={cx} y={230} textAnchor="middle" fontFamily={TF.sans} fontSize={38} fill={color}>
          {title}
        </text>
        {Array.from({length: n}, (_, i) => (
          <text key={i} x={cx + (n === 1 ? 0 : Math.cos(ang(i)) * 110)} y={480 + (n === 1 ? 0 : Math.sin(ang(i)) * 110) + 18} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={50} fill={i === 0 ? T.cyan : T.text}>
            {letters[i]}
          </text>
        ))}
        <rect x={cx + 190} y={300} width={34} height={34} fill={T.orange} opacity={0.9} />
        <text x={cx + 207} y={372} textAnchor="middle" fontFamily={TF.sans} fontSize={22} fill={T.orange}>
          多出来的
        </text>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {panel(560, 1, at, '只找 1 个：容易', T.cyan)}
      {panel(1360, 6, atR, '在 6 个里找：难', T.red)}
      <text x={960} y={780} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.gray} opacity={clamp01((f - atR - 10) / 8)}>
        越难，越注意不到那个多出来的方块
      </text>
    </svg>
  );
};
