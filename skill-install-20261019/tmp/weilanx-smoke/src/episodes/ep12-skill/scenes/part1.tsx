import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {FONT_CODE} from '../../../library/fonts';
import {Burst, FocusLines} from '../../../library/fx';
import {Check, PlainFile, PlugIcon, Stamp, stampScale} from '../../../library/icons';
import {Win} from '../../../library/items/apps';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

export const Bubble: React.FC<{text: string; me?: boolean; color?: string; size?: number}> = ({text, me, color, size = 38}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(size), background: color ?? (me ? C.pink : C.white), border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px', whiteSpace: 'normal', lineHeight: 1.35}}>{text}</div>
  </div>
);

/** 一本手册（技能说明书）：封面色块 + 书名 */
export const ManualBook: React.FC<{title: string; w?: number; h?: number; color?: string; size?: number}> = ({title, w = 150, h = 200, color = C.teal, size = 30}) => (
  <div style={{width: w, height: h, boxSizing: 'border-box', background: color, border: `4px solid ${C.ink}`, borderRadius: '6px 14px 14px 6px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px 0 22px'}}>
    <div style={{position: 'absolute', left: 8, top: 0, bottom: 0, width: 5, background: 'rgba(43,35,32,0.25)'}} />
    <div style={{...txt(size, C.ink), background: C.white, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '2px 8px', textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.2}}>{title}</div>
  </div>
);

/* ---------- K1 钩子：我只说了一句“做一期 Skill”，它把整期视频做完了 ---------- */
const STEPS = [
  {t: '写稿', at: () => cw(4, '写稿')},
  {t: '配音', at: () => cw(4, '配音')},
  {t: '字幕', at: () => cw(4, '字幕')},
  {t: '动画', at: () => cw(5, '动画')},
  {t: '文案', at: () => cw(5, '文案')},
];

export const K1Hook: React.FC<{f: number}> = ({f}) => {
  const sayAt = cw(3, '做一期');
  const flowAt = cw(6, '流程');
  const whyAt = cf(7) + 4;
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20} rot={-2}>
        <Note color={C.panel} size={42}>这期视频</Note>
      </Pop>
      <Pop f={f} at={cf(2)} x={60} y={100} enter="up">
        <Win w={960} h={170} title="我对 AI 说">
          <div style={{padding: '22px 26px'}}>{f >= sayAt && <Bubble me text="做一期 Skill" size={48} />}</div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(2) + 8} x={80} y={200} rot={-4}>
        <Note color={C.yellow} size={36}>就这一句</Note>
      </Pop>
      {STEPS.map((s, i) => (
        <Pop key={s.t} f={f} at={s.at()} x={60 + i * 192} y={320}>
          <div style={{position: 'relative'}}>
            <div style={{...txt(44), width: 170, height: 110, boxSizing: 'border-box', background: C.white, border: `4px solid ${C.ink}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>{s.t}</div>
            <div style={{position: 'absolute', right: -12, top: -22}}>
              <Check size={56} p={prog(f, s.at() + 6, 8)} />
            </div>
          </div>
        </Pop>
      ))}
      <Pop f={f} at={cf(6)} x={60} y={480} enter="up">
        <Card w={740} h={220} pad={0} bg="#FFFDF7" style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
          <PlainFile name="SKILL.md" size={120} />
          <div>
            <div style={txt(34, C.inkSoft)}>它照着这份文件做</div>
            <div style={{...txt(46), marginTop: 8}}>
              <Marker p={prog(f, flowAt, 10)}>我写好的流程</Marker>
            </div>
          </div>
        </Card>
      </Pop>
      <Burst f={f} at={flowAt + 4} x={180} y={590} r={180} />
      <FocusLines f={f} at={whyAt} out={whyAt + 30} x={420} y={830} />
      <Pop f={f} at={whyAt} x={60} y={770} rot={-3}>
        <div style={bigText(76, C.red)}>它怎么知道我要啥？</div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= STEPS[4].at() ? 'star' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const K1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['paper', cf(2), 0.3],
  ['type', cw(3, '做一期'), 0.35],
  ...STEPS.map((s) => ['ding', s.at() + 6, 0.25] as SfxCue),
  ['paper', cf(6), 0.3],
  ['magic', cw(6, '流程') + 4, 0.35],
  ['question', cf(7) + 4, 0.4],
];

/* ---------- K2 这叫 Skill，技能说明书 ---------- */
export const K2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(9, 'Skill');
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(8)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>答案就在这期的主题里</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={180} />
      <Pop f={f} at={nameAt} x={40} y={60} rot={-3}>
        <div style={bigText(180, C.yellow)}>Skill</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={260} y={170} r={300} n={16} />
      <Pop f={f} at={cf(10)} x={40} y={270} rot={2}>
        <div style={bigText(72, C.white)}>
          交给 AI 的<span style={{color: C.yellow}}>技能说明书</span>
        </div>
      </Pop>
    </HostTall>
  );
};
export const K2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.3],
  ['magic', cw(9, 'Skill'), 0.5],
  ['pop', cf(10), 0.3],
];

/* ---------- K3 MCP 管能做更多事，Skill 管怎么做才对 ---------- */
export const K3Versus: React.FC<{f: number}> = ({f}) => {
  const mcpAt = cf(11);
  const skillAt = cf(14);
  const howAt = cf(15) + 4; // 「符合」在句尾，挂在句首附近
  return (
    <>
      <Pop f={f} at={mcpAt} x={60} y={30} enter="left">
        <Card w={960} h={300} bg={C.tealLight}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={bigText(76, C.white)}>MCP</div>
            <div style={txt(38, C.inkSoft)}>上期讲过</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 20}}>
            <PlugIcon kind="usbc" size={80} color={C.white} />
            <div>
              <div style={{...txt(46), opacity: prog(f, cw(12, '工具'), 6)}}>接上新的工具</div>
              <div style={{...txt(46, C.teal), marginTop: 8, opacity: prog(f, cf(13), 6)}}>所以能做更多的事</div>
            </div>
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={skillAt} x={60} y={370} enter="left">
        <Card w={960} h={300} bg="#FFF3B8">
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={bigText(76, C.white)}>Skill</div>
            <div style={txt(38, C.inkSoft)}>这期讲</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 20}}>
            <ManualBook title="手册" w={80} h={110} color={C.orange} size={24} />
            <div>
              <div style={{...txt(46), opacity: prog(f, cf(15), 6)}}>怎么做</div>
              <div style={{...txt(46, C.orangeDark), marginTop: 8, opacity: prog(f, howAt, 6)}}>才符合你的要求</div>
            </div>
          </div>
        </Card>
      </Pop>
      <FocusLines f={f} at={howAt + 6} out={howAt + 30} x={420} y={790} />
      <Pop f={f} at={howAt + 6} x={60} y={730} rot={-3}>
        <div style={bigText(64, C.yellow)}>
          一个管<span style={{color: C.teal}}>能不能</span>，一个管<span style={{color: C.red}}>怎么做</span>
        </div>
      </Pop>
      <PiP f={f} at={cf(11) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const K3Sfx: SfxCue[] = [
  ['whoosh', cf(11), 0.3],
  ['click', cw(12, '工具'), 0.25],
  ['click', cf(13), 0.25],
  ['whoosh', cf(14), 0.3],
  ['click', cf(15), 0.25],
  ['ding', cf(15) + 10, 0.4],
];

/* ---------- K4 一本写好的工作手册：步骤、工具、要求、坑，外加模板和脚本 ---------- */
const PAGES = [
  {t: '分几步', at: () => cw(17, '分几步')},
  {t: '每步用什么工具', at: () => cf(18)},
  {t: '有哪些要求', at: () => cw(19, '要求')},
  {t: '哪些坑不能踩', at: () => cw(19, '坑')},
];

export const K4Manual: React.FC<{f: number}> = ({f}) => {
  const bookAt = cw(16, '工作手册');
  const attachAt = cf(20);
  const open = prog(f, bookAt + 6, 14, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(16)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          一本写好的<span style={{color: C.yellow}}>工作手册</span>
        </div>
      </Pop>
      {f >= bookAt && (
        <div style={{position: 'absolute', left: 60, top: 150, width: 760, height: 540, opacity: prog(f, bookAt, 6)}}>
          {/* 左页 */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 380, height: 540, boxSizing: 'border-box', background: '#FFFDF7', border: `5px solid ${C.ink}`, borderRadius: '18px 4px 4px 18px', padding: '28px 26px', transform: `scaleX(${lerp(0.2, 1, open)})`, transformOrigin: 'right center'}}>
            <div style={txt(40, C.orangeDark)}>做这件事</div>
            {PAGES.map((p, i) => (
              <div key={p.t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, opacity: prog(f, p.at(), 6)}}>
                <div style={{...txt(28, C.white), width: 42, height: 42, borderRadius: 21, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{i + 1}</div>
                <div style={txt(38)}>{p.t}</div>
              </div>
            ))}
          </div>
          {/* 右页 */}
          <div style={{position: 'absolute', left: 380, top: 0, width: 380, height: 540, boxSizing: 'border-box', background: '#FFFDF7', border: `5px solid ${C.ink}`, borderLeft: 'none', borderRadius: '4px 18px 18px 4px', padding: '28px 26px', transform: `scaleX(${lerp(0.2, 1, open)})`, transformOrigin: 'left center'}}>
            {[88, 72, 80, 64, 76, 58, 84].map((w, i) => (
              <div key={i} style={{height: 14, width: `${w}%`, background: '#E4DED2', borderRadius: 7, marginTop: i ? 22 : 8}} />
            ))}
          </div>
        </div>
      )}
      {['模板', '脚本'].map((t, i) => (
        <Pop key={t} f={f} at={attachAt + 4 + i * 8} x={60 + i * 320} y={730} rot={i ? 4 : -4}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <PlainFile name="" size={70} color={i ? '#CFE3FF' : '#FCE3A8'} />
            <div style={{...txt(40), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '2px 16px'}}>附 {t}</div>
          </div>
        </Pop>
      ))}
      <PiP f={f} at={cf(16) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const K4Sfx: SfxCue[] = [
  ['pop', cf(16), 0.35],
  ['paper', cw(16, '工作手册'), 0.4],
  ...PAGES.map((p) => ['click', p.at(), 0.3] as SfxCue),
  ['pop', cf(20) + 4, 0.3],
  ['pop', cf(20) + 12, 0.3],
];

/* ---------- K5 我做视频的这个 Skill 里写了什么 ---------- */
const RULES = [
  {t: '口播稿写 600 到 800 字', at: () => cw(22, '多少字')},
  {t: '配音加速 1.2 倍', at: () => cw(23, '加速')},
  {t: '竖屏 3:4，像素风小人', at: () => cw(24, '风格')},
  {t: '先给我预览，确认后再导出', at: () => cw(25, '预览')},
];

export const K5MySkill: React.FC<{f: number}> = ({f}) => {
  const nodAt = cw(26, '点头');
  return (
    <>
      <Pop f={f} at={cf(21)} x={60} y={30} enter="up">
        <Win w={960} h={640} title="pixel-video / SKILL.md">
          <div style={{padding: '22px 30px'}}>
            <div style={{fontFamily: FONT_CODE, fontSize: 30, color: C.inkSoft}}># 关键词 → 一期像素风口播动画</div>
            {[70, 88, 60].map((w, i) => (
              <div key={i} style={{height: 12, width: `${w}%`, background: '#E4DED2', borderRadius: 6, marginTop: 16}} />
            ))}
            {RULES.map((r, i) => (
              <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, opacity: prog(f, r.at(), 6)}}>
                <div style={{fontFamily: FONT_CODE, fontSize: 30, color: C.inkSoft}}>-</div>
                <div style={txt(44)}>
                  <Marker p={prog(f, r.at() + 2, 10)} color={i === 3 ? C.pink : C.yellow}>
                    {r.t}
                  </Marker>
                </div>
              </div>
            ))}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cf(21) + 10} x={640} y={690} rot={3}>
        <Note color={C.panel} size={30}>我真实在用的文件（节选）</Note>
      </Pop>
      {f >= nodAt && (
        <div style={{position: 'absolute', left: 140, top: 760, transform: `scale(${stampScale(f, nodAt)}) rotate(-6deg)`}}>
          <Stamp text="我点头了才导出" size={64} color={C.teal} />
        </div>
      )}
      <PiP f={f} at={cf(21) - 6} skin="detective" eyes={f >= nodAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const K5Sfx: SfxCue[] = [
  ['paper', cf(21), 0.35],
  ...RULES.map((r) => ['click', r.at(), 0.3] as SfxCue),
  ['stamp', cw(26, '点头'), 0.45],
];

/* ---------- K6 会不会塞满上下文：平时只看名字和简介，对上了才翻开 ---------- */
const SHELF = [
  {t: '做视频', c: C.teal},
  {t: '写周报', c: C.orange},
  {t: '回客户', c: '#8E8FE8'},
  {t: '查资料', c: '#F2A0B4'},
  {t: '做 PPT', c: C.yellow},
];

export const K6Shelf: React.FC<{f: number}> = ({f}) => {
  const noAt = cf(29);
  const tagAt = cw(31, '简介');
  const needAt = cf(32);
  const openAt = cw(33, '翻开');
  const open = prog(f, openAt, 14, easeOut);
  const manyAt = cf(34);
  return (
    <>
      <Pop f={f} at={cf(27)} x={60} y={30}>
        <div style={{position: 'relative'}}>
          <div style={bigText(72, C.white)}>
            会不会把<span style={{color: C.yellow}}>上下文</span>塞满？
          </div>
          {f >= noAt && (
            <div style={{position: 'absolute', left: 790, top: -16, transform: `scale(${stampScale(f, noAt)}) rotate(-10deg)`}}>
              <Stamp text="不会" size={70} color={C.teal} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={cf(28)} x={60} y={140} enter="up">
        <Card w={960} h={300} bg={C.white}>
          <div style={txt(34, C.inkSoft)}>AI 的上下文里，平时只放着</div>
          <div style={{display: 'flex', gap: 14, marginTop: 16}}>
            {SHELF.map((s, i) => {
              const pick = i === 0 && f >= needAt + 10;
              return (
                <div key={s.t} style={{width: 168, height: 180, boxSizing: 'border-box', background: pick ? '#FFF3B8' : C.panel, border: `4px solid ${pick ? C.red : C.ink}`, borderRadius: 14, padding: '10px 12px', opacity: prog(f, cf(30) + i * 4, 6)}}>
                  <div style={{height: 22, background: s.c, border: `3px solid ${C.ink}`, borderRadius: 6}} />
                  <div style={{...txt(34), marginTop: 10}}>{s.t}</div>
                  <div style={{opacity: prog(f, tagAt + i * 3, 6)}}>
                    {[80, 60].map((w) => <div key={w} style={{height: 10, width: `${w}%`, background: '#D8D0C2', borderRadius: 5, marginTop: 12}} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(30) + 6} x={600} y={452} rot={3}>
        <Note color={C.yellow} size={34}>名字 + 一句简介</Note>
      </Pop>
      <Pop f={f} at={needAt} x={60} y={470}>
        <Bubble me text="做一期 MCP" size={40} />
      </Pop>
      {f >= openAt && (
        <div style={{position: 'absolute', left: 60, top: 560, width: 740, height: lerp(60, 290, open), overflow: 'hidden', boxSizing: 'border-box', background: '#FFFDF7', border: `5px solid ${C.ink}`, borderRadius: 18, padding: '18px 26px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
          <div style={txt(38, C.orangeDark)}>整本「做视频」手册翻开了</div>
          {['0. 定期数和目录', '1. 写口播稿', '2. 配音并加速', '3. 转字幕 ……'].map((t, i) => (
            <div key={t} style={{...txt(32), marginTop: 10, opacity: prog(f, openAt + 8 + i * 4, 6)}}>{t}</div>
          ))}
        </div>
      )}
      <Burst f={f} at={openAt + 2} x={420} y={620} r={220} />
      <FocusLines f={f} at={manyAt + 20} out={manyAt + 50} x={420} y={900} />
      <Pop f={f} at={manyAt + 20} x={60} y={872} rot={-3}>
        <div style={bigText(76, C.yellow)}>用到哪本才翻哪本</div>
      </Pop>
      <PiP f={f} at={cf(27) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const K6Sfx: SfxCue[] = [
  ['question', cf(27), 0.35],
  ['paper', cf(28), 0.3],
  ['stamp', cf(29), 0.45],
  ...SHELF.map((_, i) => ['click', cf(30) + i * 4, 0.2] as SfxCue),
  ['type', cf(32), 0.3],
  ['whoosh', cw(33, '翻开'), 0.4],
  ['ding', cw(33, '翻开') + 4, 0.35],
  ['magic', cf(34) + 20, 0.35],
];
