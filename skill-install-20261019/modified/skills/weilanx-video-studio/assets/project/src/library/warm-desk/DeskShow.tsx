import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../anim';
import type {Eyes} from '../character/types';
import type {CueAt} from '../cues';
import type {SfxCue} from '../types';
import {DeskMascot, PixelEmote} from './mascot';
import {DCaption, DeskBg, DeskDecor, Leave, StepBar} from './stage';
import {D} from './theme';

/**
 * 暖纸工作台风的口播骨架（横屏 1920×1080）：点阵纸 + 场景（换场时旧内容倾斜滑走）+ 顶部步骤条 + 右下角吉祥物 + 字幕 + 人声 / 配乐 / 音效三轨。
 * 场景组件收到的 f 是整片的全局帧，t 是场景内的局部帧；动画挂在字幕上（cf / cw），换口播只要换 SRT。
 */

export type DeskMix = 'all' | 'voice' | 'bgm' | 'sfx';

export interface DeskScene {
  /** 场景开始帧（通常是 cf(n) − 6） */
  from: number;
  /** 场景画面；f 全局帧，t = f − from */
  C: React.FC<{f: number; t: number}>;
  /** 属于第几步（0 起）：顶部步骤条把这一步点亮；不填表示不显示步骤条（开场、结尾） */
  step?: number;
  /** 吉祥物表情，默认 open */
  eyes?: Eyes;
  /** 进场时吉祥物跳一下 */
  hop?: boolean;
  /** 吉祥物头顶的小反应：[种类, 全局帧] */
  emotes?: [('!' | '?' | 'note' | 'dots'), number][];
  /** 音效 [名字, 全局帧, 音量]：名字是 public/audio/sfx/ 下的共享音效，或带 / 的完整路径（public/ 下） */
  sfx: SfxCue[];
  /** 这个场景里吉祥物退到画外（全屏 B-roll 让出右下角），10 帧滑下去 / 滑回来 */
  hideMascot?: boolean;
  /** 退场方向：-1 向左滑走、1 向右（默认按场景序号交替） */
  leave?: -1 | 1;
}

export interface DeskShowConfig {
  scenes: DeskScene[];
  duration: number;
  cueAt: CueAt;
  /** public/ 下的人声 / 配乐路径；预览时可以不给。长片建议给压缩过的 m4a（WAV 太大，Studio 加载慢会跳过开头），导出时 export.sh 另用 voice.wav / bgm.wav 分轨重混 */
  voice?: string;
  bgm?: string;
  bgmVolume?: number;
  /** 顶部步骤条的步骤名（如 ['文案', '配音', '找素材']）；不给就不显示 */
  steps?: string[];
  /** 吉祥物位置：默认右下角 */
  mascot?: {x: number; y: number; s: number};
  /** 常驻层：画在场景之上、吉祥物和字幕之下（比如左下角的出镜小窗 HostCam），f 是全局帧 */
  overlay?: React.FC<{f: number}>;
  /** 不画吉祥物（默认画） */
  noMascot?: boolean;
  /** 背景漂浮几何：true 全屏撒，给矩形数组 [x, y, w, h][] 时避开这些区域；不给就不画 */
  decor?: boolean | [number, number, number, number][];
  /** 每个场景内镜头缓慢推近的幅度（默认 0.025，即场景内 5 秒推近 2.5%） */
  push?: number;
  /** 首帧封面：前 frames 帧整屏显示封面，随后 6 帧淡出 */
  cover?: {C: React.FC<{f: number}>; frames: number};
}

const EXIT = 10;

export const DeskShow: React.FC<{config: DeskShowConfig; mix?: DeskMix}> = ({config, mix = 'all'}) => {
  const f = useCurrentFrame();
  const {scenes, duration, cueAt, voice, bgm, bgmVolume = 1, steps, mascot = {x: 1640, y: 990, s: 0.95}, cover, overlay: Overlay, noMascot, decor, push = 0.025} = config;
  const on = (m: DeskMix) => mix === 'all' || mix === m;
  const idx = scenes.reduce((k, s, i) => (f >= s.from ? i : k), 0);
  const cur = scenes[idx];
  const stepScenes = scenes.filter((s) => s.step !== undefined);
  const stepsFrom = stepScenes.length ? stepScenes[0].from : Infinity;
  const cue = cueAt(f);
  // 吉祥物退场程度：0 在场、1 完全退到画外；在当前场景开头 10 帧内从上一个场景的状态过渡过来
  const wasAway = idx > 0 && scenes[idx - 1].hideMascot ? 1 : 0;
  const away = wasAway + ((cur.hideMascot ? 1 : 0) - wasAway) * easeInOut(clamp01((f - cur.from) / 10));
  const sfxPath = (name: string) => (name.includes('/') ? name : `audio/sfx/${name}.wav`);

  return (
    <AbsoluteFill style={{background: D.paper, overflow: 'hidden'}}>
      <DeskBg f={f} />
      {decor ? <DeskDecor f={f} avoid={decor === true ? [] : decor} /> : null}

      {scenes.map((s, i) => {
        const to = i + 1 < scenes.length ? scenes[i + 1].from : duration;
        if (f < s.from || f >= to + EXIT) return null;
        return (
          <Leave key={i} f={f} at={to} dir={s.leave ?? (i % 2 ? 1 : -1)}>
            <AbsoluteFill style={{transform: `scale(${1 + push * easeInOut(clamp01((f - s.from) / 150))})`, transformOrigin: '50% 45%'}}>
              <s.C f={f} t={f - s.from} />
            </AbsoluteFill>
          </Leave>
        );
      })}

      {steps && cur.step !== undefined && f >= stepsFrom ? <StepBar f={f} at={stepsFrom} steps={steps} active={cur.step} compact /> : null}

      {Overlay ? <Overlay f={f} /> : null}

      {noMascot || away >= 1 ? null : (
        <AbsoluteFill style={{transform: `translateY(${away * 420}px)`, opacity: 1 - away}}>
          <DeskMascot f={f} x={mascot.x} y={mascot.y} s={mascot.s} eyes={cur.eyes ?? 'open'} hop={cur.hop ? cur.from : undefined} />
          {scenes.flatMap((s, i) => (s.emotes ?? []).map(([kind, at], k) => <PixelEmote key={`${i}-${k}`} f={f} at={at} kind={kind} x={mascot.x + 40} y={mascot.y - 300} px={9} color={kind === 'note' ? D.orange : D.ink} />))}
        </AbsoluteFill>
      )}

      {cue ? <DCaption f={f} at={0} text={cue.text} /> : null}

      {cover && f < cover.frames + 6 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - cover.frames) / 6)}}>
          <cover.C f={f} />
        </AbsoluteFill>
      ) : null}

      {on('voice') && voice ? <Audio src={staticFile(voice)} pauseWhenBuffering /> : null}
      {on('bgm') && bgm ? <Audio src={staticFile(bgm)} volume={bgmVolume} pauseWhenBuffering /> : null}
      {on('sfx') &&
        scenes
          .flatMap((s) => s.sfx)
          .map(([name, at, vol], i) => (
            <Sequence key={i} from={Math.max(0, at)} durationInFrames={60} layout="none">
              <Audio src={staticFile(sfxPath(name))} volume={vol} />
            </Sequence>
          ))}
    </AbsoluteFill>
  );
};
