import assert from 'node:assert/strict';
import {existsSync, readFileSync, realpathSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {videoSpec, metadata, graphemes, type VideoSpec} from '../src/spec';
import {layout} from '../src/tokens';

export const projectRoot = resolve(import.meta.dir, '..');
export function validateAssets(input: unknown): VideoSpec {
  const spec = videoSpec.parse(input);
  const publicRoot = realpathSync(resolve(projectRoot, 'public'));
  for (const name of [spec.logo, 'fonts/NotoSansSC.ttf', 'fonts/mono.woff2']) {
    const file = resolve(publicRoot, name);
    assert(existsSync(file), `Missing asset: ${name}`);
    assert(realpathSync(file).startsWith(publicRoot + sep), `Asset escapes public: ${name}`);
  }
  return spec;
}

if (import.meta.main) {
  let cases = 0;
  const benchmark = JSON.parse(readFileSync(resolve(projectRoot, 'data/benchmark.json'), 'utf8'));
  const demo = JSON.parse(readFileSync(resolve(projectRoot, 'data/demo.json'), 'utf8'));
  for (const sample of [benchmark, demo]) for (const format of ['landscape', 'portrait']) for (const fps of [30, 60]) {
    const spec = validateAssets({...sample, format, fps});
    const meta = metadata(spec); assert.equal(meta.durationInFrames / meta.fps, 8);
    const stage = layout(format === 'portrait', spec.tools.length);
    for (const card of stage.cards) {assert(card.x >= 80 && card.x + card.w <= meta.width - 80); assert(card.y > 300 && card.y + card.h < meta.height - 200);}
    cases++;
  }
  for (const change of [{title: ''}, {title: '长'.repeat(25)}, {subtitle: '长'.repeat(49)}, {fps: 0}, {fps: 24}, {durationSeconds: -1}, {durationSeconds: 0}, {durationSeconds: 3}, {logo: '../secret'}, {logo: '/tmp/logo.png'}, {logo: 'https://example.com/logo.png'}, {logo: 'logos/missing.png'}, {tools: []}, {tools: [benchmark.tools[0], benchmark.tools[0]]}, {tools: [...benchmark.tools, benchmark.tools[0]]}]) {
    assert.throws(() => validateAssets({...benchmark, ...change}), `Expected rejection: ${JSON.stringify(change)}`); cases++;
  }
  validateAssets({...benchmark, tools: [benchmark.tools[0]]}); cases++;
  validateAssets({...benchmark, template: 'beam-overlay', durationSeconds: 3}); cases++;
  assert.equal(graphemes('👩‍💻中文').length, 3); cases++;
  assert.throws(() => metadata(videoSpec.parse(benchmark), 'beam-overlay')); cases++;
  const pkg = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));
  for (const [name, version] of Object.entries(pkg.dependencies)) if (name.startsWith('@remotion/')) assert.equal(version, pkg.dependencies.remotion, `Version mismatch: ${name}`);
  console.log(`CHECK_PASS ${cases} cases; assets, input boundaries, fps, layouts, versions`);
}
