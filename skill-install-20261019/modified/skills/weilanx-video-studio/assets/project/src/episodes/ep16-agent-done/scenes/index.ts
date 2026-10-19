import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {D1Hook, D1Sfx, D2Sfx, D2Why, D3Loop, D3Sfx, D4Sfx, D4Wall} from './part1';
import {D5Sfx, D5Tips, D6Criteria, D6Sfx, D7SelfCheck, D7Sfx, D8Sfx, D8Spot, D9Bye, D9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: D1Hook, sfx: D1Sfx},
  {from: lead(10), title: '', C: D2Why, sfx: D2Sfx},
  {from: lead(12), title: '没有标准，它就提前收工', C: D3Loop, sfx: D3Sfx},
  {from: lead(24), title: '给它一把尺子', C: D4Wall, sfx: D4Sfx},
  {from: lead(33), title: '', C: D5Tips, sfx: D5Sfx},
  {from: lead(35), title: '做法一：写清验收标准', C: D6Criteria, sfx: D6Sfx},
  {from: lead(41), title: '做法二：让它自己跑一遍', C: D7SelfCheck, sfx: D7Sfx},
  {from: lead(47), title: '做法三：关键处自己抽查', C: D8Spot, sfx: D8Sfx},
  {from: lead(52), title: '', C: D9Bye, sfx: D9Sfx},
];
