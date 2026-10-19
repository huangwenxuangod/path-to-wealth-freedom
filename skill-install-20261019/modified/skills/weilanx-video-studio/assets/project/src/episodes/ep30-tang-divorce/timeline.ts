/**
 * ep30 古代女人不能离婚？（灯火史话风，无口播，约 2 分 18 秒，配乐 we-never 从第 0 秒开始）
 * 锚词「一别两宽」：出自敦煌放妻书 S.343v，今天还在被人用；第 48 小节（102.52 秒）配乐整段重新进来时砸出。
 * 回落段 11 下硬拍 = 放妻书 S.343v「一别两宽」之前的 11 个短句，一拍点亮一列。
 * 文案与出处见 materials/08-灯火史话风/01-唐朝放妻书/文案与卡点.md。
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

/** 开场两组四连重音（实测：0.44 / 3.09 / 4.16 / 4.69 秒，6.28 / 7.35 / 8.41 / 8.94 秒） */
export const OPEN_HITS_1 = [0, 5, 7, 8];
export const OPEN_HITS_2 = [11, 13, 15, 16];
/** 回落段 11 下硬拍，每下点亮放妻书的一列 */
export const RELAY_HITS = [165, 167, 168, 171, 173, 175, 176, 181, 183, 184, 187];

export const ANCHOR = '一别两宽';
export const TITLE = '古代女人\n不能离婚？';

/**
 * 叙述：[拍号, 文字, 是否另起一屏]。【】蓝 = 名词 / 制度，〖〗红 = 惩罚 / 禁止，〔〕金 = 数字 / 答案；
 * 每屏从「另起一屏」那句开始往下累加，换镜头时整屏换掉；null 表示这段是大字卡或纯画面，不走叙述。
 */
export const CUES: [number, string | null, boolean?][] = [
  // 开场：打掉误会
  [0, '你以为古代女人，', true],
  [4, '只能等着被丈夫〖休掉〗？'],
  [11, '唐朝的法律里，写着另一条路：', true],
  [13, '夫妻〔不相安谐〕，'],
  [20, '两个人过不下去，可以【好好分开】。', true],
  [24, '那这份「离婚协议」，写的是什么——', true],
  [32, null], // 标题卡
  // 第 1 章：七出，和它的限制
  [36, '先说丈夫能休妻的规矩：【七出】。', true],
  [44, '听上去，理由多得是。'],
  [48, '可唐律又补了一句：', true],
  [50, '妻子不到〔50 岁〕，不算无子。'],
  [56, '还有【三不去】：', true],
  [58, '守过公婆的丧、先贫后富、娘家没人。'],
  [60, '占了一条，就〖不许休〗。'],
  // 第 2 章：乱休妻要坐牢 → 和离
  [64, '乱休妻会怎样？', true],
  [68, '没犯七出就休，〖徒一年半〗。'],
  [72, '占了三不去还休，〖杖一百〗，'],
  [76, '还要把人〔送回来〕，婚照样算。'],
  [80, '而最体面的，是第三条路：', true],
  [85, '【和离】：两个人都愿意分开，'],
  [88, '谁也〔不犯罪〕。'],
  [92, '唐律原文只有两个字：〔不坐〕。'],
  // 第 3 章：怎么离 + 一条不平等的规矩
  [96, '离婚要写一份手书，叫【放妻书】。', true],
  [100, '两家父母、亲戚、邻居都要到场。'],
  [104, '不识字的，〔按手印〕为记。'],
  [108, '财产也说清：「三年衣粮」，不再计较。'],
  [112, '可要是妻子自己离家出走——', true],
  [117, null], // 大字「徒二年」
  [120, '走了还改嫁，〖徒三年〗。', true],
  [124, '分开，只能〔两个人一起〕说了算。'],
  // 第 4 章：敦煌藏经洞里的放妻书
  [128, '敦煌藏经洞，留下了〔11 件〕放妻书。', true],
  [133, '有的是样文，有的是真离了婚的。'],
  [136, '开头先讲道理：'],
  [144, '“若结缘不合，比是〖怨家〗。”', true],
  [148, '过不下去，就别再互相折磨。'],
  [152, '家产怎么分？', true],
  [156, '“妻不论三年柴饭，夫休说六载衣粮。”'],
  // 回落段：一拍点亮一列
  [160, '其中一件，结尾是这样写的：', true],
  [165, '既然两颗心不同，', true],
  [171, '就请来亲友，各走各的路。'],
  [175, '愿你重新梳好头发、画好眉，', true],
  [181, '再嫁一个好人家。'],
  [184, '解开怨，'],
  [187, '别再恨。'],
  [188, '最后八个字——', true],
  [192, null], // 第二个爆点「一别两宽」
  // 收束：重新定义「体面」
  [200, '这八个字，今天还在被人用。', true],
  [204, '很少有人知道，它出自一份〔离婚协议〕。'],
  [212, '当然，唐朝不是女人的天堂：', true],
  [216, '叫「放妻」，主动权多在丈夫手里。'],
  [220, '可它写下了一件事——'],
  [224, null], // 大字卡：体面，不是不分开，是分开以后，还祝你好
  [236, null], // 评论区问题
  [248, null], // 下期预告
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
/** 话说一半的两句（爆点前一句）：随收暗退场 */
export const HALF_BEATS = [24, 188];

/** 大字卡文案（不走叙述） */
export const FLIP_1 = '体面，不是不分开，';
export const FLIP_2 = '是分开以后，';
export const FLIP_WORD = '还祝你好';
export const ASK_LINE = ['如果分开，', '你想对 TA 说哪一句？'];
export const NEXT_TITLE = '「午时三刻斩首」\n是真的吗？';

/** 镜头：全部落在拍点上、首尾相接；换镜头就是硬切 */
export const SHOTS = {
  hook: [0, fbt(11)], // 灯下的女子，丈夫拿着休书进来；第 7 拍休书砸下、第 8 拍被划掉
  law: [fbt(11), fbt(20)], // 纸卷：夫妻不相安谐 / 而和离者 / 不坐，三声驿铃三列亮
  apart: [fbt(20), fbt(24)], // 两个人各提一盏灯往两边走
  question: [fbt(24), HIT], // 灯光往中间收，收暗
  title: [HIT, fb(9)], // 标题卡
  qichu: [fb(9), fb(12)], // 纸卷：七出
  wuzi: [fb(12), fb(14)], // 疏议：四十九以下无子，未合出之；50 岁
  sanbuqu: [fb(14), fb(16)], // 三不去三张卡
  punish: [fb(16), fb(20)], // 唐律纸卷：徒一年半 / 杖一百 / 追还合
  heli: [fb(20), fb(24)], // 和离：两个人、一个光圈分成两个；「和离者，不坐」
  procedure: [fb(24), fb(28)], // 写手书、亲邻到场、按手印、三年衣粮
  leave: [fb(28), fb(30)], // 妻子独自出走 → 第 117 拍「徒二年」
  remarry: [fb(30), fb(32)], // 徒三年；两个人重新并排
  dunhuang: [fb(32), fb(36)], // 地图上敦煌一点灯，11 件 = 9 件样文 + 2 件实例
  yuanjia: [fb(36), fb(38)], // 若结缘不合，比是怨家
  caichan: [fb(38), fb(40)], // 妻不论三年柴饭，夫休说六载衣粮
  relay: [fb(40), fbt(188)], // 长卷：11 下硬拍点亮 11 列
  build: [fbt(188), HIT2], // 最后八个字——收暗
  hit2: [HIT2, fb(50)], //「一别两宽 · 各生欢喜」
  today: [fb(50), fb(53)], // 两盏灯往两边飘
  honest: [fb(53), fb(56)], // 主动权多在丈夫手里
  flip: [fb(56), fb(59)], // 体面，不是不分开，是分开以后，还祝你好
  ask: [fb(59), fb(62)], // 评论区问题
  next: [fb(62), DURATION], // 下期预告
} as const;

/* ---------------- 片中的事实（出处见文案稿，测试核对） ---------------- */

/** 《唐律疏议》卷十四·户婚律 第 189 条疏议「依令」：七出 */
export const QICHU = ['无子', '淫泆', '不事舅姑', '口舌', '盗窃', '妒忌', '恶疾'];
/** 同条疏议：「妻年五十以上无子，聽立庶以長。即是四十九以下無子，未合出之」 */
export const WUZI_AGE = 50;
/** 同条疏议：三不去 */
export const SANBUQU = ['经持舅姑之丧', '娶时贱后贵', '有所受无所归'];
/** 第 189 条律文：无七出而出之，徒一年半；有三不去而出之，杖一百；追还合 */
export const XIU_NO_QICHU = '徒一年半';
export const XIU_SANBUQU_ZHANG = 100;
/** 第 190 条律文：和离者不坐；妻妾擅去者徒二年；因而改嫁者加二等（疏议：徒三年） */
export const LEAVE_YEARS = 2;
export const REMARRY_YEARS = 3;
/** 沙知《敦煌契约文书辑校》收放妻书 11 件：样文 9 件、实际文书 2 件（转引自中国社会科学网） */
export const FANGQI_COUNT = 11;
export const FANGQI_SAMPLES = 9;
export const FANGQI_ACTUAL = 2;
/** 放妻书 S.343v「一别两宽」之前的 11 个短句（网络录文，各本小有异文，取「美扫娥眉」） */
export const S343_COLS = ['既以二心不同', '难归一意', '快会及诸亲', '各还本道', '愿妻娘子相离之后', '重梳蝉鬓', '美扫娥眉', '巧逞窈窕之姿', '选聘高官之主', '解怨释结', '更莫相憎'];
export const S343_END = ['一别两宽', '各生欢喜'];
export const RELAY_AT = RELAY_HITS.map(fbt);

/* ---------------- 地图（程序地形，地图坐标 2600×1600；地点位置是示意） ---------------- */
export const PLACES = {
  dunhuang: [560, 520] as [number, number],
  changan: [1460, 980] as [number, number],
};

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep30-tang-divorce';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 开场：灯亮、休书砸下、划掉；纸卷三列亮
  s('impact', 0, 0.5),
  s('ignite', 0, 0.35),
  shared('paper', 5, 0.5),
  s('drum', 7, 0.6),
  s('impact', 8, 0.5),
  shared('paper', 11, 0.5),
  ...[13, 15, 16].map((b) => s('bell', b, 0.6)),
  shared('whoosh', 20, 0.35),
  ['audio/ep30-tang-divorce/riser.wav', fr(beatSec(32) - 2), 0.6],
  s('impact', 32, 0.7),
  // 第 1 章
  shared('paper', 36, 0.5),
  shared('whoosh', 48, 0.35),
  s('bell', 50, 0.5),
  s('drum', 56, 0.5),
  ...[58, 59, 60].map((b) => s('bell', b, 0.5)),
  // 第 2 章
  shared('paper', 64, 0.5),
  shared('stamp', 68, 0.6),
  shared('stamp', 72, 0.6),
  s('bell', 76, 0.45),
  s('ignite', 80, 0.45),
  s('bell', 85, 0.5),
  shared('whoosh', 88, 0.4),
  s('impact', 92, 0.4),
  // 第 3 章
  shared('paper', 96, 0.5),
  shared('whoosh', 100, 0.3),
  shared('stamp', 104, 0.75),
  s('bell', 108, 0.4),
  s('drum', 112, 0.5),
  s('impact', 117, 0.62),
  shared('stamp', 120, 0.5),
  s('bell', 124, 0.45),
  // 第 4 章
  s('ignite', 128, 0.5),
  shared('whoosh', 128, 0.35),
  shared('paper', 133, 0.45),
  shared('paper', 136, 0.45),
  s('drum', 144, 0.6),
  shared('whoosh', 148, 0.35),
  s('tick', 152, 0.45),
  shared('stamp', 156, 0.5),
  // 回落段：11 下硬拍，每下一声驿铃；最后一下压低防峰值
  shared('paper', 160, 0.5),
  ...RELAY_HITS.map((b) => s('bell', b, b === 187 ? 0.5 : 0.6)),
  ['audio/ep30-tang-divorce/riser.wav', fr(beatSec(192) - 2), 0.65],
  s('impact', 192, 0.66),
  // 收束
  s('bell', 200, 0.4),
  shared('paper', 204, 0.4),
  shared('whoosh', 212, 0.35),
  s('tick', 216, 0.45),
  s('impact', 224, 0.45),
  s('impact', 230, 0.55), // 「还祝你好」砸下
  s('bell', 236, 0.4),
  shared('whoosh', 248, 0.4),
];
