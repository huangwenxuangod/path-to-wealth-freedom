import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  CEPEDA_ARTICLES,
  CEPEDA_ASSESSMENTS,
  CEPEDA_EXPERIMENTS,
  CEPEDA_YEAR,
  CHAPTERS,
  CUES,
  cueStart,
  CURVE,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  FATIGUE,
  fb,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  KB_YEAR,
  MOULTON_N,
  MOULTON_RETENTION_MONTHS,
  MOULTON_YEAR,
  OUT_KILL,
  OUT_RANGE,
  SB_QUOTE,
  SB_YEAR,
  SCORE,
  SFX,
  SHOTS,
  TITLE,
  WALKER_GAIN,
} from '../../src/episodes/ep51-practice/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');

describe('ep51 天天练枪，怎么还不涨？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SCORE - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(CURVE - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(FATIGUE - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
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
  it('字幕：按拍递增、都在片长内、每句不超过 24 字、话说一半的两句以破折号结尾、锚词出现、不说「一定」', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(plain(text).length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    CUES.filter(([b, t]) => t && !HALF_BEATS.includes(b)).forEach(([, t]) => expect(t).not.toMatch(/——$/));
    expect(CUES.some(([, t]) => t?.includes(`【${ANCHOR}】`))).toBe(true);
    expect(all).not.toContain('一定');
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
    [fbt(48), fbt(52) + 20].forEach((at) => expect(inside(at, SHOTS.gap)).toBe(true));
    expect(inside(fbt(68) + 16, SHOTS.spacing)).toBe(true);
    [fbt(80) + 16, fbt(84), fbt(88), fbt(92)].forEach((at) => expect(inside(at, SHOTS.rct)).toBe(true));
    [fbt(104), fbt(108)].forEach((at) => expect(inside(at, SHOTS.meta)).toBe(true));
    [fbt(116), fbt(120) + 10].forEach((at) => expect(inside(at, SHOTS.store)).toBe(true));
    [fbt(136), fbt(140), fbt(144), fbt(148)].forEach((at) => expect(inside(at, SHOTS.illusion)).toBe(true));
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    [OUT_RANGE, OUT_KILL].forEach((at) => expect(inside(at, SHOTS.outro)).toBe(true));
  });
  it('Soderstrom & Bjork 2015、Moulton 等 2006、Cepeda 等 2006、Kornell & Bjork 2008、Walker 2002', () => {
    expect(SB_YEAR).toBe(2015);
    expect(SB_QUOTE).toContain('mistakenly interpret their performance during acquisition');
    expect(MOULTON_YEAR).toBe(2006);
    expect(MOULTON_N).toBe(38);
    expect(MOULTON_RETENTION_MONTHS).toBe(1);
    expect(all).toContain(`${MOULTON_N} 名外科住院医生`);
    expect(all).toContain('一个月后');
    expect(CEPEDA_YEAR).toBe(2006);
    expect([CEPEDA_ARTICLES, CEPEDA_EXPERIMENTS, CEPEDA_ASSESSMENTS]).toEqual([184, 317, 839]);
    expect(all).toContain(`${CEPEDA_EXPERIMENTS} 个实验`);
    expect(KB_YEAR).toBe(2008);
    expect(WALKER_GAIN).toBe(20);
    expect(all).toContain(`${WALKER_GAIN}%`);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep51-practice/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
