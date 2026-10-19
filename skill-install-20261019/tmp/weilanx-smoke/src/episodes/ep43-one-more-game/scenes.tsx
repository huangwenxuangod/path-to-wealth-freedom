import React from 'react';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, Range, ViewGun} from '../../library/tactical/range';
import type {Box, Tone} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';

/**
 * ep43 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const YARD: Box[] = [
  {x: 2.6, z: 12, w: 2, h: 1.8, crate: true},
  {x: -3.5, z: 15, w: 1.6, h: 2},
  {x: -6.5, z: 18, w: 2, h: 1.2, crate: true},
  {x: 6.5, z: 17, w: 1.6, h: 1.8},
];

/** 残局第一人称：敌人从右边箱子后面探出来（peekAt 起 12 帧移出），准星还偏在左边 */
export const ClutchView: React.FC<{f: number; peekAt: number; tone?: Tone; dead?: boolean}> = ({f, peekAt, tone = 'blue', dead = false}) => {
  const p = easeOut(clamp01((f - peekAt) / 12));
  const foeX = 2.6 - 1.5 * p;
  return (
    <>
      <Range cam={{x: 0, z: 0, y: 1.6, yaw: -0.08 + Math.sin(f / 30) * 0.02}} tone={tone} boxes={YARD} dummies={[{x: foeX, z: 11.2}]} wallZ={24} />
      <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} />
      <ViewGun sway={dead ? 0 : Math.sin(f / 9) * 0.5} tone={tone} />
    </>
  );
};

/** 右上角时钟（凌晨几点） */
export const Clock: React.FC<{text: string; x?: number; y?: number; color?: string}> = ({text, x = 1500, y = 250, color = T.gray}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: TF.mono, fontWeight: 700, fontSize: 56, color, filter: glowF(color, 4)}}>{text}</div>
);

/** 六格结果条：赢 1 格（橙）、差一点 2 格（红）、差很远 3 格（灰），下面写拿到的钱 */
export const OutcomeStrip: React.FC<{f: number; at: number; outcomes: [string, number][]}> = ({f, at, outcomes}) => {
  const colors = [T.orange, T.red, T.gray];
  const pay = ['+0.5 英镑', '0', '0'];
  const cell = 200;
  const x0 = 960 - cell * 3;
  let k = 0;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {outcomes.map(([name, n], gi) => {
        const start = k;
        k += n;
        const o = clamp01((f - at - gi * 8) / 8);
        return (
          <g key={name} opacity={o}>
            {Array.from({length: n}, (_, j) => (
              <rect key={j} x={x0 + (start + j) * cell + 8} y={360} width={cell - 16} height={150} rx={10} fill={colors[gi]} opacity={0.85} style={{filter: glowF(colors[gi], 6)}} />
            ))}
            <text x={x0 + (start + n / 2) * cell} y={330} textAnchor="middle" fontFamily={TF.sans} fontSize={40} fill={colors[gi]}>
              {name}
            </text>
            <text x={x0 + (start + n / 2) * cell} y={570} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={34} fill={gi === 0 ? T.orange : T.white}>
              {pay[gi]}
            </text>
          </g>
        );
      })}
      <text x={960} y={250} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} letterSpacing={3} fill={T.gray}>
        每 6 次转动 · Clark 等 2009 · Neuron
      </text>
    </svg>
  );
};

/** 两组对比条（示意，只表示方向）：左「有多高兴」差一点 < 差很远；右「多想继续玩」差一点 > 差很远 */
export const FeelBars: React.FC<{f: number; atL: number; atR: number}> = ({f, atL, atR}) => {
  const group = (x: number, at: number, title: string, near: number, full: number, hi: string) => {
    const p = easeOut(clamp01((f - at) / 14));
    const o = clamp01((f - at) / 6);
    const bar = (bx: number, v: number, c: string, name: string) => (
      <g>
        <rect x={bx} y={640 - v * 300 * p} width={150} height={v * 300 * p} fill={c} style={{filter: glowF(c, 6)}} />
        <text x={bx + 75} y={690} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={c}>
          {name}
        </text>
      </g>
    );
    return (
      <g opacity={o}>
        <text x={x + 175} y={260} textAnchor="middle" fontFamily={TF.sans} fontSize={40} fill={T.white}>
          {title}
        </text>
        <line x1={x - 20} x2={x + 370} y1={640} y2={640} stroke={T.faint} strokeWidth={2} />
        {bar(x, near, T.red, '差一点')}
        {bar(x + 200, full, T.gray, '差很远')}
        <text x={x + 175} y={760} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={hi} opacity={clamp01((f - at - 16) / 8)}>
          {near < full ? '差一点：更难受' : '差一点：更想继续'}
        </text>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {group(380, atL, '有多高兴', 0.35, 0.6, T.red)}
      {group(1160, atR, '还想不想继续玩', 0.85, 0.55, T.orange)}
      <text x={960} y={200} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} letterSpacing={3} fill={T.dim}>
        示意 · 只画方向，柱高不是论文数值 · 玩家自己选图案的那几轮
      </text>
    </svg>
  );
};

/** 两条反向的大箭头：开心 ↓（红）、想继续 ↑（橙） */
export const TwoArrows: React.FC<{f: number; at: number}> = ({f, at}) => {
  const arrow = (x: number, up: boolean, c: string, text: string, a: number) => {
    const p = easeOut(clamp01((f - a) / 12));
    const y0 = up ? 640 : 300;
    const y1 = y0 + (up ? -1 : 1) * 300 * p;
    return (
      <g opacity={clamp01((f - a) / 6)}>
        <line x1={x} x2={x} y1={y0} y2={y1} stroke={c} strokeWidth={22} style={{filter: glowF(c, 10)}} />
        <polygon points={up ? `${x - 40},${y1 + 10} ${x + 40},${y1 + 10} ${x},${y1 - 50}` : `${x - 40},${y1 - 10} ${x + 40},${y1 - 10} ${x},${y1 + 50}`} fill={c} />
        <text x={x} y={720} textAnchor="middle" fontFamily={TF.sans} fontSize={48} fill={c}>
          {text}
        </text>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {arrow(660, false, T.red, '开心', at)}
      {arrow(1260, true, T.orange, '想继续', at + 10)}
    </svg>
  );
};

/** 两张卡：电脑替你选（想继续 ↓）vs 你自己选（想继续 ↑） */
export const ControlCards: React.FC<{f: number; atL: number; atR: number}> = ({f, atL, atR}) => {
  const card = (x: number, at: number, title: string, up: boolean, c: string, icon: React.ReactNode) => (
    <div style={{position: 'absolute', left: x, top: 240, width: 600, height: 460, border: `2px solid ${c}`, background: 'rgba(10,19,34,0.8)', boxShadow: `0 0 24px ${c}44`, opacity: clamp01((f - at) / 8)}}>
      <svg width={600} height={260} style={{position: 'absolute', left: 0, top: 30}}>
        {icon}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: TF.sans, fontSize: 44, color: T.white}}>{title}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: TF.sans, fontSize: 40, color: c}}>差一点之后：想继续 {up ? '↑' : '↓'}</div>
    </div>
  );
  return (
    <>
      {card(
        280,
        atL,
        '电脑替你选图案',
        false,
        T.gray,
        <>
          <rect x={200} y={40} width={200} height={140} rx={10} fill="none" stroke={T.gray} strokeWidth={6} />
          <rect x={270} y={180} width={60} height={30} fill={T.gray} />
          <rect x={230} y={210} width={140} height={10} fill={T.gray} />
        </>,
      )}
      {card(
        1040,
        atR,
        '你自己选图案',
        true,
        T.orange,
        <path d="M280 40 l0 120 l30 -30 l26 56 l24 -10 l-26 -56 l42 0 z" fill="none" stroke={T.orange} strokeWidth={6} strokeLinejoin="round" />,
      )}
    </>
  );
};

/** 三根柱（示意）：差一点出现 15% / 30% / 45%，30% 那组坚持最久 */
export const RateBars: React.FC<{f: number; at: number; rates: number[]; best: number; bestAt: number}> = ({f, at, rates, best, bestAt}) => {
  const hs = rates.map((r) => (r === best ? 1 : 0.6));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={480} x2={1440} y1={680} y2={680} stroke={T.faint} strokeWidth={2} />
      <text x={480} y={250} fontFamily={TF.sans} fontSize={28} fill={T.gray}>
        停手前一共玩了多少轮
      </text>
      {rates.map((r, i) => {
        const p = easeOut(clamp01((f - at - i * 6) / 14));
        const x = 560 + i * 300;
        const isBest = r === best;
        const c = isBest && f >= bestAt ? T.orange : T.cyan;
        return (
          <g key={r} opacity={clamp01((f - at - i * 6) / 6)}>
            <rect x={x} y={680 - hs[i] * 360 * p} width={180} height={hs[i] * 360 * p} fill={c} style={{filter: glowF(c, 6)}} />
            <text x={x + 90} y={730} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={36} fill={T.white}>
              {r}%
            </text>
            {isBest && f >= bestAt ? (
              <text x={x + 90} y={680 - 360 - 24} textAnchor="middle" fontFamily={TF.sans} fontSize={36} fill={T.orange} style={{filter: glowF(T.orange, 6)}}>
                玩得最久
              </text>
            ) : null}
          </g>
        );
      })}
      <text x={960} y={790} textAnchor="middle" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        「差一点」出现的比例 · 示意：只画了谁最高，柱高不是论文数值 · Kassinove & Schare 2001
      </text>
    </svg>
  );
};
