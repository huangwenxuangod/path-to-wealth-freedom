import React from 'react';
import {prog} from '../../../library/anim';
import type {EditorState} from '../lib/state';
import {GEO, T} from '../lib/timeline';
import {box} from '../../../library/theme';
import {AdjustPanel} from './AdjustPanel';
import {MediaPanel} from './MediaPanel';
import {Phone} from './Phone';
import {Timeline, TitleBar} from './Timeline';

/** 整个剪辑软件界面，世界坐标 1920×1080 */
export const EditorUI: React.FC<{s: EditorState; frame: number}> = ({s, frame}) => {
  const {x, y, w, h} = GEO.window;
  const ph = GEO.phone;
  const spinIn = frame >= T.dropSpin - 16 && frame < T.dropSpin + 10 ? prog(frame, T.dropSpin - 16, 14) : 1;
  return (
    <>
      <div style={box(x, y, w, h, {borderRadius: 26, background: '#F7F3EA', boxShadow: '8px 10px 0 rgba(43,35,32,0.08)'})} />
      <TitleBar s={s} frame={frame} />
      <MediaPanel tab={s.tab} tabSwitchT={s.tabSwitchT} frame={frame} spinTaken={frame >= T.grabSpin} />
      <Phone
        x={ph.x}
        y={ph.y}
        w={ph.w}
        h={ph.h}
        scene={s.phone}
        sceneT={s.phoneSceneT}
        frame={frame}
        shake={s.phoneShake}
        sparkle={s.sliders.sparkle}
        spinIn={spinIn}
        exportProgress={s.exportProgress}
        caption={{words: ['WAIT', 'FOR', 'IT'], t: s.captionT, size: 36}}
      />
      <AdjustPanel sliders={s.sliders} shakeMax={s.shakeMax} frame={frame} />
      <Timeline s={s} frame={frame} />
    </>
  );
};
