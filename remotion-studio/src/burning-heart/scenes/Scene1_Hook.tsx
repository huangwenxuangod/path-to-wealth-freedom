import {Canvas} from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  Float,
  Text3D,
  MeshTransmissionMaterial,
  SpotLight,
  Lightformer,
  Center,
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

/**
 * 场景1：开场钩子 - 3D电影级
 * 核心视觉：
 * - 3D红色人物剪影（发光体）
 * - 棋盘格地面 + 透视
 * - 体积光束
 * - HUD数据界面
 * - 后期：Bloom + 色差 + 景深
 */
export function Scene1_Hook({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 摄像机动画
  const cameraZ = interpolate(seconds, [0, 3, 12], [15, 8, 12], {
    easing: Easing.inOut(Easing.ease),
    extrapolateRight: 'clamp',
  });

  const cameraY = interpolate(seconds, [0, 3], [5, 3], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  });

  // 人物光强度
  const glowIntensity = interpolate(seconds, [2, 3, 3.5, 4], [0, 10, 8, 10], {
    extrapolateRight: 'clamp',
  });

  // 文字动画
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const questionOpacity = interpolate(seconds, [6, 7], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* 摄像机 */}
        <PerspectiveCamera
          makeDefault
          position={[0, cameraY, cameraZ]}
          fov={50}
          near={0.1}
          far={1000}
        />

        {/* 环境光 */}
        <ambientLight intensity={0.1} />

        {/* 主聚光灯（红色） */}
        <SpotLight
          position={[0, 10, 5]}
          angle={0.5}
          penumbra={0.5}
          intensity={glowIntensity}
          color="#FF0033"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* 背景聚光灯 */}
        <SpotLight
          position={[0, 5, -10]}
          angle={1}
          penumbra={1}
          intensity={2}
          color="#660000"
        />

        {/* 棋盘格地面 */}
        <CheckerboardFloor seconds={seconds} />

        {/* 3D发光人物剪影 */}
        <GlowingFigure seconds={seconds} glowIntensity={glowIntensity} />

        {/* 悬浮粒子 */}
        <FloatingParticles count={50} />

        {/* HDR环境 */}
        <Environment preset="night" />

        {/* 后期处理 */}
        <EffectComposer multisampling={8}>
          {/* 强烈辉光 */}
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />

          {/* 色差 */}
          <ChromaticAberration
            offset={[0.002, 0.002]}
            blendFunction={BlendFunction.NORMAL}
          />

          {/* 景深 */}
          <DepthOfField
            focusDistance={0.01}
            focalLength={0.1}
            bokehScale={3}
          />

          {/* 电影颗粒 */}
          <Noise opacity={0.05} />

          {/* 暗角 */}
          <Vignette eskil={false} offset={0.1} darkness={0.8} />

          {/* 色调映射 */}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>

      {/* 2D HUD 叠加层 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}>
        {/* 顶部标题 */}
        <div style={{
          position: 'absolute',
          top: tokens.spacing['3xl'],
          left: tokens.spacing['3xl'],
          opacity: titleOpacity,
        }}>
          <h1 style={{
            fontSize: tokens.fontSize['5xl'],
            fontWeight: tokens.fontWeight.black,
            color: tokens.color.text.primary,
            margin: 0,
            lineHeight: tokens.lineHeight.tight,
            textShadow: `0 0 40px ${tokens.color.accent.primary}`,
            letterSpacing: tokens.letterSpacing.tight,
          }}>
            {spec.hook.split('，')[0]}
            <br />
            <span style={{color: tokens.color.accent.primary}}>
              {spec.hook.split('，')[1]}
            </span>
          </h1>
        </div>

        {/* 右侧HUD数据面板 */}
        <HUDPanel seconds={seconds} />

        {/* 底部问题 */}
        <div style={{
          position: 'absolute',
          bottom: tokens.spacing['4xl'],
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: questionOpacity,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.black,
            color: tokens.color.accent.primary,
            margin: 0,
            textShadow: `0 0 60px ${tokens.color.accent.primary}`,
            letterSpacing: tokens.letterSpacing.tight,
          }}>
            隔壁是被谁召唤来的？
          </h2>
        </div>

        {/* 扫描线效果 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }} />
      </div>
    </AbsoluteFill>
  );
}

// 棋盘格地面组件
function CheckerboardFloor({seconds}: {seconds: number}) {
  const gridOpacity = interpolate(seconds, [1, 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#0a0a0a"
        roughness={0.8}
        metalness={0.2}
        opacity={gridOpacity}
        transparent
        wireframe
      />
    </mesh>
  );
}

// 3D发光人物剪影
function GlowingFigure({seconds, glowIntensity}: {seconds: number; glowIntensity: number}) {
  const scale = interpolate(seconds, [2, 3], [0, 1], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateRight: 'clamp',
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group scale={scale}>
        {/* 身体 */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.5, 2, 16, 32]} />
          <meshStandardMaterial
            color="#FF0033"
            emissive="#FF0033"
            emissiveIntensity={glowIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* 头部 */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#FF0033"
            emissive="#FF0033"
            emissiveIntensity={glowIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* 手臂（左）*/}
        <mesh position={[-0.7, 0.5, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.2, 1.5, 8, 16]} />
          <meshStandardMaterial
            color="#FF0033"
            emissive="#FF0033"
            emissiveIntensity={glowIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* 手臂（右）*/}
        <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.2, 1.5, 8, 16]} />
          <meshStandardMaterial
            color="#FF0033"
            emissive="#FF0033"
            emissiveIntensity={glowIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 悬浮粒子系统
function FloatingParticles({count}: {count: number}) {
  const particles = new Array(count).fill(0).map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 20,
      Math.random() * 10 - 2,
      (Math.random() - 0.5) * 20,
    ] as [number, number, number],
    scale: Math.random() * 0.1 + 0.05,
    speed: Math.random() * 2 + 1,
  }));

  return (
    <group>
      {particles.map((particle, i) => (
        <Float key={i} speed={particle.speed} rotationIntensity={0} floatIntensity={2}>
          <mesh position={particle.position}>
            <sphereGeometry args={[particle.scale, 8, 8]} />
            <meshStandardMaterial
              color="#FF0033"
              emissive="#FF0033"
              emissiveIntensity={5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// HUD数据面板
function HUDPanel({seconds}: {seconds: number}) {
  const opacity = interpolate(seconds, [3, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const speed = interpolate(seconds, [4, 8], [0, 36.5], {
    extrapolateRight: 'clamp',
  });

  const displacement = interpolate(seconds, [4, 8], [0, 0.15], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute',
      top: tokens.spacing['2xl'],
      right: tokens.spacing['2xl'],
      opacity,
    }}>
      {/* 速度 */}
      <div style={{
        background: `linear-gradient(135deg, ${tokens.color.surface[2]}dd, ${tokens.color.surface[1]}dd)`,
        border: `1px solid ${tokens.color.accent.primary}40`,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        marginBottom: tokens.spacing.md,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 20px ${tokens.color.accent.primary}40`,
      }}>
        <div style={{
          fontSize: tokens.fontSize.sm,
          color: tokens.color.text.muted,
          marginBottom: tokens.spacing.xs,
        }}>
          速度 SPEED
        </div>
        <div style={{
          fontSize: tokens.fontSize['4xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.text.primary,
          fontFamily: tokens.font.mono,
        }}>
          {speed.toFixed(1)}
          <span style={{fontSize: tokens.fontSize.lg, marginLeft: tokens.spacing.xs}}>km/h</span>
        </div>
      </div>

      {/* 位移 */}
      <div style={{
        background: `linear-gradient(135deg, ${tokens.color.surface[2]}dd, ${tokens.color.surface[1]}dd)`,
        border: `1px solid ${tokens.color.accent.secondary}40`,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        marginBottom: tokens.spacing.md,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 20px ${tokens.color.accent.secondary}40`,
      }}>
        <div style={{
          fontSize: tokens.fontSize.sm,
          color: tokens.color.text.muted,
          marginBottom: tokens.spacing.xs,
        }}>
          位移 DISPLACEMENT
        </div>
        <div style={{
          fontSize: tokens.fontSize['4xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.text.primary,
          fontFamily: tokens.font.mono,
        }}>
          {displacement.toFixed(2)}
        </div>
      </div>

      {/* 心率 */}
      <div style={{
        background: `linear-gradient(135deg, ${tokens.color.surface[2]}dd, ${tokens.color.surface[1]}dd)`,
        border: `1px solid ${tokens.color.accent.success}40`,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 20px ${tokens.color.accent.success}40`,
      }}>
        <div style={{
          fontSize: tokens.fontSize.sm,
          color: tokens.color.text.muted,
          marginBottom: tokens.spacing.xs,
        }}>
          心率 HR
        </div>
        <div style={{
          fontSize: tokens.fontSize['4xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.text.primary,
          fontFamily: tokens.font.mono,
        }}>
          {Math.floor(interpolate(seconds, [4, 8], [120, 191], {extrapolateRight: 'clamp'}))}
          <span style={{fontSize: tokens.fontSize.lg, marginLeft: tokens.spacing.xs}}>bpm</span>
        </div>
      </div>
    </div>
  );
}
