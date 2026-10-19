import React from 'react';
import {AbsoluteFill} from 'remotion';
import {IceBowl, UmbrellaStall} from '../../library/lamplight/ice';
import {Lantern} from '../../library/lamplight/props';
import {Embers, NightBg} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {SAY_KG, TANG_DUAN} from './timeline';

/**
 * ep46 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「宋朝人夏天」+「已经在喝冰饮了」+ 朱红钩子条），
 * 下半一把亮着的青布伞摊 + 前景一只冒白气的银碗冰；右下「唐朝每年藏冰一千块」。全部是片中用到的组件。
 */
const F = 9999;

const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep46CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: L.night, overflow: 'hidden'}}>
    <Stage left={-420} top={360}>
      <NightBg f={60} floor glow={[45, 66]} strength={1.3} horizon={520} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0807 0%, #0c0908 36%, rgba(12,9,8,0) 52%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 22%, rgba(150,96,46,0.3) 0%, rgba(0,0,0,0) 70%)'}} />

    <Stage left={-420} top={170}>
      <Lantern f={30} x={1240} y={500} seed={4} size={0.8} />
      <UmbrellaStall f={F} x={1080} y={1000} scale={1.05} litAt={0} sign="冰雪" seed={4} />
      <IceBowl f={F} x={760} y={1060} w={330} at={0} iceAt={0} mistAt={0} silver seed={6} />
      <Embers f={F} x={1000} y={900} n={14} spread={500} rise={300} seed={9} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0) 16%)'}} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: L.inkDim}}>灯火史话 · 北宋开封</div>
      <div style={{marginTop: 22, fontFamily: LF.serif, fontWeight: 900, fontSize: 168, lineHeight: 1.05, color: L.goldHot, textShadow: '0 0 60px rgba(237,174,80,0.6), 0 8px 26px rgba(0,0,0,0.85)'}}>宋朝人夏天</div>
      <div style={{marginTop: 4, fontFamily: LF.serif, fontWeight: 900, fontSize: 104, lineHeight: 1.12, color: L.ink, textShadow}}>已经在喝冰饮了</div>
      <div style={{display: 'inline-block', marginTop: 30, padding: '12px 34px', borderRadius: 14, background: 'rgba(30,10,6,0.85)', border: `3px solid ${L.red}`, boxShadow: '0 0 24px rgba(225,104,79,0.4)', fontFamily: LF.serif, fontWeight: 900, fontSize: 50, color: L.red}}>
        没有冰箱，冰从哪来？
      </div>
    </div>

    <div style={{position: 'absolute', right: 48, bottom: 40, textAlign: 'right'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 28, color: L.inkDim}}>《唐六典》每岁藏冰</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 64, color: L.ink, textShadow}}>
        <span style={{color: L.gold}}>{TANG_DUAN}</span> 块 · 每块约 <span style={{color: L.gold}}>{SAY_KG}</span> 公斤
      </div>
    </div>
  </AbsoluteFill>
);
