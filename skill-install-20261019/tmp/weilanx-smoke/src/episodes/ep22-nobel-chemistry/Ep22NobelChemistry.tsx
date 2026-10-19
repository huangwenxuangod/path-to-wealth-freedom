import React from 'react';
import type {Mix} from '../../library/Show';
import {VoxShow, type VoxShowConfig} from '../../library/vox/VoxShow';
import {cueAt, DURATION} from './cues';
import {Ep22Cover} from './Cover';
import {Film, FILM_SFX} from './film';

export const EP22_W = 1920;
export const EP22_H = 1080;

const CONFIG: VoxShowConfig = {
  Film,
  sfx: FILM_SFX,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep22-nobel-chemistry/voice.wav',
  bgm: 'audio/ep22-nobel-chemistry/bgm.wav',
  w: EP22_W,
  h: EP22_H,
  subY: 965,
  keywords: ['左手', '右手', '反应停', '镜像分子', '诺贝尔化学奖', '氨基酸', '卡冈', '硖合宪三', '99.99%', '偶然'],
  // 第一句口播从第 11 帧开始，封面占前 6 帧，再用 6 帧淡出
  cover: {C: Ep22Cover, frames: 6},
};

/** 「2026 诺贝尔化学奖：分子也分左右手」Vox 拼贴，横屏 16:9：A-roll 黑卡大字 + B-roll 真实素材 */
export const Ep22NobelChemistry: React.FC<{mix?: Mix}> = ({mix}) => <VoxShow config={CONFIG} mix={mix} />;
