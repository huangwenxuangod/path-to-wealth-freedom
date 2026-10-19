/**
 * ep37 连跳为什么越跳越快？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「影子」：空中限速只量了速度在「你想去的方向」上的投影（影子），侧着补速度，影子永远很短，速度就一直往上加。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「影子」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都读过源代码原文）：
 *   id Software《Quake》源代码（QuakeWorld，1996–1997，GPL 开源）：QW/client/pmove.c 的 PM_AirAccelerate、PM_Friction，QW/server/sv_phys.c 的默认参数；
 *   Valve《Source SDK 2013》：src/game/shared/gamemovement.cpp 的 AirAccelerate、FullWalkMove，gamemovement.h 的 GetAirSpeedCap；
 *   Valve《Source SDK 2013》：src/game/shared/tf/tf_gamemovement.cpp 的 PreventBunnyJumping（《军团要塞 2》）。
 *   速度推算是自己算的（侧向补满 30 时 v² 每帧 +900，按每秒 100 帧示意），测试里复算。
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

/** 开场三次重音（第 7、10、15 拍）：对手连跳甩开你、速度表一直涨、源码卡片 */
export const PASS = fbt(7);
export const METER = fbt(10);
export const SPLIT = fbt(15);
/** 开场对手每一跳落地的拍子 */
export const HOP_BEATS = [3, 4, 5, 6, 7, 8, 9];

export const SERIES = 'FPS 原理课';
export const EP = 'EP.06';
export const TOPIC = '空中加速';
export const TITLE = '连跳为什么越跳越快？';
export const ANCHOR = '影子';
export const TERM2 = '向量投影 · Vector Projection';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '跳着跑，\n为什么比〔跑着跑〕还快？';
export const SHADOW_LINE = '限速量的不是速度，\n是速度的〔影子〕';
export const FLIP_LINE = '你没有开挂，\n你只是让速度的〔影子〕一直很短';
export const ASK_LINE = '你玩的游戏能连跳吗？\n你最多能连跳几下？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '刹车'],
  [16, '影子'],
  [24, '斜边'],
  [32, '漏洞'],
  [40, '怎么练'],
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
  [0, '你按住前进键跑到底，速度停在 320。'],
  [7, '对面一路连跳，〖把你甩开一大截〗。'],
  [10, '他没开挂，速度表却一直在涨。'],
  [15, '答案写在 1996 年的源代码里。'],
  [24, '为什么跳着跑，比跑着跑还快？'],
  [28, '秘密藏在一道「限速」里——'],
  [32, null], // 标题卡
  // 刹车
  [36, '在地面上，每一帧都有摩擦力在踩刹车。'],
  [40, '跑得越快刹得越狠，最高就停在 320。'],
  [44, '可摩擦力，只在你脚踩地面时才计算。'],
  [48, '在 Source 引擎里，先处理起跳再算摩擦。'],
  [52, '落地那一帧就起跳，刹车就〔踩空了〕。'],
  [56, '这就是为什么要「落地即跳」。'],
  [60, '但躲开刹车，只是不减速，还不会加速。'],
  // 影子
  [68, '在空中，引擎也有一道限速：30。'],
  [72, '比地面的 320 小得多，按理说加不了速。'],
  [76, '可它比的不是你的速度，'],
  [80, '而是速度在「想去的方向」上的【影子】。'],
  [84, '你往前飞，只按住侧移键：'],
  [88, '想去的方向和速度成了直角，影子是 0。'],
  [92, '离 30 还差 30，引擎就〔最多补你 30〕。'],
  // 斜边
  [100, '这 30 是横着加上去的。'],
  [104, '横着一加，新速度就是直角三角形的斜边。'],
  [108, '320 和 30 的斜边：约 321.4。'],
  [112, '一帧只多一点点，可一秒有上百帧。'],
  [116, '下一帧再把视角转一点，影子又变短，'],
  [120, '引擎就再补你一次，每一帧都补。'],
  [124, '示意：每秒 100 帧，3 秒后约 〔610〕。'],
  // 漏洞
  [132, '速度越快，每帧要转的角度越小、越难。'],
  [136, '320 时每帧要转约 5 度，610 时不到 3 度。'],
  [140, '同样几行，在 Source 引擎里几乎没改。'],
  [144, '玩家把它练成了一门技术。'],
  [148, '也有游戏不想要：《军团要塞 2》加了上限。'],
  [152, null], // 大字：限速量的不是速度，是速度的影子
  // 怎么练（配乐回落段）
  [160, '想自己试试？照源码倒推四步：'],
  [164, '① 落地那一帧就起跳，躲开摩擦。'],
  [168, '② 松开前进键，只按侧移键。'],
  [172, '③ 视角跟着侧移的方向，一点点转。'],
  [176, '④ 左右交替，走出一条 S 形。'],
  [180, '前提是：那个游戏没给连跳加限速。'],
  [188, '引擎没看你跑多快，它只量了速度的——'],
  [192, null], // 第二个爆点「影子」
  // 结尾
  [200, '一道限速，只因为少量了一个方向，'],
  [204, '就变成了一门要练几百小时的技术。'],
  [208, '规则写在代码里，玩家在规则的缝里找路。'],
  [216, '这就是游戏机制最好玩的地方。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, PASS], // 3D：你跑到 320，对手从后面连跳追上来
  pass: [PASS, METER], // 对手一跃而过，甩开你
  meter: [METER, SPLIT], // 两块速度表：你 320 不动，他一直涨
  code: [SPLIT, fb(6)], // 源码卡片
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  friction: [fb(9), fb(11)], // 地面摩擦：速度曲线停在 320
  order: [fb(11), fb(14)], // 源码顺序：先起跳再摩擦，落地即跳
  nobrake: [fb(14), fb(16)], // 躲开刹车只是不减速
  cap: [fb(16), fb(19)], // 章节卡 + 空中限速 30 vs 地面 320
  shadow: [fb(19), fb(21)], // 投影：速度在想去方向上的影子
  right: [fb(21), fb(24)], // 直角：影子 0，补 30
  hypo: [fb(24), fb(28)], // 章节卡 + 斜边 321.4、一帧一帧累加
  climb: [fb(28), fb(32)], // 速度曲线：1 秒 439、3 秒 610（示意）
  angle: [fb(32), fb(35)], // 章节卡 + 每帧转角：5.4° → 2.8°
  source: [fb(35), fb(37)], // Source 引擎几乎一字未改
  tf2: [fb(37), fb(38)], // 《军团要塞 2》的上限 1.2 倍
  shadowline: [fb(38), fb(40)], // 大字：限速量的是影子
  steps: [fb(40), fb(45)], // 章节卡 + 四步
  build: [fb(45), HIT2], // 回落段：俯视 S 形轨迹，收暗
  hit2: [HIT2, fb(50)], // 「影子」砸出
  path: [fb(50), fb(54)], // 暖色俯视：S 形轨迹越走越快
  hop: [fb(54), fb(56)], // 暖色 3D：你自己连跳起来
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（源代码原文，测试核对） ---------------- */

/** Quake（QW/client/pmove.c、QW/server/sv_phys.c） */
export const QUAKE_YEAR = 1996;
export const AIR_CAP = 30; // PM_AirAccelerate：if (wishspd > 30) wishspd = 30;
export const MAX_SPEED = 320; // sv_maxspeed
export const ACCELERATE = 10; // sv_accelerate（QuakeWorld 的 PM_AirAccelerate 用的就是它）
export const FRICTION = 4; // sv_friction
/** 卡片上展示的源码（原文节选，GPL） */
export const QUAKE_LINES = ['if (wishspd > 30)', '    wishspd = 30;', 'currentspeed = DotProduct (pmove.velocity, wishdir);', 'addspeed = wishspd - currentspeed;', 'if (addspeed <= 0)', '    return;', 'accelspeed = accel * wishspeed * frametime;'];
/** Source SDK 2013（gamemovement.h / gamemovement.cpp） */
export const SOURCE_CAP = 30; // virtual float GetAirSpeedCap( void ) { return 30.f; }
export const SOURCE_LINES = ['// Cap speed', 'if ( wishspd > GetAirSpeedCap() )', '    wishspd = GetAirSpeedCap();', '// Determine veer amount', 'currentspeed = mv->m_vecVelocity.Dot(wishdir);'];
/** 《军团要塞 2》（tf_gamemovement.cpp） */
export const TF2_FACTOR = 1.2; // #define BUNNYJUMP_MAX_SPEED_FACTOR 1.2f
export const TF2_COMMENT = 'Only allow bunny jumping up to 1.2x server / player maxspeed setting';

/** 推算（示意）：每秒 100 帧、每帧侧向补满 30 → v² 每帧 +30² */
export const DEMO_FPS = 100;
export const speedAfter = (sec: number) => Math.sqrt(MAX_SPEED ** 2 + AIR_CAP ** 2 * DEMO_FPS * sec);
export const turnDeg = (v: number) => (Math.atan(AIR_CAP / v) * 180) / Math.PI;
export const HYPO_1 = Math.round(Math.sqrt(MAX_SPEED ** 2 + AIR_CAP ** 2) * 10) / 10; // 321.4
export const V_1S = Math.round(speedAfter(1)); // 439
export const V_3S = Math.round(speedAfter(3)); // 610

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep37-bhop';
export const SFX: [string, number, number][] = [
  // 开场：对手连跳落地声 → 甩开 → 速度表 → 源码
  ...HOP_BEATS.map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  ['audio/sfx/whoosh.wav', PASS, 0.5],
  [`${A}/impact.wav`, PASS, 0.45],
  [`${A}/rewind.wav`, METER - 4, 0.45],
  ['audio/sfx/whoosh.wav', SPLIT, 0.45],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 刹车
  ['audio/sfx/whoosh.wav', fb(11), 0.35],
  [`${A}/tick.wav`, fbt(52), 0.5],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  // 影子
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  ['audio/sfx/whoosh.wav', fb(19), 0.35],
  [`${A}/impact.wav`, fbt(80), 0.45],
  ['audio/sfx/whoosh.wav', fb(21), 0.35],
  ['audio/sfx/ding.wav', fbt(92), 0.4],
  // 斜边
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/impact.wav`, fbt(124), 0.5],
  // 漏洞
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  ['audio/sfx/whoosh.wav', fb(35), 0.35],
  ['audio/sfx/whoosh.wav', fb(37), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 怎么练
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  ['audio/sfx/whoosh.wav', fb(50), 0.35],
  ...[217, 218, 219, 220, 221].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.45]),
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
