import type React from 'react';
import '../vox/theme';
import {clamp01} from '../anim';

/**
 * 黑金光影风：近黑底 + 暖色烟雾，一切都在发光。像在暗房里做实验：金粒子聚成标题，霓虹细线画出模型，聚光灯打在发光的小人身上。
 * 三种语义色固定：青 = 合作 / 更好 / 本可以，珊瑚红 = 背叛 / 均衡 / 陷阱，金 = 连接、箭头、数字。
 */
export const B = {
  bg: '#050302', // 近黑
  smoke: 'rgba(120,86,56,', // 烟雾（拼透明度用）
  smokeRed: 'rgba(130,34,28,', // 红烟雾
  ink: '#fffaf0', // 米白正文
  inkDim: 'rgba(255,250,240,0.62)',
  inkFaint: 'rgba(255,250,240,0.28)',
  gold: '#edd287', // 箭头、数字、标题
  goldWarm: '#e5c991',
  goldDeep: '#8a6a32',
  goldLine: 'rgba(229,201,145,0.45)', // 细金线
  cyan: '#6fe0d2', // 合作 / 更好
  cyanDeep: '#2f8a80',
  red: '#ff7a63', // 背叛 / 均衡
  redDeep: '#a83a2c',
  cellRed: '#6e2420', // 细胞网格里的背叛者
  cellTeal: '#2c7d74', // 细胞网格里的合作者
};

/** 字体：中文宋体 Black；英文小标和数字 Garamond（素材库已带）；英文字幕用斜体 */
export const BF = {
  cn: `'Songti SC', 'Noto Serif SC', 'STSong', serif`,
  latin: `'Vox Garamond', 'Georgia', serif`,
  latinBold: `'Vox Garamond SemiBold', 'Georgia', serif`,
};

/** 发光字：同色多层外发光，r 发光半径 */
export const glowText = (color: string = B.ink, r = 16, strength = 1): React.CSSProperties => ({
  color,
  textShadow: `0 0 ${r * 0.35}px ${color}, 0 0 ${r}px ${color}${Math.round(0x99 * strength).toString(16).padStart(2, '0')}, 0 2px 14px rgba(0,0,0,0.9)`,
});

/** 霓虹描边（给 div 用）：细边 + 内外发光，on 0–1 亮度 */
export const neon = (color: string, on = 1): React.CSSProperties => ({
  border: `2px solid ${color}`,
  boxShadow: `0 0 ${14 * on}px ${color}, inset 0 0 ${10 * on}px ${color}55`,
  opacity: 0.35 + 0.65 * on,
});

const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);

/** 模糊柔入（可带淡出）：v 0–1，配 opacity 和 filter 用 */
export const blurIn = (f: number, at: number, dur = 16, out?: number, outDur = 12) => {
  const i = easeOut3(clamp01((f - at) / dur));
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / outDur);
  const v = i * o;
  return {v, opacity: v, filter: v >= 0.999 ? undefined : `blur(${(1 - v) * 10}px)`};
};

/** 线条画出进度（缓出），配 pathLength={1} + strokeDasharray 用 */
export const drawP = (f: number, at: number, dur = 10) => easeOut3(clamp01((f - at) / dur));

/** 两头淡入淡出的可见度（场与场之间暗场交叉淡化用） */
export const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));
