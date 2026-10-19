import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {coinSeq, longestLoss} from '../../src/library/tactical/ranked';
import {
  ANCHOR,
  BAD_QUOTE,
  BAR,
  beatSec,
  CHAPTERS,
  COIN_SEED,
  COINS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  fb,
  FPS,
  GAMES,
  HALF_BEATS,
  HIT,
  HIT2,
  LOSS2,
  P5,
  P6,
  PHROX_QUOTE,
  RIOT_CLIMB,
  RIOT_FIFTY,
  RIOT_LADDER,
  RIOT_NEVER,
  RIOT_TLDR_HIGH,
  SFX,
  SHOTS,
  SPLIT,
  streakProb,
} from '../../src/episodes/ep31-rigged/timeline';

describe('ep31 系统是不是故意让我输？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(LOSS2 - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒，章节都在乐句起点（每 4 小节）', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
    CHAPTERS.slice(2).forEach(([b]) => expect(b % 4).toBe(0));
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
  it('镜头首尾相接，爆点是镜头起点，章节起点都是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
  });
  it('连跪概率：每局 50%，100 把里至少一次 5 连跪约 81%、6 连跪约 55%；硬币网格里真有一段 6 连跪', () => {
    expect(Math.round(streakProb(GAMES, 5) * 100)).toBe(P5);
    expect(Math.round(streakProb(GAMES, 6) * 100)).toBe(P6);
    // 小样本交叉验证：4 把里至少 2 连败 = 1 − 不出现连续两败的序列数 8/16
    expect(streakProb(4, 2)).toBeCloseTo(0.5, 10);
    expect(CUES.some(([, t]) => t?.includes(`${P5}%`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${P6}%`))).toBe(true);
    expect(COINS.length).toBe(GAMES);
    expect(longestLoss(COINS)[1]).toBe(6);
    // timeline 里那份硬币序列和素材库算法一致
    expect(COINS).toEqual(coinSeq(GAMES, COIN_SEED));
  });
  it('片中引语和原文一致', () => {
    expect(RIOT_LADDER).toBe('MMR is a giant ladder, consisting of all players.');
    expect(RIOT_NEVER).toContain('You will never see your MMR');
    expect(RIOT_FIFTY).toContain('50% win rate');
    expect(RIOT_TLDR_HIGH).toContain('gain less RR on wins and lose more on losses');
    expect(RIOT_CLIMB).toContain('win more matches than the players above you');
    expect(PHROX_QUOTE).toContain('each team has an equal chance to win');
    expect(BAD_QUOTE).toContain('bad feedback have more impact than good ones');
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('gunshot.wav') && at === DEATH)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep31-rigged/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
