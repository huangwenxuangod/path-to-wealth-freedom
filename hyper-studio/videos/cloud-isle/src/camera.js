/* One continuous camera move through the whole 48s take. Pure function of t. */
(function () {
  window.SKY = window.SKY || {};
  const T = window.THREE;
  const M = window.SKY.M;

  // [t, [x,y,z]]
  const POS = [
    [0.0, [24.0, 16.0, 37.0]],
    [7.0, [19.0, 13.0, 32.0]],
    [13.0, [12.0, 10.0, 26.0]],
    [19.0, [3.0, 10.0, 23.0]],
    [24.0, [-8.0, 11.0, 18.5]],
    [29.0, [-14.5, 10.0, 12.5]],
    [33.0, [-16.0, 10.0, -8.0]],
    [37.0, [-2.0, 8.5, -20.0]],
    [40.0, [12.0, 7.5, -18.0]],
    [44.0, [20.0, 11.0, -26.0]],
    [48.0, [24.0, 16.0, -34.0]],
  ];

  const TGT = [
    [0.0, [0.0, 3.2, 0.0]],
    [13.0, [0.0, 2.4, 0.0]],
    [19.0, [0.0, 2.2, 0.2]],
    [25.0, [0.2, 2.0, 0.0]],
    [33.0, [0.0, 2.2, 0.0]],
    [40.0, [0.0, 2.6, 0.0]],
    [48.0, [0.0, 3.4, 0.0]],
  ];

  const FOV = [
    [0.0, 36],
    [13.0, 39],
    [25.0, 40],
    [37.0, 39],
    [44.0, 37],
    [48.0, 35],
  ];

  const _p = new T.Vector3();
  const _t = new T.Vector3();

  SKY.cameraAt = function (t, camera) {
    M.trackVec3(_p, t, POS);
    M.trackVec3(_t, t, TGT);
    camera.position.copy(_p);
    camera.lookAt(_t);
    const fov = M.track(t, FOV);
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  };
})();
