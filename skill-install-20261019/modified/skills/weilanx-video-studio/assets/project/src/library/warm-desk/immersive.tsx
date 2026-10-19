import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOut, easeOut, easeOutBack} from '../anim';
import {D, DF, OG, rise} from './theme';

/**
 * 暖纸工作台风的「全屏 B-roll」：人物和吉祥物都退场时，整屏交给一个沉浸式主视觉。
 * 共同手法：大尺寸 + 3D 透视入场（从倾斜慢慢摆正）+ 场景内缓慢推近 + 纸面上的柔和投影；颜色仍然只有一种朱橙。
 */

/** 3D 入场容器：at 起 dur 帧从 (rx, ry) 的倾斜 + 下沉 + 模糊摆正到平面，之后持续极慢地推近（drift 每帧放大量）；children 按原尺寸排版 */
export const Tilt3D: React.FC<{f: number; at: number; x: number; y: number; rx?: number; ry?: number; dur?: number; drift?: number; origin?: string; children: React.ReactNode}> = ({f, at, x, y, rx = 18, ry = -14, dur = 22, drift = 0.00035, origin = '50% 50%', children}) => {
  if (f < at - 1) return null;
  const t = clamp01((f - at) / dur);
  const p = easeOut(t);
  const s = 0.92 + 0.08 * easeOutBack(t) + Math.max(0, f - at) * drift;
  return (
    <div style={{position: 'absolute', left: x, top: y, perspective: 1800}}>
      <div style={{opacity: clamp01(t * 2), filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, transform: `translateY(${(1 - p) * 80}px) rotateX(${rx * (1 - p)}deg) rotateY(${ry * (1 - p)}deg) scale(${s})`, transformOrigin: origin}}>{children}</div>
    </div>
  );
};

/** 浏览器窗：圆角白框 + 顶部三个圆点 + 地址栏（url）+ 内容；w / h 是内容区尺寸 */
export const BrowserFrame: React.FC<{url: string; w: number; h: number; children: React.ReactNode; dark?: boolean}> = ({url, w, h, children, dark = false}) => (
  <div style={{width: w, borderRadius: 20, overflow: 'hidden', background: dark ? '#1f1b17' : D.card, boxShadow: '0 40px 90px rgba(60,40,20,0.22), 0 6px 16px rgba(60,40,20,0.10)', border: `1px solid ${dark ? '#332d27' : D.cardLine}`}}>
    <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: dark ? '#2a2520' : 'linear-gradient(180deg, #fffdfa, #f6f1ea)', borderBottom: `1px solid ${dark ? '#332d27' : D.cardLine}`}}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: i === 0 ? D.orange : dark ? '#4a433b' : '#ddd6cb'}} />
      ))}
      <div style={{marginLeft: 24, flex: 1, maxWidth: w * 0.6, height: 32, borderRadius: 16, background: dark ? '#1a1612' : '#efe9e0', display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: DF.mono, fontSize: 18, color: dark ? '#9a9085' : D.gray, whiteSpace: 'nowrap', overflow: 'hidden'}}>{url}</div>
    </div>
    <div style={{width: w, height: h, overflow: 'hidden', position: 'relative'}}>{children}</div>
  </div>
);

/**
 * 胶片带：一整条横贯画面的深色胶片（上下齿孔），格子里一颗橙球一格一格往右挪，整条向左滚；
 * speedUp 帧起滚动加速、格子拖出动态模糊（「一秒钟播放几十张」）。y 是胶片上沿，高 260
 */
export const FilmRun: React.FC<{f: number; at: number; speedUp?: number; y?: number; tilt?: number}> = ({f, at, speedUp, y = 0, tilt = -4}) => {
  const t = Math.max(0, f - at);
  const fast = speedUp === undefined ? 0 : easeInOut(clamp01((f - speedUp) / 30));
  const dist = t * 4 + (speedUp === undefined ? 0 : Math.max(0, f - speedUp) * 26 * fast);
  const W = 300;
  const n = 10;
  const off = dist % W;
  const r = rise(f, at, 16, 60);
  return (
    <div style={{position: 'absolute', left: -200, top: y, width: 2400, height: 260, background: '#211c17', transform: `rotate(${tilt}deg)`, boxShadow: '0 30px 60px rgba(40,25,10,0.25)', opacity: r.opacity, overflow: 'hidden'}}>
      {[0, 1].map((side) => (
        <div key={side} style={{position: 'absolute', left: -off, [side ? 'bottom' : 'top']: 10, width: 2800, height: 16, backgroundImage: 'linear-gradient(90deg, #f3efe7 0 18px, transparent 18px 36px)', backgroundSize: '36px 16px', opacity: 0.6}} />
      ))}
      {Array.from({length: n}, (_, i) => {
        const k = Math.floor(dist / W) + i;
        return (
          <div key={i} style={{position: 'absolute', left: i * W - off + 20, top: 40, width: W - 40, height: 180, borderRadius: 10, background: D.paper, overflow: 'hidden', filter: fast > 0.05 ? `blur(${fast * 3}px)` : undefined}}>
            <div style={{position: 'absolute', left: 20 + (k % 8) * 26, top: 60 + Math.sin(k * 0.8) * 30, width: 54, height: 54, borderRadius: 27, background: OG}} />
            <div style={{position: 'absolute', left: 12, bottom: 8, fontFamily: DF.mono, fontSize: 18, color: D.gray}}>#{k + 1}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 3D 缩略图墙：一面倾斜的墙铺满画面，真实截图一张张亮起，整面墙缓慢斜向滚动；files 会循环铺满 cols × rows */
export const WallScroll: React.FC<{f: number; at: number; files: string[]; cols?: number; rows?: number}> = ({f, at, files, cols = 6, rows = 5}) => {
  const tw = 420;
  const th = 236;
  const g = 26;
  const scroll = Math.max(0, f - at) * 0.9;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', perspective: 1600}}>
      <div style={{position: 'absolute', left: -380, top: -260, width: cols * (tw + g), transform: `rotateX(28deg) rotateZ(-10deg) translateY(${-scroll}px)`, transformOrigin: '50% 0'}}>
        {Array.from({length: cols * rows}, (_, i) => {
          const t = clamp01((f - at - ((i * 7) % (cols * rows)) * 0.8) / 12);
          return (
            <div key={i} style={{position: 'absolute', left: (i % cols) * (tw + g) + (Math.floor(i / cols) % 2) * 60, top: Math.floor(i / cols) * (th + g), width: tw, height: th, borderRadius: 14, overflow: 'hidden', border: `4px solid ${D.card}`, boxShadow: '0 16px 30px rgba(60,40,20,0.20)', opacity: easeOut(t), transform: `scale(${0.8 + 0.2 * easeOutBack(t)})`}}>
              <Img src={staticFile(files[i % files.length])} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 55% at 50% 50%, rgba(243,239,231,0.0), rgba(243,239,231,0.55) 70%, rgba(243,239,231,0.92) 100%)'}} />
    </div>
  );
};

/** 帧率对比：一张小预览卡，小球按 fps 量化后移动（fps 低就一顿一顿的），右上角标「N 帧 / 秒」；good 时描橙边 */
export const FpsPreview: React.FC<{f: number; at: number; fps: number; label: string; good?: boolean; w?: number}> = ({f, at, fps, label, good = false, w = 340}) => {
  const r = rise(f, at, 14, 30);
  const t = Math.max(0, f - at);
  const q = Math.floor((t / 30) * fps) / fps;
  const x = 24 + ((q * 160) % (w - 90));
  return (
    <div style={{opacity: r.opacity, transform: r.transform, filter: r.filter, width: w, background: D.card, borderRadius: 20, border: `2px solid ${good ? D.orange : D.cardLine}`, boxShadow: good ? D.glow : D.shadow, overflow: 'hidden'}}>
      <div style={{position: 'relative', height: 170, background: D.paper, backgroundImage: `radial-gradient(${D.dot} 1.2px, transparent 1.4px)`, backgroundSize: '14px 14px'}}>
        <div style={{position: 'absolute', left: x, top: 60, width: 50, height: 50, borderRadius: 25, background: good ? OG : '#b9b1a5'}} />
        <div style={{position: 'absolute', right: 14, top: 12, padding: '4px 12px', borderRadius: 10, background: good ? OG : '#e9e3da', color: good ? '#fff' : D.gray, fontFamily: DF.sans, fontWeight: 900, fontSize: 22}}>{fps} 帧 / 秒</div>
      </div>
      <div style={{padding: '14px 20px', fontFamily: DF.sans, fontWeight: 800, fontSize: 28, color: good ? D.ink : D.gray}}>{label}</div>
    </div>
  );
};
