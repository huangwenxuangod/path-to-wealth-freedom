import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, Bubble, ChapterCard, DeathScreen, HookBanner, HudFrame, SlowMo, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {keyPos, predictAim, SpeedBand, TrackTrace, TurnPath} from '../../library/tactical/tracking';
import type {Key} from '../../library/tactical/tracking';
import {WindowLanes} from '../../library/tactical/window';
import {DelayChain, headAt, StrafeView} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  chapterAt,
  CHAPTERS,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DEADZONE,
  DEATH,
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
  HOOK_LINE,
  LAG,
  MIYA_LAT,
  OPEN_KF,
  OPEN_SHOTS,
  OPEN_STOP,
  OUT_KF,
  OUT_KILL,
  OUT_STOP,
  QUESTION_LINE,
  REPLAY,
  SERIES,
  SFX,
  SHOTS,
  SPLIT,
  TERM2,
  TITLE,
  TOPIC,
  VM_DELAY,
} from './timeline';

/**
 * ep49 对面一横跳，你就打不中？（战术屏科普风，无口播）
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

const toFrames = (kf: [number, number][]): Key[] => kf.map(([b, x]) => [fbt(b), x]);
const OPEN = toFrames(OPEN_KF);
const OUT = toFrames(OUT_KF);
const SHOTF = OPEN_SHOTS.map(fbt);
const range = (a: number, b: number) => Array.from({length: b - a}, (_, i) => a + i);
/** 回放：开场 0 → 站住，他的位置和你的准星 */
const REPLAY_FR = range(0, OPEN_STOP + 6);
const REPLAY_T = REPLAY_FR.map((i) => keyPos(OPEN, i));
const REPLAY_A = REPLAY_FR.map((i) => predictAim(OPEN, i, LAG));
const REPLAY_MARKS = OPEN.slice(1, -1).map(([fr0]) => fr0 + LAG - 1);
/** 匀速：一直往右走（示意） */
const SMOOTH_KF: Key[] = [
  [0, -1.2],
  [90, 1.2],
  [120, 1.2],
];
const SMOOTH_FR = range(0, 90);
/** 横跳：不规则节奏（示意） */
const ZIG_KF: Key[] = [
  [0, -1],
  [16, 1],
  [26, -0.4],
  [44, 1],
  [52, 0.2],
  [70, 1],
  [80, -0.6],
  [96, 0.8],
  [130, 0.8],
];
const ZIG_FR = range(0, 100);
const ZIG_MARKS = ZIG_KF.slice(1, -1).map(([fr0]) => fr0 + LAG - 1);
/** 固定节奏：每 16 帧换一次向（示意） */
const REG_KF: Key[] = [...Array.from({length: 8}, (_, i) => [i * 16, i % 2 ? 1 : -1] as Key), [150, 1]];
const REG_FR = range(0, 112);
/** 横跳的速度（占最高速的比例）：正弦横跳，换向时降到 0（示意） */
const SPEED = range(0, 120).map((i) => Math.abs(Math.cos((i / 120) * Math.PI * 5)));

export const Ep49AdStrafe: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.outro);
  const s = 1 + punch(f);
  // 慢放：第三个换向（第 4.3 拍）前后，5 倍慢放
  const turn3 = OPEN[3][0];
  const slowF = turn3 - 4 + (f - SPLIT) / 5;
  const deadHead = headAt(keyPos(OPEN, DEATH));

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep49-ad-strafe/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <StrafeView f={f} kf={OPEN} lag={LAG} shots={SHOTF} />}
        {inShot(f, SHOTS.death) && (
          <>
            <StrafeView f={DEATH} kf={OPEN} lag={LAG} dead />
            <DeathScreen f={f} at={DEATH} cx={deadHead[0]} cy={deadHead[1]} />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <TacBg tone="red" />
            <SlowMo f={f} rate="回放" x={110} y={240} />
            <TrackTrace f={f} at={REPLAY} dur={50} target={REPLAY_T} aim={REPLAY_A} marks={REPLAY_MARKS} y={380} h={360} scale={140} />
            {label('示意 · 圈出的是每次他换向后，你的准星还冲向老方向的地方', 790, T.dim, clamp01((f - REPLAY - 30) / 8))}
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <StrafeView f={slowF} kf={OPEN} lag={LAG} arrow />
            <SlowMo f={f} rate="×0.2" x={110} y={240} />
            {f >= fbt(19) && <Bubble f={f} at={fbt(19)} text="他已经往回走了" x={headAt(keyPos(OPEN, slowF))[0] - 380} y={headAt(0)[1] - 190} color={T.orange} />}
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

        {/* ---------- 追踪 ---------- */}
        {inShot(f, SHOTS.delay) && (
          <>
            <TacBg />
            {label('Miyamoto 等 2025 · iScience', 200, T.dim)}
            <DelayChain f={f} at={fbt(40)} ms={VM_DELAY} />
          </>
        )}
        {inShot(f, SHOTS.smooth) && (
          <>
            <TacBg />
            {label('他匀速走 · 原创示意（Kowler 等 2019：追踪会提前预判轨迹）', 200, T.dim)}
            <TrackTrace f={f} at={fbt(44)} dur={60} target={SMOOTH_FR.map((i) => keyPos(SMOOTH_KF, i, false))} aim={SMOOTH_FR.map((i) => (i < LAG ? keyPos(SMOOTH_KF, 0, false) : predictAim(SMOOTH_KF, i, LAG)))} y={330} />
            {f >= fbt(52) && head('准星瞄的是他「下一刻」', 960, 760, T.cyan, clamp01((f - fbt(52)) / 8), 40)}
          </>
        )}

        {/* ---------- 换向 ---------- */}
        {inShot(f, SHOTS.turn) && (
          <>
            {f < fb(17) ? (
              <>
                <TacBg />
                <ChapterCard f={f} at={fb(16)} n={2} title="换向" sub="DIRECTION CHANGE" />
              </>
            ) : (
              <>
                <StrafeView f={turn3 - 2 + (f - fb(17)) / 4} kf={OPEN} lag={LAG} arrow />
                {head('横跳，专门骗你的预测', 960, 250, T.orange, clamp01((f - fbt(68)) / 8), 48)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.bend) && (
          <>
            <TacBg />
            {label('Engel & Soechting 2000 · J Neurophysiol · 原创示意（虚线是目标，青线是手）', 170, T.dim)}
            <TurnPath x0={380} y0={640} a0={-0.25} turn={-1.6} len0={620} len1={420} over={120} progress={clamp01((f - fbt(72)) / 90)} handAt={clamp01((f - fbt(72) - 6) / 96)} />
            {f >= fbt(76) && head('过一段反应时间，手才开始转', 1320, 300, T.cyan, clamp01((f - fbt(76)) / 8), 36)}
          </>
        )}
        {inShot(f, SHOTS.zigzag) && (
          <>
            <TacBg />
            {label('横跳 · 原创示意：每次换向，你都要重新落后一次', 200, T.dim)}
            <TrackTrace f={f} at={SHOTS.zigzag[0]} dur={50} target={ZIG_FR.map((i) => keyPos(ZIG_KF, i, false))} aim={ZIG_FR.map((i) => predictAim(ZIG_KF, i, LAG))} marks={ZIG_MARKS} y={330} />
          </>
        )}

        {/* ---------- 节奏 ---------- */}
        {inShot(f, SHOTS.rhythm) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="节奏" sub="RHYTHM" />
            ) : f < fbt(116) ? (
              <>
                {label('de Hemptinne 等 2010 · Exp Brain Res · 原创示意：折返可预期时，眼睛提前减速', 200, T.dim)}
                <TrackTrace f={f} at={fbt(104)} dur={60} target={REG_FR.map((i) => keyPos(REG_KF, i, false))} aim={REG_FR.map((i) => keyPos(REG_KF, i + 1, false))} names={['目标', '眼睛']} y={330} />
              </>
            ) : (
              <>
                {label('原创示意', 160, T.dim)}
                {head('固定节奏：猜得中', 960, 200, T.cyan, 1, 34)}
                <TrackTrace f={f} at={fbt(116)} dur={30} target={REG_FR.map((i) => keyPos(REG_KF, i, false))} aim={REG_FR.map((i) => keyPos(REG_KF, i + 1, false))} y={290} h={220} scale={90} />
                {f >= fbt(120) && head('节奏一乱：落空', 960, 520, T.red, 1, 34)}
                {f >= fbt(120) && <TrackTrace f={f} at={fbt(120)} dur={30} target={ZIG_FR.map((i) => keyPos(ZIG_KF, i, false))} aim={ZIG_FR.map((i) => predictAim(ZIG_KF, i, LAG))} marks={ZIG_MARKS} y={610} h={220} scale={90} />}
              </>
            )}
          </>
        )}

        {/* ---------- 停顿 ---------- */}
        {inShot(f, SHOTS.intercept) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="停顿" sub="STOP TO SHOOT" />
            ) : (
              <>
                {label('Miyamoto 等 2025 · iScience · 拦截一个突然动起来的目标', 200, T.dim)}
                <WindowLanes f={f} tMax={500} ticks={MIYA_LAT} y={420} rows={[{label: '各人的平均', from: MIYA_LAT[0], to: MIYA_LAT[1], color: T.orange, at: fbt(136)}]} />
                {f >= fbt(140) && (
                  <>
                    {head('靠预判', 520 + (MIYA_LAT[0] / 500) * 1160, 330, T.cyan, clamp01((f - fbt(140)) / 6), 36)}
                    {head('靠反应', 520 + (MIYA_LAT[1] / 500) * 1160, 330, T.gray, clamp01((f - fbt(140)) / 6), 36)}
                  </>
                )}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.dead) && (
          <>
            <TacBg />
            {label('Riot《VALORANT Patch Notes 3.0》· 死区 27.5% · 速度曲线为示意', 200, T.dim)}
            <SpeedBand f={f} at={SHOTS.dead[0]} speed={SPEED} gate={DEADZONE} gateLabel={`${(DEADZONE * 100).toFixed(1)}%`} hiLabel="换向的那一下" y={320} h={380} />
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WAIT AT THE END" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['别跟着甩', '准星停在那一头', '等他停下', '节奏别固定']}
                colors={[T.red, T.cyan, T.orange, T.green]}
                icons={[
                  (c) => (
                    <>
                      <path d="M40 75 H200 M60 55 L40 75 L60 95 M180 55 L200 75 L180 95" fill="none" stroke={c} strokeWidth={5} />
                      <path d="M90 40 L150 110 M150 40 L90 110" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => (
                    <>
                      <path d="M40 75 H160" stroke={c} strokeWidth={4} strokeDasharray="10 8" opacity={0.5} />
                      <circle cx={190} cy={75} r={20} fill="none" stroke={c} strokeWidth={4} />
                      <path d="M190 45 V60 M190 90 V105 M160 75 H175 M205 75 H220" stroke={c} strokeWidth={4} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={70} y={45} width={30} height={60} rx={4} fill={c} />
                      <rect x={140} y={45} width={30} height={60} rx={4} fill={c} />
                    </>
                  ),
                  (c) => (
                    <path d="M30 100 L70 50 L95 100 L150 50 L170 100 L210 50" fill="none" stroke={c} strokeWidth={5} strokeLinejoin="round" />
                  ),
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <StrafeView f={ff} kf={OUT.map(([a, x]) => [a - (OUT[0][0] - SHOTS.build[0]), x] as Key)} lag={LAG} aim="park" parkX={1} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：预测 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="他甩掉的，是你的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色射击场 ---------- */}
        {inShot(f, SHOTS.outro) && (
          <>
            <StrafeView f={f} kf={OUT} lag={LAG} aim="park" parkX={1} tone="warm" kill={OUT_KILL} />
            {f >= OUT_STOP - 10 && f < OUT_KILL && <Bubble f={f} at={OUT_STOP - 10} text="减速，停下" x={headAt(1)[0] + 60} y={headAt(1)[1] - 170} color="#ffd9a8" />}
          </>
        )}
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
          hp={rangeShot ? (inShot(f, SHOTS.death) ? 0 : 62) : undefined}
          ammo={rangeShot ? [14, 25] : undefined}
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
