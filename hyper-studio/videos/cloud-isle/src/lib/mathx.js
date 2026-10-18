/* Small math helpers shared by every module. All pure functions of time. */
(function () {
  window.SKY = window.SKY || {};

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));

  const smoothstep = (e0, e1, x) => {
    const t = clamp(invLerp(e0, e1, x), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const smootherstep = (e0, e1, x) => {
    const t = clamp(invLerp(e0, e1, x), 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  /** Piecewise smooth interpolation across [[t0,v0],[t1,v1],...] */
  function track(t, keys, ease) {
    const fn = ease || smootherstep;
    if (t <= keys[0][0]) return keys[0][1];
    const last = keys[keys.length - 1];
    if (t >= last[0]) return last[1];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (t >= a[0] && t <= b[0]) {
        return lerp(a[1], b[1], fn(a[0], b[0], t));
      }
    }
    return last[1];
  }

  /** Piecewise smooth interpolation over THREE vectors: keys are [t, [x,y,z]] */
  function trackVec3(out, t, keys) {
    if (t <= keys[0][0]) return out.set(keys[0][1][0], keys[0][1][1], keys[0][1][2]);
    const last = keys[keys.length - 1];
    if (t >= last[0]) return out.set(last[1][0], last[1][1], last[1][2]);
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (t >= a[0] && t <= b[0]) {
        const k = smootherstep(a[0], b[0], t);
        return out.set(
          lerp(a[1][0], b[1][0], k),
          lerp(a[1][1], b[1][1], k),
          lerp(a[1][2], b[1][2], k)
        );
      }
    }
    return out.set(last[1][0], last[1][1], last[1][2]);
  }

  /** Smooth 1D value noise from an integer lattice. */
  function noise1(x, seed) {
    const i = Math.floor(x);
    const f = x - i;
    const h = (n) => {
      let v = Math.sin((n + (seed || 0) * 57.31) * 127.1) * 43758.5453;
      return v - Math.floor(v);
    };
    const a = h(i);
    const b = h(i + 1);
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  }

  SKY.M = {
    clamp,
    lerp,
    invLerp,
    smoothstep,
    smootherstep,
    track,
    trackVec3,
    noise1,
    TAU: Math.PI * 2,
  };
})();
