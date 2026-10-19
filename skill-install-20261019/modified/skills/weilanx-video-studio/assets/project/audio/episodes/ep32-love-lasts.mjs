// ep32 热恋会过期，但爱不会：配乐来自音乐库 we-never，从第 0 秒开始（片长约 137.5 秒，结尾 2 秒淡出），
// 没有人声，配乐是主音轨，−16 LUFS → public/audio/ep32-love-lasts/bgm.wav。
// 本期音效：heartbeat 心跳（扑通两下）、chime 轻铃（金色光点亮起）、impact 低沉冲击、room 极轻的底噪；
// 爆点前 2 秒的上升 riser 借战术屏音效包。峰值都压到约 −6 dBFS。
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';

const EP = 'ep32-love-lasts';
// 与 timeline.ts 的 DURATION 一致：第 256 拍 + 1 秒
const BAR = (102.52 - 17.45) / 40;
const DURATION = Math.round((17.45 - 8 * BAR + (BAR / 4) * 256 + 1) * 30) / 30;

if (cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  makeTacticalSfx(EP);
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';
  // 心跳：两下低频「扑通」（0 秒和 0.2 秒），第二下轻一点
  const thump = (t0, a) => `${a}*exp(-22*max(0,t-${t0}))*sin(2*PI*(58*(t-${t0})-30*(t-${t0})*(t-${t0})))*gte(t,${t0})`;
  ff(['-f', 'lavfi', '-i', `aevalsrc='${thump(0, 1)}+${thump(0.2, 0.7)}':s=48000:d=0.7`, '-af', `lowpass=f=300,${tail}`, join(dir, 'heartbeat.wav')]);
  // 轻铃：两个纯正弦泛音，长尾，比驿铃柔
  ff(['-f', 'lavfi', '-i', "aevalsrc='exp(-3.5*t)*(0.6*sin(2*PI*1046*t)+0.25*sin(2*PI*2093*t)+0.12*sin(2*PI*3140*t))':s=48000:d=1.4", '-af', tail, join(dir, 'chime.wav')]);
  // 低沉冲击（照 ep24）：下滑的低频正弦 + 一点褐噪声，指数衰减 1.6 秒
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))':s=48000:d=1.6",
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.5:d=1.6:r=48000',
    '-filter_complex', `[1]lowpass=f=180,afade=t=out:st=0:d=0.9,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', join(dir, 'impact.wav'),
  ]);
  // 底噪：粉噪声过低通，压得很轻，整片
  ff(['-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.05:d=${DURATION}:r=48000`, '-af', `lowpass=f=900,highpass=f=80,afade=t=in:d=1,afade=t=out:st=${DURATION - 2}:d=2,pan=stereo|c0=c0|c1=c0`, join(dir, 'room.wav')]);
  console.log(`wrote ${EP}/heartbeat chime impact room`);
}
