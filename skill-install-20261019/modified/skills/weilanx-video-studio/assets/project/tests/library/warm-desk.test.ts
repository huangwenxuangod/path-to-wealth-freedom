import {describe, expect, it} from 'vitest';
import {D, rise, slide, typeIn, wipe} from '../../src/library/warm-desk/theme';

describe('暖纸工作台风 warm-desk', () => {
  it('淡入上浮：出场前透明且在下方，结束时到位；out 之后淡出', () => {
    expect(rise(0, 10).opacity).toBe(0);
    expect(rise(18, 10, 8).opacity).toBeCloseTo(1, 5);
    expect(rise(18, 10, 8).transform).toBe('translateY(0px) scale(1)');
    expect(rise(40, 10, 8, 16, 30, 8).opacity).toBe(0);
  });
  it('平滑换位：起点、终点、单调', () => {
    expect(slide(0, 10, 100, 500)).toBe(100);
    expect(slide(30, 10, 100, 500, 12)).toBe(500);
    expect(slide(16, 10, 100, 500, 12)).toBeGreaterThan(slide(14, 10, 100, 500, 12));
  });
  it('逐字和高亮刷入按帧推进', () => {
    expect(typeIn(10, 10, 3, 2).opacity).toBe(0);
    expect(typeIn(30, 10, 3, 2).opacity).toBeCloseTo(1, 5);
    expect(wipe(0, 10)).toBe(0);
    expect(wipe(18, 10, 8)).toBeCloseTo(1, 5);
  });
  it('配色只有一种强调色', () => {
    expect(D.orange).toBe('#f15a35');
  });
});
