/**
 * ep28「八百里加急」到底有多快？（灯火史话风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「奇迹」：乾隆一道六百里加急 6 天到兰州，史学家说「当时属于奇迹」；第 48 小节（102.52 秒）配乐整段重新进来时砸出。
 * 所有时间挂在 we-never 的拍子上（实测）：开场两组四连重音（第 0/5/7/8 拍、第 11/13/15/16 拍），
 * 回落段 11 下硬拍（165·167·168／171·173·175·176／181·183·184／187）= 11 座驿站依次点亮。
 * 文案与出处见 materials/08-灯火史话风/00-八百里加急/文案与卡点.md。
 */
import {wiggle} from '../../library/lamplight/charts';

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

/** 开场两组四连重音（实测：0.44 / 3.09 / 4.16 / 4.69 秒，6.28 / 7.35 / 8.41 / 8.94 秒） */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍（实测比前后响 10–15 dB），每下点亮一座驿站，最后一下是兰州 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];

export const ANCHOR = '奇迹';
export const TITLE = '「八百里加急」\n到底有多快？';

/**
 * 叙述：[拍号, 文字, 是否另起一屏]。【】蓝 = 名词 / 制度，〖〗红 = 惩罚 / 死亡 / 极限，〔〕金 = 速度 / 数量 / 答案；
 * 每屏从「另起一屏」那句开始往下累加，换镜头时整屏换掉；null 表示这段是大字卡，不走叙述。
 */
export const CUES: [number, string | null, boolean?][] = [
  // 开场：先把误会打掉
  [0, '你以为〔八百里加急〕，', true],
  [4, '是一匹马，一天跑八百里？'],
  [7, '〖它会死在半路上〗。'],
  [11, '真正跑完八百里的，', true],
  [13, '是〔一整条路〕。'],
  [20, '【每三十里】，换一匹马、一个人。'],
  [24, '那它到底，能跑多快——', true],
  [32, null], // 标题卡
  // 第 1 章：驿站网（唐）
  [36, '唐朝把规矩写进了【唐六典】：', true],
  [40, '“〔凡三十里一驿〕。”'],
  [48, '全国的驿站，一共有——', true],
  [50, '〔1639〕座。'],
  [56, '人在驿站换，马在驿站换，', true],
  [60, '只有〔文书〕，一刻不停。'],
  // 第 2 章：唐朝跑多快 + 一个真实的例子
  [64, '唐朝的赦书，结尾常有一句：', true],
  [68, '“〔赦书日行五百里〕。”'],
  [72, '一昼夜五百里，白天黑夜不停。', true],
  [80, '唐朝人，真的跑出来过。', true],
  [85, '755 年，【安禄山】在范阳起兵。'],
  [88, '范阳离长安，〔2520 里〕。'],
  [92, '〖6 天〗后，玄宗确认了消息。'],
  // 第 3 章：跑慢了怎么办（唐律）
  [96, '跑慢了，后果写在【唐律】里：', true],
  [100, '“驿使稽程者，〖一日杖八十〗。”'],
  [104, '晚两天，罪加一等。'],
  [108, '最重，〖徒两年〗。'],
  [112, '要是误了军情，丢了城——', true],
  [117, null], // 大字「绞」
  [120, '所以驿卒，是在拿命赶路。', true],
  // 第 4 章：宋朝更快，清朝更狠
  [128, '宋朝，有了〔金字牌急脚递〕。', true],
  [133, '“光明眩目，过如飞电，'],
  [136, '望之者无不避路。”日行〔五百余里〕。'],
  [144, '到了清朝，规定分了档：', true],
  [148, '加急每天【300 里】，特急〖600 里〗。'],
  [152, '〖六百里加急〗，会跑死驿马。', true],
  [156, '贵州驿马的死亡额度：〖每年七成〗。'],
  // 回落段：摩斯电码式接力
  [160, '1791 年，乾隆发出一道〖六百里加急〗。', true],
  [165, '一站，换马。'],
  [171, '一站，换人。'],
  [180, '白天不停，夜里不停——', true],
  [187, '第 6 天，〔兰州〕接到了。'],
  [188, '史学家说，这在当时，是一个——', true],
  [192, null], // 第二个爆点「奇迹」
  // 收束：重新定义「奇迹」
  [200, '可奇迹，不是一匹快马。', true],
  [204, '是〔953〕座驿站、约〔5 万〕匹马，'],
  [208, '一起在跑。'],
  [212, '一百年后，【电报】来了。', true],
  [216, '1891 年，谕旨〔当天或第二天〕就到。'],
  [220, '驿站，一座一座〖熄了灯〗。', true],
  [224, null], // 大字：它没有消失，它变成了一句话：八百里加急
  [236, null], // 评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [24, 188];

/** 大字卡文案（不走叙述） */
export const FLIP_1 = '它没有消失，';
export const FLIP_2 = '它变成了一句话：';
export const FLIP_WORD = '八百里加急';
export const ASK_LINE = ['你等过最久的一封信，', '是多久？'];
export const NEXT_TITLE = '宋朝的消防站\n三百步一个';

/** 镜头：全部落在拍点上、首尾相接；换镜头就是硬切 */
export const SHOTS = {
  hook: [0, fbt(11)], // 夜路：驿马狂奔，800 里砸出，第 7、8 拍倒下
  road: [fbt(11), fbt(24)], // 地形图：一条路，三站三连亮，每三十里一站
  question: [fbt(24), HIT], // 镜头往路尽头推，收暗
  title: [HIT, fb(9)], // 标题卡
  liudian: [fb(9), fb(12)], // 纸卷：凡三十里一驿
  net: [fb(12), fb(14)], // 全国 1639 个光点
  swap: [fb(14), fb(16)], // 驿站交接：换人换马，文书不停
  sheshu: [fb(16), fb(18)], // 纸卷：赦书日行五百里
  dial: [fb(18), fb(20)], // 昼夜盘 + 路线
  anlushan: [fb(20), fb(24)], // 范阳 → 长安，6 天
  law: [fb(24), fb(28)], // 唐律纸卷：杖八十 → 徒两年
  hang: [fb(28), fb(30)], // 城变红熄灭 →「绞」
  night: [fb(30), fb(32)], // 举火把狂奔
  plaque: [fb(32), fb(36)], // 金字牌，过如飞电
  tiers: [fb(36), fb(38)], // 清朝档位：300 / 600
  quota: [fb(38), fb(40)], // 马倒下 → 十匹死七匹
  relay: [fb(40), fbt(188)], // 北京 → 兰州，11 下硬拍 11 站
  build: [fbt(188), HIT2], // 话说一半，收暗
  hit2: [HIT2, fb(50)], //「奇迹」
  whole: [fb(50), fb(53)], // 全国 953 座驿站一起亮
  wire: [fb(53), fb(55)], // 电报一线拉通
  dark: [fb(55), fb(56)], // 驿站逐个熄灯
  flip: [fb(56), fb(59)], // 它变成了一句话：八百里加急
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（出处见文案稿，测试核对） ---------------- */

/** 《唐六典》卷五·驾部郎中：凡三十里一驿；天下凡一千六百三十有九所 */
export const LI_PER_STATION = 30;
export const TANG_STATIONS = 1639;
/** 《唐大诏令集》赦文结尾套语：赦书日行五百里 */
export const SHESHU_LI = 500;
/** 《旧唐书·地理志》幽州：在京师东北二千五百二十里；《资治通鉴》卷 217：十一月甲子反于范阳，庚午上闻禄山定反 */
export const FANYANG_LI = 2520;
export const AN_DAYS = 6; // 甲子（干支第 1）→ 庚午（第 7）
/** 《唐律疏议》卷十·职制律「驿使稽程」：一日杖八十，二日加一等，罪止徒二年 */
export const LATE_1 = 80;
export const LATE_2 = 90;
export const LATE_MAX_YEARS = 2;
export const TANG_YEAR = 755;
/** 《梦溪笔谈》卷十一：金字牌急脚递日行五百余里 */
export const PLAQUE_LI = 500;
/** 茅海建（据乾隆朝《清会典》《清会典事例》）：加急日行三百里、特急六百里；贵州驿马年倒毙额度十分之七；约 953 处驿站、约 5 万匹马；1791 年六百里加急 6 天到兰州；1891 年谕旨当天或次日到 */
export const QING_FAST = 300;
export const QING_URGENT = 600;
export const GUIZHOU_QUOTA = 7; // 十分之七
export const QING_STATIONS = 953;
export const QING_HORSES = 50000;
export const QL_YEAR = 1791;
export const QL_DAYS = 6;
export const WIRE_YEAR = 1891;

/* ---------------- 地图（程序地形，地图坐标 2600×1600；地点位置是示意） ---------------- */

export const PLACES = {
  fanyang: [1880, 430] as [number, number], // 范阳 / 北京（同一带）
  changan: [1120, 900] as [number, number],
  lanzhou: [640, 760] as [number, number],
};
/** 开场那条「八百里」示意路 */
export const ROUTE_ROAD = wiggle(
  [
    [560, 940],
    [880, 760],
    [1260, 820],
    [1660, 660],
    [2040, 720],
  ],
  4,
  20,
);
/** 范阳 → 长安 */
export const ROUTE_AN = wiggle([PLACES.fanyang, [1700, 560], [1520, 720], [1340, 850], PLACES.changan], 2, 18);
/** 北京 → 兰州（1791 年六百里加急） */
export const ROUTE_QL = wiggle([PLACES.fanyang, [1660, 520], [1480, 660], [1300, 800], PLACES.changan, [920, 840], PLACES.lanzhou], 5, 16);
/** 接力链：起点 + 11 站，最后一站是兰州 */
export const RELAY_STOPS = [0, ...RELAY_HITS.map((_, i) => (i + 1) / RELAY_HITS.length)];
export const RELAY_AT = [fbt(160), ...RELAY_HITS.map(fbt)];

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep28-express-relay';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 开场：马蹄踩拍、数字砸出、倒下
  s('impact', 0, 0.55),
  ...[0, 1, 2, 3, 4, 5, 6].map((b) => s('hoof', b, b === 5 ? 0.6 : 0.42)),
  s('drum', 7, 0.6),
  s('impact', 8, 0.5),
  s('ignite', 11, 0.5),
  ...[13, 15, 16].map((b) => s('bell', b, 0.6)),
  shared('whoosh', 20, 0.35),
  ['audio/ep28-express-relay/riser.wav', fr(beatSec(32) - 2), 0.6],
  s('impact', 32, 0.7),
  // 第 1 章
  shared('paper', 36, 0.5),
  s('bell', 40, 0.35),
  shared('whoosh', 48, 0.35),
  s('bell', 50, 0.45),
  s('hoof', 56, 0.4),
  s('hoof', 58, 0.4),
  shared('whoosh', 60, 0.4),
  // 第 2 章
  shared('paper', 64, 0.5),
  s('bell', 68, 0.4),
  shared('whoosh', 72, 0.35),
  s('ignite', 80, 0.5),
  s('drum', 85, 0.45),
  shared('whoosh', 88, 0.35),
  s('impact', 92, 0.45),
  // 第 3 章
  shared('paper', 96, 0.5),
  shared('stamp', 100, 0.6),
  s('drum', 104, 0.45),
  shared('stamp', 108, 0.7),
  s('drum', 112, 0.5),
  s('impact', 117, 0.62),
  ...[120, 121, 122, 123, 124, 125, 126].map((b) => s('hoof', b, 0.4)),
  // 第 4 章
  s('bell', 128, 0.55),
  shared('whoosh', 128, 0.35),
  shared('whoosh', 133, 0.45),
  s('impact', 136, 0.4),
  s('drum', 144, 0.6),
  s('bell', 148, 0.4),
  s('impact', 152, 0.45),
  s('drum', 156, 0.4),
  // 回落段：11 下硬拍，每下一声驿铃 + 一声马蹄
  s('drum', 160, 0.5),
  // 最后一下（兰州）不加冲击：铃 + 蹄 + 配乐重音叠在一起已经接近 −1 dBFS
  ...RELAY_HITS.flatMap((b) => [s('bell', b, b === 187 ? 0.5 : 0.6), s('hoof', b, 0.3)]),
  ['audio/ep28-express-relay/riser.wav', fr(beatSec(192) - 2), 0.65],
  s('impact', 192, 0.66),
  // 收束
  s('bell', 204, 0.35),
  shared('whoosh', 208, 0.4),
  s('tick', 212, 0.5),
  shared('whoosh', 216, 0.4),
  s('impact', 224, 0.45),
  s('impact', 230, 0.55), // 「八百里加急」大字砸下
  s('bell', 236, 0.4),
  shared('whoosh', 248, 0.4),
];
