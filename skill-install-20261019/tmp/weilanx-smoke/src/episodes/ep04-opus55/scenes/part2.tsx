import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Confetti, Emote} from '../../../library/fx';
import {Check, Cross, StopSign, Trash} from '../../../library/icons';
import {Stopwatch, Win} from '../../../library/items/apps';
import {Host, PiP} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';

// 舞台 1920×820；B-roll 右下角 x≥1580、y≥540 留给主持人

/* ---------- S10 怎么用好它：四个技巧 ---------- */
const TIPS = ['别写「请仔细思考」', 'effort 不是越高越好', '删掉防加戏的话', '给它一个检查办法'];

export const S10Tips: React.FC<{f: number}> = ({f}) => (
  <Host f={f} skin="chef" eyes="happy">
    <Pop f={f} at={cf(39)} x={0} y={0}>
      <div style={bigText(84, C.yellow)}>怎么用好它？</div>
    </Pop>
    {TIPS.map((t, i) => (
      <Pop key={t} f={f} at={cf(40) + 8 + i * 6} x={0} y={130 + i * 84} enter="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{...txt(34, C.white), width: 56, height: 56, borderRadius: 28, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={txt(48)}>{t}</div>
        </div>
      </Pop>
    ))}
  </Host>
);
export const S10Sfx: SfxCue[] = [
  ['pop', cf(39), 0.4],
  ...TIPS.map((_, i) => ['click', cf(40) + 8 + i * 6, 0.3] as SfxCue),
];

/* ---------- S11 技巧一：别写「请仔细思考」，直接调 effort ---------- */
const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max'];

/** 五档 effort 滑杆，knob 为连续档位（0 = low … 4 = max） */
const EffortSlider: React.FC<{knob: number; w?: number}> = ({knob, w = 820}) => {
  const step = w / (LEVELS.length - 1);
  return (
    <div style={{position: 'relative', width: w, height: 120}}>
      <div style={{position: 'absolute', left: 0, top: 26, width: w, height: 16, borderRadius: 8, background: '#E4DED2', border: `3px solid ${C.ink}`}} />
      <div style={{position: 'absolute', left: 0, top: 26, width: knob * step, height: 16, borderRadius: 8, background: C.orange, border: `3px solid ${C.ink}`}} />
      {LEVELS.map((l, i) => (
        <div key={l} style={{position: 'absolute', left: i * step, top: 64, transform: 'translateX(-50%)', ...txt(32, Math.round(knob) === i ? C.ink : C.inkSoft)}}>{l}</div>
      ))}
      <div style={{position: 'absolute', left: knob * step, top: 12, width: 44, height: 44, marginLeft: -22, borderRadius: 22, background: C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
    </div>
  );
};

export const S11Think: React.FC<{f: number}> = ({f}) => {
  const strikeAt = cw(42, '请仔细') + 12;
  const waitAt = cf(43);
  const dialAt = cw(45, 'effort');
  return (
    <>
      <Pop f={f} at={cf(41)} x={80} y={20} enter="up">
        <Win w={820} h={260} title="提示词">
          <div style={{...txt(42), padding: '44px 34px'}}>
            帮我重构这个模块，
            <span style={{position: 'relative'}}>
              <Marker p={prog(f, cw(42, '请仔细'), 8)} color={C.pink}>请仔细思考</Marker>
              <span style={{position: 'absolute', left: -6, top: '52%', height: 6, width: `${prog(f, strikeAt, 8) * 106}%`, background: C.red, borderRadius: 3}} />
            </span>
            。
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={waitAt} x={1000} y={10}>
        <Stopwatch size={200} p={prog(f, waitAt, 50)} />
      </Pop>
      <Pop f={f} at={waitAt + 6} x={1230} y={90} rot={3}>
        <Note color={C.pink} size={40}>只会等更久</Note>
      </Pop>
      <Emote f={f} at={waitAt + 10} kind="zzz" x={1300} y={40} />
      <Pop f={f} at={cf(44)} x={80} y={350}>
        <div style={txt(40)}>想让它多想？直接调 <Marker p={prog(f, dialAt, 10)}>effort</Marker></div>
      </Pop>
      <Pop f={f} at={cf(44) + 6} x={120} y={440} enter="up">
        <EffortSlider knob={lerp(1, 2, prog(f, dialAt + 6, 14, easeInOut))} />
      </Pop>
      <PiP f={f} at={cf(41) - 6} skin="chef" />
    </>
  );
};
export const S11Sfx: SfxCue[] = [
  ['paper', cf(41), 0.35],
  ['snip', cw(42, '请仔细') + 12, 0.4],
  ['question', cf(43), 0.3],
  ['pop', cf(44), 0.3],
  ['shake', cw(45, 'effort') + 6, 0.35],
];

/* ---------- S12 技巧二：effort 不是越高越好 ---------- */
const LX = (i: number) => 80 + i * 290;

export const S12Effort: React.FC<{f: number}> = ({f}) => {
  const medAt = cf(47);
  const testAt = cf(49);
  const highAt = cw(51, 'high');
  const maxAt = cf(52);
  const bg = (l: string) => (l === 'medium' && f >= medAt ? C.yellow : l === 'high' && f >= highAt ? C.tealLight : l === 'max' && f >= maxAt ? '#E6E1D6' : C.white);
  return (
    <>
      {LEVELS.map((l, i) => (
        <Pop key={l} f={f} at={cf(46) + 6 + i * 4} x={LX(i)} y={150}>
          <div style={{position: 'relative', width: 240, height: 96, border: `4px solid ${C.ink}`, borderRadius: 16, background: bg(l), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 5px 0 rgba(43,35,32,0.14)', ...txt(46)}}>
            {l}
            {l === 'max' && f >= maxAt && (
              <div style={{position: 'absolute', left: 60, top: -10}}>
                <Cross size={110} p={prog(f, maxAt + 6, 10)} />
              </div>
            )}
          </div>
        </Pop>
      ))}
      <Pop f={f} at={medAt} x={LX(1) + 120} y={290} center>
        <div style={{textAlign: 'center'}}>
          <div style={bigText(56, C.orange)}>▲</div>
          <Note color={C.yellow} size={34}>默认，已经很强</Note>
        </div>
      </Pop>
      <Pop f={f} at={testAt} x={80} y={420} enter="left">
        <Card w={780} h={120} pad={0} bg={C.white} style={{display: 'flex', alignItems: 'center', padding: '0 24px'}}>
          <div style={txt(36)}>
            有些测试里：<span style={{color: C.orange}}>medium</span> 比 high、max 还好
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(50)} x={880} y={400} enter="left">
        <Note color={C.tealLight} size={38}>长时间跑的 Agent 任务</Note>
      </Pop>
      <Pop f={f} at={highAt} x={880} y={480}>
        <div style={bigText(60, C.teal)}>→ 开到 high 就够了</div>
      </Pop>
      <Pop f={f} at={maxAt + 6} x={900} y={590} rot={-3}>
        <Note color={C.pink} size={38}>max 很少值回票价</Note>
      </Pop>
      <PiP f={f} at={cf(46) - 6} skin="cowboy" />
    </>
  );
};
export const S12Sfx: SfxCue[] = [
  ['pop', cf(46), 0.4],
  ...LEVELS.map((_, i) => ['click', cf(46) + 6 + i * 4, 0.22] as SfxCue),
  ['ding', cf(47), 0.35],
  ['pop', cf(49), 0.3],
  ['pop', cf(50), 0.3],
  ['ding', cw(51, 'high'), 0.35],
  ['error', cf(52) + 6, 0.35],
];

/* ---------- S13 技巧三：删掉「不要加我没要求的东西」 ---------- */
const RULES = ['用 TypeScript 写', '先写测试再实现', '不要加我没要求的东西', '提交前跑一遍 lint'];
const HIT = 2;

export const S13Rule: React.FC<{f: number}> = ({f}) => {
  const hiAt = cf(54);
  const goAt = cw(55, '删掉');
  const fly = prog(f, goAt, 16, easeInOut);
  return (
    <>
      <Pop f={f} at={cf(53)} x={80} y={30}>
        <Note color={C.panel} size={36}>以前为了防它加戏……</Note>
      </Pop>
      <Pop f={f} at={cf(53)} x={80} y={120} enter="up">
        <Win w={900} h={440} title="CLAUDE.md">
          <div style={{position: 'relative', padding: '30px 34px'}}>
            {RULES.map((r, i) => {
              const hit = i === HIT;
              const style: React.CSSProperties = hit && f >= goAt
                ? {transform: `translate(${fly * 880}px, ${fly * 260}px) rotate(${fly * 30}deg) scale(${1 - 0.6 * fly})`, opacity: 1 - prog(f, goAt + 10, 8)}
                : {};
              return (
                <div key={r} style={{display: 'flex', alignItems: 'center', gap: 14, height: 80, ...style}}>
                  <div style={txt(38, C.inkSoft)}>-</div>
                  <div style={txt(42)}>{hit ? <Marker p={prog(f, hiAt, 10)} color={C.pink}>{r}</Marker> : r}</div>
                </div>
              );
            })}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={hiAt + 10} x={1060} y={60} rot={3}>
        <div style={bigText(60, C.yellow)}>现在可以删了</div>
      </Pop>
      <Pop f={f} at={goAt - 10} x={1120} y={440}>
        <Trash size={200} lid={prog(f, goAt, 8) * (1 - prog(f, goAt + 20, 8))} />
      </Pop>
      <PiP f={f} at={cf(53) - 6} skin="detective" />
    </>
  );
};
export const S13Sfx: SfxCue[] = [
  ['paper', cf(53), 0.35],
  ['pop', cf(54), 0.3],
  ['pop', cf(54) + 10, 0.3],
  ['whoosh', cw(55, '删掉'), 0.4],
  ['ding', cw(55, '删掉') + 18, 0.3],
];

/* ---------- S14 技巧四：给它检查办法 + 预算和停止点 ---------- */
const TESTS = ['登录流程', '价格计算', '导出文件'];

export const S14Check: React.FC<{f: number}> = ({f}) => {
  const testAt = cf(57);
  const budgetAt = cf(58);
  const stopAt = cw(59, '停下来');
  const used = prog(f, budgetAt + 6, 50, easeOut) * 0.8;
  return (
    <>
      <Pop f={f} at={testAt} x={80} y={120} enter="up">
        <Win w={640} h={420} title="npm test" dark>
          <div style={{padding: '30px 34px'}}>
            {TESTS.map((t, i) => {
              const at = testAt + 8 + i * 8;
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, height: 80, opacity: f >= at ? 1 : 0.25}}>
                  {f >= at ? <Check size={48} p={prog(f, at, 6)} /> : <div style={{width: 48}} />}
                  <div style={txt(40, C.white)}>{t}</div>
                </div>
              );
            })}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={budgetAt} x={800} y={130} enter="left">
        <Card w={700} h={250} bg={C.white}>
          <div style={txt(40)}>自己跑长任务前，先定好：</div>
          <div style={{...txt(34, C.inkSoft), marginTop: 20}}>预算</div>
          <div style={{height: 40, marginTop: 8, border: `4px solid ${C.ink}`, borderRadius: 20, overflow: 'hidden', background: '#F3EFE6', position: 'relative'}}>
            <div style={{width: `${used * 100}%`, height: '100%', background: used > 0.7 ? C.red : C.orange}} />
            <div style={{position: 'absolute', left: '80%', top: -4, bottom: -4, width: 5, background: C.ink}} />
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={stopAt} x={1060} y={420}>
        <StopSign size={170} label="停" />
      </Pop>
      <Pop f={f} at={stopAt + 6} x={1250} y={470} rot={3}>
        <Note color={C.yellow} size={38}>停下来的点</Note>
      </Pop>
      <PiP f={f} at={cf(56) - 6} wear={['headphones']} />
    </>
  );
};
export const S14Sfx: SfxCue[] = [
  ['pop', cf(56), 0.4],
  ['type', cf(57), 0.3],
  ...TESTS.map((_, i) => ['ding', cf(57) + 8 + i * 8, 0.25] as SfxCue),
  ['pop', cf(58), 0.3],
  ['stamp', cw(59, '停下来'), 0.5],
];

/* ---------- S15 结尾 ---------- */
export const S15Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(61);
  return (
    <>
      <Host f={f} skin="santa" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(60)} x={0} y={60}>
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
export const S15Sfx: SfxCue[] = [
  ['pop', cf(60), 0.4],
  ['confetti', cf(61), 0.5],
  ['ding', cf(61) + 2, 0.3],
];
