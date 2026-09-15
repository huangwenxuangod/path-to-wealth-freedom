import {Terminal,TypingAnimation,AnimatedSpan} from '../components/video/terminal';
import {NumberTicker} from '../components/video/number-ticker';
import {ease,palette as c} from './tokens';
import type {AstraSpec} from './spec';
export function CodingScene({seconds,spec}:{seconds:number;spec:AstraSpec}) {
 return <><div style={{position:'absolute',left:780,top:185,width:1020,height:350,transform:`translateX(${(1-ease(seconds))*90}px)`}}>
  <Terminal style={{fontSize:28}}><TypingAnimation seconds={seconds} start={.3}>{'$ inspect → edit → verify'}</TypingAnimation><AnimatedSpan seconds={seconds} start={1}>✓ 读取项目与约束</AnimatedSpan><AnimatedSpan seconds={seconds} start={1.8}>✓ 修改实现，运行检查</AnimatedSpan><AnimatedSpan seconds={seconds} start={2.6}>✓ 整理结果与验证证据</AnimatedSpan></Terminal>
 </div><div style={{position:'absolute',top:570,left:810,width:960}}>
  <div style={{fontSize:28,marginBottom:26}}>{spec.benchmark.name} <span style={{color:c.muted,fontSize:22}}>OpenAI 公布评估</span></div>
  {[{name:'GPT-5.6 Sol',value:spec.benchmark.sol,color:'#A6B2C3'},{name:'GPT-6 Astra',value:spec.benchmark.astra,color:c.action}].map((v,i)=><div key={v.name} style={{display:'flex',alignItems:'center',marginBottom:20,gap:20,fontSize:26}}><div style={{width:220}}>{v.name}</div><div style={{width:560,height:40,background:'#e2e7ee'}}><div style={{width:`${v.value*ease(seconds,2.8,.8)}%`,height:40,background:v.color}}/></div><div style={{width:120,fontSize:32}}><NumberTicker value={v.value} seconds={seconds} start={2.8}/>%</div></div>)}
  <div style={{marginLeft:240,width:560,display:'flex',justifyContent:'space-between',fontSize:20,color:c.muted}}><span>0</span><span>50</span><span>100%</span></div>
  <div style={{fontSize:23,lineHeight:1.65,marginTop:22,color:c.muted}}>最高推理强度；研究 / API 环境。<br/>分数不等同于日常任务成功率。上方终端为流程示意。</div>
 </div></>;
}
