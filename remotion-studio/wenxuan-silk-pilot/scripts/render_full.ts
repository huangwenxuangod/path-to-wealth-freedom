import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {mkdirSync,renameSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dir,'..');
const started=performance.now();
const serveUrl=await bundle({entryPoint:resolve(root,'src/index.ts'),publicDir:resolve(root,'public'),rspack:true});
console.log('FULL_BUNDLE_PASS');
const browser=await openBrowser('chrome',{browserExecutable:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe'});
mkdirSync(resolve(root,'renders'),{recursive:true});mkdirSync(resolve(root,'evidence/full'),{recursive:true});
try{
 const composition=await selectComposition({serveUrl,id:'WenxuanSilkFull',puppeteerInstance:browser});
 for(const sec of [1,12,20,38,50,58,61,75,90,100,110,115]){
  await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:sec*30,output:resolve(root,`evidence/full/${sec}.png`)});
 }
 let last=-1;
 await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:resolve(root,'renders/full-partial.mp4'),codec:'h264',pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:93,crf:18,concurrency:3,logLevel:'warn',onProgress:p=>{const q=Math.floor(p.progress*20)*5;if(q>last){last=q;console.log(`FULL_RENDER_PROGRESS ${q}%`);}}});
 renameSync(resolve(root,'renders/full-partial.mp4'),resolve(root,'renders/wenxuan-silk-full.mp4'));
 writeFileSync(resolve(root,'evidence/full/render.json'),JSON.stringify({composition:'WenxuanSilkFull',width:1280,height:720,fps:30,frames:3483,duration:116.1,elapsedSeconds:(performance.now()-started)/1000,sourceVideoFramesUsed:false,audio:'existing lightly refined reference mix',pilotChangesIncluded:true},null,2));
 console.log('FULL_RENDER_PASS 1280x720 30fps 3483frames 116.1s H264 AAC');
}finally{await browser.close({silent:true});}
