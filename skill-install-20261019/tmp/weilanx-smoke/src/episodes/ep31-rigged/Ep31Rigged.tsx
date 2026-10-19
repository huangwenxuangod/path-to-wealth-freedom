import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HudFrame, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {NeonLine} from '../../library/tactical/charts';
import {BalanceScale, CoinGrid, RankGap, RankLadder, ResultCard, StreakStrip} from '../../library/tactical/ranked';
import {glowF, T, TF} from '../../library/tactical/theme';
import {BadWeight, CONVERGE, LossView, NewRound, RankDrop, STEP_ICONS, WinStreak} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAD_QUOTE,
  BAD_YEAR,
  BAR,
  chapterAt,
  CHAPTERS,
  COINS,
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
  GAMES,
  HALF_BEATS,
  HIT,
  HIT2,
  LOSS2,
  MEMORY_LINE,
  NEXT_TITLE,
  OPEN_SEQ,
  P5,
  P6,
  QUESTION_LINE,
  RIOT_FIFTY,
  RIOT_NEVER,
  SERIES,
  SFX,
  SHOTS,
  SPLIT,
  TERM2,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep31 系统是不是故意让我输？（战术屏科普风，无口播）
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

/** 天梯上你的位置：第 44 拍赢一把上一格，第 46 拍再上一格，第 50 拍输一把掉回一格 */
const ladderClimb = (f: number) => easeInOut(clamp01((f - fbt(44)) / 8)) + easeInOut(clamp01((f - fbt(46)) / 8)) - easeInOut(clamp01((f - fbt(50)) / 8));

export const Ep31Rigged: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2) && !inShot(f, SHOTS.next);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.win);
  const hp = inShot(f, SHOTS.death) ? 0 : 100;
  const s = 1 + punch(f);
  const streakAts = [...OPEN_SEQ].map((_, i) => SPLIT + i * 4);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep31-rigged/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <WinStreak f={f} />}
        {inShot(f, SHOTS.death) && (
          <>
            <LossView />
            <DeathScreen f={f} at={DEATH} cx={960} cy={470} />
            <ResultCard f={f} at={DEATH + 4} win={false} y={300} />
          </>
        )}
        {inShot(f, SHOTS.loss2) && (
          <>
            <TacBg tone="red" />
            <ResultCard f={f} at={LOSS2} win={false} y={250} />
            <RankDrop f={f} at={LOSS2} />
          </>
        )}
        {inShot(f, SHOTS.streak) && (
          <>
            <TacBg />
            <StreakStrip f={f} seq={OPEN_SEQ} ats={streakAts} y={380} hot={[3, 8]} hotLabel="连跪 5 把" />
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

        {/* ---------- 天梯 ---------- */}
        {inShot(f, SHOTS.ladder) && (
          <>
            <TacBg />
            <RankLadder f={f} at={SHOTS.ladder[0]} climb={ladderClimb(f)} label="你" />
            <div style={{position: 'absolute', left: 120, top: 170, fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: T.gray}}>隐藏分 · 所有玩家排成的一架梯子</div>
          </>
        )}
        {inShot(f, SHOTS.gap) && (
          <>
            <TacBg />
            <RankGap f={f} at={SHOTS.gap[0]} gap={1} />
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="RIOT GAMES · ASK VALORANT · 2021" quote={`“${RIOT_NEVER}”`} cite="—— 《Ask VALORANT – Rank Rating Edition》" note="大意：你永远看不到隐藏分，它只用来凑公平的比赛" />
          </>
        )}

        {/* ---------- 公平 ---------- */}
        {inShot(f, SHOTS.balance) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="公平" sub="EVERY MATCH IS 50 / 50" />
            ) : (
              <>
                <BalanceScale f={f} at={fb(17)} tilt={0.06 * Math.sin((f - fb(17)) / 14) * (1 - clamp01((f - fb(17)) / 40))} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', opacity: clamp01((f - fbt(72)) / 8)}}>
                  <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 34, color: T.white}}>“…each team has an equal chance to win.”</div>
                  <div style={{marginTop: 8, fontFamily: TF.sans, fontSize: 20, color: T.gray}}>—— Riot 英雄联盟首席玩法设计师 Phroxzon，2025 年开发者视频（据 Esports Insider）</div>
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.converge) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 380, top: 230}}>
              <NeonLine f={f} at={SHOTS.converge[0] + 4} data={CONVERGE} w={1100} h={440} min={40} max={70} yLabel="你下一把的赢面" xLabel="连赢之后，一把接一把" dur={60} />
            </div>
            <div style={{position: 'absolute', left: 1490, top: 586, fontFamily: TF.mono, fontWeight: 700, fontSize: 40, color: T.orange, opacity: clamp01((f - fbt(84)) / 8), filter: glowF(T.orange, 6)}}>50%</div>
            <div style={{position: 'absolute', left: 380, top: 160, fontFamily: TF.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: T.gray}}>示意 · 隐藏分追上你的真实水平，对手变强，赢面回到一半</div>
          </>
        )}
        {inShot(f, SHOTS.quote2) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote2[0]} label="RIOT GAMES · ASK VALORANT · 2021" quote={`“${RIOT_FIFTY}”`} cite="—— 《Ask VALORANT – Rank Rating Edition》" note="大意：当你待在自己隐藏分的位置上，我们看到的胜率多半就是 50%" />
          </>
        )}

        {/* ---------- 连跪 ---------- */}
        {inShot(f, SHOTS.coin) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="连跪" sub="STREAKS ARE NORMAL" />
            ) : (
              <>
                <div style={{position: 'absolute', left: 360, top: 160, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: T.gray}}>每一局都是 50% · 连打 {GAMES} 把（青 = 赢，红 = 输）</div>
                <CoinGrid f={f} at={fbt(104)} seq={COINS} x={360} y={210} cell={54} per={0.6} hotAt={fbt(120)} />
                {f >= fbt(112) - 2 && (
                  <div style={{position: 'absolute', left: 120, top: 560}}>
                    <div style={{fontFamily: TF.sans, fontSize: 26, color: T.gray}}>至少一次 5 连跪</div>
                    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 96, color: T.orange, filter: glowF(T.orange, 10)}}>{P5}%</div>
                  </div>
                )}
                {f >= fbt(116) - 2 && (
                  <div style={{position: 'absolute', right: 120, top: 560, textAlign: 'right'}}>
                    <div style={{fontFamily: TF.sans, fontSize: 26, color: T.gray}}>至少一次 6 连跪</div>
                    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 96, color: T.red, filter: glowF(T.red, 10)}}>{P6}%</div>
                  </div>
                )}
                <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>概率按每局 50% 精确计算；网格是其中一次模拟，最长连跪已框出</div>
              </>
            )}
          </>
        )}

        {/* ---------- 记忆 ---------- */}
        {inShot(f, SHOTS.memory) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="记忆" sub="BAD IS STRONGER THAN GOOD" />
            ) : f < fb(34) ? (
              <>
                <StreakStrip f={f} seq="WWWLLLLL" ats={[0, 0, 0, 0, 0, 0, 0, 0]} y={380} />
                <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,11,20,0.82) 0%, rgba(5,11,20,0.82) 38%, rgba(5,11,20,0) 42%)'}} />
              </>
            ) : (
              <SourceCard f={f} at={fb(34)} label={`BAUMEISTER 等 · REVIEW OF GENERAL PSYCHOLOGY · ${BAD_YEAR}`} quote={`“${BAD_QUOTE}.”`} cite="—— 《Bad is Stronger than Good》" note="大意：坏情绪、坏反馈的影响，比好的更大" />
            )}
          </>
        )}
        {inShot(f, SHOTS.weight) && (
          <>
            <TacBg />
            <BadWeight f={f} at={SHOTS.weight[0]} />
          </>
        )}
        {inShot(f, SHOTS.memline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.memline[0]} text={MEMORY_LINE} size={110} y={460} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WHAT YOU CAN DO" />
            ) : (
              <StepGrid f={f} ats={[fbt(164), fbt(168), fbt(172), fbt(176)]} titles={['看 50 把胜率', '连跪三把就歇', '赢少输多看差距', '比同分段多赢']} colors={[T.cyan, T.orange, T.green, T.red]} icons={STEP_ICONS} />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <TacBg />
            <BalanceScale f={ff} at={SHOTS.build[0]} tilt={0.05 * Math.sin(ff / 16)} pct={false} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：公平 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="让你连跪的，恰恰是" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.flips) && (
          <>
            <TacBg tone="warm" />
            <BalanceScale f={f} at={SHOTS.flips[0]} tilt={-0.12 * easeInOut(clamp01((f - fbt(208)) / 24))} pct={false} leftColor={T.orange} rightColor="#b7a48c" />
          </>
        )}
        {inShot(f, SHOTS.win) && (
          <>
            <NewRound f={f} shotAt={fbt(220)} />
            <ResultCard f={f} at={fbt(220) + 10} win y={160} />
          </>
        )}
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
        {inShot(f, SHOTS.next) && (
          <>
            <TacBg />
            <TitleCard f={f} at={SHOTS.next[0]} label={`下期 · ${SERIES} · EP.04`} title={NEXT_TITLE} tag="视野盲区" />
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
