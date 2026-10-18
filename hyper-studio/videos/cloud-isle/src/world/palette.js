/* Sky / sun / atmosphere model. Everything is a pure function of time t (seconds). */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  // Elevation of the sun across the 48s film (radians, roughly -0.5 .. 1.0)
  const ELEV = [
    [0, 0.05],
    [4, 0.18],
    [10, 0.45],
    [18, 0.85],
    [26, 0.98],
    [34, 0.78],
    [39, 0.30],
    [41.5, 0.02],
    [44, -0.20],
    [48, -0.45],
  ];
  const AZIM = [
    [0, 1.26],
    [10, 0.95],
    [24, 0.14],
    [34, -0.46],
    [41, -0.96],
    [48, -1.2],
  ];

  const STOPS = [
    {
      e: -0.6,
      zen: 0x050a1c,
      hor: 0x0d1630,
      sea: 0x0a1226,
      glow: 0x1b2a52,
      stars: 1.0,
      sun: 0x93aaff,
      sunI: 0.3,
      hemiSky: 0x16213f,
      hemiGround: 0x080d18,
      hemiI: 0.34,
      fog: 0x0c1528,
    },
    {
      e: -0.16,
      zen: 0x0a1230,
      hor: 0x232f5c,
      sea: 0x101a34,
      glow: 0x4b3f78,
      stars: 0.9,
      sun: 0x9db3ff,
      sunI: 0.32,
      hemiSky: 0x1d2b52,
      hemiGround: 0x0b1220,
      hemiI: 0.4,
      fog: 0x141d38,
    },
    {
      e: -0.03,
      zen: 0x18224c,
      hor: 0x9c5552,
      sea: 0x3f3450,
      glow: 0xff6f34,
      stars: 0.35,
      sun: 0xff7a45,
      sunI: 0.8,
      hemiSky: 0x35406b,
      hemiGround: 0x181820,
      hemiI: 0.55,
      fog: 0x4a3750,
    },
    {
      e: 0.07,
      zen: 0x2a4272,
      hor: 0xf5925f,
      sea: 0xc08a79,
      glow: 0xffab6d,
      stars: 0.0,
      sun: 0xff9c58,
      sunI: 2.0,
      hemiSky: 0x5f79ad,
      hemiGround: 0x38352f,
      hemiI: 0.85,
      fog: 0xa87a6e,
    },
    {
      e: 0.24,
      zen: 0x38699e,
      hor: 0xf0c6a4,
      sea: 0xe0c4b2,
      glow: 0xffd2a0,
      stars: 0.0,
      sun: 0xffd0a0,
      sunI: 2.8,
      hemiSky: 0x8fb0d6,
      hemiGround: 0x625c47,
      hemiI: 1.0,
      fog: 0xc9ae9e,
    },
    {
      e: 0.56,
      zen: 0x2a6098,
      hor: 0xa8cee6,
      sea: 0xc4d6e2,
      glow: 0xfff0d8,
      stars: 0.0,
      sun: 0xfff2dc,
      sunI: 3.2,
      hemiSky: 0xa8c8e8,
      hemiGround: 0x6d6a4e,
      hemiI: 1.1,
      fog: 0xbfd4e2,
    },
    {
      e: 1.0,
      zen: 0x1a4f92,
      hor: 0x9cc4e2,
      sea: 0xbbd0de,
      glow: 0xffffff,
      stars: 0.0,
      sun: 0xffffff,
      sunI: 3.4,
      hemiSky: 0xb2d0ea,
      hemiGround: 0x726f52,
      hemiI: 1.15,
      fog: 0xb8cfe0,
    },
  ];

  const makeColor = (hex) => new T.Color(hex);
  const resolved = STOPS.map((s) => ({
    e: s.e,
    zen: makeColor(s.zen),
    hor: makeColor(s.hor),
    sea: makeColor(s.sea),
    glow: makeColor(s.glow),
    stars: s.stars,
    sun: makeColor(s.sun),
    sunI: s.sunI,
    hemiSky: makeColor(s.hemiSky),
    hemiGround: makeColor(s.hemiGround),
    hemiI: s.hemiI,
    fog: makeColor(s.fog),
  }));

  const out = {
    sunDir: new T.Vector3(),
    moonDir: new T.Vector3(),
    lightColor: new T.Color(),
    lightIntensity: 1,
    zen: new T.Color(),
    hor: new T.Color(),
    glow: new T.Color(),
    sea: new T.Color(),
    stars: 0,
    hemiSky: new T.Color(),
    hemiGround: new T.Color(),
    hemiI: 1,
    fog: new T.Color(),
    elevation: 0,
    azimuth: 0,
    night: 0,
    dayLight: 1,
    cloud: new T.Color(),
    cloudOpacity: 1,
    sunVisible: 0,
  };

  function sunAngles(t) {
    return {
      elevation: M.track(t, ELEV),
      azimuth: M.track(t, AZIM),
    };
  }

  SKY.atmos = function (t) {
    const a = sunAngles(t);
    const e = a.elevation;
    out.elevation = e;
    out.azimuth = a.azimuth;

    const ce = Math.cos(e);
    out.sunDir.set(ce * Math.sin(a.azimuth), Math.sin(e), ce * Math.cos(a.azimuth)).normalize();
    out.moonDir.copy(out.sunDir).multiplyScalar(-1);
    out.moonDir.y = Math.abs(out.moonDir.y) * 0.8 + 0.25;
    out.moonDir.normalize();

    let i = 0;
    while (i < resolved.length - 2 && e > resolved[i + 1].e) i++;
    const A = resolved[i];
    const B = resolved[i + 1];
    const k = M.smoothstep(A.e, B.e, e);

    out.zen.copy(A.zen).lerp(B.zen, k);
    out.hor.copy(A.hor).lerp(B.hor, k);
    out.sea.copy(A.sea).lerp(B.sea, k);
    out.glow.copy(A.glow).lerp(B.glow, k);
    out.lightColor.copy(A.sun).lerp(B.sun, k);
    out.lightIntensity = M.lerp(A.sunI, B.sunI, k);
    out.hemiSky.copy(A.hemiSky).lerp(B.hemiSky, k);
    out.hemiGround.copy(A.hemiGround).lerp(B.hemiGround, k);
    out.hemiI = M.lerp(A.hemiI, B.hemiI, k);
    out.fog.copy(A.fog).lerp(B.fog, k);
    out.stars = M.lerp(A.stars, B.stars, k);
    out.night = M.smoothstep(0.1, -0.12, e);
    out.dayLight = M.smoothstep(-0.05, 0.16, e);
    out.sunVisible = M.smoothstep(-0.09, 0.02, e);
    out.cloud.copy(out.glow).lerp(new T.Color(0xffffff), 0.5 + 0.4 * out.dayLight);
    out.cloud.multiplyScalar(0.5 + 0.55 * M.smoothstep(-0.3, 0.25, e));
    out.cloudOpacity = 0.5 + 0.32 * out.dayLight;
    return out;
  };

  SKY.nightAmount = function (t) {
    return SKY.atmos(t).night;
  };

  SKY.ELEV_TRACK = ELEV;
})();
