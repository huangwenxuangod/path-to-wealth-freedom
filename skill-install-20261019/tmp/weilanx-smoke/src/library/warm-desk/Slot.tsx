import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Icon} from './props';
import {WindowCard} from './stage';
import {D, DF} from './theme';

/**
 * 素材位：B-roll 里要放真实素材（录屏、截图、往期片段）的地方。
 * 素材还没到时画一个占位框（斜纹底 + 虚线橙框 + 「待补素材」+ 要什么 + 文件路径），预览时一眼看出缺什么；
 * 用户把文件放到 public/<file> 后，把这条 SlotSpec 的 ready 改成 true，框里就换成真素材（视频静音、从 at 帧开始播）。
 * 每期把所有 SlotSpec 写在一个 assets.ts 里，同时生成一份素材清单给用户。
 */
export interface SlotSpec {
  /** 编号，如 S01，素材清单和占位框上都会显示 */
  id: string;
  kind: 'video' | 'image';
  /** 要什么（一句话，给用户看） */
  need: string;
  /** public/ 下的路径 */
  file: string;
  /** 补充说明：时长、画面要点 */
  note?: string;
  /** 素材已经放好 */
  ready?: boolean;
  /** 视频从素材的第几秒开始用 */
  trimStart?: number;
}

/** bare：不套窗口卡（已经放在 BrowserFrame 之类的外框里时用） */
export const MediaSlot: React.FC<{f: number; at: number; spec: SlotSpec; w: number; h: number; title?: string; fit?: 'cover' | 'contain'; bare?: boolean}> = ({f, at, spec, w, h, title, fit = 'cover', bare = false}) => {
  const body = spec.ready ? (
    spec.kind === 'video' ? (
      <Sequence from={at} layout="none">
        <OffthreadVideo src={staticFile(spec.file)} muted startFrom={Math.round((spec.trimStart ?? 0) * 30)} style={{width: w, height: h, objectFit: fit, display: 'block', background: '#111'}} />
      </Sequence>
    ) : (
      <Img src={staticFile(spec.file)} style={{width: w, height: h, objectFit: fit, display: 'block', background: '#f6f2ec'}} />
    )
  ) : (
    <div style={{position: 'relative', width: w, height: h, boxSizing: 'border-box', border: `3px dashed rgba(241,90,53,0.55)`, borderRadius: 10, background: `repeating-linear-gradient(135deg, #faf6f0 0 18px, #f3ede4 18px 36px)`, backgroundPosition: `${f * 0.6}px 0`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 30}}>
      <div style={{width: 76, height: 76, borderRadius: 38, background: D.card, boxShadow: '0 6px 16px rgba(70,50,30,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: spec.kind === 'video' ? 6 : 0, boxSizing: 'border-box'}}>
        {spec.kind === 'video' ? (
          <Icon kind="play" size={34} color={D.orange} />
        ) : (
          <svg width={38} height={38} viewBox="0 0 40 40" fill="none" stroke={D.orange} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round">
            <rect x={5} y={8} width={30} height={24} rx={3} />
            <circle cx={14} cy={16} r={3} />
            <path d="M7 30l9-9 6 6 4-4 9 9" />
          </svg>
        )}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: DF.sans, fontWeight: 800, fontSize: 22, color: D.orangeDeep}}>
        <span style={{padding: '3px 12px', borderRadius: 8, background: D.orange, color: '#fff'}}>{spec.id}</span>
        待补素材 · {spec.kind === 'video' ? '视频' : '图片'}
      </div>
      <div style={{fontFamily: DF.sans, fontWeight: 900, fontSize: Math.min(36, w / 16), color: D.ink, lineHeight: 1.3, maxWidth: w - 80}}>{spec.need}</div>
      <div style={{fontFamily: DF.mono, fontSize: 17, color: D.gray}}>public/{spec.file}</div>
      {spec.note ? <div style={{fontFamily: DF.sans, fontWeight: 600, fontSize: 20, color: D.gray, maxWidth: w - 80}}>{spec.note}</div> : null}
    </div>
  );
  if (bare) return <div style={{width: w, height: h, overflow: 'hidden'}}>{body}</div>;
  return (
    <WindowCard w={w + 2} title={title ?? spec.file.split('/').pop()} pad={0} accent={spec.ready ? undefined : spec.id}>
      <div style={{width: w, height: h, overflow: 'hidden'}}>{body}</div>
    </WindowCard>
  );
};
