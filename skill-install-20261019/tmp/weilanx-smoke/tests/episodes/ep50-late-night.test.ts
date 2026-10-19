import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  AWAKE_H,
  BAR,
  beatSec,
  CHAPTERS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DIAL,
  DURATION,
  fb,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  LD_ARTICLES,
  LD_LAPSES_G,
  LD_REASON_G,
  LD_TESTS,
  LD_YEAR,
  NOW_AT,
  OPEN_SHOTS,
  OUT_KILL,
  SFX,
  SHOTS,
  SPLIT,
  TITLE,
  VD_DAYS,
  VD_DOSES,
  VD_EQUIV_NIGHTS,
  VD_N,
  VD_QUOTE,
  VD_THRESHOLD_H,
  VD_YEAR,
  WAKE_AT,
  WALKER_GAIN,
  WALKER_YEAR,
  WF_BAC,
  WF_HOURS,
  WF_N,
  WF_SLOWER,
  WF_YEAR,
} from '../../src/episodes/ep50-late-night/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');

describe('ep50 凌晨打排位，手感去哪了？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DIAL - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(Math.min(...OPEN_SHOTS)).toBeGreaterThanOrEqual(2);
    expect(Math.max(...OPEN_SHOTS)).toBeLessThan(7);
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
    expect(inside(DIAL + 30, SHOTS.dial)).toBe(true);
    expect(inside(fbt(19), SHOTS.split)).toBe(true);
    [fbt(48), fbt(52) + 10].forEach((at) => expect(inside(at, SHOTS.equiv)).toBe(true));
    expect(inside(fbt(56) + 10, SHOTS.slow)).toBe(true);
    expect(inside(fbt(60), SHOTS.awake)).toBe(true);
    expect(inside(fbt(68), SHOTS.offline)).toBe(true);
    [fbt(76), fbt(84)].forEach((at) => expect(inside(at, SHOTS.days)).toBe(true));
    expect(inside(fbt(88) + 12, SHOTS.unaware)).toBe(true);
    expect(inside(fbt(108) + 12, SHOTS.meta)).toBe(true);
    [fbt(112), fbt(116)].forEach((at) => expect(inside(at, SHOTS.lapse)).toBe(true));
    [fbt(140), fbt(144), fbt(148)].forEach((at) => expect(inside(at, SHOTS.sleep)).toBe(true));
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    expect(inside(OUT_KILL, SHOTS.outro)).toBe(true);
  });
  it('Williamson & Feyer 2000 摘要：39 人，17–19 小时 ≈ 0.05% BAC，最多慢 50%', () => {
    expect(WF_YEAR).toBe(2000);
    expect(WF_N).toBe(39);
    expect(WF_HOURS).toEqual([17, 19]);
    expect(WF_BAC).toBe(0.05);
    expect(WF_SLOWER).toBe(50);
    expect(all).toContain(`${WF_N} 个人`);
    expect(all).toContain('17 到 19 个小时');
    expect(all).toContain('0.05%');
    expect(all).toContain(`${WF_SLOWER}%`);
  });
  it('Van Dongen 等 2003 摘要：48 人，14 天，8 / 6 / 4 小时，最多相当于 2 晚不睡，15.84 小时', () => {
    expect(VD_YEAR).toBe(2003);
    expect(VD_N).toBe(48);
    expect(VD_DAYS).toBe(14);
    expect(VD_DOSES).toEqual([8, 6, 4]);
    expect(VD_EQUIV_NIGHTS).toBe(2);
    expect(VD_THRESHOLD_H).toBe(15.84);
    expect(VD_QUOTE).toContain('largely unaware');
    expect(all).toContain(`${VD_DAYS} 天`);
    expect(all).toContain('两晚完全不睡');
    expect(all).toContain('约 16 小时');
  });
  it('Lim & Dinges 2010 摘要：70 篇、147 项，走神 0.776、推理 0.125', () => {
    expect(LD_YEAR).toBe(2010);
    expect([LD_ARTICLES, LD_TESTS]).toEqual([70, 147]);
    expect([LD_LAPSES_G, LD_REASON_G]).toEqual([0.776, 0.125]);
    expect(all).toContain(`${LD_ARTICLES} 篇`);
  });
  it('Walker 等 2002 摘要：睡一晚快 20%；自己算的 8 点到 2 点 = 18 小时', () => {
    expect(WALKER_YEAR).toBe(2002);
    expect(WALKER_GAIN).toBe(20);
    expect(all).toContain(`${WALKER_GAIN}%`);
    expect(AWAKE_H).toBe(18);
    expect(NOW_AT - 24).toBe(2);
    expect(all).toContain(`早上 ${WAKE_AT} 点起床，凌晨 2 点就醒了 ${AWAKE_H} 个小时`);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep50-late-night/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
