import {describe, expect, it} from 'vitest';
import {halftonePath} from '../../src/library/halftone/stage';
import {dropIn, popScale, slamScale} from '../../src/library/halftone/theme';

const dots = (d: string) => (d.match(/M/g) ?? []).length;

describe('网点档案风 halftone', () => {
  it('out 模式：只在半径内有点，中心的点最大', () => {
    const d = halftonePath({w: 400, h: 400, cx: 200, cy: 200, radius: 100, step: 20});
    expect(dots(d)).toBeGreaterThan(20);
    const radii = [...d.matchAll(/a([\d.]+) /g)].map((m) => Number(m[1]));
    expect(Math.max(...radii)).toBeGreaterThan(8);
    // 半径外不画点
    expect(dots(halftonePath({w: 400, h: 400, cx: -500, cy: -500, radius: 100, step: 20}))).toBe(0);
  });

  it('in 模式：中心空、四周有点', () => {
    const d = halftonePath({w: 400, h: 400, cx: 200, cy: 200, radius: 200, step: 20, mode: 'in', inner: 0.5});
    expect(d).not.toMatch(/M19\d\.\d 200/);
    expect(dots(d)).toBeGreaterThan(20);
  });

  it('弹入在 at 之前不可见，结束时回到 1 倍', () => {
    expect(popScale(10, 20).s).toBe(0);
    expect(popScale(26, 20, 6).s).toBeCloseTo(1, 5);
    // easeOutBack 中途会超过 1
    expect(Math.max(...[21, 22, 23, 24, 25].map((t) => popScale(t, 20, 6).s))).toBeGreaterThan(1);
  });

  it('印章从 1.7 倍砸到 1 倍', () => {
    expect(slamScale(30, 30).s).toBeCloseTo(1.7, 5);
    expect(slamScale(35, 30).s).toBeCloseTo(1, 5);
    expect(slamScale(35, 30).landed).toBe(true);
  });

  it('证据卡落下后停在原位', () => {
    expect(dropIn(100, 40).y).toBeCloseTo(0, 5);
    expect(dropIn(40, 40).y).toBeLessThan(-100);
  });
});
