// ep38 蝴蝶效应：配乐来自音乐库 we-never，从第 0 秒开始（片长约 137.5 秒，结尾 2 秒淡出），
// 没有人声，配乐是主音轨，−16 LUFS → public/audio/ep38-butterfly/bgm.wav。
// 本期音效：flap 扇翅（两下带通噪声「扑簌」）、wind 风声涌起、drop「127」掉下去的下滑音、chime 轻铃、impact 低沉冲击、room 极轻的底噪；
// 爆点前 2 秒的 riser 和预报日卡的 tick 借战术屏音效包。峰值都压到约 −6 dBFS。
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';

const EP = 'ep38-butterfly';
// 与 timeline.ts 的 DURATION 一致：第 256 拍 + 1 秒
const BAR = (102.52 - 17.45) / 40;
const DURATION = Math.round((17.45 - 8 * BAR + (BAR / 4) * 256 + 1) * 30) / 30;

if (cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  makeTacticalSfx(EP);
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';
  // 扇翅：白噪声带通到 1.5–5 kHz，两下快速包络（0 和 0.09 秒），像翅膀扑簌
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=white:amplitude=0.9:d=0.5:r=48000',
    '-af', `bandpass=f=2800:width_type=h:w=3200,volume='if(lt(t,0.09),exp(-30*t),1.1*exp(-26*(t-0.09)))':eval=frame,afade=t=out:st=0.3:d=0.2,${tail}`,
    join(dir, 'flap.wav'),
  ]);
  // 风：褐噪声低通，2.2 秒涌起再落下
  ff(['-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.9:d=2.2:r=48000', '-af', `lowpass=f=700,highpass=f=60,afade=t=in:d=0.9,afade=t=out:st=1.1:d=1.1,${tail}`, join(dir, 'wind.wav')]);
  // 掉落：1200 Hz 往 300 Hz 滑下去的短音
  ff(['-f', 'lavfi', '-i', "aevalsrc='0.8*exp(-4*t)*sin(2*PI*(1200*t-1100*t*t))':s=48000:d=0.6", '-af', tail, join(dir, 'drop.wav')]);
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
  console.log(`wrote ${EP}/flap wind drop chime impact room`);
}
