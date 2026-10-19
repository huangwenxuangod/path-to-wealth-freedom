import React from 'react';
import {CharStyle} from '../../library/character/Char';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';
import {Ep12Cover} from './scenes/Cover';

export const EP12_W = 1080;
export const EP12_H = 1440;

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep12-skill/voice.wav',
  bgm: 'audio/ep12-skill/bgm.wav',
  Backdrop: DoodlePaper,
  w: EP12_W,
  h: EP12_H,
  stage: {top: 120, h: 1080},
  subY: 1250,
  chapter: {y: 34, align: 'center'},
  look: 'sticker',
  keywords: ['Skill', '技能说明书', '工作手册', 'MCP', '简介', '上下文', '反复交代', '边用边改'],
  // 第一句口播从第 11 帧开始，封面占前 6 帧，再用 6 帧淡出
  cover: {C: Ep12Cover, frames: 6},
};

/** 「Skill」竖屏 3:4，只有 CC 和 AI 小人是像素风 */
export const Ep12Skill: React.FC<{mix?: Mix}> = ({mix}) => (
  <CharStyle.Provider value="pixel">
    <Show config={CONFIG} mix={mix} />
  </CharStyle.Provider>
);
