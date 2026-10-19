// 第一期「什么是 Agent」BGM：public/audio/ep01-agent/voice.wav → bgm.wav
// 这一期做的时候用户还没提出「BGM 要轻」，所以沿用当时的音量（level 0.135、depth 0.62）
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

/** 段落表：[开始秒, 风格]。风格按小节起点生效 */
const SECTIONS = [
  [0, 'light'],
  [10, 'groove'],
  [28, 'light'],
  [42, 'groove'],
  [96, 'bright'],
  [116, 'break'],
  [130, 'tense'],
  [143, 'groove'],
  [152, 'bright'],
  [164, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep01-agent');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS, level: 0.135, depth: 0.62});
