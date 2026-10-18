/* Twelve villagers built from primitives, walking a timetable and acting it out.
   Every frame is a pure function of t: position, facing, pose, opacity. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  const HIP = 0.4;
  const TORSO = 0.46;
  const SHOULDER = 0.84;
  const HEAD = 0.96;

  function buildBody(def, seed) {
    const b = new SKY.Builder(seed);
    b.box(0.33, TORSO, 0.21, def.coat, SKY.xf(0, HIP + TORSO / 2, 0), 0.02);
    b.box(0.34, 0.08, 0.22, def.pants, SKY.xf(0, HIP + 0.06, 0), 0.02);
    b.box(0.13, 0.1, 0.13, def.skin, SKY.xf(0, SHOULDER + 0.02, 0), 0);
    // collar
    b.box(0.2, 0.05, 0.16, 0xf1e8d6, SKY.xf(0, SHOULDER - 0.02, 0.01), 0);
    return b.build();
  }

  function buildHead(def, seed) {
    const b = new SKY.Builder(seed);
    b.sphere(0.135, 8, 7, def.skin, SKY.xf(0, 0.1, 0), 0);
    // eyes
    b.sphere(0.022, 4, 3, 0x2b2b30, SKY.xf(-0.05, 0.12, 0.12), 0);
    b.sphere(0.022, 4, 3, 0x2b2b30, SKY.xf(0.05, 0.12, 0.12), 0);
    if (def.hatStyle === 'straw') {
      b.cyl(0.3, 0.3, 0.025, 9, def.hatColor, SKY.xf(0, 0.2, 0), 0.04);
      b.cyl(0.14, 0.17, 0.1, 8, def.hatColor, SKY.xf(0, 0.25, 0), 0.04);
    } else if (def.hatStyle === 'cap') {
      b.sphere(0.145, 8, 5, def.hatColor, SKY.xf(0, 0.15, 0, 0, 0, 0, 1, 0.7, 1), 0.03);
      b.box(0.26, 0.02, 0.14, def.hatColor, SKY.xf(0, 0.15, 0.12), 0);
    } else if (def.hatStyle === 'hood') {
      b.sphere(0.155, 8, 6, def.hatColor, SKY.xf(0, 0.12, -0.01), 0.03);
    } else {
      b.sphere(0.13, 7, 5, 0x5a4030, SKY.xf(0, 0.2, 0, 0, 0, 0, 1, 0.55, 1), 0.05);
    }
    return b.build();
  }

  function limb(len, thick, color, endColor) {
    const b = new SKY.Builder(1);
    b.box(thick, len, thick, color, SKY.xf(0, -len / 2, 0), 0.02);
    if (endColor) b.sphere(thick * 0.62, 5, 4, endColor, SKY.xf(0, -len, 0), 0);
    return b.build();
  }

  SKY.createVillagers = function (terrain, village) {
    const group = new T.Group();
    const defs = SKY.buildSchedule(village.spots);
    const items = [];

    const fire = village.spots.fire;
    const well = village.spots.well;
    const market = village.spots.market;

    defs.forEach((def, i) => {
      const mat = new T.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        roughness: 0.86,
        metalness: 0,
        transparent: true,
        opacity: 1,
      });

      const root = new T.Group();
      const body = new T.Group();
      root.add(body);

      const bodyMesh = new T.Mesh(buildBody(def, 100 + i), mat);
      bodyMesh.castShadow = true;
      body.add(bodyMesh);

      const headGroup = new T.Group();
      headGroup.position.y = HEAD;
      const headMesh = new T.Mesh(buildHead(def, 200 + i), mat);
      headMesh.castShadow = true;
      headGroup.add(headMesh);
      body.add(headGroup);

      const armGeo = limb(0.34, 0.075, def.coat, def.skin);
      const armL = new T.Group();
      armL.position.set(-0.2, SHOULDER, 0);
      const armLMesh = new T.Mesh(armGeo, mat);
      armLMesh.castShadow = true;
      armL.add(armLMesh);
      body.add(armL);

      const armR = new T.Group();
      armR.position.set(0.2, SHOULDER, 0);
      const armRMesh = new T.Mesh(armGeo, mat);
      armRMesh.castShadow = true;
      armR.add(armRMesh);
      body.add(armR);

      const legGeo = limb(0.38, 0.095, def.pants, 0x3a3128);
      const legL = new T.Group();
      legL.position.set(-0.085, HIP, 0);
      legL.add(new T.Mesh(legGeo, mat));
      body.add(legL);

      const legR = new T.Group();
      legR.position.set(0.085, HIP, 0);
      legR.add(new T.Mesh(legGeo, mat));
      body.add(legR);

      root.scale.setScalar(def.scale);
      group.add(root);

      items.push({
        def,
        root,
        body,
        head: headGroup,
        armL,
        armR,
        legL,
        legR,
        mat,
        meshes: [bodyMesh, headMesh, armLMesh, armRMesh],
        opacity: 1,
      });
    });

    const _a = new T.Vector3();
    const _b = new T.Vector3();
    const _p = new T.Vector3();

    /** Where a villager stands when staying at a spot. */
    function stayPosition(def, stop, out) {
      const i = def.index;
      const base = stop.pos;
      if (stop.spot === 'fire') {
        const a = (i / 12) * Math.PI * 2 + 0.35;
        return out.set(base.x + Math.cos(a) * 0.95, 0, base.z + Math.sin(a) * 0.95);
      }
      if (stop.spot === 'well') {
        const a = (i / 12) * Math.PI * 2 + 0.9;
        return out.set(base.x + Math.cos(a) * 1.15, 0, base.z + Math.sin(a) * 1.15);
      }
      if (stop.spot === 'market0' || stop.spot === 'market1') {
        const side = i % 2 === 0 ? 1 : -1;
        return out.set(base.x + side * 0.45 + ((i % 3) - 1) * 0.2, 0, base.z + 0.95 + (i % 2) * 0.3);
      }
      if (stop.spot === 'farm0' || stop.spot === 'farm1') {
        const col = i % 3;
        const row = Math.floor(i / 3) % 3;
        return out.set(base.x + (col - 1) * 0.95, 0, base.z + (row - 1) * 0.7);
      }
      return out.set(base.x + (i % 3) * 0.16 - 0.16, 0, base.z + (i % 4) * 0.14 - 0.2);
    }

    function poseFor(act, t, phase) {
      const s = Math.sin(phase);
      const c = Math.cos(phase);
      const p = {
        lean: 0.05,
        bob: 0,
        headYaw: 0,
        headPitch: 0,
        armL: 0.05 + 0.03 * Math.sin(t * 1.3),
        armR: 0.05 + 0.03 * Math.sin(t * 1.3 + 1.1),
        armZL: 0.04,
        armZR: -0.04,
        legL: 0,
        legR: 0,
        roll: 0,
        yOff: 0,
      };
      switch (act) {
        case 'walk':
          p.legL = s * 0.62;
          p.legR = -s * 0.62;
          p.armL = -s * 0.5;
          p.armR = s * 0.5;
          p.lean = 0.07;
          p.bob = Math.abs(c) * 0.028;
          break;
        case 'work':
          p.lean = 0.52 + Math.sin(t * 2.2) * 0.16;
          p.armL = -1.15 + Math.sin(t * 2.2) * 0.55;
          p.armR = -1.05 + Math.sin(t * 2.2 + 0.3) * 0.5;
          p.legL = 0.14;
          p.legR = -0.1;
          p.bob = -0.02;
          break;
        case 'sell':
          p.lean = -0.02;
          p.armR = -1.45 + Math.sin(t * 2.6) * 0.18;
          p.armR = -1.45;
          p.armL = -0.35 + Math.sin(t * 1.9 + 0.8) * 0.22;
          p.headYaw = Math.sin(t * 0.9) * 0.28;
          break;
        case 'browse':
          p.lean = 0.08;
          p.armL = -0.55 + Math.sin(t * 1.6) * 0.16;
          p.armR = -0.18 + Math.sin(t * 1.2 + 2) * 0.1;
          p.headYaw = Math.sin(t * 0.75 + 1) * 0.42;
          p.headPitch = 0.08;
          break;
        case 'draw':
          p.lean = 0.16;
          p.armL = -1.0 + Math.sin(t * 2.4) * 0.5;
          p.armR = -1.0 + Math.sin(t * 2.4 + Math.PI) * 0.5;
          p.headPitch = 0.2;
          break;
        case 'fish':
          p.lean = 0.12;
          p.armL = -1.2;
          p.armR = -1.1;
          p.headPitch = 0.18;
          p.bob = Math.sin(t * 0.8) * 0.01;
          break;
        case 'carry':
          p.lean = 0.2;
          p.armL = -1.35;
          p.armR = -1.35;
          p.bob = Math.abs(Math.sin(t * 4.2)) * 0.02;
          break;
        case 'sit':
          p.legL = 1.35;
          p.legR = 1.25;
          p.lean = -0.06;
          p.armL = -0.55;
          p.armR = -0.5;
          p.yOff = -0.34;
          p.headYaw = Math.sin(t * 0.55 + 1.3) * 0.45;
          break;
        case 'play':
          p.legL = s * 0.8;
          p.legR = -s * 0.8;
          p.armL = -1.6 + Math.sin(t * 3) * 0.5;
          p.armR = -1.7 + Math.sin(t * 3.4) * 0.5;
          p.lean = 0.12;
          p.bob = Math.abs(c) * 0.05;
          p.roll = Math.sin(t * 2.6) * 0.1;
          break;
        case 'idle':
        default:
          p.armL = 0.06 + 0.04 * Math.sin(t * 1.1);
          p.armR = 0.06 + 0.04 * Math.sin(t * 1.1 + 0.9);
          p.bob = Math.sin(t * 1.5) * 0.006;
          p.headYaw = Math.sin(t * 0.5) * 0.35;
          break;
      }
      return p;
    }

    function blend(a, b, k, out) {
      out.lean = M.lerp(a.lean, b.lean, k);
      out.bob = M.lerp(a.bob, b.bob, k);
      out.headYaw = M.lerp(a.headYaw, b.headYaw, k);
      out.headPitch = M.lerp(a.headPitch, b.headPitch, k);
      out.armL = M.lerp(a.armL, b.armL, k);
      out.armR = M.lerp(a.armR, b.armR, k);
      out.armZL = M.lerp(a.armZL, b.armZL, k);
      out.armZR = M.lerp(a.armZR, b.armZR, k);
      out.legL = M.lerp(a.legL, b.legL, k);
      out.legR = M.lerp(a.legR, b.legR, k);
      out.roll = M.lerp(a.roll, b.roll, k);
      out.yOff = M.lerp(a.yOff, b.yOff, k);
      return out;
    }

    const rest = poseFor('idle', 0, 0);
    const pa = poseFor('idle', 0, 0);
    const pb = poseFor('idle', 0, 0);
    const pOut = poseFor('idle', 0, 0);

    function updateOne(it, t) {
      const def = it.def;
      const stops = def.stops;
      let pos = null;
      let facing = 0;
      let act = 'idle';
      let opacity = 1;
      let yOff = 0;

      // before the day starts / after it ends -> inside the house
      if (t <= stops[0].t0) {
        act = 'inside';
      } else if (t >= stops[stops.length - 1].t1) {
        act = 'inside';
      }

      let stayIndex = -1;
      let walkFrom = -1;
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        if (t >= s.t0 && t <= s.t1) {
          stayIndex = i;
          break;
        }
        if (i < stops.length - 1 && t > s.t1 && t < stops[i + 1].t0) {
          walkFrom = i;
          break;
        }
      }

      if (stayIndex >= 0) {
        const s = stops[stayIndex];
        act = s.act;
        stayPosition(def, s, _p);
        pos = _p;
        const towards = Math.atan2(_p.x, _p.z);
        facing = s.spot === 'fire' ? Math.atan2(fire.x - _p.x, fire.z - _p.z) : towards + Math.PI;
        if (s.spot === 'fire') facing = Math.atan2(fire.x - _p.x, fire.z - _p.z);
        else facing = towards + Math.PI;
      } else if (walkFrom >= 0) {
        const a = stops[walkFrom];
        const b = stops[walkFrom + 1];
        const span = Math.max(0.001, b.t0 - a.t1);
        const k = M.clamp((t - a.t1) / span, 0, 1);
        const ease = M.smootherstep(0, 1, k);
        stayPosition(def, a, _a);
        stayPosition(def, b, _b);
        _p.lerpVectors(_a, _b, ease);
        // gentle arc so paths do not look like straight lines
        const dx = _b.x - _a.x;
        const dz = _b.z - _a.z;
        const len = Math.hypot(dx, dz) || 1;
        const bend = Math.sin(ease * Math.PI) * Math.min(0.7, len * 0.18);
        _p.x += (-dz / len) * bend;
        _p.z += (dx / len) * bend;
        pos = _p;
        facing = Math.atan2(dx, dz);
        act = 'walk';
        it.lastPhase = ease * len * 6.4;
        // fade in when leaving the house, fade out when entering it
        if (a.spot.indexOf('home') === 0 && k < 0.22) opacity = k / 0.22;
        if (b.spot.indexOf('home') === 0 && k > 0.78) opacity = 1 - (k - 0.78) / 0.22;
      }

      if (act === 'inside') {
        const s = staysInside(stops, t);
        stayPosition(def, s, _p);
        pos = _p;
        facing = def.stops[0].pos === undefined ? 0 : Math.atan2(_p.x, _p.z) + Math.PI;
        opacity = 0;
      }

      if (!pos) {
        pos = _p;
      }

      const groundY = terrain.heightAt(pos.x, pos.z);

      // pose
      let pose;
      if (act === 'walk') {
        pose = poseFor('walk', t, it.lastPhase || 0);
      } else if (act === 'play') {
        // kids run in a little circle around the spot
        const s = stops[stayIndex];
        const ang = t * 1.6 + def.index;
        const r = 0.9;
        pos.set(s.pos.x + Math.cos(ang) * r, 0, s.pos.z + Math.sin(ang) * r);
        facing = -ang + Math.PI / 2;
        pose = poseFor('play', t, t * 9.0);
      } else {
        const s = stops[stayIndex];
        const settle = M.smoothstep(s.t0, s.t0 + 0.4, t);
        const leave = 1 - M.smoothstep(s.t1 - 0.4, s.t1, t);
        const w = Math.min(settle, leave);
        blend(rest, poseFor(act, t, 0), w, pOut);
        pose = pOut;
      }

      it.root.position.set(pos.x, groundY + pose.yOff, pos.z);
      it.root.rotation.y = facing;
      it.body.position.y = pose.bob;
      it.body.rotation.x = pose.lean;
      it.body.rotation.z = pose.roll;
      it.head.rotation.y = pose.headYaw;
      it.head.rotation.x = pose.headPitch;
      it.armL.rotation.x = pose.armL;
      it.armR.rotation.x = pose.armR;
      it.armL.rotation.z = pose.armZL;
      it.armR.rotation.z = pose.armZR;
      it.legL.rotation.x = pose.legL;
      it.legR.rotation.x = pose.legR;

      const visible = opacity > 0.01;
      it.root.visible = visible;
      if (it.opacity !== opacity) {
        it.mat.opacity = opacity;
        it.opacity = opacity;
        it.meshes.forEach((m) => {
          m.castShadow = visible;
        });
      }
    }

    function staysInside(stops, t) {
      if (t <= stops[0].t0) return stops[0];
      return stops[stops.length - 1];
    }

    function update(t, atmos) {
      for (let i = 0; i < items.length; i++) updateOne(items[i], t);
    }

    return { group, update, items };
  };
})();
