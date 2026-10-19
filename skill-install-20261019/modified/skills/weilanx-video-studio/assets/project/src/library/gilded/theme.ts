import type React from 'react';
import '../vox/theme';
import {clamp01} from '../anim';

/**
 * 暗金文献风：近黑底、暖光晕、金色细线和衬线字，像一部在烛光下翻古籍的纪录片。
 * 配色只用四类：黑底、金（线和数字）、象牙白（正文和实物）、一种朱红（印章和「输的一方」）。
 */
export const G = {
  bg: '#030303', // 底色几乎纯黑
  bgWarm: '#1a120a', // 暖光晕中心
  bgCool: '#0b1220', // 冷光晕（安静、哲思段落）
  gold: '#d6b46a', // 主金：年份、线条
  goldBright: '#f3dca0', // 高光金
  goldDeep: '#8a6a32', // 暗金：坐标轴、次要线
  goldLine: 'rgba(214,180,106,0.55)', // 细线
  goldFaint: 'rgba(214,180,106,0.18)',
  ivory: '#efe6d2', // 正文、骰子、纸
  ivoryDim: 'rgba(239,230,210,0.62)',
  ivoryFaint: 'rgba(239,230,210,0.32)',
  parchment: '#e6d5ae',
  parchmentDark: '#b99a63',
  red: '#c8513c', // 朱红：印章、劣势一方
  redDeep: '#8f2f22',
  sealRed: '#b3362a',
};

/** 字体：西文和数字用 Garamond（素材库已带），中文用系统宋体 */
export const GF = {
  num: `'Vox Garamond', 'Songti SC', serif`,
  latin: `'Vox Garamond', 'Songti SC', serif`,
  latinBold: `'Vox Garamond SemiBold', 'Songti SC', serif`,
  latinItalic: `'Vox Playfair Italic', 'Vox Garamond', serif`,
  cn: `'Songti SC', 'Noto Serif SC', 'STSong', serif`,
};

/** 金色渐变文字（标题、大数字） */
export const goldText = (glow = 0.5): React.CSSProperties => ({
  background: `linear-gradient(180deg, ${G.goldBright} 0%, ${G.gold} 48%, #a27c3c 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: glow > 0 ? `drop-shadow(0 0 ${18 * glow}px rgba(230,180,90,${0.45 * glow}))` : undefined,
});

/** 小字号上的金色（字幕、引文里的重点词）：渐变更亮更窄，否则底部会发褐 */
export const goldTextLight = (glow = 0.35): React.CSSProperties => ({
  color: '#f6d98c',
  textShadow: `0 0 ${16 * glow}px rgba(240,196,100,${0.9 * glow}), 0 2px 12px rgba(0,0,0,0.9)`,
});

/** 柔入：透明度 + 模糊一起收拢，这套风格所有元素都这样出场 */
export const soft = (f: number, at: number, dur = 18, out?: number, outDur = 14) => {
  const i = clamp01((f - at) / dur);
  const e = 1 - Math.pow(1 - i, 3);
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / outDur);
  const v = e * o;
  return {opacity: v, filter: `blur(${(1 - v) * 10}px)`, v};
};

/** 慢推：整段镜头缓慢放大 2–4%，静止画面也在「呼吸」 */
export const drift = (f: number, at: number, len: number, amount = 0.03) => 1 + amount * clamp01((f - at) / Math.max(1, len));
