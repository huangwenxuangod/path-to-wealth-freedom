import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  cellText,
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
  OPEN_HITS_1,
  OPEN_HITS_2,
  payoff,
  RELAY_AT,
  RELAY_HITS,
  SFX,
  SHOTS,
  STUDY,
  type Move,
} from '../../src/episodes/ep36-boxed-pigs/timeline';

describe('ep36 智猪博弈', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(RELAY_AT).toEqual(RELAY_HITS.map(fbt));
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });
  it('片长约 2 分 18 秒', () => {
    expect(DURATION / FPS).toBeGreaterThan(130);
    expect(DURATION / FPS).toBeLessThan(140);
    expect(Math.abs(beatSec(256) - (17.45 + 56 * BAR))).toBeLessThan(0.001);
  });
  it('字幕：按拍递增、在片长内、中文 ≤ 18 字、都有英文；话说一半以「——」结尾；锚词开头结尾都出现；最后一句是问题', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, cn, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (cn) {
        expect(cn.replace(/[【】〔〕〖〗\s，。：；？、——「」“”]/g, '').length).toBeLessThanOrEqual(18);
        expect(en.length).toBeGreaterThan(5);
      }
    });
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
    const texts = CUES.map(([, cn]) => cn ?? '');
    expect(texts.slice(0, 4).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts.slice(-3).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts[texts.length - 1]).toMatch(/？$/);
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('收益矩阵和 Rasmusen 表 1.6 一致，小猪「等」是占优策略，唯一纳什均衡是（大猪按，小猪等）', () => {
    expect(payoff('press', 'press')).toEqual([5, 1]);
    expect(payoff('press', 'wait')).toEqual([4, 4]);
    expect(payoff('wait', 'press')).toEqual([9, -1]);
    expect(payoff('wait', 'wait')).toEqual([0, 0]);
    expect(cellText('wait', 'press')).toBe('9 , −1');
    const moves: Move[] = ['press', 'wait'];
    moves.forEach((b) => expect(payoff(b, 'wait')[1]).toBeGreaterThan(payoff(b, 'press')[1]));
    const nash = moves.flatMap((b) => moves.map((s) => [b, s] as [Move, Move])).filter(([b, s]) => {
      const [pb, ps] = payoff(b, s);
      return moves.every((b2) => payoff(b2, s)[0] <= pb) && moves.every((s2) => payoff(b, s2)[1] <= ps);
    });
    expect(nash).toEqual([['press', 'wait']]);
    expect(STUDY).toEqual({year: 1979, journal: 'Animal Behaviour', vol: 27, pages: '947–957'});
    const all = CUES.map(([, cn]) => cn ?? '').join('');
    ['1979', '〔10〕', '〔2〕', '〔1〕', '〔4〕', '−1', '纳什均衡'].forEach((s) => expect(all).toContain(s));
  });
  it('音效都在片长内，两个爆点上有冲击，回落段每下硬拍都有声；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    RELAY_AT.forEach((at) => expect(SFX.some(([file, a]) => a === at && /(press|drop)\.wav$/.test(file))).toBe(true));
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep36-boxed-pigs/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
