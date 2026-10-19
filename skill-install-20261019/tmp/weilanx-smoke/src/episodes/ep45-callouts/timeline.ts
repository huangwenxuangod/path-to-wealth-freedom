/**
 * ep45 队友报点，你怎么听不见？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 冤 → 翻案 → 招：队友骂你聋、你以为自己不专心；其实眼睛和耳朵共用一份注意力，对枪时眼睛把它占满，
 * 大脑在声音进来约 100 毫秒时就把它压低了（无意失聪）；招：先报方位、越短越好、等队友这枪打完再说、没回应就再喊。锚词「带宽」。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「带宽」。片尾停在评论区问题，不做下期预告。
 * 事实出处：
 *   Macdonald & Lavie 2011《Visual perceptual load induces inattentional deafness》
 *     Atten Percept Psychophys 73(6):1780–1789（PMC3152714，读过开放全文）：十字只闪 150 ms，低负载判断哪条臂是蓝的，
 *     高负载判断哪条臂更长（3.6° vs 3.8°），最后一轮同时响一声纯音；实验 2：低负载 21/24 听见，高负载 5/24 听见（摘要：79% 没听见）。
 *   Molloy, Griffiths, Chait & Lavie 2015《Inattentional Deafness: Visual Load Leads to Time-Specific Suppression of Auditory Evoked Responses》
 *     J Neurosci 35(49):16046–16054（只读到摘要）：脑磁图；高视觉负载下，声音出现约 100 ms 的听觉诱发反应变小，之后 P3「察觉」反应也被压低；
 *     共用的视听资源被暂时耗尽 → 片刻的听觉处理下降。
 *   Raveh & Lavie 2015《Load-induced inattentional deafness》Atten Percept Psychophys 77(2):483–492（PMC4677383，读过开放全文）：
 *     实验 1（18 人）字母搜索，听见率低负载 82%、高负载 45%；实验 3 声音一半回合出现、每回合都要回答，照样降低。
 *   Giraudet, St-Louis, Scannella & Causse 2015《P300 event-related potential as an indicator of inattentional deafness?》
 *     PLoS One 10(2):e0118556（只读到摘要）：飞行模拟任务，高负载下超过 31% 的偏差音（警报）没被察觉。
 *   「对枪是游戏里视觉负载最高的时刻」是推断，字幕用「最费眼睛」这种说法；四招是建议（第 3 招依据 Molloy 的「片刻」压低）。
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

/** 开场三次重音（第 7、10、15 拍）：被右边的人打死、回放里队友喊了三遍、分屏「耳机 vs 脑子」 */
export const DEATH = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);
/** 开场队友喊「右边还有一个」的三次（拍号） */
export const CALL_BEATS = [2, 4, 6];
/** 右边那个人探出来的帧 */
export const SIDE_PEEK = fbt(5);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.11';
export const TOPIC = '无意失聪';
export const TITLE = '队友报点，你怎么听不见？';
export const HOOK_LINE = '队友喊了三遍，你怎么〖一个字都没听见〗？';
export const ANCHOR = '带宽';
export const TERM2 = '无意失聪 · Inattentional Deafness';
export const CALL_TEXT = '右边还有一个！';
export const SHORT_CALL = '右边，一个';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '声音明明进了耳朵，\n为什么〔没进脑子〕？';
export const BIG_LINE = '声音一分没少，\n是〔眼睛占满了带宽〕';
export const FLIP_LINE = '你不是聋，\n只是〔太专心了〕';
export const ASK_LINE = '你因为没听见报点，\n被队友骂过吗？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '失聪'],
  [16, '大脑'],
  [24, '在等也漏'],
  [32, '对枪'],
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
  [0, '你正和正面那个人对枪，准星死死压着他。'],
  [4, '耳机里，队友在喊：「右边还有一个！」'],
  [7, '〖你被右边那个人打死了〗。'],
  [10, '回放里，队友整整喊了三遍。'],
  [15, '声音进了你的耳机，'],
  [19, '可你一个字都没听见。'],
  [24, '队友骂你聋，你自己也想不通。'],
  [28, '答案不在耳朵，在你的眼睛——'],
  [32, null], // 标题卡
  // 失聪
  [36, '2011 年，英国的心理学家做了个实验。'],
  [40, '屏幕中央闪一个十字，只有 150 毫秒。'],
  [44, '简单组：看哪条臂是蓝的。'],
  [48, '困难组：比哪条臂更长，只差一点点。'],
  [52, '十字出现的同时，耳机里响了一声。'],
  [56, '简单组 24 人，21 人听见了。'],
  [60, '困难组 24 人，〖只有 5 人听见〗。'],
  // 大脑
  [68, '眼睛和耳朵，共用同一条【带宽】。'],
  [72, '2015 年，研究者用脑磁图看大脑。'],
  [76, '声音进来约 100 毫秒，听觉区该有反应。'],
  [80, '眼睛一忙，这一下反应〖被压低了〗。'],
  [84, '后面那个「听到了」的信号，也变弱了。'],
  [88, '论文的说法：视觉和听觉共用一份资源。'],
  [92, '不是耳朵没收到，是大脑没放它进来。'],
  // 在等也漏
  [100, '那提前知道会有声音，是不是就听得见？'],
  [104, '同一年，另一个实验：边找字母边听声音。'],
  [108, '找得轻松，82% 的声音都听见了。'],
  [112, '找得费劲，〖只剩 45%〗。'],
  [116, '就算一半回合都有声音，你一直在等，'],
  [120, '照样漏听：这不是你不专心。'],
  [124, '恰恰是因为，你〔太专心了〕。'],
  // 对枪
  [132, '对枪，就是游戏里最费眼睛的时刻。'],
  [136, '找一个小小的头，跟住它，压住准星。'],
  [140, '队友的报点，正好撞上带宽最满的那一下。'],
  [144, '飞行模拟里，一忙起来，'],
  [148, '超过 31% 的警报音都没被察觉。'],
  [152, null], // 大字：声音一分没少，是眼睛占满了带宽
  // 怎么办（配乐回落段）
  [160, '报点的、听报点的，各有两招：'],
  [164, '① 先报方位，再报人数。'],
  [168, '② 越短越好：「右边，一个」。'],
  [172, '③ 队友正在对枪，等他这枪打完。'],
  [176, '④ 他没回应，就再喊一次。'],
  [180, '大脑只是那一下顾不上，过了就听得见。'],
  [188, '让你听不见的，不是耳朵，是那条——'],
  [192, null], // 第二个爆点「带宽」
  // 结尾
  [200, '每个人的大脑，都只有这么一条带宽。'],
  [204, '这一回合，队友等你这枪打完才开口。'],
  [208, '「右边，一个。」'],
  [216, '这一次，〔你听见了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, DEATH], // 3D 对枪：准星压着正面的人，左下角队友语音条在喊（字是糊的）
  death: [DEATH, REPLAY], // 被右边的人打死：红屏裂纹
  replay: [REPLAY, SPLIT], // 回放：两条轨道，你的眼睛一直盯正面，队友的麦喊了三次
  split: [SPLIT, fb(6)], // 分屏：耳机里的波形很大 vs 脑子里几乎是平的
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  cross: [fb(9), fb(14)], // 十字实验：简单组看颜色 / 困难组比长短，同时响一声
  heard: [fb(14), fb(16)], // 24 人点阵：21 人 vs 5 人
  brain: [fb(16), fb(17)], // 章节卡「大脑」
  pipe: [fb(17), fb(18)], // 锚词：一条带宽，眼睛和耳朵共用
  meg: [fb(18), fb(22)], // 脑磁图示意：约 100 ms 的听觉反应被压低、后面的「听到了」也变弱
  share: [fb(22), fb(24)], // 带宽被眼睛占满，声音挤不进来；耳朵收到 vs 大脑放行
  expect: [fb(24), fb(29)], // 章节卡 + 82% vs 45%
  waiting: [fb(29), fb(32)], // 一半回合有声音、你在等，照样漏
  duel: [fb(32), fb(36)], // 章节卡 + 3D 对枪 + 带宽表满格，报点被挡在外面
  pilot: [fb(36), fb(38)], // 飞行模拟：超过 31% 的警报没被察觉
  bigline: [fb(38), fb(40)], // 大字
  steps: [fb(40), fb(45)], // 章节卡 + 四招
  build: [fb(45), HIT2], // 回落段：语音条发着光、带宽表清空，收暗
  hit2: [HIT2, fb(50)], // 「带宽」砸出
  outro: [fb(50), fb(56)], // 暖色射击场：先打完正面，队友再报「右边，一个」，转身爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/** 结尾：正面那个人倒下、队友开口、转身、爆头 */
export const OUT_KILL1 = fbt(203);
export const OUT_CALL = fbt(208);
export const OUT_TURN = fbt(212);
export const OUT_KILL2 = fbt(216);

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Macdonald & Lavie 2011（实验 2） */
export const ML_YEAR = 2011;
export const CROSS_MS = 150;
export const ML_N = 24;
export const ML_LOW_HEARD = 21;
export const ML_HIGH_HEARD = 5;
export const ML_ABSTRACT_MISS = 79;
export const ML_QUOTE = 'Failures to notice the presence of this tone (i.e., inattentional deafness) reached a rate of 79% in the high-visual-load condition';
/** Molloy 等 2015 */
export const MOLLOY_YEAR = 2015;
export const MOLLOY_MS = 100;
export const MOLLOY_QUOTE = 'Temporary depletion of shared capacity in perceptually demanding visual tasks leads to a momentary reduction in sensory processing of auditory stimuli';
/** Raveh & Lavie 2015（实验 1 听见率；实验 3 一半回合有声音） */
export const RL_YEAR = 2015;
export const RL_LOW = 82;
export const RL_HIGH = 45;
export const RL_EXPECT_PCT = 50;
/** Giraudet 等 2015（摘要：More than 31% … not detected） */
export const GIR_YEAR = 2015;
export const GIR_MISS = 31;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep45-callouts';
export const SFX: [string, number, number][] = [
  // 开场：对枪 → 被打死 → 回放 → 分屏
  ...CALL_BEATS.map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.35]),
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.65],
  [`${A}/rewind.wav`, REPLAY - 4, 0.6],
  [`${A}/impact.wav`, REPLAY, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.4],
  [`${A}/tick.wav`, fbt(19), 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 失聪：十字闪、响一声、点阵
  ...[40, 44, 48].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.5]),
  ['audio/sfx/ding.wav', fbt(52), 0.4],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/tick.wav`, fbt(56), 0.5],
  [`${A}/impact.wav`, fbt(60), 0.55],
  // 大脑
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/impact.wav`, fbt(68), 0.5],
  ['audio/sfx/whoosh.wav', fb(18), 0.35],
  [`${A}/tick.wav`, fbt(76), 0.5],
  [`${A}/impact.wav`, fbt(80), 0.5],
  ['audio/sfx/whoosh.wav', fb(22), 0.35],
  // 在等也漏
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  [`${A}/impact.wav`, fbt(112), 0.5],
  ['audio/sfx/whoosh.wav', fb(29), 0.35],
  ['audio/sfx/ding.wav', fbt(124), 0.35],
  // 对枪
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/tick.wav`, fbt(140), 0.4],
  ['audio/sfx/whoosh.wav', fb(36), 0.35],
  [`${A}/impact.wav`, fbt(148), 0.65],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/gunshot.wav`, OUT_KILL1, 0.8],
  [`${A}/tick.wav`, OUT_CALL, 0.5],
  ['audio/sfx/whoosh.wav', OUT_TURN, 0.35],
  [`${A}/gunshot.wav`, OUT_KILL2, 0.85],
  ['audio/sfx/ding.wav', OUT_KILL2 + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
