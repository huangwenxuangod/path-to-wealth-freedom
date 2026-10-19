import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {Waypoint} from '../../library/lamplight/charts';
import {Figure, Fingerprint, Gate, GroundRing, Lantern, SayBubble, Scroll, TierCards} from '../../library/lamplight/props';
import {barPunch, darkness, MapView, panelAt} from '../../library/lamplight/scenes';
import {BigGlyph, Disclaimer, Embers, Flash, Narration, NightBg, SourceNote, StatCorner, TitleCard} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {
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
  NEXT_TITLE,
  PLACES,
  QICHU,
  RELAY_AT,
  S343_COLS,
  S343_END,
  SFX,
  SHOTS,
  TITLE,
} from './timeline';

/**
 * ep30 古代女人不能离婚？（灯火史话风，无口播）
 * 镜头全部硬切、卡在拍子上；回落段 11 下硬拍点亮放妻书 S.343v 的 11 列，102.52 秒砸出「一别两宽」。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];
const P = {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb};

/** 一张「休书」：at 帧从上面砸下来，strike 帧被一道红线划掉 */
const XiuShu: React.FC<{f: number; at: number; strike: number; x: number; y: number}> = ({f, at, strike, x, y}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = 1 - Math.pow(1 - clamp01(t / 6), 3);
  const sp = clamp01((f - strike) / 6);
  return (
    <div style={{position: 'absolute', left: x - 110, top: y - 170 - (1 - p) * 260, width: 220, height: 340, transform: `rotate(${-6 + 4 * p}deg) scale(${1.25 - 0.25 * p})`, opacity: Math.min(1, p * 2)}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${L.paperLight}, ${L.paper})`, boxShadow: '0 18px 50px rgba(0,0,0,0.7)', borderRadius: 4}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', writingMode: 'vertical-rl', margin: '0 auto', height: 240, fontFamily: LF.scroll, fontSize: 96, color: '#1f1a14', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 18}}>休书</div>
      {sp > 0 && <div style={{position: 'absolute', left: -30, top: 160, width: `${130 * sp}%`, height: 16, background: L.red, boxShadow: `0 0 18px ${L.red}`, transform: 'rotate(-28deg)', transformOrigin: '0 50%', borderRadius: 8}} />}
    </div>
  );
};

/** 一小排见证人（象形小人，小号），用来表现「两家父母、亲戚、邻居都要到场」 */
const Witnesses: React.FC<{f: number; at: number; x: number; y: number; n?: number; flip?: boolean}> = ({f, at, x, y, n = 4, flip}) => (
  <>
    {Array.from({length: n}, (_, i) => (
      <Figure key={i} f={f} x={x + (flip ? -1 : 1) * i * 70} y={y} scale={0.55} flip={flip} bun={i % 2 === 1} hat={i % 2 === 0} opacity={clamp01((f - at - i * 3) / 8)} seed={i + 9} />
    ))}
  </>
);

export const Ep30Divorce: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark = Math.max(darkness(f, DARK_FROM, HIT, FREEZE), darkness(f, DARK_FROM2, HIT2, FREEZE));
  const s = 1 + barPunch(f, P);
  const panel = panelAt(CUES, fbt, ff);
  const half = panel && HALF_BEATS.includes(panel[0].b) ? (panel[0].b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : undefined;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep30-tang-divorce/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：灯下的女子，休书砸下、被划掉 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <NightBg f={ff} floor glow={[42, 70]} />
            <Lantern f={ff} x={560} y={640} seed={2} lit={clamp01(ff / 8)} />
            <Figure f={ff} x={720} y={920} bun hat={false} scale={1.3} pose="stand" seed={1} />
            <Figure f={ff} x={keyframes(ff, [[fbt(1), 1700], [fbt(5), 1260]])} y={920} scale={1.3} pose={ff >= fbt(5) ? 'point' : 'stand'} flip walk={ff < fbt(5)} seed={3} />
            <XiuShu f={ff} at={fbt(7)} strike={fbt(8)} x={1000} y={640} />
            <Disclaimer f={ff} />
          </>
        )}

        {/* ---------- 唐律：和离者，不坐 ---------- */}
        {inShot(f, SHOTS.law) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fbt(11)}
              y={720}
              w={1000}
              h={420}
              cols={[
                {text: '户婚', box: true, at: fbt(11) + 10},
                {text: '夫妻不相安谐', size: 56, at: fbt(13)},
                {text: '而和离者', size: 64, at: fbt(15)},
                {text: '不坐', size: 96, color: L.seal, at: fbt(16)},
              ]}
              seal="唐律"
              cite="《唐律疏议》卷十四 · 户婚律 第一百九十条"
            />
          </>
        )}
        {(inShot(f, SHOTS.apart) || inShot(f, SHOTS.question)) && (
          <>
            <NightBg f={ff} floor glow={[50, 70]} />
            {(() => {
              const d = keyframes(ff, [
                [fbt(20), 0],
                [fbt(24), 300],
                [HIT - FREEZE, 360],
              ]);
              return (
                <>
                  <Figure f={ff} x={860 - d} y={920} bun hat={false} scale={1.2} flip walk={ff < fbt(24)} seed={1} />
                  <Lantern f={ff} x={860 - d - 90} y={620} seed={4} size={0.9} />
                  <Figure f={ff} x={1060 + d} y={920} scale={1.2} walk={ff < fbt(24)} seed={3} />
                  <Lantern f={ff} x={1060 + d + 90} y={620} seed={5} size={0.9} />
                </>
              );
            })()}
            <Disclaimer f={ff} />
          </>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={26} spread={1200} rise={600} seed={3} />
            <TitleCard f={f} at={HIT} kicker="灯火史话 · 唐朝婚姻" title={TITLE} pill="唐 · 放妻书" perChar={0.7} />
          </>
        )}

        {/* ---------- 第 1 章：七出、五十岁、三不去 ---------- */}
        {inShot(f, SHOTS.qichu) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(9) + 2}
              y={720}
              w={1340}
              h={420}
              cols={[{text: '七出', box: true}, ...QICHU.map((t) => ({text: t, size: 70}))]}
              cite="《唐律疏议》卷十四 · 户婚律 第一百八十九条疏议（依令）"
            />
            <StatCorner f={f} at={fbt(44)} label="可以休妻的理由" value={7} unit="条" dur={8} />
          </>
        )}
        {inShot(f, SHOTS.wuzi) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(12) + 2}
              y={720}
              w={900}
              h={420}
              cols={[
                {text: '疏议', box: true},
                {text: '妻年五十以上无子', size: 48},
                {text: '即是四十九以下无子', size: 46, color: L.seal, at: fbt(50)},
                {text: '未合出之', size: 70, color: L.seal, at: fbt(50) + 8},
              ]}
              cite="《唐律疏议》卷十四 · 户婚律 第一百八十九条疏议"
            />
            <StatCorner f={f} at={fbt(50)} label="以「无子」休妻 · 至少" value={50} unit="岁" dur={14} color={L.gold} />
          </>
        )}
        {inShot(f, SHOTS.sanbuqu) && (
          <>
            <NightBg f={f} glow={[50, 66]} />
            {(['gold', 'red'] as const).map((k) => (
              <TierCards
                key={k}
                f={f}
                x={250}
                y={430}
                w={440}
                gap={50}
                out={k === 'gold' ? fbt(60) : undefined}
                tiers={[
                  {label: '一', value: '守过丧', note: '为公婆守过三年丧', color: k === 'gold' ? L.gold : L.red, at: k === 'gold' ? fbt(58) : fbt(60)},
                  {label: '二', value: '先贫后富', note: '娶时贫贱，后来富贵', color: k === 'gold' ? L.gold : L.red, at: k === 'gold' ? fbt(59) : fbt(60)},
                  {label: '三', value: '无家可归', note: '娘家已经没人', color: k === 'gold' ? L.gold : L.red, at: k === 'gold' ? fbt(60) - 6 : fbt(60)},
                ]}
              />
            ))}
            <SourceNote f={f} at={fbt(58)} text="《唐律疏议》卷十四：三不去，谓一经持舅姑之丧，二娶时贱后贵，三有所受无所归" />
          </>
        )}

        {/* ---------- 第 2 章：乱休妻要坐牢 → 和离 ---------- */}
        {inShot(f, SHOTS.punish) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(16) + 2}
              y={740}
              w={1520}
              h={400}
              cols={[
                {text: '出妻', box: true},
                {text: '妻无七出', size: 60},
                {text: '而出之者', size: 60},
                {text: '徒一年半', size: 60, color: L.seal, at: fbt(68)},
                {text: '有三不去', size: 60, at: fbt(72) - 6},
                {text: '而出之者', size: 60, at: fbt(72) - 3},
                {text: '杖一百', size: 70, color: L.seal, at: fbt(72)},
                {text: '追还合', size: 70, color: L.seal, at: fbt(76)},
              ]}
              seal="唐律"
              cite="《唐律疏议》卷十四 · 户婚律 第一百八十九条"
            />
            <StatCorner f={f} at={fbt(68)} label="没犯七出就休" prefix="徒" value={1} unit="年半" dur={6} color={L.red} out={fbt(72) - 2} />
            <StatCorner f={f} at={fbt(72)} label="占了三不去还休" prefix="杖" value={100} dur={10} color={L.red} />
          </>
        )}
        {inShot(f, SHOTS.heli) && (
          <>
            <NightBg f={f} floor glow={[50, 72]} />
            {(() => {
              const sp = keyframes(f, [
                [fbt(88), 0],
                [fbt(88) + 18, 150],
              ]);
              return (
                <>
                  <GroundRing f={f} at={fbt(85)} x={960 - sp} y={928} rx={sp > 0 ? 140 : 280} ry={34} color="rgba(237,174,80,0.85)" />
                  {sp > 0 && <GroundRing f={f} at={fbt(85)} x={960 + sp} y={928} rx={140} ry={34} color="rgba(237,174,80,0.85)" />}
                  <Figure f={f} x={860 - sp * 0.6} y={920} bun hat={false} scale={1.2} flip={f >= fbt(88)} seed={1} />
                  <Figure f={f} x={1060 + sp * 0.6} y={920} scale={1.2} flip={f < fbt(88)} seed={3} />
                  <Lantern f={f} x={760 - sp * 0.6} y={640} seed={4} size={0.85} lit={clamp01((f - fbt(80)) / 10)} />
                  <Lantern f={f} x={1160 + sp * 0.6} y={640} seed={5} size={0.85} lit={clamp01((f - fbt(80)) / 10)} />
                </>
              );
            })()}
            <BigGlyph f={f} at={fbt(92)} text="和離者，不坐" color={L.goldHot} size={110} y={500} />
            <SourceNote f={f} at={fbt(92)} text="《唐律疏议》卷十四：若夫妻不相安谐而和离者，不坐" />
          </>
        )}

        {/* ---------- 第 3 章：怎么离 ---------- */}
        {inShot(f, SHOTS.procedure) && (
          <>
            <NightBg f={f} floor glow={[50, 66]} />
            <Scroll f={f} at={fb(24) + 2} y={700} w={620} h={380} cols={[{text: '放妻书', box: true}, {text: '某专甲谨立', size: 50}, {text: '夫妇之缘', size: 50}]} />
            <Witnesses f={f} at={fbt(100)} x={160} y={960} />
            <Witnesses f={f} at={fbt(100) + 4} x={1760} y={960} flip />
            <Fingerprint f={f} at={fbt(104)} x={800} y={760} size={110} />
            {f >= fbt(108) && (
              <div
                style={{
                  position: 'absolute',
                  left: 1290,
                  top: 560,
                  padding: '16px 30px',
                  border: `3px solid ${L.gold}`,
                  borderRadius: 14,
                  background: 'rgba(20,14,10,0.85)',
                  fontFamily: LF.serif,
                  fontWeight: 900,
                  fontSize: 46,
                  color: L.ink,
                  opacity: clamp01((f - fbt(108)) / 10),
                  textShadow,
                }}
              >
                三年衣粮 · <span style={{color: L.gold}}>不再计较</span>
              </div>
            )}
            <SourceNote f={f} at={fbt(100)} text="《唐令拾遗》辑开元二十五年户令；放妻书 P.3730v「三年衣粮」，转引自中国社会科学网" />
          </>
        )}
        {inShot(f, SHOTS.leave) && (
          <>
            <NightBg f={f} floor glow={[64, 70]} />
            <Gate f={f} x={1420} y={920} w={300} h={430} open={clamp01((f - fbt(112)) / 12)} />
            <Figure f={f} x={keyframes(f, [[fbt(112), 760], [fbt(117), 1240]])} y={920} bun hat={false} scale={1.2} walk={f < fbt(117)} seed={1} />
            <AbsoluteFill style={{background: '#000', opacity: f >= fbt(117) ? 0.6 : 0}} />
            <BigGlyph f={f} at={fbt(117)} text="徒二年" size={300} />
            <SourceNote f={f} at={fbt(117) + 6} text="《唐律疏议》卷十四：即妻妾擅去者，徒二年；因而改嫁者，加二等" />
          </>
        )}
        {inShot(f, SHOTS.remarry) && (
          <>
            <NightBg f={f} floor glow={[50, 72]} />
            <StatCorner f={f} at={fbt(120)} label="擅去之后又改嫁" prefix="徒" value={3} unit="年" dur={6} color={L.red} />
            <GroundRing f={f} at={fbt(124)} x={960} y={928} rx={260} ry={34} color="rgba(237,174,80,0.85)" />
            <Figure f={f} x={keyframes(f, [[fbt(124), 700], [fbt(124) + 14, 870]])} y={920} bun hat={false} scale={1.2} seed={1} />
            <Figure f={f} x={keyframes(f, [[fbt(124), 1220], [fbt(124) + 14, 1050]])} y={920} scale={1.2} flip seed={3} />
            <Disclaimer f={f} />
          </>
        )}

        {/* ---------- 第 4 章：敦煌藏经洞 ---------- */}
        {inShot(f, SHOTS.dunhuang) && (
          <>
            <MapView cam={[keyframes(f, [[fb(32), 1100], [fb(34), 760]]), keyframes(f, [[fb(32), 820], [fb(34), 660]]), keyframes(f, [[fb(32), 0.8], [fb(34), 1.1]])]}>
              <Waypoint f={f} at={fb(32)} x={PLACES.dunhuang[0]} y={PLACES.dunhuang[1]} kind="fire" label="敦煌" side="right" />
              <Waypoint f={f} at={fb(32)} x={PLACES.changan[0]} y={PLACES.changan[1]} kind="city" label="长安" side="right" size={36} color={L.ink} />
            </MapView>
            <StatCorner f={f} at={fbt(128)} label="已知的放妻书" value={11} unit="件" dur={14} out={fbt(133) - 2} />
            <TierCards
              f={f}
              x={1080}
              y={420}
              w={330}
              gap={36}
              tiers={[
                {label: '样文', value: '9 件', note: '照着抄的范本', color: L.gold, at: fbt(133)},
                {label: '实际文书', value: '2 件', note: '真离了婚的', color: L.red, at: fbt(133) + 8},
              ]}
            />
            <SourceNote f={f} at={fbt(128)} text="据沙知《敦煌契约文书辑校》，转引自中国社会科学网；地形与位置为示意" />
          </>
        )}
        {inShot(f, SHOTS.yuanjia) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(36) + 2}
              y={700}
              w={700}
              h={420}
              cols={[
                {text: '若结缘不合', size: 70, at: fbt(144)},
                {text: '比是怨家', size: 76, color: L.seal, at: fbt(144) + 8},
              ]}
              cite="敦煌放妻书 S.343v（录文）"
            />
            <Figure f={f} x={1460} y={940} bun hat={false} scale={0.9} flip opacity={clamp01((f - fbt(148)) / 10)} seed={1} />
            <Figure f={f} x={1600} y={940} scale={0.9} opacity={clamp01((f - fbt(148)) / 10)} seed={3} />
          </>
        )}
        {inShot(f, SHOTS.caichan) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} strength={0.8} />
            <Scroll
              f={f}
              at={fb(38) + 2}
              y={700}
              w={700}
              h={420}
              cols={[
                {text: '妻不论三年柴饭', size: 56, at: fbt(156)},
                {text: '夫休说六载衣粮', size: 56, at: fbt(156) + 8},
              ]}
              cite="敦煌放妻书 S.6417v，转引自中国社会科学网"
            />
          </>
        )}

        {/* ---------- 回落段：11 下硬拍点亮 11 列 ---------- */}
        {(inShot(f, SHOTS.relay) || inShot(f, SHOTS.build)) && (
          <>
            <NightBg f={ff} sky={false} glow={[50, 74]} strength={0.9} />
            <Scroll
              f={ff}
              at={fb(40) + 2}
              y={790}
              w={1780}
              h={440}
              colW={150}
              dim={0.1}
              cols={S343_COLS.map((t, i) => ({text: t, size: 60, at: RELAY_AT[i]}))}
              cite="敦煌放妻书 S.343v（录文，各本小有异文）"
            />
          </>
        )}

        {/* ---------- 第二个爆点：一别两宽 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.5} />
            <Embers f={f} x={960} y={1000} n={30} spread={1400} rise={700} seed={6} />
            <BigGlyph f={f} at={HIT2} text={S343_END[0]} color={L.goldHot} size={250} sub={S343_END[1]} />
            <SourceNote f={f} at={HIT2 + 20} text="敦煌放妻书 S.343v" />
          </>
        )}

        {/* ---------- 收束 ---------- */}
        {inShot(f, SHOTS.today) && (
          <>
            <NightBg f={f} glow={[50, 60]} />
            <Lantern f={f} x={900 - (f - fb(50)) * 2.2} y={500} seed={7} size={1.1} />
            <Lantern f={f} x={1020 + (f - fb(50)) * 2.2} y={500} seed={8} size={1.1} />
            <Disclaimer f={f} />
          </>
        )}
        {inShot(f, SHOTS.honest) && (
          <>
            <NightBg f={f} floor glow={[50, 70]} />
            <Figure f={f} x={1100} y={930} scale={1.35} pose="point" flip seed={3} />
            <div style={{position: 'absolute', left: 940, top: 610, width: 40, height: 90, borderRadius: 6, background: L.paperLight, boxShadow: `0 0 18px ${L.gold}`, transform: 'rotate(-14deg)', opacity: clamp01((f - fbt(216)) / 8)}} />
            <Figure f={f} x={760} y={930} scale={1.15} bun hat={false} seed={1} />
            <SourceNote f={f} at={fbt(216)} text="学者认为：把离异称为「放妻」，说明丈夫的法律地位高于妻子（中国社会科学网）" />
          </>
        )}
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
            <Figure f={f} x={800} y={940} bun hat={false} scale={1.05} seed={1} />
            <Figure f={f} x={1120} y={940} scale={1.05} flip seed={3} />
            <SayBubble f={f} at={fbt(240)} x={1150} y={590} text="……" />
            <Disclaimer f={f} text="评论区说说" />
          </>
        )}
        {inShot(f, SHOTS.next) && (
          <>
            <NightBg f={f} glow={[50, 58]} />
            <TitleCard f={f} at={fb(62)} kicker="下期 · 灯火史话" title={NEXT_TITLE} size={120} />
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
