import React from 'react';
import {easeInOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {ChatIcon, Check, Cross, Folder, PlainFile, Stamp, stampScale, ToolIcon, UserFace} from '../../../library/icons';
import {Code, ScreenVideo, Win, type Tok} from '../../../library/items/apps';
import {Globe} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- U1 钩子：这几期视频是 AI 自己写代码、检查、改出来的 ---------- */
const PARTS = [
  {t: '画面', color: C.tealLight},
  {t: '配乐', color: '#FFF3B8'},
  {t: '音效', color: C.pink},
];
const CODE: Tok[][] = [
  [['<', C.inkSoft], ['Char', '#F2C230'], [' skin=', '#9FDCCD'], ['"santa"', '#F7A0A8'], [' />', C.inkSoft]],
  [['<', C.inkSoft], ['Burst', '#F2C230'], [' at=', '#9FDCCD'], ['{cf(4)}', '#F7A0A8'], [' />', C.inkSoft]],
  [['buildBgm', '#F2C230'], ['({level: ', '#E6E1CF'], ['0.071', '#F7A0A8'], ['})', '#E6E1CF']],
];

export const U1Hook: React.FC<{f: number}> = ({f}) => {
  const handAt = cw(3, '一笔');
  const codeAt = cf(4) - 4;
  const renderAt = cf(5);
  const badAt = cf(6);
  const fixAt = cw(6, '改好');
  const meAt = cf(7);
  const out = codeAt - 2;
  return (
    <>
      <Pop f={f} at={cf(1)} out={out} x={60} y={60}>
        <div style={bigText(80, C.white)}>这几期动画里的</div>
      </Pop>
      {PARTS.map((p, i) => (
        <Pop key={p.t} f={f} at={i ? cw(2, p.t) : cw(1, '画面')} out={out} x={60 + i * 330} y={200}>
          <Card w={300} h={200} pad={0} bg={p.color} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={bigText(100, C.white)}>{p.t}</div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={handAt} out={out} x={200} y={480}>
        <div style={{position: 'relative'}}>
          <Note color={C.panel} size={56}>都是我一笔一笔做的？</Note>
          <div style={{position: 'absolute', left: 250, top: -40}}><Cross size={160} p={prog(f, handAt + 8, 8)} /></div>
        </div>
      </Pop>
      <FocusLines f={f} at={handAt + 8} out={handAt + 30} x={540} y={540} />
      <Pop f={f} at={codeAt} x={60} y={30} enter="up">
        <Win w={960} h={330} title="AI 自己写代码" dark>
          <div style={{padding: '26px 30px'}}>
            <Code lines={CODE} typed={Math.floor((f - codeAt) * 1.8)} size={44} f={f} />
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={renderAt} x={160} y={390} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, badAt, 14, 16)}px)`}}>
          <Win w={760} h={480} title="渲染出来检查">
            <ScreenVideo src="footage/ep03-cc.mp4" at={renderAt} startFrom={900} w={752} h={423} />
          </Win>
          {f >= badAt && f < fixAt && <div style={{position: 'absolute', left: 230, top: 150, width: 300, height: 200, border: `8px solid ${C.red}`, borderRadius: 18}} />}
        </div>
      </Pop>
      <Pop f={f} at={badAt + 2} out={fixAt} x={220} y={760} rot={-5}>
        <div style={bigText(110, C.red)}>发现不对！</div>
      </Pop>
      {f >= fixAt && (
        <div style={{position: 'absolute', left: 300, top: 740, transform: `scale(${stampScale(f, fixAt)}) rotate(-6deg)`}}>
          <Stamp text="自己改好了" size={80} color="#3DAA6B" />
        </div>
      )}
      <Pop f={f} at={meAt} x={40} y={900} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <UserFace size={130} mood="happy" f={f} />
          <Note color={C.yellow} size={44}>我：提需求 + 最后把关</Note>
        </div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= fixAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const U1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['pop', cw(1, '画面'), 0.35],
  ['pop', cw(2, '配乐'), 0.3],
  ['pop', cw(2, '音效'), 0.3],
  ['error', cw(3, '一笔') + 8, 0.4],
  ['type', cf(4) - 4, 0.4],
  ['whoosh', cf(5), 0.35],
  ['error', cf(6), 0.4],
  ['stamp', cw(6, '改好'), 0.55],
  ['ding', cf(7), 0.3],
];

/* ---------- U2 这种 AI 叫 Agent ---------- */
export const U2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(9, 'Agent');
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(8)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={44}>能做到这一步的 AI，叫做</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={200} />
      <Pop f={f} at={nameAt} x={120} y={90} rot={-4}>
        <div style={bigText(220, C.yellow)}>Agent</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={480} y={200} r={320} n={16} />
    </HostTall>
  );
};
export const U2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.3],
  ['magic', cw(9, 'Agent'), 0.5],
];

/* ---------- U3 同一件事：聊天 AI 给步骤，Agent 自己动手 ---------- */
const MESS = [
  {x: 40, y: 20, r: -14, color: C.tealLight, g: 0},
  {x: 210, y: 0, r: 10, color: '#FCE3A8', g: 1},
  {x: 380, y: 30, r: -6, color: C.pink, g: 2},
  {x: 120, y: 110, r: 18, color: '#FCE3A8', g: 1},
  {x: 300, y: 120, r: -20, color: C.tealLight, g: 0},
  {x: 480, y: 110, r: 8, color: C.pink, g: 2},
];
const FOLDERS = [
  {name: '图片', color: C.tealLight},
  {name: '文档', color: '#FCE3A8'},
  {name: '视频', color: C.pink},
];

export const U3Compare: React.FC<{f: number}> = ({f}) => {
  const chatAt = cf(15);
  const youAt = cf(18);
  const agentAt = cf(19);
  const openAt = cf(20);
  const moveAt = cf(22);
  const doneAt = cf(23);
  return (
    <>
      <Pop f={f} at={cf(10)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          聊天 AI <span style={{color: C.inkSoft}}>vs</span> <span style={{color: C.yellow}}>Agent</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(13)} x={60} y={130} rot={-1}>
        <Note color={C.yellow} size={40}>任务：整理乱七八糟的桌面文件</Note>
      </Pop>
      <Pop f={f} at={chatAt} x={60} y={220} enter="left">
        <Win w={960} h={330} title="聊天 AI">
          <div style={{padding: '18px 26px', display: 'flex', gap: 24}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, flex: 1}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <ChatIcon size={60} />
                <div style={txt(36)}>它很认真地告诉你：</div>
              </div>
              {['第一步，新建三个文件夹', '第二步，把图片拖进去'].map((t, i) => (
                <div key={t} style={{...txt(36), opacity: prog(f, cw(17, '第一') + i * 10, 6), paddingLeft: 16}}>{t}</div>
              ))}
            </div>
            {f >= youAt && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: prog(f, youAt, 8)}}>
                <UserFace size={130} mood="angry" f={f} />
                <Note color={C.pink} size={32}>还得你自己动手</Note>
              </div>
            )}
          </div>
        </Win>
      </Pop>
      <Emote f={f} at={cw(18, '动手')} kind="sweat" x={950} y={290} />
      <Pop f={f} at={agentAt} x={60} y={580} enter="right">
        <Win w={740} h={470} title="Agent">
          <div style={{position: 'relative', height: 410}}>
            {MESS.map((m, i) => {
              if (f < openAt + i * 3) return null;
              const t = prog(f, moveAt + i * 5, 14, easeInOut);
              return (
                <div key={i} style={{position: 'absolute', left: lerp(m.x, 60 + m.g * 230 + (i % 2) * 20, t), top: lerp(m.y + 20, 250, t), transform: `rotate(${m.r * (1 - t)}deg) scale(${1 - 0.5 * t})`, opacity: prog(f, openAt + i * 3, 6) * (1 - prog(f, moveAt + i * 5 + 12, 4))}}>
                  <PlainFile name="" size={80} color={m.color} />
                </div>
              );
            })}
            <div style={{position: 'absolute', left: 20, top: 250, display: 'flex', gap: 30, opacity: prog(f, cf(21), 8)}}>
              {FOLDERS.map((fd, g) => (
                <Folder key={fd.name} name={fd.name} size={130} color={fd.color} open={f >= moveAt + g * 5 && f < moveAt + g * 5 + 20 ? 1 : 0} />
              ))}
            </div>
          </div>
        </Win>
      </Pop>
      {f >= doneAt && (
        <div style={{position: 'absolute', left: 380, top: 640, transform: `scale(${stampScale(f, doneAt)}) rotate(-8deg)`}}>
          <Stamp text="整理好了" size={76} color="#3DAA6B" />
        </div>
      )}
      <Burst f={f} at={doneAt + 2} x={500} y={700} r={220} />
      <PiP f={f} at={cf(10) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const U3Sfx: SfxCue[] = [
  ['pop', cf(10), 0.35],
  ['paper', cf(13), 0.3],
  ['type', cf(15), 0.3],
  ['question', cw(18, '动手'), 0.3],
  ['whoosh', cf(19), 0.35],
  ...MESS.map((_, i) => ['pop', cf(20) + i * 3, 0.15] as SfxCue),
  ...MESS.map((_, i) => ['click', cf(22) + i * 5, 0.2] as SfxCue),
  ['stamp', cf(23), 0.55],
];

/* ---------- U4 Agent = 大模型 + 工具 + 循环 ---------- */
const TOOLS = [
  {t: '读文件', at: () => cw(29, '读文件')},
  {t: '跑代码', at: () => cw(29, '跑代码')},
  {t: '上网搜索', at: () => cw(29, '上网')},
];
const LOOP = ['做一步', '看结果', '决定下一步'];
const LCX = 540;
const LCY = 880;
const LR = 125;

export const U4Parts: React.FC<{f: number}> = ({f}) => {
  const loopAt = cf(31);
  const runAt = cf(32);
  const doneAt = cw(34, '完成');
  const spin = f >= runAt ? ((f - runAt) / 45) * Math.PI * 2 : 0;
  return (
    <>
      <Pop f={f} at={cf(24)} x={60} y={20}>
        <div style={bigText(64, C.white)}>Agent 最关键的，</div>
      </Pop>
      <Pop f={f} at={cw(25, '动手')} x={60} y={110} rot={-2}>
        <div style={bigText(96, C.yellow)}>是它能自己动手</div>
      </Pop>
      <Burst f={f} at={cw(25, '动手') + 2} x={540} y={170} r={260} />
      <Pop f={f} at={cf(26)} x={60} y={260}>
        <Card w={330} h={150} pad={0} bg="#D9E4FF" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(30, C.inkSoft)}>背后还是</div>
          <div style={bigText(68, C.white)}>大模型</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(27)} x={410} y={280}>
        <div style={bigText(90, C.yellow)}>+ 两样东西</div>
      </Pop>
      <Pop f={f} at={cf(28)} x={60} y={440}>
        <Note color={C.tealLight} size={44}>① 工具</Note>
      </Pop>
      {TOOLS.map((tl, i) => (
        <Pop key={tl.t} f={f} at={tl.at()} x={60 + i * 330} y={520}>
          <Card w={300} h={150} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
            {i === 0 ? <ToolIcon kind="readFile" size={70} /> : i === 1 ? <div style={{...txt(40, C.white), background: C.ink, borderRadius: 10, padding: '4px 12px'}}>{'>_'}</div> : <Globe size={70} t={f} />}
            <div style={txt(38)}>{tl.t}</div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={cf(30)} x={620} y={440} rot={2}>
        <Note color={C.yellow} size={34}>让它能真的去做事</Note>
      </Pop>
      <Pop f={f} at={loopAt} x={60} y={700}>
        <Note color={C.pink} size={44}>② 循环</Note>
      </Pop>
      {f >= loopAt && (
        <svg width={1080} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: prog(f, loopAt, 8)}}>
          <circle cx={LCX} cy={LCY} r={LR} fill="none" stroke={C.ink} strokeWidth={7} strokeDasharray="20 14" />
          {f >= runAt && <circle cx={LCX + Math.cos(spin - Math.PI / 2) * LR} cy={LCY + Math.sin(spin - Math.PI / 2) * LR} r={20} fill={C.orange} stroke={C.ink} strokeWidth={4} />}
        </svg>
      )}
      {LOOP.map((t, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
        const at = i === 0 ? runAt : i === 1 ? cw(32, '结果') : cf(33);
        return (
          <Pop key={t} f={f} at={at} x={LCX + Math.cos(a) * LR} y={LCY + Math.sin(a) * LR} center>
            <Card w={i === 2 ? 230 : 180} h={72} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={txt(34)}>{t}</div>
            </Card>
          </Pop>
        );
      })}
      <Pop f={f} at={doneAt} x={LCX - 90} y={LCY - 30}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <Check size={52} />
          <div style={txt(34)}>直到完成</div>
        </div>
      </Pop>
      <PiP f={f} at={cf(24) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const U4Sfx: SfxCue[] = [
  ['pop', cf(24), 0.35],
  ['ding', cw(25, '动手'), 0.4],
  ['pop', cf(26), 0.35],
  ['pop', cf(27), 0.3],
  ['pop', cf(28), 0.3],
  ...TOOLS.map((t) => ['click', t.at(), 0.3] as SfxCue),
  ['pop', cf(31), 0.3],
  ['whoosh', cf(32), 0.3],
  ['click', cf(33), 0.25],
  ['ding', cw(34, '完成'), 0.4],
];

