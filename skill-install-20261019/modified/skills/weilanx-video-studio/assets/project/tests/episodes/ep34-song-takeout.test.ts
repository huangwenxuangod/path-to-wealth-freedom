import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  BAR,
  beatSec,
  BOOK_ERA,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  LEFT_BOWLS,
  LEFT_HITS,
  LEND_SILVER,
  NIGHT_CLOSE,
  NIGHT_OPEN,
  NOW_YEAR,
  OPEN_HITS_1,
  OPEN_HITS_2,
  RELAY_HITS,
  RIGHT_BOWLS,
  RIGHT_HITS,
  RIGHT_PER_HIT,
  SFX,
  SHOTS,
  SIDE_DISH_WEN,
} from '../../src/episodes/ep34-song-takeout/timeline';

describe('ep34 宋朝人，已经在点外卖了', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
  });
  it('叙述：按拍递增、在片长内、每句不超过 24 字、话说一半以破折号结尾且另起一屏', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, text], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (text) expect(text.replace(/[【】〖〗〔〕\s]/g, '').length).toBeLessThanOrEqual(24);
    });
    HALF_BEATS.forEach((b) => {
      const cue = CUES.find(([beat]) => beat === b)!;
      expect(cue[1]).toMatch(/——$/);
      expect(cue[2]).toBe(true);
    });
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('跑堂：左手 3 碗各占一拍，右臂 8 拍合计 20 碗（《东京梦华录》卷四）', () => {
    expect(LEFT_HITS).toHaveLength(LEFT_BOWLS);
    expect(RIGHT_HITS).toHaveLength(RIGHT_PER_HIT.length);
    expect(RIGHT_PER_HIT.reduce((a, b) => a + b, 0)).toBe(RIGHT_BOWLS);
    expect(LEFT_BOWLS + RIGHT_HITS.length).toBe(RELAY_HITS.length);
  });
  it('片中事实和原文一致', () => {
    expect(SIDE_DISH_WEN).toBe(15); // 每分不過十五錢
    expect([LEFT_BOWLS, RIGHT_BOWLS]).toEqual([3, 20]); // 左手杈三碗、右臂……約二十碗
    expect([NIGHT_CLOSE, NIGHT_OPEN]).toEqual(['三更', '五更']);
    expect(LEND_SILVER).toBe('三五百两');
    // 「九百年前」：北宋末到今天约 900 年
    expect(NOW_YEAR - BOOK_ERA[0]).toBeGreaterThanOrEqual(880);
    expect(NOW_YEAR - BOOK_ERA[1]).toBeLessThanOrEqual(920);
    const all = CUES.map(([, t]) => t ?? '').join('');
    ['不置家蔬', '十五文', '闲汉', '三更', '五更', '二十碗', '银器', '三五百两', '此皆京师旧人'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，爆点和「夜深方归」上有冲击，11 下硬拍上有瓷碗声；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === fbt(117))).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('clink.wav') && at === fbt(b))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep34-song-takeout/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
