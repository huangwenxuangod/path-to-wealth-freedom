// 第六期「上下文 context 是什么」BGM → public/audio/ep06-context/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 钩子：聊着聊着就变笨
  [8, 'light'], // 引出上下文
  [16.7, 'groove'], // 办公桌、窗口、塞多了看不清
  [58, 'light'], // 管好这张桌子
  [62.4, 'groove'], // 三个做法
  [87.8, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep06-context');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
