"""Conservative mixed-track polish. No source separation or added SFX."""
import hashlib, json, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
FILTER = 'bass=g=-1.5:f=140:w=0.7,equalizer=f=6000:t=o:w=1:g=-2,acompressor=threshold=0.5:ratio=1.2:attack=10:release=180:makeup=1,volume=0.95,alimiter=limit=0.92:level=false:latency=true'
def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(r.stderr)
    return r
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
before = ROOT/'renders/silk-road-recreated.mp4'
audio = ROOT/'public/reference-audio-refined.m4a'
after = ROOT/'renders/silk-road-refined.mp4'
run(['ffmpeg','-v','error','-y','-i',str(ROOT/'public/reference-audio.m4a'),'-af',FILTER,'-c:a','aac','-b:a','192k',str(audio)])
run(['ffmpeg','-v','error','-y','-i',str(before),'-i',str(audio),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','copy','-t','116.1','-movflags','+faststart',str(after)])
def video_digest(p):
    return run(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-']).stdout.strip()
v0,v1=video_digest(before),video_digest(after)
assert v0==v1,(v0,v1)
record={'filter':FILTER,'baseline':str(before),'modified':str(after),'baselineSha256':sha(before),'modifiedSha256':sha(after),'videoStreamHash':v1,'videoStreamUnchanged':True,'addedSfx':0,'separatedStems':False}
(ROOT/'evidence/audio-refinement.json').write_text(json.dumps(record,indent=2,ensure_ascii=False),encoding='utf-8')
for kind,path in [('before',ROOT/'public/reference-audio.m4a'),('after',audio)]:
    run(['ffmpeg','-v','error','-y','-ss','44','-i',str(path),'-t','12','-c:a','libmp3lame','-b:a','192k',str(ROOT/f'evidence/audio-{kind}-12s.mp3')])
print('REFINE_PASS video_stream_identical=yes added_sfx=0 mixed_track_eq_and_compression=yes')
print('MODIFIED_SHA256 '+record['modifiedSha256'])
