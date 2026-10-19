import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  ANCHOR2,
  appearAt,
  barSec,
  CUES,
  cueStart,
  curveUpTo,
  DARK_FROM,
  DARK_FROM2,
  DAYS,
  dayLabel,
  DURATION,
  fb,
  FPS,
  HALF_BARS,
  HIT,
  HIT2,
  MATCH,
  multipliedAt,
  pairAt,
  pairs,
  pAllDiff,
  pct,
  pMatchYou,
  pShared,
  SFX,
  SHOTS,
  WC_SHARED,
  WC_SQUAD,
  WC_TEAMS,
  YOU,
} from '../../src/episodes/ep24-birthday-paradox/timeline';

describe('ep24 生日悖论（2 分钟版）', () => {
  it('两个高潮踩在 we-never 的实测重拍上（17.45 秒、102.52 秒），误差不超过 2 帧，且都在小节线上', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(barSec(8) - 17.45)).toBeLessThan(1 / FPS);
    expect(Math.abs(barSec(48) - 102.52)).toBeLessThan(1 / FPS);
    expect(barSec(0)).toBeGreaterThan(0.3); // 第一条小节线在音乐起音附近
    expect(barSec(0)).toBeLessThan(0.5);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(DARK_FROM2).toBeGreaterThan(HIT2 - 30);
  });
  it('片长约 2 分钟', () => {
    expect(DURATION / FPS).toBeGreaterThan(110);
    expect(DURATION / FPS).toBeLessThan(130);
  });
  it('字幕：按小节递增、都在片长内、中文不超过 18 字、都有英文', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, zh, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      expect(zh.replace(/[【】\s]/g, '').length).toBeLessThanOrEqual(18);
      expect(en.length).toBeGreaterThan(0);
    });
    // 句数 ≈ 片长秒数 ÷ 3
    expect(CUES.length).toBeGreaterThan(DURATION / FPS / 4);
  });
  it('锚词：开头埋下、结尾重新定义，最后一句是问题', () => {
    expect(CUES[0][1]).toContain(ANCHOR);
    expect(CUES.some(([bar, zh]) => bar > 48 && zh.includes(ANCHOR) && zh.includes(ANCHOR2))).toBe(true);
    expect(CUES[CUES.length - 1][1]).toMatch(/？$/);
  });
  it('两个爆点前那句话都只说一半（以破折号结尾），重拍时由大字补完', () => {
    expect(HALF_BARS).toEqual([7, 47]);
    const before1 = CUES.filter(([bar]) => bar < 8).pop()!;
    const before2 = CUES.filter(([bar]) => bar < 48).pop()!;
    expect(before1[0]).toBe(HALF_BARS[0]);
    expect(before2[0]).toBe(HALF_BARS[1]);
    expect(before1[1]).toMatch(/——$/);
    expect(before2[1]).toMatch(/——$/);
  });
  it('镜头段落首尾相接，爆点在各自段落的起点', () => {
    const list = Object.values(SHOTS);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.hit[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('环上 23 个人：只有一对撞在同一天，而且不是「你」；所有人在收暗前落下', () => {
    expect(DAYS.length).toBe(23);
    const seen = new Map<number, number[]>();
    DAYS.forEach((d, i) => seen.set(d, [...(seen.get(d) ?? []), i]));
    expect([...seen.values()].filter((v) => v.length > 1)).toEqual([MATCH]);
    expect(MATCH).not.toContain(YOU);
    DAYS.forEach((_, i) => expect(appearAt(i)).toBeLessThan(DARK_FROM));
    expect(dayLabel(DAYS[YOU])).toBe('10 月 14 日');
    expect(dayLabel(DAYS[MATCH[0]])).toBe('7 月 24 日');
    expect(dayLabel(365)).toBe('12 月 31 日');
  });
  it('动画进度：连线在第 9 小节画完，连乘在第 17 小节乘到 23 人，曲线按小节到 40 / 57 / 70', () => {
    expect(pairs(23)).toBe(253);
    expect(pairAt(252)).toBeLessThan(fb(10));
    expect(multipliedAt(fb(14))).toBe(2);
    expect(multipliedAt(fb(15))).toBe(3);
    expect(multipliedAt(fb(17))).toBe(23);
    expect(curveUpTo(fb(20))).toBe(40);
    expect(curveUpTo(fb(21))).toBe(57);
    expect(curveUpTo(fb(22))).toBe(70);
  });
  it('音效：都在片长内，重拍上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep24-birthday-paradox/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
  it('片中的数字都算对了', () => {
    // 23 人第一次过半：50.7%，全部错开 49.3%
    expect(pShared(22)).toBeLessThan(0.5);
    expect(pShared(23)).toBeGreaterThan(0.5);
    expect(pct(pShared(23))).toBe('50.7%');
    expect(pct(pAllDiff(23))).toBe('49.3%');
    // 第 2、3 个人要避开的天数
    expect(pAllDiff(2)).toBeCloseTo(364 / 365, 12);
    expect(pAllDiff(3)).toBeCloseTo((364 / 365) * (363 / 365), 12);
    // 曲线上的点
    expect(pct(pShared(40))).toBe('89.1%');
    expect(pct(pShared(57))).toBe('99.0%');
    expect(pct(pShared(70))).toBe('99.9%');
    // 抽屉原理：366 人必撞
    expect(pAllDiff(366)).toBe(0);
    expect(pAllDiff(365)).toBeGreaterThan(0); // 约 1.5 × 10⁻¹⁵⁷，浮点里 1 − 它已经等于 1
    // 和「你」同一天：253 人才过半
    expect(pMatchYou(252)).toBeLessThan(0.5);
    expect(pMatchYou(253)).toBeGreaterThan(0.5);
    // 配对数：10 人 45 对、70 人 2,415 对；人数翻倍配对约翻 4 倍
    expect(pairs(10)).toBe(45);
    expect(pairs(70)).toBe(2415);
    expect(pairs(46) / pairs(23)).toBeCloseTo(4.09, 2);
    // 世界杯：32 队 × 23 人，16 队撞了生日（正好一半）；理论上每队过半的概率就是 50.7%
    expect(WC_TEAMS * 0.5).toBe(WC_SHARED);
    expect(WC_SQUAD).toBe(23);
  });
});
