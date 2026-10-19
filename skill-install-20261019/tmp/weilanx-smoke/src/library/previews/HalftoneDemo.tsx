import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeIn, easeInOut} from '../anim';
import {BigNumeral, Bubble, BurstLabel, CaseFolder, DigitalClock, DocWindow, EvidenceCard, HeightChart, Moon, NamePlate, ProfileBlock, RubberStamp, SpeedLines, StatBlock, StickyNote} from '../halftone/props';
import {CaptionBar, CaseHeader, Confetti, DateChip, DotWipe, DropLetters, Flash, Halftone, Headline, NightBg, PaperBg, Pop, PrintGrain, Rays} from '../halftone/stage';
import {Robo, Sock} from '../halftone/suspect';
import {H, HF, chunky, shake} from '../halftone/theme';
import type {SfxCue} from '../types';

/**
 * 网点档案风素材一览（1920×1080，45 秒）：每 150 帧一场，场与场之间用网点淹没转场。
 * 示例题目是自己编的（扫地机器人「嘟嘟」的半夜罪状），只用来检查每个组件的样子和动效。
 */
const LEN = 150;
export const HALFTONE_DEMO_FRAMES = LEN * 9;
const NO = 'No.2026-BOT-007';
const DATE = '2026.10';

const Scene: React.FC<{f: number; i: number; children: (t: number) => React.ReactNode}> = ({f, i, children}) => {
  const t = f - i * LEN;
  if (t < 0 || t >= LEN) return null;
  return <AbsoluteFill>{children(t)}</AbsoluteFill>;
};

/** 印章落定时整场抖一下 */
const Shake: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => {
  const {x, y} = shake(t, at);
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

/**
 * 音效表 [名字, 全局帧, 音量]：每个动作对一个共享音效（public/audio/sfx/）。
 * 配乐压到 0.55 倍垫在下面，音效峰值都在 −0.9 dBFS，音量 0.5～1，印章最响；整片约 −16 LUFS、不削波。
 */
const at = (scene: number, t: number) => scene * LEN + t;
export const HALFTONE_SFX: SfxCue[] = [
  // 1 片头：五个字母各落一下，嫌疑人探头
  ...[0, 1, 2, 3, 4].map((k): SfxCue => ['pop', at(0, 10 + k * 5), 0.72]),
  ['boing', at(0, 44), 0.56],
  ['click', at(0, 52), 0.64],
  // 2 起诉书：三行大字、印章、轮胎印
  ['pop', at(1, 6), 0.56],
  ['pop', at(1, 16), 0.72],
  ['pop', at(1, 40), 0.56],
  ['stamp', at(1, 66), 1.0],
  ['paper', at(1, 84), 0.56],
  // 3 档案照：入镜、名牌、两次快门、数字滚动、档案信息
  ['pop', at(2, 4), 0.72],
  ['paper', at(2, 12), 0.64],
  ['snip', at(2, 30), 0.96],
  ['type', at(2, 42), 0.8],
  ['pop', at(2, 52), 0.56],
  ['snip', at(2, 76), 0.96],
  // 4 罪状 01：大号数字、标题、边刷启动、吸袜子、咕嘟
  ['pop', at(3, 2), 0.72],
  ['pop', at(3, 8), 0.56],
  ['click', at(3, 30), 0.64],
  ['whoosh', at(3, 52), 0.64],
  ['boing', at(3, 78), 0.8],
  // 5 罪状 02：月亮、数码钟、冲过去、撞墙
  ['magic', at(4, 4), 0.48],
  ['click', at(4, 12), 0.72],
  ['click', at(4, 24), 0.64],
  ['whoosh', at(4, 44), 0.8],
  ['shake', at(4, 106), 0.72],
  // 6 罪状 03：大号数字、窗口、便签、打字、睡着的嫌疑人
  ['pop', at(5, 2), 0.72],
  ['paper', at(5, 8), 0.56],
  ['pop', at(5, 20), 0.64],
  ['type', at(5, 32), 0.88],
  ['pop', at(5, 44), 0.56],
  ['type', at(5, 62), 0.88],
  ['click', at(5, 64), 0.64],
  ['type', at(5, 92), 0.88],
  // 7 证据墙：标题、三张卡落下、「罪名成立？」
  ['pop', at(6, 4), 0.56],
  ['paper', at(6, 22), 0.72],
  ['paper', at(6, 32), 0.72],
  ['paper', at(6, 42), 0.72],
  ['question', at(6, 72), 0.64],
  // 8 宣判：标题、印章砸下 + 彩纸
  ['pop', at(7, 4), 0.56],
  ['stamp', at(7, 44), 1.0],
  ['confetti', at(7, 45), 0.72],
  ['click', at(7, 80), 0.64],
  // 9 结案：文件夹、对话框、结案章、收尾
  ['paper', at(8, 4), 0.64],
  ['pop', at(8, 30), 0.64],
  ['stamp', at(8, 64), 1.0],
  ['ding', at(8, 80), 0.56],
  // 场与场之间的网点淹没
  ...Array.from({length: 8}, (_, i): SfxCue => ['whoosh', (i + 1) * LEN - 7, 0.8]),
];

const WIPE_COLORS = [H.yellow, H.pink, H.blue];
const WIPE_FROM = ['tl', 'br', 'tr', 'bl'] as const;

/** 时钟小图标（证据卡用） */
const ClockIcon: React.FC = () => (
  <svg width={120} height={120}>
    <circle cx={60} cy={60} r={48} fill={H.paperLight} stroke={H.ink} strokeWidth={6} />
    <line x1={60} y1={60} x2={60} y2={26} stroke={H.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={60} y1={60} x2={86} y2={60} stroke={H.ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx={60} cy={60} r={6} fill={H.red} />
  </svg>
);

/** 日志小图标（证据卡用） */
const LogIcon: React.FC = () => (
  <div style={{width: 150, padding: '10px 0', background: H.paperLight, border: `5px solid ${H.ink}`, borderRadius: 8, textAlign: 'center', fontFamily: HF.mono, fontWeight: 700, fontSize: 30, color: H.red}}>beep</div>
);

export const HalftoneDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: H.paper, fontFamily: HF.sans, overflow: 'hidden'}}>
      {/* 1 片头：圆胖字母落下 + 嫌疑人从字后探头 */}
      <Scene f={f} i={0}>
        {(t) => (
          <>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 60% at 50% 50%, #3558d6 0%, ${H.blue} 55%, ${H.blueDeep} 100%)`}} />
            <Halftone color={H.night} cx={960} cy={540} radius={[1150, 760]} mode="in" inner={0.4} step={26} f={t} breathe={0.04} />
            <Halftone color={H.yellow} cx={120} cy={90} radius={520} step={26} power={0.7} />
            <Halftone color={H.pink} cx={1880} cy={1060} radius={460} step={26} power={0.8} />
            <NightBg f={t} stars={40} starsOnly />
            <div style={{position: 'absolute', left: 60, top: 50, fontFamily: HF.mono, fontWeight: 700, fontSize: 22, color: H.ink}}>
              <span style={{fontFamily: HF.sans}}>卷宗</span> 07 / 2026
            </div>
            <div style={{position: 'absolute', right: 60, top: 50, fontFamily: HF.mono, fontWeight: 700, fontSize: 22, color: H.paper, letterSpacing: 3}}>DOSSIER · 2026</div>
            <Pop f={t} at={44} x={1190} y={230} from={0.2} origin="50% 100%">
              <Robo f={t} size={240} eyes="wide" id="r0" />
            </Pop>
            <DropLetters f={t} at={4} text="DUSTY" x={420} y={360} size={300} />
            <Pop f={t} at={52} x={0} y={720} style={{width: 1920, textAlign: 'center', fontFamily: HF.sans, fontSize: 44, color: H.paper, letterSpacing: 4}}>
              嘟嘟 · 一台扫地机器人的起诉书
            </Pop>
          </>
        )}
      </Scene>

      {/* 2 起诉书：粗宋大字逐字弹入 + 印章砸下 + 一串轮胎印 */}
      <Scene f={f} i={1}>
        {(t) => (
          <Shake t={t} at={67}>
            <PaperBg />
            <Halftone color={H.yellow} cx={1480} cy={540} radius={[720, 640]} step={24} />
            <Halftone color={H.blue} cx={1920} cy={0} radius={300} step={22} />
            <CaseHeader f={t} at={0} no={NO} tag={['开场', '起诉书']} />
            <DateChip f={t} text={DATE} />
            <Headline f={t} at={6} text="深更半夜" x={160} y={250} size={84} shadow="none" />
            <Headline f={t} at={16} text="这台扫地机" x={150} y={370} size={190} />
            <Headline f={t} at={40} text="到底在干嘛" x={160} y={630} size={84} shadow="none" />
            <div style={{position: 'absolute', left: 1130, top: 470}}>
              <RubberStamp f={t} at={62} text="可疑" size={150} rot={-12} />
            </div>
            <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
              {Array.from({length: 7}, (_, i) =>
                t >= 84 + i * 4 ? (
                  <g key={i} transform={`translate(${980 + i * 110} ${880 - Math.sin(i * 0.8) * 30}) rotate(-8)`}>
                    <rect x={-30} y={-16} width={60} height={9} rx={4} fill={H.ink} opacity={0.75} />
                    <rect x={-30} y={8} width={60} height={9} rx={4} fill={H.ink} opacity={0.75} />
                  </g>
                ) : null,
              )}
            </svg>
            <Pop f={t} at={84} x={160} y={800} style={{fontFamily: HF.sans, fontSize: 30, color: H.ink}}>
              —— 现场轮胎印 <span style={{fontFamily: HF.mono}}>7</span> 处
            </Pop>
          </Shake>
        )}
      </Scene>

      {/* 3 档案照：身高尺 + 网点光晕 + 名牌 + 快门白闪 + 前科大数字 + 档案信息 */}
      <Scene f={f} i={2}>
        {(t) => {
          const flashing = (t >= 30 && t < 38) || (t >= 76 && t < 84);
          return (
            <>
              <PaperBg />
              <Halftone color={H.blue} cx={960} cy={500} radius={[560, 500]} step={22} f={t} breathe={0.03} />
              <HeightChart />
              <CaseHeader f={t} at={0} no={NO} tag={['嫌疑人', '档案照']} />
              <DateChip f={t} text={DATE} />
              <Pop f={t} at={4} x={660} y={250} from={0.5} origin="50% 100%">
                <Robo f={t} size={600} eyes={flashing ? 'closed' : t > 90 ? 'side' : 'open'} blink={false} id="r2" />
              </Pop>
              <Pop f={t} at={12} x={710} y={640} from={0.6}>
                <NamePlate
                  name="DUSTY, R."
                  rows={[
                    ['案号 ', '2026-BOT-007'],
                    ['罪名：', '半夜加班', 'yellow'],
                  ]}
                />
              </Pop>
              <Pop f={t} at={40} x={230} y={330} from={0.5} origin="left center">
                <StatBlock label="前科" value={`${Math.round(128 * easeInOut(clamp01((t - 40) / 30)))}+`} caption="次 · 均在凌晨" />
              </Pop>
              <Pop f={t} at={52} x={1300} y={300} from={0.5} origin="left center">
                <ProfileBlock
                  label="嫌疑人档案 · PROFILE"
                  name="Dusty R."
                  rows={[
                    ['体重 · ', '2.3 kg'],
                    ['特长：', '装作没电', true],
                  ]}
                />
              </Pop>
              <Flash f={t} at={30} />
              <Flash f={t} at={76} />
            </>
          );
        }}
      </Scene>

      {/* 4 罪状 01：网点大号数字 + 嫌疑人吞袜子 + 拟声爆炸框 + 字幕条 */}
      <Scene f={f} i={3}>
        {(t) => {
          const p = easeIn(clamp01((t - 50) / 26));
          return (
            <>
              <PaperBg />
              <Halftone color={H.pink} cx={0} cy={1080} radius={540} step={22} />
              <Pop f={t} at={2} x={1130} y={150} from={0.6}>
                <BigNumeral text="01" size={640} base={H.yellow} dot={H.orange} id="n01" step={24} />
              </Pop>
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                <defs>
                  <pattern id="rug" patternUnits="userSpaceOnUse" width={12} height={12}>
                    <rect width={12} height={12} fill={H.blue} />
                    <circle cx={3} cy={3} r={2.4} fill={H.blueDeep} />
                    <circle cx={9} cy={9} r={2.4} fill={H.blueDeep} />
                  </pattern>
                </defs>
                <rect x={640} y={748} width={1320} height={44} fill="url(#rug)" stroke={H.ink} strokeWidth={6} />
                <rect x={700} y={792} width={26} height={300} fill={H.ink} />
              </svg>
              <Pop f={t} at={10} x={1010} y={500} from={0.5} origin="50% 100%">
                <Robo f={t} size={360} eyes={t > 76 && t < 100 ? 'happy' : 'side'} spin={t > 40 ? 1 : 0} id="r3" />
              </Pop>
              {t >= 20 && p < 1 && (
                <div style={{position: 'absolute', left: 800 + 220 * p, top: 640 - 30 * p, transform: `scale(${1 - 0.9 * p}) rotate(${-20 + 200 * p}deg)`}}>
                  <Sock size={110} />
                </div>
              )}
              <div style={{position: 'absolute', left: 820, top: 440}}>
                <BurstLabel f={t} at={78} text="咕嘟！" size={190} />
              </div>
              <Headline f={t} at={6} text="吞袜子" x={130} y={170} size={180} shadow={H.yellow} />
              <Pop f={t} at={20} x={1520} y={120} from={0.5}>
                <div style={{fontFamily: HF.sans, fontSize: 26, color: H.pink, textAlign: 'center'}}>今日袜子</div>
                <div style={{fontFamily: HF.round, fontSize: 96, lineHeight: 1, textAlign: 'center', ...chunky(H.ink, 4)}}>{t >= 78 ? 4 : 3}</div>
              </Pop>
              <CaseHeader f={t} at={0} no={NO} tag={['罪状 01', '吞袜子']} accent="pink" />
              <DateChip f={t} text={DATE} />
              <CaptionBar f={t} at={30} text="一天吞掉【4 只】袜子，〖一只都不吐〗。" />
            </>
          );
        }}
      </Scene>

      {/* 5 罪状 02：夜色 + 网点月亮 + 数码钟 + 嫌疑人带速度线冲过 */}
      <Scene f={f} i={4}>
        {(t) => {
          const run = clamp01((t - 40) / 66);
          const x = -420 + 2000 * run;
          return (
            <Shake t={t} at={108}>
              <NightBg f={t} />
              <Halftone color="#2b3778" cx={960} cy={520} radius={[1150, 760]} mode="in" inner={0.3} step={24} />
              <AbsoluteFill style={{top: 900, background: H.nightDeep}} />
              <Pop f={t} at={4} x={1000} y={110} from={0.3}>
                <Moon r={120} />
              </Pop>
              <Pop f={t} at={12} x={1420} y={150} from={0.4}>
                <DigitalClock f={t} text="03:00" />
              </Pop>
              <Headline f={t} at={6} text="凌晨三点巡逻" x={120} y={300} size={130} color={H.paper} shadow="#0b1029" d={8} />
              {t >= 40 && t < 108 && (
                <div style={{position: 'absolute', left: x, top: 700}}>
                  <div style={{position: 'absolute', left: -250, top: 60}}>
                    <SpeedLines f={t} />
                  </div>
                  <Robo f={t} size={280} eyes="wide" spin={2} id="r4" />
                </div>
              )}
              <div style={{position: 'absolute', left: 1600, top: 640}}>
                <BurstLabel f={t} at={106} text="哐！" size={200} rot={10} />
              </div>
              <CaseHeader f={t} at={0} no={NO} tag={['罪状 02', '凌晨巡逻']} accent="pink" dark />
              <DateChip f={t} text={DATE} dark />
              <CaptionBar f={t} at={24} text="每晚【3:00】准时出门，〖风雨无阻〗。" dark />
            </Shake>
          );
        }}
      </Scene>

      {/* 6 罪状 03：粉色网点大号数字 + 文档窗口打字 + 便签 + 睡着的嫌疑人 */}
      <Scene f={f} i={5}>
        {(t) => (
          <>
            <PaperBg />
            <Halftone color={H.blue} cx={0} cy={1080} radius={560} step={22} />
            <Pop f={t} at={2} x={1240} y={170} from={0.6}>
              <BigNumeral text="03" size={600} dot={H.pink} id="n03" step={20} />
            </Pop>
            <Pop f={t} at={8} x={560} y={300} from={0.5}>
              <DocWindow f={t} title="清扫日志_最终版_v3.log" text="beep beep boop beep beep beep boop" typed={(t - 30) / 80} />
            </Pop>
            <div style={{position: 'absolute', left: 1240, top: 240}}>
              <StickyNote f={t} at={20} title="3%" sub="电量告急！" />
            </div>
            <Pop f={t} at={44} x={1080} y={600} from={0.4} origin="50% 100%">
              <Robo f={t} size={280} eyes="closed" light={false} id="r5" />
            </Pop>
            <Headline f={t} at={4} text="伪造日志" x={120} y={140} size={170} />
            <CaseHeader f={t} at={0} no={NO} tag={['罪状 03', '伪造日志']} />
            <DateChip f={t} text={DATE} />
            <CaptionBar f={t} at={64} text="日志写了满满一页，〖地一块没扫〗。" />
          </>
        )}
      </Scene>

      {/* 7 证据墙：网点暗角 + 三张带图钉的证据卡依次落下 */}
      <Scene f={f} i={6}>
        {(t) => (
          <>
            <PaperBg fold={false} />
            <Halftone color={H.blue} cx={960} cy={540} radius={[1180, 760]} mode="in" inner={0.42} step={28} maxR={16} power={0.75} />
            <Headline f={t} at={4} text="综上所述" x={960} y={150} size={110} align="center" shadow={H.paperDark} d={5} />
            <div style={{position: 'absolute', left: 400, top: 400}}>
              <EvidenceCard f={t} at={20} color={H.yellow} label="袜子 × 4" rot={-6}>
                <Sock size={110} rot={-10} />
              </EvidenceCard>
            </div>
            <div style={{position: 'absolute', left: 810, top: 380}}>
              <EvidenceCard f={t} at={30} color={H.blue} label="凌晨 3:00" rot={2}>
                <ClockIcon />
              </EvidenceCard>
            </div>
            <div style={{position: 'absolute', left: 1220, top: 420}}>
              <EvidenceCard f={t} at={40} color={H.pink} label="日志 beep" rot={6}>
                <LogIcon />
              </EvidenceCard>
            </div>
            <Headline f={t} at={70} text="罪名成立？" x={960} y={870} size={90} align="center" color={H.red} shadow={H.ink} d={4} />
            <CaseHeader f={t} at={0} no={NO} tag={['综上', '证据链']} dark />
            <DateChip f={t} text={DATE} dark />
          </>
        )}
      </Scene>

      {/* 8 宣判：夜色 + 放射线 + 印章砸下 + 彩纸 */}
      <Scene f={f} i={7}>
        {(t) => (
          <Shake t={t} at={45}>
            <NightBg f={t} />
            <Halftone color="#2b3778" cx={960} cy={540} radius={[1100, 720]} mode="in" inner={0.3} step={24} />
            <Rays f={t} at={44} cx={960} cy={560} />
            <Headline f={t} at={4} text="判决：" x={960} y={170} size={120} align="center" color={H.paper} shadow="#0b1029" d={7} />
            <div style={{position: 'absolute', left: 960, top: 600, transform: 'translate(-50%, -50%)'}}>
              <RubberStamp f={t} at={40} text="缓刑观察" size={150} rot={-6} color={H.pink} seed={5} />
            </div>
            <Confetti f={t} at={45} cx={960} cy={420} />
            <CaseHeader f={t} at={0} no={NO} tag={['宣判', '当庭宣判']} accent="pink" dark />
            <DateChip f={t} text={DATE} dark />
            <CaptionBar f={t} at={80} text="附加条件：〖只许白天上班〗。" dark />
          </Shake>
        )}
      </Scene>

      {/* 9 结案：文件夹 + 睡在上面的嫌疑人 + 对话框 + 结案章 */}
      <Scene f={f} i={8}>
        {(t) => (
          <Shake t={t} at={65}>
            <PaperBg />
            <Halftone color={H.yellow} cx={0} cy={0} radius={540} step={24} />
            <Halftone color={H.blue} cx={1920} cy={1080} radius={580} step={22} />
            <Pop f={t} at={4} x={560} y={600} from={0.6}>
              <CaseFolder w={780} lines={[`案卷 ${NO}`, '嫌疑人：嘟嘟']}>
                <div style={{position: 'absolute', left: 70, top: -222}}>
                  <Robo f={t} size={360} eyes="closed" light={false} id="r8" />
                </div>
              </CaseFolder>
            </Pop>
            {t >= 20 &&
              [0, 1, 2].map((i) => {
                const k = ((t - 20 + i * 18) % 54) / 54;
                return (
                  <div key={i} style={{position: 'absolute', left: 560 - k * 40 + i * 6, top: 400 - k * 90, fontFamily: HF.round, fontSize: 34 + i * 10, opacity: Math.sin(k * Math.PI), ...chunky(H.blue, 2)}}>
                    z
                  </div>
                );
              })}
            <Pop f={t} at={30} x={1000} y={200} from={0.4} origin="0% 100%">
              <Bubble w={660} tail={50}>
                嘟嘟已回到充电座。
                <br />
                它表示：<span style={{color: H.red}}>明晚还来。</span>
              </Bubble>
            </Pop>
            <div style={{position: 'absolute', left: 1090, top: 780}}>
              <RubberStamp f={t} at={60} text="结案" size={110} rot={-8} seed={8} />
            </div>
            <CaseHeader f={t} at={0} no={NO} tag={['结案', '归档']} />
            <DateChip f={t} text={DATE} />
          </Shake>
        )}
      </Scene>

      {/* 场与场之间：网点淹没 */}
      {Array.from({length: 8}, (_, i) => (
        <DotWipe key={i} f={f} at={(i + 1) * LEN - 7} color={WIPE_COLORS[i % 3]} from={WIPE_FROM[i % 4]} />
      ))}
      <PrintGrain f={f} />

      {/* 声音：合成配乐（audio/episodes/library-halftone.mjs）+ 共享音效 */}
      <Audio src={staticFile('audio/library-halftone/bgm.wav')} volume={0.55} />
      {HALFTONE_SFX.map(([name, from, vol], i) => (
        <Sequence key={i} from={from} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
