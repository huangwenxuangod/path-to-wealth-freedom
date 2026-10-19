import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export const EP08_W = 1920;
export const EP08_H = 1080;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep08-hallucination/voice.wav',
  bgm: 'audio/ep08-hallucination/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP08_W,
  h: EP08_H,
  stage: {top: 110, h: 820},
  subY: 948,
  chapter: {y: 34, align: 'left'},
  look: 'sticker',
  keywords: ['AI 幻觉', '幻觉', '判例', '不确定', '出处', '核实'],
};

/** 「AI 幻觉」横屏 16:9，像素风贴纸，A-roll + B-roll */
export const Ep08Hallucination: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
