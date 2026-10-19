import {continueRender, delayRender, staticFile} from 'remotion';
import {clamp01, easeInOut, easeOut, easeOutBack} from '../anim';

/**
 * 暖纸工作台风：暖米色点阵纸当工作台，白色窗口卡片一层层摆上来，粗黑体标题 + 一块朱橙高亮，右下角像素吉祥物常驻。
 * 配色极克制：米色、白、墨黑，唯一的强调色是偏红的亮朱橙。
 */
export const D = {
  paper: '#f3efe7', // 纸面
  dot: 'rgba(120,105,85,0.22)', // 点阵
  card: '#ffffff',
  cardLine: '#ebe5db', // 卡片细边、分隔线
  ink: '#211d19', // 墨黑：标题、正文
  text: '#37322c',
  gray: '#8b857b', // 次要字
  faint: '#cdc6ba',
  orange: '#f15a35', // 唯一强调色：偏红的亮朱橙
  orangeDeep: '#d9432a',
  orangeSoft: '#ff8a5c', // 渐变亮端、光晕
  tint: '#fde5dc', // 浅橙：行高亮底
  green: '#5fa86a', // 打勾（少量）
  shadow: '0 22px 48px rgba(70,50,30,0.13), 0 3px 8px rgba(70,50,30,0.06)',
  glow: '0 14px 34px rgba(241,90,53,0.32)', // 橙色块的投影
};

/** 橙色渐变（左上亮、右下深）：大色块、实心胶囊用 */
export const OG = `linear-gradient(135deg, ${'#ff7448'} 0%, ${'#f15a35'} 55%, ${'#e2472c'} 100%)`;

/**
 * 字体：阿里巴巴普惠体 3.0（本机字体，免费商用），按字重注册成同一个家族 Desk Sans（500–900）；
 * 本机没装时 900 回落到仓库里的思源黑体 Heavy（public/fonts/vox/NotoSansSC-900.woff），其余回落苹方。
 */
const FACES: [string, string, boolean][] = [
  ['500', 'AlibabaPuHuiTi_3_65_Medium', false],
  ['600', 'AlibabaPuHuiTi_3_75_SemiBold', false],
  ['700', 'AlibabaPuHuiTi_3_85_Bold', false],
  ['800', 'AlibabaPuHuiTi_3_95_ExtraBold', false],
  ['900', 'AlibabaPuHuiTi_3_105_Heavy', true],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('load desk fonts');
  Promise.all(
    FACES.map(([weight, ps, fallback]) => {
      const src = `local('${ps}')` + (fallback ? `, url(${staticFile('fonts/vox/NotoSansSC-900.woff')})` : '');
      return new FontFace('Desk Sans', src, {weight})
        .load()
        .then((loaded) => document.fonts.add(loaded))
        .catch(() => undefined);
    }),
  ).finally(() => continueRender(handle));
}

/** 字体：标题（serif 这个键保留旧名，现在是粗黑体 900）、正文黑体、代码 Menlo */
export const DF = {
  serif: `'Desk Sans', 'PingFang SC', 'Hiragino Sans GB', sans-serif`,
  sans: `'Desk Sans', 'PingFang SC', 'Hiragino Sans GB', sans-serif`,
  mono: `'Menlo', 'SF Mono', monospace`,
};

/** 淡入上浮：at 起 dur 帧，从下方 dy 像素浮上来（轻微回弹 + 去模糊 + 由 0.96 放大到 1）；out 起淡出 */
export const rise = (f: number, at: number, dur = 12, dy = 22, out?: number, outDur = 8) => {
  const t = clamp01((f - at) / dur);
  const p = easeOut(t);
  const b = easeOutBack(t);
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / outDur);
  return {opacity: p * o, transform: `translateY(${(1 - b) * dy}px) scale(${0.96 + 0.04 * b})`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined, p: p * o};
};

/** 平滑换位：在 at 帧开始的 dur 帧内，从 a 插值到 b（像在桌上挪卡片） */
export const slide = (f: number, at: number, a: number, b: number, dur = 12) => a + (b - a) * easeInOut(clamp01((f - at) / dur));

/** 逐字：第 i 个字 at + i·per 帧起 8 帧内从下方升起（带轻微模糊和回弹） */
export const typeIn = (f: number, at: number, i: number, per = 2) => {
  const t = clamp01((f - at - i * per) / 8);
  const p = easeOut(t);
  return {opacity: p, filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined, transform: `translateY(${(1 - easeOutBack(t)) * 0.35}em)`};
};

/** 高亮块刷入进度：at 起 dur 帧从左往右 */
export const wipe = (f: number, at: number, dur = 9) => easeOut(clamp01((f - at) / dur));

/** 缓慢漂浮：返回 [dx, dy]，周期约 period 帧，振幅 amp 像素（背景装饰、卡片呼吸用） */
export const drift = (f: number, seed: number, amp = 8, period = 180): [number, number] => [Math.sin((f / period) * Math.PI * 2 + seed * 1.7) * amp, Math.cos((f / period) * Math.PI * 2 * 0.8 + seed * 2.3) * amp * 0.7];
