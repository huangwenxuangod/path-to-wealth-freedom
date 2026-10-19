import raw from './cues.json';
import {makeCues} from '../../library/cues';

export const VOICE_SECONDS = 63.3;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
