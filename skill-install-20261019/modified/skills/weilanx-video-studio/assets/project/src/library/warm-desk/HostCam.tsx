import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import {D, DF, OG} from './theme';

/**
 * 出镜小窗：真人口播视频装进一个白边小圆角的方框（柔和投影），背后垫一块错开的朱橙渐变卡（层次感），常驻在画面一角。
 * src 是 public/ 下的视频（建议转成 H.264、方形 720×720、去掉音轨，人声另走 voice.wav）；
 * x / y 左上角，size 边长，radius 圆角（默认 16，不要太大）；name 给了就在框下沿挂一枚白色名字胶囊（橙色圆点 + 名字 + role 小字）。
 * f 给了时背后的橙卡会轻轻呼吸。视频从第 0 帧开始播，和人声对齐；挂在 DeskShow 的 overlay 上就不会随换场重播。
 */
export const HostCam: React.FC<{src: string; x: number; y: number; size: number; radius?: number; name?: string; role?: string; f?: number}> = ({src, x, y, size, radius = 16, name, role, f = 0}) => {
  const k = size / 540;
  const breathe = Math.sin(f / 45) * 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: radius + 2, background: OG, opacity: 0.9, transform: `translate(${(16 + breathe) * k}px, ${(16 + breathe) * k}px) rotate(${2.4}deg)`, boxShadow: D.glow}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: radius + 2, border: `2px dashed ${D.faint}`, transform: `translate(${-14 * k}px, ${-14 * k}px) rotate(-2deg)`}} />
      <div style={{position: 'relative', width: size, height: size, borderRadius: radius, overflow: 'hidden', border: `${Math.max(4, 6 * k)}px solid ${D.card}`, boxShadow: D.shadow, background: D.ink, boxSizing: 'border-box'}}>
        <OffthreadVideo src={staticFile(src)} muted pauseWhenBuffering style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
      </div>
      {name ? (
        <div style={{position: 'absolute', left: 22 * k + 6, bottom: -22, display: 'flex', alignItems: 'center', gap: 10, padding: '7px 18px 7px 14px', background: D.card, borderRadius: 30, boxShadow: '0 8px 20px rgba(70,50,30,0.16)', fontFamily: DF.sans, whiteSpace: 'nowrap'}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: D.orange, boxShadow: `0 0 0 ${3 + Math.abs(Math.sin(f / 15)) * 3}px rgba(241,90,53,0.18)`}} />
          <span style={{fontWeight: 900, fontSize: 24, color: D.ink}}>{name}</span>
          {role ? <span style={{fontWeight: 600, fontSize: 18, color: D.gray}}>{role}</span> : null}
        </div>
      ) : null}
    </div>
  );
};
