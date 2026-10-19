/**
 * ep38 蝴蝶效应：一只蝴蝶，真能掀起龙卷风吗（黑金光影风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「差一点」：开头「起因差一点，结局天差地别」；102.52 秒砸出「差一点」（初值敏感性）；
 * 结尾重新定义：差一点，不是说小事决定命运，是说未来本来就算不准。
 * 回落段 11 下硬拍 = 天气预报一天天往后亮，第 10 天之后起雾（Zhang 等 2019）。
 * 出处：Lorenz 1963（J. Atmos. Sci. 20:130–141）、Lorenz 1963b（Trans. N.Y. Acad. Sci. 25:409–432，海鸥）、
 * Lorenz 1972 AAAS 演讲、Hilborn 2004（Am. J. Phys. 72:425）、APS News 2003、Zhang 等 2019（J. Atmos. Sci. 76:1077）。
 * 片中两条轨迹是用 1963 年的三个方程自己算的（示意），不是 1961 年那次的 12 变量模型。
 * 文案与核对见 materials/09-黑金光影风/01-蝴蝶效应/文案与卡点.md。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** we-never 网格：两个重拍 17.45 秒和 102.52 秒相隔正好 40 小节 */
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

/** 开场两组四连重音（实测）：第一组蝴蝶扇四下翅膀；第二组气流一圈圈传到远处、龙卷风一层层长出来 */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍：天气预报的第 1～11 天依次亮起，前 10 天清楚，第 11 天起雾 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];
export const RELAY_AT = RELAY_HITS.map(fbt);

export const ANCHOR = '差一点';
export const TERM = '初值敏感性 · Sensitive Dependence on Initial Conditions';
export const TITLE = '蝴蝶效应';
export const TITLE_EN = 'The Butterfly Effect';
export const TITLE_SUB = '一只蝴蝶，真能掀起龙卷风吗';

/**
 * 字幕：[拍号, 中文, 英文]。【】青 = 术语，〖〗红 = 失控 / 误差，〔〕金 = 数字 / 锚词；
 * 中文不超过 18 字（不算标点、空格和标记）；null 表示这段是大字（标题 / 锚词砸出），不放字幕。
 */
export const CUES: [number, string | null, string][] = [
  // 钩子
  [0, '一只蝴蝶，在巴西扇了一下翅膀。', 'A butterfly flaps its wings in Brazil.'],
  [8, '会不会，在德州掀起一场龙卷风？', 'Could it set off a tornado in Texas?'],
  [16, '起因只〔差一点〕，结局天差地别。', 'A tiny difference at the start, a different world at the end.'],
  [24, '可这件事，到底是不是真的——', 'But is it actually true —'],
  [32, null, ''], // 标题卡「蝴蝶效应」
  // 1961：一次抄写
  [36, '1961 年，气象学家洛伦兹用电脑算天气。', 'In 1961, meteorologist Edward Lorenz ran a weather model on a computer.'],
  [44, '想重看一段，他把打印纸上的数抄回去。', 'To rerun a stretch, he typed numbers back in from a printout.'],
  [52, '电脑里存的是〔0.506127〕，', 'The computer had stored 0.506127,'],
  [56, '打印纸上，只印了〔0.506〕。', 'but the printout showed only 0.506.'],
  [60, '他去倒了杯咖啡。', 'Then he went for a cup of coffee.'],
  // 两种天气
  [64, '一小时后，电脑算出了两个月的天气。', 'An hour later, the computer had produced two months of weather.'],
  [72, '和上一次比：开头几乎重合，', 'Compared with the first run: almost identical at first,'],
  [80, '后来越走越远，成了两种天气。', 'then further and further apart — two different weathers.'],
  [88, '罪魁祸首，就是那〖0.000127〗。', 'The culprit: that missing 0.000127.'],
  // 1963：三个方程
  [96, '1963 年，他把空气对流简化成三个方程。', 'In 1963, he boiled convection down to three equations.'],
  [104, '两个起点，只差〔0.000127〕。', 'Two starting points, 0.000127 apart.'],
  [112, '一开始，两条线叠在一起。', 'At first, the two paths overlap.'],
  [120, '差距越滚越大，像滚雪球。', 'Then the gap snowballs.'],
  [128, '然后，突然分道扬镳。', 'And suddenly, they part ways.'],
  [136, '方程里没有一点随机，', 'There is no randomness in the equations,'],
  [144, '照样算不准未来。这叫【混沌】。', 'yet the future can’t be predicted. This is chaos.'],
  [152, '巧的是，这条轨迹画出来，像一只蝴蝶。', 'By coincidence, the path looks like a butterfly.'],
  // 回落段：天气预报能看多远
  [160, '那今天的天气预报，能看多远？', 'So how far ahead can forecasts see today?'],
  [171, '一天、两天……大约〔10 天〕。', 'One day, two… about ten days.'],
  [181, '数据再精确 10 倍，也只多〔5 天〕。', 'Ten times better data buys only five more days.'],
  [188, '因为一切都取决于，起点那——', 'Because everything hinges on the start, that —'],
  [192, null, ''], // 第二个爆点「差一点」
  // 结尾：蝴蝶的真相
  [200, '可蝴蝶，真能掀起龙卷风吗？', 'But can a butterfly really set off a tornado?'],
  [204, '洛伦兹说：它也能〔阻止〕一场。', 'Lorenz said: it could just as well prevent one.'],
  [212, '而且他最早说的，是一只〔海鸥〕。', 'And originally, he talked about a seagull.'],
  [216, '蝴蝶，是同事为了标题好听换的。', 'A colleague swapped in the butterfly for a catchier title.'],
  [224, '〔差一点〕，不是说小事决定命运，', 'A tiny difference doesn’t mean small things decide fate —'],
  [232, '是说未来，本来就算不准。', 'it means the future was never calculable.'],
  [240, '你有没有一个「差一点」，就全变了的瞬间？', 'Was there a moment when, by a hair, everything changed?'],
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句：随收暗退场 */
export const HALF_BEATS = [24, 188];

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, HIT], // 巴西的蝴蝶扇翅膀，气流一圈圈传到德州，龙卷风长出来；第 24 拍推近蝴蝶、收暗
  title: [HIT, fb(9)], // 金粒子聚成「蝴蝶效应」
  tape: [fb(9), fb(16)], // 1961：打印纸带，0.506127 → 0.506，「127」掉下去；一杯咖啡
  runs: [fb(16), fb(24)], // 两次算出来的「天气」：开头重合，后来分开
  attractor: [fb(24), fb(40)], // 1963：三个方程 → 两条轨迹在洛伦兹吸引子上分道扬镳，右上差距表
  forecast: [fb(40), fbt(188)], // 回落段 11 下硬拍：预报第 1～11 天亮起，第 10 天后起雾
  build: [fbt(188), HIT2], // 话说一半，收暗
  hit2: [HIT2, fb(50)], // 「差一点」砸出，背后一根线从一点分成两股
  twist: [fb(50), fb(54)], // 蝴蝶：掀起 / 阻止龙卷风；变回一只海鸥
  title1972: [fb(54), fb(56)], // 1972 年演讲题目原文，标题是会议召集人拟的
  end: [fb(56), DURATION], // 蝴蝶沿着吸引子飞；差一点 = 未来算不准；评论区问题
} as const;

/* ---------------- 片中的事实（出处见文件头，测试核对） ---------------- */

/** APS News 2003（据 Gleick《混沌》）：电脑存六位小数 .506127，打印纸只印三位 .506 */
export const STORED = 0.506127;
export const PRINTED = 0.506;
export const ROUND_OFF = Math.round((STORED - PRINTED) * 1e6) / 1e6; // 0.000127
/** Lorenz 1991 京都奖演讲（Ghys 2012 转引）：出去喝咖啡，约一小时后回来，电脑已算出约两个月的数据 */
export const COFFEE_HOURS = 1;
export const SIM_MONTHS = 2;
/** 1961 年那次用的是 12 个变量的模型（APS News 2003） */
export const MODEL_VARS_1961 = 12;
/** Lorenz 1963：σ = 10、r = 28、b = 8/3 */
export const SIGMA = 10;
export const RHO = 28;
export const BETA = 8 / 3;
export const PAPER_1963 = {title: 'Deterministic Nonperiodic Flow', journal: 'J. Atmos. Sci.', vol: 20, pages: '130–141'};
/** Lorenz 1972 年 12 月，AAAS 第 139 届年会，华盛顿；题目由会议召集人 Philip Merilees 拟定（Hilborn 2004） */
export const TALK_1972 = {title: 'Predictability: Does the Flap of a Butterfly’s Wings in Brazil Set Off a Tornado in Texas?', meeting: 139, year: 1972};
/** Zhang 等 2019 摘要：中纬度天气目前约 10 天有预报能力；初始误差缩小一个数量级，最多再延长 5 天 */
export const FORECAST_DAYS = 10;
export const FORECAST_GAIN = 5;
export const DATA_GAIN = 10;

/* ---------------- 洛伦兹方程（RK4，自己算的示意） ---------------- */

export type V3 = [number, number, number];
const deriv = ([x, y, z]: V3): V3 => [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z];
const add = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
export const rk4 = (p: V3, dt: number): V3 => {
  const k1 = deriv(p);
  const k2 = deriv(add(p, k1, dt / 2));
  const k3 = deriv(add(p, k2, dt / 2));
  const k4 = deriv(add(p, k3, dt));
  return [p[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), p[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]), p[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2])];
};
export const DT = 0.01;
export const STEPS = 1800;
export const integrate = (p0: V3, n: number, dt = DT): V3[] => {
  const out: V3[] = [p0];
  let p = p0;
  for (let i = 0; i < n; i++) out.push((p = rk4(p, dt)));
  return out;
};
/** 先从 (1, 1, 1) 跑 2000 步落到吸引子上，再取那一点当起点 A；B 只在 x 上少 0.000127 */
const WARM = integrate([1, 1, 1], 2000);
export const START_A: V3 = WARM[WARM.length - 1];
export const START_B: V3 = [START_A[0] - ROUND_OFF, START_A[1], START_A[2]];
export const PATH_A = integrate(START_A, STEPS);
export const PATH_B = integrate(START_B, STEPS);
export const gapAt = (i: number) => {
  const a = PATH_A[Math.min(i, STEPS)];
  const b = PATH_B[Math.min(i, STEPS)];
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
};
/** 两条轨迹第一次相差超过 1 的步数（「分道扬镳」） */
export const SPLIT_STEP = (() => {
  for (let i = 0; i <= STEPS; i++) if (gapAt(i) > 1) return i;
  return STEPS;
})();

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep38-butterfly';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  [`${A}/room.wav`, 0, 0.5],
  // 开场：四下扇翅；四下气流传过去、龙卷风长出来
  ...OPEN_HITS_1.map((b) => s('flap', b, b === 8 ? 0.8 : 0.65)),
  ...OPEN_HITS_2.map((b) => s('chime', b, 0.4)),
  s('wind', 13, 0.55),
  shared('whoosh', 24, 0.25),
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.55],
  s('impact', 32, 0.7),
  // 1961
  shared('paper', 36, 0.3),
  ...[44, 45, 46, 47].map((b) => shared('type', b, 0.4)),
  s('chime', 52, 0.4),
  s('drop', 56, 0.55),
  s('chime', 60, 0.45),
  // 两种天气
  shared('whoosh', 64, 0.25),
  s('chime', 72, 0.35),
  s('impact', 80, 0.4),
  s('chime', 88, 0.45),
  // 1963
  shared('paper', 96, 0.3),
  s('chime', 104, 0.4),
  s('chime', 120, 0.35),
  s('impact', 128, 0.45),
  s('chime', 144, 0.4),
  s('flap', 152, 0.6),
  // 回落段：11 下硬拍，每亮一天一声嘀 + 轻铃；第 11 天起雾换成风声
  ...RELAY_HITS.slice(0, 10).map((b) => s('tick', b, 0.6)),
  ...RELAY_HITS.slice(0, 10).map((b) => s('chime', b, 0.3)),
  s('wind', 187, 0.5),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.6],
  s('impact', 192, 0.66),
  // 结尾
  s('flap', 200, 0.6),
  s('wind', 202, 0.45),
  s('chime', 204, 0.45),
  s('flap', 212, 0.55),
  shared('paper', 216, 0.3),
  s('impact', 224, 0.4),
  s('chime', 232, 0.45),
  ...[236, 237, 238, 239].map((b) => s('flap', b, 0.6)),
  shared('whoosh', 240, 0.22),
];
