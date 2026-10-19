import React from 'react';
import {clamp01, easeInOut} from '../../library/anim';
import {DeskShow, type DeskMix, type DeskShowConfig} from '../../library/warm-desk/DeskShow';
import {HostCam} from '../../library/warm-desk/HostCam';
import {HOST} from './assets';
import {Ep27CoverWide} from './Cover';
import {cf, cueAt, DURATION} from './cues';
import {SCENES, STEPS} from './scenes';

export const EP27_W = 1920;
export const EP27_H = 1080;

/**
 * 出镜小窗的三种姿态（左下角对齐，底边都在 y=920，字幕在下面）：
 * A 人在说重点 470；B 讲解配图 280；F 全屏 B-roll，小窗缩小、向左滑出画面并淡出。
 */
const POSE = {A: {x: 56, size: 470, o: 1}, B: {x: 44, size: 280, o: 1}, F: {x: -330, size: 280, o: 0}};
const BOTTOM = 920;
const TURN = 14;

/** 第 f 帧小窗的位置、边长和不透明度：每个场景开始时 14 帧内从上一个姿态过渡到这个姿态 */
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
  return {x: prev.x + (cur.x - prev.x) * p, y: BOTTOM - size, size, o: prev.o + (cur.o - prev.o) * p};
};

const Cam: React.FC<{f: number}> = ({f}) => {
  const c = camAt(f);
  if (c.o <= 0.01) return null;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: c.o}}>
      <HostCam src={HOST} x={c.x} y={c.y} size={c.size} radius={16} name="蔚蓝" role={c.size > 420 ? 'AI 实战分享' : undefined} f={f} />
    </div>
  );
};

const CONFIG: DeskShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep27-opus-video-full/voice-1.12x.m4a',
  bgm: 'audio/ep27-opus-video-full/bgm-1.12x.m4a',
  bgmVolume: 0.85,
  steps: STEPS,
  overlay: Cam,
  mascot: {x: 1700, y: 1000, s: 0.75},
  decor: [
    [0, 420, 560, 520],
    [120, 110, 1680, 820],
  ],
  // 第一句口播 0.12 秒就开始，封面只占第 0 帧（平台取首帧），随后 6 帧淡出
  cover: {C: Ep27CoverWide, frames: Math.max(1, cf(1) - 5)},
};

/** Opus 5.5 做视频（完整版 4 分 37 秒）：暖纸工作台风，左下角真人出镜小窗，A-roll / B-roll / 全屏 B-roll 三种镜头，五步 */
export const Ep27OpusVideoFull: React.FC<{mix?: DeskMix}> = ({mix}) => <DeskShow config={CONFIG} mix={mix} />;
