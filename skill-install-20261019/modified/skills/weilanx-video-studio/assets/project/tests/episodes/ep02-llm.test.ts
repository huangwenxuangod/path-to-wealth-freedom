import {describe, expect, it} from 'vitest';
import {SCENES} from '../../src/episodes/ep02-llm/scenes';
import {CUES, DURATION} from '../../src/episodes/ep02-llm/cues';
import {subtitleSize, subtitleWidth} from '../../src/library/Subtitles';
// @ts-expect-error untyped mjs
import {SFX_NAMES} from '../../audio/synth.mjs';

describe('LLM video', () => {
  it('has 42 cues inside the voice duration', () => {
    expect(CUES).toHaveLength(42);
    expect(CUES[41].end * 30).toBeLessThanOrEqual(DURATION);
  });
  it('scenes are chronological and each lasts at least 2s', () => {
    for (let i = 1; i < SCENES.length; i++) expect(SCENES[i].from - SCENES[i - 1].from, SCENES[i - 1].title).toBeGreaterThanOrEqual(60);
    expect(DURATION - SCENES[SCENES.length - 1].from).toBeGreaterThanOrEqual(60);
  });
  it('schedules only existing sfx within the video', () => {
    for (const s of SCENES)
      for (const [name, at] of s.sfx) {
        expect(SFX_NAMES, `${s.title}: ${name}`).toContain(name);
        expect(at, `${s.title}: ${name}`).toBeGreaterThanOrEqual(0);
        expect(at, `${s.title}: ${name}`).toBeLessThan(DURATION);
      }
  });
  it('every subtitle fits on one line', () => {
    for (const c of CUES) {
      expect(subtitleWidth(c.text), c.text).toBeLessThanOrEqual(940);
      expect(subtitleSize(c.text)).toBeGreaterThanOrEqual(52);
    }
  });
});
