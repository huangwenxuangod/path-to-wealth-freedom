import React from 'react';
import {easeInOut, easeOut, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, Emote, FocusLines} from '../../../library/fx';
import {Bulb, Cross, Stamp, stampScale} from '../../../library/icons';
import {Stopwatch, Wave, Win} from '../../../library/items/apps';
import {Block, Magnifier, Plant, Scenery} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, jolt, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- M6 声音也切成小段；在它眼里都是同一种积木，同一个脑子理解 ---------- */
const SEGS = 8;
const MIX: ('t' | 'p' | 's')[] = ['t', 'p', 's', 't', 'p', 's', 't', 'p', 's'];
const MIX_TEXT = ['文', '字', '积'];
const REPLY = '今晚可以做番茄炒蛋，再炒个醋溜白菜。';

const SoundBlock: React.FC<{seed: number}> = ({seed}) => (
  <div style={{width: 84, height: 84, boxSizing: 'border-box', background: '#FCD9BF', border: `4px solid ${C.ink}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '3px 4px 0 rgba(43,35,32,0.15)'}}>
    <Wave w={60} h={50} n={8} seed={seed} color={C.orange} />
  </div>
);
const PicBlock: React.FC<{k: number}> = ({k}) => (
  <div style={{width: 84, height: 84, boxSizing: 'border-box', border: `4px solid ${C.ink}`, borderRadius: 16, overflow: 'hidden', boxShadow: '3px 4px 0 rgba(43,35,32,0.15)'}}>
    <Scenery size={76} view={[(k % 3) * 120, Math.floor(k / 3) * 120, 120, 120]} />
  </div>
);

export const M6Sound: React.FC<{f: number}> = ({f}) => {
  const cutAt = cw(25, '切成');
  const cut = prog(f, cutAt, 14, easeInOut);
  const mixAt = cf(26);
  const sameAt = cw(27, '同一种');
  const brainAt = cf(28);
  const replyAt = cf(29);
  const typed = Math.max(0, Math.floor((f - replyAt) / 2));
  return (
    <>
      <Pop f={f} at={cf(25)} x={60} y={30} enter="up">
        <Card w={960} h={190} bg={C.white}>
          <div style={txt(40)}>声音</div>
          <div style={{position: 'relative', marginTop: 8}}>
            <Wave w={900} h={90} n={90} seed={9} color={C.orange} dim="#FCD9BF" />
            <svg width={900} height={90} style={{position: 'absolute', left: 0, top: 0}}>
              {Array.from({length: SEGS - 1}, (_, k) => (
                <line key={k} x1={((k + 1) * 900) / SEGS} y1={-6} x2={((k + 1) * 900) / SEGS} y2={-6 + 102 * prog(cut, k / SEGS / 2, 0.4)} stroke={C.ink} strokeWidth={5} strokeDasharray="10 6" />
              ))}
            </svg>
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cutAt + 10} x={640} y={40} rot={3}>
        <Note color={C.yellow} size={36}>切成一小段一小段</Note>
      </Pop>
      <div style={{position: 'absolute', left: 60, top: 270, display: 'flex', gap: 20}}>
        {MIX.map((m, k) => {
          const at = mixAt + k * 4;
          return (
            <div key={k} style={{opacity: prog(f, at, 5), transform: `translateY(${(1 - prog(f, at, 8, easeOut)) * -50}px)`}}>
              {m === 't' ? <Block text={MIX_TEXT[k / 3]} size={84} /> : m === 'p' ? <PicBlock k={k + 1} /> : <SoundBlock seed={k * 7} />}
            </div>
          );
        })}
      </div>
      <Pop f={f} at={mixAt + 4} x={60} y={390}>
        <div style={{display: 'flex', gap: 14}}>
          {[
            {t: '文字', c: C.white},
            {t: '图片', c: '#BFE3F2'},
            {t: '声音', c: '#FCD9BF'},
          ].map((x) => (
            <div key={x.t} style={{...txt(30), background: x.c, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '0 12px'}}>{x.t}</div>
          ))}
        </div>
      </Pop>
      <Pop f={f} at={sameAt} x={420} y={380} rot={-2}>
        <div style={bigText(64, C.yellow)}>都是同一种东西</div>
      </Pop>
      <Char f={f} x={240} y={830} s={1.3} kind="bot" eyes={f >= brainAt ? 'star' : 'open'} lookX={0.5} opacity={prog(f, brainAt - 10, 8)} />
      {f >= brainAt && (
        <div style={{position: 'absolute', left: 185, top: 470, opacity: prog(f, brainAt, 6)}}>
          <Bulb size={110} glow={0.6 + 0.4 * Math.abs(Math.sin(f * 0.2))} />
        </div>
      )}
      <Pop f={f} at={cw(28, '同一个')} x={60} y={860} rot={-2}>
        <Note color={C.tealLight} size={40}>同一个脑子一起理解</Note>
      </Pop>
      <Pop f={f} at={replyAt} x={460} y={520} enter="up">
        <Card w={560} h={220} bg={C.white}>
          <div style={txt(30, C.inkSoft)}>它的回答</div>
          <div style={{...txt(42), whiteSpace: 'normal', lineHeight: 1.4, marginTop: 8}}>
            {REPLY.slice(0, typed)}
            {typed < REPLY.length && <span style={{display: 'inline-block', width: 6, height: 40, marginLeft: 4, verticalAlign: 'middle', background: C.ink, opacity: Math.floor(f / 6) % 2}} />}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={replyAt + 12} x={460} y={760} rot={2}>
        <Note color={C.panel} size={34}>一个字一个字接着答</Note>
      </Pop>
      <PiP f={f} at={cf(25) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const M6Sfx: SfxCue[] = [
  ['paper', cf(25), 0.3],
  ['snip', cw(25, '切成'), 0.4],
  ...MIX.map((_, k) => ['click', cf(26) + k * 4, 0.2] as SfxCue),
  ['magic', cw(27, '同一种'), 0.4],
  ['ding', cf(28), 0.4],
  ['type', cf(29), 0.35],
];

/* ---------- M7 过渡：知道这一点，用 AI 更省事，三个用法 ---------- */
const USES = ['截图', '拍照', '核对'];

export const M7Uses: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(32);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(30)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={44}>知道了这一点</Note>
      </Pop>
      <Pop f={f} at={cf(31)} x={20} y={90} rot={-2}>
        <div style={bigText(100, C.yellow)}>用 AI 更省事</div>
      </Pop>
      {USES.map((t, i) => (
        <Pop key={t} f={f} at={listAt + 8 + i * 6} x={i * 270} y={250} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 22px 4px 8px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
            <div style={{...txt(32, C.white), width: 48, height: 48, borderRadius: 24, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={txt(48)}>{t}</div>
          </div>
        </Pop>
      ))}
    </HostTall>
  );
};
export const M7Sfx: SfxCue[] = [
  ['pop', cf(30), 0.3],
  ['pop', cf(31), 0.35],
  ...USES.map((_, i) => ['click', cf(32) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- M8 用法一：能截图就别打字 ---------- */
const ERR = ['Error: Cannot find module ./config', '    at require (node:internal)', 'npm ERR! code 1'];
const TYPED = '有个红色的报错，好像是找不到什么……';

export const M8Shot: React.FC<{f: number}> = ({f}) => {
  const shotAt = cf(36);
  const flash = f >= shotAt ? Math.max(0, 1 - (f - shotAt) / 8) : 0;
  const bracket = prog(f, shotAt, 10, easeOut);
  const typeAt = cf(37);
  const typed = Math.max(0, Math.floor((f - typeAt) / 2));
  const lossAt = cw(38, '漏掉');
  return (
    <>
      <Pop f={f} at={cf(33)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          能<span style={{color: C.yellow}}>截图</span>就别打字
        </div>
      </Pop>
      <Pop f={f} at={cw(34, '报错')} x={60} y={140} enter="up">
        <div style={{position: 'relative'}}>
          <Win w={960} h={220} title="终端" dark>
            <div style={{padding: '18px 26px'}}>
              {ERR.map((l, i) => (
                <div key={l} style={{...txt(34, i === 1 ? '#C9C2B6' : '#FF8A8A'), opacity: prog(f, cw(34, '报错') + 4 + i * 4, 4)}}>{l}</div>
              ))}
            </div>
          </Win>
          {f >= shotAt && (
            <svg width={1000} height={260} style={{position: 'absolute', left: -20, top: -20, overflow: 'visible', transform: `scale(${1.08 - 0.08 * bracket})`, opacity: bracket}}>
              {[[0, 0, 1, 1], [1000, 0, -1, 1], [0, 260, 1, -1], [1000, 260, -1, -1]].map(([x, y, sx, sy], i) => (
                <path key={i} d={`M${x} ${y + sy * 50} L${x} ${y} L${x + sx * 50} ${y}`} stroke={C.teal} strokeWidth={10} fill="none" strokeLinecap="round" />
              ))}
            </svg>
          )}
          <div style={{position: 'absolute', inset: 0, background: C.white, opacity: flash}} />
        </div>
      </Pop>
      <Pop f={f} at={cw(35, '表格')} x={60} y={400} enter="up">
        <Card w={560} h={210} bg={C.white}>
          <div style={txt(30, C.inkSoft)}>看不懂的表格（示意）</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 10}}>
            {Array.from({length: 15}, (_, i) => (
              <div key={i} style={{...txt(24, C.inkSoft), background: i < 5 ? '#E6E1D6' : C.panel, border: `2px solid ${C.line}`, textAlign: 'center'}}>{i < 5 ? '···' : Math.floor(rand(i * 3) * 900 + 100)}</div>
            ))}
          </div>
        </Card>
      </Pop>
      {f >= shotAt && (
        <div style={{position: 'absolute', left: 660, top: 440, transform: `scale(${stampScale(f, shotAt + 6)}) rotate(-8deg)`}}>
          <Stamp text="截图发给它" size={50} color={C.teal} />
        </div>
      )}
      <Pop f={f} at={typeAt} x={60} y={650} enter="up">
        <div style={{position: 'relative', transform: `translateX(${jolt(f, lossAt, 12, 14)}px)`}}>
          <Card w={740} h={170} bg="#E6E1D6">
            <div style={txt(30, C.inkSoft)}>换成打字描述</div>
            <div style={{...txt(40), marginTop: 10}}>{TYPED.slice(0, typed)}</div>
          </Card>
          {f >= lossAt && (
            <div style={{position: 'absolute', right: -10, top: 130, transform: `scale(${stampScale(f, lossAt)}) rotate(-8deg)`}}>
              <Stamp text="漏掉关键信息" size={46} />
            </div>
          )}
        </div>
      </Pop>
      <PiP f={f} at={cf(33) - 6} skin="cowboy" eyes={f >= lossAt ? 'flat' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const M8Sfx: SfxCue[] = [
  ['pop', cf(33), 0.35],
  ['error', cw(34, '报错'), 0.3],
  ['paper', cw(35, '表格'), 0.3],
  ['click', cf(36), 0.45],
  ['stamp', cf(36) + 6, 0.4],
  ['type', cf(37), 0.3],
  ['stamp', cw(38, '漏掉'), 0.45],
];

/* ---------- M9 用法二：拍下现实里的东西直接问 ---------- */
const Polaroid: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
  <div style={{width: 290, height: 320, boxSizing: 'border-box', background: C.white, border: `4px solid ${C.ink}`, padding: 12, boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))', display: 'flex', flexDirection: 'column'}}>
    <div style={{flex: 1, background: '#EFF6F2', border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{children}</div>
    <div style={{...txt(36), textAlign: 'center', marginTop: 8}}>{label}</div>
  </div>
);
const Manual: React.FC = () => (
  <div style={{width: 150, height: 180, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 8, padding: 12, boxSizing: 'border-box', transform: 'rotate(-4deg)'}}>
    <div style={txt(26)}>说明书</div>
    {[90, 70, 85, 60, 75].map((w, i) => <div key={i} style={{height: 8, width: `${w}%`, background: '#D8D0C2', borderRadius: 4, marginTop: 10}} />)}
  </div>
);
const Menu: React.FC = () => (
  <div style={{width: 170, height: 190, background: '#3A3230', border: `4px solid ${C.ink}`, borderRadius: 8, padding: '10px 14px', boxSizing: 'border-box', transform: 'rotate(3deg)'}}>
    <div style={{...txt(30, C.yellow), textAlign: 'center'}}>MENU</div>
    {['Pasta', 'Risotto', 'Tiramisu'].map((t) => <div key={t} style={{...txt(24, C.white), marginTop: 8}}>{t}</div>)}
  </div>
);
const SNAPS = [
  {t: '说明书', el: <Manual />, at: () => cw(40, '说明书')},
  {t: '外文菜单', el: <Menu />, at: () => cw(40, '外文菜单')},
  {t: '路边的植物', el: <Plant size={180} />, at: () => cf(41)},
];

export const M9Photo: React.FC<{f: number}> = ({f}) => {
  const askAt = cf(42);
  const fastAt = cf(43);
  return (
    <>
      <Pop f={f} at={cf(39)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          拍下来<span style={{color: C.yellow}}>直接问</span>
        </div>
      </Pop>
      {SNAPS.map((s, i) => {
        const at = s.at();
        const flash = f >= at + 4 ? Math.max(0, 1 - (f - at - 4) / 8) : 0;
        return (
          <Pop key={s.t} f={f} at={at} x={60 + i * 325} y={150} rot={[-3, 2, -1][i]} enter="drop">
            <div style={{position: 'relative'}}>
              <Polaroid label={s.t}>{s.el}</Polaroid>
              <div style={{position: 'absolute', inset: 0, background: C.white, opacity: flash}} />
            </div>
          </Pop>
        );
      })}
      <Pop f={f} at={askAt} x={60} y={510} enter="up">
        <Win w={960} h={260} title="发给 AI">
          <div style={{padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16}}>
            <Bubble me text="这是什么？该怎么用？" size={40} />
            {f >= askAt + 16 && (
              <div style={{opacity: prog(f, askAt + 16, 6)}}>
                <Bubble text="它是……，用法是……（示例）" size={40} />
              </div>
            )}
          </div>
        </Win>
      </Pop>
      {f >= fastAt && (
        <div style={{position: 'absolute', left: 60, top: 820, opacity: prog(f, fastAt, 6)}}>
          <Stopwatch size={130} p={prog(f, fastAt, 30)} />
        </div>
      )}
      <FocusLines f={f} at={fastAt + 4} out={fastAt + 30} x={440} y={900} />
      <Pop f={f} at={fastAt + 4} x={210} y={840} rot={-3}>
        <div style={bigText(80, C.yellow)}>比自己搜快多了</div>
      </Pop>
      <PiP f={f} at={cf(39) - 6} skin="chef" eyes={f >= fastAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const M9Sfx: SfxCue[] = [
  ['pop', cf(39), 0.35],
  ...SNAPS.map((s) => ['click', s.at() + 4, 0.35] as SfxCue),
  ['type', cf(42), 0.3],
  ['ding', cf(42) + 16, 0.35],
  ['magic', cf(43) + 4, 0.4],
];

/* ---------- M10 用法三：图要清楚，关键信息要核对 ---------- */
const DOTS = [[30, 30], [80, 24], [130, 36], [52, 74], [104, 70], [150, 80], [78, 116]];

export const M10Check: React.FC<{f: number}> = ({f}) => {
  const tinyAt = cw(46, '小的字');
  const numAt = cw(46, '数字');
  const countAt = cw(47, '数清楚');
  const cropAt = cf(48);
  const crop = prog(f, cropAt + 6, 16, easeInOut);
  const lookAt = cf(49);
  const scan = prog(f, lookAt, 30, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(44)} x={60} y={30}>
        <div style={bigText(72, C.white)}>
          图要清楚，<span style={{color: C.yellow}}>关键要核对</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(45)} x={60} y={130} rot={-2}>
        <Note color={C.pink} size={40}>它看图也会看错</Note>
      </Pop>
      <Emote f={f} at={cf(45) + 4} kind="sweat" x={420} y={130} />
      {[
        {t: '很小的字', at: tinyAt},
        {t: '密密麻麻的数字', at: numAt},
        {t: '数有几个', at: countAt},
      ].map((c, i) => (
        <Pop key={c.t} f={f} at={c.at} x={60 + i * 325} y={220}>
          <Card w={290} h={260} bg={C.white}>
            <div style={{height: 170, position: 'relative', overflow: 'hidden'}}>
              {i === 0 && (
                <div style={{filter: 'blur(1.2px)'}}>
                  {Array.from({length: 9}, (_, k) => (
                    <div key={k} style={{height: 6, width: `${60 + rand(k) * 40}%`, background: '#9A9186', borderRadius: 3, marginTop: 11}} />
                  ))}
                </div>
              )}
              {i === 1 && (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2}}>
                  {Array.from({length: 36}, (_, k) => (
                    <div key={k} style={{...txt(20, C.inkSoft), textAlign: 'center'}}>{Math.floor(rand(k * 5 + 1) * 90 + 10)}</div>
                  ))}
                </div>
              )}
              {i === 2 && (
                <>
                  <svg width={240} height={150}>
                    {DOTS.map(([x, y], k) => <circle key={k} cx={x + 20} cy={y + 10} r={20} fill={C.red} stroke={C.ink} strokeWidth={3} />)}
                  </svg>
                  <div style={{position: 'absolute', right: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 4}}>
                    <Bubble text="6 个？" size={30} color={C.yellow} />
                    {f >= countAt + 10 && <Cross size={40} p={prog(f, countAt + 10, 8)} />}
                  </div>
                </>
              )}
            </div>
            <div style={{...txt(32), textAlign: 'center'}}>{c.t}</div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={cropAt} x={60} y={520} enter="up">
        <div style={{position: 'relative'}}>
          <Card w={740} h={300} bg="#FFFDF7">
            <div style={txt(28, C.inkSoft)}>一整张截图（示意）</div>
            {[92, 80, 86, 70, 90].map((w, i) => <div key={i} style={{height: 14, width: `${w}%`, background: '#E4DED2', borderRadius: 7, marginTop: 18}} />)}
          </Card>
          <div style={{position: 'absolute', left: 290, top: 110, width: 280, height: 90, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(44)}>
              合计 <Marker p={prog(f, lookAt + 20, 10)}>1,280</Marker>
            </div>
          </div>
          {f >= cropAt + 6 && (
            <div style={{position: 'absolute', left: lerp(0, 276, crop), top: lerp(0, 96, crop), width: lerp(740, 308, crop), height: lerp(300, 118, crop), border: `6px dashed ${C.teal}`, borderRadius: 12}} />
          )}
          {f >= cropAt + 16 && (
            <div style={{position: 'absolute', left: 300, top: 230, transform: 'rotate(2deg)', opacity: prog(f, cropAt + 16, 6)}}>
              <Note color={C.tealLight} size={36}>只截这一块</Note>
            </div>
          )}
          {f >= lookAt && f < lookAt + 44 && (
            <div style={{position: 'absolute', left: lerp(200, 440, scan), top: lerp(40, 70, scan)}}>
              <Magnifier size={150} />
            </div>
          )}
        </div>
      </Pop>
      <Burst f={f} at={lookAt + 22} x={480} y={680} r={200} />
      <Pop f={f} at={lookAt + 10} x={60} y={860} rot={-3}>
        <div style={bigText(76, C.yellow)}>数字自己再看一眼</div>
      </Pop>
      <PiP f={f} at={cf(44) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const M10Sfx: SfxCue[] = [
  ['pop', cf(44), 0.35],
  ['boing', cf(45), 0.3],
  ['pop', cw(46, '小的字'), 0.3],
  ['pop', cw(46, '数字'), 0.3],
  ['pop', cw(47, '数清楚'), 0.3],
  ['error', cw(47, '数清楚') + 10, 0.35],
  ['paper', cf(48), 0.3],
  ['snip', cf(48) + 6, 0.35],
  ['whoosh', cf(49), 0.3],
  ['ding', cf(49) + 22, 0.4],
];

/* ---------- M11 结尾 ---------- */
export const M11Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(51);
  return (
    <>
      <HostTall f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(50)} x={0} y={20}>
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
export const M11Sfx: SfxCue[] = [
  ['pop', cf(50), 0.4],
  ['confetti', cf(51), 0.5],
  ['ding', cf(51) + 2, 0.3],
];
