// 第十四期「Agent 权限」BGM → public/audio/ep14-agent-permission/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'tense'], // 钩子：AI 编程助手删了线上数据库
  [15.7, 'light'], // 引出 Agent 的权限
  [20.1, 'groove'], // 能动手、钥匙越多闯祸越大
  [41.3, 'light'], // 确认机制：最后一道闸门
  [53.3, 'bright'], // 三个建议
  [87.7, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep14-agent-permission');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
