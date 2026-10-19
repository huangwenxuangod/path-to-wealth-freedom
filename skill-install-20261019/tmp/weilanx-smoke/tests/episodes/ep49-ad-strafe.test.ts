import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {keyPos, predictAim} from '../../src/library/tactical/tracking';
import type {Key} from '../../src/library/tactical/tracking';
import {
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEADZONE,
  DEATH,
  DEH_YEAR,
  DURATION,
  ENGEL_YEAR,
  fb,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  KOWLER_YEAR,
  LAG,
  MIYA_LAT,
  MIYA_QUOTE_DELAY,
  MIYA_QUOTE_RANGE,
  MIYA_YEAR,
  OPEN_KF,
  OPEN_SHOTS,
  OPEN_STOP,
  OUT_KF,
  OUT_KILL,
  OUT_STOP,
  REPLAY,
  SFX,
  SHOTS,
  SPLIT,
  TITLE,
  VM_DELAY,
} from '../../src/episodes/ep49-ad-strafe/timeline';

const plain = (t: string) => t.replace(/[【】〖〗〔〕\s]/g, '');
const all = CUES.map(([, t]) => t ?? '').join('');
const toFrames = (kf: [number, number][]): Key[] => kf.map(([b, x]) => [fbt(b), x]);

describe('ep49 对面一横跳，你就打不中？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('开场：你开的几枪都没对上他（差半个身位以上），他在死亡前站住；第一枪不在第 0–1 拍', () => {
    const kf = toFrames(OPEN_KF);
    OPEN_SHOTS.forEach((b) => expect(Math.abs(predictAim(kf, fbt(b), LAG) - keyPos(kf, fbt(b)))).toBeGreaterThan(0.25));
    expect(OPEN_STOP).toBeLessThan(DEATH);
    expect(Math.min(...OPEN_SHOTS)).toBeGreaterThanOrEqual(1.5);
    // 匀速时预测准星正好对上，换向后 LAG 帧内冲过头
    const lin: Key[] = [[0, -1], [90, 1], [100, 1]];
    expect(Math.abs(predictAim(lin, 40, LAG) - keyPos(lin, 40))).toBeLessThan(1e-9);
  });
  it('结尾：他在右端减速停下，准星停在 1.0，爆头时他就在准星上', () => {
    const kf = toFrames(OUT_KF);
    expect(OUT_STOP).toBeLessThan(OUT_KILL);
    expect(Math.abs(keyPos(kf, OUT_KILL) - 1)).toBeLessThan(1e-9);
    expect(OUT_KF[OUT_KF.length - 1][1]).toBe(1);
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
    expect(inside(fbt(19), SHOTS.split)).toBe(true);
    expect(inside(fbt(40) + 20, SHOTS.delay)).toBe(true);
    expect(inside(fbt(52), SHOTS.smooth)).toBe(true);
    expect(inside(fbt(68), SHOTS.turn)).toBe(true);
    expect(inside(fbt(76), SHOTS.bend)).toBe(true);
    [fbt(104), fbt(116), fbt(120)].forEach((at) => expect(inside(at, SHOTS.rhythm)).toBe(true));
    [fbt(136), fbt(140)].forEach((at) => expect(inside(at, SHOTS.intercept)).toBe(true));
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    [OUT_STOP, OUT_KILL].forEach((at) => expect(inside(at, SHOTS.outro)).toBe(true));
  });
  it('Miyamoto 等 2025 原文：约 100 ms 延迟、平均拦截潜伏期 120–420 ms', () => {
    expect(MIYA_YEAR).toBe(2025);
    expect(VM_DELAY).toBe(100);
    expect(MIYA_LAT).toEqual([120, 420]);
    expect(MIYA_QUOTE_DELAY).toContain('delays of approximately 100 ms');
    expect(MIYA_QUOTE_RANGE).toContain('much shorter than typical reaction times');
    expect(all).toContain(`约 ${VM_DELAY} 毫秒`);
    expect(all).toContain(`${MIYA_LAT[0]} 到 ${MIYA_LAT[1]} 毫秒`);
  });
  it('其余出处年份和 Riot 死区 27.5%', () => {
    expect([KOWLER_YEAR, ENGEL_YEAR, DEH_YEAR]).toEqual([2019, 2000, 2010]);
    expect(DEADZONE).toBe(0.275);
    expect(all).toContain('2000 年');
    expect(all).toContain('2010 年');
    expect(all).toContain('2025 年');
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep49-ad-strafe/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
