// ep25 躲进掩体，为什么还被打死？配乐来自音乐库 we-never，从第 0 秒开始（片长约 137.5 秒，结尾 2 秒淡出），
// 无口播，配乐是主音轨，响度 −16 LUFS → public/audio/ep25-behind-cover/bgm.wav；音效用战术屏科普风的合成音效包
import {cutMusic} from '../music.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';

const EP = 'ep25-behind-cover';
// 与 timeline.ts 的 DURATION 一致：第 256 拍 + 1 秒
const BAR = (102.52 - 17.45) / 40;
const DURATION = Math.round((17.45 - 8 * BAR + (BAR / 4) * 256 + 1) * 30) / 30;

if (cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) makeTacticalSfx(EP);
