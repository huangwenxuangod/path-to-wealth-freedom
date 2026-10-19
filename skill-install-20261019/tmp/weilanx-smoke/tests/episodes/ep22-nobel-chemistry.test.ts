import {describe, expect, it} from 'vitest';
import {FILM_SFX} from '../../src/episodes/ep22-nobel-chemistry/film';
import {CUES, DURATION} from '../../src/episodes/ep22-nobel-chemistry/cues';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('ep22 nobel chemistry video', () => {
  it('has all 35 cues inside the voice', () => {
    expect(CUES).toHaveLength(35);
    expect(Math.round(CUES[34].end * 30)).toBeLessThanOrEqual(DURATION);
  });
  it('only schedules existing sfx inside the video', () => {
    for (const [name, at] of FILM_SFX) {
      expect(SFX_NAMES, name).toContain(name);
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
    }
  });
});
