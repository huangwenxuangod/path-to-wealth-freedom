/**
 * ep31 系统是不是故意让我输？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「公平」：让你连跪的不是系统针对你，恰恰是每一局都五五开的公平。第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「公平」。
 * 所有时间挂在 we-never 的拍子上：开场三次重音在第 7、10、15 拍，章节卡在乐句起点（每 4 小节）。
 * 事实出处（都读过原文 / 摘要）：
 *   Riot Games《Ask VALORANT – Rank Rating Edition》（2021-03-18，Jon Walker & Ian Fielding）；
 *   Riot 英雄联盟首席玩法设计师 Phroxzon 在 Riot 韩国官方频道的开发者视频（2025-10-02），据 Esports Insider 当天报道的原话；
 *   Baumeister, Bratslavsky, Finkenauer & Vohs《Bad is Stronger than Good》Review of General Psychology 2001（摘要）；
 *   连败概率是自己算的（每局 50%，动态规划精确计算，测试里复算）。
 */
/* 和 src/library/tactical/ranked.tsx 的 coinSeq / longestLoss 同一套算法（测试里比对过）；
   timeline.ts 不能 import 别的 .ts / .tsx，否则 qa.mjs、subtitle-doc.mjs 用 Node 加载会失败 */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const coinSeq = (n: number, seed: number, p = 0.5) => Array.from({length: n}, (_, i) => rand(seed * 1000 + i) < p);
const longestLoss = (seq: boolean[]): [number, number] => {
  let best: [number, number] = [0, 0];
  let run = 0;
  seq.forEach((w, i) => {
    run = w ? 0 : run + 1;
    if (run > best[1]) best = [i - run + 1, run];
  });
  return best;
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** we-never 网格（与 ep25 相同）：两个重拍 17.45 秒和 102.52 秒相隔正好 40 小节 */
export const BAR = (102.52 - 17.45) / 40;
export const BAR0 = 17.45 - 8 * BAR;
export const BEAT = BAR / 4;
export const beatSec = (b: number) => BAR0 + BEAT * b;
export const fr = (sec: number) => Math.round(sec * FPS);
/** 第 b 拍的帧（小节 k 就是 fbt(4k)） */
export const fbt = (b: number) => fr(beatSec(b));
export const fb = (k: number) => fbt(4 * k);

export const HIT = fb(8);
export const HIT2 = fb(48);
export const DARK_FROM = fr(16.7);
export const DARK_FROM2 = fr(101.75);
export const FREEZE = 3;
export const DURATION = fr(beatSec(256) + 1);

/** 开场三次重音（第 7、10、15 拍）：第一把输、第二把输、连跪条 */
export const DEATH = fbt(7);
export const LOSS2 = fbt(10);
export const SPLIT = fbt(15);
/** 开场前三把：第 0.5 / 2.5 / 4.5 拍各赢一把（爆头 + 胜利） */
export const WIN_BEATS = [0.5, 2.5, 4.5];
/** 开场的胜负条：赢 3 把、输 5 把 */
export const OPEN_SEQ = 'WWWLLLLL';

export const SERIES = 'FPS 原理课';
export const EP = 'EP.03';
export const TOPIC = '匹配机制';
export const TITLE = '系统是不是故意让我输？';
export const ANCHOR = '公平';
export const TERM2 = '隐藏分 · MMR · Matchmaking Rating';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '连赢之后，\n为什么总是〔连跪〕？';
export const MEMORY_LINE = '连胜你也有，\n只是你〔没记住〕';
export const FLIP_LINE = '系统没有针对你，\n它对谁都一样〔公平〕';
export const ASK_LINE = '你最长连跪过几把？\n后来怎么走出来的？';
export const NEXT_TITLE = '敌人就在眼前，你没看见？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '天梯'],
  [16, '公平'],
  [24, '连跪'],
  [32, '记忆'],
  [40, '怎么办'],
  [48, '结尾'],
];
export const chapterAt = (f: number) => {
  let i = 0;
  CHAPTERS.forEach(([b], k) => {
    if (f >= fb(b)) i = k;
  });
  return i;
};

/** 字幕：[拍号, 文字]。【】青 〖〗红 〔〕橙；每句停到下一句开始；null 表示这段放大字卡或标题卡 */
export const CUES: [number, string | null][] = [
  // 开场：重演挫败
  [0, '连赢三把，你觉得自己要起飞了。'],
  [7, '下一把，〖输了〗。'],
  [10, '再下一把，还是〖输〗，分一直在掉。'],
  [15, '赢三把，换来连跪五把。'],
  [24, '系统是不是在故意针对你？'],
  [28, '这个问题，Riot 被问了无数次——'],
  [32, null], // 标题卡
  // 天梯
  [36, '先说一个你看不见的分：隐藏分。'],
  [40, 'Riot 说，它像一架巨大的梯子。'],
  [44, '赢一把，往上爬；输一把，被人挤下来。'],
  [48, '你看得见的段位，会慢慢追着它走。'],
  [52, '段位比它高，就会赢得少、输得多。'],
  [56, 'Riot 原话：你永远看不到它。'],
  [60, '它只用来做一件事：凑一局【公平】的比赛。'],
  // 公平
  [68, '什么叫公平？两边赢面一样大。'],
  [72, 'Riot 的设计师说：每一局都是五五开。'],
  [76, '你连赢几把，隐藏分就往上爬，'],
  [80, '下一把，对手就更强一点。'],
  [84, '爬到你真实的位置，胜率就回到一半。'],
  [88, '50% 不是系统定的目标，'],
  [92, '是每一局都公平之后，〔自然的结果〕。'],
  // 连跪
  [100, '可五五开，为什么会连跪五把？'],
  [104, '把每一局，当成抛一次硬币。'],
  [108, '抛 100 次，至少连着 5 次反面的概率：'],
  [112, '约 〔81%〕。'],
  [116, '连着 6 次反面，也有约 55%。'],
  [120, '连跪不是系统在罚你，硬币本来就这样。'],
  [124, '公平的系统，一定会给你连跪。'],
  // 记忆
  [132, '那为什么，你只记得连跪？'],
  [136, '2001 年，一篇心理学综述总结：'],
  [140, '坏事的分量，〖比好事重〗。'],
  [144, '坏的反馈，比好的反馈影响更大。'],
  [148, '所以连胜三把，你转头就忘了。'],
  [152, null], // 大字：连胜你也有，只是你没记住
  // 怎么办（配乐回落段）
  [160, '那能做什么？'],
  [164, '① 别盯连跪，看最近 50 把的胜率。'],
  [168, '② 连跪三把，先停下来歇一会儿。'],
  [172, '③ 赢少输多：段位高过了隐藏分。'],
  [176, '④ 想上分，就比同分段的人多赢一点。'],
  [180, '系统没在跟你作对。'],
  [188, '让你连跪的，恰恰是——'],
  [192, null], // 第二个爆点「公平」
  // 结尾
  [200, '每一局都五五开，没有人被针对。'],
  [204, '连胜和连跪，都是硬币在翻面。'],
  [208, '能把天平压向你的，只有你变强的那一点。'],
  [216, '下一把，就当它是一枚全新的硬币。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：连赢三把
  death: [DEATH, LOSS2], // 第一把输：红屏 + 失败
  loss2: [LOSS2, SPLIT], // 第二把输：失败横幅 + 分掉了
  streak: [SPLIT, fb(6)], // 胜负条：赢 3 输 5
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  ladder: [fb(9), fb(13)], // 天梯：赢了往上爬，输了被挤下来
  gap: [fb(13), fb(14)], // 段位 vs 隐藏分
  quote: [fb(14), fb(16)], // Riot 原话：你永远看不到隐藏分
  balance: [fb(16), fb(19)], // 章节卡 + 天平五五开
  converge: [fb(19), fb(22)], // 连赢之后对手变强，胜率回到一半（示意）
  quote2: [fb(22), fb(24)], // Riot 原话：在你的隐藏分上，胜率多半是 50%
  coin: [fb(24), fb(32)], // 章节卡 + 100 枚硬币 + 81% / 55%
  memory: [fb(32), fb(36)], // 章节卡 + Baumeister 2001
  weight: [fb(36), fb(38)], // 坏事比好事重：天平
  memline: [fb(38), fb(40)], // 大字：连胜你也有
  steps: [fb(40), fb(45)], // 章节卡 + 四步方法
  build: [fb(45), HIT2], // 回落段：天平空转，收暗
  hit2: [HIT2, fb(50)], // 「公平」砸出
  flips: [fb(50), fb(54)], // 暖色：硬币继续翻，天平慢慢偏向你
  win: [fb(54), fb(56)], // 暖色射击场：赢下新的一把
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Riot《Ask VALORANT – Rank Rating Edition》原文 */
export const RIOT_DATE = '2021-03-18';
export const RIOT_LADDER = 'MMR is a giant ladder, consisting of all players.';
export const RIOT_NEVER = 'You will never see your MMR—it’s what we use to create fair matches.';
export const RIOT_FIFTY = 'When you are at your MMR, we’ve most often seen you with a 50% win rate.';
export const RIOT_TLDR_HIGH = 'If your MMR is lower than your rank, you’ll gain less RR on wins and lose more on losses';
export const RIOT_CLIMB = 'win more matches than the players above you who are around your current MMR';
/** Phroxzon（2025-10-02，Riot 韩国官方频道开发者视频，据 Esports Insider 报道） */
export const PHROX_QUOTE = 'We only match people based on their skill. And we want to make sure that every match feels like it’s fair, which means that each team has an equal chance to win.';
/** Baumeister 等 2001 摘要 */
export const BAD_QUOTE = 'Bad emotions, bad parents, and bad feedback have more impact than good ones';
export const BAD_YEAR = 2001;

/** 每局 50%：打 N 局，至少出现一次 ≥k 连败的概率（动态规划精确值） */
export const streakProb = (n: number, k: number, p = 0.5) => {
  let dist = [1, ...Array(k - 1).fill(0)];
  let hit = 0;
  for (let i = 0; i < n; i++) {
    const nd = Array(k).fill(0);
    dist.forEach((q, r) => {
      nd[0] += q * p;
      if (r + 1 >= k) hit += q * (1 - p);
      else nd[r + 1] += q * (1 - p);
    });
    dist = nd;
  }
  return hit;
};
/** 片中写的百分比（四舍五入） */
export const GAMES = 100;
export const P5 = 81;
export const P6 = 55;

/** 硬币网格用的 100 局：取第一个「最长连败正好 6 把」的种子，画面上框出来 */
export const COIN_SEED = (() => {
  for (let s = 1; s < 500; s++) if (longestLoss(coinSeq(GAMES, s))[1] === 6) return s;
  return 1;
})();
export const COINS = coinSeq(GAMES, COIN_SEED);

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep31-rigged';
export const SFX: [string, number, number][] = [
  // 开场：连赢三把 → 两把输 → 连跪条
  ...WIN_BEATS.flatMap((b): [string, number, number][] => [
    [`${A}/gunshot.wav`, fbt(b), 0.8],
    ['audio/sfx/ding.wav', fbt(b) + 3, 0.35],
  ]),
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.7],
  [`${A}/impact.wav`, LOSS2, 0.5],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  ...[3, 4, 5, 6, 7].map((i): [string, number, number] => [`${A}/tick.wav`, SPLIT + i * 4, 0.45]),
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 天梯
  ...[44, 46].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.45],
  // 公平
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  ['audio/sfx/whoosh.wav', fb(19), 0.35],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  // 连跪
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/impact.wav`, fbt(112), 0.5],
  [`${A}/tick.wav`, fbt(116), 0.5],
  // 记忆
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fb(36), 0.35],
  [`${A}/impact.wav`, fbt(140), 0.45],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  ['audio/sfx/whoosh.wav', fb(50), 0.35],
  [`${A}/gunshot.wav`, fbt(220), 0.75],
  ['audio/sfx/ding.wav', fbt(220) + 3, 0.35],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
  ['audio/sfx/whoosh.wav', fb(62), 0.4],
];
