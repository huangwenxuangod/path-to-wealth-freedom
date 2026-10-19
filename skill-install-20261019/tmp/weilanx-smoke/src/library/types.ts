import type React from 'react';

/** [音效名, 帧, 音量] */
export type SfxCue = [string, number, number];

export interface SceneDef {
  from: number; // 场景开始帧
  title: string; // 顶部章节标签
  C: React.FC<{f: number}>;
  sfx: SfxCue[];
}
