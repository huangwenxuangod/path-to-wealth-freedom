/**
 * ep29 脚步声就在耳边，为什么听不出前后？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「对称」：对两耳的时间差来说，前和后是镜子两边，一模一样。第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）配乐整段重新进来时砸出「对称」。
 * 所有时间挂在 we-never 的拍子上：开场三次重音在第 7、10、15 拍，章节卡在乐句起点（每 4 小节）。
 * 事实出处（都读过原文 / 作者摘要）：
 *   Riot Games《VALORANT Patch Notes 2.06》（2021-03-30）HRTF 一节；
 *   Carlini, Bordeau & Ambard《Auditory localization: a comprehensive practical review》Frontiers in Psychology 2024；
 *   Hartmann & Macaulay《Anatomical limits on interaural time differences》Frontiers in Neuroscience 2014；
 *   Wightman & Kistler《Resolution of front–back ambiguity in spatial hearing by listener and source movement》JASA 1999（检验 Wallach 1940）；
 *   Wenzel, Arruda, Kistler & Wightman《Localization using nonindividualized head-related transfer functions》JASA 1993。
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

/** 开场三次重音（第 7、10、15 拍）：背后中枪、击杀回放、俯视图揭穿 */
export const DEATH = fbt(7);
export const KILLCAM = fbt(10);
export const SPLIT = fbt(15);
/** 开场：第 0–3 拍右边四声脚步，第 4 拍起转身，第 6 拍转到右后方 */
export const STEPS = [0, 1, 2, 3];
export const TURN_FROM = fbt(4);
export const TURN_TO = fbt(6);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.02';
export const TOPIC = '听声辨位';
export const TITLE = '听得到脚步，分不清前后？';
export const ANCHOR = '对称';
export const TERM2 = '混淆锥 · Cone of Confusion';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '前和后，\n为什么会〔听反〕？';
export const TURN_LINE = '耳朵分不清的前后，\n〔转一下头〕就分得清';
export const FLIP_LINE = '你的耳朵没有坏，\n只是前后太〔对称〕';
export const ASK_LINE = '你打游戏开 HRTF 吗？\n开了以后，听得更准了吗？';
export const NEXT_TITLE = '敌人就在眼前，你没看见？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '时差'],
  [16, '对称'],
  [24, '耳廓'],
  [32, '转头'],
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
  [0, '耳机里，右边传来一串脚步声。'],
  [4, '你判断他在【右后方】，立刻转身。'],
  [7, '〖枪声从背后响起〗。'],
  [10, '回放里，他一直在你的【右前方】。'],
  [15, '前面的声音，被你听成了后面。'],
  [24, '声音就在耳边，怎么会听反？'],
  [28, '答案，藏在你两只耳朵之间——'],
  [32, null], // 标题卡
  // 时差
  [36, '声音从右边来，先到右耳，再到左耳。'],
  [40, '两只耳朵之间，差的就是这一点时间。'],
  [44, '人头就这么宽，最多只差约 0.76 毫秒。'],
  [48, '可大脑能分辨约 10 微秒的差别。'],
  [52, '它就靠这个，判断声音偏左还是偏右。'],
  [56, '左右分得很准。那前后呢？'],
  [60, '对时间差来说，前和后是【对称】的。'],
  // 对称
  [68, '右前方的他，和右后方的镜像点，'],
  [72, '到两只耳朵的距离差，一模一样。'],
  [76, '时间差一样，音量差也几乎一样。'],
  [80, '这一整圈对称的位置，叫〔混淆锥〕。'],
  [84, '只靠两耳的差别，大脑分不出它们。'],
  [88, '戴耳机、听合成的声音，最容易听反。'],
  [92, '所以你转身的那一下，其实是在〖猜〗。'],
  // 耳廓
  [100, '那平时，我们靠什么分前后？'],
  [104, '靠耳朵外面这一圈：【耳廓】。'],
  [108, '前面来的、后面来的，被它改得不一样。'],
  [112, '这套改法叫 HRTF，每个人都不一样。'],
  [116, '游戏的 HRTF，只能用一套测量数据。'],
  [120, 'Riot 自己也说：不一定像你的耳朵。'],
  [124, '用别人的耳朵听，前后〖更容易混〗。'],
  // 转头
  [132, '1940 年，心理学家 Wallach 提出：'],
  [136, '只要【转一下头】，前后就分得开。'],
  [140, '头往右转，前面的声音往中间跑；'],
  [144, '后面的声音，却往旁边跑。'],
  [148, '1999 年实验：允许转头，混淆几乎消失。'],
  [152, null], // 大字：转一下头就分得清
  // 怎么办（配乐回落段）
  [160, '那打游戏时能做什么？'],
  [164, '① 听到脚步，先小幅甩一下视角。'],
  [168, '② 往中间跑在前面，往外跑在后面。'],
  [172, '③ 开 HRTF，关掉其他 3D 音效。'],
  [176, '④ 去自定义房间，先把耳朵练熟。'],
  [180, '游戏里转一下视角，就等于转了一下头。'],
  [188, '你不是耳朵不好，骗你的是——'],
  [192, null], // 第二个爆点「对称」
  // 结尾
  [200, '这不是你的错，是两只耳朵的几何。'],
  [204, '两只耳朵，天生分不清镜子两边；'],
  [208, '可你还有一个会转的脖子。'],
  [216, '下次听到脚步，先转一下，再开枪。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D：右边脚步声，转身看右后方
  death: [DEATH, KILLCAM], // 背后中枪：红屏裂纹
  killcam: [KILLCAM, SPLIT], // 击杀回放：他在右前方，看着你的后背
  split: [SPLIT, fb(6)], // 俯视图：真的在右前，你以为在右后
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  itd: [fb(9), fb(12)], // 声波先到右耳再到左耳 + 两耳时间轨道
  scale: [fb(12), fb(14)], // 763 μs vs 10 μs
  mirror: [fb(14), fb(16)], // 前后两个声源，时间差一样
  cone: [fb(16), fb(21)], // 章节卡 + 镜像点到两耳的距离差 → 第 19 小节起画出混淆锥
  guess: [fb(21), fb(24)], // 耳机、合成声音 → 转身是在猜
  pinna: [fb(24), fb(29)], // 章节卡 + 耳廓频谱 + HRTF
  riot: [fb(29), fb(31)], // Riot 原话：单一测量数据
  wenzel: [fb(31), fb(32)], // Wenzel 1993：用别人的 HRTF 前后混淆增加
  turn: [fb(32), fb(37)], // 章节卡 + 转头演示
  study: [fb(37), fb(38)], // Wightman & Kistler 1999
  turnline: [fb(38), fb(40)], // 大字：转一下头就分得清
  steps: [fb(40), fb(45)], // 章节卡 + 四步方法
  build: [fb(45), HIT2], // 回落段：射击场里小幅甩视角，收暗
  hit2: [HIT2, fb(50)], // 「对称」砸出
  geometry: [fb(50), fb(54)], // 暖色俯视图：转头打破对称
  hold: [fb(54), fb(56)], // 听到脚步，转一下，爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Hartmann & Macaulay 2014：典型人头半径 8.75 cm、声速 344 m/s，低频极限下最大两耳时间差 3a/v ≈ 763 μs */
export const HEAD_R_CM = 8.75;
export const SOUND_V = 344;
export const ITD_MAX_US = 763;
/** Carlini 等 2024 综述：能察觉的最小两耳时间差约 10 μs */
export const ITD_JND_US = 10;
/** 年份 */
export const WALLACH_YEAR = 1940;
export const WK_YEAR = 1999;
export const WENZEL_YEAR = 1993;
export const RIOT_PATCH = '2.06';
export const RIOT_DATE = '2021-03-30';
/** Riot 补丁说明 2.06 原文 */
export const RIOT_ASK = 'What direction did those Raze footsteps come from? Is she moving from in front or behind you?';
export const RIOT_PROFILE = 'This implementation uses a profile based on a single set of measurements, and may not feel natural at first to all listeners';
export const RIOT_OTHER3D = 'It’s recommended that players please turn off any other “3D Audio” processing while using this feature.';
/** Wightman & Kistler 1999 摘要原文 */
export const WK_QUOTE = 'The front-back confusions made in the restricted condition nearly disappeared in the condition in which head movements were encouraged.';

/** 开场几何（世界坐标，米）：你在原点朝 +z；他在右前方 60°，镜像点在右后方 120° */
export const ENEMY_AZ_DEG = 60;
export const MIRROR_AZ_DEG = 180 - ENEMY_AZ_DEG;

/** 音效：[文件, 帧, 音量]。ep29 目录里的是本期合成的（audio/episodes/ep29-*.mjs），sfx/ 是共享音效 */
const A = 'audio/ep29-footsteps';
const step = (b: number, vol = 0.6, file = 'footstep-r'): [string, number, number] => [`${A}/${file}.wav`, fbt(b), vol];
export const SFX: [string, number, number][] = [
  // 开场：右边四声脚步 → 转身 → 背后中枪
  ...STEPS.map((b) => step(b, 1)),
  ['audio/sfx/whoosh.wav', TURN_FROM, 0.35],
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.7],
  [`${A}/rewind.wav`, KILLCAM - 4, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 时差：示意里的脚步（偏右），然后每句一个 UI 嘀
  step(36, 0.8),
  step(38, 0.8),
  ...[44, 48].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.45],
  // 对称
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/tick.wav`, fbt(80), 0.5],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  step(88, 0.8, 'footstep'),
  step(90, 0.8, 'footstep'),
  // 耳廓
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(112), 0.45],
  ['audio/sfx/whoosh.wav', fb(29), 0.35],
  ['audio/sfx/whoosh.wav', fb(31), 0.35],
  // 转头
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fbt(140), 0.3],
  [`${A}/tick.wav`, fbt(148), 0.5],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  step(180, 0.7),
  step(181, 0.7),
  step(182, 0.7),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  ['audio/sfx/whoosh.wav', fb(50), 0.35],
  step(216, 1),
  step(217, 1),
  ['audio/sfx/whoosh.wav', fbt(218), 0.3],
  [`${A}/gunshot.wav`, fbt(220), 0.75],
  ['audio/sfx/ding.wav', fbt(220) + 3, 0.35],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
  ['audio/sfx/whoosh.wav', fb(62), 0.4],
];
