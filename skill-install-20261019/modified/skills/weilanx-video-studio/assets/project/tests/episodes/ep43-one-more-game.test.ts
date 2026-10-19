import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  AGAIN,
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CLARK_CONTROL,
  CLARK_FEEL,
  CLARK_N_BEHAV,
  CLARK_N_FMRI,
  CLARK_QUOTE,
  CLARK_YEAR,
  CLICK_AT,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  fb,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  KS_BEST,
  KS_N,
  KS_RATES,
  KS_YEAR,
  OUTCOMES,
  REEL_ICONS,
  SCORE,
  SFX,
  SHOTS,
  TITLE,
} from '../../src/episodes/ep43-one-more-game/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');

describe('ep43 输了还想再来一把？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SCORE - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(AGAIN - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(CLICK_AT).toBeLessThan(SHOTS.again[1]);
  });
  it('片长约 2 分 18 秒，章节都在乐句起点（每 4 小节），标题不超过 12 个字，开场标题条 ≤ 20 字且含「你」', () => {
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
    [fbt(38), fbt(42), fbt(46)].forEach((at) => expect(inside(at, SHOTS.slot)).toBe(true));
    expect(inside(fbt(60), SHOTS.feel)).toBe(true);
    expect(inside(fbt(76), SHOTS.brain)).toBe(true);
    expect(inside(fbt(108), SHOTS.control)).toBe(true);
    expect(inside(fbt(120), SHOTS.fps)).toBe(true);
    expect(inside(fbt(140), SHOTS.freq)).toBe(true);
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    expect(inside(fbt(216), SHOTS.breaktime)).toBe(true);
  });
  it('Clark 等 2009 原文：40 人 / 15 人、6 个图案、赢 : 差一点 : 差很远 = 1 : 2 : 3、原话', () => {
    expect(CLARK_YEAR).toBe(2009);
    expect(CLARK_N_BEHAV).toBe(40);
    expect(CLARK_N_FMRI).toBe(15);
    expect(REEL_ICONS).toBe(6);
    expect(OUTCOMES.map(([, n]) => n)).toEqual([1, 2, 3]);
    expect(OUTCOMES.reduce((s, [, n]) => s + n, 0)).toBe(REEL_ICONS);
    expect(CLARK_QUOTE).toContain('anomalous recruitment of reward circuitry');
    expect(CLARK_FEEL).toContain('less pleasant, but increased desire to play');
    expect(CLARK_CONTROL).toContain('selected by the computer significantly reduced desire to play');
    expect(CUES.some(([, t]) => t?.includes(`${CLARK_N_FMRI} 个人`))).toBe(true);
  });
  it('Kassinove & Schare 2001 摘要：180 人、15 / 30 / 45%，30% 坚持最久', () => {
    expect(KS_YEAR).toBe(2001);
    expect(KS_N).toBe(180);
    expect(KS_RATES).toEqual([15, 30, 45]);
    expect(KS_BEST).toBe(30);
    const all = CUES.map(([, t]) => t ?? '').join('');
    expect(all).toContain(`${KS_N} 名`);
    expect(all).toContain('15%、30%、45%');
  });
  it('推断的地方字幕用「可能」，不说成定论', () => {
    expect(CUES.some(([, t]) => t?.includes('可能'))).toBe(true);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep43-one-more-game/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
