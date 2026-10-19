import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  BETA,
  beatSec,
  COFFEE_HOURS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DATA_GAIN,
  DURATION,
  fbt,
  FORECAST_DAYS,
  FORECAST_GAIN,
  FPS,
  gapAt,
  HALF_BEATS,
  HIT,
  HIT2,
  MODEL_VARS_1961,
  OPEN_HITS_1,
  OPEN_HITS_2,
  PAPER_1963,
  PATH_A,
  PRINTED,
  RELAY_AT,
  RELAY_HITS,
  RHO,
  ROUND_OFF,
  SFX,
  SHOTS,
  SIGMA,
  SIM_MONTHS,
  SPLIT_STEP,
  STEPS,
  STORED,
  TALK_1972,
} from '../../src/episodes/ep38-butterfly/timeline';

describe('ep38 蝴蝶效应', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(RELAY_AT).toEqual(RELAY_HITS.map(fbt));
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
        expect(cn.replace(/[【】〔〕〖〗\s，。：；？、——「」“”]/g, '').length).toBeLessThanOrEqual(18);
        expect(en.length).toBeGreaterThan(5);
      }
    });
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
    const texts = CUES.map(([, cn]) => cn ?? '');
    expect(texts.slice(0, 4).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts.slice(-3).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts[texts.length - 1]).toMatch(/？$/);
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('事实：1961 年的抄写、1963 年的方程、1972 年的演讲、预报极限', () => {
    expect([STORED, PRINTED]).toEqual([0.506127, 0.506]); // APS News 2003
    expect(ROUND_OFF).toBe(0.000127);
    expect([COFFEE_HOURS, SIM_MONTHS, MODEL_VARS_1961]).toEqual([1, 2, 12]); // Lorenz 1991 京都奖演讲；APS News 2003
    expect([SIGMA, RHO, BETA]).toEqual([10, 28, 8 / 3]); // Lorenz 1963
    expect(PAPER_1963).toEqual({title: 'Deterministic Nonperiodic Flow', journal: 'J. Atmos. Sci.', vol: 20, pages: '130–141'});
    expect(TALK_1972.meeting).toBe(139);
    expect(TALK_1972.title).toContain('Butterfly’s Wings in Brazil Set Off a Tornado in Texas');
    expect([FORECAST_DAYS, FORECAST_GAIN, DATA_GAIN]).toEqual([10, 5, 10]); // Zhang 等 2019 摘要
    const all = CUES.map(([, cn]) => cn ?? '').join('');
    ['1961', '0.506127', '0.506', '0.000127', '1963', '10 天', '5 天', '海鸥', '阻止'].forEach((s) => expect(all).toContain(s));
  });
  it('洛伦兹方程：两个起点只差 0.000127，开头几乎重合，后来分道扬镳（自己算的）', () => {
    expect(gapAt(0)).toBeCloseTo(0.000127, 9);
    expect(gapAt(400)).toBeLessThan(0.01);
    expect(SPLIT_STEP).toBeGreaterThan(600);
    expect(SPLIT_STEP).toBeLessThan(1100);
    expect(Math.max(...Array.from({length: STEPS - SPLIT_STEP}, (_, i) => gapAt(SPLIT_STEP + i)))).toBeGreaterThan(15);
    // 轨迹待在吸引子上：x 有正有负（两只「翅膀」都去过），z 在 0～50
    expect(PATH_A.some((p) => p[0] > 8) && PATH_A.some((p) => p[0] < -8)).toBe(true);
    PATH_A.forEach((p) => expect(p[2]).toBeGreaterThan(0));
  });
  it('音效都在片长内，两个爆点上有冲击，预报的前 10 天各有一声嘀；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    RELAY_AT.slice(0, 10).forEach((at) => expect(SFX.some(([file, a]) => a === at && file.endsWith('tick.wav'))).toBe(true));
    OPEN_HITS_1.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('flap.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep38-butterfly/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
