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
  ENEMY_AZ_DEG,
  fb,
  FPS,
  HALF_BEATS,
  HEAD_R_CM,
  HIT,
  HIT2,
  ITD_JND_US,
  ITD_MAX_US,
  KILLCAM,
  MIRROR_AZ_DEG,
  RIOT_ASK,
  RIOT_OTHER3D,
  RIOT_PROFILE,
  SFX,
  SHOTS,
  SOUND_V,
  SPLIT,
  WK_QUOTE,
} from '../../src/episodes/ep29-footsteps/timeline';

describe('ep29 脚步声就在耳边，为什么听不出前后？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DEATH - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(KILLCAM - 5.79 * FPS)).toBeLessThanOrEqual(2);
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
  it('镜头首尾相接，爆点是镜头起点，全部落在拍点上', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
  });
  it('片中事实和原文一致', () => {
    // Hartmann & Macaulay 2014：3a / v，a = 8.75 cm，v = 344 m/s → 763 μs
    expect(Math.round(((3 * HEAD_R_CM) / 100 / SOUND_V) * 1e6)).toBe(ITD_MAX_US);
    // 字幕「约 0.76 毫秒」「约 10 微秒」
    expect(CUES.some(([, t]) => t?.includes(`${(ITD_MAX_US / 1000).toFixed(2)} 毫秒`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${ITD_JND_US} 微秒`))).toBe(true);
    // 镜像点：关于两耳连线对称
    expect(ENEMY_AZ_DEG + MIRROR_AZ_DEG).toBe(180);
    // Riot 补丁说明 2.06 原文
    expect(RIOT_ASK).toContain('Is she moving from in front or behind you?');
    expect(RIOT_PROFILE).toContain('a single set of measurements');
    expect(RIOT_OTHER3D).toContain('turn off any other “3D Audio” processing');
    // Wightman & Kistler 1999 摘要
    expect(WK_QUOTE).toContain('nearly disappeared');
    expect(CUES.some(([, t]) => t?.includes('1940'))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes('1999'))).toBe(true);
  });
  it('音效都在片长内，爆点上有冲击、死亡有枪声；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('gunshot.wav') && at === DEATH)).toBe(true);
    expect(SFX.filter(([file, at]) => file.endsWith('footstep-r.wav') && at < DEATH).length).toBe(4);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep29-footsteps/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
