import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';

/**
 * 场景4：价格绞杀 - 伯特兰价格竞争
 * 时长：25秒
 * 核心概念：Bertrand Price Competition
 * 视觉：价格数字对决，客流实时转移，利润条被榨干
 */
export function Scene4_PriceKill({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 初始状态：两家同价
  const initialState = interpolate(seconds, [1, 3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 第一次降价：隔壁降2元
  const firstDrop = interpolate(seconds, [4, 5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const customerShift1 = interpolate(seconds, [5, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 老店跟价
  const oldStoreResponse = interpolate(seconds, [9, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 隔壁再降
  const secondDrop = interpolate(seconds, [11, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const customerShift2 = interpolate(seconds, [12, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 利润条压缩
  const profitSqueeze = interpolate(seconds, [15, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 结论
  const conclusionOpacity = interpolate(seconds, [19, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const conceptOpacity = interpolate(seconds, [21, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 动态价格计算
  const oldPrice = spec.originalStore.price - (oldStoreResponse * 2);
  const newPrice = spec.competitorStore.price - (secondDrop * 1);

  // 客流分配
  const oldStoreCustomers = Math.floor(interpolate(customerShift2, [0, 1], [60, 30], {extrapolateRight: 'clamp'}));
  const newStoreCustomers = Math.floor(interpolate(customerShift2, [0, 1], [40, 70], {extrapolateRight: 'clamp'}));

  // 利润率
  const oldStoreProfit = Math.max(0, (oldPrice - spec.originalStore.cost) / oldPrice * 100);
  const newStoreProfit = Math.max(0, (newPrice - spec.competitorStore.cost) / newPrice * 100);

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
          color: tokens.color.accent.primary,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: tokens.letterSpacing.wide,
        }}>
          第三层：价格绞杀
        </h2>
        <p style={{
          fontSize: tokens.fontSize.xl,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          商品越像，价格越有杀伤力
        </p>
      </div>

      {/* 主对战区域 */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        height: '55%',
        display: 'flex',
        gap: tokens.spacing['2xl'],
        opacity: initialState,
      }}>
        {/* 老店 */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${tokens.color.surface[2]}, ${tokens.color.surface[1]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `3px solid ${tokens.color.store.original}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: tokens.shadow.lg,
        }}>
          <div style={{
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.store.original,
            textAlign: 'center',
          }}>
            {spec.originalStore.name}
          </div>

          {/* 价格大牌 */}
          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: tokens.fontSize['6xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.text.primary,
              fontFamily: tokens.font.mono,
              textShadow: `0 4px 20px ${tokens.color.store.original}40`,
            }}>
              ¥{oldPrice.toFixed(0)}
            </div>

            {/* 降价动画标记 */}
            {oldStoreResponse > 0 && oldStoreResponse < 1 && (
              <div style={{
                fontSize: tokens.fontSize.xl,
                color: tokens.color.accent.warning,
                marginTop: tokens.spacing.sm,
                fontWeight: tokens.fontWeight.bold,
              }}>
                ⬇️ 跟价
              </div>
            )}
          </div>

          {/* 客流数字 */}
          <div style={{
            background: tokens.color.surface[3],
            borderRadius: tokens.radius.lg,
            padding: tokens.spacing.md,
            textAlign: 'center',
          }}>
            <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>客流</div>
            <div style={{
              fontSize: tokens.fontSize['3xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.store.original,
            }}>
              {oldStoreCustomers}
            </div>
          </div>

          {/* 利润率条 */}
          <div style={{
            marginTop: tokens.spacing.md,
          }}>
            <div style={{fontSize: tokens.fontSize.xs, color: tokens.color.text.muted, marginBottom: tokens.spacing.xs}}>
              利润率
            </div>
            <div style={{
              width: '100%',
              height: 24,
              background: tokens.color.surface[3],
              borderRadius: tokens.radius.full,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                width: `${oldStoreProfit}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${tokens.color.accent.success}, ${tokens.color.accent.warning})`,
                transition: 'width 0.5s ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: tokens.spacing.xs,
              }}>
                <span style={{fontSize: tokens.fontSize.xs, color: tokens.color.surface[0], fontWeight: tokens.fontWeight.bold}}>
                  {oldStoreProfit.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* VS 分隔符 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${tokens.color.accent.primary}, ${tokens.color.accent.warning})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.black,
            color: tokens.color.surface[0],
            boxShadow: `0 0 30px ${tokens.color.accent.primary}60`,
          }}>
            VS
          </div>
        </div>

        {/* 隔壁店 */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${tokens.color.surface[2]}, ${tokens.color.surface[1]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `3px solid ${tokens.color.store.competitor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: tokens.shadow.lg,
        }}>
          <div style={{
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.store.competitor,
            textAlign: 'center',
          }}>
            {spec.competitorStore.name}
          </div>

          {/* 价格大牌 */}
          <div style={{
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              fontSize: tokens.fontSize['6xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.text.primary,
              fontFamily: tokens.font.mono,
              textShadow: `0 4px 20px ${tokens.color.store.competitor}40`,
            }}>
              ¥{newPrice.toFixed(0)}
            </div>

            {/* 降价闪电标记 */}
            {(firstDrop > 0 && firstDrop < 1) || (secondDrop > 0 && secondDrop < 1) ? (
              <div style={{
                fontSize: tokens.fontSize.xl,
                color: tokens.color.accent.primary,
                marginTop: tokens.spacing.sm,
                fontWeight: tokens.fontWeight.black,
                animation: 'pulse 0.5s ease-in-out infinite',
              }}>
                ⚡ 降价
              </div>
            ) : null}
          </div>

          {/* 客流数字 */}
          <div style={{
            background: tokens.color.surface[3],
            borderRadius: tokens.radius.lg,
            padding: tokens.spacing.md,
            textAlign: 'center',
          }}>
            <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>客流</div>
            <div style={{
              fontSize: tokens.fontSize['3xl'],
              fontWeight: tokens.fontWeight.black,
              color: tokens.color.store.competitor,
            }}>
              {newStoreCustomers}
              {customerShift2 > 0.5 && (
                <span style={{fontSize: tokens.fontSize.lg, color: tokens.color.accent.success, marginLeft: tokens.spacing.xs}}>
                  ↑
                </span>
              )}
            </div>
          </div>

          {/* 利润率条 */}
          <div style={{
            marginTop: tokens.spacing.md,
          }}>
            <div style={{fontSize: tokens.fontSize.xs, color: tokens.color.text.muted, marginBottom: tokens.spacing.xs}}>
              利润率
            </div>
            <div style={{
              width: '100%',
              height: 24,
              background: tokens.color.surface[3],
              borderRadius: tokens.radius.full,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                width: `${newStoreProfit}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${tokens.color.accent.primary}, ${tokens.color.accent.warning})`,
                transition: 'width 0.5s ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: tokens.spacing.xs,
              }}>
                <span style={{fontSize: tokens.fontSize.xs, color: tokens.color.surface[0], fontWeight: tokens.fontWeight.bold}}>
                  {newStoreProfit.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 结论区域 */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conclusionOpacity,
        width: '80%',
      }}>
        <p style={{
          fontSize: tokens.fontSize['2xl'],
          fontWeight: tokens.fontWeight.bold,
          color: tokens.color.accent.primary,
          margin: 0,
          lineHeight: tokens.lineHeight.snug,
        }}>
          伯特兰悖论：价格竞争把利润一起榨干
        </p>
        <p style={{
          fontSize: tokens.fontSize.lg,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          商品足够像 + 换店足够容易 = 价格成为唯一武器
        </p>
      </div>

      {/* 经济学概念标注 */}
      <div style={{
        position: 'absolute',
        bottom: tokens.spacing['2xl'],
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conceptOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${tokens.color.surface[3]}, ${tokens.color.surface[2]})`,
          border: `2px solid ${tokens.color.accent.primary}`,
          borderRadius: tokens.radius.full,
          padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
          boxShadow: `0 0 30px ${tokens.color.accent.primary}40`,
        }}>
          <span style={{
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.accent.primary,
            fontFamily: tokens.font.mono,
          }}>
            {spec.concepts.bertrand}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
