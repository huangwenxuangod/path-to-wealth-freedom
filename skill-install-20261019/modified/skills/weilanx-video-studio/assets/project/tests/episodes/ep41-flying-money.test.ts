import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  BAR,
  beatSec,
  CITIES,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEMO_GUAN,
  DURATION,
  fbt,
  FPS,
  guanWeightJin,
  HALF_BEATS,
  HIT,
  HIT2,
  JIAOZI_JIE_YEARS,
  JIAOZI_RICH_HOUSES,
  KAIBAO_YEAR,
  NOW_YEAR,
  OPEN_HITS_1,
  OPEN_HITS_2,
  QIAN_PER_GUAN,
  RELAY_HITS,
  SFX,
  SHOTS,
  TIANXI_ADD_WAN,
  YUANHE_YEAR,
  ZHIDAO_WAN,
} from '../../src/episodes/ep41-flying-money/timeline';

describe('ep41 唐朝人，已经在异地转账了', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(CITIES).toHaveLength(RELAY_HITS.length);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
  });
  it('叙述：按拍递增、在片长内、每句不超过 24 字、话说一半以破折号结尾且另起一屏', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(text.replace(/[【】〖〗〔〕\s]/g, '').length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => {
      const cue = CUES.find(([beat]) => beat === b)!;
      expect(cue[1]).toMatch(/——$/);
      expect(cue[2]).toBe(true);
    });
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('片中事实和原文一致，算出来的数对得上', () => {
    expect(QIAN_PER_GUAN).toBe(1000); // 一千文重六觔四兩（《唐会要》卷八十九）
    expect(guanWeightJin(1)).toBe(6.25);
    expect(guanWeightJin(DEMO_GUAN)).toBe(625);
    expect(YUANHE_YEAR).toBe(812); // 元和七年
    expect(NOW_YEAR - YUANHE_YEAR).toBeGreaterThan(1190);
    expect(NOW_YEAR - YUANHE_YEAR).toBeLessThan(1230); // 「一千二百年前」
    expect(KAIBAO_YEAR).toBe(970); // 开宝三年
    expect([ZHIDAO_WAN, TIANXI_ADD_WAN]).toEqual([170, 113]); // 至道末一百七十余万贯，天禧末增一百一十三万贯
    expect([JIAOZI_JIE_YEARS, JIAOZI_RICH_HOUSES]).toEqual([3, 16]);
    const all = CUES.map(([, t]) => t ?? '').join('');
    ['六斤四两', '六百二十五斤', '进奏院', '合券取钱', '十人连保', '元和七年', '便换', '开宝三年', '便钱务', '当天就得给钱', '一百七十多万贯', '一百一十三万贯', '盖有取于唐之飞钱', '一交一缗', '三年一换', '交子务'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，两个爆点上有冲击，11 下硬拍上有驿铃；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('bell.wav') && at === fbt(b))).toBe(true));
    OPEN_HITS_2.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('clink.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep41-flying-money/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
