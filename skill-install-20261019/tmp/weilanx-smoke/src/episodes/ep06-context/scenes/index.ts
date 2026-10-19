import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {S1Hook, S1Sfx, S2Reveal, S2Sfx, S3Desk, S3Sfx, S4Sfx, S4Window, S5Middle, S5Sfx} from './part1';
import {S10Bye, S10Sfx, S6Sfx, S6Tips, S7Give, S7Sfx, S8One, S8Sfx, S9Summary, S9Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场。钩子、A-roll 不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: S1Hook, sfx: S1Sfx},
  {from: lead(7), title: '', C: S2Reveal, sfx: S2Sfx},
  {from: lead(12), title: '上下文是什么', C: S3Desk, sfx: S3Sfx},
  {from: lead(24), title: '上下文窗口', C: S4Window, sfx: S4Sfx},
  {from: lead(32), title: '塞得越多，不一定看得越清', C: S5Middle, sfx: S5Sfx},
  {from: lead(38), title: '', C: S6Tips, sfx: S6Sfx},
  {from: lead(41), title: '做法一：主动放上去', C: S7Give, sfx: S7Sfx},
  {from: lead(46), title: '做法二：一个对话一件事', C: S8One, sfx: S8Sfx},
  {from: lead(49), title: '做法三：总结后换新对话', C: S9Summary, sfx: S9Sfx},
  {from: lead(54), title: '', C: S10Bye, sfx: S10Sfx},
];
