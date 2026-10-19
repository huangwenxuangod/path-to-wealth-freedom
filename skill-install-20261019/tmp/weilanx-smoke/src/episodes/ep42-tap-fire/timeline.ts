/**
 * ep42 扫射压不住，点射更准？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 技巧：按距离换打法，远处点射、点完停一下。锚词「停顿」：连着开枪散布圈一发比一发大，停一下圈才缩回来；准度藏在两枪之间的停顿里。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「停顿」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都读过原文）：
 *   Riot《VALORANT Patch Notes 0.50》（2020-05-12）：Gun Recovery Time、误差累积的原话、Vandal 0.375 秒 / Phantom 0.35 秒、
 *     "support the viability of all rifle shooting styles (tap, burst, spray) when used in optimal situations"；
 *   Valve《Recovery Time》（CS:GO 官方博客，2015-12-15）："players in all skill groups are still spraying more than tapping or bursting"；
 *   Valve《Second Shot》（CS:GO 官方博客，2016）："Spraying is still advantageous in many engagements ... slightly worse accuracy towards the end of the spray"。
 *   命中率 =（头的角半径 ÷ 散布圈半径）²、距离翻倍 → 四分之一：自己算的几何（子弹在圈里均匀分布、准星对准头中心），头半径和散布角度是示意值，测试里复算。
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

/** 开场三次重音（第 7、10、15 拍）：一梭子扫完 MISS、墙上弹孔回放、分屏（对面点两下爆头） */
export const SHOT = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);
/** 开场扫射：第 5 拍起每 3 帧一发，12 发，最后一发落在第 7 拍附近 */
export const SPRAY_EVERY = 3;
export const SPRAY_N = 12;
export const SPRAY_AT = SHOT - SPRAY_EVERY * (SPRAY_N - 1);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.09';
export const TOPIC = '点射';
export const TITLE = '扫射压不住，点射更准？';
export const ANCHOR = '停顿';
export const TERM2 = '恢复时间 · Recovery Time';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '子弹更多，\n为什么〔反而打不中〕？';
export const BIG_LINE = '近处扫，\n远处〔点〕';
export const FLIP_LINE = '你不是压不住枪，\n只是不肯〔停顿〕';
export const ASK_LINE = '你平时是点射派，\n还是扫射派？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '散布'],
  [16, '面积'],
  [24, '距离'],
  [32, '场合'],
  [40, '练法'],
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
  [0, '远处露出一个头，你按住左键扫了过去。'],
  [7, '子弹却〖越飞越散〗，一发没中头。'],
  [10, '墙上的弹孔，散成了一大片。'],
  [15, '对面只点了两下，一枪爆头。'],
  [24, '明明子弹更多，为什么反而打不中？'],
  [28, '答案藏在两枪之间的那一小段——'],
  [32, null], // 标题卡
  // 散布
  [36, '每一把枪开火，都有一个「散布圈」。'],
  [40, '子弹落在圈里哪儿，是随机的。'],
  [44, '连着开，圈就一发比一发大。'],
  [48, 'Riot 原话：还没恢复就再开枪，误差会累积。'],
  [52, 'Vandal 的「恢复时间」：0.375 秒。'],
  [56, '停够这段时间，圈就缩回最小。'],
  [60, '准不准，藏在两枪之间的【停顿】里。'],
  // 面积
  [68, '打不打得中，其实是一道面积题。'],
  [72, '头在散布圈里占多大，命中率就有多大。'],
  [76, '圈的半径大 3 倍，面积就大 9 倍。'],
  [80, '命中率掉到原来的九分之一。'],
  [84, '扫射越往后，圈越大，命中率越低。'],
  [88, 'Valve 也说：扫到后段，准度会变差。'],
  [92, '子弹多，〖不等于打中多〗。'],
  // 距离
  [100, '再加上距离：人站远一倍，'],
  [104, '在你屏幕上，头就只剩一半宽。'],
  [108, '一半宽，面积只剩四分之一。'],
  [112, '同一个散布圈，命中率也掉到四分之一。'],
  [116, '近处头比圈大，怎么打都中。'],
  [120, '远处圈比头大，只能〔靠圈小取胜〕。'],
  [124, '所以越远，越要让每一发都从小圈里出。'],
  // 场合
  [132, '那扫射是不是就没用了？'],
  [136, 'Riot 说：点射、短连、扫射，各有各的场合。'],
  [140, 'Valve 也说：扫射在很多对枪里仍然占优。'],
  [144, '近处头够大，多一发就多一次机会。'],
  [148, '远处头太小，只有圈最小的那一发能中。'],
  [152, null], // 大字：近处扫，远处点
  // 练法（配乐回落段）
  [160, '按距离换打法，练四步：'],
  [164, '① 贴脸近处：放心扫射。'],
  [168, '② 中距离：三五发一停。'],
  [172, '③ 远距离：点一下，停一下。'],
  [176, '④ 停顿的节奏，去训练场打靶练熟。'],
  [180, '每一次停顿，都是在把圈缩回去。'],
  [188, '压不住的时候，你缺的不是手速，是——'],
  [192, null], // 第二个爆点「停顿」
  // 结尾
  [200, 'Valve 发现：所有段位的玩家，都更爱扫射。'],
  [204, '按住左键，好像更有安全感。'],
  [208, '可远处那颗头，要的是第一发。'],
  [216, '松开左键的那一下，〔准度就回来了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, SHOT], // 3D：远处露头，你一梭子扫过去，弹孔越来越散
  shot: [SHOT, REPLAY], // 扫完：MISS
  replay: [REPLAY, SPLIT], // 墙上的弹孔：散成一大片
  split: [SPLIT, fb(6)], // 分屏：你 12 发 vs 对面点两下爆头
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  bloom: [fb(9), fb(12)], // 散布圈 + 误差曲线：连着开一发比一发大
  quote: [fb(12), fb(13)], // Riot 原话：误差会累积
  recover: [fb(13), fb(16)], // 点一下、停 0.375 秒，圈缩回最小 →「停顿」
  area: [fb(16), fb(21)], // 章节卡 + 面积题：头 / 圈，半径 ×3 → 1/9
  spraytail: [fb(21), fb(22)], // 扫射越往后命中率越低（每发命中率条）
  valve: [fb(22), fb(24)], // Valve《Second Shot》原话
  distance: [fb(24), fb(28)], // 章节卡 + 近处 vs 远一倍：头剩一半宽、面积 1/4
  bars: [fb(28), fb(32)], // 各距离命中率：第一发 vs 扫射后段（示意）
  arms: [fb(32), fb(36)], // 章节卡 + Riot / Valve：各有场合
  cross: [fb(36), fb(38)], // 命中率—距离两条线：近处都中，远处只有第一发
  bigline: [fb(38), fb(40)], // 大字：近处扫，远处点
  steps: [fb(40), fb(45)], // 章节卡 + 练法四步
  build: [fb(45), HIT2], // 回落段：3D 远处架枪、收暗
  hit2: [HIT2, fb(50)], // 「停顿」砸出
  habit: [fb(50), fb(52)], // 暖色：Valve 数据——所有段位都更爱扫射
  tapview: [fb(52), fb(56)], // 暖色 3D：远处露头，点一下爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Riot《VALORANT Patch Notes 0.50》（2020-05-12） */
export const RIOT_YEAR = 2020;
export const RIOT_ACCRUE = 'Inaccuracy is accrued any time the weapon is re-fired prior to a complete duration of a weapon’s respective Gun Recovery Time.';
export const RIOT_STYLES = 'support the viability of all rifle shooting styles (tap, burst, spray) when used in optimal situations';
export const VANDAL_RECOVERY = 0.375; // "Gun Recovery Time: .4s >> .375s"
export const PHANTOM_RECOVERY = 0.35; // "Gun Recovery Time: .55s >> .35s"
/** Valve CS:GO 官方博客 */
export const VALVE_RT_YEAR = 2015;
export const VALVE_RT_QUOTE = 'players in all skill groups are still spraying more than tapping or bursting';
export const VALVE_SS_YEAR = 2016;
export const VALVE_SS_QUOTE = 'Spraying is still advantageous in many engagements, but has the trade-offs of slightly worse accuracy towards the end of the spray';

/* ---------------- 自己算：面积题（示意值） ---------------- */

/** 命中率 =（头的角半径 ÷ 散布圈半径）²，头比圈大时 = 1（子弹在圈里均匀分布、准星对准头中心） */
export const hitChance = (head: number, spread: number) => Math.min(1, (head / spread) ** 2);
export const HEAD_R = 0.15; // 头的半径（米，示意）
/** 头在屏幕上的角半径（度） */
export const headDeg = (d: number) => (Math.atan(HEAD_R / d) * 180) / Math.PI;
export const SPREAD_FIRST = 0.3; // 第一发的散布半径（度，示意）
export const SPREAD_LATE = 1.5; // 扫射后段的散布半径（度，示意）
export const DISTANCES = [5, 10, 20, 40];
export const pct = (x: number) => Math.round(x * 100);
export const BARS = DISTANCES.map((d) => [d, pct(hitChance(headDeg(d), SPREAD_FIRST)), pct(hitChance(headDeg(d), SPREAD_LATE))] as const);
/** 例子：半径 ×3 → 面积 ×9 → 命中率 1/9；距离 ×2 → 头宽 1/2 → 面积 1/4 */
export const RADIUS_X = 3;

/**
 * 散布「热度」（示意）：每开一枪热度 +1；停下来后，热度在恢复时间内线性降回 0（再开枪时从剩下的热度继续往上加）
 * shots：开枪的时刻（秒）；返回 t 时刻的热度
 */
export const heatAt = (shots: number[], t: number, recover: number) => {
  let h = 0;
  let last = -Infinity;
  for (const s of shots) {
    if (s > t) break;
    h = h * Math.max(0, 1 - (s - last) / recover) + 1;
    last = s;
  }
  return last === -Infinity ? 0 : h * Math.max(0, 1 - (t - last) / recover);
};

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep42-tap-fire';
export const SFX: [string, number, number][] = [
  // 开场：一梭子扫射 → MISS → 回放 → 分屏点两下
  ...Array.from({length: SPRAY_N}, (_, i): [string, number, number] => [`${A}/gunshot.wav`, SPRAY_AT + i * SPRAY_EVERY, i === 0 ? 0.7 : 0.38]),
  [`${A}/crack.wav`, SHOT + 3, 0.6],
  [`${A}/rewind.wav`, REPLAY - 4, 0.5],
  [`${A}/tick.wav`, REPLAY + 2, 0.5],
  [`${A}/gunshot.wav`, SPLIT + 10, 0.7],
  [`${A}/gunshot.wav`, SPLIT + 22, 0.7],
  ['audio/sfx/ding.wav', SPLIT + 25, 0.4],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 散布
  [`${A}/gunshot.wav`, fbt(40), 0.45],
  ...Array.from({length: 6}, (_, i): [string, number, number] => [`${A}/gunshot.wav`, fbt(44) + i * 4, 0.3]),
  ['audio/sfx/whoosh.wav', fb(12), 0.35],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  [`${A}/gunshot.wav`, fbt(53), 0.7],
  ['audio/sfx/ding.wav', fbt(56) + 8, 0.4],
  [`${A}/impact.wav`, fbt(60), 0.6],
  // 面积
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/tick.wav`, fbt(76), 0.5],
  [`${A}/tick.wav`, fbt(80), 0.5],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  [`${A}/impact.wav`, fbt(92), 0.55],
  // 距离
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/tick.wav`, fbt(112), 0.5],
  [`${A}/impact.wav`, fbt(120), 0.55],
  // 场合
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fb(36), 0.35],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 练法
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/tick.wav`, fbt(200) + 4, 0.45],
  [`${A}/gunshot.wav`, fbt(217), 0.9],
  ['audio/sfx/ding.wav', fbt(217) + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
