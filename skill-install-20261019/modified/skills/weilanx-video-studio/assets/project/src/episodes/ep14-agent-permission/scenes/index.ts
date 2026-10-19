import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {B1Hook, B1Sfx, B2Name, B2Sfx, B3Hands, B3Sfx, B4Keys, B4Sfx, B5Confirm, B5Sfx} from './part1';
import {B10Bye, B10Sfx, B6Sfx, B6Tips, B7Least, B7Sfx, B8Ask, B8Sfx, B9Backup, B9Sfx} from './part2';

/** 竖屏 3:4 场景表：场景比口播早 6 帧出现 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: B1Hook, sfx: B1Sfx},
  {from: lead(9), title: '', C: B2Name, sfx: B2Sfx},
  {from: lead(12), title: 'Agent 会自己动手', C: B3Hands, sfx: B3Sfx},
  {from: lead(17), title: '权限就是钥匙', C: B4Keys, sfx: B4Sfx},
  {from: lead(26), title: '确认：最后一道闸门', C: B5Confirm, sfx: B5Sfx},
  {from: lead(34), title: '', C: B6Tips, sfx: B6Sfx},
  {from: lead(36), title: '建议一：先给最少的钥匙', C: B7Least, sfx: B7Sfx},
  {from: lead(42), title: '建议二：危险操作先问你', C: B8Ask, sfx: B8Sfx},
  {from: lead(48), title: '建议三：重要的东西先备份', C: B9Backup, sfx: B9Sfx},
  {from: lead(53), title: '', C: B10Bye, sfx: B10Sfx},
];
