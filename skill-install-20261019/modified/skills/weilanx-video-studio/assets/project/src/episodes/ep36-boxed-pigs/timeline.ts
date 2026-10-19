/**
 * ep36 智猪博弈：躺平的小猪吃得更多（黑金光影风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「等」：开头小猪守在食槽边等；17.45 秒标题「智猪博弈」由金粒子聚成；
 * 配乐回落段 11 下硬拍 = 大猪在拉杆和食槽之间来回跑（双数下按拉杆、单数下到食槽），102.52 秒砸出「等」（小猪的占优策略）；
 * 结尾重新定义锚词：等不是懒，是算出来的。
 * 出处：Baldwin & Meese 1979（Animal Behaviour 27:947–957）；收益数字取 Rasmusen《Games and Information》表 1.6「Boxed Pigs」。
 * 文案与核对见 materials/09-黑金光影风/00-智猪博弈/文案与卡点.md。
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

/** 开场两组四连重音（实测）：第一组 按拉杆 → 食落槽 → 小猪亮起 → 小猪开吃；第二组 大猪冲回拉杆 → 按 → 食落槽 → 小猪又吃上 */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍：双数下（第 0、2…10 下）大猪在拉杆按一下，单数下冲到食槽 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];
export const RELAY_AT = RELAY_HITS.map(fbt);

export const ANCHOR = '等';
export const TERM = '占优策略 · Dominant Strategy';
export const TITLE = '智猪博弈';
export const TITLE_EN = 'Boxed Pigs';
export const TITLE_SUB = '躺平的小猪吃得更多';

/**
 * 字幕：[拍号, 中文, 英文]。【】青 = 术语，〖〗红 = 亏 / 零，〔〕金 = 数字 / 锚词；
 * 中文不超过 18 字（不算标点、空格和标记）；null 表示这段是大字（标题 / 锚词砸出），不放字幕。
 */
export const CUES: [number, string | null, string][] = [
  // 钩子
  [0, '一个猪圈：一头拉杆，一头食槽。', 'A pen: a lever at one end, a trough at the other.'],
  [8, '大猪跑去按一下，食槽才掉下吃的。', 'The big pig runs to press it. Food drops at the far end.'],
  [16, '小猪呢？守在槽边，一动不动地〔等〕。', 'And the small pig? It just waits by the trough.'],
  [24, '你猜，最后是谁吃亏了——', 'Guess who loses out —'],
  [32, null, ''], // 标题卡「智猪博弈」
  // 1979：真的猪
  [36, '1979 年，有人真把两只猪关进了箱子。', 'In 1979, researchers really put two pigs in a box.'],
  [44, '一头拱面板，另一头才出食。', 'Push a panel at one end; food comes out at the other.'],
  [52, '两只猪关在一起，一强一弱。', 'Two pigs together: one dominant, one not.'],
  [60, '几乎每一次，按的都是【强的那只】。', 'Almost all the pressing was done by the dominant pig.'],
  // 课本里的数字
  [64, '后来，经济学课本把它算成了数字：', 'Game theory textbooks later put numbers on it.'],
  [72, '按一次掉〔10〕份食，按的那只耗〔2〕份。', 'Each press drops 10 units of food and costs the presser 2.'],
  [80, '小猪去按？大猪先到，只给它剩〔1〕份。', 'If the small pig presses, the big one eats first and leaves it 1.'],
  [88, '大猪去按？小猪先到，抢先吃到〔4〕份。', 'If the big pig presses, the small one gets there first and eats 4.'],
  // 收益矩阵
  [96, '把四种结局，填进一张表。', 'Put all four outcomes in one table.'],
  [104, '先看小猪：大猪去按的时候，', 'Start with the small pig. If the big pig presses,'],
  [108, '它跟着按，净得 1；等着，净得〔4〕。', 'pressing nets it 1; waiting nets it 4.'],
  [112, '大猪不按的时候，', 'If the big pig waits,'],
  [116, '它去按，净得〖−1〗；等着，净得 0。', 'pressing nets it −1; waiting nets it 0.'],
  [120, '不管大猪怎么选，〔等〕都更划算。', 'Whatever the big pig does, waiting pays more.'],
  [128, '再看大猪：它算准了小猪不会动。', 'Now the big pig. It knows the small one won’t move.'],
  [136, '自己也等，净得〖0〗；去按，还有〔4〕。', 'Wait too, and it gets 0. Press, and it still gets 4.'],
  [144, '所以，只能是大猪去跑。', 'So the big pig is the one who runs.'],
  [152, '谁单独改，都更亏：这叫【纳什均衡】。', 'Neither gains by changing alone: a Nash equilibrium.'],
  // 回落段：大猪来回跑
  [160, '于是，大猪一趟一趟地跑。', 'So the big pig runs, again and again.'],
  [171, '按一下，跑回来，小猪已经在吃了。', 'Press, run back — the small pig is already eating.'],
  [181, '小猪呢，一步都没动。', 'The small pig never takes a step.'],
  [188, '它的全部本事，只有一个字——', 'Its whole strategy is one word —'],
  [192, null, ''], // 第二个爆点「等」
  // 结尾
  [200, '大猪跑断腿，净得〔4〕；小猪躺着，也是〔4〕。', 'The big pig runs itself ragged for 4. The small one lies there for 4.'],
  [208, '躺着拿 4，自己去按只拿 1。', 'Lying down gets it 4. Pressing would get it 1.'],
  [216, '可要是两只都躺平，谁都吃不到。', 'But if both lie down, nobody eats.'],
  [224, '小猪敢躺，是因为有大猪在跑。', 'The small pig can wait because the big one runs.'],
  [232, '〔等〕不是懒，是算出来的。', 'Waiting isn’t lazy. It’s calculated.'],
  [240, '你身边，谁是大猪，谁是小猪？', 'Around you — who’s the big pig, and who’s the small one?'],
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句：随收暗退场 */
export const HALF_BEATS = [24, 188];

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, HIT], // 猪圈：大猪按拉杆、小猪在槽边吃；第 24 拍起推近小猪、收暗
  title: [HIT, fb(9)], // 金粒子聚成「智猪博弈」
  box: [fb(9), fb(16)], // 1979：斯金纳箱，面板和食槽，一强一弱，强的那只一直按
  numbers: [fb(16), fb(24)], // 规则卡 + 两种结局卡
  matrix: [fb(24), fb(40)], // 收益矩阵：小猪两行都往「等」走，大猪往「按」走，纳什均衡
  relay: [fb(40), fbt(188)], // 回落段 11 下硬拍：大猪来回跑，小猪趴在槽边
  build: [fbt(188), HIT2], // 话说一半，收暗
  hit2: [HIT2, fb(50)], // 「等」砸出
  payoff: [fb(50), fb(54)], // 4 : 4；躺着拿 4、去按拿 1
  empty: [fb(54), fb(56)], // 两只都躺平：食槽空了，0 : 0
  end: [fb(56), DURATION], // 猪圈回来；等不是懒；评论区问题
} as const;

/* ---------------- 片中的事实（出处见文件头，测试核对） ---------------- */

/** Baldwin & Meese 1979：Animal Behaviour 第 27 卷 947–957 页；摘要：成对测试时「dominant animals … usually did almost all the panel pressing」 */
export const STUDY = {year: 1979, journal: 'Animal Behaviour', vol: 27, pages: '947–957'};
/** Rasmusen 表 1.6 的规则：按一次面板花 2 单位，掉 10 单位食；大猪先到小猪只剩 1；小猪先到吃 4；同时到小猪吃 3 */
export const FOOD = 10;
export const PRESS_COST = 2;
export const SMALL_FIRST = 4;
export const BIG_FIRST_LEFT = 1;
export const BOTH_SMALL = 3;
export type Move = 'press' | 'wait';
/** 由规则算出的净收益 [大猪, 小猪] */
export const payoff = (big: Move, small: Move): [number, number] => {
  if (big === 'wait' && small === 'wait') return [0, 0];
  let b: number;
  let s: number;
  if (big === 'press' && small === 'press') [b, s] = [FOOD - BOTH_SMALL, BOTH_SMALL];
  else if (big === 'press') [b, s] = [FOOD - SMALL_FIRST, SMALL_FIRST];
  else [b, s] = [FOOD - BIG_FIRST_LEFT, BIG_FIRST_LEFT];
  return [b - (big === 'press' ? PRESS_COST : 0), s - (small === 'press' ? PRESS_COST : 0)];
};
const sign = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
/** 矩阵格子文字：行 = 大猪 按 / 等，列 = 小猪 按 / 等 */
export const cellText = (big: Move, small: Move) => payoff(big, small).map(sign).join(' , ');

/* ---------------- 猪圈布局 ---------------- */
export const LEVER_X = 330;
export const TROUGH_X = 1590;
export const FLOOR_Y = 800;
/** 大猪在食槽边站的位置、小猪在食槽边的位置 */
export const BIG_AT_TROUGH = 1140;
export const SMALL_AT_TROUGH = 1470;
export const BIG_AT_LEVER = 470;

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep36-boxed-pigs';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  [`${A}/room.wav`, 0, 0.5],
  // 开场第一组：按 → 食落槽 → 小猪亮起 → 开吃
  s('press', 0, 0.7),
  s('drop', 5, 0.6),
  s('chime', 7, 0.45),
  s('impact', 8, 0.45),
  // 第二组：冲回去 → 按 → 落槽 → 又吃上
  s('run', 11, 0.6),
  s('press', 13, 0.7),
  s('drop', 15, 0.6),
  s('chime', 16, 0.5),
  shared('whoosh', 24, 0.25),
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.55],
  s('impact', 32, 0.7),
  // 1979
  shared('paper', 36, 0.3),
  s('press', 44, 0.5),
  s('drop', 46, 0.45),
  ...[56, 58, 60, 62].map((b) => s('press', b, 0.45)),
  s('chime', 60, 0.4),
  // 数字
  shared('whoosh', 64, 0.25),
  s('chime', 72, 0.4),
  s('chime', 80, 0.4),
  s('chime', 88, 0.45),
  // 矩阵
  shared('whoosh', 96, 0.25),
  s('chime', 108, 0.4),
  s('chime', 116, 0.4),
  s('impact', 120, 0.4),
  s('chime', 136, 0.4),
  s('impact', 152, 0.45),
  // 回落段：双数下按拉杆，单数下到食槽；最后一下压低
  ...RELAY_HITS.map((b, i) => (i % 2 === 0 ? s('press', b, b === 187 ? 0.5 : 0.65) : s('drop', b, 0.55))),
  ...RELAY_HITS.filter((_, i) => i % 2 === 1).map((b) => s('chime', b, 0.35)),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.6],
  s('impact', 192, 0.66),
  // 结尾
  s('chime', 200, 0.4),
  s('chime', 208, 0.35),
  s('impact', 216, 0.4),
  shared('whoosh', 224, 0.25),
  s('chime', 232, 0.45),
  shared('whoosh', 240, 0.22),
];
