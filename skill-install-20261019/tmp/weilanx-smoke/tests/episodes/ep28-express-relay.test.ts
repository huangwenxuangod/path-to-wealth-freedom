import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  AN_DAYS,
  BAR,
  beatSec,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fbt,
  FANYANG_LI,
  FPS,
  GUIZHOU_QUOTA,
  HALF_BEATS,
  HIT,
  HIT2,
  LATE_1,
  LATE_2,
  LATE_MAX_YEARS,
  LI_PER_STATION,
  OPEN_HITS_1,
  OPEN_HITS_2,
  QING_FAST,
  QING_STATIONS,
  QING_URGENT,
  QL_DAYS,
  RELAY_AT,
  RELAY_HITS,
  RELAY_STOPS,
  SFX,
  SHESHU_LI,
  SHOTS,
  TANG_STATIONS,
} from '../../src/episodes/ep28-express-relay/timeline';

describe('ep28「八百里加急」到底有多快？', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
  });
  it('叙述：按拍递增、在片长内、每句不超过 24 字、话说一半以破折号结尾、锚词出现', () => {
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
    expect(CUES.some(([, t]) => t?.includes('奇迹'))).toBe(true);
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('接力链：起点 + 11 站，最后一站在第 187 拍到兰州', () => {
    expect(RELAY_STOPS).toHaveLength(12);
    expect(RELAY_STOPS[RELAY_STOPS.length - 1]).toBe(1);
    expect(RELAY_AT[RELAY_AT.length - 1]).toBe(fbt(187));
    for (let i = 1; i < RELAY_AT.length; i++) expect(RELAY_AT[i]).toBeGreaterThan(RELAY_AT[i - 1]);
  });
  it('片中数字和出处一致', () => {
    expect(LI_PER_STATION).toBe(30); // 《唐六典》凡三十里一驿
    expect(TANG_STATIONS).toBe(1639); // 一千六百三十有九所
    expect(SHESHU_LI).toBe(500); // 赦书日行五百里
    expect(FANYANG_LI).toBe(2520); // 《旧唐书·地理志》幽州：在京师东北二千五百二十里
    expect(AN_DAYS).toBe(7 - 1); // 甲子（第 1）→ 庚午（第 7）
    expect([LATE_1, LATE_2, LATE_MAX_YEARS]).toEqual([80, 90, 2]); // 一日杖八十，二日加一等，罪止徒二年
    expect([QING_FAST, QING_URGENT]).toEqual([300, 600]);
    expect(GUIZHOU_QUOTA).toBe(7);
    expect(QING_STATIONS).toBe(953);
    expect(QL_DAYS).toBe(6);
    // 叙述里出现的数字和常量对得上
    const all = CUES.map(([, t]) => t ?? '').join('');
    ['1639', '2520', '300 里', '600 里', '953', '1791', '1891'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，爆点和「绞」上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === fbt(117))).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('bell.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep28-express-relay/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
