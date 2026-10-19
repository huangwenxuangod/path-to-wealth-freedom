import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../anim';
import {BellCurve, Gauge, LoopRing, MsBars, NeonLine, RankGem, ScatterAvg, Spread, TradeoffCurve} from '../tactical/charts';
import {Crosshair, HitMark, Range, TopMap, Tracer, ViewGun} from '../tactical/range';
import {AnswerReveal, BigWord, Bubble, DeathScreen, HookBanner, HudFrame, SlowMo, SplitPanel, Strike, TacBg, TCaption, TitleCard} from '../tactical/stage';
import {T, TF} from '../tactical/theme';

/**
 * 战术屏科普风素材一览（1920×1080，55 秒）：每 150 帧一场，场与场之间硬切。
 * 示例题目是自己编的（脚步声为什么听不出前后），只用来检查每个组件的样子和动效。
 */
const LEN = 150;
const SCENES = 11;
export const TACTICAL_DEMO_FRAMES = LEN * SCENES;
const CHAPTERS = ['开场', '原理', '模拟', '概率', '循环', '怎么办', '结尾'];
/** 每场属于第几章（0 起） */
const CH_OF = [0, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6];
const TICKS = [2, 4, 5, 7, 8, 10].map((s) => s / SCENES);

const Scene: React.FC<{f: number; i: number; children: (t: number) => React.ReactNode}> = ({f, i, children}) => {
  const t = f - i * LEN;
  if (t < 0 || t >= LEN) return null;
  return <AbsoluteFill>{children(t)}</AbsoluteFill>;
};

const BOXES = [
  {x: -3.2, z: 8, crate: true},
  {x: 2.6, z: 12, w: 1.6, h: 1.6, crate: true},
  {x: -6.5, z: 5, w: 2.4, h: 1.1},
  {x: 5.5, z: 6.5, w: 1.4, h: 2.2},
];

export const TacticalDemo: React.FC = () => {
  const f = useCurrentFrame();
  const scene = Math.min(SCENES - 1, Math.floor(f / LEN));
  const ch = CH_OF[scene];
  const showHud = scene !== 1;
  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      {/* 1 开场：射击场里重演挫败——听到脚步，转身慢了，红屏裂纹 */}
      <Scene f={f} i={0}>
        {(t) => {
          const turn = easeInOut(clamp01((t - 46) / 20));
          return (
            <>
              <Range cam={{x: 0, z: 0, yaw: -0.05 + turn * 0.5}} boxes={BOXES} dummies={[{x: 6, z: 9}]} pillar={2.2} />
              <Crosshair />
              <ViewGun sway={Math.sin(t / 20)} kick={0} />
              <Bubble f={t} at={14} text="脚步……在哪？" x={620} y={300} out={60} />
              <DeathScreen f={t} at={70} cx={980} cy={470} />
              <TCaption f={t} at={8} text="明明听到了脚步，" out={66} />
              <TCaption f={t} at={80} text="转身那一刻，〖你已经倒下了〗" />
            </>
          );
        }}
      </Scene>

      {/* 2 标题卡 */}
      <Scene f={f} i={1}>
        {(t) => (
          <>
            <TacBg />
            <TitleCard f={t} at={4} label="FPS 声学课 · EP.01" title="脚步声在哪儿？" tag="听声辨位" />
          </>
        )}
      </Scene>

      {/* 3 以前 vs 现在：同一个射击场，暖橙 / 冷青分屏 + 慢放 + 疑问胶囊 */}
      <Scene f={f} i={2}>
        {(t) => (
          <>
            <TacBg />
            <SplitPanel x={110} y={170} w={830} h={560} color={T.orange} title="刚玩的时候" sub="凭感觉转">
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <Range cam={{x: 0, z: 0, yaw: 0.1}} tone="warm" boxes={BOXES} dummies={[{x: 1.5, z: 14}]} />
                <Crosshair color="#ffd9a8" />
              </div>
            </SplitPanel>
            <SplitPanel x={980} y={170} w={830} h={560} color={T.cyan} title="现在" sub="越想越乱" active={0.6 + 0.4 * Math.sin(t / 10)}>
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <Range cam={{x: 0, z: 0, yaw: 0.1 + Math.sin(t / 9) * 0.05}} boxes={BOXES} dummies={[{x: 1.5, z: 14}]} />
                <Crosshair />
              </div>
              <Bubble f={t} at={30} text="左边？" x={120} y={160} size={30} />
              <Bubble f={t} at={42} text="后面？" x={480} y={250} size={30} color={T.red} />
            </SplitPanel>
            <SlowMo f={t} x={110} y={760} />
            <TCaption f={t} at={10} text="同一个声音，【以前】一转就对，【现在】越想越乱" />
          </>
        )}
      </Scene>

      {/* 4 俯视图：前后对称的两个声源到两耳的距离一样 */}
      <Scene f={f} i={3}>
        {(t) => {
          const o = clamp01((t - 20) / 14);
          return (
            <>
              <TacBg />
              <AbsoluteFill style={{opacity: clamp01(t / 10)}}>
                <TopMap
                  blocks={[
                    [560, 300, 120, 120],
                    [1260, 560, 160, 90],
                  ]}
                  units={[
                    {x: 960, y: 470, color: T.cyan, label: '你', dir: -Math.PI / 2, fov: 1.6, reach: 360},
                    {x: 760, y: 270, color: T.orange, label: '前方声源'},
                    {x: 760, y: 670, color: T.red, label: '后方声源'},
                  ]}
                  sight={
                    o > 0
                      ? [
                          [760, 270, 940, 470, `rgba(240,160,69,${o})`],
                          [760, 270, 980, 470, `rgba(240,160,69,${o * 0.6})`],
                          [760, 670, 940, 470, `rgba(229,80,91,${o})`],
                          [760, 670, 980, 470, `rgba(229,80,91,${o * 0.6})`],
                        ]
                      : []
                  }
                />
              </AbsoluteFill>
              <TCaption f={t} at={36} text="前后对称的两个位置，到两只耳朵的〔时间差一模一样〕" />
            </>
          );
        }}
      </Scene>

      {/* 5 毫秒条（两耳时间差，约数）+ 表盘 */}
      <Scene f={f} i={4}>
        {(t) => (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 240, top: 300}}>
              <MsBars
                f={t}
                at={8}
                max={0.8}
                digits={2}
                rows={[
                  ['正侧面', 0.66, T.cyan],
                  ['前方 45°', 0.38, T.orange],
                  ['后方 45°', 0.38, T.red],
                ]}
              />
            </div>
            <div style={{position: 'absolute', left: 1440, top: 330, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
              <Gauge value={clamp01((t - 10) / 60) * 0.3} label="辨位信心" />
            </div>
            <TCaption f={t} at={20} text="两耳时间差最多不到 1 毫秒，前后还〖一模一样〗" />
          </>
        )}
      </Scene>

      {/* 6 钟形曲线 + 抽样点 */}
      <Scene f={f} i={5}>
        {(t) => (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 410, top: 200}}>
              <BellCurve
                f={t}
                at={6}
                labels={['猜反', '大概', '准']}
                samples={[
                  [0.3, 60],
                  [-1.4, 76],
                  [1.2, 92],
                ]}
              />
            </div>
            <TCaption f={t} at={16} text="每次判断，都是从曲线上【抽一个点】" />
          </>
        )}
      </Scene>

      {/* 7 散布 + 速度准确率 */}
      <Scene f={f} i={6}>
        {(t) => (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 60, top: 150, transform: 'scale(1.35)', transformOrigin: '0 0'}}>
              <Spread f={t} at={6} n={50} sigma={30} per={1.4} label="转对方向" />
            </div>
            <div style={{position: 'absolute', left: 900, top: 270}}>
              <TradeoffCurve
                f={t}
                at={40}
                w={860}
                h={400}
                mark={0.6}
                curves={[
                  {label: '你', color: T.cyan, shift: 0},
                  {label: '高手', color: T.orange, shift: 0.2},
                ]}
              />
            </div>
            <TCaption f={t} at={30} text="转得越急，〖越容易转反〗；高手不是更快，是【更稳】" />
          </>
        )}
      </Scene>

      {/* 8 循环环 */}
      <Scene f={f} i={7}>
        {(t) => (
          <>
            <TacBg tone={t > 90 ? 'red' : 'blue'} />
            <div style={{position: 'absolute', left: 960 - 370, top: 470 - 370}}>
              <LoopRing f={t} at={6} nodes={['听不清', '乱转身', '暴露位置', '被击杀']} count={t > 90 ? 4 : t > 60 ? 2 : 1} color={t > 90 ? T.red : T.cyan} hot={t > 90 ? 1 : undefined} speed={t > 90 ? 1.2 : 0.5} />
            </div>
            <TCaption f={t} at={30} text="越听不清越乱转，越乱转〖越容易死〗" />
          </>
        )}
      </Scene>

      {/* 9 划掉重写 + 揭晓答案 */}
      <Scene f={f} i={8}>
        {(t) => (
          <>
            <TacBg />
            {t < 70 && <Strike f={t} at={6} text="不是耳朵不好" strikeAt={34} then="，是声音【太对称】" />}
            <AnswerReveal f={t} at={70} label="办法" text="先转头再听" />
          </>
        )}
      </Scene>

      {/* 10 数据：段位 + 折线 + 散点平均 */}
      <Scene f={f} i={9}>
        {(t) => (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 200, top: 210}}>
              <NeonLine f={t} at={6} data={[1.1, 0.9, 1.3, 1.0, 1.2, 0.8, 1.1, 0.7, 0.6]} w={700} h={300} redFrom={6} yLabel="K/D" xLabel="最近 9 局 →" tag="乱转" />
            </div>
            <div style={{position: 'absolute', left: 1080, top: 230}}>
              <ScatterAvg
                f={t}
                at={20}
                avgAt={70}
                w={640}
                h={300}
                min={0.4}
                max={1.6}
                groups={[
                  {label: '之前', values: [1.1, 0.9, 1.3, 1.0, 1.2, 0.8, 1.1, 0.9]},
                  {label: '先转头再听', values: [1.2, 1.3, 1.1, 1.4, 1.2, 1.0, 1.3, 1.25]},
                ]}
              />
            </div>
            <div style={{position: 'absolute', left: 860, top: 600, opacity: clamp01((t - 90) / 12)}}>
              <RankGem size={150} f={t} />
            </div>
            <TCaption f={t} at={24} text="单局只是一个点，要看【一段时间的平均】" />
          </>
        )}
      </Scene>

      {/* 11 结尾：回到射击场，命中 + 情绪翻转 */}
      <Scene f={f} i={10}>
        {(t) => {
          const turn = easeInOut(clamp01((t - 10) / 18));
          return (
            <>
              <Range cam={{x: 0, z: 0, yaw: -0.05 + turn * 0.18}} tone="warm" boxes={BOXES} dummies={[{x: 6, z: 9, state: t > 40 ? 'dead' : t > 34 ? 'hit' : 'idle'}]} pillar={2.2} />
              <Crosshair color="#ffd9a8" />
              <Tracer to={[1050, 470]} t={t - 32} />
              <ViewGun kick={clamp01(1 - Math.abs(t - 33) / 5)} tone="warm" />
              <HitMark f={t} at={33} x={1050} y={470} text="HEADSHOT" />
              {t > 60 && <BigWord f={t} at={62} text={'你的耳朵没坏，\n只是少转了〔一下头〕'} size={88} y={380} />}
            </>
          );
        }}
      </Scene>

      {showHud && <HudFrame series="FPS 声学课" ep="EP.01" topic="听声辨位" chapter={[ch, CHAPTERS.length - 1, CHAPTERS[ch]]} progress={f / TACTICAL_DEMO_FRAMES} ticks={TICKS} hp={scene === 0 ? (f % LEN > 70 ? 0 : 100) : scene === 10 || scene === 2 ? 100 : undefined} ammo={scene === 0 || scene === 10 ? [scene === 10 && f % LEN > 33 ? 24 : 25, 75] : undefined} />}
      {scene === 0 && <HookBanner f={f % LEN} text="你明明躲进了掩体，〖为什么还被打死〗？" out={LEN - 12} />}
    </AbsoluteFill>
  );
};
