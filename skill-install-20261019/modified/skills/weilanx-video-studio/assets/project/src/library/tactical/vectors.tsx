import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 战术屏科普风的「向量 / 机制」示意：发光向量箭头、投影（影子）示意、速度表、源码卡、直角三角形。
 * 用来把引擎里的物理和数学一步步画出来（连跳、后坐力、弹道……）。坐标都是屏幕像素，角度用弧度、0 = 正右、逆时针为正。
 */

/** 发光向量箭头：从 (x, y) 出发，角度 a、长度 len；grow 0–1 是画出进度；dashed 画虚线；label 标在箭头尖外侧 */
export const VecArrow: React.FC<{x: number; y: number; a: number; len: number; color: string; width?: number; grow?: number; dashed?: boolean; label?: string; labelSize?: number; head?: number}> = ({x, y, a, len, color, width = 6, grow = 1, dashed = false, label, labelSize = 26, head = 18}) => {
  const L = len * clamp01(grow);
  if (L < 1) return null;
  const ex = x + Math.cos(a) * L;
  const ey = y - Math.sin(a) * L;
  const h = Math.min(head, L * 0.6);
  const p1 = [ex - Math.cos(a - 0.45) * h, ey + Math.sin(a - 0.45) * h];
  const p2 = [ex - Math.cos(a + 0.45) * h, ey + Math.sin(a + 0.45) * h];
  return (
    <g style={{filter: glowF(color, 6)}}>
      <line x1={x} y1={y} x2={ex - Math.cos(a) * h * 0.6} y2={ey + Math.sin(a) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '12 10' : undefined} />
      <path d={`M${ex} ${ey} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} Z`} fill={color} />
      {label && grow >= 1 ? (
        <text x={ex + Math.cos(a) * 26} y={ey - Math.sin(a) * 26 + labelSize * 0.35} textAnchor={Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle'} fontFamily={TF.sans} fontSize={labelSize} fill={color}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/**
 * 投影示意：原点 (x, y)，速度向量 v（长度 vLen、角度 va，青）和「想去的方向」单位轴（角度 wa，橙色虚线长轴）；
 * show 0–1 时画出速度在轴上的投影（影子，橙色实心段）和从速度尖到轴的垂线；cap 给了就在轴上标出限速刻度（红）
 */
export const ProjectionDiagram: React.FC<{x: number; y: number; va: number; vLen: number; wa: number; show?: number; cap?: number; capLabel?: string; vLabel?: string; wLabel?: string; shadowLabel?: string}> = ({
  x,
  y,
  va,
  vLen,
  wa,
  show = 1,
  cap,
  capLabel = '限速',
  vLabel = '速度',
  wLabel = '想去的方向',
  shadowLabel = '影子',
}) => {
  const proj = vLen * Math.cos(va - wa);
  const vx = x + Math.cos(va) * vLen;
  const vy = y - Math.sin(va) * vLen;
  const px = x + Math.cos(wa) * proj;
  const py = y - Math.sin(wa) * proj;
  const axis = Math.max(vLen, cap ?? 0) * 1.15 + 60;
  const s = easeOut(clamp01(show));
  return (
    <g>
      <line x1={x - Math.cos(wa) * 60} y1={y + Math.sin(wa) * 60} x2={x + Math.cos(wa) * axis} y2={y - Math.sin(wa) * axis} stroke={T.orange} strokeWidth={2.5} strokeDasharray="10 9" opacity={0.7} />
      <text x={x + Math.cos(wa) * (axis + 16)} y={y - Math.sin(wa) * (axis + 16) + 9} textAnchor={Math.cos(wa) >= 0 ? 'start' : 'end'} fontFamily={TF.sans} fontSize={24} fill={T.orange}>
        {wLabel}
      </text>
      {cap !== undefined && (
        <g>
          <line x1={x + Math.cos(wa) * cap - Math.sin(wa) * 22} y1={y - Math.sin(wa) * cap - Math.cos(wa) * 22} x2={x + Math.cos(wa) * cap + Math.sin(wa) * 22} y2={y - Math.sin(wa) * cap + Math.cos(wa) * 22} stroke={T.red} strokeWidth={4} style={{filter: glowF(T.red, 6)}} />
          <text x={x + Math.cos(wa) * cap + Math.sin(wa) * 34} y={y - Math.sin(wa) * cap + Math.cos(wa) * 34 + 8} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.red}>
            {capLabel}
          </text>
        </g>
      )}
      <VecArrow x={x} y={y} a={va} len={vLen} color={T.cyan} label={vLabel} />
      {s > 0 && (
        <g opacity={s}>
          <line x1={vx} y1={vy} x2={px} y2={py} stroke={T.white} strokeWidth={2} strokeDasharray="6 6" opacity={0.7} />
          {Math.abs(proj) > 2 ? (
            <line x1={x} y1={y} x2={x + (px - x) * s} y2={y + (py - y) * s} stroke={T.orange} strokeWidth={14} strokeLinecap="round" opacity={0.85} style={{filter: glowF(T.orange, 10)}} />
          ) : (
            <circle cx={x} cy={y} r={11} fill={T.orange} style={{filter: glowF(T.orange, 10)}} />
          )}
          <text x={(x + px) / 2 + Math.sin(wa) * 34} y={(y + py) / 2 + Math.cos(wa) * 34 + 8} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={T.orange}>
            {shadowLabel}
          </text>
        </g>
      )}
      <circle cx={x} cy={y} r={7} fill={T.white} />
    </g>
  );
};

/** 速度表：等宽大数字 + 单位 + 一根横条（max 满格）；color 决定数字和条的颜色；label 是上方小字 */
export const SpeedMeter: React.FC<{v: number; max?: number; label: string; color?: string; x: number; y: number; w?: number; mark?: number; markLabel?: string}> = ({v, max = 700, label, color = T.cyan, x, y, w = 520, mark, markLabel}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w}}>
    <div style={{fontFamily: TF.sans, fontSize: 28, color: T.gray}}>{label}</div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4}}>
      <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 104, color, filter: glowF(color, 10)}}>{Math.round(v)}</span>
      <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 26, color: T.gray}}>units/s</span>
    </div>
    <div style={{position: 'relative', height: 16, marginTop: 10, background: 'rgba(200,215,225,0.08)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${clamp01(v / max) * 100}%`, background: color, boxShadow: `0 0 14px ${color}`}} />
      {mark !== undefined && <div style={{position: 'absolute', left: `${(mark / max) * 100}%`, top: -10, bottom: -10, width: 3, background: T.white, opacity: 0.8}} />}
    </div>
    {mark !== undefined && markLabel ? <div style={{position: 'relative', left: `${(mark / max) * 100}%`, marginTop: 8, transform: 'translateX(-50%)', width: 200, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 20, color: T.white, opacity: 0.8}}>{markLabel}</div> : null}
  </div>
);

/**
 * 源码卡：深色面板 + 顶部文件名小字 + 等宽代码逐行出现（per 帧一行），hl 里的行号高亮成橙色底；
 * note 是底部一行出处小字（如「id Software · GPL」）
 */
export const CodeCard: React.FC<{f: number; at: number; file: string; lines: string[]; hl?: number[]; note?: string; x?: number; y?: number; w?: number; size?: number; per?: number}> = ({f, at, file, lines, hl = [], note, x = 360, y = 220, w = 1200, size = 32, per = 4}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, borderRadius: 14, background: 'rgba(8,14,24,0.92)', border: `1.5px solid ${T.line}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', opacity: clamp01((f - at) / 8)}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: `1px solid ${T.faint}`}}>
      {['#e5505b', '#f0a045', '#3ecf8e'].map((c) => (
        <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.8}} />
      ))}
      <span style={{marginLeft: 12, fontFamily: TF.mono, fontWeight: 700, fontSize: 20, color: T.gray, letterSpacing: 1}}>{file}</span>
    </div>
    <div style={{padding: '18px 0 20px'}}>
      {lines.map((l, i) => {
        const on = clamp01((f - at - 6 - i * per) / 6);
        const hot = hl.includes(i);
        return (
          <div key={i} style={{display: 'flex', gap: 24, padding: '3px 24px', background: hot && on > 0 ? 'rgba(240,160,69,0.16)' : 'transparent', borderLeft: `4px solid ${hot && on > 0 ? T.orange : 'transparent'}`, opacity: on}}>
            <span style={{width: 30, textAlign: 'right', fontFamily: TF.mono, fontSize: size * 0.7, color: T.dim}}>{i + 1}</span>
            <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: size, color: hot ? T.orange : T.text, whiteSpace: 'pre'}}>{l}</span>
          </div>
        );
      })}
    </div>
    {note ? <div style={{padding: '0 24px 16px', fontFamily: TF.sans, fontSize: 20, color: T.dim}}>{note}</div> : null}
  </div>
);

/** 直角三角形：底边 a（青，横向）、竖边 b（橙，向上）、斜边（白，grow 画出）；数字标在各边外侧 */
export const RightTriangle: React.FC<{x: number; y: number; a: number; b: number; scale?: number; grow?: number; aLabel?: string; bLabel?: string; cLabel?: string}> = ({x, y, a, b, scale = 1, grow = 1, aLabel, bLabel, cLabel}) => {
  const A = a * scale;
  const B = b * scale;
  const g = easeOut(clamp01(grow));
  return (
    <g>
      <VecArrow x={x} y={y} a={0} len={A} color={T.cyan} label={undefined} />
      <VecArrow x={x + A} y={y} a={Math.PI / 2} len={B} color={T.orange} />
      <path d={`M${x + A - 22} ${y} L${x + A - 22} ${y - 22} L${x + A} ${y - 22}`} fill="none" stroke={T.gray} strokeWidth={2} />
      {g > 0 && <VecArrow x={x} y={y} a={Math.atan2(B, A)} len={Math.hypot(A, B)} color={T.white} grow={g} width={5} />}
      {aLabel ? (
        <text x={x + A / 2} y={y + 48} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={34} fill={T.cyan}>
          {aLabel}
        </text>
      ) : null}
      {bLabel ? (
        <text x={x + A + 22} y={y - B / 2 + 12} fontFamily={TF.mono} fontWeight={700} fontSize={34} fill={T.orange}>
          {bLabel}
        </text>
      ) : null}
      {cLabel && g >= 1 ? (
        <text x={x + A / 2} y={y - B / 2 - 40} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={T.white} style={{filter: glowF(T.white, 6)}}>
          {cLabel}
        </text>
      ) : null}
    </g>
  );
};
