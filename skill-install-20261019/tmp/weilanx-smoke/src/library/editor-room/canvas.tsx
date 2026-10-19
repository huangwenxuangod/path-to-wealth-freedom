import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, rand} from '../anim';
import {Critter} from './mascots';
import type {CrewMember} from './mascots';
import {HlPill, Icon, RoomBg} from './stage';
import {bob, E, EF, hl, pop, popIn} from './theme';

/**
 * 协作剪辑台风的画布内容（画布内坐标约 1215×686）：大标题、浏览器网页示意、功能卡、缩略图墙、集成卡片行，以及整屏收尾卡。
 * 网页都是原创示意（色块和占位线），不放任何真实网站截图。
 */

/** 原创示例 logo：墨黑圆角方块里一颗白色卵石 + 一个荧光小点（示例产品「Pebble」用） */
export const BrandMark: React.FC<{size?: number}> = ({size = 40}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{display: 'block', flexShrink: 0}}>
    <rect width={40} height={40} rx={10} fill={E.ink} />
    <ellipse cx={18} cy={22} rx={11} ry={8.5} fill="#fff" transform="rotate(-18 18 22)" />
    <circle cx={29} cy={11} r={4} fill={E.hl} />
  </svg>
);

/** 把「加点〔品味〕。」拆成 [文字, 是否荧光笔] 片段 */
const marks = (s: string): [string, boolean][] => s.split(/(〔[^〕]*〕)/).filter(Boolean).map((t) => (t.startsWith('〔') ? [t.slice(1, -1), true] : [t, false]));

/**
 * 大标题：parts 每一段是一个短语，依次淡入上浮（每段 6 帧、间隔 per 帧）；〔词〕 在全部短语出完后被荧光笔从左往右扫过。
 * 中文用粗黑体 900，英文自动用几何无衬线
 */
export const PopTitle: React.FC<{f: number; at: number; parts: string[]; size?: number; per?: number; align?: 'left' | 'center'; color?: string}> = ({f, at, parts, size = 96, per = 7, align = 'center', color = E.ink}) => {
  const done = at + (parts.length - 1) * per + 8;
  return (
    <div style={{textAlign: align, fontFamily: EF.title, fontWeight: 900, fontSize: size, lineHeight: 1.18, color, letterSpacing: -1}}>
      {parts.map((p, i) => (
        <span key={i} style={{display: 'inline-block', ...pop(f, at + i * per)}}>
          {marks(p).map(([t, m], k) =>
            m ? (
              <span key={k} style={{position: 'relative', display: 'inline-block'}}>
                <span style={{position: 'absolute', left: -4, right: 'auto', bottom: size * 0.06, height: size * 0.42, width: `calc(${hl(f, done) * 100}% + 8px)`, background: E.hl, zIndex: 0, borderRadius: 3}} />
                <span style={{position: 'relative'}}>{t}</span>
              </span>
            ) : (
              <span key={k}>{t}</span>
            ),
          )}
        </span>
      ))}
    </div>
  );
};

/* ---------------- 原创网站示意页 ---------------- */

const PALETTES = [
  ['#fbf6ec', '#1d1c1a', '#f5b62a'],
  ['#eef5ff', '#14315c', '#2f8ae5'],
  ['#fff1f6', '#4a1630', '#f0418f'],
  ['#effaf4', '#123b2a', '#21b878'],
  ['#f6f2ff', '#2a1f4d', '#8a6cf0'],
  ['#fff4ec', '#40210f', '#ef6b3f'],
];

/** 一张原创的落地页示意（导航 + 大标题色块 + 主视觉 + 三张特性卡）；seed 决定配色和版式细节，w×h 任意 */
export const SitePage: React.FC<{seed: number; w: number; h: number; title?: string}> = ({seed, w, h, title}) => {
  const [bg, ink, ac] = PALETTES[seed % PALETTES.length];
  const r = (n: number) => rand(seed * 13 + n);
  return (
    <svg width={w} height={h} viewBox={`0 0 400 ${(400 * h) / w}`} style={{display: 'block'}}>
      <rect width={400} height={(400 * h) / w} fill={bg} />
      <rect x={16} y={14} width={18} height={18} rx={5} fill={ink} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={250 + i * 34} y={20} width={24} height={6} rx={3} fill={ink} opacity={0.35} />
      ))}
      <rect x={348} y={14} width={38} height={18} rx={9} fill={ac} />
      {title ? (
        <text x={16} y={86} fontFamily={EF.title} fontWeight={900} fontSize={30} fill={ink}>
          {title}
        </text>
      ) : (
        <>
          <rect x={16} y={60} width={150 + r(1) * 60} height={20} rx={4} fill={ink} />
          <rect x={16} y={88} width={110 + r(2) * 50} height={20} rx={4} fill={ink} />
        </>
      )}
      <rect x={16} y={120} width={170} height={6} rx={3} fill={ink} opacity={0.25} />
      <rect x={16} y={132} width={140} height={6} rx={3} fill={ink} opacity={0.25} />
      <rect x={16} y={152} width={72} height={22} rx={11} fill={ink} />
      <rect x={96} y={152} width={64} height={22} rx={11} fill="none" stroke={ink} strokeWidth={1.5} />
      {/* 主视觉：几何色块拼图 */}
      <rect x={210} y={52} width={174} height={130} rx={12} fill={ac} opacity={0.18} />
      <circle cx={262 + r(3) * 30} cy={110} r={34} fill={ac} />
      <rect x={300} y={74} width={58} height={58} rx={14} fill={ink} opacity={0.85} transform={`rotate(${8 + r(4) * 12} 329 103)`} />
      <rect x={236} y={142} width={120} height={14} rx={7} fill="#fff" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16 + i * 126} y={206} width={116} height={86} rx={10} fill="#fff" />
          <rect x={28 + i * 126} y={218} width={22} height={22} rx={6} fill={i === 1 ? ac : ink} opacity={i === 1 ? 1 : 0.8} />
          <rect x={28 + i * 126} y={250} width={70} height={6} rx={3} fill={ink} opacity={0.5} />
          <rect x={28 + i * 126} y={262} width={88} height={5} rx={2.5} fill={ink} opacity={0.2} />
          <rect x={28 + i * 126} y={272} width={60} height={5} rx={2.5} fill={ink} opacity={0.2} />
        </g>
      ))}
      <rect x={16} y={312} width={368} height={120} rx={12} fill={ink} opacity={0.92} />
      <rect x={36} y={338} width={140} height={14} rx={4} fill="#fff" />
      <rect x={36} y={362} width={200} height={6} rx={3} fill="#fff" opacity={0.4} />
      <rect x={300} y={346} width={64} height={22} rx={11} fill={ac} />
    </svg>
  );
};

/**
 * 浏览器窗口：白卡 + 三个灰点 + 网址胶囊，里面是一张原创落地页示意；scroll 0–1 时页面往上滚（scrollAt 起、scrollDur 帧）
 */
export const BrowserMock: React.FC<{f: number; at: number; url: string; seed?: number; title?: string; x?: number; y?: number; w?: number; h?: number; scrollAt?: number; scrollDur?: number}> = ({f, at, url, seed = 0, title, x = 240, y = 70, w = 740, h = 520, scrollAt, scrollDur = 40}) => {
  const st = popIn(f, at, 10);
  const pageH = w * 1.15;
  const s = scrollAt === undefined ? 0 : easeInOut(clamp01((f - scrollAt) / scrollDur));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, background: '#fff', boxShadow: E.cardShadow, overflow: 'hidden', ...st}}>
      <div style={{height: 42, borderBottom: `1px solid ${E.line}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>
        {['#f26b5b', '#f5bd4f', '#5cc26e'].map((c) => (
          <span key={c} style={{width: 11, height: 11, borderRadius: 6, background: c}} />
        ))}
        <span style={{marginLeft: 14, flex: 1, height: 26, borderRadius: 13, background: E.track, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', fontFamily: EF.ui, fontWeight: 600, fontSize: 14, color: E.text}}>
          <Icon k="globe" c={E.gray} s={14} />
          {url}
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 42, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-s * (pageH - (h - 42))}px)`}}>
          <SitePage seed={seed} w={w} h={pageH} title={title} />
        </div>
      </div>
    </div>
  );
};

/**
 * 功能卡：白色圆角卡（左上 logo + 等宽小标签，三条占位线），右边缘依次弹出一列小胶囊（chipAt 起每个间隔 5 帧），
 * hl 为 true 的那个胶囊是荧光黄
 */
export const FeatureCard: React.FC<{f: number; at: number; label: string; logo?: React.ReactNode; chips: {text: string; icon: string; hl?: boolean}[]; chipAt: number; x?: number; y?: number}> = ({f, at, label, logo, chips, chipAt, x = 330, y = 230}) => (
  <div style={{position: 'absolute', left: x, top: y, ...popIn(f, at, 10)}}>
    <div style={{width: 500, height: 280, borderRadius: 22, background: '#fff', border: `2px solid ${E.ink}`, boxShadow: E.cardShadow}}>
      <div style={{position: 'absolute', left: 28, top: 28, display: 'flex', alignItems: 'center', gap: 12}}>
        {logo ?? <BrandMark size={34} />}
        <span style={{padding: '3px 10px', borderRadius: 6, background: E.track, fontFamily: EF.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: E.ink}}>{label}</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 28, top: 104 + i * 42, width: [400, 330, 270][i], height: 14, borderRadius: 7, background: E.line}} />
      ))}
    </div>
    <div style={{position: 'absolute', left: 430, top: 40, display: 'flex', flexDirection: 'column', gap: 16}}>
      {chips.map((c, i) => (
        <span key={c.text} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: c.hl ? E.hl : '#fff', border: `2px solid ${E.ink}`, fontFamily: EF.ui, fontWeight: 800, fontSize: 21, color: E.ink, whiteSpace: 'nowrap', transformOrigin: '0% 50%', ...popIn(f, chipAt + i * 5, 9)}}>
          <Icon k={c.icon} c={E.ink} s={19} />
          {c.text}
        </span>
      ))}
    </div>
  </div>
);

/** 荧光黄对勾贴纸（圆形、带白描边） */
export const CheckSticker: React.FC<{size?: number}> = ({size = 46}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: E.hl, border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Icon k="check" c={E.ink} s={size * 0.55} w={3} />
  </div>
);

/** 缩略图墙：3×2 张原创网页示意依次浮现，stickerAt 起每张右上角拍一个对勾贴纸 */
export const ThumbWall: React.FC<{f: number; at: number; stickerAt: number; x?: number; y?: number; cols?: number; n?: number; tw?: number; th?: number}> = ({f, at, stickerAt, x = 520, y = 120, cols = 3, n = 6, tw = 200, th = 136}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    {Array.from({length: n}, (_, i) => {
      const cx = (i % cols) * (tw + 18);
      const cy = Math.floor(i / cols) * (th + 22);
      return (
        <div key={i} style={{position: 'absolute', left: cx, top: cy, ...pop(f, at + i * 3, 8, 16)}}>
          <div style={{width: tw, height: th, borderRadius: 10, overflow: 'hidden', boxShadow: E.cardShadow, background: '#fff'}}>
            <SitePage seed={i + 1} w={tw} h={th * 1.6} />
          </div>
          <div style={{position: 'absolute', right: -14, top: -14, ...popIn(f, stickerAt + i * 4, 9)}}>
            <CheckSticker size={40} />
          </div>
        </div>
      );
    })}
  </div>
);

/** 集成卡片行：一排白色方卡（图形 + 名字），下方各一个「✓ 已接入」小胶囊；最后一张是虚线「+ 更多」 */
export const LogoTiles: React.FC<{f: number; at: number; tiles: {name: string; glyph: React.ReactNode}[]; checkAt?: number; x?: number; y?: number}> = ({f, at, tiles, checkAt, x = 300, y = 300}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap: 22}}>
    {[...tiles, {name: '+ 更多', glyph: null}].map((t, i) => {
      const more = i === tiles.length;
      return (
        <div key={t.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, ...popIn(f, at + i * 4, 10)}}>
          <div style={{width: 150, height: 130, borderRadius: 16, background: more ? 'transparent' : '#fff', border: more ? `2px dashed ${E.faint}` : 'none', boxShadow: more ? undefined : E.cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
            {t.glyph}
            <span style={{fontFamily: EF.ui, fontWeight: 700, fontSize: 17, color: more ? E.gray : E.ink}}>{t.name}</span>
          </div>
          {!more && checkAt !== undefined ? (
            <span style={{display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: E.hl, fontFamily: EF.ui, fontWeight: 700, fontSize: 14, color: E.ink, ...popIn(f, checkAt + i * 4, 8)}}>
              <Icon k="check" c={E.ink} s={14} w={3} />
              已接入
            </span>
          ) : null}
        </div>
      );
    })}
  </div>
);

/**
 * 整屏收尾卡：暖米白底，logo + 产品名，口号按短语浮现、关键词荧光笔，下方黑色网址胶囊（带地球图标）+ 一行小字，最底一排小角色依次跳出
 */
export const EndCard: React.FC<{f: number; at: number; logo: React.ReactNode; name: string; slogan: string[]; url: string; note?: string; crew: CrewMember[]}> = ({f, at, logo, name, slogan, url, note, crew}) => {
  const t = f - at;
  const urlAt = at + 14 + slogan.length * 7 + 10;
  return (
    <AbsoluteFill>
      <RoomBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, ...pop(f, at, 8, 14)}}>
        {logo}
        <span style={{fontFamily: EF.title, fontWeight: 800, fontSize: 92, color: E.ink, letterSpacing: -2}}>{name}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300}}>
        <PopTitle f={f} at={at + 14} parts={slogan} size={84} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', ...pop(f, urlAt, 8, 20)}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 26px', borderRadius: 999, background: E.ink, color: '#fff', fontFamily: EF.title, fontWeight: 700, fontSize: 28}}>
          <Icon k="globe" c={E.hl} s={24} />
          {url}
        </span>
      </div>
      {note ? <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: EF.ui, fontWeight: 600, fontSize: 22, color: E.gray, ...pop(f, urlAt + 6, 8, 10)}}>{note}</div> : null}
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', gap: 44}}>
        {crew.map((m, i) => {
          const st = popIn(f, urlAt + 10 + i * 4, 10);
          return (
            <div key={m.name} style={{...st, transform: `${st.transform ?? ''} translateY(${t > 0 ? bob(f, i, 5) : 0}px)`}}>
              <Critter shape={m.shape} color={m.color} size={110} f={f} blink={i} look={[0, 0.2]} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 画布里的居中容器：把画布内容放在 1215×686 的坐标里 */
export const CanvasFill: React.FC<{children?: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;

/** 画布里的一个标签胶囊（「已复制」黑胶囊之类） */
export const InkPill: React.FC<{f: number; at: number; text: string; icon?: string; x: number; y: number}> = ({f, at, text, icon = 'check', x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, ...popIn(f, at, 9)}}>
    <span style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 26px', borderRadius: 999, background: E.ink, color: '#fff', fontFamily: EF.ui, fontWeight: 700, fontSize: 19}}>
      <Icon k={icon} c="#fff" s={18} w={3} />
      {text}
    </span>
  </div>
);

export {HlPill};
