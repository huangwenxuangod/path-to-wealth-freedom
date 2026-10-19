// library-halftone 网点档案风预览的配乐：用 bgm.mjs 的 120 BPM 编曲合成（和参考视频同速），
// 没有人声，配乐就是主音轨，响度定在 −16 LUFS → public/audio/library-halftone/bgm.wav
// 段落按预览的 9 场排：片头明亮 → 罪状轻快 / 律动 → 夜里那场转小调 → 宣判前留白 2 秒 → 印章落下时回到明亮 → 收尾和弦
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderArrangement} from '../bgm.mjs';
import {SR, encodeWav} from '../synth.mjs';

const ID = 'library-halftone';
const SECONDS = 45;
const sections = [
  [0, 'bright'], // 片头字母落下
  [4, 'light'], // 起诉书、档案照
  [14, 'groove'], // 罪状 01
  [20, 'tense'], // 罪状 02 凌晨巡逻
  [24, 'groove'], // 罪状 03
  [30, 'light'], // 证据墙
  [34, 'break'], // 「罪名成立？」之后留白
  [36, 'bright'], // 宣判印章（36.3 秒）落在明亮段的第一拍附近
  [40, 'light'], // 结案
  [44, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', ID);
mkdirSync(dir, {recursive: true});
const raw = join(tmpdir(), `${ID}-raw.wav`);
writeFileSync(raw, encodeWav(renderArrangement(SECONDS, sections), SR));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', `afade=t=out:st=${SECONDS - 1.5}:d=1.5,loudnorm=I=-16:TP=-1.5:LRA=11`, '-ar', '48000', '-ac', '2', join(dir, 'bgm.wav')]);
console.log(`wrote ${ID}/bgm.wav (${SECONDS}s @ -16 LUFS)`);
