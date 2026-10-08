import {Canvas, useFrame} from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  Float,
  MeshTransmissionMaterial,
  SpotLight,
  Trail,
  Center,
  Text3D,
  useTexture,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Noise,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing';
import {BlendFunction, ToneMappingMode} from 'postprocessing';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';
import * as THREE from 'three';
import {useRef, useMemo} from 'react';

/**
 * 场景2：召唤机制 - 3D粒子流 + 信号波
 * 核心视觉：
 * - 俯视3D街道网格
 * - 粒子从四面八方汇入店铺
 * - 利润数字3D浮现
 * - 信号波纹扩散（3D环形）
 * - 新店从地面升起
 */
export function Scene2_Summoned({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 摄像机动画 - 从俯视到斜角
  const cameraY = interpolate(seconds, [0, 5, 20], [20, 15, 12], {
    easing: Easing.inOut(Easing.ease),
    extrapolateRight: 'clamp',
  });

  const cameraX = interpolate(seconds, [0, 5], [0, 5], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {/* 摄像机 */}
        <PerspectiveCamera
          makeDefault
          position={[cameraX, cameraY, 20]}
          fov={45}
          near={0.1}
          far={1000}
        />

        {/* 灯光 */}
        <ambientLight intensity={0.2} />
        <SpotLight
          position={[0, 20, 0]}
          angle={0.8}
          penumbra={1}
          intensity={3}
          color="#6EE7B7"
          castShadow
        />

        {/* 3D网格地面 */}
        <GridFloor seconds={seconds} />

        {/* 老店（3D立方体）*/}
        <OldStoreBuilding spec={spec} seconds={seconds} />

        {/* 粒子流（客流）*/}
        <CustomerParticleFlow seconds={seconds} count={100} />

        {/* 利润数字3D */}
        <ProfitNumber spec={spec} seconds={seconds} />

        {/* 信号波纹 */}
        <SignalWave seconds={seconds} />

        {/* 新店升起 */}
        <NewStoreRising spec={spec} seconds={seconds} />

        {/* 环境 */}
        <Environment preset="city" />

        {/* 后期 */}
        <EffectComposer multisampling={8}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration offset={[0.001, 0.001]} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>

      {/* 2D UI 叠加 */}
      <UIOverlay spec={spec} seconds={seconds} />
    </AbsoluteFill>
  );
}

// 3D网格地面
function GridFloor({seconds}: {seconds: number}) {
  const opacity = interpolate(seconds, [1, 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <group>
      {/* 主网格 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100, 100, 100]} />
        <meshStandardMaterial
          color="#38BDF8"
          wireframe
          opacity={opacity * 0.3}
          transparent
        />
      </mesh>

      {/* 发光网格线 */}
      <gridHelper
        args={[100, 50, '#38BDF8', '#0A0D12']}
        position={[0, 0.01, 0]}
        material-opacity={opacity}
        material-transparent
      />
    </group>
  );
}

// 老店3D建筑
function OldStoreBuilding({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const scale = interpolate(seconds, [2, 3], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(seconds, [5, 10], [2, 8], {
    extrapolateRight: 'clamp',
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[-5, 2, 0]} scale={scale}>
        {/* 建筑主体 */}
        <mesh castShadow>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial
            color="#6EE7B7"
            emissive="#6EE7B7"
            emissiveIntensity={glowIntensity}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* 店名标识 */}
        <mesh position={[0, 2.5, 1.51]}>
          <planeGeometry args={[2, 0.5]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#6EE7B7"
            emissiveIntensity={5}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 粒子流（客流汇入）
function CustomerParticleFlow({seconds, count}: {seconds: number; count: number}) {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 20 + Math.random() * 10;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // 速度指向中心
      const dx = -5 - pos[i * 3];
      const dy = 2 - pos[i * 3 + 1];
      const dz = 0 - pos[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      vel[i * 3] = (dx / dist) * 0.1;
      vel[i * 3 + 1] = (dy / dist) * 0.1;
      vel[i * 3 + 2] = (dz / dist) * 0.1;
    }

    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // 到达中心后重置
      const dx = -5 - pos[i * 3];
      const dy = 2 - pos[i * 3 + 1];
      const dz = 0 - pos[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 2) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 20 + Math.random() * 10;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = Math.random() * 5;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const flowStart = interpolate(seconds, [3, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  if (flowStart === 0) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#38BDF8"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D利润数字
function ProfitNumber({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const opacity = interpolate(seconds, [5, 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const profitValue = Math.floor(
    interpolate(seconds, [6, 10], [0, spec.originalStore.price - spec.originalStore.cost], {
      extrapolateRight: 'clamp',
    })
  );

  const yPosition = interpolate(seconds, [6, 10], [2, 5], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  });

  if (opacity === 0) return null;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[-5, yPosition, 0]}>
        <Center>
          <Text3D
            font="/fonts/inter-bold.json"
            size={1.5}
            height={0.3}
            curveSegments={12}
          >
            +¥{profitValue}
            <meshStandardMaterial
              color="#6EE7B7"
              emissive="#6EE7B7"
              emissiveIntensity={10}
              transparent
              opacity={opacity}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

// 信号波纹扩散
function SignalWave({seconds}: {seconds: number}) {
  const waveScale = interpolate(seconds, [10, 12], [0, 15], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  const waveOpacity = interpolate(seconds, [10, 12], [1, 0], {
    extrapolateRight: 'clamp',
  });

  if (waveScale === 0) return null;

  return (
    <group position={[-5, 0.5, 0]}>
      {[0, 0.5, 1].map((delay, i) => {
        const scale = interpolate(
          seconds,
          [10 + delay, 12 + delay],
          [0, 15],
          {easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp'}
        );
        const opacity = interpolate(
          seconds,
          [10 + delay, 12 + delay],
          [0.8, 0],
          {extrapolateRight: 'clamp'}
        );

        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
            <ringGeometry args={[0.9, 1, 32]} />
            <meshBasicMaterial
              color="#E94235"
              transparent
              opacity={opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 新店升起
function NewStoreRising({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const yPosition = interpolate(seconds, [15, 17], [-5, 2], {
    easing: Easing.out(Easing.elastic(1)),
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(seconds, [15, 16], [0, 1], {
    extrapolateRight: 'clamp',
  });

  if (opacity === 0) return null;

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[5, yPosition, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial
            color="#E94235"
            emissive="#E94235"
            emissiveIntensity={5}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 2D UI叠加层
function UIOverlay({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const conceptOpacity = interpolate(seconds, [12, 13], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const explanationOpacity = interpolate(seconds, [18, 19], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: tokens.spacing['2xl'],
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontSize: tokens.fontSize['4xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.accent.success,
          margin: 0,
          textShadow: `0 0 40px ${tokens.color.accent.success}`,
          textTransform: 'uppercase',
          letterSpacing: tokens.letterSpacing.wide,
        }}>
          第一层：召唤机制
        </h2>
        <p style={{
          fontSize: tokens.fontSize.xl,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          利润是市场发出的入场信号
        </p>
      </div>

      {/* 经济学概念 */}
      {conceptOpacity > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: conceptOpacity,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${tokens.color.surface[3]}dd, ${tokens.color.surface[2]}dd)`,
            border: `2px solid ${tokens.color.accent.success}`,
            borderRadius: tokens.radius.full,
            padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 40px ${tokens.color.accent.success}60`,
          }}>
            <span style={{
              fontSize: tokens.fontSize['2xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.accent.success,
              fontFamily: tokens.font.mono,
            }}>
              {spec.concepts.freeEntry}
            </span>
          </div>
        </div>
      )}

      {/* 解释文字 */}
      {explanationOpacity > 0 && (
        <div style={{
          position: 'absolute',
          bottom: tokens.spacing['3xl'],
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          textAlign: 'center',
          opacity: explanationOpacity,
        }}>
          <p style={{
            fontSize: tokens.fontSize.xl,
            color: tokens.color.text.primary,
            lineHeight: tokens.lineHeight.relaxed,
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}>
            <strong style={{color: tokens.color.accent.success}}>超额利润</strong>
            是市场公开广播的信号。第一家店验证了"这里有人买"，
            后来者不用试错，<strong style={{color: tokens.color.accent.primary}}>直接算账进入</strong>。
          </p>
        </div>
      )}
    </div>
  );
}
