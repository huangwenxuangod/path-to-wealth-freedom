import {renderMedia,selectComposition,renderStill} from '@remotion/renderer';
import {mkdirSync,readFileSync,readdirSync,writeFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {prepare} from './render';
import {validateAstra} from './check-astra';
import input from '../data/astra6.json';
process.chdir(resolve(import.meta.dir,'..'));
export function sourceHash(){const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);return createHash('sha256').update([...walk('src'),...walk('public/astra6'),'data/astra6.json','package.json','bun.lock','bundler.ts','remotion.config.ts','scripts/render-astra.ts'].sort().map(f=>f+'\n'+createHash('sha256').update(readFileSync(f)).digest('hex')).join('\n')).digest('hex');}
if(import.meta.main){
 const props=validateAstra(input);mkdirSync('renders',{recursive:true});mkdirSync('evidence/astra',{recursive:true});
 const {serveUrl,browser}=await prepare();try{
 const composition=await selectComposition({serveUrl,id:'AstraOverview',inputProps:props,puppeteerInstance:browser});
 if(process.argv.includes('--stills')){for(const f of [90,300,570,810,1020]) await renderStill({serveUrl,composition,inputProps:props,puppeteerInstance:browser,frame:f,output:`evidence/astra/frame-${f}.png`,scale:.5,imageFormat:'png',logLevel:'warn'});console.log('ASTRA_STILLS_PASS 5 scenes');}
 else {const start=performance.now();const before=sourceHash();await renderMedia({serveUrl,composition,inputProps:props,puppeteerInstance:browser,outputLocation:'renders/.partial-astra6-overview.mp4',codec:'h264',pixelFormat:'yuv420p',imageFormat:'png',concurrency:2,logLevel:'warn'});if(sourceHash()!==before)throw new Error('Source changed during render');renameSync('renders/.partial-astra6-overview.mp4','renders/astra6-overview.mp4');const result={sourceSha256:before,width:1920,height:1080,fps:30,frames:1080,duration:36,seconds:(performance.now()-start)/1000};writeFileSync('evidence/astra/render.json',JSON.stringify(result,null,2));console.log('ASTRA_RENDER_PASS '+JSON.stringify(result));}
 }finally{await browser.close({silent:true});}
}
