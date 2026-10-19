import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const EP04_W = 1920;
export const EP04_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep04-opus55/voice.wav',
  bgm: 'audio/ep04-opus55/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP04_W,
  h: EP04_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
};

/** 「Opus 5.5 的变化和使用技巧」横屏 16:9，像素风，A-roll + B-roll */
export const Ep04Opus55: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
