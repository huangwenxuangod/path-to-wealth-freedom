import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CORREA_YEAR,
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
  JIG_BACK,
  JIG_HOLD,
  JIG_OUT,
  JIGGLE_BEATS,
  MANN_EFFECTS,
  MANN_STUDIES,
  MANN_YEAR,
  OUT_JIG1,
  OUT_KILL,
  OUT_PEEK,
  PEEK_ADV,
  PEEK_ADV_144,
  REPLAY,
  RIOT_HUMAN_RT,
  RIOT_QUOTE,
  RIOT_YEAR,
  SDT,
  SFX,
  SHOOT_AFTER,
  SHOTS,
  SPLIT,
  SRT,
  SRT_RAW,
  SUM_KEY,
  SUM_RIOT,
  TITLE,
  WIDE_BEAT,
  WOODS_N,
  WOODS_YEAR,
} from '../../src/episodes/ep48-jiggle-peek/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');

describe('ep48 探头就跑，你怎么打不到？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('开场：每次晃身位在你开枪前就缩回去了（打空），两次晃身位都在死亡之前结束，第一枪不在第 0–1 拍', () => {
    expect(JIG_OUT + JIG_HOLD + JIG_BACK).toBeLessThan(SHOOT_AFTER);
    JIGGLE_BEATS.forEach((b) => expect(fbt(b) + SHOOT_AFTER + 8).toBeLessThan(fbt(WIDE_BEAT)));
    expect(fbt(WIDE_BEAT)).toBeLessThan(DEATH);
    expect(Math.min(...JIGGLE_BEATS)).toBeGreaterThanOrEqual(2);
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
    expect(inside(REPLAY + 26, SHOTS.replay)).toBe(true);
    expect(inside(fbt(19), SHOTS.split)).toBe(true);
    [fbt(44), fbt(48)].forEach((at) => expect(inside(at, SHOTS.rtest)).toBe(true));
    expect(inside(fbt(52) + 14, SHOTS.rsplit)).toBe(true);
    expect(inside(fbt(68), SHOTS.window)).toBe(true);
    [fbt(76), fbt(80), fbt(84)].forEach((at) => expect(inside(at, SHOTS.shift)).toBe(true));
    [fbt(88), fbt(92)].forEach((at) => expect(inside(at, SHOTS.cut)).toBe(true));
    [fbt(104) + 14, fbt(112) + 20].forEach((at) => expect(inside(at, SHOTS.sum)).toBe(true));
    expect(inside(fbt(120), SHOTS.miss)).toBe(true);
    [fbt(136), fbt(140), fbt(146)].forEach((at) => expect(inside(at, SHOTS.pro)).toBe(true));
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    [OUT_JIG1, OUT_PEEK, OUT_KILL].forEach((at) => expect(inside(at, SHOTS.outro)).toBe(true));
    expect(OUT_JIG1 + 20 < OUT_PEEK && OUT_PEEK < OUT_KILL).toBe(true);
  });
  it('Riot 2020 原文：141 ms、144 帧约 71 ms（-49%）、人的反应常在 300 ms', () => {
    expect(RIOT_YEAR).toBe(2020);
    expect(PEEK_ADV).toBe(141);
    expect(PEEK_ADV_144).toBe(71);
    expect(Math.round((1 - PEEK_ADV_144 / PEEK_ADV) * 100)).toBe(50);
    expect(RIOT_HUMAN_RT).toBe(300);
    expect(RIOT_QUOTE).toContain('human reaction times often fall in the 300ms range');
    expect(all).toContain(`约 ${PEEK_ADV} 毫秒`);
    expect(all).toContain(`约 ${PEEK_ADV_144} 毫秒`);
  });
  it('Woods 等 2015 摘要：1469 人，231 / 213 ms，察觉 131 ms', () => {
    expect(WOODS_YEAR).toBe(2015);
    expect(WOODS_N).toBe(1469);
    expect([SRT_RAW, SRT, SDT]).toEqual([231, 213, 131]);
    expect(all).toContain(`${WOODS_N} 个人`);
    expect(all).toContain(`${SRT} 毫秒`);
    expect(all).toContain(`约 ${SDT} 毫秒`);
  });
  it('自己算的账：71–141 + 213 = 284–354；按 300 算约 370–440', () => {
    expect(SUM_KEY).toEqual([284, 354]);
    expect(SUM_RIOT).toEqual([371, 441]);
    expect(all).toContain(`${SUM_KEY[0]} 到 ${SUM_KEY[1]} 毫秒`);
    expect(all).toContain('约 370 到 440');
  });
  it('Mann 等 2007：42 项研究、388 个效应量；Correa 等 2006', () => {
    expect(MANN_YEAR).toBe(2007);
    expect([MANN_STUDIES, MANN_EFFECTS]).toEqual([42, 388]);
    expect(all).toContain(`${MANN_STUDIES} 项`);
    expect(CORREA_YEAR).toBe(2006);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep48-jiggle-peek/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
