// 第七期「Agent 是什么」BGM → public/audio/ep07-agent/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 钩子：视频是 AI 自己做的
  [12.3, 'light'], // 引出 Agent
  [16, 'groove'], // 对比、拆解
  [56.7, 'light'], // 两个建议
  [59.8, 'groove'], // 建议一、二
  [81.4, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep07-agent');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
