import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {Bandwidth, CrossStim, EvokedWave, PeopleGrid, ToneIcon, VoiceComm, WaveBox} from '../../library/tactical/attention';
import {MsBars} from '../../library/tactical/charts';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HookBanner, HudFrame, SlowMo, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {CallTimeline, DuelView, PilotCard, RoundStrip} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  CALL_BEATS,
  CALL_TEXT,
  chapterAt,
  CHAPTERS,
  CROSS_MS,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEATH,
  DURATION,
  EP,
  fb,
  fbt,
  FLIP_LINE,
  FPS,
  FREEZE,
  GIR_MISS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  ML_ABSTRACT_MISS,
  ML_HIGH_HEARD,
  ML_LOW_HEARD,
  ML_N,
  MOLLOY_MS,
  MOLLOY_QUOTE,
  OUT_CALL,
  OUT_KILL1,
  OUT_KILL2,
  OUT_TURN,
  QUESTION_LINE,
  REPLAY,
  RL_EXPECT_PCT,
  RL_HIGH,
  RL_LOW,
  SERIES,
  SFX,
  SHORT_CALL,
  SHOTS,
  SIDE_PEEK,
  TERM2,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep45 队友报点，你怎么听不见？（战术屏科普风，无口播）
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
  <div style={{position: 'absolute', left: x - 400, width: 800, top, textAlign: 'center', fontFamily: TF.sans, fontSize: size, color, opacity}}>{text}</div>
);

const OUT_PEEK = fb(50) + 6;

export const Ep45Callouts: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || (inShot(f, SHOTS.duel) && f >= fb(33)) || inShot(f, SHOTS.outro);
  const s = 1 + punch(f);
  const callAt = CALL_BEATS.map(fbt).filter((a) => f >= a).pop();
  const crossAt = fbt(40);
  const flash = (at: number) => (f >= at && (f - at) % 30 < 5 ? 1 : 0.12);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep45-callouts/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <DuelView f={f} sidePeek={SIDE_PEEK} />
            {callAt !== undefined && <VoiceComm f={f} at={callAt} text={CALL_TEXT} clear={0.2} talk={24} />}
          </>
        )}
        {inShot(f, SHOTS.death) && (
          <>
            <DuelView f={DEATH} sidePeek={SIDE_PEEK} dead />
            <DeathScreen f={f} at={DEATH} cx={1300} cy={520} />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <TacBg tone="red" />
            <SlowMo f={f} rate="回放" x={110} y={240} />
            <CallTimeline f={f} at={REPLAY} calls={[0.05, 0.3, 0.55]} deathT={0.82} callText={CALL_TEXT} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={150} y={240} w={760} h={500} color={T.orange} title="你的耳机" sub="声音到了" />
            <WaveBox f={f} x={230} y={360} w={600} h={260} amp={0.95} color={T.orange} seed={3} />
            {head('喊了三遍，一遍不少', 530, 650, T.orange, 1, 34)}
            <SplitPanel x={1010} y={240} w={760} h={500} color={T.red} title="你的脑子" sub="没进来" active={clamp01((f - fbt(19)) / 6)} />
            <WaveBox f={f} x={1090} y={360} w={600} h={260} amp={f >= fbt(19) ? 0.05 : 0.4} color={f >= fbt(19) ? T.dim : T.gray} seed={3} />
            {f >= fbt(19) && head('一个字都没听见', 1390, 650, T.red, clamp01((f - fbt(19)) / 6), 34)}
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

        {/* ---------- 失聪：十字实验 ---------- */}
        {inShot(f, SHOTS.cross) && (
          <>
            <TacBg />
            {label('Macdonald & Lavie 2011 · 实验 2 · 原创示意', 170, T.dim)}
            {f < fbt(44) ? (
              <>
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <CrossStim x={960} y={470} size={300} show={flash(crossAt)} />
                </svg>
                {head(`只闪 ${CROSS_MS} 毫秒`, 960, 680, T.cyan, clamp01((f - crossAt) / 6))}
              </>
            ) : (
              <>
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <CrossStim x={560} y={460} size={260} show={f >= fbt(52) ? 1 : flash(fbt(44))} />
                  {f >= fbt(48) && <CrossStim x={1360} y={460} size={260} show={f >= fbt(52) ? 1 : flash(fbt(48))} />}
                  {f >= fbt(52) && (
                    <>
                      <ToneIcon x={560} y={700} s={70} on={clamp01((f - fbt(52)) / 8)} />
                      <ToneIcon x={1360} y={700} s={70} on={clamp01((f - fbt(52)) / 8)} />
                    </>
                  )}
                </svg>
                {head('简单组：哪条是蓝的？', 560, 260, T.cyan)}
                {f >= fbt(48) && head('困难组：哪条更长？', 1360, 260, T.red)}
                {f >= fbt(52) && head('同时，耳机里「嘀」一声', 960, 770, T.orange, clamp01((f - fbt(52)) / 6), 34)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.heard) && (
          <>
            <TacBg />
            {label(`每组 ${ML_N} 人 · 亮的是听见那一声的人 · Macdonald & Lavie 2011`, 170, T.dim)}
            <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
              <PeopleGrid f={f} at={fbt(56)} n={ML_N} lit={ML_LOW_HEARD} x={370} y={380} />
              <PeopleGrid f={f} at={fbt(60)} n={ML_N} lit={ML_HIGH_HEARD} x={1180} y={380} per={4} />
            </svg>
            {head('看颜色（简单）', 555, 250, T.cyan)}
            {head('比长短（困难）', 1365, 250, T.red)}
            {head(`${ML_LOW_HEARD} / ${ML_N} 听见`, 555, 680, T.cyan, clamp01((f - fbt(56) - 30) / 8), 44)}
            {f >= fbt(60) && head(`${ML_HIGH_HEARD} / ${ML_N} 听见`, 1365, 680, T.red, clamp01((f - fbt(60) - 16) / 8), 44)}
            {f >= fbt(60) && head(`论文摘要：${ML_ABSTRACT_MISS}% 没听见`, 1365, 750, T.gray, clamp01((f - fbt(60) - 28) / 8), 28)}
          </>
        )}

        {/* ---------- 大脑 ---------- */}
        {inShot(f, SHOTS.brain) && (
          <>
            <TacBg />
            <ChapterCard f={f} at={fb(16)} n={2} title="大脑" sub="SHARED CAPACITY" />
          </>
        )}
        {inShot(f, SHOTS.pipe) && (
          <>
            <TacBg />
            <Bandwidth x={460} y={420} w={1000} h={110} vis={0.35 * clamp01((f - fbt(68)) / 10)} aud={0.25} enter={clamp01((f - fbt(68) - 12) / 12)} title="一条带宽 · 眼睛和耳朵共用（示意）" />
          </>
        )}
        {inShot(f, SHOTS.meg) && (
          <>
            <TacBg />
            {label(`Molloy 等 2015 · J Neurosci · 脑磁图 · 曲线为示意，只画方向`, 170, T.dim)}
            <EvokedWave
              f={f}
              x={420}
              y={280}
              w={1080}
              h={420}
              curves={[
                {early: 0.85, late: 0.7, color: T.cyan, at: fbt(76), label: '眼睛不忙'},
                {early: 0.42, late: 0.3, color: T.red, at: fbt(80), label: '眼睛很忙'},
              ]}
              marks={[
                {ms: MOLLOY_MS, label: `约 ${MOLLOY_MS}`, at: fbt(76)},
                {ms: 320, label: '「听到了」', at: fbt(84)},
              ]}
            />
            {f < fbt(76) && head('听觉区对声音的反应', 960, 450, T.gray, clamp01((f - fbt(72)) / 6))}
          </>
        )}
        {inShot(f, SHOTS.share) && (
          <>
            <TacBg />
            <Bandwidth x={460} y={330} w={1000} h={110} vis={0.35 + 0.6 * clamp01((f - fbt(88)) / 14)} aud={0.25} enter={clamp01((f - fbt(88) - 16) / 12)} />
            <div style={{position: 'absolute', left: 300, right: 300, top: 600, textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 30, lineHeight: 1.4, color: T.text, opacity: clamp01((f - fbt(88)) / 10)}}>“{MOLLOY_QUOTE}.”</div>
            {label('MOLLOY ET AL. · J NEUROSCI · 2015', 740, T.cyan, clamp01((f - fbt(88)) / 10))}
          </>
        )}

        {/* ---------- 在等也漏 ---------- */}
        {inShot(f, SHOTS.expect) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="在等也漏" sub="EVEN WHEN EXPECTED" />
            ) : f < fbt(104) ? (
              <>
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <ToneIcon x={930} y={440} s={180} on={clamp01((f - fb(25)) / 10)} color={T.cyan} />
                </svg>
                {head('提前知道会有声音？', 960, 600, T.white, clamp01((f - fbt(100)) / 6), 52)}
              </>
            ) : (
              <>
                {label('Raveh & Lavie 2015 · 实验 1 · 边找字母边听 · 听见声音的比例', 200, T.dim)}
                <div style={{position: 'absolute', left: 170, top: 360, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
                  <MsBars f={f} at={fbt(108)} rows={[['找得轻松', RL_LOW, T.cyan]]} max={100} w={700} unit="%" labelW={200} />
                  <MsBars f={f} at={fbt(112)} rows={[['找得费劲', RL_HIGH, T.red]]} max={100} w={700} unit="%" labelW={200} />
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.waiting) && (
          <>
            <TacBg />
            {label(`Raveh & Lavie 2015 · 实验 3：${RL_EXPECT_PCT}% 的回合有声音，每回合都要回答 · 漏听格子为示意`, 200, T.dim)}
            <RoundStrip f={f} at={fbt(116)} n={10} tone={[0, 2, 3, 6, 8]} heard={[2, 8]} per={4} y={400} />
            {f >= fbt(124) && head('太专心了', 960, 680, T.orange, clamp01((f - fbt(124)) / 6), 60)}
          </>
        )}

        {/* ---------- 对枪 ---------- */}
        {inShot(f, SHOTS.duel) && (
          <>
            {f < fb(33) ? (
              <>
                <TacBg />
                <ChapterCard f={f} at={fb(32)} n={4} title="对枪" sub="PEAK VISUAL LOAD" />
              </>
            ) : (
              <>
                <DuelView f={f} sidePeek={fbt(138)} />
                <div style={{position: 'absolute', left: 1060, top: 236, width: 760, height: 210, background: 'rgba(5,11,20,0.78)', border: `1px solid ${T.faint}`}} />
                <Bandwidth x={1100} y={300} w={560} h={70} vis={0.3 + 0.68 * clamp01((f - fbt(136)) / 16)} aud={0.24} enter={clamp01((f - fbt(140)) / 10)} />
                {f >= fbt(140) && <VoiceComm f={f} at={fbt(140)} text={CALL_TEXT} clear={0.2} talk={30} />}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.pilot) && (
          <>
            <TacBg />
            <PilotCard f={f} at={SHOTS.pilot[0]} pctAt={fbt(148)} pct={GIR_MISS} source="GIRAUDET ET AL. · PLOS ONE · 2015" />
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="CALL IT SHORT" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['先方位，后人数', '越短越好', '他在对枪，先等等', '没回应就再喊']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => (
                    <>
                      <circle cx={120} cy={75} r={55} fill="none" stroke={c} strokeWidth={4} />
                      <path d="M120 75 L165 50" stroke={c} strokeWidth={6} strokeLinecap="round" />
                      <circle cx={165} cy={50} r={9} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={30} y={55} width={180} height={40} rx={20} fill="none" stroke={c} strokeWidth={4} opacity={0.35} />
                      <rect x={30} y={55} width={70} height={40} rx={20} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={70} y={45} width={30} height={60} rx={4} fill={c} />
                      <rect x={140} y={45} width={30} height={60} rx={4} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <ToneIcon x={90} y={75} s={70} color={c} />
                      <text x={185} y={95} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={52} fill={c}>
                        ×2
                      </text>
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
            <Bandwidth x={460} y={360} w={1000} h={110} vis={0.35} aud={0.25} enter={1} title="眼睛空下来，耳朵就进得来" />
            <VoiceComm f={ff} at={SHOTS.build[0]} text={SHORT_CALL} x={700} y={620} clear={1} talk={9999} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：带宽 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="让你听不见的，是" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色射击场 ---------- */}
        {inShot(f, SHOTS.outro) && (
          <>
            <DuelView
              f={f}
              sidePeek={OUT_PEEK}
              tone="warm"
              frontDead={f >= OUT_KILL1 + 2}
              turn={clamp01((f - OUT_TURN) / 14)}
              sideState={f >= OUT_KILL2 + 2 ? 'dead' : f >= OUT_KILL2 ? 'hit' : 'idle'}
              shotAt={f >= OUT_KILL2 ? OUT_KILL2 : f >= OUT_KILL1 ? OUT_KILL1 : undefined}
            />
            {f >= OUT_CALL && <VoiceComm f={f} at={OUT_CALL} text={SHORT_CALL} clear={1} talk={30} color="#ffb070" />}
          </>
        )}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={110} y={430} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={96} y={430} />
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
          hp={rangeShot ? (inShot(f, SHOTS.death) ? 0 : 41) : undefined}
          ammo={rangeShot ? [12, 25] : undefined}
        />
      )}
      <HookBanner f={f} text={HOOK_LINE} out={DARK_FROM} />

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
