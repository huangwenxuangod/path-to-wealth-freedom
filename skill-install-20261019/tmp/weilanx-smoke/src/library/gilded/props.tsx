import React from 'react';
import {clamp01} from '../anim';
import {G, GF, goldText} from './theme';

/**
 * 暗金文献风的实物：象牙骰子、金币（可切出扇形）、分段计分条、羊皮纸文书、对比卡片、印章。
 */

const PIPS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.27, 0.27], [0.73, 0.73]],
  3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
  4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
  5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
  6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]],
};

/** 骰子平面：象牙白圆角方块，1 点是朱红；label 可替换点数（如写「1/6」） */
export const DieFace: React.FC<{n: number; size?: number; label?: string; glow?: number; style?: React.CSSProperties}> = ({n, size = 80, label, glow = 0, style}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.16,
      background: `radial-gradient(circle at 35% 30%, #fbf6ea 0%, ${G.ivory} 55%, #cdbf9f 100%)`,
      boxShadow: `inset 0 -${size * 0.05}px ${size * 0.08}px rgba(90,70,40,0.35), 0 ${size * 0.06}px ${size * 0.14}px rgba(0,0,0,0.6)${glow ? `, 0 0 ${30 * glow}px rgba(243,220,160,${0.5 * glow})` : ''}`,
      position: 'relative',
      ...style,
    }}
  >
    {label ? (
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: GF.num, fontSize: size * 0.34, color: '#3a2c1a'}}>{label}</div>
    ) : (
      PIPS[n].map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x * size - size * (n === 1 ? 0.1 : 0.075),
            top: y * size - size * (n === 1 ? 0.1 : 0.075),
            width: size * (n === 1 ? 0.2 : 0.15),
            height: size * (n === 1 ? 0.2 : 0.15),
            borderRadius: '50%',
            background: n === 1 ? `radial-gradient(circle at 40% 35%, #e0644c, ${G.redDeep})` : 'radial-gradient(circle at 40% 35%, #4a3a28, #120c06)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
      ))
    )}
  </div>
);

/**
 * 立体骰子（CSS 3D）：rx/ry/rz 为角度。翻滚时调用方按帧算角度；落定后可给 1–2° 的呼吸摆动。
 * faces 顺序：前 上 右 后 下 左（默认 1 2 3 6 5 4，对面之和为 7）。
 */
export const Die3D: React.FC<{size?: number; rx: number; ry: number; rz?: number; faces?: number[]; labels?: string[]; glow?: number}> = ({size = 180, rx, ry, rz = 0, faces = [1, 2, 3, 6, 5, 4], labels, glow = 0}) => {
  const h = size / 2;
  const tf = [`translateZ(${h}px)`, `rotateX(90deg) translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`, `rotateY(180deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`];
  return (
    <div style={{width: size, height: size, perspective: size * 6}}>
      <div style={{width: size, height: size, position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
        {tf.map((t, i) => (
          <div key={i} style={{position: 'absolute', inset: 0, transform: t, backfaceVisibility: 'hidden'}}>
            <DieFace n={faces[i]} size={size} label={labels?.[i]} glow={glow} style={{boxShadow: 'inset 0 0 18px rgba(120,90,50,0.35)'}} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** 骰子落地的角度：at 起抛，dur 帧内翻 turns 圈后减速停在 (rx,ry)，之后轻微摆动 */
export const dieTumble = (f: number, at: number, dur: number, rest: [number, number] = [-22, -32], turns = 2) => {
  const p = clamp01((f - at) / dur);
  const e = 1 - Math.pow(1 - p, 4);
  const settle = f > at + dur ? Math.sin((f - at - dur) / 22) * 1.5 : 0;
  return {rx: rest[0] + (1 - e) * 360 * turns + settle, ry: rest[1] + (1 - e) * 360 * turns * 0.7, rz: (1 - e) * 140, bounce: Math.abs(Math.sin(e * Math.PI * 3)) * (1 - e) * 120};
};

/** 金币：外圈刻纹 + 中心八角星；cut 为 0–1，切掉一个扇形（rotate 控制缺口朝向），cutColor 是被切走那块的颜色 */
export const GoldCoin: React.FC<{size?: number; cut?: number; split?: number; label?: string; cutLabel?: string}> = ({size = 120, cut = 0, split = 0, label, cutLabel}) => {
  const r = size / 2;
  const a = cut * Math.PI * 2;
  const wedge = (start: number, end: number, rr: number) => {
    const p = (t: number) => `${r + Math.cos(t) * rr} ${r + Math.sin(t) * rr}`;
    return `M${r} ${r} L${p(start)} A${rr} ${rr} 0 ${end - start > Math.PI ? 1 : 0} 1 ${p(end)} Z`;
  };
  const s0 = -a / 2;
  const s1 = a / 2;
  const off = split * size * 0.35;
  return (
    <svg width={size * 1.8} height={size} viewBox={`${-size * 0.4} 0 ${size * 1.8} ${size}`} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="gd-coin" cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#fbe7ac" />
          <stop offset="0.55" stopColor="#c99a4a" />
          <stop offset="1" stopColor="#6d4b1d" />
        </radialGradient>
      </defs>
      <g>
        {cut > 0 ? <path d={wedge(s1, Math.PI * 2 + s0, r)} fill="url(#gd-coin)" /> : <circle cx={r} cy={r} r={r} fill="url(#gd-coin)" />}
        <circle cx={r} cy={r} r={r * 0.82} fill="none" stroke="rgba(90,60,20,0.55)" strokeWidth={1.2} strokeDasharray="2 3" />
        <path
          d={Array.from({length: 16}, (_, i) => {
            const t = (i / 16) * Math.PI * 2 - Math.PI / 2;
            const rr = i % 2 === 0 ? r * 0.36 : r * 0.13;
            return `${i === 0 ? 'M' : 'L'}${r + Math.cos(t) * rr} ${r + Math.sin(t) * rr}`;
          }).join(' ') + 'Z'}
          fill="rgba(110,76,28,0.6)"
        />
        {label ? (
          <text x={r * 0.62} y={r * 1.1} textAnchor="middle" fontFamily={GF.num} fontSize={size * 0.18} fill="#4a3212">
            {label}
          </text>
        ) : null}
      </g>
      {cut > 0 ? (
        <g transform={`translate(${off} 0)`}>
          <path d={wedge(s0, s1, r)} fill={G.red} stroke="#f0b39f" strokeWidth={0.8} />
          {cutLabel ? (
            <text x={r + r * 0.6} y={r + size * 0.06} textAnchor="middle" fontFamily={GF.num} fontSize={size * 0.16} fill="#fbe1d6">
              {cutLabel}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

/** 分段计分条：value/total 格点亮，金色或朱红 */
export const ScoreBar: React.FC<{value: number; total: number; color?: 'gold' | 'red'; w?: number; caption?: string}> = ({value, total, color = 'gold', w = 280, caption}) => {
  const c = color === 'gold' ? G.gold : G.red;
  return (
    <div style={{width: w}}>
      <div style={{display: 'flex', gap: 6}}>
        {Array.from({length: total}, (_, i) => {
          const on = clamp01(value - i);
          return (
            <div key={i} style={{flex: 1, height: 8, background: 'rgba(239,230,210,0.08)', border: '1px solid rgba(239,230,210,0.14)', position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${on * 100}%`, background: c, boxShadow: `0 0 8px ${c}`}} />
            </div>
          );
        })}
      </div>
      {caption ? <div style={{fontFamily: GF.cn, fontSize: 14, color: G.ivoryFaint, marginTop: 6, textAlign: 'right'}}>{caption}</div> : null}
    </div>
  );
};

/** 大号对决数字：上方圆圈徽记（甲 / 乙），下面金色或朱红大数字 */
export const Contender: React.FC<{badge: string; value: string; color?: 'gold' | 'red'}> = ({badge, value, color = 'gold'}) => {
  const c = color === 'gold' ? G.gold : G.red;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <div style={{width: 52, height: 52, borderRadius: '50%', border: `1.5px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: GF.cn, fontWeight: 700, fontSize: 26, color: c, background: 'rgba(0,0,0,0.4)'}}>{badge}</div>
      <div style={{fontFamily: GF.num, fontSize: 96, lineHeight: 1, ...(color === 'gold' ? {color: G.ivory} : {color: G.ivory})}}>{value}</div>
    </div>
  );
};

/** 盖章：朱红方框 + 粗宋体字，at 时从 1.6 倍砸下来并轻微回弹 */
export const RedStamp: React.FC<{f: number; at: number; text: string; size?: number; rot?: number}> = ({f, at, text, size = 110, rot = -8}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = clamp01(t / 8);
  const s = p < 1 ? 1.6 - 0.65 * p : 0.95 + 0.05 * clamp01((t - 8) / 6);
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: clamp01(t / 4),
        border: `${size * 0.05}px solid ${G.sealRed}`,
        borderRadius: size * 0.06,
        background: 'rgba(179,54,42,0.88)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        fontFamily: GF.cn,
        fontWeight: 900,
        fontSize: text.length > 1 ? size * 0.34 : size * 0.6,
        lineHeight: 1,
        color: '#f9dccd',
        boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
        writingMode: text.length > 1 ? 'vertical-rl' : undefined,
      }}
    >
      {text}
    </div>
  );
};

/** 羊皮纸文书：泛黄纸面 + 标题 + 小标题 + 一列「条目 …… 数字」，用来表现古代账册、名单、公报 */
export const Parchment: React.FC<{title: string; sub?: string; rows: [string, string][]; foot?: [string, string]; w?: number; rot?: number}> = ({title, sub, rows, foot, w = 340, rot = -3}) => (
  <div
    style={{
      width: w,
      padding: '26px 28px 22px',
      transform: `rotate(${rot}deg)`,
      background: `radial-gradient(ellipse at 40% 30%, #f1e2bd 0%, ${G.parchment} 55%, ${G.parchmentDark} 100%)`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.75), inset 0 0 40px rgba(120,80,30,0.35)',
      color: '#3b2a17',
    }}
  >
    <div style={{textAlign: 'center', fontFamily: GF.latinBold, fontSize: 30, letterSpacing: 4}}>{title}</div>
    {sub ? <div style={{textAlign: 'center', fontFamily: GF.latinItalic, fontSize: 15, marginTop: 2}}>{sub}</div> : null}
    <div style={{height: 1, background: 'rgba(59,42,23,0.5)', margin: '12px 0 10px'}} />
    {rows.map(([k, v]) => (
      <div key={k} style={{display: 'flex', alignItems: 'baseline', gap: 6, fontFamily: GF.latin, fontSize: 15, lineHeight: 1.6}}>
        <span>{k}</span>
        <span style={{flex: 1, borderBottom: '1px dotted rgba(59,42,23,0.4)'}} />
        <span style={{fontFamily: GF.num}}>{v}</span>
      </div>
    ))}
    {foot ? (
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: GF.latinItalic, fontSize: 15, marginTop: 12, borderTop: '1px solid rgba(59,42,23,0.4)', paddingTop: 8}}>
        <span>{foot[0]}</span>
        <span>{foot[1]}</span>
      </div>
    ) : null}
  </div>
);

/** 对比卡片：深色描金边框，标题（金 / 红）、内容区、进度条（带 50% 刻度）、百分比，可选角标印章 */
export const ProbCard: React.FC<{title: string; color?: 'gold' | 'red'; desc: string; value: number; children?: React.ReactNode; badge?: React.ReactNode; w?: number}> = ({title, color = 'gold', desc, value, children, badge, w = 520}) => {
  const c = color === 'gold' ? G.gold : G.red;
  return (
    <div style={{width: w, padding: '22px 26px', border: `1px solid ${color === 'gold' ? 'rgba(214,180,106,0.4)' : 'rgba(200,81,60,0.45)'}`, background: 'linear-gradient(180deg, rgba(40,30,18,0.75), rgba(14,11,8,0.85))', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', position: 'relative'}}>
      <div style={{fontFamily: GF.cn, fontWeight: 700, fontSize: 28, color: c}}>{title}</div>
      <div style={{margin: '18px 0', minHeight: 70}}>{children}</div>
      <div style={{fontFamily: GF.cn, fontSize: 19, color: G.ivoryDim, lineHeight: 1.5, whiteSpace: 'pre-line'}}>{desc}</div>
      <div style={{position: 'relative', height: 8, background: 'rgba(239,230,210,0.1)', borderRadius: 4, marginTop: 20}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, rgba(0,0,0,0), ${c})`, boxShadow: `0 0 10px ${c}`}} />
        <div style={{position: 'absolute', left: '50%', top: -8, width: 1, height: 24, background: G.ivoryDim}} />
      </div>
      <div style={{fontFamily: GF.num, fontSize: 40, marginTop: 12, ...(color === 'gold' ? goldText(0.3) : {color: G.red})}}>{(value * 100).toFixed(1)}%</div>
      {badge ? <div style={{position: 'absolute', right: 22, bottom: 20}}>{badge}</div> : null}
    </div>
  );
};
