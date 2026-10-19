import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ACCELERATE,
  AIR_CAP,
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEMO_FPS,
  DURATION,
  fb,
  FPS,
  FRICTION,
  HALF_BEATS,
  HIT,
  HIT2,
  HYPO_1,
  MAX_SPEED,
  METER,
  PASS,
  QUAKE_LINES,
  QUAKE_YEAR,
  SFX,
  SHOTS,
  SOURCE_CAP,
  SOURCE_LINES,
  SPLIT,
  TF2_COMMENT,
  TF2_FACTOR,
  TITLE,
  turnDeg,
  V_1S,
  V_3S,
} from '../../src/episodes/ep37-bhop/timeline';

describe('ep37 连跳为什么越跳越快？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(PASS - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(METER - 5.79 * FPS)).toBeLessThanOrEqual(2);
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
  it('镜头首尾相接、片尾停在评论区问题（不做下期预告）', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.ask[1]).toBe(DURATION);
    expect('next' in SHOTS).toBe(false);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
  });
  it('源码事实：Quake 和 Source 的空中限速都是 30，Quake 默认参数、TF2 的 1.2 倍上限', () => {
    expect(QUAKE_YEAR).toBe(1996);
    expect(AIR_CAP).toBe(30);
    expect(SOURCE_CAP).toBe(30);
    expect(MAX_SPEED).toBe(320);
    expect(ACCELERATE).toBe(10);
    expect(FRICTION).toBe(4);
    expect(QUAKE_LINES[0]).toBe('if (wishspd > 30)');
    expect(QUAKE_LINES.some((l) => l.includes('DotProduct (pmove.velocity, wishdir)'))).toBe(true);
    expect(SOURCE_LINES).toContain('// Determine veer amount');
    expect(TF2_FACTOR).toBe(1.2);
    expect(TF2_COMMENT).toContain('1.2x');
  });
  it('推算：每秒 100 帧时一帧的加速量 ≥ 30（补得满），斜边 321.4，1 秒 439、3 秒 610，转角 5.4° → 2.8°', () => {
    expect((ACCELERATE * MAX_SPEED) / DEMO_FPS).toBeGreaterThanOrEqual(AIR_CAP);
    expect(HYPO_1).toBe(321.4);
    expect(V_1S).toBe(439);
    expect(V_3S).toBe(610);
    expect(turnDeg(MAX_SPEED)).toBeCloseTo(5.36, 2);
    expect(turnDeg(V_3S)).toBeLessThan(3);
    expect(CUES.some(([, t]) => t?.includes(`${HYPO_1}`))).toBe(true);
    expect(CUES.some(([, t]) => t?.includes(`${V_3S}`))).toBe(true);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep37-bhop/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
