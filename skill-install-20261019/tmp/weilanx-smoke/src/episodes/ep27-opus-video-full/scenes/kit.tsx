import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {clamp01, easeInOut, easeOut, easeOutBack} from '../../../library/anim';
import {Icon} from '../../../library/warm-desk/props';
import {Tick} from '../../../library/warm-desk/stage';
import {D, DF, drift, OG, rise} from '../../../library/warm-desk/theme';
import {WORKS} from '../assets';

/** ep27 专用的画面组件（下次还能用的再挪进 src/library/warm-desk/） */

/** 往期爆款：2×2 四张作品卡，各自播放真实片段（静音），依次翻起、轻轻漂浮；卡下是片名 + 风格标签 */
export const WorkVideos: React.FC<{f: number; at: number; gap?: number}> = ({f, at, gap = 6}) => (
  <div style={{position: 'relative', width: 1000, height: 640, perspective: 1400}}>
    {WORKS.map((w, i) => {
      const t = clamp01((f - at - i * gap) / 14);
      const p = easeOutBack(t);
      const [dx, dy] = drift(f, i, 5, 160);
      return (
        <div key={w.file} style={{position: 'absolute', left: (i % 2) * 510, top: Math.floor(i / 2) * 320, width: 480, opacity: easeOut(t), transform: `translate(${dx}px, ${dy + (1 - p) * 80}px) rotateX(${(1 - p) * 35}deg) rotate(${[-2.5, 2, 2, -1.5][i]}deg)`, transformOrigin: '50% 100%', background: D.card, borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
          <div style={{width: 480, height: 230, background: '#111'}}>
            <Sequence from={at + i * gap} layout="none">
              <OffthreadVideo src={staticFile(w.file)} muted style={{width: 480, height: 270, marginTop: -20, objectFit: 'cover', display: 'block'}} />
            </Sequence>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 18px'}}>
            <div style={{fontFamily: DF.serif, fontWeight: 900, fontSize: 30, color: D.ink, whiteSpace: 'nowrap'}}>{w.title}</div>
            <span style={{padding: '4px 12px', borderRadius: 10, background: D.tint, color: D.orangeDeep, fontFamily: DF.sans, fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap'}}>{w.style}</span>
          </div>
        </div>
      );
    })}
  </div>
);

/** 叠帧：n 张小画面错开叠成一摞（每张里小球位置不同），at 起一张张落下；「很多张图片堆叠到一起」 */
export const FrameStack: React.FC<{f: number; at: number; n?: number}> = ({f, at, n = 6}) => (
  <div style={{position: 'relative', width: 640, height: 300}}>
    {Array.from({length: n}, (_, i) => {
      const t = clamp01((f - at - i * 4) / 10);
      const p = easeOutBack(t);
      return (
        <div key={i} style={{position: 'absolute', left: i * 64, top: 40 - i * 6, width: 260, height: 180, borderRadius: 12, background: D.card, border: `1px solid ${D.cardLine}`, boxShadow: '0 12px 26px rgba(70,50,30,0.12)', opacity: easeOut(t), transform: `translateY(${(1 - p) * -60}px) rotate(${(i - n / 2) * 1.5}deg)`}}>
          <div style={{position: 'absolute', left: 24 + i * 30, top: 70, width: 40, height: 40, borderRadius: 20, background: OG}} />
          <div style={{position: 'absolute', left: 14, bottom: 10, fontFamily: DF.mono, fontSize: 16, color: D.gray}}>第 {i + 1} 张</div>
        </div>
      );
    })}
  </div>
);

/** 帧率条：n 个小格一字排开，每一帧（真实的 1/30 秒）点亮一格，满一秒归零重来；下面一行刻度「0s … 1s」 */
export const FpsBar: React.FC<{f: number; at: number; n?: number; w?: number}> = ({f, at, n = 30, w = 960}) => {
  const r = rise(f, at, 12, 20);
  const k = Math.max(0, f - at) % n;
  const cw = (w - (n - 1) * 6) / n;
  return (
    <div style={{opacity: r.opacity, transform: r.transform, filter: r.filter, width: w}}>
      <div style={{display: 'flex', gap: 6}}>
        {Array.from({length: n}, (_, i) => (
          <div key={i} style={{width: cw, height: 70, borderRadius: 6, background: i <= k ? OG : D.card, border: i <= k ? 'none' : `1px solid ${D.cardLine}`, boxShadow: i === k ? D.glow : undefined}} />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: DF.mono, fontSize: 20, color: D.gray}}>
        <span>0s</span>
        <span>每一格 = 一张图片</span>
        <span>1s</span>
      </div>
    </div>
  );
};

/** 代码 → 画面：左边深色代码卡（帧号 f 决定小球位置），右边纸面预览里小球真的随帧移动，底下帧号在跳 */
export const CodePreview: React.FC<{f: number; at: number}> = ({f, at}) => {
  const r = rise(f, at, 14, 30);
  const r2 = rise(f, at + 8, 14, 30);
  const t = Math.max(0, f - at);
  const x = 30 + ((t * 6) % 300);
  const lines: [string, string][] = [
    ['const', ' f = useCurrentFrame()'],
    ['const', ' x = f * 6'],
    ['return', ' <Ball x={x} />'],
  ];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
      <div style={{opacity: r.opacity, transform: `${r.transform} rotate(-1.5deg)`, filter: r.filter, width: 500, borderRadius: 18, background: '#1f1b17', boxShadow: '0 30px 60px rgba(40,25,10,0.28)', overflow: 'hidden'}}>
        <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', background: '#2a2520'}}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? D.orange : '#4a433b'}} />
          ))}
          <span style={{marginLeft: 12, fontFamily: DF.mono, fontSize: 17, color: '#8d8478'}}>Scene.tsx</span>
        </div>
        <div style={{padding: '22px 28px 26px'}}>
          {lines.map(([k, rest], i) => (
            <div key={i} style={{fontFamily: DF.mono, fontSize: 25, lineHeight: 2, whiteSpace: 'pre', color: '#efe8de', opacity: clamp01((f - at - 6 - i * 8) / 6)}}>
              <span style={{color: D.orangeSoft}}>{k}</span>
              {rest}
            </div>
          ))}
        </div>
      </div>
      <svg width={60} height={40} style={{opacity: r2.opacity}}>
        <path d="M6 20H50M38 8l12 12-12 12" stroke={D.orange} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{opacity: r2.opacity, transform: `${r2.transform} rotate(1.5deg)`, filter: r2.filter, width: 380, background: D.card, borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
        <div style={{position: 'relative', height: 220, background: D.paper, backgroundImage: `radial-gradient(${D.dot} 1.2px, transparent 1.4px)`, backgroundSize: '14px 14px'}}>
          <div style={{position: 'absolute', left: x, top: 85, width: 50, height: 50, borderRadius: 25, background: OG, boxShadow: D.glow}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 22px', fontFamily: DF.mono, fontSize: 22, color: D.text}}>
          <span>
            f = <span style={{color: D.orange, fontWeight: 700}}>{t}</span>
          </span>
          <span style={{color: D.gray}}>x = {t * 6}</span>
        </div>
      </div>
    </div>
  );
};

/** 算式：三张数字卡「30 帧/秒 × 10 秒 = 300 帧」，at 三个帧依次弹出，最后一张橙色 */
export const Equation: React.FC<{f: number; at: [number, number, number]; items?: [string, string][]}> = ({f, at, items = [['30', '帧 / 秒'], ['10', '秒'], ['300', '帧']]}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
    {items.map(([n, u], i) => {
      const t = clamp01((f - at[i]) / 14);
      const p = easeOutBack(t);
      const hi = i === 2;
      return (
        <React.Fragment key={i}>
          {i > 0 ? <span style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 80, color: D.gray, opacity: easeOut(t)}}>{i === 1 ? '×' : '='}</span> : null}
          <div style={{opacity: easeOut(t), transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`, width: 270, padding: '34px 0 30px', textAlign: 'center', borderRadius: 24, background: hi ? OG : D.card, border: hi ? 'none' : `1px solid ${D.cardLine}`, boxShadow: hi ? D.glow : D.shadow}}>
            <div style={{fontFamily: DF.sans, fontWeight: 900, fontSize: 120, lineHeight: 1, color: hi ? '#fff' : D.ink, letterSpacing: -2}}>{n}</div>
            <div style={{fontFamily: DF.sans, fontWeight: 800, fontSize: 32, color: hi ? 'rgba(255,255,255,0.9)' : D.gray, marginTop: 12}}>{u}</div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

/** 对比表：三列（维度 / 视频模型 / 代码），每行 at[i] 帧从左滑入；hiAt 起「代码」一列铺浅橙底、打勾 */
export const VersusTable: React.FC<{f: number; at: number[]; hiAt: number; rows: [string, string, string][]}> = ({f, at, hiAt, rows}) => {
  const hi = f >= hiAt;
  const r = rise(f, at[0] - 8, 12, 20);
  const col = [260, 330, 330];
  return (
    <div style={{opacity: r.opacity, transform: r.transform, filter: r.filter, width: 920, background: D.card, borderRadius: 22, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
      <div style={{display: 'flex', borderBottom: `1px solid ${D.cardLine}`, fontFamily: DF.sans, fontWeight: 900, fontSize: 34}}>
        <div style={{width: col[0]}} />
        <div style={{width: col[1], padding: '26px 0', textAlign: 'center', color: D.gray}}>视频模型</div>
        <div style={{width: col[2], padding: '26px 0', textAlign: 'center', color: hi ? '#fff' : D.ink, background: hi ? OG : 'transparent'}}>代码</div>
      </div>
      {rows.map(([k, a, b], i) => {
        const t = easeOut(clamp01((f - at[i]) / 10));
        return (
          <div key={k} style={{display: 'flex', alignItems: 'center', borderTop: i ? `1px solid ${D.cardLine}` : 'none', opacity: t, transform: `translateX(${(1 - t) * -30}px)`, fontFamily: DF.sans, fontSize: 32}}>
            <div style={{width: col[0], padding: '28px 0 28px 36px', boxSizing: 'border-box', fontWeight: 700, color: D.gray}}>{k}</div>
            <div style={{width: col[1], textAlign: 'center', fontWeight: 700, color: D.text}}>{a}</div>
            <div style={{width: col[2], alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 900, color: D.ink, background: hi ? D.tint : 'transparent'}}>
              {b}
              {hi ? <Tick size={28} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** 目录树：等宽字的树状目录，第 i 行 at[i] 帧出现；hi 那一行橙底白字（「.claude/skills/distill-video」） */
export const FileTree: React.FC<{f: number; at: number[]; lines: [number, string][]; hi?: number; title?: string; w?: number}> = ({f, at, lines, hi, title = 'weilanx-claude-videos', w = 640}) => {
  const r = rise(f, at[0] - 6, 12, 24);
  return (
    <div style={{opacity: r.opacity, transform: `${r.transform} rotate(-1deg)`, filter: r.filter, width: w, background: D.card, borderRadius: 18, border: `1px solid ${D.cardLine}`, boxShadow: D.shadow, overflow: 'hidden'}}>
      <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: `1px solid ${D.cardLine}`, background: 'linear-gradient(180deg, #fffdfa, #faf6f0)'}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? D.orange : '#ddd6cb'}} />
        ))}
        <span style={{marginLeft: 12, fontFamily: DF.mono, fontSize: 18, color: D.gray}}>{title}</span>
      </div>
      <div style={{padding: '18px 26px 22px'}}>
        {lines.map(([depth, name], i) => {
          const t = easeOut(clamp01((f - (at[i] ?? at[at.length - 1])) / 8));
          const on = hi === i && f >= (at[i] ?? 0) + 6;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', opacity: t, transform: `translateX(${(1 - t) * -20}px)`, fontFamily: DF.mono, fontSize: 28, lineHeight: 1.85, whiteSpace: 'pre', color: D.text}}>
              <span style={{color: D.faint}}>{depth ? '  '.repeat(depth - 1) + '└ ' : ''}</span>
              <span style={{padding: on ? '0 12px' : 0, borderRadius: 8, background: on ? OG : 'transparent', color: on ? '#fff' : name.endsWith('/') ? D.ink : D.gray, fontWeight: name.endsWith('/') || on ? 700 : 400, boxShadow: on ? D.glow : undefined}}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** 缩略图墙：真实的往期截帧 cols 列依次弹出，整面墙缓慢上移 */
export const ThumbWall: React.FC<{f: number; at: number; files: string[]; cols?: number; w?: number}> = ({f, at, files, cols = 4, w = 1000}) => {
  const tw = (w - (cols - 1) * 16) / cols;
  const th = tw * 0.5625;
  const lift = Math.max(0, f - at) * 0.15;
  return (
    <div style={{position: 'relative', width: w, height: Math.ceil(files.length / cols) * (th + 16), transform: `translateY(${-lift}px)`}}>
      {files.map((src, i) => {
        const t = clamp01((f - at - i * 2) / 10);
        const p = easeOutBack(t);
        return (
          <div key={src} style={{position: 'absolute', left: (i % cols) * (tw + 16), top: Math.floor(i / cols) * (th + 16), width: tw, height: th, borderRadius: 12, overflow: 'hidden', border: `3px solid ${D.card}`, boxShadow: '0 10px 22px rgba(70,50,30,0.16)', opacity: easeOut(t), transform: `scale(${0.7 + 0.3 * p}) rotate(${((i * 7) % 5) - 2}deg)`}}>
            <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        );
      })}
    </div>
  );
};

/** 点赞 / 收藏 / 关注 三个大圆钮依次弹出、点亮 */
export const ActionRow: React.FC<{f: number; at: number; items?: ('heart' | 'star' | 'plus')[]; labels?: string[]}> = ({f, at, items = ['heart', 'star', 'plus'], labels = ['点赞', '收藏', '关注']}) => (
  <div style={{display: 'flex', gap: 60}}>
    {items.map((ic, i) => {
      const t = clamp01((f - at - i * 6) / 12);
      const lit = f >= at + 16 + i * 8;
      return (
        <div key={ic} style={{textAlign: 'center', opacity: easeOut(t), transform: `scale(${(0.6 + 0.4 * easeOutBack(t)) * (lit ? 1 + 0.15 * Math.max(0, 1 - (f - at - 16 - i * 8) / 8) : 1)})`}}>
          <div style={{width: 120, height: 120, borderRadius: 60, background: lit ? OG : D.card, boxShadow: lit ? D.glow : D.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon kind={ic} size={56} color={lit ? '#fff' : D.orange} />
          </div>
          <div style={{marginTop: 14, fontFamily: DF.sans, fontWeight: 800, fontSize: 30, color: D.text}}>{labels[i]}</div>
        </div>
      );
    })}
  </div>
);

/** 往期作品墙（全屏）：2×2 四段真实成片同时播放，片名做成白色胶囊压在画面左下角 */
export const VideoWall: React.FC<{f: number; at: number; gap?: number}> = ({f, at, gap = 5}) => {
  const W = 680;
  const H = 383;
  return (
    <div style={{position: 'relative', width: W * 2 + 28, height: H * 2 + 28}}>
      {WORKS.map((w, i) => {
        const t = clamp01((f - at - i * gap) / 14);
        const p = easeOutBack(t);
        return (
          <div key={w.file} style={{position: 'absolute', left: (i % 2) * (W + 28), top: Math.floor(i / 2) * (H + 28), width: W, height: H, borderRadius: 18, overflow: 'hidden', border: `5px solid ${D.card}`, boxShadow: '0 30px 60px rgba(60,40,20,0.22)', opacity: easeOut(t), transform: `scale(${0.85 + 0.15 * p})`, background: '#111'}}>
            <Sequence from={at + i * gap} layout="none">
              <OffthreadVideo src={staticFile(w.file)} muted style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            </Sequence>
            <div style={{position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderRadius: 24, background: 'rgba(255,255,255,0.94)', fontFamily: DF.sans, whiteSpace: 'nowrap'}}>
              <span style={{fontWeight: 900, fontSize: 24, color: D.ink}}>{w.title}</span>
              <span style={{fontWeight: 700, fontSize: 17, color: D.orangeDeep}}>{w.style}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * 猜 vs 算（全屏分屏）：左边深色面板里一颗球的好几个半透明「猜测」在抖、带问号；右边纸面上网格 + 准星，球精确落在算出来的位置并标坐标。
 * at = [左面板, 右面板, 第一行结论, 第二行结论]
 */
export const SplitVersus: React.FC<{f: number; at: [number, number, number, number]}> = ({f, at}) => {
  const PW = 800;
  const PH = 500;
  const t = Math.max(0, f - at[1]);
  const bx = 120 + ((t * 5) % 520);
  const panel = (k: number) => rise(f, at[k], 16, 50);
  const L = panel(0);
  const R = panel(1);
  const stat = (k: number, i: number) => easeOut(clamp01((f - at[k] - i * 4) / 10));
  return (
    <div style={{position: 'relative', width: PW * 2 + 40, height: PH + 140}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, borderRadius: 26, background: '#1d1915', overflow: 'hidden', boxShadow: '0 30px 70px rgba(40,25,10,0.28)', opacity: L.opacity, transform: `${L.transform} rotate(-1deg)`, filter: L.filter}}>
        <div style={{position: 'absolute', left: 36, top: 30, fontFamily: DF.sans, fontWeight: 900, fontSize: 40, color: '#efe8de'}}>视频模型</div>
        <div style={{position: 'absolute', right: 36, top: 26, fontFamily: DF.sans, fontWeight: 900, fontSize: 64, color: '#6f665c'}}>猜</div>
        {Array.from({length: 6}, (_, i) => {
          const jx = Math.sin(f / 5 + i * 1.9) * 70 + (i - 2.5) * 30;
          const jy = Math.cos(f / 6 + i * 2.3) * 50;
          return <div key={i} style={{position: 'absolute', left: 380 + jx, top: 230 + jy, width: 70, height: 70, borderRadius: 35, background: 'rgba(241,90,53,0.28)', filter: `blur(${3 + (i % 3) * 3}px)`}} />;
        })}
        {['?', '?', '?'].map((q, i) => (
          <div key={i} style={{position: 'absolute', left: 250 + i * 150, top: 120 + (i % 2) * 230, fontFamily: DF.sans, fontWeight: 900, fontSize: 60, color: 'rgba(239,232,222,0.35)', transform: `rotate(${Math.sin(f / 12 + i) * 12}deg)`}}>
            {q}
          </div>
        ))}
        <div style={{position: 'absolute', left: 36, bottom: 28, fontFamily: DF.sans, fontWeight: 700, fontSize: 26, color: '#9a9085'}}>下一帧，大概在这儿？</div>
      </div>
      <div style={{position: 'absolute', left: PW + 40, top: 0, width: PW, height: PH, borderRadius: 26, background: D.card, overflow: 'hidden', border: `2px solid ${D.orange}`, boxShadow: D.glow, opacity: R.opacity, transform: `${R.transform} rotate(1deg)`, filter: R.filter}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${D.cardLine} 1px, transparent 1px), linear-gradient(90deg, ${D.cardLine} 1px, transparent 1px)`, backgroundSize: '50px 50px'}} />
        <div style={{position: 'absolute', left: 36, top: 30, fontFamily: DF.sans, fontWeight: 900, fontSize: 40, color: D.ink}}>代码</div>
        <div style={{position: 'absolute', right: 36, top: 26, fontFamily: DF.sans, fontWeight: 900, fontSize: 64, color: D.orange}}>算</div>
        <div style={{position: 'absolute', left: bx + 35, top: 120, width: 2, height: 330, background: 'rgba(241,90,53,0.4)'}} />
        <div style={{position: 'absolute', left: 60, top: 265, width: PW - 120, height: 2, background: 'rgba(241,90,53,0.4)'}} />
        <div style={{position: 'absolute', left: bx, top: 230, width: 70, height: 70, borderRadius: 35, background: OG, boxShadow: D.glow}} />
        <div style={{position: 'absolute', left: bx + 80, top: 190, fontFamily: DF.mono, fontSize: 22, color: D.orangeDeep}}>x = {Math.round(bx)}</div>
        <div style={{position: 'absolute', left: 36, bottom: 28, fontFamily: DF.sans, fontWeight: 700, fontSize: 26, color: D.gray}}>每一帧，都精确算出来</div>
      </div>
      {[
        ['token 消耗 · 多', 'token 消耗 · 少很多'],
        ['准确度 · 较低', '准确度 · 高很多'],
      ].map(([a, b], i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: 40 + i * 330, top: PH + 50, padding: '12px 24px', borderRadius: 30, background: '#e9e3da', fontFamily: DF.sans, fontWeight: 800, fontSize: 30, color: D.gray, opacity: stat(2 + i, 0), transform: `translateY(${(1 - stat(2 + i, 0)) * 20}px)`, whiteSpace: 'nowrap'}}>{a}</div>
          <div style={{position: 'absolute', left: PW + 80 + i * 360, top: PH + 50, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 30, background: OG, boxShadow: D.glow, fontFamily: DF.sans, fontWeight: 900, fontSize: 30, color: '#fff', opacity: stat(2 + i, 1), transform: `translateY(${(1 - stat(2 + i, 1)) * 20}px)`, whiteSpace: 'nowrap'}}>
            {b}
            <Tick size={26} color="#fff" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

/** 下载路径：一条橙色虚线从左边的网页连到右边的文件夹，一颗光点沿线跑，中间一个下载圆钮 */
export const DownloadPath: React.FC<{f: number; at: number; w?: number}> = ({f, at, w = 300}) => {
  const p = easeInOut(clamp01((f - at) / 20));
  const run = (Math.max(0, f - at) % 40) / 40;
  return (
    <svg width={w} height={120} style={{overflow: 'visible', opacity: clamp01((f - at) / 6)}}>
      <path d={`M0 60 C ${w * 0.35} 0, ${w * 0.65} 120, ${w} 60`} fill="none" stroke={D.orange} strokeWidth={4} strokeDasharray="10 12" pathLength={1} strokeDashoffset={0} style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}} />
      {p >= 1 ? <circle cx={w * run} cy={60 + Math.sin(run * Math.PI * 2) * -26} r={9} fill={D.orange} /> : null}
      <g transform={`translate(${w / 2} 60) scale(${easeOutBack(clamp01((f - at - 6) / 12))})`}>
        <circle r={34} fill="url(#ep27-dl)" />
        <path d="M0 -14V12M-11 2L0 13L11 2" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <linearGradient id="ep27-dl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7448" />
          <stop offset="1" stopColor="#e2472c" />
        </linearGradient>
      </defs>
    </svg>
  );
};
