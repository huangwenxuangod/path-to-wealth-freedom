import {Check,MousePointer2,Search,FileText} from 'lucide-react';
import {Safari} from '../components/video/safari';
import {AnimatedBeam} from '../components/video/animated-beam';
import {ease,palette as c} from './tokens';
export function ComputerScene({seconds}:{seconds:number}) {
 return <>
  <div style={{position:'absolute',left:780,top:185,width:1020,transform:`translateX(${(1-ease(seconds))*90}px)`}}><Safari url="工作空间 · 流程示意"/>
   <div style={{position:'absolute',left:35,right:35,top:76,bottom:30,background:'white',padding:35,zIndex:20}}>
    <div style={{fontSize:30,display:'flex',gap:18,alignItems:'center'}}><Search size={30}/>整理产品研究资料</div>
    <div style={{marginTop:35,height:1,background:'#e3e8ee'}}/>
    {['浏览相关资料','提取关键信息','整理为工作文档'].map((s,i)=><div key={s} style={{display:'flex',alignItems:'center',gap:22,marginTop:34,padding:22,background:i===Math.min(2,Math.floor(seconds/1.4))?'#eaf0ff':'#f7f9fb',borderRadius:8,opacity:ease(seconds,.6+i*.65),fontSize:32}}><FileText size={30} color={c.action}/>{s}<Check style={{marginLeft:'auto',opacity:ease(seconds,1.7+i*.65)}} size={30} color={c.result}/></div>)}
    <MousePointer2 size={48} fill={c.action} color="white" style={{position:'absolute',left:650-100*ease(seconds,1),top:200+130*ease(seconds,2)}}/>
   </div>
  </div>
  <AnimatedBeam seconds={seconds} start={1.4} from={{x:550,y:630}} to={{x:820,y:580}}/>
  <div style={{position:'absolute',left:810,top:855,fontSize:24,color:c.muted}}>场景化流程示意 · 依据 OpenAI 计算机操作能力说明</div>
 </>;
}
