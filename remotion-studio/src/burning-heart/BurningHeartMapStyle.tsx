import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence} from 'remotion';
import {Canvas} from '@react-three/fiber';
import {PerspectiveCamera, Environment, Float} from '@react-three/drei';
import {EffectComposer, Bloom} from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * 地图风格知识视频 - 完全复刻参考视频的美学
 *
 * 核心风格：
 * - 纯黑背景
 * - 发光线条路径动画
 * - 地图式俯视图
 * - 金色/橙色/彩色节点
 * - 强烈Bloom效果
 */

export const BurningHeartMapStyle: React.FC<{
  bgm: string;
}> = ({bgm}) => {
  const {fps} = useVideoConfig();

  // 2分30秒 = 150秒
  const SCENE_DURATIONS = {
    scene1: 20 * fps,  // 20秒 - 路径动画
    scene2: 25 * fps,  // 25秒 - 多店出现
    scene3: 20 * fps,  // 20秒 - 价格战
    scene4: 25 * fps,  // 25秒 - 柠檬市场
    scene5: 20 * fps,  // 20秒 - 3D卷轴
    scene6: 20 * fps,  // 20秒 - 总结
    scene7: 20 * fps,  // 20秒 - 结尾
  };

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 背景音乐 */}
      <audio src={bgm} />

      {/* 场景序列 */}
      <Sequence
  name="Scene1_PathLine"
  durationInFrames={SCENE_DURATIONS.scene1}
  from={-152}>
        <Scene1_PathLine />
      </Sequence>

      <Sequence
        name="Scene2_MultipleStores"
        from={SCENE_DURATIONS.scene1}
        durationInFrames={SCENE_DURATIONS.scene2}
      >
        <Scene2_MultipleStores />
      </Sequence>

      <Sequence
        name="Scene3_PriceWar"
        from={SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2}
        durationInFrames={SCENE_DURATIONS.scene3}
      >
        <Scene3_PriceWar />
      </Sequence>

      <Sequence
        name="Scene4_LemonMarket"
        from={SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2 + SCENE_DURATIONS.scene3}
        durationInFrames={SCENE_DURATIONS.scene4}
      >
        <Scene4_LemonMarket />
      </Sequence>

      <Sequence
        name="Scene5_3DScroll"
        from={SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2 + SCENE_DURATIONS.scene3 + SCENE_DURATIONS.scene4}
        durationInFrames={SCENE_DURATIONS.scene5}
      >
        <Scene5_3DScroll />
      </Sequence>

      <Sequence
        name="Scene6_Summary"
        from={SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2 + SCENE_DURATIONS.scene3 + SCENE_DURATIONS.scene4 + SCENE_DURATIONS.scene5}
        durationInFrames={SCENE_DURATIONS.scene6}
      >
        <Scene6_Summary />
      </Sequence>

      <Sequence
        name="Scene7_Credits"
        from={SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2 + SCENE_DURATIONS.scene3 + SCENE_DURATIONS.scene4 + SCENE_DURATIONS.scene5 + SCENE_DURATIONS.scene6}
        durationInFrames={SCENE_DURATIONS.scene7}
      >
        <Scene7_Credits />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * 场景1：路径线条动画
 * 模拟客流从四面八方汇入老店
 */
function Scene1_PathLine() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  // 路径绘制进度
  const pathProgress = interpolate(seconds, [0, 15], [0, 1], {
    easing: Easing.inOut(Easing.ease),
    extrapolateRight: 'clamp',
  });

  // 终点闪烁
  const endGlow = interpolate(seconds, [15, 16, 17, 18], [0, 1, 0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0}}
      >
        {/* 地图网格 */}
        <MapGrid />

        {/* 主路径 - 金色发光线 */}
        <GlowingPath
          d="M 200 540 Q 600 300, 960 540"
          progress={pathProgress}
          color="#FFB84D"
          strokeWidth={4}
        />

        {/* 起点 */}
        <circle cx="200" cy="540" r="8" fill="#FFB84D" opacity={pathProgress > 0 ? 1 : 0}>
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* 终点 - 老店 */}
        <circle cx="960" cy="540" r="15" fill="#FFB84D" opacity={endGlow}>
          <animate attributeName="r" values="15;20;15" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* 标注文字 */}
        <text x="960" y="600" fontSize="24" fill="#FFB84D" textAnchor="middle" opacity={endGlow}>
          老店
        </text>
      </svg>

      {/* 顶部标题 */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        color: '#999',
        fontSize: 16,
        fontFamily: 'monospace',
      }}>
        路线示意<br />
        CUSTOMER FLOW
      </div>

      {/* 底部字幕 */}
      <Subtitle text="隔壁不是随机刷新的，是谁把他吸引来的？" seconds={seconds} />
    </AbsoluteFill>
  );
}

/**
 * 场景2：多店铺出现
 * 彩色节点标记不同竞争对手
 */
function Scene2_MultipleStores() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  const stores = [
    {x: 960, y: 540, color: '#6EE7B7', label: '老店', delay: 0},
    {x: 1100, y: 540, color: '#E94235', label: '竞争者1', delay: 3},
    {x: 1050, y: 450, color: '#38BDF8', label: '竞争者2', delay: 6},
    {x: 1050, y: 630, color: '#FBBF24', label: '竞争者3', delay: 9},
  ];

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <MapGrid />

        {/* 绘制所有店铺及其连接线 */}
        {stores.map((store, i) => {
          const appear = interpolate(seconds, [store.delay, store.delay + 1], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <g key={i} opacity={appear}>
              {/* 连接到老店的路径 */}
              {i > 0 && (
                <line
                  x1={stores[0].x}
                  y1={stores[0].y}
                  x2={store.x}
                  y2={store.y}
                  stroke={store.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              )}

              {/* 店铺节点 */}
              <circle cx={store.x} cy={store.y} r="12" fill={store.color} filter="url(#glow)">
                <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* 标签 */}
              <text
                x={store.x}
                y={store.y + 35}
                fontSize="18"
                fill={store.color}
                textAnchor="middle"
              >
                {store.label}
              </text>
            </g>
          );
        })}

        {/* SVG滤镜定义 */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <Subtitle text="利润是市场发出的入场信号" seconds={seconds} />
    </AbsoluteFill>
  );
}

/**
 * 场景3-4：价格战 + 柠檬市场（简化）
 */
function Scene3_PriceWar() {
  return (
    <AbsoluteFill style={{background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{color: '#E94235', fontSize: 48, fontWeight: 'bold'}}>价格战场景</div>
    </AbsoluteFill>
  );
}

function Scene4_LemonMarket() {
  return (
    <AbsoluteFill style={{background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{color: '#FBBF24', fontSize: 48, fontWeight: 'bold'}}>柠檬市场场景</div>
    </AbsoluteFill>
  );
}

/**
 * 场景5：3D卷轴（复刻参考视频的金色卷轴）
 */
function Scene5_3DScroll() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={5} color="#FFB84D" />

        {/* 3D卷轴 */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh rotation={[0, frame * 0.01, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
            <meshStandardMaterial
              color="#FFB84D"
              emissive="#FFB84D"
              emissiveIntensity={2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>

        {/* 环绕的图标 */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2 + frame * 0.02;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3, 0, Math.sin(angle) * 3]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#E94235"
                emissive="#E94235"
                emissiveIntensity={3}
              />
            </mesh>
          );
        })}

        <Environment preset="night" />
        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.3} />
        </EffectComposer>
      </Canvas>

      <Subtitle text="五个机制嵌套的链条" seconds={frame / fps} />
    </AbsoluteFill>
  );
}

function Scene6_Summary() {
  return <AbsoluteFill style={{background: '#000'}} />;
}

function Scene7_Credits() {
  return <AbsoluteFill style={{background: '#000'}} />;
}

// 辅助组件

function MapGrid() {
  return (
    <g opacity="0.15">
      {/* 横线 */}
      {Array.from({length: 20}).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 60}
          x2="1920"
          y2={i * 60}
          stroke="#444"
          strokeWidth="1"
        />
      ))}
      {/* 竖线 */}
      {Array.from({length: 35}).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 60}
          y1="0"
          x2={i * 60}
          y2="1080"
          stroke="#444"
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function GlowingPath({
  d,
  progress,
  color,
  strokeWidth,
}: {
  d: string;
  progress: number;
  color: string;
  strokeWidth: number;
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="2000"
        strokeDashoffset={2000 * (1 - progress)}
        filter="url(#glow)"
      />
    </>
  );
}

function Subtitle({text, seconds}: {text: string; seconds: number}) {
  const opacity = interpolate(seconds, [1, 2], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
      }}
    >
      <p
        style={{
          fontSize: 36,
          color: '#FFF',
          margin: 0,
          textShadow: '0 0 20px rgba(255,255,255,0.8)',
        }}
      >
        {text}
      </p>
    </div>
  );
}
