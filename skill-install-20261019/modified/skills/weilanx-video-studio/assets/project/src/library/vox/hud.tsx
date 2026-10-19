import React from 'react';
import {V, VF} from './theme';

/**
 * 屏幕右上角的年份计数器：大字年份 + 一条从 from 到 to 的进度条。
 * bands 是进度条上的浅色区段（比如寒冬、低谷），year 由调用方按口播或相机算好。
 */
export const YearCounter: React.FC<{year: number; from: number; to: number; title: string; bands?: [number, number][]; bandColor?: string}> = ({year, from, to, title, bands = [], bandColor = 'rgba(160,186,206,0.7)'}) => {
  const y = Math.round(Math.max(from, Math.min(to, year)));
  const p = (y - from) / (to - from);
  return (
    <div style={{position: 'absolute', right: 36, top: 28, background: V.ink, padding: '10px 18px 14px', width: 330, boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontFamily: VF.num, fontSize: 76, color: V.paper, lineHeight: 1}}>{y}</div>
        <div style={{fontFamily: VF.heavy, fontSize: 22, color: V.hiSolid, whiteSpace: 'nowrap'}}>{title}</div>
      </div>
      <div style={{position: 'relative', height: 14, marginTop: 10}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 6, height: 3, background: 'rgba(238,237,237,0.4)'}} />
        {bands.map(([a, b]) => (
          <div key={a} style={{position: 'absolute', left: `${((a - from) / (to - from)) * 100}%`, width: `${((b - a) / (to - from)) * 100}%`, top: 3, height: 9, background: bandColor}} />
        ))}
        <div style={{position: 'absolute', left: 0, width: `${p * 100}%`, top: 5, height: 5, background: V.red}} />
        <div style={{position: 'absolute', left: `calc(${p * 100}% - 7px)`, top: 0, width: 14, height: 14, borderRadius: 7, background: V.red, border: `2px solid ${V.paper}`}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: VF.num, fontSize: 18, color: 'rgba(238,237,237,0.6)', marginTop: 4}}>
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
};

/**
 * 按口播算年份：stops 是 [开始帧, 年份, 滚动帧数]，到了开始帧就从上一个年份滚到这一年。
 * 滚动帧数默认 12（快速翻过去），给大一点就是「慢慢走过十几年」。
 */
export const rollYear = (f: number, stops: [number, number, number?][], step: (f: number) => number) => {
  let prev = stops[0][1];
  let cur = prev;
  let at = 0;
  let dur = 12;
  for (const [s, y, d] of stops) {
    if (f < s) break;
    prev = cur;
    cur = y;
    at = s;
    dur = d ?? 12;
  }
  const t = Math.min(1, (step(f) - at) / dur);
  return prev + (cur - prev) * (dur > 12 ? t : 1 - Math.pow(1 - t, 3));
};
