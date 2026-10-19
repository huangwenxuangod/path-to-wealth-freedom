// 纯代码合成 BGM 与音效，不依赖任何外部素材。
// 运行：node audio/synth.mjs → public/audio/bgm.wav + public/audio/sfx/*.wav
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

export const SR = 44100;
export const BPM = 120;
const BEAT = 60 / BPM; // 0.5s，一小节 = 2s
const BGM_SECONDS = 30;

/* ---------------- 基础工具 ---------------- */

let seed = 1;
export const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
export const setSeed = (v) => {
  seed = v;
};
export const noise = () => rnd() * 2 - 1;
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

/** 把 src 叠加进 dst 的 at 秒处 */
export const mixInto = (dst, src, at, gain = 1) => {
  const off = Math.round(at * SR);
  for (let i = 0; i < src.length; i++) {
    const j = off + i;
    if (j >= 0 && j < dst.length) dst[j] += src[i] * gain;
  }
};

/** RBJ biquad 滤波器 */
export const biquad = (type, freq, q = 0.707) => {
  const w0 = (2 * Math.PI * freq) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const cos = Math.cos(w0);
  let b0, b1, b2;
  if (type === 'lp') [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
  else if (type === 'hp') [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
  else [b0, b1, b2] = [alpha, 0, -alpha]; // bp
  const a0 = 1 + alpha;
  const a1 = -2 * cos;
  const a2 = 1 - alpha;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
};

export const filterBuf = (buf, type, freq, q) => {
  const f = biquad(type, freq, q);
  for (let i = 0; i < buf.length; i++) buf[i] = f(buf[i]);
  return buf;
};

/** Schroeder 混响：4 梳状 + 2 全通 */
export const reverb = (buf, mix = 0.2, decay = 0.78) => {
  const out = new Float32Array(buf.length);
  const combs = [1557, 1617, 1491, 1422].map((n) => ({b: new Float32Array(n), i: 0, lp: 0}));
  const aps = [225, 556].map((n) => ({b: new Float32Array(n), i: 0}));
  for (let n = 0; n < buf.length; n++) {
    const x = buf[n];
    let acc = 0;
    for (const c of combs) {
      const y = c.b[c.i];
      c.lp = y * 0.6 + c.lp * 0.4; // 阻尼，让尾音更暖
      c.b[c.i] = x + c.lp * decay;
      c.i = (c.i + 1) % c.b.length;
      acc += y;
    }
    acc *= 0.25;
    for (const a of aps) {
      const y = a.b[a.i];
      const v = acc + y * 0.5;
      a.b[a.i] = v;
      a.i = (a.i + 1) % a.b.length;
      acc = y - v * 0.5;
    }
    out[n] = x * (1 - mix) + acc * mix * 2.2;
  }
  return out;
};

export const normalize = (buf, target) => {
  let p = 0;
  for (const v of buf) p = Math.max(p, Math.abs(v));
  if (p > 0) for (let i = 0; i < buf.length; i++) buf[i] *= target / p;
  return buf;
};

export const softClip = (buf, drive = 1.2) => {
  for (let i = 0; i < buf.length; i++) buf[i] = Math.tanh(buf[i] * drive) / Math.tanh(drive);
  return buf;
};

/* ---------------- 乐器 ---------------- */

/** Karplus-Strong 拨弦，接近尤克里里 */
export const pluck = (freq, dur = 1.2, bright = 0.5) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const len = Math.max(2, Math.round(SR / freq));
  const ring = new Float32Array(len);
  const lp = biquad('lp', 1500 + bright * 4000);
  for (let i = 0; i < len; i++) ring[i] = lp(noise());
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const cur = ring[idx];
    const nxt = ring[(idx + 1) % len];
    ring[idx] = (cur + nxt) * 0.5 * 0.9965;
    out[i] = cur;
    idx = (idx + 1) % len;
  }
  // 起音稍软、尾部淡出
  for (let i = 0; i < n; i++) {
    const a = Math.min(1, i / (0.002 * SR));
    const r = Math.min(1, (n - i) / (0.08 * SR));
    out[i] *= a * r;
  }
  return out;
};

/** 钢片琴 / 铃音 */
export const bell = (freq, dur = 1.0) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const partials = [[1, 1], [2.76, 0.35], [5.4, 0.12]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (const [m, a] of partials) v += a * Math.sin(2 * Math.PI * freq * m * t) * Math.exp(-t * (3 + m * 2));
    out[i] = v * Math.min(1, i / 40);
  }
  return out;
};

/** 三角波贝斯 */
export const bass = (freq, dur = 0.45) => {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    ph += freq / SR;
    const tri = 4 * Math.abs(ph - Math.floor(ph + 0.5)) - 1;
    const env = Math.min(1, i / 200) * Math.exp((-i / SR) * 3.5) * Math.min(1, (n - i) / 400);
    out[i] = (tri * 0.8 + Math.sin(2 * Math.PI * ph) * 0.4) * env;
  }
  return out;
};

export const kick = () => {
  const n = Math.round(0.32 * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 45 + 95 * Math.exp(-t * 28);
    ph += f / SR;
    out[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 9);
  }
  return out;
};

export const snap = () => {
  const n = Math.round(0.18 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    // 两次快速拍击，像手指 snap / 轻拍手
    const e = Math.exp(-t * 38) + (t > 0.011 ? 0.6 * Math.exp(-(t - 0.011) * 30) : 0);
    out[i] = noise() * e;
  }
  return filterBuf(out, 'bp', 1800, 0.9);
};

export const hat = (open = false) => {
  const n = Math.round((open ? 0.2 : 0.05) * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = noise() * Math.exp((-i / SR) * (open ? 18 : 70));
  return filterBuf(out, 'hp', 7000);
};

export const shaker = () => {
  const n = Math.round(0.09 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise() * Math.sin(Math.PI * (t / 0.09)) ** 2;
  }
  return filterBuf(out, 'hp', 5000);
};

/* ---------------- 编曲 ---------------- */

// 尤克里里 GCEA 把位（re-entrant G）
export const CHORDS = {
  C: {uke: [67, 60, 64, 72], root: 36},
  Am: {uke: [69, 60, 64, 69], root: 45 - 12},
  F: {uke: [69, 60, 65, 69], root: 41 - 12},
  G: {uke: [67, 62, 67, 71], root: 43 - 12},
};
const PROG = ['C', 'Am', 'F', 'G'];

// 小节(2s)的段落强度：0 仅拨弦，1 加鼓和贝斯，2 紧张段，3 静音喜剧段，4 尾声
const SECTION = [0, 0, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 4, 4, 4];

// 岛屿扫弦 D-DU-UD，单位：拍
const STRUMS = [
  [0, 'D', 1], [1, 'D', 0.7], [1.5, 'U', 0.5], [2.5, 'U', 0.5], [3, 'D', 0.8], [3.5, 'U', 0.5],
];

// 尾声旋律（C 大调五声），[拍, midi]，相对于尾声起点
const OUTRO_MELODY = [
  [0, 76], [0.5, 79], [1, 81], [2, 79], [3, 76], [3.5, 74],
  [4, 72], [5, 74], [5.5, 76], [6, 79], [8, 81], [8.5, 79], [9, 76], [10, 79], [11, 84],
];
// 主体段落里零星的铃音点缀
const SPARKLE_NOTES = [
  [4.0, 84], [4.5, 79], [8.0, 81], [12.0, 84], [12.5, 81], [20.0, 84], [20.5, 88],
];

export function renderBgm() {
  seed = 7;
  const n = BGM_SECONDS * SR;
  const music = new Float32Array(n);
  const drums = new Float32Array(n);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();

  for (let bar = 0; bar < SECTION.length; bar++) {
    const sec = SECTION[bar];
    const t0 = bar * 4 * BEAT;
    const chordName = sec === 2 ? 'G' : PROG[bar % 4];
    const chord = CHORDS[chordName];
    const lastBar = bar === SECTION.length - 1;

    // 扫弦
    const strums = sec === 3 ? [[0, 'D', 0.7], [2, 'D', 0.5]] : lastBar ? [[0, 'D', 1], [1, 'D', 0.8]] : STRUMS;
    for (const [beat, dir, vel] of strums) {
      const at = t0 + beat * BEAT;
      const notes = dir === 'D' ? chord.uke : [...chord.uke].reverse();
      notes.forEach((m, k) => {
        const dur = lastBar && beat === 1 ? 2.2 : 1.1;
        mixInto(music, pluck(mtof(m), dur, 0.35 + vel * 0.4), at + k * 0.011 + (rnd() - 0.5) * 0.004, 0.45 * vel);
      });
    }

    // 贝斯
    if (sec === 1 || sec === 4) {
      mixInto(music, bass(mtof(chord.root)), t0, 0.5);
      mixInto(music, bass(mtof(chord.root + 7), 0.3), t0 + 1.5 * BEAT, 0.35);
      mixInto(music, bass(mtof(chord.root)), t0 + 2 * BEAT, 0.45);
    }
    if (sec === 2) {
      // 半音上行，制造「要出事了」的紧张感
      [31, 32, 33, 34, 35, 36, 37, 38].forEach((m, k) => mixInto(music, bass(mtof(m), 0.24), t0 + k * 0.5 * BEAT, 0.55));
    }

    // 鼓
    if (sec === 0) {
      for (let b = 0; b < 8; b++) mixInto(drums, Sh, t0 + b * 0.5 * BEAT, b % 2 ? 0.1 : 0.16);
    }
    if (sec === 1 || sec === 4) {
      mixInto(drums, K, t0, 0.9);
      mixInto(drums, K, t0 + 2 * BEAT, 0.8);
      if (sec === 4) mixInto(drums, K, t0 + 2.5 * BEAT, 0.5);
      mixInto(drums, S, t0 + BEAT, 0.55);
      mixInto(drums, S, t0 + 3 * BEAT, 0.55);
      for (let b = 0; b < 8; b++) mixInto(drums, b === 7 ? Ho : Hc, t0 + b * 0.5 * BEAT, b % 2 ? 0.12 : 0.2);
    }
    if (sec === 2) {
      // 军鼓滚奏渐强
      for (let k = 0; k < 16; k++) mixInto(drums, S, t0 + k * 0.25 * BEAT, 0.15 + k * 0.03);
      mixInto(drums, K, t0, 0.9);
    }
    if (lastBar) {
      mixInto(drums, K, t0, 0.7);
      mixInto(drums, Ho, t0, 0.3);
    }
  }

  // 铃音
  for (const [at, m] of SPARKLE_NOTES) mixInto(music, bell(mtof(m), 1.2), at, 0.1);
  const outroStart = 24;
  for (const [beat, m] of OUTRO_MELODY) mixInto(music, bell(mtof(m), 1.4), outroStart + beat * BEAT, 0.14);

  // 音乐整体过低通 + 混响，鼓只带一点混响
  filterBuf(music, 'lp', 6500);
  const wetMusic = reverb(music, 0.22);
  const wetDrums = reverb(drums, 0.08);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = wetMusic[i] + wetDrums[i] * 0.45;

  // 结尾 28.6s 起淡出，开头 30ms 淡入
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (t > 28.6) out[i] *= Math.max(0, 1 - (t - 28.6) / 1.4);
    if (t < 0.03) out[i] *= t / 0.03;
  }
  return normalize(softClip(out, 1.1), 0.9);
}

/* ---------------- 音效 ---------------- */

const buf = (sec) => new Float32Array(Math.round(sec * SR));

const SFX = {
  // 剪刀咔嚓：两下金属短音
  snip() {
    const out = buf(0.35);
    for (const at of [0, 0.085]) {
      const click = buf(0.12);
      for (let i = 0; i < click.length; i++) {
        const t = i / SR;
        click[i] = noise() * Math.exp(-t * 180) * 0.8 + Math.sin(2 * Math.PI * 3400 * t) * Math.exp(-t * 60) * 0.5
          + Math.sin(2 * Math.PI * 5200 * t) * Math.exp(-t * 90) * 0.3;
      }
      mixInto(out, filterBuf(click, 'hp', 1200), at, at ? 1 : 0.8);
    }
    return out;
  },
  // 嗖：带通噪声扫频
  whoosh() {
    const out = buf(0.5);
    let f = biquad('bp', 500, 2);
    for (let i = 0; i < out.length; i++) {
      const p = i / out.length;
      if (i % 64 === 0) f = biquad('bp', 400 + Math.sin(p * Math.PI) * 2600, 2); // 分块重建实现扫频
      out[i] = f(noise()) * Math.sin(p * Math.PI) ** 1.5;
    }
    return out;
  },
  // 啵：下滑的正弦
  pop() {
    const out = buf(0.14);
    let ph = 0;
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      ph += (320 + 900 * Math.exp(-t * 45)) / SR;
      out[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 32) * Math.min(1, i / 30);
    }
    return out;
  },
  // 叮叮：导出完成
  ding() {
    const out = buf(1.6);
    mixInto(out, bell(mtof(88), 1.4), 0, 0.7);
    mixInto(out, bell(mtof(93), 1.4), 0.12, 0.8);
    return out;
  },
  // 抖动：低频颤噪
  shake() {
    const out = buf(1.0);
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      const am = 0.5 + 0.5 * Math.sin(2 * Math.PI * 22 * t);
      out[i] = (noise() * 0.5 + Math.sin(2 * Math.PI * (70 + 20 * Math.sin(2 * Math.PI * 9 * t)) * t)) * am * Math.min(1, t * 20) * Math.min(1, (1 - t) * 6);
    }
    return filterBuf(out, 'lp', 900);
  },
  // 彩纸：一串随机的小啵声 + 闪光铃
  confetti() {
    const out = buf(1.6);
    for (let k = 0; k < 24; k++) {
      const p = buf(0.06);
      const f = 1400 + rnd() * 2600;
      for (let i = 0; i < p.length; i++) {
        const t = i / SR;
        p[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 90);
      }
      mixInto(out, p, rnd() * 1.1, 0.25 + rnd() * 0.25);
    }
    [84, 88, 91, 96].forEach((m, k) => mixInto(out, bell(mtof(m), 0.8), 0.05 + k * 0.08, 0.25));
    return out;
  },
  // 啵嘤：摔倒
  boing() {
    const out = buf(0.6);
    let ph = 0;
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      const f = 220 * Math.exp(-t * 1.6) * (1 + 0.12 * Math.sin(2 * Math.PI * 16 * t));
      ph += f / SR;
      out[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 4) * Math.min(1, i / 60);
    }
    return out;
  },
  // 键盘打字：一串随机间隔的短促咔嗒
  type() {
    const out = buf(0.9);
    let at = 0;
    while (at < 0.8) {
      const c = buf(0.03);
      const f = 2500 + rnd() * 2500;
      for (let i = 0; i < c.length; i++) {
        const t = i / SR;
        c[i] = (noise() * 0.7 + Math.sin(2 * Math.PI * f * t) * 0.3) * Math.exp(-t * 260);
      }
      mixInto(out, filterBuf(c, 'hp', 1500), at, 0.5 + rnd() * 0.5);
      at += 0.045 + rnd() * 0.06;
    }
    return out;
  },
  // 报错：两声低沉的方波嗡嗡
  error() {
    const out = buf(0.6);
    for (const [at, f] of [[0, 180], [0.2, 140]]) {
      const b = buf(0.17);
      for (let i = 0; i < b.length; i++) {
        const t = i / SR;
        const sq = Math.sign(Math.sin(2 * Math.PI * f * t)) * 0.6 + Math.sin(2 * Math.PI * f * 2 * t) * 0.2;
        b[i] = sq * Math.min(1, t * 200) * Math.min(1, (0.17 - t) * 60);
      }
      mixInto(out, filterBuf(b, 'lp', 2200), at, 1);
    }
    return out;
  },
  // 盖章：低频咚 + 纸张噪声
  stamp() {
    const out = buf(0.4);
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      out[i] = Math.sin(2 * Math.PI * (60 + 90 * Math.exp(-t * 40)) * t) * Math.exp(-t * 14) + noise() * Math.exp(-t * 45) * 0.5;
    }
    return filterBuf(out, 'lp', 3000);
  },
  // 翻纸：短促带通噪声扫过
  paper() {
    const out = buf(0.35);
    let f = biquad('bp', 1200, 1.2);
    for (let i = 0; i < out.length; i++) {
      const p = i / out.length;
      if (i % 64 === 0) f = biquad('bp', 900 + p * 3500, 1.2);
      out[i] = f(noise()) * Math.sin(p * Math.PI) * (0.6 + 0.4 * Math.sin(p * 40));
    }
    return out;
  },
  // 疑问：两声上扬的「嗯？」
  question() {
    const out = buf(0.55);
    for (const [at, f0, f1] of [[0, 520, 560], [0.16, 600, 900]]) {
      const b = buf(0.28);
      let ph = 0;
      for (let i = 0; i < b.length; i++) {
        const t = i / SR;
        ph += (f0 + (f1 - f0) * (t / 0.28)) / SR;
        b[i] = (Math.sin(2 * Math.PI * ph) + 0.25 * Math.sin(4 * Math.PI * ph)) * Math.min(1, t * 80) * Math.exp(-t * 7);
      }
      mixInto(out, b, at, 0.8);
    }
    return out;
  },
  // 魔法闪光：快速上行的铃音琶音
  magic() {
    const out = buf(1.4);
    [72, 76, 79, 84, 88, 91, 96].forEach((m, k) => mixInto(out, bell(mtof(m), 0.9), k * 0.055, 0.35 - k * 0.02));
    return out;
  },
  // UI 点击
  click() {
    const out = buf(0.06);
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      out[i] = (Math.sin(2 * Math.PI * 1900 * t) * 0.6 + noise() * 0.4) * Math.exp(-t * 140);
    }
    return out;
  },
};

export const SFX_NAMES = Object.keys(SFX);

export function renderSfx(name) {
  seed = 1000 + SFX_NAMES.indexOf(name);
  return normalize(SFX[name](), 0.9);
}

/* ---------------- WAV 输出 ---------------- */

export function encodeWav(samples, sampleRate) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); // PCM
  h.writeUInt16LE(1, 22); // mono
  h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE(sampleRate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
  mkdirSync(join(root, 'sfx'), {recursive: true});
  for (const name of SFX_NAMES) writeFileSync(join(root, 'sfx', `${name}.wav`), encodeWav(renderSfx(name), SR));
  console.log(`wrote ${SFX_NAMES.length} sfx → ${join(root, 'sfx')}`);
}
