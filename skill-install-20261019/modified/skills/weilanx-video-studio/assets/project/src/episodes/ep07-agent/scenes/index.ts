import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {S1Hook, S1Sfx, S2Name, S2Sfx, S3Compare, S3Sfx, S4Parts, S4Sfx} from './part1';
import {S5Sfx, S5Tips, S6Goal, S6Sfx, S7Done, S7Sfx, S8Bye, S8Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场。钩子、A-roll 不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: S1Hook, sfx: S1Sfx},
  {from: lead(8), title: '', C: S2Name, sfx: S2Sfx},
  {from: lead(10), title: '聊天 AI 和 Agent 差在哪', C: S3Compare, sfx: S3Sfx},
  {from: lead(24), title: 'Agent = 大模型 + 工具 + 循环', C: S4Parts, sfx: S4Sfx},
  {from: lead(35), title: '', C: S5Tips, sfx: S5Sfx},
  {from: lead(37), title: '建议一：说清目标', C: S6Goal, sfx: S6Sfx},
  {from: lead(43), title: '建议二：给它做完的标准', C: S7Done, sfx: S7Sfx},
  {from: lead(49), title: '', C: S8Bye, sfx: S8Sfx},
];
