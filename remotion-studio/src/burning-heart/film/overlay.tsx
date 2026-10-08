import React from 'react';
import {AbsoluteFill, interpolate, Easing} from 'remotion';

/**
 * 2D 叠加层 —— HUD / 宋体字幕 / 图例
 *
 * 参考视频的关键细节：
 * - 左上角极小号衬线字「路线示意 / c. 1st-2nd CENTURY CE · SCHEMATIC」
 * - 顶部经纬度刻度尺（我们改成价格刻度尺）
 * - 右上角图例，逐条淡入
 * - 底部大号宋体字幕，带辉光
 */

export const PALETTE = {
  bg: '#050403',
  gold: '#D9A441',
  goldDim: '#8a7355',
  white: '#E8E4DA',
  red: '#E03A2F',
  blue: '#4A90C2',
  green: '#6FA86B',
  amber: '#E08A2F',
  plum: '#B03A5B',
} as const;

const SERIF = '"Source Han Serif SC", "Noto Serif SC", "Songti SC", serif';

export const fadeAt = (
  t: number,
  inStart: number,
  inEnd: number,
  outStart?: number,
  outEnd?: number
) => {
  let v = interpolate(t, [inStart, inEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  if (outStart !== undefined && outEnd !== undefined) {
    v *= interpolate(t, [outStart, outEnd], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return v;
};

/* ─────────────────── 左上角章节标签 ─────────────────── */

export const ChapterLabel: React.FC<{
  t: number;
  zh: string;
  en: string;
}> = ({t, zh, en}) => {
  const o = fadeAt(t, 0.3, 1.2);
  return (
    <div
      style={{
        position: 'absolute',
        top: 38,
        left: 44,
        opacity: o,
        fontFamily: SERIF,
      }}
    >
      <div
        style={{
          fontSize: 21,
          color: '#cfc6b4',
          letterSpacing: '0.14em',
          fontWeight: 500,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          marginTop: 7,
          fontSize: 11.5,
          color: '#6b6152',
          letterSpacing: '0.16em',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {en}
      </div>
    </div>
  );
};

/* ─────────────────── 顶部刻度尺（价格轴） ─────────────────── */

export const PriceRuler: React.FC<{t: number}> = ({t}) => {
  const o = fadeAt(t, 0.6, 1.8);
  const ticks = [
    {label: '¥8', x: 11},
    {label: '¥10', x: 21},
    {label: '¥12', x: 31},
    {label: '¥14', x: 41},
    {label: '¥16', x: 51},
    {label: '¥18', x: 61},
    {label: '¥20', x: 71},
    {label: '¥22', x: 81},
    {label: '¥24', x: 91},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, opacity: o * 0.85}}>
      {/* 横向细线 */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(217,164,65,0.22) 12%, rgba(217,164,65,0.22) 88%, transparent)',
        }}
      />
      {ticks.map((tk) => (
        <div
          key={tk.label}
          style={{
            position: 'absolute',
            left: `${tk.x}%`,
            top: 22,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#7a6f5d',
              letterSpacing: '0.1em',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {tk.label}
          </div>
          <div
            style={{
              width: 1,
              height: 12,
              margin: '6px auto 0',
              background: 'rgba(217,164,65,0.28)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

/* ─────────────────── 右上角图例 ─────────────────── */

export type LegendItem = {label: string; color: string};

export const Legend: React.FC<{
  t: number;
  items: LegendItem[];
  startAt: number;
}> = ({t, items, startAt}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 76,
        right: 52,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        fontFamily: SERIF,
      }}
    >
      {items.map((it, i) => {
        const o = fadeAt(t, startAt + i * 0.55, startAt + i * 0.55 + 0.7);
        if (o <= 0) return null;
        return (
          <div
            key={it.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 11,
              opacity: o,
              transform: `translateX(${(1 - o) * 22}px)`,
            }}
          >
            <span
              style={{
                fontSize: 17,
                color: '#d8d0be',
                letterSpacing: '0.06em',
              }}
            >
              {it.label}
            </span>
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: '50%',
                background: it.color,
                boxShadow: `0 0 16px ${it.color}, 0 0 32px ${it.color}66`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────── 底部宋体字幕 ─────────────────── */

export const Subtitle: React.FC<{
  t: number;
  text: string;
  from: number;
  to: number;
  /** 高亮词 —— 以「」包裹的片段会染色 */
  accent?: string;
}> = ({t, text, from, to, accent}) => {
  const o = fadeAt(t, from, from + 0.75, to - 0.7, to);
  if (o <= 0) return null;

  // 轻微上浮
  const rise = interpolate(t, [from, from + 0.9], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const parts = accent ? text.split(new RegExp(`(${accent})`)) : [text];

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 92,
        textAlign: 'center',
        opacity: o,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontFamily: SERIF,
          fontSize: 54,
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: '#F2EDE2',
          lineHeight: 1.4,
          textShadow:
            '0 0 26px rgba(255,240,200,0.34), 0 0 60px rgba(217,164,65,0.22), 0 3px 14px rgba(0,0,0,0.95)',
        }}
      >
        {parts.map((p, i) =>
          accent && p === accent ? (
            <span key={i} style={{color: PALETTE.gold}}>
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </div>
    </div>
  );
};

/* ─────────────────── 电影后期叠加 ─────────────────── */

/** 暗角 + 胶片颗粒 + 扫描线，压在 3D 之上、字幕之下 */
export const FilmGrade: React.FC<{t: number; intensity?: number}> = ({
  t,
  intensity = 1,
}) => {
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* 暗角 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 78% 72% at 50% 46%, transparent 32%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.93) 100%)',
          opacity: intensity,
        }}
      />
      {/* 顶部与底部压暗条 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, transparent 15%, transparent 82%, rgba(0,0,0,0.7) 100%)',
          opacity: intensity,
        }}
      />
      {/* 胶片颗粒 —— 每帧抖动 */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          opacity: 0.055 * intensity,
          backgroundImage:
            'url("data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          transform: `translate(${(t * 137) % 17}px, ${(t * 211) % 19}px)`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* 扫描线 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.014) 2px, rgba(255,255,255,0.014) 4px)',
          opacity: 0.85 * intensity,
        }}
      />
      {/* 暖色漏光 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 40% at 60% 30%, rgba(217,164,65,0.055), transparent 70%)',
          opacity: intensity,
        }}
      />
    </div>
  );
};

/* ─────────────────── 标题卡 ─────────────────── */

export const TitleCard: React.FC<{
  t: number;
  main: string;
  sub: string;
}> = ({t, main, sub}) => {
  const o = fadeAt(t, 0.2, 1.6);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: `radial-gradient(ellipse 60% 50% at 50% 48%, #14100a 0%, ${PALETTE.bg} 72%)`,
      }}
    >
      <div style={{textAlign: 'center', opacity: o}}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: PALETTE.gold,
            textShadow:
              '0 0 60px rgba(217,164,65,0.5), 0 0 140px rgba(217,164,65,0.24)',
          }}
        >
          {main}
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: SERIF,
            fontSize: 25,
            letterSpacing: '0.34em',
            color: '#9c9382',
          }}
        >
          {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
