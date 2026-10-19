import React from 'react';
import type {Mix} from '../../library/Show';
import {VoxShow, type VoxShowConfig} from '../../library/vox/VoxShow';
import {cueAt, DURATION} from './cues';
import {Ep21Cover} from './Cover';
import {Film, FILM_SFX} from './film';

export const EP21_W = 1920;
export const EP21_H = 1080;

const CONFIG: VoxShowConfig = {
  Film,
  sfx: FILM_SFX,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep21-nobel-physics/voice.wav',
  bgm: 'audio/ep21-nobel-physics/bgm.wav',
  w: EP21_W,
  h: EP21_H,
  subY: 965,
  keywords: ['中微子', '诺贝尔物理学奖', '哈尔岑', '幽灵粒子', '蓝光', '探测器', '冰立方', '黑洞', '新眼睛'],
  // 第一句口播从第 10 帧开始，封面占前 5 帧，再用 6 帧淡出
  cover: {C: Ep21Cover, frames: 5},
};

/** 「2026 诺贝尔物理学奖：南极冰下抓幽灵」Vox 拼贴，横屏 16:9：A-roll 黑卡大字 + B-roll 真实素材 */
export const Ep21NobelPhysics: React.FC<{mix?: Mix}> = ({mix}) => <VoxShow config={CONFIG} mix={mix} />;
