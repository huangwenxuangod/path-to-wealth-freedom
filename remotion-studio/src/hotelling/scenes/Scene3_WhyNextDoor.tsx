import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene3_WhyNextDoor({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});

  // 地图出现
  const mapOpacity = interpolate(seconds, [0.5, 1], [0, 1], {extrapolateRight: 'clamp'});

  // 老店位置
  const store1Opacity = interpolate(seconds, [1, 1.5], [0, 1], {extrapolateRight: 'clamp'});

  // 客流区域
  const flowOpacity = interpolate(seconds, [2, 2.5], [0, 0.3], {extrapolateRight: 'clamp'});

  // 新店选址动画 - 先远后近
  const farStoreOpacity = interpolate(seconds, [3, 3.5], [0, 1], {extrapolateRight: 'clamp'});
  const farStoreFade = interpolate(seconds, [4, 4.3], [1, 0], {extrapolateRight: 'clamp'});

  const nearStoreOpacity = interpolate(seconds, [4.5, 5], [0, 1], {extrapolateRight: 'clamp'});

  // 对比框
  const comparisonOpacity = interpolate(seconds, [5.5, 6], [0, 1], {extrapolateRight: 'clamp'});

  // 竞争强度指示器
  const competitionOpacity = interpolate(seconds, [6.5, 7], [0, 1], {extrapolateRight: 'clamp'});

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
          第二层机制 · 霍特林空间竞争
        </div>
        <h2 style={{
          fontSize: tokens.fontSize.h2,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
        }}>
          为什么偏偏开在"隔壁"？
        </h2>
      </div>

      {/* 俯视地图 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '52%',
        transform: 'translate(-50%, -50%)',
        opacity: mapOpacity,
      }}>
        {/* 街道网格 */}
        <svg width="1200" height="500" style={{position: 'absolute', top: 0, left: 0}}>
          {/* 网格线 */}
          {[...Array(6)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 100}
              x2="1200"
              y2={i * 100}
              stroke={tokens.color.line}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {[...Array(13)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 100}
              y1="0"
              x2={i * 100}
              y2="500"
              stroke={tokens.color.line}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
        </svg>

        {/* 老店位置 */}
        <div style={{
          position: 'absolute',
          left: 400,
          top: 200,
          transform: 'translate(-50%, -50%)',
          opacity: store1Opacity,
        }}>
          <div style={{
            width: 120,
            height: 120,
            background: tokens.color.success,
            border: `3px solid ${tokens.color.text}`,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 600,
            position: 'relative',
          }}>
            <div>{spec.originalStore.name}</div>
            <div style={{fontSize: 14, color: tokens.color.bg, marginTop: 4}}>已验证</div>
          </div>
        </div>

        {/* 客流覆盖区域（圆形渐变） */}
        {seconds >= 2 && (
          <div style={{
            position: 'absolute',
            left: 400,
            top: 200,
            width: 400,
            height: 400,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${tokens.color.secondary}40 0%, transparent 70%)`,
            opacity: flowOpacity,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 18,
              color: tokens.color.secondary,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              客流覆盖范围
            </div>
          </div>
        )}

        {/* 客流粒子动画 */}
        {seconds >= 2 && seconds < 5 && (
          <>
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 150;
              const progress = (seconds - 2 + i * 0.1) % 1.5;
              const currentDistance = (1 - progress) * distance;
              const x = 400 + Math.cos(angle) * currentDistance;
              const y = 200 + Math.sin(angle) * currentDistance;
              const opacity = progress < 1 ? (1 - progress) * 0.8 : 0;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: tokens.color.secondary,
                    opacity,
                  }}
                />
              );
            })}
          </>
        )}

        {/* 新店选址方案1：远离 */}
        {seconds >= 3 && seconds < 4.3 && (
          <div style={{
            position: 'absolute',
            left: 900,
            top: 400,
            transform: 'translate(-50%, -50%)',
            opacity: farStoreOpacity * farStoreFade,
          }}>
            <div style={{
              width: 120,
              height: 120,
              background: tokens.color.surface3,
              border: `3px dashed ${tokens.color.muted}`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 20,
              fontWeight: 600,
              position: 'relative',
            }}>
              <div style={{fontSize: 16, color: tokens.color.muted}}>方案A</div>
              <div style={{fontSize: 14, marginTop: 8, color: tokens.color.muted}}>远离老店</div>
            </div>

            {/* X标记 */}
            {seconds >= 3.8 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 80,
                color: tokens.color.accent,
                fontWeight: 700,
              }}>
                ✕
              </div>
            )}
          </div>
        )}

        {/* 新店选址方案2：隔壁 */}
        {seconds >= 4.5 && (
          <div style={{
            position: 'absolute',
            left: 550,
            top: 200,
            transform: 'translate(-50%, -50%)',
            opacity: nearStoreOpacity,
          }}>
            <div style={{
              width: 120,
              height: 120,
              background: tokens.color.accent,
              border: `3px solid ${tokens.color.text}`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 20,
              fontWeight: 600,
              position: 'relative',
            }}>
              <div>{spec.newStore.name}</div>
              <div style={{fontSize: 14, color: tokens.color.text, marginTop: 4}}>新店</div>
            </div>
          </div>
        )}

        {/* 连接线 */}
        {seconds >= 4.8 && (
          <svg width="1200" height="500" style={{position: 'absolute', top: 0, left: 0}}>
            <line
              x1="460"
              y1="200"
              x2="490"
              y2="200"
              stroke={tokens.color.accent}
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          </svg>
        )}
      </div>

      {/* 对比框 */}
      {seconds >= 5.5 && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: 112,
          right: 112,
          opacity: comparisonOpacity,
          display: 'flex',
          gap: 32,
        }}>
          {/* 远离方案 */}
          <div style={{
            flex: 1,
            background: tokens.color.surface2,
            border: `2px solid ${tokens.color.line}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <div style={{fontSize: 24, fontWeight: 600, marginBottom: 12, color: tokens.color.muted}}>
              远离老店
            </div>
            <div style={{fontSize: 18, color: tokens.color.muted, lineHeight: 1.6}}>
              需要从零教育顾客<br/>
              客流获取成本高
            </div>
          </div>

          {/* 隔壁方案 */}
          <div style={{
            flex: 1,
            background: tokens.color.surface2,
            border: `2px solid ${tokens.color.accent}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <div style={{fontSize: 24, fontWeight: 600, marginBottom: 12, color: tokens.color.accent}}>
              紧邻老店 ✓
            </div>
            <div style={{fontSize: 18, color: tokens.color.text, lineHeight: 1.6}}>
              共享客流、降低认知成本<br/>
              <span style={{opacity: competitionOpacity, color: tokens.color.secondary}}>但：竞争更激烈</span>
            </div>
          </div>
        </div>
      )}

      {/* 结论 */}
      {seconds >= 6.5 && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 112,
          right: 112,
          fontSize: 20,
          color: tokens.color.muted,
          textAlign: 'center',
          opacity: competitionOpacity,
        }}>
          新店在权衡：共享客流的收益 vs 贴身竞争的代价
        </div>
      )}
    </AbsoluteFill>
  );
}
