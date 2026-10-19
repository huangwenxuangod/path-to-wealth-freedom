import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Tone} from '../../library/tactical/range';
import {NeonLine} from '../../library/tactical/charts';
import {glowF, T, TF} from '../../library/tactical/theme';
import {fbt, LAT_TABLE, RATES, SHOT} from './timeline';

/**
 * ep39 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

/** 射击场：前方一排箱子当掩体背景，人靶在箱子前面横移（不被遮挡） */
const YARD: Box[] = [
  {x: -6, z: 16, w: 2, h: 1.4, crate: true},
  {x: -2.6, z: 18, w: 1.6, h: 2},
  {x: 3.2, z: 17, w: 2, h: 1.2, crate: true},
  {x: 6.5, z: 15, w: 1.6, h: 1.8},
];
/** 头部中心离地高度（Range 胶囊人靶：身高 1.32 + 头半径 0.17 × 1.25） */
export const HEAD_Y = 1.53;
const FOE_Z = 11;

/** 开场人靶横移：从左边进来，第 7 拍开枪时刚好越过准星（打在它身后） */
export const foeX = (f: number) => (f < SHOT ? -4 + (f - 20) * (4.7 / (SHOT - 20)) : 0.7 + (f - SHOT) * 0.012);

/** 第一人称：你架着枪，人靶横移；shotAt 开枪（弹道打到准星、MISS） */
export const ShootView: React.FC<{f: number; x: number; tone?: Tone; shotAt?: number; hitText?: string; state?: 'idle' | 'hit' | 'dead'; camY?: number}> = ({f, x, tone = 'blue', shotAt, hitText = 'MISS', state = 'idle', camY = 1.6}) => {
  const cam = {x: 0, z: 0, y: camY, yaw: 0};
  const t = shotAt === undefined ? -1 : f - shotAt;
  const kick = t >= 0 && t < 8 ? 1 - t / 8 : 0;
  const head = project([x, HEAD_Y, FOE_Z], cam);
  const hit = hitText !== 'MISS';
  const aim: [number, number] = hit && head ? head : [960, 540];
  return (
    <>
      <Range cam={cam} tone={tone} boxes={YARD} dummies={f >= 20 ? [{x, z: FOE_Z, state}] : []} wallZ={24} />
      <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} spread={kick * 0.6} />
      <ViewGun kick={kick} sway={Math.sin(f / 9) * 0.5} tone={tone} />
      {shotAt !== undefined ? <Tracer to={aim} t={t} /> : null}
      {shotAt !== undefined ? <HitMark f={f} at={shotAt + 2} x={aim[0]} y={aim[1]} text={hitText} color={hit ? T.orange : '#ffffff'} /> : null}
    </>
  );
};

/** 右上角的帧数读数（游戏里常见的 FPS 计数器） */
export const FpsCounter: React.FC<{fps: number; color?: string}> = ({fps, color = T.green}) => (
  <div style={{position: 'absolute', right: 120, top: 150, textAlign: 'right'}}>
    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: T.gray}}>FPS</div>
    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 72, color, filter: glowF(color, 8)}}>{fps}</div>
  </div>
);

/** 同样 0.25 秒里，120 帧和 240 帧各画几张：一排竖线从左往右画出 */
export const FrameStrips: React.FC<{f: number; at: number}> = ({f, at}) => {
  const rows: [string, number, string][] = [
    ['120 帧', 30, T.cyan],
    ['240 帧', 60, T.green],
  ];
  const x0 = 420;
  const w = 1100;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <text x={x0} y={250} fontFamily={TF.mono} fontWeight={700} fontSize={22} letterSpacing={3} fill={T.gray}>
        同样 0.25 秒，屏幕上换了几张画面
      </text>
      {rows.map(([label, n, c], r) => {
        const y = 330 + r * 220;
        const p = clamp01((f - at - r * 10) / 22);
        return (
          <g key={label}>
            <text x={x0 - 30} y={y + 70} textAnchor="end" fontFamily={TF.sans} fontSize={40} fill={c}>
              {label}
            </text>
            {Array.from({length: n}, (_, k) => {
              const xx = x0 + (k / n) * w;
              if (k / n > p) return null;
              return <rect key={k} x={xx} y={y} width={r ? 8 : 16} height={110} fill={c} opacity={0.85} style={{filter: glowF(c, 4)}} />;
            })}
            <text x={x0 + w + 40} y={y + 72} fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={c} opacity={p}>
              {Math.round(n * p)} 张
            </text>
          </g>
        );
      })}
      <text x={960} y={830} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={T.orange} opacity={clamp01((f - at - 34) / 8)} style={{filter: glowF(T.orange, 10)}}>
        × 2
      </text>
    </svg>
  );
};

/** 鼠标 → 枪口火光，中间一个「? 毫秒」 */
export const ClickFlash: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = easeOut(clamp01((f - at - 4) / 20));
  const q = clamp01((f - at - 22) / 8);
  const pulse = 1 + 0.06 * Math.sin((f - at) / 3);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <g transform="translate(360 330)" style={{filter: glowF(T.cyan, 6)}}>
        <rect x={0} y={0} width={150} height={230} rx={75} fill="none" stroke={T.cyan} strokeWidth={5} />
        <line x1={75} y1={0} x2={75} y2={95} stroke={T.cyan} strokeWidth={5} />
        <path d="M5 95 H145" stroke={T.cyan} strokeWidth={5} />
        <path d="M8 90 Q10 6 75 4 V90 Z" fill={T.cyan} opacity={clamp01((f - at) / 4) * 0.8} />
      </g>
      <text x={435} y={630} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.cyan}>
        按下鼠标
      </text>
      <line x1={560} y1={445} x2={560 + 760 * p} y2={445} stroke={T.faint} strokeWidth={4} strokeDasharray="14 12" />
      <g transform={`translate(1480 445) scale(${q})`} style={{filter: glowF(T.orange, 14)}}>
        {Array.from({length: 8}, (_, k) => {
          const a = (k * Math.PI) / 4;
          const r = k % 2 ? 55 : 110;
          return <line key={k} x1={0} y1={0} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={T.orange} strokeWidth={10} strokeLinecap="round" />;
        })}
        <circle r={34} fill="#fff6d8" />
      </g>
      <text x={1480} y={630} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.orange} opacity={q}>
        屏幕上冒火
      </text>
      <text x={940} y={420} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={84} fill={T.white} opacity={clamp01((f - at - 10) / 8)} transform={`translate(940 400) scale(${pulse}) translate(-940 -400)`}>
        ? ms
      </text>
    </svg>
  );
};

/** 实验条件：4 种刷新率 × 3 档延迟，格子里是论文表 1 实测的点击到出光延迟（ms）；按列亮起，rowHi 那一行框出来 */
export const ConditionGrid: React.FC<{f: number; at: number; rowHi?: number; rowAt?: number}> = ({f, at, rowHi, rowAt = 0}) => {
  const x0 = 560;
  const y0 = 260;
  const cw = 230;
  const ch = 120;
  const hi = rowHi === undefined ? 0 : clamp01((f - rowAt) / 8);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {RATES.map((hz, c) => (
        <text key={hz} x={x0 + c * cw + cw / 2} y={y0 - 24} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={32} fill={T.cyan} opacity={clamp01((f - at - c * 6) / 6)}>
          {hz} Hz
        </text>
      ))}
      {['低延迟', '中延迟', '高延迟'].map((l, r) => (
        <text key={l} x={x0 - 30} y={y0 + r * ch + ch / 2 + 12} textAnchor="end" fontFamily={TF.sans} fontSize={32} fill={T.text}>
          {l}
        </text>
      ))}
      {RATES.map((hz, c) =>
        LAT_TABLE[hz].map((ms, r) => {
          const on = clamp01((f - at - c * 6) / 6);
          return (
            <g key={`${hz}-${r}`} opacity={on}>
              <rect x={x0 + c * cw + 6} y={y0 + r * ch + 6} width={cw - 12} height={ch - 12} fill="rgba(10,19,34,0.8)" stroke={rowHi === r ? T.orange : 'rgba(160,200,220,0.35)'} strokeWidth={2} />
              <text x={x0 + c * cw + cw / 2} y={y0 + r * ch + ch / 2 + 14} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={rowHi === r && hi > 0 ? T.orange : T.white}>
                {ms}
              </text>
            </g>
          );
        }),
      )}
      {rowHi !== undefined ? <rect x={x0 - 4} y={y0 + rowHi * ch} width={cw * 4 + 8} height={ch} fill="none" stroke={T.orange} strokeWidth={4} opacity={hi} style={{filter: glowF(T.orange, 8)}} /> : null}
      <text x={960} y={y0 + 3 * ch + 60} textAnchor="middle" fontFamily={TF.sans} fontSize={24} fill={T.dim}>
        格子里是实测的「点击到屏幕出光」延迟（ms）· Spjut 等 2019 表 1
      </text>
    </svg>
  );
};

/** 两块小图（示意）：只换刷新率几乎平，只换延迟明显往上（完成时间越高越慢） */
export const ResultPair: React.FC<{f: number; atL: number; atR: number}> = ({f, atL, atR}) => {
  const panel = (x: number, at: number, title: string, data: number[], ticks: string[], verdict: string, c: string) => (
    <div style={{position: 'absolute', left: x, top: 210, width: 700, opacity: clamp01((f - at) / 6)}}>
      <div style={{fontFamily: TF.sans, fontSize: 38, color: T.white, marginBottom: 30}}>{title}</div>
      <NeonLine f={f} at={at + 2} data={data} w={600} h={340} min={0.8} max={1.3} yLabel="打完所需时间" dur={24} />
      <div style={{display: 'flex', justifyContent: 'space-between', width: 600, marginTop: 8, fontFamily: TF.mono, fontWeight: 700, fontSize: 22, color: T.gray}}>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div style={{marginTop: 22, fontFamily: TF.sans, fontSize: 34, color: c, opacity: clamp01((f - at - 26) / 8)}}>{verdict}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {panel(200, atL, '只换刷新率（延迟相同）', [1.02, 1.01, 1.0, 1.0], ['60', '120', '240', '360 Hz'], '差别不显著', T.gray)}
      {panel(1040, atR, '只换延迟（刷新率相同）', [0.92, 1.04, 1.2], ['低', '中', '高延迟'], '明显变慢', T.red)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>示意：曲线形状按论文结论画，不是原始数据 · 单发打靶任务 · Spjut 等 2019</div>
    </AbsoluteFill>
  );
};

export const HEADSHOT_AT = fbt(218);
/** 结尾：暖色射击场，人靶横移进准星，这次一枪爆头 */
export const headshotX = (f: number, at: number) => Math.min(0, -3.2 + (f - at) * (3.2 / (HEADSHOT_AT - at)));
