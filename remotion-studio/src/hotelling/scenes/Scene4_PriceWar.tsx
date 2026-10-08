import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene4_PriceWar({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});

  // 两店并排
  const storesOpacity = interpolate(seconds, [0.5, 1], [0, 1], {extrapolateRight: 'clamp'});

  // 新店降价动画
  const priceDrop = interpolate(seconds, [2, 2.8], [spec.originalStore.price, spec.newStore.price], {extrapolateRight: 'clamp'});
  const priceDropOpacity = interpolate(seconds, [2, 2.5], [0, 1], {extrapolateRight: 'clamp'});

  // 客流转移
  const customerShiftOpacity = interpolate(seconds, [3, 3.5], [0, 1], {extrapolateRight: 'clamp'});
  const customerShift = interpolate(seconds, [3, 4.5], [0, 1], {extrapolateRight: 'clamp'});

  // 计算公式出现
  const formulaOpacity = interpolate(seconds, [5, 5.5], [0, 1], {extrapolateRight: 'clamp'});

  // 结论
  const conclusionOpacity = interpolate(seconds, [8.5, 9], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.bg}}>
      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: 84,
        left: 112,
        right: 112,
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: tokens.fontSize.small,
          color: tokens.color.muted,
          letterSpacing: 3,
          marginBottom: 12,
        }}>
          第三层机制 · 伯特兰价格竞争
        </div>
        <h2 style={{
          fontSize: tokens.fontSize.h2,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
        }}>
          为什么新店常常先降价？
        </h2>
      </div>

      {/* 中心：两店对比 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '45%',
        transform: 'translate(-50%, -50%)',
        opacity: storesOpacity,
        display: 'flex',
        gap: 120,
        alignItems: 'flex-start',
      }}>
        {/* 老店 */}
        <div style={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100%',
            background: tokens.color.surface2,
            border: `2px solid ${tokens.color.success}`,
            borderRadius: 24,
            padding: 32,
          }}>
            <div style={{
              fontSize: 32,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {spec.originalStore.name}
            </div>

            <div style={{
              fontSize: 20,
              color: tokens.color.muted,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              {spec.originalStore.principle}
            </div>

            <div style={{
              fontSize: 56,
              fontWeight: 700,
              color: tokens.color.success,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              ¥{spec.originalStore.price}
            </div>

            <div style={{
              background: tokens.color.surface3,
              borderRadius: 12,
              padding: 16,
              fontSize: 18,
              color: tokens.color.muted,
            }}>
              <div>成本：¥{spec.originalStore.cost}</div>
              <div style={{marginTop: 8}}>
                每份赚：¥{spec.originalStore.price - spec.originalStore.cost}
              </div>
            </div>

            {/* 熟客标识 */}
            <div style={{
              marginTop: 16,
              padding: '8px 16px',
              background: `${tokens.color.success}20`,
              borderRadius: 999,
              fontSize: 16,
              color: tokens.color.success,
              textAlign: 'center',
            }}>
              有熟客基础
            </div>
          </div>

          {/* 客流条 */}
          <div style={{
            marginTop: 24,
            width: '100%',
          }}>
            <div style={{fontSize: 16, color: tokens.color.muted, marginBottom: 8}}>
              客流分布
            </div>
            <div style={{
              width: '100%',
              height: 40,
              background: tokens.color.surface1,
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${100 - customerShift * 60}%`,
                background: tokens.color.success,
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 600,
              }}>
                {Math.round(100 - customerShift * 60)}%
              </div>
            </div>
          </div>
        </div>

        {/* 箭头 */}
        <div style={{
          alignSelf: 'center',
          marginTop: -60,
        }}>
          <div style={{
            fontSize: 48,
            color: tokens.color.accent,
            opacity: customerShiftOpacity,
            transform: `translateX(${customerShift * 40}px)`,
            transition: 'transform 1s ease',
          }}>
            →
          </div>
        </div>

        {/* 新店 */}
        <div style={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100%',
            background: tokens.color.surface2,
            border: `2px solid ${tokens.color.accent}`,
            borderRadius: 24,
            padding: 32,
            position: 'relative',
          }}>
            <div style={{
              fontSize: 32,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {spec.newStore.name}
            </div>

            <div style={{
              fontSize: 20,
              color: tokens.color.muted,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              看起来差不多
            </div>

            <div style={{
              fontSize: 56,
              fontWeight: 700,
              color: tokens.color.accent,
              textAlign: 'center',
              marginBottom: 24,
              position: 'relative',
            }}>
              {/* 原价划掉 */}
              {seconds >= 2 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 36,
                  color: tokens.color.muted,
                  textDecoration: 'line-through',
                  opacity: priceDropOpacity,
                }}>
                  ¥{spec.originalStore.price}
                </span>
              )}
              <div style={{marginTop: seconds >= 2 ? 50 : 0}}>
                ¥{seconds >= 2 ? priceDrop.toFixed(0) : spec.originalStore.price}
              </div>
            </div>

            <div style={{
              background: tokens.color.surface3,
              borderRadius: 12,
              padding: 16,
              fontSize: 18,
              color: tokens.color.muted,
            }}>
              <div>成本：¥{spec.newStore.cost}</div>
              <div style={{marginTop: 8}}>
                每份赚：¥{Math.round(priceDrop) - spec.newStore.cost}
              </div>
            </div>

            {/* 降价标签 */}
            {seconds >= 2 && (
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                background: tokens.color.accent,
                padding: '12px 24px',
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 600,
                transform: 'rotate(-12deg)',
                opacity: priceDropOpacity,
              }}>
                便宜 ¥{spec.originalStore.price - spec.newStore.price}
              </div>
            )}

            {/* 无熟客标识 */}
            <div style={{
              marginTop: 16,
              padding: '8px 16px',
              background: `${tokens.color.accent}20`,
              borderRadius: 999,
              fontSize: 16,
              color: tokens.color.accent,
              textAlign: 'center',
            }}>
              还没有熟客
            </div>
          </div>

          {/* 客流条 */}
          <div style={{
            marginTop: 24,
            width: '100%',
          }}>
            <div style={{fontSize: 16, color: tokens.color.muted, marginBottom: 8}}>
              客流分布
            </div>
            <div style={{
              width: '100%',
              height: 40,
              background: tokens.color.surface1,
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${customerShift * 60}%`,
                background: tokens.color.accent,
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 600,
              }}>
                {Math.round(customerShift * 60)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 计算公式 */}
      {seconds >= 5 && (
        <div style={{
          position: 'absolute',
          left: 112,
          bottom: 180,
          right: 112,
          opacity: formulaOpacity,
          background: tokens.color.surface1,
          border: `2px solid ${tokens.color.accent}`,
          borderRadius: 16,
          padding: 32,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 16,
            color: tokens.color.accent,
          }}>
            降价的代价
          </div>
          <div style={{
            fontSize: 20,
            color: tokens.color.text,
            lineHeight: 1.8,
          }}>
            少收 ¥{spec.originalStore.price - spec.newStore.price} → 每份利润从 ¥{spec.originalStore.price - spec.newStore.cost} 降到 ¥{spec.newStore.price - spec.newStore.cost}
            <br />
            <span style={{color: tokens.color.secondary}}>
              必须多卖 {Math.round(((spec.originalStore.price - spec.newStore.cost) / (spec.newStore.price - spec.newStore.cost) - 1) * 100)}% 才能补回来
            </span>
          </div>
        </div>
      )}

      {/* 底部结论 */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 112,
        right: 112,
        opacity: conclusionOpacity,
      }}>
        <div style={{
          fontSize: tokens.fontSize.body,
          color: tokens.color.text,
          lineHeight: 1.6,
          textAlign: 'center',
        }}>
          <span style={{color: tokens.color.accent, fontWeight: 600}}>价格是最容易被看见的差异</span>
          <br />
          当商品看起来相似、换店没成本时，小幅降价就可能夺走客流
        </div>
      </div>
    </AbsoluteFill>
  );
}
