// ep23 棋盘上的麦粒：配乐来自音乐库 we-never，从第 0 秒开始（片长 33.5 秒，结尾 2 秒淡出），
// 没有人声，配乐就是主音轨，响度定在 −16 LUFS → public/audio/ep23-wheat-chessboard/bgm.wav
// 另外生成两个本期专用音效：impact.wav（重拍上的低沉冲击）、room.wav（很轻的纸页 / 室内底噪）
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';

const EP = 'ep23-wheat-chessboard';
if (cutMusic({track: 'we-never', start: 0, duration: 33.5, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  // 低沉冲击：下滑的低频正弦（70→35 Hz）+ 一点褐噪声的「轰」，指数衰减 1.6 秒
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.55*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))|0.55*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))':s=48000:d=1.6",
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.5:d=1.6:r=48000',
    '-filter_complex', '[1]lowpass=f=180,afade=t=out:st=0:d=0.9,volume=0.6,pan=stereo|c0=c0|c1=c0[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.6,volume=0.5[o]',
    '-map', '[o]', join(dir, 'impact.wav'),
  ]);
  // 底噪：粉噪声过低通，压得很轻，整片循环
  ff(['-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.05:d=33.5:r=48000', '-af', 'lowpass=f=900,highpass=f=80,afade=t=in:d=1,afade=t=out:st=31.5:d=2,pan=stereo|c0=c0|c1=c0', join(dir, 'room.wav')]);
  console.log(`wrote ${EP}/impact.wav, room.wav`);
}
