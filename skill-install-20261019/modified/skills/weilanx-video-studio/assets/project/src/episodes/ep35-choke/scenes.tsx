import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Cam, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';
import {jitter} from './timeline';

/**
 * ep35 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const BOXES: Box[] = [
  {x: -3.4, z: 8, w: 1.6, h: 1.6, crate: true},
  {x: 3.6, z: 9, w: 1.4, h: 2.2},
  {x: 0.2, z: 15, w: 2.6, h: 1.2},
];
const FOE = {x: 0.9, z: 10};
const CAM: Cam = {x: 0, z: 0, yaw: Math.atan2(FOE.x, FOE.z)};
/** 对手头部在屏幕上的位置 */
export const HEAD = project([FOE.x, 1.75, FOE.z], CAM) ?? [960, 470];

/**
 * 一打一：对手站在正前方；准星按 amp 抖动（像素）。
 * misses 里的每一帧开一枪打空（弹道打到抖开的位置、标 MISS）；hitAt 给了就在那一帧爆头
 */
export const Duel: React.FC<{f: number; amp: number; misses?: number[]; hitAt?: number; tone?: Tone; gun?: boolean; tag?: boolean}> = ({f, amp, misses = [], hitAt, tone = 'blue', gun = true, tag = true}) => {
  const [jx, jy] = jitter(f, amp);
  const cx = HEAD[0] + jx;
  const cy = HEAD[1] + jy;
  const shots = [...misses, ...(hitAt !== undefined ? [hitAt] : [])];
  const last = shots.filter((s) => f >= s).pop();
  const t = last === undefined ? -1 : f - last;
  const hitT = hitAt === undefined ? -1 : f - hitAt;
  const at = last === undefined ? [cx, cy] : (() => {
    const [mx, my] = jitter(last, amp);
    return [HEAD[0] + mx, HEAD[1] + my];
  })();
  return (
    <>
      <Range cam={CAM} tone={tone} boxes={BOXES} dummies={[{...FOE, state: hitT > 6 ? 'dead' : hitT >= 0 ? 'hit' : 'idle'}]} />
      <Crosshair x={cx} y={cy} color={tone === 'warm' ? '#ffd9a8' : tone === 'red' ? T.red : T.cyan} />
      {last !== undefined && <Tracer to={[at[0], at[1]]} t={t} />}
      {misses.map((s) => (
        <HitMark key={s} f={f} at={s + 1} x={jitter(s, amp)[0] + HEAD[0]} y={jitter(s, amp)[1] + HEAD[1]} text="MISS" color={T.gray} />
      ))}
      {hitAt !== undefined && <HitMark f={f} at={hitAt + 1} x={HEAD[0]} y={HEAD[1]} text="HEADSHOT" />}
      {gun && <ViewGun kick={last === undefined ? 0 : clamp01(1 - Math.abs(t) / 5)} sway={Math.sin(f / 18) + jx * 0.04} tone={tone} />}
      {tag && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
          <span style={{padding: '6px 22px', border: `2px solid ${T.orange}`, background: 'rgba(5,11,20,0.6)', fontFamily: TF.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: T.orange}}>1 v 1</span>
        </div>
      )}
    </>
  );
};

/** 新手一步一步 vs 老手一气呵成：上排四个步骤格依次亮，下排一根长条一次走完 */
export const StepsVsFlow: React.FC<{f: number; ats: number[]; flowAt: number}> = ({f, ats, flowAt}) => {
  const steps = ['瞄准', '停步', '开枪', '确认'];
  const flow = easeOut(clamp01((f - flowAt) / 14));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 300, top: 300, fontFamily: TF.sans, fontSize: 34, color: T.gray}}>刚学的时候</div>
      <div style={{position: 'absolute', left: 300, top: 360, display: 'flex', gap: 24}}>
        {steps.map((s, i) => {
          const on = clamp01((f - ats[i]) / 6);
          return (
            <div key={s} style={{width: 300, height: 110, border: `2px solid ${on > 0 ? T.orange : 'rgba(200,215,225,0.15)'}`, background: `rgba(240,160,69,${0.15 * on})`, boxShadow: `0 0 ${16 * on}px ${T.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontSize: 40, color: on > 0 ? T.white : T.dim}}>
              {i + 1}. {s}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 300, top: 560, fontFamily: TF.sans, fontSize: 34, color: T.gray, opacity: clamp01((f - flowAt + 8) / 8)}}>练了几百局以后</div>
      <div style={{position: 'absolute', left: 300, top: 620, width: 1272, height: 110, border: `2px solid ${T.cyan}`, opacity: clamp01((f - flowAt + 8) / 8)}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${flow * 100}%`, background: 'rgba(66,198,223,0.22)', boxShadow: `0 0 18px ${T.cyan}`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontSize: 44, color: T.white}}>一个动作</div>
      </div>
    </AbsoluteFill>
  );
};

/** 因果链：四个节点从左到右依次点亮，箭头连接；lit[i] 是第 i 个节点亮起的帧 */
export const ChainFlow: React.FC<{f: number; labels: string[]; lit: number[]; colors: string[]}> = ({f, labels, lit, colors}) => {
  const xs = labels.map((_, i) => 300 + i * 440);
  const y = 470;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {labels.map((l, i) => {
        const on = clamp01((f - lit[i]) / 8);
        const c = colors[i];
        return (
          <g key={l} opacity={0.25 + 0.75 * on}>
            {i > 0 && (
              <g opacity={on}>
                <line x1={xs[i - 1] + 160} x2={xs[i] - 175} y1={y} y2={y} stroke={c} strokeWidth={4} />
                <path d={`M${xs[i] - 190} ${y - 12} L${xs[i] - 172} ${y} L${xs[i] - 190} ${y + 12}`} fill="none" stroke={c} strokeWidth={4} />
              </g>
            )}
            <rect x={xs[i] - 160} y={y - 70} width={320} height={140} rx={12} fill="#0d1622" stroke={c} strokeWidth={3} style={{filter: glowF(c, 10 * on)}} />
            <text x={xs[i]} y={y + 14} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={on > 0 ? T.white : T.dim}>
              {l}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** 三种压力卡：比赛 / 奖金 / 观众，依次亮起；下方「6 个实验」 */
export const PressureCards: React.FC<{f: number; ats: number[]; numAt: number; n: number}> = ({f, ats, numAt, n}) => {
  const cards: [string, string][] = [
    ['比赛', '暗中较劲'],
    ['奖金', '打好有钱拿'],
    ['观众', '有人在看'],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', gap: 50}}>
        {cards.map(([t, s], i) => {
          const on = clamp01((f - ats[i]) / 8);
          return (
            <div key={t} style={{width: 380, height: 260, border: `2px solid ${T.red}`, background: 'rgba(229,80,91,0.1)', boxShadow: `0 0 ${18 * on}px ${T.red}66`, opacity: on, transform: `translateY(${(1 - on) * 20}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
              <div style={{fontFamily: TF.sans, fontSize: 72, color: T.red}}>{t}</div>
              <div style={{fontFamily: TF.sans, fontSize: 28, color: T.gray}}>{s}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', opacity: clamp01((f - numAt) / 8)}}>
        <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 90, color: T.orange, filter: glowF(T.orange, 8)}}>{n}</span>
        <span style={{fontFamily: TF.sans, fontSize: 40, color: T.white, marginLeft: 20}}>个实验 · 结果都对得上</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>Baumeister《Choking under pressure》JPSP 1984：竞争、现金奖励、观众三种压力都让表现下降</div>
    </AbsoluteFill>
  );
};

/** 对勾 / 叉号（站酷快乐体和思源都没有 ✓ ✗，用图形） */
export const Mark: React.FC<{ok: boolean; x: number; y: number; s?: number}> = ({ok, x, y, s = 1}) => {
  const c = ok ? T.green : T.red;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{filter: glowF(c, 8)}}>
      <circle r={34} fill="none" stroke={c} strokeWidth={4} />
      {ok ? <path d="M-16 0 L-4 12 L18 -12" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke={c} strokeWidth={6} strokeLinecap="round" />}
    </g>
  );
};

/** 对照实验：两行，每行「任务 → 压力下」+ 一根表现条从满往下掉（或不掉）+ 对勾 / 叉号 */
export const CompareRows: React.FC<{f: number; rows: {label: string; sub: string; drop: boolean; at: number; result: string}[]; title: string}> = ({f, rows, title}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: T.gray}}>{title}</div>
    {rows.map((r, i) => {
      const t = f - r.at;
      const on = clamp01(t / 8);
      const drop = r.drop ? easeOut(clamp01((t - 14) / 16)) * 0.45 : 0;
      const c = r.drop ? T.red : T.green;
      const y = 300 + i * 230;
      return (
        <div key={r.label} style={{position: 'absolute', left: 260, top: y, width: 1400, height: 180, opacity: on}}>
          <div style={{position: 'absolute', left: 0, top: 30, width: 420}}>
            <div style={{fontFamily: TF.sans, fontSize: 48, color: T.white}}>{r.label}</div>
            <div style={{fontFamily: TF.sans, fontSize: 26, color: T.gray, marginTop: 8}}>{r.sub}</div>
          </div>
          <div style={{position: 'absolute', left: 460, top: 70, width: 600, height: 30, background: 'rgba(200,215,225,0.08)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(0.9 - drop) * 100}%`, background: t > 14 ? c : T.cyan, boxShadow: `0 0 14px ${t > 14 ? c : T.cyan}`}} />
          </div>
          <div style={{position: 'absolute', left: 460, top: 116, fontFamily: TF.sans, fontSize: 28, color: c, opacity: clamp01((t - 24) / 8)}}>{r.result}</div>
          <svg width={120} height={120} style={{position: 'absolute', left: 1140, top: 25, opacity: clamp01((t - 24) / 8)}}>
            <Mark ok={!r.drop} x={60} y={60} />
          </svg>
        </div>
      );
    })}
  </AbsoluteFill>
);

/** 盯手 vs 盯目标：左右分屏，同一个对手；左边准星抖、看着自己的枪，右边准星稳 */
export const FocusSplit: React.FC<{f: number}> = ({f}) => (
  <>
    {[0, 1].map((i) => {
      const x = i === 0 ? 110 : 980;
      const c = i === 0 ? T.red : T.cyan;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: 190, width: 830, height: 560, overflow: 'hidden', border: `2px solid ${c}`, boxShadow: `0 0 18px ${c}66`, background: T.bg}}>
          <div style={{position: 'absolute', left: -545, top: -260, transform: 'scale(0.75)', transformOrigin: '960px 540px', width: 1920, height: 1080}}>
            <Duel f={f} amp={i === 0 ? 34 : 3} tag={false} tone={i === 0 ? 'red' : 'blue'} />
            {i === 1 && (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                <circle cx={HEAD[0]} cy={HEAD[1]} r={60} fill="none" stroke={T.orange} strokeWidth={4} strokeDasharray="10 8" style={{filter: glowF(T.orange, 8)}} />
              </svg>
            )}
            {i === 0 && <AbsoluteFill style={{background: 'radial-gradient(ellipse 30% 30% at 78% 90%, rgba(229,80,91,0.35), rgba(0,0,0,0) 100%)'}} />}
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, padding: '4px 14px', background: c, fontFamily: TF.sans, fontSize: 24, color: '#06121a'}}>{i === 0 ? '盯着自己的手（内部焦点）' : '盯着对手的头（外部焦点）'}</div>
        </div>
      );
    })}
  </>
);

/** 盯头不盯手：对手头上一圈橙色「看这里」，枪上一个划掉的「别看这里」 */
export const HeadNotHand: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const o = clamp01(t / 8);
  return (
    <>
      <Duel f={f} amp={4} tag={false} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
        <circle cx={HEAD[0]} cy={HEAD[1]} r={70} fill="none" stroke={T.orange} strokeWidth={4} style={{filter: glowF(T.orange, 10)}} />
        <text x={HEAD[0] + 90} y={HEAD[1] - 50} fontFamily={TF.sans} fontSize={40} fill={T.orange}>
          看这里
        </text>
        <rect x={1340} y={700} width={330} height={300} rx={14} fill="none" stroke={T.red} strokeWidth={3} strokeDasharray="10 8" />
        <text x={1505} y={680} textAnchor="middle" fontFamily={TF.sans} fontSize={34} fill={T.red}>
          别看这里
        </text>
      </svg>
    </>
  );
};

/** 方法卡图标 */
export const STEP_ICONS: ((c: string) => React.ReactNode)[] = [
  (c) => (
    <>
      <circle cx={120} cy={75} r={50} fill="none" stroke={c} strokeWidth={4} />
      <circle cx={120} cy={75} r={8} fill={c} />
      <path d="M120 15 L120 40 M120 110 L120 135 M60 75 L85 75 M155 75 L180 75" stroke={c} strokeWidth={4} />
    </>
  ),
  (c) => (
    <>
      <rect x={50} y={40} width={110} height={74} rx={8} fill="none" stroke={c} strokeWidth={4} />
      <path d="M160 64 L196 44 L196 110 L160 90 Z" fill={c} />
      <circle cx={70} cy={30} r={8} fill={c} />
    </>
  ),
  (c) => (
    <>
      <path d="M50 120 L50 40 L90 40 L90 120 M110 120 L110 70 L150 70 L150 120 M170 120 L170 20 L200 20 L200 120" fill="none" stroke={c} strokeWidth={4} />
    </>
  ),
  (c) => (
    <>
      <path d="M40 75 L180 75 M150 45 L180 75 L150 105" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
];
