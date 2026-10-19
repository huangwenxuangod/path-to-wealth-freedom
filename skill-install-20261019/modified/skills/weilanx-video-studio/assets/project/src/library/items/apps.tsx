import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {rand} from '../anim';
import {C} from '../theme';
import {FONT_CN, FONT_CODE} from '../fonts';

const INK = C.ink;

/** 通用应用窗口：标题栏三个圆点 + 标题 */
export const Win: React.FC<{w: number; h: number; title: string; dark?: boolean; children?: React.ReactNode; bodyStyle?: React.CSSProperties}> = ({w, h, title, dark, children, bodyStyle}) => (
  <div style={{width: w, height: h, boxSizing: 'border-box', border: `5px solid ${INK}`, borderRadius: 20, overflow: 'hidden', background: dark ? '#23262D' : C.white, boxShadow: '8px 10px 0 rgba(43,35,32,0.16)', display: 'flex', flexDirection: 'column'}}>
    <div style={{height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: dark ? '#33373F' : '#EFE9DC', borderBottom: `4px solid ${INK}`}}>
      {[C.red, C.yellow, '#3DAA6B'].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c, border: `2px solid ${INK}`}} />)}
      <div style={{marginLeft: 14, fontFamily: FONT_CODE, fontSize: 26, color: dark ? '#C9D1D9' : INK}}>{title}</div>
    </div>
    <div style={{flex: 1, position: 'relative', overflow: 'hidden', ...bodyStyle}}>{children}</div>
  </div>
);

/** 手机框里播放真实素材（静音）：在全局第 at 帧出现，从素材第 startFrom 帧开始播 */
export const PhoneVideo: React.FC<{src: string; at: number; startFrom: number; w?: number; tilt?: number}> = ({src, at, startFrom, w = 300, tilt = 0}) => {
  const h = (w * 16) / 9;
  return (
    <div style={{width: w + 24, height: h + 24, boxSizing: 'border-box', padding: 12, background: INK, borderRadius: w * 0.14, transform: `rotate(${tilt}deg)`, boxShadow: '8px 10px 0 rgba(43,35,32,0.18)'}}>
      <div style={{width: w, height: h, borderRadius: w * 0.1, overflow: 'hidden', position: 'relative', background: '#000'}}>
        <Sequence from={at} layout="none">
          <OffthreadVideo src={staticFile(src)} trimBefore={startFrom} muted style={{width: w, height: h, objectFit: 'cover'}} />
        </Sequence>
      </div>
    </div>
  );
};

/** 横屏框里播放真实素材 */
export const ScreenVideo: React.FC<{src: string; at: number; startFrom: number; w: number; h: number}> = ({src, at, startFrom, w, h}) => (
  <div style={{width: w, height: h, overflow: 'hidden', background: '#000', position: 'relative'}}>
    <Sequence from={at} layout="none">
      <OffthreadVideo src={staticFile(src)} trimBefore={startFrom} muted style={{width: w, height: h, objectFit: 'contain'}} />
    </Sequence>
  </div>
);

/** 波形条，progress 之前的部分高亮，seed 决定形状 */
export const Wave: React.FC<{w: number; h: number; n?: number; seed?: number; progress?: number; color?: string; dim?: string; stretch?: number}> = ({w, h, n = 90, seed = 1, progress = 1, color = C.teal, dim = '#C9E9E2', stretch = 1}) => (
  <svg width={w} height={h}>
    {Array.from({length: n}, (_, i) => {
      const a = 0.18 + rand(seed + Math.floor(i / stretch) * 3.3) * 0.7 + (i % 9 === 0 ? 0.12 : 0);
      const bh = Math.min(1, a) * h;
      const x = (i / n) * w;
      return <rect key={i} x={x} y={(h - bh) / 2} width={Math.max(2, (w / n) * 0.55)} height={bh} rx={2} fill={i / n <= progress ? color : dim} />;
    })}
  </svg>
);

export type Tok = [string, string?]; // [文字, 颜色]

/** 按字符数「打字」出来的代码 */
export const Code: React.FC<{lines: Tok[][]; typed: number; size?: number; cursor?: boolean; f?: number}> = ({lines, typed, size = 34, cursor = true, f = 0}) => {
  let budget = typed;
  let cursorShown = false;
  return (
    <div style={{fontFamily: FONT_CODE, fontSize: size, lineHeight: 1.45, whiteSpace: 'pre'}}>
      {lines.map((line, li) => {
        const len = line.reduce((s, [t]) => s + t.length, 0);
        const show = Math.max(0, Math.min(len, budget));
        const here = !cursorShown && budget <= len;
        if (here) cursorShown = true;
        budget -= len;
        let left = show;
        return (
          <div key={li} style={{minHeight: size * 1.45}}>
            {line.map(([t, color], ti) => {
              const s = t.slice(0, Math.max(0, left));
              left -= t.length;
              return <span key={ti} style={{color: color ?? '#E6E1CF'}}>{s}</span>;
            })}
            {cursor && here && Math.floor(f / 8) % 2 === 0 && <span style={{color: C.yellow}}>▌</span>}
          </div>
        );
      })}
    </div>
  );
};

/** 胶片条：n 格，每格用 render 画内容 */
export const FilmStrip: React.FC<{n: number; cell: number; render: (i: number) => React.ReactNode}> = ({n, cell, render}) => (
  <div style={{display: 'flex', background: INK, padding: '18px 8px', gap: 8, borderRadius: 8}}>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{position: 'relative', width: cell, height: cell * 0.62, background: C.panel, borderRadius: 4, overflow: 'hidden'}}>
        {render(i)}
      </div>
    ))}
  </div>
);

export const Stopwatch: React.FC<{size?: number; p: number}> = ({size = 200, p}) => (
  <svg width={size} height={size * 1.12} viewBox="0 0 100 112">
    <rect x="42" y="2" width="16" height="10" rx="3" fill="#9A948A" stroke={INK} strokeWidth={3} />
    <circle cx="50" cy="62" r="44" fill={C.white} stroke={INK} strokeWidth={5} />
    <path d={`M50 62 L50 24 A38 38 0 ${p > 0.5 ? 1 : 0} 1 ${50 + Math.sin(p * 2 * Math.PI) * 38} ${62 - Math.cos(p * 2 * Math.PI) * 38} Z`} fill={C.yellow} opacity={0.8} />
    <line x1="50" y1="62" x2={50 + Math.sin(p * 2 * Math.PI) * 34} y2={62 - Math.cos(p * 2 * Math.PI) * 34} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <circle cx="50" cy="62" r="5" fill={INK} />
  </svg>
);

/** 调音台推子 */
export const Fader: React.FC<{label: string; v: number; color: string}> = ({label, v, color}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
    <div style={{position: 'relative', width: 70, height: 260, display: 'flex', justifyContent: 'center'}}>
      <div style={{width: 14, height: '100%', background: '#3A3F48', borderRadius: 7, border: `3px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 0, top: (1 - v) * 220, width: 70, height: 40, background: color, border: `4px solid ${INK}`, borderRadius: 8}} />
    </div>
    <div style={{fontFamily: FONT_CN, fontSize: 30, color: INK}}>{label}</div>
  </div>
);

/** 手绘光标箭头 */
export const Cursor: React.FC<{size?: number; down?: boolean}> = ({size = 46, down}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 30 40" style={{transform: `scale(${down ? 0.88 : 1})`, transformOrigin: 'top left', filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.25))'}}>
    <path d="M3 3 L3 32 L11 25 L16 37 L22 34 L17 23 L27 23 Z" fill={C.white} stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />
  </svg>
);

export const GitHubMark: React.FC<{size?: number}> = ({size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill={INK} />
    <path d="M36 86 V72 Q24 74 20 64 Q18 58 14 56 Q20 54 24 60 Q28 66 36 64 Q36 58 40 56 Q24 54 22 40 Q22 32 28 28 Q26 22 28 16 Q34 16 40 22 Q50 19 60 22 Q66 16 72 16 Q74 22 72 28 Q78 32 78 40 Q76 54 60 56 Q64 60 64 68 V86 Z" fill={C.white} />
  </svg>
);

export interface PhotoMark {
  x: number; // 高亮框在原图里的位置（原图像素）
  y: number;
  w: number;
  h: number;
  p: number; // 0..1 画出进度
  color?: string;
}

/**
 * 截图/图片素材：白边相框 + 倾斜 + 阴影。
 * src 是 public/ 下的路径；w 为显示宽度，按原图宽 natW 等比缩放；marks 在原图坐标上画高亮框
 */
export const Photo: React.FC<{src: string; natW: number; natH: number; w: number; tilt?: number; marks?: PhotoMark[]; pad?: number}> = ({src, natW, natH, w, tilt = 0, marks = [], pad = 14}) => {
  const k = w / natW;
  const h = natH * k;
  return (
    <div style={{width: w + pad * 2, height: h + pad * 2, boxSizing: 'border-box', padding: pad, background: C.white, border: `4px solid ${INK}`, borderRadius: 14, boxShadow: '8px 10px 0 rgba(43,35,32,0.18)', transform: `rotate(${tilt}deg)`}}>
      <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: 6}}>
        <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
        <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {marks.map((m, i) =>
            m.p > 0 ? (
              <rect key={i} x={m.x * k} y={m.y * k} width={m.w * k} height={m.h * k} rx={12} pathLength={1} fill="none" stroke={m.color ?? C.red} strokeWidth={7} strokeDasharray="1 1" strokeDashoffset={1 - m.p} strokeLinecap="round" />
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
};
