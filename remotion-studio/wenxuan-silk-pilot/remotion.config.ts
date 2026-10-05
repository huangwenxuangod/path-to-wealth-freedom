import {Config} from '@remotion/cli/config';
Config.setRspack(true);
Config.setBrowserExecutable(process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe');
Config.setVideoImageFormat('jpeg');
