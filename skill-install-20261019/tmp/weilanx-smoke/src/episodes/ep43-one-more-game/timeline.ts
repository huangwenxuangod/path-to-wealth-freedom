/**
 * ep43 输了还想再来一把？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：你以为自己没自制力、上头；其实「差一点」会让大脑的奖赏回路像赢了一样亮起来，越输越想打；
 * 招：开打前定好局数、连输两把就停、差一点也算输、停五分钟再决定。锚词「差一点」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「差一点」。片尾停在评论区问题，不做下期预告。
 * 事实出处：
 *   Clark, Lawrence, Astley-Jones & Gray 2009《Gambling near-misses enhance motivation to gamble and recruit win-related brain circuitry》
 *     Neuron 61(3):481–490（PMC2658737，读过开放全文）：两个转轮各 6 个图案；赢 1/6、差一格 2/6、差很远 3/6；行为实验 40 人、fMRI 15 人；
 *     差一点比差很远更不愉快但更想继续，只在玩家自己选图案时成立（电脑选时反而降低继续意愿）；差一点激活对赢钱有反应的纹状体、脑岛回路。
 *   Kassinove & Schare 2001《Effects of the "near miss" and the "big win" on persistence at slot machine gambling》
 *     Psychol Addict Behav 15(2):155–158（只读到摘要）：180 名大学生、4 转轮老虎机；差一点 30% 时坚持最久，15% / 45% 都更短；大赢没有显著效果。
 *   「射击游戏每一枪都是自己打的，所以输了格外像差一点」是推断，字幕用「可能」；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：残局被打死、比分 12 : 13、点下「再来一局」 */
export const DEATH = fbt(7);
export const SCORE = fbt(10);
export const AGAIN = fbt(15);
/** 「再来一局」按钮被点下的帧 */
export const CLICK_AT = AGAIN + 26;

export const SERIES = 'FPS 原理课';
export const EP = 'EP.10';
export const TOPIC = '近失效应';
export const TITLE = '输了还想再来一把？';
export const HOOK_LINE = '差一点就赢了，你为什么〖停不下来〗？';
export const ANCHOR = '差一点';
export const TERM2 = '近失效应 · Near-Miss Effect';
export const SCORE_US = 12;
export const SCORE_THEM = 13;
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '输得越难受，\n为什么〔越想再打〕？';
export const BIG_LINE = '差一点不是快赢了，\n是大脑〔以为你赢了〕';
export const FLIP_LINE = '你不是没自制力，\n只是被〔差一点〕骗了';
export const ASK_LINE = '你最长的一次「再来一把」，\n打到了几点？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '差一点'],
  [16, '大脑'],
  [24, '掌控'],
  [32, '频率'],
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
  [0, '决胜局，一对一，你只差最后一枪。'],
  [7, '〖你倒下了〗。'],
  [10, '12 比 13，只差一回合。'],
  [15, '你骂了一句，然后点了「再来一局」。'],
  [24, '明明输得很难受，为什么反而更想打？'],
  [28, '答案就藏在那个「差一点」里——'],
  [32, null], // 标题卡
  // 差一点
  [36, '2009 年，剑桥大学做了个老虎机实验。'],
  [40, '两个转轮，玩家自己选图案，等它停下。'],
  [44, '停在正中算赢，偏一格算「差一点」。'],
  [48, '赢、差一点、差很远：1 比 2 比 3。'],
  [52, '差一点和差很远，都是一分钱没拿到。'],
  [56, '可差一点让人更难受，'],
  [60, '也让人更想再来一把：这就是【差一点】。'],
  // 大脑
  [68, '第二个实验，他们扫描了 15 个人的大脑。'],
  [72, '赢钱的时候，奖赏回路会亮起来。'],
  [76, '而「差一点」的时候，〖同一片区域也亮了〗。'],
  [80, '明明没赢，大脑却按「赢了」在反应。'],
  [84, '论文原话：差一点「调动了奖赏回路」。'],
  [88, '它不让你开心，却让你〔更想继续〕。'],
  [92, '你以为是不甘心，其实是大脑在给你打气。'],
  // 掌控
  [100, '还有一个细节：图案是谁选的。'],
  [104, '电脑替你选，差一点反而让人想停。'],
  [108, '你自己选，差一点才让人更想继续。'],
  [112, '老虎机全靠运气，你最多能选个图案。'],
  [116, '射击游戏里，每一枪都是你自己打的。'],
  [120, '每一局输，都像是〔差一点〕。'],
  [124, '这可能就是输了格外想再来的原因。'],
  // 频率
  [132, '另一个实验：180 名大学生玩老虎机。'],
  [136, '「差一点」出现的比例：15%、30%、45%。'],
  [140, '结果 30% 那组，停手前玩得最久。'],
  [144, '太少、太多，都不如 30% 勾人。'],
  [148, '势均力敌的对局，最容易出现「差一点」。'],
  [152, null], // 大字：差一点不是快赢了，是大脑以为你赢了
  // 怎么办（配乐回落段）
  [160, '知道了原理，试试这四招：'],
  [164, '① 开打前，先定好今天打几把。'],
  [168, '② 连输两把，就站起来走走。'],
  [172, '③ 差一点也算输，别给它加分。'],
  [176, '④ 停五分钟，再决定要不要开。'],
  [180, '五分钟后还想打，那才是真的想打。'],
  [188, '让你停不下来的，不是游戏，是那个——'],
  [192, null], // 第二个爆点「差一点」
  // 结尾
  [200, '差一点，是对局里最常见的结局。'],
  [204, '它让你难受，也让你一次次回来。'],
  [208, '下次再输个 12 比 13，'],
  [216, '先站起来，〔喝口水再说〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D 残局：一对一，敌人探出来
  death: [DEATH, SCORE], // 你被打死：红屏裂纹
  score: [SCORE, AGAIN], // 比分 12 : 13，失败
  again: [AGAIN, fb(6)], // 大厅：鼠标点下「再来一局」，时钟 02:13
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  slot: [fb(9), fb(12)], // 原创两转轮：选图案、转、停（赢 / 差一点 / 差很远）
  odds: [fb(12), fb(14)], // 三种结果的比例 1 : 2 : 3，差一点和差很远都是 0
  feel: [fb(14), fb(16)], // 两根评分条：更难受、更想继续 → 「差一点」
  brain: [fb(16), fb(21)], // 章节卡 + 三个脑图：赢 / 差一点亮，差很远暗
  quote: [fb(21), fb(22)], // 论文原话
  boost: [fb(22), fb(24)], // 「不开心」和「想继续」两条反向的箭头
  control: [fb(24), fb(28)], // 章节卡 + 电脑选 vs 自己选
  fps: [fb(28), fb(32)], // 射击游戏：每一枪都是你打的，每一局输都像差一点
  freq: [fb(32), fb(37)], // 章节卡 + 15 / 30 / 45% 倒 U 形（示意）
  close: [fb(37), fb(38)], // 势均力敌：比分条 12 : 13
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：大厅按钮发光、收暗
  hit2: [HIT2, fb(50)], // 「差一点」砸出
  outro: [fb(50), fb(54)], // 暖色：比分条 → 又一个差一点
  breaktime: [fb(54), fb(56)], // 暖色大厅：鼠标从「再来一局」挪开，五分钟倒计时
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Clark 等 2009（Neuron） */
export const CLARK_YEAR = 2009;
export const CLARK_N_BEHAV = 40;
export const CLARK_N_FMRI = 15;
export const REEL_ICONS = 6;
/** 赢 / 差一点 / 差很远 的次数比例（每 6 次） */
export const OUTCOMES: [string, number][] = [
  ['赢', 1],
  ['差一点', 2],
  ['差很远', 3],
];
export const CLARK_QUOTE = 'near-misses invigorate gambling through the anomalous recruitment of reward circuitry, despite the objective lack of monetary reinforcement';
export const CLARK_FEEL = 'Compared to “full-misses,” near-misses were experienced as less pleasant, but increased desire to play.';
export const CLARK_CONTROL = 'near-misses selected by the computer significantly reduced desire to play';
/** Kassinove & Schare 2001（Psychol Addict Behav） */
export const KS_YEAR = 2001;
export const KS_N = 180;
export const KS_RATES = [15, 30, 45];
export const KS_BEST = 30;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep43-one-more-game';
export const SFX: [string, number, number][] = [
  // 开场：残局 → 被打死 → 比分 → 再来一局
  [`${A}/tick.wav`, fbt(3), 0.4],
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/impact.wav`, SCORE, 0.65],
  ['audio/sfx/whoosh.wav', AGAIN, 0.4],
  [`${A}/tick.wav`, CLICK_AT, 0.6],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 差一点：转轮停下的「嗒」
  ...[38, 42, 46].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  ['audio/sfx/ding.wav', fbt(38) + 2, 0.4],
  ['audio/sfx/whoosh.wav', fb(12), 0.35],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.6],
  // 大脑
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  ['audio/sfx/ding.wav', fbt(72), 0.4],
  [`${A}/impact.wav`, fbt(76), 0.55],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  // 掌控
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(104), 0.5],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/gunshot.wav`, fbt(116), 0.75],
  [`${A}/impact.wav`, fbt(120), 0.55],
  // 频率
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(140), 0.5],
  ['audio/sfx/whoosh.wav', fb(37), 0.35],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/tick.wav`, fbt(208), 0.5],
  ['audio/sfx/whoosh.wav', fb(54), 0.35],
  ['audio/sfx/ding.wav', fbt(218), 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
