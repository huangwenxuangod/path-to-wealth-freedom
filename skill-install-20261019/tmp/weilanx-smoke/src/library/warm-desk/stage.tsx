import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, easeOutBack, rand} from '../anim';
import {D, DF, drift, OG, rise, typeIn, wipe} from './theme';

/**
 * 暖纸工作台风的舞台层：点阵纸（柔光晕 + 漂浮几何）、步骤条、章节大标题、粗黑体标题（橙块高亮）、字幕、窗口卡、小标签、头像气泡、星光、出场 / 退场容器。
 * 全部按 1920×1080 设计；所有动画由帧号 f 算出。
 */

/** 点阵纸：暖米色平涂 + 22px 极淡圆点 + 两团缓慢漂移的暖色柔光 + 四角轻微压暗；给 f 时光晕会漂 */
export const DeskBg: React.FC<{f?: number}> = ({f = 0}) => {
  const [ax, ay] = drift(f, 1, 60, 600);
  const [bx, by] = drift(f, 4, 70, 720);
  return (
    <AbsoluteFill style={{background: D.paper}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${D.dot} 1.4px, transparent 1.6px)`, backgroundSize: '22px 22px'}} />
      <AbsoluteFill style={{background: `radial-gradient(620px 520px at ${1420 + ax}px ${260 + ay}px, rgba(255,138,92,0.16), transparent 70%), radial-gradient(700px 560px at ${420 + bx}px ${820 + by}px, rgba(255,200,150,0.20), transparent 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(130% 120% at 50% 45%, transparent 60%, rgba(120,95,60,0.10) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 背景漂浮几何：细线圆环、十字、实心小点、虚线弧，缓慢漂移、错开呼吸；avoid 给一个矩形区域 [x, y, w, h] 不放东西（如出镜小窗） */
export const DeskDecor: React.FC<{f: number; seed?: number; n?: number; avoid?: [number, number, number, number][]}> = ({f, seed = 7, n = 14, avoid = []}) => {
  const items = Array.from({length: n * 3}, (_, i) => ({x: 60 + rand(seed + i * 3.1) * 1800, y: 40 + rand(seed + i * 5.7) * 1000, k: Math.floor(rand(seed + i * 9.3) * 4), s: 0.6 + rand(seed + i * 2.2) * 0.8, i}))
    .filter((d) => !avoid.some(([x, y, w, h]) => d.x > x - 40 && d.x < x + w + 40 && d.y > y - 40 && d.y < y + h + 40))
    .slice(0, n);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {items.map(({x, y, k, s, i}) => {
        const [dx, dy] = drift(f, seed + i, 14, 200 + i * 13);
        const o = 0.35 + 0.25 * Math.sin(f / 40 + i);
        const tr = `translate(${x + dx} ${y + dy}) rotate(${f * (i % 2 ? 0.15 : -0.12) + i * 20}) scale(${s})`;
        const c = i % 4 === 0 ? D.orange : D.faint;
        return (
          <g key={i} transform={tr} opacity={o}>
            {k === 0 ? <circle r={14} fill="none" stroke={c} strokeWidth={2.5} /> : null}
            {k === 1 ? <path d="M-12 0H12M0 -12V12" stroke={c} strokeWidth={3} strokeLinecap="round" /> : null}
            {k === 2 ? <circle r={5} fill={c} /> : null}
            {k === 3 ? <path d="M-22 6 A24 24 0 0 1 22 6" fill="none" stroke={c} strokeWidth={2.5} strokeDasharray="4 6" strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </svg>
  );
};

/** 星光迸发：at 帧起 n 道短线从中心向外射出并淡掉（重点词刷入、揭晓时用），x / y 是中心 */
export const Sparkle: React.FC<{f: number; at: number; x: number; y: number; r?: number; n?: number; color?: string; dur?: number}> = ({f, at, x, y, r = 90, n = 8, color = D.orange, dur = 16}) => {
  const t = clamp01((f - at) / dur);
  if (f < at || t >= 1) return null;
  const p = easeOut(t);
  return (
    <svg width={r * 3} height={r * 3} style={{position: 'absolute', left: x - r * 1.5, top: y - r * 1.5, overflow: 'visible', pointerEvents: 'none'}}>
      <g transform={`translate(${r * 1.5} ${r * 1.5})`} opacity={1 - easeIn(t)}>
        {Array.from({length: n}, (_, i) => {
          const a = (i / n) * Math.PI * 2 + 0.3;
          const r0 = r * (0.35 + 0.55 * p);
          const r1 = r0 + r * 0.32 * (1 - p) + 8;
          return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={i % 2 ? D.ink : color} strokeWidth={i % 2 ? 4 : 6} strokeLinecap="round" />;
        })}
        <circle r={r * 0.9 * p} fill="none" stroke={color} strokeWidth={3 * (1 - p)} />
      </g>
    </svg>
  );
};

/** 淡入上浮容器：at 帧出现（dy 上浮距离，轻回弹 + 去模糊），out 帧淡出；x / y 左上角 */
export const Rise: React.FC<{f: number; at: number; out?: number; x?: number; y?: number; dy?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({f, at, out, x, y, dy = 22, dur = 12, style, children}) => {
  if (f < at) return null;
  const r = rise(f, at, dur, dy, out);
  if (r.opacity <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, opacity: r.opacity, transform: r.transform, filter: r.filter, ...style}}>{children}</div>;
};

/** 倾斜滑走：at 帧起 10 帧内向 dir 方向（-1 左 / 1 右）滑出、旋转、变模糊、淡出；之前原样显示 */
export const Leave: React.FC<{f: number; at: number; dir?: -1 | 1; children: React.ReactNode}> = ({f, at, dir = -1, children}) => {
  const p = easeIn(clamp01((f - at) / 10));
  if (p >= 1) return null;
  return <AbsoluteFill style={{opacity: 1 - p, transform: `translateX(${dir * 260 * p}px) rotate(${dir * 5 * p}deg) scale(${1 - 0.04 * p})`, filter: p > 0 ? `blur(${p * 8}px)` : undefined, transformOrigin: '50% 80%'}}>{children}</AbsoluteFill>;
};

/** 小对勾（图形，不用字符） */
export const Tick: React.FC<{size?: number; color?: string}> = ({size = 22, color = D.orange}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'inline-block', verticalAlign: 'middle'}}>
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 步骤条：顶部一排小卡片（「01 文案」）；done 之前的打勾、active 那一步橙色渐变实心；at 帧起依次上浮出现；compact 收成一行小胶囊（胶囊之间一条细线连起来） */
export const StepBar: React.FC<{f: number; at: number; steps: string[]; active: number; compact?: boolean; y?: number}> = ({f, at, steps, active, compact = false, y = 34}) => {
  const n = steps.length;
  const w = compact ? 232 : 210;
  const gap = compact ? 34 : 22;
  const x0 = 960 - (n * w + (n - 1) * gap) / 2;
  return (
    <>
      {compact ? <div style={{position: 'absolute', left: x0 + 30, top: y + 30, width: n * w + (n - 1) * gap - 60, height: 2, background: `repeating-linear-gradient(90deg, ${D.faint} 0 8px, transparent 8px 14px)`, opacity: rise(f, at, 10).opacity}} /> : null}
      {steps.map((s, i) => {
        const r = rise(f, at + i * 3, 10, 14);
        const isActive = i === active;
        const done = i < active;
        const num = String(i + 1).padStart(2, '0');
        return compact ? (
          <div key={s} style={{position: 'absolute', left: x0 + i * (w + gap), top: y, width: w, height: 60, opacity: r.opacity, transform: r.transform, borderRadius: 30, background: isActive ? OG : D.card, boxShadow: isActive ? D.glow : '0 4px 14px rgba(70,55,35,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: DF.sans, fontSize: 27, fontWeight: 800, color: isActive ? '#fff' : done ? D.gray : D.text}}>
            <span style={{fontWeight: 900, fontSize: 24, color: isActive ? 'rgba(255,255,255,0.75)' : D.orange}}>{num}</span>
            {s}
            {done ? <Tick size={22} /> : null}
          </div>
        ) : (
          <div key={s} style={{position: 'absolute', left: x0 + i * (w + gap), top: y + 60, width: w, height: 250, opacity: r.opacity, transform: r.transform, borderRadius: 16, background: D.card, boxShadow: D.shadow, padding: '26px 24px', boxSizing: 'border-box', border: isActive ? `2px solid ${D.orange}` : `1px solid ${D.cardLine}`}}>
            <div style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 60, color: D.orange}}>{num}</div>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 44, color: D.ink, marginTop: 10}}>{s}</div>
            <div style={{height: 8, width: '80%', borderRadius: 4, background: '#eeeae3', marginTop: 22}} />
            <div style={{height: 8, width: '55%', borderRadius: 4, background: '#eeeae3', marginTop: 10}} />
          </div>
        );
      })}
    </>
  );
};

/** 解析标题里的〔词〕：橙块高亮的词 */
export const parseHi = (text: string) => text.split(/(〔[^〕]*〕)/).filter(Boolean).map((s) => (s.startsWith('〔') ? {t: s.slice(1, -1), hi: true} : {t: s, hi: false}));

/**
 * 粗黑体标题：逐字从下方升起；〔词〕先出黑字，hiAt 帧起一块圆角橙色渐变从左往右刷到字底下、字变白，同时迸一下星光。
 * 用 \n 分行；size 字号；x / y 是第一行左上角（align center 时 x 是中线）；kicker 给了就在标题上方加一行小眉标（短橙线 + 灰字）
 */
export const Headline: React.FC<{f: number; at: number; text: string; size?: number; x?: number; y?: number; align?: 'left' | 'center'; hiAt?: number; color?: string; out?: number; kicker?: string}> = ({f, at, text, size = 96, x = 960, y = 400, align = 'center', hiAt, color = D.ink, out, kicker}) => {
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 8);
  if (f < at || o <= 0) return null;
  let idx = 0;
  const lines = text.split('\n');
  const hiT = hiAt ?? at + [...text.replace(/[〔〕\n]/g, '')].length * 2 + 10;
  const k = rise(f, at - 4, 10, 10);
  return (
    <div style={{position: 'absolute', left: align === 'center' ? 0 : x, right: align === 'center' ? 0 : undefined, top: y, textAlign: align, fontFamily: DF.serif, fontWeight: 900, fontSize: size, lineHeight: 1.22, letterSpacing: size * 0.01, color, opacity: o}}>
      {kicker ? (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: 14, marginBottom: size * 0.22, opacity: k.opacity, transform: k.transform, fontFamily: DF.sans, fontWeight: 700, fontSize: Math.max(24, size * 0.26), letterSpacing: 2, color: D.gray}}>
          <span style={{width: 44 * k.p, height: 5, borderRadius: 3, background: D.orange}} />
          {kicker}
        </div>
      ) : null}
      {lines.map((line, li) => (
        <div key={li}>
          {parseHi(line).map((seg, kk) => {
            const start = idx;
            idx += [...seg.t].length;
            const p = seg.hi ? wipe(f, hiT) : 0;
            const pop = seg.hi ? easeOutBack(clamp01((f - hiT) / 12)) : 1;
            return (
              <span key={kk} style={{position: 'relative', display: 'inline-block', padding: seg.hi ? `0 ${size * 0.12}px` : 0, margin: seg.hi ? `0 ${size * 0.04}px` : 0, transform: seg.hi && f >= hiT ? `rotate(${-1.5 * pop}deg)` : undefined}}>
                {seg.hi ? (
                  <span style={{position: 'absolute', left: '50%', top: '50%'}}>
                    <Sparkle f={f} at={hiT + 4} x={0} y={0} r={size * 1.3} />
                  </span>
                ) : null}
                {seg.hi ? <span style={{position: 'absolute', left: 0, top: '6%', bottom: '2%', width: `${p * 100}%`, background: OG, borderRadius: size * 0.12, boxShadow: p > 0 ? D.glow : undefined}} /> : null}
                {[...seg.t].map((ch, i) => (
                  <span key={i} style={{position: 'relative', display: 'inline-block', whiteSpace: 'pre', color: seg.hi && p > 0.5 ? '#fff' : undefined, ...typeIn(f, at, start + i)}}>
                    {ch}
                  </span>
                ))}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * 章节大标题：背后一个超大描边编号（缓慢放大），前面一枚「PART 01」橙色胶囊 + 黑体章节名逐字升起，下面一条细线从中间向两边拉开，再一排进度点（第 n 个橙色）。
 * total 是总章节数（画进度点用）
 */
export const ChapterTitle: React.FC<{f: number; at: number; n: number; title: string; out?: number; y?: number; total?: number; cx?: number}> = ({f, at, n, title, out, y = 430, total = 3, cx = 960}) => {
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 8);
  if (f < at || o <= 0) return null;
  const num = String(n).padStart(2, '0');
  const ghost = easeOut(clamp01((f - at) / 18));
  const pill = rise(f, at, 10, 16);
  const line = easeInOut(clamp01((f - at - 10) / 16));
  return (
    <div style={{position: 'absolute', left: cx - 800, width: 1600, top: y - 230, height: 700, opacity: o}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', fontFamily: DF.sans, fontWeight: 900, fontSize: 520, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px rgba(241,90,53,${0.28 * ghost})`, transform: `scale(${0.9 + 0.1 * ghost + (f - at) * 0.0006})`, letterSpacing: -10}}>{num}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center'}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 40, background: OG, boxShadow: D.glow, color: '#fff', fontFamily: DF.sans, fontWeight: 800, fontSize: 34, letterSpacing: 4, opacity: pill.opacity, transform: pill.transform}}>
          PART <span style={{fontWeight: 900}}>{num}</span>
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontFamily: DF.serif, fontWeight: 900, fontSize: 150, lineHeight: 1.1, color: D.ink, whiteSpace: 'nowrap', letterSpacing: 4}}>
        {[...title].map((ch, i) => (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', ...typeIn(f, at + 2, i, 1)}}>
            {ch}
          </span>
        ))}
      </div>
      <div style={{position: 'absolute', left: 800 - 330 * line, top: 480, width: 660 * line, height: 3, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${D.ink} 20%, ${D.ink} 80%, transparent)`, opacity: 0.5}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 510, display: 'flex', justifyContent: 'center', gap: 14}}>
        {Array.from({length: total}, (_, i) => {
          const on = i === n - 1;
          const d = rise(f, at + 18 + i * 3, 10, 10);
          return <span key={i} style={{width: on ? 40 : 14, height: 14, borderRadius: 7, background: on ? D.orange : i < n - 1 ? D.ink : D.faint, opacity: d.opacity, transform: d.transform}} />;
        })}
      </div>
    </div>
  );
};

/** 字幕：底部居中一行粗黑体墨字（白色细描边托底，压在任何东西上都清楚），直接切换（at 出现、out 消失） */
export const DCaption: React.FC<{f: number; at: number; text: string; out?: number; y?: number; size?: number}> = ({f, at, text, out, y = 968, size = 48}) => {
  if (f < at || (out !== undefined && f >= out)) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: DF.sans, fontWeight: 800, fontSize: size, color: D.ink, letterSpacing: 2, WebkitTextStroke: '8px rgba(243,239,231,0.9)', paintOrder: 'stroke fill'}}>{text}</div>;
};

/**
 * 窗口卡：白卡 + 左上三个圆点（第一个朱橙）+ 灰色路径标题；w / h 尺寸，children 是内容（自带内边距）。
 * stack 给了就在背后多垫 1–2 张错开倾斜的纸（层次感）；accent 给了标题栏右侧画一枚小橙点 + 文字
 */
export const WindowCard: React.FC<{title?: string; w: number; h?: number; children?: React.ReactNode; pad?: number; tilt?: number; style?: React.CSSProperties; stack?: number; accent?: string}> = ({title, w, h, children, pad = 28, tilt = 0, style, stack = 0, accent}) => (
  <div style={{position: 'relative', width: w, height: h, transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style}}>
    {Array.from({length: stack}, (_, i) => (
      <div key={i} style={{position: 'absolute', inset: 0, background: i === 0 ? '#faf7f2' : '#f4efe7', borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: '0 10px 24px rgba(70,50,30,0.08)', transform: `translate(${(i + 1) * 14}px, ${(i + 1) * 12}px) rotate(${(i + 1) * 2.2}deg)`}} />
    ))}
    <div style={{position: 'relative', width: '100%', height: h, background: D.card, borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
      <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: `1px solid ${D.cardLine}`, background: 'linear-gradient(180deg, #fffdfa, #faf6f0)'}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? D.orange : '#ddd6cb'}} />
        ))}
        {title ? <span style={{marginLeft: 12, fontFamily: DF.mono, fontSize: 18, color: D.gray}}>{title}</span> : null}
        {accent ? (
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontFamily: DF.sans, fontWeight: 700, fontSize: 18, color: D.orangeDeep}}>
            <span style={{width: 8, height: 8, borderRadius: 4, background: D.orange}} />
            {accent}
          </span>
        ) : null}
      </div>
      <div style={{padding: pad}}>{children}</div>
    </div>
  </div>
);

/** 橙色小标签：橙色渐变底白字小胶囊（solid=false 时浅橙底朱字） */
export const Tag: React.FC<{text: string; solid?: boolean; size?: number}> = ({text, solid = true, size = 22}) => (
  <span style={{display: 'inline-block', padding: `${size * 0.26}px ${size * 0.62}px`, borderRadius: size * 0.4, background: solid ? OG : D.tint, boxShadow: solid ? '0 6px 16px rgba(241,90,53,0.25)' : undefined, color: solid ? '#fff' : D.orangeDeep, fontFamily: DF.sans, fontWeight: 800, fontSize: size, lineHeight: 1.2, whiteSpace: 'nowrap'}}>{text}</span>
);

/** 头像气泡：左边一个圆形头像（像素小人或字母），右边白色气泡里一句话（用户说的话 / 指令） */
export const SayBubble: React.FC<{text: string; avatar?: React.ReactNode; size?: number}> = ({text, avatar, size = 34}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 28px 14px 14px', background: D.card, borderRadius: size * 0.7, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, fontFamily: DF.serif, fontWeight: 900, fontSize: size, color: D.ink, whiteSpace: 'nowrap'}}>
    <span style={{width: size * 1.4, height: size * 1.4, borderRadius: '50%', background: OG, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: DF.sans, fontWeight: 900, fontSize: size * 0.58, color: '#fff'}}>{avatar ?? '我'}</span>
    {text}
  </div>
);

/** 一行逐字浮现的普通文字（卡片里用），per 帧一个字 */
export const TypedText: React.FC<{f: number; at: number; text: string; per?: number; style?: React.CSSProperties}> = ({f, at, text, per = 1, style}) => (
  <span style={style}>
    {[...text].map((ch, i) => (
      <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: clamp01((f - at - i * per) / 3), transform: `translateY(${(1 - easeOut(clamp01((f - at - i * per) / 3))) * 4}px)`}}>
        {ch}
      </span>
    ))}
  </span>
);
