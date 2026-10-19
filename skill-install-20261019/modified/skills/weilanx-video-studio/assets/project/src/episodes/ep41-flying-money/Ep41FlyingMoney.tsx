import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {CityGrid, GlowRoute, Waypoint, wiggle} from '../../library/lamplight/charts';
import {CoinG, CoinPole, CoinStringG, DayNightDial, Figure, Gate, Lantern, NameTag, SayBubble, Scroll, Ticket, TierCards} from '../../library/lamplight/props';
import {barPunch, darkness, MapView, panelAt} from '../../library/lamplight/scenes';
import {BigGlyph, Disclaimer, Embers, Flash, Narration, NightBg, SourceNote, StatCorner, TitleCard} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {
  ANCHOR,
  ASK_LINE,
  BAR,
  BAR0,
  CITIES,
  CUES,
  DARK_FROM,
  DARK_FROM2,
  DEMO_GUAN,
  fb,
  fbt,
  FLIP_1,
  FLIP_2,
  FLIP_WORD,
  FPS,
  FREEZE,
  guanWeightJin,
  HALF_BEATS,
  HIT,
  HIT2,
  NEXT_TITLE,
  OPEN_HITS_2,
  PLACES,
  RELAY_HITS,
  SFX,
  SHOTS,
  TIANXI_ADD_WAN,
  TITLE,
  ZHIDAO_WAN,
} from './timeline';

/**
 * ep41 唐朝人，已经在异地转账了（灯火史话风，无口播）
 * 一贯贯铜钱压弯扁担 → 关口不许带钱 → 标题；《唐会要》一千文重六斤四两 → 进奏院领券、券撕两半、地图上钱不动券在飞 →「飞钱」；
 * 裴武禁飞钱 → 元和七年三司便换 → 宋朝便钱务当日给付 → 回落段 11 下硬拍券飞向 11 座州城 → 102.52 秒「交子」；结尾落到「信用」。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];
const P = {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb};

/** 简笔手机：冷光屏幕上一张「转账」卡片，strike 起被红线划掉 */
const Phone: React.FC<{f: number; at: number; x: number; y: number; scale: number; strike: number}> = ({f, at, x, y, scale, strike}) => {
  const a = clamp01((f - at) / 8);
  if (a <= 0) return null;
  const sp = clamp01((f - strike) / 6);
  return (
    <div style={{position: 'absolute', left: x - 90, top: y - 170, width: 180, height: 340, transform: `scale(${scale})`, opacity: a}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: '#14161b', border: '4px solid #3a3f4a', boxShadow: '0 0 40px rgba(143,195,232,0.35)'}} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 30, bottom: 30, borderRadius: 14, background: 'linear-gradient(180deg, #23324a, #1a2436)', textAlign: 'center', fontFamily: LF.label, color: '#d8e6f2'}}>
        <div style={{marginTop: 26, fontSize: 22, opacity: 0.8}}>转账</div>
        <div style={{marginTop: 18, fontSize: 40, fontWeight: 700}}>¥ 100.00</div>
        <div style={{margin: '26px 16px 0', padding: '10px 0', borderRadius: 10, background: 'rgba(143,195,232,0.35)', fontSize: 20}}>确认</div>
      </div>
      {sp > 0 && <div style={{position: 'absolute', left: -50, top: 160, width: `${155 * sp}%`, height: 18, background: L.red, boxShadow: `0 0 18px ${L.red}`, transform: 'rotate(-30deg)', transformOrigin: '0 50%', borderRadius: 9}} />}
    </div>
  );
};

/** 一枚铜钱从上方砸下来，落地弹一下 */
const DropCoin: React.FC<{f: number; at: number; x: number; y: number; r?: number}> = ({f, at, x, y, r = 70}) => {
  const t = f - at + 8;
  if (t < 0) return null;
  const fall = clamp01(t / 8);
  const yy = y - (1 - fall * fall) * 600 - (t > 8 && t < 16 ? Math.sin(((t - 8) / 8) * Math.PI) * 30 : 0);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${x} ${yy}) rotate(${fall * 20})`}>
        <CoinG r={r} glow={1} />
      </g>
    </svg>
  );
};

/** 一堆钱串（地上平放的一摞）：n 串，(x, y) 底部中点 */
const CoinPile: React.FC<{x: number; y: number; n: number; scale?: number; opacity?: number; iron?: boolean}> = ({x, y, n, scale = 1, opacity = 1, iron}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    {Array.from({length: n}, (_, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      return (
        <g key={i} transform={`translate(${x + (col - 2.5 + (row % 2) * 0.5) * 46 * scale} ${y - 20 * scale - row * 40 * scale}) rotate(90) scale(${scale})`}>
          <CoinStringG len={130} w={32} iron={iron} />
        </g>
      );
    })}
  </svg>
);

/** 地图坐标里的一张小券（SVG）：米黄纸 + 朱红边 */
const TicketG: React.FC<{x: number; y: number; s?: number; rot?: number; glow?: boolean}> = ({x, y, s = 1, rot = 0, glow}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} style={glow ? {filter: `drop-shadow(0 0 12px ${L.goldHot})`} : undefined}>
    <rect x={-22} y={-32} width={44} height={64} fill={L.paperLight} stroke={L.seal} strokeWidth={4} />
    <line x1={-8} y1={-20} x2={-8} y2={18} stroke="#2a1a10" strokeWidth={3} />
    <line x1={6} y1={-20} x2={6} y2={8} stroke="#2a1a10" strokeWidth={3} />
  </g>
);

const along = (a: [number, number], b: [number, number], p: number, arc = 120): [number, number] => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p - Math.sin(p * Math.PI) * arc];

export const Ep41FlyingMoney: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark = Math.max(darkness(f, DARK_FROM, HIT, FREEZE), darkness(f, DARK_FROM2, HIT2, FREEZE));
  const s = 1 + barPunch(f, P);
  const panel = panelAt(CUES, fbt, ff);
  const half = panel && HALF_BEATS.includes(panel[0].b) ? (panel[0].b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : undefined;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep41-flying-money/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：手机转账被划掉，一枚铜钱砸下来 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <NightBg f={ff} floor glow={[50, 66]} />
            <Phone f={ff} at={0} x={960} y={520} scale={keyframes(ff, [[0, 1.05], [fbt(7), 1.05], [fbt(7) + 8, 1.2]])} strike={fbt(7)} />
            <DropCoin f={ff} at={fbt(8)} x={1380} y={860} />
            <Disclaimer f={ff} />
          </>
        )}

        {/* ---------- 一贯贯钱压上扁担；关口门关上 ---------- */}
        {(inShot(f, SHOTS.pole) || inShot(f, SHOTS.question)) && (
          <AbsoluteFill style={{transform: `scale(${keyframes(ff, [[fbt(24), 1], [HIT - FREEZE, 1.3]])})`, transformOrigin: '760px 700px'}}>
            <NightBg f={ff} floor glow={[45, 70]} />
            <Gate f={ff} x={1420} y={920} w={340} h={460} label="关" open={1 - clamp01((ff - fbt(20)) / 10)} />
            <Lantern f={ff} x={1180} y={560} seed={3} />
            <CoinPole f={ff} x={720} y={930} loadAt={OPEN_HITS_2.map(fbt)} scale={1.25} />
            {ff >= fbt(20) && (
              <div style={{position: 'absolute', left: 1220, width: 400, top: 330, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: 90, color: L.red, textShadow, opacity: clamp01((ff - fbt(20)) / 6)}}>不许出</div>
            )}
          </AbsoluteFill>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={26} spread={1200} rise={600} seed={3} />
            <TitleCard f={f} at={HIT} kicker="灯火史话 · 唐朝长安" title={TITLE} pill="飞钱" perChar={0.7} size={140} />
          </>
        )}

        {/* ---------- 第 1 章：钱太重 ---------- */}
        {inShot(f, SHOTS.scroll) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(9) + 2}
              y={720}
              w={1100}
              h={420}
              cols={[
                {text: '开元通宝', box: true},
                {text: '十文重一两', size: 60},
                {text: '一千文', size: 66, at: fbt(40)},
                {text: '重六斤四两', size: 72, color: L.seal, at: fbt(40) + 6},
              ]}
              cite="《唐会要》卷八十九 · 泉货"
            />
          </>
        )}
        {inShot(f, SHOTS.weight) && (
          <>
            <NightBg f={f} floor glow={[45, 70]} />
            <CoinPile x={700} y={960} n={30} scale={1.9} />
            <StatCorner f={f} at={fbt(44)} label={`${DEMO_GUAN} 贯铜钱`} value={guanWeightJin(DEMO_GUAN)} unit="斤" dur={14} color={L.gold} x={1420} y={300} size={130} />
            <SourceNote f={f} at={fbt(44)} text="按一千文（一贯）重六斤四两、一斤十六两计算；钱串数量为示意" />
          </>
        )}
        {inShot(f, SHOTS.ban) && (
          <>
            <NightBg f={f} floor glow={[50, 70]} />
            <Gate f={f} x={620} y={930} w={320} h={440} label="骆谷" open={1 - clamp01((f - fbt(56)) / 10)} />
            <Gate f={f} x={1300} y={930} w={320} h={440} label="散关" open={1 - clamp01((f - fbt(56) - 4) / 10)} />
            <NameTag f={f} at={fbt(48)} x={1540} y={160} small="唐 · 钱少物贱" name="钱荒" color={L.red} w={300} />
            {f >= fbt(56) && (
              <svg width={1920} height={1080} style={{position: 'absolute'}}>
                <g transform="translate(960 700)">
                  <CoinG r={62} glow={1} />
                  <line x1={-90} y1={-90} x2={90} y2={90} stroke={L.red} strokeWidth={14 * clamp01((f - fbt(56) - 4) / 6)} strokeLinecap="round" />
                </g>
              </svg>
            )}
            <SourceNote f={f} at={fbt(52)} text="《新唐书·食货志四》：州县禁钱不出境……贞元初，骆谷、散关禁行人以一钱出者" />
          </>
        )}

        {/* ---------- 第 2 章：进奏院、券、合券 ---------- */}
        {inShot(f, SHOTS.office) && (
          <>
            <NightBg f={f} floor glow={[55, 68]} />
            <Gate f={f} x={1420} y={930} w={400} h={500} label="淮南进奏院" open={clamp01((f - fbt(66)) / 10)} />
            <Lantern f={f} x={1160} y={560} seed={4} />
            <Lantern f={f} x={1680} y={560} seed={5} />
            <CoinPole f={f} x={keyframes(f, [[fb(16), 520], [fbt(68), 980]])} y={930} loadAt={[0, 0, 0, 0]} scale={1.1} walk={f < fbt(68)} opacity={1 - clamp01((f - fbt(70)) / 8)} />
            <Ticket f={f} at={fbt(72)} x={760} y={480} w={220} h={330} text="飞钱券" split={clamp01((f - fbt(74)) / 10)} gap={260} glow={f < fbt(74) ? 1 : 0} />
            <SourceNote f={f} at={fbt(68)} text="《新唐书·食货志四》：时商贾至京师，委钱诸道进奏院……以轻装趋四方，合券乃取之" />
            <NameTag f={f} at={fbt(68)} x={1500} y={160} small="各道驻京办事处 · 淮南为示意" name="进奏院" w={380} />
          </>
        )}
        {inShot(f, SHOTS.fly) && (
          <>
            <MapView cam={[1530, 960, 0.95]}>
              <Waypoint f={f} at={fb(19)} x={PLACES.changan[0]} y={PLACES.changan[1]} kind="city" label="长安" side="left" />
              <Waypoint f={f} at={fb(19) + 6} x={PLACES.yangzhou[0]} y={PLACES.yangzhou[1]} kind="city" label="扬州（家乡）" side="right" />
              <GlowRoute f={f} at={fb(19)} dur={fbt(76) - fb(19)} pts={wiggle([PLACES.changan, [1420, 1000], [1700, 1020], PLACES.yangzhou], 3, 12)} />
              <svg width={2600} height={1600} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
                {/* 钱留在长安：一摞不动 */}
                {[0, 1, 2].map((i) => (
                  <g key={i} transform={`translate(${PLACES.changan[0] - 40 + i * 40} ${PLACES.changan[1] + 70}) rotate(90)`}>
                    <CoinStringG len={90} w={26} />
                  </g>
                ))}
                {/* 半张券飞过去，到扬州和另一半合上 */}
                {(() => {
                  const p = clamp01((f - fb(19)) / (fbt(76) - fb(19)));
                  const [x, y] = along(PLACES.changan, PLACES.yangzhou, p, 160);
                  const merged = f >= fbt(76);
                  return (
                    <>
                      <g opacity={clamp01((f - fb(19) - 4) / 8)}>
                        <TicketG x={PLACES.yangzhou[0] + (merged ? 0 : 30)} y={PLACES.yangzhou[1] - 90} s={1.3} />
                      </g>
                      {!merged && <TicketG x={x - 30} y={y - 90} s={1.3} rot={Math.sin(f / 4) * 10} glow />}
                      {merged && <circle cx={PLACES.yangzhou[0]} cy={PLACES.yangzhou[1] - 90} r={30 + (f - fbt(76)) * 3} fill="none" stroke={L.goldHot} strokeWidth={4} opacity={clamp01(1 - (f - fbt(76)) / 16)} />}
                    </>
                  );
                })()}
              </svg>
            </MapView>
            <SourceNote f={f} at={fbt(80)} text="地形与路线为示意" />
          </>
        )}
        {inShot(f, SHOTS.feiqian) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={22} spread={1300} rise={600} seed={7} />
            <BigGlyph f={f} at={fbt(88)} text="飞钱" color={L.goldHot} size={260} y={520} sub="合券乃取之，号「飞钱」" />
          </>
        )}

        {/* ---------- 第 3 章：先禁，后官办 ---------- */}
        {inShot(f, SHOTS.raid) && (
          <>
            <NightBg f={f} glow={[56, 70]} horizon={420} />
            <CityGrid
              f={f + 9999}
              lightAt={0}
              lightSpread={1}
              darkAt={fbt(104) + 9999}
              darkSpread={fbt(108) - fbt(104)}
              core={{c0: 4, c1: 7, r0: 0, r1: 2, label: '长安 · 皇城'}}
              hot={f >= fbt(100) ? Array.from({length: Math.min(10, Math.floor((f - fbt(100)) / 4) + 1)}, (_, i) => ({c: (i * 5 + 1) % 12, r: 3 + ((i * 7) % 9)})) : []}
            />
            <NameTag f={f} at={fbt(96)} x={1500} y={160} small="京兆尹裴武请禁" name="十人为保" color={L.red} w={320} out={fbt(104)} />
            <SourceNote f={f} at={fbt(96)} text="《新唐书·食货志四》：京兆尹裴武请禁与商贾飞钱者，廋索诸坊，十人为保……家有滞藏，物价寖轻" />
          </>
        )}
        {inShot(f, SHOTS.sansi) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 66]} />
            <TierCards
              f={f}
              x={250}
              y={420}
              w={440}
              gap={50}
              tiers={[
                {label: '元和七年', value: '户部', color: L.gold, at: fbt(117)},
                {label: '元和七年', value: '度支', color: L.gold, at: fbt(118)},
                {label: '元和七年', value: '盐铁', color: L.gold, at: fbt(119)},
              ]}
            />
            {f >= fbt(120) && (
              <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', opacity: clamp01((f - fbt(120)) / 6), transform: `scale(${1.3 - 0.3 * clamp01((f - fbt(120)) / 6)})`}}>
                <span style={{display: 'inline-block', padding: '8px 40px', border: `6px solid ${L.seal}`, borderRadius: 10, fontFamily: LF.serif, fontWeight: 900, fontSize: 96, color: L.seal, background: 'rgba(30,10,6,0.6)'}}>便换</span>
              </div>
            )}
            <SourceNote f={f} at={fbt(112)} text="《唐会要》卷八十九：元和七年五月……伏请许令商人于户部、度支、盐铁三司，任便换见钱。从之" />
          </>
        )}

        {/* ---------- 第 4 章：宋朝便钱务 ---------- */}
        {inShot(f, SHOTS.song) && (
          <>
            <NightBg f={f} floor glow={[55, 68]} />
            <Gate f={f} x={1360} y={930} w={420} h={500} label="便钱务" open={clamp01((f - fbt(130)) / 10)} />
            <Lantern f={f} x={1100} y={560} seed={8} />
            <Lantern f={f} x={1620} y={560} seed={9} />
            <CoinPole f={f} x={keyframes(f, [[fb(32), 400], [fbt(136), 900]])} y={930} loadAt={[0, 0, 0]} scale={1.05} walk={f < fbt(136)} opacity={1 - clamp01((f - fbt(138)) / 8)} />
            <Ticket f={f} at={fbt(139)} x={760} y={660} w={180} h={270} text="便钱券" />
            <NameTag f={f} at={fbt(133)} x={1540} y={160} small="北宋 · 开宝三年" name="便钱务" w={300} />
            <SourceNote f={f} at={fbt(133)} text="《宋史·食货志下二》：太祖时取唐飞钱故事……开宝三年，置便钱务，令商人入钱诣务陈牒……给以券" />
          </>
        )}
        {inShot(f, SHOTS.pay) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 66]} />
            <DayNightDial f={f} at={fbt(144)} x={420} y={360} r={130} p={clamp01((f - fbt(144)) / 40) * 0.5} caption="见券当日给付" />
            {f >= fbt(148) && (
              <div style={{position: 'absolute', left: 120, width: 600, top: 620, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: 110, color: L.red, textShadow, opacity: clamp01((f - fbt(148)) / 6)}}>违者科罚</div>
            )}
            <StatCorner f={f} at={fbt(152)} label="至道末 · 商人入便钱" value={ZHIDAO_WAN} unit="万余贯" dur={20} color={L.gold} x={1340} y={220} size={120} />
            <StatCorner f={f} at={fbt(156)} label="天禧末 · 又增" value={TIANXI_ADD_WAN} unit="万贯" dur={16} color={L.goldHot} x={1340} y={560} size={110} />
            <SourceNote f={f} at={fbt(144)} text="《宋史·食货志下二》：诸州凡商人赍券至，当日给付，违者科罚。至道末，商人入便钱一百七十余万贯，天禧末，增一百一十三万贯" />
          </>
        )}

        {/* ---------- 回落段：开封 → 11 座州城 ---------- */}
        {(inShot(f, SHOTS.relay) || inShot(f, SHOTS.build)) && (
          <>
            <MapView cam={[1340, 960, 0.7]}>
              <Waypoint f={ff} at={fb(40)} x={PLACES.kaifeng[0]} y={PLACES.kaifeng[1]} kind="city" label="开封" side="top" size={52} />
              {CITIES.map((c, k) => {
                const hit = fbt(RELAY_HITS[k]);
                const from = hit - 12;
                return (
                  <React.Fragment key={c.name}>
                    <GlowRoute f={ff} at={from} dur={12} pts={wiggle([PLACES.kaifeng, [(PLACES.kaifeng[0] + c.x) / 2, (PLACES.kaifeng[1] + c.y) / 2 - 40], [c.x, c.y]], k + 3, 8)} />
                    <Waypoint f={ff} at={hit} x={c.x} y={c.y} kind="city" label={c.name} side={c.x < PLACES.kaifeng[0] ? 'left' : 'right'} />
                  </React.Fragment>
                );
              })}
              <svg width={2600} height={1600} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
                {CITIES.map((c, k) => {
                  const hit = fbt(RELAY_HITS[k]);
                  const p = clamp01((ff - (hit - 12)) / 12);
                  if (ff < hit - 12) return null;
                  if (ff >= hit + 10) return null;
                  const [x, y] = along(PLACES.kaifeng, [c.x, c.y], p, 80);
                  return <TicketG key={k} x={x} y={y - 40} s={1.2} rot={Math.sin(ff / 3 + k) * 12} glow />;
                })}
              </svg>
            </MapView>
            {ff >= fbt(165) && (
              <div style={{position: 'absolute', left: 1460, width: 400, top: 120, textAlign: 'center'}}>
                <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 34, color: L.inkDim, letterSpacing: 2}}>券已飞到</div>
                <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 110, lineHeight: 1.1, color: L.gold, textShadow}}>
                  {RELAY_HITS.filter((b) => ff >= fbt(b)).length}
                  <span style={{fontSize: 80, marginLeft: 16}}>州</span>
                </div>
              </div>
            )}
            <SourceNote f={ff} at={fbt(165)} text="州城位置与名单为示意；《宋史》原文只说「诸州」" />
          </>
        )}

        {/* ---------- 第二个爆点：交子 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.4} />
            <Embers f={f} x={960} y={1000} n={30} spread={1400} rise={700} seed={6} />
            <BigGlyph f={f} at={HIT2} text={ANCHOR} color={L.goldHot} size={280} sub="北宋 · 益州（成都）" />
          </>
        )}

        {/* ---------- 收束：宋史原文、铁钱、交子务 ---------- */}
        {inShot(f, SHOTS.songshi) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(50) + 2}
              y={720}
              w={1100}
              h={420}
              cols={[
                {text: '交子', box: true},
                {text: '会子交子之法', size: 58},
                {text: '盖有取于', size: 64, at: fbt(204)},
                {text: '唐之飞钱', size: 76, color: L.seal, at: fbt(204) + 6},
              ]}
              cite="《宋史·食货志下三》"
            />
          </>
        )}
        {inShot(f, SHOTS.iron) && (
          <>
            <NightBg f={f} floor glow={[45, 70]} />
            <CoinPole f={f} x={620} y={930} loadAt={[fb(52), fb(52) + 4, fb(52) + 8, fb(52) + 12]} scale={1.2} iron opacity={1 - clamp01((f - fbt(212)) / 10) * 0.6} />
            <Ticket f={f} at={fbt(212)} x={1340} y={600} w={220} h={330} text="交子" glow={1} />
            <NameTag f={f} at={fbt(212) + 6} x={1540} y={160} small="以三年为一界而换之" name="一交一缗" w={360} />
            <SourceNote f={f} at={fbt(208)} text="《宋史·食货志下三》：张咏镇蜀，患蜀人铁钱重，不便贸易，设质剂之法，一交一缗，以三年为一界而换之" />
          </>
        )}
        {inShot(f, SHOTS.wu) && (
          <>
            <NightBg f={f} floor glow={[55, 68]} />
            <Gate f={f} x={1000} y={930} w={460} h={520} label="益州交子务" open={clamp01((f - fbt(217)) / 10)} />
            <Lantern f={f} x={720} y={560} seed={11} />
            <Lantern f={f} x={1280} y={560} seed={12} />
            <SourceNote f={f} at={fbt(216)} text="《宋史·食货志下三》：转运使薛田、张若谷请置益州交子务，以榷其出入，私造者禁之。仁宗从其议" />
          </>
        )}

        {/* ---------- 情绪翻转、评论钩子、下期 ---------- */}
        {inShot(f, SHOTS.flip) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.2} />
            <Embers f={f} x={960} y={1000} n={18} spread={1000} rise={500} seed={12} />
            <Narration f={f} align="center" y={170} size={74} lines={[{at: fbt(224), text: FLIP_1}, {at: fbt(228), text: FLIP_2}]} />
            <BigGlyph f={f} at={fbt(230)} text={FLIP_WORD} color={L.goldHot} size={240} y={680} />
          </>
        )}
        {inShot(f, SHOTS.ask) && (
          <>
            <NightBg f={f} floor glow={[50, 74]} />
            <Narration f={f} align="center" y={170} size={80} lines={[{at: fbt(236), text: ASK_LINE[0]}, {at: fbt(238), text: `〔${ASK_LINE[1]}〕`}]} />
            <Figure f={f} x={900} y={940} scale={1.05} seed={4} />
            <SayBubble f={f} at={fbt(240)} x={1010} y={600} text="钱，已到账" />
            <Disclaimer f={f} text="评论区说说" />
          </>
        )}
        {inShot(f, SHOTS.next) && (
          <>
            <NightBg f={f} glow={[50, 58]} />
            <TitleCard f={f} at={fb(62)} kicker="下期 · 灯火史话" title={NEXT_TITLE} size={110} />
          </>
        )}
      </AbsoluteFill>

      {/* 叙述层：不跟着顶 */}
      {panel && <Narration key={panel[0].b} f={ff} lines={panel.map(({b, text}) => ({at: fbt(b), text}))} out={half} />}

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />
      <Flash f={f} at={HIT} />
      <Flash f={f} at={HIT2} />
    </AbsoluteFill>
  );
};
