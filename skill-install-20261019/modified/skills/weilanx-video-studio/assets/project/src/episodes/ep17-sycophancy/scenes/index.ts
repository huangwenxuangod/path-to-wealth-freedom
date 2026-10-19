import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {E1Hook, E1Sfx, E2Name, E2Sfx, E3Sfx, E3Why, E4Incident, E4Sfx} from './part1';
import {E5Sfx, E5Tips, E6NoStance, E6Sfx, E7Critic, E7Sfx, E8Flip, E8Sfx, E9Bye, E9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: E1Hook, sfx: E1Sfx},
  {from: lead(10), title: '', C: E2Name, sfx: E2Sfx},
  {from: lead(13), title: '为什么它爱顺着你', C: E3Why, sfx: E3Sfx},
  {from: lead(23), title: '连 AI 公司都头疼', C: E4Incident, sfx: E4Sfx},
  {from: lead(32), title: '', C: E5Tips, sfx: E5Sfx},
  {from: lead(34), title: '办法一：问之前别先表态', C: E6NoStance, sfx: E6Sfx},
  {from: lead(41), title: '办法二：直接让它挑毛病', C: E7Critic, sfx: E7Sfx},
  {from: lead(47), title: '办法三：换个说法再问', C: E8Flip, sfx: E8Sfx},
  {from: lead(52), title: '', C: E9Bye, sfx: E9Sfx},
];
