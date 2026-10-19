import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, keyframes, rand} from '../../library/anim';
import {CityGrid, GlowRoute, Waypoint} from '../../library/lamplight/charts';
import {Bowl, DayNightDial, Figure, FoodBoxG, Gate, GroundRing, Lantern, NameTag, SayBubble, Scroll, TierCards, Waiter} from '../../library/lamplight/props';
import {barPunch, darkness, MapView, NightRoad, panelAt} from '../../library/lamplight/scenes';
import {BigGlyph, Disclaimer, Embers, Flash, Narration, NightBg, SourceNote, StatCorner, TitleCard} from '../../library/lamplight/stage';
import {L, LF, textShadow} from '../../library/lamplight/theme';
import {
  ANCHOR,
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
  LEFT_HITS,
  NEXT_TITLE,
  PLACES,
  RIGHT_HITS,
  RIGHT_PER_HIT,
  ROUTE_SOUTH,
  SFX,
  SHOTS,
  TITLE,
} from './timeline';

/**
 * ep34 宋朝人，已经在点外卖了（灯火史话风，无口播）
 * 镜头全部硬切、卡在拍子上；回落段 11 下硬拍让跑堂叠满碗，102.52 秒砸出「银碗」，结尾落到「信任」。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];
const P = {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb};

/** 跑堂每只碗落上去的帧：左手 3 只各一拍，右臂 20 只按每拍的数量、同一拍里错开 2 帧 */
const LEFT_AT = LEFT_HITS.map(fbt);
const RIGHT_AT = RIGHT_HITS.flatMap((b, i) => Array.from({length: RIGHT_PER_HIT[i]}, (_, k) => fbt(b) + k * 2));

/** 简笔手机：圆角黑框 + 冷光屏幕，scale 缩放，strike 起被红线划掉 */
const Phone: React.FC<{f: number; at: number; x: number; y: number; scale: number; strike: number}> = ({f, at, x, y, scale, strike}) => {
  const a = clamp01((f - at) / 8);
  if (a <= 0) return null;
  const sp = clamp01((f - strike) / 6);
  return (
    <div style={{position: 'absolute', left: x - 90, top: y - 170, width: 180, height: 340, transform: `scale(${scale})`, opacity: a}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: '#14161b', border: '4px solid #3a3f4a', boxShadow: '0 0 40px rgba(143,195,232,0.35)'}} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 30, bottom: 30, borderRadius: 14, background: 'linear-gradient(180deg, #23324a, #1a2436)'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 12, right: 12, top: 18 + i * 76, height: 60, borderRadius: 10, background: 'rgba(143,195,232,0.18)'}} />
        ))}
      </div>
      {sp > 0 && <div style={{position: 'absolute', left: -50, top: 160, width: `${155 * sp}%`, height: 18, background: L.red, boxShadow: `0 0 18px ${L.red}`, transform: 'rotate(-30deg)', transformOrigin: '0 50%', borderRadius: 9}} />}
    </div>
  );
};

/** 雪：几十片米白小点按帧往下飘 */
const Snow: React.FC<{f: number; on: number}> = ({f, on}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', opacity: on}}>
    {Array.from({length: 80}, (_, i) => {
      const x = (rand(i) * 1920 + Math.sin(f / 30 + i) * 20 + f * 0.4) % 1920;
      const y = (rand(i + 50) * 1080 + f * (1.2 + rand(i + 9) * 1.5)) % 1080;
      return <circle key={i} cx={x} cy={y} r={1.5 + rand(i + 3) * 2.5} fill="#efe6d6" opacity={0.6} />;
    })}
  </svg>
);

/** 一个提着食盒的人（象形小人 + 食盒挂在手边） */
const Carrier: React.FC<{f: number; x: number; y: number; flip?: boolean; walk?: boolean; scale?: number; opacity?: number; seed?: number}> = ({f, x, y, flip, walk, scale = 1, opacity = 1, seed = 1}) => (
  <>
    <Figure f={f} x={x} y={y} scale={scale} flip={flip} walk={walk} opacity={opacity} seed={seed} />
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
      <g transform={`translate(${x + (flip ? -1 : 1) * 62 * scale} ${y - 70 * scale})`}>
        <FoodBoxG size={0.75 * scale} />
      </g>
    </svg>
  </>
);

export const Ep34Takeout: React.FC = () => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark = Math.max(darkness(f, DARK_FROM, HIT, FREEZE), darkness(f, DARK_FROM2, HIT2, FREEZE));
  const s = 1 + barPunch(f, P);
  const panel = panelAt(CUES, fbt, ff);
  const half = panel && HALF_BEATS.includes(panel[0].b) ? (panel[0].b === HALF_BEATS[0] ? DARK_FROM : DARK_FROM2) : undefined;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/ep34-song-takeout/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {/* ---------- 开场：门外提食盒的人；手机被划掉 ---------- */}
        {inShot(f, SHOTS.hook) && (
          <>
            <NightBg f={ff} floor glow={[52, 70]} />
            <Gate f={ff} x={1480} y={920} w={300} h={430} label="人家" open={clamp01(ff / 20) * 0.3} />
            <Lantern f={ff} x={1270} y={560} seed={2} />
            <Carrier f={ff} x={keyframes(ff, [[0, 560], [fbt(5), 1020]])} y={920} walk={ff < fbt(5)} scale={1.2} />
            <Phone f={ff} at={fbt(4)} x={760} y={560} scale={keyframes(ff, [[fbt(4), 0.9], [fbt(7), 0.9], [fbt(7) + 8, 1.15]])} strike={fbt(8)} />
            <Disclaimer f={ff} />
          </>
        )}

        {/* ---------- 不开火的城 ---------- */}
        {(inShot(f, SHOTS.city) || inShot(f, SHOTS.question)) && (
          <AbsoluteFill style={{transform: `scale(${keyframes(ff, [[fbt(24), 1], [HIT - FREEZE, 1.35]])})`, transformOrigin: '1070px 760px'}}>
            <NightBg f={ff} glow={[56, 70]} horizon={420} />
            <CityGrid f={ff} lightAt={fbt(13)} lightSpread={fbt(16) - fbt(13)} core={{c0: 4, c1: 7, r0: 0, r1: 2, label: '开封 · 皇城'}} labels={[{c: 2, r: 6, text: '州桥夜市'}, {c: 9, r: 5, text: '马行街'}]} />
            <SourceNote f={ff} at={fbt(13)} text="城的格局为示意" />
          </AbsoluteFill>
        )}

        {/* ---------- 标题卡 ---------- */}
        {inShot(f, SHOTS.title) && (
          <>
            <NightBg f={f} glow={[50, 56]} strength={1.3} />
            <Embers f={f} x={960} y={1000} n={26} spread={1200} rise={600} seed={3} />
            <TitleCard f={f} at={HIT} kicker="灯火史话 · 北宋东京" title={TITLE} pill="东京梦华录" perChar={0.7} size={140} />
          </>
        )}

        {/* ---------- 第 1 章：不置家蔬 ---------- */}
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
                {text: '马行街', box: true},
                {text: '市井经纪之家', size: 56},
                {text: '往往只于市店', size: 56, at: fbt(40)},
                {text: '旋置饮食', size: 64, at: fbt(40) + 6},
                {text: '不置家蔬', size: 76, color: L.seal, at: fbt(44)},
              ]}
              cite="《东京梦华录》卷三 · 马行街铺席"
            />
          </>
        )}
        {inShot(f, SHOTS.street) && (
          <>
            <NightBg f={f} floor glow={[60, 70]} />
            <Gate f={f} x={1360} y={920} w={340} h={450} label="食店" open={clamp01((f - fbt(52)) / 10)} />
            <Lantern f={f} x={1140} y={540} seed={6} />
            <Lantern f={f} x={1580} y={540} seed={7} />
            <Carrier f={f} x={keyframes(f, [[fbt(52), 1300], [fb(16), 760]])} y={920} flip walk={f >= fbt(52)} scale={1.2} opacity={clamp01((f - fbt(52)) / 8)} seed={3} />
            <Bowl f={f} x={560} y={900} at={fbt(56)} w={110} />
            <StatCorner f={f} at={fbt(58)} label="一份下酒小菜" value={15} unit="文" dur={10} color={L.gold} />
            <SourceNote f={f} at={fbt(58)} text="《东京梦华录》卷二：其余小酒店，亦卖下酒……每分不过十五钱" />
          </>
        )}

        {/* ---------- 第 2 章：点菜、跑腿 ---------- */}
        {inShot(f, SHOTS.order) && (
          <>
            <NightBg f={f} floor glow={[50, 70]} />
            <Figure f={f} x={960} y={930} pose="point" scale={1.2} seed={3} />
            {[
              ['热的', 520, 520, 68],
              ['冷的', 760, 440, 69],
              ['温的', 1160, 440, 70],
              ['整的', 1400, 520, 71],
              ['绝冷', 420, 680, 72],
              ['精浇', 1500, 680, 72.5],
              ['臕浇', 640, 760, 73],
            ].map(([t, x, y, b], i) => (
              <SayBubble key={i} f={f} at={fbt(b as number)} x={x as number} y={y as number} text={t as string} color={i < 4 ? L.gold : L.inkDim} />
            ))}
            <SourceNote f={f} at={fbt(68)} text="《东京梦华录》卷四 · 食店：或热或冷，或温或整，或绝冷、精浇、臕浇之类，人人索唤不同" />
          </>
        )}
        {inShot(f, SHOTS.runner) && (
          <>
            <NightRoad f={f} off={(f - fb(20)) * 22} glow={[50, 74]} />
            <Carrier f={f} x={900} y={920} walk scale={1.25} seed={5} />
            <NameTag f={f} at={fbt(85)} x={1120} y={520} small="宋 · 跑腿的人" name="闲汉" w={300} />
            <SourceNote f={f} at={fbt(88)} text="《东京梦华录》卷二：使令买物命妓，取送钱物之类，谓之『闲汉』" />
          </>
        )}

        {/* ---------- 第 3 章：夜市、夜深方归 ---------- */}
        {inShot(f, SHOTS.market) && (
          <>
            <NightBg f={f} glow={[56, 70]} horizon={420} />
            <CityGrid f={f + 9999} lightAt={0} lightSpread={1} core={{c0: 4, c1: 7, r0: 0, r1: 2, label: '开封 · 皇城'}} />
            <DayNightDial f={f} at={fbt(96)} x={1640} y={250} r={100} p={clamp01((f - fbt(96)) / (fbt(104) - fbt(96)))} caption="三更 → 五更" />
            <Snow f={f} on={clamp01((f - fbt(104)) / 12)} />
            <SourceNote f={f} at={fbt(96)} text="《东京梦华录》卷三：夜市直至三更尽，才五更又复开张……冬月虽大风雪阴雨，亦有夜市" />
          </>
        )}
        {inShot(f, SHOTS.tea) && (
          <>
            <NightRoad f={f} off={(f - fb(28)) * 6} glow={[40, 74]} />
            <Figure f={f} x={keyframes(f, [[fb(28), 500], [fbt(117), 900]])} y={920} walk={f < fbt(117)} scale={1.2} seed={8} />
            <Lantern f={f} x={keyframes(f, [[fb(28), 590], [fbt(117), 990]])} y={640} seed={9} size={0.8} />
            <AbsoluteFill style={{background: '#000', opacity: f >= fbt(117) ? 0.55 : 0}} />
            <BigGlyph f={f} at={fbt(117)} text="夜深方归" color={L.goldHot} size={210} y={520} sub="都人公私荣干，夜深方归也" />
          </>
        )}
        {inShot(f, SHOTS.home) && (
          <>
            <NightBg f={f} floor glow={[60, 72]} />
            <Gate f={f} x={1260} y={920} w={300} h={430} open={clamp01((f - fbt(120)) / 14)} />
            <Lantern f={f} x={1060} y={560} seed={10} />
            <Figure f={f} x={keyframes(f, [[fbt(120), 760], [fbt(126), 1180]])} y={920} walk={f < fbt(126)} scale={1.2} seed={8} opacity={1 - clamp01((f - fbt(126)) / 10)} />
            <Disclaimer f={f} />
          </>
        )}

        {/* ---------- 第 4 章：皇宫也点外卖 → 南渡 ---------- */}
        {inShot(f, SHOTS.palace) && (
          <>
            <NightBg f={f} floor glow={[50, 66]} strength={1.2} />
            <Gate f={f} x={1380} y={930} w={420} h={520} label="宫门 · 元宵夜" open={clamp01((f - fbt(128)) / 14)} />
            {[0, 1, 2, 3].map((i) => (
              <Carrier key={i} f={f} x={keyframes(f, [[fbt(133) + i * 8, 260 - i * 160], [fbt(144), 1150 - i * 150]])} y={930} walk scale={0.9} seed={i + 2} opacity={clamp01((f - fbt(133) - i * 8) / 8)} />
            ))}
            <Embers f={f} x={1380} y={500} n={20} spread={300} rise={300} seed={11} />
            <NameTag f={f} at={fbt(136)} x={1440} y={150} small="元宵夜 · 摊贩进宫 · 数倍得直" name="一夕至富" w={360} />
            <SourceNote f={f} at={fbt(133)} text="《武林旧事》卷二 · 元夕：宣唤市井舞队及市食盘架……皆数倍得直，有一夕而至富者" />
          </>
        )}
        {inShot(f, SHOTS.south) && (
          <MapView cam={[1620, 860, keyframes(f, [[fb(36), 0.9], [fb(37), 1.0]])]}>
            <Waypoint f={f} at={fb(36)} x={PLACES.kaifeng[0]} y={PLACES.kaifeng[1]} kind="city" label="开封" side="left" />
            <Waypoint f={f} at={fb(36) + 30} x={PLACES.hangzhou[0]} y={PLACES.hangzhou[1]} kind="city" label="杭州" side="left" />
            <GlowRoute f={f} at={fb(36) + 4} dur={36} pts={ROUTE_SOUTH} fire width={2600} height={1600} />
          </MapView>
        )}
        {inShot(f, SHOTS.dishes) && (
          <>
            <NightBg f={f} sky={false} glow={[50, 68]} />
            <TierCards
              f={f}
              x={250}
              y={430}
              w={440}
              gap={50}
              tiers={[
                {label: '李婆婆', value: '杂菜羹', note: '京师旧人', color: L.gold, at: fbt(148)},
                {label: '贺四', value: '酪面', note: '京师旧人', color: L.gold, at: fbt(150)},
                {label: '脏三', value: '猪胰胡饼', note: '京师旧人', color: L.gold, at: fbt(152)},
              ]}
            />
            <SourceNote f={f} at={fbt(148)} text="《武林旧事》卷七：太上宣索市食，如李婆婆杂菜羹、贺四酪面、脏三猪胰、胡饼……「此皆京师旧人」" />
          </>
        )}

        {/* ---------- 回落段：跑堂叠碗 ---------- */}
        {(inShot(f, SHOTS.waiter) || inShot(f, SHOTS.build)) && (
          <>
            <NightBg f={ff} floor glow={[50, 70]} strength={1.1} />
            <GroundRing f={ff} at={fb(40) + 4} x={820} y={1010} rx={300} ry={38} color="rgba(237,174,80,0.7)" />
            <Waiter f={ff} x={700} y={1010} leftAt={LEFT_AT} rightAt={RIGHT_AT} scale={1.65} />
            {/* 右上计数：只数已经落稳的碗（落下 6 帧后才算），和画面一只只对上 */}
            {ff >= fbt(165) && (
              <div style={{position: 'absolute', left: 1440, width: 400, top: 600, textAlign: 'center'}}>
                <div style={{fontFamily: LF.label, fontWeight: 700, fontSize: 34, color: L.inkDim, letterSpacing: 2}}>跑堂端着</div>
                <div style={{fontFamily: LF.serif, fontWeight: 900, fontSize: 110, lineHeight: 1.1, color: L.gold, textShadow}}>
                  {[...LEFT_AT, ...RIGHT_AT].filter((at) => ff >= at + 6).length}
                  <span style={{fontSize: 90, marginLeft: 20}}>碗</span>
                </div>
              </div>
            )}
            <SourceNote f={ff} at={fbt(165)} text="《东京梦华录》卷四：行菜者左手杈三碗、右臂自手至肩驮叠约二十碗……不容差错" />
          </>
        )}

        {/* ---------- 第二个爆点：银碗 ---------- */}
        {inShot(f, SHOTS.hit2) && (
          <>
            <NightBg f={f} glow={[50, 52]} strength={1.4} />
            <Embers f={f} x={960} y={1000} n={30} spread={1400} rise={700} seed={6} />
            <BigGlyph f={f} at={HIT2} text={ANCHOR} color="#e8ecf2" size={280} sub="就店呼酒，亦用银器供送" />
            <SourceNote f={f} at={HIT2 + 20} text="《东京梦华录》卷五 · 民俗" />
          </>
        )}

        {/* ---------- 收束：银碗送上门、第二天取走；正店借银器 ---------- */}
        {inShot(f, SHOTS.silver) && (
          <>
            <NightBg f={f} floor glow={[55, 72]} />
            <Gate f={f} x={1380} y={920} w={260} h={360} label="贫下人家" />
            <Lantern f={f} x={1190} y={600} seed={12} size={0.8} />
            <Carrier f={f} x={keyframes(f, [[fbt(204), 560], [fbt(207), 1100]])} y={920} walk={f < fbt(207)} scale={1.15} seed={4} opacity={1 - clamp01((f - fbt(208)) / 8)} />
            <Bowl f={f} x={1200} y={910} at={fbt(206)} w={110} silver opacity={1 - clamp01((f - fbt(211)) / 10)} />
            <DayNightDial f={f} at={fbt(208)} x={1640} y={250} r={100} p={clamp01((f - fbt(208)) / (fbt(212) - fbt(208) - 6))} caption="次日取之" />
            <SourceNote f={f} at={fbt(200)} text="《东京梦华录》卷五：以至贫下人家，就店呼酒，亦用银器供送。有连夜饮者，次日取之" />
          </>
        )}
        {inShot(f, SHOTS.lend) && (
          <>
            <NightBg f={f} floor glow={[50, 72]} />
            <Gate f={f} x={480} y={920} w={380} h={500} label="正店" />
            <Gate f={f} x={1460} y={920} w={260} h={360} label="脚店" />
            {Array.from({length: 12}, (_, i) => {
              const at = fbt(214) + i * 4;
              const p = clamp01((f - at) / 16);
              if (p <= 0) return null;
              const x = 620 + (1300 - 620) * p;
              const y = 760 - Math.sin(p * Math.PI) * 140 - (p >= 1 ? (i % 6) * 22 : 0);
              return <Bowl key={i} f={f} x={p >= 1 ? 1300 + Math.floor(i / 6) * 60 : x} y={y} w={56} silver />;
            })}
            <SourceNote f={f} at={fbt(212)} text="《东京梦华录》卷五：其正酒店户，见脚店三两次打酒，便敢借与三五百两银器" />
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
            <Carrier f={f} x={900} y={940} scale={1.05} seed={4} />
            <SayBubble f={f} at={fbt(240)} x={1010} y={600} text="您的外卖到了" />
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
