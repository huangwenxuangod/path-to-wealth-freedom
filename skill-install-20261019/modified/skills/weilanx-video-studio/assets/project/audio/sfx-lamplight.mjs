// 灯火史话风（古代题材）的合成音效：每期调用一次 makeLamplightSfx(ep)，写进 public/audio/<ep>/。
// 峰值都压到约 −6 dBFS，叠在 −16 LUFS 的配乐上不爆。
//   hoof 一组马蹄（四下）、drum 低沉的大鼓、ignite 点火「呼」一声带噼啪、bell 驿铃（短促铜铃）、clink 瓷碗轻碰（叠碗、上菜）
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const LAMPLIGHT_SFX = ['hoof', 'drum', 'ignite', 'bell', 'clink'];

export function makeLamplightSfx(ep) {
  const dir = join(root, 'public', 'audio', ep);
  mkdirSync(dir, {recursive: true});
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const out = (name) => join(dir, `${name}.wav`);
  const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';

  // 马蹄：四下短促的低频敲击（0 / 0.09 / 0.24 / 0.33 秒）+ 一点土声噪声
  const hit = (t0, a) => `${a}*exp(-55*max(0,t-${t0}))*sin(2*PI*140*(t-${t0}))*gte(t,${t0})`;
  ff([
    '-f', 'lavfi', '-i', `aevalsrc='${hit(0, 0.9)}+${hit(0.09, 0.7)}+${hit(0.24, 0.85)}+${hit(0.33, 0.6)}':s=48000:d=0.55`,
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.6:d=0.55:r=48000',
    '-filter_complex', `[1]lowpass=f=900,volume='0.5*(exp(-40*t)+exp(-40*abs(t-0.24)))':eval=frame[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('hoof'),
  ]);
  // 大鼓：70→45 Hz 下滑正弦，慢衰减，加一点击面的噪声
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='exp(-5*t)*sin(2*PI*(72*t-14*t*t))':s=48000:d=1.2",
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.8:d=1.2:r=48000',
    '-filter_complex', `[1]lowpass=f=1500,volume='exp(-30*t)':eval=frame,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('drum'),
  ]);
  // 点火：粉噪声带通扫高、0.15 秒冲起后慢慢落，再撒几下噼啪
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=1:d=1.1:r=48000',
    '-f', 'lavfi', '-i', 'anoisesrc=color=white:amplitude=1:d=1.1:r=48000',
    '-filter_complex',
    `[0]bandpass=f=700:width_type=h:w=900,volume='min(1,t*7)*exp(-2.6*t)':eval=frame[a];[1]highpass=f=3000,volume='0.8*(exp(-60*abs(t-0.32))+exp(-60*abs(t-0.51))+exp(-60*abs(t-0.77)))':eval=frame[b];[a][b]amix=inputs=2:normalize=0,${tail}[o]`,
    '-map', '[o]', out('ignite'),
  ]);
  // 驿铃：几个不和谐泛音的铜铃，短促
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='exp(-7*t)*(0.6*sin(2*PI*1320*t)+0.35*sin(2*PI*2770*t)+0.2*sin(2*PI*4150*t))+exp(-14*t)*0.3*sin(2*PI*1980*t)':s=48000:d=0.8",
    '-af', tail,
    out('bell'),
  ]);
  // 瓷碗轻碰：几个高频不和谐泛音，衰减极快，前面带一点点噪声的「叮」
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='exp(-28*t)*(0.55*sin(2*PI*2380*t)+0.35*sin(2*PI*3710*t)+0.25*sin(2*PI*5220*t))+exp(-60*t)*0.2*sin(2*PI*1460*t)':s=48000:d=0.45",
    '-af', tail,
    out('clink'),
  ]);
}
