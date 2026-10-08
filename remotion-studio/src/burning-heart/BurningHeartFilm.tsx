import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
} from 'remotion';
import {Canvas} from '@react-three/fiber';
import * as THREE from 'three';
import {EffectComposer, Bloom, Vignette, Noise} from '@react-three/postprocessing';
import {BlendFunction} from 'postprocessing';

import {
  CameraRig,
  Terrain,
  Dust,
  AtomNodes,
  GlowPaths,
  PathRunners,
  type NodeDef,
  type PathDef,
} from './film/scene3d';
import {
  ChapterLabel,
  PriceRuler,
  Legend,
  Subtitle,
  FilmGrade,
  PALETTE,
  fadeAt,
} from './film/overlay';

/* ═══════════════════════════════════════════════════════════
   全片时间轴：150 秒
   BGM 29.65 秒 × 5 轮循环
   ═══════════════════════════════════════════════════════════ */

const BGM_DURATION = 29.65;

type Beat = {
  from: number;
  to: number;
  text: string;
  accent?: string;
  chapter: {zh: string; en: string};
};

const BEATS: Beat[] = [
  {
    from: 1.6,
    to: 14,
    text: '老板刚把「规矩不能坏」的牌子挂好',
    accent: '规矩不能坏',
    chapter: {zh: '街景示意', en: 'THE STREET · SCHEMATIC'},
  },
  {
    from: 14,
    to: 26,
    text: '隔壁，就在这时候开张了',
    accent: '隔壁',
    chapter: {zh: '街景示意', en: 'THE STREET · SCHEMATIC'},
  },
  {
    from: 26,
    to: 42,
    text: '它不是随机刷新的——是老店的「利润」把它召唤来的',
    accent: '利润',
    chapter: {zh: '第一层 · 召唤', en: 'I · FREE ENTRY'},
  },
  {
    from: 42,
    to: 58,
    text: '每一份超额利润，都是发给全街的邀请函',
    accent: '邀请函',
    chapter: {zh: '第一层 · 召唤', en: 'I · FREE ENTRY'},
  },
  {
    from: 58,
    to: 72,
    text: '新店明知你在，为什么偏要挨着你开？',
    accent: '挨着你开',
    chapter: {zh: '第二层 · 贴脸', en: 'II · HOTELLING'},
  },
  {
    from: 72,
    to: 90,
    text: '因为客流是被你验证过的，它省下了最贵的那笔成本',
    accent: '最贵的那笔成本',
    chapter: {zh: '第二层 · 贴脸', en: 'II · HOTELLING'},
  },
  {
    from: 90,
    to: 108,
    text: '两份面看起来一样，价格就成了唯一的尺子',
    accent: '价格',
    chapter: {zh: '第三层 · 绞杀', en: 'III · BERTRAND'},
  },
  {
    from: 108,
    to: 124,
    text: '你降一块，它降两块，两边的利润一起被榨干',
    accent: '一起被榨干',
    chapter: {zh: '第三层 · 绞杀', en: 'III · BERTRAND'},
  },
  {
    from: 124,
    to: 140,
    text: '顾客吃不出「好料」和「差料」，于是便宜赢了',
    accent: '便宜赢了',
    chapter: {zh: '第四层 · 柠檬', en: 'IV · LEMON MARKET'},
  },
  {
    from: 140,
    to: 152,
    text: '但便宜不一定等于黑心，可能只是效率更高',
    accent: '效率更高',
    chapter: {zh: '第四层 · 柠檬', en: 'IV · LEMON MARKET'},
  },
  {
    from: 152,
    to: 168,
    text: '一旦开始奔跑，就很难停下——谁停谁死',
    accent: '谁停谁死',
    chapter: {zh: '第五层 · 红皇后', en: 'V · RED QUEEN'},
  },
  {
    from: 168,
    to: 184,
    text: '短剧说「守规矩者必胜」，经济学说「被看见的品质才必胜」',
    accent: '被看见的品质才必胜',
    chapter: {zh: '第五层 · 红皇后', en: 'V · RED QUEEN'},
  },
  {
    from: 184,
    to: 200,
    text: '隔壁不是刷新的，是你召唤的',
    accent: '是你召唤的',
    chapter: {zh: '结论', en: 'CONCLUSION'},
  },
];

/* ─────────── 场景数据 ─────────── */

const COLORS = {
  gold: '#D9A441',
  white: '#E8E4DA',
  red: '#E03A2F',
  blue: '#4A90C2',
  green: '#6FA86B',
  amber: '#E08A2F',
};

// 节点数据：原子符号标记关键城市/事件
const NODES: NodeDef[] = [
  // 起点：长安
  {x: -42, z: 8, color: COLORS.gold, birth: 2.5, label: '长安', size: 3.6},

  // 主路节点
  {x: -28, z: 6, color: COLORS.green, birth: 8},
  {x: -14, z: 4, color: COLORS.green, birth: 12},
  {x: 2, z: 3, color: COLORS.blue, birth: 16},
  {x: 18, z: 5, color: COLORS.blue, birth: 20},
  {x: 34, z: 7, color: COLORS.amber, birth: 24},

  // 终点：罗马
  {x: 48, z: 9, color: COLORS.red, birth: 28, label: '罗马', size: 3.6},

  // 分支路线节点
  {x: -6, z: -12, color: COLORS.blue, birth: 32},
  {x: 8, z: -18, color: COLORS.amber, birth: 36},
  {x: 22, z: -14, color: COLORS.red, birth: 40},

  // 回路节点
  {x: 12, z: 16, color: COLORS.green, birth: 44},
  {x: -8, z: 20, color: COLORS.blue, birth: 48},
];

// 路径数据：贸易路线
const PATHS: PathDef[] = [
  // 主干道：长安 → 罗马
  {
    points: [
      [-42, 8],
      [-28, 6],
      [-14, 4],
      [2, 3],
      [18, 5],
      [34, 7],
      [48, 9],
    ],
    color: COLORS.gold,
    from: 3,
    to: 30,
    width: 3.2,
  },

  // 南线：草原丝路
  {
    points: [
      [-28, 6],
      [-18, -8],
      [-6, -12],
      [8, -18],
      [22, -14],
      [34, 7],
    ],
    color: COLORS.blue,
    from: 32,
    to: 52,
    width: 2.4,
  },

  // 北线：沙漠丝路
  {
    points: [
      [-14, 4],
      [-8, 20],
      [12, 16],
      [26, 12],
      [48, 9],
    ],
    color: COLORS.green,
    from: 44,
    to: 64,
    width: 2.4,
  },

  // 支线：印度洋海路
  {
    points: [
      [2, 3],
      [6, -24],
      [28, -22],
      [44, -8],
      [48, 9],
    ],
    color: COLORS.amber,
    from: 68,
    to: 88,
    width: 2.0,
  },
];

export const BurningHeartFilm: React.FC<{bgm?: string}> = ({
  bgm = 'music/不烧心时代.mp3',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{background: PALETTE.bg}}>
      <Audio src={staticFile(bgm)} volume={0.55} loop />

      {/* ────────── 3D 世界 ────────── */}
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{position: 'absolute', inset: 0}}
      >
        {/* 指数雾：把远景压进纯黑，这是参考视频"无边界"感的来源 */}
        <fogExp2 attach="fog" args={['#050403', 0.0215]} />

        <CameraRig t={t} />

        <Terrain reveal={fadeAt(t, 0.2, 3)} />
        <Dust count={1500} spread={95} />

        <GlowPaths paths={PATHS} t={t} />
        <PathRunners paths={PATHS} t={t} />
        <AtomNodes nodes={NODES} t={t} />

        {/* 后期处理 */}
        <EffectComposer multisampling={8}>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.62}
            mipmapBlur
            radius={0.78}
          />
          <Noise opacity={0.028} blendFunction={BlendFunction.OVERLAY} />
          <Vignette offset={0.24} darkness={0.72} eskil={false} />
        </EffectComposer>
      </Canvas>

      {/* ────────── 2D 叠加层 ────────── */}

      <PriceRuler t={t} />
      <ChapterLabel t={t} zh="街景示意" en="CUSTOMER FLOW · SCHEMATIC" />

      <Legend
        t={t}
        startAt={26}
        items={[
          {label: '老店', color: PALETTE.green},
          {label: '新进入者', color: PALETTE.red},
          {label: '客流', color: PALETTE.gold},
          {label: '价格战', color: PALETTE.amber},
        ]}
      />

      {/* 字幕 —— 逐条切换 */}
      {BEATS.map((b, i) => (
        <Subtitle
          key={i}
          t={t}
          text={b.text}
          from={b.from}
          to={b.to}
          accent={b.accent}
        />
      ))}

      {/* 章节切换提示 */}
      <ChapterTick t={t} beats={BEATS} />

      {/* 电影后期（压在 3D 上、字幕下） */}
      <FilmGrade t={t} intensity={1} />

      {/* 片尾 */}
      <Ending t={t} total={210} />
    </AbsoluteFill>
  );
};

/* ─────────── 章节切换：右上角细进度 ─────────── */

const ChapterTick: React.FC<{t: number; beats: Beat[]}> = ({t, beats}) => {
  const idx = beats.findIndex((b) => t >= b.from && t < b.to);
  if (idx < 0) return null;
  const o = fadeAt(t, 1, 2);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 34,
        right: 52,
        display: 'flex',
        gap: 7,
        opacity: o * 0.7,
      }}
    >
      {beats.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === idx ? 26 : 9,
            height: 3,
            borderRadius: 2,
            background: i === idx ? PALETTE.gold : 'rgba(217,164,65,0.26)',
            transition: 'all 0.4s',
          }}
        />
      ))}
    </div>
  );
};

/* ─────────── 片尾 ─────────── */

const Ending: React.FC<{t: number; total: number}> = ({t, total}) => {
  const o = fadeAt(t, total - 12, total - 6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: `rgba(5,4,3,${0.88 * o})`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center', opacity: o}}>
        <div
          style={{
            fontFamily: '"Source Han Serif SC", "Noto Serif SC", serif',
            fontSize: 76,
            fontWeight: 700,
            color: PALETTE.gold,
            letterSpacing: '0.08em',
            textShadow: '0 0 60px rgba(217,164,65,0.45)',
          }}
        >
          被看见的品质，才必胜
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            letterSpacing: '0.2em',
            color: '#7a6f5d',
          }}
        >
          HOTELLING 1929 · BERTRAND 1883 · AKERLOF 1970 · VAN VALEN 1973
        </div>
      </div>
    </AbsoluteFill>
  );
};
