import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {ANCHOR, BAR, barSec, CUES, cueStart, DARK_FROM, DURATION, FILL_LEN, FPS, grainsOn, grainsUpTo, groupDigits, HIT, HIT2, litCells, SFX, SHOTS, totalTonnes, yearsOfWheat} from '../../src/episodes/ep23-wheat-chessboard/timeline';

describe('ep23 棋盘上的麦粒', () => {
  it('高潮踩在 we-never 第一个重拍（17.45 秒）上，误差不超过 2 帧，且正好是第 8 小节', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(barSec(8) - 17.45)).toBeLessThan(2 / FPS);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(HIT2).toBe(Math.round(barSec(12) * FPS));
  });
  it('字幕：按小节递增、都在片长内、中文不超过 18 字、都有英文', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, zh, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      expect(zh.replace(/[【】\s]/g, '').length).toBeLessThanOrEqual(18);
      expect(en.length).toBeGreaterThan(0);
    });
  });
  it('锚词：开头埋下、结尾重新定义', () => {
    expect(CUES[0][1]).toContain(ANCHOR);
    expect(CUES.some(([bar, zh]) => bar >= 13 && zh.includes(ANCHOR))).toBe(true);
    expect(CUES[CUES.length - 1][1]).toMatch(/？$/);
  });
  it('重拍前那句话只说一半（以破折号结尾），重拍时由锚词补完', () => {
    const before = CUES.filter(([bar]) => bar < 8).pop()!;
    expect(before[1]).toMatch(/——$/);
  });
  it('镜头段落首尾相接', () => {
    const list = Object.values(SHOTS);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBeLessThanOrEqual(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
  });
  it('铺满段：从第 6 格亮到 64 格，在本段结束前完成', () => {
    expect(litCells(0)).toBe(6);
    expect(litCells(FILL_LEN)).toBe(64);
    expect(FILL_LEN).toBeLessThan(BAR * FPS);
  });
  it('音效文件存在（本地已生成音频时）', () => {
    if (!existsSync('public/audio/ep23-wheat-chessboard/bgm.wav')) return;
    for (const [file, at] of SFX) {
      expect(existsSync(`public/${file}`)).toBe(true);
      expect(at).toBeLessThan(DURATION);
    }
  });
  it('数字算对了', () => {
    expect(grainsOn(11)).toBe(1024n);
    expect(grainsUpTo(63) < grainsOn(64)).toBe(true); // 前 63 格加起来不如最后一格
    expect(groupDigits(grainsUpTo(64))).toBe('18,446,744,073,709,551,615');
    expect(Number(grainsUpTo(64)) / 1e16).toBeGreaterThan(1844); // 超过 1,844 亿亿
    expect(totalTonnes()).toBeGreaterThan(9.2e11);
    expect(yearsOfWheat()).toBeGreaterThan(1000);
    expect(yearsOfWheat()).toBeLessThan(1200);
  });
});
