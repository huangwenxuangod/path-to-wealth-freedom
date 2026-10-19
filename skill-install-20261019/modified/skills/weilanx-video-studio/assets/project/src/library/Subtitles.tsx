import React from 'react';
import {easeOutBack, prog} from './anim';
import {C} from './theme';
import {FPS, type CueAt} from './cues';
import {FONT_CN} from './fonts';

/** 这些词在字幕里用荧光笔高亮 */
export const KEYWORDS = ['AI Agent', 'Agent', '工具', '程序', '循环', '说明', '参数', '目标', '结果', '问你', '停下来', '范围', '学习资料', '重复', '报错', '点赞关注'];

const split = (text: string, extra: string[] = []) => {
  const words = [...KEYWORDS, ...extra];
  const parts: {s: string; hi: boolean}[] = [];
  let rest = text;
  while (rest.length) {
    let best: {idx: number; kw: string} | null = null;
    for (const kw of words) {
      const idx = rest.indexOf(kw);
      if (idx >= 0 && (!best || idx < best.idx || (idx === best.idx && kw.length > best.kw.length))) best = {idx, kw};
    }
    if (!best) {
      parts.push({s: rest, hi: false});
      break;
    }
    if (best.idx > 0) parts.push({s: rest.slice(0, best.idx), hi: false});
    parts.push({s: best.kw, hi: true});
    rest = rest.slice(best.idx + best.kw.length);
  }
  return parts;
};

const MAX_W = 940;

/** 以字号为单位的文字宽度（中文 1，ASCII 约 0.55） */
const units = (text: string) => [...text].reduce((w, ch) => w + (/[\x00-\x7f]/.test(ch) ? 0.55 : 1), 0);

/** 字号：默认 64，放不下一行就缩小 */
export const subtitleSize = (text: string) => Math.min(64, Math.floor(MAX_W / units(text)));
export const subtitleWidth = (text: string) => units(text) * subtitleSize(text);

export const Subtitles: React.FC<{f: number; y: number; cueAt: CueAt; keywords?: string[]}> = ({f, y, cueAt, keywords}) => {
  const cue = cueAt(f);
  if (!cue) return null;
  const t = f - Math.round(cue.start * FPS);
  const s = 0.85 + 0.15 * prog(t, 0, 7, easeOutBack);
  const size = subtitleSize(cue.text);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          transform: `scale(${s})`,
          background: C.white,
          border: `4px solid ${C.ink}`,
          borderRadius: 22,
          padding: '10px 30px 14px',
          boxShadow: 'var(--hard-shadow-lg, 5px 7px 0 rgba(43,35,32,0.16))',
          fontFamily: FONT_CN,
          fontSize: size,
          color: C.ink,
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
        }}
      >
        {split(cue.text, keywords).map((p, i) =>
          p.hi ? (
            <span key={i} style={{background: `linear-gradient(transparent 58%, ${C.yellow} 58%)`, padding: '0 2px'}}>
              {p.s}
            </span>
          ) : (
            <span key={i}>{p.s}</span>
          ),
        )}
      </div>
    </div>
  );
};

export const ChapterTag: React.FC<{f: number; at: number; no: number; title: string; y?: number; align?: 'center' | 'left'}> = ({f, at, no, title, y = 150, align = 'center'}) => {
  const p = prog(f, at, 12, easeOutBack);
  return (
    <div style={{position: 'absolute', left: align === 'left' ? 60 : 0, right: 0, top: y, display: 'flex', justifyContent: align === 'left' ? 'flex-start' : 'center'}}>
      <div
        style={{
          transform: `translateY(${(1 - p) * -60}px) rotate(-1.5deg)`,
          opacity: Math.min(1, p * 2),
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: C.yellow,
          border: `4px solid ${C.ink}`,
          borderRadius: 40,
          padding: '8px 34px 10px 12px',
          boxShadow: 'var(--hard-shadow, 4px 6px 0 rgba(43,35,32,0.16))',
          fontFamily: FONT_CN,
          fontSize: 46,
          color: C.ink,
        }}
      >
        <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: 29, background: C.ink, color: C.yellow, fontSize: 32}}>
          {String(no).padStart(2, '0')}
        </span>
        {title}
      </div>
    </div>
  );
};
