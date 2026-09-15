/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import {configureBundler} from './bundler';

Config.setRspack(true);
Config.setBrowserExecutable(process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
Config.setVideoImageFormat("png");
Config.overrideBundlerConfig(configureBundler);
