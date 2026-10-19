// 第十七期「AI 总说你说得对」BGM → public/audio/ep17-sycophancy/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'light'], // 钩子：正着问被夸，反着问又被顺着挑毛病
  [14.1, 'bright'], // 讨好倾向，爱拍马屁
  [19.0, 'groove'], // 打分训练：人更爱听顺耳话
  [33.5, 'tense'], // ChatGPT 更新被撤回
  [46.9, 'bright'], // 三个办法
  [79.2, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep17-sycophancy');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
