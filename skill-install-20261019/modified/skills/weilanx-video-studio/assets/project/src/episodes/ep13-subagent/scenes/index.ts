import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {A1Hook, A1Sfx, A2Name, A2Sfx, A3Flow, A3Sfx, A4Fast, A4Sfx, A5Desks, A5Sfx} from './part1';
import {A10Sfx, A10Small, A11Bye, A11Sfx, A6Cost, A6Sfx, A7Sfx, A7Tips, A8Sfx, A8Split, A9Brief, A9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: A1Hook, sfx: A1Sfx},
  {from: lead(9), title: '', C: A2Name, sfx: A2Sfx},
  {from: lead(12), title: '总管拆活，帮手去干', C: A3Flow, sfx: A3Sfx},
  {from: lead(21), title: '好处一：同时干', C: A4Fast, sfx: A4Sfx},
  {from: lead(25), title: '好处二：各有各的桌子', C: A5Desks, sfx: A5Sfx},
  {from: lead(34), title: '代价：更费 token', C: A6Cost, sfx: A6Sfx},
  {from: lead(39), title: '', C: A7Tips, sfx: A7Sfx},
  {from: lead(41), title: '建议一：能拆开的活才派', C: A8Split, sfx: A8Sfx},
  {from: lead(46), title: '建议二：派活时交代清楚', C: A9Brief, sfx: A9Sfx},
  {from: lead(51), title: '建议三：小活别叫帮手', C: A10Small, sfx: A10Sfx},
  {from: lead(56), title: '', C: A11Bye, sfx: A11Sfx},
];
