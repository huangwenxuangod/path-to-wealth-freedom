import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from '../anim';
import {CityGrid, GlowRoute, ReliefMap, WardPlan, Waypoint, wiggle} from '../lamplight/charts';
import {BeaconRow, DayNightDial, Drum, Flame, Figure, Gate, GroundRing, Moon, NameTag, SayBubble, Scroll, TallyCard, Watchtower} from '../lamplight/props';
import {Cam, Disclaimer, Dissolve, DynastyAxis, Fade, Glint, Narration, NightBg, PointTransit, SourceNote, StatCorner} from '../lamplight/stage';
import {L, LF, push, textShadow} from '../lamplight/theme';

/**
 * 灯火史话风素材一览（1920×1080，45 秒）：每 150 帧一场，场与场之间暗场溶解，第 6→7 场用穿光转场，结尾扎进火里。
 * 示例题目是自己编的（古代驿站连夜送信），书名、人物、规则都是占位，只用来检查每个组件的样子和动效。
 */
const LEN = 150;
export const LAMPLIGHT_DEMO_FRAMES = LEN * 9;

/** 第 i 场：前后各 8 帧和相邻场交叠溶解；children 拿到场内帧号 t */
const Scene: React.FC<{f: number; i: number; noFade?: boolean; children: (t: number) => React.ReactNode}> = ({f, i, noFade, children}) => {
  const t = f - i * LEN;
  if (t < -8 || t >= LEN + 8) return null;
  return (
    <Dissolve f={t} at={i === 0 ? -99 : -8} out={i === 8 || noFade ? undefined : LEN - 8}>
      {children(t)}
    </Dissolve>
  );
};

const ROUTE = wiggle(
  [
    [700, 540],
    [800, 740],
    [1040, 860],
    [1360, 880],
    [1620, 960],
  ],
  3,
  26,
);

export const LamplightDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 1 夜鼓：鼓声计数、举火把的人、城门 */}
      <Scene f={f} i={0}>
        {(t) => (
          <Cam s={push(t, 0, LEN, 0.03)} origin={[960, 760]}>
            <NightBg f={t} floor glow={[52, 74]} />
            <Gate f={t} x={1120} y={940} w={320} h={470} label="城门" />
            <Drum f={t} x={520} y={940} r={130} hits={[24, 46, 68, 90, 112]} />
            <Figure f={t} x={760} y={940} pose="raise" scale={1.35} />
            <Figure f={t} x={1460} y={940} pose="torch" flip seed={2} scale={1.35} />
            <Narration f={t} lines={[{at: 6, text: '天一黑，'}, {at: 26, text: '城里的〔鼓〕一声声敲起来。'}]} />
            <StatCorner f={t} at={22} label="鼓声" value={300} unit="下" dur={100} />
            <Disclaimer f={t} />
          </Cam>
        )}
      </Scene>

      {/* 2 驿卒：名签 + 星光、地面光圈、气泡 */}
      <Scene f={f} i={1}>
        {(t) => (
          <Cam s={push(t, 0, LEN, 0.025)} origin={[900, 800]}>
            <NightBg f={t} floor glow={[45, 72]} />
            <GroundRing f={t} at={34} x={830} y={946} rx={200} ry={36} color="rgba(237,174,80,0.7)" />
            <Figure f={t} x={830} y={940} pose="torch" seed={4} scale={1.35} />
            <Figure f={t} x={1300} y={940} pose="point" flip scale={1.35} />
            <NameTag f={t} at={40} x={430} y={400} small="示例人物 · 驿卒" name="小李" w={300} />
            <Glint f={t} at={46} x={720} y={410} />
            <SayBubble f={t} at={86} x={1360} y={470} text="今夜必须送到" />
            <Narration f={t} lines={[{at: 4, text: '驿站里，'}, {at: 20, text: '一个【驿卒】接过文书，'}, {at: 50, text: '〖连夜出发〗。', size: 92}]} />
            <Disclaimer f={t} />
          </Cam>
        )}
      </Scene>

      {/* 3 律文纸卷：竖排、朱红题签、方印、出处 */}
      <Scene f={f} i={2}>
        {(t) => (
          <>
            <NightBg f={t} sky={false} glow={[50, 68]} strength={0.8} />
            <Narration f={t} lines={[{at: 4, text: '【示例文献】里有一条：'}, {at: 26, text: '“〖误一日，罚八十〗。”', size: 80}]} />
            <Scroll
              f={t}
              at={30}
              y={730}
              h={380}
              cols={[{text: '驿递', box: true}, {text: '凡递文书'}, {text: '日行三百里'}, {text: '误一日罚八十', color: L.seal, size: 50}]}
              seal="示例"
              cite="《示例文献》卷三 · 驿递（条文为虚构示例）"
            />
          </>
        )}
      </Scene>

      {/* 4 万家灯火：透视城市方格逐格亮灯，再逐格熄灭 */}
      <Scene f={f} i={3}>
        {(t) => (
          <Cam s={push(t, 0, LEN, 0.04)} origin={[1070, 700]}>
            <NightBg f={t} glow={[56, 70]} horizon={420} />
            <Moon f={t} x={1660} y={190} r={40} phase="full" />
            <CityGrid
              f={t}
              lightAt={8}
              lightSpread={50}
              darkAt={96}
              darkSpread={40}
              core={{c0: 4, c1: 7, r0: 0, r1: 2, label: '官署'}}
              labels={[
                {c: 2, r: 5, text: '粮仓'},
                {c: 9, r: 6, text: '驿站'},
              ]}
              hot={[{c: 9, r: 7}]}
            />
            <Narration f={t} lines={[{at: 4, text: '可到了深夜，'}, {at: 22, text: '满城的〔灯火〕，'}, {at: 76, text: '一盏盏〖熄掉〗。'}]} />
            <SourceNote f={t} at={20} text="城的格局为示意" />
          </Cam>
        )}
      </Scene>

      {/* 5 俯视院落：禁区斜纹 + 四面「禁」、院内走动的人；朝代轴滑动 */}
      <Scene f={f} i={4}>
        {(t) => (
          <>
            <NightBg f={t} sky={false} glow={[64, 55]} />
            <WardPlan f={t} x={1260} y={540} size={340} ban={clamp01((t - 30) / 16)} walkers={8} />
            <Narration f={t} lines={[{at: 4, text: '禁的是外面的【大路】，'}, {at: 34, text: '院墙里面，'}, {at: 54, text: '〔照样能走〕。'}]} />
            <DynastyAxis f={t} at={10} items={['秦', '汉', '唐', '明']} active={2} prev={1} moveAt={70} year="示例年份" />
          </>
        )}
      </Scene>

      {/* 6 烽燧一排：一支支点燃、编号变金、最后一个变红，右上数字同步；结尾缩向第一团火 */}
      <Scene f={f} i={5} noFade>
        {(t) => (
          <PointTransit f={t} at={LEN - 18} x={760} y={540} mode="out">
            <NightBg f={t} glow={[62, 80]} horizon={600} />
            <Watchtower f={t} x={290} y={860} scale={0.82} label="烽台" />
            <BeaconRow f={t} x0={760} x1={1660} y={820} litAt={[16, 40, 64, 88]} labels={['一', '二', '三', '四']} hotLast scale={0.95} />
            <Narration f={t} lines={[{at: 4, text: '消息越急，'}, {at: 22, text: '点的火就〔越多〕：'}, {at: 50, text: '〖四堆〗是最急的。'}]} />
            <StatCorner f={t} at={88} label="军情" value={4} unit="级" dur={18} color={L.red} sub="最急" />
            <SourceNote f={t} at={16} text="火的数量规则为虚构示例" out={LEN - 30} />
          </PointTransit>
        )}
      </Scene>

      {/* 7 地形图：从火光点拉出、发光路径画到京城、昼夜盘 */}
      <Scene f={f} i={6}>
        {(t) => {
          const cx = 900 + 160 * clamp01(t / LEN);
          const cs = 1 + 0.06 * clamp01(t / LEN);
          return (
            <PointTransit f={t} at={-8} x={760} y={540} mode="from" dur={20}>
              <ReliefMap camX={cx} camY={540 + 40 * clamp01(t / LEN)} camS={cs} seed={11} borders={['M300 300 C700 200 1200 380 1500 300 S2100 500 2300 420', 'M1900 200 C1800 600 2050 900 1980 1400']}>
                <GlowRoute f={t} at={12} dur={92} pts={ROUTE} fire width={2600} height={1600} />
                <Waypoint f={t} at={0} x={700} y={540} kind="fire" label="边城" side="left" />
                <Waypoint f={t} at={56} x={1040} y={860} kind="dot" label="中途驿" side="bottom" size={36} color={L.ink} />
                <Waypoint f={t} at={100} x={1620} y={960} kind="city" label="京城" side="top" />
              </ReliefMap>
              <Narration f={t} lines={[{at: 6, text: '从边城到京城，'}, {at: 28, text: '一路【驿站】接力，'}, {at: 60, text: '一天能跑〔三百里〕。'}]} />
              <DayNightDial f={t} at={20} x={1660} y={230} p={clamp01((t - 20) / 110)} caption="一昼夜" />
              <Fade f={t} at={108}>
                <div style={{position: 'absolute', left: 1500, top: 470, fontFamily: LF.serif, fontWeight: 900, fontSize: 150, color: L.red, textShadow}}>3 倍</div>
              </Fade>
              <Glint f={t} at={114} x={1780} y={500} size={40} />
            </PointTransit>
          );
        }}
      </Scene>

      {/* 8 人数卡：四张卡、小人一排排亮起 */}
      <Scene f={f} i={7}>
        {(t) => (
          <>
            <NightBg f={t} floor glow={[50, 70]} />
            <Narration f={t} lines={[{at: 4, text: '一座驿站要养多少人？'}, {at: 30, text: '【示例文献】记着：'}]} />
            {[
              ['大驿', '60 人', 60],
              ['小驿', '20 人', 20],
              ['岗哨', '8 人', 8],
              ['急递', '2 人', 2],
            ].map(([label, value, n], i) => (
              <TallyCard key={i} f={t} at={44 + i * 14} x={300 + i * 340} y={500} w={310} label={label as string} value={value as string} count={n as number} color={i === 3 ? L.gold : L.ink} />
            ))}
            <SourceNote f={t} at={40} text="《示例文献》· 驿制（数字为虚构示例）" />
          </>
        )}
      </Scene>

      {/* 9 片尾：一团大火 + 居中问句，最后镜头扎进火里 */}
      <Scene f={f} i={8}>
        {(t) => (
          <PointTransit f={t} at={LEN - 26} x={960} y={600} mode="in" dur={24}>
            <NightBg f={t} glow={[50, 60]} strength={1.3} />
            <Moon f={t} x={1600} y={170} r={34} />
            <Flame f={t} x={960} y={760} size={2.2} seed={9} />
            <Narration f={t} align="center" y={150} size={76} lines={[{at: 10, text: '一把火，'}, {at: 30, text: '〔跑赢了快马〕。'}]} />
          </PointTransit>
        )}
      </Scene>
    </AbsoluteFill>
  );
};
