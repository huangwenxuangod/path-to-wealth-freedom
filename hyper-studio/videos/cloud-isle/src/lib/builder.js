/* Merged-geometry builder: many primitives -> one draw call, per-vertex colour.
   Used for every static piece of the island so the render stays inside budget. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;

  const _m = new T.Matrix4();
  const _q = new T.Quaternion();
  const _e = new T.Euler();
  const _v = new T.Vector3();
  const _s = new T.Vector3();

  function xf(x, y, z, rx, ry, rz, sx, sy, sz) {
    _v.set(x || 0, y || 0, z || 0);
    _e.set(rx || 0, ry || 0, rz || 0);
    _q.setFromEuler(_e);
    _s.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz);
    return _m.clone().compose(_v, _q, _s);
  }

  const geoCache = new Map();

  function Builder(seed) {
    this.pos = [];
    this.nor = [];
    this.col = [];
    this.seed = seed || 1;
    this.face = 0;
  }

  Builder.prototype.add = function (geo, matrix, color, jitter) {
    const c = color instanceof T.Color ? color : new T.Color(color);
    const src = geo.index ? geo.toNonIndexed() : geo.clone();
    if (matrix) src.applyMatrix4(matrix);
    const p = src.attributes.position.array;
    const n = src.attributes.normal.array;
    const count = p.length / 3;

    let r = c.r;
    let g = c.g;
    let b = c.b;
    if (jitter) {
      // per-triangle shade jitter for a hand-painted faceted look
      const h = SKY.hash1(this.face * 1.37 + this.seed * 11.3);
      const k = 1 + (h - 0.5) * jitter * 2;
      r = c.r * k;
      g = c.g * k;
      b = c.b * k;
    }

    for (let i = 0; i < p.length; i += 3) {
      this.pos.push(p[i], p[i + 1], p[i + 2]);
      this.nor.push(n[i], n[i + 1], n[i + 2]);
    }
    for (let i = 0; i < count; i++) this.col.push(r, g, b);

    this.face += Math.floor(count / 3);
    src.dispose();
    return this;
  };

  Builder.prototype.addRaw = function (positions, normals, colors) {
    for (let i = 0; i < positions.length; i++) this.pos.push(positions[i]);
    for (let i = 0; i < normals.length; i++) this.nor.push(normals[i]);
    for (let i = 0; i < colors.length; i++) this.col.push(colors[i]);
    return this;
  };

  Builder.prototype.box = function (w, h, d, color, m, jitter) {
    const key = 'b' + w + ',' + h + ',' + d;
    let g = geoCache.get(key);
    if (!g) {
      g = new T.BoxGeometry(w, h, d);
      geoCache.set(key, g);
    }
    return this.add(g, m, color, jitter);
  };

  Builder.prototype.cyl = function (rt, rb, h, seg, color, m, jitter) {
    const key = 'c' + rt + ',' + rb + ',' + h + ',' + seg;
    let g = geoCache.get(key);
    if (!g) {
      g = new T.CylinderGeometry(rt, rb, h, seg, 1);
      geoCache.set(key, g);
    }
    return this.add(g, m, color, jitter);
  };

  Builder.prototype.cone = function (r, h, seg, color, m, jitter) {
    const key = 'k' + r + ',' + h + ',' + seg;
    let g = geoCache.get(key);
    if (!g) {
      g = new T.ConeGeometry(r, h, seg, 1);
      geoCache.set(key, g);
    }
    return this.add(g, m, color, jitter);
  };

  Builder.prototype.sphere = function (r, ws, hs, color, m, jitter) {
    const key = 's' + r + ',' + ws + ',' + hs;
    let g = geoCache.get(key);
    if (!g) {
      g = new T.SphereGeometry(r, ws, hs);
      geoCache.set(key, g);
    }
    return this.add(g, m, color, jitter);
  };

  Builder.prototype.ico = function (r, detail, color, m, jitter) {
    const key = 'i' + r + ',' + detail;
    let g = geoCache.get(key);
    if (!g) {
      g = new T.IcosahedronGeometry(r, detail);
      geoCache.set(key, g);
    }
    return this.add(g, m, color, jitter);
  };

  Builder.prototype.build = function () {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new T.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(this.col, 3));
    g.computeBoundingSphere();
    return g;
  };

  Builder.prototype.mesh = function (material) {
    const m = new T.Mesh(this.build(), material);
    return m;
  };

  function yawRoll(x, y, z, ry, rz) {
    const m = new T.Matrix4().makeTranslation(x, y, z);
    m.multiply(new T.Matrix4().makeRotationY(ry));
    m.multiply(new T.Matrix4().makeRotationZ(rz));
    return m;
  }

  SKY.yawRoll = yawRoll;
  SKY.Builder = Builder;
  SKY.xf = xf;
})();
