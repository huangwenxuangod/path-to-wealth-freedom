import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';

/**
 * 场景5：柠檬市场 - 品质不可见时，便宜会驱逐良心
 * 时长：30秒
 * 核心概念：Akerlof's Lemon Market (1970)
 * 视觉：两碗面对比，购买前看不出差异，购买后才知道"烧不烧心"
 */
export function Scene5_Lemon({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 两碗面登场
  const bowlsAppear = interpolate(seconds, [1, 3], [0, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateRight: 'clamp',
  });

  // 价格标签
  const priceTagsOpacity = interpolate(seconds, [3, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 顾客视角：看不出差异
  const customerPOV = interpolate(seconds, [5, 7], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 顾客选择便宜的
  const customerChoice = interpolate(seconds, [8, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 揭露真相：成本差异
  const revealCost = interpolate(seconds, [12, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 质量标签出现
  const qualityReveal = interpolate(seconds, [15, 17], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 结果：客流流向
  const flowResult = interpolate(seconds, [18, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 结论
  const conclusionOpacity = interpolate(seconds, [23, 24], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const conceptOpacity = interpolate(seconds, [25, 26], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const solutionOpacity = interpolate(seconds, [27, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: tokens.color.surface[0],
      padding: tokens.spacing['2xl'],
    }}>
      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: tokens.spacing.xl,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontSize: tokens.fontSize['3xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.accent.warning,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: tokens.letterSpacing.wide,
        }}>
          第四层：柠檬市场
        </h2>
        <p style={{
          fontSize: tokens.fontSize.xl,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          品质看不见的时候，市场会奖励便宜
        </p>
      </div>

      {/* 主视觉区域 - 两碗面对比 */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        display: 'flex',
        gap: tokens.spacing['3xl'],
        opacity: bowlsAppear,
      }}>
        {/* 老店的面 */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${tokens.color.surface[2]}, ${tokens.color.surface[1]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `3px solid ${tokens.color.store.original}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: tokens.spacing.lg,
          position: 'relative',
          boxShadow: tokens.shadow.lg,
        }}>
          {/* 碗（emoji代替图片）*/}
          <div style={{
            fontSize: '120px',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
          }}>
            🍜
          </div>

          <div style={{
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.store.original,
          }}>
            {spec.originalStore.name}
          </div>

          {/* 价格标签 */}
          <div style={{
            opacity: priceTagsOpacity,
            background: tokens.color.surface[3],
            borderRadius: tokens.radius.lg,
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          }}>
            <div style={{
              fontSize: tokens.fontSize['4xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.text.primary,
              fontFamily: tokens.font.mono,
            }}>
              ¥{spec.originalStore.price}
            </div>
          </div>

          {/* 成本揭秘（延迟显示）*/}
          {revealCost > 0 && (
            <div style={{
              opacity: revealCost,
              background: tokens.color.surface[4],
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.md,
              width: '100%',
            }}>
              <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>实际成本</div>
              <div style={{
                fontSize: tokens.fontSize.xl,
                fontWeight: tokens.fontWeight.bold,
                color: tokens.color.accent.success,
                marginTop: tokens.spacing.xs,
              }}>
                ¥{spec.originalStore.cost}
              </div>
              <div style={{
                fontSize: tokens.fontSize.xs,
                color: tokens.color.text.muted,
                marginTop: tokens.spacing.xs,
              }}>
                新鲜食材 · 真材实料
              </div>
            </div>
          )}

          {/* 质量标签 */}
          {qualityReveal > 0 && (
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              background: `linear-gradient(135deg, ${tokens.color.accent.success}, ${tokens.color.accent.secondary})`,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
              boxShadow: `0 0 30px ${tokens.color.accent.success}60`,
              opacity: qualityReveal,
              transform: `scale(${qualityReveal}) rotate(${qualityReveal * 360}deg)`,
            }}>
              <span style={{
                fontSize: tokens.fontSize.lg,
                fontWeight: tokens.fontWeight.black,
                color: tokens.color.surface[0],
              }}>
                ✓ 不烧心
              </span>
            </div>
          )}
        </div>

        {/* 隔壁的面 */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${tokens.color.surface[2]}, ${tokens.color.surface[1]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `3px solid ${tokens.color.store.competitor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: tokens.spacing.lg,
          position: 'relative',
          boxShadow: tokens.shadow.lg,
        }}>
          {/* 碗 - 外观一样 */}
          <div style={{
            fontSize: '120px',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
          }}>
            🍜
          </div>

          <div style={{
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.store.competitor,
          }}>
            {spec.competitorStore.name}
          </div>

          {/* 价格标签 - 更便宜 */}
          <div style={{
            opacity: priceTagsOpacity,
            background: tokens.color.accent.primary,
            borderRadius: tokens.radius.lg,
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
            boxShadow: `0 0 20px ${tokens.color.accent.primary}60`,
          }}>
            <div style={{
              fontSize: tokens.fontSize['4xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.surface[0],
              fontFamily: tokens.font.mono,
            }}>
              ¥{spec.competitorStore.price}
            </div>
          </div>

          {/* 成本揭秘 */}
          {revealCost > 0 && (
            <div style={{
              opacity: revealCost,
              background: tokens.color.surface[4],
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.md,
              width: '100%',
            }}>
              <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>实际成本</div>
              <div style={{
                fontSize: tokens.fontSize.xl,
                fontWeight: tokens.fontWeight.bold,
                color: tokens.color.accent.warning,
                marginTop: tokens.spacing.xs,
              }}>
                ¥{spec.competitorStore.cost}
              </div>
              <div style={{
                fontSize: tokens.fontSize.xs,
                color: tokens.color.text.muted,
                marginTop: tokens.spacing.xs,
              }}>
                成本更低（原因未知）
              </div>
            </div>
          )}

          {/* 质量标签 - 问号 */}
          {qualityReveal > 0 && (
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              background: tokens.color.accent.warning,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
              boxShadow: `0 0 30px ${tokens.color.accent.warning}60`,
              opacity: qualityReveal,
              transform: `scale(${qualityReveal})`,
            }}>
              <span style={{
                fontSize: tokens.fontSize.lg,
                fontWeight: tokens.fontWeight.black,
                color: tokens.color.surface[0],
              }}>
                ？
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 顾客视角标注 */}
      {customerPOV > 0 && (
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: tokens.color.surface[2],
          border: `2px solid ${tokens.color.accent.warning}`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.lg,
          opacity: customerPOV,
        }}>
          <span style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.color.accent.warning,
            fontWeight: tokens.fontWeight.bold,
          }}>
            👁️ 顾客视角：购买前看起来一样
          </span>
        </div>
      )}

      {/* 客流结果 */}
      {flowResult > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          opacity: flowResult,
        }}>
          <div style={{
            background: tokens.color.surface[2],
            borderRadius: tokens.radius.xl,
            padding: tokens.spacing.xl,
            border: `2px solid ${tokens.color.surface[4]}`,
          }}>
            <div style={{
              fontSize: tokens.fontSize.lg,
              color: tokens.color.text.secondary,
              marginBottom: tokens.spacing.md,
              textAlign: 'center',
            }}>
              顾客选择结果
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: tokens.spacing.xl,
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: tokens.fontSize['3xl'],
                  fontWeight: tokens.fontWeight.black,
                  color: tokens.color.store.original,
                }}>
                  30%
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>选老店</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: tokens.fontSize['3xl'],
                  fontWeight: tokens.fontWeight.black,
                  color: tokens.color.store.competitor,
                }}>
                  70%
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>选隔壁</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结论 */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conclusionOpacity,
        width: '80%',
      }}>
        <p style={{
          fontSize: tokens.fontSize['2xl'],
          fontWeight: tokens.fontWeight.bold,
          color: tokens.color.accent.warning,
          margin: 0,
          lineHeight: tokens.lineHeight.snug,
        }}>
          品质难验证时，低价方占上风
        </p>
      </div>

      {/* 经济学概念 */}
      <div style={{
        position: 'absolute',
        bottom: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conceptOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${tokens.color.surface[3]}, ${tokens.color.surface[2]})`,
          border: `2px solid ${tokens.color.accent.warning}`,
          borderRadius: tokens.radius.full,
          padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
          boxShadow: `0 0 30px ${tokens.color.accent.warning}40`,
        }}>
          <span style={{
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.accent.warning,
            fontFamily: tokens.font.mono,
          }}>
            柠檬市场 · Akerlof 1970
          </span>
        </div>
      </div>

      {/* 破局之道 */}
      <div style={{
        position: 'absolute',
        bottom: tokens.spacing.xl,
        right: tokens.spacing.xl,
        opacity: solutionOpacity,
      }}>
        <div style={{
          background: tokens.color.surface[2],
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.md,
          border: `1px solid ${tokens.color.accent.secondary}`,
          maxWidth: 280,
        }}>
          <div style={{
            fontSize: tokens.fontSize.sm,
            color: tokens.color.accent.secondary,
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.xs,
          }}>
            💡 破局之道
          </div>
          <div style={{
            fontSize: tokens.fontSize.xs,
            color: tokens.color.text.secondary,
            lineHeight: tokens.lineHeight.relaxed,
          }}>
            复购、口碑、明厨亮灶、食材溯源
            <br />
            —— 让"不烧心"可验证
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
