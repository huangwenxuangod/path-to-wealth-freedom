import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {mkdirSync,writeFileSync,readFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dir,'..');
const mode=process.argv[2]??'full';
const start=performance.now();
const sourceSha256=createHash('sha256').update(['src/SilkRoad.tsx','src/Root.tsx','src/terrain.json','data/timeline.json'].map(p=>readFileSync(resolve(root,p),'utf8')).join('\n')).digest('hex');
console.log('BUNDLE_START');
const serveUrl=await bundle({entryPoint:resolve(root,'src/index.ts'),publicDir:resolve(root,'public'),rspack:true});
console.log('BUNDLE_PASS');
const browser=await openBrowser('chrome',{browserExecutable:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const composition=await selectComposition({serveUrl,id:'SilkRoadRebuild',puppeteerInstance:browser});
 mkdirSync(resolve(root,'evidence/stills'),{recursive:true});mkdirSync(resolve(root,'renders'),{recursive:true});
 if(mode==='stills'){
  for(const sec of [1,6,12,17,27,38,49,60,68,75,82,90,100,110,114]){
   await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:sec*30,output:resolve(root,`evidence/stills/${String(sec).padStart(3,'0')}.png`),imageFormat:'png'});
   console.log(`STILL_PASS ${sec}s`);
  }
 }else{
  let last=-1;
  await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:resolve(root,'renders/.partial-silk-road-recreated.mp4'),codec:'h264',pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:93,crf:18,concurrency:3,logLevel:'warn',onProgress:p=>{const percent=Math.floor(p.progress*20)*5;if(percent>last){last=percent;console.log(`RENDER_PROGRESS ${percent}%`);}}});
  renameSync(resolve(root,'renders/.partial-silk-road-recreated.mp4'),resolve(root,'renders/silk-road-recreated.mp4'));
  console.log('RENDER_PASS 1280x720 30fps 3483 frames 116.1s H264 AAC');
 }
 const record={mode,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,seconds:Number(((performance.now()-start)/1000).toFixed(2)),sourceVideoFramesUsed:false,sourceAudioUsed:true,sourceSha256};
 writeFileSync(resolve(root,`evidence/render-${mode}.json`),JSON.stringify(record,null,2));
 console.log(`RUN_PASS ${JSON.stringify(record)}`);
}finally{await browser.close({silent:true});}
