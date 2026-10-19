import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, rand} from '../../library/anim';
import {G, GF, goldText, goldTextLight} from '../../library/gilded/theme';
import {CalendarRing, CX, CY, dotPos, WC_CELL} from './ring';
import {appearAt, curveUpTo, DAYS, DAYS_IN_YEAR, fb, fr, FREEZE, HIT, multipliedAt, pairs, pAllDiff, pct, pShared, WC_SHARED, WC_SQUAD, WC_TEAMS, YOU} from './timeline';

/**
 * ep24 各段画面。所有组件拿全局帧 f，自己按 timeline 里的小节算出场时间。
 */

/** 段落可见度：a 到 b 之间可见，两头各 fin / fout 帧柔入柔出 */
export const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));
/** 柔入：透明度 + 模糊 */
const softIn = (f: number, at: number, dur = 14) => {
  const v = clamp01((f - at) / dur);
  return {opacity: v, filter: `blur(${(1 - v) * 6}px)`};
};

/* ---------------- 开场长镜头：一个光点 → 日历环 ---------------- */

const countAt = (f: number) => DAYS.reduce((c, _, i) => c + (f >= appearAt(i) ? 1 : 0), 0);

export const OpeningShot: React.FC<{f: number}> = ({f}) => {
  // 收暗后最后 FREEZE 帧完全静止
  const fc = Math.min(f, HIT - FREEZE);
  const pull = easeInOut(clamp01((fc - fr(1.2)) / (fb(4) - fr(1.2))));
  const scale = 6 - 5 * pull + 0.04 * clamp01((fc - fb(4)) / fr(6));
  const you = dotPos(YOU);
  const focus = {x: you.x * (1 - pull) + CX * pull, y: you.y * (1 - pull) + CY * pull};
  const tx = 960 - focus.x * scale;
  const ty = 450 - focus.y * scale;
  const gx = tx + you.x * scale;
  const gy = ty + you.y * scale;
  const n = countAt(fc);
  const showCount = clamp01((fc - fb(4) + 6) / 12);
  const note = vis(fc, fb(6), fb(7) + 6, 14, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${scale})`}}>
        <CalendarRing f={fc} ringAlpha={0.2 + 0.8 * pull} youLabel={clamp01((fc - fb(3)) / 16)} />
      </div>
      {/* 第一秒的视觉锚点：光点周围一圈呼吸的光，跟着光点在屏幕上的位置走 */}
      <div
        style={{
          position: 'absolute',
          left: gx - 240,
          top: gy - 240,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(243,220,160,0.34) 0%, rgba(243,220,160,0.08) 40%, rgba(0,0,0,0) 70%)',
          opacity: (1 - pull) * (0.8 + 0.2 * Math.sin(fc / 9)) * clamp01(fc / 10),
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: CY - 92, textAlign: 'center', opacity: showCount, filter: `blur(${(1 - showCount) * 8}px)`}}>
        <span style={{fontFamily: GF.num, fontSize: 132, lineHeight: 1, ...goldText(0.7)}}>{n}</span>
        <span style={{fontFamily: GF.cn, fontSize: 34, color: G.ivoryDim, marginLeft: 12}}>人</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY + 62, textAlign: 'center', fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, opacity: note, filter: `blur(${(1 - note) * 6}px)`}}>
        撞上<span style={{...goldTextLight(0.4)}}>你</span>的生日：要 <span style={{fontFamily: GF.num, fontSize: 34, ...goldTextLight(0.4)}}>253</span> 人才过半
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 爆点：大字砸出（照 ep23 的 Smash） ---------------- */

export const Smash: React.FC<{f: number; at: number; text: string; size: number; sub?: string; ring?: number; flash?: number; y?: number; latin?: boolean}> = ({f, at, text, size, sub, ring = 1300, flash = 1, y = 450, latin}) => {
  const t = f - at;
  if (t < 0) return null;
  const s = 1.12 - 0.12 * clamp01(t / 8) + 0.008 * Math.sin(t / 14);
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
        <span style={{fontFamily: latin ? GF.num : GF.cn, fontWeight: latin ? 600 : 900, fontSize: size, letterSpacing: latin ? 2 : size * 0.14, ...goldText(1.2)}}>{text}</span>
      </div>
      {sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + size * 0.55, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((t - 18) / 14), filter: `blur(${(1 - clamp01((t - 18) / 14)) * 6}px)`}}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- 环心计数（随环一起移动） ---------------- */

export const CenterCount: React.FC<{value: string; unit: string; note?: React.ReactNode; size?: number}> = ({value, unit, note, size = 120}) => (
  <div style={{position: 'absolute', left: 0, width: 1920, top: CY - size * 0.68, textAlign: 'center'}}>
    <span style={{fontFamily: GF.num, fontSize: size, lineHeight: 1, ...goldText(0.7)}}>{value}</span>
    <span style={{fontFamily: GF.cn, fontSize: 34, color: G.ivoryDim, marginLeft: 12}}>{unit}</span>
    {note ? <div style={{fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, marginTop: 16}}>{note}</div> : null}
  </div>
);

/* ---------------- 连乘：所有人都错开 ---------------- */

/** 右侧面板：标题 + 大百分比 + 一行连乘式 + 一条缩短的金条（剩下的部分在第 18 小节填成「有人撞上」） */
export const ProductPanel: React.FC<{f: number}> = ({f}) => {
  const k = multipliedAt(f);
  const p = pAllDiff(k);
  const W = 820;
  const fill = clamp01((f - fb(18)) / 20);
  const factors = Array.from({length: k}, (_, i) => `${365 - i}/365`);
  const shown = factors.length <= 4 ? factors.join(' × ') : `${factors.slice(0, 3).join(' × ')} × … × ${factors[factors.length - 1]}`;
  return (
    <div style={{position: 'absolute', left: 900, top: 190, width: W}}>
      <div style={{fontFamily: GF.cn, fontSize: 28, color: G.ivoryDim, letterSpacing: 4, ...softIn(f, fb(13) + 10)}}>所有人都错开</div>
      <div style={{marginTop: 10, ...softIn(f, fb(13) + 18)}}>
        <span style={{fontFamily: GF.num, fontSize: 140, lineHeight: 1, ...goldText(0.8)}}>{pct(p)}</span>
      </div>
      <div style={{fontFamily: GF.num, fontSize: 30, color: G.ivory, marginTop: 24, height: 40, ...softIn(f, fb(14))}}>{k > 1 ? shown : ' '}</div>
      <div style={{position: 'relative', height: 30, marginTop: 34, border: `1px solid ${G.goldFaint}`, background: 'rgba(239,230,210,0.04)', ...softIn(f, fb(13) + 18)}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: W * p, background: `linear-gradient(90deg, rgba(214,180,106,0.2), ${G.gold})`, boxShadow: `0 0 14px ${G.gold}`}} />
        <div style={{position: 'absolute', left: W * p, top: 0, bottom: 0, width: (W - 2) * (1 - p) * fill, background: `linear-gradient(90deg, ${G.goldBright}, rgba(243,220,160,0.5))`, boxShadow: `0 0 18px ${G.goldBright}`}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: GF.cn, fontSize: 24}}>
        <span style={{color: G.ivoryDim, ...softIn(f, fb(17))}}>
          都错开 <span style={{fontFamily: GF.num}}>{pct(pAllDiff(23))}</span>
        </span>
        <span style={{color: G.goldBright, opacity: fill}}>
          有人撞上 <span style={{fontFamily: GF.num}}>{pct(pShared(23))}</span>
        </span>
      </div>
      <div style={{fontFamily: GF.cn, fontSize: 22, color: G.ivoryFaint, marginTop: 26, ...softIn(f, fb(14))}}>
        已经算到第 <span style={{fontFamily: GF.num, fontSize: 30, color: G.ivory}}>{k}</span> 个人
      </div>
    </div>
  );
};

/* ---------------- 概率曲线 ---------------- */

const N_MAX = 80;
/** [人数, 出现帧, 标签方位]：'rb' 右下、'lt' 左上、'b' 正下方 */
const MARKS: [number, number, 'rb' | 'lt' | 'b'][] = [
  [23, fb(19) + 20, 'rb'],
  [40, fb(20), 'lt'],
  [57, fb(21), 'lt'],
  [70, fb(22), 'b'],
];
/** 概率曲线：横轴人数 0–80，纵轴 0–100%；按 curveUpTo 画；23 / 40 / 57 / 70 人处各标一个金点 */
export const ProbCurve: React.FC<{f: number; w: number; h: number}> = ({f, w, h}) => {
  const upTo = curveUpTo(f);
  const X = (n: number) => (n / N_MAX) * w;
  const Y = (p: number) => h - p * h;
  let d = '';
  for (let n = 1; n <= Math.floor(upTo); n++) d += `${n === 1 ? 'M' : 'L'}${X(n).toFixed(1)} ${Y(pShared(n)).toFixed(1)}`;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <line x1={0} x2={w} y1={h} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={0} y1={0} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={w} y1={Y(0.5)} y2={Y(0.5)} stroke={G.goldFaint} strokeDasharray="6 8" />
      {[0.5, 1].map((p) => (
        <text key={p} x={-14} y={Y(p) + 7} textAnchor="end" fontFamily={GF.num} fontSize={22} fill={G.ivoryFaint}>
          {p * 100}%
        </text>
      ))}
      {[0, 20, 40, 60, 80].map((n) => (
        <text key={n} x={X(n)} y={h + 34} textAnchor="middle" fontFamily={GF.num} fontSize={22} fill={G.ivoryFaint}>
          {n}
        </text>
      ))}
      <text x={w} y={h + 70} textAnchor="end" fontFamily={GF.cn} fontSize={20} fill={G.ivoryFaint}>
        房间里的人数
      </text>
      <path d={d} fill="none" stroke={G.goldBright} strokeWidth={2.6} style={{filter: `drop-shadow(0 0 6px ${G.gold})`}} />
      {MARKS.map(([n, at, pos]) => {
        const o = clamp01((f - at) / 12) * clamp01((upTo - n + 0.5) / 2);
        if (o <= 0) return null;
        const dx = pos === 'rb' ? 16 : pos === 'lt' ? -16 : 0;
        const dy = pos === 'lt' ? -22 : pos === 'b' ? 50 : 40;
        return (
          <g key={n} opacity={o}>
            <circle cx={X(n)} cy={Y(pShared(n))} r={8} fill={G.goldBright} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
            <text x={X(n) + dx} y={Y(pShared(n)) + dy} textAnchor={pos === 'rb' ? 'start' : pos === 'lt' ? 'end' : 'middle'} fontFamily={GF.num} fontSize={28} fill={G.goldBright}>
              {n} 人 · {pct(pShared(n))}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------- 世界杯：32 支球队的小环 ---------------- */

const WC_COLS = 8;
const cellCenter = (t: number) => ({x: WC_CELL.x + (t % WC_COLS) * 200, y: WC_CELL.y + Math.floor(t / WC_COLS) * 160});
/** 哪 16 支球队撞了生日（示意，确定性选出；第 0 支是从大环缩进来的那支，它撞了） */
const WC_HIT = (() => {
  const idx = Array.from({length: WC_TEAMS}, (_, i) => i).slice(1);
  idx.sort((a, b) => rand(a * 7 + 3) - rand(b * 7 + 3));
  return new Set([0, ...idx.slice(0, WC_SHARED - 1)]);
})();
/** 一支球队 23 人的生日（示意）：撞了的队最后一人和前面某人同一天，没撞的队 23 天各不相同 */
const squadDays = (t: number) => {
  const days: number[] = [];
  let s = t * 101 + 17;
  while (days.length < WC_SQUAD) {
    const d = 1 + Math.floor(rand(s++) * DAYS_IN_YEAR);
    if (!days.includes(d)) days.push(d);
  }
  if (WC_HIT.has(t)) days[WC_SQUAD - 1] = days[Math.floor(rand(t + 0.5) * (WC_SQUAD - 1))];
  return days;
};
const SQUADS = Array.from({length: WC_TEAMS}, (_, t) => squadDays(t));

export const WorldCup: React.FC<{f: number}> = ({f}) => {
  const [a, b] = [fb(26), fb(30)];
  const grid = vis(f, a + 20, b + 10, 18, 22);
  const mark = clamp01((f - fb(28)) / 30);
  const r = WC_CELL.r;
  const hitCount = Math.round(WC_SHARED * mark);
  return (
    <AbsoluteFill style={{opacity: grid}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, color: G.ivoryDim, letterSpacing: 4}}>
        <span style={{fontFamily: GF.num, fontSize: 40, ...goldTextLight(0.4)}}>2014</span> 世界杯 · <span style={{fontFamily: GF.num}}>{WC_TEAMS}</span> 支球队 · 每队 <span style={{fontFamily: GF.num}}>{WC_SQUAD}</span> 人
        <span style={{marginLeft: 40, opacity: mark}}>
          撞了生日 <span style={{fontFamily: GF.num, fontSize: 40, ...goldTextLight(0.5)}}>{hitCount}</span> / {WC_TEAMS}
        </span>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {SQUADS.map((days, t) => {
          const {x, y} = cellCenter(t);
          const hit = WC_HIT.has(t);
          const glow = hit ? mark : 0;
          const dupDay = hit ? days[WC_SQUAD - 1] : -1;
          return (
            <g key={t} opacity={hit ? 1 : 1 - 0.55 * mark}>
              <circle cx={x} cy={y} r={r} fill="none" stroke={hit ? G.goldBright : G.goldLine} strokeWidth={1 + glow} opacity={0.7 + 0.3 * glow} style={glow > 0 ? {filter: `drop-shadow(0 0 ${8 * glow}px ${G.gold})`} : undefined} />
              {days.map((d, i) => {
                const a2 = ((d - 1) / DAYS_IN_YEAR) * Math.PI * 2 - Math.PI / 2;
                const dup = d === dupDay;
                const rr = dup && i === WC_SQUAD - 1 ? r + 7 : r;
                return <circle key={i} cx={x + Math.cos(a2) * rr} cy={y + Math.sin(a2) * rr} r={dup ? 2.4 + 1.6 * glow : 2.2} fill={dup && glow > 0 ? G.goldBright : G.ivory} opacity={0.85} />;
              })}
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 866, textAlign: 'center', fontFamily: GF.cn, fontSize: 17, color: G.ivoryFaint, opacity: mark}}>
        示意图：每个小环是一支球队；统计来自 BBC 2014 年对世界杯 32 支球队名单的核对
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 1939 年：冯·米塞斯 ---------------- */

export const History: React.FC<{f: number}> = ({f}) => {
  const [a, b] = [fb(30), fb(32)];
  const v = vis(f, a, b + 6, 16, 18);
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...softIn(f, a + 8, 20)}}>
        <div style={{fontFamily: GF.latinItalic, fontSize: 76, ...goldText(0.6)}}>Richard von Mises</div>
        <div style={{fontFamily: GF.cn, fontSize: 30, color: G.ivoryDim, marginTop: 14, letterSpacing: 6}}>
          理查德·冯·米塞斯 · <span style={{fontFamily: GF.num}}>1883–1953</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: GF.num, fontSize: 44, color: G.ivory, ...softIn(f, a + 26, 22)}}>
        P = 1 − <span style={{display: 'inline-block', verticalAlign: 'middle', textAlign: 'center', fontSize: 34, lineHeight: 1.25}}>
          <span style={{display: 'block', borderBottom: `1.5px solid ${G.ivoryDim}`, padding: '0 10px'}}>365 × 364 × … × (365 − n + 1)</span>
          <span style={{display: 'block'}}>
            365<sup style={{fontSize: 22}}>n</sup>
          </span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 数字指纹：生日攻击 ---------------- */

const HEX = '9f3a 61c2 e07b 4d18';
const DocCard: React.FC<{label: string; seed: number}> = ({label, seed}) => (
  <div style={{width: 190, height: 240, padding: '22px 20px', background: 'linear-gradient(160deg, #e9dcbc, #cdb88c)', boxShadow: '0 14px 40px rgba(0,0,0,0.7)', transform: `rotate(${seed % 2 ? 2 : -2}deg)`}}>
    <div style={{fontFamily: GF.cn, fontSize: 26, fontWeight: 700, color: '#3a2a14'}}>{label}</div>
    {Array.from({length: 7}, (_, i) => (
      <div key={i} style={{height: 6, marginTop: 14, width: `${60 + rand(seed * 10 + i) * 40}%`, background: 'rgba(58,42,20,0.35)'}} />
    ))}
  </div>
);

export const Crypto: React.FC<{f: number}> = ({f}) => {
  const [a, b] = [fb(32), fb(34)];
  const v = vis(f, a, b + 6, 16, 18);
  const arrow = clamp01((f - a - 20) / 20);
  const match = clamp01((f - a - 44) / 16);
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, color: G.ivoryDim, letterSpacing: 6, ...softIn(f, fb(33))}}>
        生日攻击 · <span style={{fontFamily: GF.latinItalic}}>Birthday Attack</span>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', left: 380, top: 230 + i * 300, ...softIn(f, a + 6 + i * 8)}}>
          <DocCard label={i === 0 ? '文件 A' : '文件 B'} seed={i + 3} />
        </div>
      ))}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1].map((i) => (
          <line key={i} x1={620} y1={350 + i * 300} x2={620 + 360 * arrow} y2={350 + i * 300} stroke={G.goldLine} strokeWidth={2} />
        ))}
      </svg>
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', left: 1010, top: 320 + i * 300, fontFamily: GF.num, fontSize: 46, letterSpacing: 4, opacity: arrow, ...(match > 0 ? goldTextLight(0.6 * match) : {color: G.ivory})}}>
          {HEX}
        </div>
      ))}
      <div style={{position: 'absolute', left: 1010, top: 470, fontFamily: GF.cn, fontSize: 28, color: G.goldBright, opacity: match}}>
        指纹撞上了
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, ...softIn(f, fb(33) + 10)}}>
        <span style={{fontFamily: GF.num}}>128</span> 位指纹，约 <span style={{fontFamily: GF.num}}>2<sup>64</sup></span> 次尝试就可能撞上 —— 想要 <span style={{fontFamily: GF.num}}>128</span> 位的安全，指纹得 <span style={{fontFamily: GF.num, ...goldTextLight(0.4)}}>256</span> 位
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 平方增长：只算自己 vs 两两配对 ---------------- */

const P_MAX = 70;
export const PairsChart: React.FC<{f: number; w: number; h: number}> = ({f, w, h}) => {
  const draw = easeInOut(clamp01((f - fb(36) - 14) / 40));
  const top = pairs(P_MAX);
  const X = (n: number) => (n / P_MAX) * w;
  const Y = (v: number) => h - (v / top) * h;
  const upTo = 1 + (P_MAX - 1) * draw;
  let quad = '';
  let lin = '';
  for (let n = 1; n <= Math.floor(upTo); n++) {
    quad += `${n === 1 ? 'M' : 'L'}${X(n).toFixed(1)} ${Y(pairs(n)).toFixed(1)}`;
    lin += `${n === 1 ? 'M' : 'L'}${X(n).toFixed(1)} ${Y(n - 1).toFixed(1)}`;
  }
  const marks: [number, number, boolean][] = [
    [23, fb(36) + 30, true],
    [46, fb(36) + 44, false],
    [10, fb(37), true],
    [70, fb(37) + 10, false],
  ];
  const rocket = clamp01((f - fb(38)) / 16);
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <line x1={0} x2={w} y1={h} y2={h} stroke={G.goldLine} />
      <line x1={0} x2={0} y1={0} y2={h} stroke={G.goldLine} />
      {[0, 23, 46, 70].map((n) => (
        <text key={n} x={X(n)} y={h + 34} textAnchor="middle" fontFamily={GF.num} fontSize={22} fill={G.ivoryFaint}>
          {n}
        </text>
      ))}
      <text x={w} y={h + 70} textAnchor="end" fontFamily={GF.cn} fontSize={20} fill={G.ivoryFaint}>
        人数
      </text>
      <path d={lin} fill="none" stroke={G.ivoryDim} strokeWidth={2} />
      <path d={quad} fill="none" stroke={G.goldBright} strokeWidth={2.6 + 1.4 * rocket} style={{filter: `drop-shadow(0 0 ${6 + 10 * rocket}px ${G.gold})`}} />
      <text x={X(P_MAX) + 14} y={Y(P_MAX - 1) + 8} fontFamily={GF.cn} fontSize={22} fill={G.ivoryDim} opacity={draw}>
        和你撞的人：n − 1
      </text>
      <text x={X(38)} y={Y(1750)} textAnchor="end" fontFamily={GF.cn} fontSize={24} fill={G.goldBright} opacity={draw}>
        两两配对：n(n − 1)/2
      </text>
      {marks.map(([n, at, below]) => {
        const o = clamp01((f - at) / 12) * clamp01((upTo - n + 0.5) / 2);
        if (o <= 0) return null;
        return (
          <g key={n} opacity={o}>
            <circle cx={X(n)} cy={Y(pairs(n))} r={7} fill={G.goldBright} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
            <text x={X(n) + (below ? 14 : -14)} y={Y(pairs(n)) + (below ? -16 : 8)} textAnchor={below ? 'start' : 'end'} fontFamily={GF.num} fontSize={26} fill={G.goldBright}>
              {n} 人 · {pairs(n).toLocaleString('en-US')} 对
            </text>
          </g>
        );
      })}
      {f >= fb(36) + 44 ? (
        <text x={X(46) - 14} y={Y(pairs(46)) + 44} textAnchor="end" fontFamily={GF.num} fontSize={24} fill={G.ivoryDim} opacity={clamp01((f - fb(36) - 50) / 12)}>
          人数 ×2 → 配对 ×{(pairs(46) / pairs(23)).toFixed(1)}
        </text>
      ) : null}
    </svg>
  );
};

/* ---------------- 人群：到处有人撞上 ---------------- */

const CROWD_COLS = 62;
const CROWD_ROWS = 22;
const GAP = 28;
const OX = (1920 - CROWD_COLS * GAP) / 2 + GAP / 2;
const OY = 150;
const crowdXY = (i: number) => ({x: OX + (i % CROWD_COLS) * GAP + (rand(i * 3 + 1) - 0.5) * 10, y: OY + Math.floor(i / CROWD_COLS) * GAP + (rand(i * 3 + 2) - 0.5) * 10});

/**
 * 人群：一大片象牙白小点（每个点一个人），每隔 every 帧随机两个人亮起金色并连一道弧——又一个巧合。
 * f 用于闪烁（收暗时传冻结后的帧）；from 起开始出现闪光；alpha 整体透明度
 */
export const Crowd: React.FC<{f: number; from: number; every?: number; alpha?: number; life?: number}> = ({f, from, every = 8, alpha = 1, life = 40}) => {
  const n = CROWD_COLS * CROWD_ROWS;
  const flashes: React.ReactNode[] = [];
  const first = Math.max(0, Math.floor((f - from - life) / every));
  for (let k = first; k * every <= f - from; k++) {
    const t = f - from - k * every;
    const o = Math.sin(clamp01(t / life) * Math.PI);
    if (o <= 0) continue;
    const i = Math.floor(rand(k * 17 + 1) * n);
    const j = (i + 1 + Math.floor(rand(k * 17 + 2) * 300)) % n;
    const a = crowdXY(i);
    const b = crowdXY(j);
    const mx = (a.x + b.x) / 2;
    const my = Math.min(a.y, b.y) - 40 - Math.abs(a.x - b.x) * 0.25;
    flashes.push(
      <g key={k} opacity={o}>
        <path d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke={G.gold} strokeWidth={1.4} />
        <circle cx={a.x} cy={a.y} r={4.5} fill={G.goldBright} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
        <circle cx={b.x} cy={b.y} r={4.5} fill={G.goldBright} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
      </g>,
    );
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: alpha}}>
      {Array.from({length: n}, (_, i) => {
        const {x, y} = crowdXY(i);
        return <circle key={i} cx={x} cy={y} r={1.8} fill={G.ivory} opacity={0.22 + 0.18 * rand(i + 0.3)} />;
      })}
      {flashes}
    </svg>
  );
};

/** 重拍后第 1 小节在环心浮出的一行「23 人 · 50.7%」 */
export const HitNote: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', fontFamily: GF.num, fontSize: 34, color: G.ivory, opacity: clamp01((f - HIT - 30) / 14)}}>
    23 人 · {pct(pShared(23))}
  </div>
);

/** 第 11 小节：一对连线单独描亮，旁边写 1/365 */
export const OnePair: React.FC<{f: number; a: number; b: number}> = ({f, a, b}) => {
  const o = vis(f, fb(11), fb(12) + 10, 12, 14);
  if (o <= 0) return null;
  const p = dotPos(a);
  const q = dotPos(b);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={G.goldBright} strokeWidth={2.4} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
      <text x={(p.x + q.x) / 2 + 16} y={(p.y + q.y) / 2 - 16} fontFamily={GF.num} fontSize={36} fill={G.goldBright}>
        1/365
      </text>
    </svg>
  );
};

