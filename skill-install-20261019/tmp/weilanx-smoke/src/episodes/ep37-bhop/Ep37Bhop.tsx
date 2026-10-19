import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {AnswerReveal, BigWord, ChapterCard, HudFrame, SourceCard, StepGrid, TacBg, TCaption, TitleCard} from '../../library/tactical/stage';
import {MsBars, NeonLine} from '../../library/tactical/charts';
import {CodeCard, ProjectionDiagram, RightTriangle, SpeedMeter, VecArrow} from '../../library/tactical/vectors';
import {T, TF} from '../../library/tactical/theme';
import {AngleWedge, BhopPath, FanSteps, HopView, OrderFlow, ramp, RunView, SpeedHud} from './scenes';
import {
  AIR_CAP,
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
  DEMO_FPS,
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
  HYPO_1,
  MAX_SPEED,
  METER,
  PASS,
  QUAKE_LINES,
  QUESTION_LINE,
  SERIES,
  SFX,
  SHADOW_LINE,
  SHOTS,
  SOURCE_LINES,
  speedAfter,
  TERM2,
  TF2_COMMENT,
  TF2_FACTOR,
  TITLE,
  TOPIC,
  turnDeg,
  V_1S,
  V_3S,
} from './timeline';

/**
 * ep37 连跳为什么越跳越快？（战术屏科普风，无口播）
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

const DEG = Math.PI / 180;

export const Ep37Bhop: React.FC = () => {
  const f = useCurrentFrame();
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const ch = chapterAt(f);
  const showHud = !inShot(f, SHOTS.title) && !inShot(f, SHOTS.hit2);
  const rangeShot = inShot(f, SHOTS.hook) || inShot(f, SHOTS.pass) || inShot(f, SHOTS.hop);
  const s = 1 + punch(f);
  const foeV = ramp(f, fbt(3), METER + 120 - fbt(3), MAX_SPEED, 520);

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: TF.sans, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep37-bhop/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：重演挫败 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <RunView f={f} />
            <SpeedHud v={Math.min(MAX_SPEED, f * 12)} />
          </>
        )}
        {inShot(f, SHOTS.pass) && (
          <>
            <RunView f={f} />
            <SpeedHud v={MAX_SPEED} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: T.red, opacity: clamp01((f - PASS) / 6)}}>对手 · {Math.round(foeV)}</div>
          </>
        )}
        {inShot(f, SHOTS.meter) && (
          <>
            <TacBg />
            <SpeedMeter v={MAX_SPEED} label="你 · 按住前进" color={T.cyan} x={260} y={330} mark={MAX_SPEED} markLabel="地面上限 320" />
            <SpeedMeter v={foeV} label="对手 · 一路连跳" color={T.red} x={1100} y={330} mark={MAX_SPEED} markLabel="地面上限 320" />
          </>
        )}
        {inShot(f, SHOTS.code) && (
          <>
            <TacBg />
            <CodeCard f={f} at={SHOTS.code[0]} file="Quake · QW/client/pmove.c · PM_AirAccelerate" lines={QUAKE_LINES} hl={[0, 1, 2]} note="id Software · 1996–1997 · 源代码以 GPL 开源" per={3} y={190} />
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

        {/* ---------- 刹车 ---------- */}
        {inShot(f, SHOTS.friction) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 380, top: 230}}>
              <NeonLine f={f} at={SHOTS.friction[0] + 4} data={[0, 140, 230, 280, 305, 316, 320, 320, 320, 320, 320, 320]} w={1100} h={440} min={0} max={420} yLabel="速度" xLabel="在地面上一直按前进" dur={50} />
            </div>
            <div style={{position: 'absolute', left: 1420, top: 300, fontFamily: TF.mono, fontWeight: 700, fontSize: 34, color: T.cyan}}>320</div>
            <div style={{position: 'absolute', left: 380, top: 180, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: T.gray}}>加速 vs 摩擦：跑得越快，刹得越狠（示意）</div>
          </>
        )}
        {inShot(f, SHOTS.order) && (
          <>
            <TacBg />
            <OrderFlow f={f} steps={['检查起跳键', '在地上才摩擦', '按方向键移动']} ats={[fbt(48), fbt(48) + 6, fbt(48) + 12]} skip={1} skipAt={fbt(52)} note="示意 · 据 Valve《Source SDK 2013》gamemovement.cpp 的 FullWalkMove：先 CheckJumpButton，再在地面时才 Friction" />
            <div style={{position: 'absolute', left: 560, top: 160, fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: T.gray, opacity: clamp01((f - SHOTS.order[0]) / 8)}}>每一帧，引擎按这个顺序算你的移动</div>
          </>
        )}
        {inShot(f, SHOTS.nobrake) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 380, top: 230}}>
              <NeonLine f={f} at={SHOTS.nobrake[0] + 2} data={[320, 320, 320, 320, 320, 320, 320, 320, 320]} w={1100} h={440} min={0} max={420} yLabel="速度" xLabel="落地即跳，但不做别的" dur={30} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontFamily: TF.sans, fontSize: 40, color: T.white, opacity: clamp01((f - fbt(60)) / 8)}}>
              不减速，<span style={{color: T.red}}>不等于</span>加速
            </div>
          </>
        )}

        {/* ---------- 影子 ---------- */}
        {inShot(f, SHOTS.cap) && (
          <>
            <TacBg />
            {f < fb(17) ? (
              <ChapterCard f={f} at={fb(16)} n={2} title="影子" sub="AIR SPEED CAP" />
            ) : (
              <>
                <div style={{position: 'absolute', left: 260, top: 330}}>
                  <MsBars f={f} at={fb(17)} max={360} w={900} labelW={300} unit="" rows={[['地面最高速度', MAX_SPEED, T.cyan], ['空中「限速」', AIR_CAP, T.red]]} />
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: TF.sans, fontSize: 22, color: T.dim}}>Quake 源码：if (wishspd &gt; 30) wishspd = 30;　Source SDK：GetAirSpeedCap() 返回 30</div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.shadow) && (
          <>
            <TacBg />
            <svg width={1920} height={1080} style={{position: 'absolute'}}>
              <ProjectionDiagram x={560} y={640} va={28 * DEG} vLen={520} wa={0} show={clamp01((f - fbt(80)) / 14)} />
            </svg>
            <div style={{position: 'absolute', left: 120, top: 170, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: T.gray}}>俯视 · 引擎拿去和 30 比的，是这段橙色的「影子」</div>
          </>
        )}
        {inShot(f, SHOTS.right) && (
          <>
            <TacBg />
            <svg width={1920} height={1080} style={{position: 'absolute'}}>
              <ProjectionDiagram x={760} y={660} va={0} vLen={560} wa={Math.PI / 2} show={clamp01((f - fbt(88)) / 10)} wLabel="想去的方向（侧移）" shadowLabel="影子 = 0" />
              {f >= fbt(92) && <VecArrow x={760 + 560} y={660} a={Math.PI / 2} len={120} color={T.green} grow={clamp01((f - fbt(92)) / 10)} label="+30" labelSize={40} />}
            </svg>
            <div style={{position: 'absolute', left: 120, top: 170, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: T.gray}}>速度朝前，你只按侧移键：两个方向成直角</div>
          </>
        )}

        {/* ---------- 斜边 ---------- */}
        {inShot(f, SHOTS.hypo) && (
          <>
            <TacBg />
            {f < fb(25) ? (
              <ChapterCard f={f} at={fb(24)} n={3} title="斜边" sub="ONE FRAME AT A TIME" />
            ) : (
              <svg width={1920} height={1080} style={{position: 'absolute'}}>
                <RightTriangle x={420} y={700} a={MAX_SPEED} b={AIR_CAP} scale={3.3} grow={clamp01((f - fbt(104) - 6) / 16)} aLabel="原来的速度 320" bLabel="+30" cLabel={`≈ ${HYPO_1}`} />
                <text x={420} y={330} fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray} letterSpacing={3}>
                  按真实比例画：多出来的 30 只是一小截
                </text>
              </svg>
            )}
          </>
        )}
        {inShot(f, SHOTS.climb) && f < fbt(120) && (
          <>
            <TacBg />
            <FanSteps f={f} at={fbt(112)} n={9} per={5} x={560} y={720} />
          </>
        )}
        {inShot(f, SHOTS.climb) && f >= fbt(120) && (
          <>
            <TacBg />
            <div style={{position: 'absolute', left: 260, top: 260}}>
              <NeonLine f={f} at={fbt(120) + 2} data={Array.from({length: 13}, (_, i) => speedAfter((i / 12) * 3))} w={900} h={420} min={250} max={680} yLabel="速度" xLabel="连跳 0 → 3 秒" dur={60} />
            </div>
            <SpeedMeter v={ramp(f, fbt(120) + 2, 60, MAX_SPEED, V_3S)} max={700} label="示意 · 3 秒后" color={T.orange} x={1240} y={300} w={460} mark={MAX_SPEED} markLabel="地面上限" />
            <div style={{position: 'absolute', left: 1240, top: 560, fontFamily: TF.mono, fontWeight: 700, fontSize: 28, color: T.text, lineHeight: 1.7, opacity: clamp01((f - fbt(124)) / 8)}}>
              1 秒 ≈ {V_1S}
              <br />3 秒 ≈ <span style={{color: T.orange}}>{V_3S}</span>
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>示意：每秒 {DEMO_FPS} 帧，每帧侧向补满 30，速度² 每帧多 30² · 自己按 Quake 默认参数算</div>
          </>
        )}

        {/* ---------- 漏洞 ---------- */}
        {inShot(f, SHOTS.angle) && (
          <>
            <TacBg />
            {f < fb(33) ? (
              <ChapterCard f={f} at={fb(32)} n={4} title="漏洞" sub="BUG OR SKILL" />
            ) : (
              <>
                <AngleWedge f={f} at={fbt(133)} deg={turnDeg(MAX_SPEED)} x={220} y={600} label="速度 320 时，每帧要转" color={T.cyan} />
                <AngleWedge f={f} at={fbt(136)} deg={turnDeg(V_3S)} x={1020} y={600} label={`速度 ${V_3S} 时，每帧只转`} color={T.orange} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 740, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>角度 = arctan(30 ÷ 速度) · 自己算的</div>
              </>
            )}
          </>
        )}
        {inShot(f, SHOTS.source) && (
          <>
            <TacBg />
            <CodeCard f={f} at={SHOTS.source[0]} file="Source SDK 2013 · gamemovement.cpp · AirAccelerate" lines={SOURCE_LINES} hl={[1, 2, 4]} note="Valve · Source 1 SDK · 和 Quake 的几行几乎一样，空中限速同样是 30" per={3} y={220} />
          </>
        )}
        {inShot(f, SHOTS.tf2) && (
          <>
            <TacBg />
            <SourceCard f={f} at={SHOTS.tf2[0]} label="VALVE · 军团要塞 2 · tf_gamemovement.cpp" quote={`“${TF2_COMMENT}”`} cite={`—— PreventBunnyJumping · BUNNYJUMP_MAX_SPEED_FACTOR ${TF2_FACTOR}f`} note={`大意：起跳时速度超过最高速度的 ${TF2_FACTOR} 倍，就按比例砍回来`} size={42} />
          </>
        )}
        {inShot(f, SHOTS.shadowline) && (
          <>
            <TacBg />
            <BigWord f={f} at={SHOTS.shadowline[0]} text={SHADOW_LINE} size={110} y={460} />
          </>
        )}

        {/* ---------- 怎么练（配乐回落段） ---------- */}
        {inShot(f, SHOTS.steps) && (
          <>
            <TacBg />
            {f < fb(41) ? (
              <ChapterCard f={f} at={fb(40)} n={5} title="怎么练" sub="FROM THE SOURCE CODE" />
            ) : (
              <StepGrid
                f={f}
                ats={[fbt(164), fbt(168), fbt(172), fbt(176)]}
                titles={['落地即跳', '只按侧移键', '视角跟着转', '左右交替']}
                colors={[T.cyan, T.orange, T.green, T.red]}
                icons={[
                  (c) => <path d="M30 120 L90 120 Q120 40 150 120 L210 120" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />,
                  (c) => (
                    <>
                      <rect x={60} y={50} width={50} height={50} rx={8} fill="none" stroke={c} strokeWidth={4} />
                      <text x={85} y={86} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={c}>
                        A
                      </text>
                      <rect x={130} y={50} width={50} height={50} rx={8} fill="none" stroke={c} strokeWidth={4} opacity={0.4} />
                      <text x={155} y={86} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} fill={c} opacity={0.4}>
                        W
                      </text>
                    </>
                  ),
                  (c) => <path d="M60 110 A60 60 0 0 1 180 110 M168 92 L180 110 L196 96" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />,
                  (c) => <path d="M30 75 C60 20 90 20 120 75 C150 130 180 130 210 75" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />,
                ]}
              />
            )}
          </>
        )}
        {inShot(f, SHOTS.build) && (
          <>
            <TacBg />
            <BhopPath progress={0.3 + 0.2 * clamp01((ff - SHOTS.build[0]) / 200)} />
            <AbsoluteFill style={{background: 'rgba(5,11,20,0.35)'}} />
          </>
        )}

        {/* ---------- 第二个爆点：影子 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TacBg />
            <AnswerReveal f={f} at={HIT2} label="引擎只量了速度的" text={ANCHOR} dark={0} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: T.gray, opacity: clamp01((f - HIT2 - 18) / 12)}}>{TERM2}</div>
          </>
        )}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.path) && (
          <>
            <TacBg tone="warm" />
            <BhopPath progress={easeInOut(clamp01((f - SHOTS.path[0]) / (SHOTS.path[1] - SHOTS.path[0] - 10)))} warm />
          </>
        )}
        {inShot(f, SHOTS.hop) && (
          <>
            <HopView f={f} at={SHOTS.hop[0]} />
            <SpeedHud v={ramp(f, SHOTS.hop[0], SHOTS.hop[1] - SHOTS.hop[0], MAX_SPEED, 470)} color={T.orange} label="你的速度" />
          </>
        )}
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
          hp={rangeShot ? 100 : undefined}
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
