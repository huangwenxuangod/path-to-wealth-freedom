import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const EP07_W = 1920;
export const EP07_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep07-agent/voice.wav',
  bgm: 'audio/ep07-agent/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP07_W,
  h: EP07_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
  look: 'sticker',
  keywords: ['Agent', '大模型', '工具', '循环', '目标', '标准'],
};

/** 「Agent 是什么」横屏 16:9，像素风贴纸，A-roll + B-roll */
export const Ep07Agent: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
