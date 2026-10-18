/* Seeded, deterministic randomness. Never call Math.random() inside the composition. */
(function () {
  window.SKY = window.SKY || {};

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** A tiny helper object around a seeded stream. */
  function stream(seed) {
    const r = mulberry32(seed);
    return {
      next: r,
      range: (a, b) => a + (b - a) * r(),
      int: (a, b) => Math.floor(a + (b - a + 1) * r()),
      pick: (arr) => arr[Math.floor(r() * arr.length) % arr.length],
      sign: () => (r() < 0.5 ? -1 : 1),
    };
  }

  /** Deterministic 0..1 hash from integer coordinates. */
  function hash1(n) {
    let x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  }

  SKY.rand = mulberry32;
  SKY.stream = stream;
  SKY.hash1 = hash1;
})();
