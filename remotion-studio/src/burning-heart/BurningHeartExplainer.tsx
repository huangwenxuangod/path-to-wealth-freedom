import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio, staticFile} from 'remotion';
import {Scene1_Hook} from './scenes/Scene1_Hook';
import {Scene2_Summoned} from './scenes/Scene2_Summoned';
import {Scene3_NextDoor, Scene4_PriceKill, Scene5_Lemon, Scene6_Truth, Scene7_Outro} from './scenes/Scene3-7_Simplified';
import {tokens} from './tokens';
import type {BurningHeartSpec} from './spec';
import '../fonts';

export function BurningHeartExplainer(spec: BurningHeartSpec) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  // BGM循环：29.65秒一轮，视频150秒 = 约5轮循环
  const bgmDuration = 29.65;
  const totalDuration = 150; // 2分30秒

  // 场景时长配置（秒）- 充分展开每个经济学原理
  const scenes = {
    hook: {from: 0, duration: 12},          // 开场钩子："隔壁刷新"现象 + 问题提出
    summoned: {from: 12, duration: 25},     // 第一层：利润信号 = 召唤术（自由进入）
    nextDoor: {from: 37, duration: 25},     // 第二层：为什么贴脸开（霍特林空间竞争）
    priceKill: {from: 62, duration: 25},    // 第三层：价格绞杀（伯特兰竞争）
    lemon: {from: 87, duration: 30},        // 第四层：柠檬市场（品质不可见）
    truth: {from: 117, duration: 20},       // 第五层：真相反转
    outro: {from: 137, duration: 13},       // 收尾：金句 + 信息源
  };

  return (
    <AbsoluteFill style={{
      background: tokens.color.surface[0],
      color: tokens.color.text.primary,
      fontFamily: tokens.font.sans
    }}>
      {/* BGM 循环播放 */}
      <Audio
        src={staticFile('music/不烧心时代.mp3')}
        volume={0.6}
        loop
      />

      {/* 场景1：开场钩子 */}
      <Sequence
        from={scenes.hook.from * fps}
        durationInFrames={scenes.hook.duration * fps}
        name="钩子"
      >
        <Scene1_Hook spec={spec} seconds={seconds - scenes.hook.from} />
      </Sequence>

      {/* 场景2：隔壁不是刷新的，是你召唤的 */}
      <Sequence
        from={scenes.summoned.from * fps}
        durationInFrames={scenes.summoned.duration * fps}
        name="召唤"
      >
        <Scene2_Summoned spec={spec} seconds={seconds - scenes.summoned.from} />
      </Sequence>

      {/* 场景3：为什么贴脸开 */}
      <Sequence
        from={scenes.nextDoor.from * fps}
        durationInFrames={scenes.nextDoor.duration * fps}
        name="贴脸"
      >
        <Scene3_NextDoor spec={spec} seconds={seconds - scenes.nextDoor.from} />
      </Sequence>

      {/* 场景4：价格绞杀 */}
      <Sequence
        from={scenes.priceKill.from * fps}
        durationInFrames={scenes.priceKill.duration * fps}
        name="降价"
      >
        <Scene4_PriceKill spec={spec} seconds={seconds - scenes.priceKill.from} />
      </Sequence>

      {/* 场景5：柠檬市场 */}
      <Sequence
        from={scenes.lemon.from * fps}
        durationInFrames={scenes.lemon.duration * fps}
        name="柠檬"
      >
        <Scene5_Lemon spec={spec} seconds={seconds - scenes.lemon.from} />
      </Sequence>

      {/* 场景6：真相 */}
      <Sequence
        from={scenes.truth.from * fps}
        durationInFrames={scenes.truth.duration * fps}
        name="真相"
      >
        <Scene6_Truth spec={spec} seconds={seconds - scenes.truth.from} />
      </Sequence>

      {/* 场景7：收尾 */}
      <Sequence
        from={scenes.outro.from * fps}
        durationInFrames={scenes.outro.duration * fps}
        name="收尾"
      >
        <Scene7_Outro spec={spec} seconds={seconds - scenes.outro.from} />
      </Sequence>

      {/* 进度指示器 - 微妙的呼吸光 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg,
          ${tokens.color.accent.primary} 0%,
          ${tokens.color.accent.primary} ${(frame / (totalDuration * fps)) * 100}%,
          rgba(255,255,255,0.1) ${(frame / (totalDuration * fps)) * 100}%)`,
        opacity: 0.8,
      }} />
    </AbsoluteFill>
  );
}
