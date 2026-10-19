/**
 * ep49 对面一横跳，你就打不中？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：对面左右横跳、你的准星永远慢一拍，队友说你枪法烂；其实你跟住移动的人靠的是「预测」，
 * 他每换一次向，你的手都要先过一段反应时间、再慢慢转过来，这段时间准星还在往老方向跑；节奏可预期时大脑会提前减速，节奏一乱就落空。
 * 招：别跟着甩、准星停在他换向的那一头、等他减速停下再开枪、自己横跳节奏别固定。锚词「预测」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「预测」。片尾停在评论区问题，不做下期预告。
 * 事实出处：
 *   Miyamoto, Numasawa, Hirano, Yoshimura & Ono 2025《Reduced latency in manual interception with anticipatory smooth eye movements》
 *     iScience 28(3):111849（PMC11834127，读过开放全文）：引言「delays of approximately 100 ms」；参与者平均拦截潜伏期 120–420 ms，
 *     其中包括比常规伸手反应短得多的，说明各人靠预测 / 靠反应的比重不同。
 *   Kowler, Rubinstein, Santos & Wang 2019《Predictive Smooth Pursuit Eye Movements》Annu Rev Vis Sci 5:223–246（只读到摘要）：
 *     追踪会预判运动轨迹的变化，以减少处理延迟的影响。
 *   Engel & Soechting 2000《Manual tracking in two dimensions》J Neurophysiol 83(6):3483–3496（只读到摘要）：
 *     目标在随机时刻突然换向，过一段反应时间后手才朝新方向去拦截。
 *   Engel, Anderson & Soechting 2000《Similarity in the response of smooth pursuit and manual tracking to a change in the direction of target motion》
 *     J Neurophysiol 84(3):1149–1156（只读到摘要）：眼睛和手都是从旧方向「慢慢转」到新方向。
 *   de Hemptinne, Barnes & Missal 2010《Influence of previous target motion on anticipatory pursuit deceleration》Exp Brain Res 207:173–184
 *     （只读到摘要）：目标折返可预期时眼睛会提前减速；提前量的时机不准，并取决于前几次的经历。
 *   Riot《VALORANT Patch Notes 3.0》（2021，ep40 读过原文）：Deadzone 是「玩家变得不准的移动速度」，27.5%。
 *   「他只有换向那一下才停得下来开枪」是推断（换向时速度过零 + 死区）；开场的横跳节奏和准星滞后帧数是示意；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：他站住一枪打死你、回放两条轨迹、分屏「他换向 / 你的准星还在老方向」 */
export const DEATH = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);

/** 横跳（示意）：关键帧 [拍号, 横向位置 米]，之间匀速，最后一段减速停下；开场的换向时间不规则 */
export const OPEN_KF: [number, number][] = [
  [0.3, -1.0],
  [1.9, 0.9],
  [3.2, -0.2],
  [4.6, 1.0],
  [5.5, 0.2],
  [6.6, 0.9],
];
/** 开场他站住开枪的帧（之后不动） */
export const OPEN_STOP = fbt(6.6);
/** 准星滞后（示意）：准星按 LAG 帧之前看到的位置和速度往前推（预测），换向后有 LAG 帧还在往老方向跑 */
export const LAG = 6;
/** 你在开场打的几枪（拍号）：每次他换向后准星冲得最远的那一拍，都落在他身边 */
export const OPEN_SHOTS = [2.2, 3.5, 4.9];

export const SERIES = 'FPS 原理课';
export const EP = 'EP.14';
export const TOPIC = '预测性追踪';
export const TITLE = '对面一横跳，你就打不中？';
export const HOOK_LINE = '他左右横跳，你的准星怎么〖永远慢一拍〗？';
export const ANCHOR = '预测';
export const TERM2 = '预测性追踪 · Predictive Tracking';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '你的手不慢，\n为什么〔总追不上〕？';
export const BIG_LINE = '他只有换向那一下，\n才〔停得下来开枪〕';
export const FLIP_LINE = '你不是枪法烂，\n是〔预测被他骗了〕';
export const ASK_LINE = '你身边谁的横跳，\n最难打？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '追踪'],
  [16, '换向'],
  [24, '节奏'],
  [32, '停顿'],
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
  [0, '他在你面前左右横跳，你跟着甩。'],
  [3, '你追到左边，他已经往右了。'],
  [7, '〖他站住一枪，你倒下了〗。'],
  [10, '回放里，你的准星永远慢他一拍。'],
  [15, '他换向的那一下，'],
  [19, '你的准星还在往老方向跑。'],
  [24, '队友说你枪法烂，你自己也这么觉得。'],
  [28, '可你追的，其实是他上一刻的方向——'],
  [32, null], // 标题卡
  // 追踪
  [36, '先看你是怎么跟住一个移动的人的。'],
  [40, '从眼睛看到到手动起来，有约 100 毫秒延迟。'],
  [44, '可他匀速走的时候，大脑会提前算下一刻。'],
  [48, '研究里管这叫：预测性追踪。'],
  [52, '你的准星，一直瞄着他「下一刻」的位置。'],
  [56, '所以跟匀速的人，延迟被抵消掉了。'],
  [60, '这本来是你最厉害的地方。'],
  // 换向
  [68, '而横跳，打掉的就是你的【预测】。'],
  [72, '2000 年的实验：目标走着走着，突然拐弯。'],
  [76, '人的手，要过一段反应时间才开始转。'],
  [80, '而且不是一下转过去，是慢慢转过去。'],
  [84, '这段时间里，你的准星还在往老方向走。'],
  [88, '他横跳一次，你就要重新〖落后一次〗。'],
  [92, '他跳得越乱，你越追不上。'],
  // 节奏
  [100, '那为什么有时候，你又能打中横跳的人？'],
  [104, '2010 年的实验：目标来回折返，'],
  [108, '折返的时间可预期，眼睛会提前减速。'],
  [112, '大脑是按前几次的节奏，在猜下一次。'],
  [116, '他按固定节奏跳，你迟早能猜中。'],
  [120, '他节奏一乱，〖你的预测就落空了〗。'],
  [124, '会横跳的人，赢的是〔节奏〕，不是速度。'],
  // 停顿
  [132, '2025 年的实验：拦截一个突然动起来的目标。'],
  [136, '每个人的平均反应，从 120 到 420 毫秒。'],
  [140, '靠预判出手的人，比靠反应的快得多。'],
  [144, '还有一点：他横着跑的时候，自己也打不准。'],
  [148, 'Riot 写明：移动速度一过门槛，枪就不准。'],
  [152, null], // 大字：他只有换向那一下，才停得下来开枪
  // 怎么办（配乐回落段）
  [160, '别跟他比手速，试试这四招：'],
  [164, '① 别跟着他左右甩。'],
  [168, '② 准星停在他换向的那一头。'],
  [172, '③ 等他减速停下，再开枪。'],
  [176, '④ 你自己横跳，节奏别固定。'],
  [180, '他停下来要开枪的那一刻，就是你的机会。'],
  [188, '他甩掉的不是你的手，是你的——'],
  [192, null], // 第二个爆点「预测」
  // 结尾
  [200, '横跳赢的是节奏，不是速度。'],
  [204, '这一次，你把准星停在他换向的那一头。'],
  [208, '他跳回来，减速，停下。'],
  [216, '这一次，〔他停在了你的准星上〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：他左右横跳，你的准星追着甩、每次换向都冲过头，开几枪都落空；他站住
  death: [DEATH, REPLAY], // 被打死：红屏裂纹
  replay: [REPLAY, SPLIT], // 回放：位置—时间两条线（他 / 你的准星），每个拐角准星都冲过头
  split: [SPLIT, fb(6)], // 慢放：他换向，准星箭头还在往老方向
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  delay: [fb(9), fb(11)], // 眼睛 → 手 约 100 ms
  smooth: [fb(11), fb(16)], // 匀速目标：准星按预测提前一点，两条线贴住
  turn: [fb(16), fb(18)], // 章节卡 + 锚词
  bend: [fb(18), fb(22)], // 2000 年：直线目标突然拐弯，手的轨迹先冲过头、再慢慢转过来
  zigzag: [fb(22), fb(24)], // 横跳：每个拐角都落后一次
  rhythm: [fb(24), fb(32)], // 章节卡 + 固定节奏 vs 乱节奏
  intercept: [fb(32), fb(36)], // 章节卡 + 120–420 ms
  dead: [fb(36), fb(38)], // 死区：他的速度只有换向那一下低于门槛
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：准星停在他换向的那一头，收暗
  hit2: [HIT2, fb(50)], // 「预测」砸出
  outro: [fb(50), fb(56)], // 暖色射击场：准星停在右端，他跳回来减速停下，爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：他来回跳，最后一段跳到右端（x = 1.0）减速停下，你的准星早就停在那里 */
export const OUT_KF: [number, number][] = [
  [200, -0.8],
  [202.4, 0.9],
  [204.8, -0.6],
  [207.2, 0.9],
  [209.6, -0.6],
  [213.4, 1.0],
];
export const OUT_STOP = fbt(213.4);
export const OUT_KILL = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Miyamoto 等 2025（iScience） */
export const MIYA_YEAR = 2025;
export const VM_DELAY = 100;
export const MIYA_LAT: [number, number] = [120, 420];
export const MIYA_QUOTE_DELAY = 'In the visuomotor process, delays of approximately 100 ms can critically impact the perception of visual motion';
export const MIYA_QUOTE_RANGE = 'This range included latencies comparable to and much shorter than typical reaction times for reaching movements';
/** Kowler 等 2019 */
export const KOWLER_YEAR = 2019;
/** Engel & Soechting 2000 / Engel, Anderson & Soechting 2000 */
export const ENGEL_YEAR = 2000;
/** de Hemptinne 等 2010 */
export const DEH_YEAR = 2010;
/** Riot 3.0：死区 27.5% */
export const DEADZONE = 0.275;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep49-ad-strafe';
export const SFX: [string, number, number][] = [
  // 开场：追着甩 → 被打死 → 回放 → 慢放
  ...OPEN_SHOTS.map((b): [string, number, number] => [`${A}/gunshot.wav`, fbt(b), 0.8]),
  [`${A}/gunshot.wav`, DEATH, 0.72],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/rewind.wav`, REPLAY - 4, 0.6],
  [`${A}/impact.wav`, REPLAY, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 追踪
  [`${A}/tick.wav`, fbt(40), 0.5],
  ['audio/sfx/whoosh.wav', fb(11), 0.35],
  ['audio/sfx/ding.wav', fbt(56), 0.4],
  // 换向
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/tick.wav`, fbt(76), 0.5],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  [`${A}/impact.wav`, fbt(88), 0.55],
  // 节奏
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(116), 0.5],
  [`${A}/impact.wav`, fbt(120), 0.6],
  ['audio/sfx/ding.wav', fbt(124), 0.35],
  // 停顿
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(136), 0.5],
  ['audio/sfx/whoosh.wav', fb(36), 0.35],
  [`${A}/tick.wav`, fbt(148), 0.5],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/tick.wav`, OUT_STOP, 0.45],
  [`${A}/gunshot.wav`, OUT_KILL, 0.8],
  ['audio/sfx/ding.wav', OUT_KILL + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
