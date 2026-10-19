import {describe, expect, it} from 'vitest';
import {CUES, cf, ce, cw, cueAt, DURATION} from '../../src/episodes/ep01-agent/cues';

describe('cues', () => {
  it('converts cue n (1-based) to frames', () => {
    expect(CUES).toHaveLength(88);
    expect(cf(1)).toBe(Math.round(CUES[0].start * 30));
    expect(ce(88)).toBe(Math.round(CUES[87].end * 30));
    expect(DURATION).toBeGreaterThanOrEqual(ce(88));
  });
  it('estimates where a phrase starts inside a cue by character position', () => {
    // 第 28 句「创建文件夹读取视频」
    expect(cw(28, '创建文件夹')).toBe(cf(28));
    const mid = cw(28, '读取视频');
    expect(mid).toBeGreaterThan(cf(28));
    expect(mid).toBeLessThan(ce(28));
  });
  it('throws on a phrase that is not in the cue', () => {
    expect(() => cw(28, '不存在')).toThrow();
  });
  it('finds the active cue for a frame', () => {
    expect(cueAt(cf(10) + 2)?.i).toBe(10);
    expect(cueAt(0)).toBeNull();
  });
});
