// 「什么是大模型」BGM：比口播版更轻（整体低约 4dB，人声出现时压得更深），编曲更稀疏
// 运行：node audio/episodes/ep02-llm.mjs → public/audio/ep02-llm/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'break'], // 床前明月……留白，让诗句先出来
  [4, 'light'], // 恭喜你干了一次大模型的活
  [10, 'groove'], // 猜下一个字、一个字一个字往外蹦
  [26, 'light'], // 读了整个互联网
  [40, 'tense'], // 一本正经地胡说八道、幻觉
  [50, 'bright'], // 一句话记住：接龙高手
  [56, 'light'], // 偷偷告诉你：token
  [60, 'bright'], // 点赞收藏关注
  [62, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep02-llm');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS, level: 0.071, depth: 0.7});
