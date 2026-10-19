import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {A3Intro, A3Sfx, B4Cut, B4Sfx, B5Straw, B5Sfx, B6Chinese, B6Sfx, Q1Quiz, Q1Sfx, Q2Blind, Q2Sfx} from './part1';
import {A12Bye, A12Sfx, A8Sfx, A8Two, B10Sfx, B10Window, B11Fresh, B11Sfx, B7Gen, B7Sfx, B9Bill, B9Sfx} from './part2';

/** 场景比对应字幕早 6 帧入场（测验的结尾和数错 r 的笑点各多留一点时间）。A-roll 和开头测验不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: Q1Quiz, sfx: Q1Sfx},
  {from: cf(9) - 6, title: '', C: Q2Blind, sfx: Q2Sfx},
  {from: lead(12), title: '', C: A3Intro, sfx: A3Sfx},
  {from: lead(16), title: 'token 是什么', C: B4Cut, sfx: B4Sfx},
  {from: lead(19), title: '为什么数不清 r', C: B5Straw, sfx: B5Sfx},
  {from: cf(25) + 6, title: '中文也一样', C: B6Chinese, sfx: B6Sfx},
  {from: lead(28), title: '回答也是一块一块吐的', C: B7Gen, sfx: B7Sfx},
  {from: lead(36), title: '', C: A8Two, sfx: A8Sfx},
  {from: lead(38), title: '按 token 收钱', C: B9Bill, sfx: B9Sfx},
  {from: lead(42), title: '聊久了会失忆', C: B10Window, sfx: B10Sfx},
  {from: lead(47), title: '小技巧：开个新对话', C: B11Fresh, sfx: B11Sfx},
  {from: lead(51), title: '', C: A12Bye, sfx: A12Sfx},
];
