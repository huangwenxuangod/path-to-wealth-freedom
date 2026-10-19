// 第十三期「子 Agent」BGM → public/audio/ep13-subagent/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：一个 AI 一家一家查，前面的都快忘了
  [7.0, 'bright'], // 叫上帮手同时开工
  [13.9, 'light'], // 引出子 Agent
  [17.8, 'groove'], // 总管拆活、派活、汇总；两个好处
  [53.6, 'tense'], // 花的钱也多：约十五倍 token
  [61.8, 'bright'], // 三个建议
  [94.5, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep13-subagent');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
