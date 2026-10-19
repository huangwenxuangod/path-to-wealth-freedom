import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep10Cover} from './scenes/Cover';

export const EP10_W = 1080;
export const EP10_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep10-multimodal/voice.wav',
  bgm: 'audio/ep10-multimodal/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP10_W,
  h: EP10_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['多模态', '模态', '照片', '截图', 'token', '积木', '小方块', '看错', '核对'],
  // 第一句口播从第 16 帧开始，封面占前 11 帧，再用 6 帧淡出
  cover: {C: Ep10Cover, frames: 11},
};

/** 「多模态」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep10Multimodal: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
