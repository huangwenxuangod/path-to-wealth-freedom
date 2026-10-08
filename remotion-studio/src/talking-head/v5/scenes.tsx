import React from 'react';
import {GraduationCap, Sparkles, FileText, Users, ArrowRight, LockKeyhole} from 'lucide-react';
import type {V5Props} from './spec';
import {phase,hit,mix,riskState,documentGroups,reunion} from './motion';

type SceneProps={time:number;props:V5Props};
const label:React.CSSProperties={fontWeight:600,letterSpacing:1};
const title:React.CSSProperties={fontWeight:900,lineHeight:1.04,letterSpacing:-4};
const at=(left:number,top:number):React.CSSProperties=>({position:'absolute',left,top});
const muted='#AAB5C4';

export function RiskScene({time:t,props:p}:SceneProps){
 if(t<1.67||t>=8.22)return null;
 const s=riskState(t),enter=hit(t,1.67,.32),exit=1-phase(t,7.95,.27);
 const x=mix(92,135,s.boundary),y=mix(250,515,s.boundary);
 return <div style={{position:'absolute',inset:0,opacity:enter*exit}}>
  <div style={{...at(100,180),...label,fontSize:46,opacity:1-s.boundary}}>先缓解</div>
  <div style={{...at(x,y),...title,fontSize:mix(210,82,s.boundary),color:s.controlled>.5?'#FFA3A3':'#FF5555',transform:`rotate(${mix(-3,0,s.boundary)}deg)`}}>风险</div>
  <div style={{...at(100,220),...title,fontSize:112,opacity:s.boundary}}>{p.introTitle}</div>
  <div style={{...at(100,365),...label,fontSize:42,color:p.accent,opacity:s.boundary,display:'flex',alignItems:'center',gap:15}}><LockKeyhole size={34}/>防护措施</div>
  <div style={{...at(100,742),...label,fontSize:42,color:p.accent,opacity:phase(t,5.65,.3)}}>正确使用</div>
  <svg width={780} height={850} style={{...at(0,0),overflow:'visible'}}>
   <path d="M100 475 V435 H640 V705 H100 V660" fill="none" stroke={p.accent} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-s.boundary}/>
   {s.marks.map((m,i)=><g key={i} transform={`translate(${m.x} ${m.y})`} opacity={phase(t,1.8+i*.14,.22)*mix(1,.45,s.controlled)}>
    <path d="M-16 12 L0 -16 L16 12 Z" fill="none" stroke="#FF5555" strokeWidth={4}/><path d="M0 -5 V3" stroke="#FF5555" strokeWidth={3}/><circle cy={8} r={2} fill="#FF5555"/>
   </g>)}
  </svg>
 </div>;
}

export function TransformationScene({time:t,props:p}:SceneProps){
 if(t<10.55||t>=p.scene3Start)return null;
 const enter=hit(t,10.55,.34),fold=phase(t,12.05,.6),exit=1-phase(t,p.scene3Start-.3,.3);
 const font=mix(p.focusSize,112,fold),headlineWidth=p.transformationTitle.length*p.focusSize-12;
 return <div style={{position:'absolute',inset:0,opacity:enter*exit}}>
  <div style={{...at(mix((1920-headlineWidth)/2,90,fold),mix(290,170,fold)),width:mix(headlineWidth,620,fold),transform:`translateY(${mix(26,0,enter)}px)`}}>
   <div style={{...label,fontSize:mix(56,42,fold),color:muted,marginBottom:22,transform:`translateX(${mix((headlineWidth-112)/2,0,fold)}px)`}}>教育</div>
   <div style={{...title,fontSize:font,whiteSpace:'nowrap'}}><span>{p.transformationTitle.slice(0,2)}</span><span style={{color:p.accent}}>{p.transformationTitle.slice(2)}</span></div>
   <div style={{height:7,background:p.accent,width:mix(1050,435,fold),marginTop:24,marginLeft:mix((headlineWidth-1050)/2,0,fold),transform:`scaleX(${hit(t,10.72,.4)})`,transformOrigin:'left'}}/>
  </div>
 </div>;
}

function Pair({color,reveal=1,showLabels=false}: {color:string;reveal?:number;showLabels?:boolean}){
 return <div style={{position:'relative',width:390,height:200}}>
  <GraduationCap size={94} strokeWidth={1.7} style={{...at(0,36),color:'#F6F8FC'}}/>
  <div style={{...at(143,76),width:105,height:3,background:color,transform:`scaleX(${reveal})`,transformOrigin:'left'}}/>
  <ArrowRight size={30} style={{...at(225,62),color,opacity:reveal}}/>
  <div style={{...at(285,18),width:112,height:112,borderRadius:'50%',background:`${color}18`,border:`3px solid ${color}`,display:'grid',placeItems:'center',opacity:reveal,transform:`translateX(${24*(1-reveal)}px) scale(${mix(.7,1,reveal)})`}}><Sparkles size={50} color={color}/></div>
  {showLabels&&<><div style={{...at(7,150),...label,fontSize:36}}>学生</div><div style={{...at(281,150),...label,fontSize:36,color,whiteSpace:'nowrap',opacity:reveal}}>AI 导师</div></>}
 </div>;
}

export function StudentScene({time:t,props:p}:SceneProps){
 if(t<p.scene3Start||t>=p.scene4Start)return null;
 const identity=phase(t,19.19,.28),paired=hit(t,p.pairingStart,.42),expand=phase(t,p.pairingStart+.55,.5);
 const exit=1-phase(t,p.scene4Start-.3,.3);
 return <div style={{position:'absolute',inset:0,opacity:exit}}>
  <div style={{...at(95,220),...title,fontSize:150,opacity:identity*(1-paired)}}>每个学生</div>
  <div style={{...at(95,425),opacity:identity*(1-paired)}}><Pair color={p.accent} reveal={0}/></div>
  <div style={{...at(160,205),...title,fontSize:p.titleSize,opacity:paired}}> {p.studentTitle}</div>
  <div style={{...at(160,425),width:1600,display:'flex',justifyContent:'space-between',opacity:paired}}>
   {[0,1,2].map(i=><div key={i} style={{opacity:i===0?1:hit(t,p.pairingStart+.55+i*.16,.32),transform:`translateY(${(1-expand)*25}px)`}}><Pair color={p.accent} reveal={hit(t,p.pairingStart+i*.16,.42)} showLabels={i===0}/></div>)}
  </div>
  <div style={{...at(160,732),...label,fontSize:48,color:muted,opacity:phase(t,p.pairingStart+.9,.3)}}>一人一份支持</div>
 </div>;
}

function TeachingPaper({grouped,color}: {grouped:number;color:string}){
 const positions=[0,1,2,3,4,5,6,7,8];
 return <div style={{width:440,height:590,background:'#F3F2ED',borderRadius:12,color:'#1D2632',boxShadow:'0 8px 0 #C5C6C6,0 32px 55px #0007',padding:'37px 36px',position:'relative'}}>
  <div style={{display:'flex',alignItems:'center',gap:15,fontWeight:800,fontSize:37}}><FileText size={33}/>教学材料</div>
  <div style={{fontSize:22,color:'#717984',marginTop:12}}>辅助整理示意</div>
  <div style={{height:1,background:'#CBD0D7',marginTop:23}}/>
  {[0,1,2].map(i=><div key={i} style={{...at(25,167+i*115),width:390,height:97,borderRadius:6,background:`${color}10`,opacity:grouped}}><div style={{...at(10,15),width:4,height:66,background:color}}/></div>)}
  {positions.map((i)=>{
   const beforeY=165+i*34,afterY=185+Math.floor(i/3)*115+(i%3)*23;
   const beforeX=36+(i%3===1?17:0),afterX=50;
   return <div key={i} style={{...at(mix(beforeX,afterX,grouped),mix(beforeY,afterY,grouped)),width:mix([308,250,325][i%3],[300,272,225][i%3],grouped),height:8,borderRadius:4,background:mix(0,1,grouped)>.5?'#8995A2':'#B1B5BA'}}/>;
  })}
  <div style={{position:'absolute',left:28,right:28,top:mix(160,505,grouped),height:3,background:color,opacity:Math.sin(Math.PI*grouped)}}/>
 </div>;
}

export function TeacherAndReunionScene({time:t,props:p}:SceneProps){
 if(t<p.scene4Start)return null;
 const paperEnter=hit(t,p.scene4Start+.55,.55),stage=phase(t,27.4,.4),assistant=hit(t,p.assistantStart,.32),grouped=documentGroups(t-(p.assistantStart-29.36)),join=reunion(t);
 return <div style={{position:'absolute',inset:0}}>
  <div style={{...at(100,220),...title,fontSize:150,opacity:phase(t,p.scene4Start,.3)*(1-assistant)}}>每位教师</div>
  <div style={{...at(mix(120,1060,join),mix(220,215,join)),...title,fontSize:mix(p.titleSize,104,join),opacity:assistant,whiteSpace:'nowrap'}}>{p.teacherTitle}</div>
  <div style={{...at(mix(mix(1950,1330,paperEnter),mix(1950,1060,paperEnter),stage),mix(240,465,join)),transform:`scale(${mix(1,.48,join)})`,transformOrigin:'top left',opacity:paperEnter}}><TeachingPaper grouped={grouped} color={p.accent}/></div>
  <div style={{...at(120,448),opacity:assistant*(1-join),display:'flex',gap:20,alignItems:'center',color:p.accent}}><Sparkles size={62}/><div style={{height:3,width:mix(0,480,grouped),background:p.accent}}/><ArrowRight size={33}/></div>
  <div style={{...at(260,215),...title,fontSize:104,opacity:join,whiteSpace:'nowrap'}}>{p.studentTitle}</div>
  <div style={{...at(260,480),opacity:join,transform:`translateX(${-35*(1-join)}px)`}}><Pair color={p.accent} showLabels={false}/></div>
  <div style={{...at(260,790),height:4,width:1370,background:p.accent,opacity:join,transform:`scaleX(${join})`,transformOrigin:'left'}}/>
  <div style={{...at(260,815),...label,fontSize:30,color:muted,opacity:join}}>学生</div>
  <div style={{...at(1060,815),...label,fontSize:30,color:muted,opacity:join,display:'flex',gap:12,alignItems:'center'}}><Users size={28}/>教师</div>
 </div>;
}
