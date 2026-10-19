// 第八期「AI 幻觉」BGM → public/audio/ep08-hallucination/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：律师引用了编造的判例
  [14.3, 'light'], // 引出 AI 幻觉
  [22.4, 'groove'], // 猜不是查、不爱说不知道、高危区
  [57.1, 'bright'], // 三个做法
  [88.4, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep08-hallucination');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
