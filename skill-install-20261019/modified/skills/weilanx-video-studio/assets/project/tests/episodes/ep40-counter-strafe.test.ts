import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ACCEL_LINES,
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  COUNTER_UNDER,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEADZONE,
  DEADZONE_DEF,
  DURATION,
  fb,
  fbt,
  FPS,
  FRICTION_LINES,
  GAIN,
  HALF_BEATS,
  HIT,
  HIT2,
  HOLD,
  HOLD_WINDOW,
  PUSH,
  RELEASE,
  RELEASE_STOP,
  RELEASE_UNDER,
  REPLAY,
  RIFLE_RUN,
  RIFLE_WALK,
  RIOT_QUOTE,
  RIOT_YEAR,
  SFX,
  SHOT,
  SHOTS,
  simStop,
  SPEEDUP,
  SPLIT,
  SV_ACCELERATE,
  SV_FRICTION,
  SV_MAXSPEED,
  SV_STOPSPEED,
  TAP,
  THRESH,
  TICK,
  TITLE,
} from '../../src/episodes/ep40-counter-strafe/timeline';

describe('ep40 跑着开枪，怎么总打不中？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SHOT - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(REPLAY - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SPLIT - 8.46 * FPS)).toBeLessThanOrEqual(2);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒，章节都在乐句起点（每 4 小节），标题不超过 12 个字', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
    CHAPTERS.slice(2).forEach(([b]) => expect(b % 4).toBe(0));
    expect([...TITLE].length).toBeLessThanOrEqual(12);
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
    expect(inside(fbt(44) + 12, SHOTS.spread)).toBe(true);
    expect(inside(fbt(92), SHOTS.relcurve)).toBe(true);
    expect(inside(fbt(124), SHOTS.compare)).toBe(true);
    expect(inside(fbt(144), SHOTS.hold)).toBe(true);
    [164, 168, 172, 176].forEach((b) => expect(inside(fbt(b), SHOTS.steps)).toBe(true));
    expect(inside(fbt(206), SHOTS.duel)).toBe(true);
    expect(inside(fbt(219), SHOTS.headshot)).toBe(true);
  });
  it('Riot 3.0 原文：死区 27.5%、步枪走路 2.0 / 跑动 5.0、原话', () => {
    expect(RIOT_YEAR).toBe(2021);
    expect(DEADZONE).toBe(0.275);
    expect(RIFLE_WALK).toBe(2.0);
    expect(RIFLE_RUN).toBe(5.0);
    expect(RIOT_QUOTE).toContain('proactively stop before they shoot');
    expect(DEADZONE_DEF).toContain('movement speed a player becomes inaccurate');
  });
  it('Source SDK 2013 原文：默认参数和函数节选', () => {
    expect([SV_FRICTION, SV_STOPSPEED, SV_ACCELERATE, SV_MAXSPEED]).toEqual([4, 100, 10, 320]);
    expect(FRICTION_LINES).toContain('drop += control*friction*gpGlobals->frametime;');
    expect(ACCEL_LINES).toContain('addspeed = wishspeed - currentspeed;');
    expect(PUSH).toBe(3200);
  });
  it('自己算（每秒 64 次模拟）：松手 0.31 / 0.55 秒，点一下 0.06 秒，快 5 倍、早 0.25 秒；按住窗口约 0.05 秒', () => {
    expect(THRESH).toBeCloseTo(88, 6);
    expect(TICK).toBe(64);
    expect(RELEASE_UNDER).toBe(0.31);
    expect(RELEASE_STOP).toBe(0.55);
    expect(COUNTER_UNDER).toBe(0.06);
    expect(SPEEDUP).toBe(5);
    expect(GAIN).toBe(0.25);
    expect(HOLD_WINDOW).toBe(0.05);
    // 松手永远不会反向；按住会反向跑起来；点一下最后停在 0 附近
    expect(Math.min(...RELEASE)).toBeGreaterThanOrEqual(0);
    expect(Math.min(...HOLD)).toBeLessThan(-THRESH);
    expect(Math.abs(TAP[TAP.length - 1])).toBeLessThan(1);
    expect(Math.max(...TAP.slice(6).map(Math.abs))).toBeLessThan(THRESH);
    // 高速段只有摩擦时，每 tick 速度乘 (1 − 4/64)
    expect(simStop(0)[1]).toBeCloseTo(SV_MAXSPEED * (1 - SV_FRICTION / TICK), 6);
    // 字幕里的数字和计算一致
    const all = CUES.map(([, t]) => t ?? '').join('');
    [RELEASE_UNDER, RELEASE_STOP, COUNTER_UNDER, GAIN, HOLD_WINDOW, PUSH].forEach((n) => expect(all).toContain(`${n}`));
    expect(all).toContain(`快了 ${SPEEDUP} 倍`);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep40-counter-strafe/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
