import React from 'react';
import {easeOutBack, prog} from '../../../library/anim';
import type {Tab} from '../lib/state';
import {GEO} from '../lib/timeline';
import {box, C, FONT_POP, FONT_UI, wobblyRadius} from '../../../library/theme';
import {TextStyleIcon, TransitionIcon, type TransitionKind} from './Icons';
import {SceneArt} from './SceneArt';

const TABS: {id: Tab; label: string; x: number; w: number}[] = [
  {id: 'media', label: 'Media', x: 14, w: 104},
  {id: 'transitions', label: 'Transitions', x: 126, w: 106},
  {id: 'text', label: 'Text', x: 240, w: 104},
];

const COLS = [20, 190];
const ROWS = [68, 211, 353];
const CARD_W = 150;
const CARD_H = 128;

const Card: React.FC<{i: number; appear: number; children: React.ReactNode; label?: string; dashed?: boolean}> = ({i, appear, children, label, dashed}) => {
  const s = prog(appear, i * 2, 8, easeOutBack);
  return (
    <div
      style={{
        ...box(COLS[i % 2], ROWS[Math.floor(i / 2)], CARD_W, CARD_H, {
          borderRadius: wobblyRadius(8),
          borderWidth: 2.5,
          background: dashed ? '#F6F2EA' : C.white,
          overflow: 'hidden',
          transform: `scale(${s})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }),
      }}
    >
      {children}
      {label && <div style={{fontFamily: FONT_UI, fontSize: 19, color: C.ink, marginTop: 2}}>{label}</div>}
    </div>
  );
};

const MEDIA = [
  {scene: 'sunrise', label: 'sunrise.mp4'},
  {scene: 'coffee', label: 'coffee.mp4'},
  {scene: 'cat', label: 'cat.mov'},
  {scene: 'dance', label: 'dance.mp4'},
] as const;

const TRANSITIONS: {kind: TransitionKind; label: string}[] = [
  {kind: 'whoosh', label: 'Whoosh'},
  {kind: 'spin', label: 'Spin'},
  {kind: 'glitch', label: 'Glitch'},
  {kind: 'zoom', label: 'Zoom'},
  {kind: 'slide', label: 'Slide'},
  {kind: 'fade', label: 'Fade'},
];

const TEXTS = [
  {kind: 'pop', label: 'Pop'},
  {kind: 'bubble', label: 'Bubble'},
  {kind: 'neon', label: 'Neon'},
] as const;

export const MediaPanel: React.FC<{tab: Tab; tabSwitchT: number; frame: number; spinTaken: boolean}> = ({tab, tabSwitchT, frame, spinTaken}) => {
  const {x, y, w, h} = GEO.media;
  const appear = tab === 'media' ? 99 : tabSwitchT;
  return (
    <div style={box(x, y, w, h)}>
      {TABS.map((t) => {
        const active = t.id === tab;
        const bump = active ? 1 + Math.sin(prog(tabSwitchT, 0, 8) * Math.PI) * 0.12 : 1;
        return (
          <div
            key={t.id}
            style={{
              ...box(t.x, 12, t.w, 40, {
                borderRadius: 10,
                borderWidth: 2.5,
                background: active ? C.yellow : '#F3EFE6',
                transform: `scale(${bump})`,
              }),
              fontFamily: FONT_UI,
              fontSize: t.id === 'transitions' ? 20 : 24,
              color: C.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t.label}
          </div>
        );
      })}
      {tab === 'media' && (
        <>
          {MEDIA.map((m, i) => (
            <Card key={m.label} i={i} appear={appear} label={m.label}>
              <div style={{borderBottom: `2.5px solid ${C.ink}`}}>
                <SceneArt scene={m.scene} w={CARD_W - 5} h={92} t={frame} />
              </div>
            </Card>
          ))}
          {[4, 5].map((i) => (
            <Card key={i} i={i} appear={appear} dashed>
              <div style={{fontFamily: FONT_UI, fontSize: 40, color: '#B0A698', marginTop: 36}}>+</div>
            </Card>
          ))}
        </>
      )}
      {tab === 'transitions' &&
        TRANSITIONS.map((t, i) => (
          <Card key={t.kind} i={i} appear={appear} label={t.label}>
            <div style={{marginTop: 18, opacity: t.kind === 'spin' && spinTaken ? 0.25 : 1}}>
              <TransitionIcon kind={t.kind} size={62} />
            </div>
          </Card>
        ))}
      {tab === 'text' &&
        TEXTS.map((t, i) => (
          <Card key={t.kind} i={i * 2} appear={appear} label={t.label}>
            <div style={{marginTop: 22}}>
              <TextStyleIcon kind={t.kind} size={50} font={FONT_POP} />
            </div>
          </Card>
        ))}
    </div>
  );
};
