import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {HOST, SLOTS, THUMBS, WORKS} from '../../src/episodes/ep27-opus-video-full/assets';
import {CUES, DURATION} from '../../src/episodes/ep27-opus-video-full/cues';
import {camAt} from '../../src/episodes/ep27-opus-video-full/Ep27OpusVideoFull';
import {SCENES, STEPS} from '../../src/episodes/ep27-opus-video-full/scenes';

describe('ep27 Opus 5.5 做视频（完整版）', () => {
  it('场景按时间递增，都在片长内', () => {
    for (let i = 1; i < SCENES.length; i++) expect(SCENES[i].from).toBeGreaterThan(SCENES[i - 1].from);
    SCENES.forEach((s) => expect(s.from).toBeLessThan(DURATION));
  });
  it('步骤号不越界，每一步都有正文', () => {
    const used = new Set(SCENES.filter((s) => s.step !== undefined).map((s) => s.step));
    used.forEach((k) => expect(k).toBeLessThan(STEPS.length));
    STEPS.forEach((_, k) => expect(used.has(k)).toBe(true));
  });
  it('字幕都在片长内，143 条', () => {
    expect(CUES.length).toBe(143);
    CUES.forEach((c) => expect(c.end * 30).toBeLessThanOrEqual(DURATION));
  });
  it('出镜小窗始终在左下角：左边 ≤ 60、底边 = 920，A-roll 大、B-roll 小、全屏 B-roll 退场', () => {
    for (let f = 0; f < DURATION; f += 15) {
      const c = camAt(f);
      expect(c.x).toBeLessThanOrEqual(60);
      expect(Math.round(c.y + c.size)).toBe(920);
    }
    const at = (r: string) => camAt(SCENES.find((s) => s.roll === r)!.from + 20);
    expect(at('A').size).toBeGreaterThan(at('B').size);
    expect(at('F').o).toBe(0);
  });
  it('全屏 B-roll 占一定比例，人物不是一直都在', () => {
    const f = SCENES.filter((s) => s.roll === 'F').length;
    expect(f / SCENES.length).toBeGreaterThan(0.3);
  });
  it('已就位的素材文件都在；待补素材有编号且不重复', () => {
    // 出镜录像和作品素材不进 git；干净的 checkout 里只检查编号
    const media = existsSync(`public/${HOST}`);
    if (media) [HOST, ...WORKS.map((w) => w.file), ...THUMBS].forEach((p) => expect(existsSync(`public/${p}`)).toBe(true));
    const slots = Object.values(SLOTS);
    expect(new Set(slots.map((s) => s.id)).size).toBe(slots.length);
    if (media) slots.filter((s) => 'ready' in s && s.ready).forEach((s) => expect(existsSync(`public/${s.file}`)).toBe(true));
  });
  it('音效文件存在', () => {
    SCENES.flatMap((s) => s.sfx).forEach(([name, at]) => {
      expect(at).toBeLessThan(DURATION);
      // 音效由 npm run audio 生成，不进 git；干净的 checkout 里跳过
      if (existsSync('public/audio/sfx')) expect(existsSync(name.includes('/') ? `public/${name}` : `public/audio/sfx/${name}.wav`)).toBe(true);
    });
  });
});
