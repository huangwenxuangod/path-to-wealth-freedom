import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote, FocusLines} from '../../../library/fx';
import {Check, Cross} from '../../../library/icons';
import {Wave, Win} from '../../../library/items/apps';
import {Block, Fridge, Scenery} from '../../../library/items/objects';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

export const Bubble: React.FC<{text: string; me?: boolean; color?: string; size?: number}> = ({text, me, color, size = 38}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start'}}>
    <div style={{...txt(size), background: color ?? (me ? C.pink : C.white), border: `4px solid ${C.ink}`, borderRadius: 18, padding: '8px 18px', whiteSpace: 'normal', lineHeight: 1.35}}>{text}</div>
  </div>
);

/** 一盘菜：盘子加几团颜色 */
const Dish: React.FC<{colors: string[]; size?: number}> = ({colors, size = 130}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70">
    <ellipse cx="50" cy="42" rx="46" ry="24" fill={C.white} stroke={C.ink} strokeWidth={3.5} />
    <ellipse cx="50" cy="40" rx="32" ry="15" fill="#F4EFE4" />
    {colors.map((c, i) => (
      <circle key={i} cx={34 + (i % 3) * 16} cy={34 + Math.floor(i / 3) * 10 - (i % 2) * 4} r={9} fill={c} stroke={C.ink} strokeWidth={2.5} />
    ))}
  </svg>
);

/* ---------- M1 钩子：拍一张冰箱照片，它认出食材、给出菜谱 ---------- */
const FW = 330; // 冰箱显示宽度
const FS = FW / 300;
const FOODS = [
  {k: 'tomato' as const, t: '番茄 × 2', at: () => cw(2, '番茄'), box: [30, 76, 125, 80]},
  {k: 'cabbage' as const, t: '白菜 半颗', at: () => cw(3, '白菜'), box: [140, 176, 125, 104]},
  {k: 'eggs' as const, t: '鸡蛋 一盒', at: () => cw(3, '鸡蛋'), box: [52, 300, 196, 80]},
];
const DISHES = [
  {t: '番茄炒蛋', c: [C.red, C.yellow, C.red, C.yellow, C.red], at: () => cw(4, '番茄炒蛋')},
  {t: '醋溜白菜', c: ['#BFE39A', '#F4F9E4', '#BFE39A', '#8CC06A'], at: () => cw(5, '醋溜')},
];

export const M1Fridge: React.FC<{f: number}> = ({f}) => {
  const shotAt = cf(1) + 20;
  const flash = f >= shotAt ? Math.max(0, 1 - (f - shotAt) / 8) : 0;
  return (
    <>
      <Pop f={f} at={cf(1)} x={60} y={20} enter="up">
        <Win w={960} h={560} title="发给 AI">
          <div style={{position: 'relative', height: '100%'}}>
            <div style={{position: 'absolute', left: 30, top: 24, transform: 'rotate(-2deg)', background: C.white, border: `4px solid ${C.ink}`, padding: 10, boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
              <Fridge w={FW} />
              {FOODS.map((x) => {
                const at = x.at();
                if (f < at) return null;
                const [bx, by, bw, bh] = x.box;
                return (
                  <div key={x.k} style={{position: 'absolute', left: 10 + bx * FS, top: 10 + by * FS, width: bw * FS, height: bh * FS, border: `4px dashed ${C.teal}`, borderRadius: 10, opacity: prog(f, at, 6)}}>
                    <div style={{...txt(22, C.white), position: 'absolute', left: -4, top: -30, background: C.teal, borderRadius: 6, padding: '0 8px'}}>{x.t.split(' ')[0]}</div>
                  </div>
                );
              })}
              <div style={{position: 'absolute', inset: 0, background: C.white, opacity: flash}} />
            </div>
            <div style={{position: 'absolute', left: 430, top: 30, width: 490, display: 'flex', flexDirection: 'column', gap: 14}}>
              {f >= cf(2) && <Bubble text="我看到了：" />}
              {FOODS.map((x) =>
                f >= x.at() ? (
                  <div key={x.k} style={{...txt(40), opacity: prog(f, x.at(), 6), display: 'flex', alignItems: 'center', gap: 12}}>
                    <Check size={40} />
                    {x.t}
                  </div>
                ) : null,
              )}
              {f >= cf(4) && <Bubble text="今晚可以做：" color={C.tealLight} />}
            </div>
          </div>
        </Win>
      </Pop>
      {DISHES.map((d, i) => (
        <Pop key={d.t} f={f} at={d.at()} x={60 + i * 490} y={610} enter="up">
          <Card w={440} h={200} pad={0} bg="#FFFDF7" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px'}}>
            <Dish colors={d.c} size={150} />
            <div style={bigText(56, C.yellow)}>{d.t}</div>
          </Card>
        </Pop>
      ))}
      <Burst f={f} at={DISHES[0].at() + 2} x={280} y={710} r={200} />
      <PiP f={f} at={0} wear={['headphones']} eyes={f >= cf(4) ? 'star' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const M1Sfx: SfxCue[] = [
  ['paper', cf(1), 0.3],
  ['click', cf(1) + 20, 0.4],
  ...FOODS.map((x) => ['pop', x.at(), 0.3] as SfxCue),
  ['ding', cw(4, '番茄炒蛋'), 0.4],
  ['ding', cw(5, '醋溜'), 0.35],
];

/* ---------- M2 它不是只会文字接龙吗，怎么看懂照片的 ---------- */
const CHAIN = ['今天', '天气', '真', '不错'];

export const M2Question: React.FC<{f: number}> = ({f}) => {
  const chainAt = cw(7, '文字');
  const photoAt = cf(8) + 4; // 「照片」在句尾，挂在句首，免得刚出来就切场景
  return (
    <>
      <Pop f={f} at={cf(6)} x={60} y={30}>
        <Note color={C.panel} size={44}>我们之前说过</Note>
      </Pop>
      <div style={{position: 'absolute', left: 60, top: 130, display: 'flex', gap: 14}}>
        {CHAIN.map((t, i) => (
          <div key={t} style={{opacity: prog(f, chainAt + i * 5, 5), transform: `translateY(${(1 - prog(f, chainAt + i * 5, 8, easeOut)) * -40}px)`}}>
            <Block text={t} size={80} color={i === CHAIN.length - 1 ? C.yellow : C.white} />
          </div>
        ))}
      </div>
      <Pop f={f} at={cw(7, '接龙')} x={60} y={240} rot={-2}>
        <Note color={C.yellow} size={42}>靠文字接龙的高手</Note>
      </Pop>
      <Char f={f} x={280} y={760} s={1.4} kind="bot" eyes={f >= photoAt ? 'wide' : 'happy'} lookX={0.5} opacity={prog(f, cf(6), 8)} />
      <Emote f={f} at={photoAt + 2} kind="?" x={300} y={440} dur={60} />
      <Pop f={f} at={cf(8) - 16} x={580} y={330} rot={6} enter="drop">
        <div style={{background: C.white, border: `4px solid ${C.ink}`, padding: '10px 10px 40px', boxShadow: 'var(--hard-shadow, 4px 5px 0 rgba(43,35,32,0.14))'}}>
          <Fridge w={220} />
        </div>
      </Pop>
      <FocusLines f={f} at={photoAt} out={photoAt + 30} x={420} y={880} />
      <Pop f={f} at={photoAt} x={60} y={820} rot={-3}>
        <div style={bigText(84, C.red)}>它怎么看懂照片？</div>
      </Pop>
      <PiP f={f} at={cf(6) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const M2Sfx: SfxCue[] = [
  ['pop', cf(6), 0.3],
  ...CHAIN.map((_, i) => ['click', cw(7, '文字') + i * 5, 0.25] as SfxCue),
  ['whoosh', cf(8) - 16, 0.35],
  ['question', cf(8) + 4, 0.4],
];

/* ---------- M3 这叫多模态 ---------- */
export const M3Name: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(10, '多模态');
  return (
    <HostTall f={f} skin="cowboy" eyes={f >= nameAt ? 'star' : 'open'} armsUp={f >= nameAt && f < nameAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(9)} x={0} y={0} rot={-2}>
        <Note color={C.panel} size={42}>这背后的本事，有个专门的名字</Note>
      </Pop>
      <FocusLines f={f} at={nameAt} out={nameAt + 40} x={480} y={190} />
      <Pop f={f} at={nameAt} x={40} y={80} rot={-3}>
        <div style={bigText(170, C.yellow)}>多模态</div>
      </Pop>
      <Burst f={f} at={nameAt + 4} x={300} y={170} r={300} n={16} />
      <Pop f={f} at={nameAt + 8} x={200} y={270} rot={2}>
        <div style={bigText(80, C.white)}>Multimodal</div>
      </Pop>
    </HostTall>
  );
};
export const M3Sfx: SfxCue[] = [
  ['pop', cf(9), 0.3],
  ['magic', cw(10, '多模态'), 0.5],
  ['pop', cw(10, '多模态') + 8, 0.3],
];

/* ---------- M4 模态 = 信息的形式；以前只会读字，现在都接得住 ---------- */
const PlayIcon: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90">
    <rect x={4} y={4} width={112} height={82} rx={14} fill="#8E8FE8" stroke={C.ink} strokeWidth={4} />
    <path d="M48 26 L80 45 L48 64 Z" fill={C.white} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
const TextIcon: React.FC = () => (
  <div style={{width: 150, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10}}>
    <div style={txt(44)}>Aa 文</div>
    {[90, 70].map((w) => <div key={w} style={{height: 12, width: `${w}%`, background: '#D8D0C2', borderRadius: 6}} />)}
  </div>
);
const MODES = [
  {t: '文字', icon: <TextIcon />, at: () => cf(12)},
  {t: '图片', icon: <div style={{border: `4px solid ${C.ink}`}}><Scenery size={96} /></div>, at: () => cw(13, '图片')},
  {t: '声音', icon: <Wave w={160} h={90} n={26} seed={4} color={C.orange} />, at: () => cw(13, '声音')},
  {t: '视频', icon: <PlayIcon size={130} />, at: () => cw(13, '视频')},
];

const ModeChip: React.FC<{t: string; on: boolean; p: number}> = ({t, on, p}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: p}}>
    <div style={{...txt(32, on ? C.ink : C.inkSoft), background: on ? C.tealLight : '#E6E1D6', border: `3px solid ${on ? C.ink : C.inkSoft}`, borderRadius: 10, padding: '0 14px'}}>{t}</div>
    {on ? <Check size={36} /> : <Cross size={30} width={7} />}
  </div>
);

export const M4Modes: React.FC<{f: number}> = ({f}) => {
  const oldAt = cf(14);
  const newAt = cf(15);
  const allAt = cf(18);
  return (
    <>
      <Pop f={f} at={cf(11)} x={60} y={30}>
        <div style={bigText(80, C.white)}>
          模态 = <span style={{color: C.yellow}}>信息的形式</span>
        </div>
      </Pop>
      {MODES.map((m, i) => (
        <Pop key={m.t} f={f} at={m.at()} x={60 + i * 245} y={150}>
          <Card w={220} h={220} pad={0} bg={C.white} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <div style={{height: 110, display: 'flex', alignItems: 'center'}}>{m.icon}</div>
            <div style={txt(44)}>{m.t}</div>
          </Card>
        </Pop>
      ))}
      {[
        {title: '以前的 AI', x: 60, at: oldAt, on: [true, false, false, false], bg: '#E6E1D6'},
        {title: '多模态 AI', x: 540, at: newAt, on: [true, true, true, true], bg: C.tealLight},
      ].map((b, k) => (
        <Pop key={b.title} f={f} at={b.at} x={b.x} y={420} enter="up">
          <Card w={440} h={300} bg={b.bg}>
            <div style={txt(42)}>{b.title}</div>
            <div style={{position: 'absolute', left: 230, top: 80, display: 'flex', flexDirection: 'column', gap: 10}}>
              {MODES.map((m, i) => (
                <ModeChip key={m.t} t={m.t} on={b.on[i]} p={prog(f, b.at + 8 + i * 4 + (k ? cf(16) - newAt : 0), 6)} />
              ))}
            </div>
          </Card>
        </Pop>
      ))}
      {f >= oldAt && <Char f={f} x={170} y={700} s={0.75} kind="bot" eyes="flat" lookX={0.4} />}
      {f >= newAt && <Char f={f} x={650} y={700} s={0.75} kind="bot" eyes={f >= cf(16) ? 'star' : 'open'} lookX={0.4} />}
      {[
        {t: '照片', at: cw(17, '照片')},
        {t: '截图', at: cw(17, '截图')},
        {t: '说话', at: cf(18)},
      ].map((x, i) => (
        <Pop key={x.t} f={f} at={x.at} x={60 + i * 170} y={760} rot={i % 2 ? 3 : -3}>
          <Note color={C.yellow} size={40}>{x.t}</Note>
        </Pop>
      ))}
      <FocusLines f={f} at={allAt + 10} out={allAt + 40} x={400} y={900} />
      <Pop f={f} at={allAt + 10} x={60} y={860} rot={-3}>
        <div style={bigText(88, C.red)}>它都接得住！</div>
      </Pop>
      <PiP f={f} at={cf(11) - 6} skin="chef" {...PIP_TALL} />
    </>
  );
};
export const M4Sfx: SfxCue[] = [
  ['pop', cf(11), 0.35],
  ...MODES.map((m) => ['click', m.at(), 0.3] as SfxCue),
  ['paper', cf(14), 0.3],
  ['error', cf(14) + 16, 0.25],
  ['paper', cf(15), 0.3],
  ['ding', cf(16), 0.35],
  ['pop', cw(17, '照片'), 0.25],
  ['pop', cw(17, '截图'), 0.25],
  ['pop', cf(18), 0.25],
  ['magic', cf(18) + 10, 0.4],
];

/* ---------- M5 它把一张图切成小方块，每块变成积木 ---------- */
const WORDS = ['文字', '在', 'AI', '眼里'];
const PIC = {x: 60, y: 330, size: 360};
const CELL = PIC.size / 3;
const TILE = 90;

export const M5Tiles: React.FC<{f: number}> = ({f}) => {
  const cutAt = cw(23, '切成');
  const flyAt = cf(24);
  const blockAt = cw(24, '变成');
  const cut = prog(f, cutAt, 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(19)} x={60} y={30}>
        <div style={bigText(76, C.white)}>
          它怎么<span style={{color: C.yellow}}>看懂一张图</span>？
        </div>
      </Pop>
      <Pop f={f} at={cf(20)} x={60} y={150} rot={-2}>
        <Note color={C.panel} size={38}>还记得 token 吗</Note>
      </Pop>
      <div style={{position: 'absolute', left: 400, top: 140, display: 'flex', gap: 12}}>
        {WORDS.map((t, i) => (
          <div key={t} style={{opacity: prog(f, cf(21) + i * 5, 5), transform: `translateY(${(1 - prog(f, cf(21) + i * 5, 8, easeOut)) * -40}px)`}}>
            <Block text={t} size={70} />
          </div>
        ))}
      </div>
      <Pop f={f} at={cf(22)} x={60} y={250} rot={2}>
        <div style={bigText(60, C.yellow)}>图片也一样</div>
      </Pop>
      {f >= cf(23) && (
        <div style={{position: 'absolute', left: PIC.x, top: PIC.y, border: `5px solid ${C.ink}`, opacity: prog(f, cf(23), 6) * (1 - 0.7 * prog(f, flyAt, 12))}}>
          <Scenery size={PIC.size} />
          <svg width={PIC.size} height={PIC.size} style={{position: 'absolute', left: 0, top: 0}}>
            {[1, 2].map((k) => (
              <g key={k} stroke={C.ink} strokeWidth={5} strokeDasharray="14 8">
                <line x1={k * CELL} y1={0} x2={k * CELL} y2={PIC.size * cut} />
                <line x1={0} y1={k * CELL} x2={PIC.size * cut} y2={k * CELL} />
              </g>
            ))}
          </svg>
        </div>
      )}
      <Pop f={f} at={cutAt + 8} x={480} y={440} rot={-2}>
        <Note color={C.tealLight} size={40}>切成很多小方块</Note>
      </Pop>
      {f >= flyAt &&
        Array.from({length: 9}, (_, k) => {
          const i = Math.floor(k / 3);
          const j = k % 3;
          const p = prog(f, flyAt + k * 3, 14, easeInOut);
          const x = lerp(PIC.x + 5 + j * CELL, 60 + k * 104, p);
          const y = lerp(PIC.y + 5 + i * CELL, 720, p);
          const s = lerp(CELL, TILE, p);
          return (
            <div key={k} style={{position: 'absolute', left: x, top: y, width: s, height: s, border: `4px solid ${C.ink}`, borderRadius: 16 * p, overflow: 'hidden', boxShadow: '3px 4px 0 rgba(43,35,32,0.15)', background: C.white}}>
              <Scenery size={s} view={[j * CELL, i * CELL, CELL, CELL]} />
            </div>
          );
        })}
      <FocusLines f={f} at={blockAt} out={blockAt + 30} x={400} y={900} />
      <Pop f={f} at={blockAt} x={60} y={850} rot={-3}>
        <div style={bigText(80, C.yellow)}>每块都变成积木</div>
      </Pop>
      <PiP f={f} at={cf(19) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const M5Sfx: SfxCue[] = [
  ['question', cf(19), 0.35],
  ['pop', cf(20), 0.3],
  ...WORDS.map((_, i) => ['click', cf(21) + i * 5, 0.25] as SfxCue),
  ['pop', cf(22), 0.3],
  ['paper', cf(23), 0.3],
  ['snip', cw(23, '切成'), 0.4],
  ['whoosh', cf(24), 0.35],
  ['magic', cw(24, '变成'), 0.4],
];
