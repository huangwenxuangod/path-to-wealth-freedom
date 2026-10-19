import React from 'react';
import {easeInOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {ChatIcon, Check, Cross, Folder, PlainFile, Stamp, stampScale, ToolIcon, UserFace} from '../../../library/icons';
import {Code, ScreenVideo, Win, type Tok} from '../../../library/items/apps';
import {Globe} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

/* ---------- S1 钩子：这几期视频是 AI 自己写代码、检查、改出来的 ---------- */
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

export const S1Hook: React.FC<{f: number}> = ({f}) => {
  const handAt = cw(3, '一笔');
  const codeAt = cf(4) - 4;
  const renderAt = cf(5);
  const badAt = cf(6);
  const fixAt = cw(6, '改好');
  const meAt = cf(7);
  const partsOut = codeAt - 2;
  return (
    <>
      {PARTS.map((p, i) => (
        <Pop key={p.t} f={f} at={i ? cw(2, p.t) : cw(1, '画面')} out={partsOut} x={200 + i * 380} y={120}>
          <Card w={300} h={160} pad={0} bg={p.color} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={bigText(80, C.white)}>{p.t}</div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={handAt} out={partsOut} x={330} y={360}>
        <div style={{position: 'relative'}}>
          <Note color={C.panel} size={44}>我一笔一笔手工做</Note>
          <div style={{position: 'absolute', left: 150, top: -30}}>
            <Cross size={120} p={prog(f, handAt + 8, 8)} />
          </div>
        </div>
      </Pop>
      <Pop f={f} at={codeAt} x={60} y={20} enter="up">
        <Win w={640} h={330} title="AI 自己写代码" dark>
          <div style={{padding: '24px 26px'}}>
            <Code lines={CODE} typed={Math.floor((f - codeAt) * 1.6)} size={32} f={f} />
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={renderAt} x={760} y={20} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, badAt, 10, 14)}px)`}}>
          <Win w={560} h={360} title="渲染出来检查">
            <ScreenVideo src="footage/ep03-cc.mp4" at={renderAt} startFrom={900} w={552} h={310} />
          </Win>
          {f >= badAt && f < fixAt && <div style={{position: 'absolute', left: 150, top: 110, width: 220, height: 150, border: `6px solid ${C.red}`, borderRadius: 16}} />}
        </div>
      </Pop>
      <Pop f={f} at={badAt + 2} out={fixAt} x={900} y={400} rot={-4}>
        <div style={bigText(64, C.red)}>发现不对！</div>
      </Pop>
      {f >= fixAt && (
        <div style={{position: 'absolute', left: 930, top: 400, transform: `scale(${stampScale(f, fixAt)}) rotate(-6deg)`}}>
          <Stamp text="自己改好了" size={56} color="#3DAA6B" />
        </div>
      )}
      <Pop f={f} at={meAt} x={80} y={420} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <UserFace size={130} mood="happy" f={f} />
          <Note color={C.yellow} size={40}>我：提需求 + 最后把关</Note>
        </div>
      </Pop>
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= fixAt ? 'happy' : 'open'} />
    </>
  );
};
export const S1Sfx: SfxCue[] = [
  ['pop', cw(1, '画面'), 0.35],
  ['pop', cw(2, '配乐'), 0.3],
  ['pop', cw(2, '音效'), 0.3],
  ['error', cw(3, '一笔') + 8, 0.35],
  ['type', cf(4) - 4, 0.4],
  ['whoosh', cf(5), 0.3],
  ['error', cf(6), 0.35],
  ['stamp', cw(6, '改好'), 0.5],
  ['ding', cf(7), 0.3],
];

/* ---------- S2 这种 AI 叫 Agent ---------- */
export const S2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(9, 'Agent');
  return (
    <Host f={f} wear={['headphones']} eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(8)} x={0} y={20} rot={-2}>
        <Note color={C.panel} size={40}>能做到这一步的 AI，叫做</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 36} x={280} y={250} />
      <Pop f={f} at={nameAt} x={0} y={120} rot={-4}>
        <div style={bigText(180, C.yellow)}>Agent</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={280} y={230} r={260} n={16} />
    </Host>
  );
};
export const S2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.3],
  ['magic', cw(9, 'Agent'), 0.5],
];

/* ---------- S3 同一件事：聊天 AI 给步骤，Agent 自己动手 ---------- */
const MESS = [
  {x: 60, y: 30, r: -14, color: C.tealLight, g: 0},
  {x: 250, y: 10, r: 10, color: '#FCE3A8', g: 1},
  {x: 430, y: 40, r: -6, color: C.pink, g: 2},
  {x: 150, y: 150, r: 18, color: '#FCE3A8', g: 1},
  {x: 360, y: 170, r: -20, color: C.tealLight, g: 0},
  {x: 540, y: 150, r: 8, color: C.pink, g: 2},
];
const FOLDERS = [
  {name: '图片', color: C.tealLight},
  {name: '文档', color: '#FCE3A8'},
  {name: '视频', color: C.pink},
];
const RX = 820;

export const S3Compare: React.FC<{f: number}> = ({f}) => {
  const chatAt = cf(15);
  const youAt = cf(18);
  const agentAt = cf(19);
  const openAt = cf(20);
  const moveAt = cf(22);
  const doneAt = cf(23);
  const handAt = cw(18, '动手');
  return (
    <>
      <Pop f={f} at={cf(10)} x={80} y={30}>
        <div style={bigText(56, C.white)}>
          聊天 AI <span style={{color: C.inkSoft}}>vs</span> <span style={{color: C.yellow}}>Agent</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(13)} x={700} y={30} rot={2}>
        <Note color={C.yellow} size={36}>任务：把乱七八糟的桌面文件整理好</Note>
      </Pop>
      {/* 左：聊天 AI */}
      <Pop f={f} at={chatAt} x={60} y={130} enter="up">
        <Win w={680} h={560} title="聊天 AI">
          <div style={{padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <ChatIcon size={70} />
              <div style={txt(34)}>它很认真地告诉你：</div>
            </div>
            {['第一步，新建三个文件夹', '第二步，把图片拖进去', '第三步……'].map((t, i) => (
              <div key={t} style={{...txt(34), opacity: prog(f, cw(17, '第一') + i * 10, 6), paddingLeft: 20}}>{t}</div>
            ))}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={youAt} x={120} y={520} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <UserFace size={110} mood="angry" f={f} />
          <Note color={C.pink} size={36}>动手的还是你自己</Note>
        </div>
      </Pop>
      <Emote f={f} at={handAt} kind="sweat" x={200} y={500} />
      {/* 右：Agent */}
      <Pop f={f} at={agentAt} x={RX} y={130} enter="up">
        <Win w={740} h={560} title="Agent">
          <div style={{position: 'relative', height: 500}}>
            {MESS.map((m, i) => {
              if (f < openAt + i * 3) return null;
              const t = prog(f, moveAt + i * 5, 14, easeInOut);
              const tx = 70 + m.g * 230 + (i % 2) * 20;
              const ty = 330;
              return (
                <div key={i} style={{position: 'absolute', left: lerp(m.x, tx, t), top: lerp(m.y + 30, ty, t), transform: `rotate(${m.r * (1 - t)}deg) scale(${1 - 0.5 * t})`, opacity: prog(f, openAt + i * 3, 6) * (1 - prog(f, moveAt + i * 5 + 12, 4))}}>
                  <PlainFile name="" size={80} color={m.color} />
                </div>
              );
            })}
            <div style={{position: 'absolute', left: 30, top: 330, display: 'flex', gap: 30, opacity: prog(f, cf(21), 8)}}>
              {FOLDERS.map((fd, g) => (
                <Folder key={fd.name} name={fd.name} size={130} color={fd.color} open={f >= moveAt + g * 5 && f < moveAt + g * 5 + 20 ? 1 : 0} />
              ))}
            </div>
          </div>
        </Win>
      </Pop>
      {f >= agentAt && <Char f={f} x={RX + 620} y={520} s={0.55} lookX={-0.6} eyes={f >= doneAt ? 'happy' : 'open'} armsUp={f >= doneAt ? 0.8 : 0} walk={f >= moveAt && f < doneAt} />}
      {f >= doneAt && (
        <div style={{position: 'absolute', left: RX + 380, top: 190, transform: `scale(${stampScale(f, doneAt)}) rotate(-8deg)`}}>
          <Stamp text="整理好了" size={60} color="#3DAA6B" />
        </div>
      )}
      <PiP f={f} at={cf(10) - 6} skin="cowboy" />
    </>
  );
};
export const S3Sfx: SfxCue[] = [
  ['pop', cf(10), 0.35],
  ['paper', cf(13), 0.3],
  ['type', cf(15), 0.3],
  ['question', cw(18, '动手'), 0.3],
  ['whoosh', cf(19), 0.3],
  ...MESS.map((_, i) => ['pop', cf(20) + i * 3, 0.15] as SfxCue),
  ...MESS.map((_, i) => ['click', cf(22) + i * 5, 0.2] as SfxCue),
  ['stamp', cf(23), 0.5],
];

/* ---------- S4 Agent = 大模型 + 工具 + 循环 ---------- */
const TOOLS = [
  {t: '读文件', at: () => cw(29, '读文件')},
  {t: '跑代码', at: () => cw(29, '跑代码')},
  {t: '上网搜索', at: () => cw(29, '上网')},
];
const LOOP = ['做一步', '看结果', '决定下一步'];
const LCX = 1110;
const LCY = 360;
const LR = 170;

export const S4Parts: React.FC<{f: number}> = ({f}) => {
  const handsAt = cw(25, '动手');
  const loopAt = cf(31);
  const runAt = cf(32);
  const doneAt = cw(34, '完成');
  const spin = f >= runAt ? ((f - runAt) / 50) * Math.PI * 2 : 0;
  return (
    <>
      <Pop f={f} at={cf(24)} x={80} y={30}>
        <div style={bigText(56, C.white)}>
          Agent 最关键的，是它能<span style={{color: C.yellow}}>自己动手</span>
        </div>
      </Pop>
      <Burst f={f} at={handsAt} x={900} y={70} r={160} />
      <Pop f={f} at={cf(26)} x={120} y={200}>
        <Card w={300} h={180} pad={0} bg="#D9E4FF" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(28, C.inkSoft)}>背后还是</div>
          <div style={bigText(64, C.white)}>大模型</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(27)} x={440} y={250}>
        <div style={bigText(72, C.yellow)}>+</div>
      </Pop>
      <Pop f={f} at={cf(28)} x={120} y={420}>
        <Note color={C.tealLight} size={40}>① 工具</Note>
      </Pop>
      {TOOLS.map((tl, i) => (
        <Pop key={tl.t} f={f} at={tl.at()} x={120 + i * 210} y={510}>
          <Card w={190} h={150} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            {i === 0 ? <ToolIcon kind="readFile" size={70} /> : i === 1 ? <div style={{...txt(40, C.white), background: C.ink, borderRadius: 10, padding: '4px 12px'}}>{'>_'}</div> : <Globe size={72} t={f} />}
            <div style={txt(32)}>{tl.t}</div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={cf(30)} x={120} y={680} rot={-2}>
        <Note color={C.yellow} size={32}>让它能真的去做事</Note>
      </Pop>
      <Pop f={f} at={loopAt} x={LCX - 100} y={140}>
        <Note color={C.pink} size={40}>② 循环</Note>
      </Pop>
      {f >= loopAt && (
        <svg width={1920} height={820} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: prog(f, loopAt, 8)}}>
          <circle cx={LCX} cy={LCY + 60} r={LR} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="18 14" />
          {f >= runAt && <circle cx={LCX + Math.cos(spin - Math.PI / 2) * LR} cy={LCY + 60 + Math.sin(spin - Math.PI / 2) * LR} r={18} fill={C.orange} stroke={C.ink} strokeWidth={4} />}
        </svg>
      )}
      {LOOP.map((t, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
        const at = i === 0 ? runAt : i === 1 ? cw(32, '结果') : cf(33);
        return (
          <Pop key={t} f={f} at={at} x={LCX + Math.cos(a) * LR} y={LCY + 60 + Math.sin(a) * LR} center>
            <Card w={i === 2 ? 220 : 170} h={70} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={txt(32)}>{t}</div>
            </Card>
          </Pop>
        );
      })}
      <Pop f={f} at={doneAt} x={LCX - 100} y={LCY + 30}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <Check size={56} />
          <div style={txt(36)}>直到完成</div>
        </div>
      </Pop>
      <PiP f={f} at={cf(24) - 6} skin="detective" />
    </>
  );
};
export const S4Sfx: SfxCue[] = [
  ['pop', cf(24), 0.35],
  ['ding', cw(25, '动手'), 0.3],
  ['pop', cf(26), 0.35],
  ['pop', cf(28), 0.3],
  ...TOOLS.map((t) => ['click', t.at(), 0.3] as SfxCue),
  ['pop', cf(31), 0.3],
  ['whoosh', cf(32), 0.3],
  ['click', cf(33), 0.25],
  ['ding', cw(34, '完成'), 0.4],
];

