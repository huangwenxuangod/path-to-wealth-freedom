import {Composition} from 'remotion';
import {SilkRoad} from './SilkRoad';
export const Root = () => <Composition id="WenxuanSilkPilot" component={SilkRoad} width={1280} height={720} fps={30} durationInFrames={615} defaultProps={{audio:true,subtitles:true,grain:true,startAt:44}} />;
