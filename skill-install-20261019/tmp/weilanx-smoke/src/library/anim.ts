export type Ease = (t: number) => number;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const linear: Ease = (t) => t;
export const easeInOut: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut: Ease = (t) => 1 - Math.pow(1 - t, 3);
export const easeIn: Ease = (t) => t * t * t;
export const easeOutBack: Ease = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** 过冲回弹，适合「啪」地弹出 */
export const easeOutElastic: Ease = (t) =>
  t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;

/** frame 在 [start, start+dur] 内的进度，套上 ease */
export const prog = (frame: number, start: number, dur: number, ease: Ease = linear) =>
  ease(clamp01((frame - start) / dur));

/** 分段关键帧插值，两端保持首尾值 */
export const keyframes = (frame: number, ks: [number, number][], ease: Ease = easeInOut) => {
  if (frame <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [f1, v1] = ks[i];
    if (frame <= f1) {
      const [f0, v0] = ks[i - 1];
      return lerp(v0, v1, ease((frame - f0) / (f1 - f0)));
    }
  }
  return ks[ks.length - 1][1];
};

/** 确定性伪随机，0..1 */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** 手绘感的轻微抖动，按 4fps 跳变（像逐格动画） */
export const boil = (frame: number, seed: number, amp = 1) => {
  const step = Math.floor(frame / 7.5);
  return (rand(step * 31 + seed) - 0.5) * 2 * amp;
};

/** 伸手动画的伸出程度：a 帧开始伸出，b 帧开始收回，各 8 帧 */
export const reach = (f: number, a: number, b: number) => keyframes(f, [[a, 0], [a + 8, 1], [b, 1], [b + 8, 0]]);
