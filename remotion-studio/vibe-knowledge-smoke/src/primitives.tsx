import React from 'react';
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const smooth=(v:number)=>{v=clamp(v);return v*v*(3-2*v);};
export const seeded=(id:number)=>{const n=Math.sin(id*127.1+17.7)*43758.5453;return n-Math.floor(n);};
export const LineReveal:React.FC<{d:string;progress:number;color:string;strokeWidth?:number}>=({d,progress,color,strokeWidth=2})=><path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} pathLength={1} strokeDasharray={1} strokeDashoffset={1-clamp(progress)} style={{filter:`drop-shadow(0 0 3px ${color}55)`}}/>;
export const Node:React.FC<{x:number;y:number;color:string;progress:number;label:string}>=({x,y,color,progress,label})=><g opacity={smooth(progress)} transform={`translate(${x} ${y})`}><rect x={-49} y={-34} width={98} height={68} rx={7} stroke={color} fill="#0c111b" strokeWidth={2}/><path d="M -55 -34 L 0 -63 L 55 -34" fill="none" stroke={color} strokeWidth={2}/><circle r={5} fill={color}/><text y={58} fill={color} textAnchor="middle" fontSize={23}>{label}</text></g>;
