import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES_TALL} from './tall';
import {Ep08Cover} from './tall/Cover';

export const EP08T_W = 1080;
export const EP08T_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES_TALL,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep08-hallucination/voice.wav',
  bgm: 'audio/ep08-hallucination/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP08T_W,
  h: EP08T_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['AI 幻觉', '幻觉', '判例', '不确定', '出处', '核实'],
  // 第一句口播从第 16 帧开始，封面占前 11 帧，再用 6 帧淡出
  cover: {C: Ep08Cover, frames: 11},
};

/** 「AI 幻觉」竖屏 3:4 版，只有 CC 是像素风 */
export const Ep08HallucinationTall: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
