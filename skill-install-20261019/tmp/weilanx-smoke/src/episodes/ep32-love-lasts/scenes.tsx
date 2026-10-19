import React from 'react';
import {clamp01} from '../../library/anim';
import {G, GF, goldText} from '../../library/gilded/theme';
import {REGIONS, VTA} from './timeline';

/**
 * ep32 的场景件：会跳的金心、18 个月的刻度环、三根柱子、长期伴侣的大脑示意图、居中大数字。
 */

/** 两头淡入淡出的可见度：a 起 fin 帧淡入，b 前 fout 帧淡出 */
export const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));

/** 心跳：beats 里每一帧跳一下（7 帧内放大到 1.12 再回落，第二下小一点） */
export const beatPulse = (f: number, beats: number[]) => {
  let s = 0;
  for (const b of beats) {
    const t = f - b;
    if (t >= 0 && t < 14) s = Math.max(s, (t < 7 ? Math.sin((t / 7) * Math.PI) * 0.12 : Math.sin(((t - 7) / 7) * Math.PI) * 0.06));
  }
  return 1 + s;
};

const HEART = 'M0 -40 C -20 -95 -110 -85 -110 -20 C -110 40 -40 80 0 115 C 40 80 110 40 110 -20 C 110 -85 20 -95 0 -40 Z';

/** 金心（第一秒的视觉锚点）：金色描边 + 内发光 + 身后光晕；pulse 心跳缩放，cool 0–1 由暖金褪成灰（热恋退去），size 缩放 */
export const GoldHeart: React.FC<{x: number; y: number; size?: number; pulse?: number; cool?: number; opacity?: number}> = ({x, y, size = 1, pulse = 1, cool = 0, opacity = 1}) => {
  const warm = 1 - cool;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
      <defs>
        <radialGradient id="h-glow">
          <stop offset="0%" stopColor={`rgba(255,214,140,${0.55 * warm + 0.08})`} />
          <stop offset="100%" stopColor="rgba(255,190,100,0)" />
        </radialGradient>
        <linearGradient id="h-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={warm > 0.5 ? G.goldBright : '#b8ad98'} stopOpacity={0.35 * warm + 0.1} />
          <stop offset="100%" stopColor={warm > 0.5 ? G.gold : '#6f675b'} stopOpacity={0.12 * warm + 0.05} />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${size * pulse})`}>
        <circle r={260} fill="url(#h-glow)" />
        <path d={HEART} fill="url(#h-fill)" stroke={warm > 0.3 ? G.goldBright : '#9c9384'} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${18 * warm + 2}px rgba(255,200,110,${0.9 * warm}))`}} />
        <path d={HEART} fill="none" stroke={G.gold} strokeWidth={1} transform="scale(0.82) translate(0 6)" opacity={0.5 * warm} />
      </g>
    </svg>
  );
};

/** 18 个月的刻度环：围着金心一圈 18 格，p 0–1 走完的比例（走过的格子变亮），label 显示在环下方 */
export const MonthRing: React.FC<{x: number; y: number; r?: number; p: number; label?: number; opacity?: number}> = ({x, y, r = 210, p, label = 0, opacity = 1}) => {
  const n = 18;
  const lit = p * n;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
        <g transform={`translate(${x} ${y})`}>
          <circle r={r} fill="none" stroke={G.goldFaint} strokeWidth={1} />
          {Array.from({length: n}, (_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const on = clamp01(lit - i);
            return (
              <line
                key={i}
                x1={Math.cos(a) * (r - 16)}
                y1={Math.sin(a) * (r - 16)}
                x2={Math.cos(a) * (r + 16)}
                y2={Math.sin(a) * (r + 16)}
                stroke={on > 0 ? G.goldBright : G.goldDeep}
                strokeWidth={on > 0 ? 5 : 2}
                strokeLinecap="round"
                opacity={0.35 + 0.65 * on}
                style={on > 0.5 ? {filter: `drop-shadow(0 0 6px ${G.gold})`} : undefined}
              />
            );
          })}
        </g>
      </svg>
      {label > 0 && (
        <div style={{position: 'absolute', left: x - 200, width: 400, top: y + r + 34, textAlign: 'center', opacity: label * opacity}}>
          <span style={{fontFamily: GF.num, fontSize: 64, ...goldText(0.6)}}>{Math.max(1, Math.round(lit))}</span>
          <span style={{fontFamily: GF.cn, fontSize: 32, color: G.ivoryDim, marginLeft: 10}}>个月</span>
        </div>
      )}
    </>
  );
};

/** 三根柱子（示意高度）：[标签, 高度 0–1, 金 / 红]，draw 0–1 柱子长出来的进度；note 写在柱子下方的小字 */
export const Bars3: React.FC<{x: number; y: number; bars: [string, number, 'gold' | 'red' | 'ivory'][]; draw: number; note?: string; opacity?: number}> = ({x, y, bars, draw, note, opacity = 1}) => {
  const H = 300;
  const col = (c: string) => (c === 'red' ? G.red : c === 'gold' ? G.gold : G.ivoryDim);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 620, height: H + 120, opacity}}>
      <svg width={620} height={H + 10} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={10} x2={610} y1={H} y2={H} stroke={G.goldLine} strokeWidth={1.5} />
        {bars.map(([, h, c], i) => {
          const bh = H * 0.92 * h * clamp01(draw);
          const bx = 50 + i * 200;
          return <rect key={i} x={bx} y={H - bh} width={120} height={bh} fill={col(c)} opacity={0.85} style={{filter: `drop-shadow(0 0 10px ${col(c)})`}} />;
        })}
      </svg>
      {bars.map(([label, , c], i) => (
        <div key={i} style={{position: 'absolute', left: 50 + i * 200 - 40, width: 200, top: H + 14, textAlign: 'center', fontFamily: GF.cn, fontSize: 26, color: c === 'ivory' ? G.ivoryDim : col(c)}}>
          {label}
        </div>
      ))}
      {note && <div style={{position: 'absolute', left: 0, right: 0, top: H + 60, textAlign: 'center', fontFamily: GF.cn, fontSize: 20, color: G.ivoryFaint}}>{note}</div>}
    </div>
  );
};

/** 居中大数字：金色渐变数字 + 单位 + 下方一行小字 */
export const BigNumber: React.FC<{value: string; unit: string; note?: string; y?: number; size?: number; opacity?: number}> = ({value, unit, note, y = 440, size = 200, opacity = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.7, textAlign: 'center', opacity, filter: opacity < 1 ? `blur(${(1 - opacity) * 8}px)` : undefined}}>
    <span style={{fontFamily: GF.num, fontSize: size, lineHeight: 1, ...goldText(0.9)}}>{value}</span>
    <span style={{fontFamily: GF.cn, fontSize: size * 0.24, color: G.ivoryDim, marginLeft: 14}}>{unit}</span>
    {note && <div style={{fontFamily: GF.cn, fontSize: 28, color: G.ivoryDim, marginTop: 14}}>{note}</div>}
  </div>
);

const BRAIN =
  'M165 330 C130 230 190 115 320 72 C440 34 610 38 725 100 C820 152 865 250 840 330 C825 378 790 402 740 406 C712 408 690 414 668 424 C640 436 612 440 590 438 C566 458 524 474 470 472 C400 470 330 455 298 425 C282 410 258 400 232 394 C192 384 170 360 165 330 Z';
const CEREBELLUM = 'M690 410 C735 398 795 412 802 452 C808 492 760 512 712 502 C672 492 662 444 690 410 Z';
const STEM = 'M548 430 C548 475 553 525 562 572 L600 572 C596 525 594 475 590 430';
const FOLDS = [
  'M300 412 C355 352 450 328 575 338', // 外侧裂
  'M310 255 C390 196 560 186 676 246', // 胼胝体
  'M330 262 C410 222 550 216 650 262',
  'M250 180 C290 150 335 160 352 118',
  'M420 96 C445 140 500 140 520 92',
  'M600 92 C620 140 680 150 700 112',
  'M720 170 C760 200 800 210 830 250',
  'M215 280 C250 262 290 280 318 262',
  'M760 300 C790 285 815 300 838 300',
  'M380 400 C420 420 470 425 520 410',
];

/**
 * 大脑矢状面示意图（金色细线）：VTA 在 vtaAt 帧亮起（大一号的光点 + 外圈），ghostAt 起 VTA 外再套一圈虚线「热恋者也亮在这里」；
 * REGIONS 第 i 个在 regionAt[i] 帧亮起，引线拉到左右两列标签。x / y 是 1000×600 画框左上角，draw 0–1 轮廓画出进度。
 */
export const BrainMap: React.FC<{f: number; x: number; y: number; draw: number; vtaAt: number; ghostAt: number; regionAt: number[]; opacity?: number}> = ({f, x, y, draw, vtaAt, ghostAt, regionAt, opacity = 1}) => {
  const left = REGIONS.map((r, i) => ({...r, i})).filter((r) => r.x < 520).sort((a, b) => a.y - b.y);
  const right = REGIONS.map((r, i) => ({...r, i})).filter((r) => r.x >= 520).sort((a, b) => a.y - b.y);
  const labelPos = new Map<number, {lx: number; ly: number; side: 'l' | 'r'}>();
  left.forEach((r, k) => labelPos.set(r.i, {lx: -60, ly: 90 + k * 78, side: 'l'}));
  right.forEach((r, k) => labelPos.set(r.i, {lx: 1060, ly: 110 + k * 92, side: 'r'}));
  const vt = f - vtaAt;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 1000, height: 600, opacity, transform: 'scale(1.12)', transformOrigin: '50% 0'}}>
      <svg width={1000} height={600} style={{position: 'absolute', overflow: 'visible'}}>
        {[BRAIN, CEREBELLUM, STEM].map((d, i) => (
          <path key={i} d={d} fill={i === 0 ? 'rgba(214,180,106,0.04)' : 'none'} stroke={G.goldLine} strokeWidth={2} pathLength={1} strokeDasharray={`${draw} 1`} />
        ))}
        {FOLDS.map((d, i) => (
          <path key={`f${i}`} d={d} fill="none" stroke={G.goldFaint} strokeWidth={1.5} pathLength={1} strokeDasharray={`${clamp01(draw * 1.3 - 0.3)} 1`} />
        ))}
        {REGIONS.map((r, i) => {
          const t = f - regionAt[i];
          if (t < 0) return null;
          const p = labelPos.get(i)!;
          const on = clamp01(t / 6);
          const lx = p.side === 'l' ? p.lx + 150 : p.lx - 10;
          return (
            <g key={i} opacity={on}>
              <line x1={r.x} y1={r.y} x2={lx} y2={p.ly} stroke={G.goldFaint} strokeWidth={1.2} />
              {t < 20 && <circle cx={r.x} cy={r.y} r={12 + t * 3} fill="none" stroke={G.goldBright} strokeWidth={2 * (1 - t / 20)} opacity={1 - t / 20} />}
              <circle cx={r.x} cy={r.y} r={26} fill={G.gold} opacity={0.18} />
              <circle cx={r.x} cy={r.y} r={8} fill={G.goldBright} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
            </g>
          );
        })}
        {vt >= 0 && (
          <g>
            {vt < 30 && <circle cx={VTA.x} cy={VTA.y} r={16 + vt * 5} fill="none" stroke={G.goldBright} strokeWidth={3 * (1 - vt / 30)} opacity={1 - vt / 30} />}
            <circle cx={VTA.x} cy={VTA.y} r={44} fill={G.goldBright} opacity={0.22 + 0.06 * Math.sin(f / 9)} />
            <circle cx={VTA.x} cy={VTA.y} r={12} fill="#fff4d6" style={{filter: `drop-shadow(0 0 16px ${G.goldBright})`}} />
          </g>
        )}
        {f >= ghostAt && <circle cx={VTA.x} cy={VTA.y} r={64} fill="none" stroke={G.ivory} strokeWidth={2} strokeDasharray="6 8" opacity={clamp01((f - ghostAt) / 12) * 0.8} />}
      </svg>
      {vt >= 0 && (
        <div style={{position: 'absolute', left: VTA.x - 160, width: 320, top: VTA.y + 70, textAlign: 'center', fontFamily: GF.cn, fontSize: 30, ...goldText(0.4), opacity: clamp01(vt / 10)}}>
          VTA · 腹侧被盖区
        </div>
      )}
      {f >= ghostAt && (
        <div style={{position: 'absolute', left: VTA.x - 200, width: 400, textAlign: 'center', top: VTA.y + 112, fontFamily: GF.cn, fontSize: 24, color: G.ivoryDim, opacity: clamp01((f - ghostAt) / 12), whiteSpace: 'nowrap'}}>
          刚热恋的人，也亮在这里
        </div>
      )}
      {REGIONS.map((r, i) => {
        const t = f - regionAt[i];
        if (t < 0) return null;
        const p = labelPos.get(i)!;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.side === 'l' ? p.lx - 20 : p.lx,
              width: 170,
              top: p.ly - 18,
              textAlign: p.side === 'l' ? 'right' : 'left',
              fontFamily: GF.cn,
              fontSize: 28,
              color: G.ivory,
              opacity: clamp01(t / 8),
              textShadow: t < 10 ? `0 0 ${16 * (1 - t / 10)}px ${G.goldBright}` : undefined,
            }}
          >
            {r.name}
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 0, bottom: -40, fontFamily: GF.cn, fontSize: 20, color: G.ivoryFaint, opacity: clamp01(draw)}}>区域位置为示意</div>
    </div>
  );
};
