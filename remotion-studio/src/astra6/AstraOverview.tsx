import {AbsoluteFill,Sequence,useCurrentFrame,useVideoConfig,Img,staticFile} from 'remotion';
import {Bookend} from './Bookend';
import {ComputerScene} from './ComputerScene';
import {CodingScene} from './CodingScene';
import {ArtifactScene} from './ArtifactScene';
import {palette as c,ease} from './tokens';
import type {AstraSpec} from './spec';
import '../fonts';
function Detail({spec,index}:{spec:AstraSpec;index:0|1|2}) {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const a=spec.advantages[index];
 return <AbsoluteFill style={{opacity:.3+.7*ease(s,0,.35)}}><div style={{position:'absolute',top:85,left:112,display:'flex',gap:18,alignItems:'center',fontSize:27}}><Img src={staticFile(spec.logo)} style={{width:38,height:38}}/>GPT-6 Astra</div>
  <div style={{position:'absolute',left:112,top:260,width:620}}><div style={{width:64,height:6,background:c.action,marginBottom:38}}/><h2 style={{fontSize:82,lineHeight:1.3,fontWeight:560,letterSpacing:-3,whiteSpace:'pre-line',margin:0}}>{a.title}</h2><div style={{marginTop:40,fontSize:31,color:c.muted,lineHeight:1.7,width:530,textWrap:'balance'}}>{a.subtitle}</div></div>
  {index===0?<ComputerScene seconds={s}/>:index===1?<CodingScene seconds={s} spec={spec}/>:<ArtifactScene seconds={s}/>}
  <div style={{position:'absolute',bottom:65,left:112,fontSize:24,color:c.muted}}>OpenAI 官方发布资料 · 工作能力解读</div>
 </AbsoluteFill>;
}
export function AstraOverview(spec:AstraSpec) {
 const {fps}=useVideoConfig();const frame=useCurrentFrame();
 return <AbsoluteFill className="film" style={{background:c.canvas,color:c.ink}}>
  <Sequence from={0} durationInFrames={6*fps} name="总述"><Bookend spec={spec} seconds={frame/fps}/></Sequence>
  <Sequence from={6*fps} durationInFrames={8*fps} name="操作软件"><Detail spec={spec} index={0}/></Sequence>
  <Sequence from={14*fps} durationInFrames={8*fps} name="运行验证"><Detail spec={spec} index={1}/></Sequence>
  <Sequence from={22*fps} durationInFrames={8*fps} name="专业成果"><Detail spec={spec} index={2}/></Sequence>
  <Sequence from={30*fps} durationInFrames={6*fps} name="总结"><Bookend spec={spec} seconds={frame/fps-30} closing/></Sequence>
  <div style={{position:'absolute',bottom:0,left:0,height:5,width:`${Math.min(frame/(33*fps),1)*100}%`,background:c.action}}/>
 </AbsoluteFill>;
}
