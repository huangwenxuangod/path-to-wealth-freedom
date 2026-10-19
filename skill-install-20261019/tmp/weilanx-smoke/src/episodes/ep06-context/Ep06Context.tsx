import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const EP06_W = 1920;
export const EP06_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep06-context/voice.wav',
  bgm: 'audio/ep06-context/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP06_W,
  h: EP06_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
  look: 'sticker',
  keywords: ['上下文窗口', '上下文', 'context', '办公桌', '新对话', 'token'],
};

/** 「上下文 context 是什么」横屏 16:9，像素风贴纸，A-roll + B-roll */
export const Ep06Context: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
