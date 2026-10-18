/* The floating island: grass plateau, cliff band, rocky underside.
   Pure deterministic geometry, merged into one mesh with vertex colours. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  const DIRT = 0xa4835c;
  const ROCK = [0xb3a795, 0x9c9081, 0x877b6c, 0x70665a, 0x5a5248];
  const GRASS = [0x6f9c4b, 0x5f8c40, 0x527b37, 0x44682e];

  function buildIsland(R, seed, opt) {
    const o = opt || {};
    const seg = o.seg || 64;
    const rings = o.rings || 9;
    const depth = o.depth === undefined ? 1 : o.depth;
    const rnd = SKY.stream(seed);

    const p1 = rnd.range(0, 6.28);
    const p2 = rnd.range(0, 6.28);
    const p3 = rnd.range(0, 6.28);
    const a1 = 0.05 + rnd.range(0, 0.03);
    const a2 = 0.028 + rnd.range(0, 0.018);
    const a3 = 0.014 + rnd.range(0, 0.01);
    const domeH = (o.dome === undefined ? 0.34 : o.dome) * (R / 9.6);

    const rAt = (th) =>
      R * (1 + a1 * Math.sin(3 * th + p1) + a2 * Math.sin(5 * th + p2) + a3 * Math.sin(9 * th + p3));

    const yAt = (u) => domeH * (1 - u * u) * (1 + 0.2 * Math.sin(u * 5.1 + p1));

    const pos = [];
    const col = [];
    const c = new T.Color();

    function tri(ax, ay, az, bx, by, bz, cx, cy, cz, hex, shade) {
      pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
      c.setHex(hex);
      const k = shade;
      col.push(c.r * k, c.g * k, c.b * k, c.r * k, c.g * k, c.b * k, c.r * k, c.g * k, c.b * k);
    }

    const P = (u, th) => ({
      x: Math.cos(th) * rAt(th) * u,
      y: yAt(u),
      z: Math.sin(th) * rAt(th) * u,
    });

    // ---------- grass plateau ----------
    for (let k = 0; k < rings; k++) {
      const u0 = k === 0 ? 0 : k / rings;
      const u1 = (k + 1) / rings;
      for (let j = 0; j < seg; j++) {
        const th0 = (j / seg) * Math.PI * 2;
        const th1 = ((j + 1) / seg) * Math.PI * 2;
        const p00 = P(u0, th0);
        const p01 = P(u0, th1);
        const p10 = P(u1, th0);
        const p11 = P(u1, th1);

        const th = (th0 + th1) * 0.5;
        const n =
          0.55 * M.noise1(th * 1.7 + u1 * 2.3, seed * 0.01) +
          0.45 * M.noise1(th * 4.1 - u1 * 3.1 + 11.0, seed * 0.02);
        let base = n > 0.66 ? GRASS[0] : n > 0.5 ? GRASS[1] : n > 0.36 ? GRASS[2] : GRASS[3];
        // dirt showing through near the rim
        if (u1 > 0.9) base = M.noise1(th * 6.0, 3.0) > 0.55 ? DIRT : base;
        const shade = 0.92 + 0.14 * n;

        if (k === 0) {
          tri(0, yAt(0), 0, p11.x, p11.y, p11.z, p10.x, p10.y, p10.z, base, shade);
        } else {
          tri(p00.x, p00.y, p00.z, p01.x, p01.y, p01.z, p10.x, p10.y, p10.z, base, shade);
          tri(p01.x, p01.y, p01.z, p11.x, p11.y, p11.z, p10.x, p10.y, p10.z, base, shade * 0.97);
        }
      }
    }

    // ---------- cliff band + rocky underside ----------
    const levels = [
      { u: 1.0, y: 0.0, hex: DIRT },
      { u: 0.995, y: -0.5, hex: DIRT },
      { u: 0.93, y: -1.5, hex: ROCK[0] },
      { u: 0.82, y: -2.8, hex: ROCK[1] },
      { u: 0.66, y: -4.1, hex: ROCK[2] },
      { u: 0.46, y: -5.2, hex: ROCK[3] },
      { u: 0.24, y: -6.1, hex: ROCK[4] },
      { u: 0.0, y: -6.7, hex: ROCK[4] },
    ];

    function ringPoint(li, th) {
      const L = levels[li];
      const jitter = 1 + 0.05 * Math.sin(7 * th + li * 1.7 + p2);
      const u = L.u * jitter;
      return {
        x: Math.cos(th) * rAt(th) * u,
        y: L.y * depth,
        z: Math.sin(th) * rAt(th) * u,
      };
    }

    for (let li = 0; li < levels.length - 1; li++) {
      const B = levels[li + 1];
      for (let j = 0; j < seg; j++) {
        const th0 = (j / seg) * Math.PI * 2;
        const th1 = ((j + 1) / seg) * Math.PI * 2;
        const p00 = ringPoint(li, th0);
        const p01 = ringPoint(li, th1);
        const p10 = ringPoint(li + 1, th0);
        const p11 = ringPoint(li + 1, th1);
        const th = (th0 + th1) * 0.5;
        const band = M.noise1(th * 3.0 + li * 1.9, seed * 0.03);
        const hex = band > 0.6 ? levels[li].hex : band > 0.3 ? B.hex : ROCK[Math.min(li + 1, 4)];
        const shade = 0.9 + 0.16 * M.noise1(th * 5.0 + li, 4.0);

        if (B.u === 0) {
          tri(p00.x, p00.y, p00.z, p01.x, p01.y, p01.z, 0, B.y * depth, 0, hex, shade);
        } else {
          tri(p00.x, p00.y, p00.z, p01.x, p01.y, p01.z, p10.x, p10.y, p10.z, hex, shade);
          tri(p01.x, p01.y, p01.z, p11.x, p11.y, p11.z, p10.x, p10.y, p10.z, hex, shade * 0.95);
        }
      }
    }

    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    return { geo, rAt, yAt };
  }

  SKY.createTerrain = function () {
    const group = new T.Group();
    const mat = new T.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
      flatShading: true,
    });

    const main = buildIsland(9.6, 4401, { seg: 80, rings: 11, dome: 0.34, depth: 1 });
    const mainMesh = new T.Mesh(main.geo, mat);
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    mainMesh.name = 'main-island';
    group.add(mainMesh);

    const islets = [
      { x: -14.6, z: -3.0, y: 1.0, R: 2.6, seed: 771 },
      { x: 13.6, z: 5.2, y: 1.8, R: 1.9, seed: 913 },
      { x: -7.6, z: 13.2, y: 2.6, R: 1.4, seed: 331 },
    ];
    const isletInfo = [];
    islets.forEach((i) => {
      const b = buildIsland(i.R, i.seed, { seg: 44, rings: 7, dome: 0.24, depth: 0.72 });
      const m = new T.Mesh(b.geo, mat);
      m.position.set(i.x, i.y, i.z);
      m.castShadow = true;
      m.receiveShadow = true;
      group.add(m);
      isletInfo.push({ x: i.x, z: i.z, y: i.y, R: i.R, rAt: b.rAt, yAt: b.yAt, mesh: m, all: i });
    });

    function heightAt(x, z) {
      const d = Math.hypot(x, z);
      const th = Math.atan2(z, x);
      const Ry = main.rAt(th);
      const u = M.clamp(d / Ry, 0, 1);
      return main.yAt(u);
    }

    return { group, heightAt, islets: isletInfo, radiusAt: main.rAt, material: mat };
  };
})();
