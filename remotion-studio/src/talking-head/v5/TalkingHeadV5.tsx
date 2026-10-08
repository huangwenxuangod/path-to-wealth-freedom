import {useEffect,useState} from 'react';
import {AbsoluteFill,OffthreadVideo,delayRender,continueRender,cancelRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import captions from '../../../data/talking-head-captions.json';
import {fontsReady} from '../../fonts';
import type {V5Props} from './spec';
import {stageOpacity} from './motion';
import {RiskScene,TransformationScene,StudentScene,TeacherAndReunionScene} from './scenes';

export function TalkingHeadV5(props:V5Props){
 const [handle]=useState(()=>delayRender('V5 local typography'));
 useEffect(()=>{fontsReady.then(()=>continueRender(handle)).catch(cancelRender);},[handle]);
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps;
 const stage=props.edited&&props.fullScreenScenes?stageOpacity(time):0;
 const cue=captions.find(c=>time>=c.start&&time<c.end);
 return <AbsoluteFill style={{background:props.background,color:'#F6F8FC',fontFamily:'Studio Han'}}>
  <AbsoluteFill style={{transform:props.edited?`translate(${props.videoOffsetX}px,${props.videoOffsetY}px) scale(${props.videoScale})`:undefined}}><OffthreadVideo src={staticFile(props.videoSrc)} volume={props.volume} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
  {props.edited&&<>
   <AbsoluteFill style={{background:'linear-gradient(90deg,#0005,transparent 43%)',pointerEvents:'none'}}/>
   <AbsoluteFill style={{background:props.background,opacity:stage*.96,pointerEvents:'none'}}/>
   <div style={{position:'absolute',inset:0,transform:`translate(${props.overlayOffsetX}px,${props.overlayOffsetY}px) scale(${props.overlayScale})`,transformOrigin:'center'}}>
    <RiskScene time={time} props={props}/>
    <TransformationScene time={time} props={props}/>
    <StudentScene time={time} props={props}/>
    <TeacherAndReunionScene time={time} props={props}/>
   </div>
  </>}
  {props.showSourceLabel&&<div style={{position:'absolute',right:48,top:50,fontSize:20,color:'#ffffff80'}}>Sal Khan · TED 2023</div>}
  {props.showSubtitles&&cue&&<div style={{position:'absolute',left:60,right:60,bottom:35,textAlign:'center'}}><span style={{display:'inline-block',fontSize:props.subtitleSize,fontWeight:600,padding:'7px 15px',background:'#0009',lineHeight:1.35}}>{cue.zh}</span><div style={{marginTop:4}}><span style={{display:'inline-block',fontSize:23,padding:'3px 10px',background:'#0009',lineHeight:1.3}}>{cue.en}</span></div></div>}
 </AbsoluteFill>;
}
