import React from 'react';
import type {Mix} from '../../library/Show';
import {VoxShow, type VoxShowConfig} from '../../library/vox/VoxShow';
import {cueAt, DURATION} from './cues';
import {Ep20Cover} from './Cover';
import {Film, FILM_SFX} from './film';

export const EP20_W = 1920;
export const EP20_H = 1080;

const CONFIG: VoxShowConfig = {
  Film,
  sfx: FILM_SFX,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep20-nvidia-history/voice.wav',
  bgm: 'audio/ep20-nvidia-history/bgm.wav',
  w: EP20_W,
  h: EP20_H,
  subY: 965,
  keywords: ['英伟达', '黄仁勋', '30 天', 'NV1', '世嘉', 'RIVA 128', 'GPU', 'CUDA', 'OpenAI', 'ChatGPT', '5 万亿', '5.8 万亿'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep20Cover, frames: 8},
};

/** 「英伟达 33 年」Vox 拼贴解说，横屏 16:9，没有主持人 */
export const Ep20NvidiaHistory: React.FC<{mix?: Mix}> = ({mix}) => <VoxShow config={CONFIG} mix={mix} />;
