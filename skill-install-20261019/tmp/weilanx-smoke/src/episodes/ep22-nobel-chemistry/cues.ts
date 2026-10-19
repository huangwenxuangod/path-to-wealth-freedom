import raw from './cues.json';
import {makeCues} from '../../library/cues';

export const VOICE_SECONDS = 64.6;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
