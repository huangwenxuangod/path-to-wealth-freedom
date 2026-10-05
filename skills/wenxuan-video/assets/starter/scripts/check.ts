import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import spec from '../data/storyboard.json';
import {stateAt} from '../src/model';
let cases=0;
assert(Number.isInteger(spec.duration*spec.fps));cases++;
assert.equal(spec.scenes[0].start,0);assert.equal(spec.scenes.at(-1)?.end,spec.duration);cases+=2;
for(let i=0;i<spec.scenes.length;i++){const s=spec.scenes[i];assert(s.end>s.start);if(i)assert.equal(s.start,spec.scenes[i-1].end);cases++;}
for(const c of spec.captions){assert(c.start>=0&&c.end<=spec.duration&&c.end>c.start);cases++;}
for(const t of [0,1,3,5,7.9]){assert.deepEqual(stateAt(t),stateAt(t));cases++;}
assert(stateAt(7).profit<stateAt(1).profit);assert(stateAt(4).entry>stateAt(1).entry);cases+=2;
const audio=spec.audio as {voice:string|null;music:string|null;sfx:{at:number;duration:number;file:string;gain:number}[];voiceIntervals:number[][];musicGain:number;duckGain:number};
for(const f of [audio.voice,audio.music,...audio.sfx.map(s=>s.file),spec.theme.fontFile])if(f){assert(existsSync(`public/${f}`));cases++;}
for(const [start,end] of audio.voiceIntervals)assert(start>=0&&end>start&&end<=spec.duration);
for(const cue of audio.sfx)assert(cue.at>=0&&cue.duration>0&&cue.at+cue.duration<=spec.duration&&cue.gain>=0&&cue.gain<=1);
assert(audio.duckGain<=audio.musicGain);cases++;
for(const name of readdirSync('src'))if(/tsx?$/.test(name)){const code=readFileSync(`src/${name}`,'utf8');assert(!/Math\.random\(|Date\.now\(|requestAnimationFrame\(/.test(code));cases++;}
console.log(`STARTER_CHECK_PASS ${cases} checks; causal_state_changes=yes frame_clock=yes`);
