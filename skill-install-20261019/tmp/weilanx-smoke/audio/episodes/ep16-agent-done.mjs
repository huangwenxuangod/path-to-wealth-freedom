// 第十六期「Agent 说做完了其实没做完」BGM → public/audio/ep16-agent-done/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：说改好了，一打开还是白屏
  [12.4, 'light'], // 它怎么判断做完了
  [15.6, 'groove'], // 循环要有停下来的依据
  [33.5, 'light'], // 刷墙的比喻、一把尺子
  [46.4, 'bright'], // 三个做法
  [81.2, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep16-agent-done');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
