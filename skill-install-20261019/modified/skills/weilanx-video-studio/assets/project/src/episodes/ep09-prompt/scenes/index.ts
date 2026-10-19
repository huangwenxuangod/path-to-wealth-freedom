import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {P1Hook, P1Sfx, P2Name, P2Sfx, P3Manual, P3Sfx, P4Intern, P4Sfx, P5Guess, P5Sfx, P6Short, P6Sfx} from './part1';
import {P10Recap, P10Sfx, P11Bye, P11Sfx, P7Goal, P7Sfx, P8Context, P8Sfx, P9Example, P9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: P1Hook, sfx: P1Sfx},
  {from: lead(8), title: '', C: P2Name, sfx: P2Sfx},
  {from: lead(11), title: '提示词 = 任务说明书', C: P3Manual, sfx: P3Sfx},
  {from: lead(14), title: '它像个新来的实习生', C: P4Intern, sfx: P4Sfx},
  {from: lead(18), title: '只给一句话，它只能猜', C: P5Guess, sfx: P5Sfx},
  {from: cf(21) + 4, title: '', C: P6Short, sfx: P6Sfx},
  {from: lead(25), title: '做法一：说清目标', C: P7Goal, sfx: P7Sfx},
  {from: lead(32), title: '做法二：给背景和材料', C: P8Context, sfx: P8Sfx},
  {from: lead(38), title: '做法三：讲明白要什么样', C: P9Example, sfx: P9Sfx},
  {from: lead(44), title: '', C: P10Recap, sfx: P10Sfx},
  {from: lead(50), title: '', C: P11Bye, sfx: P11Sfx},
];
