import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {M1Fridge, M1Sfx, M2Question, M2Sfx, M3Name, M3Sfx, M4Modes, M4Sfx, M5Sfx, M5Tiles} from './part1';
import {M10Check, M10Sfx, M11Bye, M11Sfx, M6Sfx, M6Sound, M7Sfx, M7Uses, M8Shot, M8Sfx, M9Photo, M9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: M1Fridge, sfx: M1Sfx},
  {from: lead(6), title: '', C: M2Question, sfx: M2Sfx},
  {from: lead(9), title: '', C: M3Name, sfx: M3Sfx},
  {from: lead(11), title: '模态 = 信息的形式', C: M4Modes, sfx: M4Sfx},
  {from: lead(19), title: '图片也会被切成积木', C: M5Tiles, sfx: M5Sfx},
  {from: lead(25), title: '声音也一样', C: M6Sound, sfx: M6Sfx},
  {from: lead(30), title: '', C: M7Uses, sfx: M7Sfx},
  {from: lead(33), title: '用法一：能截图就别打字', C: M8Shot, sfx: M8Sfx},
  {from: lead(39), title: '用法二：拍下来直接问', C: M9Photo, sfx: M9Sfx},
  {from: lead(44), title: '用法三：图要清楚，关键要核对', C: M10Check, sfx: M10Sfx},
  {from: lead(50), title: '', C: M11Bye, sfx: M11Sfx},
];
