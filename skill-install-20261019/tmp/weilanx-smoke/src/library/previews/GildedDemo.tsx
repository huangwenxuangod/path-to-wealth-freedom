import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from '../anim';
import {BellBars, DotField, GaltonBoard, GoldTree, GoldWheel, RatioChart} from '../gilded/charts';
import {Contender, Die3D, DieFace, dieTumble, GoldCoin, Parchment, ProbCard, RedStamp, ScoreBar} from '../gilded/props';
import {BookCite, Dust, GCaption, GildedBg, GQuote, Grain, Soft, TitleCard, YearHeader} from '../gilded/stage';
import {drift, G, GF} from '../gilded/theme';

/**
 * 暗金文献风素材一览（1920×1080，45 秒）：每 150 帧一场，场与场之间带模糊交叉淡化。
 * 内容只是示例文案，用来检查每个组件的样子和动效。
 */
const LEN = 150;
export const GILDED_DEMO_FRAMES = LEN * 9;

const Scene: React.FC<{f: number; i: number; children: (t: number) => React.ReactNode}> = ({f, i, children}) => {
  const at = i * LEN;
  const t = f - at;
  if (t < -12 || t > LEN + 12) return null;
  const v = clamp01((t + 12) / 24) * (1 - clamp01((t - LEN + 12) / 24));
  return <AbsoluteFill style={{opacity: v, filter: `blur(${(1 - v) * 8}px)`, transform: `scale(${drift(f, at, LEN, 0.025)})`}}>{children(t)}</AbsoluteFill>;
};

export const GildedDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: G.bg, fontFamily: GF.cn}}>
      <GildedBg f={f} tone={f >= LEN * 6 && f < LEN * 7 ? 'cool' : 'warm'} />
      <Dust f={f} />

      {/* 1 标题卡 */}
      <Scene f={f} i={0}>{(t) => <TitleCard f={t} at={0} latin="De Moneta" title="一枚硬币" sub="偶然里的秩序" curve />}</Scene>

      {/* 2 年份抬头 + 文献 + 硬币与对决数字 */}
      <Scene f={f} i={1}>
        {(t) => (
          <>
            <YearHeader f={t} at={0} year="1777" caption="巴黎 · 示例人物" />
            <BookCite f={t} at={0} original="Liber Exempli de Casu" title="示例文献" meta="作者 · 1777 · 仅作版式演示" />
            <Soft f={t} at={14} style={{left: 560, top: 300}}>
              <Contender badge="正" value={String(Math.round(2048 * clamp01((t - 14) / 60)))} />
            </Soft>
            <Soft f={t} at={20} style={{left: 1180, top: 300}}>
              <Contender badge="反" value={String(Math.round(1992 * clamp01((t - 20) / 60)))} color="red" />
            </Soft>
            <Soft f={t} at={14} style={{left: 470, top: 500}}>
              <ScoreBar value={6 * clamp01((t - 14) / 60)} total={6} />
            </Soft>
            <Soft f={t} at={20} style={{left: 1090, top: 500}}>
              <ScoreBar value={5.8 * clamp01((t - 20) / 60)} total={6} color="red" />
            </Soft>
            <Soft f={t} at={30} style={{left: 850, top: 560}}>
              <GoldCoin size={130} cut={clamp01((t - 80) / 20) * 0.49} split={clamp01((t - 90) / 16)} label="51%" cutLabel="49%" />
            </Soft>
            <div style={{position: 'absolute', left: 870, top: 300}}>
              <RedStamp f={t} at={70} text="记录" />
            </div>
            <GCaption f={t} at={24} text="抛了几千次，正反面几乎【对半开】。" />
          </>
        )}
      </Scene>

      {/* 3 年份老虎机翻动 + 收敛曲线 */}
      <Scene f={f} i={2}>
        {(t) => {
          const n = Math.pow(10, 0.2 + 4.2 * clamp01((t - 10) / 110));
          return (
            <>
              <YearHeader f={t} at={-30} prev="1777" rollAt={4} year="1900" caption="伦敦 · 示例人物" />
              <Soft f={t} at={8} style={{left: 360, top: 280}}>
                <RatioChart w={1200} h={480} n={n} truth={0.5} maxN={24000} yLabel="正面所占比例" truthLabel="真实比例 1/2" />
              </Soft>
              <Soft f={t} at={8} style={{right: 140, top: 200, fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim}}>
                第 <span style={{fontFamily: GF.num, fontSize: 44, color: G.goldBright}}>{Math.floor(n).toLocaleString('en-US')}</span> 次
              </Soft>
              <GCaption f={t} at={30} text="次数越多，比例越贴近【真相】。" />
            </>
          );
        }}
      </Scene>

      {/* 4 高尔顿板 */}
      <Scene f={f} i={3}>
        {(t) => (
          <>
            <Soft f={t} at={0} style={{left: 680, top: 110}}>
              <GaltonBoard t={t - 6} rows={12} w={560} h={720} rate={4} total={480} curve={clamp01((t - 115) / 30)} />
            </Soft>
            <GCaption f={t} at={20} text="每一颗都随机，堆起来却是【同一个形状】。" />
          </>
        )}
      </Scene>

      {/* 5 二项分布 → 钟形曲线 */}
      <Scene f={f} i={4}>
        {(t) => {
          const n = t < 70 ? 8 : 128;
          return (
            <>
              <Soft f={t} at={0} style={{left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim}}>
                同时抛 <span style={{fontFamily: GF.num, fontSize: 40, color: G.goldBright}}>{n}</span> 枚硬币 · 正面朝上的次数
              </Soft>
              <Soft f={t} at={0} style={{left: 460, top: 330}}>
                <BellBars w={1000} h={440} n={n} p={t < 70 ? clamp01(t / 40) : clamp01((t - 70) / 30)} curve={clamp01((t - 100) / 30)} />
              </Soft>
              <GCaption f={t} at={20} text="柱子越细，一条【钟形曲线】浮出来。" />
            </>
          );
        }}
      </Scene>

      {/* 6 二叉树 + 高亮路径 */}
      <Scene f={f} i={5}>
        {(t) => (
          <>
            <Soft f={t} at={0} style={{left: 160, top: 300, width: 420}}>
              <div style={{fontFamily: GF.cn, fontSize: 22, color: G.ivoryFaint}}>示例 · 还差四局</div>
              <div style={{fontFamily: GF.num, fontSize: 64, color: G.ivory, marginTop: 10}}>
                甲 <span style={{color: G.gold}}>3</span> : <span style={{color: G.red}}>1</span> 乙
              </div>
            </Soft>
            <Soft f={t} at={6} style={{left: 640, top: 200}}>
              <GoldTree w={1000} h={620} depth={4} p={clamp01(t / 70)} highlight={[1, 1, 1, 1]} hp={clamp01((t - 80) / 40)} leafLabel={(i) => (i === 15 ? '乙' : '甲')} leafColor={(i) => (i === 15 ? G.red : G.gold)} />
            </Soft>
            <GCaption f={t} at={30} text="十六种未来，乙只赢【一种】。" />
          </>
        )}
      </Scene>

      {/* 7 冷调引文 */}
      <Scene f={f} i={6}>
        {(t) => <GQuote f={t} at={0} original="Exemplum: casus non est sine ordine." text={'偶然并不等于没有规律，\n只是规律藏在【足够多】的次数里。'} source="示例引文 · 仅作版式演示" y={360} />}
      </Scene>

      {/* 8 立体骰子 + 平面骰子 + 命运之轮 */}
      <Scene f={f} i={7}>
        {(t) => {
          const d = dieTumble(t, 0, 45);
          return (
            <>
              <Soft f={t} at={0} style={{left: 560, top: 120, opacity: 0.6}}>
                <GoldWheel size={800} spin={t * 0.15} ring={['FORTUNA', 'CASUS', 'ORDO', 'NUMERUS']} p={clamp01(t / 60)} />
              </Soft>
              <div style={{position: 'absolute', left: 870, top: 420 - d.bounce}}>
                <Die3D size={180} rx={d.rx} ry={d.ry} rz={d.rz} glow={0.4} />
              </div>
              {[1, 2, 3, 4, 5, 6].map((n, i) => (
                <Soft key={n} f={t} at={60 + i * 5} style={{left: 600 + i * 120, top: 760}}>
                  <DieFace n={n} size={84} label={t > 110 ? '1/6' : undefined} glow={t > 110 ? 0.5 : 0} />
                </Soft>
              ))}
              <GCaption f={t} at={40} text="下一次掷出几点，依然【没人知道】。" />
            </>
          );
        }}
      </Scene>

      {/* 9 羊皮纸文书 + 点阵 + 对比卡 */}
      <Scene f={f} i={8}>
        {(t) => (
          <>
            <Soft f={t} at={0} style={{left: 120, top: 230}}>
              <Parchment title="LEDGER" sub="an example table of records" rows={[['Heads', '2048'], ['Tails', '1992'], ['Edge', '0'], ['Lost', '3']]} foot={['Total', '4043']} w={420} />
            </Soft>
            <Soft f={t} at={10} style={{left: 640, top: 240}}>
              <DotField cols={32} rows={30} gap={16} r={2.6} p={clamp01(t / 80)} color={(i) => (i % 2 ? G.gold : G.ivory)} />
            </Soft>
            <Soft f={t} at={30} style={{left: 1240, top: 240}}>
              <ProbCard title="示例 A" desc={'一枚硬币抛 4 次\n至少一次正面'} value={0.9375 * clamp01((t - 40) / 40)} badge={<RedStamp f={t} at={90} text="稳" size={46} rot={0} />} w={560}>
                <div style={{display: 'flex', gap: 12}}>
                  {[1, 2, 3, 4].map((k) => (
                    <DieFace key={k} n={k + 1} size={52} />
                  ))}
                </div>
              </ProbCard>
            </Soft>
            <GCaption f={t} at={30} text="一个人说不准，【一整座城】却稳定得惊人。" />
          </>
        )}
      </Scene>

      <Grain />
    </AbsoluteFill>
  );
};
