// 「用 CC 做动画视频」BGM：沿用轻音量偏好（level 0.071，人声出现时压低 0.7）
// 运行：node audio/episodes/ep03-cc.mjs → public/audio/ep03-cc/bgm.wav
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildBgm} from '../bgm.mjs';

const SECTIONS = [
  [0, 'light'], // 开场、回顾前两期
  [12, 'groove'], // 本质：Remotion 画画面、字幕驱动
  [62, 'bright'], // 想清楚两点，做起来就很简单：打开 CC
  [80, 'groove'], // 分镜、写代码、合成音乐、Studio 预览、提意见
  [118, 'break'], // 提醒：CC 听不到声音
  [126, 'bright'], // 导出成片和分轨
  [138, 'light'], // 分工的感受、给新手的建议
  [162, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep03-cc');
buildBgm({voice: join(dir, 'voice.wav'), out: join(dir, 'bgm.wav'), sections: SECTIONS, level: 0.071, depth: 0.7});
