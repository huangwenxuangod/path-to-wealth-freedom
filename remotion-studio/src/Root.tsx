import {TalkingHeadDesignLab} from './talking-head/TalkingHeadDesignLab';
import {talkingHeadSchema,talkingHeadMetadata} from './talking-head/spec';
import {AstraOverview} from './astra6/AstraOverview';
import {astraSpec,astraMetadata} from './astra6/spec';
import astraData from '../data/astra6.json';
import {Composition} from 'remotion';
import {AgentWorkflow} from './AgentWorkflow';
import {BeamOverlay} from './BeamOverlay';
import {metadata, videoSpec} from './spec';
import benchmark from '../data/benchmark.json';
import './index.css';

const defaults = videoSpec.parse(benchmark);
export function Root() {
  return <>
    <Composition id="TalkingHeadDesignLab" component={TalkingHeadDesignLab} width={1920} height={1080} fps={30} durationInFrames={960} schema={talkingHeadSchema} defaultProps={{"videoSrc":"talking-head/sal-khan-33s.mp4","edited":true,"showSubtitles":true,"showSourceLabel":false,"fullScreenScenes":false,"accent":"#008CFF","background":"#111111","videoOffsetX":0,"videoOffsetY":0,"videoScale":1,"overlayOffsetX":0,"overlayOffsetY":0,"overlayScale":1,"volume":1,"subtitleSize":45,"introTitle":"设好边界","transformationTitle":"正向变革","studentTitle":"私人导师","teacherTitle":"教学助手","scene2Start":9.4,"scene3Start":17.4,"scene4Start":25.7}} calculateMetadata={talkingHeadMetadata}/>
    <Composition id="TalkingHeadOriginal" component={TalkingHeadDesignLab} width={1920} height={1080} fps={30} durationInFrames={960} schema={talkingHeadSchema} defaultProps={{"videoSrc":"talking-head/sal-khan-33s.mp4","edited":false,"showSubtitles":false,"showSourceLabel":true,"fullScreenScenes":false,"accent":"#008CFF","background":"#111111","videoOffsetX":0,"videoOffsetY":0,"videoScale":1,"overlayOffsetX":0,"overlayOffsetY":0,"overlayScale":1,"volume":1,"subtitleSize":42,"introTitle":"设好边界","transformationTitle":"正向变革","studentTitle":"私人导师","teacherTitle":"教学助手","scene2Start":9.4,"scene3Start":17.4,"scene4Start":25.7}} calculateMetadata={talkingHeadMetadata}/>
    <Composition id="AstraOverview" component={AstraOverview} width={1920} height={1080} fps={30} durationInFrames={1080} schema={astraSpec} defaultProps={astraSpec.parse(astraData)} calculateMetadata={({props})=>astraMetadata(props)}/>
    <Composition id="AgentWorkflow" component={AgentWorkflow} width={1920} height={1080} fps={30} durationInFrames={240} schema={videoSpec} defaultProps={defaults} calculateMetadata={({props}) => metadata(props, 'agent-workflow')}/>
    <Composition id="BeamOverlay" component={BeamOverlay} width={1920} height={1080} fps={30} durationInFrames={90} schema={videoSpec} defaultProps={{...defaults, template: 'beam-overlay', durationSeconds: 3, outputBackground: 'transparent'}} calculateMetadata={({props}) => metadata(props, 'beam-overlay')}/>
  </>;
}
