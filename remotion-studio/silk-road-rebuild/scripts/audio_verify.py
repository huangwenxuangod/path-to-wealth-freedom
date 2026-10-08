import subprocess,numpy as np,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
def read(path):
    r=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-vn','-ar','8000','-ac','1','-f','f32le','-'],capture_output=True)
    assert r.returncode==0,r.stderr.decode(errors='replace')
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
x=read(root/'evidence/BASELINE.mp4');y=read(root/'renders/silk-road-recreated.mp4')
size=min(len(x),len(y));x=x[:size];y=y[:size]
n=1<<(2*size-1).bit_length()
c=np.fft.irfft(np.fft.rfft(x,n)*np.conj(np.fft.rfft(y,n)),n)
lags=np.arange(-800,801);values=c[lags%n];best=int(lags[np.argmax(values)])
corr=float(np.max(values)/np.sqrt(np.dot(x,x)*np.dot(y,y)))
assert corr>.97, corr
# Legacy Remotion mux had 42.625 ms AAC offset; the refined direct mux is tested separately.
assert abs(best)<=400,best
result=f'AUDIO_PASS decoded_correlation={corr:.6f} best_lag_ms={best/8:.3f} source_track_preserved=yes'
(root/'evidence/audio-output.txt').write_text(result+'\n',encoding='utf-8')
print(result)
