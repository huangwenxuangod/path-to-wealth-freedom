import {cf} from '../cues';
import {S14Report, S14Sfx, S15Outro, S15Sfx} from './finale';
import {S1Chat, S1Sfx, S2Cage, S2Sfx, S3What, S3Sfx} from './intro';
import {S10Define, S10Sfx, S8Run, S8Sfx, S9Loop, S9Sfx} from './loop';
import {S11Ask, S11Sfx, S12Error, S12Sfx, S13Brief, S13Sfx} from './safety';
import {S4Desktop, S4Sfx, S5TalkOnly, S5Sfx, S6Tools, S6Sfx, S7Program, S7Sfx} from './setup';
import type {SceneDef} from '../../../library/types';

/** 场景比对应字幕早 6 帧入场，画面略领先于口播 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '普通 AI 的日常', C: S1Chat, sfx: S1Sfx},
  {from: lead(7), title: '只会说 vs 能动手', C: S2Cage, sfx: S2Sfx},
  {from: lead(11), title: '什么是 Agent？', C: S3What, sfx: S3Sfx},
  {from: lead(16), title: '任务：整理桌面', C: S4Desktop, sfx: S4Sfx},
  {from: lead(23), title: '只会聊天的模型', C: S5TalkOnly, sfx: S5Sfx},
  {from: lead(25), title: '第 1 步：接上工具', C: S6Tools, sfx: S6Sfx},
  {from: lead(30), title: '第 2 步：写个程序', C: S7Program, sfx: S7Sfx},
  {from: lead(39), title: '第 3 步：边看边做', C: S8Run, sfx: S8Sfx},
  {from: lead(50), title: '关键：接成循环', C: S9Loop, sfx: S9Sfx},
  {from: lead(57), title: 'AI Agent 是什么', C: S10Define, sfx: S10Sfx},
  {from: lead(61), title: '拿不准？问你', C: S11Ask, sfx: S11Sfx},
  {from: lead(68), title: '报错了怎么办', C: S12Error, sfx: S12Sfx},
  {from: lead(75), title: '交代任务的技巧', C: S13Brief, sfx: S13Sfx},
  {from: lead(80), title: '最后：交一份汇报', C: S14Report, sfx: S14Sfx},
  {from: lead(86), title: '这就是 Agent', C: S15Outro, sfx: S15Sfx},
];
