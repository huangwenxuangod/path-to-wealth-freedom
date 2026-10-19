import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, FocusLines} from '../../../library/fx';
import {Check, Cross, Folder, Stamp, stampScale, Toggle} from '../../../library/icons';
import {Stopwatch} from '../../../library/items/apps';
import {Magnifier} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {LabeledKey} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/** 小锁 */
const Lock: React.FC<{size?: number; open?: number}> = ({size = 50, open = 0}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 50 60" style={{overflow: 'visible'}}>
    <path d={`M14 ${28 - open * 10} V18 Q14 6 25 6 Q36 6 36 18 V28`} fill="none" stroke={C.ink} strokeWidth={6} transform={`translate(${open * 10} 0)`} />
    <rect x="6" y="26" width="38" height="30" rx="6" fill={C.yellow} stroke={C.ink} strokeWidth={4} />
  </svg>
);

/* ---------- B6 过渡：三个建议 ---------- */
const TIPS = ['先给最少的钥匙', '危险操作先问你', '重要的东西先备份'];

export const B6Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(35);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(34)} x={0} y={0} rot={-2}>
        <div style={bigText(84, C.yellow)}>怎么用才放心？</div>
      </Pop>
      {TIPS.map((t, i) => (
        <Pop key={t} f={f} at={listAt + 6 + i * 6} x={i * 40} y={130 + i * 72} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(44)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const B6Sfx: SfxCue[] = [
  ['question', cf(34), 0.35],
  ...TIPS.map((_, i) => ['click', cf(35) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- B7 建议一：先给最少的钥匙，只读起步，摸清楚再放开 ---------- */
export const B7Least: React.FC<{f: number}> = ({f}) => {
  const lockAt = cf(36) + 12;
  const readAt = cw(38, '只读');
  const trust = prog(f, cf(40), 30, easeOut);
  const openAt = cf(41);
  return (
    <>
      <Pop f={f} at={cf(36)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          先给<span style={{color: C.yellow}}>最少的钥匙</span>
        </div>
      </Pop>
      {[0, 1, 2, 3].map((i) => {
        const off = f >= lockAt && !(i === 0 || (i === 1 && f >= openAt));
        return (
          <Pop key={i} f={f} at={cf(36) + 4 + i * 3} x={60 + (i % 2) * 400} y={150 + Math.floor(i / 2) * 100}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <LabeledKey i={i} size={120} off={off} />
              {f >= lockAt && i > 0 && <Lock size={44} open={i === 1 ? prog(f, openAt, 10) : 0} />}
            </div>
          </Pop>
        );
      })}
      <Pop f={f} at={readAt} x={60} y={380} enter="up">
        <Card w={740} h={210} bg={C.white}>
          <div style={txt(40)}>只读模式：让它先看不改</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 50, marginTop: 24}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={txt(36)}>能看</div>
              <Toggle on={1} size={90} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={txt(36)}>能改</div>
              <Toggle on={prog(f, openAt, 8, easeInOut)} size={90} />
            </div>
          </div>
        </Card>
      </Pop>
      <Char f={f} x={190} y={880} s={0.9} kind="bot" eyes="open" lookX={0.6} opacity={prog(f, cf(39), 8)} />
      {f >= cf(39) && f < openAt && (
        <div style={{position: 'absolute', left: 230 + Math.sin(f * 0.15) * 20, top: 660}}>
          <Magnifier size={110} />
        </div>
      )}
      <Pop f={f} at={cf(40)} x={360} y={640}>
        <div>
          <div style={txt(34)}>摸清楚它靠不靠谱</div>
          <div style={{width: 420, height: 40, marginTop: 10, border: `4px solid ${C.ink}`, borderRadius: 20, overflow: 'hidden', background: C.panel}}>
            <div style={{width: `${trust * 100}%`, height: '100%', background: C.teal}} />
          </div>
        </div>
      </Pop>
      <Burst f={f} at={openAt + 4} x={500} y={280} r={180} />
      <Pop f={f} at={openAt + 6} x={360} y={780} rot={-3}>
        <div style={bigText(64, C.yellow)}>再慢慢放开</div>
      </Pop>
      <PiP f={f} at={cf(36) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const B7Sfx: SfxCue[] = [
  ['pop', cf(36), 0.35],
  ['click', cf(36) + 12, 0.35],
  ['paper', cw(38, '只读'), 0.3],
  ['click', cf(40), 0.25],
  ['ding', cf(41), 0.4],
  ['magic', cf(41) + 6, 0.3],
];

/* ---------- B8 建议二：危险操作每次都要确认，别全部自动同意，点之前看清楚 ---------- */
const DANGER = [
  {t: '删除文件', w: '删除'},
  {t: '付款', w: '付款'},
  {t: '发消息', w: '发消息'},
  {t: '改线上数据', w: '改线上'},
];

export const B8Ask: React.FC<{f: number}> = ({f}) => {
  const lockAt = cf(44) + 6;
  const autoAt = cf(45);
  const autoOff = prog(f, autoAt + 10, 8, easeInOut);
  const lookAt = cf(46);
  const scan = prog(f, lookAt + 6, 40, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(42)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          危险操作<span style={{color: C.red}}>先问你</span>
        </div>
      </Pop>
      {DANGER.map((d, i) => (
        <Pop key={d.t} f={f} at={cw(43, d.w)} x={60 + (i % 2) * 480} y={150 + Math.floor(i / 2) * 100}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{...txt(42), background: '#FFD9D6', border: `4px solid ${C.red}`, borderRadius: 14, padding: '4px 22px'}}>{d.t}</div>
            {f >= lockAt + i * 3 && (
              <div style={{display: 'flex', alignItems: 'center', gap: 6, opacity: prog(f, lockAt + i * 3, 6)}}>
                <Lock size={40} />
                <div style={txt(28, C.orangeDark)}>每次确认</div>
              </div>
            )}
          </div>
        </Pop>
      ))}
      <Pop f={f} at={autoAt} x={60} y={380} enter="left">
        <div style={{position: 'relative'}}>
          <Card w={740} h={110} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
            <div style={{...txt(40), flex: 1}}>全部自动同意</div>
            <Toggle on={1 - autoOff} size={100} />
          </Card>
          {f >= autoAt + 16 && <div style={{position: 'absolute', right: -20, top: -20}}><Cross size={70} p={prog(f, autoAt + 16, 8)} /></div>}
        </div>
      </Pop>
      <Pop f={f} at={autoAt + 18} x={820} y={400} rot={4}>
        <Note color={C.pink} size={28}>别图省事</Note>
      </Pop>
      <Pop f={f} at={lookAt} x={60} y={540} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={740} h={190} bg="#FFFDF7">
            <div style={txt(30, C.inkSoft)}>Agent 想要执行（示例）</div>
            <div style={{...txt(42), marginTop: 12}}>
              给<Marker p={prog(f, lookAt + 30, 10)} color={C.pink}>全部联系人</Marker>群发一条消息
            </div>
          </Card>
          {f >= lookAt + 6 && f < lookAt + 50 && (
            <div style={{position: 'absolute', left: lerp(20, 520, scan), top: 40}}>
              <Magnifier size={130} />
            </div>
          )}
        </div>
      </Pop>
      {f >= cw(47, '两秒') && (
        <div style={{position: 'absolute', left: 60, top: 770, opacity: prog(f, cw(47, '两秒'), 6)}}>
          <Stopwatch size={110} p={prog(f, cw(47, '两秒'), 60)} />
        </div>
      )}
      <Pop f={f} at={cw(47, '两秒') + 4} x={190} y={790} rot={-3}>
        <div style={bigText(64, C.yellow)}>花两秒看清楚</div>
      </Pop>
      <PiP f={f} at={cf(42) - 6} skin="cowboy" {...PIP_TALL} />
    </>
  );
};
export const B8Sfx: SfxCue[] = [
  ['pop', cf(42), 0.35],
  ...DANGER.map((d) => ['click', cw(43, d.w), 0.25] as SfxCue),
  ['stamp', cf(44) + 6, 0.35],
  ['click', cf(45) + 10, 0.35],
  ['error', cf(45) + 16, 0.3],
  ['paper', cf(46), 0.3],
  ['whoosh', cf(46) + 6, 0.25],
  ['ding', cw(47, '两秒') + 4, 0.35],
];

/* ---------- B9 建议三：先备份，在副本上动手，改坏了随时退回 ---------- */
export const B9Backup: React.FC<{f: number}> = ({f}) => {
  const copyAt = cw(49, '副本');
  const copy = prog(f, copyAt - 6, 14, easeOut);
  const verAt = cf(50);
  const brokeAt = cf(51) + 6; // 句尾才说到「改坏」，提前到句首附近
  const backAt = cf(52) - 16;
  const back = prog(f, backAt, 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(48)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          重要的东西<span style={{color: C.yellow}}>先备份</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(48) + 8} x={60} y={150}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Folder name="" size={150} />
          <div style={txt(36)}>原件</div>
        </div>
      </Pop>
      {f >= copyAt - 6 && (
        <div style={{position: 'absolute', left: lerp(60, 440, copy), top: 150, transform: `translateX(${jolt(f, brokeAt, 12, 14)}px)`}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative'}}>
            <Folder name="" size={150} color={f >= brokeAt ? '#E8A07A' : '#FCE3A8'} />
            <div style={txt(36)}>副本</div>
            {f >= brokeAt && (
              <div style={{position: 'absolute', left: 10, top: 30, transform: `scale(${stampScale(f, brokeAt)}) rotate(-12deg)`}}>
                <Stamp text="改坏了" size={44} />
              </div>
            )}
          </div>
        </div>
      )}
      <Char f={f} x={780} y={330} s={0.7} kind="bot" eyes={f >= brokeAt ? 'spiral' : 'happy'} lookX={-0.6} walk={f >= copyAt && f < brokeAt} opacity={prog(f, copyAt, 8)} />
      <Pop f={f} at={copyAt + 8} x={700} y={350} rot={3}>
        <Note color={C.tealLight} size={28}>只在副本上动手</Note>
      </Pop>
      <Pop f={f} at={verAt} x={60} y={450} enter="up">
        <Card w={740} h={190} bg={C.white}>
          <div style={txt(34, C.inkSoft)}>先存一个版本</div>
          <div style={{position: 'relative', height: 90, marginTop: 10}}>
            <div style={{position: 'absolute', left: 40, right: 40, top: 40, height: 8, background: C.line, borderRadius: 4}} />
            {['版本 1', '版本 2', '现在'].map((t, i) => {
              const bad = i === 2 && f >= brokeAt;
              const here = i === 0 && back >= 1;
              return (
                <div key={t} style={{position: 'absolute', left: 20 + i * 290, top: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: prog(f, verAt + i * 6, 6)}}>
                  <div style={{width: 60, height: 60, borderRadius: 30, background: bad ? C.red : here ? '#3DAA6B' : C.white, border: `4px solid ${C.ink}`}} />
                  <div style={{...txt(28), marginTop: 4}}>{t}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </Pop>
      {f >= backAt && (
        <svg width={740} height={120} style={{position: 'absolute', left: 60, top: 640, overflow: 'visible'}}>
          <path d="M650 20 Q360 110 70 20" pathLength={1} fill="none" stroke={C.teal} strokeWidth={10} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - back} />
          {back >= 1 && <path d="M70 20 L100 6 M70 20 L96 44" stroke={C.teal} strokeWidth={10} strokeLinecap="round" />}
        </svg>
      )}
      <FocusLines f={f} at={backAt + 16} out={backAt + 40} x={400} y={840} />
      <Pop f={f} at={backAt + 16} x={60} y={790} rot={-3}>
        <div style={bigText(76, C.yellow)}>随时退回去</div>
      </Pop>
      {f >= backAt + 22 && <div style={{position: 'absolute', left: 520, top: 790}}><Check size={80} p={prog(f, backAt + 22, 8)} /></div>}
      <PiP f={f} at={cf(48) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const B9Sfx: SfxCue[] = [
  ['pop', cf(48), 0.35],
  ['paper', cw(49, '副本') - 6, 0.35],
  ['click', cf(50), 0.3],
  ['error', cf(51) + 6, 0.4],
  ['stamp', cf(51) + 8, 0.35],
  ['whoosh', cf(52) - 16, 0.4],
  ['ding', cf(52) + 6, 0.4],
];

/* ---------- B10 结尾 ---------- */
export const B10Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(54);
  return (
    <>
      <HostTall f={f} skin="detective" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(53)} x={0} y={20}>
          <div style={bigText(100, C.white)}>本期就到这里</div>
        </Pop>
        <Pop f={f} at={byeAt} x={40} y={160} rot={-4}>
          <div style={bigText(160, C.yellow)}>下期再见！</div>
        </Pop>
      </HostTall>
      <div style={{position: 'absolute', left: 0, top: -120, width: 1080, height: 1440, pointerEvents: 'none', opacity: prog(f, byeAt, 6, easeOut)}}>
        <Confetti t={f - byeAt} w={1080} h={1440} n={100} />
      </div>
    </>
  );
};
export const B10Sfx: SfxCue[] = [
  ['pop', cf(53), 0.4],
  ['confetti', cf(54), 0.5],
  ['ding', cf(54) + 2, 0.3],
];
