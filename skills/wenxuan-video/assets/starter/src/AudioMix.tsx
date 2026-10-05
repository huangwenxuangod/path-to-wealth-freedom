import React from 'react';
import {Audio,Sequence,staticFile,useVideoConfig} from 'remotion';
import spec from '../data/storyboard.json';
import {smooth} from './primitives';
type AudioSpec={voice:string|null;music:string|null;voiceIntervals:number[][];musicGain:number;duckGain:number;sfx:{at:number;duration:number;file:string;gain:number}[]};
export const AudioMix:React.FC=()=>{
 const {fps}=useVideoConfig(),a=spec.audio as AudioSpec;
 const musicVolume=(f:number)=>{const t=f/fps;const fade=smooth(t/.6)*smooth((spec.duration-t)/.8);const duck=a.voiceIntervals.reduce((v,[s,e])=>Math.max(v,smooth((t-s+.2)/.2)*smooth((e+.25-t)/.25)),0);return fade*(a.musicGain*(1-duck)+a.duckGain*duck);};
 return <>{a.voice&&<Audio src={staticFile(a.voice)} volume={1}/>}{a.music&&<Audio src={staticFile(a.music)} volume={musicVolume}/>}{a.sfx.map((cue,i)=><Sequence key={i} from={Math.round(cue.at*fps)} durationInFrames={Math.round(cue.duration*fps)}><Audio src={staticFile(cue.file)} volume={cue.gain}/></Sequence>)}</>;
};
