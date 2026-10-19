// 第十一期「MCP」BGM → public/audio/ep11-mcp/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'light'], // 钩子：以前访问不了日历，现在能读能改
  [13.1, 'bright'], // 引出 MCP
  [17.8, 'groove'], // 工具要一个个单独对接，充电线比喻
  [37.1, 'bright'], // 统一的插座、USB-C
  [52.7, 'light'], // 插上之后怎么工作
  [64.0, 'bright'], // 三个建议
  [90.1, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep11-mcp');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS});
