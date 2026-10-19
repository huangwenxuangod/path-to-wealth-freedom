import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {C1Hook, C1Sfx, C2Name, C2Sfx, C3Mixed, C3Sfx, C4Data, C4Sfx, C5Keys, C5Sfx} from './part1';
import {C10Bye, C10Sfx, C6Sfx, C6Tips, C7NoPower, C7Sfx, C8Sfx, C8Stop, C9Separate, C9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: C1Hook, sfx: C1Sfx},
  {from: lead(10), title: '', C: C2Name, sfx: C2Sfx},
  {from: lead(12), title: '它分不清命令和内容', C: C3Mixed, sfx: C3Sfx},
  {from: lead(23), title: '不只是理论', C: C4Data, sfx: C4Sfx},
  {from: lead(30), title: '钥匙越多，破坏越大', C: C5Keys, sfx: C5Sfx},
  {from: lead(34), title: '', C: C6Tips, sfx: C6Sfx},
  {from: lead(36), title: '建议一：读陌生内容，别给大权限', C: C7NoPower, sfx: C7Sfx},
  {from: lead(41), title: '建议二：做了没让做的事就喊停', C: C8Stop, sfx: C8Sfx},
  {from: lead(46), title: '建议三：敏感账号分开用', C: C9Separate, sfx: C9Sfx},
  {from: lead(49), title: '', C: C10Bye, sfx: C10Sfx},
];
