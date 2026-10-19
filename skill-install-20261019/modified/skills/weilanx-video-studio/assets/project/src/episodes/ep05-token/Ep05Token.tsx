import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const EP05_W = 1920;
export const EP05_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep05-token/voice.wav',
  bgm: 'audio/ep05-token/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP05_W,
  h: EP05_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
  look: 'sticker',
  keywords: ['token', '积木', '上下文窗口', '失忆', '收钱', '新对话'],
};

/** 「token 是什么」横屏 16:9，像素风，A-roll + B-roll */
export const Ep05Token: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
