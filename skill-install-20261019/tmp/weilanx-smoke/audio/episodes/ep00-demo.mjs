// demo（30 秒复刻）的 BGM：纯合成，没有人声 → public/audio/ep00-demo/bgm.wav
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {encodeWav, renderBgm, SR} from '../synth.mjs';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', 'ep00-demo');
mkdirSync(dir, {recursive: true});
writeFileSync(join(dir, 'bgm.wav'), encodeWav(renderBgm(), SR));
console.log(`wrote ${join(dir, 'bgm.wav')}`);
