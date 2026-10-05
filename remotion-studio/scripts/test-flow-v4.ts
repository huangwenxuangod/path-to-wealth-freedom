import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {flowState} from '../src/talking-head/flow-state';

const mode=process.argv[2];
const baselineHash='2cd23478536afdbfa65a3956815cd1973e5c38c0c813710a09e104565580108a';
const file=mode==='baseline'?'evidence/flow-v4/BASELINE.tsx':mode==='rollback'?'evidence/flow-v4/rollback-copy/src/talking-head/TalkingHeadDesignLab.tsx':'src/talking-head/TalkingHeadDesignLab.tsx';
const bytes=readFileSync(file),source=bytes.toString('utf8');
let checks=0;
const assert=(ok:boolean,message:string)=>{if(!ok)throw new Error(message);checks++;};
if(mode==='baseline'||mode==='rollback'){
 assert(createHash('sha256').update(bytes).digest('hex')===baselineHash,'baseline hash');
 assert(source.includes('function GuardrailGraph')&&!source.includes('function ContinuousFlow'),'V3 overlay behavior');
 console.log(mode==='baseline'?'BASELINE_PASS V3 source preserved; SHA256 identical':'ROLLBACK_PASS V3 source restored; SHA256 identical; separate V3 graphs restored');
}else if(mode==='modified'){
 const state=(t:number)=>flowState(t,17.4,25.7,9.4);
 for(const boundary of [1.67,4.42,5.65,7.05,9.4,11,11.5,17.4,25.7,30.55]){
  const before=state(boundary-.0001),after=state(boundary+.0001);
  for(const key of ['core','student','teacher'] as const){
   assert(Math.max(...(['x','y','scale','opacity'] as const).map(field=>Math.abs(before[key][field]-after[key][field])))<.01,`${key} continuous at ${boundary}`);
  }
 }
 assert(state(13).student.opacity===1&&state(13).teacher.opacity===1,'both branches unfolded');
 assert(state(23).student.opacity===1&&Math.abs(state(23).teacher.opacity-.28)<.001,'teacher remains parked');
 assert(state(28).teacher.opacity===1&&Math.abs(state(28).student.opacity-.28)<.001,'student remains parked');
 assert(state(31.2).student.opacity===1&&state(31.2).teacher.opacity===1,'both roles reunite');
 assert(state(31.2).summary===1&&state(31.2).core.y===405,'summary completed');
 assert(state(10.5).core.y===520,'large education heading clears core');
 assert(source.includes('focus:140,title:112,anchor:90,context:44,relation:36'),'1080p typography hierarchy');
 assert(source.includes('function ContinuousFlow')&&!source.includes('function GuardrailGraph'),'one continuous scene');
 assert(source.includes('<Tile node={s.student}')&&source.includes('<Tile node={s.teacher}'),'persistent role elements');
 assert(source.includes('mapPath(studentCx,studentCy)')&&source.includes('mapPath(teacherCx,teacherCy)'),'connectors use moving endpoints');
 assert(source.includes('volume={props.volume}')&&source.includes('src={staticFile(props.videoSrc)}'),'original AV retained');
 assert(!source.includes('fontSize:lerp(111,77'),'no undersized focus heading');
 console.log(`MODIFIED_PASS ${checks} checks; continuous nodes, final reunion, 140/112px titles; original AV retained`);
}else throw new Error('Use baseline, modified, or rollback');
