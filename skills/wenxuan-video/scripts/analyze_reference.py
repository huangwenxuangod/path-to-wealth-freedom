"""Metadata, evenly sampled frames, scene candidates, contact sheets and audio."""
import argparse,hashlib,json,pathlib,subprocess,math
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('input',type=pathlib.Path);p.add_argument('--out',type=pathlib.Path,required=True);p.add_argument('--interval',type=float,default=4);a=p.parse_args()
if not a.input.is_file():p.error('input file does not exist')
if a.interval<=0:p.error('interval must be positive')
a.out.mkdir(parents=True,exist_ok=True);frames=a.out/'frames';frames.mkdir(exist_ok=True)
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
meta=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(a.input)]).stdout)
duration=float(meta['format']['duration']);times=[round(i*a.interval,3) for i in range(math.ceil(duration/a.interval))]
if duration-times[-1]>.5:times.append(round(max(0,duration-.2),3))
meta['inputSha256']=hashlib.sha256(a.input.read_bytes()).hexdigest();meta['sampleTimes']=times
(a.out/'metadata.json').write_text(json.dumps(meta,indent=2,ensure_ascii=False),encoding='utf-8')
for i,t in enumerate(times):run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(a.input),'-frames:v','1','-vf','scale=640:-2',str(frames/f'{i:03d}-{t:.3f}s.jpg')])
for page in range(math.ceil(len(times)/16)):
    sheet=Image.new('RGB',(1280,4*204),'#101010');d=ImageDraw.Draw(sheet)
    for n,i in enumerate(range(page*16,min(len(times),(page+1)*16))):
        im=Image.open(frames/f'{i:03d}-{times[i]:.3f}s.jpg');im.thumbnail((320,180));x=(n%4)*320;y=(n//4)*204;sheet.paste(im,(x,y));d.text((x+5,y+184),f'{times[i]:.3f}s',fill='white')
    sheet.save(a.out/f'contact-{page+1:02d}.jpg',quality=91)
scene=run(['ffmpeg','-hide_banner','-i',str(a.input),'-vf',"select='gt(scene,0.25)',showinfo",'-an','-f','null','-'])
(a.out/'scene-candidates.log').write_text(scene.stderr,encoding='utf-8')
audio=any(s['codec_type']=='audio' for s in meta['streams'])
if audio:run(['ffmpeg','-v','error','-y','-i',str(a.input),'-vn','-c:a','pcm_s16le',str(a.out/'reference-audio.wav')])
print(f'ANALYZE_PASS samples={len(times)} duration={duration:.3f}s audio={audio} source_unchanged=yes')
