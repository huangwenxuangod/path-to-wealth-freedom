// 第九期「提示词 Prompt」BGM → public/audio/ep09-prompt/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：同一个 AI，一份废话一份能交差
  [12.0, 'light'], // 引出提示词 = 任务说明书
  [22.0, 'groove'], // 实习生比喻、一句话只能猜
  [39.7, 'bright'], // 三个做法
  [77.0, 'light'], // 回头看看自己的说明书
  [87.6, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep09-prompt');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
