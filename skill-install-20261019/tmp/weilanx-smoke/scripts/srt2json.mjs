// SRT → src/explainer/cues.json
// 用法：npm run cues -- materials/02-像素手绘风/00-用CC做口播动画/字幕.srt src/episodes/ep03-cc/cues.json
import {readFileSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const toSec = (t) => {
  const [h, m, rest] = t.trim().split(':');
  return +h * 3600 + +m * 60 + +rest.replace(',', '.');
};

export function parseSrt(src) {
  return src
    .replace(/\r/g, '')
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const [idx, time, ...text] = block.split('\n');
      const [a, b] = time.split('-->');
      return {i: +idx, start: toSec(a), end: toSec(b), text: text.join('').trim()};
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [file, out] = process.argv.slice(2);
  if (!file || !out) throw new Error('usage: npm run cues -- <字幕.srt> <src/episodes/<期>/cues.json>');
  const cues = parseSrt(readFileSync(file, 'utf8'));
  writeFileSync(out, JSON.stringify(cues, null, 1) + '\n');
  console.log(`wrote ${cues.length} cues → ${out}`);
}
