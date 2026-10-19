import React from 'react';
import {Desk, HalftonePhoto, HandLine, Label} from '../../library/vox/props';
import {Portrait} from '../../library/vox/portrait';
import {V, VF} from '../../library/vox/theme';
import {TearCalendar} from './art';

/** 封面（16:9）：黑卡纸大标题，右边一本「30 天」撕页日历和一条三次探底又冲上去的命运线 */
export const Ep20Cover: React.FC<{f: number}> = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Desk w={1920} h={1080} color={V.oldMap} seed={8} />
    <div style={{position: 'absolute', left: 60, top: 60, width: 1060, height: 960, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
    <div style={{position: 'absolute', left: 130, top: 130}}>
      <Label size={44} bg={V.red}>
        全球最值钱的公司
      </Label>
    </div>
    <div style={{position: 'absolute', left: 120, top: 230, fontFamily: VF.heavy, fontSize: 200, lineHeight: 1.02, color: V.paper}}>
      英伟达
      <br />
      33 年
    </div>
    <div style={{position: 'absolute', left: 130, top: 700, fontFamily: VF.num, fontSize: 120, color: V.paper, letterSpacing: 4}}>1993–2026</div>
    <div style={{position: 'absolute', left: 130, top: 870, fontFamily: VF.heavy, fontSize: 54, color: V.hiSolid}}>老板说：离倒闭只剩 30 天</div>
    <div style={{position: 'absolute', left: 1180, top: 80, width: 680, height: 470, background: V.paper, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}}>
      <svg width={680} height={470} style={{overflow: 'visible'}}>
        <HandLine points={[[30, 400], [100, 330], [150, 420], [230, 300], [290, 410], [360, 330], [420, 250], [470, 330], [540, 170], [600, 120], [650, 50]]} p={1} width={12} />
      </svg>
      {[[130, 430], [270, 425], [455, 345]].map(([x, y]) => (
        <div key={x} style={{position: 'absolute', left: x - 26, top: y - 30, width: 52, height: 52, borderRadius: 26, border: `6px solid ${V.ink}`}} />
      ))}
      <div style={{position: 'absolute', left: 30, top: 20}}>
        <Label size={30} bg={V.red}>
          三次差点死掉
        </Label>
      </div>
    </div>
    <div style={{position: 'absolute', left: 1230, top: 590, transform: 'rotate(-6deg)'}}>
      <TearCalendar n={30} />
    </div>
    <div style={{position: 'absolute', left: 1500, top: 600}}>
      <HalftonePhoto w={300} h={360} rot={4} caption="黄仁勋（示意）" dot={7}>
        <Portrait w={300} h={360} hair="short" leather />
      </HalftonePhoto>
    </div>
  </div>
);
