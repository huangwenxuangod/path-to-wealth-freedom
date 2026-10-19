/**
 * ep40 跑着开枪，怎么总打不中？（战术屏科普风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 技巧：开枪前点一下反方向键急停。锚词「刹车」：准不准，比的是谁先把速度刹下来；松键只有摩擦在刹，点反方向键是摩擦 + 反向推力一起刹。
 * 第 8 小节（17.45 秒）标题砸出，第 48 小节（102.52 秒）砸出「刹车」。片尾停在评论区问题，不做下期预告。
 * 事实出处（都读过原文）：
 *   Riot《VALORANT Patch Notes 3.0》（2021-06-22）：Deadzone 27.5%（"the movement speed a player becomes inaccurate"）、
 *     步枪走路误差 2.0、跑动误差 5.0、"rewarding players who proactively stop before they shoot"；
 *   Valve《Source SDK 2013》src/game/shared/gamemovement.cpp 的 Friction、Accelerate，movevars_shared.cpp 的默认参数
 *     （sv_friction 4、sv_stopspeed 100、sv_accelerate 10、sv_maxspeed 320）。
 *   两种停法的时间是按源码逻辑、每秒 64 次自己模拟的（simStop），测试里复算；VALORANT 的门槛和 Source 的参数来自两个游戏，片中标「示意」。
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

/** 开场三次重音（第 7、10、15 拍）：边跑边开枪全飘、回放速度表、分屏（对面先停再打） */
export const SHOT = fbt(7);
export const REPLAY = fbt(10);
export const SPLIT = fbt(15);

export const SERIES = 'FPS 原理课';
export const EP = 'EP.08';
export const TOPIC = '急停';
export const TITLE = '跑着开枪，怎么总打不中？';
export const ANCHOR = '刹车';
export const TERM2 = '急停 · Counter-Strafe';
/** 大字卡（不走字幕） */
export const QUESTION_LINE = '同样一枪，\n为什么〔他准你不准〕？';
export const BIG_LINE = '急停不是按住反方向，\n是〔点一下〕';
export const FLIP_LINE = '你的枪法没问题，\n只是忘了〔踩刹车〕';
export const ASK_LINE = '你开枪前会急停吗？\n还是边跑边打？';

/** 章节：[起始小节, 名字]；HUD 右上角和底部进度条用 */
export const CHAPTERS: [number, string][] = [
  [0, '开场'],
  [9, '精度'],
  [16, '松手'],
  [24, '反向'],
  [32, '点一下'],
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
  [0, '你横着冲出掩体，看见敌人就开枪。'],
  [7, '子弹却〖全飘到了旁边〗。'],
  [10, '回放一看：开枪那一刻，你还在跑。'],
  [15, '而对面先停了一下，再开枪。'],
  [24, '同样一枪，为什么他准、你不准？'],
  [28, '差别藏在开枪前那零点几秒——'],
  [32, null], // 标题卡
  // 精度
  [36, '射击游戏里，子弹落在哪，看你跑多快。'],
  [40, 'Riot 给步枪定的误差：跑动 5.0。'],
  [44, '走路 2.0；站稳了，才最准。'],
  [48, '速度要降到最高速度的 27.5% 以下，才算站稳。'],
  [52, 'Riot 原话：奖励那些先停下再开枪的人。'],
  [56, '所以开枪前，先得把速度降下来。'],
  [60, '准不准，比的是谁先踩下【刹车】。'],
  // 松手
  [68, '大多数人的停法：松开方向键。'],
  [72, '松手之后，只剩摩擦力在帮你减速。'],
  [76, 'Source 引擎源码：每一帧扣掉一小截速度。'],
  [80, '跑得越快扣得越多，越慢扣得越少。'],
  [84, '按默认参数算：降到 27.5%，要 0.31 秒。'],
  [88, '完全停下，要 0.55 秒。'],
  [92, '这段时间里开的枪，〖全在乱飘〗。'],
  // 反向
  [100, '高手的停法：点一下反方向键。'],
  [104, '引擎把你按的方向，当成要加速的方向。'],
  [108, '于是摩擦力之外，又多了一股反向推力。'],
  [112, '默认参数下，每秒能削掉 3200 的速度。'],
  [116, '降到 27.5%，只要 0.06 秒。'],
  [120, '同样是停，〔快了 5 倍〕。'],
  [124, '对面早 0.25 秒站稳，就早 0.25 秒开准枪。'],
  // 点一下
  [132, '那反方向键按住不放，会怎样？'],
  [136, '速度过了零，你就开始往反方向跑。'],
  [140, '能开准枪的窗口，只有约 0.05 秒。'],
  [144, '所以急停是点一下，然后立刻松开。'],
  [148, '剩下那点速度，交给摩擦力收尾。'],
  [152, null], // 大字：急停不是按住反方向，是点一下
  // 练法（配乐回落段）
  [160, '照源码倒推，练急停分四步：'],
  [164, '① 开枪前，点一下反方向键。'],
  [168, '② 点完立刻松开，别按住。'],
  [172, '③ 停稳那一下，再按左键。'],
  [176, '④ 训练场左右来回，练到不用想。'],
  [180, '停得早一点，准得就早一点。'],
  [188, '准不准，不只看手，还看你会不会——'],
  [192, null], // 第二个爆点「刹车」
  // 结尾
  [200, '跑动开枪不准，是游戏故意设计的。'],
  [204, '它奖励的，是先停下来的人。'],
  [208, '而停得快不快，就藏在一个按键里。'],
  [216, '点一下反方向，〔这一枪就稳了〕。'],
  [224, null], // 情绪翻转大字
  [236, null], // 大字：评论区问题（放到片尾）
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [28, 188];

/** 镜头（全部硬切，按拍 / 小节对齐），首尾相接 */
export const SHOTS = {
  hook: [0, SHOT], // 3D：横移冲出，准星压着敌人
  shot: [SHOT, REPLAY], // 开枪：弹孔散成一大圈，MISS
  replay: [REPLAY, SPLIT], // 回放：开枪时的速度表，远高于门槛
  split: [SPLIT, fb(6)], // 分屏：你边跑边打（散） vs 对面先停再打（准）
  question: [fb(6), HIT], // 大字提问；DARK_FROM 起收暗
  title: [HIT, fb(9)], // 标题卡砸出
  spread: [fb(9), fb(12)], // 三个靶：站稳 / 走路 2.0 / 跑动 5.0
  deadzone: [fb(12), fb(13)], // 速度条：27.5% 以下才算站稳
  quote: [fb(13), fb(14)], // Riot 原话
  brake: [fb(14), fb(16)], // 速度曲线框：怎么最快掉进绿区 →「刹车」
  release: [fb(16), fb(20)], // 章节卡 + Friction 源码
  relcurve: [fb(20), fb(24)], // 松手的减速曲线：0.31 / 0.55 秒
  counter: [fb(24), fb(28)], // 章节卡 + Accelerate 源码（反向推力）
  compare: [fb(28), fb(32)], // 两条曲线对比：0.06 vs 0.31，快 5 倍
  hold: [fb(32), fb(38)], // 章节卡 + 按住不放：过零反向，窗口 0.05 秒
  bigline: [fb(38), fb(40)], // 大字：是点一下
  steps: [fb(40), fb(45)], // 章节卡 + 练法四步
  build: [fb(45), HIT2], // 回落段：3D 横移、收暗
  hit2: [HIT2, fb(50)], // 「刹车」砸出
  duel: [fb(50), fb(54)], // 暖色分屏：边跑边打 vs 点一下再打
  headshot: [fb(54), fb(56)], // 暖色 3D：横移 → 急停 → 爆头
  flipline: [fb(56), fb(59)], // 情绪翻转大字
  ask: [fb(59), DURATION], // 评论区问题，放到片尾
} as const;

/* ---------------- 片中的事实（原文，测试核对） ---------------- */

/** Riot《VALORANT Patch Notes 3.0》（2021-06-22） */
export const RIOT_YEAR = 2021;
export const DEADZONE = 0.275; // "Weapon Deadzones changed from 30% >>> 27.5%"
export const RIFLE_WALK = 2.0; // "Walking inaccuracy changed from 1.3 >>> 2.0"
export const RIFLE_RUN = 5.0; // "Running unchanged at 5.0"
export const RIOT_QUOTE = 'rewarding players who proactively stop before they shoot.';
export const DEADZONE_DEF = '"Deadzone" in VALORANT refers to the movement speed a player becomes inaccurate';

/** Valve《Source SDK 2013》movevars_shared.cpp 默认参数 */
export const SV_FRICTION = 4;
export const SV_STOPSPEED = 100;
export const SV_ACCELERATE = 10;
export const SV_MAXSPEED = 320;
/** 卡片上展示的源码（原文节选） */
export const FRICTION_LINES = ['// Bleed off some speed, but if we have less than the bleed', '//  threshold, bleed the threshold amount.', 'control = (speed < sv_stopspeed.GetFloat()) ? sv_stopspeed.GetFloat() : speed;', 'drop += control*friction*gpGlobals->frametime;', 'newspeed = speed - drop;'];
export const ACCEL_LINES = ['currentspeed = mv->m_vecVelocity.Dot(wishdir);', 'addspeed = wishspeed - currentspeed;', 'accelspeed = accel * gpGlobals->frametime * wishspeed * player->m_surfaceFriction;', 'if (accelspeed > addspeed)', '    accelspeed = addspeed;'];

/* ---------------- 自己算：按源码逻辑模拟两种停法（示意） ---------------- */

export const TICK = 64; // 每秒模拟 64 次（示意）
export const THRESH = DEADZONE * SV_MAXSPEED; // 88
export const PUSH = SV_ACCELERATE * SV_MAXSPEED; // 每秒 3200
/**
 * 从最高速度开始停：每 tick 先 Friction（control = max(速度, stopspeed)），再按住反方向键时 Accelerate（wishspeed = 320）。
 * hold：反方向键按住的 tick 数（0 = 只松手）；返回每个 tick 的速度（正 = 原方向，负 = 已经反着跑）
 */
export const simStop = (hold: number, n = 48): number[] => {
  const dt = 1 / TICK;
  let v = SV_MAXSPEED;
  const out = [v];
  for (let k = 0; k < n; k++) {
    const s = Math.abs(v);
    if (s >= 0.1) {
      const control = Math.max(s, SV_STOPSPEED);
      const ns = Math.max(0, s - control * SV_FRICTION * dt);
      v = (ns / s) * v;
    }
    if (k < hold) {
      const add = SV_MAXSPEED + v; // wishdir 反向：currentspeed = −v
      if (add > 0) v -= Math.min(SV_ACCELERATE * dt * SV_MAXSPEED, add);
    }
    out.push(v);
  }
  return out;
};
/** 第一次降到门槛以下的 tick */
export const ticksUnder = (vs: number[]) => vs.findIndex((v) => Math.abs(v) < THRESH);
export const RELEASE = simStop(0);
export const TAP_TICKS = 5; // 点一下：按 5 个 tick（约 0.08 秒）就松开
export const TAP = simStop(TAP_TICKS);
export const HOLD = simStop(48);
export const round2 = (x: number) => Math.round(x * 100) / 100;
export const RELEASE_UNDER = round2(ticksUnder(RELEASE) / TICK); // 0.31
export const RELEASE_STOP = round2(RELEASE.findIndex((v) => v === 0) / TICK); // 0.55
export const COUNTER_UNDER = round2(ticksUnder(TAP) / TICK); // 0.06
export const SPEEDUP = Math.round(RELEASE_UNDER / COUNTER_UNDER); // 5
export const GAIN = round2(RELEASE_UNDER - COUNTER_UNDER); // 0.25
/** 按住不放时，|速度| < 门槛的 tick 数 → 窗口秒数 */
export const HOLD_WINDOW = round2(HOLD.filter((v) => Math.abs(v) < THRESH).length / TICK); // 0.05

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep40-counter-strafe';
export const SFX: [string, number, number][] = [
  // 开场：横移 → 连开三枪全飘 → 回放 → 分屏
  [`${A}/gunshot.wav`, SHOT, 0.72],
  [`${A}/gunshot.wav`, SHOT + 4, 0.5],
  [`${A}/gunshot.wav`, SHOT + 8, 0.5],
  [`${A}/crack.wav`, SHOT + 2, 0.6],
  [`${A}/rewind.wav`, REPLAY - 4, 0.5],
  ['audio/sfx/whoosh.wav', REPLAY, 0.45],
  [`${A}/tick.wav`, REPLAY + 4, 0.5],
  [`${A}/gunshot.wav`, SPLIT + 10, 0.6],
  ['audio/sfx/ding.wav', SPLIT + 13, 0.4],
  [`${A}/tick.wav`, fbt(24), 0.5],
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  [`${A}/impact.wav`, HIT, 0.7],
  // 精度
  ...[36, 40, 44].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b) + 4, 0.45]),
  ['audio/sfx/whoosh.wav', fb(12), 0.35],
  ['audio/sfx/whoosh.wav', fb(13), 0.35],
  ['audio/sfx/whoosh.wav', fb(14), 0.35],
  [`${A}/impact.wav`, fbt(60), 0.6],
  // 松手
  ['audio/sfx/whoosh.wav', fb(16), 0.45],
  [`${A}/chapter.wav`, fb(16), 0.6],
  [`${A}/tick.wav`, fbt(76), 0.5],
  ['audio/sfx/whoosh.wav', fb(20), 0.35],
  [`${A}/tick.wav`, fbt(84), 0.5],
  [`${A}/tick.wav`, fbt(88), 0.5],
  // 反向
  ['audio/sfx/whoosh.wav', fb(24), 0.45],
  [`${A}/chapter.wav`, fb(24), 0.6],
  [`${A}/tick.wav`, fbt(108), 0.5],
  ['audio/sfx/whoosh.wav', fb(28), 0.35],
  [`${A}/tick.wav`, fbt(116), 0.5],
  [`${A}/impact.wav`, fbt(120), 0.6],
  // 点一下
  ['audio/sfx/whoosh.wav', fb(32), 0.45],
  [`${A}/chapter.wav`, fb(32), 0.6],
  [`${A}/crack.wav`, fbt(136), 0.45],
  ['audio/sfx/ding.wav', fbt(144), 0.4],
  ['audio/sfx/whoosh.wav', fb(38), 0.35],
  [`${A}/impact.wav`, fb(38), 0.5],
  // 练法
  ['audio/sfx/whoosh.wav', fb(40), 0.35],
  [`${A}/chapter.wav`, fb(40), 0.5],
  ...[164, 168, 172, 176].map((b): [string, number, number] => [`${A}/tick.wav`, fbt(b), 0.55]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  [`${A}/impact.wav`, HIT2, 0.7],
  // 结尾
  [`${A}/gunshot.wav`, fbt(202), 0.65],
  [`${A}/gunshot.wav`, fbt(206), 0.75],
  ['audio/sfx/ding.wav', fbt(206) + 3, 0.4],
  [`${A}/gunshot.wav`, fbt(219), 0.9],
  ['audio/sfx/ding.wav', fbt(219) + 3, 0.4],
  [`${A}/impact.wav`, fb(56), 0.5],
  [`${A}/tick.wav`, fb(59), 0.5],
];
