import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {prepare} from './render';
import {projectRoot, validateAssets} from './check';

process.chdir(projectRoot);
mkdirSync('evidence', {recursive: true});
const command = (file: string, args: string[]) => execFileSync(file, args, {maxBuffer: 40 * 1024 * 1024});
const rgba = (file: string) => command('ffmpeg', ['-v','error','-i',file,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','-']);
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const mode = process.argv[2] ?? 'all';
assert(['all', 'stills', 'media'].includes(mode), 'Unknown verification mode');

if (mode !== 'media') {
  const {serveUrl, browser} = await prepare();
  const results: Record<string, unknown> = {};
  try {
    const input = JSON.parse(readFileSync('data/benchmark.json', 'utf8'));
    const props = validateAssets(input);
    const composition = await selectComposition({serveUrl, id: 'AgentWorkflow', inputProps: props, puppeteerInstance: browser});
    const hashes: string[] = [];
    // Same browser, fresh renderer pages, deliberately non-monotonic requests.
    for (const [index, frame] of [120, 0, 239, 120].entries()) {
      const file = `evidence/order-${index}-${frame}.png`;
      await renderStill({serveUrl, composition, inputProps: props, puppeteerInstance: browser, frame, scale: 0.5, output: file, imageFormat: 'png', logLevel: 'warn'});
      hashes.push(hash(rgba(file)));
    }
    assert.equal(hashes[0], hashes[3], 'Repeated frame pixel mismatch');
    assert.notEqual(hashes[0], hashes[1], 'Animation did not advance');
    results.frameOrder = {frames: [120,0,239,120], hashes, equalRepeat: true};
    for (const frame of [24, 54, 90, 114, 132, 159, 210]) {
      await renderStill({serveUrl, composition, inputProps: props, puppeteerInstance: browser, frame, scale: 0.5, output: `evidence/frame-${frame}.png`, imageFormat: 'png', logLevel: 'warn'});
    }
    const sixty = validateAssets({...input, fps: 60});
    const c60 = await selectComposition({serveUrl, id: 'AgentWorkflow', inputProps: sixty, puppeteerInstance: browser});
    await renderStill({serveUrl, composition: c60, inputProps: sixty, puppeteerInstance: browser, frame: 240, scale: 0.5, output: 'evidence/fps60.png', imageFormat: 'png', logLevel: 'warn'});
    assert.equal(hash(rgba('evidence/fps60.png')), hashes[0], '30/60 fps same-second pixels differ');
    results.fps = {sameSecond: 4, exactPixels: true};
    const variants = [
      {name: 'portrait-four', props: {...input, format: 'portrait'}},
      {name: 'portrait-demo', props: JSON.parse(readFileSync('data/demo.json', 'utf8'))},
      {name: 'single-node', props: {...input, tools: [input.tools[0]]}},
      {name: 'long-text', props: {...input, format: 'portrait', title: '长'.repeat(24), subtitle: '字幕'.repeat(24), tools: input.tools.map((t: Record<string, string>) => ({...t, label: '资料'.repeat(4)}))}},
    ];
    for (const variant of variants) {
      const p = validateAssets(variant.props);
      const c = await selectComposition({serveUrl, id: 'AgentWorkflow', inputProps: p, puppeteerInstance: browser});
      await renderStill({serveUrl, composition: c, inputProps: p, puppeteerInstance: browser, frame: 210, scale: 0.5, output: `evidence/${variant.name}.png`, imageFormat: 'png', logLevel: 'warn'});
    }
    results.variants = variants.map((v) => v.name);
    writeFileSync('evidence/stills-verification.json', JSON.stringify(results, null, 2));
    console.log('STILLS_PASS repeated-frame pixels; 30/60fps parity; 4 input/layout variants; 7 keyframes');
  } finally {await browser.close({silent: true});}
}

if (mode !== 'stills') {
  const reports = [];
  for (const [file, width, height, duration, codec] of [
    ['agent-workflow.mp4',1920,1080,8,'h264'],
    ['agent-workflow-portrait.mp4',1080,1920,8,'h264'],
    ['beam-overlay.mov',1920,1080,3,'prores'],
  ] as const) {
    const path = resolve('renders', file);
    const info = JSON.parse(command('ffprobe', ['-v','error','-show_entries','format=duration:stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_frames','-of','json',path]).toString());
    const video = info.streams[0]; assert.equal(video.width, width); assert.equal(video.height, height); assert.equal(video.codec_name, codec); assert.equal(video.r_frame_rate, '30/1'); assert(Math.abs(Number(info.format.duration) - duration) < 0.04);
    command('ffmpeg', ['-v','error','-xerror','-i',path,'-f','null','-']);
    reports.push({file, ...video, duration: info.format.duration, fullDecode: 'PASS'});
  }
  command('ffmpeg', ['-y','-v','error','-ss','0.9','-i','renders/beam-overlay.mov','-frames:v','1','-pix_fmt','rgba','evidence/overlay-alpha.png']);
  const pixels = rgba('evidence/overlay-alpha.png');
  let transparent = 0, visible = 0, partial = 0;
  for (let i = 3; i < pixels.length; i += 4) {if (pixels[i] === 0) transparent++; else visible++; if (pixels[i] > 0 && pixels[i] < 255) partial++;}
  assert(transparent > 1920 * 1080 * 0.9 && visible > 1000 && partial > 100, 'Alpha must contain background + antialiased beam');
  for (const [name, bg] of [['dark','#090c0b'],['light','#f1f0e8'],['color','#283b6e']]) {
    command('ffmpeg', ['-y','-v','error','-f','lavfi','-i',`color=c=${bg}:s=1920x1080`,'-i','evidence/overlay-alpha.png','-filter_complex','[0:v][1:v]overlay=0:0:format=auto','-frames:v','1',`evidence/alpha-on-${name}.png`]);
  }
  mkdirSync('renders/beam-png', {recursive: true});
  command('ffmpeg', ['-y','-v','error','-i','renders/beam-overlay.mov','-pix_fmt','rgba','renders/beam-png/frame-%04d.png']);
  writeFileSync('evidence/media-verification.json', JSON.stringify({reports, alpha: {transparent, visible, partial}, pngSequence: {frames: 90, fps: 30}}, null, 2));
  console.log('MEDIA_PASS 3 videos; full decode; dimensions/fps/duration; alpha; PNG sequence');
}
