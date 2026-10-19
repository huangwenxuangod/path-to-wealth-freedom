import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {clamp01, easeOut, prog} from '../anim';
import {FONT_CN} from '../fonts';
import {C} from '../theme';

/**
 * 真实素材面板（B-roll 用）：一张照片或一段视频铺满一个圆角相框，左下角标出作者和授权。
 * - 照片：从 from 到 to 慢慢推近（Ken Burns），focus 是推近的中心（0..1）
 * - 视频：在全局帧 at 开始播放（`Show` 的场景拿到的是全局帧，所以必须传 at），startFrom 是从素材第几帧开始
 * - 入场 enter 帧淡入并轻微放大，out 之后淡出；多块面板叠在同一位置就是交叉淡化
 */
export interface MediaPanelProps {
  f: number;
  src: string;
  kind?: 'img' | 'video';
  /** 出现的全局帧 */
  at: number;
  /** 开始淡出的全局帧（不传就一直在） */
  out?: number;
  w: number;
  h: number;
  /** 推近范围：[开始缩放, 结束缩放]，照片默认 1 → 1.12 */
  zoom?: [number, number];
  /** 推近持续的帧数 */
  dur?: number;
  focus?: [number, number];
  /** 视频从素材的第几帧开始 */
  startFrom?: number;
  credit?: string;
  /** 圆角相框（默认）还是无边框铺满 */
  frame?: boolean;
  style?: React.CSSProperties;
}

export const MediaPanel: React.FC<MediaPanelProps> = ({f, src, kind = 'img', at, out, w, h, zoom = [1, 1.12], dur = 150, focus = [0.5, 0.5], startFrom = 0, credit, frame = true, style}) => {
  if (f < at || (out !== undefined && f >= out + 10)) return null;
  const pIn = prog(f, at, 10, easeOut);
  const pOut = out !== undefined ? prog(f, out, 10) : 0;
  const t = clamp01((f - at) / dur);
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  const media: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
    transform: `scale(${s})`,
    transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
  };
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        overflow: 'hidden',
        borderRadius: frame ? 22 : 0,
        border: frame ? `6px solid ${C.ink}` : 'none',
        boxShadow: frame ? '10px 12px 0 rgba(43,35,32,0.22)' : 'none',
        background: '#000',
        opacity: pIn * (1 - pOut),
        transform: `scale(${0.96 + 0.04 * pIn})`,
        ...style,
      }}
    >
      {kind === 'img' ? (
        <Img src={staticFile(src)} style={media} />
      ) : (
        <Sequence from={at} layout="none">
          <OffthreadVideo src={staticFile(src)} trimBefore={startFrom} muted style={media} />
        </Sequence>
      )}
      {credit && (
        <div style={{position: 'absolute', left: 12, bottom: 10, padding: '3px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: FONT_CN, fontSize: 18, whiteSpace: 'nowrap'}}>{credit}</div>
      )}
    </div>
  );
};
