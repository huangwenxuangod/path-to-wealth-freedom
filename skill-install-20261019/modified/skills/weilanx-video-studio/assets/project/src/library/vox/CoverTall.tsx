import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Desk, HandLine, Label, Tape, VoxDefs} from './props';
import {Pushpin} from './stickers';
import {V, VF} from './theme';

/**
 * Vox 系列的 3:4 竖版封面（1080×1440），小红书等平台单独上传封面用。
 * 上半张黑卡放系列号、钩子标签、大标题、年份；下半张桌面拼贴：一张纸卡上的红色命运线 + 人物网点照片 + 本期贴纸；底部一句荧光黄的钩子。
 * curve 是命运线的折点（0..1 归一化，y 越大越低），dips 是要画黑圈的折点下标。
 */
export interface VoxCoverTallProps {
  index: string;
  kicker: string;
  title: [string, string];
  years: string;
  hook: React.ReactNode;
  curve: [number, number][];
  dips?: number[];
  curveLabel?: string;
  peakLabel?: string;
  photo: React.ReactNode;
  sticker: React.ReactNode;
  titleSize?: number;
}

const CW = 620;
const CH = 400;

export const VoxCoverTall: React.FC<VoxCoverTallProps> = ({index, kicker, title, years, hook, curve, dips = [], curveLabel, peakLabel, photo, sticker, titleSize = 262}) => {
  const pts = curve.map(([x, y]) => [30 + x * (CW - 60), 40 + y * (CH - 90)] as [number, number]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <VoxDefs />
      <Desk w={1080} h={1440} color={V.oldMap} seed={11} />
      {/* 黑卡 */}
      <div style={{position: 'absolute', left: 50, top: 50, width: 980, height: 800, background: V.card, boxShadow: '4px 8px 12px rgba(23,23,22,0.3)'}} />
      <div style={{position: 'absolute', left: 100, top: 100, display: 'flex', gap: 16, alignItems: 'center'}}>
        <Label size={36} bg={V.paper} color={V.ink}>
          科技简史 · {index}
        </Label>
        <Label size={36} bg={V.red}>
          {kicker}
        </Label>
      </div>
      <div style={{position: 'absolute', left: 88, top: 176, fontFamily: VF.heavy, fontSize: titleSize, lineHeight: 1.0, color: V.paper, whiteSpace: 'nowrap'}}>
        {title[0]}
        <br />
        {title[1]}
      </div>
      <div style={{position: 'absolute', left: 100, top: 728, fontFamily: VF.num, fontSize: 110, color: V.paper, letterSpacing: 4, lineHeight: 1}}>{years}</div>
      {/* 命运线纸卡 */}
      <div style={{position: 'absolute', left: 70, top: 880, width: CW, height: CH, background: V.paper, transform: 'rotate(-2deg)', boxShadow: '3px 6px 10px rgba(23,23,22,0.3)'}}>
        <svg width={CW} height={CH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {[0.25, 0.5, 0.75].map((r) => (
            <line key={r} x1={20} x2={CW - 20} y1={40 + r * (CH - 90)} y2={40 + r * (CH - 90)} stroke="rgba(23,23,22,0.15)" strokeWidth={3} strokeDasharray="10 8" />
          ))}
          <HandLine points={pts} p={1} width={12} />
        </svg>
        {dips.map((i) => (
          <div key={i} style={{position: 'absolute', left: pts[i][0] - 30, top: pts[i][1] - 30, width: 60, height: 60, borderRadius: 30, border: `6px solid ${V.ink}`}} />
        ))}
        {curveLabel && (
          <div style={{position: 'absolute', left: 24, bottom: 20}}>
            <Label size={30} bg={V.red}>
              {curveLabel}
            </Label>
          </div>
        )}
        {peakLabel && (
          <div style={{position: 'absolute', right: 20, top: 14}}>
            <Label size={30}>{peakLabel}</Label>
          </div>
        )}
        <div style={{position: 'absolute', left: CW / 2 - 60, top: -18}}>
          <Tape w={120} rot={-4} />
        </div>
      </div>
      {/* 人物照 */}
      <div style={{position: 'absolute', left: 700, top: 790, transform: 'rotate(4deg)'}}>
        {photo}
        <div style={{position: 'absolute', left: 120, top: -14}}>
          <Pushpin size={40} />
        </div>
      </div>
      {/* 本期贴纸：放在照片正下方，不压照片说明和钩子条 */}
      <div style={{position: 'absolute', left: 770, top: 1200}}>{sticker}</div>
      {/* 底部钩子 */}
      <div style={{position: 'absolute', left: 60, top: 1335, background: V.hiSolid, padding: '10px 26px', transform: 'rotate(-1deg)', fontFamily: VF.heavy, fontSize: 56, color: V.ink, whiteSpace: 'nowrap', boxShadow: '3px 5px 0 rgba(23,23,22,0.85)'}}>{hook}</div>
    </AbsoluteFill>
  );
};
