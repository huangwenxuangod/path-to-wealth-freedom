import React from 'react';
import type {Mix} from '../../library/Show';
import {VoxShow, type VoxShowConfig} from '../../library/vox/VoxShow';
import {cueAt, DURATION} from './cues';
import {Ep18Cover} from './Cover';
import {Film, FILM_SFX} from './film';

export const EP18_W = 1920;
export const EP18_H = 1080;

const CONFIG: VoxShowConfig = {
  Film,
  sfx: FILM_SFX,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep18-ai-history/voice.wav',
  bgm: 'audio/ep18-ai-history/bgm.wav',
  w: EP18_W,
  h: EP18_H,
  subY: 965,
  keywords: ['规则派', '学习派', '人工智能', '感知机', '寒冬', '反向传播', '深蓝', 'Transformer', 'ChatGPT', '诺贝尔'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep18Cover, frames: 8},
};

/** 「AI 七十年」Vox 拼贴解说，横屏 16:9，没有主持人 */
export const Ep18AiHistory: React.FC<{mix?: Mix}> = ({mix}) => <VoxShow config={CONFIG} mix={mix} />;
