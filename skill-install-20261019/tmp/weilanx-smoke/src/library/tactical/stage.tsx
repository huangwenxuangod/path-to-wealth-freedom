import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeOut, rand} from '../anim';
import {fade, glow, glowF, T, TF, typeChar} from './theme';

/**
 * 战术屏科普风的舞台层：背景、HUD 框、标题卡、字幕、大字卡、划掉重写、死亡红屏、答案揭晓、慢放标、疑问胶囊、分屏框。
 * 全部按 1920×1080 设计；所有动画由帧号 f 算出。
 */

const W = 1920;
const H = 1080;

/** 背景：深蓝黑径向渐变 + 60px 淡网格 + 暗角；tone 'red' 用于失误 / 死亡段，'warm' 用于「以前」 */
export const TacBg: React.FC<{tone?: 'blue' | 'red' | 'warm'; grid?: boolean}> = ({tone = 'blue', grid = true}) => {
  const c = tone === 'red' ? ['#2a0d12', '#0e0507'] : tone === 'warm' ? ['#24180e', '#0b0805'] : [T.bg2, T.bg];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 45%, ${c[0]} 0%, ${c[1]} 100%)`}}>
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
          }}
        />
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 字幕 / 大字里的重点词：【词】青、〖词〗红、〔词〕橙；返回 [文字, 颜色 | null] 片段 */
export const parseMarks = (text: string): [string, string | null][] =>
  text.split(/(【[^】]*】|〖[^〗]*〗|〔[^〕]*〕)/).filter(Boolean).map((seg) => {
    if (seg.startsWith('【')) return [seg.slice(1, -1), T.cyan];
    if (seg.startsWith('〖')) return [seg.slice(1, -1), T.red];
    if (seg.startsWith('〔')) return [seg.slice(1, -1), T.orange];
    return [seg, null];
  });

/** 逐字浮现的一行字：重点词变色，词出完后下方长出同色发光短横 */
const TypedLine: React.FC<{f: number; at: number; text: string; size: number; per: number; color?: string; underline?: boolean}> = ({f, at, text, size, per, color = T.white, underline = true}) => {
  let idx = 0;
  return (
    <>
      {parseMarks(text).map(([seg, c], k) => {
        const start = idx;
        idx += [...seg].length;
        const done = clamp01((f - at - idx * per - 4) / 10);
        return (
          <span key={k} style={{position: 'relative', display: 'inline-block', color: c ?? color}}>
            {[...seg].map((ch, i) => (
              <span key={i} style={{display: 'inline-block', ...typeChar(f, at, start + i, per)}}>
                {ch}
              </span>
            ))}
            {c && underline ? <span style={{position: 'absolute', left: 0, bottom: -size * 0.16, height: Math.max(4, size * 0.09), width: `${done * 100}%`, borderRadius: 3, background: c, boxShadow: `0 0 12px ${c}`}} /> : null}
          </span>
        );
      })}
    </>
  );
};

/**
 * HUD 框：四角 L 形角标；左上「◆ 系列名 EP.xx / 关键词」；右上「03 / 07 章节名」；
 * 底部进度条（progress 0–1，ticks 是章节分界 0–1）；hp / ammo 给了就在左下 / 右下显示。
 */
export const HudFrame: React.FC<{
  series: string;
  ep: string;
  topic: string;
  chapter: [number, number, string];
  progress: number;
  ticks?: number[];
  hp?: number;
  ammo?: [number, number];
}> = ({series, ep, topic, chapter, progress, ticks = [], hp, ammo}) => {
  const L = 34;
  const M = 36;
  const corner = (x: number, y: number, sx: number, sy: number) => <path d={`M${x} ${y + sy * L} L${x} ${y} L${x + sx * L} ${y}`} fill="none" stroke="rgba(200,215,225,0.45)" strokeWidth={2} />;
  const barX0 = 84;
  const barX1 = W - 84;
  const barY = 1032;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {corner(M, M, 1, 1)}
        {corner(W - M, M, -1, 1)}
        {corner(M, H - M, 1, -1)}
        {corner(W - M, H - M, -1, -1)}
        <line x1={barX0} x2={barX1} y1={barY} y2={barY} stroke="rgba(200,215,225,0.12)" strokeWidth={2} />
        <line x1={barX0} x2={barX0 + (barX1 - barX0) * clamp01(progress)} y1={barY} y2={barY} stroke={T.cyan} strokeWidth={2.5} style={{filter: glowF(T.cyan, 4)}} />
        {[0, ...ticks].map((t) => (
          <line key={t} x1={barX0 + (barX1 - barX0) * t} x2={barX0 + (barX1 - barX0) * t} y1={barY - 5} y2={barY + 5} stroke={t <= progress ? T.cyan : 'rgba(200,215,225,0.25)'} strokeWidth={2} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 82, top: 54, display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap'}}>
        <span style={{display: 'inline-block', width: 13, height: 13, background: T.cyan, transform: 'rotate(45deg) translateY(-2px)', boxShadow: `0 0 10px ${T.cyan}`}} />
        <span style={{fontFamily: TF.sans, fontSize: 26, color: T.white, letterSpacing: 2}}>{series}</span>
        <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 21, color: T.gray, letterSpacing: 2}}>{ep}</span>
        <span style={{fontFamily: TF.mono, fontSize: 21, color: T.gray}}>/</span>
        <span style={{fontFamily: TF.sans, fontSize: 21, color: T.gray}}>{topic}</span>
      </div>
      <div style={{position: 'absolute', right: 86, top: 54, display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 21, color: T.gray, letterSpacing: 3}}>
          {String(chapter[0]).padStart(2, '0')} / {String(chapter[1]).padStart(2, '0')}
        </span>
        <span style={{fontFamily: TF.sans, fontSize: 26, color: T.white}}>{chapter[2]}</span>
      </div>
      {hp !== undefined && (
        <div style={{position: 'absolute', left: 128, top: 918, fontFamily: TF.mono, fontWeight: 700, color: hp > 0 ? 'rgba(200,215,225,0.55)' : T.red}}>
          <span style={{fontSize: 22, marginRight: 10}}>HP</span>
          <span style={{fontSize: 42}}>{hp}</span>
        </div>
      )}
      {ammo && (
        <div style={{position: 'absolute', right: 128, top: 918, fontFamily: TF.mono, fontWeight: 700, color: 'rgba(200,215,225,0.55)'}}>
          <span style={{fontSize: 42}}>{ammo[0]}</span>
          <span style={{fontSize: 24, marginLeft: 12}}>/ {ammo[1]}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * 开场常驻标题条（ep43 起）：画面顶部（HUD 下方）一条半透明深色横条 + 大号问句，第 0 帧就完整显示、不逐字浮现，
 * 一直留到 out 帧（通常是第一个爆点前的 DARK_FROM）8 帧内淡出。数据显示多数观众 17 秒标题卡之前就划走了，
 * 所以前 17 秒必须一直告诉他「这期讲什么」。text 支持【】〖〗〔〕变色；放在冲击层外面（不跟着顶）
 */
export const HookBanner: React.FC<{f: number; text: string; out: number; y?: number; size?: number}> = ({f, text, out, y = 104, size = 62}) => {
  const o = 1 - clamp01((f - out) / 8);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o, pointerEvents: 'none'}}>
      <div style={{position: 'relative', padding: '10px 44px 14px', background: 'rgba(5,11,20,0.72)', borderTop: `2px solid ${T.cyan}`, borderBottom: '2px solid rgba(66,198,223,0.35)', fontFamily: TF.sans, fontSize: size, lineHeight: 1.2, color: T.white, whiteSpace: 'nowrap', textShadow: '0 3px 0 rgba(0,0,0,0.6)'}}>
        {parseMarks(text).map(([seg, c], k) => (
          <span key={k} style={{color: c ?? T.white, filter: c ? glowF(c, 8) : undefined}}>
            {seg}
          </span>
        ))}
      </div>
    </div>
  );
};

/** 标题卡：上方青色等宽小标、白色发光大标题（逐字浮现，per 帧一个字）、下方胶囊关键词两侧拉线；curve 在背后垫一条淡钟形曲线 */
export const TitleCard: React.FC<{f: number; at: number; label: string; title: string; tag: string; curve?: boolean; per?: number}> = ({f, at, label, title, tag, curve = true, per = 2}) => {
  const n = [...title].length;
  const tagIn = easeOut(clamp01((f - at - n * per - 6) / 12));
  return (
    <AbsoluteFill>
      {curve && (
        <svg width={W} height={H} style={{position: 'absolute', opacity: 0.35 * fade(f, at, 20)}}>
          <path d={Array.from({length: 81}, (_, i) => {
            const x = 320 + (i / 80) * 1280;
            const z = (i / 80 - 0.5) * 6;
            return `${i ? 'L' : 'M'}${x.toFixed(1)} ${(757 - 400 * Math.exp((-z * z) / 2)).toFixed(1)}`;
          }).join(' ')} fill="none" stroke="rgba(200,215,225,0.55)" strokeWidth={3} />
          <line x1={240} x2={1680} y1={760} y2={760} stroke="rgba(200,215,225,0.12)" />
        </svg>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: T.cyan, opacity: fade(f, at, 12)}}>{label}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: TF.sans, fontSize: 148, lineHeight: 1.1, color: T.white, ...glow(T.cyan, 26, 0.55)}}>
        <TypedLine f={f} at={at + (per < 2 ? 0 : 4)} text={title} size={148} per={per} underline={false} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: tagIn}}>
        <div style={{width: 115 * tagIn, height: 3, background: T.cyan, boxShadow: `0 0 8px ${T.cyan}`}} />
        <div style={{padding: '8px 32px', borderRadius: 40, background: T.cyan, boxShadow: `0 0 26px ${T.cyan}`, fontFamily: TF.sans, fontSize: 40, letterSpacing: 10, color: '#06121a'}}>{tag}</div>
        <div style={{width: 115 * tagIn, height: 3, background: T.cyan, boxShadow: `0 0 8px ${T.cyan}`}} />
      </div>
    </AbsoluteFill>
  );
};

/** 字幕：白色粗黑体逐字浮现，【】青 〖〗红 〔〕橙 + 发光下划线；out 帧淡出 */
export const TCaption: React.FC<{f: number; at: number; text: string; out?: number; y?: number; size?: number; per?: number}> = ({f, at, text, out, y = 872, size = 64, per = 2}) => {
  if (f < at - 1) return null;
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 8);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: TF.sans, fontSize: size, color: T.white, letterSpacing: 2, opacity: o, textShadow: '0 3px 14px rgba(0,0,0,0.85)', whiteSpace: 'nowrap'}}>
      <TypedLine f={f} at={at} text={text} size={size} per={per} />
    </div>
  );
};

/** 大字卡：屏幕中央一行（或两行，用 \n 分）大字，同样逐字浮现 + 重点词变色 */
export const BigWord: React.FC<{f: number; at: number; text: string; size?: number; y?: number; out?: number; glowColor?: string}> = ({f, at, text, size = 104, y = 470, out, glowColor}) => {
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 8);
  const lines = text.split('\n');
  let offset = 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - (lines.length * size * 1.25) / 2, textAlign: 'center', fontFamily: TF.sans, fontSize: size, lineHeight: 1.25, color: T.white, opacity: o, ...(glowColor ? glow(glowColor, 24, 0.6) : {})}}>
      {lines.map((l, i) => {
        const start = offset;
        offset += [...l.replace(/[【】〖〗〔〕]/g, '')].length;
        return (
          <div key={i}>
            <TypedLine f={f} at={at + start * 2} text={l} size={size} per={2} />
          </div>
        );
      })}
    </div>
  );
};

/** 划掉重写：先出 text，strikeAt 起一道红线从左划到右、字变暗，再在后面接上 then（逐字浮现） */
export const Strike: React.FC<{f: number; at: number; text: string; strikeAt: number; then?: string; size?: number; y?: number}> = ({f, at, text, strikeAt, then, size = 96, y = 470}) => {
  const p = easeOut(clamp01((f - strikeAt) / 10));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.6, textAlign: 'center', fontFamily: TF.sans, fontSize: size, color: T.white, whiteSpace: 'nowrap'}}>
      <span style={{position: 'relative', display: 'inline-block', color: p > 0 ? `rgba(238,243,246,${1 - 0.55 * p})` : T.white}}>
        <TypedLine f={f} at={at} text={text} size={size} per={2} underline={false} />
        <span style={{position: 'absolute', left: 0, top: '52%', height: size * 0.07, width: `${p * 100}%`, background: T.red, boxShadow: `0 0 10px ${T.red}`, borderRadius: 3}} />
      </span>
      {then ? (
        <span style={{display: 'inline-block', marginLeft: size * 0.15}}>
          <TypedLine f={f} at={strikeAt + 14} text={then} size={size} per={2} />
        </span>
      ) : null}
    </div>
  );
};

/** 死亡红屏：命中火花一闪 → 整屏染红 + 从 (cx, cy) 放射的玻璃裂纹，label 是中央红字（可省略） */
export const DeathScreen: React.FC<{f: number; at: number; cx?: number; cy?: number; label?: string; seed?: number}> = ({f, at, cx = 960, cy = 470, label, seed = 4}) => {
  const t = f - at;
  if (t < 0) return null;
  const spark = 1 - clamp01(t / 6);
  const red = easeOut(clamp01(t / 5));
  const crack = easeOut(clamp01((t - 2) / 8));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 75% at ${(cx / W) * 100}% ${(cy / H) * 100}%, rgba(230,60,75,${0.35 * red}) 0%, rgba(150,20,35,${0.62 * red}) 70%, rgba(80,8,16,${0.8 * red}) 100%)`, mixBlendMode: 'normal'}} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 9}, (_, i) => {
          const a = (i / 9) * Math.PI * 2 + rand(seed + i) * 0.5;
          const len = (600 + rand(seed + i + 20) * 700) * crack;
          const mid = len * (0.35 + rand(seed + i + 40) * 0.3);
          const bend = (rand(seed + i + 60) - 0.5) * 0.25;
          const p1 = {x: cx + Math.cos(a + bend) * mid, y: cy + Math.sin(a + bend) * mid};
          const p2 = {x: cx + Math.cos(a) * len, y: cy + Math.sin(a) * len};
          const br = {x: p1.x + Math.cos(a + 0.6) * len * 0.25, y: p1.y + Math.sin(a + 0.6) * len * 0.25};
          return (
            <g key={i} stroke="rgba(255,235,235,0.75)" strokeWidth={1.6} fill="none">
              <path d={`M${cx} ${cy} L${p1.x} ${p1.y} L${p2.x} ${p2.y}`} />
              <path d={`M${p1.x} ${p1.y} L${br.x} ${br.y}`} opacity={0.6} />
            </g>
          );
        })}
        {spark > 0 && (
          <g opacity={spark}>
            <circle cx={cx} cy={cy} r={26} fill="#fff" style={{filter: glowF('#fff', 14)}} />
            {Array.from({length: 8}, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * 70} y2={cy + Math.sin(a) * 70} stroke="#fff" strokeWidth={3} />;
            })}
          </g>
        )}
      </svg>
      {label ? <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: TF.sans, fontSize: 76, color: T.red, letterSpacing: 8, opacity: clamp01((t - 6) / 8), ...glow(T.red, 20, 0.7)}}>{label}</div> : null}
    </AbsoluteFill>
  );
};

/** 揭晓答案：黑场（dark 帧）→ 白闪 → 橙色发光大字 + 两圈同心圆环；label 是大字上方的小字 */
export const AnswerReveal: React.FC<{f: number; at: number; text: string; label?: string; dark?: number; color?: string}> = ({f, at, text, label = '答案', dark = 8, color = T.orange}) => {
  const t = f - at;
  if (t < 0) return null;
  const flash = t < dark ? 0 : 1 - clamp01((t - dark) / 14);
  const show = easeOut(clamp01((t - dark) / 10));
  const ring = easeOut(clamp01((t - dark) / 30));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#020407', opacity: t < dark ? 1 : 0.85}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(220,225,230,0.9), rgba(120,125,130,0.5) 40%, rgba(0,0,0,0) 75%)', opacity: flash}} />
      {show > 0 && (
        <>
          <svg width={W} height={H} style={{position: 'absolute', opacity: show}}>
            <circle cx={960} cy={470} r={230 + 40 * ring} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
            <circle cx={960} cy={470} r={300 + 80 * ring} fill="none" stroke={color} strokeWidth={1} opacity={0.25} />
            <line x1={960 - 360} x2={960 - 260} y1={470} y2={470} stroke={color} opacity={0.5} />
            <line x1={960 + 260} x2={960 + 360} y1={470} y2={470} stroke={color} opacity={0.5} />
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: TF.sans, fontSize: 34, letterSpacing: 12, color, opacity: show}}>{label}</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 385, textAlign: 'center', fontFamily: TF.sans, fontSize: 140, letterSpacing: 10, color, opacity: show, transform: `scale(${1.08 - 0.08 * show})`, ...glow(color, 30, 0.9)}}>{text}</div>
        </>
      )}
    </AbsoluteFill>
  );
};

/** 慢放标：左上一颗闪烁的红点 + 「SLOW-MO ×0.25」 */
export const SlowMo: React.FC<{f: number; rate?: string; x?: number; y?: number}> = ({f, rate = '×0.25', x = 110, y = 168}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 14, fontFamily: TF.mono, fontWeight: 700, fontSize: 28, color: T.white}}>
    <span style={{width: 14, height: 14, borderRadius: 7, background: T.red, opacity: Math.floor(f / 15) % 2 ? 0.35 : 1}} />
    SLOW-MO {rate}
  </div>
);

/** 疑问胶囊：描边圆角胶囊里一句话（脑内独白、标注），at 帧淡入并轻微上浮 */
export const Bubble: React.FC<{f: number; at: number; text: string; x: number; y: number; color?: string; out?: number; size?: number}> = ({f, at, text, x, y, color = T.cyan, out, size = 36}) => {
  const o = fade(f, at, 8, out);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - clamp01((f - at) / 8)) * 10, opacity: o, padding: `${size * 0.2}px ${size * 0.6}px`, border: `2px solid ${color}`, borderRadius: size, background: 'rgba(5,11,20,0.55)', fontFamily: TF.sans, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: `0 0 16px ${color}55`}}>
      {text}
    </div>
  );
};

/** 分屏框：彩色细边框 + 左上角色块标题 + 小字说明，children 放画面（自己裁剪） */
export const SplitPanel: React.FC<{x: number; y: number; w: number; h: number; color: string; title: string; sub?: string; children?: React.ReactNode; active?: number}> = ({x, y, w, h, color, title, sub, children, active = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', border: `2px solid ${color}`, boxShadow: `0 0 ${18 * active}px ${color}66`, background: T.bg}}>
    {children}
    <div style={{position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 12}}>
      <span style={{padding: '4px 12px', background: color, fontFamily: TF.sans, fontSize: 22, color: '#06121a'}}>{title}</span>
      {sub ? <span style={{fontFamily: TF.sans, fontSize: 18, color: T.gray}}>{sub}</span> : null}
    </div>
  </div>
);

/** 章节卡：背后一个描边的大号章节号（「02」），前面白色大标题逐字浮现，标题下一条青线长出；sub 是一行灰色小字 */
export const ChapterCard: React.FC<{f: number; at: number; n: number; title: string; sub?: string}> = ({f, at, n, title, sub}) => {
  const t = f - at;
  if (t < 0) return null;
  const num = easeOut(clamp01(t / 10));
  const line = easeOut(clamp01((t - 8) / 14));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300 - (1 - num) * 30, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 300, lineHeight: 1, color: 'transparent', WebkitTextStroke: `2px rgba(66,198,223,${0.28 * num})`, letterSpacing: 10}}>
        {String(n).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontFamily: TF.sans, fontSize: 104, color: T.white, ...glow(T.cyan, 22, 0.45)}}>
        <TypedLine f={f} at={at + 2} text={title} size={104} per={2} underline={false} />
      </div>
      <div style={{position: 'absolute', left: 960 - 160 * line, top: 560, width: 320 * line, height: 3, background: T.cyan, boxShadow: `0 0 10px ${T.cyan}`}} />
      {sub ? <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: T.gray, opacity: line}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/** 出处卡：上方青色等宽「机构 · 文献 · 年份」，中间一句原话（英文斜体或中文大字），下方文章名 / 实验条件 */
export const SourceCard: React.FC<{f: number; at: number; label: string; quote: string; cite?: string; note?: string; serif?: boolean; size?: number}> = ({f, at, label, quote, cite, note, serif = true, size = 50}) => (
  <div style={{position: 'absolute', left: 240, right: 240, top: 270, textAlign: 'center', opacity: clamp01((f - at) / 10)}}>
    <div style={{fontFamily: TF.mono, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: T.cyan}}>{label}</div>
    <div style={{marginTop: 34, fontFamily: serif ? 'Georgia, serif' : TF.sans, fontStyle: serif ? 'italic' : 'normal', fontSize: size, lineHeight: 1.4, color: T.white}}>{quote}</div>
    {cite ? <div style={{marginTop: 30, fontFamily: TF.sans, fontSize: 26, color: T.gray}}>{cite}</div> : null}
    {note ? <div style={{marginTop: 14, fontFamily: TF.sans, fontSize: 22, color: T.dim}}>{note}</div> : null}
  </div>
);

/** 方法卡：2×2 卡片，第 k 张在 ats[k] 帧亮起（之前是暗的）；icons[k] 是 240×150 的简图标（拿到当前颜色） */
export const StepGrid: React.FC<{f: number; ats: number[]; titles: string[]; colors: string[]; icons?: ((c: string) => React.ReactNode)[]}> = ({f, ats, titles, colors, icons = []}) => (
  <AbsoluteFill>
    {titles.map((title, i) => {
      const on = clamp01((f - ats[i]) / 8);
      const x = 300 + (i % 2) * 680;
      const y = 180 + Math.floor(i / 2) * 330;
      const c = colors[i];
      return (
        <div key={title} style={{position: 'absolute', left: x, top: y, width: 640, height: 290, border: `2px solid ${on > 0 ? c : 'rgba(200,215,225,0.15)'}`, background: 'rgba(10,19,34,0.7)', boxShadow: `0 0 ${20 * on}px ${c}55`, opacity: 0.35 + 0.65 * on}}>
          <div style={{position: 'absolute', left: 0, top: 0, padding: '4px 14px', background: on > 0 ? c : 'rgba(200,215,225,0.15)', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, color: '#06121a'}}>0{i + 1}</div>
          {icons[i] ? (
            <svg width={240} height={150} viewBox="0 0 240 150" style={{position: 'absolute', left: 30, top: 70}}>
              {icons[i](on > 0 ? c : T.dim)}
            </svg>
          ) : null}
          <div style={{position: 'absolute', left: icons[i] ? 290 : 40, top: 105, width: icons[i] ? 330 : 560, fontFamily: TF.sans, fontSize: 40, lineHeight: 1.3, color: on > 0 ? T.white : T.dim}}>{title}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
