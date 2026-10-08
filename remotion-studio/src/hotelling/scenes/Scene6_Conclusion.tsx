import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene6_Conclusion({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});

  // 回到开场画面
  const storesOpacity = interpolate(seconds, [0.5, 1], [0, 1], {extrapolateRight: 'clamp'});

  // 三条机制线
  const line1Opacity = interpolate(seconds, [1.5, 2], [0, 1], {extrapolateRight: 'clamp'});
  const line2Opacity = interpolate(seconds, [2.2, 2.7], [0, 1], {extrapolateRight: 'clamp'});
  const line3Opacity = interpolate(seconds, [2.9, 3.4], [0, 1], {extrapolateRight: 'clamp'});

  // 最终结论
  const conclusionOpacity = interpolate(seconds, [3.8, 4.3], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.bg}}>
      {/* 顶部总结标题 */}
      <div style={{
        position: 'absolute',
        top: 84,
        left: 112,
        right: 112,
        opacity: titleOpacity,
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: tokens.fontSize.h2,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
          color: tokens.color.accent,
        }}>
          隔壁不是突然刷新的
        </h2>
      </div>

      {/* 回到开场：两个店铺 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '35%',
        transform: 'translate(-50%, -50%)',
        opacity: storesOpacity,
        display: 'flex',
        gap: 80,
        alignItems: 'center',
      }}>
        {/* 老店 */}
        <div style={{
          width: 280,
          height: 200,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.success}`,
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{fontSize: 32, fontWeight: 600}}>
            {spec.originalStore.name}
          </div>
          <div style={{fontSize: 20, color: tokens.color.muted, marginTop: 8}}>
            {spec.originalStore.principle}
          </div>
          <div style={{fontSize: 40, fontWeight: 700, color: tokens.color.success, marginTop: 16}}>
            ¥{spec.originalStore.price}
          </div>
        </div>

        {/* 新店 */}
        <div style={{
          width: 280,
          height: 200,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.accent}`,
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{fontSize: 32, fontWeight: 600}}>
            {spec.newStore.name}
          </div>
          <div style={{fontSize: 20, color: tokens.color.muted, marginTop: 8}}>
            同类商品
          </div>
          <div style={{fontSize: 40, fontWeight: 700, color: tokens.color.accent, marginTop: 16}}>
            ¥{spec.newStore.price}
          </div>
        </div>
      </div>

      {/* 三条因果链 */}
      <div style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: '58%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* 机制1 */}
        <div style={{
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.line}`,
          borderRadius: 16,
          padding: 24,
          opacity: line1Opacity,
          transform: `translateX(${interpolate(line1Opacity, [0, 1], [-30, 0])})`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 700,
              color: tokens.color.accent,
              minWidth: 60,
            }}>
              1
            </div>
            <div style={{
              fontSize: 24,
              color: tokens.color.text,
              lineHeight: 1.5,
            }}>
              <span style={{color: tokens.color.accent, fontWeight: 600}}>利润暴露机会</span>
              {' '}— 老店的生意验证了需求，吸引新玩家进入
            </div>
          </div>
        </div>

        {/* 机制2 */}
        <div style={{
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.line}`,
          borderRadius: 16,
          padding: 24,
          opacity: line2Opacity,
          transform: `translateX(${interpolate(line2Opacity, [0, 1], [-30, 0])})`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 700,
              color: tokens.color.secondary,
              minWidth: 60,
            }}>
              2
            </div>
            <div style={{
              fontSize: 24,
              color: tokens.color.text,
              lineHeight: 1.5,
            }}>
              <span style={{color: tokens.color.secondary, fontWeight: 600}}>空间竞争选址</span>
              {' '}— 挨着开能共享客流，但也加剧比价
            </div>
          </div>
        </div>

        {/* 机制3 */}
        <div style={{
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.line}`,
          borderRadius: 16,
          padding: 24,
          opacity: line3Opacity,
          transform: `translateX(${interpolate(line3Opacity, [0, 1], [-30, 0])})`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 700,
              color: tokens.color.success,
              minWidth: 60,
            }}>
              3
            </div>
            <div style={{
              fontSize: 24,
              color: tokens.color.text,
              lineHeight: 1.5,
            }}>
              <span style={{color: tokens.color.success, fontWeight: 600}}>价格最易感知</span>
              {' '}— 品质难辨时，降价是最快抢客的方式
            </div>
          </div>
        </div>
      </div>

      {/* 最终结论 */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 112,
        right: 112,
        opacity: conclusionOpacity,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${tokens.color.surface3}, ${tokens.color.surface2})`,
          border: `3px solid ${tokens.color.accent}`,
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: tokens.fontSize.h3,
            fontWeight: 600,
            color: tokens.color.text,
            lineHeight: 1.6,
          }}>
            最后谁活下来，不由台词决定
            <br />
            <span style={{color: tokens.color.accent}}>
              而由成本、品质可验证性，和顾客转移难度共同决定
            </span>
          </div>

          <div style={{
            marginTop: 24,
            fontSize: 20,
            color: tokens.color.muted,
            letterSpacing: 2,
          }}>
            霍特林空间竞争模型 × 伯特兰价格竞争 × 信息不对称
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
