// 第二十一期「2026 诺贝尔物理学奖：南极冰下抓中微子」BGM → public/audio/ep21-nobel-physics/bgm.wav
// Vox 版：全片一条 124 BPM 的太空电子律动（四拍底鼓不断，幽灵粒子段转半速），铺底和琶音跟着每拍做侧链式呼吸；
// 段落切换落在离字幕最近的小节线上；每次切到黑卡大字前推一段渐强、切点落重击；蓝光、冰立方、40 亿光年、新眼睛是四个高潮点。
import {bass, bell, filterBuf, hat, kick, mixInto, mtof, reverb, rnd, setSeed, shaker, snap, softClip, SR} from '../synth.mjs';
import {boom, crash, fall, grid, loadCues, pad, pulse, swell, up, wind, writeScore} from '../score.mjs';

const EP = 'ep21-nobel-physics';
const {cs} = loadCues(EP);

const BEAT = 60 / 124;
const BAR = BEAT * 4;
const T0 = 0.2;
/** 把一个时间吸到最近的小节线上 */
const snapBar = (t) => T0 + Math.round((t - T0) / BAR) * BAR;

const Am = [45, 52, 57, 60], F = [41, 48, 53, 57], C = [48, 52, 55, 60], G = [43, 50, 55, 59], Em = [40, 47, 52, 55], Dm = [50, 53, 57, 62];

function renderScore(seconds, {cs, cwT}) {
  setSeed(21);
  const n = Math.ceil(seconds * SR);
  const mus = new Float32Array(n);
  const drm = new Float32Array(n);
  const fx = new Float32Array(n);
  const M = (buf, at, g) => mixInto(mus, buf, at, g);
  const D = (buf, at, g) => mixInto(drm, buf, at, g);
  const X = (buf, at, g) => mixInto(fx, buf, at, g);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();

  // 段落：[开始秒, 名字]，开始时间吸到小节线上
  const SEC = [
    [0, 'intro'],
    [snapBar(cs(2)), 'hook'],
    [snapBar(cs(5)), 'nobel'],
    [snapBar(cs(7)), 'ghost'],
    [snapBar(cs(11)), 'idea'],
    [snapBar(cwT(15, '蓝光')), 'flash'],
    [snapBar(cs(18)), 'build'],
    [snapBar(cs(22)), 'drop'],
    [snapBar(cs(23)), 'found'],
    [snapBar(cs(24)), 'rise'],
    [snapBar(cs(27)), 'breath'],
    [snapBar(cs(30)), 'why'],
    [snapBar(cs(36)), 'outro'],
  ];
  const secAt = (t) => {
    let cur = SEC[0][1];
    for (const [at, name] of SEC) if (t >= at - 1e-6) cur = name;
    return cur;
  };
  const PROG = {breath: [F, C, Am, G], intro: [Am, F], hook: [Am, F, C, G], nobel: [C, G, Am, F], ghost: [Em, Em, Dm, Em], idea: [Am, F, C, G], flash: [F, C, G, Am], build: [Am, F, C, G], drop: [F, G, C, Am], found: [Dm, Am, Dm, Em], rise: [Dm, Am, F, G], why: [F, G, C, C], outro: [C, G, F, C]};

  for (let b = 0; T0 + b * BAR < seconds; b++) {
    const t = T0 + b * BAR;
    const sec = secAt(t);
    const prog = PROG[sec];
    const c = prog[b % prog.length];
    const energy = {breath: 0.35, intro: 0.3, hook: 0.65, nobel: 0.8, ghost: 0.45, idea: 0.6, flash: 0.85, build: 0.8, drop: 1, found: 0.7, rise: 0.85, why: 1, outro: 0.5}[sec];
    const bright = 900 + energy * 2600;

    // 铺底
    M(pad(c, BAR + 0.2, {atk: sec === 'intro' ? 1.2 : 0.1, rel: 0.3, cut: bright * 0.6}), t, 0.22 + energy * 0.08);
    // 十六分音符琶音（太空感的方波）
    const half = sec === 'ghost' || sec === 'breath';
    grid(t, t + BAR, half ? BEAT / 2 : BEAT / 4, (tt, k) => {
      const m = c[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12 + (k % 8 === 7 ? 12 : 0);
      M(pulse(m + (half ? (rnd() - 0.5) * 0.3 : 0), 0.12, {decay: 18, cut: bright, width: 0.3}), tt, 0.05 + energy * 0.05);
    });
    // 贝斯：八分音符跳动
    if (sec !== 'intro' && sec !== 'breath')
      grid(t, t + BAR, half ? BEAT : BEAT / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 2 && !half ? 12 : 0)), 0.22), tt, 0.26 + energy * 0.1));
    // 鼓
    if (sec === 'breath') {
      // 留白：只剩铺底和稀疏的琶音
    } else if (sec === 'intro') {
      for (const k of [0, 2]) D(K, t + k * BEAT, 0.4);
    } else if (half) {
      D(K, t, 0.5);
      D(S, t + 2 * BEAT, 0.3);
      grid(t, t + BAR, BEAT / 2, (tt) => D(Hc, tt, 0.05));
    } else {
      for (const k of [0, 1, 2, 3]) D(K, t + k * BEAT, 0.5 + energy * 0.12);
      for (const k of [1, 3]) D(S, t + k * BEAT, 0.28 + energy * 0.1);
      const step = energy >= 0.8 ? BEAT / 4 : BEAT / 2;
      grid(t, t + BAR, step, (tt, k) => D(step < BEAT / 2 && k % 4 === 2 ? Ho : Hc, tt, 0.05 + energy * 0.04));
      if (sec === 'build') grid(t, t + BAR, BEAT / 2, (tt, k) => D(Sh, tt + BEAT / 4, k % 2 ? 0.06 : 0.09));
    }
    // 冰晶铃音：冰、蓝光、冰立方、新眼睛几段
    if (['flash', 'drop', 'why'].includes(sec)) [[0, 3], [1.5, 2], [2.5, 3], [3, 1]].forEach(([bb, i]) => M(bell(mtof(c[i] + 24), 1.2), t + bb * BEAT, 0.07));
    if (sec === 'ghost') X(wind(BAR + 0.4), t, 0.08);
  }

  // 关键词上的重击和渐强
  X(swell(cs(2) - 0.2), 0.2, 0.18);
  X(boom(1.4, 80, 38), cwT(2, '650'), 0.5);
  X(crash(2.2), cwT(5, '诺贝尔'), 0.3);
  X(boom(1.8, 84, 34), cwT(5, '诺贝尔'), 0.6);
  X(fall(1.2, 700, 120), cs(7) - 0.3, 0.18);
  X(boom(1.4, 70, 36), cwT(10, '幽灵'), 0.45);
  const flash = cwT(15, '蓝光');
  X(swell(flash - cs(14)), cs(14), 0.3);
  X(crash(2.6), flash, 0.32);
  X(boom(2.2, 90, 30), flash, 0.75);
  for (const w of [cwT(19, '86'), cwT(20, '5160')]) X(boom(1, 80, 42), w, 0.4);
  const ice = cs(22) + 0.4;
  X(swell(ice - cs(21)), cs(21), 0.32);
  X(crash(2.6), ice, 0.32);
  X(boom(2.2, 88, 30), ice, 0.75);
  X(swell(cwT(25, '40') - cs(24)), cs(24), 0.32);
  X(boom(1.8, 80, 32), cwT(25, '40'), 0.6);
  X(crash(2), cs(26), 0.24);
  // 「你想啊」留白；「中微子不会」起拍，一路推到最后一句
  X(fall(1.4, 500, 120), cs(27) - 0.2, 0.15);
  const eye = cs(36) + 0.2;
  X(swell(eye - cs(33)), cs(33), 0.32);
  X(crash(3), eye, 0.32);
  X(boom(2.6, 90, 30), eye, 0.75);
  M(pad([48, 55, 60, 64, 67], seconds - eye + 0.1, {atk: 0.1, rel: 1.8, cut: 1800}), eye, 0.4);
  for (let k = 0; k < 8; k++) M(bell(mtof([72, 76, 79, 84, 88][k % 5]), 1.6), eye + 0.2 + k * 0.16, 0.06);

  // 黑卡大字的切点：先推一段渐强，切点落一下重击
  for (const n of [2, 5, 10, 11, 18, 21, 33]) {
    X(swell(0.9), cs(n) - 0.9, 0.18);
    X(boom(1.1, 86, 40), cs(n), 0.45);
  }

  // 侧链式呼吸：每拍底鼓落下时把铺底和琶音压下去，再慢慢放开（幽灵粒子段只在每小节第一拍压）
  const ghost0 = snapBar(cs(7)), ghost1 = snapBar(cs(11)), breath0 = snapBar(cs(27)), breath1 = snapBar(cs(30));
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (t < T0) continue;
    const inGhost = t >= ghost0 && t < ghost1;
    const step = inGhost ? BAR : BEAT;
    const ph = ((t - T0) % step) / step;
    const depth = t < snapBar(cs(2)) ? 0.25 : t >= breath0 && t < breath1 ? 0.15 : 0.55;
    mus[i] *= 1 - depth * Math.exp(-ph * (inGhost ? 6 : 9));
  }

  filterBuf(mus, 'lp', 8000);
  const wm = reverb(mus, 0.28);
  const wd = reverb(drm, 0.08);
  const wf = reverb(fx, 0.22);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = wm[i] + wd[i] * 0.7 + wf[i] * 0.6;
  return softClip(out, 1.1);
}

writeScore({
  ep: EP,
  render: renderScore,
  segs: [[0, '钩子'], [cs(5), '诺奖'], [cs(7), '幽灵粒子'], [cs(11), '怎么抓'], [cs(18), '建冰立方'], [cs(23), '发现'], [cs(27), '你想啊'], [cs(30), '中微子不会'], [cs(36), '新眼睛']],
});
