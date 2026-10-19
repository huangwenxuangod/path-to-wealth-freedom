import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HudFrame, SlowMo, SplitPanel, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {MsBars} from '../../library/tactical/charts';
import {T, TF} from '../../library/tactical/theme';
import {CornerMap, EnemyView, enemySeesX, HoldRange, hookX, KillCamTag, Lanes, LeadDemo, MsRuler, SignalPath, StepGrid, WinFlip, YouView} from './scenes';
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
  HUMAN_RT,
  PEEK_128,
  PEEK_144,
  PEEK_BASE,
  SERIES,
  SFX,
  SHOTS,
  SKILL_LINE,
  SPLIT,
  TERM2,
  TOPIC,
} from './timeline';

/**
 * ep25 躲进掩体，为什么还被打死？（战术屏科普风，无口播）
 * 镜头全部硬切、卡在拍子上；重拍之后每个小节的第一拍画面轻轻一顶（回落段减半），音效对准重拍。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

/** 小节冲击：每个小节第一拍放大 1.2%，7 帧回落；重拍前不顶，回落段（40–47 小节）减半 */
const punch = (f: number) => {
  if (f < HIT) return 0;
  const k = Math.floor((f / FPS - (17.45 - 8 * BAR)) / BAR);
  const t = f - fb(k);
  // 两个爆点那一下顶得更狠（4%，10 帧回落）
  if (f >= HIT && f < HIT + 10) return 0.04 * (1 - (f - HIT) / 10);
  if (f >= HIT2 && f < HIT2 + 10) return 0.04 * (1 - (f - HIT2) / 10);
  const amp = k >= 40 && k < 48 ? 0.006 : 0.012;
  return t >= 0 && t < 7 ? amp * (1 - t / 7) : 0;
};

export const Ep25Cover: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2) && !inShot(f, SHOTS.next);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.lead) || inShot(f, SHOTS.cost) || inShot(f, SHOTS.hold);
  const hp = inShot(f, SHOTS.death) ? 0 : 100;
  const s = 1 + punch(f);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep25-behind-cover/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <YouView f={f} x={hookX(f)} />
          </>
        )}
        {inShot(f, SHOTS.death) && (
          <>
            <YouView f={DEATH} x={hookX(DEATH)} gun={false} />
            <DeathScreen f={f} at={DEATH} cx={1010} cy={420} label="你被击杀了" />
          </>
        )}
        {inShot(f, SHOTS.killcam) && (
          <>
            <EnemyView f={f} youX={enemySeesX(DEATH - 6)} tone="red" shot={SHOTS.killcam[0] + 8} />
            <KillCamTag f={f} />
            <SlowMo f={f} x={110} y={230} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={110} y={170} w={830} h={560} color={T.cyan} title="你的屏幕" sub="已经躲进去了">
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <YouView f={SPLIT} x={-0.7} gun={false} />
              </div>
            </SplitPanel>
            <SplitPanel x={980} y={170} w={830} h={560} color={T.red} title="他的屏幕" sub="你还站在外面" active={0.6 + 0.4 * Math.sin(f / 6)}>
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <EnemyView f={f} youX={1.1} />
              </div>
            </SplitPanel>
            <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 30, color: T.gray, letterSpacing: 4}}>同一个瞬间</div>
          </>
        )}
        {inShot(f, SHOTS.question) && (
          <>
            <TacBg />
            <BigWord f={ff} at={SHOTS.question[0]} text={'谁的屏幕，\n才是〔真的〕？'} size={110} y={430} />
          </>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <TacBg />
            <TitleCard f={f} at={HIT} label={`${SERIES} · ${EP}`} title="躲进掩体，还被打死？" tag={TOPIC} per={1} />
            {/* 重拍白闪 */}
            <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(220,240,250,0.85), rgba(66,198,223,0.25) 45%, rgba(0,0,0,0) 75%)', opacity: 1 - clamp01((f - HIT) / 10), pointerEvents: 'none'}} />
          </>
        )}

        {/* ---------- 时差 ---------- */}
        {inShot(f, SHOTS.signal) && (
          <>
            <TacBg />
            <SignalPath f={f} at={SHOTS.signal[0]} />
          </>
        )}
        {inShot(f, SHOTS.lanes) && (
          <>
            <TacBg />
            <Lanes f={f} at={SHOTS.lanes[0] + 4} />
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 260, right: 260, top: 300, textAlign: 'center', opacity: clamp01((f - SHOTS.quote[0]) / 10)}}>
              <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: T.cyan}}>RIOT GAMES · 技术博客 · 2020</div>
              <div style={{marginTop: 34, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 52, lineHeight: 1.4, color: T.white}}>“In real-time networked games, the world you see is always slightly out of date.”</div>
              <div style={{marginTop: 30, fontFamily: TF.sans, fontSize: 26, color: T.gray}}>—— 《Peeking into VALORANT's Netcode》</div>
            </div>
          </>
        )}

        {/* ---------- 回溯 ---------- */}
        {inShot(f, SHOTS.rewind) && (
          <>
            <TacBg />
            {f < fb(17) ? <ChapterCard f={f} at={fb(16)} n={2} title="回溯" sub="REWIND" /> : <Lanes f={f} at={0} settled rewindAt={fb(17)} />}
          </>
        )}
        {inShot(f, SHOTS.verdict) && (
          <>
            <TacBg tone="red" />
            <Lanes f={f} at={0} settled rewindAt={fb(17) - 200} verdictAt={fb(20)} />
          </>
        )}
        {inShot(f, SHOTS.lead) && <LeadDemo f={f} at={SHOTS.lead[0]} />}

        {/* ---------- 先手 ---------- */}
        {inShot(f, SHOTS.corner) && (
          <>
            <TacBg />
            {f < fb(25) ? <ChapterCard f={f} at={fb(24)} n={3} title="先手" sub="PEEKER'S ADVANTAGE" /> : <CornerMap f={f} at={fb(25)} />}
          </>
        )}
        {inShot(f, SHOTS.ms) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 120, top: 280}}>
              <MsBars
                f={f}
                at={fb(27)}
                max={320}
                w={820}
                labelW={380}
                rows={[
                  ['基础估算', PEEK_BASE, T.red],
                  ['128 tick · 35ms · 60 帧', PEEK_128, T.orange],
                  ['再换 144 帧', PEEK_144, T.cyan],
                  ...(f >= fbt(120) ? ([['人的反应（常见）', HUMAN_RT, T.gray]] as [string, number, string][]) : []),
                ]}
              />
            </div>
            <div style={{position: 'absolute', left: 180, top: 200, fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: T.gray}}>拉出去的人，比架点的人多出的反应时间</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>数据：Riot Games《Peeking into VALORANT's Netcode》（2020）中的估算</div>
          </>
        )}

        {/* ---------- 毫秒 ---------- */}
        {inShot(f, SHOTS.blind) && (
          <>
            <TacBg />
            {f < fb(33) ? <ChapterCard f={f} at={fb(32)} n={4} title="毫秒" sub="EVERY MS COUNTS" /> : <MsRuler f={f} at={fb(33)} />}
          </>
        )}
        {inShot(f, SHOTS.flip) && (
          <>
            <TacBg />
            <WinFlip f={f} at={SHOTS.flip[0]} flipAt={fbt(144)} />
          </>
        )}
        {inShot(f, SHOTS.skill) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.skill[0]} text={SKILL_LINE} size={120} y={470} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WHAT YOU CAN DO" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['要躲就早躲', '插网线、选低延迟', '帧数拉高', '要打就果断出']}
                colors={[T.red, T.orange, T.cyan, T.green]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <YouView f={ff} x={-0.7 + 0.1 * Math.sin(ff / 30)} tone="blue" gun />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.45)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：过去 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="你死在他的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.cost) && <YouView f={f} x={0.35 + 0.25 * Math.sin((f - SHOTS.cost[0]) / 60)} tone="warm" />}
        {inShot(f, SHOTS.hold) && <HoldRange f={f} shotAt={fbt(218)} />}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={96} y={460} />
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
            <TitleCard f={f} at={SHOTS.next[0]} label={`下期 · ${SERIES} · EP.02`} title="脚步声在哪儿？" tag="听声辨位" />
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
          ammo={rangeShot ? [inShot(f, SHOTS.hold) && f > fbt(218) ? 24 : 25, 75] : undefined}
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
