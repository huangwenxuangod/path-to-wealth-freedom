import React from 'react';
import {easeOutBack, prog, rand} from '../../../library/anim';
import type {ClipView, EditorState, IconView} from '../lib/state';
import {GEO, T, timeToX} from '../lib/timeline';
import {box, C, FONT_POP, FONT_UI, popTextStyle} from '../../../library/theme';
import {TransitionIcon} from './Icons';
import {SceneArt} from './SceneArt';

const RULER_END = 1830;

const Ruler: React.FC = () => {
  const ticks = [];
  for (let s = 0; timeToX(s) <= RULER_END; s += 0.5) {
    const x = timeToX(s);
    const major = s % 2 === 0;
    ticks.push(
      <React.Fragment key={s}>
        <div style={{position: 'absolute', left: x, top: GEO.ruler.y + (major ? 0 : 12), width: 2, height: major ? 30 : 16, background: C.inkSoft}} />
        {major && (
          <div style={{position: 'absolute', left: x + 5, top: GEO.ruler.y - 4, fontFamily: FONT_UI, fontSize: 18, color: C.inkSoft}}>
            {`0:${String(s).padStart(2, '0')}`}
          </div>
        )}
      </React.Fragment>,
    );
  }
  return <>{ticks}</>;
};

const TrackButton: React.FC<{y: number; h: number; label: string}> = ({y, h, label}) => (
  <div style={{...box(76, y, 52, h, {borderRadius: 8, borderWidth: 2.5, background: '#F6F2EA'}), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_UI, fontSize: 24, color: C.ink}}>
    {label}
  </div>
);

const Clip: React.FC<{c: ClipView; frame: number}> = ({c, frame}) => {
  if (!c.visible) return null;
  const tiles = Math.max(1, Math.round(c.w / 88));
  const tw = (c.w - 6) / tiles;
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        top: c.y,
        width: c.w,
        height: c.h,
        boxSizing: 'border-box',
        border: `3px solid ${c.border}`,
        outline: `2px solid ${C.ink}`,
        borderRadius: 10,
        background: c.fill,
        overflow: 'hidden',
        display: 'flex',
        opacity: c.opacity,
        transform: `rotate(${c.rot}deg)`,
        boxShadow: c.rot ? '6px 10px 0 rgba(43,35,32,0.15)' : 'none',
      }}
    >
      {Array.from({length: tiles}, (_, i) => (
        <div key={i} style={{borderRight: i < tiles - 1 ? `2px solid ${c.border}` : 'none'}}>
          <SceneArt scene={c.id} w={tw} h={c.h - 6} t={frame + i * 9} />
        </div>
      ))}
    </div>
  );
};

const Icon: React.FC<{icon: IconView}> = ({icon}) =>
  icon.visible ? (
    <div
      style={{
        ...box(icon.x - 26, icon.y - 26, 52, 52, {borderRadius: 12, background: C.white, borderWidth: 3}),
        transform: `scale(${icon.scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '3px 4px 0 rgba(43,35,32,0.15)',
      }}
    >
      <TransitionIcon kind={icon.kind} size={38} />
    </div>
  ) : null;

const WAVE = Array.from({length: 150}, (_, i) => 0.25 + rand(i * 3.1) * 0.55 + (i % 8 === 0 ? 0.2 : 0));

const AudioTrack: React.FC<{p: number}> = ({p}) => {
  if (p <= 0) return null;
  const x0 = timeToX(0);
  const full = RULER_END - x0;
  const {y, h} = GEO.audioTrack;
  return (
    <div style={{position: 'absolute', left: x0, top: y, width: full * p, height: h, overflow: 'hidden', borderRadius: 8, border: `2.5px solid ${C.teal}`, background: C.tealLight, boxSizing: 'border-box'}}>
      <svg width={full} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        {WAVE.map((a, i) => {
          const bh = a * (h - 12);
          return <rect key={i} x={6 + i * (full / 150)} y={h / 2 - bh / 2 - 2} width={3} height={bh} rx={1.5} fill={C.teal} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 8, top: 5, padding: '0 10px', borderRadius: 8, border: `2px solid ${C.ink}`, background: C.panel, fontFamily: FONT_UI, fontSize: 18, color: C.ink}}>
        ♪ claude_track.wav
      </div>
    </div>
  );
};

export const Timeline: React.FC<{s: EditorState; frame: number}> = ({s, frame}) => {
  const {x, y, w, h} = GEO.timeline;
  const firstLand = prog(frame, T.dropSunrise - 6, 6);
  const boring = s.clips.find((c) => c.id === 'boring')!;
  const textX = timeToX(4.35);
  return (
    <>
      <div style={box(x, y, w, h)} />
      <Ruler />
      <div style={{position: 'absolute', left: timeToX(0), top: GEO.textTrack.y - 8, width: RULER_END - timeToX(0), height: 2, background: C.line}} />
      <TrackButton y={GEO.textTrack.y} h={GEO.textTrack.h} label="T" />
      <TrackButton y={GEO.videoTrack.y} h={GEO.videoTrack.h} label="▶" />
      <TrackButton y={GEO.audioTrack.y} h={GEO.audioTrack.h} label="♪" />
      <div style={{position: 'absolute', left: 0, width: 1920, top: GEO.videoTrack.y + 32, textAlign: 'center', fontFamily: FONT_UI, fontSize: 28, color: '#A89F92', opacity: 1 - firstLand}}>
        drop clips here ↓
      </div>
      <AudioTrack p={s.audioTrack} />
      {s.textClip > 0.02 && (
        <div style={{...box(textX, GEO.textTrack.y + 4, 250 * s.textClip, GEO.textTrack.h - 8, {borderRadius: 8, background: C.yellow, borderWidth: 2.5}), overflow: 'hidden', display: 'flex', alignItems: 'center', paddingLeft: 14}}>
          <span style={{fontFamily: FONT_POP, fontSize: 20, color: C.ink, whiteSpace: 'nowrap'}}>WAIT FOR IT</span>
        </div>
      )}
      {s.clips.map((c) => (
        <Clip key={c.id} c={c} frame={frame} />
      ))}
      {s.boringLabel > 0.01 && boring.visible && (
        <div
          style={{
            ...box(boring.x + 70, GEO.videoTrack.y - 44, 196, 36, {borderRadius: 8, borderWidth: 2.5, background: C.white}),
            fontFamily: FONT_UI,
            fontSize: 21,
            color: C.ink,
            textAlign: 'center',
            lineHeight: '30px',
            transform: `scale(${s.boringLabel}) rotate(-3deg)`,
          }}
        >
          the boring part zzz
        </div>
      )}
      {s.icons.map((icon) => (
        <Icon key={icon.kind} icon={icon} />
      ))}
      {/* 播放头 */}
      <div style={{position: 'absolute', left: s.playheadX - 1.5, top: GEO.ruler.y + 6, width: 3, height: 350, background: C.red}} />
      <svg width={28} height={30} style={{position: 'absolute', left: s.playheadX - 14, top: GEO.ruler.y - 6}}>
        <path d="M3 3 H25 V16 L14 27 L3 16 Z" fill={C.red} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
      {/* 关键帧标记 */}
      {Array.from({length: s.keyMarkers}, (_, i) => {
        const p = prog(frame, T.playback + 8 + i * 7.5, 8, easeOutBack);
        return (
          <svg key={i} width={30} height={26} style={{position: 'absolute', left: timeToX(i * 2) - 15, top: GEO.markers.y, transform: `scale(${p})`}}>
            <path d="M3 3 H27 L15 23 Z" fill={C.yellow} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
          </svg>
        );
      })}
    </>
  );
};

/** 编辑器窗口外框和标题栏 */
export const TitleBar: React.FC<{s: EditorState; frame: number}> = ({s, frame}) => {
  const {x, y, w} = GEO.window;
  const ex = GEO.exportBtn;
  const press = frame >= T.exportClick && frame < T.exportClick + 6 ? 0.9 : 1;
  const exporting = s.exportProgress > 0 && !s.done;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y + GEO.titleH, width: w, height: 3, background: C.ink}} />
      <div style={{position: 'absolute', left: 80, top: 34, fontFamily: FONT_UI, fontSize: 32, color: C.ink}}>
        <span style={{color: C.red}}>✂</span> claude_edit_FINAL_final(2).mp4
      </div>
      <div style={{...box(870, 34, 180, 46, {borderRadius: 10, borderWidth: 2.5}), fontFamily: FONT_UI, fontSize: 26, color: C.ink, textAlign: 'center', lineHeight: '40px'}}>
        {s.timecode}
      </div>
      <div style={{...box(1523, 36, 92, 44, {borderRadius: 10, borderWidth: 2.5, background: '#F3EFE6'}), fontFamily: FONT_UI, fontSize: 24, color: C.ink, textAlign: 'center', lineHeight: '38px'}}>
        1080p
      </div>
      {(exporting || s.done) && (
        <div style={{...box(1245, 42, 260, 32, {borderRadius: 10, borderWidth: 2.5, background: '#F3EFE6', overflow: 'hidden'})}}>
          <div style={{width: `${s.exportProgress * 100}%`, height: '100%', background: C.yellow}} />
          <div style={{position: 'absolute', inset: 0, textAlign: 'center', fontFamily: FONT_UI, fontSize: 20, lineHeight: '26px', color: C.ink}}>{Math.round(s.exportProgress * 100)}%</div>
        </div>
      )}
      <div
        style={{
          ...box(ex.x, ex.y, ex.w, ex.h, {borderRadius: 12, background: s.done ? '#6CC57A' : C.teal}),
          transform: `scale(${press * (1 + Math.sin(prog(frame, T.exportDone, 8) * Math.PI) * 0.12)})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '3px 4px 0 rgba(43,35,32,0.18)',
        }}
      >
        <span style={popTextStyle(28, C.white)}>{s.done ? 'DONE ✓' : 'EXPORT'}</span>
      </div>
    </>
  );
};
