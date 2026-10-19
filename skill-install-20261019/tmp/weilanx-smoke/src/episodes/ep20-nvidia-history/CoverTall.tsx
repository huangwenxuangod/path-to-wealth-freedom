import React from 'react';
import {VoxCoverTall} from '../../library/vox/CoverTall';
import {Portrait} from '../../library/vox/portrait';
import {HalftonePhoto} from '../../library/vox/props';
import {TearCalendar} from './art';

/** 3:4 竖版封面：三次探底又冲上去的命运线 + 黄仁勋 + 「30 天」日历 */
export const Ep20CoverTall: React.FC = () => (
  <VoxCoverTall
    index="03"
    kicker="全球最值钱的公司"
    title={['英伟达', '33 年']}
    years="1993–2026"
    hook="老板说：离倒闭只剩 30 天"
    curve={[[0, 0.75], [0.1, 0.62], [0.18, 0.92], [0.32, 0.6], [0.42, 0.95], [0.55, 0.7], [0.66, 0.5], [0.73, 0.78], [0.85, 0.35], [0.93, 0.18], [1, 0]]}
    dips={[2, 4, 7]}
    curveLabel="三次差点死掉"
    peakLabel="5.8 万亿"
    photo={
      <HalftonePhoto w={300} h={360} rot={0} caption="黄仁勋（示意）" dot={7}>
        <Portrait w={300} h={360} hair="short" leather />
      </HalftonePhoto>
    }
    sticker={
      <div style={{transform: 'rotate(-6deg) scale(0.72)', transformOrigin: 'left top', marginTop: 26, marginLeft: 60}}>
        <TearCalendar n={30} />
      </div>
    }
  />
);
