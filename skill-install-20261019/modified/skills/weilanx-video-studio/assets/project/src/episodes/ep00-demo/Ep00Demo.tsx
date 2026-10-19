import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {getBuddy} from './lib/buddy';
import {getCamera} from './lib/camera';
import {getEditorState} from './lib/state';
import {FPS, H, T, W} from './lib/timeline';
import {C} from '../../library/theme';
import {Buddy} from './components/Buddy';
import {EditorUI} from './components/EditorUI';
import {PaperGrain, PopText} from '../../library/fx';
import {Outro} from './components/Outro';

const s = (sec: number) => Math.round(sec * FPS);
const SNIP_Y = 575;

// [音效, 帧, 音量]
const SFX: [string, number, number][] = [
  ['whoosh', T.dropSunrise - 12, 0.5],
  ['pop', T.dropSunrise, 0.6],
  ['click', T.dragCoffee, 0.5],
  ['pop', T.dropCoffee + 6, 0.6],
  ['pop', T.dropRest, 0.5],
  ['pop', T.dropRest + 5, 0.5],
  ['pop', T.dropRest + 10, 0.5],
  ['pop', T.boringLabel, 0.4],
  ['whoosh', T.zoomBoring, 0.35],
  ['snip', T.snip - 1, 0.9],
  ['whoosh', T.snip + 2, 0.4],
  ['pop', T.closeGap + 4, 0.55],
  ['pop', T.muchCleaner, 0.5],
  ['whoosh', T.panLeft, 0.4],
  ['click', T.tabTransitions, 0.6],
  ['click', T.grabSpin, 0.5],
  ['pop', T.dropSpin + 6, 0.6],
  ['whoosh', T.dropSpin - 16, 0.35],
  ['boing', T.trip, 0.7],
  ['pop', T.getUp, 0.4],
  ['whoosh', T.dropWhoosh - 12, 0.4],
  ['pop', T.dropWhoosh, 0.55],
  ['whoosh', T.panCenter, 0.35],
  ['click', T.tabText, 0.6],
  ['pop', T.typeCaption, 0.55],
  ['pop', T.typeCaption + 7, 0.55],
  ['pop', T.typeCaption + 14, 0.6],
  ['pop', T.textClip, 0.4],
  ['whoosh', T.panRight, 0.35],
  ['click', T.reachSparkle + 10, 0.5],
  ['click', T.reachShake + 6, 0.5],
  ['shake', T.shakeMax, 0.7],
  ['pop', T.nobodySaw, 0.5],
  ['whoosh', T.playback + 4, 0.35],
  ['click', T.reachZoom + 6, 0.5],
  ['click', T.exportClick, 0.7],
  ['ding', T.exportDone, 0.7],
  ['whoosh', T.outro, 0.45],
  ['pop', s(24.3), 0.5],
  ['pop', s(24.3) + 7, 0.5],
  ['pop', s(24.3) + 14, 0.5],
  ['confetti', T.confetti, 0.7],
  ['pop', T.nailedIt, 0.7],
  ['pop', T.nailedIt + 7, 0.7],
];

export const Ep00Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getEditorState(frame);
  const cam = getCamera(frame);
  const buddy = getBuddy(frame);
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: '0 0',
          transform: `translate(${W / 2}px, ${H / 2}px) rotate(${cam.rot}deg) scale(${cam.scale}) translate(${-cam.x}px, ${-cam.y}px)`,
        }}
      >
        <EditorUI s={state} frame={frame} />
        <Buddy pose={buddy} />
        <PopText text="SNIP!" x={buddy.x + 110} y={SNIP_Y} t={frame - T.snip} dur={34} size={80} fill={C.yellow} />
        <PopText text="SHAKE: MAX" x={1010} y={260} t={frame - T.shakeMax} dur={T.shakeBack - T.shakeMax} size={62} fill={C.red} rot={-7} jitter={6} />
      </div>
      <Outro frame={frame} />
      <PaperGrain />
      <Audio src={staticFile('audio/ep00-demo/bgm.wav')} volume={0.55} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={s(1.6)} layout="none">
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
