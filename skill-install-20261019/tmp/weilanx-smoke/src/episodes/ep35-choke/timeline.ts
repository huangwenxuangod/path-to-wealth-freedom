/**
 * ep35 一到残局，手就开始抖？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「自动驾驶」：练熟的枪法平时是自动驾驶，残局的压力让你开始盯着自己的手——亲手把它关掉了。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「自动驾驶」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都读过摘要原文）：
 *   Baumeister《Choking under pressure: self-consciousness and paradoxical effects of incentives on skillful performance》JPSP 1984；
 *   Beilock & Carr《On the fragility of skilled performance: what governs choking under pressure?》J Exp Psychol Gen 2001；
 *   Wulf《Attentional focus and motor learning: a review of 15 years》International Review of Sport and Exercise Psychology 2013。
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

/** 开场三次重音（第 7、10、15 拍）：残局输了、回放连空三枪、平时 vs 残局 */
export const DEATH = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);
/** 开场：第 3、4、5 拍连开三枪，全空 */
export const MISS_BEATS = [3, 4, 5];

export const SERIES = 'FPS 原理课';
export const EP = 'EP.05';
export const TOPIC = '残局手抖';
export const TITLE = '一到残局，手就开始抖？';
export const ANCHOR = '自动驾驶';
export const TERM2 = '压力下失常 · Choking Under Pressure';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '平时一枪的事，\n残局为什么就〔手抖〕？';
export const FOCUS_LINE = '别想手怎么动，\n只想〔子弹去哪〕';
export const FLIP_LINE = '你不是心理素质差，\n你只是在残局里〔开始想了〕';
export const ASK_LINE = '你最痛的一次残局，\n是怎么输的？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '自动驾驶'],
  [16, '手动'],
  [24, '实验'],
  [32, '焦点'],
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
  [0, '一打一，全队都在看你。'],
  [3, '一枪，两枪，三枪，〖全空〗。'],
  [7, '〖残局输了〗。'],
  [10, '回放里，你的准星一直在抖。'],
  [15, '平时一枪的事，残局就是打不中。'],
  [24, '是你心理素质太差了吗？'],
  [28, '答案，藏在你脑子里的一个开关——'],
  [32, null], // 标题卡
  // 自动驾驶
  [36, '先想想你刚学开枪的时候。'],
  [40, '瞄准、停步、开枪，每一步都要想。'],
  [44, '练了几百局以后，这些步骤连成了一个动作。'],
  [48, '2001 年，心理学家研究了高尔夫推杆：'],
  [52, '高手对自己的每一次推杆，反而记不太清。'],
  [56, '因为练熟的动作，不需要一步步盯着。'],
  [60, '平时你的枪法，开的是【自动驾驶】。'],
  // 手动
  [68, '那残局里发生了什么？'],
  [72, '1984 年，Baumeister 提出一个模型：'],
  [76, '压力一来，你会盯着自己怎么做。'],
  [80, '你一盯，自动驾驶就被〖打断〗了。'],
  [84, '比赛、奖金、观众，都能让人失常。'],
  [88, '他做了 6 个实验，结果都对得上。'],
  [92, '残局里的你，在〖手动〗开枪。'],
  // 实验
  [100, '最妙的是 2001 年那组对照实验。'],
  [104, '推杆这种练熟的动作，压力下变差了；'],
  [108, '一步步算的题，压力下却〔没变差〕。'],
  [112, '越熟练的动作，越怕你去盯它。'],
  [116, '边干别的边练，照样失常；'],
  [120, '被人盯着、录像着练，失常就〔消失了〕。'],
  [124, '习惯了被看，残局就不再是残局。'],
  // 焦点
  [132, '那残局里，注意力该放在哪？'],
  [136, '一篇综述总结了 15 年的研究：'],
  [140, '盯着动作的效果，比盯着身体更准。'],
  [144, '不同任务、不同水平、不同年龄，都成立。'],
  [148, '放到射击里：盯对手的头，别盯你的手。'],
  [152, null], // 大字：别想手怎么动，只想子弹去哪
  // 怎么办（配乐回落段）
  [160, '那能做什么？'],
  [164, '① 残局只盯对手的头，别想手怎么动。'],
  [168, '② 平时练枪给自己加压：录屏、开直播。'],
  [172, '③ 残局用你练得最熟的那一套。'],
  [176, '④ 只想下一个动作，别想输赢。'],
  [180, '手抖不是你不行，是你突然开始想了。'],
  [188, '残局里，你亲手关掉了——'],
  [192, null], // 第二个爆点「自动驾驶」
  // 结尾
  [200, '你练过的几百局，都还在你手上。'],
  [204, '它们只是需要你，别去打扰它们。'],
  [208, '下一个残局，把眼睛交给对手的头，'],
  [216, '把手，交还给你练过的那几百局。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：1v1，准星抖，连空三枪
  death: [DEATH, REPLAY], // 残局输了
  replay: [REPLAY, SPLIT], // 回放：准星一直在抖（慢放）
  split: [SPLIT, fb(6)], // 平时 vs 残局
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  steps1: [fb(9), fb(12)], // 新手一步一步 vs 老手一气呵成
  golf: [fb(12), fb(14)], // Beilock & Carr 2001：程序化
  auto: [fb(14), fb(16)], // 自动驾驶：准星稳
  chain: [fb(16), fb(21)], // 章节卡 + 压力 → 盯自己 → 打断
  pressure: [fb(21), fb(23)], // 比赛 / 奖金 / 观众；6 个实验
  manual: [fb(23), fb(24)], // 手动开枪：准星抖
  exp: [fb(24), fb(28)], // 章节卡 + 推杆 vs 字母算术
  train: [fb(28), fb(32)], // 两种训练：边干别的练 ✗ / 被盯着练 ✓
  focus: [fb(32), fb(35)], // 章节卡 + 内部焦点 vs 外部焦点
  wulf: [fb(35), fb(37)], // Wulf 2013 原话
  head: [fb(37), fb(38)], // 盯头不盯手
  focusline: [fb(38), fb(40)], // 大字：只想子弹去哪
  steps: [fb(40), fb(45)], // 章节卡 + 四步方法
  build: [fb(45), HIT2], // 回落段：1v1 准星又开始抖，收暗
  hit2: [HIT2, fb(50)], // 「自动驾驶」砸出
  calm: [fb(50), fb(54)], // 暖色：准星稳下来
  win: [fb(54), fb(56)], // 一枪爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（摘要原文，测试核对） ---------------- */

export const BAUM_YEAR = 1984;
export const BAUM_EXPERIMENTS = 6;
export const BAUM_MODEL = 'the pressure increases the conscious attention to the performer’s own process of performance and that this increased conscious attention disrupts the automatic or overlearned nature of the execution';
export const BAUM_PRESSURES = ['implicit competition', 'a cash incentive', 'audience-induced pressure'];
export const BAUM_LOWSC = 'Individuals low in dispositional self-consciousness were shown to be more susceptible to choking under pressure';

export const BEILOCK_YEAR = 2001;
export const BEILOCK_PROC = 'skilled putting is encoded in a procedural form that supports performance without the need for step-by-step attentional control';
export const BEILOCK_RESULT = 'Choking occurred in putting but not alphabet arithmetic. In putting, choking was unchanged by dual-task training but eliminated by self-consciousness training.';

export const WULF_YEARS = 15;
export const WULF_QUOTE = 'an external focus (i.e., on the movement effect) enhances motor performance and learning relative to an internal focus (i.e., on body movements)';
export const WULF_SCOPE = 'extend across different types of tasks, skill levels, and age groups';

/** 准星抖动：确定性噪声（像素），amp 是幅度 */
export const jitter = (f: number, amp: number): [number, number] => [amp * 0.5 * (Math.sin(f * 1.7) + Math.sin(f * 2.9 + 1)), amp * 0.5 * (Math.sin(f * 2.3 + 2) + Math.sin(f * 3.7 + 0.5))];

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep35-choke';
export const SFX: [string, number, number][] = [
  // 开场：1v1，连空三枪 → 输 → 回放 → 分屏
  [`${A}/tick.wav`, fbt(0), 0.5],
  ...MISS_BEATS.map((b): [string, number, number] => [`${A}/gunshot.wav`, fbt(b), 0.7]),
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.7],
  [`${A}/rewind.wav`, REPLAY - 4, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 自动驾驶
  ...[40, 41, 42, 43].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  ['audio/sfx/whoosh.wav', fb(12), 0.35],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/gunshot.wav`, fbt(60), 0.6],
  ['audio/sfx/ding.wav', fbt(60) + 3, 0.35],
  // 手动
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(80), 0.45],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  ...[84, 85, 86].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  ['audio/sfx/whoosh.wav', fb(23), 0.35],
  // 实验
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/tick.wav`, fbt(116), 0.5],
  ['audio/sfx/ding.wav', fbt(120), 0.4],
  // 焦点
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
  [`${A}/gunshot.wav`, fbt(220), 0.75],
  ['audio/sfx/ding.wav', fbt(220) + 3, 0.35],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
