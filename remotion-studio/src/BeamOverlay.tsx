import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {VideoSpec} from './spec';
import {AnimatedBeam} from './components/AnimatedBeam';
import {color, progress} from './tokens';

export function BeamOverlay(spec: VideoSpec) {
  const {width, height, fps} = useVideoConfig();
  const seconds = useCurrentFrame() / fps;
  const vertical = spec.format === 'portrait';
  return <AbsoluteFill style={{background: spec.outputBackground === 'opaque' ? color.bg : 'transparent'}}>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{opacity: 1 - progress(seconds, 2.45, 0.5)}}>
      {spec.tools.map((tool, i) => <AnimatedBeam key={tool.id} vertical={vertical} seconds={seconds} start={0.2 + i * 0.12}
        from={vertical ? {x: width * (0.2 + i * 0.6 / Math.max(1, spec.tools.length - 1)), y: height * 0.28} : {x: width * 0.2, y: height * (0.3 + i * 0.4 / Math.max(1, spec.tools.length - 1))}}
        to={vertical ? {x: width * 0.5, y: height * 0.72} : {x: width * 0.8, y: height * 0.5}}/>)}
    </svg>
  </AbsoluteFill>;
}
