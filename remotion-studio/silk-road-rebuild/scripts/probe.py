import sys, json, pathlib, hashlib, subprocess
mode,path=sys.argv[1:3]
p=pathlib.Path(path)
r=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height,r_frame_rate','-of','json',str(p)],capture_output=True,text=True)
assert r.returncode==0,r.stderr
d=json.loads(r.stdout);v=next(s for s in d['streams'] if s['codec_type']=='video');a=any(s['codec_type']=='audio' for s in d['streams'])
assert (v['width'],v['height'],v['r_frame_rate'])==(1280,720,'30/1')
assert abs(float(d['format']['duration'])-116.1)<.1 and a
print(f'{mode}_PASS 1280x720 30fps {float(d["format"]["duration"]):.3f}s audio=yes sha256={hashlib.sha256(p.read_bytes()).hexdigest()}')
