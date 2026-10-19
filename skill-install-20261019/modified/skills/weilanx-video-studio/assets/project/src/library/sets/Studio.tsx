import React from 'react';
import {easeOut, prog} from '../anim';
import {C} from '../theme';
import type {Wear} from '../character/Accessories';
import type {PixelSkin} from '../character/PixelBuddy';
import type {Eyes} from '../character/types';
import {Char} from '../character/Char';
import {FONT_CN} from '../fonts';

// 舞台坐标：1920 × 820，舞台顶端在画面 y=110 处

/** A-roll 演播室背景：墙、窗、挂画、ON AIR 灯、桌子和麦克风 */
const Studio: React.FC<{f: number}> = ({f}) => {
  const on = Math.floor(f / 20) % 6 !== 0; // 偶尔闪一下
  return (
    <div style={{position: 'absolute', left: 0, top: -110, width: 1920, height: 1080}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="wall" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#F3E6CF" />
            <rect width="40" height="80" fill="#EFDFC4" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#wall)" />
        {/* 窗户 + 飘过的云 */}
        <g transform="translate(1180 150)">
          <rect width="520" height="330" rx="16" fill="#BFE3F2" stroke={C.ink} strokeWidth={6} />
          {[0, 1].map((i) => {
            const x = ((f * (0.6 + i * 0.3) + i * 260) % 640) - 100;
            return <path key={i} transform={`translate(${x} ${70 + i * 110}) scale(1.6)`} d="M-28 10 Q-34 -6 -18 -8 Q-14 -24 2 -18 Q14 -28 22 -12 Q36 -10 30 10 Z" fill={C.white} stroke={C.ink} strokeWidth={2} />;
          })}
          <line x1="260" y1="0" x2="260" y2="330" stroke={C.ink} strokeWidth={6} />
          <line x1="0" y1="165" x2="520" y2="165" stroke={C.ink} strokeWidth={6} />
        </g>
        {/* 挂画：小人肖像 */}
        <g transform="translate(860 190) rotate(-3)">
          <rect width="200" height="160" rx="6" fill={C.yellow} stroke={C.ink} strokeWidth={6} />
          <rect x="30" y="50" width="140" height="80" rx="4" fill={C.orange} stroke={C.ink} strokeWidth={4} />
          <circle cx="75" cy="85" r="6" fill={C.ink} />
          <circle cx="125" cy="85" r="6" fill={C.ink} />
        </g>
        {/* 地板和桌子 */}
        <rect y="820" width="1920" height="260" fill="#D8C3A0" />
        <rect x="1000" y="770" width="820" height="60" rx="10" fill="#B8865B" stroke={C.ink} strokeWidth={6} />
        <rect x="1040" y="826" width="740" height="254" fill="#A07C5B" stroke={C.ink} strokeWidth={6} />
        {/* 桌角的绿植 */}
        <g transform="translate(1660 690)">
          <path d="M10 80 L2 40 H58 L50 80 Z" fill="#D9804F" stroke={C.ink} strokeWidth={4} />
          <path d={`M30 42 Q${10 + Math.sin(f * 0.05) * 4} 0 -10 -10 M30 42 Q${40 + Math.sin(f * 0.05 + 1) * 4} -10 70 -20 M30 42 Q30 10 32 -30`} fill="none" stroke="#5FAE55" strokeWidth={8} strokeLinecap="round" />
        </g>
      </svg>
      {/* ON AIR */}
      <div style={{position: 'absolute', left: 120, top: 150, padding: '10px 26px', borderRadius: 14, border: `5px solid ${C.ink}`, background: on ? C.red : '#9A5A5C', color: C.white, fontFamily: FONT_CN, fontSize: 44, boxShadow: on ? '0 0 30px rgba(229,72,77,0.7)' : 'none'}}>
        ON AIR
      </div>
    </div>
  );
};

/** 桌上的麦克风，画在主持人前面 */
const Mic: React.FC = () => (
  <svg width={160} height={260} viewBox="0 0 160 260" style={{position: 'absolute', left: 1130, top: 440}}>
    <path d="M80 150 V230 M40 236 H120" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
    <path d="M36 110 Q36 170 80 170 Q124 170 124 110" fill="none" stroke={C.ink} strokeWidth={8} />
    <rect x="50" y="20" width="60" height="120" rx="30" fill="#6A6F78" stroke={C.ink} strokeWidth={6} />
    {[50, 70, 90, 110].map((y) => <line key={y} x1="56" y1={y} x2="104" y2={y} stroke="#3A3F48" strokeWidth={4} />)}
  </svg>
);

export interface HostProps {
  f: number;
  skin?: PixelSkin;
  wear?: Wear[];
  eyes?: Eyes;
  armsUp?: number;
  lookX?: number;
  children?: React.ReactNode; // 左侧的标题/板书
}

/** A-roll：主持人在演播室桌后 */
export const Host: React.FC<HostProps> = ({f, skin, wear, eyes = 'open', armsUp = 0, lookX = -0.3, children}) => (
  <>
    <Studio f={f} />
    <Char f={f} x={1400} y={700} s={1.9} skin={skin} wear={wear} eyes={eyes} armsUp={armsUp} lookX={lookX} />
    <Mic />
    <div style={{position: 'absolute', left: 120, top: 150, width: 820, height: 500}}>{children}</div>
  </>
);

/** B-roll 右下角：主持人整个人站在角落里继续说话。x/y 是脚底位置，默认是横屏舞台的右下角 */
export const PiP: React.FC<{f: number; at: number; skin?: PixelSkin; wear?: Wear[]; eyes?: Eyes; x?: number; y?: number; s?: number}> = ({f, at, skin, wear, eyes = 'open', x = 1755, y = 800, s = 1}) => {
  const p = prog(f, at + 4, 10, easeOut);
  const hop = (1 - p) * 120;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, p * 2)}}>
      <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <ellipse cx={x} cy={y + 6} rx={140 * s * p} ry={15 * s * p} fill="rgba(43,35,32,0.18)" />
      </svg>
      <Char f={f} x={x} y={y - hop} s={s} skin={skin} wear={wear} eyes={eyes} lookX={-0.6} />
    </div>
  );
};

/* ---------------- 竖屏 3:4 演播室（舞台 1080 × 1080） ---------------- */

/** 竖屏 B-roll 里主持人的位置：右下角，x≥820、y≥860 的区域留给他 */
export const PIP_TALL = {x: 950, y: 1050, s: 0.7};

const TallStudio: React.FC<{f: number}> = ({f}) => {
  const on = Math.floor(f / 20) % 6 !== 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1080}}>
      <svg width={1080} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="wallTall" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#F3E6CF" />
            <rect width="40" height="80" fill="#EFDFC4" />
          </pattern>
        </defs>
        <rect width="1080" height="1080" fill="url(#wallTall)" />
        <g transform="translate(640 470)">
          <rect width="380" height="250" rx="14" fill="#BFE3F2" stroke={C.ink} strokeWidth={6} />
          {[0, 1].map((i) => {
            const x = ((f * (0.6 + i * 0.3) + i * 200) % 520) - 80;
            return <path key={i} transform={`translate(${x} ${60 + i * 90}) scale(1.3)`} d="M-28 10 Q-34 -6 -18 -8 Q-14 -24 2 -18 Q14 -28 22 -12 Q36 -10 30 10 Z" fill={C.white} stroke={C.ink} strokeWidth={2} />;
          })}
          <line x1="190" y1="0" x2="190" y2="250" stroke={C.ink} strokeWidth={6} />
          <line x1="0" y1="125" x2="380" y2="125" stroke={C.ink} strokeWidth={6} />
        </g>
        <g transform="translate(70 520) rotate(-3)">
          <rect width="170" height="136" rx="6" fill={C.yellow} stroke={C.ink} strokeWidth={6} />
          <rect x="26" y="42" width="118" height="68" rx="4" fill={C.orange} stroke={C.ink} strokeWidth={4} />
          <circle cx="64" cy="72" r="5" fill={C.ink} />
          <circle cx="106" cy="72" r="5" fill={C.ink} />
        </g>
        <rect y="900" width="1080" height="180" fill="#D8C3A0" />
        <rect x="90" y="880" width="900" height="56" rx="10" fill="#B8865B" stroke={C.ink} strokeWidth={6} />
        <rect x="130" y="932" width="820" height="160" fill="#A07C5B" stroke={C.ink} strokeWidth={6} />
        <g transform="translate(900 800)">
          <path d="M10 80 L2 40 H58 L50 80 Z" fill="#D9804F" stroke={C.ink} strokeWidth={4} />
          <path d={`M30 42 Q${10 + Math.sin(f * 0.05) * 4} 0 -10 -10 M30 42 Q${40 + Math.sin(f * 0.05 + 1) * 4} -10 70 -20 M30 42 Q30 10 32 -30`} fill="none" stroke="#5FAE55" strokeWidth={8} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 820, top: 410, padding: '6px 18px', borderRadius: 12, border: `5px solid ${C.ink}`, background: on ? C.red : '#9A5A5C', color: C.white, fontFamily: FONT_CN, fontSize: 34, boxShadow: on ? '0 0 24px rgba(229,72,77,0.7)' : 'none'}}>
        ON AIR
      </div>
    </div>
  );
};

/** 竖屏 3:4 A-roll：主持人站在桌后正中，上方 960×360 的区域放标题/板书 */
export const HostTall: React.FC<HostProps> = ({f, skin, wear, eyes = 'open', armsUp = 0, lookX = 0, children}) => (
  <>
    <TallStudio f={f} />
    <Char f={f} x={540} y={900} s={1.9} skin={skin} wear={wear} eyes={eyes} armsUp={armsUp} lookX={lookX} />
    <svg width={160} height={260} viewBox="0 0 160 260" style={{position: 'absolute', left: 250, top: 640}}>
      <path d="M80 150 V230 M40 236 H120" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <path d="M36 110 Q36 170 80 170 Q124 170 124 110" fill="none" stroke={C.ink} strokeWidth={8} />
      <rect x="50" y="20" width="60" height="120" rx="30" fill="#6A6F78" stroke={C.ink} strokeWidth={6} />
      {[50, 70, 90, 110].map((y) => <line key={y} x1="56" y1={y} x2="104" y2={y} stroke="#3A3F48" strokeWidth={4} />)}
    </svg>
    <div style={{position: 'absolute', left: 60, top: 30, width: 960, height: 360}}>{children}</div>
  </>
);
