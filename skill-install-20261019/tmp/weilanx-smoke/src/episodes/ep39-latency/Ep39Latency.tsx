import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, HudFrame, SlowMo, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {MsBars} from '../../library/tactical/charts';
import {FrameLanes, LatencyStack, PipelineFlow} from '../../library/tactical/pipeline';
import {glowF, T, TF} from '../../library/tactical/theme';
import {ClickFlash, ConditionGrid, FpsCounter, foeX, FrameStrips, HEAD_Y, HEADSHOT_AT, headshotX, ResultPair, ShootView} from './scenes';
import {
  AIM_DIFF,
  AIM_LAT,
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  chapterAt,
  CHAPTERS,
  CLICK,
  CPU_AHEAD,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DOUBLE,
  DURATION,
  EP,
  fb,
  fbt,
  FLIP_LINE,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  HUMAN_DELAY,
  MS_120,
  MS_240,
  MS_60,
  NV_QUOTE,
  PIPE_AT,
  PIPE_PER,
  QUESTION_LINE,
  RATES,
  SERIES,
  SFX,
  SHOT,
  SHOTS,
  STAGES,
  STAGES_EN,
  STUDY_QUOTE,
  SUBJECTS,
  TERM2,
  TITLE,
  TOPIC,
  TYPICAL_LATENCY,
} from './timeline';

/**
 * ep39 帧数翻倍，反应变快了吗？（战术屏科普风，无口播）
 * 镜头全部硬切、卡在拍子上；重拍之后每个小节的第一拍画面轻轻一顶（回落段减半），音效对准重拍。片尾停在评论区问题。
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

/** 开场帧数表：第 2–5 拍每拍 +30，从 120 跳到 240 */
const fpsAt = (f: number) => 120 + 30 * [2, 3, 4, 5].filter((b) => f >= fbt(b)).length;

const MACHINE = '#7fb2d6';
const label = (text: string, top: number, color: string = T.gray, opacity = 1, left = 0, right = 0) => (
  <div style={{position: 'absolute', left, right, top, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color, opacity}}>{text}</div>
);

export const Ep39Latency: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.shot) || inShot(f, SHOTS.headshot);
  const s = 1 + punch(f);
  const pipeAts = STAGES.map((_, i) => PIPE_AT + i * PIPE_PER);
  const allLit = STAGES.map(() => 0);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep39-latency/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <ShootView f={f} x={foeX(f)} />
            <FpsCounter fps={fpsAt(f)} />
          </>
        )}
        {inShot(f, SHOTS.shot) && (
          <>
            <ShootView f={SHOT + (f - SHOT) * 0.4} x={foeX(SHOT + (f - SHOT) * 0.4)} shotAt={SHOT} />
            <FpsCounter fps={240} />
            <SlowMo f={f} />
          </>
        )}
        {inShot(f, SHOTS.double) && (
          <>
            <TacBg />
            <FrameStrips f={f} at={DOUBLE} />
          </>
        )}
        {inShot(f, SHOTS.click) && (
          <>
            <TacBg />
            <ClickFlash f={f} at={CLICK} />
          </>
        )}
        {inShot(f, SHOTS.question) && (
          <>
            <TacBg />
            <BigWord f={ff} at={SHOTS.question[0]} text={QUESTION_LINE} size={110} y={430} />
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

        {/* ---------- 流水线 ---------- */}
        {inShot(f, SHOTS.pipe) && (
          <>
            <TacBg />
            <PipelineFlow
              f={f}
              stages={STAGES}
              sub={STAGES_EN}
              ats={pipeAts}
              hot={2}
              ends={['按下鼠标', '屏幕上冒火']}
              dot={f < PIPE_AT ? clamp01((f - fbt(36)) / 50) : clamp01((f - PIPE_AT) / (PIPE_PER * 5))}
            />
            <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: clamp01((f - fbt(40)) / 8)}}>
              <span style={{fontFamily: TF.sans, fontSize: 56, color: T.white}}>系统延迟</span>
              <span style={{marginLeft: 24, fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray}}>SYSTEM LATENCY · CLICK-TO-DISPLAY</span>
            </div>
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="NVIDIA · INTRODUCING NVIDIA REFLEX · 2020" quote={`“${NV_QUOTE}”`} cite="—— 帧数越高，延迟一般越低；但两者远不是一比一" size={44} />
          </>
        )}
        {inShot(f, SHOTS.rate) && (
          <>
            <TacBg />
            <PipelineFlow
              f={f}
              stages={STAGES}
              sub={STAGES_EN}
              ats={allLit}
              hot={2}
              ends={['按下鼠标', '屏幕上冒火']}
              stream={{phase: (f - fbt(52)) / 45, n: 6}}
              dot={f < fbt(56) ? null : clamp01((f - fbt(56)) / 45)}
            />
            <div style={{position: 'absolute', left: 160, top: 220, fontFamily: TF.sans, fontSize: 40, color: T.gray}}>
              帧数 = 出口<span style={{color: T.white}}>一秒出来几张</span>
            </div>
            <div style={{position: 'absolute', right: 160, top: 220, fontFamily: TF.sans, fontSize: 40, color: T.gray, opacity: clamp01((f - fbt(56)) / 8)}}>
              延迟 = <span style={{color: T.cyan}}>一张走完全程</span>要多久
            </div>
            {f >= fbt(60) && (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - fbt(60)) / 6)}}>
                <path d="M160 350 v-20 H1760 v20" fill="none" stroke={T.cyan} strokeWidth={4} style={{filter: glowF(T.cyan, 8)}} />
                <rect x={850} y={308} width={220} height={44} fill={T.bg} />
                <text x={960} y={344} textAnchor="middle" fontFamily={TF.sans} fontSize={44} fill={T.cyan} style={{filter: glowF(T.cyan, 8)}}>
                  流水线
                </text>
              </svg>
            )}
          </>
        )}

        {/* ---------- 排队 ---------- */}
        {inShot(f, SHOTS.queue) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="排队" sub="RENDER QUEUE" />
            ) : (
              <>
                <FrameLanes now={(f - fb(17)) * 9} />
                {label('示意 · GPU 忙不过来时，每一帧在三条泳道上的时间', 190)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.cost) && (
          <>
            <TacBg />
            <FrameLanes now={2000} you={5} bracket={clamp01((f - fbt(88)) / 14)} />
            {label(`示意 · NVIDIA 文中的例子：CPU 最多跑在 GPU 前面 ${CPU_AHEAD} 帧`, 190, T.gray)}
            {label('队列让 GPU 一刻不停：帧数高，但每一帧都要先排队', 760, T.text, clamp01((f - fbt(84)) / 8))}
          </>
        )}

        {/* ---------- 算账 ---------- */}
        {inShot(f, SHOTS.math) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="算账" sub="DO THE MATH" />
            ) : (
              <>
                {label('一帧有多长：1000 毫秒 ÷ 帧数', 220)}
                <div style={{position: 'absolute', left: 260, top: 320}}>
                  <MsBars f={f} at={fbt(100) - 10} max={18} w={900} labelW={300} digits={1} rows={[['60 帧 · 一帧', MS_60, T.gray], ['120 帧 · 一帧', MS_120, T.cyan]]} />
                </div>
                {f >= fbt(104) - 2 && (
                  <div style={{position: 'absolute', left: 260, top: 452}}>
                    <MsBars f={f} at={fbt(104)} max={18} w={900} labelW={300} digits={1} rows={[['240 帧 · 一帧', MS_240, T.green]]} />
                  </div>
                )}
                <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.sans, fontSize: 48, color: T.orange, opacity: clamp01((f - fbt(108)) / 8), filter: glowF(T.orange, 6)}}>
                  翻倍：一帧省下约 {Math.round(MS_120 - MS_240)} 毫秒
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.scale) && (
          <>
            <TacBg />
            <LatencyStack
              f={f}
              max={320}
              y={440}
              segs={[
                {label: '机器：整条流水线', ms: TYPICAL_LATENCY[0], ms2: TYPICAL_LATENCY[1], color: MACHINE, at: fbt(112)},
                {label: '你：看到 → 动手', ms: HUMAN_DELAY[0], ms2: HUMAN_DELAY[1], color: T.cyan, at: fbt(116)},
              ]}
            />
            {f >= fbt(120) && (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - fbt(120)) / 6)}}>
                <rect x={200} y={432} width={(4 / 320) * 1520} height={80} fill={T.green} style={{filter: glowF(T.green, 10)}} />
                <path d="M210 520 L260 640" stroke={T.green} strokeWidth={3} />
                <text x={270} y={680} fontFamily={TF.sans} fontSize={36} fill={T.green}>
                  帧数翻倍省下的：约 4 毫秒 / 帧
                </text>
              </svg>
            )}
            {f >= fbt(124) && (
              <div style={{position: 'absolute', left: 200 + (100 / 320) * 1520, width: (200 / 320) * 1520, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 40, color: T.orange, opacity: clamp01((f - fbt(124)) / 8), filter: glowF(T.orange, 6)}}>
                这一段，帧数管不着
              </div>
            )}
            {label('NVIDIA 2020：多数玩家的系统延迟 50～100 ms · Spjut 等 2019：手眼延迟常在 150～200 ms', 220, T.dim)}
          </>
        )}

        {/* ---------- 实验 ---------- */}
        {inShot(f, SHOTS.exp) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="实验" sub="NVIDIA RESEARCH · 2019" />
            ) : (
              <>
                {label(`${SUBJECTS} 名高手 · ${RATES.join(' / ')} Hz × 3 档延迟 · 越快打完越好`, 150, T.gray)}
                <ConditionGrid f={f} at={fbt(132)} rowHi={1} rowAt={fbt(136)} />
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.result) && (
          <>
            <TacBg />
            <ResultPair f={f} atL={fbt(140)} atR={fbt(144)} />
          </>
        )}
        {inShot(f, SHOTS.aim) && (
          <>
            <TacBg />
            {label(`NVIDIA 研究：系统延迟 ${AIM_LAT[0]} ms 和 ${AIM_LAT[1]} ms 的两台电脑，打靶平均差多少`, 230, T.gray)}
            <div style={{position: 'absolute', left: 200, top: 380}}>
              <MsBars f={f} at={SHOTS.aim[0]} max={200} w={1000} labelW={300} rows={[['系统延迟差', AIM_LAT[1] - AIM_LAT[0], T.cyan], ['打靶慢了', AIM_DIFF, T.red]]} />
            </div>
          </>
        )}
        {inShot(f, SHOTS.bigline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.bigline[0]} text={BIG_LINE} size={104} y={400} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 30, color: T.gray, opacity: clamp01((f - SHOTS.bigline[0] - 24) / 10)}}>
              “…{STUDY_QUOTE}” —— Spjut 等，SIGGRAPH Asia 2019
            </div>
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="FROM NVIDIA" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['开低延迟模式', '用独占全屏', '画质降一档', '游戏内限帧']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => (
                    <>
                      <rect x={20} y={55} width={60} height={40} fill="none" stroke={c} strokeWidth={4} />
                      <rect x={90} y={55} width={60} height={40} fill="none" stroke={c} strokeWidth={4} opacity={0.35} strokeDasharray="6 6" />
                      <rect x={160} y={55} width={60} height={40} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={30} y={25} width={180} height={100} fill="none" stroke={c} strokeWidth={5} />
                      <path d="M60 55 L45 40 M45 40 h18 M45 40 v18 M180 95 L195 110 M195 110 h-18 M195 110 v-18" stroke={c} strokeWidth={4} fill="none" />
                    </>
                  ),
                  (c) => (
                    <>
                      {[0, 1, 2, 3].map((k) => (
                        <rect key={k} x={40 + k * 45} y={110 - (4 - k) * 22} width={30} height={(4 - k) * 22} fill={k === 0 ? 'none' : c} stroke={c} strokeWidth={3} opacity={k === 0 ? 0.5 : 1} />
                      ))}
                    </>
                  ),
                  (c) => (
                    <>
                      <path d="M30 120 A90 90 0 0 1 210 120" fill="none" stroke={c} strokeWidth={5} />
                      <line x1={120} y1={120} x2={170} y2={60} stroke={c} strokeWidth={5} />
                      <line x1={180} y1={40} x2={196} y2={58} stroke={c} strokeWidth={8} />
                    </>
                  ),
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <TacBg />
            <PipelineFlow f={ff} stages={STAGES} sub={STAGES_EN} ats={allLit} queueIdx={2} queued={2 - 2 * clamp01((ff - SHOTS.build[0]) / 90)} stream={{phase: (ff - SHOTS.build[0]) / 45, n: 6}} ends={['按下鼠标', '屏幕上冒火']} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：流水线 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="你感觉到的，是一整条" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.sum) && (
          <>
            <TacBg tone="warm" />
            <LatencyStack
              f={f}
              max={320}
              y={440}
              segs={[
                {label: '机器', ms: TYPICAL_LATENCY[0], ms2: TYPICAL_LATENCY[1], color: '#ffd9a8', at: SHOTS.sum[0] + 4},
                {label: '你的手眼', ms: HUMAN_DELAY[0], ms2: HUMAN_DELAY[1], color: T.orange, at: fbt(204)},
              ]}
            />
            {f >= fbt(208) && (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - fbt(208)) / 8)}}>
                <path d="M200 600 v20 H1720 v-20" fill="none" stroke={T.white} strokeWidth={4} />
                <text x={960} y={690} textAnchor="middle" fontFamily={TF.sans} fontSize={44} fill={T.white}>
                  先手 = 两段加起来
                </text>
              </svg>
            )}
          </>
        )}
        {inShot(f, SHOTS.headshot) && (
          <>
            <ShootView
              f={f}
              x={headshotX(f, SHOTS.headshot[0])}
              tone="warm"
              camY={HEAD_Y}
              shotAt={f >= HEADSHOT_AT ? HEADSHOT_AT : undefined}
              hitText="HEADSHOT"
              state={f < HEADSHOT_AT ? 'idle' : f < HEADSHOT_AT + 4 ? 'hit' : 'dead'}
            />
            <FpsCounter fps={240} color="#ffd9a8" />
          </>
        )}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={100} y={430} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={100} y={430} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: TF.sans, fontSize: 34, color: T.cyan, opacity: clamp01((f - SHOTS.ask[0] - 40) / 12)}}>评论区聊聊 ↓</div>
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
          hp={rangeShot ? 100 : undefined}
          ammo={rangeShot ? [25, 75] : undefined}
        />
      )}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />

      {CUES.map(([beat, text], i) => {
        if (!text) return null;
        const at = cueStart(i);
        const out = beat === HALF_BEATS[0] ? DARK_FROM : beat === HALF_BEATS[1] ? DARK_FROM2 : cueEnd(i) - 6;
        if (f < at - 2 || f > out + 10) return null;
        return <TCaption key={i} f={f} at={at} out={out} text={text} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 30)) / 30), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
