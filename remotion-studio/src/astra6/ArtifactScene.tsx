import {FileText,Table2,Presentation,Check} from 'lucide-react';
import {ease,palette as c} from './tokens';
export function ArtifactScene({seconds}:{seconds:number}) {
 return <div style={{position:'absolute',top:230,left:765,width:1070,height:570}}>
  {[{label:'分析文档',Icon:FileText},{label:'数据表格',Icon:Table2},{label:'演示文稿',Icon:Presentation}].map(({label,Icon},i)=><div key={label} style={{position:'absolute',left:i*315,top:i===1?0:45,width:350,height:500,padding:30,borderRadius:8,background:i===1?c.ink:'white',color:i===1?'white':c.ink,boxShadow:'0 24px 60px #17243A16',opacity:ease(seconds,.3+i*.28),transform:`translateY(${(1-ease(seconds,.3+i*.28))*100}px) rotate(${i===0?-4:i===2?4:0}deg)`}}>
   <Icon size={38}/><div style={{fontSize:30,marginTop:28}}>{label}</div>
   {i===1?<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginTop:36}}>{Array.from({length:15},(_,j)=><div key={j} style={{height:30,background:j<3?'#5577ba':'#304158'}}/>)}</div>:i===2?<><div style={{height:120,background:'#eaf0ff',marginTop:36,display:'flex',alignItems:'end',gap:18,padding:20}}>{[32,54,78].map(h=><div key={h} style={{height:h,width:40,background:c.action}}/>)}</div><div style={{height:9,width:'80%',background:'#c9d2df',marginTop:25}}/></>:<div style={{marginTop:36}}>{[100,85,95,70,100,65].map((w,j)=><div key={j} style={{height:8,width:`${w}%`,background:j===0?c.action:'#d5dce6',marginBottom:20}}/>)}</div>}
   <div style={{position:'absolute',bottom:32,left:30,display:'flex',gap:10,fontSize:22,opacity:ease(seconds,2+i*.2)}}><Check size={24} color={i===1?'#9ee2c7':c.result}/>结构与格式一致</div>
  </div>)}
  <div style={{position:'absolute',top:600,left:35,fontSize:24,color:c.muted}}>原创成果示意 · 依据 OpenAI 专业工作能力说明</div>
 </div>;
}
