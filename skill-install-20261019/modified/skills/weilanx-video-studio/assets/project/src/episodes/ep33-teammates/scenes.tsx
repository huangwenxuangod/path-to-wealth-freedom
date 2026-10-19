import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Cam, Tone} from '../../library/tactical/range';
import {TeamRow} from '../../library/tactical/ranked';
import {glowF, T, TF} from '../../library/tactical/theme';
import {MATE_DIES, TEN_WORST, YOU_KILL} from './timeline';

/**
 * ep33 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

const BOXES: Box[] = [
  {x: -3.6, z: 7, w: 1.6, h: 1.6, crate: true},
  {x: 3.4, z: 9, w: 1.4, h: 2.2},
  {x: 0.4, z: 15, w: 2.6, h: 1.2},
];
const yawTo = (p: {x: number; z: number}) => Math.atan2(p.x, p.z);

/** 开场：青色队友从左边冲出去，第 1.5 拍被打倒；第 4 拍你换掉一个敌人 */
export const HookRange: React.FC<{f: number; tone?: Tone; frozen?: boolean}> = ({f, tone = 'blue', frozen}) => {
  const run = easeInOut(clamp01(f / (MATE_DIES - 2)));
  const mate = {x: -2.2 + 1.6 * run, z: 4 + 3.5 * run, color: T.cyan, state: (f >= MATE_DIES + 4 ? 'dead' : f >= MATE_DIES ? 'hit' : 'idle') as 'dead' | 'hit' | 'idle'};
  const foe = {x: 2.2, z: 12};
  const yaw = yawTo(foe) * easeInOut(clamp01((f - (YOU_KILL - 14)) / 10)) - 0.05;
  const cam: Cam = {x: 0, z: 0, yaw};
  const t = f - YOU_KILL;
  const head = project([foe.x, 1.75, foe.z], cam) ?? [960, 470];
  return (
    <>
      <Range cam={cam} tone={tone} boxes={BOXES} dummies={[mate, {...foe, state: t > 6 ? 'dead' : t >= 0 ? 'hit' : 'idle'}, {x: -1.2, z: 14}, {x: 4.8, z: 15}]} />
      <Crosshair color={tone === 'red' ? T.red : T.cyan} />
      {!frozen && <Tracer to={[960, head[1]]} t={t} />}
      {!frozen && <HitMark f={f} at={YOU_KILL + 1} x={960} y={head[1]} text="HEADSHOT" />}
      {!frozen && <ViewGun kick={clamp01(1 - Math.abs(t) / 5)} sway={Math.sin(f / 18)} tone={tone} />}
      <KillFeed f={f} />
    </>
  );
};

/** 右上角击杀信息：队友阵亡、你击杀 */
const KillFeed: React.FC<{f: number}> = ({f}) => {
  const rows: [number, string, string][] = [
    [MATE_DIES + 4, '队友 阵亡', T.red],
    [YOU_KILL + 2, '你 击杀 敌人', T.cyan],
  ];
  return (
    <div style={{position: 'absolute', right: 110, top: 150, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end'}}>
      {rows.map(([at, text, c]) =>
        f >= at ? (
          <div key={text} style={{padding: '6px 16px', border: `2px solid ${c}`, background: 'rgba(5,11,20,0.6)', fontFamily: TF.sans, fontSize: 26, color: c, opacity: clamp01((f - at) / 6)}}>
            {text}
          </div>
        ) : null,
      )}
    </div>
  );
};

/** 计分板（示意）：五行，你分最高；一个队友被标红「0 / 5」 */
export const Scoreboard: React.FC<{f: number; at: number}> = ({f, at}) => {
  const rows: [string, number, boolean, boolean][] = [
    ['你', 0.92, true, false],
    ['队友', 0.6, false, false],
    ['队友', 0.48, false, false],
    ['队友', 0.35, false, false],
    ['队友', 0.08, false, true],
  ];
  return (
    <div style={{position: 'absolute', left: 560, top: 560, width: 800}}>
      {rows.map(([name, v, you, bad], i) => {
        const p = easeOut(clamp01((f - at - 6 - i * 3) / 12));
        const c = you ? T.cyan : bad ? T.red : T.gray;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, height: 46, opacity: clamp01((f - at - i * 3) / 6)}}>
            <div style={{width: 90, textAlign: 'right', fontFamily: TF.sans, fontSize: 26, color: c}}>{name}</div>
            <div style={{position: 'relative', flex: 1, height: 16, background: 'rgba(200,215,225,0.06)'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * p * 100}%`, background: c, boxShadow: `0 0 10px ${c}`}} />
            </div>
            <div style={{width: 120, fontFamily: TF.sans, fontSize: 24, color: c}}>{bad ? '坑？' : you ? '全队最高' : ''}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 五局：每局一排五人，坑的位置各不一样（你永远不是红的——这是你记住的样子） */
export const FiveGames: React.FC<{f: number; at: number}> = ({f, at}) => {
  const worst = [0, 4, 1, 3, 0];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {worst.map((w, i) => {
        const t = f - at - 6 - i * 6;
        if (t < 0) return null;
        return (
          <g key={i} opacity={easeOut(clamp01(t / 6))}>
            <text x={420} y={210 + i * 140 - 30} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
              第 {i + 1} 局
            </text>
            <TeamRow x={960} y={210 + i * 140} size={0.55} worst={w} worstLabel="坑" />
          </g>
        );
      })}
    </svg>
  );
};

/** 抽签：五个人，红框在五个人之间快速跳动，然后停在 stopAt 的某个队友身上 */
export const DiceTeam: React.FC<{f: number; at: number; stopAt: number; stop: number}> = ({f, at, stopAt, stop}) => {
  const t = f - at;
  const w = f >= stopAt ? stop : Math.floor(t / 3) % 5;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <TeamRow x={960} y={500} size={1.4} worst={w} />
      <text x={960} y={250} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} letterSpacing={4} fill={T.gray}>
        水平差不多的五个人 · 这一局谁最差？
      </text>
    </svg>
  );
};

/** 1/5 vs 4/5：一条分成五格的长条，你那一格青色，四格红色 */
export const OddsBar: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const w = 1200;
  const x0 = 360;
  const cell = w / 5;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = easeOut(clamp01((t - i * 4) / 8));
        const you = i === 0;
        const c = you ? T.cyan : T.red;
        return (
          <g key={i} opacity={on}>
            <rect x={x0 + i * cell + 6} y={400} width={cell - 12} height={140} rx={10} fill={you ? 'rgba(66,198,223,0.2)' : 'rgba(229,80,91,0.22)'} stroke={c} strokeWidth={3} style={{filter: glowF(c, 8)}} />
            <text x={x0 + i * cell + cell / 2} y={485} textAnchor="middle" fontFamily={TF.sans} fontSize={40} fill={c}>
              {you ? '你' : '队友'}
            </text>
          </g>
        );
      })}
      <g opacity={clamp01((t - 24) / 8)}>
        <text x={x0 + cell / 2} y={620} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={T.cyan} style={{filter: glowF(T.cyan, 8)}}>
          20%
        </text>
        <text x={x0 + cell * 3} y={620} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={T.red} style={{filter: glowF(T.red, 8)}}>
          80%
        </text>
      </g>
      <text x={960} y={330} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={24} letterSpacing={4} fill={T.gray}>
        「这一局最差的人」是谁
      </text>
    </svg>
  );
};

/** 十局：两列五行，每局一排小人；最差的是你的那两局（青色变红）在 youAt 后被描金框 */
export const TenGames: React.FC<{f: number; at: number; youAt: number}> = ({f, at, youAt}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {TEN_WORST.map((w, i) => {
      const t = f - at - i * 3;
      if (t < 0) return null;
      const col = i < 5 ? 0 : 1;
      const row = i % 5;
      const x = col ? 1380 : 560;
      const y = 230 + row * 140;
      const isYou = w === 2;
      return (
        <g key={i} opacity={easeOut(clamp01(t / 6)) * (f >= youAt && !isYou ? 0.45 : 1)}>
          <text x={x - 380} y={y - 20} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray}>
            {i + 1}
          </text>
          <TeamRow x={x} y={y} size={0.5} worst={w} worstLabel={isYou ? '是你' : '坑'} />
          {isYou && f >= youAt && <rect x={x - 340} y={y - 90} width={680} height={130} rx={10} fill="none" stroke={T.orange} strokeWidth={3} opacity={clamp01((f - youAt) / 6)} style={{filter: glowF(T.orange, 8)}} />}
        </g>
      );
    })}
  </svg>
);

/** 两队：你这队亮、对面暗；两边各有一个「最差」；你的视线只照着自己这边 */
export const BothTeams: React.FC<{f: number; at: number; enemyLit?: number}> = ({f, at, enemyLit = 0}) => {
  const t = f - at;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <text x={500} y={250} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.cyan}>
        你这队
      </text>
      <text x={1420} y={250} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.red}>
        对面
      </text>
      <TeamRow x={500} y={520} size={0.85} worst={0} />
      <TeamRow x={1420} y={520} size={0.85} you={-1} worst={3} names={['敌人', '敌人', '敌人', '敌人', '敌人']} dim={1 - enemyLit} />
      <line x1={960} x2={960} y1={260} y2={760} stroke={T.faint} strokeWidth={2} strokeDasharray="8 8" />
    </svg>
  );
};

/** 观战：你死了，镜头切到队友视角；队友连开两枪都 MISS */
export const Spectate: React.FC<{f: number; shots: number[]}> = ({f, shots}) => {
  const foe = {x: 1.6, z: 11};
  const cam: Cam = {x: -0.8, z: 1.5, yaw: yawTo({x: foe.x + 0.8, z: foe.z - 1.5}) + 0.04 * Math.sin(f / 9)};
  const aim = project([foe.x + 0.7, 1.4, foe.z], cam) ?? [1000, 500];
  const k = shots.reduce((m, s) => Math.max(m, clamp01(1 - Math.abs(f - s) / 4)), 0);
  return (
    <>
      <Range cam={cam} boxes={BOXES} dummies={[foe]} />
      <Crosshair x={aim[0]} y={aim[1]} />
      <ViewGun kick={k} sway={Math.sin(f / 12)} />
      {shots.map((s) => (
        <HitMark key={s} f={f} at={s} x={aim[0]} y={aim[1]} text="MISS" color={T.gray} />
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: T.white}}>
        <span style={{padding: '6px 20px', border: `2px solid ${T.cyan}`, background: 'rgba(5,11,20,0.6)'}}>观战中 · 队友</span>
      </div>
    </>
  );
};

/** 一半一半：两个红色「最差」小人放在天平两端，天平左右来回摆 */
export const HalfHalf: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const a = 0.12 * Math.sin(t / 12);
  const cx = 960;
  const cy = 360;
  const L = 420;
  const end = (s: number) => [cx + s * L * Math.cos(a), cy + s * L * Math.sin(a)] as const;
  const guy = (s: number, label: string, c: string) => {
    const [x, y] = end(s);
    return (
      <g style={{filter: glowF(c, 8)}}>
        <circle cx={x} cy={y - 96} r={22} fill={c} />
        <rect x={x - 28} y={y - 70} width={56} height={70} rx={24} fill={c} />
        <text x={x} y={y + 50} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={c}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <path d={`M${cx} ${cy} L${cx - 60} ${cy + 380} L${cx + 60} ${cy + 380} Z`} fill="#0d1622" stroke={T.faint} strokeWidth={2} />
      <line x1={end(-1)[0]} y1={end(-1)[1]} x2={end(1)[0]} y2={end(1)[1]} stroke={T.white} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={T.white} />
      {guy(-1, '你这队最差的', T.red)}
      {guy(1, '对面最差的', T.red)}
      <text x={cx} y={cy - 160} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={56} fill={T.orange} style={{filter: glowF(T.orange, 8)}}>
        50% : 50%
      </text>
    </svg>
  );
};

/** 归因：两行「赢了 → 因为我」「输了 → 因为队友」 */
export const BlameArrows: React.FC<{f: number; at: number}> = ({f, at}) => {
  const row = (i: number, a: string, b: string, c: string) => {
    const t = f - at - i * 14;
    const p = easeOut(clamp01(t / 12));
    return (
      <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 330 + i * 190, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, opacity: clamp01(t / 6), fontFamily: TF.sans, fontSize: 80}}>
        <span style={{color: T.white}}>{a}</span>
        <span style={{display: 'inline-block', width: 220 * p, height: 6, background: c, boxShadow: `0 0 12px ${c}`}} />
        <span style={{color: c, opacity: p, filter: glowF(c, 8)}}>{b}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {row(0, '赢了', '因为我', T.cyan)}
      {row(1, '输了', '因为队友', T.red)}
    </AbsoluteFill>
  );
};

/** 分差：十个人在一条水平线上的分布；spread 0 → 1 从紧到散（示意，不标具体分数） */
export const SpreadDots: React.FC<{f: number; at: number; wideAt: number}> = ({f, at, wideAt}) => {
  const t = f - at;
  const s = 1 + 1.8 * easeInOut(clamp01((f - wideAt) / 20));
  const base = [-0.9, -0.6, -0.4, -0.2, 0, 0.1, 0.3, 0.5, 0.7, 1];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <line x1={260} x2={1660} y1={520} y2={520} stroke={T.faint} strokeWidth={3} />
      <text x={260} y={580} fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        弱
      </text>
      <text x={1660} y={580} textAnchor="end" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
        强
      </text>
      {base.map((v, i) => {
        const x = 960 + v * 150 * s;
        const c = i % 2 ? T.red : T.cyan;
        return <circle key={i} cx={x} cy={520 - (i % 2 ? 26 : -26)} r={16} fill={c} style={{filter: glowF(c, 6)}} />;
      })}
      <text x={960} y={330} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} letterSpacing={4} fill={f >= wideAt ? T.orange : T.gray}>
        {f >= wideAt ? '排队更快 → 一局里的分差更大（示意）' : '一局十个人的水平（示意）'}
      </text>
    </svg>
  );
};

/** 小号：对面阵容里混进一个「小号」，名字低段位、实力条拉满 */
export const SmurfRow: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const rows = ['敌人', '敌人', '小号？', '敌人', '敌人'];
  return (
    <div style={{position: 'absolute', left: 560, top: 300, width: 800, opacity: clamp01(t / 8)}}>
      {rows.map((n, i) => {
        const smurf = i === 2;
        const v = smurf ? 0.95 : [0.5, 0.45, 0, 0.55, 0.42][i];
        const p = easeOut(clamp01((t - 6 - i * 3) / 12));
        const c = smurf ? T.orange : T.red;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, height: 70}}>
            <div style={{width: 120, textAlign: 'right', fontFamily: TF.sans, fontSize: 30, color: c}}>{n}</div>
            <div style={{position: 'relative', flex: 1, height: 20, background: 'rgba(200,215,225,0.06)'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * p * 100}%`, background: c, opacity: smurf ? 1 : 0.6, boxShadow: smurf ? `0 0 14px ${c}` : undefined}} />
            </div>
          </div>
        );
      })}
      <div style={{marginTop: 20, textAlign: 'center', fontFamily: TF.sans, fontSize: 22, color: T.gray}}>实力条（示意）：高手开新号，排进了低分段</div>
    </div>
  );
};

/** 方法卡图标 */
export const STEP_ICONS: ((c: string) => React.ReactNode)[] = [
  (c) => (
    <>
      <rect x={50} y={30} width={140} height={90} rx={8} fill="none" stroke={c} strokeWidth={4} />
      <path d="M105 55 L140 75 L105 95 Z" fill={c} />
    </>
  ),
  (c) => (
    <text x={120} y={110} textAnchor="middle" fontFamily={TF.sans} fontSize={96} fill={c}>
      ?
    </text>
  ),
  (c) => (
    <>
      <rect x={80} y={30} width={50} height={70} rx={25} fill="none" stroke={c} strokeWidth={5} />
      <path d="M65 85 A40 40 0 0 0 145 85 M105 125 L105 140" fill="none" stroke={c} strokeWidth={5} />
      <line x1={50} y1={20} x2={170} y2={140} stroke={c} strokeWidth={6} />
    </>
  ),
  (c) => (
    <>
      <circle cx={120} cy={40} r={18} fill={c} />
      <rect x={98} y={64} width={44} height={60} rx={18} fill={c} />
      <path d="M40 140 L200 140" stroke={c} strokeWidth={4} />
    </>
  ),
];

/** 暖色：五局，每局一排；第 4 局最差的是你（第 204 拍亮起） */
export const TurnYou: React.FC<{f: number; at: number; youAt: number}> = ({f, at, youAt}) => {
  const worst = [0, 4, 1, 2, 3];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {worst.map((w, i) => {
        const t = f - at - i * 4;
        if (t < 0) return null;
        const isYou = w === 2;
        if (isYou && f < youAt) return <TeamRow key={i} x={960} y={210 + i * 140} size={0.55} color="#b7a48c" />;
        return (
          <g key={i} opacity={easeOut(clamp01(t / 6))}>
            <TeamRow x={960} y={210 + i * 140} size={0.55} worst={w} worstLabel={isYou ? '这局是你' : '坑'} color="#b7a48c" />
          </g>
        );
      })}
    </svg>
  );
};

/** 结尾：暖色射击场，你稳稳打掉一个 */
export const SteadyShot: React.FC<{f: number; shotAt: number}> = ({f, shotAt}) => {
  const foe = {x: -1.2, z: 11};
  const yaw = yawTo(foe) + 0.25 - 0.25 * easeInOut(clamp01((f - (shotAt - 14)) / 10));
  const cam: Cam = {x: 0, z: 0, yaw};
  const t = f - shotAt;
  const head = project([foe.x, 1.75, foe.z], cam) ?? [960, 470];
  return (
    <>
      <Range cam={cam} tone="warm" boxes={BOXES} dummies={[{...foe, state: t > 6 ? 'dead' : t >= 0 ? 'hit' : 'idle'}, {x: 3.2, z: 9, color: T.cyan}]} />
      <Crosshair color="#ffd9a8" />
      <Tracer to={[960, head[1]]} t={t} />
      <ViewGun kick={clamp01(1 - Math.abs(t) / 5)} tone="warm" sway={Math.sin(f / 22) * 0.5} />
      <HitMark f={f} at={shotAt + 1} x={960} y={head[1]} text="HEADSHOT" />
    </>
  );
};

