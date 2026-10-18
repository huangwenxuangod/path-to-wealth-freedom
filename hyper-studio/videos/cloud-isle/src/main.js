/* Assembly: renderer, lights, world modules, the single renderAt(t) entry point. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const W = 1920;
  const H = 1080;

  const canvas = document.getElementById('scene');
  const renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new T.Scene();
  scene.fog = new T.Fog(0xcfe0ea, 46, 190);

  const camera = new T.PerspectiveCamera(38, W / H, 0.5, 900);
  camera.position.set(15.5, 12, 30);

  const hemi = new T.HemisphereLight(0xbcd9f2, 0x5c6144, 1.7);
  scene.add(hemi);

  const sun = new T.DirectionalLight(0xfff2dc, 2.9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 110;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(sun.target);

  // warm bounce from the cloud sea, lifts the underside of the island
  const bounce = new T.DirectionalLight(0xd6bea4, 0.5);
  bounce.position.set(8, -24, 10);
  bounce.target.position.set(0, 0, 0);
  scene.add(bounce);
  scene.add(bounce.target);

  const sky = SKY.createSky();
  scene.add(sky.group);

  const terrain = SKY.createTerrain();
  scene.add(terrain.group);

  const water = SKY.createWater(terrain);
  scene.add(water.group);

  const village = SKY.createVillage(terrain);
  scene.add(village.group);

  const props = SKY.createProps(terrain);
  props.attachSmoke(village.spots);
  scene.add(props.group);

  const villagers = SKY.createVillagers(terrain, village);
  scene.add(villagers.group);

  const sunPos = new T.Vector3();

  function renderAt(t) {
    SKY.cameraAt(t, camera);
    const a = SKY.atmos(t);

    sky.update(t, a, camera);

    scene.fog.color.copy(a.fog);
    scene.fog.near = 48;
    scene.fog.far = 185;

    hemi.color.copy(a.hemiSky);
    hemi.groundColor.copy(a.hemiGround);
    hemi.intensity = a.hemiI;

    const night = a.elevation < -0.02;
    const dir = night ? a.moonDir : a.sunDir;
    sunPos.copy(dir).multiplyScalar(50);
    sun.position.copy(sunPos);
    sun.target.position.set(0, 0, 0);
    sun.color.copy(a.lightColor);
    sun.intensity = night ? 0.85 : a.lightIntensity;
    bounce.intensity = 0.22 + 0.34 * a.dayLight;

    water.update(t, a);
    props.preRender(camera);
    props.update(t, a);
    village.update(t, a);
    villagers.update(t, a);

    renderer.render(scene, camera);
  }

  window.__SKY_APP = {
    renderAt: renderAt,
    scene: scene,
    camera: camera,
    renderer: renderer,
    terrain: terrain,
    village: village,
  };
  renderAt(window.__hfThreeTime || 0);

  window.addEventListener('hf-seek', function (e) {
    renderAt(e.detail.time);
  });

  // Standalone fallback: opened directly in a browser, nothing drives hf-seek.
  let seeks = 0;
  window.addEventListener('hf-seek', function () {
    seeks++;
  });
  setTimeout(function () {
    if (seeks > 0) return;
    const d = 48;
    const start = performance.now();
    function tick() {
      const t = ((performance.now() - start) / 1000) % d;
      renderAt(t);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, 1000);
})();
