import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep16Cover} from './scenes/Cover';

export const EP16_W = 1080;
export const EP16_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep16-agent-done/voice.wav',
  bgm: 'audio/ep16-agent-done/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP16_W,
  h: EP16_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['做完', '报错', '循环', '检查的标准', '尺子', '验收标准', '跑一遍', '抽查'],
  // 第一句口播从第 11 帧开始，封面占前 6 帧，再用 6 帧淡出
  cover: {C: Ep16Cover, frames: 6},
};

/** 「Agent 说做完了其实没做完」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep16AgentDone: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
