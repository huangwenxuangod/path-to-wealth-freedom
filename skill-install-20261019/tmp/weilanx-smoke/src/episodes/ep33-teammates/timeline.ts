/**
 * ep33 为什么总匹配到坑队友？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「坑队友」：一局五个人总有一个最差，80% 是你的队友、20% 是你；你骂过的人，也在骂他的坑队友。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「坑队友」。
 * 事实出处（都读过原文 / 摘要）：
 *   Riot Games《VALORANT Ranks and Competitive Matchmaking》（2020-04-24，Ian Fielding & Sean Szopinski）；
 *   Riot 英雄联盟首席玩法设计师 Phroxzon 开发者视频（2025-10-02，据 Esports Insider 当天报道）；
 *   Mezulis, Abramson, Hyde & Hankin《Is there a universal positivity bias in attributions?》Psychological Bulletin 2004（摘要）；
 *   80% / 20% / 50% 是自己算的（同水平五人，每人当最差的机会相等），测试里复算。
 */
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

/** 开场三次重音（第 7、10、15 拍）：你也倒了、结算失败、每局都有一个坑 */
export const DEATH = fbt(7);
export const LOSS = fbt(10);
export const SPLIT = fbt(15);
/** 开场：第 1.5 拍队友冲出去白给，第 4 拍你换掉一个 */
export const MATE_DIES = fbt(1.5);
export const YOU_KILL = fbt(4);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.04';
export const TOPIC = '坑队友';
export const TITLE = '为什么总匹配到坑队友？';
export const ANCHOR = '坑队友';
export const TERM2 = '自利归因偏差 · Self-serving Bias';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '是系统专门\n给你分配的〔坑队友〕？';
export const REAL_LINE = '队友有时真的坑，\n但没你〔记得的那么多〕';
export const FLIP_LINE = '你不是运气最差的，\n你只是〔每一局都在场〕';
export const ASK_LINE = '你被队友骂过“坑”吗？\n那一局，你真的坑吗？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '五分之四'],
  [16, '视角'],
  [24, '归因'],
  [32, '真相'],
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
  [0, '队友又冲出去白给了，你叹了口气。'],
  [7, '〖一打三〗，你也倒了。'],
  [10, '结算：〖失败〗。全队好像就你在打。'],
  [15, '每一局，好像都有一个坑队友。'],
  [24, '是系统专门给你分配的吗？'],
  [28, '先别急着骂，我们算一笔账——'],
  [32, null], // 标题卡
  // 五分之四
  [36, '一局五个人，总有一个打得最差。'],
  [40, '系统再公平，这一点也改变不了。'],
  [44, '水平差不多时，最差的是你，只有五分之一；'],
  [48, '剩下 80%，是你的某个队友。'],
  [52, '所以十局里，大约八局你会看到坑队友。'],
  [56, '而你自己当坑的那两局，'],
  [60, '你很少记得：那局你就是【坑队友】。'],
  // 视角
  [68, '还有，对面也有一个打得最差的人。'],
  [72, '他送你人头，你只觉得自己枪法好。'],
  [76, '你死了以后，镜头会切到队友身上；'],
  [80, '他的每个失误，你都看得清清楚楚。'],
  [84, '对面的失误，你一个也看不到。'],
  [88, '两边各有一个坑，你只盯着自己这边。'],
  [92, '谁的坑更坑？其实〔一半一半〕。'],
  // 归因
  [100, '赢了，是我打得好；输了，是队友太坑。'],
  [104, '心理学管这个叫〔自利归因偏差〕。'],
  [108, '2004 年一项元分析，汇总了 266 项研究：'],
  [112, '平均效应量 d = 0.96，是很大的偏差。'],
  [116, '几乎每一组样本里，都有它。'],
  [120, '这不是你人品差，是人脑的默认设置。'],
  [124, '可它会让你，看不到自己的失误。'],
  // 真相
  [132, '那坑队友，全是错觉吗？也不是。'],
  [136, '有人开小号炸鱼，Riot 说要专门打击。'],
  [140, '为了排得快，一局里的分差有时会拉大。'],
  [144, 'Riot 的设计师也承认了这一点。'],
  [148, '但系统不会专门给你塞弱队友。'],
  [152, null], // 大字：队友有时真的坑，但没你记得的那么多
  // 怎么办（配乐回落段）
  [160, '那能做什么？'],
  [164, '① 输了先看自己的失误，再看队友。'],
  [168, '② 每局只问一句：我哪一步能更好？'],
  [172, '③ 少在语音里骂人，下一回合还要一起打。'],
  [176, '④ 你是每局都在的人，先把自己练稳。'],
  [180, '五个人里，只有你每一局都在。'],
  [188, '你骂过的那个人，也在骂他的——'],
  [192, null], // 第二个爆点「坑队友」
  // 结尾
  [200, '每一局，两边各有一个最差的人。'],
  [204, '五局里，总有一局轮到你。'],
  [208, '能决定你上分的，只有你自己那一份。'],
  [216, '下一把，先别骂，先把自己那份打好。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（一直放到片尾，不做下期预告）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：队友白给，你换一个
  death: [DEATH, LOSS], // 一打三，你也倒了
  loss: [LOSS, SPLIT], // 失败 + 计分板
  games: [SPLIT, fb(6)], // 五局，每局一个坑队友
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  dice: [fb(9), fb(11)], // 五个人里抽一个最差
  odds: [fb(11), fb(13)], // 1/5 vs 4/5
  ten: [fb(13), fb(16)], // 十局：八局是队友、两局是你
  both: [fb(16), fb(19)], // 章节卡 + 两边各一个坑
  spectate: [fb(19), fb(22)], // 观战：只看得到队友的失误
  half: [fb(22), fb(24)], // 谁的坑更坑：一半一半
  blame: [fb(24), fb(26)], // 章节卡 + 赢了怪自己、输了怪队友
  meta: [fb(26), fb(30)], // Mezulis 2004：266 项研究、d = 0.96
  default: [fb(30), fb(32)], // 人脑的默认设置
  smurf: [fb(32), fb(35)], // 章节卡 + 小号
  spread: [fb(35), fb(37)], // 排得快 → 分差拉大
  riot: [fb(37), fb(38)], // Riot 原话：公平的比赛
  real: [fb(38), fb(40)], // 大字：没你记得的那么多
  steps: [fb(40), fb(45)], // 章节卡 + 四步方法
  build: [fb(45), HIT2], // 回落段：五个人，你在中间；收暗
  hit2: [HIT2, fb(50)], // 「坑队友」砸出
  turn: [fb(50), fb(54)], // 暖色：五局里轮到你一次
  win: [fb(54), fb(56)], // 暖色射击场：把自己那份打好
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（原文 / 计算，测试核对） ---------------- */

/** 一队人数；同水平时你当最差的概率 1/5，队友当最差 4/5 */
export const TEAM = 5;
export const P_MATE = (TEAM - 1) / TEAM;
/** 两边最差的人谁更差：对称，一半一半 */
export const P_HALF = 0.5;
/** 十局示意：哪两局最差的是你（下标），其余是队友 */
export const TEN_YOU = [3, 8];
/** 十局里每局最差的人站在哪个位置（0–4，2 是你） */
export const TEN_WORST = [0, 4, 1, 2, 3, 0, 4, 1, 2, 3];

/** Mezulis 等 2004 摘要 */
export const META_STUDIES = 266;
export const META_D = 0.96;
export const META_QUOTE = 'The bias was present in nearly all samples.';
/** Riot 2020 原文 */
export const RIOT_FAIR = 'ensure that for most of your matches, you and your teammates are placed into a fair fight';
export const RIOT_SMURF = 'combat smurfing';
/** Phroxzon 2025（据 Esports Insider） */
export const PHROX_SPREAD = 'Lower queue times can typically mean that the spread of ranks that you see in your games can be bigger';

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep33-teammates';
export const SFX: [string, number, number][] = [
  // 开场
  [`${A}/gunshot.wav`, MATE_DIES - 3, 0.6],
  [`${A}/tick.wav`, MATE_DIES + 4, 0.5],
  [`${A}/gunshot.wav`, YOU_KILL, 0.75],
  ['audio/sfx/ding.wav', YOU_KILL + 3, 0.35],
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.7],
  [`${A}/impact.wav`, LOSS, 0.5],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  ...[0, 1, 2, 3, 4].map((i): [string, number, number] => [`${A}/tick.wav`, SPLIT + 6 + i * 6, 0.45]),
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 五分之四
  [`${A}/tick.wav`, fbt(40), 0.5],
  ['audio/sfx/whoosh.wav', fb(11), 0.35],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.45],
  // 视角
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/gunshot.wav`, fbt(72), 0.6],
  ['audio/sfx/whoosh.wav', fb(19), 0.35],
  [`${A}/gunshot.wav`, fbt(80) + 6, 0.55],
  [`${A}/gunshot.wav`, fbt(81) + 6, 0.55],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  // 归因
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  ['audio/sfx/whoosh.wav', fb(26), 0.35],
  [`${A}/impact.wav`, fbt(112), 0.5],
  ['audio/sfx/whoosh.wav', fb(30), 0.35],
  // 真相
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fb(35), 0.35],
  ['audio/sfx/whoosh.wav', fb(37), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  ['audio/sfx/whoosh.wav', fb(50), 0.35],
  [`${A}/tick.wav`, fbt(204), 0.5],
  [`${A}/gunshot.wav`, fbt(220), 0.75],
  ['audio/sfx/ding.wav', fbt(220) + 3, 0.35],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
