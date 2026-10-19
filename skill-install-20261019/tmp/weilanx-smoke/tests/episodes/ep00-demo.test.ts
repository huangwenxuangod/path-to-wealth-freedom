import {describe, expect, it} from 'vitest';
import {getEditorState} from '../../src/episodes/ep00-demo/lib/state';
import {getCamera} from '../../src/episodes/ep00-demo/lib/camera';
import {getBuddy} from '../../src/episodes/ep00-demo/lib/buddy';
import {T, PX_PER_SEC, SNIP_SHIFT, GEO} from '../../src/episodes/ep00-demo/lib/timeline';

const clip = (f: number, id: string) => getEditorState(f).clips.find((c) => c.id === id)!;

describe('getEditorState', () => {
  it('starts empty on the media tab', () => {
    const s = getEditorState(0);
    expect(s.phone).toBe('empty');
    expect(s.tab).toBe('media');
    expect(s.clips.every((c) => !c.visible)).toBe(true);
  });
  it('formats timecode as HH:MM:SS:FF', () => {
    expect(getEditorState(0).timecode).toBe('00:00:00:00');
    expect(getEditorState(505).timecode).toBe('00:00:16:25');
  });
  it('removes the boring clip and closes the gap after SNIP', () => {
    const before = clip(T.snip - 1, 'cat').x;
    expect(clip(T.snip + 60, 'boring').visible).toBe(false);
    expect(before - clip(T.snip + 60, 'cat').x).toBeCloseTo(SNIP_SHIFT * PX_PER_SEC, 0);
  });
  it('switches tabs', () => {
    expect(getEditorState(T.tabTransitions + 1).tab).toBe('transitions');
    expect(getEditorState(T.tabText + 1).tab).toBe('text');
  });
  it('maxes shake then backs off', () => {
    const m = getEditorState(T.shakeMax + 5);
    expect(m.shakeMax).toBe(true);
    expect(m.sliders.shake).toBe(1);
    expect(getEditorState(T.shakeBack + 20).sliders.shake).toBeCloseTo(0.05);
  });
  it('finishes export', () => {
    const s = getEditorState(T.exportDone + 3);
    expect(s.exportProgress).toBe(1);
    expect(s.done).toBe(true);
  });
  it('plays back clips on the phone', () => {
    const scenes = new Set<string>();
    for (let f = T.playback; f < T.reachExport; f++) scenes.add(getEditorState(f).phone);
    expect([...scenes]).toEqual(expect.arrayContaining(['sunrise', 'coffee', 'cat', 'dance']));
  });
});

describe('getCamera', () => {
  it('starts on the full view and zooms in for the snip', () => {
    expect(getCamera(0)).toMatchObject({x: 960, y: 540, scale: 1});
    expect(getCamera(T.snip - 10).scale).toBeGreaterThan(1.4);
  });
});

describe('getBuddy', () => {
  it('walks in from off-screen and stands on the ground', () => {
    expect(getBuddy(0).x).toBeLessThan(0);
    expect(getBuddy(40).y).toBe(GEO.groundY);
  });
  it('holds scissors before snipping and reaches for EXPORT', () => {
    expect(getBuddy(T.snip - 5).scissors).toBeGreaterThan(0);
    const b = getBuddy(T.exportClick);
    expect(b.arm).not.toBeNull();
    expect(b.arm!.ext).toBeCloseTo(1);
  });
  it('speaks the bubble lines', () => {
    expect(getBuddy(T.muchCleaner + 10).bubble).toBe('much cleaner.');
    expect(getBuddy(T.nobodySaw + 10).bubble).toBe('…nobody saw that.');
  });
});
