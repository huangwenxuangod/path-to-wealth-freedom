import React from 'react';
import {DoodlePaper} from '../../library/fx';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep02-llm/voice.wav',
  bgm: 'audio/ep02-llm/bgm.wav',
  Backdrop: DoodlePaper,
};

/** 「什么是大模型」竖屏口播动画 */
export const Ep02Llm: React.FC<{mix?: Mix}> = ({mix}) => <Show config={CONFIG} mix={mix} />;
