import React from 'react';
import type {SfxCue} from '../../library/types';
import {Big, Doc, Put, RedCheck} from '../../library/vox/desk';
import {rollYear, YearCounter} from '../../library/vox/hud';
import {Portrait, type Hair} from '../../library/vox/portrait';
import {At, Desk, HalftonePhoto, HandLine, Highlight, IndexCard, Label, RedCircle, RedLine, stringPts, TypeOn, Underline} from '../../library/vox/props';
import {DeskLitter, People, PostIt, Pushpin, Stamp, Sticker, Trend} from '../../library/vox/stickers';
import {step12, V, VF} from '../../library/vox/theme';
import {camAt, World, type CamKey} from '../../library/vox/VoxShow';
import {
  Ad1984Art, AppleChip, AppleFruit, AppleOneArt, AppleTwoArt, BeigeBox, Box, Cake50, Calculator, ColaCan, GarageArt, House, IMacG3, IPhone, IPod, MacArt, NextCube, OfficeBox, SharePie, StageArt, VwBus,
} from './art';
import {cf, cw} from './cues';
import {CAP, CAP_PTS, capAt, capY, RULER_Y, WORLD_H, WORLD_W, xy, yx} from './timeline';

const W = 1920;
const H = 1080;
const p12 = (f: number, at: number, dur: number) => Math.max(0, Math.min(1, (step12(f) - at) / dur));

/* ============ 每个故事节点在桌面上的横坐标 ============ */

const X = {
  found: yx(1976.25),
  a1: yx(1976.6),
  a2: yx(1977.5),
  ipo: yx(1980.95),
  mac: yx(1984.1),
  out: yx(1985.4),
  lost: yx(1990),
  next: yx(1996.97),
  ms: yx(1997.6),
  dell: yx(1997.77),
  imac: yx(1998.6),
  ipod: yx(2001.8),
  iphone: yx(2007.05),
  app: yx(2008.5),
  cook: yx(2011.8),
  bn3: yx(2015),
  tri: yx(2018.6),
  m1: yx(2020.9),
  now: yx(2026),
};

/* ============ 相机路线（跟着字幕走） ============ */

const CAM: CamKey[] = [
  // 钩子：1997 年 10 月，戴尔那句话
  {f: 0, x: X.dell - 160, y: 360, z: 1.5},
  {f: cf(4), x: X.dell, y: 470, z: 1.12, ease: 'sine', dur: 30},
  // 「可就在今年 7 月」：沿命运线一路追到 2026 年的山顶
  {f: cf(8) + 20, x: X.now - 500, y: 380, z: 0.5, ease: 'tail', dur: 74},
  {f: cf(9) + 10, x: X.now - 260, y: 430, z: 1.05, ease: 'sine', dur: 40},
  // 「苹果刚好 50 岁」
  {f: cf(12), x: X.now - 280, y: 500, z: 1.05, ease: 'sine', dur: 24},
  // 「从头捋一遍」：沿时间轴倒着追回 1976
  {f: cf(13) + 30, x: yx(1993), y: 520, z: 0.42, ease: 'sine', dur: 30},
  {f: cf(14) - 2, x: X.found - 60, y: 480, z: 1.1, ease: 'tail', dur: 26},
  {f: cf(17), x: X.found + 260, y: 440, z: 1.22, ease: 'sine', dur: 22},
  {f: cf(19), x: X.found + 40, y: 490, z: 1.1, ease: 'sine', dur: 22},
  // Apple I
  {f: cf(21) - 4, x: X.a1 - 60, y: 480, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(24), x: X.a1 - 260, y: 500, z: 1.18, ease: 'sine', dur: 20},
  // Apple II、上市
  {f: cf(26) - 4, x: X.a2 - 60, y: 480, z: 1.1, ease: 'tail', dur: 28},
  {f: cf(28) - 2, x: X.ipo - 40, y: 480, z: 1.1, ease: 'tail', dur: 26},
  // 麦金塔
  {f: cf(30) - 4, x: X.mac - 200, y: 480, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(32), x: X.mac + 160, y: 470, z: 1.15, ease: 'sine', dur: 20},
  // 斯卡利、出局
  {f: cf(34) - 4, x: X.out - 250, y: 480, z: 1.1, ease: 'tail', dur: 28},
  {f: cf(37), x: X.out + 120, y: 460, z: 1.1, ease: 'sine', dur: 22},
  {f: cf(38), x: X.out - 280, y: 500, z: 1.12, ease: 'sine', dur: 22},
  // 失落的十几年
  {f: cf(40) - 4, x: X.lost - 80, y: 470, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(43), x: X.lost + 250, y: 480, z: 1.12, ease: 'sine', dur: 20},
  // 收购 NeXT，乔布斯回来
  {f: cf(44) - 4, x: X.next - 120, y: 470, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(46), x: X.next + 160, y: 480, z: 1.12, ease: 'sine', dur: 22},
  // 做减法、微软
  {f: cf(48) - 4, x: X.ms - 220, y: 470, z: 1.1, ease: 'tail', dur: 28},
  {f: cf(50), x: X.ms + 320, y: 470, z: 1.1, ease: 'sine', dur: 22},
  // iMac、iPod
  {f: cf(53) - 4, x: X.imac - 150, y: 460, z: 1.1, ease: 'tail', dur: 34},
  {f: cf(55) - 4, x: X.ipod - 100, y: 460, z: 1.1, ease: 'tail', dur: 28},
  // iPhone、App Store
  {f: cf(56) - 4, x: X.iphone - 250, y: 400, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(58), x: X.iphone + 60, y: 400, z: 1.1, ease: 'sine', dur: 20},
  {f: cf(59) - 2, x: X.app - 40, y: 380, z: 1.1, ease: 'tail', dur: 26},
  // 2011：乔布斯去世，库克接班
  {f: cf(61) - 4, x: X.cook - 350, y: 330, z: 1.1, ease: 'tail', dur: 30},
  // 库克时代
  {f: cf(65) - 2, x: X.bn3 - 80, y: 560, z: 1.1, ease: 'tail', dur: 28},
  {f: cf(67) - 4, x: X.tri - 100, y: 520, z: 1.1, ease: 'tail', dur: 28},
  {f: cf(69) - 4, x: X.m1 - 80, y: 500, z: 1.1, ease: 'tail', dur: 28},
  // 2026：五十岁，换帅
  {f: cf(70) - 4, x: X.now + 300, y: 470, z: 1.1, ease: 'tail', dur: 30},
  // 回到 1997 年那句话
  {f: cf(73) + 66, x: X.dell - 100, y: 380, z: 0.95, ease: 'tail', dur: 56},
];

/* ============ 通用小件 ============ */

/** 人物网点照片 + 名字 + 一行注释 */
const Person: React.FC<{x: number; y: number; name: string; note?: string; hair?: Hair; glasses?: boolean; beard?: boolean; tie?: boolean; turtleneck?: boolean; shirt?: boolean; rot?: number; w?: number}> = ({x, y, name, note, rot = -3, w = 150, ...look}) => (
  <Put x={x} y={y}>
    <HalftonePhoto w={w} h={w * 1.2} rot={rot} dot={5} caption={name}>
      <Portrait w={w} h={w * 1.2} {...look} />
    </HalftonePhoto>
    {note && <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 22, color: V.inkSoft, textAlign: 'center', marginTop: 8, width: w + 28}}>{note}</div>}
  </Put>
);

/** 档案照片：灰度画 → 网点 */
const Photo: React.FC<{x: number; y: number; w: number; h: number; caption: string; rot?: number; children: React.ReactNode}> = ({x, y, w, h, caption, rot = -2, children}) => (
  <Put x={x} y={y}>
    <HalftonePhoto w={w} h={h} rot={rot} dot={6} caption={caption}>
      {children}
    </HalftonePhoto>
  </Put>
);

/** 一个数字从 0 数到 to（12fps 步进） */
const countUp = (f: number, at: number, to: number, dur = 30) => Math.round(to * (1 - Math.pow(1 - p12(f, at, dur), 3)));

/* ============ 时间尺、市值网格、命运线 ============ */

const RULER_YEARS = [1976, 1977, 1980, 1984, 1985, 1990, 1997, 1998, 2001, 2007, 2008, 2011, 2015, 2018, 2020, 2026];

const Ruler: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: yx(1975.5), top: RULER_Y, width: yx(2027) - yx(1975.5), height: 6, background: V.ink}} />
    {RULER_YEARS.map((y) => (
      <div key={y} style={{position: 'absolute', left: yx(y) - 60, top: RULER_Y, width: 120, textAlign: 'center'}}>
        <div style={{width: 5, height: 26, background: V.ink, margin: '0 auto'}} />
        <div style={{fontFamily: VF.num, fontSize: 44, color: V.ink, marginTop: 6}}>{y}</div>
      </div>
    ))}
  </>
);

/** 市值网格：十亿、百亿、千亿、万亿四条虚线，每隔一段写一次刻度 */
const CapGrid: React.FC = () => (
  <>
    {[
      [1, '10 亿美元'],
      [10, '100 亿'],
      [100, '1000 亿'],
      [1000, '1 万亿'],
    ].map(([b, t]) => (
      <React.Fragment key={b}>
        <div style={{position: 'absolute', left: X.ipo, top: capY(b as number), width: WORLD_W - X.ipo - 600, borderTop: '3px dashed rgba(23,23,22,0.16)'}} />
        {[X.ipo, X.lost + 700, X.dell + 700, X.ipod + 700, X.cook + 600, X.m1 + 500].map((x) => (
          <div key={x} style={{position: 'absolute', left: x + 10, top: capY(b as number) - 30, fontFamily: VF.heavy, fontSize: 22, color: 'rgba(23,23,22,0.38)', whiteSpace: 'nowrap'}}>
            {t}
          </div>
        ))}
      </React.Fragment>
    ))}
    <div style={{position: 'absolute', left: X.ipo + 160, top: capY(1) - 70, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.red, whiteSpace: 'nowrap'}}>红线：苹果市值（对数刻度，大致走势，示意）</div>
  </>
);

/** 命运线：只露出 [x0, x1] 这一段，线头一个红点 */
const CapLine: React.FC<{x0: number; x1: number}> = ({x0, x1}) => {
  const d = CAP_PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const head = Math.min(x1, CAP_PTS[CAP_PTS.length - 1][0]);
  return (
    <>
      {/* 上市之前没有市值：一条灰色虚线 */}
      <svg width={WORLD_W} height={WORLD_H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', clipPath: `inset(0 ${WORLD_W - x1}px 0 ${x0}px)`}}>
        <path d={`M${X.found} ${capY(1.8)} L${X.ipo} ${capY(1.8)}`} stroke="rgba(23,23,22,0.35)" strokeWidth={6} strokeDasharray="14 12" fill="none" />
        <path d={d} stroke={V.red} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {head > x0 && head > X.ipo && <div style={{position: 'absolute', left: head - 16, top: capAt(head) - 16, width: 32, height: 32, borderRadius: 16, background: V.red, border: `4px solid ${V.paper}`}} />}
      {x0 <= X.ipo && x1 > X.found && x1 < X.ipo && (
        <div style={{position: 'absolute', left: X.found + 40, top: capY(1.8) - 46, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft, whiteSpace: 'nowrap'}}>还没上市</div>
      )}
    </>
  );
};

/** 命运线露出多少：钩子只露 1997 那一段，追到 2026 时跟着相机长；倒回 1976 之后按故事从头长 */
const lineSpan = (f: number, camX: number): [number, number] => {
  if (f < cf(7)) return [X.next - 300, X.dell + 600];
  if (f < cf(13)) return [X.next - 300, Math.max(X.dell + 600, camX + 700)];
  if (f < cf(14)) return [X.next - 300, WORLD_W];
  if (f < cf(73)) return [0, Math.max(X.found, camX + 650)];
  return [0, WORLD_W];
};

/* ============ 1997.10 戴尔那句话（钩子，结尾回来） ============ */

const Dell1997: React.FC<{f: number}> = ({f}) => {
  const x = X.dell;
  return (
    <>
      <Put x={x - 700} y={60}>
        <Label size={28}>1997.10.6 · 奥兰多 · Gartner 大会</Label>
      </Put>
      <Person x={x - 700} y={120} name="迈克尔 · 戴尔" note="戴尔电脑创始人" hair="short" rot={-4} w={160} />
      <Put x={x - 440} y={110}>
        <Doc w={780} h={330} color="#efe8d6">
          <div style={{fontFamily: VF.body, fontSize: 22, letterSpacing: 2, color: V.inkSoft}}>Q：如果让你来管苹果，你会怎么做？</div>
          <div style={{fontFamily: VF.head, fontSize: 44, lineHeight: 1.25, marginTop: 18}}>
            “What would I do? I’d{' '}
            <Highlight f={f} at={cf(6)} w={250} h={48}>
              shut it down
            </Highlight>{' '}
            and give the money back to the shareholders.”
          </div>
        </Doc>
      </Put>
      <At f={f} at={cf(6)}>
        <Put x={x - 400} y={470}>
          <div style={{fontFamily: VF.heavy, fontSize: 64, color: V.red, transform: 'rotate(-2deg)'}}>把它关掉，把钱还给股东</div>
        </Put>
      </At>
      <Put x={x + 380} y={60}>
        <PostIt w={260} rot={4} head="那一天">
          苹果股价大约 17 美元
        </PostIt>
      </Put>
      <RedCircle f={f} at={cf(6) + 12} cx={x - 60} cy={capAt(x - 60)} rx={300} ry={56} seed={19} width={6} />
      <At f={f} at={cf(6) + 12}>
        <Put x={x + 260} y={capAt(x) - 120}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.red}}>市值谷底，约 20 亿美元</div>
        </Put>
      </At>
    </>
  );
};

/* ============ 2026：五万亿、五十岁、换帅 ============ */

const Now2026: React.FC<{f: number}> = ({f}) => {
  const x = X.now;
  const peak = capY(5000);
  return (
    <>
      <At f={f} at={cw(8, '5 万亿')}>
        <Put x={x - 820} y={300}>
          <Label size={28} bg={V.red}>2026.7.28 · 盘中</Label>
          <Big size={170}>5 万亿美元</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 34, color: V.ink, marginTop: 6}}>苹果的市值一度突破</div>
        </Put>
      </At>
      <At f={f} at={cf(9)}>
        <Put x={x - 820} y={600}>
          <IndexCard w={540} h={230} rot={-1}>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 26, color: V.inkSoft, marginTop: -16}}>市值碰到 5 万亿美元的公司</div>
            <div style={{fontFamily: VF.heavy, fontSize: 34, color: V.ink, marginTop: 10}}>1. 英伟达 · 2025.10</div>
            <div style={{fontFamily: VF.heavy, fontSize: 34, color: V.red, marginTop: 6}}>2. 苹果 · 2026.7</div>
          </IndexCard>
        </Put>
      </At>
      <Put x={x - 30} y={peak - 92}>
        <Label size={26} bg={V.red}>山顶 · 2026</Label>
      </Put>
      <At f={f} at={cf(12)}>
        <Put x={x + 60} y={470}>
          <Sticker rot={-4}>
            <Cake50 />
          </Sticker>
        </Put>
        <Put x={x + 190} y={290}>
          <Stamp size={30} rot={10} round>
            1976.4.1
            <br />
            50 周年
            <br />
            2026.4.1
          </Stamp>
        </Put>
      </At>
      {/* 换帅 */}
      <At f={f} at={cf(71)}>
        <Put x={x + 450} y={130}>
          <Label size={26}>2026.9.1 · CEO 交接</Label>
        </Put>
        <Person x={x + 450} y={190} name="蒂姆 · 库克" note="改任执行董事长" hair="silver" glasses shirt w={130} rot={-3} />
      </At>
      <At f={f} at={cw(72, '硬件')}>
        <Person x={x + 680} y={190} name="约翰 · 特努斯" note="苹果 25 年老兵" hair="short" shirt w={130} rot={3} />
        <svg width={60} height={40} style={{position: 'absolute', left: x + 618, top: 300, overflow: 'visible'}}>
          <HandLine points={[[0, 20], [56, 20]]} p={p12(f, cw(72, '硬件'), 6)} width={7} />
        </svg>
      </At>
    </>
  );
};

/* ============ 1976：三个人、一份合伙协议 ============ */

const Founding: React.FC<{f: number}> = ({f}) => {
  const x = X.found;
  const pop = 40 * p12(f, cf(17), 8);
  return (
    <>
      <Put x={x - 720} y={60}>
        <Label size={28}>1976.4.1 · 加州</Label>
      </Put>
      <Put x={x - 720} y={110}>
        <Doc w={520} h={420} color="#efe8d6" rot={-1}>
          <div style={{fontFamily: VF.head, fontSize: 44, textAlign: 'center'}}>AGREEMENT</div>
          <div style={{fontFamily: VF.body, fontSize: 21, lineHeight: 1.45, marginTop: 10}}>This agreement is made this 1st day of April, 1976, by and between the parties named below, doing business as APPLE COMPUTER COMPANY …</div>
          {['Steven P. Jobs', 'Stephen G. Wozniak', 'Ronald G. Wayne'].map((n, i) => (
            <div key={n} style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10}}>
              <div style={{fontFamily: VF.hand, fontSize: 34, color: '#1f3f8a', width: 280, borderBottom: `2px solid ${V.ink}`, opacity: f >= cf(15) + i * 8 ? 1 : 0}}>{n}</div>
              <div style={{fontFamily: VF.body, fontSize: 18, color: V.inkSoft}}>{['45%', '45%', '10%'][i]}</div>
            </div>
          ))}
        </Doc>
      </Put>
      <Person x={x - 140} y={90} name="乔布斯" note="21 岁" hair="long" beard shirt w={120} rot={-4} />
      <Person x={x + 40} y={100} name="沃兹尼亚克" note="25 岁" hair="swept" beard glasses shirt w={120} rot={3} />
      <Person x={x + 220} y={90} name="韦恩" note="41 岁" hair="receding" tie w={120} rot={-2} />
      <At f={f} at={cf(16)}>
        <Put x={x + 440} y={170}>
          <Sticker>
            <div style={{background: '#fff', padding: 8}}>
              <SharePie pop={pop} />
            </div>
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(17)}>
        <Put x={x + 740} y={150}>
          <Stamp size={40} rot={-10}>
            12 天
          </Stamp>
        </Put>
      </At>
      <At f={f} at={cw(18, '800')}>
        <Put x={x + 440} y={450}>
          <Label size={26} bg={V.red}>韦恩退出 · 1976.4.12</Label>
          <Big size={104} color={V.red}>
            800 美元
          </Big>
        </Put>
      </At>
      <At f={f} at={cf(19)}>
        <Put x={x - 120} y={470}>
          <Sticker rot={-6}>
            <House />
          </Sticker>
        </Put>
        <Put x={x + 80} y={480}>
          <PostIt w={330} rot={3} head="他怕什么">
            合伙公司欠了债，每个合伙人都要拿自己的家当来还
          </PostIt>
        </Put>
      </At>
    </>
  );
};

/* ============ Apple I：车库、50 台订单、卖车卖计算器 ============ */

const AppleOne: React.FC<{f: number}> = ({f}) => {
  const x = X.a1;
  return (
    <>
      <Put x={x - 720} y={60}>
        <Label size={28}>1976.7 · Apple I</Label>
      </Put>
      <Photo x={x - 720} y={110} w={300} h={200} caption="乔布斯家的车库（示意）" rot={-3}>
        <GarageArt w={300} h={200} />
      </Photo>
      <Photo x={x - 370} y={100} w={330} h={220} caption="Apple I（示意）" rot={2}>
        <AppleOneArt w={330} h={220} />
      </Photo>
      <At f={f} at={cf(22)}>
        <Put x={x + 60} y={100}>
          <IndexCard w={430} h={280} rot={-1}>
            <div style={{fontFamily: VF.heavy, fontSize: 30, color: V.red, marginTop: -18}}>Byte Shop 订单</div>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 34, color: V.ink, lineHeight: 1.55, marginTop: 6}}>
              Apple I × 50 台
              <br />
              每台 500 美元
              <br />
              <span style={{color: V.red}}>{f >= cf(22) + 30 ? '= 2.5 万美元' : ''}</span>
            </div>
          </IndexCard>
        </Put>
      </At>
      <Put x={x + 530} y={110}>
        <PostIt w={240} rot={4} head="零售价">
          666.66 美元
        </PostIt>
      </Put>
      <At f={f} at={cf(24)}>
        <Put x={x - 680} y={500}>
          <Sticker rot={-4}>
            <VwBus />
          </Sticker>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.ink, marginTop: 10}}>乔布斯的大众面包车</div>
        </Put>
      </At>
      <At f={f} at={cw(24, '卖掉')}>
        <Put x={x - 500} y={470}>
          <Stamp size={46} rot={-14}>
            卖掉
          </Stamp>
        </Put>
      </At>
      <At f={f} at={cf(25)}>
        <Put x={x - 300} y={470}>
          <Sticker rot={8}>
            <Calculator />
          </Sticker>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.ink, marginTop: 10}}>沃兹的 HP-65</div>
        </Put>
        <Put x={x - 200} y={560}>
          <Stamp size={46} rot={10}>
            卖掉
          </Stamp>
        </Put>
      </At>
    </>
  );
};

/* ============ Apple II、上市 ============ */

const AppleTwoIpo: React.FC<{f: number}> = ({f}) => {
  const x = X.a2;
  const xi = X.ipo;
  const lit = Math.min(40, Math.floor(p12(f, cf(29), 24) * 40));
  return (
    <>
      <At f={f} at={cf(26) - 6}>
        <Put x={x - 520} y={60}>
          <Label size={28}>1977 · Apple II</Label>
        </Put>
        <Photo x={x - 520} y={110} w={330} h={230} caption="Apple II（示意）" rot={-2}>
          <AppleTwoArt w={330} h={230} />
        </Photo>
        <Put x={x - 140} y={90}>
          <Sticker rot={8}>
            <AppleFruit s={130} rainbow />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(27)}>
        <Put x={x + 40} y={120}>
          <Sticker rot={-3}>
            <Trend up label="销量一路往上（示意）" />
          </Sticker>
        </Put>
        <Put x={x - 120} y={420}>
          <PostIt w={300} rot={-3} head="1977">
            最早一批量产的个人电脑之一
          </PostIt>
        </Put>
      </At>
      {/* 上市 */}
      <Put x={xi - 560} y={60}>
        <Label size={28}>1980.12.12 · 上市</Label>
      </Put>
      <Put x={xi - 560} y={110}>
        <div style={{width: 560, padding: 12, background: '#e6efe2', border: '10px double #4f7a52', boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
          <div style={{fontFamily: VF.head, fontSize: 40, textAlign: 'center', color: '#2f4f32'}}>APPLE COMPUTER, INC.</div>
          <div style={{fontFamily: VF.body, fontSize: 22, textAlign: 'center', color: '#2f4f32', letterSpacing: 4}}>COMMON STOCK</div>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 16, fontFamily: VF.num, fontSize: 52, color: '#2f4f32'}}>
            <span>4,600,000</span>
            <span>$22</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 22, color: '#2f4f32'}}>
            <span>股</span>
            <span>每股</span>
          </div>
        </div>
      </Put>
      <At f={f} at={cf(29)}>
        <Put x={xi + 60} y={110}>
          <Sticker>
            <div style={{background: '#fff', padding: '10px 14px'}}>
              {[0, 1, 2, 3].map((r) => (
                <div key={r} style={{display: 'block', lineHeight: 0}}>
                  <People n={10} size={30} color={V.red} lit={lit - r * 10} />
                </div>
              ))}
              <div style={{fontFamily: VF.heavy, fontSize: 30, color: V.ink, marginTop: 6}}>四十多个百万富翁</div>
            </div>
          </Sticker>
        </Put>
        <Put x={xi + 120} y={470}>
          <PostIt w={300} rot={3} head="上市当天">
            收盘市值约 17.8 亿美元，福特 1956 年以来最大的上市
          </PostIt>
        </Put>
      </At>
    </>
  );
};

/* ============ 1984 麦金塔 ============ */

const Mac1984: React.FC<{f: number}> = ({f}) => {
  const x = X.mac;
  return (
    <>
      <At f={f} at={cf(30) - 6}>
        <Put x={x - 760} y={60}>
          <Label size={28}>1984.1.22 · 超级碗广告</Label>
        </Put>
        <Photo x={x - 760} y={110} w={330} h={220} caption="《1984》（示意）" rot={-2}>
          <Ad1984Art w={330} h={220} />
        </Photo>
      </At>
      <At f={f} at={cf(31)}>
        <Put x={x - 380} y={60}>
          <Label size={28} bg={V.red}>
            1984.1.24 · 麦金塔
          </Label>
        </Put>
        <Photo x={x - 380} y={110} w={300} h={240} caption="Macintosh（示意）" rot={2}>
          <MacArt w={300} h={240} />
        </Photo>
        <Put x={x - 340} y={470}>
          <PostIt w={240} rot={-4} head="售价">
            2495 美元
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(32)}>
        <Put x={x + 60} y={100}>
          <IndexCard w={600} h={330}>
            <div style={{display: 'flex', gap: 24, marginTop: -10}}>
              <div style={{width: 250}}>
                <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.inkSoft}}>以前 · 敲命令</div>
                <div style={{background: '#1d1f1c', color: '#9fe39a', fontFamily: `'Courier New', monospace`, fontSize: 22, padding: 12, marginTop: 8, height: 150, lineHeight: 1.5}}>
                  {'] CATALOG'}
                  <br />
                  {'] RUN HELLO'}
                  <br />
                  {'] _'}
                </div>
              </div>
              <div style={{width: 260}}>
                <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.red}}>现在 · 点图标</div>
                <div style={{background: '#f4f4f2', border: `3px solid ${V.ink}`, marginTop: 8, height: 150, position: 'relative'}}>
                  {['文稿', '画图', '废纸篓'].map((t, i) => (
                    <div key={t} style={{position: 'absolute', left: 16 + i * 80, top: 22, width: 64, textAlign: 'center', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 18}}>
                      <div style={{width: 44, height: 44, margin: '0 auto 6px', border: `3px solid ${V.ink}`, background: i === 1 && f >= cf(32) + 16 ? V.ink : '#fff'}} />
                      {t}
                    </div>
                  ))}
                  <svg width={40} height={50} viewBox="0 0 40 50" style={{position: 'absolute', left: 110 + 40 * (1 - p12(f, cf(32), 12)), top: 60 + 30 * (1 - p12(f, cf(32), 12))}}>
                    <path d="M4 4 L4 40 L14 30 L22 46 L28 43 L20 28 L34 28 Z" fill="#fff" stroke={V.ink} strokeWidth={3} />
                  </svg>
                </div>
              </div>
            </div>
          </IndexCard>
        </Put>
      </At>
    </>
  );
};

/* ============ 1985 出局 ============ */

const Ousted1985: React.FC<{f: number}> = ({f}) => {
  const x = X.out;
  return (
    <>
      <At f={f} at={cf(34)}>
        <Put x={x - 640} y={110}>
          <Sticker rot={-3}>
            <Trend label="麦金塔卖得远不如预期（示意）" />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(35)}>
        <Person x={x - 330} y={100} name="约翰 · 斯卡利" note="百事可乐总裁" hair="swept" tie w={140} rot={3} />
        <Put x={x - 150} y={290}>
          <Sticker rot={12}>
            <ColaCan />
          </Sticker>
        </Put>
        <Put x={x - 10} y={90}>
          <PostIt w={320} rot={-3} head="1983 年挖他时，乔布斯说">
            你想卖一辈子糖水，还是跟我一起改变世界？
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(37)}>
        <Put x={x + 360} y={100}>
          <IndexCard w={400} h={270} rot={2}>
            <div style={{fontFamily: VF.heavy, fontSize: 28, color: V.ink, marginTop: -16}}>董事会 · 1985.4</div>
            <div style={{marginTop: 14}}>
              <People n={6} size={44} lit={Math.min(6, Math.floor(p12(f, cf(37), 18) * 6) + 1)} />
            </div>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 28, color: V.red, marginTop: 10}}>全都站在斯卡利这边</div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(38)}>
        <Person x={x - 640} y={420} name="乔布斯 · 30 岁" hair="short" tie w={130} rot={-3} />
        <Put x={x - 610} y={560}>
          <Stamp size={56} rot={-14}>
            出局
          </Stamp>
        </Put>
        <Put x={x - 420} y={520}>
          <Sticker rot={-6}>
            <Box />
          </Sticker>
        </Put>
      </At>
    </>
  );
};

/* ============ 乔布斯不在的十几年：一根红绳从 1985 牵到 1997 ============ */

const EXILE_FROM: [number, number] = [X.out - 500, 640];
const EXILE_TO: [number, number] = [X.next + 370, 630];

const ExileString: React.FC<{f: number}> = ({f}) =>
  f < cf(39) ? null : (
    <>
      <RedLine f={f} at={cf(39)} dur={cf(47) - cf(39)} points={stringPts(EXILE_FROM, EXILE_TO, 40, 60)} width={5} />
      <At f={f} at={cf(40)}>
        <Put x={X.lost - 380} y={600}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.red, background: 'rgba(238,237,237,0.85)', padding: '2px 12px'}}>乔布斯不在的十几年</div>
        </Put>
      </At>
    </>
  );

/* ============ 失落的十几年 ============ */

const LostYears: React.FC<{f: number}> = ({f}) => {
  const x = X.lost;
  const ceos: {name: string; note: string; hair: Hair; glasses?: boolean}[] = [
    {name: '斯卡利', note: '1983–1993', hair: 'swept'},
    {name: '斯平德勒', note: '1993–1996', hair: 'bald', glasses: true},
    {name: '阿梅里奥', note: '1996–1997', hair: 'receding', glasses: true},
  ];
  const fan = p12(f, cf(41), 16);
  return (
    <>
      <At f={f} at={cf(40) - 6}>
        <Put x={x - 760} y={50}>
          <Label size={28}>1985–1997 · 换了三任 CEO</Label>
        </Put>
      </At>
      {ceos.map((c, i) => (
        <At key={c.name} f={f} at={cf(40) + i * 14}>
          <Person x={x - 760 + i * 170} y={110} name={c.name} note={c.note} hair={c.hair} glasses={c.glasses} tie w={120} rot={i % 2 ? 3 : -3} />
        </At>
      ))}
      <At f={f} at={cf(41)}>
        {['Performa 5200', 'Performa 6400', 'Power Mac 7600', 'PowerBook 5300', 'Quadra 840AV', 'Newton', 'Pippin'].map((n, i) => (
          <Put key={n} x={x - 180 + i * 62 * fan} y={110 + i * 34 * fan}>
            <div style={{transform: `rotate(${(i - 3) * 4 * fan}deg)`}}>
              <BeigeBox name={n} />
            </div>
          </Put>
        ))}
      </At>
      <At f={f} at={cf(42)}>
        <Put x={x + 470} y={100}>
          <Sticker rot={4}>
            <Trend label="越卖越差（示意）" />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cw(43, '亏掉')}>
        <Put x={x + 400} y={400}>
          <Label size={26} bg={V.red}>1997 财年</Label>
          <Big size={130} color={V.red}>
            亏损 10 亿+
          </Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.ink}}>美元</div>
        </Put>
      </At>
    </>
  );
};

/* ============ 1996.12 收购 NeXT ============ */

const NextDeal: React.FC<{f: number}> = ({f}) => {
  const x = X.next;
  return (
    <>
      <At f={f} at={cf(44)}>
        <Put x={x - 760} y={110}>
          <PostIt w={300} rot={-4} head="系统难产">
            苹果自己研发的新系统 Copland，迟迟做不出来
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(45) - 4}>
        <Put x={x - 400} y={90}>
          <Doc w={620} h={330} color="#f3efe6">
            <div style={{fontFamily: VF.bodyBold, fontSize: 20, letterSpacing: 2, color: V.red}}>FOR IMMEDIATE RELEASE · DECEMBER 20, 1996</div>
            <div style={{fontFamily: VF.head, fontSize: 36, lineHeight: 1.15, marginTop: 12}}>Apple Computer, Inc. Agrees to Acquire NeXT Software Inc.</div>
            <div style={{fontFamily: VF.body, fontSize: 22, marginTop: 14, lineHeight: 1.4}}>
              … in a friendly acquisition for{' '}
              <Highlight f={f} at={cw(45, '4 亿')} w={150} h={30}>
                $400 million
              </Highlight>
              . Steve Jobs will return to Apple …
            </div>
          </Doc>
        </Put>
      </At>
      <At f={f} at={cf(46)}>
        <Put x={x + 300} y={90}>
          <Sticker rot={6}>
            <NextCube />
          </Sticker>
        </Put>
        <Put x={x + 260} y={290}>
          <Label size={24}>NeXT · 他离开后创办的公司</Label>
        </Put>
      </At>
      <At f={f} at={cf(47)}>
        <Person x={x + 300} y={370} name="乔布斯 · 回来了" hair="short" glasses turtleneck w={120} rot={3} />
      </At>
    </>
  );
};

/* ============ 1997：做减法、和微软握手 ============ */

const MODELS = ['Performa 5200', 'Performa 5400', 'Performa 6200', 'Performa 6400', 'Power Mac 4400', 'Power Mac 7300', 'Power Mac 8600', 'Power Mac 9600', 'PowerBook 1400', 'PowerBook 3400', 'Newton MessagePad', 'eMate 300'];

const Cuts1997: React.FC<{f: number}> = ({f}) => {
  const x = X.ms;
  const cut = cw(49, '七成');
  return (
    <>
      <At f={f} at={cf(48) - 6}>
        <Put x={x - 760} y={60}>
          <Label size={28}>1997 · 做减法</Label>
        </Put>
        <Put x={x - 760} y={110}>
          <IndexCard w={540} h={400} rot={-1}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 18, rowGap: 6, marginTop: -16}}>
              {MODELS.map((m, i) => (
                <div key={m} style={{position: 'relative', fontFamily: VF.bodyBold, fontSize: 22, color: V.ink, whiteSpace: 'nowrap'}}>
                  {m}
                  {i % 6 !== 0 && i !== 9 && <div style={{position: 'absolute', left: -4, top: 14, height: 5, background: V.red, width: `${100 * p12(f, cut + i * 2, 4)}%`}} />}
                </div>
              ))}
            </div>
            <div style={{fontFamily: VF.heavy, fontSize: 30, color: V.red, marginTop: 14}}>{f >= cut + 20 ? '砍掉约七成型号' : ''}</div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cut + 26}>
        <Put x={x - 180} y={110}>
          <IndexCard w={330} h={300} rot={2}>
            <div style={{fontFamily: VF.heavy, fontSize: 24, color: V.ink, marginTop: -18}}>只留四格</div>
            <div style={{display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 6, marginTop: 8, fontFamily: VF.heavy, fontSize: 22, textAlign: 'center'}}>
              <div />
              <div>消费者</div>
              <div>专业</div>
              {['台式', '便携'].map((r) => (
                <React.Fragment key={r}>
                  <div style={{alignSelf: 'center'}}>{r}</div>
                  <div style={{height: 70, background: V.red, opacity: 0.85}} />
                  <div style={{height: 70, background: V.ink, opacity: 0.85}} />
                </React.Fragment>
              ))}
            </div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(50)}>
        <Put x={x + 240} y={60}>
          <Label size={26}>1997.8.6 · Macworld 波士顿</Label>
        </Put>
        <Photo x={x + 240} y={110} w={340} h={220} caption="盖茨出现在大屏幕上（示意）" rot={-2}>
          <StageArt w={340} h={220} screen="face" />
        </Photo>
      </At>
      <At f={f} at={cw(51, '1.5 亿')}>
        <Put x={x + 240} y={420}>
          <Big size={120}>1.5 亿美元</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.ink}}>微软投资苹果</div>
        </Put>
      </At>
      <At f={f} at={cf(52)}>
        <Put x={x + 640} y={90}>
          <PostIt w={260} rot={4} head="还有一个承诺">
            至少 5 年，继续做 Mac 版 Office
          </PostIt>
        </Put>
        <Put x={x + 700} y={360}>
          <Sticker rot={-6}>
            <OfficeBox />
          </Sticker>
        </Put>
      </At>
    </>
  );
};

/* ============ iMac、iPod ============ */

const IMacIPod: React.FC<{f: number}> = ({f}) => {
  const x = X.imac;
  const xp = X.ipod;
  return (
    <>
      <At f={f} at={cf(53) - 6}>
        <Put x={x - 600} y={60}>
          <Label size={28}>1998.8 · iMac</Label>
        </Put>
        <Put x={x - 600} y={110}>
          <Sticker rot={-4}>
            <IMacG3 />
          </Sticker>
        </Put>
        <Put x={x - 600} y={370}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 26, color: V.ink}}>彩色半透明的外壳</div>
        </Put>
      </At>
      <At f={f} at={cf(54)}>
        <Put x={x - 280} y={110}>
          <Sticker rot={3}>
            <Trend up label="扭亏为盈" />
          </Sticker>
        </Put>
        <Put x={x + 40} y={120}>
          <PostIt w={260} rot={-3} head="1998 财年">
            净利润约 3 亿美元
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(55) - 6}>
        <Put x={xp - 460} y={60}>
          <Label size={28}>2001.10.23 · iPod</Label>
        </Put>
        <Put x={xp - 460} y={110}>
          <Sticker rot={-5}>
            <IPod />
          </Sticker>
        </Put>
        <Put x={xp - 250} y={110}>
          <Big size={150}>{countUp(f, cw(55, '一千'), 1000, 24)}</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 36, color: V.ink}}>首歌，装进口袋</div>
        </Put>
        <Put x={xp - 230} y={420}>
          <PostIt w={240} rot={3} head="售价">
            399 美元
          </PostIt>
        </Put>
      </At>
    </>
  );
};

/* ============ iPhone、App Store ============ */

const IPhone2007: React.FC<{f: number}> = ({f}) => {
  const x = X.iphone;
  const xa = X.app;
  const apps = Math.floor(p12(f, cf(60), 40) * 24);
  return (
    <>
      <At f={f} at={cf(56) - 6}>
        <Put x={x - 760} y={50}>
          <Label size={28}>2007.1.9 · Macworld 旧金山</Label>
        </Put>
        <Photo x={x - 760} y={100} w={340} h={220} caption="台上的乔布斯（示意）" rot={-2}>
          <StageArt w={340} h={220} screen="phone" />
        </Photo>
      </At>
      <At f={f} at={cf(57)}>
        <Put x={x - 380} y={90}>
          <Doc w={560} h={230} color="#f7f7f5">
            <div style={{fontFamily: VF.head, fontSize: 42, lineHeight: 1.25}}>
              “Today Apple is going to{' '}
              <Highlight f={f} at={cw(57, '重新发明')} w={380} h={46}>
                reinvent the phone.
              </Highlight>
              ”
            </div>
          </Doc>
        </Put>
      </At>
      <At f={f} at={cf(58)}>
        <Put x={x + 240} y={60}>
          <Sticker rot={6}>
            <IPhone />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(59)}>
        <Put x={xa - 380} y={50}>
          <Label size={28} bg={V.red}>
            2008.7.10 · App Store
          </Label>
        </Put>
        <Put x={xa - 380} y={100}>
          <Sticker>
            <div style={{background: '#fff', padding: 14, display: 'grid', gridTemplateColumns: 'repeat(6, 64px)', gap: 12}}>
              {Array.from({length: 24}, (_, k) => (
                <div key={k} style={{width: 64, height: 64, borderRadius: 16, background: ['#e0574a', '#5bb36a', '#4f8fd6', '#e9a03a', '#9b6cd1', '#2fb3b0'][(k * 5) % 6], opacity: k < Math.max(4, apps) ? 1 : 0.12}} />
              ))}
            </div>
          </Sticker>
        </Put>
        <Put x={xa + 200} y={110}>
          <PostIt w={240} rot={4} head="刚上线时">
            只有 500 个应用
          </PostIt>
        </Put>
      </At>
    </>
  );
};

/* ============ 2011：乔布斯去世，库克接班 ============ */

const Cook2011: React.FC<{f: number}> = ({f}) => {
  const x = X.cook;
  return (
    <>
      <At f={f} at={cf(61) - 6}>
        <Put x={x - 760} y={30}>
          <Label size={28}>2011.10.5</Label>
        </Put>
        <Person x={x - 760} y={80} name="史蒂夫 · 乔布斯" note="1955–2011" hair="short" glasses turtleneck w={140} rot={-3} />
      </At>
      <At f={f} at={cf(62)}>
        <Person x={x - 520} y={90} name="蒂姆 · 库克" note="原首席运营官，管供应链" hair="silver" glasses shirt w={140} rot={3} />
      </At>
      <At f={f} at={cf(63)}>
        <Put x={x - 270} y={40}>
          <div style={{fontFamily: VF.num, fontSize: 220, color: V.red, lineHeight: 1, transform: 'rotate(8deg)'}}>?</div>
        </Put>
        <Put x={x - 160} y={110}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 40, color: V.red, transform: 'rotate(-3deg)', lineHeight: 1.3}}>
            没了乔布斯
            <br />
            会不会又走回老路
          </div>
        </Put>
      </At>
    </>
  );
};

/* ============ 库克时代：30 亿台、一万亿、自研芯片 ============ */

const CookEra: React.FC<{f: number}> = ({f}) => {
  const xb = X.bn3;
  const xt = X.tri;
  const xm = X.m1;
  return (
    <>
      <At f={f} at={cf(66)}>
        <Put x={xb - 600} y={470}>
          <Big size={160}>{countUp(f, cw(66, '30 亿'), 30, 26)} 亿台</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 32, color: V.ink}}>iPhone 累计出货</div>
        </Put>
        {[0, 1, 2].map((i) => (
          <Put key={i} x={xb - 40 + i * 70} y={480 + i * 12}>
            <div style={{transform: `rotate(${-8 + i * 8}deg)`, transformOrigin: 'bottom center'}}>
              <Sticker>
                <IPhone apps={16} />
              </Sticker>
            </div>
          </Put>
        ))}
        <Put x={xb + 300} y={500}>
          <PostIt w={260} rot={3} head="2025 年 7 月">
            库克宣布，第 30 亿台 iPhone 出货
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(67)}>
        <Put x={xt - 600} y={420}>
          <Label size={28} bg={V.red}>
            2018.8.2
          </Label>
          <Big size={150}>1 万亿美元</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.ink}}>美国第一家市值破万亿的上市公司</div>
        </Put>
      </At>
      <RedCircle f={f} at={cf(68)} cx={xt} cy={capAt(xt)} rx={130} ry={60} seed={23} width={6} />
      <At f={f} at={cf(69)}>
        <Put x={xm - 520} y={400}>
          <Sticker rot={-6}>
            <AppleChip label="M1" />
          </Sticker>
        </Put>
        <Put x={xm - 520} y={620}>
          <Label size={26}>2020.11 · Mac 换上自研芯片</Label>
        </Put>
        <Put x={xm - 240} y={410}>
          <PostIt w={260} rot={4} head="告别英特尔">
            Mac 从 2006 年起一直用英特尔的芯片
          </PostIt>
        </Put>
      </At>
    </>
  );
};

/* ============ 结尾：一张小图看完 50 年 ============ */

const MiniChart: React.FC<{f: number}> = ({f}) => {
  if (f < cf(74) || f >= cf(77)) return null;
  const x0 = 260;
  const x1 = 1500;
  const t0 = 1980;
  const t1 = 2026;
  const sx = (y: number) => x0 + ((y - t0) / (t1 - t0)) * (x1 - x0);
  const sy = (b: number) => 640 - (Math.log10(b) - 0.2) * 110;
  const pts = CAP.map(([y, b]) => [sx(y), sy(b)] as [number, number]);
  const p = p12(f, cf(74), 26);
  return (
    <div style={{position: 'absolute', left: 140, top: 90, width: 1640, height: 760, background: V.card, boxShadow: '4px 8px 14px rgba(23,23,22,0.4)'}}>
      <div style={{position: 'absolute', left: 60, top: 40, fontFamily: VF.heavy, fontSize: 40, color: V.paper}}>苹果市值 1980–2026</div>
      <div style={{position: 'absolute', left: 60, top: 96, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: 'rgba(238,237,237,0.6)'}}>对数刻度，大致走势，示意</div>
      <svg width={1640} height={760} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${x0} 690 L${x1 + 40} 690`} stroke="rgba(238,237,237,0.5)" strokeWidth={3} />
        {[1980, 1997, 2026].map((y) => (
          <text key={y} x={sx(y)} y={730} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={30} fill="rgba(238,237,237,0.75)">
            {y}
          </text>
        ))}
        <g>
          <HandLine points={pts} p={p} width={8} />
        </g>
        {p >= 1 && f >= cf(75) && <HandLine points={[[sx(2026), sy(5000)], [sx(2026) + 120, sy(5000) - 30]]} p={p12(f, cf(75), 10)} width={6} dashed dot={false} color="rgba(238,237,237,0.8)" />}
      </svg>
      {p > 0.35 && (
        <div style={{position: 'absolute', left: sx(1997.7) - 120, top: sy(2.2) + 18}}>
          <Label size={30} bg={V.red}>
            1997 · 把它关掉
          </Label>
        </div>
      )}
      {p >= 1 && (
        <div style={{position: 'absolute', left: sx(2026) - 330, top: sy(5000) + 20}}>
          <Label size={30} bg={V.paper} color={V.ink}>
            2026 · 5 万亿
          </Label>
        </div>
      )}
      {p >= 1 && (
        <div style={{position: 'absolute', left: sx(1997.7), top: 160, width: sx(2026) - sx(1997.7), textAlign: 'center'}}>
          <div style={{borderTop: `4px solid ${V.hiSolid}`, borderLeft: `4px solid ${V.hiSolid}`, borderRight: `4px solid ${V.hiSolid}`, height: 18}} />
          <div style={{fontFamily: VF.heavy, fontSize: 40, color: V.hiSolid, marginTop: 6}}>将近 30 年</div>
        </div>
      )}
      {f >= cf(75) && (
        <div style={{position: 'absolute', left: sx(2026) - 330, top: sy(5000) + 90, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.paper, lineHeight: 1.4, whiteSpace: 'nowrap'}}>
          下一个 50 年，交给特努斯
        </div>
      )}
    </div>
  );
};

/* ============ 结尾黑卡 ============ */

const EndCard: React.FC<{f: number}> = ({f}) =>
  f < cf(77) ? null : (
    <div style={{position: 'absolute', inset: 0}}>
      <Desk w={W} h={H} seed={2} />
      <div style={{position: 'absolute', left: 90, top: 70, width: W - 180, height: H - 260, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
      <div style={{position: 'absolute', left: 200, top: 220, color: V.paper}}>
        <Label size={44} bg={V.red}>
          苹果 50 年 · 1976–2026
        </Label>
        <div style={{fontFamily: VF.heavy, fontSize: 120, marginTop: 40}}>
          <TypeOn f={f} at={cf(78)} text="我们下期再见" cps={10} cursor={false} />
        </div>
      </div>
      <Underline f={f} at={cf(78) + 20} x={200} y={560} w={760} />
      <div style={{position: 'absolute', right: 220, top: 260}}>
        <AppleFruit s={260} rainbow />
      </div>
    </div>
  );

/* ============ 年份计数器 ============ */

const YEAR_STOPS: [number, number, number?][] = [
  [0, 1997],
  [cf(7), 2026],
  [cf(14) - 6, 1976],
  [cf(26) - 6, 1977],
  [cf(28) - 6, 1980],
  [cf(30) - 6, 1984],
  [cf(38) - 6, 1985],
  [cf(40), 1996, cf(43) - cf(40)],
  [cf(48) - 6, 1997],
  [cf(53) - 6, 1998],
  [cf(55) - 6, 2001],
  [cf(56) - 6, 2007],
  [cf(59) - 6, 2008],
  [cf(61) - 6, 2011],
  [cf(66), 2025],
  [cf(67) - 6, 2018],
  [cf(69) - 6, 2020],
  [cf(70) - 6, 2026],
  [cf(73), 1997],
];

const Hud: React.FC<{f: number; camX: number; z: number}> = ({f, camX, z}) => {
  if (f < cf(1) || f >= cf(74) || z < 0.4) return null;
  const tracking = (f >= cf(7) && f < cf(9)) || (f >= cf(13) && f < cf(14) - 6);
  const year = tracking ? xy(camX) : rollYear(f, YEAR_STOPS, step12);
  return <YearCounter year={year} from={1976} to={2026} title="苹果 50 年" bands={[[1985.4, 1997]]} />;
};

/* ============ 整片 ============ */

export const Film: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, CAM);
  const [l0, l1] = lineSpan(f, cam.x);
  return (
    <>
      <World cam={cam} w={W} h={H}>
        <Desk w={WORLD_W} h={WORLD_H + 400} color={V.oldMap} seed={7} />
        <DeskLitter x0={300} x1={WORLD_W - 300} y0={-40} y1={1000} count={80} seed={19} />
        <CapGrid />
        <Ruler />
        <CapLine x0={l0} x1={l1} />
        <ExileString f={f} />
        <Dell1997 f={f} />
        <Now2026 f={f} />
        <Founding f={f} />
        <AppleOne f={f} />
        <AppleTwoIpo f={f} />
        <Mac1984 f={f} />
        <Ousted1985 f={f} />
        <LostYears f={f} />
        <NextDeal f={f} />
        <Cuts1997 f={f} />
        <IMacIPod f={f} />
        <IPhone2007 f={f} />
        <Cook2011 f={f} />
        <CookEra f={f} />
        {[
          [X.dell - 50, 112],
          [X.found - 460, 112],
          [X.ipo - 280, 112],
          [X.next - 90, 92],
          [X.iphone - 100, 92],
        ].map(([x, y]) => (
          <div key={x} style={{position: 'absolute', left: x - 17, top: y - 17}}>
            <Pushpin />
          </div>
        ))}
        <At f={f} at={cf(37) + 20}>
          <RedCheck f={f} at={cf(37) + 20} x={X.out + 720} y={300} s={26} />
        </At>
      </World>
      <Hud f={f} camX={cam.x} z={cam.z} />
      <MiniChart f={f} />
      <EndCard f={f} />
    </>
  );
};

/* ============ 音效 ============ */

export const FILM_SFX: SfxCue[] = [
  ['paper', cf(1), 0.35],
  ['type', cf(2), 0.25],
  ['stamp', cf(6), 0.4],
  ['whoosh', cf(7) + 10, 0.4],
  ['ding', cw(8, '5 万亿'), 0.4],
  ['pop', cf(9), 0.3],
  ['confetti', cf(12), 0.35],
  ['whoosh', cf(13) + 4, 0.4],
  ['paper', cf(14) - 4, 0.3],
  ['type', cf(15), 0.3],
  ['pop', cf(16), 0.3],
  ['snip', cf(17), 0.35],
  ['ding', cw(18, '800'), 0.35],
  ['pop', cf(19), 0.3],
  ['whoosh', cf(21) - 30, 0.3],
  ['paper', cf(22), 0.3],
  ['stamp', cw(24, '卖掉'), 0.4],
  ['stamp', cf(25) + 4, 0.4],
  ['whoosh', cf(26) - 30, 0.3],
  ['magic', cf(27), 0.3],
  ['whoosh', cf(28) - 28, 0.3],
  ['ding', cf(29), 0.35],
  ['whoosh', cf(30) - 30, 0.3],
  ['click', cf(31), 0.3],
  ['click', cf(32) + 16, 0.35],
  ['type', cf(33), 0.25],
  ['error', cf(34), 0.3],
  ['pop', cf(35), 0.3],
  ['paper', cf(37), 0.3],
  ['stamp', cf(38) + 6, 0.45],
  ['whoosh', cf(40) - 30, 0.3],
  ['pop', cf(40) + 14, 0.25],
  ['pop', cf(40) + 28, 0.25],
  ['paper', cf(41), 0.3],
  ['error', cw(43, '亏掉'), 0.35],
  ['whoosh', cf(44) - 30, 0.3],
  ['paper', cf(45), 0.3],
  ['ding', cw(45, '4 亿'), 0.3],
  ['pop', cf(46), 0.3],
  ['magic', cf(47), 0.4],
  ['whoosh', cf(48) - 28, 0.3],
  ['snip', cw(49, '七成'), 0.4],
  ['click', cf(50), 0.3],
  ['ding', cw(51, '1.5 亿'), 0.35],
  ['pop', cf(52), 0.3],
  ['whoosh', cf(53) - 34, 0.35],
  ['magic', cf(53) + 6, 0.3],
  ['ding', cf(54), 0.35],
  ['whoosh', cf(55) - 28, 0.3],
  ['click', cf(55) + 6, 0.3],
  ['whoosh', cf(56) - 30, 0.3],
  ['paper', cf(57), 0.3],
  ['magic', cf(58), 0.4],
  ['whoosh', cf(59) - 26, 0.3],
  ['pop', cf(60), 0.3],
  ['whoosh', cf(61) - 30, 0.3],
  ['paper', cf(62), 0.3],
  ['question', cf(63), 0.35],
  ['whoosh', cf(65) - 28, 0.3],
  ['ding', cw(66, '30 亿'), 0.35],
  ['whoosh', cf(67) - 28, 0.3],
  ['ding', cf(68), 0.4],
  ['whoosh', cf(69) - 28, 0.3],
  ['click', cf(69), 0.3],
  ['whoosh', cf(70) - 30, 0.35],
  ['confetti', cf(70), 0.3],
  ['paper', cf(71), 0.3],
  ['pop', cw(72, '硬件'), 0.3],
  ['whoosh', cf(73), 0.4],
  ['paper', cf(74), 0.35],
  ['magic', cf(75), 0.35],
  ['paper', cf(77), 0.35],
  ['type', cf(78), 0.3],
];
