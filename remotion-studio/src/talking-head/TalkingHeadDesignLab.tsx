import React,{useEffect,useState} from 'react';
import {AbsoluteFill,OffthreadVideo,delayRender,continueRender,cancelRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GraduationCap,BookOpen,ShieldCheck,Check,LockKeyhole} from 'lucide-react';
import type {TalkingHeadProps} from './spec';
import {flowState,phase,lerp,type FlowNode} from './flow-state';
import captions from '../../data/talking-head-captions.json';
import {fontsReady} from '../fonts';

const WHITE='#FFFFFF',RED='#FF5B5B';
// 1080p hierarchy: focus 140px, sustained title 112px, relation anchor 90px, context 44px.
const TYPE={focus:140,title:112,anchor:90,context:44,relation:36} as const;
function Emphasis({text,color}:{text:string;color:string}){const letters=Array.from(text);return <>{letters.slice(0,-2).join('')}<span style={{color}}>{letters.slice(-2).join('')}</span></>;}
const surface=(color:string):React.CSSProperties=>({background:'linear-gradient(145deg,#263343ef,#081019f2)',border:`2px solid ${color}99`,borderRadius:17,boxShadow:'0 5px 0 #060a10,0 17px 26px #0009,inset 0 1px 0 #ffffff32',backdropFilter:'blur(7px)'});
function Tile({node,color,children,label}:{node:FlowNode;color:string;children:React.ReactNode;label:string}){
 return <div style={{position:'absolute',left:node.x,top:node.y,width:100,opacity:node.opacity,transform:`scale(${node.scale})`,transformOrigin:'50px 50px',textAlign:'center'}}><div style={{...surface(color),width:100,height:100,display:'grid',placeItems:'center'}}>{children}</div><div style={{fontSize:TYPE.relation,fontWeight:800,marginTop:13,width:220,marginLeft:-60,whiteSpace:'nowrap',textShadow:'0 3px 5px #000'}}>{label}</div></div>;
}
function ContinuousFlow({time:t,props}:{time:number;props:TalkingHeadProps}){
 const color=props.accent,s=flowState(t,props.scene3Start,props.scene4Start,props.scene2Start);
 const coreSize=lerp(350,100,s.boundary),coreHeight=lerp(170,100,s.boundary);
 const coreCx=s.core.x+coreSize/2,coreCy=s.core.y+coreHeight/2;
 const studentCx=s.student.x+50,studentCy=s.student.y+50,teacherCx=s.teacher.x+50,teacherCy=s.teacher.y+50;
 const mapPath=(x:number,y:number)=>`M${coreCx} ${coreCy} C${coreCx} ${lerp(coreCy,y,.45)} ${x} ${lerp(coreCy,y,.6)} ${x} ${y}`;
 const headline:React.CSSProperties={position:'absolute',fontWeight:900,lineHeight:1.07,letterSpacing:-3,textShadow:'0 4px 11px #0008'};
 const introOut=1-phase(t,7.05,.3),eduFold=phase(t,props.scene2Start+1.6,.42),studentReady=phase(t,22.1,.34),teacherReady=phase(t,29.36,.34);
 const studentTextOpacity=phase(t,19.19,.25)*(1-s.teacherFocus)*(1-s.summary);
 const teacherTextOpacity=s.teacherFocus*(1-s.summary);
 return <div style={{position:'absolute',inset:0}}>
  {/* The same risk/core, student and teacher objects remain mounted through every handoff. */}
  <div style={{...headline,left:76,top:215,fontSize:TYPE.context,opacity:phase(t,1.67,.25)*(1-s.boundary)}}>先缓解</div>
  <svg width={650} height={750} style={{position:'absolute',left:0,top:0,overflow:'visible',pointerEvents:'none'}}>
   {[0,1].map(i=>{const y=405+i*85,p=phase(t,i===0?4.42:5.65,.4);return <path key={i} d={`M326 ${y} Q${lerp(350,coreCx,s.protect)} ${y} ${coreCx} ${coreCy}`} fill="none" stroke={color} strokeWidth={2} opacity={p*s.boundary*(1-s.education)} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>;})}
   <path d={mapPath(studentCx,studentCy)} fill="none" stroke={color} strokeWidth={3} opacity={s.student.opacity*s.unfold} pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,props.scene2Start+2.28,.48)}/>
   <path d={mapPath(teacherCx,teacherCy)} fill="none" stroke={color} strokeWidth={3} opacity={s.teacher.opacity*s.unfold} pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,props.scene2Start+2.43,.48)}/>
  </svg>
  {/* These two points physically contract into the core, rather than vanishing and respawning. */}
  {[{label:'防护措施',icon:LockKeyhole,start:4.42},{label:'正确使用',icon:Check,start:5.65}].map((item,i)=>{const p=phase(t,item.start,.35);return <div key={item.label} style={{position:'absolute',left:lerp(76-65*(1-p),s.core.x,s.protect),top:lerp(374+i*85,s.core.y,s.protect),width:lerp(250,100,s.protect),height:lerp(62,100,s.protect),...surface(color),borderRadius:lerp(8,17,s.protect),display:'flex',alignItems:'center',gap:13,padding:'0 15px',opacity:p*(1-s.protect)}}><item.icon size={27} color={color}/><span style={{fontSize:29,fontWeight:800,whiteSpace:'nowrap'}}>{item.label}</span></div>;})}
  <div style={{position:'absolute',left:s.core.x,top:s.core.y,width:coreSize,height:coreHeight,opacity:s.core.opacity,borderRadius:lerp(0,17,s.boundary),background:s.boundary>0?'linear-gradient(145deg,#263343ef,#081019f2)':'transparent',border:`${2*s.boundary}px solid ${s.protect>0?color:RED}`,boxShadow:s.boundary>0?'0 5px 0 #060a10,0 17px 28px #0008':'none',display:'grid',placeItems:'center'}}>
   <div style={{position:'absolute',fontSize:lerp(148,34,s.boundary),fontWeight:900,color:RED,opacity:1-s.protect,transform:`rotate(${-5*(1-s.boundary)}deg)`}}>风险</div>
   <ShieldCheck size={62} color={color} style={{position:'absolute',opacity:s.protect*(1-s.education)}}/>
   <div style={{fontSize:43,fontWeight:900,color,opacity:s.education}}>AI</div>
   <ShieldCheck size={23} color={color} style={{position:'absolute',right:-7,bottom:-7,background:'#101923',borderRadius:'50%',opacity:s.education,border:'2px solid #101923'}}/>
  </div>
  <div style={{position:'absolute',left:112,top:485,width:290,height:5,background:RED,transform:`scaleX(${phase(t,1.8,.35)*(1-s.boundary)})`,transformOrigin:'left center'}}/>
  <div style={{...headline,left:76,top:235,fontSize:TYPE.title,opacity:s.boundary*introOut}}><Emphasis text={props.introTitle} color={color}/></div>
  <div style={{...headline,left:76,top:245,fontSize:TYPE.title,opacity:s.protect*(1-s.education)}}>降低<span style={{color}}>风险</span></div>
  {/* Large type becomes a small anchor; the same core then unfolds into two supported roles. */}
  <div style={{...headline,left:76,top:lerp(225,155,eduFold),fontSize:lerp(TYPE.focus,TYPE.anchor,eduFold),opacity:s.education*(1-s.studentFocus)}}><div style={{fontSize:lerp(TYPE.context,36,eduFold),marginBottom:12}}>教育</div><Emphasis text={props.transformationTitle} color={color}/></div>
  <div style={{position:'absolute',right:105,top:160,fontSize:300,fontWeight:900,color,opacity:.08*s.education*(1-s.studentFocus),lineHeight:1}}>AI</div>
  <Tile node={s.student} color={color} label={s.summary>.5?'学生 · 导师':'学生'}><GraduationCap size={55} color={color}/></Tile>
  <Tile node={s.teacher} color={color} label={s.summary>.5?'教师 · 助手':'教师'}><BookOpen size={52} color={color}/></Tile>
  <div style={{...headline,left:76,top:185,fontSize:lerp(TYPE.title,TYPE.context,studentReady),opacity:studentTextOpacity}}>每个学生</div>
  <div style={{...headline,left:76,top:245,fontSize:lerp(TYPE.focus,TYPE.title,phase(t,24.1,.38)),opacity:studentReady*studentTextOpacity}}><Emphasis text={props.studentTitle} color={color}/></div>
  <div style={{...headline,left:76,top:185,fontSize:lerp(TYPE.title,TYPE.context,teacherReady),opacity:teacherTextOpacity}}>每位教师</div>
  <div style={{...headline,left:76,top:245,fontSize:lerp(TYPE.focus,TYPE.title,phase(t,30.2,.3)),opacity:teacherReady*teacherTextOpacity}}><Emphasis text={props.teacherTitle} color={color}/></div>
  <div style={{...headline,left:76,top:185,fontSize:TYPE.title,opacity:s.summary}}><div style={{fontSize:TYPE.context,marginBottom:12}}>同一份 AI</div><span style={{color}}>两种支持</span></div>
 </div>;
}

export function TalkingHeadDesignLab(props:TalkingHeadProps){
 const [handle]=useState(()=>delayRender('Talking head typography'));
 useEffect(()=>{fontsReady.then(()=>continueRender(handle)).catch(cancelRender);},[handle]);
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const cue=captions.find(c=>t>=c.start&&t<c.end);
 const board=props.edited&&props.fullScreenScenes?phase(t,props.scene4Start,.5):0;
 const chapter=t<props.scene2Start?'01 · 使用边界':t<props.scene3Start?'02 · 教育变革':t<props.scene4Start?'03 · 学生':t<30.55?'04 · 教师':'05 · 同一份支持';
 return <AbsoluteFill style={{fontFamily:'Studio Han',color:WHITE,background:props.background}}>
  <AbsoluteFill style={{transform:props.edited?`translate(${props.videoOffsetX}px,${props.videoOffsetY}px) scale(${props.videoScale})`:undefined}}><OffthreadVideo src={staticFile(props.videoSrc)} volume={props.volume} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
  {props.edited&&<AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(90deg,#00000038,transparent 32%),linear-gradient(0deg,#00000050,transparent 16%)'}}/>}
  {board>0&&<AbsoluteFill style={{background:props.background,opacity:board}}/>}
  {props.edited&&<div style={{position:'absolute',inset:0,transform:`translate(${props.overlayOffsetX}px,${props.overlayOffsetY}px) scale(${props.overlayScale})`,transformOrigin:'76px 258px'}}>
   <div style={{position:'absolute',left:76,top:66,fontSize:18,fontWeight:800,letterSpacing:2.2,color:props.accent,display:'flex',gap:12,alignItems:'center'}}><span style={{width:3,height:23,background:props.accent}}/>{chapter}</div>
   <div style={{position:'absolute',inset:0,transform:`translateX(${board*550}px)`}}><ContinuousFlow time={t} props={props}/></div>
  </div>}
  {props.showSourceLabel&&<div style={{position:'absolute',right:48,top:66,fontSize:16,color:'#ffffff90'}}>Sal Khan · TED 2023</div>}
  {props.showSubtitles&&cue&&<div style={{position:'absolute',left:60,right:60,bottom:35,textAlign:'center'}}><span style={{display:'inline-block',fontSize:props.subtitleSize,fontWeight:600,padding:'7px 15px',background:'#0009',lineHeight:1.35}}>{cue.zh}</span><div style={{marginTop:4}}><span style={{display:'inline-block',fontSize:23,padding:'3px 10px',background:'#0009',lineHeight:1.3}}>{cue.en}</span></div></div>}
 </AbsoluteFill>;
}
