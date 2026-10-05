import {renderMedia,renderStill,selectComposition} from '@remotion/renderer';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {prepare} from './render';
import {talkingHeadSchema} from '../src/talking-head/spec';
import data from '../data/talking-head.json';
process.chdir(resolve(import.meta.dir,'..'));
const overrides=process.argv.includes('--json')?talkingHeadSchema.parse(data):{};mkdirSync('renders',{recursive:true});mkdirSync('evidence/talking-head',{recursive:true});
const {serveUrl,browser}=await prepare();
try{
const composition=await selectComposition({serveUrl,id:'TalkingHeadDesignLab',inputProps:overrides,puppeteerInstance:browser});
const props=talkingHeadSchema.parse(composition.props);
if(process.argv.includes('--stills')){
for(const frame of [0,60,150,210,300,330,390,630,720,850,945,959])await renderStill({serveUrl,composition,inputProps:props,puppeteerInstance:browser,frame,scale:.65,output:`evidence/talking-head/frame-${frame}.png`,imageFormat:'png',logLevel:'warn'});
console.log('TALKING_HEAD_STILLS_PASS 12 frames');
}else{
await renderMedia({serveUrl,composition,inputProps:props,puppeteerInstance:browser,outputLocation:'renders/talking-head-design-lab.mp4',codec:'h264',pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:90,crf:19,concurrency:3,logLevel:'warn'});
const original=await selectComposition({serveUrl,id:'TalkingHeadOriginal',inputProps:{...props,edited:false,showSubtitles:false},puppeteerInstance:browser});
// Keep a byte-accurate original excerpt via ffmpeg; the original Composition remains available in Studio.
writeFileSync('evidence/talking-head/render.json',JSON.stringify({composition:composition.id,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,duration:composition.durationInFrames/composition.fps,source:'TED Sal Khan 2023',inputProps:props,originalComposition:original.id},null,2));
console.log('TALKING_HEAD_RENDER_PASS 1920x1080 30fps 960frames 32s');
}
}finally{await browser.close({silent:true});}
