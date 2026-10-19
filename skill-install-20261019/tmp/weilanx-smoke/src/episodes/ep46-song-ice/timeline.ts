/**
 * ep46 宋朝人夏天，已经在喝冰饮了（灯火史话风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 没有冰箱，九百年前开封六月的街上摆满了冰雪、凉水。冰从哪来？《周礼》凌人：十二月进山斩冰、藏三倍（多的留给它化）；
 * 《唐六典》每年藏冰一千段（一块约 300 公斤）；宋朝开国第二年设藏冰署，籍田藏冰「有余，则贸钱」；
 * 六月青布伞下卖冰雪，旧宋门外两家全用银器；南宋杨万里「冰雪一窖活一家」；《武林旧事》凉水 17 种。
 * 回落段 11 下硬拍 = 凉水菜单一拍亮一种；102.52 秒砸出锚词「冬天」，结尾落到「半年」。
 * 文案与出处见 materials/08-灯火史话风/05-宋朝冰饮/文案与卡点.md。
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

/** 开场两组四连重音（实测）：第一组空碗 → 碗轻响 → 第 7 拍冰落进碗、第 8 拍白气腾起；第二组三把青布伞亮灯 + 「六月」 */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍：凉水菜单上第 k 下亮第 k 种 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];

export const ANCHOR = '冬天';
export const ANCHOR_SUB = '腊月斩冰 · 立春入井 · 六月开窖';
export const TITLE = '宋朝人夏天\n已经在喝冰饮了';

/**
 * 叙述：[拍号, 文字, 是否另起一屏]。【】蓝 = 名词 / 制度，〖〗红 = 极限 / 代价，〔〕金 = 数字 / 答案；
 * null 表示这段是大字卡或纯画面，不走叙述。
 */
export const CUES: [number, string | null, boolean?][] = [
  // 开场
  [0, '没有冰箱，没有电，', true],
  [4, '古人夏天，能喝上一口冰吗？'],
  [11, '九百年前的开封，六月——', true],
  [16, '街上摆满了〔冰雪〕〔凉水〕。'],
  [24, '可没有冰箱，这些冰是从哪来的——', true],
  [32, null], // 标题卡
  // 第 1 章：周礼凌人
  [36, '答案，藏在一个冬天里。', true],
  [40, '《周礼》里，专管冰的官叫【凌人】，', true],
  [44, '手下有〔80〕个干活的徒役。'],
  [48, '每年〖十二月〗，进山〔斩冰〕。', true],
  [52, '还要藏〔三倍〕：「三其凌」。'], // 画面：全屏「三」
  [56, '多藏的两份，是留给它〖化掉〗的。', true],
  [60, '到了夏天，王再把冰〔颁赐〕给群臣。', true],
  // 第 2 章：唐六典
  [64, '到了唐朝，写进了【唐六典】：', true],
  [68, '每年冬天，藏冰〔一千段〕。'],
  [72, '每段「方三尺，厚一尺五寸」。', true],
  [80, '一块约〔300 公斤〕，一千块约〔300 吨〕。'],
  [84, '从山谷里凿出来，〔立春前三天〕入冰井。', true],
  [92, '这时候，冰还轮不到街上。'],
  // 第 3 章：北宋，冰走上街
  [96, '宋朝开国第二年，设了【藏冰署】。', true],
  [104, '官府藏的冰和果蔬，用不完怎么办？', true],
  [108, '规矩写着：〔有余，则贸钱〕。'],
  [112, '六月的开封，〔青布伞〕下卖〔冰雪〕。', true],
  [120, '最火的两家在旧宋门外，〖全用银器〗。', true],
  // 第 4 章：南宋，冰成了生意
  [128, '南宋杨万里写：〔冰雪一窖活一家〕。', true],
  [133, '冬天藏一窖冰，夏天能养活一家人。'],
  [136, '「卖冰一声隔水来，行人未吃心眼开。」', true],
  [144, '冰，变成了〔一门生意〕。', true],
  [152, '临安城的凉水，菜单上写了〔17 种〕。'],
  // 回落段：凉水菜单
  [160, '一样一样数：', true],
  [165, '甘豆汤、椰子酒、豆儿水，'],
  [171, '鹿梨浆、卤梅水、姜蜜水、木瓜汁，'],
  [181, '沉香水、荔枝膏水、梅花酒，'],
  [187, '雪泡缩脾饮……还有六种。'],
  [188, '夏天这一碗冰，其实是——', true],
  [192, null], // 第二个爆点「冬天」
  // 收束
  [200, '一碗冰，要在最冷的时候进山去凿，', true],
  [204, '藏进冰井，熬过整整一个春天。'],
  [212, '后来，有了机器制冰，有了冰箱。', true],
  [216, '一口口冰井，慢慢熄了灯。'],
  [224, null], // 大字卡：你手里的冰，几秒就好；宋朝那一碗，要等——半年
  [236, null], // 评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [24, 188];

export const FLIP_1 = '你手里的冰，几秒就好；';
export const FLIP_2 = '宋朝那一碗，要等——';
export const FLIP_WORD = '半年';
export const ASK_LINE = ['夏天，你最离不开', '哪一杯？'];
export const NEXT_TITLE = '古人上班\n也要打卡：「点卯」';

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, fbt(11)], // 黑暗里一只空碗；第 7 拍冰落进碗、第 8 拍白气
  street: [fbt(11), fbt(24)], // 开封街口三把青布伞依次亮灯，右上「六月」
  question: [fbt(24), HIT], // 推近，收暗
  title: [HIT, fb(9)], // 标题卡
  winter: [fb(9), fb(10)], // 雪夜山谷，冰面
  zhouli: [fb(10), fb(12)], // 《周礼》纸卷：凌人、徒八十人
  chop: [fb(12), fb(13)], // 小人举凿斩冰，右上「十二月」
  three: [fb(13), fb(14)], // 全屏「三」
  cellar: [fb(14), fb(15)], // 冰室剖面：三块冰，两块化掉（示意）
  grant: [fb(15), fb(16)], // 冰捧出冰室，颁给群臣
  tang: [fb(16), fb(18)], // 《唐六典》纸卷
  block: [fb(18), fb(21)], // 一块冰的尺寸标注 → 300 公斤 / 300 吨
  well: [fb(21), fb(24)], // 冰块一块块码进冰井，「立春前三天」
  song: [fb(24), fb(26)], // 朝代轴到宋，「藏冰署」
  songshi: [fb(26), fb(28)], // 《宋史》纸卷：有余，则贸钱
  stalls: [fb(28), fb(30)], // 一条街的青布伞摊一处处亮
  silver: [fb(30), fb(32)], // 旧宋门外，银碗盛冰
  yang: [fb(32), fb(34)], // 杨万里诗纸卷：冰雪一窖活一家
  seller: [fb(34), fb(36)], // 挑冰担的小人吆喝，声波隔水传来
  chain: [fb(36), fb(38)], // 冰窖 → 挑担 → 伞摊：一门生意
  menu: [fb(38), fbt(188)], // 凉水菜单 17 块水牌，回落段 11 下硬拍逐个亮
  build: [fbt(188), HIT2], // 收暗
  hit2: [HIT2, fb(50)], // 「冬天」
  back: [fb(50), fb(53)], // 回到冬天的山谷：凿冰、入井
  fridge: [fb(53), fb(56)], // 冰箱亮起，一口口冰井熄灯
  flip: [fb(56), fb(59)], // 你手里的冰，几秒就好；宋朝那一碗，要等——半年
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（出处见文案稿，测试核对） ---------------- */

/** 《周礼·天官》叙官：凌人「下士二人；府二人，史二人，胥八人，徒八十人」 */
export const LINGREN_TU = 80;
/** 《周礼·天官·凌人》：岁十有二月，令斩冰，三其凌；郑玄注「三其凌，三倍其冰」「为消释度也」 */
export const ZHAN_MONTH = 12;
export const SAN_QI = 3;
/** 《唐六典》卷十九 上林署：每岁藏一千段，方三尺，厚一尺五寸；先立春三日纳之冰井 */
export const TANG_DUAN = 1000;
export const DUAN_CHI = {side: 3, thick: 1.5};
export const LICHUN_BEFORE_DAYS = 3;
/** 唐尺约 29.6 厘米、冰密度 917 kg/m³（自己算，叙述写「约」） */
export const TANG_CHI_M = 0.296;
export const ICE_DENSITY = 917;
export const blockKg = () => DUAN_CHI.side * TANG_CHI_M * (DUAN_CHI.side * TANG_CHI_M) * (DUAN_CHI.thick * TANG_CHI_M) * ICE_DENSITY;
export const totalTons = () => (blockKg() * TANG_DUAN) / 1000;
/** 片中说的整数 */
export const SAY_KG = 300;
export const SAY_TONS = 300;
/** 《宋史》卷一百三：建隆二年置藏冰署；宋 960 年建国 */
export const SONG_FOUNDED = 960;
export const JIANLONG2 = 961;
/** 《东京梦华录》卷八：冰雪惟旧宋门外两家最盛，悉用银器 */
export const SILVER_SHOPS = 2;
/** 《东京梦华录》记北宋末开封（约 1100–1126），「九百年前」 */
export const MENGHUA_YEAR = 1120;
export const NOW_YEAR = 2026;
/** 腊月斩冰 → 六月卖冰：「要等半年」 */
export const WAIT_MONTHS = 6 + 12 - ZHAN_MONTH;

/** 《武林旧事》卷六「市食」凉水，原书顺序（沈香水写作沉香水；雪泡缩皮饮按宋刻作缩脾） */
export const LIANGSHUI = [
  '甘豆汤',
  '椰子酒',
  '豆儿水',
  '鹿梨浆',
  '卤梅水',
  '姜蜜水',
  '木瓜汁',
  '茶水',
  '沉香水',
  '荔枝膏水',
  '苦水',
  '金橘团',
  '雪泡缩脾饮',
  '梅花酒',
  '香薷饮',
  '五苓大顺散',
  '紫苏饮',
];
/** 回落段 11 下硬拍依次点亮的 11 种（叙述里念到的），剩下 6 种在第 187 拍之后一起亮 */
export const MENU_PICKS = ['甘豆汤', '椰子酒', '豆儿水', '鹿梨浆', '卤梅水', '姜蜜水', '木瓜汁', '沉香水', '荔枝膏水', '梅花酒', '雪泡缩脾饮'];

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep46-song-ice';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 开场
  s('clink', 0, 0.35),
  s('clink', 5, 0.45),
  s('impact', 7, 0.45),
  s('clink', 7, 0.6),
  shared('whoosh', 8, 0.4),
  ...OPEN_HITS_2.slice(0, 3).map((b) => s('ignite', b, 0.5)),
  s('bell', 16, 0.45),
  shared('whoosh', 24, 0.35),
  [`${A}/riser.wav`, fr(beatSec(32) - 2), 0.6],
  s('impact', 32, 0.7),
  // 第 1 章
  shared('whoosh', 36, 0.3),
  shared('paper', 40, 0.5),
  s('bell', 44, 0.45),
  s('drum', 48, 0.5),
  s('clink', 49, 0.45),
  s('clink', 50, 0.45),
  s('impact', 52, 0.6),
  s('drum', 56, 0.45),
  s('bell', 60, 0.45),
  // 第 2 章
  shared('paper', 64, 0.5),
  s('bell', 68, 0.45),
  s('clink', 72, 0.5),
  s('drum', 80, 0.55),
  s('bell', 82, 0.4),
  s('drum', 84, 0.45),
  shared('stamp', 88, 0.45),
  shared('whoosh', 92, 0.3),
  // 第 3 章
  s('drum', 96, 0.55),
  shared('stamp', 97, 0.4),
  shared('paper', 104, 0.45),
  s('bell', 108, 0.5),
  ...[112, 113, 114, 115].map((b) => s('ignite', b, 0.42)),
  s('impact', 120, 0.45),
  s('clink', 120, 0.55),
  // 第 4 章
  shared('paper', 128, 0.5),
  s('drum', 133, 0.45),
  s('bell', 136, 0.45),
  s('drum', 144, 0.55),
  s('bell', 145, 0.4),
  shared('paper', 152, 0.45),
  // 回落段：11 下硬拍，每下一声瓷碗轻碰 + 驿铃；最后一下压低
  shared('whoosh', 160, 0.3),
  ...RELAY_HITS.flatMap((b) => [s('clink', b, 0.45), s('bell', b, b === 187 ? 0.3 : 0.38)]),
  [`${A}/riser.wav`, fr(beatSec(192) - 2), 0.65],
  s('impact', 192, 0.66),
  // 收束
  s('drum', 200, 0.45),
  s('clink', 201, 0.4),
  s('drum', 204, 0.4),
  s('tick', 212, 0.5),
  s('drum', 216, 0.4),
  s('impact', 224, 0.45),
  s('impact', 230, 0.55),
  s('clink', 236, 0.4),
  shared('whoosh', 248, 0.4),
];
