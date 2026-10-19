import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HudFrame, SlowMo, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {MsBars} from '../../library/tactical/charts';
import {ConeOfConfusion, HeadTop, HearCanvas} from '../../library/tactical/hearing';
import {T, TF} from '../../library/tactical/theme';
import {EnemyView, GuessMap, HoldRange, HookView, ItdDemo, MirrorMap, PinnaScene, STEP_ICONS, StepPulse, TurnDemo, YAW_BACK, YouView} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  chapterAt,
  CHAPTERS,
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
  HALF_BEATS,
  HEAD_R_CM,
  HIT,
  HIT2,
  ITD_JND_US,
  ITD_MAX_US,
  NEXT_TITLE,
  QUESTION_LINE,
  RIOT_PATCH,
  RIOT_PROFILE,
  SERIES,
  SFX,
  SHOTS,
  SOUND_V,
  TERM2,
  TITLE,
  TOPIC,
  TURN_LINE,
  WENZEL_YEAR,
  WK_QUOTE,
  WK_YEAR,
} from './timeline';

/**
 * ep29 脚步声就在耳边，为什么听不出前后？（战术屏科普风，无口播）
 * 镜头全部硬切、卡在拍子上；重拍之后每个小节的第一拍画面轻轻一顶（回落段减半），音效对准重拍。
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

export const Ep29Footsteps: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2) && !inShot(f, SHOTS.next);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.build) || inShot(f, SHOTS.hold);
  const hp = inShot(f, SHOTS.death) ? 0 : 100;
  const s = 1 + punch(f);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep29-footsteps/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <HookView f={f} />}
        {inShot(f, SHOTS.death) && (
          <>
            <YouView f={DEATH} yaw={YAW_BACK} gun={false} />
            <DeathScreen f={f} at={DEATH} cx={960} cy={470} label="你被击杀了" />
          </>
        )}
        {inShot(f, SHOTS.killcam) && (
          <>
            <EnemyView f={f} shot={SHOTS.killcam[0] + 8} />
            <div style={{position: 'absolute', left: 110, top: 160, display: 'flex', alignItems: 'center', gap: 14, padding: '6px 18px', border: `2px solid ${T.red}`, background: 'rgba(40,8,14,0.6)', fontFamily: TF.sans, fontSize: 30, color: T.red}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: T.red, opacity: Math.floor(f / 10) % 2 ? 0.3 : 1}} />
              击杀回放 · 他的屏幕
            </div>
            <SlowMo f={f} x={110} y={230} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <MirrorMap f={f} at={SHOTS.split[0]} />
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

        {/* ---------- 时差 ---------- */}
        {inShot(f, SHOTS.itd) && (
          <>
            <TacBg />
            <ItdDemo f={f} at={SHOTS.itd[0]} />
          </>
        )}
        {inShot(f, SHOTS.scale) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 180, top: 230, fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: T.gray}}>两只耳朵的时间差（1 毫秒 = 1000 微秒）</div>
            <div style={{position: 'absolute', left: 120, top: 320}}>
              <MsBars
                f={f}
                at={fbt(44)}
                max={1000}
                w={860}
                labelW={420}
                unit="μs"
                rows={[
                  ['最大时间差（声音在正侧面）', ITD_MAX_US, T.orange],
                  ...(f >= fbt(48) - 4 ? ([['大脑能分辨的最小差别', ITD_JND_US, T.cyan]] as [string, number, string][]) : []),
                ]}
              />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim, lineHeight: 1.7}}>
              最大时间差：球形人头模型，半径 {HEAD_R_CM} cm、声速 {SOUND_V} m/s，低频极限 · Hartmann &amp; Macaulay 2014
              <br />
              最小可察觉：约 10 微秒 · Carlini 等《Auditory localization: a comprehensive practical review》2024
            </div>
          </>
        )}
        {inShot(f, SHOTS.mirror) && (
          <>
            <TacBg />
            <MirrorMap f={f} at={SHOTS.mirror[0]} realLabel="右前方的声音" ghostLabel="右后方的声音" glowAxis={easeInOut(clamp01((f - fbt(60)) / 10))} />
          </>
        )}

        {/* ---------- 对称 ---------- */}
        {inShot(f, SHOTS.cone) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="对称" sub="CONE OF CONFUSION" />
            ) : f < fb(19) ? (
              <MirrorMap f={f} at={fb(17)} realLabel="右前方的他" ghostLabel="右后方的镜像点" dist glowAxis={1} />
            ) : (
              <HearCanvas>
                <ConeOfConfusion f={f} at={fb(19)} cx={500} cy={460} len={900} half={0.36} />
                <HeadTop x={500} y={460} r={70} yaw={-Math.PI / 2} label={false} />
                <text x={500} y={590} textAnchor="middle" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
                  你
                </text>
                <text x={120} y={200} fontFamily={TF.sans} fontSize={30} fill={T.orange} opacity={clamp01((f - fb(19) - 30) / 10)}>
                  锥面上任何一点：两耳的时间差都一样
                </text>
              </HearCanvas>
            )}
          </>
        )}
        {inShot(f, SHOTS.guess) && (
          <>
            <TacBg />
            <GuessMap f={f} at={SHOTS.guess[0]} />
          </>
        )}

        {/* ---------- 耳廓 ---------- */}
        {inShot(f, SHOTS.pinna) && (
          <>
            <TacBg />
            {f < fb(25) ? <ChapterCard f={f} at={fb(24)} n={3} title="耳廓" sub="HRTF · YOUR OUTER EAR" /> : <PinnaScene f={f} at={fb(26)} hrtfAt={fbt(112)} />}
          </>
        )}
        {inShot(f, SHOTS.riot) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.riot[0]} label={`RIOT GAMES · 补丁说明 ${RIOT_PATCH} · 2021`} quote={`“${RIOT_PROFILE}.”`} cite="—— 《VALORANT Patch Notes 2.06》HRTF 一节" note="大意：这套 HRTF 用的是一套测量数据，一开始不一定每个人听着都自然" size={46} />
          </>
        )}
        {inShot(f, SHOTS.wenzel) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.wenzel[0]} label={`NASA AMES · WENZEL 等 · JASA ${WENZEL_YEAR}`} quote="用别人的 HRTF 听：前后、上下混淆显著增加" serif={false} size={56} cite="《Localization using nonindividualized head-related transfer functions》" note="16 名没有经验的听者 · 宽带噪声 · 真实扬声器 vs 耳机虚拟声源" />
          </>
        )}

        {/* ---------- 转头 ---------- */}
        {inShot(f, SHOTS.turn) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="转头" sub="TURN YOUR HEAD" />
            ) : (
              <>
                <TurnDemo f={f} at={fb(33)} turnAt={fbt(140)} />
                <div style={{position: 'absolute', left: 120, top: 170, fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: T.gray}}>WALLACH · 1940 · 转头假设</div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.study) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.study[0]} label={`WIGHTMAN & KISTLER · JASA ${WK_YEAR}`} quote={`“${WK_QUOTE}”`} cite="—— 《Resolution of front–back ambiguity in spatial hearing by listener and source movement》" note="限制转头 → 前后混淆多；鼓励转头 → 几乎消失（真实与虚拟声源都测了）" size={42} />
          </>
        )}
        {inShot(f, SHOTS.turnline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.turnline[0]} text={TURN_LINE} size={104} y={460} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WHAT YOU CAN DO" />
            ) : (
              <StepGrid f={f} ats={[fbt(164), fbt(168), fbt(172), fbt(176)]} titles={['先甩一下视角', '往中间跑 = 在前', '开 HRTF', '自定义房间练耳']} colors={[T.cyan, T.orange, T.green, T.red]} icons={STEP_ICONS} />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <YouView f={ff} yaw={0.45 * easeInOut(clamp01((ff - fbt(183)) / 10)) - 0.45 * easeInOut(clamp01((ff - fbt(185)) / 10))} />
            <StepPulse f={ff} beats={[180, 181, 182]} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.4)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：对称 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="骗你的是" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.geometry) && (
          <>
            <TacBg tone="warm" />
            <MirrorMap f={f} at={SHOTS.geometry[0]} warm yaw={0.5 * easeInOut(clamp01((f - fbt(208)) / 20))} ghostFade={1 - clamp01((f - fbt(209)) / 16)} realLabel="声音" ghostLabel="镜像" />
          </>
        )}
        {inShot(f, SHOTS.hold) && <HoldRange f={f} flickAt={fbt(218)} shotAt={fbt(220)} />}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={100} y={460} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={88} y={430} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 34, color: T.cyan, opacity: clamp01((f - SHOTS.ask[0] - 40) / 12)}}>评论区聊聊 ↓</div>
          </>
        )}
        {inShot(f, SHOTS.next) && (
          <>
            <TacBg />
            <TitleCard f={f} at={SHOTS.next[0]} label={`下期 · ${SERIES} · EP.03`} title={NEXT_TITLE} tag="视野盲区" />
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
          hp={rangeShot ? hp : undefined}
          ammo={rangeShot ? [inShot(f, SHOTS.hold) && f > fbt(220) ? 24 : 25, 75] : undefined}
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
