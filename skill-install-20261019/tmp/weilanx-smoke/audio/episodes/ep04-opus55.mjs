// 第四期「Opus 5.5：最强甜点模型」BGM → public/audio/ep04-opus55/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 我宣布：最强甜点模型
  [13, 'groove'], // 强、快、便宜、更懂事
  [62.5, 'light'], // 怎么用好它
  [65.5, 'groove'], // 四个技巧
  [104, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep04-opus55');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
