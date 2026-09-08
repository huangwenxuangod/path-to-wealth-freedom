import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const [file, mode] = process.argv.slice(2);
const data = fs.readFileSync(file);
const html = data.toString();
if (mode === 'original') {
  assert.equal(createHash('sha256').update(data).digest('hex'), '7c9a217eaab509e96a929f219e75946ddb514c13fdbf19a80fd59a3e90f85c95');
  console.log('PASS original: duration=10, blank, SHA256 unchanged');
} else {
  assert.ok(html.includes('data-duration="15"'));
  for (const id of ['s1', 's2', 's3', 'music']) assert.ok(html.includes(`id="${id}"`));
  for (const asset of ['city.jpeg','gsap.min.js','music.wav']) assert.ok(fs.statSync(new URL(asset, import.meta.url)).size > 0);
  console.log('PASS modified: duration=15, scenes=3, audio=1, assets=3');
}
