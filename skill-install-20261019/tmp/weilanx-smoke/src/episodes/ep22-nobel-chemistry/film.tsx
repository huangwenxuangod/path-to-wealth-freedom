import React from 'react';
import type {SfxCue} from '../../library/types';
import {Put} from '../../library/vox/desk';
import {BlackCard, VoxFootage} from '../../library/vox/footage';
import {At, HandLine, IndexCard, Label, RedCircle, Underline} from '../../library/vox/props';
import {countUp, Hand, Head, Medal, p12, ShotFilm, type Shot} from '../../library/vox/shots';
import {PostIt, Stamp} from '../../library/vox/stickers';
import {V, VF} from '../../library/vox/theme';
import {cf, cw, DURATION} from './cues';

/**
 * 2026 诺贝尔化学奖：镜像分子。Vox 拼贴，A-roll 黑卡大字，B-roll 钉在桌面上的真实素材（FDA 藏品、历史照片、诺奖官方插图、结晶延时视频）。
 * 素材在 public/footage/ep22-nobel-chemistry/，来源与授权见 materials/04-Vox科普/04-诺贝尔化学奖/素材来源.md。
 */

const FT = 'footage/ep22-nobel-chemistry/';
const CR = {
  nobel: '插图：© Johan Jarnestad / 瑞典皇家科学院',
  hands: '图：公有领域（Wikimedia Commons）',
  alanine: '图：Synpath / CC BY-SA 4.0',
  fda: '照片：美国 FDA（公有领域）',
  kelsey: '照片：美国政府（公有领域）',
  thal: '图：Klaus Hoffmeier（公有领域）',
  kagan: '照片：École polytechnique / CC BY-SA 2.0',
  soai: '照片：Pegy22 / CC0',
  vitc: '视频：B. A. Segura Torres & P. Vieto Bonilla / CC BY-SA 4.0',
  crystal: '视频：Andrey73RUS / CC BY 4.0',
  press: '视频：Robin Müller / CC BY-SA 3.0',
};
const LEFT = '#2E7FB8';
const RIGHT = V.red;

/** 手画饼图：左右各占多少 */
const Pie: React.FC<{left: number; s?: number}> = ({left, s = 220}) => {
  const a = Math.PI * 2 * left;
  const x = 50 + 46 * Math.sin(a);
  const y = 50 - 46 * Math.cos(a);
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={46} fill={RIGHT} stroke={V.ink} strokeWidth={3} />
      {left >= 0.999 ? <circle cx={50} cy={50} r={46} fill={LEFT} stroke={V.ink} strokeWidth={3} /> : <path d={`M50 50 L50 4 A46 46 0 ${left > 0.5 ? 1 : 0} 1 ${x} ${y} Z`} fill={LEFT} stroke={V.ink} strokeWidth={3} />}
    </svg>
  );
};

/** 左右两只手（简笔），用来标「左手 / 右手」 */
const HandsMark: React.FC<{s?: number}> = ({s = 120}) => (
  <svg width={s * 2.2} height={s} viewBox="0 0 220 100">
    <path d="M20 90 L20 40 Q20 30 28 30 L28 15 Q28 8 35 8 Q42 8 42 15 L42 30 L50 30 L50 12 Q50 5 57 5 Q64 5 64 12 L64 34 L72 34 L72 20 Q72 13 79 13 Q86 13 86 20 L86 60 Q86 90 60 90 Z" fill={LEFT} stroke={V.ink} strokeWidth={3} />
    <path d="M200 90 L200 40 Q200 30 192 30 L192 15 Q192 8 185 8 Q178 8 178 15 L178 30 L170 30 L170 12 Q170 5 163 5 Q156 5 156 12 L156 34 L148 34 L148 20 Q148 13 141 13 Q134 13 134 20 L134 60 Q134 90 160 90 Z" fill={RIGHT} stroke={V.ink} strokeWidth={3} />
    <line x1={110} y1={0} x2={110} y2={100} stroke={V.ink} strokeWidth={3} strokeDasharray="6 6" />
  </svg>
);

/* ---------- B：左手和右手（开场） ---------- */
const sHands: Shot['C'] = ({f}) => (
  <>
    <Put x={330} y={70}>
      <VoxFootage f={f} src={`${FT}hands.png`} start={0} w={1100} h={747} rot={-1} zoom={[1, 1.1]} dur={80} credit={CR.hands} bg="#000" />
    </Put>
    <Put x={150} y={40}>
      <Label size={44} bg={V.red}>
        左手 · 右手
      </Label>
    </Put>
    <At f={f} at={cw(1, '一模一样')}>
      <Put x={1300} y={760}>
        <Hand size={66}>长得一模一样</Hand>
      </Put>
    </At>
  </>
);

/* ---------- A：左手塞不进右手的手套 → 对吧？ ---------- */
const aGlove: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 200}}>
      <Head size={120}>可左手</Head>
      <div style={{marginTop: 20}}>
        <Head size={120}>永远塞不进右手的手套</Head>
      </div>
    </div>
    <At f={f} at={cw(3, '对吧')}>
      <div style={{position: 'absolute', left: 150, top: 560}}>
        <Head size={200} color={V.hiSolid}>
          对吧？
        </Head>
      </div>
    </At>
    <div style={{position: 'absolute', left: 1350, top: 520}}>
      <HandsMark s={160} />
    </div>
  </BlackCard>
);

/* ---------- B：分子也分左右手（丙氨酸 3D 模型） ---------- */
const sMolecule: Shot['C'] = ({f}) => (
  <>
    <Put x={160} y={60}>
      <VoxFootage f={f} src={`${FT}alanine.png`} start={cf(4)} w={700} h={796} rot={-2} zoom={[1, 1.08]} dur={90} focus={[0.5, 0.75]} credit={CR.alanine} bg="#000" />
    </Put>
    <Put x={980} y={120}>
      <Label size={44}>分子也分左右手</Label>
    </Put>
    <At f={f} at={cf(5)}>
      <Put x={980} y={230}>
        <IndexCard w={720} h={420} rot={2}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 40, color: V.ink, lineHeight: 1.6, marginTop: -14}}>
            同样的原子，同样的连法
            <br />
            只是互为<span style={{color: V.red}}>镜像</span>
            <br />
            怎么转都重合不了
          </div>
          <div style={{marginTop: 20}}>
            <HandsMark s={90} />
          </div>
        </IndexCard>
      </Put>
    </At>
  </>
);

/* ---------- B：反应停（FDA 藏品药瓶 + 凯尔西） ---------- */
const sThalidomide: Shot['C'] = ({f}) => (
  <>
    <Put x={110} y={70}>
      <VoxFootage f={f} src={`${FT}kevadon.jpg`} start={cf(6)} w={900} h={675} rot={-1.5} zoom={[1, 1.12]} dur={160} focus={[0.48, 0.5]} credit={CR.fda} />
    </Put>
    <Put x={110} y={20}>
      <Label size={40} bg={V.red}>
        1960 · 反应停（沙利度胺）
      </Label>
    </Put>
    <At f={f} at={cf(7)}>
      <Put x={1120} y={90}>
        <IndexCard w={640} h={250} rot={2}>
          <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 38, color: V.ink, lineHeight: 1.55, marginTop: -14}}>
            一种镇静药
            <br />
            当年被用来缓解孕吐
          </div>
        </IndexCard>
      </Put>
    </At>
    <At f={f} at={cf(8)}>
      <Put x={1140} y={400}>
        <Stamp size={70} rot={-8}>
          出生缺陷
        </Stamp>
      </Put>
      <Put x={1120} y={540}>
        <Hand size={56} rot={-3}>
          成千上万的孩子
        </Hand>
      </Put>
    </At>
  </>
);

/* ---------- B：惹祸的是镜像分子 ---------- */
const sMirror: Shot['C'] = ({f}) => (
  <>
    <Put x={160} y={150}>
      <VoxFootage f={f} src={`${FT}thal-enant.png`} start={cf(9)} w={1500} h={475} rot={-1} zoom={[1, 1.04]} dur={90} credit={CR.thal} bg="#fff" />
    </Put>
    <Put x={180} y={50}>
      <Label size={40}>反应停分子的两种镜像</Label>
    </Put>
    <svg width={20} height={520} style={{position: 'absolute', left: 900, top: 120, overflow: 'visible'}}>
      <line x1={10} y1={0} x2={10} y2={520} stroke={V.ink} strokeWidth={5} strokeDasharray="14 10" />
    </svg>
    <At f={f} at={cf(10) + 4}>
      <RedCircle f={f} at={cf(10) + 4} cx={1290} cy={400} rx={430} ry={210} seed={4} width={8} />
      <Put x={1000} y={720}>
        <Hand size={70}>惹祸的，是它的镜像</Hand>
      </Put>
      <Put x={1010} y={820}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft}}>通常认为致畸的是 S 型；两种镜像在体内还会互相转化</div>
      </Put>
    </At>
    <Put x={200} y={720}>
      <PostIt w={560} rot={-3} size={30} head="诺奖委员会的说法">
        事后分析发现，致害的是有效成分的镜像分子
      </PostIt>
    </Put>
  </>
);

/* ---------- A：2026 诺贝尔化学奖 ---------- */
const aNobel: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 150}}>
      <div style={{fontFamily: VF.num, fontSize: 180, color: V.paper, lineHeight: 1}}>2026</div>
      <div style={{marginTop: 20}}>
        <Head size={140}>诺贝尔化学奖</Head>
      </div>
    </div>
    <At f={f} at={cf(12)}>
      <div style={{position: 'absolute', left: 150, top: 560}}>
        <Head size={110} color={V.hiSolid}>
          让化学反应只做一只手
        </Head>
      </div>
      <Underline f={f} at={cf(12) + 10} x={150} y={700} w={1150} seed={5} />
    </At>
    <div style={{position: 'absolute', left: 1320, top: 140}}>
      <VoxFootage f={f} src={`${FT}nobel-fig_ke_26_3x2-scaled.jpg`} start={cf(11)} w={460} h={307} rot={4} zoom={[1, 1.05]} dur={100} credit="© Johan Jarnestad" />
    </div>
    <div style={{position: 'absolute', left: 1560, top: 560, transform: 'rotate(10deg)'}}>
      <Medal s={200} />
    </div>
  </BlackCard>
);

/* ---------- B：氨基酸几乎全是左手 → 试管里一半一半 ---------- */
const sLife: Shot['C'] = ({f}) => {
  const half = cf(15);
  return (
    <>
      <Put x={140} y={40}>
        <VoxFootage f={f} src={`${FT}nobel-fig2_ke_en_26_copy-srgb.jpg`} start={cf(13)} w={620} h={820} rot={-1.5} zoom={[1.15, 1.45]} dur={190} focus={[0.5, 0.82]} credit={CR.nobel} bg="#fff" />
      </Put>
      <Put x={900} y={80}>
        <Label size={44} bg={LEFT}>
          生命：几乎只用左手
        </Label>
      </Put>
      <At f={f} at={cw(14, '左手')}>
        <Put x={920} y={170}>
          <Hand size={60} rot={-2} color={LEFT}>
            你身体里的氨基酸
          </Hand>
        </Put>
      </At>
      <At f={f} at={half}>
        <Put x={900} y={330}>
          <IndexCard w={820} h={430} rot={2}>
            <div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: -10}}>
              <Pie left={0.5} s={240} />
              <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 40, color: V.ink, lineHeight: 1.5}}>
                化学家在试管里做
                <br />
                <span style={{color: LEFT}}>左手</span> 一半，<span style={{color: RIGHT}}>右手</span> 一半
              </div>
            </div>
          </IndexCard>
        </Put>
      </At>
    </>
  );
};

/* ---------- A：生命是怎么只挑一只手的？ ---------- */
const aWhy: Shot['C'] = () => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 300}}>
      <Head size={150}>生命是怎么</Head>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
        <Head size={200} color={V.hiSolid}>
          只挑一只手
        </Head>
        <div style={{fontFamily: VF.num, fontSize: 240, color: V.red, lineHeight: 0.8}}>?</div>
      </div>
    </div>
  </BlackCard>
);

/* ---------- B：卡冈，1986 ---------- */
const sKagan: Shot['C'] = ({f}) => (
  <>
    <Put x={300} y={70}>
      <VoxFootage f={f} src={`${FT}kagan.jpg`} start={cf(18)} w={540} h={760} rot={-2} zoom={[1, 1.1]} dur={120} focus={[0.5, 0.3]} credit={CR.kagan} />
    </Put>
    <Put x={980} y={110}>
      <div style={{fontFamily: VF.num, fontSize: 160, color: V.red, lineHeight: 1}}>1986</div>
    </Put>
    <Put x={980} y={290}>
      <Head size={100} color={V.ink}>
        亨利·卡冈
      </Head>
    </Put>
    <Put x={980} y={430}>
      <IndexCard w={660} h={250} rot={1}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 36, color: V.ink, lineHeight: 1.6, marginTop: -14}}>
          法国化学家 · 今年 95 岁
          <br />
          巴黎南大学荣休教授
          <br />
          <span style={{color: V.red}}>发现了一个怪现象</span>
        </div>
      </IndexCard>
    </Put>
  </>
);

/* ---------- B：非线性效应（诺奖插图）：左右手掺在一起，产物反而更纯 ---------- */
const sNonlinear: Shot['C'] = ({f}) => (
  <>
    <Put x={110} y={60}>
      <VoxFootage f={f} src={`${FT}nobel-fig4_ke_en_26_copy-srgb.jpg`} start={cf(20) - 2} w={1100} h={715} rot={-1} zoom={[1, 1.1]} dur={110} focus={[0.5, 0.5]} credit={CR.nobel} bg="#fff" />
    </Put>
    <Put x={1290} y={90}>
      <Label size={40}>非线性效应</Label>
    </Put>
    <Put x={1290} y={180}>
      <IndexCard w={500} h={300} rot={2}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: -10}}>
          <div style={{textAlign: 'center'}}>
            <Pie left={0.75} s={150} />
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 26}}>催化剂</div>
          </div>
          <svg width={70} height={40} style={{overflow: 'visible'}}>
            <HandLine points={[[4, 20], [64, 20]]} p={p12(f, cf(21), 8)} width={6} />
          </svg>
          {f >= cf(21) && (
            <div style={{textAlign: 'center'}}>
              <Pie left={0.95} s={150} />
              <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 26, color: V.red}}>产物更纯</div>
            </div>
          )}
        </div>
      </IndexCard>
    </Put>
    <At f={f} at={cf(21) + 6}>
      <Put x={1240} y={560}>
        <Hand size={50}>左右手掺着用，反而更纯</Hand>
      </Put>
      <Put x={1300} y={660}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft}}>饼图为示意</div>
      </Put>
    </At>
  </>
);

/* ---------- B：硖合宪三，会自己复制自己的分子 ---------- */
const sSoai: Shot['C'] = ({f}) => (
  <>
    <Put x={300} y={70}>
      <VoxFootage f={f} src={`${FT}soai.jpg`} start={cf(22)} w={560} h={740} rot={2} zoom={[1, 1.1]} dur={110} focus={[0.5, 0.3]} credit={CR.soai} />
    </Put>
    <Put x={980} y={130}>
      <Head size={100} color={V.ink}>
        硖合宪三
      </Head>
    </Put>
    <Put x={980} y={270}>
      <IndexCard w={660} h={220} rot={-1}>
        <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 36, color: V.ink, lineHeight: 1.6, marginTop: -14}}>
          日本化学家 · 1950 年生于广岛
          <br />
          东京理科大学荣休教授
        </div>
      </IndexCard>
    </Put>
    <At f={f} at={cw(23, '复制')}>
      <Put x={990} y={560}>
        <PostIt w={600} rot={3} size={38} head="他找到的分子">
          会自己复制自己
        </PostIt>
      </Put>
    </At>
  </>
);

/* ---------- B：Soai 反应（诺奖插图）：一点点优势被不断放大 ---------- */
const sSoaiReaction: Shot['C'] = ({f}) => (
  <>
    <Put x={110} y={70}>
      <VoxFootage f={f} src={`${FT}nobel-fig6_ke_en_26_copy-srgb.jpg`} start={cf(24) - 2} w={1180} h={780} rot={-1} zoom={[1.05, 1.6]} dur={80} focus={[0.62, 0.72]} credit={CR.nobel} bg="#fff" />
    </Put>
    <Put x={1370} y={100}>
      <Label size={44} bg={V.red}>
        2003 · Soai 反应
      </Label>
    </Put>
    <Put x={1370} y={200}>
      <Hand size={56} rot={-3}>
        碰巧多出一点点
      </Hand>
    </Put>
    <svg width={80} height={200} style={{position: 'absolute', left: 1500, top: 300, overflow: 'visible'}}>
      <HandLine points={[[40, 0], [40, 170]]} p={p12(f, cf(24) + 20, 12)} width={8} />
    </svg>
    <At f={f} at={cf(24) + 36}>
      <Put x={1370} y={500}>
        <Hand size={56} rot={-3}>
          越滚越多
        </Hand>
      </Put>
    </At>
  </>
);

/* ---------- A：99.99% ---------- */
const aWin: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 170}}>
      <Head size={90}>最后占了产物的</Head>
    </div>
    <div style={{position: 'absolute', left: 140, top: 300, fontFamily: VF.num, fontSize: 380, lineHeight: 1, color: V.hiSolid}}>
      {(countUp(f, cf(25) + 4, 9999, 16) / 100).toFixed(2)}%
    </div>
    <div style={{position: 'absolute', left: 1500, top: 380}}>
      <Pie left={Math.min(0.9999, 0.5 + 0.4999 * p12(f, cf(25) + 4, 16))} s={260} />
    </div>
  </BlackCard>
);

/* ---------- B：重做一遍，赢家可能换边 ---------- */
const sFlip: Shot['C'] = ({f}) => (
  <>
    <Put x={110} y={80}>
      <VoxFootage f={f} src={`${FT}crystal.mp4`} kind="video" start={cf(26)} w={860} h={645} rot={-1.5} zoom={[1, 1.1]} dur={100} credit={CR.crystal} />
    </Put>
    <Put x={110} y={20}>
      <Label size={36}>晶体生长（示意）</Label>
    </Put>
    <Put x={1060} y={90}>
      <IndexCard w={720} h={520} rot={2}>
        <div style={{fontFamily: VF.heavy, fontSize: 40, color: V.ink, marginTop: -16}}>重做一遍</div>
        <div style={{display: 'flex', gap: 60, marginTop: 30, alignItems: 'center'}}>
          <div style={{textAlign: 'center'}}>
            <Pie left={0.9999} s={180} />
            <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: LEFT}}>第一次：左手赢</div>
          </div>
          {f >= cf(27) && (
            <div style={{textAlign: 'center'}}>
              <Pie left={0.0001} s={180} />
              <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 30, color: RIGHT}}>再来一次：右手赢</div>
            </div>
          )}
        </div>
      </IndexCard>
    </Put>
    <At f={f} at={cf(27) + 8}>
      <Put x={1100} y={680}>
        <Hand size={60}>赢家全看开头的运气</Hand>
      </Put>
    </At>
  </>
);

/* ---------- B：生命会不会也是一场偶然？（维生素 C 结晶延时） ---------- */
const sChance: Shot['C'] = ({f}) => (
  <>
    <Put x={600} y={40}>
      <VoxFootage f={f} src={`${FT}vitc.mp4`} kind="video" start={cf(28)} w={720} h={720} rot={1.5} zoom={[1, 1.12]} dur={170} credit={CR.vitc} />
    </Put>
    <Put x={600} y={810}>
      <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 24, color: V.inkSoft}}>维生素 C 结晶的延时摄影（示意）</div>
    </Put>
    <At f={f} at={cf(29)}>
      <Put x={90} y={160}>
        <Hand size={64} rot={-4} color={V.ink}>
          很久很久以前
        </Hand>
      </Put>
    </At>
    <At f={f} at={cf(30)}>
      <Put x={1340} y={320}>
        <Hand size={60} rot={4}>
          一个小小的偶然？
        </Hand>
      </Put>
    </At>
  </>
);

/* ---------- A：结尾 1：不只是更安全的药 ---------- */
const aEnd1: Shot['C'] = () => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 330}}>
      <Head size={100}>这个诺奖奖励的</Head>
    </div>
  </BlackCard>
);

/* ---------- B：更安全的药（压片机） ---------- */
const sPills: Shot['C'] = ({f}) => (
  <>
    <Put x={520} y={60}>
      <VoxFootage f={f} src={`${FT}press.mp4`} kind="video" start={cf(33)} w={760} h={760} rot={-1.5} zoom={[1, 1.06]} dur={40} credit={CR.press} />
    </Put>
    <Put x={1330} y={360}>
      <Hand size={58}>不只是更安全的药</Hand>
    </Put>
  </>
);

/* ---------- A：结尾 2：亲眼看着一只手赢下了全部 ---------- */
const aEnd2: Shot['C'] = ({f}) => (
  <BlackCard>
    <div style={{position: 'absolute', left: 150, top: 200}}>
      <div style={{fontFamily: VF.heavy, fontSize: 80, color: 'rgba(238,237,237,0.5)', whiteSpace: 'nowrap'}}>不只是更安全的药</div>
      <div style={{marginTop: 60}}>
        <Head size={110}>而是人类第一次在试管里</Head>
      </div>
      <At f={f} at={cf(35)}>
        <div style={{marginTop: 30}}>
          <Head size={128} color={V.hiSolid}>
            亲眼看着一只手赢下了全部
          </Head>
        </div>
        <Underline f={f} at={cf(35) + 8} x={0} y={500} w={1540} seed={8} />
      </At>
    </div>
  </BlackCard>
);

const SHOTS: Shot[] = [
  {from: 0, kind: 'B', C: sHands},
  {from: cf(2), kind: 'A', C: aGlove},
  {from: cf(4), kind: 'B', C: sMolecule},
  {from: cf(6), kind: 'B', C: sThalidomide},
  {from: cf(9), kind: 'B', C: sMirror},
  {from: cf(11), kind: 'A', C: aNobel},
  {from: cf(13), kind: 'B', C: sLife},
  {from: cf(17), kind: 'A', C: aWhy},
  {from: cf(18), kind: 'B', C: sKagan},
  {from: cf(20) - 2, kind: 'B', C: sNonlinear},
  {from: cf(22), kind: 'B', C: sSoai},
  {from: cf(24) - 2, kind: 'B', C: sSoaiReaction},
  {from: cf(25), kind: 'A', C: aWin},
  {from: cf(26), kind: 'B', C: sFlip},
  {from: cf(28), kind: 'B', C: sChance},
  {from: cf(32), kind: 'A', C: aEnd1},
  {from: cf(33), kind: 'B', C: sPills},
  {from: cf(34), kind: 'A', C: aEnd2},
];

export const Film: React.FC<{f: number}> = ({f}) => <ShotFilm f={f} shots={SHOTS} duration={DURATION} />;

export const FILM_SFX: SfxCue[] = [
  ['paper', 2, 0.3],
  ['stamp', cf(2), 0.35],
  ['pop', cw(3, '对吧'), 0.3],
  ['paper', cf(4), 0.3],
  ['paper', cf(6), 0.3],
  ['stamp', cf(8), 0.4],
  ['paper', cf(9), 0.3],
  ['error', cf(10) + 4, 0.3],
  ['confetti', cf(11), 0.4],
  ['paper', cf(13), 0.3],
  ['click', cf(15), 0.3],
  ['question', cf(17), 0.35],
  ['paper', cf(18), 0.3],
  ['paper', cf(20) - 2, 0.3],
  ['magic', cf(21), 0.35],
  ['paper', cf(22), 0.3],
  ['pop', cw(23, '复制'), 0.3],
  ['paper', cf(24) - 2, 0.3],
  ['stamp', cf(25), 0.35],
  ['ding', cf(25) + 20, 0.4],
  ['paper', cf(26), 0.3],
  ['boing', cf(27), 0.3],
  ['paper', cf(28), 0.3],
  ['question', cf(30), 0.3],
  ['stamp', cf(32), 0.3],
  ['paper', cf(33), 0.3],
  ['stamp', cf(34), 0.3],
  ['magic', cf(35) + 6, 0.4],
];
