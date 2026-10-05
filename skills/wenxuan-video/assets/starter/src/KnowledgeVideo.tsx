import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import spec from '../data/storyboard.json';
import {LineReveal,Node,smooth,seeded} from './primitives';
import {stateAt} from './model';
import {AudioMix} from './AudioMix';
if(spec.theme.fontFile)loadFont({family:'KnowledgeFont',url:staticFile(spec.theme.fontFile)});
export const KnowledgeVideo:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,s=stateAt(t),theme=spec.theme;
 const caption=spec.captions.find(c=>t>=c.start&&t<c.end);
 const zoom=1+smooth((t-1.8)/3)*.08;
 const gold=theme.accent,blue=theme.secondary;
 return <AbsoluteFill style={{background:theme.background,color:theme.foreground,fontFamily:theme.fontFile?'KnowledgeFont':theme.fontFamily}}>
 <svg viewBox={`0 0 ${spec.width} ${spec.height}`} style={{width:'100%',height:'100%'}}>
  <defs><radialGradient id="vignette"><stop offset="45%" stopColor="#000" stopOpacity="0"/><stop offset="100%" stopColor="#000" stopOpacity=".72"/></radialGradient></defs>
  <g opacity={.16} stroke={theme.muted} strokeWidth={1}>{Array.from({length:16},(_,i)=><path key={i} d={`M ${i*95-110} 560 L ${640+(i*95-750)*.45} 145`}/>)}{Array.from({length:9},(_,i)=><path key={i} d={`M 0 ${160+i*i*6.4} H 1280`}/>)}</g>
  <g transform={`translate(640 340) scale(${zoom}) translate(-640 -340)`}>
   {Array.from({length:3},(_,i)=>{const u=((t*.35+i/3)%1);return <circle key={i} cx={640} cy={310} r={45+u*200} fill="none" stroke={gold} strokeWidth={1.3} opacity={(1-u)*s.signal*.38}/>;})}
   <LineReveal d="M 350 280 Q 420 230 590 302" progress={s.entry} color={blue}/>
   <LineReveal d="M 930 280 Q 850 230 690 302" progress={smooth((t-2.5)/2.5)} color={blue}/>
   <Node x={640} y={310} progress={s.signal} color={gold} label="原有商家"/>
   <Node x={340} y={260} progress={s.entry} color={blue} label="新进入者"/>
   <Node x={940} y={260} progress={smooth((t-2.5)/2)} color={blue} label="新进入者"/>
   <text x={640} y={208} fontSize={28} textAnchor="middle" fill={gold}>利润信号</text>
  </g>
  <g opacity={s.signal}><text x={490} y={468} textAnchor="middle" fontSize={22} fill={theme.muted}>价格 / 示意</text><text x={490} y={518} textAnchor="middle" fontSize={43} fill={gold}>{s.price.toFixed(1)}</text><text x={790} y={468} textAnchor="middle" fontSize={22} fill={theme.muted}>单件利润 / 示意</text><text x={790} y={518} textAnchor="middle" fontSize={43} fill={gold}>{s.profit.toFixed(1)}</text></g>
  <rect width={1280} height={720} fill="url(#vignette)"/>
  <g opacity={.08} fill={gold}>{Array.from({length:220},(_,i)=><circle key={i} cx={seeded(i*2)*1280} cy={seeded(i*2+1)*720} r={.7}/>)}</g>
  <text x={42} y={50} fill={theme.muted} fontSize={17}>机制示意 · 非实证数据</text>
 </svg>
 {caption&&<div style={{position:'absolute',top:600,left:45,right:45,textAlign:'center',fontSize:35,letterSpacing:1,opacity:smooth((t-caption.start)/.18)*smooth((caption.end-t)/.22)}}>{caption.text}</div>}
 <AudioMix/>
 </AbsoluteFill>;
};
