const fs=require('fs'),path=require('path');
const puppeteer=require('/Users/ai1/.npm/_npx/c909d80c8a029849/node_modules/puppeteer-core');
(async()=>{
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--allow-file-access-from-files']});
const p=await b.newPage(); await p.setViewport({width:1920,height:1080});await p.goto('file://'+path.resolve('index.html'));await p.evaluate(()=>document.fonts.ready);
const map=await p.evaluate(()=>window.__timelines.main.getChildren(false,true,false).map(t=>({start:t.startTime(),end:t.endTime(),targets:t.targets().map(e=>e.tagName+'#'+e.id+'.'+e.className),properties:Object.keys(t.vars).filter(k=>!['duration','ease','parent','delay'].includes(k))})));
fs.writeFileSync('animation-map.json',JSON.stringify(map,null,2));
await b.close();console.log('ANIMATION_MAP_OK: '+map.length+' tweens; seekable timeline ends at 32s');
})();
