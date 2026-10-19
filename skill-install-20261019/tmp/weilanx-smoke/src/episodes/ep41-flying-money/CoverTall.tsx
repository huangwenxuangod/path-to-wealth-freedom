import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CoinPole, Lantern, Ticket} from '../../library/lamplight/props';
import {Embers, NightBg} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {DEMO_GUAN, guanWeightJin} from './timeline';

/**
 * ep41 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「唐朝人」+「已经在异地转账了」+ 朱红钩子条），
 * 下半一个挑着满担铜钱的商人 + 一张发光的「飞钱券」；右下「一百贯 = 625 斤」。全部是片中用到的组件。
 */
const F = 9999;

const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep41CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: L.night, overflow: 'hidden'}}>
    <Stage left={-420} top={360}>
      <NightBg f={60} floor glow={[45, 66]} strength={1.3} horizon={520} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0807 0%, #0c0908 36%, rgba(12,9,8,0) 52%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 22%, rgba(150,96,46,0.3) 0%, rgba(0,0,0,0) 70%)'}} />

    <Stage left={-500} top={300}>
      <Lantern f={30} x={1180} y={520} seed={4} size={0.85} />
      <CoinPole f={60} x={740} y={1000} loadAt={[0, 0, 0, 0]} scale={1.3} />
      <Ticket f={F} at={0} x={1330} y={640} w={220} h={330} text="飞钱券" glow={1} rot={8} />
      <Embers f={F} x={1200} y={900} n={18} spread={500} rise={300} seed={9} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0) 16%)'}} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: L.inkDim}}>灯火史话 · 唐朝长安</div>
      <div style={{marginTop: 22, fontFamily: LF.serif, fontWeight: 900, fontSize: 176, lineHeight: 1.05, color: L.goldHot, textShadow: '0 0 60px rgba(237,174,80,0.6), 0 8px 26px rgba(0,0,0,0.85)'}}>唐朝人</div>
      <div style={{marginTop: 4, fontFamily: LF.serif, fontWeight: 900, fontSize: 100, lineHeight: 1.12, color: L.ink, textShadow}}>已经在异地转账了</div>
      <div style={{display: 'inline-block', marginTop: 30, padding: '12px 34px', borderRadius: 14, background: 'rgba(30,10,6,0.85)', border: `3px solid ${L.red}`, boxShadow: '0 0 24px rgba(225,104,79,0.4)', fontFamily: LF.serif, fontWeight: 900, fontSize: 50, color: L.red}}>
        钱一文没动，账已经到了
      </div>
    </div>

    <div style={{position: 'absolute', right: 48, bottom: 40, textAlign: 'right'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 28, color: L.inkDim}}>《唐会要》一千文重六斤四两</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 64, color: L.ink, textShadow}}>
        {DEMO_GUAN} 贯 = <span style={{color: L.gold}}>{guanWeightJin(DEMO_GUAN)}</span> 斤
      </div>
    </div>
  </AbsoluteFill>
);
