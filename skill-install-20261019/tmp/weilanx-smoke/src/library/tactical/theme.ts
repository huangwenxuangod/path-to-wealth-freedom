import type React from 'react';
import '../vox/theme';
import {clamp01, easeOut} from '../anim';

/**
 * 战术屏科普风：深蓝黑的游戏 HUD 屏幕 + 低多边形射击场 + 发光图表，用科学模型拆 FPS 里的挫败感。
 * 颜色有固定含义：青 = 你 / 正确 / 主线，红 = 敌人 / 失误，橙 = 高手 / 答案 / 以前，绿 = 变好。
 */
export const T = {
  bg: '#050b14', // 底色
  bg2: '#0b1323', // 中心稍亮
  panel: '#101a28', // 面板
  grid: 'rgba(120,170,200,0.06)', // 背景网格
  line: 'rgba(66,198,223,0.35)', // 细线
  faint: 'rgba(200,215,225,0.18)', // 坐标轴、刻度
  white: '#eef3f6',
  text: '#c9d2d8',
  gray: '#7f8a93',
  dim: '#4a5560',
  cyan: '#42c6df',
  cyanDeep: '#1e526a',
  red: '#e5505b',
  redDeep: '#4b1821',
  orange: '#f0a045',
  green: '#3ecf8e',
};

/** 字体：中文全用思源黑体 Heavy（素材库已带），编号 / 数字用等宽粗体 */
export const TF = {
  sans: `'Vox Heavy', 'PingFang SC', sans-serif`,
  mono: `'Menlo', 'SF Mono', monospace`,
};

/** 发光：文字用 textShadow，图形用 drop-shadow */
export const glow = (color: string, r = 14, a = 0.8): React.CSSProperties => ({textShadow: `0 0 ${r}px ${color}${Math.round(a * 255).toString(16).padStart(2, '0')}`});
export const glowF = (color: string, r = 6) => `drop-shadow(0 0 ${r}px ${color})`;

/** 逐字浮现：第 i 个字在 at + i * per 帧开始，dur 帧内从模糊 10px、透明、右移 12px 收到原位 */
export const typeChar = (f: number, at: number, i: number, per = 2, dur = 8) => {
  const p = easeOut(clamp01((f - at - i * per) / dur));
  return {opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateX(${(1 - p) * 12}px)`, p};
};

/** 描线进度：at 起 dur 帧画完（easeOut），配合 pathLength={1} + strokeDasharray */
export const drawLen = (f: number, at: number, dur = 24) => easeOut(clamp01((f - at) / dur));

/** 淡入淡出：at 起 dur 帧淡入，out 起 dur 帧淡出 */
export const fade = (f: number, at: number, dur = 10, out?: number, outDur = 8) => clamp01((f - at) / dur) * (out === undefined ? 1 : 1 - clamp01((f - out) / outDur));
