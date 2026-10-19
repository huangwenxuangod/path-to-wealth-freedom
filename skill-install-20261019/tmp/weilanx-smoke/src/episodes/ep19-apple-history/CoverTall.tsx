import React from 'react';
import {VoxCoverTall} from '../../library/vox/CoverTall';
import {HalftonePhoto} from '../../library/vox/props';
import {AppleFruit, MacArt} from './art';

/** 3:4 竖版封面：1997 年探到谷底再冲到 5 万亿的命运线 + 麦金塔 + 彩虹苹果 */
export const Ep19CoverTall: React.FC = () => (
  <VoxCoverTall
    index="02"
    kicker="差点被关掉的公司"
    title={['苹果', '五十年']}
    years="1976–2026"
    hook="从「关掉它」到 5 万亿"
    curve={[[0, 0.8], [0.12, 0.62], [0.22, 0.78], [0.32, 0.66], [0.42, 0.82], [0.5, 0.97], [0.58, 0.88], [0.68, 0.62], [0.78, 0.45], [0.88, 0.25], [1, 0]]}
    dips={[5]}
    curveLabel="1997 · 谷底"
    peakLabel="5 万亿"
    photo={
      <HalftonePhoto w={300} h={360} rot={0} caption="Macintosh（示意）" dot={7}>
        <MacArt w={300} h={360} />
      </HalftonePhoto>
    }
    sticker={
      <div style={{transform: 'rotate(10deg)', marginLeft: 20}}>
        <AppleFruit s={200} rainbow />
      </div>
    }
  />
);
