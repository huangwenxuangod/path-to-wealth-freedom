import React from 'react';
import {boil, easeOutBack, easeInOut, prog, rand} from '../../../library/anim';
import type {PhoneScene} from '../lib/state';
import {C, popTextStyle} from '../../../library/theme';
import {SceneArt} from './SceneArt';

export interface PhoneProps {
  x: number;
  y: number;
  w: number;
  h: number;
  scene: PhoneScene;
  sceneT: number;
  frame: number;
  shake?: number;
  sparkle?: number; // 0..1，屏幕上闪光星星数量
  spinIn?: number; // 0..1，Spin 转场进度（<1 时画面在旋转）
  exportProgress?: number;
  /** 屏幕上的字幕，以及每个词出现的帧偏移 */
  caption?: {words: string[]; t: number; size: number; color?: string; bottom?: number; wrap?: boolean};
  overlay?: React.ReactNode;
}

const Sparkles: React.FC<{w: number; h: number; amount: number; frame: number}> = ({w, h, amount, frame}) => {
  const n = Math.round(amount * 14);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: n}, (_, i) => {
        const x = rand(i + 300) * w;
        const y = rand(i + 400) * h * 0.9;
        const s = (8 + rand(i + 500) * 10) * (0.6 + 0.4 * Math.sin(frame * 0.3 + i * 1.7));
        return <path key={i} d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`} fill={C.white} stroke={C.ink} strokeWidth={1.8} />;
      })}
    </svg>
  );
};

/** 手机外框 + 屏幕内容。编辑器里的预览和片尾大手机共用 */
export const Phone: React.FC<PhoneProps> = ({x, y, w, h, scene, sceneT, frame, shake = 0, sparkle = 0, spinIn = 1, exportProgress = 0, caption, overlay}) => {
  const k = w / 282; // 以编辑器里的尺寸为基准
  const border = 10 * k;
  const sw = w - border * 2;
  const sh = h - border * 2;
  const pop = 1 + (1 - prog(sceneT, 0, 6, easeOutBack)) * 0.04;
  const jx = shake ? boil(frame * 4, 11, 16 * k) : 0;
  const jy = shake ? boil(frame * 4, 12, 12 * k) : 0;
  const jr = shake ? boil(frame * 4, 13, 5) : 0;
  const spinRot = (1 - easeInOut(spinIn)) * -360;
  const spinScale = 1 - Math.sin(spinIn * Math.PI) * 0.35;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        background: C.ink,
        borderRadius: 40 * k,
        padding: border,
        boxShadow: `${6 * k}px ${8 * k}px 0 rgba(43,35,32,0.12)`,
      }}
    >
      <div style={{position: 'relative', width: sw, height: sh, borderRadius: 30 * k, overflow: 'hidden', background: '#F3EEE4'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${jx}px, ${jy}px) rotate(${jr + spinRot}deg) scale(${pop * spinScale * (shake ? 1.12 : 1)})`}}>
          <SceneArt scene={scene} w={sw} h={sh} t={frame} progress={exportProgress} />
        </div>
        {sparkle > 0 && scene !== 'export' && <Sparkles w={sw} h={sh} amount={sparkle} frame={frame} />}
        {caption && caption.t >= 0 && (scene === 'cat' || scene === 'dance' || scene === 'coffee') && (
          <div style={{position: 'absolute', left: 0, right: 0, bottom: sh * (caption.bottom ?? 0.2), display: 'flex', justifyContent: 'center', alignItems: 'center', columnGap: caption.size * 0.25, rowGap: 0, flexWrap: caption.wrap ? 'wrap' : 'nowrap', padding: `0 ${10 * k}px`}}>
            {caption.words.map((word, i) => {
              const p = prog(caption.t, i * 7, 8, easeOutBack);
              if (caption.t < i * 7) return null;
              return (
                <span key={i} style={{...popTextStyle(caption.size, caption.color ?? C.yellow), display: 'inline-block', transform: `scale(${p}) rotate(${(i % 2 ? 3 : -3) * p}deg)`}}>
                  {word}
                </span>
              );
            })}
          </div>
        )}
        {overlay}
      </div>
      <div style={{position: 'absolute', left: w / 2 - 36 * k, top: border + 10 * k, width: 72 * k, height: 14 * k, borderRadius: 8 * k, background: C.ink}} />
    </div>
  );
};
