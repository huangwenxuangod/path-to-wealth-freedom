import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes, rand} from '../../library/anim';
import {DotField} from '../../library/gilded/charts';
import {RedStamp} from '../../library/gilded/props';
import {BookCite, Dust, GCaption, GildedBg, Grain, Smash, YearHeader} from '../../library/gilded/stage';
import {G, GF, goldText} from '../../library/gilded/theme';
import {Bars3, beatPulse, BigNumber, BrainMap, GoldHeart, MonthRing, vis} from './scenes';
import {
  ANCHOR,
  ANCHOR2,
  CUES,
  cueEnd,
  cueStart,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  fbt,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  OPEN_HITS_1,
  RELAY_AT,
  SFX,
  SHOTS,
  SURVEY_PCT,
  TERM,
  TERM2,
} from './timeline';

/**
 * ep32 热恋会过期，但爱不会（暗金文献风，无口播）。
 * 一颗金心贯穿全片：开场在中央跟着配乐重音跳动，18 个月的环走完后变冷、收暗，17.45 秒砸出「过期」；
 * 1999 年的实验里它缩到左边、盖上「过期」的章；2012 年回到中央，再交给一张大脑示意图，
 * 回落段 11 下硬拍点亮 11 个区域，102.52 秒砸出「依恋」；结尾金心重新暖起来、重新跳。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

/** 金心在每一段的位置、大小、冷暖、透明度 */
const heartPose = (f: number) => {
  const x = keyframes(f, [
    [SHOTS.hit[1], 960],
    [SHOTS.pisa[0] + 20, 330],
    [SHOTS.follow[1], 330],
    [SHOTS.y2012[0] + 30, 960],
  ]);
  const y = keyframes(f, [
    [SHOTS.hit[1], 470],
    [SHOTS.pisa[0] + 20, 470],
    [SHOTS.follow[1], 470],
    [SHOTS.y2012[0] + 30, 300],
    [SHOTS.end[0], 430],
  ]);
  const size = keyframes(f, [
    [SHOTS.hit[1], 1],
    [SHOTS.pisa[0] + 20, 0.6],
    [SHOTS.follow[1], 0.6],
    [SHOTS.y2012[0] + 30, 0.55],
    [SHOTS.end[0], 1.05],
  ]);
  // 冷暖：开场暖，第 20 拍起慢慢变冷；1999 段半冷；2012 段回暖一点；结尾全暖
  const cool = keyframes(f, [
    [fbt(20), 0],
    [fbt(30), 0.75],
    [SHOTS.follow[0], 0.6],
    [fbt(88), 0.9],
    [SHOTS.y2012[0] + 30, 0.4],
    [SHOTS.end[0], 0.3],
    [fbt(232), 0],
  ]);
  let o = 0;
  if (f < HIT) o = 1;
  else if (f < SHOTS.brain[0]) o = clamp01((f - SHOTS.pisa[0]) / 16);
  if (f >= SHOTS.y2012[1] - 14 && f < SHOTS.end[0]) o = 1 - clamp01((f - (SHOTS.y2012[1] - 14)) / 14);
  if (f >= SHOTS.end[0]) o = clamp01((f - SHOTS.end[0]) / 20);
  return {x, y, size, cool, o};
};

/** 心跳的拍子：开场四连 + 第 136 拍（VTA 亮）+ 结尾第 232–235 拍 + 结尾段每一拍轻轻跳 */
const BEATS = [...OPEN_HITS_1.map(fbt), ...[232, 233, 234, 235].map(fbt), ...Array.from({length: 18}, (_, i) => fbt(236 + i))];

export const Ep32Love: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const hp = heartPose(ff);
  // 18 个月的环：第 9 拍起走，开场第二组四连（11/13/15/16）各跳一大步，第 16 拍走完
  const ringP = keyframes(ff, [
    [fbt(9), 0],
    [fbt(11), 0.18],
    [fbt(13), 0.45],
    [fbt(15), 0.75],
    [fbt(16), 1],
  ]);

  return (
    <AbsoluteFill style={{background: G.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep32-love-lasts/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={file.endsWith('room.wav') ? DURATION : 75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <GildedBg f={ff} glow={[50, 44]} tone={inShot(f, SHOTS.brain) || inShot(f, SHOTS.build) ? 'cool' : 'warm'} />
      <Dust f={ff} />

      {/* ---------- 贯穿全片的金心 ---------- */}
      {hp.o > 0 && <GoldHeart x={hp.x} y={hp.y} size={hp.size} pulse={beatPulse(ff, BEATS)} cool={hp.cool} opacity={hp.o} />}
      {inShot(f, SHOTS.heart) && <MonthRing x={960} y={470} p={ringP} label={clamp01((ff - fbt(9)) / 8)} opacity={1 - clamp01((ff - fbt(22)) / 30) * 0.6} />}

      {/* ---------- 第一个重拍：过期 ---------- */}
      {inShot(f, SHOTS.hit) && <Smash f={f} at={HIT} text={ANCHOR} size={230} sub={TERM} y={440} />}

      {/* ---------- 1999：20 个人、三根柱 ---------- */}
      {(inShot(f, SHOTS.pisa) || inShot(f, SHOTS.follow)) && (
        <>
          <YearHeader f={f} at={SHOTS.pisa[0]} year="1999" caption="意大利 · 比萨大学" out={SHOTS.follow[1] - 14} />
          <BookCite
            f={f}
            at={SHOTS.pisa[0]}
            original="Alteration of the platelet serotonin transporter in romantic love"
            title="恋爱中血小板血清素转运体的改变"
            meta="Marazziti 等 · Psychological Medicine · 1999"
            out={SHOTS.follow[1] - 14}
          />
          <div style={{position: 'absolute', left: 560, top: 330, opacity: vis(f, fbt(44), SHOTS.follow[1])}}>
            <DotField
              cols={5}
              rows={4}
              gap={56}
              r={10}
              p={clamp01((f - fbt(44)) / 24)}
              color={(i) => (f >= fbt(72) ? (i < 6 ? G.goldBright : 'rgba(239,230,210,0.18)') : G.ivory)}
            />
            <div style={{fontFamily: GF.cn, fontSize: 24, color: G.ivoryDim, textAlign: 'center', marginTop: 12}}>
              {f >= fbt(72) ? '12–18 个月后，复测 6 人' : '20 人 · 坠入爱河不到 6 个月'}
            </div>
          </div>
          <Bars3
            x={1120}
            y={300}
            draw={clamp01((f - fbt(52)) / 20)}
            bars={[
              ['刚热恋', f >= fbt(80) ? 0.55 + 0.45 * clamp01((f - fbt(80)) / 18) : 0.55, f >= fbt(80) ? 'gold' : 'red'],
              ['强迫症', 0.55, 'red'],
              ['对照组', 1, 'ivory'],
            ]}
            note="血小板上的血清素转运体密度 · 柱高为示意"
            opacity={vis(f, fbt(52), SHOTS.follow[1])}
          />
          {f >= fbt(88) && (
            <div style={{position: 'absolute', left: 260, top: 400}}>
              <RedStamp f={f} at={fbt(88)} text="过期" size={140} rot={-12} />
            </div>
          )}
        </>
      )}

      {/* ---------- 2012：21.4 年 ---------- */}
      {inShot(f, SHOTS.y2012) && (
        <>
          <YearHeader f={f} at={SHOTS.y2012[0]} year="2012" prev="1999" rollAt={SHOTS.y2012[0] + 6} caption="美国 · 石溪大学" />
          <BookCite
            f={f}
            at={SHOTS.y2012[0]}
            original="Neural correlates of long-term intense romantic love"
            title="长期强烈爱情的神经基础"
            meta="Acevedo 等 · Social Cognitive and Affective Neuroscience · 2012"
          />
          <BigNumber value="21.4" unit="年" note="17 人（10 女 7 男）· 平均婚龄" y={680} size={180} opacity={vis(f, fbt(120), SHOTS.y2012[1] + 20)} />
        </>
      )}

      {/* ---------- 大脑：VTA → 11 个区域 ---------- */}
      {(inShot(f, SHOTS.brain) || inShot(f, SHOTS.build)) && (
        <>
          <YearHeader f={ff} at={SHOTS.brain[0] - 999} year="2012" caption="美国 · 石溪大学" />
          <BrainMap f={ff} x={400} y={120} draw={clamp01((ff - SHOTS.brain[0]) / 40)} vtaAt={fbt(136)} ghostAt={fbt(144)} regionAt={RELAY_AT} opacity={clamp01((ff - SHOTS.brain[0]) / 16)} />
        </>
      )}

      {/* ---------- 第二个爆点：依恋 ---------- */}
      {inShot(f, SHOTS.hit2) && <Smash f={f} at={HIT2} text={ANCHOR2} size={230} sub={TERM2} y={440} />}

      {/* ---------- 40% ---------- */}
      {inShot(f, SHOTS.survey) && (
        <>
          <YearHeader f={f} at={SHOTS.survey[0]} year="2012" caption="美国 · 274 名已婚者随机调查" />
          <BookCite f={f} at={SHOTS.survey[0]} original="Is long-term love more than a rare phenomenon?" title="长久的爱，只是罕见现象吗？" meta="O’Leary 等 · Social Psychological and Personality Science · 2012" />
          <div style={{position: 'absolute', left: 560, top: 300}}>
            <DotField cols={20} rows={5} gap={40} r={7} p={clamp01((f - fbt(204)) / 30)} color={() => 'rgba(239,230,210,0.35)'} />
          </div>
          <div style={{position: 'absolute', left: 560, top: 300}}>
            <DotField cols={20} rows={5} gap={40} r={8} p={clamp01((f - fbt(216)) / 20)} color={(i) => (GOLD40.has(i) ? G.goldBright : 'rgba(0,0,0,0)')} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: clamp01((f - fbt(216) - 10) / 14)}}>
            <span style={{fontFamily: GF.num, fontSize: 150, ...goldText(0.9)}}>{SURVEY_PCT}%</span>
            <div style={{fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, marginTop: 4}}>结婚 10 年以上 · 自评「非常强烈地相爱」 · 每个点代表 1%</div>
          </div>
        </>
      )}

      {/* ---------- 字幕 ---------- */}
      {CUES.map(([b, cn, en], i) => {
        if (!cn) return null;
        const a = cueStart(i);
        const e = HALF_BEATS.includes(b) ? (b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : cueEnd(i);
        if (f < a - 2 || f > e + 14) return null;
        // 普通句在下一句出来前 12 帧淡完，不和下一句叠在一起；话说一半的句子随收暗退场
        return <GCaption key={i} f={ff} at={a} text={cn} en={en} out={HALF_BEATS.includes(b) ? e : e - 12} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};

/** 100 个点里固定的 40 个（确定性随机挑选） */
const GOLD40 = new Set(
  Array.from({length: 100}, (_, i) => i)
    .sort((a, b) => rand(a * 7 + 3) - rand(b * 7 + 3))
    .slice(0, SURVEY_PCT),
);
