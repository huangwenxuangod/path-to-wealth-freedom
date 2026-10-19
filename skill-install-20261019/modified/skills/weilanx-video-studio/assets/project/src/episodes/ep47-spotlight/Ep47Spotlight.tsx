import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeOut} from '../../library/anim';
import {PassCourt, Spotlight, SplitBar, ToneIcon} from '../../library/tactical/attention';
import {MsBars} from '../../library/tactical/charts';
import {AnswerReveal, BigWord, Bubble, ChapterCard, DeathScreen, HookBanner, HudFrame, SlowMo, SplitPanel, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {glowF, T, TF} from '../../library/tactical/theme';
import {CloseDuel, LetterRing, SearchPair, sideHeadOnScreen} from './scenes';
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
  FIRE_BEATS,
  FLIP_LINE,
  FPS,
  FREEZE,
  GORILLA_SEC,
  HALF_BEATS,
  HIT,
  HIT2,
  HOOK_LINE,
  ML08_FAR,
  ML08_NEAR,
  OUT_KILL1,
  OUT_KILL2,
  OUT_SCAN,
  OUT_SEE,
  QUESTION_LINE,
  REPLAY,
  S10_CURTAIN,
  S10_FAMILIAR_GORILLA,
  S10_PLAYER,
  SC_EASY,
  SC_HARD,
  SC_GORILLA_SAW,
  SC_N_GORILLA,
  SC_QUOTE_OBJECTS,
  SERIES,
  SFX,
  SHOTS,
  SIDE_IN,
  STOOD_SEC,
  TERM2,
  THUMP_N,
  THUMP_SAW,
  THUMP_SEC,
  TITLE,
  TOPIC,
} from './timeline';

/**
 * ep47 旁边有人，你怎么没看见？（战术屏科普风，无口播）
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
  <div style={{position: 'absolute', left: x - 400, width: 800, top, textAlign: 'center', fontFamily: TF.sans, fontSize: size, color, opacity}}>{text}</div>
);
const mini = (children: React.ReactNode) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.395)', transformOrigin: '0 0'}}>{children}</div>
);

const FIRES = FIRE_BEATS.map(fbt);
const lastFire = (f: number) => FIRES.filter((a) => f >= a).pop();
/** 白队三人在传球场里的大致位置（聚光灯照他们） */
const WHITE_SPOTS = [0.12, 0.48, 0.78].map((sx) => ({x: 260 + 1400 * sx, y: 630, rx: 110, ry: 150}));

export const Ep47Spotlight: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.death) || inShot(f, SHOTS.outro);
  const s = 1 + punch(f);
  const sh = sideHeadOnScreen(DEATH - 1);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep47-spotlight/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && <CloseDuel f={f} sideIn={SIDE_IN} shotAt={lastFire(f)} hits={FIRES.map((a) => a + 1)} />}
        {inShot(f, SHOTS.death) && (
          <>
            <CloseDuel f={DEATH} sideIn={SIDE_IN} dead />
            <DeathScreen f={f} at={DEATH} cx={sh[0]} cy={sh[1]} />
          </>
        )}
        {inShot(f, SHOTS.replay) && (
          <>
            <CloseDuel f={DEATH - 1} sideIn={SIDE_IN} dead />
            <AbsoluteFill style={{background: 'rgba(60,8,16,0.45)'}} />
            <SlowMo f={f} rate="回放" x={110} y={240} />
            <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
              <circle cx={sh[0]} cy={sh[1]} r={90 + 40 * (1 - easeOut(clamp01((f - REPLAY) / 10)))} fill="none" stroke={T.red} strokeWidth={5} style={{filter: glowF(T.red, 8)}} />
            </svg>
            <Bubble f={f} at={REPLAY + 10} text={`他在你准星旁边站了 ${STOOD_SEC} 秒`} x={sh[0] + 110} y={sh[1] - 150} color={T.red} size={38} />
          </>
        )}
        {inShot(f, SHOTS.split) && (
          <>
            <TacBg />
            <SplitPanel x={150} y={240} w={760} h={430} color={T.gray} title="你的屏幕" sub="两个人">
              {mini(<CloseDuel f={f} sideIn={SIDE_IN - 999} />)}
            </SplitPanel>
            <SplitPanel x={1010} y={240} w={760} h={430} color={T.red} title="你的大脑" sub="只有一个" active={clamp01((f - fbt(19)) / 6)}>
              {mini(<CloseDuel f={f} sideIn={SIDE_IN - 999} spot={clamp01((f - fbt(19)) / 8)} spotId="split" />)}
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

        {/* ---------- 大猩猩 ---------- */}
        {inShot(f, SHOTS.court) && (
          <>
            <TacBg />
            {label('Simons & Chabris 1999 · 原创示意（白衣、黑衣各 3 人，数白队传了几次）', 170, T.dim)}
            <PassCourt f={f} t0={fbt(40)} gorillaAt={fbt(42)} walk={GORILLA_SEC * FPS} />
          </>
        )}
        {inShot(f, SHOTS.gorilla) && (
          <>
            <TacBg />
            {label(`大猩猩那几组 ${SC_N_GORILLA} 人 · Simons & Chabris 1999 · Perception`, 260, T.dim)}
            <SplitBar f={f} at={fbt(52)} a={SC_GORILLA_SAW} labelA="看见了" labelB="没看见" y={460} />
          </>
        )}
        {inShot(f, SHOTS.thump) && (
          <>
            <TacBg />
            {label(`另一版：停在正中间捶胸，一共 ${THUMP_SEC} 秒 · ${THUMP_N} 人里 ${THUMP_SAW}% 看见`, 170, T.dim)}
            <PassCourt f={f} t0={fb(14) - 200} gorillaAt={fb(14) - 50} walk={100} stopFor={THUMP_SEC * FPS - 100} />
          </>
        )}

        {/* ---------- 光圈 ---------- */}
        {inShot(f, SHOTS.beam) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="光圈" sub="ATTENTION SPOTLIGHT" />
            ) : (
              <>
                <PassCourt f={f} t0={fb(16)} gorillaAt={fbt(67)} walk={GORILLA_SEC * FPS} count={false} gorillaLabel={false} />
                <Spotlight id="beam" holes={WHITE_SPOTS} dark={0.85 * clamp01((f - fbt(68)) / 10)} soft={22} />
                {head('照到的才看得见', 960, 180, T.cyan, clamp01((f - fbt(68)) / 8))}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.hard) && (
          <>
            <TacBg />
            {label('Simons & Chabris 1999 · 发现闯入者的比例（大猩猩、打伞女人两版合计）', 200, T.dim)}
            <div style={{position: 'absolute', left: 170, top: 360, transform: 'scale(1.4)', transformOrigin: '0 0'}}>
              <MsBars f={f} at={fbt(76)} rows={[['只数总数', SC_EASY, T.cyan]]} max={100} w={700} unit="%" labelW={260} />
              <MsBars f={f} at={fbt(80)} rows={[['分开数两种', SC_HARD, T.red]]} max={100} w={700} unit="%" labelW={260} />
            </div>
          </>
        )}
        {inShot(f, SHOTS.load) && (
          <>
            <TacBg />
            {label('Cartwright-Finch & Lavie 2007 · Cognition · 原创示意', 150, T.dim)}
            <SearchPair f={f} at={fbt(84)} atR={fbt(86)} />
          </>
        )}
        {inShot(f, SHOTS.narrow) && (
          <>
            <CloseDuel f={f} sideIn={SIDE_IN - 999} spot={clamp01((f - fbt(92)) / 12)} spotId="narrow" />
          </>
        )}

        {/* ---------- 离得再近 ---------- */}
        {inShot(f, SHOTS.near) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="离得再近" sub="DISTANCE DOESN'T HELP" />
            ) : f < fbt(104) ? (
              <>
                <CloseDuel f={f} sideIn={SIDE_IN - 999} />
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <line x1={960} y1={sideHeadOnScreen(f)[1]} x2={sideHeadOnScreen(f)[0]} y2={sideHeadOnScreen(f)[1]} stroke={T.orange} strokeWidth={4} strokeDasharray="10 8" />
                </svg>
                {head('离准星这么近？', 960, 260, T.orange, clamp01((f - fbt(100)) / 6), 52)}
              </>
            ) : (
              <>
                {label('Macdonald & Lavie 2008 · 实验 1 · 找 X，同时留意灰色小方块 · 原创示意', 150, T.dim)}
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <LetterRing x={560} y={510} r={95} near title="方块离目标近" color={T.cyan} show={clamp01((f - fbt(104)) / 8)} />
                  <LetterRing x={1360} y={510} r={95} near={false} title="方块离目标远" color={T.gray} show={clamp01((f - fbt(104) - 6) / 8)} />
                </svg>
                {head(`${ML08_NEAR}% 看见`, 560, 765, T.cyan, clamp01((f - fbt(108)) / 6), 56)}
                {head(`${ML08_FAR}% 看见`, 1360, 765, T.gray, clamp01((f - fbt(108) - 8) / 6), 56)}
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.object) && (
          <>
            <CloseDuel f={f} sideIn={SIDE_IN - 999} spot={1} spotId="object" />
            {label(`Simons & Chabris 1999：“${SC_QUOTE_OBJECTS}”`, 236, T.text)}
            {f >= fbt(120) && <Bubble f={f} at={fbt(120)} text="他在光外" x={sideHeadOnScreen(f)[0] + 60} y={sideHeadOnScreen(f)[1] - 130} color={T.red} />}
          </>
        )}

        {/* ---------- 知道也漏 ---------- */}
        {inShot(f, SHOTS.known) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="知道也漏" sub="EXPECTED ≠ SEEN" />
            ) : f < fbt(144) ? (
              <>
                {label('Simons 2010 · 新拍的一版 · 原创示意', 170, T.dim)}
                <PassCourt f={f} t0={fb(33)} gorillaAt={fbt(134)} walk={90} stopFor={90} curtain={clamp01((f - fbt(140)) / 90)} leaveAt={fbt(141)} gorillaLabel={false} />
                {f >= fbt(136) && <Bubble f={f} at={fbt(136)} text="找到了！" x={880} y={240} color={T.cyan} />}
              </>
            ) : (
              <>
                {label('Simons 2010 · i-Perception', 200, T.dim)}
                <div style={{position: 'absolute', left: 120, top: 330, transform: 'scale(1.3)', transformOrigin: '0 0'}}>
                  <MsBars f={f} at={fbt(144)} rows={[['看过的人找到大猩猩', S10_FAMILIAR_GORILLA, T.cyan], ['发现幕布变色', S10_CURTAIN, T.red], ['发现有人离场', S10_PLAYER, T.red]]} max={100} w={680} unit="%" labelW={360} />
                </div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.ambush) && (
          <>
            <CloseDuel f={f} sideIn={SIDE_IN - 999} spot={1} spotId="ambush" />
            {head('你在等的那一个', 960, 250, T.cyan, clamp01((f - SHOTS.ambush[0]) / 6), 44)}
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
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么办" sub="SWEEP THE LIGHT" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['打一个，扫一眼', '先看一遍再架', '两个口分一个', '报点补光外']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => (
                    <>
                      <circle cx={90} cy={75} r={30} fill="none" stroke={c} strokeWidth={4} />
                      <path d="M90 35 V55 M90 95 V115 M50 75 H70 M110 75 H130" stroke={c} strokeWidth={4} />
                      <path d="M150 50 Q200 75 150 100" fill="none" stroke={c} strokeWidth={5} />
                      <path d="M150 100 l14 -2 M150 100 l2 -14" stroke={c} strokeWidth={5} />
                    </>
                  ),
                  (c) => (
                    <>
                      <path d="M40 75 Q120 15 200 75 Q120 135 40 75 Z" fill="none" stroke={c} strokeWidth={5} />
                      <circle cx={120} cy={75} r={20} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <rect x={40} y={40} width={60} height={80} fill="none" stroke={c} strokeWidth={5} />
                      <rect x={140} y={40} width={60} height={80} fill="none" stroke={c} strokeWidth={5} />
                      <circle cx={70} cy={80} r={8} fill={c} />
                      <circle cx={170} cy={80} r={8} fill={c} />
                    </>
                  ),
                  (c) => (
                    <>
                      <ellipse cx={80} cy={75} rx={50} ry={34} fill={c} opacity={0.3} />
                      <ToneIcon x={180} y={75} s={60} color={c} />
                    </>
                  ),
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <CloseDuel f={ff} sideIn={SIDE_IN - 999} />
            <Spotlight id="build" holes={[{x: 960 + Math.sin((ff - SHOTS.build[0]) / 22) * 260, y: 560, rx: 170, ry: 220}]} dark={0.8} soft={24} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.3)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：聚光灯 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="让你看不见他的，是" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾：暖色射击场 ---------- */}
        {inShot(f, SHOTS.outro) && (
          <>
            <CloseDuel
              f={f}
              sideIn={SHOTS.outro[0] + 4}
              tone="warm"
              frontDead={f >= OUT_KILL1 + 2}
              turn={clamp01((f - OUT_SCAN) / 12)}
              sideState={f >= OUT_KILL2 + 2 ? 'dead' : f >= OUT_KILL2 ? 'hit' : 'idle'}
              shotAt={f >= OUT_KILL2 ? OUT_KILL2 : f >= OUT_KILL1 ? OUT_KILL1 : undefined}
            />
            {f >= OUT_SEE && f < OUT_KILL2 && <Bubble f={f} at={OUT_SEE} text="看见了" x={1010} y={300} color="#ffd9a8" />}
          </>
        )}
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
          hp={rangeShot ? (inShot(f, SHOTS.death) ? 0 : 58) : undefined}
          ammo={rangeShot ? [17, 25] : undefined}
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
