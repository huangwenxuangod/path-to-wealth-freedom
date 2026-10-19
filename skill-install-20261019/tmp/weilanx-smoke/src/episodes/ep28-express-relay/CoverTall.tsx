import React from 'react';
import {AbsoluteFill} from 'remotion';
import {RelayChain, StationDots, Waypoint} from '../../library/lamplight/charts';
import {Horse} from '../../library/lamplight/props';
import {Embers} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {MapView} from './scenes';
import {PLACES, RELAY_AT, RELAY_STOPS, ROUTE_QL} from './timeline';

/**
 * ep28 竖版 3:4 封面（1080×1440）：上半是标题字牌（系列小字 + 金色「八百里加急」+ 到底有多快？ + 朱红钩子条），
 * 下半是地形图上一站站亮起的接力路线，前景一匹举火把狂奔的驿马。画面全部是片中用到的组件，字是精确排版的。
 */
const F = 9999; // 所有动画都已落定的帧
const RUN = 11; // 火焰和火星取这一帧

/** 横屏 1920×1080 的舞台裁进竖版封面：left / top 是舞台左上角在封面里的位置 */
const Stage: React.FC<{left: number; top: number; scale?: number; children: React.ReactNode}> = ({left, top, scale = 1, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep28CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: L.night, overflow: 'hidden'}}>
    {/* 下半：地形 + 北京 → 兰州接力路线（全部点亮） */}
    <Stage left={-500} top={470} scale={1.08}>
      <MapView cam={[1260, 640, 1.05]}>
        <StationDots f={F} n={700} lightAt={0} lightSpread={1} r={3.2} seed={8} />
        <RelayChain f={F} pts={ROUTE_QL} stops={RELAY_STOPS} litAt={RELAY_AT} />
        <Waypoint f={F} at={0} x={PLACES.fanyang[0]} y={PLACES.fanyang[1]} kind="city" label="北京" side="left" size={52} />
        <Waypoint f={F} at={0} x={PLACES.lanzhou[0]} y={PLACES.lanzhou[1]} kind="city" label="兰州" side="right" size={52} />
      </MapView>
    </Stage>

    {/* 上半压暗成夜空，标题字牌落在上面 */}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0807 0%, #0c0908 34%, rgba(12,9,8,0.85) 46%, rgba(12,9,8,0) 62%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 22%, rgba(150,96,46,0.32) 0%, rgba(0,0,0,0) 70%)'}} />
    <svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 70}, (_, i) => {
        const x = (i * 157.3) % 1080;
        const y = (i * 89.7) % 640;
        return <circle key={i} cx={x} cy={y} r={0.8 + ((i * 7) % 3) * 0.5} fill="#dfe6f2" opacity={0.18 + ((i * 13) % 5) * 0.08} />;
      })}
    </svg>

    {/* 前景：举火把狂奔的驿马 */}
    <Stage left={-400} top={350}>
      <Horse f={RUN} x={940} y={950} scale={1.45} torch pose="leap" />
      <Embers f={F} x={780} y={560} n={22} spread={160} rise={280} seed={9} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0) 22%)'}} />

    {/* 标题字牌 */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 36, letterSpacing: 12, color: L.inkDim}}>灯火史话 · 古代驿传</div>
      <div
        style={{
          marginTop: 26,
          fontFamily: LF.serif,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 1.08,
          letterSpacing: -4,
          color: L.goldHot,
          textShadow: '0 0 60px rgba(237,174,80,0.6), 0 8px 26px rgba(0,0,0,0.85)',
          whiteSpace: 'nowrap',
        }}
      >
        「八百里加急」
      </div>
      <div style={{marginTop: 6, fontFamily: LF.serif, fontWeight: 900, fontSize: 118, lineHeight: 1.12, color: L.ink, textShadow}}>到底有多快？</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 34,
          padding: '12px 34px',
          borderRadius: 14,
          background: 'rgba(30,10,6,0.85)',
          border: `3px solid ${L.red}`,
          boxShadow: '0 0 24px rgba(225,104,79,0.4)',
          fontFamily: LF.serif,
          fontWeight: 900,
          fontSize: 54,
          color: L.red,
        }}
      >
        一匹马，跑不完八百里
      </div>
    </div>

    {/* 右下角数字：六百里加急 · 6 天到兰州 */}
    <div style={{position: 'absolute', right: 56, bottom: 64, textAlign: 'right'}}>
      <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 30, color: L.inkDim, letterSpacing: 2}}>1791 年 · 六百里加急</div>
      <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 92, lineHeight: 1.1, color: L.ink, textShadow}}>
        6 天到<span style={{color: L.gold}}>兰州</span>
      </div>
    </div>
  </AbsoluteFill>
);
