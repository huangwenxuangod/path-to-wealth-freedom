// 第五期「token 是什么」BGM → public/audio/ep05-token/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 小测验：strawberry 有几个 r
  [11, 'tense'], // AI 数不清字母
  [16.5, 'light'], // 开场，引出 token
  [24, 'groove'], // 切积木、strawberry、中文、逐块生成
  [58.5, 'light'], // 两件事
  [61, 'groove'], // 收钱、失忆
  [79, 'bright'], // 开个新对话
  [85.5, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep05-token');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
