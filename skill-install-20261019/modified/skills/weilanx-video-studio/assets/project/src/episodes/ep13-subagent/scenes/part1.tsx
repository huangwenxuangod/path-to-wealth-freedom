import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Bulb, Check, Folder, PlainFile} from '../../../library/icons';
import {Stopwatch} from '../../../library/items/apps';
import {Desk} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/** 进度条，p 为 0..1 */
export const Bar: React.FC<{w: number; h?: number; p: number; color?: string}> = ({w, h = 30, p, color = C.teal}) => (
  <div style={{width: w, height: h, boxSizing: 'border-box', border: `4px solid ${C.ink}`, borderRadius: h / 2, background: C.white, overflow: 'hidden'}}>
    <div style={{width: `${Math.max(0, Math.min(1, p)) * 100}%`, height: '100%', background: color}} />
  </div>
);

/** 帮手头上的小牌子 */
export const Tag: React.FC<{t: string; color?: string; size?: number}> = ({t, color = C.white, size = 28}) => (
  <div style={{...txt(size), background: color, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 12px', whiteSpace: 'nowrap'}}>{t}</div>
);

/* ---------- A1 钩子：一个 AI 一家一家查到忘，叫上帮手同时开工 ---------- */
const CO = Array.from({length: 10}, (_, i) => `${String.fromCharCode(65 + i)} 公司`);
const GROUP = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2];
const GROUP_C = [C.tealLight, '#FFF3B8', C.pink];
const HELPERS = [220, 540, 860];

export const A1Hook: React.FC<{f: number}> = ({f}) => {
  const soloAt = cf(2);
  const forgetAt = cw(4, '挤忘');
  const teamAt = cf(5);
  const goAt = cw(6, '同时');
  const doneAt = cf(8);
  const solo = 1 - prog(f, teamAt, 10);
  const team = prog(f, teamAt, 10);
  const soloDone = Math.min(3, Math.floor(Math.max(0, f - soloAt) / 40));
  const run = prog(f, goAt, 60, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20} rot={-2}>
        <Note color={C.panel} size={40}>让 AI 查 10 家公司的资料</Note>
      </Pop>
      <div style={{position: 'absolute', left: 60, top: 110, display: 'flex', gap: 6}}>
        {CO.map((c, i) => {
          const done = f < teamAt ? i < soloDone : run > 0.95;
          return (
            <div key={c} style={{opacity: prog(f, cf(1) + 4 + i * 2, 5), width: 90, height: 90, boxSizing: 'border-box', background: f >= teamAt ? GROUP_C[GROUP[i]] : C.white, border: `4px solid ${C.ink}`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <Folder name="" size={46} />
              <div style={txt(20)}>{c}</div>
              {done && <div style={{position: 'absolute', right: -10, top: -14}}><Check size={34} /></div>}
            </div>
          );
        })}
      </div>
      {/* 一个人查：一家一家来，桌上越堆越多，前面的看不清了 */}
      {solo > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: solo}}>
          <Char f={f} x={260} y={760} s={1.3} kind="bot" eyes={f >= forgetAt ? 'spiral' : 'open'} lookX={0.5} opacity={prog(f, cf(1), 8)} />
          <div style={{position: 'absolute', left: 500, top: 260, opacity: prog(f, soloAt, 8)}}>
            <Card w={480} h={420} bg="#FFFDF7">
              <div style={txt(34, C.inkSoft)}>它的桌上</div>
              {Array.from({length: 6}, (_, k) => {
                const at = soloAt + k * 14;
                const fade = k < 3 ? 1 - 0.75 * prog(f, forgetAt + k * 4, 12) : 1;
                return f >= at ? (
                  <div key={k} style={{...txt(30), marginTop: 10, opacity: fade, filter: fade < 0.6 ? 'blur(1.5px)' : 'none', display: 'flex', gap: 10, alignItems: 'center'}}>
                    <PlainFile name="" size={36} />
                    {CO[Math.floor(k / 2)]} 资料 {(k % 2) + 1}
                  </div>
                ) : null;
              })}
            </Card>
          </div>
          <Emote f={f} at={forgetAt + 4} kind="sweat" x={290} y={480} dur={60} />
          <Pop f={f} at={forgetAt} x={500} y={700} rot={-3}>
            <div style={bigText(64, C.red)}>前面的快忘了</div>
          </Pop>
        </div>
      )}
      {/* 叫上帮手：每人分几家，同时开工 */}
      {team > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: team}}>
          <Char f={f} x={540} y={420} s={0.95} kind="bot" eyes="happy" />
          <div style={{position: 'absolute', left: 620, top: 270}}>
            <Tag t="总管" color={C.yellow} size={32} />
          </div>
          <svg width={1080} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            {HELPERS.map((x, i) => (
              <line key={x} x1={540} y1={430} x2={x} y2={560} stroke={C.ink} strokeWidth={5} strokeDasharray="12 8" opacity={prog(f, cw(5, '帮手') + i * 4, 8)} />
            ))}
          </svg>
          {HELPERS.map((x, i) => {
            const at = cw(5, '帮手') + i * 4;
            return f >= at ? (
              <React.Fragment key={x}>
                <Char f={f} x={x} y={710} s={0.8} kind="bot" eyes={run > 0.95 ? 'happy' : 'open'} walk={f >= goAt && run < 0.95} opacity={prog(f, at, 6)} />
                <div style={{position: 'absolute', left: x - 70, top: 540, opacity: prog(f, at, 6)}}>
                  <Tag t={`帮手 ${i + 1} · ${[4, 3, 3][i]} 家`} color={GROUP_C[i]} size={24} />
                </div>
                <div style={{position: 'absolute', left: x - 100, top: 726}}>
                  <Bar w={200} h={28} p={run} color={C.teal} />
                </div>
              </React.Fragment>
            ) : null;
          })}
          <Pop f={f} at={goAt} x={60} y={330} rot={-4}>
            <Note color={C.yellow} size={40}>同时开工</Note>
          </Pop>
          <Pop f={f} at={doneAt} x={60} y={780} enter="up">
            <Card w={740} h={110} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px'}}>
              <Check size={56} />
              <div style={txt(42)}>一份整理好的汇总</div>
            </Card>
          </Pop>
          <Burst f={f} at={doneAt + 4} x={200} y={835} r={180} />
        </div>
      )}
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= doneAt ? 'star' : f >= forgetAt ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const A1Sfx: SfxCue[] = [
  ['pop', cf(1), 0.3],
  ['click', cf(2) + 40, 0.25],
  ['click', cf(2) + 80, 0.25],
  ['error', cw(4, '挤忘'), 0.35],
  ['whoosh', cf(5), 0.35],
  ...HELPERS.map((_, i) => ['pop', cw(5, '帮手') + i * 4, 0.25] as SfxCue),
  ['click', cw(6, '同时'), 0.3],
  ['ding', cf(8), 0.4],
  ['magic', cf(8) + 4, 0.3],
];

/* ---------- A2 这叫子 Agent，也叫多 Agent ---------- */
export const A2Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(10, '子');
  return (
    <HostTall f={f} skin="santa" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(9)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这种干活的方式，叫做</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={180} />
      <Pop f={f} at={nameAt} x={30} y={70} rot={-3}>
        <div style={bigText(150, C.yellow)}>子 Agent</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={340} y={160} r={300} n={16} />
      <Pop f={f} at={cf(11)} x={420} y={250} rot={3}>
        <div style={bigText(70, C.white)}>也叫多 Agent</div>
      </Pop>
    </HostTall>
  );
};
export const A2Sfx: SfxCue[] = [
  ['pop', cf(9), 0.3],
  ['magic', cw(10, '子'), 0.5],
  ['pop', cf(11), 0.3],
];

/* ---------- A3 总管拆活、派活、收要点、汇总 ---------- */
const PIECES = ['第 1 块', '第 2 块', '第 3 块'];

export const A3Flow: React.FC<{f: number}> = ({f}) => {
  const bossAt = cf(15);
  const splitAt = cw(16, '拆成');
  const sendAt = cf(17);
  const backAt = cw(19, '要点');
  const sumAt = cf(20);
  const split = prog(f, splitAt, 12, easeOut);
  const send = prog(f, sendAt + 6, 18, easeInOut);
  const back = prog(f, backAt, 18, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(12)} x={60} y={30} rot={-2}>
        <Note color={C.panel} size={36}>Agent：会自己用工具、一步步做完事的 AI</Note>
      </Pop>
      <Char f={f} x={540} y={350} s={0.95} kind="bot" eyes={f >= sumAt ? 'star' : 'open'} opacity={prog(f, bossAt, 8)} />
      {f >= bossAt && (
        <div style={{position: 'absolute', left: 620, top: 200, opacity: prog(f, bossAt, 6)}}>
          <Tag t="总管 Agent" color={C.yellow} size={32} />
        </div>
      )}
      {/* 大任务：先整块出现，再拆成三块飞向帮手 */}
      {f >= cf(16) && split < 1 && (
        <div style={{position: 'absolute', left: 360, top: 380, opacity: prog(f, cf(16), 6)}}>
          <Card w={360} h={90} pad={0} bg="#FCE3A8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(44)}>大任务</div>
          </Card>
        </div>
      )}
      {f >= splitAt &&
        PIECES.map((t, i) => {
          const sx = lerp(360 + i * 120, 360 + i * 130, split);
          const x = lerp(sx, HELPERS[i] - 70, send);
          const y = lerp(380, 520, send);
          return (
            <div key={t} style={{position: 'absolute', left: x, top: y, opacity: 1 - prog(f, sendAt + 30, 8)}}>
              <div style={{...txt(30), width: 140, height: 70, boxSizing: 'border-box', background: '#FCE3A8', border: `4px solid ${C.ink}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{t}</div>
            </div>
          );
        })}
      {HELPERS.map((x, i) => (
        <React.Fragment key={x}>
          <Char f={f} x={x} y={760} s={0.8} kind="bot" eyes="open" walk={f >= sendAt + 24 && f < backAt} opacity={prog(f, sendAt + i * 4, 6)} />
          {f >= backAt && (
            <div style={{position: 'absolute', left: lerp(x - 50, 500 + (i - 1) * 110, back), top: lerp(580, 250, back), opacity: 1 - prog(f, sumAt, 8)}}>
              <Tag t="要点" color={C.tealLight} size={28} />
            </div>
          )}
        </React.Fragment>
      ))}
      <Pop f={f} at={sendAt + 10} x={60} y={600} rot={-3}>
        <Note color={C.panel} size={34}>分派给帮手</Note>
      </Pop>
      <Pop f={f} at={backAt + 6} x={760} y={380} rot={3}>
        <Note color={C.tealLight} size={30}>只交回要点</Note>
      </Pop>
      <Pop f={f} at={sumAt} x={60} y={800} enter="up">
        <Card w={740} h={100} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px'}}>
          <Check size={52} />
          <div style={txt(42)}>总管汇总成一份结果</div>
        </Card>
      </Pop>
      <PiP f={f} at={cf(12) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const A3Sfx: SfxCue[] = [
  ['pop', cf(12), 0.3],
  ['pop', cf(15), 0.3],
  ['paper', cf(16), 0.3],
  ['snip', cw(16, '拆成'), 0.4],
  ['whoosh', cf(17) + 6, 0.35],
  ['whoosh', cw(19, '要点'), 0.3],
  ['ding', cf(20), 0.4],
];

/* ---------- A4 好处一：同时干，更快 ---------- */
export const A4Fast: React.FC<{f: number}> = ({f}) => {
  const runAt = cf(23);
  const solo = prog(f, runAt, 120);
  const par = prog(f, runAt, 40, easeOut);
  return (
    <>
      <Pop f={f} at={cf(21)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          好处一：<span style={{color: C.yellow}}>快</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(22)} x={60} y={160} enter="left">
        <Card w={960} h={200} bg="#E6E1D6">
          <div style={txt(38)}>一个人：一件一件来</div>
          <div style={{display: 'flex', gap: 8, marginTop: 20}}>
            {Array.from({length: 6}, (_, k) => (
              <div key={k} style={{width: 140, height: 50, boxSizing: 'border-box', border: `4px solid ${C.ink}`, borderRadius: 10, background: solo * 6 > k ? C.orange : C.white}} />
            ))}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(23)} x={60} y={400} enter="left">
        <Card w={960} h={300} bg={C.tealLight}>
          <div style={txt(38)}>三个帮手：同时干</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16}}>
              <div style={{...txt(28), width: 100}}>帮手 {i + 1}</div>
              {[0, 1].map((k) => (
                <div key={k} style={{width: 140, height: 44, boxSizing: 'border-box', border: `4px solid ${C.ink}`, borderRadius: 10, background: par * 2 > k ? C.teal : C.white}} />
              ))}
              {par >= 1 && i === 0 && <div style={{marginLeft: 10}}><Check size={50} /></div>}
            </div>
          ))}
        </Card>
      </Pop>
      {f >= runAt + 40 && (
        <div style={{position: 'absolute', left: 640, top: 520, transform: 'rotate(-6deg)', opacity: prog(f, runAt + 40, 6)}}>
          <div style={bigText(64, C.red)}>先做完！</div>
        </div>
      )}
      {f >= runAt && (
        <div style={{position: 'absolute', left: 60, top: 740, opacity: prog(f, runAt, 6)}}>
          <Stopwatch size={120} p={prog(f, runAt, 60)} />
        </div>
      )}
      <Pop f={f} at={cf(24)} x={200} y={770} rot={-2}>
        <Note color={C.panel} size={36}>不用排队，示意</Note>
      </Pop>
      <PiP f={f} at={cf(21) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const A4Sfx: SfxCue[] = [
  ['pop', cf(21), 0.35],
  ['paper', cf(22), 0.3],
  ['paper', cf(23), 0.3],
  ['ding', cf(23) + 40, 0.4],
  ['pop', cf(24), 0.3],
];

/* ---------- A5 好处二：每个帮手一张桌子，总管桌面一直干净 ---------- */
const DESKS = [60, 390, 720];

export const A5Desks: React.FC<{f: number}> = ({f}) => {
  const pileAt = cf(29);
  const sendAt = cf(31);
  const send = prog(f, sendAt + 6, 20, easeInOut);
  const cleanAt = cf(32);
  return (
    <>
      <Pop f={f} at={cf(25)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          好处二：<span style={{color: C.yellow}}>总管桌面干净</span>
        </div>
      </Pop>
      <Pop f={f} at={cw(27, '办公桌')} x={60} y={130} rot={-2}>
        <Note color={C.panel} size={36}>上下文 = AI 的办公桌</Note>
      </Pop>
      {DESKS.map((x, i) => {
        const at = cf(28) + i * 5;
        return f >= at ? (
          <div key={x} style={{position: 'absolute', left: x, top: 210, opacity: prog(f, at, 6)}}>
            <div style={{position: 'relative', width: 290, height: 260, overflow: 'hidden'}}>
              {Array.from({length: 5}, (_, k) => (
                <div key={k} style={{position: 'absolute', left: 30 + (k % 3) * 60 + (k > 2 ? 30 : 0), top: 130 - Math.floor(k / 3) * 46 - (k % 2) * 6, opacity: prog(f, pileAt + k * 4 + i * 2, 5), transform: `rotate(${(k - 2) * 7}deg)`}}>
                  <PlainFile name="" size={58} color={['#FCE3A8', '#CFE3FF', C.pink][k % 3]} />
                </div>
              ))}
              <div style={{position: 'absolute', left: 0, top: 200}}>
                <Desk w={280} />
              </div>
              <div style={{position: 'absolute', left: 50, top: 0}}>
                <Tag t={`帮手 ${i + 1} 的桌子`} size={26} />
              </div>
            </div>
          </div>
        ) : null;
      })}
      {f >= sendAt &&
        DESKS.map((x, i) => (
          <div key={x} style={{position: 'absolute', left: lerp(x + 100, 360 + i * 130, send), top: lerp(330, 640, send)}}>
            <Tag t="结论" color={C.tealLight} size={30} />
          </div>
        ))}
      <Pop f={f} at={cf(30)} x={560} y={490} rot={3}>
        <Note color={C.pink} size={32}>翻出来的资料都堆在这</Note>
      </Pop>
      {f >= sendAt && (
        <div style={{position: 'absolute', left: 320, top: 690, width: 470, height: 150, overflow: 'hidden', opacity: prog(f, sendAt, 8)}}>
          <Desk w={460} />
        </div>
      )}
      <Char f={f} x={200} y={840} s={1.0} kind="bot" eyes={f >= cleanAt ? 'star' : 'open'} lookX={0.6} opacity={prog(f, sendAt, 8)} />
      {f >= sendAt && (
        <div style={{position: 'absolute', left: 120, top: 580, opacity: prog(f, sendAt, 6)}}>
          <Tag t="总管" color={C.yellow} size={30} />
        </div>
      )}
      {f >= cleanAt + 20 && (
        <div style={{position: 'absolute', left: 250, top: 560, opacity: prog(f, cleanAt + 20, 6)}}>
          <Bulb size={80} glow={0.6 + 0.4 * Math.abs(Math.sin(f * 0.2))} />
        </div>
      )}
      <FocusLines f={f} at={cleanAt} out={cleanAt + 30} x={540} y={900} />
      <Pop f={f} at={cleanAt} x={340} y={860} rot={-3}>
        <div style={{...bigText(60, C.yellow), transform: `translateX(${jolt(f, cleanAt, 8, 12)}px)`}}>桌面一直很干净</div>
      </Pop>
      <PiP f={f} at={cf(25) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const A5Sfx: SfxCue[] = [
  ['pop', cf(25), 0.35],
  ['pop', cw(27, '办公桌'), 0.3],
  ...DESKS.map((_, i) => ['paper', cf(28) + i * 5, 0.25] as SfxCue),
  ['paper', cf(29), 0.3],
  ['whoosh', cf(31) + 6, 0.35],
  ['magic', cf(32), 0.4],
  ['ding', cf(32) + 20, 0.3],
];
