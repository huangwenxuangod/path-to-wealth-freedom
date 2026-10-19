import {describe, expect, it} from 'vitest';
import {SCENES} from '../../src/episodes/ep01-agent/scenes';
import {DURATION} from '../../src/episodes/ep01-agent/cues';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('explainer scenes', () => {
  it('are in chronological order and each lasts at least 3s', () => {
    for (let i = 1; i < SCENES.length; i++) {
      expect(SCENES[i].from - SCENES[i - 1].from, SCENES[i - 1].title).toBeGreaterThanOrEqual(90);
    }
    expect(DURATION - SCENES[SCENES.length - 1].from).toBeGreaterThanOrEqual(90);
  });
  it('only schedule existing sound effects inside the video', () => {
    for (const s of SCENES) {
      for (const [name, at, vol] of s.sfx) {
        expect(SFX_NAMES, `${s.title}: ${name}`).toContain(name);
        expect(at, `${s.title}: ${name}`).toBeGreaterThanOrEqual(0);
        expect(at, `${s.title}: ${name}`).toBeLessThan(DURATION);
        expect(vol).toBeGreaterThan(0);
        expect(vol).toBeLessThanOrEqual(1);
      }
    }
  });
});
