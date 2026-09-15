import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// loadFont registers a render wait and rejects failed font loads.
export const fontsReady = Promise.all([
  loadFont({family: 'Studio Han', url: staticFile('fonts/NotoSansSC.ttf'), weight: '100 900'}),
  loadFont({family: 'Studio Mono', url: staticFile('fonts/mono.woff2'), weight: '400'}),
]);
