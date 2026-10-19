// ep27 Opus 5.5 做视频（完整版）BGM（1.12 倍速口播）→ public/audio/ep27-opus-video-full/bgm.wav（按人声包络自动闪避）
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'bright'], // 开场：本期主题、往期爆款
  [12.5, 'light'], // 三个收获
  [35.7, 'groove'], // 01 底层原理
  [107, 'light'], // 两个核心项目、今天的方案
  [130, 'groove'], // 02 环境准备 → 04 蒸馏 Skill
  [219, 'light'], // 05 润色调整
  [241, 'bright'], // 结尾
  [245.5, 'end'],
];
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep27-opus-video-full');
buildBgm({voice: join(dir, 'voice-1.12x.wav'), out: join(dir, 'bgm-1.12x.wav'), sections: SECTIONS, level: 0.05});
