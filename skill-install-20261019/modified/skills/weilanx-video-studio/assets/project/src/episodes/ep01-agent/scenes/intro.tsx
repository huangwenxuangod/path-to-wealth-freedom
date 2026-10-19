import React from 'react';
import {easeInOut, easeOutBack, keyframes, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {BuddyFigure} from '../../../library/character/BuddyFigure';
import {Char, GRAY, GRAY_DARK} from '../../../library/character/Char';
import {ce, cf, cw} from '../cues';
import {Arrow, ChatIcon, Folder, LaptopIcon, UserFace, VideoFile} from '../../../library/icons';
import {bigText, Card, jolt, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';

/* ---------------- S1 普通 AI 的日常：只会长篇大论 ---------------- */

const STEPS = ['第一步：先打开桌面', '第二步：新建几个文件夹', '第三步：按项目把文件拖进去', '第四步：检查有没有重复', '第五步：……'];
const STEP_GAP = 11;

const Bubble: React.FC<{side: 'l' | 'r'; bg?: string; size?: number; children: React.ReactNode}> = ({side, bg, size = 40, children}) => (
  <div
    style={{
      ...txt(size, C.ink, {whiteSpace: 'normal', lineHeight: 1.35}),
      maxWidth: 640,
      background: bg ?? (side === 'l' ? C.white : '#BFE7DF'),
      border: `4px solid ${C.ink}`,
      borderRadius: side === 'l' ? '8px 28px 28px 28px' : '28px 8px 28px 28px',
      padding: '14px 24px',
      boxShadow: '4px 5px 0 rgba(43,35,32,0.12)',
    }}
  >
    {children}
  </div>
);

const TypingDots: React.FC<{f: number}> = ({f}) => (
  <div style={{display: 'flex', gap: 10, padding: '6px 4px'}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: C.inkSoft, transform: `translateY(${-Math.max(0, Math.sin(f * 0.35 - i * 0.8)) * 10}px)`}} />
    ))}
  </div>
);

export const S1Chat: React.FC<{f: number}> = ({f}) => {
  const aiAt = cf(4);
  const lines = Math.max(0, Math.min(STEPS.length, Math.floor((f - aiAt - 20) / STEP_GAP) + 1));
  const aiH = 110 + lines * 58;
  const msgs: {at: number; y: number; h: number}[] = [
    {at: cf(2), y: 30, h: 90},
    {at: cf(3), y: 150, h: aiH},
    {at: cf(5), y: 150 + aiH + 30, h: 90},
    {at: cf(6), y: 150 + aiH + 140, h: 110},
  ];
  const last = [...msgs].reverse().find((m) => f >= m.at) ?? msgs[0];
  const scroll = Math.max(0, last.y + last.h - 790);
  const shakeX = jolt(f, cf(6), 18, 16) + jolt(f, cf(5), 8, 10);
  const angry = f >= cf(5);
  return (
    <>
      <Pop f={f} at={0} x={60} y={20} dur={12}>
        <div style={{transform: `translateX(${shakeX}px)`}}>
          <Card w={960} h={1040} pad={0} bg="#FBF8F1" style={{overflow: 'hidden', position: 'relative'}}>
            {/* 标题栏 */}
            <div style={{height: 120, borderBottom: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px', background: C.white}}>
              <svg width={90} height={80} viewBox="-120 -170 240 180">
                <BuddyFigure eyes="open" color={GRAY} shade={GRAY_DARK} nubs={false} mouth={0.2} />
              </svg>
              <div style={txt(46)}>普通 AI</div>
              <div style={{width: 18, height: 18, borderRadius: 9, background: '#3DAA6B', border: `3px solid ${C.ink}`}} />
              <div style={txt(30, C.inkSoft)}>在线 · 只会聊天</div>
            </div>
            {/* 消息区 */}
            <div style={{position: 'absolute', left: 0, right: 0, top: 120, bottom: 0, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)`}}>
                <Pop f={f} at={msgs[0].at} x={0} y={msgs[0].y} w={930} enter="right" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 14}}>
                  <Bubble side="r">帮我整理一下桌面</Bubble>
                  <UserFace size={80} f={f} mood={angry ? 'angry' : 'calm'} />
                </Pop>
                <Pop f={f} at={msgs[1].at} x={30} y={msgs[1].y} enter="left">
                  <Bubble side="l">
                    {f < aiAt ? (
                      <TypingDots f={f} />
                    ) : (
                      <>
                        <div>我用最直白、最通俗的方式告诉你……</div>
                        {STEPS.slice(0, lines).map((s) => (
                          <div key={s} style={{fontSize: 36, color: '#5A524A', marginTop: 8}}>{s}</div>
                        ))}
                      </>
                    )}
                  </Bubble>
                </Pop>
                <Pop f={f} at={msgs[2].at} x={0} y={msgs[2].y} w={930} enter="right" style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Bubble side="r">不是啊，方法我知道！</Bubble>
                </Pop>
                <Pop f={f} at={msgs[3].at} x={0} y={msgs[3].y} w={930} style={{display: 'flex', justifyContent: 'flex-end'}} rot={-2}>
                  <Bubble side="r" bg="#FFD2CC" size={50}>你能不能直接帮我弄！！！</Bubble>
                </Pop>
              </div>
            </div>
          </Card>
        </div>
      </Pop>
    </>
  );
};

export const S1Sfx: SfxCue[] = [
  ['pop', 0, 0.5],
  ['type', cf(2) - 18, 0.35],
  ['pop', cf(2), 0.5],
  ['type', cf(3), 0.3],
  ['pop', cf(4), 0.45],
  ...STEPS.map((_, i) => ['click', cf(4) + 20 + i * STEP_GAP, 0.3] as SfxCue),
  ['pop', cf(5), 0.55],
  ['shake', cf(6), 0.45],
  ['pop', cf(6), 0.7],
];

/* ---------------- S2 困在对话层面 vs Agent 登场 ---------------- */

export const S2Cage: React.FC<{f: number}> = ({f}) => {
  const cageP = prog(f, cf(8) - 6, 24, easeInOut);
  const agentAt = cf(10);
  const drop = prog(f, agentAt, 14, easeOutBack);
  const agentY = lerp(-300, 1040, drop);
  const reach = keyframes(f, [[agentAt + 22, 0], [agentAt + 34, 1], [ce(10) + 6, 1], [ce(10) + 16, 0]]);
  return (
    <>
      {/* 对话框「牢笼」 */}
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
        <path
          d="M60 380 Q60 330 110 330 H530 Q580 330 580 380 V900 Q580 950 530 950 H300 L220 1040 L230 950 H110 Q60 950 60 900 Z"
          pathLength={1}
          fill="rgba(255,255,255,0.55)"
          fillOpacity={cageP}
          stroke={C.ink}
          strokeWidth={6}
          strokeDasharray="1 1"
          strokeDashoffset={1 - cageP}
          strokeLinejoin="round"
        />
      </svg>
      <Pop f={f} at={cw(8, '对话')} x={130} y={270} rot={-3}>
        <div style={{...txt(44), background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 20px'}}>对话层面</div>
      </Pop>
      {/* 灰色 AI 在里面一直说 */}
      {f >= cf(7) &&
        [0, 1, 2, 3].map((i) => {
          const t = (f - cf(7) - i * 14) % 56;
          if (f - cf(7) < i * 14) return null;
          const p = t / 56;
          return (
            <div key={i} style={{position: 'absolute', left: 250 + Math.sin(i * 2.1) * 90, top: 700 - p * 300, opacity: 1 - p, transform: `scale(${0.6 + p * 0.5})`, ...txt(40, C.inkSoft)}}>
              {['bla bla', '……', '你可以…', '首先…'][i]}
            </div>
          );
        })}
      <Char f={f} x={320} y={900} s={1.25} kind="bot" talk={f < cf(10)} eyes={f >= agentAt ? 'wide' : 'open'} lookX={f >= agentAt ? 1 : 0} />
      {/* 右边：真正要干的活 */}
      <Pop f={f} at={cf(9)} x={660} y={120}>
        <LaptopIcon size={330} />
        <div style={{...txt(40), textAlign: 'center', marginTop: 8}}>真·干活</div>
      </Pop>
      <Pop f={f} at={cf(9) + 10} x={700} y={420} rot={-8}>
        <VideoFile name="学习资料.mp4" size={80} />
      </Pop>
      <Pop f={f} at={cf(9) + 16} x={850} y={440} rot={6}>
        <VideoFile name="学习资料二.mp4" size={80} />
      </Pop>
      {/* Agent 从天而降 */}
      {f >= agentAt && (
        <Char f={f} x={820} y={agentY} s={1.15} eyes={drop >= 1 ? 'happy' : 'wide'} armsUp={f > agentAt + 14 ? 0.6 : 0} arm={{tx: 935, ty: 330, ext: reach}} />
      )}
      <Pop f={f} at={agentAt + 8} x={690} y={760} center rot={-6}>
        <div style={bigText(130, C.yellow)}>Agent</div>
      </Pop>
    </>
  );
};

export const S2Sfx: SfxCue[] = [
  ['paper', cf(8) - 6, 0.4],
  ['pop', cw(8, '对话'), 0.45],
  ['pop', cf(9), 0.4],
  ['whoosh', cf(10) - 4, 0.5],
  ['boing', cf(10) + 12, 0.45],
  ['ding', cf(10) + 8, 0.35],
];

/* ---------------- S3 什么是 Agent ---------------- */

export const S3What: React.FC<{f: number}> = ({f}) => {
  const walk = prog(f, cf(13), ce(13) - cf(13), easeInOut);
  const arrowP = prog(f, cf(12) + 20, 26, easeInOut);
  const qWiggle = Math.sin(f * 0.25) * 8;
  return (
    <>
      <Pop f={f} at={cf(11)} x={540} y={90} center>
        <div style={bigText(118, C.yellow)}>
          什么是 Agent<span style={{display: 'inline-block', transform: `rotate(${qWiggle}deg)`}}>？</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(12)} x={70} y={250}>
        <Card w={380} h={330} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <ChatIcon size={170} />
          <div style={txt(48)}>陪你聊天</div>
        </Card>
      </Pop>
      <div style={{position: 'absolute', left: 470, top: 390}}>
        <Arrow w={140} h={60} d="M0 30 Q70 0 130 30" head="M108 12 L132 30 L108 48" p={arrowP} width={8} />
      </div>
      <Pop f={f} at={cf(13)} x={630} y={250}>
        <Card w={380} h={330} bg="#E6F6F1" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <LaptopIcon size={230} />
          <div style={txt(48)}>操作电脑</div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(14)} x={540} y={720} center rot={-3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#FFF3B8', border: `4px solid ${C.ink}`, padding: '14px 36px', borderRadius: 10, boxShadow: '5px 7px 0 rgba(43,35,32,0.14)'}}>
          <Folder name="" size={90} />
          <div style={txt(56)}>举个例子：整理桌面</div>
        </div>
      </Pop>
      {f >= cf(12) && (
        <Char f={f} x={lerp(260, 820, walk)} y={1070} s={1.1} walk={walk > 0 && walk < 1} lookX={walk > 0 && walk < 1 ? 1 : 0} eyes={f >= cf(15) ? 'happy' : 'open'} armsUp={f >= cf(15) ? 0.5 : 0} />
      )}
    </>
  );
};

export const S3Sfx: SfxCue[] = [
  ['pop', cf(11), 0.55],
  ['pop', cf(12), 0.45],
  ['whoosh', cf(12) + 20, 0.3],
  ['pop', cf(13), 0.45],
  ['paper', cf(14), 0.45],
  ['ding', cf(15) + 6, 0.3],
];
