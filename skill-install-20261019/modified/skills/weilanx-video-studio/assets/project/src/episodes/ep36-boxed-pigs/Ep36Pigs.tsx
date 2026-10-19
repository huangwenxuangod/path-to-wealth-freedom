import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {BalanceScale, Ledger, PayoffMatrix, PelletStack} from '../../library/blackgold/charts';
import {GlowPigG, PigPen, track} from '../../library/blackgold/pen';
import {GlowCard} from '../../library/blackgold/props';
import {BGCaption, ChapterTag, CiteLine, FormulaField, GlowSmash, Grain, SmokeBg, SparkTitle, TickRing} from '../../library/blackgold/stage';
import {B, BF, glowText, vis} from '../../library/blackgold/theme';
import {barPunch} from '../../library/lamplight/scenes';
import {OutcomeCard} from './scenes';
import {
  ANCHOR,
  BAR,
  BAR0,
  BIG_AT_LEVER,
  BIG_AT_TROUGH,
  cellText,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fb,
  fbt,
  FLOOR_Y,
  FOOD,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  LEVER_X,
  payoff,
  PRESS_COST,
  RELAY_AT,
  SFX,
  SHOTS,
  SMALL_AT_TROUGH,
  SMALL_FIRST,
  TERM,
  TITLE,
  TITLE_EN,
  TITLE_SUB,
  TROUGH_X,
} from './timeline';

/**
 * ep36 智猪博弈（黑金光影风，无口播）。
 * 一个猪圈贯穿全片：开场大猪按拉杆、食粒顺着管子流进食槽、小猪早就在槽边吃上了；17.45 秒金粒子聚成标题；
 * 1979 年的斯金纳箱 → 课本的数字卡 → 收益矩阵（箭头一步步推到纳什均衡）→ 回落段 11 下硬拍大猪来回跑 → 102.52 秒砸出「等」；
 * 结尾 4 : 4、两只都躺平就 0 : 0，猪圈回来，抛问题。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];
const restDir = (x: number): 1 | -1 => (x < 960 ? -1 : 1);
/** 槽里的食：每次落槽满一次，dur 帧吃完 */
const foodAt = (f: number, drops: number[], dur = 60) => clamp01(drops.reduce((s, d) => s + (f >= d ? Math.max(0, 1 - (f - d) / dur) : 0), 0));
const eating = (f: number, food: number) => (food > 0.05 ? 0.5 + 0.5 * Math.sin(f / 3) : 0);

/* ---------- 开场 ---------- */
const HOOK_PRESS = [fbt(0), fbt(13)];
const HOOK_FLOW: [number, number][] = [
  [fbt(0), fbt(5)],
  [fbt(13), fbt(15)],
];
const HOOK_BIG: [number, number][] = [
  [0, BIG_AT_LEVER],
  [fbt(2), BIG_AT_LEVER],
  [fbt(9), BIG_AT_TROUGH],
  [fbt(10), BIG_AT_TROUGH],
  [fbt(13) - 2, BIG_AT_LEVER],
  [fbt(14), BIG_AT_LEVER],
  [fbt(21), BIG_AT_TROUGH],
];

/* ---------- 1979 ---------- */
const BOX_PRESS = [44, 56, 58, 60, 62].map(fbt);
const BOX_FLOW: [number, number][] = BOX_PRESS.map((p) => [p, p + 22]);

/* ---------- 回落段：双数下按拉杆，单数下到食槽 ---------- */
const RELAY_PRESS = RELAY_AT.filter((_, i) => i % 2 === 0);
const RELAY_FLOW: [number, number][] = RELAY_PRESS.map((p, k) => [p, RELAY_AT[2 * k + 1] ?? p + 26]);
const RELAY_BIG: [number, number][] = (() => {
  const k: [number, number][] = [
    [fb(40), BIG_AT_TROUGH],
    [fbt(163), BIG_AT_TROUGH],
  ];
  RELAY_AT.forEach((at, i) => {
    const prev = k[k.length - 1][0];
    const x = i % 2 === 0 ? BIG_AT_LEVER : BIG_AT_TROUGH;
    const leave = Math.max(prev + 3, at - fr2(1.6));
    k.push([leave, k[k.length - 1][1]]);
    k.push([at - 2, x]);
  });
  return k;
})();
function fr2(beats: number) {
  return Math.round(((BAR / 4) * beats * FPS));
}

/* ---------- 结尾：大猪每 4 拍跑一趟 ---------- */
const END_PRESS = [228, 236, 244].map(fbt);
const END_FLOW: [number, number][] = END_PRESS.map((p) => [p, p + 28]);
const END_BIG: [number, number][] = [
  [fb(56), BIG_AT_TROUGH],
  [fbt(225), BIG_AT_TROUGH],
  [fbt(228) - 2, BIG_AT_LEVER],
  [fbt(229), BIG_AT_LEVER],
  [fbt(232), BIG_AT_TROUGH],
  [fbt(233), BIG_AT_TROUGH],
  [fbt(236) - 2, BIG_AT_LEVER],
  [fbt(237), BIG_AT_LEVER],
  [fbt(240), BIG_AT_TROUGH],
  [fbt(241), BIG_AT_TROUGH],
  [fbt(244) - 2, BIG_AT_LEVER],
  [fbt(245), BIG_AT_LEVER],
  [fbt(248), BIG_AT_TROUGH],
];

export const Ep36Pigs: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const punch = barPunch(f, {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb});
  const redTone = inShot(f, SHOTS.empty);

  return (
    <AbsoluteFill
      style={{
        background: B.bg,
        overflow: 'hidden',
        scale: 0.997
      }}
    >
      <Audio src={staticFile('audio/ep36-boxed-pigs/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={file.endsWith('room.wav') ? DURATION : 75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <SmokeBg f={ff} tone={redTone ? 'red' : 'warm'} focus={[70, 70]} />

      <AbsoluteFill style={{transform: `scale(${1 + punch})`}}>
        {/* ---------- 开场：猪圈 ---------- */}
        {inShot(f, SHOTS.hook) && <HookPen f={ff} />}

        {/* ---------- 标题 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <FormulaField f={f} at={HIT} items={['Press', 'Wait', '4 , 4', '9 , −1', '5 , 1', '0 , 0', 'Nash', '1979', '10 − 2']} out={SHOTS.title[1] - 14} seed={36} />
            <SparkTitle f={f} at={HIT} title={TITLE} en={TITLE_EN} sub={TITLE_SUB} y={420} size={180} out={SHOTS.title[1] - 14} instant />
          </>
        )}

        {/* ---------- 1979：斯金纳箱 ---------- */}
        {inShot(f, SHOTS.box) && <BoxPen f={f} />}

        {/* ---------- 课本的数字 ---------- */}
        {inShot(f, SHOTS.numbers) && <Numbers f={f} />}

        {/* ---------- 收益矩阵 ---------- */}
        {inShot(f, SHOTS.matrix) && <Matrix f={f} />}

        {/* ---------- 回落段：大猪来回跑 ---------- */}
        {(inShot(f, SHOTS.relay) || inShot(f, SHOTS.build)) && <RelayPen f={ff} />}

        {/* ---------- 第二个爆点：等 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TickRing f={f} at={HIT2} cy={440} r={410} step={2} out={SHOTS.hit2[1] - 12} />
            <GlowSmash f={f} at={HIT2} text={ANCHOR} size={300} sub={TERM} y={440} />
          </>
        )}

        {/* ---------- 4 : 4 ---------- */}
        {inShot(f, SHOTS.payoff) && <Payoff f={f} />}

        {/* ---------- 都躺平：0 : 0 ---------- */}
        {inShot(f, SHOTS.empty) && <Empty f={f} />}

        {/* ---------- 结尾 ---------- */}
        {inShot(f, SHOTS.end) && <EndPen f={f} />}
      </AbsoluteFill>

      {/* ---------- 字幕 ---------- */}
      {CUES.map(([b, cn, en], i) => {
        if (!cn) return null;
        const a = cueStart(i);
        const e = HALF_BEATS.includes(b) ? (b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : cueEnd(i);
        if (f < a - 2 || f > e + 14) return null;
        const last = i === CUES.length - 1;
        return <BGCaption key={i} f={ff} at={a} text={cn} en={en} out={HALF_BEATS.includes(b) ? e : last ? undefined : e - 12} y={last ? 560 : 950} size={last ? 76 : 56} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ================= 各段画面 ================= */

/** 每一轮：小猪先到吃 SMALL_FIRST 份，大猪吃剩下的，按的那只耗 PRESS_COST */
const BIG_EAT = FOOD - SMALL_FIRST;

const HookPen: React.FC<{f: number}> = ({f}) => {
  const b = track(f, HOOK_BIG, restDir);
  const food = foodAt(f, HOOK_FLOW.map(([, d]) => d));
  // 第 24 拍起镜头推近小猪
  const push = keyframes(f, [
    [fbt(24), 0],
    [HIT, 1],
  ]);
  const lie = f >= fbt(16);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.22 * push})`, transformOrigin: '76% 66%', opacity: clamp01((f + 1) / 6)}}>
      <PigPen
        f={f}
        presses={HOOK_PRESS}
        flows={HOOK_FLOW}
        big={{x: b.x, dir: b.dir, pose: b.moving ? 'run' : 'stand', speed: b.speed, sweat: b.moving ? 1 : 0}}
        small={{x: SMALL_AT_TROUGH, dir: 1, pose: lie ? 'lie' : 'stand', eat: eating(f, food), tone: f < fbt(7) ? 'dim' : 'cyan', zzz: lie && food < 0.1 ? 1 : 0}}
        food={food}
        leverX={LEVER_X}
        troughX={TROUGH_X}
        floorY={FLOOR_Y}
        bigLabel="大猪"
        smallLabel="小猪"
        labelOn={vis(f, fbt(8), fbt(24), 10, 10)}
      />
    </AbsoluteFill>
  );
};

const BoxPen: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.box;
  const food = foodAt(f, BOX_FLOW.map(([, d]) => d));
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 14, 12)}}>
      <ChapterTag f={f} at={s0} cn="实验 · 1979" en="A box with two pigs" out={s1 - 12} />
      <CiteLine f={f} at={s0 + 6} line1="Baldwin & Meese · 1979" line2="Animal Behaviour 27 : 947–957" out={s1 - 12} />
      <div style={{position: 'absolute', inset: 0, transform: 'translateY(40px) scale(0.92)', transformOrigin: '50% 70%'}}>
        {/* 斯金纳箱：一圈细金框，像实验室的玻璃箱 */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={110} y={150} width={1700} height={FLOOR_Y - 150} fill="none" stroke="rgba(111,224,210,0.3)" strokeWidth={2} strokeDasharray="14 10" opacity={clamp01((f - s0 - 6) / 14)} />
          <text x={130} y={185} fontFamily={BF.latin} fontSize={22} letterSpacing={6} fill="rgba(111,224,210,0.55)">
            SKINNER BOX
          </text>
        </svg>
        <PigPen
          f={f}
          presses={BOX_PRESS}
          flows={BOX_FLOW}
          big={{x: BIG_AT_LEVER, dir: -1, pose: 'stand'}}
          small={{x: SMALL_AT_TROUGH, dir: 1, pose: 'stand', eat: eating(f, food)}}
          food={food}
          leverX={LEVER_X}
          troughX={TROUGH_X}
          floorY={FLOOR_Y}
          labels={['面板', '食槽']}
          bigLabel="强的那只"
          smallLabel="弱的那只"
          labelOn={clamp01((f - fbt(52)) / 12)}
        />
      </div>
      {/* 每按一下，强的那只头上记一笔 */}
      <div style={{position: 'absolute', left: BIG_AT_LEVER - 140, width: 280, top: 300, textAlign: 'center', fontFamily: BF.latinBold, fontSize: 40, letterSpacing: 8, ...glowText(B.gold, 12)}}>
        {'|'.repeat(BOX_PRESS.filter((p) => f >= p).length)}
      </div>
    </AbsoluteFill>
  );
};

const Numbers: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.numbers;
  const out = s1 - 12;
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 12)}}>
      <ChapterTag f={f} at={s0} cn="课本里的数字" en="Putting numbers on it" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="Rasmusen · Games and Information" line2="Table 1.6 · Boxed Pigs" out={out} />
      <GlowCard f={f} at={fbt(72)} x={150} y={250} w={500} h={460} color={B.goldWarm} out={out}>
        <OutcomeCard title="按一次" lines={['掉下 10 份食', '按的那只耗 2 份']} big="−2" bigColor={B.red} note="跑一趟的代价" />
      </GlowCard>
      <GlowCard f={f} at={fbt(80)} x={710} y={250} w={500} h={460} color={B.red} out={out}>
        <OutcomeCard title="小猪去按" lines={['大猪守在槽边先吃', '小猪只剩 1 份']} big="−1" bigColor={B.red} note="小猪净得 = 1 − 2" />
      </GlowCard>
      <GlowCard f={f} at={fbt(88)} x={1270} y={250} w={500} h={460} color={B.cyan} out={out}>
        <OutcomeCard title="大猪去按" lines={['小猪先到，吃 4 份', '大猪吃剩下的 6 份']} big="4 : 4" bigColor={B.cyan} note="净得：大猪 6 − 2 · 小猪 4" />
      </GlowCard>
    </AbsoluteFill>
  );
};

const MX = 400;
const MY = 330;
const CW = 280;
const CH = 160;
/** 纳什均衡那一格（大猪按、小猪等）的中心：矩阵最后推进这一格，落进猪圈 */
const NASH_CX = MX + CW * 1.5;
const NASH_CY = MY + CH / 2;
const Matrix: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.matrix;
  const sub = '大猪 , 小猪';
  // 第 120 拍：「等」这一列整列亮金框
  const col = vis(f, fbt(120), fbt(130), 8, 10);
  // 收尾 20 帧：镜头推进纳什均衡那一格
  const dive = Math.pow(clamp01((f - (s1 - 20)) / 20), 2);
  const PRESS = {label: '按', color: B.cyan};
  const WAIT = {label: '等', color: B.red};
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 10)}}>
      <ChapterTag f={f} at={s0} cn="收益矩阵" en="The payoff matrix" out={s1 - 24} />
      <AbsoluteFill style={{transform: `scale(${1 + 5 * dive})`, transformOrigin: `${NASH_CX}px ${NASH_CY}px`}}>
        <PayoffMatrix
          f={f}
          at={s0 + 4}
          x={MX}
          y={MY}
          cw={CW}
          ch={CH}
          rows={['大猪 按', '大猪 等']}
          cols={['小猪 按', '小猪 等']}
          cells={[
            [
              {main: cellText('press', 'press'), sub},
              {main: cellText('press', 'wait'), sub},
            ],
            [
              {main: cellText('wait', 'press'), sub},
              {main: cellText('wait', 'wait'), sub},
            ],
          ]}
          arrows={[
            {from: [0, 0], to: [0, 1], at: fbt(108)},
            {from: [1, 0], to: [1, 1], at: fbt(116)},
            {from: [1, 1], to: [0, 1], at: fbt(136)},
          ]}
          hi={[{cell: [0, 1], color: 'red', at: fbt(152), label: '纳什均衡', note: '大猪按 · 小猪等'}]}
        />
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={MX + CW - 4} y={MY - 80} width={CW + 8} height={CH * 2 + 88} fill="none" stroke={B.gold} strokeWidth={3} opacity={col} style={{filter: `drop-shadow(0 0 14px ${B.gold})`}} />
        </svg>
        {/* 左边一只大猪、上边一只小猪，告诉观众行 / 列是谁 */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01((f - s0 - 10) / 14)}}>
          <g transform={`translate(${MX - 300} ${MY + CH + 60})`}>
            <GlowPigG tone="lit" size={110} t={f} seed={3} sweat={f >= fbt(136) ? 1 : 0} />
          </g>
          <g transform={`translate(${MX + CW - 40} ${MY - 90})`}>
            <GlowPigG tone="cyan" size={66} t={f} seed={8} pose={f >= fbt(120) ? 'lie' : 'stand'} zzz={f >= fbt(120) ? 1 : 0} />
          </g>
        </svg>
      </AbsoluteFill>
      {/* 右边的天平：先替小猪称（两种情况都往「等」沉），再替大猪称（往「按」沉） */}
      <BalanceScale
        f={f}
        at={fbt(104)}
        cx={1500}
        cy={360}
        w={460}
        title="小猪的天平"
        left={PRESS}
        right={WAIT}
        phases={[
          {at: fbt(108), l: payoff('press', 'press')[1], r: payoff('press', 'wait')[1]},
          {at: fbt(116), l: payoff('wait', 'press')[1], r: payoff('wait', 'wait')[1]},
        ]}
        out={fbt(127)}
      />
      <BalanceScale
        f={f}
        at={fbt(128)}
        cx={1500}
        cy={360}
        w={460}
        title="大猪的天平"
        left={PRESS}
        right={WAIT}
        phases={[{at: fbt(136), l: payoff('press', 'wait')[0], r: payoff('wait', 'wait')[0]}]}
        out={fbt(150)}
      />
    </AbsoluteFill>
  );
};

const RelayPen: React.FC<{f: number}> = ({f}) => {
  const b = track(f, RELAY_BIG, restDir);
  const drops = RELAY_FLOW.map(([, d]) => d);
  const food = foodAt(f, drops, 40);
  const presses = RELAY_PRESS.filter((p) => f >= p).length;
  const eaten = drops.filter((d) => f >= d).length;
  // 从矩阵那一格落进来：先大后正
  const land = 1 - Math.pow(clamp01((f - SHOTS.relay[0]) / 24), 2);
  return (
    <AbsoluteFill style={{opacity: clamp01((f - SHOTS.relay[0]) / 10), transform: `scale(${1 + 0.25 * land})`}}>
      <div style={{position: 'absolute', inset: 0, transform: 'translateY(40px) scale(0.94)', transformOrigin: '50% 100%'}}>
        <PigPen
          f={f}
          presses={RELAY_PRESS}
          flows={RELAY_FLOW}
          big={{x: b.x, dir: b.dir, pose: b.moving ? 'run' : 'stand', speed: b.speed, sweat: 1}}
          small={{x: SMALL_AT_TROUGH, dir: 1, pose: 'lie', eat: eating(f, food), zzz: food < 0.1 ? 1 : 0}}
          food={food}
          leverX={LEVER_X}
          troughX={TROUGH_X}
          floorY={FLOOR_Y}
        />
      </div>
      {/* 对账：大猪吃得多、跑得也多，净得一直和小猪咬在一起 */}
      <Ledger
        f={f}
        at={fbt(164)}
        x={560}
        y={8}
        cols={['吃到', '跑腿', '净得']}
        hiCol={2}
        bumps={[...RELAY_PRESS, ...drops]}
        rows={[
          {label: '大猪', color: '#fff1c4', vals: [BIG_EAT * eaten, -PRESS_COST * presses, BIG_EAT * eaten - PRESS_COST * presses]},
          {label: '小猪', color: B.cyan, vals: [SMALL_FIRST * eaten, 0, SMALL_FIRST * eaten]},
        ]}
      />
    </AbsoluteFill>
  );
};

const Payoff: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.payoff;
  const n = clamp01((f - fbt(204)) / 10);
  const ghost = clamp01((f - fbt(208)) / 12);
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 12, 10)}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g transform="translate(470 760)">
          <GlowPigG tone="lit" size={230} pose="run" t={f} dir={1} sweat={1} speed={0.6} seed={3} />
        </g>
        <g transform="translate(1180 760)">
          <GlowPigG tone="cyan" size={160} pose="lie" t={f} zzz={1} seed={8} />
        </g>
      </svg>
      {/* 大猪吃到 6 份，2 份变成汗飞走；小猪吃到 4 份 */}
      <PelletStack f={f} at={fbt(200)} x={790} y={760} n={BIG_EAT} stagger={4} size={58} leave={PRESS_COST} leaveAt={fbt(202) + 6} leaveLabel="跑腿 −2" label="吃到 6 份" />
      <PelletStack f={f} at={fbt(200) + 8} x={1420} y={760} n={SMALL_FIRST} stagger={4} size={58} label="吃到 4 份" />
      {[
        [620, '跑断腿', B.ink],
        [1300, '躺着', B.cyan],
      ].map(([x, label, c]) => (
        <div key={label as string} style={{position: 'absolute', left: (x as number) - 200, width: 400, top: 110, textAlign: 'center', opacity: n, transform: `scale(${1.15 - 0.15 * n})`}}>
          <div style={{fontFamily: BF.latinBold, fontSize: 180, lineHeight: 1, ...glowText(B.gold, 26)}}>4</div>
          <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 36, marginTop: 6, ...glowText(c as string, 10, 0.6)}}>净得 · {label as string}</div>
        </div>
      ))}
      <div style={{position: 'absolute', left: 1300 - 240, width: 480, top: 840, textAlign: 'center', opacity: ghost, fontFamily: BF.cn, fontSize: 28, color: B.inkDim}}>
        换它自己去按：<span style={{fontFamily: BF.latinBold, fontSize: 40, ...glowText(B.red, 10)}}>1</span>
      </div>
    </AbsoluteFill>
  );
};

const Empty: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.empty;
  const growl = (x: number, seed: number) =>
    [0, 1].map((i) => {
      const k = ((f - s0 + i * 22 + seed * 9) % 44) / 44;
      return (
        <div key={`${seed}-${i}`} style={{position: 'absolute', left: x - 60 + k * 30, top: 560 - k * 90, fontFamily: BF.cn, fontWeight: 900, fontSize: 34 + k * 10, opacity: Math.sin(k * Math.PI) * 0.8 * clamp01((f - fbt(217)) / 8), ...glowText(B.red, 10, 0.6)}}>
          咕……
        </div>
      );
    });
  return (
    <AbsoluteFill style={{opacity: vis(f, s0, s1, 10, 10)}}>
      <PigPen
        f={f}
        presses={[]}
        flows={[]}
        big={{x: BIG_AT_TROUGH - 200, dir: 1, pose: 'lie', tone: 'dim'}}
        small={{x: SMALL_AT_TROUGH, dir: 1, pose: 'lie', tone: 'dim'}}
        food={0}
        leverX={LEVER_X}
        troughX={TROUGH_X}
        floorY={FLOOR_Y}
        spot={[0.2, 0.5]}
        flicker={1}
      />
      {growl(BIG_AT_TROUGH - 200, 1)}
      {growl(SMALL_AT_TROUGH + 20, 2)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', opacity: clamp01((f - fbt(216) - 4) / 10)}}>
        <span style={{fontFamily: BF.latinBold, fontSize: 200, ...glowText(B.red, 26)}}>0 : 0</span>
      </div>
    </AbsoluteFill>
  );
};

const EndPen: React.FC<{f: number}> = ({f}) => {
  const b = track(f, END_BIG, restDir);
  const food = foodAt(f, END_FLOW.map(([, d]) => d));
  const dimQ = clamp01((f - fbt(240)) / 16);
  return (
    <AbsoluteFill style={{opacity: clamp01((f - SHOTS.end[0]) / 14) * (1 - 0.8 * dimQ)}}>
      <PigPen
        f={f}
        presses={END_PRESS}
        flows={END_FLOW}
        big={{x: b.x, dir: b.dir, pose: b.moving ? 'run' : 'stand', speed: b.speed, sweat: b.moving ? 1 : 0}}
        small={{x: SMALL_AT_TROUGH, dir: 1, pose: 'lie', eat: eating(f, food), zzz: food < 0.1 ? 1 : 0}}
        food={food}
        leverX={LEVER_X}
        troughX={TROUGH_X}
        floorY={FLOOR_Y}
        bigLabel="大猪"
        smallLabel="小猪"
        labelOn={vis(f, fbt(224), fbt(240), 12, 12)}
      />
    </AbsoluteFill>
  );
};
