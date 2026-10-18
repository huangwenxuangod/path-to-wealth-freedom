/* Sky dome shader + layered cloud sea + cloud floor + sun/moon discs. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  const VERT = `
    varying vec3 vDir;
    void main() {
      vDir = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const FRAG = `
    varying vec3 vDir;
    uniform vec3 uZenith;
    uniform vec3 uHorizon;
    uniform vec3 uSea;
    uniform vec3 uGlow;
    uniform vec3 uSunColor;
    uniform vec3 uSunDir;
    uniform float uStar;
    uniform float uSunUp;

    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
    }

    void main() {
      vec3 d = normalize(vDir);
      float up = clamp(d.y, 0.0, 1.0);

      vec3 col = mix(uHorizon, uZenith, pow(up, 0.30));

      // sea of clouds under the island
      float below = smoothstep(0.055, -0.24, d.y);
      vec3 deep = uSea * 0.66;
      vec3 sea = mix(uSea, deep, smoothstep(0.0, -0.6, d.y));
      vec2 q = d.xz / max(0.10, -d.y + 0.16);
      float n = 0.5 * sin(q.x * 1.9 + q.y * 2.7 + 0.6)
              + 0.28 * sin(q.x * 4.3 - q.y * 3.1 + 1.7)
              + 0.14 * sin(q.x * 8.7 + q.y * 7.3 + 3.1);
      sea *= 0.86 + 0.26 * (n * 0.5 + 0.5);
      col = mix(col, sea, below);

      // warm haze hugging the horizon line
      col += uGlow * exp(-abs(d.y - 0.004) * 26.0) * 0.16 * uSunUp;

      float sd = max(dot(d, normalize(uSunDir)), 0.0);
      col += uGlow * pow(sd, 12.0) * 0.28 * uSunUp;
      col += uSunColor * pow(sd, 300.0) * 3.0 * uSunUp;

      // stars
      vec3 sp = floor(d * 240.0);
      float st = step(0.9984, hash(sp));
      float tw = 0.6 + 0.4 * hash(sp + 5.3);
      col += vec3(0.85, 0.92, 1.0) * st * uStar * smoothstep(0.02, 0.3, d.y) * tw;

      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `;

  function softTex() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128, 128, 4, 128, 128, 126);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.42, 'rgba(255,255,255,0.72)');
    grad.addColorStop(0.72, 'rgba(255,255,255,0.24)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }

  /** A painted cloud deck: cool base, fluffy tops, soft rim so it melts into the sky. */
  function cloudFloorTex() {
    const S = 1024;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const g = c.getContext('2d');
    const r = SKY.stream(777);

    g.fillStyle = '#9fb2c4';
    g.fillRect(0, 0, S, S);

    // the deck: large soft masses
    for (let i = 0; i < 190; i++) {
      const a = r.range(0, Math.PI * 2);
      const d = Math.pow(r.next(), 0.62) * 470;
      const x = S / 2 + Math.cos(a) * d;
      const y = S / 2 + Math.sin(a) * d;
      const rad = r.range(40, 130);
      const alpha = r.range(0.25, 0.7);
      const grad = g.createRadialGradient(x, y, rad * 0.1, x, y, rad);
      grad.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
      grad.addColorStop(0.55, 'rgba(243,247,252,' + alpha * 0.55 + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // small bright crests
    for (let i = 0; i < 320; i++) {
      const a = r.range(0, Math.PI * 2);
      const d = Math.pow(r.next(), 0.5) * 460;
      const x = S / 2 + Math.cos(a) * d;
      const y = S / 2 + Math.sin(a) * d;
      const rad = r.range(10, 38);
      const grad = g.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, 'rgba(255,255,255,0.75)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }

    g.globalCompositeOperation = 'destination-in';
    const fade = g.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S * 0.5);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.62, 'rgba(0,0,0,0.92)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fade;
    g.fillRect(0, 0, S, S);

    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }

  SKY.createSky = function () {
    const group = new T.Group();
    const rnd = SKY.stream(20261018);

    const uniforms = {
      uZenith: { value: new T.Color(0x4a90cf) },
      uHorizon: { value: new T.Color(0xcfe8f5) },
      uSea: { value: new T.Color(0xdae6ee) },
      uGlow: { value: new T.Color(0xffe6c0) },
      uSunColor: { value: new T.Color(0xffffff) },
      uSunDir: { value: new T.Vector3(0.3, 0.8, 0.5) },
      uStar: { value: 0 },
      uSunUp: { value: 1 },
    };

    const dome = new T.Mesh(
      new T.SphereGeometry(300, 40, 24),
      new T.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        side: T.BackSide,
        depthWrite: false,
        fog: false,
      })
    );
    dome.renderOrder = -100;
    group.add(dome);

    const tex = softTex();

    // ---- the cloud deck far below ----
    const floorMat = new T.MeshBasicMaterial({
      map: cloudFloorTex(),
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      fog: false,
      color: 0xffffff,
    });
    const cloudFloor = new T.Mesh(new T.PlaneGeometry(760, 760), floorMat);
    cloudFloor.rotation.x = -Math.PI / 2;
    cloudFloor.position.y = -19;
    cloudFloor.renderOrder = -90;
    group.add(cloudFloor);

    // ---- puffs: billboarded cloud masses under the island ----
    const seaMat = new T.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      fog: false,
      color: 0xffffff,
    });
    const seaMatSoft = new T.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      fog: false,
      color: 0xffffff,
    });
    const sea = new T.Group();
    const seaGeo = new T.PlaneGeometry(1, 1);
    for (let i = 0; i < 150; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const rad = 9 + Math.pow(rnd.next(), 0.62) * 78;
      const m = new T.Mesh(seaGeo, i % 3 === 0 ? seaMatSoft : seaMat);
      m.position.set(Math.cos(a) * rad, rnd.range(-20.0, -3.5), Math.sin(a) * rad);
      const s = rnd.range(7, 26) * (0.7 + rad / 60);
      m.scale.set(s, s * rnd.range(0.5, 0.78), 1);
      m.userData.drift = rnd.range(0.1, 0.3);
      m.userData.base = m.position.clone();
      m.userData.bob = rnd.range(0, 6.28);
      sea.add(m);
    }
    sea.renderOrder = -80;
    group.add(sea);

    // ---- distant cumulus near the horizon, billboarded ----
    const cumulusTex = (function () {
      const W = 320;
      const Hh = 180;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = Hh;
      const g = c.getContext('2d');
      const r = SKY.stream(4242);
      for (let i = 0; i < 11; i++) {
        const x = 70 + r.range(0, 180);
        const y = 100 - r.range(0, 46);
        const rad = r.range(34, 66);
        const grad = g.createRadialGradient(x, y, rad * 0.1, x, y, rad);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.55, 'rgba(250,252,255,0.65)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      g.globalCompositeOperation = 'source-atop';
      const lg = g.createLinearGradient(0, 40, 0, Hh);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(0.5, 'rgba(206,218,232,0.18)');
      lg.addColorStop(1, 'rgba(168,186,208,0.62)');
      g.fillStyle = lg;
      g.fillRect(0, 0, W, Hh);
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      return t;
    })();

    const skyCloudMat = new T.MeshBasicMaterial({
      map: cumulusTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      fog: false,
      color: 0xffffff,
    });
    const skyClouds = new T.Group();
    const cloudPlaneGeo = new T.PlaneGeometry(2, 1);
    for (let i = 0; i < 24; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const rad = rnd.range(52, 118);
      const m = new T.Mesh(cloudPlaneGeo, skyCloudMat);
      m.position.set(Math.cos(a) * rad, rnd.range(-1.5, 9.0), Math.sin(a) * rad);
      const s = rnd.range(12, 24);
      m.scale.set(s, s * rnd.range(0.75, 1.0), 1);
      m.userData.drift = rnd.range(0.1, 0.3);
      m.userData.base = m.position.clone();
      skyClouds.add(m);
    }
    skyClouds.renderOrder = -75;
    group.add(skyClouds);

    // ---- high wisps ----
    const wispMat = new T.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      fog: false,
      color: 0xffffff,
    });
    const wisps = new T.Group();
    for (let i = 0; i < 16; i++) {
      const a = rnd.range(0, Math.PI * 2);
      const rad = rnd.range(22, 58);
      const m = new T.Mesh(seaGeo, wispMat);
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = rnd.range(0, Math.PI);
      m.position.set(Math.cos(a) * rad, rnd.range(9, 17), Math.sin(a) * rad);
      const s = rnd.range(16, 34);
      m.scale.set(s, s * 0.42, 1);
      m.userData.drift = rnd.range(0.4, 0.9);
      m.userData.base = m.position.clone();
      wisps.add(m);
    }
    wisps.renderOrder = -70;
    group.add(wisps);

    // ---- sun & moon billboards ----
    const sunTex = (function () {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(128, 128, 2, 128, 128, 126);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.16, 'rgba(255,247,228,1)');
      grad.addColorStop(0.27, 'rgba(255,226,180,0.65)');
      grad.addColorStop(0.5, 'rgba(255,196,130,0.18)');
      grad.addColorStop(1, 'rgba(255,180,110,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      return t;
    })();

    const sunSprite = new T.Mesh(
      new T.PlaneGeometry(1, 1),
      new T.MeshBasicMaterial({
        map: sunTex,
        color: 0xfff3d6,
        transparent: true,
        opacity: 0.95,
        fog: false,
        depthWrite: false,
        blending: T.AdditiveBlending,
      })
    );
    sunSprite.scale.set(34, 34, 1);
    sunSprite.renderOrder = -20;
    group.add(sunSprite);

    const moonSprite = new T.Mesh(
      new T.PlaneGeometry(1, 1),
      new T.MeshBasicMaterial({
        map: sunTex,
        color: 0xdfe8ff,
        transparent: true,
        opacity: 0,
        fog: false,
        depthWrite: false,
        blending: T.AdditiveBlending,
      })
    );
    moonSprite.scale.set(13, 13, 1);
    moonSprite.renderOrder = -20;
    group.add(moonSprite);

    const tmp = new T.Vector3();
    const sunTint = new T.Color();

    function update(t, atmos, camera) {
      uniforms.uZenith.value.copy(atmos.zen);
      uniforms.uHorizon.value.copy(atmos.hor);
      uniforms.uSea.value.copy(atmos.sea);
      uniforms.uGlow.value.copy(atmos.glow);
      uniforms.uSunColor.value.copy(atmos.lightColor);
      uniforms.uSunDir.value.copy(atmos.sunDir);
      uniforms.uStar.value = atmos.stars;
      uniforms.uSunUp.value = M.smoothstep(-0.1, 0.04, atmos.elevation);

      floorMat.color.copy(atmos.cloud).multiplyScalar(0.68);
      floorMat.opacity = 0.0;
      seaMat.color.copy(atmos.cloud).multiplyScalar(1.06);
      skyCloudMat.color.copy(atmos.cloud).multiplyScalar(0.94);
      skyCloudMat.opacity = 0.3 + 0.58 * atmos.dayLight;
      seaMat.opacity = 0.5 + 0.34 * atmos.dayLight;
      wispMat.color.copy(atmos.cloud);
      wispMat.opacity = 0.14 + 0.16 * atmos.dayLight;

      for (let i = 0; i < sea.children.length; i++) {
        const m = sea.children[i];
        const d = m.userData.drift * t;
        m.position.x = m.userData.base.x + d;
        m.position.z = m.userData.base.z + d * 0.35;
        m.position.y = m.userData.base.y + Math.sin(t * 0.25 + m.userData.bob) * 0.6;
        m.quaternion.copy(camera.quaternion);
      }
      for (let i = 0; i < skyClouds.children.length; i++) {
        const m = skyClouds.children[i];
        m.position.x = m.userData.base.x + m.userData.drift * t;
        m.quaternion.copy(camera.quaternion);
      }

      for (let i = 0; i < wisps.children.length; i++) {
        const m = wisps.children[i];
        m.position.x = m.userData.base.x + m.userData.drift * t * 1.6;
      }

      tmp.copy(atmos.sunDir).multiplyScalar(240).add(camera.position);
      sunSprite.position.copy(tmp);
      sunSprite.quaternion.copy(camera.quaternion);
      sunSprite.material.opacity = 0.25 + 0.75 * atmos.sunVisible;
      sunTint.copy(atmos.lightColor).lerp(new T.Color(0xffffff), 0.4);
      sunSprite.material.color.copy(sunTint);

      tmp.copy(atmos.moonDir).multiplyScalar(240).add(camera.position);
      moonSprite.position.copy(tmp);
      moonSprite.quaternion.copy(camera.quaternion);
      moonSprite.material.opacity = 0.85 * M.smoothstep(0.25, 0.02, atmos.elevation);
    }

    return { group, update, uniforms };
  };
})();
