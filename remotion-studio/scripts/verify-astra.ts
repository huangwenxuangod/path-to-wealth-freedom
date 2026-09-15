import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {renderStill,selectComposition} from '@remotion/renderer';
import {prepare} from './render';
import {sourceHash} from './render-astra';
import {validateAstra} from './check-astra';
import input from '../data/astra6.json';
const cmd=(f:string,a:string[])=>execFileSync(f,a,{maxBuffer:30*1024*1024});
const hash=(file:string)=>createHash('sha256').update(cmd('ffmpeg',['-v','error','-i',file,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','-'])).digest('hex');
mkdirSync('evidence/astra',{recursive:true});
const props=validateAstra(input);const {serveUrl,browser}=await prepare();
const hashes:string[]=[];
try{
 const composition=await selectComposition({serveUrl,id:'AstraOverview',inputProps:props,puppeteerInstance:browser});
 for(const [i,frame] of [420,0,1079,420,450,90,300,570,810,1020,179,180,419,659,660,899,900].entries()){
  const file=`evidence/astra/check-${i}.png`;await renderStill({serveUrl,composition,inputProps:props,puppeteerInstance:browser,frame,scale:.5,output:file,imageFormat:'png',logLevel:'warn'});hashes.push(hash(file));
 }
 assert.equal(hashes[0],hashes[3]);assert.notEqual(hashes[1],hashes[2]);
 const p60={...props,fps:60 as const};const c60=await selectComposition({serveUrl,id:'AstraOverview',inputProps:p60,puppeteerInstance:browser});
 await renderStill({serveUrl,composition:c60,inputProps:p60,puppeteerInstance:browser,frame:900,scale:.5,output:'evidence/astra/fps60.png',imageFormat:'png',logLevel:'warn'});assert.equal(hash('evidence/astra/fps60.png'),hashes[4]);
}finally{await browser.close({silent:true});}
const file='renders/astra6-overview.mp4';const probe=JSON.parse(cmd('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height,codec_name,r_frame_rate,nb_frames','-of','json',file]).toString());
assert.equal(probe.streams[0].width,1920);assert.equal(probe.streams[0].height,1080);assert.equal(probe.streams[0].nb_frames,'1080');assert.equal(probe.streams[0].r_frame_rate,'30/1');assert.equal(Number(probe.format.duration),36);
cmd('ffmpeg',['-v','error','-xerror','-i',file,'-f','null','-']);
assert.equal(JSON.parse(readFileSync('evidence/astra/render.json','utf8')).sourceSha256,sourceHash());
writeFileSync('evidence/astra/verification.json',JSON.stringify({probe,repeat:true,fpsParity:true,fullDecode:true,framesChecked:17,sourceSha256:sourceHash()},null,2));
console.log('ASTRA_VERIFY_PASS 36s/1080 frames; full decode; repeated pixels; 30/60fps parity; source hash');
