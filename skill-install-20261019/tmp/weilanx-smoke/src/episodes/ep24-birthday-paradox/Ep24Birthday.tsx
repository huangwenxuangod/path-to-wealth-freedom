import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {RedStamp} from '../../library/gilded/props';
import {BookCite, Dust, GCaption, GildedBg, Grain, YearHeader} from '../../library/gilded/stage';
import {G, GF, goldText} from '../../library/gilded/theme';
import {CalendarRing, ChordFn, CX, CY, R, RingCam, ringPose} from './ring';
import {CenterCount, Crowd, Crypto, History, HitNote, OnePair, OpeningShot, PairsChart, ProbCurve, ProductPanel, Smash, vis, WorldCup} from './scenes';
import {ANCHOR, ANCHOR2, CUES, cueEnd, cueStart, DARK_FROM, DARK_FROM2, DAYS, DURATION, fb, FREEZE, HALF_BARS, HIT, HIT2, multipliedAt, pairAt, pairs, SFX, SHOTS, TERM, TERM2, YOU} from './timeline';

/**
 * ep24 生日悖论（无口播，约 2 分 05 秒）：锚词「巧合」。
 * 整片是同一个世界——一年 365 天的金色日历环：开场从「你」的光点拉远；第一个重拍砸出「巧合」，撞上的两点变朱红；
 * 之后环在各段之间推拉让位（连线、连乘、曲线、铺满 365 天、缩进世界杯的 32 个小环）；
 * 配乐回落段转成冷色人群，102.52 秒配乐整段重新进来时砸出「必然」；最后大字缩回「你」的光点抛问题。
 */

const ALL = pairs(DAYS.length);

/** 每段里环该怎么画 */
const ringFor = (f: number): React.ReactNode => {
  // 第一个重拍 → 连线段：撞上的一对朱红；连线逐对画出，第 12 小节整体提亮
  if (f < SHOTS.product[0]) {
    const [ha] = SHOTS.hit;
    const [wa] = SHOTS.web;
    const dim = f < wa ? 0.28 + 0.72 * clamp01((f - (wa - 20)) / 20) : 1;
    const boost = 1 + 1.4 * vis(f, fb(12), SHOTS.web[1] + 10, 14, 14);
    const chord: ChordFn | undefined = f >= wa ? (_i, _j, k) => ({p: clamp01((f - pairAt(k)) / 10), o: 0.2 * boost}) : undefined;
    return <CalendarRing f={f} hot={clamp01((f - ha) / 10)} chord={chord} youLabel={1} dim={dim} />;
  }
  // 连乘段：人按乘到的顺序亮起；曲线段：23 人都在
  if (f < SHOTS.drawer[0]) {
    const k = multipliedAt(f);
    const show = f < SHOTS.curve[0] ? (i: number) => (i < k ? 1 : 0.12) : () => 1;
    return <CalendarRing f={f} show={show} youLabel={1} />;
  }
  // 铺满 365 天，第 366 人落下（这一段唯一的朱红）
  if (f < SHOTS.worldcup[0] + 40) {
    const year = clamp01((f - fb(23) - 10) / (fb(24) - fb(23) - 24));
    const extra = clamp01((f - fb(24) - 6) / 24);
    return <CalendarRing f={f} show={() => 0.35} year={year} extra={extra} />;
  }
  // 只想到自己（22 条从「你」出发的线）→ 两两配对（253 条）
  const youChord: ChordFn = (i, j, k) => {
    if (i === YOU) return {p: clamp01((f - fb(35) - j * 1.2) / 10), o: 0.85, color: G.goldBright, w: 1.6};
    return {p: clamp01((f - fb(35) - 46 - (k / ALL) * 30) / 10), o: 0.16};
  };
  return <CalendarRing f={f} chord={youChord} youLabel={1} />;
};

export const Ep24Birthday: React.FC = () => {
  const f = useCurrentFrame();
  // 两次收暗：重拍前 ~0.75 秒压暗到 94% 黑，最后 3 帧静止，重拍那一帧放开
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const dark = Math.max(dark1, dark2);
  const pose = ringPose(f);
  const [ra, rb] = SHOTS.redefine;
  const [cla] = SHOTS.close;
  const closeT = f - cla;
  const shrink = clamp01(closeT / 36);
  // 配乐回落段转冷色
  const cool = vis(f, SHOTS.crowd[0], HIT2 + 20, 30, 30);
  const crowdF = Math.min(f, HIT2 - FREEZE);
  const k = multipliedAt(f);
  const webCount = Math.min(ALL, Math.max(0, Math.floor(((f - pairAt(0)) / (pairAt(ALL - 1) - pairAt(0))) * ALL) + 1));
  const yearCount = Math.round(365 * clamp01((f - fb(23) - 10) / (fb(24) - fb(23) - 24)));
  const has366 = f >= fb(24) + 24;
  const youOnly = f < fb(35) + 46;

  return (
    <AbsoluteFill style={{background: G.bg}}>
      <Audio src={staticFile('audio/ep24-birthday-paradox/bgm.wav')} />
      <Audio src={staticFile('audio/ep24-birthday-paradox/room.wav')} volume={1.4} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={60}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <GildedBg f={f} glow={[50, 42]} />
      {cool > 0 ? (
        <AbsoluteFill style={{opacity: cool}}>
          <GildedBg f={f} tone="cool" glow={[50, 42]} />
        </AbsoluteFill>
      ) : null}
      <Dust f={f} />

      {f < HIT ? <OpeningShot f={f} /> : null}

      {/* 重拍之后的日历环（同一个世界，在各段之间推拉）；环心计数跟着环一起走 */}
      {f >= HIT && f < SHOTS.pairs[1] && pose.o > 0 ? (
        <RingCam pose={pose}>
          {ringFor(f)}
          {f >= SHOTS.web[0] && f < SHOTS.product[0] + 10 ? (
            <div style={{opacity: vis(f, SHOTS.web[0], SHOTS.product[0] + 10, 12, 14)}}>
              <CenterCount value={String(webCount)} unit="对" />
            </div>
          ) : null}
          {f >= SHOTS.product[0] && f < SHOTS.curve[0] ? (
            <div style={{opacity: vis(f, SHOTS.product[0] + 10, SHOTS.curve[0], 14, 14)}}>
              <CenterCount value={String(k)} unit="人" />
            </div>
          ) : null}
          {f >= SHOTS.drawer[0] && f < SHOTS.worldcup[0] + 20 ? (
            <div style={{opacity: vis(f, SHOTS.drawer[0] + 14, SHOTS.worldcup[0] + 20, 14, 18)}}>
              <CenterCount value={has366 ? '366' : String(yearCount)} unit="人" note={has366 ? '第 366 人，一定撞上' : undefined} />
            </div>
          ) : null}
          {f >= SHOTS.pairs[0] && f < fb(36) + 10 ? (
            <div style={{opacity: vis(f, fb(35), fb(36) + 10, 14, 14)}}>
              <CenterCount value={youOnly ? '22' : String(ALL)} unit="对" note={youOnly ? '只算和你撞的' : '两两之间'} size={110} />
            </div>
          ) : null}
        </RingCam>
      ) : null}
      {f >= SHOTS.web[0] && f < SHOTS.product[0] ? <OnePair f={f} a={YOU} b={5} /> : null}

      {/* 第一个重拍：锚词砸出 */}
      {f >= HIT && f < SHOTS.hit[1] + 12 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (SHOTS.hit[1] - 12)) / 18)}}>
          <Smash f={f} at={HIT} text={ANCHOR} size={220} sub={TERM} />
          <HitNote f={f} />
        </AbsoluteFill>
      ) : null}

      {/* 连乘：环让到左边 */}
      {f >= SHOTS.product[0] && f < SHOTS.product[1] + 12 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.product[0] + 8, SHOTS.product[1] + 12, 14, 14)}}>
          <ProductPanel f={f} />
        </AbsoluteFill>
      ) : null}
      {/* 曲线：同一个位置接着画 */}
      {f >= SHOTS.curve[0] && f < SHOTS.curve[1] + 12 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.curve[0] + 6, SHOTS.curve[1] + 12, 14, 16)}}>
          <div style={{position: 'absolute', left: 900, top: 190}}>
            <ProbCurve f={f} w={820} h={520} />
          </div>
        </AbsoluteFill>
      ) : null}
      {f >= SHOTS.worldcup[0] && f < SHOTS.worldcup[1] + 12 ? <WorldCup f={f} /> : null}
      {f >= fb(29) && f < SHOTS.worldcup[1] + 12 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - SHOTS.worldcup[1] + 6) / 16)}}>
          <div style={{position: 'absolute', left: 1764, top: 700}}>
            <RedStamp f={f} at={fb(29) + 10} text="一半" size={90} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 1939：年份抬头从 2014 翻回 1939，右上文献引用 */}
      {f >= SHOTS.history[0] - 6 && f < SHOTS.history[1] + 12 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.history[0] - 6, SHOTS.history[1] + 12, 12, 18)}}>
          <YearHeader f={f} at={SHOTS.history[0] - 6} year="1939" prev="2014" rollAt={SHOTS.history[0] + 4} caption="伊斯坦布尔 · 冯·米塞斯" />
          <BookCite f={f} at={SHOTS.history[0]} original="Über Aufteilungs- und Besetzungswahrscheinlichkeiten" title="论分配与占位的概率" meta="Richard von Mises · 1939" seal="首发" />
          <History f={f} />
        </AbsoluteFill>
      ) : null}
      {f >= SHOTS.crypto[0] && f < SHOTS.crypto[1] + 12 ? <Crypto f={f} /> : null}

      {/* 平方增长：环让到左边，右边两条线 */}
      {f >= fb(36) && f < SHOTS.pairs[1] + 12 ? (
        <AbsoluteFill style={{opacity: vis(f, fb(36) + 8, SHOTS.pairs[1] + 6, 14, 16)}}>
          <div style={{position: 'absolute', left: 900, top: 200}}>
            <PairsChart f={f} w={820} h={520} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 配乐回落段：冷色人群；1989 年那句话；收暗后静止 */}
      {f >= SHOTS.crowd[0] - 10 && f < HIT2 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.crowd[0] - 10, HIT2 + 1, 24, 1)}}>
          <Crowd f={crowdF} from={SHOTS.crowd[0] + 20} every={14} alpha={1 - 0.6 * vis(f, fb(44), fb(47), 20, 20)} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: vis(f, fb(44) + 10, fb(47), 22, 20)}}>
            <div style={{fontFamily: GF.latinItalic, fontSize: 42, color: G.ivory, lineHeight: 1.4}}>
              “With a large enough sample,
              <br />
              any outrageous thing is likely to happen.”
            </div>
            <div style={{fontFamily: GF.cn, fontSize: 22, color: G.ivoryFaint, marginTop: 26, letterSpacing: 2}}>
              —— Persi Diaconis & Frederick Mosteller · <span style={{fontFamily: GF.num}}>1989</span>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 第二个爆点：必然 */}
      {f >= HIT2 && f < SHOTS.hit2[1] + 12 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (SHOTS.hit2[1] - 12)) / 18)}}>
          <Smash f={f} at={HIT2} text={ANCHOR2} size={190} sub={TERM2} ring={1150} flash={0.85} />
        </AbsoluteFill>
      ) : null}

      {/* 暖色人群：巧合每秒都在发生 */}
      {f >= SHOTS.world[0] - 10 && f < SHOTS.world[1] + 14 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.world[0] - 10, SHOTS.world[1] + 14, 24, 24)}}>
          <Crowd f={f} from={SHOTS.world[0] - 40} every={4} life={34} />
        </AbsoluteFill>
      ) : null}

      {/* 锚词重新出现：这次是理解；进入结尾时缩回「你」的那个光点 */}
      {f >= ra ? (
        <AbsoluteFill style={{opacity: vis(f, ra, rb + 30, 14, 30)}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', transform: `scale(${1 - 0.9 * easeInOut(shrink)})`, transformOrigin: '50% 120px'}}>
            <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 160, letterSpacing: 24, ...goldText(0.9)}}>{ANCHOR}</span>
          </div>
        </AbsoluteFill>
      ) : null}
      {f >= cla ? (
        <AbsoluteFill style={{opacity: clamp01((closeT - 20) / 20)}}>
          <div style={{position: 'absolute', left: CX - 200, top: CY - 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,220,160,0.3) 0%, rgba(243,220,160,0.06) 45%, rgba(0,0,0,0) 70%)', opacity: 0.85 + 0.15 * Math.sin(f / 9)}} />
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={G.goldFaint} strokeWidth={1} opacity={clamp01((closeT - 30) / 30)} />
            <circle cx={CX} cy={CY} r={10} fill={G.goldBright} style={{filter: `drop-shadow(0 0 12px ${G.goldBright})`}} />
          </svg>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />

      {CUES.map(([bar, zh, en], i) => {
        const at = cueStart(i);
        // 话说一半的两句（重拍前）随收暗一起退场，把空白留给大字
        const out = bar === HALF_BARS[0] ? DARK_FROM : bar === HALF_BARS[1] ? DARK_FROM2 : cueEnd(i) - 12;
        if (f < at - 2 || f > out + 14) return null;
        return <GCaption key={i} f={f} at={at} out={out} text={zh} en={en} y={950} size={40} perChar={1} />;
      })}

      {/* 结尾 1 秒淡到黑 */}
      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 30)) / 30), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};
