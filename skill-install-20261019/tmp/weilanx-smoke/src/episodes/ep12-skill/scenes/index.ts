import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {K1Hook, K1Sfx, K2Name, K2Sfx, K3Sfx, K3Versus, K4Manual, K4Sfx, K5MySkill, K5Sfx, K6Sfx, K6Shelf} from './part1';
import {K10Iterate, K10Sfx, K11Bye, K11Sfx, K7Sfx, K7Tips, K8Repeat, K8Sfx, K9Desc, K9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: K1Hook, sfx: K1Sfx},
  {from: lead(8), title: '', C: K2Name, sfx: K2Sfx},
  {from: lead(11), title: 'MCP 和 Skill 有什么不同', C: K3Versus, sfx: K3Sfx},
  {from: lead(16), title: 'Skill = 一本工作手册', C: K4Manual, sfx: K4Sfx},
  {from: lead(21), title: '我做视频用的 Skill', C: K5MySkill, sfx: K5Sfx},
  {from: lead(27), title: '手册多了会不会塞满', C: K6Shelf, sfx: K6Sfx},
  {from: lead(36), title: '', C: K7Tips, sfx: K7Sfx},
  {from: lead(38), title: '建议一：从反复交代的事开始', C: K8Repeat, sfx: K8Sfx},
  {from: lead(44), title: '建议二：简介写清楚', C: K9Desc, sfx: K9Sfx},
  {from: lead(49), title: '建议三：边用边改', C: K10Iterate, sfx: K10Sfx},
  {from: lead(54), title: '', C: K11Bye, sfx: K11Sfx},
];
