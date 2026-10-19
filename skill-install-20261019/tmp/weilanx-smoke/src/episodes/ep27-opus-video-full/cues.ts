import raw from './cues.json';
import {makeCues} from '../../library/cues';

/** 剪辑后口播 1.12 倍速版 247.33 秒（第08期-opus5-5做视频/02-剪辑/剪辑后口播-1.12x.mp4；人声和出镜视频都从第 0 秒开始） */
export const VOICE_SECONDS = 247.7;
export const {CUES, DURATION, cf, ce, cw, cueAt} = makeCues(raw, VOICE_SECONDS);
