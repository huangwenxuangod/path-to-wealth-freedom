import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, rand} from '../../library/anim';
import {MsBars, NeonLine} from '../../library/tactical/charts';
import {AimGrid, TimeBlocks} from '../../library/tactical/practice';
import {AnswerReveal, BigWord, ChapterCard, HookBanner, HudFrame, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {OutroRange, PaintRow, PairBars, PerfLearn} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  CEPEDA_ARTICLES,
  CEPEDA_ASSESSMENTS,
  CEPEDA_EXPERIMENTS,
  chapterAt,
  CHAPTERS,
  CUES,
  cueEnd,
  cueStart,
  CURVE,
  DARK_FROM,
  DARK_FROM2,
  DAY1_SCORE,
  DAY30_SCORE,
  DURATION,
  EP,
  FATIGUE,
  fb,
  fbt,
  FLIP_LINE,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  MOULTON_N,
  OUT_KILL,
  OUT_RANGE,
  QUESTION_LINE,
  SCORE,
  SERIES,
  SFX,
  SHOTS,
  TERM2,
  TITLE,
  TOPIC,
  WALKER_GAIN,
} from './timeline';

/**
 * ep51 天天练枪，怎么还不涨？（战术屏科普风，无口播）
 * 镜头全部硬切、卡在拍子上；重拍之后每个小节的第一拍画面轻轻一顶（回落段减半），音效对准重拍。
 * 开场前 17 秒顶部挂 HookBanner；片尾停在评论区问题。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

/** 小节冲击：每个小节第一拍放大 1.2%，7 帧回落；重拍前不顶，回落段（40–47 小节）减半；两个爆点 4%、10 帧 */
const punch = (f: number) => {
  if (f < HIT) return 0;
  const k = Math.floor((f / FPS - (17.45 - 8 * BAR)) / BAR);
  const t = f - fb(k);
  if (f >= HIT && f < HIT + 10) return 0.04 * (1 - (f - HIT) / 10);
  if (f >= HIT2 && f < HIT2 + 10) return 0.04 * (1 - (f - HIT2) / 10);
  const amp = k >= 40 && k < 48 ? 0.006 : 0.012;
  return t >= 0 && t < 7 ? amp * (1 - t / 7) : 0;
};

const label = (text: string, top: number, color: string = T.gray, opacity = 1) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color, opacity}}>{text}</div>
);
const head = (text: string, x: number, top: number, color: string, opacity = 1, size = 40) => (
  <div style={{position: 'absolute', left: x - 500, width: 1000, top, textAlign: 'center', fontFamily: TF.sans, fontSize: size, color, opacity}}>{text}</div>
);
const at = (x: number, y: number, children: React.ReactNode) => <div style={{position: 'absolute', left: x, top: y}}>{children}</div>;

/** 示意数据 */
const DAYS30 = Array.from({length: 30}, (_, i) => DAY1_SCORE + (rand(500 + i) - 0.5) * 260 + (i === 29 ? DAY30_SCORE - DAY1_SCORE : 0));
const SESSION = Array.from({length: 24}, (_, i) => 70 + Math.min(i, 10) * 1.6 - Math.max(0, i - 14) * 2.6 + (rand(700 + i) - 0.5) * 4);
const WEEKS_UP = [62, 63, 66, 68, 71, 73, 76, 79];
const T60 = Array.from({length: 60}, (_, i) => i / 59);
/** 左图：学到了、表现没变；右图：表现涨了、没学进去（示意） */
const PERF_FLAT = T60.map((u) => 0.35 + Math.sin(u * 30) * 0.02);
const LEARN_UP = T60.map((u) => 0.2 + 0.6 * u);
const PERF_UP = T60.map((u) => (u < 0.6 ? 0.2 + 1.1 * u : 0.86 - (u - 0.6) * 1.6));
const LEARN_FLAT = T60.map((u) => 0.22 + 0.08 * u);

export const Ep51Practice: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const s = 1 + punch(f);
  const buildP = clamp01((ff - SHOTS.build[0]) / 40);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep51-practice/bgm.wav')} />
      {SFX.map(([file, t, vol], i) => (
        <Sequence key={i} from={Math.max(0, t)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <TacBg />
            <AimGrid f={f} at={fbt(1.6)} per={8} count0={2860} y={300} h={460} />
            {label('第 30 天 · 已练 01:58:40 · 原创靶场示意', 240, T.gray)}
          </>
        )}
        {inShot(f, SHOTS.score) && (
          <>
            <TacBg tone="red" />
            <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: clamp01((f - SCORE) / 4)}}>
              <div style={{fontFamily: TF.sans, fontSize: 40, color: T.gray}}>今天的得分</div>
              <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 180, color: T.white, filter: glowF(T.white, 8)}}>{DAY30_SCORE.toLocaleString('en-US')}</div>
              <div style={{fontFamily: TF.sans, fontSize: 40, color: T.red}}>第 1 天：{DAY1_SCORE.toLocaleString('en-US')} · 示意</div>
            </div>
          </>
        )}
        {inShot(f, SHOTS.curve) && (
          <>
            <TacBg />
            {label('30 天的靶场得分 · 示意', 230, T.dim)}
            {at(410, 330, <NeonLine f={f} at={CURVE} data={DAYS30} w={1100} h={400} min={6000} max={10000} yLabel="得分" xLabel="第 1 → 30 天" dur={30} tag="平线" />)}
          </>
        )}
        {inShot(f, SHOTS.fatigue) && (
          <>
            <TacBg />
            {label('一次练两小时，每 5 分钟的得分 · 示意', 230, T.dim)}
            {at(410, 330, <NeonLine f={f} at={FATIGUE} data={SESSION} w={1100} h={400} redFrom={15} yLabel="得分" xLabel="0 → 2 小时" dur={50} />)}
          </>
        )}
        {inShot(f, SHOTS.question) && (
          <>
            <TacBg />
            <BigWord f={ff} at={SHOTS.question[0]} text={QUESTION_LINE} size={108} y={450} />
          </>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <TacBg />
            <TitleCard f={f} at={HIT - 8} label={`${SERIES} · ${EP}`} title={TITLE} tag={TOPIC} per={1} />
            <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(220,240,250,0.85), rgba(66,198,223,0.25) 45%, rgba(0,0,0,0) 75%)', opacity: 1 - clamp01((f - HIT) / 10), pointerEvents: 'none'}} />
          </>
        )}

        {/* ---------- 看不见 ---------- */}
        {inShot(f, SHOTS.gap) && (
          <>
            <TacBg />
            {f < fbt(48) ? (
              <>
                {head('练的时候的成绩', 600, 420, T.orange, clamp01((f - fbt(40)) / 6), 52)}
                {head('≠', 960, 410, T.white, clamp01((f - fbt(40) - 6) / 6), 80)}
                {head('你学到的', 1320, 420, T.cyan, clamp01((f - fbt(40) - 10) / 6), 52)}
                {label('Soderstrom & Bjork 2015 · Perspectives on Psychological Science', 600, T.dim, clamp01((f - fbt(44)) / 6))}
              </>
            ) : (
              <>
                {label('Soderstrom & Bjork 2015 · 两种错位 · 曲线为示意', 200, T.dim)}
                <PerfLearn f={f} at={fbt(48)} x={200} y={340} perf={PERF_FLAT} learn={LEARN_UP} title="学到了，成绩没变" titleColor={T.cyan} />
                <PerfLearn f={f} at={fbt(52)} x={1040} y={340} perf={PERF_UP} learn={LEARN_FLAT} title="成绩涨了，没学进去" titleColor={T.orange} />
              </>
            )}
          </>
        )}

        {/* ---------- 间隔 ---------- */}
        {inShot(f, SHOTS.spacing) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="间隔" sub="SPACING" />
            ) : (
              <>
                {head('同样两小时', 960, 250, T.white, 1, 44)}
                <TimeBlocks blocks={[[0, 4]]} span={12} y={380} label="一口气" color={T.gray} />
                <TimeBlocks blocks={[[0, 1], [3, 1], [6, 1], [9, 1]]} span={12} y={540} label="拆开练" color={T.cyan} progress={clamp01((f - fbt(68)) / 16)} />
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.rct) && (
          <>
            <TacBg />
            {label(`Moulton 等 2006 · Annals of Surgery · 随机对照 · ${MOULTON_N} 名外科住院医生 · 柱高为示意`, 170, T.dim)}
            {f < fbt(84) ? (
              <>
                <TimeBlocks blocks={[[0, 4]]} span={28} y={380} label="一天练完" color={T.gray} />
                <TimeBlocks blocks={[[0, 1], [7, 1], [14, 1], [21, 1]]} span={28} y={540} label="每周一次" color={T.cyan} progress={clamp01((f - fbt(80)) / 16)} note="总练习时长一样" />
              </>
            ) : (
              <PairBars
                f={f}
                at={fbt(84)}
                names={['一天练完', '每周一次']}
                groups={[
                  ['刚练完', 0.6, 0.62, fbt(84)],
                  ['一个月后', 0.38, 0.72, fbt(88)],
                  ['活体手术', 0.34, 0.7, fbt(92)],
                ]}
              />
            )}
          </>
        )}

        {/* ---------- 存进去 ---------- */}
        {inShot(f, SHOTS.meta) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="存进去" sub="CONSOLIDATION" />
            ) : (
              <>
                {label('Cepeda 等 2006 · Psychological Bulletin · 元分析（多为言语记忆任务）', 200, T.dim)}
                <div style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', gap: 120, opacity: clamp01((f - fbt(104)) / 8)}}>
                  {[
                    [CEPEDA_ARTICLES, '篇文章'],
                    [CEPEDA_EXPERIMENTS, '个实验'],
                    [CEPEDA_ASSESSMENTS, '次评估'],
                  ].map(([n, u]) => (
                    <div key={u} style={{textAlign: 'center'}}>
                      <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 130, color: n === CEPEDA_EXPERIMENTS ? T.orange : T.gray, filter: n === CEPEDA_EXPERIMENTS ? glowF(T.orange, 10) : undefined}}>{n}</div>
                      <div style={{fontFamily: TF.sans, fontSize: 36, color: T.white}}>{u}</div>
                    </div>
                  ))}
                </div>
                {head('隔开练，记得更牢', 960, 660, T.cyan, clamp01((f - fbt(108)) / 8), 52)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.store) && (
          <>
            <TacBg />
            {label('Walker 等 2002 · Neuron（上一期）', 200, T.dim)}
            <div style={{position: 'absolute', left: 170, top: 380, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
              <MsBars f={f} at={fbt(120)} rows={[['一直醒着（不显著）', 0, T.gray]]} max={30} w={600} unit="%" labelW={300} />
              <MsBars f={f} at={fbt(120) + 10} rows={[['中间睡一晚', WALKER_GAIN, T.cyan]]} max={30} w={600} unit="%" labelW={300} />
            </div>
            {f < fbt(120) && head('一口气猛练：当场熟，留下少', 960, 460, T.orange, clamp01((f - fbt(116)) / 6), 48)}
          </>
        )}

        {/* ---------- 错觉 ---------- */}
        {inShot(f, SHOTS.illusion) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="错觉" sub="THE FEELING LIES" />
            ) : f < fbt(144) ? (
              <>
                {label('Kornell & Bjork 2008 · Psychological Science · 原创色块代表不同画家', 200, T.dim)}
                <PaintRow f={f} at={fbt(136)} order="AAAABBBBCCCC" y={340} label="连着看" color={T.gray} />
                <PaintRow f={f} at={fbt(140)} order="ABCABCABCABC" y={560} label="穿插看" color={T.cyan} />
              </>
            ) : (
              <>
                {label('Kornell & Bjork 2008 · 柱高为示意，只画方向', 200, T.dim)}
                <PairBars
                  f={f}
                  at={fbt(144)}
                  names={['连着看', '穿插看']}
                  colors={[T.gray, T.cyan]}
                  groups={[
                    ['考试成绩', 0.45, 0.7, fbt(144)],
                    ['自己觉得有多有效', 0.75, 0.45, fbt(148)],
                  ]}
                />
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.bigline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.bigline[0]} text={BIG_LINE} size={100} y={440} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="SPACE IT OUT" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['两小时拆几段', '每天练一点', '隔天再测', '睡一觉再验收']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => (
                    <>
                      {[0, 1, 2, 3].map((k) => (
                        <rect key={k} x={30 + k * 50} y={55} width={36} height={40} rx={5} fill={c} />
                      ))}
                    </>
                  ),
                  (c) => (
                    <>
                      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                        <rect key={k} x={25 + k * 28} y={60} width={20} height={30} rx={3} fill={c} opacity={0.4 + (k % 2) * 0.6} />
                      ))}
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={60} y={30} width={120} height={100} rx={8} fill="none" stroke={c} strokeWidth={5} />
                      <path d="M60 60 H180 M90 20 V45 M150 20 V45" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => <path d="M150 30 A50 50 0 1 0 190 110 A40 40 0 1 1 150 30 Z" fill={c} opacity={0.9} />,
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <TacBg />
            <TimeBlocks blocks={buildP < 1 ? [[0, 4]] : [[0, 1], [3, 1], [6, 1], [9, 1]]} span={12} y={460} label="两小时" color={T.cyan} moons />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：间隔 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="你缺的，是练习之间的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色 ---------- */}
        {inShot(f, SHOTS.outro) &&
          (f < OUT_RANGE ? (
            <>
              <TacBg tone="warm" />
              {label('拆开练之后，每周的得分 · 示意', 230, '#ffd9a8')}
              {at(410, 330, <NeonLine f={f} at={SHOTS.outro[0] + 4} data={WEEKS_UP} w={1100} h={400} yLabel="得分" xLabel="第 1 → 8 周" dur={60} />)}
            </>
          ) : (
            <OutroRange f={f} kill={OUT_KILL} />
          ))}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={104} y={430} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={100} y={430} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: TF.sans, fontSize: 34, color: T.cyan, opacity: clamp01((f - SHOTS.ask[0] - 40) / 12), filter: glowF(T.cyan, 4)}}>评论区聊聊 ↓</div>
          </>
        )}
      </AbsoluteFill>

      {showHud && (
        <HudFrame
          series={SERIES}
          ep={EP}
          topic={TOPIC}
          chapter={[ch, CHAPTERS.length - 1, CHAPTERS[ch][1]]}
          progress={f / DURATION}
          ticks={CHAPTERS.slice(1).map(([b]) => fb(b) / DURATION)}
          hp={inShot(f, SHOTS.outro) && f >= OUT_RANGE ? 100 : undefined}
          ammo={inShot(f, SHOTS.outro) && f >= OUT_RANGE ? [25, 25] : undefined}
        />
      )}
      <HookBanner f={f} text={HOOK_LINE} out={DARK_FROM} />

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />

      {CUES.map(([beat, text], i) => {
        if (!text) return null;
        const st = cueStart(i);
        const out = beat === HALF_BEATS[0] ? DARK_FROM : beat === HALF_BEATS[1] ? DARK_FROM2 : cueEnd(i) - 6;
        if (f < st - 2 || f > out + 10) return null;
        return <TCaption key={i} f={f} at={st} out={out} text={text} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 30)) / 30), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
