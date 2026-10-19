import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {U1Hook, U1Sfx, U2Name, U2Sfx, U3Compare, U3Sfx, U4Parts, U4Sfx} from './part1';
import {U5Sfx, U5Tips, U6Goal, U6Sfx, U7Done, U7Sfx, U8Bye, U8Sfx} from './part2';

/** 竖屏 3:4 版场景表：和横屏版同一套字幕与切点，版式重新排 */
const lead = (n: number) => cf(n) - 6;

export const SCENES_TALL: SceneDef[] = [
  {from: 0, title: '', C: U1Hook, sfx: U1Sfx},
  {from: lead(8), title: '', C: U2Name, sfx: U2Sfx},
  {from: lead(10), title: '聊天 AI 和 Agent 差在哪', C: U3Compare, sfx: U3Sfx},
  {from: lead(24), title: 'Agent = 大模型 + 工具 + 循环', C: U4Parts, sfx: U4Sfx},
  {from: lead(35), title: '', C: U5Tips, sfx: U5Sfx},
  {from: lead(37), title: '建议一：说清目标', C: U6Goal, sfx: U6Sfx},
  {from: lead(43), title: '建议二：给它做完的标准', C: U7Done, sfx: U7Sfx},
  {from: lead(49), title: '', C: U8Bye, sfx: U8Sfx},
];
