import React from 'react';
import {C, FONT_UI} from '../../../library/theme';
import {rand} from '../../../library/anim';
import type {PhoneScene} from '../lib/state';
import {BuddyFigure} from '../../../library/character/BuddyFigure';

interface Props {
  scene: PhoneScene;
  w: number;
  h: number;
  t: number; // 帧，用于场景内部小动画
  progress?: number; // export 场景用
}

const SW = 2.5;

/** 片段画面：同一套插画用于手机预览、媒体库缩略图和时间轴胶片 */
export const SceneArt: React.FC<Props> = ({scene, w, h, t, progress = 0}) => {
  const m = Math.min(w, h); // 以短边为尺寸基准
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}>
      {scene === 'empty' && <Empty w={w} h={h} m={m} />}
      {scene === 'sunrise' && <Sunrise w={w} h={h} m={m} t={t} />}
      {scene === 'coffee' && <Coffee w={w} h={h} m={m} t={t} />}
      {scene === 'boring' && <Boring w={w} h={h} m={m} t={t} />}
      {scene === 'cat' && <Cat w={w} h={h} m={m} t={t} />}
      {scene === 'dance' && <Dance w={w} h={h} m={m} t={t} />}
      {scene === 'export' && <Export w={w} h={h} m={m} t={t} progress={progress} />}
    </svg>
  );
};

type P = {w: number; h: number; m: number; t?: number};

const Empty: React.FC<P> = ({w, h, m}) => (
  <g>
    <rect width={w} height={h} fill="#F3EEE4" />
    <rect x={w * 0.13} y={h * 0.2} width={w * 0.74} height={h * 0.22} rx={4} fill="none" stroke="#B8AFA2" strokeWidth={2} strokeDasharray="7 6" />
    <text x={w / 2} y={h * 0.3} textAnchor="middle" fontFamily={FONT_UI} fontSize={m * 0.16} fill="#B0A698">+</text>
    <text x={w / 2} y={h * 0.37} textAnchor="middle" fontFamily={FONT_UI} fontSize={m * 0.075} fill="#A09688">add some media</text>
  </g>
);

const Sunrise: React.FC<P> = ({w, h, m, t = 0}) => {
  const cx = w / 2;
  const cy = h * 0.52;
  const r = m * 0.2;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE3B6" />
          <stop offset="1" stopColor="#F2A266" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#sky)" />
      <g transform={`rotate(${t * 1.2} ${cx} ${cy})`}>
        {Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={cx + Math.cos(a) * r * 1.3} y1={cy + Math.sin(a) * r * 1.3} x2={cx + Math.cos(a) * r * 1.65} y2={cy + Math.sin(a) * r * 1.65} stroke={C.ink} strokeWidth={SW} strokeLinecap="round" />;
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="#F6C343" stroke={C.ink} strokeWidth={SW} />
      <ellipse cx={w * 0.2} cy={h * 1.02} rx={w * 0.55} ry={h * 0.3} fill="#86C96F" stroke={C.ink} strokeWidth={SW} />
      <ellipse cx={w * 0.85} cy={h * 1.05} rx={w * 0.55} ry={h * 0.3} fill="#6DB85C" stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

const Coffee: React.FC<P> = ({w, h, m, t = 0}) => {
  const mw = m * 0.42;
  const mh = m * 0.5;
  const mx = w / 2 - mw / 2;
  const tableY = h * 0.6;
  const my = tableY - mh;
  return (
    <g>
      <rect width={w} height={h} fill={C.pink} />
      {[0.2, 0.75, 0.4].map((fx, i) => (
        <circle key={i} cx={w * fx} cy={h * (0.12 + i * 0.1)} r={m * 0.018} fill="#fff" opacity={0.8} />
      ))}
      <rect y={tableY} width={w} height={h - tableY} fill="#E7B49B" stroke={C.ink} strokeWidth={SW} />
      {/* 热气 */}
      {[-0.12, 0.05].map((dx, i) => {
        const sx = w / 2 + dx * m;
        const wob = Math.sin(t * 0.18 + i * 2) * m * 0.02;
        return (
          <path key={i} d={`M ${sx} ${my - m * 0.04} q ${m * 0.05 + wob} ${-m * 0.06} 0 ${-m * 0.12} q ${-m * 0.05 - wob} ${-m * 0.06} 0 ${-m * 0.12}`} fill="none" stroke={C.ink} strokeWidth={SW * 0.8} strokeLinecap="round" opacity={0.7} />
        );
      })}
      <path d={`M ${mx + mw} ${my + mh * 0.25} q ${mw * 0.45} ${mh * 0.05} ${mw * 0.3} ${mh * 0.35} q ${-mw * 0.1} ${mh * 0.15} ${-mw * 0.3} ${mh * 0.12}`} fill="none" stroke={C.ink} strokeWidth={SW * 1.6} />
      <rect x={mx} y={my} width={mw} height={mh} rx={m * 0.04} fill="#FDFBF7" stroke={C.ink} strokeWidth={SW} />
      <rect x={mx} y={my + mh * 0.38} width={mw} height={mh * 0.16} fill={C.orange} stroke={C.ink} strokeWidth={SW * 0.8} />
    </g>
  );
};

const Boring: React.FC<P> = ({w, h, m, t = 0}) => {
  const cx = w / 2;
  const cy = h * 0.42;
  return (
    <g>
      <rect width={w} height={h} fill="#D8D5CE" />
      <g transform={`rotate(${t * 12} ${cx} ${cy})`}>
        {Array.from({length: 8}, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={cx + Math.cos(a) * m * 0.08} y1={cy + Math.sin(a) * m * 0.08} x2={cx + Math.cos(a) * m * 0.16} y2={cy + Math.sin(a) * m * 0.16} stroke="#7D786F" strokeWidth={SW} strokeLinecap="round" opacity={0.3 + (i / 8) * 0.7} />;
        })}
      </g>
      <text x={cx} y={cy + m * 0.3} textAnchor="middle" fontFamily={FONT_UI} fontSize={m * 0.11} fill="#6F6A62">buffering…</text>
      <text x={cx + m * 0.22} y={cy - m * 0.18} fontFamily={FONT_UI} fontSize={m * 0.1} fill="#6F6A62">z z</text>
    </g>
  );
};

const Stars: React.FC<{w: number; h: number; m: number; t: number; seed: number; n: number}> = ({w, h, m, t, seed, n}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const x = rand(seed + i) * w;
      const y = rand(seed + i + 50) * h * 0.55;
      const s = m * (0.02 + rand(seed + i + 90) * 0.025) * (0.7 + 0.3 * Math.sin(t * 0.2 + i));
      return <path key={i} d={`M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`} fill={C.ink} />;
    })}
  </g>
);

const Cat: React.FC<P> = ({w, h, m, t = 0}) => {
  const cx = w / 2;
  const cy = h * 0.45;
  const r = m * 0.3;
  const blink = t % 50 < 3;
  return (
    <g>
      <rect width={w} height={h} fill="#CDBEF3" />
      <Stars w={w} h={h} m={m} t={t} seed={3} n={7} />
      <path d={`M ${cx - r * 0.95} ${cy - r * 0.2} L ${cx - r * 0.8} ${cy - r * 1.15} L ${cx - r * 0.25} ${cy - r * 0.75} Z`} fill="#8B8D93" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M ${cx + r * 0.95} ${cy - r * 0.2} L ${cx + r * 0.8} ${cy - r * 1.15} L ${cx + r * 0.25} ${cy - r * 0.75} Z`} fill="#8B8D93" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.86} fill="#8B8D93" stroke={C.ink} strokeWidth={SW} />
      {[-1, 1].map((d) =>
        blink ? (
          <path key={d} d={`M ${cx + d * r * 0.4 - r * 0.15} ${cy - r * 0.05} q ${r * 0.15} ${r * 0.1} ${r * 0.3} 0`} stroke={C.ink} strokeWidth={SW} fill="none" />
        ) : (
          <g key={d}>
            <circle cx={cx + d * r * 0.4} cy={cy - r * 0.08} r={r * 0.2} fill="#F6C343" stroke={C.ink} strokeWidth={SW * 0.8} />
            <ellipse cx={cx + d * r * 0.4} cy={cy - r * 0.08} rx={r * 0.06} ry={r * 0.15} fill={C.ink} />
          </g>
        ),
      )}
      <path d={`M ${cx - r * 0.18} ${cy + r * 0.3} q ${r * 0.09} ${r * 0.12} ${r * 0.18} 0 q ${r * 0.09} ${r * 0.12} ${r * 0.18} 0`} fill="none" stroke={C.ink} strokeWidth={SW * 0.8} />
      {[-1, 1].map((d) => (
        <g key={d} stroke={C.ink} strokeWidth={SW * 0.6}>
          <line x1={cx + d * r * 0.55} y1={cy + r * 0.25} x2={cx + d * r * 1.15} y2={cy + r * 0.18} />
          <line x1={cx + d * r * 0.55} y1={cy + r * 0.35} x2={cx + d * r * 1.15} y2={cy + r * 0.42} />
        </g>
      ))}
    </g>
  );
};

const DOTS = ['#F2A0B4', '#8E8FE8', '#F6C343', '#FFFFFF', '#F2A0B4'];

const Dance: React.FC<P> = ({w, h, m, t = 0}) => {
  const floorY = h * 0.72;
  const s = (m / 230) * (h > w ? 1 : 0.9);
  const sway = Math.sin(t * 0.42) * 10;
  const bounce = Math.abs(Math.sin(t * 0.42)) * m * 0.04;
  return (
    <g>
      <rect width={w} height={h} fill="#BCEDE2" />
      {DOTS.map((c, i) => (
        <circle key={i} cx={w * (0.12 + rand(i + 7) * 0.8)} cy={h * (0.08 + rand(i + 17) * 0.35) + Math.sin(t * 0.1 + i) * 3} r={m * (0.03 + rand(i + 27) * 0.05)} fill={c} />
      ))}
      <Stars w={w} h={h} m={m} t={t} seed={11} n={4} />
      <rect y={floorY} width={w} height={h - floorY} fill="#8FD6C6" />
      <line x1={0} y1={floorY} x2={w} y2={floorY} stroke={C.ink} strokeWidth={SW} />
      <g transform={`translate(${w / 2} ${floorY - bounce}) rotate(${sway}) scale(${s})`}>
        <BuddyFigure eyes="happy" walk={t * 0.84} armsUp={0.5 + Math.sin(t * 0.84) * 0.5} stroke={3.5 / Math.max(s, 0.4)} />
      </g>
    </g>
  );
};

const Export: React.FC<P & {progress: number}> = ({w, h, m, progress}) => {
  const r = m * 0.2;
  const circ = 2 * Math.PI * r;
  return (
    <g>
      <rect width={w} height={h} fill="#2F4A45" />
      <circle cx={w / 2} cy={h * 0.45} r={r} fill="none" stroke="#51706A" strokeWidth={m * 0.05} />
      <circle cx={w / 2} cy={h * 0.45} r={r} fill="none" stroke={progress >= 1 ? '#8EE3B1' : C.white} strokeWidth={m * 0.05} strokeLinecap="round"
        strokeDasharray={`${circ * progress} ${circ}`} transform={`rotate(-90 ${w / 2} ${h * 0.45})`} />
      <text x={w / 2} y={h * 0.45 + m * 0.05} textAnchor="middle" fontFamily={FONT_UI} fontSize={m * 0.14} fill={C.white}>{Math.round(progress * 100)}%</text>
      <text x={w / 2} y={h * 0.62} textAnchor="middle" fontFamily={FONT_UI} fontSize={m * 0.08} fill="#BFD8D2">{progress >= 1 ? 'done!' : 'exporting…'}</text>
    </g>
  );
};
