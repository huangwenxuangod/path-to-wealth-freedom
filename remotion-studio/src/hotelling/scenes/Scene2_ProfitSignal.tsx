import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene2_ProfitSignal({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});

  // 空街出现
  const streetOpacity = interpolate(seconds, [0.5, 1], [0, 1], {extrapolateRight: 'clamp'});

  // 第一家店出现
  const store1Opacity = interpolate(seconds, [1.5, 2], [0, 1], {extrapolateRight: 'clamp'});
  const store1Scale = interpolate(seconds, [1.5, 2], [0.8, 1], {extrapolateRight: 'clamp'});

  // 客流数字增长
  const customerCount = Math.floor(interpolate(seconds, [2.5, 4], [0, 120], {extrapolateRight: 'clamp'}));
  const customerOpacity = interpolate(seconds, [2.5, 3], [0, 1], {extrapolateRight: 'clamp'});

  // 利润数字增长
  const profit = Math.floor(interpolate(seconds, [4, 5.5], [0, 680], {extrapolateRight: 'clamp'}));
  const profitOpacity = interpolate(seconds, [4, 4.5], [0, 1], {extrapolateRight: 'clamp'});

  // 利润线高度
  const profitLineHeight = interpolate(seconds, [5, 6], [0, 100], {extrapolateRight: 'clamp'});

  // 成本线
  const costLineOpacity = interpolate(seconds, [6, 6.5], [0, 1], {extrapolateRight: 'clamp'});

  // 第二家店出现
  const store2Opacity = interpolate(seconds, [6.5, 7], [0, 1], {extrapolateRight: 'clamp'});
  const store2Scale = interpolate(seconds, [6.5, 7], [0.5, 1], {extrapolateRight: 'clamp'});

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
          第一层机制
        </div>
        <h2 style={{
          fontSize: tokens.fontSize.h2,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
        }}>
          利润会暴露机会
        </h2>
      </div>

      {/* 街道视图 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '52%',
        transform: 'translate(-50%, -50%)',
        opacity: streetOpacity,
      }}>
        {/* 街道背景 */}
        <div style={{
          width: 1200,
          height: 300,
          background: tokens.color.surface1,
          borderRadius: 16,
          position: 'relative',
          border: `1px solid ${tokens.color.line}`,
        }}>
          {/* 街道标签 */}
          <div style={{
            position: 'absolute',
            top: -40,
            left: 0,
            fontSize: 20,
            color: tokens.color.muted,
            letterSpacing: 2,
          }}>
            一条空街
          </div>

          {/* 第一家店 */}
          <div style={{
            position: 'absolute',
            left: 120,
            top: '50%',
            transform: `translate(-50%, -50%) scale(${store1Scale})`,
            opacity: store1Opacity,
            width: 180,
            height: 160,
            background: tokens.color.surface3,
            border: `2px solid ${tokens.color.success}`,
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 8,
            }}>
              {spec.originalStore.name}
            </div>
            <div style={{
              fontSize: 16,
              color: tokens.color.muted,
            }}>
              第一家店
            </div>

            {/* 客流指示器 */}
            {seconds >= 2.5 && (
              <div style={{
                position: 'absolute',
                top: -60,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: customerOpacity,
              }}>
                <div style={{
                  background: tokens.color.surface2,
                  border: `2px solid ${tokens.color.secondary}`,
                  borderRadius: 12,
                  padding: '8px 16px',
                  fontSize: 18,
                  fontWeight: 600,
                  color: tokens.color.secondary,
                  whiteSpace: 'nowrap',
                }}>
                  客流 {customerCount}
                </div>
              </div>
            )}

            {/* 利润指示器 */}
            {seconds >= 4 && (
              <div style={{
                position: 'absolute',
                bottom: -60,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: profitOpacity,
              }}>
                <div style={{
                  background: tokens.color.surface2,
                  border: `2px solid ${tokens.color.accent}`,
                  borderRadius: 12,
                  padding: '8px 16px',
                  fontSize: 18,
                  fontWeight: 600,
                  color: tokens.color.accent,
                  whiteSpace: 'nowrap',
                }}>
                  利润 ¥{profit}
                </div>
              </div>
            )}
          </div>

          {/* 客流动画（小点） */}
          {seconds >= 2.5 && seconds < 4 && (
            <>
              {[...Array(8)].map((_, i) => {
                const progress = (seconds - 2.5 + i * 0.15) % 1.5;
                const x = 50 + progress * 600;
                const opacity = progress < 1 ? 1 : 0;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: 150,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: tokens.color.secondary,
                      opacity: opacity * 0.8,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* 利润图表 */}
          {seconds >= 5 && (
            <div style={{
              position: 'absolute',
              right: 180,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 400,
              height: 200,
            }}>
              {/* Y轴 */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 2,
                background: tokens.color.line,
              }} />

              {/* 成本线 */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 140,
                width: '100%',
                height: 2,
                background: tokens.color.muted,
                opacity: costLineOpacity,
              }}>
                <div style={{
                  position: 'absolute',
                  left: -80,
                  top: -10,
                  fontSize: 16,
                  color: tokens.color.muted,
                  whiteSpace: 'nowrap',
                }}>
                  开店成本线
                </div>
              </div>

              {/* 利润柱 */}
              <div style={{
                position: 'absolute',
                left: 100,
                bottom: 0,
                width: 80,
                height: profitLineHeight,
                background: tokens.color.accent,
                borderRadius: '4px 4px 0 0',
              }}>
                <div style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 20,
                  fontWeight: 600,
                  color: tokens.color.accent,
                  whiteSpace: 'nowrap',
                }}>
                  预期利润
                </div>
              </div>
            </div>
          )}

          {/* 第二家店（空位变实） */}
          {seconds >= 6.5 && (
            <div style={{
              position: 'absolute',
              left: 360,
              top: '50%',
              transform: `translate(-50%, -50%) scale(${store2Scale})`,
              opacity: store2Opacity,
              width: 180,
              height: 160,
              background: tokens.color.surface3,
              border: `2px solid ${tokens.color.accent}`,
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 8,
              }}>
                {spec.newStore.name}
              </div>
              <div style={{
                fontSize: 16,
                color: tokens.color.muted,
              }}>
                新店进入
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部解释 */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 112,
        right: 112,
        opacity: interpolate(seconds, [7, 7.5], [0, 1], {extrapolateRight: 'clamp'}),
      }}>
        <div style={{
          fontSize: tokens.fontSize.body,
          color: tokens.color.text,
          lineHeight: 1.6,
          maxWidth: 1200,
        }}>
          第一家店的排队和盈利，向潜在竞争者证明了：
          <span style={{color: tokens.color.accent, fontWeight: 600}}> 这里有需求，有人愿意买</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
