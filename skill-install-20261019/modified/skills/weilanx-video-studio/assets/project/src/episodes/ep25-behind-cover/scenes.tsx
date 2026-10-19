import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut} from '../../library/anim';
import {Crosshair, HitMark, project, Range, TopMap, Tracer, ViewGun} from '../../library/tactical/range';
import type {Box, Cam} from '../../library/tactical/range';
import {glowF, T, TF} from '../../library/tactical/theme';
import {fbt} from './timeline';

/**
 * ep25 各段画面。组件都拿全局帧 f，自己按 timeline 的拍子 / 小节算出场时间。
 */

export const vis = (f: number, a: number, b: number, fin = 10, fout = 10) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));

/* ---------------- 射击场：掩体、你、他 ---------------- */

/** 掩体：你左前方一块高箱子；他站在远处右边 */
export const COVER: Box = {x: -0.95, z: 1.8, w: 1.9, h: 2.7, d: 0.5};
const FAR_BOXES: Box[] = [
  {x: 4.8, z: 9, crate: true},
  {x: -4.5, z: 11, w: 1.6, h: 1.6, crate: true},
  {x: 1.2, z: 17, w: 2.4, h: 1.2},
];
const ENEMY = {x: 3.2, z: 15};
/** 你的位置：x 从掩体后 -0.7 拉出到 1.3，再缩回 */
const YOU_IN = -0.7;
const YOU_OUT = 1.3;

/** 开场镜头的你：第 1 拍起拉出、第 3.5 拍看到他、第 4 拍起缩回，第 6 拍回到掩体后 */
export const hookX = (f: number) => {
  const out = easeInOut(clamp01((f - fbt(0.5)) / (fbt(2.2) - fbt(0.5))));
  const back = easeInOut(clamp01((f - fbt(4)) / (fbt(5.6) - fbt(4))));
  return YOU_IN + (YOU_OUT - YOU_IN) * (out - back);
};

/** 你的屏幕：第一人称，相机就是你 */
export const YouView: React.FC<{f: number; x: number; tone?: 'blue' | 'warm' | 'red'; gun?: boolean}> = ({f, x, tone = 'blue', gun = true}) => (
  <>
    <Range cam={{x, z: 0, yaw: 0.06}} tone={tone} boxes={[COVER, ...FAR_BOXES]} dummies={[ENEMY]} wallZ={22} />
    <Crosshair color={tone === 'warm' ? '#ffd9a8' : T.cyan} />
    {gun && <ViewGun sway={Math.sin(f / 18)} tone={tone} />}
  </>
);

/** 他的屏幕：从他的位置看向你；youX 是「他屏幕上的你」此刻在哪（青色人靶） */
export const EnemyView: React.FC<{f: number; youX: number; tone?: 'blue' | 'red'; shot?: number}> = ({f, youX, tone = 'blue', shot}) => {
  const cam: Cam = {x: ENEMY.x, z: ENEMY.z, yaw: Math.atan2(0.2 - ENEMY.x, 0 - ENEMY.z)};
  const t = shot === undefined ? -1 : f - shot;
  return (
    <>
      <Range cam={cam} tone={tone} boxes={[COVER, ...FAR_BOXES]} dummies={[{x: youX, z: 0.3, color: T.cyan, state: t >= 0 && t < 4 ? 'hit' : 'idle'}]} wallZ={-8} />
      <Crosshair color={T.red} />
      {shot !== undefined && <Tracer from={[1500, 820]} to={[960, 540]} t={t} />}
      {shot !== undefined && <HitMark f={f} at={shot + 1} x={960} y={540} color={T.red} />}
    </>
  );
};

/** 击杀回放标签：红色 REC 点 + 「击杀回放 · 他的屏幕」 */
export const KillCamTag: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 110, top: 160, display: 'flex', alignItems: 'center', gap: 14, padding: '6px 18px', border: `2px solid ${T.red}`, background: 'rgba(40,8,14,0.6)', fontFamily: TF.sans, fontSize: 30, color: T.red}}>
    <span style={{width: 14, height: 14, borderRadius: 7, background: T.red, opacity: Math.floor(f / 10) % 2 ? 0.3 : 1}} />
    击杀回放 · 他的屏幕
  </div>
);

/** 开场的「他屏幕上的你」：比你自己的动作晚约 1 拍半（慢放演示），所以你缩回时他看到的你还在外面 */
export const enemySeesX = (f: number) => hookX(f - Math.round(fbt(1.6) - fbt(0)));

/* ---------------- 信号路径：你 → 服务器 → 他 ---------------- */

const Node: React.FC<{x: number; y: number; label: string; kind: 'pc' | 'server'; color: string; on: number}> = ({x, y, label, kind, color, on}) => (
  <g opacity={0.35 + 0.65 * on}>
    {kind === 'pc' ? (
      <>
        <rect x={x - 90} y={y - 70} width={180} height={115} rx={8} fill="#0d1622" stroke={color} strokeWidth={3} style={{filter: glowF(color, 6 * on)}} />
        <rect x={x - 20} y={y + 45} width={40} height={22} fill={color} opacity={0.6} />
        <rect x={x - 55} y={y + 66} width={110} height={6} rx={3} fill={color} opacity={0.6} />
      </>
    ) : (
      [0, 1, 2].map((i) => <rect key={i} x={x - 80} y={y - 75 + i * 52} width={160} height={42} rx={6} fill="#0d1622" stroke={color} strokeWidth={3} style={{filter: glowF(color, 6 * on)}} />)
    )}
    <text x={x} y={y + 120} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={T.white}>
      {label}
    </text>
  </g>
);

/** 信号路径：三个节点，一颗信号点每两拍从你跑到他；每段标注发生了什么 */
export const SignalPath: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const period = fbt(8) - fbt(0);
  const p = ((t % period) + period) % period / period;
  const xs = [380, 960, 1540];
  const y = 430;
  const seg = p < 0.5 ? 0 : 1;
  const sp = seg === 0 ? p / 0.5 : (p - 0.5) / 0.5;
  const px = xs[seg] + (xs[seg + 1] - xs[seg]) * easeInOut(sp);
  const lit = (i: number) => clamp01((t - i * 12) / 10);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', transform: 'scale(1.25)', transformOrigin: '960px 460px'}}>
      {[0, 1].map((i) => (
        <g key={i} opacity={lit(i + 1)}>
          <line x1={xs[i] + 110} x2={xs[i + 1] - 110} y1={y} y2={y} stroke={T.line} strokeWidth={3} strokeDasharray="10 10" />
          <text x={(xs[i] + xs[i + 1]) / 2} y={y - 34} textAnchor="middle" fontFamily={TF.sans} fontSize={26} fill={T.gray}>
            {i === 0 ? '上传 + 排队' : '处理 + 广播 + 缓冲 + 渲染'}
          </text>
        </g>
      ))}
      <Node x={xs[0]} y={y} label="你的电脑" kind="pc" color={T.cyan} on={lit(0)} />
      <Node x={xs[1]} y={y} label="服务器" kind="server" color={T.white} on={lit(1)} />
      <Node x={xs[2]} y={y} label="他的电脑" kind="pc" color={T.red} on={lit(2)} />
      {t > 30 && <circle cx={px} cy={y} r={12} fill="#fff" style={{filter: glowF(T.cyan, 12)}} />}
      <text x={960} y={720} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.gray} opacity={lit(3)}>
        每一段都要时间：你的动作，到他屏幕上已经晚了几十毫秒
      </text>
    </svg>
  );
};

/* ---------------- 三条轨道：同一个你，在三个地方的位置 ---------------- */

const LANES = [
  {label: '你的屏幕', color: T.cyan, delay: 0, tag: ''},
  {label: '服务器', color: T.white, delay: 14, tag: '+ 传输'},
  {label: '他的屏幕', color: T.red, delay: 28, tag: '+ 传输 + 缓冲'},
];
const LX0 = 420;
const LX1 = 1640;
const COVER_X = 1180;
const laneY = (i: number) => 290 + i * 170;
/** 你在轨道上的位置：从开阔处走进掩体（局部时间 tt，帧） */
const posAt = (tt: number) => 520 + (1460 - 520) * easeInOut(clamp01((tt - 6) / 44));

/**
 * 三条轨道（慢放演示）：你的屏幕 / 服务器 / 他的屏幕，同一个你依次晚一点走进掩体。
 * rewindAt 起服务器轨道倒带回他开枪的那一刻；verdictAt 在服务器轨道判定命中，你的屏幕跟着变红
 */
export const Lanes: React.FC<{f: number; at: number; rewindAt?: number; verdictAt?: number; settled?: boolean}> = ({f, at, rewindAt, verdictAt, settled}) => {
  const tt = settled ? 999 : f - at;
  const shotT = 20; // 他在「他的屏幕」上开枪的局部时间：那时他看到的你还在外面
  const shotPos = posAt(shotT - LANES[2].delay);
  const rw = rewindAt === undefined ? 0 : easeInOut(clamp01((f - rewindAt) / (fbt(8) - fbt(0))));
  const verdict = verdictAt === undefined ? -1 : f - verdictAt;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <rect x={COVER_X} y={210} width={LX1 - COVER_X} height={520} fill="rgba(66,198,223,0.07)" stroke="rgba(66,198,223,0.25)" strokeDasharray="8 8" />
      <text x={(COVER_X + LX1) / 2} y={760} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.cyan}>
        掩体
      </text>
      <text x={(LX0 + COVER_X) / 2} y={760} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.gray}>
        开阔地
      </text>
      <text x={1640} y={190} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={20} fill={T.gray} letterSpacing={3}>
        慢放演示 · 几十毫秒放大成一秒
      </text>
      {LANES.map((l, i) => {
        const y = laneY(i);
        let x = posAt(tt - l.delay);
        const isServer = i === 1;
        if (isServer && rw > 0) x = x + (shotPos - x) * rw;
        const dead = verdict >= 0 && (i === 0 || i === 1);
        const c = dead ? T.red : l.color;
        return (
          <g key={l.label}>
            <line x1={LX0} x2={LX1} y1={y} y2={y} stroke="rgba(200,215,225,0.22)" strokeWidth={2} />
            <text x={LX0 - 30} y={y + 10} textAnchor="end" fontFamily={TF.sans} fontSize={30} fill={l.color}>
              {l.label}
            </text>
            {l.tag ? (
              <text x={LX0 - 30} y={y + 40} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={18} fill={T.gray}>
                {l.tag}
              </text>
            ) : null}
            {/* 人物：圆头 + 胶囊身 */}
            <g transform={`translate(${x} ${y})`} style={{filter: glowF(c, 8)}}>
              <rect x={-14} y={-62} width={28} height={50} rx={14} fill={c} />
              <circle cx={0} cy={-76} r={11} fill={c} />
            </g>
            {/* 倒带时的残影和扫描线 */}
            {isServer && rw > 0 && rw < 1
              ? [0.2, 0.4, 0.6].map((k) => (
                  <g key={k} transform={`translate(${x + (1 - k) * 60} ${y})`} opacity={0.25 * (1 - k)}>
                    <rect x={-14} y={-62} width={28} height={50} rx={14} fill={T.white} />
                  </g>
                ))
              : null}
          </g>
        );
      })}
      {/* 他开枪：他屏幕上的准星落在当时的你身上 */}
      {tt >= shotT && (
        <g opacity={clamp01((tt - shotT) / 6)}>
          <circle cx={shotPos} cy={laneY(2) - 50} r={30} fill="none" stroke={T.red} strokeWidth={3} />
          <line x1={shotPos - 44} x2={shotPos + 44} y1={laneY(2) - 50} y2={laneY(2) - 50} stroke={T.red} strokeWidth={2} />
          <text x={shotPos} y={laneY(2) + 46} textAnchor="middle" fontFamily={TF.sans} fontSize={24} fill={T.red}>
            他在这一刻开枪
          </text>
        </g>
      )}
      {/* 服务器倒带标记 */}
      {rw > 0 && (
        <g opacity={clamp01(rw * 4)}>
          <text x={LX1} y={laneY(1) - 100} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={26} fill={T.orange}>
            ◀◀ 服务器倒带到他开枪的那一刻
          </text>
          {[0, 1, 2, 3, 4].map((k) => (
            <line key={k} x1={LX0} x2={LX1} y1={laneY(1) - 90 + k * 22} y2={laneY(1) - 90 + k * 22} stroke={T.orange} strokeWidth={1} opacity={rw < 1 ? 0.15 + 0.15 * Math.sin(f + k) : 0} />
          ))}
        </g>
      )}
      {/* 判定：服务器上命中，你的屏幕上也死了 */}
      {verdict >= 0 && (
        <g opacity={clamp01(verdict / 4)}>
          <text x={shotPos} y={laneY(1) - 110} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={34} fill={T.red} style={{filter: glowF(T.red, 8)}}>
            命中
          </text>
          <text x={posAt(999) + 60} y={laneY(0) - 40} fontFamily={TF.sans} fontSize={28} fill={T.red}>
            ✕ 已阵亡
          </text>
        </g>
      )}
    </svg>
  );
};

/* ---------------- 不倒带：要打提前量 ---------------- */

/** 移动靶：你看到的他（半透明残影）落后于真实的他；子弹打在残影上 → MISS */
export const LeadDemo: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const realX = -3 + ((t % 40) / 40) * 6;
  const seenX = realX - 0.9;
  const shots = [0, 1, 2].map((k) => fbt(88 + k * 2));
  const cam = {x: 0, z: 0, yaw: 0};
  const aim = project([seenX, 1.3, 10], cam) ?? [960, 540];
  return (
    <>
      <Range cam={cam} boxes={FAR_BOXES} dummies={[{x: realX, z: 10, color: T.red}, {x: seenX, z: 10, color: 'rgba(229,80,91,0.35)'}]} />
      <Crosshair x={aim[0]} y={aim[1]} />
      <ViewGun kick={shots.reduce((k, s) => Math.max(k, clamp01(1 - Math.abs(f - s) / 4)), 0)} />
      {shots.map((s) => (
        <HitMark key={s} f={f} at={s} x={aim[0]} y={aim[1]} text="MISS" color={T.gray} />
      ))}
      <div style={{position: 'absolute', left: 110, top: 170, fontFamily: TF.sans, fontSize: 30, color: T.text}}>
        <span style={{color: 'rgba(229,80,91,0.6)'}}>■</span> 你看到的他（过去） <span style={{marginLeft: 30, color: T.red}}>■</span> 真实的他（现在）
      </div>
    </>
  );
};

/* ---------------- 拐角：拉出去的人先看到 ---------------- */

/** 俯视图：他（红）从墙后拉出，第一时间看到你；你（青）晚一拍才看到他；上方两个计时器 */
export const CornerMap: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const px = 760 + 240 * easeInOut(clamp01((t - 6) / 20));
  const delay = Math.round(fbt(1.5) - fbt(0));
  // 墙 x 500–900、y 250–720；他在墙下方（y=780）从左往右拉，过了 x≈900 视线才打通
  const heSees = px > 905;
  const heAt = 6 + 20 * 0.62; // 约在第 18 帧走出墙角
  const youSee = heSees && t > heAt + delay;
  return (
    <>
      <TopMap
        blocks={[
          [500, 250, 400, 470],
          [1240, 540, 220, 110],
        ]}
        units={[
          {x: px, y: 780, color: T.red, label: '他 · 拉出去', dir: -0.64, fov: 1.0, reach: 560},
          {x: 1460, y: 260, color: T.cyan, label: '你 · 架点', dir: 2.5, fov: 1.0, reach: 560},
        ]}
        sight={[...(heSees ? [[px, 780, 1460, 260, T.red] as [number, number, number, number, string]] : []), ...(youSee ? [[1460, 260, px, 780, T.cyan] as [number, number, number, number, string]] : [])]}
      />
      <div style={{position: 'absolute', left: 120, top: 170, fontFamily: TF.mono, fontWeight: 700, fontSize: 30, lineHeight: 1.6}}>
        <div style={{color: T.red}}>他看到你：{heSees ? '0 ms' : '—'}</div>
        <div style={{color: T.cyan}}>你看到他：{youSee ? '+ 一圈网络时间' : heSees ? '还没看到…' : '—'}</div>
      </div>
    </>
  );
};

/* ---------------- 盲测：20–50 ms 的胜负窗口 ---------------- */

/** 毫秒尺：0–100 ms，20–50 ms 一段绿色高亮，一颗指针来回扫 */
export const MsRuler: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  const x0 = 360;
  const x1 = 1560;
  const X = (ms: number) => x0 + ((x1 - x0) * ms) / 100;
  const band = easeOut(clamp01((t - fbt(4) + fbt(0)) / 14));
  const sweep = 50 + 45 * Math.sin(t / 16);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <line x1={x0} x2={x1} y1={520} y2={520} stroke={T.faint} strokeWidth={3} />
      {Array.from({length: 11}, (_, i) => (
        <g key={i}>
          <line x1={X(i * 10)} x2={X(i * 10)} y1={505} y2={535} stroke={T.faint} strokeWidth={2} />
          <text x={X(i * 10)} y={575} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
            {i * 10}
          </text>
        </g>
      ))}
      <text x={x1} y={620} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray}>
        ms
      </text>
      <rect x={X(20)} y={470} width={(X(50) - X(20)) * band} height={100} fill={T.green} opacity={0.2} />
      <rect x={X(20)} y={470} width={(X(50) - X(20)) * band} height={4} fill={T.green} style={{filter: glowF(T.green, 6)}} />
      <text x={(X(20) + X(50)) / 2} y={450} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.green} opacity={band}>
        胜负常常就差在这里
      </text>
      <line x1={X(sweep)} x2={X(sweep)} y1={440} y2={600} stroke="#fff" strokeWidth={2} opacity={0.6} />
      <text x={960} y={330} textAnchor="middle" fontFamily={TF.sans} fontSize={30} fill={T.text} opacity={clamp01(t / 10)}>
        顶尖选手 · 水平相当 · 盲测几天
      </text>
    </svg>
  );
};

/* ---------------- 10 ms 翻转胜率 ---------------- */

/** 胜率条：架点（狙）90% vs 拉出（步枪）10%，flipAt 起加上 10 ms 先手，翻成 10% vs 90% */
export const WinFlip: React.FC<{f: number; at: number; flipAt: number}> = ({f, at, flipAt}) => {
  const p = easeInOut(clamp01((f - flipAt) / 16));
  const holder = 0.9 - 0.8 * p;
  const w = 1200;
  const x0 = 360;
  return (
    <AbsoluteFill style={{opacity: clamp01((f - at) / 8)}}>
      <div style={{position: 'absolute', left: x0, top: 380, width: w, display: 'flex', justifyContent: 'space-between', fontFamily: TF.sans, fontSize: 34}}>
        <span style={{color: T.cyan}}>架点 · 狙</span>
        <span style={{color: T.red}}>拉出去 · 步枪</span>
      </div>
      <div style={{position: 'absolute', left: x0, top: 440, width: w, height: 70, display: 'flex', boxShadow: '0 0 30px rgba(0,0,0,0.6)'}}>
        <div style={{width: w * holder, background: T.cyan, boxShadow: `0 0 18px ${T.cyan}`, display: 'flex', alignItems: 'center', paddingLeft: 20, fontFamily: TF.mono, fontWeight: 700, fontSize: 36, color: '#06121a', overflow: 'hidden'}}>{Math.round(holder * 100)}%</div>
        <div style={{flex: 1, background: T.red, boxShadow: `0 0 18px ${T.red}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20, fontFamily: TF.mono, fontWeight: 700, fontSize: 36, color: '#1a0508', overflow: 'hidden'}}>{Math.round((1 - holder) * 100)}%</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 48, color: T.orange, opacity: clamp01((f - flipAt + 6) / 8), filter: glowF(T.orange, 8)}}>+ 10 ms 先手</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: TF.sans, fontSize: 20, color: T.gray}}>实验条件：水平相当的顶尖选手，架点方用狙（Operator），拉出方用步枪 · Riot Games 2020</div>
    </AbsoluteFill>
  );
};

/* ---------------- 四步方法 ---------------- */

const STEP_ICONS: React.FC<{i: number; c: string}> = ({i, c}) => (
  <svg width={240} height={150} viewBox="0 0 240 150">
    {i === 0 && (
      <>
        <rect x={120} y={20} width={60} height={110} fill="#1a2a3c" stroke={c} strokeWidth={3} />
        <path d="M100 75 L40 75 M60 55 L40 75 L60 95" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
    {i === 1 && (
      <>
        <rect x={70} y={40} width={100} height={60} rx={8} fill="none" stroke={c} strokeWidth={4} />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={86 + k * 20} y={56} width={10} height={16} fill={c} />
        ))}
        <path d="M120 100 L120 140" stroke={c} strokeWidth={6} />
      </>
    )}
    {i === 2 && (
      <text x={120} y={100} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={64} fill={c}>
        144
      </text>
    )}
    {i === 3 && (
      <>
        <rect x={40} y={20} width={60} height={110} fill="#1a2a3c" stroke={c} strokeWidth={3} />
        <path d="M120 75 L200 75 M180 55 L200 75 L180 95" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

/** 四步方法：2×2 卡片，第 k 张在 ats[k] 帧亮起（之前是暗的） */
export const StepGrid: React.FC<{f: number; ats: number[]; titles: string[]; colors: string[]}> = ({f, ats, titles, colors}) => (
  <AbsoluteFill>
    {titles.map((title, i) => {
      const on = clamp01((f - ats[i]) / 8);
      const x = 300 + (i % 2) * 680;
      const y = 180 + Math.floor(i / 2) * 330;
      const c = colors[i];
      return (
        <div key={title} style={{position: 'absolute', left: x, top: y, width: 640, height: 290, border: `2px solid ${on > 0 ? c : 'rgba(200,215,225,0.15)'}`, background: 'rgba(10,19,34,0.7)', boxShadow: `0 0 ${20 * on}px ${c}55`, opacity: 0.35 + 0.65 * on}}>
          <div style={{position: 'absolute', left: 0, top: 0, padding: '4px 14px', background: on > 0 ? c : 'rgba(200,215,225,0.15)', fontFamily: TF.mono, fontWeight: 700, fontSize: 24, color: '#06121a'}}>0{i + 1}</div>
          <div style={{position: 'absolute', left: 30, top: 70}}>
            <STEP_ICONS i={i} c={on > 0 ? c : T.dim} />
          </div>
          <div style={{position: 'absolute', left: 290, top: 105, width: 330, fontFamily: TF.sans, fontSize: 40, lineHeight: 1.3, color: on > 0 ? T.white : T.dim}}>{title}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

/* ---------------- 结尾：架好位置，他走进准星 ---------------- */

/** 暖色射击场：他从箱子后拉出，走进你的准星，at 帧你开枪命中 */
export const HoldRange: React.FC<{f: number; shotAt: number}> = ({f, shotAt}) => {
  const step = easeInOut(clamp01((f - (shotAt - 30)) / 24));
  const ex = 6.2 - 3.0 * step;
  const t = f - shotAt;
  return (
    <>
      <Range cam={{x: 0, z: 0, yaw: 0.17}} tone="warm" boxes={[{x: 6.4, z: 10.5, w: 1.6, h: 2.4, crate: true}, ...FAR_BOXES.slice(1)]} dummies={[{x: ex, z: 11, state: t > 6 ? 'dead' : t >= 0 ? 'hit' : 'idle'}]} />
      <Crosshair color="#ffd9a8" />
      <Tracer to={[960, 520]} t={t} />
      <ViewGun kick={clamp01(1 - Math.abs(t) / 5)} tone="warm" sway={Math.sin(f / 22) * 0.5} />
      <HitMark f={f} at={shotAt + 1} x={960} y={500} text="HEADSHOT" />
    </>
  );
};

