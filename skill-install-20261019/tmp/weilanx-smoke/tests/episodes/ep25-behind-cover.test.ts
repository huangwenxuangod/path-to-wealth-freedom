import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  BAR,
  beatSec,
  CHAPTERS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  fb,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  KILLCAM,
  PEEK_128,
  PEEK_144,
  PEEK_BASE,
  SFX,
  SHOTS,
  SPLIT,
  TICK_MS,
} from '../../src/episodes/ep25-behind-cover/timeline';

describe('ep25 躲进掩体，为什么还被打死？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    // 音乐里实测的开场重音：4.19 / 5.79 / 8.46 秒，和拍点相差不超过 2 帧
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(KILLCAM - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒（参考爆款同长），章节都在乐句起点（每 4 小节）或标题之后', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
    CHAPTERS.slice(2).forEach(([b]) => expect(b % 4 === 0 || b % 8 === 0).toBe(true));
  });
  it('字幕：按拍递增、都在片长内、每句不超过 24 字、话说一半的两句以破折号结尾', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(text.replace(/[【】〖〗〔〕\s]/g, '').length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => {
      const cue = CUES.find(([beat]) => beat === b)!;
      expect(cue[1]).toMatch(/——$/);
    });
    expect(CUES.some(([, t]) => t?.includes('过去'))).toBe(true);
  });
  it('镜头首尾相接，爆点是镜头起点，全部落在拍点上', () => {
    const list = Object.values(SHOTS);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.rewind[0]).toBe(fb(16));
  });
  it('片中数字和 Riot 原文一致', () => {
    expect(PEEK_BASE).toBe(141);
    expect(PEEK_BASE - PEEK_128).toBeCloseTo(40, 0); // 省约 40 ms
    expect((PEEK_BASE - PEEK_128) / PEEK_BASE).toBeCloseTo(0.28, 2); // 约 28%
    expect(1 - PEEK_144 / PEEK_BASE).toBeCloseTo(0.49, 1); // 约降 49%
    expect(PEEK_128 - PEEK_144).toBe(30); // 「144 帧，对手先手少约 30 毫秒」
    expect(TICK_MS).toBeCloseTo(7.8125, 4);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('gunshot.wav') && at === DEATH)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep25-behind-cover/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
