import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Confetti} from '../../../library/fx';
import {Char} from '../../../library/character/Char';
import {cf, cw} from '../cues';
import {Check, Folder, ThumbUp, UserFace, VideoFile} from '../../../library/icons';
import {bigText, Card, Marker, Pop, txt} from '../../../library/ui';
import {Laptop} from '../../../library/items/objects';
import type {SfxCue} from '../../../library/types';

/* ---------------- S14 最后：交一份汇报 ---------------- */

const FOLDERS = [
  {name: 'Python 入门', color: '#9FE3D2', x: 60},
  {name: '剪辑教程', color: '#F7CFD6', x: 350},
  {name: '待确认', color: C.yellow, x: 640},
];
// 文件从桌面散落位置飞进各自的文件夹
const MOVES = [
  {name: '学习资料.mp4', from: [80, 250], to: 0},
  {name: '学习资料三.mp4', from: [640, 260], to: 1},
  {name: '学习资料二.mp4', from: [360, 90], to: 2},
];

const LINES = [
  {at: cf(81), ok: true, text: '学习资料.mp4 → Python 入门/'},
  {at: cf(81) + 12, ok: true, text: '学习资料三.mp4 → 剪辑教程/'},
  {at: cf(82), ok: false, text: '学习资料二.mp4 疑似重复 → 待确认/'},
];

export const S14Report: React.FC<{f: number}> = ({f}) => {
  const print = prog(f, cf(81) - 6, 20, easeOut);
  const reading = f >= cf(84);
  const hi = prog(f, cf(85), 12);
  return (
    <>
      <Pop f={f} at={cf(80) - 6} x={60} y={10} dur={12}>
        <Laptop w={960} h={420}>
          {FOLDERS.map((fd, i) => (
            <Pop key={fd.name} f={f} at={cf(80) + i * 5} x={fd.x + 40} y={70}>
              <Folder name={fd.name} size={130} color={fd.color} open={prog(f, cf(80) + 16 + i * 8, 6) * (1 - prog(f, cf(80) + 26 + i * 8, 6))} />
            </Pop>
          ))}
          {MOVES.map((m, i) => {
            const p = prog(f, cf(80) + 12 + i * 8, 14, easeInOut);
            if (p >= 1) return null;
            const tx = FOLDERS[m.to].x + 120;
            const x = lerp(m.from[0], tx, p);
            const y = lerp(m.from[1], 120, p) - Math.sin(p * Math.PI) * 120;
            return (
              <div key={m.name} style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - p * 0.6}) rotate(${p * 30}deg)`, opacity: 1 - p * 0.3}}>
                <VideoFile name="" size={80} />
              </div>
            );
          })}
        </Laptop>
      </Pop>
      {/* 汇报小票：从下往上「打印」出来 */}
      {print > 0 && (
        <div style={{position: 'absolute', left: 60, top: 520, width: 760, height: 470, overflow: 'hidden'}}>
          <div style={{transform: `translateY(${(1 - print) * 470}px)`}}>
            <div style={{background: C.white, border: `4px solid ${C.ink}`, borderBottom: 'none', padding: '26px 34px 40px', boxSizing: 'border-box', height: 470, position: 'relative'}}>
              <div style={{...txt(48), textAlign: 'center'}}>整理汇报</div>
              <div style={{borderTop: `3px dashed ${C.inkSoft}`, margin: '14px 0 18px'}} />
              {LINES.map((l) => (
                <div key={l.text} style={{...txt(34, l.ok ? C.ink : '#B3262B'), opacity: prog(f, l.at, 8), marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  {l.ok ? <Check size={36} /> : <span style={{width: 36, textAlign: 'center'}}>？</span>}
                  {l.ok ? l.text : <Marker p={hi} color="#FFD9A8">{l.text}</Marker>}
                </div>
              ))}
              <div style={{...txt(34, C.inkSoft), opacity: prog(f, cf(83), 8), marginTop: 10}}>共 3 个文件 · 1 个等你决定</div>
            </div>
          </div>
        </div>
      )}
      <Pop f={f} at={cf(84)} x={840} y={560} enter="right">
        <UserFace size={150} f={f} mood={f >= cf(85) + 20 ? 'happy' : 'reading'} />
      </Pop>
      <Pop f={f} at={cf(84) + 10} x={830} y={730} rot={4}>
        <div style={{...txt(38), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 16, padding: '4px 16px'}}>一目了然！</div>
      </Pop>
      <Char f={f} x={930} y={1090} s={0.7} eyes={reading ? 'happy' : 'open'} lookX={-1} armsUp={f >= cf(85) ? 0.5 : 0} />
    </>
  );
};

export const S14Sfx: SfxCue[] = [
  ['pop', cf(80), 0.4],
  ...MOVES.map((_, i) => ['whoosh', cf(80) + 12 + i * 8, 0.3] as SfxCue),
  ['paper', cf(81) - 6, 0.5],
  ...LINES.map((l) => ['type', l.at, 0.25] as SfxCue),
  ['pop', cf(84), 0.4],
  ['ding', cf(85) + 4, 0.35],
];

/* ---------------- S15 这就是 Agent ---------------- */

const Flame: React.FC<{f: number; i: number}> = ({f, i}) => {
  const s = 1 + Math.sin(f * 0.5 + i * 2) * 0.12;
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" style={{transform: `scale(${s})`, transformOrigin: '50% 100%'}}>
      <path d="M30 4 Q54 34 50 54 Q46 76 30 76 Q14 76 10 56 Q8 40 22 28 Q22 44 30 46 Q24 26 30 4 Z" fill="#F28C38" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M30 40 Q42 54 38 64 Q34 72 28 70 Q20 66 24 56 Q28 52 30 40 Z" fill={C.yellow} />
    </svg>
  );
};

export const S15Outro: React.FC<{f: number}> = ({f}) => {
  const likeAt = cw(88, '点赞');
  const followAt = cw(88, '关注');
  const thanksAt = cw(88, '谢谢');
  const armLike = prog(f, likeAt - 6, 6) * (1 - prog(f, likeAt + 4, 6));
  const armFollow = prog(f, followAt - 6, 6) * (1 - prog(f, followAt + 4, 6));
  const arm = armLike > 0 ? {tx: 290, ty: 620, ext: armLike} : armFollow > 0 ? {tx: 770, ty: 620, ext: armFollow} : null;
  const liked = f >= likeAt;
  const followed = f >= followAt;
  const beat = Math.abs(Math.sin(((f - cf(86)) / 15) * Math.PI));
  const hop = f >= thanksAt ? beat * 26 : 0;
  const tilt = f >= cf(87) && f < cf(88) ? 10 : 0;
  const press = (at: number) => 1 - Math.sin(prog(f, at, 8) * Math.PI) * 0.12;
  return (
    <>
      <Pop f={f} at={cf(86) + 4} x={540} y={140} center>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
          <Flame f={f} i={0} />
          <div style={bigText(170, C.yellow)}>Agent</div>
          <Flame f={f} i={1} />
        </div>
      </Pop>
      <Pop f={f} at={cw(86, '非常火')} x={540} y={300} center rot={-3}>
        <div style={{...txt(52), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '2px 22px'}}>现在非常火的那个！</div>
      </Pop>
      <Pop f={f} at={cf(87)} out={cf(88)} x={640} y={400} center rot={6}>
        <div style={{...txt(56), background: C.white, border: `4px solid ${C.ink}`, borderRadius: '28px 28px 28px 8px', padding: '10px 26px'}}>你理解了吗？</div>
      </Pop>
      <Pop f={f} at={cf(88) - 4} x={120} y={560} enter="up">
        <div style={{transform: `scale(${press(likeAt)})`}}>
          <Card w={360} h={130} bg={liked ? '#FFD9D6' : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
            <ThumbUp size={76} fill={liked ? C.red : C.white} />
            <div style={txt(56)}>{liked ? '已赞' : '点赞'}</div>
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={cf(88)} x={600} y={560} enter="up">
        <div style={{transform: `scale(${press(followAt)})`}}>
          <Card w={360} h={130} bg={followed ? C.yellow : C.white} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {followed && <Check size={56} color={C.ink} />}
            <div style={txt(56)}>{followed ? '已关注' : '+ 关注'}</div>
          </Card>
        </div>
      </Pop>
      <Pop f={f} at={thanksAt} x={540} y={450} center rot={-4}>
        <div style={bigText(110, C.white)}>谢谢！</div>
      </Pop>
      <Char f={f} x={540} y={1090 - hop} s={1.05} eyes={f >= thanksAt ? 'happy' : 'open'} armsUp={f >= thanksAt ? 1 : 0.3} arm={arm} rot={tilt} lookX={arm ? (armLike > 0 ? -1 : 1) : 0} />
      <div style={{position: 'absolute', left: 0, top: -270, width: 1080, height: 1920, pointerEvents: 'none'}}>
        <Confetti t={f - thanksAt} w={1080} h={1920} n={90} />
      </div>
    </>
  );
};

export const S15Sfx: SfxCue[] = [
  ['pop', cf(86) + 4, 0.55],
  ['pop', cw(86, '非常火'), 0.4],
  ['question', cf(87), 0.35],
  ['click', cw(88, '点赞'), 0.6],
  ['pop', cw(88, '点赞') + 2, 0.5],
  ['click', cw(88, '关注'), 0.6],
  ['pop', cw(88, '关注') + 2, 0.5],
  ['confetti', cw(88, '谢谢'), 0.6],
];

