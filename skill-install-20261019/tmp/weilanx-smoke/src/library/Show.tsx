import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeOut, prog} from './anim';
import {DotPaper, PaperGrain} from './fx';
import type {CueAt} from './cues';
import {ChapterTag, Subtitles} from './Subtitles';
import {LOOK_VARS, LookContext, type Look} from './ui';
import type {SceneDef} from './types';
import './fonts';

export const W = 1080;
export const H = 1920;
const EXIT = 10;

export type Mix = 'all' | 'voice' | 'bgm' | 'sfx';

export interface ShowConfig {
  scenes: SceneDef[];
  duration: number;
  cueAt: CueAt;
  voice: string; // public/ 下的路径
  bgm: string;
  bgmVolume?: number;
  /** 背景层（默认是点阵纸） */
  Backdrop?: React.FC<{f: number; w: number; h: number}>;
  /** 画布与版式，默认竖屏 1080×1920 */
  w?: number;
  h?: number;
  stage?: {top: number; h: number};
  subY?: number;
  chapter?: {y: number; align: 'center' | 'left'};
  /** 画面风格，默认 classic；sticker 为贴纸风 */
  look?: Look;
  /** 本期额外要在字幕里高亮的词 */
  keywords?: string[];
  /** 首帧封面：前 frames 帧整屏显示封面，随后 6 帧淡出（要赶在第一句口播画面出来之前） */
  cover?: {C: React.FC<{f: number}>; frames: number};
}


/** 场景入场（轻微放大 + 淡入）与出场（上移 + 淡出） */
const SceneWrap: React.FC<{f: number; from: number; to: number; w: number; top: number; h: number; children: React.ReactNode}> = ({f, from, to, w, top, h, children}) => {
  if (f < from || f >= to + EXIT) return null;
  const pin = prog(f, from, 10, easeOut);
  const pout = prog(f, to, EXIT, easeOut);
  // 场景持续期间镜头缓慢推近，让静止画面也有呼吸感
  const drift = 1 + 0.025 * prog(f, from, Math.max(1, to - from));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: w,
        height: h,
        opacity: pin * (1 - pout),
        transform: `translateY(${-pout * 60}px) scale(${(0.96 + 0.04 * pin) * drift})`,
        transformOrigin: '50% 45%',
      }}
    >
      {children}
    </div>
  );
};

/** 竖屏口播动画的通用骨架：背景、场景切换、章节标签、字幕、音轨 */
export const Show: React.FC<{config: ShowConfig; mix?: Mix}> = ({config, mix = 'all'}) => {
  const f = useCurrentFrame();
  const {scenes, duration, cueAt, voice, bgm, bgmVolume = 1, Backdrop = DotPaper, w = W, h = H, stage = {top: 270, h: 1100}, subY = 1420, chapter = {y: 150, align: 'center' as const}, look = 'classic', keywords, cover} = config;
  const idx = Math.max(0, scenes.findLastIndex((s) => f >= s.from));
  const cur = scenes[idx];
  const on = (m: Mix) => mix === 'all' || mix === m;
  return (
    <LookContext.Provider value={look}>
      <AbsoluteFill style={{overflow: 'hidden', ...LOOK_VARS[look]}}>
        <Backdrop f={f} w={w} h={h} />
        {scenes.map((s, i) => {
          const to = i + 1 < scenes.length ? scenes[i + 1].from : duration;
          return (
            <SceneWrap key={i} f={f} from={s.from} to={to} w={w} top={stage.top} h={stage.h}>
              <s.C f={f} />
            </SceneWrap>
          );
        })}
        {cur.title && (
          // 编号只在有标签的场景之间连续计数
          <ChapterTag key={idx} f={f} at={cur.from} no={scenes.slice(0, idx + 1).filter((s) => s.title).length} title={cur.title} y={chapter.y} align={chapter.align} />
        )}
        <Subtitles f={f} y={subY} cueAt={cueAt} keywords={keywords} />
        <PaperGrain w={w} h={h} />
        {cover && f < cover.frames + 6 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(f, cover.frames, 6)}}>
            <cover.C f={f} />
          </div>
        )}
        {on('voice') && <Audio src={staticFile(voice)} />}
        {on('bgm') && <Audio src={staticFile(bgm)} volume={bgmVolume} />}
        {on('sfx') &&
          scenes.flatMap((s) => s.sfx).map(([name, at, vol], i) => (
            <Sequence key={i} from={Math.max(0, at)} durationInFrames={48} layout="none">
              <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
            </Sequence>
          ))}
      </AbsoluteFill>
    </LookContext.Provider>
  );
};
