import React from 'react';
import {clamp01, easeInOut} from '../../library/anim';
import {DeskShow, type DeskMix, type DeskShowConfig} from '../../library/warm-desk/DeskShow';
import {HostCam} from '../../library/warm-desk/HostCam';
import {Ep26CoverWide} from './Cover';
import {cf, cueAt, DURATION} from './cues';
import {SCENES, STEPS} from './scenes';

export const EP26_W = 1920;
export const EP26_H = 1080;

/** 出镜小窗的两种姿态：A-roll 大（人物是主角），B-roll 小（卡片是主角）；左下角对齐，底边都在 y=920（字幕在下面） */
const POSE = {A: {x: 60, size: 540}, B: {x: 46, size: 330}};
const BOTTOM = 920;
const TURN = 12;

/** 第 f 帧小窗的边长和位置：在每个场景开始时 12 帧内从上一个姿态过渡到这个姿态 */
export const camAt = (f: number) => {
  let prev = POSE[SCENES[0].roll];
  let cur = prev;
  let from = 0;
  for (let i = 0; i < SCENES.length && SCENES[i].from <= f; i++) {
    prev = cur;
    cur = POSE[SCENES[i].roll];
    from = SCENES[i].from;
  }
  const p = easeInOut(clamp01((f - from) / TURN));
  const size = prev.size + (cur.size - prev.size) * p;
  const x = prev.x + (cur.x - prev.x) * p;
  return {x, y: BOTTOM - size, size};
};

const Cam: React.FC<{f: number}> = ({f}) => {
  const c = camAt(f);
  return <HostCam src="footage/ep26-opus-video/host.mp4" x={c.x} y={c.y} size={c.size} radius={16} name="蔚蓝" role={c.size > 450 ? 'AI 实战分享' : undefined} f={f} />;
};

const CONFIG: DeskShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep26-opus-video/voice.wav',
  bgm: 'audio/ep26-opus-video/bgm.wav',
  steps: STEPS,
  overlay: Cam,
  mascot: {x: 1700, y: 1000, s: 0.75},
  bgmVolume: 0.85,
  decor: [[0, 340, 640, 620], [440, 120, 1040, 780]],
  cover: {C: Ep26CoverWide, frames: cf(1) - 5},
};

/** Opus 5.5 做视频（开场 52 秒试片）：暖纸工作台风，左下角真人出镜小窗，A-roll / B-roll 交替 */
export const Ep26OpusVideo: React.FC<{mix?: DeskMix}> = ({mix}) => <DeskShow config={CONFIG} mix={mix} />;
