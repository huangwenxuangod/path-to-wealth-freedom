import {describe, expect, it} from 'vitest';
import {gauss} from '../../src/library/tactical/charts';
import {project} from '../../src/library/tactical/range';
import {parseMarks} from '../../src/library/tactical/stage';
import {T} from '../../src/library/tactical/theme';

describe('战术屏科普风 tactical', () => {
  it('透视投影：正前方的点落在屏幕中心，越远越靠近地平线，相机后面返回 null', () => {
    const cam = {x: 0, z: 0};
    expect(project([0, 1.6, 10], cam)).toEqual([960, 540]);
    const near = project([0, 0, 5], cam)!;
    const far = project([0, 0, 20], cam)!;
    expect(near[1]).toBeGreaterThan(far[1]);
    expect(far[1]).toBeGreaterThan(540);
    expect(project([0, 0, -3], cam)).toBeNull();
    // 向右转头，正前方的点移到屏幕左边
    expect(project([0, 1.6, 10], {x: 0, z: 0, yaw: 0.3})![0]).toBeLessThan(960);
  });
  it('正态随机是确定性的，均值约 0、标准差约 1', () => {
    expect(gauss(42)).toBe(gauss(42));
    const xs = Array.from({length: 4000}, (_, i) => gauss(i * 7 + 1));
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
    expect(Math.abs(mean)).toBeLessThan(0.08);
    expect(Math.abs(sd - 1)).toBeLessThan(0.08);
  });
  it('字幕重点词：【】青、〖〗红、〔〕橙', () => {
    expect(parseMarks('看【准星】还是看〖敌人〗，〔答案〕')).toEqual([
      ['看', null],
      ['准星', T.cyan],
      ['还是看', null],
      ['敌人', T.red],
      ['，', null],
      ['答案', T.orange],
    ]);
  });
});
