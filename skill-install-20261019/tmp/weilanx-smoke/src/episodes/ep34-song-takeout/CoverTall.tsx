import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Lantern, Waiter} from '../../library/lamplight/props';
import {Embers, NightBg} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';

/**
 * ep34 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「宋朝人」+「已经在点外卖了」+ 朱红钩子条），
 * 下半是回落段那个叠满碗的跑堂（左手 3 碗、右臂 20 碗），旁边一盏灯笼。全部是片中用到的组件，字是精确排版的。
 */
const F = 9999; // 所有动画都已落定的帧

/** 横屏 1920×1080 的舞台裁进竖版封面 */
const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep34CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: L.night, overflow: 'hidden'}}>
    <Stage left={-420} top={360}>
      <NightBg f={60} floor glow={[50, 66]} strength={1.3} horizon={520} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0807 0%, #0c0908 36%, rgba(12,9,8,0) 52%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 22%, rgba(150,96,46,0.3) 0%, rgba(0,0,0,0) 70%)'}} />
    <svg width={1080} height={640} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 70}, (_, i) => (
        <circle key={i} cx={(i * 157.3) % 1080} cy={(i * 89.7) % 600} r={0.8 + ((i * 7) % 3) * 0.5} fill="#dfe6f2" opacity={0.18 + ((i * 13) % 5) * 0.08} />
      ))}
    </svg>

    {/* 下半：叠满碗的跑堂 + 灯笼 */}
    <Stage left={-420} top={290}>
      <Lantern f={30} x={470} y={560} seed={4} size={0.85} />
      <Waiter f={F} x={780} y={1060} leftAt={[0, 0, 0]} rightAt={Array.from({length: 20}, () => 0)} scale={1.75} />
      <Embers f={F} x={960} y={900} n={18} spread={700} rise={300} seed={9} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0) 14%)'}} />

    {/* 标题字牌 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: L.inkDim}}>灯火史话 · 北宋东京</div>
      <div style={{marginTop: 22, fontFamily: LF.serif, fontWeight: 900, fontSize: 176, lineHeight: 1.05, color: L.goldHot, textShadow: '0 0 60px rgba(237,174,80,0.6), 0 8px 26px rgba(0,0,0,0.85)'}}>宋朝人</div>
      <div style={{marginTop: 4, fontFamily: LF.serif, fontWeight: 900, fontSize: 112, lineHeight: 1.12, color: L.ink, textShadow}}>已经在点外卖了</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 30,
          padding: '12px 34px',
          borderRadius: 14,
          background: 'rgba(30,10,6,0.85)',
          border: `3px solid ${L.red}`,
          boxShadow: '0 0 24px rgba(225,104,79,0.4)',
          fontFamily: LF.serif,
          fontWeight: 900,
          fontSize: 50,
          color: L.red,
        }}
      >
        穷人家叫外卖，也用银碗送
      </div>
    </div>

    <div style={{position: 'absolute', right: 48, bottom: 40, textAlign: 'right'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 28, color: L.inkDim}}>《东京梦华录》</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 64, color: L.ink, textShadow}}>
        跑堂一次端 <span style={{color: L.gold}}>23</span> 碗
      </div>
    </div>
  </AbsoluteFill>
);
