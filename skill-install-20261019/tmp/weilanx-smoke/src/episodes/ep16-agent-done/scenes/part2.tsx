import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Burst, Confetti, FocusLines} from '../../../library/fx';
import {Check, CheckBox, Cross, Flag} from '../../../library/icons';
import {Cursor, Stopwatch, Win} from '../../../library/items/apps';
import {HostTall, PiP, PIP_TALL} from '../../../library/sets/Studio';
import type {SfxCue} from '../../../library/types';
import {bigText, Card, Marker, Note, Pop, txt} from '../../../library/ui';
import {cf, cw} from '../cues';
import {Bubble} from './part1';

// 竖屏 3:4 舞台 1080×1080；右下角 x≥820、y≥860 留给主持人

/* ---------- D5 过渡：三个做法 ---------- */
const TIPS = ['先说清楚怎样才算做完', '让它自己跑一遍、查一遍', '关键的地方自己抽查'];

export const D5Tips: React.FC<{f: number}> = ({f}) => {
  const listAt = cf(34);
  return (
    <HostTall f={f} wear={['headphones']} eyes={f >= listAt ? 'happy' : 'open'} armsUp={f >= listAt && f < listAt + 24 ? 0.8 : 0}>
      <Pop f={f} at={cf(33)} x={0} y={0} rot={-2}>
        <div style={bigText(80, C.yellow)}>怎么让它真做完？</div>
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
export const D5Sfx: SfxCue[] = [
  ['question', cf(33), 0.35],
  ...TIPS.map((_, i) => ['click', cf(34) + 6 + i * 6, 0.3] as SfxCue),
];

/* ---------- D6 做法一：写成一条条验收标准，它就知道做到哪才停 ---------- */
const CRITERIA = [
  {t: '页面能正常打开', at: () => cf(36)},
  {t: '按钮点了有反应', at: () => cf(37)},
  {t: '原来的测试全部通过', at: () => cf(38)},
];

export const D6Criteria: React.FC<{f: number}> = ({f}) => {
  const runAt = cf(39); // 第 40 句离场景结束太近，提前到第 39 句开始走
  const run = prog(f, runAt, 40, easeInOut);
  const stopAt = cf(40);
  return (
    <>
      <Pop f={f} at={cf(35)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          先说清楚<span style={{color: C.yellow}}>怎样才算做完</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(36) - 4} x={60} y={140} enter="up">
        <Card w={760} h={380} bg="#FFFDF7">
          <div style={txt(42, C.orangeDark)}>验收标准</div>
          {CRITERIA.map((c, i) => (
            <div key={c.t} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 28, opacity: prog(f, c.at(), 6)}}>
              <CheckBox size={60} p={prog(run, (i + 1) / 4, 0.12)} />
              <div style={txt(44)}>{c.t}</div>
            </div>
          ))}
        </Card>
      </Pop>
      <Pop f={f} at={cf(39)} x={640} y={500} rot={4}>
        <Note color={C.yellow} size={34}>写成一条一条的</Note>
      </Pop>
      {f >= runAt - 6 && (
        <svg width={760} height={40} style={{position: 'absolute', left: 60, top: 840, opacity: prog(f, runAt - 6, 6)}}>
          <line x1={0} y1={20} x2={700} y2={20} stroke={C.ink} strokeWidth={6} strokeDasharray="18 10" />
        </svg>
      )}
      {f >= runAt - 6 && (
        <div style={{position: 'absolute', left: 680, top: 720, opacity: prog(f, runAt - 6, 6)}}>
          <Flag size={110} f={f} />
        </div>
      )}
      <Char f={f} x={lerp(120, 620, run)} y={860} s={0.75} kind="bot" walk={run > 0 && run < 1} eyes={run >= 1 ? 'happy' : 'open'} opacity={prog(f, runAt - 6, 6)} />
      <Burst f={f} at={stopAt} x={700} y={780} r={160} />
      <Pop f={f} at={stopAt} x={140} y={600} rot={-3}>
        <div style={bigText(60, C.yellow)}>做到这一步才停</div>
      </Pop>
      <PiP f={f} at={cf(35) - 6} skin="detective" {...PIP_TALL} />
    </>
  );
};
export const D6Sfx: SfxCue[] = [
  ['pop', cf(35), 0.35],
  ...CRITERIA.map((c) => ['click', c.at(), 0.3] as SfxCue),
  ['pop', cf(39), 0.3],
  ['whoosh', cf(39), 0.3],
  ['ding', cf(40), 0.4],
];

/* ---------- D7 做法二：让它亲手跑一遍，把检查结果拿给你看 ---------- */
export const D7SelfCheck: React.FC<{f: number}> = ({f}) => {
  const runAt = cw(43, '运行');
  const failAt = cf(44);
  const fixAt = cf(44) + 36;
  const reportAt = cf(45);
  const notAt = cf(46);
  return (
    <>
      <Pop f={f} at={cf(41)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          让它<span style={{color: C.yellow}}>自己跑一遍</span>、查一遍
        </div>
      </Pop>
      <Pop f={f} at={cf(42)} x={60} y={140} rot={-2}>
        <Note color={C.panel} size={34}>干完活，别急着让它汇报</Note>
      </Pop>
      <Pop f={f} at={runAt} x={60} y={230} enter="up">
        <Win w={960} h={260} title="AI 自己运行" dark>
          <div style={{padding: '18px 26px'}}>
            <div style={txt(34, '#C9C2B6')}>&gt; 打开页面、运行测试……</div>
            {f >= failAt && <div style={{...txt(34, '#FF8A8A'), marginTop: 12}}>通过 11 项，失败 1 项</div>}
            {f >= fixAt && <div style={{...txt(34, '#7FE0A8'), marginTop: 12}}>修好后再跑：12 项全部通过</div>}
            {f >= failAt && <div style={{...txt(22, '#8A8176'), marginTop: 12}}>示意</div>}
          </div>
        </Win>
      </Pop>
      <Pop f={f} at={reportAt} x={60} y={530} enter="up">
        <Card w={740} h={200} pad={0} bg={C.tealLight} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
          <div style={{width: 160, height: 120, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={txt(24, C.inkSoft)}>页面截图</div>
          </div>
          <div>
            <div style={txt(40)}>检查结果</div>
            <div style={{...txt(34), marginTop: 8}}>
              <Marker p={prog(f, reportAt + 8, 10)} color={C.white}>测试 12 / 12 通过</Marker>
            </div>
          </div>
          <Check size={70} p={prog(f, reportAt + 12, 8)} />
        </Card>
      </Pop>
      <Pop f={f} at={notAt} x={60} y={770}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={txt(34, C.inkSoft)}>而不是只回一句</div>
          <Bubble text="好了。" size={40} color="#E6E1D6" />
          <Cross size={60} p={prog(f, notAt + 8, 8)} />
        </div>
      </Pop>
      <PiP f={f} at={cf(41) - 6} skin="santa" {...PIP_TALL} />
    </>
  );
};
export const D7Sfx: SfxCue[] = [
  ['pop', cf(41), 0.35],
  ['pop', cf(42), 0.3],
  ['type', cw(43, '运行'), 0.35],
  ['error', cf(44), 0.35],
  ['ding', cf(44) + 36, 0.4],
  ['paper', cf(45), 0.3],
  ['error', cf(46) + 8, 0.3],
];

/* ---------- D8 做法三：关键的地方自己抽查，花一分钟确认 ---------- */
export const D8Spot: React.FC<{f: number}> = ({f}) => {
  const clickAt = cw(49, '点开') + 10;
  const move = prog(f, clickAt - 16, 14, easeInOut);
  const okAt = clickAt + 8;
  const minAt = cf(50);
  const saveAt = cf(51);
  return (
    <>
      <Pop f={f} at={cf(47)} x={60} y={30}>
        <div style={bigText(68, C.white)}>
          关键的地方<span style={{color: C.yellow}}>自己抽查</span>
        </div>
      </Pop>
      <Pop f={f} at={cf(48)} x={60} y={140}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={txt(34, C.inkSoft)}>它说</div>
          <Bubble text="测试都过了！" size={38} color={C.tealLight} />
        </div>
      </Pop>
      <Pop f={f} at={cw(49, '随手')} x={60} y={240} enter="up">
        <Win w={960} h={330} title="浏览器 · 下单页">
          <div style={{padding: '22px 30px', position: 'relative', height: 260, boxSizing: 'border-box'}}>
            <div style={txt(40)}>你的购物车（示例）</div>
            {[80, 62].map((w, i) => <div key={i} style={{height: 16, width: `${w}%`, background: '#E4DED2', borderRadius: 8, marginTop: 20}} />)}
            <div style={{position: 'absolute', left: 30, bottom: 26, ...txt(40, C.white), background: f >= clickAt && f < clickAt + 6 ? C.orangeDark : C.orange, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 30px'}}>提交订单</div>
            {f >= okAt && (
              <div style={{position: 'absolute', left: 330, bottom: 30, display: 'flex', alignItems: 'center', gap: 10, opacity: prog(f, okAt, 6)}}>
                <Check size={56} />
                <div style={txt(40, C.teal)}>下单成功</div>
              </div>
            )}
          </div>
        </Win>
      </Pop>
      {f >= clickAt - 16 && f < clickAt + 24 && (
        <div style={{position: 'absolute', left: lerp(700, 200, move), top: lerp(700, 500, move)}}>
          <Cursor size={60} down={f >= clickAt && f < clickAt + 6} />
        </div>
      )}
      {f >= minAt && (
        <div style={{position: 'absolute', left: 60, top: 620, opacity: prog(f, minAt, 6)}}>
          <Stopwatch size={120} p={prog(f, minAt, 40)} />
        </div>
      )}
      <Pop f={f} at={minAt + 4} x={200} y={650} rot={-2}>
        <Note color={C.yellow} size={40}>花一分钟确认</Note>
      </Pop>
      <FocusLines f={f} at={saveAt + 10} out={saveAt + 40} x={420} y={840} />
      <Pop f={f} at={saveAt + 10} x={60} y={790} rot={-3}>
        <div style={bigText(64, C.yellow)}>比上线后才发现省心</div>
      </Pop>
      <Burst f={f} at={okAt + 2} x={460} y={520} r={180} />
      <PiP f={f} at={cf(47) - 6} skin="cowboy" eyes={f >= okAt ? 'happy' : 'open'} {...PIP_TALL} />
    </>
  );
};
export const D8Sfx: SfxCue[] = [
  ['pop', cf(47), 0.35],
  ['pop', cf(48), 0.3],
  ['paper', cw(49, '随手'), 0.3],
  ['click', cw(49, '点开') + 10, 0.45],
  ['ding', cw(49, '点开') + 18, 0.4],
  ['click', cf(50), 0.3],
  ['magic', cf(51) + 10, 0.35],
];

/* ---------- D9 结尾 ---------- */
export const D9Bye: React.FC<{f: number}> = ({f}) => {
  const byeAt = cf(53);
  return (
    <>
      <HostTall f={f} skin="chef" eyes="happy" armsUp={0.4 + 0.6 * Math.abs(Math.sin(f * 0.3))}>
        <Pop f={f} at={cf(52)} x={0} y={20}>
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
export const D9Sfx: SfxCue[] = [
  ['pop', cf(52), 0.4],
  ['confetti', cf(53), 0.5],
  ['ding', cf(53) + 2, 0.3],
];
