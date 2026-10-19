import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {ForecastStrip, GlowButterflyG, GullG, PrintoutTape, RipplesG, TornadoG, TrailPathG} from '../../library/blackgold/chaos';
import {GlowCard} from '../../library/blackgold/props';
import {BGCaption, ChapterTag, CiteLine, FormulaField, GlowSmash, Grain, SmokeBg, SparkTitle} from '../../library/blackgold/stage';
import {B, BF, drawP, glowText, vis} from '../../library/blackgold/theme';
import {barPunch} from '../../library/lamplight/scenes';
import {
  ANCHOR,
  BAR,
  BAR0,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DATA_GAIN,
  DURATION,
  fb,
  fbt,
  FORECAST_DAYS,
  FORECAST_GAIN,
  FPS,
  FREEZE,
  gapAt,
  HALF_BEATS,
  HIT,
  HIT2,
  OPEN_HITS_1,
  OPEN_HITS_2,
  PATH_A,
  PATH_B,
  PRINTED,
  RELAY_AT,
  SFX,
  SHOTS,
  SPLIT_STEP,
  STEPS,
  STORED,
  TERM,
  TITLE,
  TITLE_EN,
  TITLE_SUB,
} from './timeline';

/**
 * ep38 蝴蝶效应（黑金光影风，无口播）。
 * 一只发光的蝴蝶开场扇四下翅膀，气流一圈圈传到远处长出龙卷风；17.45 秒金粒子聚成标题；
 * 1961 年的打印纸带（0.506127 → 0.506）→ 两次算出的「天气」开头重合、后来分开 → 1963 年三个方程，两条轨迹在吸引子上分道扬镳 →
 * 回落段 11 下硬拍点亮天气预报第 1～11 天、第 11 天起雾 → 102.52 秒砸出「差一点」；
 * 结尾：蝴蝶也能阻止龙卷风、最早是一只海鸥、1972 年的题目是同事拟的；蝴蝶沿着吸引子飞，抛问题。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

/* ---------- 吸引子投影（x–z 平面，像一只蝴蝶） ---------- */
const AX = 1240;
const AY = 950;
const toScreen = (p: [number, number, number]): [number, number] => [AX + p[0] * 17, AY - p[2] * 15];
const SCR_A = PATH_A.map(toScreen);
const SCR_B = PATH_B.map(toScreen);
/** 吸引子镜头里，第几步画到哪一帧：第 128 拍正好走过 SPLIT_STEP（分道扬镳） */
const stepAt = (f: number) =>
  keyframes(f, [
    [fbt(104), 0],
    [fbt(120), 560],
    [fbt(128), SPLIT_STEP + 20],
    [fbt(150), STEPS],
  ]);

/* ---------- 两次「天气」：x(t) 走势 ---------- */
const RX0 = 200;
const RX1 = 1720;
const RY = 540;
const runPts = (path: typeof PATH_A): [number, number][] => path.map((p, i) => [RX0 + ((RX1 - RX0) * i) / STEPS, RY - p[0] * 13]);
const RUN_A = runPts(PATH_A);
const RUN_B = runPts(PATH_B);
const runStep = (f: number) =>
  keyframes(f, [
    [fbt(66), 0],
    [fbt(86), STEPS],
  ]);

/** 差距的显示：小于 0.01 用 6 位小数，往后逐渐少位数 */
const fmtGap = (g: number) => (g < 0.01 ? g.toFixed(6) : g < 1 ? g.toFixed(4) : g.toFixed(1));

export const Ep38Butterfly: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const punch = barPunch(f, {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb});

  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep38-butterfly/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={file.endsWith('room.wav') ? DURATION : 75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <SmokeBg f={ff} tone={inShot(f, SHOTS.forecast) || inShot(f, SHOTS.build) ? 'red' : 'warm'} focus={[60, 55]} strength={inShot(f, SHOTS.forecast) ? 0.7 : 1} />

      <AbsoluteFill style={{transform: `scale(${1 + punch})`}}>
        {inShot(f, SHOTS.hook) && <Hook f={ff} />}
        {inShot(f, SHOTS.title) && (
          <>
            <FormulaField f={f} at={HIT} items={['dx/dt = σ(y − x)', 'σ = 10', 'ρ = 28', 'β = 8/3', '0.506127', '0.506', '1963', 'Chaos', 'dz/dt = xy − βz']} out={SHOTS.title[1] - 14} seed={38} />
            <SparkTitle f={f} at={HIT} title={TITLE} en={TITLE_EN} sub={TITLE_SUB} y={420} size={180} out={SHOTS.title[1] - 14} instant />
          </>
        )}
        {inShot(f, SHOTS.tape) && <Tape f={f} />}
        {inShot(f, SHOTS.runs) && <Runs f={f} />}
        {inShot(f, SHOTS.attractor) && <Attractor f={f} />}
        {(inShot(f, SHOTS.forecast) || inShot(f, SHOTS.build)) && <Forecast f={ff} />}
        {inShot(f, SHOTS.hit2) && (
          <>
            <ForkLines f={f} at={HIT2} />
            <GlowSmash f={f} at={HIT2} text={ANCHOR} size={250} sub={TERM} y={440} />
          </>
        )}
        {inShot(f, SHOTS.twist) && <Twist f={f} />}
        {inShot(f, SHOTS.title1972) && <Title1972 f={f} />}
        {inShot(f, SHOTS.end) && <End f={f} />}
      </AbsoluteFill>

      {/* ---------- 字幕 ---------- */}
      {CUES.map(([b, cn, en], i) => {
        if (!cn) return null;
        const a = cueStart(i);
        const e = HALF_BEATS.includes(b) ? (b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : cueEnd(i);
        if (f < a - 2 || f > e + 14) return null;
        const last = i === CUES.length - 1;
        return <BGCaption key={i} f={ff} at={a} text={cn} en={en} out={HALF_BEATS.includes(b) ? e : last ? undefined : e - 12} y={last ? 560 : 950} size={last ? 72 : 56} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ================= 各段画面 ================= */

const BX = 520;
const BY = 520;
const TX = 1480;
const TY = 800;
const Place: React.FC<{x: number; y: number; cn: string; en: string; on: number}> = ({x, y, cn, en, on}) => (
  <div style={{position: 'absolute', left: x - 150, width: 300, top: y, textAlign: 'center', opacity: on}}>
    <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 34, ...glowText(B.goldWarm, 8, 0.6)}}>{cn}</div>
    <div style={{fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.35em', color: B.inkFaint, marginTop: 4}}>{en}</div>
  </div>
);

const Hook: React.FC<{f: number}> = ({f}) => {
  const flaps = OPEN_HITS_1.map(fbt);
  const waves = OPEN_HITS_2.map(fbt);
  const grow = keyframes(f, [
    [fbt(11), 0],
    [fbt(13), 0.35],
    [fbt(15), 0.7],
    [fbt(16), 1],
  ]);
  const push = keyframes(f, [
    [fbt(24), 0],
    [HIT, 1],
  ]);
  // 一条虚线弧：巴西 → 德州（示意）
  const arc = `M${BX + 60} ${BY + 40} Q${(BX + TX) / 2} ${BY - 260} ${TX - 40} ${TY - 300}`;
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.35 * push})`, transformOrigin: `${(BX / 1920) * 100}% ${(BY / 1080) * 100}%`, opacity: clamp01((f + 1) / 5)}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path d={arc} fill="none" stroke={B.goldLine} strokeWidth={2} strokeDasharray="6 12" pathLength={1} opacity={0.4 + 0.6 * clamp01((f - fbt(9)) / 20)} />
        <RipplesG f={f} at={flaps} x={BX} y={BY} r={360} dur={40} dx={160} />
        <RipplesG f={f} at={waves} x={(BX + TX) / 2 + 60} y={BY + 60} r={300} dur={34} dx={300} color={B.goldWarm} />
        <g transform={`translate(${TX} ${TY})`}>
          <TornadoG t={f} size={420} grow={grow} />
        </g>
        <g transform={`translate(${BX} ${BY})`}>
          <GlowButterflyG t={f} size={230} flapAt={flaps} />
        </g>
      </svg>
      <Place x={BX} y={BY + 130} cn="巴西" en="BRAZIL" on={clamp01((f - 4) / 12)} />
      <Place x={TX} y={TY + 30} cn="德州" en="TEXAS" on={clamp01((f - fbt(11)) / 12)} />
    </AbsoluteFill>
  );
};

/** 打印纸上一行行三位小数（确定性生成），中间那一行是 0.506 */
const TAPE_ROWS = Array.from({length: 20}, (_, i) => (i === 10 ? PRINTED.toFixed(3) : (((i * 0.6180339 + 0.137) % 1) * (i % 3 === 0 ? -1 : 1)).toFixed(3)));

const Tape: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.tape;
  const out = s1 - 12;
  // 第 36 → 50 拍纸带往上滚，停在 0.506 那一行
  // scroll 越小行越往上；停在 0.506 那一行落在纸带正中
  const scroll = keyframes(f, [
    [s0, 10],
    [fbt(50), 3.5],
  ]);
  const mem = clamp01((f - fbt(52)) / 10);
  const print = clamp01((f - fbt(56)) / 8);
  const drop = clamp01((f - fbt(56) - 6) / 20);
  const cup = clamp01((f - fbt(60)) / 12);
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 12)}}>
      <ChapterTag f={f} at={s0} cn="1961 · 一次抄写" en="A shortcut" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="Edward N. Lorenz · MIT · 1961" line2="12-variable weather model" out={out} />
      <PrintoutTape f={f} at={s0 + 4} x={170} y={230} w={560} h={600} rows={TAPE_ROWS} scroll={scroll} hiRow={10} hiOn={clamp01((f - fbt(50)) / 8)} out={out} />
      {/* 电脑内存：六位 */}
      <GlowCard f={f} at={fbt(52)} x={860} y={250} w={860} h={210} color={B.gold} out={out}>
        <div style={{padding: '20px 36px'}}>
          <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 30, color: B.inkDim}}>电脑内存 · 存 6 位小数</div>
          <div style={{fontFamily: BF.latinBold, fontSize: 110, lineHeight: 1.1, letterSpacing: 6, opacity: mem, ...glowText(B.gold, 20)}}>{STORED.toFixed(6)}</div>
        </div>
      </GlowCard>
      {/* 打印纸：三位，「127」掉下去 */}
      <GlowCard f={f} at={fbt(56)} x={860} y={510} w={860} h={210} color={B.red} out={out}>
        <div style={{padding: '20px 36px', position: 'relative'}}>
          <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 30, color: B.inkDim}}>打印纸 · 只印 3 位</div>
          <div style={{fontFamily: BF.latinBold, fontSize: 110, lineHeight: 1.1, letterSpacing: 6, opacity: print}}>
            <span style={glowText(B.ink, 14, 0.6)}>{PRINTED.toFixed(3)}</span>
            <span style={{display: 'inline-block', transform: `translateY(${drop * drop * 220}px) rotate(${drop * 24}deg)`, opacity: 1 - drop, ...glowText(B.red, 14)}}>{STORED.toFixed(6).slice(5)}</span>
          </div>
        </div>
      </GlowCard>
      {/* 一杯咖啡 + 一小时 */}
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: cup}}>
        <g transform="translate(1560 830)" style={{filter: `drop-shadow(0 0 10px ${B.goldWarm})`}}>
          <path d="M-46 -40 L46 -40 L38 30 Q36 44 22 44 L-22 44 Q-36 44 -38 30 Z" fill="none" stroke={B.goldWarm} strokeWidth={4} />
          <path d="M46 -24 Q72 -22 66 2 Q60 20 40 18" fill="none" stroke={B.goldWarm} strokeWidth={4} />
          {[-18, 0, 18].map((dx, i) => (
            <path key={dx} d={`M${dx} -54 q-10 -16 0 -32 q10 -16 0 -32`} fill="none" stroke={B.inkDim} strokeWidth={3} strokeLinecap="round" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 10 + i))} transform={`translate(0 ${-((f / 2 + i * 10) % 20)})`} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Runs: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.runs;
  const head = runStep(f);
  const splitX = RX0 + ((RX1 - RX0) * SPLIT_STEP) / STEPS;
  const split = clamp01((f - fbt(80)) / 10);
  const lens = clamp01((f - fbt(88)) / 10);
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 12)}}>
      <ChapterTag f={f} at={s0} cn="两次算出来的天气" en="Two runs, one model" out={s1 - 12} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <line x1={RX0} y1={RY} x2={RX1 + 40} y2={RY} stroke={B.goldLine} strokeWidth={1.5} />
        <line x1={RX0} y1={RY - 280} x2={RX0} y2={RY + 280} stroke={B.goldLine} strokeWidth={1.5} />
        <TrailPathG pts={RUN_A} head={head} tail={260} color={B.gold} width={3} trace={0.9} dot={8} />
        <TrailPathG pts={RUN_B} head={head} tail={260} color={B.cyan} width={3} trace={0.9} dot={8} />
        {/* 分开的地方：一条红竖线 */}
        <line x1={splitX} y1={RY - 290} x2={splitX} y2={RY + 290} stroke={B.red} strokeWidth={2} strokeDasharray="8 8" opacity={split} />
        {/* 起点放大镜 */}
        <circle cx={RX0 + 6} cy={RUN_A[0][1]} r={60 * lens} fill="none" stroke={B.red} strokeWidth={3} opacity={lens} style={{filter: `drop-shadow(0 0 10px ${B.red})`}} />
      </svg>
      <div style={{position: 'absolute', left: splitX + 14, top: RY - 300, fontFamily: BF.cn, fontWeight: 900, fontSize: 30, opacity: split, ...glowText(B.red, 10)}}>从这里开始分开</div>
      <div style={{position: 'absolute', left: RX0 + 80, top: RUN_A[0][1] - 120, opacity: lens}}>
        <div style={{fontFamily: BF.cn, fontSize: 26, color: B.inkDim}}>起点只差</div>
        <div style={{fontFamily: BF.latinBold, fontSize: 64, ...glowText(B.red, 14)}}>0.000127</div>
      </div>
      <div style={{position: 'absolute', right: 140, top: 150, textAlign: 'right', fontFamily: BF.cn, fontWeight: 900, fontSize: 28}}>
        <div style={glowText(B.gold, 8, 0.7)}>— 第一次</div>
        <div style={{marginTop: 6, ...glowText(B.cyan, 8, 0.7)}}>— 第二次</div>
      </div>
      <div style={{position: 'absolute', left: RX1 - 300, width: 340, top: RY + 300, textAlign: 'right', fontFamily: BF.cn, fontSize: 22, color: B.inkFaint}}>模拟的时间 → · 示意：用 1963 年的方程代算</div>
    </AbsoluteFill>
  );
};

const Attractor: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.attractor;
  const step = stepAt(f);
  const gap = gapAt(Math.floor(step));
  const hot = clamp01(Math.log10(gap / 0.000127) / 5);
  const shape = clamp01((f - fbt(152)) / 16);
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 12)}}>
      <ChapterTag f={f} at={s0} cn="1963 · 三个方程" en="Deterministic nonperiodic flow" out={s1 - 12} />
      <CiteLine f={f} at={s0 + 6} line1="Lorenz · Deterministic Nonperiodic Flow" line2="J. Atmos. Sci. 20 : 130–141 · 1963" out={s1 - 12} />
      <GlowCard f={f} at={s0 + 10} x={110} y={230} w={600} h={300} color={B.goldWarm} out={s1 - 12}>
        <div style={{padding: '26px 36px', fontFamily: BF.latin, fontStyle: 'italic', fontSize: 40, lineHeight: 1.45, ...glowText(B.ink, 8, 0.4)}}>
          <div>dx/dt = σ(y − x)</div>
          <div>dy/dt = x(ρ − z) − y</div>
          <div>dz/dt = xy − βz</div>
          <div style={{fontStyle: 'normal', fontSize: 28, color: B.goldWarm, marginTop: 8}}>σ = 10 · ρ = 28 · β = 8/3</div>
        </div>
      </GlowCard>
      {/* 差距表 */}
      <div style={{position: 'absolute', left: 110, width: 600, top: 580, opacity: clamp01((f - fbt(104)) / 10)}}>
        <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 30, color: B.inkDim}}>两条轨迹相差</div>
        <div style={{fontFamily: BF.latinBold, fontSize: 96, lineHeight: 1.1, ...glowText(hot > 0.6 ? B.red : B.gold, 18)}}>{fmtGap(gap)}</div>
        <div style={{height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', marginTop: 10}}>
          <div style={{width: `${100 * Math.max(0.02, hot)}%`, height: '100%', borderRadius: 5, background: hot > 0.6 ? B.red : B.gold, boxShadow: `0 0 12px ${hot > 0.6 ? B.red : B.gold}`}} />
        </div>
        <div style={{fontFamily: BF.cn, fontSize: 22, color: B.inkFaint, marginTop: 8}}>对数刻度 · 每一格大 10 倍</div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g opacity={clamp01((f - fbt(104)) / 10)}>
          <TrailPathG pts={SCR_A} head={step} tail={180} color={B.gold} width={2.6} trace={0.25 + 0.4 * shape} />
          <TrailPathG pts={SCR_B} head={step} tail={180} color={B.cyan} width={2.6} trace={0.25} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: AX - 300, width: 600, top: 120, textAlign: 'center', opacity: shape, fontFamily: BF.cn, fontWeight: 900, fontSize: 32, ...glowText(B.goldWarm, 10, 0.6)}}>
        洛伦兹吸引子 <span style={{fontWeight: 400, fontSize: 22, color: B.inkFaint}}>· 示意，自己算的</span>
      </div>
    </AbsoluteFill>
  );
};

const Forecast: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.forecast;
  const ten = clamp01((f - fbt(171)) / 10);
  const more = clamp01((f - fbt(181)) / 10);
  const cw = 132;
  const gap = 14;
  const x0 = (1920 - (cw * 11 + gap * 10)) / 2;
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 12)}}>
      <ChapterTag f={f} at={s0} cn="天气预报能看多远" en="The predictability limit" />
      <CiteLine f={f} at={s0 + 6} line1="Zhang et al. · J. Atmos. Sci. 76 : 1077 · 2019" line2="Midlatitude weather · skillful forecast ≈ 10 days" />
      <ForecastStrip f={f} x={x0} y={380} days={11} litAt={RELAY_AT} fogFrom={FORECAST_DAYS} cw={cw} gap={gap} />
      {/* 「约 10 天」括号 */}
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: ten}}>
        <path d={`M${x0} 360 L${x0} 340 L${x0 + (cw + gap) * 10 - gap} 340 L${x0 + (cw + gap) * 10 - gap} 360`} fill="none" stroke={B.gold} strokeWidth={3} style={{filter: `drop-shadow(0 0 6px ${B.gold})`}} />
      </svg>
      <div style={{position: 'absolute', left: x0, width: (cw + gap) * 10 - gap, top: 270, textAlign: 'center', opacity: ten, fontFamily: BF.cn, fontWeight: 900, fontSize: 40, ...glowText(B.gold, 12)}}>
        约 {FORECAST_DAYS} 天
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', opacity: more, fontFamily: BF.cn, fontSize: 32, color: B.inkDim}}>
        起点数据再精确 {DATA_GAIN} 倍 → 最多再多 <span style={{fontFamily: BF.latinBold, fontSize: 48, ...glowText(B.cyan, 12)}}>{FORECAST_GAIN}</span> 天
      </div>
    </AbsoluteFill>
  );
};

/** 「差一点」背后：一根光线从左边一个点出发，在中间分成两股，越走越开 */
const ForkLines: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = drawP(f, at, 30);
  const y = 440;
  const lines = [-1, 1].map((s) => `M120 ${y} L720 ${y} C980 ${y} 1200 ${y + s * 40} 1800 ${y + s * 330}`);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', opacity: 0.85}}>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i ? B.cyan : B.gold} strokeWidth={3} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 8px ${i ? B.cyan : B.gold})`}} />
      ))}
      <circle cx={120} cy={y} r={10} fill="#fff4d0" style={{filter: `drop-shadow(0 0 12px ${B.gold})`}} />
    </svg>
  );
};

const Twist: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.twist;
  const grow = keyframes(f, [
    [fbt(200), 0],
    [fbt(203), 1],
  ]);
  const calm = clamp01((f - fbt(204)) / 24);
  const gull = clamp01((f - fbt(212)) / 14);
  const flaps = [200, 201, 202, 203].map(fbt);
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 10, 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <RipplesG f={f} at={flaps} x={560} y={480} r={300} dur={36} dx={200} />
        <g transform={`translate(${TX} ${TY})`}>
          <TornadoG t={f} size={420} grow={grow} calm={calm} />
        </g>
        <g transform="translate(560 480)" opacity={1 - gull}>
          <GlowButterflyG t={f} size={220} flapAt={flaps} />
        </g>
        <g transform="translate(560 480)" opacity={gull}>
          <GullG t={f} size={300} />
        </g>
      </svg>
      {/* 阻止 */}
      <div style={{position: 'absolute', left: TX - 260, width: 520, top: 360, textAlign: 'center', opacity: calm * (1 - gull * 0.6)}}>
        <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 56, ...glowText(B.cyan, 16)}}>也能阻止</div>
        <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: 26, color: B.inkDim, marginTop: 8}}>“it can equally well be instrumental in preventing a tornado”</div>
      </div>
      <div style={{position: 'absolute', left: 560 - 300, width: 600, top: 640, textAlign: 'center', opacity: gull}}>
        <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, ...glowText(B.goldWarm, 10, 0.6)}}>1963 · 一只海鸥</div>
        <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: 24, color: B.inkDim, marginTop: 6}}>“one flap of a sea gull’s wings…”</div>
      </div>
      <CiteLine f={f} at={fbt(204)} line1="Lorenz · AAAS 139th Meeting · 1972" line2="Lorenz 1963b · Trans. N.Y. Acad. Sci. 25 : 409–432" />
    </AbsoluteFill>
  );
};

const Title1972: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.title1972;
  const a = clamp01((f - s0) / 12);
  const hl = clamp01((f - s0 - 16) / 12);
  const W2 = (w: string) => (
    <span style={{color: '#ffe9b0', textShadow: `0 0 ${18 * hl}px ${B.gold}`}}>
      <span style={{color: hl > 0 ? B.gold : undefined, fontWeight: 700}}>{w[0]}</span>
      {w.slice(1)}
    </span>
  );
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 10, 10)}}>
      <CiteLine f={f} at={s0} line1="1972 · AAAS · Washington, D.C." line2="Title by session convener Philip Merilees" />
      <div style={{position: 'absolute', left: 160, right: 160, top: 300, textAlign: 'center', opacity: a, fontFamily: BF.latin, fontStyle: 'italic', fontSize: 64, lineHeight: 1.35, color: B.ink}}>
        Predictability: Does the Flap of a {W2('Butterfly’s')} Wings in {W2('Brazil')} Set Off a {W2('Tornado')} in {W2('Texas')}?
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: hl, fontFamily: BF.cn, fontSize: 30, color: B.inkDim}}>
        B—B、T—T：召集人说，换成蝴蝶是为了<span style={glowText(B.gold, 10)}>头韵</span>，「海鸥配塞内加尔也行」
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.end;
  const idx = ((f - s0) * 3) % STEPS;
  const [x, y] = SCR_A[Math.floor(idx)];
  const dimQ = clamp01((f - fbt(240)) / 16);
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 14) * (1 - 0.75 * dimQ)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', transform: 'translateX(-280px)'}}>
        <TrailPathG pts={SCR_A} head={STEPS} tail={0} color={B.gold} width={2} trace={0.18} dot={0} />
        <TrailPathG pts={SCR_A} head={idx} tail={120} color={B.gold} width={3} trace={0} dot={0} />
        <g transform={`translate(${x} ${y})`}>
          <GlowButterflyG t={f} size={110} flapAt={[236, 237, 238, 239].map(fbt)} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
