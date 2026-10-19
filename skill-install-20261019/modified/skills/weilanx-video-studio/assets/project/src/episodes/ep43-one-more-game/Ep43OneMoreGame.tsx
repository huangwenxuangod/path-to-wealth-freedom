import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HookBanner, HudFrame, SourceCard, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {BrainGlow, LobbyButton, ScoreLine, SlotReels} from '../../library/tactical/reward';
import {glowF, T, TF} from '../../library/tactical/theme';
import {ClutchView, Clock, ControlCards, FeelBars, OutcomeStrip, RateBars, TwoArrows} from './scenes';
import {
  AGAIN,
  ANCHOR,
  ASK_LINE,
  BAR,
  BIG_LINE,
  chapterAt,
  CHAPTERS,
  CLARK_N_FMRI,
  CLARK_QUOTE,
  CLICK_AT,
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
  HIT,
  HIT2,
  HOOK_LINE,
  KS_BEST,
  KS_N,
  KS_RATES,
  OUTCOMES,
  QUESTION_LINE,
  REEL_ICONS,
  SCORE,
  SCORE_THEM,
  SCORE_US,
  SERIES,
  SFX,
  SHOTS,
  TERM2,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep43 输了还想再来一把？（战术屏科普风，无口播）
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

/** 第 1 章三次转动：赢 / 差一点 / 差很远，每次转约 2 拍 */
const SPINS: [number, number, number][] = [
  [fbt(36) + 2, fbt(38), 0],
  [fbt(40), fbt(42), 1],
  [fbt(44), fbt(46), 3],
];
const PEEK_AT = fbt(5);
const BREAK_AWAY = fbt(216);

export const Ep43OneMoreGame: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death);
  const s = 1 + punch(f);
  const spin = SPINS.filter(([a]) => f >= a).pop() ?? SPINS[0];
  const breakFill = clamp01((f - BREAK_AWAY) / (SHOTS.breaktime[1] - BREAK_AWAY));

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep43-one-more-game/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <ClutchView f={f} peekAt={PEEK_AT} />}
        {inShot(f, SHOTS.death) && (
          <>
            <ClutchView f={DEATH} peekAt={PEEK_AT} dead />
            <DeathScreen f={f} at={DEATH} />
          </>
        )}
        {inShot(f, SHOTS.score) && (
          <>
            <TacBg tone="red" />
            <ScoreLine f={f} at={SCORE} us={SCORE_US} them={SCORE_THEM} y={500} />
          </>
        )}
        {inShot(f, SHOTS.again) && (
          <>
            <TacBg />
            <Clock text="02:13" />
            {label('对局结束 · 12 : 13', 330, T.red)}
            <LobbyButton f={f} y={560} moveAt={AGAIN + 4} clickAt={CLICK_AT} />
          </>
        )}
        {inShot(f, SHOTS.question) && (
          <>
            <TacBg />
            <BigWord f={ff} at={SHOTS.question[0]} text={QUESTION_LINE} size={108} y={440} />
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

        {/* ---------- 差一点 ---------- */}
        {inShot(f, SHOTS.slot) && (
          <>
            <TacBg />
            <SlotReels f={f} x={860} y={500} cell={150} pick={0} spinAt={spin[0]} stopAt={spin[1]} off={spin[2]} />
            {label(`原创示意 · 两个转轮、每轮 ${REEL_ICONS} 个图案 · 仿 Clark 等 2009 的实验`, 180, T.dim)}
          </>
        )}
        {inShot(f, SHOTS.odds) && (
          <>
            <TacBg />
            <OutcomeStrip f={f} at={SHOTS.odds[0]} outcomes={OUTCOMES} />
          </>
        )}
        {inShot(f, SHOTS.feel) && (
          <>
            <TacBg />
            <FeelBars f={f} atL={fbt(56)} atR={fbt(60)} />
          </>
        )}

        {/* ---------- 大脑 ---------- */}
        {inShot(f, SHOTS.brain) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="大脑" sub="REWARD CIRCUITRY" />
            ) : (
              <>
                {label(`fMRI · ${CLARK_N_FMRI} 人 · Clark 等 2009 · 奖赏回路（纹状体、脑岛）位置为示意`, 180, T.dim)}
                <div style={{opacity: clamp01((f - fbt(68)) / 8)}}>
                  <BrainGlow x={400} y={470} size={320} lit={clamp01((f - fbt(72)) / 10)} color={T.orange} label="赢钱" sub="有奖励" />
                  <BrainGlow x={960} y={470} size={320} lit={clamp01((f - fbt(76)) / 10)} color={T.red} label="差一点" sub="0 奖励" />
                  <BrainGlow x={1520} y={470} size={320} lit={0} label="差很远" sub="0 奖励" />
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="CLARK ET AL. · NEURON · 2009" quote={`“${CLARK_QUOTE}.”`} cite="—— 差一点调动了奖赏回路，尽管实际上一分钱都没赢" size={40} />
          </>
        )}
        {inShot(f, SHOTS.boost) && (
          <>
            <TacBg />
            <TwoArrows f={f} at={fbt(88)} />
            {label('差一点之后', 200, T.gray)}
          </>
        )}

        {/* ---------- 掌控 ---------- */}
        {inShot(f, SHOTS.control) && (
          <>
            <TacBg />
            {f < fb(25) ? <ChapterCard f={f} at={fb(24)} n={3} title="掌控" sub="PERSONAL CONTROL" /> : <ControlCards f={f} atL={fbt(104)} atR={fbt(108)} />}
          </>
        )}
        {inShot(f, SHOTS.fps) && (
          <>
            <TacBg />
            <SplitPanel x={150} y={220} w={760} h={520} color={T.gray} title="老虎机" sub="全靠运气">
              <></>
            </SplitPanel>
            <SlotReels f={f} x={530} y={490} cell={90} pick={0} spinAt={SHOTS.fps[0]} stopAt={SHOTS.fps[0] + 20} off={1} />
            <SplitPanel x={1010} y={220} w={760} h={520} color={T.cyan} title="射击游戏" sub="每一枪都是你打的" active={clamp01((f - fbt(116)) / 6)}>
              <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.395)', transformOrigin: '0 0'}}>
                <ClutchView f={f} peekAt={fbt(116) - 30} />
              </div>
            </SplitPanel>
            {f >= fbt(120) && (
              <div style={{position: 'absolute', left: 1180, top: 400, padding: '6px 30px', border: `6px solid ${T.orange}`, transform: `rotate(-8deg) scale(${1.4 - 0.4 * clamp01((f - fbt(120)) / 6)})`, fontFamily: TF.sans, fontSize: 90, color: T.orange, filter: glowF(T.orange, 10), opacity: clamp01((f - fbt(120)) / 4)}}>
                差一点
              </div>
            )}
          </>
        )}

        {/* ---------- 频率 ---------- */}
        {inShot(f, SHOTS.freq) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="频率" sub="HOW OFTEN" />
            ) : (
              <>
                {label(`${KS_N} 名大学生 · 4 个转轮的老虎机 · Kassinove & Schare 2001`, 170, T.dim)}
                <RateBars f={f} at={fbt(136)} rates={KS_RATES} best={KS_BEST} bestAt={fbt(140)} />
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.close) && (
          <>
            <TacBg />
            <ScoreLine f={f} at={SHOTS.close[0]} us={SCORE_US} them={SCORE_THEM} y={480} label="势均力敌" per={0} />
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="SET A STOP" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['先定打几把', '连输两把就停', '差一点也算输', '停五分钟再开']}
                colors={[T.cyan, T.red, T.orange, T.green]}
                icons={[
                  (c) => (
                    <>
                      {[0, 1, 2].map((k) => (
                        <rect key={k} x={40 + k * 60} y={50} width={44} height={50} rx={6} fill="none" stroke={c} strokeWidth={4} />
                      ))}
                      <path d="M220 40 V110" stroke={c} strokeWidth={6} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={40} y={50} width={50} height={50} rx={6} fill={c} opacity={0.8} />
                      <rect x={100} y={50} width={50} height={50} rx={6} fill={c} opacity={0.8} />
                      <path d="M170 75 H220 M200 55 L220 75 L200 95" fill="none" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => (
                    <>
                      <text x={120} y={95} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={56} fill={c}>
                        = 0
                      </text>
                    </>
                  ),
                  (c) => (
                    <>
                      <circle cx={120} cy={75} r={55} fill="none" stroke={c} strokeWidth={5} />
                      <path d="M120 75 V40 M120 75 L148 90" stroke={c} strokeWidth={5} />
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
            <LobbyButton f={ff} y={540} from={[1700, 1000]} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：差一点 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="让你停不下来的，是" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.outro) && (
          <>
            <TacBg tone="warm" />
            <ScoreLine f={f} at={SHOTS.outro[0] + 4} us={SCORE_US} them={SCORE_THEM} y={480} label="又是差一点" warm per={1} />
          </>
        )}
        {inShot(f, SHOTS.breaktime) && (
          <>
            <TacBg tone="warm" />
            <LobbyButton f={f} y={480} from={[1000, 520]} away={BREAK_AWAY} color="#ffb070" />
            <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 64, color: '#ffd9a8', opacity: clamp01((f - BREAK_AWAY) / 8), filter: glowF('#ffd9a8', 6)}}>
              休息 5 分钟
            </div>
            <div style={{position: 'absolute', left: 660, width: 600, top: 740, height: 12, background: 'rgba(255,217,168,0.15)', opacity: clamp01((f - BREAK_AWAY) / 8)}}>
              <div style={{width: `${breakFill * 100}%`, height: '100%', background: '#ffd9a8', boxShadow: '0 0 12px #ffd9a8'}} />
            </div>
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
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={96} y={430} />
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
          hp={rangeShot ? (f >= DEATH ? 0 : 23) : undefined}
          ammo={rangeShot ? [4, 25] : undefined}
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
