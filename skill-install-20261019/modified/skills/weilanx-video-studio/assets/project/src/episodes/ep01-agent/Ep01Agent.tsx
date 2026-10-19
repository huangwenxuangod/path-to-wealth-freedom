import React from 'react';
import {Show, type Mix, type ShowConfig} from '../../library/Show';
import {cueAt, DURATION} from './cues';
import {SCENES} from './scenes';

export type {Mix};

const CONFIG: ShowConfig = {
  scenes: SCENES,
  duration: DURATION,
  cueAt,
  voice: 'audio/ep01-agent/voice.wav',
  bgm: 'audio/ep01-agent/bgm.wav',
};

export const Ep01Agent: React.FC<{mix?: Mix}> = ({mix}) => <Show config={CONFIG} mix={mix} />;
