// ep26 Opus 5.5 做视频（开场试片）BGM → public/audio/ep26-opus-video/bgm.wav（按人声包络自动闪避）
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 开场：本期主题、爆款视频
  [13, 'light'], // 你将收获什么
  [15.8, 'groove'], // 三个收获
  [48.5, 'bright'], // 点赞收藏
  [51, 'end'],
];
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep26-opus-video');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS, level: 0.05});
