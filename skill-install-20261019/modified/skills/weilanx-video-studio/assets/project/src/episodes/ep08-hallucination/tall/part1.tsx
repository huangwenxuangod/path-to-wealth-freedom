import React from 'react';
import {easeInOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, FocusLines} from '../../../library/fx';
import {Cross, Stamp, stampScale} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {BookStack, Dice, Magnifier} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

const Bubble: React.FC<{text: string; me?: boolean}> = ({text, me}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(38), background: me ? C.pink : C.white, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px'}}>{text}</div>
  </div>
);

/* ---------- V1 钩子：律师用 AI 找判例，判例全是编的 ---------- */
const CASES = ['王某 诉 远航航空 案（2019）', '李某 诉 星海物流 案（2016）', '陈某 诉 东方快运 案（2008）'];

export const V1Lawyer: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(2);
  const docAt = cf(3);
  const checkAt = cf(5);
  const fakeAt = cw(6, '根本');
  const fineAt = cw(7, '罚');
  const whyAt = cf(9);
  const scan = prog(f, checkAt, 30, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20}>
        <Note color={C.panel} size={44}>美国，一位律师</Note>
      </Pop>
      <Pop f={f} at={askAt} x={60} y={110} enter="up">
        <Win w={960} h={240} title="ChatGPT">
          <div style={{padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 16}}>
            <Bubble me text="帮我找几个相关的判例" />
            {f >= askAt + 18 && <Bubble text="好的！以下是三个相关判例……" />}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={docAt} x={60} y={380} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, fineAt, 14, 16)}px)`}}>
          <Card w={960} h={380} bg="#FFFDF7">
            <div style={{...txt(48), textAlign: 'center'}}>法庭文件</div>
            <div style={{borderTop: `3px solid ${C.line}`, margin: '10px 0 14px'}} />
            {CASES.map((c, i) => (
              <div key={c} style={{display: 'flex', alignItems: 'center', gap: 14, height: 76, opacity: prog(f, docAt + 8 + i * 6, 6)}}>
                <div style={txt(32, C.inkSoft)}>引用 {i + 1}</div>
                <div style={{...txt(40), position: 'relative'}}>
                  {c}
                  {f >= fakeAt + i * 5 && <div style={{position: 'absolute', left: -6, top: '52%', height: 6, width: `${prog(f, fakeAt + i * 5, 8) * 106}%`, background: C.red, borderRadius: 3}} />}
                </div>
              </div>
            ))}
            <div style={{...txt(24, C.inkSoft), marginTop: 6}}>示意，判例名为虚构</div>
          </Card>
          {CASES.map((_, i) => (f >= fakeAt + i * 5 ? (
            <div key={i} style={{position: 'absolute', right: 20, top: 104 + i * 76, transform: `scale(${stampScale(f, fakeAt + i * 5)}) rotate(-8deg)`}}>
              <Stamp text="查无此案" size={36} />
            </div>
          ) : null))}
        </div>
      </Pop>
      {f >= checkAt && f < fakeAt + 10 && (
        <div style={{position: 'absolute', left: lerp(120, 760, scan), top: lerp(460, 640, scan)}}>
          <Magnifier size={180} />
        </div>
      )}
      <Pop f={f} at={checkAt} x={620} y={30} rot={3}>
        <Note color={C.tealLight} size={40}>法官一查……</Note>
      </Pop>
      <FocusLines f={f} at={fineAt} out={fineAt + 30} x={540} y={860} />
      <Pop f={f} at={fineAt} x={80} y={790} rot={-5}>
        <div style={bigText(120, C.red)}>律师被罚款！</div>
      </Pop>
      <Pop f={f} at={whyAt} x={60} y={950} rot={2}>
        <div style={bigText(64, C.yellow)}>它为什么这么自信？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= fakeAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const V1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['type', cf(2), 0.35],
  ['paper', cf(3), 0.35],
  ['whoosh', cf(5), 0.3],
  ...CASES.map((_, i) => ['stamp', cw(6, '根本') + i * 5, 0.4] as SfxCue),
  ['error', cw(7, '罚'), 0.5],
  ['shake', cw(7, '罚') + 2, 0.3],
  ['boing', cf(9), 0.3],
];

/* ---------- V2 这叫 AI 幻觉 ---------- */
export const V2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(11, '幻觉');
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(10)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这背后有一个专门的说法</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={170} />
      <Pop f={f} at={nameAt} x={40} y={70} rot={-3}>
        <div style={bigText(180, C.yellow)}>AI 幻觉</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={400} y={160} r={300} n={16} />
      <Pop f={f} at={cf(12)} x={0} y={270} enter="left">
        <Note color={C.pink} size={44}>一本正经地编</Note>
      </Pop>
      <Pop f={f} at={cf(13)} x={320} y={270} enter="left">
        <div style={bigText(56, C.white)}>
          看起来对 <span style={{color: C.red}}>≠</span> 真的对
        </div>
      </Pop>
    </HostTall>
  );
};
export const V2Sfx: SfxCue[] = [
  ['pop', cf(10), 0.3],
  ['magic', cw(11, '幻觉'), 0.5],
  ['pop', cf(12), 0.3],
  ['ding', cf(13), 0.3],
];

/* ---------- V3 它在猜，不在查 ---------- */
const TEMPLATES = [
  {k: '判例名', v: '某某 诉 某某 案（年份）', n: 21, w: '判例'},
  {k: '书名', v: '《××××》· 作者 · 出版社', n: 21, w: '书名'},
  {k: '网址', v: 'https://www.××××.com/……', n: 22, w: '网址'},
];

export const V3Guess: React.FC<{f: number}> = ({f}) => {
  const lookAt = cw(18, '资料库');
  const guessAt = cw(19, '猜');
  const fillAt = cw(24, '凑出');
  const sureAt = cw(25, '笃定');
  return (
    <>
      <Pop f={f} at={cf(16)} x={60} y={20}>
        <div style={bigText(68, C.white)}>
          它不是在<span style={{color: C.inkSoft}}>查</span>，是在<span style={{color: C.yellow}}>猜</span>
        </div>
      </Pop>
      <Pop f={f} at={lookAt} x={60} y={130}>
        <div style={{position: 'relative'}}>
          <Card w={460} h={250} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            <BookStack n={3} w={200} />
            <div style={txt(42)}>去资料库里查</div>
          </Card>
          {f >= guessAt && <div style={{position: 'absolute', left: 150, top: 50}}><Cross size={150} p={prog(f, guessAt, 8)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={guessAt} x={560} y={130}>
        <Card w={460} h={250} pad={0} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          <Dice size={120} rot={Math.sin(f * 0.4) * 14} />
          <div style={txt(42)}>猜下一个词</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(20)} x={60} y={420}>
        <Note color={C.tealLight} size={40}>它很清楚这些东西长什么样</Note>
      </Pop>
      {TEMPLATES.map((t, i) => (
        <Pop key={t.k} f={f} at={cw(t.n, t.w)} x={60} y={510 + i * 92} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{...txt(38), width: 130}}>{t.k}</div>
            <Card w={800} h={76} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', padding: '0 20px'}}>
              <div style={txt(34, C.inkSoft)}>{t.v}</div>
            </Card>
          </div>
        </Pop>
      ))}
      <Pop f={f} at={cf(23)} x={60} y={800} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={740} h={140} bg={C.white}>
            <div style={txt(30, C.inkSoft)}>不知道答案，也能凑一个</div>
            <div style={{...txt(44), marginTop: 8}}>
              <Marker p={prog(f, fillAt, 12)} color={C.pink}>赵某 诉 蓝天航空 案（2017）</Marker>
            </div>
          </Card>
          {f >= fillAt + 12 && <div style={{position: 'absolute', right: 20, top: 30, transform: `scale(${stampScale(f, fillAt + 12)}) rotate(-8deg)`}}><Stamp text="编的" size={56} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={sureAt} x={60} y={960} rot={-3}>
        <div style={bigText(76, C.yellow)}>语气还特别笃定</div>
      </Pop>
      <PiP f={f} at={cf(15) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const V3Sfx: SfxCue[] = [
  ['pop', cf(16), 0.3],
  ['pop', cw(18, '资料库'), 0.3],
  ['error', cw(19, '猜'), 0.35],
  ['shake', cw(19, '猜') + 4, 0.25],
  ['pop', cf(20), 0.3],
  ...TEMPLATES.map((t) => ['click', cw(t.n, t.w), 0.25] as SfxCue),
  ['type', cf(23), 0.3],
  ['stamp', cw(24, '凑出') + 12, 0.5],
  ['magic', cw(25, '笃定'), 0.4],
];

/* ---------- V4 它不太会说不知道；哪些地方最容易幻觉 ---------- */
const RISK = [
  {t: '冷门知识', n: 31, w: '冷门'},
  {t: '具体数字', n: 32, w: '数字'},
  {t: '人名', n: 32, w: '人名'},
  {t: '书名', n: 32, w: '书名'},
  {t: '链接', n: 32, w: '链接'},
];

export const V4Guessing: React.FC<{f: number}> = ({f}) => {
  const boardAt = cf(28);
  const zoneAt = cw(33, '幻觉');
  return (
    <>
      <Pop f={f} at={cf(26)} x={60} y={20}>
        <div style={bigText(68, C.white)}>
          它不太习惯说<span style={{color: C.yellow}}>不知道</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(27)} x={60} y={120} rot={-1}>
        <Note color={C.yellow} size={38}>有研究认为，很多评测是这样打分的</Note>
      </Pop>
      <Pop f={f} at={boardAt} x={60} y={210} enter="up">
        <Card w={960} h={280} bg={C.white}>
          <div style={{display: 'flex', gap: 24}}>
            {[
              {t: '猜一个答案', s: '猜中了就得分', bg: C.tealLight, at: boardAt + 6},
              {t: '说“我不确定”', s: '一定是 0 分', bg: '#E6E1D6', at: cf(29)},
            ].map((o) => (
              <div key={o.t} style={{flex: 1, opacity: prog(f, o.at, 8), background: o.bg, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '18px 22px', height: 190, boxSizing: 'border-box'}}>
                <div style={txt(46)}>{o.t}</div>
                <div style={{...txt(36, C.inkSoft), marginTop: 20}}>{o.s}</div>
              </div>
            ))}
          </div>
          <div style={{...txt(24, C.inkSoft), marginTop: 12}}>示意</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(30)} x={560} y={500} rot={-4}>
        <div style={bigText(80, C.red)}>所以它爱编！</div>
      </Pop>
      <Pop f={f} at={cf(31)} x={60} y={620}>
        <Note color={C.pink} size={40}>最容易出幻觉的地方</Note>
      </Pop>
      {RISK.map((r, i) => (
        <Pop key={r.t} f={f} at={cw(r.n, r.w)} x={60 + (i % 2) * 300} y={710 + Math.floor(i / 2) * 110}>
          <div style={{...txt(44), background: '#FFD9D6', border: `4px solid ${C.red}`, borderRadius: 16, padding: '8px 22px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>! {r.t}</div>
        </Pop>
      ))}
      <FocusLines f={f} at={zoneAt} out={zoneAt + 24} x={780} y={760} />
      <Pop f={f} at={zoneAt} x={660} y={700} rot={5}>
        <div style={{...bigText(90, C.red), transform: `translateX(${jolt(f, zoneAt, 10, 14)}px)`}}>高危区</div>
      </Pop>
      <PiP f={f} at={cf(26) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const V4Sfx: SfxCue[] = [
  ['pop', cf(26), 0.35],
  ['pop', cf(27), 0.3],
  ['paper', cf(28), 0.3],
  ['click', cf(29), 0.3],
  ['boing', cf(30), 0.35],
  ['pop', cf(31), 0.3],
  ...RISK.map((r) => ['click', cw(r.n, r.w), 0.25] as SfxCue),
  ['error', cw(33, '幻觉'), 0.45],
];

