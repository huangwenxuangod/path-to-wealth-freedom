import React from 'react';
import {boil} from '../../../library/anim';
import type {EditorState} from '../lib/state';
import {GEO} from '../lib/timeline';
import {box, C, FONT_UI} from '../../../library/theme';

type Key = keyof EditorState['sliders'];

const ROWS: {key: Key; label: string}[] = [
  {key: 'sparkle', label: 'Sparkle'},
  {key: 'shake', label: 'Shake'},
  {key: 'zoom', label: 'Zoom punch'},
  {key: 'speed', label: 'Speed'},
];

export const AdjustPanel: React.FC<{sliders: EditorState['sliders']; shakeMax: boolean; frame: number}> = ({sliders, shakeMax, frame}) => {
  const {x, y, w, h} = GEO.adjust;
  return (
    <div style={box(x, y, w, h)}>
      <div style={{position: 'absolute', left: 22, top: 16, fontFamily: FONT_UI, fontSize: 34, color: C.ink}}>
        Adjust <span style={{color: C.yellow, WebkitTextStroke: `1.5px ${C.ink}`}}>✦</span>
      </div>
      {ROWS.map(({key, label}) => {
        const v = sliders[key];
        const trackY = GEO.sliderY[key] - y;
        const red = key === 'shake' && shakeMax;
        const value = key === 'speed' ? '1.0x' : red ? 'MAX!!' : `${Math.round(v * 100)}%`;
        const jx = red ? boil(frame * 5, 21, 2.5) : 0;
        return (
          <React.Fragment key={key}>
            <div style={{position: 'absolute', left: 26, top: trackY - 48, fontFamily: FONT_UI, fontSize: 26, color: C.ink}}>{label}</div>
            <div style={{position: 'absolute', right: 26, top: trackY - 48, fontFamily: FONT_UI, fontSize: 26, color: red ? C.red : C.ink, transform: `translateX(${jx}px)`}}>{value}</div>
            <div
              style={{
                position: 'absolute',
                left: GEO.sliderX0 - x,
                top: trackY - 7,
                width: GEO.sliderW,
                height: 14,
                borderRadius: 8,
                border: `2.5px solid ${C.ink}`,
                background: '#EFEAE0',
                overflow: 'hidden',
                boxSizing: 'border-box',
                transform: `translateX(${jx}px)`,
              }}
            >
              <div style={{width: `${v * 100}%`, height: '100%', background: red ? C.red : C.teal}} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: GEO.sliderX0 - x + v * GEO.sliderW - 15 + jx,
                top: trackY - 15,
                width: 30,
                height: 30,
                borderRadius: 15,
                border: `3px solid ${C.ink}`,
                background: C.white,
                boxSizing: 'border-box',
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
