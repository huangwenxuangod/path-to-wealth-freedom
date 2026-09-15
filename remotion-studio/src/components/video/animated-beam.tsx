// Magic UI Animated Beam (MIT): preserve double SVG paths and four-stop gradient; frame-derived coordinates.
import {useId} from 'react';
export function AnimatedBeam({from,to,seconds,start=0,color='#2457E6'}:{from:{x:number;y:number};to:{x:number;y:number};seconds:number;start?:number;color?:string}) {
 const id=useId().replace(/:/g,'');const p=Math.max(0,Math.min(1,(seconds-start)/1.2));
 const d=`M ${from.x} ${from.y} C ${(from.x+to.x)/2} ${from.y}, ${(from.x+to.x)/2} ${to.y}, ${to.x} ${to.y}`;
 const dx=to.x-from.x;const x=from.x+dx*p;
 return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:Math.min(1,p*4)}} fill="none">
  <path d={d} stroke={color} strokeWidth={2} strokeOpacity={.18}/><path d={d} stroke={`url(#${id})`} strokeWidth={4} strokeLinecap="round"/>
  <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x-180} x2={x+100} y1={from.y} y2={to.y}><stop stopColor={color} stopOpacity={0}/><stop offset=".3" stopColor={color}/><stop offset=".65" stopColor={color}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
 </svg>;
}
