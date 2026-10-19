// 第十期「多模态」BGM → public/audio/ep10-multimodal/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'light'], // 钩子：拍冰箱照片，它告诉你今晚做什么菜
  [15.1, 'bright'], // 引出多模态、模态是什么
  [34.0, 'groove'], // 图片和声音也切成积木
  [56.0, 'bright'], // 三个用法
  [79.6, 'light'], // 第三：它也会看错
  [91.5, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep10-multimodal');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
