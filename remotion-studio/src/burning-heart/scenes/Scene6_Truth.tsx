import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';

/**
 * 场景6：真相反转 - 便宜不等于黑心
 * 时长：20秒
 * 核心信息：打破短剧二元对立，呈现复杂真相
 * 视觉：点击隔壁店，弹出多种可能性
 */
export function Scene6_Truth({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const storeClick = interpolate(seconds, [2, 3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const optionsReveal = interpolate(seconds, [3, 5], [0, 1], {
    easing: Easing.out(Easing.back(1.1)),
    extrapolateRight: 'clamp',
  });

  const option1Highlight = interpolate(seconds, [5, 7], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const option2Highlight = interpolate(seconds, [7, 9], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const option3Highlight = interpolate(seconds, [9, 11], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const truthStatement = interpolate(seconds, [12, 13], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const finalMessage = interpolate(seconds, [14, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const redQueenHint = interpolate(seconds, [16, 17], [0, 1], {
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
          color: tokens.color.accent.secondary,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: tokens.letterSpacing.wide,
        }}>
          第五层：真相反转
        </h2>
        <p style={{
          fontSize: tokens.fontSize.xl,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          便宜不一定等于黑心
        </p>
      </div>

      {/* 中央店铺卡片 */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: `translateX(-50%) scale(${1 + storeClick * 0.05})`,
        opacity: storeClick > 0.5 ? 1 - (storeClick - 0.5) * 2 : 1,
      }}>
        <div style={{
          width: 280,
          height: 280,
          background: `linear-gradient(135deg, ${tokens.color.store.competitor}40, ${tokens.color.store.competitor}20)`,
          border: `4px solid ${tokens.color.store.competitor}`,
          borderRadius: tokens.radius.xl,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 0 ${40 + storeClick * 40}px ${tokens.color.store.competitor}`,
        }}>
          <div style={{
            fontSize: tokens.fontSize['3xl'],
            fontWeight: tokens.fontWeight.black,
            color: tokens.color.store.competitor,
            marginBottom: tokens.spacing.md,
          }}>
            {spec.competitorStore.name}
          </div>
          <div style={{
            fontSize: tokens.fontSize['5xl'],
            fontWeight: tokens.fontWeight.black,
            color: tokens.color.text.primary,
            fontFamily: tokens.font.mono,
          }}>
            ¥{spec.competitorStore.price}
          </div>
          {storeClick < 0.5 && (
            <div style={{
              marginTop: tokens.spacing.lg,
              fontSize: tokens.fontSize.base,
              color: tokens.color.text.muted,
            }}>
              点击查看真相 👆
            </div>
          )}
        </div>
      </div>

      {/* 三种可能性展开 */}
      {optionsReveal > 0 && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          display: 'flex',
          gap: tokens.spacing.lg,
          opacity: optionsReveal,
        }}>
          {/* 可能性1：偷工减料 */}
          <div style={{
            flex: 1,
            background: tokens.color.surface[2],
            borderRadius: tokens.radius.xl,
            padding: tokens.spacing.xl,
            border: `3px solid ${option1Highlight > 0.3 ? tokens.color.accent.primary : tokens.color.surface[4]}`,
            boxShadow: option1Highlight > 0.3 ? `0 0 30px ${tokens.color.accent.primary}60` : 'none',
            transform: `scale(${1 + option1Highlight * 0.05})`,
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: tokens.fontSize['4xl'],
              marginBottom: tokens.spacing.md,
              textAlign: 'center',
            }}>
              🚫
            </div>
            <div style={{
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.bold,
              color: tokens.color.accent.primary,
              textAlign: 'center',
              marginBottom: tokens.spacing.sm,
            }}>
              偷工减料
            </div>
            <div style={{
              fontSize: tokens.fontSize.sm,
              color: tokens.color.text.secondary,
              lineHeight: tokens.lineHeight.relaxed,
            }}>
              • 劣质食材
              <br />
              • 过期原料
              <br />
              • 调料掩盖
            </div>
          </div>

          {/* 可能性2：效率更高 */}
          <div style={{
            flex: 1,
            background: tokens.color.surface[2],
            borderRadius: tokens.radius.xl,
            padding: tokens.spacing.xl,
            border: `3px solid ${option2Highlight > 0.3 ? tokens.color.accent.success : tokens.color.surface[4]}`,
            boxShadow: option2Highlight > 0.3 ? `0 0 30px ${tokens.color.accent.success}60` : 'none',
            transform: `scale(${1 + option2Highlight * 0.05})`,
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: tokens.fontSize['4xl'],
              marginBottom: tokens.spacing.md,
              textAlign: 'center',
            }}>
              ⚡
            </div>
            <div style={{
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.bold,
              color: tokens.color.accent.success,
              textAlign: 'center',
              marginBottom: tokens.spacing.sm,
            }}>
              效率更高
            </div>
            <div style={{
              fontSize: tokens.fontSize.sm,
              color: tokens.color.text.secondary,
              lineHeight: tokens.lineHeight.relaxed,
            }}>
              • 规模采购
              <br />
              • 流程优化
              <br />
              • 房租更低
            </div>
          </div>

          {/* 可能性3：暂时亏损引流 */}
          <div style={{
            flex: 1,
            background: tokens.color.surface[2],
            borderRadius: tokens.radius.xl,
            padding: tokens.spacing.xl,
            border: `3px solid ${option3Highlight > 0.3 ? tokens.color.accent.warning : tokens.color.surface[4]}`,
            boxShadow: option3Highlight > 0.3 ? `0 0 30px ${tokens.color.accent.warning}60` : 'none',
            transform: `scale(${1 + option3Highlight * 0.05})`,
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: tokens.fontSize['4xl'],
              marginBottom: tokens.spacing.md,
              textAlign: 'center',
            }}>
              🎯
            </div>
            <div style={{
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.bold,
              color: tokens.color.accent.warning,
              textAlign: 'center',
              marginBottom: tokens.spacing.sm,
            }}>
              亏损引流
            </div>
            <div style={{
              fontSize: tokens.fontSize.sm,
              color: tokens.color.text.secondary,
              lineHeight: tokens.lineHeight.relaxed,
            }}>
              • 前期补贴
              <br />
              • 抢占市场
              <br />
              • 后期涨价
            </div>
          </div>
        </div>
      )}

      {/* 真相陈述 */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: truthStatement,
        width: '85%',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${tokens.color.surface[3]}, ${tokens.color.surface[2]})`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `2px solid ${tokens.color.accent.secondary}`,
          boxShadow: `0 0 40px ${tokens.color.accent.secondary}40`,
        }}>
          <p style={{
            fontSize: tokens.fontSize['2xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.text.primary,
            margin: 0,
            lineHeight: tokens.lineHeight.snug,
          }}>
            短剧说"守规矩者必胜"
            <br />
            <span style={{color: tokens.color.accent.secondary}}>
              经济学说"被看见的品质才必胜"
            </span>
          </p>
        </div>
      </div>

      {/* 最终金句 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: finalMessage,
      }}>
        <p style={{
          fontSize: tokens.fontSize['3xl'],
          fontWeight: tokens.fontWeight.black,
          color: tokens.color.accent.primary,
          margin: 0,
          letterSpacing: tokens.letterSpacing.tight,
          textShadow: `0 4px 30px ${tokens.color.accent.primary}40`,
        }}>
          隔壁不是刷新的，是你召唤的
        </p>
      </div>

      {/* 红皇后提示 */}
      {redQueenHint > 0 && (
        <div style={{
          position: 'absolute',
          bottom: tokens.spacing.xl,
          right: tokens.spacing.xl,
          opacity: redQueenHint,
        }}>
          <div style={{
            background: tokens.color.surface[2],
            borderRadius: tokens.radius.lg,
            padding: tokens.spacing.md,
            border: `1px solid ${tokens.color.accent.warning}`,
            maxWidth: 280,
          }}>
            <div style={{
              fontSize: tokens.fontSize.sm,
              color: tokens.color.accent.warning,
              fontWeight: tokens.fontWeight.bold,
              marginBottom: tokens.spacing.xs,
            }}>
              ⚔️ 红皇后假说
            </div>
            <div style={{
              fontSize: tokens.fontSize.xs,
              color: tokens.color.text.secondary,
              lineHeight: tokens.lineHeight.relaxed,
            }}>
              价格战一旦开始
              <br />
              谁停谁死，所以谁都停不下来
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
