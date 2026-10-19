// 第十二期「Skill」BGM → public/audio/ep12-skill/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'light'], // 钩子：一句话做完一整期视频
  [14.8, 'bright'], // 引出 Skill 技能说明书
  [19.4, 'groove'], // 和 MCP 的区别、工作手册、我的 Skill
  [44.3, 'light'], // 会不会塞满上下文：只看简介
  [58.4, 'bright'], // 三个建议
  [87.6, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep12-skill');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
