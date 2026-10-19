import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut, rand} from '../../library/anim';
import {RedStamp} from '../../library/gilded/props';
import {Dust, GCaption, GildedBg, Grain} from '../../library/gilded/stage';
import {G, GF, goldText, goldTextLight} from '../../library/gilded/theme';
import {ANCHOR, barSec, CUES, cueEnd, cueStart, DARK_FROM, DURATION, FILL_LEN, FREEZE, fr, grainsUpTo, groupDigits, HIT, HIT2, litCells, SFX, SHOTS, TERM, totalTonnes, yearsOfWheat} from './timeline';

/**
 * ep23 棋盘上的麦粒（无口播）：锚词「一点点」。
 * 0–17.4 秒一个连续长镜头：一粒发光的麦子 → 镜头拉远露出棋盘 → 前几格按拍点亮 → 收暗静止；
 * 17.45 秒随重拍砸出锚词；之后棋盘铺满、指数曲线、称重（第二个小爆点）、锚词重新定义、光缩回一粒麦子抛问题。
 */

/** 段落可见度：a 到 b 之间可见，两头各 fin / fout 帧柔入柔出 */
const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));

/* ---------------- 棋盘 ---------------- */

const CELL = 76;
const BOARD = CELL * 8;
/** 第 n 格（1 起）在棋盘内的格坐标：蛇形走位 */
const cellPos = (n: number) => {
  const i = n - 1;
  const row = Math.floor(i / 8);
  const col = row % 2 === 0 ? i % 8 : 7 - (i % 8);
  return {row, col};
};

/** 一格里的麦粒：前 6 格真的画出 2^(n-1) 粒 */
const Grains: React.FC<{n: number; show: number; big?: boolean}> = ({n, show, big}) => {
  const count = 2 ** (n - 1);
  return (
    <svg width={CELL} height={CELL} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {Array.from({length: count}, (_, i) => {
        const a = rand(n * 97 + i) * Math.PI * 2;
        const r = count === 1 ? 0 : Math.sqrt(rand(n * 131 + i)) * CELL * 0.3;
        const x = CELL / 2 + Math.cos(a) * r;
        const y = CELL / 2 + Math.sin(a) * r;
        const rx = big ? 5.2 : 3.2;
        return <ellipse key={i} cx={x} cy={y} rx={rx} ry={rx * 0.58} transform={`rotate(${count === 1 ? -30 : rand(n * 7 + i) * 180} ${x} ${y})`} fill={G.goldBright} opacity={show} style={big ? {filter: `drop-shadow(0 0 4px ${G.goldBright})`} : undefined} />;
      })}
    </svg>
  );
};

/** 棋盘：litAt(n) 给出第 n 格点亮的帧，f 为当前帧 */
const Chessboard: React.FC<{f: number; lit: number; litAt: (n: number) => number; gridAlpha?: number}> = ({f, lit, litAt, gridAlpha = 1}) => (
  <div style={{position: 'relative', width: BOARD, height: BOARD, border: `1.5px solid rgba(214,180,106,${0.55 * gridAlpha})`, boxShadow: `0 30px 80px rgba(0,0,0,${0.7 * gridAlpha})`}}>
    {Array.from({length: 64}, (_, i) => {
      const n = i + 1;
      const {row, col} = cellPos(n);
      const dark = (row + col) % 2 === 1;
      const on = n <= lit;
      const pop = on ? clamp01((f - litAt(n)) / 8) : 0;
      const heat = (n - 1) / 63;
      return (
        <div
          key={n}
          style={{
            position: 'absolute',
            left: col * CELL,
            top: row * CELL,
            width: CELL,
            height: CELL,
            background: dark ? `rgba(239,230,210,${0.035 * gridAlpha})` : `rgba(0,0,0,${0.35 * gridAlpha})`,
            borderRight: `1px solid rgba(214,180,106,${0.18 * gridAlpha})`,
            borderBottom: `1px solid rgba(214,180,106,${0.18 * gridAlpha})`,
          }}
        >
          {on ? (
            <>
              <div style={{position: 'absolute', inset: 2, background: `rgba(214,180,106,${0.05 + heat * 0.3})`, opacity: pop}} />
              {n <= 6 ? (
                <Grains n={n} show={pop} big={n === 1} />
              ) : (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pop}}>
                  <span style={{fontFamily: GF.num, fontSize: n <= 14 ? (n > 10 ? 17 : 22) : 30, color: G.ivory, textShadow: '0 1px 4px rgba(0,0,0,0.8)'}}>
                    {n <= 14 ? groupDigits(1n << BigInt(n - 1)) : '2'}
                    {n > 14 ? <sup style={{fontSize: 15, marginLeft: 1}}>{n - 1}</sup> : null}
                  </span>
                </div>
              )}
            </>
          ) : null}
        </div>
      );
    })}
  </div>
);

/* ---------------- 开场长镜头：一粒麦子 → 棋盘 ---------------- */

const BEAT = 2.136 / 4;
/** 开场段每格点亮的帧：第 1 格一开始就亮，2–5 格从第 4 小节起按拍亮，第 6 格在第 6 小节 */
const introLitAt = (n: number) => {
  if (n === 1) return -10;
  if (n <= 5) return fr(barSec(4) + (n - 2) * BEAT);
  if (n === 6) return fr(barSec(6));
  return Infinity;
};

const OpeningShot: React.FC<{f: number}> = ({f}) => {
  // 收暗后最后 FREEZE 帧完全静止
  const fc = Math.min(f, HIT - FREEZE);
  const pull = easeInOut(clamp01((fc - fr(1.2)) / (fr(barSec(4)) - fr(1.2))));
  const scale = 7 - 6 * pull + 0.05 * clamp01((fc - fr(barSec(6))) / fr(4));
  const c1 = cellPos(1);
  const focus = {x: (c1.col + 0.5) * CELL * (1 - pull) + (BOARD / 2) * pull, y: (c1.row + 0.5) * CELL * (1 - pull) + (BOARD / 2) * pull};
  let lit = 0;
  for (let n = 1; n <= 6; n++) if (fc >= introLitAt(n)) lit = n;
  // 第一秒的视觉锚点：麦粒周围一圈呼吸的光，跟着麦粒在屏幕上的位置走
  const halo = 1 - pull;
  const tx = 960 - focus.x * scale;
  const ty = 450 - focus.y * scale;
  const gx = tx + (c1.col + 0.5) * CELL * scale;
  const gy = ty + (c1.row + 0.5) * CELL * scale;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${scale})`}}>
        <Chessboard f={fc} lit={lit} litAt={introLitAt} gridAlpha={0.25 + 0.75 * pull} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: gx - 260,
          top: gy - 260,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(243,220,160,0.32) 0%, rgba(243,220,160,0.08) 40%, rgba(0,0,0,0) 70%)',
          opacity: halo * (0.8 + 0.2 * Math.sin(fc / 9)) * clamp01(fc / 10),
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- 爆点：大字砸出 ---------------- */

const Smash: React.FC<{f: number; at: number; text: string; size: number; sub?: string; ring?: number; flash?: number; y?: number}> = ({f, at, text, size, sub, ring = 1300, flash = 1, y = 450}) => {
  const t = f - at;
  if (t < 0) return null;
  const s = 1.12 - 0.12 * clamp01(t / 8) + 0.008 * Math.sin(t / 14);
  // 光环从字的背后（约字宽一半）开始往外扩，不在字上留一个小圈
  const r0 = size * 1.6;
  const r = r0 + (ring - r0) * (1 - Math.pow(1 - clamp01(t / 40), 3));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 55% at 50% ${(y / 1080) * 100}%, rgba(255,226,160,${0.55 * flash}) 0%, rgba(214,160,80,${0.18 * flash}) 40%, rgba(0,0,0,0) 75%)`, opacity: 1 - clamp01(t / 26) * 0.75}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={960} cy={y} r={r} fill="none" stroke={G.goldBright} strokeWidth={3 - 2 * clamp01(t / 40)} opacity={(1 - clamp01(t / 40)) * 0.8} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
        <circle cx={960} cy={y} r={r * 0.72} fill="none" stroke={G.gold} strokeWidth={1} opacity={(1 - clamp01(t / 34)) * 0.5} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.62, textAlign: 'center', transform: `scale(${s})`}}>
        <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: size, letterSpacing: size * 0.14, ...goldText(1.2)}}>{text}</span>
      </div>
      {sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 0.55, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((t - 18) / 14), filter: `blur(${(1 - clamp01((t - 18) / 14)) * 6}px)`}}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- 铺满 + 指数曲线 ---------------- */

/** litCells 的反函数：铺满段里第 n 格点亮的帧 */
const fillLitAt = (start: number) => (n: number) => (n <= 6 ? -100 : start + FILL_LEN * Math.pow((n - 6) / 58, 1 / 1.6));

const ExpCurve: React.FC<{t: number; w: number; h: number}> = ({t, w, h}) => {
  const draw = clamp01(t / 40);
  const pts = (from: number, to: number) => {
    const out: string[] = [];
    for (let n = from; n <= to; n++) out.push(`${n === from ? 'M' : 'L'}${(((n - 1) / 63) * w).toFixed(1)} ${(h - Math.pow(2, n - 64) * h).toFixed(1)}`);
    return out.join(' ');
  };
  // 最后一格（第 63 → 64 格）单独描成朱红：它一格就比前面所有格子加起来还多
  const last = clamp01((t - 40) / 14);
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <line x1={0} x2={w} y1={h} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={0} y1={0} y2={h} stroke={G.goldLine} />
      {[1, 32, 64].map((n) => (
        <text key={n} x={((n - 1) / 63) * w} y={h + 30} textAnchor="middle" fontFamily={GF.num} fontSize={20} fill={G.ivoryFaint}>
          第 {n} 格
        </text>
      ))}
      <path d={pts(1, 63)} fill="none" stroke={G.goldBright} strokeWidth={2.4} pathLength={1} strokeDasharray={`${draw} 1`} style={{filter: `drop-shadow(0 0 6px ${G.gold})`}} />
      <path d={pts(63, 64)} fill="none" stroke={G.red} strokeWidth={3.4} pathLength={1} strokeDasharray={`${last} 1`} style={{filter: `drop-shadow(0 0 8px ${G.red})`}} />
      {last > 0 ? <circle cx={w} cy={0} r={7} fill={G.goldBright} opacity={last} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} /> : null}
    </svg>
  );
};

const FillShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.fill;
  const t = f - a;
  const lit = litCells(t);
  // 第 10 小节：棋盘缩到左边，右边画出指数曲线（同一个画面里过渡，不切）
  const toCurve = easeInOut(clamp01((f - fr(barSec(10))) / 20));
  const boardScale = 1 - 0.32 * toCurve;
  const boardX = 960 - BOARD / 2 - 520 * toCurve;
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b)}}>
      <div style={{position: 'absolute', left: boardX, top: 110 + 60 * toCurve, transformOrigin: '0 0', transform: `scale(${boardScale})`}}>
        <Chessboard f={f} lit={lit} litAt={fillLitAt(a)} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 750, textAlign: 'center', opacity: 1 - toCurve}}>
        <span style={{fontFamily: GF.num, fontSize: 56, ...goldTextLight(0.5)}}>{groupDigits(grainsUpTo(lit))}</span>
        <span style={{fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, marginLeft: 10}}>粒</span>
      </div>
      <div style={{position: 'absolute', left: 820, top: 230, opacity: toCurve}}>
        <ExpCurve t={f - fr(barSec(10)) - 8} w={880} h={500} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 称重 + 第二个爆点 ---------------- */

const WeightBar: React.FC<{label: string; value: string; p: number; color: string}> = ({label, value, p, color}) => (
  <div style={{width: 1400}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: GF.cn}}>
      <span style={{fontSize: 30, fontWeight: 700, color}}>{label}</span>
      <span style={{fontSize: 26, color: G.ivoryDim}}>{value}</span>
    </div>
    <div style={{position: 'relative', height: 26, marginTop: 14, border: `1px solid ${G.goldFaint}`, background: 'rgba(239,230,210,0.04)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: p > 0 ? Math.max(6, p * 1398) : 0, background: `linear-gradient(90deg, rgba(0,0,0,0), ${color})`, boxShadow: `0 0 14px ${color}`}} />
    </div>
  </div>
);

const WeighShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.weigh;
  const years = yearsOfWheat();
  const t = f - a;
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b)}}>
      <div style={{position: 'absolute', left: 260, top: 200, opacity: clamp01(t / 12)}}>
        <WeightBar label="全世界一年的小麦" value="约 8 亿吨" p={clamp01((t - 8) / 16) / years} color={G.gold} />
      </div>
      <div style={{position: 'absolute', left: 260, top: 330, opacity: clamp01((t - 6) / 12)}}>
        <WeightBar label="棋盘上的麦子" value={`约 ${Math.round(totalTonnes() / 1e8).toLocaleString('en-US')} 亿吨`} p={Math.pow(clamp01((t - 14) / (HIT2 - a - 14)), 2.2)} color={G.red} />
      </div>
      <Smash f={f} at={HIT2} text={`${Math.round(years).toLocaleString('en-US')} 年`} size={130} sub="的全球小麦产量" ring={700} flash={0.6} y={600} />
      <div style={{position: 'absolute', left: 1440, top: 560}}>
        <RedStamp f={f} at={HIT2 + 22} text="千年" size={96} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: GF.cn, fontSize: 17, color: G.ivoryFaint, opacity: clamp01((f - HIT2 - 20) / 14)}}>估算：每粒小麦约 0.05 克，全球小麦年产量约 8 亿吨</div>
    </AbsoluteFill>
  );
};

/* ---------------- 主组件 ---------------- */

export const Ep23Wheat: React.FC = () => {
  const f = useCurrentFrame();
  // 收暗：16.9 秒起压暗，重拍那一帧放开
  const dark = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const [ha, hb] = SHOTS.hit;
  const [ra, rb] = SHOTS.redefine;
  const [ca] = SHOTS.close;
  const closeT = f - ca;
  const shrink = clamp01(closeT / 36);
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <Audio src={staticFile('audio/ep23-wheat-chessboard/bgm.wav')} />
      <Audio src={staticFile('audio/ep23-wheat-chessboard/room.wav')} volume={1.4} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={60}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <GildedBg f={f} glow={[50, 44]} />
      <Dust f={f} />

      {f < HIT ? <OpeningShot f={f} /> : null}
      {/* 重拍：锚词砸出，第 9 小节前淡出 */}
      {f >= ha && f < hb + 12 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (hb - 12)) / 18)}}>
          <Smash f={f} at={HIT} text={ANCHOR} size={220} sub={TERM} />
        </AbsoluteFill>
      ) : null}
      {f >= SHOTS.fill[0] - 12 && f < SHOTS.fill[1] + 12 ? <FillShot f={f} /> : null}
      {f >= SHOTS.weigh[0] - 12 && f < SHOTS.weigh[1] + 12 ? <WeighShot f={f} /> : null}

      {/* 锚词重新出现：同一个词，这次是理解而不是不在乎；进入结尾时缩成一粒麦子 */}
      {f >= ra ? (
        <AbsoluteFill style={{opacity: vis(f, ra, rb + 30, 14, 30)}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', transform: `scale(${1 - 0.9 * easeInOut(shrink)})`, transformOrigin: '50% 120px'}}>
            <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 150, letterSpacing: 20, ...goldText(0.9)}}>{ANCHOR}</span>
          </div>
        </AbsoluteFill>
      ) : null}
      {f >= ca ? (
        <AbsoluteFill style={{opacity: clamp01((closeT - 20) / 20)}}>
          <div style={{position: 'absolute', left: 960 - 200, top: 450 - 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,220,160,0.3) 0%, rgba(243,220,160,0.06) 45%, rgba(0,0,0,0) 70%)', opacity: 0.85 + 0.15 * Math.sin(f / 9)}} />
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            <ellipse cx={960} cy={450} rx={14} ry={8} transform="rotate(-30 960 450)" fill={G.goldBright} style={{filter: `drop-shadow(0 0 10px ${G.goldBright})`}} />
          </svg>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />

      {CUES.map(([bar, zh, en], i) => {
        const at = cueStart(i);
        // 话说一半的那句（重拍前）随收暗一起退场，把空白留给锚词
        const out = bar === 7 ? DARK_FROM : cueEnd(i) - 12;
        if (f < at - 2 || f > out + 14) return null;
        return <GCaption key={i} f={f} at={at} out={out} text={zh} en={en} y={950} size={40} perChar={1} />;
      })}

      {/* 结尾 1 秒淡到黑 */}
      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 30)) / 30), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};
