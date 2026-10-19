import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {heatAt as libHeatAt} from '../../src/library/tactical/spread';
import {
  ANCHOR,
  BAR,
  BARS,
  beatSec,
  CHAPTERS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fb,
  fbt,
  FPS,
  HALF_BEATS,
  headDeg,
  heatAt,
  HIT,
  HIT2,
  hitChance,
  PHANTOM_RECOVERY,
  RADIUS_X,
  REPLAY,
  RIOT_ACCRUE,
  RIOT_STYLES,
  RIOT_YEAR,
  SFX,
  SHOT,
  SHOTS,
  SPLIT,
  SPRAY_AT,
  SPRAY_EVERY,
  SPRAY_N,
  TITLE,
  VALVE_RT_QUOTE,
  VALVE_RT_YEAR,
  VALVE_SS_QUOTE,
  VALVE_SS_YEAR,
  VANDAL_RECOVERY,
} from '../../src/episodes/ep42-tap-fire/timeline';

describe('ep42 扫射压不住，点射更准？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍，第一枪不在第 0～1 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SHOT - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(SPRAY_AT).toBeGreaterThan(fbt(2));
    expect(SPRAY_AT + SPRAY_EVERY * (SPRAY_N - 1)).toBe(SHOT);
  });
  it('片长约 2 分 18 秒，章节都在乐句起点（每 4 小节），标题不超过 12 个字', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
    CHAPTERS.slice(2).forEach(([b]) => expect(b % 4).toBe(0));
    expect([...TITLE].length).toBeLessThanOrEqual(12);
  });
  it('字幕：按拍递增、都在片长内、每句不超过 24 字、话说一半的两句以破折号结尾、锚词出现', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(text.replace(/[【】〖〗〔〕\s]/g, '').length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => {
      const cue = CUES.find(([beat]) => beat === b)!;
      expect(cue[1]).toMatch(/——$/);
    });
    CUES.filter(([b, t]) => t && !HALF_BEATS.includes(b)).forEach(([, t]) => expect(t).not.toMatch(/——$/));
    expect(CUES.some(([, t]) => t?.includes(ANCHOR))).toBe(true);
  });
  it('镜头首尾相接、片尾停在评论区问题（不做下期预告）；关键元素的出场帧在各自镜头里', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.ask[1]).toBe(DURATION);
    expect('next' in SHOTS).toBe(false);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
    const inside = (at: number, s: readonly [number, number]) => at >= s[0] && at + 8 < s[1];
    expect(inside(fbt(44) + 20, SHOTS.bloom)).toBe(true);
    expect(inside(fbt(60), SHOTS.recover)).toBe(true);
    expect(inside(fbt(80), SHOTS.area)).toBe(true);
    expect(inside(fbt(108), SHOTS.distance)).toBe(true);
    expect(inside(fbt(140), SHOTS.arms)).toBe(true);
    expect(inside(fbt(148), SHOTS.cross)).toBe(true);
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    expect(inside(fbt(217), SHOTS.tapview)).toBe(true);
  });
  it('原文：Riot 0.50 恢复时间与误差累积、各有场合；Valve 2015 / 2016 两篇博客原话', () => {
    expect(RIOT_YEAR).toBe(2020);
    expect(RIOT_ACCRUE).toContain('Inaccuracy is accrued');
    expect(RIOT_STYLES).toContain('(tap, burst, spray)');
    expect(VANDAL_RECOVERY).toBe(0.375);
    expect(PHANTOM_RECOVERY).toBe(0.35);
    expect(VALVE_RT_YEAR).toBe(2015);
    expect(VALVE_RT_QUOTE).toContain('all skill groups are still spraying more');
    expect(VALVE_SS_YEAR).toBe(2016);
    expect(VALVE_SS_QUOTE).toContain('worse accuracy towards the end of the spray');
    expect(CUES.some(([, t]) => t?.includes(`${VANDAL_RECOVERY}`))).toBe(true);
  });
  it('自己算：半径 ×3 → 命中率 1/9；距离 ×2 → 1/4；各距离命中率（示意）', () => {
    expect(hitChance(1, 3) / hitChance(1, 1)).toBeCloseTo(1 / RADIUS_X ** 2, 9);
    expect(RADIUS_X ** 2).toBe(9);
    // 远一倍：角半径约减半，散布圈比头大时命中率约为四分之一
    expect(hitChance(headDeg(40), 1.5) / hitChance(headDeg(20), 1.5)).toBeCloseTo(0.25, 2);
    expect(BARS).toEqual([
      [5, 100, 100],
      [10, 100, 33],
      [20, 100, 8],
      [40, 51, 2],
    ]);
  });
  it('散布热度模型：连着开越来越大、停够恢复时间回到 0；本期副本和素材库一致', () => {
    const spray = [0, 3, 6, 9];
    expect(heatAt(spray, 9, 11)).toBeGreaterThan(heatAt(spray, 3, 11));
    expect(heatAt([0], 11, 11)).toBe(0);
    expect(heatAt([0], 5, 11)).toBeCloseTo(1 - 5 / 11, 9);
    for (const t of [0, 2, 5, 9, 14, 30]) expect(heatAt(spray, t, 11)).toBeCloseTo(libHeatAt(spray, t, 11), 12);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep42-tap-fire/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
