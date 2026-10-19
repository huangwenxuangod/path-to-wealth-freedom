import React from 'react';
import {Clipping, Desk, HalftonePhoto, Highlight, Label, RedLine, stringPts} from '../../library/vox/props';
import {V, VF} from '../../library/vox/theme';
import {PerceptronArt} from './art';

/** 封面（16:9）：黑卡纸上的大标题，旁边一张 1958 年的剪报和感知机照片，红线连到「2026」 */
export const Ep18Cover: React.FC<{f: number}> = () => {
  const f = 999;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <Desk w={1920} h={1080} color={V.oldMap} seed={6} />
      <div style={{position: 'absolute', left: 60, top: 60, width: 1100, height: 960, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
      <div style={{position: 'absolute', left: 130, top: 130}}>
        <Label size={44} bg={V.red}>
          一场吵了 70 年的争论
        </Label>
      </div>
      <div style={{position: 'absolute', left: 120, top: 230, fontFamily: VF.heavy, fontSize: 210, lineHeight: 1.02, color: V.paper}}>
        AI
        <br />
        七十年
      </div>
      <div style={{position: 'absolute', left: 130, top: 700, fontFamily: VF.num, fontSize: 120, color: V.paper, letterSpacing: 4}}>1950–2026</div>
      <div style={{position: 'absolute', left: 130, top: 860, display: 'flex', gap: 24}}>
        <Label size={50} bg={V.paper} color={V.ink}>规则派</Label>
        <div style={{fontFamily: VF.num, fontSize: 64, color: V.paper, lineHeight: 1}}>VS</div>
        <Label size={50} bg={V.red}>
          学习派
        </Label>
      </div>
      <div style={{position: 'absolute', left: 1220, top: 90, transform: 'scale(0.82)', transformOrigin: 'left top'}}>
        <Clipping
          w={760}
          h={520}
          seed={58}
          date="THE NEW YORK TIMES, JULY 8, 1958"
          head="NEW NAVY DEVICE LEARNS BY DOING"
          sub={
            <>
              Psychologist Shows{' '}
              <Highlight f={f} at={0} w={88} h={34}>
                Embryo
              </Highlight>{' '}
              of Computer Designed to Read and Grow Wiser
            </>
          }
          headSize={66}
          lines={4}
          rot={3}
        />
      </div>
      <div style={{position: 'absolute', left: 1300, top: 560}}>
        <HalftonePhoto w={460} h={320} rot={-4} caption="感知机 Mark I（示意）" dot={7}>
          <PerceptronArt w={460} h={320} />
        </HalftonePhoto>
      </div>
      <RedLine f={f} at={0} points={stringPts([1160, 500], [1330, 560], 30)} />
    </div>
  );
};
