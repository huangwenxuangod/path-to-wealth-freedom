import type React from 'react';
import '../vox/theme';
import {clamp01, easeOut, easeOutBack} from '../anim';

/**
 * 网点档案风：米白旧纸 / 藏青夜色 + 渐变网点 + 粗宋错版大字，把一件小事当案件来审。
 * 只用五色：藏青墨（字和描边）、钴蓝、粉红（错版投影、印章）、明黄、橙。
 */
export const H = {
  paper: '#ece5d3', // 纸面
  paperDark: '#d9d1bd', // 折痕、旧纸暗部
  paperLight: '#f6f1e4', // 卡片白
  night: '#1e2547', // 夜色
  nightDeep: '#151b36',
  ink: '#1c2340', // 藏青墨：字、描边、标签底
  inkSoft: '#4a4f66',
  rule: '#8d8a86', // 身高尺横线、刻度
  blue: '#2f4fc8',
  blueDeep: '#2338a0',
  pink: '#ec5077',
  red: '#e0405a', // 印章红
  yellow: '#f2b62f',
  orange: '#e8873a',
  orangeDeep: '#c96a25',
};

/** 字体：粗宋大字、圆胖西文数字、等宽编号、黑体 Heavy 字幕 */
export const HF = {
  serif: `'Songti SC', 'Noto Serif SC', 'STSong', serif`,
  round: `'Arial Rounded MT Bold', 'Vox Heavy', sans-serif`,
  mono: `'Menlo', 'SF Mono', monospace`,
  sans: `'Vox Heavy', 'PingFang SC', sans-serif`,
  latinSerif: `'Vox Playfair', 'Songti SC', serif`,
};

/** 错版投影：往右下偏一个色版，像套印没对准（纸面用粉红，夜色用藏青） */
export const misprint = (color: string = H.pink, d = 6) => `${d}px ${d}px 0 ${color}`;

/** 圆胖字加粗：Arial Rounded 本身不够胖，用同色描边撑开 */
export const chunky = (color: string, w = 6): React.CSSProperties => ({
  color,
  WebkitTextStroke: `${w}px ${color}`,
  paintOrder: 'stroke fill',
});

/** 弹入：从 from 倍 easeOutBack 弹到 1，dur 帧完成；返回缩放和透明度 */
export const popScale = (f: number, at: number, dur = 6, from = 0.3) => {
  const p = clamp01((f - at) / dur);
  return {s: f < at ? 0 : from + (1 - from) * easeOutBack(p), o: clamp01((f - at) / 2), p};
};

/** 砸下：从 1.7 倍半透明砸到 1（印章、宣判），落定后 hit 帧内画面轻抖 */
export const slamScale = (f: number, at: number, dur = 5) => {
  const p = clamp01((f - at) / dur);
  const e = p * p;
  return {s: f < at ? 0 : 1.7 - 0.7 * e, o: f < at ? 0 : 0.35 + 0.65 * e, landed: f >= at + dur};
};

/** 落定瞬间的画面抖动（px），挂在整场的 transform 上 */
export const shake = (f: number, at: number, amp = 10, len = 8) => {
  const t = f - at;
  if (t < 0 || t > len) return {x: 0, y: 0};
  const k = (1 - t / len) * amp;
  return {x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.3) * k * 0.6};
};

/** 落下：从上方 dist px 落下，带一点回弹和旋转回正（证据卡、标签） */
export const dropIn = (f: number, at: number, dur = 9, dist = 140) => {
  const p = clamp01((f - at) / dur);
  return {y: -dist * (1 - easeOutBack(p)), o: clamp01((f - at) / 3), p, rot: (1 - easeOut(p)) * 12};
};
