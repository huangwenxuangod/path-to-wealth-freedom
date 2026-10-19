// 逐段写总谱用的工具：乐器、和弦、节拍网格、按字幕取时间、出片（RMS 定音量 + 人声闪避 + 分段响度报告）。
// 用法见 audio/episodes/ep18-ai-history.mjs：写一个 render(seconds, {cs, cwT}) 返回单声道 Float32Array，交给 writeScore。
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyDuck, readWavMono, voiceEnvelope} from './bgm.mjs';
import {SR, encodeWav, filterBuf, mtof, noise, rnd} from './synth.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 读某一期的字幕：cs(n) 第 n 句开始秒数，cwT(n, 词) 说到某词的秒数（和画面的 cw 同一套算法） */
export const loadCues = (ep) => {
  const CUES = JSON.parse(readFileSync(join(root, 'src', 'episodes', ep, 'cues.json'), 'utf8'));
  const cs = (n) => CUES[n - 1].start;
  const cwT = (n, word) => {
    const c = CUES[n - 1];
    const i = c.text.indexOf(word);
    if (i < 0) throw new Error(`cue ${n} 里没有「${word}」`);
    return c.start + (i / c.text.length) * (c.end - c.start);
  };
  return {cs, cwT};
};

/* ---------------- 乐器 ---------------- */

export const lp1 = (buf, cut) => {
  const a = 1 - Math.exp((-2 * Math.PI * cut) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y);
  return buf;
};
export const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));

/** 铺底：三根微失谐锯齿波 + 两级低通，慢起慢收 */
export const pad = (notes, dur, {atk = 1, rel = 1.2, cut = 1300, det = 0.004} = {}) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (const m of notes)
    for (const d of [-det, 0, det]) {
      let ph = rnd();
      const inc = (mtof(m) * (1 + d)) / SR;
      for (let i = 0; i < n; i++) out[i] += saw((ph += inc));
    }
  lp1(lp1(out, cut), cut);
  const k = 1 / (notes.length * 3);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] *= k * Math.min(1, t / atk) * Math.min(1, (dur - t) / rel);
  }
  return out;
};

/** 方波脉冲：机器、规则、80 年代合成器 */
export const pulse = (m, dur = 0.2, {width = 0.3, cut = 2600, decay = 10, glide = 0} = {}) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (mtof(m + glide * (t / dur)) / SR) % 1;
    out[i] = (ph % 1 < width ? 1 : -1) * Math.exp(-t * decay) * Math.min(1, i / 30) * Math.min(1, (n - i) / 300);
  }
  return lp1(lp1(out, cut), cut);
};

/** 八音盒：开头和结尾的 1958 年主题 */
export const mbox = (m, dur = 1.8) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const f = mtof(m);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2.2) + 0.3 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 6) + 0.1 * Math.sin(2 * Math.PI * f * 5.9 * t) * Math.exp(-t * 11)) * Math.min(1, i / 25);
  }
  return out;
};

/** 低频重击：段落起点和关键词 */
export const boom = (dur = 1.8, from = 82, to = 34) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (to + (from - to) * Math.exp(-t * 7)) / SR;
    out[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 2.4) * Math.min(1, i / 60);
  }
  return out;
};

/** 下坠音：「可好景不长」「可深蓝只会下棋」 */
export const fall = (dur = 1.1, from = 620, to = 140) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (from * Math.pow(to / from, t / dur)) / SR;
    out[i] = (Math.sin(2 * Math.PI * ph) * 0.7 + saw(ph) * 0.3) * Math.min(1, i / 200) * (1 - t / dur);
  }
  return lp1(out, 2500);
};

/** 噪声渐强：推向下一个重拍 */
export const swell = (dur, {from = 300, to = 6000} = {}) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let y = 0;
  let lo = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const a = 1 - Math.exp((-2 * Math.PI * from * Math.pow(to / from, t)) / SR);
    y += a * (noise() - y);
    lo += 0.01 * (y - lo);
    out[i] = (y - lo) * Math.pow(t, 2.2) * Math.min(1, (n - i) / 120);
  }
  return out;
};

export const crash = (dur = 1.8) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = noise() * Math.exp((-i / SR) * 2.6);
  return filterBuf(out, 'hp', 4200);
};

/** 钟表滴答：等待、争论没完没了 */
export const tick = (hi = true) => {
  const n = Math.round(0.03 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = noise() * Math.exp((-i / SR) * 260);
  filterBuf(out, 'bp', hi ? 3600 : 2300, 4);
  for (let i = 0; i < n; i++) out[i] *= 7;
  return out;
};

/** 旧唱片底噪：1958 年的档案感 */
export const crackle = (dur) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = noise() * 0.04;
    if (rnd() < 22 / SR) out[i] += (rnd() - 0.5) * 2.4;
  }
  filterBuf(out, 'hp', 900);
  for (let i = 0; i < n; i++) out[i] *= Math.min(1, i / SR / 0.6, (n - i) / SR / 0.6);
  return lp1(out, 6000);
};

/** 寒风：两次寒冬 */
export const wind = (dur) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const cut = Math.max(80, 500 + 380 * Math.sin(t * 1.7) + 200 * Math.sin(t * 0.63)); // 两条正弦叠到最低会变负，滤波器会发散
    y += (1 - Math.exp((-2 * Math.PI * cut) / SR)) * (noise() - y);
    out[i] = y * Math.min(1, t / 1.2, (dur - t) / 1.2);
  }
  return out;
};

/* ---------------- 编曲工具 ---------------- */

export const CH = {
  Dm: [50, 57, 62, 65], Dsus: [50, 55, 57, 62], D: [50, 57, 62, 66], Dadd9: [50, 57, 64, 66],
  Am: [45, 52, 57, 60], F: [41, 48, 53, 57], C: [48, 52, 55, 60], G: [43, 50, 55, 59], E: [40, 47, 52, 56],
  Bb: [46, 53, 58, 62], Bm: [47, 54, 59, 62], A: [45, 52, 57, 61], Fm: [41, 48, 53, 56], Cadd9: [48, 55, 62, 64],
};
export const up = (c, k) => c.map((m) => m + k);

/** 从 t0 到 t1 按拍子走，fn(拍点秒数, 第几拍) */
export const grid = (t0, t1, beat, fn) => {
  for (let b = 0; t0 + b * beat < t1 - 1e-6; b++) fn(t0 + b * beat, b);
};

/**
 * 出片：读人声 → render 出总谱 → 整轨 RMS 定到 level → 结尾 1.5 秒淡出 → 人声闪避 → 写 public/audio/<期>/bgm.wav，
 * 并按 segs（[开始秒, 名字]）打印每段闪避前后的响度，方便检查起伏。
 */
export function writeScore({ep, render, segs = [], level = 0.071, depth = 0.7}) {
  const dir = join(root, 'public', 'audio', ep);
  const {samples, sr} = readWavMono(readFileSync(join(dir, 'voice.wav')));
  const seconds = samples.length / sr;
  const music = render(seconds, loadCues(ep));
  let acc = 0;
  for (const v of music) acc += v * v;
  const g = level / Math.sqrt(acc / music.length);
  for (let i = 0; i < music.length; i++) {
    const t = i / SR;
    music[i] *= g * (t > seconds - 1.5 ? Math.max(0, (seconds - t) / 1.5) : 1);
  }
  const dry = Float32Array.from(music);
  applyDuck(music, voiceEnvelope(samples, sr), depth);
  writeFileSync(join(dir, 'bgm.wav'), encodeWav(music, SR));
  console.log(`wrote ${ep}/bgm.wav (${seconds.toFixed(2)}s)`);
  const all = [...segs, [seconds, '']];
  for (let k = 0; k < all.length - 1; k++) {
    const a = Math.floor(all[k][0] * SR), b = Math.floor(all[k + 1][0] * SR);
    let s = 0, s0 = 0;
    for (let i = a; i < b; i++) {
      s0 += dry[i] * dry[i];
      s += music[i] * music[i];
    }
    const db = (v) => (20 * Math.log10(Math.sqrt(v / (b - a)))).toFixed(1);
    console.log(`${all[k][0].toFixed(1).padStart(6)}s ${all[k][1].padEnd(12)} 闪避前 ${db(s0)} / 闪避后 ${db(s)} dB`);
  }
}
