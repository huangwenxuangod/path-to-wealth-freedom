import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene5_QualityDifference({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});

  // 问题出现
  const questionOpacity = interpolate(seconds, [1, 1.5], [0, 1], {extrapolateRight: 'clamp'});

  // 三种情况卡片
  const card1Opacity = interpolate(seconds, [2, 2.5], [0, 1], {extrapolateRight: 'clamp'});
  const card2Opacity = interpolate(seconds, [3.5, 4], [0, 1], {extrapolateRight: 'clamp'});
  const card3Opacity = interpolate(seconds, [5, 5.5], [0, 1], {extrapolateRight: 'clamp'});

  // 品质验证链路
  const chainOpacity = interpolate(seconds, [7, 7.5], [0, 1], {extrapolateRight: 'clamp'});
  const chain1 = interpolate(seconds, [7.5, 8], [0, 1], {extrapolateRight: 'clamp'});
  const chain2 = interpolate(seconds, [8, 8.5], [0, 1], {extrapolateRight: 'clamp'});
  const chain3 = interpolate(seconds, [8.5, 9], [0, 1], {extrapolateRight: 'clamp'});

  // 最终判断
  const finalOpacity = interpolate(seconds, [9, 9.5], [0, 1], {extrapolateRight: 'clamp'});

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
          第四层机制 · 信息不对称
        </div>
        <h2 style={{
          fontSize: tokens.fontSize.h2,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
        }}>
          "不烧心"为什么有时能活下来？
        </h2>
      </div>

      {/* 核心问题 */}
      <div style={{
        position: 'absolute',
        top: 220,
        left: 112,
        right: 112,
        opacity: questionOpacity,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: tokens.fontSize.h3,
          fontWeight: 600,
          color: tokens.color.secondary,
          lineHeight: 1.4,
        }}>
          低价背后的原因不能靠价格判定
        </div>
      </div>

      {/* 三种情况卡片 */}
      <div style={{
        position: 'absolute',
        top: 320,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 32,
      }}>
        {/* 情况1：偷工减料 */}
        <div style={{
          width: 340,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.accent}`,
          borderRadius: 20,
          padding: 28,
          opacity: card1Opacity,
          transform: `translateY(${interpolate(card1Opacity, [0, 1], [20, 0])})`,
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 16,
            color: tokens.color.accent,
          }}>
            情况A
          </div>
          <div style={{
            fontSize: 20,
            color: tokens.color.text,
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            偷工减料
          </div>
          <div style={{
            background: tokens.color.surface3,
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            color: tokens.color.muted,
            lineHeight: 1.6,
          }}>
            <div>成本：¥7</div>
            <div style={{marginTop: 8}}>售价：¥13</div>
            <div style={{marginTop: 8, color: tokens.color.accent}}>
              便宜是因为料差
            </div>
          </div>
        </div>

        {/* 情况2：效率更高 */}
        <div style={{
          width: 340,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.success}`,
          borderRadius: 20,
          padding: 28,
          opacity: card2Opacity,
          transform: `translateY(${interpolate(card2Opacity, [0, 1], [20, 0])})`,
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 16,
            color: tokens.color.success,
          }}>
            情况B
          </div>
          <div style={{
            fontSize: 20,
            color: tokens.color.text,
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            效率更高
          </div>
          <div style={{
            background: tokens.color.surface3,
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            color: tokens.color.muted,
            lineHeight: 1.6,
          }}>
            <div>成本：¥9（同料）</div>
            <div style={{marginTop: 8}}>售价：¥13</div>
            <div style={{marginTop: 8, color: tokens.color.success}}>
              采购更优或规模效应
            </div>
          </div>
        </div>

        {/* 情况3：暂时亏钱 */}
        <div style={{
          width: 340,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.secondary}`,
          borderRadius: 20,
          padding: 28,
          opacity: card3Opacity,
          transform: `translateY(${interpolate(card3Opacity, [0, 1], [20, 0])})`,
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 16,
            color: tokens.color.secondary,
          }}>
            情况C
          </div>
          <div style={{
            fontSize: 20,
            color: tokens.color.text,
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            换客流
          </div>
          <div style={{
            background: tokens.color.surface3,
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            color: tokens.color.muted,
            lineHeight: 1.6,
          }}>
            <div>成本：¥11（同料）</div>
            <div style={{marginTop: 8}}>售价：¥13</div>
            <div style={{marginTop: 8, color: tokens.color.secondary}}>
              暂时少赚换客流
            </div>
          </div>
        </div>
      </div>

      {/* 品质验证链路 */}
      {seconds >= 7 && (
        <div style={{
          position: 'absolute',
          bottom: 200,
          left: 112,
          right: 112,
          opacity: chainOpacity,
        }}>
          <div style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 24,
            textAlign: 'center',
            color: tokens.color.success,
          }}>
            老店守住溢价的必要条件
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}>
            {/* 链路1 */}
            <div style={{
              flex: 1,
              maxWidth: 280,
              background: tokens.color.surface2,
              border: `2px solid ${tokens.color.line}`,
              borderRadius: 16,
              padding: 20,
              opacity: chain1,
              transform: `scale(${interpolate(chain1, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{
                fontSize: 42,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                1️⃣
              </div>
              <div style={{
                fontSize: 20,
                color: tokens.color.text,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                稳定品质
              </div>
            </div>

            <div style={{
              fontSize: 36,
              color: tokens.color.muted,
              opacity: chain1,
            }}>
              →
            </div>

            {/* 链路2 */}
            <div style={{
              flex: 1,
              maxWidth: 280,
              background: tokens.color.surface2,
              border: `2px solid ${tokens.color.line}`,
              borderRadius: 16,
              padding: 20,
              opacity: chain2,
              transform: `scale(${interpolate(chain2, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{
                fontSize: 42,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                2️⃣
              </div>
              <div style={{
                fontSize: 20,
                color: tokens.color.text,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                顾客能验证
              </div>
            </div>

            <div style={{
              fontSize: 36,
              color: tokens.color.muted,
              opacity: chain2,
            }}>
              →
            </div>

            {/* 链路3 */}
            <div style={{
              flex: 1,
              maxWidth: 280,
              background: tokens.color.surface2,
              border: `2px solid ${tokens.color.success}`,
              borderRadius: 16,
              padding: 20,
              opacity: chain3,
              transform: `scale(${interpolate(chain3, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{
                fontSize: 42,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                3️⃣
              </div>
              <div style={{
                fontSize: 20,
                color: tokens.color.success,
                textAlign: 'center',
                lineHeight: 1.5,
                fontWeight: 600,
              }}>
                愿意支付溢价
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 最终判断 */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 112,
        right: 112,
        opacity: finalOpacity,
      }}>
        <div style={{
          fontSize: tokens.fontSize.body,
          color: tokens.color.text,
          lineHeight: 1.6,
          textAlign: 'center',
          background: tokens.color.surface1,
          border: `2px solid ${tokens.color.accent}`,
          borderRadius: 16,
          padding: 32,
        }}>
          <span style={{color: tokens.color.accent, fontWeight: 600}}>
            好品质不会自动变成好生意
          </span>
          <br />
          只有顾客看得见、信得过、愿意再来，它才是竞争力
        </div>
      </div>
    </AbsoluteFill>
  );
}
