import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES_TALL} from './tall';
import {Ep06Cover} from './tall/Cover';

export const EP06T_W = 1080;
export const EP06T_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES_TALL,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep06-context/voice.wav',
  bgm: 'audio/ep06-context/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP06T_W,
  h: EP06T_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['上下文窗口', '上下文', 'context', '办公桌', '新对话', 'token'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep06Cover, frames: 8},
};

/** 「上下文 context 是什么」竖屏 3:4 版，只有 CC 是像素风 */
export const Ep06ContextTall: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
