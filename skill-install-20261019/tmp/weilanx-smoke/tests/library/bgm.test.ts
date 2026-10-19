import {describe, expect, it} from 'vitest';
// @ts-expect-error untyped mjs
import {duckGain, readWavMono, styleAt, voiceEnvelope} from '../../audio/bgm.mjs';
// @ts-expect-error untyped mjs
import {encodeWav, SR} from '../../audio/synth.mjs';

describe('explainer audio', () => {
  it('ducks only when the voice is present', () => {
    expect(duckGain(-80)).toBe(1);
    expect(duckGain(-20)).toBeCloseTo(0.38);
    expect(duckGain(-37.5)).toBeGreaterThan(duckGain(-30));
  });
  it('maps time to arrangement sections', () => {
    const sections = [[0, 'light'], [130, 'tense'], [164, 'end']];
    expect(styleAt(0, sections)).toBe('light');
    expect(styleAt(135, sections)).toBe('tense');
    expect(styleAt(165, sections)).toBe('end');
  });
  it('reads back a wav it wrote and sees loud vs silent parts', () => {
    const a = new Float32Array(SR);
    for (let i = SR / 2; i < SR; i++) a[i] = Math.sin(i * 0.05) * 0.5;
    const {samples, sr} = readWavMono(encodeWav(a, SR));
    expect(sr).toBe(SR);
    expect(samples.length).toBe(SR);
    const env: Float32Array = voiceEnvelope(samples, sr);
    expect(env[10]).toBeLessThan(-60);
    expect(env[env.length - 1]).toBeGreaterThan(-15);
  });
});
