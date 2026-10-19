import React from 'react';
import {PixelBuddy} from '../character/PixelBuddy';
import type {Eyes} from '../character/types';
import {D, DF} from './theme';

/**
 * 暖纸工作台风的 3:4 竖版封面（1080×1440）：点阵纸 + 左上小标签 + 两行粗黑体大标题（第二行关键词橙块白字）+ 一排步骤胶囊 + 中间一张窗口卡 + 右下角大号吉祥物 + 底部一句「这期能带走什么」。
 * 每期在 Root.tsx 注册成 `<期>-cover-tall` 的 Still，渲染到 <素材目录>/封面-3x4.png。
 */
export const DeskCoverTall: React.FC<{
  /** 左上小标签，如「AI 工作流拆解」 */
  tag: string;
  /** 第一行（黑字） */
  line1: string;
  /** 第二行：前半黑字 + hi 橙块白字 */
  line2: string;
  hi: string;
  /** 步骤胶囊（3–7 个） */
  steps: string[];
  /** 窗口卡标题和三行内容（本期的「说明书」） */
  card: {title: string; rows: string[]};
  /** 底部一句 */
  bottom: string;
  eyes?: Eyes;
}> = ({tag, line1, line2, hi, steps, card, bottom, eyes = 'star'}) => (
  <div style={{position: 'relative', width: 1080, height: 1440, overflow: 'hidden', background: D.paper, backgroundImage: `radial-gradient(${D.dot} 1.6px, transparent 1.8px)`, backgroundSize: '24px 24px'}}>
    <div style={{position: 'absolute', left: 70, top: 70, padding: '8px 18px', background: D.ink, color: '#fff', borderRadius: 8, fontFamily: DF.sans, fontWeight: 700, fontSize: 30, transform: 'rotate(-3deg)'}}>{tag}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: DF.serif, fontWeight: 900, color: D.ink, lineHeight: 1.22}}>
      <div style={{fontSize: 108}}>{line1}</div>
      <div style={{fontSize: 124}}>
        {line2}
        <span style={{display: 'inline-block', marginLeft: 8, padding: '0 14px', background: D.orange, color: '#fff', borderRadius: 14}}>{hi}</span>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14, padding: '0 60px'}}>
      {steps.map((s, i) => (
        <span key={s} style={{padding: '10px 22px', borderRadius: 30, background: i === 0 ? D.orange : D.card, boxShadow: '0 3px 12px rgba(70,55,35,0.10)', fontFamily: DF.sans, fontWeight: 700, fontSize: 30, color: i === 0 ? '#fff' : D.text}}>
          <span style={{color: i === 0 ? '#fff' : D.orange, marginRight: 8}}>{String(i + 1).padStart(2, '0')}</span>
          {s}
        </span>
      ))}
    </div>
    <div style={{position: 'absolute', left: 90, top: 700, width: 640, background: D.card, borderRadius: 14, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden', transform: 'rotate(-2deg)'}}>
      <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', borderBottom: `1px solid ${D.cardLine}`}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: '#d9d4cb'}} />
        ))}
      </div>
      <div style={{padding: '22px 32px 10px', fontFamily: DF.serif, fontWeight: 900, fontSize: 44, color: D.ink}}>
        <span style={{display: 'inline-block', width: 14, height: 36, borderRadius: 4, background: D.orange, marginRight: 14, verticalAlign: '-4px'}} />
        {card.title}
      </div>
      {card.rows.map((r, i) => (
        <div key={r} style={{padding: '18px 32px', borderTop: `1px solid ${D.cardLine}`, background: i === 1 ? D.tint : 'transparent', fontFamily: DF.sans, fontWeight: 700, fontSize: 32, color: D.text}}>{r}</div>
      ))}
    </div>
    <svg width={420} height={420} style={{position: 'absolute', left: 650, top: 760, overflow: 'visible'}}>
      <ellipse cx={210} cy={372} rx={150} ry={12} fill="rgba(70,55,35,0.14)" />
      <g transform="translate(210 370) scale(1.55)">
        <PixelBuddy eyes={eyes} armsUp={1} />
      </g>
    </svg>
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 70, padding: '22px 0', background: D.ink, borderRadius: 14, textAlign: 'center', fontFamily: DF.sans, fontWeight: 800, fontSize: 44, color: '#fff'}}>{bottom}</div>
  </div>
);

/**
 * 横版首帧封面（1920×1080）：给 DeskShow 的 cover 用。左边小标签 + 两行粗黑体大标题（第二行橙块）+ 步骤胶囊 + 底部一句；右边窗口卡 + 大号吉祥物。
 * 参数和 DeskCoverTall 相同。
 */
export const DeskCoverWide: React.FC<React.ComponentProps<typeof DeskCoverTall>> = ({tag, line1, line2, hi, steps, card, bottom, eyes = 'star'}) => (
  <div style={{position: 'relative', width: 1920, height: 1080, overflow: 'hidden', background: D.paper, backgroundImage: `radial-gradient(${D.dot} 1.6px, transparent 1.8px)`, backgroundSize: '24px 24px'}}>
    <div style={{position: 'absolute', left: 130, top: 150, padding: '8px 18px', background: D.ink, color: '#fff', borderRadius: 8, fontFamily: DF.sans, fontWeight: 700, fontSize: 32, transform: 'rotate(-3deg)'}}>{tag}</div>
    <div style={{position: 'absolute', left: 130, top: 250, fontFamily: DF.serif, fontWeight: 900, color: D.ink, lineHeight: 1.22}}>
      <div style={{fontSize: 118}}>{line1}</div>
      <div style={{fontSize: 136}}>
        {line2}
        <span style={{display: 'inline-block', marginLeft: 10, padding: '0 16px', background: D.orange, color: '#fff', borderRadius: 14}}>{hi}</span>
      </div>
    </div>
    <div style={{position: 'absolute', left: 130, top: 640, display: 'flex', flexWrap: 'wrap', gap: 14, width: 1000}}>
      {steps.map((s, i) => (
        <span key={s} style={{padding: '10px 22px', borderRadius: 30, background: i === 0 ? D.orange : D.card, boxShadow: '0 3px 12px rgba(70,55,35,0.10)', fontFamily: DF.sans, fontWeight: 700, fontSize: 30, color: i === 0 ? '#fff' : D.text}}>
          <span style={{color: i === 0 ? '#fff' : D.orange, marginRight: 8}}>{String(i + 1).padStart(2, '0')}</span>
          {s}
        </span>
      ))}
    </div>
    <div style={{position: 'absolute', left: 130, top: 800, padding: '18px 34px', background: D.ink, borderRadius: 14, fontFamily: DF.sans, fontWeight: 800, fontSize: 42, color: '#fff'}}>{bottom}</div>
    <div style={{position: 'absolute', left: 1180, top: 180, width: 600, background: D.card, borderRadius: 14, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden', transform: 'rotate(3deg)'}}>
      <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', borderBottom: `1px solid ${D.cardLine}`}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: '#d9d4cb'}} />
        ))}
      </div>
      <div style={{padding: '22px 32px 10px', fontFamily: DF.serif, fontWeight: 900, fontSize: 44, color: D.ink}}>
        <span style={{display: 'inline-block', width: 14, height: 36, borderRadius: 4, background: D.orange, marginRight: 14, verticalAlign: '-4px'}} />
        {card.title}
      </div>
      {card.rows.map((r, i) => (
        <div key={r} style={{padding: '18px 32px', borderTop: `1px solid ${D.cardLine}`, background: i === 1 ? D.tint : 'transparent', fontFamily: DF.sans, fontWeight: 700, fontSize: 32, color: D.text}}>{r}</div>
      ))}
    </div>
    <svg width={460} height={460} style={{position: 'absolute', left: 1330, top: 560, overflow: 'visible'}}>
      <ellipse cx={230} cy={412} rx={170} ry={13} fill="rgba(70,55,35,0.14)" />
      <g transform="translate(230 410) scale(1.8)">
        <PixelBuddy eyes={eyes} armsUp={1} />
      </g>
    </svg>
  </div>
);
