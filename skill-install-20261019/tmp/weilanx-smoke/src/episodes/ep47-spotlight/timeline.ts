/**
 * ep47 旁边有人，你怎么没看见？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：对枪时第二个人就站在准星旁边，你被他打死、队友骂你瞎；其实注意力像一束聚光灯，
 * 照的是你正盯着的那个「东西」，不是准星周围那块地方；看得越费劲光圈越窄，离得近也没用，知道有埋伏也只会盯你在等的那一个。
 * 招：打一个扫一眼、架点前先看一遍、两个口别一个人架、队友报点补光外。锚词「聚光灯」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「聚光灯」。片尾停在评论区问题，不做下期预告。
 * 事实出处：
 *   Simons & Chabris 1999《Gorillas in our midst: sustained inattentional blindness for dynamic events》Perception 28(9):1059–1074
 *     （读过原文 PDF）：两队各 3 人传球，数一队传了几次；44–48 秒时穿大猩猩服的人走过画面，持续 5 秒；有效 192 人，54% 看见、46% 没看见（大猩猩 / 打伞女人两种事件合并）；
 *     只算大猩猩的 96 人 44% 看见；数总数（简单）64% 看见，分开数两种传球（困难）45%（两种事件合并，字幕说「闯入者」）；另一版大猩猩停在中间捶胸、在画面里 9 秒，12 人里 50% 看见；
 *     原文：没被注意的东西可以穿过注意的范围（和中央凹）照样不被「看见」；摘要：观察者注意的是物体和事件，不是空间位置。
 *   Cartwright-Finch & Lavie 2007《The role of perceptual load in inattentional blindness》Cognition 102(3):321–340（只读到摘要）：
 *     搜索项更多、或辨别比检测更难时，对任务无关刺激的察觉显著下降。
 *   Macdonald & Lavie 2008《Load induced blindness》J Exp Psychol Hum Percept Perform 34(5):1078–1091（PMC2672054，读过开放全文）：
 *     实验 1（16 人）找字母时留意外周的小图形；图形离目标近 61%、远 64% 看见，距离没有影响。
 *   Simons 2010《Monkeying around with the gorillas in our midst》i-Perception 1(1):3–6（PMC3563049，读过开放全文）：
 *     看过老视频的 23 人 100% 找到大猩猩；新视频里同时幕布变色、一个球员离场，所有人里只有 11% / 16% 发现。
 *   「对枪是把光圈收到最窄的时候」是推断；四招是建议。
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

/** 开场三次重音（第 7、10、15 拍）：被旁边的人打死、回放圈出他、分屏「屏幕 / 大脑」 */
export const DEATH = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);
/** 旁边那个人走进来站定的帧（第 2 拍起走 12 帧） */
export const SIDE_IN = fbt(2);
/** 他在准星旁边站了多久（本片情节，自己算：从站定到你倒下） */
export const STOOD_SEC = Math.round(((DEATH - (SIDE_IN + 12)) / FPS) * 10) / 10;
/** 开场你对正面连开的几枪（拍号） */
export const FIRE_BEATS = [3, 4, 5, 6];

export const SERIES = 'FPS 原理课';
export const EP = 'EP.12';
export const TOPIC = '无意视盲';
export const TITLE = '旁边有人，你怎么没看见？';
export const HOOK_LINE = '他就站在你准星旁边，你怎么〖没看见〗？';
export const ANCHOR = '聚光灯';
export const TERM2 = '无意视盲 · Inattentional Blindness';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '他就在你眼前，\n为什么你〔看不见〕？';
export const BIG_LINE = '他一直在画面里，\n只是〔不在你的光里〕';
export const FLIP_LINE = '你不是眼瞎，\n是光只照到了〔一个人〕';
export const ASK_LINE = '你被「旁边那个人」\n偷死过几次？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '大猩猩'],
  [16, '光圈'],
  [24, '离得再近'],
  [32, '知道也漏'],
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
  [0, '你正和正面那个人对枪，一枪接一枪。'],
  [3, '这时，第二个人从旁边走了出来。'],
  [7, '〖你被他打死了〗。'],
  [10, '回放里，他就站在你准星旁边。'],
  [15, '他就在你的屏幕上，'],
  [19, '可你的大脑里，只有一个人。'],
  [24, '队友骂你瞎，你自己也想不通。'],
  [28, '答案不在眼睛，在你的注意力——'],
  [32, null], // 标题卡
  // 大猩猩
  [36, '1999 年，哈佛有个很出名的实验。'],
  [40, '两队人传球，你只数白队传了几次。'],
  [44, '传到一半，一个穿大猩猩服的人走过画面。'],
  [48, '它在画面里，整整待了 5 秒。'],
  [52, '看大猩猩那版的 96 人，〖56% 没看见它〗。'],
  [56, '还有一版，它停在正中间捶胸，'],
  [60, '待了 9 秒，还是只有一半人看见。'],
  // 光圈
  [68, '注意力像一束【聚光灯】，照到的才看得见。'],
  [72, '光圈多大，取决于你看得多费劲。'],
  [76, '只数总数的人，64% 发现了闯入者；'],
  [80, '分开数两种传球的，〖只剩 45%〗。'],
  [84, '2007 年伦敦的实验也一样：任务越难，'],
  [88, '屏幕上多出来的东西，越容易没看见。'],
  [92, '光圈一收窄，光外面就是黑的。'],
  // 离得再近
  [100, '那离准星近一点，总该看得见吧？'],
  [104, '2008 年的实验：边找字母，边留意小图形。'],
  [108, '图形离目标近，61% 看见；离得远，64%。'],
  [112, '离得近，〖一点用都没有〗。'],
  [116, '大猩猩从视线正中间穿过，照样没被看见。'],
  [120, '聚光灯照的不是准星周围那一块，'],
  [124, '是你正盯着的那个〔人〕。'],
  // 知道也漏
  [132, '2010 年，研究者又拍了一版大猩猩视频。'],
  [136, '看过老视频的人，100% 找到了大猩猩。'],
  [140, '可同时，背景幕布变了色，一个球员走了。'],
  [144, '幕布变色 11% 发现，球员离场 16%。'],
  [148, '你知道有埋伏，也只会盯你在等的那一个。'],
  [152, null], // 大字：他一直在画面里，只是不在你的光里
  // 怎么办（配乐回落段）
  [160, '聚光灯只有一束，那就轮流照：'],
  [164, '① 打完一个，先扫一眼再瞄下一个。'],
  [168, '② 架点前，先把能出人的地方看一遍。'],
  [172, '③ 两个口别一个人架，分给队友一个。'],
  [176, '④ 队友的报点，就是你光外面的眼睛。'],
  [180, '你照不到的地方，让别人替你照。'],
  [188, '让你看不见他的，不是眼睛，是那束——'],
  [192, null], // 第二个爆点「聚光灯」
  // 结尾
  [200, '每个人的注意力，都只有一束光。'],
  [204, '这一次，打完一个，你先扫了一眼。'],
  [208, '他就在旁边。'],
  [216, '这一次，〔你看见了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D 对枪：你连开几枪压正面，第二个人从右边走到他旁边站定
  death: [DEATH, REPLAY], // 被旁边的人打死：红屏裂纹
  replay: [REPLAY, SPLIT], // 回放：定格那一帧，圈出准星旁边的第二个人
  split: [SPLIT, fb(6)], // 分屏：屏幕上两个人 vs 大脑里聚光灯只照一个
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  court: [fb(9), fb(13)], // 传球场：白队黑队传球、计数，大猩猩服走过 5 秒
  gorilla: [fb(13), fb(14)], // 大猩猩那版 96 人：44% 看见 / 56% 没看见
  thump: [fb(14), fb(16)], // 大猩猩停在正中间捶胸，9 秒，50%
  beam: [fb(16), fb(18)], // 章节卡 + 锚词：传球场被聚光灯照着，光外的大猩猩是暗的
  hard: [fb(18), fb(21)], // 64% vs 45%
  load: [fb(21), fb(23)], // Cartwright-Finch & Lavie 2007：找 1 个 vs 找 6 个，多出来的方块
  narrow: [fb(23), fb(24)], // 射击场：光圈收窄
  near: [fb(24), fb(29)], // 章节卡 + 字母圈：近 61% / 远 64%
  object: [fb(29), fb(32)], // 射击场：聚光灯贴着正面那个人的轮廓，旁边那个人在光外
  known: [fb(32), fb(37)], // 章节卡 + 2010 新版视频：幕布变色、球员离场；100 / 11 / 16%
  ambush: [fb(37), fb(38)], // 射击场：光只照你在等的那个口
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：聚光灯缓慢扫过射击场，收暗
  hit2: [HIT2, fb(50)], // 「聚光灯」砸出
  outro: [fb(50), fb(56)], // 暖色射击场：打完正面，扫一眼，看见旁边的人，爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：正面那个人倒下、扫一眼、看见、爆头 */
export const OUT_KILL1 = fbt(203);
export const OUT_SCAN = fbt(205);
export const OUT_SEE = fbt(208);
export const OUT_KILL2 = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Simons & Chabris 1999 */
export const SC_YEAR = 1999;
export const SC_N = 192;
export const SC_SAW = 54;
export const SC_MISSED = 46;
/** 只算大猩猩的那几组（n = 96）：44% 看见 */
export const SC_N_GORILLA = 96;
export const SC_GORILLA_SAW = 44;
export const GORILLA_SEC = 5;
export const SC_EASY = 64;
export const SC_HARD = 45;
export const THUMP_SEC = 9;
export const THUMP_N = 12;
export const THUMP_SAW = 50;
export const SC_QUOTE_FOVEA = 'Objects can pass through the spatial extent of attentional focus (and the fovea) and still not be `seen\' if they are not specifically being attended.';
export const SC_QUOTE_OBJECTS = 'observers attend to objects and events, not spatial positions';
/** Cartwright-Finch & Lavie 2007 */
export const CFL_YEAR = 2007;
/** Macdonald & Lavie 2008 实验 1 */
export const ML08_YEAR = 2008;
export const ML08_N = 16;
export const ML08_NEAR = 61;
export const ML08_FAR = 64;
/** Simons 2010 */
export const S10_YEAR = 2010;
export const S10_FAMILIAR_GORILLA = 100;
export const S10_CURTAIN = 11;
export const S10_PLAYER = 16;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep47-spotlight';
export const SFX: [string, number, number][] = [
  // 开场：对枪 → 被旁边的人打死 → 回放 → 分屏
  ...FIRE_BEATS.map((b): [string, number, number] => [`${A}/gunshot.wav`, fbt(b), 0.5]),
  [`${A}/gunshot.wav`, DEATH, 0.72],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/rewind.wav`, REPLAY - 4, 0.6],
  [`${A}/impact.wav`, REPLAY, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 大猩猩
  [`${A}/tick.wav`, fbt(40), 0.45],
  [`${A}/tick.wav`, fbt(44), 0.5],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  [`${A}/impact.wav`, fbt(52), 0.6],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/tick.wav`, fbt(60), 0.5],
  // 光圈
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/tick.wav`, fbt(76), 0.5],
  [`${A}/impact.wav`, fbt(80), 0.6],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  ['audio/sfx/whoosh.wav', fb(23), 0.35],
  // 离得再近
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  [`${A}/impact.wav`, fbt(112), 0.6],
  ['audio/sfx/whoosh.wav', fb(29), 0.35],
  ['audio/sfx/ding.wav', fbt(124), 0.35],
  // 知道也漏
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(136), 0.5],
  [`${A}/impact.wav`, fbt(144), 0.6],
  ['audio/sfx/whoosh.wav', fb(37), 0.35],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/gunshot.wav`, OUT_KILL1, 0.78],
  ['audio/sfx/whoosh.wav', OUT_SCAN, 0.35],
  [`${A}/tick.wav`, OUT_SEE, 0.5],
  [`${A}/gunshot.wav`, OUT_KILL2, 0.82],
  ['audio/sfx/ding.wav', OUT_KILL2 + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
