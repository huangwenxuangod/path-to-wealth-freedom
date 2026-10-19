import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep11Cover} from './scenes/Cover';

export const EP11_W = 1080;
export const EP11_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep11-mcp/voice.wav',
  bgm: 'audio/ep11-mcp/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP11_W,
  h: EP11_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['MCP', '模型上下文协议', '工具', '插座', 'USB-C', '连接器', '信得过', '关掉', '上下文'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep11Cover, frames: 8},
};

/** 「MCP」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep11Mcp: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
