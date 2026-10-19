import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {S1Declare, S1Sfx, S2Plan, S2Sfx, S3Index, S3Sfx, S4Frontier, S4Sfx, S5Quote, S5Sfx, S6Fast, S6Sfx, S7Steps, S7Sfx, S8Price, S8Sfx, S9Smart, S9Sfx} from './part1';
import {S10Sfx, S10Tips, S11Sfx, S11Think, S12Effort, S12Sfx, S13Rule, S13Sfx, S14Check, S14Sfx, S15Bye, S15Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场。A-roll 和同一章节的后续场景不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: S1Declare, sfx: S1Sfx},
  {from: lead(5), title: '', C: S2Plan, sfx: S2Sfx},
  {from: lead(10), title: '强：跑分第一', C: S3Index, sfx: S3Sfx},
  {from: lead(14), title: '', C: S4Frontier, sfx: S4Sfx},
  {from: lead(19), title: '', C: S5Quote, sfx: S5Sfx},
  {from: lead(21), title: '快：干活快', C: S6Fast, sfx: S6Sfx},
  {from: lead(26), title: '', C: S7Steps, sfx: S7Sfx},
  {from: lead(29), title: '便宜', C: S8Price, sfx: S8Sfx},
  {from: lead(34), title: '更懂事', C: S9Smart, sfx: S9Sfx},
  {from: lead(39), title: '', C: S10Tips, sfx: S10Sfx},
  {from: lead(41), title: '技巧一：别写「请仔细思考」', C: S11Think, sfx: S11Sfx},
  {from: lead(46), title: '技巧二：effort 不是越高越好', C: S12Effort, sfx: S12Sfx},
  {from: lead(53), title: '技巧三：删掉防加戏的话', C: S13Rule, sfx: S13Sfx},
  {from: lead(56), title: '技巧四：给它检查办法', C: S14Check, sfx: S14Sfx},
  {from: lead(60), title: '', C: S15Bye, sfx: S15Sfx},
];
