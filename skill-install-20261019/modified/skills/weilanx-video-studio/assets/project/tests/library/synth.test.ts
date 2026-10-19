import {describe, expect, it} from 'vitest';
// @ts-expect-error untyped mjs
import {encodeWav, renderBgm, renderSfx, SFX_NAMES, SR} from '../../audio/synth.mjs';

const peak = (a: Float32Array) => a.reduce((m, v) => Math.max(m, Math.abs(v)), 0);

describe('synth', () => {
  it('encodes a valid 16-bit mono wav', () => {
    const buf: Buffer = encodeWav(new Float32Array([0, 0.5, -0.5, 1]), SR);
    expect(buf.toString('ascii', 0, 4)).toBe('RIFF');
    expect(buf.toString('ascii', 8, 12)).toBe('WAVE');
    expect(buf.readUInt32LE(40)).toBe(4 * 2);
    expect(buf.length).toBe(44 + 8);
  });
  it('renders a 30s bgm with sane levels', () => {
    const bgm: Float32Array = renderBgm();
    expect(bgm.length).toBe(30 * SR);
    expect(peak(bgm)).toBeLessThanOrEqual(1);
    expect(peak(bgm)).toBeGreaterThan(0.1);
  }, 60000);
  it('renders every sfx', () => {
    for (const name of SFX_NAMES) {
      const a: Float32Array = renderSfx(name);
      expect(a.length, name).toBeGreaterThan(1000);
      expect(peak(a), name).toBeLessThanOrEqual(1);
      expect(peak(a), name).toBeGreaterThan(0.05);
    }
  });
});
