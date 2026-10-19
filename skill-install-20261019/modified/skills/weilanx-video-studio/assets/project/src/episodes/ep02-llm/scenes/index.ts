import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {L1Poem, L1Sfx, L2Sfx, L2Who, L3Guess, L3Sfx, L4OneByOne, L4Sfx, L5Read, L5Sfx, L6Master, L6Sfx} from './part1';
import {L10Sfx, L10Token, L11Bye, L11Sfx, L7Nonsense, L7Sfx, L8Guess, L8Sfx, L9Remember, L9Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场，画面略领先于口播 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '接个龙试试', C: L1Poem, sfx: L1Sfx},
  {from: lead(5), title: 'AI 背后是谁？', C: L2Who, sfx: L2Sfx},
  {from: lead(8), title: '核心本事：猜下一个字', C: L3Guess, sfx: L3Sfx},
  {from: lead(11), title: '一个字一个字往外蹦', C: L4OneByOne, sfx: L4Sfx},
  {from: lead(18), title: '为什么猜得准？', C: L5Read, sfx: L5Sfx},
  {from: lead(24), title: '接龙高手', C: L6Master, sfx: L6Sfx},
  {from: lead(26), title: '一本正经地胡说八道', C: L7Nonsense, sfx: L7Sfx},
  {from: lead(28), title: '它在猜，不是在查', C: L8Guess, sfx: L8Sfx},
  {from: lead(33), title: '一句话记住', C: L9Remember, sfx: L9Sfx},
  {from: lead(36), title: '偷偷告诉你', C: L10Token, sfx: L10Sfx},
  {from: lead(41), title: '下期再见', C: L11Bye, sfx: L11Sfx},
];
