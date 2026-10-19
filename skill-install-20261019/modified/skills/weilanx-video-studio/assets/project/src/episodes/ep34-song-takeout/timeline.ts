/**
 * ep34 宋朝人，已经在点外卖了（灯火史话风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「银碗」：连穷人家叫的外卖，店家都用银器送上门、第二天才来取；第 48 小节（102.52 秒）配乐整段重新进来时砸出。
 * 回落段 11 下硬拍 = 跑堂上菜：前 3 下左手各叠一碗，后 8 下右臂从手腕叠到肩膀，叠满约 20 碗（《东京梦华录》卷四）。
 * 文案与出处见 materials/08-灯火史话风/02-宋朝外卖/文案与卡点.md。
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

/** 开场两组四连重音（实测） */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍：前 3 下左手各一碗，后 8 下右臂一共 20 碗 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];
export const LEFT_HITS = RELAY_HITS.slice(0, 3);
export const RIGHT_HITS = RELAY_HITS.slice(3);
/** 右臂每一下叠几只碗（合计 20） */
export const RIGHT_PER_HIT = [3, 3, 2, 2, 3, 3, 2, 2];

export const ANCHOR = '银碗';
export const TITLE = '宋朝人\n已经在点外卖了';

/**
 * 叙述：[拍号, 文字, 是否另起一屏]。【】蓝 = 名词 / 制度，〖〗红 = 惩罚 / 极限，〔〕金 = 数字 / 答案；
 * null 表示这段是大字卡或纯画面，不走叙述。
 */
export const CUES: [number, string | null, boolean?][] = [
  // 开场
  [0, '你以为外卖，', true],
  [4, '是手机时代才有的？'],
  [11, '九百年前的开封，', true],
  [13, '〔不开火〕的人家，'],
  [20, '已经满城都是了。'],
  [24, '他们怎么吃饭——', true],
  [32, null], // 标题卡
  // 第 1 章：不开火的城
  [36, '《东京梦华录》里写：', true],
  [40, '“往往只于市店旋置饮食，'],
  [44, '〔不置家蔬〕。”'],
  [48, '平常人家，不开火，', true],
  [52, '饿了，就去街上买。'],
  [56, '一份下酒小菜，'],
  [58, '〔不过十五文〕。'],
  // 第 2 章：点菜和跑腿
  [64, '进了食店，伙计挨个问：', true],
  [68, '要热的、冷的、温的、整的……'],
  [72, '人人点的都不一样。'],
  [80, '不想出门？有人替你跑腿。', true],
  [85, '这种人叫【闲汉】：'],
  [88, '替人买东西、〔取送钱物〕。'],
  [92, '在家想喝酒，就派人去店里【呼酒】。'],
  // 第 3 章：通宵的城，加班的人
  [96, '开封的夜市，〔三更〕才收摊，', true],
  [100, '〔五更〕又开张。'],
  [104, '大风大雪，照样有夜市。'],
  [112, '三更半夜，还有人提着茶瓶卖茶——', true],
  [117, null], // 大字「夜深方归」
  [120, '九百年前的人，也在加班。', true],
  // 第 4 章：皇宫也点外卖
  [128, '连皇宫，也点外卖。', true],
  [133, '元宵夜，宫里【宣唤市食】，'],
  [136, '摊贩卖了几倍的价，〔一夜暴富〕。'],
  [144, '后来北宋亡了，朝廷逃到杭州。', true],
  [148, '太上皇点了几碗街头小吃，', true],
  [152, '李婆婆杂菜羹、贺四酪面……'],
  [156, '他说：“〔此皆京师旧人〕。”'],
  // 回落段：跑堂上菜
  [160, '那时候的跑堂，是这样上菜的：', true],
  [165, '左手，三碗，', true],
  [171, '右臂从手腕到肩膀——'],
  [181, '〔约二十碗〕，'],
  [187, '〖一碗都不许错〗。'],
  [188, '可最让人吃惊的，是装外卖的碗——', true],
  [192, null], // 第二个爆点「银碗」
  // 收束
  [200, '穷人家叫一壶酒，', true],
  [204, '店家也用〔银器〕送上门，'],
  [208, '第二天，再来取走。'],
  [212, '大酒楼见小店打过三两次酒，', true],
  [216, '就敢借出〔三五百两〕银器。'],
  [224, null], // 大字卡：外卖送来的，从来不只是饭，是一座城的信任
  [236, null], // 评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [24, 188];

export const FLIP_1 = '外卖送来的，从来不只是饭，';
export const FLIP_2 = '是一座城的——';
export const FLIP_WORD = '信任';
export const ASK_LINE = ['你点过最难忘的一单外卖，', '是什么？'];
export const NEXT_TITLE = '宋朝人「聘」一只猫\n要送一包盐';

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, fbt(11)], // 夜里一扇门，提食盒的人；第 7 拍手机放大、第 8 拍被划掉
  city: [fbt(11), fbt(24)], // 城市方格，不开火的人家三连亮
  question: [fbt(24), HIT], // 镜头推近，收暗
  title: [HIT, fb(9)], // 标题卡
  scroll: [fb(9), fb(12)], // 纸卷：不置家蔬
  street: [fb(12), fb(16)], // 冷灶 → 去街上买；15 文
  order: [fb(16), fb(20)], // 伙计挨个问：热的冷的温的整的
  runner: [fb(20), fb(24)], // 闲汉跑腿，呼酒
  market: [fb(24), fb(28)], // 夜市三更五更，风雪
  tea: [fb(28), fb(30)], // 提茶瓶的人 → 第 117 拍「夜深方归」
  home: [fb(30), fb(32)], // 推门回家
  palace: [fb(32), fb(36)], // 元宵夜宫门，摊贩进宫
  south: [fb(36), fb(37)], // 地图：开封 → 杭州
  dishes: [fb(37), fb(40)], // 几碗街头小吃，「此皆京师旧人」
  waiter: [fb(40), fbt(188)], // 跑堂：11 下硬拍叠满 23 只碗
  build: [fbt(188), HIT2], // 收暗
  hit2: [HIT2, fb(50)], //「银碗」
  silver: [fb(50), fb(53)], // 穷人家门口，银碗送来、第二天取走
  lend: [fb(53), fb(56)], // 正店借银器给脚店
  flip: [fb(56), fb(59)], // 外卖送来的，从来不只是饭，是一座城的信任
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（出处见文案稿，测试核对） ---------------- */

/** 《东京梦华录》卷二·饮食果子：小酒店下酒「每分不過十五錢」 */
export const SIDE_DISH_WEN = 15;
/** 《东京梦华录》卷四·食店：行菜者「左手杈三碗、右臂自手至肩馱疊約二十碗」 */
export const LEFT_BOWLS = 3;
export const RIGHT_BOWLS = 20;
/** 《东京梦华录》卷三：夜市三更尽、五更又开张 */
export const NIGHT_CLOSE = '三更';
export const NIGHT_OPEN = '五更';
/** 《东京梦华录》卷五·民俗：正酒店户见脚店三两次打酒，便敢借与三五百两银器 */
export const LEND_SILVER = '三五百两';
/** 「九百年前」：《东京梦华录》记北宋末（约 1100–1126 年）的开封 */
export const BOOK_ERA = [1100, 1126];
export const NOW_YEAR = 2026;

/* ---------------- 地图（程序地形；地点位置是示意） ---------------- */
export const PLACES = {
  kaifeng: [1420, 600] as [number, number],
  hangzhou: [1820, 1120] as [number, number],
};
export const ROUTE_SOUTH = wiggle([PLACES.kaifeng, [1520, 780], [1640, 920], PLACES.hangzhou], 6, 16);

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep34-song-takeout';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 开场
  s('impact', 0, 0.5),
  shared('paper', 5, 0.45),
  s('drum', 7, 0.6),
  s('impact', 8, 0.5),
  s('ignite', 11, 0.45),
  ...[13, 15, 16].map((b) => s('bell', b, 0.6)),
  shared('whoosh', 20, 0.35),
  ['audio/ep34-song-takeout/riser.wav', fr(beatSec(32) - 2), 0.6],
  s('impact', 32, 0.7),
  // 第 1 章
  shared('paper', 36, 0.5),
  s('bell', 44, 0.45),
  shared('whoosh', 48, 0.3),
  s('clink', 52, 0.5),
  s('bell', 58, 0.5),
  // 第 2 章
  shared('paper', 64, 0.4),
  ...[68, 69, 70, 71].map((b) => s('clink', b, 0.4)),
  s('hoof', 80, 0.35),
  s('bell', 85, 0.5),
  shared('whoosh', 88, 0.35),
  s('clink', 92, 0.45),
  // 第 3 章
  s('ignite', 96, 0.45),
  s('bell', 100, 0.4),
  shared('whoosh', 104, 0.3),
  s('drum', 112, 0.45),
  s('impact', 117, 0.6),
  s('clink', 120, 0.4),
  // 第 4 章
  s('drum', 128, 0.55),
  shared('whoosh', 133, 0.35),
  s('bell', 136, 0.5),
  s('drum', 144, 0.6),
  ...[148, 150, 152].map((b) => s('clink', b, 0.45)),
  s('bell', 156, 0.5),
  // 回落段：11 下硬拍，每下一声瓷碗轻响 + 一声驿铃；最后一下压低
  shared('paper', 160, 0.4),
  ...RELAY_HITS.flatMap((b) => [s('clink', b, b === 187 ? 0.45 : 0.55), s('bell', b, b === 187 ? 0.3 : 0.35)]),
  ['audio/ep34-song-takeout/riser.wav', fr(beatSec(192) - 2), 0.65],
  s('impact', 192, 0.66),
  // 收束
  s('clink', 204, 0.5),
  shared('whoosh', 208, 0.3),
  s('bell', 216, 0.45),
  s('impact', 224, 0.45),
  s('impact', 230, 0.55),
  s('clink', 236, 0.4),
  shared('whoosh', 248, 0.4),
];
