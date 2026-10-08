import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene1_Opening} from './scenes/Scene1_Opening';
import {Scene2_ProfitSignal} from './scenes/Scene2_ProfitSignal';
import {Scene3_WhyNextDoor} from './scenes/Scene3_WhyNextDoor';
import {Scene4_PriceWar} from './scenes/Scene4_PriceWar';
import {Scene5_QualityDifference} from './scenes/Scene5_QualityDifference';
import {Scene6_Conclusion} from './scenes/Scene6_Conclusion';
import {tokens} from './tokens';
import type {HotellingSpec} from './spec';
import '../fonts';

export function HotellingExplainer(spec: HotellingSpec) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  // 场景时长配置（秒）
  const scenes = {
    opening: {from: 0, duration: 5},      // 开场：反常现象
    profit: {from: 5, duration: 8},       // 第一层：利润信号
    location: {from: 13, duration: 8},    // 第二层：为什么挨着开
    price: {from: 21, duration: 10},      // 第三层：价格战机制
    quality: {from: 31, duration: 10},    // 第四层：品质差异
    conclusion: {from: 41, duration: 5},  // 结尾：回收开场
  };

  return (
    <AbsoluteFill className="film" style={{
      background: tokens.color.bg,
      color: tokens.color.text,
      fontFamily: 'var(--font-sans)'
    }}>
      {/* 场景1：开场 - 老板刚立规矩，隔壁就降价 */}
      <Sequence
        from={scenes.opening.from * fps}
        durationInFrames={scenes.opening.duration * fps}
        name="开场"
      >
        <Scene1_Opening spec={spec} seconds={seconds - scenes.opening.from} />
      </Sequence>

      {/* 场景2：利润会暴露机会 */}
      <Sequence
        from={scenes.profit.from * fps}
        durationInFrames={scenes.profit.duration * fps}
        name="利润信号"
      >
        <Scene2_ProfitSignal spec={spec} seconds={seconds - scenes.profit.from} />
      </Sequence>

      {/* 场景3：为什么偏偏开在隔壁 */}
      <Sequence
        from={scenes.location.from * fps}
        durationInFrames={scenes.location.duration * fps}
        name="选址逻辑"
      >
        <Scene3_WhyNextDoor spec={spec} seconds={seconds - scenes.location.from} />
      </Sequence>

      {/* 场景4：价格战如何发生 */}
      <Sequence
        from={scenes.price.from * fps}
        durationInFrames={scenes.price.duration * fps}
        name="价格竞争"
      >
        <Scene4_PriceWar spec={spec} seconds={seconds - scenes.price.from} />
      </Sequence>

      {/* 场景5：品质如何成为竞争力 */}
      <Sequence
        from={scenes.quality.from * fps}
        durationInFrames={scenes.quality.duration * fps}
        name="品质博弈"
      >
        <Scene5_QualityDifference spec={spec} seconds={seconds - scenes.quality.from} />
      </Sequence>

      {/* 场景6：结论 */}
      <Sequence
        from={scenes.conclusion.from * fps}
        durationInFrames={scenes.conclusion.duration * fps}
        name="结论"
      >
        <Scene6_Conclusion spec={spec} seconds={seconds - scenes.conclusion.from} />
      </Sequence>

      {/* 进度条 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 4,
        width: `${(frame / (46 * fps)) * 100}%`,
        background: tokens.color.accent,
        transition: 'width 0.1s linear'
      }} />
    </AbsoluteFill>
  );
}
