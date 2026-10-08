import {Composition} from 'remotion';
import {SilkRoad} from './SilkRoad';
export const Root = () => <Composition id="SilkRoadRebuild" component={SilkRoad} width={1280} height={720} fps={30} durationInFrames={3483} defaultProps={{audio:true,subtitles:true,grain:true}} />;
