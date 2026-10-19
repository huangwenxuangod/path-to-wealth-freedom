import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {IceBlock, IceBowl, IceCarrier, IceCellar, MenuBoards, UmbrellaStall} from '../../library/lamplight/ice';
import {Crowd, Figure, Gate, GroundRing, Lantern, NameTag, SayBubble, Scroll} from '../../library/lamplight/props';
import {barPunch, darkness, panelAt} from '../../library/lamplight/scenes';
import {BigGlyph, Disclaimer, DynastyAxis, Embers, Flash, Narration, NightBg, SourceNote, StatCorner, TitleCard} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {Fridge, IceCrack, River, SeasonStrip, SnowValley, SoundWaves, WellMouths} from './scenes';
import {
  ANCHOR,
  ANCHOR_SUB,
  ASK_LINE,
  BAR,
  BAR0,
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
  LIANGSHUI,
  MENU_PICKS,
  NEXT_TITLE,
  RELAY_HITS,
  SAY_KG,
  SAY_TONS,
  SFX,
  SHOTS,
  TITLE,
  ZHAN_MONTH,
} from './timeline';

/**
 * ep46 宋朝人夏天，已经在喝冰饮了（灯火史话风，无口播）
 * 空碗落冰 → 开封街口青布伞亮灯 → 标题；《周礼》凌人斩冰、全屏「三」、冰室里两块化掉 → 颁冰；
 * 《唐六典》一千段、一块 300 公斤、码进冰井 → 宋藏冰署、「有余，则贸钱」、青布伞摊、银器 → 杨万里「冰雪一窖活一家」、隔水卖冰 →
 * 回落段 11 下硬拍凉水水牌一块块亮 → 102.52 秒「冬天」→ 冰井熄灯 → 「半年」。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];
const P = {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb};

/** 一排举凿凿冰的小人：每人在 at 起每 8 帧举一下 */
const Choppers: React.FC<{f: number; xs: number[]; y: number; at: number; scale?: number}> = ({f, xs, y, at, scale = 0.9}) => (
  <>
    {xs.map((x, i) => {
      const up = f >= at && Math.floor((f - at + i * 3) / 8) % 2 === 0;
      return <Figure key={i} f={f} x={x} y={y + (i % 2) * 20} scale={scale} pose={up ? 'raise' : 'stand'} flip={i % 2 === 1} seed={i + 2} />;
    })}
  </>
);

export const Ep46SongIce: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark = Math.max(darkness(f, DARK_FROM, HIT, FREEZE), darkness(f, DARK_FROM2, HIT2, FREEZE));
  const s = 1 + barPunch(f, P);
  const panel = panelAt(CUES, fbt, ff);
  const half = panel && HALF_BEATS.includes(panel[0].b) ? (panel[0].b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : undefined;

  const menuLit = LIANGSHUI.map((name) => {
    const k = MENU_PICKS.indexOf(name);
    if (k >= 0) return fbt(RELAY_HITS[k]);
    const rest = LIANGSHUI.filter((n) => !MENU_PICKS.includes(n));
    return fbt(187) + 6 + rest.indexOf(name) * 2;
  });

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep46-song-ice/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：一只空碗，第 7 拍冰落进去，第 8 拍白气 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <AbsoluteFill style={{transform: `scale(${keyframes(ff, [[0, 1], [fbt(7), 1.04], [fbt(8) + 10, 1.1]])})`, transformOrigin: '1180px 820px'}}>
            <NightBg f={ff} floor glow={[60, 70]} />
            <GroundRing f={ff} at={fbt(5)} x={1180} y={835} rx={260} ry={40} />
            <IceBowl f={ff} x={1180} y={830} w={400} at={0} iceAt={fbt(7) - 5} mistAt={fbt(8)} />
            <Disclaimer f={ff} />
          </AbsoluteFill>
        )}

        {/* ---------- 开封街口：三把青布伞依次亮灯；推近、收暗 ---------- */}
        {(inShot(f, SHOTS.street) || inShot(f, SHOTS.question)) && (
          <AbsoluteFill style={{transform: `scale(${keyframes(ff, [[fbt(24), 1], [HIT - FREEZE, 1.28]])})`, transformOrigin: '1060px 760px'}}>
            <NightBg f={ff} floor glow={[55, 72]} horizon={600} />
            <Crowd f={ff} x0={300} x1={1800} y0={640} y1={700} n={26} seed={4} opacity={0.4} />
            <UmbrellaStall f={ff} x={560} y={980} scale={0.82} litAt={fbt(11)} sign="冰雪" seed={1} />
            <UmbrellaStall f={ff} x={1060} y={900} scale={0.68} litAt={fbt(13)} sign="凉水" seed={2} />
            <UmbrellaStall f={ff} x={1520} y={990} scale={0.86} litAt={fbt(15)} sign="冷元子" seed={3} />
            <StatCorner f={ff} at={fbt(16)} label="北宋 · 开封" value={6} unit="月" dur={8} color={L.gold} comma={false} out={fbt(24)} />
            <SourceNote f={ff} at={fbt(16)} text="《东京梦华录》卷二：夏月……冰雪冷元子……甘草冰雪凉水" />
          </AbsoluteFill>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={26} spread={1200} rise={600} seed={3} />
            <TitleCard f={f} at={HIT} kicker="灯火史话 · 北宋开封" title={TITLE} pill="冰雪" perChar={0.7} size={140} />
          </>
        )}

        {/* ---------- 第 1 章：周礼凌人 ---------- */}
        {inShot(f, SHOTS.winter) && (
          <>
            <SnowValley f={f} seed={1} />
            <Disclaimer f={f} text="场面为示意" />
          </>
        )}
        {inShot(f, SHOTS.zhouli) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(10) + 2}
              y={740}
              w={1000}
              h={420}
              cols={[
                {text: '凌人', box: true},
                {text: '掌冰政', size: 64},
                {text: '下士二人', size: 58},
                {text: '徒八十人', size: 70, color: L.seal, at: fbt(44)},
              ]}
              cite="《周礼 · 天官冢宰》"
            />
          </>
        )}
        {inShot(f, SHOTS.chop) && (
          <>
            <SnowValley f={f} seed={1} />
            <Choppers f={f} xs={[620, 900, 1180, 1460]} y={900} at={fb(12)} />
            <IceCrack f={f} at={fbt(49)} x={760} y={930} seed={2} />
            <IceCrack f={f} at={fbt(50)} x={1320} y={940} seed={5} />
            <IceBlock f={f} at={fbt(49) + 4} x={760} y={985} w={150} h={70} d={50} glow={0.5} />
            <IceBlock f={f} at={fbt(50) + 4} x={1320} y={990} w={150} h={70} d={50} glow={0.5} />
            <StatCorner f={f} at={fbt(48)} label="斩冰" value={ZHAN_MONTH} unit="月" dur={8} color={L.blueText} comma={false} />
            <SourceNote f={f} at={fbt(48)} text="《周礼·天官·凌人》：岁十有二月，令斩冰，三其凌" />
          </>
        )}
        {inShot(f, SHOTS.three) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.2} />
            <BigGlyph f={f} at={fbt(52)} text="三" color={L.goldHot} size={400} y={640} sub="三其凌 · 三倍其冰" />
          </>
        )}
        {inShot(f, SHOTS.cellar) && (
          <>
            <NightBg f={f} sky={false} glow={[55, 70]} strength={0.7} />
            <IceCellar f={f} x={1060} y={500} w={980} depth={420} cols={3} rows={1} melt={[0, clamp01((f - fbt(57)) / 30), clamp01((f - fbt(58)) / 30)]} label="凌室" />
            <SourceNote f={f} at={fb(14)} text="郑玄注：凌，冰室也。三之者，为消释度也（冰室剖面为示意）" />
          </>
        )}
        {inShot(f, SHOTS.grant) && (
          <>
            <NightBg f={f} floor glow={[55, 70]} />
            {[0, 1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <Figure f={f} x={620 + i * 260} y={960} scale={0.95} pose={f >= fbt(60 + i * 0.5) ? 'raise' : 'stand'} seed={i + 5} />
                <IceBlock f={f} at={fbt(60 + i * 0.5)} x={660 + i * 260} y={680} w={90} h={56} d={34} glow={0.7} />
              </React.Fragment>
            ))}
            <SourceNote f={f} at={fb(15)} text="《周礼·天官·凌人》：夏，颁冰掌事；郑玄注：暑气盛，王以冰颁赐" />
          </>
        )}

        {/* ---------- 第 2 章：唐六典 ---------- */}
        {inShot(f, SHOTS.tang) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(16) + 2}
              y={750}
              w={1100}
              h={420}
              cols={[
                {text: '上林署', box: true},
                {text: '凡季冬藏冰', size: 60},
                {text: '每岁藏一千段', size: 64, color: L.seal, at: fbt(68)},
                {text: '所管州于山谷凿而取之', size: 44},
              ]}
              cite="《唐六典》卷十九 · 司农寺"
            />
          </>
        )}
        {inShot(f, SHOTS.block) && (
          <>
            <NightBg f={f} floor glow={[40, 72]} />
            <IceBlock f={f} at={fb(18)} x={700} y={860} w={560} h={280} d={170} glow={0.8} dims={{at: fbt(73), w: '三尺', h: '一尺五寸', d: '三尺'}} />
            <StatCorner f={f} at={fbt(80)} label="一块约" value={SAY_KG} unit="公斤" dur={16} color={L.gold} x={1480} y={390} size={120} />
            <StatCorner f={f} at={fbt(82)} label="一千块约" value={SAY_TONS} unit="吨" dur={14} color={L.goldHot} x={1480} y={640} size={120} />
            <SourceNote f={f} at={fbt(80)} text="按唐尺约 29.6 厘米、冰每立方米约 917 公斤估算：一块约 321 公斤" />
          </>
        )}
        {inShot(f, SHOTS.well) && (
          <>
            <NightBg f={f} sky floor={false} glow={[50, 60]} strength={0.6} horizon={480} />
            <IceCellar f={f} x={1000} y={470} w={1120} depth={460} cols={6} rows={2} fillAt={Array.from({length: 12}, (_, k) => fb(21) + 6 + k * 9)} label="冰井" />
            <NameTag f={f} at={fbt(84) + 4} x={1440} y={250} small="先立春三日" name="纳之冰井" w={360} />
            <SourceNote f={f} at={fb(21)} text="《唐六典》卷十九：每岁藏一千段，方三尺，厚一尺五寸……先立春三日纳之冰井（剖面为示意）" />
          </>
        )}

        {/* ---------- 第 3 章：北宋，冰走上街 ---------- */}
        {inShot(f, SHOTS.song) && (
          <>
            <NightBg f={f} floor glow={[50, 66]} />
            <Gate f={f} x={960} y={830} w={400} h={440} label="藏冰署" open={clamp01((f - fbt(97)) / 10)} />
            <Lantern f={f} x={690} y={540} seed={2} />
            <Lantern f={f} x={1230} y={540} seed={3} />
            <NameTag f={f} at={fbt(97)} x={1420} y={330} small="北宋 · 建隆二年（961）" name="藏冰署" w={380} />
            <DynastyAxis f={f} at={fb(24)} items={['周', '唐', '北宋', '南宋']} active={2} prev={1} moveAt={fb(24) + 4} year="961" y={940} />
            <SourceNote f={f} at={fbt(97)} text="《宋史》卷一百三：建隆二年，置藏冰署而修其祀焉" />
          </>
        )}
        {inShot(f, SHOTS.songshi) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(26) + 2}
              y={750}
              w={1150}
              h={420}
              cols={[
                {text: '籍田', box: true},
                {text: '冬则藏冰', size: 62},
                {text: '先荐献而后进御', size: 52},
                {text: '有余', size: 76, color: L.seal, at: fbt(108)},
                {text: '则贸钱', size: 76, color: L.seal, at: fbt(108) + 6},
              ]}
              cite="《宋史》卷一百二 · 礼五（元丰二年籍田）"
            />
          </>
        )}
        {inShot(f, SHOTS.stalls) && (
          <>
            <NightBg f={f} floor glow={[50, 70]} horizon={560} />
            <Crowd f={f} x0={200} x1={1800} y0={600} y1={680} n={34} seed={8} opacity={0.4} />
            {[
              [1180, 680, 0.42, 112],
              [760, 700, 0.46, 113],
              [1400, 760, 0.56, 114],
              [520, 790, 0.6, 115],
              [1660, 880, 0.74, 116],
              [300, 940, 0.8, 117],
            ].map(([x, y, sc, b], i) => (
              <UmbrellaStall key={i} f={f} x={x} y={y} scale={sc} litAt={fbt(b)} seed={10 + i} sign={i % 2 ? '冰雪' : undefined} />
            ))}
            <SourceNote f={f} at={fbt(112)} text="《东京梦华录》卷八：巷陌路口，桥门市井，皆卖……冰雪……皆用青布伞当街列床凳堆垛" />
          </>
        )}
        {inShot(f, SHOTS.silver) && (
          <>
            <NightBg f={f} floor glow={[55, 70]} />
            <Gate f={f} x={480} y={900} w={380} h={480} label="旧宋门" open={1} opacity={0.75} />
            <IceBowl f={f} x={1020} y={860} w={300} at={fbt(120)} iceAt={fbt(120)} mistAt={fbt(120) + 4} silver seed={3} />
            <IceBowl f={f} x={1460} y={880} w={300} at={fbt(121)} iceAt={fbt(121)} mistAt={fbt(121) + 4} silver seed={5} />
            <NameTag f={f} at={fbt(122)} x={1010} y={250} small="冰雪惟旧宋门外两家最盛" name="悉用银器" color={L.ink} w={460} />
            <SourceNote f={f} at={fbt(120)} text="《东京梦华录》卷八「是月巷陌杂卖」" />
          </>
        )}

        {/* ---------- 第 4 章：南宋，冰成了生意 ---------- */}
        {inShot(f, SHOTS.yang) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(32) + 2}
              y={760}
              w={1150}
              h={430}
              cols={[
                {text: '荔枝歌', box: true},
                {text: '北人冰雪作生涯', size: 54},
                {text: '冰雪一窖活一家', size: 62, color: L.seal, at: fbt(128) + 6},
                {text: '帝城六月日亭午', size: 50, at: fbt(133)},
                {text: '市人如炊汗如雨', size: 50, at: fbt(133) + 6},
              ]}
              dim={0.25}
              cite="杨万里（诚斋），据《全芳备祖》后集卷一（四库本）"
            />
          </>
        )}
        {inShot(f, SHOTS.seller) && (
          <>
            <NightBg f={f} floor glow={[60, 62]} horizon={520} />
            <River f={f} y={720} h={150} />
            <IceCarrier f={f} x={1420} y={690} scale={0.75} shout />
            <SayBubble f={f} at={fbt(136) + 4} x={1500} y={300} text="卖冰——" />
            <SoundWaves f={f} at={fbt(137)} x={1300} y={560} dir={-1} />
            <Figure f={f} x={520} y={990} scale={1} pose="stand" seed={9} />
            <SourceNote f={f} at={fbt(136)} text="杨万里《荔枝歌》（四库本）；通行本末句作「行人未吃心先凉」" />
          </>
        )}
        {inShot(f, SHOTS.chain) && (
          <>
            <NightBg f={f} sky floor={false} glow={[50, 60]} strength={0.6} horizon={560} />
            <IceCellar f={f} x={420} y={560} w={520} depth={260} cols={3} rows={1} label="冰窖" />
            <IceCarrier f={f} x={keyframes(f, [[fb(36), 760], [fb(38), 1140]])} y={560} scale={0.62} walk />
            <UmbrellaStall f={f} x={1560} y={560} scale={0.72} litAt={fbt(144)} sign="冰雪" seed={21} />
            {f >= fbt(144) && (
              <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: LF.serif, fontWeight: 900, fontSize: 56, color: L.gold, textShadow, opacity: clamp01((f - fbt(144)) / 8)}}>
                冬天藏冰　→　挑进城　→　夏天卖
              </div>
            )}
            <Disclaimer f={f} text="场面为示意" />
          </>
        )}

        {/* ---------- 回落段：凉水水牌 ---------- */}
        {(inShot(f, SHOTS.menu) || inShot(f, SHOTS.build)) && (
          <>
            <NightBg f={ff} sky={false} glow={[50, 74]} strength={0.9} />
            <MenuBoards f={ff} at={fb(38)} names={LIANGSHUI} litAt={menuLit} y={600} x0={90} x1={1830} />
            {ff >= fbt(165) && (
              <div style={{position: 'absolute', left: 1400, width: 440, top: 110, textAlign: 'center'}}>
                <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 34, color: L.inkDim, letterSpacing: 2}}>临安 · 凉水</div>
                <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 120, lineHeight: 1.1, color: L.gold, textShadow}}>
                  {menuLit.filter((t) => ff >= t).length}
                  <span style={{fontSize: 80, marginLeft: 16}}>种</span>
                </div>
              </div>
            )}
            <SourceNote f={ff} at={fb(38)} text="《武林旧事》卷六「市食」· 凉水（原书顺序）" />
          </>
        )}

        {/* ---------- 第二个爆点：冬天 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <SnowValley f={f} seed={2} />
            <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
            <BigGlyph f={f} at={HIT2} text={ANCHOR} color={L.goldHot} size={280} sub={ANCHOR_SUB} />
          </>
        )}

        {/* ---------- 收束：回到冬天，冰井熬过春天 ---------- */}
        {inShot(f, SHOTS.back) && f < fbt(204) && (
          <>
            <SnowValley f={f} seed={1} />
            <Choppers f={f} xs={[700, 980, 1260]} y={900} at={fb(50)} />
            <IceCrack f={f} at={fbt(201)} x={1100} y={940} seed={7} />
          </>
        )}
        {inShot(f, SHOTS.back) && f >= fbt(204) && (
          <>
            <NightBg f={f} sky floor={false} glow={[50, 60]} strength={0.5} horizon={420} />
            <IceCellar f={f} x={960} y={420} w={1000} depth={380} cols={5} rows={2} label="冰井" />
            <SeasonStrip f={f} x0={420} x1={1500} y={900} items={['腊月', '立春', '春分', '六月']} at={[fbt(204), fbt(206), fbt(208), fbt(210)]} />
          </>
        )}
        {inShot(f, SHOTS.fridge) && (
          <>
            <NightBg f={f} floor glow={[50, 70]} horizon={600} />
            <WellMouths f={f} xs={[300, 560, 820, 1080]} y={860} darkAt={[fbt(216), fbt(217), fbt(218), fbt(219)]} />
            <Fridge f={f} at={fbt(212) + 4} x={1500} y={940} scale={1.1} />
            <Disclaimer f={f} text="示意" />
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
            <Figure f={f} x={820} y={960} scale={1.05} seed={4} />
            <IceBowl f={f} x={1120} y={960} w={220} at={fbt(239)} iceAt={fbt(239)} mistAt={fbt(239) + 6} seed={8} />
            <SayBubble f={f} at={fbt(240)} x={940} y={600} text="来一碗冰雪！" />
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
