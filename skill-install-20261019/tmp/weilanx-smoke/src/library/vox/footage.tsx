import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Tape, shadow} from './props';
import {V, VF} from './theme';

/**
 * Vox 拼贴里的真实素材（B-roll）：照片或视频装在白边相框里，上面两条胶带，左下角标作者和授权。
 * 按 Vox 的规矩，随切点直接出现，不弹不淡；素材自己从 zoom[0] 慢慢推到 zoom[1]（30fps 平滑）。
 * 视频必须传 start（开始播放的全局帧），startFrom 是从素材的第几帧开始。
 */
export const VoxFootage: React.FC<{
  f: number;
  src: string;
  kind?: 'img' | 'video';
  start: number;
  startFrom?: number;
  w: number;
  h: number;
  rot?: number;
  zoom?: [number, number];
  dur?: number;
  focus?: [number, number];
  credit?: string;
  tape?: boolean;
  bg?: string;
}> = ({f, src, kind = 'img', start, startFrom = 0, w, h, rot = 0, zoom = [1, 1.08], dur = 120, focus = [0.5, 0.5], credit, tape = true, bg = '#000'}) => {
  const t = Math.max(0, Math.min(1, (f - start) / dur));
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
    <div style={{position: 'relative', width: w + 28, transform: `rotate(${rot}deg)`, filter: shadow}}>
      <div style={{background: V.paper, padding: 14}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: bg}}>
          {kind === 'img' ? (
            <Img src={staticFile(src)} style={media} />
          ) : (
            <Sequence from={start} layout="none">
              <OffthreadVideo src={staticFile(src)} trimBefore={startFrom} muted style={media} />
            </Sequence>
          )}
          {credit && (
            <div style={{position: 'absolute', left: 10, bottom: 8, padding: '2px 10px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap'}}>{credit}</div>
          )}
        </div>
      </div>
      {tape && (
        <>
          <div style={{position: 'absolute', left: -20, top: -12}}>
            <Tape w={120} rot={-24} />
          </div>
          <div style={{position: 'absolute', right: -20, top: -12}}>
            <Tape w={120} rot={22} />
          </div>
        </>
      )}
    </div>
  );
};

/** Vox 的黑卡（A-roll 大字卡）：整屏黑卡纸，四周露一圈桌面 */
export const BlackCard: React.FC<{w?: number; h?: number; children: React.ReactNode}> = ({w = 1920, h = 1080, children}) => (
  <div style={{position: 'absolute', inset: 0, background: V.desk}}>
    <div style={{position: 'absolute', left: 40, top: 34, width: w - 80, height: h - 68, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.3)'}}>{children}</div>
  </div>
);
