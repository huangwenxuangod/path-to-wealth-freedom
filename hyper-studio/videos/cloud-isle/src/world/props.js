/* Living details: trees, grass, rocks, flowers, vines, bridges, flames, smoke,
   fireflies and birds. Everything animates analytically from t. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  function softTex(inner, outer) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 1, 64, 64, 62);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.55, outer);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }

  SKY.createProps = function (terrain) {
    const group = new T.Group();
    const rnd = SKY.stream(90210);
    const H = (x, z) => terrain.heightAt(x, z);

    const staticMat = new T.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.92,
      metalness: 0,
    });

    // ---------------- trees ----------------
    const tb = new SKY.Builder(31);
    const treeSpots = [];

    function pine(x, z, s, yOff) {
      const y = (yOff === undefined ? H(x, z) : yOff) + 0;
      tb.cyl(0.07 * s, 0.11 * s, 1.0 * s, 5, 0x6b4a30, SKY.xf(x, y + 0.5 * s, z), 0.05);
      tb.cone(0.75 * s, 1.15 * s, 7, 0x4f7f45, SKY.xf(x, y + 1.35 * s, z), 0.06);
      tb.cone(0.6 * s, 1.0 * s, 7, 0x588a4b, SKY.xf(x, y + 1.95 * s, z), 0.06);
      tb.cone(0.4 * s, 0.8 * s, 7, 0x63975a, SKY.xf(x, y + 2.5 * s, z), 0.06);
      treeSpots.push(new T.Vector3(x, y, z));
    }

    function broadleaf(x, z, s, yOff) {
      const y = (yOff === undefined ? H(x, z) : yOff) + 0;
      tb.cyl(0.1 * s, 0.15 * s, 1.25 * s, 5, 0x6d4c31, SKY.xf(x, y + 0.62 * s, z, 0, rnd.range(0, 3), 0.06), 0.05);
      tb.ico(0.72 * s, 0, 0x6ea24e, SKY.xf(x, y + 1.55 * s, z, 0, rnd.range(0, 3), 0, 1, 0.85, 1), 0.07);
      tb.ico(0.52 * s, 0, 0x7cae58, SKY.xf(x + 0.35 * s, y + 1.9 * s, z - 0.2 * s, 0, rnd.range(0, 3), 0), 0.07);
      tb.ico(0.42 * s, 0, 0x8cba66, SKY.xf(x - 0.4 * s, y + 1.8 * s, z + 0.25 * s, 0, rnd.range(0, 3), 0), 0.07);
      treeSpots.push(new T.Vector3(x, y, z));
    }

    const treePlan = [
      [-7.6, 2.3, 1.05, 0],
      [-6.2, -3.6, 0.95, 1],
      [-8.2, -0.4, 0.8, 0],
      [7.7, 1.6, 1.0, 1],
      [8.0, -2.4, 0.85, 0],
      [5.4, 7.4, 0.9, 0],
      [-3.9, 7.5, 0.8, 1],
      [0.5, 7.9, 0.95, 0],
      [-6.9, -5.4, 0.75, 1],
      [3.6, -6.2, 0.9, 0],
      [6.6, -4.7, 0.7, 1],
      [-1.9, -7.4, 0.85, 0],
    ];
    treePlan.forEach((t) => {
      if (t[3] === 1) broadleaf(t[0], t[1], t[2]);
      else pine(t[0], t[1], t[2]);
    });

    terrain.islets.forEach((isl, i) => {
      const y = isl.y + 0.1;
      if (i === 0) {
        pine(isl.x + 0.4, isl.z + 0.3, 1.15, y);
        pine(isl.x - 0.9, isl.z - 0.6, 0.8, y);
      } else if (i === 1) {
        broadleaf(isl.x - 0.2, isl.z - 0.1, 1.0, y);
      } else {
        pine(isl.x, isl.z, 0.7, y);
      }
    });

    // ---------------- bushes & rocks ----------------
    for (let i = 0; i < 26; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const r = rnd.range(3.6, 8.8);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const s = rnd.range(0.22, 0.5);
      tb.ico(s, 0, i % 3 ? 0x679a4a : 0x77a955, SKY.xf(x, H(x, z) + s * 0.6, z, 0, rnd.range(0, 3), 0, 1, 0.8, 1), 0.1);
    }
    for (let i = 0; i < 34; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const r = rnd.range(3.4, 9.0);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const s = rnd.range(0.1, 0.38);
      tb.ico(s, 0, i % 4 === 0 ? 0x7f7568 : 0x8d8578, SKY.xf(x, H(x, z) + s * 0.45, z, rnd.range(0, 3), rnd.range(0, 3), 0, 1, 0.7, 1), 0.08);
    }

    // ---------------- rim vines ----------------
    for (let i = 0; i < 18; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const r = terrain.radiusAt(a) * rnd.range(0.97, 1.0);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const len = rnd.range(0.8, 2.6);
      tb.box(0.05, len, 0.05, 0x4f7a42, SKY.xf(x, -0.2 - len / 2, z), 0.05);
      tb.ico(0.14, 0, 0x5d8c4c, SKY.xf(x, -0.25 - len, z, 0, 0, 0, 1, 0.6, 1), 0.05);
    }

    // ---------------- bridges ----------------
    function bridge(from, to) {
      const dx = to.x - from.x;
      const dz = to.z - from.z;
      const len = Math.hypot(dx, dz);
      const ang = Math.atan2(dz, dx);
      const steps = Math.max(6, Math.round(len / 0.42));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = from.x + dx * t;
        const z = from.z + dz * t;
        const sag = Math.sin(t * Math.PI) * 0.45;
        const y = M.lerp(from.y, to.y, t) - sag;
        tb.box(0.42, 0.07, 0.9, 0x8a6a46, SKY.xf(x, y, z, 0, -ang, 0.06 * Math.sin(t * 9.0)), 0.09);
        if (i % 3 === 0 && i < steps) {
          tb.box(0.07, 0.55, 0.07, 0x6b4f34, SKY.xf(x + Math.cos(ang + Math.PI / 2) * 0.5, y + 0.2, z + Math.sin(ang + Math.PI / 2) * 0.5), 0);
          tb.box(0.07, 0.55, 0.07, 0x6b4f34, SKY.xf(x - Math.cos(ang + Math.PI / 2) * 0.5, y + 0.2, z - Math.sin(ang + Math.PI / 2) * 0.5), 0);
        }
      }
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < steps; i++) {
          const t0 = i / steps;
          const t1 = (i + 1) / steps;
          const p0 = {
            x: from.x + dx * t0 + Math.cos(ang + Math.PI / 2) * 0.5 * side,
            z: from.z + dz * t0 + Math.sin(ang + Math.PI / 2) * 0.5 * side,
            y: M.lerp(from.y, to.y, t0) - Math.sin(t0 * Math.PI) * 0.45 + 0.62,
          };
          const p1 = {
            x: from.x + dx * t1 + Math.cos(ang + Math.PI / 2) * 0.5 * side,
            z: from.z + dz * t1 + Math.sin(ang + Math.PI / 2) * 0.5 * side,
            y: M.lerp(from.y, to.y, t1) - Math.sin(t1 * Math.PI) * 0.45 + 0.62,
          };
          const mx = (p0.x + p1.x) / 2;
          const mz = (p0.z + p1.z) / 2;
          const my = (p0.y + p1.y) / 2;
          const l = Math.hypot(p1.x - p0.x, p1.z - p0.z, p1.y - p0.y);
          tb.box(l, 0.035, 0.035, 0x7d6244, SKY.xf(mx, my, mz, 0, -Math.atan2(p1.z - p0.z, p1.x - p0.x), Math.atan2(p1.y - p0.y, l)), 0);
        }
      }
    }

    terrain.islets.forEach((isl) => {
      const d = Math.hypot(isl.x, isl.z);
      const ux = isl.x / d;
      const uz = isl.z / d;
      const fromMain = { x: ux * 9.15, y: H(ux * 9.15, uz * 9.15) - 0.1, z: uz * 9.15 };
      const toIslet = { x: isl.x - ux * (isl.R * 0.86), y: isl.y + 0.12, z: isl.z - uz * (isl.R * 0.86) };
      if (d < 16.5) bridge(fromMain, toIslet);
    });

    const staticMesh = new T.Mesh(tb.build(), staticMat);
    staticMesh.castShadow = true;
    staticMesh.receiveShadow = true;
    group.add(staticMesh);

    // ---------------- grass (instanced) ----------------
    const bladeGeo = new T.ConeGeometry(0.055, 0.3, 3, 1);
    bladeGeo.translate(0, 0.15, 0);
    const bladeMat = new T.MeshStandardMaterial({ flatShading: true, roughness: 1, metalness: 0 });
    const bladeCount = 1500;
    const blades = new T.InstancedMesh(bladeGeo, bladeMat, bladeCount);
    blades.receiveShadow = true;
    const mtx = new T.Matrix4();
    const q = new T.Quaternion();
    const eul = new T.Euler();
    const pos = new T.Vector3();
    const scl = new T.Vector3();
    const col = new T.Color();
    let bi = 0;
    let guard = 0;
    while (bi < bladeCount && guard < bladeCount * 12) {
      guard++;
      const a = rnd.range(0, Math.PI * 2);
      const r = 3.5 + Math.pow(rnd.next(), 0.55) * 5.3;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (r < 3.4) continue;
      if (Math.hypot(x - 1.15, z - 0.95) < 1.0) continue;
      const s = rnd.range(0.7, 1.5);
      eul.set(rnd.range(-0.15, 0.15), rnd.range(0, 6.28), rnd.range(-0.15, 0.15));
      q.setFromEuler(eul);
      pos.set(x, H(x, z) - 0.02, z);
      scl.set(s, s * rnd.range(0.8, 1.4), s);
      mtx.compose(pos, q, scl);
      blades.setMatrixAt(bi, mtx);
      col.setHSL(0.28 + rnd.range(-0.02, 0.02), 0.4, 0.26 + rnd.range(-0.04, 0.06));
      blades.setColorAt(bi, col);
      bi++;
    }
    blades.count = bi;
    blades.instanceMatrix.needsUpdate = true;
    if (blades.instanceColor) blades.instanceColor.needsUpdate = true;
    group.add(blades);

    // ---------------- flowers ----------------
    const fb = new SKY.Builder(41);
    const petalColors = [0xf2e2a4, 0xe9a3a0, 0xd9d3ef, 0xf0c47a];
    for (let i = 0; i < 90; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const r = 3.6 + Math.pow(rnd.next(), 0.5) * 5.0;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = H(x, z) + 0.16;
      fb.sphere(0.065, 4, 3, petalColors[i % petalColors.length], SKY.xf(x, y, z, 0, rnd.range(0, 3), 0, 1, 0.7, 1), 0.12);
      fb.box(0.02, 0.16, 0.02, 0x5f8f45, SKY.xf(x, y - 0.08, z), 0);
    }
    group.add(new T.Mesh(fb.build(), staticMat));

    // ---------------- lantern posts ----------------
    const postSpots = [
      [1.9, 2.2],
      [-2.0, 1.9],
      [-4.4, 4.0],
      [3.4, 2.4],
    ];
    const lb = new SKY.Builder(42);
    postSpots.forEach((p) => {
      const y = H(p[0], p[1]);
      lb.box(0.09, 1.7, 0.09, 0x6b4a31, SKY.xf(p[0], y + 0.85, p[1]), 0);
      lb.box(0.34, 0.06, 0.06, 0x6b4a31, SKY.xf(p[0] + 0.16, y + 1.68, p[1]), 0);
    });
    const postMesh = new T.Mesh(lb.build(), staticMat);
    postMesh.castShadow = true;
    group.add(postMesh);

    const lampMat = new T.MeshBasicMaterial({ color: 0x6a5a44, fog: false });
    const lampB = new SKY.Builder(43);
    postSpots.forEach((p) => {
      const y = H(p[0], p[1]);
      lampB.sphere(0.13, 6, 5, 0xffffff, SKY.xf(p[0] + 0.3, y + 1.55, p[1]), 0);
    });
    group.add(new T.Mesh(lampB.build(), lampMat));

    // ---------------- fire ----------------
    const fireGroup = new T.Group();
    const flameMatA = new T.MeshBasicMaterial({ color: 0xff5f18, transparent: true, opacity: 0.85, fog: false, depthWrite: false, blending: T.AdditiveBlending });
    const flameMatB = new T.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.85, fog: false, depthWrite: false, blending: T.AdditiveBlending });
    const flameMatC = new T.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.9, fog: false, depthWrite: false, blending: T.AdditiveBlending });
    const f1 = new T.Mesh(new T.ConeGeometry(0.44, 1.0, 7), flameMatA);
    const f2 = new T.Mesh(new T.ConeGeometry(0.3, 1.25, 6), flameMatB);
    const f3 = new T.Mesh(new T.ConeGeometry(0.15, 0.9, 5), flameMatC);
    f1.position.set(0, 0.42, 0);
    f2.position.set(0, 0.58, 0);
    f3.position.set(0, 0.7, 0);
    fireGroup.add(f1, f2, f3);

    const glowTex = (function () {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(64, 64, 1, 64, 64, 62);
      grad.addColorStop(0, 'rgba(255,210,150,0.95)');
      grad.addColorStop(0.35, 'rgba(255,150,60,0.42)');
      grad.addColorStop(1, 'rgba(255,120,40,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      return t;
    })();
    const glowMat = new T.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: 0.5 });
    const glow = new T.Mesh(new T.PlaneGeometry(2.4, 2.4), glowMat);
    glow.position.y = 0.6;
    fireGroup.add(glow);

    const fireY = H(-1.35, 0.65);
    fireGroup.position.set(-1.35, fireY + 0.05, 0.65);
    group.add(fireGroup);

    const fireLight = new T.PointLight(0xff9b45, 0, 12, 2);
    fireLight.position.set(-1.35, fireY + 1.0, 0.65);
    group.add(fireLight);

    const sparkGeo = new T.SphereGeometry(0.045, 4, 3);
    const sparkMat = new T.MeshBasicMaterial({ color: 0xffc76b, fog: false, transparent: true, opacity: 0.9 });
    const SPARKS = 22;
    const sparks = new T.InstancedMesh(sparkGeo, sparkMat, SPARKS);
    const sparkSeed = [];
    for (let i = 0; i < SPARKS; i++) sparkSeed.push({ a: rnd.range(0, 6.28), r: rnd.range(0, 0.3), s: rnd.range(0.6, 1.4), p: rnd.range(0, 1) });
    group.add(sparks);

    // ---------------- smoke ----------------
    const smokeTex = softTex('rgba(255,255,255,0.9)', 'rgba(240,240,245,0.35)');
    const smokeMat = new T.MeshBasicMaterial({ map: smokeTex, transparent: true, opacity: 0.3, depthWrite: false, fog: false, color: 0xdfe4ea });
    const smokePuffs = [];
    const smokeGroup = new T.Group();
    group.add(smokeGroup);

    // ---------------- fireflies ----------------
    const ffGeo = new T.SphereGeometry(0.045, 4, 3);
    const ffMat = new T.MeshBasicMaterial({ color: 0xffe68a, transparent: true, opacity: 0, fog: false, depthWrite: false });
    const FF = 46;
    const fireflies = new T.InstancedMesh(ffGeo, ffMat, FF);
    const ffSeed = [];
    for (let i = 0; i < FF; i++) {
      const a = rnd.range(0, 6.28);
      const r = rnd.range(2.0, 8.0);
      ffSeed.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, phase: rnd.range(0, 6.28), sp: rnd.range(0.3, 0.8), h: rnd.range(0.5, 2.2) });
    }
    group.add(fireflies);

    // ---------------- birds ----------------
    const birdB = new SKY.Builder(44);
    birdB.box(0.34, 0.02, 0.07, 0x2f3540, SKY.xf(-0.15, 0, 0, 0, 0, 0.32), 0);
    birdB.box(0.34, 0.02, 0.07, 0x2f3540, SKY.xf(0.15, 0, 0, 0, 0, -0.32), 0);
    const birdGeo = birdB.build();
    const birdMat = new T.MeshBasicMaterial({ vertexColors: true, fog: false });
    const BIRDS = 7;
    const birds = new T.InstancedMesh(birdGeo, birdMat, BIRDS);
    const birdSeed = [];
    for (let i = 0; i < BIRDS; i++) {
      birdSeed.push({ a: rnd.range(0, 6.28), r: rnd.range(11, 17), y: rnd.range(6, 10), sp: rnd.range(0.22, 0.34), off: rnd.range(0, 6.28) });
    }
    group.add(birds);

    function attachSmoke(spots) {
      spots.smoke.forEach((p) => {
        for (let i = 0; i < 7; i++) {
          const m = new T.Mesh(new T.PlaneGeometry(1, 1), smokeMat);
          m.userData = { base: p.clone(), phase: i / 7, spin: rnd.range(0, 6.28) };
          m.scale.set(0.5, 0.5, 1);
          smokePuffs.push(m);
          smokeGroup.add(m);
        }
      });
    }

    const _m = new T.Matrix4();
    const _p = new T.Vector3();
    const _q = new T.Quaternion();
    const _s = new T.Vector3();
    const _e = new T.Euler();
    const camQ = new T.Quaternion();

    function preRender(camera) {
      camQ.copy(camera.quaternion);
    }

    function update(t, atmos) {
      blades.rotation.z = Math.sin(t * 0.9) * 0.004;

      const flick = 0.9 + 0.25 * Math.sin(t * 11.0) + 0.12 * Math.sin(t * 27.0 + 1.3);
      f1.scale.set(1 + 0.07 * Math.sin(t * 9.0), flick, 1 + 0.07 * Math.cos(t * 8.0));
      f2.scale.set(1 + 0.1 * Math.sin(t * 13.0), flick * 1.08, 1 + 0.1 * Math.cos(t * 11.0));
      f3.scale.set(1 + 0.14 * Math.sin(t * 17.0), flick * 1.15, 1 + 0.14 * Math.cos(t * 15.0));
      f1.rotation.y = t * 1.5;
      f2.rotation.y = -t * 1.9;
      f3.rotation.y = t * 2.7;
      glow.quaternion.copy(camQ);
      glow.scale.setScalar(0.9 + 0.12 * flick);
      glowMat.opacity = 0.28 + 0.18 * flick;
      const night = atmos.night;
      fireLight.intensity = (2.2 + 0.55 * Math.sin(t * 12.3) + 0.3 * Math.sin(t * 31.1)) * (0.55 + 0.75 * night);
      flameMatA.opacity = 0.7 + 0.12 * Math.sin(t * 17.0);

      for (let i = 0; i < SPARKS; i++) {
        const s = sparkSeed[i];
        const cyc = (t * 0.55 * s.s + s.p) % 1;
        _p.set(
          Math.cos(s.a + cyc * 2.2) * s.r * (1 + cyc),
          cyc * 1.9,
          Math.sin(s.a + cyc * 2.2) * s.r * (1 + cyc)
        );
        _p.add(fireGroup.position);
        const sc = (1 - cyc) * 0.9;
        _s.set(sc, sc, sc);
        _q.identity();
        _m.compose(_p, _q, _s);
        sparks.setMatrixAt(i, _m);
      }
      sparks.instanceMatrix.needsUpdate = true;
      sparkMat.opacity = 0.85 * (0.5 + 0.5 * night);

      smokeMat.opacity = 0.26 * (0.6 + 0.4 * atmos.dayLight);
      for (let i = 0; i < smokePuffs.length; i++) {
        const m = smokePuffs[i];
        const cyc = (t * 0.18 + m.userData.phase) % 1;
        m.position.copy(m.userData.base);
        m.position.y += cyc * 3.4;
        m.position.x += Math.sin(cyc * 3.0 + m.userData.spin) * 0.35 + cyc * 0.55;
        const sc = 0.35 + cyc * 1.5;
        m.scale.set(sc, sc, 1);
        m.quaternion.copy(camQ);
      }

      for (let i = 0; i < FF; i++) {
        const f = ffSeed[i];
        const ph = t * f.sp + f.phase;
        _p.set(f.x + Math.sin(ph) * 0.9, H(f.x, f.z) + 0.5 + Math.sin(ph * 1.7) * 0.35 + f.h * 0.15, f.z + Math.cos(ph * 0.8) * 0.9);
        const sc = 0.7 + 0.5 * Math.sin(ph * 5.0);
        _s.set(sc, sc, sc);
        _q.identity();
        _m.compose(_p, _q, _s);
        fireflies.setMatrixAt(i, _m);
      }
      fireflies.instanceMatrix.needsUpdate = true;
      ffMat.opacity = 0.9 * M.smoothstep(0.35, 0.85, night);

      const lamp = M.smoothstep(0.3, 0.8, night);
      lampMat.color.setRGB(M.lerp(0.42, 1.0, lamp), M.lerp(0.35, 0.78, lamp), M.lerp(0.27, 0.42, lamp));

      const dawn = M.smoothstep(0.0, 3.0, t) * (1 - M.smoothstep(16, 22, t));
      birds.visible = dawn > 0.02;
      if (birds.visible) {
        for (let i = 0; i < BIRDS; i++) {
          const b = birdSeed[i];
          const ang = t * b.sp + b.off;
          _p.set(Math.cos(ang) * b.r, b.y + Math.sin(t * 0.7 + i) * 0.5 - t * 0.05, Math.sin(ang) * b.r);
          const flap = Math.sin(t * 9.0 + i * 1.7) * 0.5;
          _e.set(0, -ang + Math.PI / 2, flap);
          _q.setFromEuler(_e);
          _s.set(1, 1, 1);
          _m.compose(_p, _q, _s);
          birds.setMatrixAt(i, _m);
        }
        birds.instanceMatrix.needsUpdate = true;
      }
    }

    return { group, update, attachSmoke, preRender, treeSpots };
  };
})();
