/**
 * ep39 帧数翻倍，反应变快了吗？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「流水线」：帧数量的是一秒出几张画面（出货速度），你感觉到的是一枪从鼠标走到屏幕的整条流水线（系统延迟）。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「流水线」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都读过原文）：
 *   NVIDIA《Introducing NVIDIA Reflex: Optimize and Measure Latency in Competitive Games》（GeForce News，2020-09-01）：
 *     系统延迟的定义和流水线各段、渲染队列、GPU 吃满时 CPU 提前两帧（文中例子）、「far from 1-to-1」、多数玩家 50–100 ms、12 vs 20 ms 差 182 ms、
 *     降画质 / 独占全屏 / 游戏内限帧 / 低延迟模式；
 *   Spjut, Boudaoud, Binaee, Kim, Majercik, McGuire, Luebke, Kim《Latency of 30 ms Benefits First Person Targeting Tasks More Than
 *     Refresh Rate Above 60 Hz》（SIGGRAPH Asia 2019 Technical Briefs，作者版全文）：8 名高手、60/120/240/360 Hz × 3 档延迟、
 *     单发打靶刷新率不显著、手眼延迟 150–200 ms、「largely because of the latency reduction」。
 *   一帧多少毫秒（1000 ÷ 帧数）是自己算的，测试里复算。
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

/** 开场三次重音（第 7、10、15 拍）：开枪打空、帧数翻倍、按下鼠标到冒火要多久 */
export const SHOT = fbt(7);
/** 流水线五段从第 44 拍起每 10 帧亮一段（都在 pipe 镜头里） */
export const PIPE_PER = 10;
export const DOUBLE = fbt(10);
export const CLICK = fbt(15);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.07';
export const TOPIC = '系统延迟';
export const TITLE = '帧数翻倍，反应变快了吗？';
export const ANCHOR = '流水线';
export const TERM2 = '系统延迟 · System Latency';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '帧数翻倍，\n反应就〔快一倍〕？';
export const BIG_LINE = '高刷有用，\n主要因为它〔缩短了延迟〕';
export const FLIP_LINE = '你的反应没有变慢，\n是那条〔流水线〕太长';
export const ASK_LINE = '你玩游戏开多少帧？\n开了低延迟模式吗？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '流水线'],
  [16, '排队'],
  [24, '算账'],
  [32, '实验'],
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
  [0, '你刚把帧数从 120 拉到了 240。'],
  [7, '可这一枪，还是〖慢了半拍〗。'],
  [10, '帧数翻了一倍，画面确实更顺了。'],
  [15, '可从按下鼠标到枪口冒火，快了多少？'],
  [24, '帧数翻倍，反应就会快一倍吗？'],
  [28, '答案藏在鼠标和屏幕之间——'],
  [32, null], // 标题卡
  // 流水线
  [36, '从你按下鼠标，到屏幕上枪口冒火，'],
  [40, 'NVIDIA 把这段时间叫「系统延迟」。'],
  [44, '它要依次走过鼠标、CPU、GPU 和显示器。'],
  [48, 'NVIDIA 说：帧数和延迟相关，但远不是一比一。'],
  [52, '帧数量的是：一秒能出几张画面。'],
  [56, '延迟量的是：你的一枪，走完全程要多久。'],
  [60, '一个是出货速度，一个是整条【流水线】。'],
  // 排队
  [68, 'CPU 先把这一帧算好，再交给 GPU 去画。'],
  [72, '可 GPU 一忙不过来，CPU 就先往前多做几帧。'],
  [76, '做好的帧，在〖渲染队列〗里排队等 GPU。'],
  [80, 'NVIDIA 的例子里，CPU 跑在前面两帧。'],
  [84, '队列让 GPU 不停工，帧数更高、更稳。'],
  [88, '代价是：你这一枪，得排在前两帧后面。'],
  [92, '帧数是高了，你的那一枪却〖更晚出现〗。'],
  // 算账
  [100, '先算一笔账：120 帧，一帧 8.3 毫秒。'],
  [104, '翻到 240 帧，一帧 4.2 毫秒。'],
  [108, '一帧只省下约 4 毫秒。'],
  [112, 'NVIDIA：多数玩家整条要 50～100 毫秒。'],
  [116, '你自己从看到到动手，还要 150～200 毫秒。'],
  [120, '帧数翻倍，缩短的只是机器那一段。'],
  [124, '你的反应本身，〔一毫秒都没变〕。'],
  // 实验
  [132, 'NVIDIA 的研究员，把帧数和延迟拆开测：'],
  [136, '高刷屏故意加延迟，让 4 种刷新率延迟一样。'],
  [140, '只换刷新率，单发打靶〔没有显著差别〕。'],
  [144, '只换延迟，成绩立刻拉开。'],
  [148, '延迟只差 8 毫秒，打靶就慢 182 毫秒。'],
  [152, null], // 大字：高刷有用，主要因为它缩短了延迟
  // 怎么办（配乐回落段）
  [160, '照 NVIDIA 的拆解，能做四件事：'],
  [164, '① 打开游戏里的低延迟模式，清空队列。'],
  [168, '② 用独占全屏，少一道桌面合成。'],
  [172, '③ 画质降一档，GPU 不再堵车。'],
  [176, '④ 用游戏内限帧，别让 CPU 跑太前。'],
  [180, '帧数高当然好，但先把队排短。'],
  [188, '帧数只是出货速度，你感觉到的是整条——'],
  [192, null], // 第二个爆点「流水线」
  // 结尾
  [200, '帧数翻倍，画面更顺，机器那段也短了。'],
  [204, '但你的手眼，还是要 150～200 毫秒。'],
  [208, '先手比的，是两段加起来谁更短。'],
  [216, '机器那段排短了，你的反应才〔不被拖后腿〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, SHOT], // 3D：帧数表 120 → 240，敌人横移进准星
  shot: [SHOT, DOUBLE], // 开枪：子弹落在敌人身后，MISS
  double: [DOUBLE, CLICK], // 两条帧序列：120 帧 vs 240 帧，帧数 ×2
  click: [CLICK, fb(6)], // 按下鼠标 → 枪口冒火，中间是「? 毫秒」
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  pipe: [fb(9), fb(12)], // 流水线五段依次亮起，信号点跑过去
  quote: [fb(12), fb(13)], // NVIDIA 原话：far from 1-to-1
  rate: [fb(13), fb(16)], // 出货速度 vs 一张走完全程
  queue: [fb(16), fb(20)], // 章节卡 + CPU / 队列 / GPU 三条泳道
  cost: [fb(20), fb(24)], // 你的那一枪排在两帧后面
  math: [fb(24), fb(28)], // 章节卡 + 一帧多少毫秒
  scale: [fb(28), fb(32)], // 整条延迟 + 手眼时间，省下的 4 毫秒只是一小条
  exp: [fb(32), fb(35)], // 章节卡 + 4 × 3 实验条件
  result: [fb(35), fb(37)], // 只换刷新率 vs 只换延迟（示意）
  aim: [fb(37), fb(38)], // 8 毫秒 vs 182 毫秒
  bigline: [fb(38), fb(40)], // 大字：高刷有用，主要因为缩短了延迟
  steps: [fb(40), fb(45)], // 章节卡 + 四件事
  build: [fb(45), HIT2], // 回落段：流水线变暗、队列清空，收暗
  hit2: [HIT2, fb(50)], // 「流水线」砸出
  sum: [fb(50), fb(54)], // 暖色：机器 + 你，两段加起来
  headshot: [fb(54), fb(56)], // 暖色 3D：这次一枪爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** NVIDIA《Introducing NVIDIA Reflex》（GeForce News，2020） */
export const NV_YEAR = 2020;
export const NV_QUOTE = 'In general, higher FPS correlates with lower system latency - however this relationship is far from 1-to-1.';
export const NV_QUEUE_QUOTE = 'This helps to maximise FPS (throughput), but can introduce latency.';
export const CPU_AHEAD = 2; // "In the case above, the CPU is allowed to run two frames ahead."
export const TYPICAL_LATENCY: [number, number] = [50, 100]; // "most gamers play on systems with 50-100ms of system latency"
export const AIM_LAT: [number, number] = [12, 20]; // "between a 12ms and 20ms PCs was measured to be 182ms"
export const AIM_DIFF = 182;
/** 流水线五段（NVIDIA 文中简化版：Peripheral, CPU, Render Queue, GPU, Display） */
export const STAGES = ['鼠标', 'CPU', '渲染队列', 'GPU', '显示器'];
export const STAGES_EN = ['PERIPHERAL', 'CPU', 'RENDER QUEUE', 'GPU', 'DISPLAY'];

/** Spjut 等 2019（SIGGRAPH Asia Technical Briefs） */
export const STUDY_YEAR = 2019;
export const SUBJECTS = 8;
export const RATES = [60, 120, 240, 360];
export const LAT_LEVELS = ['低', '中', '高'];
/** 表 1：各刷新率下实测的点击到出光延迟（ms），低 / 中 / 高 */
export const LAT_TABLE: Record<number, [number, number, number]> = {60: [22, 55, 88], 120: [24, 58, 91], 240: [25, 54, 87], 360: [22, 52, 82]};
export const HUMAN_DELAY: [number, number] = [150, 200]; // "often accompany 150-200 ms sensorimotor delay"
export const STUDY_QUOTE = 'high refresh rate is important largely because of the latency reduction it provides.';

/** 自己算：一帧多少毫秒 */
export const frameMs = (fps: number) => 1000 / fps;
export const MS_60 = Math.round(frameMs(60) * 10) / 10; // 16.7
export const MS_120 = Math.round(frameMs(120) * 10) / 10; // 8.3
export const MS_240 = Math.round(frameMs(240) * 10) / 10; // 4.2
export const SAVED = Math.round(frameMs(120) - frameMs(240)); // 4

export const PIPE_AT = fbt(44);

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep39-latency';
export const SFX: [string, number, number][] = [
  // 开场：帧数表跳动 → 开枪打空 → 帧数翻倍 → 点击
  ...[2, 3, 4, 5].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  [`${A}/gunshot.wav`, SHOT, 0.72],
  [`${A}/crack.wav`, SHOT + 2, 0.68],
  [`${A}/rewind.wav`, DOUBLE - 4, 0.5],
  ['audio/sfx/whoosh.wav', DOUBLE, 0.45],
  [`${A}/impact.wav`, DOUBLE, 0.45],
  ['audio/sfx/whoosh.wav', CLICK, 0.45],
  [`${A}/tick.wav`, CLICK + 4, 0.55],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 流水线：五段依次亮起
  ...[0, 1, 2, 3, 4].map((i): [string, number, number] => [`${A}/tick.wav`, PIPE_AT + i * PIPE_PER, 0.45]),
  ['audio/sfx/whoosh.wav', fb(12), 0.35],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.45],
  // 排队
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/tick.wav`, fbt(76), 0.5],
  ['audio/sfx/whoosh.wav', fb(20), 0.35],
  [`${A}/gunshot.wav`, fbt(88), 0.5],
  [`${A}/impact.wav`, fbt(92), 0.62],
  // 算账
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  ...[100, 104, 108].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.5]),
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/impact.wav`, fbt(124), 0.5],
  // 实验
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fb(35), 0.35],
  ['audio/sfx/ding.wav', fbt(144), 0.4],
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
  [`${A}/gunshot.wav`, fbt(218), 0.9],
  ['audio/sfx/ding.wav', fbt(218) + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
