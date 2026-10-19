import raw from './cues.json';
import {makeCues} from '../../library/cues';

export {FPS} from '../../library/cues';
export type {Cue} from '../../library/cues';

export const VOICE_SECONDS = 166.667;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
