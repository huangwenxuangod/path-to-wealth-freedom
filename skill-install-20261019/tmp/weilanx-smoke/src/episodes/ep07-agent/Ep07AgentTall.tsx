import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES_TALL} from './tall';
import {Ep07Cover} from './tall/Cover';

export const EP07T_W = 1080;
export const EP07T_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES_TALL,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep07-agent/voice.wav',
  bgm: 'audio/ep07-agent/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP07T_W,
  h: EP07T_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['Agent', '大模型', '工具', '循环', '目标', '标准'],
  // 第一句口播从第 11 帧开始，封面占前 6 帧，再用 6 帧淡出
  cover: {C: Ep07Cover, frames: 6},
};

/** 「Agent 是什么」竖屏 3:4 版，只有 CC 是像素风 */
export const Ep07AgentTall: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
