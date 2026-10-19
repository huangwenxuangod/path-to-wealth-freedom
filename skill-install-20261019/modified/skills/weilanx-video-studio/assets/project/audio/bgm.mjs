// 通用配乐：按段落编曲 + 根据人声包络自动闪避（ducking）
// 每期视频在 audio/episodes/epXX-*.mjs 里写自己的段落表并调用 buildBgm
import {readFileSync, writeFileSync} from 'node:fs';
import {
  CHORDS, SR, bass, bell, encodeWav, filterBuf, hat, kick, mixInto, mtof, pluck, reverb, rnd, setSeed, shaker, snap, softClip,
} from './synth.mjs';

const BEAT = 0.5; // 120 BPM
const BAR = 4 * BEAT;

const MINOR = {
  Am: {uke: [69, 60, 64, 69], root: 33},
  F: {uke: [69, 60, 65, 69], root: 29},
  Dm: {uke: [69, 62, 65, 69], root: 38 - 12},
  E: {uke: [68, 64, 68, 71], root: 40 - 12},
};
const MAJOR_PROG = ['C', 'Am', 'F', 'G'];
const MINOR_PROG = ['Am', 'F', 'Dm', 'E'];


export const styleAt = (t, sections) => {
  let cur = sections[0][1];
  for (const [at, st] of sections) if (t >= at) cur = st;
  return cur;
};

const STRUMS = [[0, 'D', 1], [1, 'D', 0.7], [1.5, 'U', 0.5], [2.5, 'U', 0.5], [3, 'D', 0.8], [3.5, 'U', 0.5]];
const BRIGHT_MOTIFS = [
  [[0, 76], [0.5, 79], [1, 81], [2, 79], [3, 76]],
  [[0, 72], [1, 74], [1.5, 76], [2, 79], [3.5, 81]],
  [[0, 77], [0.5, 76], [1, 72], [2, 74], [3, 76]],
  [[0, 79], [1, 81], [2, 84], [3, 79]],
];

const strum = (dst, chord, at, vel, dur = 1.1) => {
  chord.uke.forEach((m, k) => mixInto(dst, pluck(mtof(m), dur, 0.35 + vel * 0.4), at + k * 0.011 + (rnd() - 0.5) * 0.004, 0.45 * vel));
};

export function renderArrangement(seconds, sections) {
  setSeed(42);
  const n = Math.ceil(seconds * SR);
  const music = new Float32Array(n);
  const drums = new Float32Array(n);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();
  const bars = Math.ceil(seconds / BAR);

  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * BAR;
    const st = styleAt(t0, sections);
    const tense = st === 'tense';
    const name = (tense ? MINOR_PROG : MAJOR_PROG)[bar % 4];
    const chord = tense ? MINOR[name] : CHORDS[name];

    if (st === 'end') {
      strum(music, CHORDS.C, t0, 1, 2.6);
      mixInto(music, bass(mtof(36), 1.2), t0, 0.5);
      mixInto(drums, K, t0, 0.8);
      mixInto(drums, Ho, t0, 0.3);
      [72, 76, 79, 84].forEach((m, k) => mixInto(music, bell(mtof(m), 1.6), t0 + k * 0.08, 0.1));
      break;
    }

    // 扫弦
    if (st === 'break') {
      strum(music, chord, t0, 0.65, 1.8);
      strum(music, chord, t0 + 2 * BEAT, 0.45, 1.2);
    } else {
      for (const [beat, dir, vel] of STRUMS) {
        const c = dir === 'D' ? chord : {uke: [...chord.uke].reverse()};
        strum(music, c, t0 + beat * BEAT, vel * (st === 'light' ? 0.8 : 1));
      }
    }

    // 贝斯
    if (st === 'groove' || st === 'bright') {
      mixInto(music, bass(mtof(chord.root)), t0, 0.5);
      mixInto(music, bass(mtof(chord.root + 7), 0.3), t0 + 1.5 * BEAT, 0.35);
      mixInto(music, bass(mtof(chord.root)), t0 + 2 * BEAT, 0.45);
    }
    if (tense) for (let k = 0; k < 8; k++) mixInto(music, bass(mtof(chord.root), 0.22), t0 + k * 0.5 * BEAT, 0.42);

    // 鼓
    if (st === 'light') for (let b = 0; b < 8; b++) mixInto(drums, Sh, t0 + b * 0.5 * BEAT, b % 2 ? 0.1 : 0.16);
    if (st === 'groove' || st === 'bright') {
      mixInto(drums, K, t0, 0.9);
      mixInto(drums, K, t0 + 2 * BEAT, 0.8);
      if (st === 'bright') mixInto(drums, K, t0 + 2.5 * BEAT, 0.5);
      mixInto(drums, S, t0 + BEAT, 0.55);
      mixInto(drums, S, t0 + 3 * BEAT, 0.55);
      for (let b = 0; b < 8; b++) mixInto(drums, b === 7 ? Ho : Hc, t0 + b * 0.5 * BEAT, b % 2 ? 0.12 : 0.2);
    }
    if (tense) {
      mixInto(drums, K, t0, 0.8);
      mixInto(drums, K, t0 + 2 * BEAT, 0.7);
      for (let b = 0; b < 16; b++) mixInto(drums, Hc, t0 + b * 0.25 * BEAT, 0.06 + (b % 4 === 0 ? 0.08 : 0));
      if (bar % 2 === 1) for (let k = 0; k < 4; k++) mixInto(drums, S, t0 + 3 * BEAT + k * 0.25 * BEAT, 0.2 + k * 0.08);
    }

    // 铃音点缀
    if (st === 'bright') for (const [beat, m] of BRIGHT_MOTIFS[bar % 4]) mixInto(music, bell(mtof(m), 1.2), t0 + beat * BEAT, 0.12);
    if (st === 'break' && bar % 2 === 0) [84, 79].forEach((m, k) => mixInto(music, bell(mtof(m), 1.4), t0 + 1 + k * 0.5, 0.09));
  }

  filterBuf(music, 'lp', 6000);
  const wm = reverb(music, 0.24);
  const wd = reverb(drums, 0.08);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = wm[i] + wd[i] * 0.45;
  return softClip(out, 1.1);
}

/* ---------------- 人声包络 & ducking ---------------- */

/** 读 16-bit PCM wav，返回单声道 Float32Array 和采样率 */
export function readWavMono(buf) {
  let p = 12;
  let fmt = null;
  while (p < buf.length - 8) {
    const id = buf.toString('ascii', p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = {ch: buf.readUInt16LE(p + 10), sr: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22)};
    if (id === 'data') {
      if (!fmt || fmt.bits !== 16) throw new Error('only 16-bit PCM wav supported');
      const frames = Math.floor(size / (2 * fmt.ch));
      const out = new Float32Array(frames);
      for (let i = 0; i < frames; i++) {
        let v = 0;
        for (let c = 0; c < fmt.ch; c++) v += buf.readInt16LE(p + 8 + (i * fmt.ch + c) * 2);
        out[i] = v / fmt.ch / 32768;
      }
      return {samples: out, sr: fmt.sr};
    }
    p += 8 + size + (size % 2);
  }
  throw new Error('no data chunk');
}

const HOP = 0.01; // 10ms

/** 人声 RMS 包络（dBFS），每 10ms 一个值，带起音/释放平滑 */
export function voiceEnvelope(samples, sr) {
  const hop = Math.round(sr * HOP);
  const n = Math.floor(samples.length / hop);
  const env = new Float32Array(n);
  let sm = -90;
  for (let k = 0; k < n; k++) {
    let acc = 0;
    for (let i = k * hop; i < (k + 1) * hop; i++) acc += samples[i] * samples[i];
    const db = 10 * Math.log10(acc / hop + 1e-12);
    const coef = db > sm ? 0.5 : 0.035; // 快起慢放
    sm += (db - sm) * coef;
    env[k] = sm;
  }
  return env;
}

/** 人声越响，BGM 压得越低：−45dB 以下不压，−30dB 以上压满 */
export const duckGain = (db, depth = 0.62) => 1 - depth * Math.max(0, Math.min(1, (db + 45) / 15));

export function applyDuck(music, env, depth = 0.62) {
  for (let i = 0; i < music.length; i++) {
    const k = Math.min(env.length - 1, Math.floor(i / SR / HOP));
    music[i] *= duckGain(env[k], depth);
  }
  return music;
}

const rmsNormalize = (buf, target) => {
  let acc = 0;
  for (const v of buf) acc += v * v;
  const rms = Math.sqrt(acc / buf.length);
  for (let i = 0; i < buf.length; i++) buf[i] *= target / rms;
  return buf;
};

/**
 * 读人声 → 按段落编曲 → RMS 定音量 → 结尾淡出 → 人声闪避 → 写 wav
 * sections：[开始秒, 风格] 段落表，风格见 renderArrangement；level：BGM 闪避前的 RMS（默认 0.071，偏轻）；depth：人声出现时压低的比例
 */
export function buildBgm({voice, out, sections, level = 0.071, depth = 0.7}) {
  const {samples, sr} = readWavMono(readFileSync(voice));
  const seconds = samples.length / sr;
  const music = rmsNormalize(renderArrangement(seconds, sections), level);
  for (let i = 0; i < music.length; i++) {
    const t = i / SR;
    if (t > seconds - 1.2) music[i] *= Math.max(0, (seconds - t) / 1.2);
  }
  applyDuck(music, voiceEnvelope(samples, sr), depth);
  writeFileSync(out, encodeWav(music, SR));
  console.log(`wrote ${out} (${seconds.toFixed(2)}s)`);
}
