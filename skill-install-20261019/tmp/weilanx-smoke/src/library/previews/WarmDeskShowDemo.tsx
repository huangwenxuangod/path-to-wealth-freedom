import React from 'react';
import {makeCues} from '../cues';
import {DeskCoverTall, DeskCoverWide} from '../warm-desk/CoverTall';
import {DeskShow, type DeskShowConfig} from '../warm-desk/DeskShow';
import {ListCard, SpeedCards} from '../warm-desk/props';
import {ChapterTitle, Headline, Rise, SayBubble} from '../warm-desk/stage';

/**
 * DeskShow 口播骨架的冒烟预览（无声）：一组假字幕驱动 5 个场景，检查换场、步骤条、吉祥物表情、字幕、封面淡出。
 * 也是 weilanx-creator-desk-video 技能里「场景表怎么写」的最小例子。
 */
const {cf, cw, cueAt, DURATION} = makeCues(
  [
    {i: 1, start: 0.5, end: 2.6, text: '一杯手冲咖啡要分几步'},
    {i: 2, start: 2.8, end: 5.2, text: '其实全靠一张说明书'},
    {i: 3, start: 5.4, end: 7.6, text: '第一步磨豆'},
    {i: 4, start: 7.8, end: 10.4, text: '粉水比我试了三次'},
    {i: 5, start: 10.6, end: 13.4, text: '好咖啡是能重复的说明书'},
  ],
  14,
);
const STEPS = ['磨豆', '称重', '注水'];

const Cover: React.FC<{f: number}> = () => (
  <DeskCoverWide tag="手艺拆解" line1="一杯手冲咖啡" line2="全靠一张" hi="说明书" steps={STEPS} card={{title: 'COFFEE.md', rows: ['用什么豆子', '水温多少度', '分几步冲']}} bottom="3 步，冲出能重复的好咖啡" />
);

const CONFIG: DeskShowConfig = {
  duration: DURATION,
  cueAt,
  steps: STEPS,
  cover: {C: Cover, frames: cf(1) - 5},
  scenes: [
    {from: 0, C: ({f}) => <Headline f={f} at={cf(1)} text={'一杯手冲咖啡\n要分〔几步〕'} size={110} y={260} />, sfx: [['pop', cf(1), 0.4]], eyes: 'wide'},
    {
      from: cf(2) - 6,
      C: ({f, t}) => (
        <Rise f={t} at={4} x={520} y={180}>
          <ListCard f={f} at={cw(2, '说明书')} title="COFFEE.md" rows={['用什么豆子', '水温多少度', '分几步冲']} hi={1} w={860} />
        </Rise>
      ),
      sfx: [['paper', cf(2), 0.4]],
      emotes: [['!', cw(2, '说明书')]],
    },
    {from: cf(3) - 6, C: ({f}) => <ChapterTitle f={f} at={cf(3)} n={1} title="磨豆" />, step: 0, hop: true, sfx: [['ding', cf(3), 0.35]]},
    {
      from: cf(4) - 6,
      C: ({f}) => (
        <div style={{position: 'absolute', left: 560, top: 360}}>
          <SpeedCards f={f} at={cf(4)} items={[['1:15', '太浓', 22], ['1:17', '太淡', 10], ['1:16', '刚好', 16]]} pick={2} pickAt={cw(4, '三次')} />
        </div>
      ),
      step: 1,
      sfx: [['click', cf(4), 0.4]],
    },
    {
      from: cf(5) - 6,
      C: ({f, t}) => (
        <>
          <Headline f={f} at={cf(5)} text={'好咖啡，是一份\n能重复的〔说明书〕'} size={120} y={220} />
          <Rise f={t} at={40} x={760} y={640}>
            <SayBubble text="收藏一下。" />
          </Rise>
        </>
      ),
      eyes: 'star',
      hop: true,
      sfx: [['magic', cf(5), 0.3]],
    },
  ],
};

export const WARM_DESK_SHOW_FRAMES = DURATION;
export const WarmDeskShowDemo: React.FC = () => <DeskShow config={CONFIG} />;

/** 封面预览（1080×1440） */
export const WarmDeskCoverDemo: React.FC = () => (
  <DeskCoverTall tag="手艺拆解" line1="一杯手冲咖啡" line2="全靠一张" hi="说明书" steps={['磨豆', '称重', '闷蒸', '注水', '品尝']} card={{title: 'COFFEE.md', rows: ['用什么豆子', '水温多少度', '分几步冲']}} bottom="5 步，冲出能重复的好咖啡" />
);
