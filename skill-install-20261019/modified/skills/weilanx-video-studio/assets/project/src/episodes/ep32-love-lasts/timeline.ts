/**
 * ep32 热恋会过期，但爱不会（暗金文献风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「过期」：开头是「爱情只有 18 个月」，17.45 秒随第一个重拍砸出「过期」；
 * 配乐回落段 11 下硬拍 = 长期伴侣大脑里依次亮起的 11 个区域，102.52 秒配乐整段重新进来时砸出「依恋」；
 * 结尾重新定义锚词：会过期的是热恋，爱只是换了个样子。
 * 事实出处：Marazziti 等 1999（Psychol Med 29:741）、Acevedo 等 2012（Soc Cogn Affect Neurosci 7:145）、O'Leary 等 2012（Soc Psychol Personal Sci 3:241）。
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

/** 开场两组四连重音（实测）：第一组心跳，第二组「18 个月」的环转完 */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍，每下点亮一个脑区 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];

export const ANCHOR = '过期';
export const TERM = '热恋期 · Limerence';
export const ANCHOR2 = '依恋';
export const TERM2 = '依恋 · Attachment';

/**
 * 字幕：[拍号, 中文, 英文]。【】里的词变金色；中文不超过 18 字（不算标点和空格之外的标记）；
 * 每句停到下一句开始；中文为 null 表示这段是大字（锚词砸出），不放字幕。
 */
export const CUES: [number, string | null, string][] = [
  // 钩子：心跳 + 18 个月
  [0, '你一定听过：爱情只有 18 个月。', 'You’ve heard it: love lasts eighteen months.'],
  [8, '热恋一过，心动就没了。', 'Once the rush fades, so does the spark.'],
  [16, '18 个月，一天都不多。', 'Eighteen months. Not a day more.'],
  [24, '就像牛奶，总有一天会——', 'Like milk, one day it will —'],
  [32, null, ''], // 第一个重拍「过期」
  // 1999：热恋的大脑像强迫症
  [36, '1999 年，比萨大学的一个实验：', '1999, a study at the University of Pisa.'],
  [44, '20 个刚坠入爱河的人，', 'Twenty people who had just fallen in love.'],
  [52, '测了血液里的血清素转运体。', 'They measured a serotonin transporter in the blood.'],
  [60, '低得，和【强迫症】患者一样。', 'As low as in people with OCD.'],
  [64, '所以热恋时，满脑子都是 TA。', 'That’s why love feels like an obsession.'],
  [72, '一年到一年半后，复测其中 6 人——', 'A year or so later, six were tested again —'],
  [80, '数值，回到了正常。', 'Their levels were back to normal.'],
  [88, '热恋，真的会【过期】。', 'Infatuation really does expire.'],
  // 2012：结婚 21 年的人
  [96, '可 2012 年，有人换了个问题：', 'But in 2012, someone asked a different question:'],
  [104, '那些结婚二十多年，', 'What about people married for decades'],
  [112, '还说自己深爱对方的人呢？', 'who still say they are deeply in love?'],
  [120, '17 个人，平均结婚 21.4 年。', 'Seventeen people, married 21.4 years on average.'],
  [128, '让他们看伴侣的照片——', 'Shown a photo of their partner —'],
  [136, '大脑深处的 VTA，亮了。', 'a region called the VTA lit up.'],
  [144, '和刚热恋的人，亮在【同一个地方】。', 'The same place it lights up in new love.'],
  [152, '可亮起来的，不止它。', 'But it wasn’t the only one.'],
  // 回落段：11 个脑区依次亮起
  [160, '还有一整片区域，跟着亮了。', 'A whole network lit up with it.'],
  [176, '母亲看着孩子时，它们也会亮。', 'The same regions light up when a mother sees her child.'],
  [188, '热恋会过期，可它会长成——', 'Infatuation fades, but it grows into —'],
  [192, null, ''], // 第二个爆点「依恋」
  // 结尾：40%，重新定义「过期」
  [200, '这也不是少数人的幸运。', 'And it isn’t just a lucky few.'],
  [204, '美国随机调查了 274 个已婚的人：', 'A random survey of 274 married Americans:'],
  [212, '结婚 10 年以上的，', 'Among those married over ten years,'],
  [216, '40% 说，仍然【非常强烈】地爱着。', '40% said they were still very intensely in love.'],
  [224, '会过期的，是热恋那阵眩晕；', 'What expires is the dizzy rush;'],
  [232, '爱没有【过期】，它只是换了个样子。', 'love doesn’t expire. It just changes shape.'],
  [240, '你们在一起多久了？还会心动吗？', 'How long have you been together? Do you still feel it?'],
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句：随收暗退场 */
export const HALF_BEATS = [24, 188];

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  heart: [0, HIT], // 第一秒一颗发光的金心，心跳踩开场四连；18 个月的环在第 11–16 拍走完；之后变冷、收暗
  hit: [HIT, fb(9)], // 「过期」砸出
  pisa: [fb(9), fb(16)], // 1999：20 个点 + 三根柱（恋爱 / 强迫症 / 对照）
  follow: [fb(16), fb(24)], // 6 人复测，柱子回到正常；金心盖上「过期」
  y2012: [fb(24), fb(32)], // 年份翻到 2012；21.4 年
  brain: [fb(32), fbt(188)], // 大脑示意：VTA 亮起；回落段 11 下硬拍点亮 11 个区域
  build: [fbt(188), HIT2], // 话说一半，收暗
  hit2: [HIT2, fb(50)], // 「依恋」砸出
  survey: [fb(50), fb(56)], // 100 个点，40 个点亮
  end: [fb(56), DURATION], // 金心回来，重新跳起来；抛问题
} as const;

/* ---------------- 片中的事实（出处见文件头，测试核对） ---------------- */

/** Marazziti 1999：20 名 6 个月内坠入爱河者、20 名未服药强迫症患者、20 名对照；12–18 个月后复测 6 人恢复正常 */
export const PISA_N = 20;
export const PISA_RETEST = 6;
export const PISA_RETEST_MONTHS = [12, 18];
/** Acevedo 2012：10 女 7 男，平均结婚 21.4 年 */
export const LONG_WOMEN = 10;
export const LONG_MEN = 7;
export const LONG_YEARS = 21.4;
/** O'Leary 2012：274 名美国已婚者随机样本，结婚 10 年以上者 40% 自评「非常强烈地相爱」 */
export const SURVEY_N = 274;
export const SURVEY_YEARS = 10;
export const SURVEY_PCT = 40;
/**
 * Acevedo 2012 摘要里和长期伴侣相关的区域（VTA 单独在第 136 拍亮）：
 * 奖赏系统的背侧纹状体、尾状核；母婴依恋相关的苍白球、黑质、中缝核、丘脑、岛叶、前扣带回、后扣带回；
 * 与性生活频率相关的下丘脑、海马后部。位置是示意。
 */
export const REGIONS: {name: string; x: number; y: number}[] = [
  {name: '背侧纹状体', x: 470, y: 250},
  {name: '尾状核', x: 420, y: 205},
  {name: '苍白球', x: 500, y: 300},
  {name: '黑质', x: 520, y: 395},
  {name: '中缝核', x: 560, y: 450},
  {name: '丘脑', x: 560, y: 285},
  {name: '岛叶', x: 380, y: 320},
  {name: '前扣带回', x: 360, y: 150},
  {name: '后扣带回', x: 640, y: 160},
  {name: '下丘脑', x: 455, y: 370},
  {name: '海马后部', x: 650, y: 360},
];
export const VTA = {x: 505, y: 420};
export const RELAY_AT = RELAY_HITS.map(fbt);

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep32-love-lasts';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  [`${A}/room.wav`, 0, 0.5],
  // 开场：心跳踩第 0/5/7/8 拍，「18 个月」的环在第 11/13/15/16 拍各响一声
  ...OPEN_HITS_1.map((b) => s('heartbeat', b, 0.75)),
  ...OPEN_HITS_2.map((b) => s('chime', b, 0.4)),
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.5],
  s('impact', 32, 0.7),
  // 1999
  ['audio/sfx/paper.wav', fbt(36), 0.2],
  s('chime', 60, 0.35),
  s('chime', 80, 0.35),
  s('impact', 88, 0.35), // 「过期」印章
  // 2012
  ['audio/sfx/whoosh.wav', fbt(96), 0.2],
  s('chime', 120, 0.35),
  s('heartbeat', 136, 0.6), // VTA 亮起
  s('chime', 144, 0.4),
  // 回落段：11 下硬拍，每下一声轻铃；最后一下压低
  ...RELAY_HITS.map((b) => s('chime', b, b === 187 ? 0.35 : 0.45)),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.55],
  s('impact', 192, 0.66),
  // 结尾
  s('chime', 216, 0.4),
  ...[232, 233, 234, 235].map((b, i) => s('heartbeat', b, i % 2 ? 0.45 : 0.6)), // 金心重新跳起来
  ['audio/sfx/whoosh.wav', fbt(240), 0.18],
];
