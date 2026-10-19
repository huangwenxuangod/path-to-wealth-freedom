import React from 'react';
import {clamp01, easeInOut, easeOut, easeOutBack} from '../anim';
import {Icon} from './props';
import {Sparkle} from './stage';
import {D, DF, drift, OG, rise} from './theme';

/**
 * 暖纸工作台风的「主视觉」：每个 B-roll 场景挑一个当画面主角（ep26 里打磨出来的）。
 * 和 props.tsx 的区别：props 是「信息卡」（清单、表格、代码），这里是「有设计感的图形」（徽章、同心圆、胶片、流程）。
 * 全部收全局帧 f 和出场帧，自己算动画；SVG 的 id 用 id 参数区分，同一画面放两个时要给不同 id。
 */

/** 旋转徽章：白底圆章，一圈环形小字缓慢转动，中间橙色渐变圆里一个大字（版本号、期数、关键数字）；开场 A-roll 右下角点缀用 */
export const Badge: React.FC<{f: number; at: number; ring: string; mid: string; r?: number; id?: string}> = ({f, at, ring, mid, r = 96, id = 'desk-badge'}) => {
  const t = clamp01((f - at) / 14);
  if (f < at) return null;
  const rr = r - 22;
  return (
    <svg width={r * 2 + 20} height={r * 2 + 20} style={{overflow: 'visible', opacity: easeOut(t), transform: `scale(${0.5 + 0.5 * easeOutBack(t)}) rotate(${(1 - t) * -40}deg)`}}>
      <defs>
        <path id={`${id}-ring`} d={`M ${r + 10} ${r + 10} m -${rr} 0 a ${rr} ${rr} 0 1 1 ${rr * 2} 0 a ${rr} ${rr} 0 1 1 -${rr * 2} 0`} />
        <linearGradient id={`${id}-og`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7448" />
          <stop offset="1" stopColor="#e2472c" />
        </linearGradient>
      </defs>
      <circle cx={r + 10} cy={r + 10} r={r} fill={D.card} stroke={D.cardLine} strokeWidth={2} style={{filter: 'drop-shadow(0 14px 24px rgba(70,50,30,0.14))'}} />
      <circle cx={r + 10} cy={r + 10} r={r - 44} fill={`url(#${id}-og)`} />
      <g transform={`rotate(${(f - at) * 0.6} ${r + 10} ${r + 10})`}>
        <text style={{fontFamily: DF.sans, fontWeight: 800, fontSize: 17, letterSpacing: 5}} fill={D.ink}>
          <textPath href={`#${id}-ring`}>{ring}</textPath>
        </text>
      </g>
      <text x={r + 10} y={r + 22} textAnchor="middle" style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 36}} fill="#fff">
        {mid}
      </text>
    </svg>
  );
};

/** 特性小卡：一排白卡「编号 + 黑体词」依次弹起，最后一张编号是橙色实心（开场列本期卖点：理论 / 实践 / 手把手） */
export const Chips: React.FC<{f: number; at: number; items: string[]; gap?: number; size?: number}> = ({f, at, items, gap = 5, size = 36}) => (
  <div style={{display: 'flex', gap: 18}}>
    {items.map((s, i) => {
      const r = rise(f, at + i * gap, 12, 26);
      const last = i === items.length - 1;
      return (
        <div key={s} style={{opacity: r.opacity, transform: r.transform, filter: r.filter, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px 16px 18px', background: D.card, borderRadius: 16, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow}}>
          <span style={{width: size * 1.1, height: size * 1.1, borderRadius: 12, background: last ? OG : D.tint, color: last ? '#fff' : D.orangeDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DF.sans, fontWeight: 900, fontSize: size * 0.56}}>{String(i + 1).padStart(2, '0')}</span>
          <span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: size, color: D.ink}}>{s}</span>
        </div>
      );
    })}
  </div>
);

export type LineIconKind = 'book' | 'tool' | 'code' | 'film' | 'bulb' | 'user' | 'camera';

/** 线条图标（48 网格、圆头描边）：书 / 扳手 / 代码 / 胶片 / 灯泡 / 人 / 摄像机 */
export const LineIcon: React.FC<{kind: LineIconKind; size?: number; color?: string}> = ({kind, size = 88, color = D.ink}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'book' ? (
      <>
        <path d="M6 10c6-2 12-2 18 2v28c-6-4-12-4-18-2z" />
        <path d="M42 10c-6-2-12-2-18 2v28c6-4 12-4 18-2z" />
        <path d="M11 18c3-.6 6-.4 8 .6M11 25c3-.6 6-.4 8 .6" />
      </>
    ) : null}
    {kind === 'tool' ? <path d="M30 8a9 9 0 0 0-8 12L8 34a4 4 0 0 0 6 6l14-14a9 9 0 0 0 12-8l-6 2-4-4z" /> : null}
    {kind === 'code' ? <path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 10l-6 28" /> : null}
    {kind === 'film' ? (
      <>
        <rect x={8} y={8} width={32} height={32} rx={4} />
        <path d="M16 8v32M32 8v32M8 16h8M8 24h8M8 32h8M32 16h8M32 24h8M32 32h8" />
      </>
    ) : null}
    {kind === 'bulb' ? <path d="M18 34h12M20 40h8M24 6a12 12 0 0 0-7 21.7c1.3 1 2 2.3 2 3.8V34h10v-2.5c0-1.5.7-2.8 2-3.8A12 12 0 0 0 24 6z" /> : null}
    {kind === 'camera' ? (
      <>
        <rect x={5} y={14} width={28} height={22} rx={4} />
        <path d="M33 21l10-6v18l-10-6z" />
        <circle cx={13} cy={10} r={4} />
        <circle cx={24} cy={10} r={4} />
      </>
    ) : null}
    {kind === 'user' ? (
      <>
        <circle cx={24} cy={16} r={8} />
        <path d="M8 42c2-9 8-13 16-13s14 4 16 13" />
      </>
    ) : null}
  </svg>
);

/**
 * 图标大卡：2～3 张大白卡并排（浅橙方块里一个线条图标 + 大字 + 一行灰字；h 是最小高度，内容多了自动撑高，titleSize 大字字号），at[i] 帧依次升起、讲到的那张描橙边；
 * 卡与卡之间 joinAt 帧弹出一个橙色圆钮（joiner 是 '+' 或 '→'）。「A 和 B 都要」「A 加 B」这类并列用
 */
export const IconCards: React.FC<{f: number; at: number[]; items: [LineIconKind, string, string][]; joinAt?: number; joiner?: '+' | '→'; w?: number; h?: number; gap?: number; titleSize?: number}> = ({f, at, items, joinAt, joiner = '+', w = 400, h = 380, gap = 120, titleSize = 92}) => {
  const p = joinAt === undefined ? 0 : easeOutBack(clamp01((f - joinAt) / 12));
  return (
    <div style={{position: 'relative', display: 'flex', gap}}>
      {items.map(([ic, t, sub], i) => {
        const r = rise(f, at[i], 14, 40);
        const on = f >= at[i];
        const [dx, dy] = drift(f, i + 3, 4, 150);
        return (
          <div key={t} style={{opacity: r.opacity, filter: r.filter, transform: `${r.transform} translate(${dx}px, ${dy}px) rotate(${i % 2 ? 2 : -2}deg)`, width: w, minHeight: h, boxSizing: 'border-box', padding: '44px 40px', background: D.card, borderRadius: 24, border: `2px solid ${on ? D.orange : D.cardLine}`, boxShadow: D.shadow}}>
            <div style={{width: 120, height: 120, borderRadius: 28, background: D.tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <LineIcon kind={ic} color={D.orangeDeep} />
            </div>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: titleSize, color: D.ink, marginTop: 30, lineHeight: 1, whiteSpace: 'nowrap'}}>{t}</div>
            <div style={{fontFamily: DF.sans, fontWeight: 600, fontSize: 28, color: D.gray, marginTop: 18}}>{sub}</div>
          </div>
        );
      })}
      {joinAt !== undefined
        ? items.slice(1).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: (i + 1) * (w + gap) - gap / 2 - 44, top: '50%', marginTop: -44, width: 88, height: 88, borderRadius: 44, background: OG, boxShadow: D.glow, transform: `scale(${p}) rotate(${(1 - p) * 90}deg)`}}>
              <svg width={88} height={88}>
                <path d={joiner === '+' ? 'M44 24V64M24 44H64' : 'M26 44H62M48 30l14 14-14 14'} stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
          ))
        : null}
    </div>
  );
};

/** 悬念卡：n 张编号卡翻起，每张一个摇晃的大问号，第一张橙色（「你能带走什么？」「答案有三个」） */
export const MysteryCards: React.FC<{f: number; at: number; n?: number}> = ({f, at, n = 3}) => (
  <div style={{display: 'flex', gap: 22}}>
    {Array.from({length: n}, (_, i) => {
      const t = clamp01((f - at - i * 5) / 14);
      const p = easeOutBack(t);
      return (
        <div key={i} style={{width: 170, height: 200, borderRadius: 20, background: i === 0 ? OG : D.card, border: i ? `1px solid ${D.cardLine}` : 'none', boxShadow: i === 0 ? D.glow : D.shadow, opacity: easeOut(t), transform: `translateY(${(1 - p) * 40}px) rotate(${(i - (n - 1) / 2) * 3}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 24, color: i === 0 ? 'rgba(255,255,255,0.8)' : D.orange, letterSpacing: 2}}>{String(i + 1).padStart(2, '0')}</span>
          <span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 100, lineHeight: 1.05, color: i === 0 ? '#fff' : D.ink, transform: `rotate(${Math.sin(f / 14 + i) * 6}deg)`}}>?</span>
        </div>
      );
    })}
  </div>
);

/** 胶片条：深色竖条，两侧齿孔，格子里一颗橙球一帧挪一格（「视频 = 一张张图片」），整条缓慢上滚；190×660 */
export const FilmStrip: React.FC<{f: number; at: number}> = ({f, at}) => {
  const r = rise(f, at, 14, 40);
  const scroll = (Math.max(0, f - at) * 0.6) % 150;
  return (
    <div style={{opacity: r.opacity, transform: `${r.transform} rotate(3deg)`, filter: r.filter, width: 190, height: 660, borderRadius: 16, background: '#221d18', boxShadow: '0 26px 50px rgba(40,25,10,0.25)', overflow: 'hidden', position: 'relative'}}>
      {[0, 1].map((side) => (
        <div key={side} style={{position: 'absolute', top: -scroll, [side ? 'right' : 'left']: 8, width: 12, height: 900, backgroundImage: 'linear-gradient(#f3efe7 0 14px, transparent 14px 30px)', backgroundSize: '12px 30px', opacity: 0.55}} />
      ))}
      {Array.from({length: 6}, (_, i) => {
        const k = i % 4;
        return (
          <div key={i} style={{position: 'absolute', left: 30, top: 20 + i * 150 - scroll, width: 130, height: 120, borderRadius: 8, background: D.paper, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 16 + k * 26, top: 40, width: 30, height: 30, borderRadius: 15, background: OG}} />
            <div style={{position: 'absolute', left: 8, bottom: 6, fontFamily: DF.mono, fontSize: 14, color: D.gray}}>f={k}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 同心圆：中心实心橙圆（labels[0]，呼吸光晕），外两圈虚线描出来并缓慢反向旋转，圈顶挂白色标签；at 依次点亮 中心 / 中圈 / 外圈；540×540（「原理 → 方法 → 技巧」「核心 → 外延」） */
export const Rings: React.FC<{f: number; at: [number, number, number]; labels: [string, string, string]; id?: string}> = ({f, at, labels, id = 'desk-rings'}) => {
  const R = [92, 172, 250];
  return (
    <svg width={540} height={540} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7448" />
          <stop offset="1" stopColor="#e2472c" />
        </linearGradient>
      </defs>
      {[2, 1].map((k) => {
        const p = easeOut(clamp01((f - at[k]) / 16));
        const dash = 2 * Math.PI * R[k];
        return (
          <g key={k} transform={`rotate(${(k === 1 ? 1 : -1) * f * 0.25} 270 270)`}>
            <circle cx={270} cy={270} r={R[k]} fill={k === 1 ? 'rgba(241,90,53,0.06)' : 'rgba(241,90,53,0.03)'} stroke={D.orange} strokeOpacity={0.7} strokeWidth={3} strokeDasharray={`${dash * p} ${dash}`} />
            <circle cx={270} cy={270} r={R[k]} fill="none" stroke={D.ink} strokeOpacity={0.15 * p} strokeWidth={1.5} strokeDasharray="3 10" />
            <circle cx={270 + R[k]} cy={270} r={8 * p} fill={D.orange} />
          </g>
        );
      })}
      {(() => {
        const p = easeOutBack(clamp01((f - at[0]) / 14));
        return (
          <g transform={`translate(270 270) scale(${p})`}>
            <circle r={R[0] + 14 + Math.sin(f / 10) * 4} fill="rgba(241,90,53,0.14)" />
            <circle r={R[0]} fill={`url(#${id}-g)`} />
            <text y={14} textAnchor="middle" style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 44}} fill="#fff">
              {labels[0]}
            </text>
          </g>
        );
      })()}
      {[1, 2].map((k) => {
        const p = easeOutBack(clamp01((f - at[k] - 4) / 12));
        return (
          <g key={k} transform={`translate(270 ${270 - R[k]}) scale(${p})`} opacity={clamp01(p)}>
            <rect x={-64} y={-26} width={128} height={52} rx={26} fill={D.card} stroke={D.orange} strokeWidth={2.5} />
            <text y={11} textAnchor="middle" style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 30}} fill={D.ink}>
              {labels[k]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** 成片播放卡：迷你暖纸画面（line + hi 橙块）+ 大播放钮 + 进度条在走 + 底部说明和文件名；520 宽（「做出你的第一个视频」「这是成片」） */
export const PlayerCard: React.FC<{f: number; at: number; line: string; hi: string; caption: string; file?: string}> = ({f, at, line, hi, caption, file = 'final.mp4'}) => {
  const t = clamp01((f - at) / 14);
  if (f < at) return null;
  const p = easeOutBack(t);
  const prog = clamp01((f - at - 10) / 90);
  return (
    <div style={{width: 520, opacity: easeOut(t), transform: `translateY(${(1 - p) * 50}px) scale(${0.85 + 0.15 * p}) rotate(-2deg)`, background: D.card, borderRadius: 20, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
      <div style={{position: 'relative', height: 260, background: D.paper, backgroundImage: `radial-gradient(${D.dot} 1.2px, transparent 1.4px)`, backgroundSize: '14px 14px'}}>
        <div style={{position: 'absolute', left: 40, top: 50, fontFamily: DF.sans, fontWeight: 900, fontSize: 40, color: D.ink}}>
          {line}
          <span style={{marginLeft: 6, padding: '0 10px', background: OG, color: '#fff', borderRadius: 8}}>{hi}</span>
        </div>
        <div style={{position: 'absolute', left: 40, top: 120, width: 200, height: 12, borderRadius: 6, background: D.faint}} />
        <div style={{position: 'absolute', left: 40, top: 144, width: 140, height: 12, borderRadius: 6, background: '#e2dcd2'}} />
        <div style={{position: 'absolute', right: 40, top: 70, width: 110, height: 110, borderRadius: 55, background: OG, boxShadow: D.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 8, boxSizing: 'border-box'}}>
          <Icon kind="play" size={50} color="#fff" />
        </div>
      </div>
      <div style={{padding: '18px 24px 22px'}}>
        <div style={{height: 8, borderRadius: 4, background: '#efe9e0', overflow: 'hidden'}}>
          <div style={{width: `${prog * 100}%`, height: '100%', background: OG}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: DF.sans, fontWeight: 800, fontSize: 26, color: D.ink}}>
          {caption}
          <span style={{fontFamily: DF.mono, fontWeight: 400, fontSize: 20, color: D.gray}}>{file}</span>
        </div>
      </div>
    </div>
  );
};

/** 流程卡：n 张「STEP 0N + 大字 + 灰字」卡用橙色虚线连起来，最后一张亮起后一颗橙点沿线循环跑、背后迸星光；最后一张橙色渐变；at[i] 依次升起；w 卡宽、g 间距 */
export const FlowCards: React.FC<{f: number; at: number[]; items: [string, string][]; w?: number; g?: number}> = ({f, at, items, w = 290, g = 70}) => {
  const n = items.length;
  const total = n * w + (n - 1) * g;
  const span = total - w;
  const line = easeInOut(clamp01((f - at[0]) / 40));
  const run = ((f - at[0]) % 60) / 60;
  const last = at[n - 1];
  return (
    <div style={{position: 'relative', width: total, height: 320}}>
      <svg width={total} height={320} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={w / 2} y1={160} x2={w / 2 + span * line} y2={160} stroke={D.orange} strokeWidth={3} strokeDasharray="8 10" />
        {f >= last ? <circle cx={w / 2 + span * run} cy={160} r={9} fill={D.orange} /> : null}
      </svg>
      <Sparkle f={f} at={last + 4} x={(n - 1) * (w + g) + w / 2} y={160} r={230} n={12} />
      {items.map(([t, sub], i) => {
        const r = rise(f, at[i], 14, 36);
        const hi = i === n - 1;
        return (
          <div key={t} style={{position: 'absolute', left: i * (w + g), top: 20, width: w, height: 280, boxSizing: 'border-box', padding: '34px 28px', borderRadius: 22, background: hi ? OG : D.card, border: hi ? 'none' : `1px solid ${D.cardLine}`, boxShadow: hi ? D.glow : D.shadow, opacity: r.opacity, transform: r.transform, filter: r.filter}}>
            <div style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: hi ? 'rgba(255,255,255,0.8)' : D.orange}}>STEP {String(i + 1).padStart(2, '0')}</div>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 50, color: hi ? '#fff' : D.ink, marginTop: 20, whiteSpace: 'nowrap'}}>{t}</div>
            <div style={{fontFamily: DF.sans, fontWeight: 600, fontSize: 24, color: hi ? 'rgba(255,255,255,0.85)' : D.gray, marginTop: 16}}>{sub}</div>
          </div>
        );
      })}
    </div>
  );
};
