import assert from 'node:assert/strict';
import {readFileSync,realpathSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {astraSpec,astraMetadata} from '../src/astra6/spec';
import input from '../data/astra6.json';
export function validateAstra(value:unknown) {
 const props=astraSpec.parse(value);const root=realpathSync(resolve(import.meta.dir,'../public'));
 const manifest=JSON.parse(readFileSync(resolve(root,'astra6/assets.json'),'utf8')) as {localPath:string;sha256:string}[];
 assert(manifest.some(a=>a.localPath===props.logo),'Logo missing from asset manifest');
 for (const a of manifest) {const f=realpathSync(resolve(root,a.localPath));assert(f.startsWith(root+sep));assert.equal(createHash('sha256').update(readFileSync(f)).digest('hex'),a.sha256,'Asset hash mismatch');}
 return props;
}
if(import.meta.main){
 validateAstra(input);let cases=1;
 for(const fps of [30,60]) {const m=astraMetadata({...input,fps} as never);assert.equal(m.durationInFrames,36*fps);cases++;}
 for(const patch of [{fps:24},{durationSeconds:8},{logo:'../secret'},{logo:'astra6/missing.svg'},{title:'长'.repeat(25)},{advantages:[]},{advantages:[...input.advantages].reverse()},{benchmark:{...input.benchmark,astra:58}},{benchmark:{...input.benchmark,unit:'倍'}}]){assert.throws(()=>validateAstra({...input,...patch}));cases++;}
 console.log(`ASTRA_CHECK_PASS ${cases} cases; schema, facts, assets, fps`);
}
