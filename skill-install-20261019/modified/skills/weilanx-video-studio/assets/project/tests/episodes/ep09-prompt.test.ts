import {describe, expect, it} from 'vitest';
import {SCENES} from '../../src/episodes/ep09-prompt/scenes';
import {CUES, DURATION} from '../../src/episodes/ep09-prompt/cues';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('ep09 prompt video', () => {
  it('has all 51 cues inside the voice', () => {
    expect(CUES).toHaveLength(51);
    expect(Math.round(CUES[50].end * 30)).toBeLessThanOrEqual(DURATION);
  });
  it('scenes are chronological and each lasts at least 2s', () => {
    for (let i = 1; i < SCENES.length; i++) expect(SCENES[i].from - SCENES[i - 1].from, `scene ${i}`).toBeGreaterThanOrEqual(60);
    expect(DURATION - SCENES[SCENES.length - 1].from).toBeGreaterThanOrEqual(60);
  });
  it('only schedules existing sfx inside the video', () => {
    for (const s of SCENES)
      for (const [name, at] of s.sfx) {
        expect(SFX_NAMES, name).toContain(name);
        expect(at).toBeGreaterThanOrEqual(0);
        expect(at).toBeLessThan(DURATION);
      }
  });
});
