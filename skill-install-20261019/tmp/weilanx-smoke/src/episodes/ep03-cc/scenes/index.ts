import type {SceneDef} from '../../../library/types';
import {cf} from '../cues';
import {A1Intro, A1Sfx, A2Essence, A2Sfx, A3Second, A3Sfx, A4Easy, A4Sfx, A5Remind, A5Sfx, A6Roles, A6Sfx, A7Bye, A7Sfx} from './aroll';
import {B1Recap, B1Sfx, B2Frames, B2Sfx, B3Render, B3Sfx, B4Srt, B4Sfx, B5Pin, B5Sfx} from './broll1';
import {B10Feedback, B10Sfx, B11Export, B11Sfx, B12Sfx, B12Try, B6Sfx, B6Terminal, B7Board, B7Sfx, B8Build, B8Sfx, B9Studio, B9Sfx} from './broll2';

/** 场景比对应字幕早 6 帧入场。A-roll（主持人镜头）不显示章节标签 */
const lead = (n: number) => cf(n) - 6;

export const SCENES: SceneDef[] = [
  {from: 0, title: '', C: A1Intro, sfx: A1Sfx},
  {from: lead(4), title: '前两期是怎么做的', C: B1Recap, sfx: B1Sfx},
  {from: lead(8), title: '', C: A2Essence, sfx: A2Sfx},
  {from: lead(11), title: '① 画面是代码画的', C: B2Frames, sfx: B2Sfx},
  {from: lead(19), title: '导出：逐帧截图', C: B3Render, sfx: B3Sfx},
  {from: lead(25), title: '', C: A3Second, sfx: A3Sfx},
  {from: lead(27), title: '② 字幕里藏着时间', C: B4Srt, sfx: B4Sfx},
  {from: lead(34), title: '把动画钉在词上', C: B5Pin, sfx: B5Sfx},
  {from: lead(41), title: '', C: A4Easy, sfx: A4Sfx},
  {from: lead(43), title: '打开 CC', C: B6Terminal, sfx: B6Sfx},
  {from: lead(54), title: '先出分镜表', C: B7Board, sfx: B7Sfx},
  {from: lead(59), title: '写代码 + 合成音乐', C: B8Build, sfx: B8Sfx},
  {from: lead(67), title: 'Remotion Studio 预览', C: B9Studio, sfx: B9Sfx},
  {from: lead(74), title: '提意见，马上改', C: B10Feedback, sfx: B10Sfx},
  {from: lead(83), title: '', C: A5Remind, sfx: A5Sfx},
  {from: lead(89), title: '导出成片和分轨', C: B11Export, sfx: B11Sfx},
  {from: lead(98), title: '', C: A6Roles, sfx: A6Sfx},
  {from: lead(108), title: '自己试一试', C: B12Try, sfx: B12Sfx},
  {from: lead(114), title: '', C: A7Bye, sfx: A7Sfx},
];
