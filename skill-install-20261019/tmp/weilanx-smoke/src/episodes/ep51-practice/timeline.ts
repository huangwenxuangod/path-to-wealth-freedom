/**
 * ep51 天天练枪，怎么还不涨？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：每天在靶场一口气练两小时、分数原地踏步，被说没天赋；其实练的时候的成绩不等于学到的，
 * 同样的总时长，拆开练、隔开练，学到的留得更久、用得出来；而人的感觉偏偏觉得一口气练更有效。
 * 招：两小时拆成几段、每天练一点、隔天再测、练完睡一觉再验收。锚词「间隔」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「间隔」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都只读到摘要；Europe PMC 全文接口当时报错，PMC 网页有人机验证，未读正文）：
 *   Soderstrom & Bjork 2015《Learning versus performance: an integrative review》Perspect Psychol Sci 10(2):176–199：
 *     练习时能测到的是表现，它常常不能可靠反映长期学习；学到了表现可以不变，表现涨了也可以没学到；人常把练习时的表现当成学到多少。
 *   Moulton, Dubrowski, MacRae, Graham, Grober & Reznick 2006《Teaching surgical skills: what kind of practice makes perfect?》
 *     Ann Surg 244(3):400–409：随机对照，38 名外科住院医生学显微血管吻合，集中（1 天）vs 分散（每周），练习总时长相同；
 *     练完两组都进步；1 个月后的保持测试分散组多数指标更好；在活体大鼠上的迁移测试分散组所有专家评分都更好。
 *   Cepeda, Pashler, Vul, Wixted & Rohrer 2006《Distributed practice in verbal recall tasks》Psychol Bull 132(3):354–380：
 *     184 篇文章、317 个实验、839 次评估的元分析（言语回忆任务）。
 *   Kornell & Bjork 2008《Learning concepts and categories: is spacing the "enemy of induction"?》Psychol Sci 19(6):585–592：
 *     学认画家画风，穿插着看比同一画家连着看效果更好，但参与者事后仍认为连着看更有效。
 *   Walker 等 2002（Neuron，ep50 用过）：睡一晚动作速度提高 20%。
 *   注意：间隔练习对复杂动作技能的效果并非每个实验都一致（如 Studer 等 2010 追踪任务里两组表现无差别），字幕不说「一定」。
 *   开场的分数和曲线是示意；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：分数和第一天一样、30 天平线、练到后面分数往下掉 */
export const SCORE = fbt(7);
export const CURVE = fbt(10);
export const FATIGUE = fbt(15);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.16';
export const TOPIC = '间隔练习';
export const TITLE = '天天练枪，怎么还不涨？';
export const HOOK_LINE = '你每天练两小时，〖枪法怎么还原地踏步〗？';
export const ANCHOR = '间隔';
export const TERM2 = '分布式练习 · Distributed Practice';
/** 示意：开场靶场分数（第 1 天 / 第 30 天） */
export const DAY1_SCORE = 8120;
export const DAY30_SCORE = 8160;
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '练了这么久，\n进步〔都去哪了〕？';
export const BIG_LINE = '练得越顺手，\n〔不代表学得越多〕';
export const FLIP_LINE = '你不是没天赋，\n是〔进步藏在间隔里〕';
export const ASK_LINE = '你每天练枪，\n一口气练多久？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '看不见'],
  [16, '间隔'],
  [24, '存进去'],
  [32, '错觉'],
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
  [0, '第 30 天，你又在靶场练了两小时。'],
  [3, '每天打几千个靶，一天都没断过。'],
  [7, '〖可分数，和第一天差不多〗。'],
  [10, '30 天的曲线，几乎是一条平线。'],
  [15, '练到后面，手越来越酸，'],
  [19, '分数反而在往下掉。'],
  [24, '朋友说你没天赋，你自己也这么想。'],
  [28, '可问题不在天赋，在你怎么练——'],
  [32, null], // 标题卡
  // 看不见
  [36, '先说一件反直觉的事。'],
  [40, '练的时候的成绩，和你学到的，是两回事。'],
  [44, '2015 年的一篇综述，把这件事讲透了：'],
  [48, '有时学到了，当场的成绩却一点没变；'],
  [52, '有时当场涨了，却没真正学进去。'],
  [56, '而人总把练的时候的成绩，当成学到了多少。'],
  [60, '你盯着的靶场分数，只是〔当场表现〕。'],
  // 间隔
  [68, '决定学到多少的，是练习之间的【间隔】。'],
  [72, '2006 年，多伦多的一个随机对照实验：'],
  [76, '38 名外科住院医生，学一项显微缝合手术。'],
  [80, '一组一天练完，一组每周练一次，总时长一样。'],
  [84, '刚练完，两组都进步了。'],
  [88, '一个月后再测：〔每周练的那组〕多数指标更好。'],
  [92, '换到真实的活体手术上，也是他们更强。'],
  // 存进去
  [100, '这不是外科医生才有的规律。'],
  [104, '2006 年的元分析，汇总了 317 个实验。'],
  [108, '同样的练习量，隔开练，记得更牢。'],
  [112, '这些实验多是背东西，但方向很一致。'],
  [116, '一口气猛练，当场熟得快，留下的却少。'],
  [120, '上一期讲过：练完睡一晚，动作快 20%。'],
  [124, '间隔里，大脑在把练的东西〔存进去〕。'],
  // 错觉
  [132, '那为什么大家都喜欢一口气练？'],
  [136, '2008 年的实验：让人看画，学认画家的画风。'],
  [140, '一组同一个画家连着看，一组穿插着看。'],
  [144, '穿插着看的，考得更好。'],
  [148, '可考完，大家还是觉得〖连着看更有效〗。'],
  [152, null], // 大字：练得越顺手，不代表学得越多
  // 怎么办（配乐回落段）
  [160, '同样的时间，换个练法：'],
  [164, '① 两小时拆成几段，中间休息。'],
  [168, '② 每天练一点，别周末一口气练完。'],
  [172, '③ 隔天再测，别看当场分数。'],
  [176, '④ 练完睡一觉，第二天再验收。'],
  [180, '让间隔，替你把进步存起来。'],
  [188, '你缺的不是天赋，是练习之间的——'],
  [192, null], // 第二个爆点「间隔」
  // 结尾
  [200, '一个月后，你没多练一分钟。'],
  [204, '只是把两小时，拆成了几段。'],
  [208, '再进排位，同一个对枪位。'],
  [216, '这一次，〔进步终于看得见了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, SCORE], // 靶场：一排靶子依次弹出被打掉，右上角「第 30 天 · 已练 2 小时」
  score: [SCORE, CURVE], // 分数卡：和第一天差不多
  curve: [CURVE, FATIGUE], // 30 天的分数：一条平线
  fatigue: [FATIGUE, fb(6)], // 两小时里的分数：练到后面往下掉（示意）
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  gap: [fb(9), fb(16)], // 两条线：当场表现 vs 真正学到（示意），两种错位
  spacing: [fb(16), fb(18)], // 章节卡 + 锚词：同样的时间，一块 vs 拆开
  rct: [fb(18), fb(24)], // 随机对照：一天练完 vs 每周一次；练完 / 一个月后 / 活体
  meta: [fb(24), fb(29)], // 章节卡 + 317 个实验
  store: [fb(29), fb(32)], // 间隔里的「存进去」：睡一晚 +20%
  illusion: [fb(32), fb(38)], // 章节卡 + 画风实验：连着看 / 穿插看，考试 vs 自己的感觉
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：两小时的时间条被切成几段，收暗
  hit2: [HIT2, fb(50)], // 「间隔」砸出
  outro: [fb(50), fb(56)], // 暖色：分数曲线一周周往上 → 射击场爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：曲线 → 射击场，爆头 */
export const OUT_RANGE = fbt(208);
export const OUT_KILL = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Soderstrom & Bjork 2015 */
export const SB_YEAR = 2015;
export const SB_QUOTE = 'people often mistakenly interpret their performance during acquisition as a reliable guide to long-term learning';
/** Moulton 等 2006 */
export const MOULTON_YEAR = 2006;
export const MOULTON_N = 38;
export const MOULTON_RETENTION_MONTHS = 1;
/** Cepeda 等 2006 */
export const CEPEDA_YEAR = 2006;
export const CEPEDA_ARTICLES = 184;
export const CEPEDA_EXPERIMENTS = 317;
export const CEPEDA_ASSESSMENTS = 839;
/** Kornell & Bjork 2008 */
export const KB_YEAR = 2008;
/** Walker 等 2002 */
export const WALKER_GAIN = 20;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep51-practice';
export const SFX: [string, number, number][] = [
  // 开场：靶场点射 → 分数卡 → 平线 → 往下掉
  ...[2, 3, 4, 5, 6].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  [`${A}/impact.wav`, SCORE, 0.65],
  [`${A}/tick.wav`, CURVE, 0.55],
  ['audio/sfx/whoosh.wav', FATIGUE, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 看不见
  [`${A}/tick.wav`, fbt(48), 0.5],
  [`${A}/tick.wav`, fbt(52), 0.5],
  [`${A}/impact.wav`, fbt(60), 0.55],
  // 间隔
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/tick.wav`, fbt(84), 0.5],
  [`${A}/impact.wav`, fbt(88), 0.6],
  ['audio/sfx/ding.wav', fbt(92), 0.4],
  // 存进去
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(104), 0.5],
  ['audio/sfx/whoosh.wav', fb(29), 0.35],
  ['audio/sfx/ding.wav', fbt(120), 0.4],
  // 错觉
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(144), 0.5],
  [`${A}/impact.wav`, fbt(148), 0.6],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  ['audio/sfx/whoosh.wav', OUT_RANGE, 0.35],
  [`${A}/gunshot.wav`, OUT_KILL, 0.8],
  ['audio/sfx/ding.wav', OUT_KILL + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
