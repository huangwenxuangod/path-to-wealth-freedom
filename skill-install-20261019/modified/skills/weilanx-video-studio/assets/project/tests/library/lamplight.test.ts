import {describe, expect, it} from 'vitest';
import {routeAt, wiggle} from '../../src/library/lamplight/charts';
import {parseMarks} from '../../src/library/lamplight/stage';
import {charIn, commas, countTo, fadeSoft} from '../../src/library/lamplight/theme';

describe('灯火史话风 lamplight', () => {
  it('关键词标记拆成三种语义色', () => {
    expect(parseMarks('一个【驿卒】要〖连夜〗点〔四堆火〕。')).toEqual([
      {text: '一个'},
      {text: '驿卒', mark: 'blue'},
      {text: '要'},
      {text: '连夜', mark: 'red'},
      {text: '点'},
      {text: '四堆火', mark: 'gold'},
      {text: '。'},
    ]);
    // 没闭合的括号当普通字
    expect(parseMarks('【没闭合')).toEqual([{text: '【没闭合'}]);
  });

  it('逐字收拢：从 1.25 倍模糊收到 1 倍清晰', () => {
    expect(charIn(0, 10).v).toBe(0);
    expect(charIn(10, 10).scale).toBeCloseTo(1.25, 5);
    const done = charIn(30, 10);
    expect(done.scale).toBeCloseTo(1, 5);
    expect(done.blur).toBeCloseTo(0, 5);
  });

  it('数字滚动到点停住，千分位', () => {
    expect(countTo(0, 10, 40, 1000)).toBe(0);
    expect(countTo(50, 10, 40, 1000)).toBe(1000);
    expect(countTo(200, 10, 40, 1000)).toBe(1000);
    expect(commas(1000000)).toBe('1,000,000');
  });

  it('淡入淡出', () => {
    expect(fadeSoft(0, 10).v).toBe(0);
    expect(fadeSoft(40, 10).v).toBeCloseTo(1, 5);
    expect(fadeSoft(80, 10, 16, 60).v).toBe(0);
  });

  it('路线加密后首尾不变，routeAt 两端落在首尾点', () => {
    const pts = wiggle(
      [
        [0, 0],
        [300, 0],
        [300, 400],
      ],
      2,
      20,
    );
    expect(pts.length).toBeGreaterThan(50);
    expect(pts[0]).toEqual([0, 0]);
    expect(pts[pts.length - 1]).toEqual([300, 400]);
    expect(routeAt(pts, 0)).toEqual([0, 0]);
    const end = routeAt(pts, 1);
    expect(end[0]).toBeCloseTo(300, 3);
    expect(end[1]).toBeCloseTo(400, 3);
  });
});
