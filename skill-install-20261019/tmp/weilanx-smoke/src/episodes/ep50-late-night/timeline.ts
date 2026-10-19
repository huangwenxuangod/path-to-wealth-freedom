/**
 * ep50 凌晨打排位，手感去哪了？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：凌晨两点还在排，枪越打越飘，你以为是手感玄学、状态不对；其实是醒得太久——
 * 醒着 17–19 小时，有些表现和血液酒精 0.05% 一样差；缺觉会累积，而你自己几乎察觉不到；最先坏掉的是注意力的「走神」；
 * 练完睡一觉，动作技能反而变强。招：定下线时间、晚了连输就别开、新技巧睡前练、别连着熬。锚词「离线」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「离线」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都只读到摘要）：
 *   Williamson & Feyer 2000《Moderate sleep deprivation produces impairments in cognitive and motor performance equivalent to
 *     legally prescribed levels of alcohol intoxication》Occup Environ Med 57(10):649–655：39 人（运输业 30、军队 9）、28 小时不睡 +
 *     喝到约 0.1% BAC；醒着 17–19 小时（22:30 和 01:00）时有些测试相当于或差于 0.05% BAC，反应最多慢 50%。
 *   Van Dongen, Maislin, Mullington & Dinges 2003《The cumulative cost of additional wakefulness》Sleep 26(2):117–126：48 人；
 *     每晚 8 / 6 / 4 小时连续 14 天，或 3 晚完全不睡；每晚 ≤ 6 小时造成的认知缺陷最多相当于 2 晚完全不睡；受试者基本没察觉；
 *     清醒超过 15.84 小时后，注意力失误几乎随累积清醒时间线性增加。
 *   Lim & Dinges 2010《A meta-analysis of the impact of short-term sleep deprivation on cognitive variables》Psychol Bull 136(3):375–389：
 *     70 篇文章、147 项测试；效应量从推理准确率 g = −0.125（不显著）到简单注意力失误 g = −0.776。
 *   Walker, Brakefield, Morgan, Hobson & Stickgold 2002《Practice with sleep makes perfect: sleep-dependent motor skill learning》
 *     Neuron 35(1):205–211：睡一晚动作速度提高 20% 且准确度不降，同样时长醒着没有显著提升。
 *   「早上 8 点起、凌晨 2 点就醒了 18 小时」是自己算的；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：被反手带走、表盘「醒了 18 小时」、分屏「下午 2 点 / 凌晨 2 点」 */
export const DEATH = fbt(7);
export const DIAL = fbt(10);
export const SPLIT = fbt(15);
/** 开场你打空的三枪（拍号） */
export const OPEN_SHOTS = [3, 4, 6];

export const SERIES = 'FPS 原理课';
export const EP = 'EP.15';
export const TOPIC = '缺觉';
export const TITLE = '凌晨打排位，手感去哪了？';
export const HOOK_LINE = '凌晨两点还在排，你的〖手感为什么没了〗？';
export const ANCHOR = '离线';
export const TERM2 = '睡眠巩固 · Sleep-dependent Consolidation';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '你不觉得困，\n为什么〔枪越来越飘〕？';
export const BIG_LINE = '你不觉得困，\n不代表〔你没变菜〕';
export const FLIP_LINE = '你不是手感没了，\n是〔大脑该下线了〕';
export const ASK_LINE = '你最晚的一把排位，\n是几点开的？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '醒了多久'],
  [16, '感觉不到'],
  [24, '掉线'],
  [32, '睡一觉'],
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
  [0, '凌晨两点，你还在排位。'],
  [3, '一个站着不动的人，你打了三枪。'],
  [7, '〖你被他反手带走了〗。'],
  [10, '你觉得是手感玄学，今天状态不对。'],
  [15, '可你一点都不觉得困，'],
  [19, '还想着「再打一把就睡」。'],
  [24, '队友说你在梦游，你自己也想不通。'],
  [28, '问题不在手感，在你醒了多久——'],
  [32, null], // 标题卡
  // 醒了多久
  [36, '2000 年，澳大利亚的研究者做了个实验。'],
  [40, '39 个人一直不睡，隔一阵就测一次反应。'],
  [44, '另一天，同一批人喝酒，测同样的项目。'],
  [48, '结果：醒着 17 到 19 个小时，'],
  [52, '有些测试，和血液酒精 0.05% 一样差。'],
  [56, '反应速度，最多慢了 50%。'],
  [60, '早上 8 点起床，凌晨 2 点就醒了 18 个小时。'],
  // 感觉不到
  [68, '大脑也要【离线】，可你一直没让它下线。'],
  [72, '2003 年的实验更狠：连续 14 天，'],
  [76, '分组每晚只让睡 8、6、4 个小时。'],
  [80, '每晚只睡 6 小时的人，两周后，'],
  [84, '表现最多掉到跟〖两晚完全不睡〗一样。'],
  [88, '可他们自己，并没有觉得越来越困。'],
  [92, '你在变菜，你的困意却没跟着报警。'],
  // 掉线
  [100, '缺觉最先坏掉的，是哪一样？'],
  [104, '2010 年一项元分析，汇总了 70 篇研究。'],
  [108, '影响最大的，是简单注意力里的「走神」。'],
  [112, '眼睛开着，大脑却断线了一小下。'],
  [116, '醒着超过约 16 小时，走神就越来越多。'],
  [120, '对枪时那一下断线，〖就是你被带走的那一下〗。'],
  [124, '不是手感玄学，是大脑在〔掉线〕。'],
  // 睡一觉
  [132, '还有个反直觉的事：练完睡一觉会变强。'],
  [136, '2002 年的实验：让人练一个动作技能。'],
  [140, '隔同样久、但一直醒着：没有显著进步。'],
  [144, '中间睡一晚再测：速度快了 20%。'],
  [148, '准确度也没掉，睡着时大脑在偷偷整理。'],
  [152, null], // 大字：你不觉得困，不代表你没变菜
  // 怎么办（配乐回落段）
  [160, '别跟困意较劲，试试这四招：'],
  [164, '① 定一个下线时间，到点就停。'],
  [168, '② 很晚了还连输，就别再开下一把。'],
  [172, '③ 新技巧睡前练，睡一觉再上分。'],
  [176, '④ 别连着几晚熬，缺觉会累积。'],
  [180, '你睡着的那几个小时，也算在练枪。'],
  [188, '让手感回来的，不是再来一把，是那段——'],
  [192, null], // 第二个爆点「离线」
  // 结尾
  [200, '睡饱的你，和凌晨两点的你，'],
  [204, '不是同一个人。'],
  [208, '第二天下午，同一个靶位。'],
  [216, '这一次，〔一枪就够了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：凌晨两点，准星飘，站着不动的人打三枪都空
  death: [DEATH, DIAL], // 被反手带走：红屏裂纹
  dial: [DIAL, SPLIT], // 24 小时表盘：从早上 8 点醒到凌晨 2 点
  split: [SPLIT, fb(6)], // 分屏：下午 2 点的准星稳 / 凌晨 2 点的准星飘
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  equiv: [fb(9), fb(14)], // 两把尺子：醒着的小时数 ↔ 血液酒精浓度
  slow: [fb(14), fb(15)], // 反应最多慢 50%
  awake: [fb(15), fb(16)], // 表盘：18 小时
  offline: [fb(16), fb(18)], // 章节卡 + 锚词：大脑在线 18 小时
  days: [fb(18), fb(22)], // 14 天三条线（示意）：6 小时那条掉到「两晚不睡」
  unaware: [fb(22), fb(24)], // 两根柱（示意）：实际变菜 ↑、自己觉得困 —
  meta: [fb(24), fb(28)], // 章节卡 + 效应量：走神 0.776 vs 推理 0.125
  lapse: [fb(28), fb(32)], // 一天的注意力：超过约 16 小时后断线越来越密（示意）
  sleep: [fb(32), fb(38)], // 章节卡 + 醒着 vs 睡一晚 +20%
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：表盘走到下线时间，屏幕熄灭，收暗
  hit2: [HIT2, fb(50)], // 「离线」砸出
  outro: [fb(50), fb(56)], // 暖色射击场：下午 2 点，准星稳，一枪爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：准星稳下来、开枪 */
export const OUT_KILL = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Williamson & Feyer 2000 */
export const WF_YEAR = 2000;
export const WF_N = 39;
export const WF_HOURS: [number, number] = [17, 19];
export const WF_BAC = 0.05;
export const WF_SLOWER = 50;
/** Van Dongen 等 2003 */
export const VD_YEAR = 2003;
export const VD_N = 48;
export const VD_DAYS = 14;
export const VD_DOSES = [8, 6, 4];
export const VD_EQUIV_NIGHTS = 2;
export const VD_THRESHOLD_H = 15.84;
export const VD_QUOTE = 'Sleepiness ratings suggest that subjects were largely unaware of these increasing cognitive deficits';
/** Lim & Dinges 2010 */
export const LD_YEAR = 2010;
export const LD_ARTICLES = 70;
export const LD_TESTS = 147;
export const LD_LAPSES_G = 0.776;
export const LD_REASON_G = 0.125;
/** Walker 等 2002 */
export const WALKER_YEAR = 2002;
export const WALKER_GAIN = 20;
/** 自己算的：早上 8 点醒，到凌晨 2 点 */
export const WAKE_AT = 8;
export const NOW_AT = 26; // 次日 2 点
export const AWAKE_H = NOW_AT - WAKE_AT;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep50-late-night';
export const SFX: [string, number, number][] = [
  // 开场：三枪打空 → 被带走 → 表盘 → 分屏
  ...OPEN_SHOTS.map((b): [string, number, number] => [`${A}/gunshot.wav`, fbt(b), 0.75]),
  [`${A}/gunshot.wav`, DEATH, 0.72],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/impact.wav`, DIAL, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 醒了多久
  [`${A}/tick.wav`, fbt(48), 0.5],
  [`${A}/impact.wav`, fbt(52), 0.6],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  ['audio/sfx/whoosh.wav', fb(15), 0.35],
  [`${A}/tick.wav`, fbt(60), 0.5],
  // 感觉不到
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/impact.wav`, fbt(84), 0.6],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  // 掉线
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/impact.wav`, fbt(120), 0.6],
  // 睡一觉
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(140), 0.5],
  ['audio/sfx/ding.wav', fbt(144), 0.45],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/gunshot.wav`, OUT_KILL, 0.8],
  ['audio/sfx/ding.wav', OUT_KILL + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
