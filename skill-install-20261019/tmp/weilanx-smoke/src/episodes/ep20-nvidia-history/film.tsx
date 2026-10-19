import React from 'react';
import type {SfxCue} from '../../library/types';
import {Big, Doc, Put, RedCheck, RedX} from '../../library/vox/desk';
import {rollYear, YearCounter} from '../../library/vox/hud';
import {Portrait, type Hair} from '../../library/vox/portrait';
import {At, Desk, HalftonePhoto, HandLine, Highlight, IndexCard, Label, RedCircle, TypeOn, Underline} from '../../library/vox/props';
import {DeskLitter, People, PostIt, Pushpin, Stamp, Sticker, Trend} from '../../library/vox/stickers';
import {step12, V, VF} from '../../library/vox/theme';
import {camAt, World, type CamKey} from '../../library/vox/VoxShow';
import {AlarmClock, Atom, BoxPile, CardArt, Chip, CodeCard, Console, CurveVsTri, DgxArt, DinerArt, GpuCard, Mic, MiningRig, Mug, Plane, Plates, Racks, TearCalendar} from './art';
import {cf, cw} from './cues';
import {CAP, CAP_PTS, capAt, capY, RULER_Y, WORLD_H, WORLD_W, xy, yx} from './timeline';

const W = 1920;
const H = 1080;
const p12 = (f: number, at: number, dur: number) => Math.max(0, Math.min(1, (step12(f) - at) / dur));
const countUp = (f: number, at: number, to: number, dur = 30) => Math.round(to * (1 - Math.pow(1 - p12(f, at, dur), 3)));

/* ============ 每个故事节点在桌面上的横坐标 ============ */

const X = {
  found: yx(1993.3),
  nv1: yx(1995.5),
  crisis: yx(1996.2),
  sega: yx(1996.6),
  riva: yx(1997.6),
  ipo: yx(1999.05),
  gf: yx(1999.8),
  cuda: yx(2006.5),
  crash: yx(2008.9),
  alex: yx(2012.7),
  dgx: yx(2016.6),
  crypto: yx(2018.9),
  gpt: yx(2022.9),
  t1: yx(2023.4),
  t5: yx(2025.83),
  now: yx(2026.77),
};

/* ============ 相机路线（跟着字幕走） ============ */

const CAM: CamKey[] = [
  // 钩子：现在。凌晨 4 点的闹钟、30 天的日历、黄仁勋
  {f: 0, x: X.now - 380, y: 440, z: 1.3},
  {f: cf(5), x: X.now - 160, y: 480, z: 1.05, ease: 'sine', dur: 34},
  // 「答案就藏在它这 33 年里」：沿时间轴倒着追回 1993
  {f: cf(12) + 30, x: yx(2008), y: 520, z: 0.4, ease: 'sine', dur: 30},
  {f: cf(13) - 2, x: X.found - 80, y: 480, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(16), x: X.found - 260, y: 500, z: 1.15, ease: 'sine', dur: 22},
  // NV1
  {f: cf(19) - 4, x: X.nv1 - 80, y: 470, z: 1.1, ease: 'tail', dur: 30},
  // 1996：30 天
  {f: cf(24) - 2, x: X.crisis - 150, y: 470, z: 1.1, ease: 'tail', dur: 26},
  {f: cf(27), x: X.crisis + 150, y: 460, z: 1.12, ease: 'sine', dur: 20},
  // 世嘉
  {f: cf(28) + 22, x: X.sega - 150, y: 470, z: 1.1, ease: 'tail', dur: 26},
  {f: cf(31), x: X.sega + 60, y: 470, z: 1.1, ease: 'sine', dur: 22},
  // RIVA 128
  {f: cf(34) - 4, x: X.riva - 150, y: 460, z: 1.1, ease: 'tail', dur: 28},
  // 上市、GeForce
  {f: cf(36) + 10, x: X.ipo - 100, y: 470, z: 1.1, ease: 'tail', dur: 24},
  {f: cf(37) + 6, x: X.gf - 150, y: 470, z: 1.1, ease: 'sine', dur: 22},
  // CUDA
  {f: cf(39) + 14, x: X.cuda - 250, y: 470, z: 1.1, ease: 'tail', dur: 26},
  {f: cf(42), x: X.cuda + 120, y: 470, z: 1.1, ease: 'sine', dur: 22},
  // 2008
  {f: cf(46) - 4, x: X.crash - 80, y: 470, z: 1.1, ease: 'tail', dur: 28},
  // 2012
  {f: cf(48) - 4, x: X.alex - 220, y: 440, z: 1.1, ease: 'tail', dur: 30},
  {f: cf(52), x: X.alex + 40, y: 440, z: 1.1, ease: 'sine', dur: 22},
  // 2016 DGX-1
  {f: cf(54) + 10, x: X.dgx - 260, y: 400, z: 1.1, ease: 'tail', dur: 26},
  // 2018 挖矿退潮
  {f: cf(59) + 12, x: X.crypto - 220, y: 400, z: 1.1, ease: 'tail', dur: 26},
  // ChatGPT
  {f: cf(62) - 4, x: X.gpt - 220, y: 560, z: 1.1, ease: 'tail', dur: 30},
  // 一万亿、五万亿
  {f: cf(65) + 6, x: (X.t1 - 480 + X.t5 + 0) / 2, y: 450, z: 0.85, ease: 'tail', dur: 26},
  // 回到现在
  {f: cf(68) + 8, x: X.now - 160, y: 480, z: 1.05, ease: 'tail', dur: 26},
];

/* ============ 通用小件 ============ */

const Person: React.FC<{x: number; y: number; name: string; note?: string; hair?: Hair; glasses?: boolean; beard?: boolean; tie?: boolean; leather?: boolean; shirt?: boolean; rot?: number; w?: number}> = ({x, y, name, note, rot = -3, w = 140, ...look}) => (
  <Put x={x} y={y}>
    <HalftonePhoto w={w} h={w * 1.2} rot={rot} dot={5} caption={name}>
      <Portrait w={w} h={w * 1.2} {...look} />
    </HalftonePhoto>
    {note && <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 22, color: V.inkSoft, textAlign: 'center', marginTop: 8, width: w + 28, whiteSpace: 'nowrap'}}>{note}</div>}
  </Put>
);

const Photo: React.FC<{x: number; y: number; w: number; h: number; caption: string; rot?: number; children: React.ReactNode}> = ({x, y, w, h, caption, rot = -2, children}) => (
  <Put x={x} y={y}>
    <HalftonePhoto w={w} h={h} rot={rot} dot={6} caption={caption}>
      {children}
    </HalftonePhoto>
  </Put>
);

const Note: React.FC<{x: number; y: number; size?: number; color?: string; children: React.ReactNode}> = ({x, y, size = 26, color = V.ink, children}) => (
  <Put x={x} y={y}>
    <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap'}}>{children}</div>
  </Put>
);

/* ============ 时间尺、市值网格、命运线 ============ */

const RULER_YEARS = [1993, 1995, 1996, 1997, 1999, 2006, 2008, 2012, 2016, 2018, 2022, 2023, 2025, 2026];

const Ruler: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: yx(1992.6), top: RULER_Y, width: yx(2027.6) - yx(1992.6), height: 6, background: V.ink}} />
    {RULER_YEARS.map((y) => (
      <div key={y} style={{position: 'absolute', left: yx(y) - 60, top: RULER_Y, width: 120, textAlign: 'center'}}>
        <div style={{width: 5, height: 26, background: V.ink, margin: '0 auto'}} />
        <div style={{fontFamily: VF.num, fontSize: 44, color: V.ink, marginTop: 6}}>{y}</div>
      </div>
    ))}
  </>
);

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
        {[X.ipo, X.cuda + 600, X.alex + 650, X.crypto + 650, X.t5 + 600].map((x) => (
          <div key={x} style={{position: 'absolute', left: x + 10, top: capY(b as number) - 30, fontFamily: VF.heavy, fontSize: 22, color: 'rgba(23,23,22,0.38)', whiteSpace: 'nowrap'}}>
            {t}
          </div>
        ))}
      </React.Fragment>
    ))}
    <div style={{position: 'absolute', left: X.ipo + 160, top: capY(0.63) + 16, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.red, whiteSpace: 'nowrap'}}>红线：英伟达市值（对数刻度，大致走势，示意）</div>
  </>
);

const CapLine: React.FC<{x0: number; x1: number}> = ({x0, x1}) => {
  const d = CAP_PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const head = Math.min(x1, CAP_PTS[CAP_PTS.length - 1][0]);
  return (
    <>
      <svg width={WORLD_W} height={WORLD_H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', clipPath: `inset(0 ${WORLD_W - x1}px 0 ${x0}px)`}}>
        <path d={`M${X.found} ${capY(0.63)} L${X.ipo} ${capY(0.63)}`} stroke="rgba(23,23,22,0.35)" strokeWidth={6} strokeDasharray="14 12" fill="none" />
        <path d={d} stroke={V.red} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {head > x0 && head > X.ipo && <div style={{position: 'absolute', left: head - 16, top: capAt(head) - 16, width: 32, height: 32, borderRadius: 16, background: V.red, border: `4px solid ${V.paper}`}} />}
      {x0 <= X.found && x1 > X.found && x1 < X.ipo && (
        <div style={{position: 'absolute', left: X.found + 40, top: capY(0.63) - 46, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft, whiteSpace: 'nowrap'}}>还没上市</div>
      )}
    </>
  );
};

const lineSpan = (f: number, camX: number): [number, number] => {
  if (f < cf(12)) return [yx(2022), WORLD_W];
  if (f < cf(13)) return [0, WORLD_W];
  if (f < cf(71)) return [0, Math.max(X.found, camX + 650)];
  return [0, WORLD_W];
};

/* ============ 现在：钩子（结尾回来） ============ */

const Now: React.FC<{f: number}> = ({f}) => {
  const x = X.now;
  return (
    <>
      <At f={f} at={cf(1)}>
        <Put x={x - 1020} y={250}>
          <Label size={30} bg={V.red}>
            全球市值第一 · 2026.10
          </Label>
        </Put>
      </At>
      <At f={f} at={cf(10)}>
        <Put x={x - 1020} y={300}>
          <Big size={120}>5.8 万亿美元</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.ink, marginTop: 4}}>盘中市值，离 6 万亿只差一步</div>
        </Put>
      </At>
      <RedCircle f={f} at={cw(69, '5.8')} cx={x - 680} cy={362} rx={380} ry={80} seed={31} width={6} />
      <At f={f} at={cf(2)}>
        <Put x={x - 1000} y={520}>
          <Sticker rot={-6}>
            <AlarmClock />
          </Sticker>
        </Put>
        <Note x={x - 990} y={740} size={30}>
          凌晨 4 点回邮件
        </Note>
      </At>
      <At f={f} at={cf(3)}>
        <Put x={x - 760} y={560}>
          <Sticker rot={2}>
            <div style={{background: '#fff', padding: 10, display: 'flex', gap: 6}}>
              {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
                <div key={d} style={{width: 46, height: 64, border: `3px solid ${V.ink}`, fontFamily: VF.heavy, fontSize: 24, textAlign: 'center', lineHeight: '58px', background: f >= cf(3) + i * 3 ? V.red : '#fff', color: f >= cf(3) + i * 3 ? '#fff' : V.ink}}>
                  {d}
                </div>
              ))}
            </div>
          </Sticker>
        </Put>
        <Note x={x - 750} y={680} size={30}>
          一周干 7 天
        </Note>
      </At>
      <At f={f} at={cw(4, '30 天')}>
        <Put x={x - 300} y={260}>
          <Sticker rot={-5}>
            <TearCalendar n={30} />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(5)}>
        <Put x={x - 40} y={190}>
          <Label size={28}>英伟达 NVIDIA</Label>
        </Put>
      </At>
      <At f={f} at={cf(6)}>
        <Person x={x - 40} y={240} name="黄仁勋" note="英伟达创始人、CEO" hair="short" leather w={160} rot={3} />
      </At>
      <At f={f} at={cf(7)}>
        <Put x={x + 260} y={250}>
          <Sticker rot={6}>
            <Mic />
          </Sticker>
        </Put>
        <Put x={x - 40} y={570}>
          <Doc w={660} h={230} color="#f3efe6">
            <div style={{fontFamily: VF.body, fontSize: 20, letterSpacing: 2, color: V.inkSoft}}>2025 · JOE ROGAN 播客</div>
            <div style={{fontFamily: VF.head, fontSize: 32, lineHeight: 1.3, marginTop: 10}}>
              “You know the phrase{' '}
              <Highlight f={f} at={cf(8)} w={430} h={36}>
                ‘30 days from going out of business,’
              </Highlight>{' '}
              I’ve used for{' '}
              <Highlight f={f} at={cf(9)} w={130} h={36}>
                33 years.
              </Highlight>
              ”
            </div>
          </Doc>
        </Put>
      </At>
      <At f={f} at={cf(11)}>
        <Put x={x + 440} y={200}>
          <div style={{fontFamily: VF.num, fontSize: 240, color: V.red, lineHeight: 1, transform: 'rotate(8deg)'}}>?</div>
        </Put>
      </At>
    </>
  );
};

/* ============ 1993 丹尼斯餐厅 ============ */

const Founding: React.FC<{f: number}> = ({f}) => {
  const x = X.found;
  return (
    <>
      <Put x={x - 760} y={60}>
        <Label size={28}>1993 · 加州圣何塞 · 丹尼斯餐厅</Label>
      </Put>
      <Photo x={x - 760} y={110} w={330} h={220} caption="丹尼斯餐厅的卡座（示意）" rot={-3}>
        <DinerArt w={330} h={220} />
      </Photo>
      <Person x={x - 360} y={90} name="黄仁勋" note="30 岁" hair="short" glasses shirt w={120} rot={-3} />
      <Person x={x - 180} y={100} name="马拉科夫斯基" note="工程师" hair="short" beard glasses shirt w={120} rot={3} />
      <Person x={x} y={90} name="普里姆" note="工程师" hair="swept" glasses shirt w={120} rot={-2} />
      <At f={f} at={cf(15)}>
        <Put x={x + 200} y={100}>
          <IndexCard w={380} h={280} rot={2}>
            <div style={{fontFamily: VF.heavy, fontSize: 28, color: V.red, marginTop: -16}}>餐巾纸上的想法</div>
            <svg width={320} height={150} viewBox="0 0 320 150" style={{overflow: 'visible'}}>
              <HandLine points={[[40, 120], [40, 50], [110, 20], [110, 90], [40, 120]]} p={p12(f, cf(15), 10)} width={5} dot={false} color={V.ink} />
              <HandLine points={[[110, 20], [180, 50], [180, 120], [110, 90]]} p={p12(f, cf(15) + 6, 10)} width={5} dot={false} color={V.ink} />
              <HandLine points={[[40, 120], [110, 150], [180, 120]]} p={p12(f, cf(15) + 12, 8)} width={5} dot={false} color={V.ink} />
              <text x={200} y={90} fontFamily={VF.heavy} fontSize={28} fill={V.ink}>3D 图形芯片</text>
            </svg>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(15) + 30}>
        <Put x={x + 220} y={430}>
          <PostIt w={250} rot={-3} head="启动资金">
            大约 4 万美元
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(17)}>
        <Put x={x - 720} y={520}>
          <Sticker rot={-4}>
            <Plates />
          </Sticker>
        </Put>
        <Put x={x - 470} y={500}>
          <PostIt w={320} rot={3} head="15 岁 · 俄勒冈州波特兰">
            在丹尼斯餐厅打工，洗过盘子，也端过盘子
          </PostIt>
        </Put>
        <Put x={x - 120} y={520}>
          <Sticker rot={6}>
            <Mug />
          </Sticker>
        </Put>
      </At>
    </>
  );
};

/* ============ 1995 NV1：押错了技术路线 ============ */

const Nv1: React.FC<{f: number}> = ({f}) => {
  const x = X.nv1;
  return (
    <>
      <At f={f} at={cf(19) - 6}>
        <Put x={x - 660} y={60}>
          <Label size={28}>1995 · 第一款芯片 NV1</Label>
        </Put>
        <Photo x={x - 660} y={110} w={320} h={210} caption="NV1 显卡（示意）" rot={-2}>
          <CardArt w={320} h={210} />
        </Photo>
      </At>
      <At f={f} at={cf(20)}>
        <Put x={x - 270} y={100}>
          <IndexCard w={580} h={330}>
            <div style={{display: 'flex', gap: 40, marginTop: -10}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.ink}}>NV1 · 用曲面画</div>
                <CurveVsTri />
              </div>
              <div style={{textAlign: 'center', opacity: f >= cf(21) ? 1 : 0}}>
                <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.red}}>微软标准 · 用三角形</div>
                <CurveVsTri tri />
              </div>
            </div>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 28, color: V.red, marginTop: 10}}>{f >= cf(21) + 20 ? '对不上' : ''}</div>
          </IndexCard>
        </Put>
      </At>
      <RedX f={f} at={cf(21) + 20} x={x - 160} y={270} s={50} />
      <At f={f} at={cf(21) + 20}>
        <RedCheck f={f} at={cf(21) + 20} x={x + 140} y={250} s={28} />
      </At>
      <At f={f} at={cf(22)}>
        <Put x={x + 360} y={110}>
          <Sticker rot={4}>
            <Trend label="卖得一塌糊涂（示意）" />
          </Sticker>
        </Put>
      </At>
    </>
  );
};

/* ============ 1996：只剩一个月工资（30 天的出处） ============ */

const Crisis1996: React.FC<{f: number}> = ({f}) => {
  const x = X.crisis;
  const cut = f >= cf(25) + 10;
  return (
    <>
      <At f={f} at={cf(24)}>
        <Put x={x - 720} y={110}>
          <Sticker rot={-4}>
            <Console />
          </Sticker>
        </Put>
        <Note x={x - 720} y={290}>
          给世嘉做的游戏机芯片
        </Note>
        <Put x={x - 640} y={340}>
          <Stamp size={42} rot={-10}>
            做不下去了
          </Stamp>
        </Put>
      </At>
      <At f={f} at={cf(25)}>
        <Put x={x - 330} y={110}>
          <Sticker>
            <div style={{background: '#fff', padding: '12px 16px'}}>
              <People n={10} size={40} lit={cut ? 4 : 10} />
              <div style={{fontFamily: VF.heavy, fontSize: 28, color: cut ? V.red : V.ink, marginTop: 6}}>{cut ? '裁掉一大半员工' : '员工'}</div>
            </div>
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(26)}>
        <Put x={x - 330} y={330}>
          <IndexCard w={420} h={200} rot={-2}>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.ink, marginTop: -14}}>账上的钱</div>
            <div style={{fontFamily: VF.heavy, fontSize: 44, color: V.red, marginTop: 8}}>= 1 个月工资</div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(27)}>
        <Put x={x + 220} y={90}>
          <Sticker rot={-6}>
            <TearCalendar n={30} />
          </Sticker>
        </Put>
        <Put x={x + 180} y={450}>
          <Label size={32} bg={V.red}>
            「30 天」的出处
          </Label>
        </Put>
      </At>
    </>
  );
};

/* ============ 1996 世嘉的 500 万、全押下一颗芯片 ============ */

const Sega: React.FC<{f: number}> = ({f}) => {
  const x = X.sega;
  return (
    <>
      <At f={f} at={cf(28)}>
        <Put x={x - 740} y={110}>
          <Sticker rot={-8}>
            <Plane />
          </Sticker>
        </Put>
        <Note x={x - 720} y={250}>
          飞到日本
        </Note>
        <Put x={x - 460} y={90}>
          <Doc w={520} h={330} color="#f3efe6" rot={-1}>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, lineHeight: 1.6}}>
              致世嘉：
              <br />
              {f >= cf(29) && <TypeOn f={f} at={cf(29)} text="这颗芯片做不成了。" cps={10} cursor={false} />}
              <br />
              {f >= cf(30) && <TypeOn f={f} at={cf(30)} text="但我们还需要最后那 500 万美元，" cps={12} cursor={false} />}
              <br />
              {f >= cf(30) + 30 && <TypeOn f={f} at={cf(30) + 30} text="才能活下去。" cps={10} cursor={false} />}
            </div>
          </Doc>
        </Put>
      </At>
      <At f={f} at={cw(30, '500 万')}>
        <Put x={x + 120} y={110}>
          <Big size={130}>500 万美元</Big>
        </Put>
      </At>
      <At f={f} at={cw(31, '改成')}>
        <Put x={x + 160} y={270}>
          <Stamp size={52} rot={-8}>
            改成了投资
          </Stamp>
        </Put>
      </At>
      <At f={f} at={cf(33)}>
        <Put x={x + 120} y={420}>
          <Label size={30} bg={V.red}>
            剩下的钱，全押下一颗芯片
          </Label>
        </Put>
      </At>
    </>
  );
};

/* ============ 1997 RIVA 128 ============ */

const Riva: React.FC<{f: number}> = ({f}) => {
  const x = X.riva;
  return (
    <At f={f} at={cf(34) - 6}>
      <Put x={x - 680} y={60}>
        <Label size={28}>1997 · RIVA 128</Label>
      </Put>
      <Photo x={x - 680} y={110} w={320} h={210} caption="RIVA 128 显卡（示意）" rot={2}>
        <CardArt w={320} h={210} />
      </Photo>
      <Put x={x - 300} y={110}>
        <Sticker rot={-6}>
          <Chip label="RIVA 128" color="#2c3440" />
        </Sticker>
      </Put>
      <At f={f} at={cf(35)}>
        <Put x={x - 60} y={110}>
          <Big size={150}>{countUp(f, cf(35), 100, 26)} 万+ 颗</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 32, color: V.ink}}>头四个月卖出去的</div>
        </Put>
        <Put x={x - 40} y={360}>
          <Sticker rot={-3}>
            <Trend up label="活下来了" />
          </Sticker>
        </Put>
      </At>
    </At>
  );
};

/* ============ 1999 上市、GeForce 256 ============ */

const Ipo1999: React.FC<{f: number}> = ({f}) => {
  const xi = X.ipo;
  const xg = X.gf;
  return (
    <>
      <At f={f} at={cf(36) - 6}>
        <Put x={xi - 560} y={60}>
          <Label size={28}>1999.1.22 · 纳斯达克上市</Label>
        </Put>
        <Put x={xi - 560} y={110}>
          <div style={{width: 500, padding: 12, background: '#e9efe2', border: '10px double #4f7a52', boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
            <div style={{fontFamily: VF.head, fontSize: 38, textAlign: 'center', color: '#2f4f32'}}>NVIDIA CORPORATION</div>
            <div style={{fontFamily: VF.body, fontSize: 22, textAlign: 'center', color: '#2f4f32', letterSpacing: 4}}>COMMON STOCK</div>
            <div style={{fontFamily: VF.num, fontSize: 70, textAlign: 'center', color: '#2f4f32', marginTop: 6}}>$12</div>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 22, textAlign: 'center', color: '#2f4f32'}}>每股发行价</div>
          </div>
        </Put>
      </At>
      <At f={f} at={cf(37)}>
        <Put x={xg - 440} y={60}>
          <Label size={28}>1999 · GeForce 256</Label>
        </Put>
        <Put x={xg - 440} y={120}>
          <Sticker rot={-4}>
            <GpuCard label="GeForce 256" />
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(38) + 4}>
        <Put x={xg + 0} y={110}>
          <IndexCard w={430} h={260} rot={2}>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, lineHeight: 1.6, color: V.ink, marginTop: -14}}>
              CPU：电脑的大脑，什么都管
              <br />
              <span style={{color: V.red}}>GPU：专门画画面，</span>
              <br />
              <span style={{color: V.red}}>一次算成千上万个点</span>
            </div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(38)}>
        <Put x={xg - 400} y={310}>
          <Stamp size={90} rot={-8}>
            GPU
          </Stamp>
        </Put>
        <Note x={xg - 420} y={470} size={24} color={V.inkSoft}>
          英伟达的宣传语：世界第一颗 GPU
        </Note>
      </At>
    </>
  );
};

/* ============ 2006 CUDA ============ */

const CODE = ['// 让显卡算画面以外的东西', '__global__ void add(float *a, float *b) {', '  int i = threadIdx.x;', '  a[i] = a[i] + b[i];', '}'];

const Cuda: React.FC<{f: number}> = ({f}) => {
  const x = X.cuda;
  return (
    <>
      <At f={f} at={cf(39) - 6}>
        <Put x={x - 760} y={60}>
          <Label size={28} bg={V.red}>
            2006 · CUDA
          </Label>
        </Put>
        <Put x={x - 760} y={110}>
          <CodeCard lines={CODE} shown={Math.floor(p12(f, cf(39), 30) * CODE.length) + 1} />
        </Put>
      </At>
      <At f={f} at={cf(40)}>
        <Put x={x - 180} y={110}>
          <Sticker rot={-4}>
            <GpuCard label="GeForce" />
          </Sticker>
        </Put>
        <Note x={x - 170} y={270}>
          本来只会画游戏画面
        </Note>
      </At>
      <At f={f} at={cf(41)}>
        <Put x={x + 180} y={90}>
          <Sticker rot={6}>
            <Atom />
          </Sticker>
        </Put>
        <Note x={x + 160} y={280} color={V.red}>
          也能做科学计算
        </Note>
      </At>
      <At f={f} at={cf(42)}>
        <Put x={x - 200} y={340}>
          <PostIt w={300} rot={-3} head="黄仁勋后来说">
            成本涨了 50%，可公司当时的毛利率才 35%
          </PostIt>
        </Put>
      </At>
      <At f={f} at={cf(43)}>
        <Put x={x + 160} y={360}>
          <Sticker>
            <div style={{background: '#fff', padding: '10px 14px'}}>
              <People n={8} size={34} lit={1} />
              <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.ink, marginTop: 4}}>几乎没人用</div>
            </div>
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(44)}>
        <Put x={x + 500} y={110}>
          <Label size={26}>华尔街</Label>
          <Big size={110}>≈10 年</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 26, color: V.ink}}>才相信这笔钱没白花</div>
        </Put>
      </At>
    </>
  );
};

/** 又一次濒死：一张小日历 + 跌幅 */
const NearDeath: React.FC<{f: number; at: number; x: number; y: number; drop: string; title: string}> = ({f, at, x, y, drop, title}) => (
  <At f={f} at={at}>
    <Put x={x} y={y}>
      <Label size={28}>{title}</Label>
      <Big size={140} color={V.red}>
        {drop}
      </Big>
    </Put>
    <Put x={x + 420} y={y - 10}>
      <div style={{transform: 'scale(0.7)', transformOrigin: 'left top'}}>
        <Sticker rot={6}>
          <TearCalendar n={30} top="又一次" />
        </Sticker>
      </div>
    </Put>
  </At>
);

/* ============ 2012 AlexNet ============ */

const AlexNet: React.FC<{f: number}> = ({f}) => {
  const x = X.alex;
  const bars = [
    {name: '第二名', v: 26.2, c: '#8a847c'},
    {name: '辛顿团队', v: 15.3, c: V.red},
  ];
  return (
    <>
      <At f={f} at={cf(48)}>
        <Put x={x - 760} y={60}>
          <Label size={28} bg={V.red}>
            2012 · 转机
          </Label>
        </Put>
      </At>
      <At f={f} at={cf(49)}>
        <Person x={x - 760} y={110} name="克里热夫斯基" note="辛顿的学生" hair="short" shirt w={110} rot={-3} />
        <Person x={x - 600} y={120} name="苏茨克维" note="辛顿的学生" hair="receding" shirt w={110} rot={3} />
      </At>
      <At f={f} at={cf(50)}>
        <Put x={x - 420} y={110}>
          <Sticker rot={-5}>
            <GpuCard label="GTX 580" />
          </Sticker>
        </Put>
        <Put x={x - 390} y={250}>
          <Sticker rot={4}>
            <GpuCard label="GTX 580" />
          </Sticker>
        </Put>
        <Note x={x - 380} y={410}>
          两块游戏显卡
        </Note>
      </At>
      <At f={f} at={cf(52)}>
        <Put x={x + 0} y={100}>
          <IndexCard w={460} h={300}>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft, marginTop: -18}}>图片识别错误率（越低越好）</div>
            {bars.map((b, i) => {
              const p = p12(f, cf(52) + i * 10, 14);
              return (
                <div key={b.name} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22}}>
                  <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, width: 110, color: V.ink}}>{b.name}</div>
                  <div style={{height: 44, width: b.v * 9 * p, background: b.c}} />
                  <div style={{fontFamily: VF.num, fontSize: 40, color: b.c}}>{(b.v * p).toFixed(1)}%</div>
                </div>
              );
            })}
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(53)}>
        <Put x={x + 20} y={430}>
          <Label size={30} bg={V.red}>
            深度学习从此离不开 GPU
          </Label>
        </Put>
      </At>
    </>
  );
};

/* ============ 2016 DGX-1 送到 OpenAI ============ */

const Dgx: React.FC<{f: number}> = ({f}) => {
  const x = X.dgx;
  return (
    <>
      <At f={f} at={cf(54) - 6}>
        <Put x={x - 760} y={50}>
          <Label size={28}>2016.8.9 · 旧金山</Label>
        </Put>
        <Photo x={x - 760} y={100} w={340} h={220} caption="DGX-1 超级计算机（示意）" rot={-2}>
          <DgxArt w={340} h={220} />
        </Photo>
      </At>
      <At f={f} at={cf(55)}>
        <Person x={x - 370} y={80} name="黄仁勋" note="亲手送过去" hair="short" leather w={120} rot={3} />
      </At>
      <At f={f} at={cf(57) - 4}>
        <Put x={x - 170} y={90}>
          <IndexCard w={500} h={250} rot={-2}>
            <div style={{fontFamily: VF.hand, fontSize: 38, color: '#1f3f8a', lineHeight: 1.15, marginTop: -16}}>
              To Elon &amp; the OpenAI Team!
              <br />
              To the future of computing and humanity.
            </div>
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.red, marginTop: 8}}>献给计算和人类的未来</div>
          </IndexCard>
        </Put>
      </At>
      <At f={f} at={cf(58)}>
        <Put x={x - 150} y={370}>
          <Label size={30} bg={V.red}>
            OpenAI · 当时还是一家小公司
          </Label>
        </Put>
      </At>
    </>
  );
};

/* ============ 2018 挖矿退潮 ============ */

const Crypto2018: React.FC<{f: number}> = ({f}) => {
  const x = X.crypto;
  return (
    <>
      <At f={f} at={cf(60)}>
        <Put x={x - 760} y={50}>
          <Label size={28}>2018 · 挖矿热退潮</Label>
        </Put>
        <Put x={x - 760} y={100}>
          <Sticker rot={-4}>
            <MiningRig />
          </Sticker>
        </Put>
        <Put x={x - 440} y={90}>
          <Sticker rot={3}>
            <BoxPile />
          </Sticker>
        </Put>
        <Put x={x - 400} y={280}>
          <Stamp size={44} rot={-10}>
            卖不出去
          </Stamp>
        </Put>
      </At>
    </>
  );
};

/* ============ 2022 ChatGPT 之后 ============ */

const Boom: React.FC<{f: number}> = ({f}) => {
  const x = X.gpt;
  const x1 = X.t1;
  const x5 = X.t5;
  return (
    <>
      <At f={f} at={cf(62)}>
        <Put x={x - 760} y={450}>
          <Label size={28} bg={V.red}>
            2022.11.30 · ChatGPT 上线
          </Label>
        </Put>
        <Put x={x - 760} y={500}>
          <Sticker rot={-3}>
            <div style={{background: '#fff', padding: 14, width: 300}}>
              <div style={{background: '#e9e6df', borderRadius: 14, padding: '6px 14px', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, width: 'fit-content', marginLeft: 'auto'}}>你好</div>
              <div style={{background: '#d9ead3', borderRadius: 14, padding: '6px 14px', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, width: 'fit-content', marginTop: 10}}>你好！有什么可以帮你？</div>
            </div>
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(63)}>
        <Put x={x - 380} y={470}>
          <Sticker rot={2}>
            <Racks />
          </Sticker>
        </Put>
        <Put x={x - 40} y={480}>
          <Sticker>
            <div style={{background: '#fff', padding: '10px 14px'}}>
              {[0, 1].map((r) => (
                <div key={r} style={{display: 'block', lineHeight: 0}}>
                  <People n={8} size={32} lit={Math.min(8, Math.floor(p12(f, cf(63), 20) * 8) + 1 - r * 2)} />
                </div>
              ))}
              <div style={{fontFamily: VF.heavy, fontSize: 26, color: V.ink, marginTop: 6}}>全世界都在抢芯片</div>
            </div>
          </Sticker>
        </Put>
      </At>
      <At f={f} at={cf(64)}>
        <Put x={x + 280} y={470}>
          <PostIt w={250} rot={4} head="那时候">
            市值大约 4000 亿美元
          </PostIt>
        </Put>
      </At>
      <RedCircle f={f} at={cf(64)} cx={x} cy={capAt(x)} rx={110} ry={50} seed={41} width={6} />
      <At f={f} at={cf(65)}>
        <Put x={x1 - 480} y={420}>
          <Label size={28}>2023</Label>
          <Big size={130}>1 万亿美元</Big>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 28, color: V.ink}}>第一家市值破万亿的芯片公司</div>
        </Put>
      </At>
      <At f={f} at={cf(66)}>
        <Put x={x5 - 700} y={290}>
          <Label size={28} bg={V.red}>
            2025.10.29 · 人类历史上第一家
          </Label>
          <Big size={150}>5 万亿美元</Big>
        </Put>
      </At>
    </>
  );
};

/* ============ 结尾：一张小图看完 33 年 ============ */

const MiniChart: React.FC<{f: number}> = ({f}) => {
  if (f < cf(71) || f >= cf(79)) return null;
  const x0 = 300;
  const x1 = 1260;
  const t0 = 1999;
  const t1 = 2026.8;
  const sx = (y: number) => x0 + ((y - t0) / (t1 - t0)) * (x1 - x0);
  const sy = (b: number) => 660 - (Math.log10(b) + 0.2) * 108;
  const pts = CAP.map(([y, b]) => [sx(y), sy(b)] as [number, number]);
  const p = p12(f, cf(71), 26);
  const deaths: [number, number, string][] = [
    [2008.9, 3.5, '2008 · 跌掉八成多'],
    [2018.9, 80, '2018 · 跌掉一半多'],
  ];
  const bets: [number, number, string][] = [
    [1999.05, 0.63, 'GPU'],
    [2006.5, 12, 'CUDA'],
    [2016.6, 30, 'AI'],
  ];
  return (
    <div style={{position: 'absolute', left: 120, top: 80, width: 1680, height: 780, background: V.card, boxShadow: '4px 8px 14px rgba(23,23,22,0.4)'}}>
      <div style={{position: 'absolute', left: 60, top: 36, fontFamily: VF.heavy, fontSize: 40, color: V.paper}}>从一个月的工资，到快 6 万亿</div>
      <div style={{position: 'absolute', left: 60, top: 94, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: 'rgba(238,237,237,0.6)'}}>英伟达市值 1999–2026 · 对数刻度，大致走势，示意</div>
      <svg width={1680} height={780} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${x0} 700 L${x1 + 30} 700`} stroke="rgba(238,237,237,0.5)" strokeWidth={3} />
        {[1999, 2008, 2018, 2026].map((y) => (
          <text key={y} x={sx(y)} y={740} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={28} fill="rgba(238,237,237,0.75)">
            {y}
          </text>
        ))}
        <HandLine points={pts} p={p} width={8} />
      </svg>
      {f >= cf(72) &&
        deaths.map(([y, b, t]) => (
          <div key={t} style={{position: 'absolute', left: sx(y) - 110, top: sy(b) + 24}}>
            <Label size={24} bg={V.red}>
              {t}
            </Label>
          </div>
        ))}
      {f >= cf(73) &&
        bets.map(([y, b, t], i) => (
          <div key={t} style={{position: 'absolute', left: sx(y) - 40, top: sy(b) - 70 - (i === 2 ? 40 : 0), opacity: f >= cf(73) + i * 8 ? 1 : 0}}>
            <Label size={26} bg={V.hiSolid} color={V.ink}>
              押 {t}
            </Label>
          </div>
        ))}
      {f >= cf(74) && (
        <div style={{position: 'absolute', left: 1330, top: 170, transform: `rotate(${f >= cf(77) ? Math.sin(step12(f) * 0.6) * 4 : -4}deg)`}}>
          <TearCalendar n={30} />
        </div>
      )}
      {f >= cf(76) && (
        <div style={{position: 'absolute', left: 1300, top: 560, width: 300, fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: V.paper, lineHeight: 1.4}}>
          下一个大注押错了，
          <br />
          这句话随时成真
        </div>
      )}
    </div>
  );
};

/* ============ 结尾黑卡 ============ */

const EndCard: React.FC<{f: number}> = ({f}) =>
  f < cf(79) ? null : (
    <div style={{position: 'absolute', inset: 0}}>
      <Desk w={W} h={H} seed={2} />
      <div style={{position: 'absolute', left: 90, top: 70, width: W - 180, height: H - 260, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
      <div style={{position: 'absolute', left: 200, top: 220, color: V.paper}}>
        <Label size={44} bg={V.red}>
          英伟达 33 年 · 1993–2026
        </Label>
        <div style={{fontFamily: VF.heavy, fontSize: 120, marginTop: 40}}>
          <TypeOn f={f} at={cf(80)} text="我们下期再见" cps={10} cursor={false} />
        </div>
      </div>
      <Underline f={f} at={cf(80) + 20} x={200} y={560} w={760} />
      <div style={{position: 'absolute', right: 230, top: 230, transform: 'rotate(6deg)'}}>
        <TearCalendar n={30} />
      </div>
    </div>
  );

/* ============ 年份计数器 ============ */

const YEAR_STOPS: [number, number, number?][] = [
  [0, 2026],
  [cf(13) - 6, 1993],
  [cf(19) - 6, 1995],
  [cf(23) - 6, 1996],
  [cf(34) - 6, 1997],
  [cf(36) - 6, 1999],
  [cf(39) - 6, 2006],
  [cf(46) - 6, 2008],
  [cf(48) - 6, 2012],
  [cf(54) - 6, 2016],
  [cf(59) + 12, 2018],
  [cf(62) - 6, 2022],
  [cf(65) - 6, 2023],
  [cf(66) - 6, 2025],
  [cf(68) + 8, 2026],
];

const Hud: React.FC<{f: number; camX: number; z: number}> = ({f, camX, z}) => {
  if (f < cf(1) || f >= cf(71) || z < 0.4) return null;
  const tracking = f >= cf(12) && f < cf(13) - 6;
  const year = tracking ? xy(camX) : rollYear(f, YEAR_STOPS, step12);
  return <YearCounter year={year} from={1993} to={2026} title="英伟达 33 年" bands={[[1995.5, 1996.9], [2008, 2009.3], [2018.7, 2019.2]]} bandColor="rgba(184,67,63,0.75)" />;
};

/* ============ 整片 ============ */

export const Film: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, CAM);
  const [l0, l1] = lineSpan(f, cam.x);
  return (
    <>
      <World cam={cam} w={W} h={H}>
        <Desk w={WORLD_W} h={WORLD_H + 400} color={V.oldMap} seed={8} />
        <DeskLitter x0={300} x1={WORLD_W - 300} y0={-40} y1={1000} count={70} seed={20} />
        <CapGrid />
        <Ruler />
        <CapLine x0={l0} x1={l1} />
        <Now f={f} />
        <Founding f={f} />
        <Nv1 f={f} />
        <Crisis1996 f={f} />
        <Sega f={f} />
        <Riva f={f} />
        <Ipo1999 f={f} />
        <Cuda f={f} />
        <NearDeath f={f} at={cf(46)} x={X.crash - 480} y={110} drop="−84%" title="2008 · 金融危机" />
        <RedCircle f={f} at={cf(47)} cx={X.crash} cy={capAt(X.crash)} rx={140} ry={60} seed={37} width={6} />
        <AlexNet f={f} />
        <Dgx f={f} />
        <Crypto2018 f={f} />
        <NearDeath f={f} at={cf(61)} x={X.crypto - 20} y={70} drop="−56%" title="两个多月" />
        <RedCircle f={f} at={cf(61) + 8} cx={yx(2018.83)} cy={capAt(yx(2018.83))} rx={150} ry={60} seed={39} width={6} />
        <Boom f={f} />
        {[
          [X.sega - 200, 92],
          [X.found - 600, 112],
          [X.dgx + 80, 92],
          [X.now + 290, 572],
        ].map(([x, y]) => (
          <div key={x} style={{position: 'absolute', left: x - 17, top: y - 17}}>
            <Pushpin />
          </div>
        ))}
      </World>
      <Hud f={f} camX={cam.x} z={cam.z} />
      <MiniChart f={f} />
      <EndCard f={f} />
    </>
  );
};

/* ============ 音效 ============ */

export const FILM_SFX: SfxCue[] = [
  ['paper', cf(1), 0.3],
  ['ding', cf(2), 0.3],
  ['pop', cf(3), 0.25],
  ['stamp', cw(4, '30 天'), 0.4],
  ['paper', cf(5), 0.3],
  ['pop', cf(6), 0.3],
  ['click', cf(7), 0.3],
  ['ding', cf(10), 0.35],
  ['question', cf(11), 0.35],
  ['whoosh', cf(12) + 4, 0.4],
  ['paper', cf(13) - 4, 0.3],
  ['type', cf(15), 0.3],
  ['ding', cf(15) + 30, 0.3],
  ['pop', cf(17), 0.3],
  ['whoosh', cf(19) - 30, 0.3],
  ['paper', cf(20), 0.3],
  ['error', cf(21) + 20, 0.35],
  ['error', cf(22), 0.3],
  ['whoosh', cf(23) - 28, 0.3],
  ['pop', cf(24), 0.3],
  ['stamp', cf(24) + 6, 0.4],
  ['snip', cf(25) + 10, 0.35],
  ['paper', cf(26), 0.3],
  ['stamp', cf(27), 0.45],
  ['whoosh', cf(28) - 28, 0.3],
  ['type', cf(29), 0.3],
  ['ding', cw(30, '500 万'), 0.35],
  ['stamp', cw(31, '改成'), 0.4],
  ['pop', cf(33), 0.3],
  ['whoosh', cf(34) - 28, 0.3],
  ['magic', cf(35), 0.35],
  ['whoosh', cf(36) - 26, 0.3],
  ['ding', cf(36), 0.3],
  ['pop', cf(37), 0.3],
  ['stamp', cf(38), 0.45],
  ['whoosh', cf(39) - 30, 0.3],
  ['type', cf(39), 0.3],
  ['pop', cf(40), 0.25],
  ['magic', cf(41), 0.3],
  ['paper', cf(42), 0.3],
  ['pop', cf(43), 0.25],
  ['ding', cf(44), 0.3],
  ['whoosh', cf(46) - 28, 0.3],
  ['error', cf(46), 0.35],
  ['shake', cf(47), 0.35],
  ['whoosh', cf(48) - 30, 0.3],
  ['pop', cf(49), 0.3],
  ['pop', cf(50), 0.3],
  ['ding', cf(52) + 14, 0.35],
  ['magic', cf(53), 0.35],
  ['whoosh', cf(54) - 30, 0.3],
  ['paper', cf(55), 0.3],
  ['type', cf(57), 0.3],
  ['ding', cf(58), 0.35],
  ['whoosh', cf(59) - 28, 0.3],
  ['stamp', cf(60) + 6, 0.4],
  ['error', cf(61), 0.35],
  ['whoosh', cf(62) - 30, 0.35],
  ['magic', cf(62), 0.3],
  ['pop', cf(63), 0.3],
  ['paper', cf(64), 0.3],
  ['whoosh', cf(65) - 26, 0.3],
  ['ding', cf(65), 0.35],
  ['whoosh', cf(66) - 26, 0.3],
  ['confetti', cf(67), 0.35],
  ['whoosh', cf(68) - 30, 0.35],
  ['ding', cw(69, '5.8'), 0.35],
  ['paper', cf(71), 0.35],
  ['error', cf(72), 0.3],
  ['pop', cf(73), 0.3],
  ['stamp', cf(75), 0.4],
  ['question', cf(78), 0.3],
  ['paper', cf(79), 0.35],
  ['type', cf(80), 0.3],
];
