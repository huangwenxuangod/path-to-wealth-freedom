import {describe, expect, it} from 'vitest';
import {stepGrid} from '../../src/library/blackgold/charts';
import {blurIn, drawP, vis} from '../../src/library/blackgold/theme';

describe('黑金光影风 blackgold', () => {
  it('模糊柔入：at 之前不可见，结束时完全清晰；淡出后归零', () => {
    expect(blurIn(0, 10).v).toBe(0);
    const done = blurIn(40, 10);
    expect(done.v).toBeCloseTo(1, 5);
    expect(done.filter).toBeUndefined();
    expect(blurIn(100, 10, 16, 60).v).toBe(0);
  });

  it('线条画出进度在 0–1 之间，缓出', () => {
    expect(drawP(0, 10)).toBe(0);
    expect(drawP(20, 10)).toBeCloseTo(1, 5);
    expect(drawP(15, 10, 10)).toBeGreaterThan(0.5); // 缓出：一半时间已经画过一半以上
  });

  it('场与场的可见度两头淡入淡出', () => {
    expect(vis(0, 0, 100)).toBe(0);
    expect(vis(50, 0, 100)).toBe(1);
    expect(vis(100, 0, 100)).toBe(0);
  });

  it('细胞网格：全合作保持全合作；一个背叛者被合作者包围时会扩散（诱惑够大）；演化是确定性的', () => {
    const cols = 7;
    const rows = 7;
    const all = Array.from({length: 49}, () => true);
    expect(stepGrid(all, cols, rows, 1.7).every(Boolean)).toBe(true);
    const one = all.slice();
    one[24] = false; // 正中间一个背叛者
    const next = stepGrid(one, cols, rows, 1.7);
    expect(next.filter((v) => !v).length).toBeGreaterThan(1);
    expect(stepGrid(one, cols, rows, 1.7)).toEqual(next);
  });
});
