import React from 'react';
import {VoxCoverTall} from '../../library/vox/CoverTall';
import {Clipping, HalftonePhoto} from '../../library/vox/props';
import {PerceptronArt} from './art';

/** 3:4 竖版封面：学习派那条线（两次寒冬探底）+ 感知机 + 1958 年的剪报 */
export const Ep18CoverTall: React.FC = () => (
  <VoxCoverTall
    index="01"
    kicker="一场吵了 70 年的争论"
    title={['AI', '七十年']}
    years="1950–2026"
    hook="规则派 VS 学习派，谁赢了？"
    curve={[[0, 0.7], [0.14, 0.5], [0.24, 0.9], [0.34, 0.62], [0.44, 0.92], [0.56, 0.7], [0.68, 0.55], [0.8, 0.3], [0.9, 0.15], [1, 0]]}
    dips={[2, 4]}
    curveLabel="两次寒冬"
    peakLabel="2026"
    photo={
      <HalftonePhoto w={300} h={360} rot={0} caption="感知机 Mark I（示意）" dot={7}>
        <PerceptronArt w={300} h={360} />
      </HalftonePhoto>
    }
    sticker={
      <div style={{transform: 'rotate(5deg) scale(0.37)', transformOrigin: 'left top'}}>
        <Clipping w={760} h={360} seed={58} date="THE NEW YORK TIMES, JULY 8, 1958" head="NEW NAVY DEVICE LEARNS BY DOING" headSize={64} lines={2} />
      </div>
    }
  />
);
