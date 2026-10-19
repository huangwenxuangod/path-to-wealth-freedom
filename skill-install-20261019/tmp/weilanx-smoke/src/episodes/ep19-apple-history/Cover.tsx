import React from 'react';
import {Desk, HalftonePhoto, HandLine, Label} from '../../library/vox/props';
import {V, VF} from '../../library/vox/theme';
import {AppleFruit, MacArt} from './art';

/** 封面（16:9）：黑卡纸大标题，右边一条命运线从谷底冲到山顶 */
export const Ep19Cover: React.FC<{f: number}> = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Desk w={1920} h={1080} color={V.oldMap} seed={7} />
    <div style={{position: 'absolute', left: 60, top: 60, width: 1060, height: 960, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
    <div style={{position: 'absolute', left: 130, top: 130}}>
      <Label size={44} bg={V.red}>
        差点被关掉的公司
      </Label>
    </div>
    <div style={{position: 'absolute', left: 120, top: 230, fontFamily: VF.heavy, fontSize: 210, lineHeight: 1.02, color: V.paper}}>
      苹果
      <br />
      五十年
    </div>
    <div style={{position: 'absolute', left: 130, top: 700, fontFamily: VF.num, fontSize: 120, color: V.paper, letterSpacing: 4}}>1976–2026</div>
    <div style={{position: 'absolute', left: 130, top: 870, fontFamily: VF.heavy, fontSize: 54, color: V.hiSolid}}>从「关掉它」到 5 万亿</div>
    <div style={{position: 'absolute', left: 1180, top: 80, width: 680, height: 560, background: V.paper, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}}>
      <svg width={680} height={560} style={{overflow: 'visible'}}>
        <HandLine points={[[40, 300], [120, 260], [190, 330], [260, 300], [330, 440], [380, 450], [440, 390], [500, 300], [560, 190], [620, 90]]} p={1} width={12} />
      </svg>
      <div style={{position: 'absolute', left: 260, top: 470}}>
        <Label size={34} bg={V.red}>
          1997 · 谷底
        </Label>
      </div>
      <div style={{position: 'absolute', left: 420, top: 40}}>
        <Label size={34}>2026 · 5 万亿</Label>
      </div>
    </div>
    <div style={{position: 'absolute', left: 1230, top: 640}}>
      <HalftonePhoto w={380} h={300} rot={-4} caption="Macintosh（示意）" dot={7}>
        <MacArt w={380} h={300} />
      </HalftonePhoto>
    </div>
    <div style={{position: 'absolute', left: 1640, top: 720, transform: 'rotate(10deg)'}}>
      <AppleFruit s={200} rainbow />
    </div>
  </div>
);
