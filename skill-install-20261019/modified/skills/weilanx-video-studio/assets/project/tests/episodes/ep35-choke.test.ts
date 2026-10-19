import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  BAUM_EXPERIMENTS,
  BAUM_LOWSC,
  BAUM_MODEL,
  BAUM_PRESSURES,
  BAUM_YEAR,
  BEILOCK_PROC,
  BEILOCK_RESULT,
  BEILOCK_YEAR,
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
  jitter,
  REPLAY,
  SFX,
  SHOTS,
  SPLIT,
  WULF_QUOTE,
  WULF_SCOPE,
  WULF_YEARS,
} from '../../src/episodes/ep35-choke/timeline';

describe('ep35 一到残局，手就开始抖？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
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
  it('镜头首尾相接、片尾停在评论区问题（不做下期预告）', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.ask[1]).toBe(DURATION);
    expect('next' in SHOTS).toBe(false);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
  });
  it('片中引语、年份和数字与摘要原文一致', () => {
    expect(BAUM_YEAR).toBe(1984);
    expect(BAUM_EXPERIMENTS).toBe(6);
    expect(BAUM_MODEL).toContain('disrupts the automatic or overlearned nature of the execution');
    expect(BAUM_PRESSURES).toEqual(['implicit competition', 'a cash incentive', 'audience-induced pressure']);
    expect(BAUM_LOWSC).toContain('more susceptible to choking');
    expect(BEILOCK_YEAR).toBe(2001);
    expect(BEILOCK_PROC).toContain('without the need for step-by-step attentional control');
    expect(BEILOCK_RESULT).toContain('eliminated by self-consciousness training');
    expect(BEILOCK_RESULT).toContain('unchanged by dual-task training');
    expect(WULF_YEARS).toBe(15);
    expect(WULF_QUOTE).toContain('external focus');
    expect(WULF_SCOPE).toContain('skill levels, and age groups');
    expect(CUES.some(([, t]) => t?.includes(`${BAUM_YEAR}`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${BEILOCK_YEAR}`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${BAUM_EXPERIMENTS} 个实验`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${WULF_YEARS} 年`))).toBe(true);
  });
  it('准星抖动是帧号的纯函数，幅度不超过 amp', () => {
    expect(jitter(37, 20)).toEqual(jitter(37, 20));
    for (let f = 0; f < 300; f++) jitter(f, 20).forEach((v) => expect(Math.abs(v)).toBeLessThanOrEqual(20));
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('gunshot.wav') && at === DEATH)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep35-choke/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
