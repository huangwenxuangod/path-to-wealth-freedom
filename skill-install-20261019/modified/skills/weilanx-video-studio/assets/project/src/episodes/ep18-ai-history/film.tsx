import React from 'react';
import {rand} from '../../library/anim';
import type {SfxCue} from '../../library/types';
import {Big, Doc, Put, RedCheck, RedX} from '../../library/vox/desk';
import {At, Clipping, Desk, HalftonePhoto, HandLine, Highlight, IndexCard, Label, RedCircle, RedLine, shadow, TypeOn, Underline} from '../../library/vox/props';
import {step12, V, VF} from '../../library/vox/theme';
import {camAt, World, type CamKey} from '../../library/vox/VoxShow';
import {cf, cw} from './cues';
import {Chessboard, GoBoard, GpuArt, PerceptronArt, Workstation} from './art';
import {LANE, WINTERS, WORLD_H, WORLD_W, yx} from './timeline';
import {Pins, Scrapbook, YearHud} from './scrapbook';

const W = 1920;
const H = 1080;
const p12 = (f: number, at: number, dur: number) => Math.max(0, Math.min(1, (step12(f) - at) / dur));

/* ============ 相机路线（跟着字幕走） ============ */

const CAM: CamKey[] = [
  // 钩子：贴近 1958 年的剪报
  {f: 0, x: yx(1958) - 10, y: 640, z: 2.3},
  {f: cf(4) - 4, x: yx(1958) + 640, y: 660, z: 2.1, ease: 'sine', dur: 26},
  // 「一等就是六十多年」：沿时间尺一路追到 2022（Vox 的沿红线追踪）
  {f: cf(8) + 20, x: yx(2022), y: 560, z: 0.45, ease: 'tail', dur: 70},
  // 两派：拉到中景，屏幕左边亮出两派
  {f: cf(10) + 10, x: yx(2000), y: 520, z: 0.3, ease: 'sine', dur: 40},
  {f: cf(13) - 6, x: yx(1950) + 120, y: 330, z: 1.3, ease: 'tail', dur: 34},
  {f: cf(16), x: yx(1950) + 120, y: 680, z: 1.3, ease: 'sine', dur: 24},
  // 达特茅斯
  {f: cf(21) - 4, x: yx(1956) - 20, y: 300, z: 1.25, ease: 'tail', dur: 30},
  {f: cf(25), x: yx(1956) - 60, y: 360, z: 1.7, ease: 'sine', dur: 22},
  // 两派分开：拉到中景看两条泳道
  {f: cf(30) - 4, x: yx(1957) + 300, y: 480, z: 0.62, ease: 'tail', dur: 30},
  {f: cf(31), x: yx(1957) + 120, y: 250, z: 1.2, ease: 'sine', dur: 24},
  {f: cf(33), x: yx(1958) + 300, y: 660, z: 1.15, ease: 'sine', dur: 26},
  // 1969 《感知机》
  {f: cf(38) - 4, x: yx(1969) + 140, y: 660, z: 1.2, ease: 'tail', dur: 30},
  // 1973 莱特希尔报告 → 第一次寒冬
  {f: cf(42) - 4, x: yx(1973), y: 280, z: 1.2, ease: 'tail', dur: 30},
  {f: cf(45), x: yx(1976), y: 470, z: 0.62, ease: 'sine', dur: 26},
  // 80 年代专家系统（在第一次寒冬多停一会儿）
  {f: cf(48), x: yx(1983), y: 270, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(51), x: yx(1985), y: 270, z: 1.15, ease: 'sine', dur: 24},
  // 1987 第二次寒冬
  {f: cf(56) - 4, x: yx(1987) + 60, y: 290, z: 1.1, ease: 'tail', dur: 26},
  {f: cf(58), x: yx(1990), y: 470, z: 0.62, ease: 'sine', dur: 24},
  // 1986 反向传播（往回看一眼学习派）
  {f: cf(61) - 4, x: yx(1986) - 40, y: 660, z: 1.2, ease: 'tail', dur: 30},
  {f: cf(63), x: yx(1986) + 380, y: 670, z: 1.3, ease: 'sine', dur: 22},
  // 1997 深蓝
  {f: cf(66) - 4, x: yx(1997), y: 270, z: 1.15, ease: 'tail', dur: 34},
  // 2012 AlexNet
  {f: cf(71) - 4, x: yx(2012), y: 660, z: 1.1, ease: 'tail', dur: 34},
  {f: cf(75), x: yx(2012) + 260, y: 660, z: 1.4, ease: 'sine', dur: 22},
  {f: cf(77), x: yx(2012) + 100, y: 640, z: 1.0, ease: 'sine', dur: 22},
  // 加速段：沿学习派一路往右追
  {f: cf(80) - 4, x: yx(2016), y: 660, z: 1.15, ease: 'tail', dur: 30},
  {f: cf(82) - 4, x: yx(2017), y: 660, z: 1.15, ease: 'tail', dur: 26},
  {f: cf(86) - 4, x: yx(2020), y: 660, z: 1.15, ease: 'tail', dur: 24},
  {f: cf(87) - 4, x: yx(2022), y: 660, z: 1.15, ease: 'tail', dur: 24},
  // 2024 诺贝尔
  {f: cf(91), x: yx(2024), y: 640, z: 1.1, ease: 'tail', dur: 26},
  // 冷板凳到舞台中央：拉远看整条学习派
  {f: cf(94) + 10, x: yx(2016), y: 560, z: 0.3, ease: 'tail', dur: 36},
  // 2026
  {f: cf(96) - 4, x: yx(2026) - 100, y: 640, z: 1.1, ease: 'tail', dur: 36},
  // 回到 1958 年那张剪报
  {f: cf(98) + 40, x: yx(1958) + 640, y: 660, z: 2.1, ease: 'tail', dur: 50},
];

/* ============ 通用小件 ============ */

/** 从卡片底部垂到时间尺上的红线 + 时间尺上的红点 */
const Pin: React.FC<{f: number; at: number; x: number; from: number; year: number}> = ({f, at, x, from, year}) =>
  f < at ? null : (
    <>
      <RedLine f={f} at={at} dur={8} points={[[x, from], [yx(year), LANE.ruler - 4]]} width={4} dot={false} />
      <div style={{position: 'absolute', left: yx(year) - 13, top: LANE.ruler - 13, width: 26, height: 26, borderRadius: 13, background: V.red, opacity: p12(f, at + 8, 3)}} />
    </>
  );

/* ============ 桌面上的东西 ============ */

const Ruler: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: yx(1946), top: LANE.ruler, width: yx(2030) - yx(1946), height: 6, background: V.ink}} />
    {[1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map((y) => (
      <div key={y} style={{position: 'absolute', left: yx(y) - 60, top: LANE.ruler, width: 120, textAlign: 'center'}}>
        <div style={{width: 5, height: 26, background: V.ink, margin: '0 auto'}} />
        <div style={{fontFamily: VF.num, fontSize: 44, color: V.ink, marginTop: 6}}>{y}</div>
      </div>
    ))}
    <div style={{position: 'absolute', left: yx(1946), top: LANE.divider, width: yx(2030) - yx(1946), borderTop: '4px dashed rgba(23,23,22,0.28)'}} />
  </>
);

/** 寒冬：一层霜从上往下盖住这几年 */
const Frost: React.FC<{f: number; at: number; from: number; to: number; name: string}> = ({f, at, from, to, name}) => {
  if (f < at) return null;
  const p = p12(f, at, 18);
  const x0 = yx(from);
  const w = yx(to) - x0;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x0,
          top: 0,
          width: w,
          height: LANE.ruler * p,
          background: 'rgba(160,186,206,0.42)',
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 26px)',
          borderLeft: '3px solid rgba(110,140,165,0.6)',
          borderRight: '3px solid rgba(110,140,165,0.6)',
        }}
      />
      {Array.from({length: 26}, (_, i) => {
        const fall = (step12(f) - at) * 1.6 + rand(i * 3.1) * 900;
        return <div key={i} style={{position: 'absolute', left: x0 + rand(i * 7.7) * w, top: (fall % 860) + 10, width: 10, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.85)', opacity: p}} />;
      })}
      <div style={{position: 'absolute', left: x0 + w / 2, top: 360, transform: 'translateX(-50%)', opacity: p12(f, at + 10, 4)}}>
        <Label size={64} bg={V.ink}>
          {name} {from}–{to}
        </Label>
      </div>
    </>
  );
};

/** 钩子：1958 年《纽约时报》剪报 + 感知机照片 + 译文索引卡 */
const Hook1958: React.FC<{f: number}> = ({f}) => {
  const x = yx(1958);
  return (
    <>
      <Put x={x - 430} y={LANE.learnTop + 10} scale={0.62}>
        <Clipping
          w={760}
          h={500}
          seed={58}
          date="THE NEW YORK TIMES, TUESDAY, JULY 8, 1958"
          head="NEW NAVY DEVICE LEARNS BY DOING"
          sub={
            <>
              Psychologist Shows{' '}
              <Highlight f={f} at={cw(3, '胚胎')} w={88} h={34}>
                Embryo
              </Highlight>{' '}
              of Computer Designed to Read and Grow Wiser
            </>
          }
          headSize={66}
          lines={4}
        />
      </Put>
      <Put x={x - 430} y={LANE.learnTop - 50}>
        <Label size={26}>1958 · 纽约时报</Label>
      </Put>
      <RedCircle f={f} at={cf(3) + 10} cx={x - 230} cy={LANE.learnTop + 105} rx={210} ry={58} seed={5} width={5} />
      <Put x={x + 90} y={LANE.learnTop - 20}>
        <HalftonePhoto w={300} h={210} rot={-2} caption="感知机 Mark I（示意）" dot={6}>
          <PerceptronArt w={300} h={210} />
        </HalftonePhoto>
      </Put>
      <Put x={x + 450} y={LANE.learnTop + 6}>
        <IndexCard w={430} h={300} rot={2}>
          <div style={{fontFamily: VF.serifCn, fontSize: 30, lineHeight: 1.55, color: V.ink, position: 'relative'}}>
            <TypeOn f={f} at={cf(4)} text="将来它能走路、能说话、" cps={9} cursor={false} />
            <br />
            {f >= cf(5) && <TypeOn f={f} at={cf(5)} text="能看东西、能写字，" cps={9} cursor={false} />}
            <br />
            {f >= cf(6) && (
              <Highlight f={f} at={cw(6, '意识')} w={330} h={44}>
                <TypeOn f={f} at={cf(6)} text="甚至能意识到自己的存在。" cps={10} cursor={false} />
              </Highlight>
            )}
          </div>
        </IndexCard>
      </Put>
      {/* 结尾回来逐条对账 */}
      <RedCheck f={f} at={cw(99, '会说话')} x={x + 840} y={LANE.learnTop + 70} />
      <RedCheck f={f} at={cw(99, '能看东西')} x={x + 660} y={LANE.learnTop + 118} />
      <RedCheck f={f} at={cw(99, '会写字')} x={x + 790} y={LANE.learnTop + 118} />
      <RedCircle f={f} at={cf(101)} cx={x + 690} cy={LANE.learnTop + 172} rx={220} ry={32} seed={8} width={5} />
      <At f={f} at={cf(102)}>
        <Put x={x + 880} y={LANE.learnTop + 120}>
          <div style={{fontFamily: VF.num, fontSize: 160, color: V.red, lineHeight: 1, transform: 'rotate(8deg)'}}>?</div>
        </Put>
      </At>
    </>
  );
};

/** 「一等就是六十多年」：相机沿时间尺追，红线跟着画到 2022 */
const SixtyYears: React.FC<{f: number}> = ({f}) => {
  const at = cf(8) + 20 - 70;
  if (f < at || f >= cf(13)) return null;
  return (
    <>
      <RedLine f={f} at={at} dur={70} points={[[yx(1958), LANE.ruler - 40], [yx(2022), LANE.ruler - 40]]} width={22} />
      <At f={f} at={cf(9)}>
        <Put x={yx(2022) - 180} y={60}>
          <div style={{fontFamily: VF.num, fontSize: 700, color: V.red, lineHeight: 1}}>?</div>
        </Put>
      </At>
    </>
  );
};

/** 屏幕上的大字：「等了 64 年」 */
const SixtyYearsTitle: React.FC<{f: number}> = ({f}) =>
  f < cf(8) || f >= cf(10) ? null : (
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
      <Label size={110} bg={V.red}>
        一等就是 64 年
      </Label>
    </div>
  );

/** 1950 图灵 */
const Turing1950: React.FC<{f: number}> = ({f}) => {
  const x = yx(1950);
  const at = cf(13) - 6;
  return (
    <At f={f} at={at}>
      <Put x={x - 260} y={70}>
        <Doc w={620} h={380} color="#efe8d6">
          <div style={{fontFamily: VF.body, fontSize: 20, letterSpacing: 3, textAlign: 'center', color: V.inkSoft}}>VOL. LIX. No. 236.] · OCTOBER, 1950</div>
          <div style={{fontFamily: VF.head, fontSize: 48, textAlign: 'center', marginTop: 4}}>MIND</div>
          <div style={{borderTop: `2px solid ${V.ink}`, margin: '10px 0'}} />
          <div style={{fontFamily: VF.bodyBold, fontSize: 28, textAlign: 'center'}}>COMPUTING MACHINERY AND INTELLIGENCE</div>
          <div style={{fontFamily: VF.body, fontSize: 22, textAlign: 'center', marginTop: 4}}>By A. M. TURING</div>
          <div style={{fontFamily: VF.body, fontSize: 26, marginTop: 18, lineHeight: 1.4}}>
            I PROPOSE to consider the question,{' '}
            <Highlight f={f} at={cw(15, '机器能思考')} w={300} h={34}>
              ‘Can machines think?’
            </Highlight>
          </div>
        </Doc>
      </Put>
      <Put x={x - 340} y={20}>
        <Label size={28}>1950 · 图灵</Label>
      </Put>
      {/* 模仿游戏 */}
      <At f={f} at={cf(17)}>
        <Put x={x - 220} y={LANE.learnTop + 20}>
          <IndexCard w={640} h={300}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, fontFamily: VF.serifCn, color: V.ink}}>
              <div style={{fontSize: 34, textAlign: 'center'}}>
                <svg width={90} height={90} viewBox="0 0 90 90">
                  <circle cx={45} cy={28} r={18} fill={V.ink} />
                  <path d="M10 88 Q12 52 45 52 Q78 52 80 88 Z" fill={V.ink} />
                </svg>
                <div>提问的人</div>
              </div>
              <div style={{width: 6, height: 150, background: V.ink}} />
              <div style={{fontSize: 30, lineHeight: 1.6}}>
                <div style={{border: `3px solid ${V.ink}`, padding: '4px 14px', marginBottom: 12}}>A：？</div>
                <div style={{border: `3px solid ${V.ink}`, padding: '4px 14px'}}>B：？</div>
              </div>
              <div style={{fontFamily: VF.hand, fontSize: 40, color: V.red, transform: 'rotate(-4deg)'}}>
                {f >= cf(19) ? '人？机器？' : ''}
              </div>
            </div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(20)}>
        <Put x={x + 140} y={LANE.learnTop + 300}>
          <Label size={30} bg={V.red}>分不出来，就算它会思考</Label>
        </Put>
      </At>
    </At>
  );
};

/** 1955 达特茅斯提案 */
const Dartmouth: React.FC<{f: number}> = ({f}) => {
  const x = yx(1956);
  const at = cf(21) - 6;
  return (
    <At f={f} at={at}>
      <Put x={x - 360} y={60}>
        <Doc w={700} h={400}>
          <div style={{fontFamily: `'Courier New', monospace`, fontSize: 21, lineHeight: 1.45}}>
            <div style={{textAlign: 'center', fontWeight: 700}}>
              A PROPOSAL FOR THE DARTMOUTH SUMMER RESEARCH PROJECT ON{' '}
              <Highlight f={f} at={cw(27, '人工智能')} w={330} h={26}>
                ARTIFICIAL INTELLIGENCE
              </Highlight>
            </div>
            <div style={{marginTop: 12}}>J. McCarthy, Dartmouth College</div>
            <div>M. L. Minsky, Harvard University</div>
            <div>N. Rochester, I.B.M. Corporation</div>
            <div>C.E. Shannon, Bell Telephone Laboratories</div>
            <div style={{marginTop: 4}}>August 31, 1955</div>
            <div style={{marginTop: 12}}>
              We propose that a <span style={{position: 'relative'}}>2 month, 10 man study</span> of artificial intelligence be carried out during the summer of 1956 at Dartmouth College …
            </div>
          </div>
        </Doc>
      </Put>
      <Put x={x - 440} y={14}>
        <Label size={28}>1955 · 达特茅斯提案</Label>
      </Put>
      <RedCircle f={f} at={cw(25, '两个月')} cx={x - 30} cy={358} rx={170} ry={30} seed={11} width={5} />
      {[0, 1, 2, 3].map((i) => (
        <Underline key={i} f={f} at={cw(22, '麦卡锡') + i * 5} x={x - 336} y={196 + i * 30} w={160} seed={20 + i} />
      ))}
      <At f={f} at={cf(28)}>
        <Put x={x + 380} y={120}>
          <div style={{fontFamily: VF.hand, fontSize: 50, color: V.red, transform: 'rotate(-6deg)', width: 260, lineHeight: 1.1}}>
            {'这个词'}
            <br />
            {'第一次出现'}
          </div>
        </Put>
      </At>
    </At>
  );
};

/** 两派分开：规则卡 */
const RulesCard: React.FC<{f: number}> = ({f}) => (
  <At f={f} at={cf(31)}>
    <Put x={yx(1957) - 120} y={110}>
      <IndexCard w={520} h={300} rot={-2}>
        <div style={{fontFamily: VF.serifCn, fontSize: 32, lineHeight: 1.6, color: V.ink}}>
          <TypeOn f={f} at={cf(32)} text="如果 有羽毛 并且 会下蛋" cps={12} cursor={false} />
          <br />
          {f >= cf(32) + 20 && <TypeOn f={f} at={cf(32) + 20} text="那么 它是鸟" cps={12} cursor={false} />}
        </div>
        <div style={{fontFamily: VF.hand, fontSize: 34, color: V.red, marginTop: 16}}>{f >= cw(31, '逻辑') ? '智能 = 逻辑' : ''}</div>
      </IndexCard>
    </Put>
  </At>
);

/** 1969 《感知机》 */
const Perceptrons1969: React.FC<{f: number}> = ({f}) => {
  const x = yx(1969);
  return (
    <At f={f} at={cf(38) - 6}>
      <Put x={x - 260} y={LANE.learnTop + 10}>
        <div style={{width: 280, height: 340, background: '#7a2a28', filter: shadow, color: '#f1e3c8', padding: 24, boxSizing: 'border-box', fontFamily: VF.head}}>
          <div style={{fontSize: 44, lineHeight: 1}}>PERCEP­TRONS</div>
          <div style={{fontFamily: VF.body, fontSize: 18, marginTop: 10}}>An Introduction to Computational Geometry</div>
          <div style={{borderTop: '2px solid #f1e3c8', margin: '30px 0 10px'}} />
          <div style={{fontFamily: VF.body, fontSize: 22}}>Marvin Minsky</div>
          <div style={{fontFamily: VF.body, fontSize: 22}}>Seymour Papert</div>
          <div style={{fontFamily: VF.body, fontSize: 18, marginTop: 30}}>1969</div>
        </div>
      </Put>
      <At f={f} at={cf(40)}>
        <Put x={x + 60} y={LANE.learnTop + 20}>
          <IndexCard w={330} h={280}>
            <svg width={280} height={170} viewBox="0 0 280 170">
              {[
                [60, 40, 1],
                [220, 130, 1],
                [60, 130, 0],
                [220, 40, 0],
              ].map(([cx, cy, k], i) => (
                <circle key={i} cx={cx} cy={cy} r={18} fill={k ? V.ink : 'none'} stroke={V.ink} strokeWidth={5} />
              ))}
            </svg>
            <div style={{fontFamily: VF.serifCn, fontSize: 24, color: V.ink}}>一条直线分不开（异或）</div>
          </IndexCard>
        </Put>
      </At>
      <RedLine f={f} at={cw(40, '解决不了')} dur={10} points={[[x + 70, LANE.learnTop + 190], [x + 370, LANE.learnTop + 110]]} dot={false} width={6} />
      <RedX f={f} at={cw(40, '解决不了') + 12} x={x + 220} y={LANE.learnTop + 150} s={50} />
      <At f={f} at={cw(41, '经费')}>
        <Put x={x - 260} y={LANE.learnTop - 90}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Label size={34} bg={V.red}>学习派经费</Label>
            <svg width={80} height={80} style={{overflow: 'visible'}}>
              <HandLine points={[[40, 0], [40, 64]]} p={p12(f, cw(41, '经费'), 8)} width={8} />
              <HandLine points={[[14, 40], [40, 72], [66, 40]]} p={p12(f, cw(41, '经费') + 8, 6)} width={8} dot={false} />
            </svg>
          </div>
        </Put>
      </At>
    </At>
  );
};

/** 1973 莱特希尔报告 */
const Lighthill1973: React.FC<{f: number}> = ({f}) => {
  const x = yx(1973);
  return (
    <At f={f} at={cf(42) - 6}>
      <Put x={x - 330} y={70}>
        <Doc w={640} h={360} color="#f1ead9">
          <div style={{fontFamily: VF.bodyBold, fontSize: 30, textAlign: 'center'}}>ARTIFICIAL INTELLIGENCE: A GENERAL SURVEY</div>
          <div style={{fontFamily: VF.body, fontSize: 22, textAlign: 'center', marginTop: 6}}>by Sir James Lighthill · 1973</div>
          <div style={{borderTop: `2px solid ${V.ink}`, margin: '14px 0'}} />
          <div style={{fontFamily: VF.body, fontSize: 28, lineHeight: 1.45}}>
            “In no part of the field have the discoveries made so far produced{' '}
            <Highlight f={f} at={cw(44, '重大影响')} w={340} h={36}>
              the major impact that was then promised.
            </Highlight>
            ”
          </div>
        </Doc>
      </Put>
      <Put x={x - 410} y={20}>
        <Label size={28}>1973 · 英国 · 莱特希尔报告</Label>
      </Put>
    </At>
  );
};

/** 80 年代：专家系统 */
const Expert80s: React.FC<{f: number}> = ({f}) => {
  const x = yx(1982);
  const cards = 7;
  const fan = p12(f, cw(50, '成千上万'), 14);
  return (
    <At f={f} at={cf(47) - 6}>
      <Put x={x - 360} y={20}>
        <Label size={28}>80 年代 · 专家系统</Label>
      </Put>
      {Array.from({length: cards}, (_, i) => (
        <Put key={i} x={x - 300 + i * 26 * fan} y={80 + i * 6 * fan}>
          <IndexCard w={460} h={270} rot={-4 + i * 1.6 * fan}>
            <div style={{fontFamily: VF.serifCn, fontSize: 26, lineHeight: 1.5, color: V.ink}}>
              规则 #{[12, 87, 305, 1024, 2310, 4096, 9871][i]}
              <br />
              如果 发烧 并且 咳嗽
              <br />
              那么 ……
            </div>
          </IndexCard>
        </Put>
      ))}
      <At f={f} at={cf(51)}>
        <Put x={yx(1985) - 120} y={60}>
          <Label size={28} bg={V.red}>1985 · 企业投入</Label>
          <Big size={130}>{f >= cw(52, '10 亿') ? '10 亿美元+' : ''}</Big>
        </Put>
      </At>
      <At f={f} at={cw(54, '出错')}>
        <Put x={x - 60} y={300}>
          <div style={{fontFamily: VF.hand, fontSize: 54, color: V.red, transform: 'rotate(-5deg)'}}>没见过的情况 → 出错</div>
        </Put>
      </At>
    </At>
  );
};

/** 1987：专用 AI 机器卖不动了 */
const Lisp1987: React.FC<{f: number}> = ({f}) => {
  const x = yx(1987);
  return (
    <At f={f} at={cf(56) - 6}>
      <Put x={x - 280} y={70}>
        <HalftonePhoto w={340} h={240} rot={2} caption="专跑 AI 程序的机器（示意）" dot={6}>
          <Workstation w={340} h={240} />
        </HalftonePhoto>
      </Put>
      <Put x={x - 330} y={20}>
        <Label size={28}>1987</Label>
      </Put>
      <At f={f} at={cw(57, '卖不动')}>
        <Put x={x + 110} y={240}>
          <div style={{transform: 'rotate(-10deg)', border: `6px solid ${V.red}`, color: V.red, fontFamily: VF.heavy, fontSize: 56, padding: '2px 20px'}}>卖不动了</div>
        </Put>
      </At>
    </At>
  );
};

/** 1986 反向传播 */
const Backprop1986: React.FC<{f: number}> = ({f}) => {
  const x = yx(1986);
  const nodes = [3, 4, 2];
  const back = p12(f, cw(64, '修正'), 18);
  return (
    <At f={f} at={cf(61) - 6}>
      <Put x={x - 340} y={LANE.learnTop + 10}>
        <Doc w={500} h={300} color="#f3efe6">
          <div style={{fontFamily: VF.bodyBold, fontSize: 22, letterSpacing: 2, color: V.red}}>NATURE · VOL 323 · 9 OCTOBER 1986</div>
          <div style={{fontFamily: VF.head, fontSize: 34, lineHeight: 1.15, marginTop: 10}}>
            Learning representations by{' '}
            <Highlight f={f} at={cw(62, '反向传播')} w={330} h={40}>
              back-propagating errors
            </Highlight>
          </div>
          <div style={{fontFamily: VF.body, fontSize: 22, marginTop: 14}}>David E. Rumelhart, Geoffrey E. Hinton & Ronald J. Williams</div>
        </Doc>
      </Put>
      <Put x={x - 420} y={LANE.learnTop - 46}>
        <Label size={28}>1986 · 《自然》</Label>
      </Put>
      <Underline f={f} at={cw(61, '辛顿')} x={x - 180} y={LANE.learnTop + 240} w={210} />
      <At f={f} at={cf(63)}>
        <Put x={x + 220} y={LANE.learnTop + 20}>
          <IndexCard w={420} h={300}>
            <svg width={370} height={200} viewBox="0 0 370 200" style={{overflow: 'visible'}}>
              {nodes.map((n, l) =>
                Array.from({length: n}, (_, i) => {
                  const cx = 40 + l * 145;
                  const cy = 100 + (i - (n - 1) / 2) * 46;
                  return (
                    <g key={`${l}${i}`}>
                      {l < nodes.length - 1 &&
                        Array.from({length: nodes[l + 1]}, (_, j) => <line key={j} x1={cx} y1={cy} x2={cx + 145} y2={100 + (j - (nodes[l + 1] - 1) / 2) * 46} stroke={V.ink} strokeWidth={2} opacity={0.6} />)}
                      <circle cx={cx} cy={cy} r={14} fill={V.paper} stroke={V.ink} strokeWidth={4} />
                    </g>
                  );
                }),
              )}
            </svg>
            <svg width={370} height={40} style={{overflow: 'visible', marginTop: -10}}>
              <HandLine points={[[330, 20], [40, 20]]} p={back} width={6} />
            </svg>
            <div style={{fontFamily: VF.hand, fontSize: 30, color: V.red}}>{back > 0 ? '错误一层层往回传' : ''}</div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cw(65, '地基')}>
        <Put x={x + 240} y={LANE.learnTop - 46}>
          <Label size={28} bg={V.red}>深度学习的地基</Label>
        </Put>
      </At>
    </At>
  );
};

/** 1997 深蓝 */
const DeepBlue1997: React.FC<{f: number}> = ({f}) => {
  const x = yx(1997);
  return (
    <At f={f} at={cf(66) - 6}>
      <Put x={x - 420} y={70}>
        <HalftonePhoto w={330} h={250} rot={-2} caption="1997 · 纽约（示意）" dot={6}>
          <Chessboard w={330} h={250} />
        </HalftonePhoto>
      </Put>
      <Put x={x - 460} y={20}>
        <Label size={28}>1997 · IBM 深蓝 vs 卡斯帕罗夫</Label>
      </Put>
      <At f={f} at={cw(67, '3.5')}>
        <Put x={x + 0} y={90}>
          <Big size={150}>3.5 : 2.5</Big>
          <div style={{fontFamily: VF.serifCn, fontSize: 32, color: V.ink, marginTop: 6}}>首次在正式比赛中击败在任世界冠军</div>
        </Put>
      </At>
      <At f={f} at={cf(69)}>
        <Put x={x + 20} y={290}>
          <div style={{display: 'flex', gap: 30, fontFamily: VF.serifCn, fontSize: 34, color: V.ink}}>
            {['下棋', '认图', '翻译', '聊天'].map((t) => (
              <div key={t}>{t}</div>
            ))}
          </div>
        </Put>
      </At>
      {[1, 2, 3].map((i) => (
        <RedX key={i} f={f} at={cw(70, '什么也不会') + i * 4} x={x + 52 + i * 98} y={316} s={26} />
      ))}
      {f >= cf(69) + 6 && <RedCheck f={f} at={cf(69) + 6} x={x + 52} y={310} s={22} />}
    </At>
  );
};

/** 2012 AlexNet */
const AlexNet2012: React.FC<{f: number}> = ({f}) => {
  const x = yx(2012);
  const bars = [
    {name: '第二名', v: 26.2, at: () => cw(75, '26%'), c: '#8a847c'},
    {name: '辛顿团队', v: 15.3, at: () => cw(76, '15%'), c: V.red},
  ];
  return (
    <At f={f} at={cf(71) - 6}>
      <Put x={x - 420} y={LANE.learnTop + 20}>
        <HalftonePhoto w={330} h={220} rot={-2} caption="两块游戏显卡（示意）" dot={6}>
          <GpuArt w={330} h={220} />
        </HalftonePhoto>
      </Put>
      <Put x={x - 460} y={LANE.learnTop - 46}>
        <Label size={28}>2012 · ImageNet 图片识别比赛</Label>
      </Put>
      <At f={f} at={cf(74)}>
        <Put x={x + 20} y={LANE.learnTop + 10}>
          <IndexCard w={440} h={320}>
            <div style={{fontFamily: VF.serifCn, fontSize: 26, color: V.inkSoft, marginTop: -20}}>错误率（越低越好）</div>
            {bars.map((b) => {
              const p = p12(f, b.at(), 14);
              return (
                <div key={b.name} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 24, opacity: f >= b.at() ? 1 : 0}}>
                  <div style={{fontFamily: VF.serifCn, fontSize: 26, width: 110, color: V.ink}}>{b.name}</div>
                  <div style={{height: 46, width: b.v * 9 * p, background: b.c}} />
                  <div style={{fontFamily: VF.num, fontSize: 44, color: b.c}}>{(b.v * p).toFixed(1)}%</div>
                </div>
              );
            })}
          </IndexCard>
        </Put>
      </At>
      {['数据', '算力', '算法'].map((t, i) => (
        <At key={t} f={f} at={cw(77, t)}>
          <Put x={x - 380 + i * 250} y={LANE.learnTop - 120}>
            <div style={{fontFamily: VF.heavy, fontSize: 60, color: V.ink}}>{t}</div>
          </Put>
          <RedCircle f={f} at={cw(77, t)} cx={x - 320 + i * 250} cy={LANE.learnTop - 82} rx={88} ry={46} seed={30 + i} width={5} />
        </At>
      ))}
    </At>
  );
};

/** 加速段：2016 / 2017 / 2020 / 2022 */
const Montage: React.FC<{f: number}> = ({f}) => (
  <>
    <At f={f} at={cf(80) - 6}>
      <Put x={yx(2016) - 380} y={LANE.learnTop - 46}>
        <Label size={28}>2016 · 首尔</Label>
      </Put>
      <Put x={yx(2016) - 380} y={LANE.learnTop + 20}>
        <HalftonePhoto w={300} h={240} rot={2} caption="AlphaGo vs 李世石（示意）" dot={6}>
          <GoBoard w={300} h={240} />
        </HalftonePhoto>
      </Put>
      <At f={f} at={cw(80, '4 比 1')}>
        <Put x={yx(2016) + 0} y={LANE.learnTop + 20}>
          <Big size={160}>4 : 1</Big>
        </Put>
      </At>
      <At f={f} at={cw(81, '2 亿')}>
        <Put x={yx(2016) + 0} y={LANE.learnTop + 200}>
          <div style={{fontFamily: VF.serifCn, fontSize: 36, color: V.ink}}>全球 2 亿+ 人观看</div>
          <div style={{fontFamily: VF.body, fontSize: 20, color: V.inkSoft}}>据 DeepMind</div>
        </Put>
      </At>
    </At>
    <At f={f} at={cf(82) - 6}>
      <Put x={yx(2017) - 300} y={LANE.learnTop - 46}>
        <Label size={28}>2017 · 谷歌</Label>
      </Put>
      <Put x={yx(2017) - 300} y={LANE.learnTop + 10}>
        <Doc w={600} h={330}>
          <div style={{fontFamily: VF.head, fontSize: 40, textAlign: 'center'}}>Attention Is All You Need</div>
          <div style={{fontFamily: VF.body, fontSize: 17, textAlign: 'center', marginTop: 8, lineHeight: 1.35, color: V.inkSoft}}>
            Ashish Vaswani · Noam Shazeer · Niki Parmar · Jakob Uszkoreit · Llion Jones · Aidan N. Gomez · Łukasz Kaiser · Illia Polosukhin
          </div>
          <div style={{fontFamily: VF.body, fontSize: 24, marginTop: 16, lineHeight: 1.4}}>
            We propose a new simple network architecture,{' '}
            <Highlight f={f} at={cw(84, 'Transformer')} w={190} h={32}>
              the Transformer
            </Highlight>
            , based solely on attention mechanisms …
          </div>
        </Doc>
      </Put>
    </At>
    <At f={f} at={cf(86) - 6}>
      <Put x={yx(2020) - 320} y={LANE.learnTop - 46}>
        <Label size={28}>2020 · GPT-3</Label>
      </Put>
      <Put x={yx(2020) - 320} y={LANE.learnTop + 30}>
        <Big size={150}>{f >= cw(86, '1750') ? '1750 亿' : ''}</Big>
        <div style={{fontFamily: VF.serifCn, fontSize: 40, color: V.ink, marginTop: 10}}>{f >= cw(86, '1750') ? '个参数' : ''}</div>
      </Put>
    </At>
    <At f={f} at={cf(87) - 6}>
      <Put x={yx(2022) - 330} y={LANE.learnTop - 46}>
        <Label size={28}>2022.11.30 · ChatGPT 上线</Label>
      </Put>
      <Put x={yx(2022) - 330} y={LANE.learnTop + 20}>
        <Doc w={420} h={260} color="#f7f7f5">
          <div style={{fontFamily: VF.bodyBold, fontSize: 26}}>ChatGPT</div>
          <div style={{marginTop: 16, background: '#e9e6df', borderRadius: 14, padding: '8px 14px', fontFamily: VF.serifCn, fontSize: 24, width: 'fit-content', marginLeft: 'auto'}}>你好，能帮我写首诗吗？</div>
          <div style={{marginTop: 12, fontFamily: VF.serifCn, fontSize: 24, lineHeight: 1.5}}>
            <TypeOn f={f} at={cf(87) + 10} text="当然可以。春风拂过……" cps={10} />
          </div>
        </Doc>
      </Put>
      <At f={f} at={cf(88)}>
        <Put x={yx(2022) + 140} y={LANE.learnTop + 10}>
          <Big size={140}>1 亿</Big>
          <div style={{fontFamily: VF.serifCn, fontSize: 34, color: V.ink}}>用户 · 两个月</div>
          <div style={{fontFamily: VF.body, fontSize: 22, color: V.inkSoft}}>瑞银（UBS）估计</div>
        </Put>
      </At>
    </At>
  </>
);

/** 2024 诺贝尔 + 2026 十亿 */
const Nobel2024: React.FC<{f: number}> = ({f}) => {
  const x = yx(2024);
  const medal = (title: string, names: string, at: number, dx: number) => (
    <At f={f} at={at}>
      <Put x={x + dx} y={LANE.learnTop + 10}>
        <IndexCard w={360} h={300}>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', marginTop: -20}}>
            <svg width={90} height={90}>
              <circle cx={45} cy={45} r={40} fill="#c9a24a" stroke={V.ink} strokeWidth={4} />
              <circle cx={45} cy={45} r={28} fill="none" stroke="#8c6d22" strokeWidth={3} />
            </svg>
            <div style={{fontFamily: VF.heavy, fontSize: 30, color: V.ink}}>{title}</div>
          </div>
          <div style={{fontFamily: VF.body, fontSize: 26, color: V.ink, marginTop: 14, lineHeight: 1.4}}>{names}</div>
        </IndexCard>
      </Put>
    </At>
  );
  return (
    <At f={f} at={cf(90) - 6}>
      <Put x={x - 420} y={LANE.learnTop - 46}>
        <Label size={28}>2024 · 诺贝尔奖</Label>
      </Put>
      {medal('物理学奖', 'John Hopfield\nGeoffrey Hinton'.replace('\n', ' · '), cf(91), -420)}
      {medal('化学奖', 'Demis Hassabis · John Jumper（AlphaFold）· David Baker', cf(92), -20)}
      <Underline f={f} at={cw(91, '辛顿')} x={x - 300} y={LANE.learnTop + 200} w={200} />
    </At>
  );
};

const Billion2026: React.FC<{f: number}> = ({f}) => (
  <At f={f} at={cf(96) - 6}>
    <Put x={yx(2026) - 420} y={LANE.learnTop - 46}>
      <Label size={28} bg={V.red}>2026 · 今年</Label>
    </Put>
    <Put x={yx(2026) - 420} y={LANE.learnTop + 20}>
      <Big size={190}>{f >= cf(96) + 12 ? '10 亿+' : ''}</Big>
      <div style={{fontFamily: VF.serifCn, fontSize: 38, color: V.ink}}>{f >= cf(96) + 12 ? '每周使用 ChatGPT 的人' : ''}</div>
      <div style={{fontFamily: VF.body, fontSize: 22, color: V.inkSoft}}>{f >= cf(96) + 12 ? '据 OpenAI，2026 年 8 月' : ''}</div>
    </Put>
  </At>
);

/** 学习派那条红线：从感知机一路连到今天，「冷板凳 → 舞台中央」时整条亮起来 */
const LearnThread: React.FC<{f: number}> = ({f}) => {
  const at = cf(94);
  if (f < at || f >= cf(97)) return null;
  const pts: [number, number][] = [1958, 1969, 1986, 2012, 2016, 2017, 2020, 2022, 2024, 2026].map((y, i) => [yx(y), LANE.ruler - 60 - (i > 2 ? (i - 2) * 30 : 0)]);
  return <RedLine f={f} at={at + 10} dur={20} points={pts} width={26} />;
};

/* ============ 屏幕上的泳道标签（跟着相机走） ============ */

const LaneHud: React.FC<{f: number; cam: {x: number; y: number; z: number}}> = ({f, cam}) => {
  if (f < cf(11) || f >= cf(103)) return null;
  const sy = (wy: number) => (wy - cam.y) * cam.z + H / 2;
  const big = cam.z < 0.35;
  const items = [
    {t: '规则派', d: '把规则一条条教给机器', y: sy(LANE.rulesTop), bg: V.ink, at: cf(11)},
    {t: '学习派', d: '让机器自己去学', y: sy(LANE.learnTop), bg: V.red, at: cf(12)},
  ];
  return (
    <>
      {items.map((it) =>
        f < it.at ? null : (
          <div key={it.t} style={{position: 'absolute', left: 36, top: Math.max(20, Math.min(840, it.y + (big ? 30 : 10)))}}>
            <Label size={big ? 64 : 30} bg={it.bg}>
              {it.t}
            </Label>
            {big && <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 44, color: V.ink, marginTop: 10, background: 'rgba(238,237,237,0.85)', padding: '2px 12px', display: 'inline-block'}}>{it.d}</div>}
          </div>
        ),
      )}
    </>
  );
};

/* ============ 结尾黑卡 ============ */

const EndCard: React.FC<{f: number}> = ({f}) =>
  f < cf(103) ? null : (
    <div style={{position: 'absolute', inset: 0}}>
      <Desk w={W} h={H} seed={2} />
      <div style={{position: 'absolute', left: 90, top: 70, width: W - 180, height: H - 260, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
      <div style={{position: 'absolute', left: 200, top: 220, color: V.paper}}>
        <Label size={44} bg={V.red}>
          AI 七十年 · 1950–2026
        </Label>
        <div style={{fontFamily: VF.heavy, fontSize: 120, marginTop: 40}}>
          <TypeOn f={f} at={cf(104)} text="我们下期再见" cps={10} cursor={false} />
        </div>
      </div>
      <Underline f={f} at={cf(104) + 20} x={200} y={560} w={760} />
    </div>
  );

/* ============ 整片 ============ */

export const Film: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, CAM);
  return (
    <>
      <World cam={cam} w={W} h={H}>
        <Desk w={WORLD_W} h={WORLD_H + 400} color={V.oldMap} seed={6} />
        <Ruler />
        {WINTERS.map((w, i) => (
          <Frost key={w.name} f={f} at={i ? cf(57) + 10 : cf(45) + 4} from={w.from} to={w.to} name={w.name} />
        ))}
        <Scrapbook f={f} />
        <Hook1958 f={f} />
        <Pin f={f} at={cf(1)} x={yx(1958) - 190} from={LANE.learnTop + 320} year={1958} />
        <SixtyYears f={f} />
        <Turing1950 f={f} />
        <Pin f={f} at={cf(13)} x={yx(1950) + 50} from={LANE.learnTop + 320} year={1950} />
        <Dartmouth f={f} />
        <Pin f={f} at={cf(21)} x={yx(1956) - 10} from={460} year={1955} />
        <RulesCard f={f} />
        <Perceptrons1969 f={f} />
        <Pin f={f} at={cf(38)} x={yx(1969) - 120} from={LANE.learnTop + 350} year={1969} />
        <Lighthill1973 f={f} />
        <Pin f={f} at={cf(42)} x={yx(1973) - 10} from={430} year={1973} />
        <Expert80s f={f} />
        <Lisp1987 f={f} />
        <Backprop1986 f={f} />
        <Pin f={f} at={cf(61)} x={yx(1986) - 90} from={LANE.learnTop + 310} year={1986} />
        <DeepBlue1997 f={f} />
        <Pin f={f} at={cf(66)} x={yx(1997) - 250} from={360} year={1997} />
        <AlexNet2012 f={f} />
        <Pin f={f} at={cf(71)} x={yx(2012) - 250} from={LANE.learnTop + 290} year={2012} />
        <Montage f={f} />
        <Nobel2024 f={f} />
        <Billion2026 f={f} />
        <LearnThread f={f} />
        <Pins
          at={[
            [yx(1950) + 50, 82],
            [yx(1956) - 10, 72],
            [yx(1957) + 140, 112],
            [yx(1973) - 10, 82],
            [yx(1986) - 90, LANE.learnTop + 22],
            [yx(2017), LANE.learnTop + 22],
            [yx(2022) - 120, LANE.learnTop + 32],
          ]}
        />
      </World>
      <LaneHud f={f} cam={cam} />
      <YearHud f={f} cam={cam} />
      <SixtyYearsTitle f={f} />
      <EndCard f={f} />
    </>
  );
};

/* ============ 音效 ============ */

export const FILM_SFX: SfxCue[] = [
  ['paper', cf(1), 0.35],
  ['pop', cw(3, '胚胎'), 0.25],
  ['type', cf(4), 0.3],
  ['type', cf(6), 0.25],
  ['whoosh', cf(8) - 40, 0.4],
  ['snip', cf(8) + 10, 0.3],
  ['question', cf(9), 0.35],
  ['pop', cf(11), 0.3],
  ['pop', cf(12), 0.3],
  ['whoosh', cf(13) - 40, 0.35],
  ['paper', cf(13) - 6, 0.3],
  ['click', cw(15, '机器能思考'), 0.3],
  ['paper', cf(17), 0.3],
  ['whoosh', cf(21) - 34, 0.35],
  ['type', cf(22), 0.3],
  ['ding', cw(27, '人工智能'), 0.4],
  ['whoosh', cf(30) - 34, 0.3],
  ['type', cf(32), 0.3],
  ['whoosh', cf(33) - 26, 0.25],
  ['paper', cf(38) - 6, 0.3],
  ['error', cw(40, '解决不了') + 12, 0.35],
  ['paper', cf(42) - 6, 0.3],
  ['shake', cf(45) + 4, 0.35],
  ['paper', cf(47) - 6, 0.3],
  ['paper', cw(50, '成千上万'), 0.3],
  ['ding', cw(52, '10 亿'), 0.35],
  ['error', cw(54, '出错'), 0.3],
  ['stamp', cw(57, '卖不动'), 0.45],
  ['shake', cf(57) + 10, 0.35],
  ['whoosh', cf(61) - 34, 0.3],
  ['click', cw(62, '反向传播'), 0.3],
  ['whoosh', cw(64, '修正'), 0.25],
  ['whoosh', cf(66) - 38, 0.3],
  ['ding', cw(67, '3.5'), 0.4],
  ['error', cw(70, '什么也不会'), 0.3],
  ['whoosh', cf(71) - 38, 0.35],
  ['click', cw(75, '26%'), 0.3],
  ['ding', cw(76, '15%'), 0.45],
  ['pop', cw(77, '数据'), 0.25],
  ['pop', cw(77, '算力'), 0.25],
  ['pop', cw(77, '算法'), 0.25],
  ['whoosh', cf(80) - 34, 0.3],
  ['ding', cw(80, '4 比 1'), 0.35],
  ['whoosh', cf(82) - 30, 0.3],
  ['click', cw(84, 'Transformer'), 0.3],
  ['whoosh', cf(86) - 28, 0.3],
  ['ding', cw(86, '1750'), 0.35],
  ['whoosh', cf(87) - 28, 0.3],
  ['type', cf(87) + 10, 0.25],
  ['magic', cf(88), 0.4],
  ['whoosh', cf(91) - 26, 0.3],
  ['ding', cf(91), 0.35],
  ['ding', cf(92), 0.3],
  ['whoosh', cf(94), 0.35],
  ['whoosh', cf(96) - 40, 0.3],
  ['magic', cf(96) + 12, 0.4],
  ['whoosh', cf(98) - 10, 0.4],
  ['click', cw(99, '会说话'), 0.3],
  ['click', cw(99, '能看东西'), 0.3],
  ['click', cw(99, '会写字'), 0.3],
  ['question', cf(102), 0.35],
  ['paper', cf(103), 0.35],
  ['type', cf(104), 0.3],
];
