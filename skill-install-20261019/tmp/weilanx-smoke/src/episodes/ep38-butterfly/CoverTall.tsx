import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GlowButterflyG, TornadoG, TrailPathG} from '../../library/blackgold/chaos';
import {Grain, SmokeBg} from '../../library/blackgold/stage';
import {B, BF, glowText} from '../../library/blackgold/theme';
import {PATH_A, PATH_B, STEPS} from './timeline';

/**
 * ep38 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「蝴蝶效应」+ 问句副题 + 红框钩子条），
 * 下半是片中算出来的洛伦兹吸引子（金、青两条轨迹）+ 一只发光蝴蝶 + 远处一股龙卷风；底部「0.506127 → 0.506」。
 */
const T = 30;
const proj = (p: [number, number, number]): [number, number] => [540 + p[0] * 22, 1330 - p[2] * 14];
const SA = PATH_A.map(proj);
const SB = PATH_B.map(proj);

export const Ep38CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
    <SmokeBg f={T} focus={[50, 60]} strength={1.2} />
    <svg width={1080} height={1440} style={{position: 'absolute'}}>
      <TrailPathG pts={SB} head={STEPS} tail={0} color={B.cyan} width={2.4} trace={0.45} dot={0} />
      <TrailPathG pts={SA} head={STEPS} tail={0} color={B.gold} width={2.4} trace={0.6} dot={0} />
      <g transform="translate(880 1180)">
        <TornadoG t={T} size={300} />
      </g>
      <g transform="translate(330 900)">
        <GlowButterflyG t={T} size={250} glow={1.3} />
      </g>
    </svg>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050302 0%, #050302 30%, rgba(5,3,2,0.75) 44%, rgba(5,3,2,0) 56%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 26% at 50% 20%, rgba(170,120,50,0.34) 0%, rgba(0,0,0,0) 70%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,3,2,0.95) 0%, rgba(5,3,2,0.85) 10%, rgba(5,3,2,0) 22%)'}} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center'}}>
      <div style={{fontFamily: BF.cn, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: B.inkDim}}>黑金光影 · 混沌</div>
      <div style={{marginTop: 20, fontFamily: BF.cn, fontWeight: 900, fontSize: 176, lineHeight: 1.1, letterSpacing: 18, color: '#ffe9b0', textShadow: '0 0 8px #fff4d0, 0 0 30px rgba(240,184,96,0.95), 0 0 80px rgba(214,150,60,0.7), 0 6px 20px rgba(0,0,0,0.8)'}}>
        蝴蝶效应
      </div>
      <div style={{marginTop: 14, fontFamily: BF.cn, fontWeight: 900, fontSize: 88, lineHeight: 1.15, ...glowText(B.ink, 14, 0.5)}}>
        一只蝴蝶，真能
        <br />
        掀起<span style={glowText(B.red, 18)}>龙卷风</span>吗？
      </div>
      <div style={{display: 'inline-block', marginTop: 30, padding: '12px 34px', borderRadius: 12, background: 'rgba(40,10,6,0.85)', border: `3px solid ${B.red}`, boxShadow: `0 0 24px ${B.red}66`, fontFamily: BF.cn, fontWeight: 900, fontSize: 50, ...glowText(B.ink, 8, 0.4)}}>
        它也能<span style={glowText(B.cyan, 12)}>阻止</span>一场
      </div>
    </div>

    <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 24}}>
      <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 38, color: B.inkDim}}>起点只差</div>
      <div style={{fontFamily: BF.latinBold, fontSize: 104, lineHeight: 1, ...glowText(B.gold, 22)}}>0.000127</div>
    </div>
    <Grain />
  </AbsoluteFill>
);
