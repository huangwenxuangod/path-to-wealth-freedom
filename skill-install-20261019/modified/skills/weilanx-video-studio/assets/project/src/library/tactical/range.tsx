import React from 'react';
import {clamp01, easeOut} from '../anim';
import {glowF, T, TF} from './theme';

/**
 * 战术屏科普风的射击场：纯 SVG 的低多边形 3D 场景（自带透视投影和近平面裁剪），
 * 加上准星、原创枪模、弹道、命中标记和俯视图。不画任何游戏的地图、角色和枪械，全是通用方块。
 */

const W = 1920;
const H = 1080;
const F = 1000; // 焦距（px）：水平视野约 88°
const NEAR = 0.15;

export type Cam = {x: number; z: number; y?: number; yaw?: number; pitch?: number};
type V3 = [number, number, number];

/** 世界坐标 → 相机坐标（x 右、y 上、z 前） */
const toCam = (p: V3, c: Cam): V3 => {
  const yaw = c.yaw ?? 0;
  const pitch = c.pitch ?? 0;
  const dx = p[0] - c.x;
  const dy = p[1] - (c.y ?? 1.6);
  const dz = p[2] - c.z;
  const x1 = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  const z1 = dx * Math.sin(yaw) + dz * Math.cos(yaw);
  const y2 = dy * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = dy * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
};
const proj = (q: V3): [number, number] => [W / 2 + (F * q[0]) / q[2], H / 2 - (F * q[1]) / q[2]];

/** 世界坐标 → 屏幕坐标（在相机后面返回 null） */
export const project = (p: V3, c: Cam): [number, number] | null => {
  const q = toCam(p, c);
  return q[2] < NEAR ? null : proj(q);
};

/** 多边形对近平面裁剪后投影成 SVG points；完全在相机后面返回 null */
const polyPts = (pts: V3[], c: Cam): string | null => {
  const q = pts.map((p) => toCam(p, c));
  const out: V3[] = [];
  for (let i = 0; i < q.length; i++) {
    const a = q[i];
    const b = q[(i + 1) % q.length];
    const ain = a[2] >= NEAR;
    const bin = b[2] >= NEAR;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = (NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]);
    }
  }
  if (out.length < 3) return null;
  return out.map((v) => proj(v).map((n) => n.toFixed(1)).join(',')).join(' ');
};
const depth = (pts: V3[], c: Cam) => pts.reduce((s, p) => s + toCam(p, c)[2], 0) / pts.length;

/** 色调：冷青蓝线框（现在 / 默认）、暖橙（以前 / 刚玩的时候）、红（失误） */
const TONES = {
  blue: {sky: '#060c16', floor: '#0a1322', grid: 'rgba(110,170,205,0.2)', wall: '#15212f', wallLine: 'rgba(140,190,215,0.22)', front: '#1d2d40', top: '#2a3f56', side: '#152234', edge: 'rgba(160,210,230,0.4)', pillar: 'rgba(120,190,215,0.16)'},
  warm: {sky: '#1a120a', floor: '#3b2716', grid: 'rgba(240,180,120,0.16)', wall: '#6e4a2b', wallLine: 'rgba(255,215,170,0.18)', front: '#a0703f', top: '#c08a52', side: '#7a5230', edge: 'rgba(255,220,180,0.35)', pillar: 'rgba(255,200,150,0.12)'},
  red: {sky: '#14070a', floor: '#200c10', grid: 'rgba(230,110,120,0.18)', wall: '#2d1418', wallLine: 'rgba(240,150,160,0.18)', front: '#3a1a20', top: '#4a242b', side: '#2a1216', edge: 'rgba(240,160,170,0.35)', pillar: 'rgba(240,140,150,0.12)'},
};
export type Tone = keyof typeof TONES;

/** 箱子：中心 (x, z)，宽 w、高 h、深 d；crate 画 X 面 */
export type Box = {x: number; z: number; w?: number; h?: number; d?: number; crate?: boolean};
/** 人靶：站在 (x, z)；state 'hit' 白闪、'dead' 倒下变暗；color 默认红 */
/** 人靶：lift 是离地高度（米，跳起来时用） */
export type Dummy = {x: number; z: number; state?: 'idle' | 'hit' | 'dead'; color?: string; peek?: number; lift?: number};

/**
 * 射击场：地面网格 + 远处墙板 + 箱子 + 人靶，按深度排序画出。
 * cam 相机位置和朝向（yaw 弧度，正值向右转）；wallZ 墙的距离；pillar 给一根近处的竖柱（x 坐标）；
 * backWallZ 给了就在身后（负 z）再立一面墙，相机原地转身时前后都有东西
 */
export const Range: React.FC<{cam: Cam; tone?: Tone; boxes?: Box[]; dummies?: Dummy[]; wallZ?: number; backWallZ?: number; pillar?: number; sideWalls?: boolean}> = ({cam, tone = 'blue', boxes = [], dummies = [], wallZ = 22, backWallZ, pillar, sideWalls = false}) => {
  const P = TONES[tone];
  const faces: {d: number; el: React.ReactNode}[] = [];
  const line = (a: V3, b: V3, stroke: string, w = 1, key = '') => {
    let qa = toCam(a, cam);
    let qb = toCam(b, cam);
    if (qa[2] < NEAR && qb[2] < NEAR) return null;
    if (qa[2] < NEAR || qb[2] < NEAR) {
      const t = (NEAR - qa[2]) / (qb[2] - qa[2]);
      const m: V3 = [qa[0] + (qb[0] - qa[0]) * t, qa[1] + (qb[1] - qa[1]) * t, NEAR];
      if (qa[2] < NEAR) qa = m;
      else qb = m;
    }
    const [x1, y1] = proj(qa);
    const [x2, y2] = proj(qb);
    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={w} />;
  };

  // 地面网格（每 1.5 米一条）
  const grid: React.ReactNode[] = [];
  const z0 = Math.min(-2, wallZ, backWallZ ?? 0);
  const z1 = Math.max(wallZ, cam.z + 4);
  for (let x = -18; x <= 18; x += 1.5) grid.push(line([x, 0, z0], [x, 0, z1], P.grid, 1, `gx${x}`));
  for (let z = Math.ceil(z0 / 1.5) * 1.5; z <= z1; z += 1.5) grid.push(line([-18, 0, z], [18, 0, z], P.grid, 1, `gz${z}`));

  // 墙
  const wallPts: V3[] = [
    [-30, 0, wallZ],
    [30, 0, wallZ],
    [30, 4.5, wallZ],
    [-30, 4.5, wallZ],
  ];
  const wp = polyPts(wallPts, cam);
  const wallLines: React.ReactNode[] = [];
  for (let x = -30; x <= 30; x += 3.2) wallLines.push(line([x, 0, wallZ], [x, 4.5, wallZ], P.wallLine, 1.2, `wl${x}`));
  wallLines.push(line([-30, 3.2, wallZ], [30, 3.2, wallZ], P.wallLine, 1.2, 'wh'));
  const bz = backWallZ;
  const bwp = bz === undefined ? null : polyPts([[-30, 0, bz], [30, 0, bz], [30, 4.5, bz], [-30, 4.5, bz]], cam);
  if (bz !== undefined) {
    for (let x = -30; x <= 30; x += 3.2) wallLines.push(line([x, 0, bz], [x, 4.5, bz], P.wallLine, 1.2, `bl${x}`));
    wallLines.push(line([-30, 3.2, bz], [30, 3.2, bz], P.wallLine, 1.2, 'bh'));
  }
  if (sideWalls) {
    for (const sx of [-9, 9]) {
      const pts: V3[] = [
        [sx, 0, 0],
        [sx, 0, wallZ],
        [sx, 4.5, wallZ],
        [sx, 4.5, 0],
      ];
      const sp = polyPts(pts, cam);
      if (sp) faces.push({d: depth(pts, cam) + 50, el: <polygon key={`sw${sx}`} points={sp} fill={P.wall} opacity={0.85} stroke={P.wallLine} />});
    }
  }

  // 箱子：每个面单独入深度队列
  boxes.forEach((b, i) => {
    const w = (b.w ?? 1.2) / 2;
    const h = b.h ?? 1.2;
    const d = (b.d ?? 1.2) / 2;
    const v = (sx: number, y: number, sz: number): V3 => [b.x + sx * w, y, b.z + sz * d];
    const sets: [V3[], string][] = [
      [[v(-1, 0, -1), v(1, 0, -1), v(1, h, -1), v(-1, h, -1)], P.front],
      [[v(-1, h, -1), v(1, h, -1), v(1, h, 1), v(-1, h, 1)], P.top],
      [[v(-1, 0, -1), v(-1, 0, 1), v(-1, h, 1), v(-1, h, -1)], P.side],
      [[v(1, 0, -1), v(1, 0, 1), v(1, h, 1), v(1, h, -1)], P.side],
    ];
    sets.forEach(([pts, fill], k) => {
      // 背面剔除：面法线朝向相机才画
      const n = k === 0 ? [0, 0, -1] : k === 1 ? [0, 1, 0] : k === 2 ? [-1, 0, 0] : [1, 0, 0];
      const cx = pts.reduce((s, p) => s + p[0], 0) / 4 - cam.x;
      const cy = pts.reduce((s, p) => s + p[1], 0) / 4 - (cam.y ?? 1.6);
      const cz = pts.reduce((s, p) => s + p[2], 0) / 4 - cam.z;
      if (n[0] * cx + n[1] * cy + n[2] * cz >= 0) return;
      const pp = polyPts(pts, cam);
      if (!pp) return;
      const x1 = b.crate && k === 0 ? project(pts[0], cam) : null;
      const x2 = b.crate && k === 0 ? project(pts[2], cam) : null;
      const x3 = b.crate && k === 0 ? project(pts[1], cam) : null;
      const x4 = b.crate && k === 0 ? project(pts[3], cam) : null;
      faces.push({
        d: depth(pts, cam),
        el: (
          <g key={`b${i}-${k}`}>
            <polygon points={pp} fill={fill} stroke={P.edge} strokeWidth={1.4} strokeLinejoin="round" />
            {x1 && x2 && x3 && x4 ? (
              <>
                <line x1={x1[0]} y1={x1[1]} x2={x2[0]} y2={x2[1]} stroke={P.edge} strokeWidth={1} />
                <line x1={x3[0]} y1={x3[1]} x2={x4[0]} y2={x4[1]} stroke={P.edge} strokeWidth={1} />
              </>
            ) : null}
          </g>
        ),
      });
    });
  });

  // 人靶：胶囊身体 + 圆头，按距离缩放
  dummies.forEach((m, i) => {
    const base = toCam([m.x, m.lift ?? 0, m.z], cam);
    if (base[2] < NEAR + 0.3) return;
    const [bx, by] = proj(base);
    const s = F / base[2];
    const dead = m.state === 'dead';
    const hit = m.state === 'hit';
    const color = m.color ?? T.red;
    const bodyH = 1.32 * s;
    const bodyW = 0.5 * s;
    const headR = 0.17 * s;
    faces.push({
      d: base[2],
      el: (
        <g key={`m${i}`} opacity={dead ? 0.35 : 1} transform={dead ? `rotate(80 ${bx} ${by})` : undefined} style={{filter: glowF(color, Math.max(2, s * 0.012))}}>
          <rect x={bx - bodyW / 2} y={by - bodyH} width={bodyW} height={bodyH} rx={bodyW / 2} fill={hit ? '#fff' : color} opacity={0.92} />
          <circle cx={bx} cy={by - bodyH - headR * 1.25} r={headR} fill={hit ? '#fff' : color} />
          <rect x={bx - bodyW * 0.32} y={by - bodyH * 0.78} width={bodyW * 0.64} height={bodyH * 0.06} fill="rgba(255,255,255,0.35)" />
        </g>
      ),
    });
  });

  // 近处竖柱（半透明亮条，原片里常见的掩体边）
  if (pillar !== undefined) {
    const pts: V3[] = [
      [pillar - 0.25, 0, 3],
      [pillar + 0.25, 0, 3],
      [pillar + 0.25, 6, 3],
      [pillar - 0.25, 6, 3],
    ];
    const pp = polyPts(pts, cam);
    if (pp) faces.push({d: depth(pts, cam), el: <polygon key="pillar" points={pp} fill={P.pillar} stroke={P.edge} strokeWidth={1.5} />});
  }

  faces.sort((a, b) => b.d - a.d);
  const horizon = project([cam.x + Math.sin(cam.yaw ?? 0) * 1000, cam.y ?? 1.6, cam.z + Math.cos(cam.yaw ?? 0) * 1000], cam);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      <rect width={W} height={H} fill={P.sky} />
      <rect x={0} y={horizon ? horizon[1] : H / 2} width={W} height={H} fill={P.floor} />
      {grid}
      {wp ? <polygon points={wp} fill={P.wall} /> : null}
      {bwp ? <polygon points={bwp} fill={P.wall} /> : null}
      {wallLines}
      {faces.map((x) => x.el)}
    </svg>
  );
};

/** 准星：十字四段 + 中心点；gap 中心空隙，size 每段长度；spread 0–1 让四段向外张开（开火扩散） */
export const Crosshair: React.FC<{x?: number; y?: number; color?: string; gap?: number; size?: number; spread?: number; dot?: boolean}> = ({x = 960, y = 540, color = T.cyan, gap = 9, size = 22, spread = 0, dot = true}) => {
  const g = gap + spread * 24;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <g stroke={color} strokeWidth={3} style={{filter: glowF(color, 3)}}>
        <line x1={x - g - size} x2={x - g} y1={y} y2={y} />
        <line x1={x + g} x2={x + g + size} y1={y} y2={y} />
        <line x1={x} x2={x} y1={y - g - size} y2={y - g} />
        <line x1={x} x2={x} y1={y + g} y2={y + g + size} />
      </g>
      {dot && <circle cx={x} cy={y} r={2.6} fill={color} />}
    </svg>
  );
};

/** 原创枪模：右下角一把低多边形方块枪（深色 + 青色棱边高光）；kick 0–1 是后坐（向下向后），sway 是呼吸晃动 */
export const ViewGun: React.FC<{kick?: number; sway?: number; tone?: Tone}> = ({kick = 0, sway = 0, tone = 'blue'}) => {
  const edge = tone === 'warm' ? 'rgba(255,215,170,0.55)' : tone === 'red' ? 'rgba(255,170,180,0.5)' : 'rgba(110,210,235,0.6)';
  const hi = tone === 'warm' ? '#c9a070' : tone === 'red' ? '#a05560' : '#3f8ea6';
  const dx = sway * 6 + kick * 26;
  const dy = Math.sin(sway * 2) * 4 + kick * 46;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <g transform={`translate(${dx} ${dy}) rotate(${-kick * 5} 1500 1080)`}>
        {/* 枪身 */}
        <polygon points="1335,1080 1395,760 1470,700 1560,705 1600,760 1630,1080" fill="#0d141d" stroke={edge} strokeWidth={2} strokeLinejoin="round" />
        {/* 顶部导轨高光 */}
        <polygon points="1395,760 1470,700 1560,705 1520,745 1440,752" fill={hi} opacity={0.85} />
        {/* 侧面切角 */}
        <polygon points="1360,960 1400,820 1440,830 1410,980" fill="#1a2533" stroke={edge} strokeWidth={1} opacity={0.9} />
        {/* 握把 */}
        <polygon points="1500,880 1600,870 1660,1080 1540,1080" fill="#0a1018" stroke={edge} strokeWidth={1.5} />
      </g>
    </svg>
  );
};

/** 弹道：从枪口 (from) 到命中点 (to) 的一道亮线，t 是出现后的帧数（6 帧内消失） */
export const Tracer: React.FC<{from?: [number, number]; to: [number, number]; t: number; color?: string}> = ({from = [1440, 760], to, t, color = '#ffe9b0'}) => {
  if (t < 0 || t > 6) return null;
  const o = 1 - t / 6;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={3} opacity={o} style={{filter: glowF(color, 6)}} />
      {t < 3 && <circle cx={from[0]} cy={from[1]} r={22 * (1 - t / 3)} fill="#fff6d8" style={{filter: glowF('#ffd27a', 14)}} />}
    </svg>
  );
};

/** 命中标记：X 形四段 + 可选文字（HEADSHOT / MISS），at 帧出现、24 帧淡出 */
export const HitMark: React.FC<{f: number; at: number; x?: number; y?: number; text?: string; color?: string}> = ({f, at, x = 960, y = 540, text, color = '#ffffff'}) => {
  const t = f - at;
  if (t < 0 || t > 30) return null;
  const o = 1 - clamp01((t - 16) / 14);
  const s = 1.3 - 0.3 * easeOut(clamp01(t / 6));
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: o}}>
      <g stroke={color} strokeWidth={4} transform={`translate(${x} ${y}) scale(${s})`} style={{filter: glowF(color, 4)}}>
        {[45, 135, 225, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={Math.cos(r) * 12} y1={Math.sin(r) * 12} x2={Math.cos(r) * 28} y2={Math.sin(r) * 28} />;
        })}
      </g>
      {text ? (
        <text x={x} y={y - 52} textAnchor="middle" fontFamily={TF.mono} fontWeight={700} fontSize={30} letterSpacing={6} fill={color === '#ffffff' ? T.red : color} style={{filter: glowF(T.red, 6)}}>
          {text}
        </text>
      ) : null}
    </svg>
  );
};

/* ---------------- 俯视图 ---------------- */

export type MapBlock = [number, number, number, number]; // x, y, w, h（屏幕像素）
export type MapUnit = {x: number; y: number; color: string; label?: string; dir?: number; fov?: number; reach?: number};

/** 俯视图：深色掩体块 + 单位（圆点 + 标签），dir / fov 给了就画视野扇形；sight 画两点之间的视线 */
export const TopMap: React.FC<{blocks: MapBlock[]; units: MapUnit[]; sight?: [number, number, number, number, string][]; grid?: boolean}> = ({blocks, units, sight = [], grid = true}) => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
    {grid &&
      Array.from({length: 33}, (_, i) => <line key={`v${i}`} x1={i * 60} x2={i * 60} y1={0} y2={H} stroke="rgba(120,170,200,0.06)" />)}
    {grid && Array.from({length: 19}, (_, i) => <line key={`h${i}`} x1={0} x2={W} y1={i * 60} y2={i * 60} stroke="rgba(120,170,200,0.06)" />)}
    {units.map((u, i) =>
      u.dir !== undefined && u.fov ? (
        <path
          key={`fov${i}`}
          d={`M${u.x} ${u.y} L${u.x + Math.cos(u.dir - u.fov / 2) * (u.reach ?? 700)} ${u.y + Math.sin(u.dir - u.fov / 2) * (u.reach ?? 700)} A${u.reach ?? 700} ${u.reach ?? 700} 0 0 1 ${u.x + Math.cos(u.dir + u.fov / 2) * (u.reach ?? 700)} ${u.y + Math.sin(u.dir + u.fov / 2) * (u.reach ?? 700)} Z`}
          fill={u.color}
          opacity={0.22}
        />
      ) : null,
    )}
    {blocks.map(([x, y, w, h], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill="#1a2a3c" stroke="rgba(160,210,230,0.35)" strokeWidth={1.5} />
    ))}
    {sight.map(([x1, y1, x2, y2, c], i) => (
      <line key={`s${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={3} style={{filter: glowF(c, 5)}} />
    ))}
    {units.map((u, i) => (
      <g key={`u${i}`}>
        <circle cx={u.x} cy={u.y} r={14} fill="none" stroke={u.color} strokeWidth={3} style={{filter: glowF(u.color, 6)}} />
        <circle cx={u.x} cy={u.y} r={6} fill={u.color} />
        {u.label ? (
          <text x={u.x + 24} y={u.y + 8} fontFamily={TF.sans} fontSize={24} fill={u.color}>
            {u.label}
          </text>
        ) : null}
      </g>
    ))}
  </svg>
);
