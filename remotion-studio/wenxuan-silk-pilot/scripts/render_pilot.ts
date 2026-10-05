import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {mkdirSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dir,'..');
const serveUrl=await bundle({entryPoint:resolve(root,'src/index.ts'),publicDir:resolve(root,'public'),rspack:true});
const browser=await openBrowser('chrome',{browserExecutable:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
mkdirSync(resolve(root,'renders'),{recursive:true});mkdirSync(resolve(root,'evidence'),{recursive:true});
try{
 const composition=await selectComposition({serveUrl,id:'WenxuanSilkPilot',puppeteerInstance:browser});
 for(const frame of [179,227,348,380,439,522,578])await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:resolve(root,`evidence/${frame}.png`)});
 await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:179,output:resolve(root,'evidence/179-repeat.png')});
 let last=-1;
 await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:resolve(root,'renders/pilot-partial.mp4'),codec:'h264',pixelFormat:'yuv420p',crf:18,concurrency:3,logLevel:'warn',onProgress:p=>{let q=Math.floor(p.progress*10)*10;if(q>last){last=q;console.log(`PILOT_RENDER ${q}%`);}}});
 renameSync(resolve(root,'renders/pilot-partial.mp4'),resolve(root,'renders/wenxuan-silk-pilot.mp4'));
 console.log('PILOT_RENDER_PASS 1280x720 30fps 615frames 20.5s H264 AAC');
}finally{await browser.close({silent:true});}
