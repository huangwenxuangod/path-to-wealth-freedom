import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {laneTimes} from '../../src/library/tactical/pipeline';
import {
  AIM_DIFF,
  AIM_LAT,
  ANCHOR,
  BAR,
  beatSec,
  CHAPTERS,
  CLICK,
  CPU_AHEAD,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DOUBLE,
  DURATION,
  fb,
  fbt,
  FPS,
  frameMs,
  HALF_BEATS,
  HIT,
  HIT2,
  HUMAN_DELAY,
  LAT_TABLE,
  MS_120,
  MS_240,
  MS_60,
  NV_QUEUE_QUOTE,
  NV_QUOTE,
  NV_YEAR,
  PIPE_AT,
  PIPE_PER,
  RATES,
  SAVED,
  SFX,
  SHOT,
  SHOTS,
  STAGES,
  STUDY_QUOTE,
  STUDY_YEAR,
  SUBJECTS,
  TITLE,
  TYPICAL_LATENCY,
} from '../../src/episodes/ep39-latency/timeline';

describe('ep39 帧数翻倍，反应变快了吗？', () => {
  it('卡点：两个爆点落在 we-never 实测重拍上，开场三次重音在第 7、10、15 拍', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(SHOT - 4.19 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(DOUBLE - 5.79 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(CLICK - 8.46 * FPS)).toBeLessThanOrEqual(2);
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
  it('镜头首尾相接、片尾停在评论区问题（不做下期预告）；流水线五段都在 pipe 镜头里亮起', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.ask[1]).toBe(DURATION);
    expect('next' in SHOTS).toBe(false);
    for (const [k] of CHAPTERS.slice(1)) expect(list.some(([a]) => a === fb(k))).toBe(true);
    STAGES.forEach((_, i) => {
      expect(PIPE_AT + i * PIPE_PER).toBeGreaterThanOrEqual(SHOTS.pipe[0]);
      expect(PIPE_AT + i * PIPE_PER + 8).toBeLessThan(SHOTS.pipe[1]);
    });
    // 方法卡、实验格子、结果图的出场帧都在各自镜头里
    [164, 168, 172, 176].forEach((b) => expect(fbt(b)).toBeLessThan(SHOTS.steps[1]));
    expect(fbt(136)).toBeLessThan(SHOTS.exp[1]);
    expect(fbt(144) + 30).toBeLessThan(SHOTS.result[1]);
    expect(fbt(218)).toBeLessThan(SHOTS.headshot[1]);
  });
  it('NVIDIA 2020 原文：一比一、渲染队列、提前两帧、50–100 ms、12 vs 20 ms 差 182 ms', () => {
    expect(NV_YEAR).toBe(2020);
    expect(NV_QUOTE).toContain('far from 1-to-1');
    expect(NV_QUEUE_QUOTE).toContain('can introduce latency');
    expect(CPU_AHEAD).toBe(2);
    expect(TYPICAL_LATENCY).toEqual([50, 100]);
    expect(AIM_LAT).toEqual([12, 20]);
    expect(AIM_DIFF).toBe(182);
    expect(STAGES).toEqual(['鼠标', 'CPU', '渲染队列', 'GPU', '显示器']);
    expect(CUES.some(([, t]) => t?.includes(`${AIM_LAT[1] - AIM_LAT[0]} 毫秒`) && t.includes(`${AIM_DIFF}`))).toBe(true);
  });
  it('Spjut 等 2019：8 人、4 种刷新率、表 1 的延迟、手眼 150–200 ms、原话', () => {
    expect(STUDY_YEAR).toBe(2019);
    expect(SUBJECTS).toBe(8);
    expect(RATES).toEqual([60, 120, 240, 360]);
    expect(LAT_TABLE[60]).toEqual([22, 55, 88]);
    expect(LAT_TABLE[360]).toEqual([22, 52, 82]);
    // 同一档延迟在 4 种刷新率下差不多（被故意拉平）
    for (let r = 0; r < 3; r++) {
      const col = RATES.map((hz) => LAT_TABLE[hz][r]);
      expect(Math.max(...col) - Math.min(...col)).toBeLessThanOrEqual(9);
    }
    expect(HUMAN_DELAY).toEqual([150, 200]);
    expect(STUDY_QUOTE).toContain('largely because of the latency reduction');
  });
  it('自己算：一帧 16.7 / 8.3 / 4.2 毫秒，翻倍省约 4 毫秒；泳道示意里 CPU 先算完 GPU 才画、队列不为负', () => {
    expect(MS_60).toBe(16.7);
    expect(MS_120).toBe(8.3);
    expect(MS_240).toBe(4.2);
    expect(SAVED).toBe(4);
    expect(frameMs(240) * 2).toBeCloseTo(frameMs(120), 6);
    for (let k = 0; k < 9; k++) {
      for (const jit of [0, 0.5, 1]) {
        const t = laneTimes(k, 150, 80, 2, jit);
        expect(t.cpu0).toBeGreaterThanOrEqual(0);
        expect(t.cpu1).toBeLessThanOrEqual(t.gpu0 + 1e-9);
      }
    }
    // 稳态时排队约两帧减去 CPU 时间
    const t5 = laneTimes(5, 150, 80, 2, 0);
    expect(t5.gpu0 - t5.cpu1).toBe(2 * 150 - 80);
  });
  it('音效都在片长内，爆点上有冲击；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep39-latency/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
