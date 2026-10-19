/**
 * ep24 生日悖论：约 2 分 05 秒、无口播，画面 + 双语字幕 + 配乐（音乐库 we-never，从第 0 秒开始）。
 * 锚词「巧合」——开头是「同一天生日是天大的巧合」，17.45 秒随第一个重拍砸出来；
 * 102.52 秒配乐换气后整段重新进来，第二个爆点「必然」补完「你遇到的不是奇迹，是没算过的——」；结尾重新定义锚词。
 * 整片在同一个世界里：一年 365 天的金色日历环，「你」是环上一个发光的点。
 * 所有时间都挂在音乐的小节线上，场景组件和测试共用这一份。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/**
 * we-never 实测：整段 112.5 BPM 很稳。第一个重拍 17.45 秒（能量 −19.6 → −2.0 dB），
 * 100–102.5 秒换气（−12 ~ −17 dB）后 102.52 秒整段重新进来（−17.3 → −1.0 dB）。
 * 两个重拍相隔正好 40 小节，用它们反推网格：一小节 2.12675 秒，第一条小节线 0.436 秒。
 */
export const BAR = (102.52 - 17.45) / 40;
export const BAR0 = 17.45 - 8 * BAR;
export const BEAT = BAR / 4;
export const barSec = (k: number) => BAR0 + BAR * k;
export const fr = (sec: number) => Math.round(sec * FPS);
export const fb = (k: number) => fr(barSec(k));

/** 第一个重拍（第 8 小节）和第二个爆点（第 48 小节，配乐换气后重新进来） */
export const HIT = fb(8);
export const HIT2 = fb(48);
/** 重拍前收暗：HIT 前约 0.75 秒起压暗，HIT 前 3 帧完全静止；第二个爆点同样处理 */
export const DARK_FROM = fr(16.7);
export const DARK_FROM2 = fr(101.75);
export const FREEZE = 3;

export const DURATION = fr(barSec(58) + 1.2);

export const ANCHOR = '巧合';
export const TERM = '生日悖论 · Birthday Paradox';
export const ANCHOR2 = '必然';
export const TERM2 = '真正大数定律 · Law of Truly Large Numbers';

/** 字幕：[小节号, 中文, 英文]。【】里的词变金色；中文不超过 18 字；每句停到下一句开始 */
export const CUES: [number, string, string][] = [
  // 钩子
  [0, '你总觉得，同一天生日是天大的巧合。', 'Sharing a birthday feels like a rare coincidence.'],
  [2, '一年 365 天，能撞上的有多少？', '365 days in a year. What are the odds?'],
  [4, '一个人，两个人，十个人……', 'One person, two, ten...'],
  [6, '想遇到和你同天生日的，要 253 人。', 'To match your birthday, you’d need 253 people.'],
  [7, '可只要 23 个人，就有一半机会碰上——', 'Yet with just 23 people, it’s even odds for a —'],
  // 第一个重拍之后：为什么
  [9, '因为撞上的，不一定是你。', 'Because the match doesn’t have to be you.'],
  [10, '23 个人，两两之间正好 【253】 对。', '23 people make exactly 253 pairs.'],
  [11, '每一对，撞上的机会只有 1/365。', 'Each pair has just a 1-in-365 chance.'],
  [12, '可 253 对凑在一起，就不一样了。', 'But 253 chances add up.'],
  // 反过来算
  [13, '换个方向算：所有人都错开的概率。', 'Flip it: the odds that everyone misses.'],
  [14, '第 2 人要避开 1 天：364/365。', 'Person 2 must dodge one day: 364/365.'],
  [15, '第 3 人要避开 2 天：363/365。', 'Person 3 must dodge two: 363/365.'],
  [16, '一直乘到第 23 个人……', 'Multiply all the way to person 23...'],
  [17, '所有人都错开，只剩 【49.3%】。', 'Everyone misses: only 49.3%.'],
  [18, '剩下的 50.7%，就是有人撞上。', 'The other 50.7%: someone matches.'],
  // 曲线
  [19, '人再多一点，曲线陡得吓人。', 'Add a few more, and the curve shoots up.'],
  [20, '40 个人，89.1%。', '40 people: 89.1%.'],
  [21, '57 个人，99.0%。', '57 people: 99.0%.'],
  [22, '70 个人，99.9%。', '70 people: 99.9%.'],
  [23, '要百分之百，得 366 个人。', 'For 100%, you need 366 people.'],
  [24, '365 个格子，第 366 人一定撞上。', '365 slots: person 366 must share one.'],
  // 真实世界
  [26, '这不只是纸上的数学。', 'This isn’t just math on paper.'],
  [27, '2014 年世界杯，每队正好 23 人。', 'At the 2014 World Cup, every squad had 23 players.'],
  [28, '32 支球队里，有 16 支撞了生日。', 'Sixteen of the 32 squads had a shared birthday.'],
  [29, '正好【一半】。', 'Exactly half.'],
  [30, '1939 年，冯·米塞斯首次发表它。', 'In 1939, Richard von Mises first published it.'],
  [32, '今天，数字指纹也得防着它。', 'Today, digital fingerprints must guard against it.'],
  [33, '这招叫生日攻击：长度得翻倍。', 'It’s called the birthday attack: double the length.'],
  // 为什么直觉会错
  [34, '可为什么，我们总是猜错？', 'So why do we always guess wrong?'],
  [35, '因为我们只想到自己。', 'Because we only think about ourselves.'],
  [36, '人数翻一倍，配对差不多翻四倍。', 'Double the people, and pairs nearly quadruple.'],
  [37, '10 人 45 对，70 人 2,415 对。', '10 people, 45 pairs. 70 people, 2,415.'],
  [38, '直觉在走路，配对在坐火箭。', 'Intuition walks. Pairs take a rocket.'],
  // 配乐回落段：转向生活
  [40, '在异乡撞见老同学，', 'Running into a classmate far from home,'],
  [41, '梦到的事第二天成真，', 'a dream that comes true the next day —'],
  [42, '我们管它叫缘分，叫命中注定。', 'we call it fate.'],
  [44, '1989 年，两位统计学家说：', 'In 1989, two statisticians put it plainly:'],
  [45, '样本够大，再离奇的事也会发生。', 'With a big enough sample, anything outrageous happens.'],
  [47, '你遇到的不是奇迹，是没算过的——', 'What you met wasn’t a miracle. It was an uncounted —'],
  // 第二个爆点之后
  [50, '世界那么大，人那么多，', 'The world is big. There are so many of us.'],
  [51, '巧合，每一秒都在某处发生。', 'Somewhere, a coincidence happens every second.'],
  [53, '巧合，往往只是没人算过的必然。', 'A coincidence is often a certainty no one counted.'],
  [55, '你身边，有人和你同一天生日吗？', 'Does anyone you know share your birthday?'],
];
export const cueStart = (i: number) => fb(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（重拍前一句）：随收暗一起退场 */
export const HALF_BARS = [7, 47];

/** 镜头段落（同一个日历环世界里推拉），首尾相接，见 Ep24Birthday.tsx */
export const SHOTS = {
  dot: [0, fb(2)], // 环上一个发光的点：「你」
  reveal: [fb(2), HIT], // 镜头拉远露出日历环，人一个个落到环上；DARK_FROM 起收暗
  hit: [HIT, fb(9)], // 锚词砸出，撞上的两个点变红
  web: [fb(9), fb(13)], // 两两连线 253 对；一对只有 1/365
  product: [fb(13), fb(19)], // 环让到左边，右边连乘「所有人都错开」
  curve: [fb(19), fb(23)], // 概率曲线：40 / 57 / 70 人
  drawer: [fb(23), fb(26)], // 环铺满 365 天，第 366 人必撞
  worldcup: [fb(26), fb(30)], // 环缩进 32 支球队的小环里
  history: [fb(30), fb(32)], // 1939 年，冯·米塞斯
  crypto: [fb(32), fb(34)], // 数字指纹与生日攻击
  pairs: [fb(34), fb(40)], // 只想到自己（22 条线）vs 两两配对（253 条线）→ 平方增长
  crowd: [fb(40), HIT2], // 配乐回落段：冷色人群，到处有人撞上；DARK_FROM2 起收暗
  hit2: [HIT2, fb(50)], // 第二个爆点「必然」
  world: [fb(50), fb(53)], // 暖色人群，巧合每秒都在发生
  redefine: [fb(53), fb(55)], // 锚词重新出现
  close: [fb(55), DURATION], // 大字缩回「你」的光点，抛问题
} as const;

/* ---------------- 数字（测试里核对） ---------------- */

export const DAYS_IN_YEAR = 365;

/** n 个人生日全都错开的概率：365·364·…·(365−n+1) / 365ⁿ（一年 365 天、生日均匀分布，不计 2 月 29 日） */
export const pAllDiff = (n: number) => {
  let q = 1;
  for (let k = 0; k < n; k++) q *= (DAYS_IN_YEAR - k) / DAYS_IN_YEAR;
  return q;
};
/** n 个人里至少两人同一天生日的概率 */
export const pShared = (n: number) => 1 - pAllDiff(n);
/** n 个人里至少一人和「你」同一天生日的概率：1 − (364/365)ⁿ */
export const pMatchYou = (n: number) => 1 - Math.pow((DAYS_IN_YEAR - 1) / DAYS_IN_YEAR, n);
/** 两两配对数 C(n, 2) */
export const pairs = (n: number) => (n * (n - 1)) / 2;
/** 百分比，四舍五入到一位小数：0.50730 → '50.7%' */
export const pct = (p: number) => `${(Math.round(p * 1000) / 10).toFixed(1)}%`;

/** 2014 年世界杯：32 支球队、每队 23 人，其中 16 支队里至少有两人同一天生日（BBC 2014 年统计） */
export const WC_TEAMS = 32;
export const WC_SQUAD = 23;
export const WC_SHARED = 16;

/* ---------------- 环上的 23 个人 ---------------- */

/**
 * 23 个人的生日（一年中的第几天，1 起）。第 0 个是「你」（第 287 天 = 10 月 14 日）；
 * 只有第 14 和第 22 个人撞在同一天（第 205 天 = 7 月 24 日）——撞上的不是你。
 */
export const DAYS = [287, 34, 160, 221, 95, 330, 12, 189, 252, 63, 128, 304, 176, 48, 205, 351, 113, 268, 141, 79, 239, 318, 205];
export const YOU = 0;
export const MATCH: [number, number] = [14, 22];

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** 第 d 天 → 「7 月 24 日」 */
export const dayLabel = (d: number) => {
  let left = d;
  for (let m = 0; m < 12; m++) {
    if (left <= MONTH_DAYS[m]) return `${m + 1} 月 ${left} 日`;
    left -= MONTH_DAYS[m];
  }
  throw new Error(`第 ${d} 天超出一年`);
};

/** 每个人落到环上的帧：你一开始就在；第 1–8 人从第 4 小节起按拍落下，第 9–22 人在第 6～7.5 小节越落越快 */
export const appearAt = (i: number) => {
  if (i === YOU) return -10;
  if (i <= 8) return fr(barSec(4) + (i - 1) * BEAT);
  const p = (i - 9) / 13;
  return fr(barSec(6) + BAR * 1.5 * Math.pow(p, 0.7));
};

/** 连线段：第 k 对（0 起）开始画的帧，在第 9 小节内画完 */
export const WEB_LEN = fr(BAR * 0.85);
export const pairAt = (k: number) => SHOTS.web[0] + 6 + (WEB_LEN * k) / pairs(DAYS.length);

/** 连乘段：此刻已经乘到第几个人（第 14 小节 2 人、第 15 小节 3 人、第 16～17 小节加速乘到 23 人） */
export const multipliedAt = (f: number) => {
  if (f < fb(14)) return 1;
  if (f < fb(15)) return 2;
  if (f < fb(16)) return 3;
  const p = Math.min(1, (f - fb(16)) / (fb(17) - fb(16) - 6));
  return Math.min(23, 3 + Math.floor(20 * Math.pow(p, 1.4)));
};

/** 曲线段：画到第几人（第 20 小节到 40、第 21 小节到 57、第 22 小节到 70，之后到 80） */
export const curveUpTo = (f: number) => {
  const ks: [number, number][] = [
    [fb(19) + 8, 1],
    [fb(20), 40],
    [fb(21), 57],
    [fb(22), 70],
    [fb(22) + 30, 80],
  ];
  if (f <= ks[0][0]) return 1;
  for (let i = 1; i < ks.length; i++) {
    const [f1, v1] = ks[i];
    const [f0, v0] = ks[i - 1];
    if (f <= f1) return v0 + ((v1 - v0) * (f - f0)) / (f1 - f0);
  }
  return 80;
};

/** 音效：[文件, 帧, 音量]。impact 是重拍上的低沉冲击（audio/episodes/ep24-*.mjs 生成），其余用共享音效 */
export const SFX: [string, number, number][] = [
  ['audio/sfx/paper.wav', fb(4), 0.18],
  ['audio/ep24-birthday-paradox/impact.wav', HIT, 0.9],
  ['audio/sfx/whoosh.wav', fb(9), 0.18],
  ['audio/sfx/paper.wav', fb(13), 0.22],
  ['audio/sfx/paper.wav', fb(19), 0.2],
  ['audio/sfx/whoosh.wav', fb(23), 0.16],
  ['audio/sfx/whoosh.wav', fb(26), 0.18],
  ['audio/sfx/paper.wav', fb(30), 0.22],
  ['audio/sfx/whoosh.wav', fb(40), 0.15],
  ['audio/ep24-birthday-paradox/impact.wav', HIT2, 0.75],
  ['audio/sfx/magic.wav', fb(53), 0.2],
  ['audio/sfx/ding.wav', fb(55) + 20, 0.22],
];
