import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {GlowRoute, RelayChain, routeAt, StationDots, Waypoint} from '../../library/lamplight/charts';
import {DayNightDial, Figure, Flame, Gate, GoldPlaque, GroundRing, Horse, HoofDust, HorseQuota, SayBubble, Scroll, TierCards} from '../../library/lamplight/props';
import {BigGlyph, Disclaimer, Embers, Flash, Narration, NightBg, SourceNote, StatCorner, TitleCard} from '../../library/lamplight/stage';
import {L} from '../../library/lamplight/theme';
import {darkness, FlowDots, MapView, NightRoad} from './scenes';
import {
  ASK_LINE,
  BAR,
  CUES,
  DARK_FROM,
  DARK_FROM2,
  fb,
  fbt,
  FLIP_1,
  FLIP_2,
  FLIP_WORD,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  NEXT_TITLE,
  OPEN_HITS_1,
  PLACES,
  RELAY_AT,
  RELAY_STOPS,
  ROUTE_AN,
  ROUTE_QL,
  ROUTE_ROAD,
  SFX,
  SHOTS,
  TITLE,
} from './timeline';

/**
 * ep28「八百里加急」到底有多快？（灯火史话风，无口播）
 * 镜头全部硬切、卡在拍子上；重拍之后每个小节第一拍画面轻轻一顶（回落段减半），叙述层不跟着顶。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

/** 小节冲击：每小节第一拍放大 1.2%、7 帧回落；两个爆点 4%、10 帧；回落段减半 */
const punch = (f: number) => {
  if (f < HIT) return 0;
  if (f < HIT + 10) return 0.04 * (1 - (f - HIT) / 10);
  if (f >= HIT2 && f < HIT2 + 10) return 0.04 * (1 - (f - HIT2) / 10);
  const k = Math.floor((f / FPS - (17.45 - 8 * BAR)) / BAR);
  const t = f - fb(k);
  const amp = k >= 40 && k < 48 ? 0.006 : 0.012;
  return t >= 0 && t < 7 ? amp * (1 - t / 7) : 0;
};

/** 当前这一屏叙述：从最近一个「另起一屏」的句子开始，到下一屏之前 */
const panelAt = (f: number) => {
  let cur = -1;
  CUES.forEach(([b], i) => {
    if (fbt(b) <= f + 2) cur = i;
  });
  if (cur < 0 || CUES[cur][1] === null) return null;
  let s = cur;
  while (s > 0 && !CUES[s][2]) s--;
  let e = cur + 1;
  while (e < CUES.length && !CUES[e][2] && CUES[e][1] !== null) e++;
  return CUES.slice(s, e).map(([b, text]) => ({b, text: text as string}));
};

/** 开场 800 里示意路上，三站之间的「30 里」标签位置 */
const ROAD_STOPS = [0, 1 / 3, 2 / 3, 1];

export const Ep28Relay: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark = Math.max(darkness(f, DARK_FROM, HIT, FREEZE), darkness(f, DARK_FROM2, HIT2, FREEZE));
  const s = 1 + punch(f);
  const panel = panelAt(ff);
  const half = panel && HALF_BEATS.includes(panel[0].b) ? (panel[0].b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : undefined;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep28-express-relay/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：驿马狂奔 → 倒下 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <NightRoad f={ff} off={Math.min(ff, fbt(7)) * 16 + clamp01((ff - fbt(7)) / (fbt(8) - fbt(7))) * 30} />
            {OPEN_HITS_1.map((b) => (
              <HoofDust key={b} f={ff} at={fbt(b)} x={760} y={900} />
            ))}
            <GroundRing f={ff} at={fbt(8)} x={860} y={905} rx={260} ry={34} color="rgba(225,104,79,0.8)" />
            <Horse
              f={ff}
              x={900}
              y={900}
              scale={1.3}
              torch
              speed={0.62}
              pose={ff >= fbt(7) ? 'fall' : 'run'}
              fall={clamp01((ff - fbt(7)) / (fbt(8) - fbt(7)))}
              color={ff >= fbt(8) ? '#6b625a' : L.figure}
            />
            {ff >= fbt(8) && <Figure f={ff} x={560} y={905} pose="lie" scale={0.8} color="#8c8478" hat />}
            <StatCorner f={ff} at={fbt(0)} label="一匹马 · 一天" value={800} unit="里" dur={8} strike={fbt(8)} />
            <Disclaimer f={ff} text="人物和场面都是示意" />
          </>
        )}

        {/* ---------- 一整条路：每三十里一站 ---------- */}
        {(inShot(f, SHOTS.road) || inShot(f, SHOTS.question)) && (
          <MapView
            cam={[
              keyframes(ff, [
                [fbt(11), 1300],
                [fbt(24), 1330],
                [HIT - FREEZE, 1760],
              ]),
              keyframes(ff, [
                [fbt(11), 800],
                [fbt(24), 790],
                [HIT - FREEZE, 720],
              ]),
              keyframes(ff, [
                [fbt(11), 1.0],
                [fbt(24), 1.05],
                [HIT - FREEZE, 1.5],
              ]),
            ]}
          >
            <RelayChain f={ff} pts={ROUTE_ROAD} stops={ROAD_STOPS} litAt={[fbt(11), fbt(13), fbt(15), fbt(16)]} />
            {ROAD_STOPS.slice(1).map((st, k) => {
              const [x, y] = routeAt(ROUTE_ROAD, (st + ROAD_STOPS[k]) / 2);
              return <Waypoint key={k} f={ff} at={fbt(20) + k * 3} x={x} y={y - 20} label="30 里" side="top" size={40} />;
            })}
          </MapView>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={26} spread={1200} rise={600} seed={3} />
            <TitleCard f={f} at={HIT} kicker="灯火史话 · 古代驿传" title={TITLE} pill="唐 · 宋 · 清" perChar={0.7} />
          </>
        )}

        {/* ---------- 第 1 章：唐六典 ---------- */}
        {inShot(f, SHOTS.liudian) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(9) + 4}
              y={740}
              h={380}
              cols={[{text: '驾部', box: true}, {text: '凡三十里一驿', size: 64, color: L.seal}, {text: '天下凡一千', size: 50}, {text: '六百三十有九所', size: 44}]}
              seal="唐六典"
              cite="《唐六典》卷五 · 尚书兵部 · 驾部郎中"
            />
          </>
        )}
        {inShot(f, SHOTS.net) && (
          <>
            <MapView cam={[1300, 800, keyframes(f, [[fb(12), 0.8], [fb(14), 0.74]])]}>
              <StationDots f={f} n={1639} lightAt={fbt(49)} lightSpread={fbt(54) - fbt(49)} r={3.4} />
            </MapView>
            <StatCorner f={f} at={fbt(50)} label="唐 · 开元年间" value={1639} unit="座" dur={fbt(54) - fbt(50)} />
            <SourceNote f={f} at={fb(12)} text="《唐六典》卷五：天下凡一千六百三十有九所；光点位置为示意" />
          </>
        )}
        {inShot(f, SHOTS.swap) && (
          <>
            <NightBg f={f} floor glow={[50, 74]} />
            <Gate f={f} x={960} y={900} w={300} h={430} label="驿站" open={clamp01((f - fbt(57)) / 10)} />
            <Horse f={f} x={330} y={905} pose="stand" rider={false} color="#8c8478" />
            <Figure f={f} x={690} y={905} pose="point" scale={1.15} seed={3} />
            {f < fbt(60) && <Figure f={f} x={1230} y={905} pose="raise" flip scale={1.15} seed={5} />}
            {(() => {
              const p = clamp01((f - fbt(57)) / (fbt(59) - fbt(57)));
              const e = p * p * (3 - 2 * p);
              const x = 810 + (1190 - 810) * e;
              const y = 690 - Math.sin(p * Math.PI) * 120;
              return f < fbt(60) ? <div style={{position: 'absolute', left: x - 12, top: y - 34, width: 24, height: 68, borderRadius: 8, background: L.gold, boxShadow: `0 0 20px ${L.gold}`, transform: `rotate(${p * 360}deg)`}} /> : null;
            })()}
            <Horse f={f} x={1460 + Math.max(0, f - fbt(60)) * 26} y={905} pose={f >= fbt(60) ? 'run' : 'stand'} torch speed={0.7} />
            <Disclaimer f={f} />
          </>
        )}

        {/* ---------- 第 2 章：赦书日行五百里 ---------- */}
        {inShot(f, SHOTS.sheshu) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(16) + 4}
              y={740}
              h={380}
              cols={[{text: '赦书', box: true}, {text: '赦书日行五百里', size: 52, color: L.seal}, {text: '布告遐迩', size: 56}, {text: '咸使闻知', size: 56}]}
              cite="《唐大诏令集》所收赦文，结尾的固定套语"
            />
          </>
        )}
        {inShot(f, SHOTS.dial) && (
          <>
            <MapView cam={[1260, 820, keyframes(f, [[fb(18), 0.9], [fb(20), 0.96]])]}>
              <GlowRoute f={f} at={fb(18) + 4} dur={fb(20) - fb(18) - 14} pts={ROUTE_QL} fire width={2600} height={1600} />
            </MapView>
            <DayNightDial f={f} at={fb(18)} x={1560} y={600} r={150} p={clamp01((f - fb(18)) / (fb(20) - fb(18) - 8))} caption="一昼夜" />
            <StatCorner f={f} at={fb(18) + 6} label="赦书 · 一昼夜" value={500} unit="里" dur={30} />
          </>
        )}
        {inShot(f, SHOTS.anlushan) && (
          <>
            <MapView cam={[keyframes(f, [[fb(20), 1560], [fb(24), 1460]]), keyframes(f, [[fb(20), 640], [fb(24), 680]]), keyframes(f, [[fb(20), 0.98], [fb(24), 1.02]])]}>
              <Waypoint f={f} at={fbt(80)} x={PLACES.fanyang[0]} y={PLACES.fanyang[1]} kind="fire" label="范阳" side="bottom" />
              <Waypoint f={f} at={fbt(88)} x={PLACES.changan[0]} y={PLACES.changan[1]} kind="city" label="长安" side="left" />
              <GlowRoute f={f} at={fbt(88)} dur={fbt(92) - fbt(88)} pts={ROUTE_AN} fire color={L.red} width={2600} height={1600} />
            </MapView>
            <StatCorner f={f} at={fbt(88)} label="范阳 → 长安" value={2520} unit="里" dur={fbt(92) - fbt(88)} out={fbt(92) - 4} />
            <StatCorner f={f} at={fbt(92)} label="起兵 → 确认" value={6} unit="天" dur={10} color={L.red} />
            <SourceNote f={f} at={fbt(85)} text="《资治通鉴》卷 217：甲子反于范阳，庚午「上闻禄山定反」；距离见《旧唐书·地理志》；路线为示意" />
          </>
        )}

        {/* ---------- 第 3 章：唐律 ---------- */}
        {inShot(f, SHOTS.law) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(24) + 4}
              y={740}
              h={380}
              cols={[{text: '稽程', box: true}, {text: '驿使稽程者', size: 54}, {text: '一日杖八十', size: 54, color: L.seal}, {text: '二日加一等', size: 54}, {text: '罪止徒二年', size: 54, color: L.seal}]}
              seal="唐律"
              cite="《唐律疏议》卷十 · 职制律「驿使稽程」"
            />
            <StatCorner f={f} at={fbt(100)} label="晚 1 天" prefix="杖" value={80} dur={10} color={L.red} out={fbt(104) - 2} />
            <StatCorner f={f} at={fbt(104)} label="晚 2 天" prefix="杖" value={90} from={80} dur={10} color={L.red} out={fbt(108) - 2} />
            <StatCorner f={f} at={fbt(108)} label="最重" prefix="徒" value={2} unit="年" dur={6} color={L.red} />
          </>
        )}
        {inShot(f, SHOTS.hang) && (
          <>
            <MapView cam={[1560, 700, keyframes(f, [[fb(28), 1.1], [fb(30), 1.25]])]}>
              <GlowRoute f={f} at={fb(28) - 999} dur={1} pts={ROUTE_ROAD} width={2600} height={1600} out={fbt(112) + 4} />
              <Waypoint f={f} at={fb(28)} x={1660} y={660} kind="city" label="边城" side="top" color={L.red} />
              {f >= fbt(112) + 6 && f < fbt(117) && <Flame f={f} x={1660} y={640} size={1.4} seed={13} />}
            </MapView>
            <AbsoluteFill style={{background: 'rgba(120,20,10,1)', mixBlendMode: 'multiply', opacity: 0.25 * clamp01((f - fbt(112)) / 20)}} />
            <AbsoluteFill style={{background: '#000', opacity: f >= fbt(117) ? 0.62 : 0}} />
            <BigGlyph f={f} at={fbt(117)} text="绞" size={420} />
            <SourceNote f={f} at={fbt(117) + 6} text="《唐律疏议》卷十：若军务要速……以故陷败户口、军人、城戍者，绞" />
          </>
        )}
        {inShot(f, SHOTS.night) && (
          <>
            <NightRoad f={f} off={(f - fb(30)) * 30} glow={[50, 74]} />
            <Horse f={f} x={960} y={900} scale={1.3} torch speed={0.85} seed={4} />
            <Embers f={f} x={860} y={600} n={18} spread={140} rise={260} seed={9} />
            <Disclaimer f={f} />
          </>
        )}

        {/* ---------- 第 4 章：宋 · 金字牌 ---------- */}
        {inShot(f, SHOTS.plaque) && (
          <>
            <NightRoad f={f} off={0} glow={[70, 60]} />
            <GoldPlaque f={f} at={fbt(128)} x={1500} y={560} gleam={fbt(128) + 2} />
            {(() => {
              const sx = -500 + Math.max(0, f - fbt(133)) * 110;
              return (
                <>
                  {[420, 700, 1010].map((x, i) => {
                    const aside = clamp01((sx + 300 - x) / 120);
                    return <Figure key={i} f={f} x={x} y={930 - aside * 70} scale={0.95} hat flip={i === 1} pose={aside > 0.5 ? 'raise' : 'stand'} seed={i + 2} />;
                  })}
                  {f >= fbt(133) && sx < 2400 && (
                    <div style={{position: 'absolute', left: sx - 520, top: 860, width: 640, height: 26, borderRadius: 13, background: `linear-gradient(90deg, rgba(237,174,80,0), ${L.goldHot})`, boxShadow: `0 0 40px ${L.gold}`}} />
                  )}
                </>
              );
            })()}
            <StatCorner f={f} at={fbt(136)} label="金字牌 · 一天" value={500} unit="余里" dur={14} />
            <SourceNote f={f} at={fbt(133)} text="《梦溪笔谈》卷十一 · 官政一；金字牌样式为示意" />
          </>
        )}

        {/* ---------- 第 4 章：清 · 档位 → 跑死驿马 ---------- */}
        {inShot(f, SHOTS.tiers) && (
          <>
            <NightBg f={f} glow={[50, 66]} />
            <TierCards
              f={f}
              x={250}
              y={430}
              w={440}
              gap={50}
              tiers={[
                {label: '普通公文', value: '按程', note: '照驿站里程走', at: fbt(144) + 4},
                {label: '加急', value: '300 里', note: '每天', color: L.blue, at: fbt(148)},
                {label: '特急', value: '600 里', note: '每天', color: L.red, at: fbt(148) + 8},
              ]}
            />
            <SourceNote f={f} at={fbt(148)} text="据乾隆朝《清会典》《清会典事例》，转引自茅海建《清代的驿站、书信、电报与〈缙绅录〉》" />
          </>
        )}
        {inShot(f, SHOTS.quota) && (
          <>
            <NightRoad f={f} off={Math.min(f - fb(38), 10) * 20} glow={[50, 76]} />
            <Horse
              f={f}
              x={960}
              y={900}
              scale={1.2}
              pose={f >= fbt(152) + 6 ? 'fall' : 'run'}
              fall={clamp01((f - fbt(152) - 6) / 10)}
              color={f >= fbt(152) + 16 ? '#6b625a' : L.figure}
              opacity={1 - clamp01((f - fbt(156) + 6) / 8)}
              torch
            />
            <HorseQuota f={f} at={fbt(156)} x={300} y={880} deadAt={fbt(156) + 10} step={5} />
            <StatCorner f={f} at={fbt(156) + 6} label="贵州驿马 · 每年" prefix="死" value={7} unit="成" dur={30} color={L.red} />
            <SourceNote f={f} at={fbt(156)} text="清代各省驿马每年准倒毙的额度，贵州最高，十分之七；据茅海建，同上" />
          </>
        )}

        {/* ---------- 回落段：北京 → 兰州，11 下硬拍 11 站 ---------- */}
        {(inShot(f, SHOTS.relay) || inShot(f, SHOTS.build)) && (
          <>
            <MapView
              cam={[
                keyframes(ff, [
                  [fb(40), 1640],
                  [RELAY_AT[4], 1480],
                  [RELAY_AT[8], 1180],
                  [RELAY_AT[11], 900],
                  [HIT2, 880],
                ]),
                keyframes(ff, [
                  [fb(40), 440],
                  [RELAY_AT[8], 660],
                  [RELAY_AT[11], 640],
                ]),
                keyframes(ff, [
                  [fb(40), 1.0],
                  [RELAY_AT[11], 1.0],
                  [HIT2 - FREEZE, 1.2],
                ]),
              ]}
            >
              <Waypoint f={ff} at={fbt(160)} x={PLACES.fanyang[0]} y={PLACES.fanyang[1]} kind="city" label="北京" side="right" />
              <Waypoint f={ff} at={RELAY_AT[11] - 4} x={PLACES.lanzhou[0]} y={PLACES.lanzhou[1]} kind="city" label="兰州" side="left" />
              <RelayChain f={ff} pts={ROUTE_QL} stops={RELAY_STOPS} litAt={RELAY_AT} color={L.gold} />
            </MapView>
            <DayNightDial f={ff} at={fbt(165)} x={1700} y={560} r={96} p={(Math.max(0, ff - fbt(165)) / ((RELAY_AT[11] - fbt(165)) / 5.5)) % 1} />
            <StatCorner f={ff} at={fbt(165)} label="六百里加急" prefix="第" value={6} from={1} unit="天" dur={RELAY_AT[11] - fbt(165)} color={L.red} comma={false} y={760} />
            <SourceNote f={ff} at={fbt(160)} text="据茅海建：1791 年乾隆以六百里加急发出谕旨，六天后福康安在兰州收到；路线为示意" />
          </>
        )}

        {/* ---------- 第二个爆点：奇迹 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.5} />
            <Embers f={f} x={960} y={1000} n={30} spread={1400} rise={700} seed={6} />
            <BigGlyph f={f} at={HIT2} text="奇迹" color={L.goldHot} size={300} sub="六百里加急 · 6 天到兰州" />
            <SourceNote f={f} at={HIT2 + 20} text="茅海建：「当时属于奇迹」" />
          </>
        )}

        {/* ---------- 收束：一起在跑 → 电报 → 熄灯 ---------- */}
        {(inShot(f, SHOTS.whole) || inShot(f, SHOTS.wire) || inShot(f, SHOTS.dark)) && (
          <>
            <MapView cam={[1300, 690, keyframes(f, [[fb(50), 0.84], [fb(53), 0.76], [fb(56), 0.74]])]}>
              <StationDots f={f} n={953} lightAt={fb(50)} lightSpread={24} darkAt={fb(55)} darkSpread={50} r={3.6} seed={8} />
              <GlowRoute f={f} at={fb(50)} dur={24} pts={ROUTE_QL} width={2600} height={1600} out={fb(55) + 30} />
              <GlowRoute f={f} at={fb(50) + 6} dur={24} pts={ROUTE_AN} width={2600} height={1600} out={fb(55) + 30} />
              <FlowDots f={f} pts={ROUTE_QL} on={inShot(f, SHOTS.dark) ? 1 - clamp01((f - fb(55)) / 30) : 1} />
              <FlowDots f={f} pts={ROUTE_AN} seed={4} n={6} speed={0.005} on={inShot(f, SHOTS.dark) ? 1 - clamp01((f - fb(55)) / 30) : 1} />
              {f >= fbt(212) && (
                <svg width={2600} height={1600} style={{position: 'absolute', left: 0, top: 0}}>
                  <line
                    x1={PLACES.fanyang[0]}
                    y1={PLACES.fanyang[1]}
                    x2={PLACES.fanyang[0] + (PLACES.lanzhou[0] - PLACES.fanyang[0]) * clamp01((f - fbt(212)) / 10)}
                    y2={PLACES.fanyang[1] + (PLACES.lanzhou[1] - PLACES.fanyang[1]) * clamp01((f - fbt(212)) / 10)}
                    stroke={L.blue}
                    strokeWidth={6}
                    style={{filter: `drop-shadow(0 0 14px ${L.blue})`}}
                  />
                </svg>
              )}
              <Waypoint f={f} at={fb(50)} x={PLACES.fanyang[0]} y={PLACES.fanyang[1]} kind="city" label="北京" side="left" />
              <Waypoint f={f} at={fb(50)} x={PLACES.lanzhou[0]} y={PLACES.lanzhou[1]} kind="city" label="兰州" side="left" />
            </MapView>
            {f >= fbt(216) && f < fbt(216) + 12 && <AbsoluteFill style={{background: L.blue, opacity: 0.25 * (1 - (f - fbt(216)) / 12)}} />}
            <StatCorner f={f} at={fbt(204)} label="乾隆朝 · 驿站" value={953} unit="处" dur={24} out={fb(53) - 4} />
            <SourceNote f={f} at={fb(50)} text="据乾隆朝《清会典》《清会典事例》，转引自茅海建；光点位置为示意" out={fb(53) - 4} />
            <SourceNote f={f} at={fbt(216)} text="茅海建：1891 年，清廷的谕旨可在当天或次日到达绝大多数统治区域" out={fb(55) - 4} />
          </>
        )}

        {/* ---------- 情绪翻转、评论钩子、下期 ---------- */}
        {inShot(f, SHOTS.flip) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.2} />
            <Embers f={f} x={960} y={1000} n={18} spread={1000} rise={500} seed={12} />
            <Narration f={f} align="center" y={170} size={78} lines={[{at: fbt(224), text: FLIP_1}, {at: fbt(228), text: FLIP_2}]} />
            <BigGlyph f={f} at={fbt(230)} text={FLIP_WORD} color={L.goldHot} size={210} y={680} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <NightBg f={f} floor glow={[50, 74]} />
            <Narration f={f} align="center" y={170} size={86} lines={[{at: fbt(236), text: ASK_LINE[0]}, {at: fbt(238), text: `〔${ASK_LINE[1]}〕`}]} />
            <Figure f={f} x={860} y={930} pose="stand" scale={1.1} />
            <SayBubble f={f} at={fbt(240)} x={930} y={560} text="怎么还没到……" />
            <Disclaimer f={f} text="评论区说说" />
          </>
        )}
        {inShot(f, SHOTS.next) && (
          <>
            <NightBg f={f} glow={[50, 58]} />
            <TitleCard f={f} at={fb(62)} kicker="下期 · 灯火史话" title={NEXT_TITLE} size={130} />
          </>
        )}
      </AbsoluteFill>

      {/* 叙述层：不跟着顶 */}
      {panel && (
        <Narration
          key={panel[0].b}
          f={ff}
          lines={panel.map(({b, text}) => ({at: fbt(b), text}))}
          out={half}
        />
      )}

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />
      <Flash f={f} at={HIT} />
      <Flash f={f} at={HIT2} />
    </AbsoluteFill>
  );
};
