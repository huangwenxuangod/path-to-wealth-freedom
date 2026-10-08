import React,{useEffect,useState} from 'react';
import {AbsoluteFill,OffthreadVideo,delayRender,continueRender,cancelRender,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GraduationCap,BookOpen,ShieldCheck} from 'lucide-react';
import type {TalkingHeadProps} from './spec';
import captions from '../../data/talking-head-captions.json';
import {fontsReady} from '../fonts';

const WHITE='#FFFFFF';
const smooth=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*(3-2*p);};
function Emphasis({text,color}:{text:string;color:string}){const letters=Array.from(text);return <>{letters.slice(0,-2).join('')}<span style={{color}}>{letters.slice(-2).join('')}</span></>;}
// One short semantic object enters, holds, and leaves. No spring overshoot or wall-clock motion.
function Float({from,to,children,style}:{from:number;to:number;children:React.ReactNode;style?:React.CSSProperties}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 const a=smooth((t-from)/.22),b=smooth((to-t)/.18);
 return <div style={{position:'absolute',opacity:a*b,transform:`translateY(${(1-a)*12}px)`,...style}}>{children}</div>;
}

export function TalkingHeadDesignLab(props:TalkingHeadProps){
 const [handle]=useState(()=>delayRender('Talking head typography'));
 useEffect(()=>{fontsReady.then(()=>continueRender(handle)).catch(cancelRender);},[handle]);
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const cue=captions.find(c=>t>=c.start&&t<c.end);
 const board=props.edited&&props.fullScreenScenes&&t>=props.scene4Start;
 const color=props.accent;
 const chapter=t<props.scene2Start?'01 · 使用边界':t<props.scene3Start?'02 · 教育变革':t<props.scene4Start?'03 · 学生':'04 · 教师';
 const left=76,top=258;
 const keyword:React.CSSProperties={fontSize:78,fontWeight:900,lineHeight:1.12,letterSpacing:-2,textShadow:'0 3px 9px #0008'};
 const overlay:React.CSSProperties={position:'absolute',inset:0,transform:`translate(${props.overlayOffsetX}px,${props.overlayOffsetY}px) scale(${props.overlayScale})`,transformOrigin:'76px 258px'};
 const fold=smooth((t-(props.scene2Start+2.3))/.5);
 return <AbsoluteFill style={{fontFamily:'Studio Han',color:WHITE,background:props.background}}>
  {/* Original footage and original audio remain continuous; no default crop, punch-in, or PIP. */}
  <AbsoluteFill style={{transform:props.edited?`translate(${props.videoOffsetX}px,${props.videoOffsetY}px) scale(${props.videoScale})`:undefined}}>
   <OffthreadVideo src={staticFile(props.videoSrc)} volume={props.volume} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
  </AbsoluteFill>
  {props.edited&&!board&&<AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(90deg,#00000038,transparent 32%),linear-gradient(0deg,#00000050,transparent 16%)'}}/>}
  {board&&<AbsoluteFill style={{background:props.background}}/>}
  {props.edited&&<div style={overlay}>
   <div style={{position:'absolute',left,top:66,fontSize:18,fontWeight:800,letterSpacing:2.2,color,display:'flex',gap:12,alignItems:'center'}}><span style={{width:3,height:23,background:color}}/>{chapter}</div>
   {/* At the opening, no invented explanation, list, app chrome, or duplicate body copy. */}
   <Float from={1.67} to={4.38} style={{left,top,...keyword,fontSize:68}}><span style={{fontSize:30,display:'block',marginBottom:16,fontWeight:700}}>先缓解</span><span style={{color:'#FF5B5B'}}>风险</span></Float>
   <Float from={4.42} to={7.01} style={{left,top,...keyword}}><Emphasis text={props.introTitle} color={color}/></Float>
   <Float from={7.05} to={8.18} style={{left,top:top+20,display:'flex',alignItems:'center',gap:16,fontSize:38,fontWeight:800}}><ShieldCheck color={color} size={43}/><span>降低风险</span></Float>
   {/* Reference 21: the same headline shrinks to a compact anchor, rather than spawning new panels. */}
   {t>=props.scene2Start&&t<props.scene3Start&&<Float from={props.scene2Start} to={props.scene3Start} style={{left,top:interpolate(fold,[0,1],[top,184]),fontSize:interpolate(fold,[0,1],[86,56]),fontWeight:900,lineHeight:1.15,letterSpacing:-2,textShadow:'0 3px 9px #0008'}}>
    <div style={{fontSize:interpolate(fold,[0,1],[32,24]),color:WHITE,marginBottom:16,fontWeight:700}}>教育</div><div><Emphasis text={props.transformationTitle} color={color}/></div>
   </Float>}
   <Float from={19.19} to={props.scene4Start} style={{left,top:202}}>
    <div style={{fontSize:30,fontWeight:700,marginBottom:20,display:'flex',alignItems:'center',gap:12}}><GraduationCap size={36} color={color}/><span>每个学生</span></div>
    <Float from={22.10} to={props.scene4Start} style={{position:'relative',...keyword}}><Emphasis text={props.studentTitle} color={color}/></Float>
   </Float>
   {!board&&<Float from={props.scene4Start} to={32.2} style={{left,top:202}}>
    <div style={{fontSize:30,fontWeight:700,marginBottom:20,display:'flex',alignItems:'center',gap:12}}><BookOpen size={36} color={color}/><span>每位教师</span></div>
    <Float from={29.36} to={32.2} style={{position:'relative',...keyword}}><Emphasis text={props.teacherTitle} color={color}/></Float>
   </Float>}
   {/* Optional full-screen relationship: two bare objects, one connection; no cards and no presenter inset. */}
   {board&&<>
    <Float from={props.scene4Start} to={32.2} style={{left:810,top:220,width:300,textAlign:'center',fontSize:64,fontWeight:900,color}}>AI</Float>
    <svg style={{position:'absolute',inset:0,width:1920,height:1080}}><path d="M960 308 V350 H540 V410 M960 350 H1380 V410" fill="none" stroke={color} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-smooth((t-props.scene4Start-.3)/.7)}/></svg>
    <Float from={props.scene4Start+.45} to={32.2} style={{left:360,top:445,width:360,textAlign:'center'}}><GraduationCap size={80} color={color}/><div style={{fontSize:29,marginTop:23}}>学生</div><div style={{fontSize:58,fontWeight:900,marginTop:15}}>{props.studentTitle}</div></Float>
    <Float from={props.scene4Start+.75} to={32.2} style={{left:1200,top:445,width:360,textAlign:'center'}}><BookOpen size={80} color={color}/><div style={{fontSize:29,marginTop:23}}>教师</div><div style={{fontSize:58,fontWeight:900,marginTop:15}}>{props.teacherTitle}</div></Float>
   </>}
  </div>}
  {props.showSourceLabel&&<div style={{position:'absolute',right:48,top:66,fontSize:16,color:'#ffffff90'}}>Sal Khan · TED 2023</div>}
  {props.showSubtitles&&cue&&<div style={{position:'absolute',left:60,right:60,bottom:35,textAlign:'center'}}>
   <span style={{display:'inline-block',fontSize:props.subtitleSize,fontWeight:600,padding:'7px 15px',background:'#0009',lineHeight:1.35}}>{cue.zh}</span>
   <div style={{marginTop:4}}><span style={{display:'inline-block',fontSize:23,padding:'3px 10px',background:'#0009',lineHeight:1.3}}>{cue.en}</span></div>
  </div>}
 </AbsoluteFill>;
}
