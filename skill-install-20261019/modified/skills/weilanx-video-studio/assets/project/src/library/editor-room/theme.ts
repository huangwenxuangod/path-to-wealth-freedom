import type React from 'react';
import {clamp01, easeOut, easeOutBack} from '../anim';
// 字体复用暖纸工作台风注册的 Desk Sans（阿里巴巴普惠体 3.0，本机没装回落思源黑体 Heavy / 苹方）
import '../warm-desk/theme';

/**
 * 协作剪辑台风：把产品演示装进一个多人在线剪辑软件的界面里讲。
 * 90% 米白和白，墨黑只给大标题和深色胶囊；唯一的「重点」色是荧光黄绿，其余颜色属于五个小角色。
 */
export const E = {
  bg: '#f2efe6', // 底色：暖米白
  bgWarm: '#f6eedb', // 左下角暖光
  bgPink: '#f6e9ea', // 右上角粉光
  panel: '#fcfcfb', // 白色面板
  canvas: '#f6f4ee', // 画布底
  line: '#ebe6dc', // 细分隔线、轨道底
  track: '#f1eee7', // 时间轴轨道
  ink: '#1d1c1a', // 墨黑：大标题、深色胶囊
  text: '#3a3833',
  gray: '#8a8780', // 次要字
  faint: '#c9c4ba', // 刻度、占位
  bubble: '#f1efea', // 别人的聊天气泡
  hl: '#eef17a', // 荧光黄绿：唯一的重点色
  hlDeep: '#d9dc4a',
  gold: '#c9a24e', // 音乐波形
  motion: '#f8d6e6', // 动效轨色块
  keyframe: '#ef3f8f', // 关键帧菱形
  shadow: '0 1px 2px rgba(60,50,30,0.05), 0 8px 24px rgba(60,50,30,0.05)',
  cardShadow: '0 18px 40px rgba(60,50,30,0.12), 0 2px 6px rgba(60,50,30,0.06)',
};

/** 五个小角色的颜色（琥珀、品红、珊瑚红、天蓝、翠绿） */
export const CREW_COLORS = {amber: '#f5b62a', magenta: '#f0418f', coral: '#ef4b3f', sky: '#2f8ae5', mint: '#21b878'};

/** 字体：标题用 Desk Sans 900，英文 / 产品名优先几何无衬线，界面用 Desk Sans 500–700，时间码等宽 */
export const EF = {
  title: `'Avenir Next', 'Desk Sans', 'PingFang SC', sans-serif`,
  ui: `'Desk Sans', 'PingFang SC', 'Hiragino Sans GB', sans-serif`,
  mono: `'SF Mono', 'Menlo', monospace`,
};

/** 短语淡入上浮（实测约 6 帧）：从浅灰半透明到实色、上移 dy；返回 style */
export const pop = (f: number, at: number, dur = 6, dy = 10): React.CSSProperties => {
  const p = easeOut(clamp01((f - at) / dur));
  return {opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * dy}px)`, filter: p < 1 ? `grayscale(${1 - p})` : undefined};
};

/** 带回弹的弹出（胶囊、贴纸、按钮）：0 → 1 缩放 + 淡入 */
export const popIn = (f: number, at: number, dur = 9): React.CSSProperties => {
  const t = clamp01((f - at) / dur);
  if (t <= 0) return {opacity: 0, transform: 'scale(0.6)'};
  return {opacity: clamp01(t * 2), transform: `scale(${0.6 + 0.4 * easeOutBack(t)})`};
};

/** 荧光笔扫过的进度 0–1（实测约 6 帧，从左往右） */
export const hl = (f: number, at: number, dur = 6) => easeOut(clamp01((f - at) / dur));

/** 小角色原地上下浮动（像素），seed 让每个角色错开 */
export const bob = (f: number, seed: number, amp = 4) => Math.sin(f / 11 + seed * 1.9) * amp;

/** 两点之间平滑移动（光标飞行、片段拖动） */
export const glide = (f: number, at: number, dur: number, a: [number, number], b: [number, number]): [number, number] => {
  const t = clamp01((f - at) / dur);
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e];
};
