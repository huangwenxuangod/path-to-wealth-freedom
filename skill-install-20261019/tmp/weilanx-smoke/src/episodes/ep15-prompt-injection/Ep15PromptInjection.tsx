import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep15Cover} from './scenes/Cover';

export const EP15_W = 1080;
export const EP15_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep15-prompt-injection/voice.wav',
  bgm: 'audio/ep15-prompt-injection/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP15_W,
  h: EP15_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['提示词注入', '白底白字', '同一种文字', '上下文', '权限', '拒绝', '分开'],
  // 第一句口播从第 12 帧开始，封面占前 7 帧，再用 6 帧淡出
  cover: {C: Ep15Cover, frames: 7},
};

/** 「提示词注入」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep15PromptInjection: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
