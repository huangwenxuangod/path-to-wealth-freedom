import {useId} from 'react';
import {color, progress} from '../tokens';

// Adapted from Magic UI Animated Beam (MIT). See THIRD_PARTY.md.
// Preserve its track + transparent moving gradient, replace Motion's clock and DOM measurement.
export function AnimatedBeam({from, to, seconds, start, vertical = false}: {
  from: {x: number; y: number}; to: {x: number; y: number}; seconds: number; start: number; vertical?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const amount = progress(seconds, start, 0.8);
  const pulse = progress(seconds, start + 0.15, 1.05);
  const pulseOpacity = seconds < start + 0.15 || seconds > start + 1.2 ? 0 : 1;
  const d = vertical
    ? `M${from.x} ${from.y} C${from.x} ${from.y + 100},${to.x} ${to.y - 110},${to.x} ${to.y}`
    : `M${from.x} ${from.y} C${from.x + 185} ${from.y},${to.x - 200} ${to.y},${to.x} ${to.y}`;
  const span = vertical ? to.y - from.y : to.x - from.x;
  const axis = (vertical ? from.y : from.x) + (pulse * 1.6 - 0.3) * span;
  return <g data-beam="true">
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse"
      x1={vertical ? from.x : axis - span * 0.2} x2={vertical ? from.x : axis + span * 0.2}
      y1={vertical ? axis - span * 0.2 : from.y} y2={vertical ? axis + span * 0.2 : from.y}>
      <stop stopColor={color.accent} stopOpacity={0}/><stop offset="42%" stopColor={color.accent}/><stop offset="55%" stopColor="#f1ffd4"/><stop offset="100%" stopColor={color.accent} stopOpacity={0}/>
    </linearGradient></defs>
    <path d={d} fill="none" stroke={color.accent} strokeOpacity={0.35} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - amount}/>
    <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={4} strokeLinecap="round" opacity={pulseOpacity}/>
    <circle cx={from.x} cy={from.y} r={4} fill={color.accent} opacity={amount}/>
    <circle cx={to.x} cy={to.y} r={6} fill={color.accent} opacity={progress(seconds, start + 0.9, 0.2)}/>
  </g>;
}
