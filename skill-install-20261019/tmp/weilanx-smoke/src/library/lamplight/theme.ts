import type React from 'react';
import '../vox/theme';
import {clamp01} from '../anim';

/**
 * 灯火史话风：暖黑夜色 + 火光 + 米白象形小人，左上角宋体大字一句一句写出来讲故事。
 * 三种语义色只用在关键词和对应图形上：冷蓝 = 名词 / 律文 / 人名，朱红 = 惩罚 / 禁止，火金 = 火 / 光 / 数量。
 */
export const L = {
  night: '#0c0908', // 底色暖黑
  warm: '#2f241e', // 光晕中心
  sky: '#050709', // 夜空冷蓝黑
  ground: '#140f0c',
  ink: '#efe6d6', // 米白：正文、小人
  inkDim: 'rgba(239,230,214,0.55)', // 说明小字
  inkFaint: 'rgba(239,230,214,0.22)', // 网格、轮廓
  figure: '#e2d9c8', // 小人身体
  hat: '#3b322b', // 小帽（比夜色略亮，才看得见）
  blue: '#8fc3e8', // 冷蓝：名词、律文
  blueText: '#b9d7ee',
  red: '#e1684f', // 朱红：惩罚、禁止
  redDeep: '#c7402b',
  gold: '#edae50', // 火金：火、灯、数量
  goldHot: '#ffd98a',
  fire: '#ff8a2b',
  paper: '#b9a67c', // 纸卷
  paperLight: '#cbb98f',
  wood: '#5a3a20', // 木轴、门
  door: '#4a2216',
  seal: '#a8261b', // 印章
  terrain: '#2a2318',
};

/** 字体：叙述大字宋体 Black；标签、地名黑体 Heavy；纸卷竖排用宋体常规 */
export const LF = {
  serif: `'Songti SC', 'Noto Serif SC', 'STSong', serif`,
  sans: `'Vox Heavy', 'PingFang SC', 'Noto Sans SC', sans-serif`,
  label: `'PingFang SC', 'Noto Sans SC', sans-serif`,
  scroll: `'Kaiti SC', 'STKaiti', 'Songti SC', serif`,
};

export type MarkKind = 'blue' | 'red' | 'gold';
/** 关键词标记：【蓝】〖红〗〔金〕 */
export const MARK: Record<string, MarkKind> = {'【': 'blue', '〖': 'red', '〔': 'gold'};
export const MARK_CLOSE: Record<string, string> = {'【': '】', '〖': '〗', '〔': '〕'};
export const markColor = (k: MarkKind) => (k === 'blue' ? L.blueText : k === 'red' ? L.red : L.gold);
export const markLine = (k: MarkKind) => (k === 'blue' ? L.blue : k === 'red' ? L.red : L.gold);

const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);

/** 逐字收拢：单字从 1.25 倍、模糊 10px、灰色收到 1 倍清晰（dur 帧），v 为 0–1 */
export const charIn = (f: number, at: number, dur = 12) => {
  const v = easeOut3(clamp01((f - at) / dur));
  return {v, scale: 1.25 - 0.25 * v, blur: (1 - v) * 10, opacity: Math.min(1, v * 1.6)};
};

/** 淡入 + 轻模糊（这套风格里除文字外的元素都这样出场），可带淡出 */
export const fadeSoft = (f: number, at: number, dur = 16, out?: number, outDur = 14) => {
  const i = easeOut3(clamp01((f - at) / dur));
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / outDur);
  const v = i * o;
  return {v, opacity: v, filter: v >= 0.999 ? undefined : `blur(${(1 - v) * 6}px)`};
};

/** 数字滚动：从 from 滚到 to，先快后慢，返回整数 */
export const countTo = (f: number, at: number, dur: number, to: number, from = 0) => {
  const p = 1 - Math.pow(1 - clamp01((f - at) / Math.max(1, dur)), 2.2);
  return Math.round(from + (to - from) * p);
};

/** 千分位 */
export const commas = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** 叙述大字的投影：很淡的黑色阴影，让字浮在夜色上 */
export const textShadow = '0 3px 14px rgba(0,0,0,0.75)';

/** 火光发光（SVG / CSS filter 用） */
export const glow = (c: string, r = 18): React.CSSProperties => ({filter: `drop-shadow(0 0 ${r}px ${c})`});

/** 慢推：长镜头缓慢放大 */
export const push = (f: number, at: number, len: number, amount = 0.03) => 1 + amount * clamp01((f - at) / Math.max(1, len));
