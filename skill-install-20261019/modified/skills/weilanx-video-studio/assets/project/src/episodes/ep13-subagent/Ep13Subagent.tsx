import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep13Cover} from './scenes/Cover';

export const EP13_W = 1080;
export const EP13_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep13-subagent/voice.wav',
  bgm: 'audio/ep13-subagent/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP13_W,
  h: EP13_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['子 Agent', '多 Agent', '总管', '帮手', '上下文', '办公桌', '十五倍', '交代清楚'],
  // 第一句口播从第 12 帧开始，封面占前 7 帧，再用 6 帧淡出
  cover: {C: Ep13Cover, frames: 7},
};

/** 「子 Agent」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep13Subagent: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
