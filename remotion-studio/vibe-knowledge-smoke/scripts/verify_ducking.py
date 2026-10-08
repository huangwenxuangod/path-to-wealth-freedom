import subprocess,pathlib,numpy as np
root=pathlib.Path(__file__).resolve().parent.parent
r=subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/knowledge-audio-diagnostic.mp4'),'-vn','-ar','48000','-ac','1','-f','f32le','-'],capture_output=True,check=True)
y=np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
def amplitude(start,freq):
    v=y[int(start*48000):int((start+.3)*48000)];t=np.arange(len(v))/48000;w=np.hanning(len(v))
    return abs(np.sum(v*w*np.exp(-2j*np.pi*freq*t)))/np.sum(w)
music_ratio=amplitude(1.1,160)/amplitude(2.3,160)
voice_ratio=amplitude(1.1,440)/amplitude(2.3,440)
assert .4<music_ratio<.6,music_ratio
assert .95<voice_ratio<1.05,voice_ratio
result=f'DUCKING_PASS music_ratio={music_ratio:.4f} music_delta_db={20*np.log10(music_ratio):.3f} voice_ratio={voice_ratio:.4f} diagnostic_frequencies=160Hz,440Hz'
(root/'evidence/ducking-output.txt').write_text(result+'\n',encoding='utf-8');print(result)
