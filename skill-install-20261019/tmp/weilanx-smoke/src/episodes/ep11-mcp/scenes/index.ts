import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {S1Hook, S1Sfx, S2Name, S2Sfx, S3Recap, S3Sfx, S4Sfx, S4Tangle, S5Sfx, S5Socket} from './part1';
import {S10Off, S10Sfx, S11Bye, S11Sfx, S6Flow, S6Sfx, S7Sfx, S7Tips, S8Connect, S8Sfx, S9Sfx, S9Trust} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: S1Hook, sfx: S1Sfx},
  {from: lead(8), title: '', C: S2Name, sfx: S2Sfx},
  {from: lead(11), title: 'Agent 离不开工具', C: S3Recap, sfx: S3Sfx},
  {from: lead(15), title: '以前：一个一个单独接', C: S4Tangle, sfx: S4Sfx},
  {from: lead(22), title: 'MCP = 统一的插座', C: S5Socket, sfx: S5Sfx},
  {from: lead(31), title: '插上之后发生了什么', C: S6Flow, sfx: S6Sfx},
  {from: lead(39), title: '', C: S7Tips, sfx: S7Sfx},
  {from: lead(41), title: '建议一：把常用的接上', C: S8Connect, sfx: S8Sfx},
  {from: lead(45), title: '建议二：只装信得过的', C: S9Trust, sfx: S9Sfx},
  {from: lead(49), title: '建议三：用不到就关掉', C: S10Off, sfx: S10Sfx},
  {from: lead(54), title: '', C: S11Bye, sfx: S11Sfx},
];
