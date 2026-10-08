import {Composition} from 'remotion';
import spec from '../data/storyboard.json';
import {KnowledgeVideo} from './KnowledgeVideo';
export const Root=()=> <Composition id="KnowledgeVideo" component={KnowledgeVideo} width={spec.width} height={spec.height} fps={spec.fps} durationInFrames={Math.round(spec.duration*spec.fps)}/>;
