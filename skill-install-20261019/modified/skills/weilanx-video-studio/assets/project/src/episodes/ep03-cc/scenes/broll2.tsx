import React from 'react';
import {easeInOut, easeOut, keyframes, lerp, prog, rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote} from '../../../library/fx';
import {FONT_CN, FONT_CODE} from '../../../library/fonts';
import {Check, Folder, Stamp, ToolIcon, VideoFile} from '../../../library/icons';
import {Card, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';
import {ce, cf, cw} from '../cues';
import {Code, Cursor, Fader, GitHubMark, ScreenVideo, Stopwatch, Wave, Win, type Tok} from '../../../library/items/apps';
import {PiP} from '../../../library/sets/Studio';

const Note: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.white, size = 40}) => (
  <div style={{...txt(size), display: 'inline-block', background: color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 18px', boxShadow: '4px 5px 0 rgba(43,35,32,0.14)'}}>{children}</div>
);

const Opt: React.FC<{label: string; on: boolean}> = ({label, on}) => (
  <div style={{fontFamily: FONT_CN, fontSize: 32, color: on ? C.ink : '#C9D1D9', background: on ? C.yellow : 'transparent', border: `3px solid ${on ? C.ink : '#6A6F78'}`, borderRadius: 12, padding: '2px 18px'}}>{label}</div>
);

/* ---------- B6 打开 CC，发路径，它先问问题 ---------- */
const PROMPT: Tok[][] = [
  [['> ', '#F2C230'], ['帮我把这段口播做成手绘风的动画视频', '#E6E1CF']],
  [['  ~/Downloads/', '#7E8A96'], ['口播.wav', '#9FE3D2']],
  [['  ~/Downloads/', '#7E8A96'], ['字幕.srt', '#9FE3D2']],
];
const PROMPT_LEN = PROMPT.flat().reduce((s, [t]) => s + t.length, 0);
const QUESTIONS = [
  {q: '画幅', opts: ['横屏 16:9', '竖屏 9:16'], at: cf(51)},
  {q: '字幕', opts: ['烧录进画面', '不烧录'], at: cf(52)},
  {q: '交付', opts: ['只要成片', '成片 + 分轨'], at: cf(53)},
];

export const B6Terminal: React.FC<{f: number}> = ({f}) => {
  const typed = Math.floor(lerp(0, PROMPT_LEN, prog(f, cf(44), ce(45) - cf(44))));
  return (
    <>
      <Pop f={f} at={cf(43) - 4} x={60} y={20} enter="up">
        <Win w={1080} h={770} title="~/video — CC" dark bodyStyle={{padding: '22px 30px'}}>
          <div style={{fontFamily: FONT_CODE, fontSize: 30, color: '#F4B38A', marginBottom: 16}}>✻ Welcome to CC</div>
          <Code lines={PROMPT} typed={typed} f={f} size={34} />
          {f >= cw(47, '一起') && (
            <div style={{fontFamily: FONT_CODE, fontSize: 34, color: '#7E8A96', opacity: prog(f, cw(47, '一起'), 8)}}>
              {'  ~/Downloads/'}<span style={{color: '#F2A0B4'}}>参考视频.mp4</span>
            </div>
          )}
          {f >= cf(50) && (
            <div style={{marginTop: 26, opacity: prog(f, cf(50), 8)}}>
              <div style={{fontFamily: FONT_CN, fontSize: 36, color: '#F4B38A'}}>● 开始之前，先确认几个问题：</div>
              {QUESTIONS.map((q) => {
                if (f < q.at) return null;
                const picked = f >= q.at + 16;
                return (
                  <div key={q.q} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, opacity: prog(f, q.at, 8)}}>
                    <div style={{fontFamily: FONT_CN, fontSize: 34, color: '#E6E1CF', width: 90}}>{q.q}</div>
                    {q.opts.map((o, i) => <Opt key={o} label={o} on={picked && i === (q.q === '画幅' ? 0 : q.q === '字幕' ? 0 : 1)} />)}
                  </div>
                );
              })}
            </div>
          )}
        </Win>
      </Pop>
      <Pop f={f} at={cf(45)} x={1190} y={60} rot={3}>
        <Note color="#BFE7DF" size={34}>路径 + 想要的风格</Note>
      </Pop>
      <Pop f={f} at={cf(48)} x={1180} y={200} rot={-3}>
        <Card w={440} h={240} bg="#FFF3B8" style={{position: 'relative'}}>
          <div style={txt(34, C.inkSoft)}>我第一次：</div>
          <div style={{...txt(38), marginTop: 10}}>丢了一个参考视频</div>
          <div style={{...txt(38), marginTop: 6, opacity: prog(f, cf(49), 8)}}>「这个你能做吗？」</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(50) + 6} x={1200} y={500} rot={2}>
        <Note color={C.yellow} size={36}>它会先问清楚</Note>
      </Pop>
      <PiP f={f} at={cf(43) - 6} wear={['headphones']} />
    </>
  );
};
export const B6Sfx: SfxCue[] = [
  ['whoosh', cf(43) - 4, 0.3],
  ['type', cf(44), 0.3],
  ['type', cf(44) + 26, 0.3],
  ['type', cf(45), 0.3],
  ['pop', cw(47, '一起'), 0.35],
  ['paper', cf(48), 0.35],
  ['ding', cf(50), 0.3],
  ...QUESTIONS.flatMap((q) => [['pop', q.at, 0.35], ['click', q.at + 16, 0.45]] as SfxCue[]),
];

/* ---------- B7 分镜表 ---------- */
const BOARD: [string, string][] = [
  ['1–6', '聊天窗口，普通 AI 说个不停'],
  ['7–10', '灰色 AI 困在对话框，Agent 登场'],
  ['11–15', '什么是 Agent：聊天 → 操作电脑'],
  ['16–22', '桌面上三个「学习资料.mp4」'],
  ['25–29', '四张工具卡插到小人身上'],
];

const Sketch: React.FC<{i: number}> = ({i}) => (
  <svg width={150} height={84} viewBox="0 0 150 84">
    <rect x="2" y="2" width="146" height="80" rx="6" fill="#FBF8F1" stroke={C.ink} strokeWidth={3} />
    <rect x={20 + (i * 23) % 60} y="36" width="40" height="28" rx="3" fill={C.orange} stroke={C.ink} strokeWidth={2.5} />
    <rect x="90" y="14" width="44" height="30" rx="4" fill={[C.yellow, '#BFE7DF', '#F7CFD6', '#CBBDF2', C.white][i]} stroke={C.ink} strokeWidth={2.5} />
  </svg>
);

export const B7Board: React.FC<{f: number}> = ({f}) => (
  <>
    <Pop f={f} at={cf(54) - 4} x={60} y={20} enter="up">
      <Card w={1560} h={760} bg="#FFF8E6" pad={30} style={{position: 'relative'}}>
        <div style={txt(56)}>分镜表</div>
        <div style={{display: 'flex', gap: 24, marginTop: 14, ...txt(34, C.inkSoft)}}>
          <div style={{width: 160}}>
            <Marker p={prog(f, cf(55), 10)}>字幕</Marker>
          </div>
          <div style={{flex: 1}}>
            <Marker p={prog(f, cw(56, '画面'), 10)} color="#BFE7DF">画面里演什么</Marker>
          </div>
          <div style={{width: 160}}>草图</div>
        </div>
        {BOARD.map(([n, desc], i) => (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 16, paddingTop: 12, borderTop: `3px dashed ${C.line}`, opacity: prog(f, cf(54) + 6 + i * 7, 8), transform: `translateX(${(1 - prog(f, cf(54) + 6 + i * 7, 8, easeOut)) * -30}px)`}}>
            <div style={{...txt(40), width: 160}}>第 {n} 句</div>
            <div style={{...txt(40), flex: 1}}>{desc}</div>
            <Sketch i={i} />
          </div>
        ))}
      </Card>
    </Pop>
    {/* 你的批注 */}
    <Pop f={f} at={cf(58)} x={1180} y={440} rot={-6}>
      <Card w={360} h={170} bg="#F7CFD6">
        <div style={txt(34, C.inkSoft)}>我的意见：</div>
        <div style={{...txt(40), marginTop: 8}}>这里换个演法？</div>
      </Card>
    </Pop>
    <svg width={1920} height={820} style={{position: 'absolute', left: 0, top: 0}}>
      <ellipse cx="620" cy="520" rx="330" ry="46" pathLength={1} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="1 1" strokeDashoffset={1 - prog(f, cf(57), 14, easeInOut)} transform="rotate(-2 620 520)" />
    </svg>
    <PiP f={f} at={cf(54) - 6} skin="chef" />
  </>
);
export const B7Sfx: SfxCue[] = [
  ['paper', cf(54) - 4, 0.45],
  ...BOARD.map((_, i) => ['click', cf(54) + 6 + i * 7, 0.3] as SfxCue),
  ['pop', cf(55), 0.3],
  ['pop', cw(56, '画面'), 0.3],
  ['whoosh', cf(57), 0.25],
  ['pop', cf(58), 0.4],
];

/* ---------- B8 写代码：画面全是代码画的，音乐也是代码合成的 ---------- */
const CODE_POOL = [
  'const buddy = <Char x={540} eyes="happy" />',
  'wear={["santa", "headphones"]}',
  'const p = prog(f, cf(12), 10, easeOutBack)',
  '<Subtitles cueAt={cueAt} />',
  'pluck(mtof(64), 1.1, 0.6)  // 尤克里里',
  'applyDuck(music, voiceEnv, 0.7)',
  '<Burst at={cw(37, "弹出来")} />',
  'kick(); snap(); hat();',
];

const ARTS = [
  {name: '场景', key: '场景'},
  {name: '小人', key: '小人'},
  {name: '图标', key: '图标'},
  {name: '字幕条', key: '字幕条'},
];

export const B8Build: React.FC<{f: number}> = ({f}) => {
  const scroll = Math.max(0, f - cf(60)) * 1.6;
  const synthAt = cf(63);
  const duckAt = cf(65);
  return (
    <>
      <Pop f={f} at={cf(59)} x={60} y={20} enter="left">
        <Win w={760} h={520} title="CC 正在写代码…" dark>
          <div style={{position: 'absolute', left: 24, right: 24, top: 16 - (scroll % 46), fontFamily: FONT_CODE, fontSize: 28, lineHeight: '46px', whiteSpace: 'pre'}}>
            {Array.from({length: 14}, (_, k) => {
              const idx = Math.floor(scroll / 46) + k;
              const line = CODE_POOL[idx % CODE_POOL.length];
              const shown = f < cf(60) ? 0 : line.length;
              return <div key={k} style={{color: ['#9FE3D2', '#F2C230', '#E6E1CF', '#F2A0B4'][idx % 4], opacity: shown ? 1 : 0}}>{line}</div>;
            })}
          </div>
        </Win>
      </Pop>
      {ARTS.map((a, i) => {
        const at = cw(61, a.key);
        const x = 880 + (i % 2) * 380;
        const y = 20 + Math.floor(i / 2) * 260;
        return (
          <Pop key={a.name} f={f} at={at} x={x} y={y}>
            <Card w={350} h={230} bg={C.white} style={{position: 'relative', overflow: 'hidden'}}>
              <div style={{...txt(34, C.inkSoft)}}>{a.name}</div>
              {i === 0 && (
                <div style={{position: 'absolute', left: 30, top: 70, width: 290, height: 130, background: 'linear-gradient(#CDEFE6, #9FDCCD)', border: `3px solid ${C.ink}`, borderRadius: 10}} />
              )}
              {i === 1 && (
                <div style={{position: 'absolute', left: 0, top: 0}}>
                  <Char f={f} x={175} y={215} s={0.72} eyes="happy" wear={['santa']} />
                </div>
              )}
              {i === 2 && (
                <div style={{display: 'flex', gap: 14, marginTop: 20, justifyContent: 'center'}}>
                  <ToolIcon kind="readFile" size={78} />
                  <ToolIcon kind="mkdir" size={78} />
                  <ToolIcon kind="readVideo" size={78} />
                </div>
              )}
              {i === 3 && (
                <div style={{marginTop: 42, display: 'flex', justifyContent: 'center'}}>
                  <div style={{...txt(32), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 16px'}}>
                    动画跟着<span style={{background: `linear-gradient(transparent 58%, ${C.yellow} 58%)`}}>字幕</span>走
                  </div>
                </div>
              )}
            </Card>
          </Pop>
        );
      })}
      <Pop f={f} at={cf(62)} x={1400} y={520} rot={-4}>
        <Note color={C.yellow} size={34}>全是代码画的</Note>
      </Pop>
      {/* 代码合成音乐 + 自动闪避 */}
      <Pop f={f} at={synthAt} x={60} y={580} enter="up">
        <Card w={1560} h={220} bg="#FFF8E6" pad={20} style={{position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={txt(38)}>♪ 代码合成的背景音乐</div>
            <div style={{transform: `scale(${f >= cw(64, '版权') ? 1 : 0}) rotate(-6deg)`}}>
              <Stamp text="无版权问题" size={40} color="#3DAA6B" />
            </div>
          </div>
          <div style={{position: 'absolute', left: 24, top: 80, width: 1500, height: 120}}>
            <div style={{position: 'absolute', left: 0, top: 0}}>
              <Wave w={1500} h={120} n={160} seed={21} color="#F4B38A" dim="#F4B38A" progress={1} />
            </div>
            {f >= duckAt && (
              <div style={{position: 'absolute', left: 0, top: 0, opacity: prog(f, duckAt, 10)}}>
                <svg width={1500} height={120}>
                  {[[160, 520], [700, 1080], [1200, 1440]].map(([a, b]) => (
                    <g key={a}>
                      <rect x={a} y="0" width={b - a} height="120" fill="rgba(46,156,143,0.28)" stroke={C.teal} strokeWidth={3} rx={10} />
                      <text x={(a + b) / 2} y="68" textAnchor="middle" fontFamily={FONT_CN} fontSize="30" fill={C.ink}>人声 → 音乐压低</text>
                    </g>
                  ))}
                </svg>
              </div>
            )}
          </div>
        </Card>
      </Pop>
      <PiP f={f} at={cf(59) - 6} skin="detective" />
    </>
  );
};
export const B8Sfx: SfxCue[] = [
  ['whoosh', cf(59), 0.3],
  ['type', cf(60), 0.3],
  ['type', cf(60) + 26, 0.25],
  ...ARTS.map((a) => ['pop', cw(61, a.key), 0.4] as SfxCue),
  ['pop', cf(62), 0.3],
  ['magic', cf(63), 0.3],
  ['stamp', cw(64, '版权'), 0.5],
  ['whoosh', cf(65), 0.25],
];

/* ---------- B9 Remotion Studio 预览 ---------- */
const SRC_FRAMES = 1880;

export const B9Studio: React.FC<{f: number}> = ({f}) => {
  const at = cf(67) - 4;
  const dragA = cw(70, '拖动');
  const dragB = ce(70);
  // 预览里素材的「第几帧」：先正常播，拖动时跳着走，松手后接着播
  const base = 300;
  const srcAt = (t: number) => {
    if (t < dragA) return base + (t - at);
    if (t < dragB) return Math.round(lerp(base + (dragA - at), 1300, prog(t, dragA, dragB - dragA, easeInOut)));
    return 1300 + (t - dragB);
  };
  const src = Math.min(SRC_FRAMES - 1, srcAt(f));
  const trimBefore = Math.max(0, src - (f - at));
  const playhead = src / SRC_FRAMES;
  const cursorX = 330 + playhead * 1100;
  const dragging = f >= dragA && f < dragB;
  const playPressed = f >= cf(71) && f < cf(71) + 8;
  return (
    <>
      <Pop f={f} at={cf(68) - 4} x={60} y={20} enter="up">
        <Win w={1560} h={770} title="localhost:3000 — Remotion Studio" dark>
          {/* 左侧作品列表 */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 260, bottom: 200, borderRight: '3px solid #3A3F48', padding: 20, boxSizing: 'border-box'}}>
            {['Demo', 'Explainer', 'LLM', 'CC'].map((n) => (
              <div key={n} style={{fontFamily: FONT_CODE, fontSize: 28, color: n === 'LLM' ? C.ink : '#C9D1D9', background: n === 'LLM' ? C.yellow : 'transparent', borderRadius: 8, padding: '6px 12px', marginBottom: 8}}>▦ {n}</div>
            ))}
          </div>
          {/* 预览区：真实成片 */}
          <div style={{position: 'absolute', left: 260, right: 0, top: 0, bottom: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1B1D22'}}>
            <div style={{border: `4px solid ${C.ink}`}}>
              <ScreenVideo src="footage/ep02-llm.mp4" at={at} startFrom={trimBefore} w={270} h={480} />
            </div>
          </div>
          {/* 时间轴 */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: '#2A2D34', borderTop: '3px solid #3A3F48'}}>
            <div style={{position: 'absolute', left: 30, top: 18, fontFamily: FONT_CODE, fontSize: 26, color: '#C9D1D9'}}>
              {`00:${String(Math.floor(src / 30)).padStart(2, '0')}.${String(src % 30).padStart(2, '0')}`}
              <span style={{marginLeft: 30, padding: '2px 14px', borderRadius: 8, background: playPressed ? C.yellow : '#3A3F48', color: playPressed ? C.ink : '#C9D1D9'}}>▶ 播放</span>
            </div>
            <div style={{position: 'absolute', left: 270, top: 70, width: 1100, height: 44, background: '#2F6B63', borderRadius: 8, overflow: 'hidden'}}>
              <Wave w={1100} h={44} n={140} seed={31} color="#7FD1C0" dim="#7FD1C0" />
            </div>
            <div style={{position: 'absolute', left: 270, top: 124, width: 1100, height: 44, background: '#3E4A5E', borderRadius: 8}} />
            <div style={{position: 'absolute', left: 270 + playhead * 1100, top: 56, width: 4, height: 130, background: C.red}} />
          </div>
        </Win>
      </Pop>
      {f >= dragA - 10 && f < ce(71) && (
        <div style={{position: 'absolute', left: dragging ? cursorX : f < dragA ? lerp(900, 330 + (srcAt(dragA) / SRC_FRAMES) * 1100, prog(f, dragA - 10, 10)) : cursorX, top: dragging ? 620 : 610}}>
          <Cursor down={dragging} />
        </div>
      )}
      <Pop f={f} at={cf(69)} x={1190} y={100} rot={3}>
        <Note color="#BFE7DF" size={34}>浏览器里的预览界面</Note>
      </Pop>
      <Pop f={f} at={dragA} x={1190} y={200} rot={-2}>
        <Note color={C.yellow} size={34}>拖时间轴，逐帧看</Note>
      </Pop>
      <Pop f={f} at={cf(71)} x={1190} y={300} rot={2}>
        <Note size={34}>▶ 直接播放，听声音</Note>
      </Pop>
      <Pop f={f} at={cf(72)} x={1190} y={420} rot={-3}>
        <Note color="#FFD9D6" size={36}>不满意？直接跟它说</Note>
      </Pop>
      <PiP f={f} at={at} wear={['headphones']} />
    </>
  );
};
export const B9Sfx: SfxCue[] = [
  ['whoosh', cf(68) - 4, 0.3],
  ['pop', cf(69), 0.3],
  ['click', cw(70, '拖动'), 0.4],
  ['click', ce(70), 0.3],
  ['click', cf(71), 0.45],
  ['pop', cf(72), 0.35],
];

/* ---------- B10 提意见 → 马上改 ---------- */
const ASKS = [
  {t: '背景音乐太重了', at: cf(75)},
  {t: '小人的眼睛再大一点', at: cf(76)},
  {t: '加点圣诞帽、耳机、太空服', at: cw(77, '圣诞帽')},
  {t: '画面再丰富一点', at: cf(79)},
];

export const B10Feedback: React.FC<{f: number}> = ({f}) => {
  const look = f >= cw(77, '太空服') ? 'cowboy' : f >= cw(77, '耳机') ? 'headphones' : f >= cw(77, '圣诞帽') ? 'santa' : null;
  const bgm = keyframes(f, [[cf(75) + 6, 0.8], [cf(75) + 22, 0.42]], easeInOut);
  const rich = prog(f, cf(79) + 4, 16);
  const refresh = prog(f, cf(81), 16, easeInOut);
  const eyesBig = f >= cf(76) + 6;
  return (
    <>
      <Pop f={f} at={cf(74)} x={60} y={30}>
        <div style={txt(48)}>我上一期提的意见：</div>
      </Pop>
      {ASKS.map((a, i) => (
        <Pop key={a.t} f={f} at={a.at} x={60} y={120 + i * 130} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{...txt(42), background: '#BFE7DF', border: `4px solid ${C.ink}`, borderRadius: '8px 28px 28px 28px', padding: '8px 26px'}}>{a.t}</div>
            {f >= cf(80) && <Check size={56} p={prog(f, cf(80) + i * 4, 8)} />}
          </div>
        </Pop>
      ))}
      {/* 实时预览 */}
      <Pop f={f} at={cf(74) + 6} x={880} y={30} enter="right">
        <Win w={740} h={560} title="预览" bodyStyle={{background: '#FBF8F1'}}>
          <svg width={740} height={510} style={{position: 'absolute', inset: 0, opacity: rich}}>
            {Array.from({length: 14}, (_, i) => {
              const x = rand(i + 5) * 700 + 20;
              const y = rand(i + 9) * 460 + 20 + Math.sin(f * 0.05 + i) * 8;
              const c = [C.yellow, C.teal, '#F2A0B4', '#8E8FE8'][i % 4];
              return i % 2 ? <circle key={i} cx={x} cy={y} r={9} fill={c} stroke={C.ink} strokeWidth={2} /> : <path key={i} d={`M${x} ${y - 14} Q${x} ${y} ${x + 14} ${y} Q${x} ${y} ${x} ${y + 14} Q${x} ${y} ${x - 14} ${y} Q${x} ${y} ${x} ${y - 14} Z`} fill={c} stroke={C.ink} strokeWidth={2} />;
            })}
          </svg>
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <Char f={f} x={370} y={440} s={eyesBig ? 1.35 : 1.2} eyes={eyesBig ? 'open' : 'flat'} skin={look === 'santa' || look === 'cowboy' ? look : undefined} wear={look === 'headphones' ? ['headphones'] : []} armsUp={f >= cf(82) ? 0.7 : 0} />
          </div>
          {refresh > 0 && refresh < 1 && (
            <div style={{position: 'absolute', inset: 0, background: 'rgba(251,248,241,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width={120} height={120} viewBox="0 0 100 100" style={{transform: `rotate(${refresh * 720}deg)`}}>
                <path d="M78 34 A32 32 0 1 0 82 62" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
                <path d="M62 30 L80 34 L82 14" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </Win>
      </Pop>
      {/* 背景音乐音量推子 */}
      <Pop f={f} at={cf(75)} x={1100} y={610}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={txt(34)}>BGM 音量</div>
          <div style={{width: 300, height: 26, border: `4px solid ${C.ink}`, borderRadius: 14, background: C.white, overflow: 'hidden'}}>
            <div style={{width: `${bgm * 100}%`, height: '100%', background: C.orange}} />
          </div>
        </div>
      </Pop>
      <Pop f={f} at={cf(76) + 6} out={cw(77, '圣诞帽')} x={900} y={90} rot={-4}>
        <Note color={C.yellow} size={32}>眼睛 +60%</Note>
      </Pop>
      <Pop f={f} at={cf(82)} x={880} y={690} rot={-2}>
        <Note color="#BFE7DF" size={34}>✓ 已刷新，马上看到效果</Note>
      </Pop>
      <Burst f={f} at={cw(77, '圣诞帽')} x={1250} y={250} r={150} />
      <Burst f={f} at={cw(77, '耳机')} x={1250} y={280} r={150} color={C.teal} />
      <Burst f={f} at={cw(77, '太空服')} x={1250} y={280} r={180} color="#8E8FE8" />
      <Emote f={f} at={cf(82) + 4} kind="heart" x={1250} y={180} />
    </>
  );
};
export const B10Sfx: SfxCue[] = [
  ['pop', cf(74), 0.3],
  ...ASKS.map((a) => ['pop', a.at, 0.4] as SfxCue),
  ['magic', cw(77, '圣诞帽'), 0.25],
  ['magic', cw(77, '耳机'), 0.25],
  ['magic', cw(77, '太空服'), 0.25],
  ['whoosh', cf(81), 0.3],
  ['ding', cf(82), 0.35],
];

/* ---------- B11 导出成片 + 分轨 ---------- */
const STEMS = [
  {name: '人声.wav', key: '人声', color: '#9FE3D2', seed: 3},
  {name: '背景音乐.wav', key: '背景音乐', color: '#F4B38A', seed: 7},
  {name: '音效.wav', key: '音效', color: '#CBBDF2', seed: 11},
];

export const B11Export: React.FC<{f: number}> = ({f}) => {
  const renderP = prog(f, cf(90) + 6, ce(92) - cf(90) - 6);
  const faders = [
    keyframes(f, [[cf(96), 0.8], [cf(96) + 20, 0.9]]),
    keyframes(f, [[cf(96), 0.6], [cf(96) + 20, 0.35]]),
    keyframes(f, [[cf(96), 0.5], [cf(96) + 20, 0.62]]),
  ];
  return (
    <>
      <Pop f={f} at={cf(89)} x={60} y={30} enter="left">
        <Card w={720} h={330} bg={C.white} style={{position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{...txt(44, C.white), background: f >= cf(90) ? '#3DAA6B' : C.teal, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 26px', transform: `scale(${f >= cf(90) && f < cf(90) + 6 ? 0.92 : 1})`}}>导出</div>
            <div style={txt(40)}>{renderP >= 1 ? '渲染完成！' : f >= cf(90) ? `渲染中 ${Math.round(renderP * 100)}%` : ''}</div>
          </div>
          <div style={{marginTop: 40, height: 44, border: `4px solid ${C.ink}`, borderRadius: 22, overflow: 'hidden', background: '#F3EFE6'}}>
            <div style={{width: `${renderP * 100}%`, height: '100%', background: C.yellow}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, opacity: prog(f, cf(91), 8)}}>
            <Stopwatch size={90} p={renderP} />
            <div style={txt(40)}>1 分钟视频 ≈ 1 分钟渲染</div>
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(93)} x={860} y={20}>
        <div style={{textAlign: 'center'}}>
          <VideoFile name="成片.mp4" size={170} tint="#FFD9A8" />
        </div>
      </Pop>
      {STEMS.map((s, i) => (
        <Pop key={s.name} f={f} at={cw(94, s.key)} x={1140} y={20 + i * 115} enter="right">
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 16, padding: '10px 18px', width: 480, boxSizing: 'border-box'}}>
            <div style={{...txt(32), width: 170}}>{s.name}</div>
            <Wave w={250} h={60} n={40} seed={s.seed} color={s.color} dim={s.color} />
          </div>
        </Pop>
      ))}
      <Pop f={f} at={cf(95)} x={1300} y={375} rot={-3}>
        <Note color={C.yellow} size={36}>三条分轨</Note>
      </Pop>
      <Pop f={f} at={cf(96)} x={200} y={420} enter="up">
        <Card w={620} h={370} bg="#2A2D34" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          {STEMS.map((s, i) => (
            <div key={s.name} style={{filter: 'none'}}>
              <Fader label={s.key} v={faders[i]} color={s.color} />
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={cf(96) + 4} x={860} y={500} rot={3}>
        <Note size={36}>在剪辑软件里再调音量</Note>
      </Pop>
      <Pop f={f} at={cf(97)} x={900} y={620} rot={-2}>
        <Note color="#BFE7DF" size={36}>也很方便 ✓</Note>
      </Pop>
      <PiP f={f} at={cf(89) - 6} wear={['headphones']} />
    </>
  );
};
export const B11Sfx: SfxCue[] = [
  ['pop', cf(89), 0.3],
  ['click', cf(90), 0.5],
  ['whoosh', cf(90) + 6, 0.25],
  ['ding', ce(92), 0.35],
  ['pop', cf(93), 0.45],
  ...STEMS.map((s) => ['pop', cw(94, s.key), 0.35] as SfxCue),
  ['pop', cf(95), 0.35],
  ['click', cf(96) + 6, 0.3],
];

/* ---------- B12 自己试一试：doodle-cut ---------- */
export const B12Try: React.FC<{f: number}> = ({f}) => {
  const forkAt = cw(113, '拿来改');
  const pressed = f >= forkAt && f < forkAt + 8;
  const vidAt = cf(110);
  return (
    <>
      <Pop f={f} at={cf(108)} x={60} y={30} enter="left">
        <Card w={600} h={330} bg="#FFF3B8" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
          <Stopwatch size={120} p={prog(f, cf(109), 40)} />
          <div style={txt(42)}>先从 1 分钟左右的</div>
          <div style={txt(42)}>
            <Marker p={prog(f, cw(109, '短视频'), 10)}>短视频</Marker>开始
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={vidAt - 4} x={720} y={20} enter="right">
        <Win w={900} h={640} title="github.com/your-name/doodle-cut">
          <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px'}}>
            <GitHubMark size={56} />
            <div style={{fontFamily: FONT_CODE, fontSize: 34, color: C.ink}}>
              your-name / <span style={{background: f >= cf(112) ? `linear-gradient(transparent 58%, ${C.yellow} 58%)` : 'none'}}>doodle-cut</span>
            </div>
            <div style={{marginLeft: 'auto', ...txt(28), border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 14px', background: pressed ? C.yellow : '#F3EFE6', transform: `scale(${pressed ? 0.9 : 1})`}}>⑂ Fork</div>
          </div>
          <div style={{margin: '0 24px', border: `3px solid ${C.ink}`, borderRadius: 10, overflow: 'hidden'}}>
            <ScreenVideo src="footage/ep00-demo.mp4" at={vidAt - 4} startFrom={120} w={846} h={476} />
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={cw(110, 'demo')} x={200} y={420} rot={-3}>
        <Note color="#BFE7DF" size={36}>第一版 30 秒 demo</Note>
      </Pop>
      <Pop f={f} at={cf(111)} x={240} y={520} rot={2}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <Folder name="" size={70} />
          <Note size={36}>已开源到 GitHub</Note>
        </div>
      </Pop>
      <Pop f={f} at={forkAt} x={260} y={640} rot={-2}>
        <Note color={C.yellow} size={36}>拿来直接改 ✦</Note>
      </Pop>
      {f >= forkAt - 10 && f < forkAt + 20 && (
        <div style={{position: 'absolute', left: lerp(1300, 1520, prog(f, forkAt - 10, 10, easeOut)), top: lerp(300, 80, prog(f, forkAt - 10, 10, easeOut))}}>
          <Cursor down={pressed} />
        </div>
      )}
      <Burst f={f} at={forkAt} x={1540} y={70} r={100} />
      <PiP f={f} at={cf(108) - 6} skin="santa" />
    </>
  );
};
export const B12Sfx: SfxCue[] = [
  ['pop', cf(108), 0.35],
  ['whoosh', cf(110) - 4, 0.3],
  ['pop', cw(110, 'demo'), 0.35],
  ['pop', cf(111), 0.35],
  ['ding', cf(112), 0.3],
  ['click', cw(113, '拿来改'), 0.5],
];
