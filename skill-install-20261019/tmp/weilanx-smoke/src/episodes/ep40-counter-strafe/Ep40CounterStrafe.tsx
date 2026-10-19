import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, HudFrame, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {CodeCard, SpeedMeter} from '../../library/tactical/vectors';
import {SpeedCurve, SpreadTarget} from '../../library/tactical/movement';
import {glowF, T, TF} from '../../library/tactical/theme';
import {DeadzoneBar, SpeedHud, strafeX, StrafeView} from './scenes';
import {
  ACCEL_LINES,
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  chapterAt,
  CHAPTERS,
  COUNTER_UNDER,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  EP,
  fb,
  fbt,
  FLIP_LINE,
  FPS,
  FREEZE,
  FRICTION_LINES,
  GAIN,
  HALF_BEATS,
  HIT,
  HIT2,
  HOLD,
  HOLD_WINDOW,
  QUESTION_LINE,
  RELEASE,
  RELEASE_STOP,
  RELEASE_UNDER,
  RIFLE_RUN,
  RIFLE_WALK,
  RIOT_QUOTE,
  SERIES,
  SFX,
  SHOT,
  SHOTS,
  SPEEDUP,
  SPLIT,
  SV_MAXSPEED,
  TAP,
  TERM2,
  THRESH,
  TICK,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep40 跑着开枪，怎么总打不中？（战术屏科普风，无口播）
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

const label = (text: string, top: number, color: string = T.gray, opacity = 1) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color, opacity}}>{text}</div>
);

const DT = 1 / TICK;
/** 横移：每帧 0.045 米（示意跑速） */
const hookX = (f: number) => strafeX(f, -3.5, 0.045);
const HS_STOP = fbt(218);
const holdUnder = HOLD.map((v, i) => [v, i] as const).filter(([v]) => Math.abs(v) < THRESH).map(([, i]) => i);

export const Ep40CounterStrafe: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.shot) || inShot(f, SHOTS.headshot);
  const s = 1 + punch(f);
  const hsF = f - SHOTS.headshot[0];

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep40-counter-strafe/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <StrafeView f={f} camX={hookX(f)} bob={Math.abs(Math.sin(f / 4)) * 0.04} />
            <SpeedHud frac={1} />
          </>
        )}
        {inShot(f, SHOTS.shot) && (
          <>
            <StrafeView f={f} camX={hookX(f)} shotAt={SHOT} shots={3} spread={130} hitText="MISS" seed={5} bob={Math.abs(Math.sin(f / 4)) * 0.04} />
            <SpeedHud frac={1} />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <TacBg />
            {label('● REC 回放 · 开枪那一刻', 200, T.red)}
            <SpeedMeter v={SV_MAXSPEED} max={360} label="你开枪时的速度（示意）" color={T.red} x={660} y={330} w={600} mark={THRESH} markLabel="站稳的门槛" />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SpreadTarget f={f} at={SPLIT + 2} x={560} y={480} r={150} n={6} per={4} seed={11} color={T.red} label="你 · 边跑边打" sub="移动中开枪" />
            <SpreadTarget f={f} at={SPLIT + 10} x={1360} y={480} r={18} n={3} per={5} seed={4} color={T.cyan} label="对面 · 先停再打" sub="站稳后开枪" headLabel />
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

        {/* ---------- 精度 ---------- */}
        {inShot(f, SHOTS.spread) && (
          <>
            <TacBg />
            <SpreadTarget f={f} at={fbt(40)} x={380} y={500} r={RIFLE_RUN * 36} n={6} per={3} seed={21} color={T.red} label="跑动" sub={`误差 ${RIFLE_RUN.toFixed(1)}`} size={160} />
            <SpreadTarget f={f} at={fbt(44)} x={960} y={500} r={RIFLE_WALK * 36} n={6} per={3} seed={9} color={T.orange} label="走路" sub={`误差 ${RIFLE_WALK.toFixed(1)}`} size={160} />
            <SpreadTarget f={f} at={fbt(44) + 12} x={1540} y={500} r={8} n={4} per={3} seed={2} color={T.green} label="站稳" sub="最准" size={160} />
            {label('示意 · 散布圈按 Riot 给步枪的误差数值等比例画（VALORANT 3.0 版本，2021）', 190, T.dim)}
          </>
        )}
        {inShot(f, SHOTS.deadzone) && (
          <>
            <TacBg />
            <DeadzoneBar f={f} at={SHOTS.deadzone[0]} />
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="RIOT GAMES · VALORANT PATCH NOTES 3.0 · 2021" quote={`“…${RIOT_QUOTE}”`} cite="—— 奖励那些主动先停下、再开枪的人" size={50} />
          </>
        )}
        {inShot(f, SHOTS.brake) && (
          <>
            <TacBg />
            <SpeedCurve f={f} curves={[]} dt={DT} tMax={0.6} vMax={340} thresh={THRESH} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: TF.sans, fontSize: 52, color: T.white, opacity: clamp01((f - fbt(56)) / 8)}}>
              从全速，到掉进绿区：<span style={{color: T.orange}}>怎么最快？</span>
            </div>
            {f >= fbt(60) && (
              <div style={{position: 'absolute', left: 0, right: 0, top: 450, textAlign: 'center', fontFamily: TF.sans, fontSize: 120, color: T.cyan, filter: glowF(T.cyan, 14), opacity: clamp01((f - fbt(60)) / 6)}}>刹车</div>
            )}
          </>
        )}

        {/* ---------- 松手 ---------- */}
        {inShot(f, SHOTS.release) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="松手" sub="LET GO" />
            ) : (
              <CodeCard f={f} at={fb(17)} file="Source SDK 2013 · gamemovement.cpp · Friction()" lines={FRICTION_LINES} hl={[2, 3]} note="Valve · 默认 sv_friction 4、sv_stopspeed 100 · 速度越快，每帧扣得越多" per={4} y={220} size={30} />
            )}
          </>
        )}
        {inShot(f, SHOTS.relcurve) && (
          <>
            <TacBg />
            <SpeedCurve
              f={f}
              curves={[{data: RELEASE.slice(0, 40), color: T.red, at: fbt(80), dur: 40, label: '松开方向键', labelT: 0.12}]}
              dt={DT}
              tMax={0.6}
              vMax={340}
              thresh={THRESH}
              marks={[
                {t: RELEASE_UNDER, label: `${RELEASE_UNDER} s 才站稳`, color: T.red, at: fbt(84), up: true},
                {t: RELEASE_STOP, label: `${RELEASE_STOP} s 停下`, color: T.gray, at: fbt(88)},
              ]}
              win={{t0: 0, t1: RELEASE_UNDER, at: fbt(92), label: ''}}
            />
            {label('示意 · 按 Source 默认参数、每秒 64 次自己模拟；绿区 = 低于最高速度的 27.5%', 150, T.dim)}
            {f >= fbt(92) && (
              <div style={{position: 'absolute', left: 300, top: 640, fontFamily: TF.sans, fontSize: 40, color: T.red, opacity: clamp01((f - fbt(92)) / 8)}}>这段时间开枪 = 乱飘</div>
            )}
          </>
        )}

        {/* ---------- 反向 ---------- */}
        {inShot(f, SHOTS.counter) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="反向" sub="COUNTER-STRAFE" />
            ) : (
              <CodeCard f={f} at={fb(25)} file="Source SDK 2013 · gamemovement.cpp · Accelerate()" lines={ACCEL_LINES} hl={[0, 1, 2]} note="按反方向键：想去的方向和速度相反，currentspeed 是负数，于是每帧都被往回推" per={4} y={220} size={28} />
            )}
          </>
        )}
        {inShot(f, SHOTS.compare) && (
          <>
            <TacBg />
            <SpeedCurve
              f={f}
              curves={[
                {data: RELEASE.slice(0, 40), color: T.red, at: SHOTS.compare[0], dur: 1, label: '松开方向键', width: 4, labelT: 0.18},
                {data: TAP.slice(0, 40), color: T.cyan, at: fbt(112), dur: 24, label: '点一下反方向', labelT: 0.36, labelDy: -20},
              ]}
              dt={DT}
              tMax={0.6}
              vMax={340}
              thresh={THRESH}
              marks={[
                {t: COUNTER_UNDER, label: `${COUNTER_UNDER} s`, color: T.cyan, at: fbt(116), up: true},
                {t: RELEASE_UNDER, label: `${RELEASE_UNDER} s`, color: T.red, at: fbt(116), up: true},
              ]}
              win={{t0: COUNTER_UNDER, t1: RELEASE_UNDER, at: fbt(124), label: `对面早 ${GAIN} 秒开准枪`}}
            />
            {f >= fbt(120) && <div style={{position: 'absolute', left: 1380, top: 380, fontFamily: TF.mono, fontWeight: 700, fontSize: 110, color: T.orange, filter: glowF(T.orange, 12), opacity: clamp01((f - fbt(120)) / 6)}}>×{SPEEDUP}</div>}
            {label('示意 · Source 默认参数、每秒 64 次模拟：反方向推力 10 × 320 = 每秒 3200', 150, T.dim)}
          </>
        )}

        {/* ---------- 点一下 ---------- */}
        {inShot(f, SHOTS.hold) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="点一下" sub="TAP, DON'T HOLD" />
            ) : (
              <>
                <SpeedCurve
                  f={f}
                  curves={[
                    {data: HOLD.slice(0, 26), color: T.red, at: fbt(136), dur: 26, label: '按住不放：反着跑起来了', labelT: 0.22, labelDy: -22},
                    {data: TAP.slice(0, 26), color: T.cyan, at: fbt(144), dur: 16, label: '点一下就松'},
                  ]}
                  dt={DT}
                  tMax={0.4}
                  vMax={340}
                  vMin={-340}
                  y={190}
                  h={560}
                  thresh={THRESH}
                  win={{t0: holdUnder[0] * DT, t1: (holdUnder[holdUnder.length - 1] + 1) * DT, at: fbt(140), label: `窗口 ≈ ${HOLD_WINDOW} s`}}
                />
                {label('示意 · 速度为负 = 已经往反方向跑', 150, T.dim)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.bigline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.bigline[0]} text={BIG_LINE} size={104} y={430} />
          </>
        )}

        {/* ---------- 练法（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="练法" sub="HOW TO PRACTICE" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['点反方向键', '点完就松开', '停稳再开枪', '左右来回练']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => (
                    <>
                      <rect x={30} y={45} width={60} height={60} rx={8} fill="none" stroke={c} strokeWidth={4} opacity={0.4} />
                      <text x={60} y={86} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={32} fill={c} opacity={0.4}>
                        D
                      </text>
                      <path d="M110 75 H150" stroke={c} strokeWidth={4} />
                      <rect x={160} y={45} width={60} height={60} rx={8} fill={c} />
                      <text x={190} y={86} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={32} fill="#06121a">
                        A
                      </text>
                    </>
                  ),
                  (c) => <path d="M30 120 V40 H80 V120 M80 120 H210" fill="none" stroke={c} strokeWidth={6} />,
                  (c) => (
                    <>
                      <circle cx={120} cy={75} r={45} fill="none" stroke={c} strokeWidth={5} />
                      <line x1={120} y1={15} x2={120} y2={135} stroke={c} strokeWidth={4} />
                      <line x1={60} y1={75} x2={180} y2={75} stroke={c} strokeWidth={4} />
                    </>
                  ),
                  (c) => <path d="M40 75 H200 M60 55 L40 75 L60 95 M180 55 L200 75 L180 95" fill="none" stroke={c} strokeWidth={6} />,
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <StrafeView f={ff} camX={strafeX(ff - SHOTS.build[0], -3, 0.03)} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：刹车 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="准不准，看你会不会" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.duel) && (
          <>
            <TacBg tone="warm" />
            <SpreadTarget f={f} at={fbt(202)} x={560} y={480} r={150} n={6} per={3} seed={13} color={T.red} label="边跑边打" sub="游戏让你飘" />
            <SpreadTarget f={f} at={fbt(206)} x={1360} y={480} r={16} n={3} per={4} seed={6} color={T.orange} label="点一下，再打" sub="游戏奖励你" headLabel />
          </>
        )}
        {inShot(f, SHOTS.headshot) && (
          <>
            <StrafeView
              f={f}
              camX={strafeX(hsF, -2.2, 0.05, HS_STOP - SHOTS.headshot[0])}
              tone="warm"
              shotAt={fbt(219)}
              shots={1}
              hitText="HEADSHOT"
              foeState={f < fbt(219) + 2 ? 'idle' : f < fbt(219) + 6 ? 'hit' : 'dead'}
              bob={f < HS_STOP ? Math.abs(Math.sin(f / 4)) * 0.04 : 0}
            />
            <SpeedHud frac={f < HS_STOP ? 1 : Math.max(0.05, 1 - (f - HS_STOP) / 3)} />
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
