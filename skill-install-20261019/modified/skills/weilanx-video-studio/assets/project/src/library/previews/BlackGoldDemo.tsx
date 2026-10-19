import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CellGrid, DotRing, GlowBars, NeonLines, PayoffMatrix, TileSeq} from '../blackgold/charts';
import {Awning, Booth, Silhouettes, TheaterStage} from '../blackgold/props';
import {BGCaption, CenterWord, ChapterTag, CiteLine, FormulaField, Grain, SmokeBg, SparkTitle} from '../blackgold/stage';
import {B, BF, glowText, vis} from '../blackgold/theme';

/**
 * 黑金光影风素材一览（1920×1080，45 秒）：每 150 帧一场，场与场之间暗场交叉淡化。
 * 示例题目是自己编的（排队的困境：为什么大家都越来越早去排队），只用来检查每个组件的样子和动效。
 */
const LEN = 150;
export const BLACKGOLD_DEMO_FRAMES = LEN * 9;

/** 第 i 场：前后各 12 帧和相邻场交叠淡化；children 拿到场内帧号 t */
const Scene: React.FC<{f: number; i: number; tone?: 'warm' | 'red'; children: (t: number) => React.ReactNode}> = ({f, i, tone, children}) => {
  const t = f - i * LEN;
  if (t < -12 || t >= LEN + 12) return null;
  const v = vis(t, -12, LEN + 12, 12, 12);
  return (
    <AbsoluteFill style={{opacity: i === 0 ? Math.min(1, v + (t < 0 ? 1 : 0)) : v}}>
      <SmokeBg f={t} tone={tone} />
      {children(t)}
    </AbsoluteFill>
  );
};

export const BlackGoldDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: B.bg}}>
      {/* 1 标题卡：金粒子聚成大字 + 漂浮公式 */}
      <Scene f={f} i={0}>
        {(t) => (
          <>
            <FormulaField f={t} at={0} items={['λ / μ', 'E[wait]', 't₀', '(早, 早)', '(晚, 晚)', 'N → ∞', 'max min', '先到先得', 'Σ 等待', 'p = ½']} />
            <SparkTitle f={t} at={8} title="排队困境" en="The Queue Dilemma" sub="示例模型" />
          </>
        )}
      </Scene>

      {/* 2 剧场：观众一排排站起来；居中大字 */}
      <Scene f={f} i={1}>
        {(t) => (
          <>
            <TheaterStage x={580} y={300} w={760} h={340} />
            <Silhouettes f={t} rows={3} y0={1160} standAt={[56, 76, 96]} />
            <CenterWord f={t} at={6} text="没人想早到。" size={84} y={150} />
            <CenterWord f={t} at={36} text="可谁也不敢晚来。" size={60} y={250} color={B.red} />
          </>
        )}
      </Scene>

      {/* 3 收益矩阵：箭头依次画出，均衡格亮红、更好的格亮青 */}
      <Scene f={f} i={2}>
        {(t) => (
          <>
            <CiteLine f={t} at={0} line1="示例文献 · 1999 · 示例人物" line2="示例模型 · 排队" />
            <PayoffMatrix
              f={t}
              at={6}
              x={620}
              y={290}
              rows={['你晚到', '你早到']}
              cols={['他晚到', '他早到']}
              cells={[
                [{main: '都不等', sub: '各省 1 小时'}, {main: '你排最后', sub: '他排第一'}],
                [{main: '你排第一', sub: '他排最后'}, {main: '都早到', sub: '各等 2 小时'}],
              ]}
              arrows={[
                {from: [0, 0], to: [1, 0], at: 30},
                {from: [0, 1], to: [1, 1], at: 40},
                {from: [0, 0], to: [0, 1], at: 50},
                {from: [1, 0], to: [1, 1], at: 60},
              ]}
              hi={[
                {cell: [1, 1], color: 'red', at: 76, label: '均衡', note: '谁都不敢先晚'},
                {cell: [0, 0], color: 'cyan', at: 100, label: '更好，却够不着'},
              ]}
            />
            <BGCaption f={t} at={84} text="都早到，就谁都没【占到便宜】。" en="When everyone comes early, nobody gains a thing." />
          </>
        )}
      </Scene>

      {/* 4 审讯室：两间小屋、聚光灯、一亮一暗；右边「算盘」 */}
      <Scene f={f} i={3}>
        {(t) => (
          <>
            <ChapterTag f={t} at={0} cn="心里的算盘" en="the inner math" />
            <Booth f={t} at={6} x={180} y={260} tone="lit" label="你" id="b1" />
            <Booth f={t} at={14} x={580} y={260} tone="dim" lit={0.55} label="他" id="b2" />
            <div style={{position: 'absolute', left: 1080, top: 330, opacity: Math.min(1, Math.max(0, (t - 30) / 12))}}>
              <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 34, ...glowText(B.goldWarm, 10, 0.6)}}>你心里的算盘：</div>
              <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, marginTop: 26, ...glowText(B.ink, 10, 0.5)}}>他晚到 → 我早到，排第一</div>
              <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, marginTop: 18, ...glowText(B.red, 12)}}>他早到 → 我晚到，排最后</div>
            </div>
            <BGCaption f={t} at={60} text="不管他怎么选，早到都更划算。" en="Whatever he does, coming early pays more." />
          </>
        )}
      </Scene>

      {/* 5 发光柱状图：等待时间一年比一年长 */}
      <Scene f={f} i={4}>
        {(t) => (
          <>
            <ChapterTag f={t} at={0} cn="越排越早" en="earlier every year" />
            <GlowBars f={t} at={10} x={510} y={760} w={900} h={440} values={[10, 25, 40, 60, 85, 120]} labels={['第 1 年', '第 2 年', '第 3 年', '第 4 年', '第 5 年', '第 6 年']} hi={5} />
            <div style={{position: 'absolute', left: 1440, top: 300, fontFamily: BF.cn, fontWeight: 900, fontSize: 30, ...glowText(B.red, 10), opacity: Math.min(1, Math.max(0, (t - 60) / 12))}}>名次一点没变</div>
            <BGCaption f={t} at={40} text="大家都提前了，〖名次一点没变〗。" en="Everyone moved earlier. The order never changed." />
          </>
        )}
      </Scene>

      {/* 6 C/D 方块序列 */}
      <Scene f={f} i={5}>
        {(t) => (
          <>
            <ChapterTag f={t} at={0} cn="一次又一次" en="again and again" />
            <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: BF.latin, fontSize: 24, letterSpacing: '0.3em', color: B.inkDim}}>C = 守规矩 · D = 抢先</div>
            <TileSeq
              f={t}
              at={14}
              x={300}
              y={380}
              step={6}
              rows={[
                {label: '对方', seq: 'CCDCCCDCCC'},
                {label: '跟着学', seq: 'CCCDCCCDCC'},
              ]}
              notes={[
                ['先守规矩', 'cyan'],
                ['被抢先，就回敬一次', 'red'],
                ['对方回头，就原谅', 'gold'],
              ]}
            />
            <BGCaption f={t} at={70} text="先守规矩，再看对方——【合作】就这样来了。" en="Cooperate first, then mirror: that's how cooperation begins." />
          </>
        )}
      </Scene>

      {/* 7 细胞网格：合作团块长出来（红烟雾） */}
      <Scene f={f} i={6} tone="red">
        {(t) => (
          <>
            <CellGrid f={t} at={0} cols={60} rows={34} cell={32} period={7} temptation={1.9} coopP={0.75} />
            <CenterWord f={t} at={80} text="合作，从抢先里长了出来" size={80} y={540} />
          </>
        )}
      </Scene>

      {/* 8 光点网络环 + 霓虹折线 */}
      <Scene f={f} i={7}>
        {(t) => (
          <>
            <DotRing f={t} at={0} cx={520} cy={500} r={290} n={14} linkAt={20} hi={0} hiAt={90} hiLabel="跟着学" />
            <NeonLines
              f={t}
              at={10}
              x={1060}
              y={780}
              w={680}
              h={440}
              yLabel="早到的比例"
              xLabel="一轮又一轮"
              dashY={0.5}
              dashLabel="½"
              lines={[
                {pts: Array.from({length: 30}, (_, i) => [i / 29, 0.5 + 0.42 * Math.exp(-i / 6)] as [number, number]), color: B.red, at: 30, dur: 60},
                {pts: Array.from({length: 30}, (_, i) => [i / 29, 0.5 - 0.42 * Math.exp(-i / 6)] as [number, number]), color: B.cyan, at: 40, dur: 60},
              ]}
            />
            <BGCaption f={t} at={60} text="比例，会自己【稳定】下来。" en="The mix settles all by itself." />
          </>
        )}
      </Scene>

      {/* 9 小店价格战 + 结尾大字 */}
      <Scene f={f} i={8}>
        {(t) => {
          const cut = t >= 60;
          return (
            <>
              <Awning f={t} at={6} x={470} y={230} name="你的店" price={cut ? '¥14.9' : '¥29.9'} tone="red" profit={cut ? 0.32 : 0.9} />
              <div style={{position: 'absolute', left: 900, width: 120, top: 420, textAlign: 'center', fontFamily: BF.latin, fontSize: 48, ...glowText(B.goldWarm, 10, 0.5)}}>vs</div>
              <Awning f={t} at={14} x={1090} y={230} name="对面的店" price={cut ? '¥9.9' : '¥29.9'} tone="teal" profit={cut ? 0.22 : 0.9} />
              <BGCaption f={t} at={70} text="客人没多几个，〖利润却没了〗。" en="Hardly any new customers. And the profit is gone." />
            </>
          );
        }}
      </Scene>
      <Grain />
    </AbsoluteFill>
  );
};
