import {bundle} from '@remotion/bundler';
import {configureBundler} from '../bundler';
import {openBrowser, renderMedia, selectComposition} from '@remotion/renderer';
import {mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {projectRoot, validateAssets} from './check';

export async function prepare() {
  const serveUrl = await bundle({entryPoint: resolve(projectRoot, 'src/index.ts'), rspack: true, bundlerOverride: configureBundler});
  const browser = await openBrowser('chrome', {browserExecutable: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  return {serveUrl, browser};
}

if (import.meta.main) {
  const mode = process.argv[2] ?? 'benchmark';
  if (!['benchmark','portrait','overlay'].includes(mode)) throw new Error(`Unknown render preset: ${mode}`);
  const input = JSON.parse(readFileSync(resolve(projectRoot, mode === 'portrait' ? 'data/demo.json' : 'data/benchmark.json'), 'utf8'));
  if (mode === 'overlay') Object.assign(input, {template: 'beam-overlay', durationSeconds: 3, outputBackground: 'transparent'});
  const props = validateAssets(input);
  const id = mode === 'overlay' ? 'BeamOverlay' : 'AgentWorkflow';
  const filename = mode === 'overlay' ? 'beam-overlay.mov' : mode === 'portrait' ? 'agent-workflow-portrait.mp4' : 'agent-workflow.mp4';
  mkdirSync(resolve(projectRoot, 'renders'), {recursive: true}); mkdirSync(resolve(projectRoot, 'evidence'), {recursive: true});
  const started = performance.now();
  const {serveUrl, browser} = await prepare();
  try {
    const composition = await selectComposition({serveUrl, id, inputProps: props, puppeteerInstance: browser});
    await renderMedia({serveUrl, composition, inputProps: props, puppeteerInstance: browser, outputLocation: resolve(projectRoot, 'renders', `.partial-${filename}`),
      codec: mode === 'overlay' ? 'prores' : 'h264', pixelFormat: mode === 'overlay' ? 'yuva444p10le' : 'yuv420p',
      ...(mode === 'overlay' ? {proResProfile: '4444' as const} : {}), imageFormat: 'png', concurrency: 2, logLevel: 'warn'});
    renameSync(resolve(projectRoot, 'renders', `.partial-${filename}`), resolve(projectRoot, 'renders', filename));
    const sourceSha256 = createHash('sha256').update(['src/AgentWorkflow.tsx','src/BeamOverlay.tsx','src/tokens.ts','src/Root.tsx','src/components/AnimatedBeam.tsx','src/components/Visuals.tsx'].map((name) => readFileSync(resolve(projectRoot, name), 'utf8')).join('\n')).digest('hex');
    const result = {mode, output: filename, sourceSha256, seconds: Number(((performance.now() - started) / 1000).toFixed(2)), processRssBytes: process.memoryUsage().rss, concurrency: 2, width: composition.width, height: composition.height, fps: composition.fps, frames: composition.durationInFrames};
    writeFileSync(resolve(projectRoot, 'evidence', `render-${mode}.json`), JSON.stringify(result, null, 2));
    console.log(`RENDER_PASS ${JSON.stringify(result)}`);
  } finally {await browser.close({silent: true});}
}
