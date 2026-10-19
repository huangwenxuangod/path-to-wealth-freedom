/**
 * ep25 躲进掩体，为什么还被打死？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「过去」：你看到的、你躲进去的，都已经是过去。第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）配乐整段重新进来时砸出「过去」。
 * 所有时间挂在 we-never 的拍子上：开场三次重音在第 7、10、15 拍，章节卡在乐句起点（每 4 小节）。
 * 事实出处：Riot Games 技术博客《Peeking into VALORANT's Netcode》（2020-07-28）。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** we-never 网格（与 ep24 相同）：两个重拍 17.45 秒和 102.52 秒相隔正好 40 小节 */
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

/** 开场三次重音（第 7、10、15 拍）：死亡、击杀回放、分屏 */
export const DEATH = fbt(7);
export const KILLCAM = fbt(10);
export const SPLIT = fbt(15);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.01';
export const TOPIC = '网络延迟';
export const ANCHOR = '过去';
export const TERM2 = '延迟补偿 · Lag Compensation';
/** 大字卡（不走字幕）：输的不一定是枪法、情绪翻转、评论区问题 */
export const SKILL_LINE = '你输的，\n不一定是〔枪法〕';
export const FLIP_LINE = '你没有躲慢，\n你们只是活在〔不同的时间〕里';
export const ASK_LINE = '你最冤的一次死亡，\n是怎么死的？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '时差'],
  [16, '回溯'],
  [24, '先手'],
  [32, '毫秒'],
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

/** 字幕：[拍号, 文字]。【】青 〖〗红 〔〕橙；每句停到下一句开始；null 表示这段不放字幕 */
export const CUES: [number, string | null][] = [
  // 开场：重演挫败
  [0, '看到他的那一刻，你立刻缩回了掩体。'],
  [7, '〖可你还是死了〗。'],
  [10, '回放里，你【根本没躲进去】。'],
  [15, '同一秒，两块屏幕，两个结局。'],
  [24, '到底谁的屏幕，才是真的？'],
  [28, '答案，藏在几十毫秒里——'],
  [32, null], // 标题卡
  // 时差
  [36, '联网游戏里，没有「同一时刻」。'],
  [40, '你一动，先在自己屏幕上动，'],
  [44, '再传到服务器，再传到他那里。'],
  [48, '他屏幕上的你，是几十毫秒前的你。'],
  [52, '你屏幕上的他，也一样。'],
  [56, 'Riot 的工程师说得很直白：'],
  [60, '你看到的，都是【过去】。'],
  // 回溯
  [64, '那服务器，听谁的？'],
  [68, '它会把时间〔倒回去〕——'],
  [72, '倒回他扣下扳机时，屏幕上的那一刻。'],
  [76, '在那一刻，你还在〖掩体外面〗。'],
  [80, '子弹算数：〖你已经死了〗。'],
  [84, '你躲进去的那半步，服务器不认。'],
  [88, '不倒带的话，人人都得〔猜提前量〕。'],
  [92, '倒带让命中更准，代价是偶尔死在墙后。'],
  // 先手
  [96, '更扎心的是：拉出去的人，天生先手。'],
  [100, '他一出来，自己屏幕上马上看到你；'],
  [104, '你要等他的动作，绕服务器一圈。'],
  [108, 'Riot 估算：基础先手约 【141 毫秒】。'],
  [112, '128 tick + 35ms + 60 帧：约 101 毫秒。'],
  [116, '换成 144 帧，降到约 【71 毫秒】。'],
  [120, '而人的反应，常常要 300 毫秒左右。'],
  [124, '这段时差，就是你「没反应过来」的那一下。'],
  // 毫秒
  [128, '几十毫秒，真的决定胜负吗？'],
  [132, 'Riot 找顶尖选手，做了好几天盲测。'],
  [136, '对枪的胜负，常常只差 【20～50 毫秒】。'],
  [140, '只差 10 毫秒——'],
  [144, '90% 的胜率，就能〖翻到对面〗。'],
  [148, '高手甚至分得出 10 毫秒的差别。'],
  [152, null], // 大字：你输的，不一定是枪法
  // 怎么办（配乐回落段）
  [160, '那能做什么？'],
  [164, '① 要躲就早躲：被看到再缩，〖已经晚了〗。'],
  [168, '② 插网线，选〔延迟低〕的服务器。'],
  [172, '③ 帧数拉高：144 帧，对手先手少约 30 毫秒。'],
  [176, '④ 要打就果断出：先手在【主动】的人手里。'],
  [180, '下次死在墙后，先别急着骂自己。'],
  [188, '你不是躲慢了，你只是死在他的——'],
  [192, null], // 第二个爆点「过去」
  // 结尾
  [200, '这不是 bug，是所有联网射击的代价。'],
  [204, 'Riot 能做的，是把它压到几十毫秒；'],
  [208, '你能做的，是别把命交给那几十毫秒。'],
  [216, '架好位置，等他自己走进你的准星。'],
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
  hook: [0, DEATH], // 3D：从掩体探出、看到敌人、缩回
  death: [DEATH, KILLCAM], // 掩体后被击杀：红屏裂纹
  killcam: [KILLCAM, SPLIT], // 击杀回放：对方视角里你还在外面
  split: [SPLIT, fb(6)], // 你的屏幕 vs 他的屏幕
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  signal: [fb(9), fb(12)], // 信号路径：你 → 服务器 → 他
  lanes: [fb(12), fb(14)], // 三条轨道：同一个你，三个位置
  quote: [fb(14), fb(16)], // Riot 原话
  rewind: [fb(16), fb(20)], // 章节卡 + 服务器倒带
  verdict: [fb(20), fb(22)], // 倒到那一刻：你在外面，命中
  lead: [fb(22), fb(24)], // 不倒带：要打提前量
  corner: [fb(24), fb(27)], // 章节卡 + 俯视图：拉出去的先手
  ms: [fb(27), fb(32)], // 毫秒条：141 / 101 / 71 / 人的反应 300
  blind: [fb(32), fb(35)], // 章节卡 + 盲测：20–50 ms
  flip: [fb(35), fb(38)], // 10 ms 翻转 90% 胜率
  skill: [fb(38), fb(40)], // 大字：输的不一定是枪法
  steps: [fb(40), fb(45)], // 章节卡 + 四步方法
  build: [fb(45), HIT2], // 回落段收尾、收暗
  hit2: [HIT2, fb(50)], // 「过去」砸出
  cost: [fb(50), fb(54)], // 暖色射击场慢推
  hold: [fb(54), fb(56)], // 架好位置，命中
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的数字（Riot 原文，测试核对） ---------------- */

/** Riot 文中的估算：基础先手约 141 ms；128 tick + 35 ms 往返 + 60 帧约省 40 ms（28%）；144 帧时约 71 ms（降 49%） */
export const PEEK_BASE = 141;
export const PEEK_128 = 101;
export const PEEK_144 = 71;
export const HUMAN_RT = 300;
export const TICK_MS = 1000 / 128;

/** 音效：[文件, 帧, 音量]。ep25 目录里的是本期合成的（audio/episodes/ep25-*.mjs），sfx/ 是共享音效 */
const A = 'audio/ep25-behind-cover';
export const SFX: [string, number, number][] = [
  [`${A}/tick.wav`, fbt(0), 0.5],
  [`${A}/gunshot.wav`, DEATH, 0.75],
  [`${A}/crack.wav`, DEATH + 2, 0.7],
  [`${A}/rewind.wav`, KILLCAM - 4, 0.55],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 时差：每句一个 UI 嘀
  ...[36, 40, 44, 48, 52].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.4]),
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.45],
  // 回溯
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/rewind.wav`, fb(17), 0.7],
  [`${A}/gunshot.wav`, fb(20), 0.65],
  [`${A}/crack.wav`, fb(20) + 2, 0.55],
  ...[0, 1, 2].map((k): [string, number, number] => [`${A}/gunshot.wav`, fbt(88 + k * 2), 0.5]),
  // 先手
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  ...[108, 112, 116, 120].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.5]),
  // 毫秒
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/impact.wav`, fbt(144), 0.5],
  ['audio/sfx/whoosh.wav', fbt(144), 0.35],
  // 怎么办
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/gunshot.wav`, fbt(218), 0.65],
  ['audio/sfx/ding.wav', fbt(218) + 3, 0.35],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
  ['audio/sfx/whoosh.wav', fb(62), 0.4],
];
