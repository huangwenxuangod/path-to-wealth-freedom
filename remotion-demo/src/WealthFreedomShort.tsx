import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from 'remotion';
import type {Scene, VideoContent} from './content';
import './style.css';

type Props = {
  content: VideoContent;
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const getScene = (scenes: Scene[], frame: number) => {
  return scenes.find((scene) => frame >= scene.start && frame < scene.start + scene.duration) ?? null;
};

const Background = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 1350], [0, -260], clamp);

  return (
    <AbsoluteFill className="backgroundPlate">
      <div className="mesh meshOne" style={{transform: `translateY(${drift}px)`}} />
      <div className="mesh meshTwo" style={{transform: `translateY(${-drift * 0.65}px)`}} />
      <div className="grain" />
      <div className="grid" />
    </AbsoluteFill>
  );
};

const TalkingHead = ({videoPath}: {videoPath: string | null}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const scale = interpolate(enter, [0, 1], [1.04, 1], clamp);

  return (
    <AbsoluteFill className="videoLayer" style={{transform: `scale(${scale})`}}>
      <div className="scanLine" />
      {videoPath ? (
        <Video className="talkingVideo" src={staticFile(videoPath)} />
      ) : (
        <div className="videoPlaceholder">
          <div className="lens" />
          <div>
            <p>真人口播视频位</p>
            <span>public/talking-head.mp4</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Hook = ({content}: Props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const opacity = interpolate(frame, [0, 18, 96, 118], [0, 1, 1, 0], clamp);

  return (
    <div className="hook overlayPanel" style={{opacity, transform: `translateY(${(1 - pop) * 80}px)`}}>
      <div className="eyebrow">{content.positioning}</div>
      <h1>{content.hook}</h1>
      <p>{content.thesis}</p>
    </div>
  );
};

const SceneCard = ({scene}: {scene: Scene | null}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!scene) {
    return null;
  }

  const localFrame = frame - scene.start;
  const enter = spring({frame: Math.max(0, localFrame), fps, config: {damping: 20}});
  const y = interpolate(enter, [0, 1], [80, 0], clamp);
  const opacity = interpolate(localFrame, [0, 22, scene.duration - 40, scene.duration], [0, 1, 1, 0], clamp);

  return (
    <div className="sceneCard overlayPanel" style={{opacity, transform: `translateY(${y}px)`}}>
      <div className="sceneLabel">{scene.label}</div>
      <h2>{scene.title}</h2>
      <p>{scene.caption}</p>
      <div className="keywordRow">
        {scene.keywords.map((keyword, index) => (
          <span
            className="keyword"
            key={keyword}
            style={{
              opacity: interpolate(localFrame, [18 + index * 8, 42 + index * 8], [0, 1], clamp),
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

const Progress = ({content}: Props) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, content.durationInFrames], [0, 100], clamp);

  return (
    <div className="progressWrap">
      <div className="progressMeta">
        <span>{content.creator}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="progressTrack">
        <div className="progressFill" style={{width: `${progress}%`}} />
      </div>
    </div>
  );
};

const Cta = ({content}: Props) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [content.durationInFrames - 150, content.durationInFrames - 78], [0, 1], clamp);
  const y = interpolate(frame, [content.durationInFrames - 150, content.durationInFrames - 78], [60, 0], clamp);

  return (
    <div className="cta" style={{opacity, transform: `translateY(${y}px)`}}>
      <span>{content.positioning}</span>
      <strong>{content.cta}</strong>
    </div>
  );
};

export const WealthFreedomShort = ({content}: Props) => {
  const frame = useCurrentFrame();
  const scene = getScene(content.scenes, frame);

  return (
    <AbsoluteFill className={`stage face-${content.faceSafeZone}`}>
      <Background />
      <TalkingHead videoPath={content.videoPath} />
      <div className="shadowMask" />
      <Progress content={content} />
      <Hook content={content} />
      <SceneCard scene={scene} />
      <Cta content={content} />
    </AbsoluteFill>
  );
};
