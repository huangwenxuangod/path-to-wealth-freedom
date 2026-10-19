import {describe, expect, it} from 'vitest';
import {FILM_SFX} from '../../src/episodes/ep18-ai-history/film';
import {CUES, DURATION} from '../../src/episodes/ep18-ai-history/cues';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('ep18 ai history video', () => {
  it('has all 104 cues inside the voice', () => {
    expect(CUES).toHaveLength(104);
    expect(Math.round(CUES[103].end * 30)).toBeLessThanOrEqual(DURATION);
  });
  it('only schedules existing sfx inside the video', () => {
    for (const [name, at] of FILM_SFX) {
      expect(SFX_NAMES, name).toContain(name);
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
    }
  });
});
