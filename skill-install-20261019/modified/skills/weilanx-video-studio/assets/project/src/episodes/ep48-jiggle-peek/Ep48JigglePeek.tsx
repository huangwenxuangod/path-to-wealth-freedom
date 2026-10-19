import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {MsBars} from '../../library/tactical/charts';
import {LatencyStack} from '../../library/tactical/pipeline';
import {AnswerReveal, BigWord, Bubble, ChapterCard, DeathScreen, HookBanner, HudFrame, SlowMo, SourceCard, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {ReactionTest, WindowLanes} from '../../library/tactical/window';
import {EnemyEye, PEEK_HEAD, PeekView} from './scenes';
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
  JIGGLE_BEATS,
  MANN_EFFECTS,
  MANN_STUDIES,
  OUT_JIG1,
  OUT_KILL,
  OUT_PEEK,
  PEEK_ADV,
  PEEK_ADV_144,
  QUESTION_LINE,
  RIOT_HUMAN_RT,
  REPLAY,
  RIOT_QUOTE,
  SDT,
  SERIES,
  SFX,
  SHOOT_AFTER,
  SHOTS,
  SRT,
  SUM_KEY,
  SUM_RIOT,
  TERM2,
  TITLE,
  TOPIC,
  WIDE_BEAT,
  WOODS_N,
} from './timeline';

/**
 * ep48 探头就跑，你怎么打不到？（战术屏科普风，无口播）
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
const mini = (children: React.ReactNode) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.395)', transformOrigin: '0 0'}}>{children}</div>
);

const JIGS = JIGGLE_BEATS.map(fbt);
const WIDE = fbt(WIDE_BEAT);
/** 示意：他露出的时长（毫秒）= 一次晃身位的帧数 */
const EXPOSE_MS = 300;
const SHOT_MS = Math.round((SHOOT_AFTER / FPS) * 1000);

export const Ep48JigglePeek: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.outro);
  const s = 1 + punch(f);
  // 第 2 章：你屏幕上晚到多少（第 84 拍起从 141 变到 71）
  const lag = f < fbt(84) ? PEEK_ADV : PEEK_ADV - (PEEK_ADV - PEEK_ADV_144) * clamp01((f - fbt(84)) / 14);
  // 第 3 章慢放：两次晃身位、每一枪都打在空箱子上（4 倍慢放）
  const missStart = SHOTS.miss[0];
  const slow = (x: number) => missStart + (x - missStart) / 4;

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep48-jiggle-peek/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <PeekView vf={f} jigs={JIGS} wideAt={WIDE} />}
        {inShot(f, SHOTS.death) && (
          <>
            <PeekView vf={DEATH} jigs={JIGS} wideAt={WIDE} dead showMiss={false} />
            <DeathScreen f={f} at={DEATH} cx={PEEK_HEAD[0]} cy={PEEK_HEAD[1]} />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <TacBg tone="red" />
            <SlowMo f={f} rate="回放" x={110} y={240} />
            <WindowLanes
              f={f}
              tMax={700}
              ticks={[PEEK_ADV, 300, 600]}
              y={360}
              rows={[
                {label: '他真正探出', from: 0, to: EXPOSE_MS, color: T.orange, at: REPLAY},
                {label: '你屏幕上', from: PEEK_ADV, to: PEEK_ADV + EXPOSE_MS, color: T.cyan, at: REPLAY + 12, dashed: true},
              ]}
              marks={[{t: PEEK_ADV + SHOT_MS, label: '你开枪', color: T.red, at: REPLAY + 26}]}
            />
            {label('示意 · 晚到的 141 ms 是 Riot 的估算，其余时长为示意', 720, T.dim)}
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={150} y={240} w={760} h={430} color={T.red} title="他的屏幕" sub="早就看见你了">
              {mini(<EnemyEye />)}
            </SplitPanel>
            <SplitPanel x={1010} y={240} w={760} h={430} color={T.cyan} title="你的屏幕" sub="他才刚冒头" active={clamp01((f - fbt(19)) / 6)}>
              {mini(<PeekView vf={1002} jigs={[999]} showMiss={false} />)}
            </SplitPanel>
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

        {/* ---------- 反应 ---------- */}
        {inShot(f, SHOTS.rtest) && (
          <>
            <TacBg />
            {label(`简单反应测试 · ${WOODS_N} 人 · Woods 等 2015 · 计数为慢放`, 170, T.dim)}
            <ReactionTest f={f} at={fb(9)} litAt={fbt(44)} stopAt={fbt(48)} ms={SRT} y={430} size={320} />
          </>
        )}
        {inShot(f, SHOTS.rsplit) && (
          <>
            <TacBg />
            {label('Woods 等 2015 · 平均（已扣除硬件延迟）', 260, T.dim)}
            <LatencyStack
              f={f}
              max={320}
              x={300}
              y={460}
              w={1320}
              h={90}
              segs={[
                {label: '看见', ms: SDT, color: T.cyan, at: fbt(52)},
                {label: '其余（动手等）', ms: SRT - SDT, color: T.orange, at: fbt(52) + 14, sub: `约 ${SRT - SDT} ms`},
              ]}
            />
            {head(`= ${SRT} ms，这还是不用找人、不用瞄准`, 960, 680, T.white, clamp01((f - fbt(56)) / 8), 40)}
          </>
        )}
        {inShot(f, SHOTS.quote) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.quote[0]} label="RIOT GAMES · PEEKING INTO VALORANT'S NETCODE · 2020" quote={`“${RIOT_QUOTE}”`} cite="—— 人的反应常在 300 毫秒左右，这是一个巨大的优势" size={44} />
          </>
        )}

        {/* ---------- 先手 ---------- */}
        {inShot(f, SHOTS.window) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="先手" sub="PEEKER'S ADVANTAGE" />
            ) : (
              <>
                <WindowLanes f={f} tMax={700} ticks={[300, 600]} y={420} rows={[{label: '他露出来', from: 0, to: EXPOSE_MS, color: T.orange, at: fbt(68), note: '窗口'}]} />
                {label('窗口长短为示意', 640, T.dim)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.shift) && (
          <>
            <TacBg />
            <WindowLanes
              f={f}
              tMax={700}
              ticks={[Math.round(lag), 300, 600]}
              y={330}
              rows={[
                {label: '他露出来', from: 0, to: EXPOSE_MS, color: T.orange, at: SHOTS.shift[0]},
                {label: '你屏幕上', from: lag, to: lag + EXPOSE_MS, color: T.cyan, at: fbt(76), dashed: true, note: `晚 ${Math.round(lag)} ms`},
              ]}
            />
            {f >= fbt(80) && (
              <div style={{position: 'absolute', left: 300, top: 640}}>
                <MsBars f={f} at={fbt(80)} rows={[['Riot 估算', PEEK_ADV, T.red]]} max={200} w={800} labelW={300} />
                <MsBars f={f} at={fbt(84)} rows={[['开到 144 帧', PEEK_ADV_144, T.orange]]} max={200} w={800} labelW={300} />
              </div>
            )}
          </>
        )}
        {inShot(f, SHOTS.cut) && (
          <>
            <TacBg />
            <WindowLanes
              f={f}
              tMax={700}
              ticks={[PEEK_ADV, 300, PEEK_ADV + SRT, 600]}
              y={330}
              rows={[
                {label: '他露出来', from: 0, to: EXPOSE_MS, color: T.orange, at: SHOTS.cut[0]},
                {label: '你屏幕上', from: PEEK_ADV, to: EXPOSE_MS, color: T.cyan, at: SHOTS.cut[0], dashed: true, note: '剩下这点'},
                {label: '你最快反应', from: PEEK_ADV, to: PEEK_ADV + SRT, color: T.red, at: fbt(88)},
              ]}
              marks={[{t: EXPOSE_MS, label: '他缩回去了', color: T.orange, at: fbt(92)}]}
            />
          </>
        )}

        {/* ---------- 算账 ---------- */}
        {inShot(f, SHOTS.sum) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="算账" sub="DO THE MATH" />
            ) : (
              <>
                {label('自己算的：Riot 估算 + Woods 等 2015 的平均反应时', 170, T.dim)}
                <LatencyStack f={f} max={500} x={300} y={330} w={1200} h={70} segs={[
                  {label: '画面晚到', ms: PEEK_ADV_144, ms2: PEEK_ADV, color: T.red, at: fbt(104)},
                  {label: '最快按键', ms: SRT, color: T.cyan, at: fbt(104) + 14},
                ]} />
                {head(`= ${SUM_KEY[0]}～${SUM_KEY[1]} ms`, 1660, 330, T.white, clamp01((f - fbt(108)) / 8), 44)}
                {f >= fbt(112) && (
                  <>
                    <LatencyStack f={f} max={500} x={300} y={600} w={1200} h={70} segs={[
                      {label: '画面晚到', ms: PEEK_ADV_144, ms2: PEEK_ADV, color: T.red, at: fbt(112)},
                      {label: 'Riot 说的反应', ms: RIOT_HUMAN_RT, color: T.orange, at: fbt(112) + 14},
                    ]} />
                    {head(`≈ ${Math.round(SUM_RIOT[0] / 10) * 10}～${Math.round(SUM_RIOT[1] / 10) * 10} ms`, 1660, 600, T.white, clamp01((f - fbt(112) - 20) / 8), 44)}
                  </>
                )}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.miss) && (
          <>
            <PeekView vf={slow(f)} jigs={[slow(missStart + 4), slow(fbt(120) - 4 * SHOOT_AFTER)]} />
            <SlowMo f={f} rate="×0.25" x={110} y={240} />
          </>
        )}

        {/* ---------- 高手 ---------- */}
        {inShot(f, SHOTS.pro) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="高手" sub="ANTICIPATION" />
            ) : f < fbt(144) ? (
              <>
                {label('Mann 等 2007 · Journal of Sport & Exercise Psychology · 元分析', 200, T.dim)}
                <div style={{position: 'absolute', left: 0, right: 0, top: 340, display: 'flex', justifyContent: 'center', gap: 160, opacity: clamp01((f - fbt(136)) / 8)}}>
                  {[
                    [MANN_STUDIES, '项研究'],
                    [MANN_EFFECTS, '个效应量'],
                  ].map(([n, u]) => (
                    <div key={u} style={{textAlign: 'center'}}>
                      <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 150, color: T.orange, filter: glowF(T.orange, 10)}}>{n}</div>
                      <div style={{fontFamily: TF.sans, fontSize: 40, color: T.white}}>{u}</div>
                    </div>
                  ))}
                </div>
                {head('高手：更早读懂动作线索', 960, 680, T.cyan, clamp01((f - fbt(140)) / 8), 48)}
              </>
            ) : (
              <>
                {label('Correa 等 2006 · Experimental Brain Research · 示意，只画方向', 200, T.dim)}
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  {[
                    ['不知道它什么时候出现', 1, T.gray, fbt(144)],
                    ['提前知道它什么时候出现', 0.68, T.cyan, fbt(146)],
                  ].map(([name, v, c, at], i) => {
                    const p = clamp01((f - (at as number)) / 14);
                    return (
                      <g key={i} opacity={clamp01((f - (at as number)) / 6)}>
                        <text x={700} y={400 + i * 170} textAnchor="end" fontFamily={TF.sans} fontSize={38} fill={c as string}>
                          {name as string}
                        </text>
                        <rect x={740} y={360 + i * 170} width={800 * (v as number) * p} height={64} fill={c as string} style={{filter: glowF(c as string, 6)}} />
                      </g>
                    );
                  })}
                  <text x={740} y={700} fontFamily={TF.sans} fontSize={30} fill={T.gray}>
                    反应时间（越短越快）
                  </text>
                </svg>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.pre) && (
          <>
            <PeekView vf={f} preAim />
            <Bubble f={f} at={SHOTS.pre[0] + 4} text="准星先停在他会出来的地方" x={PEEK_HEAD[0] - 460} y={PEEK_HEAD[1] - 150} color={T.cyan} />
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="PRE-AIM, THEN WAIT" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['别追晃身位', '准星停在出口', '等第二次', '进攻也先晃']}
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
                      <rect x={120} y={30} width={80} height={90} fill="none" stroke={c} strokeWidth={4} />
                      <circle cx={100} cy={60} r={14} fill="none" stroke={c} strokeWidth={4} />
                      <path d="M100 38 V50 M100 70 V82 M78 60 H90 M110 60 H122" stroke={c} strokeWidth={4} />
                    </>
                  ),
                  (c) => (
                    <>
                      <text x={70} y={100} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={c} opacity={0.4}>
                        1
                      </text>
                      <text x={160} y={100} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={80} fill={c}>
                        2
                      </text>
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={140} y={30} width={70} height={90} fill="none" stroke={c} strokeWidth={4} />
                      <path d="M130 75 H60 M80 55 L60 75 L80 95" fill="none" stroke={c} strokeWidth={5} />
                    </>
                  ),
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <PeekView vf={ff} preAim />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：窗口 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="你要赢的，是那个" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色射击场 ---------- */}
        {inShot(f, SHOTS.outro) && (
          <>
            <PeekView vf={f} jigs={[OUT_JIG1]} wideAt={OUT_PEEK} preAim tone="warm" kill={OUT_KILL} />
            {f >= OUT_JIG1 + 12 && f < OUT_PEEK && <Bubble f={f} at={OUT_JIG1 + 12} text="不追，等" x={PEEK_HEAD[0] - 300} y={PEEK_HEAD[1] - 150} color="#ffd9a8" />}
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
          hp={rangeShot ? (inShot(f, SHOTS.death) ? 0 : 74) : undefined}
          ammo={rangeShot ? [19, 25] : undefined}
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
