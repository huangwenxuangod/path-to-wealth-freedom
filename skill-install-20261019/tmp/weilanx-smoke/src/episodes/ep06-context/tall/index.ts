import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {T1Hook, T1Sfx, T2Reveal, T2Sfx, T3Desk, T3Sfx, T4Sfx, T4Window, T5Middle, T5Sfx} from './part1';
import {T10Bye, T10Sfx, T6Sfx, T6Tips, T7Give, T7Sfx, T8One, T8Sfx, T9Summary, T9Sfx} from './part2';

/** 竖屏 3:4 版场景表：和横屏版同一套字幕与切点，版式重新排 */
const lead = (n: number) => cf(n) - 6;

export const SCENES_TALL: SceneDef[] = [
  {from: 0, title: '', C: T1Hook, sfx: T1Sfx},
  {from: lead(7), title: '', C: T2Reveal, sfx: T2Sfx},
  {from: lead(12), title: '上下文是什么', C: T3Desk, sfx: T3Sfx},
  {from: lead(24), title: '上下文窗口', C: T4Window, sfx: T4Sfx},
  {from: lead(32), title: '塞得越多，不一定看得越清', C: T5Middle, sfx: T5Sfx},
  {from: lead(38), title: '', C: T6Tips, sfx: T6Sfx},
  {from: lead(41), title: '做法一：主动放上去', C: T7Give, sfx: T7Sfx},
  {from: lead(46), title: '做法二：一个对话一件事', C: T8One, sfx: T8Sfx},
  {from: lead(49), title: '做法三：总结后换新对话', C: T9Summary, sfx: T9Sfx},
  {from: lead(54), title: '', C: T10Bye, sfx: T10Sfx},
];
