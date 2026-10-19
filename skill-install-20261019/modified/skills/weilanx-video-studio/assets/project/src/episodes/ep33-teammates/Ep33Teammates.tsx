import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HudFrame, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {ResultCard, TeamRow} from '../../library/tactical/ranked';
import {glowF, T, TF} from '../../library/tactical/theme';
import {BlameArrows, BothTeams, DiceTeam, FiveGames, HalfHalf, HookRange, OddsBar, Scoreboard, SmurfRow, Spectate, SpreadDots, STEP_ICONS, SteadyShot, TenGames, TurnYou} from './scenes';
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
  HIT,
  HIT2,
  LOSS,
  META_D,
  META_QUOTE,
  META_STUDIES,
  QUESTION_LINE,
  REAL_LINE,
  RIOT_FAIR,
  SERIES,
  SFX,
  SHOTS,
  SPLIT,
  TERM2,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep33 为什么总匹配到坑队友？（战术屏科普风，无口播）
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

export const Ep33Teammates: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.win);
  const hp = inShot(f, SHOTS.death) ? 0 : 100;
  const s = 1 + punch(f);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep33-teammates/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <HookRange f={f} />}
        {inShot(f, SHOTS.death) && (
          <>
            <HookRange f={DEATH} tone="red" frozen />
            <DeathScreen f={f} at={DEATH} cx={960} cy={470} label="一打三" />
          </>
        )}
        {inShot(f, SHOTS.loss) && (
          <>
            <TacBg tone="red" />
            <ResultCard f={f} at={LOSS} win={false} y={200} />
            <Scoreboard f={f} at={LOSS} />
          </>
        )}
        {inShot(f, SHOTS.games) && (
          <>
            <TacBg />
            <FiveGames f={f} at={SPLIT} />
          </>
        )}
        {inShot(f, SHOTS.question) && (
          <>
            <TacBg />
            <BigWord f={ff} at={SHOTS.question[0]} text={QUESTION_LINE} size={104} y={430} />
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

        {/* ---------- 五分之四 ---------- */}
        {inShot(f, SHOTS.dice) && (
          <>
            <TacBg />
            <DiceTeam f={f} at={SHOTS.dice[0]} stopAt={fbt(40)} stop={4} />
          </>
        )}
        {inShot(f, SHOTS.odds) && (
          <>
            <TacBg />
            <OddsBar f={f} at={SHOTS.odds[0]} />
          </>
        )}
        {inShot(f, SHOTS.ten) && (
          <>
            <TacBg />
            <TenGames f={f} at={SHOTS.ten[0]} youAt={fbt(56)} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: T.gray}}>十局示意 · 八局最差的是队友，两局是你</div>
          </>
        )}

        {/* ---------- 视角 ---------- */}
        {inShot(f, SHOTS.both) && (
          <>
            <TacBg />
            {f < fb(17) ? <ChapterCard f={f} at={fb(16)} n={2} title="视角" sub="WHAT YOU SEE" /> : <BothTeams f={f} at={fb(17)} enemyLit={f >= fbt(68) && f < fbt(76) ? 1 : 0} />}
          </>
        )}
        {inShot(f, SHOTS.spectate) && <Spectate f={f} shots={[fbt(80) + 6, fbt(81) + 6]} />}
        {inShot(f, SHOTS.half) && (
          <>
            <TacBg />
            {f < fbt(92) ? <BothTeams f={f} at={SHOTS.half[0]} /> : <HalfHalf f={f} at={fbt(92)} />}
          </>
        )}

        {/* ---------- 归因 ---------- */}
        {inShot(f, SHOTS.blame) && (
          <>
            <TacBg />
            {f < fb(25) ? <ChapterCard f={f} at={fb(24)} n={3} title="归因" sub="SELF-SERVING BIAS" /> : <BlameArrows f={f} at={fb(25)} />}
          </>
        )}
        {inShot(f, SHOTS.meta) && (
          <>
            <TacBg />
            {f < fbt(108) ? (
              <BlameArrows f={f} at={0} />
            ) : (
              <>
                <SourceCard f={f} at={fbt(108)} label="MEZULIS 等 · PSYCHOLOGICAL BULLETIN · 2004" quote={`“${META_QUOTE}”`} cite="—— 《Is there a universal positivity bias in attributions?》" note="大意：几乎每一组样本里，都有自利归因偏差" />
                <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 140, opacity: clamp01((f - fbt(112)) / 8)}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 84, color: T.orange, filter: glowF(T.orange, 8)}}>{META_STUDIES}</div>
                    <div style={{fontFamily: TF.sans, fontSize: 24, color: T.gray}}>项研究</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 84, color: T.red, filter: glowF(T.red, 8)}}>d = {META_D}</div>
                    <div style={{fontFamily: TF.sans, fontSize: 24, color: T.gray}}>平均效应量（很大）</div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.default) && (
          <>
            <TacBg />
            <BlameArrows f={f} at={SHOTS.default[0] - 40} />
            <AbsoluteFill style={{background: `rgba(5,11,20,${0.5 * clamp01((f - fbt(124)) / 10)})`}} />
          </>
        )}

        {/* ---------- 真相 ---------- */}
        {inShot(f, SHOTS.smurf) && (
          <>
            <TacBg />
            {f < fb(33) ? <ChapterCard f={f} at={fb(32)} n={4} title="真相" sub="SOMETIMES IT IS REAL" /> : f < fb(34) ? <BothTeams f={f} at={fb(33)} /> : <SmurfRow f={f} at={fb(34)} />}
          </>
        )}
        {inShot(f, SHOTS.spread) && (
          <>
            <TacBg />
            <SpreadDots f={f} at={SHOTS.spread[0]} wideAt={fbt(140) + 10} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', opacity: clamp01((f - fbt(144)) / 8)}}>
              <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 30, color: T.white}}>“Lower queue times can typically mean that the spread of ranks … can be bigger”</div>
              <div style={{marginTop: 8, fontFamily: TF.sans, fontSize: 20, color: T.gray}}>—— Riot 英雄联盟首席玩法设计师 Phroxzon，2025 年开发者视频（据 Esports Insider）</div>
            </div>
          </>
        )}
        {inShot(f, SHOTS.riot) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.riot[0]} label="RIOT GAMES · 竞技模式说明 · 2020" quote={`“…${RIOT_FAIR}.”`} cite="—— 《VALORANT Ranks and Competitive Matchmaking》" note="大意：让你大多数对局里，你和队友都在一场公平的对决里" size={44} />
          </>
        )}
        {inShot(f, SHOTS.real) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.real[0]} text={REAL_LINE} size={104} y={460} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WHAT YOU CAN DO" />
            ) : (
              <StepGrid f={f} ats={[fbt(164), fbt(168), fbt(172), fbt(176)]} titles={['先看自己失误', '我哪步能更好', '少在语音骂人', '先把自己练稳']} colors={[T.cyan, T.orange, T.green, T.red]} icons={STEP_ICONS} />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <TacBg />
            <svg width={1920} height={1080} style={{position: 'absolute'}}>
              <TeamRow x={960} y={520} size={1.4} />
            </svg>
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.3)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：坑队友 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="你骂过的人，也在骂他的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.turn) && (
          <>
            <TacBg tone="warm" />
            <TurnYou f={f} at={SHOTS.turn[0]} youAt={fbt(204)} />
          </>
        )}
        {inShot(f, SHOTS.win) && <SteadyShot f={f} shotAt={fbt(220)} />}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={100} y={460} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={96} y={430} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 34, color: T.cyan, opacity: clamp01((f - SHOTS.ask[0] - 40) / 12)}}>评论区聊聊 ↓</div>
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
