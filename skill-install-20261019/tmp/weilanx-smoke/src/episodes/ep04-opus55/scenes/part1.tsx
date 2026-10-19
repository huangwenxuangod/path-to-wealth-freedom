import React from 'react';
import {easeOut, easeOutBack, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Emote} from '../../../library/fx';
import {Check, Cross, Stamp, stampScale} from '../../../library/icons';
import {GitHubMark, Photo, ScreenVideo, Win} from '../../../library/items/apps';
import {Trophy} from '../../../library/items/objects';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

/** 三层小蛋糕：「甜点模型」 */
const Cake: React.FC<{size?: number; f: number}> = ({size = 220, f}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="14" y="62" width="72" height="26" rx="6" fill="#F7CFD6" stroke={C.ink} strokeWidth={4} />
    <rect x="24" y="40" width="52" height="24" rx="6" fill="#FFF3B8" stroke={C.ink} strokeWidth={4} />
    <path d="M24 48 Q32 56 40 48 Q48 56 56 48 Q64 56 76 48" fill="none" stroke={C.white} strokeWidth={4} />
    <rect x="46" y="22" width="8" height="18" rx="2" fill={C.teal} stroke={C.ink} strokeWidth={3} />
    <path d={`M50 ${8 + Math.sin(f * 0.4) * 2} Q56 16 50 20 Q44 16 50 ${8 + Math.sin(f * 0.4) * 2} Z`} fill={C.orange} stroke={C.ink} strokeWidth={2} />
    <circle cx="36" cy="75" r="4" fill={C.red} />
    <circle cx="64" cy="75" r="4" fill={C.red} />
  </svg>
);

/* ---------- S1 我宣布：Opus 5.5 是最强甜点模型 ---------- */
export const S1Declare: React.FC<{f: number}> = ({f}) => {
  const nameAt = cw(1, 'Opus');
  const sweetAt = cw(2, '最强');
  return (
    <Host f={f} wear={['headphones']} eyes={f >= sweetAt ? 'star' : 'open'} armsUp={f >= nameAt && f < sweetAt + 30 ? 0.9 : 0}>
      <Pop f={f} at={cf(1)} x={0} y={0} rot={-4}>
        <Stamp text="我宣布" size={52} />
      </Pop>
      <Pop f={f} at={nameAt} x={0} y={80}>
        <div style={bigText(130, C.yellow)}>Opus 5.5</div>
      </Pop>
      <Pop f={f} at={sweetAt} x={0} y={240}>
        <div style={bigText(80, C.white)}>最强甜点模型</div>
      </Pop>
      <Pop f={f} at={cw(2, '甜点')} x={560} y={40} rot={6}>
        <Cake f={f} />
      </Pop>
      <Burst f={f} at={cw(2, '甜点') + 4} x={670} y={150} r={220} n={14} />
      <Pop f={f} at={cf(3)} x={0} y={380} enter="left">
        <Note color={C.tealLight} size={40}>性能 ≈ 旗舰</Note>
      </Pop>
      <Pop f={f} at={cf(4)} x={320} y={380} enter="left">
        <Note color={C.pink} size={40}>价格便宜一大截</Note>
      </Pop>
    </Host>
  );
};
export const S1Sfx: SfxCue[] = [
  ['stamp', cf(1), 0.5],
  ['magic', cw(1, 'Opus'), 0.4],
  ['pop', cw(2, '最强'), 0.4],
  ['confetti', cw(2, '甜点') + 2, 0.3],
  ['pop', cf(3), 0.3],
  ['pop', cf(4), 0.3],
];

/* ---------- S2 前几期就是用它做的；这期聊两件事 ---------- */
export const S2Plan: React.FC<{f: number}> = ({f}) => {
  const clipAt = cf(5) - 6;
  return (
    <>
      <Pop f={f} at={clipAt} x={80} y={20} enter="up">
        <Win w={760} h={480} title="前几期的动画视频">
          <ScreenVideo src="footage/ep03-cc.mp4" at={clipAt} startFrom={260} w={752} h={423} />
        </Win>
      </Pop>
      <Pop f={f} at={cw(6, 'Opus')} x={140} y={530} rot={-3}>
        <Note color={C.yellow} size={40}>
          就是用 Opus 5.5 做的 <Check size={36} />
        </Note>
      </Pop>
      <Pop f={f} at={cf(7)} x={960} y={40}>
        <div style={bigText(64, C.white)}>这期聊两件事</div>
      </Pop>
      {[
        {t: '① 大家为什么这么夸它', at: cf(8), bg: '#FFF3B8'},
        {t: '② 怎么用才能把它用好', at: cf(9), bg: C.tealLight},
      ].map((x, i) => (
        <Pop key={x.t} f={f} at={x.at} x={960} y={170 + i * 150} enter="left">
          <Card w={580} h={110} pad={0} bg={x.bg} style={{display: 'flex', alignItems: 'center', padding: '0 28px'}}>
            <div style={txt(46)}>{x.t}</div>
          </Card>
        </Pop>
      ))}
      <PiP f={f} at={clipAt} wear={['headphones']} />
    </>
  );
};
export const S2Sfx: SfxCue[] = [
  ['whoosh', cf(5) - 6, 0.3],
  ['ding', cw(6, 'Opus'), 0.3],
  ['pop', cf(7), 0.3],
  ['click', cf(8), 0.35],
  ['click', cf(9), 0.35],
];

/* ---------- S3 强：Artificial Analysis 智能指数 58，当天第一 ---------- */
export const S3Index: React.FC<{f: number}> = ({f}) => {
  const scoreAt = cf(12);
  const n = Math.round(58 * prog(f, scoreAt, 20, easeOut));
  return (
    <>
      <Pop f={f} at={cf(11)} x={80} y={130} enter="up">
        <Card w={760} h={440} bg={C.white}>
          <div style={txt(30, C.inkSoft)}>第三方机构</div>
          <div style={txt(52)}>Artificial Analysis</div>
          <div style={txt(40, C.inkSoft)}>智能指数</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10, opacity: f >= scoreAt ? 1 : 0}}>
            <div style={bigText(190, C.yellow)}>{n}</div>
            <div style={txt(60)}>分</div>
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(13)} x={1000} y={120}>
        <Trophy size={300} />
      </Pop>
      <Burst f={f} at={cf(13) + 4} x={1150} y={270} r={260} n={16} />
      <Pop f={f} at={cf(13) + 6} x={950} y={450} rot={-3}>
        <div style={bigText(80, C.yellow)}>发布当天第一</div>
      </Pop>
      <PiP f={f} at={cf(10) - 6} skin="cowboy" />
    </>
  );
};
export const S3Sfx: SfxCue[] = [
    ['paper', cf(11), 0.35],
  ['type', cf(12), 0.3],
  ['ding', cf(12) + 20, 0.35],
  ['confetti', cf(13), 0.4],
];

/* ---------- S4 FrontierCode：medium 就超过 GPT-6 Astra 最高成绩，成本约 1/5 ---------- */
const BAR = 13;
const Coin: React.FC = () => (
  <svg width={120} height={52} viewBox="0 0 70 30">
    <ellipse cx="35" cy="15" rx="32" ry="12" fill={C.yellow} stroke={C.ink} strokeWidth={4} />
    <text x="35" y="21" textAnchor="middle" fontSize="16" fontWeight="bold" fill={C.ink}>$</text>
  </svg>
);
const CoinStack: React.FC<{n: number; f: number; at: number}> = ({n, f, at}) => (
  <div style={{display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
    {Array.from({length: n}, (_, i) => (f >= at + i * 3 ? <div key={i} style={{marginTop: -22, transform: `translateY(${(1 - prog(f, at + i * 3, 6, easeOut)) * -60}px)`}}><Coin /></div> : null))}
  </div>
);

export const S4Frontier: React.FC<{f: number}> = ({f}) => {
  const opusAt = cw(15, 'medium');
  const astraAt = cf(16);
  const beatAt = cw(16, '最高');
  const rows = [
    {name: 'Opus 5.5', sub: '默认 medium 档', v: 54.6, at: opusAt, color: C.orange},
    {name: 'GPT-6 Astra', sub: '最高成绩', v: 53.3, at: astraAt, color: '#C9CDD2'},
  ];
  return (
    <>
      <Pop f={f} at={cf(14)} x={80} y={0}>
        <Note color={C.yellow} size={38}>官方公布 · FrontierCode 测试</Note>
      </Pop>
      {rows.map((r, i) => {
        if (f < r.at) return null;
        const w = prog(f, r.at, 16, easeOut) * r.v * BAR;
        return (
          <div key={r.name} style={{position: 'absolute', left: 80, top: 110 + i * 150}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
              <div style={txt(40)}>{r.name}</div>
              <div style={txt(28, C.inkSoft)}>{r.sub}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 8}}>
              <div style={{width: w, height: 56, background: r.color, border: `4px solid ${C.ink}`, borderRadius: 12, boxSizing: 'border-box'}} />
              <div style={txt(44)}>{(r.v * prog(f, r.at, 16)).toFixed(1)}%</div>
            </div>
          </div>
        );
      })}
      {f >= beatAt && (
        <div style={{position: 'absolute', left: 960, top: 100, transform: `scale(${stampScale(f, beatAt)}) rotate(-8deg)`}}>
          <Stamp text="超过！" size={56} />
        </div>
      )}
      <Pop f={f} at={cf(17)} x={80} y={440}>
        <div style={txt(40)}>每个任务的成本</div>
      </Pop>
      <div style={{position: 'absolute', left: 460, top: 400, display: 'flex', gap: 80, alignItems: 'flex-end'}}>
        {[
          {n: 1, label: 'Opus 5.5', at: cf(17) + 6},
          {n: 5, label: 'GPT-6 Astra', at: cf(17) + 10},
        ].map((s) => (
          <div key={s.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: 260, justifyContent: 'flex-end', opacity: f >= s.at ? 1 : 0}}>
            <CoinStack n={s.n} f={f} at={s.at} />
            <div style={{...txt(30), marginTop: 10}}>{s.label}</div>
          </div>
        ))}
      </div>
      <Pop f={f} at={cw(18, '五分之一')} x={900} y={500} rot={-3}>
        <div style={bigText(84, C.yellow)}>≈ 1/5</div>
      </Pop>
      <PiP f={f} at={cf(14) - 6} skin="cowboy" />
    </>
  );
};
export const S4Sfx: SfxCue[] = [
  ['pop', cf(14), 0.35],
  ['whoosh', cw(15, 'medium'), 0.3],
  ['whoosh', cf(16), 0.3],
  ['stamp', cw(16, '最高'), 0.5],
  ...[0, 1, 2, 3, 4, 5].map((i) => ['click', cf(17) + 6 + i * 3, 0.2] as SfxCue),
  ['ding', cw(18, '五分之一'), 0.35],
];

/* ---------- S5 Sentry 创始人：几乎分不出它和 Fable 的区别 ---------- */
export const S5Quote: React.FC<{f: number}> = ({f}) => {
  const sameAt = cw(20, '分不出');
  return (
    <>
      <Pop f={f} at={cf(19)} x={80} y={40} enter="up">
        <Card w={860} h={420} bg="#FFFDF7" style={{position: 'relative'}}>
          <div style={{...bigText(140, C.yellow), position: 'absolute', left: 20, top: -40}}>“</div>
          <div style={{...txt(40), marginTop: 70, lineHeight: 1.5}}>
            用它跑完几个大任务后，
            <br />
            <Marker p={prog(f, sameAt, 12)}>几乎分不出它和 Fable 的区别</Marker>
          </div>
          <div style={{...txt(32, C.inkSoft), position: 'absolute', right: 40, bottom: 30}}>—— David Cramer，Sentry 创始人</div>
        </Card>
      </Pop>
      {f >= cf(19) + 6 && (
        <>
          <Char f={f} x={1130} y={640} s={0.8} wear={['headphones']} lookX={0.4} eyes={f >= sameAt ? 'happy' : 'open'} />
          <Char f={f + 40} x={1440} y={640} s={0.8} wear={['headphones']} lookX={-0.4} eyes={f >= sameAt ? 'happy' : 'open'} />
        </>
      )}
      <Pop f={f} at={cf(19) + 6} x={1060} y={660}>
        <Note size={32}>Opus 5.5</Note>
      </Pop>
      <Pop f={f} at={cf(19) + 10} x={1390} y={660}>
        <Note size={32}>Fable</Note>
      </Pop>
      <Pop f={f} at={sameAt} x={1240} y={300}>
        <div style={bigText(110, C.yellow)}>≈</div>
      </Pop>
      <Emote f={f} at={sameAt + 4} kind="?" x={1290} y={300} />
      <PiP f={f} at={cf(19) - 6} skin="detective" />
    </>
  );
};
export const S5Sfx: SfxCue[] = [
  ['paper', cf(19), 0.35],
  ['pop', cf(19) + 6, 0.25],
  ['boing', cw(20, '分不出'), 0.35],
];

/* ---------- S6 快：不是吐字快，是干活快，一遍做对 ---------- */
const TASKS = ['读需求', '改代码', '跑测试'];

export const S6Fast: React.FC<{f: number}> = ({f}) => {
  const workAt = cf(23);
  const onceAt = cf(25);
  const typed = Math.max(0, Math.floor((f - cf(22)) * 1.6));
  const filler = '好的，我来帮你看看这个问题。首先，我们需要理解……';
  return (
    <>
      <Pop f={f} at={cf(22)} x={80} y={130} enter="up">
        <div style={{position: 'relative'}}>
          <Win w={620} h={400} title="只是吐字快">
            <div style={{...txt(34), padding: 26, lineHeight: 1.5}}>{filler.slice(0, typed % (filler.length + 10))}</div>
          </Win>
          {f >= workAt && (
            <div style={{position: 'absolute', left: 250, top: 140}}>
              <Cross size={140} p={prog(f, workAt, 10)} />
            </div>
          )}
        </div>
      </Pop>
      <Pop f={f} at={workAt} x={780} y={130} enter="up">
        <div style={{position: 'relative'}}>
          <Win w={640} h={400} title="干活快">
            <div style={{padding: '30px 34px'}}>
              {TASKS.map((t, i) => {
                const at = cf(24) + i * 7;
                return (
                  <div key={t} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26}}>
                    <div style={{width: 56, height: 56, border: `4px solid ${C.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.white}}>
                      {f >= at && <Check size={48} p={prog(f, at, 6)} />}
                    </div>
                    <div style={txt(44)}>{t}</div>
                  </div>
                );
              })}
            </div>
          </Win>
          {f >= onceAt && (
            <div style={{position: 'absolute', left: 390, top: 230, transform: `scale(${stampScale(f, onceAt)}) rotate(-10deg)`}}>
              <Stamp text="一遍过" size={60} color="#3DAA6B" />
            </div>
          )}
        </div>
      </Pop>
      <PiP f={f} at={cf(21) - 6} skin="santa" />
    </>
  );
};
export const S6Sfx: SfxCue[] = [
  ['whoosh', cf(21), 0.35],
  ['type', cf(22), 0.35],
  ['error', cf(23), 0.3],
  ...TASKS.map((_, i) => ['ding', cf(24) + i * 7, 0.25] as SfxCue),
  ['stamp', cf(25), 0.5],
];

/* ---------- S7 GitHub：同样的任务，步骤和 token 更少 ---------- */
const STEPS = [
  {name: 'Opus 5', n: 9, color: '#C9CDD2'},
  {name: 'Opus 5.5', n: 5, color: C.orange},
];

export const S7Steps: React.FC<{f: number}> = ({f}) => {
  const start = cf(27);
  return (
    <>
      <Pop f={f} at={cf(26)} x={80} y={10}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <GitHubMark size={80} />
          <div style={bigText(64, C.white)}>GitHub 的测试</div>
        </div>
      </Pop>
      <Pop f={f} at={cf(27)} x={80} y={140}>
        <Note color={C.tealLight} size={36}>完成同样的任务</Note>
      </Pop>
      {STEPS.map((s, r) => (
        <div key={s.name} style={{position: 'absolute', left: 80, top: 250 + r * 150, display: 'flex', alignItems: 'center', gap: 14, opacity: f >= start ? 1 : 0}}>
          <div style={{...txt(40), width: 200}}>{s.name}</div>
          {Array.from({length: s.n}, (_, i) => {
            const at = start + 6 + i * 6;
            if (f < at) return <div key={i} style={{width: 90}} />;
            return (
              <div key={i} style={{width: 76, height: 76, borderRadius: 16, border: `4px solid ${C.ink}`, background: s.color, boxSizing: 'border-box', transform: `scale(${prog(f, at, 6, easeOutBack)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(30)}}>{i + 1}</div>
            );
          })}
          {f >= start + 6 + s.n * 6 && <Check size={64} />}
        </div>
      ))}
      <Pop f={f} at={cw(28, '明显')} x={1000} y={520} rot={-3}>
        <div style={bigText(64, C.yellow)}>步骤、token 都更少</div>
      </Pop>
      <Pop f={f} at={cw(28, '明显') + 10} x={80} y={570}>
        <Note color={C.panel} size={28}>示意图，不是实测步数</Note>
      </Pop>
      <PiP f={f} at={cf(26) - 6} skin="santa" />
    </>
  );
};
export const S7Sfx: SfxCue[] = [
  ['pop', cf(26), 0.35],
  ...Array.from({length: 9}, (_, i) => ['click', cf(27) + 6 + i * 6, 0.18] as SfxCue),
  ['ding', cw(28, '明显'), 0.4],
];

/* ---------- S8 便宜：输入 $4、输出 $20、缓存读取 $0.2 ---------- */
const PriceRow: React.FC<{f: number; at: number; label: string; from: string; to: string; cut: string; hot?: boolean; stampAt: number}> = ({f, at, label, from, to, cut, hot, stampAt}) => {
  if (f < at) return null;
  const p = prog(f, at, 10, easeOut);
  const strike = prog(f, at + 8, 10);
  const s = stampScale(f, stampAt);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, marginBottom: 26}}>
      <div style={{...txt(40), width: 170}}>{label}</div>
      <div style={{position: 'relative', ...txt(44, C.inkSoft)}}>
        {from}
        <div style={{position: 'absolute', left: -4, top: '52%', height: 5, width: `${strike * 110}%`, background: C.red, borderRadius: 3}} />
      </div>
      <div style={txt(40, C.inkSoft)}>→</div>
      <div style={bigText(64, hot ? C.yellow : C.white)}>{to}</div>
      {s > 0 && (
        <div style={{transform: `scale(${s}) rotate(-8deg)`}}>
          <Stamp text={cut} size={hot ? 50 : 38} color={hot ? C.red : '#3DAA6B'} />
        </div>
      )}
    </div>
  );
};

export const S8Price: React.FC<{f: number}> = ({f}) => {
  const outAt = cw(31, '输出');
  const cacheAt = cf(33);
  const hotAt = cw(33, '0.2');
  return (
    <>
      <Pop f={f} at={cf(29)} x={1150} y={500} rot={-6}>
        <div style={bigText(110, C.yellow)}>便宜了！</div>
      </Pop>
      <Pop f={f} at={cf(30)} x={60} y={90} enter="up">
        <Photo src="images/ep04-opus55/prices.png" natW={872} natH={504} w={760} marks={[
          {x: 108, y: 150, w: 175, h: 280, p: prog(f, cf(31), 12), color: C.teal},
          {x: 348, y: 150, w: 175, h: 280, p: prog(f, outAt, 12), color: C.teal},
          {x: 588, y: 150, w: 175, h: 280, p: prog(f, cacheAt, 12), color: C.red},
        ]} />
      </Pop>
      <Pop f={f} at={cf(30)} x={900} y={20}>
        <Note size={32}>每一百万个 token · API 标价</Note>
      </Pop>
      <div style={{position: 'absolute', left: 900, top: 120}}>
        <PriceRow f={f} at={cf(31)} label="输入" from="$5" to="$4" cut="−20%" stampAt={cf(32)} />
        <PriceRow f={f} at={outAt} label="输出" from="$25" to="$20" cut="−20%" stampAt={cf(32) + 4} />
        <PriceRow f={f} at={cacheAt} label="缓存读取" from="$0.50" to="$0.20" cut="−60%" hot stampAt={hotAt} />
      </div>
      <Burst f={f} at={hotAt + 4} x={1450} y={400} r={220} n={14} />
      <PiP f={f} at={cf(29) - 6} skin="chef" />
    </>
  );
};
export const S8Sfx: SfxCue[] = [
  ['pop', cf(29), 0.5],
  ['whoosh', cf(30), 0.3],
  ['click', cf(31), 0.35],
  ['click', cw(31, '输出'), 0.35],
  ['stamp', cf(32), 0.45],
  ['stamp', cf(32) + 4, 0.35],
  ['click', cf(33), 0.35],
  ['stamp', cw(33, '0.2'), 0.6],
  ['magic', cw(33, '0.2') + 4, 0.3],
];

/* ---------- S9 更懂事：想得更深、计划不用改、回答更好读 ---------- */
const SMART = [
  {t: '默认就会想得更深', n: 36},
  {t: '计划几乎不用改', n: 37},
  {t: '回答更好读', n: 38},
];

export const S9Smart: React.FC<{f: number}> = ({f}) => {
  const planAt = cw(37, '不用改');
  return (
    <>
      <Pop f={f} at={cf(34)} x={80} y={30}>
        <Note color={C.panel} size={36}>很多人都提到</Note>
      </Pop>
      <Pop f={f} at={cf(35)} x={80} y={100}>
        <div style={bigText(96, C.yellow)}>它更懂事了</div>
      </Pop>
      {SMART.map((s, i) => (
        <Pop key={s.t} f={f} at={cf(s.n)} x={80} y={270 + i * 110} enter="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check size={60} />
            <div style={txt(50)}>{s.t}</div>
          </div>
        </Pop>
      ))}
      <Pop f={f} at={cf(36)} x={900} y={60} enter="right">
        <div style={{position: 'relative'}}>
          <Win w={600} h={460} title="plan.md">
            <div style={{padding: '26px 30px'}}>
              {[0.9, 0.7, 0.8, 0.55, 0.85, 0.6].map((w, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, opacity: prog(f, cf(36) + 4 + i * 3, 6)}}>
                  <div style={{...txt(28, C.inkSoft), width: 30}}>{i + 1}.</div>
                  <div style={{width: 460 * w, height: 22, borderRadius: 11, background: '#E4DED2'}} />
                </div>
              ))}
            </div>
          </Win>
          {f >= planAt && (
            <div style={{position: 'absolute', left: 300, top: 290, transform: `scale(${stampScale(f, planAt)}) rotate(-8deg)`}}>
              <Stamp text="0 处修改" size={52} color="#3DAA6B" />
            </div>
          )}
        </div>
      </Pop>
      <Emote f={f} at={cf(35) + 4} kind="heart" x={600} y={120} />
      <PiP f={f} at={cf(34) - 6} skin="detective" eyes="happy" />
    </>
  );
};
export const S9Sfx: SfxCue[] = [
  ['pop', cf(34), 0.3],
  ['magic', cf(35), 0.4],
  ['paper', cf(36), 0.3],
  ...SMART.map((s) => ['ding', cf(s.n), 0.3] as SfxCue),
  ['stamp', cw(37, '不用改'), 0.5],
];
