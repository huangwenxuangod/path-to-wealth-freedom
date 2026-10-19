import {describe, expect, it} from 'vitest';
import {CUES} from '../../src/episodes/ep01-agent/cues';
import {subtitleSize, subtitleWidth} from '../../src/library/Subtitles';

describe('subtitle fit', () => {
  it('every cue fits on one line and stays readable', () => {
    for (const c of CUES) {
      expect(subtitleWidth(c.text), c.text).toBeLessThanOrEqual(940);
      expect(subtitleSize(c.text), c.text).toBeGreaterThanOrEqual(52);
    }
  });
});
