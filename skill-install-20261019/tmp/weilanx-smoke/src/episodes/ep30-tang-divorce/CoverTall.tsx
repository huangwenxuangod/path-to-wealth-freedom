import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Figure, Lantern, Scroll} from '../../library/lamplight/props';
import {Embers, NightBg} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';

/**
 * ep30 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「古代女人」+「不能离婚？」+ 朱红钩子条），
 * 中间一卷放妻书（「一别两宽」朱红大字），下面一男一女各提一盏灯往两边走。全部是片中用到的组件，字是精确排版的。
 */
const F = 9999; // 所有动画都已落定的帧

/** 横屏 1920×1080 的舞台裁进竖版封面 */
const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep30CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: L.night, overflow: 'hidden'}}>
    <Stage left={-420} top={360}>
      <NightBg f={60} floor glow={[50, 60]} strength={1.2} horizon={520} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0807 0%, #0c0908 36%, rgba(12,9,8,0) 52%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 22%, rgba(150,96,46,0.3) 0%, rgba(0,0,0,0) 70%)'}} />
    <svg width={1080} height={640} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 70}, (_, i) => (
        <circle key={i} cx={(i * 157.3) % 1080} cy={(i * 89.7) % 600} r={0.8 + ((i * 7) % 3) * 0.5} fill="#dfe6f2" opacity={0.18 + ((i * 13) % 5) * 0.08} />
      ))}
    </svg>

    {/* 中间：放妻书，「一别两宽」朱红大字 */}
    <Stage left={-420} top={455}>
      <Scroll
        f={F}
        at={0}
        y={430}
        w={900}
        h={430}
        cols={[
          {text: '放妻书', box: true},
          {text: '一别两宽', size: 92, color: L.seal},
          {text: '各生欢喜', size: 92},
          {text: '解怨释结', size: 60},
          {text: '更莫相憎', size: 60},
        ]}
      />
    </Stage>

    {/* 下面：一男一女各提一盏灯，往两边走 */}
    <Stage left={-420} top={372}>
      <Lantern f={30} x={700} y={760} seed={4} size={0.8} />
      <Figure f={30} x={790} y={1030} bun hat={false} scale={0.95} flip walk />
      <Figure f={36} x={1130} y={1030} scale={0.95} walk />
      <Lantern f={30} x={1220} y={760} seed={5} size={0.8} />
      <Embers f={F} x={960} y={900} n={18} spread={700} rise={300} seed={9} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0) 16%)'}} />

    {/* 标题字牌 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: L.inkDim}}>灯火史话 · 唐朝婚姻</div>
      <div style={{marginTop: 22, fontFamily: LF.serif, fontWeight: 900, fontSize: 170, lineHeight: 1.05, color: L.goldHot, textShadow: '0 0 60px rgba(237,174,80,0.6), 0 8px 26px rgba(0,0,0,0.85)'}}>古代女人</div>
      <div style={{marginTop: 4, fontFamily: LF.serif, fontWeight: 900, fontSize: 124, lineHeight: 1.12, color: L.ink, textShadow}}>不能离婚？</div>
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
        唐朝的离婚协议，比现代还体面
      </div>
    </div>

    <div style={{position: 'absolute', right: 48, bottom: 40, fontFamily: LF.label, fontWeight: 700, fontSize: 26, color: L.inkDim}}>敦煌放妻书 S.343v</div>
  </AbsoluteFill>
);
