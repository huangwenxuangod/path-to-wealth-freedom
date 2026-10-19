// 第二十期「英伟达 33 年」Vox 解说 BGM → public/audio/ep20-nvidia-history/bgm.wav
// 逐段写总谱，主线是「离倒闭只剩 30 天」：开头和结尾都是凌晨 4 点的钟表滴答；三次濒死（1996、2008、2018）音乐都会掉下去，
// 每次押对大注（RIVA、GPU、AI）都冲上来。
import {bass, bell, filterBuf, hat, kick, mixInto, mtof, pluck, reverb, rnd, setSeed, shaker, snap, softClip, SR} from '../synth.mjs';
import {boom, CH, crash, fall, grid, loadCues, mbox, pad, pulse, swell, tick, up, wind, writeScore} from '../score.mjs';

const EP = 'ep20-nvidia-history';
const {cs} = loadCues(EP);

const C = {
  Dm: [50, 57, 62, 65], Bb: [46, 53, 58, 62], F: [41, 48, 53, 57], C: [48, 52, 55, 60], Am: [45, 52, 57, 60], G: [43, 50, 55, 59],
  Em: [40, 47, 52, 55], D: [50, 54, 57, 62], A: [45, 49, 52, 57], Bm: [47, 54, 59, 62], Dsus: [50, 55, 57, 62], Fmaj7: [41, 48, 52, 57], E: [40, 47, 52, 56],
};

function renderScore(seconds, {cs, cwT}) {
  setSeed(20);
  const n = Math.ceil(seconds * SR);
  const mus = new Float32Array(n);
  const drm = new Float32Array(n);
  const fx = new Float32Array(n);
  const M = (buf, at, g) => mixInto(mus, buf, at, g);
  const D = (buf, at, g) => mixInto(drm, buf, at, g);
  const X = (buf, at, g) => mixInto(fx, buf, at, g);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();
  const padSpan = (chord, t0, t1, g, o) => M(pad(chord, t1 - t0, o), t0, g);
  const bars = (t0, t1, bar, prog, fn) => grid(t0, t1, bar, (t, b) => fn(t, prog[b % prog.length], b));
  const arp = (t0, t1, step, chord, pat, oct, g, bright = 0.5) => grid(t0, t1, step, (t, k) => M(pluck(mtof(chord[pat[k % pat.length]] + oct), 0.7, bright), t, g));
  /** 方波琶音 */
  const sqArp = (t0, t1, step, chord, pat, oct, g, o = {}) => grid(t0, t1, step, (t, k) => M(pulse(chord[pat[k % pat.length]] + oct, 0.14, {decay: 16, ...o}), t, g));
  /** 一段标准的鼓：四拍底鼓、二四拍军鼓、八分踩镲 */
  const drums = (t0, t1, beat, g = 1) =>
    grid(t0, t1, beat, (t, k) => {
      D(K, t, 0.55 * g);
      if (k % 2) D(S, t, 0.36 * g);
      D(Hc, t, 0.08 * g);
      D(k % 2 ? Ho : Hc, t + beat / 2, 0.07 * g);
    });
  const tickTock = (t0, t1, step, g) => grid(t0, t1, step, (t, b) => D(tick(b % 2 === 0), t, g));

  /* 1. 钩子 0–21.7s：凌晨 4 点。钟表 + 焦虑的心跳脉冲（D 小调）；「30 天」一声重击；「6 万亿」往上推；「为什么还这么慌」悬住 */
  {
    const t1 = cs(12);
    tickTock(cs(1), cs(11), 0.5, 0.3);
    padSpan(C.Dm.map((m) => m - 12), 0, cs(10), 0.38, {atk: 1.5, rel: 0.5, cut: 650});
    grid(cs(2), cs(10), 0.5, (t, k) => {
      M(pulse([50, 50, 53, 50][k % 4], 0.22, {decay: 9, cut: 900}), t, 0.12);
      if (k % 2 === 0) {
        D(K, t, 0.34);
        D(K, t + 0.18, 0.22);
      }
    });
    X(boom(1.8, 70, 34), cwT(4, '30 天'), 0.6);
    X(boom(1.2, 76, 40), cs(6), 0.4);
    X(swell(cs(10) - cs(9)), cs(9), 0.25);
    padSpan(C.Bb, cs(10), cs(11) + 0.3, 0.42, {atk: 0.1, rel: 0.5, cut: 1800});
    sqArp(cs(10), cs(11), 0.125, C.Bb, [0, 1, 2, 3], 12, 0.08, {cut: 2600});
    padSpan(C.Dsus, cs(11), t1 + 0.4, 0.4, {atk: 0.3, rel: 0.4, cut: 800});
    // 「答案就藏在这 33 年里」：倒卷回 1993
    X(swell(cs(13) - t1), t1, 0.38);
    X(fall(1.6, 900, 200), t1 + 0.4, 0.12);
  }

  /* 2. 1993 丹尼斯餐厅 21.7–35.7s：C 大调 100 BPM 拨弦 + 铃音，暖的；讲到洗盘子那两句轻一点 */
  {
    const t0 = cs(13), t1 = cs(19), beat = 0.6, bar = 2.4;
    X(boom(1.4, 70, 40), t0, 0.4);
    bars(t0, t1, bar, [C.C, C.Am, C.F, C.G], (t, c) => {
      const soft = t >= cs(16) - 0.01;
      M(pad(c, bar + 0.3, {atk: 0.3, rel: 0.3, cut: 1000}), t, 0.22);
      arp(t, Math.min(t + bar, t1), beat / 2, c, [0, 2, 1, 3, 2, 1, 3, 2], 12, soft ? 0.16 : 0.22, 0.6);
      M(bass(mtof(c[0] - 12), 0.5), t, 0.38);
      M(bass(mtof(c[0] - 12), 0.4), t + 2 * beat, 0.3);
      if (!soft) grid(t, t + bar, beat / 2, (tt, k) => D(Sh, tt, k % 2 ? 0.06 : 0.1));
    });
    [[0, 76], [0.5, 79], [1, 84]].forEach(([d, m]) => M(bell(mtof(m), 1.4), cs(15) + d * 0.6, 0.12));
  }

  /* 3. NV1 35.7–42.6s：90 年代游戏机味的方波琶音 120 BPM；「押错了」转小调、音高往下滑，「一塌糊涂」掉下去 */
  {
    const t0 = cs(19), wrong = cs(20), t1 = cs(23), beat = 0.5;
    bars(t0, wrong, 2, [C.C, C.G], (t, c) => {
      sqArp(t, Math.min(t + 2, wrong), beat / 2, c, [0, 1, 2, 3, 2, 1], 12, 0.12, {width: 0.25, cut: 3200});
      M(bass(mtof(c[0] - 12), 0.3), t, 0.4);
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.45);
    });
    bars(wrong, t1, 2, [C.Am, C.E], (t, c, b) => {
      sqArp(t, Math.min(t + 2, t1), beat / 2, c.map((m) => m - b), [0, 1, 2, 3, 2, 1], 12, 0.1, {width: 0.25, cut: 1600 - b * 200});
      M(pad(c, 2.2, {atk: 0.2, rel: 0.3, cut: 700}), t, 0.24);
    });
    X(fall(1.4, 600, 80), cs(22), 0.32);
  }

  /* 4. 1996 只剩一个月工资 42.6–51.7s：A 小调，稀疏低音；钟表越走越紧；「裁员」两下，「30 天的出处」一声重击后留白 */
  {
    const t0 = cs(23), t1 = cs(28);
    padSpan(C.Am.map((m) => m - 12), t0, cs(27) + 0.2, 0.42, {atk: 0.6, rel: 0.2, cut: 550});
    let t = t0;
    for (let k = 0; t < cs(27); k++) {
      D(tick(k % 2 === 0), t, 0.32);
      t += Math.max(0.22, 0.6 - k * 0.018);
    }
    grid(t0, cs(27), 0.9, (tt) => {
      D(K, tt, 0.36);
      D(K, tt + 0.2, 0.24);
    });
    X(boom(1, 80, 44), cs(25) + 0.3, 0.4);
    X(boom(1, 80, 44), cs(25) + 0.7, 0.4);
    X(crash(2), cs(27), 0.22);
    X(boom(2.4, 60, 28), cs(27), 0.75);
    X(wind(t1 - cs(27) + 0.8), cs(27) + 0.3, 0.18);
  }

  /* 5. 飞到日本、世嘉的 500 万 51.7–63.9s：低音持续 + 五声音阶铃音（悬着）；「改成了投资」松一口气转大调；「全押」小军鼓滚上去 */
  {
    const t0 = cs(28), relief = cwT(31, '改成'), t1 = cs(34);
    padSpan([45, 52, 57], t0, relief + 0.2, 0.4, {atk: 1, rel: 0.3, cut: 700});
    const penta = [69, 72, 74, 76, 79, 81];
    grid(t0, relief, 0.8, (t, k) => M(bell(mtof(penta[(k * 3 + (k >> 2)) % 6]), 1.4), t, 0.1));
    tickTock(cs(29), relief, 0.5, 0.2);
    X(swell(relief - cs(30)), cs(30), 0.28);
    X(boom(1.8, 76, 36), relief, 0.55);
    padSpan(C.F, relief, cs(33), 0.45, {atk: 0.05, rel: 0.6, cut: 2000});
    [65, 69, 72, 77, 81].forEach((m, k) => M(pluck(mtof(m), 1.8, 0.8), relief + k * 0.06, 0.26));
    padSpan(C.C, cs(33), t1 + 0.2, 0.36, {atk: 0.2, rel: 0.2, cut: 1600});
    grid(cs(33), t1, 0.125, (t, k) => D(S, t, 0.06 + k * 0.006));
    X(swell(t1 - cs(33)), cs(33), 0.35);
  }

  /* 6. RIVA 128、上市、GeForce 63.9–74.3s：C 大调 120 BPM 冲上去；上市一声镲，「GPU」一声重击 */
  {
    const t0 = cs(34), t1 = cs(39), beat = 0.5;
    X(crash(2.4), t0, 0.32);
    X(boom(2, 84, 34), t0, 0.7);
    bars(t0, t1, 2, [C.C, C.G, C.Am, C.F], (t, c) => {
      M(pad(c, 2.2, {atk: 0.05, rel: 0.3, cut: 2200}), t, 0.28);
      sqArp(t, Math.min(t + 2, t1), beat / 4, c, [0, 1, 2, 3, 2, 1, 2, 3], 12, 0.08, {cut: 3400, decay: 20});
      grid(t, t + 2, beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 2 ? 12 : 0)), 0.2), tt, 0.32));
    });
    drums(t0, t1, beat);
    for (let k = 0; k < 10; k++) M(bell(mtof([84, 88, 91, 96][k % 4]), 1), cs(35) + k * 0.09, 0.06);
    X(crash(1.8), cs(36), 0.24);
    X(boom(1.8, 80, 36), cs(38), 0.55);
  }

  /* 7. CUDA 74.3–87.7s：科幻感的分解和弦（D 挂四 → D 大调），讲到「几乎没人用」「10 年」只剩低音和钟表 */
  {
    const t0 = cs(39), doubt = cs(43), t1 = cs(46), beat = 60 / 96;
    X(boom(1.6, 70, 36), t0, 0.45);
    bars(t0, doubt, beat * 4, [C.Dsus, C.D, C.Bm, C.G], (t, c) => {
      M(pad(c, beat * 4 + 0.3, {atk: 0.3, rel: 0.4, cut: 1600}), t, 0.28);
      sqArp(t, Math.min(t + beat * 4, doubt), beat / 4, c, [0, 2, 3, 1, 3, 2], 24, 0.06, {width: 0.5, cut: 3000, decay: 12});
      M(bass(mtof(c[0] - 12), 0.8), t, 0.38);
      D(K, t, 0.4);
      D(K, t + 2 * beat, 0.32);
    });
    padSpan(C.Bm.map((m) => m - 12), doubt, t1 + 0.2, 0.36, {atk: 0.4, rel: 0.3, cut: 600});
    tickTock(doubt, t1, 0.5, 0.26);
  }

  /* 8. 2008 87.7–91.6s：崩掉 */
  {
    X(fall(1.6, 500, 60), cs(46), 0.35);
    X(boom(2.4, 60, 28), cs(46) + 0.3, 0.7);
    padSpan(C.Dm.map((m) => m - 24), cs(46), cs(48) + 0.3, 0.38, {atk: 0.2, rel: 0.6, cut: 400});
    X(wind(cs(48) - cs(46) + 0.5), cs(46), 0.18);
  }

  /* 9. 2012 转机 91.6–103.4s：从静音里慢慢长出来，层层叠上去；柱状图那句重击，「离不开 GPU」进入律动 */
  {
    const t0 = cs(48), hit = cs(52), t1 = cs(54), beat = 0.5;
    bars(t0, hit, 2, [C.Am, C.F, C.C, C.G], (t, c, b) => {
      M(pad(c, 2.3, {atk: 0.4, rel: 0.3, cut: 700 + b * 220}), t, 0.24 + b * 0.02);
      if (b >= 1) arp(t, Math.min(t + 2, hit), beat / 2, c, [0, 2, 1, 3], 12, 0.12 + b * 0.02, 0.6);
      if (b >= 2) for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.4);
      if (b >= 3) grid(t, t + 2, beat / 2, (tt) => D(Hc, tt, 0.08));
    });
    X(swell(hit - cs(51)), cs(51), 0.35);
    X(crash(2.2), hit, 0.3);
    X(boom(2, 84, 34), hit, 0.7);
    bars(hit, t1, 2, [C.C, C.G, C.Am, C.F], (t, c) => {
      M(pad(c, 2.2, {atk: 0.05, rel: 0.3, cut: 2200}), t, 0.28);
      sqArp(t, Math.min(t + 2, t1), beat / 4, c, [0, 1, 2, 3, 2, 1, 2, 3], 12, 0.08, {cut: 3400, decay: 20});
      M(bass(mtof(c[0] - 12), 0.4), t, 0.4);
    });
    drums(hit, t1, beat);
  }

  /* 10. 2016 DGX-1 103.4–112.3s：静下来，带一点敬畏：铺底 + 八音盒，「献给计算和人类的未来」那句最亮 */
  {
    const t0 = cs(54), t1 = cs(59);
    padSpan(C.G, t0, cs(57), 0.38, {atk: 0.6, rel: 0.4, cut: 1300});
    padSpan(C.D, cs(57), t1 + 0.3, 0.4, {atk: 0.3, rel: 0.6, cut: 1800});
    [[0, 74], [1, 79], [2, 78], [3, 74], [4, 76], [5, 71]].forEach(([k, m]) => M(mbox(m, 1.8), t0 + 0.4 + k * 0.7, 0.18));
    [74, 78, 81, 86].forEach((m, k) => M(bell(mtof(m), 1.8), cs(57) + k * 0.14, 0.12));
    M(bass(mtof(38), 1.6), cs(58), 0.4);
  }

  /* 11. 2018 挖矿退潮 112.3–119s：又掉一次 */
  {
    const t0 = cs(59), t1 = cs(62);
    padSpan(C.Em, t0, cs(61), 0.32, {atk: 0.3, rel: 0.3, cut: 900});
    sqArp(cs(60), cs(61), 0.25, C.Em, [0, 2, 1, 3], 12, 0.08, {cut: 1400});
    X(fall(1.4, 500, 70), cs(61), 0.32);
    X(boom(2, 62, 30), cs(61) + 0.2, 0.6);
    padSpan(C.Em.map((m) => m - 12), cs(61), t1 + 0.2, 0.32, {atk: 0.2, rel: 0.3, cut: 500});
    X(swell(t1 - cs(61) - 0.4), cs(61) + 0.4, 0.3);
  }

  /* 12. ChatGPT 之后 119–132.9s：128 BPM 一路加速；一万亿、五万亿各升一次调、一声重击 */
  {
    const t0 = cs(62), t1 = cs(68), beat = 60 / 128, bar = beat * 4;
    const key = (t) => (t >= cs(66) ? 5 : t >= cs(65) ? 2 : 0);
    X(crash(2.4), t0, 0.32);
    X(boom(2.2, 84, 32), t0, 0.75);
    bars(t0, t1, bar, [C.Am, C.F, C.C, C.G], (t, c) => {
      const ch = up(c, key(t));
      M(pad(ch, bar + 0.2, {atk: 0.05, rel: 0.3, cut: 2400}), t, 0.28);
      sqArp(t, Math.min(t + bar, t1), beat / 4, ch, [0, 1, 2, 3, 2, 1, 2, 3], 12, 0.09, {cut: 3600, decay: 20});
      grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(ch[0] - 12 + (k % 2 ? 12 : 0)), 0.2), tt, 0.32));
      [[0, 2], [1.5, 3], [2, 2], [3, 1]].forEach(([bb, i]) => M(bell(mtof(ch[i] + 24), 1), t + bb * beat, 0.07));
    });
    drums(t0, t1, beat);
    for (const at of [cs(65), cs(66)]) {
      X(crash(2), at, 0.26);
      X(boom(1.6, 82, 36), at, 0.55);
    }
  }

  /* 13. 回到现在 132.9–137.3s：「5.8 万亿」顶住，「离 6 万亿只差一步」悬在半空 */
  {
    const t0 = cs(68), t1 = cs(71);
    padSpan(up(C.D, 0), t0, cs(70), 0.45, {atk: 0.1, rel: 0.4, cut: 2400});
    grid(t0, cs(70), 60 / 128, (t) => D(K, t, 0.5));
    X(boom(1.8, 80, 34), cwT(69, '5.8'), 0.55);
    padSpan(C.Dsus, cs(70), t1 + 0.3, 0.42, {atk: 0.2, rel: 0.5, cut: 1600});
    [74, 79, 81].forEach((m, k) => M(bell(mtof(m), 1.6), cs(70) + k * 0.2, 0.1));
  }

  /* 14. 收尾 137.3–150.8s：命运线画出来时往上走；「差点死过好几回」暗一下，「押对了」亮起来；「30 天」钟表回来，停在悬着的和弦上 */
  {
    const t0 = cs(71), death = cs(72), bet = cs(73), back = cs(74), t1 = cs(79);
    padSpan(C.G, t0, death, 0.36, {atk: 0.3, rel: 0.3, cut: 1500});
    arp(t0, death, 0.25, C.G, [0, 1, 2, 3, 2, 1], 12, 0.14, 0.7);
    padSpan(C.Em, death, bet, 0.36, {atk: 0.1, rel: 0.3, cut: 900});
    X(boom(1.2, 70, 40), death, 0.4);
    padSpan(C.C, bet, back, 0.42, {atk: 0.05, rel: 0.4, cut: 2200});
    [60, 64, 67, 72, 76].forEach((m, k) => M(pluck(mtof(m), 1.8, 0.8), bet + k * 0.06, 0.26));
    tickTock(back, t1, 0.5, 0.3);
    padSpan(C.Dm.map((m) => m - 12), back, cs(76), 0.38, {atk: 0.4, rel: 0.3, cut: 650});
    X(boom(1.8, 70, 34), cs(75), 0.5);
    padSpan(C.Dsus, cs(76), t1 + 0.4, 0.4, {atk: 0.3, rel: 0.5, cut: 800});
    grid(cs(76), t1, 0.5, (t, k) => M(pulse([50, 50, 53, 50][k % 4], 0.22, {decay: 9, cut: 900}), t, 0.1));
  }

  /* 15. 片尾 150.8s–：D 大调落地 */
  {
    const t0 = cs(79);
    X(boom(2.4, 64, 32), t0, 0.45);
    padSpan([50, 57, 62, 66, 69], t0, seconds, 0.42, {atk: 0.1, rel: 2.2, cut: 1400});
    [[0, 74], [0.5, 78], [1.1, 81]].forEach(([d, m]) => M(mbox(m, 2.4), t0 + 0.2 + d, 0.22));
  }

  filterBuf(mus, 'lp', 7000);
  const wm = reverb(mus, 0.3);
  const wd = reverb(drm, 0.1);
  const wf = reverb(fx, 0.22);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = wm[i] + wd[i] * 0.5 + wf[i] * 0.6;
  return softClip(out, 1.1);
}

writeScore({
  ep: EP,
  render: renderScore,
  segs: [[0, '凌晨 4 点'], [cs(13), '1993 餐厅'], [cs(19), 'NV1'], [cs(23), '1996 30 天'], [cs(28), '世嘉 500 万'], [cs(34), 'RIVA/上市/GPU'], [cs(39), 'CUDA'], [cs(46), '2008'], [cs(48), '2012 转机'], [cs(54), '2016 DGX'], [cs(59), '2018'], [cs(62), 'ChatGPT 之后'], [cs(68), '现在'], [cs(71), '收尾'], [cs(79), '片尾']],
});
