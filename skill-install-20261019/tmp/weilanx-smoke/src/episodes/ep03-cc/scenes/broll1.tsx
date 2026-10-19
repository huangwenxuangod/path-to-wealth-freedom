import React from 'react';
import {easeInOut, easeOutBack, keyframes, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote} from '../../../library/fx';
import {FONT_CODE} from '../../../library/fonts';
import {Stamp, ToolIcon, VideoFile} from '../../../library/icons';
import {bigText, Card, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';
import {CUES, ce, cf, cw} from '../cues';
import {Code, FilmStrip, PhoneVideo, Wave, Win, type Tok} from '../../../library/items/apps';
import {PiP} from '../../../library/sets/Studio';

const Note: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.white, size = 40}) => (
  <div style={{...txt(size), display: 'inline-block', background: color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px', boxShadow: '4px 5px 0 rgba(43,35,32,0.14)'}}>{children}</div>
);

/* ---------- B1 前两期回顾：真实成片 ---------- */
export const B1Recap: React.FC<{f: number}> = ({f}) => {
  const at = cf(4) - 6;
  return (
    <>
      <Pop f={f} at={at} x={300} y={40} rot={-4} enter="up">
        <PhoneVideo src="footage/ep01-agent.mp4" at={at} startFrom={2560} w={290} />
      </Pop>
      <Pop f={f} at={at + 6} x={680} y={40} rot={3} enter="up">
        <PhoneVideo src="footage/ep02-llm.mp4" at={at + 6} startFrom={740} w={290} />
      </Pop>
      <Pop f={f} at={at + 10} x={410} y={-30} rot={-6}>
        <Note color={C.yellow} size={34}>上一期 · Agent</Note>
      </Pop>
      <Pop f={f} at={at + 14} x={800} y={-30} rot={5}>
        <Note color={C.yellow} size={34}>上上期 · 大模型</Note>
      </Pop>
      {[
        {t: '橙色小人', at: cw(5, '橙色小人')},
        {t: '弹出来的卡片', at: cw(5, '卡片')},
        {t: '背景音乐 + 音效 ♪', at: cf(6)},
      ].map((x, i) => (
        <Pop key={x.t} f={f} at={x.at} x={1100} y={80 + i * 130} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={80} height={40}>
              <path d="M76 20 H10 M26 6 L8 20 L26 34" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Note>{x.t}</Note>
          </div>
        </Pop>
      ))}
      <div style={{position: 'absolute', left: 1100, top: 500, transform: `scale(${f >= cw(7, 'CC') ? 1 : 0}) rotate(-6deg)`}}>
        <Stamp text="全部是 CC 写代码做的" size={54} />
      </div>
      <Burst f={f} at={cw(7, 'CC') + 2} x={1330} y={540} r={260} n={14} />
      <PiP f={f} at={at} wear={['headphones']} />
    </>
  );
};
export const B1Sfx: SfxCue[] = [
  ['whoosh', cf(4) - 6, 0.35],
  ['pop', cw(5, '橙色小人'), 0.35],
  ['pop', cw(5, '卡片'), 0.35],
  ['pop', cf(6), 0.35],
  ['stamp', cw(7, 'CC'), 0.55],
];

/* ---------- B2 Remotion：告诉它第几帧，它算出画面 ---------- */
const CODE: Tok[][] = [
  [['const ', '#F2A0B4'], ['f', '#9FE3D2'], [' = useCurrentFrame();', '#E6E1CF'], ['  // 第几帧', '#7E8A96']],
  [['const ', '#F2A0B4'], ['p', '#9FE3D2'], [' = prog(f, 20, 20);', '#E6E1CF'], ['   // 0 → 1', '#7E8A96']],
  [],
  [['<Card ', '#F2C230'], ['scale', '#9FE3D2'], ['={p} />', '#E6E1CF']],
  [['<Buddy ', '#F2C230'], ['x', '#9FE3D2'], ['={100 + f * 5} />', '#E6E1CF']],
];
const CODE_LEN = CODE.flat().reduce((s, [t]) => s + t.length, 0);

export const B2Frames: React.FC<{f: number}> = ({f}) => {
  const typed = Math.floor(lerp(0, CODE_LEN, prog(f, cf(12), ce(14) - cf(12))));
  const lf = f >= cf(15) ? (f - cf(15)) % 100 : 0; // 预览里的「第几帧」
  const p = prog(lf, 20, 20, easeOutBack);
  const bx = 100 + lf * 5;
  return (
    <>
      <Pop f={f} at={cf(13)} x={960} y={20} center>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={bigText(78, C.teal)}>Remotion</div>
          <div style={{opacity: prog(f, cw(14, '网页'), 8)}}>
            <Note color={C.yellow}>把视频当成网页来写</Note>
          </div>
        </div>
      </Pop>
      <Pop f={f} at={cf(12) - 4} x={60} y={110} enter="left">
        <Win w={860} h={430} title="Scene.tsx" dark bodyStyle={{padding: '20px 26px'}}>
          <Code lines={CODE} typed={typed} f={f} size={34} />
        </Win>
      </Pop>
      <Pop f={f} at={cf(12) + 4} x={960} y={110} enter="right">
        <Win w={660} h={430} title="预览" bodyStyle={{background: '#FBF8F1'}}>
          <div style={{position: 'absolute', left: 250, top: 50, width: 160, height: 110, transform: `scale(${p})`, transformOrigin: 'center'}}>
            <Card w={160} h={110} bg={C.yellow} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={txt(34)}>卡片</div>
            </Card>
          </div>
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <Char f={f} x={bx} y={350} s={0.6} walk={lf > 0} lookX={1} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 355, height: 4, background: C.line}} />
        </Win>
      </Pop>
      {/* 帧号计数器 */}
      <Pop f={f} at={cf(15)} x={1370} y={575}>
        <div style={{...bigText(64, C.white), fontVariantNumeric: 'tabular-nums'}}>第 {String(lf).padStart(2, '0')} 帧</div>
      </Pop>
      <Pop f={f} at={cf(17)} x={960} y={580} enter="up">
        <Note color="#BFE7DF" size={36}>卡片大小 = {p.toFixed(2)}</Note>
      </Pop>
      <Pop f={f} at={cf(18)} x={960} y={675} enter="up">
        <Note color="#FFF3B8" size={36}>小人位置 x = {bx}</Note>
      </Pop>
      <PiP f={f} at={cf(11) - 6} skin="chef" />
    </>
  );
};
export const B2Sfx: SfxCue[] = [
  ['whoosh', cf(12) - 4, 0.3],
  ['type', cf(12), 0.25],
  ['type', cf(13) + 10, 0.25],
  ['pop', cf(13), 0.45],
  ['click', cf(15), 0.35],
  ['pop', cf(17), 0.35],
  ['pop', cf(18), 0.35],
];

/* ---------- B3 导出：浏览器逐帧截图 → MP4 ---------- */
export const B3Render: React.FC<{f: number}> = ({f}) => {
  const shots = Math.max(0, Math.min(8, Math.floor((f - cf(21)) / 5) + 1));
  const flash = f >= cf(21) && (f - cf(21)) % 5 < 2 && shots < 8 ? 0.6 : 0;
  const eqAt = cw(24, '做动画');
  return (
    <>
      <Pop f={f} at={cf(20)} x={60} y={60} enter="left">
        <div style={{position: 'relative'}}>
          <Win w={440} h={330} title="浏览器" bodyStyle={{background: '#FBF8F1'}}>
            <div style={{position: 'absolute', left: 0, top: 0}}>
              <Char f={f} x={120 + (f % 60) * 3} y={240} s={0.55} walk lookX={1} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: C.white, opacity: flash}} />
          </Win>
        </div>
      </Pop>
      <Pop f={f} at={cf(20) + 6} x={180} y={410}>
        <Note size={34}>一帧一帧截图</Note>
      </Pop>
      {shots > 0 && (
        <div style={{position: 'absolute', left: 560, top: 150}}>
          <FilmStrip n={shots} cell={96} render={(i) => (
            <div style={{position: 'absolute', left: 0, top: 0}}>
              <Char f={i * 7} x={20 + i * 8} y={52} s={0.2} />
            </div>
          )} />
        </div>
      )}
      <Pop f={f} at={cf(22)} x={1420} y={60}>
        <div style={{textAlign: 'center'}}>
          <VideoFile name="" size={180} tint="#FFD9A8" />
          <div style={bigText(80, C.yellow)}>MP4</div>
        </div>
      </Pop>
      <svg width={1920} height={820} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M1340 230 Q1380 200 1410 220" pathLength={1} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - prog(f, cf(22) - 6, 10)} />
      </svg>
      <Pop f={f} at={cf(23)} x={220} y={560} enter="up">
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={txt(56)}>对 CC 来说：</div>
          <div style={{opacity: prog(f, eqAt, 8), display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={bigText(96, C.white)}>做动画</div>
            <div style={bigText(96, C.yellow)}>=</div>
            <div style={bigText(96, C.teal)}>写代码</div>
          </div>
        </div>
      </Pop>
      <Burst f={f} at={eqAt + 6} x={960} y={620} r={320} n={16} />
      <PiP f={f} at={cf(19) - 6} skin="cowboy" />
    </>
  );
};
export const B3Sfx: SfxCue[] = [
  ['pop', cf(20), 0.35],
  ...Array.from({length: 8}, (_, i) => ['click', cf(21) + i * 5, 0.3] as SfxCue),
  ['whoosh', cf(22) - 6, 0.3],
  ['pop', cf(22), 0.45],
  ['stamp', cw(24, '做动画'), 0.45],
  ['magic', cw(24, '做动画') + 6, 0.3],
];

/* ---------- B4 口播 + SRT → 时间表 ---------- */
const srtTime = (s: number) => {
  const ms = Math.round(s * 1000);
  return `00:00:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const SAMPLE = CUES.slice(0, 3);

export const B4Srt: React.FC<{f: number}> = ({f}) => {
  const wp = prog(f, cf(27), ce(28) - cf(27));
  const hi = prog(f, cw(31, '开始'), 12);
  const rows = SAMPLE.map((c) => ({text: c.text, frame: Math.round(c.start * 30)}));
  return (
    <>
      <Pop f={f} at={cf(27) - 4} x={60} y={30} enter="left">
        <Win w={820} h={200} title="口播.wav" bodyStyle={{display: 'flex', alignItems: 'center', padding: '0 20px'}}>
          <Wave w={770} h={100} n={110} seed={4} progress={wp} />
        </Win>
      </Pop>
      <Pop f={f} at={cf(28)} x={620} y={0} rot={4}>
        <Note color="#BFE7DF" size={34}>纯人声</Note>
      </Pop>
      <Pop f={f} at={cf(29)} x={60} y={270} enter="left">
        <Win w={820} h={480} title="字幕.srt" bodyStyle={{padding: '18px 28px', fontFamily: FONT_CODE, fontSize: 30, lineHeight: 1.35}}>
          {SAMPLE.map((c) => (
            <div key={c.i} style={{marginBottom: 14, opacity: prog(f, cf(29) + c.i * 6, 8)}}>
              <div style={{color: C.inkSoft}}>{c.i}</div>
              <div>
                <Marker p={hi}>{srtTime(c.start)}</Marker> --&gt; <Marker p={hi} color="#F7CFD6">{srtTime(c.end)}</Marker>
              </div>
              <div style={txt(32)}>{c.text}</div>
            </div>
          ))}
        </Win>
      </Pop>
      <Pop f={f} at={cf(30)} x={400} y={230} rot={-3}>
        <Note color={C.yellow} size={32}>每一句都有开始和结束时间</Note>
      </Pop>
      {/* CC 读进来 → 时间表 */}
      <svg width={1920} height={820} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M900 480 Q950 400 1000 420" pathLength={1} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - prog(f, cf(32), 12)} />
      </svg>
      {f >= cf(32) && (
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <Char f={f} x={960} y={760} s={0.6} eyes="wide" skin="detective" lookX={-1} />
        </div>
      )}
      <Pop f={f} at={cf(33)} x={1040} y={60} enter="right">
        <Win w={600} h={500} title="时间表" bodyStyle={{padding: '18px 26px'}}>
          <div style={{...txt(32, C.inkSoft), display: 'flex', justifyContent: 'space-between', borderBottom: `3px dashed ${C.line}`, paddingBottom: 8}}>
            <span>第几句</span>
            <span>从第几帧开始</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{...txt(38), display: 'flex', justifyContent: 'space-between', marginTop: 20, opacity: prog(f, cf(33) + 6 + i * 6, 8)}}>
              <span>第 {i + 1} 句</span>
              <span style={{color: C.teal}}>第 {r.frame} 帧</span>
            </div>
          ))}
          <div style={{...txt(34, C.inkSoft), marginTop: 20, opacity: prog(f, cf(33) + 26, 8)}}>… 一共 {CUES.length} 句</div>
        </Win>
      </Pop>
      <PiP f={f} at={cf(27) - 6} skin="detective" />
    </>
  );
};
export const B4Sfx: SfxCue[] = [
  ['whoosh', cf(27) - 4, 0.3],
  ['pop', cf(28), 0.35],
  ['paper', cf(29), 0.4],
  ['click', cw(31, '开始'), 0.35],
  ['whoosh', cf(32), 0.3],
  ['pop', cf(33), 0.4],
  ['type', cf(33) + 6, 0.25],
];

/* ---------- B5 把动画钉在词上 + 重录自动对齐 ---------- */
const BLOCKS = [
  {t: '比如口播说到', w: 1.0},
  {t: '读取文件', w: 0.8, key: true},
  {t: '的那一刻', w: 0.7},
  {t: '卡片就刚好', w: 0.9},
  {t: '弹出来', w: 0.7},
];

export const B5Pin: React.FC<{f: number}> = ({f}) => {
  const stretch = keyframes(f, [[cf(39), 1], [cf(40), 1.28]], easeInOut);
  const unit = 250 * stretch;
  let x = 80;
  const blocks = BLOCKS.map((b) => {
    const r = {...b, x, w: b.w * unit};
    x += b.w * unit + 12;
    return r;
  });
  const key = blocks[1];
  const pinDrop = prog(f, cf(35), 12, easeOutBack);
  const pop = f >= cw(37, '弹出来');
  return (
    <>
      <Pop f={f} at={cf(34) - 4} x={40} y={320} enter="up">
        <div style={{width: 1600, height: 330, position: 'relative'}}>
          {/* 字幕块 */}
          {blocks.map((b) => (
            <div key={b.t} style={{position: 'absolute', left: b.x, top: 30, width: b.w, height: 80, boxSizing: 'border-box', border: `4px solid ${C.ink}`, borderRadius: 12, background: b.key && f >= cf(36) ? C.yellow : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(36)}}>
              {b.t}
            </div>
          ))}
          {/* 人声波形 */}
          <div style={{position: 'absolute', left: 80, top: 140, width: x - 80, height: 110, border: `4px solid ${C.teal}`, borderRadius: 12, background: C.tealLight, overflow: 'hidden', boxSizing: 'border-box'}}>
            <Wave w={x - 88} h={100} n={120} seed={9} stretch={stretch} />
          </div>
          {/* 播放头 */}
          <div style={{position: 'absolute', left: 80 + ((f - cf(34)) * 6) % (x - 80), top: 10, width: 4, height: 260, background: C.red}} />
        </div>
      </Pop>
      {/* 钉在「读取文件」上的动画卡片 */}
      <div style={{position: 'absolute', left: 40 + key.x + key.w / 2 - 160, top: lerp(-120, 40, pinDrop), opacity: pinDrop}}>
        <Card w={320} h={190} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${pop ? 1 + Math.sin(prog(f, cw(37, '弹出来'), 10) * Math.PI) * 0.15 : 0.9})`}}>
          <ToolIcon kind="readFile" size={90} />
          <div style={txt(44)}>读取文件</div>
        </Card>
        <svg width={320} height={120} style={{position: 'absolute', left: 0, top: 185}}>
          <line x1="160" y1="0" x2="160" y2="110" stroke={C.red} strokeWidth={6} strokeDasharray="10 8" />
          <circle cx="160" cy="112" r="12" fill={C.red} stroke={C.ink} strokeWidth={3} />
        </svg>
      </div>
      <Burst f={f} at={cw(37, '弹出来')} x={40 + key.x + key.w / 2} y={130} r={200} />
      <Pop f={f} at={cf(38)} x={1180} y={40} rot={3}>
        <Note color="#FFD9D6" size={36}>重录了口播，节奏变慢？</Note>
      </Pop>
      <Pop f={f} at={cw(40, '自动')} x={1180} y={150} rot={-2}>
        <Note color="#BFE7DF" size={36}>✓ 动画自动跟着走</Note>
      </Pop>
      <Pop f={f} at={cf(39)} x={1180} y={690}>
        <div style={txt(34, C.inkSoft)}>换一份字幕 → 重新导出</div>
      </Pop>
      <Emote f={f} at={cf(36) + 4} kind="!" x={40 + key.x + key.w / 2} y={320} />
      <PiP f={f} at={cf(34) - 6} skin="santa" />
    </>
  );
};
export const B5Sfx: SfxCue[] = [
  ['whoosh', cf(34) - 4, 0.3],
  ['boing', cf(35) + 6, 0.3],
  ['click', cf(36), 0.4],
  ['pop', cw(37, '弹出来'), 0.55],
  ['pop', cf(38), 0.35],
  ['whoosh', cf(39), 0.3],
  ['ding', cw(40, '自动'), 0.35],
];

