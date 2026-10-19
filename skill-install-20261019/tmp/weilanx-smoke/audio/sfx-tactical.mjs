// 战术屏科普风（FPS 科普）的合成音效：每期调用一次 makeTacticalSfx(ep)，写进 public/audio/<ep>/。
// 峰值都压到约 −6 dBFS，叠在 −16 LUFS 的配乐上不爆。用法见 .claude/skills/weilanx-creator-fps-video/references/卡点与音效.md
//   gunshot 枪声、crack 玻璃裂纹（死亡红屏）、rewind 倒带、riser 爆点前 2 秒的上升、impact 低沉冲击、chapter 章节卡「咚」、tick UI 嘀
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const TACTICAL_SFX = ['gunshot', 'crack', 'rewind', 'riser', 'impact', 'chapter', 'tick'];

export function makeTacticalSfx(ep) {
  const dir = join(root, 'public', 'audio', ep);
  mkdirSync(dir, {recursive: true});
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const out = (name) => join(dir, `${name}.wav`);
  // 统一收尾：限幅到 −6 dBFS 峰值、转立体声
  const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';

  // 枪声：白噪声瞬态（高通，快速衰减）+ 低频冲击（90→45 Hz）
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=white:amplitude=1:d=0.45:r=48000',
    '-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-18*t)*sin(2*PI*(90*t-50*t*t))':s=48000:d=0.45",
    '-filter_complex', `[0]highpass=f=900,volume='exp(-28*t)':eval=frame,volume=0.9[n];[1]volume=1[l];[n][l]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('gunshot'),
  ]);
  // 玻璃裂纹：带通噪声（注意 width_type=h，默认按 Q 值算会几乎没声）的几次碎裂 + 尾巴
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=white:amplitude=1:d=0.9:r=48000',
    '-af', `bandpass=f=4200:width_type=h:w=3000,volume='(exp(-9*t)+0.6*exp(-14*abs(t-0.07))+0.4*exp(-16*abs(t-0.16)))':eval=frame,${tail}`,
    out('crack'),
  ]);
  // 倒带：下滑正弦（带颤音）+ 一点高频噪声，1.3 秒
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.5*sin(2*PI*(900*t-280*t*t))*(0.6+0.4*sin(2*PI*22*t))*min(1,t*12)*max(0,1-t/1.3)':s=48000:d=1.3",
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.2:d=1.3:r=48000',
    '-filter_complex', `[1]highpass=f=2000,volume='max(0,1-t/1.3)':eval=frame[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('rewind'),
  ]);
  // 上升：粉噪声越来越响越亮，2 秒，最后 0.1 秒切掉（重拍那一下更空）；表达式里比较要用 lt()，不能写 <
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=1:d=2:r=48000',
    '-f', 'lavfi', '-i', "aevalsrc='0.35*sin(2*PI*(220*t+110*t*t))*pow(t/2,2)':s=48000:d=2",
    '-filter_complex', `[0]highpass=f=300,lowpass=f=6000,volume='pow(t/2,2.2)*lt(t,1.9)':eval=frame,volume=0.7[n];[1]volume='lt(t,1.9)':eval=frame[s];[n][s]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('riser'),
  ]);
  // 低沉冲击：下滑低频正弦（70→35 Hz）+ 低通褐噪声，衰减 1.6 秒
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))':s=48000:d=1.6",
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.6:d=1.6:r=48000',
    '-filter_complex', `[1]lowpass=f=180,afade=t=out:st=0:d=0.9,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('impact'),
  ]);
  // 章节卡：短促的「咚」+ 高频亮片
  ff(['-f', 'lavfi', '-i', "aevalsrc='0.8*exp(-12*t)*sin(2*PI*110*t)+0.25*exp(-20*t)*sin(2*PI*1760*t)':s=48000:d=0.5", '-af', tail, out('chapter')]);
  // UI 嘀：2 kHz 正弦 40 ms
  ff(['-f', 'lavfi', '-i', "aevalsrc='0.7*exp(-60*t)*sin(2*PI*2000*t)':s=48000:d=0.08", '-af', tail, out('tick')]);
  console.log(`wrote ${ep}/ ${TACTICAL_SFX.join(' ')}`);
}

// 脚步声（听声辨位类选题用）：低频「咚」+ 鞋底摩擦的带通噪声，0.22 秒。
//   footstep 两耳一样（正中）；footstep-r 偏右：左耳晚 0.6 毫秒、轻 9 dB，就是真实的两耳时间差 + 音量差
export function makeFootstepSfx(ep) {
  const dir = join(root, 'public', 'audio', ep);
  mkdirSync(dir, {recursive: true});
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const out = (name) => join(dir, `${name}.wav`);
  const src = [
    '-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-38*t)*sin(2*PI*(95*t-60*t*t))':s=48000:d=0.22",
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=1:d=0.22:r=48000:seed=7',
  ];
  const mix = `[1]bandpass=f=1800:width_type=h:w=2400,volume='exp(-30*t)+0.5*exp(-60*abs(t-0.05))':eval=frame,volume=0.7[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.5:level=disabled`;
  ff([...src, '-filter_complex', `${mix},pan=stereo|c0=c0|c1=c0[o]`, '-map', '[o]', out('footstep')]);
  ff([...src, '-filter_complex', `${mix},pan=stereo|c0=0.35*c0|c1=c0,adelay=29S|0[o]`, '-map', '[o]', out('footstep-r')]);
  console.log(`wrote ${ep}/ footstep footstep-r`);
}
