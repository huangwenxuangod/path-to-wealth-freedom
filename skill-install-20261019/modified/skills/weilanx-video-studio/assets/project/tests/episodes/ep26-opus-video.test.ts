import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {CUES, DURATION} from '../../src/episodes/ep26-opus-video/cues';
import {camAt} from '../../src/episodes/ep26-opus-video/Ep26OpusVideo';
import {SCENES, STEPS} from '../../src/episodes/ep26-opus-video/scenes';

describe('ep26 Opus 5.5 做视频（开场试片）', () => {
  it('场景按时间递增，都在片长内', () => {
    for (let i = 1; i < SCENES.length; i++) expect(SCENES[i].from).toBeGreaterThan(SCENES[i - 1].from);
    SCENES.forEach((s) => expect(s.from).toBeLessThan(DURATION));
  });
  it('步骤号不越界，三个收获都有正文', () => {
    const used = new Set(SCENES.filter((s) => s.step !== undefined).map((s) => s.step));
    used.forEach((k) => expect(k).toBeLessThan(STEPS.length));
    STEPS.forEach((_, k) => expect(used.has(k)).toBe(true));
  });
  it('字幕都在片长内，片长和录制原件一致（52.5 秒）', () => {
    CUES.forEach((c) => expect(c.end * 30).toBeLessThanOrEqual(DURATION));
    expect(DURATION).toBe(Math.ceil(52.5 * 30));
  });
  it('出镜小窗始终在左下角：左边 ≤ 60、底边 = 920，A-roll 大、B-roll 小', () => {
    for (let f = 0; f < DURATION; f += 15) {
      const c = camAt(f);
      expect(c.x).toBeLessThanOrEqual(60);
      expect(Math.round(c.y + c.size)).toBe(920);
    }
    const a = SCENES.find((s) => s.roll === 'A')!;
    const b = SCENES.find((s) => s.roll === 'B')!;
    expect(camAt(a.from + 20).size).toBeGreaterThan(camAt(b.from + 20).size);
  });
  it('音效和素材文件存在', () => {
    SCENES.flatMap((s) => s.sfx).forEach(([name, at]) => {
      expect(at).toBeLessThan(DURATION);
      // 音效由 npm run audio 生成，不进 git；干净的 checkout 里跳过
      if (existsSync('public/audio/sfx')) expect(existsSync(`public/audio/sfx/${name}.wav`)).toBe(true);
    });
    if (existsSync('public/audio/ep26-opus-video/voice.wav')) expect(existsSync('public/footage/ep26-opus-video/host.mp4')).toBe(true);
  });
});
