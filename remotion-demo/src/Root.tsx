import {Composition} from 'remotion';
import {WealthFreedomShort} from './WealthFreedomShort';
import {demoContent} from './content';

export const Root = () => {
  return (
    <Composition
      id="WealthFreedomShort"
      component={WealthFreedomShort}
      durationInFrames={demoContent.durationInFrames}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        content: demoContent,
      }}
    />
  );
};
