import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CROSS_MS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  fb,
  fbt,
  FPS,
  GIR_MISS,
  GIR_YEAR,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  ML_ABSTRACT_MISS,
  ML_HIGH_HEARD,
  ML_LOW_HEARD,
  ML_N,
  ML_QUOTE,
  ML_YEAR,
  MOLLOY_MS,
  MOLLOY_QUOTE,
  MOLLOY_YEAR,
  OUT_CALL,
  OUT_KILL1,
  OUT_KILL2,
  OUT_TURN,
  REPLAY,
  RL_EXPECT_PCT,
  RL_HIGH,
  RL_LOW,
  RL_YEAR,
  SFX,
  SHOTS,
  SIDE_PEEK,
  SPLIT,
  TITLE,
} from '../../src/episodes/ep45-callouts/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');

describe('ep45 队友报点，你怎么听不见？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(SIDE_PEEK).toBeLessThan(DEATH);
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
    expect(CUES.some(([, t]) => t?.includes(`【${ANCHOR}】`))).toBe(true);
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
    expect(inside(fbt(19), SHOTS.split)).toBe(true);
    [fbt(40), fbt(44), fbt(48), fbt(52)].forEach((at) => expect(inside(at, SHOTS.cross)).toBe(true));
    [fbt(56), fbt(60) + 28].forEach((at) => expect(inside(at, SHOTS.heard)).toBe(true));
    expect(inside(fbt(68) + 24, SHOTS.pipe)).toBe(true);
    [fbt(76), fbt(80), fbt(84)].forEach((at) => expect(inside(at, SHOTS.meg)).toBe(true));
    expect(inside(fbt(88) + 28, SHOTS.share)).toBe(true);
    [fbt(108), fbt(112)].forEach((at) => expect(inside(at, SHOTS.expect)).toBe(true));
    expect(inside(fbt(124), SHOTS.waiting)).toBe(true);
    expect(inside(fbt(140) + 10, SHOTS.duel)).toBe(true);
    expect(inside(fbt(148), SHOTS.pilot)).toBe(true);
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    [OUT_KILL1, OUT_CALL, OUT_TURN, OUT_KILL2].forEach((at) => expect(inside(at, SHOTS.outro)).toBe(true));
    expect(OUT_KILL1 < OUT_CALL && OUT_CALL < OUT_TURN && OUT_TURN + 14 <= OUT_KILL2).toBe(true);
  });
  it('Macdonald & Lavie 2011 原文：十字 150 ms，实验 2 每组 24 人，21 人 vs 5 人听见；摘要 79%', () => {
    expect(ML_YEAR).toBe(2011);
    expect(CROSS_MS).toBe(150);
    expect(ML_N).toBe(24);
    expect(ML_LOW_HEARD).toBe(21);
    expect(ML_HIGH_HEARD).toBe(5);
    expect(Math.round((100 * (ML_N - ML_HIGH_HEARD)) / ML_N)).toBe(ML_ABSTRACT_MISS);
    expect(ML_QUOTE).toContain('reached a rate of 79% in the high-visual-load condition');
    expect(all).toContain(`${CROSS_MS} 毫秒`);
    expect(all).toContain(`${ML_N} 人，${ML_LOW_HEARD} 人听见`);
    expect(all).toContain(`只有 ${ML_HIGH_HEARD} 人听见`);
  });
  it('Molloy 等 2015：约 100 ms 的听觉反应被压低、共用资源被片刻耗尽', () => {
    expect(MOLLOY_YEAR).toBe(2015);
    expect(MOLLOY_MS).toBe(100);
    expect(MOLLOY_QUOTE).toContain('momentary reduction in sensory processing of auditory stimuli');
    expect(all).toContain(`约 ${MOLLOY_MS} 毫秒`);
  });
  it('Raveh & Lavie 2015：听见率 82% → 45%，实验 3 一半回合有声音', () => {
    expect(RL_YEAR).toBe(2015);
    expect([RL_LOW, RL_HIGH]).toEqual([82, 45]);
    expect(RL_EXPECT_PCT).toBe(50);
    expect(all).toContain(`${RL_LOW}%`);
    expect(all).toContain(`${RL_HIGH}%`);
    expect(all).toContain('一半回合');
  });
  it('Giraudet 等 2015：超过 31% 的警报音没被察觉（字幕说「超过」）', () => {
    expect(GIR_YEAR).toBe(2015);
    expect(GIR_MISS).toBe(31);
    expect(all).toContain(`超过 ${GIR_MISS}%`);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep45-callouts/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
