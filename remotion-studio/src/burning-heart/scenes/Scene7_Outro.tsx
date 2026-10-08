import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';

/**
 * 场景7：收尾 - 知识回顾 + 五个机制整合 + 信息源
 * 时长：13秒
 * 视觉：五个经济学概念卡片展开，形成知识地图
 */
export function Scene7_Outro({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const chainReveal = interpolate(seconds, [1, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const concept1 = interpolate(seconds, [2, 2.5], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const concept2 = interpolate(seconds, [2.5, 3], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const concept3 = interpolate(seconds, [3, 3.5], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const concept4 = interpolate(seconds, [3.5, 4], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const concept5 = interpolate(seconds, [4, 4.5], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  const summaryOpacity = interpolate(seconds, [5, 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const creditOpacity = interpolate(seconds, [7, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const sourceOpacity = interpolate(seconds, [9, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const endingOpacity = interpolate(seconds, [11, 13], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const concepts = [
    {name: spec.concepts.freeEntry, emoji: '📡', color: tokens.color.accent.success, opacity: concept1},
    {name: spec.concepts.hotelling, emoji: '📍', color: tokens.color.accent.secondary, opacity: concept2},
    {name: spec.concepts.bertrand, emoji: '⚔️', color: tokens.color.accent.primary, opacity: concept3},
    {name: 'Lemon Market', emoji: '🍋', color: tokens.color.accent.warning, opacity: concept4},
    {name: spec.concepts.redQueen, emoji: '♛', color: tokens.color.accent.primary, opacity: concept5},
  ];

  return (
    <AbsoluteFill style={{
      background: tokens.color.surface[0],
      padding: tokens.spacing['2xl'],
    }}>
      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: tokens.spacing['2xl'],
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontSize: tokens.fontSize['4xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.text.primary,
          margin: 0,
          letterSpacing: tokens.letterSpacing.tight,
        }}>
          五个机制的嵌套链条
        </h2>
      </div>

      {/* 概念链条 - 垂直排列 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75%',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.md,
        opacity: chainReveal,
      }}>
        {concepts.map((concept, index) => (
          <div
            key={index}
            style={{
              background: `linear-gradient(90deg, ${tokens.color.surface[2]}, ${tokens.color.surface[3]})`,
              borderRadius: tokens.radius.lg,
              padding: tokens.spacing.lg,
              border: `2px solid ${concept.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.lg,
              opacity: concept.opacity,
              transform: `translateX(${(1 - concept.opacity) * -50}px)`,
              boxShadow: concept.opacity > 0.8 ? `0 0 20px ${concept.color}40` : 'none',
            }}
          >
            {/* 序号 */}
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: concept.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.surface[0],
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* Emoji */}
            <div style={{
              fontSize: tokens.fontSize['3xl'],
              flexShrink: 0,
            }}>
              {concept.emoji}
            </div>

            {/* 概念名称 */}
            <div style={{
              flex: 1,
            }}>
              <div style={{
                fontSize: tokens.fontSize.xl,
                fontWeight: tokens.fontWeight.bold,
                color: concept.color,
                fontFamily: tokens.font.mono,
              }}>
                {concept.name}
              </div>
            </div>

            {/* 连接箭头（除了最后一个）*/}
            {index < concepts.length - 1 && (
              <div style={{
                position: 'absolute',
                left: 25,
                bottom: -20,
                fontSize: tokens.fontSize['2xl'],
                color: concept.color,
                opacity: 0.6,
              }}>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 总结陈述 */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: summaryOpacity,
        width: '80%',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${tokens.color.surface[3]}, ${tokens.color.surface[2]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `2px solid ${tokens.color.accent.secondary}`,
          boxShadow: `0 0 40px ${tokens.color.accent.secondary}30`,
        }}>
          <p style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.color.text.primary,
            margin: 0,
            lineHeight: tokens.lineHeight.relaxed,
          }}>
            老店的<span style={{color: tokens.color.accent.success, fontWeight: tokens.fontWeight.bold}}>利润</span>
            发出信号 → 新店
            <span style={{color: tokens.color.accent.secondary, fontWeight: tokens.fontWeight.bold}}>贴脸</span>
            进入 →
            <span style={{color: tokens.color.accent.primary, fontWeight: tokens.fontWeight.bold}}>降价</span>
            抢客 → 品质难验证时
            <span style={{color: tokens.color.accent.warning, fontWeight: tokens.fontWeight.bold}}>便宜胜出</span>
             →
            <span style={{color: tokens.color.accent.primary, fontWeight: tokens.fontWeight.bold}}>谁停谁死</span>
          </p>
        </div>
      </div>

      {/* 研究者署名 */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: creditOpacity,
      }}>
        <p style={{
          fontSize: tokens.fontSize.base,
          color: tokens.color.text.muted,
          margin: 0,
        }}>
          研究时间：2026-10-05 | 横纵分析法
        </p>
      </div>

      {/* 信息源 */}
      <div style={{
        position: 'absolute',
        bottom: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: sourceOpacity,
      }}>
        <div style={{
          background: tokens.color.surface[2],
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.md,
          border: `1px solid ${tokens.color.surface[4]}`,
          maxWidth: 600,
        }}>
          <div style={{
            fontSize: tokens.fontSize.xs,
            color: tokens.color.text.muted,
            lineHeight: tokens.lineHeight.relaxed,
          }}>
            <strong style={{color: tokens.color.text.secondary}}>理论来源：</strong>
            Hotelling (1929) · d'Aspremont (1979) · Bertrand (1883)
            <br />
            Akerlof (1970) · Van Valen (1973) · MIT OCW 14.01/14.12
          </div>
        </div>
      </div>

      {/* 结束标语 */}
      <div style={{
        position: 'absolute',
        bottom: tokens.spacing.xl,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: endingOpacity,
      }}>
        <p style={{
          fontSize: tokens.fontSize['2xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.accent.secondary,
          margin: 0,
          letterSpacing: tokens.letterSpacing.wide,
          textTransform: 'uppercase',
        }}>
          {spec.title}
        </p>
        <p style={{
          fontSize: tokens.fontSize.base,
          color: tokens.color.text.muted,
          margin: `${tokens.spacing.xs} 0 0`,
        }}>
          {spec.subtitle}
        </p>
      </div>

      {/* 装饰性背景渐变 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: `radial-gradient(ellipse at top, ${tokens.color.accent.secondary}10 0%, transparent 70%)`,
        pointerEvents: 'none',
        opacity: endingOpacity * 0.5,
      }} />
    </AbsoluteFill>
  );
}
