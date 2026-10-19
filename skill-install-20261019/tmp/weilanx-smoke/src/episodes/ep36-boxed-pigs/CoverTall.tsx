import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PigPen} from '../../library/blackgold/pen';
import {Grain, SmokeBg} from '../../library/blackgold/stage';
import {B, BF, glowText} from '../../library/blackgold/theme';
import {BIG_AT_TROUGH, FLOOR_Y, LEVER_X, SMALL_AT_TROUGH, TROUGH_X} from './timeline';

/**
 * ep36 竖版 3:4 封面（1080×1440）：上半标题字牌（系列小字 + 金色「智猪博弈」+ 问句副题 + 红框钩子条），
 * 下半是片中的猪圈：大猪甩着汗往食槽跑，小猪趴在槽边打呼；右下角「净得 4 : 4」。
 */
const T = 47; // 跑步相位、呼吸取这一帧

const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep36CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
    <SmokeBg f={T} focus={[50, 40]} strength={1.2} />
    {/* 下半：猪圈（裁掉拉杆那一边，聚焦食槽） */}
    <Stage left={-760} top={340} scale={1.02}>
      <PigPen
        f={T}
        presses={[]}
        flows={[]}
        big={{x: BIG_AT_TROUGH - 40, dir: 1, pose: 'run', speed: 1, sweat: 1}}
        small={{x: SMALL_AT_TROUGH, dir: 1, pose: 'lie', zzz: 1}}
        food={0.9}
        leverX={LEVER_X}
        troughX={TROUGH_X}
        floorY={FLOOR_Y}
        bigLabel="大猪"
        smallLabel="小猪"
        labelOn={1}
      />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050302 0%, #050302 30%, rgba(5,3,2,0.8) 44%, rgba(5,3,2,0) 58%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 26% at 50% 20%, rgba(170,120,50,0.34) 0%, rgba(0,0,0,0) 70%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,3,2,0.96) 0%, rgba(5,3,2,0.9) 14%, rgba(5,3,2,0) 26%)'}} />

    {/* 标题字牌 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center'}}>
      <div style={{fontFamily: BF.cn, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: B.inkDim}}>黑金光影 · 博弈论</div>
      <div style={{marginTop: 20, fontFamily: BF.cn, fontWeight: 900, fontSize: 176, lineHeight: 1.1, letterSpacing: 18, color: '#ffe9b0', textShadow: '0 0 8px #fff4d0, 0 0 30px rgba(240,184,96,0.95), 0 0 80px rgba(214,150,60,0.7), 0 6px 20px rgba(0,0,0,0.8)'}}>
        智猪博弈
      </div>
      <div style={{marginTop: 14, fontFamily: BF.cn, fontWeight: 900, fontSize: 92, lineHeight: 1.15, ...glowText(B.ink, 14, 0.5)}}>
        躺平的小猪
        <br />
        为什么<span style={glowText(B.cyan, 18)}>吃得更多</span>？
      </div>
      <div style={{display: 'inline-block', marginTop: 30, padding: '12px 34px', borderRadius: 12, background: 'rgba(40,10,6,0.85)', border: `3px solid ${B.red}`, boxShadow: `0 0 24px ${B.red}66`, fontFamily: BF.cn, fontWeight: 900, fontSize: 52, ...glowText(B.ink, 8, 0.4)}}>
        干活多的，不一定吃得多
      </div>
    </div>

    {/* 底部：净得 4 : 4 */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 28}}>
      <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, color: B.inkDim}}>跑断腿 vs 躺着，净得</div>
      <div style={{fontFamily: BF.latinBold, fontSize: 140, lineHeight: 1, ...glowText(B.gold, 26)}}>4 : 4</div>
    </div>
    <Grain />
  </AbsoluteFill>
);
