import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep17Cover} from './scenes/Cover';

export const EP17_W = 1080;
export const EP17_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep17-sycophancy/voice.wav',
  bgm: 'audio/ep17-sycophancy/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP17_W,
  h: EP17_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['讨好倾向', '拍马屁', '顺耳', '顺着你', '表态', '挑毛病', '唱反调', '再问一遍'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep17Cover, frames: 8},
};

/** 「AI 总说你说得对」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep17Sycophancy: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
