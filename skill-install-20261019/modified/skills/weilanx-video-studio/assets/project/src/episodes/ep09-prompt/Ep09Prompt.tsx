import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep09Cover} from './scenes/Cover';

export const EP09_W = 1080;
export const EP09_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep09-prompt/voice.wav',
  bgm: 'audio/ep09-prompt/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP09_W,
  h: EP09_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['提示词', 'Prompt', '任务说明书', '实习生', '套话', '目标', '背景和材料', '例子'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep09Cover, frames: 8},
};

/** 「提示词 Prompt」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep09Prompt: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
