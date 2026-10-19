import React from 'react';
import type {Mix} from '../../library/Show';
import {VoxShow, type VoxShowConfig} from '../../library/vox/VoxShow';
import {cueAt, DURATION} from './cues';
import {Ep19Cover} from './Cover';
import {Film, FILM_SFX} from './film';

export const EP19_W = 1920;
export const EP19_H = 1080;

const CONFIG: VoxShowConfig = {
  Film,
  sfx: FILM_SFX,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep19-apple-history/voice.wav',
  bgm: 'audio/ep19-apple-history/bgm.wav',
  w: EP19_W,
  h: EP19_H,
  subY: 965,
  keywords: ['乔布斯', '沃兹尼亚克', '麦金塔', '斯卡利', 'NeXT', '微软', 'iMac', 'iPod', 'iPhone', 'App Store', '库克', '特努斯', '5 万亿', '把它关掉'],
  // 第一句口播从第 14 帧开始，封面占前 9 帧，再用 6 帧淡出
  cover: {C: Ep19Cover, frames: 9},
};

/** 「苹果 50 年」Vox 拼贴解说，横屏 16:9，没有主持人 */
export const Ep19AppleHistory: React.FC<{mix?: Mix}> = ({mix}) => <VoxShow config={CONFIG} mix={mix} />;
