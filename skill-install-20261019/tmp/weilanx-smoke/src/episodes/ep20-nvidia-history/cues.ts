import raw from './cues.json';
import {makeCues} from '../../library/cues';

export const VOICE_SECONDS = 154.0;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
