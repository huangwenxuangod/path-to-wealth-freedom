import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {S1Lawyer, S1Sfx, S2Name, S2Sfx, S3Guess, S3Sfx, S4Guessing, S4Sfx} from './part1';
import {S5Sfx, S5Tips, S6Source, S6Sfx, S7Sfx, S7Unsure, S8Verify, S8Sfx, S9Bye, S9Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场。钩子、A-roll 不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: S1Lawyer, sfx: S1Sfx},
  {from: lead(10), title: '', C: S2Name, sfx: S2Sfx},
  {from: lead(15), title: '它在猜，不在查', C: S3Guess, sfx: S3Sfx},
  {from: lead(26), title: '它不太会说不知道', C: S4Guessing, sfx: S4Sfx},
  {from: lead(34), title: '', C: S5Tips, sfx: S5Sfx},
  {from: lead(36), title: '做法一：给资料，照着答', C: S6Source, sfx: S6Sfx},
  {from: lead(41), title: '做法二：允许它说不知道', C: S7Unsure, sfx: S7Sfx},
  {from: lead(46), title: '做法三：要出处，自己核实', C: S8Verify, sfx: S8Sfx},
  {from: lead(51), title: '', C: S9Bye, sfx: S9Sfx},
];
