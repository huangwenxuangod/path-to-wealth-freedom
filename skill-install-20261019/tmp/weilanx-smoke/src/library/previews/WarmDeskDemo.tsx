import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from '../anim';
import {DeskMascot, PixelEmote} from '../warm-desk/mascot';
import {BigCount, CardFan, CharTimeline, CodeCard, FollowCard, LetterCards, ListCard, OptionCard, Seesaw, SpeedCards, TableCard, ThumbGrid, Waveform} from '../warm-desk/props';
import {ChapterTitle, DCaption, DeskBg, Headline, Leave, Rise, SayBubble, StepBar, Tag} from '../warm-desk/stage';
import {D, DF, slide} from '../warm-desk/theme';

/**
 * 暖纸工作台风素材一览（1920×1080，65 秒）：每 150 帧一场，换场时旧内容倾斜滑走、新内容上浮出现；
 * 吉祥物开场在中间，第 2 场挪到右下角常驻；第 6 场起顶部挂一条紧凑步骤条。
 * 示例题目是自己编的（一杯手冲咖啡分几步），只用来检查每个组件的样子和动效。
 */
const LEN = 150;
const N = 13;
export const WARM_DESK_DEMO_FRAMES = LEN * N;
const STEPS = ['磨豆', '称重', '闷蒸', '注水', '等待', '品尝'];

/** 一场：t 是场内帧；最后 10 帧旧内容倾斜滑走（方向左右交替） */
const Scene: React.FC<{f: number; i: number; children: (t: number) => React.ReactNode}> = ({f, i, children}) => {
  const t = f - i * LEN;
  if (t < 0 || t >= LEN) return null;
  return (
    <Leave f={t} at={LEN - 10} dir={i % 2 ? 1 : -1}>
      {children(t)}
    </Leave>
  );
};

const CAPS = [
  '你现在喝的这杯咖啡',
  '磨豆、称重、闷蒸、注水',
  '全靠一张写好的说明书',
  '今天就把整个过程摊开给你看',
  '这张说明书里写了什么',
  '第一步',
  '粉水比，试了三次',
  '每一秒该做什么，都标好了',
  '四段注水，每段停多久',
  '好喝的咖啡，看这四个字母',
  '计时交给机器，手感留给你',
  '它会把每一杯都记下来',
  '',
];

export const WarmDeskDemo: React.FC = () => {
  const f = useCurrentFrame();
  const scene = Math.min(N - 1, Math.floor(f / LEN));
  const t = f - scene * LEN;
  // 吉祥物：第 1 场在中间偏下，第 2 场开头挪到右下角
  const mx = slide(f, LEN - 4, 960, 1640, 16);
  const my = slide(f, LEN - 4, 780, 990, 16);
  const ms = slide(f, LEN - 4, 1.35, 0.95, 16);
  const eyes = scene === 4 ? 'wide' : scene === 7 ? 'happy' : scene === 12 ? 'star' : 'open';
  const stepActive = scene < 5 ? -1 : Math.min(5, [0, 0, 1, 2, 3, 3, 4, 5][scene - 5] ?? 5);

  return (
    <AbsoluteFill style={{background: D.paper, overflow: 'hidden'}}>
      <DeskBg />

      {/* 1 开场：粗宋标题 + 两侧声波 */}
      <Scene f={f} i={0}>
        {(t) => (
          <>
            <Headline f={t} at={4} text={'你现在喝的\n这杯咖啡'} size={110} y={150} />
            <Rise f={t} at={30} x={560} y={680}>
              <Waveform f={t} />
            </Rise>
            <Rise f={t} at={34} x={1200} y={680}>
              <Waveform f={t} seed={4} />
            </Rise>
          </>
        )}
      </Scene>

      {/* 2 叠放卡片展开 */}
      <Scene f={f} i={1}>
        {(t) => (
          <div style={{position: 'absolute', left: 700, top: 360}}>
            <CardFan spread={clamp01((t - 6) / 24)} labels={['磨豆', '称重', '闷蒸', '注水']} />
          </div>
        )}
      </Scene>

      {/* 3 标题升到上方 + 一排小标签 */}
      <Scene f={f} i={2}>
        {(t) => (
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: slide(t, 40, 380, 140, 14)}}>
              <Headline f={t} at={4} text="全靠〔一张说明书〕" size={110} y={0} hiAt={26} />
            </div>
            <Rise f={t} at={60} x={0} y={330} style={{width: 1920, display: 'flex', justifyContent: 'center', gap: 16}}>
              {['磨豆 ✓', '称重 ✓', '闷蒸 ✓', '注水 ✓'].map((s) => (
                <Tag key={s} text={s} size={26} />
              ))}
            </Rise>
          </>
        )}
      </Scene>

      {/* 4 步骤条（大卡片版） */}
      <Scene f={f} i={3}>{(t) => <StepBar f={t} at={6} steps={STEPS} active={-1} y={260} />}</Scene>

      {/* 5 清单卡 + 标签 */}
      <Scene f={f} i={4}>
        {(t) => (
          <>
            <Rise f={t} at={4} x={440} y={150}>
              <ListCard
                f={t}
                at={12}
                title="COFFEE.md"
                sub="一杯手冲 · 一份说明书"
                rows={['用什么豆子', '水温多少度', '分几步冲', '每一步做到什么程度']}
                hi={t > 70 ? 1 : undefined}
                w={900}
                right={(i) =>
                  i === 1 ? (
                    <span style={{display: 'flex', gap: 6}}>
                      {[D.orange, D.ink, '#a8c49a'].map((c) => (
                        <span key={c} style={{width: 22, height: 22, background: c}} />
                      ))}
                    </span>
                  ) : null
                }
              />
            </Rise>
            <Rise f={t} at={50} x={1200} y={120}>
              <Tag text="说明书 · Skill" size={30} />
            </Rise>
          </>
        )}
      </Scene>

      {/* 6 章节大标题 + 头像气泡 */}
      <Scene f={f} i={5}>
        {(t) => (
          <>
            <ChapterTitle f={t} at={8} n={1} title="磨豆" />
            <Rise f={t} at={60} x={760} y={680}>
              <SayBubble text="磨细一点。" />
            </Rise>
          </>
        )}
      </Scene>

      {/* 7 选项卡 + 语速卡（这里当粉水比卡） */}
      <Scene f={f} i={6}>
        {(t) => (
          <>
            {t < 60 ? (
              <Rise f={t} at={4} x={680} y={250}>
                <OptionCard f={t} at={4} question="粉磨好了，可以称重吗？" options={['可以', '再细一点', '我自己来']} pick={0} pickAt={36} />
              </Rise>
            ) : (
              <div style={{position: 'absolute', left: 600, top: 380}}>
                <SpeedCards
                  f={t}
                  at={62}
                  items={[
                    ['1:15', '太浓', 22],
                    ['1:17', '太淡', 10],
                    ['1:16', '刚好', 16],
                  ]}
                  pick={2}
                  pickAt={112}
                />
              </div>
            )}
          </>
        )}
      </Scene>

      {/* 8 逐字时间轴 */}
      <Scene f={f} i={7}>
        {(t) => (
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
            <CharTimeline f={t} at={8} text="闷蒸三十秒再注水" step={3.75} hi={2} hiNote="这一步最关键" per={4} />
          </div>
        )}
      </Scene>

      {/* 9 表格卡 */}
      <Scene f={f} i={8}>
        {(t) => (
          <Rise f={t} at={4} x={430} y={250}>
            <TableCard
              f={t}
              at={10}
              head={['段落', '这一段在做什么', '水量', '停多久']}
              rows={[
                ['1', '闷蒸，让粉吸饱水', '30 ml', ''],
                ['2', '画圈注水到一半', '120 ml', ''],
                ['3', '补到总量', '240 ml', ''],
              ]}
              widths={[100, 420, 220, 220]}
              hiCol={3}
              hiColAt={70}
              tag={(r) => ['30 秒', '20 秒', '等滴完'][r]}
            />
          </Rise>
        )}
      </Scene>

      {/* 10 字母卡 */}
      <Scene f={f} i={9}>
        {(t) => (
          <div style={{position: 'absolute', left: 290, top: 170}}>
            <LetterCards
              f={t}
              at={10}
              gap={22}
              doneAt={110}
              items={[
                ['F', '香气', '闻着就香'],
                ['A', '酸度', '明亮不刺'],
                ['B', '醇厚', '口感厚实'],
                ['S', '甜感', '喝完回甘'],
              ]}
            />
          </div>
        )}
      </Scene>

      {/* 11 代码卡 + 跷跷板 */}
      <Scene f={f} i={10}>
        {(t) => (
          <>
            {t < 70 ? (
              <Rise f={t} at={4} x={420} y={240}>
                <CodeCard f={t} at={10} title="brew.js" lines={['timer.start(0)', 'pour.bloom(30, "ml")', 'wait.seconds(30)', 'pour.circle(120, "ml")', 'pour.fill(240, "ml")']} />
              </Rise>
            ) : (
              <div style={{position: 'absolute', left: 510, top: 330}}>
                <Seesaw
                  tilt={-0.6 + 1.2 * clamp01((t - 90) / 20)}
                  left={<SayBubble text="手感" size={28} />}
                  right={
                    <span style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end'}}>
                      {['计时', '称重', '记录'].map((s) => (
                        <Tag key={s} text={s} solid={false} />
                      ))}
                    </span>
                  }
                />
              </div>
            )}
          </>
        )}
      </Scene>

      {/* 12 缩略图墙 + 大号计数 */}
      <Scene f={f} i={11}>
        {(t) => (
          <>
            <Rise f={t} at={4} x={360} y={220}>
              <ThumbGrid f={t} at={10} hi={4} w={760} />
            </Rise>
            <Rise f={t} at={60} x={1300} y={330}>
              <BigCount f={t} at={60} value={6} unit="杯" />
            </Rise>
          </>
        )}
      </Scene>

      {/* 13 结尾：大标题 + 关注卡 */}
      <Scene f={f} i={12}>
        {(t) => (
          <>
            <Headline f={t} at={4} text={'好咖啡，是一份\n能重复的〔说明书〕'} size={124} y={180} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 590}}>
              <FollowCard f={t} at={60} name="CC" line="带你把手艺写成说明书" avatar={<span style={{fontFamily: DF.mono, fontWeight: 700, color: D.orangeDeep}}>CC</span>} />
            </div>
          </>
        )}
      </Scene>

      {/* 常驻：紧凑步骤条（第 6 场起） */}
      {scene >= 5 && scene < 12 && <StepBar f={f} at={5 * LEN} steps={STEPS} active={stepActive} compact />}

      {/* 常驻：吉祥物 + 像素小反应 */}
      <DeskMascot f={f} x={mx} y={my} s={ms} eyes={eyes} hop={scene === 4 ? 4 * LEN + 50 : scene === 12 ? 12 * LEN + 60 : undefined} />
      <PixelEmote f={f} at={2 * LEN + 30} kind="!" x={1700} y={700} px={9} />
      <PixelEmote f={f} at={4 * LEN + 50} kind="?" x={1700} y={700} px={9} />
      <PixelEmote f={f} at={7 * LEN + 40} kind="note" x={1700} y={700} px={9} color={D.orange} />
      <PixelEmote f={f} at={10 * LEN + 20} kind="dots" x={1690} y={720} px={9} />

      <DCaption f={t} at={2} text={CAPS[scene]} />
    </AbsoluteFill>
  );
};
