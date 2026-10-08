import * as THREE from 'three';
import {useMemo, useLayoutEffect, useRef} from 'react';
import {PerspectiveCamera} from '@react-three/drei';

/**
 * 3D 场景层 —— 复刻参考视频的核心视觉
 *
 * 参考视频的关键：不是平面动画，而是一个"3D 线框地形世界"。
 * 地形只在前景可见，向后指数衰减进纯黑；发光路径贴着地面起伏穿行。
 */

export const TERRAIN_SIZE = 160;
export const TERRAIN_SEG = 120;

/** 地形高度场 —— 确定性正弦叠加，保证逐帧渲染一致 */
export function terrainHeight(x: number, z: number): number {
  return (
    Math.sin(x * 0.085) * Math.cos(z * 0.062) * 2.8 +
    Math.sin(x * 0.028 + z * 0.041) * 3.6 +
    Math.cos(x * 0.051 - z * 0.019) * 1.9 +
    Math.sin(z * 0.11) * 0.9
  );
}

/** 缓动 */
export const easeInOut = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

/** 关键帧插值：[秒, [x,y,z]][], 返回 [x,y,z] */
export function keyframe(
  pairs: [number, [number, number, number]][],
  t: number
): [number, number, number] {
  if (t <= pairs[0][0]) return pairs[0][1];
  const last = pairs[pairs.length - 1];
  if (t >= last[0]) return last[1];

  for (let i = 0; i < pairs.length - 1; i++) {
    const [t0, v0] = pairs[i];
    const [t1, v1] = pairs[i + 1];
    if (t >= t0 && t <= t1) {
      const p = easeInOut((t - t0) / (t1 - t0));
      return [
        v0[0] + (v1[0] - v0[0]) * p,
        v0[1] + (v1[1] - v0[1]) * p,
        v0[2] + (v1[2] - v0[2]) * p,
      ];
    }
  }
  return last[1];
}

/* ────────────────────────────── 地形 ────────────────────────────── */

export function Terrain({reveal}: {reveal: number}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEG,
      TERRAIN_SEG
    );
    g.rotateX(-Math.PI / 2);

    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} frustumCulled={false}>
      <meshBasicMaterial
        wireframe
        color="#8a7355"
        transparent
        opacity={0.55 * reveal}
        fog
      />
    </mesh>
  );
}

/* ────────────────────────────── 原子节点 ────────────────────────────── */

/** 生成参考视频里的 ⊛ 原子符号贴图 */
function makeAtomTexture(hex: string): THREE.Texture {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  const cx = S / 2;
  const cy = S / 2;
  const ring = 66;

  // 外环
  ctx.strokeStyle = hex;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(cx, cy, ring, 0, Math.PI * 2);
  ctx.stroke();

  // 中心十字
  ctx.fillStyle = hex;
  ctx.fillRect(cx - 26, cy - 5, 52, 10);
  ctx.fillRect(cx - 5, cy - 26, 10, 52);

  // 中心圆点
  ctx.beginPath();
  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
  ctx.fill();

  // 四个轨道点
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * ring, cy + Math.sin(a) * ring, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type NodeDef = {
  x: number;
  z: number;
  color: string;
  birth: number; // 出现时间（秒）
  label?: string;
  size?: number;
};

export function AtomNodes({nodes, t}: {nodes: NodeDef[]; t: number}) {
  const textures = useMemo(() => {
    const cache = new Map<string, THREE.Texture>();
    return (color: string) => {
      if (!cache.has(color)) cache.set(color, makeAtomTexture(color));
      return cache.get(color)!;
    };
  }, []);

  return (
    <group>
      {nodes.map((n, i) => {
        const age = t - n.birth;
        if (age < 0) return null;

        // 弹出动画
        const grow = Math.min(1, age / 0.9);
        const pop = age < 0.9 ? 1 + Math.sin(grow * Math.PI) * 0.55 : 1;
        const base = n.size ?? 3.2;

        // 呼吸脉冲
        const pulse = 1 + Math.sin(t * 2.1 + i * 1.7) * 0.07;
        const scale = base * grow * pop * pulse;

        // 光晕强度
        const glow = 0.75 + Math.sin(t * 3.3 + i * 2.1) * 0.25;

        return (
          <sprite
            key={i}
            position={[n.x, terrainHeight(n.x, n.z) + 1.6, n.z]}
            scale={[scale, scale, scale]}
          >
            <spriteMaterial
              map={textures(n.color)}
              transparent
              opacity={grow * glow}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog
            />
          </sprite>
        );
      })}
    </group>
  );
}

/* ────────────────────────────── 发光路径 ────────────────────────────── */

export type PathDef = {
  points: [number, number][]; // [x, z] 控制点
  color: string;
  from: number; // 开始生长（秒）
  to: number; // 生长完成（秒）
  width?: number;
};

export function GlowPaths({paths, t}: {paths: PathDef[]; t: number}) {
  return (
    <group>
      {paths.map((p, i) => (
        <GlowPath key={i} def={p} t={t} />
      ))}
    </group>
  );
}

function GlowPath({def, t}: {def: PathDef; t: number}) {
  const width = def.width ?? 2.6;

  const curve = useMemo(() => {
    const pts = def.points.map(
      ([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 1.35, z)
    );
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  }, [def]);

  const {halo, core, total} = useMemo(() => {
    const samples = 500;
    const pts = curve.getPoints(samples);
    const total = pts.length;

    const mk = (w: number, opacity: number) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true,
      });
      const l = new THREE.Line(g, m);
      l.frustumCulled = false;
      return l;
    };

    return {halo: mk(width * 2, 0.22), core: mk(width, 0.95), total};
  }, [curve, def.color, width]);

  // 生长进度
  const raw = (t - def.from) / (def.to - def.from);
  const prog = Math.max(0, Math.min(1, raw));
  const count = Math.max(0, Math.floor(prog * total));

  useLayoutEffect(() => {
    halo.geometry.setDrawRange(0, count);
    core.geometry.setDrawRange(0, count);
  }, [halo, core, count]);

  if (prog <= 0) return null;

  return (
    <group>
      <primitive object={halo} />
      <primitive object={core} />
    </group>
  );
}

/** 沿路径运货的光点（"商队"） */
export function PathRunners({paths, t}: {paths: PathDef[]; t: number}) {
  const runners = useMemo(
    () =>
      paths.map((p, i) => {
        const pts = p.points.map(
          ([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 1.9, z)
        );
        return {
          curve: new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4),
          color: p.color,
          offset: (i * 0.37) % 1,
          start: p.to,
        };
      }),
    [paths]
  );

  return (
    <group>
      {runners.map((r, i) => {
        const age = t - r.start;
        if (age < 0) return null;
        const fade = Math.min(1, age / 0.6);

        return (
          <group key={i}>
            {[0, 1, 2].map((k) => {
              const u = ((age * 0.13 + r.offset + k * 0.12) % 1 + 1) % 1;
              const pt = r.curve.getPointAt(u);
              return (
                <sprite
                  key={k}
                  position={[pt.x, pt.y, pt.z]}
                  scale={[1.5, 1.5, 1.5]}
                >
                  <spriteMaterial
                    color={r.color}
                    transparent
                    opacity={fade * 0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </sprite>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/* ────────────────────────────── 尘埃 ────────────────────────────── */

/** 确定性伪随机 */
function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function Dust({count = 1400, spread = 90}: {count: number; spread: number}) {
  const geo = useMemo(() => {
    const rnd = prng(20261005);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rnd() - 0.5) * spread * 2;
      arr[i * 3 + 1] = rnd() * 26 - 2;
      arr[i * 3 + 2] = (rnd() - 0.5) * spread * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count, spread]);

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        size={0.34}
        color="#d9c9a8"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog
      />
    </points>
  );
}

/* ────────────────────────────── 运镜 ────────────────────────────── */

export const CAM_POS: [number, [number, number, number]][] = [
  [0, [-46, 9, 26]],
  [22, [-14, 11, 20]],
  [46, [4, 20, 24]],
  [70, [20, 24, 6]],
  [94, [6, 22, -18]],
  [118, [-8, 30, 6]],
  [136, [0, 46, 30]],
  [150, [0, 46, 30]],
];

export const CAM_TGT: [number, [number, number, number]][] = [
  [0, [-30, 2, 4]],
  [22, [-4, 3, 0]],
  [46, [0, 2, 0]],
  [70, [12, 2, 0]],
  [94, [0, 2, 0]],
  [118, [0, 2, 0]],
  [136, [0, 2, 4]],
  [150, [0, 2, 4]],
];

export function CameraRig({t, fov = 42}: {t: number; fov?: number}) {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  const pos = keyframe(CAM_POS, t);
  const tgt = keyframe(CAM_TGT, t);

  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.position.set(pos[0], pos[1], pos[2]);
    c.lookAt(new THREE.Vector3(tgt[0], tgt[1], tgt[2]));
    c.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera ref={ref} makeDefault fov={fov} near={0.5} far={420} />
  );
}
