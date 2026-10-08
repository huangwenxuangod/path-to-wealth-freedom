import {Canvas} from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera, Environment, Float, Text3D, Center} from '@react-three/drei';
import {EffectComposer, Bloom, ChromaticAberration, Vignette} from '@react-three/postprocessing';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';
import * as THREE from 'three';

/**
 * 场景3-7：简化版本，纯3D效果
 * 先确保基础能运行，后续再增强
 */

// 场景3：贴脸开店
export function Scene3_NextDoor({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} castShadow />

        {/* 两个店面对比 */}
        <Float speed={1} floatIntensity={0.3}>
          <group position={[-4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 3, 2]} />
              <meshStandardMaterial color="#6EE7B7" emissive="#6EE7B7" emissiveIntensity={2} />
            </mesh>
          </group>
        </Float>

        <Float speed={1} floatIntensity={0.3}>
          <group position={[4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 3, 2]} />
              <meshStandardMaterial color="#E94235" emissive="#E94235" emissiveIntensity={2} />
            </mesh>
          </group>
        </Float>

        <Environment preset="city" />
        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.4} />
          <Vignette darkness={0.7} />
        </EffectComposer>
      </Canvas>

      <UITitle title="第二层：为什么贴脸开" subtitle="共享客流 > 价格竞争" opacity={titleOpacity} color={tokens.color.accent.secondary} />
    </AbsoluteFill>
  );
}

// 场景4：价格绞杀
export function Scene4_PriceKill({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  const price1 = interpolate(seconds, [2, 8], [spec.originalStore.price, spec.originalStore.price - 2], {extrapolateRight: 'clamp'});
  const price2 = interpolate(seconds, [2, 8], [spec.competitorStore.price, spec.competitorStore.price - 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 3, 12]} fov={50} />
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 10, 5]} intensity={3} color="#E94235" />

        {/* 价格牌 */}
        <Float>
          <group position={[-3, 0, 0]}>
            <mesh>
              <boxGeometry args={[2, 2, 0.2]} />
              <meshStandardMaterial color="#6EE7B7" emissive="#6EE7B7" emissiveIntensity={3} />
            </mesh>
          </group>
        </Float>

        <Float>
          <group position={[3, 0, 0]}>
            <mesh>
              <boxGeometry args={[2, 2, 0.2]} />
              <meshStandardMaterial color="#E94235" emissive="#E94235" emissiveIntensity={5} />
            </mesh>
          </group>
        </Float>

        <Environment preset="night" />
        <EffectComposer>
          <Bloom intensity={1.5} />
          <ChromaticAberration offset={[0.002, 0.002]} />
        </EffectComposer>
      </Canvas>

      <UITitle title="第三层：价格绞杀" subtitle={`¥${price1.toFixed(0)} vs ¥${price2.toFixed(0)}`} opacity={titleOpacity} color={tokens.color.accent.primary} />
    </AbsoluteFill>
  );
}

// 场景5：柠檬市场
export function Scene5_Lemon({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={50} />
        <ambientLight intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={2} color="#FBBF24" />

        {/* 两碗面 */}
        <Float speed={2}>
          <group position={[-2.5, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial color="#6EE7B7" emissive="#6EE7B7" emissiveIntensity={2} />
            </mesh>
          </group>
        </Float>

        <Float speed={2}>
          <group position={[2.5, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={2} />
            </mesh>
          </group>
        </Float>

        <Environment preset="sunset" />
        <EffectComposer>
          <Bloom intensity={1.2} />
          <Vignette darkness={0.8} />
        </EffectComposer>
      </Canvas>

      <UITitle title="第四层：柠檬市场" subtitle="品质不可见时，便宜胜出" opacity={titleOpacity} color={tokens.color.accent.warning} />
    </AbsoluteFill>
  );
}

// 场景6：真相反转
export function Scene6_Truth({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        <ambientLight intensity={0.3} />
        <spotLight position={[5, 5, 5]} intensity={2} />

        {/* 三个选项 */}
        {[-3, 0, 3].map((x, i) => (
          <Float key={i} speed={1 + i * 0.5}>
            <group position={[x, 0, 0]}>
              <mesh>
                <boxGeometry args={[1.5, 2, 0.3]} />
                <meshStandardMaterial
                  color={i === 0 ? '#E94235' : i === 1 ? '#6EE7B7' : '#FBBF24'}
                  emissive={i === 0 ? '#E94235' : i === 1 ? '#6EE7B7' : '#FBBF24'}
                  emissiveIntensity={3}
                />
              </mesh>
            </group>
          </Float>
        ))}

        <Environment preset="city" />
        <EffectComposer>
          <Bloom intensity={1.3} />
        </EffectComposer>
      </Canvas>

      <UITitle title="第五层：真相反转" subtitle="便宜不等于黑心" opacity={titleOpacity} color={tokens.color.accent.secondary} />
    </AbsoluteFill>
  );
}

// 场景7：收尾
export function Scene7_Outro({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.surface[0]}}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <ambientLight intensity={0.4} />

        {/* 五个概念环绕 */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 5;
          return (
            <Float key={i} speed={1 + i * 0.3}>
              <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                <mesh>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial
                    color={tokens.color.accent.secondary}
                    emissive={tokens.color.accent.secondary}
                    emissiveIntensity={5}
                  />
                </mesh>
              </group>
            </Float>
          );
        })}

        <Environment preset="dawn" />
        <EffectComposer>
          <Bloom intensity={1.5} />
          <Vignette darkness={0.6} />
        </EffectComposer>
      </Canvas>

      <UITitle title={spec.title} subtitle={spec.subtitle} opacity={titleOpacity} color={tokens.color.accent.secondary} />
    </AbsoluteFill>
  );
}

// 通用UI标题组件
function UITitle({title, subtitle, opacity, color}: {title: string; subtitle: string; opacity: number; color: string}) {
  return (
    <div style={{
      position: 'absolute',
      top: tokens.spacing['2xl'],
      left: 0,
      right: 0,
      textAlign: 'center',
      opacity,
      pointerEvents: 'none',
    }}>
      <h2 style={{
        fontSize: tokens.fontSize['4xl'],
        fontWeight: tokens.fontWeight.black,
        color,
        margin: 0,
        textShadow: `0 0 40px ${color}`,
        textTransform: 'uppercase',
        letterSpacing: tokens.letterSpacing.wide,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: tokens.fontSize.xl,
        color: tokens.color.text.secondary,
        margin: `${tokens.spacing.sm} 0 0`,
      }}>
        {subtitle}
      </p>
    </div>
  );
}
