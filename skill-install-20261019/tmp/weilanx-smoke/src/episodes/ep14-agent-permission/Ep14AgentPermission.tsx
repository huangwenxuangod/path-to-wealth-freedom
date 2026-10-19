import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep14Cover} from './scenes/Cover';

export const EP14_W = 1080;
export const EP14_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep14-agent-permission/voice.wav',
  bgm: 'audio/ep14-agent-permission/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP14_W,
  h: EP14_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['权限', '数据库', '钥匙', '确认', '闸门', '只读', '备份', '副本'],
  // 第一句口播从第 13 帧开始，封面占前 8 帧，再用 6 帧淡出
  cover: {C: Ep14Cover, frames: 8},
};

/** 「Agent 权限」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep14AgentPermission: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
