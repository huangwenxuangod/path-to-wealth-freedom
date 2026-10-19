import raw from './cues.json';
import {makeCues} from '../../library/cues';

/** 录制原件 52.5 秒（人声和出镜视频都从第 0 秒开始，口播 1.85–50.47 秒） */
export const VOICE_SECONDS = 52.5;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
