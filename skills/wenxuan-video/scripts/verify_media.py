import argparse,pathlib,subprocess,json,hashlib
p=argparse.ArgumentParser();p.add_argument('file',type=pathlib.Path);p.add_argument('--width',type=int,required=True);p.add_argument('--height',type=int,required=True);p.add_argument('--fps',type=float,required=True);p.add_argument('--duration',type=float,required=True);p.add_argument('--require-audio',action='store_true');a=p.parse_args()
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
m=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(a.file)]).stdout)
v=next(s for s in m['streams'] if s['codec_type']=='video');num,den=map(int,v['r_frame_rate'].split('/'));duration=float(m['format']['duration']);audio=any(s['codec_type']=='audio' for s in m['streams'])
assert (v['width'],v['height'])==(a.width,a.height);assert abs(num/den-a.fps)<.01;assert abs(duration-a.duration)<=max(.15,2/a.fps)
if a.require_audio:assert audio,'audio track missing'
run(['ffmpeg','-v','error','-i',str(a.file),'-f','null','-'])
if audio:
    loud=run(['ffmpeg','-hide_banner','-i',str(a.file),'-vn','-af','ebur128=peak=true','-f','null','-'])
    a.file.with_suffix('.audio-measurement.txt').write_text(loud.stderr,encoding='utf-8')
print(f'MEDIA_PASS {a.width}x{a.height} fps={num/den:g} duration={duration:.3f}s audio={audio} decode_errors=0 sha256={hashlib.sha256(a.file.read_bytes()).hexdigest()}')
