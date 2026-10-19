import {describe, expect, it} from 'vitest';
import {keyframes, prog, rand} from '../../src/library/anim';
import {timeToX, T} from '../../src/episodes/ep00-demo/lib/timeline';

describe('anim', () => {
  it('prog clamps before start and after end', () => {
    expect(prog(0, 10, 10)).toBe(0);
    expect(prog(25, 10, 10)).toBe(1);
    expect(prog(15, 10, 10)).toBeCloseTo(0.5);
  });
  it('keyframes hits exact values at nodes and holds at ends', () => {
    const k: [number, number][] = [[0, 0], [10, 100], [20, 50]];
    expect(keyframes(-5, k)).toBe(0);
    expect(keyframes(10, k)).toBe(100);
    expect(keyframes(20, k)).toBe(50);
    expect(keyframes(99, k)).toBe(50);
    expect(keyframes(5, k)).toBeCloseTo(50);
  });
  it('rand is deterministic and in range', () => {
    expect(rand(42)).toBe(rand(42));
    expect(rand(1)).not.toBe(rand(2));
    for (let i = 0; i < 50; i++) {
      expect(rand(i)).toBeGreaterThanOrEqual(0);
      expect(rand(i)).toBeLessThan(1);
    }
  });
});

describe('timeline', () => {
  it('maps seconds to timeline pixels', () => {
    expect(timeToX(0)).toBe(150);
    expect(timeToX(2)).toBe(360);
  });
  it('uses frame numbers', () => {
    expect(T.snip).toBe(150);
  });
});
