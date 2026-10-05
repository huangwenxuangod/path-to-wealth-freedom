import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {mkdirSync,renameSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const mode=process.argv[2]??'stills';
mkdirSync('renders',{recursive:true});mkdirSync('evidence',{recursive:true});
const serveUrl=await bundle({entryPoint:resolve('src/index.ts'),publicDir:resolve('public'),rspack:true});
const browser=await openBrowser('chrome',process.env.CHROME_PATH?{browserExecutable:process.env.CHROME_PATH}:{});
try{
 const composition=await selectComposition({serveUrl,id:'KnowledgeVideo',puppeteerInstance:browser});
 if(mode==='stills'){
  for(const f of [0,30,90,150,210])await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:f,imageFormat:'png',output:`evidence/frame-${f}.png`});
  await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:90,imageFormat:'png',output:'evidence/frame-90-repeat.png'});
  const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
  if(hash('evidence/frame-90.png')!==hash('evidence/frame-90-repeat.png'))throw Error('seek nondeterminism');
  console.log('STILLS_PASS 5 frames; repeat_frame_hash_identical=yes');
 }else{
  await renderMedia({serveUrl,composition,puppeteerInstance:browser,codec:'h264',pixelFormat:'yuv420p',crf:18,concurrency:2,outputLocation:'renders/.partial-knowledge.mp4'});
  renameSync('renders/.partial-knowledge.mp4','renders/knowledge.mp4');
  console.log(`RENDER_PASS ${composition.width}x${composition.height} ${composition.fps}fps ${composition.durationInFrames}frames`);
 }
 writeFileSync(`evidence/render-${mode}.json`,JSON.stringify({mode,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames},null,2));
}finally{await browser.close({silent:true});}
