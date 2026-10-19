// ep36 智猪博弈：配乐来自音乐库 we-never，从第 0 秒开始（片长约 137.5 秒，结尾 2 秒淡出），
// 没有人声，配乐是主音轨，−16 LUFS → public/audio/ep36-boxed-pigs/bgm.wav。
// 本期音效：press 拉杆「咔哒」、drop 食粒落槽的一串碎响、run 小碎步、chime 轻铃、impact 低沉冲击、room 极轻的底噪；
// 爆点前 2 秒的上升 riser 借战术屏音效包。峰值都压到约 −6 dBFS。
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';

const EP = 'ep36-boxed-pigs';
// 与 timeline.ts 的 DURATION 一致：第 256 拍 + 1 秒
const BAR = (102.52 - 17.45) / 40;
const DURATION = Math.round((17.45 - 8 * BAR + (BAR / 4) * 256 + 1) * 30) / 30;

if (cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  makeTacticalSfx(EP);
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';
  // 拉杆：一声高频「咔」+ 0.06 秒后一声低一点的金属「哒」
  const click = (t0, fq, a) => `${a}*exp(-60*max(0,t-${t0}))*sin(2*PI*${fq}*(t-${t0}))*gte(t,${t0})`;
  const clunk = (t0) => `0.7*exp(-14*max(0,t-${t0}))*sin(2*PI*(160*(t-${t0})-40*(t-${t0})*(t-${t0})))*gte(t,${t0})`;
  ff(['-f', 'lavfi', '-i', `aevalsrc='${click(0, 2400, 0.8)}+${click(0.06, 1300, 0.6)}+${clunk(0.06)}':s=48000:d=0.6`, '-af', tail, join(dir, 'press.wav')]);
  // 食粒落槽：8 粒小硬物依次落下，频率和间隔错开
  const pellets = Array.from({length: 8}, (_, i) => click((0.035 * i + 0.012 * ((i * 7) % 3)).toFixed(3), 1800 + ((i * 523) % 1700), (0.7 - i * 0.05).toFixed(2))).join('+');
  ff(['-f', 'lavfi', '-i', `aevalsrc='${pellets}':s=48000:d=0.8`, '-af', `highpass=f=600,${tail}`, join(dir, 'drop.wav')]);
  // 小碎步：6 下闷响
  const step = (t0) => `0.8*exp(-40*max(0,t-${t0}))*sin(2*PI*110*(t-${t0}))*gte(t,${t0})`;
  ff(['-f', 'lavfi', '-i', `aevalsrc='${[0, 0.09, 0.18, 0.27, 0.36, 0.45].map(step).join('+')}':s=48000:d=0.8`, '-af', `lowpass=f=600,${tail}`, join(dir, 'run.wav')]);
  // 轻铃
  ff(['-f', 'lavfi', '-i', "aevalsrc='exp(-3.5*t)*(0.6*sin(2*PI*1046*t)+0.25*sin(2*PI*2093*t)+0.12*sin(2*PI*3140*t))':s=48000:d=1.4", '-af', tail, join(dir, 'chime.wav')]);
  // 低沉冲击
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))':s=48000:d=1.6",
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.5:d=1.6:r=48000',
    '-filter_complex', `[1]lowpass=f=180,afade=t=out:st=0:d=0.9,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', join(dir, 'impact.wav'),
  ]);
  // 底噪
  ff(['-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.05:d=${DURATION}:r=48000`, '-af', `lowpass=f=900,highpass=f=80,afade=t=in:d=1,afade=t=out:st=${DURATION - 2}:d=2,pan=stereo|c0=c0|c1=c0`, join(dir, 'room.wav')]);
  console.log(`wrote ${EP}/press drop run chime impact room`);
}
