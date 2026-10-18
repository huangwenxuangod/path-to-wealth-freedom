/* The village: houses, mill, barn, bakery, bell tower, market, well, dock,
   farms, paths. Static geometry is merged into a handful of draw calls. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  const WALL = 0xe9ddc4;
  const WALL2 = 0xdfd0b4;
  const TIMBER = 0x6b4a33;
  const ROOF = 0xb85c3e;
  const ROOF2 = 0xa34f36;
  const THATCH = 0xc9a86a;
  const STONE = 0x9c938a;
  const DOOR = 0x5a3b26;
  const SOIL = 0x6b4f38;

  function gableGeo(w, h, t) {
    const x0 = -w / 2;
    const x1 = w / 2;
    const z0 = -t / 2;
    const z1 = t / 2;
    const A = [x0, 0, z0];
    const B = [x1, 0, z0];
    const C = [0, h, z0];
    const A2 = [x0, 0, z1];
    const B2 = [x1, 0, z1];
    const C2 = [0, h, z1];
    const v = [];
    const tri = (a, b, c) => v.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    tri(A, C, B);
    tri(A2, B2, C2);
    tri(A, B, B2);
    tri(A, B2, A2);
    tri(A, A2, C2);
    tri(A, C2, C);
    tri(B, C, C2);
    tri(B, C2, B2);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }

  /** A small timber-framed house. Returns the gable ridge height. */
  function hut(b, x, z, rot, w, d, h, roofH, opts) {
    const o = opts || {};
    const y = o.y || 0;
    const wall = o.wall === undefined ? WALL : o.wall;
    const roofC = o.roof === undefined ? ROOF : o.roof;
    const cs = Math.cos(rot);
    const sn = Math.sin(rot);
    const hw = w / 2;
    const hd = d / 2;

    const put = (lx, lz, lw, lh, ld, col, yOff, jitter) => {
      const gx = x + lx * cs + lz * sn;
      const gz = z - lx * sn + lz * cs;
      b.box(lw, lh, ld, col, SKY.xf(gx, y + (yOff === undefined ? 0 : yOff), gz, 0, rot, 0), jitter || 0);
    };

    b.box(w + 0.2, 0.24, d + 0.2, STONE, SKY.xf(x, y + 0.12, z, 0, rot, 0), 0.04);
    b.box(w, h, d, wall, SKY.xf(x, y + h / 2 + 0.22, z, 0, rot, 0), 0.03);

    put(-hw, -hd, 0.13, h, 0.13, TIMBER, h / 2 + 0.22, 0.02);
    put(hw, -hd, 0.13, h, 0.13, TIMBER, h / 2 + 0.22, 0.02);
    put(-hw, hd, 0.13, h, 0.13, TIMBER, h / 2 + 0.22, 0.02);
    put(hw, hd, 0.13, h, 0.13, TIMBER, h / 2 + 0.22, 0.02);
    put(0, hd, w, 0.1, 0.1, TIMBER, h + 0.18, 0);
    put(0, 0, w, 0.08, 0.08, TIMBER, h * 0.55 + 0.22, 0);

    // timber band + studs so the walls read as built, not as blocks
    put(0, hd, w * 0.98, 0.07, 0.06, TIMBER, h * 0.52 + 0.22, 0);
    put(0, -hd, w * 0.98, 0.07, 0.06, TIMBER, h * 0.52 + 0.22, 0);
    put(hw, 0, 0.06, 0.07, d * 0.98, TIMBER, h * 0.52 + 0.22, 0);
    put(-hw, 0, 0.06, 0.07, d * 0.98, TIMBER, h * 0.52 + 0.22, 0);
    put(hw, -hd * 0.5, 0.06, h * 0.98, 0.07, TIMBER, h / 2 + 0.22, 0);
    put(hw, hd * 0.5, 0.06, h * 0.98, 0.07, TIMBER, h / 2 + 0.22, 0);
    put(-hw, -hd * 0.5, 0.06, h * 0.98, 0.07, TIMBER, h / 2 + 0.22, 0);
    put(-hw, hd * 0.5, 0.06, h * 0.98, 0.07, TIMBER, h / 2 + 0.22, 0);

    const roofBase = y + h + 0.22;
    const eave = 0.34;
    const run = hw + eave;
    const slabLen = Math.sqrt(run * run + roofH * roofH);
    const ang = Math.atan2(roofH, run);
    const midY = roofBase + roofH / 2;

    const offL = run / 2;
    b.box(slabLen, 0.15, d + 0.5, roofC, SKY.yawRoll(x - offL * cs, midY, z + offL * sn, rot, ang), 0.05);
    b.box(slabLen, 0.15, d + 0.5, roofC, SKY.yawRoll(x + offL * cs, midY, z - offL * sn, rot, -ang), 0.05);
    b.box(0.17, 0.17, d + 0.55, o.ridge || ROOF2, SKY.xf(x, roofBase + roofH, z, 0, rot, 0), 0.03);

    const gg = gableGeo(w * 0.98, roofH * 0.94, 0.12);
    const m1 = SKY.xf(x, roofBase, z, 0, rot, 0).multiply(SKY.xf(0, 0, hd - 0.06));
    const m2 = SKY.xf(x, roofBase, z, 0, rot, 0).multiply(SKY.xf(0, 0, -hd + 0.06));
    b.add(gg, m1, wall, 0);
    b.add(gg, m2, wall, 0);

    // door on the front (local +z)
    const dx = x + sn * (hd + 0.03);
    const dz = z + cs * (hd + 0.03);
    b.box(0.6, 1.02, 0.1, DOOR, SKY.xf(dx, y + 0.75, dz, 0, rot, 0), 0);
    b.box(0.7, 0.08, 0.16, TIMBER, SKY.xf(dx, y + 1.3, dz, 0, rot, 0), 0);

    return roofBase + roofH;
  }

  SKY.createVillage = function (terrain) {
    const group = new T.Group();
    const b = new SKY.Builder(11);
    const winB = new SKY.Builder(12);
    const detail = new SKY.Builder(13);

    const H = (x, z) => terrain.heightAt(x, z);

    const spots = {
      homes: [],
      farm: [],
      market: [],
      well: new T.Vector3(),
      fire: new T.Vector3(),
      tower: new T.Vector3(),
      dock: new T.Vector3(),
      mill: new T.Vector3(),
      bakery: new T.Vector3(),
      barn: new T.Vector3(),
      smoke: [],
    };

    // ---------- plaza ----------
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + SKY.hash1(i) * 0.2;
      const rr = 0.5 + 2.4 * Math.pow(SKY.hash1(i * 3.1), 0.6);
      const px = Math.cos(a) * rr;
      const pz = Math.sin(a) * rr;
      detail.cyl(0.28, 0.28, 0.06, 6, 0xb4a88f, SKY.xf(px, H(px, pz) + 0.03, pz, 0, a, 0, 1, 1, 0.8), 0.09);
    }

    // ---------- well ----------
    (function well() {
      const x = 1.15;
      const z = 0.95;
      const y = H(x, z);
      spots.well.set(x, y, z);
      b.cyl(0.62, 0.7, 0.6, 10, STONE, SKY.xf(x, y + 0.3, z), 0.05);
      b.cyl(0.52, 0.52, 0.05, 10, 0x39525c, SKY.xf(x, y + 0.58, z), 0);
      b.box(0.09, 1.3, 0.09, TIMBER, SKY.xf(x - 0.56, y + 0.95, z), 0);
      b.box(0.09, 1.3, 0.09, TIMBER, SKY.xf(x + 0.56, y + 0.95, z), 0);
      b.box(1.45, 0.09, 0.09, TIMBER, SKY.xf(x, y + 1.58, z), 0);
      b.cone(0.95, 0.5, 4, THATCH, SKY.xf(x, y + 1.85, z, 0, Math.PI / 4, 0), 0.04);
    })();

    // ---------- fire pit ----------
    (function firePit() {
      const x = -1.35;
      const z = 0.65;
      const y = H(x, z);
      spots.fire.set(x, y, z);
      for (let i = 0; i < 11; i++) {
        const a = (i / 11) * Math.PI * 2;
        b.ico(0.15 + SKY.hash1(i) * 0.05, 0, 0x7d746a, SKY.xf(x + Math.cos(a) * 0.62, y + 0.06, z + Math.sin(a) * 0.62, 0, a, 0, 1, 0.65, 1));
      }
      b.cyl(0.055, 0.06, 0.85, 5, 0x4a3524, SKY.xf(x, y + 0.18, z, 0, 0.4, 1.25), 0);
      b.cyl(0.055, 0.06, 0.85, 5, 0x4a3522, SKY.xf(x, y + 0.18, z, 0, -0.7, -1.1), 0);
      b.cyl(0.05, 0.05, 0.7, 5, 0x55402b, SKY.xf(x, y + 0.14, z, 1.2, 0.2, 0), 0);
    })();

    // ---------- market ----------
    function stall(x, z, rot, cloth) {
      const y = H(x, z);
      spots.market.push(new T.Vector3(x, y, z));
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const post = (lx, lz) => {
        const gx = x + lx * cs + lz * sn;
        const gz = z - lx * sn + lz * cs;
        b.box(0.09, 1.9, 0.09, TIMBER, SKY.xf(gx, y + 0.95, gz), 0);
      };
      post(-1.0, -0.72);
      post(1.0, -0.72);
      post(-1.0, 0.72);
      post(1.0, 0.72);
      b.box(2.4, 0.08, 1.85, cloth, SKY.xf(x, y + 1.94, z, 0, rot, 0.05), 0.05);
      b.box(2.25, 0.07, 0.55, cloth, SKY.xf(x - 0.06 * cs, y + 1.78, z - 0.06 * sn, 0, rot, 0.3), 0.04);
      b.box(1.9, 0.09, 0.55, 0x8a6440, SKY.xf(x + 0.15 * sn, y + 0.92, z + 0.55, 0, rot, 0), 0.04);
      for (let i = 0; i < 3; i++) {
        const cx = x + (i - 1) * 0.55;
        b.box(0.32, 0.28, 0.32, 0x9a6f45, SKY.xf(cx, y + 1.1, z + 0.5, 0, rot, 0), 0.05);
        b.sphere(0.12, 6, 5, i === 1 ? 0xd9a13a : 0xb8452f, SKY.xf(cx, y + 1.3, z + 0.5, 0, 0, 0, 1, 0.8, 1), 0.1);
      }
    }
    stall(2.95, -1.05, -0.35, 0xd7b98c);
    stall(-2.55, -2.05, 0.55, 0xc98f7a);

    // ---------- bell tower ----------
    (function tower() {
      const x = -3.15;
      const z = 2.55;
      const y = H(x, z);
      spots.tower.set(x, y, z);
      b.box(1.2, 0.26, 1.2, STONE, SKY.xf(x, y + 0.13, z), 0);
      b.box(1.0, 3.3, 1.0, WALL2, SKY.xf(x, y + 1.9, z), 0.03);
      b.box(1.14, 0.12, 1.14, TIMBER, SKY.xf(x, y + 3.5, z), 0);
      b.box(1.3, 0.1, 1.3, 0x8f6a48, SKY.xf(x, y + 3.92, z), 0);
      b.cone(1.05, 1.1, 4, ROOF2, SKY.xf(x, y + 4.5, z, 0, Math.PI / 4, 0), 0.04);
      b.cone(0.24, 0.4, 8, 0xc9a24a, SKY.xf(x, y + 3.74, z, Math.PI, 0, 0), 0.06);
      winB.box(0.5, 0.6, 0.06, 0xffffff, SKY.xf(x, y + 3.1, z + 0.52), 0);
      winB.box(0.5, 0.6, 0.06, 0xffffff, SKY.xf(x, y + 3.1, z - 0.52), 0);
    })();

    // ---------- houses ----------
    const housePlan = [
      { a: 205, r: 6.5, w: 2.5, d: 2.1, h: 1.9, roofH: 1.2, roof: ROOF, wall: 0xece1c9 },
      { a: 242, r: 6.65, w: 2.2, d: 2.0, h: 1.75, roofH: 1.1, roof: ROOF2, wall: 0xe6d6ba },
      { a: 278, r: 6.4, w: 2.6, d: 2.2, h: 2.0, roofH: 1.25, roof: THATCH, wall: 0xf0e6d2 },
      { a: 315, r: 6.55, w: 2.3, d: 2.0, h: 1.8, roofH: 1.15, roof: ROOF, wall: 0xe2d3b8 },
      { a: 18, r: 6.6, w: 2.4, d: 2.05, h: 1.85, roofH: 1.2, roof: ROOF2, wall: 0xe9dcc0 },
    ];

    housePlan.forEach((p, i) => {
      const a = (p.a * Math.PI) / 180;
      const x = Math.cos(a) * p.r;
      const z = Math.sin(a) * p.r;
      const rot = Math.atan2(-x, -z);
      const y = H(x, z);
      hut(b, x, z, rot, p.w, p.d, p.h, p.roofH, { y, roof: p.roof, wall: p.wall });

      const sn = Math.sin(rot);
      const cs = Math.cos(rot);
      const fx = x + sn * (p.d / 2 + 0.04);
      const fz = z + cs * (p.d / 2 + 0.04);

      winB.box(0.44, 0.44, 0.07, 0xffffff, SKY.xf(fx + cs * 0.72, y + 1.2, fz - sn * 0.72, 0, rot, 0), 0);
      winB.box(0.44, 0.44, 0.07, 0xffffff, SKY.xf(fx - cs * 0.72, y + 1.2, fz + sn * 0.72, 0, rot, 0), 0);
      winB.sphere(0.1, 6, 5, 0xffd08a, SKY.xf(fx + cs * 0.95, y + 1.62, fz - sn * 0.95), 0.05);

      const cx = x + cs * (p.w * 0.3);
      const cz = z - sn * (p.w * 0.3);
      b.box(0.3, 1.05, 0.3, 0x8f8578, SKY.xf(cx, y + p.h + 0.75, cz), 0.04);
      spots.smoke.push(new T.Vector3(cx, y + p.h + 1.45, cz));

      spots.homes.push({
        x,
        z,
        rot,
        door: new T.Vector3(x + sn * (p.d / 2 + 0.55), y, z + cs * (p.d / 2 + 0.55)),
        index: i,
      });
    });

    // ---------- farms ----------
    function farm(cx, cz, w, d, rot) {
      const y = H(cx, cz);
      spots.farm.push(new T.Vector3(cx, y, cz));
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      b.box(w, 0.14, d, SOIL, SKY.xf(cx, y + 0.06, cz, 0, rot, 0), 0.04);
      for (let i = 0; i < 5; i++) {
        const lx = (i / 4 - 0.5) * (w - 0.7);
        for (let j = 0; j < 4; j++) {
          const lz = (j / 3 - 0.5) * (d - 0.8);
          const px = cx + lx * cs - lz * sn;
          const pz = cz + lx * sn + lz * cs;
          b.sphere(0.17, 5, 4, i % 2 ? 0x86ad52 : 0x9abd60, SKY.xf(px, y + 0.18, pz, 0, 0, 0, 1, 0.85, 1), 0.1);
        }
      }
      const per = 2 * (w + d);
      const posts = Math.round(per * 2.4);
      for (let i = 0; i < posts; i++) {
        const s = (i / posts) * per;
        let lx2;
        let lz2;
        if (s < w) {
          lx2 = -w / 2 + s;
          lz2 = -d / 2;
        } else if (s < w + d) {
          lx2 = w / 2;
          lz2 = -d / 2 + (s - w);
        } else if (s < 2 * w + d) {
          lx2 = w / 2 - (s - w - d);
          lz2 = d / 2;
        } else {
          lx2 = -w / 2;
          lz2 = d / 2 - (s - 2 * w - d);
        }
        const gx = cx + lx2 * cs + lz2 * sn;
        const gz = cz - lx2 * sn + lz2 * cs;
        b.box(0.07, 0.5, 0.07, 0x7d5a3a, SKY.xf(gx, y + 0.26, gz, 0, rot, 0), 0);
      }
    }
    farm(-2.5, 5.15, 4.0, 2.8, 0.18);
    farm(2.75, 5.35, 3.4, 2.5, -0.12);

    // ---------- mill ----------
    (function mill() {
      const a = (148 * Math.PI) / 180;
      const x = Math.cos(a) * 7.15;
      const z = Math.sin(a) * 7.15;
      const y = H(x, z);
      spots.mill.set(x, y, z);
      b.cyl(1.2, 1.3, 0.3, 10, STONE, SKY.xf(x, y + 0.15, z), 0);
      b.cyl(0.85, 1.2, 3.1, 10, WALL2, SKY.xf(x, y + 1.7, z), 0.03);
      b.cyl(0.95, 0.95, 0.12, 10, TIMBER, SKY.xf(x, y + 3.25, z), 0);
      b.cone(1.05, 0.95, 10, THATCH, SKY.xf(x, y + 3.78, z), 0.04);
      winB.box(0.3, 0.32, 0.07, 0xffffff, SKY.xf(x + Math.cos(a) * 1.05, y + 2.35, z + Math.sin(a) * 1.05, 0, -a + Math.PI / 2, 0), 0);
    })();

    // ---------- barn ----------
    (function barn() {
      const a = (58 * Math.PI) / 180;
      const x = Math.cos(a) * 6.9;
      const z = Math.sin(a) * 6.9;
      const y = H(x, z);
      const rot = Math.atan2(-x, -z);
      spots.barn.set(x, y, z);
      hut(b, x, z, rot, 3.1, 2.5, 2.1, 1.35, { y, wall: 0xb25845, roof: 0x8c4a35 });
    })();

    // ---------- bakery ----------
    (function bakery() {
      const a = (116 * Math.PI) / 180;
      const x = Math.cos(a) * 5.75;
      const z = Math.sin(a) * 5.75;
      const y = H(x, z);
      const rot = Math.atan2(-x, -z);
      spots.bakery.set(x, y, z);
      hut(b, x, z, rot, 2.3, 2.0, 1.8, 1.1, { y, wall: 0xf1e2c6, roof: 0xc06b45 });
      b.box(0.3, 1.5, 0.3, 0x9a8c7c, SKY.xf(x + 0.9, y + 1.9, z + 0.3), 0);
      spots.smoke.push(new T.Vector3(x + 0.9, y + 2.7, z + 0.3));
      b.box(0.7, 0.06, 0.4, 0xa87a4a, SKY.xf(x - 1.15, y + 0.78, z + 1.25, 0, 0.3, 0), 0);
      for (let i = 0; i < 3; i++) b.sphere(0.11, 5, 4, 0xd9a869, SKY.xf(x - 1.3 + i * 0.16, y + 0.88, z + 1.25, 0, 0, 0, 1.4, 0.8, 1), 0.1);
    })();

    // ---------- dock ----------
    (function dock() {
      const a = (250 * Math.PI) / 180;
      const x = Math.cos(a) * 8.55;
      const z = Math.sin(a) * 8.55;
      const y = H(x, z) - 0.02;
      spots.dock.set(x, y, z);
      const rot = a + Math.PI / 2;
      for (let i = 0; i < 6; i++) {
        const d = i * 0.58 - 0.7;
        b.box(2.2, 0.09, 0.5, 0x8a6440, SKY.xf(x + Math.cos(a) * d, y + 0.02, z + Math.sin(a) * d, 0, rot, 0), 0.06);
      }
      for (let i = 0; i < 4; i++) {
        const d = i * 1.35 - 0.7;
        const px = x + Math.cos(a) * d + Math.cos(rot) * 1.0;
        const pz = z + Math.sin(a) * d + Math.sin(rot) * 1.0;
        b.cyl(0.07, 0.08, 1.1, 6, 0x6b4a31, SKY.xf(px, y + 0.2, pz), 0);
      }
      const bx = x + Math.cos(a) * 1.8;
      const bz = z + Math.sin(a) * 1.8;
      const by = y - 2.2;
      b.box(1.5, 0.5, 0.62, 0x7a5637, SKY.xf(bx, by, bz, 0, rot, 0), 0.05);
      b.box(1.64, 0.14, 0.76, 0x8d6540, SKY.xf(bx, by + 0.26, bz, 0, rot, 0), 0.05);
      b.cyl(0.04, 0.04, 1.7, 5, 0x6b4a31, SKY.xf(bx, by + 0.85, bz), 0);
      b.box(0.05, 0.7, 0.72, 0xd8cdb4, SKY.xf(bx, by + 1.15, bz, 0, rot, 0), 0);
    })();

    // ---------- paths ----------
    (function paths() {
      const pts = [
        [0.2, 1.5],
        [-0.6, 2.6],
        [-1.6, 3.6],
        [-2.8, 4.3],
        [-4.0, 4.7],
      ];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const c = pts[i + 1];
        const mx = (a[0] + c[0]) / 2;
        const mz = (a[1] + c[1]) / 2;
        const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
        const ang = Math.atan2(c[1] - a[1], c[0] - a[0]);
        detail.box(len + 0.25, 0.05, 0.95, 0x9d8767, SKY.xf(mx, H(mx, mz) + 0.035, mz, 0, -ang, 0), 0.06);
      }
      for (let i = 0; i < 5; i++) {
        const tt = i / 4;
        const px = M.lerp(-0.4, -5.9, tt);
        const pz = M.lerp(-1.4, -5.2, tt);
        detail.box(1.05, 0.05, 0.85, 0x9d8767, SKY.xf(px, H(px, pz) + 0.035, pz, 0, 0.62, 0), 0.06);
      }
    })();

    const staticMat = new T.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.9,
      metalness: 0,
    });
    const staticMesh = new T.Mesh(b.build(), staticMat);
    staticMesh.castShadow = true;
    staticMesh.receiveShadow = true;
    group.add(staticMesh);

    const detailMesh = new T.Mesh(detail.build(), staticMat);
    detailMesh.castShadow = true;
    detailMesh.receiveShadow = true;
    group.add(detailMesh);

    const winMat = new T.MeshBasicMaterial({ vertexColors: true, color: 0x2b3948, fog: false });
    const winMesh = new T.Mesh(winB.build(), winMat);
    group.add(winMesh);

    // ---------- mill sails ----------
    const sailB = new SKY.Builder(21);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      sailB.box(0.11, 2.3, 0.1, 0x6f5334, SKY.xf(Math.sin(a) * 1.15, Math.cos(a) * 1.15, 0, 0, 0, -a), 0);
      sailB.box(0.68, 0.06, 0.06, 0x6f5334, SKY.xf(Math.sin(a) * 1.75, Math.cos(a) * 1.75, 0, 0, 0, -a), 0);
      for (let k = 0; k < 3; k++) {
        const rr = 1.22 + k * 0.38;
        sailB.box(0.6, 0.05, 0.04, 0x6f5334, SKY.xf(Math.sin(a) * rr, Math.cos(a) * rr, 0, 0, 0, -a), 0);
        sailB.box(0.56, 0.36, 0.03, 0xece2ca, SKY.xf(Math.sin(a) * rr + Math.cos(a) * 0.06, Math.cos(a) * rr - Math.sin(a) * 0.06, 0.05, 0, 0, -a), 0);
      }
    }
    const sailMesh = new T.Mesh(sailB.build(), staticMat);
    sailMesh.castShadow = true;
    const hub = new T.Group();
    hub.add(sailMesh);
    hub.position.set(spots.mill.x + Math.cos((148 * Math.PI) / 180) * 1.15, spots.mill.y + 3.42, spots.mill.z + Math.sin((148 * Math.PI) / 180) * 1.15);
    hub.rotation.y = -(148 * Math.PI) / 180 + Math.PI / 2;
    group.add(hub);

    // ---------- lights ----------
    const lantern = new T.PointLight(0xffb25e, 0, 15, 2);
    lantern.position.set(spots.fire.x, spots.fire.y + 1.1, spots.fire.z);
    group.add(lantern);

    const millLight = new T.PointLight(0xffc178, 0, 11, 2);
    millLight.position.set(spots.mill.x, spots.mill.y + 2.6, spots.mill.z);
    group.add(millLight);

    const winColor = new T.Color();
    const coldWin = new T.Color(0x2b3948);
    const warmWin = new T.Color(0xffcf87);

    function update(t, atmos) {
      const night = atmos.night;
      winColor.copy(coldWin).lerp(warmWin, M.smoothstep(0.3, 0.72, night));
      winMat.color.copy(winColor);
      lantern.intensity = 2.6 * M.smoothstep(0.22, 0.8, night);
      millLight.intensity = 1.6 * M.smoothstep(0.3, 0.85, night);
      hub.rotation.z = -t * 0.85;
    }

    return { group, update, spots };
  };
})();
