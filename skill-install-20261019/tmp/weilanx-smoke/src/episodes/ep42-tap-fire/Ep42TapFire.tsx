import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, HudFrame, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {AreaRatio, BloomRing, heatAt, HeatTrace, HitBars} from '../../library/tactical/spread';
import {glowF, T, TF} from '../../library/tactical/theme';
import {ProbCross, QuotePair, ShotChanceRow, SprayView} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BARS,
  BIG_LINE,
  chapterAt,
  CHAPTERS,
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
  HALF_BEATS,
  headDeg,
  HIT,
  HIT2,
  QUESTION_LINE,
  RADIUS_X,
  RIOT_ACCRUE,
  SERIES,
  SFX,
  SHOT,
  SHOTS,
  SPLIT,
  SPRAY_AT,
  SPRAY_EVERY,
  SPRAY_N,
  SPREAD_FIRST,
  SPREAD_LATE,
  TERM2,
  TITLE,
  TOPIC,
  VALVE_RT_QUOTE,
  VALVE_SS_QUOTE,
  VANDAL_RECOVERY,
} from './timeline';

/**
 * ep42 扫射压不住，点射更准？（战术屏科普风，无口播）
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

/** 恢复时间换成帧（Vandal 0.375 秒 ≈ 11 帧） */
const REC = Math.round(VANDAL_RECOVERY * FPS);
const SPRAY = Array.from({length: SPRAY_N}, (_, i) => SPRAY_AT + i * SPRAY_EVERY);
/** 回放 / 分屏里的那一梭子：同样 12 发、同样节奏，在镜头开始前就打完 */
const sprayBefore = (end: number) => SPRAY.map((s) => s - SPRAY_AT + end - SPRAY_EVERY * SPRAY_N);
/** 散布章：第 40 拍单发，第 44 拍起每 4 帧一发连开 6 发 */
const BLOOM_SHOTS = [fbt(40), ...Array.from({length: 6}, (_, i) => fbt(44) + i * 4)];
/** 恢复章（慢放 ×4）：第 53 拍一发，停够恢复时间后第 56 拍 +8 帧再一发 */
const SLOW = 4;
const REC_SHOTS = [fbt(53), fbt(56) + 8];
/** 扫射每一发的命中率（示意）：头 / 圈 的面积比，圈按热度变大 */
const TAIL = Array.from({length: 12}, (_, i) => {
  const shots = Array.from({length: 12}, (_, k) => k * SPRAY_EVERY);
  const r = 44 + 30 * heatAt(shots, shots[i] - 1e-6, REC);
  return Math.min(1, (40 / r) ** 2);
});
const TAP_AT = fbt(217);

export const Ep42TapFire: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.shot) || inShot(f, SHOTS.tapview);
  const s = 1 + punch(f);
  const rs = SHOTS.recover[0];

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep42-tap-fire/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {(inShot(f, SHOTS.hook) || inShot(f, SHOTS.shot)) && <SprayView f={f} shots={SPRAY} base={12} per={16} recover={REC} seed={3} hitText="MISS" hitAt={SHOT + 3} />}
        {inShot(f, SHOTS.replay) && (
          <>
            <TacBg />
            {label('● REC 回放 · 墙上的弹孔', 170, T.red)}
            <BloomRing f={f} shots={sprayBefore(SHOTS.replay[0])} x={960} y={470} base={44} per={30} recover={REC} seed={3} color={T.red} head={40} hitLabel />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <BloomRing f={f} shots={sprayBefore(SHOTS.split[0])} x={560} y={470} base={44} per={30} recover={REC} seed={3} color={T.red} head={40} hitLabel />
            <BloomRing f={f} shots={[SPLIT + 10, SPLIT + 22]} x={1360} y={470} base={18} per={30} recover={REC} seed={8} color={T.cyan} head={40} hitLabel />
            <div style={{position: 'absolute', left: 360, width: 400, top: 730, textAlign: 'center', fontFamily: TF.sans, fontSize: 36, color: T.red}}>你 · 一梭子 12 发</div>
            <div style={{position: 'absolute', left: 1160, width: 400, top: 730, textAlign: 'center', fontFamily: TF.sans, fontSize: 36, color: T.cyan}}>对面 · 点两下</div>
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

        {/* ---------- 散布 ---------- */}
        {inShot(f, SHOTS.bloom) && (
          <>
            <TacBg />
            <BloomRing f={f} shots={BLOOM_SHOTS} x={520} y={460} base={44} per={50} recover={REC} seed={12} color={T.cyan} />
            <div style={{position: 'absolute', left: 320, width: 400, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 30, color: T.cyan, opacity: clamp01((f - fb(9)) / 8)}}>散布圈</div>
            <HeatTrace f={f - fb(9)} shots={BLOOM_SHOTS.map((x) => x - fb(9))} recover={REC} tMax={fb(12) - fb(9)} x={980} y={280} w={720} h={360} hMax={4} label="圈的大小（示意）" />
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="RIOT GAMES · VALORANT PATCH NOTES 0.50 · 2020" quote={`“${RIOT_ACCRUE}”`} cite="—— 还没等「恢复时间」走完就再开枪，误差会累积" size={40} />
          </>
        )}
        {inShot(f, SHOTS.recover) && (
          <>
            <TacBg />
            <BloomRing f={f} shots={REC_SHOTS} x={520} y={440} base={44} per={70} recover={REC * SLOW} seed={4} color={T.cyan} />
            <HeatTrace
              f={f - rs}
              shots={REC_SHOTS.map((x) => x - rs)}
              recover={REC * SLOW}
              tMax={fb(16) - rs}
              x={980}
              y={280}
              w={720}
              h={360}
              hMax={2}
              label="圈的大小（示意 · 慢放 ×4）"
              recoverMark={{from: REC_SHOTS[0] - rs, label: `恢复时间 ${VANDAL_RECOVERY} s`, at: fbt(56)}}
            />
            {label('Riot 0.50（2020）：Vandal 恢复时间 0.4 → 0.375 秒', 180, T.dim)}
            {f >= fbt(60) && (
              <div style={{position: 'absolute', left: 320, width: 400, textAlign: 'center', top: 600, fontFamily: TF.sans, fontSize: 84, color: T.cyan, filter: glowF(T.cyan, 12), opacity: clamp01((f - fbt(60)) / 6)}}>停顿</div>
            )}
          </>
        )}

        {/* ---------- 面积 ---------- */}
        {inShot(f, SHOTS.area) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="面积" sub="HIT CHANCE = AREA" />
            ) : (
              <>
                <AreaRatio f={f} at={fbt(68)} x={960} y={500} head={53} from={80} to={80 * RADIUS_X} growAt={fbt(76)} label={f < fbt(76) ? '红 = 头　青 = 散布圈' : `圈的半径 ×${RADIUS_X}`} />
                {label('示意 · 子弹在圈里均匀分布、准星对准头中心：命中率 =（头 ÷ 圈）²', 150, T.dim)}
                {f >= fbt(80) && (
                  <div style={{position: 'absolute', left: 1440, top: 440, fontFamily: TF.mono, fontWeight: 700, fontSize: 84, color: T.orange, filter: glowF(T.orange, 10), opacity: clamp01((f - fbt(80)) / 6)}}>
                    ÷ {RADIUS_X * RADIUS_X}
                  </div>
                )}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.spraytail) && (
          <>
            <TacBg />
            <ShotChanceRow f={f} at={SHOTS.spraytail[0] + 2} chances={TAIL} per={3} />
          </>
        )}
        {inShot(f, SHOTS.valve) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.valve[0]} label="VALVE · CS:GO BLOG · SECOND SHOT · 2016" quote={`“${VALVE_SS_QUOTE}.”`} cite="—— 扫射在很多对枪里仍然占优，但扫到后段准度会变差" size={38} />
          </>
        )}

        {/* ---------- 距离 ---------- */}
        {inShot(f, SHOTS.distance) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="距离" sub="TWICE AS FAR" />
            ) : (
              <>
                <AreaRatio f={f} at={fbt(100)} x={600} y={470} head={80} from={120} to={120} label="近处" />
                <AreaRatio f={f} at={fbt(104)} x={1320} y={470} head={40} from={120} to={120} label="远一倍：头只剩一半宽" />
                {f >= fbt(108) && (
                  <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 64, color: T.orange, filter: glowF(T.orange, 10), opacity: clamp01((f - fbt(108)) / 6)}}>
                    面积 ÷ 4
                  </div>
                )}
                {label('示意 · 两边散布圈一样大', 150, T.dim)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.bars) && (
          <>
            <TacBg />
            <HitBars f={f} at={SHOTS.bars[0] + 2} groups={BARS.map(([d, a, b]) => [`${d} 米`, a, b] as const)} names={['第一发', '扫射后段']} x={360} y={250} w={1200} h={400} />
            {label(`示意 · 头半径 15 厘米，第一发散布 ${SPREAD_FIRST}°、扫射后段 ${SPREAD_LATE}°（假设值）`, 150, T.dim)}
          </>
        )}

        {/* ---------- 场合 ---------- */}
        {inShot(f, SHOTS.arms) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="场合" sub="TAP · BURST · SPRAY" />
            ) : (
              <QuotePair
                f={f}
                items={[
                  {at: fbt(136), label: 'RIOT GAMES · PATCH NOTES 0.50 · 2020', quote: 'all rifle shooting styles (tap, burst, spray) ... in optimal situations', zh: '点射、短连、扫射，各有各的场合', color: T.cyan},
                  {at: fbt(140), label: 'VALVE · CS:GO BLOG · SECOND SHOT · 2016', quote: 'Spraying is still advantageous in many engagements', zh: '扫射在很多对枪里仍然占优', color: T.orange},
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.cross) && (
          <>
            <TacBg />
            <ProbCross f={f} at={SHOTS.cross[0] + 2} headDeg={headDeg} first={SPREAD_FIRST} late={SPREAD_LATE} nearAt={fbt(144)} farAt={fbt(148)} />
          </>
        )}
        {inShot(f, SHOTS.bigline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.bigline[0]} text={BIG_LINE} size={120} y={420} />
          </>
        )}

        {/* ---------- 练法（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="练法" sub="MATCH THE RANGE" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['贴脸放心扫', '中距三五发', '远处点一下', '训练场练节奏']}
                colors={[T.red, T.orange, T.cyan, T.green]}
                icons={[
                  (c) => <path d="M30 75 H210" stroke={c} strokeWidth={8} strokeDasharray="10 6" />,
                  (c) => <path d="M30 75 H80 M105 75 H155 M180 75 H210" stroke={c} strokeWidth={8} />,
                  (c) => (
                    <>
                      <circle cx={80} cy={75} r={12} fill={c} />
                      <circle cx={170} cy={75} r={12} fill={c} />
                      <path d="M100 75 H150" stroke={c} strokeWidth={3} strokeDasharray="4 6" />
                    </>
                  ),
                  (c) => (
                    <>
                      <circle cx={120} cy={75} r={50} fill="none" stroke={c} strokeWidth={5} />
                      <circle cx={120} cy={75} r={26} fill="none" stroke={c} strokeWidth={5} />
                      <circle cx={120} cy={75} r={8} fill={c} />
                    </>
                  ),
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <SprayView f={ff} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：停顿 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="准度藏在两枪之间的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.habit) && (
          <>
            <TacBg tone="warm" />
            <SourceCard f={f} at={SHOTS.habit[0]} label="VALVE · CS:GO BLOG · RECOVERY TIME · 2015" quote={`“…${VALVE_RT_QUOTE}.”`} cite="—— 所有段位的玩家，扫射都比点射、短连多" size={44} />
          </>
        )}
        {inShot(f, SHOTS.tapview) && <SprayView f={f} shots={f >= TAP_AT ? [TAP_AT] : []} base={4} tone="warm" seed={2} hitText="HEADSHOT" hitAt={TAP_AT + 2} foeState={f < TAP_AT + 2 ? 'idle' : f < TAP_AT + 6 ? 'hit' : 'dead'} />}
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
          ammo={rangeShot ? [Math.max(13, 25 - SPRAY.filter((x) => x <= f).length), 75] : undefined}
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
