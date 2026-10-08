import {AbsoluteFill, interpolate} from 'remotion';
import {tokens} from '../tokens';
import type {HotellingSpec} from '../spec';

export function Scene1_Opening({spec, seconds}: {spec: HotellingSpec; seconds: number}) {
  // 动画进度
  const titleOpacity = interpolate(seconds, [0, 0.8], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(seconds, [0, 0.8], [30, 0], {extrapolateRight: 'clamp'});

  const storeOpacity = interpolate(seconds, [0.5, 1.3], [0, 1], {extrapolateRight: 'clamp'});
  const storeScale = interpolate(seconds, [0.5, 1.3], [0.8, 1], {extrapolateRight: 'clamp'});

  const freezeOpacity = interpolate(seconds, [3.5, 4], [0, 1], {extrapolateRight: 'clamp'});
  const questionOpacity = interpolate(seconds, [4, 4.5], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: tokens.color.bg}}>
      {/* 顶部标题 */}
      <div style={{
        position: 'absolute',
        top: 84,
        left: 112,
        right: 112,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontSize: tokens.fontSize.small,
          color: tokens.color.muted,
          letterSpacing: 3,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: tokens.color.accent,
          }} />
          经济学原理
        </div>
        <h1 style={{
          fontSize: tokens.fontSize.h1,
          fontWeight: 600,
          letterSpacing: -2,
          margin: 0,
          lineHeight: 1.2,
        }}>
          {spec.title}
        </h1>
      </div>

      {/* 中心场景：两个店铺 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${storeScale})`,
        opacity: storeOpacity,
        display: 'flex',
        gap: 48,
        alignItems: 'center',
      }}>
        {/* 老店 */}
        <div style={{
          width: 320,
          height: 240,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.line}`,
          borderRadius: 24,
          padding: 32,
          position: 'relative',
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {spec.originalStore.name}
          </div>
          <div style={{
            fontSize: 24,
            color: tokens.color.muted,
            marginBottom: 24,
          }}>
            {spec.originalStore.principle}
          </div>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: tokens.color.success,
          }}>
            ¥{spec.originalStore.price}
          </div>

          {/* "规矩"标牌 */}
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            background: tokens.color.success,
            color: tokens.color.bg,
            padding: '8px 16px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            transform: `rotate(12deg)`,
          }}>
            规矩已立
          </div>
        </div>

        {/* 箭头 */}
        <div style={{
          fontSize: 64,
          color: tokens.color.muted,
          opacity: interpolate(seconds, [2, 2.5], [0, 1], {extrapolateRight: 'clamp'}),
        }}>
          →
        </div>

        {/* 新店（突然出现） */}
        <div style={{
          width: 320,
          height: 240,
          background: tokens.color.surface2,
          border: `2px solid ${tokens.color.accent}`,
          borderRadius: 24,
          padding: 32,
          position: 'relative',
          opacity: interpolate(seconds, [2.5, 3], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `scale(${interpolate(seconds, [2.5, 3], [0.5, 1], {extrapolateRight: 'clamp'})})`,
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {spec.newStore.name}
          </div>
          <div style={{
            fontSize: 24,
            color: tokens.color.muted,
            marginBottom: 24,
          }}>
            同样的小吃
          </div>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: tokens.color.accent,
          }}>
            ¥{spec.newStore.price}
          </div>

          {/* "降价"标牌 */}
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            background: tokens.color.accent,
            color: tokens.color.text,
            padding: '8px 16px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            transform: `rotate(-12deg)`,
          }}>
            {spec.newStore.strategy}
          </div>
        </div>
      </div>

      {/* 冻结效果 */}
      {seconds >= 3.5 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `${tokens.color.bg}20`,
          backdropFilter: 'blur(4px)',
          opacity: freezeOpacity,
        }} />
      )}

      {/* 底部问题 */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 112,
        right: 112,
        textAlign: 'center',
        opacity: questionOpacity,
      }}>
        <div style={{
          fontSize: tokens.fontSize.h3,
          fontWeight: 600,
          color: tokens.color.accent,
          lineHeight: 1.4,
        }}>
          隔壁不是随机刷新的<br/>
          <span style={{color: tokens.color.text}}>是谁把他吸引过来的？</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
