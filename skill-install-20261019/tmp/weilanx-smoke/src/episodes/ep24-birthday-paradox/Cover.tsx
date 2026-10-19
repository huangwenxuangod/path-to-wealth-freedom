import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Dust, Grain} from '../../library/gilded/stage';
import {G, GF, goldText, goldTextLight} from '../../library/gilded/theme';
import {CalendarRing, CX, CY} from './ring';
import {DURATION, pct, pShared} from './timeline';

/**
 * ep24 生日悖论的 3:4 竖版封面（1080×1440）：片中的日历环放在中间，23 个人 + 253 条淡淡的连线，
 * 撞上的那一对是全图唯一的朱红；环心是金色大字「23」，下面一句钩子，最底下一行「不是缘分 · 是 50.7%」。
 */
const RING_X = 540;
const RING_Y = 620;
const RING_S = 1.12;

export const Ep24CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: G.bg}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 52% at 50% 44%, rgba(120,78,34,0.42) 0%, rgba(120,78,34,0.12) 45%, rgba(0,0,0,0) 78%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8) 100%)'}} />
    <Dust f={90} w={1080} h={1440} n={40} />

    {/* 顶部：术语 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, letterSpacing: 10, color: G.ivoryDim}}>
      生日悖论 · <span style={{fontFamily: GF.latinItalic, letterSpacing: 2}}>Birthday Paradox</span>
    </div>
    <div style={{position: 'absolute', left: 340, right: 340, top: 148, height: 1, background: `linear-gradient(90deg, rgba(214,180,106,0), ${G.gold}, rgba(214,180,106,0))`}} />

    {/* 日历环：片中同一个世界 */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${CX}px ${CY}px`, transform: `translate(${RING_X - CX}px, ${RING_Y - CY}px) scale(${RING_S})`}}>
      <CalendarRing f={DURATION} hot={1} chord={() => ({p: 1, o: 0.11})} />
    </div>

    {/* 环心：23 个人 */}
    <div style={{position: 'absolute', left: RING_X - 220, top: RING_Y - 220, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.6) 50%, rgba(3,3,3,0) 72%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: RING_Y - 190, textAlign: 'center'}}>
      <span style={{fontFamily: GF.num, fontSize: 300, lineHeight: 1, ...goldText(1.1)}}>23</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: RING_Y + 92, textAlign: 'center', fontFamily: GF.cn, fontSize: 40, letterSpacing: 14, color: G.ivory}}>
      个人
    </div>

    {/* 钩子 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1112, textAlign: 'center', fontFamily: GF.cn, fontWeight: 900, fontSize: 74, lineHeight: 1.3, color: G.ivory, textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>
      就有<span style={{color: '#f6d98c', textShadow: '0 0 26px rgba(240,196,100,0.55), 0 4px 24px rgba(0,0,0,0.9)'}}>一半</span>可能
      <br />
      有人同一天生日
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1318, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, letterSpacing: 4, color: G.ivoryDim}}>
      不是缘分 · 是 <span style={{fontFamily: GF.num, fontSize: 36, ...goldTextLight(0.4)}}>{pct(pShared(23))}</span>
    </div>
    <Grain opacity={0.12} />
  </AbsoluteFill>
);
