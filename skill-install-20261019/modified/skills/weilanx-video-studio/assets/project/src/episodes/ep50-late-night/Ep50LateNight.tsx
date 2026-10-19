import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {MsBars} from '../../library/tactical/charts';
import {BrainGlow} from '../../library/tactical/reward';
import {AwakeDial, LapseStrip} from '../../library/tactical/sleep';
import {AnswerReveal, BigWord, ChapterCard, DeathScreen, HookBanner, HudFrame, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {DayLines, ENEMY_HEAD, EquivScales, TiredView} from './scenes';
import {
  ANCHOR,
  ASK_LINE,
  AWAKE_H,
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
  DIAL,
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
  LD_ARTICLES,
  LD_LAPSES_G,
  LD_REASON_G,
  LD_TESTS,
  OPEN_SHOTS,
  OUT_KILL,
  QUESTION_LINE,
  SERIES,
  SFX,
  SHOTS,
  TERM2,
  TITLE,
  TOPIC,
  VD_DAYS,
  VD_DOSES,
  VD_THRESHOLD_H,
  WAKE_AT,
  WALKER_GAIN,
  WF_BAC,
  WF_HOURS,
  WF_N,
  WF_SLOWER,
} from './timeline';

/**
 * ep50 凌晨打排位，手感去哪了？（战术屏科普风，无口播）
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

const SHOTF = OPEN_SHOTS.map(fbt);

export const Ep50LateNight: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.outro);
  const s = 1 + punch(f);
  // 回落段：表盘从 02:00 走到 02:40，屏幕熄灭（示意）
  const buildP = clamp01((ff - SHOTS.build[0]) / (HIT2 - FREEZE - SHOTS.build[0]));

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep50-late-night/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <TiredView f={f} wobble={1} shots={SHOTF} clock="02:13" />}
        {inShot(f, SHOTS.death) && (
          <>
            <TiredView f={DEATH} wobble={1} dead clock="02:13" />
            <DeathScreen f={f} at={DEATH} cx={ENEMY_HEAD[0]} cy={ENEMY_HEAD[1]} />
          </>
        )}
        {inShot(f, SHOTS.dial) && (
          <>
            <TacBg tone="red" />
            <AwakeDial from={WAKE_AT} awake={AWAKE_H * clamp01((f - DIAL) / 30)} y={540} r={220} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={150} y={240} w={760} h={430} color={T.cyan} title="下午 2 点的你" sub="准星稳">
              {mini(<TiredView f={f} wobble={0.05} clock="14:00" tone="warm" />)}
            </SplitPanel>
            <SplitPanel x={1010} y={240} w={760} h={430} color={T.red} title="凌晨 2 点的你" sub="准星飘" active={clamp01((f - fbt(19)) / 6)}>
              {mini(<TiredView f={f} wobble={1} clock="02:00" />)}
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

        {/* ---------- 醒了多久 ---------- */}
        {inShot(f, SHOTS.equiv) && (
          <>
            <TacBg />
            {label(`Williamson & Feyer 2000 · Occup Environ Med · ${WF_N} 人`, 170, T.dim)}
            <EquivScales f={f} at={fbt(40)} hoursAt={fbt(48)} bacAt={fbt(52)} linkAt={fbt(52) + 10} hours={WF_HOURS} bac={WF_BAC} />
          </>
        )}
        {inShot(f, SHOTS.slow) && (
          <>
            <TacBg />
            {label('Williamson & Feyer 2000 · 部分测试的反应速度 · 示意：只画了「最多慢 50%」', 200, T.dim)}
            <div style={{position: 'absolute', left: 170, top: 380, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
              <MsBars f={f} at={fbt(56)} rows={[['睡够的时候', 100, T.cyan]]} max={160} w={700} unit="%" labelW={240} />
              <MsBars f={f} at={fbt(56) + 10} rows={[['醒了很久', 100 + WF_SLOWER, T.red]]} max={160} w={700} unit="%" labelW={240} />
            </div>
            {head('反应用时', 960, 300, T.gray, 1, 32)}
          </>
        )}
        {inShot(f, SHOTS.awake) && (
          <>
            <TacBg tone="red" />
            <AwakeDial from={WAKE_AT} awake={AWAKE_H * clamp01((f - fbt(60)) / 24)} y={500} r={210} />
          </>
        )}

        {/* ---------- 感觉不到 ---------- */}
        {inShot(f, SHOTS.offline) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="感觉不到" sub="YOU WON'T NOTICE" />
            ) : (
              <>
                <BrainGlow x={960} y={470} size={360} lit={0.6 + 0.4 * Math.abs(Math.sin(f / 6))} color={T.red} label="在线 18 小时" sub="一直没下线" />
                {head('该离线了', 960, 220, T.cyan, clamp01((f - fbt(68)) / 8), 48)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.days) && (
          <>
            <TacBg />
            {label('Van Dongen 等 2003 · Sleep · 线的形状为示意，只画方向', 170, T.dim)}
            <DayLines f={f} at={fbt(76)} days={VD_DAYS} doses={VD_DOSES} equivAt={fbt(84)} />
          </>
        )}
        {inShot(f, SHOTS.unaware) && (
          <>
            <TacBg />
            {label('Van Dongen 等 2003 · 示意：只画方向', 200, T.dim)}
            <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
              {[
                ['实际的失误', 0.9, T.red, fbt(88)],
                ['自己觉得有多困', 0.3, T.gray, fbt(88) + 12],
              ].map(([name, v, c, at], i) => {
                const p = clamp01((f - (at as number)) / 16);
                const x = 620 + i * 460;
                return (
                  <g key={i} opacity={clamp01((f - (at as number)) / 6)}>
                    <rect x={x} y={740 - 420 * (v as number) * p} width={220} height={420 * (v as number) * p} fill={c as string} style={{filter: glowF(c as string, 8)}} />
                    <text x={x + 110} y={800} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={c as string}>
                      {name as string}
                    </text>
                  </g>
                );
              })}
              <line x1={540} x2={1380} y1={740} y2={740} stroke={T.faint} strokeWidth={2} />
            </svg>
          </>
        )}

        {/* ---------- 掉线 ---------- */}
        {inShot(f, SHOTS.meta) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="掉线" sub="LAPSES" />
            ) : (
              <>
                {label(`Lim & Dinges 2010 · Psychological Bulletin · ${LD_ARTICLES} 篇文章、${LD_TESTS} 项测试 · 效应量 g（取绝对值）`, 200, T.dim)}
                {head('缺觉之后，哪样坏得最厉害？', 960, 300, T.white, clamp01((f - fbt(100)) / 6), 44)}
                <div style={{position: 'absolute', left: 170, top: 440, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
                  <MsBars f={f} at={fbt(108)} rows={[['简单注意力：走神', LD_LAPSES_G, T.red]]} max={1} w={640} unit="" digits={3} labelW={300} />
                  <MsBars f={f} at={fbt(108) + 12} rows={[['推理准确率', LD_REASON_G, T.gray]]} max={1} w={640} unit="" digits={3} labelW={300} />
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.lapse) && (
          <>
            <TacBg />
            {label(`Van Dongen 等 2003：清醒超过 ${VD_THRESHOLD_H} 小时后，失误几乎随清醒时间线性增加 · 竖线位置为示意`, 200, T.dim)}
            {head('每一条竖线：大脑断线一小下', 960, 300, T.white, 1, 40)}
            <LapseStrip f={f} at={fbt(112)} threshold={VD_THRESHOLD_H} y={440} dur={70} />
            {f >= fbt(116) && head('约 16 小时', 260 + (VD_THRESHOLD_H / 24) * 1400, 370, T.white, clamp01((f - fbt(116)) / 6), 30)}
          </>
        )}

        {/* ---------- 睡一觉 ---------- */}
        {inShot(f, SHOTS.sleep) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="睡一觉" sub="PRACTICE WITH SLEEP" />
            ) : (
              <>
                {label('Walker 等 2002 · Neuron · 练完一个动作技能之后再测', 200, T.dim)}
                <div style={{position: 'absolute', left: 170, top: 380, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
                  <MsBars f={f} at={fbt(140)} rows={[['一直醒着（不显著）', 0, T.gray]]} max={30} w={600} unit="%" labelW={300} />
                  <MsBars f={f} at={fbt(144)} rows={[['中间睡一晚', WALKER_GAIN, T.cyan]]} max={30} w={600} unit="%" labelW={300} />
                </div>
                {head('动作速度的提升', 960, 300, T.gray, clamp01((f - fbt(136)) / 6), 32)}
                {f >= fbt(148) && head('准确度没掉', 960, 700, T.green, clamp01((f - fbt(148)) / 6), 40)}
              </>
            )}
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="LOG OFF ON TIME" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['定好下线时间', '晚了连输就停', '新技巧睡前练', '别连着熬']}
                colors={[T.cyan, T.red, T.orange, T.green]}
                icons={[
                  (c) => (
                    <>
                      <circle cx={120} cy={75} r={55} fill="none" stroke={c} strokeWidth={5} />
                      <path d="M120 75 V40 M120 75 L150 88" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={40} y={50} width={50} height={50} rx={6} fill={c} opacity={0.8} />
                      <rect x={100} y={50} width={50} height={50} rx={6} fill={c} opacity={0.8} />
                      <path d="M175 50 L215 100 M215 50 L175 100" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => <path d="M150 30 A50 50 0 1 0 190 110 A40 40 0 1 1 150 30 Z" fill={c} opacity={0.9} />,
                  (c) => (
                    <>
                      {[0, 1, 2].map((k) => (
                        <rect key={k} x={40 + k * 60} y={60 + k * 12} width={44} height={50 - k * 12} rx={4} fill={c} opacity={1 - k * 0.25} />
                      ))}
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
            <AwakeDial from={WAKE_AT} awake={AWAKE_H + 0.66 * buildP} y={500} r={210} label="该下线了" />
            <AbsoluteFill style={{background: '#000', opacity: 0.55 * buildP}} />
          </>
        )}

        {/* ---------- 第二个爆点：离线 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="让手感回来的，是那段" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色射击场 ---------- */}
        {inShot(f, SHOTS.outro) && <TiredView f={f} wobble={Math.max(0, 0.25 - (f - SHOTS.outro[0]) / 120)} kill={OUT_KILL} tone="warm" clock="14:00" />}
        {inShot(f, SHOTS.flipline) && (
          <>
            <TacBg tone="warm" />
            <BigWord f={f} at={SHOTS.flipline[0]} text={FLIP_LINE} size={104} y={430} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.ask[0]} text={ASK_LINE} size={96} y={430} />
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
          hp={rangeShot ? (inShot(f, SHOTS.death) ? 0 : 47) : undefined}
          ammo={rangeShot ? [9, 25] : undefined}
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
