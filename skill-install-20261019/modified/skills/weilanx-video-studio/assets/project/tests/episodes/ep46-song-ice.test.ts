import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  beatSec,
  blockKg,
  CUES,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DUAN_CHI,
  DURATION,
  fbt,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  JIANLONG2,
  LIANGSHUI,
  LICHUN_BEFORE_DAYS,
  LINGREN_TU,
  MENGHUA_YEAR,
  MENU_PICKS,
  NOW_YEAR,
  OPEN_HITS_1,
  OPEN_HITS_2,
  RELAY_HITS,
  SAN_QI,
  SAY_KG,
  SAY_TONS,
  SFX,
  SHOTS,
  SILVER_SHOPS,
  SONG_FOUNDED,
  TANG_DUAN,
  totalTons,
  WAIT_MONTHS,
  ZHAN_MONTH,
} from '../../src/episodes/ep46-song-ice/timeline';

describe('ep46 宋朝人夏天，已经在喝冰饮了', () => {
  it('卡点：两个爆点、开场两组四连、回落段 11 下硬拍都落在 we-never 实测重音上（±2 帧）', () => {
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 102.52 * FPS)).toBeLessThanOrEqual(2);
    const measured: Record<number, number> = {0: 0.44, 5: 3.09, 7: 4.16, 8: 4.69, 11: 6.28, 13: 7.35, 15: 8.41, 16: 8.94};
    [...OPEN_HITS_1, ...OPEN_HITS_2].forEach((b) => expect(Math.abs(fbt(b) - measured[b] * FPS)).toBeLessThanOrEqual(2));
    const relay = [88.16, 89.23, 89.76, 91.35, 92.42, 93.48, 94.01, 96.67, 97.73, 98.27, 99.86];
    RELAY_HITS.forEach((b, i) => expect(Math.abs(fbt(b) - relay[i] * FPS)).toBeLessThanOrEqual(2));
    expect(MENU_PICKS).toHaveLength(RELAY_HITS.length);
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
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
    expect(ANCHOR).toBe('冬天');
  });
  it('镜头首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('片中事实和原文一致，算出来的数对得上', () => {
    expect(LINGREN_TU).toBe(80); // 徒八十人
    expect([ZHAN_MONTH, SAN_QI]).toEqual([12, 3]); // 岁十有二月，令斩冰，三其凌
    expect(TANG_DUAN).toBe(1000); // 每岁藏一千段
    expect(DUAN_CHI).toEqual({side: 3, thick: 1.5}); // 方三尺，厚一尺五寸
    expect(LICHUN_BEFORE_DAYS).toBe(3); // 先立春三日纳之冰井
    expect(blockKg()).toBeGreaterThan(280);
    expect(blockKg()).toBeLessThan(350); // 约 321 公斤 → 叙述「约 300 公斤」
    expect(Math.abs(blockKg() - SAY_KG) / SAY_KG).toBeLessThan(0.12);
    expect(Math.abs(totalTons() - SAY_TONS) / SAY_TONS).toBeLessThan(0.12);
    expect(JIANLONG2 - SONG_FOUNDED).toBe(1); // 建隆二年 = 开国第二年
    expect(SILVER_SHOPS).toBe(2); // 惟旧宋门外两家最盛
    expect(LIANGSHUI).toHaveLength(17); // 《武林旧事》凉水 17 种
    MENU_PICKS.forEach((n) => expect(LIANGSHUI).toContain(n));
    expect(LIANGSHUI.length - MENU_PICKS.length).toBe(6); // 「还有六种」
    expect(NOW_YEAR - MENGHUA_YEAR).toBeGreaterThan(880);
    expect(NOW_YEAR - MENGHUA_YEAR).toBeLessThan(930); // 「九百年前」
    expect(WAIT_MONTHS).toBe(6); // 腊月 → 六月：半年
    const all = CUES.map(([, t]) => t ?? '').join('');
    ['凌人', '80', '十二月', '三倍', '三其凌', '颁赐', '唐六典', '一千段', '方三尺，厚一尺五寸', '300 公斤', '300 吨', '立春前三天', '藏冰署', '有余，则贸钱', '青布伞', '全用银器', '冰雪一窖活一家', '卖冰一声隔水来', '17 种', '还有六种'].forEach((x) =>
      expect(all).toContain(x),
    );
    MENU_PICKS.forEach((n) => expect(all).toContain(n));
  });
  it('音效都在片长内，两个爆点上有冲击，11 下硬拍上有驿铃；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    RELAY_HITS.forEach((b) => expect(SFX.some(([file, at]) => file.endsWith('bell.wav') && at === fbt(b))).toBe(true));
    expect(SFX.some(([file, at]) => file.endsWith('clink.wav') && at === fbt(7))).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep46-song-ice/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
