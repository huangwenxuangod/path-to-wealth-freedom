import React from 'react';
import {easeOut, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Confetti} from '../../../library/fx';
import {Burst, Emote} from '../../../library/fx';
import {Check, Cross, UserFace} from '../../../library/icons';
import {bigText, Card, Marker, Pop, txt} from '../../../library/ui';
import type {SfxCue} from '../../../library/types';
import {cf, cw} from '../cues';
import {Host} from '../../../library/sets/Studio';

// A-roll：主持人在演播室里说话，左侧是随口播出现的板书

const Tag: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.white}) => (
  <div style={{...txt(40), display: 'inline-block', background: color, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '4px 20px', boxShadow: '4px 5px 0 rgba(43,35,32,0.14)'}}>{children}</div>
);

/* ---------- A1 开场 ---------- */
export const A1Intro: React.FC<{f: number}> = ({f}) => (
  <Host f={f} wear={['headphones']} eyes={f >= cw(3, '手绘风') ? 'happy' : 'open'} armsUp={f >= cw(3, '手绘风') ? 0.5 : 0}>
    <Pop f={f} at={cf(1) + 4} x={0} y={0} rot={-2}>
      <Tag color={C.yellow}>本期分享</Tag>
    </Pop>
    <Pop f={f} at={cf(2)} x={0} y={90}>
      <div style={bigText(120, C.white)}>用 CC 做</div>
    </Pop>
    <Pop f={f} at={cw(3, '手绘风')} x={0} y={240}>
      <div style={bigText(120, C.yellow)}>手绘动画口播</div>
    </Pop>
    <Burst f={f} at={cw(3, '手绘风') + 4} x={380} y={300} r={330} n={14} />
    <Pop f={f} at={cw(3, '口播') + 6} x={0} y={420} rot={2}>
      <Tag>Remotion 画画面 · 字幕稿驱动动画</Tag>
    </Pop>
  </Host>
);
export const A1Sfx: SfxCue[] = [
  ['pop', cf(1) + 4, 0.35],
  ['pop', cf(2), 0.45],
  ['magic', cw(3, '手绘风'), 0.35],
  ['pop', cw(3, '口播') + 6, 0.3],
];

/* ---------- A2 本质是什么 ---------- */
export const A2Essence: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="detective" eyes={f >= cf(10) ? 'star' : 'open'}>
    <Pop f={f} at={cf(8)} x={0} y={0}>
      <Tag>开始之前</Tag>
    </Pop>
    <Pop f={f} at={cf(9)} x={0} y={90}>
      <div style={bigText(96, C.white)}>
        这种视频的<Marker p={prog(f, cw(9, '本质'), 10)}>本质</Marker>是
        <span style={{display: 'inline-block', transform: `rotate(${Math.sin(f * 0.3) * 12}deg)`, color: C.yellow}}>？</span>
      </div>
    </Pop>
    {[
      {t: '① 画面：代码画出来', c: '#BFE7DF'},
      {t: '② 动画：跟着字幕走', c: '#FFF3B8'},
    ].map((x, i) => (
      <Pop key={x.t} f={f} at={cf(10) + i * 8} x={i * 40} y={240 + i * 120} enter="left">
        <Card w={620} h={100} pad={0} bg={x.c} style={{display: 'flex', alignItems: 'center', padding: '0 28px'}}>
          <div style={txt(52)}>{x.t}</div>
        </Card>
      </Pop>
    ))}
  </Host>
);
export const A2Sfx: SfxCue[] = [
  ['pop', cf(8), 0.35],
  ['question', cf(9) + 10, 0.3],
  ['pop', cf(10), 0.45],
  ['pop', cf(10) + 8, 0.45],
];

/* ---------- A3 第二件事 ---------- */
export const A3Second: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="cowboy" eyes="happy">
    <Pop f={f} at={cf(25)} x={0} y={40}>
      <div style={bigText(200, C.yellow)}>②</div>
    </Pop>
    <Pop f={f} at={cw(26, '字幕')} x={240} y={100}>
      <div style={bigText(92, C.white)}>动画</div>
      <div style={bigText(92, C.white)}>
        跟着<Marker p={prog(f, cw(26, '字幕') + 6, 10)}>字幕</Marker>走
      </div>
    </Pop>
  </Host>
);
export const A3Sfx: SfxCue[] = [
  ['stamp', cf(25), 0.5],
  ['pop', cw(26, '字幕'), 0.4],
];

/* ---------- A4 想清楚这两点 ---------- */
export const A4Easy: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="chef" eyes={f >= cf(42) ? 'star' : 'happy'} armsUp={f >= cf(42) ? 0.8 : 0}>
    {['代码画画面', '跟着字幕走'].map((t, i) => (
      <Pop key={t} f={f} at={cf(41) + i * 6} x={0} y={i * 120} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Check size={80} p={prog(f, cf(41) + 8 + i * 6, 10)} />
          <div style={bigText(78, C.white)}>{t}</div>
        </div>
      </Pop>
    ))}
    <Pop f={f} at={cw(42, '简单')} x={0} y={300}>
      <div style={bigText(110, C.yellow)}>做起来就很简单！</div>
    </Pop>
    <Burst f={f} at={cw(42, '简单') + 4} x={420} y={360} r={300} n={14} />
  </Host>
);
export const A4Sfx: SfxCue[] = [
  ['click', cf(41) + 8, 0.4],
  ['click', cf(41) + 14, 0.4],
  ['ding', cw(42, '简单'), 0.35],
];

/* ---------- A5 提醒：CC 听不到声音 ---------- */
const Ear: React.FC = () => (
  <svg width={150} height={170} viewBox="0 0 100 110">
    <path d="M30 60 Q18 20 52 12 Q86 8 86 44 Q86 64 70 74 Q60 82 62 96 Q60 106 48 104" fill="#FAD9C1" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M44 44 Q48 30 62 34 Q72 40 64 54" fill="none" stroke={C.ink} strokeWidth={4} />
  </svg>
);

export const A5Remind: React.FC<{f: number}> = ({f}) => {
  const phonesOn = f >= cw(88, '耳机');
  return (
    <Host f={f} wear={phonesOn ? ['headphones'] : []} eyes={phonesOn ? 'closed' : f >= cf(84) ? 'wide' : 'open'}>
      <Pop f={f} at={cf(83)} x={0} y={0} rot={-2}>
        <Tag color={C.yellow}>⚠ 提醒一下</Tag>
      </Pop>
      <Pop f={f} at={cf(84)} x={0} y={90}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{position: 'relative'}}>
            <Ear />
            <div style={{position: 'absolute', left: 0, top: 10}}>
              <Cross size={150} p={prog(f, cf(84) + 8, 10)} />
            </div>
          </div>
          <div style={bigText(90, C.white)}>CC 听不到声音</div>
        </div>
      </Pop>
      <Pop f={f} at={cf(85)} x={0} y={290} enter="left">
        <Card w={330} h={120} pad={0} bg="#BFE7DF" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={txt(30, C.inkSoft)}>音量数值</div>
          <div style={txt(46)}>−16 LUFS ✓</div>
        </Card>
      </Pop>
      <Pop f={f} at={cw(86, '好不好听')} x={370} y={280} rot={-4}>
        <Tag color="#FFD9D6">好不好听？</Tag>
      </Pop>
      <Pop f={f} at={cf(87)} x={420} y={360} rot={3}>
        <Tag color="#FFD9D6">吵不吵？</Tag>
      </Pop>
      <Pop f={f} at={cw(88, '耳机')} x={0} y={450}>
        <div style={bigText(72, C.yellow)}>得自己戴上耳机听一遍</div>
      </Pop>
      <Emote f={f} at={cw(88, '耳机') + 6} kind="note" x={1500} y={330} dur={50} />
    </Host>
  );
};
export const A5Sfx: SfxCue[] = [
  ['pop', cf(83), 0.35],
  ['error', cf(84) + 8, 0.3],
  ['ding', cf(85), 0.25],
  ['question', cw(86, '好不好听'), 0.3],
  ['pop', cf(87), 0.3],
  ['magic', cw(88, '耳机'), 0.3],
];

/* ---------- A6 分工变清楚了 ---------- */
const MINE = [
  {t: '选题', at: cw(100, '选题')},
  {t: '口播内容', at: cw(100, '口播')},
  {t: '好不好看、好不好听', at: cw(101, '好不好看')},
];
const CCS = [
  {t: '画面怎么画', at: cw(103, '画面')},
  {t: '代码怎么写', at: cw(103, '代码')},
];

export const A6Roles: React.FC<{f: number}> = ({f}) => {
  const tipAt = cf(105);
  const columnsOut = tipAt - 4;
  return (
    <Host f={f} skin="detective" eyes={f >= cf(104) ? 'happy' : 'open'}>
      <Pop f={f} at={cf(99)} out={columnsOut} x={0} y={0}>
        <div style={bigText(76, C.white)}>
          分工变<Marker p={prog(f, cw(99, '清楚'), 10)}>清楚</Marker>了
        </div>
      </Pop>
      <Pop f={f} at={cf(100) - 4} out={columnsOut} x={0} y={120}>
        <Card w={390} h={350} bg="#FFF3B8">
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <UserFace size={60} f={f} />
            <div style={txt(48)}>我负责</div>
          </div>
          {MINE.map((m) => (
            <div key={m.t} style={{...txt(38), marginTop: 18, opacity: prog(f, m.at, 8)}}>· {m.t}</div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={cf(103) - 4} out={columnsOut} x={430} y={120}>
        <Card w={390} h={350} bg="#BFE7DF">
          <div style={txt(48)}>交给 CC</div>
          {CCS.map((m) => (
            <div key={m.t} style={{...txt(38), marginTop: 18, opacity: prog(f, m.at, 8)}}>· {m.t}</div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={tipAt} x={0} y={0}>
        <div style={bigText(70, C.white)}>提意见越具体越好</div>
      </Pop>
      <Pop f={f} at={cf(106)} x={0} y={140} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Tag color="#BFE7DF">「背景音乐再小一点」</Tag>
          <Check size={70} p={prog(f, cf(106) + 8, 10)} />
        </div>
      </Pop>
      <Pop f={f} at={cf(107)} x={0} y={260} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Tag color="#FFD9D6">「感觉不太对」</Tag>
          <Cross size={64} p={prog(f, cw(107, '好改') , 10)} />
        </div>
      </Pop>
      <Pop f={f} at={cw(107, '好改')} x={20} y={390} rot={-2}>
        <div style={txt(44, C.inkSoft)}>前者好改得多 ✦</div>
      </Pop>
    </Host>
  );
};
export const A6Sfx: SfxCue[] = [
  ['pop', cf(99), 0.35],
  ...MINE.map((m) => ['click', m.at, 0.35] as SfxCue),
  ...CCS.map((m) => ['click', m.at, 0.35] as SfxCue),
  ['whoosh', cf(105) - 4, 0.3],
  ['pop', cf(106), 0.4],
  ['ding', cf(106) + 8, 0.3],
  ['pop', cf(107), 0.4],
  ['snip', cw(107, '好改'), 0.35],
];

/* ---------- A7 结尾 ---------- */
export const A7Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(115);
  return (
    <>
      <Host f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(114)} x={0} y={60}>
          <div style={bigText(96, C.white)}>本期就到这里</div>
        </Pop>
        <Pop f={f} at={byeAt} x={0} y={220} rot={-4}>
          <div style={bigText(150, C.yellow)}>下期再见！</div>
        </Pop>
      </Host>
      <div style={{position: 'absolute', left: 0, top: -110, width: 1920, height: 1080, pointerEvents: 'none', opacity: prog(f, byeAt, 6, easeOut)}}>
        <Confetti t={f - byeAt} w={1920} h={1080} n={120} />
      </div>
    </>
  );
};
export const A7Sfx: SfxCue[] = [
  ['pop', cf(114), 0.4],
  ['confetti', cf(115), 0.5],
  ['ding', cf(115) + 2, 0.3],
];
