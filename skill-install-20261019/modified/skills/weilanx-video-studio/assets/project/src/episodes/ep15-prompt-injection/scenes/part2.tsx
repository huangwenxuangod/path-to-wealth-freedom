import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Burst, Confetti, FocusLines} from '../../../library/fx';
import {Check, Cross, PlainFile, StopSign, Toggle} from '../../../library/icons';
import {Cursor, Win} from '../../../library/items/apps';
import {Globe} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Chip} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- C6 过渡：三个建议 ---------- */
const TIPS = ['读陌生内容，别给大权限', '做了没让做的事，马上喊停', '敏感账号分开用'];

export const C6Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(35);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(34)} x={0} y={0} rot={-2}>
        <div style={bigText(84, C.yellow)}>平时怎么防？</div>
      </Pop>
      {TIPS.map((t, i) => (
        <Pop key={t} f={f} at={listAt + 6 + i * 6} x={i * 30} y={130 + i * 72} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(42)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const C6Sfx: SfxCue[] = [
  ['question', cf(34), 0.35],
  ...TIPS.map((_, i) => ['click', cf(35) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- C7 建议一：读来路不明的内容时，关掉发邮件、付款这些大权限 ---------- */
const POWERS = [
  {t: '读取内容', keep: true},
  {t: '发邮件', keep: false},
  {t: '付款', keep: false},
];

export const C7NoPower: React.FC<{f: number}> = ({f}) => {
  const offAt = cw(40, '关掉');
  return (
    <>
      <Pop f={f} at={cf(36)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          读陌生内容，<span style={{color: C.yellow}}>别给大权限</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(38)} x={60} y={140} enter="left">
        <Card w={960} h={200} pad={0} bg="#FFF3B8" style={{display: 'flex', alignItems: 'center', gap: 40, padding: '0 40px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <Globe size={110} t={f} />
            <div style={txt(32)}>陌生网页</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: prog(f, cf(39), 6)}}>
            <PlainFile name="" size={100} />
            <div style={txt(32)}>别人发来的文件</div>
          </div>
          <div style={{...bigText(54, C.red), marginLeft: 20, opacity: prog(f, cf(39) + 8, 6)}}>来路不明</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(37)} x={60} y={380} enter="up">
        <Card w={740} h={360} bg={C.white}>
          <div style={txt(36, C.inkSoft)}>这时候 Agent 的权限</div>
          {POWERS.map((p, i) => {
            const on = p.keep ? 1 : 1 - prog(f, offAt + i * 6, 8, easeInOut);
            return (
              <div key={p.t} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26}}>
                <div style={{...txt(44), width: 260}}>{p.t}</div>
                <Toggle on={on} size={110} />
                {p.keep ? f >= offAt + 18 && <Check size={50} /> : f >= offAt + i * 6 + 8 && <div style={txt(34, C.red)}>先关掉</div>}
              </div>
            );
          })}
        </Card>
      </Pop>
      <PiP f={f} at={cf(36) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const C7Sfx: SfxCue[] = [
  ['pop', cf(36), 0.35],
  ['paper', cf(37), 0.3],
  ['whoosh', cf(38), 0.3],
  ['click', cw(40, '关掉') + 6, 0.35],
  ['click', cw(40, '关掉') + 12, 0.35],
  ['ding', cw(40, '关掉') + 18, 0.35],
];

/* ---------- C8 建议二：它突然要做你没让做的事，马上拒绝 ---------- */
const WANTS = [
  {t: '发消息', at: () => cw(43, '发消息')},
  {t: '下载东西', at: () => cw(43, '下载')},
  {t: '登录账号', at: () => cf(44)},
];

export const C8Stop: React.FC<{f: number}> = ({f}) => {
  const noAt = cf(45);
  const click = prog(f, noAt - 12, 10, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          做了<span style={{color: C.red}}>没让做的事</span>，马上喊停
        </div>
      </Pop>
      <Pop f={f} at={cf(42)} x={60} y={140}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={txt(36, C.inkSoft)}>你只让它</div>
          <Chip t="总结网页" bg={C.tealLight} size={40} />
        </div>
      </Pop>
      <Pop f={f} at={WANTS[0].at() - 4} x={60} y={240} rot={-1}>
        <div style={txt(36, C.inkSoft)}>它却想</div>
      </Pop>
      {WANTS.map((w, i) => (
        <Pop key={w.t} f={f} at={w.at()} x={220 + i * 250} y={230}>
          <div style={{transform: `translateX(${jolt(f, w.at(), 8, 10)}px)`}}>
            <Chip t={w.t} bg="#FFD9D6" border={C.red} size={40} />
          </div>
        </Pop>
      ))}
      <Pop f={f} at={noAt - 20} x={60} y={360} enter="up">
        <Card w={740} h={260} bg="#FFFDF7">
          <div style={txt(30, C.inkSoft)}>Agent 请求</div>
          <div style={{...txt(42), marginTop: 12}}>登录你的邮箱账号</div>
          <div style={{display: 'flex', gap: 24, marginTop: 30}}>
            <div style={{...txt(38, C.white), background: f >= noAt ? '#B23A3E' : C.red, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 34px', transform: `scale(${f >= noAt && f < noAt + 6 ? 0.92 : 1})`}}>拒绝</div>
            <div style={{...txt(38), background: '#E6E1D6', border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 34px'}}>同意</div>
          </div>
        </Card>
      </Pop>
      {f >= noAt - 12 && f < noAt + 24 && (
        <div style={{position: 'absolute', left: lerp(560, 160, click), top: lerp(700, 560, click)}}>
          <Cursor size={60} down={f >= noAt && f < noAt + 6} />
        </div>
      )}
      {f >= noAt + 6 && (
        <div style={{position: 'absolute', left: 600, top: 640, transform: `scale(${prog(f, noAt + 6, 10, easeOut)}) rotate(-8deg)`}}>
          <StopSign size={190} label="停" />
        </div>
      )}
      <FocusLines f={f} at={noAt + 6} out={noAt + 30} x={420} y={840} />
      <Pop f={f} at={noAt + 8} x={60} y={800} rot={-3}>
        <div style={bigText(76, C.yellow)}>让它停下来</div>
      </Pop>
      <PiP f={f} at={cf(41) - 6} skin="cowboy" eyes={f >= WANTS[0].at() ? 'wide' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const C8Sfx: SfxCue[] = [
  ['pop', cf(41), 0.35],
  ['pop', cf(42), 0.3],
  ...WANTS.map((w) => ['error', w.at(), 0.25] as SfxCue),
  ['paper', cf(45) - 20, 0.3],
  ['click', cf(45), 0.45],
  ['stamp', cf(45) + 6, 0.4],
];

/* ---------- C9 建议三：敏感账号和日常用的 AI 分开 ---------- */
export const C9Separate: React.FC<{f: number}> = ({f}) => {
  const mixAt = cf(46) + 10;
  const crossAt = cf(47);
  const splitAt = cf(47) + 30; // 第 48 句离场景结束太近，提前分开
  const split = prog(f, splitAt, 14, easeOut);
  return (
    <>
      <Pop f={f} at={cf(46)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          敏感账号<span style={{color: C.yellow}}>分开用</span>
        </div>
      </Pop>
      <Pop f={f} at={mixAt} x={60} y={140} enter="up">
        <div style={{position: 'relative', transform: `translateY(${-split * 10}px)`}}>
          <Win w={960} h={230} title="同一个浏览器">
            <div style={{padding: '20px 26px', display: 'flex', gap: 16, flexWrap: 'wrap'}}>
              <Chip t="已登录：网银" bg="#FFD9D6" border={C.red} />
              <Chip t="已登录：工作邮箱" bg="#FFD9D6" border={C.red} />
              <Chip t="Agent 到处乱逛" bg="#FFF3B8" />
            </div>
          </Win>
          {f >= crossAt && <div style={{position: 'absolute', right: 30, top: 60}}><Cross size={110} p={prog(f, crossAt, 8)} /></div>}
        </div>
      </Pop>
      {f >= splitAt && (
        <div style={{position: 'absolute', left: 60, top: 420, opacity: split}}>
          <Card w={460} h={260} bg={C.tealLight}>
            <div style={txt(36)}>日常浏览器</div>
            <div style={{...txt(32, C.inkSoft), marginTop: 12}}>没登录敏感账号</div>
            <div style={{marginTop: 18}}>
              <Chip t="Agent 随便逛" bg={C.white} />
            </div>
          </Card>
        </div>
      )}
      {f >= splitAt && (
        <div style={{position: 'absolute', left: lerp(300, 560, split), top: 420, opacity: split}}>
          <Card w={460} h={260} bg="#FFF3B8">
            <div style={txt(36)}>敏感账号</div>
            <div style={{...txt(32, C.inkSoft), marginTop: 12}}>网银、工作邮箱</div>
            <div style={{marginTop: 18}}>
              <Chip t="自己单独用" bg={C.white} />
            </div>
          </Card>
        </div>
      )}
      <Burst f={f} at={splitAt + 10} x={540} y={540} r={240} />
      {f >= splitAt + 14 && <div style={{position: 'absolute', left: 440, top: 700}}><Check size={90} p={prog(f, splitAt + 14, 8)} /></div>}
      <PiP f={f} at={cf(46) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const C9Sfx: SfxCue[] = [
  ['pop', cf(46), 0.35],
  ['paper', cf(46) + 10, 0.3],
  ['error', cf(47), 0.35],
  ['whoosh', cf(47) + 30, 0.35],
  ['ding', cf(47) + 44, 0.4],
];

/* ---------- C10 结尾 ---------- */
export const C10Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(50);
  return (
    <>
      <HostTall f={f} skin="detective" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(49)} x={0} y={20}>
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
export const C10Sfx: SfxCue[] = [
  ['pop', cf(49), 0.4],
  ['confetti', cf(50), 0.5],
  ['ding', cf(50) + 2, 0.3],
];
