import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Dummy, Tone} from '../../library/tactical/range';
import {T} from '../../library/tactical/theme';
import {JIG_BACK, JIG_HOLD, JIG_OUT, SHOOT_AFTER} from './timeline';

/**
 * ep48 各段画面。组件都拿帧号，自己按 timeline 的拍子算出场时间。
 */

/** 他躲的箱子（x 0.2–1.8，高 1.9 米，比人头高）和场地 */
const COVER: Box = {x: 1.0, z: 9, w: 1.6, h: 1.9, d: 1.2};
const YARD: Box[] = [COVER, {x: -4.2, z: 14, w: 2, h: 1.4, crate: true}, {x: 4.6, z: 16, w: 2, h: 2}, {x: -1.6, z: 19, w: 2.2, h: 1.2, crate: true}];
const Z = 9.9;
const HIDDEN_X = 1.3;
const OUT_X = -0.3;
const CAM = {x: 0, z: 0, y: 1.6, yaw: 0};
/** 他探出来时头在屏幕上的位置（准星提前停在这里） */
export const PEEK_HEAD = project([OUT_X, 1.53, Z], CAM) ?? [930, 547];
/** 没提前架好时准星停的地方（偏左一块空地） */
const REST: [number, number] = [700, 560];

/** 一次晃身位的露出程度 0–1：探出 JIG_OUT 帧、停 JIG_HOLD 帧、缩回 JIG_BACK 帧 */
export const jiggle = (vf: number, at: number) => {
  const t = vf - at;
  if (t < 0) return 0;
  if (t < JIG_OUT) return t / JIG_OUT;
  if (t < JIG_OUT + JIG_HOLD) return 1;
  if (t < JIG_OUT + JIG_HOLD + JIG_BACK) return 1 - (t - JIG_OUT - JIG_HOLD) / JIG_BACK;
  return 0;
};

/**
 * 第一人称架点。vf 是画面用的帧（慢放时传放慢后的帧）；jigs 是晃身位的开始帧；wideAt 起他整个人走出来不回去。
 * preAim：准星提前停在他会出来的位置；否则准星停在左边，看见他之后才甩过去（每次晃身位后 SHOOT_AFTER 帧开枪，打空）。
 * kill 给了就在那一帧爆头（他倒下）
 */
export const PeekView: React.FC<{vf: number; jigs?: number[]; wideAt?: number; preAim?: boolean; tone?: Tone; dead?: boolean; kill?: number; showMiss?: boolean}> = ({vf, jigs = [], wideAt, preAim = false, tone = 'blue', dead = false, kill, showMiss = true}) => {
  const exp = Math.max(...jigs.map((a) => jiggle(vf, a)), wideAt !== undefined ? easeOut(clamp01((vf - wideAt) / 4)) : 0, 0);
  const killed = kill !== undefined && vf >= kill + 2;
  const enemy: Dummy = {x: HIDDEN_X + (OUT_X - HIDDEN_X) * exp, z: Z, state: killed ? 'dead' : kill !== undefined && vf >= kill ? 'hit' : 'idle'};
  // 准星：没架好时，每次晃身位后第 10 帧开始甩向他露头的位置，4 帧甩到，开枪后慢慢回来
  let cross: [number, number] = preAim ? [PEEK_HEAD[0], PEEK_HEAD[1]] : REST;
  const lastJig = jigs.filter((a) => vf >= a).pop();
  let shotAt: number | undefined;
  if (!preAim && lastJig !== undefined) {
    const t = vf - lastJig;
    const go = easeOut(clamp01((t - 10) / 3)) * (1 - clamp01((t - SHOOT_AFTER - 6) / 10));
    cross = [REST[0] + (PEEK_HEAD[0] + 14 - REST[0]) * go, REST[1] + (PEEK_HEAD[1] - REST[1]) * go];
    if (t >= SHOOT_AFTER) shotAt = lastJig + SHOOT_AFTER;
  }
  if (kill !== undefined && vf >= kill) shotAt = kill;
  const kick = shotAt !== undefined ? Math.max(0, 1 - (vf - shotAt) / 6) : 0;
  const warm = tone === 'warm';
  const cc = warm ? '#ffd9a8' : T.cyan;
  return (
    <>
      <Range cam={CAM} tone={tone} boxes={YARD} dummies={[enemy]} wallZ={24} />
      <Crosshair x={cross[0]} y={cross[1]} color={cc} />
      {shotAt !== undefined ? (
        <>
          <Tracer to={cross} t={vf - shotAt} />
          {kill !== undefined && shotAt === kill ? (
            <HitMark f={vf} at={shotAt} x={cross[0]} y={cross[1]} text="HEADSHOT" color={warm ? '#ffd9a8' : '#ffffff'} />
          ) : showMiss ? (
            <HitMark f={vf} at={shotAt} x={cross[0]} y={cross[1]} text="MISS" color={T.red} />
          ) : null}
        </>
      ) : null}
      <ViewGun sway={dead ? 0 : Math.sin(vf / 9) * 0.5} kick={kick} tone={tone} />
    </>
  );
};

/** 他的视角：站在箱子左边探出来的位置看向你（你是青色人靶），准星已经压在你头上 */
export const EnemyEye: React.FC = () => {
  const cam = {x: OUT_X, z: Z, y: 1.6, yaw: Math.atan2(0 - OUT_X, 0 - Z)};
  const you = project([0, 1.53, 0], cam) ?? [960, 540];
  return (
    <>
      <Range cam={cam} tone="red" boxes={YARD} dummies={[{x: 0, z: 0, color: T.cyan}]} wallZ={-6} />
      <Crosshair x={you[0]} y={you[1]} color={T.red} />
    </>
  );
};
