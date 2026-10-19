/**
 * ep23 棋盘上的麦粒：约 33 秒、无口播，画面 + 双语字幕 + 配乐（音乐库 we-never，从第 0 秒开始）。
 * 叙事按「锚词」方法组织：锚词「一点点」——开头是不在乎，第 17.45 秒随音乐重拍砸出来，结尾被重新定义。
 * 所有时间都挂在音乐的小节线上，场景组件和测试共用这一份。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** we-never 实测：112 BPM，一小节 2.136 秒，第一条小节线在 0.36 秒（音乐起音），第 8 小节是第一个「换气 + 重拍」 */
export const BAR = 2.136;
export const BAR0 = 0.36;
export const barSec = (k: number) => BAR0 + BAR * k;
export const fr = (sec: number) => Math.round(sec * FPS);

/** 第一个重拍（锚词砸出来）：17.45 秒，能量从 −19 dB 跳到 −2 dB；第二个小爆点在第 12 小节 */
export const HIT = fr(17.45);
export const HIT2 = fr(barSec(12));
/** 重拍前收暗：音乐从 16.4 秒开始「换气」，画面从 16.7 秒起压暗（给话说一半的那句留出阅读时间），HIT 前 3 帧完全静止 */
export const DARK_FROM = fr(16.7);
export const FREEZE = 3;

export const DURATION = fr(33.5);

export const ANCHOR = '一点点';
export const TERM = '指数增长 · Exponential Growth';

/** 字幕：[小节号, 中文, 英文]。【】里的词变金色；中文不超过 18 字；每句停到下一句开始 */
export const CUES: [number, string, string][] = [
  [0, '你每天只多做一点点，', 'You do just a little more each day,'],
  [2, '为什么总觉得，什么都没变？', 'so why does nothing ever seem to change?'],
  [4, '1 粒，2 粒，4 粒，8 粒……', 'One grain, two, four, eight...'],
  [6, '传说里，发明象棋的人只要了这些麦子。', 'The inventor of chess asked for nothing more.'],
  [7, '国王笑了：每格不过多那么——', 'The king laughed: each square adds only —'],
  [9, '64 格之后，超过 1,844 亿亿粒。', 'After 64 squares: 18 quintillion grains.'],
  [10, '前 63 格加起来，还不如最后一格。', 'The first 63 squares together lose to the last one.'],
  [11, '放到秤上，它相当于全世界——', 'On the scale, it equals the world’s —'],
  [12, '【一千多年】的小麦。', 'wheat harvest for over a thousand years.'],
  [13, '【一点点】，从来不只是一点点。', 'A little is never just a little.'],
  [14, '你身边，有什么正在悄悄翻倍？', 'What in your life is quietly doubling?'],
];
export const cueStart = (i: number) => fr(barSec(CUES[i][0]));
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);

/** 场景（同一个棋盘世界里的镜头段落），见 Ep23Wheat.tsx */
export const SHOTS = {
  grain: [0, fr(barSec(2))], // 一粒麦子发光，画面锚点
  reveal: [fr(barSec(2)), HIT], // 镜头拉远露出棋盘，前几格逐格点亮；DARK_FROM 起收暗、最后 FREEZE 帧静止
  hit: [HIT, fr(barSec(9))], // 锚词砸出
  fill: [fr(barSec(9)), fr(barSec(11))], // 棋盘飞速铺满 + 指数曲线
  weigh: [fr(barSec(11)), fr(barSec(13))], // 称重 + 第二个爆点
  redefine: [fr(barSec(13)), fr(barSec(14))], // 锚词重新出现
  close: [fr(barSec(14)), DURATION], // 光缩回一粒麦子，抛问题
} as const;

/** 棋盘铺满：fill 段内第 t 帧亮到第几格（从第 6 格起加速到 64） */
export const FILL_LEN = fr(BAR * 0.9);
export const litCells = (t: number) => {
  if (t < 0) return 6;
  const p = Math.min(1, t / FILL_LEN);
  return Math.max(6, Math.min(64, Math.floor(6 + 58 * Math.pow(p, 1.6))));
};

/** 第 n 格的麦粒数 2^(n-1)，以及前 n 格合计 2^n − 1（用 BigInt，第 64 格超出 Number 精度） */
export const grainsOn = (n: number) => 1n << BigInt(n - 1);
export const grainsUpTo = (n: number) => (1n << BigInt(n)) - 1n;

/** 千分位：18446744073709551615 → 18,446,744,073,709,551,615 */
export const groupDigits = (v: bigint) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * 重量换算（估算口径写进画面脚注）：每粒小麦约 0.05 克；全球小麦年产量约 8 亿吨。
 * 2^64 − 1 粒 × 0.05 克 ≈ 9.2 × 10^11 吨 ≈ 9200 亿吨，约等于 1150 年的全球产量。
 */
export const GRAIN_GRAMS = 0.05;
export const WORLD_WHEAT_TONNES = 8e8;
export const totalTonnes = () => (Number(grainsUpTo(64)) * GRAIN_GRAMS) / 1e6;
export const yearsOfWheat = () => totalTonnes() / WORLD_WHEAT_TONNES;

/** 音效：[文件, 帧, 音量]。impact 是重拍上的低沉冲击（audio/episodes/ep23-*.mjs 生成），其余用共享音效 */
export const SFX: [string, number, number][] = [
  ['audio/ep23-wheat-chessboard/impact.wav', HIT, 0.9],
  ['audio/sfx/paper.wav', fr(barSec(9)), 0.25],
  ['audio/sfx/whoosh.wav', fr(barSec(10)), 0.18],
  ['audio/sfx/paper.wav', fr(barSec(11)), 0.22],
  ['audio/ep23-wheat-chessboard/impact.wav', HIT2, 0.55],
  ['audio/sfx/magic.wav', fr(barSec(13)), 0.2],
  ['audio/sfx/ding.wav', fr(barSec(14)) + 20, 0.22],
];
