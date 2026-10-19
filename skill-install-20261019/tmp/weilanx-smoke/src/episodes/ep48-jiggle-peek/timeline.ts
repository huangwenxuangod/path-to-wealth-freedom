/**
 * ep48 探头就跑，你怎么打不到？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：对面探头就缩、你一枪都打不到，队友说你反应慢；其实他露出来只是一个很短的窗口，
 * 网络和画面先把它砍掉一截，人最快的「看见就按」也要 213 毫秒，这个窗口根本不够人用；
 * 招：别追着晃的人开枪、准星停在他会出来的那一格、等他第二次出来、自己进攻也先晃。锚词「窗口」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「窗口」。片尾停在评论区问题，不做下期预告。
 * 事实出处：
 *   Riot Games《Peeking into VALORANT's Netcode》（2020，读过原文）：用一组典型设置估算，探头的人比架点的人多约 141 ms 反应时间；
 *     客户端 144 帧时降到约 71 ms（-49%）；「human reaction times often fall in the 300ms range」；高手对决的胜负常在 20–50 ms。
 *   Woods, Wyma, Yund, Herron & Reed 2015《Factors influencing the latency of simple reaction time》Front Hum Neurosci 9:131
 *     （PMC4374455，只读到摘要）：1469 人，简单视觉反应时平均 231 ms，扣除硬件延迟后 213 ms；其中刺激察觉时间平均 131 ms。
 *   Mann, Williams, Ward & Janelle 2007《Perceptual-cognitive expertise in sport: a meta-analysis》J Sport Exerc Psychol 29(4)
 *     （只读到摘要）：42 项研究、388 个效应量；高手更会捕捉知觉线索（反应准确率和反应时都更好）。
 *   Correa, Lupiáñez & Tudela 2006《The attentional mechanism of temporal orienting》Exp Brain Res 169(1):58–68（只读到摘要）：
 *     提示目标何时出现时，反应比提示错时更快。
 *   「只按键也要 284–354 ms」「按 300 ms 算约 370–440 ms」是自己加的（测试复算）；开场探头的时长是示意；
 *   「高手不是反应快，是提前等在那里」是从 Mann 2007、Correa 2006 推出来的；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：第三次他直接把你打死、回放时间轴、分屏「他的屏幕 / 你的屏幕」 */
export const DEATH = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);
/** 开场两次晃身位（探出的拍号，让你开的那枪正落在配乐第 3、5 拍上）和第三次真正出来 */
export const JIGGLE_BEATS = [2.2, 4.2];
export const WIDE_BEAT = 6.5;
/** 一次晃身位：探出 3 帧、停 3 帧、缩回 3 帧（示意）；你开枪在探出后 13 帧（示意） */
export const JIG_OUT = 3;
export const JIG_HOLD = 3;
export const JIG_BACK = 3;
export const SHOOT_AFTER = 13;

export const SERIES = 'FPS 原理课';
export const EP = 'EP.13';
export const TOPIC = '先手优势';
export const TITLE = '探头就跑，你怎么打不到？';
export const HOOK_LINE = '他探头就缩，你怎么〖一枪都打不到〗？';
export const ANCHOR = '窗口';
export const TERM2 = '先手优势 · Peeker’s Advantage';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '你的枪不慢，\n为什么〔总是晚一步〕？';
export const BIG_LINE = '高手不是反应快，\n是〔提前等在那里〕';
export const FLIP_LINE = '你不是反应慢，\n是〔窗口太短〕';
export const ASK_LINE = '你被「晃身位」\n秀过几次？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '反应'],
  [16, '先手'],
  [24, '算账'],
  [32, '高手'],
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
  [0, '你架着这个箱子，等他出来。'],
  [2, '他探了一下头，你开枪：〖打空了〗。'],
  [4.2, '又探一下，又打空。'],
  [7, '〖第三次，他直接把你打死了〗。'],
  [10, '回放里，你每一枪都晚了一步。'],
  [15, '在他的屏幕上，他早就看见你了；'],
  [19, '在你的屏幕上，他才刚冒头。'],
  [24, '队友说你反应慢，你自己也这么觉得。'],
  [28, '可问题不在你，在他露头的那一下——'],
  [32, null], // 标题卡
  // 反应
  [36, '先看看，人最快能有多快。'],
  [40, '2015 年，研究者测了 1469 个人。'],
  [44, '屏幕一亮就按键，不用找人，不用瞄准。'],
  [48, '平均也要 213 毫秒。'],
  [52, '其中光是「看见」，就占了约 131 毫秒。'],
  [56, '而对枪，你还得找到他、把准星挪过去。'],
  [60, 'Riot 的工程师说：人的反应常在 300 毫秒左右。'],
  // 先手
  [68, '他露头再缩回去，只是一个短短的【窗口】。'],
  [72, '而你看到他，比他真正出来还要晚。'],
  [76, '网络和画面，要先把他送到你屏幕上。'],
  [80, 'Riot 估算：探头的人，多出约 141 毫秒。'],
  [84, '画面开到 144 帧，也还剩约 71 毫秒。'],
  [88, '你屏幕上的窗口，〖先被砍掉一截〗。'],
  [92, '你还没反应过来，他已经缩回去了。'],
  // 算账
  [100, '我们来算一笔账：'],
  [104, '先晚 71 到 141 毫秒，再加最快的 213。'],
  [108, '只按个键，也要 284 到 354 毫秒。'],
  [112, '按 Riot 说的 300 毫秒算，约 370 到 440。'],
  [116, '他只要在这之前缩回去，'],
  [120, '你开的每一枪，〖都打在空箱子上〗。'],
  [124, '不是你慢，是这个窗口〔不够人用〕。'],
  // 高手
  [132, '那高手是怎么打中的？'],
  [136, '一项元分析汇总了 42 项运动研究：'],
  [140, '高手强在更早读懂对手的动作线索。'],
  [144, '另一个实验：提前知道它什么时候出现，'],
  [148, '人的反应，就会更快。'],
  [152, null], // 大字：高手不是反应快，是提前等在那里
  // 怎么办（配乐回落段）
  [160, '别跟窗口拼反应，试试这四招：'],
  [164, '① 别追着晃身位的人开枪。'],
  [168, '② 准星停在他会出来的那一格。'],
  [172, '③ 等他第二次出来，再开枪。'],
  [176, '④ 你进攻时，也先晃一下拿信息。'],
  [180, '把找人和瞄准，在他出来之前做完。'],
  [188, '你要赢的不是反应，是那个——'],
  [192, null], // 第二个爆点「窗口」
  // 结尾
  [200, '窗口太短，就别在窗口里瞄准。'],
  [204, '这一次，你把准星停在箱子边上。'],
  [208, '他又探了出来。'],
  [216, '这一次，〔你等到了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D 架点：他两次晃身位，你追着开枪都打空；第三次他直接出来
  death: [DEATH, REPLAY], // 被打死：红屏裂纹
  replay: [REPLAY, SPLIT], // 回放：时间轴，他露出的窗口、你屏幕上才出现、你开枪（都在窗口之后）
  split: [SPLIT, fb(6)], // 分屏：他的屏幕先看见你 / 你的屏幕他才冒头
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  rtest: [fb(9), fb(13)], // 反应测试：屏幕一亮就按，计时 213 ms
  rsplit: [fb(13), fb(15)], // 213 拆成「看见 131」+「动手」
  quote: [fb(15), fb(16)], // Riot 原话：300 ms
  window: [fb(16), fb(18)], // 章节卡 + 锚词：他露出的窗口
  shift: [fb(18), fb(22)], // 你屏幕上的窗口晚到：141 / 71 ms
  cut: [fb(22), fb(24)], // 窗口被砍掉一截，他缩回去了你才反应
  sum: [fb(24), fb(29)], // 章节卡 + 堆叠条：71–141 + 213 = 284–354；按 300 算 370–440
  miss: [fb(29), fb(32)], // 射击场慢放：每一枪都打在空箱子上
  pro: [fb(32), fb(37)], // 章节卡 + 42 项研究、提前知道何时出现更快（示意）
  pre: [fb(37), fb(38)], // 射击场：准星提前停在箱子边
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：准星停在箱子边，静等，收暗
  hit2: [HIT2, fb(50)], // 「窗口」砸出
  outro: [fb(50), fb(56)], // 暖色射击场：准星等在箱子边，他一探头就爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：第一次晃（你不追）、第二次出来（你等到了） */
export const OUT_JIG1 = fbt(206);
export const OUT_PEEK = fbt(215.5);
export const OUT_KILL = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Riot 2020 */
export const RIOT_YEAR = 2020;
export const PEEK_ADV = 141;
export const PEEK_ADV_144 = 71;
export const RIOT_HUMAN_RT = 300;
export const RIOT_QUOTE = 'Considering that human reaction times often fall in the 300ms range, that’s a huge advantage!';
/** Woods 等 2015 */
export const WOODS_YEAR = 2015;
export const WOODS_N = 1469;
export const SRT_RAW = 231;
export const SRT = 213;
export const SDT = 131;
/** Mann 等 2007 */
export const MANN_YEAR = 2007;
export const MANN_STUDIES = 42;
export const MANN_EFFECTS = 388;
/** Correa 等 2006 */
export const CORREA_YEAR = 2006;

/** 自己算的账：你屏幕上晚到 + 反应 */
export const SUM_KEY: [number, number] = [PEEK_ADV_144 + SRT, PEEK_ADV + SRT];
export const SUM_RIOT: [number, number] = [PEEK_ADV_144 + RIOT_HUMAN_RT, PEEK_ADV + RIOT_HUMAN_RT];

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep48-jiggle-peek';
export const SFX: [string, number, number][] = [
  // 开场：两次打空 → 被打死 → 回放 → 分屏
  ...JIGGLE_BEATS.map((b): [string, number, number] => [`${A}/gunshot.wav`, fbt(b) + SHOOT_AFTER, 0.8]),
  ...JIGGLE_BEATS.map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b) + SHOOT_AFTER + 2, 0.45]),
  [`${A}/gunshot.wav`, DEATH, 0.72],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/rewind.wav`, REPLAY - 4, 0.6],
  [`${A}/impact.wav`, REPLAY, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 反应
  [`${A}/tick.wav`, fbt(44), 0.55],
  ['audio/sfx/ding.wav', fbt(48), 0.4],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  [`${A}/tick.wav`, fbt(52), 0.5],
  ['audio/sfx/whoosh.wav', fb(15), 0.35],
  // 先手
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/tick.wav`, fbt(80), 0.5],
  [`${A}/tick.wav`, fbt(84), 0.5],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  [`${A}/impact.wav`, fbt(88), 0.6],
  // 算账
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(104), 0.5],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(29), 0.35],
  [`${A}/gunshot.wav`, fbt(120), 0.7],
  // 高手
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(136), 0.5],
  ['audio/sfx/ding.wav', fbt(146), 0.4],
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
  [`${A}/tick.wav`, OUT_JIG1, 0.45],
  [`${A}/gunshot.wav`, OUT_KILL, 0.8],
  ['audio/sfx/ding.wav', OUT_KILL + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
