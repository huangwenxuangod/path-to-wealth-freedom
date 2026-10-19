import React from 'react';
import {B, BF, glowText} from '../../library/blackgold/theme';

/** ep36 专用的小块：数字卡里的内容（猪圈、猪、天平、账本都在素材库 src/library/blackgold/） */

/** 规则卡 / 结局卡：一行小标题、一个大数字、一行注 */
export const OutcomeCard: React.FC<{title: string; lines: string[]; big: string; bigColor: string; note: string}> = ({title, lines, big, bigColor, note}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36}}>
    <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, ...glowText(B.goldWarm, 10, 0.6)}}>{title}</div>
    {lines.map((l, i) => (
      <div key={i} style={{fontFamily: BF.cn, fontSize: 28, color: B.inkDim, marginTop: i ? 6 : 18}}>
        {l}
      </div>
    ))}
    <div style={{fontFamily: BF.latinBold, fontSize: 120, lineHeight: 1.1, marginTop: 18, ...glowText(bigColor, 22)}}>{big}</div>
    <div style={{fontFamily: BF.cn, fontSize: 24, color: B.inkFaint, marginTop: 8}}>{note}</div>
  </div>
);
