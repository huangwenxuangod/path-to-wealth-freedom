// ep46 宋朝人夏天，已经在喝冰饮了：配乐来自音乐库 we-never，从第 0 秒开始（片长约 137.5 秒，结尾 2 秒淡出），
// 无口播，配乐是主音轨，响度 −16 LUFS → public/audio/ep46-song-ice/bgm.wav；
// 音效：战术屏音效包里的 impact / riser / tick + 灯火史话风的 hoof / drum / ignite / bell / clink
import {cutMusic} from '../music.mjs';
import {makeLamplightSfx} from '../sfx-lamplight.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';

const EP = 'ep46-song-ice';
// 与 timeline.ts 的 DURATION 一致：第 256 拍 + 1 秒
const BAR = (102.52 - 17.45) / 40;
const DURATION = Math.round((17.45 - 8 * BAR + (BAR / 4) * 256 + 1) * 30) / 30;

if (cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  makeTacticalSfx(EP);
  makeLamplightSfx(EP);
}
