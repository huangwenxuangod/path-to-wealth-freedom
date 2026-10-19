import React from 'react';
import {clamp01, easeInOut, easeOut, easeOutBack, rand} from '../anim';
import {Tick, WindowCard} from './stage';
import {D, DF, OG, rise} from './theme';

/**
 * 暖纸工作台风的道具：各种白色卡片（清单、选项、语速、逐字时间轴、表格、字母、代码）、跷跷板、缩略图墙、声波、大号计数、关注卡、叠放卡片。
 * 组件都收全局帧 f 和出场帧，自己算动画；尺寸按 1920×1080 画面设计。
 */

/** 清单卡：窗口卡里一行行条目（左侧编号圆点），at + i·gap 帧依次从左滑入；hi 那一行铺浅橙底 + 左侧橙条、编号变实心；right 给每行右侧放内容（色块、图标）；stack 背后垫几张纸 */
export const ListCard: React.FC<{f: number; at: number; title: string; sub?: string; rows: string[]; hi?: number; gap?: number; w?: number; right?: (i: number) => React.ReactNode; stack?: number; accent?: string}> = ({f, at, title, sub, rows, hi, gap = 6, w = 860, right, stack = 0, accent}) => (
  <WindowCard w={w} title={undefined} pad={0} stack={stack} accent={accent}>
    <div style={{padding: '30px 40px 18px'}}>
      <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 48, color: D.ink, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{width: 16, height: 40, borderRadius: 4, background: OG}} />
        {title}
      </div>
      {sub ? <div style={{fontFamily: DF.sans, fontWeight: 500, fontSize: 24, color: D.gray, marginTop: 8, marginLeft: 30}}>{sub}</div> : null}
    </div>
    {rows.map((r, i) => {
      const t = clamp01((f - at - i * gap) / 10);
      const o = easeOut(t);
      const on = hi === i;
      return (
        <div key={r} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, padding: '24px 40px', borderTop: `1px solid ${D.cardLine}`, background: on ? D.tint : 'transparent', opacity: o, transform: `translateX(${(1 - o) * -30}px)`}}>
          {on ? <span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, background: OG}} /> : null}
          <span style={{width: 44, height: 44, borderRadius: 22, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? OG : 'transparent', border: on ? 'none' : `2px solid ${D.faint}`, boxSizing: 'border-box', fontFamily: DF.sans, fontWeight: 900, fontSize: 22, color: on ? '#fff' : D.gray}}>{i + 1}</span>
          <span style={{flex: 1, fontFamily: DF.sans, fontWeight: on ? 800 : 700, fontSize: 36, color: on ? D.ink : D.text}}>{r}</span>
          {right ? right(i) : null}
        </div>
      );
    })}
  </WindowCard>
);

/** 选项卡：一个问题 + 编号选项，pickAt 帧起 pick 那一项被选中（橙色边 + 一只小光标移过去） */
export const OptionCard: React.FC<{f: number; at: number; question: string; options: string[]; pick?: number; pickAt?: number; w?: number}> = ({f, at, question, options, pick, pickAt, w = 560}) => {
  const picked = pick !== undefined && pickAt !== undefined && f >= pickAt;
  return (
    <WindowCard w={w} title="需要你确认" pad={24}>
      <div style={{fontFamily: DF.sans, fontWeight: 700, fontSize: 28, color: D.ink, marginBottom: 16}}>{question}</div>
      {options.map((o, i) => {
        const on = picked && i === pick;
        return (
          <div key={o} style={{...rise(f, at + 4 + i * 4, 6, 8), padding: '12px 16px', marginTop: 10, borderRadius: 8, border: `2px solid ${on ? D.orange : D.cardLine}`, background: on ? D.tint : D.card, fontFamily: DF.sans, fontSize: 24, color: D.text}}>
            {i + 1}. {o}
          </div>
        );
      })}
    </WindowCard>
  );
};

/** 语速卡：几张「1.0×」卡片依次出现，每张下面一排刻度（越密越快）+ 一句评语；pick 那张打勾、橙色边 */
export const SpeedCards: React.FC<{f: number; at: number; items: [string, string, number][]; pick?: number; pickAt?: number}> = ({f, at, items, pick, pickAt}) => (
  <div style={{display: 'flex', gap: 22}}>
    {items.map(([label, note, density], i) => {
      const r = rise(f, at + i * 16, 8, 14);
      const on = pick === i && pickAt !== undefined && f >= pickAt;
      return (
        <div key={label} style={{...r, position: 'relative', width: 220, padding: '20px 22px', background: D.card, borderRadius: 12, boxShadow: D.shadow, border: `2px solid ${on ? D.orange : 'transparent'}`}}>
          <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 52, color: D.ink}}>{label}</div>
          <svg width={176} height={18} style={{marginTop: 10}}>
            {Array.from({length: density}, (_, k) => (
              <rect key={k} x={(k / density) * 176} y={0} width={4} height={18} fill={D.ink} />
            ))}
          </svg>
          <div style={{fontFamily: DF.sans, fontWeight: 600, fontSize: 22, color: on ? D.orange : D.gray, marginTop: 10}}>{note}</div>
          {on ? <div style={{position: 'absolute', right: 14, top: 10, color: D.orange, fontSize: 28}}>✓</div> : null}
        </div>
      );
    })}
  </div>
);

/** 逐字时间轴：一排大字，下面各自的时间戳，上方依次打勾；hi 那个字变橙底白字，下面标一个箭头说明 */
export const CharTimeline: React.FC<{f: number; at: number; text: string; step?: number; hi?: number; hiNote?: string; per?: number}> = ({f, at, text, step = 0.16, hi, hiNote, per = 3}) => {
  const chars = [...text];
  return (
    <div style={{position: 'relative', display: 'inline-flex', gap: 18, paddingBottom: 60, borderBottom: `2px solid ${D.faint}`}}>
      {chars.map((ch, i) => {
        const on = f >= at + i * per;
        const isHi = hi === i && f >= at + chars.length * per + 10;
        return (
          <div key={i} style={{textAlign: 'center', width: 76}}>
            <div style={{height: 30, color: D.orange, fontSize: 26, opacity: on ? 1 : 0}}>✓</div>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 64, color: isHi ? '#fff' : D.ink, background: isHi ? D.orange : 'transparent', borderRadius: 6}}>{ch}</div>
            <div style={{fontFamily: DF.mono, fontSize: 16, color: D.gray, marginTop: 8}}>{(i * step).toFixed(2)}s</div>
          </div>
        );
      })}
      {hi !== undefined && hiNote && f >= at + chars.length * per + 14 ? (
        <div style={{position: 'absolute', left: hi * 94 + 38, top: 222, transform: 'translateX(-50%)', fontFamily: DF.sans, fontWeight: 600, fontSize: 22, color: D.orange, whiteSpace: 'nowrap'}}>↑ {hiNote}</div>
      ) : null}
    </div>
  );
};

/** 表格卡：表头 + 行，行依次出现；hiCol 那一列表头变橙底，hiColAt 起该列每格出现一个橙色小标签 */
export const TableCard: React.FC<{f: number; at: number; head: string[]; rows: string[][]; hiCol?: number; hiColAt?: number; widths?: number[]; tag?: (r: number) => string}> = ({f, at, head, rows, hiCol, hiColAt, widths, tag}) => {
  const ws = widths ?? head.map(() => 220);
  const colOn = hiCol !== undefined && hiColAt !== undefined && f >= hiColAt;
  return (
    <WindowCard w={ws.reduce((a, b) => a + b, 0) + 60} pad={0}>
      <div style={{display: 'flex', padding: '0 30px', borderBottom: `1px solid ${D.cardLine}`}}>
        {head.map((h, i) => (
          <div key={h} style={{width: ws[i], padding: '14px 0', fontFamily: DF.sans, fontWeight: 700, fontSize: 22, color: colOn && i === hiCol ? '#fff' : D.text, background: colOn && i === hiCol ? D.orange : 'transparent', textAlign: i === 0 ? 'left' : 'center'}}>
            {h}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', padding: '0 30px', borderBottom: ri < rows.length - 1 ? `1px solid ${D.cardLine}` : 'none', opacity: clamp01((f - at - ri * 6) / 6)}}>
          {r.map((c, ci) => (
            <div key={ci} style={{width: ws[ci], padding: '18px 0', fontFamily: DF.sans, fontSize: 22, color: D.text, textAlign: ci === 0 ? 'left' : 'center'}}>
              {colOn && ci === hiCol && tag ? <span style={{padding: '2px 10px', borderRadius: 6, border: `2px solid ${D.orange}`, color: D.orange, fontWeight: 700}}>{tag(ri)}</span> : c}
            </div>
          ))}
        </div>
      ))}
    </WindowCard>
  );
};

/** 字母卡：一排大号粗黑体字母，第 i 个在 at + i·gap 帧变橙，同时下面上浮出一张小卡（词 + 一句说明），done 之后打勾 */
export const LetterCards: React.FC<{f: number; at: number; items: [string, string, string][]; gap?: number; doneAt?: number}> = ({f, at, items, gap = 40, doneAt}) => (
  <div style={{display: 'flex', gap: 46}}>
    {items.map(([letter, word, note], i) => {
      const on = f >= at + i * gap;
      const r = rise(f, at + i * gap + 4, 8, 14);
      return (
        <div key={i} style={{width: 290}}>
          <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 200, lineHeight: 1, color: on ? D.orange : D.ink, paddingLeft: 30}}>{letter}</div>
          <div style={{...r, position: 'relative', marginTop: 30, padding: '26px 28px', background: D.card, borderRadius: 12, boxShadow: D.shadow}}>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 56, color: D.ink}}>{word}</div>
            <div style={{fontFamily: DF.sans, fontWeight: 600, fontSize: 24, color: D.gray, marginTop: 8}}>{note}</div>
            {doneAt !== undefined && f >= doneAt ? <div style={{position: 'absolute', right: 12, top: 10, color: D.orange, fontSize: 26}}>✓</div> : null}
          </div>
        </div>
      );
    })}
  </div>
);

/** 代码卡：窗口卡里带行号的代码，第 i 行 at + i·per 帧逐字敲出；关键字（第一个点号或空格前）上橙色；dark 时是深色终端（$ 提示符 + 闪烁光标，敲完一行亮一个绿色对勾） */
export const CodeCard: React.FC<{f: number; at: number; title: string; lines: string[]; per?: number; w?: number; dark?: boolean}> = ({f, at, title, lines, per = 5, w = 720, dark = false}) => {
  const cps = 1.2;
  const body = (
    <>
      {lines.map((l, i) => {
        const t0 = at + i * per;
        const shown = Math.max(0, Math.floor((f - t0) * cps));
        if (f < t0) return null;
        const vis = l.slice(0, shown);
        const cut = vis.search(/[. ]/);
        const head = cut < 0 ? vis : vis.slice(0, cut);
        const tail = cut < 0 ? '' : vis.slice(cut);
        const done = shown >= l.length;
        const typing = !done && f >= t0;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: DF.mono, fontSize: 24, lineHeight: 2, whiteSpace: 'pre'}}>
            <span style={{color: dark ? '#6f665c' : D.faint, width: 24, textAlign: 'right'}}>{dark ? '$' : i + 1}</span>
            <span style={{color: dark ? '#efe8de' : D.text}}>
              <span style={{color: dark ? D.orangeSoft : D.orangeDeep}}>{head}</span>
              {tail}
              {typing && Math.floor(f / 8) % 2 === 0 ? <span style={{display: 'inline-block', width: 12, height: 26, marginLeft: 2, verticalAlign: 'middle', background: dark ? D.orangeSoft : D.orange}} /> : null}
            </span>
            {done && dark ? <span style={{marginLeft: 'auto', opacity: clamp01((f - t0 - l.length / cps) / 6)}}><Check /></span> : null}
          </div>
        );
      })}
    </>
  );
  return dark ? (
    <div style={{width: w, borderRadius: 18, background: '#1f1b17', boxShadow: '0 30px 60px rgba(40,25,10,0.28), 0 3px 8px rgba(40,25,10,0.12)', overflow: 'hidden'}}>
      <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', background: '#2a2520'}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? D.orange : '#4a433b'}} />
        ))}
        <span style={{marginLeft: 12, fontFamily: DF.mono, fontSize: 18, color: '#8d8478'}}>{title}</span>
      </div>
      <div style={{padding: '22px 30px 26px'}}>{body}</div>
    </div>
  ) : (
    <WindowCard w={w} title={title} pad={22}>
      {body}
    </WindowCard>
  );
};

/** 绿色圆底对勾 */
const Check: React.FC<{size?: number}> = ({size = 26}) => (
  <svg width={size} height={size} viewBox="0 0 26 26">
    <circle cx={13} cy={13} r={13} fill={D.green} />
    <path d="M7 13.5l4 4 8-8.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 跷跷板：中间橙色三角支点，横梁按 tilt（−1 左沉 ~ 1 右沉）倾斜；left / right 是两端放的东西（头像、标签堆） */
export const Seesaw: React.FC<{tilt: number; left?: React.ReactNode; right?: React.ReactNode; w?: number}> = ({tilt, left, right, w = 900}) => {
  const a = tilt * 7;
  return (
    <div style={{position: 'relative', width: w, height: 300}}>
      <div style={{position: 'absolute', left: 0, top: 150, width: w, height: 10, borderRadius: 5, background: D.ink, transform: `rotate(${a}deg)`, transformOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', left: 10, bottom: 14}}>{left}</div>
        <div style={{position: 'absolute', right: 10, bottom: 14}}>{right}</div>
      </div>
      <svg width={140} height={120} style={{position: 'absolute', left: w / 2 - 70, top: 160}}>
        <polygon points="70,0 140,120 0,120" fill={D.orange} />
      </svg>
    </div>
  );
};

/** 缩略图墙：cols × rows 个小白卡依次出现（模拟一排截图），hi 那一格加橙色边并放大一点 */
export const ThumbGrid: React.FC<{f: number; at: number; cols?: number; rows?: number; hi?: number; w?: number; seed?: number}> = ({f, at, cols = 3, rows = 3, hi, w = 820, seed = 3}) => {
  const cw = (w - (cols - 1) * 14) / cols;
  const ch = cw * 0.56;
  return (
    <WindowCard w={w + 40} title="snapshots / 抽帧" pad={20}>
      <div style={{position: 'relative', height: rows * ch + (rows - 1) * 14}}>
        {Array.from({length: cols * rows}, (_, i) => {
          const x = (i % cols) * (cw + 14);
          const y = Math.floor(i / cols) * (ch + 14);
          const o = clamp01((f - at - i * 2) / 5);
          const isHi = hi === i && f >= at + cols * rows * 2 + 10;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: cw, height: ch, opacity: o, background: '#f6f3ee', border: `${isHi ? 3 : 1}px solid ${isHi ? D.orange : D.cardLine}`, borderRadius: 6, transform: isHi ? 'scale(1.06)' : undefined, zIndex: isHi ? 2 : 1}}>
              <div style={{position: 'absolute', left: '12%', top: '22%', width: `${30 + rand(seed + i) * 40}%`, height: 8, borderRadius: 4, background: D.faint}} />
              <div style={{position: 'absolute', left: '12%', top: '40%', width: `${20 + rand(seed + i + 9) * 30}%`, height: 8, borderRadius: 4, background: '#e2ddd4'}} />
              <div style={{position: 'absolute', right: '10%', bottom: '14%', width: 22, height: 22, background: D.orange, opacity: 0.8}} />
            </div>
          );
        })}
      </div>
    </WindowCard>
  );
};

/** 声波：一排橙色竖条，高度随帧起伏（active 时动，否则静止） */
export const Waveform: React.FC<{f: number; bars?: number; h?: number; active?: boolean; color?: string; seed?: number}> = ({f, bars = 16, h = 80, active = true, color = D.orange, seed = 1}) => (
  <svg width={bars * 10} height={h}>
    {Array.from({length: bars}, (_, i) => {
      const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + seed));
      const v = active ? base * (0.55 + 0.45 * Math.abs(Math.sin(f / 4 + i * 0.9))) : base * 0.6;
      return <rect key={i} x={i * 10} y={(h - v * h) / 2} width={5} height={v * h} rx={2} fill={color} />;
    })}
  </svg>
);

/** 大号计数：橙色粗黑体大数字 + 一个小字单位，数字在 at 起 dur 帧内从 0 数到 value */
export const BigCount: React.FC<{f: number; at: number; value: number; unit: string; dur?: number; size?: number}> = ({f, at, value, unit, dur = 18, size = 140}) => (
  <span style={{fontFamily: DF.serif, fontWeight: 900, color: D.orange, fontSize: size, lineHeight: 1, letterSpacing: -2}}>
    {Math.round(value * easeOut(clamp01((f - at) / dur)))}
    <span style={{fontSize: size * 0.32, color: D.ink, marginLeft: 8}}>{unit}</span>
  </span>
);

/** 关注卡：头像 + 「我是 XX，带你……」+ 已关注胶囊，下面三个图标（点赞 / 关注 / 收藏），at 帧上浮出现 */
export const FollowCard: React.FC<{f: number; at: number; name: string; line: string; avatar?: React.ReactNode}> = ({f, at, name, line, avatar}) => {
  const r = rise(f, at, 10, 18);
  const followed = f >= at + 24;
  return (
    <div style={{...r, textAlign: 'center'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 24, padding: '20px 28px', background: D.card, borderRadius: 18, boxShadow: D.shadow}}>
        <span style={{width: 96, height: 96, borderRadius: 14, background: D.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{avatar}</span>
        <span style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 46, color: D.ink, whiteSpace: 'nowrap'}}>
          我是<span style={{color: D.orange}}>{name}</span>，{line}
        </span>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 24, background: followed ? '#f1ece4' : OG, color: followed ? D.gray : '#fff', fontFamily: DF.sans, fontWeight: 800, fontSize: 28, whiteSpace: 'nowrap'}}>{followed ? <><Tick size={22} color={D.gray} />已关注</> : '+ 关注'}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 90, marginTop: 30, fontFamily: DF.sans, fontWeight: 600, fontSize: 24, color: D.gray}}>
        {(['heart', 'plus', 'star'] as const).map((ic, i) => {
          const t = clamp01((f - at - 10 - i * 5) / 12);
          const lit = f >= at + 34 + i * 8;
          return (
            <div key={ic} style={{opacity: easeOut(t), transform: `scale(${(lit ? 1 + 0.18 * Math.max(0, 1 - (f - at - 34 - i * 8) / 8) : 1) * (0.6 + 0.4 * easeOutBack(t))})`}}>
              <div style={{width: 84, height: 84, margin: '0 auto 8px', borderRadius: 42, background: lit ? OG : D.card, boxShadow: lit ? D.glow : '0 6px 16px rgba(70,50,30,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon kind={ic} color={lit ? '#fff' : D.orange} />
              </div>
              {['点赞', '关注', '收藏'][i]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** 小图标：心 / 加号 / 星（图形，不用字符） */
export const Icon: React.FC<{kind: 'heart' | 'plus' | 'star' | 'play'; size?: number; color?: string}> = ({kind, size = 40, color = D.orange}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    {kind === 'heart' ? <path d="M20 34 C8 25 3 19 3 12.5 C3 7.5 7 4 11.5 4 C15 4 18 6 20 9 C22 6 25 4 28.5 4 C33 4 37 7.5 37 12.5 C37 19 32 25 20 34Z" fill={color} /> : null}
    {kind === 'plus' ? <path d="M20 6V34M6 20H34" stroke={color} strokeWidth={6} strokeLinecap="round" /> : null}
    {kind === 'star' ? <path d="M20 3l5.2 10.6 11.6 1.7-8.4 8.2 2 11.6L20 29.6 9.6 35.1l2-11.6-8.4-8.2 11.6-1.7z" fill={color} strokeLinejoin="round" /> : null}
    {kind === 'play' ? <path d="M13 8 L33 20 L13 32Z" fill={color} strokeLinejoin="round" /> : null}
  </svg>
);

/** 叠放卡片：几张窗口卡像扇子一样从中心展开（3D 倾斜错开），spread 0–1 是展开程度；每张一个标签 */
export const CardFan: React.FC<{spread: number; labels: string[]; w?: number; h?: number}> = ({spread, labels, w = 760, h = 430}) => {
  const p = easeInOut(clamp01(spread));
  return (
    <div style={{position: 'relative', width: w, height: h, perspective: 1600}}>
      {labels.map((l, i) => {
        const k = labels.length - 1 - i;
        return (
          <div key={l} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${-k * 70 * p}px, ${-k * 44 * p}px) rotateX(${18 * p}deg) rotateZ(${-4 * p}deg)`, transformOrigin: '50% 100%', opacity: 1 - k * 0.12 * p}}>
            <WindowCard w={w} h={h} pad={0}>
              <div style={{position: 'absolute', left: 20, top: 52, padding: '4px 12px', background: D.orange, color: '#fff', borderRadius: 6, fontFamily: DF.sans, fontWeight: 600, fontSize: 20}}>{l}</div>
            </WindowCard>
          </div>
        );
      })}
    </div>
  );
};
