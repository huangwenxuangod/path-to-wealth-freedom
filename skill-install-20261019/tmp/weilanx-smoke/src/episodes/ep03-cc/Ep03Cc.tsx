import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const CC_W = 1920;
export const CC_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep03-cc/voice.wav',
  bgm: 'audio/ep03-cc/bgm.wav',
  Backdrop: DoodlePaper,
  w: CC_W,
  h: CC_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
};

/** 「用 CC 做手绘动画口播」横屏 16:9，A-roll 主持人 + B-roll 演示 */
export const Ep03Cc: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
