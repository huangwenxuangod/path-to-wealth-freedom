import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 战术屏科普风的「听觉」示意图：俯视的人头 + 两只耳朵、声波圈、两耳到达时间轨道、混淆锥、耳廓频谱。
 * 方位角 az（弧度）按顺时针从正前方量：0 正前、π/2 正右、π 正后；屏幕上「前」朝上。
 */

const W = 1920;
const H = 1080;

/** 方位角 → 屏幕坐标（以 (cx, cy) 为头心、半径 R；yaw 是头的朝向，同样顺时针） */
export const azPos = (cx: number, cy: number, R: number, az: number, yaw = 0): [number, number] => [cx + R * Math.sin(az + yaw), cy - R * Math.cos(az + yaw)];

/** 两只耳朵的屏幕坐标：[左耳, 右耳] */
export const earPos = (cx: number, cy: number, r: number, yaw = 0): [[number, number], [number, number]] => [azPos(cx, cy, r, -Math.PI / 2, yaw), azPos(cx, cy, r, Math.PI / 2, yaw)];

/** 俯视的人头：圆头 + 朝前的鼻尖 + 两只耳朵（左耳 / 右耳可分别点亮） */
export const HeadTop: React.FC<{x: number; y: number; r?: number; yaw?: number; color?: string; litL?: number; litR?: number; label?: boolean}> = ({x, y, r = 70, yaw = 0, color = T.cyan, litL = 0, litR = 0, label = true}) => {
  const [l, rr] = earPos(x, y, r, yaw);
  const nose = azPos(x, y, r * 1.28, 0, yaw);
  const n1 = azPos(x, y, r * 0.9, -0.28, yaw);
  const n2 = azPos(x, y, r * 0.9, 0.28, yaw);
  const ear = (p: [number, number], lit: number, k: string) => (
    <g key={k}>
      <ellipse cx={p[0]} cy={p[1]} rx={r * 0.16} ry={r * 0.3} transform={`rotate(${(yaw * 180) / Math.PI} ${p[0]} ${p[1]})`} fill={lit > 0 ? T.orange : '#0d1622'} stroke={lit > 0 ? T.orange : color} strokeWidth={3} style={{filter: glowF(lit > 0 ? T.orange : color, 4 + 10 * lit)}} />
    </g>
  );
  return (
    <g>
      <polygon points={`${n1[0]},${n1[1]} ${nose[0]},${nose[1]} ${n2[0]},${n2[1]}`} fill={color} opacity={0.8} />
      <circle cx={x} cy={y} r={r} fill="#0d1622" stroke={color} strokeWidth={3} style={{filter: glowF(color, 6)}} />
      {ear(l, litL, 'l')}
      {ear(rr, litR, 'r')}
      {label && (
        <>
          <text x={l[0] + (l[0] - x) * 0.5} y={l[1] + 10} textAnchor={l[0] < x ? 'end' : 'start'} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
            左耳
          </text>
          <text x={rr[0] + (rr[0] - x) * 0.5} y={rr[1] + 10} textAnchor={rr[0] > x ? 'start' : 'end'} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
            右耳
          </text>
        </>
      )}
    </g>
  );
};

/** 声源：一个点 + 不断向外扩散的声波圈（period 帧一圈）；ghost 画成虚线空心（「你以为在这」） */
export const SoundSource: React.FC<{f: number; x: number; y: number; color?: string; period?: number; rings?: number; ghost?: boolean; label?: string; labelDy?: number; on?: number}> = ({f, x, y, color = T.red, period = 36, rings = 3, ghost = false, label, labelDy = -40, on = 1}) => (
  <g opacity={on}>
    {!ghost &&
      Array.from({length: rings}, (_, i) => {
        const p = (((f / period + i / rings) % 1) + 1) % 1;
        return <circle key={i} cx={x} cy={y} r={18 + p * 150} fill="none" stroke={color} strokeWidth={2.5} opacity={0.55 * (1 - p)} />;
      })}
    <circle cx={x} cy={y} r={16} fill={ghost ? 'none' : color} stroke={color} strokeWidth={3} strokeDasharray={ghost ? '6 5' : undefined} style={{filter: glowF(color, ghost ? 2 : 10)}} />
    {label ? (
      <text x={x} y={y + labelDy} textAnchor="middle" fontFamily={TF.sans} fontSize={28} fill={color}>
        {label}
      </text>
    ) : null}
  </g>
);

/**
 * 两耳到达时间轨道（慢放演示）：左耳 / 右耳各一条，脉冲依次落下；gap 是两只耳朵脉冲的错开（像素），
 * 中间标「时间差」；period 帧来一次
 */
export const EarTracks: React.FC<{f: number; at: number; x?: number; y?: number; w?: number; gap?: number; period?: number; label?: string; first?: 'L' | 'R'}> = ({f, at, x = 460, y = 700, w = 1000, gap = 120, period = 48, label = '时间差', first = 'R'}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = (t % period) / period;
  const hitX = x + w * 0.35;
  const rows: ['L' | 'R', string][] = [
    ['L', '左耳'],
    ['R', '右耳'],
  ];
  return (
    <g opacity={clamp01(t / 10)}>
      {rows.map(([k, name], i) => {
        const yy = y + i * 90;
        const delay = k === first ? 0 : gap;
        const px = x + w * p * 1.6 - delay;
        return (
          <g key={k}>
            <line x1={x} x2={x + w} y1={yy} y2={yy} stroke="rgba(200,215,225,0.22)" strokeWidth={2} />
            <text x={x - 24} y={yy + 9} textAnchor="end" fontFamily={TF.sans} fontSize={28} fill={T.text}>
              {name}
            </text>
            {px > x && px < x + w && <path d={`M${px - 14} ${yy} L${px} ${yy - 40} L${px + 14} ${yy}`} fill="none" stroke={T.orange} strokeWidth={4} style={{filter: glowF(T.orange, 6)}} />}
          </g>
        );
      })}
      <line x1={hitX} x2={hitX} y1={y - 50} y2={y + 120} stroke={T.faint} strokeDasharray="6 6" />
      <line x1={hitX + gap} x2={hitX + gap} y1={y - 50} y2={y + 120} stroke={T.faint} strokeDasharray="6 6" />
      <line x1={hitX} x2={hitX + gap} y1={y + 140} y2={y + 140} stroke={T.orange} strokeWidth={3} />
      <text x={hitX + gap / 2} y={y + 178} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={T.orange}>
        {label}
      </text>
    </g>
  );
};

/**
 * 混淆锥（伪 3D）：两耳连线是轴，锥面从头向右侧张开；锥上一圈的点到两耳的距离差都一样。
 * half 是锥的半张角（弧度）；锥面 30 帧画出，6 个点沿最外一圈转动
 */
export const ConeOfConfusion: React.FC<{f: number; at: number; cx?: number; cy?: number; len?: number; half?: number; color?: string}> = ({f, at, cx = 760, cy = 470, len = 760, half = 0.4, color = T.orange}) => {
  const t = f - at;
  if (t < 0) return null;
  const open = easeOut(clamp01(t / 30));
  const tilt = 0.32; // 圈的透视压扁
  const rings = [0.35, 0.6, 0.85, 1];
  const ringR = (k: number) => len * k * Math.tan(half) * open;
  const last = rings[rings.length - 1];
  const rx = cx + len * last * open;
  const R = ringR(last);
  return (
    <g>
      <line x1={cx - 260} x2={cx + len + 80} y1={cy} y2={cy} stroke={T.faint} strokeWidth={2} strokeDasharray="10 8" />
      <text x={cx + len + 90} y={cy + 8} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        两耳连线
      </text>
      <path d={`M${cx} ${cy} L${rx} ${cy - R} M${cx} ${cy} L${rx} ${cy + R}`} stroke={color} strokeWidth={3} opacity={0.8} style={{filter: glowF(color, 6)}} />
      {rings.map((k) => {
        const x = cx + len * k * open;
        const r = ringR(k);
        return <ellipse key={k} cx={x} cy={cy} rx={r * tilt} ry={r} fill={k === last ? 'rgba(240,160,69,0.08)' : 'none'} stroke={color} strokeWidth={k === last ? 3 : 1.5} opacity={k === last ? 0.9 : 0.4} />;
      })}
      {open > 0.95 &&
        Array.from({length: 6}, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + t / 40;
          const x = rx + Math.sin(a) * R * tilt;
          const y = cy - Math.cos(a) * R;
          return <circle key={i} cx={x} cy={y} r={11} fill={Math.sin(a) > 0 ? T.red : 'rgba(229,80,91,0.45)'} style={{filter: glowF(T.red, 6)}} />;
        })}
    </g>
  );
};

/**
 * 耳廓频谱（示意，不标具体数值）：两条频谱曲线，同一个声音从前面、从后面来，被耳廓改出不同的凹口。
 * 横轴频率（低 → 高），纵轴响度
 */
export const PinnaSpectrum: React.FC<{f: number; at: number; x?: number; y?: number; w?: number; h?: number}> = ({f, at, x = 980, y = 300, w = 760, h = 360}) => {
  const t = f - at;
  if (t < 0) return null;
  const curve = (notch: number, bump: number) =>
    Array.from({length: 121}, (_, i) => {
      const u = i / 120;
      const v = 0.55 + 0.12 * Math.sin(u * 7 + bump) - 0.38 * Math.exp(-Math.pow((u - notch) / 0.045, 2)) - 0.12 * Math.exp(-Math.pow((u - notch - 0.18) / 0.05, 2));
      return `${i ? 'L' : 'M'}${(x + u * w).toFixed(1)} ${(y + h - v * h).toFixed(1)}`;
    }).join(' ');
  const len = (d: number) => clamp01((t - d) / 24);
  const rows: [string, string, number, number, number][] = [
    ['从前面来', T.cyan, 0.55, 0.2, 0],
    ['从后面来', T.red, 0.72, 1.4, 14],
  ];
  return (
    <g>
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <line x1={x} x2={x} y1={y} y2={y + h} stroke={T.faint} strokeWidth={2} />
      <text x={x + w} y={y + h + 40} textAnchor="end" fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        频率 低 → 高
      </text>
      <text x={x} y={y - 18} fontFamily={TF.sans} fontSize={24} fill={T.gray}>
        进到耳道里的响度（示意）
      </text>
      {rows.map(([label, c, notch, bump, d]) => (
        <g key={label} opacity={clamp01((t - d) / 6)}>
          <path d={curve(notch, bump)} fill="none" stroke={c} strokeWidth={4} pathLength={1} strokeDasharray={`${len(d)} 1`} style={{filter: glowF(c, 6)}} />
          <line x1={x + w - 190} x2={x + w - 150} y1={y + 6 + (c === T.red ? 40 : 0)} y2={y + 6 + (c === T.red ? 40 : 0)} stroke={c} strokeWidth={4} />
          <text x={x + w - 140} y={y + 15 + (c === T.red ? 40 : 0)} fontFamily={TF.sans} fontSize={24} fill={c} opacity={len(d)}>
            {label}
          </text>
        </g>
      ))}
    </g>
  );
};

/** 整屏 SVG 画布，方便把上面这些 <g> 组件摆进去 */
export const HearCanvas: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, ...style}}>
    {children}
  </svg>
);
