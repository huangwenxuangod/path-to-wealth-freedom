// 第十九期「苹果 50 年」Vox 解说 BGM → public/audio/ep19-apple-history/bgm.wav
// 跟 ep18 一样逐段写总谱：每段节拍从该段第一句字幕起算，换年代就换乐器、调性和速度。
// 主线是「差点被关掉 → 5 万亿」：开头讲到「把它关掉」时音乐真的断电，结尾回到开头的动机，落在大调上。
import {bass, bell, filterBuf, hat, kick, mixInto, mtof, pluck, reverb, rnd, setSeed, shaker, snap, softClip, SR} from '../synth.mjs';
import {boom, CH, crackle, crash, fall, grid, loadCues, mbox, pad, pulse, swell, tick, up, wind, writeScore} from '../score.mjs';

const EP = 'ep19-apple-history';
const {cs} = loadCues(EP);

const G = {G: [43, 50, 55, 59], Em: [40, 47, 52, 55], C: [48, 52, 55, 60], D: [50, 54, 57, 62], Am: [45, 52, 57, 60], Bm: [47, 54, 59, 62], E: [40, 47, 52, 56], Fmaj7: [41, 48, 52, 57], Bb: [46, 53, 58, 62], Gm: [43, 50, 55, 58]};

function renderScore(seconds, {cs, cwT}) {
  setSeed(19);
  const n = Math.ceil(seconds * SR);
  const mus = new Float32Array(n);
  const drm = new Float32Array(n);
  const fx = new Float32Array(n);
  const M = (buf, at, g) => mixInto(mus, buf, at, g);
  const D = (buf, at, g) => mixInto(drm, buf, at, g);
  const X = (buf, at, g) => mixInto(fx, buf, at, g);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();
  const padSpan = (chord, t0, t1, g, o) => M(pad(chord, t1 - t0, o), t0, g);
  /** 一段按小节走的和弦进行：每小节 fn(t, 和弦, 第几小节) */
  const bars = (t0, t1, bar, prog, fn) => grid(t0, t1, bar, (t, b) => fn(t, prog[b % prog.length], b));
  /** 拨弦琶音 */
  const arp = (t0, t1, step, chord, pat, oct, g, bright = 0.5) => grid(t0, t1, step, (t, k) => M(pluck(mtof(chord[pat[k % pat.length]] + oct), 0.7, bright), t, g));

  /* 1. 1997 钩子 0–9.3s：E 小调低音持续 + 钟表，讲到「把它关掉」整段音乐断电 */
  {
    const t1 = cs(6);
    padSpan(G.Em.map((m) => m - 12), 0, t1 + 0.4, 0.5, {atk: 1.5, rel: 0.3, cut: 600});
    grid(cs(1), t1, 0.5, (t, b) => D(tick(b % 2 === 0), t, 0.3));
    const motif = [[0, 64], [1, 67], [2, 71], [3, 69], [4, 67], [5, 66], [6, 64]];
    for (const [b, m] of motif) M(mbox(m, 1.6), cs(2) + b * 0.62, 0.16);
    // 「把它关掉」：一串下坠的方波 + 一声断电
    [0, 0.22, 0.44].forEach((d, k) => M(pulse(71 - k * 4, 0.6, {decay: 3, glide: -18, cut: 1800}), t1 + d, 0.12));
    X(fall(1.4, 400, 50), t1 + 0.1, 0.35);
    X(boom(1.8, 60, 30), cs(6) + 0.9, 0.5);
  }

  /* 2. 「可就在今年 7 月」9.3–16.2s：沿红线一路往上推，「5 万亿」重击，然后是凯旋的大调 */
  {
    const hit = cwT(8, '5 万亿');
    X(swell(hit - cs(7)), cs(7), 0.4);
    grid(cs(7), hit, 0.25, (t, k) => M(pulse([55, 59, 62, 67][k % 4] + 12 + Math.floor(k / 8) * 2, 0.14, {decay: 16, cut: 2000 + k * 120}), t, 0.06 + k * 0.004));
    X(crash(2.4), hit, 0.32);
    X(boom(2.2, 84, 34), hit, 0.75);
    padSpan(G.G, hit, cs(10), 0.55, {atk: 0.05, rel: 0.8, cut: 2200});
    grid(hit, cs(10), 0.5, (t, k) => {
      D(K, t, 0.55);
      if (k % 2) D(S, t, 0.35);
      M(bass(mtof([31, 38, 40, 38][k % 4]), 0.4), t, 0.42);
    });
    arp(hit, cs(10), 0.125, G.G, [0, 1, 2, 3, 2, 1], 24, 0.12, 0.8);
    grid(hit, cs(10), 0.25, (t, k) => D(k % 2 ? Ho : Hc, t, 0.08));
    [67, 71, 74, 79].forEach((m, k) => M(pluck(mtof(m), 1.6, 0.8), hit + k * 0.05, 0.26));
  }
  /* 「一家差点被人劝关门的公司」16.2–19.9s：悬着的和弦，留一个问题 */
  padSpan([43, 50, 55, 60], cs(10), cs(12), 0.4, {atk: 0.4, rel: 0.5, cut: 900});
  /* 「苹果刚好 50 岁」19.9–22.3s：八音盒弹一句生日歌 */
  {
    const b = 0.36;
    [[0, 67], [0.75, 67], [1, 69], [2, 67], [3, 72], [4, 71]].forEach(([k, m]) => M(mbox(m + 7, 1.6), cs(12) + 0.2 + k * b, 0.26));
    padSpan(G.D, cs(12), cs(13), 0.3, {atk: 0.3, rel: 0.4, cut: 1400});
  }
  /* 「从头捋一遍」22.3–24.2s：倒卷回 1976 */
  X(swell(cs(14) - cs(13)), cs(13), 0.35);
  X(fall(1.6, 900, 200), cs(13) + 0.3, 0.12);

  /* 3. 1976 车库 24.2–37.9s：G 大调 100 BPM 的民谣拨弦 + 沙锤；「800 美元」往下泄一口气；讲到欠债转小调 */
  {
    const t0 = cs(14), t1 = cs(21), beat = 0.6, bar = beat * 4;
    const sour = cs(19);
    X(boom(1.4, 70, 40), t0, 0.45);
    bars(t0, t1, bar, [G.G, G.C, G.Em, G.D], (t, c) => {
      const ch = t >= sour - 0.01 ? [G.Em, G.Am, G.Em, G.Bm][Math.floor((t - t0) / bar) % 4] : c;
      M(pad(ch, bar + 0.3, {atk: 0.3, rel: 0.3, cut: 900}), t, 0.2);
      arp(t, Math.min(t + bar, t1), beat / 2, ch, [0, 2, 1, 3, 2, 1, 3, 2], 12, 0.22, 0.6);
      M(bass(mtof(ch[0] - 12), 0.5), t, 0.38);
      M(bass(mtof(ch[0] - 12), 0.4), t + 2 * beat, 0.32);
      grid(t, t + bar, beat / 2, (tt, k) => D(Sh, tt, k % 2 ? 0.06 : 0.11));
    });
    [74, 72, 71, 67].forEach((m, k) => M(pluck(mtof(m), 0.9, 0.4), cwT(18, '800') + k * 0.16, 0.22));
    X(boom(1.2, 64, 38), cs(17), 0.35);
  }

  /* 4. Apple I 37.9–46.2s：同一首民谣加快到 112 BPM，加鼓；两个「卖掉」各一下 */
  {
    const t0 = cs(21), t1 = cs(26), beat = 60 / 112, bar = beat * 4;
    bars(t0, t1, bar, [G.G, G.D, G.Em, G.C], (t, c) => {
      M(pad(c, bar + 0.2, {atk: 0.2, rel: 0.3, cut: 1100}), t, 0.2);
      arp(t, Math.min(t + bar, t1), beat / 2, c, [0, 1, 2, 3, 2, 1, 2, 3], 12, 0.2, 0.65);
      grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 4 === 3 ? 7 : 0)), 0.25), tt, 0.3));
      for (const k of [0, 2]) D(K, t + k * beat, 0.5);
      for (const k of [1, 3]) D(S, t + k * beat, 0.3);
    });
    X(boom(1, 80, 42), cwT(24, '卖掉'), 0.45);
    X(boom(1, 80, 42), cs(25) + 0.15, 0.45);
  }

  /* 5. Apple II、上市 46.2–53.0s：一路往上，上市一声重击，「百万富翁」铃音撒下来 */
  {
    const t0 = cs(26), t1 = cs(30), beat = 0.5, bar = 2;
    X(boom(1.2, 76, 40), t0, 0.45);
    bars(t0, t1, bar, [G.C, G.D, G.Em, G.D], (t, c, b) => {
      M(pad(up(c, 0), bar + 0.2, {atk: 0.1, rel: 0.3, cut: 1400 + b * 200}), t, 0.25);
      arp(t, Math.min(t + bar, t1), beat / 2, c, [0, 2, 3, 2], 12, 0.2, 0.7);
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.5);
      for (const k of [1, 3]) D(S, t + k * beat, 0.3);
      M(bass(mtof(c[0] - 12), 0.4), t, 0.4);
    });
    X(crash(2), cs(28), 0.28);
    X(boom(1.8, 80, 36), cs(28), 0.6);
    for (let k = 0; k < 14; k++) M(bell(mtof([79, 83, 86, 91, 95][k % 5]), 1.2), cs(29) + k * 0.1 + rnd() * 0.04, 0.06);
  }

  /* 6. 1984 麦金塔 53.0–60.5s：80 年代合成器 116 BPM；广告那一锤一声重击，发布时一串 hello 铃音 */
  {
    const t0 = cs(30), t1 = cs(34), beat = 60 / 116, bar = beat * 4;
    X(boom(2, 70, 30), t0 + 0.4, 0.6);
    X(crash(1.8), t0 + 0.4, 0.2);
    bars(t0, t1, bar, [G.Am, G.Fmaj7, G.C, G.G], (t, c) => {
      M(pad(c, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 1500}), t, 0.22);
      grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(pulse(c[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + 12, 0.16, {decay: 14, cut: 3000}), tt, 0.13));
      grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 2 ? 12 : 0)), 0.2), tt, 0.3));
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, k % 2 ? 0.42 : 0.55);
      for (const k of [1, 3]) D(S, t + k * beat, 0.3);
      grid(t, t + bar, beat / 2, (tt) => D(Hc, tt, 0.08));
    });
    [72, 76, 79, 84].forEach((m, k) => M(bell(mtof(m), 1.4), cs(31) + k * 0.12, 0.13));
  }

  /* 7. 斯卡利、出局 60.5–72.9s：同一段合成器转小调、变暗、掉鼓；董事会那段只剩钟表；「1985」一声下坠，然后只剩稀疏的拨弦 */
  {
    const t0 = cs(34), t1 = cs(38), beat = 60 / 116, bar = beat * 4;
    bars(t0, t1, bar, [G.Am, G.Fmaj7, G.Am, G.E], (t, c, b) => {
      M(pad(c, bar + 0.3, {atk: 0.2, rel: 0.4, cut: 900 - b * 60}), t, 0.28);
      grid(t, Math.min(t + bar, t1), beat, (tt, k) => M(pulse(c[[0, 2, 1, 3][k % 4]] + 12, 0.3, {decay: 8, cut: 1300}), tt, 0.1));
      M(bass(mtof(c[0] - 12), 0.8), t, 0.4);
    });
    grid(cs(37), t1, 0.5, (t, b) => D(tick(b % 2 === 0), t, 0.32));
    X(fall(1.4, 500, 90), cs(38), 0.32);
    X(boom(2, 60, 30), cs(38) + 0.2, 0.55);
    padSpan(G.Am.map((m) => m - 12), cs(38), cs(40), 0.3, {atk: 0.6, rel: 0.8, cut: 500});
    [[0, 69], [1.2, 67], [2.4, 64], [3.6, 60]].forEach(([d, m]) => M(pluck(mtof(m), 1.8, 0.2), cs(39) + d * 0.6, 0.3));
  }

  /* 8. 失落的十几年 72.9–83.0s：72 BPM，A 小调慢慢往下走，风声，钟表一直走；「亏掉十多亿」一声重击 */
  {
    const t0 = cs(40), t1 = cs(44), beat = 60 / 72, bar = beat * 4;
    X(wind(t1 - t0 + 1), t0, 0.22);
    bars(t0, t1, bar, [G.Am, G.Em.map((m) => m + 0), G.Fmaj7, G.E], (t, c) => {
      M(pad(c, bar + 0.6, {atk: 0.8, rel: 0.8, cut: 650}), t, 0.36);
      M(pluck(mtof(c[0]), 1.8, 0.15), t, 0.3);
      M(pluck(mtof(c[2]), 1.4, 0.15), t + 2 * beat, 0.22);
      D(K, t, 0.34);
      D(K, t + 0.22, 0.22);
    });
    grid(t0, t1, beat / 2, (t, b) => D(tick(b % 2 === 0), t, 0.2));
    X(boom(2, 62, 30), cwT(43, '亏掉'), 0.6);
  }

  /* 9. 收购 NeXT、乔布斯回来 83.0–89.9s：先是摸索的低音脉冲，「回来了」整段转到 C 大调，推上去 */
  {
    const t0 = cs(44), back = cs(47), t1 = cs(48);
    grid(t0, back, 0.5, (t, k) => M(pulse([45, 52, 45, 48][k % 4], 0.3, {decay: 7, cut: 900}), t, 0.14));
    padSpan(G.Am.map((m) => m - 12), t0, back + 0.3, 0.3, {atk: 0.8, rel: 0.3, cut: 600});
    X(swell(back - cs(46)), cs(46), 0.32);
    X(boom(2, 76, 34), back, 0.6);
    padSpan(G.C, back, t1 + 0.6, 0.45, {atk: 0.05, rel: 0.6, cut: 2000});
    [60, 64, 67, 72, 76].forEach((m, k) => M(pluck(mtof(m), 1.8, 0.8), back + k * 0.06, 0.28));
  }

  /* 10. 做减法、和微软握手 89.9–99.5s：D 小调 → F 大调 104 BPM，干脆利落；「砍掉七成」一串切音，「1.5 亿」一声重击 */
  {
    const t0 = cs(48), t1 = cs(53), beat = 60 / 104, bar = beat * 4;
    const ok = cs(50);
    bars(t0, t1, bar, [CH.Dm, CH.Bb, CH.F, CH.C], (t, c) => {
      const ch = t >= ok - 0.01 ? [CH.F, CH.C, CH.Dm, CH.Bb][Math.floor((t - t0) / bar) % 4] : c;
      M(pad(ch, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 1300}), t, 0.24);
      grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(pulse(ch[[0, 2, 1, 3][k % 4]] + 12, 0.14, {decay: 18}), tt, 0.12));
      M(bass(mtof(ch[0] - 12), 0.4), t, 0.42);
      M(bass(mtof(ch[0] - 12), 0.3), t + 2 * beat, 0.36);
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.5);
      for (const k of [1, 3]) D(S, t + k * beat, 0.32);
      if (t >= ok - 0.01) grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.08));
    });
    for (let k = 0; k < 6; k++) M(pad(CH.Dm, 0.18, {atk: 0.005, rel: 0.1, cut: 2400}), cwT(49, '七成') + k * 0.16, 0.35);
    X(boom(1.6, 80, 38), cwT(51, '1.5 亿'), 0.55);
  }

  /* 11. iMac、iPod 99.5–107.0s：彩色、好玩，120 BPM 大调拨弦 + 铃音；iPod 那句加贝斯和拍手，像在跳舞 */
  {
    const t0 = cs(53), t1 = cs(56), beat = 0.5, bar = 2;
    X(boom(1.4, 76, 40), t0, 0.45);
    bars(t0, t1, bar, [G.G, G.Em, G.C, G.D], (t, c) => {
      const dance = t >= cs(55) - 0.01;
      M(pad(c, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 1800}), t, 0.2);
      arp(t, Math.min(t + bar, t1), beat / 2, c, [0, 2, 3, 1], 12, 0.18, 0.75);
      [[0, 3], [1.5, 2], [2.5, 3]].forEach(([k, i]) => M(bell(mtof(c[i] + 24), 1), t + k * beat, 0.08));
      if (dance) {
        grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + [0, 12, 7, 12][k % 4]), 0.2), tt, 0.34));
        for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.55);
        for (const k of [1, 3]) D(S, t + k * beat, 0.4);
        grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.1));
      } else {
        for (const k of [0, 2]) D(K, t + k * beat, 0.45);
        grid(t, t + bar, beat / 2, (tt, k) => D(Sh, tt, k % 2 ? 0.06 : 0.1));
      }
    });
  }

  /* 12. iPhone 107–117s：从发布会的安静开始往上推，「这台机器就是 iPhone」重击；App Store 一串铃音像图标一个个冒出来 */
  {
    const t0 = cs(56), hit = cs(58), t1 = cs(61) - 0.2, beat = 0.5;
    padSpan(G.Em, t0, hit + 0.2, 0.32, {atk: 1, rel: 0.2, cut: 900});
    grid(t0, hit, beat / 2, (t, k) => M(pulse([64, 67, 71, 74][k % 4] + (k > 16 ? 12 : 0), 0.12, {decay: 18, cut: 1500 + k * 60}), t, 0.05 + k * 0.003));
    X(swell(hit - cs(57)), cs(57), 0.42);
    X(crash(2.6), hit, 0.34);
    X(boom(2.2, 84, 32), hit, 0.8);
    bars(hit, t1, 2, [G.C, G.G, G.Am, G.Fmaj7], (t, c) => {
      M(pad(c, 2.2, {atk: 0.05, rel: 0.3, cut: 2200}), t, 0.3);
      M(bass(mtof(c[0] - 12), 0.5), t, 0.45);
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.55);
      for (const k of [1, 3]) D(S, t + k * beat, 0.36);
      grid(t, t + 2, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.09));
    });
    for (let k = 0; k < 24; k++) M(bell(mtof([72, 76, 79, 84, 88, 91][(k * 5) % 6]), 0.8), cs(60) + k * 0.11, 0.05);
  }

  /* 13. 2011 117–125s：音乐停下来，只剩低沉的铺底和稀疏的钢琴；「会不会又走回老路」悬着，钟表回来 */
  {
    const t0 = cs(61), t1 = cs(65);
    X(fall(1.2, 300, 80), t0 - 0.2, 0.2);
    padSpan(G.Em.map((m) => m - 12), t0, t1 + 0.3, 0.4, {atk: 1.2, rel: 0.5, cut: 600});
    [[0, 64], [2.4, 62], [4.8, 59], [7.2, 55]].forEach(([d, m]) => M(pluck(mtof(m), 2.4, 0.15), t0 + 0.5 + d, 0.3));
    padSpan([43, 50, 55, 60], cs(63), t1 + 0.2, 0.28, {atk: 0.6, rel: 0.4, cut: 700});
    grid(cs(63), t1, 0.5, (t, b) => D(tick(b % 2 === 0), t, 0.28));
  }

  /* 14. 库克时代 125–134.7s：124 BPM 的稳定脉冲，一级一级往上；30 亿、一万亿、M1 各一下 */
  {
    const t0 = cs(65), t1 = cs(70), beat = 60 / 124, bar = beat * 4;
    const key = (t) => (t >= cs(69) ? 4 : t >= cs(67) ? 2 : 0);
    bars(t0, t1, bar, [G.C, G.G, G.Am, G.Fmaj7], (t, c) => {
      const ch = up(c, key(t));
      M(pad(ch, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 2000}), t, 0.26);
      grid(t, Math.min(t + bar, t1), beat / 4, (tt, k) => M(pulse(ch[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + 12, 0.12, {decay: 20, cut: 3400}), tt, 0.09));
      grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(ch[0] - 12 + (k % 2 ? 12 : 0)), 0.2), tt, 0.3));
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.58);
      for (const k of [1, 3]) D(S, t + k * beat, 0.38);
      grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.1));
    });
    X(boom(1.4, 80, 38), cwT(66, '30 亿'), 0.5);
    X(crash(2), cs(68), 0.28);
    X(boom(1.8, 84, 34), cs(68), 0.65);
    X(boom(1.2, 80, 40), cs(69), 0.45);
  }

  /* 15. 2026 五十岁、换帅 134.7–141.3s：生日歌回来，铺满和弦；交接那句往上转一个调 */
  {
    const t0 = cs(70), t1 = cs(73), beat = 0.5;
    X(crash(2.4), t0, 0.28);
    X(boom(2, 76, 34), t0, 0.55);
    [[0, 67], [0.75, 67], [1, 69], [2, 67], [3, 72], [4, 71]].forEach(([k, m]) => M(mbox(m + 7, 1.6), t0 + 0.2 + k * 0.36, 0.26));
    bars(t0, t1, 2, [G.D, G.G, G.Bm, G.G], (t, c) => {
      const ch = t >= cs(72) - 0.01 ? up(c, 2) : c;
      M(pad(ch, 2.2, {atk: 0.1, rel: 0.4, cut: 2200}), t, 0.36);
      M(bass(mtof(ch[0] - 12), 0.8), t, 0.45);
      D(K, t, 0.55);
      D(K, t + 2 * beat, 0.45);
      grid(t, t + 2, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.08));
    });
  }

  /* 16. 回到 1997 141.3–148.2s：开头那个动机回来，先暗一下，「用了将近 30 年来回答」落在大调上，「下一个 50 年」停在往上的开放和弦 */
  {
    const t0 = cs(73), ans = cs(74), next = cs(75), t1 = cs(77);
    X(swell(1.4), t0 - 1.2, 0.25);
    padSpan(G.Em.map((m) => m - 12), t0, ans + 0.3, 0.38, {atk: 0.4, rel: 0.3, cut: 650});
    [[0, 64], [1, 67], [2, 71], [3, 69]].forEach(([b, m]) => M(mbox(m, 1.6), t0 + 0.3 + b * 0.5, 0.18));
    X(boom(2, 76, 34), ans, 0.55);
    padSpan(G.G, ans, next + 0.3, 0.42, {atk: 0.1, rel: 0.4, cut: 2000});
    [64, 67, 71, 76, 79].forEach((m, k) => M(pluck(mtof(m - 5 + 7), 1.8, 0.8), ans + k * 0.06, 0.24));
    padSpan([48, 55, 62, 64, 67], next, t1 + 0.6, 0.4, {atk: 0.4, rel: 0.8, cut: 1600});
    [67, 71, 74, 79, 83].forEach((m, k) => M(mbox(m, 2), next + 0.3 + k * 0.4, 0.18));
  }

  /* 17. 片尾 148.2s–：G 大调落地 */
  {
    const t0 = cs(77);
    X(boom(2.4, 64, 32), t0, 0.45);
    padSpan([43, 50, 55, 59, 62], t0, seconds, 0.4, {atk: 0.1, rel: 2.2, cut: 1300});
    [[0, 67], [0.5, 74], [1.1, 79]].forEach(([d, m]) => M(mbox(m, 2.4), t0 + 0.2 + d, 0.22));
    X(crackle(seconds - t0), t0, 0.12);
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
  segs: [[0, '1997 钩子'], [cs(7), '5 万亿'], [cs(10), '50 岁'], [cs(14), '1976 车库'], [cs(21), 'Apple I'], [cs(26), 'Apple II/上市'], [cs(30), '麦金塔'], [cs(34), '斯卡利/出局'], [cs(40), '失落十几年'], [cs(44), 'NeXT/回归'], [cs(48), '做减法/微软'], [cs(53), 'iMac/iPod'], [cs(56), 'iPhone'], [cs(61), '2011'], [cs(65), '库克时代'], [cs(70), '2026'], [cs(73), '回到 1997'], [cs(77), '片尾']],
});
