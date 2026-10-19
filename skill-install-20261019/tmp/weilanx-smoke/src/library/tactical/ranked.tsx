import React from 'react';
import {clamp01, easeInOut, easeOut, rand} from '../anim';
import {glow, glowF, T, TF} from './theme';

/**
 * 战术屏科普风的「排位」示意：结算横幅、胜负条、硬币网格、天梯、天平、段位 vs 隐藏分。
 * 全部原创图形，不画任何游戏的段位图标和结算界面。
 */

const W = 1920;
const H = 1080;

/** 结算横幅：整屏横穿的一条色带 +「胜利 / 失败」大字 + 下方小字（如「段位分 ↓」）；at 帧从左侧扫入 */
export const ResultCard: React.FC<{f: number; at: number; win: boolean; sub?: string; y?: number}> = ({f, at, win, sub, y = 380}) => {
  const t = f - at;
  if (t < 0) return null;
  const c = win ? T.cyan : T.red;
  const sweep = easeOut(clamp01(t / 6));
  const txt = easeOut(clamp01((t - 2) / 8));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 240}}>
      <div style={{position: 'absolute', left: 0, top: 30, height: 180, width: `${sweep * 100}%`, background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${win ? 'rgba(66,198,223,0.28)' : 'rgba(229,80,91,0.32)'} 25%, ${win ? 'rgba(66,198,223,0.28)' : 'rgba(229,80,91,0.32)'} 75%, rgba(0,0,0,0) 100%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, height: 2, background: c, opacity: sweep, boxShadow: `0 0 12px ${c}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 208, height: 2, background: c, opacity: sweep, boxShadow: `0 0 12px ${c}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: TF.sans, fontSize: 130, letterSpacing: 40, color: c, opacity: txt, transform: `scale(${1.25 - 0.25 * txt})`, ...glow(c, 26, 0.85)}}>{win ? '胜利' : '失败'}</div>
      {sub ? <div style={{position: 'absolute', left: 0, right: 0, top: 232, textAlign: 'center', fontFamily: TF.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: c, opacity: clamp01((t - 8) / 8)}}>{sub}</div> : null}
    </div>
  );
};

/** 胜负条：一排方块，'W' 青色、'L' 红色，第 i 块在 ats[i] 帧弹出；hot 给出要框起来的区间 [起, 止) */
export const StreakStrip: React.FC<{f: number; seq: string; ats: number[]; x?: number; y?: number; size?: number; gap?: number; hot?: [number, number]; hotLabel?: string}> = ({f, seq, ats, x, y = 470, size = 120, gap = 22, hot, hotLabel}) => {
  const n = seq.length;
  const total = n * size + (n - 1) * gap;
  const x0 = x ?? (W - total) / 2;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {[...seq].map((ch, i) => {
        const t = f - ats[i];
        if (t < 0) return null;
        const s = easeOut(clamp01(t / 6));
        const c = ch === 'W' ? T.cyan : T.red;
        const cx = x0 + i * (size + gap) + size / 2;
        return (
          <g key={i} transform={`translate(${cx} ${y + size / 2}) scale(${0.6 + 0.4 * s})`} opacity={s}>
            <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={10} fill={ch === 'W' ? 'rgba(66,198,223,0.16)' : 'rgba(229,80,91,0.2)'} stroke={c} strokeWidth={3} style={{filter: glowF(c, 8)}} />
            <text y={size * 0.17} textAnchor="middle" fontFamily={TF.sans} fontSize={size * 0.46} fill={c}>
              {ch === 'W' ? '胜' : '负'}
            </text>
          </g>
        );
      })}
      {hot && f >= ats[hot[1] - 1] + 6 && (
        <g opacity={clamp01((f - ats[hot[1] - 1] - 6) / 8)}>
          <rect x={x0 + hot[0] * (size + gap) - 14} y={y - 14} width={(hot[1] - hot[0]) * (size + gap) - gap + 28} height={size + 28} rx={14} fill="none" stroke={T.orange} strokeWidth={3} strokeDasharray="12 8" style={{filter: glowF(T.orange, 6)}} />
          {hotLabel ? (
            <text x={x0 + ((hot[0] + hot[1]) / 2) * (size + gap) - gap / 2} y={y + size + 74} textAnchor="middle" fontFamily={TF.sans} fontSize={34} fill={T.orange}>
              {hotLabel}
            </text>
          ) : null}
        </g>
      )}
    </svg>
  );
};

/** 抛硬币序列：seed 决定（true = 赢）；p 是每局赢的概率 */
export const coinSeq = (n: number, seed: number, p = 0.5) => Array.from({length: n}, (_, i) => rand(seed * 1000 + i) < p);

/** 序列里最长的一段连败：[起点, 长度] */
export const longestLoss = (seq: boolean[]): [number, number] => {
  let best: [number, number] = [0, 0];
  let run = 0;
  seq.forEach((w, i) => {
    run = w ? 0 : run + 1;
    if (run > best[1]) best = [i - run + 1, run];
  });
  return best;
};

/**
 * 硬币网格：cols × rows 个格子按顺序翻出来（青 = 赢，红 = 输），per 帧一格；
 * 翻完后最长的连败那一段描橙框（hotAt 帧起）
 */
export const CoinGrid: React.FC<{f: number; at: number; seq: boolean[]; cols?: number; x?: number; y?: number; cell?: number; per?: number; hotAt?: number}> = ({f, at, seq, cols = 20, x = 360, y = 220, cell = 54, per = 0.6, hotAt}) => {
  const [hs, hl] = longestLoss(seq);
  const pos = (i: number) => [x + (i % cols) * (cell + 6), y + Math.floor(i / cols) * (cell + 6)] as const;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {seq.map((w, i) => {
        const t = f - at - i * per;
        if (t < 0) return <rect key={i} x={pos(i)[0]} y={pos(i)[1]} width={cell} height={cell} rx={6} fill="rgba(200,215,225,0.05)" />;
        const s = easeOut(clamp01(t / 5));
        const c = w ? T.cyan : T.red;
        const dim = hotAt !== undefined && f >= hotAt && !(i >= hs && i < hs + hl) ? 0.35 : 1;
        return <rect key={i} x={pos(i)[0] + (cell / 2) * (1 - s)} y={pos(i)[1]} width={cell * s} height={cell} rx={6} fill={c} opacity={0.75 * dim} />;
      })}
      {hotAt !== undefined && f >= hotAt && (
        <rect x={pos(hs)[0] - 6} y={pos(hs)[1] - 6} width={hl * (cell + 6) + 6} height={cell + 12} rx={8} fill="none" stroke={T.orange} strokeWidth={4} opacity={clamp01((f - hotAt) / 6)} style={{filter: glowF(T.orange, 8)}} />
      )}
    </svg>
  );
};

/**
 * 天梯：每格一个人（灰），你（青）从正中间出发；climb 是你上移的格数（可为负、可为小数），
 * 被你挤下去的人变红
 */
export const RankLadder: React.FC<{f: number; at: number; climb: number; x?: number; y?: number; rows?: number; label?: string}> = ({f, at, climb, x = 960, y = 140, rows = 11, label = '你'}) => {
  const t = f - at;
  const rowH = 62;
  const mid = Math.floor(rows / 2);
  const you = mid - climb;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <line x1={x - 170} x2={x - 170} y1={y - 20} y2={y + rows * rowH} stroke={T.faint} strokeWidth={4} />
      <line x1={x + 170} x2={x + 170} y1={y - 20} y2={y + rows * rowH} stroke={T.faint} strokeWidth={4} />
      {Array.from({length: rows}, (_, i) => (
        <line key={`r${i}`} x1={x - 170} x2={x + 170} y1={y + i * rowH + rowH / 2 + 20} y2={y + i * rowH + rowH / 2 + 20} stroke={T.faint} strokeWidth={2} />
      ))}
      {Array.from({length: rows - 1}, (_, k) => {
        // 其他人按顺序排，空出你那一格（you 可以是小数，换位是连续的）；被你挤下去的人（原本在你上面、现在在你下面）闪红
        const slot = k + clamp01(k + 1 - you);
        const yy = y + slot * rowH + rowH / 2;
        const pushed = climb > 0 && k + 1 > you && k < mid;
        return (
          <g key={k} opacity={0.75}>
            <circle cx={x - 40} cy={yy - 12} r={9} fill={pushed ? T.red : T.gray} />
            <rect x={x - 50} y={yy - 2} width={20} height={22} rx={8} fill={pushed ? T.red : T.gray} />
          </g>
        );
      })}
      <g transform={`translate(0 ${y + you * rowH + rowH / 2})`} style={{filter: glowF(T.cyan, 10)}}>
        <circle cx={x + 40} cy={-12} r={12} fill={T.cyan} />
        <rect x={x + 26} y={0} width={28} height={28} rx={10} fill={T.cyan} />
        <text x={x + 80} y={14} fontFamily={TF.sans} fontSize={30} fill={T.cyan}>
          {label}
        </text>
      </g>
      <text x={x - 200} y={y} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray} letterSpacing={3}>
        强 ↑
      </text>
      <text x={x - 200} y={y + rows * rowH} textAnchor="end" fontFamily={TF.mono} fontWeight={700} fontSize={22} fill={T.gray} letterSpacing={3}>
        弱 ↓
      </text>
    </svg>
  );
};

/** 天平：左右各 5 个小人，tilt（−1..1，正 = 往右沉）决定横梁倾斜；中间显示两边赢面 */
export const BalanceScale: React.FC<{f: number; at: number; tilt?: number; left?: string; right?: string; leftColor?: string; rightColor?: string; pct?: boolean}> = ({f, at, tilt = 0, left = '你这队', right = '对面', leftColor = T.cyan, rightColor = T.red, pct = true}) => {
  const t = f - at;
  const cx = 960;
  const cy = 330;
  const L = 520;
  const a = tilt * 0.22;
  const end = (s: number) => [cx + s * L * Math.cos(a), cy + s * L * Math.sin(a)] as const;
  const pan = (s: number, c: string, label: string) => {
    const [px, py] = end(s);
    return (
      <g>
        <line x1={px} y1={py} x2={px - 120} y2={py + 170} stroke={T.faint} strokeWidth={2} />
        <line x1={px} y1={py} x2={px + 120} y2={py + 170} stroke={T.faint} strokeWidth={2} />
        <path d={`M${px - 150} ${py + 170} L${px + 150} ${py + 170} L${px + 120} ${py + 200} L${px - 120} ${py + 200} Z`} fill="#0d1622" stroke={c} strokeWidth={3} style={{filter: glowF(c, 6)}} />
        {Array.from({length: 5}, (_, i) => (
          <g key={i} transform={`translate(${px - 104 + i * 52} ${py + 120})`}>
            <circle cy={0} r={11} fill={c} />
            <rect x={-13} y={14} width={26} height={34} rx={11} fill={c} />
          </g>
        ))}
        <text x={px} y={py + 260} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={c}>
          {label}
        </text>
      </g>
    );
  };
  const win = 50 - tilt * 50;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <path d={`M${cx} ${cy} L${cx - 60} ${cy + 420} L${cx + 60} ${cy + 420} Z`} fill="#0d1622" stroke={T.faint} strokeWidth={2} />
      <line x1={end(-1)[0]} y1={end(-1)[1]} x2={end(1)[0]} y2={end(1)[1]} stroke={T.white} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={T.white} />
      {pan(-1, leftColor, left)}
      {pan(1, rightColor, right)}
      {pct && (
        <text x={cx} y={cy - 60} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={56} fill={T.orange} style={{filter: glowF(T.orange, 8)}}>
          {Math.round(win)}% : {Math.round(100 - win)}%
        </text>
      )}
    </svg>
  );
};

/** 段位 vs 隐藏分：两根竖柱（看得见的段位 / 看不见的隐藏分），gap 是段位高出的量（0..1）；旁边标「赢 +少 / 输 −多」 */
export const RankGap: React.FC<{f: number; at: number; gap: number}> = ({f, at, gap}) => {
  const t = f - at;
  const base = 660;
  const hRank = 260 + 160 * gap * easeInOut(clamp01(t / 20));
  const hMmr = 260;
  const bar = (x: number, h: number, c: string, label: string, dashed = false) => (
    <g>
      <rect x={x - 70} y={base - h} width={140} height={h} fill={dashed ? 'rgba(240,160,69,0.08)' : 'rgba(66,198,223,0.2)'} stroke={c} strokeWidth={3} strokeDasharray={dashed ? '10 8' : undefined} style={{filter: glowF(c, 6)}} />
      <text x={x} y={base + 50} textAnchor="middle" fontFamily={TF.sans} fontSize={32} fill={c}>
        {label}
      </text>
    </g>
  );
  const show = clamp01((t - 24) / 8);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(t / 8)}}>
      <line x1={560} x2={1360} y1={base} y2={base} stroke={T.faint} strokeWidth={2} />
      {bar(760, hRank, T.cyan, '看得见的段位')}
      {bar(1160, hMmr, T.orange, '看不见的隐藏分', true)}
      <g opacity={show}>
        <text x={960} y={base - hRank - 90} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={T.cyan}>
          赢 + 少一点
        </text>
        <text x={960} y={base - hRank - 40} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={40} fill={T.red}>
          输 − 多一点
        </text>
      </g>
    </svg>
  );
};

/**
 * 一队五个人：一排胶囊小人 + 名字；you 是你的位置（青色），worst 是这一局最差的人（红色描框 +「最差」），
 * 其余灰色。dim 把整队压暗（比如「你看不到的那一队」）；size 控制大小
 */
export const TeamRow: React.FC<{x: number; y: number; names?: string[]; you?: number; worst?: number; size?: number; dim?: number; color?: string; worstLabel?: string}> = ({
  x,
  y,
  names = ['队友', '队友', '你', '队友', '队友'],
  you = 2,
  worst,
  size = 1,
  dim = 0,
  color = T.gray,
  worstLabel = '最差',
}) => {
  const gap = 130 * size;
  return (
    <g opacity={1 - 0.75 * dim}>
      {names.map((n, i) => {
        const cx = x + (i - 2) * gap;
        const c = i === worst ? T.red : i === you ? T.cyan : color;
        return (
          <g key={i} style={{filter: glowF(c, i === worst || i === you ? 8 : 0)}}>
            <circle cx={cx} cy={y - 62 * size} r={16 * size} fill={c} />
            <rect x={cx - 20 * size} y={y - 40 * size} width={40 * size} height={56 * size} rx={18 * size} fill={c} />
            <text x={cx} y={y + 52 * size} textAnchor="middle" fontFamily={TF.sans} fontSize={24 * size} fill={c}>
              {n}
            </text>
            {i === worst && (
              <>
                <rect x={cx - 48 * size} y={y - 100 * size} width={96 * size} height={180 * size} rx={10 * size} fill="none" stroke={T.red} strokeWidth={3} strokeDasharray="10 6" />
                <text x={cx} y={y - 112 * size} textAnchor="middle" fontFamily={TF.sans} fontSize={24 * size} fill={T.red}>
                  {worstLabel}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};
