import {Composition} from 'remotion';
import {AgentWorkflow} from './AgentWorkflow';
import {BeamOverlay} from './BeamOverlay';
import {metadata, videoSpec} from './spec';
import benchmark from '../data/benchmark.json';
import './index.css';

const defaults = videoSpec.parse(benchmark);
export function Root() {
  return <>
    <Composition id="AgentWorkflow" component={AgentWorkflow} width={1920} height={1080} fps={30} durationInFrames={240} schema={videoSpec} defaultProps={defaults} calculateMetadata={({props}) => metadata(props, 'agent-workflow')}/>
    <Composition id="BeamOverlay" component={BeamOverlay} width={1920} height={1080} fps={30} durationInFrames={90} schema={videoSpec} defaultProps={{...defaults, template: 'beam-overlay', durationSeconds: 3, outputBackground: 'transparent'}} calculateMetadata={({props}) => metadata(props, 'beam-overlay')}/>
  </>;
}
