import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  ANCHOR2,
  BAR,
  beatSec,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  LONG_MEN,
  LONG_WOMEN,
  LONG_YEARS,
  OPEN_HITS_1,
  OPEN_HITS_2,
  PISA_N,
  PISA_RETEST,
  PISA_RETEST_MONTHS,
  REGIONS,
  RELAY_AT,
  RELAY_HITS,
  SFX,
  SHOTS,
  SURVEY_N,
  SURVEY_PCT,
  SURVEY_YEARS,
} from '../../src/episodes/ep32-love-lasts/timeline';

describe('ep32 热恋会过期，但爱不会', () => {
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
  it('字幕：按拍递增、在片长内、中文 ≤ 18 字、都有英文；话说一半以「——」结尾；锚词开头结尾都出现；最后一句是问题', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, cn, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (cn) {
        expect(cn.replace(/[【】\s，。：；？、——「」“”]/g, '').length).toBeLessThanOrEqual(18);
        expect(en.length).toBeGreaterThan(5);
      }
    });
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    // 两个爆点那一拍不放字幕，由大字补完
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
    const texts = CUES.map(([, cn]) => cn ?? '');
    expect(texts.slice(-3).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts.slice(0, 15).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(ANCHOR2).toBe('依恋');
    expect(texts[texts.length - 1]).toMatch(/？$/);
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.hit[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('11 个脑区对 11 下硬拍', () => {
    expect(REGIONS).toHaveLength(RELAY_HITS.length);
    expect(RELAY_AT).toEqual(RELAY_HITS.map(fbt));
  });
  it('片中数字和论文摘要一致', () => {
    expect(PISA_N).toBe(20); // Marazziti 1999：20 名 6 个月内坠入爱河者
    expect(PISA_RETEST).toBe(6); // 12–18 个月后复测其中 6 人
    expect(PISA_RETEST_MONTHS).toEqual([12, 18]);
    expect(LONG_WOMEN + LONG_MEN).toBe(17); // Acevedo 2012：10 女 7 男
    expect(LONG_YEARS).toBe(21.4);
    expect([SURVEY_N, SURVEY_YEARS, SURVEY_PCT]).toEqual([274, 10, 40]); // O'Leary 2012
    const all = CUES.map(([, cn]) => cn ?? '').join('');
    ['20 个', '6 人', '17 个人', '21.4 年', '274', '10 年以上', '40%'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，两个爆点上有冲击，11 下硬拍上有铃；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('chime.wav') && at === fbt(b))).toBe(true));
    OPEN_HITS_1.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('heartbeat.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep32-love-lasts/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
