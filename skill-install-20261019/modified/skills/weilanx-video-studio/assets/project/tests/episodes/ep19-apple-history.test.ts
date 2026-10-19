import {describe, expect, it} from 'vitest';
import {FILM_SFX} from '../../src/episodes/ep19-apple-history/film';
import {CUES, DURATION} from '../../src/episodes/ep19-apple-history/cues';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('ep19 apple history video', () => {
  it('has all 78 cues inside the voice', () => {
    expect(CUES).toHaveLength(78);
    expect(Math.round(CUES[77].end * 30)).toBeLessThanOrEqual(DURATION);
  });
  it('only schedules existing sfx inside the video', () => {
    for (const [name, at] of FILM_SFX) {
      expect(SFX_NAMES, name).toContain(name);
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
    }
  });
});
