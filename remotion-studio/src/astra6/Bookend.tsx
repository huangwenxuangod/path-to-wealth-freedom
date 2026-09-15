import {Img,staticFile} from 'remotion';
import {Check,Code2,FileText,MousePointer2} from 'lucide-react';
import {AnimatedBeam} from '../components/video/animated-beam';
import {ease,palette as c} from './tokens';
import type {AstraSpec} from './spec';
export function Bookend({spec,seconds,closing=false}:{spec:AstraSpec;seconds:number;closing?:boolean}) {
 const p=ease(seconds,.15,.9);const labels=closing?['操作','验证','交付']:['软件操作','工程执行','专业成果'];
 return <>
  <div style={{position:'absolute',top:160,left:112,right:112,textAlign:'center',opacity:.25+.75*p,transform:`translateY(${(1-p)*18}px)`}}>
   <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:22,fontSize:34}}><Img src={staticFile(spec.logo)} style={{width:52,height:52}}/><span>GPT-6 Astra</span></div>
   <h1 style={{fontSize:104,fontWeight:560,letterSpacing:-5,margin:'40px 0 0'}}>{closing?'操作、验证、交付':spec.title}</h1>
  </div>
  {[0,1,2].map(i=><AnimatedBeam key={i} seconds={seconds} start={.8+i*.17} from={{x:500+i*460,y:630}} to={{x:960,y:730}}/>)}
  <div style={{position:'absolute',top:440,left:310,width:1300,display:'flex',gap:38}}>
   {[MousePointer2,Code2,FileText].map((Icon,i)=><div key={i} style={{width:408,height:230,background:i===1?c.ink:'white',color:i===1?'white':c.ink,borderRadius:18,padding:38,boxShadow:'0 14px 50px #17243A0C',opacity:ease(seconds,.55+i*.16),transform:`translateY(${(1-ease(seconds,.55+i*.16))*70}px)`}}><Icon size={48} strokeWidth={1.5}/><div style={{fontSize:37,marginTop:42,display:'flex',alignItems:'center',justifyContent:'space-between'}}>{labels[i]}{closing&&<Check size={30} color={i===1?'#91dfc4':c.result}/>}</div></div>)}
  </div>
  <div style={{position:'absolute',top:770,width:'100%',textAlign:'center',fontSize:43,opacity:ease(seconds,1.6)}}>{closing?spec.summary:'一项任务，贯穿三种工作能力。'}</div>
  <div style={{position:'absolute',bottom:78,left:112,right:112,textAlign:'center',fontSize:24,color:c.muted}}>{closing?'依据 OpenAI 公布材料；实际表现随任务与配置变化。':'从开始处理，到交付结果。'}</div>
 </>;
}
