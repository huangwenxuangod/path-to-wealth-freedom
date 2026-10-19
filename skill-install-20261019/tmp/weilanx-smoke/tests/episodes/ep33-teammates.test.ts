import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
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
  LOSS,
  META_D,
  META_QUOTE,
  META_STUDIES,
  P_HALF,
  P_MATE,
  PHROX_SPREAD,
  RIOT_FAIR,
  RIOT_SMURF,
  SFX,
  SHOTS,
  SPLIT,
  TEAM,
  TEN_WORST,
  TEN_YOU,
} from '../../src/episodes/ep33-teammates/timeline';

describe('ep33 为什么总匹配到坑队友？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(LOSS - 5.79 * FPS)).toBeLessThanOrEqual(2);
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
  it('概率：同水平五人，最差的是队友 4/5、是你 1/5；两边最差谁更差一半一半；十局示意八比二', () => {
    expect(TEAM).toBe(5);
    expect(P_MATE).toBeCloseTo(0.8, 10);
    expect(CUES.some(([, t]) => t?.includes(`${Math.round(P_MATE * 100)}%`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes('五分之一'))).toBe(true);
    // 对称：两队最差者谁更差，按随机抽样验证约 50%
    let worse = 0;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const N = 20000;
    for (let i = 0; i < N; i++) {
      const a = Math.min(...Array.from({length: 5}, rnd));
      const b = Math.min(...Array.from({length: 5}, rnd));
      if (a < b) worse++;
    }
    expect(Math.abs(worse / N - P_HALF)).toBeLessThan(0.02);
    expect(TEN_WORST.length).toBe(10);
    expect(TEN_WORST.map((w, i) => (w === 2 ? i : -1)).filter((i) => i >= 0)).toEqual(TEN_YOU);
  });
  it('片中引语和数字与原文一致', () => {
    expect(META_STUDIES).toBe(266);
    expect(META_D).toBe(0.96);
    expect(META_QUOTE).toBe('The bias was present in nearly all samples.');
    expect(CUES.some(([, t]) => t?.includes(`${META_STUDIES} 项研究`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`d = ${META_D}`))).toBe(true);
    expect(RIOT_FAIR).toContain('you and your teammates are placed into a fair fight');
    expect(RIOT_SMURF).toBe('combat smurfing');
    expect(PHROX_SPREAD).toContain('spread of ranks');
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('gunshot.wav') && at === DEATH)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep33-teammates/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
