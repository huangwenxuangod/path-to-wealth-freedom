import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  BAR,
  beatSec,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  FANGQI_ACTUAL,
  FANGQI_COUNT,
  FANGQI_SAMPLES,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  LEAVE_YEARS,
  OPEN_HITS_1,
  OPEN_HITS_2,
  QICHU,
  RELAY_AT,
  RELAY_HITS,
  REMARRY_YEARS,
  S343_COLS,
  S343_END,
  SANBUQU,
  SFX,
  SHOTS,
  WUZI_AGE,
  XIU_NO_QICHU,
  XIU_SANBUQU_ZHANG,
} from '../../src/episodes/ep30-tang-divorce/timeline';

describe('ep30 古代女人不能离婚？', () => {
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
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('放妻书：11 列对 11 下硬拍，锚词是「一别两宽」', () => {
    expect(S343_COLS).toHaveLength(RELAY_HITS.length);
    expect(RELAY_AT).toEqual(RELAY_HITS.map(fbt));
    expect(S343_END).toEqual(['一别两宽', '各生欢喜']);
    S343_COLS.forEach((c) => expect(c.length).toBeLessThanOrEqual(8));
  });
  it('片中事实和《唐律疏议》原文一致', () => {
    expect(QICHU).toEqual(['无子', '淫泆', '不事舅姑', '口舌', '盗窃', '妒忌', '恶疾']);
    expect(SANBUQU).toHaveLength(3);
    expect(WUZI_AGE).toBe(50); // 四十九以下无子，未合出之
    expect(XIU_NO_QICHU).toBe('徒一年半');
    expect(XIU_SANBUQU_ZHANG).toBe(100);
    expect(LEAVE_YEARS).toBe(2); // 妻妾擅去者，徒二年
    expect(REMARRY_YEARS).toBe(LEAVE_YEARS + 1); // 加二等：徒二年 → 徒三年（徒刑每等半年）
    expect(FANGQI_SAMPLES + FANGQI_ACTUAL).toBe(FANGQI_COUNT);
    const all = CUES.map(([, t]) => t ?? '').join('');
    ['50 岁', '徒一年半', '杖一百', '11 件', '徒三年', '不坐'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，爆点和「徒二年」上有冲击，11 下硬拍上有驿铃；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === fbt(117))).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('bell.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep30-tang-divorce/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
