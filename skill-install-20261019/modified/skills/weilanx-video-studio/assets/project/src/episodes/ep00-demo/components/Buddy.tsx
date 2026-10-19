import React from 'react';
import {easeOutBack, prog} from '../../../library/anim';
import type {BuddyPose} from '../lib/buddy';
import {C, FONT_UI} from '../../../library/theme';
import {Arm} from '../../../library/character/Arm';
import {BuddyFigure} from '../../../library/character/BuddyFigure';


const Scissors: React.FC<{x: number; y: number; open: number; scale: number}> = ({x, y, open, scale}) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(58)`}>
    {[1, -1].map((d) => (
      <g key={d} transform={`rotate(${d * open * 16})`}>
        <path d={`M 0 0 L 118 ${d * 4} L 0 ${d * 10} Z`} fill="#E9ECEF" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-24} cy={d * 13} rx={17} ry={12} fill={C.red} stroke={C.ink} strokeWidth={3} />
        <ellipse cx={-24} cy={d * 13} rx={7} ry={4.5} fill={C.panel} />
      </g>
    ))}
    <circle r={4} fill={C.ink} />
  </g>
);

export const SpeechBubble: React.FC<{x: number; y: number; text: string; t: number; size?: number}> = ({x, y, text, t, size = 30}) => {
  const s = prog(t, 0, 9, easeOutBack);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: '50% 120%'}}>
      <div style={{background: C.white, border: `3px solid ${C.ink}`, borderRadius: 18, padding: '6px 18px', fontFamily: FONT_UI, fontSize: size, color: C.ink, whiteSpace: 'nowrap', boxShadow: '3px 4px 0 rgba(43,35,32,0.12)'}}>
        {text}
      </div>
      <svg width={30} height={20} style={{position: 'absolute', left: '50%', marginLeft: -15, bottom: -16}}>
        <path d="M2 0 L15 17 L28 0" fill={C.white} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={4} y={-3} width={22} height={5} fill={C.white} />
      </svg>
    </div>
  );
};

/** 世界坐标里的小人：身体 + 手臂 + 剪刀 + 气泡 */
export const Buddy: React.FC<{pose: BuddyPose}> = ({pose: b}) => {
  if (b.opacity <= 0) return null;
  const sy = 1 - b.squash;
  const sx = 1 + b.squash;
  const bob = b.walk ? Math.abs(Math.sin(b.walk)) * 5 : 0;
  const arm = b.arm && b.arm.ext > 0.01 ? b.arm : null;
  const shoulder = {x: b.x + 80, y: b.y - 130 - bob};
  const snipOpen = b.snipT < 0 ? 0.7 + Math.sin(b.snipT * 0.5) * 0.3 : b.snipT < 3 ? 0 : Math.min(0.7, (b.snipT - 3) * 0.1);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: b.opacity}}>
        {arm && <Arm sx={shoulder.x} sy={shoulder.y} tx={shoulder.x + (arm.tx - shoulder.x) * arm.ext} ty={shoulder.y + (arm.ty - shoulder.y) * arm.ext} />}
        <g transform={`translate(${b.x} ${b.y}) translate(0 -100) rotate(${b.rot}) translate(0 100) scale(${sx} ${sy}) translate(0 ${-bob})`}>
          <BuddyFigure eyes={b.eyes} walk={b.walk} lookX={b.lookX} armsUp={b.armsUp} blush={b.eyes === 'happy'} />
        </g>
        {b.scissors > 0 && <Scissors x={b.x + 100} y={b.y - 118} open={snipOpen} scale={b.scissors} />}
      </svg>
      {b.bubble && <SpeechBubble x={b.x} y={b.y - 185} text={b.bubble} t={b.bubbleT} />}
    </>
  );
};
