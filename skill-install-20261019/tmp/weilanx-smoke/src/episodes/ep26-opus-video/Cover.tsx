import React from 'react';
import {DeskCoverTall, DeskCoverWide} from '../../library/warm-desk/CoverTall';
import {STEPS} from './scenes';

const P = {
  tag: 'AI 实战分享 · 第 08 期',
  line1: 'Opus 5.5 做视频',
  line2: '手把手',
  hi: '保姆级',
  steps: STEPS,
  card: {title: 'AI 做视频.md', rows: ['视频 = 一张张图片', '每一张 = 代码算出来', '一个 Skill 蒸馏爆款']},
  bottom: '3 个收获，做出你的第一条视频',
};

/** 3:4 竖版封面（Root.tsx 注册成 ep26-opus-video-cover-tall） */
export const Ep26CoverTall: React.FC = () => <DeskCoverTall {...P} />;
/** 横版首帧封面 */
export const Ep26CoverWide: React.FC<{f: number}> = () => <DeskCoverWide {...P} />;
