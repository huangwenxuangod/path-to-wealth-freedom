// 第十八期「AI 七十年」Vox 解说 BGM → public/audio/ep18-ai-history/bgm.wav
// 不走通用 buildBgm：这期按口播逐段写总谱。每段的节拍网格从该段第一句字幕的开始时间起算，
// 换年代就换乐器、调性和速度；转折处让音乐停下来，关键词上落低频重音（高频的叮当交给音效）。
import {bass, bell, filterBuf, hat, kick, mixInto, mtof, pluck, reverb, rnd, setSeed, shaker, snap, softClip, SR} from '../synth.mjs';
import {boom, CH, crackle, crash, fall, grid, loadCues, mbox, pad, pulse, swell, tick, up, wind, writeScore} from '../score.mjs';

const EP = 'ep18-ai-history';
const {cs} = loadCues(EP);

function renderScore(seconds, {cs, cwT}) {
  setSeed(18);
  const n = Math.ceil(seconds * SR);
  const mus = new Float32Array(n); // 旋律、和声（混响多）
  const drm = new Float32Array(n); // 鼓（混响少）
  const fx = new Float32Array(n); // 重击、渐强、风声
  const M = (buf, at, g) => mixInto(mus, buf, at, g);
  const D = (buf, at, g) => mixInto(drm, buf, at, g);
  const X = (buf, at, g) => mixInto(fx, buf, at, g);
  const K = kick(), S = snap(), Hc = hat(), Ho = hat(true), Sh = shaker();
  const padSpan = (chord, t0, t1, g, o) => M(pad(chord, t1 - t0, o), t0, g);

  /* 1. 钩子 0–12s：1958 年的剪报。八音盒 D 小调 + 唱片底噪 + 低音持续 */
  {
    const beat = 60 / 84;
    const motif = [[0, 74], [1, 77], [2, 81], [3, 76], [4, 74], [5, 72], [6, 69], [7.5, 74]];
    for (const rep of [0, 1]) for (const [b, m] of motif) M(mbox(m), cs(1) + (rep * 8 + b) * beat, 0.2);
    padSpan(CH.Dm, 0, cs(7), 0.4, {atk: 2, rel: 0.25, cut: 900});
    X(crackle(cs(13)), 0, 0.28);
  }
  /* 「可这条预言」音乐收住；「一等就是 60 多年」低音重击 + 悬挂和弦 + 钟表滴答 */
  {
    X(boom(2.4), cs(8), 0.9);
    padSpan(CH.Dsus, cs(8), cs(10) + 0.4, 0.55, {atk: 0.6, rel: 0.8, cut: 700});
    grid(cs(8) + 0.3, cs(10) - 0.2, 0.5, (t, b) => D(tick(b % 2 === 0), t, 0.5));
    X(swell(cs(10) - cs(9)), cs(9), 0.28);
  }

  /* 2. 两派 16.4–23.6s：A 小调。规则派 = 死板的方波八分音符，学习派 = 自由流动的拨弦 */
  {
    const t0 = cs(10), t1 = cs(13) - 0.2, beat = 0.6;
    X(boom(1.6, 70, 40), t0, 0.6);
    padSpan(CH.Am, t0, cs(11), 0.42, {atk: 0.4, rel: 0.6});
    padSpan(CH.F, cs(11), cs(12), 0.42, {atk: 0.4, rel: 0.4});
    padSpan(CH.C, cs(12), t1, 0.42, {atk: 0.3, rel: 0.5});
    const rule = [69, 72, 76, 72];
    grid(cs(11), t1, beat / 2, (t, b) => M(pulse(rule[b % 4], 0.16, {decay: 16}), t, t < cs(12) ? 0.18 : 0.1));
    const learn = [64, 67, 72, 76, 79, 76, 74, 72, 67, 71, 74, 79];
    grid(cs(12), t1, beat / 3, (t, b) => M(pluck(mtof(learn[b % learn.length]), 0.9, 0.55), t + (rnd() - 0.5) * 0.02, 0.26));
  }

  /* 3. 图灵与达特茅斯 23.6–50.4s：F 大调 96 BPM，乐观的 50 年代。先轻拨，达特茅斯起加贝斯和鼓 */
  {
    const t0 = cs(13), t1 = cs(30), beat = 60 / 96, bar = beat * 4;
    const prog = [CH.F, CH.Dm, CH.Bb, CH.C];
    const arp = [0, 2, 1, 3, 2, 1, 3, 2];
    grid(t0, t1, bar, (t, b) => {
      const c = prog[Math.floor(b / 2) % 4];
      M(pad(c, bar + 0.4, {atk: 0.5, rel: 0.5, cut: 1100}), t, 0.3);
      grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(pluck(mtof(c[arp[k]] + 12), 0.7, 0.4), tt, 0.25));
      const dart = t >= cs(21) - 0.01 && t < cs(28);
      if (dart) {
        M(bass(mtof(c[0] - 12), 0.5), t, 0.5);
        M(bass(mtof(c[0] - 5), 0.3), t + 2.5 * beat, 0.35);
        M(bass(mtof(c[0] - 12), 0.45), t + 2 * beat, 0.42);
        for (const k of [0, 2]) D(K, t + k * beat, 0.6);
        for (const k of [1, 3]) D(S, t + k * beat, 0.35);
      }
      grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => D(Sh, tt, dart ? 0.12 : k % 2 ? 0.06 : 0.1));
    });
    // 「机器能思考吗」：往上问、不落地的四个音
    [[0, 72], [0.5, 77], [1, 81], [1.5, 79]].forEach(([b, m]) => M(bell(mtof(m), 1.4), cwT(15, '机器') + b * beat, 0.14));
    // 「名字就叫人工智能」：F 大调和弦一口气扫上去 + 低音
    X(boom(1.6, 76, 40), cwT(27, '人工智能'), 0.55);
    [65, 69, 72, 77, 81].forEach((m, k) => M(pluck(mtof(m), 1.6, 0.7), cwT(27, '人工智能') + k * 0.04, 0.3));
  }

  /* 4. 两派分开 50.4–63.5s：D 小调 104 BPM。上半段方波（规则派）领奏，下半段拨弦琶音（学习派）接管 */
  {
    const t0 = cs(30), t1 = cs(37) - 0.15, beat = 60 / 104, bar = beat * 4;
    const prog = [CH.Dm, CH.Bb, CH.F, CH.C];
    X(boom(1.4, 70, 42), t0, 0.55);
    grid(t0, t1, bar, (t, b) => {
      const c = prog[b % 4];
      M(pad(c, bar + 0.3, {atk: 0.3, rel: 0.3, cut: 1000}), t, 0.28);
      M(bass(mtof(c[0] - 12), 0.4), t, 0.45);
      M(bass(mtof(c[0] - 12), 0.3), t + 2 * beat, 0.38);
    });
    grid(cs(31), t1, beat, (t) => D(K, t, 0.5));
    const rule = [62, 69, 62, 65];
    grid(cs(31), t1, beat / 2, (t, b) => M(pulse(rule[b % 4] + 12, 0.15, {decay: 18}), t, t < cs(33) ? 0.2 : 0.09));
    const learn = [74, 77, 81, 86, 81, 77, 76, 72];
    grid(cs(33), t1, beat / 4, (t, b) => M(pluck(mtof(learn[b % 8]), 0.6, 0.5), t, 0.2));
    grid(cs(33), t1, beat / 2, (t, b) => D(b % 2 ? Hc : Sh, t, 0.1));
    [[0, 81], [0.5, 84], [1, 86], [2, 89]].forEach(([b, m]) => M(bell(mtof(m), 1.4), cs(36) + b * beat, 0.12));
  }

  /* 「可好景不长」：音乐全停，只剩一声下坠 */
  X(fall(1.2), cs(37), 0.35);

  /* 5. 第一次寒冬 64.7–82.3s：A 小调 70 BPM。稀疏的低音钢琴、心跳；报告段加钟表；「寒冬」时风声 + 冰晶 */
  {
    const t0 = cs(38), t1 = cs(47) - 0.1, beat = 60 / 70, bar = beat * 4;
    const prog = [CH.Am, CH.F, CH.Dm, CH.E];
    X(boom(1.8, 64, 36), t0, 0.7); // 那本书砸下来
    grid(t0, t1, bar, (t, b) => {
      const c = prog[b % 4];
      M(pad(c, bar + 0.6, {atk: 1, rel: 0.8, cut: 700}), t, 0.4);
      M(pluck(mtof(c[0]), 1.8, 0.15), t, 0.35);
      M(pluck(mtof(c[2]), 1.4, 0.15), t + 2 * beat, 0.25);
      if (t < cs(45)) {
        D(K, t, 0.38);
        D(K, t + 0.22, 0.24);
      }
    });
    // 「经费一下子少了很多」：贝斯一级一级往下走
    [57, 55, 53, 52].forEach((m, k) => M(bass(mtof(m - 12), 0.6), cs(41) + k * beat * 0.5, 0.45));
    // 莱特希尔报告：官僚的钟表
    grid(cs(42), cs(45), beat / 2, (t, b) => D(tick(b % 2 === 0), t, 0.32));
    // 「政府纷纷砍掉经费」：三刀
    [0, 0.42, 0.84].forEach((d, k) => X(boom(0.6, 90 - k * 12, 44 - k * 3), cs(45) + d, 0.5));
    // 「第一次寒冬」
    X(wind(t1 - cs(45) + 1.5), cs(45), 0.3);
    for (let k = 0; k < 9; k++) M(bell(mtof([88, 91, 93, 96, 100][k % 5]), 1.6), cwT(46, '第一次寒冬') + k * 0.11 + rnd() * 0.05, 0.05);
  }

  /* 6. 专家系统 82.3–96.7s：C 大调 112 BPM 的 80 年代合成器。1985 年加满；「规则写得再多」变暗、掉鼓、转小调 */
  {
    const t0 = cs(47), t1 = cs(56), beat = 60 / 112, bar = beat * 4;
    const bright = [CH.C, CH.G, CH.Am, CH.F];
    const dark = [CH.Am, CH.Fm, CH.Am, CH.E];
    X(boom(1.2, 80, 44), t0, 0.5);
    grid(t0, t1, bar, (t, b) => {
      const sour = t >= cs(53) - 0.01;
      const c = (sour ? dark : bright)[b % 4];
      const slow = t >= cs(55) - 0.01;
      const step = slow ? beat : beat / 2;
      const pat = [0, 1, 2, 3, 2, 1, 2, 3];
      grid(t, Math.min(t + bar, t1), step, (tt, k) =>
        M(pulse(c[pat[k % 8]] + 12 + (sour ? (rnd() - 0.5) * 0.25 : 0), 0.18, {decay: 13, cut: sour ? 1400 : 3200}), tt, 0.17));
      M(pad(c, bar + 0.2, {atk: 0.2, rel: 0.3, cut: sour ? 600 : 1500}), t, 0.25);
      if (!sour && t >= cs(48) - 0.01) {
        grid(t, t + bar, beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 2 ? 12 : 0)), 0.22), tt, 0.32));
        for (const k of [0, 1, 2, 3]) D(K, t + k * beat, k % 2 ? 0.45 : 0.6);
        for (const k of [1, 3]) D(S, t + k * beat, 0.32);
        if (t >= cs(51) - 0.01) grid(t, t + bar, beat / 4, (tt, k) => D(k % 4 === 2 ? Ho : Hc, tt, 0.09));
      }
    });
    X(boom(1.4, 72, 38), cwT(52, '10 亿'), 0.45);
    X(swell(cs(51) - cs(50)), cs(50), 0.2);
  }

  /* 1987 年：合成器断电，音高一路掉下去；「第二次寒冬来了」风声 + 冰晶 */
  {
    [0, 0.27, 0.54, 0.81].forEach((d, k) => M(pulse(72 - k * 3, 0.5, {decay: 3, glide: -14, cut: 1800}), cs(56) + d, 0.12 - k * 0.02));
    X(fall(1.4, 330, 55), cs(57) - 0.1, 0.3);
    padSpan(CH.Am.map((m) => m - 12), cs(57), cs(61), 0.25, {atk: 1.5, rel: 1.2, cut: 450});
    X(wind(cs(61) - cs(58) + 1.6), cs(58), 0.25);
    X(boom(2, 60, 32), cs(58), 0.45);
    for (let k = 0; k < 9; k++) M(bell(mtof([84, 88, 91, 93, 96][k % 5]), 1.6), cs(58) + 0.3 + k * 0.12 + rnd() * 0.05, 0.05);
  }

  /* 7. 反向传播 101–114s：90 BPM。最冷的时候心跳先起，「悄悄干活」加滴答，辛顿登场后拨弦琶音一层层长出来，转暖到 C 大调 */
  {
    const t0 = cs(59), t1 = cs(66) - 0.1, beat = 60 / 90, bar = beat * 4;
    grid(t0, t1, beat * 2, (t) => {
      D(K, t, 0.34);
      D(K, t + 0.2, 0.22);
    });
    grid(cs(60), t1, beat / 2, (t, b) => D(tick(b % 2 === 0), t, 0.18));
    const prog = [CH.Am, CH.F, CH.C, CH.G];
    grid(cs(61), t1, bar, (t, b) => {
      const c = prog[b % 4];
      M(pad(c, bar + 0.4, {atk: 0.6, rel: 0.5, cut: 900 + b * 120}), t, 0.3);
      M(bass(mtof(c[0] - 12), 0.8), t, 0.38);
      const layers = t >= cs(63) - 0.01 ? 2 : 1; // 「一层层地修正」：琶音加一个八度
      for (let L = 0; L < layers; L++)
        grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(pluck(mtof(c[[0, 1, 2, 3, 2, 1, 3, 2][k]] + 12 + L * 12), 0.8, 0.45), tt + L * 0.01, 0.18));
    });
    // 「深度学习的地基」：落到 C 大调加九和弦
    M(pad(CH.Cadd9, 2.4, {atk: 0.05, rel: 1.4, cut: 1600}), cwT(65, '地基'), 0.35);
    X(boom(1.6, 70, 38), cwT(65, '地基'), 0.45);
  }

  /* 8. 深蓝 114–124s：D 小调 120 BPM 的进行曲，规则派的高光。「3.5 比 2.5」和「击败」两下重击；「只会下棋」泄气 */
  {
    const t0 = cs(66), t1 = cs(69), beat = 0.5, bar = 2;
    const prog = [CH.Dm, CH.Bb, CH.Dm, CH.A];
    X(boom(1.2, 80, 42), t0, 0.5);
    grid(t0, t1, bar, (t, b) => {
      const c = prog[b % 4];
      M(pad(c, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 1500}), t, 0.3);
      grid(t, Math.min(t + bar, t1), beat, (tt, k) => M(pulse(c[k % 4] + 12, 0.22, {decay: 9, width: 0.5}), tt, 0.16));
      for (const k of [0, 2]) D(K, t + k * beat, 0.6);
      grid(t, t + bar, beat / 4, (tt, k) => D(S, tt, k % 4 === 0 ? 0.24 : 0.07)); // 军鼓滚奏
      M(bass(mtof(c[0] - 12), 0.4), t, 0.45);
    });
    X(boom(1.4, 76, 40), cwT(67, '3.5'), 0.55);
    X(crash(), cs(68), 0.25);
    X(boom(1.6, 70, 36), cs(68), 0.6);
    // 「可深蓝只会下棋」：四个音一路往下泄气
    [74, 72, 70, 69].forEach((m, k) => M(pulse(m, 0.5, {decay: 4, width: 0.5, glide: k === 3 ? -2 : 0, cut: 1500}), cs(69) + k * 0.32, 0.15));
    padSpan(CH.Dm.map((m) => m - 12), cs(69), cs(71) - 0.1, 0.3, {atk: 0.3, rel: 0.5, cut: 500});
    M(pluck(mtof(50), 1.2, 0.1), cs(70), 0.35);
  }

  /* 9. 2012 转折 124–138s：A 小调 120 BPM 的长渐强。层层叠加 → 「15%」爆开 → 三样东西三下重拍 → 「终于凑齐了」推向下一段 */
  {
    const t0 = cs(71), t1 = cs(79), beat = 0.5, bar = 2;
    const prog = [CH.Am, CH.F, CH.C, CH.G];
    X(boom(1.8, 66, 34), t0, 0.6);
    grid(t0, t1, bar, (t, b) => {
      const c = prog[b % 4];
      const p = Math.min(1, (t - t0) / (cs(76) - t0));
      M(pad(c, bar + 0.2, {atk: 0.2, rel: 0.3, cut: 700 + p * 1600}), t, 0.3);
      if (t >= cs(72) - 0.01) grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(pulse(c[[0, 2, 1, 3][k % 4]] + 12, 0.16, {decay: 14, cut: 1200 + p * 2600}), tt, 0.1 + p * 0.08));
      if (t >= cs(73) - 0.01) for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.4 + p * 0.25);
      if (t >= cs(74) - 0.01) grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.07 + p * 0.05));
      if (t >= cs(73) - 0.01) M(bass(mtof(c[0] - 12), 0.4), t, 0.4);
    });
    const drop = cwT(76, '15%');
    X(swell(drop - cs(75)), cs(75), 0.38);
    X(crash(2.2), drop, 0.3);
    X(boom(2, 80, 34), drop, 0.75);
    for (const w of ['数据', '算力', '算法']) X(boom(0.9, 90, 46), cwT(77, w), 0.5);
    X(swell(cs(79) - cs(78)), cs(78), 0.4);
  }

  /* 10. 一路加速 138–160s：128 BPM 全编制。每到一个新年份升一次调、一下重击，越来越亮 */
  {
    const t0 = cs(79), t1 = cs(90) - 0.2, beat = 60 / 128, bar = beat * 4;
    const keyAt = (t) => (t >= cs(87) ? 5 : t >= cs(86) ? 3 : t >= cs(82) ? 2 : 0);
    const prog = [CH.Am, CH.F, CH.C, CH.G];
    X(crash(2.4), t0, 0.32);
    X(boom(2, 84, 34), t0, 0.75);
    for (const n of [80, 82, 86, 87]) {
      X(crash(1.8), cs(n), 0.22);
      X(boom(1.4, 80, 38), cs(n), 0.5);
    }
    grid(t0, t1, bar, (t, b) => {
      const c = up(prog[b % 4], keyAt(t));
      M(pad(c, bar + 0.2, {atk: 0.1, rel: 0.3, cut: 2000}), t, 0.26);
      grid(t, Math.min(t + bar, t1), beat / 4, (tt, k) => M(pulse(c[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + 12, 0.12, {decay: 20, cut: 3600}), tt, 0.1));
      grid(t, Math.min(t + bar, t1), beat / 2, (tt, k) => M(bass(mtof(c[0] - 12 + (k % 2 ? 12 : 0)), 0.2), tt, 0.32));
      for (const k of [0, 1, 2, 3]) D(K, t + k * beat, 0.62);
      for (const k of [1, 3]) D(S, t + k * beat, 0.4);
      grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, k % 2 ? 0.1 : 0.14));
      [[0, 2], [1.5, 3], [2, 2], [3, 1]].forEach(([bb, i]) => M(bell(mtof(c[i] + 24), 1), t + bb * beat, 0.08));
    });
    X(swell(cs(90) - cs(89) + 0.2), cs(89), 0.32);
  }

  /* 11. 诺贝尔 160–170s：D 大调，半速的凯旋。号角似的和弦 + 大鼓；学习派登台时琶音回来，「正中间」落主和弦 */
  {
    const t0 = cs(90), t1 = cs(96), beat = 60 / 64, bar = beat * 4;
    const prog = [CH.D, CH.A, CH.Bm, CH.G];
    X(crash(2.6), t0, 0.32);
    X(boom(2.4, 76, 32), t0, 0.8);
    grid(t0, t1, bar, (t, b) => {
      const c = prog[b % 4];
      M(pad(c, bar + 0.5, {atk: 0.15, rel: 0.6, cut: 2200}), t, 0.5);
      grid(t, t + bar, beat / 2, (tt, k) => D(k % 2 ? Ho : Hc, tt, 0.1));
      M(bass(mtof(c[0] - 12), 1.2), t, 0.5);
      D(K, t, 0.6);
      D(K, t + 2 * beat, 0.5);
      D(S, t + beat, 0.3);
      D(S, t + 3 * beat, 0.3);
      if (t >= cs(94) - 0.01) grid(t, Math.min(t + bar, t1), beat / 4, (tt, k) => M(pluck(mtof(c[[0, 1, 2, 3][k % 4]] + 12 + (k % 8 >= 4 ? 12 : 0)), 0.7, 0.6), tt, 0.2));
    });
    for (const at of [t0, cs(92)]) [62, 66, 69, 74].forEach((m, k) => M(pulse(m + 12, 1.2, {decay: 2, width: 0.45, cut: 2400}), at + k * 0.09, 0.09));
    const mid = cwT(95, '正中间');
    X(crash(2.4), mid, 0.3);
    X(boom(2, 72, 34), mid, 0.6);
    [62, 66, 69, 74, 78].forEach((m, k) => M(pluck(mtof(m), 2, 0.8), mid + k * 0.05, 0.28));
  }

  /* 12. 2026 年 170–174.7s：D 大调八分音符脉冲往上推，「10 亿」重击后整片收声 */
  {
    const t0 = cs(96), t1 = cs(98) - 0.2, beat = 60 / 128;
    const big = cwT(97, '10 亿');
    grid(t0, t1, beat / 2, (t, k) => M(pulse([62, 69, 74, 69][k % 4] + 12, 0.14, {decay: 16, cut: 3000}), t, 0.14));
    grid(t0, t1, beat / 2, (t, k) => D(k % 2 ? Ho : Hc, t, 0.1));
    grid(t0, t1, beat, (t) => D(K, t, 0.5));
    padSpan(CH.D, t0, t1, 0.4, {atk: 0.6, rel: 0.4, cut: 1600});
    X(swell(big - t0), t0, 0.3);
    X(crash(2.2), big, 0.28);
    X(boom(2.2, 80, 32), big, 0.75);
  }

  /* 13. 回到 1958 174.7–184.8s：唱片底噪和八音盒主题回来——先是 D 大调（这些都实现了），
     说到「意识到自己的存在」又回到小调，停在悬挂和弦上，钟表重新开始走 */
  {
    const beat = 60 / 84;
    X(crackle(cs(103) - cs(98) + 1), cs(98), 0.28);
    const major = [[0, 74], [1, 78], [2, 81], [3, 76], [4, 74], [5, 73], [6, 69], [7.5, 74]];
    for (const [b, m] of major) M(mbox(m), cs(98) + 0.3 + b * beat, 0.2);
    padSpan(CH.D, cs(98), cs(101), 0.3, {atk: 2, rel: 0.6, cut: 900});
    [[0, 74], [1, 77], [2, 81], [3, 76]].forEach(([b, m]) => M(mbox(m, 2.4), cs(101) + b * beat, 0.2));
    padSpan(CH.Dsus, cs(101), cs(103) + 0.4, 0.32, {atk: 0.8, rel: 0.6, cut: 700});
    grid(cs(102), cs(103), 0.5, (t, b) => D(tick(b % 2 === 0), t, 0.32));
  }

  /* 14. 片尾 184.8s–：D 大调加九和弦落地，八音盒三个音收尾 */
  {
    const t0 = cs(103);
    X(boom(2.4, 64, 32), t0, 0.5);
    padSpan(CH.Dadd9, t0, seconds, 0.36, {atk: 0.1, rel: 2.2, cut: 1300});
    [[0, 74], [0.5, 81], [1.1, 86]].forEach(([d, m]) => M(mbox(m, 2.4), t0 + 0.2 + d, 0.22));
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
  segs: [[0, '钩子'], [cs(10), '两派'], [cs(13), '图灵/达特茅斯'], [cs(30), '分开'], [cs(38), '第一次寒冬'], [cs(47), '专家系统'], [cs(56), '第二次寒冬'], [cs(59), '反向传播'], [cs(66), '深蓝'], [cs(71), '2012'], [cs(79), '加速'], [cs(90), '诺贝尔'], [cs(96), '2026'], [cs(98), '回到1958'], [cs(103), '片尾']],
});
