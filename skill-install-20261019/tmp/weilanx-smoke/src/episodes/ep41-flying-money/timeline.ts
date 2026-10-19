/**
 * ep41 唐朝人，已经在异地转账了（灯火史话风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 唐朝商人在长安把铜钱交给家乡的进奏院，拿一张券空手回家、合券取钱，号「飞钱」；朝廷先禁、元和七年三司亲自办「便换」；
 * 宋朝开宝三年置便钱务，诸州见券当日给付；四川人干脆把纸当钱花——交子（《宋史》：交子之法，盖有取于唐之飞钱）。
 * 回落段 11 下硬拍 = 开封交钱，一张张券飞向 11 座州城（地点示意）；102.52 秒砸出锚词「交子」，结尾落到「信用」。
 * 文案与出处见 materials/08-灯火史话风/03-唐朝飞钱/文案与卡点.md。
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

/** 开场两组四连重音（实测）：第一组手机亮起 → 第 7 拍划掉、第 8 拍铜钱砸下；第二组一贯贯钱压上扁担 */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍：开封交钱，第 k 下一张券飞到第 k 座州城 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];

export const ANCHOR = '交子';
export const TITLE = '唐朝人\n已经在异地转账了';

/**
 * 叙述：[拍号, 文字, 是否另起一屏]。【】蓝 = 名词 / 制度，〖〗红 = 禁令 / 惩罚，〔〕金 = 数字 / 答案；
 * null 表示这段是大字卡或纯画面，不走叙述。
 */
export const CUES: [number, string | null, boolean?][] = [
  // 开场
  [0, '你以为异地转账，', true],
  [4, '是有了银行、有了手机才有的？'],
  [11, '一千二百年前的长安，', true],
  [13, '商人卖完货，赚了一大堆〔铜钱〕。'],
  [20, '可关口，〖连一枚钱都不许带出去〗。'],
  [24, '那钱，要怎么带回家——', true],
  [32, null], // 标题卡
  // 第 1 章：钱太重、带不走
  [36, '《唐会要》记：开元通宝，', true],
  [40, '〔一千文，重六斤四两〕。'],
  [44, '赚一百贯，就是〔六百二十五斤〕铜。', true],
  [48, '更麻烦的是，朝廷正闹【钱荒】，', true],
  [52, '各州县〖禁钱出境〗，'],
  [56, '骆谷、散关，〖带一枚钱出关都不行〗。'],
  // 第 2 章：飞钱
  [64, '于是，商人想出一个办法：', true],
  [68, '把钱交给家乡驻京的【进奏院】，'],
  [72, '换一张〔券〕，空手上路。'],
  [76, '回到家乡，〔合券取钱〕。', true],
  [80, '钱，一文都没动。'],
  [85, '飞过去的，只是一张纸。'],
  [88, null], // 大字「飞钱」
  [92, '这就是一千二百年前的〔异地转账〕。', true],
  // 第 3 章：先禁，后官办
  [96, '可京兆尹裴武，要〖禁飞钱〗。', true],
  [100, '挨坊搜查，〖十人连保〗。'],
  [104, '结果，钱都锁在了家里，', true],
  [108, '市面上缺钱，东西越来越不值钱。'],
  [112, '〔元和七年〕，朝廷改了主意：', true],
  [117, '户部、度支、盐铁三司，'],
  [120, '亲自给商人办【便换】。'],
  // 第 4 章：宋朝便钱务
  [128, '到了宋朝，干脆开了官办「汇款所」。', true],
  [133, '开宝三年，设【便钱务】。'],
  [136, '商人在京城交钱，领一张券，'],
  [144, '到了各州，〔当天就得给钱〕，', true],
  [148, '晚给的官员，〖要受罚〗。'],
  [152, '到至道末年，汇进来〔一百七十多万贯〕。', true],
  [156, '天禧末，又多了〔一百一十三万贯〕。'],
  // 回落段：一张张券飞向四方
  [160, '一张张券，从京城飞向四方：', true],
  [165, '开封交钱，'],
  [171, '成都取，扬州取，杭州取……'],
  [181, '钱一文没动，账已经到了。'],
  [188, '可四川人，干脆把这张纸——', true],
  [192, null], // 第二个爆点「交子」
  // 收束：交子
  [200, '直接当钱花。它叫【交子】。', true],
  [204, '《宋史》写：交子之法，〔盖有取于唐之飞钱〕。'],
  [208, '蜀人用〖铁钱〗，太重，不便买卖，', true],
  [212, '于是一交一缗，三年一换。'],
  [216, '后来朝廷接手，设了【交子务】。', true],
  [224, null], // 大字卡：钱一文都没有飞，飞起来的是一张纸上的信用
  [236, null], // 评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [24, 188];

export const FLIP_1 = '钱，一文都没有飞，';
export const FLIP_2 = '飞起来的，是一张纸上的——';
export const FLIP_WORD = '信用';
export const ASK_LINE = ['你第一次用手机转账，', '转给了谁？'];
export const NEXT_TITLE = '宋朝人过年\n全城合法赌三天';

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, fbt(11)], // 手机转账界面；第 7 拍划掉、第 8 拍一枚铜钱砸下
  pole: [fbt(11), fbt(24)], // 商人挑扁担，四下各压上一贯钱；第 20 拍关口门关上
  question: [fbt(24), HIT], // 推近，收暗
  title: [HIT, fb(9)], // 标题卡
  scroll: [fb(9), fb(11)], // 《唐会要》纸卷：一千文重六斤四两
  weight: [fb(11), fb(12)], // 一百贯 = 625 斤
  ban: [fb(12), fb(16)], // 钱荒、禁钱出境、骆谷散关
  office: [fb(16), fb(19)], // 进奏院：交钱、领券、券撕成两半
  fly: [fb(19), fb(22)], // 地图：钱留在长安，半张券飞回扬州、合券
  feiqian: [fb(22), fb(24)], // 大字「飞钱」→ 异地转账
  raid: [fb(24), fb(28)], // 裴武禁飞钱：坊块一格格变红，后来全城熄灯
  sansi: [fb(28), fb(32)], // 元和七年：三司三张卡，「便换」盖下
  song: [fb(32), fb(36)], // 宋朝：便钱务柜台，交钱领券
  pay: [fb(36), fb(40)], // 当日给付、违者科罚、170 万贯 → +113 万贯
  relay: [fb(40), fbt(188)], // 回落段：开封 → 11 座州城
  build: [fbt(188), HIT2], // 收暗
  hit2: [HIT2, fb(50)], // 「交子」
  songshi: [fb(50), fb(52)], // 《宋史》纸卷：交子之法，盖有取于唐之飞钱
  iron: [fb(52), fb(54)], // 铁钱太重 → 一交一缗
  wu: [fb(54), fb(56)], // 益州交子务
  flip: [fb(56), fb(59)], // 钱一文都没有飞，飞起来的是信用
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（出处见文案稿，测试核对） ---------------- */

/** 《唐会要》卷八十九：开元通宝「十文重一两，一千文重六觔四两」；唐制一斤十六两 */
export const QIAN_PER_GUAN = 1000;
export const GUAN_JIN = 6;
export const GUAN_LIANG = 4;
export const LIANG_PER_JIN = 16;
export const guanWeightJin = (guan: number) => guan * (GUAN_JIN + GUAN_LIANG / LIANG_PER_JIN);
/** 片中「赚一百贯」 */
export const DEMO_GUAN = 100;
/** 《唐会要》卷八十九：元和七年五月，三司奏请许商人便换 */
export const YUANHE_YEAR = 812;
export const NOW_YEAR = 2026;
/** 《宋史·食货志下二》：开宝三年置便钱务；至道末商人入便钱一百七十余万贯，天禧末增一百一十三万贯 */
export const KAIBAO_YEAR = 970;
export const ZHIDAO_WAN = 170;
export const TIANXI_ADD_WAN = 113;
/** 《宋史·食货志下三》：交子一交一缗，以三年为一界而换之；富民十六户主之 */
export const JIAOZI_JIE_YEARS = 3;
export const JIAOZI_RICH_HOUSES = 16;

/* ---------------- 地图（程序地形，地图坐标 2600×1600；地点位置是示意） ---------------- */
export const PLACES = {
  changan: [1120, 900] as [number, number],
  yangzhou: [1940, 1040] as [number, number],
  kaifeng: [1500, 860] as [number, number],
};
/** 回落段 11 座州城（示意）：第 k 下硬拍券飞到第 k 座 */
export const CITIES: {name: string; x: number; y: number}[] = [
  {name: '成都', x: 760, y: 1220},
  {name: '扬州', x: 1940, y: 1040},
  {name: '杭州', x: 2040, y: 1260},
  {name: '洛阳', x: 1300, y: 880},
  {name: '太原', x: 1380, y: 560},
  {name: '江陵', x: 1300, y: 1180},
  {name: '大名', x: 1700, y: 620},
  {name: '广州', x: 1420, y: 1500},
  {name: '福州', x: 1960, y: 1440},
  {name: '潭州', x: 1360, y: 1340},
  {name: '秦州', x: 820, y: 860},
];

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep41-flying-money';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 开场
  s('bell', 0, 0.45),
  shared('click', 5, 0.5),
  shared('snip', 7, 0.5),
  s('impact', 8, 0.5),
  ...OPEN_HITS_2.map((b) => s('clink', b, 0.6)),
  s('drum', 20, 0.55),
  shared('whoosh', 24, 0.35),
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  s('impact', 32, 0.7),
  // 第 1 章
  shared('paper', 36, 0.5),
  s('bell', 40, 0.5),
  s('clink', 44, 0.55),
  s('drum', 48, 0.45),
  shared('stamp', 52, 0.45),
  s('drum', 56, 0.55),
  // 第 2 章
  shared('whoosh', 64, 0.3),
  s('clink', 68, 0.5),
  shared('snip', 72, 0.5),
  shared('whoosh', 74, 0.35),
  s('bell', 76, 0.5),
  s('clink', 80, 0.4),
  s('impact', 88, 0.6),
  s('bell', 92, 0.4),
  // 第 3 章
  s('drum', 96, 0.5),
  ...[100, 101, 102, 103].map((b) => shared('stamp', b, 0.35)),
  s('bell', 112, 0.45),
  ...[117, 118, 119].map((b) => shared('stamp', b, 0.4)),
  s('impact', 120, 0.45),
  // 第 4 章
  s('drum', 128, 0.55),
  shared('paper', 133, 0.45),
  s('clink', 136, 0.5),
  s('bell', 144, 0.5),
  s('drum', 148, 0.5),
  s('clink', 152, 0.5),
  s('bell', 156, 0.45),
  // 回落段：11 下硬拍，每下一声纸飞 + 驿铃；最后一下压低
  shared('whoosh', 160, 0.3),
  ...RELAY_HITS.flatMap((b) => [shared('whoosh', b, 0.3), s('bell', b, b === 187 ? 0.3 : 0.4)]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  s('impact', 192, 0.66),
  // 收束
  shared('paper', 204, 0.45),
  s('clink', 208, 0.5),
  shared('stamp', 212, 0.45),
  s('drum', 216, 0.5),
  s('impact', 224, 0.45),
  s('impact', 230, 0.55),
  s('clink', 236, 0.4),
  shared('whoosh', 248, 0.4),
];
