/* Pond on the rim and the waterfall that pours off the island into the clouds. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  const WATER_ANGLE = 5.5; // radians, pond sits on this side of the island
  const POND_R = 1.55;
  const POND_DIST = 7.9;

  const VERT = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const FRAG = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uNight;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

    void main() {
      float streak = 0.0;
      for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float x = vUv.x * (7.0 + fi * 5.0) + hash(vec2(fi, 3.0)) * 10.0;
        float y = vUv.y * (5.0 + fi * 3.0) - uTime * (2.2 + fi * 0.7);
        float s = sin((x + y) * 6.2831);
        streak += smoothstep(0.45, 0.95, abs(s)) * (0.5 - fi * 0.12);
      }
      vec3 col = mix(uColorA, uColorB, clamp(streak * 0.75, 0.0, 1.0));
      float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
      float fade = smoothstep(0.0, 0.18, vUv.y);
      float body = 0.5 + 0.3 * streak;
      col *= (1.0 - 0.82 * uNight);
      gl_FragColor = vec4(col, edge * fade * body * 0.92);
    }
  `;

  SKY.createWater = function (terrain) {
    const group = new T.Group();
    const rnd = SKY.stream(5150);

    const cx = Math.cos(WATER_ANGLE) * POND_DIST;
    const cz = Math.sin(WATER_ANGLE) * POND_DIST;
    const rimR = terrain.radiusAt(WATER_ANGLE);

    // pond basin
    const pond = new T.Mesh(
      new T.CircleGeometry(POND_R, 28),
      new T.MeshStandardMaterial({
        color: 0x5fb6c8,
        roughness: 0.16,
        metalness: 0.15,
        transparent: true,
        opacity: 0.88,
      })
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(cx, terrain.heightAt(cx, cz) + 0.08, cz);
    pond.receiveShadow = true;
    group.add(pond);

    // pond rim stones
    const rim = new SKY.Builder(88);
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + rnd.range(-0.05, 0.05);
      const r = POND_R + rnd.range(0.02, 0.22);
      const s = rnd.range(0.10, 0.24);
      rim.ico(s, 0, 0x8d8478, SKY.xf(cx + Math.cos(a) * r, pond.position.y - 0.04, cz + Math.sin(a) * r, 0, rnd.range(0, 3), 0, 1, 0.6, 1));
    }
    const rimMesh = rim.mesh(
      new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })
    );
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    group.add(rimMesh);

    // waterfall
    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new T.Color(0x9fd8e8) },
      uColorB: { value: new T.Color(0xeaf7ff) },
      uNight: { value: 0 },
    };
    const fall = new T.Mesh(
      new T.PlaneGeometry(2.2, 10.0, 1, 1),
      new T.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: T.DoubleSide,
        fog: false,
      })
    );
    const edgeX = Math.cos(WATER_ANGLE) * (rimR - 0.1);
    const edgeZ = Math.sin(WATER_ANGLE) * (rimR - 0.1);
    fall.position.set(edgeX, -4.75, edgeZ);
    fall.rotation.y = Math.PI / 2 - WATER_ANGLE;
    fall.renderOrder = 5;
    group.add(fall);

    // mist puffs where the water meets the cloud sea
    const mistTex = (function () {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(64, 64, 2, 64, 64, 62);
      grad.addColorStop(0, 'rgba(255,255,255,0.85)');
      grad.addColorStop(0.6, 'rgba(255,255,255,0.3)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      return t;
    })();
    const mistMat = new T.MeshBasicMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0.35, fog: false });
    const mist = new T.Group();
    for (let i = 0; i < 9; i++) {
      const m = new T.Mesh(new T.PlaneGeometry(1, 1), mistMat);
      m.position.set(edgeX + rnd.range(-2.4, 2.4), rnd.range(-12.5, -10.5), edgeZ + rnd.range(-2.4, 2.4));
      const s = rnd.range(3, 7);
      m.scale.set(s, s * 0.6, 1);
      m.userData.phase = rnd.range(0, 6.28);
      mist.add(m);
    }
    mist.renderOrder = 6;
    group.add(mist);

    function update(t, atmos) {
      uniforms.uTime.value = t;
      uniforms.uNight.value = atmos.night;
      mistMat.color.copy(atmos.cloud);
      for (let i = 0; i < mist.children.length; i++) {
        const m = mist.children[i];
        m.position.y += Math.sin(t * 0.6 + m.userData.phase) * 0.002;
        m.lookAt(0, m.position.y, 0);
      }
    }

    return { group, update, pondPosition: new T.Vector3(cx, 0, cz) };
  };
})();
