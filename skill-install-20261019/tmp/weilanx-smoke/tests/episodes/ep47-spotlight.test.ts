import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CFL_YEAR,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  fb,
  fbt,
  FPS,
  GORILLA_SEC,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  ML08_FAR,
  ML08_N,
  ML08_NEAR,
  ML08_YEAR,
  OUT_KILL1,
  OUT_KILL2,
  OUT_SCAN,
  OUT_SEE,
  REPLAY,
  S10_CURTAIN,
  S10_FAMILIAR_GORILLA,
  S10_PLAYER,
  S10_YEAR,
  SC_EASY,
  SC_GORILLA_SAW,
  SC_N_GORILLA,
  SC_HARD,
  SC_MISSED,
  SC_N,
  SC_QUOTE_FOVEA,
  SC_QUOTE_OBJECTS,
  SC_SAW,
  SC_YEAR,
  SFX,
  SHOTS,
  SIDE_IN,
  SPLIT,
  STOOD_SEC,
  THUMP_N,
  THUMP_SAW,
  THUMP_SEC,
  TITLE,
} from '../../src/episodes/ep47-spotlight/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');

describe('ep47 旁边有人，你怎么没看见？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(SIDE_IN + 12).toBeLessThan(DEATH);
    expect(STOOD_SEC).toBeCloseTo((DEATH - SIDE_IN - 12) / FPS, 1);
  });
  it('片长约 2 分 18 秒，章节都在乐句起点，标题 ≤ 12 字，开场标题条 ≤ 20 字且含「你」', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
    CHAPTERS.slice(2).forEach(([b]) => expect(b % 4).toBe(0));
    expect([...TITLE].length).toBeLessThanOrEqual(12);
    expect([...plain(HOOK_LINE)].length).toBeLessThanOrEqual(20);
    expect(HOOK_LINE).toContain('你');
  });
  it('字幕：按拍递增、都在片长内、每句不超过 24 字、话说一半的两句以破折号结尾、锚词出现', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(plain(text).length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    CUES.filter(([b, t]) => t && !HALF_BEATS.includes(b)).forEach(([, t]) => expect(t).not.toMatch(/——$/));
    expect(CUES.some(([, t]) => t?.includes(`【${ANCHOR}】`))).toBe(true);
  });
  it('镜头首尾相接、片尾停在评论区问题；关键元素的出场帧在各自镜头里', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect('next' in SHOTS).toBe(false);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
    const inside = (at: number, s: readonly [number, number]) => at >= s[0] && at + 8 < s[1];
    // 第 1 章的大猩猩完整走过 5 秒，都在传球场镜头里
    expect(inside(fbt(42), SHOTS.court)).toBe(true);
    expect(fbt(42) + GORILLA_SEC * FPS).toBeLessThanOrEqual(SHOTS.court[1]);
    expect(inside(fbt(52), SHOTS.gorilla)).toBe(true);
    expect(inside(fbt(68), SHOTS.beam)).toBe(true);
    [fbt(76), fbt(80)].forEach((at) => expect(inside(at, SHOTS.hard)).toBe(true));
    expect(inside(fbt(86), SHOTS.load)).toBe(true);
    expect(inside(fbt(92), SHOTS.narrow)).toBe(true);
    [fbt(104), fbt(108) + 8].forEach((at) => expect(inside(at, SHOTS.near)).toBe(true));
    expect(inside(fbt(120), SHOTS.object)).toBe(true);
    [fbt(136), fbt(141), fbt(144)].forEach((at) => expect(inside(at, SHOTS.known)).toBe(true));
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    [OUT_KILL1, OUT_SCAN, OUT_SEE, OUT_KILL2].forEach((at) => expect(inside(at, SHOTS.outro)).toBe(true));
    expect(OUT_KILL1 < OUT_SCAN && OUT_SCAN + 12 <= OUT_SEE && OUT_SEE < OUT_KILL2).toBe(true);
  });
  it('Simons & Chabris 1999 原文：192 人，54% / 46%，5 秒，简单 64% / 困难 45%，捶胸版 9 秒 12 人 50%', () => {
    expect(SC_YEAR).toBe(1999);
    expect(SC_N).toBe(192);
    expect(SC_SAW + SC_MISSED).toBe(100);
    expect(SC_MISSED).toBe(46);
    expect(GORILLA_SEC).toBe(5);
    expect([SC_EASY, SC_HARD]).toEqual([64, 45]);
    expect([THUMP_SEC, THUMP_N, THUMP_SAW]).toEqual([9, 12, 50]);
    expect(SC_QUOTE_FOVEA).toContain('(and the fovea)');
    expect(SC_QUOTE_OBJECTS).toBe('observers attend to objects and events, not spatial positions');
    expect(SC_N_GORILLA).toBe(96);
    expect(SC_GORILLA_SAW).toBe(44);
    expect(all).toContain(`${SC_N_GORILLA} 人，〖${100 - SC_GORILLA_SAW}% 没看见它〗`);
    expect(all).toContain(`${GORILLA_SEC} 秒`);
    expect(all).toContain(`${SC_EASY}%`);
    expect(all).toContain(`${SC_HARD}%`);
    expect(all).toContain(`${THUMP_SEC} 秒`);
  });
  it('Macdonald & Lavie 2008：近 61% / 远 64%，距离没影响；Cartwright-Finch & Lavie 2007', () => {
    expect(ML08_YEAR).toBe(2008);
    expect(ML08_N).toBe(16);
    expect([ML08_NEAR, ML08_FAR]).toEqual([61, 64]);
    expect(all).toContain(`${ML08_NEAR}%`);
    expect(all).toContain(`${ML08_FAR}%`);
    expect(CFL_YEAR).toBe(2007);
    expect(all).toContain('2007 年');
  });
  it('Simons 2010：看过的人 100% 找到大猩猩，幕布变色 11%、球员离场 16%', () => {
    expect(S10_YEAR).toBe(2010);
    expect([S10_FAMILIAR_GORILLA, S10_CURTAIN, S10_PLAYER]).toEqual([100, 11, 16]);
    expect(all).toContain(`${S10_FAMILIAR_GORILLA}%`);
    expect(all).toContain(`${S10_CURTAIN}%`);
    expect(all).toContain(`${S10_PLAYER}%`);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep47-spotlight/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
