import React from 'react';
import type {SfxCue} from '../../library/types';
import {Big, Put, RedX} from '../../library/vox/desk';
import {countUp, Hand, Head, Medal, p12, ShotFilm, type Shot} from '../../library/vox/shots';
import {BlackCard, VoxFootage} from '../../library/vox/footage';
import {At, HandLine, IndexCard, Label, RedCircle, Underline} from '../../library/vox/props';
import {PostIt, Stamp} from '../../library/vox/stickers';
import {V, VF} from '../../library/vox/theme';
import {cf, cw, DURATION} from './cues';

/**
 * Vox 拼贴版：A-roll 是黑卡大字，B-roll 是钉在桌面上的真实素材（NASA 动画、南极实拍、诺奖官方插图）。
 * 镜头之间全是硬切，切点落在字幕开头；B-roll 镜头整体缓慢推近，元素按 12fps 步进出现。
 * 素材在 public/footage/ep21-nobel-physics/，来源与授权见 materials/04-Vox科普/03-诺贝尔物理学奖/素材来源.md。
 */

const FT = 'footage/ep21-nobel-physics/';
const CR = {
  nasa: '视频：NASA Goddard（公有领域）',
  nobel: '插图：© Johan Jarnestad / 瑞典皇家科学院',
  michel: '照片：Christopher Michel / CC BY-SA 4.0',
  mirriat: '照片：John Hardin / CC BY 4.0',
  amble: '照片：Amble / CC BY-SA 3.0',
  icecube: '图：IceCube Science Team / CC BY 3.0',
  halzen: '照片：Mauro Mezzetto / CC BY-SA 4.0',
};
const ICE = '#7FD3FF';

/** 一根手指，指甲盖是粉的 */
const Finger: React.FC = () => (
  <svg width={110} height={190} viewBox="0 0 60 100">
    <rect x={10} y={8} width={40} height={92} rx={20} fill="#F4C9A8" stroke={V.ink} strokeWidth={3} />
    <rect x={18} y={14} width={24} height={26} rx={10} fill="#F7CFD6" stroke={V.ink} strokeWidth={3} />
  </svg>
);

/* ============ 镜头 ============ */

/* ---------- 开头：中微子成群飞过 → 地球被穿过（NASA 动画） ---------- */
const sEarth: Shot['C'] = ({f}) => (
  <>
    <Put x={260} y={70}>
      {f < cf(4) ? (
        <VoxFootage f={f} src={`${FT}nasa-stream.mp4`} kind="video" start={0} w={1300} h={731} rot={-1} zoom={[1.05, 1.1]} dur={70} credit={CR.nasa} />
      ) : (
        <VoxFootage f={f} src={`${FT}nasa-earth.mp4`} kind="video" start={cf(4)} w={1300} h={731} rot={-1} zoom={[1.05, 1.12]} dur={60} credit={CR.nasa} />
      )}
    </Put>
    <Put x={150} y={40}>
      <Label size={44} bg={V.red}>
        就在这一秒
      </Label>
    </Put>
    <At f={f} at={cf(4)}>
      <Put x={1080} y={690}>
        <Hand size={72}>你毫无感觉，对吧？</Hand>
      </Put>
      <RedCircle f={f} at={cf(4) + 4} cx={940} cy={430} rx={330} ry={300} seed={3} width={8} />
    </At>
  </>
);

/* ---------- A：650 亿个 ---------- */
const aBillions: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 150}}>
      <Label size={40} bg={V.red}>
        就在这一秒
      </Label>
    </div>
    <div style={{position: 'absolute', left: 140, top: 260, display: 'flex', alignItems: 'flex-end', gap: 30}}>
      <div style={{fontFamily: VF.num, fontSize: 330, lineHeight: 0.9, color: V.hiSolid}}>{countUp(f, cw(2, '650'), 650, 18)}</div>
      <Head size={170}>亿个</Head>
    </div>
    <At f={f} at={cf(3)}>
      <div style={{position: 'absolute', left: 150, top: 640}}>
        <Head size={96}>穿过了你的小指甲盖</Head>
      </div>
      <Underline f={f} at={cf(3) + 6} x={150} y={760} w={900} seed={4} />
    </At>
    <div style={{position: 'absolute', left: 1460, top: 440, transform: 'rotate(10deg)'}}>
      <Finger />
    </div>
  </BlackCard>
);

/* ---------- A：今年的诺贝尔物理学奖 ---------- */
const aNobel: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 170}}>
      <div style={{fontFamily: VF.num, fontSize: 200, color: V.paper, lineHeight: 1}}>2026</div>
      <div style={{marginTop: 30}}>
        <Head size={150} color={f >= cw(5, '物理学奖') ? V.hiSolid : V.paper}>
          诺贝尔物理学奖
        </Head>
      </div>
    </div>
    <Underline f={f} at={cw(5, '物理学奖')} x={150} y={600} w={1050} seed={5} />
    <div style={{position: 'absolute', left: 1450, top: 260, transform: 'rotate(8deg)'}}>
      <Medal s={260} />
    </div>
  </BlackCard>
);

/* ---------- B：南极冰立方实验室：有人在冰里抓住了它们 ---------- */
const sSouthPole: Shot['C'] = ({f}) => (
  <>
    <Put x={200} y={60}>
      <VoxFootage f={f} src={`${FT}lab-day.jpg`} start={cf(6)} w={1180} h={790} rot={1.5} zoom={[1, 1.12]} dur={60} focus={[0.55, 0.3]} credit={CR.michel} />
    </Put>
    <Put x={1430} y={110}>
      <IndexCard w={400} h={300} rot={3}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 36, color: V.ink, lineHeight: 1.5, marginTop: -14}}>
          南极点
          <br />
          冰立方实验室
          <br />
          <span style={{color: V.red}}>IceCube Lab</span>
        </div>
      </IndexCard>
    </Put>
    <At f={f} at={cw(6, '抓住')}>
      <Put x={1440} y={500}>
        <Hand size={64} rot={-6}>
          有人抓住了它们
        </Hand>
      </Put>
    </At>
  </>
);

/* ---------- B：什么是中微子（诺奖插图） ---------- */
const sNeutrino: Shot['C'] = ({f}) => {
  const tags: [string, number][] = [
    ['不带电', cf(8)],
    ['几乎没有质量', cw(8, '几乎')],
    ['能穿过整个地球', cf(9)],
  ];
  return (
    <>
      <Put x={110} y={80}>
        <VoxFootage f={f} src={`${FT}nobel-fig_fy_26_3x2.jpg`} start={cf(7) - 4} w={1050} h={700} rot={-1.5} zoom={[1, 1.1]} dur={140} focus={[0.3, 0.5]} credit={CR.nobel} />
      </Put>
      <Put x={1260} y={80}>
        <Label size={46}>中微子 Neutrino</Label>
      </Put>
      {tags.map(([t, at], i) => (
        <At key={t} f={f} at={at}>
          <Put x={1260} y={200 + i * 150}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <svg width={70} height={70} style={{overflow: 'visible'}}>
                <HandLine points={[[8, 36], [28, 58], [64, 8]]} p={p12(f, at, 6)} width={9} dot={false} />
              </svg>
              <Head size={64} color={V.ink}>
                {t}
              </Head>
            </div>
          </Put>
        </At>
      ))}
    </>
  );
};

/* ---------- A：幽灵粒子 ---------- */
const aGhost: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
      <Head size={260} color={V.paper}>
        幽灵粒子
      </Head>
      <div style={{fontFamily: VF.head, fontStyle: 'italic', fontSize: 80, color: 'rgba(238,237,237,0.5)', marginTop: 20}}>“ghost particle”</div>
    </div>
    <Underline f={f} at={cw(10, '幽灵') + 4} x={560} y={560} w={800} seed={7} />
  </BlackCard>
);

/* ---------- A：怎么抓一个幽灵？ ---------- */
const aHow: Shot['C'] = () => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 320}}>
      <Head size={170}>怎么抓一个</Head>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
        <Head size={210} color={V.hiSolid}>
          幽灵
        </Head>
        <div style={{fontFamily: VF.num, fontSize: 260, color: V.red, lineHeight: 0.8}}>?</div>
      </div>
    </div>
  </BlackCard>
);

/* ---------- B：1988，哈尔岑想到了南极 ---------- */
const sHalzen: Shot['C'] = ({f}) => (
  <>
    <Put x={330} y={70}>
      <VoxFootage f={f} src={`${FT}halzen.jpg`} start={cf(12)} w={560} h={740} rot={-2} zoom={[1.05, 1.15]} dur={80} focus={[0.4, 0.25]} credit={CR.halzen} />
    </Put>
    <Put x={1000} y={120}>
      <div style={{fontFamily: VF.num, fontSize: 160, color: V.red, lineHeight: 1}}>1988</div>
    </Put>
    <Put x={1000} y={300}>
      <Head size={100} color={V.ink}>
        弗朗西斯·哈尔岑
      </Head>
    </Put>
    <Put x={1000} y={440}>
      <IndexCard w={640} h={250} rot={1}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 34, color: V.ink, lineHeight: 1.6, marginTop: -14}}>
          2026 诺贝尔物理学奖得主
          <br />
          美国威斯康星大学麦迪逊分校教授
          <br />
          <span style={{color: V.red}}>他想到了：南极</span>
        </div>
      </IndexCard>
    </Put>
  </>
);

/* ---------- B：南极的冰又深又透明 ---------- */
const sIce: Shot['C'] = ({f}) => (
  <>
    <Put x={330} y={60}>
      <VoxFootage f={f} src={`${FT}lab-night.jpg`} start={cf(13)} w={1250} h={760} rot={1.5} zoom={[1, 1.12]} dur={50} focus={[0.5, 0.6]} credit={CR.mirriat} />
    </Put>
    <Put x={110} y={180}>
      <Stamp size={80} rot={-8}>
        又深
      </Stamp>
    </Put>
    <At f={f} at={cw(13, '透明')}>
      <Put x={110} y={420}>
        <Stamp size={80} rot={6}>
          又透明
        </Stamp>
      </Put>
    </At>
  </>
);

/* ---------- B：撞上原子核 → 一道微弱的蓝光 ---------- */
const sFlash: Shot['C'] = ({f}) => {
  const flash = cw(15, '蓝光');
  return (
    <>
      <Put x={80} y={110}>
        <VoxFootage f={f} src={`${FT}nobel-fig2_fy_pop_en_26_copy.jpg`} start={cf(14) - 2} w={820} h={560} rot={-2} zoom={[1, 1.18]} dur={90} focus={[0.36, 0.72]} credit={CR.nobel} bg="#fff" />
      </Put>
      <Put x={980} y={150}>
        <VoxFootage f={f} src={`${FT}nasa-icecube.mp4`} kind="video" start={cf(14) - 2} startFrom={30} w={840} h={473} rot={1.5} zoom={[1, 1.08]} dur={200} credit={CR.nasa} />
      </Put>
      <Put x={90} y={30}>
        <Label size={40}>中微子撞上原子核</Label>
      </Put>
      {f >= flash && <div style={{position: 'absolute', left: 994, top: 164, width: 840, height: 473, background: ICE, opacity: 0.55 * (1 - p12(f, flash, 10)), mixBlendMode: 'screen'}} />}
      <At f={f} at={flash}>
        <Put x={980} y={700}>
          <Head size={120} color="#2E7FB8">
            一道微弱的蓝光
          </Head>
        </Put>
      </At>
    </>
  );
};

/* ---------- B：埋下足够多的眼睛，把它拍下来 ---------- */
const sStrings: Shot['C'] = ({f}) => (
  <>
    <Put x={180} y={60}>
      <VoxFootage f={f} src={`${FT}nasa-strings.mp4`} kind="video" start={cf(16) - 2} w={1300} h={731} rot={-1} zoom={[1, 1.1]} dur={90} credit={CR.nasa} />
    </Put>
    <Put x={1300} y={110}>
      <PostIt w={420} rot={4} head="哈尔岑的办法" size={36}>
        在冰里埋下足够多的「眼睛」
      </PostIt>
    </Put>
    <At f={f} at={cf(17)}>
      <Put x={1080} y={720}>
        <Hand size={70}>把这道光拍下来</Hand>
      </Put>
    </At>
  </>
);

/* ---------- A：听起来很疯狂？他们真干了 ---------- */
const aCrazy: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 250}}>
      <Head size={150}>听起来很疯狂？</Head>
      <At f={f} at={cw(18, '他们')}>
        <div style={{marginTop: 50}}>
          <Head size={190} color={V.hiSolid}>
            他们真干了
          </Head>
        </div>
        <Underline f={f} at={cw(18, '他们') + 4} x={0} y={440} w={960} seed={6} />
      </At>
    </div>
  </BlackCard>
);

/* ---------- B：钻 86 个深洞 → 5160 个探测器 → 冰下两千多米 ---------- */
const sDrill: Shot['C'] = ({f}) => (
  <>
    <Put x={90} y={150}>
      <VoxFootage f={f} src={`${FT}drill-camp.jpg`} start={cf(19) - 4} w={1500} h={400} rot={-1} zoom={[1, 1.15]} dur={60} focus={[0.6, 0.5]} credit={CR.amble} />
    </Put>
    <Put x={110} y={50}>
      <Label size={40}>南极点 · 冰立方钻探营地</Label>
    </Put>
    <At f={f} at={cw(19, '86')}>
      <Put x={160} y={620}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <Big size={230} color={V.red}>
            {countUp(f, cw(19, '86'), 86, 12)}
          </Big>
          <Head size={80} color={V.ink}>
            个深洞，用热水钻
          </Head>
        </div>
      </Put>
    </At>
  </>
);

const sDom: Shot['C'] = ({f}) => (
  <>
    <Put x={180} y={60}>
      <VoxFootage f={f} src={`${FT}dom.jpg`} start={cf(20) - 2} w={720} h={720} rot={2} zoom={[1, 1.1]} dur={40} focus={[0.5, 0.45]} credit={CR.amble} />
    </Put>
    <Put x={1020} y={180}>
      <Label size={40}>探测器实物 · 一颗玻璃球</Label>
    </Put>
    <Put x={1000} y={260}>
      <Big size={250} color={V.red}>
        {countUp(f, cw(20, '5160'), 5160, 12)}
      </Big>
    </Put>
    <Put x={1020} y={540}>
      <Head size={90} color={V.ink}>
        个探测器
      </Head>
    </Put>
  </>
);

const sDepth: Shot['C'] = ({f}) => (
  <>
    <Put x={120} y={50}>
      <VoxFootage f={f} src={`${FT}diagram.png`} start={cw(20, '冰下') - 2} w={900} h={790} rot={-1} zoom={[1, 1.06]} dur={50} focus={[0.35, 0.55]} credit={CR.icecube} bg="#fff" />
    </Put>
    <Put x={1120} y={160}>
      <Label size={40} bg={V.red}>
        放进冰下
      </Label>
    </Put>
    <Put x={1100} y={240}>
      <Big size={180}>1450</Big>
    </Put>
    <Put x={1100} y={420}>
      <Head size={60} color={V.ink}>
        到 2450 米
      </Head>
    </Put>
    <Put x={1110} y={560}>
      <PostIt w={520} rot={-3} size={34} head="对比一下">
        最深处差不多能竖着叠 7 座半埃菲尔铁塔
      </PostIt>
    </Put>
  </>
);

/* ---------- A：一立方公里的冰 → 冰立方 ---------- */
const aIceCube: Shot['C'] = ({f}) => {
  const name = cf(22) + 12;
  return (
    <BlackCard>
      <div style={{position: 'absolute', left: 150, top: 160}}>
        <Head size={110}>一整立方公里的冰</Head>
        <div style={{marginTop: 20}}>
          <Head size={110}>变成了望远镜</Head>
        </div>
      </div>
      <At f={f} at={name}>
        <div style={{position: 'absolute', left: 150, top: 520, display: 'flex', alignItems: 'baseline', gap: 40}}>
          <Head size={200} color={ICE}>
            冰立方
          </Head>
          <div style={{fontFamily: VF.num, fontSize: 150, color: V.hiSolid}}>IceCube</div>
        </div>
      </At>
      <svg width={300} height={300} viewBox="0 0 100 100" style={{position: 'absolute', left: 1450, top: 150}}>
        <path d="M50 8 L90 28 L90 72 L50 92 L10 72 L10 28 Z" fill="none" stroke={ICE} strokeWidth={3} />
        <path d="M10 28 L50 48 L90 28 M50 48 L50 92" fill="none" stroke={ICE} strokeWidth={3} />
        {Array.from({length: 12}, (_, i) => (
          <circle key={i} cx={22 + (i % 4) * 19} cy={45 + Math.floor(i / 4) * 14 + (i % 4) * 3} r={2.2} fill={ICE} />
        ))}
      </svg>
    </BlackCard>
  );
};

/* ---------- B：2013 ---------- */
const s2013: Shot['C'] = ({f}) => (
  <>
    <Put x={600} y={70}>
      <VoxFootage f={f} src={`${FT}nasa-strings.mp4`} kind="video" start={cf(23)} startFrom={90} w={1200} h={675} rot={1} zoom={[1.05, 1.15]} dur={100} credit={CR.nasa} />
    </Put>
    <Put x={110} y={110}>
      <IndexCard w={460} h={440} rot={-3}>
        <div style={{fontFamily: VF.num, fontSize: 130, color: V.red, lineHeight: 1, marginTop: -14}}>2013</div>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 38, color: V.ink, lineHeight: 1.5, marginTop: 16}}>
          抓到了
          <br />
          来自太阳系外的
          <br />
          <span style={{background: V.hi}}>高能中微子</span>
        </div>
      </IndexCard>
    </Put>
  </>
);

/* ---------- B：2017 → 40 亿光年外 → 藏着巨型黑洞的星系 ---------- */
const s2017: Shot['C'] = ({f}) => (
  <>
    <Put x={110} y={60}>
      <VoxFootage f={f} src={`${FT}nasa-blazar.mp4`} kind="video" start={cf(24) - 4} startFrom={60} w={1260} h={709} rot={-1} zoom={[1, 1.12]} dur={100} focus={[0.48, 0.38]} credit={CR.nasa} />
    </Put>
    <Put x={1420} y={90}>
      <IndexCard w={400} h={230} rot={3}>
        <div style={{fontFamily: VF.num, fontSize: 80, color: V.red, lineHeight: 1, marginTop: -14}}>2017.9.22</div>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 32, color: V.ink, marginTop: 10}}>一个中微子指出了来处</div>
      </IndexCard>
    </Put>
    <At f={f} at={cw(25, '40')}>
      <RedCircle f={f} at={cw(25, '40')} cx={760} cy={300} rx={130} ry={100} seed={12} width={8} />
      <Put x={1440} y={380}>
        <Big size={150} color={V.red}>
          40 亿
        </Big>
        <Head size={80} color={V.ink}>
          光年外
        </Head>
      </Put>
    </At>
  </>
);

const sBlackHole: Shot['C'] = ({f}) => (
  <>
    <Put x={180} y={60}>
      <VoxFootage f={f} src={`${FT}nasa-jet.mp4`} kind="video" start={cf(26) - 4} w={1300} h={731} rot={1} zoom={[1, 1.1]} dur={60} credit={CR.nasa} />
    </Put>
    <Put x={1170} y={690}>
      <IndexCard w={560} h={190} rot={-2}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 40, color: V.ink, marginTop: -14}}>藏着巨型黑洞的星系</div>
        <div style={{fontFamily: VF.body, fontSize: 26, color: V.inkSoft, marginTop: 6}}>Blazar TXS 0506+056（动画示意）</div>
      </IndexCard>
    </Put>
  </>
);

/* ---------- B：人类看宇宙靠的都是光 → 光被尘埃挡住，中微子笔直穿过 ---------- */
const sLight: Shot['C'] = ({f}) => {
  const light = cf(28);
  const dust = cf(29);
  const nu = cf(30);
  return (
    <>
      <Put x={930} y={60}>
        <VoxFootage f={f} src={`${FT}lab-dawn.jpg`} start={cf(27)} w={880} h={560} rot={1.5} zoom={[1, 1.15]} dur={170} focus={[0.45, 0.4]} credit={CR.mirriat} />
      </Put>
      <Put x={950} y={680}>
        <Hand size={60} rot={-3} color={V.ink}>
          几百年来，人类看宇宙靠的都是光
        </Hand>
      </Put>
      <At f={f} at={light}>
        <Put x={70} y={70}>
          <IndexCard w={800} h={620} rot={-2}>
            <svg width={740} height={520} viewBox="0 0 740 520" style={{overflow: 'visible', marginTop: -24}}>
              <circle cx={40} cy={230} r={30} fill={V.hiSolid} stroke={V.ink} strokeWidth={4} />
              <text x={10} y={300} fontFamily="Songti SC" fontWeight={700} fontSize={26} fill={V.inkSoft}>
                遥远的星系
              </text>
              <circle cx={700} cy={230} r={24} fill={ICE} stroke={V.ink} strokeWidth={4} />
              <text x={660} y={300} fontFamily="Songti SC" fontWeight={700} fontSize={26} fill={V.inkSoft}>
                地球
              </text>
              {/* 光 */}
              <HandLine points={[[75, 180], [f >= dust ? 300 : 670, 180]]} p={p12(f, light, 10)} width={9} color="#D9A62A" dot={false} />
              <text x={80} y={150} fontFamily="Songti SC" fontWeight={700} fontSize={34} fill="#B8861A">
                光
              </text>
              {/* 尘埃云 */}
              {f >= dust &&
                Array.from({length: 12}, (_, i) => (
                  <circle key={i} cx={380 + Math.cos(i * 2.1) * 55} cy={230 + Math.sin(i * 1.7) * 70} r={30 + (i % 3) * 8} fill="#8a847c" opacity={0.3 * p12(f, dust, 6)} />
                ))}
              {f >= dust && (
                <text x={320} y={110} fontFamily="Songti SC" fontWeight={700} fontSize={30} fill={V.inkSoft}>
                  宇宙尘埃
                </text>
              )}
              {/* 中微子 */}
              <HandLine points={[[75, 280], [672, 280]]} p={p12(f, nu, 12)} width={10} color="#2E7FB8" />
              {f >= nu && (
                <text x={180} y={400} fontFamily="Songti SC" fontWeight={700} fontSize={36} fill="#2E7FB8">
                  中微子：笔直穿过去
                </text>
              )}
            </svg>
          </IndexCard>
        </Put>
      </At>
      <RedX f={f} at={dust + 8} x={385} y={262} s={34} />
      <At f={f} at={dust + 8}>
        <Put x={150} y={720}>
          <Hand size={56}>光：会被尘埃挡住</Hand>
        </Put>
      </At>
    </>
  );
};

/* ---------- A：结尾 ---------- */
const aEnding: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 150}}>
      <div style={{fontFamily: VF.heavy, fontSize: 80, color: f >= cf(35) ? 'rgba(238,237,237,0.45)' : V.paper, whiteSpace: 'nowrap'}}>
        这个诺奖奖励的，不只是一台仪器
      </div>
      <At f={f} at={cf(35)}>
        <div style={{marginTop: 70}}>
          <Head size={120}>而是人类看宇宙</Head>
        </div>
      </At>
      <At f={f} at={cf(36)}>
        <div style={{marginTop: 30}}>
          <Head size={150} color={V.hiSolid}>
            多了一双不靠光的眼睛
          </Head>
        </div>
        <Underline f={f} at={cf(36) + 8} x={0} y={540} w={1500} seed={8} />
      </At>
    </div>
    <At f={f} at={cf(36) + 16}>
      <svg width={300} height={194} viewBox="0 0 170 110" style={{position: 'absolute', left: 1480, top: 230}}>
        <path d="M5 55 Q85 -15 165 55 Q85 125 5 55 Z" fill="none" stroke={V.paper} strokeWidth={6} />
        <circle cx={85} cy={55} r={28} fill={ICE} />
        <circle cx={85} cy={55} r={12} fill={V.card} />
      </svg>
    </At>
  </BlackCard>
);

const SHOTS: Shot[] = [
  {from: 0, kind: 'B', C: sEarth},
  {from: cf(2), kind: 'A', C: aBillions},
  {from: cf(4), kind: 'B', C: sEarth},
  {from: cf(5), kind: 'A', C: aNobel},
  {from: cf(6), kind: 'B', C: sSouthPole},
  {from: cf(7) - 4, kind: 'B', C: sNeutrino},
  {from: cf(10), kind: 'A', C: aGhost},
  {from: cf(11), kind: 'A', C: aHow},
  {from: cf(12), kind: 'B', C: sHalzen},
  {from: cf(13), kind: 'B', C: sIce},
  {from: cf(14) - 2, kind: 'B', C: sFlash},
  {from: cf(16) - 2, kind: 'B', C: sStrings},
  {from: cf(18), kind: 'A', C: aCrazy},
  {from: cf(19) - 4, kind: 'B', C: sDrill},
  {from: cf(20) - 2, kind: 'B', C: sDom},
  {from: cw(20, '冰下') - 2, kind: 'B', C: sDepth},
  {from: cf(21), kind: 'A', C: aIceCube},
  {from: cf(23), kind: 'B', C: s2013},
  {from: cf(24) - 4, kind: 'B', C: s2017},
  {from: cf(26) - 4, kind: 'B', C: sBlackHole},
  {from: cf(27), kind: 'B', C: sLight},
  {from: cf(33), kind: 'A', C: aEnding},
];

export const Film: React.FC<{f: number}> = ({f}) => <ShotFilm f={f} shots={SHOTS} duration={DURATION} />;

/** 镜头切点（配乐的切点重击和测试用） */
export const CUTS = SHOTS.map((s) => s.from);

export const FILM_SFX: SfxCue[] = [
  ['whoosh', 2, 0.3],
  ['stamp', cf(2), 0.35],
  ['ding', cw(2, '650'), 0.35],
  ['paper', cf(4), 0.3],
  ['confetti', cf(5), 0.4],
  ['paper', cf(6), 0.3],
  ['paper', cf(7) - 4, 0.3],
  ['click', cf(8), 0.3],
  ['click', cw(8, '几乎'), 0.3],
  ['click', cf(9), 0.3],
  ['stamp', cf(10), 0.4],
  ['question', cf(11), 0.35],
  ['paper', cf(12), 0.3],
  ['stamp', cf(13), 0.35],
  ['stamp', cw(13, '透明'), 0.35],
  ['whoosh', cf(14) - 2, 0.3],
  ['magic', cw(15, '蓝光'), 0.45],
  ['paper', cf(16) - 2, 0.3],
  ['boing', cf(18), 0.3],
  ['stamp', cw(18, '他们'), 0.4],
  ['paper', cf(19) - 4, 0.3],
  ['ding', cw(19, '86'), 0.3],
  ['paper', cf(20) - 2, 0.3],
  ['ding', cw(20, '5160'), 0.3],
  ['paper', cw(20, '冰下') - 2, 0.3],
  ['stamp', cf(21), 0.35],
  ['magic', cf(22) + 12, 0.45],
  ['paper', cf(23), 0.3],
  ['paper', cf(24) - 4, 0.3],
  ['ding', cw(25, '40'), 0.4],
  ['whoosh', cf(26) - 4, 0.35],
  ['paper', cf(27), 0.3],
  ['error', cf(29) + 10, 0.3],
  ['whoosh', cf(30), 0.35],
  ['stamp', cf(33), 0.35],
  ['magic', cf(36) + 6, 0.4],
];
