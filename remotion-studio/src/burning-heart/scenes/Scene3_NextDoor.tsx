import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {tokens} from '../tokens';
import type {BurningHeartSpec} from '../spec';

/**
 * 场景3：为什么贴脸开 - 霍特林空间竞争模型
 * 时长：25秒
 * 核心概念：霍特林模型（Hotelling Model）+ 零售集聚（Retail Agglomeration）
 * 视觉：两次实验对比 - 分散布局 vs 贴脸布局，展示客流分配差异
 */
export function Scene3_NextDoor({spec, seconds}: {spec: BurningHeartSpec; seconds: number}) {
  const titleOpacity = interpolate(seconds, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const questionOpacity = interpolate(seconds, [1, 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 实验1：分散布局
  const experiment1Start = interpolate(seconds, [3, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const experiment1Flow = interpolate(seconds, [4, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 实验2：贴脸布局
  const experiment2Start = interpolate(seconds, [10, 11], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const experiment2Flow = interpolate(seconds, [11, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 结论展示
  const conclusionOpacity = interpolate(seconds, [16, 17], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const conceptOpacity = interpolate(seconds, [18, 19], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const detailOpacity = interpolate(seconds, [20, 21], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 计算客流数字
  const experiment1OldStore = Math.floor(interpolate(experiment1Flow, [0, 1], [0, 60], {extrapolateRight: 'clamp'}));
  const experiment1NewStore = Math.floor(interpolate(experiment1Flow, [0, 1], [0, 40], {extrapolateRight: 'clamp'}));
  const experiment2OldStore = Math.floor(interpolate(experiment2Flow, [0, 1], [0, 55], {extrapolateRight: 'clamp'}));
  const experiment2NewStore = Math.floor(interpolate(experiment2Flow, [0, 1], [0, 65], {extrapolateRight: 'clamp'}));

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
          第二层：为什么贴脸开
        </h2>
        <p style={{
          fontSize: tokens.fontSize.xl,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
          opacity: questionOpacity,
        }}>
          新店明知老店在这，为什么还要挨着开？
        </p>
      </div>

      {/* 主实验区域 - 分屏对比 */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        height: '50%',
        display: 'flex',
        gap: tokens.spacing.xl,
      }}>
        {/* 实验1：分散布局 */}
        <div style={{
          flex: 1,
          background: tokens.color.surface[1],
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `2px solid ${tokens.color.surface[3]}`,
          opacity: experiment1Start,
          position: 'relative',
        }}>
          <div style={{
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.text.secondary,
            marginBottom: tokens.spacing.lg,
            textAlign: 'center',
          }}>
            实验A：分散开店
          </div>

          {/* 街道示意 - 分散 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '60%',
            background: `linear-gradient(90deg, ${tokens.color.surface[2]} 0%, ${tokens.color.surface[3]} 50%, ${tokens.color.surface[2]} 100%)`,
            borderRadius: tokens.radius.lg,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `0 ${tokens.spacing['2xl']}`,
          }}>
            {/* 老店 - 左侧 */}
            <div style={{
              width: 80,
              height: 80,
              background: tokens.color.store.original,
              borderRadius: tokens.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${tokens.color.store.original}60`,
            }}>
              <span style={{fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.bold, color: tokens.color.surface[0]}}>老</span>
            </div>

            {/* 新店 - 右侧 */}
            <div style={{
              width: 80,
              height: 80,
              background: tokens.color.store.competitor,
              borderRadius: tokens.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${tokens.color.store.competitor}60`,
            }}>
              <span style={{fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.bold, color: tokens.color.surface[0]}}>新</span>
            </div>
          </div>

          {/* 客流数据 */}
          {experiment1Flow > 0 && (
            <div style={{
              marginTop: tokens.spacing.lg,
              display: 'flex',
              justifyContent: 'space-around',
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: tokens.fontSize['2xl'], fontWeight: tokens.fontWeight.black, color: tokens.color.store.original}}>
                  {experiment1OldStore}
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>老店客流</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: tokens.fontSize['2xl'], fontWeight: tokens.fontWeight.black, color: tokens.color.store.competitor}}>
                  {experiment1NewStore}
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>新店客流</div>
              </div>
            </div>
          )}
        </div>

        {/* 实验2：贴脸布局 */}
        <div style={{
          flex: 1,
          background: tokens.color.surface[1],
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          border: `2px solid ${tokens.color.accent.secondary}`,
          opacity: experiment2Start,
          position: 'relative',
          boxShadow: `0 0 30px ${tokens.color.accent.secondary}40`,
        }}>
          <div style={{
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.accent.secondary,
            marginBottom: tokens.spacing.lg,
            textAlign: 'center',
          }}>
            实验B：贴脸开店
          </div>

          {/* 街道示意 - 贴脸 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '60%',
            background: `linear-gradient(90deg, ${tokens.color.surface[2]} 0%, ${tokens.color.surface[3]} 50%, ${tokens.color.surface[2]} 100%)`,
            borderRadius: tokens.radius.lg,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: tokens.spacing.sm,
          }}>
            {/* 老店 */}
            <div style={{
              width: 80,
              height: 80,
              background: tokens.color.store.original,
              borderRadius: tokens.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${tokens.color.store.original}60`,
            }}>
              <span style={{fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.bold, color: tokens.color.surface[0]}}>老</span>
            </div>

            {/* 新店 - 紧挨着 */}
            <div style={{
              width: 80,
              height: 80,
              background: tokens.color.store.competitor,
              borderRadius: tokens.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${tokens.color.store.competitor}60`,
            }}>
              <span style={{fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.bold, color: tokens.color.surface[0]}}>新</span>
            </div>
          </div>

          {/* 客流数据 */}
          {experiment2Flow > 0 && (
            <div style={{
              marginTop: tokens.spacing.lg,
              display: 'flex',
              justifyContent: 'space-around',
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: tokens.fontSize['2xl'], fontWeight: tokens.fontWeight.black, color: tokens.color.store.original}}>
                  {experiment2OldStore}
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>老店客流</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: tokens.fontSize['2xl'], fontWeight: tokens.fontWeight.black, color: tokens.color.store.competitor}}>
                  {experiment2NewStore}
                  <span style={{
                    fontSize: tokens.fontSize.sm,
                    color: tokens.color.accent.success,
                    marginLeft: tokens.spacing.xs,
                  }}>↑</span>
                </div>
                <div style={{fontSize: tokens.fontSize.sm, color: tokens.color.text.muted}}>新店客流</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 结论区域 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conclusionOpacity,
      }}>
        <p style={{
          fontSize: tokens.fontSize['2xl'],
          fontWeight: tokens.fontWeight.bold,
          color: tokens.color.accent.secondary,
          margin: 0,
          lineHeight: tokens.lineHeight.snug,
        }}>
          贴脸开店，共享老店验证过的客流
        </p>
        <p style={{
          fontSize: tokens.fontSize.lg,
          color: tokens.color.text.secondary,
          margin: `${tokens.spacing.sm} 0 0`,
        }}>
          省下了最贵的成本：让顾客知道去哪儿找
        </p>
      </div>

      {/* 经济学概念标注 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: conceptOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${tokens.color.surface[3]}, ${tokens.color.surface[2]})`,
          border: `2px solid ${tokens.color.accent.secondary}`,
          borderRadius: tokens.radius.full,
          padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
          boxShadow: tokens.shadow.lg,
        }}>
          <span style={{
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.bold,
            color: tokens.color.accent.secondary,
            fontFamily: tokens.font.mono,
          }}>
            {spec.concepts.hotelling}
          </span>
        </div>
      </div>

      {/* 详细说明 */}
      <div style={{
        position: 'absolute',
        bottom: tokens.spacing.xl,
        left: tokens.spacing.xl,
        right: tokens.spacing.xl,
        opacity: detailOpacity,
      }}>
        <div style={{
          background: tokens.color.surface[2],
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.lg,
          border: `1px solid ${tokens.color.surface[4]}`,
        }}>
          <p style={{
            fontSize: tokens.fontSize.base,
            color: tokens.color.text.secondary,
            margin: 0,
            lineHeight: tokens.lineHeight.relaxed,
          }}>
            <strong style={{color: tokens.color.accent.warning}}>⚠️ 修正：</strong>
            d'Aspremont (1979) 指出，霍特林原模型有假设缺陷。
            现实中商家贴脸开，是因为<strong style={{color: tokens.color.accent.secondary}}>共享客流的收益</strong>
            大于<strong style={{color: tokens.color.accent.primary}}>价格竞争的损失</strong>。
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}
