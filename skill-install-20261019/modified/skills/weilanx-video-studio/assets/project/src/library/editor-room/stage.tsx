import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeOut} from '../anim';
import {Critter, CursorCritter} from './mascots';
import type {CrewMember} from './mascots';
import {E, EF, glide} from './theme';

/**
 * 协作剪辑台风的舞台层：暖米白底、顶栏、群聊、工具条、画布、时间轴，以及拼好的整套界面 EditorRoom。
 * 全部按 1920×1080 设计；所有动画由帧号 f 算出。
 */

const W = 1920;
const H = 1080;

/** 底色：暖米白平涂 + 左下暖黄、右上浅粉两团极淡的光 */
export const RoomBg: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 55% at 8% 100%, ${E.bgWarm} 0%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 45% at 92% 0%, ${E.bgPink} 0%, rgba(0,0,0,0) 70%), ${E.bg}`}} />
);

/** 荧光黄胶囊标签（顶栏「概念演示」、画布标题） */
export const HlPill: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 22}) => (
  <span style={{display: 'inline-block', padding: `${size * 0.22}px ${size * 0.7}px`, borderRadius: 999, background: E.hl, fontFamily: EF.ui, fontWeight: 800, fontSize: size, color: E.ink, whiteSpace: 'nowrap'}}>{children}</span>
);

/** 顶栏：左上 logo + 名字、荧光标签、项目名；右上「分享」和黑色「渲染」（render 0–1 时被荧光黄从左往右填满） */
export const TopBar: React.FC<{logo: React.ReactNode; name: string; tag: string; project: string; render?: number}> = ({logo, name, tag, project, render = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 74}}>
    <div style={{position: 'absolute', left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 12}}>
      {logo}
      <span style={{fontFamily: EF.title, fontWeight: 800, fontSize: 32, color: E.ink, letterSpacing: -0.5}}>{name}</span>
      <span style={{marginLeft: 14}}>
        <HlPill size={22}>{tag}</HlPill>
      </span>
      <span style={{marginLeft: 16, fontFamily: EF.ui, fontWeight: 600, fontSize: 19, color: E.text, display: 'flex', alignItems: 'center', gap: 8}}>
        <Icon k="film" c={E.gray} s={20} />
        {project}
      </span>
    </div>
    <div style={{position: 'absolute', right: 18, top: 16, display: 'flex', gap: 14, alignItems: 'center'}}>
      <span style={{padding: '8px 18px', borderRadius: 12, background: '#fff', fontFamily: EF.ui, fontWeight: 700, fontSize: 16, color: E.ink, boxShadow: E.shadow, display: 'flex', gap: 6, alignItems: 'center'}}>
        <Icon k="share" c={E.ink} s={16} />
        分享
      </span>
      <span style={{position: 'relative', width: 130, height: 40, borderRadius: 999, background: E.ink, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${clamp01(render) * 100}%`, background: E.hl}} />
        <span style={{position: 'relative', fontFamily: EF.ui, fontWeight: 800, fontSize: 17, color: render > 0.55 ? E.ink : '#fff'}}>{render >= 1 ? '已渲染' : '渲染'}</span>
      </span>
    </div>
  </div>
);

/* ---------------- 线性图标 ---------------- */

/** 小线性图标：folder 文件夹、spark 闪光、text 字母 T、music 音符、film 胶片、check 对勾、share 上传、send 发送、play 播放、pause 暂停、copy、key、search、bot */
export const Icon: React.FC<{k: string; c?: string; s?: number; w?: number}> = ({k, c = E.ink, s = 20, w = 2}) => {
  const p: Record<string, React.ReactNode> = {
    folder: <path d="M3 6 H9 L11 8 H21 V18 H3 Z" />,
    spark: <path d="M12 3 L13.6 9.4 L20 11 L13.6 12.6 L12 19 L10.4 12.6 L4 11 L10.4 9.4 Z M18 3 V6 M16.5 4.5 H19.5" />,
    text: <path d="M5 5 H19 M12 5 V20" />,
    music: <path d="M9 18 V6 L19 4 V16 M9 18 A2.5 2.5 0 1 1 9 17.9 M19 16 A2.5 2.5 0 1 1 19 15.9" />,
    film: <path d="M4 5 H20 V19 H4 Z M8 5 V19 M16 5 V19 M4 9 H8 M4 15 H8 M16 9 H20 M16 15 H20" />,
    check: <path d="M5 12.5 L10 17 L19 7" />,
    share: <path d="M12 15 V4 M7.5 8.5 L12 4 L16.5 8.5 M5 13 V20 H19 V13" />,
    send: <path d="M12 19 V5 M6 11 L12 5 L18 11" />,
    play: <path d="M8 5 L19 12 L8 19 Z" fill={c} />,
    pause: <path d="M8 5 V19 M16 5 V19" />,
    copy: <path d="M8 8 H19 V19 H8 Z M5 16 V5 H16" />,
    key: <path d="M14 10 A4 4 0 1 1 14 9.9 M11.2 12.8 L4 20 M6 18 L8 20" />,
    search: <path d="M10.5 17 A6.5 6.5 0 1 1 10.5 16.9 M15.5 15.5 L20 20" />,
    bot: <path d="M6 9 H18 V18 H6 Z M12 9 V5 M9 13 V14 M15 13 V14" />,
    globe: <path d="M12 3 A9 9 0 1 1 11.9 3 M3 12 H21 M12 3 C8 8 8 16 12 21 M12 3 C16 8 16 16 12 21" />,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block', flexShrink: 0}}>
      {p[k]}
    </svg>
  );
};

/* ---------------- 群聊 ---------------- */

/** 一条消息：at 帧冒出；who 是 CREW 下标，'me' 是自己（右侧黑气泡）；icon 是气泡尾部的小图标 */
export type ChatMsg = {at: number; who: number | 'me'; text: string; icon?: string};

const MSG_H = 96; // 名字行 + 气泡 + 间距

/** 群聊面板：顶部频道名和在线人数，消息按帧冒出（淡入 + 轻微放大），超出面板后整列平滑上滚 */
export const ChatPanel: React.FC<{f: number; channel: string; online: number; crew: CrewMember[]; me: {name: string; role: string}; msgs: ChatMsg[]; x?: number; y?: number; w?: number; h?: number}> = ({f, channel, online, crew, me, msgs, x = 18, y = 88, w = 477, h = 975}) => {
  const shown = msgs.filter((m) => f >= m.at - 1);
  const grow = (m: ChatMsg) => easeOut(clamp01((f - m.at) / 8));
  const total = shown.reduce((s, m) => s + MSG_H * grow(m), 0);
  const viewH = h - 92 - 90;
  const scroll = Math.max(0, total - viewH);
  let cy = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, background: E.panel, boxShadow: E.shadow, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 22, top: 20, zIndex: 2}}>
        <div style={{fontFamily: EF.ui, fontWeight: 800, fontSize: 22, color: E.ink}}>#{channel}</div>
        <div style={{marginTop: 4, fontFamily: EF.ui, fontWeight: 500, fontSize: 15, color: E.gray, display: 'flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 8, height: 8, borderRadius: 4, background: '#2fbf71'}} />
          {online} 位成员在线
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 92, height: viewH, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -scroll}}>
          {shown.map((m, i) => {
            const g = grow(m);
            const top = cy;
            cy += MSG_H * g;
            const isMe = m.who === 'me';
            const who = isMe ? null : crew[m.who as number];
            const name = isMe ? me.name : who!.name;
            const role = isMe ? me.role : who!.role;
            const c = isMe ? E.ink : who!.color;
            return (
              <div key={i} style={{position: 'absolute', left: 0, right: 0, top, height: MSG_H, opacity: g, transform: `scale(${0.94 + 0.06 * g})`, transformOrigin: isMe ? '90% 50%' : '10% 50%'}}>
                <div style={{position: 'absolute', top: 6, ...(isMe ? {right: 22} : {left: 66}), display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{fontFamily: EF.ui, fontWeight: 700, fontSize: 15, color: isMe ? E.ink : c}}>{name}</span>
                  <span style={{padding: '1px 7px', borderRadius: 999, background: c, color: '#fff', fontFamily: EF.ui, fontWeight: 700, fontSize: 11}}>{role}</span>
                </div>
                {!isMe && (
                  <div style={{position: 'absolute', left: 18, top: 36}}>
                    <Critter shape={who!.shape} color={who!.color} size={36} f={f} blink={m.who as number} />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 32,
                    ...(isMe ? {right: 22, background: E.ink, color: '#fff'} : {left: 66, background: E.bubble, color: E.ink}),
                    maxWidth: w - 100,
                    padding: '10px 16px',
                    borderRadius: 14,
                    fontFamily: EF.ui,
                    fontWeight: isMe ? 700 : 600,
                    fontSize: 21,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {m.text}
                  {m.icon ? <Icon k={m.icon} c={isMe ? '#fff' : E.gray} s={17} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 16, right: 16, bottom: 16, height: 54, borderRadius: 14, border: `1.5px solid ${E.line}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 18px'}}>
        <span style={{fontFamily: EF.ui, fontSize: 16, color: E.faint}}>回复…</span>
        <span style={{width: 34, height: 34, borderRadius: 17, background: E.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon k="send" c="#fff" s={18} />
        </span>
      </div>
    </div>
  );
};

/* ---------------- 工具条 ---------------- */

/** 工具条：一列圆角方块按钮（粉 / 黄 / 米色底线性图标）+ 两张小缩略图 + 一根竖排的品红标签 */
export const ToolRail: React.FC<{x?: number; y?: number; tag?: string; thumbs?: React.ReactNode[]}> = ({x = 520, y = 88, tag = '一键成片', thumbs = []}) => {
  const btn: [string, string][] = [
    ['folder', 'transparent'],
    ['spark', '#fbdcea'],
    ['text', E.hl],
    ['music', '#f3ead6'],
    ['film', '#fbdcea'],
    ['check', '#f3ead6'],
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 72, height: 742, borderRadius: 18, background: E.panel, boxShadow: E.shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, gap: 12}}>
      {btn.map(([k, bg]) => (
        <div key={k} style={{width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon k={k} c={k === 'spark' || k === 'film' ? '#e2367f' : k === 'music' ? '#b0832d' : k === 'check' ? '#b0832d' : E.ink} s={22} />
        </div>
      ))}
      {thumbs.map((t, i) => (
        <div key={i} style={{width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: `1px solid ${E.line}`, background: '#fff', marginTop: i === 0 ? 14 : 0}}>
          {t}
        </div>
      ))}
      <div style={{marginTop: 'auto', marginBottom: 40, width: 34, padding: '14px 0', borderRadius: 10, background: '#f0418f', color: '#fff', fontFamily: EF.ui, fontWeight: 800, fontSize: 15, writingMode: 'vertical-rl', textAlign: 'center', letterSpacing: 3, boxShadow: '0 6px 16px rgba(240,65,143,0.3)'}}>{tag}</div>
    </div>
  );
};

/* ---------------- 画布 ---------------- */

/** 时间码文字：帧 → 00:12 */
export const tc = (f: number, fps = 30) => {
  const s = Math.max(0, Math.floor(f / fps));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** 画布：顶部「▶ 播放」黑胶囊 + 时间码胶囊「00:10 · 镜头名」+ 居中荧光标签 + 右侧「预览」；children 是演示内容（画布内坐标 1215×685） */
export const CanvasPanel: React.FC<{f: number; playing?: boolean; shot?: string; tag: string; children?: React.ReactNode; x?: number; y?: number; w?: number; h?: number}> = ({f, playing = true, shot, tag, children, x = 602, y = 88, w = 1215, h = 742}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, background: E.panel, boxShadow: E.shadow, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12}}>
      <span style={{padding: '6px 14px', borderRadius: 999, background: E.ink, color: '#fff', fontFamily: EF.ui, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6}}>
        <Icon k={playing ? 'pause' : 'play'} c="#fff" s={13} w={3} />
        播放
      </span>
      {shot ? <span style={{padding: '6px 12px', borderRadius: 999, background: E.track, fontFamily: EF.ui, fontWeight: 600, fontSize: 15, color: E.text}}>{tc(f)} · {shot}</span> : null}
      <span style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
        <HlPill size={19}>{tag}</HlPill>
      </span>
      <span style={{marginLeft: 'auto', fontFamily: EF.ui, fontWeight: 600, fontSize: 15, color: E.gray}}>预览</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 56, bottom: 0, background: E.canvas, overflow: 'hidden'}}>{children}</div>
  </div>
);

/* ---------------- 时间轴 ---------------- */

export type TrackKey = 'shot' | 'title' | 'motion' | 'music' | 'sfx';
/**
 * 一个片段：所在轨道、起止秒；drop 给了就表示这一帧被拖进来（之前是虚线占位）；by 是拖它的小角色（CREW 下标）；
 * thumb 是镜头轨片段左侧的小缩略图；kind 'hl' 荧光黄块（标题轨）、'pink' 浅粉块（动效轨）
 */
export type Clip = {track: TrackKey; start: number; end: number; label: string; drop?: number; by?: number; thumb?: React.ReactNode; kind?: 'hl' | 'pink' | 'plain'};
/** 协作者光标的路径：[帧, x, y] 关键帧（全局画面坐标），中间平滑插值 */
export type CursorPath = {who: number; keys: [number, number, number][]};

const TL = {x: 512, y: 840, w: 1393, h: 223, label: 78, top: 30, row: 38};
const ROWS: [TrackKey | 'ruler', string][] = [
  ['ruler', '时间线'],
  ['shot', '镜头'],
  ['title', '标题'],
  ['motion', '动效'],
  ['music', '音乐'],
  ['sfx', '音效'],
];

/** 光标在某帧的位置（关键帧之间平滑插值） */
export const cursorAt = (f: number, keys: [number, number, number][]): [number, number] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) {
    const [f0, x0, y0] = keys[i - 1];
    const [f1, x1, y1] = keys[i];
    if (f <= f1) return glide(f, f0, f1 - f0, [x0, y0], [x1, y1]);
  }
  const k = keys[keys.length - 1];
  return [k[1], k[2]];
};

/** 音乐轨的金色波形（确定性） */
const Wave: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
    {Array.from({length: Math.floor(w / 4)}, (_, i) => {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.37) * Math.sin(i * 0.11 + 1) + 0.25 * Math.sin(i * 1.3));
      const hh = Math.min(1, a) * (h - 6);
      return <rect key={i} x={i * 4} y={(h - hh) / 2} width={2} height={hh} rx={1} fill={E.gold} opacity={0.85} />;
    })}
  </svg>
);

/**
 * 时间轴：左列轨道名、上方刻度（每 4 秒）、各轨片段（drop 之前是虚线占位，被拖进来后变实心）、
 * 金色音乐波形、动效轨的品红关键帧菱形、黑色播放头；cursors 是在时间轴上走动的协作者光标
 */
export const Timeline: React.FC<{f: number; total: number; clips: Clip[]; crew: CrewMember[]; cursors?: CursorPath[]; keyframes?: number[]; music?: string; fps?: number}> = ({f, total, clips, crew, cursors = [], keyframes = [], music = '配乐 · 120 BPM', fps = 30}) => {
  const ax = TL.x + TL.label + 20;
  const aw = TL.w - TL.label - 40;
  const X = (s: number) => ax + (s / total) * aw;
  const rowY = (i: number) => TL.y + 10 + i * TL.row;
  const ri = (k: TrackKey) => ROWS.findIndex(([r]) => r === k);
  const play = Math.min(total, f / fps);
  return (
    <>
      <div style={{position: 'absolute', left: TL.x, top: TL.y, width: TL.w, height: TL.h, borderRadius: 18, background: E.panel, boxShadow: E.shadow}} />
      {ROWS.map(([k, name], i) => (
        <div key={k} style={{position: 'absolute', left: TL.x + 18, top: rowY(i) + 4, fontFamily: EF.ui, fontWeight: 600, fontSize: 15, color: E.gray}}>
          {name}
        </div>
      ))}
      {/* 刻度 */}
      {Array.from({length: Math.floor(total / 4) + 1}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: X(i * 4), top: rowY(0) + 2, fontFamily: EF.mono, fontSize: 12, color: E.faint}}>
          0:{String(i * 4).padStart(2, '0')}
        </div>
      ))}
      {/* 轨道底 */}
      {ROWS.slice(1).map(([k], i) => (
        <div key={k} style={{position: 'absolute', left: ax, top: rowY(i + 1), width: aw, height: 28, borderRadius: 7, background: E.track}} />
      ))}
      <div style={{position: 'absolute', left: ax, top: rowY(ri('music')), width: aw, height: 28, overflow: 'hidden', borderRadius: 7}}>
        <Wave w={aw - 150} h={28} />
        <div style={{position: 'absolute', right: 8, top: 5, fontFamily: EF.ui, fontWeight: 600, fontSize: 13, color: '#9c7a2e'}}>{music}</div>
      </div>
      {/* 片段 */}
      {clips.map((c, i) => {
        const y = rowY(ri(c.track));
        const placed = c.drop === undefined || f >= c.drop;
        const land = c.drop === undefined ? 1 : easeOut(clamp01((f - c.drop) / 6));
        const bg = c.kind === 'hl' ? E.hl : c.kind === 'pink' ? E.motion : '#fff';
        const active = c.track === 'shot' && play >= c.start && play < c.end;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: X(c.start) + 2,
              top: y + 1,
              width: X(c.end) - X(c.start) - 4,
              height: 26,
              borderRadius: 7,
              background: placed ? bg : 'transparent',
              border: placed ? `${active ? 2 : 1}px solid ${active ? E.ink : c.kind ? 'transparent' : E.line}` : `1.5px dashed ${E.faint}`,
              opacity: placed ? 0.4 + 0.6 * land : 0.7,
              transform: placed ? `translateY(${(1 - land) * -6}px)` : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 8px',
              overflow: 'hidden',
              fontFamily: EF.ui,
              fontWeight: 700,
              fontSize: 15,
              color: placed ? E.ink : E.faint,
              whiteSpace: 'nowrap',
            }}
          >
            {placed && c.thumb ? <span style={{width: 34, height: 18, borderRadius: 4, overflow: 'hidden', flexShrink: 0, display: 'inline-block'}}>{c.thumb}</span> : null}
            {c.label}
          </div>
        );
      })}
      {/* 关键帧菱形 */}
      {keyframes.map((s, i) => (
        <div key={i} style={{position: 'absolute', left: X(s) - 7, top: rowY(ri('motion')) + 7, width: 14, height: 14, background: E.keyframe, transform: 'rotate(45deg)', borderRadius: 2}} />
      ))}
      {/* 播放头 */}
      <div style={{position: 'absolute', left: X(play) - 1, top: rowY(0) + 2, width: 2, height: TL.h - 20, background: E.ink}} />
      <div style={{position: 'absolute', left: X(play) - 7, top: rowY(0) - 2, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `9px solid ${E.ink}`}} />
      {/* 协作者光标 */}
      {cursors.map((c) => {
        const [x, y] = cursorAt(f, c.keys);
        return <CursorCritter key={c.who} f={f} m={crew[c.who]} x={x} y={y} seed={c.who} size={52} />;
      })}
    </>
  );
};

/** 时间轴的几何信息：给定秒数返回片段所在 x、轨道 y（用来摆拖动光标的落点） */
export const timelineGeom = (total: number) => {
  const ax = TL.x + TL.label + 20;
  const aw = TL.w - TL.label - 40;
  const rowY = (k: TrackKey) => TL.y + 10 + ROWS.findIndex(([r]) => r === k) * TL.row;
  return {X: (s: number) => ax + (s / total) * aw, rowY};
};

/* ---------------- 整套界面 ---------------- */

/**
 * 整套界面：底色 + 顶栏 + 群聊 + 工具条 + 画布 + 时间轴；canvas 是画布内容，floaters 是飘在顶栏上空的光标。
 * fade 0–1 时整个界面淡出（切收尾卡用）
 */
export const EditorRoom: React.FC<{
  f: number;
  logo: React.ReactNode;
  name: string;
  tag: string;
  project: string;
  render?: number;
  channel: string;
  crew: CrewMember[];
  me: {name: string; role: string};
  msgs: ChatMsg[];
  shot?: string;
  canvas?: React.ReactNode;
  total: number;
  clips: Clip[];
  cursors?: CursorPath[];
  floaters?: CursorPath[];
  keyframes?: number[];
  railThumbs?: React.ReactNode[];
  railTag?: string;
  fade?: number;
}> = (p) => (
  <AbsoluteFill style={{opacity: 1 - (p.fade ?? 0)}}>
    <RoomBg />
    <TopBar logo={p.logo} name={p.name} tag={p.tag} project={p.project} render={p.render} />
    <ChatPanel f={p.f} channel={p.channel} online={p.crew.length} crew={p.crew} me={p.me} msgs={p.msgs} />
    <ToolRail thumbs={p.railThumbs} tag={p.railTag} />
    <CanvasPanel f={p.f} shot={p.shot} tag={p.tag}>
      {p.canvas}
    </CanvasPanel>
    <Timeline f={p.f} total={p.total} clips={p.clips} crew={p.crew} cursors={p.cursors} keyframes={p.keyframes} />
    {(p.floaters ?? []).map((c) => {
      const [x, y] = cursorAt(p.f, c.keys);
      return <CursorCritter key={`fl${c.who}`} f={p.f} m={p.crew[c.who]} x={x} y={y} seed={c.who + 7} size={48} />;
    })}
  </AbsoluteFill>
);

export const ROOM = {W, H};
