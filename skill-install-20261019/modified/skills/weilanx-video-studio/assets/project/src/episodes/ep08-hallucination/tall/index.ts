import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {V1Lawyer, V1Sfx, V2Name, V2Sfx, V3Guess, V3Sfx, V4Guessing, V4Sfx} from './part1';
import {V5Sfx, V5Tips, V6Source, V6Sfx, V7Sfx, V7Unsure, V8Sfx, V8Verify, V9Bye, V9Sfx} from './part2';

/** 竖屏 3:4 版场景表：和横屏版同一套字幕与切点，版式重新排 */
const lead = (n: number) => cf(n) - 6;

export const SCENES_TALL: SceneDef[] = [
  {from: 0, title: '', C: V1Lawyer, sfx: V1Sfx},
  {from: lead(10), title: '', C: V2Name, sfx: V2Sfx},
  {from: lead(15), title: '它在猜，不在查', C: V3Guess, sfx: V3Sfx},
  {from: lead(26), title: '它不太会说不知道', C: V4Guessing, sfx: V4Sfx},
  {from: lead(34), title: '', C: V5Tips, sfx: V5Sfx},
  {from: lead(36), title: '做法一：给资料，照着答', C: V6Source, sfx: V6Sfx},
  {from: lead(41), title: '做法二：允许它说不知道', C: V7Unsure, sfx: V7Sfx},
  {from: lead(46), title: '做法三：要出处，自己核实', C: V8Verify, sfx: V8Sfx},
  {from: lead(51), title: '', C: V9Bye, sfx: V9Sfx},
];
