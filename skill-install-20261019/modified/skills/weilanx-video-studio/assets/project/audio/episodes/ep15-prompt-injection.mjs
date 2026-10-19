// 第十五期「提示词注入」BGM → public/audio/ep15-prompt-injection/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：网页里藏着看不见的命令
  [16.8, 'light'], // 引出提示词注入
  [19.9, 'groove'], // 为什么会中招：都是同一种文字
  [39.0, 'tense'], // 不只是理论：测试数据
  [53.6, 'light'], // 钥匙越多，破坏越大
  [60.6, 'bright'], // 三个建议
  [89.1, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep15-prompt-injection');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
