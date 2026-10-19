export interface Cue {
  i: number;
  start: number;
  end: number;
  text: string;
}

export const FPS = 30;

export type CueAt = (frame: number) => Cue | null;

/** 根据一份字幕数据生成这套视频专用的时间工具 */
export function makeCues(raw: Cue[], voiceSeconds: number) {
  const CUES = raw;
  const DURATION = Math.ceil(voiceSeconds * FPS);

  const get = (n: number) => {
    const c = CUES[n - 1];
    if (!c) throw new Error(`cue ${n} does not exist`);
    return c;
  };

  /** 第 n 句字幕开始的帧 */
  const cf = (n: number) => Math.round(get(n).start * FPS);
  /** 第 n 句字幕结束的帧 */
  const ce = (n: number) => Math.round(get(n).end * FPS);

  /** 估算第 n 句里某个短语开始的帧：按字符位置在该句时长内线性插值 */
  const cw = (n: number, phrase: string) => {
    const c = get(n);
    const idx = c.text.indexOf(phrase);
    if (idx < 0) throw new Error(`"${phrase}" not in cue ${n}: ${c.text}`);
    return Math.round((c.start + ((c.end - c.start) * idx) / c.text.length) * FPS);
  };

  /** 当前帧正在说的那句（句间空隙里延续上一句最多 0.4s） */
  const cueAt: CueAt = (frame) => {
    const t = frame / FPS;
    for (let k = 0; k < CUES.length; k++) {
      const c = CUES[k];
      const next = CUES[k + 1];
      const hold = Math.min(c.end + 0.4, next ? next.start : Infinity);
      if (t >= c.start && t < hold) return c;
    }
    return null;
  };

  return {CUES, DURATION, cf, ce, cw, cueAt};
}
