import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../anim';
import type {CueAt} from '../cues';
import type {SfxCue} from '../types';
import type {Mix} from '../Show';
import {VoxDefs} from './props';
import {sineInOut, tailEase, V, VF} from './theme';

/* ============ 相机 ============ */

/** 相机关键帧：在 f 帧到达 (x, y) 画面中心、缩放 z；ease 决定从上一帧怎么过来 */
export interface CamKey {
  f: number;
  x: number;
  y: number;
  z: number;
  ease?: 'sine' | 'tail' | 'cut';
  dur?: number; // 运动用多少帧（默认从上一个关键帧一路动到这一帧）
}

/** 按关键帧算出当前相机。到下一个关键帧之前保持不动；运动只占最后 dur 帧 */
export const camAt = (f: number, keys: CamKey[]) => {
  let prev = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f >= k.f) {
      prev = k;
      continue;
    }
    const dur = k.dur ?? k.f - prev.f;
    const start = k.f - dur;
    if (k.ease === 'cut' || f < start) return prev;
    const t = (f - start) / dur;
    const e = k.ease === 'tail' ? tailEase(t) : sineInOut(t);
    // 缩放用对数插值，推拉更自然
    const z = Math.exp(Math.log(prev.z) + (Math.log(k.z) - Math.log(prev.z)) * e);
    return {x: prev.x + (k.x - prev.x) * e, y: prev.y + (k.y - prev.y) * e, z};
  }
  return prev;
};

/** 把世界坐标的内容放到相机下：画面中心对准 (x, y)，缩放 z */
export const World: React.FC<{cam: {x: number; y: number; z: number}; w: number; h: number; children: React.ReactNode}> = ({cam, w, h, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      transformOrigin: '0 0',
      transform: `translate(${w / 2}px, ${h / 2}px) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
    }}
  >
    {children}
  </div>
);

/* ============ 字幕 ============ */

/** Vox 风字幕：深色半透明条、宋体粗字；关键词用荧光黄字 */
export const VoxSubtitles: React.FC<{f: number; cueAt: CueAt; y: number; w: number; keywords?: string[]}> = ({f, cueAt, y, w, keywords = []}) => {
  const c = cueAt(f);
  if (!c) return null;
  const parts: React.ReactNode[] = [];
  let rest = c.text;
  let k = 0;
  while (rest.length) {
    let hitAt = -1;
    let hit = '';
    for (const kw of keywords) {
      const i = rest.indexOf(kw);
      if (i >= 0 && (hitAt < 0 || i < hitAt)) {
        hitAt = i;
        hit = kw;
      }
    }
    if (hitAt < 0) {
      parts.push(rest);
      break;
    }
    if (hitAt > 0) parts.push(rest.slice(0, hitAt));
    parts.push(<span key={k++} style={{color: V.hiSolid}}>{hit}</span>);
    rest = rest.slice(hitAt + hit.length);
  }
  return (
    <div style={{position: 'absolute', left: 0, width: w, top: y, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 50, lineHeight: 1.3, color: V.paper, background: 'rgba(23,23,22,0.8)', padding: '8px 28px', borderRadius: 4, whiteSpace: 'nowrap'}}>{parts}</div>
    </div>
  );
};

/* ============ 整片骨架 ============ */

export interface VoxShowConfig {
  /** 整片画面：拿全局帧号画一帧（相机、世界、硬切都在里面自己算） */
  Film: React.FC<{f: number}>;
  sfx: SfxCue[];
  duration: number;
  cueAt: CueAt;
  voice: string;
  bgm: string;
  bgmVolume?: number;
  w?: number;
  h?: number;
  subY?: number;
  keywords?: string[];
  cover?: {C: React.FC<{f: number}>; frames: number};
}

/** Vox 拼贴解说骨架：没有场景淡入淡出（Vox 用硬切和相机运动），只负责字幕、封面和音轨 */
export const VoxShow: React.FC<{config: VoxShowConfig; mix?: Mix}> = ({config, mix = 'all'}) => {
  const f = useCurrentFrame();
  const {Film, sfx, cueAt, voice, bgm, bgmVolume = 1, w = 1920, h = 1080, subY = 960, keywords, cover} = config;
  const on = (m: Mix) => mix === 'all' || mix === m;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: V.desk}}>
      <VoxDefs />
      <Film f={f} />
      <VoxSubtitles f={f} cueAt={cueAt} y={subY} w={w} keywords={keywords} />
      {cover && f < cover.frames + 6 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(f, cover.frames, 6)}}>
          <cover.C f={f} />
        </div>
      )}
      {on('voice') && <Audio src={staticFile(voice)} />}
      {on('bgm') && <Audio src={staticFile(bgm)} volume={bgmVolume} />}
      {on('sfx') &&
        sfx.map(([name, at, vol], i) => (
          <Sequence key={i} from={Math.max(0, at)} durationInFrames={48} layout="none">
            <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
          </Sequence>
        ))}
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, pointerEvents: 'none', boxShadow: 'inset 0 0 220px rgba(40,30,20,0.25)'}} />
    </AbsoluteFill>
  );
};
