import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HudFrame, SlowMo, SourceCard, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {T, TF} from '../../library/tactical/theme';
import {ChainFlow, CompareRows, Duel, FocusSplit, HeadNotHand, PressureCards, STEP_ICONS, StepsVsFlow} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BAUM_EXPERIMENTS,
  BEILOCK_PROC,
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
  FOCUS_LINE,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  MISS_BEATS,
  QUESTION_LINE,
  REPLAY,
  SERIES,
  SFX,
  SHOTS,
  SPLIT,
  TERM2,
  TITLE,
  TOPIC,
  WULF_QUOTE,
} from './timeline';

/**
 * ep35 一到残局，手就开始抖？（战术屏科普风，无口播）
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

const MISSES = MISS_BEATS.map((b) => fbt(b));
/** 开场抖动：从第 0 拍的 6 像素抖到第 3 拍的 30 像素 */
const hookAmp = (f: number) => 6 + 24 * easeInOut(clamp01(f / fbt(3)));

/** 左上角模式标：自动驾驶 ON（青）/ 手动 MANUAL（红） */
const ModeTag: React.FC<{auto: boolean}> = ({auto}) => (
  <div style={{position: 'absolute', left: 110, top: 160, padding: '6px 18px', border: `2px solid ${auto ? T.cyan : T.red}`, background: 'rgba(5,11,20,0.6)', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: auto ? T.cyan : T.red}}>{auto ? '自动驾驶 · ON' : '手动 · MANUAL'}</div>
);

export const Ep35Choke: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.auto) || inShot(f, SHOTS.manual) || inShot(f, SHOTS.build) || inShot(f, SHOTS.calm) || inShot(f, SHOTS.win);
  const hp = inShot(f, SHOTS.death) ? 0 : 100;
  const s = 1 + punch(f);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep35-choke/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <Duel f={f} amp={hookAmp(f)} misses={MISSES} />}
        {inShot(f, SHOTS.death) && (
          <>
            <Duel f={DEATH} amp={30} tone="red" gun={false} />
            <DeathScreen f={f} at={DEATH} cx={960} cy={470} label="残局输了" />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <Duel f={MISSES[0] - 12 + (f - REPLAY) * 0.3} amp={30} tone="red" misses={[]} tag={false} />
            <div style={{position: 'absolute', left: 110, top: 160, display: 'flex', alignItems: 'center', gap: 14, padding: '6px 18px', border: `2px solid ${T.red}`, background: 'rgba(40,8,14,0.6)', fontFamily: TF.sans, fontSize: 30, color: T.red}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: T.red, opacity: Math.floor(f / 10) % 2 ? 0.3 : 1}} />
              回放 · 你的屏幕
            </div>
            <SlowMo f={f} x={110} y={230} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={110} y={170} w={830} h={560} color={T.cyan} title="平时" sub="一枪的事">
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <Duel f={f} amp={2} hitAt={SPLIT + 10} tag={false} />
              </div>
            </SplitPanel>
            <SplitPanel x={980} y={170} w={830} h={560} color={T.red} title="残局" sub="三枪全空">
              <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
                <Duel f={f} amp={30} misses={[SPLIT + 6, SPLIT + 14, SPLIT + 22]} tag={false} tone="red" />
              </div>
            </SplitPanel>
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

        {/* ---------- 自动驾驶 ---------- */}
        {inShot(f, SHOTS.steps1) && (
          <>
            <TacBg />
            <StepsVsFlow f={f} ats={[fbt(40), fbt(41), fbt(42), fbt(43)]} flowAt={fbt(44)} />
          </>
        )}
        {inShot(f, SHOTS.golf) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.golf[0]} label="BEILOCK & CARR · J EXP PSYCHOL GEN · 2001" quote={`“${BEILOCK_PROC}.”`} cite="—— 《On the fragility of skilled performance》" note="大意：高手的推杆存成了「程序」，不用一步一步盯着也能做好" size={42} />
          </>
        )}
        {inShot(f, SHOTS.auto) && (
          <>
            <Duel f={f} amp={2} hitAt={fbt(60)} tag={false} />
            <ModeTag auto />
          </>
        )}

        {/* ---------- 手动 ---------- */}
        {inShot(f, SHOTS.chain) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="手动" sub="CHOKING UNDER PRESSURE" />
            ) : (
              <>
                <ChainFlow f={f} labels={['压力', '盯着自己怎么做', '自动驾驶被打断', '动作变形']} lit={[fbt(76), fbt(76) + 10, fbt(80), fbt(80) + 10]} colors={[T.orange, T.orange, T.red, T.red]} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim, opacity: clamp01((f - fbt(72)) / 8)}}>Baumeister 1984 的模型：压力让人有意识地关注自己的动作过程，打断了练熟的自动执行</div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.pressure) && (
          <>
            <TacBg />
            <PressureCards f={f} ats={[fbt(84), fbt(85), fbt(86)]} numAt={fbt(88)} n={BAUM_EXPERIMENTS} />
          </>
        )}
        {inShot(f, SHOTS.manual) && (
          <>
            <Duel f={f} amp={30} tone="red" tag={false} />
            <ModeTag auto={false} />
          </>
        )}

        {/* ---------- 实验 ---------- */}
        {inShot(f, SHOTS.exp) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="实验" sub="BEILOCK & CARR 2001" />
            ) : (
              <CompareRows
                f={f}
                title="同样加压力：哪种任务会失常？"
                rows={[
                  {label: '高尔夫推杆', sub: '练熟的动作', drop: true, at: fbt(104), result: '压力下变差'},
                  {label: '字母算术', sub: '要一步步算的题', drop: false, at: fbt(108), result: '压力下没变差'},
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.train) && (
          <>
            <TacBg />
            <CompareRows
              f={f}
              title="两种练法，到了压力下还会不会失常？"
              rows={[
                {label: '边干别的边练', sub: '双任务训练', drop: true, at: fbt(116), result: '照样失常'},
                {label: '被盯着练', sub: '自我意识训练', drop: false, at: fbt(120), result: '失常消失了'},
              ]}
            />
          </>
        )}

        {/* ---------- 焦点 ---------- */}
        {inShot(f, SHOTS.focus) && (
          <>
            <TacBg />
            {f < fb(33) ? <ChapterCard f={f} at={fb(32)} n={4} title="焦点" sub="EXTERNAL FOCUS" /> : <FocusSplit f={f} />}
          </>
        )}
        {inShot(f, SHOTS.wulf) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.wulf[0]} label="WULF · INT REV SPORT EXERC PSYCHOL · 2013" quote={`“${WULF_QUOTE}.”`} cite="—— 《Attentional focus and motor learning: a review of 15 years》" note="大意：把注意力放在动作的效果上，比放在身体上表现更好" size={42} />
          </>
        )}
        {inShot(f, SHOTS.head) && <HeadNotHand f={f} at={SHOTS.head[0]} />}
        {inShot(f, SHOTS.focusline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.focusline[0]} text={FOCUS_LINE} size={110} y={460} />
          </>
        )}

        {/* ---------- 怎么办（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="WHAT YOU CAN DO" />
            ) : (
              <StepGrid f={f} ats={[fbt(164), fbt(168), fbt(172), fbt(176)]} titles={['只盯对手的头', '练枪给自己加压', '用最熟的那一套', '只想下一个动作']} colors={[T.orange, T.red, T.cyan, T.green]} icons={STEP_ICONS} />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <Duel f={ff} amp={4 + 22 * clamp01((ff - SHOTS.build[0]) / 120)} tag />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：自动驾驶 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="残局里，你亲手关掉了" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.calm) && (
          <>
            <Duel f={f} amp={22 - 20 * easeInOut(clamp01((f - fbt(204)) / 50))} tone="warm" />
            {f >= fbt(208) && <ModeTag auto />}
          </>
        )}
        {inShot(f, SHOTS.win) && <Duel f={f} amp={2} hitAt={fbt(220)} tone="warm" />}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={96} y={460} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={100} y={430} />
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
          ammo={rangeShot ? [inShot(f, SHOTS.hook) ? 25 - MISSES.filter((m) => f >= m).length : 25, 75] : undefined}
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
