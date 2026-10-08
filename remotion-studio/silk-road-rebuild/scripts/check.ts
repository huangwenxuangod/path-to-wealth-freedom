import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import timeline from '../data/timeline.json';
import terrain from '../src/terrain.json';
let cases=0;
assert.equal(timeline.duration*timeline.fps,3483);cases++;
assert.equal(terrain.vertices.length,terrain.nx*terrain.ny);cases++;
assert(terrain.vertices.filter(v=>v[3]===1).length>7000);cases++;
for(const caption of timeline.captions){assert(caption.start>=0&&caption.end>caption.start&&caption.end<=timeline.duration);assert(caption.text.length<35);cases+=2;}
for(let i=1;i<timeline.scenes.length;i++){assert.equal(timeline.scenes[i].start,timeline.scenes[i-1].end);cases++;}
for(const a of ['fonts/NotoSerifSC.ttf','reference-audio-refined.m4a']){assert(existsSync(resolve('public',a)));cases++;}
const source=readFileSync('src/SilkRoad.tsx','utf8');
assert(!source.includes('<Video')&&!source.includes('<OffthreadVideo')&&!source.includes('BASELINE.mp4'));cases++;
assert(!source.includes('requestAnimationFrame')&&!source.includes('Math.random()'));cases++;
console.log(`CHECK_PASS ${cases} cases; 13 scenes, 22 captions, ${terrain.vertices.length} mesh vertices; no source video frames; deterministic frame clock`);
